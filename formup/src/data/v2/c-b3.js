/* FormUp v2 — parça "b3": Konu 3 · Geometri ve Trigonometri (b3) + Trigonometri: Kitapçık Dışı (x3).
   Kartlar öğretme sırasıyla (kolaydan zora). Biçim: content/SPEC.md */
import { ri, pick, fr, int } from "./genkit.js";

export const CARDS = String.raw`
## b3

# b3-para | 3 | Paralelkenarın alanı | Area of a parallelogram
L A
R bh
X \dfrac{1}{2}bh ;; 2(b+h) ;; b+h
K $b$: taban, $h$: yükseklik (tabana dik uzaklık, eğik kenar değil)
KE $b$: base, $h$: perpendicular height (not the slanted side)
U Paralelkenar biçimindeki bir yüzeyin alanını bulur.
UE Finds the area of a parallelogram-shaped surface.
W Paralelkenarın bir ucundaki üçgeni kesip öbür uca taşırsan dikdörtgen olur: taban çarpı yükseklik.
WE Cut a triangle off one end and move it to the other end: you get a rectangle, base times height.
E $b=8$, $h=5$ ise $A=40$.
H Taban × dik yükseklik; eğik kenara kanma.
T parallelogram = paralelkenar ;; base = taban ;; perpendicular height = dik yükseklik
Q Eğik duran bir park alanının tabanı $12$ m, iki paralel kenarı arasındaki dik uzaklık $5$ m. Kaç metrekare asfalt gerekir?
QE A slanted parking area has base $12$ m and the perpendicular distance between its parallel sides is $5$ m. How many square metres of asphalt are needed?
B [[b]][[h]] || \dfrac{1}{2} ;; 2
C b=8:1:20:1 ; h=5:1:20:1 => b*h
CT A=@b@\cdot @h@=@=@
G b3_para
BK 0.0

# b3-tri | 3 | Üçgenin alanı | Area of a triangle
L A
R \dfrac{1}{2}(bh)
X bh ;; \dfrac{1}{3}(bh) ;; \dfrac{1}{2}(b+h)
K $b$: taban, $h$: o tabana ait dik yükseklik
KE $b$: base, $h$: perpendicular height to that base
U Taban ve yüksekliği bilinen bir üçgenin alanını bulur.
UE Finds the area of a triangle from its base and height.
W Aynı üçgenden iki tane birleştirirsen bir paralelkenar olur. Üçgen onun yarısıdır.
WE Two copies of the triangle make a parallelogram, so the triangle is half of it.
E $b=10$, $h=6$ ise $A=30$.
H Paralelkenarın yarısı.
T triangle = üçgen ;; base = taban ;; height = yükseklik
Q Üçgen bir yelkenin alt kenarı $4$ m, tepesinin alt kenara dik uzaklığı $6$ m. Kaç metrekare kumaş gerekir?
QE A triangular sail has a bottom edge of $4$ m and its top is $6$ m (perpendicular) above that edge. How much fabric is needed?
B \dfrac{[[1]]}{[[2]]}(bh) || 3 ;; 4
C b=10:1:20:1 ; h=6:1:20:1 => b*h/2
CT A=\dfrac{1}{2}(@b@\cdot @h@)=@=@
G b3_tri
LAB area
BK 0.0

# b3-trap | 3 | Yamuğun alanı | Area of a trapezoid
L A
R \dfrac{1}{2}(a+b)h
X (a+b)h ;; \dfrac{1}{2}abh ;; \dfrac{1}{2}(a+h)b
K $a$ ve $b$: paralel kenarlar, $h$: aralarındaki dik uzaklık
KE $a$ and $b$: parallel sides, $h$: perpendicular height between them
U İki kenarı paralel olan dörtgenin (yamuk) alanını bulur.
UE Finds the area of a trapezoid (two parallel sides).
W Paralel kenarların ortalaması $\tfrac{a+b}{2}$, yamuğun “ortalama genişliği”dir; bunu yükseklikle çarparsın.
WE The mean of the parallel sides is the average width; multiply it by the height.
E $a=4$, $b=10$, $h=5$: $A=\tfrac{1}{2}\cdot 14\cdot 5=35$.
H Paralel kenarları topla, yarıya böl, yükseklikle çarp.
T trapezoid = yamuk ;; parallel sides = paralel kenarlar ;; height = yükseklik
Q Bir arsanın yola bakan kenarı $20$ m, arka kenarı $30$ m (paralel), aralarındaki uzaklık $15$ m. Arsanın alanı nedir?
QE A plot has a front edge of $20$ m and a parallel back edge of $30$ m, $15$ m apart. What is its area?
B \dfrac{1}{2}([[a+b]])[[h]] || a-b ;; ab ;; b
C a=4:1:20:1 ; b=10:1:20:1 ; h=5:1:20:1 => (a+b)*h/2
CT A=\dfrac{1}{2}(@a@+@b@)\cdot @h@=@=@
G b3_trap
BK 0.0

# b3-circ-area | 3 | Dairenin alanı | Area of a circle
L A
R \pi r^2
X 2\pi r ;; \pi d^2 ;; (\pi r)^2
K $r$: yarıçap (çapın yarısı)
KE $r$: radius (half the diameter)
U Dairesel bir yüzeyin alanını bulur.
UE Finds the area of a circular region.
W Daireyi ince dilimlere kesip yan yana dizersen yaklaşık bir dikdörtgen olur: genişliği $\pi r$, yüksekliği $r$.
WE Slice the circle into thin sectors and line them up: you get roughly a rectangle $\pi r$ wide and $r$ tall.
E $r=3$ ise $A=9\pi\approx 28{,}3$.
H Alan “kare”li: $r^2$. Çevre kare yok.
T area = alan ;; radius = yarıçap ;; diameter = çap
Q Yarıçapı $15$ cm olan yuvarlak bir pizzanın üst yüzeyi kaç santimetrekaredir?
QE What is the area of the top of a round pizza with radius $15$ cm?
B \pi [[r^2]] || 2r ;; d^2
C r=3:0.5:20:0.5 => PI*r^2
CT A=\pi\cdot @r@^2\approx @=@
G b3_circ
LAB circle
BK 0.0

# b3-circum | 3 | Çemberin çevresi | Circumference of a circle
L C
R 2\pi r
X \pi r^2 ;; \pi r ;; 2\pi r^2
K $r$: yarıçap. $2r=d$ olduğundan $C=\pi d$ de yazılır.
KE $r$: radius. Since $2r=d$, also $C=\pi d$.
U Bir çemberin etrafının uzunluğunu bulur.
UE Finds the distance around a circle.
W $\pi$, çevrenin çapa oranıdır: her çemberde çevre, çapın yaklaşık $3{,}14$ katıdır.
WE $\pi$ is circumference divided by diameter, so the circumference is $\pi$ times the diameter.
E $r=5$ ise $C=10\pi\approx 31{,}4$.
H Çevre bir uzunluk: kare yok.
T circumference = çevre ;; radius = yarıçap ;; diameter = çap
Q Yarıçapı $30$ cm olan bir bisiklet tekerleği bir tam tur döndüğünde bisiklet kaç cm ilerler?
QE A bicycle wheel has radius $30$ cm. How far does the bicycle move in one full turn of the wheel?
B [[2]]\pi [[r]] || r^2 ;; 4
C r=5:0.5:20:0.5 => 2*PI*r
CT C=2\pi\cdot @r@\approx @=@
G b3_circum
LAB circle
BK 0.0

# b3-cuboid | 3 | Dikdörtgenler prizmasının hacmi | Volume of a cuboid
L V
R lwh
X 2(lw+lh+wh) ;; l+w+h ;; \dfrac{1}{3}lwh
K $l$: uzunluk, $w$: genişlik, $h$: yükseklik
KE $l$: length, $w$: width, $h$: height
U Kutu biçimindeki bir cismin hacmini bulur.
UE Finds the volume of a box shape.
W Tabana $l\cdot w$ tane birim küp sığar; bunlardan $h$ kat üst üste koyarsın.
WE The base holds $lw$ unit cubes, and you stack $h$ layers of them.
E $4\times 3\times 2$ kutu: $V=24$.
H Üç kenarı çarp.
T cuboid = dikdörtgenler prizması ;; volume = hacim ;; length, width, height = uzunluk, genişlik, yükseklik
Q Bir akvaryum $60$ cm uzunluğunda, $30$ cm genişliğinde ve $40$ cm yüksekliğinde. Kaç cm³ su alır?
QE An aquarium is $60$ cm long, $30$ cm wide and $40$ cm high. How many cm³ of water does it hold?
B [[l]][[w]][[h]] || 2 ;; \dfrac{1}{3}
C l=4:1:20:1 ; w=3:1:20:1 ; h=2:1:20:1 => l*w*h
CT V=@l@\cdot @w@\cdot @h@=@=@
G b3_cuboid
BK 0.0

# b3-cyl-vol | 3 | Silindirin hacmi | Volume of a cylinder
L V
R \pi r^2h
X 2\pi rh ;; \dfrac{1}{3}\pi r^2h ;; \pi rh^2
K $r$: taban yarıçapı, $h$: yükseklik
KE $r$: radius of the base, $h$: height
U Silindir (konserve kutusu) biçimindeki bir cismin hacmini bulur.
UE Finds the volume of a cylinder (like a can).
W Taban alanı $\pi r^2$; bu daireyi $h$ yüksekliğe kadar üst üste koyarsın.
WE The base area is $\pi r^2$ and you stack it up to height $h$.
E $r=2$, $h=5$: $V=20\pi$.
H Taban alanı × yükseklik.
T cylinder = silindir ;; volume = hacim ;; radius = yarıçap
Q Taban yarıçapı $4$ cm, boyu $10$ cm olan bir konserve kutusu kaç cm³ çorba alır?
QE A can has base radius $4$ cm and height $10$ cm. How many cm³ of soup does it hold?
B \pi [[r^2]][[h]] || 2r ;; h^2
C r=2:0.5:10:0.5 ; h=5:1:20:1 => PI*r^2*h
CT V=\pi\cdot @r@^2\cdot @h@\approx @=@
G b3_cyl
BK 0.0

# b3-prism | 2 | Prizmanın hacmi | Volume of a prism
L V
R Ah
X \dfrac{1}{3}Ah ;; \dfrac{1}{2}Ah ;; A+h
K $A$: kesit (taban) alanı, $h$: yükseklik (uzunluk)
KE $A$: area of cross-section, $h$: height (length)
U Kesiti hep aynı olan her cismin hacmini bulur.
UE Finds the volume of any solid with a constant cross-section.
W Kesit alanını, cismin uzunluğu boyunca “uzatırsın”: alan × uzunluk.
WE You stretch the cross-section along the length: area times length.
E Kesiti $6$ cm² üçgen, uzunluğu $10$ cm: $V=60$ cm³.
H Kesit × boy. Silindir ve küboid de birer prizmadır.
T prism = prizma ;; cross-section = kesit ;; volume = hacim
Q Üçgen kesitli bir çikolata kutusunun kesit alanı $12$ cm², uzunluğu $20$ cm. Kutunun hacmi nedir?
QE A chocolate box has a triangular cross-section of area $12$ cm² and length $20$ cm. What is its volume?
B [[A]][[h]] || \dfrac{1}{3} ;; 2
C A=6:1:50:1 ; h=10:1:30:1 => A*h
CT V=@A@\cdot @h@=@=@
G b3_prism
BK 0.0

# b3-cyl-cs | 2 | Silindirin yanal yüzey alanı | Area of the curved surface of a cylinder
L A
R 2\pi rh
X \pi r^2h ;; \pi rh ;; 2\pi r^2h
K $r$: yarıçap, $h$: yükseklik. Üst ve alt daireler dahil değil.
KE $r$: radius, $h$: height. The top and bottom circles are not included.
U Silindirin yan yüzeyinin (etiketin) alanını bulur.
UE Finds the area of the curved side of a cylinder (the label).
W Etiketi açarsan dikdörtgen olur: eni çevre $2\pi r$, boyu $h$.
WE Unroll the label: it is a rectangle $2\pi r$ wide and $h$ tall.
E $r=3$, $h=10$: $A=60\pi$.
H Çevre × yükseklik.
T curved surface area = yanal yüzey alanı ;; cylinder = silindir ;; height = yükseklik
Q Yarıçapı $4$ cm, boyu $11$ cm olan bir kutunun etrafına (üst ve alt hariç) kâğıt etiket sarılacak. Kaç cm² kâğıt gerekir?
QE A paper label wraps around a can (not the top or bottom) of radius $4$ cm and height $11$ cm. How much paper is needed?
B [[2\pi r]][[h]] || \pi r^2 ;; h^2
C r=3:0.5:10:0.5 ; h=10:1:30:1 => 2*PI*r*h
CT A=2\pi\cdot @r@\cdot @h@\approx @=@
G b3_cylcs
BK 0.0

# b3-dist2 | 3 | İki nokta arası uzaklık (düzlem) | Distance between two points (2D)
L d
R \sqrt{(x_1-x_2)^2+(y_1-y_2)^2}
X (x_1-x_2)^2+(y_1-y_2)^2 ;; (x_1-x_2)+(y_1-y_2) ;; \sqrt{(x_1+x_2)^2+(y_1+y_2)^2}
K $(x_1,\ y_1)$ ve $(x_2,\ y_2)$: iki nokta
KE $(x_1,\ y_1)$ and $(x_2,\ y_2)$: the two points
U Koordinatları bilinen iki nokta arasındaki düz uzaklığı bulur.
UE Finds the straight-line distance between two points.
W Yatay fark ve dikey fark bir dik üçgenin dik kenarlarıdır; uzaklık hipotenüstür (Pisagor).
WE The horizontal and vertical differences are the legs of a right-angled triangle; the distance is the hypotenuse (Pythagoras).
E $(1,\ 2)$ ve $(4,\ 6)$: $d=\sqrt{9+16}=5$.
H Farkların karesi, topla, kök al.
T distance = uzaklık ;; coordinates = koordinatlar ;; Pythagoras’ theorem = Pisagor teoremi
Q Bir haritada okul $(1,\ 2)$, ev $(7,\ 10)$ noktasında (birim: km). Kuş uçuşu aradaki uzaklık nedir?
QE On a map the school is at $(1,\ 2)$ and home is at $(7,\ 10)$ (units: km). What is the straight-line distance?
B \sqrt{([[x_1-x_2]])^2+([[y_1-y_2]])^2} || x_1+x_2 ;; x_1-y_1
C x1=1:-10:10:1 ; y1=2:-10:10:1 ; x2=4:-10:10:1 ; y2=6:-10:10:1 => sqrt((x1-x2)^2+(y1-y2)^2)
CT d=\sqrt{(@x1@-@x2@)^2+(@y1@-@y2@)^2}\approx @=@
G b3_dist2
LAB pythagoras
BK 0.0

# b3-mid2 | 3 | Orta nokta (düzlem) | Coordinates of the midpoint (2D)
L M
R \left(\dfrac{x_1+x_2}{2},\ \dfrac{y_1+y_2}{2}\right)
X \left(\dfrac{x_1-x_2}{2},\ \dfrac{y_1-y_2}{2}\right) ;; \left(x_1+x_2,\ y_1+y_2\right) ;; \left(\dfrac{x_1+y_1}{2},\ \dfrac{x_2+y_2}{2}\right)
K $M$: iki noktayı birleştiren doğru parçasının orta noktası
KE $M$: midpoint of the line segment joining the two points
U İki noktanın tam ortasındaki noktayı bulur.
UE Finds the point exactly halfway between two points.
W Orta nokta, $x$’lerin ortalaması ve $y$’lerin ortalamasıdır.
WE The midpoint is the mean of the $x$-coordinates and the mean of the $y$-coordinates.
E $(2,\ 4)$ ve $(8,\ 10)$: $M=(5,\ 7)$.
H Ortalama al: topla, ikiye böl.
T midpoint = orta nokta ;; line segment = doğru parçası ;; coordinates = koordinatlar
Q İki arkadaş $(2,\ 3)$ ve $(10,\ 7)$ noktalarında oturuyor. Tam ortada buluşmak istiyorlar. Buluşma noktası neresi?
QE Two friends live at $(2,\ 3)$ and $(10,\ 7)$. They want to meet exactly halfway. Where do they meet?
B \left(\dfrac{x_1+x_2}{[[2]]},\ \dfrac{[[y_1+y_2]]}{2}\right) || 3 ;; y_1-y_2
C x1=2:-10:10:1 ; x2=8:-10:10:1 => (x1+x2)/2
CT x_M=\dfrac{@x1@+@x2@}{2}=@=@
G b3_mid2
BK 0.0

# b3-dist3 | 3 | İki nokta arası uzaklık (uzay) | Distance between two points (3D)
L d
R \sqrt{(x_1-x_2)^2+(y_1-y_2)^2+(z_1-z_2)^2}
X (x_1-x_2)^2+(y_1-y_2)^2+(z_1-z_2)^2 ;; \sqrt{(x_1-x_2)^2+(y_1-y_2)^2} ;; \sqrt[3]{(x_1-x_2)^2+(y_1-y_2)^2+(z_1-z_2)^2}
K $(x_1,\ y_1,\ z_1)$ ve $(x_2,\ y_2,\ z_2)$: uzayda iki nokta
KE $(x_1,\ y_1,\ z_1)$ and $(x_2,\ y_2,\ z_2)$: two points in space
U Uzaydaki (3 boyutlu) iki nokta arasındaki uzaklığı bulur.
UE Finds the distance between two points in three dimensions.
W Düzlemdeki formülün aynısı; sadece $z$ farkının karesi de eklenir. Kök yine kare köktür.
WE Same as the 2D formula with the $z$ difference added; it is still a square root.
E $(0,\ 0,\ 0)$ ve $(2,\ 3,\ 6)$: $d=\sqrt{4+9+36}=7$.
H 3 boyut = 3 kare, ama kök yine karekök.
T three dimensions = üç boyut ;; distance = uzaklık ;; coordinates = koordinatlar
Q Bir odada bir köşe $(0,\ 0,\ 0)$, tavandaki lamba $(2,\ 3,\ 6)$ (metre). Köşeden lambaya gerilecek ipin uzunluğu nedir?
QE In a room one corner is $(0,\ 0,\ 0)$ and a ceiling lamp is at $(2,\ 3,\ 6)$ (metres). How long is a string from the corner to the lamp?
B \sqrt{(x_1-x_2)^2+(y_1-y_2)^2+([[z_1-z_2]])^2} || z_1+z_2 ;; z_1z_2
C x=2:-10:10:1 ; y=3:-10:10:1 ; z=6:-10:10:1 => sqrt(x^2+y^2+z^2)
CT d=\sqrt{@x@^2+@y@^2+@z@^2}\approx @=@
G b3_dist3
BK 3.1

# b3-mid3 | 2 | Orta nokta (uzay) | Coordinates of the midpoint (3D)
L M
R \left(\dfrac{x_1+x_2}{2},\ \dfrac{y_1+y_2}{2},\ \dfrac{z_1+z_2}{2}\right)
X \left(\dfrac{x_1-x_2}{2},\ \dfrac{y_1-y_2}{2},\ \dfrac{z_1-z_2}{2}\right) ;; \left(\dfrac{x_1+x_2}{3},\ \dfrac{y_1+y_2}{3},\ \dfrac{z_1+z_2}{3}\right) ;; \left(x_1+x_2,\ y_1+y_2,\ z_1+z_2\right)
K Uzayda iki noktanın orta noktası
KE Midpoint of two points in space
U Uzaydaki iki noktanın tam ortasını bulur.
UE Finds the point halfway between two points in 3D.
W Her koordinatın ayrı ayrı ortalaması alınır; 3 boyut olsa da ikiye bölünür (iki nokta var).
WE Average each coordinate separately; divide by 2 because there are two points.
E $(2,\ 0,\ 4)$ ve $(6,\ 2,\ 8)$: $M=(4,\ 1,\ 6)$.
H Nokta sayısı 2, o yüzden hep 2’ye böl.
T midpoint = orta nokta ;; three dimensions = üç boyut
Q Bir drone $(2,\ 0,\ 4)$’ten $(6,\ 2,\ 8)$’e düz uçuyor. Yolun yarısında hangi noktada olur?
QE A drone flies straight from $(2,\ 0,\ 4)$ to $(6,\ 2,\ 8)$. Where is it halfway?
B \left(\dfrac{x_1+x_2}{2},\ \dfrac{y_1+y_2}{2},\ \dfrac{[[z_1+z_2]]}{[[2]]}\right) || z_1-z_2 ;; 3
C z1=4:-10:10:1 ; z2=8:-10:10:1 => (z1+z2)/2
CT z_M=\dfrac{@z1@+@z2@}{2}=@=@
G b3_mid3
BK 3.1

# b3-pyramid | 2 | Dik piramidin hacmi | Volume of a right-pyramid
L V
R \dfrac{1}{3}Ah
X Ah ;; \dfrac{1}{2}Ah ;; \dfrac{1}{3}A+h
K $A$: taban alanı, $h$: dik yükseklik (tepeden tabana)
KE $A$: area of the base, $h$: perpendicular height
U Piramidin içine ne kadar şey sığdığını bulur.
UE Finds the volume of a pyramid.
W Aynı taban ve yükseklikteki prizmanın tam üçte biri kadar yer kaplar (sivrildiği için).
WE A pyramid fills exactly one third of the prism with the same base and height.
E Taban $9$ cm², $h=10$: $V=30$ cm³.
H Sivri cisim = prizmanın $\tfrac13$’ü.
T right pyramid = dik piramit ;; base area = taban alanı ;; volume = hacim
Q Kare tabanlı cam bir süs eşyasının taban alanı $36$ cm², tepe noktası tabandan $5$ cm yüksekte. Hacmi nedir?
QE A glass ornament with a square base of area $36$ cm² has its top $5$ cm above the base. What is its volume?
B \dfrac{1}{[[3]]}[[A]]h || 2 ;; r
C A=9:1:100:1 ; h=10:1:30:1 => A*h/3
CT V=\dfrac{1}{3}\cdot @A@\cdot @h@=@=@
G b3_pyr
BK 3.1

# b3-cone-vol | 2 | Dik koninin hacmi | Volume of a right cone
L V
R \dfrac{1}{3}\pi r^2h
X \pi r^2h ;; \pi rl ;; \dfrac{1}{3}\pi rh
K $r$: taban yarıçapı, $h$: dik yükseklik (eğik yükseklik $l$ değil)
KE $r$: base radius, $h$: perpendicular height (not the slant height $l$)
U Dondurma külahı gibi koni biçimli bir cismin hacmini bulur.
UE Finds the volume of a cone, like an ice-cream cone.
W Koni, tabanı daire olan bir piramittir: silindirin $\tfrac13$’ü.
WE A cone is a pyramid with a circular base: one third of the cylinder.
E $r=3$, $h=4$: $V=12\pi$.
H Silindir bölü 3.
T cone = koni ;; perpendicular height = dik yükseklik ;; volume = hacim
Q Bir dondurma külahının ağız yarıçapı $3$ cm, derinliği $10$ cm. İçine kaç cm³ dondurma sığar?
QE An ice-cream cone has opening radius $3$ cm and depth $10$ cm. How many cm³ of ice cream fit inside?
B \dfrac{1}{3}\pi [[r^2]][[h]] || 2r ;; l
C r=3:0.5:10:0.5 ; h=4:1:20:1 => PI*r^2*h/3
CT V=\dfrac{1}{3}\pi\cdot @r@^2\cdot @h@\approx @=@
G b3_cone
BK 3.1

# b3-cone-cs | 2 | Koninin yanal yüzey alanı | Area of the curved surface of a cone
L A
R \pi rl
X \pi rh ;; 2\pi rl ;; \pi r^2l
K $r$: taban yarıçapı, $l$: eğik yükseklik (tepeden taban çemberine). Taban dairesi dahil değil.
KE $r$: base radius, $l$: slant height. The base circle is not included.
U Koninin yan yüzeyinin (külahın kâğıdının) alanını bulur.
UE Finds the curved surface area of a cone.
W Burada dik yükseklik değil, eğik yükseklik $l$ kullanılır; çünkü yüzey eğik kenar boyunca uzanır.
WE The slant height $l$ is used, because the surface runs along the slant.
E $r=3$, $l=5$: $A=15\pi$.
H Eğik yüzey → eğik yükseklik $l$.
T slant height = eğik yükseklik ;; curved surface area = yanal yüzey alanı ;; cone = koni
Q Doğum günü şapkası koni biçiminde: taban yarıçapı $8$ cm, tepeden kenara eğik uzunluk $20$ cm. Kaç cm² karton gerekir?
QE A party hat is a cone with base radius $8$ cm and slant height $20$ cm. How much card is needed?
B \pi [[r]][[l]] || h ;; r^2
C r=3:0.5:10:0.5 ; l=5:1:30:1 => PI*r*l
CT A=\pi\cdot @r@\cdot @l@\approx @=@
G b3_conecs
BK 3.1

# b3-sph-vol | 2 | Kürenin hacmi | Volume of a sphere
L V
R \dfrac{4}{3}\pi r^3
X 4\pi r^2 ;; \dfrac{4}{3}\pi r^2 ;; \dfrac{1}{3}\pi r^3
K $r$: kürenin yarıçapı
KE $r$: radius of the sphere
U Top biçimli bir cismin hacmini bulur.
UE Finds the volume of a ball-shaped solid.
W Hacim üç boyutludur, o yüzden $r^3$. Önündeki sayı $\tfrac43\pi$.
WE Volume is 3D, so it has $r^3$, with $\tfrac43\pi$ in front.
E $r=3$: $V=\tfrac43\pi\cdot 27=36\pi$.
H Hacim → küp ($r^3$), alan → kare ($r^2$).
T sphere = küre ;; volume = hacim ;; radius = yarıçap
Q Yarıçapı $6$ cm olan bir basketbol topunun içinde kaç cm³ hava vardır?
QE How many cm³ of air are inside a ball of radius $6$ cm?
B \dfrac{[[4]]}{3}\pi [[r^3]] || r^2 ;; 2
C r=3:0.5:20:0.5 => 4/3*PI*r^3
CT V=\dfrac{4}{3}\pi\cdot @r@^3\approx @=@
G b3_sph
BK 3.1

# b3-sph-sa | 2 | Kürenin yüzey alanı | Surface area of a sphere
L A
R 4\pi r^2
X \dfrac{4}{3}\pi r^3 ;; \pi r^2 ;; 2\pi r^2
K $r$: kürenin yarıçapı
KE $r$: radius of the sphere
U Bir topun dış yüzeyinin alanını bulur.
UE Finds the surface area of a sphere.
W Kürenin yüzeyi, aynı yarıçaplı dairenin tam $4$ katıdır.
WE The surface of a sphere is exactly $4$ circles of the same radius.
E $r=5$: $A=100\pi$.
H 4 daire kaplar bir topu.
T surface area = yüzey alanı ;; sphere = küre
Q Yarıçapı $10$ cm olan bir küre boyanacak. Kaç cm² yüzey boyanır?
QE A sphere of radius $10$ cm is to be painted. What area is painted?
B [[4]]\pi [[r^2]] || r^3 ;; 2
C r=5:0.5:20:0.5 => 4*PI*r^2
CT A=4\pi\cdot @r@^2\approx @=@
G b3_sphs
BK 3.1

# b3-sine-rule | 3 | Sinüs teoremi | Sine rule
L \dfrac{a}{\sin A}
R \dfrac{b}{\sin B}=\dfrac{c}{\sin C}
X \dfrac{\sin b}{B}=\dfrac{\sin c}{C} ;; \dfrac{b}{\cos B}=\dfrac{c}{\cos C} ;; \dfrac{a}{\sin B}=\dfrac{b}{\sin C}
K $a$, $b$, $c$: kenarlar; $A$, $B$, $C$: karşılarındaki açılar
KE $a$, $b$, $c$: sides; $A$, $B$, $C$: the opposite angles
U Bir kenar–açı çifti ve bir açı ya da kenar daha biliniyorsa eksik kenarı/açıyı bulur (dik üçgen şart değil).
UE Finds a missing side or angle when you know one side–angle pair and one more (any triangle).
W Büyük açının karşısında büyük kenar olur; kenar ile karşı açının sinüsü orantılıdır.
WE Bigger angles face bigger sides: each side is proportional to the sine of its opposite angle.
E $a=5$, $A=30^\circ$, $B=90^\circ$: $b=\dfrac{5\cdot 1}{1/2}=10$.
H Her kenar kendi karşı açısıyla eşleşir.
T sine rule = sinüs teoremi ;; opposite angle = karşı açı ;; side = kenar
Q Bir üçgende iki açı $40^\circ$ ve $75^\circ$, $40^\circ$’nin karşısındaki kenar $8$ cm. $75^\circ$’nin karşısındaki kenar kaç cm?
QE In a triangle two angles are $40^\circ$ and $75^\circ$, and the side opposite $40^\circ$ is $8$ cm. Find the side opposite $75^\circ$.
B \dfrac{b}{[[\sin B]]}=\dfrac{[[c]]}{\sin C} || \cos B ;; \sin A ;; C
C a=8:1:20:1 ; A=40:10:80:1 ; B=75:10:120:1 => a*sin(deg(B))/sin(deg(A))
CT b=\dfrac{@a@\sin @B@^\circ}{\sin @A@^\circ}\approx @=@
G b3_sine
LAB trigtriangle
BK 3.2

# b3-cos-rule | 3 | Kosinüs teoremi (kenar bulma) | Cosine rule (finding a side)
L c^2
R a^2+b^2-2ab\cos C
X a^2+b^2+2ab\cos C ;; a^2+b^2-ab\cos C ;; a^2+b^2-2ab\sin C
K $C$: $a$ ile $b$ kenarlarının arasındaki açı; $c$: $C$’nin karşısındaki kenar
KE $C$ is the angle between sides $a$ and $b$; $c$ is the side opposite $C$
U İki kenar ve aradaki açı biliniyorsa üçüncü kenarı bulur.
UE Finds the third side from two sides and the included angle.
W Pisagor’un genel hâli: $C=90^\circ$ iken $\cos C=0$ ve $c^2=a^2+b^2$ kalır.
WE It is Pythagoras with a correction term; when $C=90^\circ$, $\cos C=0$ and you get $c^2=a^2+b^2$.
E $a=3$, $b=5$, $C=60^\circ$: $c^2=9+25-15=19$.
H Pisagor eksi $2ab\cos C$.
T cosine rule = kosinüs teoremi ;; included angle = aradaki açı ;; opposite side = karşı kenar
Q İki yol bir kavşaktan $70^\circ$ açıyla ayrılıyor. Biri $5$ km, diğeri $8$ km gidiyor. İki uç noktası arası kuş uçuşu kaç km?
QE Two roads leave a junction at $70^\circ$. One goes $5$ km, the other $8$ km. How far apart are their ends?
B a^2+b^2-[[2ab]]\cos [[C]] || ab ;; c ;; A
C a=3:1:20:1 ; b=5:1:20:1 ; C=60:1:179:1 => sqrt(a^2+b^2-2*a*b*cos(deg(C)))
CT c=\sqrt{@a@^2+@b@^2-2\cdot @a@\cdot @b@\cos @C@^\circ}\approx @=@
G b3_cos
LAB trigtriangle
BK 3.2

# b3-cos-rule-angle | 3 | Kosinüs teoremi (açı bulma) | Cosine rule (finding an angle)
L \cos C
R \dfrac{a^2+b^2-c^2}{2ab}
X \dfrac{a^2+b^2+c^2}{2ab} ;; \dfrac{c^2-a^2-b^2}{2ab} ;; \dfrac{a^2+b^2-c^2}{ab}
K $c$: bulmak istediğin $C$ açısının karşısındaki kenar
KE $c$ is the side opposite the angle $C$ you want
U Üç kenarı bilinen üçgende bir açıyı bulur.
UE Finds an angle of a triangle when all three sides are known.
W Önceki formülde $\cos C$’yi yalnız bırakırsın. Eksi işaretli kare, açının karşısındaki kenardır.
WE Rearrange the first form for $\cos C$; the side with the minus sign is the one opposite the angle.
E $a=3$, $b=5$, $c=7$: $\cos C=\dfrac{9+25-49}{30}=-\tfrac12$, $C=120^\circ$.
H Karşı kenar eksiye gider.
T cosine rule = kosinüs teoremi ;; three sides = üç kenar ;; obtuse angle = geniş açı
Q Üçgen bir bahçenin kenarları $3$ m, $5$ m ve $7$ m. En uzun kenarın karşısındaki açı kaç derece?
QE A triangular garden has sides $3$ m, $5$ m and $7$ m. What is the angle opposite the longest side?
B \dfrac{a^2+b^2-[[c^2]]}{[[2ab]]} || ab ;; a^2 ;; 2c
C a=3:1:20:1 ; b=5:1:20:1 ; c=7:1:20:1 => (a^2+b^2-c^2)/(2*a*b)
CT \cos C=\dfrac{@a@^2+@b@^2-@c@^2}{2\cdot @a@\cdot @b@}\approx @=@
G b3_cosC
LAB trigtriangle
BK 3.2

# b3-area-sin | 3 | Üçgenin alanı (sinüslü) | Area of a triangle (using sine)
L A
R \dfrac{1}{2}ab\sin C
X ab\sin C ;; \dfrac{1}{2}ab\cos C ;; \dfrac{1}{2}bc\sin C
K $C$: $a$ ile $b$ kenarlarının arasındaki açı
KE $C$ is the angle between sides $a$ and $b$
U Yükseklik bilinmediğinde, iki kenar ve aradaki açıdan alanı bulur.
UE Finds the area from two sides and the included angle, without the height.
W Yükseklik $h=b\sin C$’dir; bunu $\tfrac12 ah$ içine koyarsın.
WE The height is $b\sin C$; put it into $\tfrac12 \times$ base $\times$ height.
E $a=6$, $b=8$, $C=30^\circ$: $A=\tfrac12\cdot 48\cdot\tfrac12=12$.
H Açı, iki kenarın “arasında” olmalı.
T included angle = aradaki açı ;; area = alan ;; sine = sinüs
Q Üçgen bir tarlanın iki kenarı $40$ m ve $50$ m, aralarındaki açı $65^\circ$. Tarlanın alanı nedir?
QE A triangular field has two sides $40$ m and $50$ m with $65^\circ$ between them. What is its area?
B \dfrac{1}{2}[[ab]]\sin [[C]] || a+b ;; c
C a=6:1:50:1 ; b=8:1:50:1 ; C=30:1:179:1 => a*b*sin(deg(C))/2
CT A=\dfrac{1}{2}\cdot @a@\cdot @b@\sin @C@^\circ\approx @=@
G b3_area
LAB trigtriangle
BK 3.2

# b3-arc | 3 | Yay uzunluğu | Length of an arc
L l
R r\theta
X \dfrac{1}{2}r^2\theta ;; 2\pi r\theta ;; \dfrac{\theta}{r}
K $r$: yarıçap, $\theta$: merkez açı, **radyan** cinsinden
KE $r$: radius, $\theta$: angle at the centre in radians
U Çemberin bir parçasının (yayın) uzunluğunu bulur.
UE Finds the length of part of a circle (an arc).
W Radyanın tanımı budur: $1$ radyanlık açı, yarıçap uzunluğunda bir yay keser. $\theta$ radyan → $\theta$ tane yarıçap.
WE That is what a radian means: $1$ radian cuts an arc one radius long, so $\theta$ radians cut $r\theta$.
E $r=5$, $\theta=2$: $l=10$.
H Radyan + yarıçap = yay. Derece verildiyse önce radyana çevir!
T arc length = yay uzunluğu ;; radian = radyan ;; angle at the centre = merkez açı
Q Yarıçapı $40$ cm olan bir sarkaç, $0{,}5$ radyanlık açıyla salınıyor. Ucu kaç cm’lik eğri yol çizer?
QE A pendulum of length $40$ cm swings through $0.5$ radians. How far does its tip travel along the curve?
B [[r]][[\theta]] || r^2 ;; 2\pi
C r=5:1:30:1 ; t=2:0.1:6.2:0.1 => r*t
CT l=@r@\cdot @t@=@=@
G b3_arc
LAB circle
BK 3.4

# b3-sector | 3 | Daire diliminin alanı | Area of a sector
L A
R \dfrac{1}{2}r^2\theta
X r\theta ;; r^2\theta ;; \dfrac{1}{2}r\theta^2
K $r$: yarıçap, $\theta$: merkez açı, **radyan** cinsinden
KE $r$: radius, $\theta$: angle at the centre in radians
U Pizza dilimi gibi bir daire diliminin alanını bulur.
UE Finds the area of a sector, like a slice of pizza.
W Tam daire $2\pi$ radyandır ve alanı $\pi r^2$. Dilim bunun $\tfrac{\theta}{2\pi}$’si: $\pi r^2\cdot\tfrac{\theta}{2\pi}=\tfrac12 r^2\theta$.
WE The whole circle is $2\pi$ radians with area $\pi r^2$; the sector is the fraction $\tfrac{\theta}{2\pi}$ of it.
E $r=4$, $\theta=1{,}5$: $A=\tfrac12\cdot 16\cdot 1{,}5=12$.
H Yarım × $r^2$ × $\theta$ (radyan).
T sector = daire dilimi ;; radian = radyan ;; area = alan
Q Bir arabanın silecekleri, $50$ cm uzunluğunda ve $2$ radyanlık bir açı tarıyor. Camın silinen kısmı (dilim) kaç cm²?
QE A wiper blade $50$ cm long sweeps through $2$ radians. What area of glass (a sector) does it sweep?
B \dfrac{1}{2}[[r^2]][[\theta]] || r ;; \theta^2
C r=4:1:30:1 ; t=1.5:0.1:6.2:0.1 => r^2*t/2
CT A=\dfrac{1}{2}\cdot @r@^2\cdot @t@=@=@
G b3_sector
LAB circle
BK 3.4

# b3-tan | 3 | $\tan\theta$ özdeşliği | Identity for $\tan\theta$
L \tan\theta
R \dfrac{\sin\theta}{\cos\theta}
X \dfrac{\cos\theta}{\sin\theta} ;; \sin\theta\cos\theta ;; \sin\theta-\cos\theta
K $\cos\theta\ne 0$ olmalı
KE Valid when $\cos\theta\ne 0$
U Tanjantı sinüs ve kosinüs cinsinden yazar.
UE Writes tangent in terms of sine and cosine.
W Birim çemberde nokta $(\cos\theta,\ \sin\theta)$; tanjant eğimdir: dikey bölü yatay.
WE On the unit circle the point is $(\cos\theta,\ \sin\theta)$ and tangent is the gradient: vertical over horizontal.
E $\sin\theta=\tfrac35$, $\cos\theta=\tfrac45$ ise $\tan\theta=\tfrac34$.
H SOH-CAH-TOA: $\tfrac{O/H}{A/H}=\tfrac{O}{A}$.
T tangent = tanjant ;; identity = özdeşlik ;; sine, cosine = sinüs, kosinüs
Q Bir açının sinüsünün $0{,}6$, kosinüsünün $0{,}8$ olduğunu biliyorsun. Tanjantını nasıl bulursun?
QE You know an angle has sine $0.6$ and cosine $0.8$. How do you find its tangent?
B \dfrac{[[\sin\theta]]}{[[\cos\theta]]} || \tan\theta ;; 1
C s=0.6:-1:1:0.1 ; c=0.8:0.1:1:0.1 => s/c
CT \tan\theta=\dfrac{@s@}{@c@}=@=@
G b3_tan
V theta:-1.5:1.5
LAB unitcircle
BK 3.5

# b3-pyth-id | 3 | Pisagor özdeşliği | Pythagorean identity
L \cos^2\theta+\sin^2\theta
R 1
X 0 ;; 2 ;; \cos\theta+\sin\theta
K Her $\theta$ için doğrudur. $\cos^2\theta$, $(\cos\theta)^2$ demektir.
KE True for every $\theta$. $\cos^2\theta$ means $(\cos\theta)^2$.
U Sinüsü bilinince kosinüsü (ya da tersini) bulur.
UE Finds cosine from sine (or the other way round).
W Birim çemberdeki $(\cos\theta,\ \sin\theta)$ noktası merkezden $1$ uzaktadır; Pisagor: $\cos^2+\sin^2=1^2$.
WE The point $(\cos\theta,\ \sin\theta)$ is $1$ unit from the origin, so by Pythagoras the squares add to $1$.
E $\sin\theta=\tfrac35$ ise $\cos^2\theta=1-\tfrac{9}{25}=\tfrac{16}{25}$.
H Birim çember + Pisagor.
T Pythagorean identity = Pisagor özdeşliği ;; unit circle = birim çember
Q Geniş olmayan bir açının sinüsü $\tfrac{5}{13}$. Kosinüsünü bulmak istiyorsun.
QE An acute angle has sine $\tfrac{5}{13}$. You want its cosine.
C t=0.7:-6.2:6.2:0.1 => cos(t)^2+sin(t)^2
CT \cos^2 @t@+\sin^2 @t@=@=@
G b3_pyth
V theta:-3:3
LAB unitcircle
BK 3.6

# b3-sin2 | 3 | $\sin 2\theta$ (iki kat açı) | Double angle identity for sine
L \sin 2\theta
R 2\sin\theta\cos\theta
X 2\sin\theta ;; \sin^2\theta ;; \sin\theta\cos\theta
K Her $\theta$ için doğrudur.
KE True for every $\theta$.
U İki kat açının sinüsünü, açının sinüs ve kosinüsünden bulur.
UE Finds the sine of a double angle from the sine and cosine of the angle.
W Açı ikiye katlanınca sinüs ikiye katlanmaz ($\sin 60^\circ\ne 2\sin 30^\circ$); bu formül doğru hesabı verir.
WE Doubling the angle does not double the sine; this identity gives the correct value.
E $\sin\theta=\tfrac35$, $\cos\theta=\tfrac45$: $\sin 2\theta=2\cdot\tfrac35\cdot\tfrac45=\tfrac{24}{25}$.
H “2 sin cos” — iki kardeş yan yana.
T double angle identity = iki kat açı özdeşliği ;; sine = sinüs
Q Bir açının sinüsü $\tfrac35$, kosinüsü $\tfrac45$. Bu açının iki katının sinüsü nedir?
QE An angle has sine $\tfrac35$ and cosine $\tfrac45$. What is the sine of twice the angle?
B [[2]]\sin\theta [[\cos\theta]] || \sin\theta ;; 1
C t=0.5:-3.1:3.1:0.1 => 2*sin(t)*cos(t)
CT 2\sin @t@\cos @t@=@=@
G b3_sin2
V theta:-3:3
LAB unitcircle
BK 3.6

# b3-cos2-a | 3 | $\cos 2\theta$ (1. biçim) | Double angle identity for cosine (form 1)
L \cos 2\theta
R \cos^2\theta-\sin^2\theta
X \sin^2\theta-\cos^2\theta ;; 2\cos\theta ;; \cos^2\theta+\sin^2\theta
K Her $\theta$ için doğrudur.
KE True for every $\theta$.
U Hem sinüs hem kosinüs biliniyorsa iki kat açının kosinüsünü bulur.
UE Finds the cosine of a double angle when both sine and cosine are known.
W Kosinüs karesinden sinüs karesi çıkar; sıra önemli (kosinüs önce).
WE Cosine squared minus sine squared; the order matters (cosine first).
E $\cos\theta=\tfrac45$, $\sin\theta=\tfrac35$: $\cos 2\theta=\tfrac{16}{25}-\tfrac{9}{25}=\tfrac{7}{25}$.
H “cos” başta, “cos²” başta.
T double angle identity = iki kat açı özdeşliği ;; cosine = kosinüs
Q Bir açının kosinüsü $\tfrac45$ ve sinüsü $\tfrac35$. Açının iki katının kosinüsü nedir?
QE An angle has cosine $\tfrac45$ and sine $\tfrac35$. Find the cosine of twice the angle.
B [[\cos^2\theta]]-[[\sin^2\theta]] || \cos 2\theta ;; 2\sin\theta
C c=0.8:-1:1:0.1 ; s=0.6:-1:1:0.1 => c^2-s^2
CT @c@^2-@s@^2=@=@
G b3_cos2a
V theta:-3:3
LAB unitcircle
BK 3.6

# b3-cos2-b | 3 | $\cos 2\theta$ (2. biçim) | Double angle identity for cosine (form 2)
L \cos 2\theta
R 2\cos^2\theta-1
X 2\cos^2\theta+1 ;; 2\cos\theta-1 ;; 1-2\cos^2\theta
K Her $\theta$ için doğrudur.
KE True for every $\theta$.
U Yalnızca kosinüs biliniyorsa iki kat açının kosinüsünü bulur.
UE Finds $\cos 2\theta$ when only $\cos\theta$ is known.
W 1. biçimde $\sin^2\theta$ yerine $1-\cos^2\theta$ yazarsın.
WE Replace $\sin^2\theta$ by $1-\cos^2\theta$ in the first form.
E $\cos\theta=\tfrac13$: $\cos 2\theta=\tfrac29-1=-\tfrac79$.
H Sadece kosinüs → “$2\cos^2-1$”.
T double angle identity = iki kat açı özdeşliği ;; cosine = kosinüs
Q Bir açının yalnızca kosinüsünü biliyorsun: $\tfrac13$. Açının iki katının kosinüsünü bulmak istiyorsun.
QE You only know an angle’s cosine, $\tfrac13$. You want the cosine of twice the angle.
B [[2]]\cos^2\theta-[[1]] || 3 ;; 4
C c=0.5:-1:1:0.1 => 2*c^2-1
CT 2\cdot @c@^2-1=@=@
G b3_cos2b
V theta:-3:3
LAB unitcircle
BK 3.6

# b3-cos2-c | 3 | $\cos 2\theta$ (3. biçim) | Double angle identity for cosine (form 3)
L \cos 2\theta
R 1-2\sin^2\theta
X 2\sin^2\theta-1 ;; 1-2\sin\theta ;; 1+2\sin^2\theta
K Her $\theta$ için doğrudur.
KE True for every $\theta$.
U Yalnızca sinüs biliniyorsa iki kat açının kosinüsünü bulur.
UE Finds $\cos 2\theta$ when only $\sin\theta$ is known.
W 1. biçimde $\cos^2\theta$ yerine $1-\sin^2\theta$ yazarsın.
WE Replace $\cos^2\theta$ by $1-\sin^2\theta$ in the first form.
E $\sin\theta=\tfrac12$: $\cos 2\theta=1-\tfrac12=\tfrac12$.
H Sadece sinüs → “$1-2\sin^2$” (1 başta).
T double angle identity = iki kat açı özdeşliği ;; sine = sinüs
Q Bir açının sinüsü $\tfrac14$. Açının iki katının kosinüsünü bulmak istiyorsun.
QE An angle has sine $\tfrac14$. You want the cosine of twice the angle.
B [[1]]-[[2]]\sin^2\theta || 3 ;; 4
C s=0.5:-1:1:0.1 => 1-2*s^2
CT 1-2\cdot @s@^2=@=@
G b3_cos2c
V theta:-3:3
LAB unitcircle
BK 3.6

## x3

# x3-pi-180 | 3 | $\pi$ radyan $=180^\circ$ | $\pi$ radians $=180^\circ$
L \pi
R 180^\circ
X 360^\circ ;; 90^\circ ;; 3.14^\circ
K Burada $\pi$, radyan cinsinden bir açıdır.
KE Here $\pi$ is an angle measured in radians.
U Derece ile radyan arasında köprü kurar.
UE Links degrees and radians.
W Tam tur $360^\circ$ ve çevre $2\pi r$, yani tam tur $2\pi$ radyan. Yarım tur: $\pi=180^\circ$.
WE A full turn is $360^\circ$ and $2\pi$ radians, so half a turn is $\pi = 180^\circ$.
H Yarım tur = $\pi$.
T radian = radyan ;; degree = derece ;; full turn = tam tur
Q IB sorusu açıyı “$\pi$” cinsinden veriyor ama sen derece düşünmeye alışkınsın. Hangi temel eşitlikle çevirirsin?
QE An IB question gives an angle in terms of $\pi$ but you think in degrees. Which basic equality lets you convert?
V -
LAB unitcircle

# x3-deg-rad | 3 | Dereceden radyana | Degrees to radians
L x^\circ
R x\cdot\dfrac{\pi}{180}
X x\cdot\dfrac{180}{\pi} ;; x\pi ;; \dfrac{x}{\pi}
K $x$: derece cinsinden açı
KE $x$: angle in degrees
U Dereceyi radyana çevirir (yay ve dilim formülleri radyan ister).
UE Converts degrees to radians (arc and sector formulas need radians).
W $180^\circ=\pi$ olduğundan $1^\circ=\tfrac{\pi}{180}$.
WE Since $180^\circ=\pi$, $1^\circ=\tfrac{\pi}{180}$.
E $60^\circ=60\cdot\tfrac{\pi}{180}=\tfrac{\pi}{3}$.
H Radyana giderken $\pi$ üstte.
T convert = çevirmek ;; radians = radyan
Q Bir dilim pizzanın açısı $45^\circ$. Dilim alanı formülünü kullanmadan önce bu açıyı neye çevirmen gerekir ve nasıl?
QE A pizza slice has angle $45^\circ$. Before using the sector formula, what must you convert it to, and how?
B x\cdot\dfrac{[[\pi]]}{[[180]]} || 360 ;; 2\pi
C x=60:-360:360:5 => x*PI/180
CT @x@^\circ=@x@\cdot\dfrac{\pi}{180}\approx @=@
G b3_xd2r
V x:-360:360

# x3-rad-deg | 3 | Radyandan dereceye | Radians to degrees
L x
R \left(x\cdot\dfrac{180}{\pi}\right)^\circ
X \left(x\cdot\dfrac{\pi}{180}\right)^\circ ;; (180x)^\circ ;; \left(\dfrac{x}{180}\right)^\circ
K $x$: radyan cinsinden açı
KE $x$: angle in radians
U Radyanı, tanıdık dereceye çevirir.
UE Converts radians to degrees.
W $\pi=180^\circ$ olduğundan $1$ radyan $=\tfrac{180}{\pi}\approx 57{,}3^\circ$.
WE Since $\pi=180^\circ$, $1$ radian $=\tfrac{180}{\pi}\approx 57.3^\circ$.
E $\tfrac{\pi}{4}\cdot\tfrac{180}{\pi}=45^\circ$.
H Dereceye giderken $\pi$ altta (sadeleşsin diye).
T radians = radyan ;; degrees = derece
Q Hesap makinen radyan modunda bir açıyı $1{,}2$ verdi. Bunu derece olarak yazmak istiyorsun.
QE Your calculator in radian mode gave an angle as $1.2$. You want it in degrees.
B \left(x\cdot\dfrac{[[180]]}{[[\pi]]}\right)^\circ || 360 ;; 2\pi
C x=1:-6.3:6.3:0.1 => x*180/PI
CT @x@\cdot\dfrac{180}{\pi}\approx @=@^\circ
G b3_xr2d
V x:-6:6

# x3-sin30 | 3 | $\sin\frac{\pi}{6}$ değeri | Exact value of $\sin\frac{\pi}{6}$
L \sin\dfrac{\pi}{6}
R \dfrac{1}{2}
X \dfrac{\sqrt{3}}{2} ;; \dfrac{\sqrt{2}}{2} ;; \dfrac{1}{3}
K $\dfrac{\pi}{6}=30^\circ$
KE $\dfrac{\pi}{6}=30^\circ$
U Hesap makinesiz sınavda (Paper 1) gereken tam değerdir.
UE An exact value needed in the non-calculator paper (Paper 1).
W Eşkenar üçgeni ikiye böl: $30^\circ$’nin karşısı hipotenüsün yarısıdır.
WE Halve an equilateral triangle: the side opposite $30^\circ$ is half the hypotenuse.
H Sin sırası: $\tfrac{\sqrt1}{2},\ \tfrac{\sqrt2}{2},\ \tfrac{\sqrt3}{2}$ ($30^\circ,\ 45^\circ,\ 60^\circ$).
T exact value = tam değer ;; Paper 1 = hesap makinesiz sınav
Q $10$ m’lik bir rampa yerle $30^\circ$ açı yapıyor. Tepesi yerden kaç m yüksekte? (Hesap makinesi yok.)
QE A $10$ m ramp makes $30^\circ$ with the ground. How high is its top? (No calculator.)
V -
LAB unitcircle

# x3-sin45 | 3 | $\sin\frac{\pi}{4}$ değeri | Exact value of $\sin\frac{\pi}{4}$
L \sin\dfrac{\pi}{4}
R \dfrac{\sqrt{2}}{2}
X \dfrac{1}{2} ;; \dfrac{\sqrt{3}}{2} ;; 1
K $\dfrac{\pi}{4}=45^\circ$
KE $\dfrac{\pi}{4}=45^\circ$
U $45^\circ$ içeren sorularda tam değeri verir.
UE Gives the exact value for $45^\circ$ problems.
W Kenarı $1$ olan karenin köşegeni $\sqrt2$; $\tfrac{1}{\sqrt2}=\tfrac{\sqrt2}{2}$.
WE A unit square has diagonal $\sqrt2$, so $\sin 45^\circ=\tfrac{1}{\sqrt2}=\tfrac{\sqrt2}{2}$.
H $45^\circ$’de sinüs ve kosinüs eşit.
T exact value = tam değer ;; isosceles right triangle = ikizkenar dik üçgen
Q Bir kare kâğıdı köşegeninden katlıyorsun. Köşegenin kenarla yaptığı açının sinüsü nedir?
QE You fold a square sheet along its diagonal. What is the sine of the angle between the diagonal and a side?
V -
LAB unitcircle

# x3-sin60 | 3 | $\sin\frac{\pi}{3}$ değeri | Exact value of $\sin\frac{\pi}{3}$
L \sin\dfrac{\pi}{3}
R \dfrac{\sqrt{3}}{2}
X \dfrac{1}{2} ;; \dfrac{\sqrt{2}}{2} ;; \sqrt{3}
K $\dfrac{\pi}{3}=60^\circ$
KE $\dfrac{\pi}{3}=60^\circ$
U $60^\circ$ içeren sorularda tam değeri verir.
UE Gives the exact value for $60^\circ$ problems.
W Kenarı $2$ olan eşkenar üçgenin yüksekliği $\sqrt3$; $\sin 60^\circ=\tfrac{\sqrt3}{2}$.
WE An equilateral triangle of side $2$ has height $\sqrt3$, so $\sin 60^\circ=\tfrac{\sqrt3}{2}$.
H Büyük açı → büyük sinüs ($\sqrt3$).
T exact value = tam değer ;; equilateral triangle = eşkenar üçgen
Q Kenarı $2$ cm olan eşkenar üçgende bir kenarla taban arasındaki açının sinüsü nedir?
QE In an equilateral triangle of side $2$ cm, what is the sine of the angle between a side and the base?
V -
LAB unitcircle

# x3-cos30 | 3 | $\cos\frac{\pi}{6}$ değeri | Exact value of $\cos\frac{\pi}{6}$
L \cos\dfrac{\pi}{6}
R \dfrac{\sqrt{3}}{2}
X \dfrac{1}{2} ;; \dfrac{\sqrt{2}}{2} ;; \dfrac{\sqrt{3}}{3}
K $\dfrac{\pi}{6}=30^\circ$
KE $\dfrac{\pi}{6}=30^\circ$
U $30^\circ$’nin kosinüsünün tam değerini verir.
UE Gives the exact cosine of $30^\circ$.
W Kosinüs sıralaması sinüsün tersidir: $\cos 30^\circ=\sin 60^\circ$.
WE Cosine values run in the reverse order: $\cos 30^\circ=\sin 60^\circ$.
H cos ↔ sin: $30$ ile $60$ yer değiştirir.
T exact value = tam değer ;; cosine = kosinüs
Q $4$ m’lik bir merdiven duvarla değil yerle $30^\circ$ açı yapıyor. Ayağı duvardan ne kadar uzakta? (Tam değer.)
QE A $4$ m ladder makes $30^\circ$ with the ground. How far is its foot from the wall? (Exact value.)
V -
LAB unitcircle

# x3-cos60 | 3 | $\cos\frac{\pi}{3}$ değeri | Exact value of $\cos\frac{\pi}{3}$
L \cos\dfrac{\pi}{3}
R \dfrac{1}{2}
X \dfrac{\sqrt{3}}{2} ;; \dfrac{\sqrt{2}}{2} ;; 2
K $\dfrac{\pi}{3}=60^\circ$
KE $\dfrac{\pi}{3}=60^\circ$
U $60^\circ$’nin kosinüsünün tam değerini verir.
UE Gives the exact cosine of $60^\circ$.
W $\cos 60^\circ=\sin 30^\circ=\tfrac12$.
WE $\cos 60^\circ=\sin 30^\circ=\tfrac12$.
H $60^\circ$ → yarım.
T exact value = tam değer ;; cosine = kosinüs
Q Bir ip yerle $60^\circ$ açı yapacak şekilde $8$ m gerilmiş. Yerdeki gölgesi (yatay uzunluk) kaç m?
QE A rope $8$ m long makes $60^\circ$ with the ground. What is its horizontal length?
V -
LAB unitcircle

# x3-tan45 | 3 | $\tan\frac{\pi}{4}$ değeri | Exact value of $\tan\frac{\pi}{4}$
L \tan\dfrac{\pi}{4}
R 1
X \dfrac{\sqrt{2}}{2} ;; \sqrt{3} ;; 0
K $\dfrac{\pi}{4}=45^\circ$
KE $\dfrac{\pi}{4}=45^\circ$
U $45^\circ$ eğimli doğrular ve rampalarda kullanılır.
UE Used for $45^\circ$ slopes and ramps.
W $45^\circ$’de karşı ve komşu kenar eşittir; oranları $1$.
WE At $45^\circ$ the opposite and adjacent sides are equal, so their ratio is $1$.
H $45^\circ$ = eğim $1$.
T exact value = tam değer ;; tangent = tanjant
Q Güneş $45^\circ$ yükseklikteyken bir ağacın gölgesi $7$ m. Ağaç kaç m boyunda?
QE When the sun is at $45^\circ$ a tree’s shadow is $7$ m. How tall is the tree?
V -
LAB unitcircle

# x3-tan60 | 2 | $\tan\frac{\pi}{3}$ değeri | Exact value of $\tan\frac{\pi}{3}$
L \tan\dfrac{\pi}{3}
R \sqrt{3}
X \dfrac{\sqrt{3}}{3} ;; \dfrac{\sqrt{3}}{2} ;; 1
K $\dfrac{\pi}{3}=60^\circ$
KE $\dfrac{\pi}{3}=60^\circ$
U $60^\circ$’nin tanjantının tam değerini verir.
UE Gives the exact tangent of $60^\circ$.
W $\tan 60^\circ=\dfrac{\sqrt3/2}{1/2}=\sqrt3$.
WE $\tan 60^\circ=\dfrac{\sqrt3/2}{1/2}=\sqrt3$.
H Dik açı yaklaştıkça tanjant büyür: $\sqrt3>1$.
T exact value = tam değer ;; tangent = tanjant
Q Bir yokuş yatayla $60^\circ$ yapıyor. Yatayda $1$ m gidince kaç m yükselirsin? (Tam değer.)
QE A slope makes $60^\circ$ with the horizontal. How much do you rise for $1$ m across? (Exact.)
V -
LAB unitcircle

# x3-tan30 | 2 | $\tan\frac{\pi}{6}$ değeri | Exact value of $\tan\frac{\pi}{6}$
L \tan\dfrac{\pi}{6}
R \dfrac{\sqrt{3}}{3}
X \sqrt{3} ;; \dfrac{\sqrt{3}}{2} ;; \dfrac{1}{2}
K $\dfrac{\pi}{6}=30^\circ$. $\tfrac{1}{\sqrt3}=\tfrac{\sqrt3}{3}$ aynı sayıdır.
KE $\dfrac{\pi}{6}=30^\circ$. $\tfrac{1}{\sqrt3}$ and $\tfrac{\sqrt3}{3}$ are the same number.
U $30^\circ$’nin tanjantının tam değerini verir.
UE Gives the exact tangent of $30^\circ$.
W $\tan 30^\circ=\dfrac{1/2}{\sqrt3/2}=\tfrac{1}{\sqrt3}=\tfrac{\sqrt3}{3}$.
WE $\tan 30^\circ=\dfrac{1/2}{\sqrt3/2}=\tfrac{1}{\sqrt3}=\tfrac{\sqrt3}{3}$.
H $\tan 30^\circ$ ile $\tan 60^\circ$ birbirinin tersi.
T exact value = tam değer ;; rationalise the denominator = paydayı rasyonel yapmak
Q Bir rampa yatayla $30^\circ$ yapıyor. Yatayda $3$ m gidince kaç m yükselirsin? (Tam değer.)
QE A ramp makes $30^\circ$ with the horizontal. How much do you rise over $3$ m across? (Exact.)
V -
LAB unitcircle

# x3-sin90 | 2 | $\sin\frac{\pi}{2}$ değeri | Exact value of $\sin\frac{\pi}{2}$
L \sin\dfrac{\pi}{2}
R 1
X 0 ;; \dfrac{1}{2} ;; -1
K $\dfrac{\pi}{2}=90^\circ$. Ayrıca $\cos\dfrac{\pi}{2}=0$.
KE $\dfrac{\pi}{2}=90^\circ$. Also $\cos\dfrac{\pi}{2}=0$.
U Sinüs dalgasının en yüksek değerini verir.
UE Gives the maximum value of the sine curve.
W Birim çemberde $90^\circ$ noktası $(0,\ 1)$: $y$ koordinatı (sinüs) $1$.
WE At $90^\circ$ the unit circle point is $(0,\ 1)$, so sine (the $y$-coordinate) is $1$.
H Tepe nokta: $(0,\ 1)$.
T maximum = en büyük değer ;; unit circle = birim çember
Q Dönme dolabın bir kabini tam tepeye geldiğinde açısı $90^\circ$. O anda yüksekliği yarıçapın kaç katıdır (merkeze göre)?
QE A Ferris wheel cabin at the very top is at $90^\circ$. How many radii above the centre is it?
V -
LAB unitcircle

# x3-cos90 | 2 | $\cos\frac{\pi}{2}$ değeri | Exact value of $\cos\frac{\pi}{2}$
L \cos\dfrac{\pi}{2}
R 0
X 1 ;; -1 ;; \dfrac{1}{2}
K $\dfrac{\pi}{2}=90^\circ$
KE $\dfrac{\pi}{2}=90^\circ$
U Kosinüs teoreminin $90^\circ$’de Pisagor’a dönüşmesini açıklar.
UE Explains why the cosine rule becomes Pythagoras at $90^\circ$.
W Birim çemberde $90^\circ$ noktası $(0,\ 1)$: $x$ koordinatı (kosinüs) $0$.
WE At $90^\circ$ the point is $(0,\ 1)$, so cosine (the $x$-coordinate) is $0$.
H Dik açıda kosinüs “yok olur”.
T unit circle = birim çember ;; right angle = dik açı
Q Kosinüs teoreminde $C=90^\circ$ koyunca $-2ab\cos C$ terimi ne olur?
QE In the cosine rule, what happens to the term $-2ab\cos C$ when $C=90^\circ$?
V -
LAB unitcircle

# x3-sin0 | 2 | $\sin 0$ değeri | Exact value of $\sin 0$
L \sin 0
R 0
X 1 ;; -1 ;; \dfrac{1}{2}
K Ayrıca $\cos 0=1$.
KE Also $\cos 0=1$.
U Sinüs grafiğinin başladığı noktayı verir.
UE Gives where the sine curve starts.
W $0$ açısında birim çember noktası $(1,\ 0)$: yükseklik (sinüs) $0$.
WE At angle $0$ the point is $(1,\ 0)$, so the height (sine) is $0$.
H Sinüs dalgası sıfırdan başlar.
T unit circle = birim çember ;; origin = başlangıç noktası
Q Dönme dolabın kabini merkezle aynı yükseklikte, sağ taraftayken (açı $0$) merkeze göre yüksekliği nedir?
QE A Ferris wheel cabin is level with the centre on the right (angle $0$). What is its height relative to the centre?
V -
LAB unitcircle

# x3-cos0 | 2 | $\cos 0$ değeri | Exact value of $\cos 0$
L \cos 0
R 1
X 0 ;; -1 ;; \dfrac{1}{2}
K Birim çemberde başlangıç noktası $(1,\ 0)$
KE The starting point on the unit circle is $(1,\ 0)$
U Kosinüs grafiğinin başladığı (en yüksek) noktayı verir.
UE Gives where the cosine curve starts (its maximum).
W $0$ açısında nokta $(1,\ 0)$: $x$ koordinatı (kosinüs) $1$.
WE At angle $0$ the point is $(1,\ 0)$, so cosine is $1$.
H Kosinüs dalgası tepeden başlar.
T unit circle = birim çember ;; maximum = en büyük değer
Q Kosinüs teoreminde açı $0$ olsaydı (üçgen yassılsaydı) $\cos C$ hangi sayı olurdu?
QE In the cosine rule, if the angle were $0$ (a flat triangle), what would $\cos C$ be?
V -
LAB unitcircle

# x3-unit-pt | 3 | Birim çemberde nokta | Point on the unit circle
L ~Birim çemberde $\theta$ açısının noktası
O :
R (\cos\theta,\ \sin\theta)
X (\sin\theta,\ \cos\theta) ;; (\tan\theta,\ 1) ;; (\theta,\ \sin\theta)
K Birim çember: merkezi orijin, yarıçapı $1$. Açı pozitif $x$ ekseninden saat yönünün tersine ölçülür.
KE Unit circle: centre the origin, radius $1$. Angles are measured anticlockwise from the positive $x$-axis.
U Her açı için sinüs ve kosinüsü (negatif olanlar dahil) tanımlar.
UE Defines sine and cosine for every angle, including negative values.
W Hipotenüs $1$ olunca yatay kenar $\cos\theta$, dikey kenar $\sin\theta$ olur.
WE With hypotenuse $1$, the horizontal side is $\cos\theta$ and the vertical side is $\sin\theta$.
H Alfabetik: $x$ önce, $c$ önce → (cos, sin).
T unit circle = birim çember ;; anticlockwise = saat yönünün tersi ;; coordinates = koordinatlar
Q $1$ m yarıçaplı bir dönme kolunun ucu, yataydan $\theta$ açısı kadar dönmüş. Ucun koordinatları nedir?
QE The tip of a $1$ m arm has turned through $\theta$ from the horizontal. What are the tip’s coordinates?
C t=0.5:-6.2:6.2:0.1 => cos(t)
CT x=\cos @t@\approx @=@
LAB unitcircle

# x3-cast | 3 | Bölgelere göre işaretler (CAST) | Signs by quadrant (CAST)
L ~Pozitif olan oranlar: 1., 2., 3., 4. bölge
O :
R ~Hepsi, $\sin$, $\tan$, $\cos$
X ~Hepsi, $\cos$, $\tan$, $\sin$ ;; ~Hepsi, $\tan$, $\sin$, $\cos$ ;; ~$\sin$, $\cos$, $\tan$, hepsi
K Bölgeler saat yönünün tersine numaralanır (sağ üst = 1).
KE Quadrants are numbered anticlockwise (top right = 1st). All Students Take Calculus: All, Sine, Tangent, Cosine.
U Bir açının sinüs/kosinüs/tanjantının işaretini bulur.
UE Tells you the sign of sine, cosine and tangent in each quadrant.
W Sinüs $y$’dir (üstte pozitif), kosinüs $x$’tir (sağda pozitif), tanjant $y/x$’tir (işaretler aynıysa pozitif).
WE Sine is $y$ (positive above), cosine is $x$ (positive on the right), tangent is $y/x$ (positive when they match).
H All Students Take Calculus.
T quadrant = bölge (dörtte bir düzlem) ;; positive = pozitif ;; CAST diagram = CAST diyagramı
Q $\sin\theta=0{,}4$ ve $\theta$ geniş açı. $\cos\theta$’nın işareti ne olur?
QE $\sin\theta=0.4$ and $\theta$ is obtuse. What is the sign of $\cos\theta$?
LAB unitcircle

# x3-sin-supp | 3 | $\sin(\pi-\theta)$ | $\sin(\pi-\theta)$
L \sin(\pi-\theta)
R \sin\theta
X -\sin\theta ;; \cos\theta ;; \pi-\sin\theta
K $\pi-\theta$: $180^\circ-\theta$
KE $\pi-\theta$ means $180^\circ-\theta$
U Geniş açının sinüsünü dar açıya çevirir; $\sin x=k$’nın ikinci çözümünü verir.
UE Turns the sine of an obtuse angle into an acute one; gives the second solution of $\sin x=k$.
W Birim çemberde $\theta$ ve $\pi-\theta$ noktaları $y$ eksenine göre simetriktir: yükseklikleri aynı.
WE On the unit circle $\theta$ and $\pi-\theta$ are mirror images in the $y$-axis, so they have the same height.
E $\sin 150^\circ=\sin 30^\circ=\tfrac12$.
H Ayna $y$ ekseni: sinüs aynı kalır.
T supplementary angles = bütünler açılar ;; symmetry = simetri
Q Hesap makinesi yokken $\sin 150^\circ$’yi bulmak istiyorsun.
QE Without a calculator you want $\sin 150^\circ$.
B \sin[[\theta]] || -\theta ;; \pi
V theta:-3:3
LAB unitcircle

# x3-cos-supp | 3 | $\cos(\pi-\theta)$ | $\cos(\pi-\theta)$
L \cos(\pi-\theta)
R -\cos\theta
X \cos\theta ;; -\sin\theta ;; \pi-\cos\theta
K $\pi-\theta$: $180^\circ-\theta$
KE $\pi-\theta$ means $180^\circ-\theta$
U Geniş açının kosinüsünü bulur (işaret değişir).
UE Finds the cosine of an obtuse angle (the sign changes).
W Simetride nokta $y$ ekseninin öbür tarafına geçer: $x$ (kosinüs) işaret değiştirir.
WE The mirror point is on the other side of the $y$-axis, so $x$ (cosine) changes sign.
E $\cos 120^\circ=-\cos 60^\circ=-\tfrac12$.
H 2. bölgede kosinüs eksi.
T obtuse angle = geniş açı ;; supplementary angles = bütünler açılar
Q Kosinüs teoreminde $C=120^\circ$ çıktı. $\cos 120^\circ$ değerini tam olarak bulmak istiyorsun.
QE In the cosine rule you have $C=120^\circ$. You want the exact value of $\cos 120^\circ$.
B [[-]]\cos\theta || + ;; 2
V theta:-3:3
LAB unitcircle

# x3-sin-neg | 2 | $\sin(-\theta)$ | $\sin(-\theta)$
L \sin(-\theta)
R -\sin\theta
X \sin\theta ;; -\cos\theta ;; \cos\theta
K $-\theta$: saat yönünde ölçülen açı
KE $-\theta$ is an angle measured clockwise
U Negatif açının sinüsünü bulur (sinüs tek fonksiyondur).
UE Finds the sine of a negative angle (sine is an odd function).
W Saat yönünde dönünce nokta $x$ ekseninin altına iner: yükseklik işaret değiştirir.
WE Turning clockwise puts the point below the $x$-axis, so the height changes sign.
E $\sin(-30^\circ)=-\tfrac12$.
H Eksi açı → eksi sinüs.
T odd function = tek fonksiyon ;; clockwise = saat yönü
Q Bir dalga grafiğinde $\sin(-\tfrac{\pi}{6})$ değerini okuman gerekiyor ama sadece pozitif açıları biliyorsun.
QE On a wave graph you need $\sin(-\tfrac{\pi}{6})$ but you only know positive angles.
B [[-]]\sin\theta || + ;; \cos
V theta:-3:3
LAB unitcircle

# x3-cos-neg | 2 | $\cos(-\theta)$ | $\cos(-\theta)$
L \cos(-\theta)
R \cos\theta
X -\cos\theta ;; \sin\theta ;; -\sin\theta
K $-\theta$: saat yönünde ölçülen açı
KE $-\theta$ is an angle measured clockwise
U Negatif açının kosinüsünü bulur (kosinüs çift fonksiyondur).
UE Finds the cosine of a negative angle (cosine is an even function).
W $x$ eksenine göre yansıyan noktanın $x$ koordinatı değişmez.
WE Reflecting in the $x$-axis does not change the $x$-coordinate.
E $\cos(-60^\circ)=\tfrac12$.
H Kosinüs eksiyi “yutar”.
T even function = çift fonksiyon ;; reflection = yansıma
Q $\cos(-\tfrac{\pi}{3})$ değerini hesap makinesiz bulmak istiyorsun.
QE You want $\cos(-\tfrac{\pi}{3})$ without a calculator.
B \cos[[\theta]] || -\theta ;; \pi
V theta:-3:3
LAB unitcircle

# x3-amp | 3 | Genlik | Amplitude
L ~$y=a\sin(b(x+c))+d$ eğrisinin genliği
O :
R |a|
X a ;; 2a ;; |d|
K Genlik her zaman pozitiftir. $a<0$ ise eğri ters döner ama genlik $|a|$ kalır.
KE Amplitude is always positive; if $a<0$ the curve is reflected but the amplitude is still $|a|$.
U Dalganın orta çizgiden ne kadar yükselip alçaldığını bulur.
UE Finds how far the wave rises and falls from its principal axis.
W $\sin$ değerleri $-1$ ile $1$ arasındadır; $a$ ile çarpınca $-|a|$ ile $|a|$ arasına uzar.
WE Sine stays between $-1$ and $1$; multiplying by $a$ stretches it to between $-|a|$ and $|a|$.
E $y=-3\sin x+1$: genlik $3$.
H Genlik = baştaki sayının mutlak değeri.
T amplitude = genlik ;; principal axis = asal eksen (orta çizgi) ;; vertical stretch = dikey uzatma
Q Bir dönme dolabın yüksekliği $h=15\sin(0{,}2t)+20$ ile veriliyor. Kabin merkezden en fazla kaç m yukarı çıkar?
QE A Ferris wheel height is $h=15\sin(0.2t)+20$. How far above the centre does a cabin go at most?
C a=-3:-10:10:0.5 => abs(a)
CT |@a@|=@=@
G b3_xamp
LAB sinewave

# x3-period | 3 | Periyot | Period
L ~$y=a\sin(b(x+c))+d$ eğrisinin periyodu
O :
R \dfrac{2\pi}{b}
X 2\pi b ;; \dfrac{b}{2\pi} ;; \dfrac{\pi}{b}
K $b>0$ ve $x$ radyan. Derece kullanıyorsan $\tfrac{360^\circ}{b}$.
KE $b>0$ and $x$ in radians. In degrees it is $\tfrac{360^\circ}{b}$.
U Dalganın kendini kaç birimde bir tekrarladığını bulur.
UE Finds how long it takes the wave to repeat itself.
W $\sin$ bir turu $2\pi$’de tamamlar. $b$ dalgayı $b$ kat hızlandırır, tur $b$ kat kısalır.
WE Sine repeats every $2\pi$; $b$ makes it $b$ times faster, so the period is $b$ times shorter.
E $y=\sin 4x$: periyot $\tfrac{2\pi}{4}=\tfrac{\pi}{2}$.
H Büyük $b$ → sık dalga → kısa periyot.
T period = periyot ;; horizontal stretch = yatay uzatma ;; sinusoidal = sinüzoidal
Q Bir sesin dalgası $y=\sin(6x)$ ile modelleniyor. Dalga ne sıklıkla tekrar ediyor?
QE A sound wave is modelled by $y=\sin(6x)$. How often does it repeat?
B \dfrac{[[2\pi]]}{[[b]]} || \pi ;; a
C b=4:0.5:10:0.5 => 2*PI/b
CT \dfrac{2\pi}{@b@}\approx @=@
G b3_xper
LAB sinewave

# x3-axis | 2 | Asal eksen | Principal axis
L ~$y=a\sin(b(x+c))+d$ eğrisinin asal ekseni
O :
R y=d
X y=a ;; y=c ;; x=d
K Asal eksen, en büyük ve en küçük değerin ortasındaki yatay doğrudur.
KE The principal axis is the horizontal line halfway between the maximum and minimum.
U Dalganın ortalama yüksekliğini (orta çizgisini) bulur.
UE Finds the middle line (average height) of the wave.
W $+d$ bütün grafiği $d$ birim yukarı kaydırır; orta çizgi $y=0$’dan $y=d$’ye gelir.
WE Adding $d$ moves the whole graph up by $d$, so the middle line moves from $y=0$ to $y=d$.
E $y=2\sin x+5$: asal eksen $y=5$, en büyük $7$, en küçük $3$.
H $d$ = “dikey kayma”.
T principal axis = asal eksen ;; vertical translation = dikey öteleme ;; maximum, minimum = en büyük, en küçük
Q Gelgitte deniz seviyesi $h=3\sin(0{,}5t)+8$ metre. Ortalama deniz seviyesi kaç m?
QE The tide height is $h=3\sin(0.5t)+8$ metres. What is the mean sea level?
C a=2:-10:10:1 ; d=5:-10:10:1 => d
CT \dfrac{(@d@+|@a@|)+(@d@-|@a@|)}{2}=@=@
G b3_xaxis
LAB sinewave

# x3-tan-period | 2 | $\tan x$’in periyodu $\pi$ | The period of $\tan x$ is $\pi$
L \tan(x+\pi)
R \tan x
X \tan x+\pi ;; -\tan x ;; \tan x+1
K $x\ne\tfrac{\pi}{2}+k\pi$ (orada tanjant tanımsız, dikey asimptot var)
KE $x\ne\tfrac{\pi}{2}+k\pi$ (tangent is undefined there: vertical asymptotes)
U $\tan x=k$ denkleminin çözümlerini $\pi$ ekleyerek bulmanı sağlar.
UE Lets you find all solutions of $\tan x=k$ by adding $\pi$.
W Yarım tur dönünce hem $\sin$ hem $\cos$ işaret değiştirir; oranları ($\tan$) aynı kalır.
WE After half a turn both sine and cosine change sign, so their ratio stays the same.
E $\tan\tfrac{\pi}{4}=\tan\tfrac{5\pi}{4}=1$.
H $\sin$, $\cos$: $2\pi$; $\tan$: $\pi$.
T period = periyot ;; vertical asymptote = dikey asimptot
Q $\tan x=1$ denkleminin $\tfrac{\pi}{4}$ dışındaki çözümlerini bulmak istiyorsun.
QE You want the solutions of $\tan x=1$ other than $\tfrac{\pi}{4}$.
V x:-1.4:1.4
LAB unitcircle

# x3-sin-two | 3 | $\sin x=k$ denkleminin iki çözümü | The two solutions of $\sin x=k$
L ~$\sin x=k$ ($0<k<1$), $[0,\ 2\pi)$ içindeki çözümler
O :
R ~$x$ ve $\pi-x$
X ~Yalnızca $x$ ;; ~$x$ ve $-x$ ;; ~$x$ ve $2\pi-x$
K $x$: hesap makinesinin verdiği dar açı ($\arcsin k$)
KE $x$: the acute angle from the calculator ($\arcsin k$)
U Hesap makinesinin göstermediği ikinci çözümü bulur.
UE Finds the second solution that the calculator does not show.
W Sinüs 1. ve 2. bölgede pozitiftir; $\pi-x$ aynı yüksekliği verir.
WE Sine is positive in the 1st and 2nd quadrants, and $\pi-x$ has the same height.
E $\sin x=\tfrac12$: $x=\tfrac{\pi}{6}$ ve $x=\tfrac{5\pi}{6}$.
H Bir çözüm bulunca: “$\pi$ eksi o”.
T solution = çözüm ;; interval = aralık ;; arcsine = arksinüs
Q $0\le x<2\pi$ için $\sin x=0{,}5$ denkleminin tüm çözümleri isteniyor. Hesap makinesi yalnızca birini veriyor.
QE All solutions of $\sin x=0.5$ for $0\le x<2\pi$ are required. The calculator gives only one.
C k=0.5:0.1:0.9:0.1 => PI-asin(k)
CT \pi-\arcsin @k@\approx @=@
G b3_xsol
LAB unitcircle

# x3-ambig | 2 | Sinüs teoreminde belirsiz durum | Ambiguous case of the sine rule
L ~İki kenar ve karşı açı verilmiş; $\sin B$ bulundu
O \Rightarrow
R ~$B$ ya da $180^\circ-B$ olabilir
X ~Her zaman tek üçgen var ;; ~$B$ ya da $90^\circ-B$ olabilir ;; ~$B$ ya da $-B$ olabilir
K İkinci üçgen yalnızca açıların toplamı $180^\circ$’den küçük kalırsa vardır.
KE The second triangle exists only if the angles still add to less than $180^\circ$.
U Sinüs teoremiyle açı bulurken ikinci olası üçgeni kaçırmamanı sağlar.
UE Stops you missing the second possible triangle when finding an angle with the sine rule.
W $\sin B=\sin(180^\circ-B)$ olduğundan iki açı da aynı sinüsü verir.
WE Since $\sin B=\sin(180^\circ-B)$, both angles give the same sine.
E $\sin B=0{,}5$: $B=30^\circ$ ya da $150^\circ$.
H Kenar–kenar–açı (SSA) gördün mü? İki üçgen olabilir.
T ambiguous case = belirsiz durum ;; obtuse = geniş ;; acute = dar
Q Bir üçgende $a=6$, $b=8$, $A=40^\circ$ veriliyor. $B$ açısını bulurken nelere dikkat etmelisin?
QE A triangle has $a=6$, $b=8$, $A=40^\circ$. What must you watch out for when finding angle $B$?
C B=30:1:89:1 => 180-B
CT 180^\circ-@B@^\circ=@=@^\circ
LAB trigtriangle

# x3-elev | 2 | Yükselme ve alçalma açısı | Angles of elevation and depression
L ~Yükselme / alçalma açısı nereden ölçülür?
O :
R ~Yataydan (yukarı ya da aşağı)
X ~Dikeyden ;; ~Yerden yukarı doğru, dikey çizgiden ;; ~Cismin kendisinden
K Gözlemciden geçen yatay çizgiden ölçülür. Yükselme: yukarı bakış, alçalma: aşağı bakış. İkisi eşittir (iç ters açılar).
KE Measured from the horizontal through the observer: elevation looking up, depression looking down; they are equal (alternate angles).
U Bina, kule ve uçak sorularında dik üçgeni doğru kurar.
UE Sets up the right-angled triangle in building, tower and plane questions.
W Yükseklik $=$ yatay uzaklık $\times\tan\theta$.
WE Height $=$ horizontal distance $\times\tan\theta$.
E $50$ m uzaktan bir kuleye $30^\circ$ yükselme açısı: yükseklik $=50\tan 30^\circ\approx 28{,}9$ m.
H Hep yataydan!
T angle of elevation = yükselme açısı ;; angle of depression = alçalma açısı ;; horizontal = yatay
Q Bir uçurumun tepesinden denizdeki bir tekneye $25^\circ$ aşağı bakıyorsun. Uçurum $80$ m. Tekne ne kadar uzakta?
QE From the top of an $80$ m cliff you look down at $25^\circ$ to a boat. How far away is the boat?
C d=50:1:200:1 ; t=30:1:80:1 => d*tan(deg(t))
CT h=@d@\tan @t@^\circ\approx @=@
G b3_xelev
LAB trigtriangle

# x3-bearing | 2 | Kerteriz (yön açısı) | Bearings
L ~Kerteriz nasıl ölçülür?
O :
R ~Kuzeyden saat yönünde, üç basamakla
X ~Doğudan saat yönünün tersine ;; ~Kuzeyden saat yönünün tersine ;; ~Güneyden saat yönünde
K Ör. doğu $090^\circ$, güney $180^\circ$, batı $270^\circ$. Hep üç basamak: $045^\circ$.
KE E.g. east is $090^\circ$, south $180^\circ$, west $270^\circ$; always three figures: $045^\circ$.
U Gemi, uçak ve harita sorularında yönü bir sayıyla verir.
UE Gives a direction as a number in navigation questions.
W Pusula kuzeyi gösterir; saat yönünde dönerek açıyı okursun.
WE A compass points north, and you turn clockwise to read the angle.
E Geri kerteriz: $060^\circ$ → $060+180=240^\circ$.
H Kuzey, saat yönü, üç rakam.
T bearing = kerteriz (yön açısı) ;; clockwise = saat yönü ;; three-figure bearing = üç basamaklı kerteriz
Q Bir gemi limandan tam güneydoğuya gidiyor. Kaptan bu yönü bir açı olarak nasıl yazar?
QE A ship sails due south-east from a port. How does the captain write this direction as an angle?
C b=60:0:359:1 => (b+180)%360
CT \text{geri}: @b@^\circ+180^\circ\to @=@^\circ
G b3_xbear
`;

/* ---------- yardımcılar ---------- */
const PIQ = " (Cevap $k\\pi$ ise $k$ kaçtır?)";
const PIQE = " (If the answer is $k\\pi$, what is $k$?)";
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
const T3 = [[1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [4, 4, 7, 9], [1, 4, 8, 9], [2, 10, 11, 15]];
const sg = (r) => (r() < 0.5 ? -1 : 1);

export const GEN = {
  b3_para: (r) => { const b = ri(r, 3, 15), h = ri(r, 2, 12); return { q: `Tabanı $${b}$ cm, yüksekliği $${h}$ cm olan paralelkenarın alanı kaç cm²?`, qe: `A parallelogram has base $${b}$ cm and height $${h}$ cm. Find its area in cm².`, ...int(b * h) }; },
  b3_tri: (r) => { const b = 2 * ri(r, 2, 10), h = ri(r, 2, 12); return { q: `Tabanı $${b}$, yüksekliği $${h}$ olan üçgenin alanı kaçtır?`, qe: `A triangle has base $${b}$ and height $${h}$. Find its area.`, ...int(b * h / 2) }; },
  b3_trap: (r) => { const a = ri(r, 2, 10), b = a + ri(r, 1, 8), h = 2 * ri(r, 1, 6); return { q: `Paralel kenarları $${a}$ ve $${b}$, yüksekliği $${h}$ olan yamuğun alanı kaçtır?`, qe: `A trapezoid has parallel sides $${a}$ and $${b}$ and height $${h}$. Find its area.`, ...int((a + b) * h / 2) }; },
  b3_circ: (r) => { const R = ri(r, 2, 12); return { q: `Yarıçapı $${R}$ olan dairenin alanı nedir?${PIQ}`, qe: `Find the area of a circle of radius $${R}$.${PIQE}`, ...int(R * R) }; },
  b3_circum: (r) => { const R = ri(r, 2, 20); return { q: `Yarıçapı $${R}$ olan çemberin çevresi nedir?${PIQ}`, qe: `Find the circumference of a circle of radius $${R}$.${PIQE}`, ...int(2 * R) }; },
  b3_cuboid: (r) => { const l = ri(r, 2, 10), w = ri(r, 2, 8), h = ri(r, 2, 6); return { q: `Boyutları $${l}\\times ${w}\\times ${h}$ olan kutunun hacmi kaçtır?`, qe: `Find the volume of a cuboid measuring $${l}\\times ${w}\\times ${h}$.`, ...int(l * w * h) }; },
  b3_cyl: (r) => { const R = ri(r, 1, 6), h = ri(r, 2, 10); return { q: `Yarıçapı $${R}$, yüksekliği $${h}$ olan silindirin hacmi nedir?${PIQ}`, qe: `Find the volume of a cylinder with radius $${R}$ and height $${h}$.${PIQE}`, ...int(R * R * h) }; },
  b3_prism: (r) => { const A = ri(r, 3, 30), h = ri(r, 2, 15); return { q: `Kesit alanı $${A}$ cm², uzunluğu $${h}$ cm olan prizmanın hacmi kaç cm³?`, qe: `A prism has cross-section area $${A}$ cm² and length $${h}$ cm. Find its volume in cm³.`, ...int(A * h) }; },
  b3_cylcs: (r) => { const R = ri(r, 1, 8), h = ri(r, 2, 12); return { q: `Yarıçapı $${R}$, yüksekliği $${h}$ olan silindirin yanal yüzey alanı nedir?${PIQ}`, qe: `Find the curved surface area of a cylinder with radius $${R}$ and height $${h}$.${PIQE}`, ...int(2 * R * h) }; },
  b3_dist2: (r) => {
    const [a, b, c] = pick(r, TRIPLES), x1 = ri(r, -5, 5), y1 = ri(r, -5, 5), x2 = x1 + sg(r) * a, y2 = y1 + sg(r) * b;
    return { q: `$(${x1},\\ ${y1})$ ile $(${x2},\\ ${y2})$ arasındaki uzaklık kaçtır?`, qe: `Find the distance between $(${x1},\\ ${y1})$ and $(${x2},\\ ${y2})$.`, ...int(c) };
  },
  b3_mid2: (r) => {
    const x1 = ri(r, -8, 8), x2 = ri(r, -8, 8), y1 = ri(r, -8, 8), y2 = y1 + 2 * ri(r, -4, 4);
    const ask = r() < 0.5;
    return { q: `$(${x1},\\ ${y1})$ ve $(${x2},\\ ${y2})$ noktalarının orta noktasının ${ask ? "$x$" : "$y$"} koordinatı kaçtır?`, qe: `Find the ${ask ? "$x$" : "$y$"}-coordinate of the midpoint of $(${x1},\\ ${y1})$ and $(${x2},\\ ${y2})$.`, ...(ask ? fr(x1 + x2, 2) : int((y1 + y2) / 2)) };
  },
  b3_dist3: (r) => {
    const [a, b, c, d] = pick(r, T3), x1 = ri(r, -3, 3), y1 = ri(r, -3, 3), z1 = ri(r, -3, 3);
    const P = `(${x1},\\ ${y1},\\ ${z1})`, Q = `(${x1 + sg(r) * a},\\ ${y1 + sg(r) * b},\\ ${z1 + sg(r) * c})`;
    return { q: `$${P}$ ile $${Q}$ arasındaki uzaklık kaçtır?`, qe: `Find the distance between $${P}$ and $${Q}$.`, ...int(d) };
  },
  b3_mid3: (r) => {
    const z1 = ri(r, -8, 8), z2 = z1 + 2 * ri(r, -5, 5), x = ri(r, -5, 5), y = ri(r, -5, 5);
    return { q: `$(${x},\\ ${y},\\ ${z1})$ ve $(${y},\\ ${x},\\ ${z2})$ noktalarının orta noktasının $z$ koordinatı kaçtır?`, qe: `Find the $z$-coordinate of the midpoint of $(${x},\\ ${y},\\ ${z1})$ and $(${y},\\ ${x},\\ ${z2})$.`, ...int((z1 + z2) / 2) };
  },
  b3_pyr: (r) => { const A = ri(r, 4, 40), h = 3 * ri(r, 1, 6); return { q: `Taban alanı $${A}$, yüksekliği $${h}$ olan piramidin hacmi kaçtır?`, qe: `A pyramid has base area $${A}$ and height $${h}$. Find its volume.`, ...int(A * h / 3) }; },
  b3_cone: (r) => { const R = ri(r, 1, 6), h = 3 * ri(r, 1, 5); return { q: `Yarıçapı $${R}$, yüksekliği $${h}$ olan koninin hacmi nedir?${PIQ}`, qe: `Find the volume of a cone with radius $${R}$ and height $${h}$.${PIQE}`, ...int(R * R * h / 3) }; },
  b3_conecs: (r) => { const R = ri(r, 2, 9), l = R + ri(r, 1, 10); return { q: `Yarıçapı $${R}$, eğik yüksekliği $${l}$ olan koninin yanal yüzey alanı nedir?${PIQ}`, qe: `Find the curved surface area of a cone with radius $${R}$ and slant height $${l}$.${PIQE}`, ...int(R * l) }; },
  b3_sph: (r) => { const R = pick(r, [3, 6]); return { q: `Yarıçapı $${R}$ olan kürenin hacmi nedir?${PIQ}`, qe: `Find the volume of a sphere of radius $${R}$.${PIQE}`, ...int(4 * R ** 3 / 3) }; },
  b3_sphs: (r) => { const R = ri(r, 1, 10); return { q: `Yarıçapı $${R}$ olan kürenin yüzey alanı nedir?${PIQ}`, qe: `Find the surface area of a sphere of radius $${R}$.${PIQE}`, ...int(4 * R * R) }; },
  b3_sine: (r) => { const a = ri(r, 2, 15); return { q: `Bir üçgende $A=30^\\circ$, $B=90^\\circ$ ve $a=${a}$. $b$ kaçtır? ($\\sin 30^\\circ=\\tfrac12$)`, qe: `In a triangle $A=30^\\circ$, $B=90^\\circ$ and $a=${a}$. Find $b$. ($\\sin 30^\\circ=\\tfrac12$)`, ...int(2 * a) }; },
  b3_cos: (r) => { const a = ri(r, 2, 9), b = ri(r, 2, 9); return { q: `$a=${a}$, $b=${b}$, aradaki açı $C=60^\\circ$. $c^2$ kaçtır? ($\\cos 60^\\circ=\\tfrac12$)`, qe: `$a=${a}$, $b=${b}$ and the included angle $C=60^\\circ$. Find $c^2$. ($\\cos 60^\\circ=\\tfrac12$)`, ...int(a * a + b * b - a * b) }; },
  b3_cosC: (r) => {
    let a, b, c; do { a = ri(r, 2, 9); b = ri(r, 2, 9); c = ri(r, 2, 12); } while (c >= a + b || a >= b + c || b >= a + c);
    return { q: `Kenarları $a=${a}$, $b=${b}$, $c=${c}$ olan üçgende $\\cos C$ kaçtır? (kesir)`, qe: `A triangle has sides $a=${a}$, $b=${b}$, $c=${c}$. Find $\\cos C$ (as a fraction).`, ...fr(a * a + b * b - c * c, 2 * a * b) };
  },
  b3_area: (r) => { const a = ri(r, 2, 12), b = ri(r, 2, 12); return { q: `İki kenarı $${a}$ ve $${b}$, aradaki açı $30^\\circ$ olan üçgenin alanı kaçtır? ($\\sin 30^\\circ=\\tfrac12$)`, qe: `A triangle has sides $${a}$ and $${b}$ with $30^\\circ$ between them. Find its area. ($\\sin 30^\\circ=\\tfrac12$)`, ...fr(a * b, 4) }; },
  b3_arc: (r) => { const R = ri(r, 2, 20), t = pick(r, [0.5, 1, 1.5, 2, 2.5, 3]); return { q: `Yarıçap $${R}$, merkez açı $${String(t).replace(".", "{,}")}$ radyan. Yay uzunluğu kaçtır?`, qe: `Radius $${R}$, angle $${t}$ radians. Find the arc length.`, ...int(R * t) }; },
  b3_sector: (r) => { const R = 2 * ri(r, 1, 6), t = pick(r, [0.5, 1, 1.5, 2, 3]); return { q: `Yarıçap $${R}$, merkez açı $${String(t).replace(".", "{,}")}$ radyan. Dilimin alanı kaçtır?`, qe: `Radius $${R}$, angle $${t}$ radians. Find the area of the sector.`, ...int(R * R * t / 2) }; },
  b3_tan: (r) => { const [a, b, c] = pick(r, TRIPLES); return { q: `$\\sin\\theta=\\tfrac{${a}}{${c}}$ ve $\\cos\\theta=\\tfrac{${b}}{${c}}$ ise $\\tan\\theta$ kaçtır?`, qe: `If $\\sin\\theta=\\tfrac{${a}}{${c}}$ and $\\cos\\theta=\\tfrac{${b}}{${c}}$, find $\\tan\\theta$.`, ...fr(a, b) }; },
  b3_pyth: (r) => { const [a, , c] = pick(r, TRIPLES); return { q: `$\\sin\\theta=\\tfrac{${a}}{${c}}$ ise $\\cos^2\\theta$ kaçtır?`, qe: `If $\\sin\\theta=\\tfrac{${a}}{${c}}$, find $\\cos^2\\theta$.`, ...fr(c * c - a * a, c * c) }; },
  b3_sin2: (r) => { const [a, b, c] = pick(r, TRIPLES); return { q: `$\\sin\\theta=\\tfrac{${a}}{${c}}$, $\\cos\\theta=\\tfrac{${b}}{${c}}$ ise $\\sin 2\\theta$ kaçtır?`, qe: `If $\\sin\\theta=\\tfrac{${a}}{${c}}$ and $\\cos\\theta=\\tfrac{${b}}{${c}}$, find $\\sin 2\\theta$.`, ...fr(2 * a * b, c * c) }; },
  b3_cos2a: (r) => { const [a, b, c] = pick(r, TRIPLES); return { q: `$\\cos\\theta=\\tfrac{${b}}{${c}}$, $\\sin\\theta=\\tfrac{${a}}{${c}}$ ise $\\cos 2\\theta$ kaçtır?`, qe: `If $\\cos\\theta=\\tfrac{${b}}{${c}}$ and $\\sin\\theta=\\tfrac{${a}}{${c}}$, find $\\cos 2\\theta$.`, ...fr(b * b - a * a, c * c) }; },
  b3_cos2b: (r) => { const p = ri(r, 1, 4), q = p + ri(r, 1, 4); return { q: `$\\cos\\theta=\\tfrac{${p}}{${q}}$ ise $\\cos 2\\theta$ kaçtır?`, qe: `If $\\cos\\theta=\\tfrac{${p}}{${q}}$, find $\\cos 2\\theta$.`, ...fr(2 * p * p - q * q, q * q) }; },
  b3_cos2c: (r) => { const p = ri(r, 1, 4), q = p + ri(r, 1, 4); return { q: `$\\sin\\theta=\\tfrac{${p}}{${q}}$ ise $\\cos 2\\theta$ kaçtır?`, qe: `If $\\sin\\theta=\\tfrac{${p}}{${q}}$, find $\\cos 2\\theta$.`, ...fr(q * q - 2 * p * p, q * q) }; },
  b3_xd2r: (r) => { const d = pick(r, [30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 360]); return { q: `$${d}^\\circ$ kaç radyandır?${PIQ}`, qe: `Convert $${d}^\\circ$ to radians.${PIQE}`, ...fr(d, 180) }; },
  b3_xr2d: (r) => { const p = ri(r, 1, 11), q = pick(r, [2, 3, 4, 6]); return { q: `$\\dfrac{${p}\\pi}{${q}}$ radyan kaç derecedir?`, qe: `Convert $\\dfrac{${p}\\pi}{${q}}$ radians to degrees.`, ...int(p * 180 / q), unit: "°" }; },
  b3_xamp: (r) => { const a = ri(r, 1, 9) * sg(r), b = ri(r, 1, 5), d = ri(r, -6, 6); return { q: `$y=${a}\\sin(${b}x)${d < 0 ? d : "+" + d}$ eğrisinin genliği kaçtır?`, qe: `Find the amplitude of $y=${a}\\sin(${b}x)${d < 0 ? d : "+" + d}$.`, ...int(Math.abs(a)) }; },
  b3_xper: (r) => { const b = ri(r, 1, 8), a = ri(r, 1, 5); return { q: `$y=${a}\\sin(${b}x)$ eğrisinin periyodu nedir?${PIQ}`, qe: `Find the period of $y=${a}\\sin(${b}x)$.${PIQE}`, ...fr(2, b) }; },
  b3_xaxis: (r) => { const a = ri(r, 1, 6), d = ri(r, 1, 12); return { q: `Bir sinüs eğrisinin en büyük değeri $${d + a}$, en küçük değeri $${d - a}$. Asal eksen $y=d$ ise $d$ kaçtır?`, qe: `A sine curve has maximum $${d + a}$ and minimum $${d - a}$. The principal axis is $y=d$. Find $d$.`, ...int(d) }; },
  b3_xsol: (r) => { const [p, q] = pick(r, [[1, 6], [1, 4], [1, 3]]); return { q: `$\\sin x=k$ denkleminin bir çözümü $x=\\tfrac{${p}\\pi}{${q}}$. $[0,\\ 2\\pi)$ içindeki diğer çözüm nedir?${PIQ}`, qe: `One solution of $\\sin x=k$ is $x=\\tfrac{${p}\\pi}{${q}}$. Find the other solution in $[0,\\ 2\\pi)$.${PIQE}`, ...fr(q - p, q) }; },
  b3_xelev: (r) => { const [o, a] = pick(r, [[3, 4], [4, 3], [5, 12], [12, 5], [1, 1]]), k = ri(r, 2, 10); return { q: `Bir kuleye yatayda $${a * k}$ m uzaktan bakıyorsun; yükselme açısının tanjantı $\\tfrac{${o}}{${a}}$. Kule kaç m?`, qe: `You are $${a * k}$ m horizontally from a tower and the tangent of the angle of elevation is $\\tfrac{${o}}{${a}}$. How tall is the tower?`, ...int(o * k) }; },
  b3_xbear: (r) => { const b = ri(r, 1, 35) * 10; return { q: `$A$’dan $B$’nin kerterizi $${String(b).padStart(3, "0")}^\\circ$. $B$’den $A$’nın kerterizi kaç derecedir?`, qe: `The bearing of $B$ from $A$ is $${String(b).padStart(3, "0")}^\\circ$. Find the bearing of $A$ from $B$.`, ...int((b + 180) % 360), unit: "°" }; },
};
