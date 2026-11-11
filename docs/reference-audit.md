# GoTechnologies — reference and motion direction audit

Reviewed 16 September 2026. Direct browser inspection of [Joby Aviation](https://www.jobyaviation.com/), [Fourmula](https://fourmula.ai/), and the running GoTechnologies frontend at localhost:3000. Desktop viewport: 1440 × 1000. Scrolled through both reference homepages in stages, inspected rendered states, and compared the local motion implementation. This is a visual and motion-direction audit, not a full accessibility or performance certification. Proposed sequences below are recommendations, not implemented changes.

## Subsequent client direction

The client selected Joby as the lead reference: cinematic imagery and quieter supporting typography. They rejected oversized supporting panels, node/orbit diagrams, and a full-screen enlargement of the vehicle brand mockup. Those treatments have been removed. The proposed graphic sequences below are retained as audit history, not the current implementation direction.

## Main finding

GoTechnologies has a distinctive hero but does not sustain its sense of discovery. Most subsequent content enters with the same upward fade, while photographs receive the same small vertical parallax. There is movement, but little development within a scene or continuity between scenes. The reference sites give scrolling a visible consequence: a camera advances, a composition rearranges, or one chapter physically recedes as another takes over.

The imagery is equally important. Our aerial road and distant landscape establish geography, but communicate little about travellers, chauffeurs, coordination, or the feeling of a private journey. They are carrying more visual weight than their subject matter supports.

## Joby: what was observed

- The opening holds a full-screen visual sequence while scrolling advances from a passenger looking over a city to aircraft details, flight, and landing. Messages change within that persistent scene. The rendered video was paused at a nonzero playback position during inspection, consistent with the observed scroll-driven sequence; this is distinct from merely placing an autoplay loop behind a heading.
- Large rounded scene boundaries reveal a saturated blue field and oversized typography. The transition itself introduces the next chapter.
- The experience section changes image scale and placement across successive scroll positions: a tall city view becomes part of a sequence of passenger and boarding imagery. Small previews establish what comes next.
- The app section connects product explanation with a travel diagram. The partner area focuses attention on a selected category, a central image, and supporting text.
- The closing sequence switches to layered illustrated clouds and a city panorama before the blue footer. Photography, interface explanation, illustration, and solid colour create deliberate changes of pace.
- Brand identity is carried by repeated curves, colours, and the flight theme across the page. The exact mechanics of every logo animation were not isolated in this review.

Why it works: the viewer is following a journey through a coherent visual world. Large scenes contain fewer competing elements, and the imagery makes the product emotionally understandable.

Evidence: [opening sequence](reference-audit/joby-4300.png), [experience sequence](reference-audit/joby-13400.png).

## Fourmula: what was observed

- The hero arranges image tiles around a central upload prompt. The tiles change orientation and position, giving the opening activity while the surrounding layout remains sparse.
- Oversized headings, thin rules, and a compact fixed menu with a changing scroll percentage establish an editorial structure.
- Product demonstrations show an input garment alongside multiple outputs. Image groupings communicate what the service produces before the visitor reads the supporting explanation.
- The numbered process chapters introduce large colour changes. During scrolling, an outgoing panel visibly tilts and recedes while the next panel rises over it. This is the strongest directly reusable motion idea in this reference.
- The final FAQ and footer return to a quieter layout. The entire page is not kept at maximum intensity.

Why it works: restrained surroundings make the moving image arrangements and dimensional panel transitions conspicuous. Motion expresses the product and the progression of its process.

The reference uses gradients in some process panels; those should not carry over to GoTechnologies given the requested design direction.

Evidence: [hero composition](reference-audit/fourmula-top.png), [process-panel transition](reference-audit/fourmula-5100.png).

## Where the current frontend falls short

| Current treatment | Effect on the experience | Recommended change |
| --- | --- | --- |
| Hero GO stencil opens into a photograph | Strong, recognisable brand moment | Preserve this concept and improve the media behind it |
| Most sections use the same `data-reveal` entrance | Visitors quickly learn the pattern; little anticipation remains | Give the major chapters different behaviour and retain quiet reading intervals |
| Product presented as a large car mockup followed by text panels | Shows branding on a vehicle more than the experience of using the service | Introduce a human journey sequence with the mockup as supporting evidence |
| Journey types presented as text rows | A natural opportunity for visual discovery is unused | Pair the exact labels with a changing image stage and subtle route progression |
| Principles use small diagrams and scrolling numbers | Their concepts remain largely static while scrolling | Develop one larger graphic through people, connection, movement, and expansion states |
| Vision uses another scenic image and a drifting GO mark | Repeats the photographic pause without a new visual idea | Build a purposeful Sri Lanka-to-wider-world composition without implying existing global operations |
| Partnerships return to another heading-and-list layout | Late-page rhythm is predictable | Add a compact interactive visual responding to the selected partner category |
| Footer mark only rises slightly | The page ends with less impact than its opening promises | Resolve the recurring GO motif into a deliberate final brand composition |

Code basis: `src/components/motion-system.tsx`, `product.tsx`, `principles.tsx`, `vision.tsx`, `partnerships.tsx`, and `footer.tsx`. The shared reveal is currently 38px vertical movement over 0.9 seconds; generic image parallax runs from -6% to +6%. Those are useful supporting behaviours, but cannot carry the creative direction alone.

Evidence: [current journey/principles transition](reference-audit/gotech-audit-4300.png).

## Proposed scroll story for GoTechnologies

1. **Opening — keep the GO reveal.** Use stronger, travel-led media within the existing brand aperture. Carry a curved route or framing motif out of this scene into the next. Preserve the exact logo rather than distorting its proportions.
2. **About — establish the idea with breathing room.** Retain the exact company copy with controlled typographic emphasis. Let one route graphic connect the composition; avoid giving every paragraph its own elaborate effect.
3. **GoChauffeur — make the journey tangible.** Build a short desktop sequence that moves between arrival, a chauffeur interaction, and a passenger's view. Pair the existing traveller and chauffeur copy with appropriate imagery. Advance image framing and route progress together. Use genuine supplied product screens if available; do not invent booking functionality or operational claims.
4. **Journey types — create exploration.** Keep all five supplied labels visible and usable. A selected row changes the adjacent image and route treatment. Scroll, pointer, and keyboard interactions should agree about the selected state.
5. **Principles — give the middle a signature moment.** Four exact copy blocks accompany a large graphic that evolves from people to connected nodes, a route, and an expanding network. A restrained version of Fourmula's receding-panel effect can separate the chapters using forest, mint, white, and green surfaces.
6. **Vision — widen the frame.** Shift from an intimate journey to a broader illustrative network, grounded in Sri Lanka. Present the supplied ambition as a future direction, with no fabricated destinations, partner logos, metrics, or active coverage.
7. **Partnerships and audience choices — return to clarity.** Make the choices tactile and responsive, with shorter transitions and prominent actions after the more immersive sections.
8. **Closing — resolve the opening motif.** Reveal the client's existing closing lines in a composed sequence as the GO mark settles into its final position. Keep navigation and contact actions easy to reach.

## Imagery direction

Select a cohesive set before refining the animation. Prioritise a traveller arriving with luggage, a professional chauffeur interaction, a view from inside the vehicle, a compelling Sri Lankan road scene, and one wider geographic context image. Aim for natural directional light, consistent colour treatment, clear focal points, and framing that accommodates the actual layout. Human-scale details should alternate with expansive views.

Replace the current road and highland photographs as a coordinated selection. Geographic accuracy must be verified for any image labelled Sri Lanka. Client photography or a commissioned set would offer the strongest specificity; licensed footage or photography can support a prototype. Any synthetic imagery should remain clearly a concept and must not be presented as evidence of an actual fleet or operation. Reference-site assets are for study, not reuse in the website.

## Implementation priorities and limits

First establish the media set and storyboard the GoChauffeur and principles chapters. Then implement one complete transition chain before expanding it across the page. Use GSAP for scroll-controlled scene timelines, Framer Motion for interactive state changes, and the existing Lenis integration for smooth scrolling. Adding another animation library is unnecessary.

Use a few memorable scenes separated by readable, ordinary scrolling. Avoid reproducing Joby's very long opening scroll distance. On mobile, shorten or replace pinned sequences with stacked content; honour reduced motion and keep the complete client copy accessible. Animate transforms and opacity where possible, reserve expensive masks for the signature moments, and load large media when needed.

Success means the hero, middle, and ending each have a recognisable visual moment; transitions connect those moments; the images explain the travel experience; and all supplied client wording remains unchanged. The existing PDF copy check should remain a release requirement.
