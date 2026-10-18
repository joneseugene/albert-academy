import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const exploreLinks = [
  { label: "About", href: "#about" },
  { label: "History", href: "#history" },
  { label: "Leadership", href: "/leadership" },
];
const connectLinks = [
  { label: "Contact", href: "#contact" },
  { label: "Alumni", href: "/alumni" },
  { label: "Media", href: "/media" },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <span className="relative size-10 shrink-0">
                <Image
                  src="/photo/school-logo.png"
                  alt="Albert Academy logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </span>
              <span>
                <span className="block font-display text-xl font-semibold">Albert Academy</span>
                <span className="text-xs uppercase tracking-[0.18em] text-white/45">Sierra Leone</span>
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/55">
              Preserving our heritage. Building our future.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
            <FooterLinkGroup title="Explore" links={exploreLinks} />
            <FooterLinkGroup title="Connect" links={connectLinks} />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Follow</p>
              <div className="mt-4 flex items-center gap-2">
                <SocialLink label="Facebook" href="#" icon={<Facebook className="size-4" />} />
                <SocialLink label="Instagram" href="#" icon={<Instagram className="size-4" />} />
                <SocialLink label="YouTube" href="#" icon={<Youtube className="size-4" />} />
                <SocialLink label="LinkedIn" href="#" icon={<Linkedin className="size-4" />} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} Albert Academy. All rights reserved.</p>
          <Link href="/login" className="transition-colors hover:text-white/70">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">{title}</p>
      <div className="mt-4 space-y-3">
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="block text-sm text-white/65 transition-colors hover:text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SocialLink({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex size-9 items-center justify-center border border-white/15 transition-colors hover:bg-white/10"
    >
      {icon}
    </a>
  );
}
