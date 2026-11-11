import { copy, destinations } from "@/lib/content";
import Link from "next/link";
import { Action, Arrow, Brand } from "./brand";
export function Footer({
  homePath = "",
  compact = false,
}: {
  homePath?: string;
  compact?: boolean;
}) {
  return (
    <footer
      className={`site-footer${compact ? " site-footer--compact" : ""}`}
      id="contact"
    >
      <div className="container">
        {!compact && (
          <div className="closing">
            <div className="closing-heading" data-reveal>
              <h2>{copy.closing.title}</h2>
              <Action href={destinations.contact}>
                {copy.actions.contact}
              </Action>
            </div>
            <div className="closing-copy" data-reveal>
              {copy.closing.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p>{copy.closing.body}</p>
              <span>{copy.closing.question}</span>
            </div>
          </div>
        )}
        <div className="footer-links">
          <div className="footer-brand">
            <Brand light />
            <p>{copy.hero.title}</p>
          </div>
          <div>
            <span className="footer-column-title">PRODUCT</span>
            <a href={`${homePath}#gochauffeur`}>GoChauffeur</a>
            <a href={`${homePath}#journeys`}>Explore GoChauffeur</a>
            <a href={`${homePath}#chauffeurs`}>Register as a Chauffeur</a>
          </div>
          <div>
            <span className="footer-column-title">COMPANY</span>
            <a href={`${homePath}#about`}>About</a>
            <a href={`${homePath}#partnerships`}>Partnerships</a>
            <a href={destinations.contact}>Contact</a>
          </div>
          <div>
            <span className="footer-column-title">LEGAL</span>
            <Link href="/privacy">Privacy Notice</Link>
            <Link href="/terms">Website Terms</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>
        <div className="footer-baseline">
          <div className="footer-credits">
            <span>© 2026 Go Technologies. All rights reserved.</span>
            <span>
              Developed by <a href="https://www.tourithm.lk/">Tourithm.lk</a>
            </span>
          </div>
          <a href={compact ? "#top" : "#home"} aria-label="Back to top">
            <Arrow />
          </a>
        </div>
      </div>
    </footer>
  );
}
