/* Gökyüzü: her ünite bir takımyıldız, her formül bir yıldız.
   Yıldızın parlaklığı = şu anki hatırlama olasılığı. Tekrar edilmezse yıldız söner. */
import React, { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { Bi, Ring } from "./common.jsx";
import { PATH, BY_ID, memLevel, currentR, dueIds, avgRecall, learned, MEM } from "../lib/learn.js";
import { rng, hashStr } from "../lib/util.js";

const W = 340;

function layout(ids, seed) {
  const n = ids.length;
  const cols = Math.max(2, Math.min(5, Math.ceil(Math.sqrt(n * 1.6))));
  const rows = Math.ceil(n / cols);
  const H = Math.max(130, rows * 74 + 20);
  const cw = (W - 40) / cols, ch = (H - 30) / rows;
  const r = rng(seed);
  return {
    H,
    pts: ids.map((id, i) => {
      const row = Math.floor(i / cols);
      const colRaw = i % cols;
      const col = row % 2 ? cols - 1 - colRaw : colRaw;
      return { id, x: 20 + col * cw + cw * (0.25 + r() * 0.5), y: 15 + row * ch + ch * (0.25 + r() * 0.5) };
    }),
  };
}

export default function Sky({ state, now, openCard, startReview }) {
  const due = dueIds(state, now).length;
  const R = avgRecall(state, now);
  const total = PATH.reduce((a, s) => a + s.cards.length, 0);
  const lit = learned(state).length;
  const layouts = useMemo(() => Object.fromEntries(PATH.map((s) => [s.unit.id, layout(s.cards, hashStr(s.unit.id))])), []);
  return (
    <div className="stack fade-in">
      <div>
        <div className="eyebrow">Gökyüzü · <span className="en" style={{ textTransform: "none", letterSpacing: 0 }}>Your sky</span></div>
        <Bi tr="Her formül bir yıldız. Tekrar ettikçe parlar." en="Every formula is a star. Review it and it shines." className="h1" />
      </div>
      <div className="panel row" style={{ gap: 16 }}>
        <Ring size={92} stroke={9} pct={R || 0} color="var(--gold)">
          <div><div className="display num" style={{ fontSize: 20 }}>{R == null ? "—" : `%${Math.round(R * 100)}`}</div><div className="tiny faint">parlaklık</div></div>
        </Ring>
        <div className="grow stack-sm" style={{ gap: 6 }}>
          <div className="small"><b className="num">{lit}</b>/{total} yıldız yandı <span className="en">stars lit</span></div>
          <div className="small"><b className="num" style={{ color: due ? "var(--coral)" : undefined }}>{due}</b> yıldız sönüyor <span className="en">fading</span></div>
          {due > 0 && <button className="btn gold sm" style={{ alignSelf: "flex-start" }} onClick={startReview}><Sparkles size={15} /> Parlat · Polish</button>}
        </div>
      </div>
      <div className="legend">
        <span><svg width="14" height="14"><circle cx="7" cy="7" r="4" fill="none" stroke="var(--star-off)" strokeWidth="1.5" /></svg> Henüz değil · not yet</span>
        <span><svg width="14" height="14"><circle cx="7" cy="7" r="4" fill="var(--star-dim)" /></svg> Sönüyor · fading</span>
        <span><svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="var(--gold)" /></svg> Parlak · bright</span>
      </div>
      {PATH.map((sec) => {
        const L = layouts[sec.unit.id];
        const pos = Object.fromEntries(L.pts.map((p) => [p.id, p]));
        const litN = sec.cards.filter((id) => state.cards[id] && state.cards[id].reps).length;
        return (
          <div key={sec.unit.id} className="stack-sm">
            <div className="row between">
              <span className="row" style={{ gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: `radial-gradient(circle at 30% 30%, ${sec.unit.planet[0]}, ${sec.unit.planet[1]})`, flex: "none" }} />
                <Bi tr={sec.unit.tr} en={sec.unit.en} className="small" trClass="h3" />
              </span>
              <span className="tiny faint num" style={{ fontWeight: 600 }}>{litN}/{sec.cards.length}</span>
            </div>
            <div className="sky-wrap">
              <svg className="sky-svg" viewBox={`0 0 ${W} ${L.H}`} role="img" aria-label={`${sec.unit.tr}: ${litN} / ${sec.cards.length} yıldız`}>
                <defs>
                  <radialGradient id={`g-${sec.unit.id}`}><stop offset="0" stopColor="var(--gold)" stopOpacity="0.55" /><stop offset="1" stopColor="var(--gold)" stopOpacity="0" /></radialGradient>
                </defs>
                {L.pts.slice(1).map((p, i) => {
                  const a = L.pts[i];
                  const on = state.cards[a.id] && state.cards[a.id].reps && state.cards[p.id] && state.cards[p.id].reps;
                  return <line key={p.id} x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={on ? "var(--gold)" : "var(--star-off)"} strokeOpacity={on ? 0.45 : 0.6} strokeWidth={on ? 1.4 : 1} strokeDasharray={on ? undefined : "2 4"} />;
                })}
                {sec.cards.map((id, i) => {
                  const p = state.cards[id];
                  const P = pos[id];
                  const c = BY_ID[id];
                  const lv = memLevel(p);
                  const r = currentR(p, now);
                  const label = `${c.n.replace(/\$/g, "")} — ${MEM[lv].tr}${r != null ? `, %${Math.round(r * 100)}` : ""}`;
                  if (!lv) {
                    return (
                      <g key={id} className="star" onClick={() => openCard(id)} tabIndex={0} role="button" aria-label={label} onKeyDown={(e) => { if (e.key === "Enter") openCard(id); }}>
                        <circle cx={P.x} cy={P.y} r="14" fill="transparent" />
                        <circle cx={P.x} cy={P.y} r="3.6" fill="none" stroke="var(--star-off)" strokeWidth="1.6" />
                      </g>
                    );
                  }
                  const fading = r < 0.85 || p.due < now;
                  const size = 3 + lv * 1.1;
                  return (
                    <g key={id} className="star" onClick={() => openCard(id)} tabIndex={0} role="button" aria-label={label} onKeyDown={(e) => { if (e.key === "Enter") openCard(id); }}>
                      <circle cx={P.x} cy={P.y} r="16" fill="transparent" />
                      {!fading && <circle cx={P.x} cy={P.y} r={size * 3.2} fill={`url(#g-${sec.unit.id})`} opacity={r} />}
                      <path className={fading ? "" : "twinkle"} style={{ animationDelay: `${(i % 7) * 0.4}s` }}
                        d={`M${P.x} ${P.y - size * 1.7} L${P.x + size * 0.45} ${P.y - size * 0.45} L${P.x + size * 1.7} ${P.y} L${P.x + size * 0.45} ${P.y + size * 0.45} L${P.x} ${P.y + size * 1.7} L${P.x - size * 0.45} ${P.y + size * 0.45} L${P.x - size * 1.7} ${P.y} L${P.x - size * 0.45} ${P.y - size * 0.45} Z`}
                        fill={fading ? "var(--star-dim)" : "var(--gold)"} opacity={fading ? 0.5 + 0.5 * r : 0.6 + 0.4 * r} />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
