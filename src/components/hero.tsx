import { JourneyWorld } from "./journey-world";
import { copy } from "@/lib/content";
import { Action, Arrow } from "./brand";

export function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <div className="hero-top container">
        <h1 id="hero-heading" aria-label={copy.hero.title}>
          <span className="hero-line" aria-hidden="true">
            <span>Everything begins </span>
          </span>
          <span className="hero-line" aria-hidden="true">
            <span>
              with <em>Go.</em>
              <span className="hero-period-arrow">
                <Arrow diagonal />
              </span>
            </span>
          </span>
        </h1>
        <div className="hero-support">
          <h2>{copy.hero.subtitle}</h2>
          <p>{copy.hero.body}</p>
          <Action href="#gochauffeur">{copy.actions.explore}</Action>
        </div>
      </div>
      <div className="hero-visual-wrap container">
        <div className="hero-visual">
          <div className="hero-model-backdrop" aria-hidden="true" />
          <JourneyWorld />
          <div className="hero-stencil" aria-hidden="true">
            <div className="hero-stencil-frame">
              <svg viewBox="0 0 6661 2817" aria-hidden="true">
                <defs>
                  <filter id="hero-go-ink" colorInterpolationFilters="sRGB">
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    />
                  </filter>
                  <mask
                    id="hero-go-aperture"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="6661"
                    height="2817"
                    style={{ maskType: "luminance" }}
                  >
                    <rect width="6661" height="2817" fill="white" />
                    <image
                      href="/brand/Asset 80@4x-8.png"
                      width="6661"
                      height="2817"
                      filter="url(#hero-go-ink)"
                    />
                  </mask>
                </defs>
                <rect
                  width="6661"
                  height="2817"
                  fill="white"
                  mask="url(#hero-go-aperture)"
                />
              </svg>
            </div>
          </div>
          <div className="hero-photo-caption">
            <span>{copy.hero.signature}</span>
            <Arrow diagonal />
          </div>
        </div>
        <div className="hero-baseline">
          <span>{copy.hero.signature}</span>
          <a href="#about">
            {copy.actions.discover}
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
