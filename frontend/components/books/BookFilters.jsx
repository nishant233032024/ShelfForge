"use client";

import { BOOK_STATUS_OPTIONS } from "@/lib/constants";
import Button from "@/components/shared/Button";

export default function BookFilters({
  selectedStatusFilter,
  selectedTagFilter,
  selectedAuthorFilter,
  applicableTags,
  applicableAuthors,
  onStatusChange,
  onTagChange,
  onAuthorChange,
  onClearFilters,
}) {
  const hasActiveFilters =
    selectedStatusFilter !== "all" ||
    selectedTagFilter !== "" ||
    selectedAuthorFilter !== "";

  return (
    <section className="space-y-4" aria-label="Book filters">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">Status</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onStatusChange("all")}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                selectedStatusFilter === "all"
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/20 bg-white text-ink"
              }`}
            >
              All
            </button>
            {BOOK_STATUS_OPTIONS.map((statusOption) => (
              <button
                key={statusOption.value}
                type="button"
                onClick={() => onStatusChange(statusOption.value)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  selectedStatusFilter === statusOption.value
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 bg-white text-ink"
                }`}
              >
                {statusOption.label}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters ? (
          <Button variant="secondary" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">Authors on your shelf</p>
        {applicableAuthors.length === 0 ? (
          <p className="text-sm text-ink/50">
            Authors appear here once books are on your shelf.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {applicableAuthors.map((author) => {
              const isSelected = selectedAuthorFilter === author;

              return (
                <button
                  key={author}
                  type="button"
                  onClick={() => onAuthorChange(isSelected ? "" : author)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    isSelected
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/20 bg-white text-ink"
                  }`}
                >
                  {author}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">Tags on your shelf</p>
        {applicableTags.length === 0 ? (
          <p className="text-sm text-ink/50">No tags yet — they will appear here as you add them.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {applicableTags.map((tag) => {
              const isSelected = selectedTagFilter === tag;

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagChange(isSelected ? "" : tag)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    isSelected
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/20 bg-white text-ink"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
