"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { validateRegistry, loadRegistry, searchEffects } = require("../src/registry.cjs");
test("catalog loads and validates", () => { const entries = loadRegistry(); assert.equal(entries.length, 5); });
test("search filters kind and words", () => { const entries = loadRegistry(); assert.deepEqual(searchEffects(entries, "scene", "webgl").map(e => e.id), ["webgl-scene"]); });
test("duplicate IDs are rejected", () => { const e = loadRegistry()[0]; assert.throws(() => validateRegistry([e, e]), /duplicate/); });
test("untrusted sources are rejected", () => { const e = loadRegistry()[0]; assert.throws(() => validateRegistry([{...e, source:"javascript:alert(1)"}]), /source/); });
test("long queries and invalid kinds rejected", () => { const entries = loadRegistry(); assert.throws(() => searchEffects(entries, "x".repeat(201)), /200/); assert.throws(() => searchEffects(entries, "", "unknown"), /kind/); });
