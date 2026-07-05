export interface Plugin {
  slug: string;
  name: string;
  image: string;
  link: string;
  description: string;
  glow: string;
}

export const PLUGINS: Plugin[] = [
  {
    slug: "primitive-semantic-colors-generator",
    name: "Primitive & Semantic Colors Generator",
    image: "/assets/Plugins/primitive_colors_generator_1x.webp",
    link: "https://www.figma.com/community/plugin/1444818529763652434/primitive-semantic-colors-generator/",
    description:
      "Create, manage, and document comprehensive color systems with ease. Perfect for design systems, brand guidelines, and maintaining color consistency across all of your projects.",
    glow: "rgba(0, 217, 174, 0.12)",
  },
  {
    slug: "numeric-tokens-generator",
    name: "Numeric Tokens Generator",
    image: "/assets/Plugins/numeric_tokens_generator_1x.webp",
    link: "https://www.figma.com/community/plugin/1457720620225105340/numeric-tokens-generator",
    description:
      "Build and manage typography, spacing, border radius, and shadow systems. Speed up your design workflow with a comprehensive, fully token-driven system generator plugin tool.",
    glow: "rgba(164, 53, 240, 0.12)",
  },
  {
    slug: "swap-all-variables",
    name: "Swap All Variables",
    image: "/assets/Plugins/swap_all_variables_1x.png",
    link: "https://www.figma.com/community/plugin/1573002470488884027",
    description:
      "Swap every variable in a document to a target library in one single pass. Control swap scopes and export non-swapped variables for comprehensive cleanup.",
    glow: "rgba(59, 130, 246, 0.12)",
  },
  {
    slug: "missing-variable-finder",
    name: "Missing Variable Finder",
    image: "/assets/Plugins/missing_variable_finder_1x.png",
    link: "https://www.figma.com/community/plugin/1574527445158450447",
    description:
      "Scan Figma design files for variables that are undefined or missing from imported libraries, grouping results by type with node counts for clean handoff.",
    glow: "rgba(0, 191, 255, 0.12)",
  },
];
