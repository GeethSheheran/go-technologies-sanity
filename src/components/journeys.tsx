"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ContentProps } from "@/sanity/types";
import { Arrow } from "./brand";
import { JourneyPreview } from "./journey-preview";

export function Journeys({ content }: ContentProps) {
  const { copy } = content;
  const scenes = content.settings.images.journeys;

  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  function selectWithKeyboard(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const direction =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!direction && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? scenes.length - 1
          : (index + direction + scenes.length) % scenes.length;
    setActive(next);
    buttons.current[next]?.focus();
  }
  return (
    <div className="journey-explorer container section-space" id="journeys">
      <div className="journey-explorer-heading">
        <h3 id="journey-heading">{copy.product.journeysTitle}</h3>
        <span className="journey-direction" aria-hidden="true">
          <Arrow diagonal />
        </span>
      </div>
      <div className="journey-explorer-grid">
        <div className="journey-image-stack">
          {scenes.map((scene, index) => (
            <motion.div
              className="journey-scene"
              role="tabpanel"
              id={`journey-panel-${index}`}
              aria-labelledby={`journey-tab-${index}`}
              key={scene.src + index}
              initial={false}
              animate={{
                opacity: active === index ? 1 : 0,
                transform: active === index ? "scale(1)" : "scale(1.045)",
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden={active !== index}
            >
              <Image
                src={scene.src}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 52vw"
                style={{ objectPosition: scene.position }}
              />
              <span className="sr-only">{scene.alt}</span>
            </motion.div>
          ))}
          <JourneyPreview active={active} />
          <div className="journey-image-label" aria-hidden="true">
            <span>{copy.product.journeys[active]}</span>
            <Arrow diagonal />
          </div>
        </div>
        <div className="journey-options">
          <div
            role="tablist"
            aria-labelledby="journey-heading"
            aria-orientation="vertical"
          >
            {copy.product.journeys.map((journey, index) => (
              <button
                key={journey}
                id={`journey-tab-${index}`}
                role="tab"
                aria-selected={index === active}
                aria-controls={`journey-panel-${index}`}
                tabIndex={index === active ? 0 : -1}
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                onClick={() => setActive(index)}
                onKeyDown={(event) => selectWithKeyboard(event, index)}
              >
                <span className="journey-option-dot" aria-hidden="true" />
                <span>{journey}</span>
                <Arrow diagonal />
              </button>
            ))}
          </div>
          <a
            className="journey-contact"
            href={`mailto:${content.settings.contactEmail}?subject=${encodeURIComponent(`GoChauffeur - ${copy.product.journeys[active]}`)}`}
          >
            <span>{copy.actions.contact}</span>
            <Arrow />
          </a>
        </div>
      </div>
    </div>
  );
}
