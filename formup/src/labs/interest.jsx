import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Area, Curve, Segment, Point, Readout, LiveTex, Choice, usePlot, nf } from "./kit.jsx";

/* Bileşik faiz laboratuvarı: FV = PV(1 + r/(100k))^{kn}.
   Grafikte para üç katmana ayrılır: PV (taban) + basit faiz (mavi şerit) + faizin faizi (yeşil şerit).
   Altın eğri bileşik faiz, mavi kesikli doğru basit faiz; n’den sonrası soluk "devam etseydi". */

const W = 340, H = 262;
const LEG_Y0 = 34;   // lejantın ilk satırı (piksel)
const MINUS = "−";
const KS = [
  { k: 1, tr: "yıllık", en: "annually" },
  { k: 2, tr: "6 aylık", en: "half-yearly" },
  { k: 4, tr: "3 aylık", en: "quarterly" },
  { k: 12, tr: "aylık", en: "monthly" },
];

/* ---------- sayı yardımcıları ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function group(s) {
  const neg = s.startsWith("-");
  const [i, f] = (neg ? s.slice(1) : s).split(",");
  const gi = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : i;
  return (neg ? MINUS : "") + gi + (f ? "," + f : "");
}
const num = (v, d = 2) => group(nf(v, d));
const en = (v, d = 2) => num(v, d).replace(",", ".").replace(/ /g, ",");      // İngilizce metin: 2,158.92
const tx = (v, d = 2) => num(v, d).replace(",", "{,}").replace(/ /g, "\\,").replace(MINUS, "-");
const exactAt = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
const eqT = (v, d = 2) => (exactAt(v, d) ? "=" : "\\approx");
const eqS = (v, d = 2) => (exactAt(v, d) ? "=" : "≈");
const U = (s) => s.toLocaleUpperCase("tr");
/** eksen etiketi: 12 000 · 1,5 M */
const axisNum = (v) => (Math.abs(v) >= 1e6 ? num(v / 1e6, 1) + " M" : num(v, 0));
function niceStep(raw) {
  const p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}
const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3, strokeLinejoin: "round" };

/* ---------- çakışmasız etiket yerleşimi ---------- */
function place(items, obstacles, box) {
  const placed = obstacles.slice(), out = [];
  const ov = (r) => placed.reduce((s, p) => s + Math.max(0, Math.min(r.x1, p.x1 + 2) - Math.max(r.x0, p.x0 - 2)) * Math.max(0, Math.min(r.y1, p.y1 + 1.5) - Math.max(r.y0, p.y0 - 1.5)), 0);
  for (const it of items) {
    let pick = null, best = null;
    for (const [ax, ay] of it.at) {
      const x = clamp(ax, box.x0 + it.w / 2, box.x1 - it.w / 2), y = clamp(ay, box.y0 + it.h / 2, box.y1 - it.h / 2);
      const r = { x0: x - it.w / 2, y0: y - it.h / 2, x1: x + it.w / 2, y1: y + it.h / 2 };
      const o = ov(r);
      if (o === 0) { pick = { x, y, r }; break; }
      if (!best || o < best.o) best = { x, y, r, o };
    }
    const got = pick || (it.must ? best : null);
    if (got) { placed.push(got.r); out.push({ ...it, ...got }); }
  }
  return out;
}

function Tag({ x, y, w, h, color, sub, text }) {
  return (
    <g pointerEvents="none">
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="8" fill="var(--plot-bg)" opacity="0.94" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="8" fill={color} fillOpacity="0.13" stroke={color} strokeWidth="1.4" />
      {sub && <text x={x} y={y - 4} fontSize="9" fontWeight="600" textAnchor="middle" fill="var(--ink-2)">{sub}</text>}
      <text x={x} y={sub ? y + 10 : y + 4} fontSize="11.5" fontWeight="800" textAnchor="middle" fill={color}>{text}</text>
    </g>
  );
}
const tagSize = (text, sub) => [Math.round(Math.max(text.length * 6.7 + 14, sub ? sub.length * 5.1 + 14 : 0)), sub ? 31 : 20];

function Bi({ tr, en: e }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
      <span>{tr}</span>
      <span className="en" style={{ fontSize: 11 }}>{e}</span>
    </span>
  );
}

/* ---------- sahne ---------- */
function Scene({ PV, r, k, n, X, yTop, fvC, fvS, T2 }) {
  const { sx, sy } = usePlot();
  const xs = X <= 5 ? 1 : X <= 10 ? 2 : 5;
  const ys = niceStep(yTop / 5);
  const xt = [], yt = [];
  for (let v = 0; v <= X + 1e-9; v += xs) xt.push(v);
  for (let v = 0; v <= yTop + 1e-9; v += ys) yt.push(v);
  const FC = fvC(n), FS = fvS(n);
  const px = sx(n), pyC = sy(FC), pyS = sy(FS);
  const x0 = sx(0), yb = sy(0);

  // lejant: yalnızca görünür şeritler (kalınlık ≥ 3px)
  const legend = [];
  if (r > 0 && pyS - pyC >= 3) legend.push(["var(--mint)", 0.55, "faizin faizi", "interest on interest"]);
  if (r > 0 && sy(PV) - pyS >= 3) legend.push(["var(--sky)", 0.35, "basit faiz", "simple interest"]);
  const items = [];
  const fvTxt = `FV ${eqS(FC)} ${num(FC)}`;
  {
    const [w, h] = tagSize(fvTxt, "bileşik · compound");
    const left = px > sx(X * 0.55);
    items.push({ key: "fv", sub: "bileşik · compound", text: fvTxt, color: "var(--gold)", w, h, must: true,
      at: left ? [[px - w / 2 - 10, pyC - 8], [px - w / 2 - 10, pyC - h - 4], [px, pyC - h / 2 - 12], [px - w / 2 - 10, pyC + h / 2 + 4], [px - w / 2 - 10, pyC + h + 8], [px - w / 2 - 10, pyC + 1.5 * h + 12]]
        : [[px + w / 2 + 10, pyC - 6], [px, pyC - h / 2 - 12], [px - w / 2 - 10, pyC - h / 2 - 8], [px + w / 2 + 10, pyC - h - 2], [px + w / 2 + 10, pyC + h / 2 + 6], [px + w / 2 + 10, pyC + h + 10]] });
  }
  if (r > 0) {
    const t = `${num(FS)}`, sub = "basit · simple";
    const [w, h] = tagSize(t, sub);
    const roomRight = px + w + 14 < W - 4;
    items.push({ key: "fs", sub, text: t, color: "var(--sky)", w, h, must: true,
      at: roomRight ? [[px + w / 2 + 9, pyS + h / 2 + 6], [px + w / 2 + 9, pyS + h + 10], [px - w / 2 - 10, pyS + h / 2 + 8]]
        : [[px - w / 2 - 10, pyS + h / 2 + 8], [px - w / 2 - 10, pyS + h + 12], [px - w / 2 - 10, sy(PV) + h / 2 + 6]] });
  }
  const obstacles = [
    { x0: px - 8, y0: pyC - 8, x1: px + 8, y1: pyC + 8 },
    { x0: px - 6, y0: pyS - 6, x1: px + 6, y1: pyS + 6 },
    { x0: x0 + 4, y0: sy(yTop) - 2, x1: x0 + 92, y1: sy(yTop) + 12 },   // y ekseni başlığı
    { x0: px - 1.5, y0: pyC, x1: px + 1.5, y1: yb },                      // n anındaki dikey çizgi
  ];
  const box = { x0: x0 + 2, y0: 4, x1: W - 4, y1: yb - 2 };
  const doubleIn = T2 != null && T2 <= X && 2 * PV <= yTop;
  if (doubleIn) items.push({ key: "dbl", text: "2·PV", w: 30, h: 11, at: [[x0 + 21, sy(2 * PV) - 8], [x0 + 21, sy(2 * PV) + 9], [sx(T2) - 22, sy(2 * PV) - 8], [sx(T2) + 22, sy(2 * PV) + 9]] });
  const pvW = (`PV = ${num(PV, 0)}`).length * 5.9 + 4;
  if (yb - sy(PV) >= 14) items.push({ key: "pv", w: pvW, h: 12, at: [[x0 + 6 + pvW / 2, (sy(PV) + yb) / 2], [x0 + 6 + pvW / 2, sy(PV) + 10], [sx(X) - pvW / 2 - 4, sy(PV) + 10], [sx(X) - pvW / 2 - 4, (sy(PV) + yb) / 2]] });
  const tags = place(items, obstacles, box);
  const dbl = tags.find((t) => t.key === "dbl"), pvL = tags.find((t) => t.key === "pv");
  // lejant: önce sol üst; etiketlere çarparsa PV tabanının sağ altı (yer varsa)
  const legH = 13 * legend.length + 1;
  const clash = (b) => tags.some((t) => b.x0 < t.r.x1 + 2 && b.x1 > t.r.x0 - 2 && b.y0 < t.r.y1 + 2 && b.y1 > t.r.y0 - 2);
  // sol taraftaki adaylar: eğrinin (lejantın sağ ucundaki değerin) üstünde kalmalı
  const tRight = ((x0 + 182 - sx(0)) / (sx(X) - sx(0))) * X;
  const curveTop = sy(Math.max(fvC(Math.min(tRight, X)), PV)) - 4;
  const cands = [];
  for (let y0 = LEG_Y0 - 7; y0 + legH <= curveTop; y0 += 15) cands.push({ x0: x0 + 4, y0, x1: x0 + 182, y1: y0 + legH });
  if (sy(PV) <= yb - 10 - legH) cands.push({ x0: sx(X) - 182, y0: yb - 6 - legH, x1: sx(X) - 4, y1: yb - 6 });
  const tl = { x0: x0 + 4, y0: LEG_Y0 - 7, x1: x0 + 182, y1: LEG_Y0 - 7 + legH };
  const legBox = cands.find((b) => !clash(b)) || tl;
  const legX = legBox.x0 + 3, legY = legBox.y0 + 7;



  return (
    <g>
      {/* ızgara */}
      {yt.map((v) => (
        <g key={"y" + v}>
          <line x1={x0} x2={sx(X)} y1={sy(v)} y2={sy(v)} stroke={v === 0 ? "var(--ink-3)" : "var(--plot-grid)"} strokeWidth={v === 0 ? 1.4 : 1} />
          <text x={x0 - 5} y={sy(v) + 3.2} fontSize="9" fontWeight="600" textAnchor="end" fill="var(--ink-3)">{axisNum(v)}</text>
        </g>
      ))}
      {xt.map((v) => (
        <g key={"x" + v}>
          {v > 0 && <line x1={sx(v)} x2={sx(v)} y1={sy(yTop)} y2={yb} stroke="var(--plot-grid)" strokeWidth="1" />}
          <text x={sx(v)} y={yb + 13} fontSize="9.5" fontWeight={v === n ? 800 : 600} textAnchor="middle" fill="var(--ink-3)">{v}</text>
        </g>
      ))}
      <line x1={x0} x2={x0} y1={sy(yTop)} y2={yb} stroke="var(--ink-3)" strokeWidth="1.4" />
      <text x={x0 + 6} y={sy(yTop) + 9} fontSize="10" fontWeight="700" fill="var(--ink-2)">değer<tspan fill="var(--ink-3)" fontWeight="500"> · value</tspan></text>
      <text x={sx(X)} y={yb + 25} fontSize="10" fontWeight="700" textAnchor="end" fill="var(--ink-2)">yıl<tspan fill="var(--ink-3)" fontWeight="500"> · years</tspan></text>

      {/* katmanlar: PV tabanı, basit faiz, faizin faizi */}
      <Area f={() => PV} from={0} to={n} color="var(--ink-3)" opacity={0.1} />
      {r > 0 && <Area f={fvS} g={() => PV} from={0} to={n} color="var(--sky)" opacity={0.2} />}
      {r > 0 && <Area f={fvC} g={fvS} from={0} to={n} color="var(--mint)" opacity={0.38} />}
      <Segment x1={0} y1={PV} x2={X} y2={PV} color="var(--ink-3)" width={1.2} dashed />

      {/* ikiye katlanma */}
      {doubleIn && (
        <g>
          <line x1={x0} x2={sx(T2)} y1={sy(2 * PV)} y2={sy(2 * PV)} stroke="var(--violet)" strokeWidth="1.2" strokeDasharray="2 3" />
          <line x1={sx(T2)} x2={sx(T2)} y1={sy(2 * PV)} y2={yb} stroke="var(--violet)" strokeWidth="1.2" strokeDasharray="2 3" />
          {dbl && <text x={dbl.x} y={dbl.y + 3.5} fontSize="9.5" fontWeight="800" textAnchor="middle" fill="var(--violet)" style={halo}>2·PV</text>}
        </g>
      )}

      {/* eğriler */}
      {r > 0 && <Curve f={fvS} from={0} to={X} color="var(--sky)" width={2} dashed />}
      <Curve f={fvC} from={n} to={X} color="var(--gold)" width={2} dashed opacity={0.45} />
      <Curve f={fvC} from={0} to={n} color="var(--gold)" width={7} opacity={0.18} />
      <Curve f={fvC} from={0} to={n} color="var(--gold)" width={3} />

      {/* n anındaki dikey çizgi ve noktalar */}
      <line x1={px} x2={px} y1={pyC} y2={yb} stroke="var(--ink-3)" strokeWidth="1.2" strokeDasharray="3 3" />
      {doubleIn && <circle cx={sx(T2)} cy={sy(2 * PV)} r="4" fill="var(--plot-bg)" stroke="var(--violet)" strokeWidth="2" />}
      {r > 0 && <circle cx={px} cy={pyS} r="4.5" fill="var(--plot-bg)" stroke="var(--sky)" strokeWidth="2.2" />}
      <Point x={n} y={FC} color="var(--gold)" r={6} />

      {/* lejant: şeritler */}
      {legend.map(([c, op, tr, e], j) => (
        <g key={"lg" + j}>
          <rect x={legX} y={legY - 5 + j * 13} width="14" height="9" rx="2.5" fill={c} fillOpacity={op} stroke={c} strokeWidth="1" />
          <text x={legX + 19} y={legY + 3 + j * 13} fontSize="9.5" fontWeight="800" fill={c} style={halo}>{tr}<tspan fontWeight="500" fill="var(--ink-3)"> · {e}</tspan></text>
        </g>
      ))}
      {pvL && <text x={pvL.x} y={pvL.y + 3.5} fontSize="9.5" fontWeight="800" textAnchor="middle" fill="var(--ink-2)" style={halo}>PV = {num(PV, 0)}</text>}
      {tags.filter((t) => t.key === "fv" || t.key === "fs").map((t) => <Tag key={t.key} {...t} />)}
    </g>
  );
}

export default function InterestLab() {
  const [PV, setPV] = useState(1000);
  const [r, setR] = useState(10);
  const [k, setK] = useState(1);
  const [n, setN] = useState(15);

  const m = useMemo(() => {
    const i = r / (100 * k);
    const fvC = (t) => PV * (1 + i) ** (k * t);
    const fvS = (t) => PV * (1 + (r * t) / 100);
    const X = n <= 5 ? 5 : n <= 10 ? 10 : n <= 20 ? 20 : 30;
    const yTop = (() => { const top = Math.max(fvC(X) * 1.06, 1.25 * PV); const s = niceStep(top / 5); return Math.ceil(top / s) * s; })();
    const T2 = r > 0 ? Math.log(2) / (k * Math.log(1 + i)) : null;
    return { i, fvC, fvS, X, yTop, T2, FV: fvC(n), FS: fvS(n) };
  }, [PV, r, k, n]);
  const { i, FV, FS, T2 } = m;
  const I = FV - PV, bonus = FV - FS;

  /* ---------- canlı formül ---------- */
  const kn = k * n;
  const iExact = exactAt(i, 6);
  const base = 1 + i;
  const baseTex = iExact ? `${tx(base, 6)}` : `(${tx(base, 5)}\\ldots)`;
  const live = `\\begin{aligned} FV &= PV\\left(1+\\frac{r}{100k}\\right)^{kn} \\\\ &= ${tx(PV, 0)}\\left(1+\\frac{${tx(r, 1)}}{100\\cdot ${k}}\\right)^{${k}\\cdot ${n}} \\\\ &${iExact ? "=" : "\\approx"} ${tx(PV, 0)}\\cdot ${baseTex}^{\\,${kn}} ${eqT(FV)} ${tx(FV)} \\\\ \\text{faiz} &= FV - PV ${eqT(I)} ${tx(I)} \\end{aligned}`;

  /* ---------- okumalar ---------- */
  const items = [
    { label: U("Gelecek değer"), labelEn: "future value", tex: `FV ${eqT(FV)} ${tx(FV)}`, color: "var(--gold)" },
    { label: U("Kazanılan faiz"), labelEn: "interest earned", tex: `${eqT(I) === "=" ? "" : "\\approx "}${tx(I)}`, color: "var(--ink-2)" },
    { label: U("Faizin faizi"), labelEn: "interest on interest", tex: `+${tx(bonus)}`, color: "var(--mint)" },
    T2 != null
      ? { label: U("İkiye katlanma"), labelEn: "doubling time (years)", value: `≈ ${num(T2, 1)} yıl`, color: "var(--violet)" }
      : { label: U("İkiye katlanma"), labelEn: "doubling time", value: <>asla <span className="en">· never</span></>, color: "var(--violet)" },
  ];

  /* ---------- ipucu ---------- */
  let hint, hintEn;
  if (r === 0) {
    hint = "r = 0: para hiç büyümüyor, iki çizgi de dümdüz. r kaydırıcısını sağa çek ve altın eğrinin kalkışını izle!";
    hintEn = "r = 0: the money never grows, both lines stay flat. Drag r to the right and watch the gold curve take off!";
  } else if (n <= 3) {
    hint = `Kısa sürede bileşik ve basit faiz neredeyse aynı: fark yalnızca ${num(bonus)}. n kaydırıcısını sağa çek: yeşil şerit (faizin faizi) hızla kalınlaşır!`;
    hintEn = `Over a short time compound and simple interest are almost equal: the gap is only ${en(bonus)}. Drag n to the right: the green band (interest on interest) grows fast!`;
  } else if (k < 12) {
    const gain = PV * (1 + r / 1200) ** (12 * n) - FV;
    hint = `Yeşil şerit = faizin faizi: kazandığın faiz de faiz kazanıyor (+${num(bonus)}). Faizi “aylık” eklenen seçeneğe geç: FV ${num(gain)} daha artar.${T2 ? ` Paran ≈ ${num(T2, 1)} yılda ikiye katlanıyor (72 kuralı: 72 ÷ ${num(r, 1)} ≈ ${num(72 / r, 1)}).` : ""}`;
    hintEn = `Green band = interest on interest: your interest earns interest too (+${en(bonus)}). Switch to “monthly”: FV grows by another ${en(gain)}.${T2 ? ` Your money doubles in ≈ ${en(T2, 1)} years (rule of 72: 72 ÷ ${en(r, 1)} ≈ ${en(72 / r, 1)}).` : ""}`;
  } else {
    hint = `Aylık bileşikte faiz yılda 12 kez eklenir; yeşil şerit bileşik faizi basit faizden ${num(bonus)} öne geçiriyor. r’yi iki katına çıkar: kazanç iki katından da fazla artar!`;
    hintEn = `Compounded monthly, interest is added 12 times a year; the green band puts compound ${en(bonus)} ahead of simple interest. Double r: the gain more than doubles!`;
  }

  const opts = KS.map((o) => ({ value: o.k, label: <Bi tr={o.tr} en={o.en} /> }));
  const aria = `Bileşik faiz · compound interest: PV = ${num(PV, 0)}, r = %${num(r, 1)}, k = ${k}, n = ${n}; FV ≈ ${num(FV)}, basit · simple ${num(FS)}`;

  return (
    <LabShell title="Bileşik faiz: paran büyüsün" titleEn="Compound interest" hint={hint} hintEn={hintEn}>
      <Plot xMin={-m.X * 0.165} xMax={m.X * 1.035} yMin={-m.yTop * 0.13} yMax={m.yTop * 1.03} width={W} height={H} grid={false} axes={false} label={aria}>
        <Scene PV={PV} r={r} k={k} n={n} X={m.X} yTop={m.yTop} fvC={m.fvC} fvS={m.fvS} T2={T2} />
      </Plot>
      <Slider tex="PV" label="başlangıç parası" labelEn="present value" value={PV} min={100} max={10000} step={100} onChange={setPV} fmt={(v) => num(v, 0)} color="var(--ink-3)" />
      <Slider tex="r" label="yıllık faiz oranı" labelEn="annual rate" value={r} min={0} max={20} step={0.5} onChange={setR} fmt={(v) => "%" + num(v, 1)} color="var(--mint)" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13.5, fontWeight: 500 }}>
          <span style={{ fontFamily: "KaTeX_Math, serif", fontStyle: "italic", marginRight: 6 }}>k</span>faiz yılda kaç kez eklenir? <span className="en" style={{ fontSize: 12 }}>times per year</span>
        </span>
        <Choice options={opts} value={k} onChange={setK} />
      </div>
      <Slider tex="n" label="süre (yıl)" labelEn="time (years)" value={n} min={1} max={30} step={1} onChange={setN} fmt={(v) => `${v} yıl`} color="var(--gold)" />
      <LiveTex tex={live} />
      <Readout items={items} />
    </LabShell>
  );
}
