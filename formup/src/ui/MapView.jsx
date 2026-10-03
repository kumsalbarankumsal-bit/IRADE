import React, { useMemo, useState } from "react";
import { Search, ChevronDown, ChevronRight, ClipboardCheck, Plus } from "lucide-react";
import { Tex, Rich, plain } from "../lib/tex.jsx";
import { TOPICS, LEVELS } from "../data/topics.js";
import { allFormulas, memLevel, currentR } from "../lib/srs.js";
import { fold } from "../lib/util.js";
import { LevelBar, lvColor, lvInk, Bar } from "./common.jsx";

export default function MapView({ state, now, openDetail, startTopicTest, openEditor }) {
  const [lv, setLv] = useState(state.settings.levels[0] || "tyt");
  const [qs, setQs] = useState("");
  const [open, setOpen] = useState({});
  const all = allFormulas(state);

  const counts = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0];
    for (const f of all) if (f.lv === lv || (lv === "custom" && f.t === "ozel")) c[memLevel(state.cards[f.id])]++;
    return c;
  }, [all, lv, state.cards]);

  const q = fold(qs.trim());
  const matches = q ? all.filter((f) => fold(f.n + " " + (f.k || "") + " " + (f.w || "")).includes(q) || f.l.toLowerCase().includes(qs.trim().toLowerCase())) : null;
  const levels = [...LEVELS, { id: "custom", name: "Benim" }];
  const topics = TOPICS.filter((t) => t.lv === lv);

  return (
    <div className="stack fade-in">
      <div>
        <div className="eyebrow">Hafıza haritası</div>
        <h1 className="h2">Her kare bir formül; koyulaştıkça kalıcı</h1>
      </div>
      <label className="search">
        <Search size={18} className="faint" />
        <input value={qs} onChange={(e) => setQs(e.target.value)} placeholder="Formül ara: kosinüs, Heron, türev…" aria-label="Formül ara" />
      </label>

      {matches ? (
        <div className="card topic">
          <div style={{ padding: "14px 16px 8px" }} className="h3">{matches.length} sonuç</div>
          <Tiles list={matches.slice(0, 120)} state={state} now={now} openDetail={openDetail} />
        </div>
      ) : (
        <>
          <div className="seg" role="tablist">
            {levels.map((l) => (
              <button key={l.id} role="tab" aria-selected={lv === l.id} className={lv === l.id ? "on" : ""} onClick={() => setLv(l.id)}>{l.name}</button>
            ))}
          </div>
          <div className="card"><LevelBar counts={counts} /></div>
          {lv === "custom" ? (
            <div className="card topic">
              <div className="topic-head" style={{ cursor: "default" }}>
                <span className="glyph"><Tex tex="\star" /></span>
                <span><span className="h3">Kendi formüllerim</span><div className="tiny faint">Öğretmeninin özel formülleri, kendi notların…</div></span>
                <button className="btn soft sm" onClick={openEditor}><Plus size={16} /> Ekle</button>
              </div>
              {state.custom.length ? <Tiles list={state.custom} state={state} now={now} openDetail={openDetail} /> : <p className="small muted" style={{ padding: "0 16px 16px", margin: 0 }}>Henüz eklemedin. LaTeX ile yaz, önizlemeyi gör, aynı tekrar sistemine girsin.</p>}
            </div>
          ) : topics.map((t) => {
            const fs = all.filter((f) => f.t === t.id);
            const learned = fs.filter((f) => state.cards[f.id] && state.cards[f.id].reps).length;
            const isOpen = open[t.id] ?? false;
            return (
              <div className="card topic" key={t.id}>
                <button className="topic-head" onClick={() => setOpen({ ...open, [t.id]: !isOpen })} aria-expanded={isOpen}>
                  <span className="glyph"><Tex tex={t.glyph} /></span>
                  <span className="stack-sm" style={{ gap: 6, minWidth: 0 }}>
                    <span className="h3">{t.name}</span>
                    <span className="row" style={{ gap: 8 }}>
                      <span className="grow"><Bar pct={learned / fs.length} /></span>
                      <span className="tiny faint num" style={{ fontWeight: 750 }}>{learned}/{fs.length}</span>
                    </span>
                  </span>
                  {isOpen ? <ChevronDown size={20} className="faint" /> : <ChevronRight size={20} className="faint" />}
                </button>
                {isOpen && (
                  <>
                    <Tiles list={fs} state={state} now={now} openDetail={openDetail} />
                    <div style={{ padding: "0 14px 14px" }}>
                      <button className="btn soft sm block" onClick={() => startTopicTest(t.id)}><ClipboardCheck size={16} /> Konu testi (10 soru)</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function Tiles({ list, state, now, openDetail }) {
  return (
    <div className="tiles">
      {list.map((f) => {
        const p = state.cards[f.id];
        const lv = memLevel(p);
        const R = currentR(p, now);
        const queued = state.queue.includes(f.id);
        return (
          <button key={f.id} className="tile" onClick={() => openDetail(f.id)}
            style={{ background: lvColor(lv), color: lvInk(lv), outline: queued ? "2px dashed var(--accent)" : "none", outlineOffset: -3 }}
            aria-label={`${plain(f.n)}, ${["yeni", "ısınıyor", "pekişiyor", "oturuyor", "kalıcı", "usta"][lv]}`}>
            <span className="t"><Rich text={f.n} /></span>
            <span className="r">{R == null ? (queued ? "listede" : p && p.k ? "biliyor" : "") : `%${Math.round(R * 100)}`}</span>
          </button>
        );
      })}
    </div>
  );
}
