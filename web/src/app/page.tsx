import { BASE_PATH } from "@/lib/basePath";
import { loadProjects } from "@/lib/projects";
import { listRepoFiles, repoRootFromWebCwd } from "@/lib/fsList";
import { FileList } from "@/components/FileList";
import { Badge } from "@/components/Badge";

import { githubUploadUrl, githubTreeUrl } from "@/lib/repo";

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function toneForStatus(status: string) {
  if (status === "active") return "green" as const;
  if (status === "paused") return "yellow" as const;
  if (status === "done") return "blue" as const;
  return "neutral" as const;
}

function toneForPriority(priority: string) {
  if (priority === "urgent") return "red" as const;
  if (priority === "high") return "yellow" as const;
  return "neutral" as const;
}

export default function Dashboard() {
  const projects = loadProjects();
  const active = projects.filter((p) => p.status === "active");
  const paused = projects.filter((p) => p.status === "paused");
  const done = projects.filter((p) => p.status === "done");

  const repoRoot = repoRootFromWebCwd();
  const kbRecent = listRepoFiles({
    absDir: `${repoRoot}/kb/uploads`,
    relPrefix: "kb/uploads",
    limit: 8,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Heimdall Hub</h1>
          <p className="mt-2 text-white/60">
            Private dashboard + shared knowledge base.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={`${BASE_PATH}/projects/`}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            View projects
          </a>
          <a
            href={`${BASE_PATH}/tasks/`}
            className="rounded-lg border border-white/15 bg-white/0 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5"
          >
            View tasks
          </a>
          <a
            href={`${BASE_PATH}/briefs/`}
            className="rounded-lg border border-white/15 bg-white/0 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5"
          >
            View briefs
          </a>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total projects" value={projects.length} />
        <StatCard title="Active" value={active.length} />
        <StatCard title="Paused" value={paused.length} />
        <StatCard title="Done" value={done.length} />
      </section>

      <section className="mt-10">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Knowledge Base</div>
            <div className="mt-1 text-sm text-white/60">
              Upload shared reference files (transcripts, notes, docs).
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={githubUploadUrl("kb/uploads")}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
              >
                Upload files
              </a>
              <a
                href={githubTreeUrl("kb/uploads")}
                className="rounded-lg border border-white/15 bg-white/0 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5"
              >
                View folder
              </a>
            </div>
            <div className="mt-3 text-xs text-white/40">
              Tip: uploads go straight to the GitHub repo (private).
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Project Uploads</div>
            <div className="mt-1 text-sm text-white/60">
              Each project has a <span className="font-medium text-white/80">files/</span> folder for inputs.
            </div>
            <div className="mt-4 text-sm text-white/60">
              Open any project to upload transcripts/specs to its folder.
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">Next actions</h2>
          <a href={`${BASE_PATH}/projects/`} className="text-sm text-white/60 hover:text-white">
            All projects →
          </a>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <div className="divide-y divide-white/10">
            {projects
              .slice()
              .sort((a, b) => {
                // active first, then urgent/high priorities
                const statusRank: Record<string, number> = { active: 0, idea: 1, paused: 2, done: 3 };
                const prRank: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
                const sr = (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9);
                if (sr !== 0) return sr;
                return (prRank[a.priority] ?? 9) - (prRank[b.priority] ?? 9);
              })
              .map((p) => (
                <div key={p.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <a href={`${BASE_PATH}/projects/${p.id}/`} className="font-medium hover:underline">
                      {p.name}
                    </a>
                    <div className="mt-1 text-sm text-white/60">{p.next_action}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge tone={toneForStatus(p.status)}>{p.status}</Badge>
                    <Badge tone={toneForPriority(p.priority)}>{p.priority}</Badge>
                    <Badge>{p.owner}</Badge>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <FileList title="Recent KB uploads" files={kbRecent} />
      </section>
    </main>
  );
}
