import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Curve, Point, Readout, LiveTex, Choice, usePlot, nf, tn } from "./kit.jsx";
import { Tex } from "../lib/tex.jsx";

/* Teğet laboratuvarı: bir eğri, üzerinde sürüklenebilir P(x₀, f(x₀)), P’deki teğet doğrusu.
   Eğim üçgeni: sağa 1 adım → teğet f′(x₀) kadar çıkar/iner. Soluk mor kesikli grafik y = f′(x):
   mor nokta (x₀, f′(x₀)) — eğim grafiğinin yüksekliği = altın eğrinin o noktadaki eğimi.
   Büyüteç: P’ye yakından bakınca eğri ile teğet neredeyse aynı çizgi. */

const PI = Math.PI, TAU = 2 * PI, P12 = PI / 12;
const W = 340, H = 270, PAD = 6;
const MINUS = "−";
const ZOOM = 4, MR = 33;                     // büyüteç: yakınlaştırma ve yarıçap (px)

/* ---------- sayı yardımcıları ---------- */
const sn = (v, d = 2) => nf(v, d).replace("-", MINUS);
const ne = (v, d = 2) => sn(v, d).replace(",", ".");
const U = (s) => s.toLocaleUpperCase("tr");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const exact = (v, d = 2) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
const eq = (v) => (exact(v) ? "=" : "\\approx");
const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
const ptTxt = (x, y) => `(${sn(x)}${isInt(x) && isInt(y) ? "," : ";"} ${sn(y)})`;

/** (n/d)·π → TeX (\tfrac) ve düz yazı */
function piFrac(n, d) {
  if (n === 0) return { tt: "0", txt: "0" };
  const g = gcd(n, d); n /= g; d /= g;
  const neg = n < 0, m = Math.abs(n);
  const top = m === 1 ? "\\pi" : `${m}\\pi`, topT = m === 1 ? "π" : `${m}π`;
  if (d === 1) return { tt: (neg ? "-" : "") + top, txt: (neg ? MINUS : "") + topT };
  return { tt: `${neg ? "-" : ""}\\tfrac{${top}}{${d}}`, txt: `${neg ? MINUS : ""}${topT}/${d}` };
}
const pw = (X) => (X.startsWith("-") ? `(${X})` : X);        // kuvvet için: negatifse parantez
const par = (X) => (X.startsWith("-") ? `(${X})` : X);       // çarpım için: negatifse parantez

/* ---------- fonksiyonlar ---------- */
const FUNCS = {
  sq: { tex: "x^2", dtex: "2x", f: (x) => x * x, df: (x) => 2 * x, win: [-3, 3, -2.5, 7.5], kLo: -25, kHi: 25, k0: 10,
    fSub: (X) => `${pw(X)}^2`, dSub: (X) => `2\\cdot ${par(X)}`, stat: true },
  cubic: { tex: "x^3-3x", dtex: "3x^2-3", f: (x) => x ** 3 - 3 * x, df: (x) => 3 * x * x - 3, win: [-2.6, 2.6, -5.4, 5.4], kLo: -22, kHi: 22, k0: 15,
    fSub: (X) => `${pw(X)}^3 - 3\\cdot ${par(X)}`, dSub: (X) => `3\\cdot ${pw(X)}^2 - 3`, stat: true },
  sin: { tex: "\\sin x", dtex: "\\cos x", f: Math.sin, df: Math.cos, win: [-0.6, TAU + 0.6, -2.2, 2.2], kLo: 0, kHi: 24, k0: 4, pi: true,
    fSub: (X) => `\\sin ${X}`, dSub: (X) => `\\cos ${X}`, stat: true },
  exp: { tex: "e^x", dtex: "e^x", f: Math.exp, df: Math.exp, win: [-3, 2.3, -1.3, 8.4], kLo: -25, kHi: 20, k0: 10,
    fSub: (X) => `e^{${X}}`, dSub: (X) => `e^{${X}}` },
  ln: { tex: "\\ln x", dtex: "\\tfrac{1}{x}", f: (x) => (x > 0 ? Math.log(x) : NaN), df: (x) => (x > 0 ? 1 / x : NaN), win: [-0.5, 6, -3.3, 3.3], kLo: 2, kHi: 55, k0: 10,
    fSub: (X) => `\\ln ${X}`, dSub: (X) => `\\tfrac{1}{${X}}` },
};
const xOf = (F, k) => (F.pi ? k * P12 : k / 10);
const xTex = (F, k) => (F.pi ? piFrac(k, 12).tt : tn(k / 10, 1));
const xTxt = (F, k) => (F.pi ? piFrac(k, 12).txt : sn(k / 10, 1));

/* TeX içinde tema renkleri */
const TEX_CSS = ".lab .tg-p{color:var(--gold)}.lab .tg-m{color:var(--violet)}.lab .tg-t{color:var(--coral)}";
const C = (k, t) => `\\htmlClass{tg-${k}}{${t}}`;

/** y − y₁ / x − x₁ — kalıba birebir yerine koyma: y − (−1,13), x − 0 (renk, parantezden sonra) */
const minusTerm = (name, T, cls) => { const t = T.startsWith("-") ? `(${T})` : T; return `${name} - ${cls ? C(cls, t) : t}`; };
/** y = mx + c */
function lineTex(m, c) {
  const approx = !exact(m) || !exact(c);
  const s = approx ? "\\approx" : "=";
  const mR = Math.round(m * 100) / 100, cR = Math.round(c * 100) / 100;
  if (mR === 0) return `y ${s} ${tn(cR)}`;
  const mx = mR === 1 ? "x" : mR === -1 ? "-x" : `${tn(mR)}x`;
  return `y ${s} ${mx}${cR === 0 ? "" : ` ${cR < 0 ? "-" : "+"} ${tn(Math.abs(cR))}`}`;
}

/* ---------- etiket yerleşimi ---------- */
const textW = (s, size) => s.length * size * 0.62 + 6;
function makePlacer(sy, ix, fns, obstacles) {
  const placed = obstacles.slice();
  const hitBox = (r) => placed.some((p) => r.x0 < p.x1 + 2 && r.x1 > p.x0 - 2 && r.y0 < p.y1 + 2 && r.y1 > p.y0 - 2);
  const hitCurve = (r) => fns.some((f) => {
    let prev = null;
    for (let px = r.x0 - 3; px <= r.x1 + 3; px += 2) {
      const y = sy(f(ix(px)));
      if (!Number.isFinite(y)) { prev = null; continue; }
      const lo = prev == null ? y : Math.min(prev, y), hi = prev == null ? y : Math.max(prev, y);
      if (hi >= r.y0 - 3 && lo <= r.y1 + 3) return true;
      prev = y;
    }
    return false;
  });
  const inside = (r) => r.x0 >= PAD + 2 && r.x1 <= W - PAD - 2 && r.y0 >= PAD + 2 && r.y1 <= H - PAD - 2;
  const place = (w, h, centers, must = false) => {
    let fb = null;
    for (const [cx0, cy0] of centers) {
      // kenara taşan adayı içeri kaydır
      const cx = clamp(cx0, PAD + 3 + w / 2, W - PAD - 3 - w / 2), cy = clamp(cy0, PAD + 3 + h / 2, H - PAD - 3 - h / 2);
      const r = { x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2, cx, cy };
      if (!inside(r) || hitBox(r)) continue;
      if (!hitCurve(r)) { placed.push(r); return { ...r, bg: false }; }
      if (!fb) fb = r;
    }
    if (must && fb) { placed.push(fb); return { ...fb, bg: true }; }
    return null;
  };
  place.boxes = placed;
  return place;
}
const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3.4, strokeLinejoin: "round" };
function Lbl({ r, text, color, size = 12 }) {
  if (!r) return null;
  return (
    <g pointerEvents="none">
      {r.bg && <rect x={r.x0} y={r.y0} width={r.x1 - r.x0} height={r.y1 - r.y0} rx="7" fill="var(--plot-bg)" stroke={color} strokeWidth="1.3" />}
      <text x={r.cx} y={r.cy + size * 0.36} fontSize={size} fontWeight="800" textAnchor="middle" fill={color} style={r.bg ? undefined : halo}>{text}</text>
    </g>
  );
}

let clipSeq = 0;

/* ---------- sahne ---------- */
function Scene({ F, k, onDrag, ids }) {
  const { sx, sy, ix, xMin, xMax, yMin, yMax } = usePlot();
  const x0 = xOf(F, k), y0 = F.f(x0), m = F.df(x0);
  const tan = (x) => m * (x - x0) + y0;
  const P = [sx(x0), sy(y0)];
  const inWin = (x, y) => x >= xMin && x <= xMax && y >= yMin && y <= yMax;

  /* eğim üçgeni: sağa (x₀ → x₀+1) ya da sığmazsa sola (x₀−1 → x₀) */
  const right = [[x0 + 1, y0], [x0 + 1, y0 + m]], left = [[x0 - 1, y0 - m], [x0, y0 - m]];
  const score = (vs) => vs.filter(([x, y]) => inWin(x, y)).length;
  const useRight = score(right) >= score(left);
  const runA = useRight ? [x0, y0] : left[0], runB = useRight ? right[0] : left[1];
  const riseA = runB, riseB = useRight ? right[1] : [x0, y0];
  const flat = Math.abs(m) < 1e-9;

  /* f′ noktası */
  const dIn = inWin(x0, m);
  const D = [sx(x0), sy(m)];

  /* eksen yazıları (kit ya da π eksenleri) — etiketler bunların üstüne binmesin */
  const X0 = sx(clamp(0, xMin, xMax)), Y0 = sy(clamp(0, yMin, yMax));
  const ticks = [];
  const xs = F.pi ? PI / 2 : 1;
  for (let j = Math.ceil(xMin / xs); j * xs <= xMax + 1e-9; j++) {
    if (j === 0) continue;
    const t = F.pi ? piFrac(j, 2).txt : nf(j, 2), w = t.length * 6 + 4, ty = Math.min(H - 8, Y0 + 13);
    ticks.push({ x0: sx(j * xs) - w / 2, x1: sx(j * xs) + w / 2, y0: ty - 9, y1: ty + 2 });
  }
  for (let v = Math.ceil(yMin); v <= yMax + 1e-9; v++) {
    if (v === 0) continue;
    const t = nf(v, 2), w = t.length * 6 + 4, tx = Math.max(10, X0 - 5);
    ticks.push({ x0: tx - w, x1: tx, y0: sy(v) - 6, y1: sy(v) + 5 });
  }

  /* etiketler: önce eğim üçgeninin yazıları, sonra P, sonra f′ noktası */
  const keyBoxes = [{ x0: P[0] - 9, x1: P[0] + 9, y0: P[1] - 9, y1: P[1] + 9 }];
  if (dIn) keyBoxes.push({ x0: D[0] - 7, x1: D[0] + 7, y0: D[1] - 7, y1: D[1] + 7 });
  const seg = (A, B) => ({ x0: Math.min(sx(A[0]), sx(B[0])) - 3, x1: Math.max(sx(A[0]), sx(B[0])) + 3, y0: Math.min(sy(A[1]), sy(B[1])) - 3, y1: Math.max(sy(A[1]), sy(B[1])) + 3 });
  if (!flat) keyBoxes.push(seg(runA, runB), seg(riseA, riseB));
  const place = makePlacer(sy, ix, [F.f, F.df, tan], ticks.concat(keyBoxes));
  const side = useRight ? 1 : -1;
  // yükseliş yazısı: dikey kenarın dışında, sığmazsa içinde
  const rM = [sx(riseA[0]), clamp((sy(riseA[1]) + sy(riseB[1])) / 2, PAD + 12, H - PAD - 12)];
  const riseTxt = `${m > 0 ? "+" : ""}${sn(m)}`, rw = textW(riseTxt, 11.5);
  const riseLen = Math.abs(sy(riseA[1]) - sy(riseB[1]));
  const rc = (s_, dy) => [rM[0] + s_ * (rw / 2 + 7), rM[1] + dy];
  const riseR = flat || riseLen < 12 ? null : place(rw, 14, [
    rc(side, 0), rc(side, 14), rc(side, -14), rc(-side, 0), rc(-side, 14), rc(-side, -14), rc(side, 28), rc(side, -28), rc(-side, 28), rc(-side, -28),
  ], true);
  // koşu yazısı "1": yatay kenarın üçgen dışı tarafında
  const runM = [(sx(runA[0]) + sx(runB[0])) / 2, sy(runA[1])];
  const out = (m > 0) === useRight ? 1 : -1;
  const runR = flat ? null : place(16, 14, [
    [runM[0], runM[1] + out * 11], [runM[0] - 14, runM[1] + out * 11], [runM[0] + 14, runM[1] + out * 11],
    [runM[0], runM[1] - out * 11], [runM[0], runM[1] + out * 22],
  ], true);
  // P yazısı
  const pTxt = `(${xTxt(F, k)}${isInt(x0) && isInt(y0) ? "," : ";"} ${sn(y0)})`;
  const pw_ = textW(pTxt, 12);
  const ph = pw_ / 2;
  // aday halkası: P’ye yakından uzağa, önce çaprazlar
  const ring = (dy) => [[-(ph + 4), -1], [ph + 4, -1], [ph + 4, 1], [-(ph + 4), 1], [0, -1], [0, 1], [-ph / 2, -1], [ph / 2, -1]].map(([dx, s_]) => [P[0] + dx, P[1] + s_ * dy]);
  const rings = [ring(19).concat([[P[0] - ph - 14, P[1]], [P[0] + ph + 14, P[1]]]), ring(34), ring(50)];
  // önce yakın halkada temiz yer; yoksa yakın halkada zeminli etiket; o da yoksa bir sonraki halka
  let pR = null;
  for (const rg of rings) { pR = place(pw_, 15, rg) || place(pw_, 15, rg, true); if (pR) break; }
  const dTxt = `f′ = ${sn(m)}`, dw = textW(dTxt, 11.5);
  const dR = dIn && Math.hypot(D[0] - P[0], D[1] - P[1]) > 12 ? place(dw, 14, [
    [D[0] + dw / 2 + 10, D[1]], [D[0] - dw / 2 - 10, D[1]], [D[0] + dw / 2 + 2, D[1] - 17], [D[0] - dw / 2 - 2, D[1] - 17],
    [D[0] + dw / 2 + 2, D[1] + 17], [D[0] - dw / 2 - 2, D[1] + 17],
  ], false) : null;

  /* büyüteç: eğrilerin, yazıların, eksenlerin ve eğim üçgeninin en az örtüldüğü yer (kenarlara yakın tercih) */
  const fns = [F.f, F.df, tan];
  const tri = [runA, runB, riseB].map(([x, y]) => [sx(x), sy(y)]);
  const triBox = { x0: Math.min(...tri.map((p) => p[0])), x1: Math.max(...tri.map((p) => p[0])), y0: Math.min(...tri.map((p) => p[1])), y1: Math.max(...tri.map((p) => p[1])) };
  const near = (b, cx, cy, r) => Math.hypot(clamp(cx, b.x0, b.x1) - cx, clamp(cy, b.y0, b.y1) - cy) < r;
  const cost = ([cx, cy]) => {
    let c = 0;
    for (let px = cx - MR - 4; px <= cx + MR + 4; px += 3) {
      for (const f of fns) {
        const y = sy(f(ix(px)));
        if (Number.isFinite(y) && Math.hypot(px - cx, y - cy) < MR + 5) c += 1;
      }
    }
    for (const b of place.boxes) if (near(b, cx, cy, MR + 5)) c += b.y1 - b.y0 < 13 ? 12 : 60;
    if (near(triBox, cx, cy, MR + 4)) c += 40;
    if (Math.abs(cy - Y0) < MR + 2) c += 6;
    if (Math.abs(cx - X0) < MR + 2) c += 6;
    const edge = Math.min(cx - PAD - MR, W - PAD - MR - cx) + Math.min(cy - PAD - MR, H - PAD - MR - cy);
    return c + edge * 0.04;
  };
  let mc = null, best = Infinity;
  for (let cx = PAD + MR + 6; cx <= W - PAD - MR - 6; cx += 12) {
    for (let cy = PAD + MR + 6; cy <= H - PAD - MR - 6; cy += 12) {
      const v = cost([cx, cy]);
      if (v < best) { best = v; mc = [cx, cy]; }
    }
  }
  const zx = (x) => mc[0] + (sx(x) - P[0]) * ZOOM, zy = (y) => mc[1] + (sy(y) - P[1]) * ZOOM;
  const span = (MR + 4) / ZOOM;
  const path = (f) => {
    let d = "";
    for (let i = 0; i <= 48; i++) {
      const px = P[0] - span + (2 * span * i) / 48, x = ix(px), y = f(x);
      if (!Number.isFinite(y)) continue;
      d += `${d ? "L" : "M"}${zx(x).toFixed(1)},${zy(y).toFixed(1)} `;
    }
    return d;
  };
  const hdx = P[0] - mc[0], hdy = P[1] - mc[1], hl = Math.hypot(hdx, hdy) || 1;
  const hx = hdx / hl, hy = hdy / hl;

  return (
    <g>
      <g clipPath={`url(#${ids.clip})`}>
        {/* f */}
        <Curve f={F.f} samples={420} color="var(--gold)" width={3} />
        {/* f′ grafiği (soluk, kesikli — eˣ’te altın eğrinin tam üstüne biner) */}
        <Curve f={F.df} samples={360} color="var(--violet)" width={2} dashed opacity={0.75} />
        {/* teğet */}
        <line x1={sx(xMin)} y1={sy(tan(xMin))} x2={sx(xMax)} y2={sy(tan(xMax))} stroke="var(--coral)" strokeWidth="2.6" strokeLinecap="round" />
        {/* eğim üçgeni */}
        {!flat && <polygon points={`${sx(runA[0])},${sy(runA[1])} ${sx(runB[0])},${sy(runB[1])} ${sx(riseB[0])},${sy(riseB[1])}`} fill="var(--violet)" fillOpacity="0.1" />}
        {!flat && <line x1={sx(runA[0])} y1={sy(runA[1])} x2={sx(runB[0])} y2={sy(runB[1])} stroke="var(--ink-2)" strokeWidth="2" strokeDasharray="4 3" />}
        {!flat && <line x1={sx(riseA[0])} y1={sy(riseA[1])} x2={sx(riseB[0])} y2={sy(riseB[1])} stroke="var(--violet)" strokeWidth="2.8" strokeLinecap="round" />}
        {/* P ile f′ noktası arası bağ */}
        {dIn && Math.abs(D[1] - P[1]) > 14 && <line x1={P[0]} y1={P[1]} x2={D[0]} y2={D[1]} stroke="var(--ink-3)" strokeWidth="1.3" strokeDasharray="2 4" />}
      </g>
      {dIn && <circle cx={D[0]} cy={D[1]} r="5" fill="var(--violet)" stroke="var(--plot-bg)" strokeWidth="2" />}
      <Lbl r={riseR} text={riseTxt} color="var(--violet)" size={11.5} />
      <Lbl r={runR} text="1" color="var(--ink-2)" size={11.5} />
      <Lbl r={dR} text={dTxt} color="var(--violet)" size={11.5} />
      <Lbl r={pR} text={pTxt} color="var(--gold)" />

      {/* büyüteç */}
      <defs><clipPath id={ids.lens}><circle cx={mc[0]} cy={mc[1]} r={MR - 1} /></clipPath></defs>
      <g pointerEvents="none">
        <line x1={mc[0] + hx * (MR + 1)} y1={mc[1] + hy * (MR + 1)} x2={mc[0] + hx * (MR + 13)} y2={mc[1] + hy * (MR + 13)} stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" />
        <circle cx={mc[0]} cy={mc[1]} r={MR} fill="var(--plot-bg)" />
        <g clipPath={`url(#${ids.lens})`}>
          <path d={path(F.f)} fill="none" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" />
          <path d={path(tan)} fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3" />
          <circle cx={mc[0]} cy={mc[1]} r="4" fill="var(--gold)" stroke="var(--plot-bg)" strokeWidth="1.5" />
        </g>
        <circle cx={mc[0]} cy={mc[1]} r={MR} fill="none" stroke="var(--ink-3)" strokeWidth="2" />
        <text x={mc[0]} y={mc[1] - MR + 12} fontSize="9.5" fontWeight="800" textAnchor="middle" fill="var(--ink-2)" style={halo}>×{ZOOM}</text>
      </g>

      <Point x={x0} y={y0} color="var(--gold)" r={7} draggable onDrag={onDrag} />
    </g>
  );
}

function Swatch({ color, dashed, w = 3 }) {
  return (
    <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true" style={{ flex: "none" }}>
      <line x1="2" y1="5" x2="24" y2="5" stroke={color} strokeWidth={w} strokeDasharray={dashed ? "5 4" : undefined} strokeLinecap="round" />
    </svg>
  );
}

function hintFor(fn, F, m, last) {
  const flat = Math.abs(m) < 1e-9;
  const M = sn(Math.abs(m)), ME = ne(Math.abs(m));
  if (last === null) return ["Altın noktayı eğri boyunca sürükle (ya da kaydırıcıyı oynat): kırmızı teğet her noktada eğrinin o anki yönünü gösterir. Büyüteçe bak: çok yakından eğri ve teğet neredeyse aynı çizgi!",
    "Drag the gold point along the curve (or use the slider): the red tangent shows the curve’s direction at each point. Look in the magnifier: up close, curve and tangent are almost the same line!"];
  if (fn === "exp") return [`eˣ’in süper gücü: eğimi her yerde kendi yüksekliğine eşit (f′ = f = ${sn(m)}). Bu yüzden mor eğim grafiği altın grafiğin tam üstünde!`,
    `The superpower of eˣ: its gradient everywhere equals its own height (f′ = f = ${ne(m)}). That is why the purple gradient graph sits exactly on the gold one!`];
  if (fn === "ln") return [`ln x’in eğimi 1/x = ${sn(m)}. Noktayı sağa sürükle: teğet yatıklaşır ama hiç yatay olmaz, çünkü 1/x asla 0 olmaz.`,
    `The gradient of ln x is 1/x = ${ne(m)}. Drag the point right: the tangent flattens but never becomes horizontal, because 1/x is never 0.`];
  if (flat) return ["Teğet tam yatay! f′(x₀) = 0 → burası durağan nokta (tepe ya da çukur). Mor eğim grafiği de tam burada x eksenini kesiyor.",
    "The tangent is perfectly horizontal! f′(x₀) = 0 → this is a stationary point (a top or a bottom). The purple gradient graph crosses the x-axis right here."];
  if (m > 0) return [`Eğim +${M}: sağa 1 adım gidince teğet ${M} birim YUKARI çıkıyor → fonksiyon artıyor ↗.${F.stat ? " Noktayı sürükle ve teğetin yatay olduğu yeri bul!" : ""}`,
    `Gradient +${ME}: one step right, the tangent goes ${ME} units UP → the function is increasing ↗.${F.stat ? " Drag the point and find where the tangent is flat!" : ""}`];
  return [`Eğim −${M}: sağa 1 adım gidince teğet ${M} birim AŞAĞI iniyor → fonksiyon azalıyor ↘.${F.stat ? " Teğetin yatay olduğu yeri bul!" : ""}`,
    `Gradient −${ME}: one step right, the tangent goes ${ME} units DOWN → the function is decreasing ↘.${F.stat ? " Find where the tangent is flat!" : ""}`];
}

export default function TangentLab() {
  const [fn, setFnRaw] = useState("sq");
  const [k, setKRaw] = useState(FUNCS.sq.k0);
  const [last, setLast] = useState(null);
  const ids = useMemo(() => { const n = ++clipSeq; return { clip: `tg-clip-${n}`, lens: `tg-lens-${n}` }; }, []);
  const F = FUNCS[fn];
  const setFn = (v) => { setFnRaw(v); setKRaw(FUNCS[v].k0); setLast("fn"); };
  const setK = (v) => { setKRaw(clamp(Math.round(v), F.kLo, F.kHi)); setLast("k"); };
  const onDrag = (x) => {
    const nk = clamp(Math.round(F.pi ? x / P12 : x * 10), F.kLo, F.kHi);
    if (nk !== k) { setKRaw(nk); setLast("drag"); }
  };

  const x0 = xOf(F, k), y0 = F.f(x0), m = F.df(x0), c = y0 - m * x0;
  const X = xTex(F, k);
  const live = useMemo(() => {
    const mR = Math.round(m * 100) / 100, yR = Math.round(y0 * 100) / 100;
    const mT = tn(mR), yT = tn(yR);
    const coef = `${C("m", mT)}\\,`;
    return [
      "\\begin{array}{l}",
      `f(x) = ${F.tex} \\;\\Rightarrow\\; f'(x) = ${F.dtex} \\\\[6pt]`,
      `f(${X}) = ${F.fSub(X)} ${eq(y0)} ${C("p", yT)} \\\\[6pt]`,
      `${C("m", "m")} = f'(${X}) = ${F.dSub(X)} ${eq(m)} ${C("m", mT)} \\\\[6pt]`,
      `${minusTerm("y", yT, "p")} = ${coef}\\left(${minusTerm("x", X)}\\right) \\\\[6pt]`,
      `${C("t", lineTex(m, c))}`,
      "\\end{array}",
    ].join("");
  }, [F, X, y0, m, c]);

  const two = (tr, en) => <><span style={{ fontSize: 15 }}>{tr}</span><span className="en" style={{ display: "block", fontSize: 12.5, fontWeight: 500 }}>{en}</span></>;
  const flat = Math.abs(m) < 1e-9;
  const behave = flat ? two("→ durağan", "stationary") : m > 0 ? two("↗ artıyor", "increasing") : two("↘ azalıyor", "decreasing");
  const [hint, hintEn] = hintFor(fn, F, m, last);
  const [xMin, xMax, yMin, yMax] = F.win;

  return (
    <LabShell title="Türev = teğetin eğimi" titleEn="Derivative = gradient of the tangent" hint={hint} hintEn={hintEn}>
      <style>{TEX_CSS}</style>
      <Choice options={Object.entries(FUNCS).map(([value, o]) => ({ value, tex: o.tex }))} value={fn} onChange={setFn} />
      <Plot xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} width={W} height={H} xStep={F.pi ? PI / 2 : 1} yStep={1} axes={!F.pi}
        label={`y = f(x) ve P noktasındaki teğet · tangent at P ${ptTxt(x0, y0)}, eğim · gradient ${nf(m)}`}>
        <defs>
          <clipPath id={ids.clip}><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} rx="9" /></clipPath>
        </defs>
        {F.pi && <PiAxes />}
        <Scene F={F} k={k} onDrag={onDrag} ids={ids} />
      </Plot>
      <div className="legend" style={{ marginTop: -4 }}>
        <span><Swatch color="var(--gold)" /><Tex tex="y=f(x)" /></span>
        <span><Swatch color="var(--coral)" w={2.6} />teğet <span className="en">tangent</span></span>
        <span><Swatch color="var(--violet)" dashed w={2} /><Tex tex="y=f'(x)" /> eğim <span className="en">gradient</span></span>
      </div>
      <Slider tex="x_0" label="noktanın yeri" labelEn="point position" value={k} min={F.kLo} max={F.kHi} step={1} onChange={setK}
        fmt={(v) => (F.pi ? `${piFrac(v, 12).txt} ≈ ${nf(v * P12, 2)}` : sn(v / 10, 1))} color="var(--gold)" />
      <LiveTex tex={live} />
      <Readout items={[
        { label: U("nokta"), labelEn: "point", tex: `P\\left(${X}${isInt(x0) && isInt(y0) ? "," : ";"}\\ ${tn(y0)}\\right)`, color: "var(--gold)" },
        { label: U("eğim"), labelEn: "gradient", tex: `f'(${X}) ${eq(m)} ${tn(m)}`, color: "var(--violet)" },
        { label: U("teğet"), labelEn: "tangent", tex: lineTex(m, c), color: "var(--coral)" },
        { label: U("fonksiyon"), labelEn: "function", value: behave, color: flat ? "var(--mint)" : "var(--sky)" },
      ]} />
    </LabShell>
  );
}

/* sin x için π cinsinden eksenler */
function PiAxes() {
  const { sx, sy, xMin, xMax, yMin, yMax } = usePlot();
  const X0 = sx(Math.min(Math.max(0, xMin), xMax)), Y0 = sy(Math.min(Math.max(0, yMin), yMax));
  const xs = [];
  for (let j = Math.ceil(xMin / (PI / 2)); j * (PI / 2) <= xMax; j++) if (j !== 0) xs.push(j);
  const ys = [];
  for (let v = Math.ceil(yMin); v <= yMax; v++) if (v !== 0) ys.push(v);
  return (
    <g>
      <line x1={PAD} x2={W - PAD} y1={Y0} y2={Y0} stroke="var(--ink-3)" strokeWidth="1.4" />
      <line x1={X0} x2={X0} y1={PAD} y2={H - PAD} stroke="var(--ink-3)" strokeWidth="1.4" />
      {xs.map((j) => <text key={j} x={sx(j * PI / 2)} y={Y0 + 13} fontSize="9.5" textAnchor="middle" fill="var(--ink-3)" fontWeight="600">{piFrac(j, 2).txt}</text>)}
      {ys.map((v) => <text key={v} x={X0 - 5} y={sy(v) + 3} fontSize="9.5" textAnchor="end" fill="var(--ink-3)" fontWeight="600">{sn(v, 0)}</text>)}
      <text x={W - PAD - 2} y={Y0 - 5} fontSize="11" textAnchor="end" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">x</text>
      <text x={X0 + 6} y={PAD + 11} fontSize="11" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">y</text>
    </g>
  );
}
