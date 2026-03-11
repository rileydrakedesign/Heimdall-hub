import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No longer using static export — server-side rendering on Vercel.
  // Legacy GitHub Pages config removed (basePath, assetPrefix, output: "export").
  images: { unoptimized: true },
};

export default nextConfig;
