import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Polygon, Label, Readout, LiveTex, Choice, usePlot, nf, tn } from "./kit.jsx";

/* Pisagor laboratuvarı: dik üçgenin her kenarına kare. Birim kareleri sayınca a² + b² = c² görünür.
   Altta "alan terazisi": a² + b² şeridi ile c² şeridi hep aynı uzunlukta. */

const W = 340, H = 260, PAD = 6, MARGIN = 12;
const PRESETS = [
  { value: "3-4-5", a: 3, b: 4, label: "3-4-5" },
  { value: "6-8-10", a: 6, b: 8, label: "6-8-10" },
  { value: "5-12-13", a: 5, b: 12, label: "5-12-13" },
  { value: "1-1", a: 1, b: 1, label: "1-1-√2" },
];
const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3, strokeLinejoin: "round" };
const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
const exact2 = (v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-7;
/** TeX’te kare: tam sayıysa 3^2, ondalıksa (4{,}5)^2 */
const sq = (v) => (isInt(v) ? `${tn(v)}^2` : `(${tn(v, 1)})^2`);

/** Birim kare çizgileri: kenarı P→P+u·L ve P→P+v·L olan kare içinde 1 birim aralıklı çizgiler */
function UnitGrid({ P, u, v, L, color }) {
  const { sx, sy } = usePlot();
  let d = "";
  const seg = (x1, y1, x2, y2) => { d += `M${sx(x1).toFixed(1)},${sy(y1).toFixed(1)}L${sx(x2).toFixed(1)},${sy(y2).toFixed(1)}`; };
  for (let k = 1; k < L - 1e-6; k++) {
    // u yönünde k birim ilerleyip v boyunca çizgi
    seg(P[0] + u[0] * k, P[1] + u[1] * k, P[0] + u[0] * k + v[0] * L, P[1] + u[1] * k + v[1] * L);
    seg(P[0] + v[0] * k, P[1] + v[1] * k, P[0] + v[0] * k + u[0] * L, P[1] + v[1] * k + u[1] * L);
  }
  return <path d={d} stroke={color} strokeWidth="1" opacity="0.45" fill="none" />;
}

/** Dik açı işareti (piksel boyutlu küçük kare) */
function RightAngle({ size = 10 }) {
  const { sx, sy } = usePlot();
  const x = sx(0), y = sy(0);
  return <path d={`M${x + size},${y} L${x + size},${y - size} L${x},${y - size}`} fill="none" stroke="var(--ink)" strokeWidth="1.6" />;
}

/** İki satırlık kare etiketi: küçük "a = 3", büyük "a² = 9" */
function SquareTag({ x, y, name, side, area, color, anchor = "middle", dx = 0, dy = 0 }) {
  return (
    <g>
      <Label x={x} y={y} dx={dx} dy={dy - 4} size={11} color={color} anchor={anchor}>{name} = {nf(side, 2)}</Label>
      <Label x={x} y={y} dx={dx} dy={dy + 12} size={14} color="var(--ink)" anchor={anchor} weight={800}>
        {name}<tspan dy="-5" fontSize="9.5">2</tspan><tspan dy="5"> = {nf(area, 2)}</tspan>
      </Label>
    </g>
  );
}

/** Alan terazisi: üstte a² + b², altta c² — her zaman aynı uzunluk */
function Balance({ a2, b2 }) {
  const c2 = a2 + b2;
  const X0 = 70, X1 = 330, L = X1 - X0;
  const wa = (a2 / c2) * L;
  const seg = (x, w, y, color, text) => (
    <g>
      <rect x={x} y={y} width={Math.max(w, 0.5)} height="20" rx="5" fill={color} fillOpacity="0.28" stroke={color} strokeWidth="1.5" />
      {w >= 24 && <text x={x + w / 2} y={y + 14.5} fontSize="11.5" fontWeight="800" textAnchor="middle" fill="var(--ink)" style={halo}>{text}</text>}
    </g>
  );
  return (
    <svg className="lab-plot" viewBox="0 0 340 68" role="img" aria-label={`Alan terazisi · area balance: ${nf(a2)} + ${nf(b2)} = ${nf(c2)}`}>
      <rect x="0" y="0" width="340" height="68" rx="14" fill="var(--plot-bg)" />
      <text x="12" y="24" fontSize="12.5" fontWeight="800" fill="var(--ink-2)">a²+b²</text>
      <text x="12" y="52" fontSize="12.5" fontWeight="800" fill="var(--ink-2)">c²</text>
      {seg(X0, wa, 8, "var(--sky)", nf(a2, 2))}
      {seg(X0 + wa, L - wa, 8, "var(--violet)", nf(b2, 2))}
      {seg(X0, L, 36, "var(--gold)", nf(c2, 2))}
      <line x1={X1} x2={X1} y1="4" y2="62" stroke="var(--mint)" strokeWidth="1.6" strokeDasharray="3 3" />
    </svg>
  );
}

export default function PythagorasLab() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);

  const g = useMemo(() => {
    const a2 = a * a, b2 = b * b, c2 = a2 + b2, c = Math.sqrt(c2);
    // Şeklin sınırları: x ∈ [−b, a+b], y ∈ [−a, a+b]; eşit ölçekli sığdırma
    const bw = a + 2 * b, bh = 2 * a + b;
    const s = Math.min((W - 2 * PAD - 2 * MARGIN) / bw, (H - 2 * PAD - 2 * MARGIN) / bh);
    const xs = (W - 2 * PAD) / s, ys = (H - 2 * PAD) / s;
    const cx = a / 2, cy = b / 2;
    return { a2, b2, c2, c, s, xMin: cx - xs / 2, xMax: cx + xs / 2, yMin: cy - ys / 2, yMax: cy + ys / 2 };
  }, [a, b]);

  const { a2, b2, c2, c, s } = g;
  const cExact = exact2(c);
  const triple = isInt(a) && isInt(b) && isInt(c);
  const preset = PRESETS.find((p) => p.a === a && p.b === b);

  // Hipotenüs karesi: P=(a,0), Q=(0,b), dışa doğru normal (b,a)/c
  const P = [a, 0], Q = [0, b];
  const nrm = [b / c, a / c];
  const R = [Q[0] + nrm[0] * c, Q[1] + nrm[1] * c], S = [P[0] + nrm[0] * c, P[1] + nrm[1] * c];
  const uPQ = [(Q[0] - P[0]) / c, (Q[1] - P[1]) / c];

  // Küçük karelerde etiket dışarı taşınır
  const aIn = a * s >= 62, bIn = b * s >= 62;
  // Kenar harfleri (üçgen içinde)
  const hm = [a / 2, b / 2];
  const showLetters = Math.min(a, b) * s >= 40;

  const cTex = cExact ? `= ${tn(c, 2)}` : `\\approx ${tn(c, 2)}`;
  const live = `\\begin{aligned} c^2 &= ${sq(a)} + ${sq(b)} = ${tn(a2, 2)} + ${tn(b2, 2)} = ${tn(c2, 2)} \\\\ c &= \\sqrt{${tn(c2, 2)}} ${cTex} \\end{aligned}`;

  let hint, hintEn;
  if (triple) {
    const next = a === 3 && b === 4 ? ["6 ve 8’i", "6 and 8"] : a === 6 && b === 8 ? ["5 ve 12’yi", "5 and 12"] : ["3 ve 4’ü", "3 and 4"];
    hint = `Pisagor üçlüsü! ${nf(a)}-${nf(b)}-${nf(c)}: üç kenar da tam sayı. Birim kareleri say: ${nf(a2)} + ${nf(b2)} = ${nf(c2)}. Şimdi ${next[0]} dene.`;
    hintEn = `A Pythagorean triple! ${a}-${b}-${c}: all three sides are whole numbers. Count the unit squares: ${a2} + ${b2} = ${c2}. Now try ${next[1]}.`;
  } else {
    hint = "a ve b’yi kaydır: iki küçük karenin alanı toplamı HER ZAMAN büyük kareye eşit. Alttaki iki şerit de hep aynı boyda kalır.";
    hintEn = "Slide a and b: the two small squares ALWAYS add up to the big one. The two strips below always stay the same length.";
  }

  const pickPreset = (v) => { const p = PRESETS.find((q) => q.value === v); if (p) { setA(p.a); setB(p.b); } };

  return (
    <LabShell title="Pisagor teoremi" titleEn="Pythagoras’ theorem" hint={hint} hintEn={hintEn}>
      <Plot xMin={g.xMin} xMax={g.xMax} yMin={g.yMin} yMax={g.yMax} width={W} height={H} grid={false} axes={false}
        label={`Dik üçgen, kenarlarında kareler: a² = ${nf(a2)}, b² = ${nf(b2)}, c² = ${nf(c2)} · right triangle with squares on its sides`}>
        {/* kareler */}
        <Polygon points={[[0, 0], [a, 0], [a, -a], [0, -a]]} color="var(--sky)" fillOpacity={0.16} />
        <Polygon points={[[0, 0], [0, b], [-b, b], [-b, 0]]} color="var(--violet)" fillOpacity={0.16} />
        <Polygon points={[P, Q, R, S]} color="var(--gold)" fillOpacity={0.16} />
        <UnitGrid P={[0, 0]} u={[1, 0]} v={[0, -1]} L={a} color="var(--sky)" />
        <UnitGrid P={[0, 0]} u={[-1, 0]} v={[0, 1]} L={b} color="var(--violet)" />
        <UnitGrid P={P} u={uPQ} v={nrm} L={c} color="var(--gold)" />
        {/* üçgen */}
        <Polygon points={[[0, 0], P, Q]} color="var(--coral)" fillOpacity={0.2} />
        <RightAngle size={Math.min(11, a * s * 0.3, b * s * 0.3)} />
        {/* kenar harfleri (üçgen yeterince büyükse) */}
        {showLetters && <Label x={a / 2} y={0} dy={-6} size={12} color="var(--sky)" italic>a</Label>}
        {showLetters && <Label x={0} y={b / 2} dx={8} dy={4} size={12} color="var(--violet)" italic>b</Label>}
        {showLetters && <Label x={hm[0]} y={hm[1]} dx={(b / c) * 11} dy={-(a / c) * 11 + 4} size={12} color="var(--ink)" italic>c</Label>}
        {/* alan etiketleri */}
        {aIn
          ? <SquareTag x={a / 2} y={-a / 2} name="a" side={a} area={a2} color="var(--sky)" />
          : <SquareTag x={a} y={0} dx={8} dy={18} name="a" side={a} area={a2} color="var(--sky)" anchor="start" />}
        {bIn
          ? <SquareTag x={-b / 2} y={b / 2} name="b" side={b} area={b2} color="var(--violet)" />
          : <SquareTag x={0} y={b} dx={-6} dy={-26} name="b" side={b} area={b2} color="var(--violet)" anchor="end" />}
        <SquareTag x={(a + b) / 2} y={(a + b) / 2} name="c" side={c} area={c2} color="var(--ink-2)" />
      </Plot>
      <Balance a2={a2} b2={b2} />
      <div className="lab-slider-top" style={{ marginBottom: -4 }}>
        <span className="lab-slider-name"><span>Ünlü üçgenler</span><span className="en">Famous triangles</span></span>
      </div>
      <Choice options={PRESETS.map((p) => ({ value: p.value, label: p.label }))} value={preset ? preset.value : null} onChange={pickPreset} />
      <Slider tex="a" label="1. dik kenar" labelEn="leg 1" value={a} min={1} max={12} step={0.5} onChange={setA} fmt={(v) => nf(v, 1)} color="var(--sky)" />
      <Slider tex="b" label="2. dik kenar" labelEn="leg 2" value={b} min={1} max={12} step={0.5} onChange={setB} fmt={(v) => nf(v, 1)} color="var(--violet)" />
      <LiveTex tex={live} />
      <Readout items={[
        { label: "Küçük kareler", labelEn: "Small squares", tex: `${tn(a2, 2)}+${tn(b2, 2)}`, color: "var(--sky)" },
        { label: "Büyük kare", labelEn: "Big square", tex: `c^2=${tn(c2, 2)}`, color: "var(--gold)" },
        { label: "Hipotenüs", labelEn: "Hypotenuse", tex: `c ${cTex}`, color: "var(--coral)" },
      ]} />
    </LabShell>
  );
}
