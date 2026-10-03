/* İlk açılış: Pi kendini tanıtır, seviye ve günlük hedef seçilir, ilk ders hemen başlar */
import React, { useState } from "react";
import { ArrowRight, Check, Sparkles, Brain, Rocket, Languages } from "lucide-react";
import Pi from "./Pi.jsx";
import { Bi, Switch, sparkleAt } from "./common.jsx";
import { Tex } from "../lib/tex.jsx";
import { play } from "../lib/sound.js";

const LEVELS = [
  { id: "zero", tr: "Sıfırdan başla", en: "Start from zero", dtr: "Bölünebilme kuralları, kesirler, üsler… Hepsini en baştan, adım adım.", glyph: "1, 2, 3" },
  { id: "some", tr: "Biraz biliyorum", en: "I know a bit", dtr: "Temelden başla; bildiğin üniteleri kısa bir sınavla atla.", glyph: "\\tfrac{a}{b}" },
  { id: "good", tr: "Temelim sağlam", en: "My basics are solid", dtr: "Doğrudan IB AA SL kitapçığına geç. Temel üniteler açık kalır.", glyph: "\\int" },
];
const GOALS = [[20, "5 dk", "Rahat"], [40, "10 dk", "Normal"], [60, "15 dk", "Ciddi"], [100, "25 dk", "Çılgın"]];

export default function Onboarding({ state, onDone }) {
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState("zero");
  const [goal, setGoal] = useState(40);
  const [showEn, setShowEn] = useState(true);
  const [lit, setLit] = useState(0);
  const sound = state.settings.sound;
  const go = (n) => { play("tap", sound); setStep(n); };
  const finish = () => onDone({ start: level, goal, showEn, onboarded: true });

  return (
    <div className="onb">
      <div className="onb-dots" aria-hidden="true">{[0, 1, 2, 3].map((i) => <span key={i} className={i === step ? "on" : i < step ? "past" : ""} />)}</div>

      {step === 0 && (
        <div className="stack onb-step fade-in">
          <div className="onb-hero">
            <Pi mood="party" outfit="none" size={150} />
          </div>
          <div className="stack-sm" style={{ textAlign: "center" }}>
            <div className="hand" style={{ color: "var(--gold)", fontSize: 30 }}>Selam! Ben Pi.</div>
            <h1 className="display" style={{ fontSize: 30, margin: 0 }}>Matematiği sevmek zorunda değilsin.</h1>
            <div className="en">You don't have to love math.</div>
            <p className="muted" style={{ margin: "6px 0 0" }}>
              Sadece formülleri <b>tam unutacağın anda</b> sana geri getireceğim. Günde birkaç dakika, bir oyun gibi.
              Hiçbir şey bildiğini varsaymıyorum. <span className="en">I'll bring each formula back right before you forget it.</span>
            </p>
          </div>
          <button className="btn gold lg block" onClick={() => go(1)}>Başlayalım · Let's go <ArrowRight size={18} /></button>
        </div>
      )}

      {step === 1 && (
        <div className="stack onb-step fade-in">
          <div className="pi-row"><Pi mood="think" outfit="none" size={70} /><div className="speech"><Bi tr="Matematikle aran nasıl? Dürüst ol, kimse bakmıyor." en="How are you with math? Be honest, nobody's watching." /></div></div>
          <div className="stack-sm">
            {LEVELS.map((l) => (
              <button key={l.id} className={"choice" + (level === l.id ? " on" : "")} onClick={() => { setLevel(l.id); play("tap", sound); }} aria-pressed={level === l.id}>
                <span className="choice-glyph"><Tex tex={l.glyph} /></span>
                <span className="stack-sm" style={{ gap: 2 }}>
                  <b>{l.tr}</b><span className="en small">{l.en}</span>
                  <span className="small muted">{l.dtr}</span>
                </span>
                <span className="tick">{level === l.id && <Check size={16} strokeWidth={3} />}</span>
              </button>
            ))}
          </div>
          <button className="btn gold lg block" onClick={() => go(2)}>Devam · Next <ArrowRight size={18} /></button>
        </div>
      )}

      {step === 2 && (
        <div className="stack onb-step fade-in">
          <div className="pi-row"><Pi mood="happy" outfit="none" size={70} /><div className="speech"><Bi tr="Günde ne kadar? Az ama her gün, çok ama ara sıradan iyidir." en="How much a day? A little every day beats a lot once in a while." /></div></div>
          <div className="goal-grid">
            {GOALS.map(([g, min, tr]) => (
              <button key={g} className={goal === g ? "on" : ""} onClick={() => { setGoal(g); play("tap", sound); }} aria-pressed={goal === g}>
                <b>{min}</b><span>{tr}</span><span className="num" style={{ fontSize: 10 }}>{g} XP</span>
              </button>
            ))}
          </div>
          <div className="panel tight row" style={{ gap: 12 }}>
            <span className="gi-sm" style={{ background: "var(--violet-soft)", color: "var(--violet)" }}><Languages size={20} /></span>
            <span className="grow"><b className="small">İngilizce satırlar</b><div className="tiny muted">IB sınavı İngilizce: her formülün İngilizcesini altta küçükçe göreceksin. <span className="en">English lines under everything.</span></div></span>
            <Switch on={showEn} onChange={setShowEn} label="İngilizce satırlar" />
          </div>
          <button className="btn gold lg block" onClick={() => go(3)}>Devam · Next <ArrowRight size={18} /></button>
        </div>
      )}

      {step === 3 && (
        <div className="stack onb-step fade-in">
          <Bi tr="Nasıl çalışıyor?" en="How it works" className="h1" />
          <div className="how">
            <div className="how-item">
              <span className="gi-sm" style={{ background: "var(--sky-soft)", color: "var(--sky)" }}><Rocket size={20} /></span>
              <span><b>Yolda ilerle</b> <span className="en tiny">Follow the path</span><div className="small muted">Her ders 3–4 formül. Önce tanış, sonra oyunlarla oturt.</div></span>
            </div>
            <div className="how-item">
              <span className="gi-sm" style={{ background: "var(--gold-soft)", color: "var(--gold)" }}><Sparkles size={20} /></span>
              <span><b>Her formül bir yıldız</b> <span className="en tiny">Every formula is a star</span><div className="small muted">Öğrendikçe gökyüzün dolar. Tekrar etmezsen yıldız söner.</div></span>
            </div>
            <div className="how-item">
              <span className="gi-sm" style={{ background: "var(--mint-soft)", color: "var(--mint)" }}><Brain size={20} /></span>
              <span><b>Tam zamanında tekrar</b> <span className="en tiny">Spaced repetition</span><div className="small muted">Pi, beynin unutmaya başladığı anı hesaplar; tekrar aralığı her seferinde uzar.</div></span>
            </div>
          </div>
          <div className="panel tight" style={{ textAlign: "center" }}>
            <div className="small muted" style={{ marginBottom: 6 }}>Dene: yıldıza dokun · tap the star</div>
            <button className="demo-star" aria-label="Yıldızı yak"
              onClick={(e) => { setLit((x) => Math.min(3, x + 1)); play("correct", sound); sparkleAt(e.clientX, e.clientY, 14); }}>
              <svg viewBox="0 0 100 100" width="96" height="96">
                <path d="M50 8 L61 39 L94 50 L61 61 L50 94 L39 61 L6 50 L39 39 Z" fill={lit ? "var(--gold)" : "none"} stroke={lit ? "var(--gold)" : "var(--star-off)"} strokeWidth="3" style={{ filter: lit ? `drop-shadow(0 0 ${6 + lit * 6}px var(--gold))` : "none", transition: "all .4s" }} />
              </svg>
            </button>
            <div className="hand" style={{ color: "var(--gold)", minHeight: 28 }}>{["", "Yandı!", "Parlıyor!", "Kalıcı oldu!"][lit]}</div>
          </div>
          <button className="btn gold lg block" onClick={finish}><Rocket size={18} /> İlk dersime başla · Start</button>
        </div>
      )}
    </div>
  );
}
