import React from "react";
import { Repeat2, Sparkles, Compass, Flame, Brain, ChevronRight, Plus, Target, Zap, Snowflake, BookOpen } from "lucide-react";
import { Formula, Rich } from "../lib/tex.jsx";
import { Ring, Spark, Forecast, lvColor, Prio } from "./common.jsx";
import { dueIds, newLeftToday, avgRecall, forecast, today, formulaOfDay, weakest, shownStreak, getF, memLevel, currentR } from "../lib/srs.js";
import { dayKey, addDaysKey, keyToTs, weekdayShort } from "../lib/util.js";
import { TOPIC } from "../data/topics.js";

function greet(now) {
  const h = new Date(now).getHours();
  if (h < 5) return "İyi geceler";
  if (h < 11) return "Günaydın";
  if (h < 17) return "İyi günler";
  if (h < 22) return "İyi akşamlar";
  return "İyi geceler";
}

export default function Home({ state, now, startReview, startLearn, startFocus, goDiscover, openDetail, addToQueue, goArena }) {
  const due = dueIds(state, now);
  const t = today(state, now);
  const newLeft = newLeftToday(state, now);
  const queued = state.queue.length;
  const learnable = Math.min(queued, Math.max(newLeft, 0));
  const doneToday = t.r + t.n;
  const goal = doneToday + due.length + Math.min(newLeft, Math.max(queued, newLeft));
  const pct = goal ? doneToday / goal : 0;
  const R = avgRecall(state, now);
  const fc = forecast(state, now, 7);
  const fcLabels = fc.map((_, i) => (i === 0 ? "Bugün" : weekdayShort(now + i * 86400000)));
  const fod = formulaOfDay(state, now);
  const weak = weakest(state, now, 3);
  const st = shownStreak(state, now);
  const k = dayKey(now);

  // son 14 günün doğruluk oranı
  const acc = Array.from({ length: 14 }, (_, i) => {
    const d = state.days[addDaysKey(k, i - 13)];
    return d && d.ok + d.bad ? d.ok / (d.ok + d.bad) : null;
  });

  // haftalık şerit (Pazartesi başlangıçlı)
  const dow = (new Date(keyToTs(k)).getDay() + 6) % 7;
  const week = Array.from({ length: 7 }, (_, i) => {
    const key = addDaysKey(k, i - dow);
    const d = state.days[key];
    const n = d ? d.r + d.n : 0;
    return { key, n, label: ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"][i], future: i > dow };
  });

  let cta;
  if (due.length) cta = <button className="btn primary lg block" onClick={startReview}><Repeat2 size={20} /> Tekrara başla · {due.length}</button>;
  else if (queued && newLeft > 0) cta = <button className="btn primary lg block" onClick={startLearn}><Sparkles size={20} /> Öğrenmeye başla · {Math.min(queued, state.settings.batch)}</button>;
  else if (newLeft > 0) cta = <button className="btn primary lg block" onClick={goDiscover}><Compass size={20} /> Yeni formül keşfet</button>;
  else cta = <button className="btn outline lg block" onClick={goArena}><Zap size={20} /> Günlük hedef tamam · Arena’da pekiştir</button>;

  return (
    <div className="stack fade-in">
      <div>
        <div className="eyebrow">{greet(now)}</div>
        <h1 className="h1">{due.length ? <>Bugün <span style={{ color: "var(--accent)" }}>{due.length}</span> formül seni bekliyor</> : doneToday ? "Bugünkü tekrarların bitti" : "Bugün yeni bir formül öğren"}</h1>
      </div>

      <div className="card">
        <div className="hero-today">
          <Ring size={118} stroke={12} pct={pct} color="var(--accent)">
            <div>
              <div className="display num" style={{ fontSize: 30 }}>{Math.round(pct * 100)}<span style={{ fontSize: 16 }}>%</span></div>
              <div className="tiny faint" style={{ fontWeight: 800 }}>HEDEF</div>
            </div>
          </Ring>
          <div className="today-lines">
            <div className="today-line"><span className="dot" style={{ background: "var(--accent)" }} /><b className="num">{due.length}</b> tekrar hazır</div>
            <div className="today-line"><span className="dot" style={{ background: "var(--green)" }} /><b className="num">{t.n}/{state.settings.newPerDay}</b> yeni formül</div>
            <div className="today-line"><span className="dot" style={{ background: "var(--amber)" }} /><b className="num">{queued}</b> öğrenme listesinde</div>
            <div className="today-line"><Brain size={16} style={{ color: "var(--ink-3)" }} /><span className="muted">Hafıza gücü</span> <b className="num">{R == null ? "—" : `%${Math.round(R * 100)}`}</b></div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>{cta}</div>
        {due.length > 0 && queued > 0 && newLeft > 0 && (
          <button className="btn ghost block" style={{ marginTop: 6 }} onClick={startLearn}><Sparkles size={17} /> Önce yeni formül öğren ({Math.min(queued, state.settings.batch)})</button>
        )}
      </div>

      <div className="card">
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="row" style={{ gap: 8 }}>
            <Flame size={20} style={{ color: st.n ? "var(--amber)" : "var(--ink-3)" }} />
            <span className="h3"><span className="num">{st.n}</span> günlük seri</span>
          </div>
          <span className="tiny faint" style={{ fontWeight: 700 }}>
            {state.streak.freeze > 0 ? <><Snowflake size={12} style={{ verticalAlign: -1 }} /> {state.streak.freeze} dondurma hakkı</> : `En iyi: ${state.streak.best}`}
          </span>
        </div>
        <div className="week">
          {week.map((d) => (
            <div className="d" key={d.key}>
              <span className={"c" + (d.n >= 5 ? " done" : d.n > 0 ? " part" : "") + (d.key === k ? " today" : "")}>
                {d.n >= 5 ? <Flame size={15} /> : d.future ? "" : d.n || "·"}
              </span>
              {d.label}
            </div>
          ))}
        </div>
        {st.risk && <p className="small" style={{ margin: "10px 0 0", color: "var(--amber)", fontWeight: 650 }}>Dün çalışmadın; dondurma hakkın seriyi korudu. Bugün çalışırsan seri devam eder.</p>}
      </div>

      {fod && (
        <div className="index-card" style={{ padding: 0 }}>
          <div className="card-head"><span className="eyebrow" style={{ color: "var(--red)" }}>Günün formülü</span><Prio p={fod.p} /></div>
          <div style={{ padding: "12px 18px 16px" }} className="stack-sm">
            <div className="h3"><Rich text={fod.n} /></div>
            <div className="formula-box"><Formula f={fod} size="lg" /></div>
            {(fod.s || fod.h || fod.w) && <div className="small muted"><Rich text={fod.s || fod.w || fod.h} /></div>}
            <div className="row" style={{ marginTop: 4 }}>
              {state.cards[fod.id] && state.cards[fod.id].reps ? (
                <span className="tag green">Öğrendin</span>
              ) : state.queue.includes(fod.id) ? (
                <span className="tag accent">Öğrenme listesinde</span>
              ) : (
                <button className="btn soft sm" onClick={() => addToQueue(fod.id)}><Plus size={16} /> Listeye ekle</button>
              )}
              <button className="btn ghost sm" onClick={() => openDetail(fod.id)}>Detay <ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="row between"><span className="h3">Doğruluk · son 14 gün</span><span className="tiny faint" style={{ fontWeight: 700 }}>bugün {t.ok + t.bad ? `%${Math.round((t.ok / (t.ok + t.bad)) * 100)}` : "—"}</span></div>
        <div style={{ marginTop: 8 }}><Spark values={acc} /></div>
      </div>

      <div className="card">
        <div className="row between" style={{ marginBottom: 10 }}><span className="h3">Önümüzdeki 7 gün</span><span className="tiny faint" style={{ fontWeight: 700 }}>tekrar sayısı</span></div>
        <Forecast values={fc} labels={fcLabels} />
      </div>

      {weak.length > 0 && (
        <div className="card">
          <div className="row between" style={{ marginBottom: 4 }}>
            <span className="h3">Zayıf halkalar</span>
            <button className="btn soft sm" onClick={() => startFocus(weak.map((w) => w.id))}><Target size={16} /> Odak turu</button>
          </div>
          {weak.map(({ id, p, R: r }) => {
            const f = getF(state, id);
            return (
              <button className="weak-item" key={id} onClick={() => openDetail(id)}>
                <span style={{ width: 10, height: 34, borderRadius: 4, background: lvColor(memLevel(p)) }} />
                <span className="grow">
                  <span style={{ display: "block", fontWeight: 700 }}><Rich text={f.n} /></span>
                  <span className="tiny faint">{(TOPIC[f.t] || TOPIC.ozel).name} · {p.lapses} kez unutuldu</span>
                </span>
                <span className="tag red num">%{Math.round((r || 0) * 100)}</span>
              </button>
            );
          })}
        </div>
      )}

      {!Object.keys(state.cards).length && (
        <div className="card flat" style={{ background: "var(--accent-soft)", borderColor: "transparent" }}>
          <div className="row" style={{ alignItems: "flex-start" }}>
            <BookOpen size={22} style={{ color: "var(--accent)", flex: "none", marginTop: 2 }} />
            <div className="small">
              <b>Nasıl çalışır?</b> Keşfet’te formülleri tek tek gör: bildiklerini geç, bilmediklerini öğrenme listene ekle.
              Uygulama her formülü unutmak üzere olduğun anda tekrar sorar. Bildikçe aralıklar uzar: 1 gün, 3 gün, 1 hafta, 1 ay…
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
