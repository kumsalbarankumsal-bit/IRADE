/* KaTeX ile formül çizimi.
   Derlenmiş sayfada KaTeX betiği uygulamadan önce yüklenir (window.katex).
   Yoksa (ör. çevrimdışı) cdnjs’ten bir kez yüklemeyi dener; o da olmazsa
   TeX kaynağını okunur biçimde gösterir. */
import React, { useEffect, useState } from "react";

const KATEX_SRC = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
let loading = null;
const listeners = new Set();

function ensureKatex() {
  if (typeof window === "undefined" || window.katex) return;
  if (loading) return;
  loading = new Promise((res) => {
    const s = document.createElement("script");
    s.src = KATEX_SRC;
    s.onload = () => { listeners.forEach((f) => f()); res(); };
    s.onerror = res;
    document.head.appendChild(s);
  });
}

function useKatexReady() {
  const [ready, setReady] = useState(() => typeof window !== "undefined" && !!window.katex);
  useEffect(() => {
    if (ready) return;
    ensureKatex();
    const f = () => setReady(true);
    listeners.add(f);
    return () => listeners.delete(f);
  }, [ready]);
  return ready;
}

const cache = new Map();
export function texToHtml(tex, display = false) {
  const key = (display ? "D" : "I") + tex;
  if (cache.has(key)) return cache.get(key);
  let html;
  try {
    html = window.katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore", output: "html" });
  } catch (e) { html = null; }
  if (html) { if (cache.size > 4000) cache.clear(); cache.set(key, html); }
  return html;
}

/** Tek bir TeX ifadesi */
export function Tex({ tex, display = false, className = "" }) {
  const ready = useKatexReady();
  if (!ready) return <code className={"tex-fallback " + className}>{tex}</code>;
  const html = texToHtml(tex, display);
  if (!html) return <code className={"tex-fallback " + className}>{tex}</code>;
  return <span className={(display ? "tex tex-d " : "tex ") + className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Erişilebilirlik etiketleri için TeX’siz düz metin */
export const plain = (t) => String(t || "").replace(/\$/g, "").replace(/\\(d|t)?frac\{([^{}]*)\}\{([^{}]*)\}/g, "$2/$3").replace(/\\([a-zA-Z]+)/g, "$1").replace(/[{}^_]/g, "");

/** $...$ içeren düz metin */
export function Rich({ text, className = "" }) {
  useKatexReady();
  if (!text) return null;
  const parts = String(text).replace(/^~/, "").split("$");
  return (
    <span className={className}>
      {parts.map((p, i) => (i % 2 ? <Tex key={i} tex={p} /> : <React.Fragment key={i}>{p}</React.Fragment>))}
    </span>
  );
}

/** Formül alanı: "~" ile başlıyorsa metin, değilse TeX */
export function Field({ v, display = false, className = "" }) {
  if (v == null) return null;
  if (v.startsWith("~")) return <Rich text={v} className={"field-text " + className} />;
  return <Tex tex={v} display={display} className={className} />;
}

/** Bağıntı işareti (":" düz yazılır) */
export function Rel({ o }) {
  if (!o || o === "=") return <Tex tex="=" className="rel" />;
  if (o === ":") return <span className="rel rel-colon">:</span>;
  return <Tex tex={o} className="rel" />;
}

/** Formülün görsel uzunluğuna göre yazı boyu: uzun formüller küçülür */
function visualLen(v) {
  if (!v) return 0;
  if (v.startsWith("~")) return v.replace(/\$[^$]*\$/g, "xxxx").length * 0.55;
  let t = v.replace(/\\(left|right|displaystyle|,|;|!|quad)/g, "")
    .replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => (a.length > b.length ? a : b))
    .replace(/\\(text|operatorname|mathrm)\{([^{}]*)\}/g, "$2")
    .replace(/\\[a-zA-Z]+/g, "x").replace(/[{}^_]/g, "");
  return t.length;
}
export function autoSize(f, rhs, max = "xl") {
  const n = visualLen(f.l) + visualLen(rhs !== undefined ? rhs : f.r) + 2;
  const order = ["sm", "md", "lg", "xl"];
  const want = n <= 16 ? "xl" : n <= 26 ? "lg" : n <= 40 ? "md" : "sm";
  return order[Math.min(order.indexOf(want), order.indexOf(max))];
}

/** Tam formül: sol, bağıntı, sağ (sağ yerine özel bir değer verilebilir) */
export function Formula({ f, rhs, hideRhs = false, size = "md", className = "" }) {
  const r = rhs !== undefined ? rhs : f.r;
  if (size === "auto") size = autoSize(f, hideRhs ? "?" : r);
  return (
    <span className={`formula formula-${size} ${className}`}>
      <Field v={f.l} />
      <Rel o={f.o} />
      {hideRhs ? <span className="qmark">?</span> : <Field v={r} />}
    </span>
  );
}
