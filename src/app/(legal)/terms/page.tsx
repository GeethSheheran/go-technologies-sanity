import { LegalPage } from "@/components/legal-page";
import { getContent } from "@/sanity/lib/content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return (await getContent()).legal.terms.seo as Metadata;
}
export default function TermsPage() {
  return <LegalPage slug="terms" />;
}
