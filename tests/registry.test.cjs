"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const os = require("node:os");
const { validateRegistry, loadRegistry, searchEffects } = require("../src/registry.cjs");
const { parseArgs } = require("../bin/effects.cjs");
const cli = path.join(__dirname, "..", "bin", "effects.cjs");
function run(...args) { return spawnSync(process.execPath, [cli, ...args], { cwd: os.tmpdir(), encoding: "utf8", timeout: 5000 }); }

test("catalog loads and validates", () => { const entries = loadRegistry(); assert.equal(entries.length, 5); });
test("search filters kind and words", () => { const entries = loadRegistry(); assert.deepEqual(searchEffects(entries, "scene", "webgl").map(e => e.id), ["webgl-scene"]); });
test("duplicate IDs are rejected", () => { const e = loadRegistry()[0]; assert.throws(() => validateRegistry([e, e]), /duplicate/); });
test("untrusted sources are rejected", () => { const e = loadRegistry()[0]; assert.throws(() => validateRegistry([{...e, source:"javascript:alert(1)"}]), /source/); });
test("GitHub URL path traversal and lookalike hosts rejected", () => { const e = loadRegistry()[0]; for (const source of ["https://github.com/user/..", "https://github.com.evil.org/user/repo", "https://github.com/user/repo?token=x"]) assert.throws(() => validateRegistry([{...e, source}]), /source/); });
test("long queries and invalid kinds rejected", () => { const entries = loadRegistry(); assert.throws(() => searchEffects(entries, "x".repeat(201)), /200/); assert.throws(() => searchEffects(entries, "", "unknown"), /kind/); });
test("accent-insensitive query", () => { const entries = [{id:"neon-glow",name:"Neón",description:"Destello",kind:"css"}]; assert.equal(searchEffects(entries, "NEON").length, 1); });
test("CLI option parser rejects duplicate and missing values", () => { assert.throws(() => parseArgs(["--kind", "css", "--kind", "svg"]), /Duplicate/); assert.throws(() => parseArgs(["--limit", "--json"]), /Missing/); assert.throws(() => parseArgs(["--json", "--json"]), /Duplicate/); });
test("CLI option parser rejects invalid limit and unknown options", () => { for (const value of ["0", "501", "-1", "1.5", "NaN"]) assert.throws(() => parseArgs(["--limit", value])); assert.throws(() => parseArgs(["--wat"]), /Unknown/); });
test("CLI supports literal query after --", () => { assert.deepEqual(parseArgs(["--", "--json"]).words, ["--json"]); });
test("CLI returns filtered JSON from unrelated cwd", () => { const result = run("--kind", "webgl", "scene", "--json"); assert.equal(result.status, 0, result.stderr); assert.deepEqual(JSON.parse(result.stdout).map(e => e.id), ["webgl-scene"]); });
test("CLI applies --limit and returns help without catalog access", () => { const result = run("--limit", "2", "--json"); assert.equal(result.status, 0, result.stderr); assert.equal(JSON.parse(result.stdout).length, 2); const help = run("--help"); assert.equal(help.status, 0); assert.match(help.stdout, /--limit/); });
test("CLI fails closed on invalid kind", () => { const result = run("--kind", "other", "--json"); assert.equal(result.status, 1); assert.match(result.stderr, /kind/); });
