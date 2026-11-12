# Editing Go Technologies

## Open the editor

On this computer open http://localhost:3333 and sign in with your existing
Sanity account. If it is not running, run `npm run studio` from the repository
root. This is the content editor. Sanity's account home is a different screen.
A hosted Studio has not been deployed yet.

## Change the hero title

1. Refresh Studio after this implementation.
2. In **Website Content**, select **Home Page**.
3. Open **Hero** and edit **Title**. Keep the ending `Go.`; it is highlighted in
   the existing animated heading. The maximum length is 65 characters.
4. Click **Publish**. Draft changes do not appear on the website.
5. Refresh http://localhost:3000 to see the published change locally. If the
   preview is stopped, run `npm run dev` from the repository root.

The local site queries published content on page refresh. Publishing does NOT
currently rebuild or deploy the live Cloudflare website. There is no new public
preview URL. Do not assume that Publish has updated gotechnologies.lk.

## Other content

Select a section by name. Reorder paragraphs, partnership categories, principles,
or audience cards using the array controls. Four principles, four partnership
categories, three audiences and five journeys are retained for the layout.
Journey order remains fixed to preserve the animated scenes. Audience avatars
remain associated with their original cards after reordering.

Photos: **Footer & Contact → Images**. Open the traveller, chauffeur or journey
image, choose **Image**, upload a replacement, edit **Alternative text**, then
publish. Keep a similar crop/aspect ratio. Brand marks and 3D scenes remain fixed.
SEO images currently accept URL edits rather than uploads.

Links and button labels: **Footer & Contact → Destinations / Actions**. Navigation
and footer links are in this section too. Links accept https URLs, local /paths,
#section anchors, mailto: addresses and tel: numbers. Changing the contact email
field changes journey enquiries; update the contact destinations too if needed.

Legal pages retain the exact migrated wording. Change the visible Last updated
text and the Last updated date together. Existing section anchors are read-only.

To undo unpublished work, use Studio's document menu to discard changes. For
published edits, use the document history to inspect and restore an earlier
revision where your Sanity plan makes it available, then publish. Keep the
migration backup; rerunning the migration does not overwrite your edits.

## Developer setup

- Website: `npm ci`, copy `.env.example` to `.env.local`, set
  `SANITY_CONTENT_ENABLED=true` only after verification, then `npm run dev`.
- Studio: `cd studio && npm ci && npm run dev`.
- Recommended runtime: Node 24 (the installed Node 22.15 emits dependency engine
  warnings). Root and Studio dependency locks are separate.
- Public project: `pk1w379x`; dataset: `production`; API version: `2025-02-19`.
- No read token is needed for the verified public documents. Read tokens for a
  private dataset must remain server-only. Never use a public write-token variable.
- Migration uses the Sanity CLI login through `--with-user-token`; no credential
  has been written into source files. Run `npm run migrate` inside Studio for a
  read-only comparison. `SANITY_MIGRATE_WRITE=1 npm run migrate` creates missing
  documents with `createIfNotExists`, then verifies content and image hashes.
  Existing published or draft documents are skipped. There is no overwrite mode.
- Migration input is the frozen `src/sanity/original.json`. Do not edit it to
  change website copy. `src/lib/content.ts` and `src/lib/legal-content.json` remain
  the approved original sources. `npm run check:cms` compares those backups and
  tests published edits, deletion behavior and unsafe-content failures.
- `npm run check:copy` remains the historical PDF check, requiring Poppler's
  `pdftotext`. It checks only the original source, not future CMS copy edits.
- Production reads happen in Server Components during `next build`. Interactive
  components receive serializable props, with no client-side Sanity fetching.
  The official data/image clients are used directly, avoiding a second Studio
  dependency tree in the Next application. Portable Text is unnecessary for the
  existing structured legal blocks.
- Enabled CMS mode fails the build on missing documents, required images, invalid
  links or structural counts. It does not silently restore deleted content.
  Disabled mode explicitly uses the original snapshot for pre-activation builds.
- The build has a unique fetch-cache key so an older Next data cache cannot
  restore a previous build's CMS copy. Development fetches use no-store.

## Deployment boundaries

`output: "export"`, `images.unoptimized` and the Cloudflare `out/` asset directory
are unchanged. Existing Cloudflare builds keep original content until the public
configuration and `SANITY_CONTENT_ENABLED=true` are deliberately configured.
Build with `npm run build`, then deploy the static output using the existing
Wrangler process only after approval. Studio hosting and authenticated webhook
rebuild automation still need deployment setup and approval. Neither has been
activated or tested end to end here.

The original `robots: {index:false, follow:false}` policy remains enforced in
code. It must not be changed through content editing without owner approval.

The initial migration used dotted document IDs, which Sanity makes private to
unauthenticated requests. These copies remain untouched. The editing menu and
website use only the final `website-...` IDs. No pre-existing documents were
deleted. See Sanity's [document access rules](https://www.sanity.io/docs/content-lake/keeping-your-data-safe).
