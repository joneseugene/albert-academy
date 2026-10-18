"use client";

import type { PermissionKey } from "@/lib/auth/permissions";
import { ResourceManagementView } from "@/components/resource/resource-management-view";

import {
  pastLeadershipResource,
  type PastLeadershipResourceItem,
} from "./leadership-resource";
import { PastLeadershipAddButton } from "./leadership-add-button";
import {
  PastLeadershipForm,
  type PastLeadershipFormActions,
} from "./leadership-form";
import type { ResourceViewProps } from "@/components/resource/types";

type DeletePastLeadershipAction = (
  id: string,
) => Promise<{
  success: boolean;
  message: string;
}>;

type Props = Omit<
  ResourceViewProps<PastLeadershipResourceItem>,
  "resource" | "toolbarActions" | "onCreate" | "onRefresh"
> & {
  onRefresh: () => void | Promise<void>;
  canCreate: boolean;
  userPermissions: PermissionKey[];
  deleteAction: DeletePastLeadershipAction;
} & PastLeadershipFormActions;

export function PastLeadershipResourceView({
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
    <ResourceManagementView<
      PastLeadershipResourceItem,
      PastLeadershipFormActions
    >
      {...resourceViewProps}
      data={data}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      userPermissions={userPermissions}
      resource={pastLeadershipResource}
      eventName="past-leadership"
      editTitle="Edit Leadership"
      editDescription="Update this Leadership record."
      deleteTitle="Delete Leadership record?"
      deleteDescription={(row) => (
        <>
          Are you sure you want to delete{" "}
          <strong>{row.name}</strong>? This action cannot be undone.
        </>
      )}
      AddButtonComponent={PastLeadershipAddButton}
      FormComponent={PastLeadershipForm}
      actions={{ createAction, updateAction }}
      deleteAction={deleteAction}
      onRefresh={onRefresh}
      canCreate={canCreate}
    />
  );
}