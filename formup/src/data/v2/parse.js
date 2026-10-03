/* FormUp v2 kart biçimi ayrıştırıcısı. Biçimin tam tanımı: content/SPEC.md */

const TAGS = new Set(["L", "O", "R", "X", "K", "KE", "U", "UE", "W", "WE", "E", "H", "T", "Q", "QE", "B", "C", "CT", "G", "LAB", "S", "BK", "V"]);

export function parseCards(src, file = "") {
  const out = [];
  let unit = null, cur = null, lineNo = 0;
  for (const raw of src.split("\n")) {
    lineNo++;
    const line = raw.trim();
    if (!line || line.startsWith("//")) continue;
    if (line.startsWith("## ")) { unit = line.slice(3).trim(); continue; }
    if (line.startsWith("# ")) {
      const parts = line.slice(2).split("|").map((s) => s.trim());
      const [id, p, n, ne] = parts;
      cur = { id, u: unit, p: Number(p) || 1, n: n || "", ne: ne || "", o: "=", x: [], t: [], line: lineNo, file };
      out.push(cur);
      continue;
    }
    if (!cur) continue;
    const m = /^([A-Z]{1,3})\s+(.*)$/.exec(line);
    if (!m || !TAGS.has(m[1])) { (cur.bad = cur.bad || []).push(`satır ${lineNo}: tanınmayan satır: ${line.slice(0, 60)}`); continue; }
    const [, tag, val] = m;
    switch (tag) {
      case "L": cur.l = val; break;
      case "O": cur.o = val; break;
      case "R": cur.r = val; break;
      case "X": cur.x = val.split(";;").map((s) => s.trim()).filter(Boolean); break;
      case "K": cur.k = val; break;
      case "KE": cur.ke = val; break;
      case "U": cur.use = val; break;
      case "UE": cur.usee = val; break;
      case "W": cur.w = val; break;
      case "WE": cur.we = val; break;
      case "E": cur.e = val; break;
      case "H": cur.h = val; break;
      case "S": cur.s = val; break;
      case "Q": cur.q = val; break;
      case "QE": cur.qe = val; break;
      case "G": cur.g = val; break;
      case "LAB": cur.lab = val; break;
      case "BK": cur.bk = val; break;
      case "V": cur.v = val; break;
      case "CT": cur.ct = val; break;
      case "T":
        cur.t = val.split(";;").map((s) => s.split("=").map((x) => x.trim())).filter((p) => p.length === 2 && p[0] && p[1]);
        break;
      case "B": {
        const [skel, dist = ""] = val.split("||");
        const blanks = [];
        skel.replace(/\[\[(.+?)\]\]/g, (mm, a) => { blanks.push(a.trim()); return mm; });
        cur.b = { skel: skel.trim(), blanks, dist: dist.split(";;").map((s) => s.trim()).filter(Boolean) };
        break;
      }
      case "C": {
        const [vs, expr = ""] = val.split("=>");
        const vars = vs.split(";").map((s) => s.trim()).filter(Boolean).map((s) => {
          const [name, rest = ""] = s.split("=").map((x) => x.trim());
          const [def, min, max, step] = rest.split(":").map(Number);
          return { name, def, min, max, step: step || 1 };
        });
        cur.c = { vars, expr: expr.trim() };
        break;
      }
      default: break;
    }
  }
  return out;
}

/* ---------------- Canlı hesap makinesi ---------------- */
const HELPERS = {
  sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan,
  ln: Math.log, log10: Math.log10, log: (b, x) => Math.log(x) / Math.log(b), exp: Math.exp, abs: Math.abs,
  pow: Math.pow, floor: Math.floor, ceil: Math.ceil, round: Math.round, min: Math.min, max: Math.max,
  PI: Math.PI, E: Math.E,
  fact: (n) => { let r = 1; for (let k = 2; k <= Math.round(n); k++) r *= k; return r; },
  nCr: (n, r) => { const f = HELPERS.fact; return f(n) / (f(r) * f(n - r)); },
  gcd: (a, b) => { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) [a, b] = [b, a % b]; return a; },
  lcm: (a, b) => Math.abs(Math.round(a) * Math.round(b)) / HELPERS.gcd(a, b),
  deg: (x) => (x * Math.PI) / 180,
};
export const CALC_HELPERS = Object.keys(HELPERS);

/** Hesap ifadesini derle: yalnızca değişken adları ve yardımcı fonksiyonlar izinli */
export function compileCalc(c) {
  if (!c || !c.expr) return null;
  const names = c.vars.map((v) => v.name);
  const expr = c.expr.replace(/\^/g, "**");
  const ids = expr.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
  for (const id of ids) if (!names.includes(id) && !(id in HELPERS)) throw new Error("izinsiz ad: " + id);
  if (/[;{}\[\]`'"=]/.test(expr.replace(/[<>!=]=|<|>/g, ""))) throw new Error("izinsiz karakter");
  // eslint-disable-next-line no-new-func
  const fn = new Function(...Object.keys(HELPERS), ...names, `return (${expr});`);
  return (vals) => fn(...Object.values(HELPERS), ...names.map((n) => vals[n]));
}

/** "@n@" yer tutucularını sayılarla doldur; negatifler parantez içine alınır */
export function fillTemplate(ct, vals, result, fmt) {
  return ct.replace(/@([A-Za-z_][A-Za-z0-9_]*|=)@/g, (m, name) => {
    const v = name === "=" ? result : vals[name];
    const s = fmt(v);
    return name !== "=" && v < 0 ? `(${s})` : s;
  });
}
