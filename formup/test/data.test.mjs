import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { FORMULAS } from "../src/data/formulas.js";
import { TOPIC } from "../src/data/topics.js";

test("veritabanı bütünlüğü", () => {
  const ids = new Set();
  for (const f of FORMULAS) {
    assert.ok(!ids.has(f.id), "tekrar eden id " + f.id); ids.add(f.id);
    assert.ok(TOPIC[f.t], "konu yok " + f.id);
    assert.ok(f.n && f.l && f.r, "eksik alan " + f.id);
    assert.equal(f.x.length, 3, "3 tuzak olmalı " + f.id);
    assert.ok([1, 2, 3].includes(f.p), "öncelik " + f.id);
  }
  assert.ok(FORMULAS.length >= 400);
});

test("tüm TeX parçaları KaTeX ile derlenir", () => {
  execFileSync(process.execPath, ["scripts/check-tex.mjs"], { stdio: "pipe" });
});

test("özdeşlikler sayısal olarak doğru, tuzaklar yanlış", () => {
  execFileSync(process.execPath, ["scripts/verify-math.mjs"], { stdio: "pipe" });
});
