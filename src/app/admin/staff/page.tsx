export const dynamic = "force-dynamic";
import { StaffPageClient } from "@/features/admin/staff/staff-client";
import {
  createStaff,
  deleteStaff,
  getStaffRecords,
  updateStaff,
} from "@/lib/action/staff.action";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";

export default async function StaffPage() {
  const [staffResult, userPermissions] = await Promise.all([
    getStaffRecords(),
    getCurrentUserPermissions(),
  ]);

  if (!staffResult.success) {
    throw new Error(staffResult.message);
  }

  async function refreshStaff() {
    "use server";

    const result = await getStaffRecords();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data ?? [];
  }

  const canCreate = userPermissions.includes(permissions.staffCreate);

  return (
    <StaffPageClient
      initialStaff={staffResult.data ?? []}
      canCreate={canCreate}
      userPermissions={userPermissions}
      refreshStaffAction={refreshStaff}
      createAction={createStaff}
      updateAction={updateStaff}
      deleteAction={deleteStaff}
    />
  );
}