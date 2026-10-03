/* Sayısal soru üreteçleri için yardımcılar.
   Üreteç sözleşmesi: (r) => ({ q, qe, a, tex, unit?, tol? })
     q   : Türkçe soru metni ($..$ ile TeX)
     qe  : aynı sorunun İngilizcesi
     a   : sayısal doğru cevap (sonlu sayı)
     tex : cevabın TeX gösterimi (kesirler \tfrac ile)
     unit: isteğe bağlı birim ("cm", "%", "°" …)
   r() 0–1 arası tohumlanmış rastgele sayı verir; Math.random kullanma. */

export const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
export const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
export const nCr = (n, k) => fact(n) / (fact(k) * fact(n - k));
/** "+3" / "-3" (işaretli yazım; ör. x^2${sgn(b)}x) */
export const sgn = (v) => (v < 0 ? `-${Math.abs(v)}` : `+${v}`);
/** TeX’te ondalık virgül: 2{,}5 */
export const num = (v) => String(Math.round(v * 1e6) / 1e6).replace(".", "{,}");

/** Sadeleştirilmiş kesir cevabı */
export function fr(p, q) {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(p, q) || 1;
  p /= g; q /= g;
  return { a: p / q, tex: q === 1 ? `${p}` : `${p < 0 ? "-" : ""}\\tfrac{${Math.abs(p)}}{${q}}` };
}
/** Tam sayı / ondalık cevap */
export const int = (v) => ({ a: v, tex: num(v) });
