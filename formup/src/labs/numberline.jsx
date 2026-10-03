import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Choice, Readout, LiveTex, usePlot, nf } from "./kit.jsx";

/* Sayı doğrusu laboratuvarı — toplama/çıkarma zıplama olarak, çarpma tekrar eden zıplama + ayna (işaret kuralı),
   |a| sıfıra uzaklık. Sahne kendi SVG öğeleriyle Plot içinde çizilir (x: matematik → piksel, y: piksel). */

const W = 340, H = 222, LINE = 128;
const MINUS = "−";
const sgnTxt = (v) => (v < 0 ? MINUS + Math.abs(v) : String(v));
const paren = (v) => (v < 0 ? `(${MINUS}${Math.abs(v)})` : String(v));
const texNum = (v) => (v < 0 ? `-${Math.abs(v)}` : String(v));
const texParen = (v) => (v < 0 ? `(-${Math.abs(v)})` : String(v));
const signColor = (v) => (v > 0 ? "var(--mint)" : v < 0 ? "var(--coral)" : "var(--ink)");

/** Görünür aralık: en az −10…10, gerekirse 5/10/50’lik adımlarla genişler */
function windowFor(vals) {
  const mn = Math.min(-10, ...vals), mx = Math.max(10, ...vals);
  const g = mx - mn <= 40 ? 5 : mx - mn <= 120 ? 10 : 50;
  return [Math.floor(mn / g) * g, Math.ceil(mx / g) * g];
}
const pickStep = (unitPx, steps, minPx) => steps.find((s) => s * unitPx >= minPx) ?? steps[steps.length - 1];

/** Yay biçimli zıplama + ok ucu */
function Hop({ x1, x2, h, color, dashed = false, opacity = 1, width = 2.2 }) {
  if (Math.abs(x2 - x1) < 0.5) return null;
  const xm = (x1 + x2) / 2, cy = LINE - 2 * h;
  const d = `M${x1.toFixed(1)},${LINE - 1} Q${xm.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${LINE - 1}`;
  // uç teğeti: kontrol noktasından bitişe
  const tx = x2 - xm, ty = LINE - 1 - cy, L = Math.hypot(tx, ty) || 1;
  const ux = tx / L, uy = ty / L, s = Math.min(6.5, Math.abs(x2 - x1) * 0.45 + 2.5);
  const tipX = x2 - ux * 1.5, tipY = LINE - 1 - uy * 1.5;
  const bx = tipX - ux * s, by = tipY - uy * s;
  const head = `${tipX.toFixed(1)},${tipY.toFixed(1)} ${(bx - uy * s * 0.55).toFixed(1)},${(by + ux * s * 0.55).toFixed(1)} ${(bx + uy * s * 0.55).toFixed(1)},${(by - ux * s * 0.55).toFixed(1)}`;
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={head} fill={color} />
    </g>
  );
}

/** Yuvarlak köşeli küçük etiket (rozet) */
function Badge({ x, y, text, color, ink, big = false, minX = 6, maxX = W - 6, lean = 0 }) {
  const fs = big ? 13.5 : 11.5;
  const w = Math.max(22, String(text).length * fs * 0.62 + 14), h = big ? 22 : 19;
  // lean: −1 → rozet noktanın soluna yaslanır, +1 → sağına
  const want = lean ? x + lean * (w / 2 - 8) : x;
  const cx = Math.min(maxX - w / 2, Math.max(minX + w / 2, want));
  return (
    <g>
      <line x1={x} x2={x} y1={y + h / 2} y2={LINE - 7} stroke={color} strokeWidth="1.2" strokeDasharray="2 2.5" opacity="0.7" />
      <rect x={cx - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill="var(--plot-bg)" />
      <rect x={cx - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={color} fillOpacity="0.16" stroke={color} strokeWidth="1.8" />
      <text x={cx} y={y + fs * 0.36} fontSize={fs} fontWeight="800" textAnchor="middle" fill={ink || color}>{text}</text>
    </g>
  );
}

/** Üstte ölçü çizgisi: |——— etiket ———| */
function Span({ x1, x2, y, text, color, minX = 8, maxX = W - 8 }) {
  const a = Math.min(x1, x2), b = Math.max(x1, x2);
  const tw = String(text).length * 6.6 + 12;
  const cx = Math.min(maxX - tw / 2, Math.max(minX + tw / 2, (a + b) / 2));
  return (
    <g>
      {b - a > tw + 10 && (
        <g stroke={color} strokeWidth="1.3" opacity="0.75">
          <line x1={a} x2={b} y1={y} y2={y} />
          <line x1={a} x2={a} y1={y - 4} y2={y + 4} />
          <line x1={b} x2={b} y1={y - 4} y2={y + 4} />
        </g>
      )}
      <rect x={cx - tw / 2} y={y - 9} width={tw} height={18} rx="6" fill="var(--plot-bg)" />
      <text x={cx} y={y + 4} fontSize="12" fontWeight="800" textAnchor="middle" fill={color}>{text}</text>
    </g>
  );
}

function Scene({ a, b, op, lo, hi }) {
  const { sx } = usePlot();
  const unit = sx(1) - sx(0);
  const minor = pickStep(unit, [1, 2, 5, 10, 25], 4.5);
  const major = pickStep(unit, [1, 2, 5, 10, 20, 50], 34);
  const ticks = [];
  for (let v = Math.ceil(lo / minor) * minor; v <= hi; v += minor) ticks.push(v);
  const labels = [];
  for (let v = Math.ceil(lo / major) * major; v <= hi; v += major) labels.push(v);

  const res = op === "add" ? a + b : op === "sub" ? a - b : a * b;
  const resC = signColor(res);
  const els = [];

  // ---- zıplamalar ----
  let spanFrom = a, spanTo = res, spanText = "", hopTop = LINE;
  if (op !== "mul") {
    const step = op === "add" ? b : -b;
    const n = Math.abs(step), s = Math.sign(step);
    const h = Math.max(8, Math.min(24, unit * 1.05 + 3));
    for (let i = 0; i < n; i++) {
      els.push(<Hop key={"h" + i} x1={sx(a + i * s)} x2={sx(a + (i + 1) * s)} h={h} color="var(--sky)" />);
    }
    for (let i = 1; i < n; i++) els.push(<circle key={"d" + i} cx={sx(a + i * s)} cy={LINE} r="2.2" fill="var(--sky)" />);
    hopTop = LINE - h;
    spanText = op === "add" ? `+${paren(b)}` : `${MINUS}${paren(b)}`;
    if (n === 0) spanText = op === "add" ? "+0" : `${MINUS}0`;
  } else {
    // |a| kez b kadar zıpla; a < 0 ise ayna (×(−1))
    const n = Math.abs(a);
    const hopW = Math.abs(b) * unit;
    const h = Math.max(8, Math.min(34, hopW * 0.5 + 3));
    const dir = a < 0 ? -1 : 1;
    if (a < 0 && b !== 0) {
      for (let i = 0; i < n; i++) els.push(<Hop key={"g" + i} x1={sx(i * b)} x2={sx((i + 1) * b)} h={h} color="var(--ink-3)" dashed opacity={0.75} width={1.8} />);
      els.push(<circle key="gend" cx={sx(n * b)} cy={LINE} r="5" fill="var(--plot-bg)" stroke="var(--ink-3)" strokeWidth="2" strokeDasharray="2 2" />);
    }
    for (let i = 0; i < n; i++) els.push(<Hop key={"m" + i} x1={sx(i * b * dir)} x2={sx((i + 1) * b * dir)} h={h} color="var(--sky)" />);
    for (let i = 1; i < n; i++) els.push(<circle key={"md" + i} cx={sx(i * b * dir)} cy={LINE} r="2.2" fill="var(--sky)" />);
    hopTop = LINE - h;
    spanFrom = 0; spanTo = res;
    spanText = `${n} × ${paren(b * dir)}`;
  }

  // ---- rozetler: a ve sonuç ----
  const xa = sx(a), xr = sx(res);
  const badgeY = Math.min(hopTop - 20, LINE - 34);
  const showA = op !== "mul";
  const close = showA && Math.abs(xa - xr) < 60;
  const resY = close ? badgeY - 26 : badgeY;
  // ölçü çizgisi rozetlerin üstünde
  const spanY = Math.max(16, resY - 30);
  // çarpmada a < 0: ayna (×(−1)); etiketler aynanın kendi tarafında kalır
  const mirror = op === "mul" && a < 0 && b !== 0;
  const x0 = sx(0);
  const side = (v) => (v > 0 ? { minX: x0 + 4 } : v < 0 ? { maxX: x0 - 4 } : {});
  if (mirror) {
    const n = Math.abs(a), gw = `${n} × ${paren(b)}`.length * 6 + 8;
    let gx = sx((n * b) / 2);
    gx = b > 0 ? Math.min(W - 8 - gw / 2, Math.max(gx, x0 + gw / 2 + 6)) : Math.max(8 + gw / 2, Math.min(gx, x0 - gw / 2 - 6));
    els.push(<line key="mir" x1={x0} x2={x0} y1={LINE - 6} y2={30} stroke="var(--coral)" strokeWidth="1.6" strokeDasharray="5 4" />);
    els.push(
      <g key="mirl">
        <rect x={x0 - 27} y={12} width="54" height="19" rx="9.5" fill="var(--plot-bg)" />
        <rect x={x0 - 27} y={12} width="54" height="19" rx="9.5" fill="var(--coral)" fillOpacity="0.16" stroke="var(--coral)" strokeWidth="1.2" />
        <text x={x0} y={25.5} fontSize="11.5" fontWeight="800" textAnchor="middle" fill="var(--coral)">×({MINUS}1)</text>
      </g>
    );
    els.push(<text key="gl" x={gx} y={badgeY + 4} fontSize="10.5" fontWeight="700" textAnchor="middle" fill="var(--ink-3)" style={{ paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3 }}>{`${n} × ${paren(b)}`}</text>);
  }

  return (
    <g>
      {/* negatif / pozitif bölgeler */}
      <rect x={sx(lo) - 4} y={LINE - 3.5} width={sx(0) - sx(lo) + 4} height="7" rx="3.5" fill="var(--coral)" opacity="0.22" />
      <rect x={sx(0)} y={LINE - 3.5} width={sx(hi) - sx(0) + 4} height="7" rx="3.5" fill="var(--mint)" opacity="0.22" />
      <line x1={sx(lo) - 8} x2={sx(hi) + 8} y1={LINE} y2={LINE} stroke="var(--ink-2)" strokeWidth="1.6" />
      <polygon points={`${sx(hi) + 13},${LINE} ${sx(hi) + 6},${LINE - 4} ${sx(hi) + 6},${LINE + 4}`} fill="var(--ink-2)" />
      <polygon points={`${sx(lo) - 13},${LINE} ${sx(lo) - 6},${LINE - 4} ${sx(lo) - 6},${LINE + 4}`} fill="var(--ink-2)" />
      {ticks.map((v) => (
        <line key={"t" + v} x1={sx(v)} x2={sx(v)} y1={LINE - (v === 0 ? 8 : v % major === 0 ? 5 : 3)} y2={LINE + (v === 0 ? 8 : v % major === 0 ? 5 : 3)}
          stroke={v === 0 ? "var(--ink)" : "var(--ink-3)"} strokeWidth={v === 0 ? 2.2 : 1.2} />
      ))}
      {labels.map((v) => (
        <text key={"l" + v} x={sx(v)} y={LINE + 20} fontSize={v === 0 ? 12 : 10} fontWeight={v === 0 ? 800 : 600} textAnchor="middle" fill={v === 0 ? "var(--ink)" : "var(--ink-3)"}>{sgnTxt(v)}</text>
      ))}

      {/* |a| = sıfıra uzaklık */}
      {a !== 0 && (
        <g stroke="var(--violet)" strokeWidth="2.4" strokeLinecap="round">
          <line x1={sx(0)} x2={xa} y1={LINE + 32} y2={LINE + 32} />
          <line x1={sx(0)} x2={sx(0)} y1={LINE + 26} y2={LINE + 38} />
          <line x1={xa} x2={xa} y1={LINE + 26} y2={LINE + 38} />
        </g>
      )}
      <text x={Math.min(W - 40, Math.max(40, (sx(0) + xa) / 2))} y={LINE + 53} fontSize="12" fontWeight="800" textAnchor="middle" fill="var(--violet)">
        {`|${sgnTxt(a)}| = ${Math.abs(a)}`}
      </text>

      {els}

      {/* zıplamanın ölçü çizgisi */}
      <Span x1={sx(spanFrom)} x2={sx(spanTo)} y={mirror ? Math.max(spanY, 46) : spanY} text={spanText} color="var(--sky)" {...(mirror ? side(res) : {})} />

      {/* noktalar */}
      <circle cx={xa} cy={LINE} r={op === "mul" ? 4.5 : 6} fill="var(--gold)" stroke="var(--plot-bg)" strokeWidth="2.5" />
      <circle cx={xr} cy={LINE} r="7.5" fill={resC} stroke="var(--plot-bg)" strokeWidth="2.5" />
      <Badge x={xr} y={resY} text={sgnTxt(res)} color={resC} ink={res === 0 ? "var(--ink)" : undefined} big {...(mirror ? side(res) : {})} />
      {showA && <Badge x={xa} y={badgeY} text={`a = ${sgnTxt(a)}`} color="var(--gold)" ink="var(--ink)" lean={close ? (res >= a ? -1 : 1) : 0} />}

      {/* uç etiketleri */}
      <text x={10} y={H - 9} fontSize="9.5" fontWeight="700" fill="var(--coral)">← negatif · negative</text>
      <text x={W - 10} y={H - 9} fontSize="9.5" fontWeight="700" textAnchor="end" fill="var(--mint)">pozitif · positive →</text>
    </g>
  );
}

/** İşlem düğmesi etiketi: büyük simge + iki dilli ad */
function OpLabel({ sym, tr, en }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <b style={{ fontSize: 19, lineHeight: 1, minWidth: 12, textAlign: "center" }}>{sym}</b>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15, textAlign: "left" }}>
        <span>{tr}</span>
        <span className="en" style={{ fontSize: 11.5 }}>{en}</span>
      </span>
    </span>
  );
}

const HINTS = {
  add: ["b’yi sola çek: negatif bir sayı eklemek sola zıplatır. Sıfırı geçince sonuç eksiye döner.", "Drag b to the left: adding a negative jumps left. Cross zero and the result turns negative."],
  sub: ["b’yi negatif yap: eksiyi çıkarmak sağa zıplatır, yani −(−5) = +5 olur!", "Make b negative: subtracting a negative jumps right, so −(−5) = +5!"],
  mul: ["a’yı sıfırın soluna çek: yön aynada döner. İki eksi = iki kez dönmek = artı!", "Drag a left of zero: the direction flips in the mirror. Two minuses = two flips = plus!"],
};

export default function NumberLineLab() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(-5);
  const [op, setOp] = useState("add");

  const res = op === "add" ? a + b : op === "sub" ? a - b : a * b;
  const [lo, hi] = useMemo(() => {
    const vals = op === "mul" ? [0, a, res, Math.abs(a) * b] : [0, a, res];
    return windowFor(vals);
  }, [a, b, op, res]);
  const span = hi - lo, m = span * 0.06;

  // canlı formül
  let tex;
  if (op === "add") tex = b < 0 ? `${texNum(a)} + (-${-b}) = ${texNum(a)} - ${-b} = ${texNum(res)}` : `${texNum(a)} + ${b} = ${texNum(res)}`;
  else if (op === "sub") tex = b < 0 ? `${texNum(a)} - (-${-b}) = ${texNum(a)} + ${-b} = ${texNum(res)}` : `${texNum(a)} - ${b} = ${texNum(res)}`;
  else tex = `${texParen(a)} \\cdot ${texParen(b)} = ${res > 0 && (a < 0 || b < 0) ? "+" : ""}${texNum(res)}`;

  // işaret kuralı
  const sg = (v) => (v < 0 ? "-" : "+");
  let rule;
  if (op === "mul") rule = a === 0 || b === 0 ? `0\\cdot x = 0` : `(${sg(a)})\\cdot(${sg(b)}) = (${sg(res)})`;
  else if (op === "add") rule = b < 0 ? `+(-) = -` : `+(+) = +`;
  else rule = b < 0 ? `-(-) = +` : `-(+) = -`;

  const jumps = op === "mul"
    ? `${Math.abs(a)} \\times ${Math.abs(b)}\\ ${a * b < 0 ? "\\leftarrow" : a * b > 0 ? "\\rightarrow" : ""}`
    : (() => { const st = op === "add" ? b : -b; return `${Math.abs(st)}\\ ${st < 0 ? "\\leftarrow" : st > 0 ? "\\rightarrow" : ""}`; })();

  const [hint, hintEn] = HINTS[op];

  return (
    <LabShell title="Sayı doğrusu" titleEn="Number line" hint={hint} hintEn={hintEn}>
      <Plot xMin={lo - m} xMax={hi + m} yMin={0} yMax={1} width={W} height={H} grid={false} axes={false}
        label={`Sayı doğrusu: a = ${nf(a)}, b = ${nf(b)}, sonuç ${nf(res)} · Number line, result ${nf(res)}`}>
        <Scene a={a} b={b} op={op} lo={lo} hi={hi} />
      </Plot>
      <Choice value={op} onChange={setOp} options={[
        { value: "add", label: <OpLabel sym="+" tr="toplama" en="add" /> },
        { value: "sub", label: <OpLabel sym="−" tr="çıkarma" en="subtract" /> },
        { value: "mul", label: <OpLabel sym="×" tr="çarpma" en="multiply" /> },
      ]} />
      <Slider tex="a" label="başlangıç" labelEn="start" value={a} min={-10} max={10} step={1} onChange={setA} fmt={(v) => sgnTxt(v)} color="var(--gold)" />
      <Slider tex="b" label={op === "mul" ? "zıplama boyu" : "zıplama"} labelEn={op === "mul" ? "jump size" : "jump"} value={b} min={-10} max={10} step={1} onChange={setB} fmt={(v) => sgnTxt(v)} color="var(--sky)" />
      <LiveTex tex={tex} />
      <Readout items={[
        { label: "Sonuç", labelEn: "Result", value: sgnTxt(res), color: signColor(res) },
        { label: "İşaret kuralı", labelEn: "Sign rule", tex: rule, color: "var(--coral)" },
        { label: "Sıfıra uzaklık", labelEn: "Distance to 0", tex: `\\lvert ${texNum(a)} \\rvert = ${Math.abs(a)}`, color: "var(--violet)" },
        { label: "Zıplama", labelEn: "Jumps", tex: jumps, color: "var(--sky)" },
      ]} />
    </LabShell>
  );
}
