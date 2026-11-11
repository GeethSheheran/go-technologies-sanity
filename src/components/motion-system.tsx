"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { createStoryMotion } from "./story-motion";

export function MotionSystem() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        anchors: { offset: -90 },
        prevent: (node) =>
          document.body.style.overflow === "hidden" ||
          node.closest("[data-lenis-prevent]") !== null,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const intro = gsap.timeline({
        paused: !!document.querySelector(".brand-splash:not([hidden])"),
        defaults: { ease: "power3.out" },
      });
      const startIntro = () => {
        intro.play();
      };
      window.addEventListener("gotech:intro-complete", startIntro);
      intro
        .from(".hero-line > span", {
          yPercent: 110,
          rotate: 2,
          duration: 1.15,
          stagger: 0.12,
        })
        .fromTo(
          ".hero-support > *",
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            clearProps: "transform,opacity",
          },
          0.35,
        )
        .from(".hero-visual", { opacity: 0, y: 35, duration: 1 }, 0.3);

      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 26,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6, scale: 1.12 },
          {
            yPercent: 6,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      const refresh = () => ScrollTrigger.refresh();
      let disposed = false;
      document.fonts.ready.then(() => {
        if (!disposed) refresh();
      });
      window.addEventListener("load", refresh);
      return () => {
        disposed = true;
        window.removeEventListener("load", refresh);
        window.removeEventListener("gotech:intro-complete", startIntro);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    mm.add(
      {
        desktop: "(min-width: 901px)",
        mobile: "(max-width: 900px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const desktop = context.conditions.desktop;
        const visual = document.querySelector<HTMLElement>(".hero-visual");
        const reveal = { progress: 0 };
        const syncScene = () => {
          if (visual) visual.dataset.reveal = String(reveal.progress);
          window.dispatchEvent(
            new CustomEvent("gotech:hero-reveal", {
              detail: reveal.progress,
            }),
          );
        };
        const hero = gsap.timeline({
          onUpdate: syncScene,
          scrollTrigger: {
            trigger: ".hero-visual-wrap",
            start: desktop ? "top 100px" : "top 65%",
            end: desktop ? "+=420" : "top 10%",
            scrub: desktop ? 1 : 0.5,
            pin: !!desktop,
            anticipatePin: desktop ? 1 : 0,
          },
        });
        hero
          .to(reveal, { progress: 1, duration: 1, ease: "none" }, 0)
          .to(
            ".hero-stencil",
            { scale: 3.6, opacity: 0, duration: 1, ease: "power2.in" },
            0,
          )
          .to(
            ".hero-model-backdrop",
            { opacity: 0, duration: 0.65, ease: "power1.inOut" },
            0.25,
          )
          .fromTo(
            ".hero-photo-caption",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
            0.65,
          );
        syncScene();
      },
    );
    mm.add(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      () => {
        createStoryMotion();
        gsap.utils.toArray<HTMLElement>(".reveal-word").forEach((word, i) => {
          gsap.fromTo(
            word,
            { opacity: 0.6 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".about-title",
                start: `top ${85 - i * 1.8}%`,
                end: `top ${66 - i * 1.8}%`,
                scrub: true,
              },
            },
          );
        });
      },
    );
    return () => mm.revert();
  }, []);
  return null;
}
