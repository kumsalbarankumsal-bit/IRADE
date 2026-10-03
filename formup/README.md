# FormUp v2: formülleri unutmadan öğren

IB Math AA SL’ye hazırlanan, ama matematikle arası hiç iyi olmayan biri için yapılmış,
tek dosyalık bir web uygulaması. WordUp’ın matematik sürümü gibi düşünebilirsin: her formülü
**tam unutmak üzereyken** yeniden sorar. Her kart **iki dilli**: Türkçesi anlaman için,
İngilizcesi sınavda tanıman için.

**Çalıştırmak için:** `dist/index.html` dosyasını tarayıcıda aç (React ve KaTeX cdnjs’ten yüklenir).

## İçerik

Yol üç bölümden oluşuyor:

| Bölüm | Ne var? |
| --- | --- |
| **1 · Sıfırdan Temel** | Sayılar ve işlemler, bölünebilme kuralları ve asallar, kesirler, ondalık-yüzde-oran, üsler ve kökler, cebir ve denklemler, temel geometri, koordinat ve grafikler. IB’ye başlamadan önce gereken her şey. |
| **2 · IB Formül Kitapçığı** | Math AA SL formül kitapçığındaki formüllerin tamamı, kitapçıktaki bölüm numaralarıyla (1.2, 2.1 …) ve “ön bilgi” (prior learning) kısmı. |
| **3 · Kitapçıkta Yok, Ama Şart** | Sınavda verilmeyen, ezberlemen gereken AA SL kuralları. |

Her kartta: formül, Türkçe ve İngilizce adı, ne işe yaradığı, ne zaman kullanılacağı,
sık yapılan 3 hata (tuzak şıklar), el yazısıyla bir hafıza kancası, İngilizce terimler sözlüğü,
çoğunda sayılarla oynanabilen **canlı hesap**, sayısal soru üreteci ve senaryo sorusu
(“bu durumda hangi formül?”).

**22 etkileşimli laboratuvar**: sayı doğrusu, bölünebilme, kesir, yüzde, üsler, Pisagor,
dik üçgende trigonometri, birim çember, doğru, parabol, diziler, faiz, üstel/logaritma,
dönüşümler, sinüs dalgası, çember, teğet, alan (integral), normal dağılım, binom, Venn, kutu grafiği.
Kaydırıcıyı oynat, formülün neden öyle olduğunu gör.

## Nasıl çalışır?

| | |
| --- | --- |
| **Yol** | Duolingo tarzı bir uzay rotası. Her durak 3–4 formüllük bir ders; ünite sonunda taç sınavı. Bildiğin üniteyi kısa bir sınavla atlayabilirsin. |
| **Ders** | Tanış → doğru formülü seç / doğru mu? → boşlukları doldur → hatırla. Araya senaryo sorusu ve İngilizce terim sorusu girer. Yanlışlar kısa bir “tekrar bak” ile dersin içinde yeniden gelir. “Zaten biliyorum” dersen tek soruyla kanıtlarsın. |
| **Gökyüzü** | Her formül bir yıldız. Parlaklığı, o formülü şu an hatırlama olasılığın. Tekrar etmezsen yıldız söner. |
| **Tekrar** | Zamanlama **FSRS** algoritmasıyla: her formülün hafıza stabilitesi ve zorluğu tahmin edilir. Hafıza güçlendikçe sorular zorlaşır: tanıma → hatırlama → gerçek bir soruda uygulama. |
| **Kitapçık** | IB kitapçığının iki dilli, açıklamalı hâli; ayrıca “Ezber” (kitapçıkta olmayanlar), “Temel” ve aranabilir bir **sözlük**. |
| **Oyun** | Hız Turu, Hangi Formül?, Terim Avı, Eşleştir, Tuzak Avı, Sayı Atölyesi. Oyunda yanlış yaptığın formüller tekrar listende öne alınır. |
| **Profil** | Matematikçi rütbeleri (Harezmî → Cahit Arf → Ramanujan), ısı haritası, 7 günlük tekrar tahmini, rozetler, Pi’nin gardırobu, ayarlar ve yedek. |

Seni içine çeken küçük şeyler: maskot **Pi** (ruh hâli değişir, kıyafet giyer), günlük hedef ve
görevler, görev sandığı, **yıldız tozu (✦)** ekonomisi, seri ve seri dondurucu, kombo alevi,
doğru cevapta kıvılcım, büyük anlarda sembol yağmuru, ses ve titreşim, gece/gündüz teması,
her yerde açılıp kapanabilen İngilizce satırlar (üst çubuktaki **EN**).

## Kayıt

1. claude.ai Artifact olarak açıldığında `db` yeteneğiyle hesaba kaydedilir (cihazlar arası senkron).
2. Claude sohbet artifact’inde `window.storage` kullanılır.
3. Her durumda tarayıcıda `localStorage` kopyası tutulur. Profil → Yedek ile metin olarak dışa/içe aktarılabilir.

## Geliştirme

```bash
npm install
npm run build     # dist/index.html ve dist/formup.artifact.html (+ src/labs/index.js, src/data/v2/chunks.js üretir)
npm run check     # içerik doğrulayıcı
npm test          # içerik, ayrıştırıcı, FSRS, yol/ders/sınav mantığı, seçenek üreticileri, cevap kontrolü
npm run smoke     # gerçek Chromium’da baştan sona kullanım + ekran görüntüleri (dist/shots)
npm run lab -- <lab-id>   # tek bir laboratuvarın koyu/açık ekran görüntüsü
```

`scripts/check-v2.mjs` her kart için şunları denetler: zorunlu alanlar (TR + EN), KaTeX derlemesi,
3 tuzak şıkkın gerçekten farklı olması, boşluk doldurmanın formülü yeniden kurması, canlı hesabın ve
şablonun çalışması, sayısal soru üreteçlerinin 200 denemede tutarlı soru/cevap üretmesi, laboratuvar
adlarının geçerliliği ve `V` satırlarıyla formülün rastgele noktalarda **sayısal olarak doğru**,
tuzakların ise **yanlış** olması.

### Dosyalar

- `content/SPEC.md` — kart biçiminin tanımı; `content/LABS.md` — laboratuvar kuralları
- `src/data/v2/c-*.js` — içerik (ünite ünite kartlar + sayısal soru üreteçleri)
- `src/data/v2/units.js`, `index.js`, `parse.js`, `meta.js` — üniteler, yol, ayrıştırıcı, rütbe/rozet/görevler
- `src/lib/fsrs.js` — FSRS zamanlayıcısı; `src/lib/learn.js` — yol, ders/tekrar/sınav planları, ekonomi
- `src/labs/*.jsx` — laboratuvarlar (`kit.jsx`: ortak çizim ve kontrol bileşenleri)
- `src/ui/*` — ekranlar (Yol, Gökyüzü, Kitapçık, Oyun, Profil, Ders, Formül ayrıntısı, Karşılama, Pi)
