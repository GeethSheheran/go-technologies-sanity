"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ContentProps } from "@/sanity/types";
import { Arrow } from "./brand";
import { AudienceAvatar } from "./audience-avatar";
export function AudienceRouter({ content }: ContentProps) {
  const { copy } = content;

  const reduced = useReducedMotion();
  return (
    <section
      className="audience-router container"
      aria-labelledby="router-heading"
    >
      <h2 id="router-heading" data-reveal>
        {copy.router.title}
      </h2>
      <div className="audience-links">
        {copy.router.items.map((item) => (
          <div className="audience-item" key={item.variant}>
            <AudienceAvatar variant={item.variant} />
            <motion.a
              className="audience-link"
              tabIndex={0}
              href={item.href}
              whileHover={reduced ? undefined : { y: -6 }}
              whileTap={reduced ? undefined : { scale: 0.99 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span className="audience-action">
                {item.action}
                <Arrow diagonal />
              </span>
            </motion.a>
          </div>
        ))}
      </div>
    </section>
  );
}
