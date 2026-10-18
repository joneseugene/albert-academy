"use client";

import { useCallback, useEffect, useState } from "react";

import type { PermissionKey } from "@/lib/auth/permissions";

import type { MediaFormActions } from "./media-form";
import type { MediaResourceItem } from "./media-resource";
import { MediaResourceView } from "./media-view";

type DeleteMediaAction = (
  id: string,
) => Promise<{ success: boolean; message: string }>;

interface MediaPageClientProps {
  initialMedia: MediaResourceItem[];
  canCreate: boolean;
  userPermissions: PermissionKey[];
  refreshMediaAction: () => Promise<MediaResourceItem[]>;
  createAction: MediaFormActions["createAction"];
  updateAction: MediaFormActions["updateAction"];
  deleteAction: DeleteMediaAction;
}

export function MediaPageClient({
  initialMedia,
  canCreate,
  userPermissions,
  refreshMediaAction,
  createAction,
  updateAction,
  deleteAction,
}: MediaPageClientProps) {
  const [data, setData] = useState<MediaResourceItem[]>(initialMedia);
  const [selectedRows, setSelectedRows] = useState<MediaResourceItem[]>([]);

  useEffect(() => {
    setData(initialMedia);
    setSelectedRows([]);
  }, [initialMedia]);

  const handleRefresh = useCallback(async () => {
    const freshData = await refreshMediaAction();
    setData(freshData);
    setSelectedRows([]);
  }, [refreshMediaAction]);

  return (
    <MediaResourceView
      data={data}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      onRefresh={handleRefresh}
      canCreate={canCreate}
      userPermissions={userPermissions}
      createAction={createAction}
      updateAction={updateAction}
      deleteAction={deleteAction}
    />
  );
}