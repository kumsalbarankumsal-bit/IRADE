import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Curve, Segment, Point, Readout, LiveTex, usePlot, nf, tn } from "./kit.jsx";

/* Parabol laboratuvarı: y = ax² + bx + c. Tepe noktası, simetri ekseni x = −b/(2a) (kesikli), kökler,
   y-kesişimi ve onun simetri eksenine göre aynası. Δ = b² − 4ac ile kök durumu (iki / bir / yok). a ≠ 0. */

const W = 340, H = 270;
const XMIN = -6, XMAX = 6, YMIN = -8, YMAX = 8;
const MINUS = "−";

/* ---------- sayı yardımcıları ---------- */
const sn = (v, d = 2) => nf(v, d).replace("-", MINUS);              // ekranda gerçek eksi
const ne = (v, d = 2) => sn(v, d).replace(",", ".");                  // İngilizce metin
const exact = (v, d = 2) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
const pT = (v) => (v < 0 ? `(${tn(v)})` : tn(v));                    // TeX: negatifse parantez
/** nokta: tam sayılarda virgül, ondalık varsa noktalı virgül (Türkçe yazım) */
const ptTxt = (x, y) => `(${sn(x)}${isInt(x) && isInt(y) ? "," : ";"} ${sn(y)})`;
const ptTex = (x, y) => `(${tn(x)}${isInt(x) && isInt(y) ? "," : ";"}\\ ${tn(y)})`;
const U = (s) => s.toLocaleUpperCase("tr");                           // çip etiketleri: doğru Türkçe büyük harf (İ)
const eq = (v) => (exact(v) ? "=" : "\\approx");
/** ax² + bx + c’nin sade TeX’i */
function polyTex(a, b, c) {
  let s = a === 1 ? "x^2" : a === -1 ? "-x^2" : `${tn(a)}x^2`;
  if (b !== 0) s += ` ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : tn(Math.abs(b))}x`;
  if (c !== 0) s += ` ${c < 0 ? "-" : "+"} ${tn(Math.abs(c))}`;
  return s;
}

/* ---------- etiket yerleşimi (çakışmasız) ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function tagSize(t) {
  const w = Math.max(t.text.length * 6.6 + 14, t.sub ? t.sub.length * 5.2 + 14 : 0);
  return [Math.round(w), t.sub ? 31 : 20];
}
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

/* ---------- sahne ---------- */
function Scene({ a, b, c, D, h, k, roots }) {
  const { sx, sy } = usePlot();
  const f = (x) => a * x * x + b * x + c;
  const up = a > 0;
  const inX = (x) => x >= XMIN && x <= XMAX, inY = (y) => y >= YMIN && y <= YMAX;
  const y0 = sy(0), hx = sx(clamp(h, XMIN, XMAX));
  const vIn = inX(h) && inY(k);
  const ob = (x, y, r = 9) => ({ x0: sx(x) - r, y0: sy(y) - r, x1: sx(x) + r, y1: sy(y) + r });
  const obstacles = [];
  if (vIn) obstacles.push(ob(h, k));
  const vis = roots.filter(inX);
  vis.forEach((r) => obstacles.push(ob(r, 0, 8)));
  const yIn = inY(c), mirror = 2 * h, showMirror = yIn && Math.abs(h) > 0.05 && inX(mirror);
  if (yIn) obstacles.push(ob(0, c, 7));
  if (showMirror) obstacles.push(ob(mirror, c, 7));

  const items = [];
  // Tepe
  {
    const t = { key: "v", sub: up ? "tepe · vertex (min)" : "tepe · vertex (max)", text: ptTxt(h, k), color: "var(--coral)", must: true };
    const [w, th] = tagSize(t);
    if (vIn) {
      const px = sx(h), py = sy(k), dv = th / 2 + 12, dh = w / 2 + 12;
      const out = up ? 1 : -1;     // tepenin "dış" tarafı (a>0 iken aşağı)
      t.at = [[px, py + out * dv], [px + dh, py + out * 6], [px - dh, py + out * 6], [px, py - out * dv], [px + dh, py - out * dv], [px - dh, py - out * dv]];
    } else {
      t.text = (k < YMIN ? "↓ " : k > YMAX ? "↑ " : "") + t.text;
      const yy = k < YMIN ? H - 4 - th / 2 : k > YMAX ? 4 + th / 2 : sy(k);
      t.at = [[hx, yy], [hx + w / 2 + 10, yy], [hx - w / 2 - 10, yy]];
    }
    items.push(t);
  }
  // Kökler
  if (D > 0) {
    roots.forEach((r, i) => {
      if (!inX(r)) return;
      const t = { key: "r" + i, text: `x${i ? "₂" : "₁"} ${exact(r) ? "=" : "≈"} ${sn(r)}`, color: "var(--mint)" };
      const [w] = tagSize(t);
      const px = sx(r), inward = i === 0 ? 1 : -1;  // köke göre içe (öteki köke doğru)
      const horiz = up ? inward : -inward;          // eğrinin eksen altında kaldığı taraf
      const dx = w / 2 + 11;
      t.at = [[px + horiz * dx, y0 - 17], [px - horiz * dx, y0 + 18], [px - horiz * dx, y0 - 17], [px + horiz * dx, y0 + 18], [px + horiz * dx, y0 - 40], [px - horiz * dx, y0 + 41]];
      t.must = true;
      items.push(t);
    });
  } else if (D === 0 && inX(h)) {
    const t = { key: "r", sub: "tek kök · one root", text: `x₁ = x₂ = ${sn(h)}`, color: "var(--mint)", must: true };
    const [, th] = tagSize(t);
    const s = up ? -1 : 1;
    t.at = [[sx(h), y0 + s * (th / 2 + 14)], [sx(h), y0 + s * (th / 2 + 44)], [sx(h) + 70, y0 + s * (th / 2 + 14)], [sx(h) - 70, y0 + s * (th / 2 + 14)]];
    items.push(t);
  }
  // Simetri ekseni etiketi: kolların arasında, tepenin uzak ucunda
  {
    const t = { key: "ax", sub: "simetri ekseni", text: `x = ${sn(h)}`, color: "var(--violet)", must: true };
    const [w, th] = tagSize(t);
    const yy = up ? 4 + th / 2 : H - 4 - th / 2, yy2 = up ? yy + th + 6 : yy - th - 6;
    t.at = [[hx + w / 2 + 6, yy], [hx - w / 2 - 6, yy], [hx + w / 2 + 6, yy2], [hx - w / 2 - 6, yy2], [hx, yy]];
    items.push(t);
  }
  // y-kesişimi ve aynası
  if (yIn && Math.abs(h) > 0.05) {
    const t = { key: "yi", sub: "y-kesişimi", text: ptTxt(0, c), color: "var(--sky)" };
    const [w, th] = tagSize(t);
    const px = sx(0), py = sy(c), away = h > 0 ? -1 : 1;
    t.at = [[px + away * (w / 2 + 11), py], [px + away * (w / 2 + 11), py - th], [px + away * (w / 2 + 11), py + th], [px, py + (up ? 1 : -1) * (th / 2 + 12)]];
    items.push(t);
  }
  if (showMirror) {
    const t = { key: "mi", sub: "ayna · mirror", text: ptTxt(mirror, c), color: "var(--sky)" };
    const [w, th] = tagSize(t);
    const px = sx(mirror), py = sy(c), away = h > 0 ? 1 : -1;
    t.at = [[px + away * (w / 2 + 11), py], [px + away * (w / 2 + 11), py - th], [px + away * (w / 2 + 11), py + th]];
    items.push(t);
  }
  const tags = placeTags(items, obstacles);

  return (
    <g>
      {/* simetri ekseni */}
      {inX(h) && <Segment x1={h} y1={YMIN} x2={h} y2={YMAX} color="var(--violet)" width={1.8} dashed />}
      {/* ayna çifti: y-kesişimi ↔ aynası */}
      {showMirror && <Segment x1={0} y1={c} x2={mirror} y2={c} color="var(--sky)" width={1.4} dashed />}
      {/* parabol */}
      <Curve f={f} color="var(--gold)" width={8} opacity={0.18} />
      <Curve f={f} color="var(--gold)" width={3} />
      {/* noktalar */}
      {yIn && <Point x={0} y={c} color="var(--sky)" r={5} />}
      {showMirror && (
        <g>
          <circle cx={sx(mirror)} cy={sy(c)} r="5" fill="var(--plot-bg)" stroke="var(--sky)" strokeWidth="2.2" />
        </g>
      )}
      {D >= 0 && vis.map((r, i) => <Point key={i} x={r} y={0} color="var(--mint)" r={6} />)}
      {vIn && <Point x={h} y={k} color="var(--coral)" r={6.5} />}
      {tags.map((t) => <Tag key={t.key} {...t} />)}
    </g>
  );
}

export default function ParabolaLab() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  // a = 0 parabol değildir: kaydırıcı 0’a gelince öbür tarafa atlar
  const onA = (v) => setA((prev) => (v === 0 ? (prev > 0 ? -0.5 : 0.5) : v));

  const r = useMemo(() => {
    const D = Math.round((b * b - 4 * a * c) * 1e6) / 1e6;
    const h = -b / (2 * a), k = -D / (4 * a);
    let roots = [];
    if (D > 0) { const s = Math.sqrt(D); roots = [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((p, q) => p - q); }
    else if (D === 0) roots = [h];
    return { D, h: h + 0, k: k + 0, roots };
  }, [a, b, c]);
  const { D, h, k, roots } = r;

  // Canlı formül
  const sq = Math.sqrt(Math.max(D, 0)), sqInt = D >= 0 && isInt(sq);
  const twoA = tn(2 * a), minusB = tn(-b);
  let rootLines;
  if (D > 0) {
    const pm = `\\dfrac{${minusB} \\pm \\sqrt{${tn(D)}}}{${twoA}}`;
    rootLines = `x &= \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a} = ${pm}${sqInt ? ` = \\dfrac{${minusB} \\pm ${tn(sq)}}{${twoA}}` : ""} \\\\ x_1 &${eq(roots[0])} ${tn(roots[0])},\\quad x_2 ${eq(roots[1])} ${tn(roots[1])}`;
  } else if (D === 0) {
    rootLines = `x &= \\dfrac{-b \\pm \\sqrt{0}}{2a} = \\dfrac{${minusB}}{${twoA}} \\\\ x_1 &= x_2 ${eq(h)} ${tn(h)}`;
  } else {
    rootLines = `x &= \\dfrac{-b \\pm \\sqrt{${tn(D)}}}{2a} \\\\ &\\sqrt{${tn(D)}} \\notin \\mathbb{R}\\ \\Rightarrow\\ \\text{gerçel kök yok}`;
  }
  const live = `\\begin{aligned} y &= ${polyTex(a, b, c)} \\\\ \\Delta &= b^2 - 4ac = ${pT(b)}^2 - 4\\cdot ${pT(a)}\\cdot ${pT(c)} = ${tn(D)} \\\\ ${rootLines} \\end{aligned}`;

  // Okumalar
  const status = D > 0
    ? { tr: "Δ > 0 → iki kök", en: "two roots", color: "var(--mint)" }
    : D === 0 ? { tr: "Δ = 0 → tek kök", en: "one repeated root", color: "var(--gold)" }
      : { tr: "Δ < 0 → kök yok", en: "no real roots", color: "var(--coral)" };
  const items = [
    { label: U(a > 0 ? "Tepe · en düşük" : "Tepe · en yüksek"), labelEn: a > 0 ? "vertex, minimum" : "vertex, maximum", tex: ptTex(h, k), color: "var(--coral)" },
    { label: U("Simetri ekseni"), labelEn: "Axis of symmetry", tex: `x = -\\tfrac{${tn(b)}}{2\\cdot ${pT(a)}} ${eq(h)} ${tn(h)}`, color: "var(--violet)" },
    D > 0
      ? { label: U(`Δ = ${sn(D)} > 0 → iki kök`), labelEn: "two roots", tex: `{x_1 ${eq(roots[0])} ${tn(roots[0])}},\\quad {x_2 ${eq(roots[1])} ${tn(roots[1])}}`, color: status.color }
      : D === 0
        ? { label: U("Δ = 0 → tek kök"), labelEn: "one repeated root", tex: `x_1 = x_2 ${eq(h)} ${tn(h)}`, color: status.color }
        : { label: U(`Δ = ${sn(D)} < 0 → kök yok`), labelEn: "no real roots", value: <>gerçel kök yok <span className="en">· no real roots</span></>, color: status.color },
  ];

  // İpucu (duruma göre)
  let hint, hintEn;
  const lift = a > 0 ? ["sağa", "right", "yukarı kalkar", "rises"] : ["sola", "left", "aşağı iner", "sinks"];
  const back = a > 0 ? ["sola", "left", "aşağı indir", "lower it"] : ["sağa", "right", "yukarı kaldır", "raise it"];
  if (D > 0) {
    hint = `Parabol x eksenini 2 noktada kesiyor: Δ = ${sn(D)} > 0 → iki kök. c’yi ${lift[0]} çek: parabol ${lift[2]}, Δ küçülür… Δ = 0 olunca eksene tek noktada değer!`;
    hintEn = `The parabola cuts the x-axis twice: Δ = ${ne(D)} > 0 → two roots. Slide c ${lift[1]}: the parabola ${lift[3]} and Δ shrinks… at Δ = 0 it just touches the axis!`;
  } else if (D === 0) {
    hint = `Tam değdi! Δ = 0 → tek (çift) kök: tepe tam x ekseninin üstünde. c’yi bir adım daha ${lift[0]} çek: kökler kaybolur.`;
    hintEn = `A perfect touch! Δ = 0 → one repeated root: the vertex sits right on the x-axis. Move c one more step ${lift[1]} and the roots vanish.`;
  } else {
    hint = `Δ = ${sn(D)} < 0: parabol x eksenine hiç değmiyor → gerçel kök yok. c’yi ${back[0]} çek, ${back[2]}: kesişimler geri gelsin.`;
    hintEn = `Δ = ${ne(D)} < 0: the parabola never touches the x-axis → no real roots. Slide c ${back[1]} to ${back[3]} and bring the crossings back.`;
  }
  hint += a > 0 ? " a > 0: gülen yüz ∪, tepe en düşük nokta." : " a < 0: somurtan yüz ∩, tepe en yüksek nokta.";
  hintEn += a > 0 ? " a > 0: a smile ∪, the vertex is the lowest point." : " a < 0: a frown ∩, the vertex is the highest point.";

  return (
    <LabShell title="Parabol: y = ax² + bx + c" titleEn="Quadratic graph" hint={hint} hintEn={hintEn}>
      <Plot xMin={XMIN} xMax={XMAX} yMin={YMIN} yMax={YMAX} width={W} height={H} xStep={1} yStep={2}
        label={`Parabol y = ${sn(a)}x² ${b < 0 ? MINUS : "+"} ${sn(Math.abs(b))}x ${c < 0 ? MINUS : "+"} ${sn(Math.abs(c))}; tepe · vertex ${ptTxt(h, k)}; Δ = ${sn(D)}`}>
        <Scene a={a} b={b} c={c} D={D} h={h} k={k} roots={roots} />
      </Plot>
      <Slider tex="a" label="kollar: yön ve genişlik" labelEn="opening" value={a} min={-3} max={3} step={0.5} onChange={onA} fmt={(v) => sn(v, 1)} color="var(--gold)" />
      <Slider tex="b" label="eksen kayması" labelEn="shifts the axis" value={b} min={-6} max={6} step={1} onChange={setB} fmt={(v) => sn(v, 1)} color="var(--violet)" />
      <Slider tex="c" label="y-kesişimi" labelEn="y-intercept" value={c} min={-6} max={6} step={1} onChange={setC} fmt={(v) => sn(v, 1)} color="var(--sky)" />
      <LiveTex tex={live} />
      <Readout items={items} />
    </LabShell>
  );
}
