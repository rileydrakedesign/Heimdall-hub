type Tone = "neutral" | "green" | "yellow" | "red" | "blue";

const tones: Record<Tone, string> = {
  neutral: "bg-white/10 text-white/80 border-white/10",
  green: "bg-emerald-500/15 text-emerald-200 border-emerald-500/20",
  yellow: "bg-amber-500/15 text-amber-200 border-amber-500/20",
  red: "bg-rose-500/15 text-rose-200 border-rose-500/20",
  blue: "bg-sky-500/15 text-sky-200 border-sky-500/20",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
