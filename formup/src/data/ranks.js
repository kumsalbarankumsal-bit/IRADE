/* Rütbeler (XP eşikleri) — her rütbe bir matematikçiden adını alır. */
export const RANKS = [
  { xp: 0, name: "Sayı Avcısı", mono: "∑", who: "Her yolculuk bir toplamla başlar.", },
  { xp: 150, name: "Harezmî", mono: "x", who: "Cebir’in adını veren, “algoritma” kelimesine adını bırakan bilgin." },
  { xp: 400, name: "Öklid", mono: "△", who: "“Elemanlar” ile geometriyi aksiyomlar üzerine kurdu." },
  { xp: 800, name: "Pisagor", mono: "c²", who: "Sayıların ve uyumun peşindeki okulun kurucusu." },
  { xp: 1400, name: "Ömer Hayyam", mono: "x³", who: "Kübik denklemleri geometrik yollarla çözdü." },
  { xp: 2200, name: "Fibonacci", mono: "φ", who: "Hint-Arap rakamlarını Avrupa’ya tanıttı." },
  { xp: 3200, name: "Descartes", mono: "xy", who: "Cebir ile geometriyi koordinatlarla birleştirdi." },
  { xp: 4500, name: "Newton", mono: "∫", who: "Kalkülüsün kurucularından; hareketi formüllere döktü." },
  { xp: 6000, name: "Euler", mono: "e", who: "Tarihin en üretken matematikçilerinden; $e^{i\\pi}+1=0$." },
  { xp: 8000, name: "Gauss", mono: "ℤ", who: "“Matematikçilerin prensi”." },
  { xp: 11000, name: "Cahit Arf", mono: "A", who: "Arf değişmezi ve Arf halkalarıyla tanınan Türk matematikçi; portresi 10 TL banknotlarında yer aldı." },
  { xp: 15000, name: "Ramanujan", mono: "∞", who: "Sezgisiyle binlerce özdeşlik bulan dahi." },
];

export function rankOf(xp) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
  const cur = RANKS[i], next = RANKS[i + 1] || null;
  const pct = next ? (xp - cur.xp) / (next.xp - cur.xp) : 1;
  return { i, cur, next, pct };
}

/* Rozetler — check(state, ctx) true dönerse açılır */
export const ACHIEVEMENTS = [
  { id: "ilk", name: "İlk Formül", desc: "İlk formülünü öğren", icon: "Sparkles", check: (s, c) => c.learned >= 1 },
  { id: "on", name: "Onluk", desc: "10 formül öğren", icon: "Layers", check: (s, c) => c.learned >= 10 },
  { id: "elli", name: "Elli", desc: "50 formül öğren", icon: "BookOpen", check: (s, c) => c.learned >= 50 },
  { id: "yuz", name: "Yüzlük", desc: "100 formül öğren", icon: "Trophy", check: (s, c) => c.learned >= 100 },
  { id: "ikiyuzelli", name: "Ansiklopedi", desc: "250 formül öğren", icon: "Crown", check: (s, c) => c.learned >= 250 },
  { id: "seri3", name: "Kıvılcım", desc: "3 günlük seri", icon: "Flame", check: (s) => s.streak.best >= 3 },
  { id: "seri7", name: "Bir Hafta", desc: "7 günlük seri", icon: "Flame", check: (s) => s.streak.best >= 7 },
  { id: "seri30", name: "Ay Işığı", desc: "30 günlük seri", icon: "Moon", check: (s) => s.streak.best >= 30 },
  { id: "seri100", name: "Yüz Gün", desc: "100 günlük seri", icon: "Medal", check: (s) => s.streak.best >= 100 },
  { id: "kusursuz", name: "Kusursuz", desc: "10+ soruluk bir turu hatasız bitir", icon: "Target", check: (s) => s.stats.perfect >= 1 },
  { id: "kalici10", name: "Kalıcı Hafıza", desc: "10 formülü “Kalıcı” seviyeye taşı", icon: "Brain", check: (s, c) => c.durable >= 10 },
  { id: "usta", name: "Usta", desc: "Bir formülü “Usta” seviyeye taşı", icon: "Award", check: (s, c) => c.master >= 1 },
  { id: "tuzak", name: "Tuzak Avcısı", desc: "25 tuzağı yakala", icon: "ShieldCheck", check: (s) => s.stats.trapsCaught >= 25 },
  { id: "hiz", name: "Şimşek", desc: "Hız Turu’nda 20 puan", icon: "Zap", check: (s) => s.best.speed >= 20 },
  { id: "eslestir", name: "Eşleştirici", desc: "Eşleştir’i 30 sn altında bitir", icon: "Puzzle", check: (s) => s.best.match > 0 && s.best.match <= 30000 },
  { id: "atolye", name: "Hesap Ustası", desc: "Sayı Atölyesi’nde 10/10", icon: "Calculator", check: (s) => s.best.lab >= 10 },
  { id: "mimar", name: "Formül Mimarı", desc: "Kendi formülünü ekle", icon: "PenLine", check: (s) => s.custom.length >= 1 },
  { id: "gece", name: "Gece Kuşu", desc: "Gece yarısından sonra çalış", icon: "Moon", check: (s, c) => c.hour >= 0 && c.hour < 4 && c.studiedNow },
  { id: "sabah", name: "Erken Kalkan", desc: "Sabah 7’den önce çalış", icon: "Sun", check: (s, c) => c.hour >= 4 && c.hour < 7 && c.studiedNow },
  { id: "konu", name: "Konu Fatihi", desc: "Bir konudaki tüm formülleri öğren", icon: "Flag", check: (s, c) => c.topicDone },
];
