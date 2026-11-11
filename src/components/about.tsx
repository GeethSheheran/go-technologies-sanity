import { copy } from "@/lib/content";

export function About() {
  return (
    <>
      <section
        className="about section-space container"
        id="about"
        aria-labelledby="about-heading"
      >
        <div className="section-label">
          <span className="dot" />
          About
        </div>
        <div className="about-content">
          <h2
            className="about-title"
            id="about-heading"
            aria-label={copy.about.title}
          >
            {copy.about.title.split(" ").map((word, i) => (
              <span className="reveal-word" aria-hidden="true" key={i}>
                {word}{" "}
              </span>
            ))}
          </h2>
          <div className="about-bottom">
            <div className="about-signature">
              <p>{copy.about.motto}</p>
            </div>
            <div className="body-copy" data-reveal>
              {copy.about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
