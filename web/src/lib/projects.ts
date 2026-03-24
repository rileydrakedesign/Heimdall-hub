import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { isSupabaseConfigured, getBrowserClient } from "./supabase";

// Re-export types and constants so existing imports keep working
export type { ProjectStatus, ProjectPriority, ProjectLink, Project } from "./project-types";
export { VALID_PROJECT_STATUSES, VALID_PROJECT_PRIORITIES } from "./constants";

import type { Project } from "./project-types";

type ProjectsFile = { projects: Project[] };

// ---------------------------------------------------------------------------
// YAML loader (static export / fallback)
// ---------------------------------------------------------------------------
function loadProjectsFromYaml(): Project[] {
  const filePath = path.resolve(process.cwd(), "..", "data", "projects.yaml");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(raw) as ProjectsFile;
  return parsed?.projects ?? [];
}

// ---------------------------------------------------------------------------
// Supabase loader
// ---------------------------------------------------------------------------
async function loadProjectsFromDb(): Promise<Project[]> {
  const { data, error } = await getBrowserClient()
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Project[];
}

// ---------------------------------------------------------------------------
// Public API — sync for now (YAML), async-ready for DB
// ---------------------------------------------------------------------------

export async function loadProjectsAsync(): Promise<Project[]> {
  if (isSupabaseConfigured()) return loadProjectsFromDb();
  return loadProjectsFromYaml();
}

/** Synchronous loader — works only in YAML/static mode. */
export function loadProjects(): Project[] {
  return loadProjectsFromYaml();
}

export function getProjectById(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}
