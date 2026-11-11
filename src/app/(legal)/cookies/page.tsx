import { LegalPage } from "@/components/legal-page";
import { legalMetadata } from "@/lib/legal";

export const metadata = legalMetadata("cookies");
export default function CookiesPage() {
  return <LegalPage slug="cookies" />;
}
