export function StatCard({
  title,
  value,
  accent = false,
}: {
  title: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-4 ${
        accent ? "border-l-2 border-l-accent" : ""
      }`}
    >
      <div className="text-sm text-muted">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
