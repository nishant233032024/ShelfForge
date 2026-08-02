export default function PaginationControls({
  pagination,
  onPageChange,
}) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
      <p className="text-sm text-ink/70">
        Page {pagination.currentPage} of {pagination.totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink disabled:opacity-50"
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(pagination.currentPage - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink disabled:opacity-50"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
