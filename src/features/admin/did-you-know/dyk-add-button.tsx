"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResourceModal } from "@/components/resource/resource-modal";

import { DidYouKnowForm } from "./dyk-form";
import type { DidYouKnowFormActions } from "./dyk-form";

interface DidYouKnowAddButtonProps extends DidYouKnowFormActions {
  onCreated: () => void | Promise<void>;
}

export function DidYouKnowAddButton({
  createAction,
  updateAction,
  onCreated,
}: DidYouKnowAddButtonProps) {
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
        Add fact
      </Button>

      <ResourceModal
        open={open}
        onOpenChange={setOpen}
        title="Add a fact"
        description="Add an interesting fact about Albert Academy to the school website."
        formId="did-you-know-create-form"
        submitLabel="Create"
      >
        {open ? (
          <DidYouKnowForm
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
