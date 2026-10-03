/* Uygulama düzeyi öğrenme mantığı: hafıza seviyeleri, mod seçimi,
   oturum planları, günlük istatistikler ve seri (streak). */
import { schedule, currentR, dayStart, nextDayStart, DAY } from "./fsrs.js";
import { dayKey, addDaysKey, shuffle, pick, rng } from "./util.js";
import { FORMULAS, RANKED, rankOrder } from "../data/formulas.js";
import { GEN } from "../data/generators.js";

export const LEVELS_MEM = [
  { id: 0, name: "Yeni", short: "Yeni" },
  { id: 1, name: "Isınıyor", short: "Isınıyor" },
  { id: 2, name: "Pekişiyor", short: "Pekişiyor" },
  { id: 3, name: "Oturuyor", short: "Oturuyor" },
  { id: 4, name: "Kalıcı", short: "Kalıcı" },
  { id: 5, name: "Usta", short: "Usta" },
];
export const memLevel = (p) => {
  if (!p || !p.reps) return 0;
  const s = p.s;
  if (s < 3) return 1;
  if (s < 10) return 2;
  if (s < 30) return 3;
  if (s < 90) return 4;
  return 5;
};

export const MODE_NAMES = {
  i: "Yeni formül", m: "Doğru formülü seç", t: "Doğru mu, yanlış mı?", r: "Bu hangi formül?",
  f: "Hatırla", a: "Uygula", s: "Tekrar bak", k: "Kanıtla",
};

/* ---------------- Başlangıç durumu ---------------- */
export function freshState() {
  const t = Date.now();
  return {
    v: 1, createdAt: t, updatedAt: t,
    settings: {
      levels: ["tyt", "ayt", "geo"], newPerDay: 8, retention: 0.9, theme: "auto",
      sound: true, haptics: true, batch: 5, onboarded: false,
      modes: { m: true, t: true, r: true, f: true, a: true },
    },
    cards: {}, queue: [], skipped: {}, custom: [], days: {},
    xp: 0, streak: { cur: 0, best: 0, last: null, freeze: 0 },
    ach: {}, best: { speed: 0, match: 0, trap: 0, lab: 0 },
    stats: { trapsCaught: 0, sessions: 0, perfect: 0, games: 0 },
  };
}
export function migrate(s) {
  const f = freshState();
  if (!s || typeof s !== "object") return f;
  return {
    ...f, ...s,
    settings: { ...f.settings, ...(s.settings || {}), modes: { ...f.settings.modes, ...((s.settings && s.settings.modes) || {}) } },
    streak: { ...f.streak, ...(s.streak || {}) },
    best: { ...f.best, ...(s.best || {}) },
    stats: { ...f.stats, ...(s.stats || {}) },
    cards: s.cards || {}, queue: s.queue || [], skipped: s.skipped || {}, custom: s.custom || [], days: s.days || {}, ach: s.ach || {},
  };
}

/* ---------------- Kart erişimi ---------------- */
const BASE_BY_ID = Object.fromEntries(FORMULAS.map((f) => [f.id, f]));
export function allFormulas(state) {
  return state.custom.length ? FORMULAS.concat(state.custom) : FORMULAS;
}
export function getF(state, id) {
  return BASE_BY_ID[id] || state.custom.find((c) => c.id === id);
}
export function pool(state) {
  const lv = new Set(state.settings.levels);
  return RANKED.filter((f) => lv.has(f.lv)).concat(state.custom);
}

/* ---------------- Sayımlar ---------------- */
export function dueIds(state, now) {
  const end = nextDayStart(now);
  const out = [];
  for (const [id, p] of Object.entries(state.cards)) {
    if (p.reps && !p.sus && p.due < end && getF(state, id)) out.push(id);
  }
  // en çok unutulmaya yüz tutan önce
  return out.sort((a, b) => (currentR(state.cards[a], now) ?? 0) - (currentR(state.cards[b], now) ?? 0));
}
export function learnedIds(state) {
  return Object.keys(state.cards).filter((id) => state.cards[id].reps && getF(state, id));
}
export function today(state, now) {
  return state.days[dayKey(now)] || { r: 0, n: 0, ok: 0, bad: 0, xp: 0, ms: 0 };
}
export function newLeftToday(state, now) {
  return Math.max(0, state.settings.newPerDay - today(state, now).n);
}
export function avgRecall(state, now) {
  const ids = learnedIds(state);
  if (!ids.length) return null;
  return ids.reduce((s, id) => s + (currentR(state.cards[id], now) || 0), 0) / ids.length;
}
export function forecast(state, now, days = 7) {
  const out = Array.from({ length: days }, () => 0);
  const start = dayStart(now);
  for (const p of Object.values(state.cards)) {
    if (!p.reps || p.sus) continue;
    const idx = Math.max(0, Math.floor((p.due - start) / DAY));
    if (idx < days) out[idx]++;
  }
  return out;
}
export function discoverList(state, topic = null) {
  const lv = new Set(state.settings.levels);
  const q = new Set(state.queue);
  const base = RANKED.filter((f) => (topic ? f.t === topic : lv.has(f.lv)))
    .concat(state.custom.filter((c) => !topic || topic === "ozel"))
    .filter((f) => !(state.cards[f.id] && (state.cards[f.id].reps || state.cards[f.id].sus)) && !q.has(f.id));
  const fresh = base.filter((f) => !state.skipped[f.id]);
  const later = base.filter((f) => state.skipped[f.id]).sort((a, b) => state.skipped[a.id] - state.skipped[b.id]);
  return fresh.concat(later);
}

/* ---------------- Mod seçimi ----------------
   Hafıza güçlendikçe soru zorlaşır: önce tanıma (çoktan seçmeli),
   sonra hatırlama (kart çevirme) ve uygulama (sayısal soru). */
export function pickReviewMode(f, p, settings, r = Math.random) {
  const s = p ? p.s : 0;
  const can = { ...settings.modes };
  if (!f.g || !GEN[f.g]) can.a = false;
  if (!f.x || f.x.length < 1) { can.m = false; can.t = false; }
  let w;
  if (s < 3) w = { m: 45, t: 22, r: 15, f: 18, a: 0 };
  else if (s < 10) w = { m: 25, t: 10, r: 12, f: 35, a: 18 };
  else w = { m: 12, t: 8, r: 8, f: 47, a: 25 };
  const entries = Object.entries(w).filter(([k, v]) => can[k] && v > 0);
  if (!entries.length) return "f";
  const total = entries.reduce((a, [, v]) => a + v, 0);
  let x = r() * total;
  for (const [k, v] of entries) { x -= v; if (x <= 0) return k; }
  return entries[0][0];
}

let stepSeq = 0;
const step = (cid, mode, kind) => ({ uid: ++stepSeq, cid, mode, kind });

/** Yeni formül dersi: tanıt → tanı → hatırla, araya diğer kartlar serpiştirilir */
export function planLearn(ids, settings) {
  const slots = [];
  const mcMode = settings.modes.m ? "m" : settings.modes.t ? "t" : "r";
  ids.forEach((cid, j) => {
    slots.push([3 * j, step(cid, "i", "learn")]);
    slots.push([3 * j + 2, step(cid, mcMode, "learn")]);
    slots.push([3 * j + 5, step(cid, "f", "learn")]);
  });
  return slots.sort((a, b) => a[0] - b[0] || a[1].uid - b[1].uid).map((s) => s[1]);
}

export function planReview(state, ids) {
  return ids.map((cid) => step(cid, pickReviewMode(getF(state, cid), state.cards[cid], state.settings), "review"));
}

/** Pratik (zamanlamayı etkilemez): odak turu, konu testi */
export function planPractice(state, ids) {
  return ids.map((cid) => {
    const p = state.cards[cid];
    const f = getF(state, cid);
    const mode = p && p.reps ? pickReviewMode(f, p, state.settings) : (f.x && f.x.length ? "m" : "r");
    return step(cid, mode, "practice");
  });
}
export const relearnSteps = (cid, settings, first = "s") => [step(cid, first, "relearn"), step(cid, settings.modes.m ? "m" : "r", "relearn")];
export const makeStep = step;

/* ---------------- Seçenek üretimi ---------------- */
export function mcOptions(state, f, r = Math.random) {
  let wrong = (f.x || []).slice(0, 3);
  if (wrong.length < 3) {
    const sameKind = (v) => v.startsWith("~") === f.r.startsWith("~");
    const others = shuffle(allFormulas(state).filter((g) => g.id !== f.id && g.r !== f.r && sameKind(g.r)), r)
      .sort((a, b) => (a.t === f.t ? -1 : 0) - (b.t === f.t ? -1 : 0));
    for (const g of others) { if (wrong.length >= 3) break; if (!wrong.includes(g.r)) wrong.push(g.r); }
  }
  return shuffle([{ v: f.r, ok: true }, ...wrong.map((v) => ({ v, ok: false }))], r);
}
export function nameOptions(state, f, r = Math.random) {
  const all = allFormulas(state).filter((g) => g.id !== f.id && g.n !== f.n);
  const same = shuffle(all.filter((g) => g.t === f.t), r);
  const rest = shuffle(all.filter((g) => g.t !== f.t), r);
  const names = [];
  for (const g of same.concat(rest)) { if (names.length >= 3) break; if (!names.includes(g.n)) names.push(g.n); }
  return shuffle([{ v: f.n, ok: true }, ...names.map((v) => ({ v, ok: false }))], r);
}
export function tfCandidate(f, r = Math.random) {
  if (!f.x || !f.x.length || r() < 0.5) return { v: f.r, ok: true };
  return { v: pick(f.x, r), ok: false };
}

/* ---------------- Durum güncellemeleri (saf fonksiyonlar) ---------------- */
function bumpDay(state, now, patch) {
  const k = dayKey(now);
  const d = state.days[k] || { r: 0, n: 0, ok: 0, bad: 0, xp: 0, ms: 0 };
  const nd = { ...d };
  for (const [key, v] of Object.entries(patch)) nd[key] = (nd[key] || 0) + v;
  return { ...state.days, [k]: nd };
}

/** Cevabı kaydet (geçmiş + günlük sayaçlar + XP) */
export function logAnswer(state, now, { cid, mode, ok, ms = 0, xp = 0, grade = null }) {
  const p = state.cards[cid] || {};
  const h = (p.h || []).concat([[Math.round(now / 1000), grade ?? (ok ? 3 : 1), mode, Math.round(ms)]]).slice(-16);
  return {
    ...state,
    cards: { ...state.cards, [cid]: { ...p, h } },
    days: bumpDay(state, now, { ok: ok ? 1 : 0, bad: ok ? 0 : 1, xp, ms: Math.min(ms, 120000) }),
    xp: state.xp + xp,
  };
}

/** FSRS derecelendirmesi — günde kart başına yalnızca ilk cevap zamanlamayı etkiler */
export function gradeCard(state, now, cid, grade, { isNew = false, known = false, noCount = false } = {}) {
  const p = state.cards[cid];
  if (p && p.reps && p.last && dayStart(p.last) === dayStart(now) && !isNew) return state;
  const np = schedule(p && p.reps ? p : null, grade, now, state.settings.retention);
  const merged = { ...(p || {}), ...np, h: (p && p.h) || [] };
  if (known) merged.k = 1;
  const queue = state.queue.filter((x) => x !== cid);
  const skipped = { ...state.skipped }; delete skipped[cid];
  return {
    ...state, queue, skipped,
    cards: { ...state.cards, [cid]: merged },
    days: bumpDay(state, now, isNew ? (noCount ? {} : { n: 1 }) : { r: 1 }),
  };
}

/** Seri: bugün çalışıldı olarak işaretle (dondurma hakkı bir boş günü kurtarır) */
export function touchStreak(state, now) {
  const k = dayKey(now);
  const s = { ...state.streak };
  if (s.last === k) return state;
  const y = addDaysKey(k, -1), y2 = addDaysKey(k, -2);
  if (s.last === y) s.cur += 1;
  else if (s.last === y2 && s.freeze > 0) { s.freeze -= 1; s.cur += 1; }
  else s.cur = 1;
  s.last = k;
  s.best = Math.max(s.best, s.cur);
  if (s.cur > 0 && s.cur % 7 === 0) s.freeze = Math.min(2, s.freeze + 1);
  return { ...state, streak: s };
}
export function shownStreak(state, now) {
  const k = dayKey(now), s = state.streak;
  if (!s.last) return { n: 0, today: false, risk: false };
  if (s.last === k) return { n: s.cur, today: true, risk: false };
  if (s.last === addDaysKey(k, -1)) return { n: s.cur, today: false, risk: false };
  if (s.last === addDaysKey(k, -2) && s.freeze > 0) return { n: s.cur, today: false, risk: true };
  return { n: 0, today: false, risk: false };
}

/** Günün formülü: her gün değişen, henüz öğrenilmemiş önemli bir formül */
export function formulaOfDay(state, now) {
  const list = pool(state).filter((f) => !(state.cards[f.id] && state.cards[f.id].reps) && f.t !== "ozel");
  const src = list.length ? list : pool(state);
  const top = src.filter((f) => f.p >= 2).slice(0, 60);
  const arr = top.length ? top : src;
  const r = rng(Number(dayKey(now).replace(/-/g, "")));
  return arr[Math.floor(r() * arr.length)];
}

/** Zayıf halkalar: en çok unutulan ya da hatırlanma olasılığı en düşük olanlar */
export function weakest(state, now, n = 3) {
  return learnedIds(state)
    .map((id) => ({ id, p: state.cards[id], R: currentR(state.cards[id], now) }))
    .filter((x) => x.p.lapses > 0 || x.R < 0.8)
    .sort((a, b) => (b.p.lapses - a.p.lapses) || (a.R - b.R))
    .slice(0, n);
}

export { rankOrder, currentR, DAY };
