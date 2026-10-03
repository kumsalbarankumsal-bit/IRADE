import React from "react";
import { Play, Plus, RotateCcw, PauseCircle, PlayCircle, Trash2, Pencil, Check } from "lucide-react";
import { Formula, Rich, plain } from "../lib/tex.jsx";
import { Sheet, Prio, lvColor } from "./common.jsx";
import { FormulaFacts } from "./Session.jsx";
import { getF, memLevel, LEVELS_MEM, currentR, MODE_NAMES } from "../lib/srs.js";
import { retrievability, DAY } from "../lib/fsrs.js";
import { fmtWhen, fmtInterval, fmtDate } from "../lib/util.js";
import { TOPIC, LEVEL } from "../data/topics.js";

/** Unutma eğrisi: bugünden itibaren 30 gün, hedef hatırlama çizgisiyle */
function Curve({ p, now, retention }) {
  const W = 320, H = 150, L = 34, R = 10, T = 12, B = 26;
  const span = Math.max(14, Math.min(120, Math.ceil(((p.due - now) / DAY) * 1.6) || 30));
  const x = (d) => L + (d / span) * (W - L - R);
  const y = (r) => T + (1 - r) * (H - T - B);
  const elapsed0 = (now - p.last) / DAY;
  const pts = Array.from({ length: 61 }, (_, i) => {
    const d = (i / 60) * span;
    return [x(d), y(retrievability(elapsed0 + d, p.s))];
  });
  const path = pts.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  const dueD = Math.max(0, (p.due - now) / DAY);
  const ticks = [0, Math.round(span / 2), span];
  return (
    <svg className="curve" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Unutma eğrisi">
      {[1, 0.75, 0.5].map((r) => (
        <g key={r}>
          <line x1={L} x2={W - R} y1={y(r)} y2={y(r)} stroke="var(--line)" strokeWidth="1" />
          <text x={L - 6} y={y(r) + 4} textAnchor="end" fontSize="10" fill="var(--ink-3)" fontWeight="700">%{r * 100}</text>
        </g>
      ))}
      <line x1={L} x2={W - R} y1={y(retention)} y2={y(retention)} stroke="var(--amber)" strokeDasharray="4 4" strokeWidth="1.5" />
      <path d={`${path} L${x(span)},${y(0.5)} L${x(0)},${y(0.5)} Z`} fill="var(--accent-soft)" opacity="0.7" clipPath="none" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
      {dueD <= span && <line x1={x(dueD)} x2={x(dueD)} y1={T} y2={H - B} stroke="var(--red)" strokeWidth="1.5" strokeDasharray="3 3" />}
      {dueD <= span && <text x={Math.min(x(dueD) + 4, W - 60)} y={T + 10} fontSize="10" fill="var(--red)" fontWeight="800">tekrar</text>}
      <circle cx={x(0)} cy={y(retrievability(elapsed0, p.s))} r="4.5" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
      {ticks.map((d) => <text key={d} x={x(d)} y={H - 8} textAnchor={d === 0 ? "start" : d === span ? "end" : "middle"} fontSize="10" fill="var(--ink-3)" fontWeight="700">{d === 0 ? "bugün" : `+${d} g`}</text>)}
    </svg>
  );
}

export default function Detail({ id, state, now, onClose, onStudy, onQueue, onReset, onSuspend, onDeleteCustom, onEditCustom }) {
  const f = getF(state, id);
  if (!f) return null;
  const p = state.cards[id];
  const lv = memLevel(p);
  const R = currentR(p, now);
  const queued = state.queue.includes(id);
  const t = TOPIC[f.t] || TOPIC.ozel;
  const isCustom = f.t === "ozel";

  return (
    <Sheet onClose={onClose} label={plain(f.n)}>
      <div className="stack">
        <h2 className="h2" style={{ paddingRight: 8 }}><Rich text={f.n} /></h2>

        <div className="index-card" style={{ padding: "0 0 16px" }}>
          <div className="card-head">
            <span className="row" style={{ gap: 6, minWidth: 0 }}>
              {f.rank && <span className="tag accent">#{f.rank}</span>}
              {LEVEL[f.lv] && <span className="tag">{LEVEL[f.lv].name}</span>}
              <span className="tag">{t.name}</span>
            </span>
            {f.p ? <Prio p={f.p} /> : null}
          </div>
          <div className="formula-box" style={{ padding: "18px 12px 4px" }}><Formula f={f} size="auto" /></div>
        </div>

        <FormulaFacts f={f} />
        {f.s && <div className="small muted" style={{ borderLeft: "3px solid var(--margin)", paddingLeft: 10 }}><Rich text={f.s} /></div>}

        {f.x && f.x.length > 0 && (
          <div className="card flat tight" style={{ background: "var(--red-soft)", borderColor: "transparent" }}>
            <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 6 }}>Sık yapılan hatalar</div>
            <div className="stack-sm">
              {f.x.map((x, i) => (
                <div key={i} className="formula-box" style={{ textAlign: "left", textDecoration: "line-through", textDecorationColor: "var(--red)", opacity: 0.85 }}>
                  <Formula f={f} rhs={x} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="row between">
            <span className="h3">Hafızadaki durumu</span>
            <span className="tag" style={{ background: lvColor(lv), color: lv >= 3 ? "var(--lv-ink-dark)" : "var(--lv-ink-light)" }}>{LEVELS_MEM[lv].name}</span>
          </div>
          {p && p.reps ? (
            <div className="stack-sm" style={{ marginTop: 10 }}>
              <div className="stat-grid">
                <div className="stat"><b className="num">%{Math.round((R || 0) * 100)}</b><span>Şu an</span></div>
                <div className="stat"><b>{fmtWhen(p.due, now)}</b><span>Sonraki</span></div>
                <div className="stat"><b>{fmtInterval(p.s * DAY)}</b><span>Stabilite</span></div>
              </div>
              <Curve p={p} now={now} retention={state.settings.retention} />
              <div className="row between tiny faint" style={{ fontWeight: 700 }}>
                <span>{p.reps} tekrar · {p.lapses} unutma · zorluk {p.d.toFixed(1).replace(".", ",")}/10</span>
                <span>ilk: {p.h && p.h[0] ? fmtDate(p.h[0][0] * 1000) : "—"}</span>
              </div>
              {p.h && p.h.length > 0 && (
                <div className="hist" aria-label="Son cevaplar">
                  {p.h.map((e, i) => (
                    <i key={i} title={`${fmtDate(e[0] * 1000)} · ${MODE_NAMES[e[2]] || ""}`} style={{ background: e[1] === 1 ? "var(--red)" : e[1] === 2 ? "var(--amber)" : e[1] === 4 ? "var(--accent)" : "var(--green)" }}>
                      {e[1] === 1 ? "✗" : "✓"}
                    </i>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="small muted" style={{ margin: "8px 0 0" }}>{queued ? "Öğrenme listende; bir sonraki derste öğreneceksin." : "Henüz çalışmadın. Listeye ekle ya da hemen dene."}</p>
          )}
        </div>

        <div className="row wrap">
          <button className="btn primary grow" onClick={() => onStudy(id)}><Play size={17} /> Şimdi çalış</button>
          {!(p && p.reps) && !queued && <button className="btn soft grow" onClick={() => onQueue(id)}><Plus size={17} /> Listeye ekle</button>}
          {queued && <span className="tag accent"><Check size={13} /> Listede</span>}
        </div>
        <div className="row wrap" style={{ gap: 6 }}>
          {p && p.reps ? <button className="btn ghost sm" onClick={() => onReset(id)}><RotateCcw size={15} /> Sıfırla</button> : null}
          <button className="btn ghost sm" onClick={() => onSuspend(id)}>{p && p.sus ? <><PlayCircle size={15} /> Tekrara geri al</> : <><PauseCircle size={15} /> Askıya al</>}</button>
          {isCustom && <button className="btn ghost sm" onClick={() => onEditCustom(id)}><Pencil size={15} /> Düzenle</button>}
          {isCustom && <button className="btn ghost sm" style={{ color: "var(--red)" }} onClick={() => onDeleteCustom(id)}><Trash2 size={15} /> Sil</button>}
        </div>
      </div>
    </Sheet>
  );
}
