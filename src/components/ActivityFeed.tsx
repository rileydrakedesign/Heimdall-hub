import { type AuditEntry } from "@/lib/activity";
import { relativeTime } from "@/lib/format";

const actionIcons: Record<string, string> = {
  "task.create": "+",
  "task.update": "~",
  "task.comment": "#",
  "project.create": "+",
  "project.update": "~",
  "import.yaml": "^",
};

function describeAction(entry: AuditEntry): string {
  const parts = entry.action.split(".");
  const verb = parts[1] === "create" ? "created" : parts[1] === "update" ? "updated" : parts[1];
  return `${entry.actor} ${verb} ${entry.entity_type} ${entry.entity_id}`;
}

export function ActivityFeed({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted">No recent activity</p>
        <p className="mt-1 text-xs text-muted/60">
          Actions will appear here as you use the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface divide-y divide-border">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-start gap-3 p-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-light text-xs font-mono text-muted">
            {actionIcons[entry.action] ?? "?"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground/90 truncate">{describeAction(entry)}</p>
            <p className="text-xs text-muted">{relativeTime(entry.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
