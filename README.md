# Go Technologies — corporate frontend

Next.js App Router frontend for Mr. Akeel, based on the supplied Go Technologies brand direction and client website content. Frontend review only: no CMS, booking engine, registration database, tracking, or form backend is connected.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Node.js 22 or newer is recommended.

```sh
npm run build
npm run lint
npm run typecheck
npm run check:copy
```

`check:copy` requires Poppler's `pdftotext` and verifies every copy string against the original PDF (68 strings). Layout line breaks are normalized. The supplied PDFs remain unchanged.

## Cloudflare Workers deployment

The site uses Next.js static export. `npm run build` generates `out/`, including
the homepage, legal pages, JavaScript, images, and fonts. Cloudflare serves these
files directly using `wrangler.jsonc`; this deployment needs no Worker script or
Next.js server. Images use their original files because the Next.js image
optimization server is unavailable on a static host.

For the `go-technologies` Worker, set the repository root as the build root and use:

- Build command: `npm run build`
- Deploy command: `npx wrangler@4 deploy`
- Node.js version: `24`

Redeploy after committing the configuration. Remove any old deploy command that
targets a generated Worker or `.next/` entrypoint. Wrangler uploads only `out/`.
Preview locally after building with `npx wrangler@4 dev`; `next start` does not
support static exports. Unknown URLs return the exported 404 page.

Cloudflare Error 1101 means a Worker threw a JavaScript exception; it does not
identify the exception. If diagnosing the previous deployment, inspect its
Observability logs for the failing request and stack trace.

## Source of truth

- **Visual direction:** `docs/GoTechnologiesBrandingV2.pdf`, together with the supplied `references/` images.
- **Website copy:** `docs/GoTechnologies Website Content Revised v2.pdf`.
- **Content module:** `src/lib/content.ts`. Do not rewrite the client's wording. The document's implementation notes and draft legal instructions are not public website copy.
- **Figma reference:** https://www.figma.com/design/hAN8YoMLhD864LVW8JX85M/GoTechnologies---Branding?node-id=2011-142. Direct Figma access was unavailable in this session; identity assets were extracted from the supplied PDF.

## Frontend design and motion

- Cal Sans for display text; DM Sans for body and interface text. Fonts are hosted locally with `next/font/local`.
- White, Cloud White, Fresh Mint, Go Green, Deep Forest, and Graphite. Solid colour surfaces; no CSS gradients.
- GO-shaped photographic hero opens into a Sigiriya landscape using a scrubbed GSAP timeline.
- GSAP ScrollTrigger drives the GO reveal, paired journey photographs and closing copy. Supporting copy uses compact layouts without pinned panels. Image frames and controls have square corners; the brand motto is a small static caption in About. The footer keeps the corporate wordmark beside its navigation, without a large decorative logo.
- Lenis is synchronized with the GSAP ticker, with one animation loop and lifecycle cleanup.
- Framer Motion handles mobile navigation, audience-card interactions and the five-image journey selector. The selector supports arrow keys, Home and End.
- Desktop pinning is disabled below 901px. Reduced-motion preferences disable Lenis, pinning, and spatial animation. Content is server-rendered and readable without JavaScript.

Most page content remains in Server Components. Client boundaries are limited to navigation, interactions, and the animation coordinator.

## Destinations pending launch details

Current navigation routes to sections on the corporate page. Product discovery stays inside the frontend, while enquiry links open email drafts to `hello@gotechnologies.lk` (the contact address on the existing corporate website). No email is sent by the application. Replace destinations in `src/lib/content.ts` when the client confirms the product and registration URLs.

The footer preserves the supplied legal-page labels as text. Legal routes are intentionally not populated with invented policy language; client/counsel-approved copy is still needed. Search-engine indexing is disabled for this review build. Sanity integration and production deployment are subsequent work.

## Asset provenance

- Corporate and GoChauffeur wordmarks: the client's original PNG exports in `public/brand/Asset 7@4x-8.png` through `Asset 16@4x-8.png`. Header uses Asset 8 and footer Asset 9. Other exports are retained for future use; repeated logos have been removed from section content. Full inventory: `docs/brand-assets.md`.
- GO aperture and oversized angled mark: the supplied 6661 × 2817 `Asset 80@4x-8.png`, using its original transparency and proportions. The hero uses an SVG luminance mask to reveal the photograph through the original artwork. Favicon remains the original PDF extraction.
- Hero and flexible-trip landscape: [Sigiriya Rock, Pexels](https://www.pexels.com/photo/photo-of-sigiriya-rock-in-sri-lanka-6045035/).
- Misty landscape: [Aerial View of Sigiriya Rock Fortress, Pexels](https://www.pexels.com/photo/stunning-aerial-view-of-sigiriya-rock-fortress-28838276/).
- Passenger and chauffeur photography by Ron Lach: [passenger](https://www.pexels.com/photo/man-and-woman-sitting-inside-car-9520200/), [chauffeur](https://www.pexels.com/photo/young-man-driving-a-car-with-a-woman-passenger-9519975/). These are illustrative stock photographs, not photographs of a confirmed GoChauffeur fleet.
- Arrival: [Traveller with luggage, Pexels](https://www.pexels.com/photo/happy-female-traveler-walking-on-airport-street-with-luggage-3885537/).
- Coast: [Tangalle Beach, Pexels](https://www.pexels.com/photo/tangalle-beach-sri-lanka-drone-view-16508233/).
- Fonts: [Cal Sans](https://fonts.google.com/specimen/Cal+Sans), [DM Sans](https://fonts.google.com/specimen/DM+Sans).

All runtime assets are checked into `public/`; no external image or font request is needed during normal rendering. `scripts/prepare-assets.mjs <source-directory>` is an optional utility for the GO aperture and favicon. It expects `identity-003.png` (the PDF's extracted alpha mask). The supplied wordmark exports are used unchanged. The old reconstructed corporate wordmarks and unused road, hill and vehicle mockup images have been removed.
