/* Kitapçık: IB AA SL formül kitapçığının iki dilli, açıklamalı hâli + kitapçık dışı formüller + temel + sözlük */
import React, { useMemo, useState } from "react";
import { Search, Star, BookOpen, Languages, ChevronRight } from "lucide-react";
import { Bi, EnCtx } from "./common.jsx";
import Pi from "./Pi.jsx";
import { Rich, Formula } from "../lib/tex.jsx";
import { CARDS, BY_ID, GLOSSARY, PATH, memLevel } from "../lib/learn.js";
import { fold } from "../lib/util.js";

const TOPICS = {
  1: ["Konu 1 · Sayı ve Cebir", "Topic 1: Number and algebra"],
  2: ["Konu 2 · Fonksiyonlar", "Topic 2: Functions"],
  3: ["Konu 3 · Geometri ve Trigonometri", "Topic 3: Geometry and trigonometry"],
  4: ["Konu 4 · İstatistik ve Olasılık", "Topic 4: Statistics and probability"],
  5: ["Konu 5 · Kalkülüs", "Topic 5: Calculus"],
};

function Row({ c, state, openCard, showSec = true }) {
  const lv = memLevel(state.cards[c.id]);
  return (
    <button className="bk-row" onClick={() => openCard(c.id)}>
      {showSec ? <span className="bk-sec">{c.bk === "0.0" ? "ön" : c.bk || "•"}</span> : <span className="bk-sec" style={{ background: "var(--surface-2)", color: "var(--ink-3)" }}>{c.rank}</span>}
      <span className="stack-sm" style={{ gap: 2, minWidth: 0 }}>
        <Bi tr={c.n} en={c.ne} className="small" trClass="h3" />
        <span className="formula-box" style={{ textAlign: "left", padding: "2px 0" }}><Formula f={c} size="sm" /></span>
      </span>
      <Star size={16} fill={lv ? "currentColor" : "none"} style={{ color: lv ? "var(--gold)" : "var(--ink-3)", opacity: lv ? 1 : 0.5 }} aria-label={lv ? "öğrenildi" : "henüz değil"} />
    </button>
  );
}

export default function Booklet({ state, openCard }) {
  const [tab, setTab] = useState("kitap");
  const [q, setQ] = useState("");
  const showEn = React.useContext(EnCtx);
  const fq = fold(q.trim());
  const match = (c) => !fq || fold(`${c.n} ${c.ne} ${c.bk || ""} ${(c.t || []).map((t) => t.join(" ")).join(" ")}`).includes(fq);

  const count = tab === "sozluk"
    ? GLOSSARY.filter((g) => !fq || fold(g.en + " " + g.tr).includes(fq)).length
    : CARDS.filter((c) => c.track === tab && match(c)).length;
  const empty = count === 0;
  const booklet = useMemo(() => {
    const groups = {};
    for (const c of CARDS.filter((x) => x.track === "kitap")) {
      const topic = c.bk === "0.0" ? 3 : Number(String(c.bk || "0").split(".")[0]) || Number(c.u.slice(1));
      (groups[topic] = groups[topic] || []).push(c);
    }
    return groups;
  }, []);

  return (
    <div className="stack fade-in">
      <div>
        <div className="eyebrow">Kitapçık · <span lang="en" className="en" style={{ textTransform: "none", letterSpacing: 0 }}>Formula booklet</span></div>
        <Bi tr="IB AA SL kitapçığı, Türkçe açıklamalı" en="The IB AA SL booklet, explained in Turkish" className="h1" />
      </div>
      <div className="seg" role="tablist">
        {[["kitap", "Kitapçık", "Booklet"], ["ib", "Ezber", "Not in booklet"], ["temel", "Temel", "Basics"], ["sozluk", "Sözlük", "Glossary"]].map(([id, tr, en]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
            {tr}{showEn && <span lang="en" className="en" style={{ display: "block", fontSize: 10 }}>{en}</span>}
          </button>
        ))}
      </div>
      <label className="search">
        <Search size={18} className="faint" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tab === "sozluk" ? "Terim ara · search a term" : "Ara: türev, sine rule, 1.7…"} aria-label="Ara" />
      </label>

      {tab === "ib" && !fq && (
        <p className="small muted" style={{ margin: 0 }}>Bu formüller sınavda kitapçıkta <b>yok</b>: ezberlemen gerekiyor. <span lang="en" className="en">These are not in the exam booklet, so you must know them by heart.</span></p>
      )}
      {empty && (
        <div className="empty">
          <Pi mood="think" outfit={state.settings.outfit} size={72} />
          <Bi tr={fq ? "Bulamadım. Başka bir kelime dene." : "Bu bölüm henüz boş."} en={fq ? "No match. Try another word." : "Nothing here yet."} className="small" />
        </div>
      )}
      {tab === "kitap" && Object.keys(TOPICS).map((k) => {
        const list = (booklet[k] || []).filter(match);
        if (!list.length) return null;
        const prior = list.filter((c) => c.bk === "0.0");
        const main = list.filter((c) => c.bk !== "0.0");
        return (
          <div key={k} className="panel" style={{ paddingBlock: 12 }}>
            <Bi tr={TOPICS[k][0]} en={TOPICS[k][1]} className="h2" />
            {prior.length > 0 && (
              <>
                <div className="eyebrow" style={{ marginTop: 10 }}>Ön bilgi · <span lang="en" className="en" style={{ textTransform: "none", letterSpacing: 0 }}>Prior learning – SL</span></div>
                {prior.map((c) => <Row key={c.id} c={c} state={state} openCard={openCard} />)}
              </>
            )}
            {main.map((c) => <Row key={c.id} c={c} state={state} openCard={openCard} />)}
          </div>
        );
      })}

      {(tab === "ib" || tab === "temel") && PATH.filter((s) => s.track.id === tab).map((s) => {
        const list = s.cards.map((id) => BY_ID[id]).filter(match);
        if (!list.length) return null;
        return (
          <div key={s.unit.id} className="panel" style={{ paddingBlock: 12 }}>
            <Bi tr={s.unit.tr} en={s.unit.en} className="h2" />
            {list.map((c) => <Row key={c.id} c={c} state={state} openCard={openCard} showSec={false} />)}
          </div>
        );
      })}

      {tab === "sozluk" && (
        <div className="panel" style={{ paddingBlock: 6 }}>
          {GLOSSARY.filter((g) => !fq || fold(g.en + " " + g.tr).includes(fq)).map((g) => (
            <button key={g.en} className="bk-row" style={{ gridTemplateColumns: "1fr 1fr auto" }} onClick={() => openCard(g.cards[0])}>
              <span lang="en" className="en" style={{ fontWeight: 600 }}><Rich text={g.en} /></span>
              <span className="small"><Rich text={g.tr} /></span>
              <ChevronRight size={16} className="faint" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
