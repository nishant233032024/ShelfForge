"use client";

import { BOOK_STATUS_OPTIONS } from "@/lib/constants";
import BookStatusBadge from "./BookStatusBadge";

function formatUpdatedDate(dateValue) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateValue));
  } catch {
    return "";
  }
}

export default function BookListItem({
  book,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <li className="border-b border-ink/10 py-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_auto_auto] lg:items-center">
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-ink">{book.title}</p>
          <p className="mt-0.5 text-sm text-ink/70">{book.author}</p>
          {book.notes ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/55">
              {book.notes}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {book.tags.length === 0 ? (
            <span className="text-xs text-ink/40">No tags</span>
          ) : (
            book.tags.map((tag) => (
              <span
                key={`${book.id}-${tag}`}
                className="rounded-full border border-ink/15 bg-white px-2 py-0.5 text-xs text-ink/80"
              >
                {tag}
              </span>
            ))
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <BookStatusBadge status={book.status} />
          <p className="text-xs text-ink/50">
            Updated {formatUpdatedDate(book.updatedAt)}
          </p>
        </div>

        <label className="block text-xs text-ink/60 lg:w-40">
          <span className="sr-only">Quick status update for {book.title}</span>
          <select
            value={book.status}
            onChange={(event) => onStatusChange(book.id, event.target.value)}
            className="mt-1 w-full rounded-md border border-ink/20 bg-white px-2 py-2 text-sm text-ink"
          >
            {BOOK_STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(book)}
            className="rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
