import { loadProjectsAsync, type Project } from "@/lib/projects";
import { loadTasksAsync, type Task, type TaskStatus } from "@/lib/tasks";
import { StatusDot } from "@/components/StatusDot";
import { Badge } from "@/components/Badge";
import { PriorityBar } from "@/components/PriorityBar";
import { FileList } from "@/components/FileList";
import { listRepoFiles, getRepoRoot } from "@/lib/fsList";
import { githubUploadUrl, githubTreeUrl } from "@/lib/repo";
import { EditProjectButton } from "@/components/EditProjectButton";
import { CreateTaskButton } from "@/components/CreateTaskButton";
import { TaskRow } from "@/components/TaskRow";

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
        <a href="/projects" className="mt-6 inline-block text-sm text-muted hover:text-foreground">
          Back to projects
        </a>
      </main>
    );
  }

  const tasks = allTasks.filter((t) => t.project_id === project.id);
  const columns: TaskStatus[] = project.board_columns?.length
    ? (project.board_columns as TaskStatus[])
    : COLUMNS;

  const byStatus = new Map<TaskStatus, Task[]>();
  for (const s of columns) byStatus.set(s, []);
  for (const t of tasks) {
    if (!byStatus.has(t.status)) byStatus.set(t.status, []);
    byStatus.get(t.status)!.push(t);
  }

  const repoRoot = getRepoRoot();
  const projectRecentFiles = listRepoFiles({
    absDir: `${repoRoot}/projects/${project.id}/files`,
    relPrefix: `projects/${project.id}/files`,
    limit: 10,
  });

  const links: Array<{ label: string; url: string }> =
    Array.isArray(project.links) ? project.links : [];

  const prRank: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
  const allProjectList = allProjects.map((p) => ({ id: p.id, name: p.name }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted">
        <a href="/projects" className="hover:text-foreground">
          Projects
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{project.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          {project.notes && <p className="mt-1 text-sm text-muted">{project.notes}</p>}
        </div>
        <EditProjectButton project={project} />
      </div>

      {/* Info bar */}
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
          <div className="text-xs text-muted uppercase tracking-wider">Owner</div>
          <div className="mt-1 text-sm font-medium">{project.owner}</div>
        </div>
        <div>
          <div className="text-xs text-muted uppercase tracking-wider">Due</div>
          <div className="mt-1 text-sm font-medium">{project.due ?? "—"}</div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted uppercase tracking-wider">Next Action</div>
          <div className="mt-1 text-sm">{project.next_action}</div>
        </div>
      </div>

      {/* Task board — columns */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">{tasks.length} total</span>
            <CreateTaskButton projects={allProjectList} defaultProjectId={project.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((status) => {
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
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Uploads — demoted */}
      <section className="mt-8">
        <details className="rounded-lg border border-border bg-surface">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-muted hover:text-foreground">
            Uploads &amp; Files
          </summary>
          <div className="border-t border-border px-4 py-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <a
                href={githubUploadUrl(`projects/${project.id}/files`)}
                className="rounded-md border border-border bg-surface-light px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors"
              >
                Upload files
              </a>
              <a
                href={githubTreeUrl(`projects/${project.id}/files`)}
                className="rounded-md border border-border bg-surface-light px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors"
              >
                View folder
              </a>
            </div>
            <FileList title="Recent files" files={projectRecentFiles} />
          </div>
        </details>
      </section>

      {/* Links */}
      {links.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-muted mb-3">Links</h2>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.url}>
                <a
                  className="text-sm text-accent hover:underline"
                  href={l.url}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
