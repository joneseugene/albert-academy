"use client";

import { useCallback, useEffect, useState } from "react";

import type { PermissionKey } from "@/lib/auth/permissions";

import type { DidYouKnowFormActions } from "./dyk-form";
import type { DidYouKnowResourceItem } from "./dyk-resource";
import { DidYouKnowResourceView } from "./dyk-view";

type DeleteDidYouKnowAction = (
  id: string,
) => Promise<{ success: boolean; message: string }>;

interface DidYouKnowPageClientProps {
  initialDidYouKnow: DidYouKnowResourceItem[];
  canCreate: boolean;
  userPermissions: PermissionKey[];
  refreshDidYouKnowAction: () => Promise<DidYouKnowResourceItem[]>;
  createAction: DidYouKnowFormActions["createAction"];
  updateAction: DidYouKnowFormActions["updateAction"];
  deleteAction: DeleteDidYouKnowAction;
}

export function DidYouKnowPageClient({
  initialDidYouKnow,
  canCreate,
  userPermissions,
  refreshDidYouKnowAction,
  createAction,
  updateAction,
  deleteAction,
}: DidYouKnowPageClientProps) {
  const [data, setData] =
    useState<DidYouKnowResourceItem[]>(initialDidYouKnow);

  const [selectedRows, setSelectedRows] =
    useState<DidYouKnowResourceItem[]>([]);

  useEffect(() => {
    setData(initialDidYouKnow);
    setSelectedRows([]);
  }, [initialDidYouKnow]);

  const handleRefresh = useCallback(async () => {
    const freshData = await refreshDidYouKnowAction();

    setData(freshData);
    setSelectedRows([]);
  }, [refreshDidYouKnowAction]);

  return (
    <DidYouKnowResourceView
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
