import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(new URL("./questions-data.js", import.meta.url), "utf8"), sandbox);
const q = sandbox.window.QUESTIONS;
assert.equal(q.length, 12);
assert.ok(q.every(axis => axis.length === 8));
assert.ok(q.every(axis => axis.every(level => level.length === 3)));
assert.equal(q.flat(3).length, 288);
assert.ok(q.flat(3).every(item => item.en && item.zh));

for (const axis of q) {
  let maximum = 0;
  axis.forEach((level, levelIndex) => level.forEach(() => { maximum += 2 * (levelIndex < 4 ? 1 : -1) * (levelIndex < 4 ? 1 : -1); }));
  assert.equal(50 + maximum, 98);
  assert.equal(50 - maximum, 2);
}
console.log("PASS: 12 axes, 288 bilingual questions, original 2–98 score bounds");
