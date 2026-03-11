import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { isSupabaseConfigured, getBrowserClient } from "./supabase";

export type ProjectStatus = "idea" | "active" | "paused" | "done";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export type ProjectLink = { label: string; url: string };

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  owner: string;
  next_action: string;
  due: string | null;

  board_columns?: Array<"backlog" | "in_progress" | "blocked" | "done">;

  links?: ProjectLink[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

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

/**
 * Load all projects. Uses Supabase when configured, YAML otherwise.
 * Returns a promise so callers can await when DB is active.
 */
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
