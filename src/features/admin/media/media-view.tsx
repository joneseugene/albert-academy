"use client";

import type { PermissionKey } from "@/lib/auth/permissions";
import { ResourceManagementView } from "@/components/resource/resource-management-view";

import {
  mediaResource,
  type MediaResourceItem,
} from "./media-resource";
import { MediaAddButton } from "./media-add-button";
import { MediaForm, type MediaFormActions } from "./media-form";
import type { ResourceViewProps } from "@/components/resource/types";

type DeleteMediaAction = (
  id: string,
) => Promise<{
  success: boolean;
  message: string;
}>;

type Props = Omit<
  ResourceViewProps<MediaResourceItem>,
  "resource" | "toolbarActions" | "onCreate" | "onRefresh"
> & {
  onRefresh: () => void | Promise<void>;
  canCreate: boolean;
  userPermissions: PermissionKey[];
  deleteAction: DeleteMediaAction;
} & MediaFormActions;

export function MediaResourceView({
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
    <ResourceManagementView<MediaResourceItem, MediaFormActions>
      {...resourceViewProps}
      data={data}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      userPermissions={userPermissions}
      resource={mediaResource}
      eventName="media"
      editTitle="Edit media"
      editDescription="Update this media record."
      deleteTitle="Delete media?"
      deleteDescription={(row) => (
        <>
          Are you sure you want to delete{" "}
          <strong>{row.name}</strong>? This action cannot be undone.
        </>
      )}
      AddButtonComponent={MediaAddButton}
      FormComponent={MediaForm}
      actions={{ createAction, updateAction }}
      deleteAction={deleteAction}
      onRefresh={onRefresh}
      canCreate={canCreate}
    />
  );
}