"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { DEFAULT_BOOKS_PAGE_SIZE } from "@/lib/constants";
import Button from "@/components/shared/Button";
import Spinner from "@/components/shared/Spinner";
import InlineMessage from "@/components/shared/InlineMessage";
import PaginationControls from "@/components/shared/PaginationControls";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import BookFilters from "@/components/books/BookFilters";
import BookListView from "@/components/books/BookListView";
import BookFormModal from "@/components/books/BookFormModal";

function BooksPageContent() {
  const searchParams = useSearchParams();
  const authorFromQuery = searchParams.get("author") || "";

  const [paginatedBooks, setPaginatedBooks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [applicableTags, setApplicableTags] = useState([]);
  const [applicableAuthors, setApplicableAuthors] = useState([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [selectedTagFilter, setSelectedTagFilter] = useState("");
  const [selectedAuthorFilter, setSelectedAuthorFilter] = useState(authorFromQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [bookFormMode, setBookFormMode] = useState("create");
  const [selectedBookForEdit, setSelectedBookForEdit] = useState(null);
  const [isSavingBook, setIsSavingBook] = useState(false);
  const [bookPendingDelete, setBookPendingDelete] = useState(null);
  const [isDeletingBook, setIsDeletingBook] = useState(false);

  const hasActiveFilters =
    selectedStatusFilter !== "all" ||
    selectedTagFilter !== "" ||
    selectedAuthorFilter !== "";

  useEffect(() => {
    setSelectedAuthorFilter(authorFromQuery);
    setCurrentPage(1);
  }, [authorFromQuery]);

  const loadFilterOptions = useCallback(async () => {
    const [tagsResponse, authorsResponse] = await Promise.all([
      apiClient("/api/books/tags"),
      apiClient("/api/books/authors"),
    ]);
    setApplicableTags(tagsResponse.tags);
    setApplicableAuthors(authorsResponse.authors);
  }, []);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setPageError("");

    try {
      const queryParameters = new URLSearchParams({
        page: String(currentPage),
        limit: String(DEFAULT_BOOKS_PAGE_SIZE),
      });

      if (selectedStatusFilter !== "all") {
        queryParameters.set("status", selectedStatusFilter);
      }

      if (selectedTagFilter) {
        queryParameters.set("tag", selectedTagFilter);
      }

      if (selectedAuthorFilter) {
        queryParameters.set("author", selectedAuthorFilter);
      }

      const responseBody = await apiClient(`/api/books?${queryParameters.toString()}`);
      setPaginatedBooks(responseBody.books);
      setPagination(responseBody.pagination);
    } catch (error) {
      setPageError(error.message || "Unable to load books");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedStatusFilter, selectedTagFilter, selectedAuthorFilter]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    loadFilterOptions().catch(() => {
      setApplicableTags([]);
      setApplicableAuthors([]);
    });
  }, [loadFilterOptions]);

  function handleStatusFilterChange(nextStatus) {
    setSelectedStatusFilter(nextStatus);
    setCurrentPage(1);
  }

  function handleTagFilterChange(nextTag) {
    setSelectedTagFilter(nextTag);
    setCurrentPage(1);
  }

  function handleAuthorFilterChange(nextAuthor) {
    setSelectedAuthorFilter(nextAuthor);
    setCurrentPage(1);
  }

  function handleClearFilters() {
    setSelectedStatusFilter("all");
    setSelectedTagFilter("");
    setSelectedAuthorFilter("");
    setCurrentPage(1);
  }

  function handleOpenCreateForm() {
    setBookFormMode("create");
    setSelectedBookForEdit(null);
    setIsBookFormOpen(true);
  }

  function handleOpenEditForm(book) {
    setBookFormMode("edit");
    setSelectedBookForEdit(book);
    setIsBookFormOpen(true);
  }

  async function handleSaveBook(formValues) {
    setIsSavingBook(true);

    try {
      if (bookFormMode === "edit" && selectedBookForEdit) {
        await apiClient(`/api/books/${selectedBookForEdit.id}`, {
          method: "PATCH",
          body: JSON.stringify(formValues),
        });
      } else {
        await apiClient("/api/books", {
          method: "POST",
          body: JSON.stringify(formValues),
        });
      }

      setIsBookFormOpen(false);
      await Promise.all([loadBooks(), loadFilterOptions()]);
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
      await loadBooks();
    } catch (error) {
      setPageError(error.message || "Unable to update status");
    }
  }

  async function handleConfirmDelete() {
    if (!bookPendingDelete) {
      return;
    }

    setIsDeletingBook(true);

    try {
      await apiClient(`/api/books/${bookPendingDelete.id}`, {
        method: "DELETE",
      });
      setBookPendingDelete(null);
      await Promise.all([loadBooks(), loadFilterOptions()]);
    } catch (error) {
      setPageError(error.message || "Unable to delete book");
    } finally {
      setIsDeletingBook(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Your books</h1>
          <p className="mt-1 text-sm text-ink/70">
            {pagination
              ? `${pagination.totalItems} title${pagination.totalItems === 1 ? "" : "s"} on this shelf`
              : "Browse, filter, and keep your collection current."}
          </p>
        </div>
        <Button onClick={handleOpenCreateForm}>Add book</Button>
      </div>

      <BookFilters
        selectedStatusFilter={selectedStatusFilter}
        selectedTagFilter={selectedTagFilter}
        selectedAuthorFilter={selectedAuthorFilter}
        applicableTags={applicableTags}
        applicableAuthors={applicableAuthors}
        onStatusChange={handleStatusFilterChange}
        onTagChange={handleTagFilterChange}
        onAuthorChange={handleAuthorFilterChange}
        onClearFilters={handleClearFilters}
      />

      {pageError ? <InlineMessage>{pageError}</InlineMessage> : null}

      {isLoading ? (
        <Spinner label="Loading books..." />
      ) : (
        <>
          <BookListView
            books={paginatedBooks}
            hasActiveFilters={hasActiveFilters}
            onEdit={handleOpenEditForm}
            onDelete={setBookPendingDelete}
            onStatusChange={handleQuickStatusUpdate}
          />
          <PaginationControls
            pagination={pagination}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <BookFormModal
        isOpen={isBookFormOpen}
        mode={bookFormMode}
        initialBook={selectedBookForEdit}
        isSaving={isSavingBook}
        onClose={() => setIsBookFormOpen(false)}
        onSubmit={handleSaveBook}
      />

      <ConfirmDialog
        isOpen={Boolean(bookPendingDelete)}
        title="Delete this book?"
        description={
          bookPendingDelete
            ? `"${bookPendingDelete.title}" will be removed from your shelf.`
            : ""
        }
        confirmLabel="Delete"
        isLoading={isDeletingBook}
        onCancel={() => setBookPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<Spinner label="Loading books..." />}>
      <BooksPageContent />
    </Suspense>
  );
}
