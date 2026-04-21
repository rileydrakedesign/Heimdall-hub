const borderColors: Record<string, string> = {
  urgent: "border-l-rose-500",
  high: "border-l-amber-500",
  medium: "border-l-sky-500",
  low: "border-l-slate-500",
};

export function PriorityBar({
  priority,
  children,
}: {
  priority: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border-l-2 ${borderColors[priority] ?? "border-l-slate-500"} pl-3`}>
      {children}
    </div>
  );
}
