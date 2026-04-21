import { loadProjectsAsync } from "@/lib/projects";
import { loadTasksAsync } from "@/lib/tasks";
import { loadRecentActivity } from "@/lib/activity";
import { StatCard } from "@/components/StatCard";
import { StatusDot } from "@/components/StatusDot";
import { Badge } from "@/components/Badge";
import { ActivityFeed } from "@/components/ActivityFeed";
import { CreateTaskButton } from "@/components/CreateTaskButton";

import { githubUploadUrl, githubTreeUrl } from "@/lib/repo";

export default async function Dashboard() {
  const [projects, tasks, activity] = await Promise.all([
    loadProjectsAsync(),
    loadTasksAsync(),
    loadRecentActivity(),
  ]);

  const active = projects.filter((p) => p.status === "active");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const blocked = tasks.filter((t) => t.status === "blocked");

  const activeProjects = projects
    .filter((p) => p.status === "active" || p.status === "paused")
    .sort((a, b) => {
      const rank: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
    });

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Command center overview</p>
        </div>
        <CreateTaskButton projects={projects.map((p) => ({ id: p.id, name: p.name }))} />
      </div>

      {/* Stats row */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Projects" value={projects.length} />
        <StatCard title="Active" value={active.length} accent />
        <StatCard title="In progress" value={inProgress.length} />
        <StatCard title="Blocked" value={blocked.length} />
      </section>

      {/* Two-column body */}
      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active projects — wider */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Active Projects</h2>
            <a href="/projects" className="text-xs text-muted hover:text-foreground">
              View all
            </a>
          </div>
          <div className="space-y-2">
            {activeProjects.map((p) => (
              <a
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4 hover:bg-surface-light transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusDot status={p.status} />
                    <span className="font-medium truncate">{p.name}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted truncate">{p.next_action}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Badge tone={p.priority === "urgent" ? "red" : p.priority === "high" ? "yellow" : "neutral"}>
                    {p.priority}
                  </Badge>
                </div>
              </a>
            ))}
            {activeProjects.length === 0 && (
              <div className="rounded-lg border border-border bg-surface p-6 text-center text-sm text-muted">
                No active projects
              </div>
            )}
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Activity</h2>
          <ActivityFeed entries={activity} />
        </div>
      </section>

      {/* Quick links */}
      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Quick Links</h2>
        <div className="flex flex-wrap gap-2">
          <a
            href={githubUploadUrl("kb/uploads")}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:bg-surface-light hover:text-foreground transition-colors"
          >
            Upload to KB
          </a>
          <a
            href={githubTreeUrl("kb/uploads")}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:bg-surface-light hover:text-foreground transition-colors"
          >
            Browse KB
          </a>
          <a
            href="/tasks"
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:bg-surface-light hover:text-foreground transition-colors"
          >
            All tasks
          </a>
          <a
            href="/briefs"
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:bg-surface-light hover:text-foreground transition-colors"
          >
            Morning briefs
          </a>
        </div>
      </section>
    </main>
  );
}
