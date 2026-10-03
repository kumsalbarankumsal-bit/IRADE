import React, { useState, useMemo } from "react";
import { LabShell, Plot, Curve, Segment, Polygon, Point, Readout, LiveTex, Choice, usePlot, nf, tn } from "./kit.jsx";

/* Doğru laboratuvarı: iki sürüklenebilir nokta (A, B) → doğru, yükseliş/koşu üçgeni, eğim m, y-kesişimi c.
   Noktalar tam sayılara yapışır (kareleri saymak kolay olsun). Dikey doğruda koşu = 0 → eğim tanımsız. */

const W = 340, H = 285;               // ≈ eşit ölçek: 1 birim ≈ 27 px (45° gerçekten 45° görünür)
const XMIN = -6, XMAX = 6, YMIN = -5, YMAX = 5;
const LX = 5, LY = 4;                 // noktalar bu sınırların içinde kalır
const MINUS = "−";

/* ---------- sayı yardımcıları ---------- */
const sn = (v, d = 2) => nf(v, d).replace("-", MINUS);              // ekranda gerçek eksi işareti
const ne = (v, d = 2) => sn(v, d).replace(",", ".");                  // İngilizce metin: ondalık nokta
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
function frac(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; }
const terminating = (d) => { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };
/** Rasyonel sayının TeX’i: tam sayı, sonlu ondalık ya da kesir */
function qTex(n, d, big = false) {
  [n, d] = frac(n, d);
  if (d === 1) return `${n}`;
  if (terminating(d)) return tn(n / d, 4);
  return `${n < 0 ? "-" : ""}\\${big ? "d" : "t"}frac{${Math.abs(n)}}{${d}}`;
}
/** Kesir zinciri: 6/4 = 3/2 = 1,5 (ya da ≈ 0,67) */
function fracChain(n0, d0, big) {
  const [n, d] = frac(n0, d0);
  const f = big ? "dfrac" : "tfrac";
  if (d === 1) return `${n}`;
  const s = `${n < 0 ? "-" : ""}\\${f}{${Math.abs(n)}}{${d}}`;
  return terminating(d) ? `${s} = ${tn(n / d, 4)}` : `${s} \\approx ${tn(n / d, 2)}`;
}
const pTex = (v) => (v < 0 ? `(${v})` : `${v}`);                  // negatif tam sayıyı paranteze al
/** y − y₁ → "y + 2" gibi sade TeX */
const shiftTex = (name, v) => (v === 0 ? name : `${name} ${v > 0 ? "-" : "+"} ${Math.abs(v)}`);
/** m·x terimi (m = n/d) */
function mxTex(n, d) {
  [n, d] = frac(n, d);
  if (n === 0) return "";
  if (d === 1 && Math.abs(n) === 1) return n < 0 ? "-x" : "x";
  return `${qTex(n, d)}x`;
}
/** y = mx + c (m = rise/run, c = cn/cd) */
function lineTex(rise, run, cn, cd) {
  const mx = mxTex(rise, run);
  const [c1, c2] = frac(cn, cd);
  if (!mx) return `y = ${qTex(c1, c2)}`;
  if (c1 === 0) return `y = ${mx}`;
  return `y = ${mx} ${c1 < 0 ? "-" : "+"} ${qTex(Math.abs(c1), c2)}`;
}
const pt = (x, y) => `(${sn(x)}, ${sn(y)})`;

/* ---------- etiket yerleşimi (çakışmasız) ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function tagSize(t) {
  const w = Math.max(t.text.length * 6.6 + 14, t.sub ? t.sub.length * 5.2 + 14 : 0);
  return [Math.round(w), t.sub ? 31 : 20];
}
/** items: [{ key, text, sub, color, at:[[cx,cy],...], must }] — çakışmayan ilk aday seçilir */
function placeTags(items, obstacles) {
  const placed = obstacles.slice(), out = [];
  const hits = (r) => placed.some((p) => r.x0 < p.x1 + 2 && r.x1 > p.x0 - 2 && r.y0 < p.y1 + 2 && r.y1 > p.y0 - 2);
  for (const it of items) {
    const [w, h] = tagSize(it);
    let pick = null, fallback = null;
    for (const [ax, ay] of it.at) {
      const cx = clamp(ax, 4 + w / 2, W - 4 - w / 2), cy = clamp(ay, 4 + h / 2, H - 4 - h / 2);
      const r = { x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2 };
      if (!hits(r)) { pick = { cx, cy, w, h, r }; break; }
      if (!fallback) fallback = { cx, cy, w, h, r };
    }
    const got = pick || (it.must ? fallback : null);
    if (got) { placed.push(got.r); out.push({ ...it, ...got }); }
  }
  return out;
}
function Tag({ cx, cy, w, h, text, sub, color, ink }) {
  return (
    <g pointerEvents="none">
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="8" fill="var(--plot-bg)" opacity="0.94" />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="8" fill={color} fillOpacity="0.13" stroke={color} strokeWidth="1.4" />
      {sub && <text x={cx} y={cy - 4} fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--ink-2)">{sub}</text>}
      <text x={cx} y={sub ? cy + 10 : cy + 4} fontSize="11.5" fontWeight="800" textAnchor="middle" fill={ink || color}>{text}</text>
    </g>
  );
}

/** Ok (matematik koordinatı): uçtan `shrink` px kısaltılır */
function Arrow({ x1, y1, x2, y2, color, width = 2.6, shrink = 0, ox = 0 }) {
  const { sx, sy } = usePlot();
  const ax = sx(x1) + ox, ay = sy(y1);
  let bx = sx(x2) + ox, by = sy(y2);
  const L = Math.hypot(bx - ax, by - ay);
  if (L < 4) return null;
  const ux = (bx - ax) / L, uy = (by - ay) / L;
  bx -= ux * shrink; by -= uy * shrink;
  const s = Math.min(8, (L - shrink) * 0.5);
  const hx = bx - ux * s, hy = by - uy * s;
  const head = `${bx},${by} ${hx - uy * s * 0.6},${hy + ux * s * 0.6} ${hx + uy * s * 0.6},${hy - ux * s * 0.6}`;
  return (
    <g pointerEvents="none">
      <line x1={ax} y1={ay} x2={hx + ux} y2={hy + uy} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={head} fill={color} />
    </g>
  );
}

/* ---------- sahne ---------- */
function Scene({ A, B, setA, setB, m }) {
  const { sx, sy } = usePlot();
  const rise = B[1] - A[1], run = B[0] - A[0];
  const vertical = run === 0, horizontal = rise === 0;
  const C = [B[0], A[1]];                                   // dik köşe
  const c = vertical ? null : A[1] - (rise / run) * A[0];   // y-kesişimi

  // Doğrunun normali (piksel), üçgenden uzağa bakan taraf
  const pA = [sx(A[0]), sy(A[1])], pB = [sx(B[0]), sy(B[1])], pC = [sx(C[0]), sy(C[1])];
  const L = Math.hypot(pB[0] - pA[0], pB[1] - pA[1]) || 1;
  let n = [-(pB[1] - pA[1]) / L, (pB[0] - pA[0]) / L];
  if (vertical) n = [-1, 0];
  else if (horizontal) n = [0, -1];
  else if (n[0] * (pC[0] - pA[0]) + n[1] * (pC[1] - pA[1]) > 0) n = [-n[0], -n[1]];
  const along = [(pB[0] - pA[0]) / L, (pB[1] - pA[1]) / L];

  const ob = (p, r = 9) => ({ x0: p[0] - r, y0: p[1] - r, x1: p[0] + r, y1: p[1] + r });
  const obstacles = [ob(pA), ob(pB)];
  const showC = !vertical && c > YMIN + 0.3 && c < YMAX - 0.3;
  const pI = showC ? [sx(0), sy(c)] : null;
  if (pI) obstacles.push(ob(pI, 7));

  // aday merkezler: nokta + normal yönünde (etiket boyutuna göre) uzaklık
  const around = (p, t, extra = []) => {
    const [w, h] = tagSize(t);
    const off = (dir) => 10 + Math.abs(dir[0]) * w / 2 + Math.abs(dir[1]) * h / 2;
    const dirs = [n, [-n[0], -n[1]], [0, -1], [0, 1], [1, 0], [-1, 0], ...extra];
    const near = dirs.map((d) => [p[0] + d[0] * off(d), p[1] + d[1] * off(d)]);
    const far = dirs.map((d) => [p[0] + d[0] * (off(d) + 18), p[1] + d[1] * (off(d) + 18)]);
    return near.concat(far);
  };
  const tA = { key: "A", sub: "(x₁, y₁)", text: "A" + pt(A[0], A[1]), color: "var(--sky)", must: true };
  const tB = { key: "B", sub: "(x₂, y₂)", text: "B" + pt(B[0], B[1]), color: "var(--sky)", must: true };
  // A’nın etiketi doğrunun dışına (B’den uzağa), B’ninki de A’dan uzağa kayabilsin
  tA.at = around(pA, tA, [[-along[0], -along[1]]]);
  tB.at = around(pB, tB, [along]);

  const items = [tA, tB];
  if (!horizontal) {
    const t = { key: "rise", sub: "yükseliş · rise", text: sn(rise), color: "var(--coral)", must: true };
    const [w] = tagSize(t);
    const my = (pC[1] + pB[1]) / 2, side = run >= 0 ? 1 : -1, gap = vertical ? 26 : 10;
    t.at = [[pB[0] + side * (w / 2 + gap), my], [pB[0] - side * (w / 2 + 10), my], [pB[0] + side * (w / 2 + 10), my + 30], [pB[0] - side * (w / 2 + 10), my - 30]];
    items.push(t);
  }
  if (!vertical) {
    const t = { key: "run", sub: "koşu · run", text: sn(run), color: "var(--mint)", must: true };
    const [, h] = tagSize(t);
    const mx = (pA[0] + pC[0]) / 2, side = rise > 0 ? 1 : -1;
    t.at = [[mx, pA[1] + side * (h / 2 + 7)], [mx, pA[1] - side * (h / 2 + 7)], [mx + 40, pA[1] + side * (h / 2 + 7)], [mx - 40, pA[1] + side * (h / 2 + 7)]];
    items.push(t);
  } else {
    const t = { key: "undef", sub: "koşu · run = 0  →  ÷ 0", text: "m tanımsız · undefined", color: "var(--coral)", must: true };
    const [w, h] = tagSize(t);
    const x = pA[0];
    t.at = [[x + w / 2 + 14, 4 + h / 2], [x - w / 2 - 14, 4 + h / 2], [x + w / 2 + 14, H - 4 - h / 2], [x - w / 2 - 14, H - 4 - h / 2], [W / 2, H / 2]];
    items.push(t);
  }
  if (pI && !(A[0] === 0 && A[1] === c) && !(B[0] === 0 && B[1] === c)) {
    const t = { key: "c", sub: "y-kesişimi", text: `c = ${sn(c)}`, color: "var(--violet)" };
    t.at = around(pI, t);
    items.push(t);
  }
  const tags = placeTags(items, obstacles);

  return (
    <g>
      {/* yükseliş/koşu üçgeni */}
      {!vertical && !horizontal && <Polygon points={[A, C, B]} color="var(--violet)" fillOpacity={0.1} stroke={false} />}
      {/* doğru (parıltı + çizgi) */}
      {vertical ? (
        <g>
          <line x1={sx(A[0])} x2={sx(A[0])} y1={sy(YMIN)} y2={sy(YMAX)} stroke="var(--coral)" strokeWidth="8" opacity="0.2" />
          <Segment x1={A[0]} y1={YMIN} x2={A[0]} y2={YMAX} color="var(--coral)" width={3} />
        </g>
      ) : (
        <g>
          <Curve f={(x) => m * x + c} color="var(--gold)" width={8} opacity={0.2} />
          <Curve f={(x) => m * x + c} color="var(--gold)" width={3} />
        </g>
      )}
      {/* koşu (yatay) ve yükseliş (dikey) okları */}
      {!vertical && <Arrow x1={A[0]} y1={A[1]} x2={C[0]} y2={C[1]} color="var(--mint)" shrink={horizontal ? 10 : 0} />}
      {!horizontal && <Arrow x1={C[0]} y1={C[1]} x2={B[0]} y2={B[1]} color="var(--coral)" shrink={vertical ? 2 : 9} ox={vertical ? 16 : 0} />}
      {!vertical && !horizontal && <rect x={pC[0] - (run > 0 ? 9 : 0)} y={pC[1] - (rise > 0 ? 9 : 0)} width="9" height="9" fill="none" stroke="var(--ink-3)" strokeWidth="1.3" pointerEvents="none" />}
      {pI && <Point x={0} y={c} color="var(--violet)" r={5} />}
      {tags.map((t) => <Tag key={t.key} {...t} ink={t.color === "var(--gold)" ? "var(--ink)" : undefined} />)}
      <Point x={A[0]} y={A[1]} color="var(--sky)" r={7} draggable snap={1} onDrag={setA} />
      <Point x={B[0]} y={B[1]} color="var(--sky)" r={7} draggable snap={1} onDrag={setB} />
    </g>
  );
}

const PRESETS = [
  { value: "up", A: [-2, -2], B: [2, 4], tr: "↗ artan", en: "uphill" },
  { value: "down", A: [-3, 3], B: [3, -1], tr: "↘ azalan", en: "downhill" },
  { value: "flat", A: [-3, 2], B: [2, 2], tr: "→ yatay", en: "flat" },
  { value: "vert", A: [2, -3], B: [2, 3], tr: "↕ dikey", en: "vertical" },
];

export default function LineLab() {
  const [A, setAraw] = useState([-2, -2]);
  const [B, setBraw] = useState([2, 4]);
  // Sınırla, tam sayıya yapıştır; iki nokta üst üste gelemez
  const fix = (x, y) => [clamp(Math.round(x), -LX, LX), clamp(Math.round(y), -LY, LY)];
  const setA = (x, y) => { const p = fix(x, y); if (p[0] === B[0] && p[1] === B[1]) return; if (p[0] !== A[0] || p[1] !== A[1]) setAraw(p); };
  const setB = (x, y) => { const p = fix(x, y); if (p[0] === A[0] && p[1] === A[1]) return; if (p[0] !== B[0] || p[1] !== B[1]) setBraw(p); };

  const d = useMemo(() => {
    const rise = B[1] - A[1], run = B[0] - A[0];
    const vertical = run === 0;
    const m = vertical ? NaN : rise / run;
    const cn = A[1] * run - rise * A[0], cd = run;      // c = y₁ − m·x₁ = (y₁·run − rise·x₁)/run
    return { rise, run, vertical, m, cn, cd, c: vertical ? NaN : cn / cd };
  }, [A, B]);
  const { rise, run, vertical, m, cn, cd, c } = d;

  // Canlı formül
  const subst = `\\dfrac{${B[1]}-${pTex(A[1])}}{${B[0]}-${pTex(A[0])}}`;
  let live;
  if (vertical) {
    live = `\\begin{aligned} m &= \\dfrac{y_2-y_1}{x_2-x_1} = ${subst} = \\dfrac{${rise}}{0} \\\\ &\\Rightarrow\\ \\text{÷0: } m \\text{ tanımsız (undefined)} \\\\ x &= ${A[0]} \\end{aligned}`;
  } else {
    const [rn, rd] = frac(rise, run);
    const raw = `\\dfrac{${rise}}{${run}}`;
    const mChain = rn === rise && rd === run && rd !== 1 ? fracChain(rise, run, true) : `${raw} = ${fracChain(rise, run, true)}`;
    const cLine = A[0] === 0
      ? `c &= y_1 = ${A[1]}`
      : `c &= y_1 - m\\,x_1 = ${A[1]} - ${rn < 0 ? `(${qTex(rn, rd)})` : qTex(rn, rd)}\\cdot${pTex(A[0])} = ${qTex(cn, cd)}`;
    live = `\\begin{aligned} m &= \\dfrac{y_2-y_1}{x_2-x_1} = ${subst} \\\\ &= ${mChain} \\\\ ${cLine} \\\\ ${lineTex(rise, run, cn, cd).replace("y =", "y &=")} \\end{aligned}`;
  }

  // Okumalar
  const dir = vertical
    ? { tr: "↕ dikey", en: "vertical", color: "var(--coral)" }
    : m > 0 ? { tr: "↗ artan", en: "increasing", color: "var(--mint)" }
      : m < 0 ? { tr: "↘ azalan", en: "decreasing", color: "var(--coral)" }
        : { tr: "→ yatay", en: "horizontal", color: "var(--sky)" };
  const [n1, d1] = vertical ? [0, 1] : frac(rise, run);
  const items = [
    vertical
      ? { label: "Eğim · ↕ dikey", labelEn: "gradient, vertical", value: <>tanımsız <span className="en">· undefined</span></>, color: "var(--coral)" }
      : { label: `Eğim · ${dir.tr}`, labelEn: `gradient, ${dir.en}`, tex: `m = ${fracChain(rise, run, false)}`, color: dir.color },
    vertical
      ? { label: "y-kesişimi", labelEn: "y-intercept", value: A[0] === 0 ? <>y ekseninin kendisi <span className="en">· the y-axis itself</span></> : <>yok <span className="en">· none</span></>, color: "var(--violet)" }
      : { label: "y-kesişimi", labelEn: "y-intercept", tex: `c = ${qTex(cn, cd)}`, color: "var(--violet)" },
  ];
  if (vertical) {
    items.push({ label: "Denklem", labelEn: "Equation", tex: `x = ${A[0]}`, color: "var(--sky)" });
  } else if (rise === 0) {
    items.push({ label: "Denklem", labelEn: "Equation", tex: `y = ${qTex(cn, cd)}`, color: "var(--sky)" });
  } else {
    const coef = d1 === 1 && Math.abs(n1) === 1 ? (n1 < 0 ? "-" : "") : qTex(n1, d1);
    items.push({ label: "Nokta-eğim biçimi", labelEn: "Point-gradient form", tex: `{y - y_1 = m(x - x_1)} \\;\\Rightarrow\\; {${shiftTex("y", A[1])} = ${coef}${A[0] === 0 ? "x" : `(${shiftTex("x", A[0])})`}}`, color: "var(--sky)" });
  }

  // İpucu (duruma göre) — eğim metni: 1,5 · 1/7 ≈ 0,14
  const mTxt = (fmt) => (vertical ? "" : d1 === 1 || terminating(d1) ? fmt(n1 / d1, 4) : `${n1 < 0 ? MINUS : ""}${Math.abs(n1)}/${d1} ≈ ${fmt(n1 / d1, 2)}`);
  let hint, hintEn;
  if (vertical) {
    hint = `Dikey doğru! Koşu = 0 ve sıfıra bölünemez → eğim TANIMSIZ. Denklemi y = … değil, x = ${A[0]}. B’yi bir kare sağa çek: eğim geri gelir.`;
    hintEn = `A vertical line! Run = 0 and you can’t divide by zero → the gradient is UNDEFINED. Its equation is x = ${A[0]}, not y = … Drag B one square right and the gradient comes back.`;
  } else if (rise === 0) {
    hint = `Dümdüz yol: yükseliş = 0 → m = 0 ÷ ${sn(Math.abs(run))} = 0. Denklem sadece y = ${sn(c)}. B’yi yukarı sürükle, yokuş başlasın!`;
    hintEn = `A flat road: rise = 0 → m = 0. The equation is just y = ${ne(c)}. Drag B upwards to start a hill!`;
  } else if (m > 0) {
    hint = `A ve B’yi parmağınla sürükle. Eğim = yükseliş ÷ koşu: ${sn(run)} sağa, ${sn(rise)} yukarı → m = ${mTxt(sn)}. Soldan sağa yokuş YUKARI ↗ (m > 0). B’yi A’nın tam üstüne getir: ne olur?`;
    hintEn = `Drag A and B. Gradient = rise ÷ run: ${ne(run)} across, ${ne(rise)} up → m = ${mTxt(ne)}. Left to right it goes UPHILL ↗ (m > 0). Put B straight above A — what happens?`;
  } else {
    hint = `Yokuş AŞAĞI ↘: sağa gittikçe y azalıyor, yükseliş negatif → m = ${mTxt(sn)} < 0. Kayak pisti gibi! B’yi A ile aynı yüksekliğe getir: m = 0 olur.`;
    hintEn = `DOWNHILL ↘: going right, y drops, so the rise is negative → m = ${mTxt(ne)} < 0. Like a ski slope! Bring B level with A: m becomes 0.`;
  }
  if (run < 0 && !vertical) {
    hint += " (B, A’nın solunda: koşu ve yükseliş ikisi de işaret değiştirir, m aynı kalır.)";
    hintEn += " (B is left of A: run and rise both flip sign, m stays the same.)";
  }

  const preset = PRESETS.find((p) => p.A[0] === A[0] && p.A[1] === A[1] && p.B[0] === B[0] && p.B[1] === B[1]);
  const pick = (v) => { const p = PRESETS.find((q) => q.value === v); if (p) { setAraw(p.A); setBraw(p.B); } };

  return (
    <LabShell title="Doğru ve eğim" titleEn="Straight line & gradient" hint={hint} hintEn={hintEn}>
      <Plot xMin={XMIN} xMax={XMAX} yMin={YMIN} yMax={YMAX} width={W} height={H} xStep={1} yStep={1}
        label={`A${pt(A[0], A[1])} ve B${pt(B[0], B[1])} noktalarından geçen doğru; ${vertical ? "eğim tanımsız · undefined gradient" : `eğim · gradient ${sn(m)}`}`}>
        <Scene A={A} B={B} setA={setA} setB={setB} m={m} />
      </Plot>
      <div className="lab-slider-top" style={{ marginBottom: -4 }}>
        <span className="lab-slider-name"><span>Hazır doğrular</span><span className="en">Quick lines</span></span>
      </div>
      <Choice options={PRESETS.map((p) => ({ value: p.value, label: <>{p.tr} <span className="en">{p.en}</span></> }))} value={preset ? preset.value : null} onChange={pick} />
      <LiveTex tex={live} />
      <Readout items={items} />
    </LabShell>
  );
}
