# FormUp v2 — içerik yazım kılavuzu (kart biçimi + pedagoji)

## Kim için yazıyoruz?

Öğrenci Türk, IB Diploma Programı'nda **Mathematics: Analysis and Approaches SL** alıyor.
Matematik temeli **çok zayıf** ("bölünebilme kurallarını bile bilmiyorum") ve matematiği **sevmiyor**.
Her kart:

- **Türkçe ile anlatmalı** (anlaması için), **İngilizce terimi ve İngilizce özeti** de vermeli (IB sınavı İngilizce olduğu için bilmesi gerekiyor). İki dil her zaman birlikte gösterilir.
- Korkutmamalı: kısa cümleler, günlük dil, somut sayılar. "Açıkça görülür ki" gibi ifadeler yok.
- Tek bir fikir öğretmeli. Büyük formülleri parçalara böl (ör. kosinüs teoreminin iki biçimi ayrı kartlar).
- Doğru olmalı. IB gösterimine uy: dizilerde `u_n`, `u_1`; kombinasyon `{}^{n}C_{r}` ya da `\binom{n}{r}`; olasılıkta `\mathrm{P}(A)`, `n(A)`, `n(U)`; doğal log `\ln`; türev `\dfrac{dy}{dx}` ve `f'(x)`; integral sabiti `C`.

## Dosya biçimi

Her parça (chunk) bir dosyadır: `src/data/v2/c-<parca>.js`

```js
import { ri, pick, fr, int, sgn, num, gcd, fact, nCr } from "./genkit.js";

export const CARDS = String.raw`
## <unite-id>

# <unite-id>-<kisa-ad> | <öncelik 1-3> | <Türkçe ad> | <English name>
L ...
...
`;

export const GEN = {
  <parca>_<ad>: (r) => ({ q: "...", qe: "...", ...int(42) }),
};
```

- `String.raw` içinde ters bölüler **tek** yazılır (`\dfrac`, `\sqrt`).
- `String.raw` içinde **asla** ters tırnak (backtick) ya da `${` kullanma (`$` ardından hemen `{` gelmesin: `${n}` yerine `$n$`, `$\{1,2\}$` yerine `$\lbrace 1,2\rbrace$`).
- `GEN` anahtarları dosya adının parça kısmıyla başlar: `c-fnum.js` → `fnum_toplama`.

## Kart alanları

Kart başlığı: `# id | öncelik | Türkçe ad | English name`
- `id`: `<unite-id>-` ile başlar, küçük harf, tire ile (`f-div-3`, `b1-arith-nth`). Benzersiz.
- öncelik: 3 = mutlaka bilinmeli / sık kullanılır, 2 = önemli, 1 = ek.
- Adlarda TeX gerekiyorsa `$...$` kullan (ör. `$\sin 30^\circ$ değeri`).

Kartlar dosyada **öğretme sırasıyla** yazılır (kolaydan zora). Yoldaki dersler bu sırayla oluşur.

| Etiket | Zorunlu | İçerik |
|---|---|---|
| `L` | ✔ | Sol taraf. TeX. Metin gerekiyorsa `~` ile başla: `~$n$ sayısı 3’e bölünür` |
| `O` | | Bağıntı (TeX). Varsayılan `=`. Örn. `\iff`, `\Rightarrow`, `\le`, `\approx`. Tanım tipi kartlarda `:` |
| `R` | ✔ | Sağ taraf = **cevap**. TeX ya da `~metin` |
| `X` | ✔ | **Tam 3 tuzak**, `;;` ile ayrılır. Gerçek, yaygın öğrenci hataları olmalı; hiçbiri doğru cevaba denk olmamalı. R metinse tuzaklar da metin (`~`) olsun |
| `K` / `KE` | | Şart, değişkenlerin anlamı (Türkçe / English). Ör. `$r$: yarıçap` / `$r$: radius` |
| `U` / `UE` | ✔ | **Ne işe yarar?** Tek, sade cümle (TR / EN). Ör. “Bir dizinin istediğin terimini, tek tek saymadan bulur.” |
| `W` / `WE` | ✔ | **Neden?** Sezgi. TR en fazla 2–3 kısa cümle; EN 1–2 cümle |
| `E` | önerilir | Çözümlü kısa örnek (somut sayılarla), TR |
| `H` | önerilir | Hafıza kancası (eğlenceli, kısa, TR; İngilizce kısaltma da olabilir: SOH-CAH-TOA) |
| `T` | ✔ | İngilizce terim sözlüğü: `gradient = eğim ;; y-intercept = y eksenini kestiği nokta`. Her kartta 1–3 terim, IB’de geçen gerçek terimler |
| `Q` / `QE` | ✔ | **Hangi formül?** oyunu için kısa durum: bu formülün çözüm aracı olduğu gerçekçi bir problem cümlesi (formülü söyleme!). Ör. “Bir sinemada ilk sırada 20 koltuk var, her sıra 2 koltuk fazla. 15. sırada kaç koltuk var?” |
| `B` | önerilir | **Boşluk doldurma**: R’nin aynısı, 1–3 parçası `[[...]]` içinde; `||` sonrası `;;` ile 2–3 çeldirici. Kural: boşluklar doldurulunca metin R ile **birebir** aynı olmalı (boşluk karakterleri hariç). Yer değiştirince de doğru kalabilecek iki boşluk koyma (ör. `(a-b)(a+b)` içinde iki parantezi ayrı boşluk yapma) |
| `C` | önerilir | **Canlı hesap**: `ad=varsayılan:min:max:adım ; ...  => ifade`. İfade JS’dir; kullanılabilir: `sqrt sin cos tan asin acos atan ln log10 log(b,x) exp abs pow floor ceil round min max PI E fact nCr gcd lcm deg`. Açılar radyandır; derece için `sin(deg(x))`. `^` üs demektir |
| `CT` | C varsa ✔ | C için TeX şablonu: `@ad@` değişken yerine, `@=@` sonuç yerine yazılır. Ör. `u_{@n@}=@u_1@+(@n@-1)\cdot @d@=@=@` |
| `G` | önerilir | Bu dosyadaki `GEN` içinde bir üreteç anahtarı (aşağıya bak) |
| `LAB` | | Etkileşimli laboratuvar: `numberline divisibility fraction percent power pythagoras trigtriangle unitcircle line parabola sequence interest explog transform sinewave circle tangent area normal binomial venn boxplot` |
| `S` | | Kısa hikâye/tarih notu (TR), doğruluğundan emin değilsen yazma |
| `BK` | kitapçık ünitelerinde ✔ | IB kitapçığındaki bölüm numarası: `1.2`, `3.6`… Kitapçığın “Prior learning” kısmı için `0.0` |
| `V` | uygunsa | Sayısal doğrulama: `a,b` (0.3–3 arası rastgele), `x:-3:3`, `n:int:1:20`, `bool:p,q`, sabit eşitlik için `-`. L ve R yalnızca değişken içeren hesaplanabilir TeX ise ekle (özdeşlikler, türevler `(\sin x)'`, toplamlar). Doğrulayıcı tuzakların yanlış olduğunu da kanıtlar |

## Üreteçler (G)

```js
export const GEN = {
  fdiv_bolen: (r) => {
    const n = ri(r, 12, 99);
    return { q: `$${n}$ sayısı ...?`, qe: `Is $${n}$ ...?`, ...int(cevap) };
  },
};
```
- Sözleşme: `(r) => ({ q, qe, a, tex, unit? })`. `q` Türkçe, `qe` İngilizce soru. `a` sayısal cevap; `tex` gösterimi.
- Yardımcılar (`genkit.js`): `ri(r,a,b)` tam sayı, `pick(r,dizi)`, `fr(p,q)` sadeleştirilmiş kesir cevabı, `int(v)` sayı cevabı, `sgn(v)` "+3"/"-3", `num(v)` TeX ondalık, `gcd`, `fact`, `nCr`.
- Cevaplar kullanıcıya klavyeden girilir: tam sayı, ondalık (`0,5`) ya da kesir (`3/4`). Kök, π içeren cevap isteme; “cevap $k\pi$ ise $k$ kaç?” biçiminde sor. Evet/hayır sorularını 1/0 olarak sorma; sayı iste.
- Sayılar küçük ve hesap makinesiz yapılabilir olsun (öğrenci zayıf). 200 denemede hep geçerli soru üretmeli.

## Örnek kart

```
## b1

# b1-arith-nth | 3 | Aritmetik dizinin n. terimi | The nth term of an arithmetic sequence
L u_n
R u_1+(n-1)\,d
X u_1+n\,d ;; u_1\cdot d^{\,n-1} ;; n\,u_1+d
K $u_1$: ilk terim, $d$: ortak fark (her adımda eklenen sayı)
KE $u_1$: first term, $d$: common difference
U Bir dizinin istediğin terimini, tek tek saymadan bulur.
UE Finds any term of the sequence without listing them all.
W İlk terimden $n$. terime giderken $n-1$ adım atarsın; her adımda $d$ eklenir.
WE From the first term to the nth you take n − 1 steps, adding d each time.
E $u_1=4$, $d=3$ ise $u_{10}=4+9\cdot 3=31$.
H İlk terim + (adım sayısı) × fark.
T arithmetic sequence = aritmetik dizi ;; common difference = ortak fark ;; nth term = n. terim
Q Bir sinemada ilk sırada 20 koltuk var ve her sıra öncekinden 2 koltuk fazla. 15. sırada kaç koltuk var?
QE A cinema has 20 seats in the first row and each row has 2 more seats than the one before. How many seats are in row 15?
B [[u_1]]+([[n-1]])\,[[d]] || u_n ;; n+1 ;; r
C u_1=4:-10:20:1 ; n=10:1:30:1 ; d=3:-5:5:0.5 => u_1+(n-1)*d
CT u_{@n@}=@u_1@+(@n@-1)\cdot @d@=@=@
G b1_nth
LAB sequence
BK 1.2
```

(Bu kartta `V` yok: sol taraf `u_n` tek başına hesaplanamaz. `V`, ör. `L a^2-b^2` / `R (a-b)(a+b)` gibi iki tarafı da hesaplanabilen kartlar içindir.)

## Kalite listesi (yazdıktan sonra kendin kontrol et)

1. `node scripts/check-v2.mjs src/data/v2/c-<parca>.js` hatasız geçmeli (uyarıları da düzelt).
2. Her formül matematiksel olarak doğru; şartlar (ör. $a\ne 0$, $r\ne 1$, $|r|<1$) eksiksiz.
3. Tuzaklar gerçekten yanlış ve **makul** (öğrencinin yapabileceği hatalar).
4. İngilizce terimler IB’nin kullandığı terimler (gradient, intercept, discriminant, axis of symmetry, common ratio, sector, arc, standardized normal variable…).
5. Türkçe metinler sade ve doğru Türkçe (ı/i, ş, ğ doğru).
6. `Q` durumları formülü ele vermesin ama formül olmadan çözülmesin.
