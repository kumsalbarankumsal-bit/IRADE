import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Home as HomeIcon, Compass, Map as MapIcon, Swords, User, Flame, Trophy, Sparkles } from "lucide-react";
import Home from "./ui/Home.jsx";
import Discover from "./ui/Discover.jsx";
import MapView from "./ui/MapView.jsx";
import Arena, { GameShell } from "./ui/Arena.jsx";
import Profile, { Editor, achievementCtx } from "./ui/Profile.jsx";
import Session from "./ui/Session.jsx";
import Detail from "./ui/Detail.jsx";
import Onboarding from "./ui/Onboarding.jsx";
import { Confetti } from "./ui/common.jsx";
import {
  freshState, migrate, dueIds, planLearn, planReview, planPractice, gradeCard, logAnswer, touchStreak,
  shownStreak, getF, allFormulas, learnedIds, newLeftToday,
} from "./lib/srs.js";
import { readLocal, writeLocal, connectRemote, makeSaver } from "./lib/store.js";
import { rankOf, ACHIEVEMENTS } from "./data/ranks.js";
import { dayKey, shuffle } from "./lib/util.js";
import { play } from "./lib/sound.js";

const TABS = [
  { id: "home", hash: "bugun", label: "Bugün", icon: HomeIcon },
  { id: "discover", hash: "kesfet", label: "Keşfet", icon: Compass },
  { id: "map", hash: "harita", label: "Harita", icon: MapIcon },
  { id: "arena", hash: "arena", label: "Arena", icon: Swords },
  { id: "profile", hash: "profil", label: "Profil", icon: User },
];
const tabFromHash = () => {
  try { const h = window.location.hash.replace("#", ""); return (TABS.find((t) => t.hash === h) || TABS[0]).id; } catch (e) { return "home"; }
};

export default function App() {
  const bootLocal = useRef(undefined);
  if (bootLocal.current === undefined) bootLocal.current = readLocal();
  const [state, setState] = useState(() => migrate(bootLocal.current));
  const [now, setNow] = useState(Date.now());
  const [tab, setTabRaw] = useState(tabFromHash);
  const [session, setSession] = useState(null);
  const [game, setGame] = useState(null);
  const [detail, setDetail] = useState(null);
  const [editor, setEditor] = useState(null);
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(0);
  const [storage, setStorage] = useState("local");
  const saverRef = useRef(null);
  const loadedRef = useRef(false);
  const rankRef = useRef(rankOf(state.xp).i);

  const update = useCallback((fn) => setState((prev) => ({ ...fn(prev), updatedAt: Date.now() })), []);
  const say = useCallback((msg, celebrate = false) => { setToast({ msg, id: Date.now() }); if (celebrate) setConfetti(Date.now()); }, []);

  /* ---- kalıcılık ---- */
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
          const localReal = local && local.settings && local.settings.onboarded;
          if (r && (!localReal || (r.updatedAt || 0) > (local.updatedAt || 0))) {
            setState(migrate(r));
          } else if (localReal) {
            saverRef.current(migrate(local));
          }
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
  useEffect(() => { if (!toast) return undefined; const t = setTimeout(() => setToast(null), 3400); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (!confetti) return undefined; const t = setTimeout(() => setConfetti(0), 3200); return () => clearTimeout(t); }, [confetti]);

  /* ---- rozet ve rütbe ---- */
  useEffect(() => {
    const ctx = achievementCtx(state, Date.now());
    const fresh = ACHIEVEMENTS.filter((a) => !state.ach[a.id] && a.check(state, ctx));
    if (fresh.length) {
      update((s) => ({ ...s, ach: { ...s.ach, ...Object.fromEntries(fresh.map((a) => [a.id, Date.now()])) }, xp: s.xp + 25 * fresh.length }));
      say(`Yeni rozet: ${fresh.map((a) => a.name).join(", ")} (+${25 * fresh.length} XP)`, true);
      play("level", state.settings.sound);
    }
    const ri = rankOf(state.xp);
    if (ri.i > rankRef.current) {
      rankRef.current = ri.i;
      say(`Yeni rütbe: ${ri.cur.name}!`, true);
      play("level", state.settings.sound);
    } else rankRef.current = ri.i;
  }, [state.xp, state.cards, state.streak.best, state.stats, state.best, state.custom]); // eslint-disable-line

  const setTab = (id) => {
    setTabRaw(id);
    try { window.history.replaceState(null, "", "#" + TABS.find((t) => t.id === id).hash); } catch (e) { /* yoksay */ }
    window.scrollTo({ top: 0 });
  };

  /* ---- oturumlar ---- */
  const startReview = () => {
    const ids = dueIds(state, Date.now()).slice(0, 40);
    if (!ids.length) { say("Şu an tekrar edilecek formül yok."); return; }
    setSession({ title: "Tekrar", kind: "review", steps: planReview(state, ids) });
  };
  const startLearn = () => {
    const ids = state.queue.slice(0, state.settings.batch);
    if (!ids.length) { setTab("discover"); return; }
    if (newLeftToday(state, Date.now()) <= 0) say("Günlük yeni formül hedefini geçtin; yine de devam ediyoruz.");
    setSession({ title: "Yeni formüller", kind: "learn", steps: planLearn(ids, state.settings) });
  };
  const startFocus = (ids) => setSession({ title: "Odak turu", kind: "practice", steps: planPractice(state, ids.concat(ids)) });
  const startTopicTest = (topic) => {
    const fs = allFormulas(state).filter((f) => f.t === topic);
    const learned = fs.filter((f) => state.cards[f.id] && state.cards[f.id].reps);
    const src = learned.length >= 5 ? learned : fs;
    const ids = shuffle(src).slice(0, 10).map((f) => f.id);
    setSession({ title: "Konu testi", kind: "practice", steps: planPractice(state, ids) });
  };
  const studyOne = (id) => {
    setDetail(null);
    const p = state.cards[id];
    if (p && p.reps) {
      const due = p.due <= Date.now() + 86400000;
      setSession({ title: due ? "Tekrar" : "Alıştırma", kind: due ? "review" : "practice", steps: due ? planReview(state, [id]) : planPractice(state, [id, id]) });
    } else {
      setSession({ title: "Yeni formül", kind: "learn", steps: planLearn([id], state.settings) });
    }
  };

  const onAnswer = useCallback(({ cid, mode, ok, ms, xp, grade, trapCaught, passive }) => {
    const t = Date.now();
    update((s) => {
      if (passive) {
        const k = dayKey(t);
        const d = s.days[k] || { r: 0, n: 0, ok: 0, bad: 0, xp: 0, ms: 0 };
        return { ...s, xp: s.xp + xp, days: { ...s.days, [k]: { ...d, xp: d.xp + xp } } };
      }
      let n = logAnswer(s, t, { cid, mode, ok, ms, xp, grade });
      if (trapCaught) n = { ...n, stats: { ...n.stats, trapsCaught: n.stats.trapsCaught + 1 } };
      return n;
    });
  }, [update]);
  const onGrade = useCallback((cid, grade, opts) => update((s) => gradeCard(s, Date.now(), cid, grade, opts)), [update]);
  const onFinish = (sum) => {
    const answered = sum.ok + sum.bad;
    update((s) => {
      let n = answered > 0 ? touchStreak(s, Date.now()) : s;
      return { ...n, stats: { ...n.stats, sessions: n.stats.sessions + 1, perfect: n.stats.perfect + (!sum.partial && sum.bad === 0 && sum.ok >= 10 ? 1 : 0) } };
    });
    setSession(null);
    if (!sum.partial && answered && sum.ok / answered >= 0.8) setConfetti(Date.now());
    if (sum.learned) say(`${sum.learned} yeni formül hafızana yerleşti. İlk tekrar yarın.`);
  };

  /* ---- keşfet ---- */
  const onLearn = (id) => {
    let len = 0;
    update((s) => { const queue = s.queue.includes(id) ? s.queue : [...s.queue, id]; len = queue.length; return { ...s, queue }; });
    const b = state.settings.batch;
    if (state.queue.length + 1 === b) say(`${b} formül hazır! “Öğren” ile derse başla.`);
  };
  const onKnown = (id) => {
    update((s) => {
      const n = gradeCard(s, Date.now(), id, 4, { isNew: true, known: true, noCount: true });
      return logAnswer(n, Date.now(), { cid: id, mode: "k", ok: true, xp: 3, grade: 4 });
    });
    say("Kanıtladın! Bu formülü uzun aralıkla kontrol edeceğim.");
  };
  const onKnownFail = (id) => {
    update((s) => {
      const n = logAnswer(s, Date.now(), { cid: id, mode: "k", ok: false, xp: 0, grade: 1 });
      return { ...n, queue: n.queue.includes(id) ? n.queue : [...n.queue, id] };
    });
    say("Tam oturmamış; öğrenme listene ekledim.");
  };
  const onSkip = (id) => update((s) => ({ ...s, skipped: { ...s.skipped, [id]: Date.now() } }));
  const addToQueue = (id) => { update((s) => ({ ...s, queue: s.queue.includes(id) ? s.queue : [...s.queue, id] })); say("Öğrenme listesine eklendi."); };

  /* ---- oyunlar ---- */
  const onGameResult = (r) => {
    const t = Date.now();
    update((s) => {
      const cards = { ...s.cards };
      for (const id of new Set(r.wrongIds || [])) {
        const p = cards[id];
        if (p && p.reps && p.due > t) cards[id] = { ...p, due: t };
      }
      const k = dayKey(t);
      const d = s.days[k] || { r: 0, n: 0, ok: 0, bad: 0, xp: 0, ms: 0 };
      const n = touchStreak({ ...s, cards }, t);
      return {
        ...n, xp: s.xp + r.xp, best: { ...s.best, ...(r.best || {}) },
        days: { ...s.days, [k]: { ...d, xp: d.xp + r.xp } },
        stats: { ...s.stats, games: s.stats.games + 1, trapsCaught: s.stats.trapsCaught + (r.trapsCaught || 0) },
      };
    });
    if (r.record) setConfetti(Date.now());
  };

  /* ---- ayarlar, kendi formüller ---- */
  const setSettings = (patch) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  const saveCustom = (f) => {
    if (editor && editor.initial) {
      update((s) => ({ ...s, custom: s.custom.map((c) => (c.id === editor.initial.id ? { ...c, ...f } : c)) }));
      say("Formül güncellendi.");
    } else {
      const id = "oz-" + Date.now().toString(36);
      update((s) => ({ ...s, custom: [...s.custom, { ...f, id, t: "ozel", lv: "custom", p: 0 }], queue: [...s.queue, id] }));
      say("Formülün eklendi ve öğrenme listesine girdi.");
    }
    setEditor(null);
  };
  const deleteCustom = (id) => {
    update((s) => { const cards = { ...s.cards }; delete cards[id]; return { ...s, custom: s.custom.filter((c) => c.id !== id), cards, queue: s.queue.filter((x) => x !== id) }; });
    setDetail(null);
  };
  const resetCard = (id) => { update((s) => { const cards = { ...s.cards }; delete cards[id]; return { ...s, cards }; }); say("Formül sıfırlandı."); };
  const suspend = (id) => update((s) => ({ ...s, cards: { ...s.cards, [id]: { ...(s.cards[id] || {}), sus: s.cards[id] && s.cards[id].sus ? 0 : 1 } } }));
  const onImport = (d) => { setState({ ...migrate(d), updatedAt: Date.now() }); say("Yedek geri yüklendi."); };
  const onResetAll = () => {
    update((s) => ({ ...freshState(), settings: { ...s.settings } }));
    say("Tüm ilerleme sıfırlandı.");
  };

  const s = state.settings;
  const mode = s.theme === "auto" ? undefined : s.theme;
  const due = useMemo(() => dueIds(state, now).length, [state.cards, now]); // eslint-disable-line
  const st = shownStreak(state, now);
  const rank = rankOf(state.xp);

  if (!s.onboarded) {
    return (
      <div className="fu" data-mode={mode}>
        <Onboarding initial={s} onDone={(patch) => { setSettings(patch); setTab("discover"); }} />
      </div>
    );
  }

  return (
    <div className="fu" data-mode={mode}>
      <div className="shell">
        <header className="topbar">
          <button className="wordmark" onClick={() => setTab("home")} style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }} aria-label="FormUp ana sayfa">
            Form<sup>up</sup>
          </button>
          <div className="chips-row">
            <span className={"pill flame" + (st.n ? "" : " cold")} title="Günlük seri"><Flame size={15} /> <span className="num">{st.n}</span></span>
            <button className="pill" onClick={() => setTab("profile")} style={{ cursor: "pointer" }} title={`${rank.cur.name} · ${state.xp} XP`}>
              <Trophy size={14} style={{ color: "var(--amber)" }} /> <span className="num">{state.xp}</span>
            </button>
          </div>
        </header>

        <main>
          {tab === "home" && (
            <Home state={state} now={now} startReview={startReview} startLearn={startLearn} startFocus={startFocus}
              goDiscover={() => setTab("discover")} openDetail={setDetail} addToQueue={addToQueue} goArena={() => setTab("arena")} />
          )}
          {tab === "discover" && (
            <Discover state={state} now={now} onLearn={onLearn} onKnown={onKnown} onKnownFail={onKnownFail} onSkip={onSkip} startLearn={startLearn} toast={say} />
          )}
          {tab === "map" && <MapView state={state} now={now} openDetail={setDetail} startTopicTest={startTopicTest} openEditor={() => setEditor({})} />}
          {tab === "arena" && <Arena state={state} onPlay={setGame} />}
          {tab === "profile" && (
            <Profile state={state} now={now} setSettings={setSettings} openEditor={() => setEditor({})} onImport={onImport} onResetAll={onResetAll} storage={storage} />
          )}
        </main>
      </div>

      <nav className="nav" aria-label="Ana menü">
        <div className="nav-inner">
          {TABS.map((t) => {
            const I = t.icon;
            const badge = t.id === "home" ? due : t.id === "discover" ? state.queue.length : 0;
            return (
              <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)} aria-current={tab === t.id ? "page" : undefined}>
                <I size={21} />
                {t.label}
                {badge > 0 && <span className="badge num">{badge > 99 ? "99+" : badge}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {detail && (
        <Detail id={detail} state={state} now={now} onClose={() => setDetail(null)} onStudy={studyOne} onQueue={(id) => addToQueue(id)}
          onReset={resetCard} onSuspend={suspend} onDeleteCustom={deleteCustom} onEditCustom={(id) => { setDetail(null); setEditor({ initial: getF(state, id) }); }} />
      )}
      {editor && <Editor initial={editor.initial} onSave={saveCustom} onClose={() => setEditor(null)} />}
      {session && (
        <Session key={session.title + session.steps.length + (session.steps[0] && session.steps[0].uid)} state={state} plan={session} now={now}
          onAnswer={onAnswer} onGrade={onGrade} onFinish={onFinish} onClose={() => setSession(null)} />
      )}
      {game && <GameShell state={state} game={game} onExit={() => setGame(null)} onResult={onGameResult} />}
      {toast && <div className="toast" role="status" key={toast.id}><Sparkles size={18} style={{ flex: "none", color: "var(--amber)" }} /> {toast.msg}</div>}
      {confetti ? <Confetti key={confetti} /> : null}
    </div>
  );
}
