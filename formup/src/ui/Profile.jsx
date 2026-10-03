/* Profil: rütbe, istatistikler, ısı haritası, Pi’nin gardırobu, rozetler ve ayarlar */
import React, { useMemo, useState } from "react";
import {
  Download, Upload, Trash2, Cloud, CloudOff, HardDrive, Copy, Check, Info, Sparkles, Flame, Star, Brain, Clock, Target,
  Crown, Layers, BookOpen, Moon, ShieldCheck, Languages, FlaskConical, Zap, Search, Orbit, Rocket, Sun,
} from "lucide-react";
import { Bi, Switch, Sheet, Bar } from "./common.jsx";
import Pi, { OUTFITS } from "./Pi.jsx";
import { RANKS, rankOf, ACHIEVEMENTS } from "../data/v2/meta.js";
import { CARDS, learned, memLevel, MEM, forecast, avgRecall } from "../lib/learn.js";
import { dayKey, addDaysKey, keyToTs, weekdayShort } from "../lib/util.js";

const ACH_ICONS = { Star, Crown, Sparkles, Orbit, Rocket, Layers, BookOpen, Flame, Moon, Target, Brain, ShieldCheck, Languages, FlaskConical, Zap, Search };
const GOALS = [[20, "Rahat", "Casual"], [40, "Normal", "Regular"], [60, "Ciddi", "Serious"], [100, "Çılgın", "Insane"]];

export default function Profile({ state, now, setSettings, onBuy, onWear, onImport, onResetAll, storage }) {
  const { i: ri, cur, next, pct } = rankOf(state.xp);
  const ids = learned(state);
  const lv = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0];
    for (const x of CARDS) c[memLevel(state.cards[x.id])]++;
    return c;
  }, [state.cards]);
  const k = dayKey(now);
  let ok = 0, bad = 0, ms = 0;
  for (let i = 0; i < 30; i++) { const d = state.days[addDaysKey(k, -i)]; if (d) { ok += d.ok || 0; bad += d.bad || 0; } }
  for (const d of Object.values(state.days)) ms += d.ms || 0;
  const acc = ok + bad ? ok / (ok + bad) : null;
  const R = avgRecall(state, now);
  const fc = forecast(state, now, 7);
  const fmax = Math.max(1, ...fc);

  // ısı haritası: son 16 hafta, Pazartesi başlangıçlı sütunlar
  const dow = (new Date(keyToTs(k)).getDay() + 6) % 7;
  const cells = [];
  for (let w = 15; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const off = -(w * 7 + dow - d);
      const key = addDaysKey(k, off);
      const day = state.days[key];
      cells.push({ key, n: day ? (day.ok || 0) + (day.bad || 0) : 0, fut: off > 0 });
    }
  }
  const heat = (n) => (n === 0 ? "" : n < 10 ? " h1" : n < 25 ? " h2" : n < 50 ? " h3" : " h4");
  const achN = ACHIEVEMENTS.filter((a) => state.ach[a.id]).length;

  return (
    <div className="stack fade-in">
      {/* Rütbe */}
      <div className="panel glow" style={{ overflow: "hidden" }}>
        <div className="rank-hero">
          <div className="rank-mono" aria-hidden="true">{cur.mono}</div>
          <Pi mood="happy" outfit={state.settings.outfit} size={92} />
          <div className="stack-sm" style={{ gap: 4, minWidth: 0 }}>
            <span className="eyebrow">Rütbe {ri + 1}/{RANKS.length} · Rank</span>
            <div className="h1">{cur.tr}</div>
            {cur.en !== cur.tr && <div lang="en" className="en small">{cur.en}</div>}
            {cur.who && <div className="tiny muted" style={{ lineHeight: 1.4 }}>{cur.who}</div>}
          </div>
        </div>
        <div className="stack-sm" style={{ marginTop: 14, gap: 6 }}>
          <Bar pct={pct} color="var(--gold)" />
          <div className="row between tiny faint" style={{ fontWeight: 600 }}>
            <span className="num">{state.xp} XP</span>
            <span>{next ? `${next.tr} için ${next.xp - state.xp} XP · next: ${next.en}` : "Zirvedesin · You're at the top"}</span>
          </div>
        </div>
      </div>

      {/* Sayılar */}
      <div className="stat-grid">
        <div className="stat"><b className="num">{ids.length}</b><span>Yıldız · <span lang="en">Stars</span></span></div>
        <div className="stat"><b className="num">{lv[4] + lv[5]}</b><span>Kalıcı · <span lang="en">Lasting</span></span></div>
        <div className="stat"><b className="num">{state.streak.best}</b><span>En uzun seri</span></div>
        <div className="stat"><b className="num">{acc == null ? "—" : `%${Math.round(acc * 100)}`}</b><span>30 gün doğruluk</span></div>
        <div className="stat"><b className="num">{R == null ? "—" : `%${Math.round(R * 100)}`}</b><span>Hatırlama · <span lang="en">Recall</span></span></div>
        <div className="stat"><b className="num">{Math.round(ms / 60000)}</b><span>Dakika · <span lang="en">Minutes</span></span></div>
      </div>

      {/* Hafıza seviyeleri */}
      <div className="panel">
        <Bi tr="Formüllerin hafızadaki yeri" en="Where your formulas live in memory" className="h3" />
        <div className="stack-sm" style={{ marginTop: 12, gap: 7 }}>
          {MEM.map((m, i) => (
            <div key={i} className="mem-row">
              <span className="small" style={{ fontWeight: 600 }}>{m.tr} <span lang="en" className="en tiny">{m.en}</span></span>
              <Bar pct={lv[i] / Math.max(1, CARDS.length)} color={i === 0 ? "var(--surface-3)" : i < 3 ? "var(--sky)" : "var(--gold)"} />
              <span className="num tiny faint" style={{ fontWeight: 700, textAlign: "right" }}>{lv[i]}</span>
            </div>
          ))}
        </div>
        <div className="eyebrow" style={{ marginTop: 16, marginBottom: 6 }}>Önümüzdeki 7 gün · Next 7 days</div>
        <div className="fc">
          {fc.map((n, i) => (
            <div key={i} className="fc-col">
              <span className="num tiny" style={{ fontWeight: 700 }}>{n || ""}</span>
              <span className="fc-bar" style={{ height: `${Math.max(4, (n / fmax) * 56)}px`, background: i === 0 ? "var(--coral)" : "var(--sky)" }} />
              <span className="tiny faint">{i === 0 ? "Bugün" : weekdayShort(now + i * 86400000)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Isı haritası */}
      <div className="panel">
        <div className="row between"><Bi tr="Çalışma takvimi" en="Study calendar" className="h3" /><span className="tag coral"><Flame size={13} /> {state.streak.cur} gün</span></div>
        <div className="heat" style={{ marginTop: 12 }} aria-label="Son 16 hafta">
          {cells.map((c) => <i key={c.key} className={(c.fut ? "fut" : "") + heat(c.n)} title={`${c.key}: ${c.n}`} />)}
        </div>
        <div className="tiny faint" style={{ marginTop: 6 }}>Seri dondurucu · streak freeze: <b>{state.streak.freeze}</b> (her 7 günde bir kazanılır · earned every 7 days)</div>
      </div>

      {/* Gardırop */}
      <div className="panel">
        <div className="row between"><Bi tr="Pi’nin gardırobu" en="Pi's wardrobe" className="h3" /><span className="tag gold"><Sparkles size={13} /> {state.dust} ✦</span></div>
        <p className="tiny muted" style={{ margin: "6px 0 10px" }}>Yıldız tozunu (✦) derslerden, görevlerden ve oyunlardan kazanırsın. <span lang="en" className="en">Earn stardust from lessons, quests and games.</span></p>
        <div className="wardrobe">
          {OUTFITS.map((o) => {
            const own = !!state.owned[o.id];
            const on = state.settings.outfit === o.id;
            const afford = state.dust >= o.price;
            return (
              <button key={o.id} className={(on ? "on" : "") + (!own && !afford ? " locked" : "")}
                onClick={() => (own ? onWear(o.id) : afford ? onBuy(o.id) : null)} aria-pressed={on}
                aria-label={`${o.tr}${own ? "" : `, ${o.price} yıldız tozu`}`}>
                <Pi mood={on ? "happy" : "idle"} outfit={o.id} size={54} />
                <span>{o.tr}</span>
                <span className="tiny" style={{ color: own ? "var(--mint)" : "var(--gold)", fontWeight: 700 }}>{on ? "Giyili" : own ? "Giy" : `${o.price} ✦`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rozetler */}
      <div className="panel">
        <div className="row between"><Bi tr="Rozetler" en="Badges" className="h3" /><span className="tiny faint num" style={{ fontWeight: 700 }}>{achN}/{ACHIEVEMENTS.length}</span></div>
        <div className="ach-grid" style={{ marginTop: 12 }}>
          {ACHIEVEMENTS.map((a) => {
            const I = ACH_ICONS[a.icon] || Star;
            const got = !!state.ach[a.id];
            return (
              <div key={a.id} className={"ach" + (got ? "" : " locked")} title={`${a.dtr} · ${a.den}`}>
                <span className="ai"><I size={20} /></span>
                <span>{a.tr}</span>
                <span className="tiny faint" style={{ fontWeight: 500 }}>{a.dtr}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Settings state={state} setSettings={setSettings} onImport={onImport} onResetAll={onResetAll} storage={storage} />

      <div className="row" style={{ alignItems: "flex-start", padding: "0 4px" }}>
        <Info size={17} className="faint" style={{ flex: "none", marginTop: 2 }} />
        <p className="tiny muted" style={{ margin: 0 }}>
          FormUp her formül için hafızanın ne kadar dayanıklı olduğunu FSRS algoritmasıyla tahmin eder ve formülü, unutmak üzereyken tam zamanında sorar.
          Hafıza güçlendikçe sorular da zorlaşır: önce tanıma, sonra hatırlama, en sonunda gerçek bir soruda uygulama.
          <span lang="en" className="en"> FSRS schedules each formula right before you would forget it.</span>
        </p>
      </div>
    </div>
  );
}

function Settings({ state, setSettings, onImport, onResetAll, storage }) {
  const s = state.settings;
  const [backup, setBackup] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const Row = ({ tr, en, sub, children }) => (
    <div className="setting">
      <span style={{ minWidth: 0 }}><b>{tr}</b> {en && <span lang="en" className="en tiny">{en}</span>}{sub && <div className="tiny faint">{sub}</div>}</span>
      {children}
    </div>
  );
  return (
    <div className="panel">
      <Bi tr="Ayarlar" en="Settings" className="h3" />
      <div className="eyebrow" style={{ margin: "12px 0 8px" }}>Günlük hedef · Daily goal</div>
      <div className="goal-grid">
        {GOALS.map(([g, tr, en]) => (
          <button key={g} className={s.goal === g ? "on" : ""} onClick={() => setSettings({ goal: g })} aria-pressed={s.goal === g}>
            <b>{g}</b><span>XP · {tr}</span><span lang="en" className="en" style={{ fontSize: 10 }}>{en}</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <Row tr="Tema" en="Theme" sub={s.theme === "dark" ? "Gece gökyüzü" : "Gündüz"}>
          <div className="seg" style={{ width: 150 }}>
            <button className={s.theme === "dark" ? "on" : ""} onClick={() => setSettings({ theme: "dark" })} aria-label="Koyu tema"><Moon size={15} /></button>
            <button className={s.theme === "light" ? "on" : ""} onClick={() => setSettings({ theme: "light" })} aria-label="Açık tema"><Sun size={15} /></button>
          </div>
        </Row>
        <Row tr="İngilizce satırlar" en="English lines" sub="Her yerde İngilizce karşılık göster"><Switch on={s.showEn} onChange={(v) => setSettings({ showEn: v })} label="İngilizce" /></Row>
        <Row tr="Ses" en="Sound"><Switch on={s.sound} onChange={(v) => setSettings({ sound: v })} label="Ses" /></Row>
        <Row tr="Titreşim" en="Haptics"><Switch on={s.haptics} onChange={(v) => setSettings({ haptics: v })} label="Titreşim" /></Row>
        <Row tr="Tüm yolu aç" en="Unlock all" sub="Kilitli dersleri de açar"><Switch on={s.unlockAll} onChange={(v) => setSettings({ unlockAll: v })} label="Tüm yolu aç" /></Row>
        <div className="setting" style={{ flexDirection: "column", alignItems: "stretch", gap: 6 }}>
          <div className="row between"><span><b>Hedef hatırlama</b> <span lang="en" className="en tiny">Target recall</span></span><b className="num">%{Math.round(s.retention * 100)}</b></div>
          <input className="plain" type="range" min="0.8" max="0.95" step="0.01" value={s.retention} onChange={(e) => setSettings({ retention: Number(e.target.value) })} aria-label="Hedef hatırlama" />
          <div className="tiny faint">Yüksek değer = daha sık tekrar, daha güçlü hafıza. Sınav dönemi için %92–95 iyi.</div>
        </div>
        <Row tr="Kayıt" en="Saving" sub={storage === "cloud" ? "Hesabına kaydediliyor; cihazlar arası senkron" : storage === "storage" ? "Kalıcı depoya kaydediliyor" : "Yalnızca bu tarayıcıda; ara sıra yedek al"}>
          {storage === "cloud" ? <Cloud size={20} style={{ color: "var(--mint)" }} /> : storage === "storage" ? <HardDrive size={20} style={{ color: "var(--mint)" }} /> : <CloudOff size={20} style={{ color: "var(--gold)" }} />}
        </Row>
        <Row tr="Yedek" en="Backup">
          <span className="row" style={{ gap: 6 }}>
            <button className="btn soft sm" onClick={() => setBackup("export")}><Download size={15} /> Al</button>
            <button className="btn soft sm" onClick={() => setBackup("import")}><Upload size={15} /> Yükle</button>
          </span>
        </Row>
        <Row tr="Sıfırla" en="Reset" sub="Tüm ilerleme silinir, geri alınamaz">
          {confirmReset ? (
            <span className="row" style={{ gap: 6 }}>
              <button className="btn ghost sm" onClick={() => setConfirmReset(false)}>Vazgeç</button>
              <button className="btn coral sm" onClick={() => { setConfirmReset(false); onResetAll(); }}>Evet</button>
            </span>
          ) : <button className="btn ghost sm" style={{ color: "var(--coral)" }} onClick={() => setConfirmReset(true)}><Trash2 size={15} /> Sıfırla</button>}
        </Row>
      </div>
      {backup && <BackupSheet mode={backup} state={state} onClose={() => setBackup(null)} onImport={(d) => { onImport(d); setBackup(null); }} />}
    </div>
  );
}

function BackupSheet({ mode, state, onClose, onImport }) {
  const json = useMemo(() => JSON.stringify(state), [state]);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState(null);
  const copy = async () => {
    try { await navigator.clipboard.writeText(json); setCopied(true); } catch (e) { setErr("Kopyalanamadı; metni elle seç."); }
  };
  const load = () => {
    try {
      const d = JSON.parse(text);
      if (!d || d.v !== 2 || typeof d.cards !== "object") throw new Error("bad");
      onImport(d);
    } catch (e) { setErr("Bu bir FormUp v2 yedeği değil gibi görünüyor."); }
  };
  return (
    <Sheet onClose={onClose} label="Yedek">
      <div className="stack">
        <Bi tr={mode === "export" ? "Yedeği al" : "Yedeği yükle"} en={mode === "export" ? "Export backup" : "Import backup"} className="h2" />
        {mode === "export" ? (
          <>
            <p className="small muted" style={{ margin: 0 }}>Bu metni kopyalayıp güvenli bir yere yapıştır (not uygulaması, e-posta…).</p>
            <textarea readOnly value={json} rows={6} className="code-area" onFocus={(e) => e.target.select()} aria-label="Yedek metni" />
            <button className="btn gold block" onClick={copy}>{copied ? <><Check size={17} /> Kopyalandı</> : <><Copy size={17} /> Kopyala</>}</button>
          </>
        ) : (
          <>
            <p className="small muted" style={{ margin: 0 }}>Daha önce aldığın yedek metnini buraya yapıştır. Şu anki ilerlemenin yerine geçer.</p>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setErr(null); }} rows={6} className="code-area" placeholder='{"v":2,…}' aria-label="Yedek metni" />
            <button className="btn gold block" onClick={load} disabled={!text.trim()}><Upload size={17} /> Yükle</button>
          </>
        )}
        {err && <div className="small" style={{ color: "var(--coral)" }}>{err}</div>}
      </div>
    </Sheet>
  );
}
