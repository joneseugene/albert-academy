import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Music2, Quote, Sparkles } from "lucide-react";
import { SchoolSongLyrics } from "@/components/public/song/song-lyrics";

export const metadata: Metadata = {
  title: "School Song",
  description:
    "The official school song of Albert Academy, celebrating the school's heritage, values and enduring spirit.",
};

const openingVerse = [
  "O sing for Academy ye true lads,",
  "'Tis here we prepare for life's road",
  "Our school standing here upon the hillside",
  "Forever our hearts glad abode",
];

const chorus = [
  "Albert Academy, Esse Quam Videri",
  "Rather to be than to seem",
  "Our School neath' the trees upon the hillside",
  "O never Her honour demean",
];

const stanzas = [
  {
    number: "I",
    lines: [
      "For we are her true sons so ready",
      "To honour her all of her days",
      "Our school stands so sure and so steady",
      "And so shall we be in all our ways",
    ],
  },
  {
    number: "II",
    lines: [
      "Then come loyal hearted sons enduring",
      "Whatever this life may bring forth",
      "Forever thy praises we'll be singing",
      "Academy show forth thy worth",
    ],
  },
  {
    number: "III",
    lines: [
      "For Christ and our School stand we ever",
      "We are loyal to them to the end",
      "Our lives for their service give we ever",
      "O may we be worthy to send",
    ],
  },
];

export default function SchoolSongPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-primary text-white">
        {/* Decorative rings */}
        <div className="pointer-events-none absolute -right-32 top-12 size-[28rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 top-40 size-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-[8%] h-px w-48 bg-white/15" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-8 sm:px-8 lg:px-12 lg:pb-32">
          {/* Top bar */}
          <div className="mb-24 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Albert Academy
            </Link>

            <span className="text-xs uppercase tracking-[0.2em] text-white/50">Heritage</span>
          </div>

          {/* Hero copy */}
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.38fr)] lg:items-end lg:gap-20">
            {/* =========================================================
                TITLE + OPENING LINES
            ========================================================= */}
            <div className="max-w-5xl">
              <div className="mb-7 flex items-center">
                <div className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] sm:size-11">
                  <Music2
                    className="size-4.5 text-white/55 sm:size-5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <h1 className="max-w-5xl font-display text-[clamp(3.5rem,7.5vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-white">
                Our School
                <span className="block text-white/55">Song.</span>
              </h1>

              <div className="mt-9 max-w-3xl">
                <p className="font-display text-xl leading-[1.55] tracking-[-0.01em] text-white/75 sm:text-2xl lg:text-[1.7rem]">
                  O sing for Academy ye true lads,
                  <br />
                  &apos;Tis here we prepare for life&apos;s road.
                </p>
              </div>

              {/* Play button */}
              <div className="mt-10">
                <SchoolSongLyrics
                  openingVerse={openingVerse}
                  chorus={chorus}
                  stanzas={stanzas}
                  audioSrc="/audio/albert-academy-school-song.mp3"
                />
              </div>
            </div>

            {/* =========================================================
                HERITAGE STATEMENT
            ========================================================= */}
            <div className="lg:justify-self-end">
              <div className="relative max-w-sm border-l border-white/20 pl-6 sm:pl-7">
                <span
                  aria-hidden="true"
                  className="absolute -left-px top-0 h-10 w-px bg-white/60"
                />

                <p className="text-sm leading-7 text-white/60 sm:text-[0.95rem]">
                  The Albert Academy school song forms part of the institution&apos;s living
                  heritage, connecting generations of students through a shared expression of
                  identity and pride.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          REFLECTION
      ========================================================= */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.45fr_1fr] lg:items-center">
            <div className="flex size-20 items-center justify-center border border-primary/20 text-primary">
              <Quote className="size-7" />
            </div>

            <blockquote>
              <p className="font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
                “For we are her true sons so ready, to honour her all of her days.”
              </p>

              <footer className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Albert Academy School Song
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* =========================================================
          HERITAGE CTA
      ========================================================= */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="border border-border px-7 py-12 sm:px-12 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-4 flex items-center gap-3 text-primary">
                  <Sparkles className="size-4" />

                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Continue exploring
                  </span>
                </div>

                <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
                  Discover the history behind the Academy.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
                  Explore the people, places and milestones that shaped Albert Academy from its
                  beginnings to the institution it is today.
                </p>
              </div>

              <Link
                href="/history"
                className="inline-flex h-12 items-center justify-center border border-primary bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Explore our history
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
