// Static project data, imported directly by components (no client-side fetch).
// Single source of truth for /projects pages and the home list.

export interface CaseFraming {
  role: string;
  problem: string;
  approach: string;
  // Lead with a measured result where one exists; otherwise state scope honestly.
  outcome: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  paragraph: string;
  images: string[];
  nextProject: string;
  caseFraming: CaseFraming;
  // When set, the home projects list links out to this URL (new tab) instead of an internal case page.
  externalUrl?: string;
}

export const PROJECTS: Project[] = [
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
      role: "Lead Product Designer, research, UX, and UI (mobile)",
      problem: "Remote workers lose focus and disengage, while a research client needed a science-backed soundscape app that reduces stress and captures consented data to monetize.",
      approach: "Ran competitor analysis, literature review, and user interviews to validate the thesis, then designed the end-to-end mobile experience and a conversational onboarding survey, pressure-tested with moderated usability sessions.",
      outcome: "100% task completion in moderated usability testing across onboarding, soundscape sessions, surveys, and team analytics.",
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
    nextProject: "alrajhi-bank-payroll",
    caseFraming: {
      role: "Product Designer, gamification system and UI (mobile)",
      problem: "The Milt Olin Foundation needed a habit and time-tracking app that keeps users motivated to build safer, healthier daily routines instead of dropping off.",
      approach: "Applied the Octalysis gamification framework across all eight core drives (milestones, scarcity rewards, social leaderboards, and digital collectibles), and translated it into a cohesive UI system.",
      outcome: "Gamification system delivered across all eight Octalysis drives, from milestone rewards to scarcity streaks and social leaderboards.",
    }
  },
  {
    slug: "alrajhi-bank-payroll",
    title: "Alrajhi Bank Payroll",
    subtitle: "+47% account openings and +81% transactions across Al Rajhi e-business platform work, including this payroll revamp.",
    paragraph: "Payroll revamp for Al Rajhi Bank enterprise customers on the e-business platform.",
    images: [
      "/assets/Projects/Alrajhi%20Bank%20Payroll/Alrajhi%20Payroll.png"
    ],
    nextProject: "airlab",
    externalUrl: "https://www.behance.net/gallery/218311889/Alrajhi-Bank-payroll-revamp-UX-design-case-study",
    caseFraming: {
      role: "Senior Product Designer, enterprise web platform (AR/EN)",
      problem: "Enterprise customers faced fragmented, error-prone salary disbursement flows on the e-business platform.",
      approach: "Redesigned the payroll journey with analytics-informed flows, a consistent component system, and bilingual AR/EN support.",
      outcome: "Full UX case study published on Behance. Payroll revamp shipped as part of broader e-business platform improvements.",
    }
  },
  {
    slug: "airlab",
    title: "Airlab",
    subtitle: "Website UI design for a futuristic Web3.0 company.",
    paragraph: "Generative AI reportage illustration experiment combined with design layout highlighting visual identity in modern cryptocurrency spaces.",
    images: [
      "/assets/Projects/Airlab/Airlab-%200.webp",
      "/assets/Projects/Airlab/Airlab-%200.webp",
      "/assets/Projects/Airlab/Airlab-%202.webp"
    ],
    nextProject: "campus51",
    caseFraming: {
      role: "UI & Visual Designer, marketing site",
      problem: "A Web3 company needed a futuristic brand presence that stood out in a crowded cryptocurrency market.",
      approach: "Paired a generative-AI reportage illustration experiment with a bold layout system to express a distinct visual identity.",
      outcome: "Scope: desktop-first marketing website UI and visual identity exploration for a Web3 company.",
    }
  },
  {
    slug: "campus51",
    title: "Campus51",
    subtitle: "Empowering educators to build and scale their teaching careers.",
    paragraph: "Designed an intuitive learning management platform that simplifies curriculum creation, student engagement, and professional training for modern educators.",
    images: [
      "/assets/Projects/Campus51/Campus51%20-%200.webp",
      "/assets/Projects/Campus51/Campus51%20-%200.webp",
      "/assets/Projects/Campus51/Campus51%20-%201.webp",
      "/assets/Projects/Campus51/Campus51%20-%202.webp"
    ],
    nextProject: "deployo",
    caseFraming: {
      role: "Product Designer, end-to-end web app",
      problem: "Educators lacked an intuitive way to build, run, and scale their teaching practice in one place.",
      approach: "Designed a learning-management platform that simplifies curriculum creation, student engagement, and professional training flows.",
      outcome: "Scope: web LMS platform for educators, with user flows and high-fidelity UI across curriculum, engagement, and training journeys.",
    }
  },
  {
    slug: "deployo",
    title: "Deployo",
    subtitle: "Transforming the AI model deployment experience for DevOps teams.",
    paragraph: "Designed a streamlined dashboard interface that simplifies model integration, deployment pipelines, and performance monitoring for developers and AI engineers.",
    images: [
      "/assets/Projects/Deployo/Deployo%20-%200.webp",
      "/assets/Projects/Deployo/Deployo%20-%200.webp",
      "/assets/Projects/Deployo/Deployo%20-%201.webp",
      "/assets/Projects/Deployo/Deployo%20-%202.webp",
      "/assets/Projects/Deployo/Deployo%20-%203.webp"
    ],
    nextProject: "dhsc",
    caseFraming: {
      role: "Product Designer, SaaS dashboard",
      problem: "DevOps and AI teams faced fragmented, complex tooling when deploying and monitoring machine-learning models.",
      approach: "Designed a streamlined dashboard that unifies model integration, deployment pipelines, and performance monitoring into one workflow.",
      outcome: "Scope: web dashboard UX for a developer and AI-engineer audience, covering pipeline, integration, and monitoring interfaces.",
    }
  },
  {
    slug: "dhsc",
    title: "DHSC",
    subtitle: "A Web3 utility dashboard for the Dark Horse Sports Club NFT community.",
    paragraph: "Built a secure, premium community hub that unites club members, tracks NFT ownership, unlocks exclusive physical events, and aggregates sports utilities.",
    images: [
      "/assets/Projects/DHSC/Dark%20Horse%20Sports%20Club%20-%200.webp",
      "/assets/Projects/DHSC/Dark%20Horse%20Sports%20Club%20-%200.webp",
      "/assets/Projects/DHSC/Dark%20Horse%20Sports%20Club-%202.webp"
    ],
    nextProject: "kobe-bryant",
    caseFraming: {
      role: "Product Designer, Web3 community platform",
      problem: "The Dark Horse Sports Club NFT community needed a secure, premium hub to unite members and surface the utility behind their holdings.",
      approach: "Built a community dashboard that tracks NFT ownership, unlocks exclusive physical events, and aggregates sports utilities in one premium interface.",
      outcome: "Scope: web platform UX for an NFT community, covering membership, ownership, and event-utility interfaces.",
    }
  },
  {
    slug: "kobe-bryant",
    title: "Kobe Bryant Tribute",
    subtitle: "Honoring a legend with a premium digital exhibition and memorabilia gallery.",
    paragraph: "Created an immersive digital experience showcasing historic moments, career milestones, and exclusive tribute collectibles for fans worldwide.",
    images: [
      "/assets/Projects/KobeBryant/Kobe%20-%200.webp",
      "/assets/Projects/KobeBryant/Kobe%20-%200.webp",
      "/assets/Projects/KobeBryant/Kobe-%203.webp"
    ],
    nextProject: "nft-print-pro",
    caseFraming: {
      role: "UI & Visual Designer, digital exhibition",
      problem: "Fans needed a premium way to celebrate a sporting legend's legacy and access tribute memorabilia online.",
      approach: "Designed an immersive digital exhibition showcasing historic moments, career milestones, and exclusive tribute collectibles.",
      outcome: "Scope: web exhibition concept for a global fan audience, covering gallery, timeline, and memorabilia UI.",
    }
  },
  {
    slug: "nft-print-pro",
    title: "NFT Print Pro",
    subtitle: "Bridging digital art and physical spaces with instant high-quality NFT prints.",
    paragraph: "Designed an e-commerce print-on-demand service that connects Web3 wallets directly to premium printing services for digital collectibles.",
    images: [
      "/assets/Projects/NFT%20Print%20pro/NFT%20Print%20Pro%20Sports%20Club%20-%200.webp",
      "/assets/Projects/NFT%20Print%20pro/NFT%20Print%20Pro%20Sports%20Club%20-%200.webp",
      "/assets/Projects/NFT%20Print%20pro/NFT%20Print%20Pro-%202.webp"
    ],
    nextProject: "pexlp",
    caseFraming: {
      role: "Product Designer, e-commerce flow",
      problem: "NFT owners had no simple bridge between their digital collectibles and high-quality physical prints.",
      approach: "Designed a print-on-demand e-commerce experience that connects Web3 wallets directly to premium printing services.",
      outcome: "Scope: web e-commerce UX for Web3 collectors, covering wallet connection, product, and checkout flows.",
    }
  },
  {
    slug: "pexlp",
    title: "Pexlp",
    subtitle: "Reimagining the pixel through a modern creative design and art agency platform.",
    paragraph: "A sleek, artistic landing page showcase built to highlight digital illustration work, branding projects, and high-fidelity screen designs.",
    images: [
      "/assets/Projects/Pexlp/Pexlp%20-%201.webp",
      "/assets/Projects/Pexlp/Pexlp%20-%200.webp",
      "/assets/Projects/Pexlp/Pexlp%20-%201.webp",
      "/assets/Projects/Pexlp/Pexlp%20-%203.webp"
    ],
    nextProject: "sacred-stacks",
    caseFraming: {
      role: "UI Designer, agency landing page",
      problem: "A creative design and art agency needed a portfolio site that proved its craft at first glance.",
      approach: "Designed a sleek, artistic landing page that foregrounds illustration work, branding projects, and high-fidelity screen design.",
      outcome: "Scope: web marketing site and brand showcase for a creative agency.",
    }
  },
  {
    slug: "sacred-stacks",
    title: "Sacred Stacks",
    subtitle: "A premium health and immunity supplement landing page with Web3 integration.",
    paragraph: "Created a wellness-focused dark-themed brand identity and e-commerce experience designed to showcase premium vitamins and natural immunity boosters.",
    images: [
      "/assets/Projects/SacredStacks/SacredStacks%20-%201.webp",
      "/assets/Projects/SacredStacks/SacredStacks%20-%200.webp",
      "/assets/Projects/SacredStacks/SacredStacks%20-%201.webp",
      "/assets/Projects/SacredStacks/SacredStacks%20-%202.webp"
    ],
    nextProject: "six-clovers",
    caseFraming: {
      role: "Brand & UI Designer, e-commerce",
      problem: "A health and immunity supplement brand needed a premium storefront that signalled quality and built trust.",
      approach: "Created a wellness-focused, dark-themed brand identity and e-commerce experience with Web3 integration for premium supplements.",
      outcome: "Scope: web brand identity and storefront UX for wellness shoppers, covering product and purchase pages.",
    }
  },
  {
    slug: "six-clovers",
    title: "Six Clovers",
    subtitle: "A decentralized borderless payment integration network for modern finance.",
    paragraph: "Designed professional portal structures, developer documentation guides, and payment transaction flows connecting corporate finance to Web3 infrastructure.",
    images: [
      "/assets/Projects/Six%20clovers/Sixclovers%20-%201.webp",
      "/assets/Projects/Six%20clovers/SixClovers%20-%200.webp",
      "/assets/Projects/Six%20clovers/Sixclovers%20-%201.webp",
      "/assets/Projects/Six%20clovers/SixClovers%20-%202.webp",
      "/assets/Projects/Six%20clovers/Sixclovers%20-%203.webp"
    ],
    nextProject: "sanarte",
    caseFraming: {
      role: "Product Designer, fintech portal & docs",
      problem: "A decentralized borderless payment network needed to connect corporate finance teams and developers to Web3 payment rails without friction.",
      approach: "Designed professional portal structures, developer documentation guides, and end-to-end payment transaction flows.",
      outcome: "Scope: web portal UX for corporate-finance and developer audiences, covering portal, documentation, and payment-flow interfaces.",
    }
  }
];
