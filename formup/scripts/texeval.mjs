/* Küçük bir LaTeX → sayı değerlendiricisi (yalnızca testler için).
   Formül veritabanındaki özdeşlikleri rastgele noktalarda sınamak ve
   tuzak şıkların gerçekten yanlış olduğunu göstermek için kullanılır.
   Desteklenen alt küme: + - \cdot \times / ^ _ ! ' (türev), kesirler, kökler,
   mutlak değer, trigonometrik/log fonksiyonlar, \sum, \dbinom, derece, \dots serileri. */

const SKIP = new Set(["\\,", "\\;", "\\!", "\\ ", "\\quad", "\\left", "\\right", "\\displaystyle", "\\textstyle"]);
const FUNCS = new Set(["\\sin", "\\cos", "\\tan", "\\cot", "\\sec", "\\csc", "\\ln", "\\log", "\\arcsin", "\\arccos", "\\arctan", "\\exp"]);
const GREEK = new Set(["\\theta", "\\alpha", "\\beta", "\\lambda", "\\mu", "\\sigma", "\\varphi", "\\phi"]);

export function tokenize(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " " || c === "\t") { i++; continue; }
    if (c === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(s.slice(i));
      const tok = m[0];
      i += tok.length;
      if (SKIP.has(tok)) continue;
      out.push(tok);
      continue;
    }
    if (/[0-9.]/.test(c)) {
      const m = /^[0-9]*\.?[0-9]+/.exec(s.slice(i)) || /^[0-9]+/.exec(s.slice(i));
      out.push(m[0]); i += m[0].length; continue;
    }
    out.push(c); i++;
  }
  return out;
}

class Parser {
  constructor(tokens) { this.t = tokens; this.i = 0; this.absDepth = 0; }
  peek(o = 0) { return this.t[this.i + o]; }
  next() { return this.t[this.i++]; }
  expect(tok) {
    const n = this.next();
    if (n !== tok) throw new Error(`beklenen ${tok}, gelen ${n} @${this.i}`);
  }
  done() { return this.i >= this.t.length; }

  parseRelationTop() {
    const e = this.parseExpr();
    if (!this.done()) throw new Error("fazla token: " + this.t.slice(this.i).join(" "));
    return e;
  }
  parseExpr() {
    const terms = [];
    let sign = 1;
    if (this.peek() === "-") { this.next(); sign = -1; } else if (this.peek() === "+") this.next();
    terms.push({ sign, node: this.parseTerm() });
    while (this.peek() === "+" || this.peek() === "-") {
      const s = this.next() === "+" ? 1 : -1;
      terms.push({ sign: s, node: this.parseTerm() });
    }
    const dots = terms.findIndex((t) => t.node.type === "dots");
    if (dots >= 0) {
      return { type: "series", first: terms[0].node, last: terms[terms.length - 1].node };
    }
    if (terms.length === 1 && terms[0].sign === 1) return terms[0].node;
    return { type: "sum", terms };
  }
  startsAtom(tok) {
    if (tok === undefined) return false;
    if (tok === "|") return this.absDepth === 0;
    if (/^[0-9.]/.test(tok) || /^[a-zA-Z]$/.test(tok)) return true;
    if (tok === "(" || tok === "[" || tok === "{") return true;
    if (["\\frac", "\\dfrac", "\\tfrac", "\\sqrt", "\\pi", "\\infty", "\\sum", "\\dbinom", "\\binom", "\\tbinom", "\\lfloor"].includes(tok)) return true;
    if (FUNCS.has(tok) || GREEK.has(tok)) return true;
    return false;
  }
  parseTerm() {
    let node = this.parseFactor();
    for (;;) {
      const p = this.peek();
      if (p === "\\cdot" || p === "\\times" || p === "*") { this.next(); node = { type: "mul", a: node, b: this.parseFactor() }; continue; }
      if (p === "/") { this.next(); node = { type: "div", a: node, b: this.parseFactor() }; continue; }
      if (this.startsAtom(p)) { node = { type: "mul", a: node, b: this.parseFactor() }; continue; }
      return node;
    }
  }
  parseFactor() {
    if (this.peek() === "-") { this.next(); return { type: "neg", a: this.parseFactor() }; }
    if (this.peek() === "\\dots" || this.peek() === "\\cdots" || this.peek() === "\\ldots") { this.next(); return { type: "dots" }; }
    return this.parsePostfix(this.parsePrimary());
  }
  parsePostfix(node) {
    for (;;) {
      const p = this.peek();
      if (p === "^") {
        this.next();
        if (this.peek() === "\\circ") { this.next(); node = { type: "deg", a: node }; continue; }
        node = { type: "pow", a: node, b: this.parseGroup() };
        continue;
      }
      if (p === "!") { this.next(); node = { type: "fact", a: node }; continue; }
      if (p === "'") { this.next(); node = { type: "deriv", a: node }; continue; }
      return node;
    }
  }
  /* {…} ya da tek token (rakam dizisinin ilk rakamı) */
  parseGroup() {
    if (this.peek() === "{") {
      this.next();
      const saved = this.absDepth; this.absDepth = 0;
      const e = this.parseExpr();
      this.absDepth = saved;
      this.expect("}");
      return e;
    }
    const tok = this.next();
    if (/^[0-9]{2,}$/.test(tok)) { this.t.splice(this.i, 0, tok.slice(1)); return { type: "num", v: Number(tok[0]) }; }
    if (/^[0-9.]+$/.test(tok)) return { type: "num", v: Number(tok) };
    if (/^[a-zA-Z]$/.test(tok)) return { type: "var", name: tok };
    if (tok === "\\pi") return { type: "num", v: Math.PI };
    if (GREEK.has(tok)) return { type: "var", name: tok.slice(1) };
    throw new Error("grup bekleniyordu: " + tok);
  }
  subscriptName() {
    // x_1, x_{k-m} → "x_1"
    if (this.peek() === "{") {
      let depth = 0, s = "";
      do { const t = this.next(); if (t === "{") depth++; else if (t === "}") depth--; s += t; } while (depth > 0);
      return s.slice(1, -1);
    }
    return this.next();
  }
  parsePrimary() {
    const tok = this.next();
    if (tok === undefined) throw new Error("beklenmeyen son");
    if (/^[0-9.]+$/.test(tok)) return { type: "num", v: Number(tok) };
    if (/^[a-zA-Z]$/.test(tok) || GREEK.has(tok)) {
      let name = tok.replace("\\", "");
      if (this.peek() === "_") { this.next(); name += "_" + this.subscriptName(); }
      return { type: "var", name };
    }
    if (tok === "\\pi") return { type: "num", v: Math.PI };
    if (tok === "\\infty") return { type: "num", v: Infinity };
    if (tok === "(" || tok === "[") {
      const close = tok === "(" ? ")" : "]";
      const saved = this.absDepth; this.absDepth = 0;
      const e = this.parseExpr();
      this.absDepth = saved;
      this.expect(close);
      return e;
    }
    if (tok === "{") {
      const saved = this.absDepth; this.absDepth = 0;
      const e = this.parseExpr();
      this.absDepth = saved;
      this.expect("}");
      return e;
    }
    if (tok === "|") {
      this.absDepth++;
      const e = this.parseExpr();
      this.absDepth--;
      this.expect("|");
      return { type: "abs", a: e };
    }
    if (tok === "\\lfloor") {
      const e = this.parseExpr();
      this.expect("\\rfloor");
      return { type: "floor", a: e };
    }
    if (tok === "\\frac" || tok === "\\dfrac" || tok === "\\tfrac") {
      const a = this.parseGroup();
      const b = this.parseGroup();
      return { type: "div", a, b };
    }
    if (tok === "\\dbinom" || tok === "\\binom" || tok === "\\tbinom") {
      const a = this.parseGroup();
      const b = this.parseGroup();
      return { type: "binom", a, b };
    }
    if (tok === "\\sqrt") {
      let idx = { type: "num", v: 2 };
      if (this.peek() === "[") { this.next(); idx = this.parseExpr(); this.expect("]"); }
      const a = this.parseGroup();
      return { type: "root", a, n: idx };
    }
    if (tok === "\\sum") {
      this.expect("_"); this.expect("{");
      const v = this.next(); this.expect("=");
      const from = this.parseExpr(); this.expect("}");
      this.expect("^");
      const to = this.parseGroup();
      const body = this.parseTerm();
      return { type: "sigma", v, from, to, body };
    }
    if (FUNCS.has(tok)) {
      let base = null, power = null;
      if (tok === "\\log" && this.peek() === "_") { this.next(); base = this.parseGroup(); }
      if (this.peek() === "^") { this.next(); power = this.parseGroup(); }
      let arg;
      if (this.peek() === "(") arg = this.parsePrimary();
      else arg = this.parseFuncArg();
      let node = { type: "fn", f: tok.slice(1), base, arg };
      if (power) node = { type: "pow", a: node, b: power };
      return node;
    }
    throw new Error("anlaşılamayan token: " + tok);
  }
  /* \sin 2x, \log_a x^n, \sin\dfrac{a}{2} — bir sonraki işleç ya da fonksiyona kadar */
  parseFuncArg() {
    let node = this.parsePostfix(this.parsePrimary());
    while (this.startsAtom(this.peek()) && !FUNCS.has(this.peek()) && this.peek() !== "\\sum") {
      node = { type: "mul", a: node, b: this.parsePostfix(this.parsePrimary()) };
    }
    return node;
  }
}

export function parse(src) {
  return new Parser(tokenize(src)).parseRelationTop();
}

function fact(n) {
  if (n < 0 || !Number.isInteger(Math.round(n * 1e9) / 1e9)) return NaN;
  let r = 1;
  for (let k = 2; k <= Math.round(n); k++) r *= k;
  return r;
}

export function evaluate(node, env) {
  const ev = (n, e = env) => evaluate(n, e);
  switch (node.type) {
    case "num": return node.v;
    case "var": {
      if (node.name in env) return env[node.name];
      if (node.name === "e") return Math.E;
      throw new Error("tanımsız değişken: " + node.name);
    }
    case "sum": return node.terms.reduce((s, t) => s + t.sign * ev(t.node), 0);
    case "mul": return ev(node.a) * ev(node.b);
    case "div": return ev(node.a) / ev(node.b);
    case "neg": return -ev(node.a);
    case "pow": return Math.pow(ev(node.a), ev(node.b));
    case "deg": return ev(node.a) * Math.PI / 180;
    case "fact": return fact(ev(node.a));
    case "abs": return Math.abs(ev(node.a));
    case "floor": return Math.floor(ev(node.a));
    case "root": {
      const a = ev(node.a), n = ev(node.n);
      if (a < 0 && Math.round(n) % 2 === 1) return -Math.pow(-a, 1 / n);
      return Math.pow(a, 1 / n);
    }
    case "binom": { const n = ev(node.a), r = ev(node.b); return fact(n) / (fact(r) * fact(n - r)); }
    case "sigma": {
      const from = ev(node.from);
      let to = ev(node.to);
      if (!Number.isFinite(to)) to = from + 200;
      let s = 0;
      for (let k = from; k <= to; k++) s += ev(node.body, { ...env, [node.v]: k });
      return s;
    }
    case "series": {
      const n = env.n;
      if (!Number.isInteger(n)) throw new Error("seri için n tam sayı olmalı");
      const first = ev(node.first, { ...env, n: 1 });
      const lastAt1 = ev(node.last, { ...env, n: 1 });
      if (Math.abs(first - lastAt1) > 1e-9) throw new Error("seri ilk terimi uyuşmuyor");
      let s = 0;
      for (let k = 1; k <= n; k++) s += ev(node.last, { ...env, n: k });
      return s;
    }
    case "deriv": {
      const x = env.x, h = 1e-5;
      return (ev(node.a, { ...env, x: x + h }) - ev(node.a, { ...env, x: x - h })) / (2 * h);
    }
    case "fn": {
      const a = ev(node.arg);
      switch (node.f) {
        case "sin": return Math.sin(a);
        case "cos": return Math.cos(a);
        case "tan": return Math.tan(a);
        case "cot": return 1 / Math.tan(a);
        case "sec": return 1 / Math.cos(a);
        case "csc": return 1 / Math.sin(a);
        case "ln": return Math.log(a);
        case "exp": return Math.exp(a);
        case "arcsin": return Math.asin(a);
        case "arccos": return Math.acos(a);
        case "arctan": return Math.atan(a);
        case "log": {
          const b = node.base ? ev(node.base) : 10;
          return Math.log(a) / Math.log(b);
        }
      }
      throw new Error("bilinmeyen fonksiyon " + node.f);
    }
    case "dots": throw new Error("tek başına \\dots");
  }
  throw new Error("bilinmeyen düğüm " + node.type);
}

/* ---------------- Mantık (önermeler) ---------------- */
export function parseBool(src) {
  const t = tokenize(src);
  let i = 0;
  const peek = () => t[i];
  const prim = () => {
    let tok = t[i++];
    let node;
    if (tok === "(") { node = iff(); if (t[i++] !== ")") throw new Error(") bekleniyordu"); }
    else if (tok === "0" || tok === "1") node = { k: "c", v: tok === "1" };
    else if (/^[a-z]$/.test(tok)) node = { k: "v", n: tok };
    else throw new Error("mantık token: " + tok);
    while (peek() === "'") { i++; node = { k: "not", a: node }; }
    return node;
  };
  const and = () => { let n = prim(); while (peek() === "\\land") { i++; n = { k: "and", a: n, b: prim() }; } return n; };
  const or = () => { let n = and(); while (peek() === "\\lor") { i++; n = { k: "or", a: n, b: and() }; } return n; };
  const imp = () => { let n = or(); while (peek() === "\\Rightarrow") { i++; n = { k: "imp", a: n, b: or() }; } return n; };
  const iff = () => { let n = imp(); while (peek() === "\\Leftrightarrow") { i++; n = { k: "iff", a: n, b: imp() }; } return n; };
  const n = iff();
  if (i < t.length) throw new Error("fazla mantık token");
  return n;
}
export function evalBool(n, env) {
  switch (n.k) {
    case "c": return n.v;
    case "v": return env[n.n];
    case "not": return !evalBool(n.a, env);
    case "and": return evalBool(n.a, env) && evalBool(n.b, env);
    case "or": return evalBool(n.a, env) || evalBool(n.b, env);
    case "imp": return !evalBool(n.a, env) || evalBool(n.b, env);
    case "iff": return evalBool(n.a, env) === evalBool(n.b, env);
  }
  throw new Error("mantık düğümü");
}
