"use client";

import { useCallback, useEffect, useState } from "react";

import type { PermissionKey } from "@/lib/auth/permissions";

import type { AcademicFormActions } from "./academic-form";
import type { AcademicResourceItem } from "./academic-resource";
import { AcademicResourceView } from "./academic-view";

type DeleteAcademicAction = (
  id: string,
) => Promise<{ success: boolean; message: string }>;

interface AcademicPageClientProps {
  initialAcademic: AcademicResourceItem[];
  canCreate: boolean;
  userPermissions: PermissionKey[];
  refreshAcademicAction: () => Promise<AcademicResourceItem[]>;
  createAction: AcademicFormActions["createAction"];
  updateAction: AcademicFormActions["updateAction"];
  deleteAction: DeleteAcademicAction;
}

export function AcademicPageClient({
  initialAcademic,
  canCreate,
  userPermissions,
  refreshAcademicAction,
  createAction,
  updateAction,
  deleteAction,
}: AcademicPageClientProps) {
  const [data, setData] = useState<AcademicResourceItem[]>(initialAcademic);
  const [selectedRows, setSelectedRows] = useState<AcademicResourceItem[]>([]);

  useEffect(() => {
    setData(initialAcademic);
    setSelectedRows([]);
  }, [initialAcademic]);

  const handleRefresh = useCallback(async () => {
    const freshData = await refreshAcademicAction();
    setData(freshData);
    setSelectedRows([]);
  }, [refreshAcademicAction]);

  return (
    <AcademicResourceView
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
