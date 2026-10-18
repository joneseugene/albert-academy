export const dynamic = "force-dynamic";
import { AcademicPageClient } from "@/features/admin/academic/academic-client";
import {
  createAcademic,
  deleteAcademic,
  getAcademicRecords,
  updateAcademic,
} from "@/lib/action/academic.action";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";

export default async function AcademicPage() {
  const [academicResult, userPermissions] = await Promise.all([
    getAcademicRecords(),
    getCurrentUserPermissions(),
  ]);

  if (!academicResult.success) {
    throw new Error(academicResult.message);
  }

  async function refreshAcademic() {
    "use server";

    const result = await getAcademicRecords();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data ?? [];
  }

  const canCreate = userPermissions.includes(permissions.academicCreate);

  return (
    <AcademicPageClient
      initialAcademic={academicResult.data ?? []}
      canCreate={canCreate}
      userPermissions={userPermissions}
      refreshAcademicAction={refreshAcademic}
      createAction={createAcademic}
      updateAction={updateAcademic}
      deleteAction={deleteAcademic}
    />
  );
}