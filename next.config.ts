import type { NextConfig } from "next";

// Allow next/image to load from this project's Supabase Storage
// and approved external historical image sources.

const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return null;
  }
})();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },

  // A Content-Security-Policy is planned for Phase 9 once all third-party
  // origins (fonts, CAPTCHA, analytics) are known.
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      // Supabase Storage
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),

      // Rev. Ira E. Albert historical image
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },

      // Historical Methodist / Albert Academy images
      {
        protocol: "https",
        hostname: "www.umnews.org",
      },

      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default config;