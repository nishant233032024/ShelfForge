import BookListItem from "./BookListItem";
import EmptyBookListState from "./EmptyBookListState";

export default function BookListView({
  books,
  hasActiveFilters,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  if (!books.length) {
    return <EmptyBookListState hasActiveFilters={hasActiveFilters} />;
  }

  return (
    <div>
      <div className="mb-2 hidden border-b border-ink/10 pb-2 text-xs font-medium uppercase tracking-wide text-ink/50 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_auto_auto] lg:gap-3">
        <span>Title / Author</span>
        <span>Tags</span>
        <span>Status</span>
        <span>Quick update</span>
        <span className="text-right">Actions</span>
      </div>
      <ul className="divide-y-0">
        {books.map((book) => (
          <BookListItem
            key={book.id}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </ul>
    </div>
  );
}
