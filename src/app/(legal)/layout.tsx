import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header homePath="/" />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer homePath="/" compact />
    </div>
  );
}
