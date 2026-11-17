import { PROJECTS } from "@/data/projects";
import { MARKDOWN_HEADERS, projectMarkdown } from "@/lib/llms";

// Markdown twin of a case study, served at /projects/<slug>.md (see rewrites in next.config.ts).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return new Response("Not found", { status: 404 });
  return new Response(projectMarkdown(project), { headers: MARKDOWN_HEADERS });
}
