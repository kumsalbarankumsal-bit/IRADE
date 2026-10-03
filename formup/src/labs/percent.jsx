import React, { useState, useMemo } from "react";
import { LabShell, Slider, Plot, Readout, LiveTex, Choice, nf, tn } from "./kit.jsx";

/* Yüzde laboratuvarı: 10×10 ızgarada her kare N’nin %1’i; p kare boyanır.
   Sağda "önce / sonra" sütunları ve çarpan (p/100 ya da 1 ± p/100). */

const MODES = [
  { value: "of", tr: "N’nin %p’si", en: "p% of N" },
  { value: "inc", tr: "%p artış", en: "p% increase" },
  { value: "dec", tr: "%p azalış", en: "p% decrease" },
];

const halo = { paintOrder: "stroke", stroke: "var(--plot-bg)", strokeWidth: 3, strokeLinejoin: "round" };

function Bi({ tr, en }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2, padding: "1px 2px" }}>
      <span>{tr}</span>
      <span className="en" style={{ fontSize: 11.5 }}>{en}</span>
    </span>
  );
}

/* Izgara geometrisi (piksel) */
const GX = 12, GY = 32, CELL = 18.6, SQ = 15.6;
/* Sütunlar */
const BASE_Y = 208, MAX_H = 150, BAR_W = 40, AX = 222, BX = 284;

function Grid({ mode, p }) {
  const cells = [];
  for (let i = 0; i < 100; i++) {
    const row = 9 - Math.floor(i / 10); // alttan yukarı dolar
    const col = i % 10;
    const x = GX + col * CELL, y = GY + row * CELL;
    let fill = "var(--line)", op = 0.75, stroke = "none", cross = false;
    if (mode === "of") {
      if (i < p) { fill = "var(--mint)"; op = 0.9; }
    } else if (mode === "inc") {
      if (i < p) { fill = "var(--mint)"; op = 0.9; } else { fill = "var(--sky)"; op = 0.38; }
    } else {
      if (i >= 100 - p) { fill = "var(--coral)"; op = 0.16; stroke = "var(--coral)"; cross = true; } else { fill = "var(--sky)"; op = 0.55; }
    }
    cells.push(
      <g key={i}>
        <rect x={x} y={y} width={SQ} height={SQ} rx="3.5" fill={fill} fillOpacity={op} stroke={stroke} strokeWidth={stroke === "none" ? 0 : 1} strokeDasharray={cross ? "2 2" : undefined} style={{ transition: "fill-opacity .18s, fill .18s" }} />
        {cross && <path d={`M${x + 4.5},${y + 4.5} L${x + SQ - 4.5},${y + SQ - 4.5} M${x + SQ - 4.5},${y + 4.5} L${x + 4.5},${y + SQ - 4.5}`} stroke="var(--coral)" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />}
      </g>
    );
  }
  return <g>{cells}</g>;
}

function Bars({ mode, p, N, res }) {
  const maxPct = mode === "inc" ? 200 : 100;
  const k = MAX_H / maxPct;
  const h100 = 100 * k;
  const top100 = BASE_Y - h100;
  const bars = [];
  // A: N (hep %100)
  bars.push(<rect key="a" x={AX} y={top100} width={BAR_W} height={h100} rx="5" fill="var(--sky)" fillOpacity="0.45" stroke="var(--sky)" strokeWidth="1.6" />);
  // B: sonuç
  let bTop;
  if (mode === "of") {
    const h = p * k;
    bTop = BASE_Y - h;
    bars.push(<rect key="b" x={BX} y={bTop} width={BAR_W} height={Math.max(h, 0.001)} rx="5" fill="var(--mint)" fillOpacity="0.75" stroke="var(--mint)" strokeWidth="1.6" />);
    bars.push(<rect key="ghost" x={BX} y={top100} width={BAR_W} height={h100} rx="5" fill="none" stroke="var(--ink-3)" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.6" />);
  } else if (mode === "inc") {
    const hp = p * k;
    bTop = top100 - hp;
    bars.push(<rect key="b1" x={BX} y={top100} width={BAR_W} height={h100} rx="5" fill="var(--sky)" fillOpacity="0.45" stroke="var(--sky)" strokeWidth="1.6" />);
    if (p > 0) bars.push(<rect key="b2" x={BX} y={bTop} width={BAR_W} height={hp} rx="5" fill="var(--mint)" fillOpacity="0.75" stroke="var(--mint)" strokeWidth="1.6" />);
  } else {
    const hk = (100 - p) * k;
    bTop = BASE_Y - hk;
    if (p > 0) bars.push(<rect key="b0" x={BX} y={top100} width={BAR_W} height={p * k} rx="5" fill="var(--coral)" fillOpacity="0.12" stroke="var(--coral)" strokeWidth="1.4" strokeDasharray="4 3" />);
    if (p < 100) bars.push(<rect key="b1" x={BX} y={bTop} width={BAR_W} height={hk} rx="5" fill="var(--sky)" fillOpacity="0.45" stroke="var(--sky)" strokeWidth="1.6" />);
  }
  const mult = mode === "of" ? p / 100 : mode === "inc" ? 1 + p / 100 : 1 - p / 100;
  const diff = res - N;
  // Sonuç etiketi: azalışta kalan sütunun içine (yer varsa), yoksa sütunun üstüne
  const keptH = BASE_Y - bTop;
  const resY = mode === "dec" ? (keptH >= 24 ? bTop + 16 : bTop - 6) : Math.min(bTop, mode === "of" ? top100 : bTop) - 6;
  return (
    <g>
      {/* %100 çizgisi */}
      <line x1={AX - 6} x2={BX + BAR_W + 6} y1={top100} y2={top100} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
      {bars}
      <line x1={AX - 6} x2={BX + BAR_W + 6} y1={BASE_Y} y2={BASE_Y} stroke="var(--ink-3)" strokeWidth="1.4" />
      {/* değerler */}
      <text x={AX + BAR_W / 2} y={top100 - 6} fontSize="11.5" fontWeight="700" textAnchor="middle" fill="var(--ink)" style={halo}>{nf(N, 2)}</text>
      <text x={BX + BAR_W / 2} y={resY} fontSize="11.5" fontWeight="700" textAnchor="middle" fill="var(--ink)" style={halo}>{nf(res, 2)}</text>
      {/* artış / azalış etiketi sütun içinde */}
      {mode !== "of" && p * k >= 17 && (
        <text x={BX + BAR_W / 2} y={(mode === "inc" ? bTop + top100 : top100 + bTop) / 2 + 4} fontSize="10.5" fontWeight="700" textAnchor="middle" fill={mode === "inc" ? "var(--mint)" : "var(--coral)"} style={halo}>
          {(diff >= 0 ? "+" : "−") + nf(Math.abs(diff), 1)}
        </text>
      )}
      {/* alt etiketler */}
      <text x={AX + BAR_W / 2} y={BASE_Y + 14} fontSize="10.5" fontWeight="700" textAnchor="middle" fill="var(--ink-2)">N</text>
      <text x={AX + BAR_W / 2} y={BASE_Y + 26} fontSize="9.5" textAnchor="middle" fill="var(--ink-3)">%100</text>
      <text x={BX + BAR_W / 2} y={BASE_Y + 14} fontSize="10.5" fontWeight="700" textAnchor="middle" fill="var(--ink-2)">sonuç<tspan fill="var(--ink-3)" fontWeight="500" fontSize="9.5"> · result</tspan></text>
      <text x={BX + BAR_W / 2} y={BASE_Y + 26} fontSize="9.5" textAnchor="middle" fill="var(--ink-3)">%{nf(mult * 100, 0)}</text>
      {/* çarpan rozeti */}
      <g>
        <rect x={AX - 2} y="6" width={BX + BAR_W - AX + 4} height="24" rx="12" fill="var(--gold)" fillOpacity="0.16" stroke="var(--gold)" strokeWidth="1.4" />
        <text x={(AX + BX + BAR_W) / 2} y="22.5" fontSize="12.5" fontWeight="800" textAnchor="middle" fill="var(--ink)">× {nf(mult, 2)}</text>
      </g>
    </g>
  );
}

export default function PercentLab() {
  const [mode, setMode] = useState("of");
  const [N, setN] = useState(200);
  const [p, setP] = useState(25);

  const r = useMemo(() => {
    const mult = mode === "of" ? p / 100 : mode === "inc" ? 1 + p / 100 : 1 - p / 100;
    const res = N * mult;
    const one = N / 100;
    return { mult, res, one, part: (N * p) / 100 };
  }, [mode, N, p]);

  let tex, items;
  if (mode === "of") {
    tex = `\\frac{${p}}{100}\\times ${tn(N)} = ${tn(r.mult)}\\times ${tn(N)} = ${tn(r.res)}`;
    items = [
      { label: "1 kare", labelEn: "1 square", value: nf(r.one, 2), color: "var(--ink-3)" },
      { label: "Çarpan", labelEn: "Multiplier", tex: `\\tfrac{${p}}{100} = ${tn(r.mult)}`, color: "var(--gold)" },
      { label: "Sonuç", labelEn: "Result", value: nf(r.res, 2), color: "var(--mint)" },
    ];
  } else {
    const sgn = mode === "inc" ? "+" : "-";
    tex = `\\begin{aligned} &${tn(N)}\\times\\left(1 ${sgn} \\frac{${p}}{100}\\right) \\\\ &= ${tn(N)}\\times ${tn(r.mult)} = ${tn(r.res)} \\end{aligned}`;
    items = [
      { label: "Çarpan", labelEn: "Multiplier", tex: `1 ${sgn} \\tfrac{${p}}{100} = ${tn(r.mult)}`, color: "var(--gold)" },
      mode === "inc"
        ? { label: "Artış", labelEn: "Increase", value: "+" + nf(r.part, 2), color: "var(--mint)" }
        : { label: "Azalış", labelEn: "Decrease", value: "−" + nf(r.part, 2), color: "var(--coral)" },
      { label: "Sonuç", labelEn: "Result", value: nf(r.res, 2), color: "var(--sky)" },
    ];
  }

  // Duruma göre ipucu (özel değerlerde küçük "aha!" notu)
  let hint, hintEn;
  if (mode === "of") {
    hint = p === 50 ? "%50 = tam yarısı! Şimdi p’yi 25’e çek: çeyreği." : p === 100 ? "%100 = hepsi: sonuç N’nin kendisi." : p === 10 ? "%10 = N’yi 10’a böl. Kolay kısayol!" : "p’yi kaydır: her boyalı kare N’nin %1’i (N ÷ 100). %50’yi dene: yarısı!";
    hintEn = p === 50 ? "50% = exactly half! Now drag p to 25: a quarter." : p === 100 ? "100% = all of it: the result is N itself." : p === 10 ? "10% = divide N by 10. Handy shortcut!" : "Slide p: each coloured square is 1% of N (N ÷ 100). Try 50%: half!";
  } else if (mode === "inc") {
    hint = p === 100 ? "%100 artış = 2 katı! Çarpan 2 oldu." : "Artışta çarpan 1’den BÜYÜK (1 + p/100). p’yi 100’e çek: ne olur?";
    hintEn = p === 100 ? "A 100% increase = double! The multiplier is 2." : "For an increase the multiplier is ABOVE 1 (1 + p/100). Drag p to 100: what happens?";
  } else {
    hint = p === 100 ? "%100 azalış: hiçbir şey kalmadı, çarpan 0." : p === 50 ? "%50 azalış = yarıya indi. Çarpan 0,5." : "Azalışta çarpan 1’den KÜÇÜK (1 − p/100). Kırmızı kareler gider, maviler kalır.";
    hintEn = p === 100 ? "A 100% decrease: nothing is left, multiplier 0." : p === 50 ? "A 50% decrease = halved. Multiplier 0.5." : "For a decrease the multiplier is BELOW 1 (1 − p/100). Red squares go, blue ones stay.";
  }

  const topLabel = mode === "dec" ? { n: p, tr: "kare gider", en: "removed", c: "var(--coral)" } : { n: p, tr: mode === "inc" ? "kare eklenir" : "kare", en: mode === "inc" ? "added" : "squares", c: "var(--mint)" };

  return (
    <LabShell title="Yüzde ve çarpan" titleEn="Percentages and multipliers" hint={hint} hintEn={hintEn}>
      <Choice options={MODES.map((m) => ({ value: m.value, label: <Bi tr={m.tr} en={m.en} /> }))} value={mode} onChange={setMode} />
      <Plot width={340} height={250} grid={false} axes={false} label={`10×10 ızgara: ${p} kare boyalı; N = ${nf(N)}, sonuç ${nf(r.res)} · 10 by 10 grid, ${p} squares coloured`}>
        <text x={GX} y={22} fontSize="11" fontWeight="700" fill={topLabel.c} style={halo}>
          {topLabel.n}/100 <tspan fill="var(--ink-2)" fontWeight="600">{topLabel.tr}</tspan>
          <tspan fill="var(--ink-3)" fontWeight="500"> · {topLabel.en}</tspan>
        </text>
        <Grid mode={mode} p={p} />
        <text x={GX} y={GY + 10 * CELL + 14} fontSize="10.5" fontWeight="600" fill="var(--ink-2)">
          1 kare <tspan fill="var(--ink-3)" fontWeight="500">· 1 square</tspan> = %1 = <tspan fill="var(--ink)" fontWeight="800">{nf(r.one, 2)}</tspan>
        </text>
        <Bars mode={mode} p={p} N={N} res={r.res} />
      </Plot>
      <Slider tex="N" label="sayı" labelEn="amount" value={N} min={10} max={1000} step={10} onChange={setN} fmt={(v) => nf(v, 0)} color="var(--sky)" />
      <Slider tex="p" label="yüzde" labelEn="percent" value={p} min={0} max={100} step={1} onChange={setP} fmt={(v) => "%" + v} color="var(--mint)" />
      <LiveTex tex={tex} />
      <Readout items={items} />
    </LabShell>
  );
}
