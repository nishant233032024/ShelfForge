export const BOOK_STATUS_OPTIONS = [
  { value: "want_to_read", label: "Want to read" },
  { value: "reading", label: "Reading" },
  { value: "completed", label: "Completed" },
];

export const DEFAULT_BOOKS_PAGE_SIZE = 8;
export const MAX_BOOK_TAGS = 8;
export const MAX_BOOK_NOTES = 280;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
