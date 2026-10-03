/* Sayısal soru üreteçleri — “Uygula” modu ve Sayı Atölyesi oyunu için.
   Her üreteç rastgele sayılarla taze bir soru kurar:
     { q: "soru metni ($..$ içerebilir)", a: sayısal cevap, tex: cevabın gösterimi,
       tol?: kabul edilen mutlak hata, unit?: birim }
   Cevaplar tam sayı, kesir (3/4) ya da ondalık (0,75) olarak girilebilir. */

const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n, k) => fact(n) / (fact(k) * fact(n - k));
const sgn = (v) => (v < 0 ? `-${Math.abs(v)}` : `+${v}`); // "+3" / "-3"
const num = (v) => String(Math.round(v * 1e6) / 1e6).replace(".", "{,}");

/** Kesir cevabı: sadeleştirilmiş TeX ile */
function fr(p, q) {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(p, q) || 1;
  p /= g; q /= g;
  return { a: p / q, tex: q === 1 ? `${p}` : `${p < 0 ? "-" : ""}\\tfrac{${Math.abs(p)}}{${q}}` };
}
const int = (v) => ({ a: v, tex: num(v) });

const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];

export const GEN = {
  gauss: (r) => { const n = ri(r, 10, 60); return { q: `$1+2+3+\\dots+${n}$ toplamı kaçtır?`, ...int((n * (n + 1)) / 2) }; },
  cifttoplam: (r) => { const n = ri(r, 5, 30); return { q: `$2+4+6+\\dots+${2 * n}$ toplamı kaçtır?`, ...int(n * (n + 1)) }; },
  tektoplam: (r) => { const n = ri(r, 5, 30); return { q: `$1+3+5+\\dots+${2 * n - 1}$ toplamı kaçtır?`, ...int(n * n) }; },
  terimsayisi: (r) => {
    const d = ri(r, 2, 7), f = ri(r, 1, 20), n = ri(r, 8, 40), l = f + (n - 1) * d;
    return { q: `$${f},\\ ${f + d},\\ ${f + 2 * d},\\ \\dots,\\ ${l}$ dizisinde kaç terim vardır?`, ...int(n) };
  },
  ardisiktoplam: (r) => {
    const d = ri(r, 2, 6), f = ri(r, 1, 15), n = ri(r, 6, 20), l = f + (n - 1) * d;
    return { q: `$${f}+${f + d}+${f + 2 * d}+\\dots+${l}$ toplamı kaçtır?`, ...int(((f + l) * n) / 2) };
  },
  karetoplam: (r) => { const n = ri(r, 3, 12); return { q: `$1^2+2^2+\\dots+${n}^2$ toplamı kaçtır?`, ...int((n * (n + 1) * (2 * n + 1)) / 6) }; },
  kuptoplam: (r) => { const n = ri(r, 3, 10); return { q: `$1^3+2^3+\\dots+${n}^3$ toplamı kaçtır?`, ...int(((n * (n + 1)) / 2) ** 2) }; },
  basamak: (r) => { const s = ri(r, 3, 17); return { q: `$a+b=${s}$ ise $\\overline{ab}+\\overline{ba}$ kaçtır?`, ...int(11 * s) }; },
  taban: (r) => {
    const n = ri(r, 3, 9), a = ri(r, 1, n - 1), b = ri(r, 0, n - 1), c = ri(r, 0, n - 1);
    return { q: `$(${a}${b}${c})_{${n}}$ sayısının onluk tabandaki değeri kaçtır?`, ...int(a * n * n + b * n + c) };
  },
  devirli: (r) => {
    const a = ri(r, 1, 8), b = ri(r, 1, 9);
    return { q: `$0{,}${a}\\overline{${b}}$ sayısını kesir olarak yaz.`, ...fr(10 * a + b - a, 90) };
  },
  bolme: (r) => {
    const B = ri(r, 3, 12), Cq = ri(r, 5, 30), K = ri(r, 0, B - 1);
    if (r() < 0.5) return { q: `Bir sayı ${B} ile bölündüğünde bölüm ${Cq}, kalan ${K} oluyor. Bu sayı kaçtır?`, ...int(B * Cq + K) };
    return { q: `$${B * Cq + K}$ sayısının $${B}$ ile bölümünden kalan kaçtır?`, ...int(K) };
  },
  bolensayisi: (r) => {
    let n, cnt, parts;
    do {
      const e2 = ri(r, 0, 4), e3 = ri(r, 0, 3), e5 = ri(r, 0, 2), e7 = ri(r, 0, 1);
      n = 2 ** e2 * 3 ** e3 * 5 ** e5 * 7 ** e7;
      cnt = (e2 + 1) * (e3 + 1) * (e5 + 1) * (e7 + 1);
      parts = [e2, e3, e5, e7].filter(Boolean).length;
    } while (n > 3000 || n < 12 || parts < 2);
    return { q: `$${n}$ sayısının kaç pozitif böleni vardır?`, ...int(cnt) };
  },
  ebobekok: (r) => {
    const g = ri(r, 2, 9);
    let m, k;
    do { m = ri(r, 2, 9); k = ri(r, 2, 9); } while (m === k || gcd(m, k) !== 1);
    const A = g * m, B = g * k;
    return { q: `$\\text{EBOB}(${A},${B})=${g}$ olduğuna göre $\\text{EKOK}(${A},${B})$ kaçtır?`, ...int((A * B) / g) };
  },
  sifirsayisi: (r) => {
    const n = ri(r, 25, 130);
    return { q: `$${n}!$ sayısının sonunda kaç tane sıfır vardır?`, ...int(Math.floor(n / 5) + Math.floor(n / 25) + Math.floor(n / 125)) };
  },
  uscarpim: (r) => {
    const b = pick(r, [2, 3, 5]), m = ri(r, -4, 7), n = ri(r, -4, 7), k = ri(r, 1, 4);
    if (r() < 0.5) return { q: `$${b}^{${m}}\\cdot ${b}^{${n}}=${b}^{x}$ ise $x$ kaçtır?`, ...int(m + n) };
    return { q: `$\\dfrac{${b}^{${m}}\\cdot ${b}^{${n}}}{${b}^{${k}}}=${b}^{x}$ ise $x$ kaçtır?`, ...int(m + n - k) };
  },
  kokus: (r) => {
    const b = pick(r, [2, 3, 5, 7]), m = ri(r, 1, 7), n = ri(r, 2, 5);
    return { q: `$\\sqrt[${n}]{${b}^{${m}}}=${b}^{x}$ ise $x$ kaçtır?`, ...fr(m, n) };
  },
  tamkare: (r) => {
    const base = pick(r, [20, 30, 50, 100]), k = ri(r, 1, 9);
    return { q: `$${base + k}^2$ kaçtır? (İpucu: $(${base}+${k})^2$)`, ...int((base + k) ** 2) };
  },
  farkkare: (r) => {
    const base = pick(r, [30, 50, 100, 200]), k = ri(r, 1, 9);
    return { q: `$${base - k}^2$ kaçtır? (İpucu: $(${base}-${k})^2$)`, ...int((base - k) ** 2) };
  },
  ikikare: (r) => {
    const m = pick(r, [20, 30, 40, 50, 60, 70, 80, 100]), k = ri(r, 1, 9);
    return { q: `$${m + k}\\cdot ${m - k}$ çarpımı kaçtır?`, ...int(m * m - k * k) };
  },
  karetoplamdon: (r) => {
    const a = ri(r, -6, 9), b = ri(r, 1, 9);
    return { q: `$a+b=${a + b}$ ve $a\\cdot b=${a * b}$ ise $a^2+b^2$ kaçtır?`, ...int(a * a + b * b) };
  },
  xters: (r) => {
    const t = ri(r, 2, 7);
    if (r() < 0.6) return { q: `$x+\\dfrac{1}{x}=${t}$ ise $x^2+\\dfrac{1}{x^2}$ kaçtır?`, ...int(t * t - 2) };
    return { q: `$x-\\dfrac{1}{x}=${t}$ ise $x^2+\\dfrac{1}{x^2}$ kaçtır?`, ...int(t * t + 2) };
  },
  kar: (r) => {
    const M = 20 * ri(r, 2, 25), pct = pick(r, [10, 20, 25, 30, 40, 50, 60, 75]);
    return { q: `$${M}$ TL’ye alınan bir ürün $${(M * (100 + pct)) / 100}$ TL’ye satılıyor. Kâr yüzdesi kaçtır?`, ...int(pct), unit: "%" };
  },
  yuzde: (r) => {
    const a = pick(r, [10, 20, 25, 50]), b = pick(r, [10, 20, 25, 40]);
    return { q: `Bir ürüne önce %${a} zam, sonra yeni fiyat üzerinden %${b} indirim yapılıyor. Son fiyat, ilk fiyatın yüzde kaçıdır?`, ...int(((100 + a) * (100 - b)) / 100), unit: "%" };
  },
  hiz: (r) => {
    const v = 5 * ri(r, 8, 24), t = ri(r, 2, 6);
    if (r() < 0.5) return { q: `Saatte ${v} km hızla giden bir araç ${t} saatte kaç km yol alır?`, ...int(v * t), unit: "km" };
    return { q: `${v * t} km’lik yolu saatte ${v} km hızla giden bir araç kaç saatte alır?`, ...int(t), unit: "saat" };
  },
  karsilasma: (r) => {
    const v1 = 10 * ri(r, 4, 9), v2 = 10 * ri(r, 3, 8), t = ri(r, 2, 5);
    return { q: `Aralarında ${(v1 + v2) * t} km olan iki araç saatte ${v1} km ve ${v2} km hızla birbirine doğru yola çıkıyor. Kaç saat sonra karşılaşırlar?`, ...int(t), unit: "saat" };
  },
  yetisme: (r) => {
    const v2 = 10 * ri(r, 4, 8), v1 = v2 + 10 * ri(r, 1, 3), t = ri(r, 2, 6);
    return { q: `Saatte ${v2} km hızla giden bir aracı, ${(v1 - v2) * t} km geriden aynı yönde saatte ${v1} km hızla gelen bir araç kaç saatte yakalar?`, ...int(t), unit: "saat" };
  },
  isci: (r) => {
    const [a, b] = pick(r, [[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [10, 40], [8, 24], [9, 18], [5, 20], [6, 3]]);
    return { q: `Bir işi Ali tek başına ${a} saatte, Ece tek başına ${b} saatte bitiriyor. Birlikte kaç saatte bitirirler?`, ...int((a * b) / (a + b)), unit: "saat" };
  },
  havuz: (r) => {
    const [m, g] = pick(r, [[4, 12], [3, 6], [6, 12], [2, 6], [4, 6], [6, 10], [3, 12], [10, 15], [2, 3]]);
    return { q: `Bir musluk boş havuzu ${m} saatte dolduruyor, dipteki gider dolu havuzu ${g} saatte boşaltıyor. İkisi birlikte açılırsa boş havuz kaç saatte dolar?`, ...int((m * g) / (g - m)), unit: "saat" };
  },
  karisim: (r) => {
    let m1, m2, p1, p2, p;
    do {
      m1 = 100 * ri(r, 1, 5); m2 = 100 * ri(r, 1, 5); p1 = 5 * ri(r, 1, 6); p2 = 5 * ri(r, 3, 10);
      p = (m1 * p1 + m2 * p2) / (m1 + m2);
    } while (!Number.isInteger(p) || p1 === p2);
    return { q: `%${p1}’lik ${m1} g tuzlu su ile %${p2}’lik ${m2} g tuzlu su karıştırılıyor. Karışım yüzde kaç tuzludur?`, ...int(p), unit: "%" };
  },
  ortalama: (r) => {
    const n = ri(r, 4, 6), xs = Array.from({ length: n }, () => ri(r, 10, 99));
    const s = xs.reduce((a, b) => a + b, 0);
    xs[n - 1] += (n - (s % n)) % n;
    const mean = xs.reduce((a, b) => a + b, 0) / n;
    return { q: `$${xs.join(",\\ ")}$ sayılarının aritmetik ortalaması kaçtır?`, ...int(mean) };
  },
  ortalamahiz: (r) => {
    const [a, b] = pick(r, [[60, 90], [40, 60], [30, 60], [60, 120], [20, 30], [50, 75], [45, 90], [30, 70], [80, 120]]);
    return { q: `Bir araç A’dan B’ye saatte ${a} km, B’den A’ya saatte ${b} km hızla gidiyor. Tüm yolculuğun ortalama hızı kaç km/sa’tir?`, ...int((2 * a * b) / (a + b)), unit: "km/sa" };
  },
  faiz: (r) => {
    const A = 1000 * ri(r, 2, 20), n = pick(r, [5, 10, 12, 15, 20, 25, 30, 40]), t = ri(r, 1, 4);
    return { q: `${A} TL, yıllık %${n} basit faizle ${t} yıl bankada kalıyor. Faiz geliri kaç TL’dir?`, ...int((A * n * t) / 100), unit: "TL" };
  },
  kumebirlesim: (r) => {
    const ab = ri(r, 2, 10), a = ab + ri(r, 3, 15), b = ab + ri(r, 3, 15);
    return { q: `$s(A)=${a}$, $s(B)=${b}$, $s(A\\cap B)=${ab}$ ise $s(A\\cup B)$ kaçtır?`, ...int(a + b - ab) };
  },
  altkume: (r) => {
    const n = ri(r, 3, 8);
    if (r() < 0.5) return { q: `${n} elemanlı bir kümenin kaç alt kümesi vardır?`, ...int(2 ** n) };
    return { q: `${n} elemanlı bir kümenin kaç öz alt kümesi vardır?`, ...int(2 ** n - 1) };
  },
  bileske: (r) => {
    const a = ri(r, 2, 5), b = ri(r, -5, 5), c = ri(r, 2, 4), d = ri(r, -4, 4), x = ri(r, -3, 4);
    return { q: `$f(x)=${a}x${sgn(b)}$ ve $g(x)=${c}x${sgn(d)}$ ise $(f\\circ g)(${x})$ kaçtır?`, ...int(a * (c * x + d) + b) };
  },
  tersfonk: (r) => {
    const a = pick(r, [2, 3, 4, 5]), b = ri(r, -9, 9), x = ri(r, -5, 8);
    return { q: `$f(x)=${a}x${sgn(b)}$ ise $f^{-1}(${a * x + b})$ kaçtır?`, ...int(x) };
  },
  fonksayisi: (r) => {
    const m = ri(r, 2, 4), n = ri(r, 2, 4);
    return { q: `$s(A)=${m}$ ve $s(B)=${n}$ ise $A$’dan $B$’ye kaç farklı fonksiyon tanımlanabilir?`, ...int(n ** m) };
  },
  perm: (r) => {
    const n = ri(r, 5, 9), k = ri(r, 2, 3);
    return { q: `${n} kişilik bir sınıftan bir başkan ve bir yardımcı${k === 3 ? " ve bir sekreter" : ""} kaç farklı şekilde seçilebilir?`, ...int(fact(n) / fact(n - k)) };
  },
  komb: (r) => {
    const n = ri(r, 5, 12), k = ri(r, 2, 4);
    return { q: `${n} kişi arasından ${k} kişilik bir ekip kaç farklı şekilde seçilebilir?`, ...int(C(n, k)) };
  },
  tekrarli: (r) => {
    const w = pick(r, ["ANANAS", "KALKAN", "BABA", "ARABA", "KELEBEK", "MATEMATİK", "KAYAK", "TEPETEPE"]);
    const counts = {};
    for (const ch of w) counts[ch] = (counts[ch] || 0) + 1;
    const v = Object.values(counts).reduce((acc, c) => acc / fact(c), fact(w.length));
    return { q: `${w} kelimesinin harfleriyle anlamlı ya da anlamsız kaç farklı kelime yazılabilir?`, ...int(v) };
  },
  dairesel: (r) => { const n = ri(r, 4, 8); return { q: `${n} kişi yuvarlak bir masanın etrafına kaç farklı şekilde oturabilir?`, ...int(fact(n - 1)) }; },
  olasilik: (r) => {
    const k = ri(r, 2, 8), m = ri(r, 2, 8);
    return { q: `Bir torbada ${k} kırmızı ve ${m} mavi top var. Rastgele çekilen bir topun kırmızı olma olasılığı kaçtır?`, ...fr(k, k + m) };
  },
  bagimsiz: (r) => {
    const opts = [
      ["Bir zar ve bir para atılıyor. Zarın 6, paranın yazı gelme olasılığı kaçtır?", 1, 12],
      ["İki zar atılıyor. İkisinin de çift gelme olasılığı kaçtır?", 1, 4],
      ["Bir para 3 kez atılıyor. Üçünün de tura gelme olasılığı kaçtır?", 1, 8],
      ["İki zar atılıyor. İlkinin 3’ten büyük, ikincinin asal gelme olasılığı kaçtır?", 1, 4],
      ["Bir zar iki kez atılıyor. İkisinde de 5 gelme olasılığı kaçtır?", 1, 36],
    ];
    const [q, p, s] = pick(r, opts);
    return { q, ...fr(p, s) };
  },
  kalan: (r) => {
    const b = ri(r, -5, 5), c = ri(r, -9, 9), a = ri(r, -3, 3);
    const P = (x) => x ** 3 + b * x + c;
    const div = a === 0 ? "x" : a > 0 ? `x-${a}` : `x+${-a}`;
    return { q: `$P(x)=x^3${b ? sgn(b) + "x" : ""}${c ? sgn(c) : ""}$ polinomunun $${div}$ ile bölümünden kalan kaçtır?`, ...int(P(a)) };
  },
  delta: (r) => {
    const a = ri(r, 1, 4), b = ri(r, -9, 9), c = ri(r, -6, 6);
    return { q: `$${a === 1 ? "" : a}x^2${b ? sgn(b) + "x" : ""}${c ? sgn(c) : ""}=0$ denkleminin diskriminantı ($\\Delta$) kaçtır?`, ...int(b * b - 4 * a * c) };
  },
  kokbul: (r) => {
    let x1, x2;
    do { x1 = ri(r, -6, 9); x2 = ri(r, -6, 9); } while (x1 === x2);
    const s = x1 + x2, p = x1 * x2;
    return { q: `$x^2${s ? sgn(-s) + "x" : ""}${p ? sgn(p) : ""}=0$ denkleminin büyük kökü kaçtır?`, ...int(Math.max(x1, x2)) };
  },
  koktoplam: (r) => {
    const a = ri(r, 1, 5), b = ri(r, -12, 12) || 3, c = ri(r, -9, 9) || 2;
    return { q: `$${a === 1 ? "" : a}x^2${sgn(b)}x${sgn(c)}=0$ denkleminin kökler toplamı kaçtır?`, ...fr(-b, a) };
  },
  kokcarpim: (r) => {
    const a = ri(r, 1, 5), b = ri(r, -9, 9) || 4, c = ri(r, -12, 12) || 3;
    return { q: `$${a === 1 ? "" : a}x^2${sgn(b)}x${sgn(c)}=0$ denkleminin kökler çarpımı kaçtır?`, ...fr(c, a) };
  },
  tepe: (r) => {
    const h = ri(r, -5, 5), b = -2 * h, c = ri(r, -8, 8);
    const k = h * h + b * h + c;
    return { q: `$f(x)=x^2${b ? sgn(b) + "x" : ""}${c ? sgn(c) : ""}$ parabolünün tepe noktasının ordinatı (en küçük değeri) kaçtır?`, ...int(k) };
  },
  ikuvvet: (r) => {
    const n = 4 * ri(r, 5, 500) + pick(r, [0, 2]);
    return { q: `$i^2=-1$ olmak üzere $i^{${n}}$ kaçtır?`, ...int(n % 4 === 0 ? 1 : -1) };
  },
  ozelaci: (r) => {
    const items = [
      ["\\sin 30^\\circ+\\cos 60^\\circ", 1, 1], ["\\sin^2 45^\\circ", 1, 2], ["\\tan^2 60^\\circ", 3, 1],
      ["\\cos^2 30^\\circ", 3, 4], ["2\\sin 30^\\circ\\cdot\\cos 60^\\circ", 1, 2], ["\\tan 45^\\circ+\\cos 0^\\circ", 2, 1],
      ["\\sin^2 60^\\circ+\\cos^2 45^\\circ", 5, 4], ["\\tan 30^\\circ\\cdot\\tan 60^\\circ", 1, 1], ["4\\sin^2 30^\\circ", 1, 1],
      ["\\cos 180^\\circ+\\sin 90^\\circ", 0, 1],
    ];
    const [e, p, q] = pick(r, items);
    return { q: `$${e}$ ifadesinin değeri kaçtır?`, ...fr(p, q) };
  },
  pisagortrig: (r) => {
    const [a, b, c] = pick(r, TRIPLES.slice(0, 4));
    return { q: `$x$ dar açı ve $\\sin x=\\dfrac{${a}}{${c}}$ ise $\\cos x$ kaçtır?`, ...fr(b, c) };
  },
  sin2x: (r) => {
    const [a, b, c] = pick(r, TRIPLES.slice(0, 4));
    return { q: `$x$ dar açı, $\\sin x=\\dfrac{${a}}{${c}}$ ve $\\cos x=\\dfrac{${b}}{${c}}$ ise $\\sin 2x$ kaçtır?`, ...fr(2 * a * b, c * c) };
  },
  sinusteo: (r) => {
    const a = ri(r, 2, 12), A = pick(r, [30, 90, 150]);
    const R = A === 90 ? a / 2 : a;
    return { q: `Bir $ABC$ üçgeninde $a=${a}$ ve $\\hat A=${A}^\\circ$ ise çevrel çemberin yarıçapı kaçtır?`, ...int(R) };
  },
  kosinusteo: (r) => {
    const b = ri(r, 2, 9), c = ri(r, 2, 9), A = pick(r, [60, 90, 120]);
    const a2 = A === 60 ? b * b + c * c - b * c : A === 90 ? b * b + c * c : b * b + c * c + b * c;
    return { q: `Bir üçgende $b=${b}$, $c=${c}$ ve $\\hat A=${A}^\\circ$ ise $a^2$ kaçtır?`, ...int(a2) };
  },
  sinalan: (r) => {
    const b = 2 * ri(r, 1, 8), c = 2 * ri(r, 1, 8), A = pick(r, [30, 90, 150]);
    return { q: `Bir üçgende $b=${b}$, $c=${c}$ ve $\\hat A=${A}^\\circ$ ise üçgenin alanı kaçtır?`, ...int(A === 90 ? (b * c) / 2 : (b * c) / 4) };
  },
  radyan: (r) => {
    const D = pick(r, [30, 45, 60, 90, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330]);
    return { q: `$${D}^\\circ$ kaç radyandır? Cevap $k\\pi$ ise $k$’yı yaz.`, ...fr(D, 180) };
  },
  periyot: (r) => {
    const a = pick(r, [2, 3, 4, 5, 6]), b = ri(r, 1, 5), f = pick(r, ["\\sin", "\\cos"]);
    return { q: `$f(x)=${f}(${a}x+${b})$ fonksiyonunun esas periyodu $k\\pi$ ise $k$ kaçtır?`, ...fr(2, a) };
  },
  logtanim: (r) => {
    const b = pick(r, [2, 3, 5, 10]), e = ri(r, -3, 6);
    const arg = e >= 0 ? `${b ** e}` : `\\tfrac{1}{${b ** -e}}`;
    return { q: `$\\log_{${b}} ${arg}$ kaçtır?`, ...int(e) };
  },
  basamaksayisi: (r) => {
    const n = ri(r, 20, 120);
    const digits = (2n ** BigInt(n)).toString().length;
    return { q: `$\\log 2\\approx 0{,}30103$ olduğuna göre $2^{${n}}$ sayısı kaç basamaklıdır?`, ...int(digits) };
  },
  aritgenel: (r) => {
    const a1 = ri(r, -10, 20), d = ri(r, -5, 8) || 3, n = ri(r, 8, 40);
    return { q: `İlk terimi $${a1}$, ortak farkı $${d}$ olan aritmetik dizinin $${n}$. terimi kaçtır?`, ...int(a1 + (n - 1) * d) };
  },
  arittop: (r) => {
    const a1 = ri(r, 1, 20), d = ri(r, 1, 6), n = ri(r, 5, 25);
    return { q: `İlk terimi $${a1}$, ortak farkı $${d}$ olan aritmetik dizinin ilk $${n}$ teriminin toplamı kaçtır?`, ...int((n * (2 * a1 + (n - 1) * d)) / 2) };
  },
  geogenel: (r) => {
    const a1 = ri(r, 1, 5), q = pick(r, [2, 3, -2]), n = ri(r, 4, 8);
    return { q: `İlk terimi $${a1}$, ortak çarpanı $${q}$ olan geometrik dizinin $${n}$. terimi kaçtır?`, ...int(a1 * q ** (n - 1)) };
  },
  geotop: (r) => {
    const a1 = ri(r, 1, 5), q = pick(r, [2, 3]), n = ri(r, 4, 8);
    return { q: `İlk terimi $${a1}$, ortak çarpanı $${q}$ olan geometrik dizinin ilk $${n}$ teriminin toplamı kaçtır?`, ...int((a1 * (q ** n - 1)) / (q - 1)) };
  },
  sonsuzgeo: (r) => {
    const a1 = ri(r, 1, 12), [p, q] = pick(r, [[1, 2], [1, 3], [1, 4], [2, 3], [-1, 2], [-1, 3]]);
    const rt = q === 1 ? `${p}` : `${p < 0 ? "-" : ""}\\tfrac{${Math.abs(p)}}{${q}}`;
    return { q: `İlk terimi $${a1}$, ortak çarpanı $${rt}$ olan sonsuz geometrik serinin toplamı kaçtır?`, ...fr(a1 * q, q - p) };
  },
  limsin: (r) => {
    const a = ri(r, 2, 12), b = ri(r, 2, 9);
    return { q: `$\\displaystyle\\lim_{x\\to 0}\\frac{\\sin ${a}x}{${b}x}$ kaçtır?`, ...fr(a, b) };
  },
  hospital: (r) => {
    const a = ri(r, 1, 6);
    if (r() < 0.5) return { q: `$\\displaystyle\\lim_{x\\to ${a}}\\frac{x^2-${a * a}}{x-${a}}$ kaçtır?`, ...int(2 * a) };
    return { q: `$\\displaystyle\\lim_{x\\to ${a}}\\frac{x^3-${a ** 3}}{x-${a}}$ kaçtır?`, ...int(3 * a * a) };
  },
  limrasyonel: (r) => {
    const p = ri(r, 1, 9), q = ri(r, 1, 9), b = ri(r, -7, 7), c = ri(r, 1, 9);
    return { q: `$\\displaystyle\\lim_{x\\to\\infty}\\frac{${p}x^2${b ? sgn(b) + "x" : ""}+1}{${q}x^2+${c}}$ kaçtır?`, ...fr(p, q) };
  },
  turevxn: (r) => {
    const c = ri(r, 1, 6), n = ri(r, 2, 5), x = ri(r, -2, 3);
    return { q: `$f(x)=${c === 1 ? "" : c}x^{${n}}$ ise $f'(${x})$ kaçtır?`, ...int(c * n * x ** (n - 1)) };
  },
  zincir: (r) => {
    const a = ri(r, 2, 4), b = ri(r, -3, 3), n = ri(r, 2, 4), x = ri(r, -1, 2);
    return { q: `$f(x)=(${a}x${b ? sgn(b) : ""})^{${n}}$ ise $f'(${x})$ kaçtır?`, ...int(n * a * (a * x + b) ** (n - 1)) };
  },
  teget: (r) => {
    const b = ri(r, -6, 6), c = ri(r, -5, 5), a = ri(r, -3, 4);
    return { q: `$f(x)=x^2${b ? sgn(b) + "x" : ""}${c ? sgn(c) : ""}$ eğrisine $x=${a}$ apsisli noktadan çizilen teğetin eğimi kaçtır?`, ...int(2 * a + b) };
  },
  intxn: (r) => {
    const n = ri(r, 1, 3), k = ri(r, 1, 3), c = n + 1;
    return { q: `$\\displaystyle\\int_0^{${k}} ${c}x^{${n}}\\,dx$ kaçtır?`, ...int(k ** (n + 1)) };
  },
  belirli: (r) => {
    const p = 2 * ri(r, 1, 4), q = ri(r, -5, 5), a = ri(r, 0, 2), b = a + ri(r, 1, 3);
    const F = (x) => (p / 2) * x * x + q * x;
    return { q: `$\\displaystyle\\int_{${a}}^{${b}}(${p}x${q ? sgn(q) : ""})\\,dx$ kaçtır?`, ...int(F(b) - F(a)) };
  },
  pisagor: (r) => {
    const [a, b, c] = pick(r, TRIPLES);
    if (r() < 0.5) return { q: `Dik kenarları ${a} ve ${b} olan dik üçgenin hipotenüsü kaçtır?`, ...int(c) };
    return { q: `Hipotenüsü ${c}, bir dik kenarı ${a} olan dik üçgenin diğer dik kenarı kaçtır?`, ...int(b) };
  },
  oklid: (r) => {
    const [p, k] = pick(r, [[1, 4], [4, 9], [2, 8], [3, 12], [9, 16], [1, 9], [4, 16], [2, 18], [3, 27], [8, 18]]);
    return { q: `Bir dik üçgende hipotenüse ait yükseklik hipotenüsü ${p} ve ${k} uzunluğunda iki parçaya ayırıyor. Yükseklik kaçtır?`, ...int(Math.sqrt(p * k)) };
  },
  ozelucgen: (r) => {
    const k = ri(r, 2, 12);
    if (r() < 0.5) return { q: `30°-60°-90° üçgeninde 30°’nin karşısındaki kenar ${k} ise hipotenüs kaçtır?`, ...int(2 * k) };
    return { q: `30°-60°-90° üçgeninde hipotenüs ${2 * k} ise 30°’nin karşısındaki kenar kaçtır?`, ...int(k) };
  },
  ucgenesitsizlik: (r) => {
    const b = ri(r, 3, 12), c = ri(r, 3, 12);
    return { q: `Kenar uzunlukları ${b}, ${c} ve $a$ olan bir üçgende $a$ kaç farklı tam sayı değeri alabilir?`, ...int(2 * Math.min(b, c) - 1) };
  },
  heron: (r) => {
    const [a, b, c, A] = pick(r, [[13, 14, 15, 84], [5, 5, 6, 12], [5, 5, 8, 12], [10, 13, 13, 60], [6, 8, 10, 24], [7, 15, 20, 42], [9, 10, 17, 36], [3, 4, 5, 6]]);
    return { q: `Kenarları ${a}, ${b} ve ${c} olan üçgenin alanı kaçtır?`, ...int(A) };
  },
  eskenar: (r) => {
    const a = 2 * ri(r, 1, 7);
    return { q: `Kenarı ${a} olan eşkenar üçgenin alanı $k\\sqrt3$ ise $k$ kaçtır?`, ...int((a * a) / 4) };
  },
  aciortay: (r) => {
    // |BD| = a·c/(b+c) tam sayı olsun ve üçgen eşitsizliği sağlansın
    const [c, b] = pick(r, [[6, 9], [4, 6], [5, 10], [8, 12], [6, 10], [9, 12], [10, 15]]);
    const step = (b + c) / gcd(c, b + c);
    const opts = [];
    for (let a = step; a < b + c; a += step) if (a > Math.abs(b - c)) opts.push(a);
    const a = pick(r, opts);
    return { q: `$ABC$ üçgeninde $[AD]$ iç açıortay, $|AB|=${c}$, $|AC|=${b}$, $|BC|=${a}$ ise $|BD|$ kaçtır?`, ...int((a * c) / (b + c)) };
  },
  icaci: (r) => { const n = ri(r, 5, 12); return { q: `${n} kenarlı bir çokgenin iç açıları toplamı kaç derecedir?`, ...int((n - 2) * 180), unit: "°" }; },
  disaci: (r) => {
    const n = pick(r, [5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 36]);
    return { q: `Düzgün ${n}-genin bir dış açısı kaç derecedir?`, ...int(360 / n), unit: "°" };
  },
  kosegen: (r) => { const n = ri(r, 5, 15); return { q: `${n} kenarlı bir çokgenin kaç köşegeni vardır?`, ...int((n * (n - 3)) / 2) }; },
  yamuk: (r) => {
    const a = ri(r, 6, 20), c = ri(r, 2, a - 1), h = 2 * ri(r, 1, 6);
    return { q: `Tabanları ${a} ve ${c}, yüksekliği ${h} olan yamuğun alanı kaçtır?`, ...int(((a + c) * h) / 2) };
  },
  cevre: (r) => { const R = ri(r, 2, 15); return { q: `Yarıçapı ${R} olan çemberin çevresi $k\\pi$ ise $k$ kaçtır?`, ...int(2 * R) }; },
  dairealan: (r) => { const R = ri(r, 2, 15); return { q: `Yarıçapı ${R} olan dairenin alanı $k\\pi$ ise $k$ kaçtır?`, ...int(R * R) }; },
  yay: (r) => {
    const [R, al] = pick(r, [[6, 60], [9, 40], [12, 30], [10, 72], [3, 120], [8, 45], [18, 20], [5, 144]]);
    return { q: `Yarıçapı ${R} olan çemberde ${al}°’lik merkez açının gördüğü yayın uzunluğu $k\\pi$ ise $k$ kaçtır?`, ...fr(2 * R * al, 360) };
  },
  dilim: (r) => {
    const [R, al] = pick(r, [[6, 60], [6, 90], [12, 30], [10, 36], [3, 120], [4, 45], [9, 40], [8, 90]]);
    return { q: `Yarıçapı ${R}, merkez açısı ${al}° olan daire diliminin alanı $k\\pi$ ise $k$ kaçtır?`, ...fr(R * R * al, 360) };
  },
  cemberdenklem: (r) => {
    const a = ri(r, -5, 5), b = ri(r, -5, 5), R = ri(r, 2, 9);
    const px = a === 0 ? "x^2" : `(x${sgn(-a)})^2`, py = b === 0 ? "y^2" : `(y${sgn(-b)})^2`;
    return { q: `$${px}+${py}=${R * R}$ çemberinin yarıçapı kaçtır?`, ...int(R) };
  },
  uzaklik: (r) => {
    const [dx, dy, d] = pick(r, TRIPLES.slice(0, 5)), x1 = ri(r, -5, 5), y1 = ri(r, -5, 5);
    const sx = r() < 0.5 ? 1 : -1, sy = r() < 0.5 ? 1 : -1;
    return { q: `$A(${x1},${y1})$ ve $B(${x1 + sx * dx},${y1 + sy * dy})$ noktaları arasındaki uzaklık kaçtır?`, ...int(d) };
  },
  ortanokta: (r) => {
    const x1 = ri(r, -8, 8), y1 = ri(r, -8, 8), x2 = x1 + 2 * ri(r, -5, 5), y2 = y1 + 2 * ri(r, -5, 5);
    return { q: `$A(${x1},${y1})$ ve $B(${x2},${y2})$ ise $[AB]$’nin orta noktasının koordinatları toplamı kaçtır?`, ...int((x1 + x2) / 2 + (y1 + y2) / 2) };
  },
  egim: (r) => {
    let x1, x2;
    do { x1 = ri(r, -6, 6); x2 = ri(r, -6, 6); } while (x1 === x2);
    const y1 = ri(r, -6, 6), y2 = ri(r, -6, 6);
    return { q: `$A(${x1},${y1})$ ve $B(${x2},${y2})$ noktalarından geçen doğrunun eğimi kaçtır?`, ...fr(y2 - y1, x2 - x1) };
  },
  noktadogru: (r) => {
    const x0 = ri(r, -4, 6), y0 = ri(r, -4, 6), d = ri(r, 1, 6), s = r() < 0.5 ? 1 : -1;
    const c = s * 5 * d - 3 * x0 - 4 * y0;
    return { q: `$P(${x0},${y0})$ noktasının $3x+4y${sgn(c)}=0$ doğrusuna uzaklığı kaçtır?`, ...int(d) };
  },
  silindir: (r) => { const R = ri(r, 1, 6), h = ri(r, 2, 10); return { q: `Taban yarıçapı ${R}, yüksekliği ${h} olan silindirin hacmi $k\\pi$ ise $k$ kaçtır?`, ...int(R * R * h) }; },
  koni: (r) => { const R = ri(r, 1, 6), h = 3 * ri(r, 1, 4); return { q: `Taban yarıçapı ${R}, yüksekliği ${h} olan koninin hacmi $k\\pi$ ise $k$ kaçtır?`, ...int((R * R * h) / 3) }; },
  kure: (r) => { const R = pick(r, [3, 6, 2, 1]); return { q: `Yarıçapı ${R} olan kürenin hacmi $k\\pi$ ise $k$ kaçtır?`, ...fr(4 * R ** 3, 3) }; },
  det2: (r) => {
    const a = ri(r, -5, 9), b = ri(r, -5, 9), c = ri(r, -5, 9), d = ri(r, -5, 9);
    return { q: `$\\begin{vmatrix}${a}&${b}\\\\${c}&${d}\\end{vmatrix}$ determinantı kaçtır?`, ...int(a * d - b * c) };
  },
  bayes: (r) => {
    const [d, sens, fp] = pick(r, [[20, 90, 5], [10, 90, 10], [50, 80, 10], [40, 75, 5], [100, 90, 20]]);
    const N = 1000, tp = (d * sens) / 100, fpos = ((N - d) * fp) / 100;
    return { q: `1000 kişinin ${d}’si hasta. Test hastaların %${sens}’ini, sağlamların %${fp}’ini pozitif buluyor. Testi pozitif çıkan birinin hasta olma olasılığı kaçtır? (kesir)`, ...fr(tp, tp + fpos) };
  },
  binomdag: (r) => {
    const n = ri(r, 3, 6), k = ri(r, 0, n);
    return { q: `Hilesiz bir para ${n} kez atılıyor. Tam ${k} kez yazı gelme olasılığı kaçtır?`, ...fr(C(n, k), 2 ** n) };
  },
  zskor: (r) => {
    const mu = 5 * ri(r, 10, 16), sd = pick(r, [4, 5, 8, 10]), z = pick(r, [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]);
    return { q: `Ortalaması ${mu}, standart sapması ${sd} olan bir sınavda ${mu + z * sd} alan öğrencinin z-skoru kaçtır?`, ...int(z) };
  },
};

/** Kullanıcı girdisini sayıya çevir: "3/4", "-2", "0,75", "1.5" */
export function parseAnswer(s) {
  if (s == null) return NaN;
  const t = String(s).trim().replace(/\s+/g, "").replace(",", ".").replace("−", "-");
  if (!t) return NaN;
  if (t.includes("/")) {
    const [a, b] = t.split("/");
    const x = Number(a), y = Number(b);
    return y === 0 ? NaN : x / y;
  }
  return Number(t);
}

export function isCorrect(input, gen) {
  const v = parseAnswer(input);
  if (!Number.isFinite(v)) return false;
  const tol = gen.tol ?? Math.max(1e-6, Math.abs(gen.a) * 1e-6);
  if (Math.abs(v - gen.a) <= tol) return true;
  // ondalık girildiyse ve cevap kesirse: 3 basamaklı yuvarlamayı kabul et
  const dec = String(input).split(/[.,]/)[1];
  if (dec && dec.length >= 2 && Math.abs(v - gen.a) <= 0.5 * 10 ** -dec.length + 1e-9) return true;
  return false;
}
