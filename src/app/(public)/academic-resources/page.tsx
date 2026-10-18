
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Search,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/public/site-header";
import { SiteFooter } from "@/components/layout/public/site-footer";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createPhotoStorage,
  PHOTO_BUCKETS,
} from "@/lib/supabase/photo-storage";
import { AcademicSearch } from "@/components/public/academic/academic-search";
import { getAcademicPage } from "@/lib/service/academic.service";

export const metadata: Metadata = {
  title: "Academic Resources",
  description:
    "Explore learning resources, study materials, and educational portals for Albert Academy students in Sierra Leone.",
};

export const revalidate = 120;

const PAGE_SIZE = 12;

type PageSearchParams = {
  page?: string | string[];
  search?: string | string[];
};

function getSingleParam(
  value?: string | string[],
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getPageHref(page: number, search: string): string {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (search) {
    params.set("search", search);
  }

  const query = params.toString();

  return query ? `/academic?${query}` : "/academic";
}

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): number[] {
  const start = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - 4),
  );
  const end = Math.min(totalPages, start + 4);

  return Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, index) => start + index,
  );
}

function getResourceUrl(link: string | null): {
  url: string;
  isExternal: boolean;
} {
  const value = link?.trim() ?? "";

  if (!value) {
    return { url: "", isExternal: false };
  }

  const isExternal = /^https?:\/\//i.test(value);

  return {
    url: value,
    isExternal,
  };
}

export default async function AcademicPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const params = await searchParams;

  const rawPage = getSingleParam(params.page);
  const rawSearch = getSingleParam(params.search) ?? "";
  const search = rawSearch.trim().slice(0, 100);

  const parsedPage = Number(rawPage);

  const requestedPage =
    rawPage &&
    Number.isSafeInteger(parsedPage) &&
    parsedPage > 0
      ? parsedPage
      : 1;

  const [result, supabase] = await Promise.all([
    getAcademicPage(requestedPage, PAGE_SIZE, search),
    createSupabaseServerClient(),
  ]);

  const totalPages = result.totalPages;

  const page =
    totalPages > 0 && requestedPage > totalPages
      ? totalPages
      : result.page;

  const pageResult =
    page === result.page
      ? result
      : await getAcademicPage(page, PAGE_SIZE, search);

  const photoStorage = createPhotoStorage(supabase);

  const resources = pageResult.data.map((record) => {
    const photo = record.photo?.trim() ?? "";
    const { url: link } = getResourceUrl(record.link);

    const photoUrl = !photo
      ? null
      : /^https?:\/\//i.test(photo)
        ? photo
        : photoStorage.getPublicUrl(PHOTO_BUCKETS.academic, photo);

    return {
      id: record.id,
      name: record.name,
      link: link || null,
      photoUrl,
    };
  });

  const paginationItems = getPaginationItems(page, totalPages);

  const firstItem =
    pageResult.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(
    page * PAGE_SIZE,
    pageResult.total,
  );

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-background">
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Home
            </Link>

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Learn beyond the classroom
            </p>

            <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              A world of learning.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Discover educational websites, study materials, and
              learning tools to support your studies at Albert Academy,
              from JSS and BECE preparation to SSS and WASSCE.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <BookOpen
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                {pageResult.total}{" "}
                {pageResult.total === 1 ? "resource" : "resources"}
              </span>

              {search && (
                <span>
                  Results for{" "}
                  <span className="font-medium text-foreground">
                    &ldquo;{search}&rdquo;
                  </span>
                </span>
              )}
            </div>
          </div>
        </section>

        <section
          aria-label="Academic resources"
          className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
        >
          <div className="mb-10 flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Resource library
              </p>

              <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
                Find your next resource.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Search for a learning portal or browse the available
                resources below.
              </p>
            </div>

            <AcademicSearch initialSearch={search} />
          </div>

          {resources.length > 0 ? (
            <>
              <div className="mb-6 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {firstItem}–{lastItem} of {pageResult.total}{" "}
                  {pageResult.total === 1 ? "resource" : "resources"}
                </p>

                <p>
                  Page {page} of {totalPages}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {resources.map((resource) => {
                  const { url, isExternal } = getResourceUrl(
                    resource.link,
                  );

                  const content = (
                    <>
                      <div className="relative aspect-[5/3] overflow-hidden bg-primary/[0.05]">
                        {resource.photoUrl ? (
                          <Image
                            src={resource.photoUrl}
                            alt=""
                            fill
                            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen
                              className="size-12 text-primary/40"
                              strokeWidth={1.3}
                              aria-hidden="true"
                            />
                          </div>
                        )}

                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                        />

                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-white/95 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                          <GraduationCap
                            className="size-3.5"
                            aria-hidden="true"
                          />
                          Learning resource
                        </span>
                      </div>

                      <div className="flex min-h-[112px] items-center justify-between gap-3 p-4 sm:p-5">
                        <div className="min-w-0">
                          <h3 className="line-clamp-2 font-display text-lg leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
                            {resource.name}
                          </h3>

                          <p className="mt-2 text-xs text-muted-foreground">
                            {isExternal
                              ? "Open learning portal"
                              : url
                                ? "Explore resource"
                                : "Resource details"}
                          </p>
                        </div>

                        {isExternal ? (
                          <ExternalLink
                            className="size-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowUpRight
                            className="size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </>
                  );

                  const className =
                    "group block overflow-hidden border border-primary/10 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";

                  if (!url) {
                    return (
                      <article
                        key={resource.id}
                        className="overflow-hidden border border-primary/10 bg-card"
                      >
                        {content}
                      </article>
                    );
                  }

                  if (isExternal) {
                    return (
                      <a
                        key={resource.id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${resource.name} in a new tab`}
                        className={className}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={resource.id}
                      href={url}
                      aria-label={`Explore ${resource.name}`}
                      className={className}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label="Academic resources pagination"
                  className="mt-12 flex flex-wrap items-center justify-center gap-2"
                >
                  {page > 1 ? (
                    <Link
                      href={getPageHref(page - 1, search)}
                      rel="prev"
                      aria-label="Previous page"
                      className="inline-flex h-10 items-center gap-2 border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <ChevronLeft
                        className="size-4"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">
                        Previous
                      </span>
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex h-10 cursor-not-allowed items-center gap-2 border border-border px-3 text-sm text-muted-foreground opacity-50"
                    >
                      <ChevronLeft
                        className="size-4"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">
                        Previous
                      </span>
                    </span>
                  )}

                  {paginationItems[0] > 1 && (
                    <>
                      <Link
                        href={getPageHref(1, search)}
                        aria-label="Page 1"
                        className="inline-flex size-10 items-center justify-center border border-border text-sm transition-colors hover:bg-muted"
                      >
                        1
                      </Link>

                      {paginationItems[0] > 2 && (
                        <span
                          className="px-1 text-muted-foreground"
                          aria-hidden="true"
                        >
                          …
                        </span>
                      )}
                    </>
                  )}

                  {paginationItems.map((pageNumber) => (
                    <Link
                      key={pageNumber}
                      href={getPageHref(pageNumber, search)}
                      aria-current={
                        pageNumber === page ? "page" : undefined
                      }
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

                  {paginationItems[
                    paginationItems.length - 1
                  ] < totalPages && (
                    <>
                      {paginationItems[
                        paginationItems.length - 1
                      ] < totalPages - 1 && (
                        <span
                          className="px-1 text-muted-foreground"
                          aria-hidden="true"
                        >
                          …
                        </span>
                      )}

                      <Link
                        href={getPageHref(totalPages, search)}
                        aria-label={`Page ${totalPages}`}
                        className="inline-flex size-10 items-center justify-center border border-border text-sm transition-colors hover:bg-muted"
                      >
                        {totalPages}
                      </Link>
                    </>
                  )}

                  {page < totalPages ? (
                    <Link
                      href={getPageHref(page + 1, search)}
                      rel="next"
                      aria-label="Next page"
                      className="inline-flex h-10 items-center gap-2 border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex h-10 cursor-not-allowed items-center gap-2 border border-border px-3 text-sm text-muted-foreground opacity-50"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                {search ? (
                  <Search
                    className="size-8 text-muted-foreground"
                    aria-hidden="true"
                  />
                ) : (
                  <BookOpen
                    className="size-8 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>

              <h2 className="mt-5 font-display text-2xl">
                {search
                  ? "No matching resources found"
                  : "No academic resources yet"}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {search
                  ? `We couldn't find resources matching "${search}". Try another search term.`
                  : "Learning resources and educational portals will appear here as they become available."}
              </p>

              {search ? (
                <Link
                  href="/academic"
                  className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Clear search
                </Link>
              ) : (
                <Link
                  href="/"
                  className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Return to Home
                </Link>
              )}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
