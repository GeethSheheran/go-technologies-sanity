import { access, cp, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const out = path.join(root, "out");
// Reuse the validated Studio artifact, including corrected /studio asset URLs.
await access(path.join(out, "index.html"));
await cp(
  path.join(root, "studio/.vercel/output/static/studio"),
  path.join(out, "studio"),
  { recursive: true },
);
// Only application routes get the SPA shell. Never rewrite static/vendor assets
// to HTML: missing bundles must remain 404s rather than module MIME errors.
await writeFile(
  path.join(out, "_redirects"),
  [
    "/studio /studio/index.html 200",
    "/studio/ /studio/index.html 200",
    ...["structure", "releases", "intent"].flatMap((tool) => [
      `/studio/${tool} /studio/index.html 200`,
      `/studio/${tool}/* /studio/index.html 200`,
    ]),
    "",
  ].join("\n"),
);

async function validate(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await validate(file);
    else if ((await stat(file)).size > 25 * 1024 * 1024) {
      throw new Error(
        `Cloudflare Pages asset exceeds 25 MiB: ${path.relative(out, file)}`,
      );
    }
  }
}
await validate(out);
console.log(
  "Cloudflare output ready: website and /studio, with scoped Studio routing.",
);
