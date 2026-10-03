import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Curve, Point, Readout, LiveTex, Choice, usePlot, nf, tn } from "./kit.jsx";
import { Tex } from "../lib/tex.jsx";

/* Dönüşüm laboratuvarı: y = a·f(b(x − h)) + k.
   Temel grafik kesikli (mavi), dönüşmüş grafik altın. İki "kilit nokta" okla yeni yerine taşınır:
   (x, y) ↦ (x/b + h, a·y + k). Turuncu nokta sürüklenebilir → h ve k değişir. */

const W = 340, H = 285;                 // ≈ eşit ölçek (1 birim ≈ 27 px), sin dalgası gerçek biçiminde
const XMIN = -6, XMAX = 6, YMIN = -5, YMAX = 5;
const MINUS = "−";
const HK = 4;                           // h, k sınırı

/* ---------- sayı yardımcıları ---------- */
const sn = (v, d = 2) => nf(v, d).replace("-", MINUS);
const ne = (v, d = 2) => sn(v, d).replace(",", ".");
const U = (s) => s.toLocaleUpperCase("tr");
const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
const ptTxt = (x, y) => `(${sn(x)}${isInt(x) && isInt(y) ? "," : ";"} ${sn(y)})`;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const FUNCS = {
  sq: { tex: "x^2", f: (x) => x * x, keys: [[0, 0], [1, 1]], keyTxt: ["(0, 0)", "(1, 1)"], p0: ["tepe", "vertex"] },
  abs: { tex: "|x|", f: (x) => Math.abs(x), keys: [[0, 0], [1, 1]], keyTxt: ["(0, 0)", "(1, 1)"], p0: ["köşe", "corner"] },
  sin: { tex: "\\sin x", f: (x) => Math.sin(x), keys: [[0, 0], [Math.PI / 2, 1]], keyTxt: ["(0, 0)", "(π/2, 1)"], p0: ["başlangıç", "start"] },
  sqrt: { tex: "\\sqrt{x}", f: (x) => (x >= -1e-9 ? Math.sqrt(Math.max(0, x)) : NaN), keys: [[0, 0], [1, 1]], keyTxt: ["(0, 0)", "(1, 1)"], p0: ["başlangıç", "start"] },
};

/** Dönüşmüş fonksiyonun sade TeX’i */
function gTex(fn, a, b, h, k) {
  const hx = h === 0 ? "x" : `x ${h > 0 ? "-" : "+"} ${tn(Math.abs(h))}`;
  let inner;
  if (b === 1) inner = hx;
  else if (b === -1) inner = h === 0 ? "-x" : `-(${hx})`;
  else inner = h === 0 ? `${tn(b)}x` : `${tn(b)}(${hx})`;
  let core;
  if (fn === "sq") core = inner === "x" ? "x^2" : `\\left(${inner}\\right)^2`;
  else if (fn === "abs") core = `\\left|${inner}\\right|`;
  else if (fn === "sin") core = inner === "x" ? "\\sin x" : `\\sin\\left(${inner}\\right)`;
  else core = `\\sqrt{${inner}}`;
  const ap = a === 1 ? "" : a === -1 ? "-" : `${tn(a)}\\,`;
  const kp = k === 0 ? "" : ` ${k > 0 ? "+" : "-"} ${tn(Math.abs(k))}`;
  return `${ap}${core}${kp}`;
}
/** (x, y) ↦ (x/b + h, a·y + k) TeX’i, sadeleştirilmiş */
function mapTex(a, b, h, k) {
  const xs = b === 1 ? "x" : b === -1 ? "-x" : `\\tfrac{x}{${tn(b)}}`;
  const ys = a === 1 ? "y" : a === -1 ? "-y" : `${tn(a)}y`;
  const add = (v) => (v === 0 ? "" : ` ${v > 0 ? "+" : "-"} ${tn(Math.abs(v))}`);
  return `(x,\\ y) &\\mapsto \\left(${xs}${add(h)},\\ ${ys}${add(k)}\\right)`;
}

/* ---------- etiket yerleşimi (çakışmasız) ---------- */
function tagSize(t) {
  const w = Math.max(t.text.length * 6.6 + 14, t.sub ? t.sub.length * 5.4 + 14 : 0);
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
function Tag({ cx, cy, w, h, text, sub, color }) {
  return (
    <g pointerEvents="none">
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="8" fill="var(--plot-bg)" opacity="0.94" />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="8" fill={color} fillOpacity="0.13" stroke={color} strokeWidth="1.4" />
      {sub && <text x={cx} y={cy - 4} fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--ink-2)">{sub}</text>}
      <text x={cx} y={sub ? cy + 10 : cy + 4} fontSize="11.5" fontWeight="800" textAnchor="middle" fill={color}>{text}</text>
    </g>
  );
}

/** Kesikli ok (matematik koordinatı), iki uçtan kısaltılmış */
function MoveArrow({ x1, y1, x2, y2, color }) {
  const { sx, sy } = usePlot();
  let ax = sx(x1), ay = sy(y1), bx = sx(x2), by = sy(y2);
  const L = Math.hypot(bx - ax, by - ay);
  if (L < 22) return null;
  const ux = (bx - ax) / L, uy = (by - ay) / L;
  ax += ux * 6; ay += uy * 6; bx -= ux * 9; by -= uy * 9;
  const s = 7, hx = bx - ux * s, hy = by - uy * s;
  return (
    <g pointerEvents="none" opacity="0.9">
      <line x1={ax} y1={ay} x2={hx} y2={hy} stroke={color} strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
      <polygon points={`${bx},${by} ${hx - uy * s * 0.6},${hy + ux * s * 0.6} ${hx + uy * s * 0.6},${hy - ux * s * 0.6}`} fill={color} />
    </g>
  );
}

/* ---------- sahne ---------- */
function Scene({ fn, a, b, h, k, onDragKey }) {
  const { sx, sy } = usePlot();
  const F = FUNCS[fn];
  const g = (x) => a * F.f(b * (x - h)) + k;
  // √x: tanım kümesinin ucunu tam yakala (boşluk kalmasın)
  const gFrom = fn === "sqrt" ? (b > 0 ? h : XMIN) : XMIN;
  const gTo = fn === "sqrt" ? (b > 0 ? XMAX : h) : XMAX;
  const imgs = F.keys.map(([x, y]) => [x / b + h, a * y + k]);
  const inView = ([x, y]) => x >= XMIN && x <= XMAX && y >= YMIN && y <= YMAX;

  const ob = ([x, y], r = 8) => ({ x0: sx(x) - r, y0: sy(y) - r, x1: sx(x) + r, y1: sy(y) + r });
  const obstacles = F.keys.map((p) => ob(p, 6)).concat(imgs.filter(inView).map((p) => ob(p, 10)));
  const items = [];
  const colors = ["var(--coral)", "var(--violet)"];
  imgs.forEach((p, i) => {
    if (!inView(p)) return;
    const t = { key: "k" + i, sub: `${F.keyTxt[i]} ↦`, text: ptTxt(p[0], p[1]), color: colors[i], must: i === 0 };
    const [w, th] = tagSize(t);
    const px = sx(p[0]), py = sy(p[1]);
    // önce yukarı-sağ / yukarı-sol, sonra aşağı
    const dx = w / 2 + 10, dy = th / 2 + 10;
    t.at = [[px + dx, py - dy], [px - dx, py - dy], [px + dx, py + dy], [px - dx, py + dy], [px, py - dy - 6], [px, py + dy + 6], [px + dx + 8, py], [px - dx - 8, py]];
    items.push(t);
  });
  const tags = placeTags(items, obstacles);

  return (
    <g>
      {/* temel grafik (kesikli) */}
      <Curve f={F.f} from={fn === "sqrt" ? 0 : XMIN} samples={480} color="var(--sky)" width={2.2} dashed opacity={0.85} />
      {/* dönüşmüş grafik */}
      <Curve f={g} from={gFrom} to={gTo} samples={480} color="var(--gold)" width={8} opacity={0.18} />
      <Curve f={g} from={gFrom} to={gTo} samples={480} color="var(--gold)" width={3} />
      {/* kilit noktaların yolculuğu */}
      {F.keys.map((p, i) => <MoveArrow key={"a" + i} x1={p[0]} y1={p[1]} x2={imgs[i][0]} y2={imgs[i][1]} color={colors[i]} />)}
      {F.keys.map((p, i) => <circle key={"b" + i} cx={sx(p[0])} cy={sy(p[1])} r="4.5" fill="var(--plot-bg)" stroke="var(--sky)" strokeWidth="2" pointerEvents="none" />)}
      {inView(imgs[1]) && <Point x={imgs[1][0]} y={imgs[1][1]} color="var(--violet)" r={5} />}
      {tags.map((t) => <Tag key={t.key} {...t} />)}
      {inView(imgs[0]) && <Point x={imgs[0][0]} y={imgs[0][1]} color="var(--coral)" r={7} draggable snap={0.5} onDrag={onDragKey} />}
    </g>
  );
}

/** Lejant: küçük çizgi örnekleri */
function Swatch({ color, dashed }) {
  return (
    <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true" style={{ flex: "none" }}>
      <line x1="2" y1="5" x2="24" y2="5" stroke={color} strokeWidth={dashed ? 2.2 : 3.2} strokeDasharray={dashed ? "5 4" : undefined} strokeLinecap="round" />
    </svg>
  );
}

const DEFAULTS = { a: 1, b: 1, h: 2, k: 1 };

export default function TransformLab() {
  const [fn, setFn] = useState("sq");
  const [a, setAraw] = useState(DEFAULTS.a);
  const [b, setBraw] = useState(DEFAULTS.b);
  const [h, setHraw] = useState(DEFAULTS.h);
  const [k, setKraw] = useState(DEFAULTS.k);
  const [last, setLast] = useState("h");
  // a = 0 ya da b = 0 grafiği yok eder: kaydırıcı 0’ı atlar
  const skip0 = (v, prev) => (v === 0 ? (prev > 0 ? -0.5 : 0.5) : v);
  const setA = (v) => { setAraw((p) => skip0(v, p)); setLast("a"); };
  const setB = (v) => { setBraw((p) => skip0(v, p)); setLast("b"); };
  const setH = (v) => { setHraw(v); setLast("h"); };
  const setK = (v) => { setKraw(v); setLast("k"); };
  const onDragKey = (x, y) => {
    // sürüklenen nokta (h, k)’dir — f’nin kilit noktası (0, 0) olduğu için
    const nh = clamp(Math.round(x * 2) / 2, -HK, HK), nk = clamp(Math.round(y * 2) / 2, -HK, HK);
    if (nh !== h) { setHraw(nh); setLast("h"); }
    if (nk !== k) { setKraw(nk); if (nh === h) setLast("k"); }
  };
  const reset = () => { setAraw(DEFAULTS.a); setBraw(DEFAULTS.b); setHraw(0); setKraw(0); setLast("reset"); };

  const F = FUNCS[fn];
  const live = useMemo(() => `\\begin{aligned} y &= a\\,f\\big(b(x-h)\\big)+k \\\\ y &= ${gTex(fn, a, b, h, k)} \\\\ ${mapTex(a, b, h, k)} \\end{aligned}`, [fn, a, b, h, k]);

  // Her dönüşümün iki dilli açıklaması: üstte Türkçe (kalın), altta İngilizce (küçük)
  const v = (tr, en) => <><span style={{ fontSize: 15 }}>{tr}</span><span className="en" style={{ display: "block", fontSize: 12.5, fontWeight: 500 }}>{en}</span></>;
  const none = v("yok", "none");
  const A = Math.abs(a), B = Math.abs(b);
  const frac1b = (fmt) => (B === 2 ? "½" : B === 3 ? "⅓" : fmt(1 / B));
  const aTr = [A !== 1 && `↕ ×${sn(A)} ${A > 1 ? "uzar" : "basılır"}`, a < 0 && `${A !== 1 ? "" : "↕ "}x’e göre yansır`].filter(Boolean).join(", ");
  const aEn = [A !== 1 && `×${ne(A)} ${A > 1 ? "stretch" : "squash"}`, a < 0 && "reflect in x-axis"].filter(Boolean).join(", ");
  const bTr = [B !== 1 && `↔ ×${frac1b(sn)} ${B > 1 ? "sıkışır" : "genişler"}`, b < 0 && `${B !== 1 ? "" : "↔ "}y’ye göre yansır`].filter(Boolean).join(", ");
  const bEn = [B !== 1 && `×${frac1b(ne)} ${B > 1 ? "compress" : "stretch"}`, b < 0 && "reflect in y-axis"].filter(Boolean).join(", ");
  const items = [
    { label: U("h · yatay kayma"), labelEn: "horizontal shift", color: h === 0 ? "var(--line)" : "var(--sky)",
      value: h === 0 ? none : h > 0 ? v(`→ ${sn(h)} sağa`, `${ne(h)} right`) : v(`← ${sn(-h)} sola`, `${ne(-h)} left`) },
    { label: U("k · dikey kayma"), labelEn: "vertical shift", color: k === 0 ? "var(--line)" : "var(--mint)",
      value: k === 0 ? none : k > 0 ? v(`↑ ${sn(k)} yukarı`, `${ne(k)} up`) : v(`↓ ${sn(-k)} aşağı`, `${ne(-k)} down`) },
    { label: U("a · dikey ölçek"), labelEn: "vertical stretch", color: a === 1 ? "var(--line)" : "var(--coral)", value: a === 1 ? none : v(aTr, aEn) },
    { label: U("b · yatay ölçek"), labelEn: "horizontal stretch", color: b === 1 ? "var(--line)" : "var(--violet)", value: b === 1 ? none : v(bTr, bEn) },
  ];

  // İpucu: en son oynanan kaydırıcıya göre
  let hint, hintEn;
  if (last === "h") {
    if (h > 0) { hint = `(x − ${sn(h)}) yazınca grafik ${sn(h)} birim SAĞA gider — işaretin TERSİ! Turuncu noktayı sürükle ya da h’yi sola çek.`; hintEn = `Writing (x − ${ne(h)}) moves the graph ${ne(h)} units RIGHT — the OPPOSITE of the sign! Drag the orange point or slide h left.`; }
    else if (h < 0) { hint = `(x + ${sn(-h)}) yazınca grafik ${sn(-h)} birim SOLA gider — yine işaretin tersi!`; hintEn = `Writing (x + ${ne(-h)}) moves the graph ${ne(-h)} units LEFT — again the opposite of the sign!`; }
    else { hint = "h = 0: yatay kayma yok. h’yi kaydır ya da turuncu noktayı sürükle."; hintEn = "h = 0: no horizontal shift. Slide h or drag the orange point."; }
  } else if (last === "k") {
    hint = k === 0 ? "k = 0: dikey kayma yok. k’yi kaydır: grafik asansör gibi iner-çıkar." : `k dışarıda, söylediğini yapar: ${k > 0 ? "+" : MINUS}${sn(Math.abs(k))} → ${sn(Math.abs(k))} birim ${k > 0 ? "YUKARI" : "AŞAĞI"}.`;
    hintEn = k === 0 ? "k = 0: no vertical shift. Slide k: the graph rides up and down like a lift." : `k is outside, so it does what it says: ${k > 0 ? "+" : "−"}${ne(Math.abs(k))} → ${ne(Math.abs(k))} units ${k > 0 ? "UP" : "DOWN"}.`;
  } else if (last === "a") {
    hint = a < 0 ? "a negatif → grafik x eksenine göre takla atar (baş aşağı)." : Math.abs(a) > 1 ? `a = ${sn(a)} → her y değeri ${sn(a)} katına çıkar: grafik dikleşir.` : Math.abs(a) < 1 ? `a = ${sn(a)} → y değerleri küçülür: grafik basıklaşır.` : "a = 1: dikey değişiklik yok.";
    hintEn = a < 0 ? "Negative a → the graph flips over the x-axis (upside down)." : Math.abs(a) > 1 ? `a = ${ne(a)} → every y-value is multiplied by ${ne(a)}: the graph gets steeper.` : Math.abs(a) < 1 ? `a = ${ne(a)} → y-values shrink: the graph gets flatter.` : "a = 1: no vertical change.";
  } else if (last === "b") {
    const even = fn === "sq" || fn === "abs";
    hint = b < 0 ? `b negatif → grafik y eksenine göre aynada görünür (sağ-sol yer değiştirir).${even ? " Bu grafik simetrik, şekli aynı kalır — ama mor noktanın yer değiştirdiğine bak!" : ""}` : Math.abs(b) > 1 ? `b = ${sn(b)} → grafik yatayda ${sn(b)} kat SIKIŞIR (×1/${sn(b)}) — içerideki sayı ters çalışır!` : Math.abs(b) < 1 ? `b = ${sn(b)} → grafik yatayda GENİŞLER (×${sn(1 / b)}) — içeride küçük sayı, dışarıda büyük etki.` : "b = 1: yatay değişiklik yok.";
    hintEn = b < 0 ? `Negative b → the graph is mirrored in the y-axis (left and right swap).${even ? " This graph is symmetric so its shape stays the same — but watch the purple point jump sides!" : ""}` : Math.abs(b) > 1 ? `b = ${ne(b)} → the graph is SQUEEZED sideways by ${ne(b)} (×1/${ne(b)}) — numbers inside work backwards!` : Math.abs(b) < 1 ? `b = ${ne(b)} → the graph STRETCHES sideways (×${ne(1 / b)}).` : "b = 1: no horizontal change.";
  } else {
    hint = "Her şey sıfırlandı: altın grafik temel grafiğin üstünde. Bir kaydırıcı seç ve oynat!";
    hintEn = "Everything is reset: the gold graph sits on top of the base graph. Pick a slider and play!";
  }
  hint += " Kural: parantez İÇİ (b, h) yatay ve TERS çalışır; DIŞI (a, k) dikey ve söylediğini yapar.";
  hintEn += " Rule: INSIDE the brackets (b, h) acts sideways and BACKWARDS; OUTSIDE (a, k) acts up-down and does what it says.";

  return (
    <LabShell title="Grafik dönüşümleri" titleEn="Transforming graphs" hint={hint} hintEn={hintEn}>
      <div className="lab-slider-top" style={{ marginBottom: -4 }}>
        <span className="lab-slider-name"><span>Temel fonksiyon <i>f</i></span><span className="en">Base function</span></span>
        <button type="button" className="chip" onClick={reset} style={{ padding: "4px 10px", fontSize: 12.5 }}>↺ Sıfırla <span className="en">Reset</span></button>
      </div>
      <Choice options={Object.entries(FUNCS).map(([value, o]) => ({ value, tex: o.tex }))} value={fn} onChange={setFn} />
      <Plot xMin={XMIN} xMax={XMAX} yMin={YMIN} yMax={YMAX} width={W} height={H} xStep={1} yStep={1}
        label={`Temel grafik y = f(x) ve dönüşmüş grafik · base and transformed graph; ${F.p0[0]} · ${F.p0[1]} ${ptTxt(h, k)}`}>
        <Scene fn={fn} a={a} b={b} h={h} k={k} onDragKey={onDragKey} />
      </Plot>
      <div className="legend" style={{ marginTop: -4, alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Swatch color="var(--sky)" dashed /><Tex tex={`y=${F.tex}`} /> <span>temel <span className="en">base</span></span></span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Swatch color="var(--gold)" /><span>dönüşmüş <span className="en">transformed</span></span></span>
      </div>
      <Slider tex="h" label="yatay kayma" labelEn="horizontal shift" value={h} min={-HK} max={HK} step={0.5} onChange={setH} fmt={(x) => sn(x, 1)} color="var(--sky)" />
      <Slider tex="k" label="dikey kayma" labelEn="vertical shift" value={k} min={-HK} max={HK} step={0.5} onChange={setK} fmt={(x) => sn(x, 1)} color="var(--mint)" />
      <Slider tex="a" label="dikey uzatma" labelEn="vertical stretch" value={a} min={-3} max={3} step={0.5} onChange={setA} fmt={(x) => sn(x, 1)} color="var(--coral)" />
      <Slider tex="b" label="yatay sıkıştırma" labelEn="horizontal squeeze" value={b} min={-3} max={3} step={0.5} onChange={setB} fmt={(x) => sn(x, 1)} color="var(--violet)" />
      <LiveTex tex={live} />
      <Readout items={items} />
    </LabShell>
  );
}
