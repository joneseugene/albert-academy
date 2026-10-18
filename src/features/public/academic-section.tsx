
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import {
  AcademicResourcesGallery,
  type AcademicResourceItem,
} from "@/components/public/academic/academic-resource-gallery"

type AcademicResourcesSectionProps = {
  resources: AcademicResourceItem[];
};

export function AcademicResourcesSection({
  resources,
}: AcademicResourcesSectionProps) {
  return (
    <section
      aria-labelledby="academic-resources-heading"
      className="relative isolate overflow-hidden border-y border-primary/10 bg-[#F8F0F1]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-primary/[0.06] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-72 rounded-full bg-primary/[0.05] blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm shadow-primary/15">
              <GraduationCap
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                Learn beyond the classroom
              </p>

              <h2
                id="academic-resources-heading"
                className="mt-1 font-display text-2xl tracking-tight text-foreground sm:text-3xl"
              >
                Your learning starts here.
              </h2>
            </div>
          </div>

          <Link
            href="/academic-resources"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          >
            Explore all resources
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {resources.length > 0 ? (
          <>
            <AcademicResourcesGallery resources={resources.slice(0, 4)} />

            <div className="mt-8 flex flex-col gap-3 border-t border-primary/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-muted-foreground">
                Discover useful tools, study materials, and learning portals
                selected for the Albert Academy community.
              </p>

              <Link
                href="/academic-resources"
                className="inline-flex min-h-10 w-fit shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                Browse the library
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <div className="border border-primary/10 bg-white/60 px-6 py-12 text-center">
            <BookOpen
              className="mx-auto size-10 text-primary/50"
              aria-hidden="true"
            />

            <h3 className="mt-4 font-display text-xl text-foreground">
              Your next learning opportunity is coming.
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              Academic resources and learning portals will appear here as
              they become available.
            </p>

            <Link
              href="/academic-resources"
              className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              Explore all resources
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
