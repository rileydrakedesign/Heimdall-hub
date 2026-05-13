import Link from "next/link";
import { loadProjectsAsync } from "@/lib/projects";
import { loadTasksAsync } from "@/lib/tasks";
import { StatCard } from "@/components/StatCard";
import { StatusDot } from "@/components/StatusDot";
import { Badge } from "@/components/Badge";
import { CreateTaskButton } from "@/components/CreateTaskButton";
import { TaskRow } from "@/components/TaskRow";

export const dynamic = "force-dynamic";

const PRIORITY_RANK: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

export default async function Dashboard() {
  const [projects, tasks] = await Promise.all([
    loadProjectsAsync(),
    loadTasksAsync(),
  ]);

  const active = projects.filter((p) => p.status === "active");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const blocked = tasks.filter((t) => t.status === "blocked");

  const activeProjects = projects
    .filter((p) => p.status === "active" || p.status === "paused")
    .sort((a, b) => (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9));

  const focus = [...inProgress, ...blocked].sort(
    (a, b) => (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9),
  );

  const projectList = projects.map((p) => ({ id: p.id, name: p.name }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Projects and tasks at a glance</p>
        </div>
        <CreateTaskButton projects={projectList} />
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Projects" value={projects.length} />
        <StatCard title="Active" value={active.length} accent />
        <StatCard title="In progress" value={inProgress.length} />
        <StatCard title="Blocked" value={blocked.length} />
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          <Link href="/projects" className="text-xs text-muted hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
              <Badge tone={p.priority === "urgent" ? "red" : p.priority === "high" ? "yellow" : "neutral"}>
                {p.priority}
              </Badge>
            </a>
          ))}
          {activeProjects.length === 0 && (
            <div className="col-span-full rounded-lg border border-border bg-surface p-6 text-center text-sm text-muted">
              No active projects yet.
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">In Focus</h2>
          <Link href="/tasks" className="text-xs text-muted hover:text-foreground">
            All tasks
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-surface divide-y divide-border">
          {focus.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted">
              No tasks in progress or blocked. Take a break or pick one up from the backlog.
            </div>
          ) : (
            focus.map((t) => {
              const project = t.project_id ? projects.find((p) => p.id === t.project_id) : null;
              return (
                <TaskRow
                  key={t.id}
                  task={t}
                  projectName={project?.name ?? null}
                  projectId={project?.id ?? null}
                  projects={projectList}
                />
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
