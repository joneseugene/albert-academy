"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResourceModal } from "@/components/resource/resource-modal";

import { NotableForm } from "./notable-form";
import type { NotableFormActions } from "./notable-form";

interface NotableAddButtonProps extends NotableFormActions {
  onCreated: () => void | Promise<void>;
}

export function NotableAddButton({
  createAction,
  updateAction,
  onCreated,
}: NotableAddButtonProps) {
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
        Add notable person
      </Button>

      <ResourceModal
        open={open}
        onOpenChange={setOpen}
        title="Add notable person"
        description="Add a distinguished person to the school website."
        formId="notable-create-form"
        submitLabel="Create"
      >
        {open ? (
          <NotableForm
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