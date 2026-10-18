import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Who we are</p>
            <h2 className="mt-5 max-w-md font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              More than a school.
            </h2>
          </div>
          <div>
            <p className="max-w-3xl text-2xl leading-relaxed tracking-tight sm:text-3xl">
              Albert Academy is a community built around learning, discipline, character and service.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
              For generations, the Academy has provided an environment where young people are
              challenged to learn, encouraged to lead and prepared to contribute meaningfully to society.
            </p>
            <Link href="#history" className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Learn about our heritage
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
