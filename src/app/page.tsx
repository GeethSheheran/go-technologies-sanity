import { getContent } from "@/sanity/lib/content";
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
export default async function Home() {
  const content = await getContent();
  return (
    <>
      <BrandSplash>
        <SplashLogo />
      </BrandSplash>
      <div id="site-content">
        <a className="skip-link" href="#main">
          {content.settings.labels.skip}
        </a>
        <Header content={content} />
        <main id="main">
          <Hero content={content} />
          <About content={content} />
          <Product content={content} />
          <Principles content={content} />
          <Vision content={content} />
          <Partnerships content={content} />
          <AudienceRouter content={content} />
        </main>
        <Footer content={content} />
        <CookieNotice content={content} />
      </div>
      <MotionSystem />
    </>
  );
}
