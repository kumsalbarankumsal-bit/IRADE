import test from "node:test";
import assert from "node:assert/strict";
import { schedule, retrievability, intervalFor, DAY, currentR, dayStart, nextDayStart } from "../src/lib/fsrs.js";
import { freshState, gradeCard, logAnswer, touchStreak, shownStreak, dueIds, planLearn, discoverList, mcOptions, nameOptions, pickReviewMode, memLevel, migrate } from "../src/lib/srs.js";
import { FORMULAS } from "../src/data/formulas.js";
import { dayKey } from "../src/lib/util.js";
import { rng } from "../src/lib/util.js";

const T0 = new Date(2026, 9, 3, 10, 0).getTime();

test("FSRS: hedef %90 iken aralık stabiliteye eşittir", () => {
  assert.ok(Math.abs(intervalFor(10, 0.9) - 10) < 1e-9);
  assert.ok(Math.abs(retrievability(10, 10) - 0.9) < 1e-9);
  assert.ok(intervalFor(10, 0.95) < 10 && intervalFor(10, 0.85) > 10);
});

test("FSRS: yeni kartın ilk tekrarı yarına kurulur; Kolay daha uzun", () => {
  const good = schedule(null, 3, T0, 0.9, { fuzz: false });
  assert.ok(good.due >= nextDayStart(T0) && good.due < nextDayStart(T0) + DAY);
  const easy = schedule(null, 4, T0, 0.9, { fuzz: false });
  assert.ok(easy.due - T0 > 10 * DAY);
  const again = schedule(null, 1, T0, 0.9, { fuzz: false });
  assert.ok(again.due - T0 <= DAY);
});

test("FSRS: başarılı tekrarlar aralığı büyütür, unutma küçültür", () => {
  let p = schedule(null, 3, T0, 0.9, { fuzz: false });
  let t = p.due, last = 0;
  for (let i = 0; i < 6; i++) {
    const n = schedule(p, 3, t, 0.9, { fuzz: false });
    const ivl = n.due - t;
    assert.ok(ivl > last, `aralık büyümeli (${i})`);
    last = ivl; p = n; t = n.due;
  }
  const lapse = schedule(p, 1, t, 0.9, { fuzz: false });
  assert.ok(lapse.s < p.s && lapse.lapses === 1 && lapse.due - t <= DAY);
  assert.ok(lapse.d > p.d, "unutunca zorluk artmalı");
});

test("Günde kart başına yalnızca ilk cevap zamanlamayı değiştirir", () => {
  let s = freshState();
  s = gradeCard(s, T0, "oz-tamkare1", 3, { isNew: true });
  const p1 = s.cards["oz-tamkare1"];
  const later = p1.due + 3600e3;
  s = gradeCard(s, later, "oz-tamkare1", 3);
  const p2 = s.cards["oz-tamkare1"];
  s = gradeCard(s, later + 60e3, "oz-tamkare1", 1);
  assert.deepEqual(s.cards["oz-tamkare1"].due, p2.due);
  assert.equal(s.days[dayKey(T0)].n, 1);
});

test("Seri: ardışık günler sayılır, dondurma bir boş günü kurtarır", () => {
  let s = freshState();
  s = touchStreak(s, T0);
  s = touchStreak(s, T0 + DAY);
  assert.equal(s.streak.cur, 2);
  s = { ...s, streak: { ...s.streak, freeze: 1 } };
  s = touchStreak(s, T0 + 3 * DAY);
  assert.equal(s.streak.cur, 3);
  assert.equal(s.streak.freeze, 0);
  s = touchStreak(s, T0 + 6 * DAY);
  assert.equal(s.streak.cur, 1);
  assert.equal(shownStreak(s, T0 + 9 * DAY).n, 0);
});

test("Ders planı: her kart tanıt → tanı → hatırla sırasıyla gelir", () => {
  const ids = ["sy-gauss", "oz-ikikare", "ik-delta"];
  const steps = planLearn(ids, freshState().settings);
  assert.equal(steps.length, 9);
  for (const id of ids) {
    const modes = steps.filter((x) => x.cid === id).map((x) => x.mode);
    assert.deepEqual(modes, ["i", "m", "f"]);
  }
  assert.equal(steps[0].mode, "i");
});

test("Seçenekler: doğru cevap tam bir kez, tuzaklar farklı", () => {
  const s = freshState();
  const r = rng(7);
  for (const f of FORMULAS) {
    const o = mcOptions(s, f, r);
    assert.equal(o.length, 4, f.id);
    assert.equal(o.filter((x) => x.ok).length, 1, f.id);
    assert.equal(new Set(o.map((x) => x.v)).size, 4, f.id);
    const n = nameOptions(s, f, r);
    assert.equal(n.filter((x) => x.ok).length, 1);
    assert.equal(new Set(n.map((x) => x.v)).size, 4);
  }
});

test("Keşfet listesi öğrenilen ve listedeki kartları dışarıda bırakır", () => {
  let s = freshState();
  const first = discoverList(s)[0];
  s = gradeCard(s, T0, first.id, 3, { isNew: true });
  s = { ...s, queue: [discoverList(s)[0].id] };
  const l = discoverList(s);
  assert.ok(!l.find((f) => f.id === first.id));
  assert.ok(!l.find((f) => f.id === s.queue[0]));
});

test("Mod merdiveni: zayıf hafızada tanıma, güçlüde hatırlama/uygulama ağırlıklı", () => {
  const s = freshState();
  const f = FORMULAS.find((x) => x.id === "oz-ikikare");
  const count = (S) => { const c = {}; const r = rng(1); for (let i = 0; i < 2000; i++) { const m = pickReviewMode(f, { s: S }, s.settings, r); c[m] = (c[m] || 0) + 1; } return c; };
  const weak = count(1), strong = count(60);
  assert.ok((weak.m || 0) > (weak.f || 0));
  assert.ok((strong.f || 0) + (strong.a || 0) > (strong.m || 0) + (strong.t || 0));
  assert.equal(weak.a || 0, 0);
});

test("Eski/eksik kayıt yeni şemaya taşınır", () => {
  const m = migrate({ cards: { a: { s: 1 } }, settings: { newPerDay: 3 } });
  assert.equal(m.settings.newPerDay, 3);
  assert.equal(m.settings.retention, 0.9);
  assert.ok(m.settings.modes.f);
  assert.deepEqual(m.queue, []);
});

test("Vadesi gelenler: bugün sınırına (04:00) kadar olanlar", () => {
  let s = freshState();
  s = gradeCard(s, T0, "sy-gauss", 3, { isNew: true });
  assert.equal(dueIds(s, T0).length, 0);
  assert.equal(dueIds(s, s.cards["sy-gauss"].due).length, 1);
  assert.equal(memLevel(s.cards["sy-gauss"]), memLevel({ reps: 1, s: s.cards["sy-gauss"].s }));
});
