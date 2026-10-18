"use client";

import type { DidYouKnow } from "@/lib/repositories/did_you_know.repository";
import { Lightbulb, ExternalLink } from "lucide-react";
import Image from "next/image";

interface DidYouKnowCardProps {
  row: DidYouKnow;
}

export function DidYouKnowCard({ row }: DidYouKnowCardProps) {
  return (
    <div className="pr-8">
      <div className="flex items-start gap-3">
        {row.image ? (
          <Image
            src={row.image}
            alt={row.image_alt || row.title}
            className="size-12 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#7A1523]/10 text-[#7A1523]">
            <Lightbulb className="size-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold">
              {row.title}
            </p>

            <span className="rounded-full bg-[#7A1523]/10 px-2 py-0.5 text-[10px] font-medium capitalize text-[#7A1523]">
              {row.status}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {row.description}
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="truncate text-xs text-muted-foreground">
              {row.category}
            </span>

            {row.image ? (
              <a
                href={row.image}
                target="_blank"
                rel="noreferrer"
                aria-label={`View image for ${row.title}`}
                className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground hover:text-[#7A1523]"
              >
                <ExternalLink className="size-3.5" />
                View image
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
