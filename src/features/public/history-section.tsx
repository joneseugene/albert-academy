import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HistorySection() {
  return (
    <section id="history" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Our history</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              A story worth carrying forward.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Explore the people, milestones and traditions that have shaped Albert Academy through the years.
            </p>
            <Link href="/history" className="group mt-7 inline-flex w-fit items-center gap-3 border-b border-foreground pb-2 text-sm font-medium">
              Explore our history
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
