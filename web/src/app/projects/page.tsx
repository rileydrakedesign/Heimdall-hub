import Link from "next/link";
import { loadProjects } from "@/lib/projects";

export const dynamic = "force-static";

export default function ProjectsPage() {
  const projects = loadProjects();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-2 text-white/60">Source of truth: data/projects.yaml</p>
        </div>
        <Link href="/" className="text-sm text-white/60 hover:text-white">
          ← Dashboard
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}/`}
            className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="mt-1 text-sm text-white/60">{p.next_action}</div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-2 py-1">{p.status}</span>
                <span className="rounded-full bg-white/10 px-2 py-1">{p.priority}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
