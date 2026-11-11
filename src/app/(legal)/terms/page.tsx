import { LegalPage } from "@/components/legal-page";
import { legalMetadata } from "@/lib/legal";

export const metadata = legalMetadata("terms");
export default function TermsPage() {
  return <LegalPage slug="terms" />;
}
