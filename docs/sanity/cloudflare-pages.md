# Website and Studio on Cloudflare Pages

For a complete new deployment, follow [the Cloudflare Workers setup guide](../cloudflare-deployment.md).

## Cloudflare Workers (current production deployment)

The production build log uses `npx wrangler deploy`, so it is a Workers project.
Keep the build command `npm run build:cloudflare` and deploy command
`npx wrangler deploy`. The root Wrangler configuration uploads `out` and names
the existing Worker `go-technologies-sanity`.

Studio tool routes rewrite to the canonical `/studio` URL. Do not target
`/studio/index.html` or add a `/studio` self-rewrite: Workers HTML normalization
can reject those rules as infinite loops. Static and vendor paths have no SPA
rewrite, so missing assets remain 404 responses.

## Pages alternative

The default `npm run build` exports only the Next.js website. Vercel builds the
separate Studio service using `vercel.json`; Cloudflare Pages does not use that
configuration.

For this repository, set the Pages build command to `npm run build:cloudflare`,
the output directory to `out`, and leave the root directory empty. Use Node 24
for both the website and Studio dependencies. The command installs the Studio's
locked dependencies, builds both applications and packages them together. No
Sanity write token is needed. Existing Workers and Vercel settings are unchanged.

The generated `_redirects` file serves the Studio shell for `/studio`, Structure,
Releases and intent routes. Static and vendor asset paths are never redirected
to the shell. Add a scoped rule if a future Studio plugin introduces another tool.

Before logging in on the custom domain, open the Sanity project `pk1w379x` in
Manage, go to API / CORS origins, and add `https://gotechnologies.lk` with
credentials allowed. Add other origins only if you use them to open Studio.

Commit and push the changes when ready to deploy, then update the Pages build
command and deploy the latest commit. Verify `/studio/structure/`, its JavaScript
requests and login in a browser. Confirm the existing documents appear without
running a migration. The build does not modify Sanity data.

Publishing content still requires a new website build until a Sanity webhook
is connected to the deploy hook for the selected Workers or Pages project.
