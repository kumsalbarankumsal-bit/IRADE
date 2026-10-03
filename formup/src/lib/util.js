/* Küçük yardımcılar */
import { DAY, dayStart } from "./fsrs.js";

export const pad2 = (n) => String(n).padStart(2, "0");

/** Gün anahtarı (04:00 sınırlı), örn. "2026-10-03" */
export function dayKey(ts) {
  const d = new Date(dayStart(ts));
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
export function keyToTs(k) {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d, 12).getTime();
}
export const addDaysKey = (k, n) => dayKey(keyToTs(k) + n * DAY);

/** Tohumlanabilir rastgele sayı üreteci (mulberry32) */
export function rng(seed = Date.now()) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function shuffle(arr, r = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const pick = (arr, r = Math.random) => arr[Math.floor(r() * arr.length)];

/** Aralığı insan diliyle: "10 dk", "3 sa", "2 g", "3 hf", "4 ay", "1,2 yıl" */
export function fmtInterval(ms) {
  const m = ms / 60000;
  if (m < 60) return `${Math.max(1, Math.round(m))} dk`;
  const h = m / 60;
  if (h < 22) return `${Math.round(h)} sa`;
  const d = h / 24;
  if (d < 14) return `${Math.max(1, Math.round(d))} g`;
  if (d < 60) return `${Math.round(d / 7)} hf`;
  if (d < 365) return `${Math.round(d / 30)} ay`;
  return `${(d / 365).toFixed(1).replace(".", ",")} yıl`;
}

const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const DAYS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
export const fmtDate = (ts) => { const d = new Date(ts); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
export const weekdayShort = (ts) => DAYS[new Date(ts).getDay()];

/** Ne zaman: "bugün", "yarın", "3 gün sonra", "5 Kas" */
export function fmtWhen(ts, now) {
  const a = dayStart(ts), b = dayStart(now);
  const diff = Math.round((a - b) / DAY);
  if (ts <= now) return "şimdi";
  if (diff === 0) return "bugün";
  if (diff === 1) return "yarın";
  if (diff < 7) return `${diff} gün sonra`;
  return fmtDate(ts);
}

/** Sayıyı Türkçe biçimle (ondalık virgül) */
export function fmtNum(v, digits = 4) {
  if (!Number.isFinite(v)) return String(v);
  const r = Math.round(v * 10 ** digits) / 10 ** digits;
  return String(r).replace(".", ",");
}

/** Türkçe duyarlı küçük harf + aksan sadeleştirme (arama için) */
export function fold(s) {
  return s
    .replace(/\$[^$]*\$/g, " ")
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c").replace(/â/g, "a");
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function vibrate(pattern, on) {
  if (!on) return;
  try { navigator.vibrate && navigator.vibrate(pattern); } catch (e) { /* desteklenmiyor */ }
}
