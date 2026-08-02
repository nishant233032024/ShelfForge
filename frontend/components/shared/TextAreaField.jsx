export default function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  rows = 3,
  maxLength,
  hint = "",
}) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full resize-y rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40"
      />
      {hint ? <span className="block text-xs text-ink/50">{hint}</span> : null}
    </label>
  );
}
