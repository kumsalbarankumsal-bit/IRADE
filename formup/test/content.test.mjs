import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { parseCards, compileCalc, fillTemplate } from "../src/data/v2/parse.js";
import { GEN, CARDS } from "../src/data/v2/index.js";
import { LABS } from "../src/data/v2/units.js";
import { readdirSync } from "node:fs";

test("içerik doğrulayıcı: biçim, KaTeX, tuzaklar, boşluklar, hesaplar, üreteçler, sayısal kontroller", () => {
  const out = execFileSync(process.execPath, ["scripts/check-v2.mjs"], { encoding: "utf8" });
  assert.match(out, /Hata yok/);
});

test("ayrıştırıcı: örnek kart", () => {
  const src = `## f-num
# t-ornek | 1 | Toplama | Addition
L a+b
R b+a
X a-b ;; ab ;; 2a
T sum = toplam
B [[b]]+[[a]] || c
C a=2:0:9:1 ; b=3:0:9:1 => a+b
CT @a@+@b@=@=@
`;
  const [c] = parseCards(src, "t");
  assert.equal(c.id, "t-ornek");
  assert.equal(c.u, "f-num");
  assert.equal(c.ne, "Addition");
  assert.equal(c.x.length, 3);
  assert.deepEqual(c.t[0], ["sum", "toplam"]);
  assert.deepEqual(c.b.blanks, ["b", "a"]);
  const f = compileCalc(c.c);
  assert.equal(f({ a: 2, b: 3 }), 5);
  assert.equal(fillTemplate(c.ct, { a: 2, b: -3 }, -1, (v) => String(v)), "2+(-3)=-1");
});

test("her G anahtarının üreteci var; her LAB kayıtlı", () => {
  for (const c of CARDS) if (c.g) assert.ok(GEN[c.g], `${c.id}: ${c.g}`);
  const labs = new Set(readdirSync("src/labs").filter((f) => f.endsWith(".jsx") && !f.startsWith("_") && f !== "kit.jsx").map((f) => f.slice(0, -4)));
  for (const c of CARDS) if (c.lab) { assert.ok(LABS.includes(c.lab), `${c.id}: ${c.lab}`); }
  for (const l of labs) assert.ok(LABS.includes(l), `bilinmeyen lab dosyası ${l}`);
});
