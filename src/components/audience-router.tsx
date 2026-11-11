"use client";
import { motion, useReducedMotion } from "framer-motion";
import { copy } from "@/lib/content";
import { Arrow } from "./brand";
import { AudienceAvatar } from "./audience-avatar";
export function AudienceRouter() {
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
        {copy.router.items.map((item, index) => (
          <div className="audience-item" key={item.title}>
            <AudienceAvatar variant={index} />
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
