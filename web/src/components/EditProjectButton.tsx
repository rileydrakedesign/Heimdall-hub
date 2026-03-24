"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { ProjectForm } from "./ProjectForm";
import type { Project } from "@/lib/project-types";

export function EditProjectButton({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground hover:bg-surface-light transition-colors"
      >
        Edit
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Edit Project">
        <ProjectForm project={project} onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
