import { Mail, MapPin, Phone } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Get in touch</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              We would love to hear from you.
            </h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <MapPin className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Visit us</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Albert Academy<br />Freetown, Sierra Leone
              </p>
            </div>
            <div>
              <Mail className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Email</p>
              <a href="mailto:info@albertacademy.sl" className="mt-2 block text-sm text-muted-foreground transition-colors hover:text-primary">
                info@albertacademy.sl
              </a>
            </div>
            <div>
              <Phone className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Phone</p>
              <a href="tel:+23200000000" className="mt-2 block text-sm text-muted-foreground transition-colors hover:text-primary">
                +232 XX XXX XXX
              </a>
            </div>
            <div>
              <p className="text-sm font-medium">Office hours</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Monday – Friday<br />8:00 AM – 4:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
