import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Flame, Home, BookOpen, BarChart3, Award, Settings, Plus, X, Check,
  RotateCcw, Sun, Moon, Lock, LifeBuoy, Trash2, Sparkles, Wind, Target,
  Download, Upload, Copy, ChevronDown, Brain, Cloud, CloudOff, CheckCircle2
} from "lucide-react";

/* ============================================================
   İRADE v2 — öz-disiplin ve alışkanlık takip uygulaması
   Felsefe: utanç değil, öz-saygı. Düşüş veridir, yenilgi değil.

   v2 değişiklikleri:
   - Sağlam kalıcılık: depolama hazır olana dek bekleme, 3 deneme,
     list() ile anahtar doğrulama, ilk yazımdan önce kurtarma denemesi,
     canlı kayıt durumu + dışa/içe aktarma yedeği.
   - Yeni derinlik: rütbe & XP, günlük görevler, dalga şiddeti kaydı,
     risk saatleri, tetikleyiciye özel taktikler, haftalık özet,
     hedef çubuğu, bilgelik kütüphanesi, savunma rozetleri.
   - "Şafak" tasarımı: açık tema varsayılan, mor→amber enerjisi.
   ============================================================ */

const DAY = 86400000;
const KEY = "irade-app-v1"; // eski anahtar korunur; eski veri varsa devralınır

/* ---------------- Sabit içerikler ---------------- */

const QUOTES = [
  "Disiplin, kimse izlemiyorken kendine verdiğin sözü tutmaktır.",
  "Bugünkü direncin, yarınki sana bıraktığın mirastır.",
  "Dürtü bir dalgadır; sen kıyısın. Dalga geçer, sen kalırsın.",
  "Güç hiç düşmemek değil, her düşüşten daha bilge kalkmaktır.",
  "Kontrol ettiğin her an, karakterine konan bir tuğladır.",
  "Zihnin bir bahçe; neyi sulayacağını sen seçersin.",
  "Büyük zaferler, kimsenin görmediği küçük zaferlerin toplamıdır.",
  "Özgürlük canının istediğini yapmak değil, doğru bildiğini yapabilmektir.",
  "Sen, alışkanlıklarının toplamından daha büyüksün.",
  "Rahatsızlığa dayanma kapasiten, hayatının kalitesini belirler.",
  "Geçmişin seni tanımlamaz; bugünkü seçimin tanımlar.",
  "En çok zorlandığın an, en çok büyüdüğün andır.",
  "Enerjin geri geliyor. Onu neye yatıracağına sen karar ver.",
  "Her 'hayır', daha büyük bir 'evet'e açılan kapıdır.",
  "Bir dürtüye direnmek bir orduyu yenmekten zordur — ve sen direniyorsun.",
  "Sayaç sadece bir rakam; asıl büyüyen sensin.",
  "Vazgeçmek kolaydır; sen zoru seçenlerdensin.",
  "Bir alışkanlığı yenmek, kendinle kurduğun ittifaktır.",
  "Karakter, tekrar edilen seçimlerin imzasıdır.",
  "Dünden güçlüsün; yarın bugünden güçlü olacaksın.",
  "Sessizce çalış, sayaç senin yerine konuşsun.",
  "İrade bir kas: her direniş bir tekrar.",
  "Hedefe değil adıma bak; hedef kendiliğinden yaklaşır.",
  "Kendine saygı, kendine verdiğin sözle başlar.",
];

const MILESTONES = [
  { d: 1,   name: "İlk Adım",     icon: "🌱", desc: "Her yolculuk tek bir adımla başlar." },
  { d: 3,   name: "Kıvılcım",     icon: "⚡", desc: "Değişimin kıvılcımı yandı." },
  { d: 7,   name: "Bir Hafta",    icon: "🛡️", desc: "Yedi gün. Disiplin filizleniyor." },
  { d: 14,  name: "Direnç",       icon: "🗿", desc: "Zincirin ilk halkası kırıldı." },
  { d: 21,  name: "Yeni Düzen",   icon: "🔄", desc: "Yeni bir rutinin temeli atıldı." },
  { d: 30,  name: "Ay Ustası",    icon: "🌙", desc: "Tam bir ay. Bu tesadüf değil." },
  { d: 60,  name: "Demir İrade",  icon: "⚔️", desc: "İki ay boyunca sözünü tuttun." },
  { d: 90,  name: "Zirve",        icon: "🏔️", desc: "90 gün — zihin yeniden ayarlanıyor." },
  { d: 180, name: "Yarı Yıl",     icon: "🦅", desc: "Altı ay. Eski sen geride kaldı." },
  { d: 365, name: "Yeni Bir Sen", icon: "👑", desc: "Bir tam yıl. Bu bir kimlik dönüşümü." },
];

/* Atlatılan dalga (dürtü) sayısına göre savunma rozetleri */
const DEFENSE = [
  { n: 5,   name: "İlk Siper",      icon: "🛟" },
  { n: 15,  name: "Dalgakıran",     icon: "🌊" },
  { n: 40,  name: "Fırtına Ustası", icon: "⛈️" },
  { n: 100, name: "Deniz Feneri",   icon: "🗼" },
];

/* Rütbeler — XP eşikleri */
const RANKS = [
  { xp: 0,    name: "Çırak",      icon: "🔰" },
  { xp: 100,  name: "Yolcu",      icon: "🥾" },
  { xp: 250,  name: "Gözcü",      icon: "🔭" },
  { xp: 500,  name: "Savunucu",   icon: "🛡️" },
  { xp: 900,  name: "Demirci",    icon: "⚒️" },
  { xp: 1400, name: "Komutan",    icon: "🎖️" },
  { xp: 2100, name: "Stratejist", icon: "♟️" },
  { xp: 3000, name: "Bilge",      icon: "📜" },
  { xp: 4200, name: "Vakur",      icon: "🗿" },
  { xp: 6000, name: "Efsane",     icon: "🌟" },
];

const TRIGGERS = [
  "Yalnızlık", "Sıkılma", "Stres", "Gece geç saat",
  "Sosyal medya", "Yorgunluk", "Kaygı", "Erteleme", "Diğer",
];

/* En sık tetikleyiciye özel taktik önerileri */
const TRIGGER_TIPS = {
  "Yalnızlık": "Yalnız kalacağın saatlere önceden plan koy: bir arama, ortak çalışma, dışarıda bir mola. Boşluğu sen doldurmazsan alışkanlık doldurur.",
  "Sıkılma": "Sıkılınca uzanacağın bir 'ilk yardım listesi' hazırla: kitap, antrenman, hobi, küçük bir görev. Karar anında düşünme; listeden seç.",
  "Stres": "Stres bedende başlar: 4-7-8 nefesi + 10 dakikalık yürüyüş. Vücut sakinleşmeden zihin sakinleşmez.",
  "Gece geç saat": "Telefon yatak odasına girmesin; şarj ünitesi başka odada dursun. Uyku saatine alarm kur — gece senin en savunmasız dilimin.",
  "Sosyal medya": "Tetikleyen uygulamalara süre kilidi koy, akışları sadeleştir. Kaydırma eli boşaldığında dürtü kapıyı çalar.",
  "Yorgunluk": "Yorgunken irade düşer: erken yat, kısa kestir, büyük kararları sabaha bırak. Dinlenmek tembellik değil, savunmadır.",
  "Kaygı": "Kaygıyı kâğıda dök; 5-4-3-2-1 duyu egzersizini dene (5 gördüğün, 4 duyduğun…). Adlandırılan duygu küçülür.",
  "Erteleme": "İki dakika kuralı: ertelediğin işe sadece 2 dakika başla. Başlamak, direncin yarısını eritir.",
  "Diğer": "Kalıbı yakalamak için günlüğe kısa notlar düşmeye devam et; örüntü görünür hâle gelince çözümü de görünür.",
};

const MOODS = [
  { e: "😞", l: "Zor" },
  { e: "😕", l: "Düşük" },
  { e: "😐", l: "Orta" },
  { e: "🙂", l: "İyi" },
  { e: "😄", l: "Harika" },
];

const ALTERNATIVES = [
  { i: "🚶", t: "10 dakikalık yürüyüşe çık" },
  { i: "🚿", t: "Soğuk bir duş al" },
  { i: "💪", t: "20 şınav veya squat yap" },
  { i: "📵", t: "Telefonu başka bir odaya bırak" },
  { i: "🧊", t: "Yüzünü soğuk suyla yıka" },
  { i: "📖", t: "Kitap aç ya da bir arkadaşına yaz" },
  { i: "🎧", t: "Müzik aç, ortamını değiştir" },
  { i: "🧹", t: "5 dakikalık küçük bir işi bitir" },
];

/* Günlük görev havuzu — her gün 3'ü seçilir */
const QUESTS = [
  { i: "🚶", t: "10 dakika yürüyüş yap" },
  { i: "🚿", t: "Duşu soğukla bitir" },
  { i: "📵", t: "Yatmadan 1 saat önce telefonu bırak" },
  { i: "📖", t: "10 sayfa kitap oku" },
  { i: "💪", t: "20 şınav ya da squat yap" },
  { i: "☎️", t: "Bir arkadaşınla gerçek sohbet et" },
  { i: "🧹", t: "5 dakika odanı topla" },
  { i: "🙏", t: "Minnettar olduğun 3 şeyi yaz" },
  { i: "💧", t: "Gün boyu 6+ bardak su iç" },
  { i: "⏳", t: "Sosyal medyayı 30 dakikayla sınırla" },
  { i: "🗓️", t: "Yarının planını yaz" },
  { i: "🧘", t: "5 dakika nefes/meditasyon yap" },
  { i: "🤝", t: "Bugün birine küçük bir iyilik yap" },
  { i: "🍽️", t: "Bir öğünü ekransız ye" },
];

/* Yaygın olarak bildirilen deneyimler — garanti dili kullanılmaz. */
const BENEFITS = [
  { from: 1,  to: 3,    title: "Zor Kısım",
    desc: "Dürtüler yoğun olabilir. Bu, zihnin eski döngüyü aramasıdır — tamamen normal ve geçici." },
  { from: 4,  to: 7,    title: "İlk Kazanımlar",
    desc: "Birçok kişi geri kazanılan zamanı ve hafif bir enerji artışını fark ettiğini söyler." },
  { from: 8,  to: 14,   title: "Berraklaşma",
    desc: "Odaklanmada iyileşme ve — özellikle gece kullanımı azaldıysa — daha düzenli uyku sık bildirilir." },
  { from: 15, to: 30,   title: "Yeni Denge",
    desc: "Dürtülerin sıklığı genellikle azalır; sözünü tutmanın getirdiği öz-güven belirginleşir." },
  { from: 31, to: 90,   title: "Yeniden Kalibrasyon",
    desc: "İlgi ve motivasyonun günlük hayata, hedeflere kaydığı sık aktarılır. Dürtüler zayıflar." },
  { from: 91, to: 99999, title: "Yaşam Tarzı",
    desc: "Alışkanlık artık istisna değil, kural. Amaç sayaç değil; inşa ettiğin hayat." },
];

/* Bilgelik kütüphanesi — kısa, gerçekçi eğitim kartları */
const WISDOM = [
  { icon: "🌊", title: "Dürtü Sörfü",
    body: "Dürtü bir dalga gibi davranır: yükselir, tepe yapar, kırılır. Onunla savaşmak yerine gözlemci ol: 'Şu an bir dürtü yaşıyorum, bedenimde şöyle hissettiriyor.' Çoğu dalga 10–20 dakika içinde kendiliğinden söner. Sörfçü dalgayı durdurmaz; üstünde kalır." },
  { icon: "🧭", title: "HALT Kontrolü",
    body: "Dürtü geldiğinde dört soruyu tara: Aç mıyım? Öfkeli miyim? Yalnız mıyım? Yorgun muyum? Çoğu zaman gerçek ihtiyaç bunlardan biridir ve dürtü, yanlış adrese yazılmış bir mektuptur. Gerçek ihtiyacı karşıla; dürtü güç kaybeder." },
  { icon: "🏗️", title: "Ortam Tasarımı",
    body: "İrade kas gibidir, yorulur; akıllı olan onu az kullanmaktır. Telefonu yatak odasından çıkar, tetikleyen uygulamalara sınır koy, cihazları gece ortak alanda şarj et. Kötü seçeneğe ulaşmayı zorlaştırmak, iyi seçeneği varsayılan yapmaktır." },
  { icon: "🪜", title: "Kayma ≠ Nüks",
    body: "Bir kayma tek bir olaydır; nüks ise 'her şey mahvoldu' hikâyesine inanıp pes etmektir. Kaymadan sonra kendini ağır eleştirenlerin döngüye daha kolay döndüğü gözlenir. Veriyi al — tetikleyici, saat, duygu — planı güncelle, devam et." },
  { icon: "🔁", title: "Yerine Koyma",
    body: "Alışkanlıklar silinmez, değiştirilir. Tetikleyici an geldiğinde boşluk bırakma: önceden seçilmiş bir eylem koy — yürüyüş, soğuk su, 20 şınav, bir mesaj. Aynı işaret, yeni rutin: döngünün yapısı bozulmadan yönü değişir." },
  { icon: "💛", title: "Şefkatli Öz-Konuşma",
    body: "Kendine acımasızlık disiplin değildir; öz-şefkat azmi besler, utanç ise döngüyü besler. Aynı durumda yakın bir arkadaşına ne derdin? Aynısını kendine söyle: net, dürüst ve nazik. Bu yumuşaklık değil, strateji." },
  { icon: "⚡", title: "Süper-Normal Uyaran",
    body: "Pornografi, beynin yenilik ve ödül arayışına doğal hayatta bulunmayan bir yoğunlukla yüklenir; alışkanlık bu yüzden hızla pekişir. Uzaklaştıkça sıradan ödüller — başarı, spor, sohbet — yeniden parlamaya başlar. Beklediğin şey: kalibrasyonun normale dönmesi." },
  { icon: "😴", title: "Uyku ve İrade",
    body: "Uykusuz beyin, freni zayıflamış bir araba gibidir: dürtüler aynı, direnç düşük. Gece geç saat en riskli dilimse bu tesadüf değil. Düzenli uyku saati ve ekransız bir son saat, sessiz ama güçlü bir savunma hattıdır." },
];

/* ---------------- Yardımcılar ---------------- */

const pad2 = (n) => String(n).padStart(2, "0");
const isoDate = (ts) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const fmtTime = (ts) => {
  const d = new Date(ts);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};
const startOfDay = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}
/* Gün anahtarından 3 farklı görev indeksi üretir (deterministik) */
function questsFor(dayKey) {
  const N = QUESTS.length;
  const h = hashStr(dayKey);
  const a = h % N;
  const b = (a + 1 + ((h >>> 4) % (N - 1))) % N; /* >>> : işaretsiz kaydırma, negatif indeks üretemez */
  let c = (a + 2 + ((h >>> 9) % (N - 2))) % N;
  while (c === a || c === b) c = (c + 1) % N;
  return [a, b, c];
}

/* XP ve rütbe hesapları (türetilmiş, ayrıca saklanmaz) */
function calcXP(d, curFloat) {
  const quests = Object.values(d.questLog || {}).reduce((s, arr) => s + arr.length, 0);
  const maxEver = Math.max(d.bestStreak || 0, curFloat || 0);
  const badges = MILESTONES.filter((m) => maxEver >= m.d).length;
  return Object.keys(d.checkIns || {}).length * 10
    + (d.journal || []).length * 15
    + (d.urgesSurvived || 0) * 20
    + quests * 10
    + badges * 30;
}
function rankOf(xp) {
  let cur = RANKS[0], next = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].xp) cur = RANKS[i];
    else { next = RANKS[i]; break; }
  }
  return { cur, next };
}

/* Seriye göre kahraman alt cümlesi */
function heroLine(days) {
  if (days < 1) return "İlk saatler en kıymetlileri. Buradasın.";
  if (days < 3) return "Temel atılıyor. Adım adım.";
  if (days < 7) return "Kıvılcım büyüyor.";
  if (days < 14) return "Bir hafta geçti — bu artık gerçek.";
  if (days < 30) return "Yeni düzen kök salıyor.";
  if (days < 90) return "Bu artık kim olduğunla ilgili.";
  return "Zirve havası. Aynı sakinlikle devam.";
}

/* ---------------- Depolama katmanı ----------------
   Kalıcılık: window.storage. Önceki sürümdeki veri kaybının nedeni,
   deponun bazı oturumlarda geç hazır olması ya da hiç bulunmaması
   ve eski kodun bu durumda boş profili üstüne yazabilmesiydi.
   v2: bekle → 3 kez dene → list() ile anahtar var mı doğrula →
   ilk yazımdan önce son bir kurtarma okuması yap. */

async function waitForStorage(maxMs = 3500) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    if (typeof window !== "undefined" && window.storage) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return typeof window !== "undefined" && !!window.storage;
}

async function keyExists() {
  try {
    const l = await window.storage.list("irade-");
    const keys = (l && l.keys) || [];
    return keys.includes(KEY);
  } catch (e) { return null; } /* bilinmiyor */
}

/* Dönüş: {status:"ok",data} | {status:"empty"} | {status:"error"} */
async function safeRead() {
  if (!(await waitForStorage())) return { status: "error" };
  for (let i = 0; i < 3; i++) {
    try {
      const r = await window.storage.get(KEY);
      if (r && r.value) return { status: "ok", data: JSON.parse(r.value) };
      return { status: "empty" };
    } catch (e) {
      const ex = await keyExists();
      if (ex === false) return { status: "empty" }; /* anahtar gerçekten yok */
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  return { status: "error" };
}

async function persistRaw(next) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      await window.storage.set(KEY, JSON.stringify(next));
      return true;
    }
  } catch (e) { /* aşağıda false döner */ }
  return false;
}
async function wipeRaw() {
  try { if (typeof window !== "undefined" && window.storage) await window.storage.delete(KEY); }
  catch (e) { /* yoksay */ }
}

/* Sıfırdan başlangıç durumu */
const fresh = () => {
  const t = Date.now();
  return {
    version: 2,
    startDate: t,
    installDate: t,
    bestStreak: 0,
    totalResets: 0,
    urgesSurvived: 0,
    resetLog: [],      // { date, streakDays, trigger, mood, note }
    journal: [],       // { date, mood, note, triggers[] }
    urgeLog: [],       // { date, intensity 1-5 }
    reasons: [],
    checkIns: {},      // { 'YYYY-MM-DD': true }
    questLog: {},      // { 'YYYY-MM-DD': [görev indeksleri] }
    streakHistory: [], // { start, end, days }
    seenBadges: 0,
    goal: 90,          // hedef gün
    theme: "light",    // v2: aydınlık varsayılan
  };
};

/* Eski/eksik veriyi yeni şemaya taşır */
const withDefaults = (p) => ({
  ...fresh(),
  ...p,
  checkIns: { ...((p && p.checkIns) || {}) },
  questLog: { ...((p && p.questLog) || {}) },
  reasons: (p && p.reasons) || [],
  journal: (p && p.journal) || [],
  resetLog: (p && p.resetLog) || [],
  urgeLog: (p && p.urgeLog) || [],
  streakHistory: (p && p.streakHistory) || [],
});

/* ---------------- Tema: "Şafak" ---------------- */

const theme = (dark) => dark ? {
  /* Gece — sıcak, mor-lacivert; eskisi gibi simsiyah değil */
  page: { background: "linear-gradient(180deg,#191537 0%,#221B44 55%,#241A3E 100%)" },
  cardStyle: { backgroundColor: "#241E4A", boxShadow: "0 10px 30px rgba(0,0,0,0.35)", borderColor: "#37306B" },
  navStyle: { backgroundColor: "rgba(28,23,56,0.96)", borderColor: "#37306B" },
  softStyle: { backgroundColor: "#2D2658" },
  text: "text-slate-100", sub: "text-slate-300", faint: "text-slate-400",
  input: "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400",
  chip: "bg-slate-800 text-slate-300 border-slate-600",
  chipOn: "bg-violet-500 bg-opacity-25 text-violet-200 border-violet-400",
  ringTrack: "#352D66",
  heatClean: "bg-emerald-400", heatSoft: "bg-emerald-800", heatReset: "bg-rose-400", heatPre: "bg-slate-700",
  barTrack: "#352D66",
} : {
  /* Şafak — varsayılan: yumuşak lavanta→fildişi, mor + amber enerjisi */
  page: { background: "linear-gradient(180deg,#F5F2FF 0%,#FFF7EC 100%)" },
  cardStyle: { backgroundColor: "#FFFFFF", boxShadow: "0 10px 30px rgba(116,92,230,0.10)", borderColor: "#EAE4FB" },
  navStyle: { backgroundColor: "rgba(255,255,255,0.96)", borderColor: "#EAE4FB" },
  softStyle: { backgroundColor: "#F4F0FE" },
  text: "text-slate-900", sub: "text-slate-600", faint: "text-slate-400",
  input: "bg-white border-violet-200 text-slate-900 placeholder-slate-400",
  chip: "bg-violet-50 text-slate-600 border-violet-100",
  chipOn: "bg-violet-600 bg-opacity-10 text-violet-700 border-violet-500",
  ringTrack: "#EDE8FC",
  heatClean: "bg-emerald-400", heatSoft: "bg-emerald-100", heatReset: "bg-rose-400", heatPre: "bg-slate-100",
  barTrack: "#EDE8FC",
};

/* Ortak vurgu renkleri */
const GRAD_MAIN = "linear-gradient(135deg,#7C5CE6 0%,#F59E0B 100%)";
const GRAD_BTN  = "linear-gradient(90deg,#7C5CE6,#6366F1)";
const GRAD_GOOD = "linear-gradient(90deg,#10B981,#0EA5A4)";
const GRAD_SOS  = "linear-gradient(90deg,#F59E0B,#F43F5E)";

/* ---------------- Küçük yapı taşları ---------------- */

const Grad = ({ children, className = "" }) => (
  <span
    className={className}
    style={{ backgroundImage: GRAD_MAIN, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
  >{children}</span>
);

const Card = ({ T, className = "", children }) => (
  <div className={`rounded-3xl border p-5 ${className}`} style={T.cardStyle}>{children}</div>
);

const Chip = ({ T, on, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${on ? T.chipOn : T.chip}`}
  >{children}</button>
);

const StatCard = ({ T, label, value, grad }) => (
  <div className="rounded-3xl border p-4" style={T.cardStyle}>
    <p className={`text-xs uppercase tracking-wider ${T.faint}`}>{label}</p>
    {grad
      ? <Grad className="mt-1 block text-2xl font-extrabold">{value}</Grad>
      : <p className={`mt-1 text-2xl font-extrabold ${T.text}`}>{value}</p>}
  </div>
);

/* İnce ilerleme çubuğu */
const Bar = ({ T, pct, gradient = GRAD_BTN, h = 8 }) => (
  <div className="w-full rounded-full" style={{ backgroundColor: T.barTrack, height: h }}>
    <div
      className="rounded-full"
      style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: h, background: gradient, transition: "width .6s ease" }}
    />
  </div>
);

/* Dairesel ilerleme halkası — gradyan konturlu */
function Ring({ progress, T, children }) {
  const R = 110;
  const C = 2 * Math.PI * R;
  const p = Math.min(Math.max(progress, 0), 1);
  return (
    <div className="relative mx-auto h-64 w-64">
      <svg viewBox="0 0 260 260" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="iradeRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CE6" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <circle cx="130" cy="130" r={R} fill="none" stroke={T.ringTrack} strokeWidth="13" />
        <circle
          cx="130" cy="130" r={R} fill="none"
          stroke="url(#iradeRing)" strokeWidth="13" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - p)}
          transform="rotate(-90 130 130)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

/* Takvim ısı haritası — son 84 gün */
function Heatmap({ T, installDate, resetSet, checkIns }) {
  const cells = useMemo(() => {
    const today = startOfDay(Date.now());
    const arr = [];
    for (let i = 83; i >= 0; i--) arr.push(today - i * DAY);
    return arr;
  }, [resetSet, checkIns]);

  const color = (ts) => {
    const k = isoDate(ts);
    if (ts < startOfDay(installDate)) return T.heatPre;
    if (resetSet.has(k)) return T.heatReset;
    if (checkIns[k]) return T.heatClean;
    return T.heatSoft;
  };

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: "max-content" }}>
          {cells.map((ts) => (
            <div key={ts} title={isoDate(ts)} className={`h-3 w-3 rounded-sm ${color(ts)}`} />
          ))}
        </div>
      </div>
      <div className={`mt-3 flex flex-wrap items-center gap-3 text-xs ${T.faint}`}>
        <span className="flex items-center gap-1"><span className={`h-2.5 w-2.5 rounded-sm ${T.heatClean}`} /> Onaylı temiz gün</span>
        <span className="flex items-center gap-1"><span className={`h-2.5 w-2.5 rounded-sm ${T.heatSoft}`} /> Temiz gün</span>
        <span className="flex items-center gap-1"><span className={`h-2.5 w-2.5 rounded-sm ${T.heatReset}`} /> Sıfırlama</span>
      </div>
    </div>
  );
}

/* Seri uzunluklarının çizgi grafiği */
function StreakChart({ T, history, current }) {
  const vals = [...history.map((h) => h.days), current];
  if (vals.length < 2) {
    return (
      <p className={`text-sm leading-relaxed ${T.sub}`}>
        Şimdilik tek bir hikâye var: süren serin. İlk sıfırlamadan sonra
        serilerin karşılaştırmalı eğrisi burada çizilecek.
      </p>
    );
  }
  const W = 320, H = 150, P = 28;
  const max = Math.max(...vals, 1);
  const pts = vals.map((v, i) => [
    P + (i * (W - 2 * P)) / (vals.length - 1),
    H - P - (v / max) * (H - 2 * P),
  ]);
  const line = pts.map((p) => p.join(",")).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke={T.ringTrack} strokeWidth="1" />
        <line x1={P} y1={P} x2={W - P} y2={P} stroke={T.ringTrack} strokeWidth="1" strokeDasharray="3 4" />
        <text x={P} y={P - 8} fontSize="10" fill="#8B86A8">{Math.round(max)} gün</text>
        <polyline points={line} fill="none" stroke="#7C5CE6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 5 : 3}
            fill={i === pts.length - 1 ? "#F59E0B" : "#7C5CE6"} />
        ))}
      </svg>
      <p className={`mt-1 text-xs ${T.faint}`}>Her nokta bir seri; turuncu olan şu an süren serin.</p>
    </div>
  );
}

/* Son dalgaların şiddet grafiği (1-5) */
function UrgeBars({ T, log }) {
  const last = (log || []).slice(-14);
  if (last.length === 0) {
    return <p className={`text-sm ${T.sub}`}>Henüz dalga kaydı yok. Dürtü Anı modundan çıkarken şiddetini işaretlersen burada eğilim oluşur.</p>;
  }
  const avg = (last.reduce((s, u) => s + u.intensity, 0) / last.length).toFixed(1);
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height: 90 }}>
        {last.map((u, i) => (
          <div key={i} title={`${fmtDate(u.date)} · şiddet ${u.intensity}/5`}
            className="flex-1 rounded-t"
            style={{ height: `${u.intensity * 20}%`, background: "linear-gradient(180deg,#F59E0B,#7C5CE6)", minWidth: 8 }} />
        ))}
      </div>
      <p className={`mt-2 text-xs ${T.faint}`}>Son {last.length} dalga · ortalama şiddet {avg}/5. Zamanla bu çubukların kısalması beklenir.</p>
    </div>
  );
}

/* Risk saatleri: dalga + sıfırlama zamanlarının dağılımı */
function RiskHours({ T, events }) {
  const buckets = [
    { l: "Gece", r: "00–06" },
    { l: "Sabah", r: "06–12" },
    { l: "Öğle", r: "12–18" },
    { l: "Akşam", r: "18–24" },
  ];
  const c = [0, 0, 0, 0];
  (events || []).forEach((ts) => { c[Math.floor(new Date(ts).getHours() / 6)]++; });
  const total = c.reduce((a, b) => a + b, 0);
  if (total === 0) {
    return <p className={`text-sm ${T.sub}`}>Dalga ve sıfırlama kayıtları biriktikçe en riskli saat dilimlerin burada belirecek.</p>;
  }
  const max = Math.max(...c, 1);
  const top = buckets[c.indexOf(max)];
  return (
    <div>
      <div className="space-y-2">
        {buckets.map((b, i) => (
          <div key={b.l} className="flex items-center gap-2">
            <span className={`w-16 text-sm font-semibold ${T.text}`}>{b.l}</span>
            <div className="flex-1"><Bar T={T} pct={(c[i] / max) * 100} gradient={GRAD_SOS} h={10} /></div>
            <span className={`w-6 text-right text-sm ${T.faint}`}>{c[i]}</span>
          </div>
        ))}
      </div>
      <p className={`mt-3 rounded-2xl p-3 text-sm leading-relaxed ${T.sub}`} style={T.softStyle}>
        En riskli dilimin <span className="font-bold text-rose-400">{top.l} ({top.r})</span>. Bu saatler için önceden bir plan ve ortam düzenlemesi yap.
      </p>
    </div>
  );
}

/* 4-7-8 nefes egzersizi animasyonu */
function Breathing() {
  const PH = [
    { l: "Nefes al", d: 4 },
    { l: "Tut", d: 7 },
    { l: "Yavaşça ver", d: 8 },
  ];
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(PH[0].d);

  useEffect(() => {
    setCount(PH[phase].d);
    const iv = setInterval(() => setCount((c) => Math.max(1, c - 1)), 1000);
    const to = setTimeout(() => setPhase((p) => (p + 1) % 3), PH[phase].d * 1000);
    return () => { clearInterval(iv); clearTimeout(to); };
  }, [phase]);

  const big = phase !== 2;
  const dur = phase === 0 ? 4 : phase === 1 ? 0.3 : 8;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div
          className="absolute h-32 w-32 rounded-full"
          style={{ background: GRAD_MAIN, opacity: 0.22, transform: `scale(${big ? 1.7 : 1})`, transition: `transform ${dur}s ease-in-out` }}
        />
        <div
          className="absolute flex h-32 w-32 items-center justify-center rounded-full border border-violet-300"
          style={{ backgroundColor: "rgba(124,92,230,0.30)", transform: `scale(${big ? 1.35 : 1})`, transition: `transform ${dur}s ease-in-out` }}
        >
          <Wind className="text-amber-300" size={28} />
        </div>
      </div>
      <p className="mt-2 text-xl font-bold text-violet-200">{PH[phase].l}</p>
      <p className="text-sm text-slate-400">{count}</p>
    </div>
  );
}

/* Kutlama konfetisi */
function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.35,
    dur: 1 + Math.random() * 0.9,
    color: ["#7C5CE6", "#F59E0B", "#10B981", "#F43F5E", "#6366F1", "#FBBF24"][i % 6],
    rot: Math.random() * 360,
  })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <span key={i} className="confetti"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, backgroundColor: p.color, transform: `rotate(${p.rot}deg)` }} />
      ))}
    </div>
  );
}

/* ============================================================
   KATMANLAR
   ============================================================ */

/* Dürtü anı — tam ekran dayanma modu (her temada bilinçli olarak loş) */
function PanicOverlay({ reasons, onSurvived }) {
  const [left, setLeft] = useState(600);
  const [intensity, setIntensity] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "linear-gradient(180deg,#1A1433 0%,#2A1B4A 55%,#3A1E3F 100%)" }}
    >
      <div className="mx-auto max-w-md px-6 pb-12 pt-8 text-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-widest text-amber-400">DAYANMA MODU</h2>
          <span className="rounded-full border border-violet-400 bg-violet-500 bg-opacity-20 px-3 py-1 text-sm font-bold text-violet-200">
            {pad2(Math.floor(left / 60))}:{pad2(left % 60)}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Dürtüler dalga gibidir: yükselir, tepe yapar ve geçer — çoğu zaman
          dakikalar içinde. Tek görevin dalganın geçmesini izlemek.
        </p>
        {left === 0 && (
          <p className="mt-2 rounded-2xl border border-emerald-400 bg-emerald-500 bg-opacity-15 p-3 text-sm font-semibold text-emerald-300">
            Dalga geçti. Hâlâ buradasın. 💪
          </p>
        )}

        <div className="mt-6 flex justify-center"><Breathing /></div>
        <p className="mt-1 text-center text-xs text-slate-400">4-7-8 nefes düzeni · ritmi daireye bırak</p>

        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-violet-300">Neden buradasın</h3>
          {reasons.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">
              Henüz sebep yazmamışsın. Sakin bir anında ana sayfadan ekle —
              tam da böyle anlarda işe yarar.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {reasons.map((r, i) => (
                <li key={i} className="rounded-2xl border border-violet-800 p-3 text-sm leading-relaxed"
                  style={{ backgroundColor: "rgba(124,92,230,0.12)" }}>
                  <span className="mr-2 text-amber-400">◆</span>{r}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-violet-300">Şimdi yapabileceklerin</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ALTERNATIVES.map((a, i) => (
              <div key={i} className="rounded-2xl border border-violet-900 p-3 text-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                <span className="mr-1">{a.i}</span> {a.t}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <p className="text-sm font-semibold text-slate-300">Bu dalga ne kadar güçlüydü?</p>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setIntensity(n)}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors ${intensity === n ? "border-amber-400 bg-amber-500 bg-opacity-25 text-amber-300" : "border-violet-800 text-slate-300"}`}>
                {n}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">1 hafif · 5 çok güçlü (kaydı analize işlenir)</p>
        </div>

        <button
          onClick={() => onSurvived(intensity ?? 3)}
          className="pop mt-6 w-full rounded-2xl py-4 text-base font-extrabold text-white transition-transform active:scale-95"
          style={{ background: GRAD_GOOD }}
        >
          Dalga geçti, iyiyim ✓
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Bu butona her basışın kayda geçen bir zaferdir: +20 XP.
        </p>
      </div>
    </div>
  );
}

/* Dürüst kayıt: sıfırlama öncesi kısa refleksiyon + onay */
function ResetModal({ T, curDays, onCancel, onConfirm }) {
  const [step, setStep] = useState(1);
  const [trigger, setTrigger] = useState(null);
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60 p-4 sm:items-center">
      <div className="fade-up w-full max-w-md rounded-3xl border p-6" style={T.cardStyle}>
        {step === 1 ? (
          <>
            <h3 className={`text-lg font-extrabold ${T.text}`}>Dürüst Kayıt</h3>
            <p className={`mt-1 text-sm leading-relaxed ${T.sub}`}>
              Sıfırlamadan önce kısa bir bakış. Bu, suçlamak için değil —
              kalıbı görmek için. İstersen atlayabilirsin.
            </p>

            <p className={`mt-5 text-sm font-semibold ${T.text}`}>Tetikleyici neydi?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TRIGGERS.map((t) => (
                <Chip key={t} T={T} on={trigger === t} onClick={() => setTrigger(trigger === t ? null : t)}>{t}</Chip>
              ))}
            </div>

            <p className={`mt-5 text-sm font-semibold ${T.text}`}>Şu an nasıl hissediyorsun?</p>
            <div className="mt-2 flex gap-2">
              {MOODS.map((m, i) => (
                <button key={i} onClick={() => setMood(mood === i ? null : i)} aria-label={m.l}
                  className={`flex-1 rounded-xl border py-2 text-2xl transition-colors ${mood === i ? T.chipOn : T.chip}`}>
                  {m.e}
                </button>
              ))}
            </div>

            <textarea
              value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Eklemek istediğin bir not (opsiyonel)" rows={2}
              className={`mt-4 w-full rounded-2xl border p-3 text-sm outline-none ${T.input}`}
            />

            <div className="mt-5 flex gap-3">
              <button onClick={() => setStep(2)} className={`flex-1 rounded-2xl border py-3 text-sm font-semibold ${T.chip}`}>Atla</button>
              <button onClick={() => setStep(2)} className="flex-1 rounded-2xl py-3 text-sm font-extrabold text-white" style={{ background: GRAD_BTN }}>Devam</button>
            </div>
          </>
        ) : (
          <>
            <h3 className={`text-lg font-extrabold ${T.text}`}>Sayaç sıfırlanacak</h3>
            <p className={`mt-2 text-sm leading-relaxed ${T.sub}`}>
              {curDays >= 1 ? `${curDays} günlük bu seri` : "Bu kısa seri"} kayda
              işlenecek — emeğin kaybolmuyor, veriye dönüşüyor. Düşüş, sürecin
              parçası. Hazır mısın?
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={onCancel} className={`flex-1 rounded-2xl border py-3 text-sm font-semibold ${T.chip}`}>Vazgeç</button>
              <button onClick={() => onConfirm({ trigger, mood, note: note.trim() })}
                className="flex-1 rounded-2xl bg-rose-500 py-3 text-sm font-extrabold text-white">
                Sıfırla ve devam et
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* Fabrika ayarları — çift onay */
function FactoryModal({ T, onCancel, onWipe }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60 p-4 sm:items-center">
      <div className="fade-up w-full max-w-md rounded-3xl border p-6" style={T.cardStyle}>
        <h3 className="text-lg font-extrabold text-rose-500">Tüm verileri sil</h3>
        <p className={`mt-2 text-sm leading-relaxed ${T.sub}`}>
          Seri geçmişi, günlük, rozetler, XP ve sebepler dahil her şey kalıcı
          olarak silinir. Bu işlem geri alınamaz.
        </p>
        <label className={`mt-4 flex items-start gap-3 text-sm ${T.text}`}>
          <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="mt-1 h-4 w-4 accent-rose-500" />
          Tüm verilerimin kalıcı olarak silineceğini anlıyorum.
        </label>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancel} className={`flex-1 rounded-2xl border py-3 text-sm font-semibold ${T.chip}`}>Vazgeç</button>
          <button onClick={onWipe} disabled={!ok}
            className={`flex-1 rounded-2xl py-3 text-sm font-extrabold text-white ${ok ? "bg-rose-500" : "bg-rose-300"}`}>
            <Trash2 size={16} className="mr-1 inline" /> Sil
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SEKMELER
   ============================================================ */

function HomeTab({ d, T, now, update, setToast, onResetClick, onCelebrate }) {
  const [txt, setTxt] = useState("");

  const ms = now - d.startDate;
  const days = Math.floor(ms / DAY);
  const hrs = Math.floor((ms % DAY) / 3600000);
  const min = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const curFloat = ms / DAY;

  const nextIdx = MILESTONES.findIndex((m) => curFloat < m.d);
  const next = nextIdx === -1 ? null : MILESTONES[nextIdx];
  const prevD = nextIdx <= 0 ? 0 : MILESTONES[nextIdx - 1].d;
  const progress = next ? (curFloat - prevD) / (next.d - prevD) : 1;

  const doy = Math.floor((now - new Date(new Date(now).getFullYear(), 0, 0).getTime()) / DAY);
  const quote = QUOTES[doy % QUOTES.length];

  const todayKey = isoDate(now);
  const checked = !!d.checkIns[todayKey];

  /* XP & rütbe */
  const xp = calcXP(d, curFloat);
  const { cur, next: nextRank } = rankOf(xp);
  const rankPct = nextRank ? ((xp - cur.xp) / (nextRank.xp - cur.xp)) * 100 : 100;

  /* Günün görevleri */
  const questIdx = questsFor(todayKey);
  const doneToday = d.questLog[todayKey] || [];
  const toggleQuest = (qi) => {
    update((p) => {
      const arr = p.questLog[todayKey] || [];
      const on = arr.includes(qi);
      const nextArr = on ? arr.filter((x) => x !== qi) : [...arr, qi];
      return { questLog: { ...p.questLog, [todayKey]: nextArr } };
    });
    if (!doneToday.includes(qi)) setToast("Görev tamam: +10 XP ⚡");
  };

  const addReason = () => {
    const v = txt.trim();
    if (!v) return;
    update((p) => ({ reasons: [...p.reasons, v] }));
    setTxt("");
  };

  return (
    <div className="space-y-5">
      {/* Günün sözü */}
      <div className="rounded-3xl border-l-4 border-amber-400 p-4" style={T.softStyle}>
        <p className={`text-sm italic leading-relaxed ${T.text}`}>“{quote}”</p>
      </div>

      {/* Sayaç kartı */}
      <Card T={T} className="py-7 text-center">
        <Ring progress={progress} T={T}>
          <Flame className="text-amber-500" size={22} />
          <Grad className="text-6xl font-extrabold tracking-tight">{days}</Grad>
          <span className={`text-xs font-bold uppercase tracking-widest ${T.faint}`}>gün</span>
          <span className={`mt-1 text-sm font-semibold ${T.sub}`}>{pad2(hrs)} sa {pad2(min)} dk {pad2(sec)} sn</span>
        </Ring>

        <p className={`mt-3 text-sm italic ${T.sub}`}>{heroLine(curFloat)}</p>
        <p className={`mt-2 text-sm ${T.sub}`}>
          {next
            ? <>Sıradaki rozet: <span className="font-bold text-violet-500">{next.icon} {next.name}</span> · {Math.ceil(next.d - curFloat)} gün kaldı</>
            : <>Tüm rozetler açıldı 👑 Artık bu bir yaşam tarzı.</>}
        </p>

        {/* Rütbe çubuğu */}
        <div className="mt-5 px-2 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className={`font-bold ${T.text}`}>{cur.icon} {cur.name}</span>
            <span className={T.faint}>{xp} XP{nextRank ? ` · sıradaki: ${nextRank.name}` : ""}</span>
          </div>
          <div className="mt-1.5"><Bar T={T} pct={rankPct} /></div>
        </div>

        {/* Hedef çubuğu */}
        {d.goal > 0 && (
          <div className="mt-4 px-2 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className={`flex items-center gap-1 font-bold ${T.text}`}><Target size={14} className="text-emerald-500" /> Hedef: {d.goal} gün</span>
              <span className={T.faint}>{Math.max(0, Math.ceil(d.goal - curFloat))} gün kaldı</span>
            </div>
            <div className="mt-1.5"><Bar T={T} pct={(curFloat / d.goal) * 100} gradient={GRAD_GOOD} /></div>
          </div>
        )}
      </Card>

      {/* Günlük check-in */}
      {checked ? (
        <div className="flex items-center gap-3 rounded-3xl border border-emerald-400 p-4"
          style={{ backgroundColor: "rgba(16,185,129,0.10)" }}>
          <CheckCircle2 className="text-emerald-500" size={22} />
          <p className="text-sm font-semibold text-emerald-600">Bugün onaylandı — böyle devam.</p>
        </div>
      ) : (
        <button
          onClick={() => {
            update((p) => ({ checkIns: { ...p.checkIns, [todayKey]: true } }));
            setToast("Bugün kayda geçti: +10 XP ✓");
            onCelebrate();
          }}
          className="w-full rounded-3xl py-4 text-base font-extrabold text-white transition-transform active:scale-95"
          style={{ background: GRAD_GOOD, boxShadow: "0 10px 25px rgba(16,185,129,0.35)" }}
        >
          Bugünü temiz olarak işaretle ✓
        </button>
      )}

      {/* Günün görevleri */}
      <Card T={T}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Günün görevleri</h3>
          <span className={`text-xs font-bold ${T.faint}`}>{doneToday.length}/3</span>
        </div>
        <p className={`mt-1 text-xs ${T.faint}`}>İradeyi besleyen küçük zaferler — her biri +10 XP.</p>
        <ul className="mt-3 space-y-2">
          {questIdx.map((qi) => {
            const q = QUESTS[qi];
            if (!q) return null; /* emniyet kemeri: geçersiz indeks asla çökertmesin */
            const on = doneToday.includes(qi);
            return (
              <li key={qi}>
                <button onClick={() => toggleQuest(qi)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm transition-colors ${on ? "border-emerald-400" : T.chip}`}
                  style={on ? { backgroundColor: "rgba(16,185,129,0.10)" } : T.softStyle}>
                  <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border ${on ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300"}`}>
                    {on && <Check size={14} />}
                  </span>
                  <span className={`${on ? "line-through opacity-70" : ""} ${T.text}`}>{q.i} {q.t}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Neden buradayım */}
      <Card T={T}>
        <h3 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${T.sub}`}>
          <Sparkles size={15} className="text-amber-500" /> Neden buradayım
        </h3>
        {d.reasons.length === 0 && (
          <p className={`mt-2 text-sm ${T.faint}`}>
            Kendi cümlelerinle yaz: bu yola neden çıktın? Zor anlarda sana bunlar hatırlatılacak.
          </p>
        )}
        <ul className="mt-3 space-y-2">
          {d.reasons.map((r, i) => (
            <li key={i} className="flex items-start justify-between gap-3 rounded-2xl p-3 text-sm" style={T.softStyle}>
              <span className={T.text}><span className="mr-2 text-violet-500">◆</span>{r}</span>
              <button onClick={() => update((p) => ({ reasons: p.reasons.filter((_, j) => j !== i) }))}
                aria-label="Sebebi sil" className={T.faint}><X size={16} /></button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <input
            value={txt} onChange={(e) => setTxt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addReason()}
            placeholder="Yeni sebep ekle…"
            className={`flex-1 rounded-2xl border px-3 py-2.5 text-sm outline-none ${T.input}`}
          />
          <button onClick={addReason} aria-label="Ekle" className="rounded-2xl px-4 text-white" style={{ background: GRAD_BTN }}>
            <Plus size={18} />
          </button>
        </div>
      </Card>

      {/* Yeniden başla */}
      <button onClick={onResetClick}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border border-rose-400 py-3.5 text-sm font-bold text-rose-500">
        <RotateCcw size={16} /> Yeniden Başla
      </button>
      <p className={`-mt-2 text-center text-xs ${T.faint}`}>Dürüst kayıt: düşüş olduysa burayı kullan. Yargı yok, veri var.</p>
    </div>
  );
}

function JournalTab({ d, T, update, setToast }) {
  const [mood, setMood] = useState(null);
  const [trigs, setTrigs] = useState([]);
  const [note, setNote] = useState("");

  const toggle = (t) => setTrigs((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const save = () => {
    if (mood === null && trigs.length === 0 && !note.trim()) { setToast("Önce bir şeyler ekle ✍️"); return; }
    update((p) => ({ journal: [{ date: Date.now(), mood, triggers: trigs, note: note.trim() }, ...p.journal] }));
    setMood(null); setTrigs([]); setNote("");
    setToast("Günlük kaydedildi: +15 XP ✍️");
  };

  return (
    <div className="space-y-5">
      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Bugünkü ruh halin</h3>
        <div className="mt-3 flex gap-2">
          {MOODS.map((m, i) => (
            <button key={i} onClick={() => setMood(mood === i ? null : i)} aria-label={m.l}
              className={`flex flex-1 flex-col items-center rounded-2xl border py-2 transition-colors ${mood === i ? T.chipOn : T.chip}`}>
              <span className="text-2xl">{m.e}</span>
              <span className="mt-0.5 text-xs">{m.l}</span>
            </button>
          ))}
        </div>

        <h3 className={`mt-5 text-sm font-bold uppercase tracking-wider ${T.sub}`}>Tetikleyiciler</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRIGGERS.map((t) => <Chip key={t} T={T} on={trigs.includes(t)} onClick={() => toggle(t)}>{t}</Chip>)}
        </div>

        <textarea
          value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Bugün zihninden geçenler…" rows={3}
          className={`mt-4 w-full rounded-2xl border p-3 text-sm outline-none ${T.input}`}
        />
        <button onClick={save} className="mt-3 w-full rounded-2xl py-3 text-sm font-extrabold text-white" style={{ background: GRAD_BTN }}>
          Kaydet
        </button>
      </Card>

      <div className="space-y-3">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Geçmiş kayıtlar</h3>
        {d.journal.length === 0 && <p className={`text-sm ${T.faint}`}>Henüz kayıt yok. İlk satır seni bekliyor.</p>}
        {d.journal.slice(0, 30).map((j, i) => (
          <Card T={T} key={i} className="p-4">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${T.faint}`}>{fmtDate(j.date)}</span>
              {j.mood !== null && j.mood !== undefined && <span className="text-xl">{MOODS[j.mood].e}</span>}
            </div>
            {j.triggers && j.triggers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {j.triggers.map((t) => <span key={t} className={`rounded-full border px-2 py-0.5 text-xs ${T.chip}`}>{t}</span>)}
              </div>
            )}
            {j.note && <p className={`mt-2 text-sm leading-relaxed ${T.text}`}>{j.note}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatsTab({ d, T, now }) {
  const curFloat = (now - d.startDate) / DAY;
  const curDays = Math.floor(curFloat);
  const best = Math.floor(Math.max(d.bestStreak, curFloat));

  const totalDays = Math.max(1, Math.floor((startOfDay(now) - startOfDay(d.installDate)) / DAY) + 1);
  const resetSet = useMemo(() => new Set(d.resetLog.map((r) => isoDate(r.date))), [d.resetLog]);
  const clean = totalDays - resetSet.size;
  const rate = Math.round((clean / totalDays) * 100);

  /* Haftalık özet (son 7 gün) */
  const weekKeys = useMemo(() => Array.from({ length: 7 }, (_, i) => isoDate(now - i * DAY)), [Math.floor(now / DAY)]);
  const weekStart = now - 7 * DAY;
  const wCheck = weekKeys.filter((k) => d.checkIns[k]).length;
  const wUrges = (d.urgeLog || []).filter((u) => u.date >= weekStart).length;
  const wQuests = weekKeys.reduce((s, k) => s + ((d.questLog[k] || []).length), 0);
  const wMoods = d.journal.filter((j) => j.date >= weekStart && j.mood !== null && j.mood !== undefined);
  const wMood = wMoods.length ? MOODS[Math.round(wMoods.reduce((s, j) => s + j.mood, 0) / wMoods.length)].e : "—";

  /* Tetikleyici sayımı: günlük + sıfırlama kayıtları */
  const trigCounts = useMemo(() => {
    const c = {};
    d.journal.forEach((j) => (j.triggers || []).forEach((t) => (c[t] = (c[t] || 0) + 1)));
    d.resetLog.forEach((r) => { if (r.trigger) c[r.trigger] = (c[r.trigger] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [d.journal, d.resetLog]);
  const maxTrig = trigCounts.length ? trigCounts[0][1] : 1;
  const topTip = trigCounts.length ? TRIGGER_TIPS[trigCounts[0][0]] : null;

  const riskEvents = useMemo(
    () => [...(d.urgeLog || []).map((u) => u.date), ...d.resetLog.map((r) => r.date)],
    [d.urgeLog, d.resetLog]
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <StatCard T={T} label="Mevcut Seri" value={`${curDays} gün`} grad />
        <StatCard T={T} label="En Uzun Seri" value={`${best} gün`} />
        <StatCard T={T} label="Toplam Temiz Gün" value={clean} />
        <StatCard T={T} label="Başarı Oranı" value={`%${rate}`} />
        <StatCard T={T} label="Sıfırlama" value={d.totalResets} />
        <StatCard T={T} label="Atlatılan Dalga" value={d.urgesSurvived} />
      </div>

      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Bu hafta</h3>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          <div className="rounded-2xl p-3" style={T.softStyle}>
            <p className={`text-lg font-extrabold ${T.text}`}>{wCheck}/7</p>
            <p className={`text-xs ${T.faint}`}>onay</p>
          </div>
          <div className="rounded-2xl p-3" style={T.softStyle}>
            <p className={`text-lg font-extrabold ${T.text}`}>{wUrges}</p>
            <p className={`text-xs ${T.faint}`}>dalga</p>
          </div>
          <div className="rounded-2xl p-3" style={T.softStyle}>
            <p className={`text-lg font-extrabold ${T.text}`}>{wQuests}</p>
            <p className={`text-xs ${T.faint}`}>görev</p>
          </div>
          <div className="rounded-2xl p-3" style={T.softStyle}>
            <p className="text-lg font-extrabold">{wMood}</p>
            <p className={`text-xs ${T.faint}`}>ruh hali</p>
          </div>
        </div>
      </Card>

      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Son 12 hafta</h3>
        <div className="mt-3">
          <Heatmap T={T} installDate={d.installDate} resetSet={resetSet} checkIns={d.checkIns} />
        </div>
      </Card>

      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Seri eğrisi</h3>
        <div className="mt-3"><StreakChart T={T} history={d.streakHistory} current={curFloat} /></div>
      </Card>

      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Dalga şiddeti</h3>
        <div className="mt-3"><UrgeBars T={T} log={d.urgeLog} /></div>
      </Card>

      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Risk saatleri</h3>
        <div className="mt-3"><RiskHours T={T} events={riskEvents} /></div>
      </Card>

      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>En sık tetikleyiciler</h3>
        {trigCounts.length === 0 ? (
          <p className={`mt-2 text-sm ${T.faint}`}>Günlüğe tetikleyici işledikçe burada örüntüler belirecek.</p>
        ) : (
          <>
            <div className="mt-3 space-y-2">
              {trigCounts.map(([t, n]) => (
                <div key={t}>
                  <div className={`flex justify-between text-sm ${T.text}`}><span>{t}</span><span className={T.faint}>{n}</span></div>
                  <div className="mt-1"><Bar T={T} pct={(n / maxTrig) * 100} h={8} /></div>
                </div>
              ))}
            </div>
            {topTip && (
              <p className={`mt-4 rounded-2xl border border-violet-300 p-3 text-sm leading-relaxed ${T.text}`}
                style={{ backgroundColor: "rgba(124,92,230,0.08)" }}>
                <span className="font-bold text-violet-500">Taktik · {trigCounts[0][0]}: </span>{topTip}
              </p>
            )}
          </>
        )}
      </Card>

      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Düşüş günlüğü</h3>
        {d.resetLog.length === 0 ? (
          <p className={`mt-2 text-sm ${T.faint}`}>Kayıt yok — seri sürüyor. 🌊</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {d.resetLog.slice(0, 8).map((r, i) => (
              <li key={i} className="rounded-2xl p-3 text-sm" style={T.softStyle}>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${T.text}`}>
                    {r.streakDays >= 1 ? `${Math.floor(r.streakDays)} günlük seri` : "1 günden kısa seri"}
                  </span>
                  {r.mood !== null && r.mood !== undefined && <span>{MOODS[r.mood].e}</span>}
                </div>
                <p className={`mt-0.5 text-xs ${T.faint}`}>{fmtDate(r.date)}{r.trigger ? ` · ${r.trigger}` : ""}</p>
                {r.note && <p className={`mt-1 text-xs ${T.sub}`}>{r.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function JourneyTab({ d, T, now }) {
  const curFloat = (now - d.startDate) / DAY;
  const maxEver = Math.max(d.bestStreak, curFloat);
  const dayNum = Math.floor(curFloat) + 1;
  const nextLocked = MILESTONES.find((m) => maxEver < m.d);

  const xp = calcXP(d, curFloat);
  const { cur, next: nextRank } = rankOf(xp);
  const rankPct = nextRank ? ((xp - cur.xp) / (nextRank.xp - cur.xp)) * 100 : 100;

  const [openW, setOpenW] = useState(null);

  return (
    <div className="space-y-5">
      {/* Rütbe kartı */}
      <Card T={T} className="text-center">
        <span className="text-5xl">{cur.icon}</span>
        <Grad className="mt-1 block text-2xl font-extrabold">{cur.name}</Grad>
        <p className={`mt-1 text-sm ${T.sub}`}>{xp} XP{nextRank ? ` · ${nextRank.name} için ${nextRank.xp - xp} XP kaldı` : " · zirvedesin"}</p>
        <div className="mt-3"><Bar T={T} pct={rankPct} /></div>
        <p className={`mt-3 text-xs ${T.faint}`}>+10 günlük onay · +15 günlük kaydı · +20 atlatılan dalga · +10 görev · +30 rozet</p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-left">
          {RANKS.map((r) => {
            const passed = xp >= r.xp;
            const isCur = r.name === cur.name;
            return (
              <div key={r.name}
                className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${isCur ? "border-violet-400" : passed ? "border-emerald-300" : T.chip}`}
                style={isCur ? { backgroundColor: "rgba(124,92,230,0.10)" } : passed ? { backgroundColor: "rgba(16,185,129,0.07)" } : T.softStyle}>
                <span>{r.icon}</span>
                <span className={`flex-1 font-semibold ${passed ? T.text : T.faint}`}>{r.name}</span>
                <span className={`text-xs ${T.faint}`}>{passed && !isCur ? "✓" : r.xp}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Seri rozetleri */}
      <div>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Seri rozetleri</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {MILESTONES.map((m) => {
            const open = maxEver >= m.d;
            const isNext = nextLocked && nextLocked.d === m.d;
            return (
              <div key={m.d} className={`relative rounded-3xl border p-4 ${open ? "border-violet-400" : isNext ? "border-amber-400" : ""} ${open ? "" : "opacity-70"}`}
                style={T.cardStyle}>
                {!open && !isNext && <Lock size={14} className={`absolute right-3 top-3 ${T.faint}`} />}
                {isNext && <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">Sıradaki</span>}
                <div className={`text-3xl ${open ? "" : "grayscale"}`}>{m.icon}</div>
                {open
                  ? <Grad className="mt-2 block text-sm font-extrabold">{m.name}</Grad>
                  : <p className={`mt-2 text-sm font-extrabold ${T.text}`}>{m.name}</p>}
                <p className={`mt-0.5 text-xs leading-snug ${T.faint}`}>{m.desc}</p>
                <p className={`mt-2 text-xs font-bold ${open ? "text-violet-500" : T.faint}`}>{m.d} gün</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savunma rozetleri */}
      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Savunma rozetleri</h3>
        <p className={`mt-1 text-xs ${T.faint}`}>Dayanma modunda atlattığın dalgalarla açılır. Şu an: {d.urgesSurvived} dalga.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DEFENSE.map((b) => {
            const open = d.urgesSurvived >= b.n;
            return (
              <div key={b.n} className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm ${open ? "border-amber-400" : T.chip} ${open ? "" : "opacity-70"}`}
                style={open ? { backgroundColor: "rgba(245,158,11,0.10)" } : T.softStyle}>
                <span className={`text-xl ${open ? "" : "grayscale"}`}>{b.icon}</span>
                <span className={`flex-1 font-semibold ${T.text}`}>{b.name}</span>
                <span className={`text-xs ${T.faint}`}>{b.n}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Fayda zaman çizelgesi */}
      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Fayda zaman çizelgesi</h3>
        <div className="mt-4">
          {BENEFITS.map((b, i) => {
            const active = dayNum >= b.from && dayNum <= b.to;
            return (
              <div key={i} className="relative flex gap-3 pb-5">
                {i < BENEFITS.length - 1 && (
                  <span className="absolute left-1.5 top-4 h-full" style={{ width: 2, backgroundColor: T.ringTrack }} />
                )}
                <span className="relative mt-1 h-3.5 w-3.5 flex-none rounded-full border"
                  style={active ? { background: GRAD_MAIN, borderColor: "transparent" } : { backgroundColor: T.ringTrack, borderColor: "transparent" }} />
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${active ? "text-violet-500" : T.faint}`}>
                    Gün {b.from}{b.to > 9000 ? "+" : `–${b.to}`}{active ? " · buradasın" : ""}
                  </p>
                  <p className={`text-sm font-bold ${T.text}`}>{b.title}</p>
                  <p className={`mt-0.5 text-sm leading-relaxed ${T.sub}`}>{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className={`mt-1 text-xs italic leading-relaxed ${T.faint}`}>
          Bu çizelge, benzer süreçlerden geçenlerin yaygın olarak paylaştığı
          deneyimlere dayanır. Herkesin süreci farklıdır; bilimsel bir garanti değildir.
        </p>
      </Card>

      {/* Bilgelik kütüphanesi */}
      <Card T={T}>
        <h3 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${T.sub}`}>
          <Brain size={15} className="text-violet-500" /> Bilgelik kütüphanesi
        </h3>
        <p className={`mt-1 text-xs ${T.faint}`}>Süreci anlamak, sürece dayanmayı kolaylaştırır.</p>
        <div className="mt-3 space-y-2">
          {WISDOM.map((w, i) => {
            const open = openW === i;
            return (
              <div key={i} className="rounded-2xl border" style={open ? { borderColor: "#A78BFA", backgroundColor: "rgba(124,92,230,0.06)" } : { borderColor: T.cardStyle.borderColor }}>
                <button onClick={() => setOpenW(open ? null : i)}
                  className="flex w-full items-center gap-2 p-3 text-left">
                  <span className="text-lg">{w.icon}</span>
                  <span className={`flex-1 text-sm font-bold ${T.text}`}>{w.title}</span>
                  <ChevronDown size={16} className={`${T.faint} transition-transform`} style={{ transform: open ? "rotate(180deg)" : "none" }} />
                </button>
                {open && <p className={`px-3 pb-3 text-sm leading-relaxed ${T.sub}`}>{w.body}</p>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function SettingsTab({ d, T, update, onFactory, storageOk, savedAt, replaceData, setToast }) {
  const dark = d.theme === "dark";
  const [goalTxt, setGoalTxt] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [importTxt, setImportTxt] = useState("");
  const exportRef = useRef(null);

  const exportTxt = useMemo(() => JSON.stringify(d), [d, showExport]);

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportTxt);
      setToast("Yedek panoya kopyalandı 📋");
    } catch (e) {
      if (exportRef.current) {
        exportRef.current.select();
        try { document.execCommand("copy"); setToast("Yedek panoya kopyalandı 📋"); }
        catch (e2) { setToast("Kopyalanamadı — metni elle seçip kopyala"); }
      }
    }
  };

  const doImport = () => {
    try {
      const parsed = JSON.parse(importTxt);
      if (!parsed || typeof parsed !== "object" || !parsed.startDate) throw new Error("biçim");
      replaceData(parsed);
      setImportTxt("");
      setToast("Veriler içe aktarıldı ✓");
    } catch (e) {
      setToast("Geçersiz yedek metni — olduğu gibi yapıştırdığından emin ol");
    }
  };

  return (
    <div className="space-y-5">
      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Görünüm</h3>
        <div className="mt-3 flex gap-3">
          <button onClick={() => update({ theme: "light" })}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-semibold ${!dark ? T.chipOn : T.chip}`}>
            <Sun size={16} /> Şafak
          </button>
          <button onClick={() => update({ theme: "dark" })}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-semibold ${dark ? T.chipOn : T.chip}`}>
            <Moon size={16} /> Gece
          </button>
        </div>
      </Card>

      <Card T={T}>
        <h3 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${T.sub}`}>
          <Target size={15} className="text-emerald-500" /> Hedefim
        </h3>
        <p className={`mt-1 text-xs ${T.faint}`}>Ana sayfadaki yeşil çubuğun hedefi. Şu an: {d.goal} gün.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[30, 60, 90, 180, 365].map((g) => (
            <Chip key={g} T={T} on={d.goal === g} onClick={() => update({ goal: g })}>{g} gün</Chip>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={goalTxt} onChange={(e) => setGoalTxt(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Özel hedef (gün)" inputMode="numeric"
            className={`flex-1 rounded-2xl border px-3 py-2.5 text-sm outline-none ${T.input}`} />
          <button onClick={() => { const g = parseInt(goalTxt, 10); if (g > 0) { update({ goal: g }); setGoalTxt(""); setToast(`Hedef ${g} gün olarak ayarlandı 🎯`); } }}
            className="rounded-2xl px-4 text-sm font-bold text-white" style={{ background: GRAD_BTN }}>Ayarla</button>
        </div>
      </Card>

      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Veri & yedekleme</h3>
        <div className={`mt-3 flex items-start gap-2 rounded-2xl p-3 text-sm leading-relaxed ${T.sub}`} style={T.softStyle}>
          {storageOk === true && <><Cloud size={18} className="mt-0.5 flex-none text-emerald-500" /><span>Kalıcı depolama aktif.{savedAt ? ` Son kayıt: ${fmtTime(savedAt)}` : " Bu oturumda henüz değişiklik kaydedilmedi."}</span></>}
          {storageOk === false && <><CloudOff size={18} className="mt-0.5 flex-none text-rose-500" /><span>Kalıcı depolama bulunamadı — bu ortam desteklemiyor olabilir. Verini kaybetmemek için aşağıdan düzenli yedek al.</span></>}
          {storageOk === null && <><Cloud size={18} className={`mt-0.5 flex-none ${T.faint}`} /><span>Depolama denetleniyor…</span></>}
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={() => setShowExport(!showExport)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-semibold ${T.chip}`}>
            <Download size={16} /> Dışa aktar
          </button>
        </div>
        {showExport && (
          <div className="mt-3">
            <textarea ref={exportRef} readOnly value={exportTxt} rows={4}
              className={`w-full rounded-2xl border p-3 text-xs outline-none ${T.input}`} />
            <button onClick={copyExport}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white" style={{ background: GRAD_BTN }}>
              <Copy size={16} /> Panoya kopyala
            </button>
            <p className={`mt-1 text-xs ${T.faint}`}>Bu metni not uygulamana kaydet; gerektiğinde aşağıdan geri yükleyebilirsin.</p>
          </div>
        )}

        <div className="mt-4">
          <p className={`text-sm font-semibold ${T.text}`}><Upload size={14} className="mr-1 inline" /> İçe aktar</p>
          <textarea value={importTxt} onChange={(e) => setImportTxt(e.target.value)} rows={3}
            placeholder="Yedek metnini buraya yapıştır…"
            className={`mt-2 w-full rounded-2xl border p-3 text-xs outline-none ${T.input}`} />
          <button onClick={doImport} disabled={!importTxt.trim()}
            className={`mt-2 w-full rounded-2xl border py-3 text-sm font-bold ${importTxt.trim() ? "border-emerald-400 text-emerald-600" : T.chip}`}>
            Yedeği geri yükle
          </button>
        </div>
      </Card>

      <Card T={T}>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${T.sub}`}>Gizlilik</h3>
        <p className={`mt-2 text-sm leading-relaxed ${T.sub}`}>
          Tüm verilerin yalnızca bu cihazda/oturumda saklanır; hiçbir sunucuya
          gönderilmez. Takip başlangıcı: <span className={`font-semibold ${T.text}`}>{fmtDate(d.installDate)}</span>
        </p>
      </Card>

      <div className="rounded-3xl border border-rose-400 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-rose-500">Tehlikeli bölge</h3>
        <p className={`mt-2 text-sm ${T.sub}`}>Her şeyi silip sıfırdan başlamak istersen:</p>
        <button onClick={onFactory} className="mt-3 w-full rounded-2xl border border-rose-400 py-3 text-sm font-bold text-rose-500">
          Fabrika ayarlarına dön
        </button>
      </div>

      <p className={`text-center text-xs ${T.faint}`}>İRADE v2 · tamamen yerel çalışır</p>
    </div>
  );
}

/* ============================================================
   ANA UYGULAMA
   ============================================================ */

export default function App() {
  const [data, setData] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState("home");
  const [panic, setPanic] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [factoryOpen, setFactoryOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [storageOk, setStorageOk] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  const loadedRef = useRef(false);       // ilk setData'da persist'i atla
  const bootEmptyRef = useRef(false);    // açılış okuması başarısızsa kurtarma dene
  const recoverTriedRef = useRef(false);
  const warnShownRef = useRef(false);

  /* Açılış: bekle → güvenli oku → duruma göre davran */
  useEffect(() => {
    (async () => {
      const res = await safeRead();
      if (res.status === "ok") {
        setStorageOk(true);
        setData(withDefaults(res.data));
        return;
      }
      const f = fresh();
      if (res.status === "empty") {
        /* list() anahtarın gerçekten olmadığını doğruladı: ilk kaydı güvenle yaz */
        const ok = await persistRaw(f);
        setStorageOk(ok);
        if (ok) setSavedAt(Date.now());
      } else {
        /* error: depo şüpheli — yazma, ilk değişiklikte önce kurtarmayı dene */
        bootEmptyRef.current = true;
        setStorageOk(false);
      }
      setData(f);
    })();
  }, []);

  /* Her veri değişiminde kalıcı kaydet (kurtarma korumalı) */
  useEffect(() => {
    if (!data) return;
    if (!loadedRef.current) { loadedRef.current = true; return; }
    (async () => {
      if (bootEmptyRef.current && !recoverTriedRef.current) {
        recoverTriedRef.current = true;
        const r = await safeRead();
        if (r.status === "ok" && r.data) {
          bootEmptyRef.current = false;
          setToast("Önceki verilerin bulundu ve geri yüklendi ✓");
          setData(withDefaults(r.data));
          return;
        }
        bootEmptyRef.current = false;
      }
      const ok = await persistRaw(data);
      setStorageOk(ok);
      if (ok) setSavedAt(Date.now());
    })();
  }, [data]);

  /* Depolama yoksa bir kez uyar */
  useEffect(() => {
    if (data && storageOk === false && !warnShownRef.current) {
      warnShownRef.current = true;
      setToast("⚠️ Kalıcı depolama bulunamadı — Ayarlar'dan yedek almayı unutma");
    }
  }, [data, storageOk]);

  /* Saniyelik tik */
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const update = useCallback((patch) => {
    setData((prev) => prev ? { ...prev, ...(typeof patch === "function" ? patch(prev) : patch) } : prev);
  }, []);

  /* Bildirim ve konfeti zamanlayıcıları */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(false), 1700);
    return () => clearTimeout(t);
  }, [celebrate]);

  const curDays = data ? Math.floor((now - data.startDate) / DAY) : 0;

  /* Yeni rozet bildirimi */
  useEffect(() => {
    if (!data) return;
    const maxEver = Math.max(data.bestStreak, (now - data.startDate) / DAY);
    const unlocked = MILESTONES.filter((m) => maxEver >= m.d).length;
    if (unlocked > (data.seenBadges || 0)) {
      const b = MILESTONES[unlocked - 1];
      setToast(`🎉 Yeni rozet: ${b.icon} ${b.name} (+30 XP)`);
      setCelebrate(true);
      update({ seenBadges: unlocked });
    }
  }, [curDays, data, update]);

  /* Dürüst kayıt: sıfırlama */
  const doReset = (payload) => {
    update((prev) => {
      const t = Date.now();
      const dys = (t - prev.startDate) / DAY;
      return {
        startDate: t,
        bestStreak: Math.max(prev.bestStreak, dys),
        totalResets: prev.totalResets + 1,
        streakHistory: [...prev.streakHistory, { start: prev.startDate, end: t, days: dys }],
        resetLog: [{ date: t, streakDays: dys, ...payload }, ...prev.resetLog],
      };
    });
    setResetOpen(false);
    setToast("Sorun değil — düşüş sürecin parçası. Yola devam. 💜");
  };

  /* Dalga atlatıldı */
  const onSurvived = (intensity) => {
    update((p) => ({
      urgesSurvived: p.urgesSurvived + 1,
      urgeLog: [...(p.urgeLog || []), { date: Date.now(), intensity }],
    }));
    setPanic(false);
    setCelebrate(true);
    setToast("Güçlüydün. Bir dalga daha atlatıldı: +20 XP 💪");
  };

  /* Fabrika ayarları */
  const doWipe = async () => {
    await wipeRaw();
    const f = fresh();
    setData(f);
    const ok = await persistRaw(f);
    setStorageOk(ok);
    if (ok) setSavedAt(Date.now());
    setFactoryOpen(false);
    setTab("home");
    setToast("Her şey sıfırlandı. Yeni bir sayfa. 🌅");
  };

  const replaceData = (parsed) => setData(withDefaults(parsed));

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(180deg,#F5F2FF,#FFF7EC)" }}>
        <Flame size={42} className="animate-pulse" style={{ color: "#7C5CE6" }} />
      </div>
    );
  }

  const T = theme(data.theme === "dark");

  /* Üst bardaki rütbe rozeti */
  const xp = calcXP(data, (now - data.startDate) / DAY);
  const { cur } = rankOf(xp);

  const NAV = [
    { id: "home", icon: Home, l: "Bugün" },
    { id: "journal", icon: BookOpen, l: "Günlük" },
    { id: "stats", icon: BarChart3, l: "Analiz" },
    { id: "journey", icon: Award, l: "Yolculuk" },
    { id: "settings", icon: Settings, l: "Ayarlar" },
  ];

  return (
    <div className={`min-h-screen ${T.text}`} style={{ ...T.page, fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity:0; transform: translateY(10px);} to { opacity:1; transform:none;} }
        .fade-up { animation: fadeUp .35s ease both; }
        @keyframes pop { 0% { transform: scale(.92);} 60% { transform: scale(1.03);} 100% { transform: scale(1);} }
        .pop { animation: pop .3s ease both; }
        .confetti { position:absolute; top:-12px; width:8px; height:13px; border-radius:2px; animation-name: confFall; animation-timing-function: linear; animation-fill-mode: forwards; }
        @keyframes confFall { to { transform: translateY(105vh) rotate(540deg); opacity:.95; } }
        button:focus-visible { outline: 2px solid #7C5CE6; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .fade-up, .pop, .confetti { animation: none; } }
      `}</style>

      {/* Üst bar */}
      <header className="mx-auto flex max-w-md items-center justify-between px-4 pt-5">
        <div className="flex items-center gap-2">
          <Flame className="text-amber-500" size={22} />
          <Grad className="text-lg font-extrabold tracking-widest">İRADE</Grad>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${T.chip}`}>{cur.icon} {cur.name}</span>
      </header>

      {/* İçerik */}
      <main className="mx-auto max-w-md px-4 pb-44 pt-5">
        {tab === "home" && (
          <HomeTab d={data} T={T} now={now} update={update} setToast={setToast}
            onResetClick={() => setResetOpen(true)} onCelebrate={() => setCelebrate(true)} />
        )}
        {tab === "journal" && <JournalTab d={data} T={T} update={update} setToast={setToast} />}
        {tab === "stats" && <StatsTab d={data} T={T} now={now} />}
        {tab === "journey" && <JourneyTab d={data} T={T} now={now} />}
        {tab === "settings" && (
          <SettingsTab d={data} T={T} update={update} onFactory={() => setFactoryOpen(true)}
            storageOk={storageOk} savedAt={savedAt} replaceData={replaceData} setToast={setToast} />
        )}
      </main>

      {/* Dürtü anı butonu — her ekrandan erişilebilir */}
      {!panic && (
        <button
          onClick={() => setPanic(true)}
          aria-label="Dürtü anı — dayanma modunu aç"
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full px-5 py-3.5 font-extrabold text-white shadow-2xl transition-transform active:scale-95"
          style={{ background: GRAD_SOS }}
        >
          <LifeBuoy size={20} /> Dürtü Anı
        </button>
      )}

      {/* Alt gezinme */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur" style={T.navStyle}>
        <div className="mx-auto grid max-w-md grid-cols-5">
          {NAV.map((n) => {
            const I = n.icon;
            const on = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)} aria-label={n.l}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs font-semibold ${on ? "text-violet-500" : T.faint}`}>
                <I size={20} /> {n.l}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Katmanlar */}
      {panic && <PanicOverlay reasons={data.reasons} onSurvived={onSurvived} />}
      {resetOpen && <ResetModal T={T} curDays={curDays} onCancel={() => setResetOpen(false)} onConfirm={doReset} />}
      {factoryOpen && <FactoryModal T={T} onCancel={() => setFactoryOpen(false)} onWipe={doWipe} />}
      {celebrate && <Confetti />}

      {/* Bildirim */}
      {toast && (
        <div className="fade-up fixed left-1/2 top-4 z-50 w-11/12 max-w-md -translate-x-1/2 rounded-2xl border border-violet-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
