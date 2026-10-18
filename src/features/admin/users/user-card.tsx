"use client";

import { Mail, ShieldCheck } from "lucide-react";
import type { UserResourceItem } from "./user-resource";


interface UserCardProps {
  row: UserResourceItem;
}

export function UserCard({
  row,
}: UserCardProps) {
  return (
    <div className="pr-10">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#7A1523]/10 text-sm font-semibold text-[#7A1523]">
          {getInitials(row)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {getFullName(row)}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="size-3.5" />
            <span className="truncate">
              {row.email ?? "No email"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          <ShieldCheck className="size-3.5" />
          {row.role?.name ?? "No role"}
        </span>

        <span
          className={
            row.is_active
              ? "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700"
              : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
          }
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}

function getFullName(
  row: UserResourceItem,
) {
  const name = [
    row.first_name,
    row.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return name || "Unnamed user";
}

function getInitials(
  row: UserResourceItem,
) {
  const first =
    row.first_name?.charAt(0) ?? "";
  const last =
    row.last_name?.charAt(0) ?? "";

  return (
    `${first}${last}`.toUpperCase() || "U"
  );
}

