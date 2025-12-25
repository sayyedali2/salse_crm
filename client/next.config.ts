import type { NextConfig } from "next";

type NextConfigExtended = NextConfig & {
  typescript?: { ignoreBuildErrors?: boolean };
  eslint?: { ignoreDuringBuilds?: boolean };
};

const nextConfig: NextConfigExtended = {
  /* config options here */

  // 👇 Ye 2 sections add karein
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
