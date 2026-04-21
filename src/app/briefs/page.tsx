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
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Briefs</h1>
        <p className="mt-1 text-sm text-muted">
          Morning brief runs saved to{" "}
          <span className="font-mono text-foreground/70">projects/daily-debrief/runs/</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href={githubFileUrl("data/briefs.yaml")}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:bg-surface-light hover:text-foreground transition-colors"
        >
          Edit brief config
        </a>
        <a
          href={githubTreeUrl("projects/daily-debrief/runs")}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:bg-surface-light hover:text-foreground transition-colors"
        >
          View runs folder
        </a>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <FileList title="Recent briefs" files={runs} />
      </div>
    </main>
  );
}
