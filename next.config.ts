import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Featured images are plain URLs for now (no upload pipeline yet — see
    // docs/DECISIONS.md), entered only by trusted dashboard staff, so we
    // allow any HTTPS host until real media storage replaces this.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
