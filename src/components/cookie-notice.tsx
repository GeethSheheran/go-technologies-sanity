"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import styles from "./cookie-notice.module.css";

const storageKey = "gotech:cookie-notice:v1";
const choiceEvent = "gotech:cookie-notice-choice";
let dismissedThisVisit = false;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(choiceEvent, onChange);
  window.addEventListener("gotech:intro-complete", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(choiceEvent, onChange);
    window.removeEventListener("gotech:intro-complete", onChange);
  };
}

function isVisible() {
  if (dismissedThisVisit) return false;
  try {
    const choice = localStorage.getItem(storageKey);
    if (choice === "accepted" || choice === "declined") return false;
  } catch {
    // The notice still works for this visit when browser storage is unavailable.
  }
  return !document.querySelector(".brand-splash:not([hidden])");
}

const serverSnapshot = () => false;

export function CookieNotice() {
  const visible = useSyncExternalStore(subscribe, isVisible, serverSnapshot);

  function choose(choice: "accepted" | "declined") {
    dismissedThisVisit = true;
    try {
      localStorage.setItem(storageKey, choice);
    } catch {
      // Keep the notice dismissed even if the browser blocks persistence.
    }
    window.dispatchEvent(new Event(choiceEvent));
  }

  if (!visible) return null;

  return (
    <aside className={styles.notice} aria-labelledby="cookie-notice-title">
      <p className="section-label">
        <span className="dot" aria-hidden="true" />
        Privacy matters
      </p>
      <h2 id="cookie-notice-title">Cookies &amp; your privacy</h2>
      <p className={styles.copy}>
        Learn how cookies and similar technologies may be used on this site in
        our <Link href="/cookies">Cookie Policy</Link>.
      </p>
      <div className={styles.actions}>
        <button
          className={styles.accept}
          type="button"
          onClick={() => choose("accepted")}
        >
          Accept
        </button>
        <button
          className={styles.decline}
          type="button"
          onClick={() => choose("declined")}
        >
          Decline
        </button>
      </div>
    </aside>
  );
}
