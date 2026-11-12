import { LegalPage } from "@/components/legal-page";
import { getContent } from "@/sanity/lib/content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return (await getContent()).legal.privacy.seo as Metadata;
}
export default function PrivacyPage() {
  return <LegalPage slug="privacy" />;
}
