import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: every page is known at build time, so there is no reason to
  // run an SSR runtime. See docs/ARCHITECTURE.md ADR-001.
  output: "export",

  // Emit /about/index.html rather than /about.html so the Cloudflare asset
  // layer serves clean URLs without a Worker invocation.
  trailingSlash: true,

  // next/image optimisation requires a server; under `output: export` images
  // are pre-optimised at build time with sharp instead.
  images: { unoptimized: true },

  // Fail the build on type errors rather than shipping them.
  // (Next 16 removed the `eslint` key; linting runs as its own CI step.)
  typescript: { ignoreBuildErrors: false },

  // NOTE: pageExtensions deliberately does NOT include md/mdx. Content is data
  // living in content/, imported by route components — never a route itself
  // (docs/ARCHITECTURE.md ADR-002). Adding mdx here would let a stray content
  // file become a page.
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
