"use client";

import { useActionState, useEffect, useState } from "react";
import { createProject, updateProject, type ActionResult } from "@/lib/actions";
import { VALID_PROJECT_STATUSES, VALID_PROJECT_PRIORITIES } from "@/lib/constants";
import type { Project } from "@/lib/project-types";
import { TextInput, TextArea, SelectField, DateInput, FormActions } from "./FormField";
import { useToast } from "./ToastProvider";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProjectForm({
  project,
  onClose,
}: {
  project?: Project;
  onClose: () => void;
}) {
  const action = project ? updateProject : createProject;
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(action, { ok: false });
  const { addToast } = useToast();
  const [slug, setSlug] = useState(project?.id ?? "");

  useEffect(() => {
    if (state.ok) {
      addToast(project ? "Project updated" : "Project created");
      onClose();
    } else if (state.error) {
      addToast(state.error, "error");
    }
  }, [state, project, onClose, addToast]);

  return (
    <form action={formAction} className="space-y-4">
      {project && <input type="hidden" name="project_id" value={project.id} />}

      <div>
        <label className="block">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">
            Name <span className="text-rose-400">*</span>
          </span>
          <input
            type="text"
            name="name"
            defaultValue={project?.name}
            required
            onChange={(e) => {
              if (!project) setSlug(slugify(e.target.value));
            }}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </label>
      </div>

      {!project && (
        <div>
          <label className="block">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              ID / Slug <span className="text-rose-400">*</span>
            </span>
            <input
              type="text"
              name="id"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </label>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Status"
          name="status"
          required
          defaultValue={project?.status ?? "idea"}
          options={VALID_PROJECT_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <SelectField
          label="Priority"
          name="priority"
          required
          defaultValue={project?.priority ?? "medium"}
          options={VALID_PROJECT_PRIORITIES.map((p) => ({ value: p, label: p }))}
        />
      </div>

      <TextInput label="Owner" name="owner" defaultValue={project?.owner ?? "Riley"} />

      <TextInput
        label="Next Action"
        name="next_action"
        defaultValue={project?.next_action}
        required
      />

      <DateInput label="Due" name="due" defaultValue={project?.due ?? undefined} />

      <TextArea label="Notes" name="notes" defaultValue={project?.notes ?? ""} />

      <FormActions onCancel={onClose} submitLabel={project ? "Update" : "Create"} pending={pending} />
    </form>
  );
}
