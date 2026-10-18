
"use client";

import type { PermissionKey } from "@/lib/auth/permissions";
import { ResourceManagementView } from "@/components/resource/resource-management-view";
import type { ResourceViewProps } from "@/components/resource/types";

import { NotableForm, type NotableFormActions } from "./notable-form";
import { NotableAddButton } from "./notable-add-button";
import type { NotableResourceItem } from "./notable-resource";
import { notableResource } from "./notable-resource";

type DeleteNotableAction = (
  id: string,
) => Promise<{ success: boolean; message: string }>;

export type NotableResourceViewProps = Omit<
  ResourceViewProps<NotableResourceItem>,
  | "resource"
  | "toolbarActions"
  | "onCreate"
  | "onRefresh"
> & {
  onRefresh: () => void | Promise<void>;
  canCreate: boolean;
  userPermissions: PermissionKey[];
  deleteAction: DeleteNotableAction;
} & NotableFormActions;

export function NotableResourceView({
  onRefresh,
  canCreate,
  userPermissions,
  createAction,
  updateAction,
  deleteAction,
  ...props
}: NotableResourceViewProps) {
  return (
    <ResourceManagementView<
      NotableResourceItem,
      NotableFormActions
    >
      {...props}
      data={props.data}
      selectedRows={props.selectedRows}
      onSelectionChange={props.onSelectionChange}
      userPermissions={userPermissions}
      resource={notableResource}
      eventName="notable"
      editTitle="Edit notable person"
      editDescription="Update this person's profile and biography."
      deleteTitle="Delete notable person?"
      deleteDescription={(row) => (
        <>
          Are you sure you want to delete{" "}
          <strong>{row.name}</strong>? This action cannot be undone.
        </>
      )}
      AddButtonComponent={NotableAddButton}
      FormComponent={NotableForm}
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
