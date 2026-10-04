import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Segment, Point, Readout, LiveTex, Choice, usePlot, nf } from "./kit.jsx";

/* Üstel ve logaritma laboratuvarı: y = aˣ (altın) ve y = logₐx (mavi) birbirinin y = x aynasındaki görüntüsü.
   Altın noktayı (x, aˣ) sürükle: mavi ikizi (aˣ, x) aynada onu izler → aˣ = y ⇔ x = logₐ y.
   Eksenler eşit ölçekli (1 birim = 32,8 px) ki ayna gerçekten ayna gibi görünsün. */

const W = 340;
const XMIN = -4, XMAX = 6, YMIN = -3, YMAX = 6;
const UNIT = (W - 12) / (XMAX - XMIN);
const H = 12 + UNIT * (YMAX - YMIN);           // ≈ 307,2 → eşit ölçek
const MINUS = "−";
const MIRROR_W = 104;     // eğik "y = x · ayna · mirror" yazısının uzunluğu (px)
let clipSeq = 0;

/* ---------- sayı yardımcıları ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const sn = (v, d = 2) => nf(v, d).replace("-", MINUS);
const ne = (v, d = 2) => sn(v, d).replace(",", ".");
const tx = (v, d = 2) => nf(v, d).replace(",", "{,}");
const exactAt = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
const eqT = (v, d = 2) => (exactAt(v, d) ? "=" : "\\approx");
const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
const pt = (x, y) => `(${sn(x)}${isInt(x) && isInt(y) ? "," : ";"} ${sn(y)})`;
const U = (s) => s.toLocaleUpperCase("tr");
const isE = (a) => Math.abs(a - Math.E) < 1e-9;
const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3.2, strokeLinejoin: "round" };

/* ---------- çakışmasız etiket yerleşimi (en az çakışan adaya düşer) ---------- */
function place(items, obstacles, box) {
  const placed = obstacles.slice(), out = [];
  // çakışma alanı × ağırlık (eğri/nokta çakışması, eksen sayısına değmekten daha kötü)
  const ov = (r) => placed.reduce((s, p) => s + (p.wt ?? 1) * Math.max(0, Math.min(r.x1, p.x1 + 2) - Math.max(r.x0, p.x0 - 2)) * Math.max(0, Math.min(r.y1, p.y1 + 2) - Math.max(r.y0, p.y0 - 2)), 0);
  for (const it of items) {
    let pick = null, best = null;
    for (const [idx, [ax, ay]] of it.at.entries()) {
      const x = clamp(ax, box.x0 + it.w / 2, box.x1 - it.w / 2), y = clamp(ay, box.y0 + it.h / 2, box.y1 - it.h / 2);
      const pd = it.pad || 0;
      const r = { x0: x - it.w / 2 - pd, y0: y - it.h / 2, x1: x + it.w / 2 + pd, y1: y + it.h / 2 };
      const o = ov(r);
      if (o === 0) { pick = { x, y, r }; break; }
      const score = o + idx * 4;
      if (!best || score < best.o) best = { x, y, r, o: score };
    }
    const got = pick || (it.must ? best : null);
    if (got) { placed.push(got.r); out.push({ ...it, ...got }); }
  }
  return out;
}

/** taban için alt indis: log₂, log₀,₅ … (SVG tspan) */
function LogTxt({ a }) {
  if (isE(a)) return <tspan>ln x</tspan>;
  return <tspan>log<tspan dy="3.5" fontSize="0.72em">{sn(a, 2)}</tspan><tspan dy="-3.5"> x</tspan></tspan>;
}
function ExpTxt({ a }) {
  return <tspan>{isE(a) ? "e" : sn(a, 2)}<tspan dy="-5" fontSize="0.72em">x</tspan><tspan dy="5"> </tspan></tspan>;
}

function Tag({ x, y, w, h, color, sub, children }) {
  return (
    <g pointerEvents="none">
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="8" fill="var(--plot-bg)" opacity="0.94" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="8" fill={color} fillOpacity="0.13" stroke={color} strokeWidth="1.4" />
      <text x={x} y={y - 4} fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--ink-2)">{sub}</text>
      <text x={x} y={y + 10.5} fontSize="12" fontWeight="800" textAnchor="middle" fill={color}>{children}</text>
    </g>
  );
}

/* ---------- sahne ---------- */
function Scene({ a, t, lo, hi, setT }) {
  const { sx, sy } = usePlot();
  const cid = useMemo(() => `explog-clip-${++clipSeq}`, []);
  const L = Math.log(a);
  const ex = (x) => Math.exp(x * L);
  const lg = (y) => Math.log(y) / L;
  const yP = ex(t);

  // parametrik yol: dışarı taşan noktalarda kalem kalkar, kırpma ile kenarda temiz biter
  const path = (fn, t0, t1, N = 260) => {
    let d = "", pen = false;
    for (let i = 0; i <= N; i++) {
      const s = t0 + ((t1 - t0) * i) / N;
      const [x, y] = fn(s);
      const ok = Number.isFinite(x) && Number.isFinite(y) && x > XMIN - 4 && x < XMAX + 4 && y > YMIN - 4 && y < YMAX + 4;
      if (!ok) { pen = false; continue; }
      d += `${pen ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)} `;
      pen = true;
    }
    return d;
  };
  const expD = path((s) => [s, ex(s)], XMIN - 0.5, XMAX + 0.5);
  const logD = path((s) => [ex(s), s], YMIN - 0.5, YMAX + 0.5);

  // --- etiketler (eğriler, ayna ve bağlantılar engel sayılır)
  const up = a > 1;
  const obstacles = [];
  const dot = (x, y, r = 5, wt = 3) => obstacles.push({ x0: sx(x) - r, y0: sy(y) - r, x1: sx(x) + r, y1: sy(y) + r, wt });
  // eğri boyunca her ~5 pikselde bir küçük engel
  const trace = (fn, s0, s1, r = 2.5) => {
    let lx = null, ly = null;
    for (let i = 0; i <= 900; i++) {
      const [x, y] = fn(s0 + ((s1 - s0) * i) / 900);
      if (!(x > XMIN && x < XMAX && y > YMIN && y < YMAX)) { lx = null; continue; }
      const px = sx(x), py = sy(y);
      if (lx == null || Math.hypot(px - lx, py - ly) >= 5) { obstacles.push({ x0: px - r, y0: py - r, x1: px + r, y1: py + r, wt: 2 }); lx = px; ly = py; }
    }
  };
  trace((s) => [s, ex(s)], XMIN, XMAX);
  trace((s) => [ex(s), s], YMIN, YMAX);
  const seg = (x1, y1, x2, y2) => { const n = Math.max(2, Math.ceil(Math.hypot(sx(x2) - sx(x1), sy(y2) - sy(y1)) / 5)); for (let k = 0; k <= n; k++) dot(x1 + ((x2 - x1) * k) / n, y1 + ((y2 - y1) * k) / n, 1.5, 2); };
  seg(0, 1, 1, 0); seg(t, yP, yP, t);
  for (let k = XMIN + 1; k < XMAX; k++) if (k !== 0) obstacles.push({ x0: sx(k) - 7, y0: sy(0) + 4, x1: sx(k) + 7, y1: sy(0) + 16, wt: 0.7 });   // x sayıları
  for (let k = YMIN; k < YMAX; k++) if (k !== 0) obstacles.push({ x0: sx(0) - 18, y0: sy(k) - 5, x1: sx(0) - 3, y1: sy(k) + 6, wt: 0.7 });       // y sayıları
  obstacles.push({ x0: sx(0) + 2, y0: 4, x1: sx(0) + 14, y1: 20 }, { x0: W - 18, y0: sy(0) - 16, x1: W - 4, y1: sy(0) - 2 });            // eksen adları
  obstacles.push({ x0: 0, y0: sy(0) - 2.5, x1: W, y1: sy(0) + 2.5, wt: 0.5 }, { x0: sx(0) - 2.5, y0: 0, x1: sx(0) + 2.5, y1: H, wt: 0.5 });       // eksen/asimptot çizgileri
  dot(t, yP, 9); dot(yP, t, 9); dot(0, 1, 6); dot(1, 0, 6);
  // ayna yazısı: y = x doğrusunun üstüne, 45° eğik, boş bir yerde (doğrunun kendisi engel sayılmaz)
  let mirror = null;
  {
    const half = MIRROR_W / 2, foot = (v) => Array.from({ length: 13 }, (_, k) => { const u = ((k - 6) / 6) * half; const cx = sx(v) + u * Math.SQRT1_2, cy = sy(v) - u * Math.SQRT1_2; return { x0: cx - 6.5, y0: cy - 6.5, x1: cx + 6.5, y1: cy + 6.5 }; });
    const free = (bs) => bs.every((b) => b.x0 > 12 && b.x1 < W - 12 && b.y0 > 12 && b.y1 < H - 12 && !obstacles.some((p) => b.x0 < p.x1 && b.x1 > p.x0 && b.y0 < p.y1 && b.y1 > p.y0));
    const vs = [4.4, 4.2, 4.6, 4, 3.8, 3.6, 3.4, 3.2, 2.9, 2.6, 2.3, 2, -1.2, -1.4, -1.6];
    for (const v of vs) { const f = foot(v); if (free(f)) { mirror = v; obstacles.push(...f); break; } }
  }
  trace((s) => [s, s], YMIN, YMAX, 2);
  obstacles.push({ x0: sx((t + yP) / 2) - 5, y0: sy((t + yP) / 2) - 5, x1: sx((t + yP) / 2) + 5, y1: sy((t + yP) / 2) + 5, wt: 3 });   // orta nokta

  const items = [];
  const small = (key, x, y, text, color) => {
    const w = text.length * 6.4 + 6, h = 13, px = sx(x), py = sy(y), o = 14;
    items.push({ key, text, color, w, h, kind: "pt", must: true,
      at: [[px + w / 2 + 7, py - o], [px - w / 2 - 7, py - o], [px + w / 2 + 7, py + o], [px - w / 2 - 7, py + o], [px, py - o - 4], [px, py + o + 4], [px + w / 2 + 10, py], [px - w / 2 - 10, py],
        [px + w / 2 + 5, py + 2 * o], [px - w / 2 - 5, py + 2 * o], [px + w / 2 + 5, py - 2 * o], [px - w / 2 - 5, py - 2 * o]] });
  };
  small("P", t, yP, pt(t, yP), "var(--gold)");
  small("Q", yP, t, pt(yP, t), "var(--sky)");
  if (Math.abs(t) > 1e-9) {          // x = 0 iken P = (0, 1) ve P′ = (1, 0): ikinci kez yazma
    small("A", 0, 1, "(0, 1)", "var(--gold)");
    small("B", 1, 0, "(1, 0)", "var(--sky)");
  }
  // eğri adları: eğri üzerindeki birkaç çapa noktasının çevresinde aday konumlar
  const around = (anchors, w, h, order) => [1, 1.8].flatMap((k) => anchors.flatMap(([px, py]) => order.map(([ux, uy]) => [px + ux * (w / 2 + 12 * k), py + uy * (h / 2 + 9) * k])));
  const EXP_ORDER = [[-1, 0], [-1, -1], [-1, 1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1]];
  const LOG_ORDER = [[0, 1], [1, 0], [1, 1], [1, -1], [-1, 1], [0, -1], [-1, 0], [-1, -1]];
  const tAnch = [lg(4.9), lg(3.8), lg(2.7), lg(1.8), -2.2, -3.2, 4.2, 5.2].map((tt) => clamp(tt, XMIN + 0.3, XMAX - 0.3));
  const anchorsE = tAnch.map((tt) => [tt, ex(tt)]).filter(([, y]) => y > YMIN + 0.2 && y < YMAX - 0.2);
  const hT = 31;
  const expTxt = (isE(a) ? "y = e" : `y = ${sn(a)}`) + "x";
  const wE = Math.max(expTxt.length * 7 + 18, 104);
  items.push({ key: "ce", kind: "exp", color: "var(--gold)", sub: "üstel · exponential", w: wE, h: hT, must: true,
    at: [...around(anchorsE.map(([x, y]) => [sx(x), sy(y)]), wE, hT, EXP_ORDER), ...[4.3, 3.3, 5.3, 2.4].map((v) => [sx(XMIN) + wE / 2 + 6, sy(v)])] });
  const logTxt = isE(a) ? "y = ln x" : `y = log${sn(a)} x`;
  const wL = Math.max(logTxt.length * 7 + 14, 116);
  items.push({ key: "cl", kind: "log", color: "var(--sky)", sub: "logaritma · logarithm", w: wL, h: hT, must: true,
    at: [...around(anchorsE.map(([x, y]) => [sx(y), sy(x)]), wL, hT, LOG_ORDER), ...[-2.4, -1.4, 4.4, 5.3].map((v) => [sx(XMAX) - wL / 2 - 6, sy(v)])] });
  // asimptot etiketleri: kesikli çizgilerin hemen yanında küçük "y = 0" / "x = 0" (yaklaşılan uçtan başlayarak)
  {
    const w = 38, h = 14, yb0 = sy(0), x0p = sx(0);
    const xs = (up ? [-3.3, -2.4, -1.5, 5.3, 4.4, 3.5, 2.6] : [5.3, 4.4, 3.5, 2.6, -3.3, -2.4, -1.5]).map(sx);
    items.push({ key: "ay", kind: "asy", text: "y = 0", color: "var(--gold)", w, h, pad: 3, must: true,
      at: [...xs.map((x) => [x, yb0 - 11]), ...xs.map((x) => [x, yb0 + 27])] });
    const ys = (up ? [-2.6, -1.9, -1.2, 5.4, 4.6, 3.8] : [5.4, 4.6, 3.8, -2.6, -1.9, -1.2]).map(sy);
    items.push({ key: "ax", kind: "asy", text: "x = 0", color: "var(--sky)", w, h, pad: 3, must: true,
      at: [...ys.map((y) => [x0p + w / 2 + 6, y]), ...ys.map((y) => [x0p - w / 2 - 22, y])] });
  }
  const box = { x0: 5, y0: 5, x1: W - 5, y1: H - 5 };
  const tags = place(items, obstacles, box);

  return (
    <g>
      <defs><clipPath id={cid}><rect x="6" y="6" width={W - 12} height={H - 12} rx="10" /></clipPath></defs>
      {/* asimptotlar */}
      <Segment x1={XMIN} y1={0} x2={XMAX} y2={0} color="var(--gold)" width={2} dashed />
      <Segment x1={0} y1={YMIN} x2={0} y2={YMAX} color="var(--sky)" width={2} dashed />

      {/* ayna y = x */}
      <Segment x1={YMIN} y1={YMIN} x2={YMAX} y2={YMAX} color="var(--ink-3)" width={1.6} dashed />

      {/* eğriler */}
      <g clipPath={`url(#${cid})`}>
        <path d={logD} fill="none" stroke="var(--sky)" strokeWidth="8" opacity="0.16" strokeLinecap="round" strokeLinejoin="round" />
        <path d={logD} fill="none" stroke="var(--sky)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={expD} fill="none" stroke="var(--gold)" strokeWidth="8" opacity="0.18" strokeLinecap="round" strokeLinejoin="round" />
        <path d={expD} fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* (0,1) ↔ (1,0) ve P ↔ P′ ayna çiftleri */}
      <Segment x1={0} y1={1} x2={1} y2={0} color="var(--violet)" width={1.4} dashed />
      <Segment x1={t} y1={yP} x2={yP} y2={t} color="var(--violet)" width={1.8} dashed />
      <circle cx={sx((t + yP) / 2)} cy={sy((t + yP) / 2)} r="3.2" fill="var(--violet)" />
      <Point x={0} y={1} color="var(--gold)" r={5} />
      <Point x={1} y={0} color="var(--sky)" r={5} />
      <Point x={yP} y={t} color="var(--sky)" r={7} draggable onDrag={(mx, my) => setT(Math.round(clamp(my, lo, hi) * 10) / 10)} />
      <Point x={t} y={yP} color="var(--gold)" r={7} draggable onDrag={(mx) => setT(Math.round(clamp(mx, lo, hi) * 10) / 10)} />

      {mirror != null && (
        <g transform={`rotate(-45 ${sx(mirror)} ${sy(mirror)})`} pointerEvents="none">
          <rect x={sx(mirror) - MIRROR_W / 2} y={sy(mirror) - 8} width={MIRROR_W} height="16" rx="8" fill="var(--plot-bg)" stroke="var(--ink-3)" strokeOpacity="0.5" strokeWidth="1" />
          <text x={sx(mirror)} y={sy(mirror) + 3.3} fontSize="9.5" fontWeight="800" textAnchor="middle" fill="var(--ink-2)">
            y = x<tspan fontWeight="600" fill="var(--ink-3)"> · ayna · mirror</tspan>
          </text>
        </g>
      )}
      {/* etiketler */}
      {[...tags.filter((tg) => tg.kind !== "pt"), ...tags.filter((tg) => tg.kind === "pt")].map((tg) => {
        if (tg.kind === "pt") return <text key={tg.key} x={tg.x} y={tg.y + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill={tg.color} style={halo}>{tg.text}</text>;
        if (tg.kind === "exp") return <Tag key={tg.key} {...tg}>y = <ExpTxt a={a} /></Tag>;
        if (tg.kind === "log") return <Tag key={tg.key} {...tg}>y = <LogTxt a={a} /></Tag>;
        if (tg.kind === "asy") return <text key={tg.key} x={tg.x} y={tg.y + 4} fontSize="11" fontWeight="800" fontStyle="italic" textAnchor="middle" fill={tg.color} style={halo}>{tg.text}</text>;
        return (
          <g key={tg.key}>
            <text x={tg.x} y={tg.y - 2} fontSize="11.5" fontWeight="800" textAnchor="middle" fill="var(--ink-2)" style={halo}>y = x</text>
            <text x={tg.x} y={tg.y + 10} fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--ink-3)" style={halo}>ayna · mirror</text>
          </g>
        );
      })}
    </g>
  );
}

export default function ExpLogLab({ card }) {
  const id = (card && card.id) || "";
  const [a, setA] = useState(/(^|-)ln|nat|euler|-e-|exp-e/.test(id) ? Math.E : 2);
  const [tRaw, setT] = useState(2);

  // x’in izinli aralığı: hem P = (x, aˣ) hem P′ = (aˣ, x) görünür kalsın (aˣ ≤ 6)
  const range = (b) => {
    const cap = Math.log(6) / Math.log(b);
    const lo = b > 1 ? -3 : Math.max(-3, cap), hi = b > 1 ? Math.min(5.5, cap) : 5.5;
    return [Math.ceil(lo * 10 - 1e-9) / 10, Math.floor(hi * 10 + 1e-9) / 10];
  };
  const [lo, hi] = range(a);
  const t = clamp(tRaw, lo, hi);
  const onA = (v) => {
    const nv = v === 1 ? (a > 1 ? 0.9 : 1.1) : Math.round(v * 10) / 10;
    setA(nv);
    const [l2, h2] = range(nv);
    setT((p) => clamp(p, l2, h2));
  };
  const onPreset = (k) => {
    const nv = k === "half" ? 0.5 : k === "e" ? Math.E : Number(k);
    setA(nv);
    const [l2, h2] = range(nv);
    setT((p) => clamp(p, l2, h2));
  };
  const preset = a === 0.5 ? "half" : a === 2 ? "2" : isE(a) ? "e" : a === 3 ? "3" : null;

  const y = Math.exp(t * Math.log(a));
  const e = isE(a);
  const aT = e ? "e" : tx(a);
  const logT = e ? "\\ln" : `\\log_{${aT}}`;
  const tT = tx(t, 1), yT = tx(y), eq = eqT(y);

  /* ---------- canlı formül ---------- */
  const rows = [
    `${aT}^{x} = y &\\iff x = ${logT} y`,
    `${aT}^{${tT}} ${eq} ${yT} &\\iff ${logT} ${yT} ${eq} ${tT}`,
  ];
  if (!e) {
    const lnY = Math.log(y), lnA = Math.log(a);
    rows.push(`${logT} ${yT} &= \\frac{\\ln ${yT}}{\\ln ${aT}} ${eqT(lnY, 3)} \\frac{${tx(lnY, 3)}}{${tx(lnA, 3)}} ${eqT(t, 2)} ${tT}`);
    rows.push(`${aT}^{x} &= e^{x\\ln ${aT}} ${eqT(lnA, 3)} e^{${tx(lnA, 3)}x}`);
  } else {
    rows.push(`\\ln e &= 1,\\quad \\ln 1 = 0,\\quad e^{\\ln y} = y`);
  }
  const live = `\\begin{gathered} ${rows.join(" \\\\[3pt] ").replace(/&/g, "")} \\end{gathered}`;

  /* ---------- okumalar ---------- */
  const items = [
    { label: U("Üs"), labelEn: "power", tex: `${aT}^{${tT}} ${eq} ${yT}`, color: "var(--gold)" },
    { label: U("Logaritma"), labelEn: "logarithm", tex: `${logT} ${yT} ${eq} ${tT}`, color: "var(--sky)" },
    { label: U(a > 1 ? "Artan" : "Azalan"), labelEn: a > 1 ? "increasing" : "decreasing", tex: a > 1 ? `a = ${e ? "e \\approx 2{,}72" : aT} > 1` : `0 < a = ${aT} < 1`, color: "var(--violet)" },
    { label: U("Her tabanda"), labelEn: "for every base", tex: `a^0 = 1,\\ \\log_a 1 = 0`, color: "var(--ink-3)" },
    { label: U("Asimptotlar (kesikli)"), labelEn: "asymptotes (dashed)", tex: `y = 0\\ (${aT}^x),\\quad x = 0\\ (${logT} x)`, color: "var(--coral)" },
  ];

  /* ---------- ipucu ---------- */
  const base = e ? "e" : sn(a), baseEn = e ? "e" : ne(a);
  let hint, hintEn;
  if (Math.abs(a - 1) <= 0.21) {
    hint = `a = ${base}, 1’e çok yakın: üstel eğri neredeyse dümdüz (çünkü 1ˣ hep 1), log ise dimdik. a = 1 olsaydı log hiç tanımlanamazdı; bu yüzden a ≠ 1. Kaydırıcıyı 1’den uzaklaştır.`;
    hintEn = `a = ${baseEn} is very close to 1: the exponential is almost flat (1ˣ is always 1) and the log is almost vertical. With a = 1 the log would not exist, so a ≠ 1. Move the slider away from 1.`;
  } else if (e) {
    hint = "Taban e ≈ 2,718: doğal üstel eˣ ve doğal logaritma ln x. IB’de en çok bu ikisini göreceksin; hesap makinesindeki ln tuşu tam olarak mavi eğri. Altın noktayı sürükle!";
    hintEn = "Base e ≈ 2.718: the natural exponential eˣ and the natural log ln x. You will meet these two most in IB; the ln key on your calculator is exactly the blue curve. Drag the gold point!";
  } else if (a > 1) {
    const yy = `${exactAt(y, 2) ? "" : "yaklaşık "}${sn(y)}`, yyEn = `${exactAt(y, 2) ? "" : "about "}${ne(y)}`;
    hint = `Altın noktayı sürükle: mavi ikizi aynada (y = x) onu izler. Log, üssün tersidir: ${base} sayısının ${sn(t, 1)}. kuvveti ${yy}; logₐ ${sn(y)} ise sana o üssü, ${sn(t, 1)}’i geri verir. a’yı 1’in altına çek: iki eğri de iner!`;
    hintEn = `Drag the gold point: its blue twin follows in the mirror (y = x). Log undoes the power: ${baseEn} to the power ${ne(t, 1)} is ${yyEn}, and logₐ ${ne(y)} hands that power, ${ne(t, 1)}, back. Slide a below 1: both curves turn downhill!`;
  } else {
    hint = "0 < a < 1: iki eğri de azalan. Yine de ikisi hep (0, 1) ve (1, 0)’dan geçer, çünkü a⁰ = 1 ve logₐ 1 = 0. a’yı 1’e yaklaştır: üstel eğri düzleşir.";
    hintEn = "0 < a < 1: both curves go downhill. They still pass through (0, 1) and (1, 0), because a⁰ = 1 and logₐ 1 = 0. Move a towards 1: the exponential flattens out.";
  }

  const presets = [
    { value: "half", tex: "a=\\tfrac{1}{2}" },
    { value: "2", tex: "a=2" },
    { value: "e", tex: "a=e" },
    { value: "3", tex: "a=3" },
  ];
  const aria = `y = ${e ? "e" : sn(a)}^x ve · and y = log x; nokta · point ${pt(t, y)} ve aynası · and its mirror ${pt(y, t)}`;

  return (
    <LabShell title="Üstel ve logaritma: ayna ikizleri" titleEn="Exponentials and logarithms: mirror twins" hint={hint} hintEn={hintEn}>
      <Choice options={presets} value={preset} onChange={onPreset} />
      <Plot xMin={XMIN} xMax={XMAX} yMin={YMIN} yMax={YMAX} width={W} height={H} xStep={1} yStep={1} label={aria}>
        <Scene a={a} t={t} lo={lo} hi={hi} setT={setT} />
      </Plot>
      <Slider tex="a" label="taban" labelEn="base" value={a} min={0.2} max={5} step={0.1} onChange={onA} fmt={(v) => (isE(v) ? "e ≈ 2,72" : sn(v, 1))} color="var(--violet)" />
      <Slider tex="x" label="üs" labelEn="exponent" value={t} min={lo} max={hi} step={0.1} onChange={(v) => setT(Math.round(v * 10) / 10)} fmt={(v) => sn(v, 1)} color="var(--gold)" />
      <LiveTex tex={live} />
      <Readout items={items} />
    </LabShell>
  );
}
