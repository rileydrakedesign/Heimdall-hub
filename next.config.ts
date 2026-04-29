import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No longer using static export — server-side rendering on Vercel.
  // Legacy GitHub Pages config removed (basePath, assetPrefix, output: "export").
  images: { unoptimized: true },
  // Ensure YAML data files are bundled into serverless functions.
  // Next.js's static analyzer doesn't follow fs.readFileSync paths, so
  // routes that read data/*.yaml at request time would otherwise see
  // ENOENT on Vercel.
  outputFileTracingIncludes: {
    "/": ["./data/**/*"],
    "/projects": ["./data/**/*"],
    "/projects/[id]": ["./data/**/*"],
    "/tasks": ["./data/**/*"],
    "/api/admin/import": ["./data/**/*"],
  },
};

export default nextConfig;
