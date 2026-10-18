"use client";

import { useRef, useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResourceModal } from "@/components/resource/resource-modal";

import {
  UserForm,
  type UserRoleOption,
} from "./user-form";

interface AddUserButtonProps {
  roles: UserRoleOption[];
  onCreated?: () => void | Promise<void>;
}

export function AddUserButton({
  roles,
  onCreated,
}: AddUserButtonProps) {
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] =
    useState<string | null>(null);

  const refreshInProgress = useRef(false);

  const handleSuccess = async () => {
    setOpen(false);

    if (!onCreated || refreshInProgress.current) {
      return;
    }

    refreshInProgress.current = true;
    setRefreshing(true);
    setRefreshError(null);

    try {
      await onCreated();
    } catch {
      setRefreshError(
        "The user was saved, but the list could not be refreshed. Click Refresh to try again.",
      );
    } finally {
      refreshInProgress.current = false;
      setRefreshing(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (refreshing) {
      return;
    }

    setOpen(nextOpen);

    if (nextOpen) {
      setRefreshError(null);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="pt-1">
        <Button
          type="button"
          disabled={refreshing}
          onClick={() => {
            setRefreshError(null);
            setOpen(true);
          }}
        >
          <UserPlus
            aria-hidden="true"
            className="size-4"
          />

          <span>
            {refreshing
              ? "Refreshing users..."
              : "Add user"}
          </span>
        </Button>
      </div>

      {refreshError ? (
        <p
          role="alert"
          className="max-w-sm text-xs text-destructive"
        >
          {refreshError}
        </p>
      ) : null}

      <ResourceModal
        open={open}
        onOpenChange={handleOpenChange}
        title="Add user"
        description="Create a new user account for the platform."
        formId="users-create-form"
        submitLabel="Invite User"
      >
        {open ? (
          <UserForm
            mode="create"
            roles={roles}
            onSuccess={() => {
              void handleSuccess();
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        ) : null}
      </ResourceModal>
    </div>
  );
}