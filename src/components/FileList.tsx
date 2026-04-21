import { githubFileUrl } from "@/lib/runs";
import { githubRawUrl } from "@/lib/repo";
import type { ListedFile } from "@/lib/fsList";

function isImageExt(ext: string) {
  return ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext);
}

export function FileList({
  title,
  files,
}: {
  title: string;
  files: ListedFile[];
}) {
  if (!files.length) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
      <div className="flex items-center justify-between bg-white/5 px-4 py-3">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-white/50">{files.length} shown</div>
      </div>
      <div className="divide-y divide-white/10">
        {files.map((f) => {
          const img = isImageExt(f.ext);
          return (
            <div key={f.relPath} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{f.name}</div>
                <div className="mt-1 text-xs text-white/50">
                  {f.ext ? f.ext.toUpperCase() : "FILE"} • {(f.bytes / 1024).toFixed(0)} KB
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {img ? (
                  <a
                    href={githubRawUrl(f.relPath)}
                    className="rounded-lg border border-white/15 bg-white/0 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/5"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Preview
                  </a>
                ) : null}
                <a
                  href={githubFileUrl(f.relPath)}
                  className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-black hover:bg-white/90"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
