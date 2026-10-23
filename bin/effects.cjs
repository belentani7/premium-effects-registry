#!/usr/bin/env node
"use strict";
const { loadRegistry, searchEffects } = require("../src/registry.cjs");
function main(args) {
  const allowed = new Set(["--kind", "--json"]);
  if (args.some(a => a.startsWith("--") && !allowed.has(a))) throw new Error("Unknown option");
  const kindIndex = args.indexOf("--kind");
  if (kindIndex !== -1 && (!args[kindIndex + 1] || args[kindIndex + 1].startsWith("--"))) throw new Error("Missing --kind value");
  const kind = kindIndex === -1 ? undefined : args[kindIndex + 1];
  const words = args.filter((a, i) => a !== "--json" && a !== "--kind" && i !== kindIndex + 1);
  const results = searchEffects(loadRegistry(), words.join(" "), kind);
  if (args.includes("--json")) console.log(JSON.stringify(results, null, 2));
  else for (const e of results) console.log(`${e.id}\t${e.name}\t${e.source}`);
  return results.length;
}
if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { main };
