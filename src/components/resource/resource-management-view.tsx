"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ResourceView } from "@/components/resource/resource-view";
import { ResourceModal } from "@/components/resource/resource-modal";
import type {
  ResourceViewProps,
  ResourceFormProps,
} from "@/components/resource/types";

export interface ResourceManagementItem {
  id: string;
  name?: string | null;
  title?: string | null;
}

type ActionResult = {
  success: boolean;
  message?: string;
};

interface ResourceManagementViewProps<
  TRow extends ResourceManagementItem,
  TActions extends object,
> extends Omit<
    ResourceViewProps<TRow>,
    "resource" | "toolbarActions" | "onCreate" | "onRefresh"
  > {
  resource: NonNullable<ResourceViewProps<TRow>["resource"]>;
  eventName: string;
  editTitle: string;
  editDescription: string;
  deleteTitle: string;
  deleteDescription: (row: TRow) => ReactNode;
  AddButtonComponent: ComponentType<
    TActions & { onCreated: () => void | Promise<void> }
  >;
  FormComponent: ComponentType<ResourceFormProps<TRow> & TActions>;
  actions: TActions;
  deleteAction: (id: string) => Promise<ActionResult>;
  onRefresh: () => void | Promise<void>;
  canCreate: boolean;
}

export function ResourceManagementView<
  TRow extends ResourceManagementItem,
  TActions extends object,
>({
  resource,
  eventName,
  editTitle,
  editDescription,
  deleteTitle,
  deleteDescription,
  AddButtonComponent,
  FormComponent,
  actions,
  deleteAction,
  onRefresh,
  canCreate,
  ...props
}: ResourceManagementViewProps<TRow, TActions>) {
  const [editingRow, setEditingRow] = useState<TRow | null>(null);
  const [deletingRow, setDeletingRow] = useState<TRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const handleEdit = (event: Event) => {
      const row = (event as CustomEvent<TRow>).detail;

      if (row?.id) {
        setEditingRow(row);
      }
    };

    const handleDelete = (event: Event) => {
      const row = (event as CustomEvent<TRow>).detail;

      if (row?.id) {
        setDeleteError(null);
        setDeletingRow(row);
      }
    };

    window.addEventListener(`${eventName}:edit`, handleEdit);
    window.addEventListener(`${eventName}:delete`, handleDelete);

    return () => {
      window.removeEventListener(`${eventName}:edit`, handleEdit);
      window.removeEventListener(`${eventName}:delete`, handleDelete);
    };
  }, [eventName]);

  const handleDelete = useCallback(async () => {
    if (!deletingRow || deleting) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteAction(deletingRow.id);

      if (!result.success) {
        setDeleteError(result.message || "Unable to delete this record.");
        return;
      }

      setDeletingRow(null);
      await onRefresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }, [deletingRow, deleting, deleteAction, onRefresh]);

  const handleEditSuccess = useCallback(async () => {
    setEditingRow(null);
    await onRefresh();
  }, [onRefresh]);

  return (
    <>
      <ResourceView<TRow>
        {...props}
        resource={resource}
        onRefresh={onRefresh}
        toolbarActions={
          <>
            {resource.toolbar?.actions}
            {canCreate ? (
              <AddButtonComponent
                {...actions}
                onCreated={onRefresh}
              />
            ) : null}
          </>
        }
      />

      <ResourceModal
        open={editingRow !== null}
        onOpenChange={(open) => {
          if (!open) setEditingRow(null);
        }}
        title={editTitle}
        description={editDescription}
        formId={`${eventName}-edit-form`}
        submitLabel="Save changes"
      >
        {editingRow ? (
          <FormComponent
            key={editingRow.id}
            mode="edit"
            row={editingRow}
            {...actions}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingRow(null)}
          />
        ) : null}
      </ResourceModal>

      <AlertDialog
        open={deletingRow !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeletingRow(null);
            setDeleteError(null);
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle
                className="size-5 text-destructive"
                aria-hidden="true"
              />
            </div>

            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>

            <AlertDialogDescription>
              {deletingRow ? deleteDescription(deletingRow) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError ? (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {deleteError}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting || !deletingRow}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
