import type { NextConfig } from "next";

const repo = "Heimdall-hub";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // GitHub Pages serves the site under /<repo>
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: { unoptimized: true },
};

export default nextConfig;
