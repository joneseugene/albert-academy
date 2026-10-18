"use client";

import type { PermissionKey } from "@/lib/auth/permissions";
import { ResourceManagementView } from "@/components/resource/resource-management-view";

import {
  academicResource,
  type AcademicResourceItem,
} from "./academic-resource";
import {
  AcademicForm,
  type AcademicFormActions,
} from "./academic-form";
import { AcademicAddButton } from "./academic-add-button";
import type { ResourceViewProps } from "@/components/resource/types";

type DeleteAcademicAction = (
  id: string,
) => Promise<{
  success: boolean;
  message: string;
}>;

type AcademicResourceViewProps = Omit<
  ResourceViewProps<AcademicResourceItem>,
  "resource" | "toolbarActions" | "onCreate" | "onRefresh"
> & {
  onRefresh: () => void | Promise<void>;
  canCreate: boolean;
  userPermissions: PermissionKey[];
  deleteAction: DeleteAcademicAction;
} & AcademicFormActions;

export function AcademicResourceView({
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
}: AcademicResourceViewProps) {
  return (
    <ResourceManagementView<
      AcademicResourceItem,
      AcademicFormActions
    >
      {...resourceViewProps}
      data={data}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      userPermissions={userPermissions}
      resource={academicResource}
      eventName="academic"
      editTitle="Edit academic resource"
      editDescription="Update this academic resource."
      deleteTitle="Delete academic resource?"
      deleteDescription={(row) => (
        <>
          Are you sure you want to delete{" "}
          <strong>{row.name}</strong>? This action cannot be undone.
        </>
      )}
      AddButtonComponent={AcademicAddButton}
      FormComponent={AcademicForm}
      actions={{ createAction, updateAction }}
      deleteAction={deleteAction}
      onRefresh={onRefresh}
      canCreate={canCreate}
    />
  );
}