
"use client";

import { ImageIcon } from "lucide-react";
import type { MediaResourceItem } from "./media-resource";
import Image from "next/image";

interface MediaCardProps {
  row: MediaResourceItem;
}

export function MediaCard({ row }: MediaCardProps) {
  return (
    <div className="pr-8">
      <div className="flex items-start gap-3">
        {row.photo ? (
          <Image
            src={row.photo}
            alt={row.name}
            className="size-16 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#7A1523]/10 text-[#7A1523]">
            <ImageIcon className="size-6" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold">{row.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.photo ? "Photo available" : "No photo uploaded"}
          </p>
        </div>
      </div>
    </div>
  );
}
