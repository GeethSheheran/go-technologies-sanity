import type { ContentProps } from "@/sanity/types";
import Link from "next/link";
import { Action, Arrow, Brand } from "./brand";
export function Footer({
  content,
  homePath = "",
  compact = false,
}: ContentProps & {
  homePath?: string;
  compact?: boolean;
}) {
  const { copy, settings } = content;
  const { destinations } = settings;
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
          {settings.footerColumns.map((column) => (
            <div key={column.title}>
              <span className="footer-column-title">{column.title}</span>
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={
                    link.href.startsWith("#")
                      ? `${homePath}${link.href}`
                      : link.href
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-baseline">
          <div className="footer-credits">
            <span>{settings.copyright}</span>
            <span>
              {settings.creditPrefix}{" "}
              <a href={settings.creditHref}>{settings.creditLabel}</a>
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
