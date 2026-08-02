export default function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
