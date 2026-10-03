import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Point, Readout, LiveTex, usePlot, nf, tn } from "./kit.jsx";

/* Birim çember: P = (cos θ, sin θ).
   Altın nokta sürüklenebilir (5°’lik adımlar). Referans üçgeni: yatay kenar = cos (gök mavisi), dikey kenar = sin (mercan);
   sin değeri y eksenine "gölge" olarak da düşer. Köşelerde ASTC: hangi bölgede hangi oran pozitif. */

const W = 340, H = 300, PAD = 6;
const YR = 1.34;
const S = (H - 2 * PAD) / (2 * YR);            // birim başına piksel (eşit ölçek)
const XR = (W - 2 * PAD) / (2 * S);
const DEG = Math.PI / 180;
const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3.2, strokeLinejoin: "round" };
const TEX_CSS = ".lab .tx-coral{color:var(--coral)}.lab .tx-sky{color:var(--sky)}.lab .tx-violet{color:var(--violet)}.lab .tx-mint{color:var(--mint)}";
const tc = (c, t) => `\\htmlClass{tx-${c}}{${t}}`;
const ROMAN = ["", "I", "II", "III", "IV"];

/* Referans açılar için kesin değerler: [sin, cos, tan] */
const REF = {
  0: ["0", "1", "0"],
  30: ["\\tfrac{1}{2}", "\\tfrac{\\sqrt{3}}{2}", "\\tfrac{\\sqrt{3}}{3}"],
  45: ["\\tfrac{\\sqrt{2}}{2}", "\\tfrac{\\sqrt{2}}{2}", "1"],
  60: ["\\tfrac{\\sqrt{3}}{2}", "\\tfrac{1}{2}", "\\sqrt{3}"],
  90: ["1", "0", null],
};
const sgn = (v) => (Math.abs(v) < 1e-9 ? 0 : Math.sign(v));
const clean = (v) => (Math.abs(v) < 1e-12 ? 0 : v);
const refAngle = (d) => { const m = d % 180; return m <= 90 ? m : 180 - m; };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** SVG metinleri için tipografik eksi işaretli sayı */
const nm = (v, d = 2) => nf(v, d).replace("-", "−");
const isRound = (v, k) => Math.abs(v * 10 ** k - Math.round(v * 10 ** k)) < 1e-6;

function exactOf(d) {
  const row = REF[refAngle(d)];
  if (!row) return null;
  const s = sgn(Math.sin(d * DEG)), c = sgn(Math.cos(d * DEG));
  const wrap = (mag, sg) => (mag === "0" ? "0" : sg < 0 ? "-" + mag : mag);
  return { sin: wrap(row[0], s), cos: wrap(row[1], c), tan: row[2] == null ? null : wrap(row[2], s * c) };
}
/** Radyan: π’nin katı (payda ≤ 12 ise) */
function piForm(d, frac = "\\tfrac") {
  if (d === 0) return "0";
  const g = gcd(d, 180), p = d / g, q = 180 / g;
  if (q > 12) return null;
  const num = p === 1 ? "\\pi" : `${p}\\pi`;
  return q === 1 ? num : `${frac}{${num}}{${q}}`;
}
const quadOf = (d) => (d % 90 === 0 ? 0 : Math.floor((d % 360) / 90) + 1);

/** Değer gösterimi: kesin = ondalık ya da ≈ ondalık */
function valTex(exact, v) {
  const dec = tn(v, 3);
  if (exact != null && exact.includes("\\")) return `${exact} ${isRound(v, 3) ? "=" : "\\approx"} ${dec}`;
  return `${isRound(v, 3) ? "" : "\\approx "}${dec}`;
}

/** Köşedeki ASTC etiketi */
function Corner({ x, y, anchor, letter, lines, on }) {
  const col = on ? "var(--mint)" : "var(--ink-3)";
  return (
    <g opacity={on ? 1 : 0.75}>
      <text x={x} y={y} fontSize={on ? 20 : 17} fontWeight="900" textAnchor={anchor} fill={col} style={halo}>{letter}</text>
      {lines.map((t, i) => (
        <text key={i} x={x} y={y + 13 + i * 11.5} fontSize="10.5" fontWeight={on ? 800 : 600} textAnchor={anchor} fill={on ? "var(--mint)" : "var(--ink-3)"} style={halo}>{t}</text>
      ))}
    </g>
  );
}

function Figure({ d, setD }) {
  const { sx, sy } = usePlot();
  const t = d * DEG;
  const c = clean(Math.cos(t)), s = clean(Math.sin(t));
  const O = [sx(0), sy(0)], R = S;
  const P = [sx(c), sy(s)], F = [sx(c), sy(0)], Y = [sx(0), sy(s)];
  const q = quadOf(d);

  // bölge çeyrek dairesi
  const qa0 = (q - 1) * 90 * DEG, qa1 = q * 90 * DEG;
  const quarter = q ? `M${O[0]},${O[1]} L${O[0] + R * Math.cos(qa0)},${O[1] - R * Math.sin(qa0)} A${R},${R} 0 0 0 ${O[0] + R * Math.cos(qa1)},${O[1] - R * Math.sin(qa1)} Z` : null;

  // açı yayı (saat yönünün tersi) + ok ucu
  const ra = 0.2 * S;
  let arcPath = null, arrow = null;
  if (d > 0) {
    const end = [O[0] + ra * Math.cos(t), O[1] - ra * Math.sin(t)];
    if (d >= 360) arcPath = `M${O[0] + ra},${O[1]} A${ra},${ra} 0 1 0 ${O[0] - ra},${O[1]} A${ra},${ra} 0 1 0 ${O[0] + ra},${O[1]}`;
    else arcPath = `M${O[0] + ra},${O[1]} A${ra},${ra} 0 ${d > 180 ? 1 : 0} 0 ${end[0].toFixed(2)},${end[1].toFixed(2)}`;
    if (d >= 20) {
      const tg = [-Math.sin(t), -Math.cos(t)];          // ekranda saat yönünün tersine teğet
      const nm = [Math.cos(t), -Math.sin(t)];
      const tip = [end[0] + tg[0] * 3.5, end[1] + tg[1] * 3.5];
      const b1 = [end[0] - tg[0] * 3.5 + nm[0] * 3.6, end[1] - tg[1] * 3.5 + nm[1] * 3.6];
      const b2 = [end[0] - tg[0] * 3.5 - nm[0] * 3.6, end[1] - tg[1] * 3.5 - nm[1] * 3.6];
      arrow = `M${tip[0]},${tip[1]} L${b1[0]},${b1[1]} L${b2[0]},${b2[1]} Z`;
    }
  }
  const half = t / 2, rl = 0.34 * S;
  const thLbl = d > 0 ? [O[0] + rl * Math.cos(half), O[1] - rl * Math.sin(half) + 4.5] : null;

  // değer etiketleri (kesişmesin diye karşı tarafa)
  // cos: x ekseninin P’ye göre öbür yanında; P dikeye yakınken (|cos| küçük) ve yay o tarafı doldururken gizlenir
  //      (üst yarıda açı yayıyla çakışmasın diye yayın dışına itilir)
  const cosHw = (`cos = ${nm(c)}`.length * 6.8) / 2;
  const cosX = s >= 0 ? (c * S) / 2 : Math.sign(c) * Math.max((Math.abs(c) * S) / 2, ra + 7 + cosHw);
  const cosLbl = Math.abs(c) >= 0.12 && !(s < 0 && Math.abs(c) < 0.3) ? { x: O[0] + cosX, y: O[1] + (s >= 0 ? 16 : -8) } : null;
  // sin: y ekseninin öbür yanında, P hizasında; P eksene çok yakınsa noktayla çakışmasın diye yarı yükseklikte
  const sinY = Math.abs(c) < 0.3 ? (O[1] + Y[1]) / 2 : Y[1];
  const sinLbl = Math.abs(s) >= 0.12 ? { x: O[0] + (c >= 0 ? -7 : 7), y: sinY + 4.5, anchor: c >= 0 ? "end" : "start" } : null;

  const onDrag = (x, y) => {
    if (Math.hypot(x, y) < 0.15) return;
    let a = Math.atan2(y, x) / DEG;
    if (a < 0) a += 360;
    let r = Math.round(a / 5) * 5;
    if (r >= 360) r = d > 180 ? 360 : 0;
    if (r !== d) setD(r);
  };

  return (
    <g>
      {quarter && <path d={quarter} fill="var(--mint)" fillOpacity="0.08" />}
      {/* eksenler */}
      <line x1={PAD + 4} x2={W - PAD - 4} y1={O[1]} y2={O[1]} stroke="var(--ink-3)" strokeWidth="1.3" />
      <line y1={PAD + 4} y2={H - PAD - 4} x1={O[0]} x2={O[0]} stroke="var(--ink-3)" strokeWidth="1.3" />
      <text x={W - PAD - 6} y={O[1] - 6} fontSize="12" textAnchor="end" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">x</text>
      <text x={O[0] + 7} y={PAD + 14} fontSize="12" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">y</text>
      <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke="var(--ink-3)" strokeWidth="1.8" />
      {[[1, 0, 5, 13, "start", "1"], [-1, 0, -5, 13, "end", "−1"], [0, 1, 6, -6, "start", "1"], [0, -1, 6, 14, "start", "−1"]].map(([x, y, dx, dy, an, tx], i) => (
        <text key={i} x={sx(x) + dx} y={sy(y) + dy} fontSize="10.5" fontWeight="700" textAnchor={an} fill="var(--ink-3)" style={halo}>{tx}</text>
      ))}
      {/* ASTC */}
      <Corner x={W - PAD - 8} y={PAD + 20} anchor="end" letter="A" lines={["hepsi +", "all +"]} on={q === 1} />
      <Corner x={PAD + 8} y={PAD + 20} anchor="start" letter="S" lines={["sin +"]} on={q === 2} />
      <Corner x={PAD + 8} y={H - PAD - 26} anchor="start" letter="T" lines={["tan +"]} on={q === 3} />
      <Corner x={W - PAD - 8} y={H - PAD - 26} anchor="end" letter="C" lines={["cos +"]} on={q === 4} />
      {/* referans üçgeni */}
      <polygon points={`${O} ${F} ${P}`} fill="var(--gold)" fillOpacity="0.13" />
      {/* sin gölgesi y ekseninde */}
      <line x1={P[0]} y1={P[1]} x2={Y[0]} y2={Y[1]} stroke="var(--coral)" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.8" />
      <line x1={O[0]} y1={O[1]} x2={Y[0]} y2={Y[1]} stroke="var(--coral)" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      {/* yarıçap, sonra cos ve sin kenarları (eksen açılarında kenar rengi görünsün) */}
      <line x1={O[0]} y1={O[1]} x2={P[0]} y2={P[1]} stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
      <line x1={O[0]} y1={O[1]} x2={F[0]} y2={F[1]} stroke="var(--sky)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1={F[0]} y1={F[1]} x2={P[0]} y2={P[1]} stroke="var(--coral)" strokeWidth="4.5" strokeLinecap="round" />
      {arcPath && <path d={arcPath} fill="none" stroke="var(--mint)" strokeWidth="2.2" />}
      {arrow && <path d={arrow} fill="var(--mint)" />}
      {thLbl && <text x={thLbl[0]} y={thLbl[1]} fontSize="13" fontWeight="800" fontStyle="italic" textAnchor="middle" fill="var(--mint)" style={halo}>θ</text>}
      {cosLbl && <text x={cosLbl.x} y={cosLbl.y} fontSize="12" fontWeight="800" textAnchor="middle" fill="var(--sky)" style={halo}>cos = {nm(c)}</text>}
      {sinLbl && <text x={sinLbl.x} y={sinLbl.y} fontSize="12" fontWeight="800" textAnchor={sinLbl.anchor} fill="var(--coral)" style={halo}>sin = {nm(s)}</text>}
      <circle cx={O[0]} cy={O[1]} r="2.6" fill="var(--ink)" />
      <Point x={c} y={s} color="var(--gold)" r={7} draggable onDrag={onDrag} />
    </g>
  );
}

function hintFor(d) {
  const q = quadOf(d);
  const H = {
    0: ["Altın noktayı sürükle ya da kaydırıcıyı sağa çek: nokta çemberde döner. Mavi gölge cos, kırmızı gölge sin.",
      "Drag the gold point or move the slider right: the point turns around the circle. Blue shadow = cos, red shadow = sin."],
    30: ["cos 30° = √3/2, sin 30° = ½. Şimdi kaydırıcıyı 150°’ye çek: sin aynı kalır, cos eksi olur!",
      "cos 30° = √3/2, sin 30° = ½. Now move to 150°: sin stays the same but cos turns negative!"],
    45: ["45°’de nokta tam köşegende: cos = sin = √2/2 ≈ 0,71, bu yüzden tan 45° = 1.",
      "At 45° the point sits on the diagonal: cos = sin = √2/2 ≈ 0.71, so tan 45° = 1."],
    90: ["90°: nokta en tepede (0; 1). cos 90° = 0 olduğundan tan 90° tanımsız — sıfıra bölünmez!",
      "90°: the point is at the top (0, 1). cos 90° = 0, so tan 90° is undefined — you can’t divide by zero!"],
    150: ["sin 150° = sin 30° = ½ ama cos eksi: II. bölgede yalnız sin pozitif (S). Şimdi 210°’ye git.",
      "sin 150° = sin 30° = ½ but cos is negative: in quadrant II only sin is positive (S). Now go to 210°."],
    180: ["180° = π: nokta (−1; 0). cos 180° = −1, sin 180° = 0.",
      "180° = π: the point is (−1, 0). cos 180° = −1, sin 180° = 0."],
    210: ["III. bölge: sin ve cos ikisi de eksi, tan = (−) ÷ (−) = artı (T). Şimdi 330°’ye git.",
      "Quadrant III: sin and cos are both negative, so tan = (−) ÷ (−) = positive (T). Now go to 330°."],
    270: ["270°: nokta en altta (0; −1). Yine cos = 0, yine tan tanımsız.",
      "270°: the point is at the bottom (0, −1). Again cos = 0, so tan is undefined again."],
    330: ["IV. bölge: yalnız cos pozitif (C). Sıra A-S-T-C: “All Students Take Calculus”.",
      "Quadrant IV: only cos is positive (C). The order is A-S-T-C: “All Students Take Calculus”."],
    360: ["360° = 2π: tam tur! Nokta başladığı yere döndü, değerler 0° ile aynı.",
      "360° = 2π: a full turn! The point is back where it started; the values match 0°."],
  };
  if (H[d]) return H[d];
  const Q = {
    1: ["I. bölge: x ve y ikisi de artı, yani sin, cos, tan hepsi pozitif (A). Kaydırıcıyı 90°’nin ötesine çek.",
      "Quadrant I: x and y are both positive, so sin, cos and tan are all positive (A). Drag past 90°."],
    2: ["II. bölge: nokta solda, cos (x) eksi; yukarıda, sin (y) artı. Yalnız sin pozitif (S).",
      "Quadrant II: the point is on the left, so cos (x) is negative; it is up, so sin (y) is positive. Only sin is positive (S)."],
    3: ["III. bölge: sol-alt köşe, x ve y eksi. İki eksi bölünce artı: yalnız tan pozitif (T).",
      "Quadrant III: bottom-left, x and y are negative. Negative ÷ negative is positive: only tan is positive (T)."],
    4: ["IV. bölge: sağ-alt, x artı y eksi. Yalnız cos pozitif (C).",
      "Quadrant IV: bottom-right, x positive and y negative. Only cos is positive (C)."],
  };
  return Q[q] || H[0];
}

export default function UnitCircleLab() {
  const [d, setD] = useState(30);
  const t = d * DEG;
  const c = clean(Math.cos(t)), s = clean(Math.sin(t));
  const tanDef = Math.abs(c) > 1e-9;
  const tv = tanDef ? s / c : NaN;
  const ex = useMemo(() => exactOf(d), [d]);
  const pf = piForm(d, "\\dfrac");
  const q = quadOf(d);

  const radLine = d === 0
    ? `\\theta = 0^\\circ = 0`
    : `\\theta = ${d}^\\circ\\cdot\\dfrac{\\pi}{180}${pf ? ` = ${pf}` : ""} \\approx ${tn(t, 2)}\\ \\text{rad}`;
  const pLine = `P = (${tc("sky", "\\cos\\theta")};\\ ${tc("coral", "\\sin\\theta")}) = (${tc("sky", tn(c, 2))};\\ ${tc("coral", tn(s, 2))})`;
  const tanLine = tanDef
    ? `${tc("violet", "\\tan\\theta")} = \\dfrac{${tc("coral", "\\sin\\theta")}}{${tc("sky", "\\cos\\theta")}} = \\dfrac{${tc("coral", tn(s, 2))}}{${tc("sky", tn(c, 2))}} ${isRound(tv, 2) ? "=" : "\\approx"} ${tn(tv, 2)}`
    : `${tc("violet", "\\tan\\theta")} = \\dfrac{${tc("coral", tn(s, 0))}}{${tc("sky", "0")}} \\Rightarrow \\text{tanımsız / undefined}`;
  const live = `\\begin{array}{l}${radLine}\\\\[6pt]${pLine}\\\\[6pt]${tanLine}\\end{array}`;

  const signOf = (v) => (Math.abs(v) < 1e-9 ? "0" : v > 0 ? "+" : "-");
  const signs = `\\begin{array}{ccc}\\sin&\\cos&\\tan\\\\ ${signOf(s)}&${signOf(c)}&${tanDef ? signOf(tv) : "\\varnothing"}\\end{array}`;
  const [hint, hintEn] = hintFor(d);

  return (
    <LabShell title="Birim çember" titleEn="The unit circle" hint={hint} hintEn={hintEn}>
      <style>{TEX_CSS}</style>
      <Plot xMin={-XR} xMax={XR} yMin={-YR} yMax={YR} width={W} height={H} grid={false} axes={false}
        label={`Birim çember · unit circle: θ = ${d}°, P = (${nm(c)}; ${nm(s)})`}>
        <Figure d={d} setD={setD} />
      </Plot>
      <Slider tex="\theta" label="açı" labelEn="angle" value={d} min={0} max={360} step={5} onChange={setD}
        fmt={(v) => `${v}°`} color="var(--mint)" />
      <LiveTex tex={live} />
      <Readout items={[
        { label: "Kosinüs (x)", labelEn: "cosine", tex: valTex(ex && ex.cos, c), color: "var(--sky)" },
        { label: "Sinüs (y)", labelEn: "sine", tex: valTex(ex && ex.sin, s), color: "var(--coral)" },
        { label: "Tanjant", labelEn: "tangent", tex: tanDef ? valTex(ex && ex.tan, tv) : "\\begin{array}{l}\\text{tanımsız}\\\\[-3pt]{\\footnotesize\\text{undefined}}\\end{array}", color: "var(--violet)" },
        { label: q ? `${ROMAN[q]}. bölge` : "Eksen üzerinde", labelEn: q ? "quadrant" : "on an axis", tex: signs, color: "var(--mint)" },
      ]} />
    </LabShell>
  );
}
