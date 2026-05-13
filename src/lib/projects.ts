import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export type { ProjectStatus, ProjectPriority, Project } from "./project-types";
export { VALID_PROJECT_STATUSES, VALID_PROJECT_PRIORITIES } from "./constants";

import type { Project } from "./project-types";

type ProjectsFile = { projects: Project[] };

function loadProjectsFromYaml(): Project[] {
  const filePath = path.resolve(process.cwd(), "data", "projects.yaml");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(raw) as ProjectsFile | null;
    return parsed?.projects ?? [];
  } catch (e) {
    console.error("[projects] Failed to load projects.yaml:", e);
    return [];
  }
}

export async function loadProjectsAsync(): Promise<Project[]> {
  return loadProjectsFromYaml();
}

export function loadProjects(): Project[] {
  return loadProjectsFromYaml();
}

export function getProjectById(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}
