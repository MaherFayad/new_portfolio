<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- Do not use em dashes anywhere in website copy.
- Portfolio brand positioning is "Senior Product Designer" (Almosafer timeline uses this softened title, not "Senior UX Designer").
- Name all past employers and all freelance clients publicly on the site.
- Prefer outcome-first case study framing: Role, Problem, Approach, Outcome; use dynamic layout with smaller typography like the About hero and keep top framing copy short.
- Performance and SEO fixes must preserve exact visuals and behavior (timing, easing, layout, animations).
- Align new sections with the About page bordered-grid pattern (Experience/Expertise style).
- Case study hero should be title and subtitle only; avoid duplicate paragraphs that repeat framing content.
- External project links (e.g. Behance) should open in a new tab via `externalUrl` on Project.
- Use uppercase underlined link CTAs (like View CV on About) for secondary nav actions, not pill buttons.

## Learned Workspace Facts

- Next.js portfolio for Maher Fayad; project data lives in `src/data/projects.ts`.
- Contact form uses EmailJS client-side; no server API routes for contact or projects.
- Al Rajhi Bank Payroll is project #3 (after LFG), links externally to Behance.
- Case pages use `CaseFramingSection` and `ProjectNavActions` ("What's next") components.
- `@vercel/analytics` is wired in root layout for Vercel deployments.
- About page Projects section uses `AboutProjectsScroll` (horizontal scroll), distinct from home `ProjectsList`; placed before Experience.
- Project case pages use `WavyString` separator before `ProjectNavActions` ("What's next").
- Project routes split server `page.tsx` (metadata/`generateMetadata`) and client `ProjectPageClient.tsx`.
- Mouse-movement JS and WebGL displacement effects load only at viewport widths ≥1100px (`MOUSE_EFFECTS_MIN_WIDTH`).
- Mobile carousels (What I do) use `MobileHorizontalScroll` with native touch scroll below lg; Certificates use a grid on mobile/tablet.
