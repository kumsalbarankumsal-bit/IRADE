/* TYT formülleri — biçim için formulas.js başındaki açıklamaya bak. */
export default String.raw`
## sayilar

# sy-gauss | 3 | Ardışık sayıların toplamı (Gauss)
L 1+2+3+\dots+n
R \dfrac{n(n+1)}{2}
X \dfrac{n(n-1)}{2} ;; n(n+1) ;; \dfrac{n^2+1}{2}
W İlk ve son terimi eşleştir: $1+n$, $2+(n-1)$, … her çift $n+1$ eder ve $\tfrac n2$ tane çift vardır.
E $1+2+\dots+20=\tfrac{20\cdot 21}{2}=210$
H Son sayı çarpı bir fazlası, bölü iki.
S Anlatılana göre küçük Gauss, öğretmeni 1’den 100’e kadar toplamayı sorduğunda sayıları uçlardan eşleyip saniyeler içinde 5050 demiştir.
G gauss
V n:int:1:30

# sy-cift | 2 | Ardışık çift sayıların toplamı
L 2+4+6+\dots+2n
R n(n+1)
X \dfrac{n(n+1)}{2} ;; n^2 ;; 2n(n+1)
W Her terim 2 ile çarpılmış Gauss toplamıdır: $2\cdot\tfrac{n(n+1)}{2}=n(n+1)$.
E $2+4+\dots+30$: $2n=30\Rightarrow n=15$, toplam $15\cdot 16=240$.
G cifttoplam
V n:int:1:30

# sy-tek | 2 | Ardışık tek sayıların toplamı
L 1+3+5+\dots+(2n-1)
R n^2
X n(n+1) ;; \dfrac{n(n+1)}{2} ;; (2n-1)^2
W Tek sayıları üst üste koy: her yeni tek sayı kareyi bir L şeklinde büyütür.
E $1+3+\dots+19$: $2n-1=19\Rightarrow n=10$, toplam $100$.
H Tek sayılar kare örer.
G tektoplam
V n:int:1:30

# sy-terim | 3 | Terim sayısı
L ~Terim sayısı
R \dfrac{\text{son}-\text{ilk}}{\text{fark}}+1
X \dfrac{\text{son}-\text{ilk}}{\text{fark}} ;; \dfrac{\text{son}+\text{ilk}}{\text{fark}} ;; \dfrac{\text{son}-\text{ilk}}{\text{fark}}-1
K Eşit aralıklı (ardışık) sayılarda; fark: ardışık iki terim arasındaki artış
W Aradaki adım sayısına başlangıç terimini de eklemeyi unutma. Bu, klasik “çit direği” hatasıdır.
E $7, 11, 15, \dots, 83$ dizisinde $\tfrac{83-7}{4}+1=20$ terim vardır.
H 10 metrelik çite 1 metre arayla 11 direk gerekir.
G terimsayisi

# sy-ardisik | 3 | Eşit aralıklı sayıların toplamı
L ~Toplam
R \dfrac{(\text{ilk}+\text{son})\cdot n}{2}
X (\text{ilk}+\text{son})\cdot n ;; \dfrac{(\text{son}-\text{ilk})\cdot n}{2} ;; \dfrac{\text{ilk}\cdot\text{son}\cdot n}{2}
K $n$: terim sayısı
W Eşit aralıklı sayıların ortalaması $\tfrac{\text{ilk}+\text{son}}{2}$’dir. Toplam = ortalama × terim sayısı.
E $7+11+\dots+83=\tfrac{(7+83)\cdot 20}{2}=900$
G ardisiktoplam

# sy-kareler | 2 | Kareler toplamı
L 1^2+2^2+\dots+n^2
R \dfrac{n(n+1)(2n+1)}{6}
X \dfrac{n(n+1)(2n+1)}{3} ;; \left(\dfrac{n(n+1)}{2}\right)^2 ;; \dfrac{n(n+1)(n+2)}{6}
E $1^2+2^2+\dots+10^2=\tfrac{10\cdot 11\cdot 21}{6}=385$
H n, bir fazlası, iki katının bir fazlası; bölü altı.
G karetoplam
V n:int:1:25

# sy-kupler | 2 | Küpler toplamı
L 1^3+2^3+\dots+n^3
R \left(\dfrac{n(n+1)}{2}\right)^2
X \dfrac{n^2(n+1)}{2} ;; \dfrac{n(n+1)(2n+1)}{6} ;; \dfrac{n^3(n+1)^3}{8}
W Küpler toplamı, Gauss toplamının karesidir: $1^3+2^3=9=3^2$, $1^3+2^3+3^3=36=6^2$.
E $1^3+2^3+\dots+5^3=15^2=225$
H Küpler toplamı = Gauss’un karesi.
G kuptoplam
V n:int:1:25

# sy-basamak | 3 | Basamak çözümlemesi
L \overline{abc}
R 100a+10b+c
X a+b+c ;; 100c+10b+a ;; 10a+10b+c
K $a, b, c$ rakam, $a\ne 0$
W Her rakam bulunduğu basamağın değeriyle çarpılır: yüzler, onlar, birler.
E $\overline{ab}+\overline{ba}=(10a+b)+(10b+a)=11(a+b)$
G basamak

# sy-taban | 2 | Sayı tabanı çözümlemesi
L (abc)_n
R a\cdot n^2+b\cdot n+c
X a\cdot n^3+b\cdot n^2+c\cdot n ;; (a+b+c)\cdot n ;; a+b\cdot n+c\cdot n^2
K $a,b,c<n$ rakamları $n$ tabanında
W Onluk tabandaki gibi, ama basamak değerleri $n^2, n, 1$ olur.
E $(213)_4=2\cdot 16+1\cdot 4+3=39$
G taban

# sy-devirli | 2 | Devirli ondalık sayıyı kesre çevirme
L ~Devirli ondalık sayı
R \dfrac{\text{tamamı}-\text{devretmeyen}}{\text{devreden kadar }9,\ \text{devretmeyen kadar }0}
X \dfrac{\text{tamamı}-\text{devretmeyen}}{\text{devreden kadar }0,\ \text{devretmeyen kadar }9} ;; \dfrac{\text{tamamı}+\text{devretmeyen}}{\text{devreden kadar }9,\ \text{devretmeyen kadar }0} ;; \dfrac{\text{tamamı}}{\text{devreden kadar }9}
K Virgül yokmuş gibi sayının tamamından devretmeyen kısmı çıkar
W Paydada virgülden sonraki devreden her basamak için bir 9, devretmeyen her basamak için bir 0 yazılır.
E $1{,}2\overline{3}=\tfrac{123-12}{90}=\tfrac{111}{90}=\tfrac{37}{30}$
H Devreden dokuz, durgun sıfır.
G devirli

## bolme

# bl-algoritma | 3 | Bölme algoritması
L A
R B\cdot C+K
X B\cdot K+C ;; B\cdot C-K ;; (B+K)\cdot C
K $A$: bölünen, $B$: bölen, $C$: bölüm, $K$: kalan; $0\le K<B$
W Bölünen = bölen × bölüm + kalan. Kalan her zaman bölenden küçüktür ve negatif olamaz.
E $47=5\cdot 9+2$
G bolme

# bl-3 | 3 | 3 ile bölünebilme
L 3\mid n
O \iff
R ~Rakamlarının toplamı 3’ün katıdır
X ~Son rakamı 3’ün katıdır ;; ~Son iki basamağı 3’ün katıdır ;; ~Rakamlarının toplamı 9’un katıdır
W $10\equiv 1\pmod 3$ olduğundan her basamak değeri 3’e bölümde rakamın kendisi gibi davranır.
E $5172$: $5+1+7+2=15$, 3’ün katı, o hâlde $5172$ de 3’e bölünür.

# bl-4 | 2 | 4 ile bölünebilme
L 4\mid n
O \iff
R ~Son iki basamağın oluşturduğu sayı 4’ün katıdır
X ~Rakamlarının toplamı 4’ün katıdır ;; ~Son rakamı 0, 4 veya 8’dir ;; ~Son rakamı çifttir
W $100$, 4’ün katı olduğu için yüzler ve üstü basamaklar kalanı etkilemez.
E $3716$: $16$, 4’ün katı, o hâlde $3716$ de 4’e bölünür. ($14$ ise 4 ile biter ama 4’e bölünmez.)

# bl-8 | 1 | 8 ile bölünebilme
L 8\mid n
O \iff
R ~Son üç basamağın oluşturduğu sayı 8’in katıdır
X ~Son iki basamağın oluşturduğu sayı 8’in katıdır ;; ~Rakamlarının toplamı 8’in katıdır ;; ~Son rakamı 8’dir
W $1000=8\cdot 125$ olduğundan binler ve üstü basamaklar kalanı etkilemez.
E $5\,416$: $416=8\cdot 52$, o hâlde 8’e bölünür. ($116$’nın son iki basamağı $16$ ama $116$, 8’e bölünmez.)

# bl-9 | 3 | 9 ile bölünebilme
L 9\mid n
O \iff
R ~Rakamlarının toplamı 9’un katıdır
X ~Son iki basamağı 9’un katıdır ;; ~Rakamlarının toplamı 3’ün katıdır ;; ~Son rakamı 9’dur
W $10\equiv 1\pmod 9$. Sayının 9’a bölümünden kalan, rakamları toplamının 9’a bölümünden kalana eşittir.
E $8\,307$: $8+3+0+7=18$, o hâlde 9’a bölünür.

# bl-11 | 2 | 11 ile bölünebilme
L 11\mid n
O \iff
R ~Sağdan başlayıp rakamlara sırayla $+,-,+,\dots$ verilerek bulunan toplam 11’in katıdır
X ~Rakamlarının toplamı 11’in katıdır ;; ~Son iki basamağı 11’in katıdır ;; ~Rakamları soldan $+,+,-,-$ işaretlenince toplam 0’dır
W $10\equiv -1\pmod{11}$ olduğundan basamak değerleri sırayla $+1$ ve $-1$ gibi davranır.
E $8\,371$: $1-7+3-8=-11$, o hâlde 11’e bölünür ($8371=11\cdot 761$).

# bl-bolensayisi | 3 | Pozitif bölen sayısı
L ~$n=a^x\cdot b^y\cdot c^z$ ise pozitif bölen sayısı
R (x+1)(y+1)(z+1)
X x\cdot y\cdot z ;; (x-1)(y-1)(z-1) ;; x+y+z+1
K $a, b, c$ farklı asal sayılar
W Her bölen, $a$’nın üssünü $0,1,\dots,x$ arasından ($x+1$ seçenek), $b$’ninkini $0,\dots,y$ arasından seçerek oluşur; seçimler çarpılır.
E $72=2^3\cdot 3^2$ olduğundan $(3+1)(2+1)=12$ pozitif böleni vardır.
H Üslere bir ekle, hepsini çarp.
G bolensayisi

# bl-tambolen | 2 | Tam sayı bölen sayısı
L ~Tam sayı bölenlerinin sayısı
R ~Pozitif bölen sayısının 2 katı
X ~Pozitif bölen sayısına eşit ;; ~Pozitif bölen sayısının 1 fazlası ;; ~Pozitif bölen sayısının karesi
W Her pozitif bölenin bir de negatif eşi vardır: $3$ ve $-3$ gibi.
E $12$’nin 6 pozitif böleni olduğundan 12 tam sayı böleni vardır.

# bl-ebobekok | 3 | EBOB × EKOK
L \text{EBOB}(a,b)\cdot\text{EKOK}(a,b)
R a\cdot b
X a+b ;; \dfrac{a\cdot b}{2} ;; (a\cdot b)^2
K $a, b$ pozitif tam sayılar
W EBOB ortak asal çarpanların küçük üslerini, EKOK büyük üslerini alır; ikisi birlikte her çarpanı tam bir kez kullanır.
E $\text{EBOB}(12,18)=6$, $\text{EKOK}(12,18)=36$ ve $6\cdot 36=216=12\cdot 18$.
G ebobekok

# bl-sifir | 2 | Faktöriyelin sonundaki sıfırlar
L ~$n!$ sayısının sonundaki sıfır sayısı
R \left\lfloor\dfrac{n}{5}\right\rfloor+\left\lfloor\dfrac{n}{25}\right\rfloor+\left\lfloor\dfrac{n}{125}\right\rfloor+\cdots
X \left\lfloor\dfrac{n}{10}\right\rfloor ;; \left\lfloor\dfrac{n}{5}\right\rfloor ;; \left\lfloor\dfrac{n}{2}\right\rfloor+\left\lfloor\dfrac{n}{5}\right\rfloor
W Her sondaki sıfır bir $2\cdot 5$ çiftinden gelir. 5 çarpanları 2’lerden az olduğu için 5’leri saymak yeter; 25 iki tane 5 içerir.
E $100!$ için $20+4=24$ sıfır.
H Beşe böl, bölümü yine beşe böl, hepsini topla.
G sifirsayisi

## uslu

# us-carpim | 3 | Aynı tabanlı üslü çarpım
L a^m\cdot a^n
R a^{m+n}
X a^{m\cdot n} ;; a^{m-n} ;; 2a^{m+n}
W Taban $m$ kez ve $n$ kez çarpılıyor; toplamda $m+n$ kez.
E $2^3\cdot 2^4=2^7=128$
H Tabanlar aynıysa üsler toplanır.
G uscarpim
V a:0.5:2,m:-2:3,n:-2:3

# us-bolum | 3 | Aynı tabanlı üslü bölüm
L \dfrac{a^m}{a^n}
R a^{m-n}
X a^{m/n} ;; a^{m+n} ;; a^{n-m}
K $a\ne 0$
E $\tfrac{5^7}{5^4}=5^3=125$
H Bölmede üsler çıkarılır.
V a:0.5:2,m:-2:3,n:-2:3

# us-us | 3 | Üssün üssü
L (a^m)^n
R a^{m\cdot n}
X a^{m+n} ;; a^{m^n} ;; m\cdot a^n
W Dikkat: $(a^m)^n$ ile $a^{m^n}$ farklıdır. $(2^3)^2=2^6$ ama $2^{3^2}=2^9$.
E $(3^2)^3=3^6=729$
V a:0.5:2,m:0.5:3,n:0.5:3

# us-negatif | 3 | Negatif üs
L a^{-n}
R \dfrac{1}{a^n}
X -a^n ;; -\dfrac{1}{a^n} ;; a^{1/n}
K $a\ne 0$
W Negatif üs işaret değiştirmez; tabanı ters çevirir.
E $2^{-3}=\tfrac18$
H Eksi üs kesri ters çevirir.
V a:0.5:3,n:0.5:3

# us-sifir | 2 | Sıfırıncı kuvvet
L a^0
R 1
X 0 ;; a ;; ~tanımsız
K $a\ne 0$ ($0^0$ tanımsızdır)
W $\tfrac{a^n}{a^n}$ hem $1$’e hem de $a^{n-n}=a^0$’a eşittir.
E $2026^0=1$, $(-7)^0=1$

# us-carpimkuvvet | 2 | Çarpımın kuvveti
L (a\cdot b)^n
R a^n\cdot b^n
X a\cdot b^n ;; a^n+b^n ;; n\cdot a\cdot b
E $(2x)^3=8x^3$
V a,b,n

# us-kesir | 2 | Kesrin negatif kuvveti
L \left(\dfrac{a}{b}\right)^{-n}
R \left(\dfrac{b}{a}\right)^{n}
X -\left(\dfrac{a}{b}\right)^{n} ;; \dfrac{a^{-n}}{b^{n}} ;; \left(\dfrac{a}{b}\right)^{1/n}
E $\left(\tfrac23\right)^{-2}=\left(\tfrac32\right)^2=\tfrac94$
V a,b,n

# us-isaret | 2 | $-1$’in kuvvetleri
L (-1)^n
R ~$n$ çiftse $1$, $n$ tekse $-1$
X ~Her zaman $-1$ ;; ~$n$ çiftse $-1$, $n$ tekse $1$ ;; ~Her zaman $1$
W Negatif sayı çift kuvvette pozitif, tek kuvvette negatif olur.
E $(-1)^{2026}=1$, $(-2)^3=-8$

# us-oncelik | 2 | Eksi işaretinin önceliği
L -3^2
R -9
X 9 ;; -6 ;; 6
W Üs alma, baştaki eksiden önce yapılır: $-3^2=-(3^2)$. Parantez varsa $(-3)^2=9$ olur.
H Parantez yoksa eksi üsse girmez.
V -

## koklu

# kk-us | 3 | Kökü üsse çevirme
L \sqrt[n]{a^m}
R a^{\frac{m}{n}}
X a^{\frac{n}{m}} ;; a^{m-n} ;; a^{m\cdot n}
K $a>0$
W Kökün derecesi üssün paydasına iner.
E $\sqrt[3]{8^2}=8^{2/3}=4$
H Kök derecesi paydada oturur.
G kokus
V a:0.5:3,m:int:1:5,n:int:2:5

# kk-carpim | 3 | Köklü çarpım
L \sqrt{a}\cdot\sqrt{b}
R \sqrt{a\cdot b}
X \sqrt{a+b} ;; a\sqrt{b} ;; \sqrt[4]{a\cdot b}
K $a, b\ge 0$
E $\sqrt{2}\cdot\sqrt{8}=\sqrt{16}=4$
V a,b

# kk-toplam | 3 | Köklü toplama
L a\sqrt{x}+b\sqrt{x}
R (a+b)\sqrt{x}
X \sqrt{(a+b)\,x} ;; (a+b)\sqrt{2x} ;; a\,b\sqrt{x}
W Sadece kök içleri aynı olanlar toplanır; tıpkı $3t+5t=8t$ gibi. $\sqrt2+\sqrt3\ne\sqrt5$.
E $3\sqrt2+5\sqrt2=8\sqrt2$
V a,b,x

# kk-mutlak | 3 | Karenin karekökü
L \sqrt{a^2}
R |a|
X a ;; -a ;; \pm a
W Karekök asla negatif değer vermez: $\sqrt{(-3)^2}=\sqrt9=3=|-3|$.
H Kare kökten mutlak değer olarak çıkar.
V a:-3:3

# kk-rasyonel | 2 | Paydayı rasyonel yapma
L \dfrac{1}{\sqrt{a}-\sqrt{b}}
R \dfrac{\sqrt{a}+\sqrt{b}}{a-b}
X \dfrac{\sqrt{a}-\sqrt{b}}{a-b} ;; \dfrac{\sqrt{a}+\sqrt{b}}{a+b} ;; \dfrac{\sqrt{a}+\sqrt{b}}{\sqrt{a-b}}
K $a, b>0$, $a\ne b$
W Eşleniğiyle genişlet: $(\sqrt a-\sqrt b)(\sqrt a+\sqrt b)=a-b$.
E $\tfrac{1}{\sqrt5-\sqrt3}=\tfrac{\sqrt5+\sqrt3}{2}$
V a,b

# kk-ickok | 2 | İç içe kök açma
L \sqrt{a+2\sqrt{b}}
R \sqrt{x}+\sqrt{y}
X \sqrt{x}\cdot\sqrt{y} ;; \sqrt{x}-\sqrt{y} ;; \sqrt{x+y}
K $x+y=a$ ve $x\cdot y=b$
W $(\sqrt x+\sqrt y)^2=x+y+2\sqrt{xy}$ açılımını tersten oku.
E $\sqrt{5+2\sqrt6}=\sqrt3+\sqrt2$ çünkü $3+2=5$, $3\cdot 2=6$.

# kk-sonsuz | 2 | Sonsuz iç içe kök
L \sqrt{x\sqrt{x\sqrt{x\cdots}}}
R x
X \sqrt{x} ;; x^2 ;; \sqrt[3]{x}
K $x>0$
W Sonuca $y$ de: $y=\sqrt{x\,y}\Rightarrow y^2=xy\Rightarrow y=x$.
E $\sqrt{5\sqrt{5\sqrt{5\cdots}}}=5$

## mutlak

# md-kucuk | 3 | $|x|<a$ eşitsizliği
L |x|<a
O \iff
R -a<x<a
X x<a ;; x<-a\ \text{veya}\ x>a ;; 0<x<a
K $a>0$
W Sayı doğrusunda orijine uzaklığı $a$’dan küçük olan noktalar.
E $|x-2|<3\iff -1<x<5$

# md-buyuk | 3 | $|x|>a$ eşitsizliği
L |x|>a
O \iff
R x<-a\ \text{veya}\ x>a
X -a<x<a ;; x>a ;; x>-a
K $a>0$
W Orijine uzaklığı $a$’dan büyük olanlar: iki ayrı parça.
E $|x|>4\iff x<-4$ veya $x>4$

# md-esitlik | 2 | Mutlak değerli denklem
L |x-a|=b
O \iff
R x=a+b\ \text{veya}\ x=a-b
X x=b-a ;; x=a+b ;; x=\pm b
K $b\ge 0$
W $x$’in $a$’ya uzaklığı $b$: $a$’nın sağında ve solunda birer nokta.
E $|x-3|=5\iff x=8$ veya $x=-2$

# md-carpim | 2 | Çarpımın mutlak değeri
L |a\cdot b|
R |a|\cdot|b|
X a\cdot|b| ;; |a|+|b| ;; -|a|\cdot|b|
V a:-3:3,b:-3:3

# md-ucgen | 2 | Üçgen eşitsizliği
L |a+b|
O \le
R |a|+|b|
X |a|\cdot|b| ;; |a-b| ;; a+b
W Eşitlik ancak $a$ ve $b$ aynı işaretliyken (ya da biri 0 iken) olur.
V a:-3:3,b:-3:3

# md-tanim | 2 | Mutlak değerin tanımı
L |x|
R ~$x\ge 0$ ise $x$; $x<0$ ise $-x$
X ~Her zaman $x$ ;; ~$x\ge 0$ ise $-x$; $x<0$ ise $x$ ;; ~Her zaman $-x$
W Mutlak değer, sayının sıfıra olan uzaklığıdır; uzaklık negatif olmaz.
E $|-5|=-(-5)=5$

## ozdeslik

# oz-tamkare1 | 3 | Toplamın karesi
L (a+b)^2
R a^2+2ab+b^2
X a^2+b^2 ;; a^2+ab+b^2 ;; a^2+2ab-b^2
W Kenarı $a+b$ olan kare: $a^2$, $b^2$ ve iki tane $ab$ dikdörtgeni.
E $103^2=(100+3)^2=10000+600+9=10609$
H Birincinin karesi, iki katı çarpım, ikincinin karesi.
G tamkare
V a,b

# oz-tamkare2 | 3 | Farkın karesi
L (a-b)^2
R a^2-2ab+b^2
X a^2-b^2 ;; a^2-2ab-b^2 ;; a^2+b^2-ab
E $99^2=(100-1)^2=10000-200+1=9801$
H Ortadaki terim eksi, karelerin ikisi de artı.
G farkkare
V a,b

# oz-ikikare | 3 | İki kare farkı
L a^2-b^2
R (a-b)(a+b)
X (a-b)^2 ;; (b-a)(b+a) ;; (a+b)^2-2ab
W Çarpımı açınca $ab$ terimleri birbirini götürür.
E $51\cdot 49=(50+1)(50-1)=2500-1=2499$
H Kareler farkı = fark × toplam.
G ikikare
V a,b

# oz-kupfark | 2 | İki küp farkı
L a^3-b^3
R (a-b)(a^2+ab+b^2)
X (a-b)(a^2-ab+b^2) ;; (a-b)^3 ;; (a-b)(a^2+2ab+b^2)
E $x^3-8=(x-2)(x^2+2x+4)$
H İşaret sırası: aynı, zıt, hep artı.
V a,b

# oz-kuptoplam | 2 | İki küp toplamı
L a^3+b^3
R (a+b)(a^2-ab+b^2)
X (a+b)(a^2+ab+b^2) ;; (a+b)^3 ;; (a+b)(a^2+b^2)
E $x^3+27=(x+3)(x^2-3x+9)$
H İşaret sırası: aynı, zıt, hep artı.
V a,b

# oz-kup1 | 2 | Toplamın küpü
L (a+b)^3
R a^3+3a^2b+3ab^2+b^3
X a^3+b^3 ;; a^3+3ab+b^3 ;; a^3+2a^2b+2ab^2+b^3
W Katsayılar Pascal üçgeninin 3. satırından gelir: $1, 3, 3, 1$.
E $(x+1)^3=x^3+3x^2+3x+1$
V a,b

# oz-kup2 | 2 | Farkın küpü
L (a-b)^3
R a^3-3a^2b+3ab^2-b^3
X a^3-b^3 ;; a^3-3a^2b-3ab^2-b^3 ;; a^3+3a^2b-3ab^2-b^3
W Katsayılar $1, 3, 3, 1$; işaretler sırayla $+,-,+,-$.
V a,b

# oz-ucterim | 2 | Üç terimin toplamının karesi
L (a+b+c)^2
R a^2+b^2+c^2+2(ab+ac+bc)
X a^2+b^2+c^2 ;; a^2+b^2+c^2+ab+ac+bc ;; a^2+b^2+c^2+2abc
E $a+b+c=6$, $ab+ac+bc=11$ ise $a^2+b^2+c^2=36-22=14$.
V a,b,c

# oz-karetoplam | 3 | Kareler toplamını dönüştürme
L a^2+b^2
R (a+b)^2-2ab
X (a+b)^2+2ab ;; (a+b)^2 ;; (a-b)^2-2ab
W Toplam ve çarpım verilen sorularda kareler toplamını doğrudan bulursun.
E $a+b=7$, $ab=10$ ise $a^2+b^2=49-20=29$.
G karetoplamdon
V a,b

# oz-xters | 3 | $x$ ve $\frac1x$ özdeşliği
L x^2+\dfrac{1}{x^2}
R \left(x+\dfrac{1}{x}\right)^2-2
X \left(x+\dfrac{1}{x}\right)^2 ;; \left(x+\dfrac{1}{x}\right)^2+2 ;; \left(x-\dfrac{1}{x}\right)^2-2
W Açılımdaki orta terim $2\cdot x\cdot\tfrac1x=2$ sabittir.
E $x+\tfrac1x=3$ ise $x^2+\tfrac{1}{x^2}=9-2=7$.
G xters
V x

# oz-4ab | 2 | Kareler farkından $4ab$
L (a+b)^2-(a-b)^2
R 4ab
X 2ab ;; 0 ;; 2(a^2+b^2)
V a,b

# oz-kuptoplam2 | 2 | Küpler toplamı (toplam ve çarpımla)
L a^3+b^3
R (a+b)^3-3ab(a+b)
X (a+b)^3-3ab ;; (a+b)^3+3ab(a+b) ;; (a+b)^3-ab(a+b)
E $a+b=4$, $ab=3$ ise $a^3+b^3=64-36=28$.
V a,b

# oz-tamkareye | 2 | Tam kareye tamamlama
L x^2+bx
R \left(x+\dfrac{b}{2}\right)^2-\dfrac{b^2}{4}
X \left(x+\dfrac{b}{2}\right)^2+\dfrac{b^2}{4} ;; (x+b)^2-b^2 ;; \left(x+\dfrac{b}{2}\right)^2-\dfrac{b^2}{2}
W $x$’in katsayısının yarısının karesini ekleyip çıkar.
E $x^2+6x=(x+3)^2-9$
V x,b

## problem

# pr-kar | 3 | Kâr yüzdesi
L ~Kâr yüzdesi
R \dfrac{S-M}{M}\cdot 100
X \dfrac{S-M}{S}\cdot 100 ;; \dfrac{S}{M}\cdot 100 ;; (S-M)\cdot 100
K $S$: satış fiyatı, $M$: maliyet (alış) fiyatı
W Kâr ve zarar yüzdesi, aksi söylenmedikçe her zaman maliyet üzerinden hesaplanır.
E 80 TL’ye alınıp 100 TL’ye satılan ürünün kârı $\tfrac{20}{80}\cdot 100=\%25$.
G kar

# pr-yuzde | 2 | Ardışık yüzde değişim
L ~Önce %$a$ artış, sonra %$b$ azalış
R \left(1+\dfrac{a}{100}\right)\left(1-\dfrac{b}{100}\right)
X 1+\dfrac{a-b}{100} ;; \dfrac{a-b}{100} ;; \left(1+\dfrac{a}{100}\right)-\dfrac{b}{100}
K Sonuç, fiyatın çarpılacağı katsayıdır
W Yüzdeler toplanmaz, çarpılır; ikinci değişim yeni fiyat üzerinden hesaplanır.
E %20 zam ardından %20 indirim: $1{,}2\cdot 0{,}8=0{,}96$, yani %4 kayıp.
G yuzde

# pr-hiz | 3 | Yol – hız – zaman
L x
R v\cdot t
X \dfrac{v}{t} ;; v+t ;; \dfrac{t}{v}
K $x$: alınan yol, $v$: hız, $t$: zaman
H Yol = hız × zaman.
G hiz

# pr-karsilasma | 3 | Karşılaşma süresi
L t
R \dfrac{x}{v_1+v_2}
X \dfrac{x}{v_1-v_2} ;; \dfrac{v_1+v_2}{x} ;; x\cdot(v_1+v_2)
K Aralarında $x$ uzaklık olan iki araç birbirine doğru hareket ediyor
W Birbirine yaklaşırken aradaki mesafe hızların toplamı kadar azalır.
E 360 km arayla 50 ve 70 km/sa hızla yola çıkanlar $\tfrac{360}{120}=3$ saatte karşılaşır.
G karsilasma

# pr-yetisme | 3 | Yetişme süresi
L t
R \dfrac{x}{v_1-v_2}
X \dfrac{x}{v_1+v_2} ;; \dfrac{v_1-v_2}{x} ;; \dfrac{2x}{v_1+v_2}
K Aynı yönde; hızlı olan ($v_1$) $x$ kadar geriden geliyor
W Aynı yönde giderken aradaki mesafe hız farkı kadar kapanır.
E 40 km geriden 90 km/sa ile gelen, 70 km/sa’lik aracı $\tfrac{40}{20}=2$ saatte yakalar.
G yetisme

# pr-isci | 3 | Birlikte iş bitirme süresi
L t
R \dfrac{t_1\cdot t_2}{t_1+t_2}
X \dfrac{t_1+t_2}{2} ;; t_1+t_2 ;; \dfrac{t_1+t_2}{t_1\cdot t_2}
K İki kişi işi tek başına $t_1$ ve $t_2$ sürede bitiriyor
W Birim zamanda yapılan işler toplanır: $\tfrac{1}{t_1}+\tfrac{1}{t_2}=\tfrac{1}{t}$.
E 6 ve 12 saatte bitirenler birlikte $\tfrac{6\cdot 12}{18}=4$ saatte bitirir.
H Çarpım bölü toplam.
G isci

# pr-havuz | 2 | Musluk ve gider
L \dfrac{1}{t}
R \dfrac{1}{t_m}-\dfrac{1}{t_g}
X \dfrac{1}{t_m}+\dfrac{1}{t_g} ;; \dfrac{1}{t_m-t_g} ;; t_m-t_g
K $t_m$: musluğun tek başına doldurma süresi, $t_g$: giderin boşaltma süresi
W Musluk doldurur (+), gider boşaltır (−); birim zamandaki işler toplanır.
E 4 saatte dolduran musluk ve 12 saatte boşaltan gider: $\tfrac14-\tfrac1{12}=\tfrac16$, havuz 6 saatte dolar.
G havuz

# pr-karisim | 2 | Karışım yüzdesi
L p
R \dfrac{m_1p_1+m_2p_2}{m_1+m_2}
X \dfrac{p_1+p_2}{2} ;; \dfrac{m_1p_1+m_2p_2}{2} ;; \dfrac{p_1+p_2}{m_1+m_2}
K $m_1$ gram %$p_1$’lik ile $m_2$ gram %$p_2$’lik karışım birleştiriliyor
W Yüzdeler değil, içindeki madde miktarları toplanır; bu bir ağırlıklı ortalamadır.
E 200 g %10’luk ile 300 g %20’lik: $\tfrac{2000+6000}{500}=\%16$.
G karisim

# pr-yas | 2 | Yaş farkı
L ~İki kişinin yaşları farkı
R ~Her zaman sabittir
X ~Her yıl 1 artar ;; ~Her yıl 2 artar ;; ~Yaşları oranı kadardır
W Herkes her yıl aynı miktarda yaşlanır; oranlar değişir, fark değişmez.
E Annesi 30, kızı 6 yaşındaysa 10 yıl sonra da aralarında 24 yaş vardır.

# pr-dogru | 2 | Doğru orantı
L ~$x$ ile $y$ doğru orantılı
O :
R \dfrac{x}{y}=k
X x\cdot y=k ;; x+y=k ;; x-y=k
K $k$: sabit
W Biri kaç katına çıkarsa diğeri de o kadar katına çıkar.
E 3 kalem 12 TL ise 5 kalem 20 TL.

# pr-ters | 2 | Ters orantı
L ~$x$ ile $y$ ters orantılı
O :
R x\cdot y=k
X \dfrac{x}{y}=k ;; x+y=k ;; x-y=k
K $k$: sabit
W Biri kaç katına çıkarsa diğeri o kadar küçülür.
E 6 işçi bir işi 10 günde bitirirse 12 işçi 5 günde bitirir.

# pr-ortalama | 3 | Aritmetik ortalama
L \bar{x}
R \dfrac{x_1+x_2+\dots+x_n}{n}
X \dfrac{x_1+x_n}{n} ;; \dfrac{x_1+x_2+\dots+x_n}{n-1} ;; \sqrt[n]{x_1x_2\cdots x_n}
E $4, 7, 10$’un ortalaması $\tfrac{21}{3}=7$.
G ortalama

# pr-geomort | 2 | Geometrik ortalama
L G(a,b)
R \sqrt{ab}
X \dfrac{a+b}{2} ;; \dfrac{2ab}{a+b} ;; \sqrt{a+b}
K $a, b>0$
E $G(4,9)=6$

# pr-harmonik | 2 | Ortalama hız (harmonik ortalama)
L \bar v
R \dfrac{2v_1v_2}{v_1+v_2}
X \dfrac{v_1+v_2}{2} ;; \dfrac{v_1v_2}{v_1+v_2} ;; \sqrt{v_1v_2}
K Aynı yol gidişte $v_1$, dönüşte $v_2$ hızıyla alınıyor
W Ortalama hız = toplam yol / toplam zaman. Yavaş giden kısımda daha uzun zaman geçtiği için sonuç aritmetik ortalamadan küçüktür.
E 60 ve 90 km/sa için $\tfrac{2\cdot 60\cdot 90}{150}=72$ km/sa.
G ortalamahiz

# pr-aogo | 2 | Aritmetik–geometrik ortalama eşitsizliği
L \dfrac{a+b}{2}
O \ge
R \sqrt{ab}
X \dfrac{a^2+b^2}{2} ;; a+b ;; \sqrt{a^2+b^2}
K $a, b>0$; eşitlik yalnızca $a=b$ iken
W Toplamı sabit iki pozitif sayının çarpımı, sayılar eşitken en büyüktür.
E $a+b=10$ ise $ab$ en çok $25$ olur.
V a,b

# pr-faiz | 1 | Basit faiz
L F
R \dfrac{A\cdot n\cdot t}{100}
X \dfrac{A\cdot n}{100\cdot t} ;; A\cdot n\cdot t ;; \dfrac{A\cdot t}{100\cdot n}
K $A$: anapara, $n$: yıllık faiz oranı (%), $t$: yıl
E 5000 TL’nin yıllık %20’den 2 yıllık basit faizi $\tfrac{5000\cdot 20\cdot 2}{100}=2000$ TL.
G faiz

## kume

# km-birlesim | 3 | İki kümenin birleşimi
L s(A\cup B)
R s(A)+s(B)-s(A\cap B)
X s(A)+s(B) ;; s(A)+s(B)+s(A\cap B) ;; s(A)\cdot s(B)-s(A\cap B)
W Kesişimdeki elemanlar iki kez sayıldığı için bir kez çıkarılır.
E 25 kişi İngilizce, 18 kişi Almanca, 7 kişi ikisini de biliyorsa en az birini bilen $36$ kişi.
G kumebirlesim

# km-uc | 2 | Üç kümenin birleşimi
L s(A\cup B\cup C)
R s(A)+s(B)+s(C)-s(A\cap B)-s(A\cap C)-s(B\cap C)+s(A\cap B\cap C)
X s(A)+s(B)+s(C)-s(A\cap B)-s(A\cap C)-s(B\cap C)-s(A\cap B\cap C) ;; s(A)+s(B)+s(C)-s(A\cap B\cap C) ;; s(A)+s(B)+s(C)-s(A\cap B)-s(A\cap C)-s(B\cap C)
W Tekler eklenir, ikili kesişimler çıkarılır, üçlü kesişim geri eklenir (içerme–dışlama).
H Tekler artı, ikililer eksi, üçlü artı.

# km-altkume | 3 | Alt küme sayısı
L ~$n$ elemanlı kümenin alt küme sayısı
R 2^n
X n^2 ;; 2n ;; n!
W Her eleman için iki seçenek var: alt kümede ya var ya yok.
E $\{a,b,c\}$’nin $2^3=8$ alt kümesi vardır.
G altkume

# km-ozalt | 2 | Öz alt küme sayısı
L ~$n$ elemanlı kümenin öz alt küme sayısı
R 2^n-1
X 2^n ;; 2^{n-1} ;; 2^n-2
W Kümenin kendisi öz alt küme sayılmaz.
E 4 elemanlı kümenin $15$ öz alt kümesi vardır.

# km-ralt | 2 | $r$ elemanlı alt küme sayısı
L ~$n$ elemanlı kümenin $r$ elemanlı alt küme sayısı
R \dbinom{n}{r}
X P(n,r) ;; n^r ;; 2^r
W Alt kümede sıra önemli değildir; bu bir kombinasyondur.
E 5 elemanlı kümenin $\binom52=10$ tane 2 elemanlı alt kümesi vardır.

# km-demorgan1 | 2 | De Morgan (birleşimin tümleyeni)
L (A\cup B)'
R A'\cap B'
X A'\cup B' ;; A\cap B ;; (A\cap B)'
H Tümleyen içeri girince birleşim kesişime döner.

# km-demorgan2 | 2 | De Morgan (kesişimin tümleyeni)
L (A\cap B)'
R A'\cup B'
X A'\cap B' ;; A\cup B ;; A\cap B'
H Tümleyen içeri girince kesişim birleşime döner.

# km-fark | 2 | Fark kümesi
L A\setminus B
R A\cap B'
X A\cup B' ;; A'\cap B ;; B\setminus A
W $A$’da olup $B$’de olmayanlar: $A$ ile $B$’nin tümleyeninin kesişimi.

# km-kartezyen | 2 | Kartezyen çarpımın eleman sayısı
L s(A\times B)
R s(A)\cdot s(B)
X s(A)+s(B) ;; 2^{s(A)\cdot s(B)} ;; s(A)^{s(B)}
W $A$’dan her eleman, $B$’den her elemanla bir sıralı ikili oluşturur.

## mantik

# mn-ise | 3 | Koşullu önermenin açılımı
L p\Rightarrow q
O \equiv
R p'\lor q
X p\lor q' ;; p'\land q ;; q\Rightarrow p
W $p\Rightarrow q$ yalnızca “$p$ doğru, $q$ yanlış” iken yanlıştır; $p'\lor q$ da tam olarak o durumda yanlıştır.
H Oku kır: ilkini değille, “veya” ile bağla.
V bool:p,q

# mn-karsitters | 3 | Karşıt ters (kontrapozitif)
L p\Rightarrow q
O \equiv
R q'\Rightarrow p'
X q\Rightarrow p ;; p'\Rightarrow q' ;; q'\Rightarrow p
W Karşıt ters, orijinal önermeye her zaman denktir; karşıt ($q\Rightarrow p$) ve ters ($p'\Rightarrow q'$) değildir.
E “Yağmur yağarsa yer ıslanır” ≡ “Yer ıslak değilse yağmur yağmamıştır.”
V bool:p,q

# mn-demorgan1 | 3 | De Morgan (“ve” değillemesi)
L (p\land q)'
O \equiv
R p'\lor q'
X p'\land q' ;; p\lor q ;; p'\land q
H Değil içeri girince “ve”, “veya” olur.
V bool:p,q

# mn-demorgan2 | 3 | De Morgan (“veya” değillemesi)
L (p\lor q)'
O \equiv
R p'\land q'
X p'\lor q' ;; p\land q ;; p\lor q'
H Değil içeri girince “veya”, “ve” olur.
V bool:p,q

# mn-ancak | 2 | İki yönlü koşullu
L p\Leftrightarrow q
O \equiv
R (p\Rightarrow q)\land(q\Rightarrow p)
X (p\Rightarrow q)\lor(q\Rightarrow p) ;; (p\land q)' ;; p\lor q
W “Ancak ve ancak”: iki önerme aynı doğruluk değerine sahipken doğrudur.
V bool:p,q

# mn-yutan1 | 1 | “Veya” ile doğru
L p\lor 1
O \equiv
R 1
X p ;; 0 ;; p'
W Bir taraf doğruysa “veya” bağlacı her zaman doğrudur.
V bool:p

# mn-yutan2 | 1 | “Ve” ile yanlış
L p\land 0
O \equiv
R 0
X p ;; 1 ;; p'
W Bir taraf yanlışsa “ve” bağlacı her zaman yanlıştır.
V bool:p

# mn-totoloji | 1 | Üçüncü hâlin olmazlığı
L p\lor p'
O \equiv
R 1
X 0 ;; p ;; p'
W Bir önerme ya doğrudur ya yanlıştır; bu bileşik önerme bir totolojidir.
V bool:p

## fonksiyon

# fn-bileske | 3 | Bileşke fonksiyon
L (f\circ g)(x)
R f(g(x))
X g(f(x)) ;; f(x)\cdot g(x) ;; f(x)+g(x)
W Sağdaki fonksiyon önce uygulanır: önce $g$, sonra $f$.
E $f(x)=2x$, $g(x)=x+1$ ise $(f\circ g)(3)=f(4)=8$.
H Bileşke sağdan sola okunur.
G bileske

# fn-ters-dogrusal | 3 | Doğrusal fonksiyonun tersi
L f(x)=ax+b\ \Rightarrow\ f^{-1}(x)
R \dfrac{x-b}{a}
X \dfrac{x+b}{a} ;; \dfrac{1}{ax+b} ;; ax-b
K $a\ne 0$
W $y=ax+b$ eşitliğinde $x$’i yalnız bırak, sonra $x$ ile $y$’nin yerini değiştir.
E $f(x)=3x-6$ ise $f^{-1}(x)=\tfrac{x+6}{3}$.
H Ters fonksiyon işlemleri tersten ve ters işlemle yapar.
G tersfonk

# fn-ters-kesirli | 2 | Kesirli fonksiyonun tersi
L f(x)=\dfrac{ax+b}{cx+d}\ \Rightarrow\ f^{-1}(x)
R \dfrac{-dx+b}{cx-a}
X \dfrac{dx-b}{cx-a} ;; \dfrac{cx+d}{ax+b} ;; \dfrac{-dx+b}{cx+a}
W $a$ ile $d$ yer değiştirir ve ikisinin de işareti değişir; $b$ ile $c$ yerinde kalır.
E $f(x)=\tfrac{2x+1}{x-3}$ ise $f^{-1}(x)=\tfrac{3x+1}{x-2}$.
H Köşegendekiler yer ve işaret değiştirir.

# fn-tersbileske | 2 | Fonksiyon ve tersinin bileşkesi
L (f\circ f^{-1})(x)
R x
X 1 ;; f(x)^2 ;; 0
W Ters fonksiyon, fonksiyonun yaptığını geri alır; sonuç birim fonksiyondur.

# fn-bileske-ters | 2 | Bileşkenin tersi
L (f\circ g)^{-1}
R g^{-1}\circ f^{-1}
X f^{-1}\circ g^{-1} ;; g\circ f ;; \dfrac{1}{f\circ g}
W Son uygulanan işlem ilk geri alınır.
H Çorap–ayakkabı kuralı: önce giydiğini en son çıkarırsın.

# fn-sayisi | 2 | Fonksiyon sayısı
L ~$s(A)=m$, $s(B)=n$ ise $A$’dan $B$’ye fonksiyon sayısı
R n^m
X m^n ;; m\cdot n ;; 2^{m\cdot n}
W $A$’nın her elemanı $B$’deki $n$ elemandan herhangi birine gidebilir.
H Hedefin eleman sayısı, kaynağın üssünü taşır.
G fonksayisi

# fn-birebir | 2 | Birebir fonksiyon sayısı
L ~$s(A)=m\le s(B)=n$ ise birebir fonksiyon sayısı
R \dfrac{n!}{(n-m)!}
X \dfrac{n!}{m!} ;; \dbinom{n}{m} ;; n^m
W İlk eleman $n$, ikincisi $n-1$, … farklı görüntüye gidebilir: $P(n,m)$.

# fn-tek | 2 | Tek fonksiyon
L f(-x)
R -f(x)
X f(x) ;; \dfrac{1}{f(x)} ;; |f(x)|
K $f$ tek fonksiyon; grafiği orijine göre simetrik
E $x^3$, $\sin x$ tek fonksiyonlardır.

# fn-cift | 2 | Çift fonksiyon
L f(-x)
R f(x)
X -f(x) ;; \dfrac{1}{f(x)} ;; |f(x)|
K $f$ çift fonksiyon; grafiği $y$ eksenine göre simetrik
E $x^2$, $\cos x$, $|x|$ çift fonksiyonlardır.

## sayma

# sm-0fakt | 2 | Sıfır faktöriyel
L 0!
R 1
X 0 ;; ~tanımsız ;; -1
W $n!=n\cdot(n-1)!$ bağıntısında $n=1$ alınırsa $1!=1\cdot 0!$, yani $0!=1$.

# sm-perm | 3 | Permütasyon
L P(n,r)
R \dfrac{n!}{(n-r)!}
X \dfrac{n!}{r!} ;; \dfrac{n!}{r!\,(n-r)!} ;; n^r
W $n$ farklı nesneden $r$ tanesini sıralı seçme: $n\cdot(n-1)\cdots(n-r+1)$.
E $P(5,2)=5\cdot 4=20$
H Permütasyon kürsüyü sıralar.
G perm

# sm-komb | 3 | Kombinasyon
L \dbinom{n}{r}
R \dfrac{n!}{r!\,(n-r)!}
X \dfrac{n!}{(n-r)!} ;; \dfrac{n!}{r!} ;; \dfrac{(n-r)!}{r!}
W Sıra önemsiz olduğunda permütasyonu $r!$ ile bölersin.
E $\binom{6}{2}=\tfrac{6\cdot 5}{2}=15$
H Kombinasyon komite seçer, permütasyon kürsü sıralar.
G komb

# sm-simetri | 2 | Kombinasyon simetrisi
L \dbinom{n}{r}
R \dbinom{n}{n-r}
X \dbinom{n-r}{r} ;; \dbinom{n}{r+1} ;; \dbinom{n+r}{n}
W $r$ tanesini seçmek, geride kalacak $n-r$ tanesini seçmekle aynıdır.
E $\binom{20}{18}=\binom{20}{2}=190$

# sm-pascal | 2 | Pascal kuralı
L \dbinom{n}{r}+\dbinom{n}{r+1}
R \dbinom{n+1}{r+1}
X \dbinom{n+1}{r} ;; \dbinom{2n}{2r+1} ;; \dbinom{n}{2r+1}
W Pascal üçgeninde yan yana iki sayı, altlarındaki sayıyı verir.

# sm-tekrarli | 2 | Tekrarlı permütasyon
L ~Özdeş nesneler içeren $n$ nesnenin sıralanışı
R \dfrac{n!}{n_1!\,n_2!\cdots n_k!}
X \dfrac{n!}{n_1+n_2+\dots+n_k} ;; n!-n_1!-n_2!-\dots-n_k! ;; \dfrac{n!}{(n_1 n_2\cdots n_k)!}
K $n_1, n_2, \dots$: birbirinin aynı olan nesnelerin sayıları
W Özdeş nesnelerin kendi aralarındaki yer değişimleri yeni diziliş oluşturmaz.
E ANANAS: $\tfrac{6!}{3!\,2!}=60$
G tekrarli

# sm-dairesel | 2 | Dairesel permütasyon
L ~$n$ kişinin yuvarlak masaya oturuşu
R (n-1)!
X n! ;; \dfrac{n!}{2} ;; (n-2)!
W Dönmeler aynı diziliş sayılır; bir kişiyi sabitle, kalanları sırala.
E 5 kişi yuvarlak masaya $4!=24$ farklı şekilde oturur.
G dairesel

# sm-kolye | 1 | Kolye (anahtarlık) permütasyonu
L ~$n$ farklı boncuğun kolyeye dizilişi
R \dfrac{(n-1)!}{2}
X (n-1)! ;; \dfrac{n!}{2} ;; \dfrac{(n-2)!}{2}
K $n\ge 3$
W Kolye ters çevrilebildiği için saat yönü ve tersi aynı sayılır; dairesel permütasyon 2’ye bölünür.

# sm-olasilik | 3 | Olasılık
L P(A)
R \dfrac{s(A)}{s(E)}
X \dfrac{s(E)}{s(A)} ;; \dfrac{s(A)}{s(E)-s(A)} ;; s(A)\cdot s(E)
K $E$: eş olası çıktılardan oluşan örnek uzay
E Bir zarda asal gelme olasılığı $\tfrac36=\tfrac12$.
G olasilik

# sm-tumleyen | 3 | Tümleyen olay
L P(A')
R 1-P(A)
X P(A)-1 ;; \dfrac{1}{P(A)} ;; -P(A)
W “En az bir” sorularında tümleyeni kullan: $1-P(\text{hiç})$.
E 3 zarda en az bir 6 gelme olasılığı $1-\left(\tfrac56\right)^3=\tfrac{91}{216}$.

# sm-birlesim | 3 | Olasılıkta birleşim
L P(A\cup B)
R P(A)+P(B)-P(A\cap B)
X P(A)+P(B) ;; P(A)\cdot P(B) ;; P(A)+P(B)+P(A\cap B)
W Kümelerdeki gibi: ortak kısım iki kez sayılmasın.

# sm-bagimsiz | 3 | Bağımsız olaylar
L P(A\cap B)
R P(A)\cdot P(B)
X P(A)+P(B) ;; P(A)+P(B)-P(A)P(B) ;; \dfrac{P(A)}{P(B)}
K $A$ ve $B$ bağımsız
E İki para atışında iki yazı: $\tfrac12\cdot\tfrac12=\tfrac14$.
G bagimsiz

# sm-kosullu | 2 | Koşullu olasılık
L P(A\mid B)
R \dfrac{P(A\cap B)}{P(B)}
X \dfrac{P(A\cap B)}{P(A)} ;; P(A)\cdot P(B) ;; \dfrac{P(B)}{P(A\cap B)}
K $P(B)>0$
W $B$ olduysa örnek uzay $B$’ye daralır; $A$’nın $B$ içindeki payına bakılır.

# sm-binom | 2 | Binom açılımı
L (x+y)^n
R \sum_{r=0}^{n}\dbinom{n}{r}x^{n-r}y^{r}
X \sum_{r=0}^{n}\dbinom{n}{r}x^{n}y^{r} ;; x^n+y^n ;; \sum_{r=0}^{n}x^{n-r}y^{r}
W Katsayılar Pascal üçgeninin $n$. satırıdır; $x$’in üssü azalırken $y$’nin üssü artar.
V x,y,n:int:1:7

# sm-binomterim | 2 | Binom açılımında genel terim
L T_{r+1}
R \dbinom{n}{r}x^{n-r}y^{r}
X \dbinom{n}{r+1}x^{n-r}y^{r} ;; \dbinom{n}{r}x^{r}y^{n-r} ;; \dbinom{n}{r}x^{n-r-1}y^{r+1}
K $(x+y)^n$ açılımında baştan $(r+1)$. terim
E $(x+2)^5$ açılımında baştan 3. terim: $\binom52x^3\cdot 2^2=40x^3$.

# sm-katsayi | 2 | Binom katsayıları toplamı
L ~$(x+y)^n$ açılımında katsayılar toplamı
R 2^n
X n+1 ;; n^2 ;; 2n
W Değişkenlerin yerine 1 yaz: $(1+1)^n$.
E $(x+y)^6$ açılımında katsayılar toplamı $64$.

# sm-terimsayisi | 1 | Binom açılımındaki terim sayısı
L ~$(x+y)^n$ açılımındaki terim sayısı
R n+1
X n ;; 2^n ;; n-1
W $y$’nin üssü $0,1,\dots,n$ değerlerini alır.

## polinom

# pl-katsayi | 3 | Katsayılar toplamı
L ~$P(x)$’in katsayılar toplamı
R P(1)
X P(0) ;; P(-1) ;; P(1)-P(0)
W $x=1$ yazınca her terim katsayısına eşit olur.
E $P(x)=3x^2-5x+4$ ise katsayılar toplamı $P(1)=2$.

# pl-sabit | 3 | Sabit terim
L ~$P(x)$’in sabit terimi
R P(0)
X P(1) ;; P(-1) ;; ~Baş katsayı
W $x=0$ yazınca $x$’li tüm terimler sıfırlanır.

# pl-kalan | 3 | Kalan teoremi
L ~$P(x)$’in $x-a$ ile bölümünden kalan
R P(a)
X P(-a) ;; P(0) ;; P(a)-a
W $P(x)=(x-a)\cdot Q(x)+K$ eşitliğinde $x=a$ yaz.
E $P(x)=x^3-2x+5$’in $x-2$ ile bölümünden kalan $P(2)=9$.
H Böleni sıfır yapan değeri yerine yaz.
G kalan

# pl-kalan2 | 2 | $ax+b$ ile bölümden kalan
L ~$P(x)$’in $ax+b$ ile bölümünden kalan
R P\!\left(-\dfrac{b}{a}\right)
X P\!\left(\dfrac{b}{a}\right) ;; P(-b) ;; P\!\left(-\dfrac{a}{b}\right)
W Böleni sıfır yapan $x=-\tfrac ba$ değerini polinomda yerine yaz.

# pl-cift | 2 | Çift dereceli terimlerin katsayıları toplamı
L ~Çift dereceli terimlerin katsayıları toplamı
R \dfrac{P(1)+P(-1)}{2}
X \dfrac{P(1)-P(-1)}{2} ;; P(1)+P(-1) ;; \dfrac{P(1)\cdot P(-1)}{2}
W $P(1)+P(-1)$ toplamında tek dereceli terimler birbirini götürür, çiftler iki kez sayılır.

# pl-tek | 2 | Tek dereceli terimlerin katsayıları toplamı
L ~Tek dereceli terimlerin katsayıları toplamı
R \dfrac{P(1)-P(-1)}{2}
X \dfrac{P(1)+P(-1)}{2} ;; P(1)-P(-1) ;; \dfrac{P(-1)-P(1)}{2}
W $P(1)-P(-1)$ farkında çift dereceli terimler gider, tekler iki kez sayılır.

# pl-derece | 2 | Çarpımın derecesi
L \operatorname{der}[P(x)\cdot Q(x)]
R \operatorname{der}P+\operatorname{der}Q
X \operatorname{der}P\cdot\operatorname{der}Q ;; \max(\operatorname{der}P,\operatorname{der}Q) ;; \operatorname{der}P-\operatorname{der}Q
W En büyük dereceli terimler çarpılınca üsler toplanır.

# pl-derecebileske | 1 | Bileşkenin derecesi
L \operatorname{der}[P(Q(x))]
R \operatorname{der}P\cdot\operatorname{der}Q
X \operatorname{der}P+\operatorname{der}Q ;; (\operatorname{der}P)^{\operatorname{der}Q} ;; \max(\operatorname{der}P,\operatorname{der}Q)
E $P(x)=x^3$, $Q(x)=x^2+1$ ise $P(Q(x))=(x^2+1)^3$, derecesi $6$.
`;
