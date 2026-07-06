// Static project data, imported directly by components (no client-side fetch).
// Single source of truth for /projects pages and the home list.

export interface CaseFraming {
  role: string;
  problem: string;
  approach: string;
  // Lead with a measured result where one exists; otherwise state scope honestly.
  outcome: string;
}

// Short narrative for projects without a dedicated case study component.
// No metrics here unless already published elsewhere on the site.
export interface MiniCase {
  context: string;
  contribution: string;
  decisions: string[];
  result: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  paragraph: string;
  images: string[];
  nextProject: string;
  caseFraming: CaseFraming;
  miniCase?: MiniCase;
  // When set, the home projects list links out to this URL (new tab) instead of an internal case page.
  externalUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "alrajhi-bank-payroll",
    title: "Alrajhi Bank Payroll",
    subtitle: "Payroll revamp for Al Rajhi Bank enterprise customers, one of 41 e-business revamps behind a 47% lift in account openings and an 81% lift in transactions.",
    paragraph: "Redesigned the bilingual AR/EN payroll journey on the Al Rajhi e-business platform, turning a fragmented enterprise flow into an analytics-informed experience. Full case study on Behance.",
    images: [
      "/assets/Projects/Alrajhi%20Bank%20Payroll/Alrajhi%20Payroll.png"
    ],
    nextProject: "sanarte",
    externalUrl: "https://www.behance.net/gallery/218311889/Alrajhi-Bank-payroll-revamp-UX-design-case-study",
    caseFraming: {
      role: "Senior Product Designer, owner of the bilingual AR/EN payroll journey",
      problem: "Enterprise payroll flows were fragmented across the e-business platform, slowing companies paying their employees.",
      approach: "I redesigned the payroll journey end to end with analytics-informed flows and bilingual AR/EN UI, one of 41 revamps I delivered across the platform.",
      outcome: "Redesigned payroll journey shipped on the e-business platform, contributing to the program's 47% rise in account openings and 81% rise in transactions.",
    },
    miniCase: {
      context: "Al Rajhi Bank's e-business platform serves enterprise customers across Saudi Arabia. Payroll, the journey companies rely on to pay their employees, had grown fragmented across the platform and did not match how finance teams actually work.",
      contribution: "On the e-business design team I owned the payroll journey: I mapped the existing flows against funnel analytics, redesigned the end-to-end experience, and delivered the bilingual AR/EN UI ready for development.",
      decisions: [
        "Analytics first: drop-off points in the existing funnel decided where the redesign effort went.",
        "One continuous payroll journey instead of scattered platform screens, so finance teams keep context from upload to confirmation.",
        "Bilingual AR/EN and RTL designed together from the start, not translated after the fact.",
      ],
      result: "The payroll revamp shipped as one of the 41 e-business revamps referenced above. Full walkthrough on Behance.",
    }
  },
  {
    slug: "sanarte",
    title: "Sanarte",
    subtitle: "Made it 30% easier for Remote workers to listen to sounds that boost their productivity and creativity.",
    paragraph: "Designed a mobile application that utilizes specific soundscapes to de-stress and increase the work quality and focus of remote workers, tailored for research data analytics and long-term engagement.",
    images: [
      "/assets/Projects/Sanarte/Sanarte%20-%201.webp",
      "/assets/Projects/Sanarte/Sanarte%20-%201.webp",
      "/assets/Projects/Sanarte/Sanarte%20-%202.webp",
      "/assets/Projects/Sanarte/Sanarte%20-%203.webp",
      "/assets/Projects/Sanarte/1.webp",
      "/assets/Projects/Sanarte/2.webp",
      "/assets/Projects/Sanarte/3.webp",
      "/assets/Projects/Sanarte/4.webp",
      "/assets/Projects/Sanarte/5.webp",
      "/assets/Projects/Sanarte/6.webp",
      "/assets/Projects/Sanarte/Color.webp",
      "/assets/Projects/Sanarte/Color-Greyscale.webp",
      "/assets/Projects/Sanarte/Color-Gradient.webp",
      "/assets/Projects/Sanarte/Typography.webp",
      "/assets/Projects/Sanarte/TypographyTest.webp"
    ],
    nextProject: "lfg",
    caseFraming: {
      role: "Lead Product Designer (mobile)",
      problem: "Remote workers lose focus; client needed a research-backed soundscape.",
      approach: "Research, interviews, then end-to-end mobile UX and usability testing.",
      outcome: "100% task completion in usability testing.",
    }
  },
  {
    slug: "lfg",
    title: "LFG App",
    subtitle: "Made it 20% more engaging for users to track their habits and time, using Octalysis Gamification method.",
    paragraph: "Built for the Milt Olin Foundation to promote distracted-driving awareness and safe road habits through development milestones, scarcity rewards, social leaderboards, and digital collectibles.",
    images: [
      "/assets/Projects/LFG/LFG%20-%200.webp",
      "/assets/Projects/LFG/LFG%20-%200.webp",
      "/assets/Projects/LFG/octalysis.webp",
      "/assets/Projects/LFG/LFG%20-%201.webp",
      "/assets/Projects/LFG/LFG%20-%202.webp",
      "/assets/Projects/LFG/LFG%20-%203.webp",
      "/assets/Projects/LFG/LFG%20-%204.webp",
      "/assets/Projects/LFG/LFG%20-%205.webp"
    ],
    nextProject: "deployo",
    caseFraming: {
      role: "Product Designer (mobile)",
      problem: "Foundation needed habit tracking that keeps users motivated.",
      approach: "Octalysis gamification across eight core drives, built into UI.",
      outcome: "Shipped milestones, streaks, leaderboards, and collectibles.",
    }
  },
  {
    slug: "deployo",
    title: "Deployo",
    subtitle: "A unified dashboard that takes DevOps teams from trained model to monitored deployment in one place.",
    paragraph: "Designed a streamlined dashboard that brings model integration, deployment pipelines, and performance monitoring into a single workflow for developers and AI engineers.",
    images: [
      "/assets/Projects/Deployo/Deployo%20-%200.webp",
      "/assets/Projects/Deployo/Deployo%20-%200.webp",
      "/assets/Projects/Deployo/Deployo%20-%201.webp",
      "/assets/Projects/Deployo/Deployo%20-%202.webp",
      "/assets/Projects/Deployo/Deployo%20-%203.webp"
    ],
    nextProject: "campus51",
    caseFraming: {
      role: "Product Designer",
      problem: "ML deployment tooling was fragmented for DevOps teams.",
      approach: "Unified dashboard for integration, pipelines, and monitoring.",
      outcome: "Dashboard UX for developers and AI engineers.",
    },
    miniCase: {
      context: "DevOps and ML teams were stitching together separate tools to integrate models, run deployment pipelines, and monitor performance. Every handoff between tools was a chance to lose state, context, and time.",
      contribution: "I designed the end-to-end dashboard experience: the information architecture, the deployment flow, pipeline states, and the monitoring views engineers check every day.",
      decisions: [
        "One lifecycle mental model, integrate then deploy then monitor, so users always know where they are.",
        "Status-first screens: pipeline and model health readable at a glance before any drill-down.",
        "Dense, engineer-grade tables with progressive disclosure instead of oversimplified cards.",
      ],
      result: "Shipped dashboard UX covering model integration, deployment pipelines, and performance monitoring for developers and AI engineers.",
    }
  },
  {
    slug: "campus51",
    title: "Campus51",
    subtitle: "A learning management platform that gives educators one place to build courses, engage students, and grow their careers.",
    paragraph: "Designed an intuitive learning management platform that simplifies curriculum creation, student engagement, and professional training for modern educators.",
    images: [
      "/assets/Projects/Campus51/Campus51%20-%200.webp",
      "/assets/Projects/Campus51/Campus51%20-%200.webp",
      "/assets/Projects/Campus51/Campus51%20-%201.webp",
      "/assets/Projects/Campus51/Campus51%20-%202.webp"
    ],
    nextProject: "six-clovers",
    caseFraming: {
      role: "Product Designer",
      problem: "Educators lacked one place to run and scale teaching.",
      approach: "LMS flows for curriculum, engagement, and training.",
      outcome: "Web LMS with end-to-end educator journeys.",
    },
    miniCase: {
      context: "Educators were juggling separate tools for building curriculum, keeping students engaged, and progressing their own professional training. Campus51 set out to be the single platform for the whole teaching career.",
      contribution: "I designed the LMS flows end to end: the curriculum builder, the student engagement views, and the professional training journeys educators follow to level up.",
      decisions: [
        "Curriculum creation modeled on how teachers actually plan, courses into modules into sessions, not abstract content blocks.",
        "Engagement surfaced as actionable per-student signals instead of raw analytics dashboards.",
        "One design language across teaching and learning modes so educators never relearn the interface.",
      ],
      result: "Shipped a web LMS covering the full educator journey from course creation to professional development.",
    }
  },
  {
    slug: "six-clovers",
    title: "Six Clovers",
    subtitle: "Payment portal, developer docs, and transaction flows connecting corporate finance teams to modern payment rails.",
    paragraph: "Designed the portal structure, developer documentation, and payment transaction flows that let corporate finance teams and their developers move money on Web3 infrastructure without needing to understand it.",
    images: [
      "/assets/Projects/Six%20clovers/Sixclovers%20-%201.webp",
      "/assets/Projects/Six%20clovers/SixClovers%20-%200.webp",
      "/assets/Projects/Six%20clovers/Sixclovers%20-%201.webp",
      "/assets/Projects/Six%20clovers/SixClovers%20-%202.webp",
      "/assets/Projects/Six%20clovers/Sixclovers%20-%203.webp"
    ],
    nextProject: "pexlp",
    caseFraming: {
      role: "Product Designer",
      problem: "Finance and dev teams needed clear Web3 payment rails.",
      approach: "Portal, docs, and payment flows in one system.",
      outcome: "Portal UX for corporate finance and developers.",
    },
    miniCase: {
      context: "Six Clovers builds a borderless payment network. Its two audiences, corporate finance teams and the developers who integrate for them, needed very different front doors to the same rails.",
      contribution: "I designed the portal information architecture, the developer documentation experience, and the payment transaction flows as one coherent system.",
      decisions: [
        "Finance-first language in the portal; protocol details live in the docs, never in the UI.",
        "Transaction flows follow familiar banking patterns, initiate then review then approve, so treasury teams onboard without training.",
        "Documentation structured as task-based guides rather than API reference dumps.",
      ],
      result: "Shipped portal UX and a documentation system serving both corporate finance users and integrating developers.",
    }
  },
  {
    slug: "pexlp",
    title: "Pexlp",
    subtitle: "A landing page for a creative agency that had to prove its design craft within the first scroll.",
    paragraph: "Designed an artistic landing page that puts the agency's illustration, branding, and screen design work front and center, so the site itself becomes the first proof of craft.",
    images: [
      "/assets/Projects/Pexlp/Pexlp%20-%201.webp",
      "/assets/Projects/Pexlp/Pexlp%20-%200.webp",
      "/assets/Projects/Pexlp/Pexlp%20-%201.webp",
      "/assets/Projects/Pexlp/Pexlp%20-%203.webp"
    ],
    nextProject: "nft-print-pro",
    caseFraming: {
      role: "UI Designer",
      problem: "Agency site had to prove craft at first glance.",
      approach: "Artistic landing page foregrounding portfolio work.",
      outcome: "Marketing site and brand showcase.",
    },
    miniCase: {
      context: "For a design agency, the website is the first work sample a prospect ever sees. Pexlp needed a landing page where the craft was self-evident before a single portfolio piece was opened.",
      contribution: "I designed the landing page end to end: art direction, the layout system, and the showcase structure for illustration and branding work.",
      decisions: [
        "Work first, copy second: the portfolio pieces carry the page and text stays minimal.",
        "A bold, editorial layout that demonstrates the agency's taste instead of describing it.",
        "Strong typographic hierarchy so the page reads clearly even while being visually loud.",
      ],
      result: "Shipped the agency's marketing site and brand showcase.",
    }
  },
  {
    slug: "nft-print-pro",
    title: "NFT Print Pro",
    subtitle: "A wallet-to-checkout e-commerce flow that turns digital collectibles into physical prints.",
    paragraph: "Designed a print-on-demand e-commerce experience that connects a customer's digital wallet directly to premium printing, from artwork selection to checkout.",
    images: [
      "/assets/Projects/NFT%20Print%20pro/NFT%20Print%20Pro%20Sports%20Club%20-%200.webp",
      "/assets/Projects/NFT%20Print%20pro/NFT%20Print%20Pro%20Sports%20Club%20-%200.webp",
      "/assets/Projects/NFT%20Print%20pro/NFT%20Print%20Pro-%202.webp"
    ],
    nextProject: "dhsc",
    caseFraming: {
      role: "Product Designer",
      problem: "No simple path from NFT wallet to physical print.",
      approach: "Print-on-demand ecommerce with Web3 wallet connection.",
      outcome: "Wallet-to-checkout ecommerce flows.",
    },
    miniCase: {
      context: "Collectors had no simple way to get their digital artwork onto a wall. The existing path meant manual downloads, third-party print shops, and no quality guarantee.",
      contribution: "I designed the full e-commerce journey: wallet connection, artwork selection, print configuration, and checkout.",
      decisions: [
        "Treat the wallet like a photo library, not a crypto feature: users pick artwork the way they pick photos.",
        "Standard e-commerce checkout patterns so the Web3 part never adds friction.",
        "Print preview and material selection given prominence, because print quality is the product's whole promise.",
      ],
      result: "Shipped wallet-to-checkout flows for the print-on-demand service.",
    }
  },
  {
    slug: "dhsc",
    title: "DHSC",
    subtitle: "A members-only dashboard that gives a sports community one hub for membership, events, and perks.",
    paragraph: "Built a premium community hub for the Dark Horse Sports Club that verifies membership, unlocks exclusive physical events, and gathers the club's sports utilities in one place.",
    images: [
      "/assets/Projects/DHSC/Dark%20Horse%20Sports%20Club%20-%200.webp",
      "/assets/Projects/DHSC/Dark%20Horse%20Sports%20Club%20-%200.webp",
      "/assets/Projects/DHSC/Dark%20Horse%20Sports%20Club-%202.webp"
    ],
    nextProject: "sacred-stacks",
    caseFraming: {
      role: "Product Designer",
      problem: "Club members had membership, events, and perks scattered across platforms.",
      approach: "Premium dashboard for ownership, events, and sports utilities.",
      outcome: "Web platform for membership and club utility.",
    },
    miniCase: {
      context: "The Dark Horse Sports Club community had its membership records, event access, and perks scattered across different platforms. Members needed one trusted, premium home for all of it.",
      contribution: "I designed the membership dashboard: ownership verification, event access, and the utility hub, wrapped in a visual language that matches a premium club.",
      decisions: [
        "Membership status as the anchor of the interface: what you hold decides what you see.",
        "Physical event access treated as the hero feature, since real-world perks were the club's main draw.",
        "A dark, premium visual system consistent with the club's brand.",
      ],
      result: "Shipped the web platform for membership verification and club utilities.",
    }
  },
  {
    slug: "sacred-stacks",
    title: "Sacred Stacks",
    subtitle: "Brand identity and storefront for a premium supplement line that had to earn trust at first glance.",
    paragraph: "Created a wellness-focused brand identity and e-commerce experience for premium vitamins and natural immunity boosters, built around a dark, premium visual language.",
    images: [
      "/assets/Projects/SacredStacks/SacredStacks%20-%201.webp",
      "/assets/Projects/SacredStacks/SacredStacks%20-%200.webp",
      "/assets/Projects/SacredStacks/SacredStacks%20-%201.webp",
      "/assets/Projects/SacredStacks/SacredStacks%20-%202.webp"
    ],
    nextProject: "airlab",
    caseFraming: {
      role: "Brand & UI Designer",
      problem: "Supplement brand needed trust and a premium feel.",
      approach: "Dark-themed identity and ecommerce storefront designed together.",
      outcome: "Brand identity and product storefront.",
    },
    miniCase: {
      context: "Supplements are a low-trust category: buyers are skeptical of claims and highly sensitive to how premium a brand feels. Sacred Stacks needed its identity and storefront to carry that trust.",
      contribution: "I designed the brand identity and the e-commerce experience together, so the trust signals stay consistent from first impression to checkout.",
      decisions: [
        "A dark, restrained visual identity that signals premium rather than loud wellness marketing.",
        "Ingredients and benefits given a clear, honest hierarchy on product pages.",
        "A conventional, frictionless checkout to protect hard-won trust at the last step.",
      ],
      result: "Shipped the brand identity and product storefront.",
    }
  },
  {
    slug: "airlab",
    title: "Airlab",
    subtitle: "Marketing site and visual identity that helped a new tech brand stand out in a saturated market.",
    paragraph: "Combined generative AI reportage illustration with a bold layout system to give an emerging tech company a visual identity that cannot be confused with its competitors.",
    images: [
      "/assets/Projects/Airlab/Airlab-%200.webp",
      "/assets/Projects/Airlab/Airlab-%200.webp",
      "/assets/Projects/Airlab/Airlab-%202.webp"
    ],
    nextProject: "kobe-bryant",
    caseFraming: {
      role: "UI & Visual Designer",
      problem: "New tech brand needed to stand out in a crowded market.",
      approach: "Generative AI illustration plus bold layout.",
      outcome: "Desktop marketing site and visual identity exploration.",
    },
    miniCase: {
      context: "Airlab was launching into a market where every competitor's site looked the same: dark gradients, abstract 3D, identical claims. The brand needed to be recognizable in one glance.",
      contribution: "I designed the marketing site and led the visual identity exploration, pairing generative AI reportage illustration with a bold editorial layout.",
      decisions: [
        "Illustration as the brand: a distinctive reportage style no competitor could copy with stock assets.",
        "An editorial layout with strong grids and typography, resisting the template look of the category.",
        "Desktop-first storytelling, since the audience evaluated the company on the big screen.",
      ],
      result: "Shipped the desktop marketing site and visual identity direction.",
    }
  },
  {
    slug: "kobe-bryant",
    title: "Kobe Bryant Tribute",
    subtitle: "A premium digital exhibition honoring Kobe Bryant's career for fans worldwide.",
    paragraph: "Created an immersive digital experience showcasing historic moments, career milestones, and exclusive tribute collectibles for fans worldwide.",
    images: [
      "/assets/Projects/KobeBryant/Kobe%20-%200.webp",
      "/assets/Projects/KobeBryant/Kobe%20-%200.webp",
      "/assets/Projects/KobeBryant/Kobe-%203.webp"
    ],
    nextProject: "alrajhi-bank-payroll",
    caseFraming: {
      role: "UI & Visual Designer",
      problem: "Fans needed a premium online tribute experience.",
      approach: "Digital exhibition for milestones and memorabilia.",
      outcome: "Web exhibition with gallery and timeline UI.",
    },
    miniCase: {
      context: "Fans wanted a place to honor Kobe Bryant's legacy that felt worthy of it: premium, respectful, and rich with career history.",
      contribution: "I designed the exhibition experience: the career timeline, the memorabilia gallery, and the visual language of the tribute.",
      decisions: [
        "The timeline as the spine of the experience, letting the career tell its own story.",
        "Gallery layouts that give each item space and reverence rather than grid density.",
        "Restrained motion and dark styling to keep the tone commemorative, not commercial.",
      ],
      result: "Shipped the web exhibition with gallery and timeline UI.",
    }
  }
];
