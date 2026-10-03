import test from "node:test";
import assert from "node:assert/strict";
import { schedule, retrievability, intervalFor, DAY, nextDayStart } from "../src/lib/fsrs.js";
import {
  freshState, migrate, gradeCard, logAnswer, touchStreak, shownStreak, dueIds, planLesson, planReview, planTest,
  mcOptions, nameOptions, whichOptions, termQuestion, clozeBank, tfCandidate, reviewMode, memLevel,
  nodeUnlocked, nodeStatus, currentNode, finishLesson, finishTest, questsFor, questProgress, applyOnboarding,
  CARDS, BY_ID, PATH, NODES, GLOSSARY, UNIT,
} from "../src/lib/learn.js";
import { dayKey, rng } from "../src/lib/util.js";

const T0 = new Date(2026, 9, 3, 10, 0).getTime();

test("FSRS: hedef %90 iken aralık stabiliteye eşittir", () => {
  assert.ok(Math.abs(intervalFor(10, 0.9) - 10) < 1e-9);
  assert.ok(Math.abs(retrievability(10, 10) - 0.9) < 1e-9);
  assert.ok(intervalFor(10, 0.95) < 10 && intervalFor(10, 0.85) > 10);
});

test("FSRS: yeni kartın ilk tekrarı yarın; başarılar aralığı büyütür, unutma küçültür", () => {
  const good = schedule(null, 3, T0, 0.9, { fuzz: false });
  assert.ok(good.due >= nextDayStart(T0) && good.due < nextDayStart(T0) + DAY);
  let p = good, t = p.due, last = 0;
  for (let i = 0; i < 6; i++) {
    const n = schedule(p, 3, t, 0.9, { fuzz: false });
    assert.ok(n.due - t > last, `aralık büyümeli (${i})`);
    last = n.due - t; p = n; t = n.due;
  }
  const lapse = schedule(p, 1, t, 0.9, { fuzz: false });
  assert.ok(lapse.s < p.s && lapse.lapses === 1 && lapse.due - t <= DAY);
});

test("Durum: bozuk ya da eski sürüm veri temiz duruma döner, eksik alanlar tamamlanır", () => {
  assert.equal(migrate(null).v, 2);
  assert.deepEqual(migrate({ v: 1, xp: 999 }).xp, 0);
  const m = migrate({ v: 2, xp: 50, settings: { goal: 60 } });
  assert.equal(m.xp, 50);
  assert.equal(m.settings.goal, 60);
  assert.equal(m.settings.retention, 0.9);
  assert.ok(m.owned.none);
});

test("İçerik: kartlar benzersiz, her ünite yolda, ders boyları 2–4", () => {
  assert.ok(CARDS.length > 0);
  assert.equal(new Set(CARDS.map((c) => c.id)).size, CARDS.length);
  for (const sec of PATH) {
    assert.ok(UNIT[sec.unit.id]);
    for (const l of sec.lessons) assert.ok(l.cards.length >= 2 && l.cards.length <= 4 || sec.cards.length < 2, `${l.id}: ${l.cards.length} kart`);
    assert.deepEqual(sec.lessons.flatMap((l) => l.cards), sec.cards);
  }
  assert.equal(NODES.length, PATH.reduce((a, s) => a + s.lessons.length + 1, 0));
});

test("Yol: ilk ders açık, sonrakiler sırayla açılır; ünite sınavı tacı verir", () => {
  let s = freshState();
  assert.equal(nodeStatus(s, NODES[0], T0), "open");
  if (NODES.length > 1) assert.equal(nodeStatus(s, NODES[1], T0), "locked");
  const r = finishLesson(s, T0, NODES[0], { ok: 9, bad: 1 });
  s = r.s;
  assert.equal(r.stars, 3);
  assert.ok(nodeUnlocked(s, NODES[1]));
  assert.equal(currentNode(s).id, NODES[1].id);
  const sec = PATH[0];
  const fail = finishTest(s, T0, sec.unit.id, { ok: 7, bad: 3 });
  assert.equal(fail.pass, false);
  const pass = finishTest(s, T0, sec.unit.id, { ok: 8, bad: 2 });
  assert.equal(pass.pass, true);
  assert.ok(pass.s.units[sec.unit.id].crown);
});

test("Atlama sınavı: %85 ile ünite dersleri tamamlanır, kartlar 'biliyor' olarak zamanlanır", () => {
  const sec = PATH[Math.min(1, PATH.length - 1)];
  const s0 = freshState();
  assert.equal(finishTest(s0, T0, sec.unit.id, { ok: 6, bad: 2 }, true).pass, false);
  const { s, pass } = finishTest(s0, T0, sec.unit.id, { ok: 7, bad: 1 }, true);
  assert.ok(pass);
  for (const l of sec.lessons) assert.ok(s.lessons[l.id].done);
  for (const id of sec.cards) { assert.ok(s.cards[id].reps >= 1); assert.equal(s.cards[id].k, 1); }
});

test("Karşılama: 'temelim sağlam' Pi’yi ilk IB dersine koyar", () => {
  const s = applyOnboarding(freshState(), { start: "good", onboarded: true });
  const n = currentNode(s);
  const firstIb = PATH.find((p) => p.track.id !== "temel");
  if (firstIb) assert.equal(n.unit, firstIb.unit.id);
  else assert.ok(n);
});

test("Günde kart başına yalnızca ilk cevap zamanlamayı değiştirir", () => {
  const id = CARDS[0].id;
  let s = gradeCard(freshState(), T0, id, 3, { isNew: true });
  const later = s.cards[id].due + 3600e3;
  s = gradeCard(s, later, id, 3);
  const due = s.cards[id].due;
  s = gradeCard(s, later + 60e3, id, 1);
  assert.equal(s.cards[id].due, due);
  assert.equal(s.days[dayKey(T0)].n, 1);
  assert.equal(memLevel(s.cards[id]) >= 1, true);
});

test("Tekrar listesi: vadesi gelenler, en zayıf önce", () => {
  let s = freshState();
  const a = CARDS[0].id, b = CARDS[1].id;
  s = gradeCard(s, T0, a, 3, { isNew: true });
  s = gradeCard(s, T0, b, 4, { isNew: true });
  assert.deepEqual(dueIds(s, T0), []);
  const ids = dueIds(s, T0 + 60 * DAY);
  assert.deepEqual(new Set(ids), new Set([a, b]));
  assert.equal(planReview(s, ids).length, 2);
});

test("Cevap kaydı: XP, doğru/yanlış sayacı ve geçmiş", () => {
  let s = freshState();
  const id = CARDS[0].id;
  s = logAnswer(s, T0, { cid: id, mode: "m", ok: true, xp: 5, combo: 3 });
  s = logAnswer(s, T0, { cid: id, mode: "a", ok: false, xp: 0 });
  const d = s.days[dayKey(T0)];
  assert.equal(d.ok, 1); assert.equal(d.bad, 1); assert.equal(d.xp, 5); assert.equal(d.combo, 3);
  assert.equal(s.xp, 5);
  assert.equal(s.cards[id].h.length, 2);
});

test("Seri: ardışık günler sayılır, dondurucu bir boş günü kurtarır", () => {
  let s = touchStreak(freshState(), T0);
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

test("Ders planı: her kart önce tanıtılır, sonunda bir kez 'hatırla' sorusu gelir", () => {
  for (const sec of PATH) for (const l of sec.lessons) {
    const steps = planLesson(l, rng(1));
    for (const id of l.cards) {
      const mine = steps.filter((x) => x.cid === id && x.kind === "learn");
      assert.equal(mine[0].mode, "i", `${id}: ilk adım tanıtım olmalı`);
      assert.equal(mine.filter((x) => x.mode === "f").length, 1, `${id}: tek 'hatırla'`);
      assert.ok(steps.indexOf(mine[0]) < steps.indexOf(mine.find((x) => x.mode === "f")));
    }
  }
  const t = planTest(PATH[0].cards, 10, rng(2));
  assert.equal(t.length, 10);
});

test("Seçenek üreticileri: doğru cevap tam bir kez", () => {
  const r = rng(7);
  for (const c of CARDS) {
    if (c.x.length) {
      const o = mcOptions(c, r);
      assert.equal(o.filter((x) => x.ok).length, 1, c.id);
      assert.equal(new Set(o.map((x) => x.v)).size, o.length, `${c.id}: aynı seçenek iki kez`);
      const tf = tfCandidate(c, r);
      assert.equal(tf.ok, tf.v === c.r);
    }
    assert.equal(nameOptions(c, r).filter((x) => x.ok).length, 1, c.id);
    if (c.q) assert.equal(whichOptions(c, r).filter((x) => x.ok).length, 1, c.id);
    if (c.t.length) {
      const q = termQuestion(c, r);
      assert.equal(q.opts.filter((x) => x.ok).length, 1, c.id);
      assert.equal(new Set(q.opts.map((x) => x.v)).size, q.opts.length, `${c.id}: terim seçenekleri tekrar ediyor`);
    }
    if (c.b) assert.equal(clozeBank(c, r).filter((x) => x.key.startsWith("b")).length, c.b.blanks.length);
    for (let i = 0; i < 5; i++) assert.ok("imtrzfawe".includes(reviewMode(c, { s: [1, 5, 40][i % 3] }, r)));
  }
  assert.ok(GLOSSARY.length > 0);
});

test("Günlük görevler: gün boyunca sabit, ilerleme gün sayaçlarından", () => {
  let s = freshState();
  const q = questsFor(s, T0);
  assert.equal(q.ids.length, 3);
  assert.equal(q.ids[0], "xp");
  assert.deepEqual(questsFor(s, T0 + 3600e3).ids, q.ids);
  s = logAnswer(s, T0, { cid: CARDS[0].id, mode: "m", ok: true, xp: 45 });
  assert.ok(questProgress(s, T0).find((x) => x.id === "xp").done);
});

test("BY_ID her kartı içerir", () => {
  for (const c of CARDS) assert.equal(BY_ID[c.id], c);
});

test("İnceleme: aynı gün tekrar oynanan ders kartın hafızasını şişirmez", () => {
  const id = CARDS[0].id;
  let s = gradeCard(freshState(), T0, id, 3, { isNew: true });
  const p1 = s.cards[id];
  for (let i = 1; i <= 5; i++) s = gradeCard(s, T0 + i * 600e3, id, 4, { isNew: true });
  assert.equal(s.cards[id].s, p1.s);
  assert.equal(s.cards[id].due, p1.due);
  assert.equal(s.days[dayKey(T0)].n, 1);
});

test("İnceleme: bugün 'Tekrar' denen kart bugün yeniden çalışılınca zamanlanır, liste temizlenir", () => {
  const id = CARDS[0].id;
  let s = gradeCard(freshState(), T0, id, 1, { isNew: true });
  const later = T0 + 11 * 3600e3;
  if (s.cards[id].due < nextDayStart(T0)) {
    assert.ok(dueIds(s, later).includes(id));
    s = gradeCard(s, later, id, 3);
    assert.ok(!dueIds(s, later).includes(id), "iyi cevaptan sonra listeden çıkmalı");
  }
});

test("İnceleme: atlama sınavı sonraki üniteyi açar ama taç vermez; ünite sınavı tekrarı küçük ödül", () => {
  if (PATH.length < 2) return;
  const sec = PATH[0], next = PATH[1];
  const j = finishTest(freshState(), T0, sec.unit.id, { ok: 8, bad: 0 }, true);
  assert.ok(j.pass && j.first);
  assert.ok(!j.s.units[sec.unit.id].crown);
  assert.ok(nodeUnlocked(j.s, next.lessons[0]));
  const a = finishTest(j.s, T0, sec.unit.id, { ok: 10, bad: 0 });
  assert.equal(a.dust, 40); assert.ok(a.first);
  const b = finishTest(a.s, T0, sec.unit.id, { ok: 10, bad: 0 });
  assert.ok(b.dust < 40); assert.ok(!b.first);
});
