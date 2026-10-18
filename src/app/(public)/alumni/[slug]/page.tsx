import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PHOTO_BUCKETS } from "@/lib/supabase/photo-storage";
import { getNotablePeople, getNotablePersonById } from "@/lib/service/notable.service";
import Image from "next/image";

interface AlumniDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getAlumniProfile(slug: string) {
  const person = await getNotablePersonById(slug);

  if (!person) {
    return null;
  }

  const photo = person.photo?.trim() ?? "";
  let imageUrl: string | undefined;

  if (photo) {
    if (/^https?:\/\//i.test(photo)) {
      imageUrl = photo;
    } else {
      const supabase = await createSupabaseServerClient();
      const bucket = PHOTO_BUCKETS.notable;

      const storagePath = photo.startsWith(`${bucket}/`) ? photo.slice(bucket.length + 1) : photo;

      const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

      imageUrl = data.publicUrl;
    }
  }

  return {
    slug: String(person.id),
    name: person.name,
    role: person.title ?? "",
    period: "",
    initials: person.name
      .trim()
      .split(/\s+/)
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    image: imageUrl,
    imageAlt: `${person.name} portrait`,
    introduction: person.description ?? "",
    biography: person.detail
      ? person.detail.split(/\n\s*\n/)
      : person.description
        ? [person.description]
        : [],
    facts: [] as { label: string; value: string }[],
  };
}

export async function generateMetadata({ params }: AlumniDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = await getAlumniProfile(slug);

  if (!person) {
    return {
      title: "Notable Alumni",
    };
  }

  return {
    title: person.name,
    description: person.introduction,
  };
}

export default async function AlumniDetailPage({ params }: AlumniDetailPageProps) {
  const { slug } = await params;
  const person = await getAlumniProfile(slug);

  if (!person) {
    notFound();
  }

  const allPeople = await getNotablePeople();

  const relatedPeople = allPeople
    .filter((item) => String(item.id) !== person.slug)
    .slice(0, 2)
    .map((item) => ({
      slug: String(item.id),
      name: item.name,
      role: item.title ?? "",
    }));

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
          <div className="mb-16 flex items-center justify-between sm:mb-20">
            <Link
              href="/alumni"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Notable alumni
            </Link>

            <span className="text-xs uppercase tracking-[0.18em] text-white/50">Profile</span>
          </div>

          <div className="grid gap-12">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                {person.period || "Albert Academy Alumni"}
              </p>

              <h1 className="max-w-4xl font-display text-[clamp(3.4rem,7vw,7rem)] leading-[0.9] tracking-[-0.045em]">
                {person.name}
              </h1>

              {person.role && (
                <p className="mt-7 max-w-2xl text-lg text-white/70 sm:text-xl">{person.role}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* White content section */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        {/* Portrait  */}
        {person.image && (
          <div className="mb-12 mt-8 sm:mb-14 sm:mt-10">
            <div className="relative size-40 overflow-hidden rounded-full bg-muted sm:size-48">
              <Image
                src={person.image}
                alt={person.imageAlt}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="grid gap-16 lg:grid-cols-[1fr_0.42fr]">
          <article>
            {person.introduction && (
              <p className="max-w-3xl font-display text-2xl leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                {person.introduction}
              </p>
            )}

            <div className="mt-8 max-w-3xl space-y-5 sm:mt-10">
              {person.biography.map((paragraph, index) => (
                <p
                  key={`${index}-${paragraph}`}
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

                  <p className="mt-2 text-sm font-medium text-foreground">{fact.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <GraduationCap className="size-4 text-primary" />
                Albert Academy alumnus
              </div>

              {person.role && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <BriefcaseBusiness className="size-4 text-primary" />
                  {person.role}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Related alumni */}
      {relatedPeople.length > 0 && (
        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Continue exploring
                </p>

                <h2 className="font-display text-3xl sm:text-4xl">Other notable alumni</h2>
              </div>

              <Link
                href="/alumni"
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
                  href={`/alumni/${related.slug}`}
                  className="group flex items-center justify-between border border-border bg-white p-6 transition-colors hover:border-primary/40"
                >
                  <div>
                    {related.role && (
                      <p className="text-xs uppercase tracking-[0.16em] text-primary">
                        {related.role}
                      </p>
                    )}

                    <h3 className="mt-2 font-display text-2xl">{related.name}</h3>
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
