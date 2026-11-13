
import type { NextConfig } from "next";

const config: NextConfig = {
  // Cloudflare Workers serves the exported website from assets.directory: out.
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
};

export default config;
