import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/profile";

// AI crawlers are welcomed by name. "*" already allows them, but an explicit group states the
// policy and survives any later tightening of the wildcard rule. Three roles per vendor:
// search index, user-triggered fetch, and model training.
const AI_AGENTS = [
  // OpenAI
  "OAI-SearchBot", "ChatGPT-User", "GPTBot",
  // Anthropic
  "Claude-SearchBot", "Claude-User", "ClaudeBot",
  // Perplexity
  "PerplexityBot", "Perplexity-User",
  // Google (Gemini grounding and training control token), Apple, Meta, Amazon, Mistral, DuckDuckGo, Common Crawl
  "Google-Extended", "Applebot-Extended", "meta-externalagent", "Amazonbot", "MistralAI-User", "DuckAssistBot", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
