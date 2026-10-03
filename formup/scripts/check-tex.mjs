// Tüm TeX parçalarını KaTeX ile sıkı modda derler; hata varsa listeler.
import katex from "katex";
import { FORMULAS } from "../src/data/formulas.js";
import { TOPICS } from "../src/data/topics.js";

const errs = [];
const warns = new Set();
function tex(s, where, display = false) {
  try {
    katex.renderToString(s, { throwOnError: true, displayMode: display, strict: (code, msg) => { warns.add(code + ": " + msg.slice(0, 80)); return "ignore"; } });
  } catch (e) { errs.push(`${where}: ${e.message.split("\n")[0]}  ⟶  ${s}`); }
}
function rich(s, where) {
  // "~" önekli ya da serbest metin: $...$ parçalarını derle
  const t = s.replace(/^~/, "");
  const parts = t.split("$");
  if (parts.length % 2 === 0) errs.push(`${where}: eşleşmeyen $ ⟶ ${s}`);
  parts.forEach((p, i) => { if (i % 2 === 1) tex(p, where); });
}
const field = (v, where) => (v.startsWith("~") ? rich(v, where) : tex(v, where));
for (const f of FORMULAS) {
  field(f.l, f.id + ".L"); field(f.r, f.id + ".R");
  if (f.o && f.o !== ":") tex(f.o, f.id + ".O");
  f.x.forEach((x, i) => field(x, `${f.id}.X${i}`));
  for (const k of ["k", "w", "e", "h", "s"]) if (f[k]) rich(f[k], `${f.id}.${k}`);
  rich(f.n, f.id + ".name");
  if (f.x.includes(f.r)) errs.push(`${f.id}: tuzak doğru cevapla aynı`);
  if (new Set(f.x).size !== f.x.length) errs.push(`${f.id}: tekrar eden tuzak`);
}
for (const t of TOPICS) tex(t.glyph, "topic " + t.id);
console.log(errs.length ? errs.join("\n") : "TeX: tümü derlendi ✓");
console.log("uyarı türleri:", [...warns].slice(0, 12));
process.exit(errs.length ? 1 : 0);
