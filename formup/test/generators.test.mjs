import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { GEN, parseAnswer, isCorrect } from "../src/data/generators.js";
import { FORMULAS } from "../src/data/formulas.js";
import { rng } from "../src/lib/util.js";

test("veritabanındaki her G anahtarının bir üreteci var", () => {
  for (const f of FORMULAS) if (f.g) assert.ok(GEN[f.g], `${f.id}: ${f.g} üreteci yok`);
});

test("her üreteç 300 denemede geçerli soru ve cevap üretir", () => {
  for (const [k, g] of Object.entries(GEN)) {
    const r = rng(42);
    for (let i = 0; i < 300; i++) {
      const out = g(r);
      assert.equal(typeof out.q, "string", k);
      assert.ok(!/undefined|NaN|Infinity/.test(out.q), `${k}: ${out.q}`);
      assert.ok(Number.isFinite(out.a), `${k}: cevap ${out.a}`);
      out.q.split("$").forEach((part, j) => { if (j % 2) katex.renderToString(part, { throwOnError: true, strict: "ignore" }); });
      katex.renderToString(out.tex, { throwOnError: true, strict: "ignore" });
      // kendi cevabını kabul etmeli
      const plain = out.tex.replace(/\{,\}/g, ",").replace(/\\tfrac\{(\d+)\}\{(\d+)\}/, "$1/$2");
      assert.ok(isCorrect(plain, out), `${k}: kendi cevabı (${plain}) kabul edilmedi, a=${out.a}`);
    }
  }
});

test("cevap ayrıştırma", () => {
  assert.equal(parseAnswer("3/4"), 0.75);
  assert.equal(parseAnswer("-1,5"), -1.5);
  assert.equal(parseAnswer(" 12 "), 12);
  assert.ok(Number.isNaN(parseAnswer("abc")));
  assert.ok(isCorrect("0,33", { a: 1 / 3 }));
  assert.ok(!isCorrect("0,3", { a: 1 / 3 }));
});
