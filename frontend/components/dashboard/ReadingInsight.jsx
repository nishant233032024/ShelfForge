export default function ReadingInsight({ bookSummary }) {
  const {
    totalBooks,
    wantToReadCount,
    readingCount,
    completedCount,
    completedThisMonth = 0,
    completionRate = 0,
  } = bookSummary;

  let insightText =
    "Your shelf is ready. Add a few titles and this space will start reflecting how you actually read.";

  if (completedThisMonth >= 3) {
    insightText = `You finished ${completedThisMonth} books this month. That pace is worth noticing — keep the shelf honest and the habit stays kind.`;
  } else if (totalBooks > 0 && readingCount === 0 && wantToReadCount > 0) {
    insightText =
      "You have books waiting, but nothing marked as currently reading. Pick one and give it a clear place on the shelf.";
  } else if (readingCount > 0 && completedCount === 0) {
    insightText =
      "You are in motion. Finishing even one title will make your progress feel more concrete.";
  } else if (completionRate >= 60) {
    insightText =
      "You finish more than you park. That steady completion habit is a quiet strength.";
  } else if (wantToReadCount > readingCount * 3 && readingCount > 0) {
    insightText =
      "Your want-to-read list is growing faster than your current reads. Consider thinning the queue before adding more.";
  } else if (totalBooks > 0) {
    insightText =
      "A balanced shelf: some finished, some in progress, some waiting. Keep the list honest and it stays useful.";
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white px-4 py-4">
      <h2 className="text-sm font-medium uppercase tracking-wide text-ink/50">
        Reading insight
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">{insightText}</p>
    </section>
  );
}
