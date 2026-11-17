import { llmsTxt, MARKDOWN_HEADERS } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: MARKDOWN_HEADERS });
}
