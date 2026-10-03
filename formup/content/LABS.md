# FormUp v2 — Etkileşimli laboratuvarlar

Laboratuvarlar, matematikten korkan bir öğrencinin formülü **oynayarak** anlamasını sağlar: kaydırıcıyı oynatır,
şekil anında değişir, formülde sayılar yerine konmuş hâliyle sonuç görünür. Her laboratuvar kendi dosyasıdır:
`src/labs/<id>.jsx`, `export default function XLab({ card }) {...}` (`card` isteğe bağlı, yok sayılabilir).

## Kurallar

- **Yalnızca** `src/labs/kit.jsx` yapı taşlarını ve React’i kullan (`import React, { useState, useMemo } from "react"`). Başka paket yok.
  - `LabShell({ title, titleEn, hint, hintEn })` — çerçeve. Başlık ve ipucu **Türkçe + İngilizce**.
  - `Slider({ tex, label, labelEn, value, min, max, step, onChange, fmt, color })`
  - `Plot({ xMin, xMax, yMin, yMax, width=340, height=240, xStep, yStep, xLabel, yLabel, label })` + çocuklar:
    `Curve({ f, from, to, color, dashed })`, `Area({ f, g, from, to, color, opacity })`, `Segment({ x1,y1,x2,y2,color,dashed })`,
    `Polygon({ points:[[x,y]...], color, fillOpacity })`, `Point({ x, y, color, label, draggable, onDrag(x,y), snap })`,
    `Label({ x, y, children, color, dx, dy, size, anchor })`. Kendi SVG öğelerini de çizebilirsin: `const { sx, sy } = usePlot()` (matematik → piksel).
  - `Readout({ items:[{ label, labelEn, tex | value, color }] })`, `LiveTex({ tex })` (sayılar yerine konmuş formül), `Choice({ options:[{value,label|tex}], value, onChange })`, `NumberInput({ value, onChange, label, labelEn })`
  - `nf(v, d)` Türkçe sayı ("2,5"), `tn(v, d)` TeX sayısı ("2{,}5"). TeX için `Tex` bileşeni: `import { Tex } from "../lib/tex.jsx"`.
- Renkler **yalnızca** tema değişkenleri: `var(--gold)`, `var(--coral)`, `var(--mint)`, `var(--sky)`, `var(--violet)`, `var(--ink)`, `var(--ink-2)`, `var(--ink-3)`, `var(--line)`, `var(--surface-2)`, `var(--plot-bg)`. Sabit renk yazma (iki tema var: gece ve gündüz).
- Telefon genişliğinde (390px) taşma olmamalı. Grafik varsayılan 340×240 viewBox, CSS ile genişliğe uyar.
- Her laboratuvarda en az: bir görsel (Plot ya da kendi SVG’n), 1–4 kaydırıcı/seçim, bir `LiveTex` (formül sayılarla) ve bir `Readout`. Sonuç değerleri gerçek zamanlı güncellenmeli.
- Etiketler iki dilde (ör. label "eğim" labelEn "gradient"). Kısa ve sade.
- Matematik **doğru** olmalı (ör. normal dağılım olasılığı için erf yaklaşımı yaz; binom olasılıkları kesin).
- Erişilebilirlik: `Plot`’a anlamlı `label` ver.
- Bitirince her laboratuvar için çalıştır: `node scripts/lab-preview.mjs <id>` → çıktıdaki iki PNG’yi **Read aracıyla aç ve bak** (gece ve gündüz). Taşma, okunmayan yazı, üst üste binen etiket, hatalı çizim varsa düzelt ve tekrar bak. Konsol hatası olmamalı.
- Örnek: `src/labs/_demo.jsx`.

## Laboratuvarlar

| id | Ne gösterir |
|---|---|
| `numberline` | Sayı doğrusu. `a`, `b` kaydırıcıları (−10…10), işlem seçimi (+, −, ×, ÷ yerine sadece +, −, ×). Toplama/çıkarma ok ile zıplama olarak; çarpmada işaret kuralı vurgusu. Mutlak değer: `|a|` sıfıra uzaklık olarak çizgiyle. Okumalar: sonuç, işaret kuralı (ör. “(−)·(−) = +”). |
| `divisibility` | Sayı girişi (varsayılan 7425). 2, 3, 4, 5, 6, 8, 9, 10, 11 için ✓/✗ ve **neden** (rakam toplamı = …, son iki basamak = …, sağdan +−+− toplamı = …). Altta asal çarpanlara ayırma (ör. 7425 = 3³·5²·11). 10 milyona kadar sayılar. |
| `fraction` | İki kesir (pay 0–12, payda 1–12) ve işlem (+, −, ×, ÷). Her kesir için bölünmüş çubuk modeli; sonuç sadeleştirilmiş kesir + ondalık; toplama/çıkarmada ortak payda adımı `LiveTex` ile. |
| `percent` | `N` ve `p%` kaydırıcıları; mod: “N’nin %p’si”, “%p artış”, “%p azalış”. 10×10 kare ızgarada p kare boyalı; çarpan (1 ± p/100) ve sonuç. |
| `power` | Taban `a` (2–5), üsler `m`, `n` (0–5). Kural seçimi: çarpma, bölme, üssün üssü, negatif üs, sıfır üs. Görsel: `a`’ların sıra sıra kutucukları (ör. 2³·2² = 5 tane 2). Sonuç değeri. |
| `pythagoras` | `a`, `b` kaydırıcıları; dik üçgen ve her kenar üzerinde kare (alanları a², b², c² yazılı). c = √(a²+b²). |
| `trigtriangle` | Açı θ (5°–85°) ve hipotenüs; dik üçgende karşı/opposite, komşu/adjacent, hipotenüs/hypotenuse etiketli. sin, cos, tan oranları ve değerleri; SOH-CAH-TOA. |
| `unitcircle` | Açı θ (0°–360°) kaydırıcısı; radyan karşılığı (güzel değerlerde π’nin katı olarak). Birim çemberde nokta (cos θ, sin θ), izdüşümler; sin, cos, tan okumaları; bölge işaretleri (ASTC). |
| `line` | İki **sürüklenebilir** nokta; doğrusu; yükseliş/koşu (rise/run) üçgeni; eğim m, y-kesişimi c ve `y = mx + c` canlı. Dikey doğruda eğimin tanımsız olduğunu göster. |
| `parabola` | `a`, `b`, `c` kaydırıcıları; parabol, tepe noktası, simetri ekseni `x = −b/(2a)` (kesikli), kökler; Δ ve kök durumu (iki/bir/yok) iki dilde. a = 0 olmasın (adımlar 0’ı atlasın ya da uyarı ver). |
| `sequence` | Aritmetik/geometrik seçimi; `u₁`, `d` ya da `r`, `n`. İlk n terim sütun grafiği; `u_n`, `S_n`; geometrikte |r|<1 iken `S_∞`. |
| `interest` | PV, r%, k (1, 2, 4, 12), n yıl. Yıllara göre FV eğrisi (bileşik), basit faiz kesikli karşılaştırma; FV ve kazanılan faiz. Formül: FV = PV(1 + r/(100k))^{kn}. |
| `explog` | Taban `a` (0,2–5; 1 hariç). y = aˣ, y = logₐx ve y = x (kesikli ayna). (0,1) ve (1,0) noktaları, asimptotlar. |
| `transform` | Temel fonksiyon seçimi (x², |x|, sin x, √x). y = a·f(b(x − h)) + k için a, b, h, k kaydırıcıları; temel grafik kesikli, dönüşmüş grafik altın; her dönüşümün iki dilde açıklaması. |
| `sinewave` | y = a sin(b(x + c)) + d; genlik |a|, periyot 2π/b, ana eksen y = d (kesikli) gösterilir; x ekseni π cinsinden. |
| `circle` | Yarıçap r ve açı θ (radyan, 0–2π; derece karşılığı da). Daire dilimi boyalı, yay vurgulu; yay uzunluğu rθ ve dilim alanı ½r²θ. |
| `tangent` | Fonksiyon seçimi (x², x³ − 3x, sin x, eˣ, ln x). x₀ kaydırıcısı (ya da sürüklenebilir nokta). Teğet doğrusu; f(x₀), f′(x₀) (eğim) ve teğet denklemi; f′ grafiği soluk. |
| `area` | Fonksiyon seçimi; a, b ve dikdörtgen sayısı n. Eğri altındaki alan boyalı, Riemann dikdörtgenleri; kesin integral ile Riemann toplamı karşılaştırma; eksen altındaki kısmı farklı renk (∫|y| farkı). |
| `normal` | μ, σ ve x kaydırıcıları; normal eğri; P(X < x) boyalı; z = (x − μ)/σ ve olasılık; %68–95–99,7 bantları seçeneği. |
| `binomial` | n (1–20), p (0–1). P(X = k) sütunları; E(X) = np dikey çizgi; Var(X) = np(1 − p). Bir k seçip P(X = k) değeri. |
| `venn` | P(A), P(B), P(A ∩ B) kaydırıcıları (tutarlı sınırlarla). Venn diyagramı; P(A ∪ B), P(A′), P(A | B); bağımsız mı? (P(A∩B) ≈ P(A)P(B)), ayrık mı? (P(A∩B) = 0). |
| `boxplot` | Hazır veri kümesi + “en büyük değer” kaydırıcısı (aykırı değer yaratmak için). Q₁, medyan, Q₃, IQR, 1,5×IQR sınırları; kutu-bıyık çizimi, aykırı değerler nokta olarak. |
