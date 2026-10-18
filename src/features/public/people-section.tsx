import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PeopleSection() {
  return (
    <section id="leadership" className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/55">People</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              The people who shape the Academy.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="max-w-xl text-base leading-7 text-white/65">
              Meet the leaders, teachers, pupils and alumni whose work and achievements continue the Albert Academy story.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/leadership" className="inline-flex h-10 items-center gap-2 bg-white px-4 text-sm font-medium text-primary transition-opacity hover:opacity-90">
                Leadership <ArrowRight className="size-4" />
              </Link>
              <Link href="/alumni" className="inline-flex h-10 items-center gap-2 border border-white/20 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10">
                Notable alumni
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
