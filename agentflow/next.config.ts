import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true
  },
  turbopack: {
    resolveAlias: {
      "@atoms-ui": "../atoms-ui"
    }
  }
};

export default nextConfig;
