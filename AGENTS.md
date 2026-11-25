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
- Only publish metrics Maher has explicitly shared (Sanarte 30%, LFG 20%, Al Rajhi 47%/81%/41 revamps). Never add numbers or metric placeholders for Almosafer or other projects; some data is confidential.

## Learned Workspace Facts

- Next.js portfolio for Maher Fayad; project data lives in `src/data/projects.ts`.
- Contact form uses EmailJS client-side; no server API routes for contact or projects.
- Al Rajhi Bank Payroll is project #1 (fintech/travel work leads, Web3 work grouped later), links externally to Behance.
- Gallery-only projects carry a `miniCase` narrative (Context, What I did, Key decisions, Result) rendered by `MiniCaseStudy`; Sanarte and LFG keep dedicated case study components.
- Testimonials live in shared `src/components/Testimonials.tsx`, rendered on both home and About.
- Case pages use `CaseFramingSection` and `ProjectNavActions` ("What's next") components.
- `@vercel/analytics` is wired in root layout for Vercel deployments.
- About page Projects section uses `AboutProjectsScroll` (horizontal scroll), distinct from home `ProjectsList`; placed before Experience.
- Project case pages use `WavyString` separator before `ProjectNavActions` ("What's next").
- Project routes split server `page.tsx` (metadata/`generateMetadata`) and client `ProjectPageClient.tsx`.
- Mouse-movement JS and WebGL displacement effects load only at viewport widths ≥1100px (`MOUSE_EFFECTS_MIN_WIDTH`).
- Mobile carousels (What I do) use `MobileHorizontalScroll` with native touch scroll below lg; Certificates use a grid on mobile/tablet.
- Home hero character is `HeroCharacter` (canvas): scripted intro on the headline, ends standing on the far end of "accelerate" (`[data-hero-perch]`; phones stay on "Designer"), then reacts to `[data-hero-cue]`, `[data-hero-stat]`, and `[data-ai-chat]`. No cursor chasing.
- The hero character's art is `/hero/maher.svg`, a vector sheet traced from the runner's pixel art by `scripts/build-hero-vector.py` (cleans background-remover leftovers, snaps to a fixed palette, outlines each colour region). Rerun the script instead of editing the SVG or `src/components/hero/frames.ts`. Standing poses are single still frames moved in code; never hand-draw the character, and do not use the sheet's off-model "look" frames.
- Career facts live in `src/data/profile.ts` (TIMELINE, CREDENTIALS, PROFILE); About, JSON-LD, and `src/lib/llms.ts` read from it.
- AI-agent endpoints: `/llms.txt`, `/llms-full.txt`, and `/projects/<slug>.md` (rewrite to `src/app/md/projects/[slug]`), all generated from site data.
- The sheet's run frames are drawn with a bigger head and the jump frames smaller overall; `build-hero-vector.py` normalises both to the standing head (`RUN_HEAD`, `JUMP_SCALE`).
- The home gradient band (`ParallaxMockups`) is revealed with the hero (`aboveFold`), not on scroll.
- `SERVICES_OFFERED`, `HIRE_FIT`, `HIRE_STEPS`, `HIRE_FAQ` live in `src/data/profile.ts` and feed the home page, `/hire`, Person and FAQ JSON-LD, and `/llms.txt`. `/hire` is linked from the footer only, never the top navbar; its FAQ is shown in full because the markup must match visible text.
- Requests with `Accept: text/markdown` on `/`, `/work`, `/about`, `/projects/<slug>` are rewritten to the markdown twins (`next.config.ts`, `beforeFiles`).
- IndexNow: key file in `/public/<32 hex>.txt`; run `npm run indexnow` after a production deploy is live.
- Hero character motion lives in code, not frames: run eases in with frames tied to distance covered, lean and jump stretch are eased, landings are a damped spring, feet raise dust, coins sparkle. While the visitor is active he blinks (lids painted at `EYES` coordinates per standing pose; re-measure them if the sheet is rebuilt), greets a pointer that comes up to him, and occasionally gestures unprompted. Pointer movement counts as input for the 5 s awake window.
- After the intro the hero character roams: a queue of `Step`s (run, jump between the first line and "accelerate", hop/flip, pose, tilt "Designer", coins) filled by `improvise()` from a weighted non-repeating pool, or by the visitor (click him: trick; drag with a mouse: carry and throw; click the headline: he goes there; fast swipe or scroll: startled hop). Still no cursor chasing, still stops 5 s after the last input.
- The hero character canvas spans the full page width and reaches the top of the page (`padL`, `padR`, tall `base`), at `z-20` above the header, so he is never clipped when carried or thrown. World x = 0 is still the headline's left edge.
- Hero character slapstick: he can be picked up at any time, the intro included (dropped mid-intro he goes back for the coins via a `resume` step). Carried, he hangs from the pointer by the back of his collar as a pendulum (`gripOf`, `drawCarried`), with a custom pinch cursor. A fall from the hand ends in a superhero landing then sore knees (`jump_0`, `failed_1..3`), or about a third of the time wedged between two words of the first line. Pointer over his face: he ducks (`duck_0`); under his feet: he jumps; approaching: about a third of the time he runs away. These frames come from the same traced sheet; `FAILED_HEAD` normalises their head size.
- Stuck-between-words gag: the first-line words are `[data-hero-w]` inline-block spans so they can be moved; while he is wedged they are pushed apart and tilted per frame (`pry`/`unpry`), he is clipped to the gap, and his face is always annoyed (`review_2` deadpan, `thinking_1/2` glare, `thinking_3` strain, never the smiling jump frames). Sequence: thud, "...", anger mark, heave and slip, heave and out, then a glare back at the gap.
- `scripts/fix-runner-tones.py` remaps the near-black `look_*` and `duck_0` frames of `public/runner/assets/hero.png` onto the standing frame's tones (already applied). The look frames still have a larger head and a different drawing style; that needs new art, not a script.
