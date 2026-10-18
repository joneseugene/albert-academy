
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import type { Database } from "@/types/database.types";
import type { PermissionKey } from "@/lib/auth/permissions";

import { getDisplayName } from "@/lib/functions";
import { navigation } from "./admin-navigation";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
  permissions: PermissionKey[];
  profile: Profile;
}

export function AdminMobileNav({
  open,
  onClose,
  permissions: userPermissions,
  profile,
}: AdminMobileNavProps) {
  const pathname = usePathname();

  if (!open) {
    return null;
  }

  const displayName = getDisplayName(profile);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-[min(20rem,85vw)] flex-col bg-background shadow-xl">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link
            href="/admin/home"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#7A1523] text-sm font-bold text-white">
              AA
            </div>

            <div className="leading-tight">
              <p className="font-semibold">Albert Academy</p>
              <p className="text-xs text-muted-foreground">
                Esse Quam Videri
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 transition-colors hover:bg-muted"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* User */}
        <div className="border-b px-5 py-4">
          <p className="truncate text-sm font-medium">
            {displayName}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {profile.first_name ?? "Administrator"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Admin
          </p>

          <div className="space-y-5">
            {navigation.map((section, sectionIndex) => {
              const visibleItems = section.items.filter((item) =>
                userPermissions.includes(item.permission),
              );

              if (visibleItems.length === 0) {
                return null;
              }

              return (
                <div
                  key={section.heading ?? `section-${sectionIndex}`}
                  className="space-y-1"
                >
                  {section.heading && (
                    <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.heading}
                    </p>
                  )}

                  {visibleItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={[
                          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[#7A1523] text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        <Icon
                          className={[
                            "size-4 shrink-0",
                            isActive
                              ? "text-white"
                              : "text-muted-foreground group-hover:text-foreground",
                          ].join(" ")}
                        />

                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            Albert Academy
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Esse Quam Videri
          </p>
        </div>
      </aside>
    </div>
  );
}
