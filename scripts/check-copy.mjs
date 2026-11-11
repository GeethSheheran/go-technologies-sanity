import fs from "node:fs";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import ts from "typescript";

// A source-of-truth check, independent of the rendering implementation.
// Requires Poppler's pdftotext (brew install poppler on macOS).
const context = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync("src/lib/content.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  context,
);
const strings = [];
function collect(value, key = "") {
  if (typeof value === "string" && !key.endsWith(".href"))
    strings.push({ key, text: value });
  else if (value && typeof value === "object")
    Object.entries(value).forEach(([k, v]) =>
      collect(v, key ? `${key}.${k}` : k),
    );
}
collect(context.exports.copy);
if (strings.some(({ text }) => /[—–]/.test(text)))
  throw new Error(
    "Website copy must not contain long dashes, per the owner's request.",
  );
const normalize = (value) => value.replace(/\s+/g, " ").trim();
const source = normalize(
  execFileSync(
    "pdftotext",
    ["-raw", "docs/GoTechnologies Website Content Revised v2.pdf", "-"],
    { encoding: "utf8" },
  ),
);
// Match each requested replacement exactly against the newer PDF, rather than
// accepting its CURRENT text merely because it also appears in that document.
const revision = execFileSync(
  "pdftotext",
  ["-layout", "docs/Fashion Designers Title and Body New.pdf", "-"],
  { encoding: "utf8" },
);
const replacements = [
  ...revision.matchAll(
    /^\s*REPLACE WITH[ \t]+([\s\S]*?)(?=\n\s*\n|\nImplementation note:)/gm,
  ),
  // The owner requested ordinary punctuation in place of the PDF's long dashes.
].map((match) => normalize(match[1]).replace(/\s+[—–]\s+/g, ", "));
const fields = [
  ["hero.body"],
  ["about.title"],
  ["product.body"],
  ["product.journeys.2"],
  ["product.journeys.4"],
  ["principles.items.2.body"],
  ["vision.paragraphs.0"],
  ["vision.paragraphs.1", "vision.paragraphs.2"],
  ["partnerships.body"],
  ["partnerships.items.0.body"],
  ["partnerships.items.1.body"],
  ["partnerships.items.2.body"],
  ["partnerships.items.3.body"],
];
if (replacements.length !== fields.length)
  throw new Error(`Expected 13 PDF replacements, found ${replacements.length}`);
const revisedKeys = new Set(fields.flat());
const byKey = new Map(strings.map(({ key, text }) => [key, text]));
const changed = strings.filter(
  ({ key, text }) => !revisedKeys.has(key) && !source.includes(normalize(text)),
);
fields.forEach((keys, index) => {
  const actual = keys.map((key) => byKey.get(key) ?? "").join(" ");
  if (normalize(actual) !== replacements[index])
    changed.push({ key: keys.join(", "), text: actual });
});
if (context.exports.copy.vision.paragraphs.length !== 3)
  throw new Error(
    "Vision must retain three paragraphs, with the old closing sentence replaced.",
  );
if (changed.length) {
  console.error("Copy differs from the approved client PDFs:", changed);
  process.exitCode = 1;
} else
  console.log(
    `Verified all 13 October 2026 replacements and ${strings.length - revisedKeys.size} unchanged copy strings against the client PDFs.`,
  );
