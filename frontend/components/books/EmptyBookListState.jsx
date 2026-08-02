export default function EmptyBookListState({ hasActiveFilters }) {
  return (
    <div className="border-y border-ink/10 py-12 text-center">
      <p className="text-base font-medium text-ink">
        {hasActiveFilters ? "No books match these filters" : "Your shelf is empty"}
      </p>
      <p className="mt-2 text-sm text-ink/70">
        {hasActiveFilters
          ? "Try clearing a filter or switching status to see more titles."
          : "Add your first book and start shaping a reading list that feels like yours."}
      </p>
    </div>
  );
}
