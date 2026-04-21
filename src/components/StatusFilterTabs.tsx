"use client";

import { useRouter, useSearchParams } from "next/navigation";

const tabs = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Done", value: "done" },
  { label: "Ideas", value: "idea" },
];

export function StatusFilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "";

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => select(tab.value)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            current === tab.value
              ? "bg-accent/15 text-accent"
              : "text-muted hover:bg-surface-light hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
