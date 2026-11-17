// Markdown views of the site for AI agents and answer engines: /llms.txt (index),
// /llms-full.txt (everything in one file), and /projects/<slug>.md (one case study).
// Built only from the same data the pages render, so nothing here can drift from the site
// or publish a figure the site does not.
import { PROJECTS, type Project } from "@/data/projects";
import { PLUGINS } from "@/data/plugins";
import { CREDENTIALS, PROFILE, SERVICES_OFFERED, SITE_URL, TIMELINE } from "@/data/profile";

const abs = (path: string) => `${SITE_URL}${path}`;

export const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  // the HTML page is the canonical URL; keep these twins out of search results
  "X-Robots-Tag": "noindex, follow",
};

function intro(): string {
  return [
    `# ${PROFILE.name}`,
    "",
    `> ${PROFILE.summary} Currently ${PROFILE.jobTitle} at ${PROFILE.employer}.`,
    "",
    `- Role: ${PROFILE.jobTitle} at ${PROFILE.employer}`,
    `- Location: ${PROFILE.location} (works with GCC and remote teams)`,
    `- Languages: ${PROFILE.languages.join(", ")}`,
    `- Email: ${PROFILE.email}`,
    `- LinkedIn: ${PROFILE.linkedin}`,
    `- Figma Community: ${PROFILE.figma}`,
    `- Contact and booking: ${abs("/contacts")}`,
  ].join("\n");
}

// Who he is a good match for, in the words a person would use when asking an assistant for a designer.
function services(): string[] {
  return [
    "## Services",
    "",
    ...SERVICES_OFFERED.map((svc) => `- ${svc.name}: ${svc.description} Proof: ${svc.proof}`),
    "",
    "## Good fit for",
    "",
    ...PROFILE.goodFitFor.map((line) => `- ${line}`),
    "",
    `To hire or brief ${PROFILE.name}: ${abs("/contacts")} or ${PROFILE.email}.`,
    "",
  ];
}

export function projectMarkdown(project: Project): string {
  const { caseFraming: f, miniCase: m } = project;
  const out = [
    `# ${project.title}`,
    "",
    `> ${project.subtitle}`,
    "",
    project.paragraph,
    "",
    `- Role: ${f.role}`,
    `- Problem: ${f.problem}`,
    `- Approach: ${f.approach}`,
    `- Outcome: ${f.outcome}`,
  ];
  if (m) {
    out.push("", "## Context", "", m.context, "", "## What I did", "", m.contribution, "", "## Key decisions", "");
    out.push(...m.decisions.map((d) => `- ${d}`));
    out.push("", "## Result", "", m.result);
  }
  out.push("", `Case study page: ${abs(`/projects/${project.slug}`)}`);
  if (project.externalUrl) out.push(`Full case study: ${project.externalUrl}`);
  out.push(`Designer: ${PROFILE.name}, ${PROFILE.jobTitle} (${SITE_URL})`);
  return out.join("\n") + "\n";
}

export function llmsTxt(): string {
  return [
    intro(),
    "",
    ...services(),
    "## Pages",
    "",
    `- [Home](${abs("/")}): positioning, services, selected projects, testimonials`,
    `- [About](${abs("/about")}): career history, expertise, credentials, Figma plugins`,
    `- [Work](${abs("/work")}): all projects`,
    `- [Contact](${abs("/contacts")}): contact form, email, meeting booking`,
    "",
    "## Case studies",
    "",
    ...PROJECTS.map((p) => `- [${p.title}](${abs(`/projects/${p.slug}.md`)}): ${p.subtitle}`),
    "",
    "## Figma plugins",
    "",
    ...PLUGINS.map((p) => `- [${p.name}](${p.link}): ${p.description}`),
    "",
    "## Optional",
    "",
    `- [Full profile in one file](${abs("/llms-full.txt")}): career history, credentials, and every case study`,
    "",
  ].join("\n");
}

export function llmsFullTxt(): string {
  const shift = (md: string) => md.replace(/^(#+) /gm, "#$1 ").trimEnd();
  return [
    intro(),
    "",
    ...services(),
    "## Experience",
    "",
    ...TIMELINE.flatMap((t) => [`### ${t.position}, ${t.company} (${t.time})`, "", ...t.points.map((p) => `- ${p}`), ""]),
    "## Credentials",
    "",
    ...CREDENTIALS.map((c) => `- [${c.name}](${c.url})`),
    "",
    "## Figma plugins",
    "",
    ...PLUGINS.map((p) => `- [${p.name}](${p.link}): ${p.description}`),
    "",
    "## Case studies",
    "",
    ...PROJECTS.flatMap((p) => [shift(projectMarkdown(p)), ""]),
  ].join("\n");
}
