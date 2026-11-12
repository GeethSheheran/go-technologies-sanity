import type { ContentProps } from "@/sanity/types";

export function Vision({ content }: ContentProps) {
  const { copy } = content;

  return (
    <section className="vision-story" aria-labelledby="vision-heading">
      <div className="vision-layout container">
        <div className="vision-heading-group">
          <h2 id="vision-heading">{copy.vision.title}</h2>
          <p className="vision-signature">{copy.vision.signature}</p>
        </div>
        <div className="vision-narrative">
          <p className="vision-lead">{copy.vision.subtitle}</p>
          <div className="vision-body">
            {copy.vision.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
