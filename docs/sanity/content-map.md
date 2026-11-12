# Content mapping and implementation scope

The original website remains backed up in `src/lib/content.ts`,
`src/lib/legal-content.json` and `src/sanity/original.json` (a frozen snapshot).
No original wording has been replaced. Migration verification compares every
nested field and array position, and verifies the hashes of seven uploaded images.

| Studio section | Original content | Document ID |
| --- | --- | --- |
| Home Page → Hero | copy.hero; visible heading and accessible label | website-hero |
| GoChauffeur | copy.product, including the fixed five journey labels | website-product |
| About | copy.about | website-about |
| Vision | copy.vision | website-vision |
| Principles | copy.principles; four cards | website-principles |
| Partnerships | copy.partnerships; four categories | website-partnerships |
| Audience Navigation | copy.router; explicit avatar identity | website-router |
| Closing Section | copy.closing | website-closing |
| Footer & Contact | CTA labels/destinations, navigation, footer, cookie notice, section labels, product/journey photos | website-settings |
| SEO & Website Settings | original root metadata | website-seo |
| Privacy Notice / Website Terms / Cookie Policy | complete legal JSON, anchors, display/ISO date and legal metadata | website-legal-{slug} |

Hero heading remains two lines and ends in the emphasized `Go.`. Its final
preceding word occupies the second line, preserving the original composition.
Journey labels stay in fixed order to retain their scene associations. Audience
cards retain explicit avatar identities when reordered. Legal section anchors
are read-only. Fixed document IDs and removal of creation/duplicate/delete/
unpublish actions prevent accidental singleton duplication in this Studio.

Brand PNGs, GO mask, fonts, animated Three.js scenes, scene fallback artwork,
and their accessibility descriptions remain in code as structural assets.
Product and journey photos are uploaded losslessly and replaceable in Studio.
SEO image URLs remain editable URLs pointing to the existing static preview
asset; SEO image upload is not implemented. The cookie notice retains its
existing behavior; changing its text does not change consent functionality.

The website retains Next.js static export and `wrangler.jsonc` serving `out/`.
No deployment pipeline is activated. Existing Cloudflare instructions indicate
Workers static assets deployed with Wrangler; there is no repository Actions
workflow. Production activation and automatic webhook rebuilds are separate
from this content-editor implementation.
