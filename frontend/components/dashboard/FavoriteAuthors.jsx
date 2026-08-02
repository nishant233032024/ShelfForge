import Link from "next/link";

export default function FavoriteAuthors({ favoriteAuthors }) {
  if (!favoriteAuthors || favoriteAuthors.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3" aria-label="Favorite authors">
      <div>
        <h2 className="text-lg font-semibold text-ink">Authors on your shelf</h2>
        <p className="mt-1 text-sm text-ink/70">
          The voices you return to most — tap one to open their titles.
        </p>
      </div>
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {favoriteAuthors.map((authorEntry) => (
          <li key={authorEntry.author} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{authorEntry.author}</p>
              <p className="text-xs text-ink/55">
                {authorEntry.bookCount} title{authorEntry.bookCount === 1 ? "" : "s"}
              </p>
            </div>
            <Link
              href={`/books?author=${encodeURIComponent(authorEntry.author)}`}
              className="shrink-0 rounded-md border border-ink/20 bg-white px-3 py-1.5 text-xs text-ink hover:bg-ink/5"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
