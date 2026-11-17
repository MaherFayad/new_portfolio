// Career facts shared by the About page, structured data, and the machine-readable
// endpoints (/llms.txt, /llms-full.txt). Single source of truth: edit here, not in the consumers.

export const SITE_URL = "https://www.maherfayad.com";



export const PROFILE = {
  name: "Maher Fayad",
  jobTitle: "Senior Product Designer",
  employer: "Almosafer",
  location: "Riyadh, Saudi Arabia",
  email: "Contact@maherfayad.com",
  linkedin: "https://www.linkedin.com/in/maherfayad",
  figma: "https://www.figma.com/@maherfayad96",
  languages: ["Arabic", "English"],
  summary:
    "Senior Product Designer based in Riyadh, Saudi Arabia, working on design systems and analytics-informed product design for banking, fintech, and travel products, in Arabic and English.",
};

export const TIMELINE = [
  {
    position: "Senior Product Designer",
    company: "Almosafer",
    time: "2025 - Present",
    points: [
      "Designing for the GCC's leading travel platform across Arabic and English product experiences.",
      "Driving design-system work and analytics-informed funnel improvements across booking journeys.",
      "Building AI-augmented design workflows with Figma MCP and Claude-driven design ops.",
    ],
  },
  {
    position: "Sr. User Experience Designer",
    company: "AZMX · Al Rajhi Bank",
    time: "Dec. 2023 - 2025",
    points: [
      "Delivered 41 revamps and enhancements to Al Rajhi e-business platforms, including the enterprise payroll journey.",
      "These revamps fed the e-business program that lifted online account openings by 47% and transactions by 81%.",
      "Worked day to day with product, engineering, and analytics teams inside Saudi Arabia's largest bank.",
    ],
  },
  {
    position: "Product Designer",
    company: "Contact Financial Holding",
    time: "Dec. 2022 - Nov. 2023",
    points: [
      "Owned the design lifecycle from initial ideation through shipped implementation.",
      "Crafted user flows, high-fidelity mockups, interactive prototypes, and ran comprehensive user research.",
      "Contributed to core financial products, including Contact Now and Contact Brokerage apps.",
    ],
  },
  {
    position: "UI/UX Designer",
    company: "GameIT",
    time: "Jun. 2022 - Dec. 2022",
    points: [
      "Refined website experiences for maximum usability, engagement, and customer satisfaction.",
      "Collaborated with marketing to deliver high-quality video and visual brand assets.",
      "Partnered with the game development team to optimize accessibility of game user interfaces.",
    ],
  },
  {
    position: "Freelance UI/UX Designer",
    company: "Upwork",
    time: "Aug. 2022 - Present",
    points: [
      "Collaborated with Solidity Studios, Supersight, Konica Minolta, Mit Olin Foundation, and Brackets.",
      "Implemented gamification aspects using the Octalysis framework to build high-engagement habit-tracking apps.",
      "Designed remote team collaboration platforms integrating sound-based destress workflows.",
    ],
  },
  {
    position: "User Experience Intern Designer",
    company: "Algoriza",
    time: "Mar. 2022 - Jun. 2022",
    points: [
      "Mastered UX design processes, user interview methodologies, and target customer mapping.",
      "Practiced interface guidelines, responsive web grids, accessibility standards, and styling guides.",
    ],
  },
  {
    position: "Intern",
    company: "British Council",
    time: "Jun. 2018 - May 2019",
    points: [
      "Interfaced between the British Council and the university to coordinate events and academic cooperation.",
      "Successfully led the organization of major events, each drawing over 200 participants.",
    ],
  },
];

// Verified credentials (Credly). Names match the badges shown in BadgesGrid.
export const CREDENTIALS = [
  { name: "Google UX Design Professional Certificate", url: "https://www.credly.com/badges/5f3aa817-a4c2-4cee-8364-bd8b163a737b/public_url" },
  { name: "Google Data Analytics Professional Certificate", url: "https://www.credly.com/badges/4b94e10d-d67c-43cb-b529-f9127c04ed91/public_url" },
  { name: "Enterprise Design Thinking Practitioner", url: "https://www.credly.com/badges/ed0ef7e8-cc68-41e9-8e10-664be336e779/public_url" },
  { name: "Enterprise Design Thinking Co-Creator", url: "https://www.credly.com/badges/32de5750-f31b-470d-a179-8dadc54756fd/public_url" },
  { name: "McKinsey Forward Program", url: "https://www.credly.com/badges/0e8306a5-d19b-4524-94ca-a2f501be3d81/public_url" },
  { name: "Meta Front-End Developer Certificate", url: "https://www.credly.com/badges/2e307edc-0639-42bb-a70c-c6cac291fec3/public_url" },
  { name: "Product Analytics Certification", url: "https://www.credly.com/badges/bf32a815-e57e-4ed4-8475-45ccdceb586a/public_url" },
];

// Shown on the home page, and repeated in structured data and /llms.txt.
// Dual-audience services block: each service framed as a business result with a proof point.
export const SERVICES_OFFERED = [
  {
    ref: "01",
    name: "Product Design",
    description: "End-to-end product design for web and mobile, from problem framing and user flows to shipped, developer-ready UI.",
    proof: "Shipped the Al Rajhi payroll revamp for enterprise customers on the e-business platform.",
  },
  {
    ref: "02",
    name: "Design Systems",
    description: "Scalable, token-driven design systems and Figma libraries, including bilingual AR/EN and RTL components, so teams ship consistent UI faster.",
    proof: "Author of two published Figma community plugins that automate color and numeric tokens.",
  },
  {
    ref: "03",
    name: "UX Audits",
    description: "Heuristic and accessibility audits that turn usability friction into a prioritized, build-ready list of fixes.",
    proof: "Delivered 41 revamps and enhancements across Al Rajhi e-business platforms.",
  },
  {
    ref: "04",
    name: "Analytics-informed Design",
    description: "Funnel and behavioral analytics translated into design decisions that measurably move conversion and engagement.",
    proof: "Bilingual travel booking funnels at Almosafer, the GCC's leading travel platform.",
  },
];

// The /hire page, its FAQ structured data, and the "Good fit for" block of /llms.txt.
// Built only from facts stated elsewhere on the site: no availability, rates, or new metrics.
export const HIRE_FIT = [
  {
    ref: "01",
    name: "Banking and fintech",
    description: "Banks, fintechs, and payment products in Saudi Arabia and the GCC that need a senior product designer with enterprise banking experience (Al Rajhi Bank e-business, Contact Financial Holding).",
  },
  {
    ref: "02",
    name: "Travel and booking",
    description: "Travel and booking products that need bilingual Arabic and English journeys (Almosafer).",
  },
  {
    ref: "03",
    name: "Design system teams",
    description: "Teams that need a token-driven design system or Figma library with Arabic, English, and RTL components.",
  },
  {
    ref: "04",
    name: "Products that need an audit",
    description: "Product teams that want a UX or accessibility audit turned into a prioritized, build-ready list of fixes.",
  },
  {
    ref: "05",
    name: "Web3 and startups",
    description: "Web3 and startup teams that need product design from first flows to shipped UI (Sanarte, LFG).",
  },
];

export const HIRE_STEPS = [
  {
    ref: "01",
    name: "Send a brief",
    description: "Share the product, the problem you want solved, and your timeline through the contact form or by email. A few lines are enough to start.",
  },
  {
    ref: "02",
    name: "Book a call",
    description: "Pick a slot for an intro call to go through goals, constraints, and what success looks like for your team.",
  },
  {
    ref: "03",
    name: "Get a reply",
    description: "Messages are answered within one business day, with questions or a suggested way to approach the work.",
  },
];

export const HIRE_FAQ = [
  {
    question: "Where is Maher Fayad based?",
    answer: "Riyadh, Saudi Arabia. He works with teams across the GCC and with remote teams elsewhere.",
  },
  {
    question: "Which industries has he designed for?",
    answer: "Banking and fintech (Al Rajhi Bank through AZMX, Contact Financial Holding), travel (Almosafer), and Web3 and startup products (Sanarte, LFG), plus freelance work for clients such as Solidity Studios, Supersight, Konica Minolta, and Brackets.",
  },
  {
    question: "Does he design in both Arabic and English?",
    answer: "Yes. He designs bilingual Arabic and English products, including right-to-left layouts and components that work in both directions.",
  },
  {
    question: "Can he build or extend a design system?",
    answer: "Yes. He builds token-driven design systems and Figma libraries, and has published Figma community plugins that generate color and numeric tokens.",
  },
  {
    question: "What results has his work produced?",
    answer: "At Al Rajhi Bank he delivered 41 revamps and enhancements within the e-business program that lifted online account openings by 47% and transactions by 81%. Sanarte made it 30% easier for remote workers to find focus sounds, and LFG made habit tracking 20% more engaging.",
  },
  {
    question: "How do I start working with him?",
    answer: "Send a brief through the contact page, email Contact@maherfayad.com, or book a meeting. Messages are answered within one business day.",
  },
];
