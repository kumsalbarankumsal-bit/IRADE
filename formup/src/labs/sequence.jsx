import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Readout, LiveTex, Choice, nf } from "./kit.jsx";

/* Dizi laboratuvarı: aritmetik (+d) ya da geometrik (×r) dizi.
   Üstte ilk n terimin sütunları (aritmetikte her sütun = u₁ tabanı + (k−1) tane d bloğu),
   altta "toplam doğrusu": 0’dan başlayıp her terim kadar zıplayarak Sₙ’ye varılır.
   Geometrikte |r| < 1 iken zıplamalar küçülür ve S∞ hedef çizgisine yaklaşır. */

const W = 340, H = 318;
const LM = 38, RM = 10;            // sütun alanı (yatay)
const TOP = 10, BOT = 184;         // sütun alanı (dikey, piksel)
const IDX_Y = 197;                 // terim numaraları
const BR_Y = 205;                  // köşeli parantez (adım sayısı)
const SUM_L = 290;                 // toplam doğrusu
const SX0 = 18, SX1 = 322;
const MINUS = "−";
const SUBS = "₀₁₂₃₄₅₆₇₈₉";

/* ---------- sayı yardımcıları ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const sub = (n) => String(n).replace(/\d/g, (d) => SUBS[d]);
const autoD = (v) => { const a = Math.abs(v); return a >= 1000 ? 0 : a >= 100 ? 1 : a >= 1 ? 2 : a >= 0.1 ? 3 : 4; };
const exactAt = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
const exact = (v) => exactAt(v, autoD(v));
/** "12345,5" → "12 345,5" (dar boşlukla), eksi işareti gerçek eksi */
function group(s) {
  const neg = s.startsWith("-");
  const [i, f] = (neg ? s.slice(1) : s).split(",");
  const gi = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : i;
  return (neg ? MINUS : "") + gi + (f ? "," + f : "");
}
const num = (v, d = autoD(v)) => group(nf(v, d));                       // ekran metni
const tx = (v, d = autoD(v)) => num(v, d).replace(",", "{,}").replace(/\u202F/g, "\\,").replace(MINUS, "-"); // TeX
const pT = (v, d) => (v < 0 ? `(${tx(v, d)})` : tx(v, d));             // negatifse parantez
const eqS = (v) => (exact(v) ? "=" : "≈");
const eqT = (v) => (exact(v) ? "=" : "\\approx");
/** eksen/sütun etiketleri için kısa biçim */
const short = (v) => {
  const a = Math.abs(v);
  if (a >= 1e6) return num(v / 1e6, 1) + "M";
  if (a >= 1e4) return num(v / 1e3, a >= 1e5 ? 0 : 1) + "k";
  return num(v);
};
function niceStep(raw) {
  const p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

/** TeX satırının yaklaşık genişliği (birim ≈ bir rakam = 0,5em): kesirde pay/paydanın genişi, üsler küçük.
    LiveTex kutusu ≈ 300px / 15px yazı → ≈ 40 birim. */
const LIVE_MAX = 38;
function texW(t) {
  let w = 0, i = 0, prev = "start";
  const grab = () => {
    if (t[i] === "\\") { const m = /^\\([a-zA-Z]+|.?)/.exec(t.slice(i)); i += m[0].length; return m[0]; }
    if (t[i] !== "{") return t[i++] || "";
    let depth = 0, j = i;
    for (; j < t.length; j++) { if (t[j] === "{") depth++; else if (t[j] === "}" && --depth === 0) break; }
    const inner = t.slice(i + 1, j); i = j + 1; return inner;
  };
  while (i < t.length) {
    const c = t[i];
    if (c === "\\") {
      const m = /^\\([a-zA-Z]+|.?)/.exec(t.slice(i)); i += Math.max(1, m[0].length);
      const cmd = m[1];
      if (/^[dt]?frac$/.test(cmd)) { const a = grab(), b = grab(); w += Math.max(texW(a), texW(b)) * (cmd === "tfrac" ? 0.72 : 1) + 0.6; prev = "x"; }
      else if (cmd === "cdot") { w += 1.45; prev = "op"; }
      else if (cmd === "approx") { w += 2.7; prev = "op"; }
      else if (cmd === "infty") { w += 2; prev = "x"; }
      else if (cmd === "quad") w += 2;
      else if (cmd === ",") w += 0.33;
      continue;
    }
    if (c === "^" || c === "_") { i++; w += texW(grab()) * 0.72; continue; }
    if ("{} &".includes(c)) { i++; if (c === "{") prev = prev === "op" ? "op" : prev; continue; }
    if (c === "=") { w += 2.67; prev = "op"; }
    else if (c === "+" || c === "-") { const unary = prev === "op" || prev === "(" || prev === "start"; w += unary ? 1.56 : 2.44; prev = "op"; }
    else if (c === "(" || c === ")") { w += 0.78; prev = c === "(" ? "(" : "x"; }
    else if (c === ",") { w += 0.56; prev = "x"; }
    else if (/[a-zA-Z]/.test(c)) { w += 1.15; prev = "x"; }
    else { w += 1; prev = "x"; }
    i++;
  }
  return w;
}

/* ---------- çakışmasız etiket yerleşimi ---------- */
function place(items, obstacles, box = { x0: 3, y0: 3, x1: W - 3, y1: H - 3 }) {
  const placed = obstacles.slice(), out = [];
  const hit = (r) => placed.some((p) => r.x0 < p.x1 + 1.5 && r.x1 > p.x0 - 1.5 && r.y0 < p.y1 + 1 && r.y1 > p.y0 - 1);
  for (const it of items) {
    let pick = null, first = null;
    for (const [ax, ay] of it.at) {
      const x = clamp(ax, box.x0 + it.w / 2, box.x1 - it.w / 2), y = clamp(ay, box.y0 + it.h / 2, box.y1 - it.h / 2);
      const r = { x0: x - it.w / 2, y0: y - it.h / 2, x1: x + it.w / 2, y1: y + it.h / 2 };
      if (!hit(r)) { pick = { x, y, r }; break; }
      if (!first) first = { x, y, r };
    }
    const got = pick || (it.must ? first : null);
    if (got) { placed.push(got.r); out.push({ ...it, ...got }); }
  }
  return out;
}
const U = (s) => s.toLocaleUpperCase("tr");   // çip etiketleri: doğru Türkçe büyük harf (İ)
const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3, strokeLinejoin: "round" };

function Pill({ x, y, w, h, color, children }) {
  return (
    <g pointerEvents="none">
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill="var(--plot-bg)" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={color} fillOpacity="0.14" stroke={color} strokeWidth="1.4" />
      <text x={x} y={y + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill={color}>{children}</text>
    </g>
  );
}

function Bi({ tr, en }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2, padding: "1px 4px" }}>
      <span>{tr}</span>
      <span className="en" style={{ fontSize: 11.5 }}>{en}</span>
    </span>
  );
}

/* ---------- sahne ---------- */
function Scene({ geo, u1, d, r, n, terms, S, Sinf }) {
  // --- sütun ölçeği
  let lo = Math.min(0, ...terms), hi = Math.max(0, ...terms);
  if (hi - lo < 1e-9) hi = lo + 1;
  const padT = hi > 0 ? 17 : 6, padB = lo < 0 ? 17 : 3;
  const yA = TOP + padT, yB = BOT - padB;
  const py = (v) => yB - ((v - lo) / (hi - lo)) * (yB - yA);
  const step = niceStep((hi - lo) / 4);
  const ticks = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) ticks.push(Math.round(v / step) * step);

  const slot = (W - LM - RM) / n, bw = Math.min(30, slot * 0.64);
  const cx = (k) => LM + slot * (k - 0.5);
  const role = (k) => (k === n ? "var(--coral)" : k === 1 ? "var(--gold)" : "var(--sky)");
  const y0 = py(0);

  // --- sütunlar + bloklar
  const bars = [], marks = [], obstacles = [];
  const blockPx = Math.abs(d) * (yB - yA) / (hi - lo);
  terms.forEach((u, i) => {
    const k = i + 1, x = cx(k) - bw / 2, top = py(Math.max(0, u)), bottom = py(Math.min(0, u));
    const h = Math.max(bottom - top, 1.5);
    const c = role(k);
    bars.push(<rect key={"b" + k} x={x} y={u >= 0 ? top : y0} width={bw} height={h} rx={Math.min(5, bw / 4)} fill={c} fillOpacity={k === n ? 0.62 : 0.42} stroke={c} strokeWidth="1.6" />);
    obstacles.push({ x0: x, y0: Math.min(top, y0), x1: x + bw, y1: Math.max(bottom, y0) });
    if (!geo && k >= 2 && d !== 0 && blockPx >= 4) {
      const ext0 = Math.min(0, u), ext1 = Math.max(0, u);
      // eksilen kısım (d < 0, pozitif başlangıç): kesikli hayalet
      if (d < 0 && u1 > 0 && u < u1) {
        const g0 = Math.max(u, 0);
        marks.push(<rect key={"g" + k} x={x} y={py(u1)} width={bw} height={py(g0) - py(u1)} rx="3" fill="var(--coral)" fillOpacity="0.08" stroke="var(--coral)" strokeWidth="1.2" strokeDasharray="3 2.5" />);
        obstacles.push({ x0: x, y0: py(u1), x1: x + bw, y1: py(g0) });
      }
      for (let j = 0; j < k; j++) {
        const L = u1 + j * d;
        const inBar = L > ext0 + 1e-9 && L < ext1 - 1e-9;
        const inGhost = d < 0 && u1 > 0 && L > Math.max(u, 0) + 1e-9 && L < u1 - 1e-9;
        if (j === 0 && inBar) marks.push(<line key={`m${k}-${j}`} x1={x + 1} x2={x + bw - 1} y1={py(L)} y2={py(L)} stroke="var(--gold)" strokeWidth="2.2" />);
        else if (j > 0 && (inBar || inGhost)) marks.push(<line key={`m${k}-${j}`} x1={x + 1} x2={x + bw - 1} y1={py(L)} y2={py(L)} stroke={inBar ? "var(--plot-bg)" : "var(--coral)"} strokeWidth={inBar ? 1.6 : 1} strokeDasharray={inBar ? undefined : "3 2.5"} opacity={inBar ? 0.95 : 0.7} />);
      }
    }
  });

  // --- sütun değer etiketleri (önce uₙ, sonra u₁, sonra sığanlar)
  const order = [n, ...(n > 1 ? [1] : []), ...Array.from({ length: Math.max(0, n - 2) }, (_, i) => i + 2)];
  const vItems = order.map((k) => {
    const u = terms[k - 1], special = k === n || k === 1;
    const text = short(u), fs = special ? 10.5 : 9;
    const w = text.length * (special ? 6.3 : 5.3) + 3, h = fs + 1;
    const top = py(Math.max(0, u)), bottom = py(Math.min(0, u));
    const at = u >= 0 ? [[cx(k), top - h / 2 - 3], [cx(k), top - h / 2 - 3 - h]] : [[cx(k), bottom + h / 2 + 3], [cx(k), bottom + h / 2 + 3 + h]];
    return { key: "v" + k, k, text, fs, w, h, at, must: special, color: k === n ? "var(--coral)" : k === 1 ? "var(--gold)" : "var(--ink-2)" };
  });
  const vLabels = place(vItems, obstacles, { x0: LM - 4, y0: TOP - 6, x1: W - 3, y1: BOT + 4 });

  // --- adım parantezi
  const stepTxt = geo ? `×${num(r)}` : `${d < 0 ? MINUS : "+"}${num(Math.abs(d))}`;
  const bx1 = cx(1), bxn = cx(n), bmid = clamp((bx1 + bxn) / 2, 120, W - 120);

  // --- toplam doğrusu ölçeği
  const vals = S.concat(Sinf != null ? [Sinf] : []);
  let slo = Math.min(0, ...vals), shi = Math.max(0, ...vals);
  if (shi - slo < 1e-9) { slo -= 1; shi += 1; }
  const spad = (shi - slo) * 0.06;
  const qx = (v) => SX0 + ((v - slo + spad) / (shi - slo + 2 * spad)) * (SX1 - SX0);
  const hops = [];
  for (let k = 1; k <= n; k++) {
    const x0 = qx(S[k - 1]), x1 = qx(S[k]), dx = Math.abs(x1 - x0);
    if (dx < 0.6) continue;
    const up = terms[k - 1] >= 0;
    const hgt = up ? Math.min(22, 3 + dx * 0.32) : Math.min(15, 3 + dx * 0.3);
    const cyy = SUM_L + (up ? -2 * hgt : 2 * hgt);
    hops.push(<path key={"h" + k} d={`M${x0.toFixed(1)},${SUM_L} Q${((x0 + x1) / 2).toFixed(1)},${cyy.toFixed(1)} ${x1.toFixed(1)},${SUM_L}`} fill="none" stroke={role(k)} strokeWidth={k === n ? 2.2 : 1.7} strokeLinecap="round" opacity="0.9" />);
    if (k < n) hops.push(<circle key={"hd" + k} cx={x1} cy={SUM_L} r="2.2" fill={role(k)} />);
  }
  const titleBox = { x0: SX0 - 2, y0: SUM_L - 63, x1: SX0 + 168, y1: SUM_L - 49 };
  const sTxt = `S${sub(n)} ${eqS(S[n])} ${num(S[n])}`;
  const sw = sTxt.length * 6.6 + 16, xS = qx(S[n]);
  const sItems = [
    { key: "sn", w: sw, h: 18, at: [[xS, SUM_L - 33], [xS + sw / 2 + 8, SUM_L - 33], [xS - sw / 2 - 8, SUM_L - 33], [xS, SUM_L + 23]], must: true },
  ];
  if (Sinf != null) {
    const t = `S∞ ${eqS(Sinf)} ${num(Sinf)}`;
    const iw = t.length * 6 + 6, xi = qx(Sinf);
    sItems.push({ key: "inf", text: t, w: iw, h: 12, at: [[xi, SUM_L + 23], [xi + iw / 2 + 6, SUM_L + 23], [xi - iw / 2 - 6, SUM_L + 23], [xi, SUM_L - 33], [xi + iw / 2 + 6, SUM_L - 33], [xi - iw / 2 - 6, SUM_L - 33]], must: true });
  }
  sItems.push({ key: "zero", w: 10, h: 11, at: [[qx(0), SUM_L + 14], [qx(0), SUM_L - 13]] });
  const sLabels = place(sItems, [titleBox, { x0: qx(S[n]) - 5, y0: SUM_L - 5, x1: qx(S[n]) + 5, y1: SUM_L + 5 }], { x0: 3, y0: SUM_L - 64, x1: W - 3, y1: H - 3 });
  const L = (k) => sLabels.find((s) => s.key === k);

  return (
    <g>
      {/* ızgara + eksen */}
      {ticks.map((v) => (
        <g key={"t" + v}>
          <line x1={LM - 3} x2={W - RM + 2} y1={py(v)} y2={py(v)} stroke={Math.abs(v) < 1e-9 ? "var(--ink-3)" : "var(--plot-grid)"} strokeWidth={Math.abs(v) < 1e-9 ? 1.4 : 1} />
          <text x={LM - 6} y={py(v) + 3.2} fontSize="9" fontWeight="600" textAnchor="end" fill="var(--ink-3)">{short(v)}</text>
        </g>
      ))}
      {!ticks.some((v) => Math.abs(v) < 1e-9) && <line x1={LM - 3} x2={W - RM + 2} y1={y0} y2={y0} stroke="var(--ink-3)" strokeWidth="1.4" />}
      {bars}
      {marks}
      {vLabels.map((l) => (
        <text key={l.key} x={l.x} y={l.y + l.fs * 0.36} fontSize={l.fs} fontWeight={l.k === n || l.k === 1 ? 800 : 600} textAnchor="middle" fill={l.color} style={halo}>{l.text}</text>
      ))}
      {/* terim numaraları */}
      <text x={LM - 6} y={IDX_Y} fontSize="9.5" fontStyle="italic" textAnchor="end" fill="var(--ink-3)" fontFamily="KaTeX_Math, serif">k</text>
      {terms.map((_, i) => {
        const k = i + 1, sp = k === 1 || k === n;
        return <text key={"i" + k} x={cx(k)} y={IDX_Y} fontSize={sp ? 10.5 : 9.5} fontWeight={sp ? 800 : 600} textAnchor="middle" fill={k === n ? "var(--coral)" : k === 1 ? "var(--gold)" : "var(--ink-3)"}>{k}</text>;
      })}
      {/* adım sayısı */}
      {n >= 2 ? (
        <g>
          <path d={`M${bx1},${BR_Y - 3} L${bx1},${BR_Y + 2} L${bxn},${BR_Y + 2} L${bxn},${BR_Y - 3}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.2" />
          <text x={bmid} y={BR_Y + 15} fontSize="10.5" fontWeight="700" textAnchor="middle" fill="var(--ink-2)">
            <tspan fill="var(--ink)">{n - 1} adım</tspan>, her adımda <tspan fill="var(--sky)" fontWeight="800">{stepTxt}</tspan>
            <tspan fill="var(--ink-3)" fontWeight="500"> · {n - 1} step{n - 1 === 1 ? "" : "s"} of {stepTxt}</tspan>
          </text>
        </g>
      ) : (
        <text x={W / 2} y={BR_Y + 15} fontSize="10.5" fontWeight="700" textAnchor="middle" fill="var(--ink-2)">tek terim, 0 adım<tspan fill="var(--ink-3)" fontWeight="500"> · one term, 0 steps</tspan></text>
      )}
      {/* toplam doğrusu */}
      <text x={SX0} y={SUM_L - 52} fontSize="10.5" fontWeight="800" fill="var(--mint)">Σ toplam<tspan fill="var(--ink-3)" fontWeight="500"> · running total</tspan></text>
      <line x1={SX0 - 4} x2={SX1 + 4} y1={SUM_L} y2={SUM_L} stroke="var(--ink-3)" strokeWidth="1.4" strokeLinecap="round" />
      {Sinf != null && <line x1={qx(Sinf)} x2={qx(Sinf)} y1={SUM_L - 28} y2={SUM_L + 14} stroke="var(--violet)" strokeWidth="2" strokeDasharray="4 3" />}
      {hops}
      <circle cx={qx(0)} cy={SUM_L} r="3.4" fill="var(--plot-bg)" stroke="var(--ink-2)" strokeWidth="1.8" />
      <circle cx={qx(S[n])} cy={SUM_L} r="4.8" fill="var(--mint)" stroke="var(--plot-bg)" strokeWidth="2" />
      {L("zero") && <text x={L("zero").x} y={L("zero").y + 3.5} fontSize="9.5" fontWeight="700" textAnchor="middle" fill="var(--ink-2)" style={halo}>0</text>}
      {L("inf") && <text x={L("inf").x} y={L("inf").y + 4} fontSize="10.5" fontWeight="800" textAnchor="middle" fill="var(--violet)" style={halo}>{L("inf").text}</text>}
      {L("sn") && <Pill x={L("sn").x} y={L("sn").y} w={L("sn").w} h={18} color="var(--mint)">{sTxt}</Pill>}
    </g>
  );
}

export default function SequenceLab({ card }) {
  const id = (card && card.id) || "";
  const startGeo = /geo|geom|ratio|inf/.test(id);
  const [mode, setMode] = useState(startGeo ? "geo" : "ari");
  const [u1, setU1] = useState(4);
  const [d, setD] = useState(3);
  const [r, setR] = useState(/inf/.test(id) ? 0.5 : 2);
  const [n, setN] = useState(10);
  const geo = mode === "geo";

  // geometrik dizide u₁ ≠ 0 ve r ≠ 0 (kaydırıcı 0’ı atlar)
  const onMode = (m) => { setMode(m); if (m === "geo" && u1 === 0) setU1(1); };
  const onU1 = (v) => setU1((p) => (geo && v === 0 ? (p > 0 ? -1 : 1) : v));
  const onR = (v) => setR((p) => (Math.abs(v) < 1e-9 ? (p > 0 ? -0.1 : 0.1) : Math.round(v * 100) / 100));

  const { terms, S, Sinf } = useMemo(() => {
    const t = [];
    for (let k = 1; k <= n; k++) t.push(geo ? u1 * r ** (k - 1) : u1 + (k - 1) * d);
    const s = [0];
    t.forEach((v) => s.push(s[s.length - 1] + v));
    return { terms: t, S: s, Sinf: geo && Math.abs(r) < 1 ? u1 / (1 - r) : null };
  }, [geo, u1, d, r, n]);
  const un = terms[n - 1], Sn = S[n];

  /* ---------- canlı formül (uzun satırlar ikiye bölünür) ---------- */
  const row = (lhs, gen, sub) => (texW(`${lhs}=${gen}=${sub}`) <= LIVE_MAX ? `${lhs} &= ${gen} = ${sub}` : `${lhs} &= ${gen} \\\\ &= ${sub}`);
  const rows = [];
  if (!geo) {
    rows.push(row(`u_{${n}}`, `u_1+(n-1)\\,d`, `${tx(u1)}+(${n}-1)\\cdot ${pT(d)} ${eqT(un)} ${tx(un)}`));
    rows.push(row(`S_{${n}}`, `\\tfrac{n}{2}\\,(u_1+u_n)`, `\\tfrac{${n}}{2}\\,(${tx(u1)}+${pT(un)}) ${eqT(Sn)} ${tx(Sn)}`));
  } else {
    const rT = pT(r);
    rows.push(row(`u_{${n}}`, `u_1\\,r^{\\,n-1}`, `${tx(u1)}\\cdot ${rT}^{${n - 1}} ${eqT(un)} ${tx(un)}`));
    if (r === 1) rows.push(row(`S_{${n}}`, `n\\,u_1`, `${n}\\cdot ${pT(u1)} = ${tx(Sn)}`));
    else if (r > 1) rows.push(row(`S_{${n}}`, `\\dfrac{u_1(r^n-1)}{r-1}`, `\\dfrac{${tx(u1)}(${rT}^{${n}}-1)}{${tx(r)}-1} ${eqT(Sn)} ${tx(Sn)}`));
    else rows.push(row(`S_{${n}}`, `\\dfrac{u_1(1-r^n)}{1-r}`, `\\dfrac{${tx(u1)}(1-${rT}^{${n}})}{1-${rT}} ${eqT(Sn)} ${tx(Sn)}`));
    if (Sinf != null) rows.push(row(`S_\\infty`, `\\dfrac{u_1}{1-r}`, `\\dfrac{${tx(u1)}}{1-${rT}} ${eqT(Sinf)} ${tx(Sinf)}`));
  }
  const live = `\\begin{aligned} ${rows.join(" \\\\[2pt] ")} \\end{aligned}`;

  /* ---------- okumalar ---------- */
  const items = [
    { label: U(`${n}. terim`), labelEn: "nth term", tex: `u_{${n}} ${eqT(un)} ${tx(un)}`, color: "var(--coral)" },
    { label: U("Toplam"), labelEn: `sum of ${n} terms`, tex: `S_{${n}} ${eqT(Sn)} ${tx(Sn)}`, color: "var(--mint)" },
  ];
  if (geo) {
    items.push(Sinf != null
      ? { label: U("Sonsuz toplam"), labelEn: "sum to infinity", tex: `S_\\infty ${eqT(Sinf)} ${tx(Sinf)}`, color: "var(--violet)" }
      : { label: U("Sonsuz toplam"), labelEn: "sum to infinity", value: <>yok <span className="en">· none, |r| ≥ 1</span></>, color: "var(--violet)" });
  } else {
    items.push({ label: U("Sonraki terim"), labelEn: "next term", tex: `u_{${n + 1}} = ${tx(un + d)}`, color: "var(--sky)" });
  }

  /* ---------- ipucu ---------- */
  let hint, hintEn;
  if (!geo) {
    if (d > 0) {
      hint = `Her sütun bir öncekinden ${num(d)} fazla: altın çizgi u₁, üstündeki her blok bir d. ${n}. sütunda ${n - 1} blok var, çünkü ${n - 1} adım attın. d kaydırıcısını sola, eksiye çek: merdiven iner!`;
      hintEn = `Each bar is ${num(d).replace(",", ".")} more than the last: the gold line is u₁, every block on top is one d. Bar ${n} has ${n - 1} blocks because you took ${n - 1} steps. Drag d below zero: the staircase goes down!`;
    } else if (d < 0) {
      hint = `d eksi: her adımda ${num(-d)} eksiliyor (kesikli bloklar kaybolan kısım). Terimler eksiye geçince alttaki zıplamalar geri döner, toplam küçülmeye başlar. n’yi büyüt ve izle.`;
      hintEn = `d is negative: each step loses ${num(-d).replace(",", ".")} (dashed blocks are what is lost). Once terms turn negative the hops below turn back and the total shrinks. Increase n and watch.`;
    } else {
      hint = "d = 0: bütün terimler aynı (sabit dizi), toplam Sₙ = n · u₁. d kaydırıcısını sağa çek: merdiven çıkmaya başlar.";
      hintEn = "d = 0: every term is the same (a constant sequence), so Sₙ = n · u₁. Drag d to the right and the staircase starts to climb.";
    }
  } else if (r === 1) {
    hint = "r = 1: hep aynı sayı. Formüldeki r − 1 sıfır olur, o yüzden Sₙ = n · u₁ yazılır. r’yi 0,5’e çek: S∞ belirsin.";
    hintEn = "r = 1: the same number every time. r − 1 would be zero in the formula, so Sₙ = n · u₁. Drag r to 0.5 and S∞ appears.";
  } else if (r > 1) {
    hint = `Her adımda ×${num(r)}: sütunlar patlıyor, toplam durmadan büyüyor. r kaydırıcısını 0 ile 1 arasına çek (ör. 0,5): terimler küçülür, toplam mor hedefe (S∞) yaklaşır.`;
    hintEn = `Each step is ×${num(r).replace(",", ".")}: the bars explode and the total keeps growing. Drag r between 0 and 1 (e.g. 0.5): the terms shrink and the total closes in on the purple target (S∞).`;
  } else if (r > 0) {
    hint = `|r| < 1: her terim bir öncekinin ${num(r)} katı, yani küçülüyor. Zıplamalar kısalıyor ve toplam S∞ = ${num(Sinf)} çizgisine yaklaşıyor ama onu hiç geçmiyor. n’yi 15’e çek!`;
    hintEn = `|r| < 1: each term is ${num(r).replace(",", ".")} times the last, so it shrinks. The hops get shorter and the total creeps up to S∞ = ${num(Sinf).replace(",", ".")} but never passes it. Drag n to 15!`;
  } else if (r > -1) {
    hint = "r eksi: işaretler + − + − diye sırayla değişiyor (sütunlar bir yukarı bir aşağı). Toplam S∞ hedefinin iki yanına zıplayarak ona yaklaşıyor.";
    hintEn = "r is negative: the signs alternate + − + − (bars flip up and down). The total hops from side to side of the S∞ target, closing in on it.";
  } else {
    hint = "|r| ≥ 1 ve r eksi: terimler hem işaret değiştiriyor hem büyüyor; toplam hiçbir yere yerleşmiyor, S∞ yok. r’yi −0,5’e çek ve farkı gör.";
    hintEn = "|r| ≥ 1 and r negative: the terms flip sign and grow, so the total never settles: no S∞. Drag r to −0.5 and see the difference.";
  }

  const opts = [
    { value: "ari", label: <Bi tr="Aritmetik (+d)" en="arithmetic" /> },
    { value: "geo", label: <Bi tr="Geometrik (×r)" en="geometric" /> },
  ];
  const aria = `${geo ? "Geometrik dizi · geometric sequence" : "Aritmetik dizi · arithmetic sequence"}: ${terms.slice(0, 6).map((v) => num(v)).join(", ")}${n > 6 ? ", …" : ""}; u${sub(n)} = ${num(un)}, S${sub(n)} = ${num(Sn)}${Sinf != null ? `, S∞ = ${num(Sinf)}` : ""}`;

  return (
    <LabShell title="Diziler: terimler ve toplam" titleEn="Sequences: terms and sums" hint={hint} hintEn={hintEn}>
      <Choice options={opts} value={mode} onChange={onMode} />
      <Plot width={W} height={H} grid={false} axes={false} label={aria}>
        <Scene geo={geo} u1={u1} d={d} r={r} n={n} terms={terms} S={S} Sinf={Sinf} />
      </Plot>
      <Slider tex="u_1" label="ilk terim" labelEn="first term" value={u1} min={-10} max={20} step={1} onChange={onU1} fmt={(v) => num(v)} color="var(--gold)" />
      {geo
        ? <Slider tex="r" label="ortak oran" labelEn="common ratio" value={r} min={-2} max={2} step={0.05} onChange={onR} fmt={(v) => "×" + num(v)} color="var(--sky)" />
        : <Slider tex="d" label="ortak fark" labelEn="common difference" value={d} min={-5} max={5} step={0.5} onChange={setD} fmt={(v) => (v > 0 ? "+" : "") + num(v)} color="var(--sky)" />}
      <Slider tex="n" label="terim sayısı" labelEn="number of terms" value={n} min={1} max={15} step={1} onChange={setN} fmt={(v) => String(v)} color="var(--coral)" />
      <LiveTex tex={live} />
      <Readout items={items} />
    </LabShell>
  );
}
