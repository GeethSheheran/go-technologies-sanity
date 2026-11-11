"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import styles from "./brand-splash.module.css";

export function BrandSplash({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const overlay = root.current;
    const site = document.getElementById("site-content");
    if (!overlay || !site) return;

    const previousOverflow = document.body.style.overflow;
    const previousInert = site.inert;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let complete = false;
    let timeline: gsap.core.Timeline | undefined;
    const release = () => {
      document.body.style.overflow = previousOverflow;
      site.inert = previousInert;
    };
    const finish = () => {
      if (complete) return;
      complete = true;
      timeline?.kill();
      overlay.hidden = true;
      release();
      window.dispatchEvent(new Event("gotech:intro-complete"));
    };
    const onKey = (event: KeyboardEvent) => {
      // Keyboard visitors can continue straight into the page without a delay.
      if (event.key === "Escape" || event.key === "Tab") finish();
    };
    const onPreference = () => {
      if (preference.matches) finish();
    };

    overlay.hidden = false;
    site.inert = true;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    preference.addEventListener("change", onPreference);
    // Never let a decorative intro hold the site behind an overlay.
    const deadline = window.setTimeout(finish, 4500);

    const context = gsap.context(() => {
      const strokes = gsap.utils.toArray<SVGPathElement>("[data-go-stroke]");
      timeline = gsap.timeline({ onComplete: finish });

      if (preference.matches || window.location.hash) {
        gsap.set("[data-go-complete]", { opacity: 1 });
        timeline.to(overlay, { opacity: 0, duration: 0.15 });
        return;
      }

      strokes.forEach((stroke) => {
        const length = stroke.getTotalLength();
        gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set("[data-go-symbol]", {
        x: 835,
        scale: 1.2,
        svgOrigin: "208 91",
      });
      gsap.set("[data-logo-letter]", { y: 65, opacity: 0 });
      gsap.set("[data-logo-tm]", { opacity: 0 });

      timeline
        .to(
          strokes[0],
          { strokeDashoffset: 0, duration: 0.85, ease: "power2.inOut" },
          0.08,
        )
        .to(
          strokes[2],
          { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" },
          0.2,
        )
        .to(
          strokes[1],
          { strokeDashoffset: 0, duration: 0.38, ease: "power3.out" },
          0.62,
        )
        .to("[data-go-complete]", { opacity: 1, duration: 0.12 }, 0.94)
        .to(
          "[data-go-symbol]",
          { x: 0, scale: 1, duration: 0.85, ease: "power3.inOut" },
          1.12,
        )
        .to(
          "[data-logo-letter]",
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.034,
            ease: "power3.out",
          },
          1.42,
        )
        .to("[data-logo-tm]", { opacity: 1, duration: 0.25 }, 2.08)
        .to(overlay, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 2.65);
    }, overlay);

    return () => {
      window.clearTimeout(deadline);
      window.removeEventListener("keydown", onKey);
      preference.removeEventListener("change", onPreference);
      context.revert();
      release();
    };
  }, []);

  return (
    <>
      <div
        ref={root}
        className={`brand-splash ${styles.splash}`}
        aria-hidden="true"
        data-lenis-prevent
      >
        <div className={styles.artwork}>{children}</div>
        <p className={styles.copyright}>
          © 2026 Go Technologies. All rights reserved.
        </p>
      </div>
      <noscript>
        <style>{".brand-splash { display: none !important; }"}</style>
      </noscript>
    </>
  );
}
