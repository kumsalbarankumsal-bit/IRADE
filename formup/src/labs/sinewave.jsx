import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Curve, Point, Readout, LiveTex, usePlot, nf, tn } from "./kit.jsx";
import { Tex } from "../lib/tex.jsx";

/* Sinüs dalgası laboratuvarı: y = a·sin(b(x + c)) + d.
   Bir tam dalga (bir periyot) kalın altınla vurgulanır; genlik |a| okla, periyot T = 2π/b köşeli okla,
   ana eksen y = d kesikli çizgiyle gösterilir. x ekseni π cinsinden. Mavi nokta (dalganın başlangıcı)
   sürüklenebilir: sağ-sol c’yi, yukarı-aşağı d’yi değiştirir. Soluk kesikli çizgi: temel y = sin x. */

const PI = Math.PI, TAU = 2 * PI, P12 = PI / 12;
const W = 340, H = 262, PAD = 6;
const XMIN = -PI - 0.22, XMAX = 3 * PI + 0.22, YMIN = -5.5, YMAX = 5.5;
const MINUS = "−";

/* ---------- sayı yardımcıları ---------- */
const sn = (v, d = 2) => nf(v, d).replace("-", MINUS);
const ne = (v, d = 2) => sn(v, d).replace(",", ".");
const U = (s) => s.toLocaleUpperCase("tr");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

/** (n/d)·π → { tex (\frac), tt (\tfrac), txt (düz yazı) } */
function piFrac(n, d) {
  if (n === 0) return { tex: "0", tt: "0", txt: "0" };
  const g = gcd(n, d); n /= g; d /= g;
  const neg = n < 0, m = Math.abs(n);
  const top = m === 1 ? "\\pi" : `${m}\\pi`, topT = m === 1 ? "π" : `${m}π`;
  if (d === 1) return { tex: (neg ? "-" : "") + top, tt: (neg ? "-" : "") + top, txt: (neg ? MINUS : "") + topT };
  return { tex: `${neg ? "-" : ""}\\frac{${top}}{${d}}`, tt: `${neg ? "-" : ""}\\tfrac{${top}}{${d}}`, txt: `${neg ? MINUS : ""}${topT}/${d}` };
}

/* TeX içinde tema renkleri */
const TEX_CSS = ".lab .sw-a{color:var(--coral)}.lab .sw-b{color:var(--violet)}.lab .sw-c{color:var(--sky)}.lab .sw-d{color:var(--mint)}";
const C = (k, t) => `\\htmlClass{sw-${k}}{${t}}`;

/** a·sin(b(x + c)) + d’nin sade, renkli TeX’i */
function waveTex(a, b, cK, d) {
  const cf = piFrac(Math.abs(cK), 12);
  const bP = b === 1 ? "" : C("b", tn(b));
  let core;
  if (cK === 0) core = b === 1 ? "\\sin x" : `\\sin(${bP}x)`;
  else {
    const inner = `x ${cK > 0 ? "+" : "-"} ${C("c", cf.tt)}`;
    core = b === 1 ? `\\sin\\left(${inner}\\right)` : `\\sin\\left(${bP}\\left(${inner}\\right)\\right)`;
  }
  const aP = a === 1 ? "" : a === -1 ? C("a", "-") : `${C("a", tn(a))}\\,`;
  const dP = d === 0 ? "" : ` ${d > 0 ? "+" : "-"} ${C("d", tn(Math.abs(d)))}`;
  return `${aP}${core}${dP}`;
}

/* ---------- etiket yerleşimi: kutular birbirine ve eğriye çarpmasın ---------- */
const textW = (s, size) => s.length * size * 0.64 + 6;
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
    for (const [cx, cy] of centers) {
      const r = { x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2, cx, cy };
      if (!inside(r) || hitBox(r)) continue;
      if (!hitCurve(r)) { placed.push(r); return { ...r, bg: false }; }
      if (!fb) fb = r;
    }
    if (must && fb) { placed.push(fb); return { ...fb, bg: true }; }
    return null;
  };
  place.add = (r) => { if (r) placed.push(r); };
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

/** Piksel uzayında ok (tek ya da çift uçlu) */
function PxArrow({ x1, y1, x2, y2, color, both = false, dashed = false, width = 2, head = 6.5 }) {
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 4) return null;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  const tip = (x, y, dx, dy) => `${x},${y} ${x - dx * head - dy * head * 0.55},${y - dy * head + dx * head * 0.55} ${x - dx * head + dy * head * 0.55},${y - dy * head - dx * head * 0.55}`;
  const heads = L > head * (both ? 2.4 : 1.4);
  const ax = both && heads ? x1 + ux * head * 0.8 : x1, ay = both && heads ? y1 + uy * head * 0.8 : y1;
  const bx = heads ? x2 - ux * head * 0.8 : x2, by = heads ? y2 - uy * head * 0.8 : y2;
  return (
    <g pointerEvents="none">
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? "5 4" : undefined} />
      {heads && <polygon points={tip(x2, y2, ux, uy)} fill={color} />}
      {heads && both && <polygon points={tip(x1, y1, -ux, -uy)} fill={color} />}
    </g>
  );
}

/* ---------- sahne ---------- */
function Scene({ a, b, cK, d, onDrag }) {
  const { sx, sy, ix } = usePlot();
  const c = cK * P12, A = Math.abs(a), T = TAU / b, x0 = -c;
  const f = (x) => a * Math.sin(b * (x + c)) + d;

  /* ızgara ve π eksenleri */
  const xTicks = [];
  for (let k = Math.ceil(XMIN / (PI / 2)); k * (PI / 2) <= XMAX; k++) xTicks.push(k);
  const yTicks = [];
  for (let v = Math.ceil(YMIN); v <= YMAX; v++) yTicks.push(v);
  const X0 = sx(0), Y0 = sy(0);
  const tickBoxes = [];
  const xLabels = xTicks.filter((k) => k !== 0).map((k) => {
    const t = piFrac(k, 2).txt, w = textW(t, 9.5);
    tickBoxes.push({ x0: sx(k * PI / 2) - w / 2, x1: sx(k * PI / 2) + w / 2, y0: Y0 + 4, y1: Y0 + 16 });
    return <text key={"xl" + k} x={sx(k * PI / 2)} y={Y0 + 13.5} fontSize="9.5" fontWeight="700" textAnchor="middle" fill="var(--ink-3)" style={halo}>{t}</text>;
  });
  const yLabels = yTicks.filter((v) => v !== 0).map((v) => {
    tickBoxes.push({ x0: X0 - 18, x1: X0 - 3, y0: sy(v) - 6, y1: sy(v) + 6 });
    return <text key={"yl" + v} x={X0 - 5} y={sy(v) + 3.3} fontSize="9.5" fontWeight="700" textAnchor="end" fill="var(--ink-3)" style={halo}>{sn(v, 0)}</text>;
  });

  /* vurgulanan tek dalga: önce dalga başlangıçları (j ≡ 0 mod 4), sonra çeyrek noktalar */
  const q = T / 4;
  const fits = (s) => s >= XMIN + 0.02 && s + T <= XMAX - 0.02;
  const js = [];
  for (let j = Math.ceil((XMIN - x0) / q) - 1; j <= Math.floor((XMAX - x0) / q) + 1; j++) if (fits(x0 + j * q)) js.push(j);
  js.sort((p, r) => (((p % 4) + 4) % 4 !== 0) - (((r % 4) + 4) % 4 !== 0) || Math.abs(p) - Math.abs(r));
  const s0 = js.length ? x0 + js[0] * q : XMIN + 0.05;
  const s1 = s0 + T;
  // tepe (en büyük değer) bu dalganın içinde
  const crest0 = x0 + (a > 0 ? q : 3 * q);
  const xc = crest0 + Math.ceil((s0 - crest0) / T - 1e-9) * T;

  /* periyot köşeli oku: dalganın üstünde ya da altında (tik yazılarına çarpmayan taraf) */
  const top = d + A, bot = d - A, gap = 0.85;
  const sides = [];
  if (top + gap + 0.5 <= YMAX) sides.push(top + gap);
  if (bot - gap - 0.5 >= YMIN) sides.push(bot - gap);
  const roomA = YMAX - top, roomB = bot - YMIN;
  sides.sort((p, r) => (p > d ? roomA : roomB) < (r > d ? roomA : roomB) ? 1 : -1);
  const tickHit = (yb) => tickBoxes.some((t) => sy(yb) + 9 > t.y0 && sy(yb) - 9 < t.y1 && sx(s1) > t.x0 && sx(s0) < t.x1);
  const yb = sides.find((y) => !tickHit(y)) ?? sides[0] ?? Math.max(YMIN + 0.4, bot - gap);
  const pS0 = [sx(s0), sy(f(s0))], pS1 = [sx(s1), sy(f(s1))];

  /* etiketler */
  const keyBoxes = [
    { x0: sx(x0) - 10, x1: sx(x0) + 10, y0: sy(d) - 10, y1: sy(d) + 10 },
    { x0: pS0[0] - 6, x1: pS0[0] + 6, y0: pS0[1] - 6, y1: pS0[1] + 6 },
    { x0: pS1[0] - 6, x1: pS1[0] + 6, y0: pS1[1] - 6, y1: pS1[1] + 6 },
  ];
  const byPx = sy(yb);
  // köşeli okun çizgisi de engel
  keyBoxes.push({ x0: sx(s0), x1: sx(s1), y0: byPx - 5, y1: byPx + 5 });
  const place = makePlacer(sy, ix, [f], tickBoxes.concat(keyBoxes));
  // periyot yazısı: köşeli okun ortasında (zemin rengiyle)
  const tTxt = `T = ${piFrac(4, Math.round(b * 2)).txt}`;
  const tw = textW(tTxt, 12), bm = (sx(s0) + sx(s1)) / 2;
  const tR = (() => {
    const r = { x0: bm - tw / 2 - 3, x1: bm + tw / 2 + 3, y0: byPx - 9, y1: byPx + 9, cx: bm, cy: byPx, bg: true };
    if (r.x1 - r.x0 + 16 < sx(s1) - sx(s0)) { place.add(r); return r; }
    return place(tw + 6, 18, [[sx(s1) + tw / 2 + 10, byPx], [sx(s0) - tw / 2 - 10, byPx], [bm, byPx + (yb > d ? -18 : 18)]], true);
  })();
  // genlik oku + yazısı: önce vurgulu dalganın tepesi; yazı temiz sığmazsa başka bir tepe denenir
  const ampTxt = `|a| = ${sn(A, 1)}`, aw = textW(ampTxt, 12), topPx = sy(top);
  const crests = [];
  for (let k = Math.ceil((XMIN + 0.15 - crest0) / T); crest0 + k * T <= XMAX - 0.15; k++) crests.push(crest0 + k * T);
  crests.sort((p, r) => Math.abs(p - xc) - Math.abs(r - xc));
  const ampCands = (px) => [
    [px + aw / 2 + 6, sy(d + A / 2)], [px - aw / 2 - 6, sy(d + A / 2)],
    [px + aw / 2 + 6, sy(d + A * 0.3)], [px - aw / 2 - 6, sy(d + A * 0.3)],
    [px, topPx - 13], [px + aw / 2 + 2, topPx - 13], [px - aw / 2 - 2, topPx - 13],
    [px + aw / 2 + 6, sy(d + A * 0.75)], [px - aw / 2 - 6, sy(d + A * 0.75)],
  ];
  let axPx = sx(xc), ampR = null;
  if (A * (sy(0) - sy(1)) >= 14) {
    for (const cx of crests) { const r = place(aw, 15, ampCands(sx(cx))); if (r) { axPx = sx(cx); ampR = r; break; } }
    if (!ampR) ampR = place(aw, 15, ampCands(axPx), true);
  }
  // ana eksen yazısı: sol ya da sağ uçta
  const dTxt = `y = ${sn(d, 1)}`, dw = textW(dTxt, 11.5), dPx = sy(d);
  const dR = place(dw, 14, [
    [W - PAD - dw / 2 - 4, dPx - 10], [W - PAD - dw / 2 - 4, dPx + 10],
    [PAD + dw / 2 + 4, dPx - 10], [PAD + dw / 2 + 4, dPx + 10],
    [W - PAD - dw / 2 - 40, dPx - 10], [W - PAD - dw / 2 - 40, dPx + 10],
  ], true);

  const dash = "2 4";
  return (
    <g>
      {/* ızgara */}
      {xTicks.map((k) => <line key={"gx" + k} x1={sx(k * PI / 2)} x2={sx(k * PI / 2)} y1={PAD} y2={H - PAD} stroke="var(--plot-grid)" strokeWidth={k % 2 === 0 ? 1.4 : 1} />)}
      {yTicks.map((v) => <line key={"gy" + v} y1={sy(v)} y2={sy(v)} x1={PAD} x2={W - PAD} stroke="var(--plot-grid)" strokeWidth="1" />)}
      {/* eksenler */}
      <line x1={PAD} x2={W - PAD} y1={Y0} y2={Y0} stroke="var(--ink-3)" strokeWidth="1.4" />
      <line x1={X0} x2={X0} y1={PAD} y2={H - PAD} stroke="var(--ink-3)" strokeWidth="1.4" />
      {xLabels}{yLabels}
      <text x={W - PAD - 3} y={Y0 - 5} fontSize="11" textAnchor="end" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">x</text>
      <text x={X0 + 6} y={PAD + 11} fontSize="11" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">y</text>

      {/* temel y = sin x */}
      <Curve f={Math.sin} samples={360} color="var(--ink-3)" width={1.8} dashed opacity={0.75} />
      {/* en büyük / en küçük çizgileri, ana eksen */}
      <line x1={PAD} x2={W - PAD} y1={sy(top)} y2={sy(top)} stroke="var(--coral)" strokeWidth="1.2" strokeDasharray={dash} opacity="0.7" />
      <line x1={PAD} x2={W - PAD} y1={sy(bot)} y2={sy(bot)} stroke="var(--coral)" strokeWidth="1.2" strokeDasharray={dash} opacity="0.7" />
      <line x1={PAD} x2={W - PAD} y1={dPx} y2={dPx} stroke="var(--mint)" strokeWidth="2" strokeDasharray="7 5" />

      {/* dalga: tamamı ince, bir periyot kalın */}
      <Curve f={f} samples={480} color="var(--gold)" width={2.2} opacity={0.6} />
      <Curve f={f} from={s0} to={s1} samples={240} color="var(--gold)" width={9} opacity={0.2} />
      <Curve f={f} from={s0} to={s1} samples={240} color="var(--gold)" width={3.4} />

      {/* temel başlangıçtan (0, 0) yeni başlangıca (−c, d) yolculuk */}
      {Math.hypot(sx(x0) - X0, dPx - Y0) > 24 && <PxArrow x1={X0} y1={Y0} x2={sx(x0)} y2={dPx} color="var(--sky)" dashed width={1.8} />}
      <circle cx={X0} cy={Y0} r="4" fill="var(--plot-bg)" stroke="var(--ink-3)" strokeWidth="1.8" />

      {/* periyot köşeli oku */}
      <line x1={pS0[0]} x2={pS0[0]} y1={pS0[1]} y2={byPx} stroke="var(--violet)" strokeWidth="1.4" strokeDasharray="3 3" />
      <line x1={pS1[0]} x2={pS1[0]} y1={pS1[1]} y2={byPx} stroke="var(--violet)" strokeWidth="1.4" strokeDasharray="3 3" />
      <PxArrow x1={pS0[0]} y1={byPx} x2={pS1[0]} y2={byPx} color="var(--violet)" both width={2.2} />
      <circle cx={pS0[0]} cy={pS0[1]} r="4" fill="var(--violet)" stroke="var(--plot-bg)" strokeWidth="2" />
      <circle cx={pS1[0]} cy={pS1[1]} r="4" fill="var(--violet)" stroke="var(--plot-bg)" strokeWidth="2" />

      {/* genlik oku: ana eksenden tepeye */}
      <PxArrow x1={axPx} y1={dPx} x2={axPx} y2={sy(top)} color="var(--coral)" both width={2.4} head={6} />

      <Lbl r={tR} text={tTxt} color="var(--violet)" />
      <Lbl r={ampR} text={ampTxt} color="var(--coral)" />
      <Lbl r={dR} text={dTxt} color="var(--mint)" size={11.5} />

      {/* sürüklenebilir başlangıç noktası (−c, d) */}
      <Point x={x0} y={d} color="var(--sky)" r={7} draggable onDrag={onDrag} />
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

/* ---------- ipuçları ---------- */
function hintFor(last, a, b, cK, d) {
  const A = Math.abs(a), T = piFrac(4, Math.round(b * 2)), cf = piFrac(Math.abs(cK), 12);
  if (last === "a") {
    if (a < 0) return [`a negatif → dalga baş aşağı döner: önce iner, sonra çıkar. Genlik yine |a| = ${sn(A, 1)} (uzunluk eksi olmaz).`,
      `Negative a → the wave flips upside down: it goes down first. The amplitude is still |a| = ${ne(A, 1)} (a length is never negative).`];
    return [`a = ${sn(a, 1)} → tepeler ana eksenden ${sn(A, 1)} birim yukarıda, çukurlar ${sn(A, 1)} birim aşağıda. a’yı sola çek: dalga basıklaşır, 0’ı geçince ters döner!`,
      `a = ${ne(a, 1)} → crests are ${ne(A, 1)} units above the principal axis, troughs ${ne(A, 1)} below. Slide a left: the wave flattens, then flips past 0!`];
  }
  if (last === "b") {
    const n = nf(b, 1), nE = ne(b, 1);
    return [`b = ${n} → 0 ile 2π arasına ${n} tam dalga sığar, bu yüzden bir dalganın boyu 2π/${n} = ${T.txt}. b’yi büyüt: dalgalar akordeon gibi sıkışır.`,
      `b = ${nE} → ${nE} full waves fit between 0 and 2π, so one wave is 2π/${nE} = ${T.txt} long. Increase b: the waves squeeze like an accordion.`];
  }
  if (last === "c" || last === "drag") {
    const pre = last === "drag" ? ["Mavi nokta = dalganın başlangıcı (−c; d). ", "The blue point is where the wave starts (−c, d). "] : ["", ""];
    if (cK > 0) return [`${pre[0]}(x + ${cf.txt}) yazınca dalga ${cf.txt} SOLA kayar — işaretin TERSİ! c’yi eksiye çek: dalga sağa gider.`,
      `${pre[1]}Writing (x + ${cf.txt}) shifts the wave ${cf.txt} LEFT — the OPPOSITE of the sign! Make c negative: it moves right.`];
    if (cK < 0) return [`${pre[0]}(x − ${cf.txt}) yazınca dalga ${cf.txt} SAĞA kayar — yine işaretin tersi!`,
      `${pre[1]}Writing (x − ${cf.txt}) shifts the wave ${cf.txt} RIGHT — again the opposite of the sign!`];
    return [`${pre[0]}c = 0: yatay kayma yok, dalga x = 0’da ana eksenden başlıyor. c’yi kaydır ya da mavi noktayı sürükle.`,
      `${pre[1]}c = 0: no horizontal shift, the wave starts on the principal axis at x = 0. Slide c or drag the blue point.`];
  }
  if (last === "d") {
    return [`d = ${sn(d, 1)} → bütün dalga ${d >= 0 ? "yukarı" : "aşağı"} kayar, ortası (ana eksen) y = ${sn(d, 1)} olur. Genlik ve periyot hiç değişmez!`,
      `d = ${ne(d, 1)} → the whole wave moves ${d >= 0 ? "up" : "down"}; its middle line (principal axis) is y = ${ne(d, 1)}. Amplitude and period don’t change at all!`];
  }
  return ["Dönme dolap, gelgit, ses: hepsi sinüs dalgası! Kaydırıcıları tek tek oynat: a dalganın boyunu, b sıklığını, c yatay kaymasını, d yüksekliğini değiştirir. Mavi noktayı da sürükleyebilirsin.",
    "Ferris wheels, tides, sound: all sine waves! Move one slider at a time: a sets the height, b how often it repeats, c the sideways shift, d the vertical position. You can also drag the blue point."];
}

const D0 = { a: 2, b: 2, cK: 0, d: 1 };

export default function SineWaveLab() {
  const [a, setAraw] = useState(D0.a);
  const [b, setBraw] = useState(D0.b);
  const [cK, setCraw] = useState(D0.cK);
  const [d, setDraw] = useState(D0.d);
  const [last, setLast] = useState(null);
  const setA = (v) => { setAraw((p) => (v === 0 ? (p > 0 ? -0.5 : 0.5) : v)); setLast("a"); };
  const setB = (v) => { setBraw(v); setLast("b"); };
  const setC = (v) => { setCraw(Math.round(v)); setLast("c"); };
  const setD = (v) => { setDraw(v); setLast("d"); };
  const onDrag = (x, y) => {
    const nk = clamp(-Math.round(x / P12), -12, 12), nd = clamp(Math.round(y * 2) / 2, -2, 2);
    if (nk !== cK) setCraw(nk);
    if (nd !== d) setDraw(nd);
    if (nk !== cK || nd !== d) setLast("drag");
  };

  const A = Math.abs(a), m2 = Math.round(b * 2);
  const T = piFrac(4, m2), cf = piFrac(Math.abs(cK), 12);
  const live = useMemo(() => [
    "\\begin{array}{c}",
    `y = ${C("a", "a")}\\sin\\big(${C("b", "b")}(x + ${C("c", "c")})\\big) + ${C("d", "d")} \\\\[8pt]`,
    `y = ${waveTex(a, b, cK, d)} \\\\[8pt]`,
    `|${C("a", "a")}| = ${C("a", tn(A))} \\qquad T = \\dfrac{2\\pi}{${C("b", tn(b))}} = ${T.tex}`,
    "\\end{array}",
  ].join(""), [a, b, cK, d, A, T.tex]);

  const two = (tr, en) => <><span style={{ fontSize: 15 }}>{tr}</span><span className="en" style={{ display: "block", fontSize: 12.5, fontWeight: 500 }}>{en}</span></>;
  const shift = cK === 0 ? two("yok", "none") : cK > 0 ? two(`← ${cf.txt} sola`, `${cf.txt} left`) : two(`→ ${cf.txt} sağa`, `${cf.txt} right`);
  const [hint, hintEn] = hintFor(last, a, b, cK, d);

  return (
    <LabShell title="Sinüs dalgası" titleEn="The sine wave" hint={hint} hintEn={hintEn}>
      <style>{TEX_CSS}</style>
      <Plot xMin={XMIN} xMax={XMAX} yMin={YMIN} yMax={YMAX} width={W} height={H} grid={false} axes={false}
        label={`y = ${nf(a, 1)} sin(${nf(b, 1)}(x + ${cf.txt})) + ${nf(d, 1)}; genlik · amplitude ${nf(A, 1)}, periyot · period ${T.txt}, ana eksen · principal axis y = ${nf(d, 1)}`}>
        <Scene a={a} b={b} cK={cK} d={d} onDrag={onDrag} />
      </Plot>
      <div className="legend" style={{ marginTop: -4 }}>
        <span><Swatch color="var(--gold)" w={3.6} />bir tam dalga <span className="en">one full wave</span></span>
        <span><Swatch color="var(--mint)" dashed w={2.2} />ana eksen <span className="en">principal axis</span></span>
        <span><Swatch color="var(--ink-3)" dashed w={1.8} /><Tex tex="y=\sin x" /> <span className="en">base</span></span>
      </div>
      <Slider tex="a" label="genlik" labelEn="amplitude" value={a} min={-3} max={3} step={0.5} onChange={setA} fmt={(v) => sn(v, 1)} color="var(--coral)" />
      <Slider tex="b" label="sıklık" labelEn="frequency" value={b} min={0.5} max={4} step={0.5} onChange={setB} fmt={(v) => sn(v, 1)} color="var(--violet)" />
      <Slider tex="c" label="yatay kayma" labelEn="horizontal shift" value={cK} min={-12} max={12} step={1} onChange={setC} fmt={(k) => piFrac(k, 12).txt} color="var(--sky)" />
      <Slider tex="d" label="dikey kayma" labelEn="vertical shift" value={d} min={-2} max={2} step={0.5} onChange={setD} fmt={(v) => sn(v, 1)} color="var(--mint)" />
      <LiveTex tex={live} />
      <Readout items={[
        { label: U("genlik"), labelEn: "amplitude", tex: `|a| = ${tn(A, 1)}`, color: "var(--coral)" },
        { label: U("periyot"), labelEn: "period", tex: `T = ${T.tex} \\approx ${tn(TAU / b, 2)}`, color: "var(--violet)" },
        { label: U("ana eksen"), labelEn: "principal axis", tex: `y = ${tn(d, 1)}`, color: "var(--mint)" },
        { label: U("yatay kayma"), labelEn: "horizontal shift", value: shift, color: "var(--sky)" },
        { label: U("değer aralığı"), labelEn: "range", tex: `${tn(d - A, 1)} \\le y \\le ${tn(d + A, 1)}`, color: "var(--gold)" },
      ]} />
    </LabShell>
  );
}
