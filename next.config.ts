import type { NextConfig } from "next";

// An agent that asks for markdown (Accept: text/markdown) gets the markdown twin of the page it
// requested instead of the animated HTML. Browsers never send that type, so nothing changes for people.
const wantsMarkdown = [{ type: "header" as const, key: "accept", value: "(.*)text/markdown(.*)" }];

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles: these have to win over the prerendered pages
      beforeFiles: [
        { source: "/", has: wantsMarkdown, destination: "/llms.txt" },
        { source: "/work", has: wantsMarkdown, destination: "/llms.txt" },
        { source: "/hire", has: wantsMarkdown, destination: "/llms.txt" },
        { source: "/about", has: wantsMarkdown, destination: "/llms-full.txt" },
        { source: "/projects/:slug", has: wantsMarkdown, destination: "/md/projects/:slug" },
      ],
      afterFiles: [
        // Markdown twins of the case studies for AI agents: /projects/sanarte.md
        { source: "/projects/:slug.md", destination: "/md/projects/:slug" },
      ],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        // caches must keep the HTML and markdown answers apart, and agents can discover the twin
        source: "/((?!_next|assets|hero|runner).*)",
        headers: [
          { key: "Vary", value: "Accept" },
          { key: "Link", value: '</llms.txt>; rel="alternate"; type="text/markdown"' },
        ],
      },
    ];
  },
};

export default nextConfig;
