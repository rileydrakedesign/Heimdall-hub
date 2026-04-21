"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { ProjectForm } from "./ProjectForm";

export function CreateProjectButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
      >
        + New Project
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="New Project">
        <ProjectForm onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
