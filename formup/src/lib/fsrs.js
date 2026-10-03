/* FSRS-5 aralıklı tekrar zamanlayıcısı (Free Spaced Repetition Scheduler).
   Her kart için iki gizli değişken tutulur:
     S (stabilite, gün): hatırlama olasılığının %90'a düşmesi için geçen süre
     D (zorluk, 1–10)
   Notlar: 1 = Tekrar (unuttum), 2 = Zor, 3 = İyi, 4 = Kolay.
   Varsayılan ağırlıklar FSRS-5'in açık kaynak varsayılanlarıdır. */

export const W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
  0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
];
export const DAY = 86400000;
const DECAY = -0.5;
const FACTOR = 19 / 81;

const clampD = (d) => Math.min(10, Math.max(1, d));

/** t gün sonra hatırlama olasılığı */
export function retrievability(elapsedDays, S) {
  if (!S || S <= 0) return 0;
  return Math.pow(1 + (FACTOR * Math.max(0, elapsedDays)) / S, DECAY);
}

/** hedef hatırlama oranı r için aralık (gün) */
export function intervalFor(S, r = 0.9) {
  return (S / FACTOR) * (Math.pow(r, 1 / DECAY) - 1);
}

const initS = (g) => Math.max(0.1, W[g - 1]);
const initD = (g) => clampD(W[4] - Math.exp(W[5] * (g - 1)) + 1);

function nextD(D, g) {
  const delta = -W[6] * (g - 3);
  const damped = D + (delta * (10 - D)) / 9;
  return clampD(W[7] * initD(4) + (1 - W[7]) * damped);
}

function recallS(D, S, R, g) {
  const hard = g === 2 ? W[15] : 1;
  const easy = g === 4 ? W[16] : 1;
  return S * (1 + Math.exp(W[8]) * (11 - D) * Math.pow(S, -W[9]) * (Math.exp(W[10] * (1 - R)) - 1) * hard * easy);
}

function forgetS(D, S, R) {
  const s = W[11] * Math.pow(D, -W[12]) * (Math.pow(S + 1, W[13]) - 1) * Math.exp(W[14] * (1 - R));
  return Math.min(s, S / Math.exp(W[17] * W[18]));
}

/** Gün sınırı sabah 04:00 — gece yarısından sonra yapılan çalışma “dün”e sayılır. */
export function dayStart(ts) {
  const d = new Date(ts - 4 * 3600000);
  d.setHours(0, 0, 0, 0);
  return d.getTime() + 4 * 3600000;
}
export const nextDayStart = (ts) => dayStart(ts) + DAY;

/**
 * Bir kartı derecelendir. Yeni bir ilerleme nesnesi döner (girdiyi değiştirmez).
 * p: { s, d, due, last, reps, lapses } veya null (yeni kart)
 */
export function schedule(p, g, now, retention = 0.9, { fuzz = true } = {}) {
  const fresh = !p || !p.reps;
  let s, d, lapses = (p && p.lapses) || 0;
  if (fresh) {
    s = initS(g);
    d = initD(g);
  } else {
    const elapsed = (now - (p.last || now)) / DAY;
    const R = retrievability(elapsed, p.s);
    if (elapsed < 0.5) {
      // aynı gün içinde tekrar: kısa vadeli stabilite (FSRS-5)
      s = p.s * Math.exp(W[17] * (g - 3 + W[18]));
    } else if (g === 1) {
      s = forgetS(p.d, p.s, R);
      lapses += 1;
    } else {
      s = recallS(p.d, p.s, R, g);
    }
    d = nextD(p.d, g);
  }
  s = Math.min(Math.max(s, 0.05), 36500);

  let ivlDays = intervalFor(s, retention);
  if (fuzz && ivlDays > 2.5) {
    const f = 1 + (Math.random() * 0.1 - 0.05);
    ivlDays *= f;
  }
  let due;
  if (g === 1) {
    // unutulan kart: en geç ertesi gün, en erken 10 dk sonra
    due = now + Math.min(Math.max(ivlDays * DAY, 10 * 60000), DAY);
  } else if (fresh) {
    // yeni öğrenilen formül: ilk tekrar yarın (uyku pekiştirmesinden sonra)
    due = Math.max(nextDayStart(now) + 3 * 3600000, now + Math.min(ivlDays, 1) * DAY);
    if (g === 4) due = now + ivlDays * DAY;
  } else {
    due = now + Math.max(ivlDays, 1) * DAY;
  }
  return {
    ...(p || {}),
    s, d, due: Math.round(due), last: now,
    reps: ((p && p.reps) || 0) + 1,
    lapses,
  };
}

/** Kartın şu anki hatırlama olasılığı (0–1); hiç çalışılmadıysa null */
export function currentR(p, now) {
  if (!p || !p.reps) return null;
  return retrievability((now - p.last) / DAY, p.s);
}

/** Dört düğmenin (Tekrar/Zor/İyi/Kolay) her biri için önizleme aralığı */
export function previewIntervals(p, now, retention) {
  return [1, 2, 3, 4].map((g) => schedule(p, g, now, retention, { fuzz: false }).due - now);
}
