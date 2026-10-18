"use client";

import { KeyRound } from "lucide-react";
import type { RoleResourceItem } from "./role-resource";


interface RoleCardProps {
  row: RoleResourceItem;
}

export function RoleCard({
  row,
}: RoleCardProps) {
  return (
    <div className="pr-10">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#7A1523]/10 text-[#7A1523]">
          <KeyRound className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="font-semibold">
            {formatRoleName(row.name)}
          </p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {row.description ??
              "No description provided."}
          </p>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        {row.permission_count}{" "}
        {row.permission_count === 1
          ? "permission"
          : "permissions"}
      </div>
    </div>
  );
}

function formatRoleName(
  name: string,
) {
  return name
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

