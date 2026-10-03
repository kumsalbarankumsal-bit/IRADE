/* Pi — FormUp’ın maskotu. π harfinden doğmuş küçük bir yaratık:
   üst çizgi başı, iki bacak gövdesi. Ruh hâli ve aksesuarları değişir. */
import React from "react";

export const OUTFITS = [
  { id: "none", tr: "Sade", en: "Plain", price: 0 },
  { id: "scarf", tr: "Atkı", en: "Scarf", price: 40 },
  { id: "glasses", tr: "Gözlük", en: "Glasses", price: 60 },
  { id: "party", tr: "Parti şapkası", en: "Party hat", price: 80 },
  { id: "headphones", tr: "Kulaklık", en: "Headphones", price: 120 },
  { id: "cap", tr: "Mezuniyet kepi", en: "Graduation cap", price: 200 },
  { id: "helmet", tr: "Astronot kaskı", en: "Space helmet", price: 300 },
  { id: "crown", tr: "Taç", en: "Crown", price: 500 },
];

function Eyes({ mood }) {
  if (mood === "happy" || mood === "party") {
    return (
      <g fill="none" stroke="var(--pi-ink)" strokeWidth="3.4" strokeLinecap="round">
        <path d="M43 33 q5 -6 10 0" /><path d="M67 33 q5 -6 10 0" />
      </g>
    );
  }
  if (mood === "sleep") {
    return (
      <g fill="none" stroke="var(--pi-ink)" strokeWidth="3.2" strokeLinecap="round">
        <path d="M43 31 q5 4 10 0" /><path d="M67 31 q5 4 10 0" />
      </g>
    );
  }
  const look = mood === "think" ? -2.2 : 0;
  const sad = mood === "sad";
  return (
    <g className="pi-blink">
      <ellipse cx="48" cy="31" rx="6.2" ry={sad ? 5.4 : 6.6} fill="#fff" />
      <ellipse cx="72" cy="31" rx="6.2" ry={sad ? 5.4 : 6.6} fill="#fff" />
      <circle cx={49 + (mood === "think" ? 1 : 0)} cy={32 + look} r="3.4" fill="var(--pi-ink)" />
      <circle cx={73 + (mood === "think" ? 1 : 0)} cy={32 + look} r="3.4" fill="var(--pi-ink)" />
      <circle cx={50.3} cy={30.4 + look} r="1.1" fill="#fff" />
      <circle cx={74.3} cy={30.4 + look} r="1.1" fill="#fff" />
      {sad && <g stroke="var(--pi-ink)" strokeWidth="2.4" strokeLinecap="round"><path d="M41 25 l9 -4" /><path d="M79 25 l-9 -4" /></g>}
    </g>
  );
}

function Mouth({ mood }) {
  if (mood === "sad") return <path d="M55 42 q5 -4 10 0" fill="none" stroke="var(--pi-ink)" strokeWidth="2.6" strokeLinecap="round" />;
  if (mood === "think") return <circle cx="60" cy="41.5" r="2.4" fill="var(--pi-ink)" />;
  if (mood === "sleep") return <path d="M56 41 q4 2 8 0" fill="none" stroke="var(--pi-ink)" strokeWidth="2.4" strokeLinecap="round" />;
  if (mood === "happy" || mood === "party") return <path d="M53 38.5 q7 8 14 0 z" fill="var(--pi-ink)" stroke="var(--pi-ink)" strokeWidth="1.5" strokeLinejoin="round" />;
  return <path d="M54.5 39.5 q5.5 5 11 0" fill="none" stroke="var(--pi-ink)" strokeWidth="2.6" strokeLinecap="round" />;
}

function Outfit({ id }) {
  switch (id) {
    case "scarf":
      return (
        <g>
          <path d="M30 50 q30 9 60 0 l-2 8 q-28 8 -56 0 z" fill="var(--coral)" />
          <path d="M76 54 l7 20 l-9 -2 z" fill="var(--coral)" />
        </g>
      );
    case "glasses":
      return (
        <g fill="none" stroke="var(--pi-ink)" strokeWidth="2.6">
          <circle cx="48" cy="31" r="9" /><circle cx="72" cy="31" r="9" /><path d="M57 31 h6" />
        </g>
      );
    case "party":
      return (
        <g>
          <path d="M60 -14 L46 15 L74 15 Z" fill="var(--violet)" />
          <path d="M53 1 l14 0 M50 8 l20 0" stroke="var(--gold)" strokeWidth="3" />
          <circle cx="60" cy="-15" r="4.5" fill="var(--coral)" />
        </g>
      );
    case "headphones":
      return (
        <g>
          <path d="M24 30 q36 -46 72 0" fill="none" stroke="var(--ink-2)" strokeWidth="5" strokeLinecap="round" />
          <rect x="16" y="24" width="12" height="20" rx="5" fill="var(--sky)" />
          <rect x="92" y="24" width="12" height="20" rx="5" fill="var(--sky)" />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d="M28 6 L60 -6 L92 6 L60 18 Z" fill="var(--pi-ink)" />
          <rect x="49" y="10" width="22" height="8" rx="2" fill="var(--pi-ink)" />
          <path d="M60 6 L86 12 L86 26" fill="none" stroke="var(--gold)" strokeWidth="2.4" />
          <circle cx="86" cy="28" r="3" fill="var(--gold)" />
        </g>
      );
    case "helmet":
      return (
        <g>
          <circle cx="60" cy="34" r="50" fill="var(--sky)" fillOpacity="0.13" stroke="var(--sky)" strokeWidth="3" />
          <path d="M28 12 q12 -18 34 -20" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />
          <circle cx="60" cy="-18" r="4" fill="var(--coral)" />
        </g>
      );
    case "crown":
      return (
        <g>
          <path d="M38 14 L42 -4 L52 8 L60 -8 L68 8 L78 -4 L82 14 Z" fill="var(--gold)" stroke="var(--gold-2)" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="60" cy="6" r="3" fill="var(--coral)" /><circle cx="47" cy="10" r="2.2" fill="var(--sky)" /><circle cx="73" cy="10" r="2.2" fill="var(--mint)" />
        </g>
      );
    default:
      return null;
  }
}

/**
 * <Pi mood="idle|happy|sad|think|sleep|party" outfit="none|…" size={88} />
 */
export default function Pi({ mood = "idle", outfit = "none", size = 88, title = "Pi" }) {
  const anim = mood === "happy" ? "happy" : mood === "party" ? "party" : mood === "sad" ? "sad" : "idle";
  const crownBody = outfit === "crown";
  return (
    <svg className={`pi ${anim}`} width={size} height={size} viewBox="0 -22 120 136" role="img" aria-label={title}
      style={{ "--pi-ink": "#1B1440", "--pi-body": crownBody ? "var(--violet)" : "var(--gold)", "--pi-edge": crownBody ? "color-mix(in srgb, var(--violet) 70%, #000)" : "var(--gold-2)" }}>
      <ellipse cx="60" cy="108" rx="34" ry="5" fill="var(--ink)" opacity="0.12" />
      <g className="pi-body">
        {/* bacaklar */}
        <path d="M42 44 C42 66 41 86 28 101" fill="none" stroke="var(--pi-edge)" strokeWidth="17" strokeLinecap="round" />
        <path d="M42 44 C42 66 41 86 28 101" fill="none" stroke="var(--pi-body)" strokeWidth="12.5" strokeLinecap="round" />
        <path d="M80 44 L80 92 C80 101 87 103 95 98" fill="none" stroke="var(--pi-edge)" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M80 44 L80 92 C80 101 87 103 95 98" fill="none" stroke="var(--pi-body)" strokeWidth="12.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* baş (π’nin üst çizgisi) */}
        <path d="M12 38 C12 24 20 15 34 15 L94 15 C104 15 110 21 110 30 C110 40 104 47 94 47 L30 47 C24 47 20 44 18 40" fill="var(--pi-body)" stroke="var(--pi-edge)" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M30 20 L90 20" stroke="#fff" strokeOpacity="0.35" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="37" cy="39" rx="5" ry="3" fill="var(--coral)" opacity="0.45" />
        <ellipse cx="83" cy="39" rx="5" ry="3" fill="var(--coral)" opacity="0.45" />
        <Eyes mood={mood} />
        <Mouth mood={mood} />
        <Outfit id={outfit} />
        {mood === "sleep" && <text x="96" y="6" fontSize="16" fontWeight="800" fill="var(--sky)" fontFamily="var(--f-display)">z</text>}
        {mood === "party" && <g fill="var(--gold)"><circle cx="8" cy="0" r="2.5" /><circle cx="112" cy="-6" r="2" /><circle cx="104" cy="60" r="2.5" /><circle cx="14" cy="70" r="2" /></g>}
      </g>
    </svg>
  );
}

/* Pi’nin söyleyecekleri — duruma göre seçilir */
export function piLine(ctx) {
  const { due, streak, goalDone, firstTime, hour, lessonsDone, risk } = ctx;
  if (firstTime) return { tr: "Selam! Ben Pi. Matematiği birlikte sevdireceğiz, söz. İlk dersin 3 dakika!", en: "Hi! I'm Pi. Let's make math fun together. Your first lesson takes 3 minutes!", mood: "happy" };
  if (risk) return { tr: `${streak} günlük serin tehlikede! Bugün tek bir ders yeter.`, en: `Your ${streak}-day streak is at risk! One lesson today is enough.`, mood: "sad" };
  if (due >= 8) return { tr: `${due} yıldızın sönmek üzere! Birkaç dakikada parlatalım mı?`, en: `${due} of your stars are fading! Shall we polish them in a few minutes?`, mood: "think" };
  if (due > 0) return { tr: `${due} formül seni özledi. Hızlıca bir tekrar?`, en: `${due} formulas miss you. Quick review?`, mood: "idle" };
  if (goalDone) return { tr: "Bugünkü hedefi bitirdin. Seninle gurur duyuyorum!", en: "You hit today's goal. I'm proud of you!", mood: "party" };
  if (hour >= 23 || hour < 5) return { tr: "Geç oldu… Kısa bir ders, sonra uyku. Uyku hafızayı pekiştirir!", en: "It's late… one short lesson, then sleep. Sleep locks in memory!", mood: "sleep" };
  if (lessonsDone === 0) return { tr: "Hazır mısın? İlk yıldızını yakalım!", en: "Ready? Let's light up your first star!", mood: "happy" };
  const tips = [
    { tr: "Biliyor musun? Formülü hatırlamaya çalışmak, tekrar okumaktan çok daha etkili.", en: "Did you know? Trying to recall beats re-reading by a mile." },
    { tr: "Az ama her gün. Beyin sıkça görülen şeyi önemli sayar.", en: "Little and often. Your brain keeps what it sees regularly." },
    { tr: "Yanlış yapmak öğrenmenin parçası. Her hata bir ipucu!", en: "Mistakes are part of learning. Each one is a clue!" },
    { tr: "IB sınavında kitapçık var ama hangi formülü seçeceğini bilmek senin süper gücün.", en: "The IB gives you the booklet, but knowing which formula to pick is your superpower." },
  ];
  return { ...tips[(hour + lessonsDone) % tips.length], mood: "idle" };
}
