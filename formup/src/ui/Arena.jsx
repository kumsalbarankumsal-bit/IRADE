import React, { useEffect, useMemo, useRef, useState } from "react";
import { Zap, Puzzle, ShieldAlert, Calculator, X, Check, Trophy, RotateCcw, Timer, ArrowRight } from "lucide-react";
import { Formula, Field, Tex, Rich } from "../lib/tex.jsx";
import { learnedIds, pool, getF, tfCandidate } from "../lib/srs.js";
import { GEN, isCorrect } from "../data/generators.js";
import { shuffle, pick, rng } from "../lib/util.js";
import { play } from "../lib/sound.js";
import { vibrate } from "../lib/util.js";
import { Keypad } from "./Session.jsx";

const GAMES = [
  { id: "speed", name: "Hız Turu", icon: Zap, color: "var(--amber)", soft: "var(--amber-soft)", desc: "60 saniye: formül doğru mu, yanlış mı? Hata 3 saniye götürür.", best: (b) => (b.speed ? `Rekor: ${b.speed} puan` : "Henüz oynanmadı") },
  { id: "match", name: "Eşleştir", icon: Puzzle, color: "var(--accent)", soft: "var(--accent-soft)", desc: "Sol tarafları sağ taraflarıyla en hızlı şekilde eşle.", best: (b) => (b.match ? `Rekor: ${(b.match / 1000).toFixed(1).replace(".", ",")} sn` : "Henüz oynanmadı") },
  { id: "trap", name: "Tuzak Avı", icon: ShieldAlert, color: "var(--red)", soft: "var(--red-soft)", desc: "Dört formülden biri yanlış yazılmış. Tuzağı bul.", best: (b) => (b.trap ? `Rekor: ${b.trap}/10` : "Henüz oynanmadı") },
  { id: "lab", name: "Sayı Atölyesi", icon: Calculator, color: "var(--green)", soft: "var(--green-soft)", desc: "Formülü gerçek bir soruda kullan: 10 sayısal soru.", best: (b) => (b.lab ? `Rekor: ${b.lab}/10` : "Henüz oynanmadı") },
];

/** Oyun havuzu: öğrenilen formüller yeterliyse onlar, değilse en önemliler */
function gamePool(state, need = 8, filter = () => true) {
  const learned = learnedIds(state).map((id) => getF(state, id)).filter(filter);
  if (learned.length >= need) return { list: learned, practice: false };
  const extra = pool(state).filter(filter).slice(0, 60);
  const ids = new Set(learned.map((f) => f.id));
  return { list: learned.concat(extra.filter((f) => !ids.has(f.id))), practice: true };
}

export default function Arena({ state, onPlay }) {
  const learned = learnedIds(state).length;
  return (
    <div className="stack fade-in">
      <div>
        <div className="eyebrow">Arena</div>
        <h1 className="h2">Oynayarak pekiştir</h1>
        <p className="small muted" style={{ margin: "6px 0 0" }}>
          {learned >= 8 ? `Oyunlar öğrendiğin ${learned} formülden gelir. Yanlış yaptıkların tekrar listene öne alınır.` : "Henüz az formül öğrendin; oyunlar en önemli formüllerden de soru sorar."}
        </p>
      </div>
      <div className="games">
        {GAMES.map((g) => {
          const I = g.icon;
          return (
            <button key={g.id} className="game" onClick={() => onPlay(g.id)}>
              <span className="gi" style={{ background: g.soft, color: g.color }}><I size={22} /></span>
              <span className="h3">{g.name}</span>
              <span className="small muted" style={{ lineHeight: 1.35 }}>{g.desc}</span>
              <span className="best"><Trophy size={13} style={{ verticalAlign: -2 }} /> {g.best(state.best)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Oyun kabuğu ---------------- */
export function GameShell({ state, game, onExit, onResult }) {
  const [round, setRound] = useState(0);
  const [result, setResult] = useState(null);
  const G = GAMES.find((g) => g.id === game);
  const finish = (r) => { setResult(r); onResult({ game, ...r }); };
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onExit(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onExit]);
  return (
    <div className="overlay fu" data-mode={state.settings.theme === "auto" ? undefined : state.settings.theme} role="dialog" aria-modal="true" aria-label={G.name}>
      <div className="ov-top">
        <button className="icon-btn plain" onClick={onExit} aria-label="Oyundan çık"><X size={22} /></button>
        <span className="h3 grow">{G.name}</span>
      </div>
      <div className="ov-body">
        <div className="ov-inner">
          {result ? (
            <Result G={G} result={result} state={state} onAgain={() => { setResult(null); setRound((r) => r + 1); }} onExit={onExit} />
          ) : game === "speed" ? <SpeedGame key={round} state={state} onEnd={finish} />
            : game === "match" ? <MatchGame key={round} state={state} onEnd={finish} />
            : game === "trap" ? <TrapGame key={round} state={state} onEnd={finish} />
            : <LabGame key={round} state={state} onEnd={finish} />}
        </div>
      </div>
    </div>
  );
}

function Result({ G, result, state, onAgain, onExit }) {
  const isRecord = result.record;
  return (
    <div className="stack fade-in" style={{ paddingTop: 20, textAlign: "center" }}>
      <div className="eyebrow">{G.name} bitti</div>
      <div className="big-score">{result.display}</div>
      {isRecord && <div className="hand" style={{ color: "var(--amber)", fontSize: 32 }}>Yeni rekor!</div>}
      <div className="row" style={{ justifyContent: "center", gap: 8 }}>
        <span className="tag amber">+{result.xp} XP</span>
        {result.wrongIds && result.wrongIds.length > 0 && <span className="tag red">{result.wrongIds.length} hata tekrara eklendi</span>}
      </div>
      {result.wrongIds && result.wrongIds.length > 0 && (
        <div className="card" style={{ textAlign: "left" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Doğruları</div>
          <div className="stack-sm">
            {[...new Set(result.wrongIds)].slice(0, 6).map((id) => {
              const f = getF(state, id);
              return f ? <div key={id}><div className="tiny faint" style={{ fontWeight: 750 }}><Rich text={f.n} /></div><div className="formula-box" style={{ textAlign: "left" }}><Formula f={f} size="sm" /></div></div> : null;
            })}
          </div>
        </div>
      )}
      <div className="row">
        <button className="btn soft lg grow" onClick={onExit}>Arena</button>
        <button className="btn primary lg grow" onClick={onAgain}><RotateCcw size={18} /> Tekrar oyna</button>
      </div>
    </div>
  );
}

/* ---------------- Hız Turu ---------------- */
function SpeedGame({ state, onEnd }) {
  const { list } = useMemo(() => gamePool(state, 8, (f) => f.x && f.x.length), []); // eslint-disable-line
  const r = useRef(rng(Date.now())).current;
  const mk = () => { const f = pick(list, r); return { f, cand: tfCandidate(f, r) }; };
  const [q, setQ] = useState(mk);
  const [left, setLeft] = useState(60000);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const wrong = useRef([]);
  const ended = useRef(false);
  const traps = useRef(0);
  const penalty = useRef(0);
  useEffect(() => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      const l = 60000 - (Date.now() - t0) - penalty.current;
      setLeft(l);
      if (l <= 0 && !ended.current) {
        ended.current = true;
        clearInterval(iv);
      }
    }, 100);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    if (left <= 0) {
      const best = state.best.speed || 0;
      onEnd({ score, display: `${score}`, xp: score * 2, wrongIds: wrong.current, record: score > best, best: { speed: Math.max(best, score) }, trapsCaught: traps.current });
    }
  }, [left <= 0]); // eslint-disable-line
  const answer = (saysTrue) => {
    if (left <= 0) return;
    const ok = saysTrue === q.cand.ok;
    if (ok) { setScore((s) => s + 1); if (!q.cand.ok) traps.current++; }
    else { wrong.current.push(q.f.id); penalty.current += 3000; }
    play(ok ? "correct" : "wrong", state.settings.sound);
    vibrate(ok ? 8 : [25, 30, 25], state.settings.haptics);
    setFlash(ok ? "ok" : "no");
    setTimeout(() => setFlash(null), 250);
    setQ(mk());
  };
  useEffect(() => {
    const k = (e) => { if (e.key === "ArrowLeft") answer(false); if (e.key === "ArrowRight") answer(true); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  return (
    <>
      <div className="row between">
        <span className="row" style={{ gap: 6, fontWeight: 800 }}><Timer size={18} /> <span className="num">{Math.max(0, Math.ceil(left / 1000))} sn</span></span>
        <span className="display num" style={{ fontSize: 28 }}>{score}</span>
      </div>
      <div className="timer"><span style={{ width: `${Math.max(0, left / 600)}%` }} /></div>
      <div className="index-card q-card" style={{ outline: flash ? `3px solid ${flash === "ok" ? "var(--green)" : "var(--red)"}` : "none" }}>
        <div className="card-head"><span className="mode-label"><Zap size={15} /> Doğru mu?</span></div>
        <div className="qbody">
          <div className="q-name"><Rich text={q.f.n} /></div>
          <div className="formula-box"><Formula f={q.f} rhs={q.cand.v} size="auto" /></div>
          {q.f.k && <div className="small muted" style={{ textAlign: "center" }}><Rich text={q.f.k} /></div>}
        </div>
      </div>
      <div className="spacer" />
      <div className="tf">
        <button className="btn bad lg" onClick={() => answer(false)}><X size={20} /> Yanlış</button>
        <button className="btn good lg" onClick={() => answer(true)}><Check size={20} /> Doğru</button>
      </div>
      <p className="tiny faint" style={{ textAlign: "center", margin: 0 }}>Klavyede ← yanlış, → doğru</p>
    </>
  );
}

/* ---------------- Eşleştir ---------------- */
// Tek harfli sol taraflar (A, V, t…) tek başına anlamsız; onların yerine formülün adı gösterilir.
const informative = (l) => !l.startsWith("~") && l.replace(/\\[a-zA-Z]+|[{}\s^_]/g, "").length >= 4;
function MatchGame({ state, onEnd }) {
  const pairs = useMemo(() => {
    const ok = (f) => f.l.length < 46 && f.r.length < 64 && !f.r.startsWith("~");
    const { list } = gamePool(state, 8, ok);
    const r = rng(Date.now());
    const seenL = new Set(), seenR = new Set(), out = [];
    for (const f of shuffle(list, r)) {
      if (seenL.has(f.l) || seenR.has(f.r)) continue;
      seenL.add(f.l); seenR.add(f.r); out.push(f);
      if (out.length === 6) break;
    }
    return { items: out, L: shuffle(out, r), R: shuffle(out, r) };
  }, []); // eslint-disable-line
  const [sel, setSel] = useState(null); // { side, id }
  const [done, setDone] = useState(new Set());
  const [err, setErr] = useState(null);
  const [mist, setMist] = useState(0);
  const wrong = useRef([]);
  const t0 = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const iv = setInterval(() => setNow(Date.now()), 200); return () => clearInterval(iv); }, []);
  useEffect(() => {
    if (pairs.items.length && done.size === pairs.items.length) {
      const ms = Date.now() - t0.current + mist * 3000;
      const best = state.best.match || 0;
      onEnd({ display: `${(ms / 1000).toFixed(1).replace(".", ",")} sn`, xp: Math.max(5, 30 - mist * 3), wrongIds: wrong.current, record: !best || ms < best, best: { match: best ? Math.min(best, ms) : ms } });
    }
  }, [done]); // eslint-disable-line
  const tap = (side, id) => {
    if (done.has(id)) return;
    if (!sel || sel.side === side) { setSel({ side, id }); return; }
    if (sel.id === id) {
      setDone(new Set([...done, id])); setSel(null);
      play("correct", state.settings.sound); vibrate(8, state.settings.haptics);
    } else {
      setErr(`${side}:${id}`); setMist((m) => m + 1); wrong.current.push(id, sel.id); setSel(null);
      play("wrong", state.settings.sound); vibrate([25, 30, 25], state.settings.haptics);
      setTimeout(() => setErr(null), 350);
    }
  };
  if (pairs.items.length < 3) return <p className="muted">Eşleştirme için yeterli formül yok. Önce birkaç formül öğren.</p>;
  return (
    <>
      <div className="row between">
        <span className="row" style={{ gap: 6, fontWeight: 800 }}><Timer size={18} /><span className="num">{((now - t0.current) / 1000).toFixed(1).replace(".", ",")} sn</span></span>
        <span className="small muted">{mist ? `${mist} hata (+${mist * 3} sn)` : "Sol ↔ sağ"}</span>
      </div>
      <div className="match-grid">
        <div className="stack-sm">
          {pairs.L.map((f) => (
            <button key={f.id} className={"mcell" + (sel && sel.side === "L" && sel.id === f.id ? " sel" : "") + (done.has(f.id) ? " done" : "") + (err === `L:${f.id}` ? " err" : "")} onClick={() => tap("L", f.id)}>
              {informative(f.l) ? <Field v={f.l} /> : <span style={{ fontWeight: 700, fontSize: 13.5 }}><Rich text={f.n} /></span>}
            </button>
          ))}
        </div>
        <div className="stack-sm">
          {pairs.R.map((f) => (
            <button key={f.id} className={"mcell" + (sel && sel.side === "R" && sel.id === f.id ? " sel" : "") + (done.has(f.id) ? " done" : "") + (err === `R:${f.id}` ? " err" : "")} onClick={() => tap("R", f.id)}>
              <Field v={f.r} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------- Tuzak Avı ---------------- */
function TrapGame({ state, onEnd }) {
  const rounds = useMemo(() => {
    const { list } = gamePool(state, 8, (f) => f.x && f.x.length && !f.r.startsWith("~") && f.r.length < 90);
    const r = rng(Date.now());
    return Array.from({ length: 10 }, () => {
      const four = shuffle(list, r).slice(0, 4);
      const bad = Math.floor(r() * four.length);
      return four.map((f, i) => ({ f, v: i === bad ? pick(f.x.filter((x) => !x.startsWith("~")).concat([f.x[0]]), r) : f.r, trap: i === bad }));
    });
  }, []); // eslint-disable-line
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const wrong = useRef([]);
  const cur = rounds[i];
  const choose = (k) => {
    if (picked != null) return;
    setPicked(k);
    const ok = cur[k].trap;
    if (ok) setScore((s) => s + 1);
    else wrong.current.push(cur.find((c) => c.trap).f.id);
    play(ok ? "correct" : "wrong", state.settings.sound);
    vibrate(ok ? 10 : [25, 30, 25], state.settings.haptics);
  };
  const next = () => {
    if (i + 1 >= rounds.length) {
      const best = state.best.trap || 0;
      onEnd({ display: `${score}/10`, xp: score * 3, wrongIds: wrong.current, record: score > best, best: { trap: Math.max(best, score) }, trapsCaught: score });
    } else { setI(i + 1); setPicked(null); }
  };
  useEffect(() => {
    const k = (e) => {
      const n = Number(e.key);
      if (picked == null && n >= 1 && n <= 4) choose(n - 1);
      else if (picked != null && (e.key === "Enter" || e.key === " ")) next();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  if (!cur || cur.length < 4) return <p className="muted">Bu oyun için yeterli formül yok.</p>;
  return (
    <>
      <div className="row between"><span className="eyebrow">Tur {i + 1}/10</span><span className="display num" style={{ fontSize: 26 }}>{score}</span></div>
      <h2 className="h3" style={{ textAlign: "center" }}>Hangisi yanlış yazılmış?</h2>
      <div className="options">
        {cur.map((c, k) => {
          const cls = picked == null ? "" : c.trap ? " right" : k === picked ? " wrong" : " dim";
          return (
            <button key={k} className={"opt" + cls} onClick={() => choose(k)} disabled={picked != null}>
              <span className="k">{k + 1}</span>
              <span className="o">
                <span className="tiny faint" style={{ display: "block", fontWeight: 750 }}><Rich text={c.f.n} /></span>
                <Formula f={c.f} rhs={c.v} size="sm" />
              </span>
            </button>
          );
        })}
      </div>
      {picked != null && (
        <div className={"feedback " + (cur[picked].trap ? "ok" : "no")}>
          <span className="verdict">{cur[picked].trap ? "Yakaladın!" : "Tuzak başkaydı"}</span>
          {(() => { const t = cur.find((c) => c.trap); return <div className="formula-box" style={{ background: "var(--surface)", borderRadius: 12, padding: 8 }}><Formula f={t.f} size="sm" /></div>; })()}
          <button className="btn primary block" onClick={next}>{i + 1 >= rounds.length ? "Sonuç" : "Sonraki"} <ArrowRight size={18} /></button>
        </div>
      )}
    </>
  );
}

/* ---------------- Sayı Atölyesi ---------------- */
function LabGame({ state, onEnd }) {
  const qs = useMemo(() => {
    const { list } = gamePool(state, 6, (f) => f.g && GEN[f.g]);
    const r = rng(Date.now());
    const chosen = shuffle(list, r).slice(0, 10);
    while (chosen.length < 10 && list.length) chosen.push(pick(list, r));
    return chosen.map((f) => ({ f, gen: GEN[f.g](r) }));
  }, []); // eslint-disable-line
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [res, setRes] = useState(null);
  const [score, setScore] = useState(0);
  const wrong = useRef([]);
  const cur = qs[i];
  const submit = () => {
    if (res || !val.trim()) return;
    const ok = isCorrect(val, cur.gen);
    setRes({ ok });
    if (ok) setScore((s) => s + 1); else wrong.current.push(cur.f.id);
    play(ok ? "correct" : "wrong", state.settings.sound);
    vibrate(ok ? 10 : [25, 30, 25], state.settings.haptics);
  };
  const next = () => {
    if (i + 1 >= qs.length) {
      const best = state.best.lab || 0;
      onEnd({ display: `${score}/${qs.length}`, xp: score * 6, wrongIds: wrong.current, record: score > best, best: { lab: Math.max(best, score) } });
    } else { setI(i + 1); setVal(""); setRes(null); }
  };
  useEffect(() => {
    const k = (e) => { if (res && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  if (!cur) return <p className="muted">Bu oyun için yeterli formül yok.</p>;
  return (
    <>
      <div className="row between"><span className="eyebrow">Soru {i + 1}/{qs.length}</span><span className="display num" style={{ fontSize: 26 }}>{score}</span></div>
      <div className="index-card q-card">
        <div className="card-head"><span className="row small" style={{ gap: 6, fontWeight: 750, color: "var(--accent)", minWidth: 0 }}><Calculator size={15} style={{ flex: "none" }} /> <Rich text={cur.f.n} /></span></div>
        <div className="qbody"><div style={{ fontSize: 17, fontWeight: 600, textAlign: "center" }}><Rich text={cur.gen.q} /></div></div>
      </div>
      {res ? (
        <div className={"feedback " + (res.ok ? "ok" : "no")}>
          <div className="row between"><span className="verdict">{res.ok ? "Doğru!" : "Olmadı"}</span><span className="small" style={{ fontWeight: 750 }}>Cevap: <Tex tex={cur.gen.tex} />{cur.gen.unit ? ` ${cur.gen.unit}` : ""}</span></div>
          <div className="formula-box" style={{ background: "var(--surface)", borderRadius: 12, padding: 8 }}><Formula f={cur.f} size="sm" /></div>
          <button className="btn primary block" onClick={next}>{i + 1 >= qs.length ? "Sonuç" : "Sonraki"} <ArrowRight size={18} /></button>
        </div>
      ) : (
        <>
          <div className="spacer" />
          <div className="answer-box">{val ? <span>{val}</span> : <span className="ph">Cevabını yaz</span>}<span className="caret" /></div>
          <Keypad value={val} onChange={setVal} onSubmit={submit} />
        </>
      )}
    </>
  );
}
