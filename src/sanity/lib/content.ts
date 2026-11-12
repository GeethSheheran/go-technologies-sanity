import "server-only";
import { cache } from "react";
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import original from "../original.json";
import catalog from "../catalog.json";
import project from "../project.json";

export type WebsiteContent = typeof original;
export type ContentProps = { content: WebsiteContent };
export const client = createClient({
  ...project,
  useCdn: false,
  perspective: "published",
  // This verified dataset is public. Do not attach deployment tokens, whose
  // permissions can differ from anonymous published-content access.
});
const images = createImageUrlBuilder(client);
const legalBlockExamples: Record<string, unknown>[] = [];
for (const document of Object.values(original.legal)) {
  for (const section of document.sections)
    legalBlockExamples.push(...section.blocks);
}
// A unique build key prevents Next's persistent fetch cache reusing an older build.
const buildCacheKey = String(Date.now());
export const contentQuery = '*[_id in $ids && !(_id in path("drafts.**"))]';
// Missing optional values mean a client removed them. Never merge original copy
// into a published document. A missing singleton or invalid shape fails the build.
function normalize(template: unknown, value: unknown, path: string): unknown {
  if (Array.isArray(template)) {
    if (value == null) return [];
    if (!Array.isArray(value)) throw Error(`Invalid array: ${path}`);
    return value.map((item, index) => {
      const example = path.endsWith(".blocks")
        ? legalBlockExamples.find((t) => t.type === item.type)
        : template[index] || template[0];
      if (!example) throw Error(`Unknown block: ${path}`);
      return normalize(example, item, `${path}.${index}`);
    });
  }
  if (template && typeof template === "object") {
    const object = (value || {}) as Record<string, unknown>;
    const result = Object.fromEntries(
      Object.entries(template).map(([key, example]) => [
        key,
        normalize(example, object[key], `${path}.${key}`),
      ]),
    );
    if ("src" in result && !object.image)
      throw Error(`Published image missing: ${path}`);
    if ("src" in result && object.image) {
      result.src = images
        .image(object.image as Parameters<typeof images.image>[0])
        .auto("format")
        .url();
    }
    return result;
  }
  if (value == null) return typeof template === "string" ? "" : template;
  if (typeof value !== typeof template) throw Error(`Invalid value: ${path}`);
  if (
    typeof value === "string" &&
    (/\.(href|creditHref|canonical|url)$/.test(path) ||
      path.includes(".destinations.")) &&
    value &&
    !/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(value)
  )
    throw Error(`Unsafe link: ${path}`);
  return value;
}
export const getContent = cache(async (): Promise<WebsiteContent> => {
  if (process.env.SANITY_CONTENT_ENABLED !== "true") return original;
  const docs = await client.fetch<Record<string, unknown>[]>(
    contentQuery,
    { ids: catalog.map((d) => d.id), buildCacheKey },
    {
      cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-store",
    },
  );
  const result = structuredClone(original);
  for (const entry of catalog) {
    const doc = docs.find((d) => d._id === entry.id);
    if (!doc)
      throw Error(
        `Published Sanity document missing: ${entry.id} in ${project.projectId}/${project.dataset}. Check publication state and the shared CMS connection; no content was changed.`,
      );
    const target = entry.path
      .slice(0, -1)
      .reduce<Record<string, unknown>>(
        (v, k) => v[k] as Record<string, unknown>,
        result as unknown as Record<string, unknown>,
      );
    const key = entry.path.at(-1)!;
    target[key] = normalize(
      target[key],
      entry.type === "hero" ? doc.hero : doc,
      entry.path.join("."),
    );
  }
  result.copy.actions = result.settings.actions;
  if (!/^.+\sGo\.$/.test(result.copy.hero.title))
    throw Error("Hero title must end with Go.");
  for (const [name, items, count] of [
    ["principles", result.copy.principles.items, 4],
    ["partnerships", result.copy.partnerships.items, 4],
    ["audiences", result.copy.router.items, 3],
    ["journeys", result.copy.product.journeys, 5],
    ["journey images", result.settings.images.journeys, 5],
  ] as const) {
    if (items.length !== count) throw Error(`Expected ${count} ${name}`);
  }
  if (
    new Set(result.copy.router.items.map((i) => i.variant)).size !== 3 ||
    result.copy.router.items.some((i) => ![0, 1, 2].includes(i.variant))
  )
    throw Error("Invalid audience avatar associations");
  return result;
});
