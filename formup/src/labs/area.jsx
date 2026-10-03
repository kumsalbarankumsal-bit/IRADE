import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Curve, Area, Readout, LiveTex, Choice, usePlot, nf, tn } from "./kit.jsx";

/* Eğri altındaki alan: kesin integral ∫ₐᵇ f(x) dx = F(b) − F(a) ile Riemann toplamı (sol uç dikdörtgenleri)
   karşılaştırılır. Eksenin üstündeki alan yeşil (+), altındaki kırmızı (−): integral işaretli toplamdır,
   gerçek (geometrik) alan ise parçaların mutlak değerlerinin toplamı ∫|f| dx. Alttaki yarış çubukları
   Sₙ’nin n büyüdükçe integrale yaklaşmasını gösterir. */

const PI = Math.PI, TAU = 2 * PI, P12 = PI / 12;
const W = 340, H = 250, PAD = 6;
const MINUS = "−";
const NMAX = 40;

/* ---------- sayı yardımcıları ---------- */
const sn = (v, d = 2) => nf(v, d).replace("-", MINUS);
const ne = (v, d = 2) => sn(v, d).replace(",", ".");
const U = (s) => s.toLocaleUpperCase("tr");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const exact = (v, d = 2) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
const eqs = (v) => (exact(v) ? "=" : "\\approx");
const r2 = (v) => { const r = Math.round(v * 100) / 100; return Object.is(r, -0) ? 0 : r; };
const par = (T) => (T.startsWith("-") ? `(${T})` : T);

/** (n/d)·π → TeX (\tfrac), eğik çizgili TeX (3\pi/2) ve düz yazı */
function piFrac(n, d) {
  if (n === 0) return { tt: "0", sl: "0", txt: "0" };
  const g = gcd(n, d); n /= g; d /= g;
  const neg = n < 0, m = Math.abs(n), sg = neg ? "-" : "";
  const top = m === 1 ? "\\pi" : `${m}\\pi`, topT = m === 1 ? "π" : `${m}π`;
  if (d === 1) return { tt: sg + top, sl: sg + top, txt: (neg ? MINUS : "") + topT };
  return { tt: `${sg}\\tfrac{${top}}{${d}}`, sl: `${sg}${top}/${d}`, txt: `${neg ? MINUS : ""}${topT}/${d}` };
}

/* ---------- fonksiyonlar (sınırlar tamsayı adımlarla: x = k/4 ya da k·π/12) ---------- */
const FUNCS = {
  sq: { tex: "x^2", Ftex: "\\tfrac{x^3}{3}", f: (x) => x * x, F: (x) => x ** 3 / 3, roots: () => [],
    win: [-3, 3, -1.4, 7.4], lo: -10, hi: 10, a0: 0, b0: 8, n0: 4 },
  sin: { tex: "\\sin x", Ftex: "-\\cos x", f: Math.sin, F: (x) => -Math.cos(x), pi: true,
    roots: (a, b) => { const r = []; for (let k = Math.floor(a / PI) + 1; k * PI < b - 1e-9; k++) if (k * PI > a + 1e-9) r.push(k * PI); return r; },
    win: [-0.5, TAU + 0.5, -1.65, 1.65], lo: 0, hi: 24, a0: 0, b0: 18, n0: 6 },
  exp: { tex: "e^x", Ftex: "e^x", f: Math.exp, F: Math.exp, roots: () => [],
    win: [-2.8, 2.3, -0.9, 8.3], lo: -10, hi: 8, a0: -4, b0: 6, n0: 5 },
  inv: { tex: "\\tfrac{1}{x}", Ftex: "\\ln x", f: (x) => 1 / x, F: Math.log, roots: () => [], pos: true,
    win: [-0.4, 5.4, -0.7, 4.7], lo: 1, hi: 20, a0: 4, b0: 16, n0: 6 },
  cubic: { tex: "x^3-3x", itex: "(x^3-3x)", Ftex: "\\tfrac{x^4}{4}-\\tfrac{3x^2}{2}", f: (x) => x ** 3 - 3 * x, F: (x) => x ** 4 / 4 - 1.5 * x * x,
    roots: (a, b) => [-Math.sqrt(3), 0, Math.sqrt(3)].filter((r) => r > a + 1e-9 && r < b - 1e-9),
    win: [-2.4, 2.4, -2.75, 2.75], lo: -8, hi: 8, a0: -4, b0: 8, n0: 6 },
};
const xOf = (F, k) => (F.pi ? k * P12 : k / 4);
const kTex = (F, k) => (F.pi ? piFrac(k, 12).tt : tn(k / 4, 2));
const kSl = (F, k) => (F.pi ? piFrac(k, 12).sl : tn(k / 4, 2));
const kTxt = (F, k) => (F.pi ? piFrac(k, 12).txt : sn(k / 4, 2));

/* TeX içinde tema renkleri */
const TEX_CSS = ".lab .ar-i{color:var(--mint)}.lab .ar-s{color:var(--sky)}.lab .ar-t{color:var(--coral)}.lab .ar-b{color:var(--violet)}";
const C = (k, t) => `\\htmlClass{ar-${k}}{${t}}`;

const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3.4, strokeLinejoin: "round" };

/** Bütün hesaplar: kesin integral, parçalar (lobe), Riemann toplamı */
function compute(F, ka, kb, n) {
  const a = xOf(F, ka), b = xOf(F, kb), dx = (b - a) / n;
  const I = F.F(b) - F.F(a);
  const cuts = [a, ...F.roots(a, b), b];
  const lobes = [];
  for (let j = 0; j < cuts.length - 1; j++) {
    const p = cuts[j], q = cuts[j + 1], v = F.F(q) - F.F(p);
    // ağırlık merkezi (etiket yeri): x̄ = ∫x f / ∫f, ȳ = ½∫f² / ∫f
    let sf = 0, sxf = 0, sff = 0;
    const m = 80, h = (q - p) / m;
    for (let i = 0; i < m; i++) { const x = p + (i + 0.5) * h, y = F.f(x); sf += y * h; sxf += x * y * h; sff += 0.5 * y * y * h; }
    lobes.push({ p, q, v, cx: sf ? sxf / sf : (p + q) / 2, cy: sf ? sff / sf : 0 });
  }
  const tot = lobes.reduce((s, l) => s + Math.abs(l.v), 0);
  const ys = [];
  for (let i = 0; i < n; i++) ys.push(F.f(a + i * dx));
  const S = ys.reduce((s, y) => s + y, 0) * dx;
  return { a, b, dx, I, lobes, tot, ys, S };
}

/* ---------- sahne ---------- */
function Scene({ F, R, n }) {
  const { sx, sy, ix, xMin, xMax, yMin, yMax } = usePlot();
  const { a, b, dx, ys, lobes } = R;
  const Y0 = sy(0);
  const pxW = sx(a + dx) - sx(a);
  const thin = pxW < 6;
  const fPos = (x) => Math.max(0, F.f(x)), fNeg = (x) => Math.min(0, F.f(x));
  const span = yMax - yMin;
  const cy = (y) => sy(clamp(y, yMin - span, yMax + span));
  return (
    <g>
      {/* kesin alan: üstte yeşil, altta kırmızı */}
      <Area f={fPos} from={a} to={b} samples={200} color="var(--mint)" opacity={0.32} />
      <Area f={fNeg} from={a} to={b} samples={200} color="var(--coral)" opacity={0.32} />
      {/* Riemann dikdörtgenleri (sol uç) */}
      <g>
        {ys.map((y, i) => {
          const x = a + i * dx, top = cy(Math.max(0, y)), bot = cy(Math.min(0, y));
          return <rect key={i} x={sx(x)} y={top} width={Math.max(0.5, pxW)} height={Math.max(0.5, bot - top)}
            fill="var(--sky)" fillOpacity={thin ? 0.3 : 0.18} stroke={thin ? "none" : "var(--sky)"} strokeWidth="1.4" strokeLinejoin="round" />;
        })}
      </g>
      {/* sınırlar: kesikli mor çizgi + üstte yuvarlak rozet (yer varsa iç tarafta) */}
      {[[a, "a"], [b, "b"]].map(([x, t], i) => {
        const inner = sx(b) - sx(a) > 40;
        const dir = (i ? -1 : 1) * (inner ? 1 : -1);
        const bx = clamp(sx(x) + dir * 13, PAD + 12, W - PAD - 12);
        // rozet eğriye ve x eksenine binmesin: üstten alta adaylar
        const X0 = sx(clamp(0, xMin, xMax));
        const clear = (by) => Math.abs(by - Y0) > 24 && !(Math.abs(bx - X0 - 9) < 20 && by < PAD + 30) && [-10, -5, 0, 5, 10].every((d) => {
          const y = sy(F.f(ix(bx + d)));
          return !Number.isFinite(y) || Math.abs(y - by) > 18;
        });
        const by = [PAD + 18, PAD + 40, PAD + 62, H - PAD - 18, H - PAD - 40].find(clear) ?? PAD + 18;
        return (
          <g key={t} pointerEvents="none">
            <line x1={sx(x)} x2={sx(x)} y1={PAD + 4} y2={H - PAD - 4} stroke="var(--violet)" strokeWidth="1.6" strokeDasharray="5 4" opacity="0.85" />
            <circle cx={bx} cy={by} r="9.5" fill="var(--plot-bg)" />
            <circle cx={bx} cy={by} r="9.5" fill="var(--violet)" fillOpacity="0.16" stroke="var(--violet)" strokeWidth="1.4" />
            <text x={bx} y={by + 4.5} fontSize="13.5" fontWeight="700" fontStyle="italic" fontFamily="KaTeX_Math, serif" textAnchor="middle" fill="var(--violet)">{t}</text>
          </g>
        );
      })}
      {/* eğri */}
      <Curve f={F.f} samples={420} color="var(--gold)" width={3} />
      {/* örnek noktaları (sol uçlar) */}
      {n <= 20 && ys.map((y, i) => (Number.isFinite(y) && y >= yMin && y <= yMax
        ? <circle key={"p" + i} cx={sx(a + i * dx)} cy={sy(y)} r={n <= 10 ? 3.6 : 2.6} fill="var(--sky)" stroke="var(--plot-bg)" strokeWidth="1.5" /> : null))}
      {/* parça etiketleri: +2 / −1 */}
      {lobes.map((l, i) => {
        if (sx(l.q) - sx(l.p) < 26 || Math.abs(l.v) < 0.005) return null;
        const txt = `${l.v > 0 ? "+" : MINUS}${nf(Math.abs(l.v), 2)}`;
        const tw = txt.length * 7.2 + 10, th = 19, col = l.v > 0 ? "var(--mint)" : "var(--coral)";
        const pos = l.v > 0;
        // hap bölgenin içine sığıyor mu? (eğriden ve eksenden uzak) — önce ağırlık merkezi, sonra bölge boyunca tara
        const fitAt = (lx) => {
          if (ix(lx - tw / 2 - 2) < l.p || ix(lx + tw / 2 + 2) > l.q) return null;
          let inner = pos ? -Infinity : Infinity;
          for (let d = -tw / 2 - 2; d <= tw / 2 + 2; d += 3) {
            const y = sy(F.f(ix(lx + d)));
            if (!Number.isFinite(y)) return null;
            inner = pos ? Math.max(inner, y) : Math.min(inner, y);
          }
          const room = pos ? Y0 - inner : inner - Y0;
          if (room < th + 9) return null;
          return pos ? clamp(sy(l.cy), inner + th / 2 + 5, Y0 - th / 2 - 3) : clamp(sy(l.cy), Y0 + th / 2 + 3, inner - th / 2 - 5);
        };
        const cands = [sx(l.cx)];
        for (const t of [0.5, 0.62, 0.38, 0.74, 0.26, 0.86, 0.14]) cands.push(sx(l.p + t * (l.q - l.p)));
        let lx = null, ly = null;
        for (const c of cands) { const y = fitAt(c); if (y != null) { lx = c; ly = y; break; } }
        if (lx == null) {
          // sığmıyor: bölgenin dışına, eğrinin öte yanına
          lx = clamp(sx(l.cx), PAD + tw / 2 + 2, W - PAD - tw / 2 - 2);
          let outer = pos ? Infinity : -Infinity;
          for (let d = -tw / 2 - 2; d <= tw / 2 + 2; d += 3) { const y = sy(F.f(ix(lx + d))); if (Number.isFinite(y)) outer = pos ? Math.min(outer, y) : Math.max(outer, y); }
          ly = pos ? outer - 15 : outer + 15;
        }
        lx = clamp(lx, PAD + tw / 2 + 2, W - PAD - tw / 2 - 2);
        ly = clamp(ly, PAD + 12, H - PAD - 12);
        return (
          <g key={"l" + i} pointerEvents="none">
            <rect x={lx - tw / 2} y={ly - th / 2} width={tw} height={th} rx={th / 2} fill="var(--plot-bg)" opacity="0.92" />
            <rect x={lx - tw / 2} y={ly - th / 2} width={tw} height={th} rx={th / 2} fill={col} fillOpacity="0.16" stroke={col} strokeWidth="1.5" />
            <text x={lx} y={ly + 4.3} fontSize="12" fontWeight="800" textAnchor="middle" fill={col}>{txt}</text>
          </g>
        );
      })}
      {Y0 > PAD && Y0 < H - PAD && <line x1={PAD} x2={W - PAD} y1={Y0} y2={Y0} stroke="var(--ink-3)" strokeWidth="1.4" />}
    </g>
  );
}

/** Lejant kutucuğu */
function Box({ color, outline }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" style={{ flex: "none" }}>
      <rect x="1" y="1" width="14" height="10" rx="3" fill={color} fillOpacity={outline ? 0.18 : 0.45} stroke={outline ? color : "none"} strokeWidth="1.5" />
    </svg>
  );
}

/** sin x için π cinsinden eksenler */
function PiAxes() {
  const { sx, sy, xMin, xMax, yMin, yMax } = usePlot();
  const X0 = sx(clamp(0, xMin, xMax)), Y0 = sy(clamp(0, yMin, yMax));
  const xs = [];
  for (let j = Math.ceil(xMin / (PI / 2)); j * (PI / 2) <= xMax; j++) if (j !== 0) xs.push(j);
  const ys = [];
  for (let v = Math.ceil(yMin); v <= yMax; v++) if (v !== 0) ys.push(v);
  return (
    <g>
      <line x1={PAD} x2={W - PAD} y1={Y0} y2={Y0} stroke="var(--ink-3)" strokeWidth="1.4" />
      <line x1={X0} x2={X0} y1={PAD} y2={H - PAD} stroke="var(--ink-3)" strokeWidth="1.4" />
      {xs.map((j) => <text key={j} x={sx(j * PI / 2)} y={Y0 + 13} fontSize="9.5" textAnchor="middle" fill="var(--ink-3)" fontWeight="600">{piFrac(j, 2).txt}</text>)}
      {ys.map((v) => <text key={v} x={X0 - 5} y={sy(v) + 3} fontSize="9.5" textAnchor="end" fill="var(--ink-3)" fontWeight="600">{sn(v, 0)}</text>)}
      <text x={W - PAD - 2} y={Y0 - 5} fontSize="11" textAnchor="end" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">x</text>
      <text x={X0 + 6} y={PAD + 11} fontSize="11" fill="var(--ink-2)" fontStyle="italic" fontFamily="KaTeX_Math, serif">y</text>
    </g>
  );
}

/** Yarış çubukları: Sₙ (mavi) integrale (yeşil hedef çizgisi) ne kadar yakın? */
function Race({ S: S0, I: I0, n, tot }) {
  const BW = 340, BH = 58, L = 44, Rr = 54;
  const z0 = (v) => (Math.abs(v) < 1e-9 ? 0 : v);              // kayan nokta gürültüsü (1e-16) → 0
  const S = z0(S0), I = z0(I0);
  // ölçek: değerler küçükse bile toplam alana göre (ör. I = 0, S = −0,2 küçük görünsün)
  let lo = Math.min(0, S, I), hi = Math.max(0, S, I);
  const need = Math.max(0.6 * tot, 0.5);
  if (hi - lo < need) {
    if (lo >= 0 && I > 0) hi = lo + need;
    else if (hi <= 0 && I < 0) lo = hi - need;
    else { const ext = (need - (hi - lo)) / 2; lo -= ext; hi += ext; }
  }
  const span = hi - lo;
  const px = (v) => L + ((v - lo) / span) * (BW - L - Rr);
  const z = px(0);
  const bar = (v, y, color, label, sub) => {
    const x1 = Math.min(z, px(v)), w = Math.abs(px(v) - z);
    const txt = sn(v, 2), tw = txt.length * 7 + 4;
    // değer yazısı: çubuğun içine sığarsa içte, değilse dış uçta; solda yer yoksa sıfırın sağında
    let tx, anchor, fill = color, inside = false;
    if (w >= tw + 12) { inside = true; fill = "var(--plot-bg)"; tx = v >= 0 ? px(v) - 6 : px(v) + 6; anchor = v >= 0 ? "end" : "start"; }
    else if (v >= 0) { tx = px(v) + 6; anchor = "start"; }
    else if (px(v) - tw - 6 >= L) { tx = px(v) - 6; anchor = "end"; }
    else { tx = z + 6; anchor = "start"; }
    return (
      <g>
        <text x={L - 10} y={y + 5} fontSize="12.5" fontWeight="800" textAnchor="end" fill={color}>{label}<tspan fontSize="9" dy="3">{sub}</tspan></text>
        <rect x={x1} y={y - 8} width={Math.max(w, 1.5)} height="16" rx="5" fill={color} fillOpacity="0.9" />
        <text x={tx} y={y + 4.5} fontSize="11.5" fontWeight="800" textAnchor={anchor} fill={fill} style={inside ? undefined : halo}>{txt}</text>
      </g>
    );
  };
  return (
    <svg className="lab-plot" viewBox={`0 0 ${BW} ${BH}`} role="img" aria-label={`Riemann toplamı · Riemann sum S${n} = ${nf(S, 2)}, integral = ${nf(I, 2)}`}>
      <rect x="0" y="0" width={BW} height={BH} rx="14" fill="var(--plot-bg)" />
      <line x1={z} x2={z} y1="8" y2={BH - 8} stroke="var(--ink-3)" strokeWidth="1.2" />
      <line x1={px(I)} x2={px(I)} y1="8" y2={BH - 8} stroke="var(--mint)" strokeWidth="1.6" strokeDasharray="3 3" />
      {bar(I, 19, "var(--mint)", "∫", "")}
      {bar(S, 40, "var(--sky)", "S", String(n))}
    </svg>
  );
}

function hintFor(F, fn, R, n, last) {
  const { I, tot, S, lobes } = R;
  const err = Math.abs(S - I);
  const neg = lobes.some((l) => l.v < -0.005) && lobes.some((l) => l.v > 0.005);
  const allNeg = lobes.length && lobes.every((l) => l.v <= 0) && I < -0.005;
  if (neg && last !== "n") return [`Eksenin ALTINDAKİ alan (kırmızı) integrale EKSİ girer: ∫ = ${sn(I)}, ama boyalı alanın tamamı ${sn(tot)}. Gerçek alan için parçaları ayrı ayrı topla: ∫|f| dx.`,
    `Area BELOW the x-axis (red) counts as NEGATIVE: ∫ = ${ne(I)}, but the whole shaded area is ${ne(tot)}. For the real area, add the pieces separately: ∫|f| dx.`];
  if (allNeg && last !== "n") return [`Bütün alan eksenin altında, bu yüzden integral negatif (${sn(I)}). Alan ise pozitif: ${sn(tot)}.`,
    `All of the area is below the x-axis, so the integral is negative (${ne(I)}). The area itself is positive: ${ne(tot)}.`];
  if (last === "n" || last === null) {
    if (err < 0.005 && n > 1) return [`n = ${n}: fark 0! Burada dikdörtgenlerin taşan ve eksik kalan parçaları birbirini tam götürüyor. Başka bir n dene: fark yine küçük ama 0 olmayabilir.`,
      `n = ${n}: the error is 0! Here the bits the rectangles add and miss cancel out exactly. Try another n: the error is small but may not be 0.`];
    if (n === 1) return ["Tek bir dikdörtgen: kaba bir tahmin! n’yi sağa çek ve mavi çubuğun yeşil hedefe koşmasını izle.",
      "One single rectangle: a rough guess! Drag n to the right and watch the blue bar race to the green target."];
    if (n < NMAX) return [`n = ${n} dikdörtgenle fark ${sn(err)}. n’yi artır: dikdörtgenler inceldikçe boşluklar küçülür, Sₙ integrale yaklaşır. İntegral = sonsuz ince dikdörtgenlerin toplamı!`,
      `With n = ${n} rectangles the error is ${ne(err)}. Increase n: thinner rectangles leave smaller gaps and Sₙ gets closer to the integral. An integral = the sum of infinitely thin rectangles!`];
    return [`n = ${n}: fark artık sadece ${sn(err)}. n → ∞ giderken toplam tam olarak ∫ₐᵇ f(x) dx = ${sn(I)} olur.`,
      `n = ${n}: the error is only ${ne(err)} now. As n → ∞ the sum becomes exactly ∫ₐᵇ f(x) dx = ${ne(I)}.`];
  }
  if (fn === "inv") return [`1/x’in ters türevi ln x: ∫ = ln b − ln a = ${sn(I)}. a ya da b’yi oynat ve ln’in nasıl büyüdüğüne bak.`,
    `The antiderivative of 1/x is ln x: ∫ = ln b − ln a = ${ne(I)}. Move a or b and see how ln grows.`];
  if (fn === "sin") return ["b’yi π’nin ötesine çek: sin x eksenin altına iner ve kırmızı alan integrali küçültmeye başlar. b = 2π’de integral tam 0!",
    "Drag b past π: sin x dips below the axis and the red area starts to cancel the integral. At b = 2π the integral is exactly 0!"];
  return ["a ve b alanın başladığı ve bittiği çizgiler (mor). Sınırları kaydır, sonra n’yi artırıp dikdörtgenlerin eğriye yapışmasını izle.",
    "a and b are where the area starts and stops (purple lines). Move them, then increase n and watch the rectangles hug the curve."];
}

export default function AreaLab() {
  const [fn, setFnRaw] = useState("sq");
  const F = FUNCS[fn];
  const [ka, setKa] = useState(F.a0);
  const [kb, setKb] = useState(F.b0);
  const [n, setNraw] = useState(F.n0);
  const [last, setLast] = useState(null);
  const setFn = (v) => { const G = FUNCS[v]; setFnRaw(v); setKa(G.a0); setKb(G.b0); setNraw(G.n0); setLast("fn"); };
  const setA = (v) => { setKa(Math.min(Math.round(v), kb - 1)); setLast("a"); };
  const setB = (v) => { setKb(Math.max(Math.round(v), ka + 1)); setLast("b"); };
  const setN = (v) => { setNraw(Math.round(v)); setLast("n"); };

  const R = useMemo(() => compute(F, ka, kb, n), [F, ka, kb, n]);
  const { a, b, I, S, tot, lobes, ys } = R;
  const err = Math.abs(S - I);
  const signed = lobes.length > 1 || lobes.some((l) => l.v < -0.005);

  const live = useMemo(() => {
    const A = kSl(F, ka), B = kSl(F, kb);
    const Fa = F.F(a), Fb = F.F(b);
    const rows = [];
    rows.push(`\\displaystyle\\int_{${A}}^{${B}} ${F.itex || F.tex}\\,dx = \\Big[${F.Ftex}\\Big]_{${A}}^{${B}}`);
    rows.push(`${exact(Fa) && exact(Fb) ? "=" : "\\approx"} ${tn(r2(Fb))} - ${par(tn(r2(Fa)))} ${eqs(I)} ${C("i", tn(r2(I)))}`);
    // Δx ve Sₙ = Δx·(f(x₀) + … + f(xₙ₋₁))
    const dxT = F.pi ? piFrac(kb - ka, 12 * n).tt : tn(r2((b - a) / n), 3);
    const dxEq = F.pi || exact((b - a) / n, 3) ? "=" : "\\approx";
    const vals = ys.map((y) => r2(y));
    const term = (v, first) => (first ? `{${tn(v)}}` : v < 0 ? `- ${tn(-v)}` : `+ ${tn(v)}`);
    const list = n <= 4 ? vals.map((v, i) => term(v, i === 0)).join(" ")
      : `${term(vals[0], true)} ${term(vals[1], false)} + \\dots ${term(vals[n - 1], false)}`;
    rows.push(`\\begin{aligned} \\Delta x &= \\tfrac{${kSl(F, kb)} - ${par(kSl(F, ka))}}{${n}} ${dxEq} ${dxT} \\\\[3pt] ${C("s", `S_{${n}}`)} &= ${dxT}\\,\\big(${list}\\big) ${eqs(S)} ${C("s", tn(r2(S)))} \\end{aligned}`);
    if (signed) {
      const parts = lobes.filter((l) => Math.abs(l.v) >= 0.005).map((l) => tn(r2(Math.abs(l.v))));
      rows.push(`\\displaystyle\\int_{${A}}^{${B}} |f|\\,dx = ${parts.join(" + ")} ${eqs(tot)} ${C("t", tn(r2(tot)))}`);
    }
    return `\\begin{array}{c} ${rows.join(" \\\\[7pt] ")} \\end{array}`;
  }, [F, ka, kb, n, a, b, I, S, tot, lobes, ys, signed]);

  const [hint, hintEn] = hintFor(F, fn, R, n, last);
  const [xMin, xMax, yMin, yMax] = F.win;
  const pct = Math.abs(I) > 0.05 ? `\\ (\\%${tn((err / Math.abs(I)) * 100, 1)})` : "";

  return (
    <LabShell title="Eğri altındaki alan" titleEn="Area under a curve" hint={hint} hintEn={hintEn}>
      <style>{TEX_CSS}</style>
      <Choice options={Object.entries(FUNCS).map(([value, o]) => ({ value, tex: o.tex }))} value={fn} onChange={setFn} />
      <Plot xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} width={W} height={H} xStep={F.pi ? PI / 2 : 1} yStep={1} axes={!F.pi}
        label={`y = f(x) eğrisi altında a = ${kTxt(F, ka)} ile b = ${kTxt(F, kb)} arası alan · area between a and b; integral ${nf(I, 2)}, Riemann S${n} = ${nf(S, 2)}`}>
        {F.pi && <PiAxes />}
        <Scene F={F} R={R} n={n} />
      </Plot>
      <Race S={S} I={I} n={n} tot={tot} />
      <div className="legend" style={{ marginTop: -4 }}>
        <span><Box color="var(--mint)" />üstte (+) <span className="en">above</span></span>
        <span><Box color="var(--coral)" />altta (−) <span className="en">below</span></span>
        <span><Box color="var(--sky)" outline />dikdörtgen <span className="en">rectangle</span></span>
      </div>
      <Slider tex="a" label="alt sınır" labelEn="lower limit" value={ka} min={F.lo} max={F.hi} step={1} onChange={setA} fmt={(k) => kTxt(F, k)} color="var(--violet)" />
      <Slider tex="b" label="üst sınır" labelEn="upper limit" value={kb} min={F.lo} max={F.hi} step={1} onChange={setB} fmt={(k) => kTxt(F, k)} color="var(--violet)" />
      <Slider tex="n" label="dikdörtgen sayısı" labelEn="number of rectangles" value={n} min={1} max={NMAX} step={1} onChange={setN} fmt={(v) => String(v)} color="var(--sky)" />
      <LiveTex tex={live} />
      <Readout items={[
        { label: U("kesin integral"), labelEn: "exact integral", tex: `I = \\int_a^b f\\,dx ${eqs(I)} ${tn(r2(I))}`, color: "var(--mint)" },
        { label: "RIEMANN TOPLAMI", labelEn: "Riemann sum", tex: `S_{${n}} ${eqs(S)} ${tn(r2(S))}`, color: "var(--sky)" },
        { label: U("fark"), labelEn: "error", tex: `|S_{${n}} - I| ${eqs(err)} ${tn(r2(err))}${pct}`, color: "var(--gold)" },
        { label: U("toplam alan"), labelEn: "total area", tex: `\\int_a^b |f|\\,dx ${eqs(tot)} ${tn(r2(tot))}`, color: signed ? "var(--coral)" : "var(--mint)" },
      ]} />
    </LabShell>
  );
}
