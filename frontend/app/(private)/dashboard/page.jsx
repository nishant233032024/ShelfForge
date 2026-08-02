"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { apiClient } from "@/lib/apiClient";
import { BOOK_STATUS_OPTIONS } from "@/lib/constants";
import Button from "@/components/shared/Button";
import Spinner from "@/components/shared/Spinner";
import InlineMessage from "@/components/shared/InlineMessage";
import SummaryStrip from "@/components/dashboard/SummaryStrip";
import ReadingInsight from "@/components/dashboard/ReadingInsight";
import FavoriteAuthors from "@/components/dashboard/FavoriteAuthors";
import BookFormModal from "@/components/books/BookFormModal";
import BookStatusBadge from "@/components/books/BookStatusBadge";

export default function DashboardPage() {
  const { authenticatedUser } = useAuth();
  const [bookSummary, setBookSummary] = useState(null);
  const [favoriteAuthors, setFavoriteAuthors] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [isSavingBook, setIsSavingBook] = useState(false);

  const loadDashboard = useCallback(async () => {
    setPageError("");
    setIsLoading(true);

    try {
      const responseBody = await apiClient("/api/books/summary");
      setBookSummary(responseBody.bookSummary);
      setFavoriteAuthors(responseBody.favoriteAuthors || []);
      setRecentBooks(responseBody.recentBooks);
    } catch (error) {
      setPageError(error.message || "Unable to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleCreateBook(formValues) {
    setIsSavingBook(true);

    try {
      await apiClient("/api/books", {
        method: "POST",
        body: JSON.stringify(formValues),
      });
      setIsBookFormOpen(false);
      await loadDashboard();
    } finally {
      setIsSavingBook(false);
    }
  }

  async function handleQuickStatusUpdate(bookId, nextStatus) {
    try {
      await apiClient(`/api/books/${bookId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      await loadDashboard();
    } catch (error) {
      setPageError(error.message || "Unable to update status");
    }
  }

  if (isLoading) {
    return <Spinner label="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            Welcome back, {authenticatedUser?.fullName}
          </h1>
          <p className="mt-1 text-sm text-ink/70">
            A quick look at where your reading stands today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsBookFormOpen(true)}>Add a book</Button>
          <Link href="/books">
            <Button variant="secondary">Open full shelf</Button>
          </Link>
        </div>
      </div>

      {pageError ? <InlineMessage>{pageError}</InlineMessage> : null}

      {bookSummary ? (
        <>
          <SummaryStrip bookSummary={bookSummary} />
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
            <p>
              Completion rate{" "}
              <span className="font-medium text-ink">{bookSummary.completionRate}%</span>
            </p>
            <p>
              Finished this month{" "}
              <span className="font-medium text-ink">{bookSummary.completedThisMonth}</span>
            </p>
          </div>
          <ReadingInsight bookSummary={bookSummary} />
          <FavoriteAuthors favoriteAuthors={favoriteAuthors} />
        </>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Recently updated</h2>
        </div>
        {recentBooks.length === 0 ? (
          <div className="border-y border-ink/10 py-10 text-center">
            <p className="text-sm text-ink/70">
              No books yet. Add one and it will show up here.
            </p>
          </div>
        ) : (
          <ul>
            {recentBooks.map((book) => (
              <li
                key={book.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{book.title}</p>
                  <p className="text-sm text-ink/70">{book.author}</p>
                  {book.notes ? (
                    <p className="mt-1 line-clamp-1 text-xs text-ink/55">{book.notes}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <BookStatusBadge status={book.status} />
                  <label className="block text-xs text-ink/60">
                    <span className="sr-only">Update status for {book.title}</span>
                    <select
                      value={book.status}
                      onChange={(event) =>
                        handleQuickStatusUpdate(book.id, event.target.value)
                      }
                      className="rounded-md border border-ink/20 bg-white px-2 py-2 text-sm text-ink"
                    >
                      {BOOK_STATUS_OPTIONS.map((statusOption) => (
                        <option key={statusOption.value} value={statusOption.value}>
                          {statusOption.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <BookFormModal
        isOpen={isBookFormOpen}
        mode="create"
        isSaving={isSavingBook}
        onClose={() => setIsBookFormOpen(false)}
        onSubmit={handleCreateBook}
      />
    </div>
  );
}
