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
    nextProject: "alrajhi-bank-payroll",
    caseFraming: {
      role: "Product Designer (mobile)",
      problem: "Foundation needed habit tracking that keeps users motivated.",
      approach: "Octalysis gamification across eight core drives, built into UI.",
      outcome: "Shipped milestones, streaks, leaderboards, and collectibles.",
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
      role: "Senior Product Designer (AR/EN)",
      problem: "Enterprise payroll flows were fragmented on e-business.",
      approach: "Redesigned journey with analytics-informed flows and bilingual UI.",
      outcome: "Behance case study; part of broader e-business platform work.",
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
      role: "UI & Visual Designer",
      problem: "Web3 brand needed to stand out in a crowded market.",
      approach: "Generative AI illustration plus bold layout.",
      outcome: "Desktop marketing site and visual identity exploration.",
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
      role: "Product Designer",
      problem: "Educators lacked one place to run and scale teaching.",
      approach: "LMS flows for curriculum, engagement, and training.",
      outcome: "Web LMS with end-to-end educator journeys.",
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
      role: "Product Designer",
      problem: "ML deployment tooling was fragmented for DevOps teams.",
      approach: "Unified dashboard for integration, pipelines, and monitoring.",
      outcome: "Dashboard UX for developers and AI engineers.",
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
      role: "Product Designer",
      problem: "NFT community needed one hub for membership and utility.",
      approach: "Premium dashboard for ownership, events, and sports utilities.",
      outcome: "Web platform for membership and NFT utility.",
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
      role: "UI & Visual Designer",
      problem: "Fans needed a premium online tribute experience.",
      approach: "Digital exhibition for milestones and memorabilia.",
      outcome: "Web exhibition with gallery and timeline UI.",
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
      role: "Product Designer",
      problem: "No simple path from NFT wallet to physical print.",
      approach: "Print-on-demand ecommerce with Web3 wallet connection.",
      outcome: "Wallet-to-checkout ecommerce flows.",
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
      role: "UI Designer",
      problem: "Agency site had to prove craft at first glance.",
      approach: "Artistic landing page foregrounding portfolio work.",
      outcome: "Marketing site and brand showcase.",
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
      role: "Brand & UI Designer",
      problem: "Supplement brand needed trust and a premium feel.",
      approach: "Dark-themed identity and ecommerce with Web3 hooks.",
      outcome: "Brand identity and product storefront.",
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
      role: "Product Designer",
      problem: "Finance and dev teams needed clear Web3 payment rails.",
      approach: "Portal, docs, and payment flows in one system.",
      outcome: "Portal UX for corporate finance and developers.",
    }
  }
];
