"use client";

import { useEffect, useRef } from "react";
import type { mountJourneyPreview } from "./journey-preview-runtime";

export function JourneyPreview({ active }: { active: number }) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof mountJourneyPreview> | null>(
    null,
  );
  const selection = useRef(active);
  useEffect(() => {
    selection.current = active;
    controller.current?.select(active);
  }, [active]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("./journey-preview-runtime")
          .then(({ mountJourneyPreview }) => {
            if (disposed) return;
            controller.current = mountJourneyPreview(element);
            controller.current.select(selection.current);
          })
          .catch(() => {
            if (!disposed) element.dataset.ready = "false";
          });
      },
      { rootMargin: "250px" },
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
    <div ref={host} className="journey-model-preview" aria-hidden="true" />
  );
}
