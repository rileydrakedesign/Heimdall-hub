import fs from "node:fs";
import path from "node:path";

export type ListedFile = {
  name: string;
  relPath: string; // repo-relative path
  ext: string;
  bytes: number;
  mtimeMs: number;
};

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i + 1).toLowerCase();
}

export function listRepoFiles(opts: {
  // absolute dir on disk
  absDir: string;
  // repo-relative path prefix, e.g. "kb/uploads"
  relPrefix: string;
  limit?: number;
}): ListedFile[] {
  const { absDir, relPrefix, limit = 12 } = opts;

  if (!fs.existsSync(absDir)) return [];

  const entries = fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => {
      const abs = path.join(absDir, e.name);
      const st = fs.statSync(abs);
      return {
        name: e.name,
        relPath: `${relPrefix.replace(/\/+$/, "")}/${e.name}`,
        ext: extOf(e.name),
        bytes: st.size,
        mtimeMs: st.mtimeMs,
      } satisfies ListedFile;
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  return entries.slice(0, limit);
}

export function repoRootFromWebCwd() {
  // During Next build, process.cwd() is typically /.../web
  return path.resolve(process.cwd(), "..");
}
