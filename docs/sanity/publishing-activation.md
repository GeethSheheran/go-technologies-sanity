# Publishing activation proposal

Diagnosis: the production Vercel environment list does not include
SANITY_CONTENT_ENABLED. The app therefore returns the original snapshot.
Sanity published website-hero currently contains “Everythinggg begins with Go.”
while the live website still renders “Everything begins with Go.”

The Vercel app service build command now explicitly sets
SANITY_CONTENT_ENABLED=true. This applies to Vercel builds without changing the
existing Cloudflare build configuration or local fallback policy.

## Proposed production activation (not performed)

1. Deploy the reviewed repository change to the existing Vercel project
   go-technologies-sanity-app, then verify the live hero matches Sanity.
2. Create a Vercel Deploy Hook for the existing production main branch, named
   Sanity published content. Store its capability URL only in the Sanity webhook
   configuration; do not commit it, print it, or expose it in browser code.
3. Create a Sanity webhook for project pk1w379x, dataset production. Use POST to
   that deploy-hook URL, trigger on create and update, and exclude drafts. Filter:

```groq
_id in [
  "website-hero",
  "website-product",
  "website-about",
  "website-vision",
  "website-principles",
  "website-partnerships",
  "website-router",
  "website-closing",
  "website-settings",
  "website-seo",
  "website-legal-privacy",
  "website-legal-terms",
  "website-legal-cookies"
]
```

The exact IDs exclude drafts, legacy dotted IDs, assets and unrelated documents.
The Deploy Hook URL itself is the Vercel authorization credential. No custom
public unauthenticated webhook endpoint is introduced.
4. After approval, test with an owner-approved published edit and verify the
   resulting deployment and live content. Do not overwrite the owner's wording
   or change documents merely to test without approval.

Expected delay is the deployment build time plus queue time, usually several
minutes; no instant-update guarantee. Until activation, Publish saves Sanity
content only, and the static website requires a redeployment.

Vercel supports CMS-triggered deploy hooks and may cancel redundant pending
requests for the same hook/revision: https://vercel.com/docs/deploy-hooks

No deployment or remote automation settings have been changed by this proposal.
