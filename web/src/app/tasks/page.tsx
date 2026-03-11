import { Suspense } from "react";
import { loadProjectsAsync } from "@/lib/projects";
import { loadTasksAsync, type Task, type TaskStatus } from "@/lib/tasks";
import { StatusDot } from "@/components/StatusDot";
import { PriorityBar } from "@/components/PriorityBar";
import { Badge } from "@/components/Badge";
import { ProjectFilter } from "@/components/ProjectFilter";

const STATUS_ORDER: TaskStatus[] = ["in_progress", "blocked", "backlog", "done"];

const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const params = await searchParams;
  const [tasks, projects] = await Promise.all([
    loadTasksAsync(),
    loadProjectsAsync(),
  ]);

  const projectFilter = params.project;
  const filtered = projectFilter
    ? tasks.filter((t) => t.project_id === projectFilter)
    : tasks;

  const byStatus = new Map<TaskStatus, Task[]>();
  for (const s of STATUS_ORDER) byStatus.set(s, []);
  for (const t of filtered) {
    (byStatus.get(t.status) ?? byStatus.set(t.status, []).get(t.status)!).push(t);
  }

  const prRank: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-muted">All tasks across projects</p>
        </div>
        <Suspense>
          <ProjectFilter
            projects={projects.map((p) => ({ id: p.id, name: p.name }))}
          />
        </Suspense>
      </div>

      <div className="space-y-8">
        {STATUS_ORDER.map((status) => {
          const list = (byStatus.get(status) ?? [])
            .slice()
            .sort((a, b) => (prRank[a.priority] ?? 9) - (prRank[b.priority] ?? 9));

          return (
            <section key={status}>
              <div className="flex items-center gap-2 mb-3">
                <StatusDot status={status} />
                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  {STATUS_LABELS[status]}
                </h2>
                <span className="text-xs text-muted">({list.length})</span>
              </div>

              <div className="rounded-lg border border-border bg-surface divide-y divide-border">
                {list.length === 0 ? (
                  <div className="p-4 text-sm text-muted">No tasks</div>
                ) : (
                  list.map((t) => {
                    const project = t.project_id
                      ? projects.find((p) => p.id === t.project_id)
                      : null;
                    return (
                      <div key={t.id} className="p-3">
                        <PriorityBar priority={t.priority}>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="font-medium text-sm">{t.title}</div>
                              <div className="mt-0.5 text-xs text-muted">
                                {project ? (
                                  <a
                                    className="hover:text-foreground"
                                    href={`/projects/${project.id}`}
                                  >
                                    {project.name}
                                  </a>
                                ) : (
                                  <span>Unassigned</span>
                                )}
                                {t.next_step && (
                                  <span className="text-muted/60"> · {t.next_step}</span>
                                )}
                                {t.blocked_by && (
                                  <span className="text-rose-400/80">
                                    {" "}
                                    · Blocked: {t.blocked_by}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <Badge>{t.area}</Badge>
                              <Badge>{t.assigned_to ?? t.owner ?? "—"}</Badge>
                            </div>
                          </div>
                        </PriorityBar>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
