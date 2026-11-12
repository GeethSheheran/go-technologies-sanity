import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { readModule } from "./extract.mjs";
const original = JSON.parse(
  fs.readFileSync("src/sanity/original.json", "utf8"),
);
const catalog = JSON.parse(fs.readFileSync("src/sanity/catalog.json", "utf8"));
const source = readModule("src/lib/content.ts");
const snapshotCopy = structuredClone(original.copy);
snapshotCopy.router.items.forEach((i) => delete i.variant);
assert.deepEqual(snapshotCopy, source.copy, "Approved source copy was changed");
const legal = JSON.parse(fs.readFileSync("src/lib/legal-content.json", "utf8"));
for (const [key, value] of Object.entries(legal)) {
  const saved = { ...original.legal[key] };
  delete saved.seo;
  delete saved.updatedIso;
  assert.deepEqual(saved, value);
}
const docs = catalog.map((entry) => {
  const value = entry.path.reduce((v, k) => v[k], original);
  return {
    _id: entry.id,
    ...structuredClone(entry.type === "hero" ? { hero: value } : value),
  };
});
function images(value) {
  if (!value || typeof value !== "object") return;
  if (value.src) value.image = { asset: { _ref: "test" } };
  Object.values(value).forEach(images);
}
// Don't traverse image.asset repeatedly (it has no src).
docs.forEach(images);
let response = docs;
const exports = {};
const mockEnv = {
  SANITY_CONTENT_ENABLED: "true",
  NEXT_PUBLIC_SANITY_PROJECT_ID: "different-project",
  NEXT_PUBLIC_SANITY_DATASET: "different-dataset",
  SANITY_API_READ_TOKEN: "test-token-must-not-be-attached",
};
const project = JSON.parse(fs.readFileSync("src/sanity/project.json", "utf8"));
const dependencies = {
  "server-only": {},
  react: { cache: (fn) => fn },
  "@sanity/client": {
    createClient: (config) => {
      assert.equal(config.projectId, project.projectId);
      assert.equal(config.dataset, project.dataset);
      assert.equal(config.perspective, "published");
      assert.equal(config.token, undefined);
      return { fetch: async () => response };
    },
  },
  "@sanity/image-url": {
    createImageUrlBuilder: () => ({
      image: () => ({ auto: () => ({ url: () => "/verified-image.webp" }) }),
    }),
  },
  "../original.json": original,
  "../catalog.json": catalog,
  "../project.json": project,
};
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync("src/sanity/lib/content.ts", "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  {
    exports,
    require: (name) => dependencies[name],
    process: { env: mockEnv },
    structuredClone,
    URL,
  },
);
const first = await exports.getContent();
assert.equal(first.copy.hero.title, source.copy.hero.title);
response = structuredClone(docs);
response.find((d) => d._id === "website-about").paragraphs = [];
assert.equal(
  (await exports.getContent()).copy.about.paragraphs.length,
  0,
  "Deleted paragraphs must not return from fallback",
);
response = structuredClone(docs);
response.find((d) => d._id === "website-hero").hero.title =
  "A new beginning with Go.";
assert.equal(
  (await exports.getContent()).copy.hero.title,
  "A new beginning with Go.",
  "Published title changes must render",
);
response = structuredClone(docs);
response.find((d) => d._id === "website-settings").destinations.contact =
  "javascript:alert(1)";
await assert.rejects(exports.getContent(), /Unsafe link/);
response = docs.filter((d) => d._id !== "website-hero");
await assert.rejects(exports.getContent(), /missing/);
response = structuredClone(docs);
delete response.find((d) => d._id === "website-settings").images.traveller
  .image;
await assert.rejects(exports.getContent(), /image missing/);
console.log(
  "CMS checks passed: original copy/legal preservation, published edits, intentional deletion, unsafe links, missing documents and images.",
);
