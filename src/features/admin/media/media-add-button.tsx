
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResourceModal } from "@/components/resource/resource-modal";

import { MediaForm } from "./media-form";
import type { MediaFormActions } from "./media-form";

interface MediaAddButtonProps extends MediaFormActions {
  onCreated: () => void | Promise<void>;
}

export function MediaAddButton({
  createAction,
  updateAction,
  onCreated,
}: MediaAddButtonProps) {
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
        Add media
      </Button>

      <ResourceModal
        open={open}
        onOpenChange={setOpen}
        title="Add media"
        description="Add a photo or media item to the school website."
        formId="media-create-form"
        submitLabel="Create"
      >
        {open ? (
          <MediaForm
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
