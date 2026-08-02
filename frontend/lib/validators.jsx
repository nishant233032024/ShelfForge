import { MAX_BOOK_TAGS, MAX_BOOK_NOTES } from "./constants";

export function validateSignupForm({ fullName, email, password, confirmPassword }) {
  if (!fullName || fullName.trim().length < 2 || fullName.trim().length > 60) {
    return "Full name must be between 2 and 60 characters";
  }

  if (!email || !email.includes("@")) {
    return "Enter a valid email address";
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password !== confirmPassword) {
    return "Password and confirm password must match";
  }

  return null;
}

export function validateLoginForm({ email, password }) {
  if (!email || !password) {
    return "Email and password are required";
  }

  return null;
}

export function validateBookForm({ title, author, status, tags, notes = "" }) {
  if (!title || title.trim().length < 1 || title.trim().length > 160) {
    return "Title must be between 1 and 160 characters";
  }

  if (!author || author.trim().length < 1 || author.trim().length > 120) {
    return "Author must be between 1 and 120 characters";
  }

  if (!["want_to_read", "reading", "completed"].includes(status)) {
    return "Choose a valid reading status";
  }

  if (!Array.isArray(tags) || tags.length > MAX_BOOK_TAGS) {
    return `You can add up to ${MAX_BOOK_TAGS} tags`;
  }

  if (typeof notes === "string" && notes.trim().length > MAX_BOOK_NOTES) {
    return `Notes must be at most ${MAX_BOOK_NOTES} characters`;
  }

  return null;
}
