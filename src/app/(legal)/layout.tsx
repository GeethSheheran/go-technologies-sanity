import { getContent } from "@/sanity/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();
  return (
    <div id="top">
      <a className="skip-link" href="#main">
        {content.settings.labels.skip}
      </a>
      <Header content={content} homePath="/" />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer content={content} homePath="/" compact />
    </div>
  );
}
