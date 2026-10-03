# FormUp — matematik formülleri için aralıklı tekrar

Kelime uygulaması WordUp’ın mantığını matematik formüllerine taşıyan, tek dosyalık bir web uygulaması.
Formülleri sınavdaki önemine göre sıralı kartlarla keşfedersin; bilmediklerini öğrenme listene
toplarsın; uygulama her formülü tam unutmak üzereyken yeniden sorar.

**Çalıştırmak için:** `dist/index.html` dosyasını tarayıcıda aç (React ve KaTeX cdnjs’ten yüklenir).

## İçerik

- **422 formül**, 29 konu, 4 seviye: TYT, AYT, Geometri, Üniversite (kalkülüs, lineer cebir, olasılık–istatistik).
- Her formülde: sol taraf / bağıntı / sağ taraf, **3 tuzak şık** (en sık yapılan hatalar), şart ve tanımlar,
  “neden” açıklaması, çözümlü örnek, el yazısıyla **hafıza kancası** ve ünlü formüller için kısa **hikâye**.
- **100 sayısal soru üreteci**: formülü gerçek bir soruda kullandıran, her seferinde yeni sayılar üreten sorular.

## Nasıl çalışır?

| Adım | Ne olur |
| --- | --- |
| **Keşfet** | Kartı sağa kaydır: öğren. Sola kaydır: “biliyorum”, ardından tek soruluk kanıt. Kanıtlarsan formül uzun aralıklı kontrole alınır. |
| **Öğren** | 5 formüllük dersler: tanıt → doğru formülü seç → kartı çevirip hatırla. Hatalı cevaplar dersin sonuna yeniden eklenir. |
| **Tekrar** | Zamanlama **FSRS-5** algoritmasıyla yapılır: her formül için hafıza stabilitesi ve zorluk tahmin edilir; hatırlama olasılığı hedefin (varsayılan %90) altına düşmek üzereyken soru gelir. |
| **Zorlaşan sorular** | Hafıza güçlendikçe soru türü değişir: önce tanıma (çoktan seçmeli, doğru/yanlış), sonra hatırlama (kart çevirme), en sonunda uygulama (sayısal soru). |

Ek olarak: hafıza haritası (her formül bir kare, rengi hafıza seviyesini gösterir), formül başına
**unutma eğrisi**, zayıf halkalar için odak turu, konu testleri, günlük seri ve dondurma hakkı,
matematikçi isimli rütbeler (Harezmî → Cahit Arf → Ramanujan), 20 rozet, kendi formülünü LaTeX ile ekleme,
yedek alma/geri yükleme, “Defter” (gündüz) ve “Tahta” (gece) temaları.

**Arena** oyunları: Hız Turu (60 sn doğru/yanlış), Eşleştir, Tuzak Avı, Sayı Atölyesi.
Oyunlarda yanlış yapılan formüller tekrar listesinde öne alınır.

## Kayıt

1. claude.ai Artifact olarak açıldığında `db` yeteneğiyle hesaba kaydedilir (cihazlar arası senkron).
2. Claude sohbet artifact’inde `window.storage` kullanılır.
3. Her durumda tarayıcıda `localStorage` kopyası tutulur.

## Geliştirme

```bash
npm install
npm run build     # dist/index.html ve dist/formup.artifact.html
npm test          # veri bütünlüğü, KaTeX derlemesi, sayısal doğrulama, FSRS ve uygulama mantığı
npm run smoke     # gerçek Chromium’da uçtan uca akış + ekran görüntüleri (dist/shots)
```

`scripts/verify-math.mjs`, küçük bir LaTeX değerlendiricisiyle 108 özdeşliği rastgele noktalarda sınar
ve 321 tuzak şıkkın gerçekten yanlış olduğunu kanıtlar.

### Dosyalar

- `src/data/f-*.js` — formül veritabanı (okunabilir satır biçimi, açıklaması `formulas.js` başında)
- `src/data/generators.js` — sayısal soru üreteçleri
- `src/lib/fsrs.js` — FSRS-5 zamanlayıcısı; `src/lib/srs.js` — dersler, mod seçimi, seri
- `src/ui/*` — ekranlar (Bugün, Keşfet, Harita, Arena, Profil, Oturum)
