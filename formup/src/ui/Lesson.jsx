/* Ders motoru: dersler, yıldız parlatma (tekrar), ünite sınavı, atlama sınavı ve alıştırma.
   Her adım bir “mod”dur: i tanıt, k kanıtla, m seçmeli, t doğru/yanlış, r ad, z boşluk, f hatırla,
   a uygula, w hangi formül, e İngilizce terim, s tekrar bak. */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  X, Flame, Eye, Lightbulb, Check, ArrowRight, Delete, Sparkles, Brain, Zap, Shuffle, Calculator, BookOpen,
  Repeat2, ShieldCheck, Compass, Rocket, Search, Languages, FlaskConical, Undo2, Puzzle, Target, Crown,
} from "lucide-react";
import { Formula, Field, Rich, Tex } from "../lib/tex.jsx";
import {
  BY_ID, UNIT, GEN, MODE, memLevel, mcOptions, tfCandidate, nameOptions, whichOptions, termQuestion, clozeBank, relearn,
} from "../lib/learn.js";
import { previewIntervals } from "../lib/fsrs.js";
import { fmtInterval, rng, pick, vibrate } from "../lib/util.js";
import { play } from "../lib/sound.js";
import { Bi, Ring, Stars3, Sheet, sparkleAt, EnCtx } from "./common.jsx";
import Pi from "./Pi.jsx";
import LiveCalc from "./LiveCalc.jsx";
import { LAB_MAP } from "../labs/index.js";
import { parseAnswer, isCorrect } from "../lib/answer.js";
export { parseAnswer, isCorrect };

const PRAISE = [["Harika!", "Great!"], ["Tam isabet!", "Spot on!"], ["Süpersin!", "You're super!"], ["Bravo!", "Bravo!"], ["İşte bu!", "That's it!"], ["Yıldız gibisin!", "You're a star!"]];
const OOPS = [["Sorun değil, bak:", "No problem, look:"], ["Az kaldı!", "Almost!"], ["Bunu birlikte düzeltelim:", "Let's fix it together:"]];
const ICON = { i: Sparkles, k: Target, m: Brain, t: ShieldCheck, r: Shuffle, z: Puzzle, f: Repeat2, a: Calculator, w: Search, e: Languages, s: BookOpen };

/* ---------- klavye ---------- */
function useKeys(handler) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const k = (e) => {
      const t = e.target;
      if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // açık bir sayfa (laboratuvar vb.) varken ders kısayolları çalışmaz
      if (document.querySelector(".scrim")) return;
      // odaktaki düğmeyi Enter/Boşluk tarayıcı kendisi çalıştırır
      if ((e.key === "Enter" || e.key === " ") && t && t.closest && t.closest("button:not([disabled]),a,[role=button]")) return;
      if (e.key === " ") e.preventDefault();
      ref.current(e.key, e);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
}
const useEnter = (fn) => useKeys((k) => { if (k === "Enter" || k === " ") fn(); });

/* ---------- ortak parçalar ---------- */
function Head({ c, mode }) {
  const I = ICON[mode] || Brain;
  const u = UNIT[c.u];
  return (
    <div className="qhead">
      <span className="mode-chip"><I size={14} /> {MODE[mode].tr}</span>
      <span className="tag" title={u.en}>{c.bk ? `IB ${c.bk === "0.0" ? "ön bilgi" : c.bk}` : u.tr}</span>
    </div>
  );
}
function Name({ c }) {
  const showEn = React.useContext(EnCtx);
  return (
    <>
      <div className="qname"><Rich text={c.n} /></div>
      {showEn && <div className="qname-en en"><Rich text={c.ne} /></div>}
    </>
  );
}
export function Facts({ c, full = true }) {
  return (
    <div className="facts">
      {(c.use || c.usee) && <div className="fact"><Compass size={16} /><Bi tr={c.use} en={c.usee} /></div>}
      {(c.k || c.ke) && <div className="fact"><BookOpen size={16} /><Bi tr={c.k} en={c.ke} /></div>}
      {full && (c.w || c.we) && <div className="fact"><Lightbulb size={16} /><Bi tr={c.w} en={c.we} /></div>}
      {full && c.e && <div className="fact"><Sparkles size={16} /><span><Rich text={c.e} /></span></div>}
      {c.h && <div><span className="note"><Rich text={c.h} /></span></div>}
      {full && c.t && c.t.length > 0 && (
        <div className="row wrap" style={{ gap: 6 }}>
          {c.t.map(([en, tr], i) => <span key={i} className="tag sky"><Languages size={12} /> <b><Rich text={en} /></b>&nbsp;= <Rich text={tr} /></span>)}
        </div>
      )}
    </div>
  );
}

/* ---------- i: tanıtım ---------- */
function MeetStep({ c, onDone, onKnow, openLab, onTouch, noKnow }) {
  useKeys((k) => { if (k === "Enter") onDone({ ok: true }); });
  return (
    <>
      <div className="qcard fade-in">
        <Head c={c} mode="i" />
        <Name c={c} />
        <div className="formula-box"><Formula f={c} size="auto" /></div>
        <Facts c={c} />
        {c.c && (
          <div className="panel tight flat" style={{ background: "var(--surface-2)" }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Sayılarla oyna · <span lang="en" className="en">Play with numbers</span></div>
            <LiveCalc card={c} onTouch={onTouch} />
          </div>
        )}
        {c.lab && LAB_MAP[c.lab] && (
          <button className="btn soft block" onClick={() => openLab(c.lab)}><FlaskConical size={18} /> Laboratuvarda keşfet <span lang="en" className="en small">Explore in the lab</span></button>
        )}
      </div>
      <div className="spacer" />
      <div className="row">
        {!noKnow && <button className="btn soft grow" onClick={onKnow}><Target size={17} /> Zaten biliyorum</button>}
        <button className="btn gold grow" onClick={() => onDone({ ok: true })}>Anladım <ArrowRight size={18} /></button>
      </div>
    </>
  );
}

/* ---------- s: tekrar bak ---------- */
function ShowStep({ c, onDone }) {
  useEnter(() => onDone({ ok: true }));
  return (
    <>
      <div className="qcard fade-in">
        <Head c={c} mode="s" />
        <Name c={c} />
        <div className="formula-box"><Formula f={c} size="auto" /></div>
        <Facts c={c} full={false} />
        <p className="small muted" style={{ margin: 0, textAlign: "center" }}>Birazdan tekrar soracağım. İçinden bir kez söyle. <span lang="en" className="en">I'll ask again soon. Say it once in your head.</span></p>
      </div>
      <div className="spacer" />
      <button className="btn gold lg block" onClick={() => onDone({ ok: true })}>Hazırım <ArrowRight size={18} /></button>
    </>
  );
}

/* ---------- m / r / w / k: seçmeli ---------- */
function ChoiceStep({ c, mode, onDone, locked, seed }) {
  const r = useMemo(() => rng(seed), [seed]);
  const opts = useMemo(() => {
    if (mode === "r") return nameOptions(c, r).map((o) => ({ ok: o.ok, render: <Bi tr={o.c.n} en={o.c.ne} /> }));
    if (mode === "w") return whichOptions(c, r).map((o) => ({ ok: o.ok, render: <Formula f={o.c} size="sm" /> }));
    return mcOptions(c, r).map((o) => ({ ok: o.ok, render: <Field v={o.v} /> }));
  }, [c.id, mode, seed]); // eslint-disable-line
  const [picked, setPicked] = useState(null);
  const t0 = useRef(performance.now());
  const choose = useCallback((i, e) => {
    if (picked != null || locked) return;
    setPicked(i);
    if (opts[i].ok && e && e.clientX) sparkleAt(e.clientX, e.clientY);
    onDone({ ok: opts[i].ok, ms: performance.now() - t0.current });
  }, [picked, locked, opts, onDone]);
  useKeys((k) => { const n = Number(k); if (n >= 1 && n <= opts.length) choose(n - 1); });
  return (
    <>
      <div className="qcard fade-in">
        <Head c={c} mode={mode} />
        {mode === "r" && <div className="formula-box"><Formula f={c} size="auto" /></div>}
        {mode === "w" && (
          <div className="stack-sm">
            <Bi tr={c.q} en={c.qe} className="h3" />
            <div className="small faint" style={{ textAlign: "center" }}>Bu durumda hangi formülü kullanırsın? <span lang="en" className="en">Which formula do you use here?</span></div>
          </div>
        )}
        {(mode === "m" || mode === "k") && (
          <>
            <Name c={c} />
            <div className="formula-box"><Formula f={c} hideRhs size="auto" /></div>
            {mode === "k" && <div className="small faint" style={{ textAlign: "center" }}>Biliyorsan kanıtla! <span lang="en" className="en">Prove it!</span></div>}
          </>
        )}
      </div>
      <div className="options" role="group" aria-label="Seçenekler">
        {opts.map((o, i) => {
          const cls = picked == null ? "" : o.ok ? " right" : i === picked ? " wrong" : " dim";
          return (
            <button key={i} className={"opt" + cls} onClick={(e) => choose(i, e)} disabled={picked != null}>
              <span className="k">{i + 1}</span><span className="o">{o.render}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ---------- t: doğru / yanlış ---------- */
function TFStep({ c, onDone, seed }) {
  const cand = useMemo(() => tfCandidate(c, rng(seed)), [c.id, seed]); // eslint-disable-line
  const [ans, setAns] = useState(null);
  const t0 = useRef(performance.now());
  const answer = (v, e) => {
    if (ans != null) return;
    setAns(v);
    const ok = v === cand.ok;
    if (ok && e && e.clientX) sparkleAt(e.clientX, e.clientY);
    onDone({ ok, ms: performance.now() - t0.current, trap: !cand.ok && !v });
  };
  useKeys((k) => { if (k === "ArrowLeft" || k === "1") answer(false); if (k === "ArrowRight" || k === "2") answer(true); });
  return (
    <>
      <div className="qcard fade-in">
        <Head c={c} mode="t" />
        <Name c={c} />
        <div className="formula-box"><Formula f={c} rhs={cand.v} size="auto" /></div>
        {(c.k || c.ke) && <div className="small muted" style={{ textAlign: "center" }}><Bi tr={c.k} en={c.ke} /></div>}
      </div>
      <div className="spacer" />
      <div className="tf">
        <button className="btn coral lg" onClick={(e) => answer(false, e)} disabled={ans != null}><X size={20} /> Yanlış</button>
        <button className="btn mint lg" onClick={(e) => answer(true, e)} disabled={ans != null}><Check size={20} /> Doğru</button>
      </div>
    </>
  );
}

/* ---------- z: boşluk doldur ---------- */
function ClozeStep({ c, onDone, seed }) {
  const bank = useMemo(() => clozeBank(c, rng(seed)), [c.id, seed]); // eslint-disable-line
  const [fill, setFill] = useState([]); // bank indexleri
  const [done, setDone] = useState(null); // null | [bool per blank]
  const t0 = useRef(performance.now());
  const blanks = c.b.blanks;
  let bi = 0;
  const skel = c.b.skel.replace(/\[\[(.+?)\]\]/g, () => {
    const i = bi++;
    const token = fill[i] != null ? bank[fill[i]].v : null;
    if (done) return `\\htmlClass{${done[i] ? "blank-ok" : "blank-bad"}}{\\boxed{${token}}}`;
    if (token != null) return `\\boxed{${token}}`;
    return i === fill.length ? "\\htmlClass{blank-on}{\\boxed{\\,?\\,}}" : "\\boxed{\\phantom{0}}";
  });
  const tap = (k, e) => {
    if (done || fill.includes(k)) return;
    const nf = [...fill, k];
    setFill(nf);
    play("tick", true);
    if (nf.length === blanks.length) {
      const res = nf.map((bk, i) => bank[bk].v.replace(/\s+/g, "") === blanks[i].replace(/\s+/g, ""));
      setDone(res);
      const ok = res.every(Boolean);
      if (ok && e && e.clientX) sparkleAt(e.clientX, e.clientY);
      setTimeout(() => onDone({ ok, ms: performance.now() - t0.current }), 350);
    }
  };
  useKeys((k) => { if (k === "Backspace" && !done) setFill((f) => f.slice(0, -1)); const n = Number(k); if (n >= 1 && n <= bank.length) tap(n - 1); });
  return (
    <>
      <div className="qcard fade-in">
        <Head c={c} mode="z" />
        <Name c={c} />
        <div className="formula-box" style={{ fontSize: 22 }}>
          <span className="formula"><Field v={c.l} /><Tex tex={c.o === ":" ? ":" : c.o || "="} /><Tex tex={skel} /></span>
        </div>
        <div className="small faint" style={{ textAlign: "center" }}>Parçaları sırayla yerleştir. <span lang="en" className="en">Place the pieces in order.</span></div>
      </div>
      <div className="spacer" />
      <div className="bank">
        {bank.map((t, k) => (
          <button key={t.key} className={"token" + (fill.includes(k) ? " used" : "")} onClick={(e) => tap(k, e)} disabled={!!done}><Tex tex={t.v} /></button>
        ))}
      </div>
      <button className="btn ghost" onClick={() => setFill((f) => f.slice(0, -1))} disabled={!fill.length || !!done}><Undo2 size={16} /> Geri al</button>
    </>
  );
}

/* ---------- f: hatırla ---------- */
function FlipStep({ c, state, onDone, gradable, now }) {
  const [open, setOpen] = useState(false);
  const t0 = useRef(performance.now());
  const p = state.cards[c.id];
  const ivls = useMemo(() => (gradable ? previewIntervals(p && p.reps ? p : null, now, state.settings.retention) : null), [gradable]); // eslint-disable-line
  const grade = (g) => { if (open) onDone({ ok: g > 1, grade: g, ms: performance.now() - t0.current }); };
  const reveal = () => { if (!open) { setOpen(true); play("flip", state.settings.sound); } };
  useKeys((k) => { if (!open && (k === " " || k === "Enter")) reveal(); else if (open && ["1", "2", "3", "4"].includes(k)) grade(Number(k)); });
  const L = [["Tekrar", "Again"], ["Zor", "Hard"], ["İyi", "Good"], ["Kolay", "Easy"]];
  return (
    <>
      <div className="flip-wrap fade-in">
        <div className={"flip" + (open ? " on" : "")}>
          <div className="face qcard">
            <Head c={c} mode="f" />
            <Name c={c} />
            <div className="formula-box"><Formula f={c} hideRhs size="auto" /></div>
            <p className="small faint" style={{ textAlign: "center", margin: 0 }}>Cevabı aklında kur, sonra çevir. <span lang="en" className="en">Think of the answer, then flip.</span></p>
          </div>
          <div className="face back qcard">
            <Head c={c} mode="f" />
            <Name c={c} />
            <div className="formula-box"><Formula f={c} size="auto" /></div>
            {(c.k || c.ke) && <div className="small muted" style={{ textAlign: "center" }}><Bi tr={c.k} en={c.ke} /></div>}
            {c.h && <div style={{ textAlign: "center" }}><span className="note"><Rich text={c.h} /></span></div>}
          </div>
        </div>
      </div>
      <div className="spacer" />
      {!open ? (
        <button className="btn gold lg block" onClick={reveal}><Eye size={19} /> Cevabı göster</button>
      ) : (
        <div className="stack-sm fade-in">
          <div className="small muted" style={{ textAlign: "center", fontWeight: 600 }}>Ne kadar kolay hatırladın? <span lang="en" className="en">How easily did you recall it?</span></div>
          <div className="grades">
            {L.map(([tr, en], i) => (
              <button key={i} className={`grade g${i + 1}`} onClick={() => grade(i + 1)}>
                {tr}<span lang="en" className="en">{en}</span>{ivls && <small>{fmtInterval(ivls[i])}</small>}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- a: uygula ---------- */
export function Keypad({ value, onChange, onSubmit, disabled }) {
  const press = (k) => {
    if (disabled) return;
    if (k === "⌫") onChange(value.slice(0, -1));
    else if (k === "−") onChange(value.startsWith("-") ? value.slice(1) : "-" + value);
    else if (k === "go") onSubmit();
    else if ((k === "," || k === "/") && value.includes(k)) return;
    else if (value.length < 12) onChange(value + k);
  };
  useKeys((k, e) => {
    let hit = true;
    if (/^[0-9]$/.test(k)) press(k);
    else if (k === "Backspace") press("⌫");
    else if (k === "-") press("−");
    else if (k === "/") press("/");
    else if (k === "," || k === ".") press(",");
    else if (k === "Enter") press("go");
    else hit = false;
    if (hit && e) e.preventDefault();
  });
  const keys = ["7", "8", "9", "⌫", "4", "5", "6", "/", "1", "2", "3", "go", "−", "0", ","];
  return (
    <div className="keypad">
      {keys.map((k) => (
        <button key={k} type="button" className={k === "go" ? "go" : ["⌫", "/", "−", ","].includes(k) ? "fn" : ""} onClick={() => press(k)} aria-label={k === "go" ? "Kontrol et" : k === "⌫" ? "Sil" : k}>
          {k === "go" ? <Check size={24} /> : k === "⌫" ? <Delete size={20} /> : k}
        </button>
      ))}
    </div>
  );
}
function ApplyStep({ c, onDone, seed }) {
  const gen = useMemo(() => GEN[c.g](rng(seed)), [c.id, seed]); // eslint-disable-line
  const [val, setVal] = useState("");
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(false);
  const t0 = useRef(performance.now());
  const [shake, setShake] = useState(0);
  const submit = () => {
    if (done) return;
    if (!Number.isFinite(parseAnswer(val))) { setShake((x) => x + 1); vibrate([20, 30, 20], true); return; }
    setDone(true);
    onDone({ ok: isCorrect(val, gen), ms: performance.now() - t0.current, hinted: hint, gen, given: val });
  };
  return (
    <>
      <div className="qcard fade-in">
        <Head c={c} mode="a" />
        <div className="small faint" style={{ textAlign: "center", fontWeight: 600 }}><Rich text={c.n} /></div>
        <div style={{ fontSize: 17, fontWeight: 500, textAlign: "center", lineHeight: 1.5 }}><Bi tr={gen.q} en={gen.qe} /></div>
        {hint ? <div className="formula-box fade-in"><Formula f={c} size="md" /></div>
          : <button className="btn ghost sm" style={{ alignSelf: "center" }} onClick={() => setHint(true)}><Lightbulb size={16} /> Formülü göster (ipucu)</button>}
      </div>
      <div className="spacer" />
      <div className={"answer-box" + (shake ? " shake" : "")} key={shake} aria-live="polite">
        {val ? <span>{val}</span> : <span className="ph">Cevap · Answer (12, 3/4, 0,5)</span>}
        {!done && <span className="caret" />}
        {gen.unit && val && <span className="faint" style={{ fontSize: 16 }}>{gen.unit}</span>}
      </div>
      <Keypad value={val} onChange={setVal} onSubmit={submit} disabled={done} />
    </>
  );
}

/* ---------- e: İngilizce terim ---------- */
function TermStep({ c, onDone, seed, locked }) {
  const q = useMemo(() => termQuestion(c, rng(seed)), [c.id, seed]); // eslint-disable-line
  const [picked, setPicked] = useState(null);
  const choose = (i, e) => {
    if (picked != null || locked) return;
    setPicked(i);
    if (q.opts[i].ok && e && e.clientX) sparkleAt(e.clientX, e.clientY);
    onDone({ ok: q.opts[i].ok, term: [q.en, q.tr] });
  };
  useKeys((k) => { const n = Number(k); if (n >= 1 && n <= q.opts.length) choose(n - 1); });
  return (
    <>
      <div className="qcard fade-in">
        <Head c={c} mode="e" />
        <div className="small faint" style={{ textAlign: "center" }}>{q.reverse ? "İngilizcesi hangisi?" : "Türkçesi ne?"} <span lang="en" className="en">{q.reverse ? "Which is the English term?" : "What does it mean in Turkish?"}</span></div>
        <div className="qname" style={{ fontSize: 24, color: q.reverse ? "var(--ink)" : "var(--en)" }}><Rich text={q.prompt} /></div>
      </div>
      <div className="options">
        {q.opts.map((o, i) => {
          const cls = picked == null ? "" : o.ok ? " right" : i === picked ? " wrong" : " dim";
          return (
            <button key={i} className={"opt" + cls} onClick={(e) => choose(i, e)} disabled={picked != null}>
              <span className="k">{i + 1}</span><span className="o" style={{ fontWeight: 600, color: q.reverse ? "var(--en)" : undefined }}><Rich text={o.v} /></span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ---------- geri bildirim ---------- */
function Feedback({ c, res, step, onNext, xp }) {
  const ok = res.ok;
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    if (!el || !el.scrollIntoView) return;
    const r = el.getBoundingClientRect();
    if (r.bottom > window.innerHeight) el.scrollIntoView({ block: "end", behavior: "smooth" });
  }, []);
  const [tr, en] = useMemo(() => (ok ? pick(PRAISE) : pick(OOPS)), [ok]);
  useEnter(onNext);
  useEffect(() => {
    if (!ok || step.mode === "a") return undefined;
    const t = setTimeout(onNext, 1150);
    return () => clearTimeout(t);
  }, [ok, step.mode, onNext]);
  return (
    <div ref={box} className={"feedback " + (ok ? "ok" : "no")} role="status">
      <div className="row between">
        <span className="verdict">{tr} <span lang="en" className="en small" style={{ fontWeight: 500 }}>{en}</span></span>
        {xp > 0 && <span className="tag gold">+{xp} XP</span>}
      </div>
      {step.mode === "a" && res.gen && (
        <div className="small" style={{ fontWeight: 600 }}>Doğru cevap: <Tex tex={res.gen.tex} />{res.gen.unit ? ` ${res.gen.unit}` : ""}{!ok && res.given ? <span className="faint"> · senin cevabın: {res.given}</span> : null}</div>
      )}
      {step.mode === "e" && res.term && <div className="small"><b><Rich text={res.term[0]} /></b> = <Rich text={res.term[1]} /></div>}
      {(!ok || step.mode === "a" || step.mode === "w") && step.mode !== "e" && (
        <div className="formula-box" style={{ background: "var(--surface)", borderRadius: 16, padding: "10px 8px" }}><Formula f={c} size="md" /></div>
      )}
      {!ok && (c.w || c.we) && step.mode !== "e" && <div className="small muted"><Bi tr={c.w} en={c.we} /></div>}
      <button className={"btn block " + (ok ? "mint" : "gold")} onClick={onNext}>Devam <ArrowRight size={18} /></button>
    </div>
  );
}

/* ---------- oturum ---------- */
export default function Lesson({ state, plan, now, onAnswer, onGrade, onKnown, onFinish, onClose, onLab }) {
  const [queue, setQueue] = useState(plan.steps);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("ask");
  const [res, setRes] = useState(null);
  const [lastXp, setLastXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [mood, setMood] = useState("idle");
  const [lab, setLab] = useState(null);
  const [stats, setStats] = useState({ ok: 0, bad: 0, xp: 0, learned: 0, reviewed: 0, maxCombo: 0 });
  const learnRef = useRef({});
  const gradedRef = useRef(new Set());
  const t0 = useRef(Date.now());
  const seedBase = useRef(Math.floor(Math.random() * 1e9));
  const s = state.settings;
  const step = queue[idx];
  const c = step ? BY_ID[step.cid] : null;
  const isTest = plan.kind === "boss" || plan.kind === "jump";

  const insertLater = useCallback((steps, gap = 3) => {
    setQueue((q) => { const at = Math.min(q.length, idx + 1 + gap); return [...q.slice(0, at), ...steps, ...q.slice(at)]; });
  }, [idx]);

  const next = useCallback(() => { setRes(null); setPhase("ask"); setMood("idle"); setIdx((i) => i + 1); }, []);

  /* “Zaten biliyorum”: tanıtım adımını kanıt sorusuna çevir */
  const toKnowCheck = () => {
    setQueue((q) => q.map((x, i) => (i === idx ? { ...x, mode: "k", uid: x.uid + 0.5 } : x)));
  };

  const handleDone = useCallback((r) => {
    if (!step) return;
    const mode = step.mode;
    let grade = r.grade;
    if (grade == null) grade = !r.ok ? 1 : mode === "a" ? (r.hinted ? 2 : r.ms < 45000 ? 3 : 2) : mode === "t" ? (r.ms < 8000 ? 3 : 2) : (r.ms < 15000 ? 3 : 2);
    const passive = mode === "i" || mode === "s";
    const ok = !!r.ok;
    const nc = passive ? combo : ok ? combo + 1 : 0;
    let xp = 0;
    if (mode === "i") xp = 2;
    else if (!passive && ok) {
      xp = mode === "a" ? 12 : mode === "f" ? (grade >= 3 ? 8 : 5) : mode === "w" || mode === "z" ? 7 : 5;
      if (step.kind === "relearn") xp = Math.ceil(xp / 2);
      xp += Math.min(nc - 1, 5);
    }
    if (!passive) {
      play(ok ? "correct" : "wrong", s.sound);
      vibrate(ok ? 12 : [30, 40, 30], s.haptics);
      setMood(ok ? "happy" : "sad");
    }
    const cid = step.cid;
    // daha önce öğrenilmiş kart (ders tekrar oynanıyor / kitapçıktan çalışıldı): yeni sayılmaz
    const had = !!(state.cards[cid] && state.cards[cid].reps);
    let learnedN = 0, reviewedN = 0;
    if (mode === "k") {
      if (ok) {
        if (had) onGrade(cid, 3, {}); else onKnown(cid);
        learnRef.current[cid] = { wrong: false, graded: true, known: true };
        // bu kartın kalan ders adımlarını kaldır
        setQueue((q) => q.filter((x, i) => i <= idx || x.cid !== cid || x.kind !== "learn"));
        xp += 6;
      } else {
        // bilmiyormuş: tanıtımı yeniden göster (bu sefer "Zaten biliyorum" yok), normal akış devam
        learnRef.current[cid] = { ...(learnRef.current[cid] || {}), wrong: true };
        insertLater([{ ...step, mode: "i", uid: step.uid + 0.25, noKnow: true }], 0);
      }
    } else if (step.kind === "learn") {
      const L = (learnRef.current[cid] = learnRef.current[cid] || { wrong: false, graded: false });
      if (mode !== "i" && mode !== "f" && !ok) { L.wrong = true; insertLater(relearn(cid), 2); }
      if (mode === "f" && !L.graded) {
        L.graded = true;
        let g = grade;
        if (L.wrong && g > 2) g = 2;
        if (had) { onGrade(cid, g, {}); reviewedN = 1; }
        else { onGrade(cid, g, { isNew: true }); learnedN = 1; xp += 15; }
        if (g === 1) insertLater(relearn(cid), 3);
      }
    } else if (step.kind === "review") {
      if (!gradedRef.current.has(cid)) { gradedRef.current.add(cid); onGrade(cid, grade, {}); reviewedN = 1; }
      if (!ok) insertLater(relearn(cid), 3);
    }
    if (!passive) onAnswer({ cid, mode, ok, ms: r.ms || 0, xp, grade, combo: nc, term: !!r.term, trap: !!r.trap });
    else if (xp) onAnswer({ cid: null, mode, ok: true, ms: 0, xp, grade: null, passive: true });
    setCombo(nc);
    setLastXp(xp);
    setStats((st) => ({
      ok: st.ok + (!passive && ok ? 1 : 0), bad: st.bad + (!passive && !ok ? 1 : 0), xp: st.xp + xp,
      learned: st.learned + learnedN + (mode === "k" && ok && !had ? 1 : 0), reviewed: st.reviewed + reviewedN, maxCombo: Math.max(st.maxCombo, nc),
    }));
    if (passive || mode === "f") { next(); return; }
    setRes({ ...r, ok });
    setPhase("feedback");
  }, [step, combo, s, insertLater, onGrade, onAnswer, onKnown, idx, c, next, state.cards]);

  useEffect(() => { if (idx >= queue.length && phase !== "done") setPhase("done"); }, [idx, queue.length, phase]);
  const summary = { ...stats, ms: Date.now() - t0.current };
  const close = () => {
    if (phase === "done") { onFinish(summary); return; }
    if (stats.ok + stats.bad > 0) onFinish({ ...summary, partial: true }); else onClose();
  };
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape" && !lab) close(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const total = queue.length;
  const progress = phase === "done" ? 1 : Math.min(1, idx / Math.max(1, total));
  const gradable = step && ((step.kind === "review" && !gradedRef.current.has(step.cid)) || (step.kind === "learn" && !(learnRef.current[step.cid] || {}).graded));

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={plan.title}>
      <div className="ov-top">
        <button className="icon-btn plain" onClick={close} aria-label="Kapat"><X size={22} /></button>
        <div className="rocket-track" aria-label={`İlerleme %${Math.round(progress * 100)}`}>
          <span className="fill" style={{ width: `${progress * 100}%` }} />
          <span className="rocket" style={{ left: `calc(${progress * 100}% )` }}><Rocket size={20} fill="currentColor" /></span>
        </div>
        <span className="combo">{combo >= 2 ? <><Flame size={16} />{combo}</> : null}</span>
      </div>
      <div className="ov-body">
        <div className="ov-inner">
          {phase === "done" ? (
            <Summary stats={summary} plan={plan} state={state} onFinish={() => onFinish(summary)} />
          ) : c ? (
            <>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="eyebrow">{plan.title} · {Math.min(idx + 1, total)}/{total}</div>
                <Pi mood={mood} outfit={s.outfit} size={44} />
              </div>
              <StepView key={step.uid} step={step} c={c} state={state} now={now} onDone={handleDone} locked={phase === "feedback"}
                seed={seedBase.current + Math.floor(step.uid * 4)} gradable={gradable} onKnow={toKnowCheck}
                openLab={(id) => { setLab(id); onLab && onLab(id); }} isTest={isTest} />
              {phase === "feedback" && res && <Feedback c={c} res={res} step={step} onNext={next} xp={lastXp} />}
            </>
          ) : (
            <button className="btn gold" onClick={next}>Devam</button>
          )}
        </div>
      </div>
      {lab && LAB_MAP[lab] && (
        <Sheet onClose={() => setLab(null)} label="Laboratuvar">
          {React.createElement(LAB_MAP[lab], { card: c })}
        </Sheet>
      )}
    </div>
  );
}

function StepView({ step, c, state, now, onDone, locked, seed, gradable, onKnow, openLab }) {
  let mode = step.mode;
  if (mode === "a" && !(c.g && GEN[c.g])) mode = "f";
  if (mode === "z" && !(c.b && c.b.blanks.length)) mode = "m";
  if (mode === "w" && !c.q) mode = "m";
  if (mode === "e" && !(c.t && c.t.length)) mode = "m";
  if ((mode === "m" || mode === "t" || mode === "k") && !(c.x && c.x.length)) mode = mode === "t" ? "f" : "r";
  switch (mode) {
    case "i": return <MeetStep c={c} onDone={onDone} onKnow={onKnow} openLab={openLab} noKnow={!!step.noKnow || step.kind !== "learn"} />;
    case "s": return <ShowStep c={c} onDone={onDone} />;
    case "m": case "r": case "w": case "k": return <ChoiceStep c={c} mode={mode} onDone={onDone} locked={locked} seed={seed} />;
    case "t": return <TFStep c={c} onDone={onDone} seed={seed} />;
    case "z": return <ClozeStep c={c} onDone={onDone} seed={seed} />;
    case "a": return <ApplyStep c={c} onDone={onDone} seed={seed} />;
    case "e": return <TermStep c={c} onDone={onDone} seed={seed} locked={locked} />;
    default: return <FlipStep c={c} state={state} onDone={onDone} gradable={gradable} now={now} />;
  }
}

function Summary({ stats, plan, state, onFinish }) {
  const total = stats.ok + stats.bad;
  const acc = total ? stats.ok / total : 1;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  const isTest = plan.kind === "boss" || plan.kind === "jump";
  const pass = plan.kind === "jump" ? acc >= 0.85 : acc >= 0.8;
  useEnter(onFinish);
  useEffect(() => { play(isTest && !pass ? "wrong" : "level", state.settings.sound); }, []); // eslint-disable-line
  const head = isTest
    ? (pass ? (plan.kind === "jump" ? ["Geçtin! Üniteyi atladın.", "You passed! You tested out of the unit."] : ["Geçtin! Taç senin.", "You passed! The crown is yours."]) : ["Bu sefer olmadı, ama çok yaklaştın.", "Not this time, but you were close."])
    : acc >= 0.9 ? ["Muhteşem bir ders!", "An amazing lesson!"] : acc >= 0.7 ? ["Çok iyi gidiyorsun!", "You're doing great!"] : ["Tekrar, ustalığın anasıdır.", "Practice makes perfect."];
  return (
    <div className="stack fade-in" style={{ paddingTop: 10, alignItems: "stretch" }}>
      <div className="row" style={{ justifyContent: "center" }}><Pi mood={isTest && !pass ? "sad" : "party"} outfit={state.settings.outfit} size={120} /></div>
      <div style={{ textAlign: "center" }} className="stack-sm">
        <div className="h1">{head[0]}</div>
        <div lang="en" className="en">{head[1]}</div>
      </div>
      <div className="row" style={{ justifyContent: "center" }}>
        {isTest ? (pass && plan.kind === "boss" ? <Crown size={44} style={{ color: "var(--gold-text)" }} /> : null) : plan.kind === "lesson" ? <Stars3 n={stars} size={36} /> : null}
      </div>
      <div className="stat-grid">
        <div className="stat"><b>%{Math.round(acc * 100)}</b><span>Doğruluk</span></div>
        <div className="stat"><b>+{stats.xp}</b><span>XP</span></div>
        <div className="stat"><b>{stats.maxCombo}</b><span>Seri · Combo</span></div>
      </div>
      {stats.learned > 0 && <p className="small muted" style={{ textAlign: "center", margin: 0 }}>{stats.learned} yeni yıldız yandı. İlk tekrar yarın: uyku hafızayı pekiştirir. <span lang="en" className="en">{stats.learned} new stars lit. First review tomorrow.</span></p>}
      {isTest && !pass && <p className="small muted" style={{ textAlign: "center", margin: 0 }}>Geçmek için %{plan.kind === "jump" ? 85 : 80} gerekiyor. Dersleri bir kez daha gözden geçir. <span lang="en" className="en">You need {plan.kind === "jump" ? 85 : 80}% to pass.</span></p>}
      <button className="btn gold lg block" onClick={onFinish}>Devam <ArrowRight size={18} /></button>
    </div>
  );
}
