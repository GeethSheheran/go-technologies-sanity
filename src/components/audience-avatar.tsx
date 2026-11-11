"use client";

import { useEffect, useRef } from "react";

export function AudienceAvatar({ variant }: { variant: number }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("./audience-avatar-runtime")
          .then(({ mountAudienceAvatar }) => {
            if (!disposed) cleanup = mountAudienceAvatar(element, variant);
          })
          .catch(() => {
            if (!disposed) element.dataset.render = "unavailable";
          });
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
    };
  }, [variant]);

  return <div ref={host} className="audience-avatar" aria-hidden="true" />;
}
