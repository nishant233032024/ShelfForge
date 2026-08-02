export default function InlineMessage({ tone = "error", children }) {
  const toneClasses =
    tone === "success"
      ? "border-ink/20 bg-white text-ink"
      : "border-ink/30 bg-ink/5 text-ink";

  return (
    <p className={`rounded-md border px-3 py-2 text-sm ${toneClasses}`} role="status">
      {children}
    </p>
  );
}
