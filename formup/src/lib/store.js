/* Kalıcılık katmanı — üç arka uç, en iyisi önce:
   1) claude.ai artifact "db" yeteneği: kişiye özel, cihazlar arası senkron
      (data/users/<id>/state belgesi)
   2) window.storage: Claude sohbet artifact'lerindeki kalıcı depo
   3) localStorage: tarayıcıya özel yerel kopya (her zaman yazılır, en hızlısı)

   Açılışta yerel kopya hemen okunur; bulut kopyası gelince hangisi
   daha yeniyse (updatedAt) o kullanılır. */

const KEY = "formup-state-v1";

export function readLocal() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
export function writeLocal(state) {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; }
}
export function clearLocal() {
  try { window.localStorage.removeItem(KEY); } catch (e) { /* yoksay */ }
}

/** Bulut arka ucu: { kind, load(), save(state) } ya da null */
export async function connectRemote() {
  // 1) claude.ai artifact yetenekleri
  try {
    if (typeof window !== "undefined" && window.claude && typeof window.claude.use === "function") {
      const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
      const uid = db && user && (await user.id());
      if (db && uid) {
        const ref = db.doc(`data/users/${uid}/state`);
        return {
          kind: "cloud",
          async load() {
            const snap = await ref.get();
            if (!snap.exists) return null;
            const body = snap.data();
            return body && body.json ? JSON.parse(body.json) : null;
          },
          async save(state) {
            await ref.set({ json: JSON.stringify(state), at: state.updatedAt || Date.now() });
          },
        };
      }
    }
  } catch (e) { /* bir sonraki arka uca geç */ }

  // 2) Claude sohbet artifact deposu
  try {
    if (typeof window !== "undefined" && window.storage && typeof window.storage.get === "function") {
      return {
        kind: "storage",
        async load() {
          try {
            const r = await window.storage.get(KEY);
            return r && r.value ? JSON.parse(r.value) : null;
          } catch (e) { return null; }
        },
        async save(state) { await window.storage.set(KEY, JSON.stringify(state)); },
      };
    }
  } catch (e) { /* yerel kopyayla devam */ }
  return null;
}

/** Aynı anda tek yazım; arka arkaya gelenler son hâle birleşir. */
export function makeSaver(remote, onStatus) {
  let pending = null, busy = false, timer = null;
  async function flush() {
    if (busy || !pending) return;
    busy = true;
    const s = pending; pending = null;
    try { await remote.save(s); onStatus && onStatus("ok", Date.now()); }
    catch (e) { onStatus && onStatus("error", Date.now()); }
    busy = false;
    if (pending) flush();
  }
  return (state) => {
    pending = state;
    clearTimeout(timer);
    timer = setTimeout(flush, 1500);
  };
}
