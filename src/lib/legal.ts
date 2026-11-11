import type { Metadata } from "next";
import content from "./legal-content.json";

export type LegalSlug = "privacy" | "terms" | "cookies";
type LegalBlock =
  | { type: "paragraph" | "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "contact"; lines: string[] };
export type LegalDocument = {
  title: string;
  updated: string;
  sections: { id: string; title: string; blocks: LegalBlock[] }[];
};

// Transcribed from the client's Corporate Website Legal Pages PDF, 13 October 2026.
// Only page furniture and PDF line wrapping have been removed.
export const legalDocuments = content as Record<LegalSlug, LegalDocument>;
export const legalLinks = [
  { slug: "privacy", label: "Privacy Notice" },
  { slug: "terms", label: "Website Terms" },
  { slug: "cookies", label: "Cookie Policy" },
] as const;

export function legalMetadata(slug: LegalSlug): Metadata {
  const title = `${legalDocuments[slug].title} | Go Technologies`;
  const descriptions = {
    privacy:
      "How Go Technologies collects, uses and protects personal information on its corporate website.",
    terms:
      "Terms governing access to and use of the Go Technologies corporate website.",
    cookies:
      "How Go Technologies uses cookies and similar technologies, and how visitors can manage their preferences.",
  };
  return {
    title,
    description: descriptions[slug],
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description: descriptions[slug],
      url: `/${slug}`,
      type: "website",
    },
  };
}
