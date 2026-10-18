"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { label: "About", href: "#about" },
  { label: "History", href: "#history" },
  { label: "Leadership", href: "#leadership" },
  { label: "Alumni", href: "#alumni" },
  { label: "Media", href: "#media" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-8 sm:pt-4 lg:px-10">
        <div
          className={[
            "relative rounded-2xl border transition-all duration-300 ease-out",
            "border-border/50 bg-background/75 backdrop-blur-xl",
            scrolled
              ? "shadow-lg shadow-black/[0.08]"
              : "shadow-sm shadow-black/[0.03]",
          ].join(" ")}
        >
          <div className="flex min-h-16 items-center justify-between px-4 py-2 sm:px-5">
            <Link
              href="/"
              onClick={closeMenu}
              className="group flex min-w-0 items-center gap-3"
            >
              <span className="relative size-10 shrink-0">
                <Image
                  src="/photo/school-logo.png"
                  alt="Albert Academy logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </span>

              <span className="hidden sm:block">
                <span className="block font-display text-lg font-semibold tracking-tight">
                  Albert Academy
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Secondary School
                </span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-5 lg:flex xl:gap-6"
            >
              {isHomePage ? (
                navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))
              ) : (
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              )}

              <Link
                href="/login"
                className="ml-1 inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 bg-background/80 px-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                Admin <ArrowRight className="size-3.5" />
              </Link>
            </nav>

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background/80 transition-colors hover:bg-muted lg:hidden"
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>

          {/* Mobile navigation */}
          {menuOpen && (
            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="grid gap-1 border-t border-border/50 px-3 py-3 lg:hidden"
            >
              {isHomePage ? (
                navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))
              ) : (
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Home
                </Link>
              )}

              <Link
                href="/login"
                onClick={closeMenu}
                className="mt-1 flex items-center justify-between rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Admin <ArrowRight className="size-4" />
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}