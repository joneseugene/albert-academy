"use client";

import type { PermissionKey } from "@/lib/auth/permissions";
import { ResourceManagementView } from "@/components/resource/resource-management-view";

import {
  staffResource,
  type StaffResourceItem,
} from "./staff-resource";
import { StaffAddButton } from "./staff-add-button";
import { StaffForm, type StaffFormActions } from "./staff-form";
import type { ResourceViewProps } from "@/components/resource/types";

type DeleteStaffAction = (
  id: string,
) => Promise<{
  success: boolean;
  message: string;
}>;

type Props = Omit<
  ResourceViewProps<StaffResourceItem>,
  "resource" | "toolbarActions" | "onCreate" | "onRefresh"
> & {
  onRefresh: () => void | Promise<void>;
  canCreate: boolean;
  userPermissions: PermissionKey[];
  deleteAction: DeleteStaffAction;
} & StaffFormActions;

export function StaffResourceView({
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
}: Props) {
  return (
    <ResourceManagementView<StaffResourceItem, StaffFormActions>
      {...resourceViewProps}
      data={data}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      userPermissions={userPermissions}
      resource={staffResource}
      eventName="staff"
      editTitle="Edit staff member"
      editDescription="Update this staff record."
      deleteTitle="Delete staff member?"
      deleteDescription={(row) => (
        <>
          Are you sure you want to delete{" "}
          <strong>{row.name}</strong>? This action cannot be undone.
        </>
      )}
      AddButtonComponent={StaffAddButton}
      FormComponent={StaffForm}
      actions={{ createAction, updateAction }}
      deleteAction={deleteAction}
      onRefresh={onRefresh}
      canCreate={canCreate}
    />
  );
}