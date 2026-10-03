import React, { useMemo, useState } from "react";
import {
  Settings, Trophy, Download, Upload, Trash2, Cloud, CloudOff, HardDrive, Plus, Minus, Copy, Check, Info,
  Sparkles, Layers, BookOpen, Crown, Flame, Moon, Medal, Target, Brain, Award, ShieldCheck, Zap, Puzzle, Calculator, PenLine, Sun, Flag,
} from "lucide-react";
import { Tex, Formula, Rich } from "../lib/tex.jsx";
import { Bar, LevelBar, Forecast, Switch, Sheet } from "./common.jsx";
import { RANKS, rankOf, ACHIEVEMENTS } from "../data/ranks.js";
import { LEVELS, TOPICS } from "../data/topics.js";
import { allFormulas, memLevel, learnedIds, forecast, currentR } from "../lib/srs.js";
import { dayKey, addDaysKey, keyToTs, weekdayShort, fmtNum } from "../lib/util.js";

const ACH_ICONS = { Sparkles, Layers, BookOpen, Trophy, Crown, Flame, Moon, Medal, Target, Brain, Award, ShieldCheck, Zap, Puzzle, Calculator, PenLine, Sun, Flag };

export default function Profile({ state, now, setSettings, openEditor, onImport, onResetAll, storage }) {
  const { cur, next, pct } = rankOf(state.xp);
  const learned = learnedIds(state);
  const durable = learned.filter((id) => memLevel(state.cards[id]) >= 4).length;
  const k = dayKey(now);
  let ok = 0, bad = 0, ms = 0, reviews = 0;
  for (let i = 0; i < 30; i++) {
    const d = state.days[addDaysKey(k, -i)];
    if (d) { ok += d.ok; bad += d.bad; }
  }
  for (const d of Object.values(state.days)) { ms += d.ms || 0; reviews += (d.r || 0); }
  const acc = ok + bad ? ok / (ok + bad) : null;

  const counts = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0];
    const lv = new Set(state.settings.levels);
    for (const f of allFormulas(state)) if (lv.has(f.lv) || f.t === "ozel") c[memLevel(state.cards[f.id])]++;
    return c;
  }, [state]);

  const fc = forecast(state, now, 14);
  const fcLabels = fc.map((_, i) => (i === 0 ? "Bg" : i % 2 ? "" : weekdayShort(now + i * 86400000).slice(0, 2)));

  // ısı haritası: son 18 hafta (Pazartesi başlangıçlı sütunlar)
  const dow = (new Date(keyToTs(k)).getDay() + 6) % 7;
  const weeks = 18;
  const cells = [];
  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const off = -(w * 7 + dow - d);
      const key = addDaysKey(k, off);
      const day = state.days[key];
      const n = day ? day.ok + day.bad : 0;
      cells.push({ key, n, fut: off > 0 });
    }
  }
  const lvl = (n) => (n === 0 ? "" : n < 10 ? " h1" : n < 25 ? " h2" : n < 50 ? " h3" : " h4");

  const ctx = achievementCtx(state, now);

  return (
    <div className="stack fade-in">
      <div>
        <div className="eyebrow">Profil</div>
        <h1 className="h2">İlerlemen</h1>
      </div>

      <div className="card">
        <div className="rank-card">
          <div className="rank-badge" aria-hidden="true">{cur.mono}</div>
          <div className="stack-sm" style={{ gap: 6, minWidth: 0 }}>
            <div className="row between"><span className="h3">{cur.name}</span><span className="tag amber num">{state.xp} XP</span></div>
            <Bar pct={pct} color="var(--amber)" />
            <div className="tiny faint" style={{ fontWeight: 700 }}>{next ? `Sonraki rütbe: ${next.name} · ${next.xp - state.xp} XP kaldı` : "En yüksek rütbedesin"}</div>
          </div>
        </div>
        <p className="small muted" style={{ margin: "12px 0 0" }}><Rich text={cur.who} /></p>
      </div>

      <div className="stat-grid">
        <div className="stat"><b className="num">{learned.length}</b><span>Öğrenilen</span></div>
        <div className="stat"><b className="num">{durable}</b><span>Kalıcı+</span></div>
        <div className="stat"><b className="num">{acc == null ? "—" : `%${Math.round(acc * 100)}`}</b><span>Doğruluk 30g</span></div>
        <div className="stat"><b className="num">{state.streak.best}</b><span>En iyi seri</span></div>
        <div className="stat"><b className="num">{reviews}</b><span>Tekrar</span></div>
        <div className="stat"><b className="num">{Math.round(ms / 60000)}<small style={{ fontSize: 13 }}> dk</small></b><span>Süre</span></div>
      </div>

      <div className="card">
        <div className="row between" style={{ marginBottom: 10 }}><span className="h3">Çalışma takvimi</span><span className="tiny faint" style={{ fontWeight: 700 }}>son 18 hafta</span></div>
        <div className="heat" aria-label="Günlük çalışma yoğunluğu">
          {cells.map((c) => <i key={c.key} className={c.fut ? "fut" : lvl(c.n)} title={`${c.key}: ${c.n} cevap`} />)}
        </div>
      </div>

      <div className="card">
        <div className="h3" style={{ marginBottom: 10 }}>Hafıza seviyeleri</div>
        <LevelBar counts={counts} />
      </div>

      <div className="card">
        <div className="row between" style={{ marginBottom: 10 }}><span className="h3">Tekrar yükü</span><span className="tiny faint" style={{ fontWeight: 700 }}>14 gün</span></div>
        <Forecast values={fc} labels={fcLabels} />
      </div>

      <TopicMastery state={state} now={now} />

      <div className="section">
        <div className="section-head"><span className="h3">Rozetler</span><span className="tiny faint" style={{ fontWeight: 700 }}>{Object.keys(state.ach).length}/{ACHIEVEMENTS.length}</span></div>
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a) => {
            const I = ACH_ICONS[a.icon] || Trophy;
            const on = !!state.ach[a.id];
            return (
              <div key={a.id} className={"ach" + (on ? "" : " locked")} title={a.desc}>
                <span className="ai"><I size={20} /></span>
                <span>{a.name}</span>
                <span className="tiny faint" style={{ fontWeight: 600 }}>{a.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      <SettingsCard state={state} setSettings={setSettings} openEditor={openEditor} onImport={onImport} onResetAll={onResetAll} storage={storage} />
    </div>
  );
}

function TopicMastery({ state, now }) {
  const lv = new Set(state.settings.levels);
  const rows = TOPICS.filter((t) => lv.has(t.lv)).map((t) => {
    const fs = allFormulas(state).filter((f) => f.t === t.id);
    const ls = fs.filter((f) => state.cards[f.id] && state.cards[f.id].reps);
    const R = ls.length ? ls.reduce((s, f) => s + (currentR(state.cards[f.id], now) || 0), 0) / ls.length : null;
    return { t, total: fs.length, learned: ls.length, R };
  }).filter((r) => r.total);
  return (
    <div className="card">
      <div className="h3" style={{ marginBottom: 6 }}>Konulara göre</div>
      <div className="stack-sm">
        {rows.map((r) => (
          <div key={r.t.id} className="row" style={{ gap: 10 }}>
            <span className="small grow" style={{ fontWeight: 650, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.t.name}</span>
            <span style={{ width: 90 }}><Bar pct={r.learned / r.total} /></span>
            <span className="tiny num faint" style={{ width: 44, textAlign: "right", fontWeight: 750 }}>{r.learned}/{r.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function achievementCtx(state, now) {
  const learned = learnedIds(state);
  const lv = learned.map((id) => memLevel(state.cards[id]));
  const byTopic = {};
  for (const f of allFormulas(state)) {
    const o = (byTopic[f.t] = byTopic[f.t] || { n: 0, l: 0 });
    o.n++; if (state.cards[f.id] && state.cards[f.id].reps) o.l++;
  }
  const t = state.days[dayKey(now)];
  return {
    learned: learned.length, durable: lv.filter((x) => x >= 4).length, master: lv.filter((x) => x >= 5).length,
    topicDone: Object.values(byTopic).some((o) => o.n >= 5 && o.l === o.n),
    hour: new Date(now).getHours(), studiedNow: !!(t && t.ok + t.bad > 0),
  };
}

/* ---------------- Ayarlar ---------------- */
function SettingsCard({ state, setSettings, openEditor, onImport, onResetAll, storage }) {
  const s = state.settings;
  const [backup, setBackup] = useState(null); // "export" | "import"
  const [confirmReset, setConfirmReset] = useState(false);
  const toggleLevel = (id) => {
    const has = s.levels.includes(id);
    const levels = has ? s.levels.filter((x) => x !== id) : [...s.levels, id];
    if (levels.length) setSettings({ levels });
  };
  const retLabel = s.retention >= 0.94 ? "Sınav modu: daha sık tekrar" : s.retention <= 0.85 ? "Rahat: daha seyrek tekrar" : "Dengeli (önerilen)";
  const MODES = [["m", "Çoktan seçmeli"], ["t", "Doğru / yanlış"], ["r", "Formülün adını bul"], ["f", "Kart çevirme (hatırlama)"], ["a", "Sayısal uygulama"]];
  return (
    <div className="section">
      <div className="section-head"><span className="h3"><Settings size={18} style={{ verticalAlign: -3 }} /> Ayarlar</span></div>
      <div className="card">
        <div className="setting" style={{ flexDirection: "column", alignItems: "stretch" }}>
          <span style={{ fontWeight: 700 }}>Çalıştığım seviyeler</span>
          <div className="row wrap" style={{ gap: 6 }}>
            {LEVELS.map((l) => <button key={l.id} className={"chip" + (s.levels.includes(l.id) ? " on" : "")} onClick={() => toggleLevel(l.id)}>{l.name}</button>)}
          </div>
        </div>
        <div className="setting">
          <span><b>Günlük yeni formül</b><div className="tiny faint">Her gün öğrenilecek en fazla yeni formül</div></span>
          <Stepper value={s.newPerDay} min={1} max={40} onChange={(v) => setSettings({ newPerDay: v })} />
        </div>
        <div className="setting">
          <span><b>Ders büyüklüğü</b><div className="tiny faint">Bir derste kaç yeni formül</div></span>
          <Stepper value={s.batch} min={3} max={10} onChange={(v) => setSettings({ batch: v })} />
        </div>
        <div className="setting" style={{ flexDirection: "column", alignItems: "stretch", gap: 6 }}>
          <span className="row between"><b>Hedef hatırlama</b><span className="tag accent num">%{Math.round(s.retention * 100)}</span></span>
          <input type="range" min="0.8" max="0.97" step="0.01" value={s.retention} onChange={(e) => setSettings({ retention: Number(e.target.value) })} aria-label="Hedef hatırlama oranı" />
          <span className="tiny faint">{retLabel}. Bir formülü bu olasılıkla hatırlayacağın anda tekrar sorulur.</span>
        </div>
        <div className="setting">
          <b>Görünüm</b>
          <div className="seg" style={{ width: 220 }}>
            {[["auto", "Otomatik"], ["light", "Defter"], ["dark", "Tahta"]].map(([v, l]) => (
              <button key={v} className={s.theme === v ? "on" : ""} onClick={() => setSettings({ theme: v })}>{l}</button>
            ))}
          </div>
        </div>
        <div className="setting"><b>Ses efektleri</b><Switch on={s.sound} onChange={(v) => setSettings({ sound: v })} label="Ses efektleri" /></div>
        <div className="setting"><b>Titreşim</b><Switch on={s.haptics} onChange={(v) => setSettings({ haptics: v })} label="Titreşim" /></div>
        <div className="setting" style={{ flexDirection: "column", alignItems: "stretch", gap: 4 }}>
          <b>Soru türleri</b>
          {MODES.map(([k, l]) => (
            <div key={k} className="row between" style={{ padding: "6px 0" }}>
              <span className="small">{l}</span>
              <Switch on={s.modes[k]} label={l} onChange={(v) => {
                const modes = { ...s.modes, [k]: v };
                if (Object.values(modes).some(Boolean)) setSettings({ modes });
              }} />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="setting">
          <span><b>Kendi formülünü ekle</b><div className="tiny faint">LaTeX ile yaz, aynı tekrar sistemine girsin</div></span>
          <button className="btn soft sm" onClick={openEditor}><Plus size={16} /> Ekle</button>
        </div>
        <div className="setting">
          <span className="row" style={{ gap: 8 }}>
            {storage === "cloud" ? <Cloud size={18} style={{ color: "var(--green)" }} /> : storage === "storage" ? <HardDrive size={18} style={{ color: "var(--green)" }} /> : <CloudOff size={18} style={{ color: "var(--amber)" }} />}
            <span><b>Kayıt</b><div className="tiny faint">{storage === "cloud" ? "Hesabına kaydediliyor; cihazlar arası senkron" : storage === "storage" ? "Kalıcı depoya kaydediliyor" : "Yalnızca bu tarayıcıda; ara sıra yedek al"}</div></span>
          </span>
        </div>
        <div className="setting">
          <b>Yedek</b>
          <span className="row" style={{ gap: 6 }}>
            <button className="btn soft sm" onClick={() => setBackup("export")}><Download size={15} /> Dışa aktar</button>
            <button className="btn soft sm" onClick={() => setBackup("import")}><Upload size={15} /> İçe aktar</button>
          </span>
        </div>
        <div className="setting">
          <span><b>Tüm ilerlemeyi sıfırla</b><div className="tiny faint">Geri alınamaz</div></span>
          {confirmReset ? (
            <span className="row" style={{ gap: 6 }}>
              <button className="btn ghost sm" onClick={() => setConfirmReset(false)}>Vazgeç</button>
              <button className="btn bad sm" onClick={() => { setConfirmReset(false); onResetAll(); }}>Evet, sıfırla</button>
            </span>
          ) : (
            <button className="btn ghost sm" style={{ color: "var(--red)" }} onClick={() => setConfirmReset(true)}><Trash2 size={15} /> Sıfırla</button>
          )}
        </div>
      </div>

      <div className="card flat" style={{ background: "transparent" }}>
        <div className="row" style={{ alignItems: "flex-start" }}>
          <Info size={18} className="faint" style={{ flex: "none", marginTop: 2 }} />
          <p className="tiny muted" style={{ margin: 0 }}>
            FormUp, her formül için hafıza stabilitesini ve zorluğunu FSRS-5 algoritmasıyla tahmin eder. Formül, hatırlama olasılığın hedefin altına düşmek üzereyken tekrar sorulur.
            Hafıza güçlendikçe soru türü de zorlaşır: önce tanıma, sonra hatırlama, en sonunda gerçek bir soruda uygulama.
          </p>
        </div>
      </div>

      {backup && <BackupSheet mode={backup} state={state} onClose={() => setBackup(null)} onImport={(d) => { onImport(d); setBackup(null); }} />}
    </div>
  );
}

function Stepper({ value, min, max, onChange }) {
  return (
    <span className="row" style={{ gap: 6 }}>
      <button className="icon-btn" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Azalt"><Minus size={16} /></button>
      <b className="num" style={{ minWidth: 26, textAlign: "center", fontSize: 17 }}>{value}</b>
      <button className="icon-btn" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Artır"><Plus size={16} /></button>
    </span>
  );
}

function BackupSheet({ mode, state, onClose, onImport }) {
  const json = useMemo(() => JSON.stringify(state), [state]);
  const [txt, setTxt] = useState("");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState(null);
  const copy = async (e) => {
    try { await navigator.clipboard.writeText(json); setCopied(true); }
    catch (x) { const ta = e.currentTarget.parentElement.querySelector("textarea"); ta && ta.select(); }
  };
  const doImport = () => {
    try {
      const d = JSON.parse(txt);
      if (!d || typeof d !== "object" || !d.cards) throw new Error("FormUp yedeği değil");
      onImport(d);
    } catch (x) { setErr("Bu metin bir FormUp yedeği gibi görünmüyor. Dışa aktar ekranındaki metnin tamamını yapıştır."); }
  };
  return (
    <Sheet onClose={onClose} label="Yedek">
      {mode === "export" ? (
        <div className="stack">
          <h2 className="h2">Yedeği dışa aktar</h2>
          <p className="small muted" style={{ margin: 0 }}>Bu metni kopyala ve bir not uygulamasında sakla. Başka bir cihazda “İçe aktar” ile geri yükleyebilirsin.</p>
          <textarea id="backup-out" className="textarea" readOnly value={json} rows={6} onFocus={(e) => e.target.select()} />
          <button className="btn primary block" onClick={copy}>{copied ? <><Check size={17} /> Kopyalandı</> : <><Copy size={17} /> Kopyala</>}</button>
        </div>
      ) : (
        <div className="stack">
          <h2 className="h2">Yedeği içe aktar</h2>
          <p className="small muted" style={{ margin: 0 }}>Daha önce dışa aktardığın metni yapıştır. Mevcut ilerlemenin yerini alır.</p>
          <textarea id="backup-in" className="textarea" value={txt} onChange={(e) => { setTxt(e.target.value); setErr(null); }} rows={6} placeholder='{"v":1, ...}' />
          {err && <div className="small" style={{ color: "var(--red)", fontWeight: 650 }}>{err}</div>}
          <button className="btn primary block" onClick={doImport} disabled={!txt.trim()}><Upload size={17} /> Geri yükle</button>
        </div>
      )}
    </Sheet>
  );
}

/* ---------------- Kendi formülün ---------------- */
const SNIPPETS = [
  ["\\dfrac{}{}", "\\dfrac{a}{b}"], ["^{}", "x^{n}"], ["_{}", "x_{1}"], ["\\sqrt{}", "\\sqrt{x}"], ["\\pi", "\\pi"], ["\\theta", "\\theta"],
  ["\\alpha", "\\alpha"], ["\\cdot", "\\cdot"], ["\\pm", "\\pm"], ["\\le", "\\le"], ["\\int", "\\int"], ["\\sum", "\\sum"], ["\\lim_{x\\to }", "\\lim"], ["\\sin", "\\sin"], ["\\log_{}", "\\log_a"],
];
export function Editor({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => initial || { n: "", l: "", o: "=", r: "", k: "", w: "", h: "", x: ["", "", ""] });
  const [focus, setFocus] = useState("l");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const insert = (snip) => {
    if (focus === "x0" || focus === "x1" || focus === "x2") {
      const i = Number(focus[1]);
      const x = [...f.x]; x[i] = (x[i] || "") + snip; set("x", x);
    } else if (["l", "r"].includes(focus)) set(focus, (f[focus] || "") + snip);
  };
  const valid = f.n.trim() && f.l.trim() && f.r.trim();
  const preview = { ...f, l: f.l || "?", r: f.r || "?" };
  return (
    <Sheet onClose={onClose} label="Kendi formülün">
      <div className="stack">
        <h2 className="h2">{initial ? "Formülü düzenle" : "Kendi formülün"}</h2>
        <div className="index-card" style={{ padding: "64px 12px 16px", minHeight: 120 }}>
          <div className="formula-box"><Formula f={preview} size="lg" /></div>
        </div>
        <div>
          <label className="lbl" htmlFor="ed-n">Adı</label>
          <input id="ed-n" className="input" value={f.n} onChange={(e) => set("n", e.target.value)} placeholder="ör. Üçgende iç teğet yarıçapı" />
        </div>
        <div className="row wrap" style={{ gap: 4 }}>
          {SNIPPETS.map(([snip, show]) => (
            <button key={snip} type="button" className="chip" style={{ padding: "5px 9px" }} onMouseDown={(e) => e.preventDefault()} onClick={() => insert(snip)}><Tex tex={show} /></button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 84px 1fr", gap: 8, alignItems: "end" }}>
          <div><label className="lbl" htmlFor="ed-l">Sol taraf (LaTeX)</label><input id="ed-l" className="input mono" value={f.l} onFocus={() => setFocus("l")} onChange={(e) => set("l", e.target.value)} placeholder="a^2+b^2" /></div>
          <div>
            <label className="lbl" htmlFor="ed-o">Bağıntı</label>
            <select id="ed-o" className="input" value={f.o} onChange={(e) => set("o", e.target.value)}>
              {[["=", "="], ["\\Rightarrow", "⇒"], ["\\iff", "⇔"], ["\\le", "≤"], ["\\ge", "≥"], ["\\approx", "≈"], [":", ":"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div><label className="lbl" htmlFor="ed-r">Sağ taraf (cevap)</label><input id="ed-r" className="input mono" value={f.r} onFocus={() => setFocus("r")} onChange={(e) => set("r", e.target.value)} placeholder="c^2" /></div>
        </div>
        <div><label className="lbl" htmlFor="ed-k">Şart / tanımlar (isteğe bağlı, $..$ ile formül)</label><input id="ed-k" className="input" value={f.k} onChange={(e) => set("k", e.target.value)} placeholder="$c$: hipotenüs" /></div>
        <div><label className="lbl" htmlFor="ed-w">Açıklama (isteğe bağlı)</label><input id="ed-w" className="input" value={f.w} onChange={(e) => set("w", e.target.value)} /></div>
        <div><label className="lbl" htmlFor="ed-h">Hafıza kancası (isteğe bağlı)</label><input id="ed-h" className="input" value={f.h} onChange={(e) => set("h", e.target.value)} placeholder="Kısa, akılda kalan bir cümle" /></div>
        <div>
          <label className="lbl">Tuzak şıklar (yaygın hatalar, isteğe bağlı)</label>
          <div className="stack-sm">
            {[0, 1, 2].map((i) => (
              <input key={i} id={`ed-x${i}`} className="input mono" value={f.x[i] || ""} onFocus={() => setFocus("x" + i)} onChange={(e) => { const x = [...f.x]; x[i] = e.target.value; set("x", x); }} placeholder={`Yanlış cevap ${i + 1}`} />
            ))}
          </div>
        </div>
        <button className="btn primary lg block" disabled={!valid} onClick={() => onSave({ ...f, x: f.x.map((s) => s.trim()).filter(Boolean) })}>
          <Check size={18} /> {initial ? "Kaydet" : "Kaydet ve öğrenme listesine ekle"}
        </button>
      </div>
    </Sheet>
  );
}
