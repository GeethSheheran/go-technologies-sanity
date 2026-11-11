import Link from "next/link";
import { legalDocuments, legalLinks, type LegalSlug } from "@/lib/legal";
import styles from "./legal-page.module.css";

// Make the document's references actionable without changing its wording.
const references: Record<string, string> = {
  "Privacy Notice": "/privacy",
  "Website Terms": "/terms",
  "Cookie Policy": "/cookies",
  "hello@gotechnologies.lk": "mailto:hello@gotechnologies.lk",
  "https://gotechnologies.lk": "/",
  "https://policies.google.com/privacy": "https://policies.google.com/privacy",
};
function LegalText({ text, slug }: { text: string; slug: LegalSlug }) {
  return text
    .split(
      /(https:\/\/policies\.google\.com\/privacy|https:\/\/gotechnologies\.lk|hello@gotechnologies\.lk|Privacy Notice|Website Terms|Cookie Policy)/g,
    )
    .map((part, i) =>
      references[part] && references[part] !== `/${slug}` ? (
        <a href={references[part]} key={i}>
          {part}
        </a>
      ) : (
        part
      ),
    );
}

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const document = legalDocuments[slug];
  return (
    <>
      <div className={styles.hero}>
        <div className="container">
          <p className="section-label">
            <span className="dot" aria-hidden="true" />
            Legal
          </p>
          <div className={styles.heading}>
            <h1>{document.title}</h1>
            <p>
              Last updated <time dateTime="2026-10-13">{document.updated}</time>
            </p>
          </div>
          <nav className={styles.policies} aria-label="Legal pages">
            {legalLinks.map(({ slug: target, label }) => (
              <Link
                href={`/${target}`}
                key={target}
                aria-current={target === slug ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className={`container ${styles.body}`}>
        <article className={styles.article} aria-label={document.title}>
          {document.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
              aria-labelledby={`${section.id}-title`}
            >
              <h2 id={`${section.id}-title`}>
                <span>{index + 1}.</span> {section.title}
              </h2>
              {section.blocks.map((block, i) => {
                switch (block.type) {
                  case "paragraph":
                    return (
                      <p key={i}>
                        <LegalText text={block.text} slug={slug} />
                      </p>
                    );
                  case "heading":
                    return <h3 key={i}>{block.text}</h3>;
                  case "list":
                    return (
                      <ul key={i}>
                        {block.items.map((item) => (
                          <li key={item}>
                            <LegalText text={item} slug={slug} />
                          </li>
                        ))}
                      </ul>
                    );
                  case "contact":
                    return (
                      <address key={i}>
                        {block.lines.map((line) => (
                          <div key={line}>
                            <LegalText text={line} slug={slug} />
                          </div>
                        ))}
                      </address>
                    );
                }
              })}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
