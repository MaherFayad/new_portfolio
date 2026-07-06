"use client";

interface ChatCertificateCardProps {
  slug: string;
  onNavigate?: () => void;
  compact?: boolean;
}

export const CERTIFICATES = [
  {
    slug: "google-ux-design",
    name: "Google UX Design Professional Certificate",
    title: "Google UX Design",
    image: "/assets/badges/google-ux-design-professional-certificate.webp",
    link: "https://www.credly.com/badges/5f3aa817-a4c2-4cee-8364-bd8b163a737b/public_url",
    glow: "rgba(66, 133, 244, 0.15)",
  },
  {
    slug: "google-data-analytics",
    name: "Google Data Analytics Professional Certificate",
    title: "Google Data Analytics",
    image: "/assets/badges/google-data-analytics-professional-certificate.webp",
    link: "https://www.credly.com/badges/4b94e10d-d67c-43cb-b529-f9127c04ed91/public_url",
    glow: "rgba(234, 67, 53, 0.15)",
  },
  {
    slug: "ibm-design-thinking",
    name: "Enterprise Design Thinking Practitioner",
    title: "IBM Design Thinking",
    image: "/assets/badges/enterprise-design-thinking-practitioner.webp",
    link: "https://www.credly.com/badges/ed0ef7e8-cc68-41e9-8e10-664be336e779/public_url",
    glow: "rgba(15, 98, 254, 0.15)",
  },
  {
    slug: "ibm-co-creator",
    name: "Enterprise Design Thinking Co-Creator",
    title: "IBM Co-Creator",
    image: "/assets/badges/Enterprise-Design-Thinking-Co-Creator.webp",
    link: "https://www.credly.com/badges/32de5750-f31b-470d-a179-8dadc54756fd/public_url",
    glow: "rgba(0, 45, 156, 0.15)",
  },
  {
    slug: "mckinsey-forward",
    name: "McKinsey Forward Program",
    title: "McKinsey Forward",
    image: "/assets/badges/mckinsey-forward-program.webp",
    link: "https://www.credly.com/badges/0e8306a5-d19b-4524-94ca-a2f501be3d81/public_url",
    glow: "rgba(5, 28, 72, 0.25)",
  },
  {
    slug: "meta-front-end-dev",
    name: "Meta Front-End Developer Certificate",
    title: "Meta Front-End Dev",
    image: "/assets/badges/meta-front-end-developer-certificate.webp",
    link: "https://www.credly.com/badges/2e307edc-0639-42bb-a70c-c6cac291fec3/public_url",
    glow: "rgba(127, 20, 229, 0.15)",
  },
  {
    slug: "product-analytics",
    name: "Product Analytics Certification",
    title: "Product Analytics",
    image: "/assets/badges/Product-Analytics-Certification.webp",
    link: "https://www.credly.com/badges/bf32a815-e57e-4ed4-8475-45ccdceb586a/public_url",
    glow: "rgba(230, 81, 0, 0.15)",
  },
];

export default function ChatCertificateCard({ slug, onNavigate, compact = false }: ChatCertificateCardProps) {
  const cert = CERTIFICATES.find((c) => c.slug === slug);

  if (!cert) {
    return null;
  }

  const { title, name, image, link, glow } = cert;

  // Adapt size for chat context:
  // Compact (in mobile horizontal scroll): w-[220px] h-[240px]
  // Standard full-width: w-full h-[320px]
  const cardClassName = `group my-4 flex flex-col items-center relative overflow-hidden cursor-pointer select-none border border-white/5 ${
    compact
      ? "shrink-0 snap-start w-[220px] h-[240px]"
      : "w-full h-[280px] sm:h-[320px]"
  }`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className={cardClassName}
      style={{ backgroundColor: "hsl(33, 14%, 12%)", transformStyle: "preserve-3d" }}
    >
      {/* Radial glow background on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glow} 0%, transparent 70%)`,
        }}
      />

      {/* Mini Brand Icon */}
      <img
        alt=""
        className="mt-4 lg:mt-6 relative z-1 select-none pointer-events-none w-auto h-auto max-w-[1.25rem] lg:max-w-[1.75rem] opacity-40 group-hover:opacity-100 transition-opacity duration-300"
        src="/ar.svg"
      />

      {/* Certificate Title */}
      <h3 className="mt-2 lg:mt-3 font-medium text-xs lg:text-sm tracking-[-0.04em] text-white relative z-1 pointer-events-none px-4 text-center w-full max-w-full line-clamp-2 break-words">
        {title}
      </h3>

      {/* Credly badge layout */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[6%] transition-transform duration-[0.6s] ease-in-out pointer-events-none ${
          compact ? "w-[120px] h-[120px]" : "w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
        }`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain object-bottom filter saturate-50 group-hover:saturate-100 group-hover:scale-[1.05] transition-all duration-[0.6s]"
        />
      </div>
    </a>
  );
}
