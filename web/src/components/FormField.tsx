"use client";

const inputClasses =
  "w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function TextInput({
  label,
  name,
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted uppercase tracking-wider">
        {label}
        {required && <span className="text-rose-400"> *</span>}
      </span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className={`mt-1 ${inputClasses}`}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted uppercase tracking-wider">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className={`mt-1 ${inputClasses}`}
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted uppercase tracking-wider">
        {label}
        {required && <span className="text-rose-400"> *</span>}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={`mt-1 ${inputClasses}`}
      >
        {!required && <option value="">—</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DateInput({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted uppercase tracking-wider">
        {label}
      </span>
      <input
        type="date"
        name={name}
        defaultValue={defaultValue}
        className={`mt-1 ${inputClasses}`}
      />
    </label>
  );
}

export function FormActions({
  onCancel,
  submitLabel = "Save",
  pending = false,
}: {
  onCancel: () => void;
  submitLabel?: string;
  pending?: boolean;
}) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-border px-4 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-background disabled:opacity-50 transition-colors"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </div>
  );
}
