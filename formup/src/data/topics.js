/* Seviyeler ve konular.
   Sıra önemlidir: Keşfet akışı bu sırayla ve öncelik puanıyla ilerler. */

export const LEVELS = [
  { id: "tyt", name: "TYT", long: "TYT Temel Matematik", blurb: "Sayılar, özdeşlikler, problemler, sayma" },
  { id: "ayt", name: "AYT", long: "AYT Matematik", blurb: "Trigonometri, logaritma, limit, türev, integral" },
  { id: "geo", name: "Geometri", long: "TYT–AYT Geometri", blurb: "Üçgen, çember, analitik, katı cisimler" },
  { id: "uni", name: "Üniversite", long: "Üniversite Matematiği", blurb: "Kalkülüs, lineer cebir, olasılık–istatistik" },
];

export const TOPICS = [
  { id: "sayilar", lv: "tyt", name: "Sayılar & Toplamlar", glyph: "\\sum" },
  { id: "bolme", lv: "tyt", name: "Bölünebilme & Bölenler", glyph: "\\mid" },
  { id: "uslu", lv: "tyt", name: "Üslü Sayılar", glyph: "a^n" },
  { id: "koklu", lv: "tyt", name: "Köklü Sayılar", glyph: "\\sqrt{x}" },
  { id: "mutlak", lv: "tyt", name: "Mutlak Değer", glyph: "|x|" },
  { id: "ozdeslik", lv: "tyt", name: "Özdeşlikler & Çarpanlara Ayırma", glyph: "(a{+}b)^2" },
  { id: "problem", lv: "tyt", name: "Problemler", glyph: "v\\!\\cdot\\!t" },
  { id: "kume", lv: "tyt", name: "Kümeler", glyph: "A\\cup B" },
  { id: "mantik", lv: "tyt", name: "Mantık", glyph: "p\\Rightarrow q" },
  { id: "fonksiyon", lv: "tyt", name: "Fonksiyonlar", glyph: "f\\circ g" },
  { id: "sayma", lv: "tyt", name: "Sayma & Olasılık", glyph: "\\tbinom{n}{r}" },
  { id: "polinom", lv: "tyt", name: "Polinomlar", glyph: "P(x)" },

  { id: "ikinci", lv: "ayt", name: "2. Dereceden Denklemler & Parabol", glyph: "\\Delta" },
  { id: "karmasik", lv: "ayt", name: "Karmaşık Sayılar", glyph: "i^2" },
  { id: "trig", lv: "ayt", name: "Trigonometri", glyph: "\\sin\\theta" },
  { id: "log", lv: "ayt", name: "Üstel & Logaritma", glyph: "\\log_a" },
  { id: "dizi", lv: "ayt", name: "Diziler & Seriler", glyph: "a_n" },
  { id: "limit", lv: "ayt", name: "Limit & Süreklilik", glyph: "\\lim" },
  { id: "turev", lv: "ayt", name: "Türev", glyph: "f'" },
  { id: "integral", lv: "ayt", name: "İntegral", glyph: "\\textstyle\\int" },

  { id: "ucgen", lv: "geo", name: "Üçgenler", glyph: "\\triangle" },
  { id: "cokgen", lv: "geo", name: "Çokgenler & Dörtgenler", glyph: "\\square" },
  { id: "cember", lv: "geo", name: "Çember & Daire", glyph: "\\pi r^2" },
  { id: "analitik", lv: "geo", name: "Analitik Geometri", glyph: "m" },
  { id: "donusum", lv: "geo", name: "Dönüşümler", glyph: "(x,y)" },
  { id: "kati", lv: "geo", name: "Katı Cisimler", glyph: "V" },

  { id: "kalkulus", lv: "uni", name: "İleri Kalkülüs", glyph: "e^{i\\pi}" },
  { id: "lineer", lv: "uni", name: "Lineer Cebir", glyph: "\\det" },
  { id: "istatistik", lv: "uni", name: "Olasılık & İstatistik", glyph: "\\sigma" },

  { id: "ozel", lv: "custom", name: "Kendi Formüllerim", glyph: "\\star" },
];

export const TOPIC = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
export const LEVEL = Object.fromEntries(LEVELS.map((l) => [l.id, l]));
