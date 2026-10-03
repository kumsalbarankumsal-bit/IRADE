/* FormUp v2 öğrenme mantığı: durum, yol kilitleri, ders/tekrar/sınav planları,
   seçenek üretimi, puanlama, görevler ve ekonomi. Saf fonksiyonlar. */
import { schedule, currentR, dayStart, nextDayStart, DAY } from "./fsrs.js";
import { dayKey, addDaysKey, shuffle, pick, rng } from "./util.js";
import { CARDS, BY_ID, PATH, NODES, NODE, GEN, GLOSSARY } from "../data/v2/index.js";
import { UNIT } from "../data/v2/units.js";
import { QUESTS } from "../data/v2/meta.js";

export const MEM = [
  { tr: "Yeni", en: "New" }, { tr: "Isınıyor", en: "Warming up" }, { tr: "Pekişiyor", en: "Settling" },
  { tr: "Oturuyor", en: "Solid" }, { tr: "Kalıcı", en: "Lasting" }, { tr: "Usta", en: "Mastered" },
];
export const memLevel = (p) => (!p || !p.reps ? 0 : p.s < 3 ? 1 : p.s < 10 ? 2 : p.s < 30 ? 3 : p.s < 90 ? 4 : 5);

export const MODE = {
  i: { tr: "Yeni formül", en: "New formula" }, m: { tr: "Doğru formülü seç", en: "Pick the right formula" },
  t: { tr: "Doğru mu?", en: "True or false?" }, r: { tr: "Bu hangi formül?", en: "Name this formula" },
  z: { tr: "Boşlukları doldur", en: "Fill the gaps" }, f: { tr: "Hatırla", en: "Recall" },
  a: { tr: "Uygula", en: "Apply it" }, w: { tr: "Hangi formül?", en: "Which formula?" },
  e: { tr: "İngilizce terim", en: "English term" }, s: { tr: "Tekrar bak", en: "Look again" }, k: { tr: "Kanıtla", en: "Prove it" },
};

/* ---------------- Durum ---------------- */
export function freshState() {
  const t = Date.now();
  return {
    v: 2, createdAt: t, updatedAt: t,
    settings: { goal: 40, retention: 0.9, theme: "dark", sound: true, haptics: true, showEn: true, unlockAll: false, onboarded: false, outfit: "none", start: "zero" },
    cards: {}, lessons: {}, units: {}, open: {}, days: {}, xp: 0, dust: 0,
    streak: { cur: 0, best: 0, last: null, freeze: 0 },
    ach: {}, best: { speed: 0, match: 0, trap: 0, lab: 0, which: 0, terms: 0 },
    stats: { trapsCaught: 0, sessions: 0, perfect: 0, games: 0, terms: 0 },
    owned: { none: true }, labsSeen: {}, quests: null,
  };
}
export function migrate(s) {
  const f = freshState();
  if (!s || typeof s !== "object" || s.v !== 2) return f;
  return {
    ...f, ...s,
    settings: { ...f.settings, ...(s.settings || {}) },
    streak: { ...f.streak, ...(s.streak || {}) }, best: { ...f.best, ...(s.best || {}) }, stats: { ...f.stats, ...(s.stats || {}) },
    cards: s.cards || {}, lessons: s.lessons || {}, units: s.units || {}, open: s.open || {}, days: s.days || {},
    ach: s.ach || {}, owned: { none: true, ...(s.owned || {}) }, labsSeen: s.labsSeen || {},
  };
}

export const getC = (id) => BY_ID[id];
export const learned = (s) => Object.keys(s.cards).filter((id) => s.cards[id].reps && BY_ID[id]);
export const today = (s, now) => s.days[dayKey(now)] || {};

/* ---------------- Yol ---------------- */
export function nodeDone(s, node) {
  return node.boss ? !!(s.units[node.unit] && s.units[node.unit].crown) : !!(s.lessons[node.id] && s.lessons[node.id].done);
}
export function nodeUnlocked(s, node) {
  if (s.settings.unlockAll || s.open[node.unit]) return true;
  const i = NODES.indexOf(node);
  if (i <= 0) return true;
  return nodeDone(s, NODES[i - 1]) || nodeDone(s, node);
}
export function nodeFading(s, node, now) {
  const end = nextDayStart(now);
  return node.cards.some((id) => { const p = s.cards[id]; return p && p.reps && !p.sus && p.due < end; });
}
export function nodeStatus(s, node, now) {
  if (nodeDone(s, node)) return nodeFading(s, node, now) ? "fade" : "done";
  return nodeUnlocked(s, node) ? "open" : "locked";
}
/** Sıradaki açık ders (Pi’nin durduğu yer) */
export function currentNode(s) {
  const skipFound = s.settings.start === "good";
  return NODES.find((n) => !nodeDone(s, n) && nodeUnlocked(s, n) && !(skipFound && UNIT[n.unit].track === "temel"))
    || NODES.find((n) => !nodeDone(s, n) && nodeUnlocked(s, n)) || NODES[NODES.length - 1];
}
/** Karşılama seçimini duruma uygula: “temelim sağlam” temel ünitelerini ve ilk IB ünitesini açar */
export function applyOnboarding(s, patch) {
  const n = { ...s, settings: { ...s.settings, ...patch } };
  if (patch.start === "good") {
    const open = { ...n.open };
    for (const sec of PATH) if (sec.track.id === "temel") open[sec.unit.id] = true;
    const firstIb = PATH.find((sec) => sec.track.id !== "temel");
    if (firstIb) open[firstIb.unit.id] = true;
    n.open = open;
  }
  return n;
}

/* ---------------- Sayımlar ---------------- */
export function dueIds(s, now) {
  const end = nextDayStart(now);
  return Object.entries(s.cards)
    .filter(([id, p]) => p.reps && !p.sus && p.due < end && BY_ID[id])
    .map(([id]) => id)
    .sort((a, b) => (currentR(s.cards[a], now) ?? 0) - (currentR(s.cards[b], now) ?? 0));
}
export function avgRecall(s, now) {
  const ids = learned(s);
  return ids.length ? ids.reduce((a, id) => a + (currentR(s.cards[id], now) || 0), 0) / ids.length : null;
}
export function forecast(s, now, days = 7) {
  const out = Array.from({ length: days }, () => 0);
  const start = dayStart(now);
  for (const p of Object.values(s.cards)) {
    if (!p.reps || p.sus) continue;
    const idx = Math.max(0, Math.floor((p.due - start) / DAY));
    if (idx < days) out[idx]++;
  }
  return out;
}

/* ---------------- Mod seçimi ---------------- */
function can(c, mode) {
  switch (mode) {
    case "z": return !!(c.b && c.b.blanks.length);
    case "a": return !!(c.g && GEN[c.g]);
    case "w": return !!c.q;
    case "e": return !!(c.t && c.t.length);
    case "m": case "t": return c.x && c.x.length > 0;
    default: return true;
  }
}
function weighted(c, w, r) {
  const entries = Object.entries(w).filter(([k, v]) => v > 0 && can(c, k));
  const total = entries.reduce((a, [, v]) => a + v, 0);
  let x = r() * total;
  for (const [k, v] of entries) { x -= v; if (x <= 0) return k; }
  return entries.length ? entries[0][0] : "f";
}
export function reviewMode(c, p, r = Math.random) {
  const s = p ? p.s : 0;
  if (s < 3) return weighted(c, { m: 30, t: 14, z: 24, r: 8, e: 8, f: 16 }, r);
  if (s < 10) return weighted(c, { z: 20, f: 30, a: 22, w: 14, m: 8, e: 6 }, r);
  return weighted(c, { f: 40, a: 26, w: 22, z: 12 }, r);
}

let seq = 0;
export const step = (cid, mode, kind, extra = {}) => ({ uid: ++seq, cid, mode, kind, ...extra });

/** Ders planı: her kart için tanıt → tanı → parça/ad → hatırla; araya bir “hangi formül” ve bir “terim” */
export function planLesson(node, r = Math.random) {
  const slots = [];
  node.cards.forEach((cid, j) => {
    const c = BY_ID[cid];
    slots.push([4 * j, step(cid, "i", "learn")]);
    slots.push([4 * j + 2, step(cid, can(c, "m") ? (r() < 0.75 ? "m" : "t") : "r", "learn")]);
    slots.push([4 * j + 5, step(cid, can(c, "z") ? "z" : "r", "learn")]);
    slots.push([4 * j + 8, step(cid, "f", "learn")]);
  });
  const withQ = node.cards.filter((id) => BY_ID[id].q);
  if (withQ.length && node.cards.length > 1) slots.push([4 * node.cards.length + 7, step(pick(withQ, r), "w", "practice")]);
  const withT = node.cards.filter((id) => BY_ID[id].t.length);
  if (withT.length) slots.push([4 * Math.min(2, node.cards.length) + 3, step(pick(withT, r), "e", "practice")]);
  return slots.sort((a, b) => a[0] - b[0] || a[1].uid - b[1].uid).map((x) => x[1]);
}
export function planReview(s, ids, r = Math.random) {
  return ids.map((cid) => step(cid, reviewMode(BY_ID[cid], s.cards[cid], r), "review"));
}
/** Sınav: ünite sınavı (10 soru) ya da atlama sınavı (8 soru); kendi kendine puanlama yok */
export function planTest(cardIds, n, r = Math.random) {
  const ids = shuffle(cardIds, r).slice(0, n);
  while (ids.length < n && cardIds.length) ids.push(pick(cardIds, r));
  return ids.map((cid) => step(cid, weighted(BY_ID[cid], { m: 26, z: 22, w: 18, a: 18, t: 8, r: 8 }, r), "test"));
}
export function planPractice(s, ids, r = Math.random) {
  return ids.map((cid) => {
    const p = s.cards[cid];
    return step(cid, p && p.reps ? reviewMode(BY_ID[cid], p, r) : (can(BY_ID[cid], "m") ? "m" : "r"), "practice");
  });
}
export const relearn = (cid) => [step(cid, "s", "relearn"), step(cid, can(BY_ID[cid], "m") ? "m" : "r", "relearn")];

/* ---------------- Seçenekler ---------------- */
export function mcOptions(c, r = Math.random) {
  return shuffle([{ v: c.r, ok: true }, ...c.x.slice(0, 3).map((v) => ({ v, ok: false }))], r);
}
export function tfCandidate(c, r = Math.random) {
  if (!c.x.length || r() < 0.5) return { v: c.r, ok: true };
  return { v: pick(c.x, r), ok: false };
}
function others(c, r, filter = () => true) {
  const same = shuffle(CARDS.filter((o) => o.id !== c.id && o.u === c.u && filter(o)), r);
  const near = shuffle(CARDS.filter((o) => o.id !== c.id && o.u !== c.u && o.track === c.track && filter(o)), r);
  const rest = shuffle(CARDS.filter((o) => o.id !== c.id && o.track !== c.track && filter(o)), r);
  return same.concat(near, rest);
}
export function nameOptions(c, r = Math.random) {
  const names = [];
  for (const o of others(c, r)) { if (names.length >= 3) break; if (o.n !== c.n && !names.find((x) => x.n === o.n)) names.push(o); }
  return shuffle([{ c, ok: true }, ...names.map((o) => ({ c: o, ok: false }))], r);
}
export function whichOptions(c, r = Math.random) {
  const opts = [];
  for (const o of others(c, r, (o) => o.r !== c.r && o.l !== c.l)) { if (opts.length >= 3) break; opts.push(o); }
  return shuffle([{ c, ok: true }, ...opts.map((o) => ({ c: o, ok: false }))], r);
}
/** Terim sorusu: İngilizce → Türkçe ya da tersi */
export function termQuestion(c, r = Math.random) {
  const [en, tr] = pick(c.t, r);
  const reverse = r() < 0.4;
  const pool = shuffle(GLOSSARY.filter((g) => g.en.toLowerCase() !== en.toLowerCase() && g.tr !== tr), r).slice(0, 3);
  const opts = shuffle([{ v: reverse ? en : tr, ok: true }, ...pool.map((g) => ({ v: reverse ? g.en : g.tr, ok: false }))], r);
  return { prompt: reverse ? tr : en, reverse, opts, en, tr };
}
export function clozeBank(c, r = Math.random) {
  return shuffle([...c.b.blanks.map((v, i) => ({ v, key: "b" + i })), ...c.b.dist.map((v, i) => ({ v, key: "d" + i }))], r);
}

/* ---------------- Durum güncellemeleri ---------------- */
function bump(s, now, patch, maxPatch = {}) {
  const k = dayKey(now);
  const d = { ...(s.days[k] || {}) };
  for (const [key, v] of Object.entries(patch)) d[key] = (d[key] || 0) + v;
  for (const [key, v] of Object.entries(maxPatch)) d[key] = Math.max(d[key] || 0, v);
  return { ...s.days, [k]: d };
}
export function logAnswer(s, now, { cid, mode, ok, ms = 0, xp = 0, grade = null, combo = 0, term = false, trap = false }) {
  const p = s.cards[cid] || {};
  const h = (p.h || []).concat([[Math.round(now / 1000), grade ?? (ok ? 3 : 1), mode, Math.round(ms)]]).slice(-16);
  return {
    ...s,
    cards: cid ? { ...s.cards, [cid]: { ...p, h } } : s.cards,
    days: bump(s, now, { ok: ok ? 1 : 0, bad: ok ? 0 : 1, xp, ms: Math.min(ms, 120000), apply: mode === "a" && ok ? 1 : 0 }, { combo }),
    xp: s.xp + xp,
    stats: { ...s.stats, terms: s.stats.terms + (term && ok ? 1 : 0), trapsCaught: s.stats.trapsCaught + (trap ? 1 : 0) },
  };
}
export function addXp(s, now, xp, dust = 0, counters = {}) {
  return { ...s, xp: s.xp + xp, dust: s.dust + dust, days: bump(s, now, { xp, ...counters }) };
}
/** FSRS: günde kart başına ilk cevap zamanlar */
export function gradeCard(s, now, cid, grade, { isNew = false, known = false } = {}) {
  const p = s.cards[cid];
  if (p && p.reps && p.last && dayStart(p.last) === dayStart(now) && !isNew) return s;
  const np = schedule(p && p.reps ? p : null, grade, now, s.settings.retention);
  const merged = { ...(p || {}), ...np, h: (p && p.h) || [] };
  if (known) merged.k = 1;
  return { ...s, cards: { ...s.cards, [cid]: merged }, days: bump(s, now, isNew ? { n: known ? 0 : 1 } : { r: 1 }) };
}
export function finishLesson(s, now, node, { ok, bad }) {
  const acc = ok + bad ? ok / (ok + bad) : 1;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  const prev = s.lessons[node.id] || {};
  const best = Math.max(prev.stars || 0, stars);
  const first = !prev.done;
  const dust = (first ? 10 : 3) + stars * 2;
  let n = { ...s, lessons: { ...s.lessons, [node.id]: { done: prev.done || now, stars: best } } };
  n = addXp(n, now, first ? 10 : 4, dust, { lessons: 1, three: stars === 3 ? 1 : 0 });
  if (bad === 0 && ok >= 6) n = { ...n, stats: { ...n.stats, perfect: n.stats.perfect + 1 } };
  return { s: n, stars, dust, acc };
}
export function finishTest(s, now, unitId, { ok, bad }, jump = false) {
  const total = ok + bad, acc = total ? ok / total : 0;
  const pass = jump ? acc >= 0.85 : acc >= 0.8;
  if (!pass) return { s, pass, acc, dust: 0 };
  let n = s;
  if (jump) {
    // Atlama: ünitedeki dersleri tamamlanmış say, kartları “biliyor” olarak zamanla
    const sec = PATH.find((x) => x.unit.id === unitId);
    const lessons = { ...n.lessons };
    for (const l of sec.lessons) if (!lessons[l.id]) lessons[l.id] = { done: now, stars: 1, jumped: 1 };
    n = { ...n, lessons, open: { ...n.open, [unitId]: true } };
    for (const id of sec.cards) if (!(n.cards[id] && n.cards[id].reps)) n = gradeCard(n, now, id, 3, { isNew: true, known: true });
  }
  n = { ...n, units: { ...n.units, [unitId]: { ...(n.units[unitId] || {}), crown: n.units[unitId]?.crown || (jump ? 0 : now) } } };
  const dust = jump ? 15 : 40;
  n = addXp(n, now, jump ? 15 : 30, dust, {});
  return { s: n, pass, acc, dust };
}

/* ---------------- Seri ---------------- */
export function touchStreak(s, now) {
  const k = dayKey(now);
  const st = { ...s.streak };
  if (st.last === k) return s;
  const y = addDaysKey(k, -1), y2 = addDaysKey(k, -2);
  if (st.last === y) st.cur += 1;
  else if (st.last === y2 && st.freeze > 0) { st.freeze -= 1; st.cur += 1; }
  else st.cur = 1;
  st.last = k;
  st.best = Math.max(st.best, st.cur);
  let dust = 0;
  if (st.cur % 7 === 0) { st.freeze = Math.min(2, st.freeze + 1); dust = 25; }
  return { ...s, streak: st, dust: s.dust + dust };
}
export function shownStreak(s, now) {
  const k = dayKey(now), st = s.streak;
  if (!st.last) return { n: 0, today: false, risk: false };
  if (st.last === k) return { n: st.cur, today: true, risk: false };
  if (st.last === addDaysKey(k, -1)) return { n: st.cur, today: false, risk: true };
  if (st.last === addDaysKey(k, -2) && st.freeze > 0) return { n: st.cur, today: false, risk: true };
  return { n: 0, today: false, risk: false };
}

/* ---------------- Günlük görevler ---------------- */
export function questsFor(s, now) {
  const k = dayKey(now);
  if (s.quests && s.quests.day === k) return s.quests;
  const r = rng(Number(k.replace(/-/g, "")));
  const rest = shuffle(QUESTS.filter((q) => q.id !== "xp"), r).slice(0, 2);
  return { day: k, ids: ["xp", ...rest.map((q) => q.id)], claimed: {}, chest: false };
}
export function questProgress(s, now) {
  const q = questsFor(s, now);
  const d = today(s, now);
  return q.ids.map((id) => {
    const def = QUESTS.find((x) => x.id === id);
    const goal = def.goal(s);
    const v = d[def.metric] || 0;
    return { ...def, goal, v: Math.min(v, goal), done: v >= goal, claimed: !!q.claimed[id] };
  });
}

/* ---------------- Rozet bağlamı ---------------- */
export function achCtx(s, now) {
  const ids = learned(s);
  const lv = ids.map((id) => memLevel(s.cards[id]));
  const booklet = CARDS.filter((c) => c.track === "kitap");
  const t = today(s, now);
  return {
    learned: ids.length, durable: lv.filter((x) => x >= 4).length,
    lessonsDone: Object.values(s.lessons).filter((l) => l.done).length,
    crowns: Object.values(s.units).filter((u) => u.crown).length,
    foundDone: PATH.filter((p) => p.track.id === "temel").every((p) => p.lessons.every((l) => s.lessons[l.id] && s.lessons[l.id].done)),
    bookletDone: booklet.length > 0 && booklet.every((c) => s.cards[c.id] && s.cards[c.id].reps),
    hour: new Date(now).getHours(), studiedNow: !!((t.ok || 0) + (t.bad || 0)),
  };
}

export { CARDS, BY_ID, PATH, NODES, NODE, GEN, GLOSSARY, UNIT, currentR };
