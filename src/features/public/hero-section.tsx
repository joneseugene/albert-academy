import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[8%] top-0 h-full w-px bg-border/60" />
        <div className="absolute right-[22%] top-0 hidden h-full w-px bg-border/40 lg:block" />
        <div className="absolute bottom-[16%] left-0 h-px w-2/3 bg-border/60" />
        <div className="absolute -right-40 top-1/2 size-[34rem] -translate-y-1/2 rounded-full border border-primary/10" />
        <div className="absolute -right-24 top-1/2 size-[22rem] -translate-y-1/2 rounded-full border border-primary/10" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-32 sm:px-8 lg:px-10">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <h1 className="max-w-5xl font-display text-6xl font-semibold leading-[0.92] tracking-[-0.045em] sm:text-7xl md:text-8xl lg:text-[7rem]">
              Albert <span className="block text-primary">Academy</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
              A legacy of learning, character and service. Preparing generations of young people
              to shape Sierra Leone and the wider world.
            </p>
          </div>

          <div className="lg:pb-4">
            <div className="border-l border-primary/30 pl-6">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Motto
              </p>
              <p className="mt-5 font-display text-4xl leading-none tracking-tight sm:text-5xl">
                Esse Quam <span className="block text-muted-foreground/60">Videri</span>
              </p>
              <blockquote className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
                “Rather to be than to seem...”
              </blockquote>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 hidden items-center gap-3 sm:flex lg:left-10">
          <Link href="#about" className="group inline-flex items-center gap-3 text-sm font-medium">
            Discover Albert Academy
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
