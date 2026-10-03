/* FormUp v2 — parça "b2": Konu 2 · Fonksiyonlar (b2, kitapçık 2.1, 2.6, 2.7) + Fonksiyonlar: Kitapçık Dışı (x2).
   Kartlar öğretme sırasıyla (kolaydan zora). Biçim: content/SPEC.md */
import { ri, pick, fr, int, sgn } from "./genkit.js";

export const CARDS = String.raw`
## b2

# b2-grad | 3 | İki noktadan eğim | Gradient from two points
L m
R \dfrac{y_2-y_1}{x_2-x_1}
X \dfrac{x_2-x_1}{y_2-y_1} ;; \dfrac{y_2-y_1}{x_1-x_2} ;; \dfrac{y_2-x_2}{y_1-x_1}
K $(x_1,\ y_1)$ ve $(x_2,\ y_2)$: doğru üzerindeki iki nokta. $x_1\ne x_2$ olmalı; yoksa doğru dikeydir ve eğim tanımsızdır.
KE $(x_1,\ y_1)$ and $(x_2,\ y_2)$ are two points on the line, with $x_1\ne x_2$; otherwise the line is vertical and the gradient is undefined.
U Doğru üzerindeki iki noktanın koordinatlarından eğimi hesaplar.
UE Works out the gradient of a line from the coordinates of two points on it.
W Üstteki fark $y$’nin ne kadar değiştiğini (rise), alttaki fark $x$’in ne kadar değiştiğini (run) söyler. Eğim, rise bölü run’dır.
WE The top is the change in $y$ (the rise) and the bottom is the change in $x$ (the run), so this is rise over run.
E $(1,\ 2)$ ve $(4,\ 11)$: $m=\dfrac{11-2}{4-1}=\dfrac{9}{3}=3$.
H Üstte $y$’ler, altta $x$’ler; iki farka da aynı noktayla başla.
T gradient = eğim ;; coordinates = koordinatlar ;; change in y = $y$’deki değişim
Q Bir haritada dağ yolu, $(2,\ 100)$ noktasından $(6,\ 300)$ noktasına dümdüz tırmanıyor. Yolun ne kadar dik olduğunu tek bir sayıyla nasıl bulursun?
QE On a map, a mountain road climbs in a straight line from $(2,\ 100)$ to $(6,\ 300)$. How do you find one number that says how steep the road is?
B \dfrac{[[y_2-y_1]]}{[[x_2-x_1]]} || y_2+y_1 ;; x_1-x_2 ;; y_2-x_2
C x1=1:-10:10:1 ; y1=2:-10:10:1 ; x2=4:-10:10:1 ; y2=11:-10:20:1 => (y2-y1)/(x2-x1)
CT m=\dfrac{@y2@-@y1@}{@x2@-@x1@}=@=@
G b2_grad
LAB line
BK 2.1

# b2-mxc | 3 | Doğru denklemi: eğim–kesişim biçimi | Equation of a line: gradient–intercept form
L ~Eğimi $m$ olan, $y$ eksenini $(0,\ c)$’de kesen doğru
O :
R y=mx+c
X y=cx+m ;; x=my+c ;; y=m(x+c)
K $m$: eğim, $c$: $y$-kesişimi. Bu biçim dikey doğrular dışında her doğru için çalışır.
KE $m$ is the gradient and $c$ is the $y$-intercept. This form works for every line except vertical lines.
U Eğimini ve $y$ eksenini kestiği yeri bildiğin bir doğrunun denklemini hemen yazar.
UE Writes the equation of a line straight away when you know its gradient and its $y$-intercept.
W $(0,\ c)$’den başla. Sağa her $1$ adımda $y$, $m$ kadar değişir; $x$ adım sonra $mx$ kadar değişmiştir. Yani $y=c+mx$.
WE Start at $(0,\ c)$. Each step of $1$ to the right changes $y$ by $m$, so after $x$ steps $y=c+mx$.
E Eğim $2$, $y$-kesişimi $-3$: $y=2x-3$. $x=5$ iken $y=2\cdot 5-3=7$.
H $m$ “move” (ne kadar dik), $c$ “cross” ($y$ eksenini nerede kesiyor).
T gradient-intercept form = eğim–kesişim biçimi ;; gradient = eğim ;; y-intercept = $y$ eksenini kestiği nokta
Q Bir su deposunda başta $40$ litre su var; musluk açılınca her dakika $3$ litre ekleniyor. $x$ dakika sonraki su miktarını veren denklemi yazmak istiyorsun.
QE A tank holds $40$ litres of water at the start, and the tap adds $3$ litres every minute. You want an equation for the amount of water after $x$ minutes.
B y=[[m]]x+[[c]] || x ;; 1 ;; y
C m=2:-5:5:0.5 ; c=-3:-10:10:1 ; x=5:-10:10:1 => m*x+c
CT y=@m@\cdot @x@+@c@=@=@
G b2_mxc
LAB line
BK 2.1

# b2-point | 3 | Doğru denklemi: nokta–eğim biçimi | Equation of a line: point–gradient form
L ~$(x_1,\ y_1)$’den geçen, eğimi $m$ olan doğru
O :
R y-y_1=m(x-x_1)
X y+y_1=m(x+x_1) ;; y-x_1=m(x-y_1) ;; y-y_1=mx-x_1
K $(x_1,\ y_1)$: doğru üzerinde bilinen bir nokta, $m$: eğim. Önce $c$’yi bulmana gerek yok.
KE $(x_1,\ y_1)$ is a known point on the line and $m$ is the gradient. You do not need to find $c$ first.
U Bir noktasını ve eğimini bildiğin doğrunun denklemini tek adımda yazar.
UE Writes the equation of a line in one step from one point on it and its gradient.
W Doğru üzerindeki herhangi bir $(x,\ y)$ noktasını $(x_1,\ y_1)$ ile birleştir: eğim formülü $\dfrac{y-y_1}{x-x_1}=m$ der. İki tarafı $(x-x_1)$ ile çarp, formül çıkar.
WE Join any point $(x,\ y)$ on the line to $(x_1,\ y_1)$: the gradient formula gives $\dfrac{y-y_1}{x-x_1}=m$. Multiply both sides by $(x-x_1)$.
E $(2,\ 5)$’ten geçen, eğimi $3$ olan doğru: $y-5=3(x-2)$, yani $y=3x-1$.
H Nokta + eğim = denklem. Parantezlerin içinde hep eksi var.
T point-gradient form = nokta–eğim biçimi ;; passes through = içinden geçer ;; gradient = eğim
Q Haritada düz bir kayak pisti $(2,\ 5)$ noktasından geçiyor ve sağa her $1$ birimde $3$ birim alçalıyor. Pistin üzerinde bulunduğu doğrunun denklemini yazmak istiyorsun.
QE On a map, a straight ski run passes through $(2,\ 5)$ and drops $3$ units for every $1$ unit to the right. You want the equation of the line it lies on.
B y-[[y_1]]=[[m]](x-[[x_1]]) || c ;; -m ;; x_2
C x1=2:-10:10:1 ; y1=5:-10:10:1 ; m=3:-5:5:0.5 ; x=4:-10:10:1 => y1+m*(x-x1)
CT y=@y1@+@m@(@x@-@x1@)=@=@
G b2_point
LAB line
BK 2.1

# b2-general | 2 | Doğrunun genel biçimi $ax+by+d=0$ | General form of a line $ax+by+d=0$
L ax+by+d=0
O \Rightarrow
R m=-\dfrac{a}{b}
X m=\dfrac{a}{b} ;; m=-\dfrac{b}{a} ;; m=a
K $a$, $b$, $d$ sabit sayılar (IB’de genelde tam sayı) ve $b\ne 0$. $b=0$ ise doğru dikeydir: $x=-\tfrac{d}{a}$.
KE $a$, $b$ and $d$ are constants (usually integers in IB) and $b\ne 0$. If $b=0$ the line is vertical: $x=-\tfrac{d}{a}$.
U Kesirsiz, toplu yazılmış bir doğru denkleminden eğimi okur.
UE Reads the gradient from a line written neatly in general form, with no fractions.
W $y$’yi yalnız bırak: $by=-ax-d$, yani $y=-\dfrac{a}{b}x-\dfrac{d}{b}$. Artık $y=mx+c$ biçiminde; $x$’in katsayısı eğimdir.
WE Make $y$ the subject: $y=-\dfrac{a}{b}x-\dfrac{d}{b}$. Now it is in the form $y=mx+c$, so the coefficient of $x$ is the gradient.
E $2x+3y-6=0$: $3y=-2x+6$, yani $y=-\tfrac{2}{3}x+2$. Eğim $-\tfrac{2}{3}$, $y$-kesişimi $2$.
H Eğim = eksi ($x$’in katsayısı) bölü ($y$’nin katsayısı).
T general form = genel biçim ;; coefficient = katsayı ;; gradient = eğim
Q Bir mühendislik çiziminde bir rampanın kenarı $2x+3y-6=0$ denklemiyle verilmiş. Rampanın eğimini bulmak istiyorsun.
QE In an engineering drawing the edge of a ramp is given by $2x+3y-6=0$. You want to find the gradient of the ramp.
B m=-\dfrac{[[a]]}{[[b]]} || d ;; x ;; y
C a=2:-10:10:1 ; b=3:1:10:1 ; d=-6:-20:20:1 => -a/b
CT @a@x+@b@y+@d@=0\ \Rightarrow\ m=-\dfrac{@a@}{@b@}=@=@
G b2_general
LAB line
BK 2.1

# b2-axis | 3 | Parabolün simetri ekseni | Axis of symmetry of a parabola
L x
R -\dfrac{b}{2a}
X \dfrac{b}{2a} ;; -\dfrac{b}{a} ;; -\dfrac{2a}{b}
K $f(x)=ax^2+bx+c$ ve $a\ne 0$. Simetri ekseni dikey bir doğrudur; tepe noktası (vertex) bu doğrunun üzerindedir.
KE $f(x)=ax^2+bx+c$ with $a\ne 0$. The axis of symmetry is a vertical line, and the vertex lies on it.
U Parabolü iki eşit yarıya bölen dikey doğruyu, yani tepe noktasının $x$ değerini bulur.
UE Finds the vertical line that splits a parabola into two mirror halves, which gives the $x$-coordinate of the vertex.
W Parabolü bu doğrudan katlarsan iki yarısı tam üst üste gelir. Kökler varsa eksen tam ortalarındadır: $\dfrac{x_1+x_2}{2}=-\dfrac{b}{2a}$.
WE Fold the parabola along this line and the two halves match exactly. If there are roots, the axis is halfway between them, at $-\dfrac{b}{2a}$.
E $f(x)=x^2-6x+5$: $x=-\dfrac{-6}{2\cdot 1}=3$. Tepe noktası $(3,\ f(3))=(3,\ -4)$.
H “Eksi $b$, bölü iki $a$.” İşaretlere dikkat: $a=1$, $b=-6$ ise $x=-\dfrac{-6}{2}=3$.
T axis of symmetry = simetri ekseni ;; vertex = tepe noktası ;; quadratic function = ikinci dereceden fonksiyon
Q Bir fıskiyeden çıkan su $y=-x^2+6x$ eğrisini çiziyor ($x$: metre). Su yatayda kaç metre gidince en yüksek noktasına ulaşır?
QE Water from a fountain follows the curve $y=-x^2+6x$, with $x$ in metres. How far horizontally does the water travel before it reaches its highest point?
B -\dfrac{[[b]]}{[[2a]]} || a ;; 2b ;; c
C a=1:-5:5:2 ; b=-6:-12:12:1 => -b/(2*a)
CT x=-\dfrac{@b@}{2\cdot @a@}=@=@
G b2_axis
LAB parabola
BK 2.6

# b2-disc | 3 | Diskriminant $\Delta$ | The discriminant $\Delta$
L \Delta
R b^2-4ac
X b^2+4ac ;; 4ac-b^2 ;; \sqrt{b^2-4ac}
K $a$, $b$, $c$: $ax^2+bx+c=0$ denkleminin katsayıları, $a\ne 0$. $\Delta$ (delta) tek bir sayıdır: kökleri değil, kaç gerçek kök olduğunu söyler.
KE $a$, $b$ and $c$ are the coefficients of $ax^2+bx+c=0$, with $a\ne 0$. $\Delta$ is a single number that tells you how many real roots there are, not what they are.
U İkinci dereceden bir denklemi çözmeden kaç gerçek kökü olduğunu söyler.
UE Tells you how many real roots a quadratic equation has without solving it.
W Kök formülünde karekökün içinde duran kısım budur. İçi pozitifse iki kök, sıfırsa bir kök çıkar; negatifse gerçek kök çıkmaz.
WE It is the part under the square root in the quadratic formula: positive gives two roots, zero gives one, and negative gives no real roots.
E $x^2-5x+6=0$: $\Delta=(-5)^2-4\cdot 1\cdot 6=25-24=1>0$, yani iki farklı kök var.
H “Be kare eksi dört a ce.” Negatif $b$’yi paranteze al: $(-5)^2=25$.
T discriminant = diskriminant ;; coefficient = katsayı ;; real roots = gerçek kökler
Q Bir mühendis, $2x^2-3x+4=0$ denkleminin çözümü olup olmadığını denklemi çözmeden, tek bir sayı hesaplayarak anlamak istiyor.
QE An engineer wants to know whether $2x^2-3x+4=0$ has any solutions by working out a single number, without solving it.
B [[b^2]]-[[4ac]] || 2b ;; 2ac ;; 4a
C a=1:-5:5:2 ; b=-5:-10:10:1 ; c=6:-10:10:1 => b^2-4*a*c
CT \Delta=@b@^2-4\cdot @a@\cdot @c@=@=@
G b2_disc
LAB parabola
BK 2.7

# b2-quad | 3 | Kök formülü | The quadratic formula
L x
R \dfrac{-b\pm\sqrt{b^2-4ac}}{2a}
X \dfrac{b\pm\sqrt{b^2-4ac}}{2a} ;; \dfrac{-b\pm\sqrt{b^2+4ac}}{2a} ;; -b\pm\dfrac{\sqrt{b^2-4ac}}{2a}
K $ax^2+bx+c=0$ ve $a\ne 0$. Önce denklemi “$=0$” biçimine getir. $\pm$: bir kez $+$ ile, bir kez $-$ ile hesapla. $b^2-4ac<0$ ise gerçek kök yoktur.
KE For $ax^2+bx+c=0$ with $a\ne 0$. First rearrange the equation so that one side is $0$. Work it out once with $+$ and once with $-$. If $b^2-4ac<0$ there are no real roots.
U Çarpanlarına ayrılamayanlar dahil, her ikinci dereceden denklemin köklerini bulur.
UE Solves any quadratic equation, even one that does not factorize.
W Formül, $ax^2+bx+c=0$ denkleminde tam kareye tamamlayıp $x$’i yalnız bırakınca çıkar. Kökler, simetri ekseni $x=-\dfrac{b}{2a}$’nın iki yanında eşit uzaklıkta durur.
WE It comes from completing the square on $ax^2+bx+c=0$. The roots sit the same distance either side of the axis of symmetry $x=-\dfrac{b}{2a}$.
E $x^2-5x+6=0$: $x=\dfrac{5\pm\sqrt{25-24}}{2}=\dfrac{5\pm 1}{2}$, yani $x=3$ ya da $x=2$.
H “Eksi be, artı-eksi kök içinde be kare eksi dört a ce, hepsi bölü iki a.”
T quadratic formula = kök formülü ;; quadratic equation = ikinci dereceden denklem ;; roots = kökler
Q Bir top $h=-5t^2+20t+1$ metre yükseklikte uçuyor. Top yere ($h=0$) ne zaman düşer? Denklem kolayca çarpanlarına ayrılmıyor.
QE A ball is at height $h=-5t^2+20t+1$ metres. When does it hit the ground ($h=0$)? The equation does not factorize easily.
B \dfrac{[[-b]]\pm\sqrt{[[b^2-4ac]]}}{[[2a]]} || b ;; b^2+4ac ;; a
C a=1:-3:3:2 ; b=-5:-12:12:1 ; c=6:-10:6:1 => (-b+sqrt(b^2-4*a*c))/(2*a)
CT x_1=\dfrac{-@b@+\sqrt{@b@^2-4\cdot @a@\cdot @c@}}{2\cdot @a@}=@=@
G b2_quad
LAB parabola
BK 2.7
S Babilliler yaklaşık $4000$ yıl önce kil tabletlerde ikinci dereceden problemler çözüyordu. 9. yüzyılda Harezmî bu denklemleri kareyi tamamlayarak, adım adım çözdü.

## x2

# x2-parallel | 3 | Paralel doğrular | Parallel lines
L ~İki doğru paraleldir
O \iff
R m_1=m_2
X m_1\cdot m_2=-1 ;; m_1=-m_2 ;; m_1=\dfrac{1}{m_2}
K $m_1$, $m_2$: iki doğrunun eğimleri. Paralel doğrular hiç kesişmez; aynı doğru değillerse $y$-kesişimleri farklıdır.
KE $m_1$ and $m_2$ are the gradients of the two lines. Parallel lines never meet; unless they are the same line, their $y$-intercepts are different.
U Bir doğruya paralel olan her doğrunun eğimini hemen verir.
UE Gives you the gradient of any line parallel to a given line.
W Paralel doğrular tren rayları gibi aynı yöne, aynı diklikte gider. Aynı diklik, aynı eğim demektir.
WE Parallel lines run in the same direction with the same steepness, like railway tracks, so their gradients are equal.
E $y=3x+1$’e paralel olan ve $(0,\ 5)$’ten geçen doğru: $y=3x+5$.
H Paralel doğrular ikizdir: eğimleri aynı.
T parallel = paralel ;; parallel lines = paralel doğrular ;; gradient = eğim
Q Bir parkta $y=2x+1$ doğrusu boyunca bir yol var. Yanına, onunla hiç kesişmeyecek ikinci bir düz yol yapılacak. Yeni yolun eğimi ne olmalı?
QE A park has a path along the line $y=2x+1$. A second straight path is to be built next to it so that the two never meet. What gradient must the new path have?
B m_1=[[m_2]] || -m_2 ;; \dfrac{1}{m_2} ;; -1
G b2_parallel
LAB line

# x2-perp | 3 | Dik doğrular | Perpendicular lines
L ~İki doğru birbirine diktir
O \iff
R m_1\cdot m_2=-1
X m_1=m_2 ;; m_1\cdot m_2=1 ;; m_1=-m_2
K $m_1$, $m_2$: eğimler; ikisi de $0$ değil. Yani $m_2=-\dfrac{1}{m_1}$: eğimi ters çevir, işaretini değiştir.
KE $m_1$ and $m_2$ are the gradients, neither of them $0$. So $m_2=-\dfrac{1}{m_1}$: take the reciprocal and change the sign.
U Bir doğruya dik ($90^\circ$) olan doğrunun eğimini bulur.
UE Finds the gradient of a line at right angles ($90^\circ$) to a given line.
W Bir doğruyu $90^\circ$ döndürünce yatay ve dikey adımlar yer değiştirir, biri de ters yöne döner. Eğim $\tfrac{2}{3}$ iken $-\tfrac{3}{2}$ olur.
WE Turning a line through $90^\circ$ swaps the rise and the run and reverses one of them, so a gradient of $\tfrac{2}{3}$ becomes $-\tfrac{3}{2}$.
E $y=2x+1$’e dik doğrunun eğimi $-\tfrac{1}{2}$. Kontrol: $2\cdot\left(-\tfrac{1}{2}\right)=-1$.
H Dik doğru: ters çevir, işaret değiştir.
T perpendicular = dik ;; negative reciprocal = işareti değişmiş çarpmaya göre ters ;; right angle = dik açı
Q Haritada bir cadde $y=2x+1$ doğrusu boyunca uzanıyor. Bu caddeyi tam $90^\circ$ ile kesecek yeni bir sokak açılacak. Sokağın eğimi kaç olmalı?
QE On a map a main road runs along the line $y=2x+1$. A new street will cross it at exactly $90^\circ$. What gradient must the street have?
B m_1\cdot m_2=[[-1]] || 1 ;; 0
C m1=2:-5:5:0.5 => -1/m1
CT m_2=-\dfrac{1}{@m1@}=@=@
G b2_perp
LAB line

# x2-quad-yint | 3 | Parabolün $y$-kesişimi | The $y$-intercept of a quadratic
L ~$y=ax^2+bx+c$ grafiğinin $y$-kesişimi
O :
R (0,\ c)
X (c,\ 0) ;; (0,\ a) ;; \left(0,\ -\dfrac{b}{2a}\right)
K $a\ne 0$. $c$, sabit terimdir: yanında $x$ olmayan sayı.
KE $a\ne 0$. $c$ is the constant term: the number with no $x$ next to it.
U Parabolün $y$ eksenini kestiği noktayı hiç hesap yapmadan okur.
UE Reads off where a parabola crosses the $y$-axis with no working.
W $y$ ekseni üzerinde $x=0$’dır. $x=0$ koyunca $a\cdot 0^2+b\cdot 0+c=c$ kalır.
WE On the $y$-axis $x=0$, and putting $x=0$ leaves $a\cdot 0^2+b\cdot 0+c=c$.
E $y=2x^2-3x+7$ grafiği $y$ eksenini $(0,\ 7)$’de keser.
H Sondaki yalnız sayı ($c$), $y$ eksenindeki kapıdır.
T y-intercept = $y$ eksenini kestiği nokta ;; constant term = sabit terim ;; quadratic = ikinci dereceden
Q Bir topun yüksekliği $h=-5t^2+10t+2$ metre ($t$: saniye). Top atıldığı anda yerden kaç metre yükseklikteydi?
QE The height of a ball is $h=-5t^2+10t+2$ metres, with $t$ in seconds. How high above the ground was it at the moment it was thrown?
B (0,\ [[c]]) || a ;; b ;; 0
C a=2:-5:5:1 ; b=-3:-10:10:1 ; c=7:-10:10:1 => a*0^2+b*0+c
CT f(0)=@a@\cdot 0^2+@b@\cdot 0+@c@=@=@
G b2_yint
LAB parabola

# x2-vertex | 3 | Tepe noktası: önce $x$, sonra $y$ | Finding the vertex: first $x$, then $y$
L ~$f(x)=ax^2+bx+c$ parabolünün tepe noktası
O :
R \left(-\dfrac{b}{2a},\ f\!\left(-\dfrac{b}{2a}\right)\right)
X \left(\dfrac{b}{2a},\ f\!\left(\dfrac{b}{2a}\right)\right) ;; \left(-\dfrac{b}{2a},\ c\right) ;; \left(f\!\left(-\dfrac{b}{2a}\right),\ -\dfrac{b}{2a}\right)
K $a\ne 0$. $a>0$ ise tepe noktası en alçak noktadır (minimum), $a<0$ ise en yüksek noktadır (maksimum).
KE $a\ne 0$. If $a>0$ the vertex is the lowest point (minimum); if $a<0$ it is the highest point (maximum).
U Bir parabolün en alçak ya da en yüksek noktasını bulur; “en çok” ve “en az” sorularının anahtarıdır.
UE Finds the lowest or highest point of a parabola, the key to “maximum” and “minimum” problems.
W Tepe noktası simetri ekseninin üzerindedir; $x$’ini eksenden alırsın. Yüksekliğini ($y$) bulmak için bu $x$’i fonksiyona koyarsın.
WE The vertex lies on the axis of symmetry, so its $x$-coordinate comes from the axis; put that $x$ into the function to get its height $y$.
E $f(x)=x^2-6x+5$: $x=3$, $f(3)=9-18+5=-4$. Tepe noktası $(3,\ -4)$, en küçük değer $-4$.
H Önce eksen ($x$), sonra yerine koy ($y$).
T vertex = tepe noktası ;; maximum value = en büyük değer ;; minimum value = en küçük değer
Q Bir topun yüksekliği $h=-t^2+6t+2$ metre ($t$: saniye). Top en fazla kaç metre yükseğe çıkar?
QE The height of a ball is $h=-t^2+6t+2$ metres, with $t$ in seconds. What is the greatest height the ball reaches?
B \left([[-\dfrac{b}{2a}]],\ f\!\left(-\dfrac{b}{2a}\right)\right) || \dfrac{b}{2a} ;; -\dfrac{b}{a} ;; c
C a=1:-5:5:2 ; b=-6:-12:12:1 ; c=5:-10:10:1 => c-b^2/(4*a)
CT f\!\left(-\tfrac{@b@}{2\cdot @a@}\right)=@=@
G b2_vertex
LAB parabola

# x2-vform | 3 | Tepe noktası biçimi $a(x-h)^2+k$ | Vertex form $a(x-h)^2+k$
L ~$y=a(x-h)^2+k$ grafiğinin tepe noktası
O :
R (h,\ k)
X (-h,\ k) ;; (h,\ -k) ;; (k,\ h)
K $a\ne 0$. Simetri ekseni $x=h$’dir. Parantezin içindeki işarete dikkat: $(x-3)^2$ için $h=3$, $(x+3)^2$ için $h=-3$.
KE $a\ne 0$, and the axis of symmetry is $x=h$. Watch the sign inside the bracket: $(x-3)^2$ gives $h=3$, while $(x+3)^2$ gives $h=-3$.
U Parabolün tepe noktasını ve simetri eksenini hiç hesap yapmadan okur.
UE Reads off the vertex and the axis of symmetry with no working.
W Bir sayının karesi en az $0$’dır ve $x=h$ iken $(x-h)^2=0$ olur. Orada $y=k$’dir; parabol tam orada döner.
WE A square is never negative and $(x-h)^2=0$ when $x=h$, so at $x=h$ the value is $y=k$ and the parabola turns there.
E $y=2(x-3)^2+1$: tepe $(3,\ 1)$. $y=-(x+2)^2+5$: tepe $(-2,\ 5)$ ve en büyük değer $5$.
H Parantezin içi işareti ters söyler, dışarıdaki sayı doğru söyler.
T vertex form = tepe noktası biçimi ;; vertex = tepe noktası ;; axis of symmetry = simetri ekseni
Q Bir köprünün kemeri $y=-0{,}5(x-4)^2+8$ eğrisini izliyor. Kemerin en yüksek noktası nerede ve kaç metre yükseklikte?
QE A bridge arch follows the curve $y=-0.5(x-4)^2+8$. Where is the highest point of the arch, and how high is it?
B ([[h]],\ [[k]]) || -h ;; -k ;; a
C a=2:-3:3:0.5 ; h=3:-5:5:1 ; k=1:-5:5:1 ; x=4:-5:5:1 => a*(x-h)^2+k
CT y=@a@(@x@-@h@)^2+@k@=@=@
G b2_vform
LAB parabola

# x2-fform | 3 | Çarpan biçimi $a(x-p)(x-q)$ | Intercept form $a(x-p)(x-q)$
L ~$y=a(x-p)(x-q)$ grafiğinin $x$-kesişimleri
O :
R (p,\ 0),\ (q,\ 0)
X (-p,\ 0),\ (-q,\ 0) ;; (0,\ p),\ (0,\ q) ;; (a,\ 0),\ (p,\ 0)
K $a\ne 0$. Simetri ekseni iki kökün tam ortasıdır: $x=\dfrac{p+q}{2}$. İşarete dikkat: $(x+2)$ çarpanı $x=-2$ kökünü verir.
KE $a\ne 0$. The axis of symmetry is halfway between the roots: $x=\dfrac{p+q}{2}$. Watch the sign: a factor $(x+2)$ gives the root $x=-2$.
U Parabolün $x$ eksenini kestiği yerleri hiç hesap yapmadan okur.
UE Reads off where a parabola crosses the $x$-axis with no working.
W $x=p$ koyunca $(x-p)=0$ olur; sıfır çarpı her şey sıfırdır, yani $y=0$. Aynısı $x=q$ için de geçerli.
WE At $x=p$ the factor $(x-p)$ is $0$, and $0$ times anything is $0$, so $y=0$; the same happens at $x=q$.
E $y=2(x-1)(x-5)$: $(1,\ 0)$ ve $(5,\ 0)$. Simetri ekseni $x=\dfrac{1+5}{2}=3$.
H Her parantezi sıfır yapan sayı bir köktür.
T x-intercept = $x$ eksenini kestiği nokta ;; intercept form = çarpan (kesişim) biçimi ;; root = kök
Q Bir yunusun sıçrayışı $y=-2(x-1)(x-5)$ ile modelleniyor ($y=0$: su yüzeyi). Yunus sudan hangi noktada çıkar ve hangi noktada suya geri girer?
QE A dolphin’s jump is modelled by $y=-2(x-1)(x-5)$, where $y=0$ is the surface of the water. Where does it leave the water and where does it go back in?
B ([[p]],\ 0),\ (q,\ 0) || -p ;; a ;; 0
C a=2:-3:3:0.5 ; p=1:-5:5:1 ; q=5:-5:5:1 ; x=3:-5:5:1 => a*(x-p)*(x-q)
CT y=@a@(@x@-@p@)(@x@-@q@)=@=@
G b2_fform
LAB parabola

# x2-disc-pos | 3 | $\Delta>0$: iki farklı gerçek kök | $\Delta>0$: two distinct real roots
L \Delta>0
O \Rightarrow
R ~İki farklı gerçek kök
X ~Tek (çift katlı) kök ;; ~Gerçek kök yok ;; ~Sonsuz sayıda kök
K $\Delta=b^2-4ac$; denklem $ax^2+bx+c=0$ ve $a\ne 0$. Grafik $x$ eksenini iki farklı noktada keser.
KE $\Delta=b^2-4ac$ for $ax^2+bx+c=0$ with $a\ne 0$. The equation has two distinct real roots, so the graph crosses the $x$-axis at two different points.
U Bir denklemin iki farklı çözümü olduğunu, çözmeden anlar.
UE Shows that a quadratic equation has two different solutions without solving it.
W Kök formülünde $\pm\sqrt{\Delta}$ var. $\Delta>0$ ise $+\sqrt{\Delta}$ ile $-\sqrt{\Delta}$ farklı sayılardır, bu yüzden iki ayrı kök çıkar.
WE The quadratic formula contains $\pm\sqrt{\Delta}$. When $\Delta>0$, adding and subtracting $\sqrt{\Delta}$ give two different roots.
E $x^2-5x+6=0$: $\Delta=25-24=1>0$. Kökler $2$ ve $3$.
H Pozitif delta: parabol $x$ eksenini iki kez keser.
T two distinct real roots = iki farklı gerçek kök ;; discriminant = diskriminant ;; distinct = farklı
Q $x^2+6x+k=0$ denkleminin iki farklı çözümü olması için $k$ hangi sayıdan küçük olmalı?
QE For $x^2+6x+k=0$ to have two different solutions, $k$ must be less than which number?
C a=1:-5:5:2 ; b=-5:-10:10:1 ; c=6:-10:10:1 => b^2-4*a*c>0
CT \Delta=@b@^2-4\cdot @a@\cdot @c@>0\ :\ @=@
G b2_dpos
LAB parabola

# x2-disc-zero | 3 | $\Delta=0$: iki eşit gerçek kök | $\Delta=0$: two equal real roots
L \Delta=0
O \Rightarrow
R ~İki eşit gerçek kök (tek kök)
X ~İki farklı gerçek kök ;; ~Gerçek kök yok ;; ~Tek kök var ve o kök $0$
K Buna çift katlı kök (repeated root) da denir. Kök $x=-\dfrac{b}{2a}$’dır; grafik $x$ eksenine tepe noktasında dokunur.
KE When $\Delta=0$ there are two equal real roots, also called a repeated root: $x=-\dfrac{b}{2a}$. The graph touches the $x$-axis at its vertex.
U Bir parabolün $x$ eksenine tek bir noktada değip geçtiğini anlar.
UE Shows when a parabola just touches the $x$-axis at a single point.
W $\Delta=0$ ise $\pm\sqrt{0}=0$ olur; artı ile eksi aynı sonucu verir. İki kök üst üste biner.
WE When $\Delta=0$, $\pm\sqrt{0}=0$, so plus and minus give the same answer and the two roots coincide.
E $x^2-6x+9=0$: $\Delta=36-36=0$. Tek kök $x=3$, çünkü $(x-3)^2=0$.
H Sıfır delta: parabol eksene sadece dokunur, öpüp geçer.
T equal roots = eşit kökler ;; repeated root = çift katlı kök ;; tangent = teğet
Q $x^2+kx+9=0$ denkleminin tam olarak bir çözümü var ve $k$ pozitif. $k$ kaç olmalı?
QE The equation $x^2+kx+9=0$ has exactly one solution and $k$ is positive. What must $k$ be?
C a=1:-5:5:2 ; b=4:-10:10:1 ; c=4:-10:10:1 => b^2-4*a*c==0
CT \Delta=@b@^2-4\cdot @a@\cdot @c@=0\ :\ @=@
G b2_dzero
LAB parabola

# x2-disc-neg | 3 | $\Delta<0$: gerçek kök yok | $\Delta<0$: no real roots
L \Delta<0
O \Rightarrow
R ~Gerçek kök yok
X ~İki farklı gerçek kök ;; ~İki eşit gerçek kök ;; ~İki negatif kök
K Grafik $x$ eksenini hiç kesmez: $a>0$ ise tamamen eksenin üstünde, $a<0$ ise tamamen altındadır.
KE There are no real roots, so the graph never meets the $x$-axis: it lies entirely above it if $a>0$ and entirely below it if $a<0$.
U Bir denklemin hiç gerçek çözümü olmadığını, çözmeden anlar.
UE Shows that a quadratic equation has no real solutions without solving it.
W Kök formülü $\sqrt{\Delta}$ ister. Hiçbir gerçek sayının karesi negatif olmadığı için negatif sayının gerçek karekökü yoktur.
WE The formula needs $\sqrt{\Delta}$, and a negative number has no real square root because no real number squared is negative.
E $x^2+2x+5=0$: $\Delta=4-20=-16<0$. Gerçek kök yok; grafik hep eksenin üstünde.
H Negatif delta: parabol eksene hiç uğramaz.
T no real roots = gerçek kök yok ;; discriminant = diskriminant ;; negative = negatif
Q $y=x^2+2x+k$ parabolünün $x$ eksenine hiç değmemesi için $k$ hangi sayıdan büyük olmalı?
QE For the parabola $y=x^2+2x+k$ never to touch the $x$-axis, $k$ must be greater than which number?
C a=1:-5:5:2 ; b=2:-10:10:1 ; c=5:-10:10:1 => b^2-4*a*c<0
CT \Delta=@b@^2-4\cdot @a@\cdot @c@<0\ :\ @=@
G b2_dneg
LAB parabola

# x2-comp | 3 | Bileşke fonksiyon | Composite function
L (f\circ g)(x)
R f(g(x))
X g(f(x)) ;; f(x)\cdot g(x) ;; f(x)+g(x)
K Önce $g$, sonra $f$ uygulanır: sağdaki fonksiyon ilk çalışır. Genelde $f\circ g\ne g\circ f$.
KE Apply $g$ first, then $f$: the function on the right acts first. In general $f\circ g\ne g\circ f$.
U İki fonksiyonu art arda uygulayıp tek bir fonksiyon yapar.
UE Combines two functions by applying one after the other.
W İki makine düşün: $x$ önce $g$ makinesine girer, çıkan $g(x)$ hemen $f$ makinesine girer. Sonuç $f(g(x))$ olur.
WE Think of two machines: $x$ goes into $g$, and the output $g(x)$ goes straight into $f$, giving $f(g(x))$.
E $f(x)=2x+1$, $g(x)=x^2$: $(f\circ g)(3)=f(9)=19$, ama $(g\circ f)(3)=g(7)=49$.
H İçten dışa: en içteki parantez önce çalışır.
T composite function = bileşke fonksiyon ;; composition = bileşke işlemi ;; output = çıktı
Q Bir mağaza önce fiyata $20$ TL ekliyor, sonra çıkan fiyata $\%10$ indirim yapıyor. İki kuralı tek bir fiyat kuralında birleştirmek istiyorsun.
QE A shop first adds $20$ lira to a price and then takes $10\%$ off the result. You want to combine the two rules into one pricing rule.
B [[f]]([[g]](x)) || x ;; h ;; f\cdot g
C a=2:-5:5:1 ; b=1:-10:10:1 ; x=3:-5:5:1 => a*x^2+b
CT f(x)=@a@x+@b@,\ g(x)=x^2:\quad f(g(@x@))=@a@\cdot @x@^2+@b@=@=@
G b2_comp

# x2-identity | 2 | Birim (özdeşlik) fonksiyon | The identity function
L ~Birim fonksiyon $I$ (identity function)
O :
R I(x)=x
X I(x)=1 ;; I(x)=0 ;; I(x)=-x
K Grafiği $y=x$ doğrusudur. Her $f$ için $(f\circ I)(x)=(I\circ f)(x)=f(x)$.
KE Its graph is the line $y=x$. For every function $f$, $(f\circ I)(x)=(I\circ f)(x)=f(x)$.
U Hiçbir şeyi değiştirmeyen fonksiyonu tanımlar; ters fonksiyonu anlamanın anahtarıdır.
UE Describes the function that changes nothing, which is the key to understanding inverse functions.
W Ne koyarsan aynısı çıkar: $5$ girer, $5$ çıkar. Bu yüzden bir fonksiyonu birim fonksiyonla birleştirmek onu hiç değiştirmez.
WE Whatever goes in comes out unchanged, so composing a function with the identity leaves it exactly as it was.
E $I(7)=7$, $I(-2)=-2$. $f(x)=3x$ ise $(f\circ I)(4)=f(4)=12$.
H Birim fonksiyon = “hiçbir şey yapma” düğmesi.
T identity function = birim (özdeşlik) fonksiyon ;; composite function = bileşke fonksiyon ;; unchanged = değişmeden
Q Bir hesap makinesi uygulamasında, yazdığın sayıyı hiç değiştirmeden ekrana basan bir düğme var. Bu düğmenin kuralını bir fonksiyon olarak yazmak istiyorsun.
QE A calculator app has a button that shows the number you type without changing it at all. You want to write this button’s rule as a function.
B I(x)=[[x]] || 1 ;; 0 ;; -x
G b2_identity

# x2-inv-undo | 3 | Ters fonksiyon geri alır | An inverse function undoes the function
L (f\circ f^{-1})(x)
R x
X 1 ;; 0 ;; f(x)
K Aynı şekilde $(f^{-1}\circ f)(x)=x$. Dikkat: $f^{-1}(x)$, $\dfrac{1}{f(x)}$ demek değildir! Yalnızca birebir (one-to-one) fonksiyonların tersi vardır.
KE Likewise $(f^{-1}\circ f)(x)=x$. Careful: $f^{-1}(x)$ does not mean $\dfrac{1}{f(x)}$! Only one-to-one functions have an inverse.
U Ters fonksiyonun, fonksiyonun yaptığını tam olarak geri aldığını söyler.
UE Says that the inverse function exactly undoes what the function does.
W $f$ “$2$ ile çarp, $3$ ekle” ise $f^{-1}$ “$3$ çıkar, $2$’ye böl” der. Biri yapar, öbürü geri alır; başladığın sayıya dönersin.
WE If $f$ means “multiply by $2$, then add $3$”, then $f^{-1}$ means “subtract $3$, then divide by $2$”: one undoes the other, so you get back to where you started.
E $f(x)=2x+3$ ise $f(4)=11$ ve $f^{-1}(11)=4$. Yani $f^{-1}(f(4))=4$.
H Ters fonksiyon, fonksiyonun “geri al” (Ctrl+Z) tuşudur.
T inverse function = ters fonksiyon ;; one-to-one = birebir ;; identity function = birim fonksiyon
Q Bir şifreleme kuralı her harfin numarasını $2$ ile çarpıp $3$ ekliyor. Şifreyi çözen kuralı şifreleyen kuralın hemen ardından uygularsan elinde ne kalır?
QE An encoding rule multiplies each letter’s number by $2$ and adds $3$. If you apply the decoding rule straight after the encoding rule, what are you left with?
B [[x]] || 1 ;; 0 ;; f(x)
C a=2:1:6:1 ; b=3:-10:10:1 ; x=11:-20:20:1 => a*((x-b)/a)+b
CT f(x)=@a@x+@b@:\quad f^{-1}(@x@)=\dfrac{@x@-@b@}{@a@},\quad f\big(f^{-1}(@x@)\big)=@=@
G b2_invundo

# x2-inv-find | 3 | Ters fonksiyonu bulma | Finding an inverse function
L ~$y=f(x)$’ten $f^{-1}(x)$’i bulmak için
O :
R ~$x$ ile $y$’yi yer değiştir, sonra $y$’yi yalnız bırak
X ~$1$’i $f(x)$’e böl ;; ~Tüm işaretleri tersine çevir ;; ~$x$ yerine $-x$ yaz
K Son adımda $y$ yerine $f^{-1}(x)$ yaz. $f^{-1}$’in tanım kümesi, $f$’in görüntü kümesidir.
KE Swap $x$ and $y$, then make $y$ the subject; finally replace $y$ by $f^{-1}(x)$. The domain of $f^{-1}$ is the range of $f$.
U Bir fonksiyonun tersinin kuralını (formülünü) bulur.
UE Finds the rule (formula) of the inverse of a function.
W Ters fonksiyon, girdi ile çıktının rolünü değiştirir. $x$ ile $y$’yi yer değiştirmek tam bunu yapar; sonra denklemi yeni $y$ için çözersin.
WE The inverse swaps the roles of input and output. Swapping $x$ and $y$ does exactly that; then you solve for the new $y$.
E $y=2x+3$. Yer değiştir: $x=2y+3$. Çöz: $y=\dfrac{x-3}{2}$. Yani $f^{-1}(x)=\dfrac{x-3}{2}$.
H Önce değiştir (swap), sonra çöz (solve).
T inverse function = ters fonksiyon ;; make y the subject = $y$’yi yalnız bırakmak ;; swap = yer değiştirmek
Q Küp şeklindeki bir kutunun hacmi $V=x^3$ ($x$: kenar uzunluğu). Hacmi bilinen bir kutunun kenarını veren kuralı bulmak istiyorsun.
QE A cube-shaped box has volume $V=x^3$, where $x$ is the edge length. You want the rule that gives the edge length of a box from its volume.
G b2_invfind

# x2-inv-lin | 2 | Doğrusal fonksiyonun tersi | Inverse of a linear function
L f(x)=ax+b
O \Rightarrow
R f^{-1}(x)=\dfrac{x-b}{a}
X f^{-1}(x)=\dfrac{x+b}{a} ;; f^{-1}(x)=\dfrac{1}{ax+b} ;; f^{-1}(x)=\dfrac{x}{a}-b
K $a\ne 0$. İşlemler ters sırayla ve ters işlemle geri alınır: önce $b$’yi çıkar, sonra $a$’ya böl.
KE $a\ne 0$. Undo the operations in reverse order with the opposite operations: first subtract $b$, then divide by $a$.
U Doğrusal bir fonksiyonun tersini tek adımda yazar.
UE Writes down the inverse of a linear function in one step.
W $f$, $x$’i önce $a$ ile çarpar, sonra $b$ ekler. Geri alırken son yapılanı ilk geri alırsın: önce $b$’yi çıkar, sonra $a$’ya böl.
WE $f$ multiplies by $a$ and then adds $b$, so to undo it you take away $b$ first and then divide by $a$.
E $f(x)=3x-6$ ise $f^{-1}(x)=\dfrac{x+6}{3}$. Kontrol: $f(4)=6$ ve $f^{-1}(6)=4$.
H Çorap ve ayakkabı: giyerken önce çorap, çıkarırken önce ayakkabı.
T linear function = doğrusal fonksiyon ;; inverse = ters ;; reverse order = ters sıra
Q Bir taksimetre $x$ km için $f(x)=6x+15$ TL gösteriyor. Ödenen ücretten gidilen yolu hesaplayan kuralı hızlıca yazmak istiyorsun.
QE A taxi meter shows $f(x)=6x+15$ lira for $x$ km. You want to write quickly the rule that gives the distance travelled from the fare paid.
B f^{-1}(x)=\dfrac{x[[-b]]}{[[a]]} || +b ;; b ;; x
C a=3:1:10:1 ; b=-6:-20:20:1 ; x=6:-30:30:1 => (x-b)/a
CT f^{-1}(@x@)=\dfrac{@x@-@b@}{@a@}=@=@
G b2_invlin

# x2-inv-graph | 3 | Ters fonksiyonun grafiği | The graph of an inverse function
L ~$y=f^{-1}(x)$ grafiği
O :
R ~$y=f(x)$’in $y=x$ doğrusuna göre yansıması
X ~$y=f(x)$’in $x$ eksenine göre yansıması ;; ~$y=f(x)$’in $y$ eksenine göre yansıması ;; ~$y=f(x)$’in $1$ birim sağa ötelenmiş hâli
K $(a,\ b)$ noktası $y=f(x)$ grafiğinin üzerindeyse $(b,\ a)$ noktası $y=f^{-1}(x)$ grafiğinin üzerindedir.
KE The graph of $y=f^{-1}(x)$ is the reflection of $y=f(x)$ in the line $y=x$: if $(a,\ b)$ is on the graph of $f$, then $(b,\ a)$ is on the graph of $f^{-1}$.
U Bir fonksiyonun grafiğinden tersinin grafiğini çizer.
UE Lets you sketch the graph of the inverse from the graph of the function.
W Ters fonksiyon $x$ ile $y$’yi yer değiştirir: $(2,\ 5)$ noktası $(5,\ 2)$ olur. Koordinatları yer değiştirmek, $y=x$ doğrusundaki aynaya bakmakla aynı şeydir.
WE The inverse swaps $x$ and $y$, so $(2,\ 5)$ becomes $(5,\ 2)$; swapping the coordinates is exactly reflecting in the mirror line $y=x$.
E $y=2^x$ grafiği $(0,\ 1)$ ve $(1,\ 2)$’den geçer; tersi $y=\log_2 x$’in grafiği $(1,\ 0)$ ve $(2,\ 1)$’den geçer.
H $y=x$ aynası: koordinatlar takla atar.
T reflection = yansıma ;; mirror line = ayna doğrusu ;; inverse function = ters fonksiyon
Q Elinde bir fonksiyonun grafiği var. Tersinin grafiğini hiç formül yazmadan, yalnızca bu grafiği kullanarak çizmek istiyorsun.
QE You have the graph of a function. You want to draw the graph of its inverse without writing any formula, using only this graph.
G b2_invgraph
LAB explog

# x2-inv-domain | 2 | Tersin tanım kümesi | Domain of the inverse
L ~$f^{-1}$’in tanım kümesi (domain)
R ~$f$’in görüntü kümesi (range)
X ~$f$’in tanım kümesi ;; ~Her zaman tüm gerçek sayılar ;; ~$f^{-1}$’in görüntü kümesi
K Tersi de doğru: $f^{-1}$’in görüntü kümesi, $f$’in tanım kümesidir.
KE The domain of $f^{-1}$ is the range of $f$, and the range of $f^{-1}$ is the domain of $f$.
U Ters fonksiyona hangi sayıların girebileceğini söyler.
UE Tells you which inputs the inverse function accepts.
W Ters fonksiyon girdi ile çıktıyı yer değiştirir. $f$’ten çıkabilen her sayı, $f^{-1}$’e girebilen bir sayıdır.
WE The inverse swaps inputs and outputs, so every output of $f$ is an input of $f^{-1}$.
E $f(x)=x^2+3$, $x\ge 0$: görüntü kümesi $f(x)\ge 3$. Öyleyse $f^{-1}$’in tanım kümesi $x\ge 3$.
H Kapı ile menzil yer değiştirir: domain $\leftrightarrow$ range.
T domain = tanım kümesi ;; range = görüntü kümesi ;; inverse function = ters fonksiyon
Q $f(x)=2^x+1$ fonksiyonu yalnızca $1$’den büyük sayılar üretiyor. Bu fonksiyonun tersine hangi sayılar girilebilir?
QE The function $f(x)=2^x+1$ only produces numbers greater than $1$. Which numbers can be put into its inverse?
G b2_invdom

# x2-tr-up | 3 | Dikey öteleme $f(x)+b$ | Vertical translation $f(x)+b$
L y=f(x)+b
O :
R ~Grafik $b$ birim yukarı kayar
X ~Grafik $b$ birim sağa kayar ;; ~Grafik $b$ birim aşağı kayar ;; ~Grafik dikey olarak $b$ kat uzar
K $b<0$ ise grafik $|b|$ birim aşağı kayar. $(x,\ y)$ noktası $(x,\ y+b)$ olur. Öteleme vektörü: $\begin{pmatrix}0\\ b\end{pmatrix}$.
KE The graph moves up by $b$ units (a vertical translation); if $b<0$ it moves down by $|b|$. The point $(x,\ y)$ goes to $(x,\ y+b)$; the translation vector is $\begin{pmatrix}0\\ b\end{pmatrix}$.
U Bir grafiği şeklini bozmadan yukarı ya da aşağı taşır.
UE Moves a graph up or down without changing its shape.
W Her çıktıya $b$ eklenir, yani her noktanın yüksekliği $b$ artar. Şekil aynı kalır, sadece yeri değişir.
WE Every output has $b$ added, so every point rises by $b$; the shape stays the same and only its position changes.
E $y=x^2$’nin tepe noktası $(0,\ 0)$; $y=x^2+3$’ün tepe noktası $(0,\ 3)$.
H Dışarıdaki sayı dürüsttür: $+3$ yukarı, $-3$ aşağı.
T vertical translation = dikey öteleme ;; translation vector = öteleme vektörü ;; graph = grafik
Q Bir asansörün zaman–yükseklik grafiği var. Aynı hareketi $5$ m daha yüksekten başlayarak yapan ikinci bir asansörün grafiğini nasıl elde edersin?
QE A lift has a time–height graph. How do you get the graph of a second lift that makes the same journey but starts $5$ m higher?
C x=2:0:6:1 ; y=4:0:9:1 ; b=3:-5:5:1 => y+b
CT (@x@,\ @y@)\ \mapsto\ (@x@,\ @=@)
G b2_trup
LAB transform

# x2-tr-right | 3 | Yatay öteleme $f(x-a)$ | Horizontal translation $f(x-a)$
L y=f(x-a)
O :
R ~Grafik $a$ birim sağa kayar
X ~Grafik $a$ birim sola kayar ;; ~Grafik $a$ birim aşağı kayar ;; ~Grafik $a$ birim yukarı kayar
K $a<0$ ise sola kayar: $f(x+2)$ grafiği $2$ birim sola gider. $(x,\ y)$ noktası $(x+a,\ y)$ olur. Öteleme vektörü: $\begin{pmatrix}a\\ 0\end{pmatrix}$.
KE The graph moves $a$ units to the right (a horizontal translation); if $a<0$ it moves left, so $f(x+2)$ moves $2$ units left. The point $(x,\ y)$ goes to $(x+a,\ y)$; the translation vector is $\begin{pmatrix}a\\ 0\end{pmatrix}$.
U Bir grafiği şeklini bozmadan sağa ya da sola taşır.
UE Moves a graph left or right without changing its shape.
W Eski grafikte $x=0$’da olan şey, yeni grafikte $x-a=0$ olunca, yani $x=a$’da olur. Her şey $a$ birim geç gelir: grafik sağa kayar.
WE What happened at $x=0$ on the old graph now happens when $x-a=0$, that is at $x=a$, so everything moves $a$ units to the right.
E $y=x^2$: tepe $(0,\ 0)$. $y=(x-3)^2$: tepe $(3,\ 0)$. $y=(x+3)^2$: tepe $(-3,\ 0)$.
H Parantezin içi yalancıdır: eksi görürsen sağa, artı görürsen sola.
T horizontal translation = yatay öteleme ;; translation = öteleme ;; shift = kaydırma
Q Bir konserin ses seviyesi–zaman grafiği var. Konser $2$ saat geç başlarsa aynı grafik nasıl değişir?
QE You have a graph of the sound level of a concert against time. If the concert starts $2$ hours late, how does the same graph change?
C x=2:0:6:1 ; y=4:0:9:1 ; a=3:-5:5:1 => x+a
CT (@x@,\ @y@)\ \mapsto\ (@=@,\ @y@)
G b2_trright
LAB transform

# x2-tr-refx | 3 | $x$ eksenine göre yansıma $-f(x)$ | Reflection in the $x$-axis $-f(x)$
L y=-f(x)
O :
R ~$x$ eksenine göre yansıma
X ~$y$ eksenine göre yansıma ;; ~$y=x$ doğrusuna göre yansıma ;; ~Grafik $1$ birim aşağı kayar
K $(x,\ y)$ noktası $(x,\ -y)$ olur. $x$ ekseni üzerindeki noktalar (kökler) yerinde kalır.
KE Reflection in the $x$-axis: the point $(x,\ y)$ goes to $(x,\ -y)$. Points on the $x$-axis (the roots) stay where they are.
U Bir grafiği $x$ eksenine göre ters çevirir, baş aşağı yapar.
UE Flips a graph upside down in the $x$-axis.
W Her çıktının işareti değişir: eksenin üstündeki noktalar alta, alttakiler üste geçer. $x$ ekseni ayna olur.
WE Every output changes sign, so points above the axis go below it and points below go above: the $x$-axis acts as a mirror.
E $y=x^2$ yukarı açılır, $y=-x^2$ aşağı açılır; ikisinin de tepe noktası $(0,\ 0)$.
H Eksi dışarıdaysa: dikey takla ($y$’ler ters döner).
T reflection in the x-axis = $x$ eksenine göre yansıma ;; reflect = yansıtmak ;; mirror = ayna
Q Bir gölün kıyısındaki dağın yükseklik grafiği var; su yüzeyi $y=0$ doğrusu. Dağın sudaki yansımasının grafiğini nasıl elde edersin?
QE You have a graph of the height of a mountain beside a lake, and the water surface is the line $y=0$. How do you get the graph of the mountain’s reflection in the water?
C x=2:0:6:1 ; y=4:0:9:1 => -y
CT (@x@,\ @y@)\ \mapsto\ (@x@,\ @=@)
G b2_trrefx
LAB transform

# x2-tr-refy | 3 | $y$ eksenine göre yansıma $f(-x)$ | Reflection in the $y$-axis $f(-x)$
L y=f(-x)
O :
R ~$y$ eksenine göre yansıma
X ~$x$ eksenine göre yansıma ;; ~Orijine göre yansıma ;; ~Grafik $1$ birim sola kayar
K $(x,\ y)$ noktası $(-x,\ y)$ olur. $y$ ekseni üzerindeki nokta ($y$-kesişimi) yerinde kalır.
KE Reflection in the $y$-axis: the point $(x,\ y)$ goes to $(-x,\ y)$. The point on the $y$-axis (the $y$-intercept) stays where it is.
U Bir grafiği $y$ eksenine göre çevirir: sağ taraf sola, sol taraf sağa geçer.
UE Flips a graph from left to right in the $y$-axis.
W Eski grafikte $x=2$’de olan şey, yeni grafikte $-x=2$ olunca, yani $x=-2$’de olur. Sağ ile sol yer değiştirir.
WE What was at $x=2$ now happens when $-x=2$, that is at $x=-2$, so the right-hand side swaps with the left-hand side.
E $y=2^x$ sağa doğru artar; $y=2^{-x}$ sağa doğru azalır. İkisi de $(0,\ 1)$’den geçer.
H Eksi içerideyse: yatay takla ($x$’ler ters döner).
T reflection in the y-axis = $y$ eksenine göre yansıma ;; reflect = yansıtmak ;; mirror image = ayna görüntüsü
Q Bir bilgisayar oyununda karakterin sağa zıplayışı bir grafikle çizilmiş. Karakter sola dönüp aynı zıplamayı yaparsa yeni grafiği nasıl çizersin?
QE In a computer game a character’s jump to the right is drawn as a graph. If the character turns round and makes the same jump to the left, how do you draw the new graph?
C x=2:0:6:1 ; y=4:0:9:1 => -x
CT (@x@,\ @y@)\ \mapsto\ (@=@,\ @y@)
G b2_trrefy
LAB transform

# x2-tr-vs | 2 | Dikey uzama $p\,f(x)$ | Vertical stretch $p\,f(x)$
L y=p\,f(x)
O :
R ~Dikey uzama, ölçek çarpanı $p$
X ~Yatay uzama, ölçek çarpanı $p$ ;; ~Dikey uzama, ölçek çarpanı $\tfrac{1}{p}$ ;; ~Grafik $p$ birim yukarı kayar
K $p>0$. $(x,\ y)$ noktası $(x,\ py)$ olur. $0<p<1$ ise grafik dikey olarak basılır. $x$ ekseni üzerindeki noktalar yerinde kalır.
KE $p>0$. Vertical stretch with scale factor $p$: the point $(x,\ y)$ goes to $(x,\ py)$. If $0<p<1$ the graph is squashed vertically. Points on the $x$-axis stay where they are.
U Bir grafiği yukarı–aşağı yönde çekip uzatır ya da bastırır.
UE Stretches or squashes a graph in the up–down direction.
W Her çıktı $p$ ile çarpılır, yani her noktanın yüksekliği $p$ katına çıkar. Yüksekliği $0$ olan noktalar $0$ kalır.
WE Every output is multiplied by $p$, so every height becomes $p$ times as big, while points at height $0$ stay at $0$.
E $y=x^2$ üzerindeki $(2,\ 4)$ noktası, $y=3x^2$ üzerinde $(2,\ 12)$ olur.
H Dışarıdaki çarpan dürüsttür: $3f(x)$ gerçekten $3$ kat uzundur.
T vertical stretch = dikey uzama ;; scale factor = ölçek çarpanı ;; stretch = uzatmak
Q Bir dalganın yükseklik–zaman grafiği var. Fırtınada dalgalar yine aynı aralıklarla geliyor ama $3$ kat yüksek. Yeni grafiği nasıl elde edersin?
QE You have a height–time graph of a wave. In a storm the waves still arrive at the same intervals but are $3$ times as high. How do you get the new graph?
C x=2:0:6:1 ; y=4:0:9:1 ; p=2:0.5:4:0.5 => p*y
CT (@x@,\ @y@)\ \mapsto\ (@x@,\ @=@)
G b2_trvs
LAB transform

# x2-tr-hs | 2 | Yatay uzama $f(qx)$ | Horizontal stretch $f(qx)$
L y=f(qx)
O :
R ~Yatay uzama, ölçek çarpanı $\tfrac{1}{q}$
X ~Yatay uzama, ölçek çarpanı $q$ ;; ~Dikey uzama, ölçek çarpanı $q$ ;; ~Grafik $q$ birim sola kayar
K $q>0$. $(x,\ y)$ noktası $\left(\tfrac{x}{q},\ y\right)$ olur. $q>1$ ise grafik yatayda sıkışır, $0<q<1$ ise genişler. $y$ ekseni üzerindeki noktalar yerinde kalır.
KE $q>0$. Horizontal stretch with scale factor $\tfrac{1}{q}$: the point $(x,\ y)$ goes to $\left(\tfrac{x}{q},\ y\right)$. If $q>1$ the graph is squashed horizontally; if $0<q<1$ it is stretched. Points on the $y$-axis stay where they are.
U Bir grafiği sağa–sola yönde sıkıştırır ya da genişletir.
UE Squashes or stretches a graph in the left–right direction.
W $f(2x)$, $f$’in $x=4$’te yaptığını $x=2$’de yapar: her şey $2$ kat erken olur. Grafik yatayda yarıya iner, yani çarpan $\tfrac{1}{2}$’dir.
WE $f(2x)$ does at $x=2$ what $f$ did at $x=4$: everything happens twice as early, so the graph halves horizontally and the scale factor is $\tfrac{1}{2}$.
E $y=x^2$ üzerindeki $(4,\ 16)$ noktası, $y=(2x)^2$ üzerinde $(2,\ 16)$ olur.
H İçerideki çarpan yalancıdır: $f(2x)$ uzamaz, yarıya sıkışır.
T horizontal stretch = yatay uzama ;; scale factor = ölçek çarpanı ;; squash = sıkıştırmak
Q Bir şarkının ses dalgasının grafiği var. Şarkıyı $2$ kat hızlı çalarsan aynı dalganın grafiği nasıl değişir?
QE You have a graph of a song’s sound wave. If you play the song twice as fast, how does the graph of the same wave change?
C x=4:0:8:1 ; y=4:0:9:1 ; q=2:0.5:4:0.5 => x/q
CT (@x@,\ @y@)\ \mapsto\ (@=@,\ @y@)
G b2_trhs
LAB transform

# x2-recip | 2 | $\tfrac{1}{x}$ fonksiyonu ve asimptotları | The reciprocal function $\tfrac{1}{x}$
L ~$y=\dfrac{1}{x}$ grafiğinin asimptotları
O :
R ~$x=0$ ve $y=0$
X ~$x=1$ ve $y=1$ ;; ~Yalnızca $x=0$ ;; ~$y=x$ ve $y=-x$
K $x\ne 0$. Asimptot: grafiğin gittikçe yaklaştığı ama hiç değmediği doğru. $x=0$ dikey, $y=0$ yatay asimptottur.
KE $x\ne 0$. An asymptote is a line the graph gets closer and closer to but never reaches: $x=0$ is the vertical asymptote and $y=0$ is the horizontal asymptote.
U Grafiğin hangi doğrulara yaklaşıp hiç değmediğini söyler.
UE Tells you which lines the graph approaches but never reaches.
W $\tfrac{1}{0}$ tanımsızdır, bu yüzden grafik $x=0$ doğrusuna değemez. $x$ büyüdükçe $\tfrac{1}{x}$ küçülür ($\tfrac{1}{1000}=0{,}001$) ama hiç $0$ olmaz.
WE $\tfrac{1}{0}$ is undefined, so the graph cannot touch $x=0$; as $x$ grows, $\tfrac{1}{x}$ shrinks towards $0$ but never reaches it.
E $f(2)=\tfrac{1}{2}$, $f(10)=0{,}1$, $f(-2)=-\tfrac{1}{2}$. Ayrıca $f(f(x))=x$: bu fonksiyon kendi kendisinin tersidir.
H Eksenlere yaklaş ama dokunma: iki asimptot da eksenlerin kendisi.
T reciprocal function = $\tfrac{1}{x}$ (çarpmaya göre ters) fonksiyonu ;; asymptote = asimptot ;; self-inverse = kendi kendisinin tersi
Q $12$ km’lik bir yolu $x$ km/sa hızla giden birinin yolculuk süresi $y=\dfrac{12}{x}$ saat. Hız çok büyüyünce süre neye yaklaşır? Hız $0$’a yaklaşınca ne olur?
QE The time taken to travel $12$ km at $x$ km/h is $y=\dfrac{12}{x}$ hours. What does the time approach as the speed becomes very large? What happens as the speed gets close to $0$?
C x=2:-5:5:0.5 => 1/x
CT \dfrac{1}{@x@}=@=@
G b2_recip

# x2-rat-va | 2 | Rasyonel fonksiyonun dikey asimptotu | Vertical asymptote of a rational function
L ~$y=\dfrac{ax+b}{cx+d}$ grafiğinin dikey asimptotu
O :
R x=-\dfrac{d}{c}
X x=\dfrac{d}{c} ;; x=-\dfrac{b}{a} ;; x=\dfrac{a}{c}
K $c\ne 0$ ve $ad-bc\ne 0$. Paydayı sıfır yapan $x$ değeridir: $cx+d=0$.
KE $c\ne 0$ and $ad-bc\ne 0$. It is the value of $x$ that makes the denominator zero: $cx+d=0$.
U Grafiğin hiç kesmediği dikey doğruyu bulur.
UE Finds the vertical line that the graph never crosses.
W Payda $0$ olunca kesir tanımsızdır. O $x$’te grafik kopar ve doğrunun iki yanında yukarı ya da aşağı fırlar.
WE When the denominator is $0$ the fraction is undefined, so the graph breaks there and shoots up or down on either side of that line.
E $y=\dfrac{2x+1}{x-3}$: $x-3=0$, yani dikey asimptot $x=3$.
H Dikey asimptot: paydayı sıfırla.
T vertical asymptote = dikey asimptot ;; rational function = rasyonel fonksiyon ;; denominator = payda
Q Bir mercekte görüntünün uzaklığı $v=\dfrac{2u}{u-2}$ cm ($u$: cismin uzaklığı). Cisim hangi uzaklığa yaklaşınca görüntü sonsuz uzağa kaçar?
QE For a lens, the image distance is $v=\dfrac{2u}{u-2}$ cm, where $u$ is the object distance. As the object approaches which distance does the image run off to infinity?
B x=-\dfrac{[[d]]}{[[c]]} || b ;; a
C c=1:-5:5:1 ; d=-3:-10:10:1 => -d/c
CT x=-\dfrac{@d@}{@c@}=@=@
G b2_ratv

# x2-rat-ha | 2 | Rasyonel fonksiyonun yatay asimptotu | Horizontal asymptote of a rational function
L ~$y=\dfrac{ax+b}{cx+d}$ grafiğinin yatay asimptotu
O :
R y=\dfrac{a}{c}
X y=\dfrac{b}{d} ;; y=-\dfrac{d}{c} ;; y=\dfrac{c}{a}
K $c\ne 0$ ve $ad-bc\ne 0$. $x$’lerin katsayılarının oranıdır.
KE $c\ne 0$ and $ad-bc\ne 0$. It is the ratio of the coefficients of $x$.
U Çok büyük $x$ değerlerinde grafiğin hangi yüksekliğe yerleştiğini bulur.
UE Finds the height the graph settles at for very large values of $x$.
W $x$ çok büyükken $b$ ve $d$ önemsiz kalır: $\dfrac{ax+b}{cx+d}\approx\dfrac{ax}{cx}=\dfrac{a}{c}$.
WE For very large $x$, $b$ and $d$ hardly matter, so $\dfrac{ax+b}{cx+d}\approx\dfrac{ax}{cx}=\dfrac{a}{c}$.
E $y=\dfrac{2x+1}{x-3}$: yatay asimptot $y=\dfrac{2}{1}=2$. $x=1000$ iken $y=\dfrac{2001}{997}\approx 2{,}007$.
H Yatay asimptot: $x$’lerin önündeki sayıları böl.
T horizontal asymptote = yatay asimptot ;; coefficient = katsayı ;; tends to infinity = sonsuza gider
Q Bir şirkette $x$ ürünün birim maliyeti $y=\dfrac{3x+200}{x+5}$ TL. Çok çok fazla ürün üretilirse birim maliyet hangi değere yaklaşır?
QE A company’s cost per item when making $x$ items is $y=\dfrac{3x+200}{x+5}$ lira. If a huge number of items is made, what value does the cost per item approach?
B y=\dfrac{[[a]]}{[[c]]} || b ;; d
C a=2:-10:10:1 ; c=1:-5:5:1 => a/c
CT y=\dfrac{@a@}{@c@}=@=@
G b2_rath

# x2-exp | 3 | Üstel fonksiyon $a^x$ | The exponential function $a^x$
L ~$y=a^x$ grafiği
O :
R ~$(0,\ 1)$’den geçer; asimptotu $y=0$
X ~$(1,\ 0)$’dan geçer; asimptotu $x=0$ ;; ~$(0,\ 0)$’dan geçer; asimptotu $y=1$ ;; ~$(0,\ a)$’dan geçer; asimptotu $y=0$
K $a>0$ ve $a\ne 1$. $a>1$ ise grafik hep artar, $0<a<1$ ise hep azalır. Görüntü kümesi: $y>0$.
KE $a>0$ and $a\ne 1$. The graph passes through $(0,\ 1)$ and has horizontal asymptote $y=0$. If $a>1$ it is increasing; if $0<a<1$ it is decreasing. The range is $y>0$.
U Üstel büyüme ve azalma grafiklerini (nüfus, faiz, ilaç) hızla çizmeni sağlar.
UE Lets you quickly sketch exponential growth and decay graphs (population, interest, medicine).
W $a^0=1$, bu yüzden her üstel grafik $(0,\ 1)$’den geçer. $a^x$ hiçbir zaman $0$ ya da negatif olmaz; $0$’a yaklaşır ama değmez.
WE $a^0=1$, so every such graph passes through $(0,\ 1)$; $a^x$ is never zero or negative, so it gets closer and closer to $y=0$ without touching it.
E $y=2^x$: $(0,\ 1)$, $(1,\ 2)$, $(3,\ 8)$, $\left(-1,\ \tfrac{1}{2}\right)$. $y=2^x+3$’ün asimptotu $y=3$.
H Üstel grafik “bir”den başlar, sıfıra hiç inmez.
T exponential function = üstel fonksiyon ;; horizontal asymptote = yatay asimptot ;; exponential growth = üstel büyüme
Q Bir bakteri kolonisi her saat ikiye katlanıyor ve şu an $1$ bin bakteri var. Sayının zamana göre grafiği şu anda nerede ve geçmişe doğru gidildikçe hangi değere yaklaşır?
QE A colony of bacteria doubles every hour and there are now $1$ thousand bacteria. Where is the graph of the number against time right now, and what value does it approach as you go back in time?
C a=2:0.2:5:0.1 ; x=3:-4:4:1 => a^x
CT @a@^{@x@}=@=@
G b2_exp
LAB explog

# x2-log | 3 | Logaritma fonksiyonu $\log_a x$ | The logarithmic function $\log_a x$
L ~$y=\log_a x$ grafiği
O :
R ~$(1,\ 0)$’dan geçer; asimptotu $x=0$
X ~$(0,\ 1)$’den geçer; asimptotu $y=0$ ;; ~$(0,\ 0)$’dan geçer; asimptotu $x=1$ ;; ~$(a,\ 0)$’dan geçer; asimptotu $x=0$
K $a>0$, $a\ne 1$ ve $x>0$. $\log_a x$, $a^x$’in ters fonksiyonudur; grafiği $y=a^x$’in $y=x$’e göre yansımasıdır.
KE $a>0$, $a\ne 1$ and $x>0$. The graph passes through $(1,\ 0)$ and has vertical asymptote $x=0$. $\log_a x$ is the inverse of $a^x$, so its graph is the reflection of $y=a^x$ in $y=x$.
U Logaritmik grafikleri (ses şiddeti, deprem ölçeği, pH) hızla çizmeni sağlar.
UE Lets you quickly sketch logarithmic graphs (sound level, earthquake scale, pH).
W $a^0=1$ olduğu için $\log_a 1=0$: grafik $(1,\ 0)$’dan geçer. $a^x$’in $(0,\ 1)$ noktası ve $y=0$ asimptotu, $y=x$ aynasında $(1,\ 0)$ ve $x=0$ olur.
WE $\log_a 1=0$ because $a^0=1$, so the graph passes through $(1,\ 0)$; reflecting $a^x$ in $y=x$ turns $(0,\ 1)$ into $(1,\ 0)$ and $y=0$ into $x=0$.
E $y=\log_2 x$: $(1,\ 0)$, $(2,\ 1)$, $(8,\ 3)$, $\left(\tfrac{1}{2},\ -1\right)$. $y=\log_2(x-3)$’ün asimptotu $x=3$.
H Logaritma, üstelin aynadaki ikizidir: koordinatlar yer değiştirir.
T logarithmic function = logaritma fonksiyonu ;; vertical asymptote = dikey asimptot ;; base = taban
Q Deprem büyüklüğü, açığa çıkan enerjinin logaritmasıyla ölçülüyor. Bu tür bir grafiğin $x$ eksenini nerede kestiğini ve hangi dikey doğruya yaklaştığını bilmek istiyorsun.
QE Earthquake magnitude is measured using the logarithm of the energy released. You want to know where such a graph crosses the $x$-axis and which vertical line it approaches.
C a=2:0.2:5:0.1 ; x=8:0.5:16:0.5 => log(a,x)
CT \log_{@a@} @x@=@=@
G b2_log
LAB explog
S İskoç matematikçi John Napier logaritmayı 1614’te yayımladı. Logaritma tabloları, hesap makinesinden önceki yüzyıllarda büyük çarpmaları kolay toplamalara çevirdi.

# x2-ln-dom | 3 | $\ln x$’in tanım kümesi | The domain of $\ln x$
L ~$\ln x$ tanımlıdır
O \iff
R x>0
X x\ge 0 ;; x\in\mathbb{R} ;; x>1
K $\ln x=\log_e x$ ve $e\approx 2{,}718$. Aynı kural her $\log_a x$ için geçerlidir. $\ln(x-3)$ için içi pozitif olmalı: $x>3$.
KE $\ln x=\log_e x$, where $e\approx 2.718$. The domain is $x>0$, and the same rule holds for every $\log_a x$. For $\ln(x-3)$ the inside must be positive: $x>3$.
U Logaritmanın içine hangi sayıların konabileceğini söyler; sınavda yanlış çözümleri elemek için şarttır.
UE Tells you which numbers can go inside a logarithm, which is vital for rejecting invalid solutions in exams.
W $\ln x$, “$e$’yi kaçıncı kuvvete yükseltirsem $x$ olur?” sorusudur. $e$’nin her kuvveti pozitiftir; $0$ ya da negatif bir sayı elde edemezsin.
WE $\ln x$ asks “what power of $e$ gives $x$?”. Every power of $e$ is positive, so $x$ can never be $0$ or negative.
E $\ln 1=0$ ve $\ln e=1$, ama $\ln 0$ ve $\ln(-2)$ tanımsızdır. $\ln(2x-6)$ için $2x-6>0$, yani $x>3$.
H Logaritmanın içi hep pozitif: sıfır bile yasak!
T natural logarithm = doğal logaritma ;; domain = tanım kümesi ;; undefined = tanımsız
Q Bir denklemi çözünce $x=-2$ ve $x=5$ buldun, ama denklemde $\ln x$ geçiyor. Hangi çözümü atman gerekir?
QE Solving an equation gives $x=-2$ and $x=5$, but the equation contains $\ln x$. Which solution must you reject?
B x[[>]]0 || \ge ;; < ;; =
C x=2:-2:10:0.5 => ln(x)
CT \ln @x@=@=@
G b2_ln
LAB explog
`;

/* ---------- yardımcılar ---------- */
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
const quad = (a, b, c) => poly([[a, "x^2"], [b, "x"], [c, ""]]);
/** (x-p) çarpanı; p = 0 ise x */
const fac = (p) => (p === 0 ? "x" : `(x${sgn(-p)})`);
/** sıfır olmayan tam sayı */
const nz = (r, a, b) => { let v; do { v = ri(r, a, b); } while (v === 0); return v; };
/** baş katsayı: 1 → "", -1 → "-", 3 → "3" */
const co = (k) => (k === 1 ? "" : k === -1 ? "-" : `${k}`);
/** kesirli baş katsayı (fr çıktısından) */
const coT = (f) => (f.tex === "1" ? "" : f.tex === "-1" ? "-" : f.tex);
const pt = (x, y) => `(${x},\\ ${y})`;
const coin = (r) => r() < 0.5;
/** v’den küçük en büyük tam sayı / v’den büyük en küçük tam sayı */
const below = (v) => Math.ceil(v) - 1;
const above = (v) => Math.floor(v) + 1;
const FRAC = " (Kesir olarak yazabilirsin.)";
const FRACE = " (a fraction is fine)";

/** Rastgele ikinci dereceden denklem ve farklı gerçek kök sayısı (0, 1 ya da 2) */
function rootCase(r) {
  const n = pick(r, [0, 1, 2]), a = pick(r, [1, 1, 2, -1]);
  let f;
  if (n === 2) {
    const p = ri(r, -5, 5);
    let q; do { q = ri(r, -5, 5); } while (q === p);
    f = quad(a, -a * (p + q), a * p * q);
  } else if (n === 1) {
    const p = nz(r, -5, 5);
    f = quad(a, -2 * a * p, a * p * p);
  } else {
    const h = ri(r, -4, 4), s = ri(r, 1, 6);
    f = quad(a, -2 * a * h, a * (h * h + s));
  }
  return { f, n };
}

/** (ax+b)/(cx+d), ad - bc ≠ 0 */
function ratParts(r) {
  let a, b, c, d;
  do { a = nz(r, -5, 6); b = ri(r, -9, 9); c = ri(r, 1, 4); d = ri(r, -9, 9); } while (a * d - b * c === 0);
  return { a, b, c, d, tex: `\\dfrac{${lin(a, b)}}{${lin(c, d)}}` };
}

/** Dönüşüm soruları için ortak metin */
const onF = (p, q) => `$${pt(p, q)}$ noktası $y=f(x)$ grafiğinin üzerinde.`;
const onFE = (p, q) => `The point $${pt(p, q)}$ lies on the graph of $y=f(x)$.`;
const imgQ = (g, c) => `$y=${g}$ grafiğinde bu noktanın görüntüsünün $${c}$ koordinatı kaçtır?`;
const imgQE = (g, c) => `Find the $${c}$-coordinate of its image on the graph of $y=${g}$.`;

export const GEN = {
  /* ---------- b2 ---------- */
  b2_grad: (r) => {
    const x1 = ri(r, -5, 5), y1 = ri(r, -6, 6);
    let run; do { run = nz(r, -4, 5); } while (Math.abs(x1 + run) > 8);
    const rise = r() < 0.65 ? nz(r, -3, 3) * run : ri(r, -7, 7);
    const x2 = x1 + run, y2 = y1 + rise;
    return {
      q: `$A${pt(x1, y1)}$ ve $B${pt(x2, y2)}$ noktalarından geçen doğrunun eğimi kaçtır?${FRAC}`,
      qe: `Find the gradient of the line through $A${pt(x1, y1)}$ and $B${pt(x2, y2)}$${FRACE}.`,
      ...fr(rise, run),
    };
  },
  b2_mxc: (r) => {
    const m = nz(r, -5, 5), c = ri(r, -9, 9);
    if (r() < 0.5) {
      const x = nz(r, -4, 5);
      return {
        q: `Bir doğrunun eğimi $${m}$ ve doğru $y$ eksenini $(0,\\ ${c})$ noktasında kesiyor. Bu doğru üzerinde $x=${x}$ iken $y$ kaçtır?`,
        qe: `A line has gradient $${m}$ and meets the $y$-axis at $(0,\\ ${c})$. Find $y$ on this line when $x=${x}$.`,
        ...int(m * x + c),
      };
    }
    const p = nz(r, -4, 4), q = m * p + c;
    return {
      q: `$y=${co(m)}x+c$ doğrusu $${pt(p, q)}$ noktasından geçiyor. $c$ kaçtır?`,
      qe: `The line $y=${co(m)}x+c$ passes through the point $${pt(p, q)}$. Find $c$.`,
      ...int(c),
    };
  },
  b2_point: (r) => {
    const x1 = ri(r, -5, 5), y1 = ri(r, -8, 8), m = nz(r, -4, 4), P = pt(x1, y1);
    if (r() < 0.55) {
      const x = ri(r, -4, 6);
      return {
        q: `Eğimi $${m}$ olan bir doğru $${P}$ noktasından geçiyor. Bu doğru üzerinde $x=${x}$ iken $y$ kaçtır?`,
        qe: `A line with gradient $${m}$ passes through $${P}$. Find $y$ on this line when $x=${x}$.`,
        ...int(y1 + m * (x - x1)),
      };
    }
    return {
      q: `Eğimi $${m}$ olan bir doğru $${P}$ noktasından geçiyor. Doğru $y=mx+c$ biçiminde yazılınca $c$ kaçtır?`,
      qe: `A line with gradient $${m}$ passes through $${P}$. When it is written as $y=mx+c$, what is $c$?`,
      ...int(y1 - m * x1),
    };
  },
  b2_general: (r) => {
    const a = ri(r, 1, 6), b = nz(r, -6, 6), d = ri(r, -12, 12);
    const eq = `${poly([[a, "x"], [b, "y"], [d, ""]])}=0`;
    if (r() < 0.6) {
      return {
        q: `$${eq}$ doğrusunun eğimi kaçtır?${FRAC}`,
        qe: `Find the gradient of the line $${eq}$${FRACE}.`,
        ...fr(-a, b),
      };
    }
    return {
      q: `$${eq}$ doğrusu $y$ eksenini $(0,\\ k)$ noktasında kesiyor. $k$ kaçtır?${FRAC}`,
      qe: `The line $${eq}$ meets the $y$-axis at $(0,\\ k)$. Find $k$${FRACE}.`,
      ...fr(-d, b),
    };
  },
  b2_axis: (r) => {
    let a, b;
    if (r() < 0.7) { a = pick(r, [1, 1, 2, -1, -2, 3]); b = -2 * a * ri(r, -5, 5); }
    else { a = pick(r, [1, -1]); do { b = ri(r, -9, 9); } while (b % 2 === 0); }
    const f = quad(a, b, ri(r, -9, 9));
    return {
      q: `$f(x)=${f}$ grafiğinin simetri ekseni $x=k$ doğrusudur. $k$ kaçtır?${FRAC}`,
      qe: `The axis of symmetry of the graph of $f(x)=${f}$ is the line $x=k$. Find $k$${FRACE}.`,
      ...fr(-b, 2 * a),
    };
  },
  b2_disc: (r) => {
    const a = nz(r, -3, 4), b = ri(r, -7, 7), c = ri(r, -6, 6), f = quad(a, b, c);
    return {
      q: `$${f}=0$ denkleminin diskriminantı $\\Delta$ kaçtır?`,
      qe: `Find the discriminant $\\Delta$ of the equation $${f}=0$.`,
      ...int(b * b - 4 * a * c),
    };
  },
  b2_quad: (r) => {
    const larger = coin(r);
    const w = larger ? "büyük" : "küçük", we = larger ? "larger" : "smaller";
    const pickRoot = (u, v) => (larger ? Math.max(u, v) : Math.min(u, v));
    if (r() < 0.7) {
      const a = pick(r, [1, 1, 1, 2, -1]), p = ri(r, -6, 6);
      let q; do { q = ri(r, -6, 6); } while (q === p);
      const f = quad(a, -a * (p + q), a * p * q);
      return {
        q: `$${f}=0$ denkleminin ${w} kökü kaçtır?`,
        qe: `Find the ${we} root of the equation $${f}=0$.`,
        ...int(pickRoot(p, q)),
      };
    }
    // (2x - s)(x - q) = 2x^2 - (s + 2q)x + sq; kökler s/2 ve q
    const s = pick(r, [-5, -3, -1, 1, 3, 5]), q = ri(r, -4, 4);
    const f = quad(2, -(s + 2 * q), s * q);
    const ans = pickRoot(s / 2, q);
    return {
      q: `$${f}=0$ denkleminin ${w} kökü kaçtır?${FRAC}`,
      qe: `Find the ${we} root of the equation $${f}=0$${FRACE}.`,
      ...(ans === q ? int(q) : fr(s, 2)),
    };
  },

  /* ---------- x2 ---------- */
  b2_parallel: (r) => {
    const t = r();
    if (t < 0.35) {
      const m = nz(r, -6, 6), c = ri(r, -9, 9);
      return {
        q: `$y=${lin(m, c)}$ doğrusuna paralel olan bir doğrunun eğimi kaçtır?`,
        qe: `Find the gradient of a line parallel to $y=${lin(m, c)}$.`,
        ...int(m),
      };
    }
    if (t < 0.65) {
      const a = ri(r, 1, 6), b = nz(r, -6, 6), d = ri(r, -9, 9);
      const eq = `${poly([[a, "x"], [b, "y"], [d, ""]])}=0`;
      return {
        q: `$${eq}$ doğrusuna paralel olan bir doğrunun eğimi kaçtır?${FRAC}`,
        qe: `Find the gradient of a line parallel to $${eq}$${FRACE}.`,
        ...fr(-a, b),
      };
    }
    const m = nz(r, -4, 4), c = ri(r, -9, 9), p = ri(r, -4, 4);
    let q; do { q = ri(r, -9, 9); } while (q - m * p === c);
    return {
      q: `Bir doğru $y=${lin(m, c)}$ doğrusuna paralel ve $${pt(p, q)}$ noktasından geçiyor. Denklemi $y=${co(m)}x+k$ ise $k$ kaçtır?`,
      qe: `A line is parallel to $y=${lin(m, c)}$ and passes through $${pt(p, q)}$. Its equation is $y=${co(m)}x+k$. Find $k$.`,
      ...int(q - m * p),
    };
  },
  b2_perp: (r) => {
    const t = r();
    if (t < 0.4) {
      const n = nz(r, -5, 5), d = pick(r, [1, 1, 2, 3]), c = ri(r, -6, 6);
      const line = `y=${coT(fr(n, d))}x${c ? sgn(c) : ""}`;
      return {
        q: `$${line}$ doğrusuna dik olan bir doğrunun eğimi kaçtır?${FRAC}`,
        qe: `Find the gradient of a line perpendicular to $${line}$${FRACE}.`,
        ...fr(-d, n),
      };
    }
    if (t < 0.7) {
      const m = nz(r, -5, 5), c = ri(r, -6, 6), e = ri(r, -6, 6);
      const other = `y=kx${e ? sgn(e) : ""}`;
      return {
        q: `$y=${lin(m, c)}$ ve $${other}$ doğruları birbirine diktir. $k$ kaçtır?${FRAC}`,
        qe: `The lines $y=${lin(m, c)}$ and $${other}$ are perpendicular. Find $k$${FRACE}.`,
        ...fr(-1, m),
      };
    }
    // dik eğim -1/m; nokta x = m*s olduğundan k = q + s tam sayıdır
    const m = pick(r, [-3, -2, -1, 1, 2, 3]), s = nz(r, -3, 3), p = m * s, q = ri(r, -6, 6), c = ri(r, -6, 6);
    const slope = coT(fr(-1, m));
    return {
      q: `Bir doğru $y=${lin(m, c)}$ doğrusuna dik ve $${pt(p, q)}$ noktasından geçiyor. Denklemi $y=${slope}x+k$ ise $k$ kaçtır?`,
      qe: `A line is perpendicular to $y=${lin(m, c)}$ and passes through $${pt(p, q)}$. Its equation is $y=${slope}x+k$. Find $k$.`,
      ...int(q + s),
    };
  },
  b2_yint: (r) => {
    const t = r();
    let f, v;
    if (t < 0.5) {
      const a = nz(r, -4, 4), b = ri(r, -7, 7), c = nz(r, -9, 9);
      f = quad(a, b, c); v = c;
    } else if (t < 0.75) {
      const a = pick(r, [1, 2, -1, 3]), h = nz(r, -4, 4), k = ri(r, -6, 6);
      f = `${co(a)}${fac(h)}^2${k ? sgn(k) : ""}`; v = a * h * h + k;
    } else {
      const a = pick(r, [1, 2, -1, -2]), p = nz(r, -5, 5);
      let q; do { q = nz(r, -5, 5); } while (q === p);
      f = `${co(a)}${fac(p)}${fac(q)}`; v = a * p * q;
    }
    return {
      q: `$y=${f}$ grafiği $y$ eksenini $(0,\\ k)$ noktasında keser. $k$ kaçtır?`,
      qe: `The graph of $y=${f}$ meets the $y$-axis at $(0,\\ k)$. Find $k$.`,
      ...int(v),
    };
  },
  b2_vertex: (r) => {
    const a = pick(r, [1, 1, -1, 2, -2]), h = ri(r, -4, 4), k = ri(r, -9, 9);
    const f = quad(a, -2 * a * h, a * h * h + k);
    if (r() < 0.5) {
      return {
        q: `$f(x)=${f}$ parabolünün tepe noktasının $y$ koordinatı kaçtır?`,
        qe: `Find the $y$-coordinate of the vertex of the parabola $f(x)=${f}$.`,
        ...int(k),
      };
    }
    const w = a > 0 ? "en küçük" : "en büyük", we = a > 0 ? "minimum" : "maximum";
    return {
      q: `$f(x)=${f}$ fonksiyonunun ${w} değeri kaçtır?`,
      qe: `Find the ${we} value of $f(x)=${f}$.`,
      ...int(k),
    };
  },
  b2_vform: (r) => {
    const a = pick(r, [1, 2, 3, -1, -2, -3]), h = nz(r, -6, 6), k = ri(r, -9, 9);
    const f = `${co(a)}${fac(h)}^2${k ? sgn(k) : ""}`;
    const t = r();
    if (t < 0.4) {
      return {
        q: `$y=${f}$ parabolünün tepe noktasının $x$ koordinatı kaçtır?`,
        qe: `Find the $x$-coordinate of the vertex of the parabola $y=${f}$.`,
        ...int(h),
      };
    }
    if (t < 0.75) {
      return {
        q: `$y=${f}$ parabolünün tepe noktasının $y$ koordinatı kaçtır?`,
        qe: `Find the $y$-coordinate of the vertex of the parabola $y=${f}$.`,
        ...int(k),
      };
    }
    return {
      q: `$y=${f}$ parabolünün simetri ekseni $x=m$ doğrusudur. $m$ kaçtır?`,
      qe: `The axis of symmetry of the parabola $y=${f}$ is the line $x=m$. Find $m$.`,
      ...int(h),
    };
  },
  b2_fform: (r) => {
    const a = pick(r, [1, 2, -1, 3, -2]), p = ri(r, -6, 6);
    let q; do { q = ri(r, -6, 6); } while (q === p);
    const f = `${co(a)}${fac(p)}${fac(q)}`;
    if (r() < 0.65) {
      const larger = coin(r);
      return {
        q: `$y=${f}$ grafiği $x$ eksenini iki noktada keser. ${larger ? "Büyük" : "Küçük"} olan $x$ değeri kaçtır?`,
        qe: `The graph of $y=${f}$ meets the $x$-axis at two points. Find the ${larger ? "larger" : "smaller"} $x$-intercept.`,
        ...int(larger ? Math.max(p, q) : Math.min(p, q)),
      };
    }
    return {
      q: `$y=${f}$ parabolünün simetri ekseni $x=m$ doğrusudur. $m$ kaçtır?${FRAC}`,
      qe: `The axis of symmetry of the parabola $y=${f}$ is the line $x=m$. Find $m$${FRACE}.`,
      ...fr(p + q, 2),
    };
  },
  b2_dpos: (r) => {
    if (r() < 0.7) {
      const b = nz(r, -8, 8), lhs = `${poly([[1, "x^2"], [b, "x"]])}+k`;
      return {
        q: `$${lhs}=0$ denkleminin iki farklı gerçek kökü var. $k$’nin alabileceği en büyük tam sayı değeri kaçtır?`,
        qe: `The equation $${lhs}=0$ has two distinct real roots. Find the largest integer value of $k$.`,
        ...int(below((b * b) / 4)),
      };
    }
    const { f, n } = rootCase(r);
    return {
      q: `$${f}=0$ denkleminin kaç farklı gerçek kökü vardır?`,
      qe: `How many distinct real roots does the equation $${f}=0$ have?`,
      ...int(n),
    };
  },
  b2_dzero: (r) => {
    const t = r();
    if (t < 0.4) {
      const m = ri(r, 1, 6);
      return {
        q: `$x^2+kx+${m * m}=0$ denkleminin iki eşit gerçek kökü (tek kökü) var ve $k>0$. $k$ kaçtır?`,
        qe: `The equation $x^2+kx+${m * m}=0$ has two equal real roots and $k>0$. Find $k$.`,
        ...int(2 * m),
      };
    }
    if (t < 0.75) {
      const h = nz(r, -6, 6), lhs = `${poly([[1, "x^2"], [-2 * h, "x"]])}+k`;
      return {
        q: `$${lhs}=0$ denkleminin iki eşit gerçek kökü var. $k$ kaçtır?`,
        qe: `The equation $${lhs}=0$ has two equal real roots. Find $k$.`,
        ...int(h * h),
      };
    }
    const a = pick(r, [1, 2, -1]), p = nz(r, -5, 5), f = quad(a, -2 * a * p, a * p * p);
    return {
      q: `$${f}=0$ denkleminin iki eşit kökü var. Bu kök kaçtır?`,
      qe: `The equation $${f}=0$ has a repeated root. Find it.`,
      ...int(p),
    };
  },
  b2_dneg: (r) => {
    if (r() < 0.75) {
      const b = nz(r, -8, 8), rhs = `${poly([[1, "x^2"], [b, "x"]])}+k`;
      return {
        q: `$y=${rhs}$ parabolü $x$ eksenine hiç değmiyor. $k$’nin alabileceği en küçük tam sayı değeri kaçtır?`,
        qe: `The parabola $y=${rhs}$ never meets the $x$-axis. Find the smallest integer value of $k$.`,
        ...int(above((b * b) / 4)),
      };
    }
    const { f, n } = rootCase(r);
    return {
      q: `$${f}=0$ denkleminin kaç farklı gerçek kökü vardır?`,
      qe: `How many distinct real roots does the equation $${f}=0$ have?`,
      ...int(n),
    };
  },
  b2_comp: (r) => {
    const a = nz(r, -4, 4), b = ri(r, -6, 6), F = (x) => a * x + b, fs = lin(a, b);
    let G, gs;
    if (coin(r)) { const c = ri(r, -5, 5); G = (x) => x * x + c; gs = poly([[1, "x^2"], [c, ""]]); }
    else { const c = nz(r, -3, 3), d = ri(r, -5, 5); G = (x) => c * x + d; gs = lin(c, d); }
    const k = ri(r, -3, 3), fg = coin(r), name = fg ? "f\\circ g" : "g\\circ f";
    return {
      q: `$f(x)=${fs}$ ve $g(x)=${gs}$ ise $(${name})(${k})$ kaçtır?`,
      qe: `Given $f(x)=${fs}$ and $g(x)=${gs}$, find $(${name})(${k})$.`,
      ...int(fg ? F(G(k)) : G(F(k))),
    };
  },
  b2_identity: (r) => {
    const a = nz(r, -5, 5), b = ri(r, -9, 9), k = ri(r, -6, 6), fs = lin(a, b);
    const t = r();
    if (t < 0.8) {
      const name = t < 0.4 ? "f\\circ I" : "I\\circ f";
      return {
        q: `$I(x)=x$ birim fonksiyon ve $f(x)=${fs}$. $(${name})(${k})$ kaçtır?`,
        qe: `$I(x)=x$ is the identity function and $f(x)=${fs}$. Find $(${name})(${k})$.`,
        ...int(a * k + b),
      };
    }
    return {
      q: `$I(x)=x$ birim fonksiyon ise $I\\big(I(${k})\\big)$ kaçtır?`,
      qe: `$I(x)=x$ is the identity function. Find $I\\big(I(${k})\\big)$.`,
      ...int(k),
    };
  },
  b2_invundo: (r) => {
    if (r() < 0.5) {
      const xs = [], ys = [];
      while (xs.length < 3) { const v = ri(r, -5, 9); if (!xs.includes(v)) xs.push(v); }
      while (ys.length < 3) { const v = ri(r, -5, 12); if (!ys.includes(v)) ys.push(v); }
      const j = ri(r, 0, 2), list = xs.map((x, i) => `f(${x})=${ys[i]}`).join(",\\ ");
      return {
        q: `Birebir bir $f$ fonksiyonu için $${list}$. $f^{-1}(${ys[j]})$ kaçtır?`,
        qe: `For a one-to-one function $f$, $${list}$. Find $f^{-1}(${ys[j]})$.`,
        ...int(xs[j]),
      };
    }
    const fs = pick(r, ["x^3+5", "7x-13", "2x^3-9", "\\dfrac{5x-1}{3}"]), k = ri(r, -9, 12);
    const expr = coin(r) ? `f\\big(f^{-1}(${k})\\big)` : `f^{-1}\\big(f(${k})\\big)`;
    return {
      q: `$f(x)=${fs}$ ise $${expr}$ kaçtır? (Hiç hesap yapmadan bulabilirsin!)`,
      qe: `Given $f(x)=${fs}$, find $${expr}$. (You can do it without any working!)`,
      ...int(k),
    };
  },
  b2_invfind: (r) => {
    const t = r();
    let fs, k, ans;
    if (t < 0.45) {
      const a = nz(r, -5, 5), b = ri(r, -9, 9); ans = ri(r, -4, 5);
      fs = lin(a, b); k = a * ans + b;
    } else if (t < 0.75) {
      const b = ri(r, -9, 9); ans = ri(r, -3, 3);
      fs = poly([[1, "x^3"], [b, ""]]); k = ans ** 3 + b;
    } else {
      const a = pick(r, [2, 3, 4]), b = nz(r, -6, 6); k = ri(r, -4, 5);
      fs = `\\dfrac{${lin(1, b)}}{${a}}`; ans = a * k - b;
    }
    return {
      q: `$f(x)=${fs}$ ise $f^{-1}(${k})$ kaçtır?`,
      qe: `Given $f(x)=${fs}$, find $f^{-1}(${k})$.`,
      ...int(ans),
    };
  },
  b2_invlin: (r) => {
    const t = r();
    if (t < 0.4) {
      const a = nz(r, -5, 5), b = nz(r, -9, 9), x0 = ri(r, -5, 5), fs = lin(a, b);
      return {
        q: `$f(x)=${fs}$ ise $f^{-1}(${a * x0 + b})$ kaçtır?`,
        qe: `Given $f(x)=${fs}$, find $f^{-1}(${a * x0 + b})$.`,
        ...int(x0),
      };
    }
    if (t < 0.7) {
      const a = ri(r, 2, 6), b = nz(r, -9, 9), fs = lin(a, b);
      return {
        q: `$f(x)=${fs}$ fonksiyonunun tersi $f^{-1}(x)=\\dfrac{x+p}{${a}}$ biçiminde yazılır. $p$ kaçtır?`,
        qe: `The inverse of $f(x)=${fs}$ can be written as $f^{-1}(x)=\\dfrac{x+p}{${a}}$. Find $p$.`,
        ...int(-b),
      };
    }
    const a = nz(r, -5, 5), b = ri(r, -9, 9), fs = lin(a, b);
    return {
      q: `$f(x)=${fs}$ ise $y=f^{-1}(x)$ doğrusunun eğimi kaçtır?${FRAC}`,
      qe: `Given $f(x)=${fs}$, find the gradient of the line $y=f^{-1}(x)$${FRACE}.`,
      ...fr(1, a),
    };
  },
  b2_invgraph: (r) => {
    if (r() < 0.7) {
      const p = ri(r, -6, 8), q = ri(r, -6, 9), askX = coin(r), c = askX ? "x" : "y";
      return {
        q: `${onF(p, q)} Buna karşılık gelen ve $y=f^{-1}(x)$ grafiğinin üzerinde olan noktanın $${c}$ koordinatı kaçtır?`,
        qe: `${onFE(p, q)} Find the $${c}$-coordinate of the corresponding point on the graph of $y=f^{-1}(x)$.`,
        ...int(askX ? q : p),
      };
    }
    const c = nz(r, -8, 8);
    return {
      q: `$y=f(x)$ grafiği $y$ eksenini $(0,\\ ${c})$ noktasında kesiyor. $y=f^{-1}(x)$ grafiği $x$ eksenini $(k,\\ 0)$ noktasında keser. $k$ kaçtır?`,
      qe: `The graph of $y=f(x)$ meets the $y$-axis at $(0,\\ ${c})$. The graph of $y=f^{-1}(x)$ meets the $x$-axis at $(k,\\ 0)$. Find $k$.`,
      ...int(c),
    };
  },
  b2_invdom: (r) => {
    const t = r(), k = ri(r, -6, 9), tail = k ? sgn(k) : "";
    if (t < 0.35) {
      return {
        q: `$f(x)=x^2${tail}$ ve $x\\ge 0$. $f^{-1}$’in tanım kümesindeki en küçük sayı kaçtır?`,
        qe: `$f(x)=x^2${tail}$ for $x\\ge 0$. Find the smallest number in the domain of $f^{-1}$.`,
        ...int(k),
      };
    }
    if (t < 0.7) {
      const h = ri(r, -5, 5);
      return {
        q: `$f(x)=\\sqrt{${lin(1, -h)}}${tail}$. $f^{-1}$’in tanım kümesindeki en küçük sayı kaçtır?`,
        qe: `$f(x)=\\sqrt{${lin(1, -h)}}${tail}$. Find the smallest number in the domain of $f^{-1}$.`,
        ...int(k),
      };
    }
    const a = pick(r, [2, 3, 5]);
    return {
      q: `$f(x)=${a}^x${tail}$. $f^{-1}$’in tanım kümesi $x>m$ biçimindedir. $m$ kaçtır?`,
      qe: `$f(x)=${a}^x${tail}$. The domain of $f^{-1}$ is $x>m$. Find $m$.`,
      ...int(k),
    };
  },
  b2_trup: (r) => {
    const p = ri(r, -6, 6), q = ri(r, -6, 6), b = nz(r, -7, 7), g = `f(x)${sgn(b)}`;
    const askY = r() < 0.75, c = askY ? "y" : "x";
    return { q: `${onF(p, q)} ${imgQ(g, c)}`, qe: `${onFE(p, q)} ${imgQE(g, c)}`, ...int(askY ? q + b : p) };
  },
  b2_trright: (r) => {
    const p = ri(r, -6, 6), q = ri(r, -6, 6), a = nz(r, -6, 6), g = `f(x${sgn(-a)})`;
    const askX = r() < 0.75, c = askX ? "x" : "y";
    return { q: `${onF(p, q)} ${imgQ(g, c)}`, qe: `${onFE(p, q)} ${imgQE(g, c)}`, ...int(askX ? p + a : q) };
  },
  b2_trrefx: (r) => {
    const p = nz(r, -6, 6), q = nz(r, -6, 6), g = "-f(x)";
    const askY = r() < 0.75, c = askY ? "y" : "x";
    return { q: `${onF(p, q)} ${imgQ(g, c)}`, qe: `${onFE(p, q)} ${imgQE(g, c)}`, ...int(askY ? -q : p) };
  },
  b2_trrefy: (r) => {
    const p = nz(r, -6, 6), q = nz(r, -6, 6), g = "f(-x)";
    const askX = r() < 0.75, c = askX ? "x" : "y";
    return { q: `${onF(p, q)} ${imgQ(g, c)}`, qe: `${onFE(p, q)} ${imgQE(g, c)}`, ...int(askX ? -p : q) };
  },
  b2_trvs: (r) => {
    const p = ri(r, -6, 6), half = r() < 0.25;
    const q = half ? 2 * nz(r, -5, 5) : nz(r, -6, 6), k = half ? 0.5 : pick(r, [2, 3, 4, 5]);
    const g = half ? "\\tfrac{1}{2}f(x)" : `${k}f(x)`;
    const askY = r() < 0.8, c = askY ? "y" : "x";
    return { q: `${onF(p, q)} ${imgQ(g, c)}`, qe: `${onFE(p, q)} ${imgQE(g, c)}`, ...int(askY ? k * q : p) };
  },
  b2_trhs: (r) => {
    const q = nz(r, -6, 6), half = r() < 0.25;
    if (half) {
      const p = ri(r, -6, 6), g = "f\\left(\\tfrac{1}{2}x\\right)";
      return { q: `${onF(p, q)} ${imgQ(g, "x")}`, qe: `${onFE(p, q)} ${imgQE(g, "x")}`, ...int(2 * p) };
    }
    const k = pick(r, [2, 3, 4]), p = r() < 0.7 ? k * ri(r, -4, 4) : nz(r, -9, 9), g = `f(${k}x)`;
    const askX = r() < 0.8;
    return {
      q: `${onF(p, q)} ${imgQ(g, askX ? "x" : "y")}${askX ? FRAC : ""}`,
      qe: `${onFE(p, q)} ${imgQE(g, askX ? "x" : "y")}`,
      ...(askX ? fr(p, k) : int(q)),
    };
  },
  b2_recip: (r) => {
    const t = r();
    if (t < 0.3) {
      const n = ri(r, 2, 9), neg = coin(r), arg = `${neg ? "-" : ""}\\tfrac{1}{${n}}`;
      return {
        q: `$f(x)=\\dfrac{1}{x}$ ise $f\\left(${arg}\\right)$ kaçtır?`,
        qe: `Given $f(x)=\\dfrac{1}{x}$, find $f\\left(${arg}\\right)$.`,
        ...int(neg ? -n : n),
      };
    }
    if (t < 0.55) {
      const k = nz(r, -9, 9);
      return {
        q: `$f(x)=\\dfrac{1}{x}$ ise $f\\big(f(${k})\\big)$ kaçtır?`,
        qe: `Given $f(x)=\\dfrac{1}{x}$, find $f\\big(f(${k})\\big)$.`,
        ...int(k),
      };
    }
    if (t < 0.8) {
      const h = nz(r, -6, 6);
      return {
        q: `$y=\\dfrac{1}{x${sgn(-h)}}$ grafiğinin dikey asimptotu $x=m$ doğrusudur. $m$ kaçtır?`,
        qe: `The vertical asymptote of $y=\\dfrac{1}{x${sgn(-h)}}$ is the line $x=m$. Find $m$.`,
        ...int(h),
      };
    }
    const c = nz(r, -6, 6);
    return {
      q: `$y=\\dfrac{1}{x}${sgn(c)}$ grafiğinin yatay asimptotu $y=m$ doğrusudur. $m$ kaçtır?`,
      qe: `The horizontal asymptote of $y=\\dfrac{1}{x}${sgn(c)}$ is the line $y=m$. Find $m$.`,
      ...int(c),
    };
  },
  b2_ratv: (r) => {
    const { c, d, tex } = ratParts(r);
    return {
      q: `$y=${tex}$ grafiğinin dikey asimptotu $x=m$ doğrusudur. $m$ kaçtır?${FRAC}`,
      qe: `The vertical asymptote of $y=${tex}$ is the line $x=m$. Find $m$${FRACE}.`,
      ...fr(-d, c),
    };
  },
  b2_rath: (r) => {
    const { a, c, tex } = ratParts(r);
    return {
      q: `$y=${tex}$ grafiğinin yatay asimptotu $y=m$ doğrusudur. $m$ kaçtır?${FRAC}`,
      qe: `The horizontal asymptote of $y=${tex}$ is the line $y=m$. Find $m$${FRACE}.`,
      ...fr(a, c),
    };
  },
  b2_exp: (r) => {
    const a = pick(r, [2, 3, 4, 5, 10]), k = nz(r, -7, 7), t = r(), fs = `${a}^x${sgn(k)}`;
    if (t < 0.4) {
      return {
        q: `$y=${fs}$ grafiğinin yatay asimptotu $y=m$ doğrusudur. $m$ kaçtır?`,
        qe: `The horizontal asymptote of $y=${fs}$ is the line $y=m$. Find $m$.`,
        ...int(k),
      };
    }
    if (t < 0.75) {
      return {
        q: `$y=${fs}$ grafiği $y$ eksenini $(0,\\ m)$ noktasında keser. $m$ kaçtır?`,
        qe: `The graph of $y=${fs}$ meets the $y$-axis at $(0,\\ m)$. Find $m$.`,
        ...int(1 + k),
      };
    }
    const x = ri(r, 0, a === 10 ? 2 : 3);
    return {
      q: `$y=${a}^x$ grafiği $(${x},\\ m)$ noktasından geçer. $m$ kaçtır?`,
      qe: `The graph of $y=${a}^x$ passes through $(${x},\\ m)$. Find $m$.`,
      ...int(a ** x),
    };
  },
  b2_log: (r) => {
    const a = pick(r, [2, 3, 5, 10]), t = r();
    if (t < 0.4) {
      const n = ri(r, 0, a === 2 ? 5 : 3);
      return {
        q: `$y=\\log_{${a}} x$ grafiği $(k,\\ ${n})$ noktasından geçer. $k$ kaçtır?`,
        qe: `The graph of $y=\\log_{${a}} x$ passes through $(k,\\ ${n})$. Find $k$.`,
        ...int(a ** n),
      };
    }
    const h = nz(r, -6, 6), fs = `\\log_{${a}}(x${sgn(-h)})`;
    if (t < 0.7) {
      return {
        q: `$y=${fs}$ grafiğinin dikey asimptotu $x=m$ doğrusudur. $m$ kaçtır?`,
        qe: `The vertical asymptote of $y=${fs}$ is the line $x=m$. Find $m$.`,
        ...int(h),
      };
    }
    return {
      q: `$y=${fs}$ grafiği $x$ eksenini $(m,\\ 0)$ noktasında keser. $m$ kaçtır?`,
      qe: `The graph of $y=${fs}$ meets the $x$-axis at $(m,\\ 0)$. Find $m$.`,
      ...int(h + 1),
    };
  },
  b2_ln: (r) => {
    const t = r();
    if (t < 0.35) {
      const c = nz(r, -9, 9), fs = `\\ln(x${sgn(c)})`;
      return {
        q: `$f(x)=${fs}$ fonksiyonunun tanımlı olması için $x$ hangi sayıdan büyük olmalıdır?`,
        qe: `For $f(x)=${fs}$ to be defined, $x$ must be greater than which number?`,
        ...int(-c),
      };
    }
    if (t < 0.75) {
      const a = pick(r, [2, 3, 4, 5]), b = nz(r, -12, 12), fs = `\\ln(${lin(a, -b)})`;
      return {
        q: `$f(x)=${fs}$ fonksiyonunun tanımlı olması için $x$ hangi sayıdan büyük olmalıdır?${FRAC}`,
        qe: `For $f(x)=${fs}$ to be defined, $x$ must be greater than which number${FRACE}?`,
        ...fr(b, a),
      };
    }
    const a = pick(r, [1, 2, 3]), b = ri(r, 1, 12), fs = `\\ln(${poly([[b, ""], [-a, "x"]])})`;
    return {
      q: `$f(x)=${fs}$ fonksiyonunun tanımlı olması için $x$ hangi sayıdan küçük olmalıdır?${FRAC}`,
      qe: `For $f(x)=${fs}$ to be defined, $x$ must be less than which number${FRACE}?`,
      ...fr(b, a),
    };
  },
};
