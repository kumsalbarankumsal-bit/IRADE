/* Sayısal cevap ayrıştırma ve kontrol (virgüllü ondalık, kesir, eksi işareti) */
export function parseAnswer(s) {
  const t = String(s).trim().replace(/\s+/g, "").replace(",", ".").replace("−", "-");
  if (!t) return NaN;
  if (t.includes("/")) { const [a, b] = t.split("/"); return Number(b) === 0 ? NaN : Number(a) / Number(b); }
  return Number(t);
}
export function isCorrect(input, gen) {
  const v = parseAnswer(input);
  if (!Number.isFinite(v)) return false;
  const tol = gen.tol ?? Math.max(1e-6, Math.abs(gen.a) * 1e-6);
  if (Math.abs(v - gen.a) <= tol) return true;
  const dec = String(input).split(/[.,]/)[1];
  return !!(dec && dec.length >= 2 && Math.abs(v - gen.a) <= 0.5 * 10 ** -dec.length + 1e-9);
}
