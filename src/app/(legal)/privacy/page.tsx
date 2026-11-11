import { LegalPage } from "@/components/legal-page";
import { legalMetadata } from "@/lib/legal";

export const metadata = legalMetadata("privacy");
export default function PrivacyPage() {
  return <LegalPage slug="privacy" />;
}
