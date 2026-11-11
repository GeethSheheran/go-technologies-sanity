import { copy } from "@/lib/content";
import { GoMark } from "./brand";

export function Principles() {
  return (
    <section className="principles-story" aria-labelledby="principles-heading">
      <div className="principles-layout container">
        <div className="principles-summary">
          <h2 id="principles-heading">{copy.principles.title}</h2>
          <p>{copy.principles.subtitle}</p>
        </div>
        <div className="principles-reading">
          {copy.principles.items.map((item, index) => (
            <article
              className="principle-row"
              key={item.title}
              data-principle={index}
            >
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="principles-mark-window" aria-hidden="true">
        <GoMark className="principles-motion-mark" />
      </div>
    </section>
  );
}
