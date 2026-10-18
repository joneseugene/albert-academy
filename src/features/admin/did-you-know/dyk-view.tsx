"use client";

import type { PermissionKey } from "@/lib/auth/permissions";
import { ResourceManagementView } from "@/components/resource/resource-management-view";
import type { ResourceViewProps } from "@/components/resource/types";
import { didYouKnowResource, type DidYouKnowResourceItem } from "./dyk-resource";
import { DidYouKnowForm, type DidYouKnowFormActions } from "./dyk-form";
import { DidYouKnowAddButton } from "./dyk-add-button";

// ============================================================
// TYPES
// ============================================================

type DeleteDidYouKnowAction = (
  id: string,
) => Promise<{
  success: boolean;
  message: string;
}>;

type DidYouKnowResourceViewProps = Omit<
  ResourceViewProps<DidYouKnowResourceItem>,
  "resource" | "toolbarActions" | "onCreate" | "onRefresh"
> & {
  onRefresh: () => void | Promise<void>;
  canCreate: boolean;
  userPermissions: PermissionKey[];
  deleteAction: DeleteDidYouKnowAction;
} & DidYouKnowFormActions;

// ============================================================
// RESOURCE VIEW
// ============================================================

export function DidYouKnowResourceView({
  data,
  selectedRows,
  onSelectionChange,
  onRefresh,
  canCreate,
  userPermissions,
  createAction,
  updateAction,
  deleteAction,
  ...resourceViewProps
}: DidYouKnowResourceViewProps) {
  return (
    <ResourceManagementView<
      DidYouKnowResourceItem,
      DidYouKnowFormActions
    >
      {...resourceViewProps}
      data={data}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      userPermissions={userPermissions}
      resource={didYouKnowResource}
      eventName="did-you-know"
      editTitle="Edit fact"
      editDescription="Update this Did You Know fact."
      deleteTitle="Delete fact?"
      deleteDescription={(row) => (
        <>
          Are you sure you want to delete{" "}
          <strong>{row.title}</strong>? This action cannot be undone.
        </>
      )}
      AddButtonComponent={DidYouKnowAddButton}
      FormComponent={DidYouKnowForm}
      actions={{
        createAction,
        updateAction,
      }}
      deleteAction={deleteAction}
      onRefresh={onRefresh}
      canCreate={canCreate}
    />
  );
}