import React, { useEffect, useMemo, useState } from "react";
import { Star, X } from "lucide-react";
import { Rich } from "../lib/tex.jsx";

/** İki dilli metin: Türkçe üstte, İngilizce altta (ayarda kapatılabilir) */
export const EnCtx = React.createContext(true);
export function Bi({ tr, en, className = "", inline = false, trClass = "", enClass = "" }) {
  const show = React.useContext(EnCtx);
  if (inline) {
    return (
      <span className={className}>
        <Rich text={tr} className={trClass} />
        {show && en ? <> <span lang="en" className={"en " + enClass}><Rich text={en} /></span></> : null}
      </span>
    );
  }
  return (
    <span className={"bi " + className}>
      <Rich text={tr} className={trClass} />
      {show && en ? <span lang="en" className={"en " + enClass}><Rich text={en} /></span> : null}
    </span>
  );
}

export function Ring({ size = 112, stroke = 11, pct = 0, color = "var(--gold)", track = "var(--surface-3)", children }) {
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

export function Stars3({ n, size = 18 }) {
  return (
    <span className="stars3" aria-label={`${n}/3 yıldız`}>
      {[1, 2, 3].map((i) => <Star key={i} size={size} fill={i <= n ? "currentColor" : "none"} className={i <= n ? "" : "off"} />)}
    </span>
  );
}

export function Switch({ on, onChange, label }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={"switch" + (on ? " on" : "")} onClick={() => onChange(!on)} />;
}

export function Sheet({ onClose, children, label }) {
  const sheet = React.useRef(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    // odağı sayfaya taşı, Tab’i içeride tut, kapanınca eski yerine döndür; Esc yalnızca en üstteki sayfayı kapatır
    const prev = document.activeElement;
    const el = sheet.current;
    const first = el && el.querySelector("button");
    if (first) first.focus({ preventScroll: true });
    const k = (e) => {
      const all = document.querySelectorAll(".sheet");
      if (all[all.length - 1] !== el) return;
      if (e.key === "Escape") { e.stopImmediatePropagation(); closeRef.current(); return; }
      if (e.key !== "Tab") return;
      const f = [...el.querySelectorAll('button:not([disabled]),[href],input,textarea,select,[tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const a = f[0], b = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === a || !el.contains(document.activeElement))) { e.preventDefault(); b.focus(); }
      else if (!e.shiftKey && (document.activeElement === b || !el.contains(document.activeElement))) { e.preventDefault(); a.focus(); }
    };
    window.addEventListener("keydown", k, true);
    return () => {
      window.removeEventListener("keydown", k, true);
      if (prev && prev.focus && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, []);
  return (
    <div className="scrim" onClick={onClose} role="dialog" aria-modal="true" aria-label={label}>
      <div className="sheet" ref={sheet} onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ marginBottom: 6 }}>
          <div className="grabber" />
          <button className="icon-btn plain" onClick={onClose} aria-label="Kapat"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Matematik sembollerinden yağmur */
const SYM = ["π", "Σ", "√", "∞", "Δ", "θ", "∫", "e", "φ", "λ", "✦", "★", "±", "∂"];
export function Burst() {
  const bits = useMemo(() => Array.from({ length: 48 }, (_, i) => ({
    s: SYM[i % SYM.length], left: Math.random() * 100, dur: 1.6 + Math.random() * 1.6, delay: Math.random() * 0.5,
    size: 16 + Math.random() * 22, rot: `${(Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 360)}deg`,
    color: ["var(--gold)", "var(--sky)", "var(--mint)", "var(--coral)", "var(--violet)"][i % 5],
  })), []);
  return (
    <div className="burst" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{ left: `${b.left}%`, fontSize: b.size, color: b.color, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, "--rot": b.rot }}>{b.s}</span>
      ))}
    </div>
  );
}

/** Bir noktadan kıvılcım saçılması (doğru cevapta) */
export function sparkleAt(x, y, n = 12) {
  if (typeof document === "undefined" || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span");
    el.className = "sparkle";
    const a = (i / n) * Math.PI * 2, d = 40 + Math.random() * 50;
    el.style.left = x + "px"; el.style.top = y + "px";
    el.style.setProperty("--dx", Math.cos(a) * d + "px"); el.style.setProperty("--dy", Math.sin(a) * d + "px");
    if (i % 3 === 1) el.style.background = "var(--sky)";
    if (i % 3 === 2) el.style.background = "var(--mint)";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }
}

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

/** Yıldızlı arka plan: hafif titreşen yıldızlar (canvas) */
export function Cosmos({ dark }) {
  const ref = React.useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return undefined;
    const ctx = cv.getContext("2d");
    let raf, w, h;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + 0.3, p: Math.random() * Math.PI * 2, s: 0.4 + Math.random() * 1.2 }));
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // canlandırma döngüsü yoksa yeniden boyutlanınca yeniden çiz (yoksa gökyüzü boş kalır)
      if (drawn && (reduce || !dark)) draw(performance.now());
    };
    let drawn = false;
    resize();
    window.addEventListener("resize", resize);
    function draw(t) {
      drawn = true;
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        const a = dark ? 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(st.p + (t / 1000) * st.s)) : 0.18;
        ctx.globalAlpha = a;
        ctx.fillStyle = dark ? "#FFFFFF" : "#2D3A7A";
        ctx.beginPath(); ctx.arc(st.x * w, st.y * h, st.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce && dark && !document.hidden) raf = requestAnimationFrame(draw);
    }
    const vis = () => { if (!document.hidden && !reduce && dark) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } };
    document.addEventListener("visibilitychange", vis);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", vis); };
  }, [dark]);
  return <div className="cosmos" aria-hidden="true"><canvas ref={ref} /></div>;
}
