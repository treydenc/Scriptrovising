import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Other Next.js configuration options */
  eslint: {
    // Disables all ESLint checks during builds
    ignoreDuringBuilds: true, // Use this if you want to skip ESLint during build
  },
};

export default nextConfig;
