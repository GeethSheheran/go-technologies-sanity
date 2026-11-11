import Image from "next/image";
import { copy, destinations } from "@/lib/content";
import { Action } from "./brand";
import { Journeys } from "./journeys";

export function Product() {
  return (
    <section
      className="product-story"
      id="gochauffeur"
      aria-labelledby="product-heading"
    >
      <div className="product-story-intro container">
        <div className="section-label">
          <span className="dot" />
          GoChauffeur
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
              src="/images/sri-lanka-tourist.webp"
              alt="A tourist enjoying Sri Lanka’s tea-country scenery during a private car journey"
              fill
              sizes="(max-width: 600px) 100vw, 50vw"
            />
          </div>
          <span className="eyebrow">FOR TRAVELLERS</span>
          <h3>{copy.product.travellerTitle}</h3>
          <p>{copy.product.travellerBody}</p>
          <Action href={destinations.explore}>{copy.actions.explore}</Action>
        </article>
        <article id="chauffeurs">
          <div className="product-frame product-frame--chauffeur">
            <Image
              src="/images/sri-lankan-chauffeur.webp"
              alt="A Sri Lankan chauffeur in a GoChauffeur polo welcoming travellers beside a car"
              fill
              sizes="(max-width: 600px) 100vw, 50vw"
            />
          </div>
          <span className="eyebrow">FOR CHAUFFEURS</span>
          <h3>{copy.product.chauffeurTitle}</h3>
          <p>{copy.product.chauffeurBody}</p>
          <Action href={destinations.register} secondary>
            {copy.actions.register}
          </Action>
        </article>
      </div>
      <Journeys />
    </section>
  );
}
