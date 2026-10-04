/* FormUp v2 — parça "b5": Konu 5 · Kalkülüs (b5, kitapçık 5.3, 5.5, 5.6, 5.9, 5.10, 5.11) + Kalkülüs: Kitapçık Dışı (x5).
   Kartlar öğretme sırasıyla (kolaydan zora). Biçim: content/SPEC.md */
import { ri, pick, fr, int } from "./genkit.js";

export const CARDS = String.raw`
## b5

# b5-pow-deriv | 3 | $x^n$’in türevi | Derivative of $x^n$
L (x^n)'
R nx^{n-1}
X x^{n-1} ;; nx^{n} ;; (n-1)x^{n}
K $n$: üs (herhangi bir reel sayı olabilir)
KE $n$: the power (any real number)
U Kuvvet içeren bir fonksiyonun eğimini (türevini) bulur.
UE Finds the derivative (gradient function) of a power of $x$.
W Üs öne iner ve çarpan olur, sonra üs bir azalır. Örneğin $x^3$ → $3x^2$.
WE The power comes down as a multiplier and the power drops by one.
E $f(x)=x^5$ ise $f'(x)=5x^4$.
H "Üs öne in, bir eksil!"
T derivative = türev ;; power = üs, kuvvet ;; differentiate = türevini almak
Q $f(x)=x^4$ eğrisinin herhangi bir noktadaki eğimini veren fonksiyonu bul.
QE Find the function that gives the gradient of the curve $f(x)=x^4$ at any point.
B [[n]]x^{[[n-1]]} || n+1 ;; x ;; 1
C n=3:1:6:1 ; x=2:-3:3:1 => n*x^(n-1)
CT f'(@x@)=@n@\cdot @x@^{@n@-1}=@=@
G b5_pow
LAB tangent
V x,n:int:1:6
BK 5.3

# b5-sin-deriv | 3 | $\sin x$’in türevi | Derivative of $\sin x$
L (\sin x)'
R \cos x
X -\cos x ;; -\sin x ;; \sin x
K $x$ radyan cinsinden olmalı.
KE $x$ must be in radians.
U Sinüs dalgasının her noktadaki eğimini verir.
UE Gives the gradient of the sine curve at every point.
W $\sin x$ grafiği $x=0$’da en dik yükselir; $\cos 0=1$ tam da bu eğimdir.
WE The sine curve is steepest at $x=0$, and $\cos 0=1$ is exactly that gradient.
H sin → cos (işaret değişmez).
T radian = radyan ;; derivative = türev ;; gradient = eğim
Q Bir salıncağın konumu $\sin t$ ile veriliyor. Konumun anlık değişim hızını veren fonksiyon nedir?
QE A swing's position is given by $\sin t$. Which function gives its instantaneous rate of change?
C x=0:-3.14:3.14:0.01 => cos(x)
CT \cos(@x@)=@=@
G b5_sin
V x:-3:3
BK 5.6

# b5-cos-deriv | 3 | $\cos x$’in türevi | Derivative of $\cos x$
L (\cos x)'
R -\sin x
X \sin x ;; -\cos x ;; \cos x
K $x$ radyan cinsinden olmalı.
KE $x$ must be in radians.
U Kosinüs dalgasının her noktadaki eğimini verir.
UE Gives the gradient of the cosine curve at every point.
W $\cos x$ grafiği $x=0$’dan sonra aşağı iner, yani eğim negatiftir; bu yüzden eksi işareti gelir.
WE Just after $x=0$ the cosine curve goes down, so its gradient is negative, hence the minus sign.
H cos → eksi sin.
T derivative = türev ;; radian = radyan
Q $f(x)=\cos x$ eğrisinin $x=\tfrac{\pi}{2}$ noktasındaki eğimi kaçtır?
QE What is the gradient of $f(x)=\cos x$ at $x=\tfrac{\pi}{2}$?
B [[-]]\sin x || + ;; \cos
C x=1.57:-3.14:3.14:0.01 => -sin(x)
CT -\sin(@x@)=@=@
G b5_cos
V x:-3:3
BK 5.6

# b5-exp-deriv | 3 | $e^x$’in türevi | Derivative of $e^x$
L (e^x)'
R e^x
X xe^{x-1} ;; e ;; e^{x-1}
K $e\approx 2{,}718$ (Euler sayısı)
KE $e\approx 2.718$ (Euler's number)
U $e^x$’in türevini bulur: kendisi!
UE Finds the derivative of $e^x$: it is itself!
W $e^x$ özel bir fonksiyondur: her noktadaki eğimi, o noktadaki yüksekliğine eşittir.
WE $e^x$ is special: its gradient at any point equals its height there.
H $e^x$ türevde hiç değişmez.
T exponential function = üstel fonksiyon ;; derivative = türev
Q Bir bakteri sayısı $e^t$ ile artıyor. Artış hızını veren fonksiyon nedir?
QE A bacteria population grows like $e^t$. Which function gives its rate of growth?
C x=1:-3:3:0.1 => exp(x)
CT e^{@x@}=@=@
G b5_exp
V x:-3:3
BK 5.6

# b5-ln-deriv | 3 | $\ln x$’in türevi | Derivative of $\ln x$
L (\ln x)'
R \dfrac{1}{x}
X \ln x ;; \dfrac{1}{\ln x} ;; e^x
K $x>0$
KE $x>0$
U Doğal logaritmanın eğimini bulur.
UE Finds the gradient of the natural logarithm.
W $\ln x$ gittikçe yavaş büyür; eğimi $\tfrac{1}{x}$ de $x$ büyüdükçe küçülür.
WE $\ln x$ grows more and more slowly, and $\tfrac{1}{x}$ gets smaller as $x$ grows.
H ln → bir bölü $x$.
T natural logarithm = doğal logaritma ;; derivative = türev
Q $f(x)=\ln x$ eğrisinin $x=4$ noktasındaki eğimi kaçtır?
QE What is the gradient of $f(x)=\ln x$ at $x=4$?
B \dfrac{[[1]]}{[[x]]} || \ln x ;; e^x ;; x^2
C x=2:0.1:10:0.1 => 1/x
CT \dfrac{1}{@x@}=@=@
G b5_ln
V x
BK 5.6

# b5-chain | 3 | Zincir kuralı | Chain rule
L \dfrac{dy}{dx}
R \dfrac{dy}{du}\times\dfrac{du}{dx}
X \dfrac{dy}{du}+\dfrac{du}{dx} ;; \dfrac{dy}{du}\div\dfrac{du}{dx} ;; \dfrac{du}{dy}\times\dfrac{du}{dx}
K $y=g(u)$, $u=f(x)$ (iç içe fonksiyon)
KE $y=g(u)$ where $u=f(x)$ (a composite function)
U İç içe geçmiş fonksiyonların türevini alır, ör. $(3x+1)^5$.
UE Differentiates composite functions such as $(3x+1)^5$.
W Önce dıştakinin türevini al, sonra içtekinin türeviyle çarp. $du$’lar sadeleşiyormuş gibi düşün.
WE Differentiate the outside, then multiply by the derivative of the inside; the $du$'s "cancel".
E $y=(3x+1)^5$: $u=3x+1$, $\dfrac{dy}{dx}=5u^4\cdot 3=15(3x+1)^4$.
H Dış türev × iç türev.
T chain rule = zincir kuralı ;; composite function = bileşke fonksiyon
Q $y=(2x-7)^{10}$ fonksiyonunun türevini bul.
QE Differentiate $y=(2x-7)^{10}$.
B \dfrac{dy}{[[du]]}\times\dfrac{[[du]]}{dx} || dx ;; dy
C a=3:1:5:1 ; b=1:-5:5:1 ; n=5:2:6:1 ; x=0:-2:2:1 => n*(a*x+b)^(n-1)*a
CT \dfrac{d}{dx}(@a@x+@b@)^{@n@}\Big|_{x=@x@}=@=@
G b5_chain
BK 5.6

# b5-product | 3 | Çarpım kuralı | Product rule
L \dfrac{dy}{dx}
R u\dfrac{dv}{dx}+v\dfrac{du}{dx}
X \dfrac{du}{dx}\times\dfrac{dv}{dx} ;; u\dfrac{dv}{dx}-v\dfrac{du}{dx} ;; u\dfrac{du}{dx}+v\dfrac{dv}{dx}
K $y=uv$; $u$ ve $v$, $x$’in fonksiyonları
KE $y=uv$ where $u$ and $v$ are functions of $x$
U İki fonksiyonun çarpımının türevini alır, ör. $x^2\sin x$.
UE Differentiates a product of two functions such as $x^2\sin x$.
W Çarpımın türevi, türevlerin çarpımı DEĞİLDİR. Her seferinde birini türevle, diğerini olduğu gibi bırak, sonra topla.
WE The derivative of a product is not the product of the derivatives: differentiate one at a time and add.
E $y=x^2e^x$: $x^2e^x+e^x\cdot 2x$.
H "Birinci × ikincinin türevi + ikinci × birincinin türevi."
T product rule = çarpım kuralı ;; product = çarpım
Q $y=x^3\ln x$ fonksiyonunun türevini bul.
QE Differentiate $y=x^3\ln x$.
B u\dfrac{[[dv]]}{dx}[[+]]v\dfrac{[[du]]}{dx} || - ;; dx ;; \times
G b5_product
BK 5.6

# b5-quotient | 2 | Bölüm kuralı | Quotient rule
L \dfrac{dy}{dx}
R \dfrac{v\dfrac{du}{dx}-u\dfrac{dv}{dx}}{v^2}
X \dfrac{u\dfrac{dv}{dx}-v\dfrac{du}{dx}}{v^2} ;; \dfrac{v\dfrac{du}{dx}+u\dfrac{dv}{dx}}{v^2} ;; \dfrac{v\dfrac{du}{dx}-u\dfrac{dv}{dx}}{u^2}
K $y=\dfrac{u}{v}$, $v\ne 0$
KE $y=\dfrac{u}{v}$, $v\ne 0$
U Bir kesir biçimindeki fonksiyonun türevini alır, ör. $\dfrac{x}{x+1}$.
UE Differentiates a quotient such as $\dfrac{x}{x+1}$.
W Payda ($v$) ile başla ve EKSİ kullan; sıra önemlidir. En sonda paydanın karesine böl.
WE Start with the denominator $v$ and subtract; the order matters. Divide by $v$ squared.
H "Alt × üstün türevi − üst × altın türevi, bölü alt kare."
T quotient rule = bölüm kuralı ;; numerator = pay ;; denominator = payda
Q $y=\dfrac{\sin x}{x}$ fonksiyonunun türevini bul.
QE Differentiate $y=\dfrac{\sin x}{x}$.
B \dfrac{v\dfrac{du}{dx}[[-]]u\dfrac{dv}{dx}}{[[v^2]]} || + ;; u^2 ;; v
G b5_quotient
BK 5.6

# b5-int-pow | 3 | $x^n$’in integrali | Integral of $x^n$
L \int x^n\,dx
R \dfrac{x^{n+1}}{n+1}+C
X \dfrac{x^{n+1}}{n+1} ;; nx^{n-1}+C ;; \dfrac{x^{n}}{n}+C
K $n\ne -1$; $C$: integral sabiti
KE $n\ne -1$; $C$: constant of integration
U Türevin tersini yapar: türevi $x^n$ olan fonksiyonu bulur.
UE Reverses differentiation: finds a function whose derivative is $x^n$.
W Türevde üs azalıp öne iniyordu; integralde üs bir artar ve yeni üsse bölünür. $+C$ unutma: sabitin türevi 0’dır.
WE Add one to the power and divide by the new power; add $C$ because constants differentiate to 0.
E $\int x^3\,dx=\dfrac{x^4}{4}+C$
H "Üssü bir artır, yeni üsse böl, $+C$ ekle."
T integral = integral ;; constant of integration = integral sabiti ;; antiderivative = ters türev
Q Eğimi her noktada $x^2$ olan bir eğrinin denklemi nedir?
QE A curve has gradient $x^2$ at every point. What is its equation?
B \dfrac{x^{[[n+1]]}}{[[n+1]]}+[[C]] || n-1 ;; n ;; 0
C n=3:0:6:1 ; x=2:0:4:1 => x^(n+1)/(n+1)
CT \dfrac{@x@^{@n@+1}}{@n@+1}=@=@
G b5_intpow
BK 5.5

# b5-int-recip | 3 | $\tfrac{1}{x}$’in integrali | Integral of $\tfrac{1}{x}$
L \int \dfrac{1}{x}\,dx
R \ln|x|+C
X \dfrac{x^0}{0}+C ;; -\dfrac{1}{x^2}+C ;; \ln x^2+C
K $x\ne 0$
KE $x\ne 0$
U $n=-1$ olunca kuvvet kuralı bozulur; o zaman bu kartı kullan.
UE Use this when $n=-1$, where the power rule fails.
W $(\ln x)'=\tfrac{1}{x}$ idi, integral bunun tersidir. Mutlak değer, negatif $x$’ler için de çalışmasını sağlar.
WE Since $(\ln x)'=\tfrac{1}{x}$, integration reverses it; the modulus makes it work for negative $x$ too.
H "Bir bölü $x$ → ln mutlak $x$."
T natural logarithm = doğal logaritma ;; modulus = mutlak değer
Q $\int_1^{e} \dfrac{1}{x}\,dx$ kaçtır?
QE Evaluate $\int_1^{e} \dfrac{1}{x}\,dx$.
B \ln[[|x|]]+C || x^2 ;; \dfrac{1}{x}
C x=2:0.1:10:0.1 => ln(abs(x))
CT \ln|@x@|=@=@
G b5_intrecip
BK 5.10

# b5-int-sin | 3 | $\sin x$’in integrali | Integral of $\sin x$
L \int \sin x\,dx
R -\cos x+C
X \cos x+C ;; -\sin x+C ;; \sin x\cos x+C
K $x$ radyan cinsinden
KE $x$ in radians
U Sinüsün integralini alır.
UE Integrates the sine function.
W $(-\cos x)'=\sin x$ olduğu için cevap $-\cos x$’tir. Kontrol: türevini al, $\sin x$ çıkmalı.
WE Because $(-\cos x)'=\sin x$; always check by differentiating.
H İntegralde sin → eksi cos.
T integral = integral ;; radian = radyan
Q $\int_0^{\pi} \sin x\,dx$ kaçtır?
QE Evaluate $\int_0^{\pi} \sin x\,dx$.
B [[-]]\cos x+C || + ;; \sin
G b5_intsin
BK 5.10

# b5-int-cos | 3 | $\cos x$’in integrali | Integral of $\cos x$
L \int \cos x\,dx
R \sin x+C
X -\sin x+C ;; \cos x+C ;; -\cos x+C
K $x$ radyan cinsinden
KE $x$ in radians
U Kosinüsün integralini alır.
UE Integrates the cosine function.
W $(\sin x)'=\cos x$ olduğu için integral $\sin x$’tir.
WE Because $(\sin x)'=\cos x$.
H İntegralde cos → sin (eksi yok).
T integral = integral ;; radian = radyan
Q $\int_0^{\pi/2} \cos x\,dx$ kaçtır?
QE Evaluate $\int_0^{\pi/2} \cos x\,dx$.
B [[\sin]] x+C || \cos ;; -\sin
G b5_intcos
BK 5.10

# b5-int-exp | 3 | $e^x$’in integrali | Integral of $e^x$
L \int e^x\,dx
R e^{x}+C
X \dfrac{e^{x+1}}{x+1}+C ;; xe^x+C ;; e^{x+1}+C
U $e^x$’in integralini alır.
UE Integrates $e^x$.
W $e^x$’in türevi kendisiydi, integrali de kendisidir.
WE $e^x$ is its own derivative, so it is also its own integral.
H $e^x$ her yerde $e^x$ (+C).
T exponential function = üstel fonksiyon ;; integral = integral
Q $\int_0^{\ln 5} e^x\,dx$ kaçtır?
QE Evaluate $\int_0^{\ln 5} e^x\,dx$.
B e^{[[x]]}+[[C]] || x+1 ;; 0
G b5_intexp
BK 5.10

# b5-area-pos | 3 | Eğri ile $x$ ekseni arasındaki alan | Area between a curve and the x-axis
L A
R \int_{a}^{b} y\,dx
X \int_b^a y\,dx ;; y(b)-y(a) ;; \int_a^b x\,dy
K $f(x)>0$ (eğri $x$ ekseninin üstünde), $a$ ve $b$: sınırlar
KE $f(x)>0$ (curve above the x-axis), $a$ and $b$: the limits
U Eğrinin altında, $x=a$ ile $x=b$ arasında kalan alanı bulur.
UE Finds the area under the curve between $x=a$ and $x=b$.
W Alanı çok ince dikdörtgenlere böl: her biri yükseklik $y$ × genişlik $dx$. İntegral hepsini toplar.
WE Split the area into thin strips of height $y$ and width $dx$; the integral adds them up.
E $y=x^2$, $0$’dan $3$’e: $A=\left[\dfrac{x^3}{3}\right]_0^3=9$.
T area = alan ;; limits = sınırlar ;; definite integral = belirli integral
Q $y=x^2$ eğrisi, $x$ ekseni ve $x=0$, $x=3$ doğruları arasında kalan bölgenin alanı nedir?
QE Find the area of the region bounded by $y=x^2$, the x-axis and the lines $x=0$ and $x=3$.
B \int_{[[a]]}^{[[b]]} y\,dx || 0 ;; x
C b=3:1:6:1 => b^3/3
CT \int_0^{@b@} x^2\,dx=@=@
G b5_area
LAB area
BK 5.5

# b5-acc | 2 | İvme | Acceleration
L a
R \dfrac{dv}{dt}=\dfrac{d^2s}{dt^2}
X \dfrac{ds}{dt}=\dfrac{d^2v}{dt^2} ;; \dfrac{dv}{ds} ;; \int v\,dt
K $s$: konum (yer değiştirme), $v$: hız, $t$: zaman
KE $s$: displacement, $v$: velocity, $t$: time
U Hızın ne kadar hızlı değiştiğini (ivmeyi) bulur.
UE Finds how fast the velocity is changing (acceleration).
W Konumun türevi hız, hızın türevi ivmedir. Yani ivme, konumun ikinci türevidir.
WE Displacement differentiates to velocity, velocity to acceleration: acceleration is the second derivative of $s$.
E $v=3t^2$ ise $a=6t$; $t=2$’de $a=12$.
H $s$ → $v$ → $a$: her okta bir türev.
T acceleration = ivme ;; velocity = hız ;; second derivative = ikinci türev
Q Bir arabanın hızı $v=t^2+4t$ m/s. $t=3$ saniyede hızı ne kadar hızlı artıyor?
QE A car's velocity is $v=t^2+4t$ m/s. How fast is its velocity increasing at $t=3$ s?
B \dfrac{d[[v]]}{dt}=\dfrac{d^2[[s]]}{dt^2} || a ;; t
C c=3:1:5:1 ; t=2:0:10:1 => 2*c*t
CT v=@c@t^2\Rightarrow a=2\cdot @c@\cdot @t@=@=@
G b5_acc
BK 5.9

# b5-displacement | 2 | Yer değiştirme | Displacement
L \text{displacement}
R \int_{t_1}^{t_2} v(t)\,dt
X \int_{t_1}^{t_2} |v(t)|\,dt ;; v(t_2)-v(t_1) ;; \int_{t_1}^{t_2} a(t)\,dt
K $t_1$’den $t_2$’ye; $v(t)$: hız
KE from $t_1$ to $t_2$; $v(t)$: velocity
U Cismin başladığı yerden ne kadar uzakta bittiğini (yön dahil) bulur.
UE Finds how far the object ends up from where it started (with direction).
W Hız negatifken geri gidersin; integral bu geri gidişi çıkarır, yani net değişimi verir.
WE When $v$ is negative the object moves back, and the integral subtracts that: it gives the net change.
T displacement = yer değiştirme ;; velocity = hız
Q Bir cisim $v=2t+1$ m/s hızla gidiyor. İlk 3 saniyede başlangıç noktasına göre konumu ne kadar değişti?
QE An object moves with velocity $v=2t+1$ m/s. By how much does its position change in the first 3 seconds?
B \int_{t_1}^{t_2} [[v(t)]]\,dt || |v(t)| ;; a(t)
C c=1:-5:5:1 ; T=3:1:8:1 => T^2+c*T
CT \int_0^{@T@}(2t+@c@)\,dt=@=@
G b5_disp
BK 5.9

# b5-distance | 2 | Alınan toplam yol | Distance travelled
L \text{distance}
R \int_{t_1}^{t_2} |v(t)|\,dt
X \int_{t_1}^{t_2} v(t)\,dt ;; \left|\int_{t_1}^{t_2} a(t)\,dt\right| ;; |v(t_2)-v(t_1)|
K $t_1$’den $t_2$’ye; $|v(t)|$: süratin büyüklüğü
KE from $t_1$ to $t_2$; $|v(t)|$: speed
U Yön önemsiz, cismin toplam kaç metre gittiğini bulur.
UE Finds the total distance travelled, whatever the direction.
W 5 m ileri, 5 m geri gidersen yer değiştirme 0 ama yol 10 m’dir. Mutlak değer geri gidişi de pozitif sayar.
WE Going 5 m forward and 5 m back gives displacement 0 but distance 10 m; the modulus counts both.
H Yol hep pozitif: mutlak değer!
T distance travelled = alınan yol ;; speed = sürat ;; modulus = mutlak değer
Q Bir top $v=t-2$ m/s hızla hareket ediyor, önce geri sonra ileri gidiyor. 0–4 s arasında toplam kaç metre yol aldı?
QE A ball moves with $v=t-2$ m/s, first backwards then forwards. What total distance does it travel from 0 to 4 s?
B \int_{t_1}^{t_2} [[|v(t)|]]\,dt || v(t) ;; a(t)
C k=2:1:6:1 => k^2
CT \int_0^{2\cdot @k@}|t-@k@|\,dt=@=@
G b5_dist
BK 5.9

# b5-area-abs | 2 | $x$ ekseninin altına da inen eğride alan | Area enclosed by a curve and the x-axis
L A
R \int_a^b |y|\,dx
X \int_a^b y\,dx ;; \left|\int_a^b y\,dx\right| ;; \int_a^b y^2\,dx
K Eğri $x$ ekseninin altına inebilir.
KE The curve may go below the x-axis.
U Eğrinin bir kısmı $x$ ekseninin altında olsa bile toplam alanı doğru bulur.
UE Finds the total area even when part of the curve is below the x-axis.
W Eksenin altındaki parça integralde eksi çıkar ve üsttekini götürür. $|y|$ alırsan her parça pozitif sayılır. (GDC ile hesapla.)
WE Parts below the axis give negative integrals; taking $|y|$ makes every part count as positive area.
H Alan asla negatif değildir.
T area = alan ;; modulus = mutlak değer ;; GDC = grafik hesap makinesi
Q $y=x$ doğrusu ile $x$ ekseni arasında, $x=-2$ ile $x=2$ arasında kalan toplam alan nedir?
QE Find the total area between $y=x$ and the x-axis from $x=-2$ to $x=2$.
B \int_a^b [[|y|]]\,dx || y ;; y^2
C a=2:1:6:1 ; b=2:1:6:1 => (a^2+b^2)/2
CT \int_{-@a@}^{@b@}|x|\,dx=@=@
G b5_absarea
LAB area
BK 5.11

## x5

# x5-const-deriv | 3 | Sabitin türevi | Derivative of a constant
L (k)'
R 0
X k ;; 1 ;; kx
K $k$: sabit sayı (ör. 7)
KE $k$: a constant (e.g. 7)
U Fonksiyondaki sabit sayıların türevde yok olduğunu söyler.
UE Says that constant terms disappear when you differentiate.
W $y=7$ yatay bir doğrudur; yatay doğrunun eğimi 0’dır.
WE $y=7$ is a horizontal line, and a horizontal line has gradient 0.
H Sabit → sıfır.
T constant = sabit ;; derivative = türev
Q $f(x)=x^2+9$ fonksiyonunun türevini alırken 9’a ne olur?
QE When you differentiate $f(x)=x^2+9$, what happens to the 9?
V k,x
B [[0]] || k ;; 1
LAB tangent

# x5-const-mult | 3 | Sabitle çarpımın türevi | Derivative of a constant multiple
L (k\,f(x))'
R k\,f'(x)
X k'\,f'(x) ;; f'(x) ;; k+f'(x)
K $k$: sabit sayı
KE $k$: a constant
U Önündeki sabit sayı türevde aynen kalır.
UE A constant multiplier stays as it is when you differentiate.
W Grafiği $k$ kat dikleştirirsen eğim de $k$ kat olur.
WE Stretching the graph by a factor $k$ multiplies every gradient by $k$.
E $(5x^2)'=5\cdot 2x=10x$
T constant multiple = sabit katı ;; derivative = türev
Q $f(x)=6\sin x$ fonksiyonunun türevini bul.
QE Differentiate $f(x)=6\sin x$.
B [[k]]\,f'(x) || 1 ;; 0
C k=5:-10:10:1 ; x=2:-3:3:1 => k*2*x
CT (@k@x^2)'\big|_{x=@x@}=@k@\cdot 2\cdot @x@=@=@

# x5-sum-rule | 3 | Toplamın türevi | Derivative of a sum
L (f(x)+g(x))'
R f'(x)+g'(x)
X f'(x)\cdot g'(x) ;; f'(x)+g(x) ;; f(x)+g'(x)
U Toplamın türevini terim terim almanı sağlar.
UE Lets you differentiate a sum term by term.
W Her terimin eğimi ayrı ayrı toplanır; terimler birbirini etkilemez.
WE The gradients of the terms simply add up.
E $(x^3+x^2)'=3x^2+2x$
T sum = toplam ;; term = terim ;; differentiate = türevini almak
Q $f(x)=x^4+\cos x$ fonksiyonunun türevini bul.
QE Differentiate $f(x)=x^4+\cos x$.
B [[f'(x)]]+[[g'(x)]] || f(x) ;; g(x)

# x5-axn | 3 | $ax^n$’in türevi | Derivative of $ax^n$
L (ax^n)'
R anx^{n-1}
X ax^{n-1} ;; anx^{n} ;; nx^{n-1}
K $a$: katsayı, $n$: üs
KE $a$: coefficient, $n$: power
U Katsayılı bir kuvvet teriminin türevini tek adımda bulur.
UE Differentiates a power term with a coefficient in one step.
W Katsayı yerinde durur, üs öne inip onunla çarpılır, üs bir azalır.
WE The coefficient stays, the power multiplies it and the power drops by one.
E $(4x^3)'=12x^2$
H Katsayı × üs, üs eksi bir.
T coefficient = katsayı ;; power = üs
Q $f(x)=3x^5$ eğrisinin eğim fonksiyonunu bul.
QE Find the gradient function of $f(x)=3x^5$.
B [[an]]x^{[[n-1]]} || a ;; n+1 ;; n
C a=4:-10:10:1 ; n=3:1:6:1 ; x=1:-3:3:1 => a*n*x^(n-1)
CT f'(@x@)=@a@\cdot @n@\cdot @x@^{@n@-1}=@=@
G b5_axn
V a,x,n:int:1:6

# x5-grad-tangent | 3 | $f'(a)$ teğetin eğimidir | f'(a) is the gradient of the tangent
L f'(a)
O :
R ~$x=a$’daki teğetin eğimi
X ~$x=a$’daki $y$ değeri ;; ~$x=a$’daki normalin eğimi ;; ~Eğrinin $y$ eksenini kestiği yer
K $a$: eğri üzerindeki noktanın $x$ değeri
KE $a$: the x-coordinate of the point on the curve. $f'(a)$ is the gradient of the tangent at $x=a$.
U Bir noktadaki eğimi türevle bulmanı sağlar.
UE Lets you find the gradient at a point using the derivative.
W Teğet, eğriye o noktada değip aynı yöne giden doğrudur. Türev tam bu doğrunun eğimini verir.
WE The tangent touches the curve and has the same direction there; the derivative gives its gradient.
E $f(x)=x^2$, $f'(x)=2x$, $f'(3)=6$: $x=3$’te teğetin eğimi 6.
T tangent = teğet ;; gradient = eğim ;; point = nokta
Q $y=x^3$ eğrisine $x=2$ noktasında dokunan doğrunun eğimi nedir?
QE What is the gradient of the line touching $y=x^3$ at $x=2$?
C a=3:-5:5:1 => 2*a
CT f(x)=x^2:\ f'(@a@)=2\cdot @a@=@=@
G b5_gradt
LAB tangent

# x5-tangent-eq | 3 | Teğet denklemi | Equation of the tangent
L y-f(a)
R f'(a)(x-a)
X f(a)(x-a) ;; f'(a)(x+a) ;; f'(x)(x-a)
K $(a,\ f(a))$: değme noktası, $f'(a)$: o noktadaki eğim
KE $(a,\ f(a))$: point of contact, $f'(a)$: gradient there
U Eğriye bir noktada dokunan doğrunun denklemini yazar.
UE Writes the equation of the tangent to a curve at a point.
W Bu, doğrunun nokta-eğim denklemidir: nokta $(a,f(a))$, eğim $f'(a)$.
WE It is the point-gradient form of a line with point $(a,f(a))$ and gradient $f'(a)$.
E $f(x)=x^2$, $a=1$: $y-1=2(x-1)$, yani $y=2x-1$.
H Nokta + eğim = doğru.
T tangent = teğet ;; equation of a line = doğru denklemi ;; point of contact = değme noktası
Q $y=x^2$ eğrisine $(3,\ 9)$ noktasında dokunan doğrunun denklemini bul.
QE Find the equation of the line that touches $y=x^2$ at $(3,\ 9)$.
B [[f'(a)]](x-[[a]]) || f(a) ;; x ;; -a
C a=1:-5:5:1 => -(a^2)
CT y=x^2,\ a=@a@:\ y\text{-intercept}=@=@
G b5_tan
LAB tangent

# x5-normal | 2 | Normalin eğimi | Gradient of the normal
L m_{\text{normal}}
R -\dfrac{1}{f'(a)}
X \dfrac{1}{f'(a)} ;; -f'(a) ;; f'(a)
K $f'(a)\ne 0$; normal, teğete dik olan doğrudur
KE $f'(a)\ne 0$; the normal is perpendicular to the tangent
U Eğriye bir noktada dik olan doğrunun eğimini bulur.
UE Finds the gradient of the line perpendicular to the curve at a point.
W Dik doğruların eğimlerinin çarpımı $-1$’dir. Eğimi ters çevir ve işaretini değiştir.
WE Perpendicular gradients multiply to $-1$: flip the fraction and change the sign.
E $f'(a)=2$ ise normalin eğimi $-\tfrac{1}{2}$.
H "Ters çevir, işaret değiştir."
T normal = normal ;; perpendicular = dik ;; tangent = teğet
Q Bir eğriye $(1,\ 1)$ noktasında teğetin eğimi 4. O noktada eğriye dik doğrunun eğimi nedir?
QE The tangent to a curve at $(1,\ 1)$ has gradient 4. What is the gradient of the line perpendicular to the curve there?
B [[-]]\dfrac{1}{[[f'(a)]]} || + ;; f(a) ;; a
C m=2:-10:10:0.5 => -1/m
CT -\dfrac{1}{@m@}=@=@
G b5_norm
LAB normal

# x5-increasing | 3 | Artan fonksiyon | Increasing function
L ~$f$ artan (increasing)
O \iff
R f'(x)>0
X f'(x)<0 ;; f(x)>0 ;; f'(x)=0
U Fonksiyonun hangi aralıkta yükseldiğini türevle bulur.
UE Uses the derivative to find where a function is increasing.
W Soldan sağa giderken grafik yukarı çıkıyorsa eğim pozitiftir.
WE If the graph goes up from left to right, the gradient is positive.
H Artı eğim = yokuş yukarı.
T increasing = artan ;; interval = aralık
Q $f(x)=x^2-6x$ fonksiyonu hangi $x$ değerleri için yükselir?
QE For which values of $x$ is $f(x)=x^2-6x$ going up?
B f'(x)[[>]]0 || < ;; =
G b5_incr

# x5-decreasing | 3 | Azalan fonksiyon | Decreasing function
L ~$f$ azalan (decreasing)
O \iff
R f'(x)<0
X f'(x)>0 ;; f(x)<0 ;; f''(x)<0
U Fonksiyonun hangi aralıkta düştüğünü türevle bulur.
UE Uses the derivative to find where a function is decreasing.
W Soldan sağa giderken grafik aşağı iniyorsa eğim negatiftir.
WE If the graph goes down from left to right, the gradient is negative.
H Eksi eğim = yokuş aşağı.
T decreasing = azalan ;; interval = aralık
Q Bir topun yüksekliği $h(t)=20t-5t^2$. Top hangi zamanlarda alçalır?
QE A ball's height is $h(t)=20t-5t^2$. When is the ball going down?
B f'(x)[[<]]0 || > ;; =

# x5-stationary | 3 | Durağan nokta | Stationary point
L ~Durağan nokta (stationary point)
O \iff
R f'(x)=0
X f(x)=0 ;; f''(x)=0 ;; f'(x)>0
U Grafiğin tepe ve çukur noktalarını bulmaya başlar.
UE Starts the search for the maximum and minimum points of a graph.
W Tepede ya da çukurda teğet yataydır, yani eğim 0’dır.
WE At a top or a bottom the tangent is horizontal, so the gradient is 0.
E $f(x)=x^2-4x$: $f'(x)=2x-4=0\Rightarrow x=2$.
T stationary point = durağan nokta ;; turning point = dönüm noktası ;; horizontal = yatay
Q Bir şirketin kârı $P(x)=-x^2+10x$. Kâr en büyük olduğunda $x$ kaçtır?
QE A company's profit is $P(x)=-x^2+10x$. For which $x$ is the profit greatest?
B f'(x)=[[0]] || 1 ;; f(x)
C p=2:-5:5:1 => p
CT f(x)=x^2-2\cdot @p@x:\ f'(x)=0\Rightarrow x=@=@
G b5_stat
LAB tangent

# x5-max | 2 | İkinci türev testi: maksimum | Second derivative test: maximum
L ~$f'(a)=0$ ve $f''(a)<0$
O \Rightarrow
R ~$x=a$’da yerel maksimum
X ~$x=a$’da yerel minimum ;; ~$x=a$’da büküm noktası ;; ~$x=a$’da kök
KE If $f'(a)=0$ and $f''(a)<0$, there is a local maximum at $x=a$.
U Durağan noktanın tepe mi olduğunu anlar.
UE Tells you whether a stationary point is a maximum.
W $f''<0$ ise eğim azalıyor: önce artı, sonra eksi. Bu bir tepedir (∩ şekli).
WE $f''<0$ means the gradient is decreasing, from positive to negative: a peak (∩ shape).
H Eksi = asık surat ∩ = maksimum.
T local maximum = yerel maksimum ;; second derivative = ikinci türev ;; concave down = aşağı bükük
Q $f(x)=-x^2+4x$ fonksiyonunun $x=2$’deki durağan noktası tepe mi çukur mu?
QE Is the stationary point of $f(x)=-x^2+4x$ at $x=2$ a maximum or a minimum?
G b5_max

# x5-min | 2 | İkinci türev testi: minimum | Second derivative test: minimum
L ~$f'(a)=0$ ve $f''(a)>0$
O \Rightarrow
R ~$x=a$’da yerel minimum
X ~$x=a$’da yerel maksimum ;; ~$x=a$’da büküm noktası ;; ~$f$ her yerde artan
KE If $f'(a)=0$ and $f''(a)>0$, there is a local minimum at $x=a$.
U Durağan noktanın çukur mu olduğunu anlar.
UE Tells you whether a stationary point is a minimum.
W $f''>0$ ise eğim artıyor: önce eksi, sonra artı. Bu bir çukurdur (∪ şekli).
WE $f''>0$ means the gradient is increasing, from negative to positive: a valley (∪ shape).
H Artı = gülen yüz ∪ = minimum.
T local minimum = yerel minimum ;; second derivative = ikinci türev ;; concave up = yukarı bükük
Q $f(x)=x^2-6x+1$ fonksiyonunun $x=3$’teki durağan noktası tepe mi çukur mu?
QE Is the stationary point of $f(x)=x^2-6x+1$ at $x=3$ a maximum or a minimum?
G b5_min

# x5-inflexion | 2 | Büküm noktası | Point of inflexion
L ~Büküm noktası (point of inflexion)
O \iff
R ~$f''=0$ ve $f''$ işaret değiştirir
X ~$f'=0$ ;; ~Yalnızca $f''=0$ ;; ~$f$ işaret değiştirir
KE A point of inflexion is where $f''=0$ and $f''$ changes sign.
U Grafiğin bükülme yönünün değiştiği noktayı bulur.
UE Finds where the graph changes concavity.
W Grafik ∪’dan ∩’ye (ya da tersine) geçer. Sadece $f''=0$ yetmez: $x^4$’te $f''(0)=0$ ama büküm yok.
WE The curve switches between concave up and down; $f''=0$ alone is not enough (think of $x^4$).
T point of inflexion = büküm noktası ;; concavity = bükeylik ;; changes sign = işaret değiştirir
Q $f(x)=x^3-6x^2$ grafiği hangi noktada ∪ şeklinden ∩ şekline geçer?
QE At which point does the graph of $f(x)=x^3-6x^2$ change between concave up and concave down?
G b5_inflex

# x5-velocity | 3 | Hız | Velocity
L v
R \dfrac{ds}{dt}
X \dfrac{dt}{ds} ;; \dfrac{s}{t} ;; \int s\,dt
K $s$: konum (yer değiştirme), $t$: zaman
KE $s$: displacement, $t$: time
U Konum formülünden anlık hızı bulur.
UE Finds the instantaneous velocity from the displacement.
W Hız, konumun zamanla ne kadar hızlı değiştiğidir; bu da türevdir.
WE Velocity is how fast displacement changes with time: the derivative.
E $s=t^2+3t$ ise $v=2t+3$; $t=2$’de $v=7$.
T velocity = hız ;; displacement = yer değiştirme ;; instantaneous = anlık
Q Bir asansörün konumu $s=4t^2$ metre. $t=3$ saniyede asansör ne kadar hızlı gidiyor?
QE A lift's displacement is $s=4t^2$ metres. How fast is it moving at $t=3$ s?
B \dfrac{d[[s]]}{d[[t]]} || v ;; x
C c=3:-5:5:1 ; t=2:0:10:1 => 2*t+c
CT s=t^2+@c@t\Rightarrow v(@t@)=@=@
G b5_vel

# x5-ekx | 3 | $e^{kx}$’in türevi | Derivative of $e^{kx}$
L (e^{kx})'
R ke^{kx}
X e^{kx} ;; kxe^{kx-1} ;; \dfrac{1}{k}e^{kx}
K $k$: sabit
KE $k$: a constant
U Üssünde sabit çarpan olan üstel fonksiyonun türevini alır.
UE Differentiates an exponential with a constant in the power.
W Zincir kuralı: iç fonksiyon $kx$’in türevi $k$’dır, öne gelir. Üs aynen kalır.
WE By the chain rule the inside $kx$ differentiates to $k$, which comes to the front.
E $(e^{3x})'=3e^{3x}$
H Üssün katsayısı öne iner.
T exponential function = üstel fonksiyon ;; chain rule = zincir kuralı
Q $f(x)=e^{5x}$ fonksiyonunun türevini bul.
QE Differentiate $f(x)=e^{5x}$.
B [[k]]e^{kx} || x ;; \dfrac{1}{k}
C k=3:-5:5:1 ; x=0:-2:2:0.5 => k*exp(k*x)
CT @k@e^{@k@\cdot @x@}=@=@
G b5_ekx
V k,x:-2:2

# x5-sinkx | 3 | $\sin kx$’in türevi | Derivative of $\sin kx$
L (\sin(kx))'
R k\cos(kx)
X \cos(kx) ;; -k\cos(kx) ;; \dfrac{1}{k}\cos(kx)
K $k$: sabit, $x$ radyan
KE $k$: a constant, $x$ in radians
U İçinde katsayı olan sinüsün türevini alır.
UE Differentiates a sine with a coefficient inside.
W Zincir kuralı: $\sin$ → $\cos$, sonra içtekinin türevi $k$ ile çarp.
WE Chain rule: sin becomes cos, then multiply by $k$, the derivative of the inside.
E $(\sin 4x)'=4\cos 4x$
T chain rule = zincir kuralı ;; radian = radyan
Q $f(x)=\sin 3x$ fonksiyonunun türevini bul.
QE Differentiate $f(x)=\sin 3x$.
B [[k]]\cos(kx) || -k ;; \dfrac{1}{k}
C k=3:-5:5:1 ; x=0:-3.14:3.14:0.01 => k*cos(k*x)
CT @k@\cos(@k@\cdot @x@)=@=@
G b5_sinkx
V k,x:-3:3

# x5-int-const | 3 | Sabitin integrali | Integral of a constant
L \int k\,dx
R kx+C
X k+C ;; 0 ;; \dfrac{k^2}{2}+C
K $k$: sabit
KE $k$: a constant
U Sabit bir sayının integralini alır.
UE Integrates a constant.
W Türevi $k$ olan fonksiyon $kx$’tir; $+C$ ekle.
WE The function whose derivative is $k$ is $kx$; add $C$.
E $\int 5\,dx=5x+C$
T integral = integral ;; constant of integration = integral sabiti
Q Bir musluk dakikada 4 litre su akıtıyor. $x$ dakikada akan suyu veren fonksiyon nedir?
QE A tap delivers 4 litres per minute. Which function gives the water delivered in $x$ minutes?
B [[k]][[x]]+C || 1 ;; k^2
C k=5:-10:10:1 ; b=3:1:10:1 => k*b
CT \int_0^{@b@}@k@\,dx=@=@
G b5_intk

# x5-int-linpow | 2 | $(ax+b)^n$’in integrali | Integral of $(ax+b)^n$
L \int (ax+b)^n\,dx
R \dfrac{(ax+b)^{n+1}}{a(n+1)}+C
X \dfrac{(ax+b)^{n+1}}{n+1}+C ;; \dfrac{a(ax+b)^{n+1}}{n+1}+C ;; an(ax+b)^{n-1}+C
K $a\ne 0$, $n\ne -1$
KE $a\ne 0$, $n\ne -1$
U Parantezli doğrusal ifadenin kuvvetini integral alır.
UE Integrates a power of a linear expression.
W Kuvvet kuralını uygula, sonra $a$’ya böl; çünkü türevini alınca zincir kuralı $a$ ile çarpacak.
WE Use the power rule, then divide by $a$, because differentiating brings out a factor $a$.
E $\int (2x+1)^3\,dx=\dfrac{(2x+1)^4}{8}+C$
T linear = doğrusal ;; integral = integral
Q $\int (3x-2)^4\,dx$ integralini hesapla.
QE Find $\int (3x-2)^4\,dx$.
B \dfrac{(ax+b)^{n+1}}{[[a]]([[n+1]])}+C || n ;; b ;; n-1
G b5_linpow

# x5-int-explin | 2 | $e^{ax+b}$’nin integrali | Integral of $e^{ax+b}$
L \int e^{ax+b}\,dx
R \dfrac{1}{a}e^{ax+b}+C
X ae^{ax+b}+C ;; e^{ax+b}+C ;; \dfrac{e^{ax+b+1}}{ax+b+1}+C
K $a\ne 0$
KE $a\ne 0$
U Üssü doğrusal olan üstel fonksiyonun integralini alır.
UE Integrates an exponential with a linear power.
W Türevde $a$ öne geliyordu; integralde $a$’ya bölersin.
WE Differentiating multiplies by $a$, so integrating divides by $a$.
E $\int e^{2x}\,dx=\tfrac{1}{2}e^{2x}+C$
T exponential function = üstel fonksiyon ;; integral = integral
Q $\int e^{4x+1}\,dx$ integralini hesapla.
QE Find $\int e^{4x+1}\,dx$.
B \dfrac{1}{[[a]]}e^{ax+b}+C || b ;; x
G b5_explin

# x5-int-coslin | 2 | $\cos(ax+b)$’nin integrali | Integral of $\cos(ax+b)$
L \int \cos(ax+b)\,dx
R \dfrac{1}{a}\sin(ax+b)+C
X a\sin(ax+b)+C ;; -\dfrac{1}{a}\sin(ax+b)+C ;; \sin(ax+b)+C
K $a\ne 0$, radyan
KE $a\ne 0$, radians
U İçinde doğrusal ifade olan kosinüsün integralini alır.
UE Integrates a cosine of a linear expression.
W $\cos$’un integrali $\sin$; içteki $a$ yüzünden $a$’ya böl.
WE cos integrates to sin; divide by the inner coefficient $a$.
E $\int \cos 3x\,dx=\tfrac{1}{3}\sin 3x+C$
T integral = integral ;; radian = radyan
Q $\int \cos(2x+1)\,dx$ integralini hesapla.
QE Find $\int \cos(2x+1)\,dx$.
B \dfrac{1}{a}[[\sin]](ax+b)+C || \cos ;; -\sin
G b5_coslin

# x5-int-sinlin | 2 | $\sin(ax+b)$’nin integrali | Integral of $\sin(ax+b)$
L \int \sin(ax+b)\,dx
R -\dfrac{1}{a}\cos(ax+b)+C
X \dfrac{1}{a}\cos(ax+b)+C ;; -a\cos(ax+b)+C ;; -\cos(ax+b)+C
K $a\ne 0$, radyan
KE $a\ne 0$, radians
U İçinde doğrusal ifade olan sinüsün integralini alır.
UE Integrates a sine of a linear expression.
W $\sin$’in integrali $-\cos$; içteki $a$ yüzünden $a$’ya böl. Eksiyi unutma!
WE sin integrates to minus cos; divide by $a$ and keep the minus sign.
E $\int \sin 2x\,dx=-\tfrac{1}{2}\cos 2x+C$
T integral = integral ;; radian = radyan
Q $\int \sin(5x)\,dx$ integralini hesapla.
QE Find $\int \sin(5x)\,dx$.
B [[-]]\dfrac{1}{a}\cos(ax+b)+C || + ;; a
G b5_sinlin

# x5-definite | 3 | Belirli integral | Definite integral
L \int_a^b f(x)\,dx
R F(b)-F(a)
X F(a)-F(b) ;; F(b)+F(a) ;; f(b)-f(a)
K $F$: $f$’nin ters türevi ($F'=f$)
KE $F$: an antiderivative of $f$ ($F'=f$)
U İki sınır arasındaki integralin sayı değerini bulur.
UE Evaluates an integral between two limits as a number.
W Ters türevi bul, üst sınırı koy, alt sınırı koy, çıkar. $C$ çıkarırken gider.
WE Find the antiderivative, substitute the upper then lower limit and subtract; $C$ cancels.
E $\int_1^3 2x\,dx=[x^2]_1^3=9-1=8$
H "Üst eksi alt."
T definite integral = belirli integral ;; upper limit = üst sınır ;; lower limit = alt sınır
Q $\int_0^2 3x^2\,dx$ kaçtır?
QE Evaluate $\int_0^2 3x^2\,dx$.
B F([[b]])-F([[a]]) || 0 ;; x
C a=1:-5:5:1 ; b=3:-5:5:1 => b^2-a^2
CT \int_{@a@}^{@b@}2x\,dx=@b@^2-(@a@)^2=@=@
G b5_def
LAB area

# x5-between | 2 | İki eğri arasındaki alan | Area between two curves
L A
R \int_a^b \big(f(x)-g(x)\big)\,dx
X \int_a^b \big(g(x)-f(x)\big)\,dx ;; \int_a^b f(x)\,dx\cdot\int_a^b g(x)\,dx ;; \int_a^b \big(f(x)+g(x)\big)\,dx
K $a\le x\le b$ aralığında $f(x)\ge g(x)$ (üstteki eğri $f$)
KE $f(x)\ge g(x)$ for $a\le x\le b$ ($f$ is the upper curve)
U İki eğrinin arasında kalan bölgenin alanını bulur.
UE Finds the area of the region between two curves.
W Üstteki eğrinin altındaki alandan alttakinin altındaki alanı çıkarırsın.
WE Take the area under the upper curve and subtract the area under the lower one.
E $f(x)=2x$, $g(x)=x^2$, $0\le x\le 2$: $\int_0^2(2x-x^2)\,dx=\tfrac{4}{3}$.
H Üst eksi alt.
T area between curves = eğriler arası alan ;; upper curve = üstteki eğri ;; region = bölge
Q $y=x$ doğrusu ile $y=x^2$ eğrisi arasında kalan bölgenin alanı nedir?
QE Find the area of the region enclosed by $y=x$ and $y=x^2$.
B \int_a^b \big([[f(x)]]-[[g(x)]]\big)\,dx || 0 ;; x
C k=2:1:6:1 => k^3/6
CT \int_0^{@k@}(@k@x-x^2)\,dx=@=@
G b5_between
LAB area
`;

const Q = (q, qe, ans) => ({ q, qe, ...ans });

export const GEN = {
  b5_pow: (r) => {
    const n = ri(r, 2, 4), x = ri(r, 1, 3);
    return Q(`$f(x)=x^{${n}}$ ise $f'(${x})$ kaçtır?`, `If $f(x)=x^{${n}}$, find $f'(${x})$.`, int(n * x ** (n - 1)));
  },
  b5_sin: (r) => {
    const k = ri(r, 2, 9);
    return Q(`$f(x)=${k}\\sin x$ ise $f'(0)$ kaçtır?`, `If $f(x)=${k}\\sin x$, find $f'(0)$.`, int(k));
  },
  b5_cos: (r) => {
    const k = ri(r, 2, 9);
    return Q(`$f(x)=${k}\\cos x$ ise $f'\\left(\\tfrac{\\pi}{2}\\right)$ kaçtır?`, `If $f(x)=${k}\\cos x$, find $f'\\left(\\tfrac{\\pi}{2}\\right)$.`, int(-k));
  },
  b5_exp: (r) => {
    const k = ri(r, 2, 9);
    return Q(`$f(x)=${k}e^x$ ise $f'(0)$ kaçtır?`, `If $f(x)=${k}e^x$, find $f'(0)$.`, int(k));
  },
  b5_ln: (r) => {
    const a = ri(r, 1, 6), b = ri(r, 2, 8);
    return Q(`$f(x)=${a}\\ln x$ ise $f'(${b})$ kaçtır?`, `If $f(x)=${a}\\ln x$, find $f'(${b})$.`, fr(a, b));
  },
  b5_chain: (r) => {
    const a = ri(r, 2, 4), b = ri(r, 1, 3);
    return Q(`$y=(${a}x+${b})^2$ ise $x=0$’da $\\dfrac{dy}{dx}$ kaçtır?`, `If $y=(${a}x+${b})^2$, find $\\dfrac{dy}{dx}$ at $x=0$.`, int(2 * b * a));
  },
  b5_product: (r) => {
    const c = ri(r, 1, 6);
    return Q(`$y=x^2(x+${c})$ ise $x=1$’de $\\dfrac{dy}{dx}$ kaçtır?`, `If $y=x^2(x+${c})$, find $\\dfrac{dy}{dx}$ at $x=1$.`, int(2 * (1 + c) + 1));
  },
  b5_quotient: (r) => {
    const c = ri(r, 1, 5);
    return Q(`$y=\\dfrac{x}{x+${c}}$ ise $x=0$’da $\\dfrac{dy}{dx}$ kaçtır?`, `If $y=\\dfrac{x}{x+${c}}$, find $\\dfrac{dy}{dx}$ at $x=0$.`, fr(1, c));
  },
  b5_intpow: (r) => {
    const n = ri(r, 1, 7);
    return Q(`$\\int x^{${n}}\\,dx=k\\,x^{${n + 1}}+C$ ise $k$ kaçtır?`, `If $\\int x^{${n}}\\,dx=k\\,x^{${n + 1}}+C$, find $k$.`, fr(1, n + 1));
  },
  b5_area: (r) => {
    const b = ri(r, 1, 6);
    return Q(`$y=x^2$ eğrisi ile $x$ ekseni arasında, $x=0$’dan $x=${b}$’e kadar alan kaçtır?`, `Find the area between $y=x^2$ and the x-axis from $x=0$ to $x=${b}$.`, fr(b ** 3, 3));
  },
  b5_acc: (r) => {
    const c = ri(r, 1, 5), t = ri(r, 1, 6);
    return Q(`$v=${c}t^2$ m/s ise $t=${t}$’te ivme kaç m/s² olur?`, `If $v=${c}t^2$ m/s, find the acceleration at $t=${t}$.`, int(2 * c * t));
  },
  b5_disp: (r) => {
    const c = ri(r, 1, 5), T = ri(r, 1, 6);
    return Q(`$v=2t+${c}$ m/s. $t=0$’dan $t=${T}$’e yer değiştirme kaç m?`, `$v=2t+${c}$ m/s. Find the displacement from $t=0$ to $t=${T}$.`, int(T * T + c * T));
  },
  b5_dist: (r) => {
    const k = ri(r, 1, 6);
    return Q(`$v=t-${k}$ m/s. $t=0$’dan $t=${2 * k}$’e alınan toplam yol kaç m?`, `$v=t-${k}$ m/s. Find the distance travelled from $t=0$ to $t=${2 * k}$.`, int(k * k));
  },
  b5_intrecip: (r) => {
    const k = ri(r, 2, 6);
    return Q(`$\\int_1^{e^{${k}}}\\dfrac{1}{x}\\,dx$ kaçtır?`, `Evaluate $\\int_1^{e^{${k}}}\\dfrac{1}{x}\\,dx$.`, int(k));
  },
  b5_intsin: (r) => {
    const a = ri(r, 1, 6);
    return Q(`$\\int_0^{\\pi}${a}\\sin x\\,dx$ kaçtır?`, `Evaluate $\\int_0^{\\pi}${a}\\sin x\\,dx$.`, int(2 * a));
  },
  b5_intcos: (r) => {
    const a = ri(r, 1, 9);
    return Q(`$\\int_0^{\\pi/2}${a}\\cos x\\,dx$ kaçtır?`, `Evaluate $\\int_0^{\\pi/2}${a}\\cos x\\,dx$.`, int(a));
  },
  b5_intexp: (r) => {
    const k = ri(r, 2, 9);
    return Q(`$\\int_0^{\\ln ${k}}e^x\\,dx$ kaçtır?`, `Evaluate $\\int_0^{\\ln ${k}}e^x\\,dx$.`, int(k - 1));
  },
  b5_absarea: (r) => {
    const a = ri(r, 1, 5), b = ri(r, 1, 5);
    return Q(`$y=x$ ile $x$ ekseni arasında, $x=-${a}$’dan $x=${b}$’ye toplam alan kaçtır?`, `Find the total area between $y=x$ and the x-axis from $x=-${a}$ to $x=${b}$.`, fr(a * a + b * b, 2));
  },
  b5_axn: (r) => {
    const a = ri(r, 2, 6), n = ri(r, 2, 5);
    return Q(`$f(x)=${a}x^{${n}}$ ise $f'(1)$ kaçtır?`, `If $f(x)=${a}x^{${n}}$, find $f'(1)$.`, int(a * n));
  },
  b5_gradt: (r) => {
    const a = ri(r, -4, 4);
    return Q(`$y=x^3$ eğrisine $x=${a}$’da çizilen teğetin eğimi kaçtır?`, `Find the gradient of the tangent to $y=x^3$ at $x=${a}$.`, int(3 * a * a));
  },
  b5_tan: (r) => {
    const a = ri(r, 1, 6);
    return Q(`$y=x^2$ eğrisine $x=${a}$’da çizilen teğet $y=mx+c$. $c$ kaçtır?`, `The tangent to $y=x^2$ at $x=${a}$ is $y=mx+c$. Find $c$.`, int(-a * a));
  },
  b5_norm: (r) => {
    const m = pick(r, [-5, -4, -3, -2, 2, 3, 4, 5]);
    return Q(`Teğetin eğimi $${m}$. Normalin eğimi kaçtır?`, `The gradient of the tangent is $${m}$. Find the gradient of the normal.`, fr(-1, m));
  },
  b5_incr: (r) => {
    const p = ri(r, 1, 6);
    return Q(`$f(x)=x^2-${2 * p}x$ fonksiyonu $x>k$ için artandır. En küçük $k$ kaçtır?`, `$f(x)=x^2-${2 * p}x$ is increasing for $x>k$. Find the least $k$.`, int(p));
  },
  b5_stat: (r) => {
    const p = ri(r, 1, 6), q = ri(r, 0, 9);
    return Q(`$f(x)=x^2-${2 * p}x+${q}$ fonksiyonunun durağan noktasının $x$ değeri kaçtır?`, `Find the x-coordinate of the stationary point of $f(x)=x^2-${2 * p}x+${q}$.`, int(p));
  },
  b5_max: (r) => {
    const p = ri(r, 1, 4);
    return Q(`$f(x)=x^3-${3 * p * p}x$ fonksiyonunun yerel maksimumu hangi $x$ değerinde?`, `At which value of $x$ does $f(x)=x^3-${3 * p * p}x$ have a local maximum?`, int(-p));
  },
  b5_min: (r) => {
    const p = ri(r, 1, 4);
    return Q(`$f(x)=x^3-${3 * p * p}x$ fonksiyonunun yerel minimumu hangi $x$ değerinde?`, `At which value of $x$ does $f(x)=x^3-${3 * p * p}x$ have a local minimum?`, int(p));
  },
  b5_inflex: (r) => {
    const p = ri(r, 1, 5);
    return Q(`$f(x)=x^3-${3 * p}x^2$ fonksiyonunun büküm noktasının $x$ değeri kaçtır?`, `Find the x-coordinate of the point of inflexion of $f(x)=x^3-${3 * p}x^2$.`, int(p));
  },
  b5_vel: (r) => {
    const c = ri(r, 1, 6), t = ri(r, 1, 6);
    return Q(`$s=t^2+${c}t$ metre ise $t=${t}$’te hız kaç m/s?`, `If $s=t^2+${c}t$ metres, find the velocity at $t=${t}$.`, int(2 * t + c));
  },
  b5_ekx: (r) => {
    const k = ri(r, 2, 9);
    return Q(`$f(x)=e^{${k}x}$ ise $f'(0)$ kaçtır?`, `If $f(x)=e^{${k}x}$, find $f'(0)$.`, int(k));
  },
  b5_sinkx: (r) => {
    const k = ri(r, 2, 9);
    return Q(`$f(x)=\\sin(${k}x)$ ise $f'(0)$ kaçtır?`, `If $f(x)=\\sin(${k}x)$, find $f'(0)$.`, int(k));
  },
  b5_intk: (r) => {
    const k = ri(r, 2, 9), b = ri(r, 1, 8);
    return Q(`$\\int_0^{${b}}${k}\\,dx$ kaçtır?`, `Evaluate $\\int_0^{${b}}${k}\\,dx$.`, int(k * b));
  },
  b5_linpow: (r) => {
    const a = ri(r, 2, 5), n = ri(r, 2, 5);
    return Q(`$\\int (${a}x+1)^{${n}}\\,dx=k\\,(${a}x+1)^{${n + 1}}+C$ ise $k$ kaçtır?`, `If $\\int (${a}x+1)^{${n}}\\,dx=k\\,(${a}x+1)^{${n + 1}}+C$, find $k$.`, fr(1, a * (n + 1)));
  },
  b5_explin: (r) => {
    const a = ri(r, 2, 9);
    return Q(`$\\int e^{${a}x}\\,dx=k\\,e^{${a}x}+C$ ise $k$ kaçtır?`, `If $\\int e^{${a}x}\\,dx=k\\,e^{${a}x}+C$, find $k$.`, fr(1, a));
  },
  b5_coslin: (r) => {
    const a = ri(r, 2, 9);
    return Q(`$\\int \\cos(${a}x)\\,dx=k\\sin(${a}x)+C$ ise $k$ kaçtır?`, `If $\\int \\cos(${a}x)\\,dx=k\\sin(${a}x)+C$, find $k$.`, fr(1, a));
  },
  b5_sinlin: (r) => {
    const a = ri(r, 2, 9);
    return Q(`$\\int \\sin(${a}x)\\,dx=k\\cos(${a}x)+C$ ise $k$ kaçtır?`, `If $\\int \\sin(${a}x)\\,dx=k\\cos(${a}x)+C$, find $k$.`, fr(-1, a));
  },
  b5_def: (r) => {
    const b = ri(r, 2, 6);
    return Q(`$\\int_1^{${b}}2x\\,dx$ kaçtır?`, `Evaluate $\\int_1^{${b}}2x\\,dx$.`, int(b * b - 1));
  },
  b5_between: (r) => {
    const k = ri(r, 2, 4);
    return Q(`$y=${k}x$ doğrusu ile $y=x^2$ eğrisi arasındaki alan kaçtır?`, `Find the area enclosed by $y=${k}x$ and $y=x^2$.`, fr(k ** 3, 6));
  },
};
