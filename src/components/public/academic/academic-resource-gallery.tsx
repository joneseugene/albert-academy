
"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  GraduationCap,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export type AcademicResourceItem = {
  id: string;
  name: string;
  photoUrl: string | null;
  link: string | null;
};

type AcademicResourcesGalleryProps = {
  resources: AcademicResourceItem[];
};

export function AcademicResourcesGallery({
  resources,
}: AcademicResourcesGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedResource =
    selectedIndex === null ? null : resources[selectedIndex] ?? null;

  const resourceLink = selectedResource?.link?.trim() ?? "";
  const isExternal = /^https?:\/\//i.test(resourceLink);

  useEffect(() => {
    if (!selectedResource) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % resources.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? null
            : (current - 1 + resources.length) % resources.length,
        );
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedResource, resources.length]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resources.slice(0, 4).map((resource, index) => (
          <button
            key={resource.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`View ${resource.name}`}
            className="group min-w-0 overflow-hidden border border-primary/10 bg-white/80 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          >
            <div className="relative aspect-[5/3] overflow-hidden bg-primary/[0.05]">
              {resource.photoUrl ? (
                <Image
                  src={resource.photoUrl}
                  alt={resource.name}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen
                    aria-hidden="true"
                    className="size-12 text-primary/40"
                    strokeWidth={1.3}
                  />
                </div>
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
              />

              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-white/95 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                <GraduationCap className="size-3.5" aria-hidden="true" />
                Learning resource
              </span>
            </div>

            <div className="flex min-h-[112px] items-center justify-between gap-3 p-4 sm:p-5">
              <div className="min-w-0">
                <h3 className="line-clamp-2 font-display text-lg leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  {resource.name}
                </h3>

                <p className="mt-2 text-xs text-muted-foreground">
                  {resource.link?.trim()
                    ? "View resource details"
                    : "Learning resource"}
                </p>
              </div>

              <ArrowUpRight
                aria-hidden="true"
                className="size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
          </button>
        ))}
      </div>

      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <button
            type="button"
            aria-label="Close resource preview"
            onClick={() => setSelectedIndex(null)}
            className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-sm"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-label={selectedResource.name}
            className="relative z-10 flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Academic resources
                </p>

                <h2 className="mt-1 truncate text-base font-semibold leading-6 text-foreground sm:text-lg">
                  {selectedResource.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close preview"
                autoFocus
                className="flex size-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex min-h-48 flex-1 items-center justify-center overflow-hidden bg-muted">
              {selectedResource.photoUrl ? (
                <div className="relative h-[45vh] max-h-[520px] w-full">
                  <Image
                    src={selectedResource.photoUrl}
                    alt={selectedResource.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-6 py-12 text-muted-foreground">
                  <BookOpen className="size-12" aria-hidden="true" />
                  <p>No preview image available</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-muted-foreground">
                Resource {selectedIndex! + 1} of {resources.length}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {resources.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedIndex(
                          (selectedIndex! - 1 + resources.length) %
                            resources.length,
                        )
                      }
                      className="border border-border px-3 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedIndex(
                          (selectedIndex! + 1) % resources.length,
                        )
                      }
                      className="border border-border px-3 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Next
                    </button>
                  </>
                )}

                {resourceLink &&
                  (isExternal ? (
                    <a
                      href={resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center justify-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      Open learning resource
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <a
                      href={resourceLink}
                      className="inline-flex min-h-10 items-center justify-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      Open learning resource
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
