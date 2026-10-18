
"use client";

import { BookOpen, ExternalLink } from "lucide-react";
import type { AcademicResourceItem } from "./academic-resource";
import Image from "next/image";

interface AcademicCardProps {
  row: AcademicResourceItem;
}

export function AcademicCard({ row }: AcademicCardProps) {
  return (
    <div className="pr-8">
      <div className="flex items-start gap-3">
        {row.photo ? (
          <Image
            src={row.photo}
            alt={row.name}
            className="size-12 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#7A1523]/10 text-[#7A1523]">
            <BookOpen className="size-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {row.name}
          </p>

          {row.link ? (
            <a
              href={row.link}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex max-w-full items-center gap-1.5 text-xs text-muted-foreground hover:text-[#7A1523]"
            >
              <ExternalLink className="size-3.5 shrink-0" />
              <span className="truncate">Visit resource</span>
            </a>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              No link provided
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
