// Static project data, imported directly by components (no client-side fetch).
// Single source of truth for /projects pages, the home list, and /api/projects.

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  paragraph: string;
  images: string[];
  nextProject: string;
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
    nextProject: "lfg"
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
    nextProject: "airlab"
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
    nextProject: "campus51"
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
    nextProject: "deployo"
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
    nextProject: "dhsc"
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
    nextProject: "kobe-bryant"
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
    nextProject: "nft-print-pro"
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
    nextProject: "pexlp"
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
    nextProject: "sacred-stacks"
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
    nextProject: "six-clovers"
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
    nextProject: "sanarte"
  }
];
