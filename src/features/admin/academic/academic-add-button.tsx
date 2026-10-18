
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResourceModal } from "@/components/resource/resource-modal";

import { AcademicForm } from "./academic-form";
import type { AcademicFormActions } from "./academic-form";

interface AcademicAddButtonProps extends AcademicFormActions {
  onCreated: () => void | Promise<void>;
}

export function AcademicAddButton({
  createAction,
  updateAction,
  onCreated,
}: AcademicAddButtonProps) {
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleSuccess() {
    setOpen(false);
    setIsRefreshing(true);

    try {
      await onCreated();
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isRefreshing}
      >
        <Plus className="mr-2 size-4" />
        Add academic
      </Button>

      <ResourceModal
        open={open}
        onOpenChange={setOpen}
        title="Add academic"
        description="Add academic information to the school website."
        formId="academic-create-form"
        submitLabel="Create"
      >
        {open ? (
          <AcademicForm
            mode="create"
            createAction={createAction}
            updateAction={updateAction}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        ) : null}
      </ResourceModal>
    </>
  );
}
