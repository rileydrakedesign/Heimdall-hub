type Tone = "neutral" | "green" | "yellow" | "red" | "blue" | "sky" | "amber" | "rose";

const toneMap: Record<Tone, string> = {
  neutral: "bg-white/10 text-white/80 border-white/10",
  green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  yellow: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  red: "bg-rose-500/15 text-rose-300 border-rose-500/20",
  rose: "bg-rose-500/15 text-rose-300 border-rose-500/20",
  blue: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  sky: "bg-sky-500/15 text-sky-300 border-sky-500/20",
};

const dotColors: Record<Tone, string> = {
  neutral: "bg-slate-400",
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  amber: "bg-amber-400",
  red: "bg-rose-400",
  rose: "bg-rose-400",
  blue: "bg-sky-400",
  sky: "bg-sky-400",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  if (dot) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
        <span className={`h-2 w-2 rounded-full ${dotColors[tone]}`} />
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
}
