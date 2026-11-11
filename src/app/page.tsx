import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Product } from "@/components/product";
import { Principles } from "@/components/principles";
import { Vision } from "@/components/vision";
import { Partnerships } from "@/components/partnerships";
import { AudienceRouter } from "@/components/audience-router";
import { Footer } from "@/components/footer";
import { MotionSystem } from "@/components/motion-system";
import { BrandSplash } from "@/components/brand-splash";
import { SplashLogo } from "@/components/splash-logo";
import { CookieNotice } from "@/components/cookie-notice";

export default function Home() {
  return (
    <>
      <BrandSplash>
        <SplashLogo />
      </BrandSplash>
      <div id="site-content">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">
          <Hero />
          <About />
          <Product />
          <Principles />
          <Vision />
          <Partnerships />
          <AudienceRouter />
        </main>
        <Footer />
        <CookieNotice />
      </div>
      <MotionSystem />
    </>
  );
}
