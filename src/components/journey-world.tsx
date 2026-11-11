"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { mountJourneyWorld } from "./journey-world-runtime";
import styles from "./journey-world.module.css";

type Controller = ReturnType<typeof mountJourneyWorld>;

export function JourneyWorld() {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // Load the live scene only as its hero container approaches the viewport.
        import("./journey-world-runtime")
          .then(({ mountJourneyWorld }) => {
            if (disposed) return;
            controller.current = mountJourneyWorld(element);
          })
          .catch(() => {
            if (!disposed) element.dataset.render = "fallback";
          });
      },
      { rootMargin: "400px" },
    );
    observer.observe(element);
    return () => {
      disposed = true;
      observer.disconnect();
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  return (
    <div className={styles.world}>
      <div
        ref={host}
        className={styles.canvas}
        data-render="loading"
        role="img"
        aria-label="Interactive Sri Lankan landscape with an airport, Lotus Tower, white domed stupa, Sigiriya-inspired rock, tea-covered hills with a waterfall, coconut palms and coast."
      >
        <div className={styles.fallback}>
          <Image
            src="/images/sri-lanka-sigiriya.webp"
            alt=""
            fill
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
}
