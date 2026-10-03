import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Readout, LiveTex, Choice, usePlot, nf, tn } from "./kit.jsx";

/* Yay uzunluğu ve daire dilimi: l = rθ, A = ½r²θ.
   Radyanın anlamı: yay üzerindeki her çentik bir yarıçap boyu. θ kaç radyansa yay o kadar yarıçap uzunluğunda.
   Alttaki şerit yayı düzleştirir: tüm şerit çevre (2πr ≈ 6,28 yarıçap), boyalı kısım yay = dilimin dairedeki payı. */

const W = 340, H = 244, PAD = 6, S = 23;   // S: birim başına piksel (sabit ölçek: r büyüyünce daire büyür)
const CX = 170, CY = 132;                   // merkez (piksel)
const TAU = 2 * Math.PI, STEP = Math.PI / 36, DEG = Math.PI / 180;
const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3.2, strokeLinejoin: "round" };
const TEX_CSS = ".lab .tx-coral{color:var(--coral)}.lab .tx-sky{color:var(--sky)}.lab .tx-mint{color:var(--mint)}";
const tc = (c, t) => `\\htmlClass{tx-${c}}{${t}}`;

const PRESETS = [
  { value: "1", th: 1, tex: "1\\,\\text{rad}" },
  { value: "p3", th: Math.PI / 3, tex: "\\pi/3" },
  { value: "p2", th: Math.PI / 2, tex: "\\pi/2" },
  { value: "p", th: Math.PI, tex: "\\pi" },
  { value: "2p", th: TAU, tex: "2\\pi" },
];

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const isRound = (v, k) => Math.abs(v * 10 ** k - Math.round(v * 10 ** k)) < 1e-6;
/** n/d·sym biçimi (sadeleştirilmiş) */
function coef(n, d, sym = "\\pi", frac = "\\dfrac") {
  if (n === 0) return "0";
  const g = gcd(n, d); n /= g; d /= g;
  const top = n === 1 && sym ? sym : `${n}${sym}`;
  return d === 1 ? top : `${frac}{${top}}{${d}}`;
}
/** θ hakkında: ızgara (5°’lik) değeri mi, π kesri olarak yazılabilir mi, 1 radyan mı */
function angleInfo(th) {
  const k = Math.round(th / STEP);
  const grid = Math.abs(th - k * STEP) < 1e-9;
  const one = Math.abs(th - 1) < 1e-12;
  const g = grid ? gcd(k, 36) : 1;
  const p = grid ? k / g : 0, q = grid ? 36 / g : 0;   // θ = (p/q)π
  return { k, grid, one, p, q, pi: grid && q <= 12, deg: grid ? k * 5 : th / DEG };
}

/* Basit kutu çakışma testi: [x0, y0, x1, y1] */
const hit = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
const box = (x, y, w, anchor = "middle") => {
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return [x0, y - 10, x0 + w, y + 3];
};
const tw = (s, size = 12) => s.length * size * 0.6;
/** SVG içinde değişken harfi: italik matematik yazısı (ör. l, r, A — “l” büyük “I” ile karışmasın) */
const V = ({ children }) => <tspan fontFamily="KaTeX_Math, serif" fontStyle="italic" fontWeight="700" fontSize="1.12em">{children}</tspan>;

function Sector({ r, th }) {
  const { sx, sy } = usePlot();
  const O = [sx(0), sy(0)], R = r * S;
  const pt = (a, rad = R) => [O[0] + rad * Math.cos(a), O[1] - rad * Math.sin(a)];
  const P = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const full = th >= TAU - 1e-9, none = th < 1e-9;
  const large = th > Math.PI ? 1 : 0;
  const E = pt(th);

  // θ etiketi: açının başlangıcına yakın, yayın hemen dışında
  const ar = Math.min(16, R * 0.3);
  const phi = Math.min(th / 2, 0.42);
  const rhoT = Math.max(ar + 10, 6.5 / Math.sin(Math.max(phi, 1e-3)));
  const thIn = !none && rhoT <= R * 0.62;
  const thXY = thIn ? [pt(phi, rhoT)[0], pt(phi, rhoT)[1] + 4.5, "middle"] : [O[0] - 8, O[1] + 4.5, "end"];
  // küçük dairede geniş açıda θ yazısı halkaya biner: o zaman yalnızca yeşil yay kalır
  const thShow = !none && (thIn || !(R < 40 && th > Math.PI / 2));
  const thBox = thShow ? box(thXY[0], thXY[1], 10, thXY[2]) : [0, 0, 0, 0];
  // r yazısı: küçük dairede dairenin altına
  const rY = R < 45 ? O[1] + R + 15 : O[1] + 16;

  // A etiketi: açıortay üzerinde, dilimin içine sığarsa
  const aTxt = `A = ${nf(0.5 * r * r * th, 2)}`;
  const aW = tw(aTxt, 12);
  let aXY = null;
  if (!none) {
    const m = th / 2;
    for (const f of [0.5, 0.58, 0.66, 0.74]) {
      const c = pt(m, f * R);
      const b = box(c[0], c[1] + 4, aW);
      const corners = [[b[0], b[1]], [b[2], b[1]], [b[0], b[3]], [b[2], b[3]]].map(([x, y]) => [x - O[0], O[1] - y]);
      // her köşe çemberin içinde ve iki yarıçap çizgisinden en az 5 px uzakta olmalı
      const ok = corners.every(([x, y]) => {
        if (Math.hypot(x, y) > R - 4) return false;
        if (full) return true;
        const fromStart = y;                                        // başlangıç yarıçapına (x ekseni) uzaklık
        const fromEnd = x * Math.sin(th) - y * Math.cos(th);        // bitiş yarıçapına işaretli uzaklık
        return th <= Math.PI ? fromStart >= 5 && fromEnd >= 5 : fromStart >= 5 || fromEnd >= 5;
      });
      if (ok && !hit(b, thBox)) { aXY = [c[0], c[1] + 4]; break; }
    }
  }

  // yay etiketi (dışarıda, yayın ortasında)
  const m = th / 2, L = pt(m, R + 11);
  const cm = Math.cos(m), sm = Math.sin(m);
  const lAnchor = cm > 0.35 ? "start" : cm < -0.35 ? "end" : "middle";
  const lY = L[1] + 4 - 6 * sm;

  // çentikler: her biri bir yarıçap boyu (1 rad)
  const ticks = [];
  for (let k = 1; k <= th + 1e-9 && k <= 6; k++) {
    const a = pt(k, R - 6), b = pt(k, R + 6);
    ticks.push(<line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />);
  }

  const S0 = pt(0);
  return (
    <g>
      <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.8" />
      {!none && (full
        ? <circle cx={O[0]} cy={O[1]} r={R} fill="var(--gold)" fillOpacity="0.26" />
        : <path d={`M${P(O)} L${P(S0)} A${R},${R} 0 ${large} 0 ${P(E)} Z`} fill="var(--gold)" fillOpacity="0.26" />)}
      {!none && (full
        ? <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke="var(--coral)" strokeWidth="5" />
        : <path d={`M${P(S0)} A${R},${R} 0 ${large} 0 ${P(E)}`} fill="none" stroke="var(--coral)" strokeWidth="5" strokeLinecap="round" />)}
      {ticks}
      {/* yarıçaplar */}
      <line x1={O[0]} y1={O[1]} x2={S0[0]} y2={S0[1]} stroke="var(--sky)" strokeWidth="3.2" strokeLinecap="round" />
      {!none && !full && <line x1={O[0]} y1={O[1]} x2={E[0]} y2={E[1]} stroke="var(--sky)" strokeWidth="3.2" strokeLinecap="round" />}
      {/* θ yayı */}
      {!none && (full
        ? <circle cx={O[0]} cy={O[1]} r={ar} fill="none" stroke="var(--mint)" strokeWidth="2.2" />
        : <path d={`M${P(pt(0, ar))} A${ar},${ar} 0 ${large} 0 ${P(pt(th, ar))}`} fill="none" stroke="var(--mint)" strokeWidth="2.2" />)}
      <circle cx={O[0]} cy={O[1]} r="3" fill="var(--ink)" />
      {/* etiketler */}
      <text x={O[0] + R / 2} y={rY} fontSize="12" fontWeight="800" textAnchor="middle" fill="var(--sky)" style={halo}><V>r</V> = {nf(r, 1)}</text>
      {thShow && <text x={thXY[0]} y={thXY[1]} fontSize="13.5" fontWeight="800" fontStyle="italic" textAnchor={thXY[2]} fill="var(--mint)" style={halo}>θ</text>}
      {aXY && <text x={aXY[0]} y={aXY[1]} fontSize="12" fontWeight="800" textAnchor="middle" fill="var(--ink)" style={halo}><V>A</V>{aTxt.slice(1)}</text>}
      {!none && <text x={L[0]} y={lY} fontSize="12" fontWeight="800" textAnchor={lAnchor} fill="var(--coral)" style={halo}><V>l</V> = {nf(r * th, 2)}</text>}
    </g>
  );
}

/** Düzleştirilmiş yay: şeridin tamamı çevre 2πr, her çentik bir r */
function ArcStrip({ r, th }) {
  const X0 = 14, X1 = 326, L = X1 - X0, Y = 22, BH = 20;
  const unit = L / TAU;               // bir yarıçapın şeritteki boyu
  const w = (th / TAU) * L;
  const lTxt = `l = ${nf(r * th, 2)}`;
  const inside = w >= tw(lTxt, 11.5) + 12;
  const notches = [];
  for (let k = 1; k <= 6; k++) {
    const x = X0 + k * unit, on = k <= th + 1e-9;
    notches.push(
      <g key={k}>
        <line x1={x} x2={x} y1={Y} y2={Y + BH} stroke={on ? "var(--ink)" : "var(--ink-3)"} strokeWidth="1" opacity="0.3" />
        <line x1={x} x2={x} y1={Y - 4} y2={Y + 1} stroke={on ? "var(--ink)" : "var(--ink-3)"} strokeWidth={on ? 2 : 1.2} />
        <line x1={x} x2={x} y1={Y + BH - 1} y2={Y + BH + 4} stroke={on ? "var(--ink)" : "var(--ink-3)"} strokeWidth={on ? 2 : 1.2} />
        <text x={x} y={Y + BH + 14} fontSize="10.5" fontWeight="700" textAnchor="middle" fill={on ? "var(--ink-2)" : "var(--ink-3)"}>{k === 1 ? "r" : `${k}r`}</text>
      </g>
    );
  }
  return (
    <svg className="lab-plot" viewBox="0 0 340 64" role="img"
      aria-label={`Düzleştirilmiş yay · arc unrolled: l = ${nf(r * th, 2)}, çevre · circumference 2πr = ${nf(TAU * r, 2)}`}>
      <rect x="0" y="0" width="340" height="64" rx="14" fill="var(--plot-bg)" />
      <text x={X0} y="15" fontSize="11.5" fontWeight="800" fill="var(--ink-2)">Yayı düzleştir<tspan fontWeight="600" fill="var(--ink-3)"> · arc unrolled</tspan></text>
      <text x={X1} y="15" fontSize="11" fontWeight="700" textAnchor="end" fill="var(--ink-3)">2πr = {nf(TAU * r, 2)}</text>
      <rect x={X0} y={Y} width={L} height={BH} rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1.3" strokeDasharray="4 3" />
      {w > 0.5 && <rect x={X0} y={Y} width={w} height={BH} rx="6" fill="var(--coral)" fillOpacity="0.28" stroke="var(--coral)" strokeWidth="1.8" />}
      {notches}
      {w > 0.5 && (inside
        ? <text x={X0 + w / 2} y={Y + 14.5} fontSize="11.5" fontWeight="800" textAnchor="middle" fill="var(--ink)" style={halo}><V>l</V>{lTxt.slice(1)}</text>
        : <text x={X0 + w + 5} y={Y + 14.5} fontSize="11.5" fontWeight="800" textAnchor="start" fill="var(--coral)" style={halo}><V>l</V>{lTxt.slice(1)}</text>)}
    </svg>
  );
}

function hintFor(info, r, th) {
  if (th < 1e-9) return ["Açı kaydırıcısını sağa çek: dilim açılır, yay uzar.", "Drag the angle slider right: the sector opens and the arc grows."];
  if (info.one) return [`Tam 1 radyan: yay, yarıçapla aynı uzunlukta (l = r = ${nf(r, 1)})! Bu yüzden 1 rad ≈ 57,3°.`,
    `Exactly 1 radian: the arc is as long as the radius (l = r = ${nf(r, 1)})! That’s why 1 rad ≈ 57.3°.`];
  if (info.grid && info.k === 72) return ["Tam daire: 2π rad = 360°. Yay = çevre 2πr, alan = πr². Yarıçap çembere 2π ≈ 6,28 kez sığar!",
    "Full circle: 2π rad = 360°. Arc = circumference 2πr, area = πr². The radius fits around the circle 2π ≈ 6.28 times!"];
  if (info.grid && info.k === 36) return ["Yarım daire: π rad = 180°. Yay = πr, alan = ½πr². Şimdi r’yi iki katına çıkar: yay 2 kat, alan 4 kat büyür!",
    "Half circle: π rad = 180°. Arc = πr, area = ½πr². Now double r: the arc doubles but the area grows 4 times!"];
  if (info.grid && info.k === 18) return ["Çeyrek daire: π/2 = 90°. Dilim, dairenin ¼’ü: A = ¼·πr².",
    "Quarter circle: π/2 = 90°. The sector is ¼ of the circle: A = ¼·πr²."];
  const n = nf(th, 2);
  return [`Yaydaki her küçük çentik bir yarıçap boyu. θ = ${n} rad → yay ${n} yarıçap uzunluğunda (l = rθ). “1 rad” düğmesine bas!`,
    `Each little notch on the arc is one radius long. θ = ${n.replace(",", ".")} rad → the arc is ${n.replace(",", ".")} radii long (l = rθ). Tap “1 rad”!`];
}

export default function CircleLab() {
  const [r, setR] = useState(3);
  const [th, setTh] = useState((2 * Math.PI) / 3);
  const info = useMemo(() => angleInfo(th), [th]);
  const l = r * th, A = 0.5 * r * r * th;
  const R2 = Math.round(r * 2);   // r = R2/2

  /* TeX parçaları */
  const thT = info.one ? "1" : info.pi ? coef(info.p, info.q) : tn(th, 2);
  const rT = tn(r, 1);
  const r2T = Number.isInteger(r) ? `${rT}^2` : `(${rT})^2`;
  const degT = info.grid ? `${info.deg}^\\circ` : `${tn(info.deg, 1)}^\\circ`;
  let thLine;
  if (th < 1e-9) thLine = `\\theta = 0`;
  else if (info.one) thLine = `\\theta = 1\\ \\text{rad} \\approx ${degT}`;
  else if (info.pi) thLine = `\\theta = ${thT} \\approx ${tn(th, 2)}\\ \\text{rad} = ${degT}`;
  else thLine = `\\theta \\approx ${tn(th, 2)}\\ \\text{rad} = ${degT}`;
  const tail = (exactPi, v) => `${exactPi ? `= ${exactPi} ` : ""}${isRound(v, 2) ? "=" : "\\approx"} ${tn(v, 2)}`;
  const lPi = info.pi && th > 1e-9 ? coef(R2 * info.p, 2 * info.q) : null;
  const aPi = info.pi && th > 1e-9 ? coef(R2 * R2 * info.p, 8 * info.q) : null;
  const eq0 = info.pi || info.one ? "=" : "\\approx";
  const lLine = `${tc("coral", "l")} = ${tc("sky", "r")}${tc("mint", "\\theta")} ${eq0} ${tc("sky", rT)}\\cdot ${tc("mint", thT)} ${tail(lPi, l)}`;
  const aLine = `A = \\tfrac12 ${tc("sky", "r")}^2${tc("mint", "\\theta")} ${eq0} \\tfrac12\\cdot ${tc("sky", r2T)}\\cdot ${tc("mint", thT)} ${tail(aPi, A)}`;
  const live = `\\begin{array}{l}${thLine}\\\\[6pt]${lLine}\\\\[6pt]${aLine}\\end{array}`;

  /* dairenin kesri */
  const share = th / TAU;
  let shareT;
  if (info.grid) {
    const g = gcd(info.k, 72), n = info.k / g, d = 72 / g;
    shareT = d <= 24 ? `${d === 1 ? n : `\\tfrac{${n}}{${d}}`}\\ (\\%${tn(share * 100, 1)})` : `\\%${tn(share * 100, 1)}`;
  } else shareT = `\\approx \\%${tn(share * 100, 1)}`;

  const preset = PRESETS.find((p) => Math.abs(p.th - th) < 1e-9);
  const [hint, hintEn] = hintFor(info, r, th);

  return (
    <LabShell title="Yay uzunluğu ve daire dilimi" titleEn="Arc length and sector area" hint={hint} hintEn={hintEn}>
      <style>{TEX_CSS}</style>
      <Plot xMin={-(CX - PAD) / S} xMax={(W - PAD - CX) / S} yMin={-(H - PAD - CY) / S} yMax={(CY - PAD) / S}
        width={W} height={H} grid axes={false} xStep={1} yStep={1}
        label={`Daire dilimi · sector: r = ${nf(r, 1)}, θ = ${nf(th, 2)} rad, yay · arc ${nf(l, 2)}, alan · area ${nf(A, 2)}`}>
        <Sector r={r} th={th} />
      </Plot>
      <ArcStrip r={r} th={th} />
      <Slider tex="r" label="yarıçap" labelEn="radius" value={r} min={1} max={4} step={0.5} onChange={setR} fmt={(v) => nf(v, 1)} color="var(--sky)" />
      <Slider tex="\theta" label="açı" labelEn="angle" value={th} min={0} max={TAU} step={STEP}
        onChange={(v) => setTh(Math.min(TAU, Math.round(v / STEP) * STEP))}
        fmt={(v) => `${nf(v, 2)} rad · ${nf(angleInfo(v).deg, 1)}°`} color="var(--mint)" />
      <div className="lab-slider-top" style={{ marginBottom: -4 }}>
        <span className="lab-slider-name"><span>Hazır açılar</span><span className="en">Preset angles</span></span>
      </div>
      <Choice options={PRESETS.map((p) => ({ value: p.value, tex: p.tex }))} value={preset ? preset.value : null}
        onChange={(v) => setTh(PRESETS.find((p) => p.value === v).th)} />
      <LiveTex tex={live} />
      <Readout items={[
        { label: "Yay uzunluğu", labelEn: "arc length", tex: `l ${lPi ? `= ${coef(R2 * info.p, 2 * info.q, "\\pi", "\\tfrac")} ` : ""}${isRound(l, 2) ? "=" : "\\approx"} ${tn(l, 2)}`, color: "var(--coral)" },
        { label: "Dilim alanı", labelEn: "sector area", tex: `A ${aPi ? `= ${coef(R2 * R2 * info.p, 8 * info.q, "\\pi", "\\tfrac")} ` : ""}${isRound(A, 2) ? "=" : "\\approx"} ${tn(A, 2)}`, color: "var(--gold)" },
        { label: "Dairenin kesri", labelEn: "share of the circle", tex: `\\tfrac{\\theta}{2\\pi} = ${shareT}`, color: "var(--mint)" },
      ]} />
    </LabShell>
  );
}
