const colors: Record<string, string> = {
  active: "bg-emerald-400",
  in_progress: "bg-emerald-400",
  paused: "bg-amber-400",
  blocked: "bg-rose-400",
  done: "bg-sky-400",
  backlog: "bg-slate-400",
  idea: "bg-slate-400",
};

export function StatusDot({ status, className = "" }: { status: string; className?: string }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[status] ?? "bg-slate-400"} ${className}`}
    />
  );
}
