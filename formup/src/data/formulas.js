/* Formül veritabanı.

   Veriler okunabilir olsun diye küçük bir satır biçimiyle yazılır
   (String.raw içinde ters bölüler tek yazılır):

     ## konu-id                 → bundan sonraki kartların konusu
     # kart-id | öncelik | Ad   → yeni kart (öncelik 1–3; 3 = sınavda çok sık)
     L sol taraf               (TeX; "~" ile başlarsa $..$ içeren düz metin)
     O bağıntı                 (TeX, varsayılan "="; ":" ise iki nokta)
     R sağ taraf               (cevap; TeX veya "~metin")
     X tuzak1 ;; tuzak2 ;; tuzak3   (yaygın hatalar)
     K koşul / tanımlar        (metin)
     W neden / sezgi           (metin)
     E örnek                   (metin)
     H hafıza kancası          (metin, el yazısıyla gösterilir)
     S hikâye                  (metin)
     G sayısal soru üreteci    (generators.js anahtarı)
     V doğrulama değişkenleri  (yalnızca testlerde kullanılır)
*/
import TYT from "./f-tyt.js";
import AYT from "./f-ayt.js";
import GEO from "./f-geo.js";
import UNI from "./f-uni.js";
import { TOPIC } from "./topics.js";

const FIELD = { L: "l", O: "o", R: "r", K: "k", W: "w", E: "e", H: "h", S: "s", G: "g", V: "v" };

export function parseFormulas(src) {
  const out = [];
  let topic = null;
  let cur = null;
  for (const raw of src.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("//")) continue;
    if (line.startsWith("## ")) { topic = line.slice(3).trim(); continue; }
    if (line.startsWith("# ")) {
      const [id, p, ...name] = line.slice(2).split("|").map((s) => s.trim());
      cur = { id, t: topic, p: Number(p) || 1, n: name.join("|"), o: "=", x: [] };
      out.push(cur);
      continue;
    }
    if (!cur) continue;
    const tag = line[0];
    const val = line.slice(2).trim();
    if (tag === "X") cur.x = val.split(";;").map((s) => s.trim()).filter(Boolean);
    else if (FIELD[tag]) cur[FIELD[tag]] = val;
  }
  return out;
}

export const FORMULAS = [TYT, AYT, GEO, UNI].flatMap(parseFormulas);

/* Sabit sıralama: öncelik → seviye sırası → konu sırası → yazım sırası.
   Bu sıra Keşfet’te “#12” gibi önem sırası olarak gösterilir. */
const LV_ORDER = { tyt: 0, ayt: 1, geo: 2, uni: 3 };
const TOPIC_ORDER = Object.fromEntries(Object.keys(TOPIC).map((k, i) => [k, i]));
FORMULAS.forEach((f, i) => { f.i = i; f.lv = TOPIC[f.t] ? TOPIC[f.t].lv : "custom"; });

export function rankOrder(list) {
  return [...list].sort((a, b) =>
    b.p - a.p ||
    (LV_ORDER[a.lv] ?? 9) - (LV_ORDER[b.lv] ?? 9) ||
    (TOPIC_ORDER[a.t] ?? 99) - (TOPIC_ORDER[b.t] ?? 99) ||
    a.i - b.i);
}

export const RANKED = rankOrder(FORMULAS);
RANKED.forEach((f, i) => { f.rank = i + 1; });
