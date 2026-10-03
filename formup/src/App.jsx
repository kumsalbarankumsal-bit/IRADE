/* FormUp v2: uygulama kabuğu. Durum, kalıcılık, sekmeler, dersler, oyunlar ve kutlamalar. */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Rocket, Sparkles, BookOpen, Gamepad2, User, Flame, Award } from "lucide-react";
import Path, { NodeSheet } from "./ui/Path.jsx";
import Sky from "./ui/Sky.jsx";
import Booklet from "./ui/Booklet.jsx";
import Arcade, { GameShell } from "./ui/Arcade.jsx";
import Profile from "./ui/Profile.jsx";
import Lesson from "./ui/Lesson.jsx";
import Detail from "./ui/Detail.jsx";
import Onboarding from "./ui/Onboarding.jsx";
import Pi from "./ui/Pi.jsx";
import { EnCtx, Cosmos, Burst, Sheet, Bi } from "./ui/common.jsx";
import {
  freshState, migrate, PATH, BY_ID, UNIT, dueIds, planLesson, planReview, planTest, planPractice, logAnswer, addXp, gradeCard,
  finishLesson, finishTest, touchStreak, shownStreak, questsFor, questProgress, achCtx, currentNode, applyOnboarding, today,
} from "./lib/learn.js";
import { readLocal, writeLocal, clearLocal, connectRemote, makeSaver } from "./lib/store.js";
import { rankOf, ACHIEVEMENTS } from "./data/v2/meta.js";
import { OUTFITS } from "./ui/Pi.jsx";
import { play } from "./lib/sound.js";

const TABS = [
  { id: "path", hash: "yol", tr: "Yol", en: "Path", icon: Rocket },
  { id: "sky", hash: "gokyuzu", tr: "Gökyüzü", en: "Sky", icon: Sparkles },
  { id: "book", hash: "kitapcik", tr: "Kitapçık", en: "Booklet", icon: BookOpen },
  { id: "arcade", hash: "oyun", tr: "Oyun", en: "Games", icon: Gamepad2 },
  { id: "profile", hash: "profil", tr: "Profil", en: "Me", icon: User },
];
const tabFromHash = () => {
  try { const h = window.location.hash.replace("#", ""); return (TABS.find((t) => t.hash === h) || TABS[0]).id; } catch (e) { return "path"; }
};
let planSeq = 0;

export default function App() {
  const bootLocal = useRef(undefined);
  if (bootLocal.current === undefined) bootLocal.current = readLocal();
  const [state, setState] = useState(() => migrate(bootLocal.current));
  const [now, setNow] = useState(Date.now());
  const [tab, setTabRaw] = useState(tabFromHash);
  const [session, setSession] = useState(null);
  const [game, setGame] = useState(null);
  const [detail, setDetail] = useState(null);
  const [nodeTarget, setNodeTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [burst, setBurst] = useState(0);
  const [celebrate, setCelebrate] = useState(null);
  const [storage, setStorage] = useState("local");
  const saverRef = useRef(null);
  const loadedRef = useRef(false);
  const rankRef = useRef(rankOf(state.xp).i);
  const goalRef = useRef(null);

  const update = useCallback((fn) => setState((prev) => ({ ...fn(prev), updatedAt: Date.now() })), []);
  const say = useCallback((msg, party = false) => { setToast({ msg, id: Date.now() }); if (party) setBurst(Date.now()); }, []);
  const S = state.settings;

  /* ---- kalıcılık: yerel kopya hemen, bulut gelince daha yeni olan kazanır ---- */
  useEffect(() => {
    let alive = true;
    (async () => {
      const remote = await connectRemote();
      if (!alive) return;
      if (remote) {
        setStorage(remote.kind);
        saverRef.current = makeSaver(remote, () => {});
        try {
          const r = await remote.load();
          const local = bootLocal.current;
          const localReal = local && local.v === 2 && local.settings && local.settings.onboarded;
          if (alive && r && r.v === 2 && (!localReal || (r.updatedAt || 0) > (local.updatedAt || 0))) {
            const m = migrate(r);
            rankRef.current = rankOf(m.xp).i;
            setState(m);
          } else if (localReal) saverRef.current(migrate(local));
        } catch (e) { /* yerel kopyayla devam */ }
      }
      loadedRef.current = true;
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line
  useEffect(() => {
    const t = setTimeout(() => writeLocal(state), 250);
    if (loadedRef.current && saverRef.current) saverRef.current(state);
    return () => clearTimeout(t);
  }, [state]);

  /* ---- saat ---- */
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 30000);
    const vis = () => { if (!document.hidden) setNow(Date.now()); };
    document.addEventListener("visibilitychange", vis);
    return () => { clearInterval(iv); document.removeEventListener("visibilitychange", vis); };
  }, []);
  useEffect(() => { if (!toast) return undefined; const t = setTimeout(() => setToast(null), 3600); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (!burst) return undefined; const t = setTimeout(() => setBurst(0), 3400); return () => clearTimeout(t); }, [burst]);

  /* ---- rozetler, rütbe ve günlük hedef ---- */
  useEffect(() => {
    if (!S.onboarded) return;
    const t = Date.now();
    const ctx = achCtx(state, t);
    const fresh = ACHIEVEMENTS.filter((a) => !state.ach[a.id] && a.check(state, ctx));
    if (fresh.length) {
      update((s) => ({ ...s, ach: { ...s.ach, ...Object.fromEntries(fresh.map((a) => [a.id, t])) }, dust: s.dust + 20 * fresh.length }));
      if (!session && !game) setCelebrate({ kind: "ach", list: fresh });
      else say(`Yeni rozet: ${fresh.map((a) => a.tr).join(", ")} (+${20 * fresh.length} ✦)`, true);
      play("level", S.sound);
    }
    const ri = rankOf(state.xp);
    if (ri.i > rankRef.current) {
      rankRef.current = ri.i;
      setCelebrate({ kind: "rank", rank: ri.cur });
      play("level", S.sound);
    } else rankRef.current = ri.i;
    const xpToday = today(state, t).xp || 0;
    if (goalRef.current != null && goalRef.current < S.goal && xpToday >= S.goal) {
      say("Günlük hedef tamam! · Daily goal done!", true);
    }
    goalRef.current = xpToday;
  }, [state.xp, state.cards, state.lessons, state.units, state.streak.best, state.stats, state.best, state.labsSeen]); // eslint-disable-line

  const setTab = (id) => {
    setTabRaw(id);
    try { window.history.replaceState(null, "", "#" + TABS.find((t) => t.id === id).hash); } catch (e) { /* yoksay */ }
    window.scrollTo({ top: 0 });
  };
  const setSettings = (patch) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));

  /* ---- oturumlar ---- */
  const open = (plan) => { setNodeTarget(null); setDetail(null); setSession({ ...plan, id: ++planSeq }); };
  const startNode = (t, st = state) => {
    if (t.kind === "lesson") {
      const n = t.node;
      open({ kind: "lesson", node: n, title: `${UNIT[n.unit].tr} · Ders ${n.k}`, steps: planLesson(n) });
    } else {
      const sec = PATH.find((p) => p.unit.id === t.unit);
      const jump = t.kind === "jump";
      open({ kind: t.kind, unit: t.unit, title: jump ? "Atlama sınavı" : "Ünite sınavı", steps: planTest(sec.cards, jump ? 8 : 10) });
    }
  };
  const startReview = () => {
    const ids = dueIds(state, Date.now()).slice(0, 30);
    if (!ids.length) { say("Şu an parlatılacak yıldız yok. · Nothing to review now."); return; }
    open({ kind: "review", title: "Yıldızları parlat", steps: planReview(state, ids) });
  };
  const studyOne = (id) => {
    const p = state.cards[id];
    if (p && p.reps) {
      const due = p.due <= Date.now() + 86400000;
      open({ kind: due ? "review" : "practice", title: due ? "Tekrar" : "Alıştırma", steps: due ? planReview(state, [id]) : planPractice(state, [id, id]) });
    } else {
      open({ kind: "single", title: BY_ID[id].n.replace(/\$/g, ""), steps: planLesson({ cards: [id] }) });
    }
  };

  const onAnswer = useCallback((r) => {
    const t = Date.now();
    update((s) => touchStreak(r.passive ? addXp(s, t, r.xp) : logAnswer(s, t, r), t));
  }, [update]);
  const onGrade = useCallback((cid, g, opts) => update((s) => gradeCard(s, Date.now(), cid, g, opts)), [update]);
  const onKnown = useCallback((cid) => update((s) => gradeCard(s, Date.now(), cid, 3, { isNew: true, known: true })), [update]);
  const onLab = useCallback((id) => update((s) => {
    const t = Date.now();
    const n = addXp(s, t, 2, 0, { labs: 1 });
    return { ...n, labsSeen: { ...n.labsSeen, [id]: n.labsSeen[id] || t } };
  }), [update]);

  const onFinish = (sum) => {
    const plan = session;
    setSession(null);
    if (!plan) return;
    const t = Date.now();
    const res = { ok: sum.ok, bad: sum.bad };
    if (sum.partial) { if (sum.ok + sum.bad > 0) update((s) => ({ ...s, stats: { ...s.stats, sessions: s.stats.sessions + 1 } })); return; }
    if (plan.kind === "lesson") {
      const out = finishLesson(state, t, plan.node, res);
      update((s) => {
        const r = finishLesson(s, t, plan.node, res);
        return { ...r.s, stats: { ...r.s.stats, sessions: r.s.stats.sessions + 1 } };
      });
      play("coin", S.sound);
      say(`+${out.dust} ✦ yıldız tozu${out.stars === 3 ? " · 3 yıldız!" : ""}`, out.stars === 3);
    } else if (plan.kind === "boss" || plan.kind === "jump") {
      const jump = plan.kind === "jump";
      const out = finishTest(state, t, plan.unit, res, jump);
      update((s) => {
        const r = finishTest(s, t, plan.unit, res, jump);
        return { ...r.s, stats: { ...r.s.stats, sessions: r.s.stats.sessions + 1 } };
      });
      if (out.pass) {
        setCelebrate({ kind: jump ? "jump" : "crown", unit: UNIT[plan.unit], dust: out.dust });
        play("level", S.sound);
      }
    } else {
      update((s) => ({ ...s, stats: { ...s.stats, sessions: s.stats.sessions + 1 } }));
    }
  };

  const onGameResult = (r) => {
    const t = Date.now();
    update((s) => {
      let n = addXp(s, t, r.xp || 0, r.dust || 0, { games: 1, apply: r.apply || 0 });
      n = touchStreak(n, t);
      const cards = { ...n.cards };
      for (const id of new Set(r.wrongIds || [])) {
        const p = cards[id];
        if (p && p.reps && !p.sus && p.due > t) cards[id] = { ...p, due: t };
      }
      return {
        ...n, cards,
        best: { ...n.best, ...(r.best || {}) },
        stats: { ...n.stats, games: n.stats.games + 1, trapsCaught: n.stats.trapsCaught + (r.trapsCaught || 0), terms: n.stats.terms + (r.termsRight || 0) },
      };
    });
    if (r.record) setBurst(Date.now());
  };

  /* ---- görevler ---- */
  const onClaim = (id) => {
    const t = Date.now();
    const q = questProgress(state, t).find((x) => x.id === id);
    if (!q || !q.done || q.claimed) return;
    update((s) => { const qs = questsFor(s, t); return { ...s, quests: { ...qs, claimed: { ...qs.claimed, [id]: t } }, dust: s.dust + 10 }; });
    play("coin", S.sound);
  };
  const onChest = () => {
    const t = Date.now();
    update((s) => { const qs = questsFor(s, t); return qs.chest ? s : { ...s, quests: { ...qs, chest: true }, dust: s.dust + 30 }; });
    play("level", S.sound);
    say("Sandıktan 30 ✦ çıktı! · +30 stardust", true);
  };

  /* ---- kartlar ---- */
  const resetCard = (id) => { update((s) => { const cards = { ...s.cards }; delete cards[id]; return { ...s, cards }; }); say("Formül sıfırlandı."); };
  const suspend = (id) => update((s) => { const p = s.cards[id] || {}; return { ...s, cards: { ...s.cards, [id]: { ...p, sus: !p.sus } } }; });

  /* ---- gardırop ---- */
  const onBuy = (oid) => {
    const o = OUTFITS.find((x) => x.id === oid);
    if (!o || state.dust < o.price || state.owned[oid]) return;
    update((s) => ({ ...s, dust: s.dust - o.price, owned: { ...s.owned, [oid]: true }, settings: { ...s.settings, outfit: oid } }));
    play("coin", S.sound);
    say(`Pi yeni ${o.tr.toLowerCase()} giydi!`, true);
  };
  const onWear = (oid) => setSettings({ outfit: oid });
  const onImport = (d) => { const m = migrate(d); rankRef.current = rankOf(m.xp).i; setState({ ...m, updatedAt: Date.now() }); say("Yedek yüklendi."); };
  const onResetAll = () => { clearLocal(); rankRef.current = 0; goalRef.current = null; setState({ ...freshState(), updatedAt: Date.now() }); setTab("path"); };

  const mode = S.theme === "light" ? "light" : "dark";
  useEffect(() => {
    try { document.documentElement.setAttribute("data-theme", mode); } catch (e) { /* yoksay */ }
  }, [mode]);

  if (!S.onboarded) {
    return (
      <EnCtx.Provider value={true}>
        <div className="fu" data-mode={mode} lang="tr">
          <Cosmos dark={mode === "dark"} />
          <div className="shell">
            <Onboarding state={state} onDone={(patch) => {
              const ns = { ...applyOnboarding(state, patch), updatedAt: Date.now() };
              setState(ns);
              const n = currentNode(ns);
              if (n && !n.boss) setTimeout(() => startNode({ kind: "lesson", node: n }, ns), 60);
            }} />
          </div>
        </div>
      </EnCtx.Provider>
    );
  }

  const due = dueIds(state, now).length;
  const st = shownStreak(state, now);

  return (
    <EnCtx.Provider value={S.showEn}>
      <div className="fu" data-mode={mode} lang="tr">
        <Cosmos dark={mode === "dark"} />
        <div className="shell">
          <header className="topbar">
            <button className="wordmark" onClick={() => setTab("path")} style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: "inherit" }} aria-label="FormUp: yola dön">
              Form<sup>up</sup>
            </button>
            <div className="row" style={{ gap: 6 }}>
              <button className={"pill en-toggle" + (S.showEn ? " on" : "")} onClick={() => setSettings({ showEn: !S.showEn })} aria-pressed={S.showEn} title="İngilizce satırları aç/kapat">EN</button>
              <span className={"pill flame" + (st.n ? "" : " cold") + (st.risk ? " risk" : "")} title={st.risk ? "Serin bugün tehlikede!" : "Günlük seri"}><Flame size={15} /> <span className="num">{st.n}</span></span>
              <button className="pill dust" onClick={() => setTab("profile")} title="Yıldız tozu: Pi’nin gardırobu"><Sparkles size={14} /> <span className="num">{state.dust}</span></button>
            </div>
          </header>

          <main>
            {tab === "path" && <Path state={state} now={now} openNode={setNodeTarget} startReview={startReview} onClaim={onClaim} onChest={onChest} />}
            {tab === "sky" && <Sky state={state} now={now} openCard={setDetail} startReview={startReview} />}
            {tab === "book" && <Booklet state={state} openCard={setDetail} />}
            {tab === "arcade" && <Arcade state={state} onPlay={setGame} />}
            {tab === "profile" && <Profile state={state} now={now} setSettings={setSettings} onBuy={onBuy} onWear={onWear} onImport={onImport} onResetAll={onResetAll} storage={storage} />}
          </main>
        </div>

        <nav className="nav" aria-label="Ana menü">
          <div className="nav-inner">
            {TABS.map((t) => {
              const I = t.icon;
              const badge = t.id === "path" ? due : 0;
              return (
                <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)} aria-current={tab === t.id ? "page" : undefined}>
                  <I size={21} />
                  <span>{t.tr}</span>
                  {badge > 0 && <span className="badge num">{badge > 99 ? "99+" : badge}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {nodeTarget && <NodeSheet state={state} now={now} target={nodeTarget} onStart={(t) => startNode(t)} onClose={() => setNodeTarget(null)} />}
        {detail && <Detail id={detail} state={state} now={now} onClose={() => setDetail(null)} onStudy={studyOne} onReset={resetCard} onSuspend={suspend} onLab={onLab} />}
        {session && (
          <Lesson key={session.id} state={state} plan={session} now={now}
            onAnswer={onAnswer} onGrade={onGrade} onKnown={onKnown} onFinish={onFinish} onClose={() => setSession(null)} onLab={onLab} />
        )}
        {game && <GameShell state={state} game={game} onExit={() => setGame(null)} onResult={onGameResult} />}
        {celebrate && !session && !game && <Celebrate c={celebrate} state={state} onClose={() => setCelebrate(null)} />}
        {toast && <div className="toast" role="status" key={"toast-" + toast.id}><Sparkles size={18} style={{ flex: "none", color: "var(--gold)" }} /> {toast.msg}</div>}
        {burst ? <Burst key={"burst-" + burst} /> : null}
      </div>
    </EnCtx.Provider>
  );
}

/** Büyük anlar: taç, atlama, yeni rütbe, rozet */
function Celebrate({ c, state, onClose }) {
  useEffect(() => { play("level", state.settings.sound); }, []); // eslint-disable-line
  let body;
  if (c.kind === "rank") {
    body = (
      <>
        <div className="rank-mono big" aria-hidden="true">{c.rank.mono}</div>
        <span className="eyebrow">Yeni rütbe · New rank</span>
        <div className="display" style={{ fontSize: 34 }}>{c.rank.tr}</div>
        {c.rank.en !== c.rank.tr && <div className="en">{c.rank.en}</div>}
        {c.rank.who && <p className="muted" style={{ margin: 0 }}>{c.rank.who} <span className="en">{c.rank.whoEn}</span></p>}
      </>
    );
  } else if (c.kind === "ach") {
    body = (
      <>
        <span className="eyebrow">Yeni rozet · New badge</span>
        {c.list.map((a) => (
          <div key={a.id} className="stack-sm" style={{ gap: 2 }}>
            <div className="display" style={{ fontSize: 28 }}><Award size={26} style={{ color: "var(--gold)", verticalAlign: -3 }} /> {a.tr}</div>
            <div className="en">{a.en}</div>
            <div className="small muted">{a.dtr}</div>
          </div>
        ))}
        <span className="tag gold" style={{ alignSelf: "center" }}>+{20 * c.list.length} ✦</span>
      </>
    );
  } else {
    body = (
      <>
        <span className="eyebrow">{c.unit.tr} · {c.unit.en}</span>
        <div className="display" style={{ fontSize: 32 }}>{c.kind === "jump" ? "Üniteyi atladın!" : "Taç senin!"}</div>
        <div className="en">{c.kind === "jump" ? "You tested out of the unit!" : "You won the crown!"}</div>
        <p className="small muted" style={{ margin: 0 }}>{c.kind === "jump" ? "Bu ünitenin formülleri tekrar takvimine “biliyor” olarak girdi." : "Ünitenin formülleri artık tam senin. Tekrarlar onları kalıcı yapacak."}</p>
        <span className="tag gold" style={{ alignSelf: "center" }}>+{c.dust} ✦</span>
      </>
    );
  }
  return (
    <Sheet onClose={onClose} label="Kutlama">
      <div className="stack celebrate" style={{ textAlign: "center", alignItems: "stretch" }}>
        <div className="row" style={{ justifyContent: "center" }}><Pi mood="party" outfit={state.settings.outfit} size={120} /></div>
        {body}
        <button className="btn gold lg block" onClick={onClose}>Harika! · Awesome!</button>
      </div>
      <Burst />
    </Sheet>
  );
}
