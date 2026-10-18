import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/cn";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: { default: "Albert Academy", template: "%s | Albert Academy" },
  description: "Albert Academy, Sierra Leone.",
};

export const viewport: Viewport = { themeColor: "#7A1523" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(display.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
