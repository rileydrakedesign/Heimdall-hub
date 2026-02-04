import Link from "next/link";
import { loadProjects } from "@/lib/projects";

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const projects = loadProjects();
  const active = projects.filter((p) => p.status === "active");
  const paused = projects.filter((p) => p.status === "paused");
  const done = projects.filter((p) => p.status === "done");

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
          <Link
            href="/projects"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            View projects
          </Link>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total projects" value={projects.length} />
        <StatCard title="Active" value={active.length} />
        <StatCard title="Paused" value={paused.length} />
        <StatCard title="Done" value={done.length} />
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">Next actions</h2>
          <Link href="/projects" className="text-sm text-white/60 hover:text-white">
            All projects →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <div className="divide-y divide-white/10">
            {projects.map((p) => (
              <div key={p.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/projects/${p.id}`} className="font-medium hover:underline">
                    {p.name}
                  </Link>
                  <div className="text-sm text-white/60">{p.next_action}</div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="rounded-full bg-white/10 px-2 py-1">{p.status}</span>
                  <span className="rounded-full bg-white/10 px-2 py-1">{p.priority}</span>
                  <span className="rounded-full bg-white/10 px-2 py-1">{p.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
