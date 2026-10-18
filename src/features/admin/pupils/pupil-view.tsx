"use client";

import type { PermissionKey } from "@/lib/auth/permissions";
import { ResourceManagementView } from "@/components/resource/resource-management-view";

import {
  PupilResource,
  type PupilResourceItem,
} from "./pupil-resource";
import { PupilForm, type PupilFormActions } from "./pupil-form";
import { PupilAddButton } from "./pupil-add-button";
import type { ResourceViewProps } from "@/components/resource/types";

type DeletePupilAction = (
  id: string,
) => Promise<{
  success: boolean;
  message: string;
}>;

type Props = Omit<
  ResourceViewProps<PupilResourceItem>,
  "resource" | "toolbarActions" | "onCreate" | "onRefresh"
> & {
  onRefresh: () => void | Promise<void>;
  canCreate: boolean;
  userPermissions: PermissionKey[];
  deleteAction: DeletePupilAction;
} & PupilFormActions;

export function PupilResourceView({
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
    <ResourceManagementView<PupilResourceItem, PupilFormActions>
      {...resourceViewProps}
      data={data}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      userPermissions={userPermissions}
      resource={PupilResource}
      eventName="student-table"
      editTitle="Edit student leadership"
      editDescription="Update this student leadership record."
      deleteTitle="Delete student leadership record?"
      deleteDescription={(row) => (
        <>
          Are you sure you want to delete{" "}
          <strong>{row.name}</strong>? This action cannot be undone.
        </>
      )}
      AddButtonComponent={PupilAddButton}
      FormComponent={PupilForm}
      actions={{ createAction, updateAction }}
      deleteAction={deleteAction}
      onRefresh={onRefresh}
      canCreate={canCreate}
    />
  );
}