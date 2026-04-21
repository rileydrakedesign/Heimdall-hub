"use client";

import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { label: "Priority", value: "priority" },
  { label: "Name", value: "name" },
  { label: "Updated", value: "updated" },
];

export function SortControl() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "priority";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
