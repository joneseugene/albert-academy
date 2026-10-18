"use client";

import type { RowData } from "@tanstack/react-table";

import { ResourceModal } from "./resource-modal";

import type {
  ResourceDefinition,
  ResourceFormMode,
} from "./types";

interface ResourceFormModalProps<
  TData extends RowData,
> {
  resource: ResourceDefinition<TData>;

  mode: ResourceFormMode;

  open: boolean;

  row?: TData;

  onOpenChange: (
    open: boolean,
  ) => void;

  onSuccess?: (
    data?: TData,
  ) => void;
}

export function ResourceFormModal<
  TData extends RowData,
>({
  resource,
  mode,
  open,
  row,
  onOpenChange,
  onSuccess,
}: ResourceFormModalProps<TData>) {
  const config =
    mode === "create"
      ? resource.create
      : resource.edit;

  if (!config) {
    return null;
  }

  const Form = config.component;

  const formId =
    `${resource.key}-${mode}-form`;

  const handleSuccess = (
    data?: TData,
  ) => {
    onSuccess?.(data);
    onOpenChange(false);
  };

  return (
    <ResourceModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        config.title ??
        (mode === "create"
          ? `Add ${resource.title}`
          : `Edit ${resource.title}`)
      }
      description={config.description}
      formId={formId}
      submitLabel={
        config.submitLabel ??
        (mode === "create"
          ? "Create"
          : "Save changes")
      }
    >
      <Form
        mode={mode}
        row={row}
        onSuccess={handleSuccess}
        onCancel={() =>
          onOpenChange(false)
        }
      />
    </ResourceModal>
  );
}

