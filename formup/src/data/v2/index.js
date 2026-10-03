/* FormUp v2 içerik toplayıcısı: parçaları ayrıştırır, yolu (dersler + ünite sınavları) kurar. */
import { CHUNKS } from "./chunks.js";
import { parseCards } from "./parse.js";
import { UNITS, UNIT, TRACK } from "./units.js";

export const GEN = Object.assign({}, ...CHUNKS.map((c) => c.GEN || {}));

const parsed = CHUNKS.flatMap((c) => parseCards(c.CARDS || ""));
const unitOrder = Object.fromEntries(UNITS.map((u, i) => [u.id, i]));
parsed.forEach((c, i) => { c.i = i; });
/* Yol sırası: ünite sırası, ünite içinde yazım (öğretim) sırası */
export const CARDS = parsed.filter((c) => UNIT[c.u]).sort((a, b) => unitOrder[a.u] - unitOrder[b.u] || a.i - b.i);
CARDS.forEach((c, i) => { c.rank = i + 1; c.track = UNIT[c.u].track; });
export const BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));

/** Üniteyi eşit boyda 3–4 kartlık derslere böl (ör. 17 → 4+4+3+3+3) */
function chunkLessons(ids) {
  const n = ids.length;
  if (n <= 4) return [ids];
  const k = Math.ceil(n / 4);
  const base = Math.floor(n / k), extra = n % k;
  const out = [];
  for (let i = 0, at = 0; i < k; i++) { const size = base + (i < extra ? 1 : 0); out.push(ids.slice(at, at + size)); at += size; }
  return out;
}

/* Yol: her ünite için dersler ve sonda ünite sınavı */
export const PATH = UNITS.map((u) => {
  const ids = CARDS.filter((c) => c.u === u.id).map((c) => c.id);
  const lessons = chunkLessons(ids).map((cards, k) => ({ id: `${u.id}:${k + 1}`, unit: u.id, k: k + 1, cards }));
  return { unit: u, track: TRACK[u.track], lessons, boss: { id: `${u.id}:boss`, unit: u.id, boss: true, cards: ids }, cards: ids };
}).filter((s) => s.cards.length);

export const NODES = PATH.flatMap((s) => [...s.lessons, s.boss]);
export const NODE = Object.fromEntries(NODES.map((n) => [n.id, n]));

/* Sözlük: İngilizce terim → Türkçe karşılık (+ kart) */
const g = new Map();
for (const c of CARDS) for (const [en, tr] of c.t) {
  const key = en.toLowerCase();
  if (!g.has(key)) g.set(key, { en, tr, cards: [c.id] });
  else g.get(key).cards.push(c.id);
}
export const GLOSSARY = [...g.values()].sort((a, b) => a.en.localeCompare(b.en, "en"));
