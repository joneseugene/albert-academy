"use client";

import { useState } from "react";

import type { CurrentUserProfile } from "@/lib/auth/get-current-user-profile";
import type { PermissionKey } from "@/lib/auth/permissions";

import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { AdminMobileNav } from "./admin-mobile-nav";

interface AdminShellProps {
  children: React.ReactNode;
  profile: CurrentUserProfile;
  permissions: PermissionKey[];
}

export function AdminShell({
  children,
  profile,
  permissions,
}: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar
        permissions={permissions}
      />

      <AdminMobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        permissions={permissions}
        profile={profile}
      />

      <div className="lg:pl-72">
        <AdminTopbar
          profile={profile}
          onMenuClick={() => setMobileNavOpen(true)}
        />

        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

