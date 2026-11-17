import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Markdown twins of the case studies for AI agents: /projects/sanarte.md
      { source: "/projects/:slug.md", destination: "/md/projects/:slug" },
    ];
  },
};

export default nextConfig;
