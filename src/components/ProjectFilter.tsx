"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ProjectFilter({
  projects,
}: {
  projects: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("project") ?? "";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("project", value);
    } else {
      params.delete("project");
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
    >
      <option value="">All projects</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
