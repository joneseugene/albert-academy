import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PersonProfile } from "@/lib/tempData/academy-people";
import Image from "next/image";

interface PersonCardProps {
  person: PersonProfile;
  hrefPrefix: "/leadership" | "/alumni";
}

export function PersonCard({
  person,
  hrefPrefix,
}: PersonCardProps) {
  return (
    <Link
      href={`${hrefPrefix}/${person.slug}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-sm border border-border/70 bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
        {/* Portrait */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted sm:aspect-[5/4]">
          {person.image ? (
            <Image
              src={person.image}
              alt={person.imageAlt ?? person.name}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="relative flex h-full items-end bg-[#f1eeeb]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(122,21,35,0.12),transparent_45%)]" />
              <span className="relative px-3 pb-1 font-display text-5xl leading-none text-primary/20">
                {person.initials}
              </span>
            </div>
          )}

          <span className="absolute left-2 top-2 max-w-[90%] truncate rounded-sm bg-primary/95 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white">
            {person.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3">
          <p className="mb-1 text-[9px] font-medium uppercase tracking-wider text-primary">
            {person.period}
          </p>

          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-display text-base leading-snug text-foreground transition-colors group-hover:text-primary">
              {person.name}
            </h3>

            <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {person.role}
          </p>

          <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-muted-foreground/90">
            {person.introduction}
          </p>
        </div>
      </article>
    </Link>
  );
}