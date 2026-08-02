export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

  const variantClasses =
    variant === "secondary"
      ? "border border-ink/20 bg-white text-ink hover:bg-ink/5"
      : variant === "danger"
        ? "border border-ink bg-ink text-paper hover:bg-ink/90"
        : "bg-ink text-paper hover:bg-ink/90";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
