import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

import { SiteFooter } from "@/components/layout/public/site-footer";
import { SiteHeader } from "@/components/layout/public/site-header";
import { getPublishedDidYouKnowPage } from "@/lib/service/did.you.know.service";

export const metadata: Metadata = {
  title: "Did You Know?",
  description:
    "Explore the history, traditions, people, and heritage of Albert Academy through our collection of interesting facts.",
};

const PAGE_SIZE = 12;

type PageSearchParams = {
  q?: string | string[];
  page?: string | string[];
};

function getSingleParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

function getPageHref(page: number, query: string): string {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();

  return search ? `/did-you-know?${search}` : "/did-you-know";
}

export default async function DidYouKnowPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const params = await searchParams;
  const query = getSingleParam(params.q).trim();
  const parsedPage = Number.parseInt(getSingleParam(params.page), 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const result = await getPublishedDidYouKnowPage({
    query,
    page: requestedPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(result.total / PAGE_SIZE);
  const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  const facts =
    currentPage === requestedPage
      ? result.data
      : (
          await getPublishedDidYouKnowPage({
            query,
            page: currentPage,
            pageSize: PAGE_SIZE,
          })
        ).data;

  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader />

      <section className="border-b border-primary/10 bg-[#F8F0F1]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <BookOpen className="size-3.5" />
              The Academy knowledge library
            </div>

            <h1 className="mt-6 font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Did you know?
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Discover the stories, people, traditions, milestones, and little-known facts that make
              Albert Academy special.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {result.total.toLocaleString()} {result.total === 1 ? "fact" : "facts"}
              </span>
              <span aria-hidden="true">·</span>
              <span>{query ? `Results for “${query}”` : "Explore the collection"}</span>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Search and browse facts"
        className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12 lg:px-12"
      >
        <form
          action="/did-you-know"
          method="get"
          role="search"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="relative flex-1">
            <span className="sr-only">Search facts by title, description, or category</span>

            <Search
              aria-hidden="true"
              className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search history, people, traditions..."
              className="min-h-12 w-full rounded-sm border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Search className="size-4" />
            Search facts
          </button>

          {query && (
            <Link
              href="/did-you-know"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
              Clear
            </Link>
          )}
        </form>

        <div className="mt-10 flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-display text-xl tracking-tight text-foreground sm:text-2xl">
              {query ? "Search results" : "Explore the facts"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.total === 0
                ? "No matching facts"
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                    currentPage * PAGE_SIZE,
                    result.total,
                  )} of ${result.total}`}
            </p>
          </div>
        </div>

        {facts.length > 0 ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((fact) => (
              <article
                key={fact.id}
                className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-primary/30"
              >
                {fact.image?.trim() ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-primary/5">
                    <Image
                      src={fact.image}
                      alt={fact.image_alt?.trim() || fact.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-[#F8F0F1]">
                    <LightbulbPlaceholder />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {fact.category && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
                      {fact.category}
                    </p>
                  )}

                  <h3 className="mt-3 font-display text-xl leading-snug tracking-tight text-foreground sm:text-2xl">
                    {fact.title}
                  </h3>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                    {fact.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-sm border border-dashed border-border px-6 py-14 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Search className="size-5" />
            </span>

            <h3 className="mt-4 font-display text-xl text-foreground">No facts found</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We couldn&apos;t find any published facts matching your search. Try a different keyword or
              search for a topic such as history, people, or traditions.
            </p>

            {query && (
              <Link
                href="/did-you-know"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                View all facts
                <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Facts pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-7"
          >
            {currentPage > 1 ? (
              <Link
                href={getPageHref(currentPage - 1, query)}
                aria-label="Previous page"
                className="inline-flex min-h-10 items-center gap-1 rounded-sm border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex min-h-10 cursor-not-allowed items-center gap-1 rounded-sm border border-border/60 px-3 text-sm text-muted-foreground/50">
                <ChevronLeft className="size-4" />
                Previous
              </span>
            )}

            <span className="px-3 text-sm tabular-nums text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={getPageHref(currentPage + 1, query)}
                aria-label="Next page"
                className="inline-flex min-h-10 items-center gap-1 rounded-sm border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Next
                <ChevronRight className="size-4" />
              </Link>
            ) : (
              <span className="inline-flex min-h-10 cursor-not-allowed items-center gap-1 rounded-sm border border-border/60 px-3 text-sm text-muted-foreground/50">
                Next
                <ChevronRight className="size-4" />
              </span>
            )}
          </nav>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}

function LightbulbPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="flex size-16 items-center justify-center rounded-full border border-primary/10 bg-white/70 text-primary"
    >
      <BookOpen className="size-7" strokeWidth={1.4} />
    </div>
  );
}
