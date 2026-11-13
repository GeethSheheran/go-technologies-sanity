# Deploy the website and Sanity Studio to Cloudflare Workers

## What is deployed

- Website: `https://<worker-host>/`
- Content editor: `https://<worker-host>/studio/structure/`
- Content stays in Sanity project `pk1w379x`, dataset `production`.

The website is a static Next.js export. Publishing a Sanity document updates the
data immediately; a successful website build is needed to display that data.
The webhook below automates the build. No dataset migration is required.

## 1. Connect GitHub

1. In Cloudflare, open Workers & Pages and create a Worker from a Git repository.
2. Connect GitHub and grant access to `GeethSheheran/go-technologies-sanity`.
3. Select that repository and the `main` production branch.
4. Set Worker name to `go-technologies-sanity`, matching `wrangler.jsonc`.
   If that Worker already exists, open its Settings > Builds and connect the
   repository there; do not delete the existing Worker.
5. Confirm GitHub authorization is active before building. A disconnected Git
   warning must be resolved by granting the Cloudflare GitHub app access.

## 2. Configure the build

| Setting | Value |
| --- | --- |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npx wrangler@4.161.0 deploy` |
| Root directory | `/` (repository root) |
| Production branch | `main` |
| Node version | `24`, selected by `.node-version`; remove conflicting overrides |

Cloudflare installs root dependencies. The build command installs Studio's
dependencies using its lockfile and builds both applications. `wrangler.jsonc`
selects `out` as the asset directory; Workers does not need a Pages output field.
Do not use `.next` as the asset directory or upload the repository root.

No additional Sanity environment variables or API tokens are required for this
public dataset. The shared project configuration is in `src/sanity/project.json`.
The build command already sets `SANITY_CONTENT_ENABLED=true`. Runtime bindings
are unnecessary for this static-assets Worker.

## 3. Deploy and verify

1. Save the configuration and run the production build/deployment.
2. Confirm the log ends with:
   `Cloudflare output ready: website and /studio, with scoped Studio routing.`
3. Wait for deployment success and copy the production `workers.dev` URL.
4. Open the website and `/studio/structure/` on that same hostname.
5. Studio JavaScript and `/studio/static/manifest.webmanifest` must return 200.
   A missing Studio page means the combined build was not deployed successfully.

## 4. Allow Sanity login

1. Open https://www.sanity.io/manage/project/pk1w379x.
2. Open API > CORS origins > Add CORS origin.
3. Enter the exact production origin, for example
   `https://go-technologies-sanity.akeelyahoo.workers.dev`.
   Do not include `/studio` or other paths.
4. Enable Allow credentials and save.
5. Open `/studio/structure/`, sign in with a Sanity project member account, and
   confirm the existing Home Page and other documents appear.

## 5. Rebuild automatically after publishing

1. In Cloudflare, open the Worker > Settings > Builds > Deploy Hooks.
2. Create `Sanity publish`, choose `main`, and copy its full URL privately.
3. In the Sanity project, open API > Webhooks > Create webhook.
4. Use these settings:

| Setting | Value |
| --- | --- |
| Name | Update Cloudflare website |
| URL | The full Cloudflare deploy-hook URL, not the website URL |
| Dataset | `production` |
| Trigger on | Create and Update |
| Filter | `_id match "website-*"` |
| Method | `POST` |
| Enabled | Yes |
| Draft and version triggers | Off |
| Projection, headers, secret | Leave empty |

The hook URL begins with
`https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/`.
Its unique suffix authorizes builds: do not commit it or put it in public code.

5. Save the webhook, then publish an intended content change in Studio.
6. Check Sanity's webhook delivery log and Cloudflare's build history. The deploy
   hook's Last triggered value should update and a new build should start.
7. Wait for deployment success, then reload the production website and confirm
   the published text. Existing content does not trigger a newly created hook
   retroactively; run a fresh build to publish already-saved changes.

## 6. Optional custom domain

After the workers.dev website and editor work, open the Worker's Domains section
and add your custom domain. Follow Cloudflare's domain setup prompts. Add that
exact HTTPS origin to Sanity CORS with credentials enabled as well. Add `www`
separately if Studio will also be opened there.

## Official references

- [Workers build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Workers deploy hooks](https://developers.cloudflare.com/workers/ci-cd/builds/deploy-hooks/)
- [Sanity CORS](https://www.sanity.io/docs/content-lake/cors)
- [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks)
