import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { isSupabaseConfigured, getServiceClient } from "./supabase";

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

async function loadProjectsFromDb(): Promise<Project[]> {
  const { data, error } = await getServiceClient()
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function loadProjectsAsync(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    try {
      return await loadProjectsFromDb();
    } catch (e) {
      console.error("[projects] Supabase load failed, falling back to YAML:", e);
      return loadProjectsFromYaml();
    }
  }
  return loadProjectsFromYaml();
}

export function loadProjects(): Project[] {
  return loadProjectsFromYaml();
}

export function getProjectById(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}
