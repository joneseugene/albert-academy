import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Landmark,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getLeadershipProfile, leadershipProfiles } from "@/lib/tempData/academy-people";


interface LeadershipDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return leadershipProfiles.map((person) => ({
    slug: person.slug,
  }));
}

export async function generateMetadata({
  params,
}: LeadershipDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const person = getLeadershipProfile(slug);

  if (!person) {
    return {
      title: "Leadership",
    };
  }

  return {
    title: person.name,
    description: person.introduction,
  };
}

export default async function LeadershipDetailPage({
  params,
}: LeadershipDetailPageProps) {
  const { slug } = await params;

  const person = getLeadershipProfile(slug);

  if (!person) {
    notFound();
  }

  const relatedPeople = leadershipProfiles
    .filter((item) => item.slug !== person.slug)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-24">
          <div className="mb-20 flex items-center justify-between">
            <Link
              href="/leadership"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Leadership
            </Link>

            <span className="text-xs uppercase tracking-[0.18em] text-white/50">
              Profile
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                {person.period}
              </p>

              <h1 className="max-w-4xl font-display text-[clamp(3.4rem,7vw,7rem)] leading-[0.9] tracking-[-0.045em]">
                {person.name}
              </h1>

              <p className="mt-7 text-lg text-white/70 sm:text-xl">
                {person.role}
              </p>
            </div>

            <div className="lg:justify-self-end">
              <div className="flex aspect-[4/5] w-full max-w-sm items-end overflow-hidden bg-white/10">
                <div className="relative flex h-full w-full items-end">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.12),transparent_40%)]" />

                  <span className="relative px-8 pb-8 font-display text-[clamp(7rem,15vw,12rem)] leading-none text-white/15">
                    {person.initials}
                  </span>

                  <span className="absolute right-6 top-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Portrait
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.42fr]">
          <article>
            <p className="max-w-3xl font-display text-3xl leading-tight sm:text-4xl">
              {person.introduction}
            </p>

            <div className="mt-12 max-w-3xl space-y-7">
              {person.biography.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-8 text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <aside className="lg:border-l lg:border-border lg:pl-10">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Profile details
            </p>

            <div className="divide-y divide-border border-y border-border">
              {person.facts.map((fact) => (
                <div key={fact.label} className="py-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {fact.label}
                  </p>

                  <p className="mt-2 text-sm font-medium text-foreground">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CalendarDays className="size-4 text-primary" />
                {person.period}
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Landmark className="size-4 text-primary" />
                Albert Academy
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {relatedPeople.length > 0 && (
        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Continue exploring
                </p>

                <h2 className="font-display text-3xl sm:text-4xl">
                  Other leadership figures
                </h2>
              </div>

              <Link
                href="/leadership"
                className="hidden items-center gap-2 text-sm font-medium text-foreground hover:text-primary sm:flex"
              >
                View all
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {relatedPeople.map((related) => (
                <Link
                  key={related.slug}
                  href={`/leadership/${related.slug}`}
                  className="group flex items-center justify-between border border-border bg-white p-6 transition-colors hover:border-primary/40"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-primary">
                      {related.role}
                    </p>

                    <h3 className="mt-2 font-display text-2xl">
                      {related.name}
                    </h3>
                  </div>

                  <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}