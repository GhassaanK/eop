import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

// Test-only source loader. Next normally enforces the server-only boundary.
const nativeRequire = createRequire(import.meta.url);
export function createSourceLoader(overrides = {}) {
  const loaded = new Map();
  function load(relative) {
    if (loaded.has(relative)) return loaded.get(relative);
    const source = readFileSync(new URL(`../src/${relative}.ts`, import.meta.url), "utf8");
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    const compiledModule = { exports: {} };
    const require = (id) => id === "server-only" ? {} : Object.hasOwn(overrides, id) ? overrides[id] : id.startsWith("@/") ? load(id.slice(2)) : nativeRequire(id);
    new Function("require", "module", "exports", compiled)(require, compiledModule, compiledModule.exports);
    loaded.set(relative, compiledModule.exports);
    return compiledModule.exports;
  }
  return load;
}
