import React, { useEffect, useMemo, useState } from "react";
import { Star, X } from "lucide-react";
import { LEVELS_MEM } from "../lib/srs.js";

/** Halka ilerleme göstergesi */
export function Ring({ size = 112, stroke = 11, pct = 0, color = "var(--accent)", track = "var(--surface-3)", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, pct));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - p)} style={{ transition: "stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  );
}

export const Bar = ({ pct, color }) => (
  <div className="bar" role="progressbar" aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100}>
    <span style={{ width: `${Math.max(0, Math.min(1, pct)) * 100}%`, background: color }} />
  </div>
);

export const lvColor = (lv) => `var(--lv${lv})`;
export const lvInk = (lv) => (lv >= 3 ? "var(--lv-ink-dark)" : "var(--lv-ink-light)");

/** Hafıza seviyelerinin dağılımı */
export function LevelBar({ counts }) {
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="stack-sm">
      <div className="lvbar">
        {counts.map((n, i) => (i === 0 ? null : <span key={i} style={{ width: `${(n / total) * 100}%`, background: lvColor(i) }} />))}
      </div>
      <div className="legend">
        {LEVELS_MEM.map((l, i) => (
          <span key={i}><i style={{ background: lvColor(i) }} />{l.name} <b className="num">{counts[i]}</b></span>
        ))}
      </div>
    </div>
  );
}

export function Prio({ p }) {
  return (
    <span className="prio" title={["", "Ara sıra çıkar", "Sık çıkar", "Çok sık çıkar"][p]}>
      {[1, 2, 3].map((i) => <Star key={i} size={13} fill={i <= p ? "currentColor" : "none"} strokeWidth={2} opacity={i <= p ? 1 : 0.35} />)}
    </span>
  );
}

export function Switch({ on, onChange, label }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={"switch" + (on ? " on" : "")} onClick={() => onChange(!on)} />;
}

/** Alt sayfa (modal) */
export function Sheet({ onClose, children, label }) {
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="scrim" onClick={onClose} role="dialog" aria-modal="true" aria-label={label}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="row between">
          <div className="grabber" style={{ margin: "2px 0 10px" }} />
          <button className="icon-btn plain" onClick={onClose} aria-label="Kapat"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Matematik sembollerinden konfeti */
const SYM = ["π", "Σ", "√", "∞", "Δ", "θ", "∫", "e", "φ", "λ", "±", "÷", "≈", "∂"];
export function Confetti() {
  const bits = useMemo(() => Array.from({ length: 46 }, (_, i) => ({
    s: SYM[i % SYM.length], left: Math.random() * 100, dur: 1.6 + Math.random() * 1.6, delay: Math.random() * 0.5,
    size: 16 + Math.random() * 20, rot: `${(Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 360)}deg`,
    color: ["var(--accent)", "var(--amber)", "var(--green)", "var(--red)"][i % 4],
  })), []);
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{ left: `${b.left}%`, fontSize: b.size, color: b.color, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, "--rot": b.rot }}>{b.s}</span>
      ))}
    </div>
  );
}

/** Küçük çizgi grafik (son günlerin doğruluk oranı) */
export function Spark({ values, height = 56 }) {
  const w = 300, h = height, pad = 6;
  const pts = values.map((v, i) => [pad + (i * (w - 2 * pad)) / Math.max(1, values.length - 1), v == null ? null : h - pad - v * (h - 2 * pad)]);
  const valid = pts.filter((p) => p[1] != null);
  if (valid.length < 2) return <div className="faint small">Birkaç gün çalışınca burada doğruluk eğrin çıkacak.</div>;
  const d = valid.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${d} L${valid[valid.length - 1][0].toFixed(1)},${h - pad} L${valid[0][0].toFixed(1)},${h - pad} Z`;
  const last = valid[valid.length - 1];
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Son günlerin doğruluk oranı">
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={pad} x2={w - pad} y1={h - pad - g * (h - 2 * pad)} y2={h - pad - g * (h - 2 * pad)} stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
      <path d={area} fill="var(--accent-soft)" stroke="none" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="4" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Önümüzdeki günlerin tekrar yükü */
export function Forecast({ values, labels }) {
  const max = Math.max(1, ...values);
  return (
    <div className="forecast" role="img" aria-label="Önümüzdeki günlerdeki tekrar sayıları">
      {values.map((v, i) => (
        <div className="col" key={i}>
          <span className="v">{v}</span>
          <span className={"b" + (v ? "" : " zero")} style={{ height: `${(v / max) * 58 + 3}px` }} />
          <span className="l">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/** Basit sayaç animasyonu */
export function useCountUp(target, ms = 700) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0;
    const tick = (t) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}
