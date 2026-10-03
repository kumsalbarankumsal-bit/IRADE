import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, Plus, SkipForward, Lightbulb, BookOpen, Sparkles, ChevronDown, PartyPopper, Compass, Undo2 } from "lucide-react";
import { Formula, Field, Rich } from "../lib/tex.jsx";
import { discoverList, mcOptions } from "../lib/srs.js";
import { TOPICS, TOPIC, LEVELS } from "../data/topics.js";
import { Prio } from "./common.jsx";
import { play } from "../lib/sound.js";
import { vibrate, rng } from "../lib/util.js";

export default function Discover({ state, now, onLearn, onKnown, onKnownFail, onSkip, startLearn, toast }) {
  const [topic, setTopic] = useState(null);
  const list = useMemo(() => discoverList(state, topic), [state.cards, state.queue, state.skipped, state.settings.levels, state.custom, topic]); // eslint-disable-line
  const [check, setCheck] = useState(null); // biliyorum doğrulaması: { id, opts, picked }
  const [fly, setFly] = useState(null); // "left" | "right"
  const [drag, setDrag] = useState(0);
  const start = useRef(null);
  const top = list[0];
  const batch = state.settings.batch;
  const q = state.queue.length;

  const topics = TOPICS.filter((t) => state.settings.levels.includes(t.lv) || (t.id === "ozel" && state.custom.length));

  const act = (dir) => {
    if (!top || fly || check) return;
    if (dir === "right") {
      setFly("right");
      play("tick", state.settings.sound);
      setTimeout(() => { onLearn(top.id); setFly(null); setDrag(0); }, 220);
    } else {
      // Biliyorum → kanıtla
      setDrag(0);
      setCheck({ id: top.id, opts: mcOptions(state, top, rng(Date.now())), picked: null });
    }
  };
  const pickCheck = (i) => {
    if (!check || check.picked != null) return;
    const ok = check.opts[i].ok;
    setCheck({ ...check, picked: i });
    play(ok ? "correct" : "wrong", state.settings.sound);
    vibrate(ok ? 12 : [30, 40, 30], state.settings.haptics);
    setTimeout(() => {
      setFly("left");
      setTimeout(() => {
        if (ok) onKnown(check.id); else onKnownFail(check.id);
        setCheck(null); setFly(null);
      }, 220);
    }, ok ? 650 : 1500);
  };

  // klavye: ← biliyorum, → öğren, ↓ atla, 1-4 kanıtla
  useEffect(() => {
    const k = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (check) { const n = Number(e.key); if (n >= 1 && n <= 4) pickCheck(n - 1); return; }
      if (e.key === "ArrowRight") act("right");
      else if (e.key === "ArrowLeft") act("left");
      else if (e.key === "ArrowDown" && top) onSkip(top.id);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const onDown = (e) => { if (check || fly) return; start.current = { x: e.clientX, y: e.clientY, id: e.pointerId }; };
  const onMove = (e) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    if (Math.abs(dx) > 6) { try { e.currentTarget.setPointerCapture(start.current.id); } catch (err) { /* yoksay */ } }
    setDrag(dx);
  };
  const onUp = () => {
    if (!start.current) return;
    start.current = null;
    if (drag > 110) act("right");
    else if (drag < -110) act("left");
    else setDrag(0);
  };

  const tx = fly === "right" ? 600 : fly === "left" ? -600 : drag;
  const rot = tx / 22;

  return (
    <div className="stack fade-in" style={{ gap: 10 }}>
      <div className="row between" style={{ alignItems: "flex-end" }}>
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow">{list.length} formül · önem sırasıyla</div>
          <h1 className="h1" style={{ fontSize: 28 }}>Keşfet</h1>
        </div>
        <button className={"qbtn" + (q >= batch ? " pulse" : "")} onClick={startLearn} disabled={!q} aria-label={`Öğrenme listesi: ${q} formül. Derse başla`}>
          <span className="slots" aria-hidden="true">
            {Array.from({ length: Math.min(batch, 6) }, (_, i) => <i key={i} className={i < q ? "on" : ""} style={{ width: 8, height: 18, borderRadius: 3 }} />)}
          </span>
          <span className="go"><Sparkles size={15} /> {q > batch ? `${q}` : "Öğren"}</span>
        </button>
      </div>

      <div className="chip-scroll" role="tablist" aria-label="Konu filtresi">
        <button className={"chip" + (!topic ? " on" : "")} onClick={() => setTopic(null)}>Önem sırasıyla</button>
        {topics.map((t) => (
          <button key={t.id} className={"chip" + (topic === t.id ? " on" : "")} onClick={() => setTopic(t.id)}>{t.name}</button>
        ))}
      </div>

      {!top ? (
        <div className="card empty">
          <PartyPopper size={44} style={{ color: "var(--accent)" }} />
          <div className="h2">Bu bölümdeki her formülü gördün</div>
          <p className="muted small" style={{ margin: 0, maxWidth: 320 }}>Profil → Ayarlar’dan yeni seviyeler (ör. Üniversite) ekleyebilir ya da kendi formüllerini yazabilirsin.</p>
          {q > 0 && <button className="btn primary" onClick={startLearn}><Sparkles size={18} /> Listedekileri öğren ({q})</button>}
        </div>
      ) : (
        <div className="deck">
          {list[2] && <div className="index-card behind2" aria-hidden="true" />}
          {list[1] && <div className="index-card behind" aria-hidden="true"><CardFace f={list[1]} dim /></div>}
          <div
            className="index-card"
            key={top.id}
            style={{ transform: `translateX(${tx}px) rotate(${rot}deg)`, transition: start.current ? "none" : "transform .25s cubic-bezier(.2,.8,.2,1)" }}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          >
            <span className="stamp learn" style={{ opacity: Math.max(0, Math.min(1, drag / 110)) }}>Öğren</span>
            <span className="stamp know" style={{ opacity: Math.max(0, Math.min(1, -drag / 110)) }}>Biliyorum</span>
            <CardFace f={top} />
            {check ? (
              <div className="card-foot" style={{ gridTemplateColumns: "1fr", gap: 8 }}>
                <div className="small" style={{ fontWeight: 750, textAlign: "center" }}>Kanıtla: hangisi doğru?</div>
                {check.opts.map((o, i) => {
                  const cls = check.picked == null ? "" : o.ok ? " right" : i === check.picked ? " wrong" : " dim";
                  return (
                    <button key={i} className={"opt" + cls} style={{ minHeight: 48, padding: "8px 12px" }} onClick={() => pickCheck(i)} disabled={check.picked != null}>
                      <span className="k">{i + 1}</span><span className="o"><Field v={o.v} /></span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="card-foot">
                <button className="btn outline lg" onClick={() => act("left")}><Check size={19} /> Biliyorum</button>
                <button className="btn primary lg" onClick={() => act("right")}><Plus size={19} /> Öğren</button>
              </div>
            )}
          </div>
        </div>
      )}

      {top && !check && (
        <div className="row" style={{ justifyContent: "center", gap: 4 }}>
          <button className="btn ghost sm" onClick={() => onSkip(top.id)}><SkipForward size={16} /> Şimdilik geç</button>
          <span className="tiny faint">· kaydır: ← biliyorum, öğren →</span>
        </div>
      )}

    </div>
  );
}

function CardFace({ f, dim }) {
  const t = TOPIC[f.t] || TOPIC.ozel;
  const lv = LEVELS.find((l) => l.id === f.lv);
  return (
    <>
      <div className="card-head">
        <span className="row" style={{ gap: 6 }}>
          <span className="tag accent">#{f.rank || "★"}</span>
          {lv && <span className="tag">{lv.name}</span>}
        </span>
        {f.p ? <Prio p={f.p} /> : <span className="tag">Kendi formülün</span>}
      </div>
      <div className="card-body" style={dim ? { opacity: 0.6 } : undefined}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>{t.name}</div>
          <div className="card-name"><Rich text={f.n} /></div>
        </div>
        <div className="formula-box"><Formula f={f} size="auto" /></div>
        {f.k && <div className="kv"><BookOpen size={16} /><Rich text={f.k} /></div>}
        {f.w && <div className="kv"><Lightbulb size={16} /><Rich text={f.w} /></div>}
        {f.e && <div className="kv"><Compass size={16} /><span><Rich text={f.e} /></span></div>}
        {f.h && <div><span className="note"><Rich text={f.h} /></span></div>}
      </div>
    </>
  );
}
