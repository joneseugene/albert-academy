"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { PermissionKey } from "@/lib/auth/permissions";
import { navigation } from "./admin-navigation";

interface AdminSidebarProps {
  permissions: PermissionKey[];
}

export function AdminSidebar({
  permissions: userPermissions,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleSections = navigation
    .map((section, sectionIndex) => ({
      ...section,
      key: section.heading ?? `section-${sectionIndex}`,
      items: section.items.filter((item) =>
        userPermissions.includes(item.permission),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-background lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/home" className="flex items-center gap-3">
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
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Admin
        </p>

        {process.env.NODE_ENV === "development" &&
          userPermissions.length === 0 && (
            <p className="mx-3 mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-foreground">
              No permissions were provided to the sidebar. Check
              getCurrentUserPermissions().
            </p>
          )}

        <div className="space-y-5">
          {visibleSections.map((section) => (
            <div key={section.key} className="space-y-1">
              {section.heading && (
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.heading}
                </p>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
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
          ))}
        </div>
      </nav>

      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">Albert Academy</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Esse Quam Videri
        </p>
      </div>
    </aside>
  );
}