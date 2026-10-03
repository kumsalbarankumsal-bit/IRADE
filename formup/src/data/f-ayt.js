/* AYT formülleri */
export default String.raw`
## ikinci

# ik-delta | 3 | Diskriminant
L \Delta
R b^2-4ac
X b^2+4ac ;; b^2-2ac ;; 4ac-b^2
K $ax^2+bx+c=0$ denkleminde
W Kök formülünde karekök içinde kalan ifadedir; köklerin varlığını o belirler.
E $x^2-5x+6=0$ için $\Delta=25-24=1$.
H Be kare eksi dört a ce.
G delta

# ik-kokler | 3 | Kök formülü
L x_{1,2}
R \dfrac{-b\pm\sqrt{\Delta}}{2a}
X \dfrac{b\pm\sqrt{\Delta}}{2a} ;; \dfrac{-b\pm\sqrt{\Delta}}{a} ;; -b\pm\dfrac{\sqrt{\Delta}}{2a}
K $ax^2+bx+c=0$, $\Delta\ge 0$
W Tam kareye tamamlama ile elde edilir: $\left(x+\tfrac{b}{2a}\right)^2=\tfrac{\Delta}{4a^2}$.
E $x^2-5x+6=0$: $x=\tfrac{5\pm 1}{2}$, yani $3$ ve $2$.
S İkinci derece denklemlerin sistematik çözümünü 9. yüzyılda Harezmî, “el-Cebr” kitabında verdi. “Cebir” ve “algoritma” kelimeleri ondan gelir.
G kokbul

# ik-toplam | 3 | Kökler toplamı (Vieta)
L x_1+x_2
R -\dfrac{b}{a}
X \dfrac{b}{a} ;; \dfrac{c}{a} ;; -\dfrac{c}{a}
W $a(x-x_1)(x-x_2)$ açılınca $x$’in katsayısı $-a(x_1+x_2)$ olur; bu $b$’ye eşittir.
E $2x^2-6x+1=0$ için $x_1+x_2=3$.
H Toplam: eksi be bölü a.
G koktoplam

# ik-carpim | 3 | Kökler çarpımı (Vieta)
L x_1\cdot x_2
R \dfrac{c}{a}
X -\dfrac{c}{a} ;; -\dfrac{b}{a} ;; \dfrac{a}{c}
W Açılımdaki sabit terim $a\,x_1x_2$’dir; bu $c$’ye eşittir.
E $2x^2-6x+1=0$ için $x_1x_2=\tfrac12$.
H Çarpım: ce bölü a.
G kokcarpim

# ik-fark | 2 | Kökler farkının mutlak değeri
L |x_1-x_2|
R \dfrac{\sqrt{\Delta}}{|a|}
X \dfrac{\sqrt{\Delta}}{2|a|} ;; \dfrac{\Delta}{|a|} ;; \sqrt{\Delta}
W Kök formülündeki iki kökü çıkarınca $\pm$ kısmı iki kez gelir: $\tfrac{2\sqrt\Delta}{2|a|}$.

# ik-terskok | 2 | Köklerin terslerinin toplamı
L \dfrac{1}{x_1}+\dfrac{1}{x_2}
R -\dfrac{b}{c}
X \dfrac{b}{c} ;; -\dfrac{c}{b} ;; \dfrac{a}{c}
W $\tfrac{x_1+x_2}{x_1x_2}=\tfrac{-b/a}{c/a}=-\tfrac bc$.

# ik-karetoplam | 2 | Köklerin kareleri toplamı
L x_1^2+x_2^2
R (x_1+x_2)^2-2x_1x_2
X (x_1+x_2)^2 ;; (x_1+x_2)^2+2x_1x_2 ;; (x_1-x_2)^2
E $x^2-3x-1=0$ için $9-2(-1)=11$.
V x_1:-3:3,x_2:-3:3

# ik-kurma | 3 | Kökleri bilinen denklemi kurma
L ~Kökleri $x_1$ ve $x_2$ olan denklem
O :
R x^2-(x_1+x_2)\,x+x_1x_2=0
X x^2+(x_1+x_2)\,x+x_1x_2=0 ;; x^2-x_1x_2\,x+(x_1+x_2)=0 ;; x^2-(x_1+x_2)\,x-x_1x_2=0
W $(x-x_1)(x-x_2)=0$ çarpımını aç.
E Kökleri 2 ve 5: $x^2-7x+10=0$.
H $x^2-Tx+\text{Ç}=0$: toplam ve çarpım.

# ik-durum | 3 | $\Delta>0$ durumu
L \Delta>0
O \Rightarrow
R ~İki farklı reel kök
X ~Çakışık (eşit) iki reel kök ;; ~Reel kök yok ;; ~Kökler zıt işaretli
W Karekök içi pozitif olduğu için $\pm$ iki farklı değer verir. Parabol $x$ eksenini iki noktada keser.

# ik-durum0 | 3 | $\Delta=0$ durumu
L \Delta=0
O \Rightarrow
R ~Çakışık (eşit) iki reel kök
X ~İki farklı reel kök ;; ~Reel kök yok ;; ~Kökler toplamı sıfır
W $\pm 0$ fark yaratmaz; parabol $x$ eksenine teğettir.

# ik-durumneg | 3 | $\Delta<0$ durumu
L \Delta<0
O \Rightarrow
R ~Reel kök yok (karmaşık eşlenik iki kök)
X ~İki farklı reel kök ;; ~Çakışık iki reel kök ;; ~Tek reel kök
W Negatif sayının reel karekökü yoktur; parabol $x$ eksenini kesmez.

# ik-tepe | 3 | Parabolün tepe apsisi
L r
R -\dfrac{b}{2a}
X \dfrac{b}{2a} ;; -\dfrac{b}{a} ;; -\dfrac{2a}{b}
K $f(x)=ax^2+bx+c$, tepe noktası $T(r,k)$
W Tepe, iki kökün tam ortasındadır: $\tfrac{x_1+x_2}{2}=-\tfrac{b}{2a}$. Simetri ekseni $x=r$’dir.
E $f(x)=x^2-6x+5$ için $r=3$, $k=f(3)=-4$.
G tepe

# ik-tepek | 2 | Parabolün tepe ordinatı
L k
R \dfrac{4ac-b^2}{4a}
X \dfrac{b^2-4ac}{4a} ;; \dfrac{4ac-b^2}{2a} ;; -\dfrac{\Delta}{2a}
K $k=f(r)$ ve $T(r,k)$ tepe noktası
W Pratikte $k=f(r)$ hesaplamak en kolayıdır; formül olarak $k=-\tfrac{\Delta}{4a}$.

# ik-tepeform | 2 | Tepe noktası biçimi
L f(x)
R a(x-r)^2+k
X a(x+r)^2+k ;; (x-r)^2+k ;; a(x-k)^2+r
K Tepe noktası $T(r,k)$
E Tepesi $(2,-1)$ olan ve $(0,3)$’ten geçen parabol: $f(x)=(x-2)^2-1$.

# ik-kollar | 2 | Parabolün kolları
L a>0
O \Rightarrow
R ~Kollar yukarı; tepe en küçük değer
X ~Kollar aşağı; tepe en büyük değer ;; ~Parabol $x$ eksenini kesmez ;; ~Tepe noktası orijindedir
W $a$’nın işareti parabolün yönünü, $|a|$ ise kolların darlığını belirler.

## karmasik

# kr-i | 3 | Sanal birim
L i^2
R -1
X 1 ;; i ;; -i
W Kuvvetler 4’lü döngü yapar: $i^1=i$, $i^2=-1$, $i^3=-i$, $i^4=1$.
H i, eksi bir, eksi i, bir; sonra başa dön.

# kr-ikuvvet | 2 | $i$’nin kuvvetleri
L i^{4n+k}
R i^{k}
X i^{n+k} ;; k\cdot i ;; i^{4n}
W $i^4=1$ olduğundan üssün 4’e bölümünden kalan yeterlidir.
E $i^{2026}=i^{2}=-1$ çünkü $2026=4\cdot 506+2$.
G ikuvvet

# kr-modul | 2 | Karmaşık sayının modülü
L |a+bi|
R \sqrt{a^2+b^2}
X a^2+b^2 ;; \sqrt{a^2-b^2} ;; |a|+|b|
W Karmaşık düzlemde orijine uzaklık; Pisagor teoremi.
E $|3-4i|=5$

# kr-eslenik | 2 | Sayı ile eşleniğinin çarpımı
L z\cdot\bar z
R |z|^2
X |z| ;; 2\,\mathrm{Re}(z) ;; z^2
K $z=a+bi$ ise $\bar z=a-bi$ ve $z\bar z=a^2+b^2$
E $(2+3i)(2-3i)=13$

# kr-esleniktop | 1 | Sayı ile eşleniğinin toplamı
L z+\bar z
R 2\,\mathrm{Re}(z)
X 2\,\mathrm{Im}(z) ;; 0 ;; |z|^2
W Sanal kısımlar birbirini götürür.

# kr-kutupsal | 1 | Kutupsal biçim
L z
R r(\cos\theta+i\sin\theta)
X r(\sin\theta+i\cos\theta) ;; r(\cos\theta-i\sin\theta) ;; \cos(r\theta)+i\sin(r\theta)
K $r=|z|$, $\theta=\arg z$
W Kısaca $r\,\mathrm{cis}\,\theta$ yazılır.

# kr-demoivre | 1 | De Moivre formülü
L [r(\cos\theta+i\sin\theta)]^n
R r^n(\cos n\theta+i\sin n\theta)
X r^n(\cos\theta^n+i\sin\theta^n) ;; n\,r(\cos n\theta+i\sin n\theta) ;; r^n(\cos\theta+i\sin\theta)
W Çarpmada modüller çarpılır, argümanlar toplanır; $n$. kuvvette açı $n$ katına çıkar.

## trig

# tr-dikSin | 3 | Dik üçgende sinüs
L \sin\alpha
R \dfrac{\text{karşı dik kenar}}{\text{hipotenüs}}
X \dfrac{\text{komşu dik kenar}}{\text{hipotenüs}} ;; \dfrac{\text{karşı dik kenar}}{\text{komşu dik kenar}} ;; \dfrac{\text{hipotenüs}}{\text{karşı dik kenar}}
H Sinüs: karşı bölü hipotenüs. Kosinüs: komşu bölü hipotenüs. Tanjant: karşı bölü komşu.

# tr-dikCos | 3 | Dik üçgende kosinüs
L \cos\alpha
R \dfrac{\text{komşu dik kenar}}{\text{hipotenüs}}
X \dfrac{\text{karşı dik kenar}}{\text{hipotenüs}} ;; \dfrac{\text{komşu dik kenar}}{\text{karşı dik kenar}} ;; \dfrac{\text{hipotenüs}}{\text{komşu dik kenar}}
H Kosinüs “ko”mşuyu sever.

# tr-dikTan | 3 | Dik üçgende tanjant
L \tan\alpha
R \dfrac{\text{karşı dik kenar}}{\text{komşu dik kenar}}
X \dfrac{\text{komşu dik kenar}}{\text{karşı dik kenar}} ;; \dfrac{\text{karşı dik kenar}}{\text{hipotenüs}} ;; \dfrac{\text{hipotenüs}}{\text{komşu dik kenar}}

# tr-sin30 | 3 | $\sin 30^\circ$
L \sin 30^\circ
R \dfrac{1}{2}
X \dfrac{\sqrt3}{2} ;; \dfrac{\sqrt2}{2} ;; 1
W Eşkenar üçgeni ortadan ikiye böl: 30° karşısındaki kenar hipotenüsün yarısıdır.
H 0°, 30°, 45°, 60°, 90° sinüsleri: $\tfrac{\sqrt0}{2}, \tfrac{\sqrt1}{2}, \tfrac{\sqrt2}{2}, \tfrac{\sqrt3}{2}, \tfrac{\sqrt4}{2}$.
G ozelaci
V -

# tr-sin45 | 3 | $\sin 45^\circ$
L \sin 45^\circ
R \dfrac{\sqrt2}{2}
X \dfrac{1}{2} ;; \dfrac{\sqrt3}{2} ;; 1
W İkizkenar dik üçgende kenarlar $1, 1, \sqrt2$.
V -

# tr-sin60 | 3 | $\sin 60^\circ$
L \sin 60^\circ
R \dfrac{\sqrt3}{2}
X \dfrac12 ;; \dfrac{\sqrt2}{2} ;; \sqrt3
V -

# tr-cos30 | 3 | $\cos 30^\circ$
L \cos 30^\circ
R \dfrac{\sqrt3}{2}
X \dfrac12 ;; \dfrac{\sqrt2}{2} ;; \dfrac{\sqrt3}{3}
W Tümler açılar: $\cos 30^\circ=\sin 60^\circ$.
V -

# tr-cos60 | 3 | $\cos 60^\circ$
L \cos 60^\circ
R \dfrac12
X \dfrac{\sqrt3}{2} ;; \dfrac{\sqrt2}{2} ;; 0
V -

# tr-tan30 | 2 | $\tan 30^\circ$
L \tan 30^\circ
R \dfrac{\sqrt3}{3}
X \sqrt3 ;; \dfrac12 ;; \dfrac{\sqrt3}{2}
W $\tan 30^\circ=\tfrac{1/2}{\sqrt3/2}=\tfrac{1}{\sqrt3}$.
V -

# tr-tan60 | 2 | $\tan 60^\circ$
L \tan 60^\circ
R \sqrt3
X \dfrac{\sqrt3}{3} ;; \dfrac{\sqrt3}{2} ;; 1
V -

# tr-pisagor | 3 | Temel özdeşlik
L \sin^2x+\cos^2x
R 1
X 0 ;; 2 ;; \tan^2x
W Birim çemberdeki $(\cos x,\sin x)$ noktası için Pisagor teoremi.
E $\sin x=\tfrac35$ ise $\cos^2x=\tfrac{16}{25}$.
G pisagortrig
V x

# tr-tan | 3 | Tanjantın tanımı
L \tan x
R \dfrac{\sin x}{\cos x}
X \dfrac{\cos x}{\sin x} ;; \sin x\cdot\cos x ;; \dfrac{1}{\sin x}
V x:0.1:1.4

# tr-tancot | 2 | Tanjant ile kotanjant
L \tan x\cdot\cot x
R 1
X 0 ;; -1 ;; \tan^2x
V x:0.1:1.4

# tr-sec | 2 | $1+\tan^2x$
L 1+\tan^2x
R \dfrac{1}{\cos^2x}
X \dfrac{1}{\sin^2x} ;; \cos^2x ;; \dfrac{1}{\cos x}
W Temel özdeşliği $\cos^2x$’e böl.
V x:0.1:1.4

# tr-csc | 2 | $1+\cot^2x$
L 1+\cot^2x
R \dfrac{1}{\sin^2x}
X \dfrac{1}{\cos^2x} ;; \sin^2x ;; \tan^2x
W Temel özdeşliği $\sin^2x$’e böl.
V x:0.1:1.4

# tr-sintop | 3 | Toplam açının sinüsü
L \sin(a+b)
R \sin a\cos b+\cos a\sin b
X \sin a\cos b-\cos a\sin b ;; \sin a+\sin b ;; \cos a\cos b+\sin a\sin b
H Sinüs karışık sever, işaretini korur: sin·cos + cos·sin.
E $\sin 75^\circ=\sin 45^\circ\cos 30^\circ+\cos 45^\circ\sin 30^\circ=\tfrac{\sqrt6+\sqrt2}{4}$
V a,b

# tr-sinfark | 2 | Fark açının sinüsü
L \sin(a-b)
R \sin a\cos b-\cos a\sin b
X \sin a\cos b+\cos a\sin b ;; \sin a-\sin b ;; \cos a\sin b-\sin a\cos b
V a,b

# tr-costop | 3 | Toplam açının kosinüsü
L \cos(a+b)
R \cos a\cos b-\sin a\sin b
X \cos a\cos b+\sin a\sin b ;; \cos a+\cos b ;; \sin a\cos b-\cos a\sin b
H Kosinüs eşleri sever, işareti ters çevirir: cos·cos ∓ sin·sin.
V a,b

# tr-cosfark | 2 | Fark açının kosinüsü
L \cos(a-b)
R \cos a\cos b+\sin a\sin b
X \cos a\cos b-\sin a\sin b ;; \cos a-\cos b ;; \sin a\sin b-\cos a\cos b
V a,b

# tr-tantop | 2 | Toplam açının tanjantı
L \tan(a+b)
R \dfrac{\tan a+\tan b}{1-\tan a\tan b}
X \dfrac{\tan a+\tan b}{1+\tan a\tan b} ;; \tan a+\tan b ;; \dfrac{\tan a-\tan b}{1-\tan a\tan b}
H Payda işareti, paydakinin tersi.
V a:0.1:0.6,b:0.1:0.6

# tr-tanfark | 1 | Fark açının tanjantı
L \tan(a-b)
R \dfrac{\tan a-\tan b}{1+\tan a\tan b}
X \dfrac{\tan a-\tan b}{1-\tan a\tan b} ;; \tan a-\tan b ;; \dfrac{\tan a+\tan b}{1+\tan a\tan b}
V a:0.1:0.6,b:0.1:0.6

# tr-sin2x | 3 | İki kat açı (sinüs)
L \sin 2x
R 2\sin x\cos x
X 2\sin x ;; \sin^2x-\cos^2x ;; \sin x\cos x
W $\sin(x+x)$ toplam formülünden gelir.
E $\sin x=\tfrac35$, $\cos x=\tfrac45$ ise $\sin 2x=\tfrac{24}{25}$.
G sin2x
V x

# tr-cos2x | 3 | İki kat açı (kosinüs)
L \cos 2x
R \cos^2x-\sin^2x
X 2\cos x ;; \sin^2x-\cos^2x ;; 2\sin x\cos x
K Diğer biçimleri: $2\cos^2x-1$ ve $1-2\sin^2x$
W $\cos(x+x)$ toplam formülünden gelir.
V x

# tr-cos2xb | 2 | İki kat açı (sinüs cinsinden kosinüs)
L \cos 2x
R 1-2\sin^2x
X 2\sin^2x-1 ;; 1-\sin^2x ;; 1-2\sin x
W $\cos^2x=1-\sin^2x$ yerine yazılır.
V x

# tr-tan2x | 2 | İki kat açı (tanjant)
L \tan 2x
R \dfrac{2\tan x}{1-\tan^2x}
X \dfrac{2\tan x}{1+\tan^2x} ;; 2\tan x ;; \dfrac{\tan x}{1-\tan^2x}
V x:0.1:0.6

# tr-yarimsin | 2 | Sinüs kare (yarım açı)
L \sin^2x
R \dfrac{1-\cos 2x}{2}
X \dfrac{1+\cos 2x}{2} ;; 1-\cos 2x ;; \dfrac{1-\cos x}{2}
W $\cos 2x=1-2\sin^2x$ eşitliğinden çekilir. İntegralde çok işe yarar.
V x

# tr-yarimcos | 2 | Kosinüs kare (yarım açı)
L \cos^2x
R \dfrac{1+\cos 2x}{2}
X \dfrac{1-\cos 2x}{2} ;; 1+\cos 2x ;; \dfrac{1+\cos x}{2}
V x

# tr-sinteo | 3 | Sinüs teoremi
L \dfrac{a}{\sin A}
R 2R
X R ;; \dfrac{R}{2} ;; \dfrac{b}{\cos B}
K $\tfrac{a}{\sin A}=\tfrac{b}{\sin B}=\tfrac{c}{\sin C}=2R$; $R$: çevrel çember yarıçapı
W Kenarlar, karşılarındaki açıların sinüsleriyle orantılıdır.
G sinusteo

# tr-costeo | 3 | Kosinüs teoremi
L a^2
R b^2+c^2-2bc\cos A
X b^2+c^2+2bc\cos A ;; b^2+c^2-bc\cos A ;; b^2-c^2-2bc\cos A
W $A=90^\circ$ iken $\cos A=0$ ve Pisagor teoremine dönüşür.
E $b=3$, $c=5$, $A=60^\circ$: $a^2=9+25-15=19$.
G kosinusteo

# tr-alan | 3 | Sinüslü alan formülü
L \text{Alan}(ABC)
R \dfrac12\,b\,c\,\sin A
X b\,c\,\sin A ;; \dfrac12\,b\,c\,\cos A ;; \dfrac12\,a\,b\,\sin A
W İki kenar ve aralarındaki açı: $A$ açısı $b$ ile $c$ kenarları arasındadır.
E $b=6$, $c=8$, $A=30^\circ$: alan $=\tfrac12\cdot 6\cdot 8\cdot\tfrac12=12$.
G sinalan

# tr-radyan | 3 | Derece–radyan dönüşümü
L \dfrac{D}{180}
R \dfrac{R}{\pi}
X \dfrac{\pi}{R} ;; \dfrac{R}{2\pi} ;; \dfrac{R}{360}
K $D$: derece, $R$: radyan cinsinden aynı açı
W $180^\circ=\pi$ radyan.
E $135^\circ=\tfrac{3\pi}{4}$ radyan.
G radyan

# tr-periyot | 2 | Sinüs ve kosinüsün periyodu
L ~$\sin(ax+b)$ ve $\cos(ax+b)$’nin esas periyodu
R \dfrac{2\pi}{|a|}
X \dfrac{\pi}{|a|} ;; 2\pi|a| ;; \dfrac{2\pi}{|b|}
W $b$ sadece kaydırır; periyodu sadece $x$’in katsayısı değiştirir.
E $\sin 3x$’in periyodu $\tfrac{2\pi}{3}$.
G periyot

# tr-periyottan | 2 | Tanjant ve kotanjantın periyodu
L ~$\tan(ax+b)$ ve $\cot(ax+b)$’nin esas periyodu
R \dfrac{\pi}{|a|}
X \dfrac{2\pi}{|a|} ;; \pi|a| ;; \dfrac{\pi}{2|a|}

# tr-negsin | 2 | Negatif açının sinüsü
L \sin(-x)
R -\sin x
X \sin x ;; \cos x ;; -\cos x
W Sinüs tek fonksiyondur.
V x

# tr-negcos | 2 | Negatif açının kosinüsü
L \cos(-x)
R \cos x
X -\cos x ;; \sin x ;; -\sin x
W Kosinüs çift fonksiyondur.
V x

# tr-tumler | 2 | Tümler açı
L \sin(90^\circ-x)
R \cos x
X \sin x ;; -\cos x ;; -\sin x
W Dik üçgende bir dar açının karşısı, diğerinin komşusudur.
V x

# tr-butunsin | 2 | Bütünler açının sinüsü
L \sin(180^\circ-x)
R \sin x
X -\sin x ;; \cos x ;; -\cos x
W II. bölgede sinüs pozitiftir.
V x

# tr-butuncos | 2 | Bütünler açının kosinüsü
L \cos(180^\circ-x)
R -\cos x
X \cos x ;; \sin x ;; -\sin x
W II. bölgede kosinüs negatiftir.
V x

# tr-donusum1 | 1 | Sinüslerin toplamı
L \sin a+\sin b
R 2\sin\dfrac{a+b}{2}\cos\dfrac{a-b}{2}
X 2\cos\dfrac{a+b}{2}\sin\dfrac{a-b}{2} ;; \sin(a+b) ;; 2\sin\dfrac{a+b}{2}\sin\dfrac{a-b}{2}
V a,b

# tr-donusum2 | 1 | Kosinüslerin toplamı
L \cos a+\cos b
R 2\cos\dfrac{a+b}{2}\cos\dfrac{a-b}{2}
X -2\sin\dfrac{a+b}{2}\sin\dfrac{a-b}{2} ;; \cos(a+b) ;; 2\sin\dfrac{a+b}{2}\cos\dfrac{a-b}{2}
V a,b

# tr-donusum3 | 1 | Kosinüslerin farkı
L \cos a-\cos b
R -2\sin\dfrac{a+b}{2}\sin\dfrac{a-b}{2}
X 2\sin\dfrac{a+b}{2}\sin\dfrac{a-b}{2} ;; 2\cos\dfrac{a+b}{2}\cos\dfrac{a-b}{2} ;; \cos(a-b)
V a,b

# tr-tersdonusum | 1 | Ters dönüşüm
L 2\sin a\cos b
R \sin(a+b)+\sin(a-b)
X \sin(a+b)-\sin(a-b) ;; \cos(a-b)-\cos(a+b) ;; \cos(a+b)+\cos(a-b)
V a,b

## log

# lg-tanim | 3 | Logaritmanın tanımı
L \log_a x=y
O \iff
R a^y=x
X x^y=a ;; y^a=x ;; a^x=y
K $a>0$, $a\ne 1$, $x>0$
W Logaritma şu soruyu sorar: “$a$’nın kaçıncı kuvveti $x$ eder?”
E $\log_2 32=5$ çünkü $2^5=32$.
H Taban, cevabı üs olarak taşır.
G logtanim

# lg-carpim | 3 | Çarpımın logaritması
L \log_a(x\cdot y)
R \log_a x+\log_a y
X \log_a x\cdot\log_a y ;; \log_a(x+y) ;; \log_a x-\log_a y
W Logaritma çarpmayı toplamaya çevirir; hesap cetvelleri bu fikirle çalışırdı.
V a:1.5:4,x,y

# lg-bolum | 3 | Bölümün logaritması
L \log_a\dfrac{x}{y}
R \log_a x-\log_a y
X \dfrac{\log_a x}{\log_a y} ;; \log_a(x-y) ;; \log_a y-\log_a x
V a:1.5:4,x,y

# lg-us | 3 | Kuvvetin logaritması
L \log_a x^n
R n\log_a x
X (\log_a x)^n ;; \log_a(n\,x) ;; \dfrac{1}{n}\log_a x
E $\log_3 81=\log_3 3^4=4$
V a:1.5:4,x,n

# lg-tabanus | 2 | Tabanda ve içeride kuvvet
L \log_{a^m}x^n
R \dfrac{n}{m}\log_a x
X \dfrac{m}{n}\log_a x ;; n\,m\log_a x ;; (n-m)\log_a x
E $\log_{8}4=\log_{2^3}2^2=\tfrac23$
V a:1.5:4,m,n,x

# lg-tabandegis | 3 | Taban değiştirme
L \log_a b
R \dfrac{\log_c b}{\log_c a}
X \dfrac{\log_c a}{\log_c b} ;; \log_c b-\log_c a ;; \log_c(b-a)
K $c>0$, $c\ne 1$
W Hesap makinesinde $\log$ veya $\ln$ ile herhangi bir tabanı bulmanın yolu.
H Asıl sayı payda, taban paydada.
V a:1.5:4,b,c:1.5:4

# lg-ters | 2 | Taban ile sayının yer değiştirmesi
L \log_a b\cdot\log_b a
R 1
X 0 ;; \log_a(ab) ;; ab
V a:1.5:4,b:1.5:4

# lg-zincir | 2 | Logaritma zinciri
L \log_a b\cdot\log_b c
R \log_a c
X \log_c a ;; \log_a(bc) ;; \log_b(ac)
W Ortadaki $b$ sadeleşir, tıpkı kesirlerde olduğu gibi.
V a:1.5:4,b:1.5:4,c:1.5:4

# lg-ussu | 3 | Tabanın logaritmalı kuvveti
L a^{\log_a x}
R x
X a ;; \log_a x ;; x^a
W Üstel fonksiyon ile logaritma birbirinin tersidir.
E $5^{\log_5 7}=7$
V a:1.5:4,x

# lg-yer | 1 | Üs ile tabanın yer değiştirmesi
L a^{\log_b c}
R c^{\log_b a}
X a^{\log_c b} ;; b^{\log_a c} ;; c^{\log_a b}
E $4^{\log_2 3}=3^{\log_2 4}=9$
V a:1.5:4,b:1.5:4,c:1.5:4

# lg-temel | 3 | Logaritmanın temel değerleri
L \log_a a
R 1
X 0 ;; a ;; ~tanımsız
K $a>0$, $a\ne 1$; ayrıca $\log_a 1=0$
V a:1.5:4

# lg-bir | 3 | Birin logaritması
L \log_a 1
R 0
X 1 ;; a ;; ~tanımsız
W Her tabanın sıfırıncı kuvveti 1’dir.
V a:1.5:4

# lg-ln | 2 | Doğal logaritma
L \ln e
R 1
X 0 ;; e ;; 10
K $\ln$: tabanı $e\approx 2{,}718$ olan doğal logaritma
V -

# lg-tanimkume | 2 | Logaritmanın tanım şartları
L \log_a f(x)\ \text{tanımlı}
O \iff
R ~$f(x)>0$, $a>0$ ve $a\ne 1$
X ~$f(x)\ge 0$ ve $a>0$ ;; ~$f(x)>0$ ve $a\ne 0$ ;; ~$f(x)\ne 0$ ve $a>1$
W Logaritmanın içi kesinlikle pozitif olmalı; taban pozitif ve 1’den farklı olmalı.

# lg-usteldenklem | 2 | Üstel denklem
L a^{f(x)}=a^{g(x)}
O \Rightarrow
R f(x)=g(x)
X f(x)=-g(x) ;; f(x)\cdot g(x)=1 ;; f(x)=a\cdot g(x)
K $a>0$, $a\ne 1$
E $2^{x+1}=8=2^3\Rightarrow x=2$

# lg-basamak | 1 | Basamak sayısı
L ~$x$ pozitif tam sayısının basamak sayısı
R \lfloor\log x\rfloor+1
X \lfloor\log x\rfloor ;; \lfloor\ln x\rfloor+1 ;; \lfloor\log_2 x\rfloor
K $\log$: 10 tabanında logaritma
E $\log 2^{10}=10\log 2\approx 3{,}01$ olduğundan $2^{10}$ dört basamaklıdır.
G basamaksayisi

## dizi

# dz-aritgenel | 3 | Aritmetik dizinin genel terimi
L a_n
R a_1+(n-1)\,d
X a_1+n\,d ;; a_1\cdot d^{\,n-1} ;; n\,a_1+d
K Aritmetik dizi, ortak fark $d$
W İlk terimden $n$. terime $n-1$ adım atılır.
E $a_1=4$, $d=3$ ise $a_{10}=4+27=31$.
G aritgenel

# dz-aritiki | 2 | İki terim arasındaki ilişki
L a_n
R a_k+(n-k)\,d
X a_k+(n+k)\,d ;; a_k+(k-n)\,d ;; a_k\cdot(n-k)\,d
K Aritmetik dizi
E $a_5=20$, $d=4$ ise $a_{12}=20+28=48$.

# dz-arittop | 3 | Aritmetik dizide ilk $n$ terim toplamı
L S_n
R \dfrac{n\,(a_1+a_n)}{2}
X n\,(a_1+a_n) ;; \dfrac{n\,(a_n-a_1)}{2} ;; \dfrac{(n-1)(a_1+a_n)}{2}
K Aritmetik dizi
W Gauss’un fikri: ilk ve son terimi eşleştir.
G arittop

# dz-arittop2 | 2 | Aritmetik toplam ($a_1$ ve $d$ ile)
L S_n
R \dfrac{n}{2}\,[2a_1+(n-1)d]
X \dfrac{n}{2}\,[a_1+(n-1)d] ;; n\,[2a_1+(n-1)d] ;; \dfrac{n}{2}\,[2a_1+n\,d]
K Aritmetik dizi

# dz-aritorta | 2 | Aritmetik ortalama özelliği
L a_k
R \dfrac{a_{k-m}+a_{k+m}}{2}
X \sqrt{a_{k-m}\cdot a_{k+m}} ;; a_{k-m}+a_{k+m} ;; \dfrac{a_{k+m}-a_{k-m}}{2}
K Aritmetik dizi; $a_k$ ortadaki terim
W Ortadan eşit uzaklıktaki terimlerin ortalaması, ortadaki terimdir.

# dz-geogenel | 3 | Geometrik dizinin genel terimi
L a_n
R a_1\cdot r^{\,n-1}
X a_1\cdot r^{\,n} ;; a_1+(n-1)\,r ;; (a_1 r)^{\,n-1}
K Geometrik dizi, ortak çarpan $r$
E $a_1=3$, $r=2$ ise $a_6=3\cdot 2^5=96$.
G geogenel

# dz-geotop | 3 | Geometrik dizide ilk $n$ terim toplamı
L S_n
R a_1\cdot\dfrac{r^n-1}{r-1}
X a_1\cdot\dfrac{r^{n-1}-1}{r-1} ;; a_1\cdot\dfrac{r^n-1}{r+1} ;; \dfrac{r^n-1}{r-1}
K Geometrik dizi, $r\ne 1$
E $1+2+4+\dots+2^9=\tfrac{2^{10}-1}{1}=1023$
G geotop

# dz-geoorta | 2 | Geometrik ortalama özelliği
L a_k^2
R a_{k-m}\cdot a_{k+m}
X a_{k-m}+a_{k+m} ;; \dfrac{a_{k-m}+a_{k+m}}{2} ;; 2\,a_{k-m}\cdot a_{k+m}
K Geometrik dizi

# dz-sonsuz | 3 | Sonsuz geometrik seri
L \sum_{n=1}^{\infty} a_1 r^{\,n-1}
R \dfrac{a_1}{1-r}
X \dfrac{a_1}{1+r} ;; \dfrac{1}{1-r} ;; \dfrac{a_1}{r-1}
K $|r|<1$
W Kısmi toplamdaki $r^n$, $|r|<1$ iken sıfıra gider.
E $1+\tfrac12+\tfrac14+\dots=\tfrac{1}{1-1/2}=2$
G sonsuzgeo
V a_1,r:-0.8:0.8

# dz-sigma1 | 2 | Sabitin toplamı
L \sum_{k=1}^{n} c
R n\cdot c
X c ;; (n-1)\,c ;; \dfrac{n(n+1)}{2}\,c
V c,n:int:1:12

# dz-sigma2 | 2 | Toplam sembolünün dağılması
L \sum_{k=1}^{n}(a_k+b_k)
R \sum_{k=1}^{n} a_k+\sum_{k=1}^{n} b_k
X \sum_{k=1}^{n} a_k\cdot\sum_{k=1}^{n} b_k ;; n\left(\sum_{k=1}^{n} a_k+\sum_{k=1}^{n} b_k\right) ;; \sum_{k=1}^{n} a_k\,b_k
W Toplam doğrusaldır; ama çarpıma dağılmaz.

# dz-teleskop | 1 | Teleskopik toplam
L \sum_{k=1}^{n}\dfrac{1}{k(k+1)}
R \dfrac{n}{n+1}
X \dfrac{1}{n+1} ;; \dfrac{n+1}{n} ;; \dfrac{n}{n+2}
W $\tfrac{1}{k(k+1)}=\tfrac1k-\tfrac{1}{k+1}$; ara terimler birbirini götürür.
V n:int:1:15

## limit

# lm-sinx | 3 | Temel trigonometrik limit
L \lim_{x\to 0}\dfrac{\sin x}{x}
R 1
X 0 ;; \infty ;; ~Tanımsız
W Küçük açılarda (radyan) $\sin x\approx x$.
S Bu limit, sinüsün türevinin kosinüs olduğunu göstermenin anahtarıdır.

# lm-tanx | 2 | Tanjantlı temel limit
L \lim_{x\to 0}\dfrac{\tan x}{x}
R 1
X 0 ;; \infty ;; \dfrac12

# lm-sinax | 3 | $\frac{\sin ax}{bx}$ limiti
L \lim_{x\to 0}\dfrac{\sin ax}{bx}
R \dfrac{a}{b}
X \dfrac{b}{a} ;; ab ;; 1
E $\lim_{x\to 0}\tfrac{\sin 6x}{2x}=3$
G limsin

# lm-e1 | 2 | $e$ sayısının tanımı
L \lim_{x\to\infty}\left(1+\dfrac{1}{x}\right)^{x}
R e
X 1 ;; \infty ;; 0
W $1^\infty$ belirsizliğidir; sonuç $e\approx 2{,}71828$.
S Jacob Bernoulli bu sayıya bileşik faizi incelerken ulaştı; $e$ adını Euler verdi.

# lm-e2 | 2 | Genelleştirilmiş $e$ limiti
L \lim_{x\to\infty}\left(1+\dfrac{a}{x}\right)^{bx}
R e^{ab}
X e^{a/b} ;; e^{a+b} ;; ab\,e
E $\lim_{x\to\infty}\left(1+\tfrac2x\right)^{3x}=e^6$

# lm-cos | 2 | $\frac{1-\cos x}{x^2}$ limiti
L \lim_{x\to 0}\dfrac{1-\cos x}{x^2}
R \dfrac12
X 1 ;; 0 ;; 2
W $1-\cos x=2\sin^2\tfrac x2$ yazılır.

# lm-exp | 2 | Üstel temel limit
L \lim_{x\to 0}\dfrac{e^x-1}{x}
R 1
X e ;; 0 ;; \infty

# lm-ln | 1 | Logaritmik temel limit
L \lim_{x\to 0}\dfrac{\ln(1+x)}{x}
R 1
X 0 ;; e ;; \infty

# lm-hospital | 3 | L’Hospital kuralı
L \lim_{x\to a}\dfrac{f(x)}{g(x)}
R \lim_{x\to a}\dfrac{f'(x)}{g'(x)}
X \lim_{x\to a}\left(\dfrac{f(x)}{g(x)}\right)' ;; \lim_{x\to a}\dfrac{g'(x)}{f'(x)} ;; \dfrac{f'(a)\,g(a)-f(a)\,g'(a)}{g(a)^2}
K $\tfrac00$ veya $\tfrac{\infty}{\infty}$ belirsizliğinde
W Bölümün türevi alınmaz; pay ve paydanın türevleri ayrı ayrı alınır.
E $\lim_{x\to 2}\tfrac{x^2-4}{x-2}=\lim_{x\to 2}\tfrac{2x}{1}=4$
G hospital

# lm-rasyonel | 3 | Sonsuzda rasyonel limit
L \lim_{x\to\infty}\dfrac{a x^n+\cdots}{b x^n+\cdots}
R \dfrac{a}{b}
X 0 ;; \infty ;; \dfrac{b}{a}
K Pay ve paydanın dereceleri eşit
W Pay derecesi büyükse $\pm\infty$, küçükse $0$. Eşitse baş katsayılar oranı.
E $\lim_{x\to\infty}\tfrac{6x^2-x}{3x^2+5}=2$
G limrasyonel

# lm-xna | 2 | $\frac{x^n-a^n}{x-a}$ limiti
L \lim_{x\to a}\dfrac{x^n-a^n}{x-a}
R n\,a^{n-1}
X a^n ;; n\,a^{n} ;; (n-1)\,a^{n-1}
W Bu aslında $x^n$’in $x=a$’daki türevidir.

# lm-sureklilik | 3 | Süreklilik şartı
L f\ \text{sürekli}\ (x=a)
O \iff
R \lim_{x\to a}f(x)=f(a)
X \lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x) ;; f(a)\ \text{tanımlı} ;; f'(a)=0
W Limit var olmalı, $f(a)$ tanımlı olmalı ve ikisi eşit olmalı.

# lm-varlik | 2 | Limitin varlığı
L \lim_{x\to a}f(x)\ \text{var}
O \iff
R \lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x)
X f(a)\ \text{tanımlı} ;; \lim_{x\to a^-}f(x)=f(a) ;; f'(a)\ \text{var}
W Soldan ve sağdan limitler eşit (ve sonlu) olmalı; $f(a)$’nın değeri önemli değildir.

## turev

# tv-tanim | 3 | Türevin tanımı
L f'(x)
R \lim_{h\to 0}\dfrac{f(x+h)-f(x)}{h}
X \lim_{h\to 0}\dfrac{f(x+h)-f(x)}{x} ;; \lim_{h\to 0}\dfrac{f(x+h)+f(x)}{h} ;; \dfrac{f(x+h)-f(x)}{h}
W Teğetin eğimi, kirişlerin eğimlerinin limitidir.
S Newton ve Leibniz kalkülüsü 17. yüzyılda birbirinden bağımsız geliştirdi; bugün kullandığımız $\tfrac{dy}{dx}$ gösterimi Leibniz’indir.

# tv-xn | 3 | Kuvvet kuralı
L (x^n)'
R n\,x^{n-1}
X x^{n-1} ;; n\,x^{n+1} ;; \dfrac{x^{n+1}}{n+1}
E $(x^5)'=5x^4$, $\left(\tfrac1x\right)'=(x^{-1})'=-x^{-2}$
H Üs öne iner, üs bir azalır.
G turevxn
V x,n

# tv-sabit | 2 | Sabitin türevi
L (c)'
R 0
X c ;; 1 ;; c\,x
W Sabit fonksiyonun grafiği yataydır; eğimi sıfırdır.

# tv-carpim | 3 | Çarpımın türevi
L (f\cdot g)'
R f'g+fg'
X f'\cdot g' ;; f'g-fg' ;; f'+g'
H Birinciyi türevle ikinciyi bırak, artı birinciyi bırak ikinciyi türevle.
E $(x^2\sin x)'=2x\sin x+x^2\cos x$

# tv-bolum | 3 | Bölümün türevi
L \left(\dfrac{f}{g}\right)'
R \dfrac{f'g-fg'}{g^2}
X \dfrac{f'g+fg'}{g^2} ;; \dfrac{fg'-f'g}{g^2} ;; \dfrac{f'}{g'}
H Payın türevi çarpı payda, eksi pay çarpı paydanın türevi; bölü paydanın karesi.

# tv-zincir | 3 | Zincir kuralı
L [f(g(x))]'
R f'(g(x))\cdot g'(x)
X f'(g(x)) ;; f'(x)\cdot g'(x) ;; f'(g'(x))
W Dıştakinin türevi (içi aynen kalır) çarpı içtekinin türevi.
E $\left[(3x+1)^4\right]'=4(3x+1)^3\cdot 3$
H Dıştan içe: her katmanın türevi çarpılır.
G zincir

# tv-sin | 3 | Sinüsün türevi
L (\sin x)'
R \cos x
X -\cos x ;; \sin x ;; -\sin x
V x

# tv-cos | 3 | Kosinüsün türevi
L (\cos x)'
R -\sin x
X \sin x ;; \cos x ;; -\cos x
H Kosinüsün türevinde eksi çıkar.
V x

# tv-tan | 2 | Tanjantın türevi
L (\tan x)'
R 1+\tan^2x
X 1-\tan^2x ;; \cot x ;; -\dfrac{1}{\sin^2x}
K Eşdeğeri: $\dfrac{1}{\cos^2x}$
V x:0.1:1.2

# tv-cot | 2 | Kotanjantın türevi
L (\cot x)'
R -(1+\cot^2x)
X 1+\cot^2x ;; -\tan x ;; \dfrac{1}{\sin^2x}
K Eşdeğeri: $-\dfrac{1}{\sin^2x}$
V x:0.2:1.4

# tv-ex | 3 | $e^x$’in türevi
L (e^x)'
R e^x
X x\,e^{x-1} ;; e ;; e^x\ln x
W $e^x$, türevi kendisine eşit olan (sıfırdan farklı) tek fonksiyon ailesidir.
V x

# tv-ax | 2 | Üstel fonksiyonun türevi
L (a^x)'
R a^x\ln a
X x\,a^{x-1} ;; a^x ;; \dfrac{a^x}{\ln a}
K $a>0$, $a\ne 1$
V x,a:1.5:4

# tv-ln | 3 | $\ln x$’in türevi
L (\ln x)'
R \dfrac{1}{x}
X \ln x ;; \dfrac{1}{x^2} ;; e^x
K $x>0$
V x

# tv-log | 2 | Logaritmanın türevi
L (\log_a x)'
R \dfrac{1}{x\ln a}
X \dfrac{\ln a}{x} ;; \dfrac{1}{x} ;; \dfrac{a}{x}
V x,a:1.5:4

# tv-kok | 2 | Karekökün türevi
L (\sqrt{x})'
R \dfrac{1}{2\sqrt{x}}
X \dfrac{1}{\sqrt{x}} ;; 2\sqrt{x} ;; \dfrac{\sqrt{x}}{2}
W $\sqrt x=x^{1/2}$ için kuvvet kuralı.
V x

# tv-ustelf | 2 | $e^{f(x)}$’in türevi
L (e^{f(x)})'
R f'(x)\,e^{f(x)}
X e^{f(x)} ;; f(x)\,e^{f(x)-1} ;; e^{f'(x)}
E $(e^{x^2})'=2x\,e^{x^2}$

# tv-lnf | 2 | $\ln f(x)$’in türevi
L (\ln f(x))'
R \dfrac{f'(x)}{f(x)}
X \dfrac{1}{f(x)} ;; \dfrac{f(x)}{f'(x)} ;; \ln f'(x)
E $(\ln(x^2+1))'=\tfrac{2x}{x^2+1}$

# tv-arcsin | 1 | Arksinüsün türevi
L (\arcsin x)'
R \dfrac{1}{\sqrt{1-x^2}}
X -\dfrac{1}{\sqrt{1-x^2}} ;; \dfrac{1}{1+x^2} ;; \sqrt{1-x^2}
V x:-0.8:0.8

# tv-arctan | 1 | Arktanjantın türevi
L (\arctan x)'
R \dfrac{1}{1+x^2}
X \dfrac{1}{1-x^2} ;; \dfrac{1}{\sqrt{1+x^2}} ;; -\dfrac{1}{1+x^2}
V x

# tv-teget | 3 | Teğet doğrusunun denklemi
L y-f(a)
R f'(a)\,(x-a)
X f(a)\,(x-a) ;; f'(a)\,(x+a) ;; f'(x)\,(x-a)
K $x=a$ apsisli noktadaki teğet
W Eğimi $f'(a)$ olan ve $(a, f(a))$’dan geçen doğru.
G teget

# tv-normal | 2 | Normalin eğimi
L m_N
R -\dfrac{1}{f'(a)}
X \dfrac{1}{f'(a)} ;; -f'(a) ;; f'(a)
K Normal, değme noktasında teğete diktir: $m_T\cdot m_N=-1$

# tv-minimum | 3 | İkinci türev testi (minimum)
L f'(a)=0\ \text{ve}\ f''(a)>0
O \Rightarrow
R ~$x=a$’da yerel minimum
X ~$x=a$’da yerel maksimum ;; ~$x=a$’da büküm noktası ;; ~$f$, $x=a$ civarında artandır
H Gülen yüz: $f''>0$ çukurdur, dipte minimum vardır.

# tv-maksimum | 2 | İkinci türev testi (maksimum)
L f'(a)=0\ \text{ve}\ f''(a)<0
O \Rightarrow
R ~$x=a$’da yerel maksimum
X ~$x=a$’da yerel minimum ;; ~$x=a$’da büküm noktası ;; ~$f$, $x=a$’da süreksiz
H Somurtan yüz: $f''<0$ tümsektir, tepede maksimum vardır.

# tv-artan | 3 | Türev ve monotonluk
L f'(x)>0\ \text{(bir aralıkta)}
O \Rightarrow
R ~$f$ o aralıkta artandır
X ~$f$ o aralıkta azalandır ;; ~$f$ o aralıkta çukurdur ;; ~$f$ o aralıkta pozitiftir
W Eğim pozitifse grafik soldan sağa yükselir.

# tv-bukum | 2 | Büküm noktası
L f''\ \text{işaret değiştiriyor}\ (x=a)
O \Rightarrow
R ~$x=a$ büküm (dönüm) noktasıdır
X ~$x=a$’da yerel maksimum ;; ~$x=a$’da yerel minimum ;; ~$f$, $x=a$’da süreksiz
W Eğrinin çukurluk yönü değişir; burada $f''(a)=0$ (veya tanımsız) olur.

# tv-tersturev | 1 | Ters fonksiyonun türevi
L (f^{-1})'(b)
R \dfrac{1}{f'(a)}
X f'(a) ;; -\dfrac{1}{f'(a)} ;; \dfrac{1}{f'(b)}
K $f(a)=b$
W Ters fonksiyonun grafiği $y=x$’e göre yansımadır; eğimler terslenir.

# tv-kapali | 1 | Kapalı türev
L \dfrac{dy}{dx}
R -\dfrac{F_x}{F_y}
X \dfrac{F_x}{F_y} ;; -\dfrac{F_y}{F_x} ;; F_x\cdot F_y
K $F(x,y)=0$ ile tanımlı eğri; $F_x, F_y$ kısmi türevler

# tv-fizik | 2 | Konum, hız, ivme
L v(t)
R s'(t)
X s''(t) ;; \int s(t)\,dt ;; \dfrac{s(t)}{t}
K $s(t)$: konum; ivme $a(t)=v'(t)=s''(t)$
W Anlık hız, konumun zamana göre değişim hızıdır.

## integral

# in-xn | 3 | Kuvvetin integrali
L \int x^n\,dx
R \dfrac{x^{n+1}}{n+1}+c
X n\,x^{n-1}+c ;; \dfrac{x^{n}}{n}+c ;; \dfrac{x^{n+1}}{n}+c
K $n\ne -1$
W Türevin tersi: üs bir artar, yeni üsse bölünür.
E $\int x^3\,dx=\tfrac{x^4}{4}+c$
H Üssü bir artır, yeni üsse böl.
G intxn

# in-1x | 3 | $\frac1x$’in integrali
L \int\dfrac{1}{x}\,dx
R \ln|x|+c
X -\dfrac{1}{x^2}+c ;; \dfrac{x^0}{0}+c ;; e^x+c
W Kuvvet kuralı $n=-1$ için çalışmaz; boşluğu $\ln$ doldurur.

# in-ex | 3 | $e^x$’in integrali
L \int e^x\,dx
R e^x+c
X \dfrac{e^{x+1}}{x+1}+c ;; x\,e^{x-1}+c ;; e^{x}\ln x+c

# in-ax | 2 | Üstel fonksiyonun integrali
L \int a^x\,dx
R \dfrac{a^x}{\ln a}+c
X a^x\ln a+c ;; \dfrac{a^{x+1}}{x+1}+c ;; a^x+c
K $a>0$, $a\ne 1$

# in-sin | 3 | Sinüsün integrali
L \int\sin x\,dx
R -\cos x+c
X \cos x+c ;; -\sin x+c ;; \dfrac{\sin^2x}{2}+c
H Türevde kosinüse eksi gelir, integralde sinüse.

# in-cos | 3 | Kosinüsün integrali
L \int\cos x\,dx
R \sin x+c
X -\sin x+c ;; -\cos x+c ;; \tan x+c

# in-sec2 | 2 | $\frac{1}{\cos^2x}$’in integrali
L \int\dfrac{1}{\cos^2x}\,dx
R \tan x+c
X \cot x+c ;; -\tan x+c ;; -\cot x+c

# in-csc2 | 2 | $\frac{1}{\sin^2x}$’in integrali
L \int\dfrac{1}{\sin^2x}\,dx
R -\cot x+c
X \cot x+c ;; \tan x+c ;; -\tan x+c

# in-arctan | 2 | $\frac{1}{1+x^2}$’nin integrali
L \int\dfrac{1}{1+x^2}\,dx
R \arctan x+c
X \ln(1+x^2)+c ;; \arcsin x+c ;; \dfrac{x}{1+x^2}+c

# in-arcsin | 1 | $\frac{1}{\sqrt{1-x^2}}$’nin integrali
L \int\dfrac{1}{\sqrt{1-x^2}}\,dx
R \arcsin x+c
X \arccos x+c ;; \arctan x+c ;; \sqrt{1-x^2}+c

# in-kismi | 3 | Kısmi integrasyon
L \int u\,dv
R u\,v-\int v\,du
X u\,v+\int v\,du ;; \int v\,du-u\,v ;; u\,v-\int u\,dv
W Çarpımın türevi kuralının integral karşılığıdır.
E $\int x e^x\,dx=x e^x-\int e^x\,dx=e^x(x-1)+c$
H $u$ seçimi için LAPTÜ: Logaritma, Arc (ters trigonometrik), Polinom, Trigonometrik, Üstel.

# in-belirli | 3 | Belirli integral (Newton–Leibniz)
L \int_a^b f(x)\,dx
R F(b)-F(a)
X F(a)-F(b) ;; F(b)+F(a) ;; f(b)-f(a)
K $F'(x)=f(x)$
W Kalkülüsün temel teoremi: alan, ilkel fonksiyonun uç noktalardaki farkıdır.
E $\int_1^3 2x\,dx=3^2-1^2=8$
G belirli

# in-ters | 2 | Sınırların yer değiştirmesi
L \int_a^b f(x)\,dx
R -\int_b^a f(x)\,dx
X \int_b^a f(x)\,dx ;; \int_{-b}^{-a} f(x)\,dx ;; -\int_a^b f(x)\,dx

# in-aralik | 2 | Aralıkların birleşmesi
L \int_a^b f\,dx+\int_b^c f\,dx
R \int_a^c f\,dx
X \int_b^c f\,dx ;; \int_a^{bc} f\,dx ;; \int_c^a f\,dx

# in-alan | 3 | İki eğri arasındaki alan
L A
R \int_a^b |f(x)-g(x)|\,dx
X \int_a^b f(x)\,dx+\int_a^b g(x)\,dx ;; \int_a^b f(x)\,g(x)\,dx ;; \left|\int_a^b f(x)\,dx\right|\cdot\left|\int_a^b g(x)\,dx\right|
K $x=a$ ile $x=b$ arasında
W Üstteki eğriden alttakini çıkar; yer değiştiriyorlarsa aralığı böl.

# in-ftc | 2 | Değişken sınırlı integralin türevi
L \dfrac{d}{dx}\int_a^{g(x)} f(t)\,dt
R f(g(x))\cdot g'(x)
X f(g(x)) ;; f(x)\,g'(x) ;; F(g(x))-F(a)
W Kalkülüsün temel teoremi ile zincir kuralı birlikte.

# in-lnf | 2 | $\frac{f'}{f}$’nin integrali
L \int\dfrac{f'(x)}{f(x)}\,dx
R \ln|f(x)|+c
X \dfrac{f(x)^2}{2}+c ;; \dfrac{1}{f(x)}+c ;; \ln|f'(x)|+c
E $\int\tfrac{2x}{x^2+1}\,dx=\ln(x^2+1)+c$

# in-hacim | 2 | Dönel cismin hacmi
L V
R \pi\int_a^b f(x)^2\,dx
X \pi\int_a^b f(x)\,dx ;; 2\pi\int_a^b f(x)^2\,dx ;; \pi\left(\int_a^b f(x)\,dx\right)^2
K $y=f(x)$ eğrisinin $x$ ekseni etrafında döndürülmesiyle
W Her dilim yarıçapı $f(x)$ olan ince bir disktir: $\pi r^2\,dx$.

# in-dogrusal | 2 | $(ax+b)^n$’nin integrali
L \int(ax+b)^n\,dx
R \dfrac{(ax+b)^{n+1}}{a\,(n+1)}+c
X \dfrac{(ax+b)^{n+1}}{n+1}+c ;; \dfrac{a\,(ax+b)^{n+1}}{n+1}+c ;; n\,a\,(ax+b)^{n-1}+c
K $n\ne -1$, $a\ne 0$
W İçin türevi olan $a$’ya bölmeyi unutma.

# in-tek | 1 | Tek fonksiyonun simetrik integrali
L \int_{-a}^{a} f(x)\,dx
R 0
X 2\int_0^a f(x)\,dx ;; \int_0^a f(x)\,dx ;; 2f(a)
K $f$ tek fonksiyon
W Orijine göre simetrik alanlar zıt işaretlidir ve birbirini götürür. (Çift fonksiyonda sonuç $2\int_0^a f$ olur.)
`;
