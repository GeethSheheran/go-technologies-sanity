import type { ContentProps } from "@/sanity/types";
import { Action, Arrow } from "./brand";
export function Partnerships({ content }: ContentProps) {
  const { copy } = content;
  const { destinations } = content.settings;

  return (
    <section
      className="partnerships section-space"
      id="partnerships"
      aria-labelledby="partners-heading"
    >
      <div className="container">
        <div className="section-label">
          <span className="dot" />
          {content.settings.labels.partnerships}
        </div>
        <div className="partners-grid">
          <div className="partners-heading" data-reveal>
            <h2 id="partners-heading">{copy.partnerships.title}</h2>
            <p>{copy.partnerships.body}</p>
            <Action href={destinations.partner}>{copy.actions.partner}</Action>
          </div>
          <div className="partners-list">
            {copy.partnerships.items.map((item) => (
              <a
                href={destinations.partner}
                className="partner-row"
                key={item.title}
                data-reveal
              >
                <div>
                  <h3>{item.title}</h3>
                  <p>
                    <span className="sr-only"> - </span>
                    {item.body}
                  </p>
                </div>
                <Arrow diagonal />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
