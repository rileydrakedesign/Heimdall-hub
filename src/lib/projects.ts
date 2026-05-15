import { getServiceClient } from "./supabase";

export type { ProjectStatus, ProjectPriority, Project } from "./project-types";
export { VALID_PROJECT_STATUSES, VALID_PROJECT_PRIORITIES } from "./constants";

import type { Project } from "./project-types";

export async function loadProjectsAsync(): Promise<Project[]> {
  const { data, error } = await getServiceClient()
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(`Could not load projects from Supabase: ${error.message}`);
  }
  return (data ?? []) as Project[];
}
