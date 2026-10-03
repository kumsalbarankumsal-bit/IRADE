import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Readout, LiveTex, Choice, usePlot, nf, tn } from "./kit.jsx";

/* Dik üçgende trigonometri — SOH-CAH-TOA.
   θ ve hipotenüs kaydırıcıları; seçilen oranın iki kenarı parlar, diğer kenar soluklaşır.
   Ölçek SABİT: hipotenüs büyüyünce üçgen büyür ama sin, cos, tan aynı kalır (benzer üçgenler).
   Alttaki "oran çubuğu": pay kenarı, payda kenarının kaç katı? (ör. karşı = 0,5 × hipotenüs) */

const W = 340, H = 250, PAD = 6, S = 19;      // S: birim başına piksel
const BASE = H - PAD - 36;                      // taban çizgisinin piksel y’si (altında komşu etiketi)
const DEG = Math.PI / 180;
const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3.2, strokeLinejoin: "round" };
/* KaTeX içinde tema rengi: \htmlClass{tx-coral}{...} */
const TEX_CSS = ".lab .tx-coral{color:var(--coral)}.lab .tx-sky{color:var(--sky)}.lab .tx-violet{color:var(--violet)}.lab .tx-mint{color:var(--mint)}";
const tc = (c, t) => `\\htmlClass{tx-${c}}{${t}}`;

const SIDES = {
  opp: { tr: "karşı", en: "opposite", color: "var(--coral)", tx: "coral" },
  adj: { tr: "komşu", en: "adjacent", color: "var(--sky)", tx: "sky" },
  hyp: { tr: "hipotenüs", en: "hypotenuse", color: "var(--violet)", tx: "violet" },
};
const RATIOS = {
  sin: { mn: "SOH", num: "opp", den: "hyp", tr: "Sinüs", en: "sine", chip: "var(--coral)" },
  cos: { mn: "CAH", num: "adj", den: "hyp", tr: "Kosinüs", en: "cosine", chip: "var(--sky)" },
  tan: { mn: "TOA", num: "opp", den: "adj", tr: "Tanjant", en: "tangent", chip: "var(--gold)" },
};
const EXACT = {
  30: { sin: "\\tfrac{1}{2}", cos: "\\tfrac{\\sqrt{3}}{2}", tan: "\\tfrac{\\sqrt{3}}{3}" },
  45: { sin: "\\tfrac{\\sqrt{2}}{2}", cos: "\\tfrac{\\sqrt{2}}{2}", tan: "1" },
  60: { sin: "\\tfrac{\\sqrt{3}}{2}", cos: "\\tfrac{1}{2}", tan: "\\sqrt{3}" },
};
/* Etiket genişlik tahminleri (px) — sabit tutulur ki şekil kaydırırken titremesin */
const LW = { hyp: 94, opp: 82, adjHalf: 46 };
const isRound = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-6;

/** Geometri + yatay yerleşim (piksel). A = θ köşesi, B = dik açı, C = tepe */
function layout(th, h) {
  const t = th * DEG;
  const hp = h * S, adjPx = hp * Math.cos(t), oppPx = hp * Math.sin(t);
  // θ etiketi açının içine sığıyor mu? (gerekirse yayı büyüt)
  const need = 7 / Math.sin(t / 2);
  let ar = Math.max(13, Math.min(30, hp * 0.22, adjPx * 0.8));
  let rho = Math.max(ar + 9, need);
  const inside = rho <= adjPx * 0.72 && rho * Math.cos(t / 2) + 6 <= adjPx;
  if (inside) ar = Math.max(ar, rho - 9);
  const left = Math.max(LW.hyp - (adjPx / 2 - 10 * Math.sin(t)), LW.adjHalf - adjPx / 2, inside ? 0 : 18, 0) + 4;
  const right = Math.max(adjPx + 9 + LW.opp, adjPx / 2 + LW.adjHalf) + 4;
  const ax = PAD + (W - 2 * PAD - left - right) / 2 + left;
  return { t, hp, adjPx, oppPx, ar, rho, inside, ax };
}

/** İki satırlık kenar etiketi: "karşı = 3" + "opposite" */
function SideTag({ x, y, anchor, side, value, dim }) {
  const s = SIDES[side];
  return (
    <g opacity={dim ? 0.5 : 1}>
      <text x={x} y={y} fontSize="12" fontWeight="800" textAnchor={anchor} fill={s.color} style={halo}>{s.tr} = {nf(value, 2)}</text>
      <text x={x} y={y + 12.5} fontSize="10" fontWeight="600" textAnchor={anchor} fill="var(--ink-2)" style={halo}>{s.en}</text>
    </g>
  );
}

function Triangle({ th, h, ratio, L }) {
  const { sx, sy } = usePlot();
  const { t, adjPx, oppPx, ar, rho, inside } = L;
  const adj = h * Math.cos(t), opp = h * Math.sin(t);
  const A = [sx(0), sy(0)], B = [sx(adj), sy(0)], C = [sx(adj), sy(opp)];
  const R = RATIOS[ratio];
  const on = (k) => R.num === k || R.den === k;
  const side = (k, p, q) => (
    <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={SIDES[k].color} strokeWidth={on(k) ? 5 : 2.4}
      strokeLinecap="round" opacity={on(k) ? 1 : 0.45} />
  );
  // dik açı işareti
  const m = Math.max(0, Math.min(11, adjPx * 0.35, oppPx * 0.35));
  // θ yayı ve dilimi
  const e = [A[0] + ar * Math.cos(t), A[1] - ar * Math.sin(t)];
  const wedge = `M${A[0]},${A[1]} L${A[0] + ar},${A[1]} A${ar},${ar} 0 0 0 ${e[0].toFixed(1)},${e[1].toFixed(1)} Z`;
  const arc = `M${A[0] + ar},${A[1]} A${ar},${ar} 0 0 0 ${e[0].toFixed(1)},${e[1].toFixed(1)}`;
  const thPos = inside ? [A[0] + rho * Math.cos(t / 2), A[1] - rho * Math.sin(t / 2) + 4.5, "middle"] : [A[0] - 7, A[1] + 4.5, "end"];
  // etiket konumları
  const oppY = Math.max(PAD + 14, Math.min((B[1] + C[1]) / 2 - 2, B[1] - 16));
  const M = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
  const hx = M[0] - 10 * Math.sin(t), hy = M[1] - 10 * Math.cos(t);
  const special = EXACT[th];
  return (
    <g>
      <polygon points={`${A} ${B} ${C}`} fill="var(--ink-3)" fillOpacity="0.1" />
      <path d={wedge} fill="var(--mint)" fillOpacity="0.2" />
      <path d={arc} fill="none" stroke="var(--mint)" strokeWidth="2.2" />
      {/* soluk kenar önce, parlayanlar üstte */}
      {["adj", "opp", "hyp"].filter((k) => !on(k)).map((k) => <g key={k}>{side(k, k === "adj" ? A : k === "opp" ? B : A, k === "adj" ? B : C)}</g>)}
      {["adj", "opp", "hyp"].filter(on).map((k) => <g key={k}>{side(k, k === "adj" ? A : k === "opp" ? B : A, k === "adj" ? B : C)}</g>)}
      {m > 2 && <path d={`M${B[0] - m},${B[1]} L${B[0] - m},${B[1] - m} L${B[0]},${B[1] - m}`} fill="none" stroke="var(--ink)" strokeWidth="1.6" />}
      {[A, B, C].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--ink)" />)}
      <text x={thPos[0]} y={thPos[1]} fontSize="13.5" fontWeight="800" fontStyle="italic" textAnchor={thPos[2]} fill="var(--mint)" style={halo}>θ</text>
      {/* kenar etiketleri */}
      <SideTag x={(A[0] + B[0]) / 2} y={BASE + 16} anchor="middle" side="adj" value={adj} dim={!on("adj")} />
      <SideTag x={C[0] + 9} y={oppY} anchor="start" side="opp" value={opp} dim={!on("opp")} />
      <SideTag x={hx} y={hy - 16} anchor="end" side="hyp" value={h} dim={!on("hyp")} />
      {special && (
        <g>
          <rect x={W - PAD - 118} y={PAD + 6} width="112" height="34" rx="10" fill="var(--mint)" fillOpacity="0.14" stroke="var(--mint)" strokeWidth="1.2" />
          <text x={W - PAD - 62} y={PAD + 20} fontSize="11.5" fontWeight="800" textAnchor="middle" fill="var(--mint)">★ Özel açı {th}°</text>
          <text x={W - PAD - 62} y={PAD + 33} fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--ink-2)">special angle</text>
        </g>
      )}
    </g>
  );
}

/** Oran çubuğu: pay kenarı üstte, payda kenarı altta; kesikli çizgi payın paydaya oranını cetvelde gösterir */
function RatioBars({ ratio, len, value }) {
  const R = RATIOS[ratio];
  const N = SIDES[R.num], D = SIDES[R.den];
  const n = len[R.num], d = len[R.den];
  const X0 = 98, X1 = 326, Lw = X1 - X0;
  const k = Lw / Math.max(n, d);
  const wn = n * k, wd = d * k;
  const Y1 = 8, Y2 = 46, BH = 22;
  const mx = X0 + wn;
  /* değer yazısı: çubuk yeterince uzunsa içeride, kesikli işaretten uzak tarafta; değilse çubuğun sağında */
  const row = (y, s, v, w, isDen) => {
    let x, anchor;
    if (w < 40) { x = X0 + w + 5; anchor = "start"; }
    else if (!isDen) { x = X0 + w / 2; anchor = "middle"; }
    else if (mx - X0 > w / 2) { x = X0 + 8; anchor = "start"; }
    else { x = X0 + w - 8; anchor = "end"; }
    if (isDen && w < 40 && Math.abs(mx - x) < 30) x = Math.max(x, mx + 6);
    return (
      <g>
        <text x="12" y={y + 10} fontSize="12" fontWeight="800" fill={s.color}>{s.tr}</text>
        <text x="12" y={y + 21.5} fontSize="10" fontWeight="600" fill="var(--ink-3)">{s.en}</text>
        <rect x={X0} y={y} width={Math.max(w, 1)} height={BH} rx="6" fill={s.color} fillOpacity="0.25" stroke={s.color} strokeWidth="1.6" />
        <text x={x} y={y + 15.5} fontSize="12" fontWeight="800" textAnchor={anchor} fill="var(--ink)" style={halo}>{nf(v, 2)}</text>
      </g>
    );
  };
  const ticks = [];
  if (wd >= 70) for (let i = 1; i < 10; i++) {
    const x = X0 + (wd * i) / 10, big = i === 5;
    ticks.push(<line key={i} x1={x} x2={x} y1={Y2 + BH} y2={Y2 + BH - (big ? 8 : 4.5)} stroke="var(--ink-2)" strokeWidth={big ? 1.6 : 1} />);
  }
  const px = Math.min(X1 - 24, Math.max(X0 + 24, mx));
  const label = nf(value, 2);
  const pw = 14 + label.length * 7.4;
  return (
    <svg className="lab-plot" viewBox="0 0 340 76" role="img"
      aria-label={`Oran çubuğu · ratio bar: ${N.tr} ${nf(n, 2)} ÷ ${D.tr} ${nf(d, 2)} = ${nf(value, 3)}`}>
      <rect x="0" y="0" width="340" height="76" rx="14" fill="var(--plot-bg)" />
      {row(Y1, N, n, wn, false)}
      {row(Y2, D, d, wd, true)}
      {ticks}
      <line x1={mx} x2={mx} y1={Y1 - 3} y2={Y2 + BH + 3} stroke="var(--mint)" strokeWidth="1.8" strokeDasharray="4 3" />
      <rect x={px - pw / 2} y={Y1 + BH + 1} width={pw} height="15" rx="7.5" fill="var(--plot-bg)" stroke="var(--mint)" strokeWidth="1.4" />
      <text x={px} y={Y1 + BH + 12.5} fontSize="11.5" fontWeight="800" textAnchor="middle" fill="var(--mint)">{label}</text>
    </svg>
  );
}

function hintFor(th, ratio) {
  if (th === 30) return ["30° özel açı: karşı kenar hipotenüsün tam yarısı → sin 30° = ½. Hipotenüsü değiştir: oran yine ½! Sonra 45°’ye bas.",
    "30° is a special angle: the opposite side is exactly half the hypotenuse → sin 30° = ½. Change the hypotenuse: still ½! Then tap 45°."];
  if (th === 45) return ["45°’de karşı = komşu (ikizkenar dik üçgen), bu yüzden tan 45° = 1. Şimdi 60°’ye bas.",
    "At 45° opposite = adjacent (an isosceles right triangle), so tan 45° = 1. Now tap 60°."];
  if (th === 60) return ["60°’de komşu kenar hipotenüsün yarısı → cos 60° = ½ = sin 30°. Kural: sin θ = cos(90° − θ).",
    "At 60° the adjacent side is half the hypotenuse → cos 60° = ½ = sin 30°. Rule: sin θ = cos(90° − θ)."];
  if (th >= 75) return ["θ büyüdükçe karşı kenar uzar: sin → 1, cos → 0, tan çok büyür. Açı kaydırıcısını sola çek ve tersini izle.",
    "As θ grows the opposite side grows: sin → 1, cos → 0 and tan gets huge. Drag the angle slider left and watch it reverse."];
  if (th <= 15) return ["θ çok küçük: karşı kenar neredeyse yok → sin ≈ 0, cos ≈ 1. Açı kaydırıcısını sağa çek.",
    "θ is tiny: the opposite side almost vanishes → sin ≈ 0, cos ≈ 1. Drag the angle slider right."];
  const g = {
    sin: ["SOH: Sinüs = Karşı ÷ Hipotenüs. Hipotenüs kaydırıcısını oynat: üçgen büyür ama sin θ hiç değişmez — oran yalnızca açıya bağlı!",
      "SOH: Sine = Opposite ÷ Hypotenuse. Move the hypotenuse slider: the triangle grows but sin θ never changes — the ratio depends only on the angle!"],
    cos: ["CAH: Kosinüs = Komşu ÷ Hipotenüs. Açıyı büyüt: komşu kenar kısalır, cos θ küçülür.",
      "CAH: Cosine = Adjacent ÷ Hypotenuse. Increase the angle: the adjacent side shrinks, so cos θ gets smaller."],
    tan: ["TOA: Tanjant = Karşı ÷ Komşu. 45°’den büyük açılarda karşı kenar komşudan uzun olur, tan θ 1’i geçer — dene!",
      "TOA: Tangent = Opposite ÷ Adjacent. Past 45° the opposite side is longer than the adjacent, so tan θ goes above 1 — try it!"],
  };
  return g[ratio];
}

export default function TrigTriangleLab() {
  const [th, setTh] = useState(30);
  const [h, setH] = useState(8);
  const [ratio, setRatio] = useState("sin");

  const L = useMemo(() => layout(th, h), [th, h]);
  const { t, ax } = L;
  const opp = h * Math.sin(t), adj = h * Math.cos(t);
  const len = { opp, adj, hyp: h };
  const val = { sin: Math.sin(t), cos: Math.cos(t), tan: Math.tan(t) };
  const R = RATIOS[ratio];
  const N = SIDES[R.num], D = SIDES[R.den];

  const xMin = -(ax - PAD) / S, yMin = -(H - PAD - BASE) / S;
  const plot = { xMin, xMax: xMin + (W - 2 * PAD) / S, yMin, yMax: yMin + (H - 2 * PAD) / S };

  /* Canlı formül (son satır: sin²θ + cos²θ = 1 özdeşliği) */
  const s2 = val.sin ** 2, c2 = val.cos ** 2;
  const ex = EXACT[th];
  const nN = len[R.num], nD = len[R.den], v = val[ratio];
  const sidesExact = isRound(nN, 2) && isRound(nD, 2);
  const frac = `\\dfrac{${tc(N.tx, tn(nN, 2))}}{${tc(D.tx, tn(nD, 2))}}`;
  const dec = `${isRound(v, 3) ? "=" : "\\approx"} ${tn(v, 3)}`;
  const rhs = sidesExact
    ? `= ${frac}${ex ? ` = ${ex[ratio]}` : ""} ${dec}`
    : `${ex ? `= ${ex[ratio]} ` : ""}\\approx ${frac} ${dec}`;
  const words = (k) => `\\text{${SIDES[k].tr}}`;
  const live = `\\begin{array}{l}\\${ratio}\\theta = \\dfrac{${tc(N.tx, words(R.num))}}{${tc(D.tx, words(R.den))}} = \\dfrac{${tc(N.tx, `\\text{${N.en}}`)}}{${tc(D.tx, `\\text{${D.en}}`)}}\\\\[6pt] \\${ratio}\\,${th}^\\circ ${rhs}\\\\[6pt] \\sin^2\\theta+\\cos^2\\theta = ${tn(s2, 2)}+${tn(c2, 2)} = 1\\end{array}`;

  const chipTex = (f) => {
    const x = val[f], e = EXACT[th];
    return e && e[f] !== "1" ? `${e[f]} ${isRound(x, 3) ? "=" : "\\approx"} ${tn(x, 3)}` : `${isRound(x, 3) ? "" : "\\approx "}${tn(x, 3)}`;
  };
  const [hint, hintEn] = hintFor(th, ratio);

  return (
    <LabShell title="Dik üçgende trigonometri" titleEn="Right-angled triangle trigonometry" hint={hint} hintEn={hintEn}>
      <style>{TEX_CSS}</style>
      <Plot {...plot} width={W} height={H} grid axes={false} xStep={1} yStep={1}
        label={`Dik üçgen · right triangle: θ = ${th}°, karşı/opposite ${nf(opp)}, komşu/adjacent ${nf(adj)}, hipotenüs/hypotenuse ${nf(h)}`}>
        <Triangle th={th} h={h} ratio={ratio} L={L} />
      </Plot>
      <Choice value={ratio} onChange={setRatio} options={Object.entries(RATIOS).map(([k, r]) => ({
        value: k,
        label: <span><b>{r.mn}</b> <span style={{ opacity: 0.8 }}>· {k}</span></span>,
      }))} />
      <RatioBars ratio={ratio} len={len} value={v} />
      <Slider tex="\theta" label="açı" labelEn="angle" value={th} min={5} max={85} step={1} onChange={setTh} fmt={(x) => `${x}°`} color="var(--mint)" />
      <Slider label="hipotenüs" labelEn="hypotenuse" value={h} min={2} max={10} step={0.5} onChange={setH} fmt={(x) => nf(x, 1)} color="var(--violet)" />
      <div className="lab-slider-top" style={{ marginBottom: -4 }}>
        <span className="lab-slider-name"><span>Özel açılar</span><span className="en">Special angles</span></span>
      </div>
      <Choice value={EXACT[th] ? th : null} onChange={setTh} options={[30, 45, 60].map((a) => ({ value: a, label: `${a}°` }))} />
      <LiveTex tex={live} />
      <Readout items={["sin", "cos", "tan"].map((f) => ({ label: RATIOS[f].tr, labelEn: RATIOS[f].en, tex: chipTex(f), color: RATIOS[f].chip }))} />
    </LabShell>
  );
}
