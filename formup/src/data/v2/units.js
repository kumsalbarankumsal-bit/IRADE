/* FormUp v2 — üniteler (yol sırası). Her ünite yolda bir bölümdür.
   track: "temel" = sıfırdan temel matematik, "kitap" = IB AA SL formül kitapçığı,
          "ib" = kitapçıkta olmayan ama AA SL için gereken formüller. */

export const TRACKS = [
  { id: "temel", tr: "Sıfırdan Temel", en: "Foundations", blurb: "Bölünebilmeden denklemlere: IB’ye başlamadan önce gereken her şey.", blurbEn: "From divisibility to equations: everything you need before IB." },
  { id: "kitap", tr: "IB Formül Kitapçığı", en: "IB Formula Booklet", blurb: "Math AA SL kitapçığındaki formüllerin tamamı, bölüm numaralarıyla.", blurbEn: "Every formula in the Math AA SL booklet, with section numbers." },
  { id: "ib", tr: "Kitapçıkta Yok, Ama Şart", en: "Not in the Booklet, But Essential", blurb: "Sınavda verilmeyen ama AA SL’de bilmen gereken kurallar.", blurbEn: "Rules you must know for AA SL that the booklet does not give you." },
];

export const UNITS = [
  { id: "f-num", track: "temel", tr: "Sayılar ve İşlemler", en: "Numbers & Operations", glyph: "\\pm", planet: ["#FFB86B", "#FF7A66"] },
  { id: "f-div", track: "temel", tr: "Bölünebilme ve Asallar", en: "Divisibility & Primes", glyph: "3\\mid n", planet: ["#7DE0C0", "#2FB58A"] },
  { id: "f-frac", track: "temel", tr: "Kesirler", en: "Fractions", glyph: "\\tfrac{a}{b}", planet: ["#8FC8FF", "#4F7DF0"] },
  { id: "f-pct", track: "temel", tr: "Ondalık, Yüzde ve Oran", en: "Decimals, Percentages & Ratio", glyph: "\\%", planet: ["#FFD66B", "#F0A030"] },
  { id: "f-pow", track: "temel", tr: "Üsler, Kökler, Bilimsel Gösterim", en: "Powers, Roots & Standard Form", glyph: "a^n", planet: ["#C8A8FF", "#8A63F0"] },
  { id: "f-alg", track: "temel", tr: "Cebir Temelleri", en: "Algebra Basics", glyph: "x", planet: ["#FF9EC4", "#E8558F"] },
  { id: "f-geo", track: "temel", tr: "Temel Geometri ve Trigonometri", en: "Basic Geometry & Trigonometry", glyph: "\\triangle", planet: ["#9BE7FF", "#33A9D6"] },
  { id: "f-graph", track: "temel", tr: "Grafik ve Fonksiyon Temelleri", en: "Graphs & Function Basics", glyph: "f(x)", planet: ["#B5F07A", "#6CC23A"] },

  { id: "b1", track: "kitap", tr: "Konu 1 · Sayı ve Cebir", en: "Topic 1 · Number and Algebra", glyph: "u_n", planet: ["#FFC94D", "#E08A1E"] },
  { id: "x1", track: "ib", tr: "Sayı ve Cebir: Kitapçık Dışı", en: "Number & Algebra: Beyond the Booklet", glyph: "\\ln", planet: ["#FFE29A", "#D9A532"] },
  { id: "b2", track: "kitap", tr: "Konu 2 · Fonksiyonlar", en: "Topic 2 · Functions", glyph: "\\Delta", planet: ["#7FE3FF", "#2E9BD6"] },
  { id: "x2", track: "ib", tr: "Fonksiyonlar: Kitapçık Dışı", en: "Functions: Beyond the Booklet", glyph: "f^{-1}", planet: ["#A9EEFF", "#4CB4E0"] },
  { id: "b3", track: "kitap", tr: "Konu 3 · Geometri ve Trigonometri", en: "Topic 3 · Geometry and Trigonometry", glyph: "\\sin", planet: ["#B9A2FF", "#7357E8"] },
  { id: "x3", track: "ib", tr: "Trigonometri: Kitapçık Dışı", en: "Trigonometry: Beyond the Booklet", glyph: "\\pi", planet: ["#D3C4FF", "#8F76F0"] },
  { id: "b4", track: "kitap", tr: "Konu 4 · İstatistik ve Olasılık", en: "Topic 4 · Statistics and Probability", glyph: "\\sigma", planet: ["#FF9C8A", "#E2533F"] },
  { id: "x4", track: "ib", tr: "İstatistik: Kitapçık Dışı", en: "Statistics: Beyond the Booklet", glyph: "\\bar x", planet: ["#FFC0B3", "#EC7A66"] },
  { id: "b5", track: "kitap", tr: "Konu 5 · Kalkülüs", en: "Topic 5 · Calculus", glyph: "\\int", planet: ["#8EF0C4", "#25B884"] },
  { id: "x5", track: "ib", tr: "Kalkülüs: Kitapçık Dışı", en: "Calculus: Beyond the Booklet", glyph: "f'", planet: ["#B8F7DA", "#45C995"] },
];

export const UNIT = Object.fromEntries(UNITS.map((u) => [u.id, u]));
export const TRACK = Object.fromEntries(TRACKS.map((t) => [t.id, t]));

/* Etkileşimli laboratuvarlar (src/labs/*). Kartlar LAB alanıyla bunlara bağlanır. */
export const LABS = [
  "numberline", "divisibility", "fraction", "percent", "power", "pythagoras", "trigtriangle", "unitcircle",
  "line", "parabola", "sequence", "interest", "explog", "transform", "sinewave", "circle",
  "tangent", "area", "normal", "binomial", "venn", "boxplot",
];
