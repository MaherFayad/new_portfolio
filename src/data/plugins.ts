export interface Plugin {
  slug: string;
  name: string;
  image: string;
  link: string;
  description: string;
}

export const PLUGINS: Plugin[] = [
  {
    slug: "primitive-semantic-colors-generator",
    name: "Primitive & Semantic Colors Generator",
    image: "/assets/Plugins/primitive_colors_generator_1x.webp",
    link: "https://www.figma.com/community/plugin/1444818529763652434/primitive-semantic-colors-generator/",
    description:
      "Create, manage, and document comprehensive color systems with ease. Perfect for design systems, brand guidelines, and maintaining color consistency across projects.",
  },
  {
    slug: "numeric-tokens-generator",
    name: "Numeric Tokens Generator",
    image: "/assets/Plugins/numeric_tokens_generator_1x.webp",
    link: "https://www.figma.com/community/plugin/1457720620225105340/numeric-tokens-generator",
    description:
      "Transform your design workflow with a comprehensive design system generator that creates and manages typography, spacing, border radius, and shadow systems.",
  },
];
