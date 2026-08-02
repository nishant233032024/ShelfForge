export default function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  autoComplete,
  required = false,
}) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40"
      />
    </label>
  );
}
