import React, { useState, useMemo } from "react";
import { LabShell, NumberInput, Choice, Readout, LiveTex } from "./kit.jsx";

/* Bölünebilme laboratuvarı — 2, 3, 4, 5, 6, 8, 9, 10, 11 kuralları ✓/✗ ve nedenleri,
   seçili kuralın görsel açıklaması (rakam kutucukları) ve asal çarpanlara ayırma. */

const MAX = 10000000;
const W = 340, H = 328;
const MINUS = "−";

const RULES = [
  { d: 2, kind: "last", k: 1, tr: "Son basamak çift mi? (0, 2, 4, 6, 8)", en: "Is the last digit even? (0, 2, 4, 6, 8)" },
  { d: 3, kind: "sum", tr: "Rakamların toplamı 3’ün katı mı?", en: "Is the digit sum a multiple of 3?" },
  { d: 4, kind: "last", k: 2, tr: "Son iki basamak 4’ün katı mı?", en: "Are the last two digits a multiple of 4?" },
  { d: 5, kind: "last", k: 1, tr: "Son basamak 0 ya da 5 mi?", en: "Is the last digit 0 or 5?" },
  { d: 6, kind: "both", tr: "Hem 2’ye hem 3’e bölünüyor mu?", en: "Divisible by both 2 and 3?" },
  { d: 8, kind: "last", k: 3, tr: "Son üç basamak 8’in katı mı?", en: "Are the last three digits a multiple of 8?" },
  { d: 9, kind: "sum", tr: "Rakamların toplamı 9’un katı mı?", en: "Is the digit sum a multiple of 9?" },
  { d: 10, kind: "last", k: 1, tr: "Son basamak 0 mı?", en: "Is the last digit 0?" },
  { d: 11, kind: "alt", tr: "Sağdan +, −, +, − ile topla: 11’in katı mı?", en: "Add from the right +, −, +, −: a multiple of 11?" },
];

/** 1234567 → "1 234 567" (ince boşluk) ; TeX: 1\,234\,567 */
const group = (n, sep) => { const s = String(n); return s.length < 5 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, sep); };
const gTxt = (n) => group(n, " ");
const gTex = (n) => (n < 0 ? "-" : "") + group(Math.abs(n), "\\,");
/** Gerçek (negatif olmayan) kalan */
const mod = (a, m) => ((a % m) + m) % m;
/** a = d·q + r biçimi (0 ≤ r < d) */
const gather = (lines) => `\\begin{gathered} ${lines.join(" \\\\ ")} \\end{gathered}`;
const divTex = (a, d) => { const r = mod(a, d), q = (a - r) / d; return `${gTex(a)} = ${d}\\cdot ${q < 0 ? `(${gTex(q)})` : gTex(q)} + \\mathbf{${r}}`; };

function factorize(n) {
  const out = [];
  let m = n;
  for (let p = 2; p * p <= m; p += p === 2 ? 1 : 2) {
    let e = 0;
    while (m % p === 0) { m /= p; e++; }
    if (e) out.push([p, e]);
  }
  if (m > 1) out.push([m, 1]);
  return out;
}

/** Tek bir kuralın değerlendirmesi: { ok, short, pills, tex } */
function evaluate(rule, n, digits) {
  const { d } = rule;
  const ok = n % d === 0;
  const L = digits.length;
  if (rule.kind === "last") {
    const k = Math.min(rule.k, L);
    const blockStr = digits.slice(L - k).join("");
    const block = Number(blockStr);
    const head = digits.slice(0, L - k).join("");
    return {
      ok, focus: Array.from({ length: L }, (_, i) => i >= L - k), short: "…" + blockStr,
      pills: [{ text: `${blockStr === String(block) ? "" : blockStr + " → "}${block} = ${d}·${Math.floor(block / d)} + ${block % d}`, ok }],
      tex: !head
        ? gather([divTex(n, d)])
        : L + k > 8
          ? gather([`${head}\\boxed{${blockStr}}`, divTex(block, d), divTex(n, d)])
          : gather([`${head}\\boxed{${blockStr}} \\;\\Rightarrow\\; ${divTex(block, d)}`, divTex(n, d)]),
    };
  }
  if (rule.kind === "sum") {
    const s = digits.reduce((a, b) => a + b, 0);
    return {
      ok, focus: digits.map(() => true), signs: digits.map(() => "+"), short: `Σ = ${s}`,
      pills: [{ text: `${digits.join(" + ")} = ${s}`, ok: s % d === 0 }],
      tex: L <= 5
        ? gather([`${digits.join("+")} = ${divTex(s, d)}`, divTex(n, d)])
        : gather([`${digits.join("+")} = ${s}`, divTex(s, d), divTex(n, d)]),
    };
  }
  if (rule.kind === "alt") {
    const signs = digits.map((_, i) => ((L - 1 - i) % 2 === 0 ? "+" : MINUS));
    let s = 0;
    const terms = [];
    for (let i = L - 1, j = 0; i >= 0; i--, j++) { s += j % 2 === 0 ? digits[i] : -digits[i]; terms.push(j === 0 ? String(digits[i]) : (j % 2 ? MINUS : "+") + digits[i]); }
    const texTerms = terms.join("").replace(/−/g, "-");
    return {
      ok, focus: digits.map(() => true), signs, short: `+−+− = ${s < 0 ? MINUS + -s : s}`,
      pills: [{ text: `${terms.join(" ").replace(/([+−])/g, "$1 ").replace(/^ /, "")} = ${s < 0 ? MINUS + -s : s}`, ok: s % 11 === 0 }],
      tex: L <= 4
        ? gather([`${texTerms} = ${divTex(s, 11)}`, divTex(n, 11)])
        : gather([`${texTerms} = ${s < 0 ? "-" + -s : s}`, divTex(s, 11), divTex(n, 11)]),
    };
  }
  // both: 6 = 2·3
  const last = digits[L - 1], s = digits.reduce((a, b) => a + b, 0);
  return {
    ok, focus: digits.map(() => true), lastMark: true, signs: digits.map(() => "+"), short: `2${n % 2 === 0 ? "✓" : "✗"} 3${n % 3 === 0 ? "✓" : "✗"}`,
    pills: [{ text: `÷2: …${last}`, ok: n % 2 === 0 }, { text: `÷3: Σ = ${s}`, ok: n % 3 === 0 }],
    tex: gather([divTex(n, 2), divTex(n, 3), divTex(n, 6)]),
  };
}

/* ---------- SVG parçaları ---------- */
function Icon({ ok, x, y, s = 1, color }) {
  return ok
    ? <path d={`M${x - 4 * s},${y + 0.2 * s} L${x - 1.2 * s},${y + 3 * s} L${x + 4.4 * s},${y - 3.6 * s}`} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    : <path d={`M${x - 3.4 * s},${y - 3.4 * s} L${x + 3.4 * s},${y + 3.4 * s} M${x + 3.4 * s},${y - 3.4 * s} L${x - 3.4 * s},${y + 3.4 * s}`} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" />;
}

function Pills({ pills, y }) {
  const fs = 12.5;
  const widths = pills.map((p) => p.text.length * fs * 0.6 + 38);
  const gap = 8, total = widths.reduce((a, b) => a + b, 0) + gap * (pills.length - 1);
  let x = (W - total) / 2;
  return pills.map((p, i) => {
    const w = widths[i], c = p.ok ? "var(--mint)" : "var(--coral)", x0 = x;
    x += w + gap;
    return (
      <g key={i}>
        <rect x={x0} y={y - 13} width={w} height={26} rx={13} fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1.6" />
        <circle cx={x0 + 14} cy={y} r={8.5} fill={c} />
        <Icon ok={p.ok} x={x0 + 14} y={y} s={0.85} color="var(--plot-bg)" />
        <text x={x0 + 28} y={y + 4.4} fontSize={fs} fontWeight="700" fill="var(--ink)">{p.text}</text>
      </g>
    );
  });
}

function Scene({ n, digits, results, sel, onSel, rule, ev, over }) {
  const L = digits.length;
  const gap = 5, tw = Math.min(36, (W - 24 - gap * (L - 1)) / L), th = 42;
  const x0 = (W - (tw * L + gap * (L - 1))) / 2, ty = 52;
  const tx = (i) => x0 + i * (tw + gap);
  const k = rule.kind === "last" ? Math.min(rule.k, L) : 0;

  const cw = 104, ch = 50, cg = 6, gx0 = (W - (cw * 3 + cg * 2)) / 2, gy0 = 156;

  return (
    <svg className="lab-plot" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`${gTxt(n)} için bölünebilme · Divisibility of ${gTxt(n)}: ${results.filter((r) => r.ev.ok).map((r) => r.rule.d).join(", ") || "—"}`}>
      <rect x="0" y="0" width={W} height={H} rx="14" fill="var(--plot-bg)" />

      {/* kural cümlesi */}
      <text x={W / 2} y={22} fontSize="12.5" fontWeight="700" textAnchor="middle" fill={over ? "var(--coral)" : "var(--ink)"}>
        {over ? "En fazla 10 000 000 · en büyük sayı kullanıldı" : rule.tr}
      </text>
      <text x={W / 2} y={38} fontSize="11" textAnchor="middle" fill="var(--sky)">{over ? "Max 10,000,000 · using the largest number" : rule.en}</text>

      {/* rakam kutucukları */}
      {digits.map((dg, i) => {
        const on = ev.focus[i];
        const isLast = ev.lastMark && i === L - 1;
        return (
          <g key={i}>
            <rect x={tx(i)} y={ty} width={tw} height={th} rx="9"
              fill={on ? (isLast ? "var(--sky)" : "var(--gold)") : "var(--surface-2)"} fillOpacity={on ? 0.18 : 1}
              stroke={on ? (isLast ? "var(--sky)" : "var(--gold)") : "var(--line)"} strokeWidth={on ? 2 : 1.2} />
            <text x={tx(i) + tw / 2} y={ty + th / 2 + 7.5} fontSize={Math.min(22, tw * 0.62)} fontWeight="800" textAnchor="middle"
              fill={on ? "var(--ink)" : "var(--ink-3)"}>{dg}</text>
          </g>
        );
      })}
      {/* basamak değerleri: birler, onlar… yalnızca kısa sayılarda */}
      {ev.signs && ev.signs.map((sg, i) => (
        <text key={"s" + i} x={tx(i) + tw / 2} y={ty + th + 17} fontSize="15" fontWeight="800" textAnchor="middle"
          fill={sg === "+" ? "var(--sky)" : "var(--violet)"}>{sg}</text>
      ))}
      {k > 0 && (
        <g stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d={`M${tx(L - k) + 2},${ty + th + 6} L${tx(L - k) + 2},${ty + th + 12} L${tx(L - 1) + tw - 2},${ty + th + 12} L${tx(L - 1) + tw - 2},${ty + th + 6}`} />
          <line x1={(tx(L - k) + tx(L - 1) + tw) / 2} x2={(tx(L - k) + tx(L - 1) + tw) / 2} y1={ty + th + 12} y2={ty + th + 19} />
        </g>
      )}
      <Pills pills={ev.pills} y={ty + th + 38} />

      {/* 3×3 kural ızgarası (dokunulabilir) */}
      {results.map(({ rule: r, ev: e }, i) => {
        const cx = gx0 + (i % 3) * (cw + cg), cy = gy0 + Math.floor(i / 3) * (ch + cg);
        const c = e.ok ? "var(--mint)" : "var(--coral)";
        const on = r.d === sel;
        return (
          <g key={r.d} role="button" tabIndex={0} aria-pressed={on} aria-label={`${r.d}: ${e.ok ? "bölünür · divisible" : "bölünmez · not divisible"}`}
            style={{ cursor: "pointer" }} onClick={() => onSel(r.d)}
            onKeyDown={(ev2) => { if (ev2.key === "Enter" || ev2.key === " ") { ev2.preventDefault(); onSel(r.d); } }}>
            <rect x={cx} y={cy} width={cw} height={ch} rx="12" fill={on ? "var(--gold)" : c} fillOpacity={on ? 0.16 : 0.08}
              stroke={on ? "var(--gold)" : "var(--line)"} strokeWidth={on ? 2.4 : 1.2} />
            <text x={cx + 10} y={cy + 22} fontSize="17" fontWeight="800" fill="var(--ink)">÷{r.d}</text>
            <text x={cx + 10} y={cy + 40} fontSize="10.5" fontWeight="600" fill="var(--ink-2)">{e.short}</text>
            <circle cx={cx + cw - 17} cy={cy + 17} r="10" fill={c} />
            <Icon ok={e.ok} x={cx + cw - 17} y={cy + 17} color="var(--plot-bg)" />
          </g>
        );
      })}
    </svg>
  );
}

const PRESETS = [7425, 2520, 1001, 4096];

export default function DivisibilityLab() {
  const [val, setVal] = useState(7425);
  const [sel, setSel] = useState(3);

  const raw = typeof val === "number" && Number.isFinite(val) ? Math.trunc(Math.abs(val)) : 0;
  const over = raw > MAX;
  const n = raw >= 1 ? Math.min(raw, MAX) : 0;

  const data = useMemo(() => {
    if (!n) return null;
    const digits = String(n).split("").map(Number);
    const results = RULES.map((rule) => ({ rule, ev: evaluate(rule, n, digits) }));
    const fac = factorize(n);
    return { digits, results, fac };
  }, [n]);

  const pick = (v) => {
    if (v === "rnd") {
      const len = 3 + Math.floor(Math.random() * 5);
      setVal(Math.floor(10 ** (len - 1) + Math.random() * 9 * 10 ** (len - 1)));
    } else setVal(Number(v));
  };
  const presetChoice = (
    <Choice value={String(n)} onChange={pick} options={[
      ...PRESETS.map((p) => ({ value: String(p), label: String(p) })),
      { value: "rnd", label: <span>Rastgele <span className="en">Random</span></span> },
    ]} />
  );

  if (!data) {
    return (
      <LabShell title="Bölünebilme kuralları" titleEn="Divisibility rules"
        hint="1 ile 10 000 000 arasında bir tam sayı yaz." hintEn="Type a whole number from 1 to 10,000,000.">
        <NumberInput label="Sayı" labelEn="Number" value={val} onChange={setVal} min={1} max={MAX} />
        {presetChoice}
      </LabShell>
    );
  }

  const { digits, results, fac } = data;
  const cur = results.find((r) => r.rule.d === sel);
  const yes = results.filter((r) => r.ev.ok).map((r) => r.rule.d);
  const facTex = fac.map(([p, e]) => (e > 1 ? `${gTex(p)}^{${e}}` : gTex(p))).join(" \\cdot ");
  // açık yazım (3·3·3·5·5·11) yalnızca satıra sığarsa
  const plainLen = (arr) => arr.reduce((a, x) => a + String(x).length + 1, 0);
  const showExpanded = fac.some(([, e]) => e > 1) &&
    String(n).length + plainLen(fac.flatMap(([p, e]) => Array(e).fill(p))) + plainLen(fac.map(([p, e]) => p + (e > 1 ? "^" + e : ""))) <= 30;
  const isPrime = fac.length === 1 && fac[0][1] === 1;
  const divisors = fac.reduce((a, [, e]) => a * (e + 1), 1);
  const factorLine = n === 1
    ? `1`
    : isPrime
      ? `${gTex(n)} \\;\\; (\\text{asal / prime})`
      : `${gTex(n)} = ${showExpanded ? fac.map(([p, e]) => Array(e).fill(gTex(p)).join("\\cdot ")).join("\\cdot ") + " = " : ""}${facTex}`;

  return (
    <LabShell title="Bölünebilme kuralları" titleEn="Divisibility rules"
      hint="Bir kutucuğa dokun ve kuralın nedenini gör. Sonra sayıyı değiştir: 2520’yi dene, neredeyse hepsi ✓!"
      hintEn="Tap a tile to see why the rule works. Then change the number: try 2520, almost all ✓!">
      <NumberInput label="Sayı" labelEn="Number" value={val} onChange={setVal} min={1} max={MAX} />
      {presetChoice}
      <Scene n={n} digits={digits} results={results} sel={sel} onSel={setSel} rule={cur.rule} ev={cur.ev} over={over} />
      <LiveTex tex={cur.ev.tex} />
      <Readout items={[
        { label: `Kalan ÷${sel}`, labelEn: "Remainder", value: String(n % sel), color: cur.ev.ok ? "var(--mint)" : "var(--coral)" },
        { label: "Bölünür", labelEn: "Divisible by", value: yes.length ? yes.join(", ") : "—", color: "var(--gold)" },
        { label: "Rakam toplamı", labelEn: "Digit sum", value: String(digits.reduce((a, b) => a + b, 0)), color: "var(--sky)" },
        { label: "Bölen sayısı", labelEn: "Divisors", value: String(divisors), color: "var(--violet)" },
      ]} />
      <div className="lab-chip-label">
        Asal çarpanlar <span className="en">· Prime factorisation</span>
        {n === 1 && <span> — 1 asal değil <span className="en">· 1 is not prime</span></span>}
      </div>
      <LiveTex tex={factorLine} />
    </LabShell>
  );
}
