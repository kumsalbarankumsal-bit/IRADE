// Sayısal doğrulama: V satırı olan her kartta
//  (1) sol O sağ bağıntısı tüm örnek noktalarda sağlanmalı,
//  (2) her tuzak (ayrıştırılabiliyorsa) en az bir noktada bağıntıyı bozmalı.
import { FORMULAS } from "../src/data/formulas.js";
import { parse, evaluate, parseBool, evalBool } from "./texeval.mjs";

let seed = 12345;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

function domains(v) {
  return v.split(",").map((s) => {
    const [name, a, b, c] = s.trim().split(":");
    if (a === "int") return { name, int: true, lo: Number(b), hi: Number(c) };
    if (a !== undefined) return { name, lo: Number(a), hi: Number(b) };
    return { name, lo: 0.3, hi: 3 };
  });
}
function sample(ds) {
  const env = {};
  for (const d of ds) env[d.name] = d.int ? d.lo + Math.floor(rnd() * (d.hi - d.lo + 1)) : d.lo + rnd() * (d.hi - d.lo);
  return env;
}
const REL = {
  "=": (a, b) => Math.abs(a - b) <= 1e-6 * (1 + Math.abs(a) + Math.abs(b)),
  "\\le": (a, b) => a <= b + 1e-9, "\\ge": (a, b) => a >= b - 1e-9,
  "<": (a, b) => a < b, ">": (a, b) => a > b,
};

const problems = [], notes = [];
let checked = 0, trapsChecked = 0;
for (const f of FORMULAS) {
  if (!f.v) continue;
  checked++;
  if (f.v.startsWith("bool:")) {
    const vars = f.v.slice(5).split(",");
    const L = parseBool(f.l), R = parseBool(f.r);
    const envs = [];
    for (let m = 0; m < 1 << vars.length; m++) envs.push(Object.fromEntries(vars.map((v, i) => [v, !!(m & (1 << i))])));
    if (!envs.every((e) => evalBool(L, e) === evalBool(R, e))) problems.push(`${f.id}: mantık denkliği tutmuyor`);
    for (const x of f.x) {
      try { const T = parseBool(x); trapsChecked++; if (envs.every((e) => evalBool(L, e) === evalBool(T, e))) problems.push(`${f.id}: tuzak aslında doğru → ${x}`); }
      catch (e) { notes.push(`${f.id}: tuzak atlandı (${x})`); }
    }
    continue;
  }
  const rel = REL[f.o] ? f.o : "=";
  let L, R;
  try { L = parse(f.l); R = parse(f.r); }
  catch (e) { problems.push(`${f.id}: ayrıştırılamadı: ${e.message}`); continue; }
  const ds = f.v === "-" ? [] : domains(f.v);
  const envs = [];
  for (let k = 0; k < (ds.length ? 60 : 1); k++) envs.push(sample(ds));
  let valid = 0;
  for (const env of envs) {
    let a, b;
    try { a = evaluate(L, env); b = evaluate(R, env); } catch (e) { problems.push(`${f.id}: ${e.message}`); break; }
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    valid++;
    if (!REL[rel](a, b)) { problems.push(`${f.id}: bağıntı tutmuyor ${JSON.stringify(env)} → ${a} vs ${b}`); break; }
  }
  if (valid < Math.min(8, envs.length)) problems.push(`${f.id}: yeterli geçerli örnek yok (${valid})`);
  for (const x of f.x) {
    if (x.startsWith("~")) continue;
    let T;
    try { T = parse(x); } catch (e) { notes.push(`${f.id}: tuzak ayrıştırılamadı (${x})`); continue; }
    trapsChecked++;
    let breaks = false;
    for (const env of envs) {
      let a, t;
      try { a = evaluate(L, env); t = evaluate(T, env); } catch (e) { notes.push(`${f.id}: tuzak değerlendirilemedi (${x}): ${e.message}`); breaks = true; break; }
      if (!Number.isFinite(a)) continue;
      if (!Number.isFinite(t) || !REL[rel](a, t)) { breaks = true; break; }
    }
    if (!breaks) problems.push(`${f.id}: tuzak tüm noktalarda doğru çıktı → ${x}`);
  }
}
console.log(`kontrol edilen kart: ${checked}, sınanan tuzak: ${trapsChecked}`);
if (notes.length) console.log("notlar:\n  " + notes.join("\n  "));
console.log(problems.length ? "SORUNLAR:\n  " + problems.join("\n  ") : "Tüm özdeşlikler doğru, tüm tuzaklar yanlış ✓");
process.exit(problems.length ? 1 : 0);
