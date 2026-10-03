/* Rütbeler, rozetler ve günlük görevler (iki dilli) */

export const RANKS = [
  { xp: 0, tr: "Uzay Çırağı", en: "Space Cadet", mono: "✦" },
  { xp: 120, tr: "Harezmî", en: "al-Khwarizmi", mono: "x", who: "Cebirin adını veren bilgin; “algoritma” kelimesi onun adından gelir.", whoEn: "Gave algebra its name; the word “algorithm” comes from his name." },
  { xp: 350, tr: "Öklid", en: "Euclid", mono: "△", who: "Geometriyi birkaç basit kural üzerine kurdu.", whoEn: "Built geometry from a few simple axioms." },
  { xp: 700, tr: "Pisagor", en: "Pythagoras", mono: "c²", who: "Dik üçgenlerin sırrıyla ünlü okulun kurucusu.", whoEn: "Founder of the school famous for the right-triangle rule." },
  { xp: 1200, tr: "Ömer Hayyam", en: "Omar Khayyam", mono: "x³", who: "Kübik denklemleri geometriyle çözdü, şiirler de yazdı.", whoEn: "Solved cubic equations with geometry, and wrote poetry." },
  { xp: 1900, tr: "Fibonacci", en: "Fibonacci", mono: "φ", who: "Rakamlarımızı Avrupa’ya tanıttı.", whoEn: "Brought our digits to Europe." },
  { xp: 2800, tr: "Descartes", en: "Descartes", mono: "xy", who: "Koordinat düzlemini icat ederek cebir ile geometriyi birleştirdi.", whoEn: "Joined algebra and geometry with coordinates." },
  { xp: 4000, tr: "Newton", en: "Newton", mono: "∫", who: "Kalkülüsü kuranlardan; hareketi formüllere döktü.", whoEn: "A founder of calculus; put motion into formulas." },
  { xp: 5500, tr: "Euler", en: "Euler", mono: "e", who: "Bugün kullandığımız birçok gösterim onun eseri.", whoEn: "Much of today's notation is his work." },
  { xp: 7500, tr: "Gauss", en: "Gauss", mono: "Σ", who: "“Matematikçilerin prensi”.", whoEn: "“The prince of mathematicians”." },
  { xp: 10000, tr: "Cahit Arf", en: "Cahit Arf", mono: "A", who: "Arf değişmeziyle tanınan Türk matematikçi.", whoEn: "Turkish mathematician known for the Arf invariant." },
  { xp: 14000, tr: "Ramanujan", en: "Ramanujan", mono: "∞", who: "Sezgisiyle binlerce formül bulan dahi.", whoEn: "The genius who found thousands of formulas by intuition." },
];
export function rankOf(xp) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
  const cur = RANKS[i], next = RANKS[i + 1] || null;
  return { i, cur, next, pct: next ? (xp - cur.xp) / (next.xp - cur.xp) : 1 };
}

/* Günlük görevler: metric gün sayaçlarından okunur */
export const QUESTS = [
  { id: "xp", icon: "Zap", tr: "{n} XP kazan", en: "Earn {n} XP", metric: "xp", goal: (s) => s.settings.goal },
  { id: "lesson", icon: "Rocket", tr: "1 ders bitir", en: "Finish 1 lesson", metric: "lessons", goal: () => 1 },
  { id: "polish", icon: "Sparkles", tr: "{n} yıldız parlat", en: "Polish {n} stars", metric: "r", goal: () => 5 },
  { id: "combo", icon: "Flame", tr: "Üst üste {n} doğru", en: "{n} correct in a row", metric: "combo", goal: () => 6 },
  { id: "game", icon: "Gamepad2", tr: "Bir oyun oyna", en: "Play a game", metric: "games", goal: () => 1 },
  { id: "three", icon: "Star", tr: "Bir dersi 3 yıldızla bitir", en: "Get 3 stars in a lesson", metric: "three", goal: () => 1 },
  { id: "apply", icon: "Calculator", tr: "{n} sayısal soru çöz", en: "Solve {n} number problems", metric: "apply", goal: () => 3 },
  { id: "lab", icon: "FlaskConical", tr: "Bir laboratuvarda oyna", en: "Play in a lab", metric: "labs", goal: () => 1 },
];

export const ACHIEVEMENTS = [
  { id: "first", tr: "İlk Yıldız", en: "First Star", dtr: "İlk dersini bitir", den: "Finish your first lesson", icon: "Star", check: (s, c) => c.lessonsDone >= 1 },
  { id: "crown", tr: "İlk Taç", en: "First Crown", dtr: "Bir ünite sınavını geç", den: "Pass a unit test", icon: "Crown", check: (s, c) => c.crowns >= 1 },
  { id: "l10", tr: "Takımyıldız", en: "Constellation", dtr: "10 formül öğren", den: "Learn 10 formulas", icon: "Sparkles", check: (s, c) => c.learned >= 10 },
  { id: "l50", tr: "Galaksi", en: "Galaxy", dtr: "50 formül öğren", den: "Learn 50 formulas", icon: "Orbit", check: (s, c) => c.learned >= 50 },
  { id: "l150", tr: "Evren", en: "Universe", dtr: "150 formül öğren", den: "Learn 150 formulas", icon: "Rocket", check: (s, c) => c.learned >= 150 },
  { id: "found", tr: "Sağlam Temel", en: "Solid Ground", dtr: "Tüm temel üniteleri bitir", den: "Finish every foundations unit", icon: "Layers", check: (s, c) => c.foundDone },
  { id: "booklet", tr: "Kitapçık Ustası", en: "Booklet Master", dtr: "Kitapçıktaki tüm formülleri öğren", den: "Learn every booklet formula", icon: "BookOpen", check: (s, c) => c.bookletDone },
  { id: "s3", tr: "Kıvılcım", en: "Spark", dtr: "3 günlük seri", den: "3-day streak", icon: "Flame", check: (s) => s.streak.best >= 3 },
  { id: "s7", tr: "Bir Hafta", en: "One Week", dtr: "7 günlük seri", den: "7-day streak", icon: "Flame", check: (s) => s.streak.best >= 7 },
  { id: "s30", tr: "Ay Işığı", en: "Moonlight", dtr: "30 günlük seri", den: "30-day streak", icon: "Moon", check: (s) => s.streak.best >= 30 },
  { id: "perfect", tr: "Kusursuz", en: "Flawless", dtr: "Bir dersi hatasız bitir", den: "Finish a lesson with no mistakes", icon: "Target", check: (s) => s.stats.perfect >= 1 },
  { id: "lasting", tr: "Kalıcı Hafıza", en: "Long-term Memory", dtr: "10 formülü “Kalıcı” yap", den: "Make 10 formulas “Lasting”", icon: "Brain", check: (s, c) => c.durable >= 10 },
  { id: "trap", tr: "Tuzak Avcısı", en: "Trap Hunter", dtr: "25 tuzağı yakala", den: "Catch 25 traps", icon: "ShieldCheck", check: (s) => s.stats.trapsCaught >= 25 },
  { id: "words", tr: "İki Dilli", en: "Bilingual", dtr: "30 İngilizce terim bil", den: "Get 30 English terms right", icon: "Languages", check: (s) => s.stats.terms >= 30 },
  { id: "labs", tr: "Kaşif", en: "Explorer", dtr: "5 farklı laboratuvarda oyna", den: "Play in 5 different labs", icon: "FlaskConical", check: (s) => Object.keys(s.labsSeen || {}).length >= 5 },
  { id: "speed", tr: "Şimşek", en: "Lightning", dtr: "Hız Turu’nda 20 puan", den: "Score 20 in Speed Round", icon: "Zap", check: (s) => s.best.speed >= 20 },
  { id: "which", tr: "Dedektif", en: "Detective", dtr: "“Hangi formül?” oyununda 8/10", den: "Score 8/10 in “Which formula?”", icon: "Search", check: (s) => s.best.which >= 8 },
  { id: "night", tr: "Gece Kuşu", en: "Night Owl", dtr: "Gece yarısından sonra çalış", den: "Study after midnight", icon: "Moon", check: (s, c) => c.hour < 4 && c.studiedNow },
];
