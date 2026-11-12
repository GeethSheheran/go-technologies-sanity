# Vercel services configuration (pending owner confirmation)

The root `vercel.json` proposes two independently built services:

| Service | Root | Public path | Calls another service? |
| --- | --- | --- | --- |
| app | . | /, except /studio and its descendants | No |
| studio | studio | /studio and /studio/* | No |

There are no internal-only services and no service bindings. The Next.js app
queries Sanity Content Lake at build time; the Studio browser application talks
to Sanity directly. Studio is an editor, not the content API for the app. A
runtime binding would not work for this static build, nor is one needed.

The Studio receives the original `/studio` path. Its `build:vercel` script emits
an explicit Build Output API tree with files under `static/studio/`. The Sanity
CLI base path matches these URLs. Existing files are served first; missing assets
return 404; only editor navigation uses the HTML fallback. See the
[asset-routing fix report](sanity/vercel-studio-fix.md).

Separate `npm ci` commands use each service's own lockfile. The app retains
Next.js static export. Studio's `dist/` is packaged into `.vercel/output/` and is
not deployed directly with the Sanity preset's generic SPA fallback. No internal
bindings are needed. Studio imports shared CMS JSON files in `src/sanity`; keep
the whole repository available to its build.

## Before deployment

1. Confirm the names, public paths and absence of bindings. The original suggested
   config left Studio internal; this proposal exposes its sign-in page at /studio.
   Content access/editing still uses Sanity authentication and project permissions.
2. Link the repository root to the intended Vercel project, using Node 24.
3. Configure the shared project environment for Preview and Production:
   `NEXT_PUBLIC_SANITY_PROJECT_ID=pk1w379x`,
   `NEXT_PUBLIC_SANITY_DATASET=production`, `SANITY_CONTENT_ENABLED=true`.
   A Sanity read token is unnecessary for the public dataset. Do not configure a
   write token for normal builds or expose tokens through public variables.
4. Add the chosen Vercel origin to Sanity's allowed CORS origins with credentials
   enabled for Studio login. Use exact trusted origins, not a broad credentialed
   wildcard. Include http://localhost:3100 for combined local testing if needed.
   CORS entries are origins only; do not append /studio.
5. After the owner-approved deployment, register the hosted Studio with
   `npx sanity deploy --external --url https://YOUR-DOMAIN/studio --schema-required`
   from `studio/`. This is a separate authenticated remote action.

The domain and Vercel account/project are not assumed. This change does not deploy,
change DNS, update Sanity CORS, register Studio, or activate publishing webhooks.
Publishing still requires a subsequent website build to update the static site.

## Local verification

From the repository root, run `npx vercel@65.14.0 dev --listen 3100` after Vercel
login/project linking. Verify `/`, `/privacy`, `/terms`, `/cookies`, `/studio`,
`/studio/`, a Studio document deep link, and a `/studio/vendor/...` or
`/studio/static/...` asset. The two service roots must resolve their own assets.
Test direct reload of a document URL as well as navigation from the Studio home.

Standalone development still uses `npm run dev` for the website. For Studio,
`npm run studio` now serves http://localhost:3333/studio rather than the root path.
Remove any stale `SANITY_STUDIO_BASEPATH` override because it would supersede the
CLI configuration and break the proposed mount.

Configuration was checked against the published Vercel JSON schema. Its upstream
schema mixes draft versions, so Ajv meta-schema validation was disabled while
validating the configuration. Studio typechecking and the /studio build passed;
the sandboxed build could not check runtime versions against Sanity's CDN. The
network-enabled retry was declined and was not repeated. Combined dev validation
status is recorded below.

References: [Vercel routing](https://vercel.com/docs/services/routing),
[service bindings](https://vercel.com/docs/services/bindings),
[Sanity subpath hosting](https://www.sanity.io/docs/studio/deployment).

`vercel dev --listen 3100` was attempted with CLI 65.14.0. The saved Vercel login
could not be refreshed, so the CLI entered device login. The command was stopped
at that authentication boundary without selecting or creating a Vercel project.
End-to-end combined routing remains unverified until login and project selection.
