import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

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
  links?: ProjectLink[];
  notes?: string;
};

type ProjectsFile = { projects: Project[] };

export function loadProjects(): Project[] {
  // During build, cwd is /.../web
  const filePath = path.resolve(process.cwd(), "..", "data", "projects.yaml");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(raw) as ProjectsFile;
  return parsed?.projects ?? [];
}

export function getProjectById(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}
