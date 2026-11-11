import gsap from "gsap";

/** Called inside gsap.matchMedia so every timeline is reverted on teardown. */
export function createStoryMotion() {
  gsap.fromTo(
    ".principles-motion-mark",
    { xPercent: -4, rotation: -8 },
    {
      xPercent: 4,
      rotation: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".principles-mark-window",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      },
    },
  );
  gsap.fromTo(
    ".product-frame img",
    { scale: 1.12, yPercent: -3 },
    {
      scale: 1,
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".product-story-audiences",
        start: "top bottom",
        end: "bottom 20%",
        scrub: 0.7,
      },
    },
  );
  const rows = gsap.utils.toArray<HTMLElement>(".principle-row");
  rows.forEach((row) => {
    gsap.from(row, {
      y: 20,
      opacity: 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: row,
        start: "top 90%",
        end: "top 65%",
        scrub: 0.5,
      },
    });
  });

  gsap.from(".closing-copy p", {
    y: 18,
    opacity: 0,
    stagger: 0.12,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: { trigger: ".closing-copy", start: "top 85%", once: true },
  });
}
