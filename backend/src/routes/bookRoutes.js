const express = require("express");
const {
  listBooks,
  getBookSummary,
  listApplicableTags,
  listApplicableAuthors,
  createBook,
  updateBook,
  updateBookStatus,
  removeBookById,
} = require("../controllers/bookController");
const requireAuth = require("../middleware/requireAuth");
const attachCurrentUser = require("../middleware/attachCurrentUser");
const validateObjectId = require("../middleware/validateObjectId");

const bookRoutes = express.Router();

bookRoutes.use(requireAuth, attachCurrentUser);

bookRoutes.get("/", listBooks);
bookRoutes.get("/summary", getBookSummary);
bookRoutes.get("/tags", listApplicableTags);
bookRoutes.get("/authors", listApplicableAuthors);
bookRoutes.post("/", createBook);
bookRoutes.patch("/:bookId", validateObjectId("bookId"), updateBook);
bookRoutes.patch("/:bookId/status", validateObjectId("bookId"), updateBookStatus);
bookRoutes.delete("/:bookId", validateObjectId("bookId"), removeBookById);

module.exports = bookRoutes;
