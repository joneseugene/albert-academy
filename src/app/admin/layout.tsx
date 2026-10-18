import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth/get-current-user-profile";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { AdminShell } from "@/components/layout/admin/admin-shell";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentUserProfile();

  if (!profile || !profile.is_active) {
    redirect("/login");
  }

  const userPermissions = await getCurrentUserPermissions();

  return (
    <AdminShell
      profile={profile}
      permissions={userPermissions}
    >
      {children}
    </AdminShell>
  );
}