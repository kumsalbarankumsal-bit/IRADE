/* LabKit — etkileşimli laboratuvarlar için ortak yapı taşları.
   Tüm renkler tema değişkenlerinden gelir (--gold, --coral, --mint, --sky, --violet, --ink, --ink-2, --ink-3, --line, --surface-2).
   Koordinatlar matematik koordinatıdır (y yukarı). */
import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { Tex } from "../lib/tex.jsx";

export const COLORS = { gold: "var(--gold)", coral: "var(--coral)", mint: "var(--mint)", sky: "var(--sky)", violet: "var(--violet)", ink: "var(--ink)", ink2: "var(--ink-2)", ink3: "var(--ink-3)", line: "var(--line)" };

/** Türkçe sayı biçimi: 2,5 · en fazla d ondalık, gereksiz sıfırlar atılır */
export function nf(v, d = 2) {
  if (!Number.isFinite(v)) return v > 0 ? "∞" : v < 0 ? "−∞" : "—";
  const r = Math.round(v * 10 ** d) / 10 ** d;
  return (Object.is(r, -0) ? 0 : r).toString().replace(".", ",");
}
/** TeX için sayı: 2{,}5 */
export const tn = (v, d = 2) => nf(v, d).replace(",", "{,}").replace("−", "-");

/* ---------------- Kabuk ---------------- */
export function LabShell({ title, titleEn, children, hint, hintEn }) {
  return (
    <div className="lab">
      {(title || titleEn) && (
        <div className="lab-head">
          {title && <span className="lab-title">{title}</span>}
          {titleEn && <span className="en">{titleEn}</span>}
        </div>
      )}
      {children}
      {(hint || hintEn) && (
        <div className="lab-hint">
          {hint && <span>{hint}</span>}
          {hintEn && <span className="en">{hintEn}</span>}
        </div>
      )}
    </div>
  );
}

/* ---------------- Kaydırıcı ---------------- */
let sliderSeq = 0;
export function Slider({ label, labelEn, tex, value, min, max, step = 1, onChange, fmt = (v) => nf(v, 2), color = "var(--gold)" }) {
  const id = useMemo(() => `lab-s-${++sliderSeq}`, []);
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="lab-slider">
      <label htmlFor={id} className="lab-slider-top">
        <span className="lab-slider-name">
          {tex ? <Tex tex={tex} /> : null}
          {label && <span>{label}</span>}
          {labelEn && <span className="en">{labelEn}</span>}
        </span>
        <b className="lab-slider-val num">{fmt(value)}</b>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${pct}%`, "--thumb": color }} />
    </div>
  );
}

/* ---------------- Okuma kutuları ---------------- */
/** items: [{ label, labelEn, tex, value, color }] — tex varsa KaTeX ile gösterilir */
export function Readout({ items }) {
  return (
    <div className="lab-readout">
      {items.map((it, i) => (
        <div key={i} className="lab-chip" style={it.color ? { "--chip": it.color } : undefined}>
          <span className="lab-chip-label">{it.label}{it.labelEn && <span className="en"> · {it.labelEn}</span>}</span>
          <span className="lab-chip-val">{it.tex ? <Tex tex={it.tex} /> : <b className="num">{it.value}</b>}</span>
        </div>
      ))}
    </div>
  );
}

/** Büyük, canlı formül satırı (sayılar yerine konmuş) */
export function LiveTex({ tex }) {
  return <div className="lab-live"><Tex tex={tex} display /></div>;
}

/* ---------------- Koordinat düzlemi ---------------- */
const PlotCtx = createContext(null);
export const usePlot = () => useContext(PlotCtx);

/**
 * <Plot xMin xMax yMin yMax> — SVG koordinat düzlemi.
 * Çocuklar usePlot() ile { sx, sy, ix, iy, W, H } alır (sx: x→piksel, ix: piksel→x).
 */
export function Plot({ xMin = -5, xMax = 5, yMin = -5, yMax = 5, width = 340, height = 240, grid = true, axes = true, xStep, yStep, xLabel = "x", yLabel = "y", children, label = "Grafik" }) {
  const svgRef = useRef(null);
  const pad = 6;
  const W = width, H = height;
  const sx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad);
  const sy = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad);
  const ix = (px) => xMin + ((px - pad) / (W - 2 * pad)) * (xMax - xMin);
  const iy = (py) => yMin + ((H - pad - py) / (H - 2 * pad)) * (yMax - yMin);
  const niceStep = (span) => { const raw = span / 8; const p = 10 ** Math.floor(Math.log10(raw)); const m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; };
  const xs = xStep || niceStep(xMax - xMin), ys = yStep || niceStep(yMax - yMin);
  const ticks = (a, b, s) => { const out = []; for (let v = Math.ceil(a / s) * s; v <= b + 1e-9; v += s) out.push(Math.round(v / s) * s); return out; };
  const ctx = { sx, sy, ix, iy, W, H, xMin, xMax, yMin, yMax, svgRef };
  const x0 = Math.min(Math.max(0, xMin), xMax), y0 = Math.min(Math.max(0, yMin), yMax);
  return (
    <PlotCtx.Provider value={ctx}>
      <svg ref={svgRef} className="lab-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ touchAction: "none" }}>
        <rect x="0" y="0" width={W} height={H} rx="14" fill="var(--plot-bg)" />
        {grid && ticks(xMin, xMax, xs).map((v) => <line key={"gx" + v} x1={sx(v)} x2={sx(v)} y1={pad} y2={H - pad} stroke="var(--plot-grid)" strokeWidth="1" />)}
        {grid && ticks(yMin, yMax, ys).map((v) => <line key={"gy" + v} y1={sy(v)} y2={sy(v)} x1={pad} x2={W - pad} stroke="var(--plot-grid)" strokeWidth="1" />)}
        {axes && (
          <g>
            <line x1={pad} x2={W - pad} y1={sy(y0)} y2={sy(y0)} stroke="var(--ink-3)" strokeWidth="1.4" />
            <line y1={pad} y2={H - pad} x1={sx(x0)} x2={sx(x0)} stroke="var(--ink-3)" strokeWidth="1.4" />
            {ticks(xMin, xMax, xs).filter((v) => Math.abs(v) > 1e-9).map((v) => (
              <text key={"tx" + v} x={sx(v)} y={Math.min(H - 8, sy(y0) + 13)} fontSize="9.5" textAnchor="middle" fill="var(--ink-3)" fontWeight="600">{nf(v, 2)}</text>
            ))}
            {ticks(yMin, yMax, ys).filter((v) => Math.abs(v) > 1e-9).map((v) => (
              <text key={"ty" + v} x={Math.max(10, sx(x0) - 5)} y={sy(v) + 3} fontSize="9.5" textAnchor="end" fill="var(--ink-3)" fontWeight="600">{nf(v, 2)}</text>
            ))}
            <text x={W - pad - 2} y={sy(y0) - 5} fontSize="11" textAnchor="end" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">{xLabel}</text>
            <text x={sx(x0) + 6} y={pad + 11} fontSize="11" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">{yLabel}</text>
          </g>
        )}
        {children}
      </svg>
    </PlotCtx.Provider>
  );
}

/** Fonksiyon eğrisi (süreksizliklerde çizgiyi böler) */
export function Curve({ f, from, to, samples = 240, color = "var(--gold)", width = 2.6, dashed = false, opacity = 1 }) {
  const { sx, sy, xMin, xMax, yMin, yMax } = usePlot();
  const a = from ?? xMin, b = to ?? xMax;
  let d = "", pen = false, prevY = null;
  const span = yMax - yMin;
  for (let i = 0; i <= samples; i++) {
    const x = a + ((b - a) * i) / samples;
    let y;
    try { y = f(x); } catch (e) { y = NaN; }
    const ok = Number.isFinite(y) && y > yMin - span * 3 && y < yMax + span * 3;
    const jump = prevY != null && Number.isFinite(y) && Math.abs(y - prevY) > span * 1.5;
    if (!ok || jump) { pen = false; prevY = ok ? y : null; if (!ok) continue; }
    d += `${pen ? "L" : "M"}${sx(x).toFixed(1)},${sy(Math.max(yMin - span, Math.min(yMax + span, y))).toFixed(1)} `;
    pen = true; prevY = y;
  }
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={dashed ? "6 5" : undefined} opacity={opacity} clipPath="none" />;
}

/** İki eğri (ya da eğri ile x ekseni) arasındaki alan */
export function Area({ f, g = () => 0, from, to, samples = 160, color = "var(--gold)", opacity = 0.28 }) {
  const { sx, sy } = usePlot();
  const pts = [], back = [];
  for (let i = 0; i <= samples; i++) {
    const x = from + ((to - from) * i) / samples;
    pts.push(`${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`);
    back.unshift(`${sx(x).toFixed(1)},${sy(g(x)).toFixed(1)}`);
  }
  return <polygon points={pts.concat(back).join(" ")} fill={color} opacity={opacity} stroke="none" />;
}

export function Segment({ x1, y1, x2, y2, color = "var(--ink-2)", width = 2, dashed = false }) {
  const { sx, sy } = usePlot();
  return <line x1={sx(x1)} y1={sy(y1)} x2={sx(x2)} y2={sy(y2)} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "5 4" : undefined} strokeLinecap="round" />;
}

export function Polygon({ points, color = "var(--sky)", fillOpacity = 0.18, stroke = true }) {
  const { sx, sy } = usePlot();
  return <polygon points={points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ")} fill={color} fillOpacity={fillOpacity} stroke={stroke ? color : "none"} strokeWidth="2" strokeLinejoin="round" />;
}

export function Label({ x, y, children, color = "var(--ink)", dx = 0, dy = 0, size = 12, anchor = "middle", weight = 700, italic = false }) {
  const { sx, sy } = usePlot();
  return <text x={sx(x) + dx} y={sy(y) + dy} fontSize={size} textAnchor={anchor} fill={color} fontWeight={weight} fontStyle={italic ? "italic" : undefined} style={{ paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3 }}>{children}</text>;
}

/** Nokta; draggable ise sürüklenebilir (onDrag(x, y) matematik koordinatında) */
export function Point({ x, y, color = "var(--gold)", r = 6, label, draggable = false, onDrag, snap = 0 }) {
  const { sx, sy, ix, iy, svgRef, xMin, xMax, yMin, yMax } = usePlot();
  const [drag, setDrag] = useState(false);
  const toMath = (e) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    let mx = Math.min(xMax, Math.max(xMin, ix(p.x))), my = Math.min(yMax, Math.max(yMin, iy(p.y)));
    if (snap) { mx = Math.round(mx / snap) * snap; my = Math.round(my / snap) * snap; }
    return [mx, my];
  };
  const handlers = draggable ? {
    onPointerDown: (e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); },
    onPointerMove: (e) => { if (drag && onDrag) onDrag(...toMath(e)); },
    onPointerUp: () => setDrag(false),
    onPointerCancel: () => setDrag(false),
  } : {};
  return (
    <g style={{ cursor: draggable ? (drag ? "grabbing" : "grab") : undefined }} {...handlers}>
      {draggable && <circle cx={sx(x)} cy={sy(y)} r={r + 12} fill={color} opacity={drag ? 0.22 : 0.12} />}
      <circle cx={sx(x)} cy={sy(y)} r={r} fill={color} stroke="var(--plot-bg)" strokeWidth="2.5" />
      {label && <text x={sx(x) + 9} y={sy(y) - 9} fontSize="11.5" fontWeight="700" fill={color} style={{ paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3 }}>{label}</text>}
    </g>
  );
}

/** Seçenek düğmeleri (ör. fonksiyon seçimi) */
export function Choice({ options, value, onChange }) {
  return (
    <div className="lab-choice" role="radiogroup">
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} className={value === o.value ? "on" : ""} onClick={() => onChange(o.value)}>
          {o.tex ? <Tex tex={o.tex} /> : o.label}
        </button>
      ))}
    </div>
  );
}

/** Basit sayı girişi (ör. bölünebilme laboratuvarı) */
export function NumberInput({ value, onChange, label, labelEn, min, max }) {
  const id = useMemo(() => `lab-n-${++sliderSeq}`, []);
  return (
    <label className="lab-num" htmlFor={id}>
      <span>{label}{labelEn && <span className="en"> · {labelEn}</span>}</span>
      <input id={id} type="number" inputMode="numeric" value={value} min={min} max={max}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
    </label>
  );
}
