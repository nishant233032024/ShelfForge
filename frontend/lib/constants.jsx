export const BOOK_STATUS_OPTIONS = [
  { value: "want_to_read", label: "Want to read" },
  { value: "reading", label: "Reading" },
  { value: "completed", label: "Completed" },
];

export const DEFAULT_BOOKS_PAGE_SIZE = 8;
export const MAX_BOOK_TAGS = 8;
export const MAX_BOOK_NOTES = 280;

// Production uses same-origin /api via Next.js rewrites (first-party cookies).
// Locally, talk to the Express server directly.
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
