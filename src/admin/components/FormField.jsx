export const FormField = ({
  label,
  id,
  error,
  helperText,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-300 tracking-wide font-mono"
        >
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <p className="text-[11px] text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
