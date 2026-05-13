import { Suspense } from "react";
import { loadProjectsAsync } from "@/lib/projects";
import { loadTasksAsync } from "@/lib/tasks";

export const dynamic = "force-dynamic";
import { StatusDot } from "@/components/StatusDot";
import { Badge } from "@/components/Badge";
import { StatusFilterTabs } from "@/components/StatusFilterTabs";
import { SortControl } from "@/components/SortControl";
import { CreateProjectButton } from "@/components/CreateProjectButton";
import { PERSONAL_PROJECT_ID } from "@/lib/constants";

async function ProjectsList({
  searchParams,
}: {
  searchParams: { status?: string; sort?: string };
}) {
  const [projects, tasks] = await Promise.all([loadProjectsAsync(), loadTasksAsync()]);
  const statusFilter = searchParams.status;
  const sort = searchParams.sort ?? "priority";

  const openCounts = new Map<string, number>();
  for (const t of tasks) {
    if (t.status === "done" || !t.project_id) continue;
    openCounts.set(t.project_id, (openCounts.get(t.project_id) ?? 0) + 1);
  }

  let filtered = statusFilter
    ? projects.filter((p) => p.status === statusFilter)
    : projects;

  const prRank: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
  const statusRank: Record<string, number> = { active: 0, paused: 1, idea: 2, done: 3 };

  filtered = filtered.slice().sort((a, b) => {
    // Personal always pinned to top
    if (a.id === PERSONAL_PROJECT_ID) return -1;
    if (b.id === PERSONAL_PROJECT_ID) return 1;
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "updated") {
      return (b.updated_at ?? "").localeCompare(a.updated_at ?? "");
    }
    const sr = (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9);
    if (sr !== 0) return sr;
    return (prRank[a.priority] ?? 9) - (prRank[b.priority] ?? 9);
  });

  const borderColor: Record<string, string> = {
    active: "border-l-emerald-500",
    paused: "border-l-amber-500",
    done: "border-l-sky-500",
    idea: "border-l-slate-500",
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {filtered.map((p) => {
        const open = openCounts.get(p.id) ?? 0;
        const isPersonal = p.id === PERSONAL_PROJECT_ID;
        return (
          <a
            key={p.id}
            href={`/projects/${p.id}`}
            className={`block rounded-lg border border-border border-l-2 ${borderColor[p.status] ?? "border-l-slate-500"} bg-surface p-4 hover:bg-surface-light transition-colors`}
          >
            <div className="flex items-center gap-2">
              <StatusDot status={p.status} />
              <span className="font-medium truncate">{p.name}</span>
              {isPersonal && (
                <span className="ml-auto text-[10px] uppercase tracking-wider text-muted">Pinned</span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted truncate">{p.next_action}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                tone={
                  p.priority === "urgent" ? "red" : p.priority === "high" ? "yellow" : "neutral"
                }
              >
                {p.priority}
              </Badge>
              <Badge>{open} open</Badge>
            </div>
          </a>
        );
      })}
      {filtered.length === 0 && (
        <div className="col-span-full rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
          No projects match this filter.
        </div>
      )}
    </div>
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted">All projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense>
            <StatusFilterTabs />
          </Suspense>
          <Suspense>
            <SortControl />
          </Suspense>
          <CreateProjectButton />
        </div>
      </div>

      <ProjectsList searchParams={params} />
    </main>
  );
}
