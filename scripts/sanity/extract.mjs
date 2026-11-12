import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
export function readModule(path) {
  const context = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(path, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    context,
  );
  return JSON.parse(JSON.stringify(context.exports));
}
