import { LegalPage } from "@/components/legal-page";
import { getContent } from "@/sanity/lib/content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return (await getContent()).legal.cookies.seo as Metadata;
}
export default function CookiesPage() {
  return <LegalPage slug="cookies" />;
}
