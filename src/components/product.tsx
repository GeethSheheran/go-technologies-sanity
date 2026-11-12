import Image from "next/image";
import type { ContentProps } from "@/sanity/types";
import { Action } from "./brand";
import { Journeys } from "./journeys";

export function Product({ content }: ContentProps) {
  const { copy } = content;
  const { destinations } = content.settings;

  return (
    <section
      className="product-story"
      id="gochauffeur"
      aria-labelledby="product-heading"
    >
      <div className="product-story-intro container">
        <div className="section-label">
          <span className="dot" />
          {content.settings.labels.product}
        </div>
        <div className="product-story-heading">
          <h2 id="product-heading">{copy.product.title}</h2>
          <p>{copy.product.body}</p>
        </div>
      </div>
      <div className="product-story-audiences container">
        <article id="travellers">
          <div className="product-frame product-frame--passenger">
            <Image
              src={content.settings.images.traveller.src}
              alt={content.settings.images.traveller.alt}
              fill
              sizes="(max-width: 600px) 100vw, 50vw"
            />
          </div>
          <span className="eyebrow">{content.settings.labels.travellers}</span>
          <h3>{copy.product.travellerTitle}</h3>
          <p>{copy.product.travellerBody}</p>
          <Action href={destinations.explore}>{copy.actions.explore}</Action>
        </article>
        <article id="chauffeurs">
          <div className="product-frame product-frame--chauffeur">
            <Image
              src={content.settings.images.chauffeur.src}
              alt={content.settings.images.chauffeur.alt}
              fill
              sizes="(max-width: 600px) 100vw, 50vw"
            />
          </div>
          <span className="eyebrow">{content.settings.labels.chauffeurs}</span>
          <h3>{copy.product.chauffeurTitle}</h3>
          <p>{copy.product.chauffeurBody}</p>
          <Action href={destinations.register} secondary>
            {copy.actions.register}
          </Action>
        </article>
      </div>
      <Journeys content={content} />
    </section>
  );
}
