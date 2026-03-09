import { BASE_PATH } from "@/lib/basePath";
import { loadProjects } from "@/lib/projects";
import { loadTasks, type Task, type TaskStatus } from "@/lib/tasks";
import { Badge } from "@/components/Badge";

export const dynamic = "force-static";

function toneForStatus(status: TaskStatus) {
  if (status === "in_progress") return "green" as const;
  if (status === "blocked") return "red" as const;
  if (status === "done") return "blue" as const;
  return "neutral" as const;
}

function toneForPriority(priority: Task["priority"]) {
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

const STATUS_ORDER: TaskStatus[] = ["backlog", "in_progress", "blocked", "done"];

function TaskRow({ task }: { task: Task }) {
  const projects = loadProjects();
  const project = task.project_id ? projects.find((p) => p.id === task.project_id) : null;

  return (
    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="font-medium text-white/95">{task.title}</div>
        <div className="mt-1 text-sm text-white/60">
          {project ? (
            <a className="hover:underline" href={`${BASE_PATH}/projects/${project.id}/`}>
              {project.name}
            </a>
          ) : (
            <span className="text-white/50">Personal / Unassigned</span>
          )}
          {task.next_step ? <span className="text-white/40"> · {task.next_step}</span> : null}
          {task.blocked_by ? <span className="text-white/40"> · Blocked by: {task.blocked_by}</span> : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge tone={toneForStatus(task.status)}>{task.status}</Badge>
        <Badge tone={toneForPriority(task.priority)}>{task.priority}</Badge>
        <Badge>{task.area}</Badge>
        <Badge>{task.owner}</Badge>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const tasks = loadTasks();

  const byStatus = new Map<TaskStatus, Task[]>();
  for (const s of STATUS_ORDER) byStatus.set(s, []);
  for (const t of tasks) (byStatus.get(t.status) ?? byStatus.set(t.status, []).get(t.status)!).push(t);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-2 text-white/60">
            Source of truth: <span className="font-mono text-white/70">data/tasks.yaml</span>
          </p>
        </div>
        <a href={`${BASE_PATH}/`} className="text-sm text-white/60 hover:text-white">
          ← Dashboard
        </a>
      </div>

      <div className="mt-8 space-y-6">
        {STATUS_ORDER.map((status) => {
          const list = byStatus.get(status) ?? [];
          return (
            <section key={status}>
              <div className="flex items-end justify-between">
                <h2 className="text-lg font-semibold">{STATUS_LABELS[status]}</h2>
                <div className="text-sm text-white/50">{list.length}</div>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
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
                      .map((t) => <TaskRow key={t.id} task={t} />)
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
