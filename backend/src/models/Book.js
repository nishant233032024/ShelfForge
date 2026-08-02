const mongoose = require("mongoose");

const BOOK_STATUS_VALUES = ["want_to_read", "reading", "completed"];

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [160, "Title must be at most 160 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [1, "Author must be at least 1 character"],
      maxlength: [120, "Author must be at most 120 characters"],
    },
    tags: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      default: [],
      validate: {
        validator(tagList) {
          return Array.isArray(tagList) && tagList.length <= 8;
        },
        message: "A book can have at most 8 tags",
      },
    },
    status: {
      type: String,
      enum: BOOK_STATUS_VALUES,
      default: "want_to_read",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [280, "Notes must be at most 280 characters"],
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ userId: 1, createdAt: -1 });
bookSchema.index({ userId: 1, status: 1, createdAt: -1 });
bookSchema.index({ userId: 1, tags: 1 });
bookSchema.index({ userId: 1, author: 1 });

const Book = mongoose.model("Book", bookSchema);

module.exports = {
  Book,
  BOOK_STATUS_VALUES,
};
