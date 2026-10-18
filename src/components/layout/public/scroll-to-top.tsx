"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={[
        "fixed bottom-6 right-6 z-40",
        "flex size-12 items-center justify-center rounded-full",
        "border border-white/20 bg-primary text-primary-foreground",
        "shadow-lg shadow-black/15",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary focus-visible:ring-offset-2",
        "motion-reduce:transition-none",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}