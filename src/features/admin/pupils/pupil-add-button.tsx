
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResourceModal } from "@/components/resource/resource-modal";
import type { PupilFormActions } from "./pupil-form";
import { PupilForm } from "./pupil-form";


interface PupilAddButtonProps extends PupilFormActions {
  onCreated: () => void | Promise<void>;
}

export function PupilAddButton({
  createAction,
  updateAction,
  onCreated,
}: PupilAddButtonProps) {
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
        Add student
      </Button>

      <ResourceModal
        open={open}
        onOpenChange={setOpen}
        title="Add student"
        description="Add a student leadership or student table record."
        formId="student-table-create-form"
        submitLabel="Create"
      >
        {open ? (
          <PupilForm
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
