import { REPO_BRANCH, REPO_NAME, REPO_OWNER } from "@/lib/repo";

export function githubFileUrl(filePath: string) {
  const clean = filePath.replace(/^\/+/, "");
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${REPO_BRANCH}/${clean}`;
}
