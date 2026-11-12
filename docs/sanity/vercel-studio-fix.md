# Vercel Studio asset-routing fix

## Production evidence (12 November 2026)

The deployment is a standalone Sanity/Vite Studio service behind the top-level
Vercel `/studio` rewrites. It is not embedded in Next.js. There is no Vite config.
The website remains a separate Next.js service using static export.

Read-only HTTP probes of `https://go-technologies-sanity-app.vercel.app` returned:

| Path | Status / content type | Observation |
| --- | --- | --- |
| `/` | 200 text/html | Website responds normally |
| `/studio` | 200 text/html | Studio HTML |
| `/studio/structure` | 200 text/html | Studio HTML |
| `/studio/static/sanity-C5qqyW3P.js` | 200 text/html | Same 15,130-byte Studio HTML, not JS |
| `/studio/static/manifest.webmanifest` | 200 text/html | Same Studio HTML |
| `/static/manifest.webmanifest` | 404 text/html | Request went outside Studio namespace |
| `/studio/nonexistent.js` | 200 text/html | Missing asset intercepted by SPA fallback |

The local production build contains the named JavaScript bundle, manifest and
vendor modules. Its HTML has correctly prefixed module URLs but root-relative
`/static/...` manifest/favicon links. Sanity 6.23 generated those head links even
with CLI `project.basePath: '/studio'`. The manifest's internal icon URLs already
have the correct prefix.

The old service routing combined a path-stripping destination with a root-level
`dist/` file tree and the Sanity preset's catch-all `/index.html` fallback. Live
responses prove asset requests reached the HTML fallback. Deployment-internal
file lookup details are inferred from those responses and the installed Vercel
static builder; the remote deployment artifact itself has not been downloaded.

## Read-only deployment inspection

Vercel CLI inspection confirmed production deployment
`dpl_4ha2rwh8evtwqPyJApGq12v8Sno4` (commit `f92314c`) is marked Ready. Its logs
show the Studio ran `npm run build` → `sanity build` and completed successfully,
without the new packaging step. Project inspection reports root `.`, Next.js
preset, default Next.js build/output settings and Node 26.x. No project settings
were changed. The corrected per-service build command is in `vercel.json`.

## Fix

- Keep CLI `/studio` basePath, the separate services, and Next static export.
- Build Studio with `npm run build:vercel`.
- Package the complete Studio build into the service's Build Output API v3 tree:
  `.vercel/output/static/studio/`, including all static and vendor files.
- Normalize generated manifest/favicon head links to `/studio/static/...`.
- Route `/studio` and `/studio/*` to Studio with the original path; remove the
  destination path stripping. App routing is unchanged.
- Emit explicit service routes: existing files first, missing asset requests 404,
  then SPA HTML for editor navigation. The generic preset fallback is replaced by
  the generated Build Output API route table.
- Use modern `sanity dev` for the Vercel dev command.
- Fail packaging if the base path is overridden or an HTML asset reference is
  missing. Exclude generated `.vercel/` output from Studio linting.

This follows Vercel's [per-service Build Output API](https://vercel.com/docs/build-output-api/services)
and Sanity's [CLI base-path configuration](https://www.sanity.io/docs/studio/deployment).
No datasets, documents, schemas, website components, animations, metadata, legal
copy, Cloudflare settings or remote deployment settings were modified.

## Verification

Passed locally:

- `cd studio && npm run build:vercel`
- `npm run check:vercel`: 19 HTML asset references, manifest icon files, editor deep
  links, missing JS/vendor/manifest 404 behavior, and service mount consistency.
- Studio TypeScript and ESLint.
- Vercel config checked against its published schema (upstream schema mixes draft
  versions, so meta-schema validation was disabled while validating config).
- Local HTTP simulation of the emitted route table: bundle `200 text/javascript`,
  manifest `200 application/manifest+json`, missing module `404 text/plain`.
- Browser loads the built Studio UI with no module MIME errors. The isolated
  preview at port 3334 reaches Sanity's connection/CORS screen, because this test
  origin is not registered. This proves module loading, not authenticated editing.
- `sanity cors list` confirms the production origin and `http://localhost:3333`
  are already allowed. No CORS entries were changed.
- Live main website returned HTTP 200 during diagnosis. Its configuration and
  source were not changed.

## Deployment and remaining checks

No deployment was performed. The public URL still serves the old broken artifact.
After approval, deploy the commit through the existing Vercel project, ensuring
Studio uses `npm run build:vercel` rather than a dashboard override of the old
build command. Do not set an output-directory override to `dist`; the builder
must consume the generated `.vercel/output` tree. Keep the repository root as
project root and make shared `src/sanity` files available to the Studio build.

After deployment, verify the actual newly hashed module URL from `/studio`:

1. `/studio` and a `/studio/structure/...` deep link render after direct reload.
2. Every referenced module returns 200 with a JavaScript MIME type.
3. `/studio/static/manifest.webmanifest` returns JSON, and its icons load.
4. A nonexistent `/studio/static/missing.js` returns 404, never Studio HTML.
5. Sign in using Sanity, confirm the existing documents are listed, and open the
   Home Page → Hero editor. Do not change published copy just to test loading.
6. Check the main website and its existing legal routes.

Authenticated editor behavior and the corrected deployment have NOT been verified
in production yet. Those checks require the approved deployment and a signed-in
browser session. The local route simulation is not a Vercel deployment test.
