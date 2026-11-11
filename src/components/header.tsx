"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Brand, Arrow } from "./brand";

const links = [
  ["Home", "#home"],
  ["About", "#about"],
  ["GoChauffeur", "#gochauffeur"],
  ["Partnerships", "#partnerships"],
  ["Contact", "#contact"],
];

export function Header({ homePath = "" }: { homePath?: string }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer"),
    );
    const inertBefore = background.map((el) => el.inert);
    background.forEach((el) => {
      el.inert = true;
    });
    const first = menuRef.current?.querySelector<HTMLAnchorElement>("a");
    first?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === "Tab") {
        const items = [
          triggerRef.current,
          ...Array.from(
            menuRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    const wide = window.matchMedia("(min-width: 901px)");
    const closeOnWide = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener("change", closeOnWide);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((el, i) => {
        el.inert = inertBefore[i];
      });
      document.removeEventListener("keydown", handleKey);
      wide.removeEventListener("change", closeOnWide);
    };
  }, [open]);
  return (
    <header className={`site-header ${open ? "is-open" : ""}`}>
      <div className="header-inner">
        <a
          href={`${homePath}#home`}
          className="brand-link"
          aria-label="Go Technologies home"
          onClick={() => setOpen(false)}
        >
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a key={href} href={`${homePath}${href}`}>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="header-contact"
          href={`${homePath}#contact`}
          aria-label="Contact Go Technologies"
        >
          <Arrow diagonal />
        </a>
        <button
          ref={triggerRef}
          className="menu-trigger"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-navigation"
            className="mobile-navigation"
            initial={{ opacity: 0, y: reduced ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: 0.2 }}
          >
            <nav aria-label="Mobile navigation">
              {links.map(([label, href], i) => (
                <motion.a
                  href={`${homePath}${href}`}
                  key={href}
                  initial={{ opacity: 0, x: reduced ? 0 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduced ? 0 : i * 0.035 }}
                  onClick={() => setOpen(false)}
                >
                  {label}
                  <Arrow diagonal />
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="scroll-progress" aria-hidden="true" />
    </header>
  );
}
