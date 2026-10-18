
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Images } from "lucide-react";

import { SiteHeader } from "@/components/layout/public/site-header";
import { SiteFooter } from "@/components/layout/public/site-footer";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createPhotoStorage,
  PHOTO_BUCKETS,
} from "@/lib/supabase/photo-storage";
import { getMediaPage } from "@/lib/service/media.service";
import { MediaGallery } from "@/components/public/media/media-gallery";

export const metadata: Metadata = {
  title: "Media Gallery",
  description:
    "Explore photographs, events, and memorable moments from Albert Academy, Sierra Leone.",
};

export const revalidate = 120;

const PAGE_SIZE = 12;

type PageSearchParams = {
  page?: string | string[];
};

function getSingleParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getPageHref(page: number): string {
  return page === 1 ? "/media" : `/media?page=${page}`;
}

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): number[] {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);

  return Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, index) => start + index,
  );
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const params = await searchParams;
  const rawPage = getSingleParam(params.page);
  const parsedPage = Number(rawPage);

  const requestedPage =
    rawPage && Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const [result, supabase] = await Promise.all([
    getMediaPage(requestedPage, PAGE_SIZE),
    createSupabaseServerClient(),
  ]);

  const totalPages = result.totalPages;
  const page =
    totalPages > 0 && requestedPage > totalPages ? totalPages : result.page;

  // Fetch the last valid page if the requested page exceeds the total.
  const pageResult =
    page === result.page
      ? result
      : await getMediaPage(page, PAGE_SIZE);

  const photoStorage = createPhotoStorage(supabase);

  const media = pageResult.data.map((record) => {
    const photo = record.photo?.trim() ?? "";

    const photoUrl = !photo
      ? null
      : /^https?:\/\//i.test(photo)
        ? photo
        : photoStorage.getPublicUrl(PHOTO_BUCKETS.media, photo);

    return {
      id: record.id,
      name: record.name,
      photoUrl,
    };
  });

  const paginationItems = getPaginationItems(page, totalPages);

  const firstItem =
    pageResult.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, pageResult.total);

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-background">
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Home
            </Link>

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              From the Academy
            </p>

            <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Moments &amp; memories.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A collection of photographs celebrating the people, activities,
              events, and memorable moments that make Albert Academy special.
            </p>

            <p className="mt-6 text-sm text-muted-foreground">
              {pageResult.total}{" "}
              {pageResult.total === 1 ? "photo" : "photos"}
            </p>
          </div>
        </section>

        <section
          aria-label="Media gallery"
          className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
        >
          {media.length > 0 ? (
            <>
              <div className="mb-6 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {firstItem}–{lastItem} of {pageResult.total} photos
                </p>

                <p>
                  Page {page} of {totalPages}
                </p>
              </div>

              <MediaGallery media={media} />

              {totalPages > 1 && (
                <nav
                  aria-label="Media gallery pagination"
                  className="mt-12 flex flex-wrap items-center justify-center gap-2"
                >
                  {page > 1 ? (
                    <Link
                      href={getPageHref(page - 1)}
                      rel="prev"
                      aria-label="Previous page"
                      className="inline-flex h-10 items-center gap-2 border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Previous</span>
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex h-10 cursor-not-allowed items-center gap-2 border border-border px-3 text-sm text-muted-foreground opacity-50"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Previous</span>
                    </span>
                  )}

                  {paginationItems[0] > 1 && (
                    <>
                      <Link
                        href={getPageHref(1)}
                        className="inline-flex size-10 items-center justify-center border border-border text-sm transition-colors hover:bg-muted"
                      >
                        1
                      </Link>
                      {paginationItems[0] > 2 && (
                        <span className="px-1 text-muted-foreground" aria-hidden="true">
                          …
                        </span>
                      )}
                    </>
                  )}

                  {paginationItems.map((pageNumber) => (
                    <Link
                      key={pageNumber}
                      href={getPageHref(pageNumber)}
                      aria-current={pageNumber === page ? "page" : undefined}
                      aria-label={`Page ${pageNumber}`}
                      className={`inline-flex size-10 items-center justify-center border text-sm transition-colors ${
                        pageNumber === page
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  ))}

                  {paginationItems[paginationItems.length - 1] < totalPages && (
                    <>
                      {paginationItems[paginationItems.length - 1] <
                        totalPages - 1 && (
                        <span className="px-1 text-muted-foreground" aria-hidden="true">
                          …
                        </span>
                      )}
                      <Link
                        href={getPageHref(totalPages)}
                        className="inline-flex size-10 items-center justify-center border border-border text-sm transition-colors hover:bg-muted"
                      >
                        {totalPages}
                      </Link>
                    </>
                  )}

                  {page < totalPages ? (
                    <Link
                      href={getPageHref(page + 1)}
                      rel="next"
                      aria-label="Next page"
                      className="inline-flex h-10 items-center gap-2 border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex h-10 cursor-not-allowed items-center gap-2 border border-border px-3 text-sm text-muted-foreground opacity-50"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </span>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <Images
                  className="size-8 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-5 font-display text-2xl">
                No media available yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Academy photographs and memories will appear here when they
                are added to the gallery.
              </p>

              <Link
                href="/"
                className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Return to Home
              </Link>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
