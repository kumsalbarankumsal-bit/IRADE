import React, { useState, useMemo } from "react";
import { LabShell, Slider, Choice, Readout, LiveTex, nf } from "./kit.jsx";

/* Kesir laboratuvarı — iki kesir, dört işlem.
   +, −, ÷: ortak ölçekte çubuk modeli (ortak payda / çıkarma / “kaç tane sığar”).
   ×: alan modeli (sütunlar × satırlar, kesişim = sonuç). */

const W = 340, H = 200;
const MINUS = "−";
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const lcm = (a, b) => (a / gcd(a, b)) * b;

/** Sadeleştirilmiş kesir { p, q } (q > 0) */
function simp(p, q) { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q); return { p: p / g, q: q / g, g }; }
const fracTex = ({ p, q }) => (q === 1 ? `${p}` : p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`);
/** Tam sayılı kesir (ör. 1 5/12) gerekiyorsa */
function mixedTex({ p, q }) {
  if (q === 1 || Math.abs(p) < q) return null;
  const w = Math.trunc(Math.abs(p) / q), r = Math.abs(p) % q;
  return r === 0 ? null : `${p < 0 ? "-" : ""}${w}\\tfrac{${r}}{${q}}`;
}
/** Ondalık: 4 basamağa kadar kesin mi? */
function decimal({ p, q }) {
  let m = q; while (m % 2 === 0) m /= 2; while (m % 5 === 0) m /= 5;
  const v = p / q;
  const exact = m === 1 && Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-9;
  return { v, exact };
}

/* ---------- SVG yardımcıları ---------- */
function SvgFrac({ x, y, p, q, color, size = 14, sign = false }) {
  const neg = p < 0, a = Math.abs(p);
  if (q === 1) return <text x={x} y={y + size * 0.36} fontSize={size + 3} fontWeight="800" textAnchor="middle" fill={color}>{sign ? "= " : ""}{neg ? MINUS : ""}{a}</text>;
  const w = Math.max(String(a).length, String(q).length) * size * 0.62 + 6;
  return (
    <g>
      {(neg || sign) && <text x={x - w / 2 - 3} y={y + size * 0.36} fontSize={size + 2} fontWeight="800" textAnchor="end" fill={color}>{neg ? MINUS : "="}</text>}
      <text x={x} y={y - 4} fontSize={size} fontWeight="800" textAnchor="middle" fill={color}>{a}</text>
      <line x1={x - w / 2} x2={x + w / 2} y1={y} y2={y} stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <text x={x} y={y + size + 1} fontSize={size} fontWeight="800" textAnchor="middle" fill={color}>{q}</text>
    </g>
  );
}

let seq = 0;
/** Ortak ölçekli çubuk sahnesi (+, −, ÷) */
function BarScene({ op, n1, d1, n2, d2, res, L }) {
  const uid = useMemo(() => `frbar${++seq}`, []);
  const f1 = n1 / d1, f2 = n2 / d2;
  const r = res ? res.p / res.q : 0;
  let lo = 0, hi = Math.max(1, Math.ceil(f1 - 1e-9), Math.ceil(f2 - 1e-9));
  if (op === "add") hi = Math.max(hi, Math.ceil(f1 + f2 - 1e-9));
  if (op === "sub") lo = Math.min(0, Math.floor(f1 - f2));
  const X0 = 58, X1 = W - 12;
  const sx = (v) => X0 + ((v - lo) / (hi - lo)) * (X1 - X0);
  const unit = sx(1) - sx(0);
  const bh = 28, rows = [16, 64, 124];

  /** Bölmeli çubuk: [a,b] arası dolu, [oa,ob] arası çerçeve, 1/d’lik bölmeler */
  const bar = (key, y, d, fills, oa, ob) => {
    const cell = unit / d;
    const lines = [];
    if (cell >= 3) for (let k = Math.round(oa * d) + 1; k < Math.round(ob * d); k++) if (k % d !== 0) lines.push(k / d);
    const wholes = [];
    for (let k = Math.ceil(oa) + (Number.isInteger(oa) ? 1 : 0); k < ob; k++) wholes.push(k);
    return (
      <g key={key}>
        <clipPath id={`${uid}-${key}`}><rect x={sx(oa)} y={y} width={sx(ob) - sx(oa)} height={bh} rx="6" /></clipPath>
        <rect x={sx(oa)} y={y} width={sx(ob) - sx(oa)} height={bh} rx="6" fill="var(--surface-2)" />
        <g clipPath={`url(#${uid}-${key})`}>
          {fills.map(([a, b, c, op2 = 0.95], i) => b - a > 1e-9 && (
            <rect key={i} x={sx(a)} y={y} width={sx(b) - sx(a)} height={bh} fill={c} fillOpacity={op2} />
          ))}
          {lines.map((v) => <line key={v} x1={sx(v)} x2={sx(v)} y1={y} y2={y + bh} stroke="var(--plot-bg)" strokeWidth={cell > 8 ? 2 : 1.2} />)}
        </g>
        {wholes.map((v) => <line key={"w" + v} x1={sx(v)} x2={sx(v)} y1={y - 3} y2={y + bh + 3} stroke="var(--ink-2)" strokeWidth={unit >= 24 ? 2 : 1.2} />)}
        <rect x={sx(oa)} y={y} width={sx(ob) - sx(oa)} height={bh} rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1.2" />
      </g>
    );
  };

  const els = [];
  const top1 = Math.max(1, Math.ceil(f1 - 1e-9)), top2 = Math.max(1, Math.ceil(f2 - 1e-9));
  els.push(bar("b1", rows[0], d1, [[0, f1, "var(--gold)"]], 0, top1));
  els.push(bar("b2", rows[1], d2, [[0, f2, "var(--sky)"]], 0, top2));

  if (op === "add") {
    const top = Math.max(1, Math.ceil(f1 + f2 - 1e-9));
    els.push(bar("b3", rows[2], L, [[0, f1, "var(--gold)"], [f1, f1 + f2, "var(--sky)"]], 0, top));
  } else if (op === "sub") {
    const oa = Math.min(0, Math.floor(f1 - f2)), ob = Math.max(1, Math.ceil(f1 - 1e-9));
    const fills = [[0, f1, "var(--gold)"]];
    // çıkarılan kısım (soluk, kesikli)
    fills.push([Math.max(r, 0), f1, "var(--plot-bg)", 0.72]);
    if (r > 0) fills.push([0, r, "var(--mint)", 0.9]);
    if (r < 0) fills.push([r, 0, "var(--coral)", 0.9]);
    els.push(bar("b3", rows[2], L, fills, oa, ob));
    // çıkarılanın çerçevesi
    els.push(<rect key="rm" x={sx(r)} y={rows[2] - 4} width={Math.max(0, sx(f1) - sx(r))} height={bh + 8} rx="7" fill="none" stroke="var(--sky)" strokeWidth="2" strokeDasharray="5 3" />);
    if (f2 > 0) els.push(<text key="rmt" x={(sx(r) + sx(f1)) / 2} y={rows[2] - 8} fontSize="11" fontWeight="800" textAnchor="middle" fill="var(--sky)" style={{ paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3 }}>{MINUS}{n2}/{d2}</text>);
  } else if (op === "div" && f2 > 0) {
    // f1’in içine kaç tane f2 sığar?
    const q = f1 / f2, count = Math.ceil(q - 1e-9);
    const fills = [];
    const many = count > 40;
    for (let i = 0; i < count && !many; i++) {
      const a = i * f2, b = Math.min((i + 1) * f2, f1);
      fills.push([a, b, i % 2 ? "var(--violet)" : "var(--sky)", 0.8]);
    }
    if (many) fills.push([0, f1, "var(--sky)", 0.6]);
    const top = Math.max(1, Math.ceil(Math.max(f1, f2) - 1e-9));
    els.push(bar("b3", rows[2], 1, fills, 0, top));
    if (many) els.push(<text key="many" x={(sx(0) + sx(f1)) / 2} y={rows[2] + bh / 2 + 4.5} fontSize="12.5" fontWeight="800" textAnchor="middle" fill="var(--ink)"
      style={{ paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3 }}>{`${nf(q, 2)} × ${n2}/${d2}`}</text>);
    // parça çerçeveleri ve numaraları
    for (let i = 0; i < count && !many; i++) {
      const a = i * f2, b = (i + 1) * f2, partial = b > f1 + 1e-9;
      els.push(<rect key={"p" + i} x={sx(a) + 1} y={rows[2] + 1} width={Math.max(0, sx(b) - sx(a) - 2)} height={bh - 2} rx="5" fill="none"
        stroke={i % 2 ? "var(--violet)" : "var(--sky)"} strokeWidth="2" strokeDasharray={partial ? "4 3" : undefined} />);
      const wpx = sx(Math.min(b, f1)) - sx(a);
      if (wpx >= 13) {
        // kısmi son parça: sığan kesir (f1 − a) / f2
        const part = simp(n1 * d2 - i * n2 * d1, n2 * d1);
        const label = partial ? `${part.p}/${part.q}` : String(i + 1);
        if (!partial || wpx >= label.length * 6.5 + 4) {
          els.push(<text key={"pt" + i} x={(sx(a) + sx(Math.min(b, f1))) / 2} y={rows[2] + bh / 2 + 4.5} fontSize="12" fontWeight="800" textAnchor="middle" fill="var(--ink)"
            style={{ paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3 }}>{label}</text>);
        }
      }
    }
    // f1 sınırı
    els.push(<line key="f1l" x1={sx(f1)} x2={sx(f1)} y1={rows[0]} y2={rows[2] + bh + 4} stroke="var(--gold)" strokeWidth="2" strokeDasharray="4 3" />);
  } else if (op === "div") {
    els.push(<text key="dz" x={(X0 + X1) / 2} y={rows[2] + bh / 2 + 5} fontSize="13" fontWeight="800" textAnchor="middle" fill="var(--coral)">0’a bölünmez · can’t divide by 0</text>);
  }

  // ölçek: tam sayılar
  const lab = [];
  const stepL = [1, 2, 5, 10].find((s) => s * unit >= 20) || 10;
  for (let v = lo; v <= hi; v++) lab.push(v);
  return (
    <svg className="lab-plot" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`Kesir çubukları · Fraction bars: ${n1}/${d1} ${op} ${n2}/${d2}`}>
      <rect x="0" y="0" width={W} height={H} rx="14" fill="var(--plot-bg)" />
      {lab.filter((v) => v % stepL === 0).map((v) => <line key={"g" + v} x1={sx(v)} x2={sx(v)} y1={8} y2={H - 26} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />)}
      {els}
      {lab.filter((v) => v % stepL === 0).map((v) => (
        <text key={"t" + v} x={sx(v)} y={H - 10} fontSize={v === 0 ? 12 : 11} fontWeight={v === 0 ? 800 : 700} textAnchor="middle" fill={v === 0 ? "var(--ink)" : "var(--ink-3)"}>{v < 0 ? MINUS + -v : v}</text>
      ))}
      {/* satır etiketleri */}
      <SvgFrac x={30} y={rows[0] + bh / 2 - 3} p={n1} q={d1} color="var(--gold)" />
      <SvgFrac x={30} y={rows[1] + bh / 2 - 3} p={n2} q={d2} color="var(--sky)" />
      {res && <SvgFrac x={33} y={rows[2] + bh / 2 - 3} p={res.p} q={res.q} color={res.p < 0 ? "var(--coral)" : "var(--mint)"} sign />}
      <line x1={8} x2={W - 8} y1={rows[2] - 18} y2={rows[2] - 18} stroke="var(--line)" strokeWidth="1" opacity={op === "sub" ? 0 : 1} />
    </svg>
  );
}

/** Alan modeli (×) */
function AreaScene({ n1, d1, n2, d2, res }) {
  const f1 = n1 / d1, f2 = n2 / d2;
  const X = Math.max(1, Math.ceil(f1 - 1e-9)), Y = Math.max(1, Math.ceil(f2 - 1e-9));
  const GX = 52, GB = H - 44, maxW = 178, maxH = GB - 12;
  const u = Math.min(maxW / X, maxH / Y);
  const gw = u * X, gh = u * Y;
  const px = (x) => GX + x * u, py = (y) => GB - y * u;
  const cols = [], rowsL = [];
  if (u / d1 >= 3) for (let k = 1; k < X * d1; k++) if (k % d1) cols.push(k / d1);
  if (u / d2 >= 3) for (let k = 1; k < Y * d2; k++) if (k % d2) rowsL.push(k / d2);
  const raw = { p: n1 * n2, q: d1 * d2 };
  const RX = (GX + maxW + W) / 2 + 4;
  return (
    <svg className="lab-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Alan modeli · Area model: ${n1}/${d1} × ${n2}/${d2} = ${raw.p}/${raw.q}`}>
      <rect x="0" y="0" width={W} height={H} rx="14" fill="var(--plot-bg)" />
      <rect x={px(0)} y={py(Y)} width={gw} height={gh} fill="var(--surface-2)" />
      <rect x={px(0)} y={py(Y)} width={f1 * u} height={(Y - f2) * u} fill="var(--gold)" fillOpacity="0.8" />
      <rect x={px(f1)} y={py(f2)} width={(X - f1) * u} height={f2 * u} fill="var(--sky)" fillOpacity="0.7" />
      <rect x={px(0)} y={py(f2)} width={f1 * u} height={f2 * u} fill="var(--violet)" fillOpacity="0.95" />
      {cols.map((v) => <line key={"c" + v} x1={px(v)} x2={px(v)} y1={py(Y)} y2={py(0)} stroke="var(--plot-bg)" strokeWidth="1.6" />)}
      {rowsL.map((v) => <line key={"r" + v} x1={px(0)} x2={px(X)} y1={py(v)} y2={py(v)} stroke="var(--plot-bg)" strokeWidth="1.6" />)}
      {/* birim kareler */}
      {Array.from({ length: X * Y }, (_, i) => (
        <rect key={"u" + i} x={px(i % X)} y={py(Math.floor(i / X) + 1)} width={u} height={u} fill="none" stroke="var(--ink-2)" strokeWidth="1.8" />
      ))}
      {/* kenar ayraçları */}
      <path d={`M${px(0)},${GB + 6} L${px(0)},${GB + 11} L${px(f1)},${GB + 11} L${px(f1)},${GB + 6}`} fill="none" stroke="var(--gold)" strokeWidth="2" opacity={f1 > 0 ? 1 : 0} />
      <path d={`M${GX - 6},${py(0)} L${GX - 11},${py(0)} L${GX - 11},${py(f2)} L${GX - 6},${py(f2)}`} fill="none" stroke="var(--sky)" strokeWidth="2" opacity={f2 > 0 ? 1 : 0} />
      <SvgFrac x={Math.max(px(0) + 14, Math.min(px(f1 / 2), px(X) - 10))} y={GB + 26} p={n1} q={d1} color="var(--gold)" size={11.5} />
      <SvgFrac x={GX - 30} y={Math.min(GB - 10, Math.max(16, py(f2 / 2)))} p={n2} q={d2} color="var(--sky)" size={11.5} />
      {/* sağ panel: boyalı / toplam */}
      <text x={RX} y={20} fontSize="11" fontWeight="700" textAnchor="middle" fill="var(--ink-2)">boyalı</text>
      <text x={RX} y={33} fontSize="10.5" textAnchor="middle" fill="var(--sky)">shaded</text>
      <SvgFrac x={RX} y={60} p={raw.p} q={raw.q} color="var(--violet)" size={18} />
      {res && raw.q !== 1 && res.q !== raw.q && <SvgFrac x={RX + 6} y={104} p={res.p} q={res.q} color="var(--mint)" size={14} sign />}
      <text x={RX} y={142} fontSize="10.5" fontWeight="700" textAnchor="middle" fill="var(--ink-2)">1 bütün</text>
      <text x={RX} y={154} fontSize="10" textAnchor="middle" fill="var(--sky)">1 whole</text>
      <text x={RX} y={173} fontSize="12" fontWeight="800" textAnchor="middle" fill="var(--ink)">= {d1 * d2} kare</text>
      <text x={RX} y={187} fontSize="10" textAnchor="middle" fill="var(--sky)">= {d1 * d2} {d1 * d2 === 1 ? "cell" : "cells"}</text>
    </svg>
  );
}

function OpLabel({ sym, tr, en }) {
  return (
    <span style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1, minWidth: 48 }}>
      <b style={{ fontSize: 19, lineHeight: 1.05 }}>{sym}</b>
      <span style={{ fontSize: 12.5 }}>{tr}</span>
      <span className="en" style={{ fontSize: 10.5 }}>{en}</span>
    </span>
  );
}

const HINTS = {
  add: ["Neden 1/2 + 1/3 ≠ 2/5? Alttaki çubuğa bak: parçalar aynı boya gelmeden toplanmaz. Paydaları değiştir!", "Why is 1/2 + 1/3 not 2/5? Look at the bottom bar: pieces must be the same size first. Change the denominators!"],
  sub: ["Kesikli kutu çıkarılan parça, yeşil kalan kısım. İkinci kesri büyüt: sonuç sıfırın altına iner (mercan).", "The dashed box is taken away, green is what’s left. Make the second fraction bigger: the result drops below zero (coral)."],
  mul: ["Kesirle çarpmak “…’nin …’si” demek: mor bölge sonuç. 1’den küçük bir kesirle çarpınca sonuç küçülür!", "Multiplying by a fraction means “… of …”: the violet area is the result. Multiply by less than 1 and it shrinks!"],
  div: ["“Birincinin içine ikinciden kaç tane sığar?” İkinci kesri küçült: sığan parça sayısı artar.", "“How many of the second fit into the first?” Shrink the second fraction: more pieces fit."],
};

export default function FractionLab() {
  const [n1, setN1] = useState(1);
  const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(1);
  const [d2, setD2] = useState(3);
  const [op, setOp] = useState("add");

  const m = useMemo(() => {
    const L = lcm(d1, d2), k1 = L / d1, k2 = L / d2;
    let res = null, raw = null;
    if (op === "add") raw = { p: n1 * k1 + n2 * k2, q: L };
    else if (op === "sub") raw = { p: n1 * k1 - n2 * k2, q: L };
    else if (op === "mul") raw = { p: n1 * n2, q: d1 * d2 };
    else if (n2 !== 0) raw = { p: n1 * d2, q: d1 * n2 };
    if (raw) res = simp(raw.p, raw.q);
    return { L, k1, k2, raw, res };
  }, [n1, d1, n2, d2, op]);
  const { L, k1, k2, raw, res } = m;

  const F1 = `\\frac{${n1}}{${d1}}`, F2 = `\\frac{${n2}}{${d2}}`;
  const sym = { add: "+", sub: "-", mul: "\\cdot", div: "\\div" }[op];
  const resTex = res ? fracTex(res) : "";
  const rawTex = raw ? `\\frac{${raw.p}}{${raw.q}}` : "";
  const needSimp = res && res.g > 1;
  const finishRaw = raw && raw.q === 1 ? `${raw.p}` : rawTex;

  let tex;
  if (op === "add" || op === "sub") {
    const s = op === "add" ? "+" : "-";
    if (d1 === d2) {
      tex = `\\begin{aligned} ${F1} ${s} ${F2} &= \\frac{${n1} ${s} ${n2}}{${d1}} = ${finishRaw} ${needSimp ? `\\\\ &= \\frac{${raw.p} \\div ${res.g}}{${raw.q} \\div ${res.g}} = ${resTex}` : ""} \\end{aligned}`;
    } else {
      const e1 = k1 === 1 ? F1 : `\\frac{${n1}\\cdot ${k1}}{${d1}\\cdot ${k1}}`;
      const e2 = k2 === 1 ? F2 : `\\frac{${n2}\\cdot ${k2}}{${d2}\\cdot ${k2}}`;
      tex = `\\begin{aligned} ${F1} ${s} ${F2} &= ${e1} ${s} ${e2} \\\\ &= \\frac{${n1 * k1}}{${L}} ${s} \\frac{${n2 * k2}}{${L}} = ${finishRaw} ${needSimp ? `\\\\ &= \\frac{${raw.p} \\div ${res.g}}{${raw.q} \\div ${res.g}} = ${resTex}` : ""} \\end{aligned}`;
    }
  } else if (op === "mul") {
    tex = `\\begin{aligned} ${F1} \\cdot ${F2} &= \\frac{${n1}\\cdot ${n2}}{${d1}\\cdot ${d2}} = ${finishRaw} ${needSimp ? `\\\\ &= \\frac{${raw.p} \\div ${res.g}}{${raw.q} \\div ${res.g}} = ${resTex}` : ""} \\end{aligned}`;
  } else if (n2 === 0) {
    tex = `${F1} \\div ${F2} = ${F1} \\div 0 = \\; ?`;
  } else {
    tex = `\\begin{aligned} ${F1} \\div ${F2} &= ${F1} \\cdot \\frac{${d2}}{${n2}} = ${finishRaw} ${needSimp ? `\\\\ &= ${resTex}` : ""} \\end{aligned}`;
  }

  const dec = res ? decimal(res) : null;
  const mixed = res ? mixedTex(res) : null;
  const items = [
    { label: "Sonuç", labelEn: "Result", ...(res ? { tex: (mixed ? `${resTex} = ${mixed}` : resTex).replace(/\\frac/g, "\\dfrac") } : { value: "—" }), color: res ? (res.p < 0 ? "var(--coral)" : "var(--mint)") : "var(--coral)" },
    { label: "Ondalık", labelEn: "Decimal", value: dec ? `${dec.exact ? "" : "≈ "}${nf(dec.v, 4).replace("-", MINUS)}` : "—", color: "var(--gold)" },
  ];
  if (op === "add" || op === "sub") items.push({ label: "Ortak payda", labelEn: "LCM", tex: `\\text{EKOK}(${d1},${d2}) = ${L}`, color: "var(--sky)" });
  if (op === "mul") items.push({ label: "Sadeleştir", labelEn: "Simplify", ...(needSimp ? { tex: `\\div ${res.g}` } : { value: "—" }), color: "var(--violet)" });
  if (op === "div") items.push({ label: "Ters çevir", labelEn: "Flip", ...(n2 === 0 ? { value: "—" } : { tex: `\\dfrac{${n2}}{${d2}} \\to \\dfrac{${d2}}{${n2}}` }), color: "var(--violet)" });
  items.push({ label: "Yüzde", labelEn: "Percent", value: dec ? `${dec.exact ? "" : "≈ "}${nf(dec.v * 100, 1).replace("-", MINUS)}%` : "—", color: "var(--ink-3)" });

  const [hint, hintEn] = n2 === 0 && op === "div"
    ? ["Sıfıra bölme tanımsızdır: 0’ın içine hiçbir şey “kaç kez” sığmaz. Pay’ı 0’dan büyük yap.", "Dividing by zero is undefined. Make the numerator bigger than 0."]
    : HINTS[op];

  return (
    <LabShell title="Kesirler" titleEn="Fractions" hint={hint} hintEn={hintEn}>
      {op === "mul"
        ? <AreaScene n1={n1} d1={d1} n2={n2} d2={d2} res={res} />
        : <BarScene op={op} n1={n1} d1={d1} n2={n2} d2={d2} res={res} L={L} />}
      <Choice value={op} onChange={setOp} options={[
        { value: "add", label: <OpLabel sym="+" tr="topla" en="add" /> },
        { value: "sub", label: <OpLabel sym="−" tr="çıkar" en="subtract" /> },
        { value: "mul", label: <OpLabel sym="×" tr="çarp" en="multiply" /> },
        { value: "div", label: <OpLabel sym="÷" tr="böl" en="divide" /> },
      ]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
        <div className="lab-chip-label" style={{ color: "var(--gold)" }}>1. kesir <span className="en">· fraction 1</span></div>
        <div className="lab-chip-label" style={{ color: "var(--sky)" }}>2. kesir <span className="en">· fraction 2</span></div>
        <Slider label="pay" labelEn="numerator" value={n1} min={0} max={12} step={1} onChange={setN1} color="var(--gold)" />
        <Slider label="pay" labelEn="numerator" value={n2} min={0} max={12} step={1} onChange={setN2} color="var(--sky)" />
        <Slider label="payda" labelEn="denominator" value={d1} min={1} max={12} step={1} onChange={setD1} color="var(--gold)" />
        <Slider label="payda" labelEn="denominator" value={d2} min={1} max={12} step={1} onChange={setD2} color="var(--sky)" />
      </div>
      <LiveTex tex={tex} />
      <Readout items={items} />
    </LabShell>
  );
}
