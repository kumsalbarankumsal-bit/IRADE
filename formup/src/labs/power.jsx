import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Readout, LiveTex, Choice, nf, tn } from "./kit.jsx";
import { Tex } from "../lib/tex.jsx";

/* Üs kuralları laboratuvarı: her "a" bir kutucuk. Kutuları sayınca kural kendiliğinden çıkar:
   çarpmada gruplar birleşir (üsler toplanır), bölmede eşleşenler sadeleşir (çıkarılır),
   üssün üssünde n satır × m kutu (çarpılır), negatif/sıfır üste ÷a merdiveni. */

const W = 340, H = 244;
const CAP_Y = 171, PILL_Y = 195;
const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3, strokeLinejoin: "round" };
const MINUS = "−";

const RULES = [
  { value: "prod", tex: "a^m\\cdot a^n", tr: "Çarpma kuralı", en: "Product rule", rule: "a^m\\cdot a^n=a^{m+n}" },
  { value: "quot", tex: "\\dfrac{a^m}{a^n}", tr: "Bölme kuralı", en: "Quotient rule", rule: "\\dfrac{a^m}{a^n}=a^{m-n}" },
  { value: "pow", tex: "(a^m)^n", tr: "Üssün üssü", en: "Power of a power", rule: "(a^m)^n=a^{mn}" },
  { value: "neg", tex: "a^{-n}", tr: "Negatif üs", en: "Negative exponent", rule: "a^{-n}=\\dfrac{1}{a^n}" },
  { value: "zero", tex: "a^0", tr: "Sıfır üs", en: "Zero exponent", rule: "a^0=1" },
];

/* ---------- sayı biçimleri ---------- */
const group = (v, sep = " ") => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const expStr = (e) => (e < 0 ? MINUS + Math.abs(e) : String(e));
/** a^e değeri: { rel, tex, txt, sup? } — çok büyükse bilimsel gösterim */
function valueOf(a, e) {
  if (e >= 0) {
    const v = a ** e;
    if (v < 1e9) return { rel: "=", tex: group(v, "\\,"), txt: group(v), num: v };
    const ex = Math.floor(Math.log10(v));
    const mant = v / 10 ** ex;
    return { rel: "\\approx", tex: `${tn(mant, 2)}\\times 10^{${ex}}`, txt: `${nf(mant, 2)} × 10`, sup: String(ex), num: v, approx: true };
  }
  const d = a ** -e;
  return { rel: "=", tex: `\\dfrac{1}{${group(d, "\\,")}}`, txt: `1/${group(d)}`, num: 1 / d };
}

/* ---------- SVG parçaları ---------- */
/** Üslü yazı: parts = [["2"], ["3", true], [" = 8"]] (true → üst simge) */
function SupText({ x, y, parts, size = 13, anchor = "middle", color = "var(--ink)", weight = 800 }) {
  let up = false;
  const out = parts.map(([t, sup], i) => {
    let dy;
    if (sup && !up) { dy = -size * 0.42; up = true; } else if (!sup && up) { dy = size * 0.42; up = false; }
    return <tspan key={i} dy={dy} fontSize={sup ? size * 0.68 : undefined}>{t}</tspan>;
  });
  return <text x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={color} style={halo}>{out}</text>;
}

function Tile({ x, y, a, color, size = 26, cancelled = false, one = false }) {
  if (one) {
    return (
      <g>
        <rect x={x} y={y} width={size} height={size} rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1.4" strokeDasharray="3 3" />
        <text x={x + size / 2} y={y + size / 2 + size * 0.18} fontSize={size * 0.5} fontWeight="700" textAnchor="middle" fill="var(--ink-3)">1</text>
      </g>
    );
  }
  return (
    <g opacity={cancelled ? 0.55 : 1}>
      <rect x={x} y={y} width={size} height={size} rx="6" fill={color} fillOpacity={cancelled ? 0.06 : 0.24} stroke={cancelled ? "var(--coral)" : color} strokeWidth="1.6" strokeDasharray={cancelled ? "3 2.5" : undefined} />
      <text x={x + size / 2} y={y + size / 2 + size * 0.18} fontSize={size * 0.52} fontWeight="800" textAnchor="middle" fill="var(--ink)">{a}</text>
      {cancelled && <line x1={x + 3} y1={y + size - 3} x2={x + size - 3} y2={y + 3} stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" />}
    </g>
  );
}

/** count kutu (0 ise kesikli "1" kutusu) */
function Row({ count, x, y, a, color, size = 26, cancelFirst = 0, colorAfter, splitAt }) {
  const pitch = size + 3;
  if (count === 0) return <Tile x={x} y={y} size={size} one />;
  const out = [];
  for (let i = 0; i < count; i++) {
    const c = splitAt != null && i >= splitAt ? colorAfter : color;
    out.push(<Tile key={i} x={x + i * pitch} y={y} a={a} size={size} color={c} cancelled={i < cancelFirst} />);
  }
  return <g>{out}</g>;
}
const rowW = (count, size = 26) => Math.max(count, 1) * (size + 3) - 3;

function ArrowDown({ x, y1, y2 }) {
  return (
    <g stroke="var(--ink-3)" strokeWidth="1.8" strokeLinecap="round" fill="none">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <path d={`M${x - 5},${y2 - 6} L${x},${y2} L${x + 5},${y2 - 6}`} strokeLinejoin="round" />
    </g>
  );
}

/** Alt süslü parantez (yatay) */
function BraceUnder({ x1, x2, y }) {
  const m = (x1 + x2) / 2;
  return <path d={`M${x1},${y} q0,6 6,6 L${m - 5},${y + 6} q5,0 5,5 q0,-5 5,-5 L${x2 - 6},${y + 6} q6,0 6,-6`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinejoin="round" />;
}
/** Sağ süslü parantez (dikey) */
function BraceRight({ x, y1, y2 }) {
  const m = (y1 + y2) / 2;
  return <path d={`M${x},${y1} q6,0 6,6 L${x + 6},${m - 5} q0,5 5,5 q-5,0 -5,5 L${x + 6},${y2 - 6} q0,6 -6,6`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinejoin="round" />;
}

/** ÷a merdiveni: üs from → to, highlight üssü vurgulu */
function Ladder({ a, from, to, y, highlight }) {
  const exps = [];
  for (let e = from; e >= to; e--) exps.push(e);
  const cnt = exps.length;
  const sp = Math.min(46, 318 / cnt);
  const x0 = W / 2 - (sp * (cnt - 1)) / 2;
  return (
    <g>
      {exps.slice(1).map((e, i) => {
        const xa = x0 + i * sp + 7, xb = x0 + (i + 1) * sp - 7, xm = (xa + xb) / 2;
        return (
          <g key={"arc" + e}>
            <path d={`M${xa},${y - 17} Q${xm},${y - 29} ${xb},${y - 17}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.3" />
            <path d={`M${xb - 5},${y - 21} L${xb},${y - 17} L${xb - 6},${y - 15.5}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <text x={xm} y={y - 27} fontSize="9" fontWeight="700" textAnchor="middle" fill="var(--ink-3)" style={halo}>÷{a}</text>
          </g>
        );
      })}
      {exps.map((e, i) => {
        const x = x0 + i * sp;
        const on = e === highlight;
        const v = e >= 0 ? group(a ** e) : "1/" + group(a ** -e);
        return (
          <g key={e}>
            {on && <rect x={x - sp / 2 + 2} y={y - 14} width={sp - 4} height={35} rx="8" fill="var(--gold)" fillOpacity="0.16" stroke="var(--gold)" strokeWidth="1.5" />}
            <SupText x={x} y={y} parts={[[String(a)], [expStr(e), true]]} size={12.5} color={e < 0 ? "var(--violet)" : e === 0 ? "var(--mint)" : "var(--ink)"} />
            <text x={x} y={y + 15} fontSize={v.length > 5 ? 9 : 10.5} fontWeight="700" textAnchor="middle" fill="var(--ink-2)" style={halo}>{v}</text>
          </g>
        );
      })}
    </g>
  );
}

/** Sonuç rozeti: a^e = değer */
function Pill({ a, e, val }) {
  const parts = [[String(a)], [expStr(e), true], [val.approx ? " ≈ " : " = "], [val.txt]];
  if (val.sup) parts.push([val.sup, true]);
  return (
    <g>
      <rect x={W / 2 - 110} y={PILL_Y} width="220" height="34" rx="17" fill="var(--gold)" fillOpacity="0.16" stroke="var(--gold)" strokeWidth="1.6" />
      <SupText x={W / 2} y={PILL_Y + 23} parts={parts} size={17} />
    </g>
  );
}

function Caption({ tr, en }) {
  return (
    <g>
      <text x={W / 2} y={CAP_Y} fontSize="11.5" fontWeight="700" textAnchor="middle" fill="var(--ink-2)" style={halo}>{tr}</text>
      <text x={W / 2} y={CAP_Y + 14} fontSize="10.5" fontWeight="500" textAnchor="middle" fill="var(--ink-3)" style={halo}>{en}</text>
    </g>
  );
}

/* ---------- kurallara göre çizimler ---------- */
function ProductScene({ a, m, n }) {
  const gap = 28;
  const wm = rowW(m), wn = rowW(n);
  const x0 = (W - (wm + gap + wn)) / 2;
  const xn = x0 + wm + gap;
  const tot = m + n, wt = rowW(tot), xt = (W - wt) / 2;
  return (
    <g>
      <SupText x={x0 + wm / 2} y={24} parts={[[String(a)], [String(m), true]]} color="var(--sky)" />
      <SupText x={xn + wn / 2} y={24} parts={[[String(a)], [String(n), true]]} color="var(--violet)" />
      <Row count={m} x={x0} y={32} a={a} color="var(--sky)" />
      <text x={x0 + wm + gap / 2} y={51} fontSize="18" fontWeight="800" textAnchor="middle" fill="var(--ink-2)">·</text>
      <ArrowDown x={W / 2} y1={68} y2={92} />
      <text x={W / 2 - 12} y={84} fontSize="10.5" fontWeight="700" textAnchor="end" fill="var(--ink-2)">yan yana koy</text>
      <text x={W / 2 + 12} y={84} fontSize="10.5" fontWeight="500" fill="var(--ink-3)">line them up</text>
      <Row count={tot} x={xt} y={100} a={a} color="var(--sky)" colorAfter="var(--violet)" splitAt={m} />
      <Row count={n} x={xn} y={32} a={a} color="var(--violet)" />
      {tot > 0 && <BraceUnder x1={xt} x2={xt + wt} y={132} />}
      <Caption tr={`${m} + ${n} = ${tot} tane ${a}`} en={`${m} + ${n} = ${tot} copies of ${a}`} />
    </g>
  );
}

function QuotientScene({ a, m, n }) {
  const k = Math.min(m, n);
  const maxC = Math.max(m, n, 1);
  const fw = rowW(maxC);
  const cx = 128;
  const xl = cx - fw / 2;
  const e = m - n;
  // eşleşen çift bağlantıları
  const links = [];
  for (let i = 0; i < k; i++) {
    const x = xl + i * 29 + 13;
    links.push(<line key={i} x1={x} y1={72} x2={x} y2={94} stroke="var(--coral)" strokeWidth="1.3" strokeDasharray="2 2.5" opacity="0.8" />);
  }
  return (
    <g>
      <SupText x={xl - 10} y={64} parts={[[String(a)], [String(m), true]]} anchor="end" color="var(--sky)" />
      <SupText x={xl - 10} y={118} parts={[[String(a)], [String(n), true]]} anchor="end" color="var(--violet)" />
      {links}
      <Row count={m} x={xl} y={44} a={a} color="var(--sky)" cancelFirst={k} />
      <line x1={xl - 4} x2={xl + fw + 4} y1={83} y2={83} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <Row count={n} x={xl} y={94} a={a} color="var(--violet)" cancelFirst={k} />
      <text x={xl + fw + 20} y={90} fontSize="20" fontWeight="700" textAnchor="middle" fill="var(--ink-2)">=</text>
      <SupText x={Math.max(xl + fw + 58, 262)} y={92} parts={[[String(a)], [expStr(e), true]]} size={24} color={e < 0 ? "var(--violet)" : e === 0 ? "var(--mint)" : "var(--sky)"} />
      <Caption
        tr={k > 0 ? `${k} çift sadeleşti → ${m} − ${n} = ${expStr(e)}` : `Sadeleşen yok → ${m} − ${n} = ${expStr(e)}`}
        en={k > 0 ? `${k} pair${k > 1 ? "s" : ""} cancel → ${m} − ${n} = ${expStr(e)}` : `Nothing cancels → ${m} − ${n} = ${expStr(e)}`}
      />
    </g>
  );
}

function PowerScene({ a, m, n }) {
  const size = 22, pitch = 25;
  const bw = rowW(m, size);
  const bh = n * pitch - 3;
  const top = 16 + ((5 - n) * pitch) / 2;
  const x0 = W / 2 - bw / 2 - 10;
  if (n === 0) {
    return (
      <g>
        <Tile x={W / 2 - 15} y={70} size={30} one />
        <SupText x={W / 2} y={56} parts={[["("], [String(a)], [String(m), true], [")"], ["0", true]]} color="var(--ink-2)" />
        <Caption tr="Dış üs 0: hiç kopya yok → sonuç 1" en="Outer power 0: no copies at all → 1" />
      </g>
    );
  }
  const rows = [];
  for (let i = 0; i < n; i++) {
    const y = top + i * pitch;
    rows.push(
      <g key={i}>
        <SupText x={x0 - 8} y={y + 16} parts={[[String(a)], [String(m), true]]} anchor="end" size={12.5} color="var(--sky)" />
        <Row count={m} x={x0} y={y} a={a} size={size} color={i % 2 ? "var(--violet)" : "var(--sky)"} />
      </g>
    );
  }
  return (
    <g>
      {rows}
      <BraceRight x={x0 + bw + 6} y1={top} y2={top + bh} />
      <text x={x0 + bw + 22} y={top + bh / 2 - 1} fontSize="13" fontWeight="800" fill="var(--violet)" style={halo}>{n} kez</text>
      <text x={x0 + bw + 22} y={top + bh / 2 + 12} fontSize="10.5" fontWeight="500" fill="var(--ink-3)" style={halo}>{n} times</text>
      <Caption tr={`${n} satır × ${m} kutu = ${m * n} tane ${a}`} en={`${n} rows × ${m} tiles = ${m * n} copies of ${a}`} />
    </g>
  );
}

function NegativeScene({ a, n }) {
  const fw = rowW(n);
  const val = valueOf(a, -n);
  // sol etiket + kesir + sağ sonuç birlikte ortalanır
  const leftW = 44, rightW = (2 + val.txt.length) * 10;
  const start = (W - (leftW + 12 + fw + 12 + rightW)) / 2;
  const xl = start + leftW + 12;
  const cx = xl + fw / 2;
  return (
    <g>
      <SupText x={xl - 12} y={52} parts={[[String(a)], [expStr(-n), true], [" ="]]} anchor="end" size={17} color="var(--violet)" />
      <text x={cx} y={33} fontSize="20" fontWeight="800" textAnchor="middle" fill="var(--ink)">1</text>
      <line x1={xl - 4} x2={xl + fw + 4} y1={42} y2={42} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <Row count={n} x={xl} y={49} a={a} color="var(--violet)" />
      <text x={xl + fw + 12} y={52} fontSize="17" fontWeight="800" fill="var(--ink)" style={halo}>= {val.txt}</text>
      <Ladder a={a} from={n >= 4 ? 1 : 2} to={Math.min(-n, 0)} y={128} highlight={-n} />
      <Caption tr="Eksi üs = 1 bölü (ters çevir). Her adım ÷ taban." en="Negative power = 1 over it (flip). Each step is ÷ base." />
    </g>
  );
}

function ZeroScene({ a, m }) {
  const fw = rowW(m);
  const cx = 140;
  const xl = cx - fw / 2;
  const links = [];
  for (let i = 0; i < m; i++) {
    const x = xl + i * 29 + 13;
    links.push(<line key={i} x1={x} y1={40} x2={x} y2={62} stroke="var(--coral)" strokeWidth="1.3" strokeDasharray="2 2.5" opacity="0.8" />);
  }
  return (
    <g>
      <SupText x={xl - 10} y={32} parts={[[String(a)], [String(m), true]]} anchor="end" color="var(--sky)" />
      <SupText x={xl - 10} y={86} parts={[[String(a)], [String(m), true]]} anchor="end" color="var(--violet)" />
      {links}
      <Row count={m} x={xl} y={12} a={a} color="var(--sky)" cancelFirst={m} />
      <line x1={xl - 4} x2={xl + fw + 4} y1={51} y2={51} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <Row count={m} x={xl} y={62} a={a} color="var(--violet)" cancelFirst={m} />
      <text x={xl + fw + 16} y={58} fontSize="20" fontWeight="800" fill="var(--mint)" style={halo}>= 1</text>
      <Ladder a={a} from={m} to={0} y={134} highlight={0} />
      <Caption tr={`Hepsi sadeleşti: ${m} − ${m} = 0, geriye 1 kalır`} en={`Everything cancels: ${m} − ${m} = 0, so 1 is left`} />
    </g>
  );
}

export default function PowerLab() {
  const [rule, setRule] = useState("prod");
  const [a, setA] = useState(2);
  const [m, setM] = useState(3);
  const [n, setN] = useState(2);
  const R = RULES.find((r) => r.value === rule);
  const mz = Math.max(1, m); // sıfır üs modunda m ≥ 1

  const out = useMemo(() => {
    let e, live, expTex;
    if (rule === "prod") {
      e = m + n;
      expTex = `${m}+${n}=${e}`;
      live = `${a}^{${m}}\\cdot ${a}^{${n}} = ${a}^{${m}+${n}} = ${a}^{${e}}`;
    } else if (rule === "quot") {
      e = m - n;
      expTex = `${m}-${n}=${e}`;
      live = `\\frac{${a}^{${m}}}{${a}^{${n}}} = ${a}^{${m}-${n}} = ${a}^{${e}}`;
    } else if (rule === "pow") {
      e = m * n;
      expTex = `${m}\\cdot ${n}=${e}`;
      live = `\\left(${a}^{${m}}\\right)^{${n}} = ${a}^{${m}\\cdot ${n}} = ${a}^{${e}}`;
    } else if (rule === "neg") {
      e = -n;
      expTex = `${e}`;
      live = `${a}^{${e}} = \\frac{1}{${a}^{${n}}}`;
    } else {
      e = 0;
      expTex = `${mz}-${mz}=0`;
      live = `\\frac{${a}^{${mz}}}{${a}^{${mz}}} = ${a}^{${mz}-${mz}} = ${a}^{0}`;
    }
    const val = valueOf(a, e);
    live += ` ${val.rel} ${val.tex}`;
    let valTex = `${val.rel === "=" ? "" : "\\approx "}${val.tex}`;
    if (e < 0) {
      const dec = val.num;
      const exact = Math.abs(Math.round(dec * 1e5) / 1e5 - dec) < 1e-12;
      valTex += ` ${exact ? "=" : "\\approx"} ${tn(dec, 5)}`;
    }
    return { e, val, live, expTex, valTex };
  }, [rule, a, m, n, mz]);

  const hints = {
    prod: [
      <>m ve n’yi değiştir: iki grup yan yana birleşir. Kutuları say → üsler <b>TOPLANIR</b>.</>,
      <>Change m and n: the two groups join up. Count the tiles → the exponents <b>ADD</b>.</>,
    ],
    quot: [
      <>Üstte ve altta eşleşen kutular birbirini götürür → üsler <b>ÇIKARILIR</b>. n’yi m’den büyük yap: ne olur?</>,
      <>Matching tiles on top and bottom cancel → the exponents <b>SUBTRACT</b>. Make n bigger than m: what happens?</>,
    ],
    pow: [
      <><Tex tex="a^m" /> sayısını n kez yaz: n satır, her satırda m kutu → üsler <b>ÇARPILIR</b>.</>,
      <>Write <Tex tex="a^m" /> n times: n rows of m tiles → the exponents <b>MULTIPLY</b>.</>,
    ],
    neg: [
      <>n’yi büyüt: merdivende 1’in altına in. Eksi üs sayıyı küçültür ama asla negatif yapmaz!</>,
      <>Increase n: walk down the ladder below 1. A negative exponent makes the number small, never negative!</>,
    ],
    zero: [
      <>Tabanı değiştir: sonuç hep 1! Çünkü <Tex tex="a^m \div a^m = 1" /> ve üs m − m = 0.</>,
      <>Change the base: the answer is always 1! Because <Tex tex="a^m \div a^m = 1" /> and m − m = 0.</>,
    ],
  };

  const scene = rule === "prod" ? <ProductScene a={a} m={m} n={n} />
    : rule === "quot" ? <QuotientScene a={a} m={m} n={n} />
    : rule === "pow" ? <PowerScene a={a} m={m} n={n} />
    : rule === "neg" ? <NegativeScene a={a} n={n} />
    : <ZeroScene a={a} m={mz} />;

  const mLabel = rule === "pow" ? ["iç üs", "inner power"] : rule === "zero" ? ["üs", "power"] : ["1. üs", "1st power"];
  const nLabel = rule === "pow" ? ["dış üs", "outer power"] : rule === "neg" ? ["üs", "power"] : ["2. üs", "2nd power"];
  const showM = rule !== "neg", showN = rule !== "zero";

  return (
    <LabShell title="Üs kuralları" titleEn="Laws of exponents" hint={hints[rule][0]} hintEn={hints[rule][1]}>
      <Choice options={RULES.map((r) => ({ value: r.value, tex: r.tex }))} value={rule} onChange={setRule} />
      <Plot width={W} height={H} grid={false} axes={false} label={`${R.tr} · ${R.en}: ${a} tabanlı kutucuklar · tiles of base ${a}`}>
        {scene}
        <Pill a={a} e={out.e} val={out.val} />
      </Plot>
      <Slider tex="a" label="taban" labelEn="base" value={a} min={2} max={5} step={1} onChange={setA} fmt={(v) => String(v)} color="var(--gold)" />
      {showM && <Slider tex="m" label={mLabel[0]} labelEn={mLabel[1]} value={rule === "zero" ? mz : m} min={rule === "zero" ? 1 : 0} max={5} step={1} onChange={setM} fmt={(v) => String(v)} color="var(--sky)" />}
      {showN && <Slider tex="n" label={nLabel[0]} labelEn={nLabel[1]} value={n} min={0} max={5} step={1} onChange={setN} fmt={(v) => String(v)} color="var(--violet)" />}
      <LiveTex tex={out.live} />
      <Readout items={[
        { label: R.tr, labelEn: R.en, tex: R.rule, color: "var(--gold)" },
        { label: "Üs", labelEn: "Exponent", tex: out.expTex, color: "var(--sky)" },
        (out.e >= 0 && !out.val.approx)
          ? { label: "Değer", labelEn: "Value", value: out.val.txt, color: "var(--mint)" }
          : { label: "Değer", labelEn: "Value", tex: out.valTex, color: "var(--mint)" },
      ]} />
    </LabShell>
  );
}
