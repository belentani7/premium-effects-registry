#!/usr/bin/env node
"use strict";
const { loadRegistry, searchEffects } = require("../src/registry.cjs");

const HELP = \`Uso: node bin/effects.cjs [palabras] [--kind css|webgl|svg|canvas|animation] [--limit 1..500] [--json]\n       node bin/effects.cjs --help\nConsulta offline, sin claves ni conexiones de red.\n\`;

function parseArgs(args) {
  const options = { words: [], kind: undefined, limit: undefined, json: false, help: false };
  const seen = new Set();
  let positional = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!positional && arg === "--") { positional = true; continue; }
    if (!positional && arg === "--help") { options.help = true; continue; }
    if (!positional && arg === "--json") {
      if (seen.has(arg)) throw new Error("Duplicate option: --json");
      seen.add(arg);
      options.json = true;
      continue;
    }
    if (!positional && (arg === "--kind" || arg === "--limit")) {
      if (seen.has(arg)) throw new Error(\`Duplicate option: \${arg}\`);
      seen.add(arg);
      const value = args[++i];
      if (!value || value.startsWith("--")) throw new Error(\`Missing \${arg} value\`);
      if (arg === "--kind") options.kind = value;
      else {
        if (!/^[1-9][0-9]*$/.test(value) || Number(value) > 500) throw new Error("--limit must be an integer from 1 to 500");
        options.limit = Number(value);
      }
      continue;
    }
    if (!positional && arg.startsWith("-")) throw new Error(\`Unknown option: \${arg}\`);
    options.words.push(arg);
  }
  return options;
}

function main(args) {
  const options = parseArgs(args);
  if (options.help) { process.stdout.write(HELP); return 0; }
  const results = searchEffects(loadRegistry(), options.words.join(" "), options.kind);
  const selected = options.limit === undefined ? results : results.slice(0, options.limit);
  if (options.json) console.log(JSON.stringify(selected, null, 2));
  else for (const e of selected) console.log(\`\${e.id}\t\${e.name}\t\${e.source}\`);
  return selected.length;
}
if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { main, parseArgs };
