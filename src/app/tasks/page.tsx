import { Suspense } from "react";
import { loadProjectsAsync } from "@/lib/projects";
import { loadTasksAsync, type Task, type TaskStatus } from "@/lib/tasks";
import { StatusDot } from "@/components/StatusDot";
import { ProjectFilter } from "@/components/ProjectFilter";
import { CreateTaskButton } from "@/components/CreateTaskButton";
import { TaskRow } from "@/components/TaskRow";

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
  const projectList = projects.map((p) => ({ id: p.id, name: p.name }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-muted">All tasks across projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense>
            <ProjectFilter
              projects={projectList}
            />
          </Suspense>
          <CreateTaskButton
            projects={projectList}
            defaultProjectId={projectFilter}
          />
        </div>
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
          );
        })}
      </div>
    </main>
  );
}
