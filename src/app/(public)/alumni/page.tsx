import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowLeft, GraduationCap } from "lucide-react";
import { PeoplePagination } from "@/components/public/people/people-pagination";
import { PeopleSearch } from "@/components/public/people/people-search";
import { PersonCard } from "@/components/public/people/person-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PHOTO_BUCKETS } from "@/lib/supabase/photo-storage";
import { getNotablePage } from "@/lib/service/notable.service";
import { RefreshAlumniButton } from "@/components/public/alumni/refresh-alumni-button";
import { SiteHeader } from "@/components/layout/public/site-header";
import { SiteFooter } from "@/components/layout/public/site-footer";

export const metadata: Metadata = {
  title: "Notable Alumni",
  description:
    "Explore notable alumni associated with Albert Academy and their contributions to Sierra Leone.",
};

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 20;

interface AlumniPageProps {
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
  }>;
}

function getSingleParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function AlumniPage({ searchParams }: AlumniPageProps) {
  const params = await searchParams;

  const query = getSingleParam(params.query).trim().slice(0, 100);
  const requestedPage = Number.parseInt(getSingleParam(params.page) || "1", 10);

  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const result = await getNotablePage(page, ITEMS_PER_PAGE, query);
  const supabase = await createSupabaseServerClient();

  const people = result.data.map((record) => {
    const photo = record.photo?.trim() ?? "";

    const image = photo
      ? /^https?:\/\//i.test(photo)
        ? photo
        : supabase.storage.from(PHOTO_BUCKETS.notable).getPublicUrl(photo).data.publicUrl
      : undefined;

    return {
      slug: String(record.id),
      name: record.name,
      role: record.title ?? "",
      category: "Alumni",
      period: "",
      initials: record.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      image,
      imageAlt: `${record.name} portrait`,
      introduction: record.description ?? "",
      biography: record.detail
        ? record.detail.split(/\n\s*\n/)
        : record.description
          ? [record.description]
          : [],
      facts: [],
      tags: [],
    };
  });

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-4 lg:px-6 lg:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>

          <RefreshAlumniButton />
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 text-primary">
              <GraduationCap className="size-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Our Heroes</span>
            </div>

            <h1 className="max-w-xl font-display text-4xl leading-tight sm:text-5xl">
              People. Professions. Public life.
            </h1>
          </div>

          <PeopleSearch placeholder="Search by name, profession or field..." />
        </div>

        <div className="mt-10 flex items-center justify-between border-y border-border py-4">
          <p className="text-sm text-muted-foreground">
            {result.total} {result.total === 1 ? "alumnus" : "alumni"}
            {query ? (
              <>
                {" "}
                matching <span className="font-medium text-foreground">“{query}”</span>
              </>
            ) : null}
          </p>

          <ArrowDownRight className="size-5 text-primary/60" />
        </div>

        {people.length > 0 ? (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {people.map((person) => (
                <PersonCard key={person.slug} person={person} hrefPrefix="/alumni" />
              ))}
            </div>

            <PeoplePagination
              currentPage={result.page}
              totalPages={result.totalPages}
              query={query}
            />
          </>
        ) : (
          <div className="mt-10 border border-dashed border-border px-6 py-20 text-center">
            <p className="font-display text-3xl">No alumni records found.</p>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              Try searching by another name, profession or field.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-4" />
              Return to Home
            </Link>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
