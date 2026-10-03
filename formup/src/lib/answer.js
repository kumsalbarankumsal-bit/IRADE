/* Sayısal cevap ayrıştırma ve kontrol (virgüllü ondalık, kesir, eksi işareti) */
export function parseAnswer(s) {
  const t = String(s).trim().replace(/\s+/g, "").replaceAll(",", ".").replaceAll("−", "-");
  if (!t || /^[-.\/]*$/.test(t)) return NaN;
  if ((t.match(/\//g) || []).length > 1) return NaN;
  if (t.includes("/")) {
    const [a, b] = t.split("/");
    if (!/^-?\d+(\.\d+)?$/.test(a) || !/^-?\d+(\.\d+)?$/.test(b)) return NaN;
    return Number(b) === 0 ? NaN : Number(a) / Number(b);
  }
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return NaN;
  return Number(t);
}

/** Doğru mu? Tam değer kabul edilir. Ondalıklı yaklaşık değer yalnızca cevap o kadar basamakla
    tam yazılamıyorsa (1/3 gibi) ve doğru yuvarlanmışsa kabul edilir; 5/8 için yalnızca 0,625. */
export function isCorrect(input, gen) {
  const v = parseAnswer(input);
  if (!Number.isFinite(v)) return false;
  const tol = gen.tol ?? Math.max(1e-6, Math.abs(gen.a) * 1e-6);
  if (Math.abs(v - gen.a) <= tol) return true;
  const dec = String(input).split(/[.,]/)[1];
  if (!dec || dec.length < 2 || String(input).includes("/")) return false;
  // en çok 4 ondalıkla tam yazılabiliyorsa (0,625 gibi) tamını iste
  if (Math.abs(gen.a * 1e4 - Math.round(gen.a * 1e4)) < 1e-6) return false;
  const d = dec.length;
  const r = Math.round(gen.a * 10 ** d) / 10 ** d;
  return Math.abs(v - r) < 1e-9;
}
