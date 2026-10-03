import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Tex } from "../lib/tex.jsx";
import { LEVELS } from "../data/topics.js";
import { FORMULAS } from "../data/formulas.js";

const FLOAT = [
  ["e^{i\\pi}+1=0", 4, 8], ["a^2+b^2=c^2", 54, 0], ["\\sin^2x+\\cos^2x=1", 8, 56], ["\\Delta=b^2-4ac", 58, 52],
  ["\\int x^n\\,dx", 30, 104], ["\\dbinom{n}{r}", 74, 98],
];

export default function Onboarding({ initial, onDone }) {
  const [step, setStep] = useState(0);
  const [levels, setLevels] = useState(initial.levels);
  const [goal, setGoal] = useState(initial.newPerDay);
  const [ret, setRet] = useState(initial.retention);
  const count = (lv) => FORMULAS.filter((f) => f.lv === lv).length;
  const toggle = (id) => setLevels((l) => (l.includes(id) ? (l.length > 1 ? l.filter((x) => x !== id) : l) : [...l, id]));

  return (
    <div className="shell onb">
      {step === 0 && (
        <>
          <div className="onb-hero fade-in">
            <div className="onb-logo">Form<sup>up</sup></div>
            <p className="display" style={{ fontSize: 26, margin: 0 }}>Matematik formüllerini bir kez öğren, <span style={{ color: "var(--accent)" }}>kalıcı</span> hatırla.</p>
            <p className="muted" style={{ margin: 0 }}>
              {FORMULAS.length} formül, sınavdaki önemine göre sıralı. Her formül tam unutmak üzereyken karşına çıkar; bildikçe aralıklar uzar.
            </p>
          </div>
          <div className="float-formulas" aria-hidden="true">
            {FLOAT.map(([t, x, y], i) => (
              <span key={i} style={{ left: `${x}%`, top: y, animationDelay: `${i * 0.7}s`, fontSize: 15 + (i % 3) * 3 }}><Tex tex={t} /></span>
            ))}
          </div>
          <div className="card stack-sm">
            {[["1", "Keşfet", "Kartları kaydır: bildiklerini geç, bilmediklerini listene ekle."], ["2", "Öğren", "Kısa derslerde tanı, seç, hatırla, uygula."], ["3", "Tekrarla", "Uygulama doğru günü hesaplar: 1 gün, 3 gün, 1 hafta, 1 ay…"]].map(([n, t, d]) => (
              <div key={n} className="row" style={{ alignItems: "flex-start" }}>
                <span className="tag accent" style={{ minWidth: 24, justifyContent: "center" }}>{n}</span>
                <span><b>{t}.</b> <span className="muted">{d}</span></span>
              </div>
            ))}
          </div>
          <div className="spacer" />
          <button className="btn primary lg block" onClick={() => setStep(1)}>Başlayalım <ArrowRight size={19} /></button>
        </>
      )}

      {step === 1 && (
        <div className="stack fade-in" style={{ flex: 1 }}>
          <div className="eyebrow">1 / 2</div>
          <h1 className="h1">Hangi formüller seni ilgilendiriyor?</h1>
          <div className="stack-sm">
            {LEVELS.map((l) => {
              const on = levels.includes(l.id);
              return (
                <button key={l.id} className={"choice" + (on ? " on" : "")} onClick={() => toggle(l.id)} aria-pressed={on}>
                  <span>
                    <b style={{ fontSize: 16 }}>{l.long}</b> <span className="tag num">{count(l.id)}</span>
                    <div className="small muted">{l.blurb}</div>
                  </span>
                  <span className="tick">{on && <Check size={16} />}</span>
                </button>
              );
            })}
          </div>
          <div className="spacer" />
          <button className="btn primary lg block" onClick={() => setStep(2)}>Devam <ArrowRight size={19} /></button>
        </div>
      )}

      {step === 2 && (
        <div className="stack fade-in" style={{ flex: 1 }}>
          <div className="eyebrow">2 / 2</div>
          <h1 className="h1">Günde kaç yeni formül?</h1>
          <div className="goal-grid">
            {[[3, "Hafif"], [5, "Rahat"], [8, "Dengeli"], [12, "Yoğun"], [20, "Kamp"]].map(([n, l]) => (
              <button key={n} className={goal === n ? "on" : ""} onClick={() => setGoal(n)} aria-pressed={goal === n}><b>{n}</b><span>{l}</span></button>
            ))}
          </div>
          <p className="small muted" style={{ margin: 0 }}>Günde {goal} yeni formülle seçtiğin {FORMULAS.filter((f) => levels.includes(f.lv)).length} formül yaklaşık {Math.ceil(FORMULAS.filter((f) => levels.includes(f.lv)).length / goal)} günde biter. Tekrarlar ayrıca sayılır ve ilk haftalarda günde 10–20 dakika sürer.</p>
          <h2 className="h2" style={{ marginTop: 10 }}>Ne kadar sağlam olsun?</h2>
          <div className="stack-sm">
            {[[0.85, "Rahat", "Daha az tekrar, %85 hatırlama"], [0.9, "Dengeli", "Önerilen, %90 hatırlama"], [0.95, "Sınav modu", "Sınav yaklaşıyorsa, %95 hatırlama"]].map(([v, t, d]) => (
              <button key={v} className={"choice" + (ret === v ? " on" : "")} onClick={() => setRet(v)} aria-pressed={ret === v}>
                <span><b>{t}</b><div className="small muted">{d}</div></span>
                <span className="tick">{ret === v && <Check size={16} />}</span>
              </button>
            ))}
          </div>
          <div className="spacer" />
          <button className="btn primary lg block" onClick={() => onDone({ levels, newPerDay: goal, retention: ret, onboarded: true })}>Formülleri keşfet <ArrowRight size={19} /></button>
        </div>
      )}
    </div>
  );
}
