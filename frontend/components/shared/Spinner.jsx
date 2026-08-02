export default function Spinner({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink/70" role="status">
      <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
