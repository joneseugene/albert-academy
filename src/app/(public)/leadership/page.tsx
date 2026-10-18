import type { Metadata } from "next";
import { ArrowDownRight, Users } from "lucide-react";
import { PeoplePagination } from "@/components/public/people/people-pagination";
import { PeopleSearch } from "@/components/public/people/people-search";
import { PersonCard } from "@/components/public/people/person-card";
import { leadershipProfiles } from "@/lib/tempData/academy-people";


export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Leadership figures and institutional stewards associated with Albert Academy.",
};

const ITEMS_PER_PAGE = 6;

interface LeadershipPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function LeadershipPage({
  searchParams,
}: LeadershipPageProps) {
  const params = await searchParams;

  const query = params.query?.trim() ?? "";

  const requestedPage = Number.parseInt(params.page ?? "1", 10);

  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const normalizedQuery = query.toLowerCase();

  const filteredPeople = normalizedQuery
    ? leadershipProfiles.filter((person) =>
        [
          person.name,
          person.role,
          person.category,
          person.period,
          person.introduction,
          ...person.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : leadershipProfiles;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPeople.length / ITEMS_PER_PAGE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;

  const people = filteredPeople.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute -right-24 top-16 size-72 rounded-full border border-white/10" />
        <div className="absolute -right-8 top-40 size-44 rounded-full border border-white/10" />

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-28">
          <div className="mb-20 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
              Albert Academy
            </span>

            <span className="text-xs uppercase tracking-[0.18em] text-white/50">
              Leadership
            </span>
          </div>

          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Leadership through the years
            </p>

            <h1 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.045em]">
              Those who carried
              <br />
              <span className="text-white/55">the standard.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Explore figures associated with the leadership and stewardship
              of Albert Academy across its long institutional history.
            </p>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 text-primary">
              <Users className="size-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Leadership directory
              </span>
            </div>

            <h2 className="max-w-xl font-display text-4xl leading-tight sm:text-5xl">
              Leadership is part of the Academy&apos;s story.
            </h2>
          </div>

          <div>
            <PeopleSearch placeholder="Search by name, role or period..." />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-y border-border py-4">
          <p className="text-sm text-muted-foreground">
            {filteredPeople.length}{" "}
            {filteredPeople.length === 1 ? "record" : "records"}
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
                <PersonCard
                  key={person.slug}
                  person={person}
                  hrefPrefix="/leadership"
                />
              ))}
            </div>

            <PeoplePagination
              currentPage={safePage}
              totalPages={totalPages}
              query={query}
            />
          </>
        ) : (
          <div className="mt-10 border border-dashed border-border px-6 py-20 text-center">
            <p className="font-display text-3xl">
              No leadership records found.
            </p>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              Try a different name, role or search term.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}