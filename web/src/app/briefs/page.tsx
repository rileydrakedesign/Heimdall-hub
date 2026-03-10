import { BASE_PATH } from "@/lib/basePath";
import { FileList } from "@/components/FileList";
import { listRepoFiles, repoRootFromWebCwd } from "@/lib/fsList";
import { githubTreeUrl } from "@/lib/repo";
import { githubFileUrl } from "@/lib/runs";

export const dynamic = "force-static";

export default function BriefsPage() {
  const repoRoot = repoRootFromWebCwd();
  const runs = listRepoFiles({
    absDir: `${repoRoot}/projects/daily-debrief/runs`,
    relPrefix: "projects/daily-debrief/runs",
    limit: 30,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Briefs</h1>
          <p className="mt-2 text-white/60">
            Morning brief runs saved to <span className="font-mono text-white/70">projects/daily-debrief/runs/</span>
          </p>
        </div>
        <a href={`${BASE_PATH}/`} className="text-sm text-white/60 hover:text-white">
          ← Dashboard
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={githubFileUrl("data/briefs.yaml")}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
        >
          Edit brief config
        </a>
        <a
          href={githubTreeUrl("projects/daily-debrief/runs")}
          className="rounded-lg border border-white/15 bg-white/0 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5"
        >
          View runs folder
        </a>
      </div>

      <div className="mt-8">
        <FileList title="Recent briefs" files={runs} />
      </div>
    </main>
  );
}
