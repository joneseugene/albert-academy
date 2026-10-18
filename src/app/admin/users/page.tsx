export const dynamic = "force-dynamic";
import { UsersPageClient } from "@/features/admin/users/user-client";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { getUsers } from "@/lib/service/user.service";
import { getRoles } from "@/lib/service/role.service";

export default async function UsersPage() {
  const [
    users,
    roles,
    userPermissions,
  ] = await Promise.all([
    getUsers(),
    getRoles(),
    getCurrentUserPermissions(),
  ]);

  async function refreshUsers() {
    "use server";

    // getUsers must enforce authorization on the server,
    // because this function can be invoked independently.
    return await getUsers();
  }

  return (
    <UsersPageClient
      initialUsers={users}
      roles={roles}
      userPermissions={userPermissions}
      refreshUsersAction={refreshUsers}
    />
  );
}