export const REPO_OWNER = "rileydrakedesign";
export const REPO_NAME = "Heimdall-hub";
export const REPO_BRANCH = "main";

export function githubUploadUrl(dirPath: string) {
  // Example: https://github.com/<owner>/<repo>/upload/<branch>/<dir>
  const clean = dirPath.replace(/^\/+/, "").replace(/\/+$/, "");
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/upload/${REPO_BRANCH}/${clean}`;
}

export function githubTreeUrl(dirPath: string) {
  const clean = dirPath.replace(/^\/+/, "").replace(/\/+$/, "");
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/${REPO_BRANCH}/${clean}`;
}

export function githubRawUrl(filePath: string) {
  const clean = filePath.replace(/^\/+/, "");
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${clean}`;
}
