"use strict";
const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_PATH = path.join(__dirname, "..", "effects.json");
const ID_PATTERN = /^[a-z][a-z0-9-]{1,63}$/;
const ALLOWED_KINDS = new Set(["css", "webgl", "svg", "canvas", "animation"]);
const GITHUB_SOURCE = /^https:\/\/github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9_.-]{1,100})\/?$/;

function validateRegistry(input) {
  if (!Array.isArray(input) || input.length > 500) throw new Error("Registry must be an array of at most 500 effects");
  const seen = new Set();
  return input.map((effect, index) => {
    if (!effect || typeof effect !== "object" || Array.isArray(effect)) throw new Error(`Invalid effect at ${index}`);
    const { id, name, kind, description, source } = effect;
    if (typeof id !== "string" || !ID_PATTERN.test(id) || seen.has(id)) throw new Error(`Invalid or duplicate effect ID: ${id}`);
    if (typeof name !== "string" || !name.trim() || name.length > 120) throw new Error(`Invalid name: ${id}`);
    if (typeof description !== "string" || !description.trim() || description.length > 500) throw new Error(`Invalid description: ${id}`);
    if (!ALLOWED_KINDS.has(kind)) throw new Error(`Invalid kind: ${id}`);
    const match = typeof source === "string" ? GITHUB_SOURCE.exec(source) : null;
    if (!match || match[2] === "." || match[2] === "..") throw new Error(`Invalid source: ${id}`);
    seen.add(id);
    return { id, name: name.trim(), kind, description: description.trim(), source };
  });
}
function loadRegistry(file = DEFAULT_PATH) {
  const stats = fs.statSync(file);
  if (stats.size > 1024 * 1024) throw new Error("Registry exceeds 1 MiB");
  return validateRegistry(JSON.parse(fs.readFileSync(file, "utf8")));
}
function fold(value) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("en");
}
function searchEffects(entries, query = "", kind) {
  if (typeof query !== "string" || query.length > 200) throw new Error("Query exceeds 200 characters");
  if (kind && !ALLOWED_KINDS.has(kind)) throw new Error("Unknown effect kind");
  const words = fold(query).trim().split(/\s+/).filter(Boolean);
  return entries.filter(e => (!kind || e.kind === kind) &&
    words.every(word => fold([e.id, e.name, e.description, e.kind].join(" ")).includes(word)));
}
module.exports = { validateRegistry, loadRegistry, searchEffects };
