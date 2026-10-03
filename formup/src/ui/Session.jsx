import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, Flame, Eye, Lightbulb, Check, ArrowRight, Delete, Sparkles, Brain, Zap, Shuffle, Calculator, BookOpen, Repeat2, ShieldCheck, Compass } from "lucide-react";
import { Formula, Field, Rich, Tex } from "../lib/tex.jsx";
import { getF, mcOptions, nameOptions, tfCandidate, relearnSteps, makeStep, memLevel, MODE_NAMES } from "../lib/srs.js";
import { previewIntervals } from "../lib/fsrs.js";
import { GEN, isCorrect } from "../data/generators.js";
import { TOPIC } from "../data/topics.js";
import { fmtInterval, rng, pick } from "../lib/util.js";
import { play } from "../lib/sound.js";
import { vibrate } from "../lib/util.js";
import { Bar, Ring, lvColor, Prio } from "./common.jsx";

const PRAISE = ["Aferin!", "Tam isabet!", "Süper!", "Harika!", "Kafana sağlık!", "Bravo!", "Çok iyi!"];
const OOPS = ["Tekrar bakalım", "Az kaldı", "Not al:", "Böyleymiş"];
const MODE_ICON = { i: Sparkles, m: Brain, t: ShieldCheck, r: Shuffle, f: Repeat2, a: Calculator, s: BookOpen, k: Zap };

/* ---------- Ortak kart başlığı ---------- */
function StepHead({ f, mode, state }) {
  const I = MODE_ICON[mode] || Brain;
  const lv = memLevel(state.cards[f.id]);
  return (
    <div className="card-head">
      <span className="mode-label"><I size={15} /> {MODE_NAMES[mode]}</span>
      <span className="row" style={{ gap: 6 }}>
        <span className="tag">{(TOPIC[f.t] || TOPIC.ozel).name}</span>
        <span title="Hafıza seviyesi" style={{ width: 12, height: 12, borderRadius: 4, background: lvColor(lv), display: "inline-block" }} />
      </span>
    </div>
  );
}

/** Formülün tüm bilgisi (tanıtım ve geri bildirimde) */
export function FormulaFacts({ f, compact = false }) {
  return (
    <div className="stack-sm">
      {f.k && <div className="kv"><BookOpen size={16} aria-label="Şart" /><Rich text={f.k} /></div>}
      {!compact && f.w && <div className="kv"><Lightbulb size={16} aria-label="Neden" /><Rich text={f.w} /></div>}
      {!compact && f.e && <div className="kv"><Compass size={16} aria-label="Örnek" /><span><Rich text={f.e} /></span></div>}
      {f.h && <div><span className="note"><Rich text={f.h} /></span></div>}
    </div>
  );
}

/* ---------- Tanıtım ---------- */
function IntroStep({ f, state, onDone }) {
  useEnter(() => onDone({ ok: true }));
  return (
    <>
      <div className="index-card q-card fade-in">
        <StepHead f={f} mode="i" state={state} />
        <div className="qbody">
          <div className="row between"><span className="eyebrow">#{f.rank || "★"} önem sırası</span>{f.p ? <Prio p={f.p} /> : null}</div>
          <div className="q-name"><Rich text={f.n} /></div>
          <div className="formula-box"><Formula f={f} size="auto" /></div>
          <FormulaFacts f={f} />
          {f.s && <div className="small muted" style={{ borderLeft: "3px solid var(--margin)", paddingLeft: 10 }}><Rich text={f.s} /></div>}
        </div>
      </div>
      <div className="spacer" />
      <button className="btn primary lg block" onClick={() => onDone({ ok: true })}>Anladım <ArrowRight size={18} /></button>
    </>
  );
}

/* ---------- Tekrar gösterim (yanlıştan sonra) ---------- */
function ShowStep({ f, state, onDone }) {
  useEnter(() => onDone({ ok: true }));
  return (
    <>
      <div className="index-card q-card fade-in">
        <StepHead f={f} mode="s" state={state} />
        <div className="qbody">
          <div className="q-name"><Rich text={f.n} /></div>
          <div className="formula-box"><Formula f={f} size="auto" /></div>
          <FormulaFacts f={f} compact />
          <p className="small muted" style={{ margin: 0, textAlign: "center" }}>Birazdan tekrar soracağım. Gözünü kapat, bir kez içinden söyle.</p>
        </div>
      </div>
      <div className="spacer" />
      <button className="btn primary lg block" onClick={() => onDone({ ok: true })}>Hazırım <ArrowRight size={18} /></button>
    </>
  );
}

/* ---------- Çoktan seçmeli ---------- */
function ChoiceStep({ f, state, mode, onDone, locked, seed }) {
  const opts = useMemo(() => (mode === "r" ? nameOptions(state, f, rng(seed)) : mcOptions(state, f, rng(seed))), [f.id, mode, seed]); // eslint-disable-line
  const [picked, setPicked] = useState(null);
  const t0 = useRef(performance.now());
  const choose = useCallback((i) => {
    if (picked != null || locked) return;
    setPicked(i);
    onDone({ ok: opts[i].ok, ms: performance.now() - t0.current });
  }, [picked, locked, opts, onDone]);
  useKeys((k) => { const n = Number(k); if (n >= 1 && n <= opts.length) choose(n - 1); });
  return (
    <>
      <div className="index-card q-card fade-in">
        <StepHead f={f} mode={mode} state={state} />
        <div className="qbody">
          {mode === "r" ? (
            <div className="formula-box"><Formula f={f} size="auto" /></div>
          ) : (
            <>
              <div className="q-name"><Rich text={f.n} /></div>
              <div className="formula-box"><Formula f={f} hideRhs size="auto" /></div>
            </>
          )}
        </div>
      </div>
      <div className="options" role="group" aria-label="Seçenekler">
        {opts.map((o, i) => {
          const cls = picked == null ? "" : o.ok ? " right" : i === picked ? " wrong" : " dim";
          return (
            <button key={i} className={"opt" + cls} onClick={() => choose(i)} disabled={picked != null}>
              <span className="k">{i + 1}</span>
              <span className="o">{mode === "r" ? <b style={{ fontWeight: 700 }}><Rich text={o.v} /></b> : <Field v={o.v} />}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Doğru / yanlış ---------- */
function TFStep({ f, state, onDone, seed }) {
  const cand = useMemo(() => tfCandidate(f, rng(seed)), [f.id, seed]); // eslint-disable-line
  const [ans, setAns] = useState(null);
  const t0 = useRef(performance.now());
  const answer = useCallback((saysTrue) => {
    if (ans != null) return;
    setAns(saysTrue);
    onDone({ ok: saysTrue === cand.ok, ms: performance.now() - t0.current, trapCaught: !cand.ok && !saysTrue });
  }, [ans, cand, onDone]);
  useKeys((k) => { if (k === "ArrowLeft" || k === "1") answer(false); if (k === "ArrowRight" || k === "2") answer(true); });
  return (
    <>
      <div className="index-card q-card fade-in">
        <StepHead f={f} mode="t" state={state} />
        <div className="qbody">
          <div className="q-name"><Rich text={f.n} /></div>
          <div className="formula-box"><Formula f={f} rhs={cand.v} size="auto" /></div>
          {f.k && <div className="small muted" style={{ textAlign: "center" }}><Rich text={f.k} /></div>}
        </div>
      </div>
      <div className="spacer" />
      <div className="tf">
        <button className="btn bad lg" onClick={() => answer(false)} disabled={ans != null}><X size={20} /> Yanlış</button>
        <button className="btn good lg" onClick={() => answer(true)} disabled={ans != null}><Check size={20} /> Doğru</button>
      </div>
    </>
  );
}

/* ---------- Kart çevirme (aktif hatırlama) ---------- */
function FlipStep({ f, state, onDone, gradable, now }) {
  const [open, setOpen] = useState(false);
  const t0 = useRef(performance.now());
  const p = state.cards[f.id];
  const ivls = useMemo(() => (gradable ? previewIntervals(p && p.reps ? p : null, now, state.settings.retention) : null), [gradable]); // eslint-disable-line
  const grade = (g) => { if (!open) return; onDone({ ok: g > 1, grade: g, ms: performance.now() - t0.current }); };
  const reveal = () => { if (!open) { setOpen(true); play("flip", state.settings.sound); } };
  useKeys((k) => {
    if (!open && (k === " " || k === "Enter")) reveal();
    else if (open && ["1", "2", "3", "4"].includes(k)) grade(Number(k));
  });
  const LABELS = ["Tekrar", "Zor", "İyi", "Kolay"];
  return (
    <>
      <div className="flip-wrap fade-in">
        <div className={"flip" + (open ? " on" : "")}>
          <div className="face index-card q-card">
            <StepHead f={f} mode="f" state={state} />
            <div className="qbody" style={{ flex: 1, justifyContent: "center" }}>
              <div className="q-name"><Rich text={f.n} /></div>
              <div className="formula-box"><Formula f={f} hideRhs size="auto" /></div>
              <p className="small faint" style={{ textAlign: "center", margin: 0 }}>Cevabı aklında kur, sonra kartı çevir.</p>
            </div>
          </div>
          <div className="face back index-card q-card">
            <StepHead f={f} mode="f" state={state} />
            <div className="qbody" style={{ flex: 1, justifyContent: "center" }}>
              <div className="q-name"><Rich text={f.n} /></div>
              <div className="formula-box"><Formula f={f} size="auto" /></div>
              {f.k && <div className="small muted" style={{ textAlign: "center" }}><Rich text={f.k} /></div>}
              {f.h && <div style={{ textAlign: "center" }}><span className="note"><Rich text={f.h} /></span></div>}
            </div>
          </div>
        </div>
      </div>
      <div className="spacer" />
      {!open ? (
        <button className="btn primary lg block" onClick={reveal}><Eye size={19} /> Cevabı göster</button>
      ) : (
        <div className="stack-sm fade-in">
          <div className="small muted" style={{ textAlign: "center", fontWeight: 650 }}>Ne kadar kolay hatırladın?</div>
          <div className="grades">
            {LABELS.map((l, i) => (
              <button key={i} className={`grade g${i + 1}`} onClick={() => grade(i + 1)}>
                {l}{ivls && <small>{fmtInterval(ivls[i])}</small>}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Uygula: sayısal soru ---------- */
export function Keypad({ value, onChange, onSubmit, disabled }) {
  const press = (k) => {
    if (disabled) return;
    if (k === "⌫") onChange(value.slice(0, -1));
    else if (k === "−") onChange(value.startsWith("-") ? value.slice(1) : "-" + value);
    else if (k === "go") onSubmit();
    else if (value.length < 12) onChange(value + k);
  };
  useKeys((k) => {
    if (/^[0-9]$/.test(k)) press(k);
    else if (k === "Backspace") press("⌫");
    else if (k === "-") press("−");
    else if (k === "/" ) press("/");
    else if (k === "," || k === ".") press(",");
    else if (k === "Enter") press("go");
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
function ApplyStep({ f, state, onDone, seed }) {
  const gen = useMemo(() => GEN[f.g](rng(seed)), [f.id, seed]); // eslint-disable-line
  const [val, setVal] = useState("");
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(false);
  const t0 = useRef(performance.now());
  const submit = () => {
    if (done || !val.trim()) return;
    setDone(true);
    onDone({ ok: isCorrect(val, gen), ms: performance.now() - t0.current, hinted: hint, gen, given: val });
  };
  return (
    <>
      <div className="index-card q-card fade-in">
        <StepHead f={f} mode="a" state={state} />
        <div className="qbody">
          <div className="small faint" style={{ textAlign: "center", fontWeight: 700 }}><Rich text={f.n} /></div>
          <div style={{ fontSize: 17, fontWeight: 600, textAlign: "center", lineHeight: 1.5 }}><Rich text={gen.q} /></div>
          {hint ? (
            <div className="formula-box fade-in"><Formula f={f} size="md" /></div>
          ) : (
            <button className="btn ghost sm" style={{ alignSelf: "center" }} onClick={() => setHint(true)}><Lightbulb size={16} /> Formülü göster (ipucu)</button>
          )}
        </div>
      </div>
      <div className="spacer" />
      <div className="answer-box" aria-live="polite">
        {val ? <span>{val}</span> : <span className="ph">Cevap (ör. 12, 3/4, 0,5)</span>}
        {!done && <span className="caret" />}
        {gen.unit && val && <span className="faint" style={{ fontSize: 16 }}>{gen.unit}</span>}
      </div>
      <Keypad value={val} onChange={setVal} onSubmit={submit} disabled={done} />
    </>
  );
}

/* ---------- Klavye yardımcıları ---------- */
function useKeys(handler) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const k = (e) => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === " ") e.preventDefault();
      ref.current(e.key);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
}
function useEnter(fn) { useKeys((k) => { if (k === "Enter" || k === " ") fn(); }); }

/* ---------- Geri bildirim ---------- */
function Feedback({ f, res, step, onNext, xp }) {
  const ok = res.ok;
  const verdict = useMemo(() => (ok ? pick(PRAISE) : pick(OOPS)), [ok]);
  useEnter(onNext);
  useEffect(() => {
    if (!ok || step.mode === "a") return undefined;
    const t = setTimeout(onNext, 1100);
    return () => clearTimeout(t);
  }, [ok, step.mode, onNext]);
  return (
    <div className={"feedback " + (ok ? "ok" : "no")} role="status">
      <div className="row between">
        <span className="verdict">{verdict}</span>
        {xp > 0 && <span className="tag amber">+{xp} XP</span>}
      </div>
      {step.mode === "a" && res.gen && (
        <div className="small" style={{ fontWeight: 650 }}>
          Doğru cevap: <Tex tex={res.gen.tex} />{res.gen.unit ? ` ${res.gen.unit}` : ""}{!ok && res.given ? <span className="faint"> · senin cevabın: {res.given}</span> : null}
        </div>
      )}
      {(!ok || step.mode === "a") && (
        <div className="formula-box" style={{ background: "var(--surface)", borderRadius: 14, padding: "10px 8px" }}>
          <Formula f={f} size="md" />
        </div>
      )}
      {!ok && f.w && <div className="small muted"><Rich text={f.w} /></div>}
      {!ok && step.mode === "t" && res.trapShown && <div className="small"><b>Tuzak:</b> bu yaygın bir hatadır.</div>}
      <button className={"btn block " + (ok ? "good" : "primary")} onClick={onNext}>Devam <ArrowRight size={18} /></button>
    </div>
  );
}

/* ---------- Oturum ---------- */
export default function Session({ state, plan, now, onAnswer, onGrade, onFinish, onClose }) {
  const [queue, setQueue] = useState(plan.steps);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("ask"); // ask | feedback | done
  const [res, setRes] = useState(null);
  const [lastXp, setLastXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState({ ok: 0, bad: 0, xp: 0, learned: 0, reviewed: 0, maxCombo: 0 });
  const learnRef = useRef({}); // cid → { wrong, graded }
  const gradedRef = useRef(new Set());
  const t0 = useRef(Date.now());
  const seedBase = useRef(Math.floor(Math.random() * 1e9));

  const step = queue[idx];
  const f = step ? getF(state, step.cid) : null;
  const s = state.settings;

  const insertLater = useCallback((steps, gap = 3) => {
    setQueue((q) => { const at = Math.min(q.length, idx + 1 + gap); return [...q.slice(0, at), ...steps, ...q.slice(at)]; });
  }, [idx]);

  const handleDone = useCallback((r) => {
    if (!step) return;
    const mode = step.mode;
    let grade = r.grade;
    if (grade == null) {
      if (!r.ok) grade = 1;
      else if (mode === "a") grade = r.hinted ? 2 : r.ms < 40000 ? 3 : 2;
      else if (mode === "t") grade = r.ms < 7000 ? 3 : 2;
      else grade = r.ms < 14000 ? 3 : 2;
    }
    const passive = mode === "i" || mode === "s";
    const ok = !!r.ok;
    const nc = passive ? combo : ok ? combo + 1 : 0;
    let xp = 0;
    if (mode === "i") xp = 2;
    else if (!passive && ok) {
      xp = mode === "a" ? 12 : mode === "f" ? (grade >= 3 ? 8 : 5) : 5;
      if (step.kind === "relearn") xp = Math.ceil(xp / 2);
      xp += Math.min(nc - 1, 5);
    }
    if (!passive) {
      play(ok ? "correct" : "wrong", s.sound);
      vibrate(ok ? 12 : [30, 40, 30], s.haptics);
    }
    // öğrenme takibi ve zamanlama
    const cid = step.cid;
    let newlyLearned = 0, reviewed = 0;
    if (step.kind === "learn") {
      const L = (learnRef.current[cid] = learnRef.current[cid] || { wrong: false, graded: false });
      if (mode !== "i" && mode !== "f" && !ok) { L.wrong = true; insertLater(relearnSteps(cid, s), 2); }
      if (mode === "f" && !L.graded) {
        L.graded = true;
        let g = grade;
        if (L.wrong && g > 2) g = 2;
        onGrade(cid, g, { isNew: true });
        newlyLearned = 1;
        xp += 15;
        if (g === 1) insertLater(relearnSteps(cid, s), 3);
      }
    } else if (step.kind === "review") {
      if (!gradedRef.current.has(cid)) {
        gradedRef.current.add(cid);
        onGrade(cid, grade, {});
        reviewed = 1;
      }
      if (!ok) insertLater(relearnSteps(cid, s), 3);
    }
    if (!passive) onAnswer({ cid, mode, ok, ms: r.ms || 0, xp, grade, trapCaught: !!r.trapCaught });
    else if (xp) onAnswer({ cid, mode, ok: true, ms: 0, xp, grade: null, passive: true });

    setCombo(nc);
    setLastXp(xp);
    setStats((st) => ({
      ok: st.ok + (!passive && ok ? 1 : 0), bad: st.bad + (!passive && !ok ? 1 : 0), xp: st.xp + xp,
      learned: st.learned + newlyLearned, reviewed: st.reviewed + reviewed, maxCombo: Math.max(st.maxCombo, nc),
    }));
    if (passive || mode === "f") { next(); return; }
    setRes({ ...r, ok, trapShown: mode === "t" && !ok });
    setPhase("feedback");
  }, [step, combo, s, insertLater, onGrade, onAnswer]); // eslint-disable-line

  const next = useCallback(() => {
    setRes(null);
    setPhase("ask");
    setIdx((i) => i + 1);
  }, []);

  useEffect(() => { if (idx >= queue.length && phase !== "done") setPhase("done"); }, [idx, queue.length, phase]);

  const finish = () => onFinish({ ...stats, ms: Date.now() - t0.current, kind: plan.kind });
  const close = () => {
    if (stats.ok + stats.bad > 0) onFinish({ ...stats, ms: Date.now() - t0.current, kind: plan.kind, partial: true });
    else onClose();
  };
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const total = queue.length;
  const progress = Math.min(1, idx / Math.max(1, total));

  return (
    <div className="overlay fu" data-mode={s.theme === "auto" ? undefined : s.theme} role="dialog" aria-modal="true" aria-label={plan.title}>
      <div className="ov-top">
        <button className="icon-btn plain" onClick={close} aria-label="Oturumu kapat"><X size={22} /></button>
        <div className="grow"><Bar pct={phase === "done" ? 1 : progress} /></div>
        <span className="combo" aria-label={`Seri: ${combo}`}>{combo >= 2 ? <><Flame size={16} />{combo}</> : null}</span>
      </div>
      <div className="ov-body">
        <div className="ov-inner">
          {phase === "done" ? (
            <Summary stats={stats} plan={plan} onFinish={finish} />
          ) : f ? (
            <>
              <div className="eyebrow" style={{ textAlign: "center" }}>{plan.title} · {Math.min(idx + 1, total)}/{total}</div>
              <StepView key={step.uid} step={step} f={f} state={state} now={now} onDone={handleDone}
                locked={phase === "feedback"} seed={seedBase.current + step.uid}
                gradable={(step.kind === "review" && !gradedRef.current.has(step.cid)) || (step.kind === "learn" && !(learnRef.current[step.cid] || {}).graded)} />
              {phase === "feedback" && res && <Feedback f={f} res={res} step={step} onNext={next} xp={lastXp} />}
            </>
          ) : (
            <button className="btn primary" onClick={next}>Devam</button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepView({ step, f, state, now, onDone, locked, seed, gradable }) {
  let mode = step.mode;
  if (mode === "a" && (!f.g || !GEN[f.g])) mode = "f";
  if ((mode === "m" || mode === "t") && (!f.x || !f.x.length) && state.custom.length < 4) mode = mode === "m" ? "r" : "f";
  if (mode === "i") return <IntroStep f={f} state={state} onDone={onDone} />;
  if (mode === "s") return <ShowStep f={f} state={state} onDone={onDone} />;
  if (mode === "m" || mode === "r") return <ChoiceStep f={f} state={state} mode={mode} onDone={onDone} locked={locked} seed={seed} />;
  if (mode === "t") return <TFStep f={f} state={state} onDone={onDone} seed={seed} />;
  if (mode === "a") return <ApplyStep f={f} state={state} onDone={onDone} seed={seed} />;
  return <FlipStep f={f} state={state} onDone={onDone} gradable={gradable} now={now} />;
}

function Summary({ stats, plan, onFinish }) {
  const total = stats.ok + stats.bad;
  const acc = total ? stats.ok / total : 1;
  useEnter(onFinish);
  return (
    <div className="stack fade-in" style={{ paddingTop: 18 }}>
      <div className="row" style={{ justifyContent: "center" }}>
        <Ring size={150} stroke={13} pct={acc} color={acc >= 0.8 ? "var(--green)" : acc >= 0.5 ? "var(--amber)" : "var(--red)"}>
          <div><div className="summary-num num">%{Math.round(acc * 100)}</div><div className="tiny faint" style={{ fontWeight: 800 }}>DOĞRULUK</div></div>
        </Ring>
      </div>
      <div style={{ textAlign: "center" }}>
        <div className="hand" style={{ fontSize: 34, color: "var(--accent)" }}>{acc === 1 && total >= 5 ? "Kusursuz tur!" : acc >= 0.8 ? "Harika iş çıkardın!" : acc >= 0.5 ? "İyi gidiyorsun" : "Tekrar, ustalığın anasıdır"}</div>
        <div className="muted small">{plan.title} tamamlandı</div>
      </div>
      <div className="stat-grid">
        <div className="stat"><b>+{stats.xp}</b><span>XP</span></div>
        <div className="stat"><b>{stats.learned || stats.reviewed}</b><span>{stats.learned ? "Yeni formül" : "Tekrar"}</span></div>
        <div className="stat"><b>{stats.maxCombo}</b><span>En uzun seri</span></div>
      </div>
      {stats.learned > 0 && <p className="small muted" style={{ textAlign: "center", margin: 0 }}>Yeni formüllerin ilk tekrarı <b>yarın</b>. Uykuda hafıza pekişir; yarın gelmeyi unutma.</p>}
      <button className="btn primary lg block" onClick={onFinish}>Bitir</button>
    </div>
  );
}
