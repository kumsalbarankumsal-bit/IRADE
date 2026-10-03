/* FormUp v2 — parça "fgeo": Temel Geometri ve Trigonometri (f-geo) + Grafik ve Fonksiyon Temelleri (f-graph).
   Kartlar öğretme sırasıyla (kolaydan zora). Biçim: content/SPEC.md */
import { ri, pick, fr, int, sgn } from "./genkit.js";

export const CARDS = String.raw`
## f-geo

# f-geo-rect-area | 3 | Dikdörtgenin alanı | Area of a rectangle
L A
R l \times w
X 2(l+w) ;; l+w ;; \dfrac{l\times w}{2}
K $l$: uzunluk, $w$: genişlik. İkisi aynı birimde olmalı. Alanın birimi karedir: $\text{cm}^2$, $\text{m}^2$.
KE $l$: length, $w$: width, both in the same unit. Area is measured in square units such as $\text{cm}^2$ or $\text{m}^2$.
U Bir dikdörtgenin içini kaplamak için kaç birim kare gerektiğini bulur.
UE Finds how many unit squares are needed to cover a rectangle.
W $5$ cm’ye $3$ cm’lik bir dikdörtgeni $1$ cm’lik karelere böl: $3$ sıra var, her sırada $5$ kare. Toplam $3\times 5=15$ kare.
WE A 5 cm by 3 cm rectangle splits into 3 rows of 5 unit squares, so it holds $3\times 5=15$ squares.
E Odanın boyu $4$ m, eni $3$ m: $A=4\times 3=12\ \text{m}^2$.
H Alan içini doldurur (çarp), çevre etrafını dolaşır (topla).
T area = alan ;; length = uzunluk ;; width = genişlik
Q Bir odanın zemini $4$ m’ye $3$ m. Zemini tamamen kaplamak için kaç metrekare halı gerekir?
QE A room’s floor measures $4$ m by $3$ m. How many square metres of carpet cover the whole floor?
B l [[\times]] w || + ;; \div
C l=5:1:20:1 ; w=3:1:20:1 => l*w
CT A=@l@\times @w@=@=@
G fgeo_rectarea

# f-geo-rect-perim | 3 | Dikdörtgenin çevresi | Perimeter of a rectangle
L P
R 2(l+w)
X l\times w ;; l+w ;; 2l+w
K $l$: uzunluk, $w$: genişlik. Çevre bir uzunluktur: birimi $\text{cm}$ ya da $\text{m}$ gibidir, kare birim değildir.
KE $l$: length, $w$: width. Perimeter is a length, so its unit is cm or m, not a square unit.
U Bir şeklin etrafını bir kez dolaşınca kaç birim yol gittiğini bulur.
UE Finds the total distance all the way around the outside of a shape.
W Dikdörtgenin $4$ kenarı var: iki tane $l$, iki tane $w$. Hepsini topla: $l+w+l+w=2(l+w)$.
WE A rectangle has two lengths and two widths: $l+w+l+w=2(l+w)$.
E Bahçe $8$ m’ye $5$ m: $P=2(8+5)=2\cdot 13=26$ m.
H Çevre = etrafında bir tur at, kenarları topla.
T perimeter = çevre ;; rectangle = dikdörtgen ;; side = kenar
Q $8$ m’ye $5$ m boyutlarındaki bir bahçenin etrafına tel çit çekilecek. Kaç metre tel gerekir?
QE A wire fence goes all the way around a garden measuring $8$ m by $5$ m. How many metres of wire are needed?
B [[2]]([[l+w]]) || 4 ;; l\times w
C l=8:1:30:1 ; w=5:1:30:1 => 2*(l+w)
CT P=2(@l@+@w@)=@=@
G fgeo_rectperim

# f-geo-line | 3 | Bir doğru üzerindeki açılar | Angles on a straight line
L a+b
R 180^\circ
X 90^\circ ;; 360^\circ ;; 270^\circ
K $a$ ve $b$, bir doğru üzerindeki aynı noktada, doğrunun aynı tarafında yan yana duran açılar. Böyle kaç açı olursa olsun toplamları $180^\circ$’dir.
KE $a$ and $b$ sit side by side at the same point on a straight line, on the same side of it. However many such angles there are, they add up to $180^\circ$.
U Bir doğru üzerindeki açılardan birini bilirsen diğerini bulur.
UE Finds a missing angle on a straight line.
W Düz bir çizgi yarım turdur. Tam tur $360^\circ$ olduğuna göre yarım tur $180^\circ$’dir.
WE A straight line is half a full turn; a full turn is $360^\circ$, so half a turn is $180^\circ$.
E Açılardan biri $130^\circ$ ise diğeri $180^\circ-130^\circ=50^\circ$.
H Düz çizgi = yarım pizza = $180^\circ$.
T angles on a straight line = bir doğru üzerindeki açılar ;; adjacent angles = komşu açılar ;; degree = derece
Q Düz bir zemine dayanan bir merdiven, zeminle bir tarafta $65^\circ$’lik açı yapıyor. Merdivenin öbür tarafında zeminle yaptığı açı kaç derecedir?
QE A ladder stands on flat ground and makes an angle of $65^\circ$ with the ground on one side. What angle does it make with the ground on the other side?
B [[180]]^\circ || 90 ;; 360
C a=130:1:179:1 => 180-a
CT b=180^\circ-@a@^\circ=@=@^\circ
G fgeo_line

# f-geo-point | 3 | Bir nokta etrafındaki açılar | Angles at a point
L a+b+c+d
R 360^\circ
X 180^\circ ;; 90^\circ ;; 270^\circ
K Açılar bir noktanın çevresini boşluksuz dolduruyor. Kaç açı olursa olsun toplam $360^\circ$’dir.
KE The angles fill all the way around one point with no gaps. However many there are, they add up to $360^\circ$.
U Bir noktanın etrafındaki eksik açıyı bulur.
UE Finds a missing angle around a point.
W Noktanın etrafında bir tam tur dönersin; tam tur $360^\circ$’dir. Saatin yelkovanı bir saatte tam bu kadar döner.
WE Going all the way round a point is one full turn, $360^\circ$, like the minute hand of a clock in one hour.
E Açılar $100^\circ$, $120^\circ$ ve $90^\circ$ ise dördüncüsü $360^\circ-310^\circ=50^\circ$.
H Tam tur = bütün pizza = $360^\circ$.
T angles at a point = bir nokta etrafındaki açılar ;; full turn = tam tur ;; right angle = dik açı ($90^\circ$)
Q Bir pizza tam ortasından $4$ dilime kesilmiş. Üç dilimin uç açısı $100^\circ$, $120^\circ$ ve $90^\circ$. Son dilimin açısı kaç derecedir?
QE A pizza is cut from its centre into $4$ slices. Three of the slices have angles of $100^\circ$, $120^\circ$ and $90^\circ$. What is the angle of the last slice?
B [[360]]^\circ || 180 ;; 90
C a=100:10:140:1 ; b=120:10:120:1 ; c=90:10:90:1 => 360-a-b-c
CT d=360^\circ-@a@^\circ-@b@^\circ-@c@^\circ=@=@^\circ
G fgeo_point

# f-geo-vert | 3 | Ters açılar | Vertically opposite angles
L ~İki doğru kesişince oluşan “X”te, karşı karşıya duran iki açı
O :
R ~Birbirine eşittir
X ~Toplamları $180^\circ$’dir ;; ~Toplamları $90^\circ$’dir ;; ~Toplamları $360^\circ$’dir
K Karşı karşıya değil de yan yana duran iki açı ise bir doğru üzerindedir: toplamları $180^\circ$.
KE Two angles that are next to each other (not opposite) lie on a straight line, so they add up to $180^\circ$.
U İki doğru kesişince bir açıyı bilerek karşısındakini hemen bulur.
UE When two lines cross, one angle immediately gives you the angle opposite it.
W $a$ ile yanındaki $c$ bir doğru üzerinde: $a+c=180^\circ$. Karşıdaki $b$ de aynı $c$ ile bir doğru üzerinde: $b+c=180^\circ$. Demek ki $a=b$.
WE $a+c=180^\circ$ and $b+c=180^\circ$ for the same neighbouring angle $c$, so $a=b$.
E Bir açı $40^\circ$ ise karşısındaki de $40^\circ$; yanındaki iki açı ise $140^\circ$.
H Makas gibi: sapları ne kadar açarsan ağzı da o kadar açılır.
T vertically opposite angles = ters açılar ;; intersect = kesişmek ;; straight line = doğru
Q Bir makasın iki sapı arasındaki açı $35^\circ$. Makasın iki bıçağı arasındaki açı kaç derecedir?
QE The angle between the two handles of a pair of scissors is $35^\circ$. What is the angle between the two blades?
G fgeo_vert

# f-geo-alt | 3 | İç ters açılar (Z açıları) | Alternate angles (Z angles)
L ~İki paralel doğru arasında, “Z” şeklinin iki köşesindeki açılar
O :
R ~Birbirine eşittir
X ~Toplamları $180^\circ$’dir ;; ~Toplamları $90^\circ$’dir ;; ~Biri diğerinin iki katıdır
K İki paralel doğruyu üçüncü bir doğru (kesen) kesiyor. İki açı paralellerin arasında, kesenin zıt taraflarındadır. Doğrular paralel değilse kural çalışmaz.
KE Two parallel lines are cut by a third line, the transversal. Both angles lie between the parallel lines, on opposite sides of the transversal. If the lines are not parallel, the rule fails.
U Paralel doğrularda bir açıyı bilerek “Z”nin öbür köşesindeki açıyı bulur.
UE Uses one angle to find the angle in the other corner of the Z between parallel lines.
W Z harfinin üst ve alt çizgisi paraleldir; çapraz çizgi ikisini de aynı eğiklikte keser. Bu yüzden Z’nin iki köşesindeki açılar aynıdır.
WE The top and bottom strokes of a Z are parallel and the slanted stroke crosses both at the same tilt, so the two corner angles match.
E Paralellerin arasında Z’nin bir köşesi $70^\circ$ ise öbür köşesi de $70^\circ$.
H Z açıları ikizdir: zıt taraflarda ama eşit.
T alternate angles = iç ters açılar ;; parallel = paralel ;; transversal = kesen (doğru)
Q Bir yol, iki paralel tren rayını çapraz kesiyor. Rayların arasında, yolun sağ tarafında yol alttaki rayla $70^\circ$ yapıyor. Rayların arasında ama yolun sol tarafında, yol üstteki rayla kaç derece yapar?
QE A road crosses two parallel railway tracks. Between the tracks, on the right of the road, the road makes $70^\circ$ with the lower track. Between the tracks but on the left of the road, what angle does it make with the upper track?
G fgeo_alt

# f-geo-corr | 3 | Yöndeş açılar (F açıları) | Corresponding angles (F angles)
L ~Paralel doğrularda, “F” şeklinde aynı konumda duran iki açı
O :
R ~Birbirine eşittir
X ~Toplamları $180^\circ$’dir ;; ~Toplamları $360^\circ$’dir ;; ~Farkları $90^\circ$’dir
K Kesen, iki paraleli iki ayrı noktada keser. İki açı bu noktalarda aynı yerdedir (ör. ikisi de sağ üstte).
KE The transversal crosses the two parallel lines at two points. The two angles are in the same position at each point (for example, both at the top right).
U Paralel doğrularda bir kesişim noktasındaki açıyı öbür kesişim noktasına taşır.
UE Copies an angle from one crossing point to the matching position at the other crossing point.
W Paralel doğrular aynı yöne gider; kesen ikisini de aynı açıyla keser. Bir kesişimi kesen boyunca kaydırırsan öbürünün tam üstüne oturur.
WE Parallel lines point the same way, so the transversal cuts both at the same angle: slide one crossing along the transversal and it lands on the other.
E Kesen alttaki paralelle sağ üstte $110^\circ$ yapıyorsa üstteki paralelle de sağ üstte $110^\circ$ yapar.
H Yöndeş = aynı yönde, aynı köşede duran açılar.
T corresponding angles = yöndeş açılar ;; parallel lines = paralel doğrular ;; transversal = kesen (doğru)
Q Bir otoparkın park çizgileri birbirine paralel. Kaldırım hepsini çapraz kesiyor ve ilk çizgiyle sağ üstte $60^\circ$ yapıyor. Kaldırım bir sonraki çizgiyle sağ üstte kaç derece yapar?
QE The bay lines in a car park are parallel. The kerb crosses them all and makes $60^\circ$ with the first line at the top right. What angle does it make with the next line at the top right?
G fgeo_corr

# f-geo-coint | 2 | Karşı durumlu açılar (U açıları) | Co-interior angles (U angles)
L ~İki paralel doğru arasında, “U” şeklinin iki iç köşesindeki açılar
O :
R ~Toplamları $180^\circ$’dir
X ~Birbirine eşittir ;; ~Toplamları $360^\circ$’dir ;; ~Toplamları $90^\circ$’dir
K İki açı paralellerin arasında ve kesenin aynı tarafındadır. Z ve F açılarından farklı olarak bunlar eşit değildir!
KE Both angles lie between the parallel lines, on the same side of the transversal. Unlike Z and F angles, they are not equal!
U Paralellerin arasında, kesenin aynı tarafındaki eksik açıyı bulur.
UE Finds a missing angle between parallel lines on the same side of the transversal.
W Alttaki açının hemen yanındaki açı, üstteki açıyla bir Z oluşturur, yani ona eşittir. O açı ile alttaki açı bir doğru üzerindedir: toplamları $180^\circ$.
WE The angle next to the lower one makes a Z with the upper one, so it equals it; and it sits on a straight line with the lower one, so the two add up to $180^\circ$.
E Üstteki açı $70^\circ$ ise alttaki $180^\circ-70^\circ=110^\circ$.
H U açıları bütünlerdir: toplam $180^\circ$.
T co-interior angles = karşı durumlu açılar ;; supplementary angles = bütünler açılar (toplamı $180^\circ$) ;; same side = aynı taraf
Q Bir bahçe kapısının üst ve alt çubukları paralel. Çapraz destek çubuğu üst çubukla, iki çubuğun arasında ve desteğin sağında $50^\circ$ yapıyor. Destek alt çubukla, yine arada ve sağda kaç derece yapar?
QE A garden gate has parallel top and bottom bars. A diagonal brace makes $50^\circ$ with the top bar, between the bars and to the right of the brace. What angle does it make with the bottom bar, also between the bars and to the right?
C a=70:1:179:1 => 180-a
CT b=180^\circ-@a@^\circ=@=@^\circ
G fgeo_coint

# f-geo-tri | 3 | Üçgenin iç açıları | Angles in a triangle
L \hat{A}+\hat{B}+\hat{C}
R 180^\circ
X 360^\circ ;; 90^\circ ;; 270^\circ
K $\hat{A}$, $\hat{B}$, $\hat{C}$: $ABC$ üçgeninin üç iç açısı. Küçük, büyük, dik, sivri: her üçgende geçerli.
KE $\hat{A}$, $\hat{B}$, $\hat{C}$: the three interior angles of triangle $ABC$. This is true for every triangle, whatever its shape or size.
U Bir üçgenin iki açısını biliyorsan üçüncüsünü bulur.
UE Finds the third angle of a triangle from the other two.
W Kâğıttan bir üçgen kes, üç köşesini yırt ve yan yana koy: düz bir çizgi oluşur. Düz çizgi $180^\circ$’dir.
WE Tear the three corners off a paper triangle and put them side by side: they make a straight line, $180^\circ$.
E $\hat{A}=50^\circ$, $\hat{B}=60^\circ$ ise $\hat{C}=180^\circ-50^\circ-60^\circ=70^\circ$.
H Üç köşe yan yana = bir düz çizgi = $180^\circ$.
T interior angle = iç açı ;; triangle = üçgen ;; angle sum = açılar toplamı
Q Bir yelkenlinin üçgen yelkeninin iki köşesindeki açılar $40^\circ$ ve $65^\circ$. Üçüncü köşedeki açı kaç derecedir?
QE A sailing boat has a triangular sail. Two of its corner angles are $40^\circ$ and $65^\circ$. What is the angle at the third corner?
B [[180]]^\circ || 360 ;; 90
C a=50:10:100:1 ; b=60:10:70:1 => 180-a-b
CT \hat{C}=180^\circ-@a@^\circ-@b@^\circ=@=@^\circ
G fgeo_tri
S Öklid, yaklaşık MÖ 300’de yazdığı “Elemanlar” kitabında bu kuralı, üçgenin bir köşesinden paralel bir doğru çizerek ispatladı.

# f-geo-quad | 3 | Dörtgenin iç açıları | Angles in a quadrilateral
L \hat{A}+\hat{B}+\hat{C}+\hat{D}
R 360^\circ
X 180^\circ ;; 720^\circ ;; 540^\circ
K $ABCD$ herhangi bir dörtgen (4 kenarlı şekil): kare, dikdörtgen, yamuk ya da düzensiz bir dörtgen.
KE $ABCD$ is any quadrilateral (a four-sided shape): a square, a rectangle, a trapezium or an irregular one.
U Bir dörtgenin üç açısını biliyorsan dördüncüsünü bulur.
UE Finds the fourth angle of a quadrilateral from the other three.
W Bir köşegen çiz: dörtgen iki üçgene ayrılır. Her üçgen $180^\circ$, iki üçgen $2\cdot 180^\circ=360^\circ$.
WE A diagonal splits the quadrilateral into two triangles: $2\times 180^\circ=360^\circ$.
E Açılar $85^\circ$, $95^\circ$ ve $100^\circ$ ise dördüncüsü $360^\circ-280^\circ=80^\circ$.
H Dört köşe = iki üçgen = $360^\circ$.
T quadrilateral = dörtgen ;; diagonal = köşegen ;; interior angle = iç açı
Q Dört kenarlı bir tarlanın köşelerindeki açılardan üçü $85^\circ$, $95^\circ$ ve $100^\circ$. Dördüncü köşedeki açı kaç derecedir?
QE A field has four straight sides. Three of its corner angles are $85^\circ$, $95^\circ$ and $100^\circ$. What is the fourth corner angle?
B [[360]]^\circ || 180 ;; 720
C a=85:40:130:1 ; b=95:40:130:1 ; c=100:40:100:1 => 360-a-b-c
CT \hat{D}=360^\circ-@a@^\circ-@b@^\circ-@c@^\circ=@=@^\circ
G fgeo_quad

# f-geo-iso | 3 | İkizkenar üçgenin taban açıları | Base angles of an isosceles triangle
L AB=AC
O \Rightarrow
R \hat{B}=\hat{C}
X \hat{A}=\hat{B} ;; \hat{A}=\hat{C} ;; \hat{B}+\hat{C}=90^\circ
K İkizkenar üçgende iki kenar eşittir ($AB=AC$). Bu kenarların karşısındaki taban açıları $\hat{B}$ ve $\hat{C}$ eşittir. $\hat{A}$ tepe açısıdır; her taban açısı $\dfrac{180^\circ-\hat{A}}{2}$ olur.
KE In an isosceles triangle two sides are equal ($AB=AC$). The base angles $\hat{B}$ and $\hat{C}$ opposite them are equal. $\hat{A}$ is the apex angle, and each base angle is $\dfrac{180^\circ-\hat{A}}{2}$.
U İkizkenar üçgende tek bir açıdan diğer açıları bulur.
UE In an isosceles triangle, finds the other angles from just one angle.
W Üçgeni tepeden tabana ikiye katla: iki yarı tam üst üste gelir. Bu yüzden iki taban açısı aynıdır.
WE Fold the triangle down the middle from the apex: the two halves match exactly, so the base angles are equal.
E Tepe açısı $\hat{A}=40^\circ$: $\hat{B}=\hat{C}=\dfrac{180^\circ-40^\circ}{2}=70^\circ$.
H Eşit kenarlar, eşit taban açıları: ikizler gibi.
T isosceles triangle = ikizkenar üçgen ;; base angles = taban açıları ;; apex = tepe noktası
Q Bir çadırın önden görünüşü, iki yan kenarı eşit bir üçgen. Tepedeki açı $40^\circ$. Yerdeki iki açı kaçar derecedir?
QE The front of a tent is a triangle with two equal sloping sides. The angle at the top is $40^\circ$. What are the two angles at the ground?
B \hat{B}=\hat{[[C]]} || A ;; B
C a=40:2:176:2 => (180-a)/2
CT \hat{B}=\dfrac{180^\circ-@a@^\circ}{2}=@=@^\circ
G fgeo_iso

# f-geo-equi | 3 | Eşkenar üçgenin açıları | Angles of an equilateral triangle
L ~Eşkenar üçgenin her bir açısı
R 60^\circ
X 90^\circ ;; 120^\circ ;; 180^\circ
K Eşkenar üçgenin üç kenarı da eşittir; bu yüzden üç açısı da eşittir.
KE An equilateral triangle has three equal sides, so its three angles are equal too.
U Eşkenar üçgen gördüğün anda bütün açılarını bilmeni sağlar.
UE Gives you every angle of an equilateral triangle straight away.
W Üç eşit açı toplam $180^\circ$ ediyor: $180^\circ\div 3=60^\circ$.
WE Three equal angles add up to $180^\circ$, so each one is $180^\circ\div 3=60^\circ$.
E Altı eşkenar üçgen bir noktanın etrafına tam oturur: $6\cdot 60^\circ=360^\circ$. Düzgün altıgen böyle oluşur (arı peteğini düşün).
H Eşkenar = eş açılı: hepsi $60^\circ$.
T equilateral triangle = eşkenar üçgen ;; equal = eşit ;; regular hexagon = düzgün altıgen
Q Bir trafik levhası, üç kenarı da $90$ cm olan bir üçgen. Levhanın köşelerindeki açılar kaçar derecedir?
QE A road sign is a triangle whose three sides are all $90$ cm long. How big is each of its corner angles?
B [[60]]^\circ || 90 ;; 120
G fgeo_equi

# f-geo-pyth | 3 | Pisagor teoremi | Pythagoras’ theorem
L a^2+b^2
R c^2
X c ;; (a+b)^2 ;; 2c
K Sadece dik üçgenlerde! $c$: hipotenüs (dik açının karşısındaki, en uzun kenar), $a$ ve $b$: dik kenarlar.
KE Right-angled triangles only! $c$: the hypotenuse (opposite the right angle, the longest side); $a$ and $b$: the two shorter sides.
U Dik üçgende iki kenarı biliyorsan üçüncüsünü bulur.
UE Finds the third side of a right-angled triangle from the other two.
W Her kenarın üstüne bir kare çiz. İki küçük karenin alanları toplamı, büyük karenin alanına tam eşittir: $9+16=25$.
WE Draw a square on each side: the two smaller squares together have exactly the area of the biggest one, $9+16=25$.
E Dik kenarlar $3$ ve $4$: $c^2=9+16=25$, $c=5$. Kısa kenarı arıyorsan çıkar: $b^2=c^2-a^2$.
H Kısa² + kısa² = uzun².
T hypotenuse = hipotenüs ;; right-angled triangle = dik üçgen ;; Pythagoras’ theorem = Pisagor teoremi
Q Bir merdivenin ayağı duvardan $3$ m uzakta, ucu duvarda $4$ m yüksekte. Merdiven kaç metre uzunluğunda?
QE The foot of a ladder is $3$ m from a wall and its top is $4$ m up the wall. How long is the ladder?
B [[c]]^2 || a ;; b
C a=3:1:20:1 ; b=4:1:20:1 => sqrt(a^2+b^2)
CT c=\sqrt{@a@^2+@b@^2}=@=@
G fgeo_pyth
LAB pythagoras
S Babilliler bu ilişkiyi Pisagor’dan bin yıldan uzun süre önce biliyordu: yaklaşık MÖ 1800’den kalma Plimpton 322 kil tableti, Pisagor üçlüleriyle ilgili sayılar içerir.

# f-geo-sim-len | 2 | Benzer şekiller: uzunluklar | Similar shapes: lengths
L l'
R k\,l
X l+k ;; k^2\,l ;; \dfrac{l}{k}
K $l$: ilk şekildeki bir uzunluk, $l'$: benzer şekildeki karşılığı, $k$: ölçek çarpanı ($k=\dfrac{l'}{l}$). $k>1$ büyütür, $0<k<1$ küçültür.
KE $l$: a length in the first shape, $l'$: the matching length in the similar shape, $k$: the scale factor ($k=\dfrac{l'}{l}$). $k>1$ enlarges, $0<k<1$ reduces.
U Bir şekil büyütülünce ya da küçültülünce yeni uzunlukları bulur.
UE Finds the new lengths when a shape is enlarged or reduced.
W Benzer şekillerin biçimi aynı, sadece boyları farklıdır. Fotoğraf büyütmek gibi: her uzunluk aynı sayıyla çarpılır, açılar hiç değişmez.
WE Similar shapes have the same shape but a different size: every length is multiplied by the same number and the angles do not change.
E $k=3$: $4$ cm’lik kenar $3\cdot 4=12$ cm olur. $k=\tfrac12$: $10$ cm’lik kenar $5$ cm olur.
H Uzunluk: bir kez $k$ ile çarp.
T similar = benzer ;; scale factor = ölçek çarpanı ;; enlargement = büyütme
Q Bir fotoğraf $3$ kat büyütülerek bastırılıyor. Fotoğrafta $4$ cm boyunda görünen kişi, büyük baskıda kaç cm olur?
QE A photo is printed $3$ times larger. A person who is $4$ cm tall in the photo is how tall in the large print?
B [[k]]\,l || k^2 ;; \dfrac{1}{k}
C k=3:0.5:5:0.5 ; l=4:1:20:1 => k*l
CT l'=@k@\times @l@=@=@
G fgeo_simlen

# f-geo-sim-area | 2 | Benzer şekiller: alanlar | Similar shapes: areas
L A'
R k^2A
X k\,A ;; 2k\,A ;; k^3A
K $A$: ilk şeklin alanı, $A'$: benzer şeklin alanı, $k$: uzunluklar için ölçek çarpanı.
KE $A$: the area of the first shape, $A'$: the area of the similar shape, $k$: the scale factor for lengths.
U Bir şekil büyütülünce alanının kaç katına çıktığını bulur.
UE Finds how many times bigger the area gets when a shape is enlarged.
W Kenarı $1$ olan bir kareyi $2$ katına büyüt: kenarı $2$ olur ama içine $2\times 2=4$ küçük kare sığar. Alan iki yönde birden büyür: $k\times k=k^2$.
WE Double the side of a unit square and four unit squares fit inside: area grows in two directions at once, $k\times k=k^2$.
E Uzunluklar $3$ katına çıkarsa alan $3^2=9$ katına çıkar: $5\ \text{cm}^2\to 45\ \text{cm}^2$.
H Uzunluk $\times k$, alan $\times k^2$ (hacim $\times k^3$).
T similar shapes = benzer şekiller ;; scale factor = ölçek çarpanı ;; area = alan
Q Bir pizzacıda büyük pizzanın çapı küçüğünkünün tam $2$ katı. Büyük pizzada, küçüğe göre kaç kat pizza vardır?
QE At a pizza shop the large pizza’s diameter is exactly $2$ times the small one’s. How many times as much pizza does the large one have?
B [[k^2]]A || k ;; 2k ;; k^3
C k=3:0.5:5:0.5 ; A=5:1:50:1 => k^2*A
CT A'=@k@^2\times @A@=@=@
G fgeo_simarea

# f-geo-sin | 3 | Sinüs: SOH | Sine: SOH
L \sin\theta
R \dfrac{\text{opp}}{\text{hyp}}
X \dfrac{\text{adj}}{\text{hyp}} ;; \dfrac{\text{opp}}{\text{adj}} ;; \dfrac{\text{hyp}}{\text{opp}}
K Sadece dik üçgende. $\theta$: dik olmayan bir açı. opp (opposite): $\theta$’nın karşısındaki kenar; hyp (hypotenuse): dik açının karşısındaki en uzun kenar. Hesap makinesi derece (DEG) modunda olsun.
KE Right-angled triangles only. $\theta$: one of the angles that is not the right angle. opp: the side opposite $\theta$; hyp: the hypotenuse, opposite the right angle. Use degree mode on your calculator.
U Dik üçgende açı, karşı kenar ve hipotenüsü birbirine bağlar: biri eksikse onu bulur.
UE Links an angle, the opposite side and the hypotenuse of a right-angled triangle, so you can find the missing one.
W Açı aynı kaldıkça üçgeni ne kadar büyütsen de $\dfrac{\text{opp}}{\text{hyp}}$ oranı değişmez. $\sin\theta$ bu sabit oranın adıdır.
WE For a fixed angle the ratio of opp to hyp stays the same however big the triangle is; $\sin\theta$ is the name of that ratio.
E Hipotenüs $10$, $\theta=30^\circ$: $\text{opp}=10\cdot\sin 30^\circ=10\cdot 0{,}5=5$.
H SOH: Sine = Opposite / Hypotenuse.
T sine = sinüs ;; opposite side = karşı kenar ;; hypotenuse = hipotenüs
Q Bir uçurtmanın ipi $10$ m uzunluğunda ve yerle $30^\circ$’lik açı yapıyor. Uçurtma yerden kaç metre yüksekte?
QE A kite string is $10$ m long and makes an angle of $30^\circ$ with the ground. How high above the ground is the kite?
B \dfrac{[[\text{opp}]]}{[[\text{hyp}]]} || \text{adj} ;; \theta
C t=30:1:89:1 ; h=10:1:50:1 => h*sin(deg(t))
CT \text{opp}=@h@\cdot\sin @t@^\circ=@=@
G fgeo_sin
LAB trigtriangle

# f-geo-cos | 3 | Kosinüs: CAH | Cosine: CAH
L \cos\theta
R \dfrac{\text{adj}}{\text{hyp}}
X \dfrac{\text{opp}}{\text{hyp}} ;; \dfrac{\text{opp}}{\text{adj}} ;; \dfrac{\text{hyp}}{\text{adj}}
K adj (adjacent): $\theta$’nın yanındaki kenar, ama hipotenüs olmayan. hyp: hipotenüs. Hangi kenarın “karşı”, hangisinin “komşu” olduğu, seçtiğin açıya göre değişir!
KE adj (adjacent): the side next to $\theta$ that is not the hypotenuse. hyp: the hypotenuse. Which side is opposite and which is adjacent depends on the angle you choose!
U Dik üçgende açı, komşu kenar ve hipotenüsü birbirine bağlar.
UE Links an angle, the adjacent side and the hypotenuse of a right-angled triangle.
W $\cos\theta$, hipotenüsün ne kadarının yatayda (açının yanında) kaldığını söyler. Açı küçüldükçe üçgen yassılaşır ve oran $1$’e yaklaşır.
WE $\cos\theta$ tells you how much of the hypotenuse lies along the side next to the angle; the smaller the angle, the closer the ratio gets to 1.
E Hipotenüs $6$, $\theta=60^\circ$: $\text{adj}=6\cdot\cos 60^\circ=6\cdot 0{,}5=3$.
H CAH: Cosine = Adjacent / Hypotenuse.
T cosine = kosinüs ;; adjacent side = komşu kenar ;; right angle = dik açı
Q Duvara dayanan $6$ m’lik bir merdiven yerle $60^\circ$’lik açı yapıyor. Merdivenin ayağı duvardan kaç metre uzakta?
QE A $6$ m ladder leans against a wall and makes an angle of $60^\circ$ with the ground. How far is the foot of the ladder from the wall?
B \dfrac{[[\text{adj}]]}{[[\text{hyp}]]} || \text{opp} ;; \theta
C t=60:1:89:1 ; h=6:1:50:1 => h*cos(deg(t))
CT \text{adj}=@h@\cdot\cos @t@^\circ=@=@
G fgeo_cos
LAB trigtriangle

# f-geo-tan | 3 | Tanjant: TOA | Tangent: TOA
L \tan\theta
R \dfrac{\text{opp}}{\text{adj}}
X \dfrac{\text{adj}}{\text{opp}} ;; \dfrac{\text{opp}}{\text{hyp}} ;; \dfrac{\text{adj}}{\text{hyp}}
K opp: $\theta$’nın karşısındaki kenar, adj: $\theta$’nın yanındaki kenar (hipotenüs olmayan). Hipotenüs bu formülde hiç yok!
KE opp: the side opposite $\theta$; adj: the side next to $\theta$ that is not the hypotenuse. The hypotenuse is not used at all here!
U Hipotenüsü bilmeden açıyı iki dik kenara bağlar; yükseklik problemlerinin yıldızıdır.
UE Links the angle to the two shorter sides without the hypotenuse; ideal for height problems.
W $\tan\theta$, yatayda bir adım gidince kaç adım yükseldiğini söyler. Bu, rampanın eğimiyle aynı fikir!
WE $\tan\theta$ tells you how far you rise for each step across, the same idea as the gradient of a slope.
E Ağaca $20$ m uzaktasın ve tepesine $45^\circ$ ile bakıyorsun: $\text{opp}=20\cdot\tan 45^\circ=20\cdot 1=20$ m.
H TOA: Tangent = Opposite / Adjacent. Üçü birlikte: SOH-CAH-TOA (“so-ka-toa” diye oku).
T tangent = tanjant ;; angle of elevation = yükselme açısı ;; adjacent side = komşu kenar
Q Bir ağaçtan $20$ m uzakta duruyorsun ve ağacın tepesine $45^\circ$’lik açıyla bakıyorsun (göz yüksekliğini yok say). Ağaç kaç metre boyundadır?
QE You stand $20$ m from a tree and look up at its top at an angle of elevation of $45^\circ$ (ignore your eye height). How tall is the tree?
B \dfrac{[[\text{opp}]]}{[[\text{adj}]]} || \text{hyp} ;; \theta
C t=45:1:89:1 ; a=20:1:50:1 => a*tan(deg(t))
CT \text{opp}=@a@\cdot\tan @t@^\circ=@=@
G fgeo_tan
LAB trigtriangle

# f-geo-inv | 3 | Açıyı bulmak: ters trigonometri | Finding an angle: inverse trigonometry
L \theta
R \sin^{-1}\left(\dfrac{\text{opp}}{\text{hyp}}\right)
X \dfrac{1}{\sin\left(\frac{\text{opp}}{\text{hyp}}\right)} ;; \sin\left(\dfrac{\text{opp}}{\text{hyp}}\right) ;; \sin^{-1}\left(\dfrac{\text{hyp}}{\text{opp}}\right)
K $\sin^{-1}$: ters sinüs. “Sinüsü bu oran olan açı” demektir; $\dfrac{1}{\sin}$ değildir! Hesap makinesinde genelde SHIFT (ya da 2nd) + sin. Aynı fikirle: $\theta=\cos^{-1}\left(\tfrac{\text{adj}}{\text{hyp}}\right)$ ve $\theta=\tan^{-1}\left(\tfrac{\text{opp}}{\text{adj}}\right)$.
KE $\sin^{-1}$ is the inverse sine: the angle whose sine is the ratio. It is not $\dfrac{1}{\sin}$! On a calculator it is usually SHIFT (or 2nd) then sin. In the same way, $\theta=\cos^{-1}\left(\tfrac{\text{adj}}{\text{hyp}}\right)$ and $\theta=\tan^{-1}\left(\tfrac{\text{opp}}{\text{adj}}\right)$.
U Dik üçgende iki kenarı biliyorsan açıyı bulur.
UE Finds an angle of a right-angled triangle from two of its sides.
W $\sin$ açıyı orana çevirir; $\sin^{-1}$ aynı yolu geri yürür: orandan açıyı bulur.
WE sin turns an angle into a ratio; $\sin^{-1}$ walks back the same way, from the ratio to the angle.
E $\text{opp}=5$, $\text{hyp}=10$: $\theta=\sin^{-1}(0{,}5)=30^\circ$.
H Kenar arıyorsan sin, cos, tan; açı arıyorsan SHIFT ile $\sin^{-1}$, $\cos^{-1}$, $\tan^{-1}$.
T inverse sine = ters sinüs ($\sin^{-1}$) ;; angle = açı ;; degree mode = derece modu
Q Bir rampa $10$ m uzunluğunda ve üst ucu yerden $5$ m yüksekte. Rampa yerle kaç derecelik açı yapar?
QE A ramp is $10$ m long and its top end is $5$ m above the ground. What angle does the ramp make with the ground?
B [[\sin^{-1}]]\left(\dfrac{\text{opp}}{\text{hyp}}\right) || \sin ;; \dfrac{1}{\sin} ;; \cos^{-1}
C o=5:1:10:1 ; h=10:10:20:1 => asin(o/h)*180/PI
CT \theta=\sin^{-1}\left(\dfrac{@o@}{@h@}\right)=@=@^\circ
G fgeo_inv
LAB trigtriangle

## f-graph

# f-graph-coord | 3 | Koordinatlar $(x,\ y)$ | Coordinates $(x,\ y)$
L (x,\ y)
O :
R ~Önce sağa/sola ($x$), sonra yukarı/aşağı ($y$)
X ~Önce yukarı/aşağı ($y$), sonra sağa/sola ($x$) ;; ~$x$ ile $y$ arasındaki bütün sayılar ;; ~İkisi de noktanın orijine uzaklığı
K $(0,\ 0)$: orijin (başlangıç noktası). $x$ negatifse sola, $y$ negatifse aşağı gidilir.
KE $(0,\ 0)$ is the origin. A negative $x$ means go left; a negative $y$ means go down.
U Bir noktanın grafikteki yerini iki sayıyla tam olarak söyler.
UE Gives the exact position of a point on a graph with two numbers.
W Bir binada önce koridorda yürür, sonra asansörle çıkarsın. Koordinatlarda da önce yatay ($x$), sonra dikey ($y$) gidilir.
WE Like walking along a corridor before taking the lift: first across ($x$), then up or down ($y$).
E $(3,\ -2)$: orijinden $3$ sağa, $2$ aşağı. $(-4,\ 1)$: $4$ sola, $1$ yukarı.
H Alfabede $x$, $y$’den önce gelir: önce $x$! İngilizce kalıp: “along the corridor, then up the stairs”.
T coordinates = koordinatlar ;; origin = orijin (başlangıç noktası) ;; x-axis = $x$ ekseni
Q Bir haritada hazine, başlangıç noktasının $3$ birim doğusunda ve $2$ birim güneyinde. Hazinenin yerini iki sayıyla nasıl yazarsın?
QE On a map the treasure is $3$ units east and $2$ units south of the starting point. How do you write its position with two numbers?
G fgeo_g_coord
S René Descartes koordinat fikrini 1637’de “La Géométrie” adlı eserinde yayımladı. Efsaneye göre fikir, tavanda gezinen bir sineği izlerken aklına gelmiş.

# f-graph-fx | 3 | Fonksiyon gösterimi: $f(3)$ hesaplamak | Function notation: evaluating $f(3)$
L f(x)=2x+1
O \Rightarrow
R f(3)=2\cdot 3+1=7
X f(3)=3(2x+1) ;; f(3)=23+1=24 ;; f(3)=2x+1+3
K $f$: fonksiyonun adı, $x$: giriş (input), $f(x)$: çıkış (output). $f(3)$, “$x$ yerine $3$ koy” demektir; $f$ ile $3$’ün çarpımı değildir.
KE $f$ is the name of the function, $x$ is the input and $f(x)$ is the output. $f(3)$ means “replace $x$ by 3”; it is not $f$ times 3.
U Bir fonksiyona (kurala) bir sayı verip ondan çıkan sonucu hesaplar.
UE Works out the output of a function for a given input.
W Fonksiyon bir makine gibidir: içine $3$ atarsın, makine kuralı uygular ($2$ ile çarp, $1$ ekle) ve dışarı $7$ çıkar.
WE A function is a machine: put 3 in, it applies the rule (multiply by 2, add 1) and 7 comes out.
E $f(x)=x^2-1$ ise $f(4)=4^2-1=15$ ve $f(-2)=(-2)^2-1=3$. Negatif sayıyı paranteze almayı unutma!
H $f(\text{sayı})$: $x$’i sil, yerine sayıyı yaz.
T function = fonksiyon ;; input = giriş (girdi) ;; output = çıkış (çıktı)
Q Bir taksi açılışta $5$ TL, her km için $2$ TL alıyor. Ücret kuralını $x$ km için yazdın. $8$ km’lik bir yolculuk kaç TL tutar?
QE A taxi charges $5$ lira to start plus $2$ lira per km. You have written the fare rule for $x$ km. How much does an $8$ km ride cost?
B f(3)=2\cdot [[3]]+1=[[7]] || x ;; 6 ;; 9
C a=2:-10:10:1 ; b=1:-20:20:1 ; x=3:0:10:1 => a*x+b
CT f(@x@)=@a@\cdot @x@+@b@=@=@
G fgeo_g_eval

# f-graph-on | 3 | Nokta grafiğin üzerinde mi? | Does a point lie on the graph?
L ~$(a,\ b)$ noktası $y=f(x)$ grafiğinin üzerindedir
O \iff
R b=f(a)
X a=f(b) ;; f(a)=0 ;; b=f(b)
K Noktanın $x$ değerini fonksiyona koy. Çıkan sonuç noktanın $y$ değerine eşitse nokta grafiğin üzerindedir, değilse değildir.
KE Put the point’s $x$-coordinate into the function. If the output equals the point’s $y$-coordinate, the point lies on the graph; otherwise it does not.
U Bir noktanın bir doğru ya da eğri üzerinde olup olmadığını çizmeden kontrol eder.
UE Checks whether a point lies on a graph without drawing it.
W Grafik, $(x,\ f(x))$ noktalarının hepsidir. $x=a$ iken grafiğin yüksekliği $f(a)$’dır; noktanın yüksekliği $b$ de buna eşitse nokta tam grafiğin üstündedir.
WE A graph is the set of all points $(x,\ f(x))$. At $x=a$ the graph is at height $f(a)$, so the point is on it exactly when $b=f(a)$.
E $f(x)=3x-2$. $(2,\ 4)$: $f(2)=4$, evet üzerinde. $(1,\ 5)$: $f(1)=1\ne 5$, değil.
H Önce $x$’i koy, sonra $y$’yi kontrol et.
T lies on = üzerinde olmak ;; graph = grafik ;; point = nokta
Q Bir topun yüksekliği zamana göre bir kuralla veriliyor. Arkadaşın “$2$. saniyede top $4$ m yüksekteydi” diyor. Bunun doğru olup olmadığını nasıl kontrol edersin?
QE A ball’s height is given by a rule in terms of time. A friend says “after $2$ seconds the ball was $4$ m high”. How can you check whether this is true?
B [[b]]=f([[a]]) || 0 ;; x
G fgeo_g_on

# f-graph-yint | 3 | $y$-kesişimi: $x=0$ koy | The $y$-intercept: put $x=0$
L ~$y$ eksenini kestiği noktayı (y-intercept) bulmak için
O :
R x=0
X y=0 ;; x=y ;; x=1
K Bulduğun nokta $(0,\ f(0))$’dır. Bir fonksiyonun en fazla bir $y$-kesişimi vardır.
KE The point you find is $(0,\ f(0))$. A function has at most one $y$-intercept.
U Grafiğin dikey ekseni ($y$ eksenini) nerede kestiğini bulur.
UE Finds where a graph crosses the vertical axis, the $y$-axis.
W $y$ ekseninin üzerindeki her noktada $x=0$’dır: ne sağa ne sola gidilmiştir. O yüzden $x=0$ koyarsın.
WE Every point on the $y$-axis has $x=0$ (you have moved neither left nor right), so you substitute $x=0$.
E $f(x)=2x^2-3x+5$: $f(0)=0-0+5=5$. $y$-kesişimi $(0,\ 5)$.
H $y$-kesişimini istiyorsan $x$’i sıfırla.
T y-intercept = $y$ eksenini kestiği nokta ;; y-axis = $y$ ekseni ;; substitute = yerine koymak
Q Bir havuz doldurulurken içindeki su miktarı zamana göre bir fonksiyonla veriliyor. Musluk açıldığı anda, en başta, havuzda ne kadar su vardı?
QE While a pool is being filled, the amount of water in it is given by a function of time. How much water was in the pool at the very start, when the tap was turned on?
B [[x]]=0 || y ;; f(x)
C a=2:-5:5:1 ; b=-3:-10:10:1 ; c=5:-10:10:1 => a*0^2+b*0+c
CT f(0)=@a@\cdot 0^2+@b@\cdot 0+@c@=@=@
G fgeo_g_yint
LAB line

# f-graph-xint | 3 | $x$-kesişimleri (kökler): $y=0$ koy | The $x$-intercepts (roots): put $y=0$
L ~$x$ eksenini kestiği noktaları (x-intercepts) bulmak için
O :
R y=0
X x=0 ;; x=y ;; y=1
K Yani $f(x)=0$ denklemini çöz. Çözümlere kök (root) ya da sıfır (zero) denir; noktalar $(r,\ 0)$ biçimindedir. Hiç olmayabilir, bir ya da daha fazla olabilir.
KE That is, solve $f(x)=0$. The solutions are called roots or zeros, and the points have the form $(r,\ 0)$. There may be none, one or several.
U Grafiğin yatay ekseni ($x$ eksenini) nerede kestiğini bulur.
UE Finds where a graph crosses the horizontal axis, the $x$-axis.
W $x$ ekseninin üzerindeki her noktanın yüksekliği sıfırdır, yani $y=0$’dır.
WE Every point on the $x$-axis is at height zero, so $y=0$ there.
E $f(x)=2x-6$: $2x-6=0$, $x=3$. Nokta: $(3,\ 0)$.
H $x$-kesişimi için $y$’yi sıfırla. İkisi çapraz: $y$-kesişimi için $x=0$, $x$-kesişimi için $y=0$.
T x-intercept = $x$ eksenini kestiği nokta ;; root = kök ;; zero (of a function) = fonksiyonun sıfırı
Q Havaya atılan bir topun yüksekliği zamana göre bir fonksiyonla veriliyor. Top yere ne zaman düşer?
QE The height of a ball thrown into the air is given by a function of time. When does the ball hit the ground?
B [[y]]=0 || x ;; f(0)
C a=2:1:10:1 ; b=-6:-20:20:1 => -b/a
CT @a@x+@b@=0\ \Rightarrow\ x=@=@
G fgeo_g_xint
LAB line

# f-graph-grad | 3 | Eğim: dikey değişim bölü yatay değişim | Gradient: rise over run
L m
R \dfrac{\text{rise}}{\text{run}}
X \dfrac{\text{run}}{\text{rise}} ;; \text{rise}\times\text{run} ;; \text{rise}-\text{run}
K rise: dikey değişim ($y$ ne kadar arttı), run: yatay değişim ($x$ ne kadar arttı). Hep soldan sağa oku: aşağı iniyorsan rise negatiftir.
KE rise: the vertical change (change in $y$); run: the horizontal change (change in $x$). Always read from left to right: going down means a negative rise.
U Bir doğrunun ne kadar dik olduğunu tek bir sayıyla söyler.
UE Measures how steep a line is with a single number.
W Eğim, sağa $1$ adım attığında kaç adım yukarı çıktığını söyler. $m=2$: her adımda $2$ yukarı; $m=\tfrac12$: her adımda yarım adım yukarı.
WE The gradient tells you how far up you go for each step to the right: $m=2$ means 2 up per step, $m=\tfrac12$ means half a step up.
E Sağa $4$ git, $8$ yukarı çık: $m=\tfrac84=2$. Sağa $3$ git, $6$ aşağı in: $m=\tfrac{-6}{3}=-2$.
H Önce yukarı (rise), sonra yana (run): “rise over run”.
T gradient = eğim ;; rise = dikey değişim ;; run = yatay değişim
Q Bir rampa yatayda $12$ m ilerlerken $3$ m yükseliyor. Rampanın ne kadar dik olduğunu tek bir sayıyla nasıl ifade edersin?
QE A ramp rises $3$ m over a horizontal distance of $12$ m. How can you describe how steep it is with one number?
B \dfrac{[[\text{rise}]]}{[[\text{run}]]} || x ;; y
C rise=6:-20:20:1 ; run=3:1:20:1 => rise/run
CT m=\dfrac{@rise@}{@run@}=@=@
G fgeo_g_grad
LAB line

# f-graph-sign | 3 | Eğimin işareti | The sign of the gradient
L ~Soldan sağa giderken doğru yükseliyor
O \Rightarrow
R m>0
X m<0 ;; m=0 ;; m\ \text{tanımsız}
K $m>0$: soldan sağa yükselir. $m<0$: soldan sağa alçalır. $m=0$: yataydır.
KE $m>0$: the line goes up from left to right. $m<0$: it goes down. $m=0$: it is horizontal.
U Bir doğruya bakarak eğiminin işaretini, eğime bakarak da doğrunun yönünü hemen söyler.
UE Lets you tell the sign of the gradient from the picture of a line, and the other way round.
W Pozitif eğimde sağa giderken yukarı çıkarsın: rise pozitif. Negatif eğimde sağa giderken aşağı inersin: rise negatif.
WE With a positive gradient you go up as you move right (positive rise); with a negative gradient you go down (negative rise).
E $y=3x+1$ yükselir ($m=3>0$). $y=5-2x$ alçalır ($m=-2<0$).
H Kitap okur gibi soldan sağa: yokuş yukarı $+$, yokuş aşağı $-$.
T positive gradient = pozitif eğim ;; negative gradient = negatif eğim ;; increasing = artan
Q Bir uçağın yüksekliği kalkıştan sonra düzenli olarak artıyor. Yükseklik–zaman grafiğindeki doğrunun eğimi hakkında ne söyleyebilirsin?
QE After take-off a plane’s height increases steadily. What can you say about the gradient of the line on its height–time graph?
B m[[>]]0 || < ;; =
G fgeo_g_sign
LAB line

# f-graph-mxc | 3 | $y=mx+c$: $m$ ve $c$ ne demek? | $y=mx+c$: what $m$ and $c$ mean
L y=mx+c
O :
R ~$m$: eğim, $c$: $y$-kesişimi
X ~$m$: $y$-kesişimi, $c$: eğim ;; ~$m$: eğim, $c$: $x$-kesişimi ;; ~$m$: $x$-kesişimi, $c$: eğim
K Doğru $y$ eksenini $(0,\ c)$ noktasında keser. Önce denklemi $y=\dots$ biçimine getir: $y=5-2x$ için $m=-2$, $c=5$.
KE The line crosses the $y$-axis at $(0,\ c)$. First write the equation as $y=\dots$: for $y=5-2x$, $m=-2$ and $c=5$.
U Bir doğru denklemine bakar bakmaz eğimini ve $y$ eksenini kestiği yeri okur.
UE Lets you read the gradient and the $y$-intercept straight from the equation.
W $x=0$ koy: $y=c$, yani doğru $(0,\ c)$’den geçer. $x$ her $1$ arttığında $y$ tam $m$ artar: eğim $m$’dir.
WE Put $x=0$ and you get $y=c$; each time $x$ goes up by 1, $y$ goes up by $m$, so $m$ is the gradient.
E $y=3x-4$: eğim $3$, $y$-kesişimi $(0,\ -4)$.
H $m$: “move” (ne kadar dik gidiyor), $c$: “cross” ($y$ eksenini nerede kesiyor).
T gradient = eğim ;; y-intercept = $y$ eksenini kestiği nokta ;; equation of a line = doğru denklemi
Q Bir telefon tarifesinde $x$ GB için ödenen ücret $y=5x+20$ TL. Grafik $y$ eksenini nerede keser ve her ek GB ücreti ne kadar artırır?
QE A phone plan costs $y=5x+20$ lira for $x$ GB. Where does its graph cross the $y$-axis, and how much does each extra GB add?
C m=3:-10:10:0.5 ; c=-4:-20:20:1 ; x=2:-10:10:1 => m*x+c
CT y=@m@\cdot @x@+@c@=@=@
G fgeo_g_mxc
LAB line

# f-graph-horiz | 2 | Yatay doğru $y=k$ | Horizontal line $y=k$
L y=k
O \Rightarrow
R m=0
X m=k ;; m=\dfrac{k}{x} ;; m\ \text{tanımsız}
K $k$ sabit bir sayıdır. Doğru $y$ eksenini $(0,\ k)$ noktasında keser ve $x$ eksenine paraleldir. Üzerindeki her noktanın $y$ değeri aynıdır: $k$.
KE $k$ is a constant. The line crosses the $y$-axis at $(0,\ k)$ and is parallel to the $x$-axis; every point on it has the same $y$-coordinate, $k$.
U Hiç değişmeyen bir miktarın grafiğini ve eğimini anlatır.
UE Describes the graph of a quantity that never changes, and its gradient.
W Sağa ne kadar gidersen git $y$ hep aynı kalır: rise $=0$. Eğim $\dfrac{0}{\text{run}}=0$.
WE However far you move right, $y$ stays the same, so the rise is 0 and the gradient is 0.
E $y=3$: $(-2,\ 3)$, $(0,\ 3)$ ve $(5,\ 3)$ noktalarının hepsi doğrunun üzerinde; eğim $0$.
H Yatay = dümdüz = eğim sıfır.
T horizontal = yatay ;; constant = sabit ;; parallel = paralel
Q Bir araba otoparkta $3$ saat boyunca hiç kıpırdamadan duruyor. Konum–zaman grafiğinde bu $3$ saatlik parça nasıl bir doğrudur ve eğimi kaçtır?
QE A car stays parked without moving for $3$ hours. On a distance–time graph, what kind of line is this part and what is its gradient?
B m=[[0]] || 1 ;; k
G fgeo_g_horiz
LAB line

# f-graph-vert | 2 | Dikey doğru $x=k$ | Vertical line $x=k$
L x=k
O :
R ~Dikey doğru; eğimi tanımsız
X ~Yatay doğru; eğimi $0$ ;; ~Eğimi $k$ olan doğru ;; ~Orijinden geçen doğru
K Doğru $x$ eksenini $(k,\ 0)$ noktasında keser ve $y$ eksenine paraleldir. Bir fonksiyon değildir: tek bir $x$ değerine sonsuz tane $y$ düşer.
KE The line crosses the $x$-axis at $(k,\ 0)$ and is parallel to the $y$-axis. It is not a function: one $x$ value has infinitely many $y$ values.
U Bütün noktaları aynı $x$ değerine sahip olan doğruyu tanır.
UE Recognises the line made of points that all have the same $x$-coordinate.
W Yukarı çıkarsın ama sağa hiç gitmezsin: run $=0$. Sıfıra bölünemediği için eğim tanımsızdır (undefined).
WE You go up but never to the right, so the run is 0; you cannot divide by zero, so the gradient is undefined.
E $x=2$: $(2,\ -1)$, $(2,\ 0)$ ve $(2,\ 7)$ noktalarının hepsi bu doğrunun üzerinde.
H $x=k$: “$x$ kilitli”, doğru dimdik durur.
T vertical = dikey (düşey) ;; undefined = tanımsız ;; parallel to the y-axis = $y$ eksenine paralel
Q Bir haritada bir cadde tam kuzey–güney yönünde uzanıyor; üzerindeki her evin doğu koordinatı $2$. Caddenin grafiği nasıl bir doğrudur, eğimi var mı?
QE On a map a street runs exactly north–south, and every house on it has east coordinate $2$. What kind of line is the street, and does it have a gradient?
G fgeo_g_vert

# f-graph-inter | 3 | İki grafiğin kesişimi | Intersection of two graphs
L ~$y=f(x)$ ile $y=g(x)$ grafiklerinin kesişim noktalarının $x$ değerleri
O :
R ~$f(x)=g(x)$ denkleminin çözümleri
X ~$f(x)+g(x)=0$ denkleminin çözümleri ;; ~$f(x)=0$ denkleminin çözümleri ;; ~$f(0)=g(0)$ olan değerler
K $x$’i bulunca $y=f(x)$ ile $y$’yi de hesapla; kesişim noktası $(x,\ y)$ olur. GDC’deki “intersect” komutu aynı işi yapar.
KE After finding $x$, work out $y=f(x)$; the point of intersection is $(x,\ y)$. The “intersect” tool on a GDC does the same job.
U İki grafiğin nerede buluştuğunu bulur; örneğin iki tarifenin ne zaman aynı ücreti tuttuğunu.
UE Finds where two graphs meet, for example when two price plans cost the same.
W Kesişim noktasında iki grafik aynı yerdedir: aynı $x$ için aynı $y$. Bu yüzden iki kuralı birbirine eşitlersin.
WE At a point of intersection both graphs are in the same place, the same $y$ for the same $x$, so you set the two rules equal.
E $f(x)=2x+1$, $g(x)=x+4$: $2x+1=x+4$, $x=3$, $y=7$. Kesişim noktası $(3,\ 7)$.
H Kesişim = “eşit oldukları an”: $f=g$.
T point of intersection = kesişim noktası ;; intersect = kesişmek ;; solve = çözmek
Q A tarifesi aylık $10$ TL artı dakikası $2$ TL; B tarifesi aylık $40$ TL artı dakikası $1$ TL. Kaç dakikada iki tarife aynı ücreti tutar?
QE Plan A costs $10$ lira a month plus $2$ lira per minute; plan B costs $40$ lira a month plus $1$ lira per minute. After how many minutes do they cost the same?
C m=2:2:6:1 ; c=1:-10:10:1 ; n=1:-5:1:1 ; d=4:-10:10:1 => (d-c)/(m-n)
CT @m@x+@c@=@n@x+@d@\ \Rightarrow\ x=@=@
G fgeo_g_inter
LAB line

# f-graph-domain | 2 | Tanım kümesi | Domain
L ~Bir fonksiyonun tanım kümesi (domain)
O :
R ~Fonksiyona girebilen bütün $x$ değerleri
X ~Fonksiyondan çıkabilen bütün $y$ değerleri ;; ~Grafiğin $x$ eksenini kestiği noktalar ;; ~Sadece pozitif $x$ değerleri
K İki yasak: paydayı $0$ yapan $x$ (sıfıra bölme) ve karekökün içini negatif yapan $x$. IB yazımı: $x\in\mathbb{R},\ x\ne 3$ ya da $x\ge 2$ gibi.
KE Two things to avoid: an $x$ that makes a denominator 0, and an $x$ that makes the inside of a square root negative. IB writes it like $x\in\mathbb{R},\ x\ne 3$ or $x\ge 2$.
U Fonksiyona hangi sayıları koyabileceğini söyler.
UE Tells you which input values a function accepts.
W Makineye her şeyi atamazsın: $\dfrac{1}{x-3}$ makinesi $3$’ü kabul etmez, çünkü $\tfrac{1}{0}$ tanımsızdır.
WE A function machine cannot take every input: $\dfrac{1}{x-3}$ rejects 3 because $\tfrac{1}{0}$ is undefined.
E $f(x)=\sqrt{x-2}$: tanım kümesi $x\ge 2$. $g(x)=\dfrac{1}{x-3}$: tanım kümesi $x\in\mathbb{R},\ x\ne 3$.
H Domain = “kapı”: içeri ne girebilir ($x$)? Range = “menzil”: dışarı ne çıkabilir ($y$)?
T domain = tanım kümesi ;; undefined = tanımsız ;; real numbers = gerçek sayılar ($\mathbb{R}$)
Q Bir sinema bileti kuralı $y=8x$; burada $x$ alınan bilet sayısı. $x=-2$ ya da $x=2{,}5$ yazmak anlamlı mı? Hangi $x$ değerleri kullanılabilir?
QE A cinema ticket rule is $y=8x$, where $x$ is the number of tickets bought. Does $x=-2$ or $x=2.5$ make sense? Which $x$ values can be used?
G fgeo_g_domain

# f-graph-range | 2 | Görüntü kümesi | Range
L ~Bir fonksiyonun görüntü kümesi (range)
O :
R ~Fonksiyondan çıkabilen bütün $y$ ($f(x)$) değerleri
X ~Fonksiyona girebilen bütün $x$ değerleri ;; ~Grafiğin $y$ eksenini kestiği nokta ;; ~Sadece en büyük $y$ değeri
K Grafiğe dikey eksenden bak: grafik hangi yükseklikleri kaplıyor? IB yazımı: $f(x)\ge 0$ gibi.
KE Look at the graph against the vertical axis: which heights does it cover? IB writes it like $f(x)\ge 0$.
U Bir fonksiyondan hangi sonuçların çıkabileceğini söyler.
UE Tells you which output values a function can produce.
W $f(x)=x^2$’ye ne koyarsan koy sonuç negatif çıkmaz: $(-3)^2=9$, $0^2=0$. Bu yüzden görüntü kümesi $f(x)\ge 0$’dır.
WE Whatever you put into $f(x)=x^2$, the answer is never negative, so its range is $f(x)\ge 0$.
E $f(x)=x^2+1$: görüntü kümesi $f(x)\ge 1$. $g(x)=2x+1$, $0\le x\le 3$: görüntü kümesi $1\le g(x)\le 7$.
H Range = “menzil”: fonksiyon nereye kadar ulaşabiliyor ($y$)?
T range = görüntü kümesi ;; output = çıkış (çıktı) ;; minimum value = en küçük değer
Q Bir topun yüksekliği bir fonksiyonla veriliyor. Top hiçbir zaman $20$ m’den yükseğe çıkmıyor ve yerin altına inmiyor. Topun ulaşabildiği bütün yüksekliklere ne ad verilir?
QE A ball’s height is given by a function. It never goes above $20$ m and never below the ground. What do we call the set of all heights it can reach?
G fgeo_g_range
`;

/* ---------- yardımcılar ---------- */
const D = "°";
const dg = (v) => `${v}^\\circ`;
/** katsayılı terimlerden TeX: [[3,"x^2"],[-1,"x"],[5,""]] → 3x^2-x+5 */
function poly(terms) {
  let s = "";
  for (const [k, v] of terms) {
    if (k === 0) continue;
    const a = Math.abs(k);
    const body = v ? (a === 1 ? v : `${a}${v}`) : `${a}`;
    s += k < 0 ? `-${body}` : s ? `+${body}` : body;
  }
  return s || "0";
}
const lin = (m, c) => poly([[m, "x"], [c, ""]]);
/** (x-p) çarpanı; p = 0 ise x */
const fac = (p) => (p === 0 ? "x" : `(x${sgn(-p)})`);
/** sıfır olmayan tam sayı */
const nz = (r, a, b) => { let v; do { v = ri(r, a, b); } while (v === 0); return v; };
/** "$x^\circ$, $2x^\circ$ ve $3x^\circ$" */
const xdeg = (k) => `$${k === 1 ? "" : k}x^\\circ$`;
const joinTR = (a) => a.slice(0, -1).join(", ") + " ve " + a[a.length - 1];
/** İngilizce tekil/çoğul: 1 unit, 2 units */
const units = (n) => (Math.abs(n) === 1 ? "unit" : "units");
const joinEN = (a) => a.slice(0, -1).join(", ") + " and " + a[a.length - 1];

const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]];
/** Rastgele dik üçgen: o = θ’nın karşısı, j = komşusu, h = hipotenüs */
function rightTri(r) {
  const [a, b, c] = pick(r, TRIPLES);
  return r() < 0.5 ? { o: a, j: b, h: c } : { o: b, j: a, h: c };
}
const triTR = (t) => `Bir dik üçgende $\\theta$ açısının karşısındaki kenar $${t.o}$, yanındaki (komşu) kenar $${t.j}$, hipotenüs $${t.h}$.`;
const triEN = (t) => `In a right-angled triangle the side opposite $\\theta$ is $${t.o}$, the side adjacent to $\\theta$ is $${t.j}$ and the hypotenuse is $${t.h}$.`;

export const GEN = {
  /* ---------- f-geo ---------- */
  fgeo_rectarea: (r) => {
    const l = ri(r, 4, 12), w = ri(r, 2, l - 1);
    if (r() < 0.6) {
      return {
        q: `Uzunluğu $${l}$ cm, genişliği $${w}$ cm olan bir dikdörtgenin alanı kaç $\\text{cm}^2$’dir?`,
        qe: `A rectangle is $${l}$ cm long and $${w}$ cm wide. Find its area in $\\text{cm}^2$.`,
        ...int(l * w), unit: "cm²",
      };
    }
    return {
      q: `Bir dikdörtgenin alanı $${l * w}\\ \\text{cm}^2$ ve uzunluğu $${l}$ cm. Genişliği kaç cm’dir?`,
      qe: `A rectangle has an area of $${l * w}\\ \\text{cm}^2$ and a length of $${l}$ cm. Find its width in cm.`,
      ...int(w), unit: "cm",
    };
  },
  fgeo_rectperim: (r) => {
    const l = ri(r, 5, 15), w = ri(r, 2, l - 1), P = 2 * (l + w);
    if (r() < 0.6) {
      return {
        q: `Uzunluğu $${l}$ m, genişliği $${w}$ m olan bir dikdörtgenin çevresi kaç metredir?`,
        qe: `Find the perimeter of a rectangle that is $${l}$ m long and $${w}$ m wide.`,
        ...int(P), unit: "m",
      };
    }
    return {
      q: `Bir dikdörtgenin çevresi $${P}$ m ve uzunluğu $${l}$ m. Genişliği kaç metredir?`,
      qe: `A rectangle has a perimeter of $${P}$ m and a length of $${l}$ m. Find its width.`,
      ...int(w), unit: "m",
    };
  },
  fgeo_line: (r) => {
    const t = r();
    if (t < 0.45) {
      const a = ri(r, 25, 155);
      return {
        q: `Bir doğru üzerinde yan yana iki açı var. Biri $${dg(a)}$. Diğeri kaç derecedir?`,
        qe: `Two angles lie next to each other on a straight line. One is $${dg(a)}$. Find the other.`,
        ...int(180 - a), unit: D,
      };
    }
    if (t < 0.75) {
      const a = ri(r, 20, 80), b = ri(r, 20, 80);
      return {
        q: `Bir doğru üzerinde yan yana üç açı var: $${dg(a)}$, $${dg(b)}$ ve $x$. $x$ kaç derecedir?`,
        qe: `Three angles lie side by side on a straight line: $${dg(a)}$, $${dg(b)}$ and $x$. Find $x$.`,
        ...int(180 - a - b), unit: D,
      };
    }
    const k = pick(r, [2, 3, 4, 5]);
    return {
      q: `Bir doğru üzerinde yan yana iki açı var: ${xdeg(1)} ve ${xdeg(k)}. $x$ kaçtır?`,
      qe: `Two angles on a straight line are ${xdeg(1)} and ${xdeg(k)}. Find $x$.`,
      ...int(180 / (k + 1)),
    };
  },
  fgeo_point: (r) => {
    const t = r();
    if (t < 0.45) {
      const a = ri(r, 60, 140), b = ri(r, 50, 120), c = ri(r, 30, 340 - a - b);
      return {
        q: `Bir noktanın etrafındaki dört açıdan üçü $${dg(a)}$, $${dg(b)}$ ve $${dg(c)}$. Dördüncü açı kaç derecedir?`,
        qe: `Four angles meet at a point. Three of them are $${dg(a)}$, $${dg(b)}$ and $${dg(c)}$. Find the fourth.`,
        ...int(360 - a - b - c), unit: D,
      };
    }
    if (t < 0.7) {
      const n = pick(r, [3, 4, 5, 6, 8, 9, 10, 12]);
      return {
        q: `Bir noktanın etrafını, hiç boşluk bırakmadan $${n}$ tane eşit açı dolduruyor. Her biri kaç derecedir?`,
        qe: `$${n}$ equal angles fill the space around a point with no gaps. How big is each one?`,
        ...int(360 / n), unit: D,
      };
    }
    const cs = pick(r, [[1, 2, 3], [1, 2, 3, 4], [1, 1, 2], [2, 3, 4], [1, 3, 5], [1, 2, 6]]);
    const parts = cs.map(xdeg), s = cs.reduce((p, k) => p + k, 0);
    return {
      q: `Bir noktanın etrafındaki açılar ${joinTR(parts)}. $x$ kaçtır?`,
      qe: `The angles around a point are ${joinEN(parts)}. Find $x$.`,
      ...int(360 / s),
    };
  },
  fgeo_vert: (r) => {
    const t = r(), a = ri(r, 20, 160);
    if (t < 0.4) {
      return {
        q: `İki doğru kesişiyor. Oluşan açılardan biri $${dg(a)}$. Bu açının karşısındaki (ters) açı kaç derecedir?`,
        qe: `Two straight lines cross. One of the angles is $${dg(a)}$. Find the vertically opposite angle.`,
        ...int(a), unit: D,
      };
    }
    if (t < 0.7) {
      return {
        q: `İki doğru kesişiyor. Oluşan açılardan biri $${dg(a)}$. Bu açının hemen yanındaki açı kaç derecedir?`,
        qe: `Two straight lines cross. One of the angles is $${dg(a)}$. Find an angle next to it.`,
        ...int(180 - a), unit: D,
      };
    }
    const x = ri(r, 10, 40), k = pick(r, [2, 3]), b = ri(r, 1, 20);
    return {
      q: `İki doğru kesişiyor. Ters iki açı $(${k}x+${b})^\\circ$ ve $${dg(k * x + b)}$. $x$ kaçtır?`,
      qe: `Two straight lines cross. Two vertically opposite angles are $(${k}x+${b})^\\circ$ and $${dg(k * x + b)}$. Find $x$.`,
      ...int(x),
    };
  },
  fgeo_alt: (r) => {
    const t = r();
    if (t < 0.4) {
      const a = ri(r, 25, 155);
      return {
        q: `İki paralel doğru arasında bir Z şekli var. Z’nin bir köşesindeki açı $${dg(a)}$. Öbür köşesindeki açı kaç derecedir?`,
        qe: `There is a Z shape between two parallel lines. One corner angle of the Z is $${dg(a)}$. Find the angle in the other corner.`,
        ...int(a), unit: D,
      };
    }
    const x = ri(r, 10, 40);
    if (t < 0.7) {
      const k = pick(r, [2, 3, 4]);
      return {
        q: `Paralel doğrularda iki iç ters açı (Z açıları) ${xdeg(k)} ve $${dg(k * x)}$. $x$ kaçtır?`,
        qe: `Two alternate angles between parallel lines are ${xdeg(k)} and $${dg(k * x)}$. Find $x$.`,
        ...int(x),
      };
    }
    const b = ri(r, 5, 40);
    return {
      q: `Paralel doğrularda iki iç ters açı (Z açıları) $(x+${b})^\\circ$ ve $${dg(x + b)}$. $x$ kaçtır?`,
      qe: `Two alternate angles between parallel lines are $(x+${b})^\\circ$ and $${dg(x + b)}$. Find $x$.`,
      ...int(x),
    };
  },
  fgeo_corr: (r) => {
    const t = r(), a = ri(r, 25, 155);
    const tr = `Bir doğru (kesen) iki paralel doğruyu kesiyor. Kesen, alttaki paralelle sağ üstte $${dg(a)}$ yapıyor.`;
    const en = `A transversal crosses two parallel lines. It makes $${dg(a)}$ with the lower line at the top right.`;
    if (t < 0.4) {
      return {
        q: `${tr} Üstteki paralelle sağ üstte kaç derece yapar?`,
        qe: `${en} What angle does it make with the upper line at the top right?`,
        ...int(a), unit: D,
      };
    }
    if (t < 0.7) {
      return {
        q: `${tr} Üstteki paralelle sol üstte kaç derece yapar?`,
        qe: `${en} What angle does it make with the upper line at the top left?`,
        ...int(180 - a), unit: D,
      };
    }
    const x = ri(r, 10, 40), k = pick(r, [2, 3, 4]), b = ri(r, 0, 15);
    const e = b ? `${k}x+${b}` : `${k}x`;
    return {
      q: `Paralel doğrularda iki yöndeş açı (F açıları) $(${e})^\\circ$ ve $${dg(k * x + b)}$. $x$ kaçtır?`,
      qe: `Two corresponding angles on parallel lines are $(${e})^\\circ$ and $${dg(k * x + b)}$. Find $x$.`,
      ...int(x),
    };
  },
  fgeo_coint: (r) => {
    const t = r();
    if (t < 0.5) {
      const a = ri(r, 25, 155);
      return {
        q: `İki paralel doğru arasında, kesenin aynı tarafında iki açı (U açıları) var. Biri $${dg(a)}$. Diğeri kaç derecedir?`,
        qe: `Two co-interior angles lie between parallel lines on the same side of a transversal. One is $${dg(a)}$. Find the other.`,
        ...int(180 - a), unit: D,
      };
    }
    if (t < 0.75) {
      const k = pick(r, [2, 3, 4, 5]);
      return {
        q: `İki karşı durumlu açı (U açıları) ${xdeg(1)} ve ${xdeg(k)}. $x$ kaçtır?`,
        qe: `Two co-interior angles are ${xdeg(1)} and ${xdeg(k)}. Find $x$.`,
        ...int(180 / (k + 1)),
      };
    }
    const b = 2 * ri(r, 5, 40);
    return {
      q: `İki karşı durumlu açı (U açıları) $x^\\circ$ ve $(x+${b})^\\circ$. $x$ kaçtır?`,
      qe: `Two co-interior angles are $x^\\circ$ and $(x+${b})^\\circ$. Find $x$.`,
      ...int((180 - b) / 2),
    };
  },
  fgeo_tri: (r) => {
    const t = r();
    if (t < 0.5) {
      const a = ri(r, 30, 100), b = ri(r, 20, 150 - a);
      return {
        q: `Bir üçgenin iki açısı $${dg(a)}$ ve $${dg(b)}$. Üçüncü açı kaç derecedir?`,
        qe: `Two angles of a triangle are $${dg(a)}$ and $${dg(b)}$. Find the third angle.`,
        ...int(180 - a - b), unit: D,
      };
    }
    if (t < 0.75) {
      const a = ri(r, 15, 75);
      return {
        q: `Bir dik üçgenin dar açılarından biri $${dg(a)}$. Diğer dar açı kaç derecedir?`,
        qe: `One of the acute angles of a right-angled triangle is $${dg(a)}$. Find the other acute angle.`,
        ...int(90 - a), unit: D,
      };
    }
    const cs = pick(r, [[1, 2, 3], [1, 1, 2], [1, 2, 2], [1, 3, 5], [2, 3, 4], [1, 4, 4], [2, 3, 7]]);
    const parts = cs.map(xdeg), s = cs.reduce((p, k) => p + k, 0);
    return {
      q: `Bir üçgenin açıları ${joinTR(parts)}. $x$ kaçtır?`,
      qe: `The angles of a triangle are ${joinEN(parts)}. Find $x$.`,
      ...int(180 / s),
    };
  },
  fgeo_quad: (r) => {
    if (r() < 0.6) {
      const a = ri(r, 60, 130), b = ri(r, 60, 130), S = 360 - a - b;
      const c = ri(r, Math.max(40, S - 170), Math.min(160, S - 30));
      return {
        q: `Bir dörtgenin üç açısı $${dg(a)}$, $${dg(b)}$ ve $${dg(c)}$. Dördüncü açı kaç derecedir?`,
        qe: `Three angles of a quadrilateral are $${dg(a)}$, $${dg(b)}$ and $${dg(c)}$. Find the fourth angle.`,
        ...int(S - c), unit: D,
      };
    }
    const cs = pick(r, [[1, 2, 3, 4], [1, 1, 2, 2], [1, 2, 2, 3], [2, 3, 4, 6], [1, 1, 1, 3], [3, 4, 5, 6]]);
    const parts = cs.map(xdeg), s = cs.reduce((p, k) => p + k, 0);
    return {
      q: `Bir dörtgenin açıları ${joinTR(parts)}. $x$ kaçtır?`,
      qe: `The angles of a quadrilateral are ${joinEN(parts)}. Find $x$.`,
      ...int(360 / s),
    };
  },
  fgeo_iso: (r) => {
    const t = r();
    if (t < 0.45) {
      const a = 2 * ri(r, 10, 80);
      return {
        q: `İkizkenar bir üçgende tepe açısı $${dg(a)}$. Taban açılarından biri kaç derecedir?`,
        qe: `In an isosceles triangle the apex angle is $${dg(a)}$. Find one of the base angles.`,
        ...int((180 - a) / 2), unit: D,
      };
    }
    const b = ri(r, 20, 85);
    if (t < 0.85) {
      return {
        q: `İkizkenar bir üçgende taban açılarından biri $${dg(b)}$. Tepe açısı kaç derecedir?`,
        qe: `In an isosceles triangle one of the base angles is $${dg(b)}$. Find the apex angle.`,
        ...int(180 - 2 * b), unit: D,
      };
    }
    return {
      q: `$ABC$ üçgeninde $AB=AC$ ve $\\hat{B}=${dg(b)}$. $\\hat{C}$ kaç derecedir?`,
      qe: `In triangle $ABC$, $AB=AC$ and $\\hat{B}=${dg(b)}$. Find $\\hat{C}$.`,
      ...int(b), unit: D,
    };
  },
  fgeo_equi: (r) => {
    const t = ri(r, 0, 4);
    if (t === 0) {
      return {
        q: `Eşkenar bir üçgenin iki açısının toplamı kaç derecedir?`,
        qe: `Find the sum of two angles of an equilateral triangle.`,
        ...int(120), unit: D,
      };
    }
    if (t === 1) {
      return {
        q: `Eşkenar bir üçgenin bir kenarı dışarı doğru uzatılıyor. Oluşan dış açı (iç açının doğru üzerindeki komşusu) kaç derecedir?`,
        qe: `One side of an equilateral triangle is extended outwards. Find the exterior angle formed (next to an interior angle on the straight line).`,
        ...int(120), unit: D,
      };
    }
    if (t === 2) {
      return {
        q: `Köşeleri aynı noktada buluşan eşkenar üçgenler, o noktanın etrafını boşluksuz dolduruyor. Kaç tane üçgen vardır?`,
        qe: `Equilateral triangles meet at one point and fill the space around it with no gaps. How many triangles are there?`,
        ...int(6),
      };
    }
    if (t === 3) {
      const k = ri(r, 5, 50);
      return {
        q: `Eşkenar bir üçgenin bir açısı $(x+${k})^\\circ$. $x$ kaçtır?`,
        qe: `One angle of an equilateral triangle is $(x+${k})^\\circ$. Find $x$.`,
        ...int(60 - k),
      };
    }
    const k = pick(r, [2, 3, 4, 5, 6]);
    return {
      q: `Eşkenar bir üçgenin bir açısı ${xdeg(k)}. $x$ kaçtır?`,
      qe: `One angle of an equilateral triangle is ${xdeg(k)}. Find $x$.`,
      ...int(60 / k),
    };
  },
  fgeo_pyth: (r) => {
    let [a, b, c] = pick(r, TRIPLES);
    if (r() < 0.5) [a, b] = [b, a];
    if (r() < 0.55) {
      return {
        q: `Bir dik üçgenin dik kenarları $${a}$ cm ve $${b}$ cm. Hipotenüs kaç cm’dir?`,
        qe: `The two shorter sides of a right-angled triangle are $${a}$ cm and $${b}$ cm. Find the hypotenuse.`,
        ...int(c), unit: "cm",
      };
    }
    return {
      q: `Bir dik üçgenin hipotenüsü $${c}$ cm, dik kenarlarından biri $${a}$ cm. Diğer dik kenar kaç cm’dir?`,
      qe: `A right-angled triangle has a hypotenuse of $${c}$ cm and one shorter side of $${a}$ cm. Find the other shorter side.`,
      ...int(b), unit: "cm",
    };
  },
  fgeo_simlen: (r) => {
    const t = r();
    if (t < 0.45) {
      const k = pick(r, [2, 3, 4, 5]), l = ri(r, 2, 12);
      return {
        q: `Bir şekil, ölçek çarpanı $${k}$ olacak biçimde büyütülüyor. $${l}$ cm’lik bir kenar kaç cm olur?`,
        qe: `A shape is enlarged with scale factor $${k}$. How long does a $${l}$ cm side become?`,
        ...int(k * l), unit: "cm",
      };
    }
    if (t < 0.75) {
      const k = pick(r, [2, 3, 4]), l = ri(r, 2, 9);
      return {
        q: `İki benzer şeklin karşılık gelen kenarları $${l}$ cm ve $${k * l}$ cm. Küçükten büyüğe ölçek çarpanı kaçtır?`,
        qe: `Matching sides of two similar shapes are $${l}$ cm and $${k * l}$ cm. Find the scale factor from the smaller shape to the larger one.`,
        ...int(k),
      };
    }
    const l = 2 * ri(r, 2, 12);
    return {
      q: `Bir fotoğraf, ölçek çarpanı $\\tfrac12$ olacak biçimde küçültülüyor. Fotoğraftaki $${l}$ cm’lik bir uzunluk küçük kopyada kaç cm olur?`,
      qe: `A photo is reduced with scale factor $\\tfrac12$. How long does a $${l}$ cm length become in the small copy?`,
      ...int(l / 2), unit: "cm",
    };
  },
  fgeo_simarea: (r) => {
    const t = r();
    if (t < 0.5) {
      const k = pick(r, [2, 3, 4]), A = ri(r, 2, 12);
      return {
        q: `Bir şeklin bütün uzunlukları $${k}$ katına çıkarılıyor. Alanı $${A}\\ \\text{cm}^2$ idi. Yeni alan kaç $\\text{cm}^2$’dir?`,
        qe: `Every length of a shape is multiplied by $${k}$. Its area was $${A}\\ \\text{cm}^2$. Find the new area in $\\text{cm}^2$.`,
        ...int(k * k * A), unit: "cm²",
      };
    }
    if (t < 0.8) {
      const k = pick(r, [2, 3, 4, 5]);
      return {
        q: `İki benzer şekilden büyüğünün alanı, küçüğünkünün $${k * k}$ katı. Uzunluklar için ölçek çarpanı kaçtır?`,
        qe: `The area of the larger of two similar shapes is $${k * k}$ times the area of the smaller one. Find the scale factor for lengths.`,
        ...int(k),
      };
    }
    const A = 4 * ri(r, 2, 12);
    return {
      q: `Bir şeklin bütün uzunlukları yarıya indiriliyor. Alanı $${A}\\ \\text{cm}^2$ idi. Yeni alan kaç $\\text{cm}^2$’dir?`,
      qe: `Every length of a shape is halved. Its area was $${A}\\ \\text{cm}^2$. Find the new area in $\\text{cm}^2$.`,
      ...int(A / 4), unit: "cm²",
    };
  },
  fgeo_sin: (r) => {
    if (r() < 0.6) {
      const t = rightTri(r);
      return {
        q: `${triTR(t)} $\\sin\\theta$ kaçtır? (Kesir olarak yazabilirsin.)`,
        qe: `${triEN(t)} Find $\\sin\\theta$ (a fraction is fine).`,
        ...fr(t.o, t.h),
      };
    }
    const k = ri(r, 2, 12);
    return {
      q: `Bir dik üçgende hipotenüs $${2 * k}$ ve $\\theta=30^\\circ$. $\\sin 30^\\circ=0{,}5$ olduğuna göre $\\theta$’nın karşısındaki kenar kaçtır?`,
      qe: `In a right-angled triangle the hypotenuse is $${2 * k}$ and $\\theta=30^\\circ$. Given that $\\sin 30^\\circ=0.5$, find the side opposite $\\theta$.`,
      ...int(k),
    };
  },
  fgeo_cos: (r) => {
    if (r() < 0.6) {
      const t = rightTri(r);
      return {
        q: `${triTR(t)} $\\cos\\theta$ kaçtır? (Kesir olarak yazabilirsin.)`,
        qe: `${triEN(t)} Find $\\cos\\theta$ (a fraction is fine).`,
        ...fr(t.j, t.h),
      };
    }
    const k = ri(r, 2, 12);
    return {
      q: `Bir dik üçgende hipotenüs $${2 * k}$ ve $\\theta=60^\\circ$. $\\cos 60^\\circ=0{,}5$ olduğuna göre $\\theta$’nın yanındaki (komşu) kenar kaçtır?`,
      qe: `In a right-angled triangle the hypotenuse is $${2 * k}$ and $\\theta=60^\\circ$. Given that $\\cos 60^\\circ=0.5$, find the side adjacent to $\\theta$.`,
      ...int(k),
    };
  },
  fgeo_tan: (r) => {
    const u = r();
    if (u < 0.55) {
      const t = rightTri(r);
      return {
        q: `${triTR(t)} $\\tan\\theta$ kaçtır? (Kesir olarak yazabilirsin.)`,
        qe: `${triEN(t)} Find $\\tan\\theta$ (a fraction is fine).`,
        ...fr(t.o, t.j),
      };
    }
    const k = ri(r, 2, 15);
    if (u < 0.8) {
      return {
        q: `Bir ağaçtan $${k}$ m uzaktasın ve ağacın tepesine $45^\\circ$ ile bakıyorsun. $\\tan 45^\\circ=1$ olduğuna göre ağaç kaç metre boyundadır?`,
        qe: `You are $${k}$ m from a tree and the angle of elevation of its top is $45^\\circ$. Given that $\\tan 45^\\circ=1$, how tall is the tree in metres?`,
        ...int(k), unit: "m",
      };
    }
    const m = pick(r, [2, 3, 4]);
    return {
      q: `Bir dik üçgende $\\tan\\theta=${m}$ ve $\\theta$’nın yanındaki (komşu) kenar $${k}$. $\\theta$’nın karşısındaki kenar kaçtır?`,
      qe: `In a right-angled triangle $\\tan\\theta=${m}$ and the side adjacent to $\\theta$ is $${k}$. Find the side opposite $\\theta$.`,
      ...int(m * k),
    };
  },
  fgeo_inv: (r) => {
    if (r() < 0.6) {
      const f = pick(r, ["sin", "cos", "tan"]), t = rightTri(r);
      const [p, q] = f === "sin" ? [t.o, t.h] : f === "cos" ? [t.j, t.h] : [t.o, t.j];
      return {
        q: `${triTR(t)} $\\theta=\\${f}^{-1}(k)$ biçiminde yazılırsa $k$ kaçtır? (Kesir olarak yazabilirsin.)`,
        qe: `${triEN(t)} If $\\theta=\\${f}^{-1}(k)$, find $k$ (a fraction is fine).`,
        ...fr(p, q),
      };
    }
    const k = ri(r, 2, 12), f = pick(r, ["sin", "cos", "tan"]);
    const hintTR = `($\\sin 30^\\circ=0{,}5$, $\\cos 60^\\circ=0{,}5$, $\\tan 45^\\circ=1$)`;
    const hintEN = `($\\sin 30^\\circ=0.5$, $\\cos 60^\\circ=0.5$, $\\tan 45^\\circ=1$)`;
    const [tr, en, ang] = f === "sin"
      ? [`$\\theta$’nın karşısındaki kenar $${k}$, hipotenüs $${2 * k}$.`, `the side opposite $\\theta$ is $${k}$ and the hypotenuse is $${2 * k}$.`, 30]
      : f === "cos"
        ? [`$\\theta$’nın yanındaki (komşu) kenar $${k}$, hipotenüs $${2 * k}$.`, `the side adjacent to $\\theta$ is $${k}$ and the hypotenuse is $${2 * k}$.`, 60]
        : [`$\\theta$’nın karşısındaki kenar $${k}$, yanındaki (komşu) kenar da $${k}$.`, `the sides opposite and adjacent to $\\theta$ are both $${k}$.`, 45];
    return {
      q: `Bir dik üçgende ${tr} $\\theta$ kaç derecedir? ${hintTR}`,
      qe: `In a right-angled triangle ${en} Find $\\theta$ in degrees. ${hintEN}`,
      ...int(ang), unit: D,
    };
  },

  /* ---------- f-graph ---------- */
  fgeo_g_coord: (r) => {
    const x = nz(r, -7, 7), y = nz(r, -7, 7);
    const hx = `$${Math.abs(x)}$ birim ${x > 0 ? "sağa" : "sola"}`, hy = `$${Math.abs(y)}$ birim ${y > 0 ? "yukarı" : "aşağı"}`;
    const ex = `$${Math.abs(x)}$ ${units(x)} ${x > 0 ? "right" : "left"}`, ey = `$${Math.abs(y)}$ ${units(y)} ${y > 0 ? "up" : "down"}`;
    const yFirst = r() < 0.35, askX = r() < 0.5;
    const c = askX ? "x" : "y";
    return {
      q: `Orijinden ${yFirst ? `${hy}, sonra ${hx}` : `${hx}, sonra ${hy}`} giderek $P$ noktasına ulaşıyorsun. $P$’nin $${c}$ koordinatı kaçtır?`,
      qe: `Starting at the origin you move ${yFirst ? `${ey}, then ${ex}` : `${ex}, then ${ey}`} to reach point $P$. What is the $${c}$-coordinate of $P$?`,
      ...int(askX ? x : y),
    };
  },
  fgeo_g_eval: (r) => {
    const t = r();
    let f, x, v;
    if (t < 0.5) {
      const a = nz(r, -5, 5), b = ri(r, -9, 9);
      x = ri(r, -4, 6); f = lin(a, b); v = a * x + b;
    } else if (t < 0.8) {
      const b = ri(r, -9, 9);
      x = nz(r, -4, 4); f = poly([[1, "x^2"], [b, ""]]); v = x * x + b;
    } else {
      const a = nz(r, -3, 3), b = ri(r, -5, 5), c = ri(r, -6, 6);
      x = ri(r, -3, 3); f = poly([[a, "x^2"], [b, "x"], [c, ""]]); v = a * x * x + b * x + c;
    }
    return { q: `$f(x)=${f}$ ise $f(${x})$ kaçtır?`, qe: `Given $f(x)=${f}$, find $f(${x})$.`, ...int(v) };
  },
  fgeo_g_on: (r) => {
    const a = nz(r, -4, 5), b = ri(r, -8, 8), f = lin(a, b), p = ri(r, -4, 5), q = a * p + b;
    if (r() < 0.5) {
      return {
        q: `$(${p},\\ k)$ noktası $f(x)=${f}$ fonksiyonunun grafiği üzerindedir. $k$ kaçtır?`,
        qe: `The point $(${p},\\ k)$ lies on the graph of $f(x)=${f}$. Find $k$.`,
        ...int(q),
      };
    }
    return {
      q: `$(k,\\ ${q})$ noktası $f(x)=${f}$ fonksiyonunun grafiği üzerindedir. $k$ kaçtır?`,
      qe: `The point $(k,\\ ${q})$ lies on the graph of $f(x)=${f}$. Find $k$.`,
      ...int(p),
    };
  },
  fgeo_g_yint: (r) => {
    const t = ri(r, 0, 4);
    let f, v;
    if (t === 0) { const a = nz(r, -6, 6), b = nz(r, -9, 9); f = lin(a, b); v = b; }
    else if (t === 1) { const a = nz(r, -4, 4), b = ri(r, -7, 7), c = nz(r, -9, 9); f = poly([[a, "x^2"], [b, "x"], [c, ""]]); v = c; }
    else if (t === 2) { const p = nz(r, -6, 6); let q; do { q = nz(r, -6, 6); } while (q === p); f = `${fac(p)}${fac(q)}`; v = p * q; }
    else if (t === 3) { const a = ri(r, 1, 3), p = nz(r, -4, 4), q = ri(r, -9, 9); f = `${a === 1 ? "" : a}${fac(p)}^2${q ? sgn(q) : ""}`; v = a * p * p + q; }
    else { const c = nz(r, -8, 8); f = `2^x${sgn(c)}`; v = 1 + c; }
    return {
      q: `$f(x)=${f}$ grafiğinin $y$ eksenini kestiği noktanın $y$ değeri kaçtır?`,
      qe: `Find the $y$-coordinate of the $y$-intercept of the graph of $f(x)=${f}$.`,
      ...int(v),
    };
  },
  fgeo_g_xint: (r) => {
    const t = r();
    if (t < 0.45) {
      const a = pick(r, [2, 3, 4, 5, -2, -3]), x0 = ri(r, -6, 6), f = lin(a, -a * x0);
      return {
        q: `$f(x)=${f}$ grafiğinin $x$ eksenini kestiği noktanın $x$ değeri kaçtır?`,
        qe: `Find the $x$-intercept of the graph of $f(x)=${f}$.`,
        ...int(x0),
      };
    }
    if (t < 0.8) {
      const p = nz(r, -6, 6);
      let q; do { q = nz(r, -6, 6); } while (q === p);
      const big = r() < 0.5;
      return {
        q: `$f(x)=${fac(p)}${fac(q)}$ grafiği $x$ eksenini iki noktada keser. ${big ? "Büyük" : "Küçük"} olan $x$ değeri kaçtır?`,
        qe: `The graph of $f(x)=${fac(p)}${fac(q)}$ meets the $x$-axis at two points. Find the ${big ? "larger" : "smaller"} $x$-intercept.`,
        ...int(big ? Math.max(p, q) : Math.min(p, q)),
      };
    }
    const a = pick(r, [2, 3, 4]);
    let b; do { b = nz(r, -9, 9); } while (b % a === 0);
    return {
      q: `$f(x)=${lin(a, b)}$ grafiğinin $x$ eksenini kestiği noktanın $x$ değeri kaçtır? (Kesir olarak yazabilirsin.)`,
      qe: `Find the $x$-intercept of the graph of $f(x)=${lin(a, b)}$ (a fraction is fine).`,
      ...fr(-b, a),
    };
  },
  fgeo_g_grad: (r) => {
    const run = ri(r, 1, 6), rise = nz(r, -9, 9), up = rise > 0;
    return {
      q: `Bir doğru üzerinde sağa $${run}$ birim gidince $${Math.abs(rise)}$ birim ${up ? "yukarı çıkılıyor" : "aşağı iniliyor"}. Doğrunun eğimi kaçtır? (Kesir olarak yazabilirsin.)`,
      qe: `Along a line, moving $${run}$ ${units(run)} to the right takes you $${Math.abs(rise)}$ ${units(rise)} ${up ? "up" : "down"}. Find the gradient of the line (a fraction is fine).`,
      ...fr(rise, run),
    };
  },
  fgeo_g_sign: (r) => {
    const lines = [];
    let neg = 0;
    for (let i = 0; i < 4; i++) {
      const m = nz(r, -5, 5), c = ri(r, -6, 6);
      if (m < 0) neg++;
      lines.push(`$y=${r() < 0.5 ? lin(m, c) : poly([[c, ""], [m, "x"]])}$`);
    }
    const list = lines.join(", ");
    return {
      q: `Şu doğrulardan kaç tanesi soldan sağa giderken alçalır (iner)? ${list}`,
      qe: `How many of these lines go down from left to right? ${list}`,
      ...int(neg),
    };
  },
  fgeo_g_mxc: (r) => {
    const m = nz(r, -6, 6), c = nz(r, -9, 9);
    const f = r() < 0.6 ? lin(m, c) : poly([[c, ""], [m, "x"]]);
    if (r() < 0.55) {
      return { q: `$y=${f}$ doğrusunun eğimi kaçtır?`, qe: `Find the gradient of the line $y=${f}$.`, ...int(m) };
    }
    return {
      q: `$y=${f}$ doğrusu $y$ eksenini hangi noktada keser? Bu noktanın $y$ değeri kaçtır?`,
      qe: `The line $y=${f}$ crosses the $y$-axis at a point. What is the $y$-coordinate of that point?`,
      ...int(c),
    };
  },
  fgeo_g_horiz: (r) => {
    const a = ri(r, -8, 8), b = ri(r, -8, 8);
    if (r() < 0.8) {
      return {
        q: `$(${a},\\ ${b})$ noktasından geçen yatay doğrunun denklemi $y=k$ ise $k$ kaçtır?`,
        qe: `The horizontal line through $(${a},\\ ${b})$ has equation $y=k$. Find $k$.`,
        ...int(b),
      };
    }
    return { q: `$y=${b}$ doğrusunun eğimi kaçtır?`, qe: `Find the gradient of the line $y=${b}$.`, ...int(0) };
  },
  fgeo_g_vert: (r) => {
    const a = ri(r, -8, 8), b = ri(r, -8, 8);
    if (r() < 0.7) {
      return {
        q: `$(${a},\\ ${b})$ noktasından geçen dikey doğrunun denklemi $x=k$ ise $k$ kaçtır?`,
        qe: `The vertical line through $(${a},\\ ${b})$ has equation $x=k$. Find $k$.`,
        ...int(a),
      };
    }
    return {
      q: `$x=${a}$ ve $y=${b}$ doğruları bir noktada kesişir. Bu noktanın koordinatlarının toplamı kaçtır?`,
      qe: `The lines $x=${a}$ and $y=${b}$ meet at a point. Find the sum of the coordinates of this point.`,
      ...int(a + b),
    };
  },
  fgeo_g_inter: (r) => {
    const x0 = ri(r, -4, 5), m1 = ri(r, 1, 4);
    let m2; do { m2 = ri(r, -3, 3); } while (m2 === m1);
    const c1 = ri(r, -6, 6), c2 = (m1 - m2) * x0 + c1, y0 = m1 * x0 + c1;
    const f = lin(m1, c1), g = lin(m2, c2);
    const askX = r() < 0.6, c = askX ? "x" : "y";
    return {
      q: `$f(x)=${f}$ ve $g(x)=${g}$ grafiklerinin kesişim noktasının $${c}$ değeri kaçtır?`,
      qe: `Find the $${c}$-coordinate of the point of intersection of the graphs of $f(x)=${f}$ and $g(x)=${g}$.`,
      ...int(askX ? x0 : y0),
    };
  },
  fgeo_g_domain: (r) => {
    const t = r(), a = nz(r, -6, 9);
    if (t < 0.4) {
      const k = ri(r, 1, 9);
      return {
        q: `$f(x)=\\dfrac{${k}}{x${sgn(-a)}}$ fonksiyonunun tanım kümesinde olmayan tek $x$ değeri kaçtır?`,
        qe: `Which value of $x$ is not in the domain of $f(x)=\\dfrac{${k}}{x${sgn(-a)}}$?`,
        ...int(a),
      };
    }
    if (t < 0.7) {
      return {
        q: `$f(x)=\\sqrt{x${sgn(-a)}}$ fonksiyonunun tanım kümesindeki en küçük $x$ değeri kaçtır?`,
        qe: `Find the smallest value of $x$ in the domain of $f(x)=\\sqrt{x${sgn(-a)}}$.`,
        ...int(a),
      };
    }
    const k = pick(r, [2, 3, 4]);
    return {
      q: `$f(x)=\\dfrac{1}{${k}x${sgn(-k * a)}}$ fonksiyonunun tanım kümesinde olmayan tek $x$ değeri kaçtır?`,
      qe: `Which value of $x$ is not in the domain of $f(x)=\\dfrac{1}{${k}x${sgn(-k * a)}}$?`,
      ...int(a),
    };
  },
  fgeo_g_range: (r) => {
    const t = r();
    if (t < 0.3) {
      const c = ri(r, -9, 9), f = poly([[1, "x^2"], [c, ""]]);
      return {
        q: `$f(x)=${f}$, $x\\in\\mathbb{R}$. $f$’nin görüntü kümesindeki en küçük değer kaçtır?`,
        qe: `$f(x)=${f}$, $x\\in\\mathbb{R}$. Find the smallest value in the range of $f$.`,
        ...int(c),
      };
    }
    if (t < 0.55) {
      const p = nz(r, -5, 5), q = ri(r, -9, 9), f = `${fac(p)}^2${q ? sgn(q) : ""}`;
      return {
        q: `$f(x)=${f}$, $x\\in\\mathbb{R}$. $f$’nin görüntü kümesindeki en küçük değer kaçtır?`,
        qe: `$f(x)=${f}$, $x\\in\\mathbb{R}$. Find the smallest value in the range of $f$.`,
        ...int(q),
      };
    }
    if (t < 0.8) {
      const a = ri(r, 1, 4), b = ri(r, -5, 5), n = ri(r, 2, 6), f = lin(a, b);
      return {
        q: `$f(x)=${f}$ ve tanım kümesi $0\\le x\\le ${n}$. $f$’nin görüntü kümesindeki en büyük değer kaçtır?`,
        qe: `$f(x)=${f}$ with domain $0\\le x\\le ${n}$. Find the largest value in the range of $f$.`,
        ...int(a * n + b),
      };
    }
    const c = ri(r, -5, 9), f = poly([[c, ""], [-1, "x^2"]]);
    return {
      q: `$f(x)=${f}$, $x\\in\\mathbb{R}$. $f$’nin görüntü kümesindeki en büyük değer kaçtır?`,
      qe: `$f(x)=${f}$, $x\\in\\mathbb{R}$. Find the largest value in the range of $f$.`,
      ...int(c),
    };
  },
};
