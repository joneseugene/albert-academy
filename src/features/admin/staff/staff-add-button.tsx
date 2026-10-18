
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResourceModal } from "@/components/resource/resource-modal";

import { StaffForm } from "./staff-form";
import type { StaffFormActions } from "./staff-form";

interface StaffAddButtonProps extends StaffFormActions {
  onCreated: () => void | Promise<void>;
}

export function StaffAddButton({
  createAction,
  updateAction,
  onCreated,
}: StaffAddButtonProps) {
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
        Add staff member
      </Button>

      <ResourceModal
        open={open}
        onOpenChange={setOpen}
        title="Add staff member"
        description="Add a staff member to the school website."
        formId="staff-create-form"
        submitLabel="Create"
      >
        {open ? (
          <StaffForm
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
