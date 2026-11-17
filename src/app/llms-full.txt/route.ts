import { llmsFullTxt, MARKDOWN_HEADERS } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: MARKDOWN_HEADERS });
}
