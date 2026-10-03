/* Geometri formülleri */
export default String.raw`
## ucgen

# uc-ic | 3 | Üçgenin iç açıları
L \hat A+\hat B+\hat C
R 180^\circ
X 360^\circ ;; 90^\circ ;; 270^\circ
W Bir köşeden karşı kenara paralel çiz: üç açı bir doğru açı oluşturur.

# uc-dis | 3 | Üçgende dış açı
L ~Bir dış açının ölçüsü
R ~Kendisine komşu olmayan iki iç açının toplamı
X ~Komşu iç açıya eşit ;; ~Komşu olmayan iki iç açının farkı ;; ~İç açılar toplamının yarısı
W Dış açı ile komşu iç açı $180^\circ$ eder; iç açılar da $180^\circ$ olduğundan kalan iki iç açıya eşit olur.

# uc-pisagor | 3 | Pisagor teoremi
L a^2+b^2
R c^2
X c ;; 2c^2 ;; (a+b)^2
K Dik üçgen; $c$: hipotenüs, $a, b$: dik kenarlar
W Hipotenüs üzerine kurulan karenin alanı, dik kenarlar üzerine kurulan karelerin toplamıdır.
E $(3,4,5)$, $(5,12,13)$, $(8,15,17)$, $(7,24,25)$ en bilinen Pisagor üçlüleridir.
S Babilliler bu ilişkiyi Pisagor’dan bin yıldan uzun süre önce biliyordu; Plimpton 322 kil tableti Pisagor üçlüleriyle doludur.
G pisagor

# uc-oklid1 | 2 | Öklid bağıntısı (yükseklik)
L h^2
R p\cdot k
X p+k ;; \dfrac{p\cdot k}{2} ;; p^2+k^2
K Dik üçgende hipotenüse ait yükseklik $h$, hipotenüsü $p$ ve $k$ parçalarına ayırır
W Yükseklik dik üçgeni birbirine benzer iki küçük dik üçgene böler.
E $p=4$, $k=9$ ise $h=6$.
G oklid

# uc-oklid2 | 2 | Öklid bağıntısı (dik kenar)
L b^2
R k\cdot a
X p\cdot k ;; a^2-k^2 ;; \dfrac{k\cdot a}{2}
K $a$: hipotenüs; $k$: $b$ dik kenarının hipotenüs üzerindeki izdüşümü
W Dik kenarın karesi, kendi izdüşümü ile hipotenüsün çarpımıdır.

# uc-dikalan | 2 | Dik üçgende kenar–yükseklik bağıntısı
L b\cdot c
R a\cdot h
X \dfrac{a\cdot h}{2} ;; a^2 ;; h^2
K $\hat A=90^\circ$; $a$: hipotenüs; $h$: hipotenüse ait yükseklik
W Alanı iki farklı yoldan yaz: $\tfrac{bc}{2}=\tfrac{ah}{2}$.
E $3$-$4$-$5$ üçgeninde $h=\tfrac{12}{5}$.

# uc-306090 | 3 | 30°–60°–90° üçgeni
L ~Kenarlar (30°, 60°, 90° karşısındakiler sırasıyla)
R k,\ k\sqrt3,\ 2k
X k,\ 2k,\ k\sqrt3 ;; k,\ k\sqrt2,\ 2k ;; k\sqrt3,\ k,\ 2k
W Eşkenar üçgenin yarısıdır: hipotenüs, kısa kenarın iki katıdır.
H 30’un karşısı yarım, 60’ın karşısı yarım kök üç.
G ozelucgen

# uc-454590 | 3 | 45°–45°–90° üçgeni
L ~Kenarlar (45°, 45°, 90° karşısındakiler sırasıyla)
R k,\ k,\ k\sqrt2
X k,\ k,\ 2k ;; k,\ k,\ k\sqrt3 ;; k,\ k\sqrt2,\ 2k
W Karenin köşegeniyle ikiye bölünmüş hâlidir.

# uc-esitsizlik | 3 | Üçgen eşitsizliği
L ~Bir üçgende $a$ kenarı için
O :
R |b-c|<a<b+c
X |b-c|\le a\le b+c ;; a>b+c ;; a<|b-c|
W İki kenarın toplamı üçüncüden büyük, farkı ise küçük olmalı; aksi hâlde kenarlar kapanmaz.
E $b=4$, $c=7$ ise $3<a<11$.
G ucgenesitsizlik

# uc-alan | 3 | Üçgenin alanı
L A
R \dfrac{a\cdot h_a}{2}
X a\cdot h_a ;; \dfrac{a\cdot h_b}{2} ;; \dfrac{a+h_a}{2}
K $h_a$: $a$ kenarına ait yükseklik
W Üçgen, aynı taban ve yükseklikli paralelkenarın yarısıdır.

# uc-heron | 2 | Heron formülü
L A
R \sqrt{u(u-a)(u-b)(u-c)}
X \sqrt{u(u+a)(u+b)(u+c)} ;; u(u-a)(u-b)(u-c) ;; \sqrt{(u-a)(u-b)(u-c)}
K $u=\dfrac{a+b+c}{2}$ (yarı çevre)
E Kenarları $13, 14, 15$: $u=21$, alan $=\sqrt{21\cdot 8\cdot 7\cdot 6}=84$.
S İskenderiyeli Heron (MS 1. yüzyıl) bu formülü “Metrica” adlı eserinde verdi.
G heron

# uc-eskenaralan | 3 | Eşkenar üçgenin alanı
L A
R \dfrac{a^2\sqrt3}{4}
X \dfrac{a^2\sqrt3}{2} ;; \dfrac{a^2\sqrt2}{4} ;; \dfrac{a\sqrt3}{2}
K $a$: kenar uzunluğu
E $a=4$ ise alan $4\sqrt3$.
G eskenar

# uc-eskenarh | 3 | Eşkenar üçgenin yüksekliği
L h
R \dfrac{a\sqrt3}{2}
X \dfrac{a\sqrt2}{2} ;; \dfrac{a}{2} ;; a\sqrt3
K $a$: kenar uzunluğu
W Yükseklik eşkenar üçgeni iki tane 30°-60°-90° üçgenine böler.

# uc-icteget | 2 | İç teğet çember ve alan
L A
R r\cdot u
X 2r\cdot u ;; \dfrac{r\cdot u}{2} ;; \pi r^2
K $r$: iç teğet çemberin yarıçapı, $u$: yarı çevre
W İç merkezden köşelere çizilen doğrular üçgeni, yüksekliği $r$ olan üç üçgene böler.

# uc-cevrel | 2 | Çevrel çember ve alan
L A
R \dfrac{a\cdot b\cdot c}{4R}
X \dfrac{a\cdot b\cdot c}{2R} ;; \dfrac{a\cdot b\cdot c}{R} ;; \dfrac{a+b+c}{4R}
K $R$: çevrel çemberin yarıçapı
W $A=\tfrac12 bc\sin A$ ve $\sin A=\tfrac{a}{2R}$ birleştirilir.

# uc-kenarortay | 2 | Kenarortay teoremi
L b^2+c^2
R 2V_a^2+\dfrac{a^2}{2}
X V_a^2+\dfrac{a^2}{2} ;; 2V_a^2+a^2 ;; 2V_a^2+\dfrac{a^2}{4}
K $V_a$: $a$ kenarına ait kenarortay
E $b=c=5$, $a=6$ ise $50=2V_a^2+18$, $V_a=4$.

# uc-agirlik | 2 | Ağırlık merkezi oranı
L |AG|
R 2\,|GD|
X |GD| ;; 3\,|GD| ;; \dfrac{|GD|}{2}
K $G$: ağırlık merkezi, $[AD]$: kenarortay
W Kenarortaylar ağırlık merkezinde köşeden itibaren $2:1$ oranında bölünür.

# uc-hipotenus | 3 | Hipotenüse ait kenarortay
L V_a
R \dfrac{a}{2}
X a ;; \dfrac{a}{3} ;; \dfrac{a\sqrt2}{2}
K Dik üçgende $a$: hipotenüs
W Dik üçgenin çevrel çemberinin merkezi hipotenüsün orta noktasıdır; üç köşe de merkeze eşit uzaklıktadır.

# uc-aciortay | 3 | İç açıortay teoremi
L \dfrac{|BD|}{|DC|}
R \dfrac{c}{b}
X \dfrac{b}{c} ;; \dfrac{c^2}{b^2} ;; 1
K $[AD]$, $\hat A$’nın iç açıortayı; $c=|AB|$, $b=|AC|$
W Açıortay karşı kenarı, komşu kenarların oranında böler.
E $c=6$, $b=9$, $|BC|=10$ ise $|BD|=4$, $|DC|=6$.
G aciortay

# uc-aciortayuzun | 1 | Açıortay uzunluğu
L n_A^2
R b\cdot c-x\cdot y
X b\cdot c+x\cdot y ;; x\cdot y-b\cdot c ;; b^2+c^2-x\cdot y
K $x=|BD|$, $y=|DC|$; $n_A$: iç açıortay uzunluğu

# uc-benzerlik | 3 | Benzer üçgenlerde alan oranı
L \dfrac{A_1}{A_2}
R k^2
X k ;; k^3 ;; 2k
K $k$: benzerlik oranı
W Uzunluklar $k$, alanlar $k^2$, hacimler $k^3$ oranında değişir.
E Kenarları 2 katına çıkan üçgenin alanı 4 katına çıkar.

# uc-tales | 3 | Temel orantı teoremi (Tales)
L \dfrac{|AD|}{|AB|}
R \dfrac{|AE|}{|AC|}=\dfrac{|DE|}{|BC|}
X \dfrac{|AE|}{|EC|}=\dfrac{|DE|}{|BC|} ;; \dfrac{|DB|}{|AB|}=\dfrac{|DE|}{|BC|} ;; \dfrac{|AE|}{|AC|}=\dfrac{|BC|}{|DE|}
K $D\in[AB]$, $E\in[AC]$ ve $DE\parallel BC$
W $ADE$ ile $ABC$ benzerdir; aynı köşeden ölçülen uzunluklar orantılıdır.

# uc-ceva | 1 | Ceva ve Menelaus
L \dfrac{|AF|}{|FB|}\cdot\dfrac{|BD|}{|DC|}\cdot\dfrac{|CE|}{|EA|}
R 1
X 0 ;; 2 ;; \dfrac12
K Ceva: $AD$, $BE$, $CF$ tek noktada kesişirse. Menelaus: $D, E, F$ bir doğru üzerindeyse (uzunluklarla)
W Köşeden başla, kenarlar boyunca dolaş: oranların çarpımı 1’dir.

# uc-stewart | 1 | Stewart teoremi
L b^2\,m+c^2\,n
R a\,(d^2+m\,n)
X a\,(d^2-m\,n) ;; d\,(a^2+m\,n) ;; a\,d^2+m\,n
K $D\in[BC]$, $|BD|=m$, $|DC|=n$, $|AD|=d$, $a=m+n$, $b=|AC|$, $c=|AB|$
H İngilizce kalıp: $man+dad=bmb+cnc$ (“a man and his dad put a bomb in the sink”).

## cokgen

# ck-ic | 3 | Çokgenin iç açıları toplamı
L ~$n$-genin iç açıları toplamı
R (n-2)\cdot 180^\circ
X n\cdot 180^\circ ;; (n-1)\cdot 180^\circ ;; (n-2)\cdot 360^\circ
W Bir köşeden çizilen köşegenler çokgeni $n-2$ üçgene böler.
E Altıgen: $4\cdot 180^\circ=720^\circ$.
G icaci

# ck-dis | 3 | Dış açılar toplamı
L ~Herhangi bir dışbükey çokgenin dış açıları toplamı
R 360^\circ
X (n-2)\cdot 180^\circ ;; 180^\circ ;; n\cdot 360^\circ
W Çokgenin çevresinde bir tur yürürsen toplam $360^\circ$ dönersin.

# ck-duzgundis | 2 | Düzgün çokgende bir dış açı
L ~Düzgün $n$-genin bir dış açısı
R \dfrac{360^\circ}{n}
X \dfrac{180^\circ}{n} ;; \dfrac{(n-2)\cdot 180^\circ}{n} ;; 360^\circ-n
E Düzgün sekizgenin bir dış açısı $45^\circ$.
G disaci

# ck-duzgunic | 2 | Düzgün çokgende bir iç açı
L ~Düzgün $n$-genin bir iç açısı
R \dfrac{(n-2)\cdot 180^\circ}{n}
X \dfrac{360^\circ}{n} ;; \dfrac{n\cdot 180^\circ}{n-2} ;; (n-2)\cdot 180^\circ
E Düzgün beşgenin bir iç açısı $108^\circ$.

# ck-kosegen | 3 | Köşegen sayısı
L ~$n$-genin köşegen sayısı
R \dfrac{n\,(n-3)}{2}
X n\,(n-3) ;; \dfrac{n\,(n-1)}{2} ;; n-3
W Her köşeden $n-3$ köşegen çıkar; her köşegen iki kez sayıldığı için 2’ye bölünür.
E Altıgenin $\tfrac{6\cdot 3}{2}=9$ köşegeni vardır.
G kosegen

# ck-birkose | 2 | Bir köşeden çizilen köşegenler
L ~$n$-genin bir köşesinden çizilebilen köşegen sayısı
R n-3
X n-2 ;; n-1 ;; \dfrac{n}{2}
W Köşe kendisine ve iki komşusuna köşegen çizemez. Bu köşegenler $n-2$ üçgen oluşturur.

# ck-dikdortgen | 2 | Dikdörtgenin köşegeni
L e
R \sqrt{a^2+b^2}
X a+b ;; \sqrt{a\cdot b} ;; \sqrt2\,a
K $a, b$: kenarlar
W Köşegen, dikdörtgeni iki dik üçgene ayırır.

# ck-kare | 2 | Karenin köşegeni
L e
R a\sqrt2
X a\sqrt3 ;; 2a ;; \dfrac{a\sqrt2}{2}
K $a$: kenar

# ck-paralel | 2 | Paralelkenarın alanı
L A
R a\cdot b\cdot\sin\alpha
X \dfrac{a\cdot b\cdot\sin\alpha}{2} ;; a\cdot b ;; a\cdot b\cdot\cos\alpha
K $a, b$: komşu kenarlar, $\alpha$: aralarındaki açı (veya $A=a\cdot h_a$)
W Köşegen paralelkenarı iki eş üçgene böler; her biri $\tfrac12 ab\sin\alpha$.

# ck-eskenar | 2 | Eşkenar dörtgenin alanı
L A
R \dfrac{e\cdot f}{2}
X e\cdot f ;; \dfrac{e+f}{2} ;; \dfrac{e\cdot f}{4}
K $e, f$: köşegenler (birbirine dik)
W Köşegenleri dik olan her dörtgende alan $\tfrac{e\cdot f}{2}$’dir (deltoid, kare de dahil).

# ck-yamuk | 3 | Yamuğun alanı
L A
R \dfrac{(a+c)\cdot h}{2}
X (a+c)\cdot h ;; \dfrac{a\cdot c\cdot h}{2} ;; \dfrac{(a-c)\cdot h}{2}
K $a, c$: paralel tabanlar, $h$: yükseklik
W Yamuğun bir kopyasını ters çevirip yanına koy: tabanı $a+c$ olan bir paralelkenar oluşur.
E $a=10$, $c=6$, $h=5$: alan $40$.
G yamuk

# ck-ortataban | 2 | Yamuğun orta tabanı
L |EF|
R \dfrac{a+c}{2}
X \dfrac{a-c}{2} ;; a+c ;; \sqrt{a\,c}
K $E, F$: yan kenarların orta noktaları; $a, c$: tabanlar

# ck-dortgen | 1 | Dörtgenin köşegenlerle alanı
L A
R \dfrac12\,e\,f\sin\theta
X e\,f\sin\theta ;; \dfrac12\,e\,f\cos\theta ;; \dfrac14\,e\,f\sin\theta
K $e, f$: köşegenler, $\theta$: aralarındaki açı

# ck-altigen | 2 | Düzgün altıgenin alanı
L A
R \dfrac{3a^2\sqrt3}{2}
X \dfrac{a^2\sqrt3}{4} ;; 6a^2 ;; 3a^2\sqrt3
K $a$: kenar
W Düzgün altıgen 6 eşkenar üçgenden oluşur: $6\cdot\tfrac{a^2\sqrt3}{4}$.

## cember

# cm-cevre | 3 | Çemberin çevresi
L ~Çemberin çevresi
R 2\pi r
X \pi r^2 ;; \pi r ;; 2\pi r^2
W $\pi$, her çemberde çevrenin çapa oranıdır: $\pi=\tfrac{\text{çevre}}{2r}$.
S Arşimet, çember içine ve dışına 96 kenarlı çokgenler çizerek $3\tfrac{10}{71}<\pi<3\tfrac17$ olduğunu gösterdi.
G cevre

# cm-alan | 3 | Dairenin alanı
L ~Dairenin alanı
R \pi r^2
X 2\pi r ;; \pi^2 r ;; \dfrac{\pi r^2}{2}
W Daireyi ince dilimlere ayırıp yan yana diz: yaklaşık $\pi r\times r$ boyutlu bir dikdörtgen oluşur.
G dairealan

# cm-yay | 3 | Yay uzunluğu
L \ell
R 2\pi r\cdot\dfrac{\alpha}{360^\circ}
X \pi r^2\cdot\dfrac{\alpha}{360^\circ} ;; 2\pi r\cdot\dfrac{\alpha}{180^\circ} ;; \pi r\cdot\dfrac{\alpha}{360^\circ}
K $\alpha$: yayı gören merkez açı (derece)
W Yay, çevrenin $\tfrac{\alpha}{360}$’lık kısmıdır. Radyanla daha sade: $\ell=r\theta$.
G yay

# cm-dilim | 3 | Daire diliminin alanı
L A
R \pi r^2\cdot\dfrac{\alpha}{360^\circ}
X 2\pi r\cdot\dfrac{\alpha}{360^\circ} ;; \pi r^2\cdot\dfrac{\alpha}{180^\circ} ;; \pi r\cdot\dfrac{\alpha}{360^\circ}
K $\alpha$: merkez açı (derece)
G dilim

# cm-dilim2 | 2 | Dilim alanı (yay ile)
L A
R \dfrac{\ell\cdot r}{2}
X \ell\cdot r ;; \dfrac{\ell\cdot r^2}{2} ;; \dfrac{\ell}{2r}
K $\ell$: dilimin yay uzunluğu
W Dilim, tabanı $\ell$ ve yüksekliği $r$ olan bir “üçgen” gibi davranır.

# cm-merkez | 3 | Merkez açı
L ~Merkez açının ölçüsü
R ~Gördüğü yayın ölçüsüne eşittir
X ~Gördüğü yayın yarısıdır ;; ~Gördüğü yayın iki katıdır ;; ~$180^\circ$’den gördüğü yayın çıkarılmasıyla bulunur

# cm-cevreaci | 3 | Çevre açı
L ~Çevre açının ölçüsü
R ~Gördüğü yayın yarısıdır
X ~Gördüğü yayın ölçüsüne eşittir ;; ~Gördüğü yayın iki katıdır ;; ~Gördüğü yayın üçte biridir
W Aynı yayı gören çevre açılar eşittir; çapı gören çevre açı $90^\circ$’dir.
H Çevrede durursan yayın yarısını görürsün.

# cm-tegetkiris | 2 | Teğet–kiriş açı
L ~Teğet–kiriş açının ölçüsü
R ~Gördüğü yayın yarısıdır
X ~Gördüğü yaya eşittir ;; ~Gördüğü yayın iki katıdır ;; ~Her zaman $90^\circ$’dir
W Köşesi çember üzerinde olduğu için çevre açı gibi davranır.

# cm-icaci | 2 | Çember içinde kesişen kirişler
L \alpha
R \dfrac{a+b}{2}
X \dfrac{a-b}{2} ;; a+b ;; \dfrac{a\cdot b}{2}
K İki kiriş çemberin içinde kesişiyor; $a, b$: açının ve ters açısının gördüğü yaylar
H İçeride topla, dışarıda çıkar; ikisinde de yarıla.

# cm-disaci | 2 | Çember dışında kesişen kesenler
L \alpha
R \dfrac{a-b}{2}
X \dfrac{a+b}{2} ;; a-b ;; \dfrac{a}{2}
K İki kesen (veya teğet) çemberin dışında kesişiyor; $a$: büyük yay, $b$: küçük yay

# cm-kuvvetic | 2 | Kesişen kirişler (kuvvet)
L |PA|\cdot|PB|
R |PC|\cdot|PD|
X |PC|+|PD| ;; |PA|\cdot|PC| ;; |PB|\cdot|PD|
K $[AB]$ ve $[CD]$ kirişleri $P$ noktasında kesişiyor
W $PAC$ ve $PDB$ üçgenleri benzerdir.

# cm-kuvvetdis | 2 | Teğet–kesen (kuvvet)
L |PT|^2
R |PA|\cdot|PB|
X |PA|\cdot|AB| ;; |AB|^2 ;; |PA|+|PB|
K $PT$ teğet; $P, A, B$ doğrusal ve $A, B$ çember üzerinde

# cm-teget | 3 | Dış noktadan çizilen teğetler
L ~Dış bir noktadan çizilen iki teğet parçası
R ~Uzunlukları eşittir
X ~Birbirine diktir ;; ~Uzunluklarının oranı $1:2$’dir ;; ~Toplamları çapa eşittir
W Merkezle birleştirilince iki eş dik üçgen oluşur.

# cm-tegetdik | 3 | Teğet ve yarıçap
L ~Teğet ile değme noktasındaki yarıçap
R ~Birbirine diktir
X ~Birbirine paraleldir ;; ~$45^\circ$’lik açı yapar ;; ~Eşit uzunluktadır

# cm-kirisler | 2 | Kirişler dörtgeni
L \hat A+\hat C
R 180^\circ
X 360^\circ ;; 90^\circ ;; \hat B
K Dört köşesi de çember üzerinde olan dörtgen; $\hat A$ ile $\hat C$ karşılıklı
W Karşılıklı açılar tüm çemberi oluşturan iki yayın yarılarını görür: $\tfrac{360^\circ}{2}$.

# cm-tegetler | 2 | Teğetler dörtgeni
L a+c
R b+d
X a+b ;; \dfrac{b+d}{2} ;; b\cdot d
K Dört kenarı da içteki çembere teğet; $a, c$ ve $b, d$ karşılıklı kenarlar
W Her köşeden çıkan iki teğet parçası eşittir; karşılıklı kenar toplamları aynı parçalardan oluşur.

# cm-batlamyus | 1 | Batlamyus teoremi
L a\,c+b\,d
R e\,f
X e+f ;; \dfrac{e\,f}{2} ;; e^2+f^2
K Kirişler dörtgeni; $a,c$ ve $b,d$ karşılıklı kenarlar; $e, f$ köşegenler
S Batlamyus (MS 2. yüzyıl) bu teoremi kiriş tablolarını hesaplamak ve gökyüzünü modellemek için kullandı.

# cm-denklem | 3 | Çember denklemi
L ~Merkezi $M(a,b)$, yarıçapı $r$ olan çember
O :
R (x-a)^2+(y-b)^2=r^2
X (x+a)^2+(y+b)^2=r^2 ;; (x-a)^2+(y-b)^2=r ;; (x-a)+(y-b)=r^2
W Çember, merkeze uzaklığı $r$ olan noktaların kümesidir; uzaklık formülünün karesi.
G cemberdenklem

# cm-genel | 2 | Genel çember denklemi
L x^2+y^2+Dx+Ey+F=0
O \Rightarrow
R M\!\left(-\dfrac{D}{2},-\dfrac{E}{2}\right),\ r=\dfrac{\sqrt{D^2+E^2-4F}}{2}
X M\!\left(\dfrac{D}{2},\dfrac{E}{2}\right),\ r=\dfrac{\sqrt{D^2+E^2-4F}}{2} ;; M\!\left(-D,-E\right),\ r=\sqrt{D^2+E^2-4F} ;; M\!\left(-\dfrac{D}{2},-\dfrac{E}{2}\right),\ r=\dfrac{\sqrt{D^2+E^2+4F}}{2}
W Tam kareye tamamla: $\left(x+\tfrac D2\right)^2+\left(y+\tfrac E2\right)^2=\tfrac{D^2+E^2-4F}{4}$.

## analitik

# an-uzaklik | 3 | İki nokta arası uzaklık
L |AB|
R \sqrt{(x_2-x_1)^2+(y_2-y_1)^2}
X (x_2-x_1)^2+(y_2-y_1)^2 ;; |x_2-x_1|+|y_2-y_1| ;; \sqrt{(x_2+x_1)^2+(y_2+y_1)^2}
K $A(x_1,y_1)$, $B(x_2,y_2)$
W Koordinat düzleminde Pisagor teoremi.
E $A(1,2)$, $B(4,6)$: $|AB|=\sqrt{9+16}=5$.
G uzaklik

# an-orta | 3 | Orta nokta
L M
R \left(\dfrac{x_1+x_2}{2},\ \dfrac{y_1+y_2}{2}\right)
X \left(\dfrac{x_2-x_1}{2},\ \dfrac{y_2-y_1}{2}\right) ;; (x_1+x_2,\ y_1+y_2) ;; \left(\dfrac{x_1+y_1}{2},\ \dfrac{x_2+y_2}{2}\right)
K $[AB]$ doğru parçasının orta noktası
G ortanokta

# an-egim | 3 | İki noktadan geçen doğrunun eğimi
L m
R \dfrac{y_2-y_1}{x_2-x_1}
X \dfrac{x_2-x_1}{y_2-y_1} ;; \dfrac{y_2+y_1}{x_2+x_1} ;; \dfrac{y_2-y_1}{x_1-x_2}
W Eğim = dikey değişim / yatay değişim.
H Yükseliş bölü koşu.
G egim

# an-egimtan | 2 | Eğim ve açı
L m
R \tan\alpha
X \sin\alpha ;; \cot\alpha ;; \cos\alpha
K $\alpha$: doğrunun $x$ ekseniyle pozitif yönde yaptığı açı

# an-egimgenel | 2 | Genel denklemde eğim
L ~$ax+by+c=0$ doğrusunun eğimi
R -\dfrac{a}{b}
X \dfrac{a}{b} ;; -\dfrac{b}{a} ;; -\dfrac{c}{b}
K $b\ne 0$
W $y$’yi yalnız bırak: $y=-\tfrac ab x-\tfrac cb$.

# an-dogru | 3 | Nokta–eğim denklemi
L y-y_1
R m\,(x-x_1)
X m\,(x+x_1) ;; \dfrac{x-x_1}{m} ;; m\,x-x_1
K $(x_1,y_1)$ noktasından geçen, eğimi $m$ olan doğru

# an-eksen | 2 | Eksenleri kesen doğru
L \dfrac{x}{a}+\dfrac{y}{b}
R 1
X 0 ;; a+b ;; ab
K $x$ eksenini $(a,0)$’da, $y$ eksenini $(0,b)$’de keser

# an-paralel | 3 | Paralel doğrular
L ~Paralel doğrular
O :
R m_1=m_2
X m_1\cdot m_2=-1 ;; m_1=-m_2 ;; m_1\cdot m_2=1

# an-dik | 3 | Dik doğrular
L ~Dik doğrular
O :
R m_1\cdot m_2=-1
X m_1=m_2 ;; m_1\cdot m_2=1 ;; m_1+m_2=0
W Bir doğruyu $90^\circ$ döndürünce eğim ters çevrilip işaret değiştirir.
E $m_1=\tfrac23$ ise dik doğrunun eğimi $-\tfrac32$.

# an-noktadogru | 3 | Noktanın doğruya uzaklığı
L d
R \dfrac{|a x_0+b y_0+c|}{\sqrt{a^2+b^2}}
X \dfrac{|a x_0+b y_0+c|}{a^2+b^2} ;; \dfrac{a x_0+b y_0+c}{a+b} ;; \sqrt{\dfrac{|a x_0+b y_0+c|}{a^2+b^2}}
K $P(x_0,y_0)$ noktası ve $ax+by+c=0$ doğrusu
E $(1,2)$ noktasının $3x+4y-1=0$ doğrusuna uzaklığı $\tfrac{|3+8-1|}{5}=2$.
G noktadogru

# an-paraleluzak | 2 | Paralel doğrular arası uzaklık
L d
R \dfrac{|c_1-c_2|}{\sqrt{a^2+b^2}}
X \dfrac{|c_1+c_2|}{\sqrt{a^2+b^2}} ;; \dfrac{|c_1-c_2|}{a^2+b^2} ;; |c_1-c_2|
K $ax+by+c_1=0$ ve $ax+by+c_2=0$

# an-agirlik | 2 | Üçgenin ağırlık merkezi
L G
R \left(\dfrac{x_1+x_2+x_3}{3},\ \dfrac{y_1+y_2+y_3}{3}\right)
X \left(\dfrac{x_1+x_2+x_3}{2},\ \dfrac{y_1+y_2+y_3}{2}\right) ;; (x_1+x_2+x_3,\ y_1+y_2+y_3) ;; \left(\dfrac{x_1+y_1}{3},\ \dfrac{x_2+y_2}{3}\right)
W Köşelerin koordinat ortalaması.

# an-alan | 1 | Köşeleri bilinen üçgenin alanı
L A
R \dfrac12\left|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)\right|
X \left|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)\right| ;; \dfrac12\left|x_1y_1+x_2y_2+x_3y_3\right| ;; \dfrac13\left|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)\right|
W Ayakkabı bağı (shoelace) yöntemi olarak da bilinir.

## donusum

# dn-orijin | 2 | Orijine göre simetri
L ~$(x,y)$ noktasının orijine göre simetriği
R (-x,-y)
X (-x,y) ;; (x,-y) ;; (y,x)

# dn-xeksen | 2 | $x$ eksenine göre simetri
L ~$(x,y)$ noktasının $x$ eksenine göre simetriği
R (x,-y)
X (-x,y) ;; (-x,-y) ;; (y,x)
W Eksen üzerindeki koordinat aynı kalır, diğerinin işareti değişir.

# dn-yeksen | 2 | $y$ eksenine göre simetri
L ~$(x,y)$ noktasının $y$ eksenine göre simetriği
R (-x,y)
X (x,-y) ;; (-x,-y) ;; (-y,x)

# dn-yx | 2 | $y=x$ doğrusuna göre simetri
L ~$(x,y)$ noktasının $y=x$ doğrusuna göre simetriği
R (y,x)
X (-y,-x) ;; (-x,y) ;; (x,-y)
W Koordinatlar yer değiştirir; bu yüzden $f$ ve $f^{-1}$ grafikleri $y=x$’e göre simetriktir.

# dn-donme | 1 | Orijin etrafında $90^\circ$ dönme
L ~$(x,y)$’nin orijin etrafında pozitif yönde $90^\circ$ dönmüşü
R (-y,x)
X (y,-x) ;; (-x,-y) ;; (y,x)
E $(1,0)$ noktası $90^\circ$ dönünce $(0,1)$ olur.

# dn-saga | 1 | Grafiği sağa ötelemek
L ~$y=f(x)$ grafiğini $a$ birim sağa ötelemek ($a>0$)
O :
R y=f(x-a)
X y=f(x+a) ;; y=f(x)-a ;; y=f(x)+a
W İç değişiklikler ters çalışır: sağa gitmek için $x$’ten çıkarırsın.

# dn-yukari | 1 | Grafiği yukarı ötelemek
L ~$y=f(x)$ grafiğini $b$ birim yukarı ötelemek ($b>0$)
O :
R y=f(x)+b
X y=f(x+b) ;; y=f(x-b) ;; y=f(x)-b

## kati

# kt-kup | 3 | Küpün hacmi
L ~Küpün hacmi
R a^3
X 6a^2 ;; 3a ;; a^2
K $a$: ayrıt uzunluğu

# kt-kupalan | 2 | Küpün yüzey alanı
L ~Küpün yüzey alanı
R 6a^2
X 4a^2 ;; a^3 ;; 8a^2
W 6 tane eş kare yüz.

# kt-kupkose | 2 | Küpün cisim köşegeni
L ~Küpün cisim köşegeni
R a\sqrt3
X a\sqrt2 ;; 3a ;; a\sqrt6
W $\sqrt{a^2+a^2+a^2}$; yüz köşegeni ise $a\sqrt2$’dir.

# kt-prizma | 3 | Dikdörtgenler prizmasının hacmi
L ~Dikdörtgenler prizmasının hacmi
R a\,b\,c
X 2(ab+ac+bc) ;; a+b+c ;; \dfrac{a\,b\,c}{3}

# kt-prizmaalan | 2 | Dikdörtgenler prizmasının yüzey alanı
L ~Dikdörtgenler prizmasının yüzey alanı
R 2(ab+ac+bc)
X ab+ac+bc ;; abc ;; 4(ab+ac+bc)
W Karşılıklı yüzler eştir: üç farklı dikdörtgenin ikişer tanesi.

# kt-prizmakose | 2 | Dikdörtgenler prizmasının cisim köşegeni
L ~Dikdörtgenler prizmasının cisim köşegeni
R \sqrt{a^2+b^2+c^2}
X a+b+c ;; \sqrt{a^2+b^2} ;; \sqrt{ab+bc+ca}
W Pisagor’u iki kez uygula: önce taban köşegeni, sonra cisim köşegeni.

# kt-silindir | 3 | Silindirin hacmi
L ~Silindirin hacmi
R \pi r^2 h
X 2\pi r h ;; \dfrac{\pi r^2 h}{3} ;; \pi r h^2
W Taban alanı × yükseklik.
G silindir

# kt-silindiryan | 2 | Silindirin yanal alanı
L ~Silindirin yanal alanı
R 2\pi r h
X \pi r h ;; 2\pi r(r+h) ;; \pi r^2 h
W Yanal yüzey açılınca kenarları $2\pi r$ ve $h$ olan bir dikdörtgen olur. Tüm yüzey: $2\pi r(r+h)$.

# kt-koni | 3 | Koninin hacmi
L ~Koninin hacmi
R \dfrac{\pi r^2 h}{3}
X \pi r^2 h ;; \dfrac{\pi r^2 h}{2} ;; \dfrac{\pi r h^2}{3}
W Aynı taban ve yükseklikteki silindirin üçte biridir.
G koni

# kt-koniyan | 2 | Koninin yanal alanı
L ~Koninin yanal alanı
R \pi r\ell
X 2\pi r\ell ;; \pi r h ;; \pi \ell^2
K $\ell=\sqrt{r^2+h^2}$: ana doğru
W Açınım bir daire dilimidir: yay uzunluğu $2\pi r$, yarıçapı $\ell$.

# kt-kure | 3 | Kürenin hacmi
L ~Kürenin hacmi
R \dfrac43\pi r^3
X 4\pi r^2 ;; \dfrac43\pi r^2 ;; \dfrac13\pi r^3
S Arşimet, kürenin hacminin onu çevreleyen silindirin $\tfrac23$’ü olduğunu kanıtladı ve mezar taşına bu şeklin çizilmesini istedi.
G kure

# kt-kurealan | 3 | Kürenin yüzey alanı
L ~Kürenin yüzey alanı
R 4\pi r^2
X \pi r^2 ;; \dfrac43\pi r^3 ;; 2\pi r^2
W Büyük dairenin alanının tam 4 katı.

# kt-piramit | 2 | Piramidin hacmi
L ~Piramidin hacmi
R \dfrac{A_t\cdot h}{3}
X A_t\cdot h ;; \dfrac{A_t\cdot h}{2} ;; \dfrac{A_t\cdot h}{6}
K $A_t$: taban alanı, $h$: yükseklik
W Sivri uçlu her cisim (koni, piramit) aynı tabanlı prizmanın üçte biridir.

# kt-euler | 2 | Euler çokyüzlü formülü
L K-A+Y
R 2
X 0 ;; 1 ;; 4
K $K$: köşe, $A$: ayrıt, $Y$: yüz sayısı (dışbükey çokyüzlü)
E Küp: $8-12+6=2$
S Euler bu bağıntıyı 1750’de Christian Goldbach’a yazdığı bir mektupta duyurdu.

# kt-kesikkoni | 1 | Kesik koninin hacmi
L ~Kesik koninin hacmi
R \dfrac{\pi h}{3}\left(R^2+R\,r+r^2\right)
X \dfrac{\pi h}{3}\left(R^2+r^2\right) ;; \pi h\left(R^2+R\,r+r^2\right) ;; \dfrac{\pi h}{3}\left(R+r\right)^2
K $R, r$: taban yarıçapları, $h$: yükseklik

# kt-dortyuzlu | 1 | Düzgün dörtyüzlünün hacmi
L ~Düzgün dörtyüzlünün hacmi
R \dfrac{a^3\sqrt2}{12}
X \dfrac{a^3\sqrt3}{12} ;; \dfrac{a^3\sqrt2}{6} ;; \dfrac{a^3}{6}
K $a$: ayrıt uzunluğu
`;
