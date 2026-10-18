"use client";

import { Award, UserRound } from "lucide-react";
import type { NotableResourceItem } from "./notable-resource";
import Image from "next/image";

interface NotableCardProps {
  row: NotableResourceItem;
}

export function NotableCard({ row }: NotableCardProps) {
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
          <p className="truncate text-sm font-semibold">
            {row.name}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Award className="size-3.5 shrink-0" />
            <span className="truncate">
              {row.title || "No title specified"}
            </span>
          </div>
        </div>
      </div>

      {row.description ? (
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
          {row.description}
        </p>
      ) : null}
    </div>
  );
}