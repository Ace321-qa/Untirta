import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Featured images are plain URLs for now (no upload pipeline yet — see
    // docs/DECISIONS.md), entered only by trusted dashboard staff, so we
    // allow any HTTPS host until real media storage replaces this.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevents the site from being embedded in a hidden <iframe> on
          // another site (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          // Stops the browser from guessing a response's content type away
          // from what the server declared (MIME-sniffing attacks).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Only send the origin (not the full URL/path) as a referrer to
          // other sites, to avoid leaking page content via the URL.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disables browser features this site never uses.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
