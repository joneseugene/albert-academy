
"use client";

import { CalendarRange, GraduationCap, UserRound } from "lucide-react";
import type { PupilResourceItem } from "./pupil-resource";
import Image from "next/image";

interface PupilCardProps {
  row: PupilResourceItem;
}

export function PupilCard({ row }: PupilCardProps) {
  const years =
    row.start_year != null || row.end_year != null
      ? `${row.start_year ?? "—"} – ${row.end_year ?? "Present"}`
      : null;

  return (
    <div className="pr-8">
      <div className="flex items-start gap-3">
        {row.photo ? (
          <Image
            src={row.photo}
            alt={row.name}
            className="size-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#7A1523]/10 text-[#7A1523]">
            <UserRound className="size-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{row.name}</p>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap className="size-3.5 shrink-0" />
            <span className="truncate">{row.role}</span>
          </div>

          {row.level ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {row.level}
            </p>
          ) : null}
        </div>
      </div>

      {years ? (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarRange className="size-3.5 shrink-0" />
          <span>{years}</span>
        </div>
      ) : null}
    </div>
  );
}
