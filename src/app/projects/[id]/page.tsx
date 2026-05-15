import Link from "next/link";
import { loadProjectsAsync } from "@/lib/projects";
import { loadTasksAsync, type Task, type TaskStatus } from "@/lib/tasks";
import { StatusDot } from "@/components/StatusDot";
import { Badge } from "@/components/Badge";
import { EditProjectButton } from "@/components/EditProjectButton";
import { CreateTaskButton } from "@/components/CreateTaskButton";
import { TaskRow } from "@/components/TaskRow";
import { PERSONAL_PROJECT_ID } from "@/lib/constants";

// Rendered per-request: depends on live Supabase data, so it must not be
// prerendered at build time (a paused DB would fail the build).
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

const COLUMNS: TaskStatus[] = ["backlog", "in_progress", "blocked", "done"];

function toneForStatus(status: string) {
  if (status === "active") return "green" as const;
  if (status === "paused") return "yellow" as const;
  if (status === "done") return "sky" as const;
  return "neutral" as const;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [allProjects, allTasks] = await Promise.all([
    loadProjectsAsync(),
    loadTasksAsync(),
  ]);
  const project = allProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="mt-2 text-muted">Unknown project id: {id}</p>
        <Link href="/projects" className="mt-6 inline-block text-sm text-muted hover:text-foreground">
          Back to projects
        </Link>
      </main>
    );
  }

  const tasks = allTasks.filter((t) => t.project_id === project.id);
  const isPersonal = project.id === PERSONAL_PROJECT_ID;

  const byStatus = new Map<TaskStatus, Task[]>();
  for (const s of COLUMNS) byStatus.set(s, []);
  for (const t of tasks) {
    if (!byStatus.has(t.status)) byStatus.set(t.status, []);
    byStatus.get(t.status)!.push(t);
  }

  const prRank: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
  const allProjectList = allProjects.map((p) => ({ id: p.id, name: p.name }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/projects" className="hover:text-foreground">
          Projects
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{project.name}</span>
      </nav>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          {project.notes && <p className="mt-1 text-sm text-muted">{project.notes}</p>}
        </div>
        {!isPersonal && <EditProjectButton project={project} />}
      </div>

      {!isPersonal && (
        <div className="mb-8 flex flex-wrap gap-6 rounded-lg border border-border bg-surface px-6 py-4">
          <div>
            <div className="text-xs text-muted uppercase tracking-wider">Status</div>
            <div className="mt-1 flex items-center gap-2">
              <StatusDot status={project.status} />
              <Badge tone={toneForStatus(project.status)}>{project.status}</Badge>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted uppercase tracking-wider">Priority</div>
            <div className="mt-1">
              <Badge
                tone={
                  project.priority === "urgent"
                    ? "red"
                    : project.priority === "high"
                      ? "yellow"
                      : "neutral"
                }
              >
                {project.priority}
              </Badge>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted uppercase tracking-wider">Due</div>
            <div className="mt-1 text-sm font-medium">{project.due ?? "—"}</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs text-muted uppercase tracking-wider">Next Action</div>
            <div className="mt-1 text-sm">{project.next_action}</div>
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">{tasks.length} total</span>
            <CreateTaskButton projects={allProjectList} defaultProjectId={project.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((status) => {
            const list = (byStatus.get(status) ?? [])
              .slice()
              .sort((a, b) => (prRank[a.priority] ?? 9) - (prRank[b.priority] ?? 9));
            return (
              <div key={status} className="rounded-lg border border-border bg-surface">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <StatusDot status={status} />
                  <span className="text-sm font-semibold">
                    {STATUS_LABELS[status] ?? status}
                  </span>
                  <span className="text-xs text-muted">({list.length})</span>
                </div>
                <div className="divide-y divide-border">
                  {list.length === 0 ? (
                    <div className="p-4 text-xs text-muted">No tasks</div>
                  ) : (
                    list.map((t) => (
                      <TaskRow
                        key={t.id}
                        task={t}
                        projectName={project.name}
                        projectId={project.id}
                        projects={allProjectList}
                        hideProject
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
