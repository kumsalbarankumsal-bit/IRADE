/* Formül ayrıntısı: iki dilli kart, canlı hesap, laboratuvar, sık hatalar, hafıza durumu ve unutma eğrisi */
import React, { useState } from "react";
import { Play, RotateCcw, PauseCircle, PlayCircle, FlaskConical, Star } from "lucide-react";
import { Formula, Rich } from "../lib/tex.jsx";
import { Sheet, Bi } from "./common.jsx";
import { Facts } from "./Lesson.jsx";
import LiveCalc from "./LiveCalc.jsx";
import { BY_ID, UNIT, memLevel, MEM, currentR, MODE } from "../lib/learn.js";
import { retrievability, DAY } from "../lib/fsrs.js";
import { fmtWhen, fmtInterval, fmtDate } from "../lib/util.js";
import { LAB_MAP } from "../labs/index.js";

function Curve({ p, now, retention }) {
  const W = 320, H = 150, L = 34, R = 10, T = 12, B = 26;
  const span = Math.max(14, Math.min(120, Math.ceil(((p.due - now) / DAY) * 1.6) || 30));
  const x = (d) => L + (d / span) * (W - L - R);
  const y = (r) => T + (Math.min(1, Math.max(0.4, r)) - 1) / -0.6 * (H - T - B);
  const e0 = (now - p.last) / DAY;
  const pts = Array.from({ length: 61 }, (_, i) => { const d = (i / 60) * span; return [x(d), y(retrievability(e0 + d, p.s))]; });
  const path = pts.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  const dueD = Math.max(0, (p.due - now) / DAY);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Unutma eğrisi · forgetting curve">
      {[1, 0.75, 0.5].map((r) => (
        <g key={r}><line x1={L} x2={W - R} y1={y(r)} y2={y(r)} stroke="var(--line)" /><text x={L - 6} y={y(r) + 4} textAnchor="end" fontSize="10" fill="var(--ink-3)" fontWeight="600">%{r * 100}</text></g>
      ))}
      <line x1={L} x2={W - R} y1={y(retention)} y2={y(retention)} stroke="var(--gold)" strokeDasharray="4 4" strokeWidth="1.5" />
      <path d={`${path} L${x(span)},${y(0.4)} L${x(0)},${y(0.4)} Z`} fill="var(--gold-soft)" />
      <path d={path} fill="none" stroke="var(--gold)" strokeWidth="2.6" />
      {dueD <= span && <line x1={x(dueD)} x2={x(dueD)} y1={T} y2={H - B} stroke="var(--coral)" strokeWidth="1.5" strokeDasharray="3 3" />}
      {dueD <= span && <text x={Math.min(x(dueD) + 4, W - 70)} y={T + 10} fontSize="10" fill="var(--coral)" fontWeight="700">tekrar · review</text>}
      <circle cx={x(0)} cy={y(retrievability(e0, p.s))} r="4.5" fill="var(--gold)" stroke="var(--surface)" strokeWidth="2" />
      {[0, Math.round(span / 2), span].map((d) => <text key={d} x={x(d)} y={H - 8} textAnchor={d === 0 ? "start" : d === span ? "end" : "middle"} fontSize="10" fill="var(--ink-3)" fontWeight="600">{d === 0 ? "bugün" : `+${d} g`}</text>)}
    </svg>
  );
}

export default function Detail({ id, state, now, onClose, onStudy, onReset, onSuspend, onLab }) {
  const c = BY_ID[id];
  const [lab, setLab] = useState(false);
  if (!c) return null;
  const p = state.cards[id];
  const lv = memLevel(p);
  const R = currentR(p, now);
  const u = UNIT[c.u];
  return (
    <Sheet onClose={onClose} label={c.n.replace(/\$/g, "")}>
      <div className="stack">
        <div className="row wrap" style={{ gap: 6 }}>
          {c.bk && <span className="tag gold">IB {c.bk === "0.0" ? "ön bilgi · prior learning" : c.bk}</span>}
          <span className="tag">{u.tr}</span>
          <span className="tag sky">{u.en}</span>
        </div>
        <Bi tr={c.n} en={c.ne} className="h1" />
        <div className="qcard" style={{ alignItems: "stretch" }}>
          <div className="formula-box"><Formula f={c} size="auto" /></div>
        </div>
        <Facts c={c} />
        {c.c && (
          <div className="panel tight">
            <div className="eyebrow" style={{ marginBottom: 6 }}>Sayılarla oyna · <span className="en">Play with numbers</span></div>
            <LiveCalc card={c} />
          </div>
        )}
        {c.lab && LAB_MAP[c.lab] && (lab ? (
          <div className="panel tight">{React.createElement(LAB_MAP[c.lab], { card: c })}</div>
        ) : (
          <button className="btn soft block" onClick={() => { setLab(true); onLab && onLab(c.lab); }}><FlaskConical size={18} /> Laboratuvarı aç · Open the lab</button>
        ))}
        {c.s && <div className="small muted" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: 10 }}><Rich text={c.s} /></div>}
        {c.x && c.x.length > 0 && (
          <div className="panel tight flat" style={{ background: "var(--coral-soft)", borderColor: "transparent" }}>
            <div className="eyebrow" style={{ color: "var(--coral)", marginBottom: 6 }}>Sık yapılan hatalar · <span style={{ textTransform: "none", letterSpacing: 0 }}>Common mistakes</span></div>
            {c.x.map((x, i) => (
              <div key={i} className="formula-box" style={{ textAlign: "left", textDecoration: "line-through", textDecorationColor: "var(--coral)", opacity: 0.85 }}><Formula f={c} rhs={x} size="sm" /></div>
            ))}
          </div>
        )}
        <div className="panel">
          <div className="row between"><Bi tr="Hafızadaki durumu" en="Memory status" className="h3" /><span className="tag gold">{MEM[lv].tr} · {MEM[lv].en}</span></div>
          {p && p.reps ? (
            <div className="stack-sm" style={{ marginTop: 10 }}>
              <div className="stat-grid">
                <div className="stat"><b className="num">%{Math.round((R || 0) * 100)}</b><span>Şu an</span></div>
                <div className="stat"><b>{fmtWhen(p.due, now)}</b><span>Sonraki</span></div>
                <div className="stat"><b>{fmtInterval(p.s * DAY)}</b><span>Stabilite</span></div>
              </div>
              <Curve p={p} now={now} retention={state.settings.retention} />
              <div className="tiny faint" style={{ fontWeight: 600 }}>{p.reps} tekrar · {p.lapses} unutma · zorluk {p.d.toFixed(1).replace(".", ",")}/10{p.h && p.h[0] ? ` · ilk: ${fmtDate(p.h[0][0] * 1000)}` : ""}</div>
              {p.h && p.h.length > 0 && (
                <div className="row wrap" style={{ gap: 4 }} aria-label="Son cevaplar">
                  {p.h.map((e, i) => (
                    <span key={i} title={`${fmtDate(e[0] * 1000)} · ${(MODE[e[2]] || {}).tr || ""}`} style={{ width: 18, height: 18, borderRadius: 5, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 800, color: "#fff", background: e[1] === 1 ? "var(--coral)" : e[1] === 2 ? "var(--gold-2)" : e[1] === 4 ? "var(--sky)" : "var(--mint)" }}>{e[1] === 1 ? "✗" : "✓"}</span>
                  ))}
                </div>
              )}
            </div>
          ) : <p className="small muted" style={{ margin: "8px 0 0" }}>Henüz öğrenmedin; yolda sırası gelince öğreneceksin ya da hemen dene. <span className="en">Not learned yet.</span></p>}
        </div>
        <button className="btn gold lg block" onClick={() => onStudy(id)}><Play size={18} fill="currentColor" /> Şimdi çalış · Study now</button>
        <div className="row wrap" style={{ gap: 6 }}>
          {p && p.reps ? <button className="btn ghost sm" onClick={() => onReset(id)}><RotateCcw size={15} /> Sıfırla</button> : null}
          <button className="btn ghost sm" onClick={() => onSuspend(id)}>{p && p.sus ? <><PlayCircle size={15} /> Tekrara geri al</> : <><PauseCircle size={15} /> Askıya al</>}</button>
        </div>
      </div>
    </Sheet>
  );
}
