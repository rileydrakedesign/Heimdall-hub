import { BASE_PATH } from "@/lib/basePath";
import { githubFileUrl } from "@/lib/runs";
import { githubTreeUrl, githubUploadUrl } from "@/lib/repo";
import { getProjectById, loadProjects } from "@/lib/projects";
import { loadTasks, type Task, type TaskStatus } from "@/lib/tasks";
import { Badge } from "@/components/Badge";
import { FileList } from "@/components/FileList";
import { listRepoFiles, repoRootFromWebCwd } from "@/lib/fsList";

export const dynamic = "force-static";

export function generateStaticParams() {
  return loadProjects().map((p) => ({ id: p.id }));
}

function toneForTaskStatus(status: TaskStatus) {
  if (status === "in_progress") return "green" as const;
  if (status === "blocked") return "red" as const;
  if (status === "done") return "blue" as const;
  return "neutral" as const;
}

function toneForTaskPriority(priority: Task["priority"]) {
  if (priority === "urgent") return "red" as const;
  if (priority === "high") return "yellow" as const;
  return "neutral" as const;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
};

const DEFAULT_COLUMNS: TaskStatus[] = ["backlog", "in_progress", "blocked", "done"];

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="mt-2 text-white/60">Unknown project id: {id}</p>
        <a href={`${BASE_PATH}/projects/`} className="mt-6 inline-block text-sm text-white/60 hover:text-white">
          ← Back to projects
        </a>
      </main>
    );
  }

  const tasks = loadTasks().filter((t) => t.project_id === project.id);

  const columns: TaskStatus[] = project.board_columns?.length
    ? (project.board_columns as TaskStatus[])
    : DEFAULT_COLUMNS;

  const byStatus = new Map<TaskStatus, Task[]>();
  for (const s of columns) byStatus.set(s, []);
  for (const t of tasks) {
    if (!byStatus.has(t.status)) byStatus.set(t.status, []);
    byStatus.get(t.status)!.push(t);
  }

  const repoRoot = repoRootFromWebCwd();
  const projectRecentFiles = listRepoFiles({
    absDir: `${repoRoot}/projects/${project.id}/files`,
    relPrefix: `projects/${project.id}/files`,
    limit: 10,
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <p className="mt-2 text-white/60">{project.notes ?? ""}</p>
        </div>
        <a href={`${BASE_PATH}/projects/`} className="text-sm text-white/60 hover:text-white">
          ← Projects
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Status</div>
          <div className="mt-2 font-medium">{project.status}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Priority</div>
          <div className="mt-2 font-medium">{project.priority}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Owner</div>
          <div className="mt-2 font-medium">{project.owner}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Due</div>
          <div className="mt-2 font-medium">{project.due ?? "—"}</div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-white/60">Next action</div>
        <div className="mt-2 font-medium">{project.next_action}</div>
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <a href={`${BASE_PATH}/tasks/`} className="text-sm text-white/60 hover:text-white">
            All tasks →
          </a>
        </div>

        <div className="mt-4 space-y-6">
          {columns.map((status) => {
            const list = byStatus.get(status) ?? [];
            return (
              <section key={status}>
                <div className="flex items-end justify-between">
                  <h3 className="text-sm font-semibold text-white/80">{STATUS_LABELS[status] ?? status}</h3>
                  <div className="text-sm text-white/50">{list.length}</div>
                </div>

                <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
                  <div className="divide-y divide-white/10">
                    {list.length === 0 ? (
                      <div className="p-4 text-sm text-white/50">No tasks.</div>
                    ) : (
                      list
                        .slice()
                        .sort((a, b) => {
                          const prRank: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
                          return (prRank[a.priority] ?? 9) - (prRank[b.priority] ?? 9);
                        })
                        .map((t) => (
                          <div key={t.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <div className="font-medium text-white/95">{t.title}</div>
                              <div className="mt-1 text-sm text-white/60">
                                {t.next_step ? <span className="text-white/50">{t.next_step}</span> : null}
                                {t.blocked_by ? <span className="text-white/40"> · Blocked by: {t.blocked_by}</span> : null}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <Badge tone={toneForTaskStatus(t.status)}>{t.status}</Badge>
                              <Badge tone={toneForTaskPriority(t.priority)}>{t.priority}</Badge>
                              <Badge>{t.area}</Badge>
                              <Badge>{t.owner}</Badge>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Uploads</div>
        <div className="mt-1 text-sm text-white/60">
          Add project files (e.g., transcripts, screenshots, specs) to:
          <span className="ml-2 font-mono text-white/70">projects/{project.id}/files/</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={githubUploadUrl(`projects/${project.id}/files`)}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            Upload files
          </a>
          <a
            href={githubTreeUrl(`projects/${project.id}/files`)}
            className="rounded-lg border border-white/15 bg-white/0 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5"
          >
            View folder
          </a>
        </div>
        <FileList title="Recent files" files={projectRecentFiles} />
      </div>

      {project.id === "insight-x-pipeline" ? (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Latest outputs</div>
          <div className="mt-1 text-sm text-white/60">
            Section-by-section summaries + X drafts are saved under
            <span className="ml-2 font-mono text-white/70">projects/insight-x-pipeline/runs/</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={githubFileUrl("projects/insight-x-pipeline/runs/LATEST.md")}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
            >
              Open latest index
            </a>
            <a
              href={githubTreeUrl("projects/insight-x-pipeline/runs")}
              className="rounded-lg border border-white/15 bg-white/0 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5"
            >
              View runs folder
            </a>
          </div>
        </div>
      ) : null}

      {project.links?.length ? (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-white/80">Links</h2>
          <ul className="mt-3 space-y-2">
            {project.links.map((l) => (
              <li key={l.url}>
                <a className="text-sm underline underline-offset-4 hover:text-white/90" href={l.url}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </main>
  );
}
