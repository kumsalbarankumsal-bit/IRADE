/* Yol: ünitelerden geçen bir uzay rotası. Her durak bir ders; ünite sonunda taç sınavı. */
import React, { useEffect, useMemo, useRef } from "react";
import { Lock, Check, Crown, Sparkles, Star, Gift, Flame, Zap, Rocket, Gamepad2, Calculator, FlaskConical, ChevronRight, Play, RotateCcw, ArrowRight } from "lucide-react";
import Pi, { piLine } from "./Pi.jsx";
import { Bi, Ring, Bar, Stars3, Sheet } from "./common.jsx";
import { Rich, Formula, Tex } from "../lib/tex.jsx";
import { PATH, NODES, BY_ID, nodeStatus, currentNode, dueIds, questProgress, today, shownStreak, nodeUnlocked } from "../lib/learn.js";

const QICON = { Zap, Rocket, Sparkles, Flame, Gamepad2, Star, Calculator, FlaskConical };
const OFFS = [0, 62, 92, 62, 0, -62, -92, -62];
const STEP_Y = 112;

export function DailyCard({ state, now, onClaim, onChest }) {
  const t = today(state, now);
  const goal = state.settings.goal;
  const xp = t.xp || 0;
  const qs = questProgress(state, now);
  const q = state.quests && state.quests.day ? state.quests : { claimed: {}, chest: false };
  const allClaimed = qs.every((x) => x.claimed);
  const st = shownStreak(state, now);
  return (
    <div className="panel">
      <div className="row" style={{ gap: 16 }}>
        <Ring size={86} stroke={9} pct={xp / goal} color="var(--gold)">
          <div style={{ lineHeight: 1.1 }}><div className="display num" style={{ fontSize: 19 }}>{Math.min(xp, 999)}</div><div className="tiny faint">/{goal} XP</div></div>
        </Ring>
        <div className="grow stack-sm" style={{ gap: 4 }}>
          <Bi tr={xp >= goal ? "Günlük hedef tamam!" : "Bugünkü hedefin"} en={xp >= goal ? "Daily goal done!" : "Today's goal"} className="h3" />
          <div className="row small" style={{ gap: 12 }}>
            <span className="row" style={{ gap: 4, color: st.n ? "var(--coral)" : "var(--ink-3)", fontWeight: 600 }}><Flame size={16} /> {st.n} gün</span>
            <span className="row" style={{ gap: 4, color: "var(--gold)", fontWeight: 600 }}><Sparkles size={16} /> {state.dust} ✦</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>Günlük görevler · <span lang="en" className="en" style={{ textTransform: "none", letterSpacing: 0 }}>Daily quests</span></div>
        {qs.map((x) => {
          const I = QICON[x.icon] || Star;
          return (
            <div key={x.id} className={"quest" + (x.done ? " done" : "")}>
              <span className="qi"><I size={19} /></span>
              <div className="stack-sm" style={{ gap: 4 }}>
                <Bi tr={x.tr.replace("{n}", x.goal)} en={x.en.replace("{n}", x.goal)} className="small" />
                <Bar pct={x.v / x.goal} color={x.done ? "var(--mint)" : "var(--gold)"} />
              </div>
              {x.done && !x.claimed ? <button className="btn gold sm" onClick={() => onClaim(x.id)}>+10 ✦</button>
                : <span className="tiny faint num" style={{ fontWeight: 600 }}>{x.claimed ? <Check size={16} style={{ color: "var(--mint)" }} /> : `${x.v}/${x.goal}`}</span>}
            </div>
          );
        })}
        {allClaimed && !q.chest && <button className="btn gold block" style={{ marginTop: 10 }} onClick={onChest}><Gift size={18} /> Sandığı aç · Open chest (+30 ✦)</button>}
      </div>
    </div>
  );
}

export default function Path({ state, now, openNode, startReview, onClaim, onChest }) {
  const due = dueIds(state, now).length;
  const cur = currentNode(state);
  const curRef = useRef(null);
  const t = today(state, now);
  const st = shownStreak(state, now);
  const hour = new Date(now).getHours();
  const lessonsDone = Object.values(state.lessons).filter((l) => l.done).length;
  const line = piLine({ due, streak: st.n, goalDone: (t.xp || 0) >= state.settings.goal, firstTime: lessonsDone === 0 && !Object.keys(state.cards).length, hour, lessonsDone, risk: st.risk && st.n > 0 && hour >= 17 });

  useEffect(() => {
    const el = curRef.current;
    if (el && lessonsDone > 0) el.scrollIntoView({ block: "center" });
  }, []); // eslint-disable-line

  let trackShown = null;
  return (
    <div className="stack fade-in">
      <div className="pi-row">
        <Pi mood={line.mood} outfit={state.settings.outfit} size={86} />
        <div className="speech"><Bi tr={line.tr} en={line.en} /></div>
      </div>

      {due > 0 && (
        <button className="btn gold lg block" onClick={startReview} style={{ justifyContent: "space-between" }}>
          <span className="row" style={{ gap: 10 }}><Sparkles size={20} /> <span style={{ textAlign: "left" }}>Yıldızları parlat<span lang="en" className="en small" style={{ display: "block", color: "inherit", opacity: .75 }}>Polish your stars</span></span></span>
          <span className="display num" style={{ fontSize: 20 }}>{due}</span>
        </button>
      )}

      <DailyCard state={state} now={now} onClaim={onClaim} onChest={onChest} />

      {PATH.map((sec) => {
        const showTrack = trackShown !== sec.track.id;
        trackShown = sec.track.id;
        const nodes = [...sec.lessons, sec.boss];
        const doneN = sec.lessons.filter((l) => state.lessons[l.id] && state.lessons[l.id].done).length;
        const crown = state.units[sec.unit.id] && state.units[sec.unit.id].crown;
        const firstLocked = !nodeUnlocked(state, sec.lessons[0]);
        const H = nodes.length * STEP_Y;
        const pts = nodes.map((n, i) => [150 + OFFS[i % OFFS.length], i * STEP_Y + 37]);
        const d = pts.map((p, i) => (i ? `C ${pts[i - 1][0]} ${pts[i - 1][1] + 55}, ${p[0]} ${p[1] - 55}, ${p[0]} ${p[1]}` : `M ${p[0]} ${p[1]}`)).join(" ");
        return (
          <section key={sec.unit.id} className="stack" style={{ gap: 6, marginTop: showTrack ? 18 : 6 }}>
            {showTrack && (
              <div style={{ padding: "6px 2px 8px" }}>
                <div className="eyebrow" style={{ color: "var(--gold)" }}>{sec.track.id === "temel" ? "Bölüm 1" : sec.track.id === "kitap" ? "Bölüm 2 · IB" : "IB+"}</div>
                <h2 className="h1" style={{ fontSize: 22 }}>{sec.track.tr}</h2>
                <div lang="en" className="en small">{sec.track.en}</div>
                <p className="small muted" style={{ margin: "6px 0 0" }}>{sec.track.blurb}</p>
              </div>
            )}
            <div className="unit-banner">
              <div className="stack-sm" style={{ gap: 4, minWidth: 0 }}>
                <span className="eyebrow">{sec.unit.track === "kitap" ? "IB kitapçığı" : sec.unit.track === "ib" ? "Kitapçık dışı" : "Temel"} · {sec.cards.length} formül</span>
                <Bi tr={sec.unit.tr} en={sec.unit.en} className="h2" />
                <div className="row small" style={{ gap: 8 }}>
                  <span className="grow"><Bar pct={doneN / sec.lessons.length} color={crown ? "var(--mint)" : "var(--gold)"} /></span>
                  <span className="num faint" style={{ fontWeight: 600 }}>{doneN}/{sec.lessons.length}</span>
                  {crown ? <Crown size={18} style={{ color: "var(--gold)" }} /> : null}
                </div>
                {firstLocked && <button className="btn soft sm" style={{ alignSelf: "flex-start", marginTop: 4 }} onClick={() => openNode({ jump: true, unit: sec.unit.id })}><Rocket size={15} /> Biliyorum, atla · Test out</button>}
              </div>
              <span className="planet" style={{ background: `radial-gradient(circle at 32% 30%, ${sec.unit.planet[0]}, ${sec.unit.planet[1]})`, "--planet-glow": sec.unit.planet[1] + "55" }}>
                <Tex tex={sec.unit.glyph} />
              </span>
            </div>
            <div className="path" style={{ height: H + 10, padding: 0 }}>
              <div style={{ position: "relative", width: 300, height: H, margin: "0 auto" }}>
                <svg className="orbit" viewBox={`0 0 300 ${H}`} aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
                  <path d={d} fill="none" stroke="var(--line)" strokeWidth="5" strokeDasharray="2 12" strokeLinecap="round" />
                </svg>
                {nodes.map((n, i) => {
                  const status = nodeStatus(state, n, now);
                  const isCur = n.id === cur.id;
                  const x = 150 + OFFS[i % OFFS.length];
                  const lesson = state.lessons[n.id];
                  const first = !n.boss && BY_ID[n.cards[0]];
                  return (
                    <div key={n.id} ref={isCur ? curRef : undefined} className="node-wrap" style={{ position: "absolute", left: x - 60, top: i * STEP_Y }}>
                      <button className={`node ${status}${n.boss ? " boss" : ""}`} onClick={() => openNode(n)}
                        aria-label={n.boss ? `${sec.unit.tr} ünite sınavı` : `Ders ${n.k}: ${first ? first.n.replace(/\$/g, "") : ""}`}>
                        {status === "locked" ? <Lock size={24} /> : n.boss ? <Crown size={30} /> : status === "fade" ? <Sparkles size={26} /> : status === "done" ? <Check size={30} strokeWidth={3} /> : <span style={{ fontSize: 22 }}>{n.k}</span>}
                        {lesson && lesson.stars && !n.boss ? <span className="crown"><Stars3 n={lesson.stars} size={10} /></span> : null}
                      </button>
                      <span className="node-label">
                        {n.boss ? <><span>Ünite sınavı</span><span lang="en" className="en">Unit test</span></> : <><span><Rich text={first.n} /></span></>}
                      </span>
                      {isCur && status === "open" && (
                        <span className="pi-on-path" style={{ left: OFFS[i % OFFS.length] > 0 ? -58 : 112, top: 4 }}>
                          <Pi mood="happy" outfit={state.settings.outfit} size={52} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
      <div className="empty">
        <Pi mood="party" outfit={state.settings.outfit} size={96} />
        <Bi tr="Yolun sonu: AA SL formüllerinin hepsi burada." en="End of the road: every AA SL formula is here." className="h3" />
      </div>
    </div>
  );
}

/** Ders/sınav bilgi sayfası */
export function NodeSheet({ state, now, target, onStart, onClose }) {
  if (target.jump) {
    const sec = PATH.find((p) => p.unit.id === target.unit);
    return (
      <Sheet onClose={onClose} label="Atlama sınavı">
        <div className="stack">
          <div className="row" style={{ gap: 12 }}><Pi mood="think" outfit={state.settings.outfit} size={64} /><Bi tr="Bu üniteyi zaten biliyor musun?" en="Already know this unit?" className="h2" /></div>
          <p className="small muted" style={{ margin: 0 }}>{sec.unit.tr} ünitesinden 8 soru. %85 ve üstü yaparsan üniteyi atlarsın; formüller “biliyor” olarak tekrar takvimine girer. <span lang="en" className="en">8 questions. Score 85%+ to skip the unit.</span></p>
          <button className="btn gold lg block" onClick={() => onStart({ kind: "jump", unit: sec.unit.id })}><Rocket size={18} /> Atlama sınavına başla</button>
        </div>
      </Sheet>
    );
  }
  const n = target;
  const status = nodeStatus(state, n, now);
  const sec = PATH.find((p) => p.unit.id === n.unit);
  const lesson = state.lessons[n.id];
  return (
    <Sheet onClose={onClose} label="Ders">
      <div className="stack">
        <div className="stack-sm">
          <span className="eyebrow">{sec.unit.tr} · <span lang="en" className="en">{sec.unit.en}</span></span>
          {n.boss ? <Bi tr="Ünite sınavı: taçı kazan" en="Unit test: win the crown" className="h1" /> : <Bi tr={`Ders ${n.k}`} en={`Lesson ${n.k}`} className="h1" />}
          {lesson && lesson.stars && <Stars3 n={lesson.stars} size={22} />}
        </div>
        {n.boss ? (
          <p className="small muted" style={{ margin: 0 }}>Ünitenin tüm formüllerinden 10 karışık soru. %80 ile taç ve 40 ✦. <span lang="en" className="en">10 mixed questions. 80% wins the crown and 40 ✦.</span></p>
        ) : (
          <div className="panel tight flat stack-sm" style={{ background: "var(--surface-2)" }}>
            {n.cards.map((id) => {
              const c = BY_ID[id];
              const p = state.cards[id];
              return (
                <div key={id} className="stack-sm" style={{ gap: 2, paddingBottom: 6, borderBottom: "1px solid var(--line)" }}>
                  <div className="row between"><Bi tr={c.n} en={c.ne} className="small" />{p && p.reps ? <Star size={14} fill="currentColor" style={{ color: "var(--gold)", flex: "none" }} /> : null}</div>
                  <div className="formula-box" style={{ textAlign: "left", padding: "2px 0" }}><Formula f={c} size="sm" /></div>
                </div>
              );
            })}
          </div>
        )}
        {status === "locked" ? (
          <div className="stack-sm">
            <p className="small muted" style={{ margin: 0 }}>Bu durak henüz kilitli: önce önceki dersi bitir. <span lang="en" className="en">Locked: finish the previous lesson first.</span></p>
            {sec.lessons[0] && !nodeUnlocked(state, sec.lessons[0]) && <button className="btn soft block" onClick={() => onStart({ kind: "jump", unit: n.unit })}><Rocket size={17} /> Üniteyi atla (8 soru)</button>}
          </div>
        ) : (
          <button className="btn gold lg block" onClick={() => onStart(n.boss ? { kind: "boss", unit: n.unit } : { kind: "lesson", node: n })}>
            {status === "done" || status === "fade" ? <><RotateCcw size={18} /> Tekrar oyna · Replay</> : <><Play size={18} fill="currentColor" /> Başla · Start</>}
          </button>
        )}
      </div>
    </Sheet>
  );
}
