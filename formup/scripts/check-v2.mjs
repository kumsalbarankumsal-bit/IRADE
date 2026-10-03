// FormUp v2 içerik doğrulayıcısı.
// Kullanım: node scripts/check-v2.mjs [src/data/v2/c-xxx.js ...]   (varsayılan: tüm c-*.js)
// Her kart için: biçim, zorunlu alanlar, KaTeX derlemesi, tuzaklar, boşluk doldurma (B),
// canlı hesap (C/CT), sayısal soru üreteçleri (G), laboratuvar (LAB) ve sayısal doğrulama (V).
import katex from "katex";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseCards, compileCalc, fillTemplate } from "../src/data/v2/parse.js";
import { UNIT, LABS } from "../src/data/v2/units.js";
import { parse as texParse, evaluate, parseBool, evalBool } from "./texeval.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/data/v2");
const files = process.argv.slice(2).length ? process.argv.slice(2).map((f) => join(process.cwd(), f)) : readdirSync(dir).filter((f) => /^c-.*\.js$/.test(f)).map((f) => join(dir, f));

const errors = [], warns = [];
const err = (c, msg) => errors.push(`${c.file ? basename(c.file) : ""}:${c.line || ""} [${c.id}] ${msg}`);
const warn = (c, msg) => warns.push(`${c.file ? basename(c.file) : ""}:${c.line || ""} [${c.id}] ${msg}`);

function tex(c, s, where) {
  try { katex.renderToString(s, { throwOnError: true, strict: "ignore", trust: true }); }
  catch (e) { err(c, `${where}: KaTeX hatası: ${e.message.split("\n")[0]} ⟶ ${s}`); }
}
function rich(c, s, where) {
  if (!s) return;
  const t = s.replace(/^~/, "");
  const parts = t.split("$");
  if (parts.length % 2 === 0) { err(c, `${where}: eşleşmeyen $ ⟶ ${s}`); return; }
  parts.forEach((p, i) => { if (i % 2 === 1) tex(c, p, where); });
}
const field = (c, v, where) => (v.startsWith("~") ? rich(c, v, where) : tex(c, v, where));
const norm = (s) => s.replace(/\s+/g, "");

/* ---- sayısal doğrulama (verify-math.mjs ile aynı mantık) ---- */
let seed = 777;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
function domains(v) {
  return v.split(",").map((s) => {
    const [name, a, b, c] = s.trim().split(":");
    if (a === "int") return { name, int: true, lo: Number(b), hi: Number(c) };
    if (a !== undefined) return { name, lo: Number(a), hi: Number(b) };
    return { name, lo: 0.3, hi: 3 };
  });
}
const REL = {
  "=": (a, b) => Math.abs(a - b) <= 1e-6 * (1 + Math.abs(a) + Math.abs(b)),
  "\\le": (a, b) => a <= b + 1e-9, "\\ge": (a, b) => a >= b - 1e-9, "<": (a, b) => a < b, ">": (a, b) => a > b,
};
function verifyV(c) {
  if (c.v.startsWith("bool:")) {
    const vars = c.v.slice(5).split(",");
    const L = parseBool(c.l), R = parseBool(c.r);
    const envs = [];
    for (let m = 0; m < 1 << vars.length; m++) envs.push(Object.fromEntries(vars.map((v, i) => [v, !!(m & (1 << i))])));
    if (!envs.every((e) => evalBool(L, e) === evalBool(R, e))) err(c, "V: mantık denkliği tutmuyor");
    return;
  }
  const rel = REL[c.o] ? c.o : "=";
  let L, R;
  try { L = texParse(c.l); R = texParse(c.r); } catch (e) { err(c, "V: ayrıştırılamadı: " + e.message); return; }
  const ds = c.v === "-" ? [] : domains(c.v);
  const envs = [];
  for (let k = 0; k < (ds.length ? 60 : 1); k++) {
    const env = {};
    for (const d of ds) env[d.name] = d.int ? d.lo + Math.floor(rnd() * (d.hi - d.lo + 1)) : d.lo + rnd() * (d.hi - d.lo);
    envs.push(env);
  }
  let valid = 0;
  for (const env of envs) {
    let a, b;
    try { a = evaluate(L, env); b = evaluate(R, env); } catch (e) { err(c, "V: " + e.message); return; }
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    valid++;
    if (!REL[rel](a, b)) { err(c, `V: bağıntı tutmuyor ${JSON.stringify(env)} → ${a} ≠ ${b}`); return; }
  }
  if (valid < Math.min(8, envs.length)) err(c, `V: yeterli geçerli örnek yok (${valid})`);
  for (const x of c.x) {
    if (x.startsWith("~")) continue;
    let T;
    try { T = texParse(x); } catch (e) { continue; }
    let breaks = false;
    for (const env of envs) {
      let a, t;
      try { a = evaluate(L, env); t = evaluate(T, env); } catch (e) { breaks = true; break; }
      if (!Number.isFinite(a)) continue;
      if (!Number.isFinite(t) || !REL[rel](a, t)) { breaks = true; break; }
    }
    if (!breaks) err(c, `V: tuzak her noktada doğru çıktı (tuzak aslında doğru!) → ${x}`);
  }
}

/* ---- cevap kontrolü (uygulamadaki ile aynı) ---- */
function parseAnswer(s) {
  const t = String(s).trim().replace(/\s+/g, "").replace(",", ".").replace("−", "-");
  if (!t) return NaN;
  if (t.includes("/")) { const [a, b] = t.split("/"); return Number(b) === 0 ? NaN : Number(a) / Number(b); }
  return Number(t);
}
function texToPlain(t) { return t.replace(/\{,\}/g, ",").replace(/^(-?)\\tfrac\{(\d+)\}\{(\d+)\}$/, "$1$2/$3"); }

const seenIds = new Set();
let total = 0;
const perUnit = {};
for (const file of files) {
  const srcText = readFileSync(file, "utf8");
  const rawStart = srcText.indexOf("String.raw`");
  if (rawStart < 0) { errors.push(`${basename(file)}: CARDS = String.raw\`…\` bulunamadı`); continue; }
  const rawEnd = srcText.indexOf("`", rawStart + 11);
  const rawBody = srcText.slice(rawStart + 11, rawEnd);
  if (rawBody.includes("${")) errors.push(`${basename(file)}: kart metninde "\${" var (şablon ifadesi olarak yorumlanır) — kaldır`);
  let mod;
  try { mod = await import(pathToFileURL(file).href + "?t=" + Date.now()); }
  catch (e) { errors.push(`${basename(file)}: modül yüklenemedi: ${e.message}`); continue; }
  const cards = parseCards(mod.CARDS || "", file);
  const GEN = mod.GEN || {};
  for (const k of Object.keys(GEN)) {
    const prefix = basename(file).replace(/^c-|\.js$/g, "");
    if (!k.startsWith(prefix + "_")) errors.push(`${basename(file)}: üreteç anahtarı "${prefix}_" ile başlamalı: ${k}`);
  }
  for (const c of cards) {
    total++;
    perUnit[c.u] = (perUnit[c.u] || 0) + 1;
    (c.bad || []).forEach((b) => err(c, b));
    if (seenIds.has(c.id)) err(c, "tekrar eden id"); seenIds.add(c.id);
    if (!UNIT[c.u]) err(c, `bilinmeyen ünite: ${c.u}`);
    else if (!c.id.startsWith(c.u + "-")) err(c, `id "${c.u}-" ile başlamalı`);
    if (![1, 2, 3].includes(c.p)) err(c, "öncelik 1, 2 ya da 3 olmalı");
    for (const [k, label] of [["n", "Türkçe ad"], ["ne", "İngilizce ad"], ["l", "L"], ["r", "R"], ["use", "U"], ["usee", "UE"], ["w", "W"], ["we", "WE"], ["q", "Q"], ["qe", "QE"]]) {
      if (!c[k]) err(c, `eksik alan: ${label}`);
    }
    if (c.x.length !== 3) err(c, `tam 3 tuzak (X) olmalı, ${c.x.length} var`);
    if (!c.t.length) err(c, "en az bir terim (T: english = türkçe) olmalı");
    if (UNIT[c.u] && UNIT[c.u].track === "kitap" && !c.bk) err(c, "kitapçık ünitesinde BK (bölüm no) zorunlu");
    if (c.bk && !/^\d\.\d{1,2}$|^0\.0$/.test(c.bk)) err(c, `BK biçimi 1.2 gibi olmalı (ön bilgi için 0.0): ${c.bk}`);
    // TeX
    if (c.l) field(c, c.l, "L");
    if (c.r) field(c, c.r, "R");
    if (c.o && c.o !== ":") tex(c, c.o, "O");
    c.x.forEach((x, i) => field(c, x, `X${i + 1}`));
    for (const k of ["n", "ne", "k", "ke", "use", "usee", "w", "we", "e", "h", "s", "q", "qe"]) if (c[k]) rich(c, c[k], k.toUpperCase());
    c.t.forEach(([en, tr]) => { rich(c, en, "T"); rich(c, tr, "T"); });
    if (c.x.includes(c.r)) err(c, "tuzak doğru cevapla aynı");
    if (new Set(c.x).size !== c.x.length) err(c, "tekrar eden tuzak");
    // İngilizce alanlarda Türkçe harf uyarısı
    for (const k of ["ne", "usee", "we", "qe", "ke"]) if (c[k] && /[ğşıİçöüĞŞÇÖÜ]/.test(c[k].replace(/\$[^$]*\$/g, ""))) warn(c, `${k.toUpperCase()} İngilizce olmalı ama Türkçe harf içeriyor`);
    // B: boşluk doldurma
    if (c.b) {
      const { skel, blanks, dist } = c.b;
      if (!blanks.length) err(c, "B: en az bir [[boşluk]] olmalı");
      if (blanks.length > 4) err(c, "B: en fazla 4 boşluk");
      if (!dist.length) err(c, "B: en az bir çeldirici (|| sonrası) olmalı");
      const filled = skel.replace(/\[\[(.+?)\]\]/g, (m, a) => a.trim());
      if (c.r && norm(filled) !== norm(c.r)) err(c, `B: boşluklar doldurulunca R’ye eşit olmalı\n      B→ ${filled}\n      R→ ${c.r}`);
      for (const d of dist) if (blanks.includes(d)) err(c, `B: çeldirici bir boşluk cevabıyla aynı: ${d}`);
      tex(c, skel.replace(/\[\[(.+?)\]\]/g, "\\boxed{?}"), "B iskelet");
      [...blanks, ...dist].forEach((t) => tex(c, t, "B parça"));
      if (c.r && c.r.startsWith("~")) err(c, "B: metin cevaplı kartlarda B kullanma");
    }
    // C/CT: canlı hesap
    if (c.c) {
      let fn;
      try { fn = compileCalc(c.c); } catch (e) { err(c, "C: " + e.message); }
      if (fn) {
        for (const v of c.c.vars) {
          if (![v.def, v.min, v.max, v.step].every(Number.isFinite)) err(c, `C: ${v.name} için def:min:max:step sayı olmalı`);
          else if (v.def < v.min || v.def > v.max || v.min >= v.max) err(c, `C: ${v.name} aralığı hatalı`);
        }
        const vals = Object.fromEntries(c.c.vars.map((v) => [v.name, v.def]));
        let res;
        try { res = fn(vals); } catch (e) { err(c, "C: hesap hatası: " + e.message); }
        if (res !== undefined && typeof res !== "boolean" && !Number.isFinite(res)) err(c, `C: varsayılan değerlerde sonuç sonlu değil (${res})`);
        let finite = 0;
        for (let k = 0; k < 60; k++) {
          const vv = Object.fromEntries(c.c.vars.map((v) => {
            const steps = Math.round((v.max - v.min) / v.step);
            return [v.name, v.min + Math.floor(rnd() * (steps + 1)) * v.step];
          }));
          try { const y = fn(vv); if (typeof y === "boolean" || Number.isFinite(y)) finite++; } catch (e) { /* sayılmaz */ }
        }
        if (finite < 40) warn(c, `C: rastgele değerlerin çoğunda sonuç tanımsız (${finite}/60)`);
        if (!c.ct) err(c, "C varsa CT (yer tutuculu TeX şablonu) zorunlu");
        else {
          for (const m of c.ct.matchAll(/@([A-Za-z_][A-Za-z0-9_]*|=)@/g)) if (m[1] !== "=" && !c.c.vars.find((v) => v.name === m[1])) err(c, `CT: bilinmeyen yer tutucu @${m[1]}@`);
          if (!c.ct.includes("@=@")) err(c, "CT: sonuç için @=@ içermeli");
          tex(c, fillTemplate(c.ct, vals, typeof res === "number" ? res : 0, (x) => String(Math.round(x * 1000) / 1000)), "CT");
        }
      }
    } else if (c.ct) err(c, "CT var ama C yok");
    // G: üreteç
    if (c.g) {
      const g = GEN[c.g];
      if (!g) err(c, `G: üreteç bulunamadı: ${c.g}`);
      else {
        let s2 = 99;
        const r = () => ((s2 = (s2 * 1103515245 + 12345) % 2147483648) / 2147483648);
        for (let i = 0; i < 200; i++) {
          let out;
          try { out = g(r); } catch (e) { err(c, "G: hata: " + e.message); break; }
          if (!out || typeof out.q !== "string" || typeof out.qe !== "string") { err(c, "G: q ve qe metin olmalı"); break; }
          if (/undefined|NaN|Infinity/.test(out.q + out.qe)) { err(c, "G: soru metninde undefined/NaN: " + out.q); break; }
          if (!Number.isFinite(out.a)) { err(c, "G: cevap sonlu değil"); break; }
          try {
            (out.q + "$" + out.qe).split("$").forEach((p, j) => { if (j % 2) katex.renderToString(p, { throwOnError: true, strict: "ignore" }); });
            katex.renderToString(out.tex, { throwOnError: true, strict: "ignore" });
          } catch (e) { err(c, "G: TeX hatası: " + e.message.split("\n")[0] + " ⟶ " + out.q); break; }
          const v = parseAnswer(texToPlain(out.tex));
          if (!Number.isFinite(v) || Math.abs(v - out.a) > 1e-6 * Math.max(1, Math.abs(out.a))) { err(c, `G: tex (${out.tex}) ile a (${out.a}) uyuşmuyor`); break; }
        }
      }
    }
    if (c.lab && !LABS.includes(c.lab)) err(c, `LAB bilinmiyor: ${c.lab} (izinli: ${LABS.join(", ")})`);
    if (c.v) verifyV(c);
  }
}

console.log(`kart: ${total} · ünite: ${Object.entries(perUnit).map(([k, v]) => `${k}=${v}`).join(" ")}`);
if (warns.length) console.log(`\nUYARILAR (${warns.length}):\n  ` + warns.join("\n  "));
console.log(errors.length ? `\nHATALAR (${errors.length}):\n  ` + errors.join("\n  ") : "\nHata yok ✓");
process.exit(errors.length ? 1 : 0);
