/* Oyun salonu: hızlı, kısa, ödüllü oyunlar */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Zap, Puzzle, ShieldAlert, Calculator, Search, Languages, X, Check, Trophy, RotateCcw, Timer, ArrowRight } from "lucide-react";
import { Formula, Field, Tex, Rich } from "../lib/tex.jsx";
import { Bi } from "./common.jsx";
import Pi from "./Pi.jsx";
import { CARDS, BY_ID, GEN, GLOSSARY, NODES, learned, currentNode, tfCandidate, whichOptions } from "../lib/learn.js";
import { Keypad, isCorrect } from "./Lesson.jsx";
import { shuffle, pick, rng, vibrate } from "../lib/util.js";
import { play } from "../lib/sound.js";
import { sparkleAt } from "./common.jsx";

export const GAMES = [
  { id: "speed", tr: "Hız Turu", en: "Speed Round", icon: Zap, color: "var(--gold)", soft: "var(--gold-soft)", dtr: "60 saniye: formül doğru mu?", den: "60 seconds: true or false?", best: (b) => b.speed ? `${b.speed} puan` : null },
  { id: "which", tr: "Hangi Formül?", en: "Which Formula?", icon: Search, color: "var(--sky)", soft: "var(--sky-soft)", dtr: "Durumu oku, doğru formülü seç.", den: "Read the situation, pick the formula.", best: (b) => b.which ? `${b.which}/10` : null },
  { id: "terms", tr: "Terim Avı", en: "Term Hunt", icon: Languages, color: "var(--violet)", soft: "var(--violet-soft)", dtr: "İngilizce terimleri eşle.", den: "Match the English terms.", best: (b) => b.terms ? `${b.terms}/12` : null },
  { id: "match", tr: "Eşleştir", en: "Match Up", icon: Puzzle, color: "var(--mint)", soft: "var(--mint-soft)", dtr: "Formülün iki yarısını birleştir.", den: "Join the two halves.", best: (b) => b.match ? `${(b.match / 1000).toFixed(1).replace(".", ",")} sn` : null },
  { id: "trap", tr: "Tuzak Avı", en: "Trap Hunt", icon: ShieldAlert, color: "var(--coral)", soft: "var(--coral-soft)", dtr: "Dört formülden biri yanlış.", den: "One of four is wrong.", best: (b) => b.trap ? `${b.trap}/10` : null },
  { id: "lab", tr: "Sayı Atölyesi", en: "Number Lab", icon: Calculator, color: "var(--gold)", soft: "var(--gold-soft)", dtr: "10 gerçek soru çöz.", den: "Solve 10 real problems.", best: (b) => b.lab ? `${b.lab}/10` : null },
];

/** Oyun havuzu: öğrenilenler; az ise yolda şu ana kadar gelinen ünitelerin kartları */
export function gamePool(state, need, filter = () => true) {
  const L = learned(state).map((id) => BY_ID[id]).filter(filter);
  if (L.length >= need) return L;
  const cur = currentNode(state);
  const lastIdx = NODES.indexOf(cur);
  const units = new Set(NODES.slice(0, Math.max(lastIdx + 1, 1)).map((n) => n.unit));
  const extra = CARDS.filter((c) => units.has(c.u) && filter(c));
  const ids = new Set(L.map((c) => c.id));
  let pool = L.concat(extra.filter((c) => !ids.has(c.id)));
  if (pool.length < need) pool = pool.concat(CARDS.filter((c) => filter(c) && !pool.includes(c)).slice(0, need * 2));
  return pool;
}

export default function Arcade({ state, onPlay }) {
  return (
    <div className="stack fade-in">
      <div className="pi-row">
        <Pi mood="party" outfit={state.settings.outfit} size={72} />
        <div className="speech"><Bi tr="Oyun zamanı! Yanlış yaptığın formüller tekrar listene öne alınır." en="Game time! Formulas you miss move up in your reviews." /></div>
      </div>
      <div className="games">
        {GAMES.map((g) => {
          const I = g.icon;
          const best = g.best(state.best);
          return (
            <button key={g.id} className="game" onClick={() => onPlay(g.id)}>
              <span className="gi" style={{ background: g.soft, color: g.color }}><I size={22} /></span>
              <Bi tr={g.tr} en={g.en} className="h3" />
              <span className="small muted" style={{ lineHeight: 1.35 }}>{g.dtr}</span>
              <span className="best"><Trophy size={13} style={{ verticalAlign: -2 }} /> {best || "Henüz oynanmadı"}</span>
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
  const props = { key: round, state, onEnd: finish };
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={G.tr}>
      <div className="ov-top">
        <button className="icon-btn plain" onClick={onExit} aria-label="Oyundan çık"><X size={22} /></button>
        <Bi tr={G.tr} en={G.en} className="grow" trClass="h3" />
      </div>
      <div className="ov-body">
        <div className="ov-inner">
          {result ? <Result G={G} result={result} state={state} onAgain={() => { setResult(null); setRound((r) => r + 1); }} onExit={onExit} />
            : game === "speed" ? <SpeedGame {...props} />
            : game === "which" ? <WhichGame {...props} />
            : game === "terms" ? <TermGame {...props} />
            : game === "match" ? <MatchGame {...props} />
            : game === "trap" ? <TrapGame {...props} />
            : <LabGame {...props} />}
        </div>
      </div>
    </div>
  );
}

function Result({ G, result, state, onAgain, onExit }) {
  useEffect(() => { play(result.record ? "level" : "correct", state.settings.sound); }, []); // eslint-disable-line
  return (
    <div className="stack fade-in" style={{ paddingTop: 10, textAlign: "center", alignItems: "stretch" }}>
      <div className="row" style={{ justifyContent: "center" }}><Pi mood={result.record ? "party" : "happy"} outfit={state.settings.outfit} size={110} /></div>
      <div className="eyebrow">{G.tr} · {G.en}</div>
      <div className="display" style={{ fontSize: 56 }}>{result.display}</div>
      {result.record && <div className="hand" style={{ color: "var(--gold)", fontSize: 30 }}>Yeni rekor! · New record!</div>}
      <div className="row" style={{ justifyContent: "center", gap: 8 }}>
        <span className="tag gold">+{result.xp} XP</span><span className="tag gold">+{result.dust} ✦</span>
        {result.wrongIds && result.wrongIds.length > 0 && <span className="tag coral">{new Set(result.wrongIds).size} formül tekrara</span>}
      </div>
      {result.wrongIds && result.wrongIds.length > 0 && (
        <div className="panel" style={{ textAlign: "left" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Doğruları · Correct versions</div>
          <div className="stack-sm">
            {[...new Set(result.wrongIds)].slice(0, 6).map((id) => {
              const c = BY_ID[id];
              return c ? <div key={id}><Bi tr={c.n} en={c.ne} className="tiny" /><div className="formula-box" style={{ textAlign: "left" }}><Formula f={c} size="sm" /></div></div> : null;
            })}
          </div>
        </div>
      )}
      <div className="row">
        <button className="btn soft lg grow" onClick={onExit}>Salon</button>
        <button className="btn gold lg grow" onClick={onAgain}><RotateCcw size={18} /> Tekrar</button>
      </div>
    </div>
  );
}
const finishBase = (score, max, best, key, extra = {}) => ({ record: score > (best || 0), best: { [key]: Math.max(best || 0, score) }, ...extra });

/* ---------------- Hız Turu ---------------- */
function SpeedGame({ state, onEnd }) {
  const list = useMemo(() => gamePool(state, 8, (c) => c.x.length && !c.r.startsWith("~")), []); // eslint-disable-line
  const r = useRef(rng(Date.now() % 1e9)).current;
  const mk = () => { const c = pick(list, r); return { c, cand: tfCandidate(c, r) }; };
  const [q, setQ] = useState(mk);
  const [left, setLeft] = useState(60000);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const wrong = useRef([]), traps = useRef(0), penalty = useRef(0);
  useEffect(() => {
    const t0 = Date.now();
    const iv = setInterval(() => { const l = 60000 - (Date.now() - t0) - penalty.current; setLeft(l); if (l <= 0) clearInterval(iv); }, 100);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    if (left <= 0) onEnd({ display: `${score}`, xp: score * 2, dust: Math.ceil(score / 2), wrongIds: wrong.current, trapsCaught: traps.current, ...finishBase(score, 0, state.best.speed, "speed") });
  }, [left <= 0]); // eslint-disable-line
  const answer = (v, e) => {
    if (left <= 0) return;
    const ok = v === q.cand.ok;
    if (ok) { setScore((s) => s + 1); if (!q.cand.ok) traps.current++; if (e && e.clientX) sparkleAt(e.clientX, e.clientY, 8); }
    else { wrong.current.push(q.c.id); penalty.current += 3000; }
    play(ok ? "correct" : "wrong", state.settings.sound);
    vibrate(ok ? 8 : [25, 30, 25], state.settings.haptics);
    setFlash(ok ? "ok" : "no"); setTimeout(() => setFlash(null), 250);
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
        <span className="row" style={{ gap: 6, fontWeight: 700 }}><Timer size={18} /> <span className="num">{Math.max(0, Math.ceil(left / 1000))} sn</span></span>
        <span className="display num" style={{ fontSize: 30 }}>{score}</span>
      </div>
      <div className="bar"><span style={{ width: `${Math.max(0, left / 600)}%`, background: "var(--gold)" }} /></div>
      <div className="qcard" style={{ outline: flash ? `3px solid ${flash === "ok" ? "var(--mint)" : "var(--coral)"}` : "none" }}>
        <div className="qname"><Rich text={q.c.n} /></div>
        <div className="qname-en en"><Rich text={q.c.ne} /></div>
        <div className="formula-box"><Formula f={q.c} rhs={q.cand.v} size="auto" /></div>
        {(q.c.k || q.c.ke) && <div className="small muted" style={{ textAlign: "center" }}><Bi tr={q.c.k} en={q.c.ke} /></div>}
      </div>
      <div className="spacer" />
      <div className="tf">
        <button className="btn coral lg" onClick={(e) => answer(false, e)}><X size={20} /> Yanlış</button>
        <button className="btn mint lg" onClick={(e) => answer(true, e)}><Check size={20} /> Doğru</button>
      </div>
    </>
  );
}

/* ---------------- Hangi Formül? ---------------- */
function WhichGame({ state, onEnd }) {
  const rounds = useMemo(() => {
    const r = rng(Date.now() % 1e9);
    const list = shuffle(gamePool(state, 10, (c) => !!c.q), r).slice(0, 10);
    return list.map((c) => ({ c, opts: whichOptions(c, r) }));
  }, []); // eslint-disable-line
  return <ChoiceRounds state={state} rounds={rounds} onEnd={onEnd} keyName="which"
    renderQ={(x) => <><Bi tr={x.c.q} en={x.c.qe} className="h3" /><div className="small faint" style={{ textAlign: "center" }}>Hangi formül? · Which formula?</div></>}
    renderO={(o) => <Formula f={o.c} size="sm" />} />;
}

/* ---------------- Terim Avı ---------------- */
function TermGame({ state, onEnd }) {
  const rounds = useMemo(() => {
    const r = rng(Date.now() % 1e9);
    const ids = new Set(gamePool(state, 12).map((c) => c.id));
    let pool = GLOSSARY.filter((g) => g.cards.some((id) => ids.has(id)));
    if (pool.length < 12) pool = GLOSSARY;
    return shuffle(pool, r).slice(0, 12).map((g) => {
      const rev = r() < 0.4;
      const others = shuffle(GLOSSARY.filter((o) => o !== g && o.tr !== g.tr), r).slice(0, 3);
      return { g, c: BY_ID[g.cards[0]], rev, opts: shuffle([{ ok: true, v: rev ? g.en : g.tr }, ...others.map((o) => ({ ok: false, v: rev ? o.en : o.tr }))], r) };
    });
  }, []); // eslint-disable-line
  return <ChoiceRounds state={state} rounds={rounds} onEnd={onEnd} keyName="terms" term
    renderQ={(x) => <><div className="small faint" style={{ textAlign: "center" }}>{x.rev ? "İngilizcesi? · English?" : "Türkçesi? · Turkish?"}</div><div className="qname" style={{ fontSize: 24, color: x.rev ? undefined : "var(--en)" }}><Rich text={x.rev ? x.g.tr : x.g.en} /></div></>}
    renderO={(o, x) => <span style={{ fontWeight: 600, color: x.rev ? "var(--en)" : undefined }}><Rich text={o.v} /></span>} />;
}

/* ---------------- Tuzak Avı ---------------- */
function TrapGame({ state, onEnd }) {
  const rounds = useMemo(() => {
    const r = rng(Date.now() % 1e9);
    const list = gamePool(state, 8, (c) => c.x.length && !c.r.startsWith("~") && c.r.length < 90);
    return Array.from({ length: 10 }, () => {
      const four = shuffle(list, r).slice(0, 4);
      const bad = Math.floor(r() * four.length);
      return { c: four[bad], opts: four.map((c, i) => ({ c, ok: i === bad, v: i === bad ? pick(c.x.filter((x) => !x.startsWith("~")).concat([c.x[0]]), r) : c.r })) };
    });
  }, []); // eslint-disable-line
  return <ChoiceRounds state={state} rounds={rounds} onEnd={onEnd} keyName="trap" trapGame
    renderQ={() => <Bi tr="Hangisi yanlış yazılmış?" en="Which one is written wrongly?" className="h3" />}
    renderO={(o) => <span><span className="tiny faint" style={{ display: "block" }}><Rich text={o.c.n} /></span><Formula f={o.c} rhs={o.v} size="sm" /></span>} />;
}

/** Çoktan seçmeli turlar (Hangi formül, Terim, Tuzak ortak) */
function ChoiceRounds({ state, rounds, onEnd, renderQ, renderO, keyName, term, trapGame }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const wrong = useRef([]);
  const cur = rounds[i];
  const choose = (k, e) => {
    if (picked != null) return;
    setPicked(k);
    const ok = cur.opts[k].ok;
    if (ok) { setScore((s) => s + 1); if (e && e.clientX) sparkleAt(e.clientX, e.clientY, 10); }
    else if (cur.c) wrong.current.push(cur.c.id);
    play(ok ? "correct" : "wrong", state.settings.sound);
    vibrate(ok ? 10 : [25, 30, 25], state.settings.haptics);
  };
  const next = () => {
    if (i + 1 >= rounds.length) {
      const n = rounds.length;
      onEnd({ display: `${score}/${n}`, xp: score * 3, dust: score, wrongIds: wrong.current, trapsCaught: trapGame ? score : 0, termsRight: term ? score : 0, ...finishBase(score, n, state.best[keyName], keyName) });
    } else { setI(i + 1); setPicked(null); }
  };
  useEffect(() => {
    const k = (e) => { const n = Number(e.key); if (picked == null && n >= 1 && n <= 4) choose(n - 1); else if (picked != null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  if (!cur) return <p className="muted">Bu oyun için yeterli formül yok. Önce birkaç ders bitir.</p>;
  return (
    <>
      <div className="row between"><span className="eyebrow">Tur · Round {i + 1}/{rounds.length}</span><span className="display num" style={{ fontSize: 26 }}>{score}</span></div>
      <div className="qcard">{renderQ(cur)}</div>
      <div className="options">
        {cur.opts.map((o, k) => {
          const cls = picked == null ? "" : o.ok ? " right" : k === picked ? " wrong" : " dim";
          return <button key={k} className={"opt" + cls} onClick={(e) => choose(k, e)} disabled={picked != null}><span className="k">{k + 1}</span><span className="o">{renderO(o, cur)}</span></button>;
        })}
      </div>
      {picked != null && <button className="btn gold lg block" onClick={next}>{i + 1 >= rounds.length ? "Sonuç · Result" : "Sonraki · Next"} <ArrowRight size={18} /></button>}
    </>
  );
}

/* ---------------- Eşleştir ---------------- */
const informative = (l) => !l.startsWith("~") && l.replace(/\\[a-zA-Z]+|[{}\s^_]/g, "").length >= 4;
function MatchGame({ state, onEnd }) {
  const pairs = useMemo(() => {
    const r = rng(Date.now() % 1e9);
    const list = gamePool(state, 8, (c) => c.l.length < 46 && c.r.length < 64 && !c.r.startsWith("~"));
    const sl = new Set(), sr = new Set(), out = [];
    for (const c of shuffle(list, r)) { if (sl.has(c.l) || sr.has(c.r)) continue; sl.add(c.l); sr.add(c.r); out.push(c); if (out.length === 6) break; }
    return { items: out, L: shuffle(out, r), R: shuffle(out, r) };
  }, []); // eslint-disable-line
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(new Set());
  const [err, setErr] = useState(null);
  const [mist, setMist] = useState(0);
  const wrong = useRef([]);
  const t0 = useRef(Date.now());
  const [, tick] = useState(0);
  useEffect(() => { const iv = setInterval(() => tick((x) => x + 1), 200); return () => clearInterval(iv); }, []);
  useEffect(() => {
    if (pairs.items.length && done.size === pairs.items.length) {
      const ms = Date.now() - t0.current + mist * 3000;
      const best = state.best.match || 0;
      onEnd({ display: `${(ms / 1000).toFixed(1).replace(".", ",")} sn`, xp: Math.max(5, 30 - mist * 3), dust: Math.max(2, 10 - mist), wrongIds: wrong.current, record: !best || ms < best, best: { match: best ? Math.min(best, ms) : ms } });
    }
  }, [done]); // eslint-disable-line
  const tap = (side, id, e) => {
    if (done.has(id)) return;
    if (!sel || sel.side === side) { setSel({ side, id }); return; }
    if (sel.id === id) { setDone(new Set([...done, id])); setSel(null); play("correct", state.settings.sound); if (e && e.clientX) sparkleAt(e.clientX, e.clientY, 8); }
    else { setErr(`${side}:${id}`); setMist((m) => m + 1); wrong.current.push(id, sel.id); setSel(null); play("wrong", state.settings.sound); setTimeout(() => setErr(null), 350); }
  };
  if (pairs.items.length < 3) return <p className="muted">Eşleştirme için yeterli formül yok.</p>;
  const cell = (side, c) => {
    const on = sel && sel.side === side && sel.id === c.id;
    return (
      <button key={side + c.id} className="opt" onClick={(e) => tap(side, c.id, e)}
        style={{ gridTemplateColumns: "1fr", minHeight: 64, textAlign: "center", opacity: done.has(c.id) ? 0 : 1, pointerEvents: done.has(c.id) ? "none" : undefined, borderColor: on ? "var(--gold)" : err === `${side}:${c.id}` ? "var(--coral)" : undefined, background: on ? "var(--gold-soft)" : undefined, transition: "opacity .3s" }}>
        <span className="o" style={{ fontSize: 14.5 }}>{side === "L" ? (informative(c.l) ? <Field v={c.l} /> : <Bi tr={c.n} en={c.ne} className="small" />) : <Field v={c.r} />}</span>
      </button>
    );
  };
  return (
    <>
      <div className="row between">
        <span className="row" style={{ gap: 6, fontWeight: 700 }}><Timer size={18} /><span className="num">{((Date.now() - t0.current) / 1000).toFixed(1).replace(".", ",")} sn</span></span>
        <span className="small muted">{mist ? `${mist} hata (+${mist * 3} sn)` : "Sol ↔ sağ · Left ↔ right"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div className="stack-sm">{pairs.L.map((c) => cell("L", c))}</div>
        <div className="stack-sm">{pairs.R.map((c) => cell("R", c))}</div>
      </div>
    </>
  );
}

/* ---------------- Sayı Atölyesi ---------------- */
function LabGame({ state, onEnd }) {
  const qs = useMemo(() => {
    const r = rng(Date.now() % 1e9);
    const list = gamePool(state, 6, (c) => c.g && GEN[c.g]);
    const chosen = shuffle(list, r).slice(0, 10);
    while (chosen.length < 10 && list.length) chosen.push(pick(list, r));
    return chosen.map((c) => ({ c, gen: GEN[c.g](r) }));
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
    if (ok) setScore((s) => s + 1); else wrong.current.push(cur.c.id);
    play(ok ? "correct" : "wrong", state.settings.sound);
  };
  const next = () => {
    if (i + 1 >= qs.length) onEnd({ display: `${score}/${qs.length}`, xp: score * 6, dust: score * 2, wrongIds: wrong.current, apply: score, ...finishBase(score, qs.length, state.best.lab, "lab") });
    else { setI(i + 1); setVal(""); setRes(null); }
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
      <div className="qcard">
        <div className="small faint" style={{ textAlign: "center" }}><Rich text={cur.c.n} /></div>
        <div style={{ fontSize: 17, fontWeight: 500, textAlign: "center" }}><Bi tr={cur.gen.q} en={cur.gen.qe} /></div>
      </div>
      {res ? (
        <div className={"feedback " + (res.ok ? "ok" : "no")}>
          <div className="row between"><span className="verdict">{res.ok ? "Doğru!" : "Olmadı"}</span><span className="small" style={{ fontWeight: 600 }}>Cevap: <Tex tex={cur.gen.tex} />{cur.gen.unit ? ` ${cur.gen.unit}` : ""}</span></div>
          <div className="formula-box" style={{ background: "var(--surface)", borderRadius: 14, padding: 8 }}><Formula f={cur.c} size="sm" /></div>
          <button className="btn gold block" onClick={next}>{i + 1 >= qs.length ? "Sonuç" : "Sonraki"} <ArrowRight size={18} /></button>
        </div>
      ) : (
        <>
          <div className="spacer" />
          <div className="answer-box">{val ? <span>{val}</span> : <span className="ph">Cevabını yaz · your answer</span>}<span className="caret" /></div>
          <Keypad value={val} onChange={setVal} onSubmit={submit} />
        </>
      )}
    </>
  );
}
