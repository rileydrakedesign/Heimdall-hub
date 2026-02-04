import { BASE_PATH } from "@/lib/basePath";
import { githubTreeUrl, githubUploadUrl } from "@/lib/repo";
import { getProjectById, loadProjects } from "@/lib/projects";

export const dynamic = "force-static";

export function generateStaticParams() {
  return loadProjects().map((p) => ({ id: p.id }));
}

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

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Uploads</div>
        <div className="mt-1 text-sm text-white/60">
          Add project files (e.g., transcripts) to this folder:
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
      </div>

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
