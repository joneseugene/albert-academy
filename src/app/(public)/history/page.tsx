import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Church,
  GraduationCap,
  MapPin,
  Quote,
} from "lucide-react";

export const metadata: Metadata = {
  title: "History",
  description:
    "Discover the history, heritage and legacy of Albert Academy in Sierra Leone.",
};

export default function HistoryPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-white text-xs font-bold tracking-tight text-primary shadow-sm transition-transform group-hover:scale-[1.03]">
                AA
              </div>

              <div>
                <p className="font-display text-base font-semibold tracking-tight text-white">
                  Albert Academy
                </p>

                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.22em] text-white/55">
                  Sierra Leone
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

              <span className="hidden sm:inline">Back home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-primary text-white">
        {/* Decorative geometry */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[14%] top-0 h-full w-px bg-white/[0.08]" />

          <div className="absolute -right-56 top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 rounded-full border border-white/[0.08]" />

          <div className="absolute -right-24 top-1/2 h-[29rem] w-[29rem] -translate-y-1/2 rounded-full border border-white/[0.08]" />

          <div className="absolute bottom-0 left-0 h-px w-2/3 bg-white/[0.08]" />

          <div className="absolute bottom-24 left-[8%] h-2 w-2 rounded-full bg-white/30" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-36 sm:px-8 sm:pb-24 lg:px-10 lg:pb-28">
          <div className="max-w-4xl">
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-9 bg-white/50" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                Our history
              </p>
            </div>

            <h1 className="font-display text-[3.5rem] font-semibold leading-[0.96] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              A history
              <span className="block text-white/50">written across</span>
              generations.
            </h1>

            <div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-[15px] leading-7 text-white/65 sm:text-base">
                From a small beginning in Freetown to an institution whose
                alumni and community have contributed to Sierra Leone and
                beyond, the Albert Academy story spans more than a century.
              </p>

              <div className="flex shrink-0 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                <ArrowDown className="h-4 w-4" />
                Explore the story
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          INTRODUCTION
      ============================================================ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                1904 — Present
              </p>

              <h2 className="mt-4 max-w-md font-display text-4xl leading-[1.08] tracking-tight sm:text-[2.75rem]">
                More than a century of education.
              </h2>
            </div>

            <div>
              <p className="max-w-3xl font-display text-2xl leading-[1.4] tracking-tight text-foreground sm:text-3xl">
                Albert Academy was founded in Freetown on 4 October 1904 by
                the United Brethren Church and named in honour of Rev. Ira E.
                Albert.
              </p>

              <p className="mt-7 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                The Academy began modestly before growing into the institution
                associated with its present home on Berry Street. Its history
                is closely connected with missionary education, the Methodist
                tradition and the changing educational story of Sierra Leone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOUNDER
      ============================================================ */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            {/* Founder image */}
            <div className="relative">
              <div className="absolute -left-3 -top-3 h-full w-full border border-primary/15" />

              <div className="relative overflow-hidden bg-muted">
                <Image
                  src="https://pbs.twimg.com/media/Edyx2S8WoAA1bEZ.jpg"
                  alt="Historical tribute to Rev. Ira E. Albert, founder of Albert Academy"
                  width={900}
                  height={1100}
                  className="h-auto w-full object-cover"
                />
              </div>

              <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                Historical tribute to Rev. Ira E. Albert.
              </p>
            </div>

            {/* Founder text */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                The founder
              </p>

              <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                Rev.
                <span className="block text-primary">Ira E. Albert</span>
              </h2>

              <div className="mt-7 max-w-2xl space-y-5 text-[15px] leading-7 text-muted-foreground">
                <p>
                  Rev. Ira E. Albert was an American missionary who served in
                  Sierra Leone under the United Brethren Church. He was born
                  in 1868 and served as superintendent of the United Brethren
                  mission in Sierra Leone from 1899 until his death in 1902.
                </p>

                <p>
                  His missionary work was closely associated with education,
                  and his name became permanently connected with the Academy
                  established in his memory two years after his death.
                </p>

                <p>
                  Albert died while traveling along the Bumpeh River during
                  mission work. His life and service became part of the
                  foundation story of the institution that bears his name.
                </p>
              </div>

              <div className="mt-9 grid max-w-md grid-cols-2 border-y border-border">
                <div className="border-r border-border py-5 pr-6">
                  <p className="font-display text-2xl text-foreground">1868</p>

                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Born
                  </p>
                </div>

                <div className="py-5 pl-6">
                  <p className="font-display text-2xl text-foreground">1902</p>

                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Passed away
                  </p>
                </div>
              </div>

              <p className="mt-7 max-w-xl text-[11px] leading-5 text-muted-foreground">
                Historical records identify Rev. Ira Albert as serving in
                Sierra Leone from 1899–1902 and dying during mission travel on
                the Bumpeh River.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          QUOTE
      ============================================================ */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 lg:py-24">
          <Quote className="mx-auto h-7 w-7 text-white/30" />

          <p className="mt-7 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Esse Quam Videri
          </p>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
            To be, rather than to seem
          </p>
        </div>
      </section>

      {/* ============================================================
          THE BEGINNING — 1904
      ============================================================ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
            <div>
              <p className="font-display text-6xl leading-none text-primary/12 sm:text-7xl">
                1904
              </p>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                The beginning
              </p>
            </div>

            <div>
              <h2 className="max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                A small beginning in Freetown.
              </h2>

              <p className="mt-7 max-w-3xl text-[15px] leading-7 text-muted-foreground">
                The Academy was founded on 4 October 1904 in Freetown. Early
                records describe a very small beginning, with the school
                operating from a residential home on East Street.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                <div className="border-l border-primary/25 pl-4">
                  <BookOpen className="h-4 w-4 text-primary" />

                  <p className="mt-3 font-display text-xl">1904</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Academy founded
                  </p>
                </div>

                <div className="border-l border-primary/25 pl-4">
                  <GraduationCap className="h-4 w-4 text-primary" />

                  <p className="mt-3 font-display text-xl">East Street</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Original location
                  </p>
                </div>

                <div className="border-l border-primary/25 pl-4">
                  <Church className="h-4 w-4 text-primary" />

                  <p className="mt-3 font-display text-xl">UBC</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Founding tradition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HISTORICAL SCHOOL IMAGE
      ============================================================ */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="relative overflow-hidden bg-muted">
              <Image
                src="/photo/aa_010.jpg"
                alt="Albert Academy staff gathered beside the school sign"
                width={1200}
                height={800}
                className="h-full min-h-[380px] w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-end border-l border-primary/15 pl-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                A living institution
              </p>

              <p className="mt-4 font-display text-2xl leading-[1.2] tracking-tight">
                The past remains visible in the Academy today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          1907 — BERRY STREET
      ============================================================ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="font-display text-6xl leading-none text-primary/12 sm:text-7xl">
                1907
              </p>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                A new home
              </p>

              <h2 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Berry Street becomes home.
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                Within its first few years, the Academy outgrew its original
                beginnings. In 1907, the school moved to its present location
                on Berry Street in Freetown.
              </p>

              <div className="mt-8 flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">
                    Albert Academy, Berry Street
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Freetown, Sierra Leone
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-lg text-[11px] leading-5 text-muted-foreground">
                Historical sources identify Berry Street as the Academy&apos;s
                present location from 1907.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          METHODIST / CHURCH HERITAGE
      ============================================================ */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                Faith & education
              </p>

              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                A heritage rooted in mission and education.
              </h2>

              <div className="mt-7 max-w-2xl space-y-5 text-[15px] leading-7 text-muted-foreground">
                <p>
                  The Academy&apos;s origins are connected to the United
                  Brethren Church, whose mission work in Sierra Leone provided
                  the institutional setting from which the school emerged.
                </p>

                <p>
                  That Christian educational heritage remains an important part
                  of the Academy&apos;s historical identity and its connection
                  with the Methodist tradition in Sierra Leone.
                </p>

                <p>
                  The history of the school therefore sits at the intersection
                  of education, faith, community and nation-building.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-3 -top-3 h-full w-full border border-primary/15" />

              <div className="relative overflow-hidden">
                <Image
                  src="/photo/aa_014.jpg"
                  alt="Wesley Methodist Church in Freetown, Sierra Leone"
                  width={1000}
                  height={1000}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TIMELINE
      ============================================================ */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:py-28">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              The journey
            </p>

            <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
              Milestones
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground">
              A growing timeline of the people, places and moments that have
              shaped Albert Academy.
            </p>
          </div>

          <div className="relative mt-16">
            <div className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-14">
              <TimelineItem
                year="1902"
                title="The passing of Ira Albert"
                text="Rev. Ira E. Albert dies during mission work in Sierra Leone. His service becomes part of the story from which the Academy would emerge."
                side="left"
              />

              <TimelineItem
                year="1904"
                title="Albert Academy is founded"
                text="The Academy is established in Freetown on 4 October 1904 and named in honour of Rev. Ira Albert."
                side="right"
              />

              <TimelineItem
                year="1907"
                title="The Academy moves to Berry Street"
                text="The school relocates from its original East Street setting to its present Berry Street location."
                side="left"
              />

              <TimelineItem
                year="Today"
                title="A continuing legacy"
                text="Albert Academy continues to serve generations of pupils while maintaining its historic connection to education, service and the Methodist tradition."
                side="right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          LEGACY
      ============================================================ */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                The legacy continues
              </p>

              <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                The next chapter belongs to another generation.
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p className="max-w-lg text-[15px] leading-7 text-white/60">
                The history of Albert Academy is not only a record of the past.
                It is a living inheritance carried by pupils, teachers,
                families and alumni.
              </p>

              <Link
                href="/alumni"
                className="group mt-7 inline-flex w-fit items-center gap-3 bg-white px-5 py-3 text-xs font-semibold text-primary transition-transform hover:-translate-y-0.5"
              >
                Meet the alumni community

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-9 text-[11px] text-muted-foreground sm:flex-row sm:px-8 lg:px-10">
          <p>
            © {new Date().getFullYear()} Albert Academy. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Home
            </Link>

            <Link
              href="/#contact"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </Link>

            <Link
              href="/login"
              className="transition-colors hover:text-foreground"
            >
              Administration
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ================================================================
   TIMELINE ITEM
   ================================================================ */

interface TimelineItemProps {
  year: string;
  title: string;
  text: string;
  side: "left" | "right";
}

function TimelineItem({
  year,
  title,
  text,
  side,
}: TimelineItemProps) {
  return (
    <div className="relative grid md:grid-cols-2">
      <div className="absolute left-4 top-1.5 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-primary md:left-1/2" />

      {side === "left" ? (
        <>
          <div className="pl-10 md:pl-0 md:pr-14 md:text-right">
            <p className="font-display text-3xl text-primary">
              {year}
            </p>

            <h3 className="mt-1.5 font-display text-xl tracking-tight">
              {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {text}
            </p>
          </div>

          <div className="hidden md:block" />
        </>
      ) : (
        <>
          <div className="hidden md:block" />

          <div className="pl-10 md:pl-14">
            <p className="font-display text-3xl text-primary">
              {year}
            </p>

            <h3 className="mt-1.5 font-display text-xl tracking-tight">
              {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {text}
            </p>
          </div>
        </>
      )}
    </div>
  );
}