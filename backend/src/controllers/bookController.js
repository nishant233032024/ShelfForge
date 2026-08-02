const mongoose = require("mongoose");
const { Book, BOOK_STATUS_VALUES } = require("../models/Book");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sanitizeTags = require("../utils/sanitizeTags");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;
const MAX_NOTES_LENGTH = 280;

function parsePagination(query) {
  const currentPage = Math.max(parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const requestedLimit = parseInt(query.limit, 10) || DEFAULT_LIMIT;
  const itemsPerPage = Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);

  return { currentPage, itemsPerPage };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildBookFilter(authenticatedUserId, query) {
  const bookFilter = { userId: authenticatedUserId };

  if (query.status && BOOK_STATUS_VALUES.includes(query.status)) {
    bookFilter.status = query.status;
  }

  if (query.tag && typeof query.tag === "string" && query.tag.trim()) {
    bookFilter.tags = query.tag.trim().toLowerCase();
  }

  if (query.author && typeof query.author === "string" && query.author.trim()) {
    bookFilter.author = new RegExp(`^${escapeRegex(query.author.trim())}$`, "i");
  }

  return bookFilter;
}

function formatBookDocument(bookDocument) {
  return {
    id: bookDocument._id.toString(),
    title: bookDocument.title,
    author: bookDocument.author,
    tags: bookDocument.tags,
    status: bookDocument.status,
    notes: bookDocument.notes || "",
    createdAt: bookDocument.createdAt,
    updatedAt: bookDocument.updatedAt,
  };
}

function sanitizeNotes(notes) {
  if (notes === undefined || notes === null) {
    return "";
  }

  if (typeof notes !== "string") {
    throw new ApiError(400, "Notes must be a string");
  }

  const trimmedNotes = notes.trim();

  if (trimmedNotes.length > MAX_NOTES_LENGTH) {
    throw new ApiError(400, `Notes must be at most ${MAX_NOTES_LENGTH} characters`);
  }

  return trimmedNotes;
}

function validateBookPayload(
  { title, author, status, tags, notes },
  { partial = false } = {}
) {
  if (!partial || title !== undefined) {
    if (!title || title.trim().length < 1 || title.trim().length > 160) {
      throw new ApiError(400, "Title must be between 1 and 160 characters");
    }
  }

  if (!partial || author !== undefined) {
    if (!author || author.trim().length < 1 || author.trim().length > 120) {
      throw new ApiError(400, "Author must be between 1 and 120 characters");
    }
  }

  if (status !== undefined && !BOOK_STATUS_VALUES.includes(status)) {
    throw new ApiError(400, "Status must be want_to_read, reading, or completed");
  }

  if (tags !== undefined && (!Array.isArray(tags) || tags.length > 8)) {
    throw new ApiError(400, "Tags must be an array with at most 8 items");
  }

  if (notes !== undefined) {
    sanitizeNotes(notes);
  }
}

async function findOwnedBookOrThrow(bookId, authenticatedUserId) {
  const ownedBook = await Book.findOne({
    _id: bookId,
    userId: authenticatedUserId,
  });

  if (!ownedBook) {
    throw new ApiError(404, "Book not found");
  }

  return ownedBook;
}

const listBooks = asyncHandler(async (req, res) => {
  const authenticatedUserId = req.currentUser.userId;
  const { currentPage, itemsPerPage } = parsePagination(req.query);
  const bookFilter = buildBookFilter(authenticatedUserId, req.query);

  const skipCount = (currentPage - 1) * itemsPerPage;

  const [paginatedBooks, totalItems] = await Promise.all([
    Book.find(bookFilter)
      .sort({ updatedAt: -1 })
      .skip(skipCount)
      .limit(itemsPerPage),
    Book.countDocuments(bookFilter),
  ]);

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / itemsPerPage);

  res.status(200).json({
    books: paginatedBooks.map(formatBookDocument),
    pagination: {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      hasNextPage: totalPages > 0 && currentPage < totalPages,
      hasPreviousPage: currentPage > 1 && totalPages > 0,
    },
  });
});

const getBookSummary = asyncHandler(async (req, res) => {
  const authenticatedUserId = req.currentUser.userId;
  const userObjectId = mongoose.Types.ObjectId.createFromHexString(authenticatedUserId);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [statusCounts, recentBooks, totalBooks, favoriteAuthors, completedThisMonth] =
    await Promise.all([
      Book.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Book.find({ userId: authenticatedUserId }).sort({ updatedAt: -1 }).limit(5),
      Book.countDocuments({ userId: authenticatedUserId }),
      Book.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: "$author",
            bookCount: { $sum: 1 },
          },
        },
        { $sort: { bookCount: -1, _id: 1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            author: "$_id",
            bookCount: 1,
          },
        },
      ]),
      Book.countDocuments({
        userId: authenticatedUserId,
        status: "completed",
        updatedAt: { $gte: startOfMonth },
      }),
    ]);

  const countsByStatus = {
    want_to_read: 0,
    reading: 0,
    completed: 0,
  };

  statusCounts.forEach((statusCount) => {
    countsByStatus[statusCount._id] = statusCount.count;
  });

  const completionRate =
    totalBooks === 0
      ? 0
      : Math.round((countsByStatus.completed / totalBooks) * 100);

  res.status(200).json({
    bookSummary: {
      totalBooks,
      wantToReadCount: countsByStatus.want_to_read,
      readingCount: countsByStatus.reading,
      completedCount: countsByStatus.completed,
      completedThisMonth,
      completionRate,
    },
    favoriteAuthors,
    recentBooks: recentBooks.map(formatBookDocument),
  });
});

const listApplicableTags = asyncHandler(async (req, res) => {
  const authenticatedUserId = req.currentUser.userId;

  const applicableTags = await Book.distinct("tags", {
    userId: authenticatedUserId,
  });

  const sortedTags = applicableTags
    .filter((tag) => typeof tag === "string" && tag.length > 0)
    .sort((leftTag, rightTag) => leftTag.localeCompare(rightTag));

  res.status(200).json({
    tags: sortedTags,
  });
});

const listApplicableAuthors = asyncHandler(async (req, res) => {
  const authenticatedUserId = req.currentUser.userId;

  const applicableAuthors = await Book.distinct("author", {
    userId: authenticatedUserId,
  });

  const sortedAuthors = applicableAuthors
    .filter((author) => typeof author === "string" && author.trim().length > 0)
    .sort((leftAuthor, rightAuthor) => leftAuthor.localeCompare(rightAuthor));

  res.status(200).json({
    authors: sortedAuthors,
  });
});

const createBook = asyncHandler(async (req, res) => {
  const { title, author, status = "want_to_read", tags = [], notes = "" } = req.body;

  validateBookPayload({ title, author, status, tags, notes });

  const createdBook = await Book.create({
    title: title.trim(),
    author: author.trim(),
    status,
    tags: sanitizeTags(tags),
    notes: sanitizeNotes(notes),
    userId: req.currentUser.userId,
  });

  res.status(201).json({
    book: formatBookDocument(createdBook),
  });
});

const updateBook = asyncHandler(async (req, res) => {
  const { title, author, status, tags, notes } = req.body;
  validateBookPayload({ title, author, status, tags, notes }, { partial: true });

  const ownedBook = await findOwnedBookOrThrow(
    req.params.bookId,
    req.currentUser.userId
  );

  if (title !== undefined) {
    ownedBook.title = title.trim();
  }

  if (author !== undefined) {
    ownedBook.author = author.trim();
  }

  if (status !== undefined) {
    ownedBook.status = status;
  }

  if (tags !== undefined) {
    ownedBook.tags = sanitizeTags(tags);
  }

  if (notes !== undefined) {
    ownedBook.notes = sanitizeNotes(notes);
  }

  await ownedBook.save();

  res.status(200).json({
    book: formatBookDocument(ownedBook),
  });
});

const updateBookStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!BOOK_STATUS_VALUES.includes(status)) {
    throw new ApiError(400, "Status must be want_to_read, reading, or completed");
  }

  const ownedBook = await findOwnedBookOrThrow(
    req.params.bookId,
    req.currentUser.userId
  );

  ownedBook.status = status;
  await ownedBook.save();

  res.status(200).json({
    book: formatBookDocument(ownedBook),
  });
});

const removeBookById = asyncHandler(async (req, res) => {
  const ownedBook = await findOwnedBookOrThrow(
    req.params.bookId,
    req.currentUser.userId
  );

  await ownedBook.deleteOne();

  res.status(200).json({
    message: "Book deleted successfully",
  });
});

module.exports = {
  listBooks,
  getBookSummary,
  listApplicableTags,
  listApplicableAuthors,
  createBook,
  updateBook,
  updateBookStatus,
  removeBookById,
};
