export default function SummaryStrip({ bookSummary }) {
  const summaryItems = [
    { label: "Total", value: bookSummary.totalBooks },
    { label: "Want to read", value: bookSummary.wantToReadCount },
    { label: "Reading", value: bookSummary.readingCount },
    { label: "Completed", value: bookSummary.completedCount },
  ];

  return (
    <section
      aria-label="Reading summary"
      className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 sm:grid-cols-4"
    >
      {summaryItems.map((summaryItem) => (
        <div key={summaryItem.label} className="bg-paper px-4 py-4">
          <p className="text-xs uppercase tracking-wide text-ink/50">{summaryItem.label}</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{summaryItem.value}</p>
        </div>
      ))}
    </section>
  );
}
