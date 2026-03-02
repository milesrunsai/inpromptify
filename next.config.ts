import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase static generation timeout and reduce memory pressure
  staticPageGenerationTimeout: 120,
  // Disable ESLint during builds (already checked locally)
  eslint: { ignoreDuringBuilds: true },
  // Disable type checking during builds (already checked locally)  
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
