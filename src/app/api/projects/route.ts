import { NextResponse } from "next/server";

export async function GET() {
  const projects = [
    {
      slug: "sanarte",
      title: "Sanarte",
      subtitle: "Made it 30% easier for Remote workers to listen to sounds that boost their productivity and creativity.",
      paragraph: "Designed a mobile application that utilizes specific soundscapes to de-stress and increase the work quality and focus of remote workers, tailored for research data analytics and long-term engagement.",
      images: [
        "/assets/4.webp",
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
        "/assets/Projects/Sanarte/TypographyTest.webp",
      ],
      nextProject: "lfg"
    },
    {
      slug: "lfg",
      title: "LFG App",
      subtitle: "Made it 20% more engaging for users to track their habits and time, using Octalysis Gamification method.",
      paragraph: "Built for the Milt Olin Foundation to promote distracted-driving awareness and safe road habits through development milestones, scarcity rewards, social leaderboards, and digital collectibles.",
      images: [
        "/assets/5.webp",
        "/assets/Projects/LFG/octalysis.webp",
        "/assets/Projects/LFG/LFG%20-%200.webp",
        "/assets/Projects/LFG/LFG%20-%201.webp",
        "/assets/Projects/LFG/LFG%20-%202.webp",
        "/assets/Projects/LFG/LFG%20-%203.webp",
        "/assets/Projects/LFG/LFG%20-%204.webp",
        "/assets/Projects/LFG/LFG%20-%205.webp"
      ],
      nextProject: "indigo"
    },
    {
      slug: "indigo",
      title: "Indigo",
      subtitle: "Website design for a leading digital marketing agency.",
      paragraph: "Interactive portfolio grid showing campaign successes, client branding results, and communication funnels optimized for agency growth and Behance integration.",
      images: [
        "/assets/1.webp"
      ],
      nextProject: "omaco"
    },
    {
      slug: "omaco",
      title: "Omaco",
      subtitle: "Landing page design for a corporate holding enterprise.",
      paragraph: "Sleek and professional design structure aligning investment groups, company divisions, and values into a cohesive corporate story.",
      images: [
        "/assets/2.webp"
      ],
      nextProject: "airlab"
    },
    {
      slug: "airlab",
      title: "Airlab",
      subtitle: "Website UI design for a futuristic Web3.0 company.",
      paragraph: "Generative AI reportage illustration experiment combined with design layout highlighting visual identity in modern cryptocurrency spaces.",
      images: [
        "/assets/3.webp"
      ],
      nextProject: "sanarte"
    }
  ];

  return NextResponse.json(projects);
}
