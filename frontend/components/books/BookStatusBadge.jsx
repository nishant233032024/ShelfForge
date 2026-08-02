import { BOOK_STATUS_OPTIONS } from "@/lib/constants";

export default function BookStatusBadge({ status }) {
  const statusLabel =
    BOOK_STATUS_OPTIONS.find((option) => option.value === status)?.label || status;

  return (
    <span className="inline-flex rounded-full border border-ink/20 bg-white px-2.5 py-1 text-xs font-medium text-ink">
      {statusLabel}
    </span>
  );
}
