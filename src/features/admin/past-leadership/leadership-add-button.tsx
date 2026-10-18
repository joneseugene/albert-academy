
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResourceModal } from "@/components/resource/resource-modal";
import type { PastLeadershipFormActions } from "./leadership-form";
import { PastLeadershipForm } from "./leadership-form";


interface PastLeadershipAddButtonProps extends PastLeadershipFormActions {
  onCreated: () => void | Promise<void>;
}

export function PastLeadershipAddButton({
  createAction,
  updateAction,
  onCreated,
}: PastLeadershipAddButtonProps) {
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
        Add past leader
      </Button>

      <ResourceModal
        open={open}
        onOpenChange={setOpen}
        title="Add past leader"
        description="Record a former school leader and their service."
        formId="past-leadership-create-form"
        submitLabel="Create"
      >
        {open ? (
          <PastLeadershipForm
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
