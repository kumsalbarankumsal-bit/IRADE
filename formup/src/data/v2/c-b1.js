import { ri, pick, fr, int, num, nCr, fact } from "./genkit.js";

/* FormUp v2 · parça "b1": b1 (Konu 1 · Sayı ve Cebir, IB kitapçığı) + x1 (Sayı ve Cebir: Kitapçık Dışı)
   Kartlar öğretme sırasıyla (kolaydan zora). Biçim: content/SPEC.md */

export const CARDS = String.raw`
## b1

# b1-arith-nth | 3 | Aritmetik dizinin n. terimi | The nth term of an arithmetic sequence
L u_n
R u_1+(n-1)\,d
X u_1+n\,d ;; u_1\cdot d^{\,n-1} ;; n\,u_1+d
K $u_1$: ilk terim, $d$: ortak fark (her adımda eklenen sayı; negatif de olabilir), $n$: kaçıncı terim olduğu ($n=1,2,3,\dots$).
KE $u_1$: first term, $d$: common difference (the number added each time; it can be negative), $n$: the position of the term ($n=1,2,3,\dots$).
U Bir dizinin istediğin terimini, tek tek saymadan bulur.
UE Finds any term of the sequence without listing them all.
W İlk terimden $n$. terime giderken $n-1$ adım atarsın; her adımda $d$ eklenir. $u_1$ zaten ilk terim olduğu için $n$ değil, $n-1$ tane $d$ eklenir.
WE From the first term to the nth you take $n-1$ steps, adding $d$ each time.
E $u_1=4$, $d=3$ ise $u_{10}=4+9\cdot 3=31$. Dizi: $4, 7, 10, 13, \dots$
H İlk terim + (adım sayısı) × fark. Adım sayısı her zaman $n-1$!
T arithmetic sequence = aritmetik dizi ;; common difference = ortak fark ;; nth term = n. terim
Q Bir sinemada ilk sırada 20 koltuk var ve her sıra öncekinden 2 koltuk fazla. 15. sırada kaç koltuk var?
QE A cinema has 20 seats in the first row and each row has 2 more seats than the one before. How many seats are in row 15?
B [[u_1]]+([[n-1]])\,[[d]] || u_n ;; n+1 ;; r
C u_1=4:-10:20:1 ; n=10:1:30:1 ; d=3:-5:5:0.5 => u_1+(n-1)*d
CT u_{@n@}=@u_1@+(@n@-1)\cdot @d@=@=@
G b1_arith_nth
LAB sequence
BK 1.2

# b1-arith-sum | 3 | Aritmetik dizinin ilk n teriminin toplamı | The sum of n terms of an arithmetic sequence
L S_n
R \dfrac{n}{2}\left(2u_1+(n-1)\,d\right)
X n\left(2u_1+(n-1)\,d\right) ;; \dfrac{n}{2}\left(u_1+(n-1)\,d\right) ;; \dfrac{n}{2}\left(2u_1+n\,d\right)
K $S_n$: ilk $n$ terimin toplamı, $u_1$: ilk terim, $d$: ortak fark. Son terimi bilmiyorsan bu biçimi kullan.
KE $S_n$: the sum of the first $n$ terms, $u_1$: first term, $d$: common difference. Use this form when you do not know the last term.
U İlk $n$ terimi tek tek toplamadan, toplamlarını bir kerede bulur.
UE Adds up the first $n$ terms in one go, without adding them one by one.
W Diziyi bir kez baştan, bir kez sondan yaz ve alt alta topla: her çift aynı toplamı verir, $2u_1+(n-1)d$. $n$ çift var, ama diziyi iki kez yazdığın için $2$’ye bölersin.
WE Write the sequence forwards and backwards and add them in pairs: every pair gives $2u_1+(n-1)d$. There are $n$ pairs, and you halve because you wrote the sequence twice.
E $u_1=3$, $d=4$, $n=10$: $S_{10}=\tfrac{10}{2}(6+9\cdot 4)=5\cdot 42=210$.
H Yarım $n$ çarpı (iki ilk terim + adım × fark).
T sum of n terms = n terimin toplamı ;; series = seri ;; first term = ilk terim
Q Bir koşucu ilk gün 3 km koşuyor ve her gün bir önceki günden 0,5 km fazla koşuyor. İlk 20 günde toplam kaç km koşmuş olur?
QE A runner runs 3 km on the first day and 0.5 km more each day than the day before. How far does she run in total in the first 20 days?
B \dfrac{n}{[[2]]}\left([[2u_1]]+([[n-1]])\,d\right) || 4 ;; u_1 ;; n+1
C n=10:1:50:1 ; u_1=3:-10:20:1 ; d=4:-5:5:0.5 => n/2*(2*u_1+(n-1)*d)
CT S_{@n@}=\dfrac{@n@}{2}\left(2\cdot @u_1@+(@n@-1)\cdot @d@\right)=@=@
G b1_arith_sum
LAB sequence
BK 1.2
S Rivayete göre küçük Gauss’a öğretmeni $1$’den $100$’e kadar toplamayı verdi. Gauss sayıları baştan ve sondan eşleştirdi ($1+100$, $2+99$, …) ve saniyeler içinde $5050$ buldu.

# b1-arith-sum-ends | 3 | Aritmetik toplam: ilk ve son terimle | Arithmetic sum using the first and last terms
L S_n
R \dfrac{n}{2}\left(u_1+u_n\right)
X n\left(u_1+u_n\right) ;; \dfrac{u_1+u_n}{2} ;; \dfrac{n}{2}\left(u_n-u_1\right)
K $u_1$: ilk terim, $u_n$: son ($n$.) terim, $n$: terim sayısı.
KE $u_1$: first term, $u_n$: last ($n$th) term, $n$: number of terms.
U İlk ve son terimi biliyorsan toplamı en hızlı yoldan bulur.
UE The quickest way to find the sum when you know the first and the last term.
W Toplam = (ortalama terim) × (terim sayısı). Aritmetik dizide ortalama, ilk ve son terimin tam ortasıdır: $\tfrac{u_1+u_n}{2}$.
WE Sum = (average term) × (number of terms), and in an arithmetic sequence the average is halfway between the first and last terms.
E $1+2+\dots+100$: $S_{100}=\tfrac{100}{2}(1+100)=50\cdot 101=5050$.
H İlk + son, çarpı yarım $n$.
T last term = son terim ;; number of terms = terim sayısı ;; average = ortalama
Q Bir tiyatroda ilk sırada 12, son sırada 40 koltuk var ve 15 sıra var; koltuklar her sırada eşit miktarda artıyor. Toplam kaç koltuk var?
QE A theatre has 15 rows, with 12 seats in the first row and 40 in the last, increasing by the same amount each row. How many seats are there in total?
B \dfrac{[[n]]}{2}\left(u_1+[[u_n]]\right) || u_1 ;; d ;; n-1
C n=100:1:200:1 ; u_1=1:-20:50:1 ; u_n=100:-50:500:1 => n/2*(u_1+u_n)
CT S_{@n@}=\dfrac{@n@}{2}\left(@u_1@+@u_n@\right)=@=@
G b1_arith_ends
LAB sequence
BK 1.2

# b1-geo-nth | 3 | Geometrik dizinin n. terimi | The nth term of a geometric sequence
L u_n
R u_1\,r^{\,n-1}
X u_1\,r^{\,n} ;; (u_1\,r)^{\,n-1} ;; u_1+(n-1)\,r
K $u_1$: ilk terim, $r$: ortak çarpan (her adımda çarpılan sayı), $r\ne 0$.
KE $u_1$: first term, $r$: common ratio (the number you multiply by each time), $r\ne 0$.
U Her adımda aynı sayıyla çarpılan bir dizinin istediğin terimini bulur.
UE Finds any term of a sequence where you multiply by the same number each time.
W İlk terimden $n$. terime $n-1$ adım var ve her adımda $r$ ile çarparsın: $u_1\cdot r\cdot r\cdots r=u_1 r^{n-1}$. Aritmetik dizide toplarsın, geometrik dizide çarparsın.
WE There are $n-1$ steps from the first term to the nth, and each step multiplies by $r$.
E $u_1=3$, $r=2$: $u_5=3\cdot 2^4=48$. Dizi: $3, 6, 12, 24, 48$.
H Aritmetik = ekle, geometrik = çarp. Üs yine $n-1$!
T geometric sequence = geometrik dizi ;; common ratio = ortak çarpan (ortak oran) ;; term = terim
Q Bir videoyu ilk gün 5 kişi izliyor ve her gün izleyen sayısı bir önceki günün 3 katı oluyor. 6. gün kaç kişi izler?
QE On the first day 5 people watch a video, and each day three times as many people watch it as the day before. How many people watch it on day 6?
B [[u_1]]\,[[r]]^{\,[[n-1]]} || d ;; n ;; n+1
C u_1=3:-10:20:1 ; r=2:-3:3:0.5 ; n=5:1:15:1 => u_1*r^(n-1)
CT u_{@n@}=@u_1@\cdot @r@^{@n@-1}=@=@
G b1_geo_nth
LAB sequence
BK 1.3

# b1-geo-sum | 3 | Sonlu geometrik dizinin toplamı | The sum of a finite geometric sequence
L S_n
R \dfrac{u_1\left(r^{n}-1\right)}{r-1}
X \dfrac{u_1\left(r^{n-1}-1\right)}{r-1} ;; \dfrac{u_1\left(r^{n}-1\right)}{1-r} ;; \dfrac{u_1\left(r-1\right)}{r^{n}-1}
K $r\ne 1$. Kitapçıkta denk biçimi de var: $S_n=\dfrac{u_1\left(1-r^{n}\right)}{1-r}$; $|r|<1$ iken bu biçim daha rahattır. İkisi aynı sonucu verir, çünkü pay ve paydanın ikisi de $-1$ ile çarpılmıştır.
KE $r\ne 1$. The booklet also gives the equivalent form $S_n=\dfrac{u_1\left(1-r^{n}\right)}{1-r}$, which is handier when $|r|<1$. Both give the same answer: the numerator and the denominator are both multiplied by $-1$.
U Her adımda aynı sayıyla çarpılan ilk $n$ terimi tek tek toplamadan toplar.
UE Adds the first $n$ terms of a geometric sequence in one step.
W Toplamı $S_n$ ile, bir de $r$ ile çarpılmış hâlini ($rS_n$) yaz ve birbirinden çıkar: ortadaki tüm terimler birbirini götürür, $rS_n-S_n=u_1r^n-u_1$ kalır.
WE Write $S_n$ and $rS_n$ and subtract: all the middle terms cancel, leaving $rS_n-S_n=u_1r^n-u_1$.
E $3+6+12+24+48$: $u_1=3$, $r=2$, $n=5$, $S_5=\tfrac{3(2^5-1)}{2-1}=3\cdot 31=93$.
H Üs bu kez $n$ (n. terimdeki gibi $n-1$ değil)! Pay ve paydada aynı sıra: $r^n-1$ ve $r-1$.
T sum of a finite geometric sequence = sonlu geometrik dizinin toplamı ;; common ratio = ortak çarpan
Q Bir zincir mesajı ilk gün 2 kişiye gidiyor, sonra her gün bir önceki günün 3 katı kişiye gidiyor. İlk 6 günde toplam kaç mesaj gönderilmiş olur?
QE A chain message reaches 2 people on day 1, and each day it reaches three times as many people as the day before. How many messages are sent in total in the first 6 days?
B \dfrac{u_1\left(r^{[[n]]}-1\right)}{[[r-1]]} || n-1 ;; 1-r ;; r+1
C u_1=3:-10:20:1 ; r=2:-3:4:0.5 ; n=5:1:15:1 => r==1 ? u_1*n : u_1*(r^n-1)/(r-1)
CT S_{@n@}=\dfrac{@u_1@\left(@r@^{@n@}-1\right)}{@r@-1}=@=@
G b1_geo_sum
LAB sequence
BK 1.3

# b1-geo-inf | 3 | Sonsuz geometrik dizinin toplamı | The sum of an infinite geometric sequence
L S_\infty
R \dfrac{u_1}{1-r}
X \dfrac{u_1}{r-1} ;; \dfrac{u_1}{1+r} ;; \dfrac{1-r}{u_1}
K Yalnızca $|r|<1$ iken geçerlidir (yani $-1<r<1$). $|r|\ge 1$ ise terimler küçülmez ve toplam sonlu bir sayıya yaklaşmaz.
KE Only valid when $|r|<1$ (that is, $-1<r<1$). If $|r|\ge 1$ the terms do not shrink and the sum does not converge.
U Sonsuza kadar giden ama giderek küçülen terimlerin toplamını bulur.
UE Finds the total of infinitely many terms that keep getting smaller.
W $|r|<1$ ise $r^n$ sıfıra yaklaşır. Sonlu toplam formülünde $1-r^n$ yerine $1$ kalır: $\tfrac{u_1(1-0)}{1-r}=\tfrac{u_1}{1-r}$.
WE When $|r|<1$, $r^n$ approaches $0$, so the finite sum formula becomes $\tfrac{u_1}{1-r}$.
E $1+\tfrac12+\tfrac14+\tfrac18+\dots$: $u_1=1$, $r=\tfrac12$, $S_\infty=\tfrac{1}{1-\frac12}=2$.
H Sonsuz toplam = ilk terim bölü (1 eksi oran). Şart: $|r|<1$!
T sum to infinity = sonsuz toplam ;; converge = yakınsamak ;; infinite geometric sequence = sonsuz geometrik dizi
Q Bir top ilk zıplayışta 8 m yükseliyor ve her zıplayışta bir öncekinin yarısı kadar yükseliyor. Sonsuza kadar zıpladığını düşünürsen, tüm zıplama yüksekliklerinin toplamı kaç m eder?
QE A ball reaches a height of 8 m on its first bounce, and each bounce reaches half the height of the one before. If it bounced forever, what would the total of all the bounce heights be?
B \dfrac{[[u_1]]}{[[1-r]]} || r-1 ;; 1+r ;; u_n
C u_1=1:-20:20:1 ; r=0.5:-0.95:0.95:0.05 => u_1/(1-r)
CT S_\infty=\dfrac{@u_1@}{1-@r@}=@=@
G b1_geo_inf
LAB sequence
BK 1.8
S Zenon’un ünlü “Aşil ile kaplumbağa” paradoksu bu formülle çözülür: sonsuz sayıda adım, sonlu bir mesafe edebilir.

# b1-compound | 3 | Bileşik faiz | Compound interest
L FV
R PV\times\left(1+\dfrac{r}{100k}\right)^{kn}
X PV\times\left(1+\dfrac{r}{100}\right)^{kn} ;; PV\times\left(1+\dfrac{r}{100k}\right)^{n} ;; PV\times\left(1+\dfrac{rn}{100}\right)
K $FV$: gelecek değer, $PV$: bugünkü değer (yatırdığın para), $n$: yıl sayısı, $k$: yılda kaç kez faiz eklendiği (yıllık $k=1$, aylık $k=12$, üç ayda bir $k=4$), $r\%$: yıllık nominal faiz oranı.
KE $FV$: future value, $PV$: present value, $n$: number of years, $k$: number of compounding periods per year (yearly $k=1$, monthly $k=12$, quarterly $k=4$), $r\%$: nominal annual rate of interest.
U Bankaya yatırılan paranın yıllar sonra ne kadar olacağını bulur.
UE Finds how much an investment will be worth after some years.
W Her dönemde para $1+\tfrac{r}{100k}$ ile çarpılır (yıllık faiz $k$ parçaya bölünür). $n$ yılda toplam $kn$ dönem vardır, bu yüzden üs $kn$’dir. Faiz, faizin üstüne de eklenir.
WE Each period multiplies the money by $1+\tfrac{r}{100k}$, and there are $kn$ periods in $n$ years. Interest is also earned on earlier interest.
E $PV=1000$, $r=6$, aylık ($k=12$), $n=2$: $FV=1000\left(1+\tfrac{6}{1200}\right)^{24}\approx 1127{,}16$.
H $k$ iki yerde: paydada böler, üste çarpar.
T future value = gelecek değer ;; present value = bugünkü değer ;; compounded monthly = aylık bileşik
Q Bankaya 5000 TL yatırıyorsun. Banka yıllık %8 faiz veriyor ve faizi her üç ayda bir ekliyor. 3 yıl sonra hesabında kaç TL olur?
QE You invest 5000 TL in a bank paying 8% nominal annual interest, compounded quarterly. How much is in your account after 3 years?
B PV\times\left(1+\dfrac{r}{[[100k]]}\right)^{[[kn]]} || 100 ;; n ;; k
C PV=1000:100:10000:100 ; r=6:0.5:20:0.5 ; k=12:1:12:1 ; n=2:1:30:1 => PV*(1+r/(100*k))^(k*n)
CT FV=@PV@\left(1+\dfrac{@r@}{100\cdot @k@}\right)^{@k@\cdot @n@}=@=@
G b1_compound
LAB interest
BK 1.4

# b1-log-def | 3 | Logaritmanın tanımı | Definition of a logarithm
L a^{x}=b
O \iff
R x=\log_{a} b
X x=\log_b a ;; b=\log_a x ;; x=\dfrac{b}{a}
K Şartlar: $a>0$, $a\ne 1$, $b>0$. $a$: taban. $\log_a b$ şu soruyu sorar: “$a$’yı kaçıncı kuvvete yükseltirsem $b$ olur?”
KE Conditions: $a>0$, $b>0$, $a\ne 1$. $a$ is the base. $\log_a b$ asks: “to what power must I raise $a$ to get $b$?”
U Üsteki bilinmeyeni aşağı indirip bulmanı sağlar; üslü denklemlerin anahtarıdır.
UE Lets you find an unknown exponent; it is the key to solving exponential equations.
W Logaritma, üs almanın tersidir. $2^3=8$ ise “$2$’den $8$’e gitmek için üs kaç?” sorusunun cevabı $3$’tür: $\log_2 8=3$. Logaritmanın sonucu her zaman bir üstür.
WE A logarithm undoes a power: since $2^3=8$, the power that takes $2$ to $8$ is $3$, so $\log_2 8=3$. A logarithm always gives you an exponent.
E $\log_3 81=4$, çünkü $3^4=81$. $\log_{10}0{,}01=-2$, çünkü $10^{-2}=0{,}01$. $\log_2 1=0$, çünkü $2^0=1$.
H Log = “kaçıncı kuvvet?” Taban, tabanda kalır: $a^x=b\iff \log_a b=x$.
T logarithm = logaritma ;; base = taban ;; exponent = üs
Q Bir bakteri sayısı her saat ikiye katlanıyor. Tek bir bakteriden kaç saat sonra 1024 bakteri olur?
QE A number of bacteria doubles every hour. Starting from one bacterium, after how many hours will there be 1024 bacteria?
B x=\log_{[[a]]}[[b]] || x ;; 10 ;; e
C a=2:2:10:1 ; b=8:1:1000:1 => log(a,b)
CT @a@^{x}=@b@\iff x=\log_{@a@}@b@\approx @=@
G b1_log_def
LAB explog
BK 1.5

# b1-log-inv1 | 3 | Bir tabanın kuvvetinin logaritması | Logarithm of a power of the base
L \log_a a^{x}
R x
X a^{x} ;; a ;; 1
K $a>0$, $a\ne 1$. Taban ile logaritmanın tabanı aynı olmalı: $\log_2 2^7=7$ ama $\log_2 3^7\ne 7$.
KE $a>0$, $a\ne 1$. The base of the power and the base of the logarithm must match: $\log_2 2^7=7$, but $\log_2 3^7\ne 7$.
U Aynı tabanlı log ile üssü birbirini götürür; sadeleştirmeyi tek adımda bitirir.
UE A logarithm and a power with the same base cancel each other out.
W $\log_a$ şu soruyu sorar: “$a$’nın kaçıncı kuvveti?” $a^x$ zaten $a$’nın $x$. kuvveti; cevap doğrudan $x$.
WE $\log_a$ asks “which power of $a$?”, and $a^x$ is already the $x$th power of $a$, so the answer is $x$.
E $\log_5 5^{3}=3$. $\log_2 32=\log_2 2^5=5$. $\log_{10}1000=\log_{10}10^3=3$.
H Log ve üs aynı tabanlıysa birbirini siler.
T inverse function = ters fonksiyon ;; cancel out = birbirini götürmek
Q Bir kâğıdı her katladığında kat sayısı ikiye katlanıyor ve şu an $2^{9}$ kat var. Kâğıdı kaç kez katladın? Cevabı 2 tabanlı logaritma ile yaz.
QE Each fold doubles the number of layers of a sheet of paper, and there are now $2^{9}$ layers. How many times did you fold it? Use a base-2 logarithm.
B [[x]] || a ;; a^{x} ;; 1
C a=2:2:10:1 ; x=5:-5:10:1 => log(a, a^x)
CT \log_{@a@}@a@^{@x@}=@=@
G b1_log_inv1
LAB explog
V a:1.5:4,x:-3:3
BK 1.7

# b1-log-inv2 | 3 | Logaritmanın tabanla üssü | A base raised to its own logarithm
L a^{\log_a x}
R x
X a^{x} ;; \log_a x ;; a
K $a>0$, $a\ne 1$, $x>0$. Üsteki logaritmanın tabanı, aşağıdaki tabanla aynı olmalı.
KE $a>0$, $a\ne 1$, $x>0$. The base of the logarithm in the exponent must match the base of the power.
U Aynı tabanlı üs ile log birbirini götürür; karmaşık görünen ifadeyi bir anda sadeleştirir.
UE A power and a logarithm with the same base cancel, so a scary-looking expression becomes simple.
W $\log_a x$, “$a$’yı kaçıncı kuvvete yükseltirsem $x$ olur?” sorusunun cevabıdır. $a$’yı tam o kuvvete yükseltince elbette $x$ elde edersin.
WE $\log_a x$ is exactly the power that turns $a$ into $x$, so raising $a$ to that power gives $x$.
E $3^{\log_3 7}=7$. $10^{\log_{10}5}=5$. $e^{\ln 4}=4$ (çünkü $\ln=\log_e$).
H Taban, kendi logunu yutar: $a^{\log_a x}=x$.
T logarithmic function = logaritma fonksiyonu ;; exponential function = üstel fonksiyon
Q Bir ifadede $7^{\log_7 50}$ yazıyor. Hesap makinesi kullanmadan bunun değerini nasıl bulursun?
QE An expression contains $7^{\log_7 50}$. How can you find its value without a calculator?
B [[x]] || a ;; \log_a x ;; a^{x}
C a=2:2:10:1 ; x=7:1:100:1 => a^log(a,x)
CT @a@^{\log_{@a@}@x@}=@=@
G b1_log_inv2
LAB explog
V a:1.5:4,x
BK 1.7

# b1-log-product | 3 | Çarpımın logaritması | The logarithm of a product
L \log_a xy
R \log_a x+\log_a y
X \log_a x\cdot\log_a y ;; \log_a (x+y) ;; \log_a x-\log_a y
K $a>0$, $a\ne 1$, $x>0$, $y>0$. Dikkat: $\log_a(x+y)$ için böyle bir kural yoktur!
KE $a>0$, $a\ne 1$, $x>0$, $y>0$. Careful: there is no such rule for $\log_a(x+y)$!
U Çarpımın logunu iki logun toplamına ayırır (ya da iki logu tek loga birleştirir).
UE Splits the log of a product into a sum of logs, or combines two logs into one.
W Çarpmada üsler toplanır: $2^3\cdot 2^4=2^{7}$. Logaritmalar üs olduğu için çarpım, logların toplamına dönüşür: $\log_2(8\cdot 16)=3+4=7$.
WE When you multiply powers you add the exponents, and logarithms are exponents, so a product becomes a sum of logs.
E $\log_6 4+\log_6 9=\log_6 36=2$. $\log_{10}2+\log_{10}5=\log_{10}10=1$.
H Çarpım içeride, toplam dışarıda.
T laws of logarithms = logaritma kuralları ;; product = çarpım ;; sum = toplam
Q Hesap makinesi olmadan $\log_{10}4+\log_{10}25$ ifadesinin değerini bulman isteniyor. Hangi kural işini görür?
QE You are asked to find $\log_{10}4+\log_{10}25$ without a calculator. Which rule helps?
B \log_a x[[+]]\log_a y || - ;; \times ;; \div
C a=2:2:10:1 ; x=4:1:100:1 ; y=8:1:100:1 => log(a,x)+log(a,y)
CT \log_{@a@}@x@+\log_{@a@}@y@=\log_{@a@}(@x@\cdot @y@)\approx @=@
G b1_log_prod
LAB explog
V a:1.5:4,x,y
BK 1.7

# b1-log-quotient | 3 | Bölümün logaritması | The logarithm of a quotient
L \log_a \dfrac{x}{y}
R \log_a x-\log_a y
X \dfrac{\log_a x}{\log_a y} ;; \log_a x+\log_a y ;; \log_a y-\log_a x
K $a>0$, $a\ne 1$, $x>0$, $y>0$. Sıra önemli: paydaki önce, paydadaki sonra.
KE $a>0$, $a\ne 1$, $x>0$, $y>0$. Order matters: the numerator comes first, the denominator is subtracted.
U Bölümün logunu iki logun farkına ayırır (ya da iki logu tek loga birleştirir).
UE Splits the log of a quotient into a difference of logs, or combines two logs into one.
W Bölmede üsler çıkarılır: $\tfrac{2^5}{2^3}=2^{2}$. Log da bir üs olduğu için bölüm, logların farkına dönüşür.
WE When you divide powers you subtract the exponents, so the log of a quotient is a difference of logs.
E $\log_2 40-\log_2 5=\log_2 8=3$. $\log_3 54-\log_3 2=\log_3 27=3$.
H Bölüm içeride, fark dışarıda. Önce pay, sonra payda.
T quotient = bölüm ;; difference = fark ;; laws of logarithms = logaritma kuralları
Q Hesap makinesi olmadan $\log_2 96-\log_2 3$ ifadesinin değerini bulman gerekiyor. Hangi kural yardım eder?
QE You need the value of $\log_2 96-\log_2 3$ without a calculator. Which rule helps?
B \log_a [[x]][[-]]\log_a [[y]] || + ;; xy ;; \dfrac{x}{y}
C a=2:2:10:1 ; x=40:1:200:1 ; y=5:1:100:1 => log(a,x)-log(a,y)
CT \log_{@a@}@x@-\log_{@a@}@y@=\log_{@a@}\dfrac{@x@}{@y@}\approx @=@
G b1_log_quot
LAB explog
V a:1.5:4,x,y
BK 1.7

# b1-log-power | 3 | Kuvvetin logaritması | The logarithm of a power
L \log_a x^{m}
R m\log_a x
X (\log_a x)^{m} ;; \log_a (mx) ;; m+\log_a x
K $a>0$, $a\ne 1$, $x>0$. Üs, log’un önüne çarpan olarak iner. Ama $(\log_a x)^m$ farklıdır: orada üs logun dışında.
KE $a>0$, $a\ne 1$, $x>0$. The exponent comes down in front as a multiplier. But $(\log_a x)^m$ is different: there the power is outside the log.
U Logun içindeki üssü öne indirir; üsteki bilinmeyeni bulmanın yoludur.
UE Brings the exponent down in front of the log; this is how you free an unknown from the exponent.
W $x^3=x\cdot x\cdot x$ olduğu için çarpım kuralıyla $\log_a x^3=\log_a x+\log_a x+\log_a x=3\log_a x$.
WE Because $x^3=x\cdot x\cdot x$, the product rule gives $\log_a x^3=\log_a x+\log_a x+\log_a x=3\log_a x$.
E $\log_2 8^5=5\log_2 8=5\cdot 3=15$. $\log_a x=4$ ise $\log_a x^3=12$.
H Üs, logun önüne iner (ve çarpan olur).
T power = kuvvet ;; coefficient = katsayı ;; laws of logarithms = logaritma kuralları
Q $\log_5 x=2$ olduğu biliniyor. $\log_5 x^3$ değerini hesap makinesi olmadan nasıl bulursun?
QE You know that $\log_5 x=2$. How do you find $\log_5 x^3$ without a calculator?
B [[m]]\log_a [[x]] || x^{m} ;; \dfrac{1}{m} ;; a
C a=2:2:10:1 ; x=8:1:100:1 ; m=5:-5:10:1 => m*log(a,x)
CT \log_{@a@}@x@^{@m@}=@m@\cdot\log_{@a@}@x@\approx @=@
G b1_log_pow
LAB explog
V a:1.5:4,x,m
BK 1.7

# b1-log-change | 3 | Taban değiştirme | Change of base
L \log_a x
R \dfrac{\log_b x}{\log_b a}
X \dfrac{\log_b a}{\log_b x} ;; \log_b x-\log_b a ;; \log_b \dfrac{x}{a}
K $a,b>0$, $a,b\ne 1$, $x>0$. $b$ istediğin taban olabilir; hesap makinesinde genelde $b=e$ ($\ln$) ya da $b=10$ ($\log$) seçilir.
KE $a,b>0$, $a,b\ne 1$, $x>0$. You may choose any base $b$; on a calculator you usually take $b=e$ ($\ln$) or $b=10$ ($\log$).
U Herhangi bir tabandaki logu, hesap makinesinin bildiği tabana çevirir.
UE Converts a log in any base into a base your calculator knows.
W Yeni tabanda iki log yazarsın: üstte logun içi ($x$), altta eski taban ($a$). Ör. $\log_4 8$: ikisi de $2$’nin kuvveti, $\tfrac{\log_2 8}{\log_2 4}=\tfrac{3}{2}$.
WE In the new base, the inside of the log ($x$) goes on top and the old base ($a$) goes on the bottom.
E $\log_4 8=\tfrac{\log_2 8}{\log_2 4}=\tfrac32$. Hesap makinesiyle $\log_3 20=\tfrac{\ln 20}{\ln 3}\approx 2{,}73$.
H İçerisi üste, taban alta: “$x$ üstte, $a$ altta”.
T change of base = taban değiştirme ;; natural logarithm = doğal logaritma
Q Hesap makinende yalnızca $\ln$ ve $\log$ tuşları var. $\log_7 100$ değerini nasıl hesaplarsın?
QE Your calculator only has $\ln$ and $\log$ keys. How do you work out $\log_7 100$?
B \dfrac{\log_b [[x]]}{\log_b [[a]]} || b ;; 10 ;; ax
C a=3:2:10:1 ; x=20:1:1000:1 => ln(x)/ln(a)
CT \log_{@a@}@x@=\dfrac{\ln @x@}{\ln @a@}\approx @=@
G b1_log_change
LAB explog
V a:1.5:4,b:1.5:4,x
BK 1.7

# b1-exp-e | 2 | Her üstel ifadeyi $e$ tabanına çevirmek | Writing any exponential with base $e$
L a^{x}
R e^{x\ln a}
X e^{a\ln x} ;; a\,e^{x} ;; e^{x}\ln a
K $a>0$. $e\approx 2{,}718$ ve $\ln a=\log_e a$.
KE $a>0$. $e\approx 2.718$ and $\ln a=\log_e a$.
U Her üstel fonksiyonu $e$ tabanında yazar; türev ve integral alırken çok işe yarar.
UE Rewrites any exponential in base $e$, which is very useful later for differentiation and integration.
W $a=e^{\ln a}$ olduğu için $a^x=\left(e^{\ln a}\right)^x=e^{x\ln a}$ (üssün üssü çarpılır).
WE Since $a=e^{\ln a}$, we get $a^x=\left(e^{\ln a}\right)^x=e^{x\ln a}$ (powers of powers multiply).
E $2^x=e^{x\ln 2}\approx e^{0{,}693x}$. $e^{3\ln 2}=2^3=8$.
H Taban üsse iner, başına $\ln$ alır: $a^x=e^{x\ln a}$.
T exponential function = üstel fonksiyon ;; natural logarithm = doğal logaritma ;; Euler’s number = Euler sayısı
Q Bir nüfus modeli $P=500\cdot 2^{t}$ olarak verilmiş, ama soruda modeli $P=500\,e^{kt}$ biçiminde yazman isteniyor. $k$’yı nasıl bulursun?
QE A population model is given as $P=500\cdot 2^{t}$, but the question asks you to write it in the form $P=500\,e^{kt}$. How do you find $k$?
B e^{[[x]]\ln [[a]]} || e ;; 10 ;; \log
C a=2:0.5:10:0.5 ; x=3:-5:5:0.5 => exp(x*ln(a))
CT @a@^{@x@}=e^{@x@\ln @a@}=@=@
G b1_exp_e
LAB explog
V a,x
BK 1.7

# b1-ncr | 3 | Kombinasyon: $ {}^{n}C_{r}$ | The binomial coefficient $ {}^{n}C_{r}$
L {}^{n}C_{r}
R \dfrac{n!}{r!\,(n-r)!}
X \dfrac{n!}{r!} ;; \dfrac{n!}{(n-r)!} ;; \dfrac{n!}{r!+(n-r)!}
K $n!=1\cdot 2\cdot 3\cdots n$ ($n$ faktöriyel), $0!=1$. $n\in\mathbb{N}$ ve $0\le r\le n$. Sorularda $\binom{n}{r}$ diye de yazılır; ikisi aynı şeydir.
KE $n!=1\times 2\times 3\times\dots\times n$ ($n$ factorial), $0!=1$. $n\in\mathbb{N}$, $0\le r\le n$. It is also written $\binom{n}{r}$; both mean the same thing.
U $n$ şeyin içinden sırası önemsiz $r$ tanesini kaç farklı şekilde seçebileceğini sayar; binom açılımının katsayılarını verir.
UE Counts the ways to choose $r$ items from $n$ when order does not matter; it gives the coefficients in a binomial expansion.
W $n!$ tüm sıralamaları sayar. Seçilen $r$ kişinin kendi arasındaki sırası ($r!$) ve seçilmeyenlerin sırası ($(n-r)!$) önemli olmadığından bu ikisine bölünür.
WE $n!$ counts every ordering; you divide by $r!$ and $(n-r)!$ because the order inside the chosen group and inside the rest does not matter.
E $ {}^{5}C_{2}=\tfrac{5!}{2!\,3!}=\tfrac{120}{2\cdot 6}=10$. Hesap makinesinde: 5 nCr 2.
H Üstte $n!$, altta “seçilen!” çarpı “kalan!”.
T binomial coefficient = binom katsayısı ;; factorial = faktöriyel ;; combination = kombinasyon
Q Sınıftaki 8 kişiden 3 kişilik bir proje ekibi seçilecek. Kaç farklı ekip kurulabilir?
QE A team of 3 is chosen from 8 students in a class. How many different teams are possible?
B \dfrac{[[n!]]}{[[r!]]\,([[n-r]])!} || n ;; (n+r) ;; r
C n=5:2:15:1 ; r=2:0:6:1 => r<=n ? nCr(n,r) : 0/0
CT {}^{@n@}C_{@r@}=\dfrac{@n@!}{@r@!\,(@n@-@r@)!}=@=@
G b1_ncr
BK 1.9

# b1-binom-thm | 3 | Binom teoremi | The binomial theorem
L (a+b)^{n}
R a^{n}+{}^{n}C_{1}\,a^{n-1}b+\dots+{}^{n}C_{r}\,a^{n-r}b^{r}+\dots+b^{n}
X a^{n}+b^{n} ;; a^{n}+n\,a^{n-1}b+\dots+n\,a^{n-r}b^{r}+\dots+b^{n} ;; a^{n}+{}^{n}C_{1}\,a^{n}b+\dots+{}^{n}C_{r}\,a^{n}b^{r}+\dots+b^{n}
K $n\in\mathbb{N}$. Toplam $n+1$ terim vardır. Her terimde $a$’nın ve $b$’nin üsleri toplamı $n$’dir: $a$’nın üssü birer azalır, $b$’ninki birer artar.
KE $n\in\mathbb{N}$. There are $n+1$ terms. In every term the powers of $a$ and $b$ add up to $n$: the power of $a$ goes down by one while the power of $b$ goes up by one.
U Parantezi tek tek çarpmadan $(a+b)^n$’i açar.
UE Expands $(a+b)^n$ without multiplying out the brackets one by one.
W $(a+b)^n$’de her parantezden ya $a$ ya $b$ seçersin. $r$ tane $b$ seçmenin $ {}^{n}C_{r}$ yolu vardır; o terim $a^{n-r}b^{r}$ olur.
WE From each of the $n$ brackets you pick $a$ or $b$; there are $ {}^{n}C_{r}$ ways to pick $b$ exactly $r$ times, giving $a^{n-r}b^{r}$.
E $(x+2)^3=x^3+3\cdot x^2\cdot 2+3\cdot x\cdot 2^2+2^3=x^3+6x^2+12x+8$.
H $a$ iner, $b$ çıkar, üsler toplamı hep $n$; katsayılar Pascal üçgeninden.
T binomial expansion = binom açılımı ;; binomial theorem = binom teoremi ;; coefficient = katsayı
Q $(x+3)^5$ ifadesini parantezleri beş kez çarpmadan açman isteniyor. Ne kullanırsın?
QE You are asked to expand $(x+3)^5$ without multiplying the brackets out five times. What do you use?
B a^{n}+{}^{n}C_{1}\,a^{[[n-1]]}b+\dots+{}^{n}C_{r}\,a^{[[n-r]]}b^{[[r]]}+\dots+b^{n} || n ;; r-1 ;; n+r
C a=2:-5:5:1 ; b=1:-5:5:1 ; n=3:0:8:1 => (a+b)^n
CT (@a@+@b@)^{@n@}=@a@^{@n@}+{}^{@n@}C_{1}\,@a@^{@n@-1}\cdot @b@+\dots+@b@^{@n@}=@=@
G b1_binom
BK 1.9
S Bu katsayıların üçgeni Avrupa’da Pascal üçgeni, İran’da Hayyam üçgeni, Çin’de Yang Hui üçgeni diye anılır: Pascal’dan yüzyıllar önce biliniyordu.

## x1

# x1-common-diff | 3 | Ortak farkı bulma | Finding the common difference
L d
R u_{n+1}-u_{n}
X u_{n}-u_{n+1} ;; \dfrac{u_{n+1}}{u_{n}} ;; u_{n+1}+u_{n}
K Bir dizi, ardışık her iki terimin farkı hep aynıysa aritmetiktir. Herhangi iki komşu terimi kullanabilirsin: $d=u_2-u_1=u_3-u_2=\dots$
KE A sequence is arithmetic when the difference between consecutive terms is always the same. Any pair of neighbouring terms works: $d=u_2-u_1=u_3-u_2=\dots$
U Bir dizinin aritmetik olup olmadığını ve ortak farkını bulur.
UE Finds the common difference and checks whether a sequence is arithmetic.
W Her adımda eklenen sayıyı bulmak için bir terimden, bir öncekini çıkarırsın: sonraki eksi önceki. Dizi azalıyorsa $d$ negatif çıkar.
WE To find what is added each step, subtract a term from the next one: later minus earlier. If the sequence decreases, $d$ is negative.
E $5, 9, 13, \dots$: $d=9-5=4$. $20, 17, 14, \dots$: $d=17-20=-3$.
H Sonraki eksi önceki. Ters çıkarırsan işaret yanlış olur!
T common difference = ortak fark ;; consecutive terms = ardışık terimler
Q Bir asansör 2., 5., 8. ve 11. katlarda duruyor. Duraklar arasındaki kat sayısı hep aynı mı ve kaç?
QE A lift stops at floors 2, 5, 8 and 11. Is the gap between stops always the same, and if so what is it?
B u_{[[n+1]]}-u_{[[n]]} || n-1 ;; 1
C u_1=5:-20:20:1 ; u_2=9:-20:20:1 => u_2-u_1
CT d=@u_2@-@u_1@=@=@
G b1_x1_diff
LAB sequence

# x1-common-ratio | 3 | Ortak çarpanı bulma | Finding the common ratio
L r
R \dfrac{u_{n+1}}{u_{n}}
X \dfrac{u_{n}}{u_{n+1}} ;; u_{n+1}-u_{n} ;; u_{n+1}\cdot u_{n}
K $u_n\ne 0$. Bir dizi, ardışık iki terimin bölümü hep aynıysa geometriktir: $r=\tfrac{u_2}{u_1}=\tfrac{u_3}{u_2}=\dots$ $r$ negatif ya da kesir olabilir.
KE $u_n\ne 0$. A sequence is geometric when the ratio of consecutive terms is always the same: $r=\tfrac{u_2}{u_1}=\tfrac{u_3}{u_2}=\dots$ The ratio can be negative or a fraction.
U Bir dizinin geometrik olup olmadığını ve ortak çarpanını bulur.
UE Finds the common ratio and checks whether a sequence is geometric.
W Her adımda neyle çarpıldığını bulmak için sonraki terimi bir öncekine bölersin: sonraki bölü önceki.
WE To find what each term is multiplied by, divide a term by the one before it: later over earlier.
E $3, 6, 12, \dots$: $r=\tfrac{6}{3}=2$. $80, 40, 20, \dots$: $r=\tfrac{40}{80}=\tfrac12$. $2, -6, 18, \dots$: $r=-3$.
H Sonraki bölü önceki. Aritmetikte çıkar, geometrikte böl.
T common ratio = ortak çarpan (ortak oran) ;; geometric sequence = geometrik dizi
Q Bir arabanın değeri yıllara göre 80 000, 64 000, 51 200 TL olarak gidiyor. Değer her yıl hangi sayıyla çarpılıyor?
QE A car is worth 80 000, 64 000 and then 51 200 TL in consecutive years. What is the value multiplied by each year?
B \dfrac{u_{[[n+1]]}}{u_{[[n]]}} || n-1 ;; 1
C u_1=3:-20:20:1 ; u_2=6:-50:50:1 => u_1==0 ? 0/0 : u_2/u_1
CT r=\dfrac{@u_2@}{@u_1@}=@=@
G b1_x1_ratio
LAB sequence

# x1-num-terms | 2 | Terim sayısını bulma | Finding the number of terms
L n
R \dfrac{u_n-u_1}{d}+1
X \dfrac{u_n-u_1}{d} ;; \dfrac{u_n+u_1}{d}+1 ;; \dfrac{u_n-u_1}{d}-1
K Aritmetik dizi için. $u_1$: ilk terim, $u_n$: son terim, $d$: ortak fark ($d\ne 0$). $u_n=u_1+(n-1)d$ formülünden $n$ çekilerek bulunur.
KE For an arithmetic sequence. $u_1$: first term, $u_n$: last term, $d$: common difference ($d\ne 0$). It comes from rearranging $u_n=u_1+(n-1)d$.
U Bir aritmetik dizide baştan sona kaç terim olduğunu sayar.
UE Counts how many terms an arithmetic sequence has from start to finish.
W Baştan sona $\tfrac{u_n-u_1}{d}$ adım atarsın. Ama terimler adımlardan bir fazladır (çit direkleri gibi): $3$ adımda $4$ direk vardır. Bu yüzden $+1$.
WE From the first to the last term there are $\tfrac{u_n-u_1}{d}$ steps, and there is always one more term than steps (like fence posts), hence $+1$.
E $7, 11, 15, \dots, 99$: $n=\tfrac{99-7}{4}+1=23+1=24$ terim.
H Adım sayısı + 1 = terim sayısı (çit direği kuralı).
T number of terms = terim sayısı ;; rearrange = yeniden düzenlemek ;; last term = son terim
Q Bir koşuda göğüs numaraları 12’den başlıyor ve 3’er artarak 300’e kadar gidiyor (12, 15, 18, …, 300). Kaç koşucu var?
QE In a race, the bib numbers start at 12 and go up in steps of 3 until 300 (12, 15, 18, …, 300). How many runners are there?
B \dfrac{u_n-[[u_1]]}{[[d]]}+[[1]] || u_n ;; 2 ;; n
C u_1=7:-50:50:1 ; u_n=99:-100:500:1 ; d=4:1:10:1 => (u_n-u_1)/d+1
CT n=\dfrac{@u_n@-@u_1@}{@d@}+1=@=@
G b1_x1_nterms
LAB sequence

# x1-sigma | 3 | Sigma ($\Sigma$) gösterimi | Sigma notation
L \sum_{k=1}^{n} u_k
R u_1+u_2+u_3+\dots+u_n
X u_1\cdot u_2\cdot u_3\cdots u_n ;; u_n ;; u_1+u_n
K $k$: sayaç (index); $1$’den başlar, her seferinde $1$ artar ve $n$’de durur. Altta başlangıç, üstte bitiş değeri yazar.
KE $k$ is the index: it starts at $1$, goes up by $1$ each time and stops at $n$. The starting value is written below and the final value above.
U Uzun bir toplamı tek, kısa bir sembolle yazar.
UE Writes a long sum in a short, compact way.
W $\Sigma$ “topla” demektir. Sayaç $k$’ya sırayla $1, 2, 3, \dots, n$ değerlerini verir, her biri için terimi hesaplar ve hepsini toplarsın.
WE $\Sigma$ means “add up”: give the index the values $1, 2, \dots, n$ in turn, work out each term and add them all.
E $\sum_{k=1}^{4}(2k+1)=3+5+7+9=24$. $\sum_{k=1}^{3}k^2=1+4+9=14$.
H $\Sigma$, Yunan alfabesinin büyük S harfidir: S = Sum (toplam).
T sigma notation = sigma gösterimi ;; index = sayaç (indis) ;; series = seri
Q Bir soruda büyük bir Yunan harfi var: altında $k=1$, üstünde $10$, yanında $3k$ yazıyor. Bu ifade ne anlatıyor?
QE A question shows a large Greek letter with $k=1$ below it, $10$ above it and $3k$ next to it. What does this mean?
B u_1+u_2+u_3+\dots+[[u_n]] || u_k ;; u_{n+1} ;; n
C n=4:1:20:1 ; a=2:-5:5:1 ; b=1:-10:10:1 => a*n*(n+1)/2+b*n
CT \sum_{k=1}^{@n@}(@a@k+@b@)=@=@
G b1_x1_sigma
LAB sequence

# x1-depreciation | 3 | Değer kaybı (amortisman) | Depreciation
L FV
R PV\times\left(1-\dfrac{r}{100}\right)^{n}
X PV\times\left(1+\dfrac{r}{100}\right)^{n} ;; PV\times\left(1-\dfrac{rn}{100}\right) ;; PV\times\left(\dfrac{r}{100}\right)^{n}
K $PV$: başlangıç değeri, $FV$: $n$ yıl sonraki değer, $r\%$: her yıl kaybedilen yüzde. Kitapçıktaki faiz formülüne benzer, ama değer azaldığı için artı yerine eksi var.
KE $PV$: starting value, $FV$: value after $n$ years, $r\%$: the percentage lost each year. It is like the compound interest formula, but with a minus because the value goes down.
U Arabanın, telefonun ya da makinenin yıllar içinde ne kadar değer kaybettiğini bulur.
UE Finds how much a car, phone or machine is worth after losing value for some years.
W Her yıl değerin $\%r$’si gider, $\%(100-r)$’si kalır: yani her yıl $1-\tfrac{r}{100}$ ile çarparsın. $n$ yıl boyunca bu çarpım $n$ kez tekrarlanır.
WE Each year the value is multiplied by $1-\tfrac{r}{100}$, and this happens $n$ times.
E $20\,000$ TL’lik bilgisayar her yıl $\%10$ değer kaybediyor: 2 yıl sonra $20\,000\times 0{,}9^2=16\,200$ TL.
H Kayıpta eksi, kazançta artı; üs = yıl sayısı.
T depreciation = değer kaybı (amortisman) ;; depreciate = değer kaybetmek ;; value = değer
Q Yeni bir motosiklet 100 000 TL ve her yıl değerinin %15’ini kaybediyor. 4 yıl sonra kaç TL eder?
QE A new motorbike costs 100 000 TL and loses 15% of its value every year. What is it worth after 4 years?
B PV\times\left(1[[-]]\dfrac{r}{100}\right)^{[[n]]} || + ;; r ;; -n
C PV=20000:1000:100000:1000 ; r=10:1:50:1 ; n=2:1:20:1 => PV*(1-r/100)^n
CT FV=@PV@\times\left(1-\dfrac{@r@}{100}\right)^{@n@}=@=@
G b1_x1_dep
LAB percent

# x1-log-one | 3 | $1$’in logaritması | The logarithm of 1
L \log_a 1
R 0
X 1 ;; a ;; ~Tanımsız (undefined)
K $a>0$, $a\ne 1$. Hangi taban olursa olsun sonuç $0$’dır: $\log 1=0$, $\ln 1=0$.
KE $a>0$, $a\ne 1$. Whatever the base, the answer is $0$: $\log 1=0$ and $\ln 1=0$.
U Logaritmalı ifadeleri sadeleştirirken ve grafiğin $x$ eksenini kestiği noktayı bulurken kullanılır.
UE Used to simplify log expressions and to find where a log graph crosses the $x$-axis.
W Sıfırıncı kuvvette her sayı $1$’dir: $a^0=1$. Logaritma “kaçıncı kuvvet?” diye sorduğu için $\log_a 1=0$.
WE Any base to the power $0$ is $1$ ($a^0=1$), so the power that gives $1$ is $0$.
E $\log_7 1=0$, $\ln 1=0$. Her $y=\log_a x$ grafiği $(1,\,0)$ noktasından geçer.
H Bir’in logu sıfırdır, çünkü sıfırıncı kuvvet birdir.
T zero = sıfır ;; x-intercept = x eksenini kestiği nokta
Q $y=\log_3 x$ grafiği $x$ eksenini hangi noktada keser?
QE At which point does the graph of $y=\log_3 x$ cross the $x$-axis?
B [[0]] || 1 ;; a
C a=2:2:10:1 => log(a,1)
CT \log_{@a@}1=@=@\quad(@a@^{0}=1)
G b1_x1_logbasic
LAB explog
V a:1.5:4

# x1-log-self | 3 | Tabanın kendi logaritması | The logarithm of the base itself
L \log_a a
R 1
X 0 ;; a ;; \dfrac{1}{a}
K $a>0$, $a\ne 1$. Örnekler: $\log_{10}10=1$, $\ln e=1$.
KE $a>0$, $a\ne 1$. Examples: $\log_{10}10=1$ and $\ln e=1$.
U Tabanla aynı sayının logunu anında verir; sadeleştirmede sık kullanılır.
UE Instantly gives the log of the base itself; used all the time when simplifying.
W Bir sayının birinci kuvveti kendisidir: $a^1=a$. Bu yüzden “$a$’dan $a$’ya gitmek için kaçıncı kuvvet?” sorusunun cevabı $1$’dir.
WE Any number to the power $1$ is itself ($a^1=a$), so the power that takes $a$ to $a$ is $1$.
E $\log_5 5=1$. $\log_2 2+\log_2 1=1+0=1$.
H Kendi tabanının logu: her zaman $1$.
T logarithm = logaritma ;; base = taban
Q $\log_8 8$ ifadesinin değerini hesap makinesi olmadan nasıl söylersin?
QE How can you give the value of $\log_8 8$ without a calculator?
B [[1]] || 0 ;; a
C a=2:2:10:1 => log(a,a)
CT \log_{@a@}@a@=@=@\quad(@a@^{1}=@a@)
G b1_x1_logbasic
LAB explog
V a:1.5:4

# x1-log10 | 3 | $\log x$ yazınca taban 10’dur | “log x” means base 10
L \log x
R \log_{10} x
X \ln x ;; \log_{2} x ;; \log_{x} 10
K $x>0$. IB’de ve hesap makinesinde taban yazılmamışsa $\log$, 10 tabanlıdır ($\log$ tuşu). $e$ tabanlı log ise $\ln$ ile yazılır ($\ln$ tuşu).
KE $x>0$. In IB and on your calculator, $\log$ with no base written means base $10$ (the $\log$ key). Base $e$ is written $\ln$ (the $\ln$ key).
U Tabanı yazılmamış bir logu doğru okumanı ve hesap makinesinde doğru tuşa basmanı sağlar.
UE Helps you read a log with no base correctly and press the right calculator key.
W Sayı sistemimiz 10 tabanlı olduğu için 10 tabanlı log çok kullanılır; bu yüzden tabanı yazılmaz. $\log 1000=3$, çünkü $10^3=1000$: $\log$, sayının kaç basamaklı olduğunu da kabaca söyler.
WE Our number system is base 10, so base-10 logs are so common that the base is left out: $\log 1000=3$ because $10^3=1000$.
E $\log 100=2$, $\log 0{,}1=-1$, $\log 1=0$.
H Yazmıyorsa on: $\log=\log_{10}$, $\ln=\log_e$.
T common logarithm = 10 tabanlı logaritma ;; base 10 = 10 tabanı
Q Sınav sorusunda $\log 500$ yazıyor ve taban yok. Hesap makinesinde hangi tuşa basarsın?
QE An exam question says $\log 500$ with no base shown. Which calculator key do you press?
B \log_{[[10]]} x || e ;; 2 ;; 1
C x=1000:1:100000:1 => log10(x)
CT \log @x@=\log_{10}@x@\approx @=@
G b1_x1_log10
LAB explog
V x

# x1-e-value | 3 | Euler sayısı $e$ | Euler’s number $e$
L e
O \approx
R 2{,}718
X 3{,}142 ;; 1{,}718 ;; 2{,}178
K $e$ irrasyonel bir sayıdır, ondalık kısmı sonsuza kadar devam eder: $e=2{,}71828\dots$ Hesap makinesinde $e^{1}$ ile görebilirsin. (İngilizce yazımda: 2.718)
KE $e$ is an irrational number whose decimals never end: $e=2.71828\dots$ You can see it on your calculator as $e^{1}$.
U Doğal büyüme, sürekli faiz, $\ln$ ve kalkülüste karşına çıkan özel tabandır.
UE The special base behind natural growth, $\ln$ and calculus.
W Paran yılda $\%100$ faizle ne kadar sık bileşirse o kadar artar ama sınırsız artmaz: $\left(1+\tfrac{1}{n}\right)^n$, $n$ büyüdükçe $e$’ye yaklaşır. Hesaplayıcıda $n$’yi büyüt ve izle!
WE If interest of 100% is compounded more and more often, $\left(1+\tfrac{1}{n}\right)^n$ gets closer and closer to $e$.
E $n=1$: $2$. $n=10$: $2{,}594$. $n=1000$: $2{,}717$. Sınırda: $2{,}71828\dots$
H $\pi\approx 3{,}14$ ile karıştırma: $e$, “iki-yedi-bir-sekiz”.
T Euler’s number = Euler sayısı ;; irrational = irrasyonel
Q Bir bankaya 1 TL yatırıyorsun; yıllık faiz %100 ve faiz her an (sürekli) ekleniyor. 1 yıl sonra paran en fazla kaç TL’ye yaklaşır?
QE You invest 1 TL at 100% interest per year, compounded continuously. What value does your money approach after one year?
C n=10:1:10000:1 => (1+1/n)^n
CT \left(1+\dfrac{1}{@n@}\right)^{@n@}\approx @=@
G b1_x1_e
LAB explog

# x1-ln-def | 3 | $\ln$ ne demek? | What “ln” means
L \ln x
R \log_{e} x
X \log_{10} x ;; \dfrac{1}{\log x} ;; e^{x}
K $x>0$. $\ln$ = natural logarithm (doğal logaritma), tabanı $e\approx 2{,}718$ olan logaritmadır. Hesap makinesinde $\ln$ tuşu.
KE $x>0$. $\ln$ is the natural logarithm, the logarithm with base $e\approx 2.718$. It has its own key on the calculator.
U $e$ tabanlı logu kısaca yazar; üstel denklemleri çözerken ve kalkülüste her yerde karşına çıkar.
UE A short way to write the base-$e$ logarithm, which you meet everywhere in exponential equations and calculus.
W $\ln x$, “$e$’yi kaçıncı kuvvete yükseltirsem $x$ olur?” sorusunun cevabıdır. Tüm log kuralları $\ln$ için de aynen geçerlidir: $\ln xy=\ln x+\ln y$.
WE $\ln x$ is the power you raise $e$ to in order to get $x$. All the log laws work for $\ln$ too.
E $\ln e^2=2$, $\ln 1=0$, $\ln 10\approx 2{,}303$.
H ln = logarithmus naturalis (Latince): doğal log, taban $e$.
T natural logarithm = doğal logaritma ;; base e = e tabanı
Q Bir soruda $\ln 20$ yazıyor. Bu sayı, hangi tabanın hangi kuvvetine eşit olduğunu soruyor?
QE A question contains $\ln 20$. This number is the power of which base?
B \log_{[[e]]} x || 10 ;; x ;; 1
C x=10:0.1:100:0.1 => ln(x)
CT \ln @x@=\log_e @x@\approx @=@
G b1_x1_ln
LAB explog
V x

# x1-ln-e | 3 | $\ln e$ değeri | The value of $\ln e$
L \ln e
R 1
X 0 ;; e ;; 10
K $\ln=\log_e$ olduğu için $\ln e=\log_e e=1$. Benzer şekilde $\ln 1=0$.
KE Since $\ln=\log_e$, we get $\ln e=\log_e e=1$. Similarly, $\ln 1=0$.
U $\ln$ içeren ifadeleri sadeleştirirken sürekli kullanılır.
UE Used all the time when simplifying expressions with $\ln$.
W Tabanın kendi logu her zaman $1$’dir, çünkü $e^1=e$. $\ln$’in tabanı da $e$’dir.
WE The log of the base itself is always $1$ because $e^1=e$, and $e$ is the base of $\ln$.
E $3\ln e=3$. $\ln e^5=5\ln e=5$.
H $\ln e$ = bir. $\ln 1$ = sıfır.
T natural logarithm = doğal logaritma ;; simplify = sadeleştirmek
Q Bir sadeleştirmenin sonunda $7\ln e$ kaldı. Cevabı tek bir sayı olarak nasıl yazarsın?
QE At the end of a simplification you are left with $7\ln e$. How do you write the answer as a single number?
B [[1]] || 0 ;; e
G b1_x1_ln
LAB explog
V -

# x1-exp-ln | 3 | $e$ üzeri $\ln x$ | $e$ to the power $\ln x$
L e^{\ln x}
R x
X \ln x ;; e^{x} ;; 1
K $x>0$. $e^x$ ile $\ln x$ birbirinin ters fonksiyonudur; biri ötekinin yaptığını geri alır.
KE $x>0$. $e^x$ and $\ln x$ are inverse functions: each one undoes the other.
U Üsteki $\ln$’i yok eder; denklemlerde $\ln$’den kurtulmak için kullanılır.
UE Removes $\ln$ from an exponent; used to get rid of $\ln$ in equations.
W $\ln x$, $e$’yi $x$ yapan kuvvettir. $e$’yi tam o kuvvete yükseltince $x$ elde edersin.
WE $\ln x$ is the power that turns $e$ into $x$, so $e$ raised to that power is $x$.
E $e^{\ln 7}=7$. $\ln x=3$ ise her iki tarafı $e$’nin üssü yap: $x=e^{3}\approx 20{,}1$.
H $e$ ve $\ln$ yan yana gelince ikisi de kaybolur.
T inverse function = ters fonksiyon ;; exponential function = üstel fonksiyon
Q $\ln x=4$ denklemini çözmen isteniyor. $x$’i yalnız bırakmak için $\ln$’den nasıl kurtulursun?
QE You need to solve $\ln x=4$. How do you get rid of the $\ln$ to find $x$?
B [[x]] || \ln x ;; e^{x}
C x=7:0.5:50:0.5 => exp(ln(x))
CT e^{\ln @x@}=@=@
G b1_x1_lnexp
LAB explog
V x

# x1-ln-exp | 3 | $e$’nin kuvvetinin $\ln$’i | $\ln$ of a power of $e$
L \ln e^{x}
R x
X e^{x} ;; \ln x ;; 1
K Her $x$ için geçerlidir (negatif $x$ için de), çünkü $e^x$ her zaman pozitiftir.
KE True for every real $x$ (negative too), because $e^x$ is always positive.
U Üsteki bilinmeyeni aşağı indirir; $e^{x}=5$ gibi denklemlerin anahtarıdır.
UE Brings an unknown down from the exponent; the key to equations like $e^{x}=5$.
W $\ln$ “e’nin kaçıncı kuvveti?” diye sorar; $e^x$ zaten $e$’nin $x$. kuvveti, cevap $x$. Ya da kuvvet kuralıyla: $\ln e^x=x\ln e=x\cdot 1$.
WE $\ln$ asks “which power of $e$?”, and $e^x$ is the $x$th power. Or by the power law: $\ln e^x=x\ln e=x$.
E $\ln e^{-2}=-2$. $e^{x}=5$ ise iki tarafın $\ln$’ini al: $x=\ln 5\approx 1{,}61$.
H $\ln$, $e$’nin üssünü aşağı indirir.
T natural logarithm = doğal logaritma ;; exponent = üs
Q Bir nüfus $e^{t}=30$ denklemine göre büyüyor. $t$’yi üsten aşağı nasıl indirirsin?
QE A population grows so that $e^{t}=30$. How do you bring $t$ down from the exponent?
B [[x]] || e^{x} ;; \ln x
C x=2:-5:5:0.5 => ln(exp(x))
CT \ln e^{@x@}=@=@
G b1_x1_lnexp
LAB explog
V x:-3:3

# x1-solve-exp | 3 | Üstel denklem çözme: $a^x=b$ | Solving an exponential equation $a^x=b$
L a^{x}=b
O \Rightarrow
R x=\dfrac{\ln b}{\ln a}
X x=\dfrac{\ln a}{\ln b} ;; x=\ln b-\ln a ;; x=\dfrac{b}{a}
K $a>0$, $a\ne 1$, $b>0$. Aynı sonuç $x=\log_a b$’dir; $\ln$ yerine $\log$ (10 tabanı) da kullanabilirsin: $x=\tfrac{\log b}{\log a}$.
KE $a>0$, $a\ne 1$, $b>0$. This is the same as $x=\log_a b$; you can also use $\log$ (base 10): $x=\tfrac{\log b}{\log a}$.
U Bilinmeyen üsteyken denklemi çözer: “kaç yılda iki katına çıkar?” gibi soruların cevabı.
UE Solves an equation where the unknown is in the exponent, such as “how many years until it doubles?”.
W İki tarafın $\ln$’ini al: $\ln a^x=\ln b$. Kuvvet kuralıyla $x$ öne iner: $x\ln a=\ln b$. Sonra $\ln a$’ya böl.
WE Take $\ln$ of both sides, bring $x$ down with the power law ($x\ln a=\ln b$), then divide by $\ln a$.
E $2^x=10$: $x=\tfrac{\ln 10}{\ln 2}\approx 3{,}32$. $3^x=81$: $x=\tfrac{\ln 81}{\ln 3}=4$.
H Ln al, üssü indir, böl. Üstte $b$ (sonuç), altta $a$ (taban).
T exponential equation = üstel denklem ;; take logarithms of both sides = iki tarafın logaritmasını almak
Q Bir köydeki nüfus her yıl 1,05 katına çıkıyor. Nüfusun iki katına çıkması kaç yıl sürer? ($1{,}05^x=2$)
QE A village population is multiplied by 1.05 every year. How many years does it take to double? ($1.05^x=2$)
B x=\dfrac{\ln [[b]]}{\ln [[a]]} || x ;; e ;; ab
C a=2:1.05:10:0.05 ; b=10:0.5:1000:0.5 => ln(b)/ln(a)
CT @a@^{x}=@b@\Rightarrow x=\dfrac{\ln @b@}{\ln @a@}\approx @=@
G b1_x1_solve
LAB explog

# x1-factorial | 3 | Faktöriyel: $n!$ | Factorial: $n!$
L n!
R 1\times 2\times 3\times\dots\times n
X 1+2+3+\dots+n ;; n\times(n-1) ;; n^{n}
K $n\in\mathbb{N}$. Özel değer: $0!=1$ (ve $1!=1$). Faydalı kural: $n!=n\times(n-1)!$
KE $n\in\mathbb{N}$. Special value: $0!=1$ (and $1!=1$). Useful rule: $n!=n\times(n-1)!$
U $n$ farklı şeyin kaç farklı sırada dizilebileceğini sayar; $ {}^{n}C_{r}$ formülünün yapı taşıdır.
UE Counts the ways to arrange $n$ different things in a row; it is the building block of $ {}^{n}C_{r}$.
W $3$ kitabı rafa dizerken ilk yere $3$, ikinci yere $2$, son yere $1$ seçenek kalır: $3\times 2\times 1=6$ sıralama.
WE To line up 3 books there are 3 choices for the first place, 2 for the second and 1 for the last: $3\times 2\times 1=6$ orders.
E $4!=24$, $5!=120$. $\tfrac{6!}{4!}=6\times 5=30$ (gerisi sadeleşir).
H Ünlem işareti = “aşağı doğru hepsini çarp!”
T factorial = faktöriyel ;; arrangement = sıralama (diziliş)
Q 5 arkadaş bir fotoğraf için yan yana dizilecek. Kaç farklı sırada dizilebilirler?
QE Five friends stand in a row for a photo. In how many different orders can they stand?
B 1\times 2\times 3\times\dots\times [[n]] || n-1 ;; n! ;; 10
C n=5:0:12:1 => fact(n)
CT @n@!=@=@
G b1_x1_fact

# x1-ncr-ends | 3 | $ {}^{n}C_{0}$ ve $ {}^{n}C_{n}$ | $ {}^{n}C_{0}$ and $ {}^{n}C_{n}$
L {}^{n}C_{0}={}^{n}C_{n}
R 1
X 0 ;; n ;; n!
K $n\in\mathbb{N}$. Bir de şunu bil: $ {}^{n}C_{1}=n$.
KE $n\in\mathbb{N}$. Also worth knowing: $ {}^{n}C_{1}=n$.
U Binom açılımındaki ilk ve son katsayıları hesapsız verir.
UE Gives the first and last coefficients of a binomial expansion with no working.
W $n$ şeyin içinden hiçbirini seçmemenin tek yolu vardır: hiçbirini almamak. Hepsini seçmenin de tek yolu vardır: hepsini almak. Formülde: $\tfrac{n!}{0!\,n!}=1$.
WE There is exactly one way to choose nothing and exactly one way to choose everything; in the formula, $\tfrac{n!}{0!\,n!}=1$.
E $ {}^{7}C_{0}=1$, $ {}^{7}C_{7}=1$, $ {}^{7}C_{1}=7$. $(a+b)^7$ açılımı $a^7$ ile başlar, $b^7$ ile biter (katsayı $1$).
H Hiçbiri ya da hepsi: tek yol, yani $1$.
T binomial coefficient = binom katsayısı ;; choose = seçmek
Q Bir menüdeki 9 tatlının hepsinden birer tane almak istiyorsun. Bu seçimi kaç farklı şekilde yapabilirsin?
QE You want to take one of every dessert on a menu of 9 desserts. In how many ways can you make this choice?
B [[1]] || 0 ;; n
G b1_x1_ncr

# x1-ncr-sym | 2 | $ {}^{n}C_{r}$ simetrisi | Symmetry of $ {}^{n}C_{r}$
L {}^{n}C_{r}
R {}^{n}C_{n-r}
X {}^{n}C_{r-n} ;; {}^{r}C_{n} ;; {}^{n-r}C_{r}
K $n\in\mathbb{N}$, $0\le r\le n$. Bu yüzden binom katsayıları baştan ve sondan aynı okunur: $1, 4, 6, 4, 1$.
KE $n\in\mathbb{N}$, $0\le r\le n$. This is why binomial coefficients read the same forwards and backwards: $1, 4, 6, 4, 1$.
U Büyük $r$’li hesabı küçük $r$’li kolay hesaba çevirir.
UE Turns a calculation with a large $r$ into an easy one with a small $r$.
W $10$ kişiden $8$’ini seçmek, dışarıda kalacak $2$ kişiyi seçmekle aynı şeydir. Seçilenleri ya da seçilmeyenleri saymak aynı sayıyı verir.
WE Choosing 8 people out of 10 is the same as choosing the 2 who are left out.
E $ {}^{10}C_{8}={}^{10}C_{2}=\tfrac{10\cdot 9}{2}=45$. $ {}^{20}C_{19}={}^{20}C_{1}=20$.
H Seçtiklerin ya da bıraktıkların: sayı aynı.
T symmetry = simetri ;; binomial coefficient = binom katsayısı
Q 12 kişilik bir sınıftan 10 kişi geziye gidecek. Kaç farklı grup olabileceğini hesaplamanın kısa yolu nedir?
QE 10 students from a class of 12 go on a trip. What is the quick way to count how many different groups are possible?
B {}^{n}C_{[[n-r]]} || r-n ;; r ;; n+r
C n=10:1:20:1 ; r=8:0:10:1 => r<=n ? nCr(n,n-r) : 0/0
CT {}^{@n@}C_{@r@}={}^{@n@}C_{@n@-@r@}=@=@
G b1_x1_ncr

# x1-pascal | 2 | Pascal üçgeni kuralı | Pascal’s triangle rule
L {}^{n}C_{r-1}+{}^{n}C_{r}
R {}^{n+1}C_{r}
X {}^{2n}C_{2r-1} ;; {}^{n}C_{2r-1} ;; {}^{n+1}C_{r-1}
K $n\in\mathbb{N}$, $1\le r\le n$. Pascal üçgeninde her sayı, hemen üstündeki iki sayının toplamıdır; kenarlar hep $1$’dir.
KE $n\in\mathbb{N}$, $1\le r\le n$. In Pascal’s triangle each number is the sum of the two numbers directly above it, and the edges are always $1$.
U Binom katsayılarını hesap makinesi olmadan, toplama yaparak bulur.
UE Builds binomial coefficients by simple addition, without a calculator.
W Pascal üçgeninin $n$. satırı $(a+b)^n$’nin katsayılarıdır: $1$; $1\;1$; $1\;2\;1$; $1\;3\;3\;1$; $1\;4\;6\;4\;1$. Bir alt satırdaki her sayı, üstündeki komşu iki sayının toplamıdır: $3+3=6$.
WE Row $n$ of Pascal’s triangle gives the coefficients of $(a+b)^n$, and each entry is the sum of the two neighbours above it: $3+3=6$.
E $ {}^{4}C_{1}+{}^{4}C_{2}=4+6=10={}^{5}C_{2}$. $5$. satır: $1, 5, 10, 10, 5, 1$.
H Üstteki iki komşuyu topla, aşağı yaz.
T Pascal’s triangle = Pascal üçgeni ;; row = satır ;; binomial coefficient = binom katsayısı
Q Hesap makinen yok ve $(a+b)^6$ açılımının katsayılarına ihtiyacın var. $(a+b)^5$’in katsayıları $1, 5, 10, 10, 5, 1$. Bir sonraki satırı nasıl kurarsın?
QE You have no calculator and need the coefficients of $(a+b)^6$. The coefficients of $(a+b)^5$ are $1, 5, 10, 10, 5, 1$. How do you build the next row?
B {}^{[[n+1]]}C_{[[r]]} || n ;; r+1 ;; 2n
C n=4:2:15:1 ; r=2:1:6:1 => r<=n ? nCr(n,r-1)+nCr(n,r) : 0/0
CT {}^{@n@}C_{@r@-1}+{}^{@n@}C_{@r@}={}^{@n@+1}C_{@r@}=@=@
G b1_x1_pascal

# x1-binom-term | 3 | Binom açılımının genel terimi | The general term of a binomial expansion
L T_{r+1}
R {}^{n}C_{r}\,a^{n-r}\,b^{r}
X {}^{n}C_{r+1}\,a^{n-r}\,b^{r} ;; {}^{n}C_{r}\,a^{r}\,b^{n-r} ;; {}^{n}C_{r}\,a^{n}\,b^{r}
K $(a+b)^n$ açılımında, $a^n$’den başlayarak $(r+1)$. terim ($r=0,1,\dots,n$). $b$ işaretiyle birlikte alınır: $(x-2)^5$ için $b=-2$.
KE The $(r+1)$th term of $(a+b)^n$, counting from $a^n$ ($r=0,1,\dots,n$). Take $b$ together with its sign: for $(x-2)^5$, $b=-2$.
U Tüm açılımı yazmadan istenen terimi ya da katsayıyı (ör. $x^3$’ün katsayısını) bulur.
UE Finds one particular term or coefficient (for example, the coefficient of $x^3$) without writing out the whole expansion.
W İlk terimde $r=0$’dır (hiç $b$ yok), bu yüzden $(r+1)$. terimde $b$’nin üssü $r$’dir. $a$’nın üssü kalan kısım: $n-r$.
WE The first term has $r=0$ (no $b$ at all), so the $(r+1)$th term has $b^r$, and $a$ gets the rest of the power: $n-r$.
E $(x+2)^5$’te $x^3$’ün katsayısı: $n-r=3\Rightarrow r=2$, terim $ {}^{5}C_{2}\,x^{3}\,2^{2}=40x^3$, katsayı $40$.
H Terim numarası $r+1$; $b$’nin üssü $r$. Üsler toplamı $n$.
T general term = genel terim ;; coefficient = katsayı ;; binomial expansion = binom açılımı
Q $(x+3)^8$ açılımının tamamını yazmadan, yalnızca $x^5$’li terimin katsayısını bulman isteniyor. Ne kullanırsın?
QE You must find only the coefficient of $x^5$ in the expansion of $(x+3)^8$, without writing out the whole expansion. What do you use?
B {}^{n}C_{[[r]]}\,a^{[[n-r]]}\,b^{r} || r+1 ;; n ;; r-1
C n=5:1:10:1 ; r=2:0:6:1 ; a=1:-5:5:1 ; b=2:-5:5:1 => r<=n ? nCr(n,r)*a^(n-r)*b^r : 0/0
CT T_{@r@+1}={}^{@n@}C_{@r@}\cdot @a@^{@n@-@r@}\cdot @b@^{@r@}=@=@
G b1_x1_binom_term
`;

/* ---------- yardımcılar ---------- */
/* İngilizce metin için ondalık nokta: 1.05 */
const dn = (v) => String(Math.round(v * 1e6) / 1e6);
/* nCr gösterimi (IB): {}^{n}C_{r} — şablon içinde "${" sorununu önler */
const C = (n, r) => "{}^{" + n + "}C_{" + r + "}";
/* sıfır olmayan tam sayı */
const nz = (r, a, b) => { let v; do { v = ri(r, a, b); } while (v === 0); return v; };
/* sıfırdan farklı katsayılı terim: 3k+2, k-1 … */
const lin = (a, b, v) => `${a === 1 ? "" : a === -1 ? "-" : a}${v}${b === 0 ? "" : b > 0 ? `+${b}` : `${b}`}`;
/* işaretli sayı (x+2, x-3) */
const sg = (v) => (v < 0 ? `-${Math.abs(v)}` : `+${v}`);
/* bir sayının 1 ve kendisi dışındaki bölenleri */
const divisors = (N) => { const out = []; for (let d = 2; d < N; d++) if (N % d === 0) out.push(d); return out; };
/* dönem adları (bileşik faiz) */
const PERIOD = { 1: ["yılda bir kez", "annually"], 2: ["altı ayda bir", "half-yearly"], 4: ["üç ayda bir", "quarterly"], 12: ["her ay", "monthly"] };

export const GEN = {
  /* ---------- b1: diziler ---------- */
  b1_arith_nth: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const u1 = ri(r, -10, 20), d = nz(r, -5, 6), n = ri(r, 5, 30);
      return { q: `$u_1=${u1}$ ve $d=${d}$ olan aritmetik dizide $u_{${n}}$ kaçtır?`, qe: `An arithmetic sequence has $u_1=${u1}$ and $d=${d}$. Find $u_{${n}}$.`, ...int(u1 + (n - 1) * d) };
    }
    if (t === 1) {
      const u1 = ri(r, -5, 15), d = nz(r, -4, 7), n = ri(r, 6, 25);
      const seq = `${u1},\\ ${u1 + d},\\ ${u1 + 2 * d},\\ \\dots`;
      return { q: `$${seq}$ aritmetik dizisinde $u_{${n}}$ kaçtır?`, qe: `Find $u_{${n}}$ for the arithmetic sequence $${seq}$`, ...int(u1 + (n - 1) * d) };
    }
    const s = ri(r, 10, 25), e = ri(r, 2, 4), n = ri(r, 8, 25);
    return {
      q: `Bir salonda ilk sırada $${s}$ koltuk var ve her sıra bir öncekinden $${e}$ koltuk fazla. $${n}$. sırada kaç koltuk var?`,
      qe: `A hall has $${s}$ seats in the first row and each row has $${e}$ more seats than the row before. How many seats are in row $${n}$?`,
      ...int(s + (n - 1) * e),
    };
  },
  b1_arith_sum: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const u1 = ri(r, 1, 10), d = ri(r, 1, 5), n = ri(r, 5, 20);
      return { q: `$u_1=${u1}$ ve $d=${d}$ olan aritmetik dizinin ilk $${n}$ teriminin toplamı ($S_{${n}}$) kaçtır?`, qe: `An arithmetic sequence has $u_1=${u1}$ and $d=${d}$. Find the sum of its first $${n}$ terms, $S_{${n}}$.`, ...int((n * (2 * u1 + (n - 1) * d)) / 2) };
    }
    if (t === 1) {
      const n = pick(r, [10, 20, 30, 40, 50, 100]);
      return { q: `$1+2+3+\\dots+${n}$ toplamı kaçtır?`, qe: `Find the value of $1+2+3+\\dots+${n}$.`, ...int((n * (n + 1)) / 2) };
    }
    const n = ri(r, 5, 15);
    return { q: `$1+3+5+\\dots$ dizisinin ilk $${n}$ teriminin toplamı kaçtır?`, qe: `Find the sum of the first $${n}$ terms of $1+3+5+\\dots$`, ...int(n * n) };
  },
  b1_arith_ends: (r) => {
    const n = ri(r, 5, 20), u1 = ri(r, 1, 20), d = ri(r, 1, 5), un = u1 + (n - 1) * d;
    if (r() < 0.5) {
      return { q: `Bir aritmetik dizide $u_1=${u1}$ ve $u_{${n}}=${un}$. İlk $${n}$ terimin toplamı kaçtır?`, qe: `An arithmetic sequence has $u_1=${u1}$ and $u_{${n}}=${un}$. Find the sum of the first $${n}$ terms.`, ...int((n * (u1 + un)) / 2) };
    }
    return {
      q: `Bir tiyatroda $${n}$ sıra var; ilk sırada $${u1}$, son sırada $${un}$ koltuk var ve her sıra eşit miktarda artıyor. Toplam kaç koltuk var?`,
      qe: `A theatre has $${n}$ rows, with $${u1}$ seats in the first row and $${un}$ in the last, increasing by the same amount each row. How many seats are there in total?`,
      ...int((n * (u1 + un)) / 2),
    };
  },
  b1_geo_nth: (r) => {
    const u1 = ri(r, 1, 5), rr = pick(r, [2, 3, -2, 10]);
    const n = rr === 3 ? ri(r, 3, 6) : rr === 10 ? ri(r, 2, 5) : ri(r, 3, 8);
    if (r() < 0.5) {
      return { q: `$u_1=${u1}$ ve $r=${rr}$ olan geometrik dizide $u_{${n}}$ kaçtır?`, qe: `A geometric sequence has $u_1=${u1}$ and $r=${rr}$. Find $u_{${n}}$.`, ...int(u1 * rr ** (n - 1)) };
    }
    const seq = `${u1},\\ ${u1 * rr},\\ ${u1 * rr * rr},\\ \\dots`;
    return { q: `$${seq}$ geometrik dizisinde $u_{${n}}$ kaçtır?`, qe: `Find $u_{${n}}$ for the geometric sequence $${seq}$`, ...int(u1 * rr ** (n - 1)) };
  },
  b1_geo_sum: (r) => {
    if (r() < 0.65) {
      const u1 = ri(r, 1, 5), rr = pick(r, [2, 3]), n = rr === 2 ? ri(r, 3, 8) : ri(r, 3, 5);
      return { q: `$u_1=${u1}$ ve $r=${rr}$ olan geometrik dizinin ilk $${n}$ teriminin toplamı kaçtır?`, qe: `A geometric sequence has $u_1=${u1}$ and $r=${rr}$. Find the sum of its first $${n}$ terms.`, ...int((u1 * (rr ** n - 1)) / (rr - 1)) };
    }
    const n = ri(r, 3, 5), u1 = 2 ** n;
    return { q: `$u_1=${u1}$ ve $r=\\tfrac12$ olan geometrik dizinin ilk $${n}$ teriminin toplamı kaçtır?`, qe: `A geometric sequence has $u_1=${u1}$ and $r=\\tfrac12$. Find the sum of its first $${n}$ terms.`, ...int(2 * (u1 - 1)) };
  },
  b1_geo_inf: (r) => {
    const [p, q] = pick(r, [[1, 2], [1, 3], [1, 4], [2, 3], [-1, 2], [3, 4], [1, 5], [-1, 3]]);
    const u1 = pick(r, [2, 3, 4, 5, 6, 8, 9, 10, 12]);
    const rt = p < 0 ? `-\\tfrac{${-p}}{${q}}` : `\\tfrac{${p}}{${q}}`;
    if (r() < 0.75) {
      return { q: `$u_1=${u1}$ ve $r=${rt}$ olan sonsuz geometrik dizinin toplamı ($S_\\infty$) kaçtır?`, qe: `An infinite geometric sequence has $u_1=${u1}$ and $r=${rt}$. Find its sum to infinity, $S_\\infty$.`, ...fr(u1 * q, q - p) };
    }
    const k = pick(r, [2, 3, 4]);
    return { q: `$1+\\tfrac{1}{${k}}+\\tfrac{1}{${k * k}}+\\dots$ sonsuz toplamı kaçtır?`, qe: `Find the value of the infinite sum $1+\\tfrac{1}{${k}}+\\tfrac{1}{${k * k}}+\\dots$`, ...fr(k, k - 1) };
  },
  b1_compound: (r) => {
    const t = ri(r, 0, 3);
    if (t === 0) {
      const PV = pick(r, [100, 200, 500, 1000, 2000, 5000]), rt = pick(r, [10, 20]), n = pick(r, [1, 2]);
      return {
        q: `$${PV}$ TL, yıllık $\\%${rt}$ faizle bankaya yatırılıyor; faiz yılda bir kez ekleniyor. $${n}$ yıl sonra kaç TL olur?`,
        qe: `$${PV}$ TL is invested at $${rt}\\%$ per year, compounded annually. How much is it worth after $${n}$ year${n > 1 ? "s" : ""}?`,
        ...int(Math.round(PV * (1 + rt / 100) ** n * 1e6) / 1e6),
      };
    }
    if (t === 1) {
      const k = pick(r, [1, 2, 4, 12]), n = ri(r, 2, 10);
      return {
        q: `Faiz ${PERIOD[k][0]} ekleniyor ve para $${n}$ yıl bankada kalıyor. Bileşik faiz formülündeki üs ($kn$) kaçtır?`,
        qe: `Interest is compounded ${PERIOD[k][1]} and the money stays in the bank for $${n}$ years. What is the power ($kn$) in the compound interest formula?`,
        ...int(k * n),
      };
    }
    if (t === 2) {
      const [rt, k] = pick(r, [[6, 12], [8, 4], [12, 12], [10, 2], [4, 4], [6, 2], [12, 4], [24, 12]]);
      const m = Math.round((1 + rt / (100 * k)) * 1e6) / 1e6;
      return {
        q: `Yıllık nominal faiz $\\%${rt}$ ve faiz ${PERIOD[k][0]} ekleniyor. Her dönemde para hangi sayıyla çarpılır? (ondalık yaz)`,
        qe: `The nominal annual interest rate is $${rt}\\%$, compounded ${PERIOD[k][1]}. What is the money multiplied by in each period? (give a decimal)`,
        ...int(m),
      };
    }
    const PV = pick(r, [1000, 2000, 4000]);
    return {
      q: `$${PV}$ TL, yıllık $\\%10$ nominal faizle yatırılıyor; faiz altı ayda bir ekleniyor. $1$ yıl sonra kaç TL olur?`,
      qe: `$${PV}$ TL is invested at a nominal annual rate of $10\\%$, compounded half-yearly. How much is it worth after $1$ year?`,
      ...int(Math.round(PV * 1.05 * 1.05 * 1e6) / 1e6),
    };
  },
  /* ---------- b1: üsler ve logaritmalar ---------- */
  b1_log_def: (r) => {
    const [b, k] = pick(r, [[2, 3], [2, 4], [2, 5], [2, 6], [2, 10], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [10, 2], [10, 3], [10, 4]]);
    const v = b ** k, t = ri(r, 0, 3);
    if (t === 0) return { q: `$\\log_{${b}}${v}$ kaçtır?`, qe: `Find $\\log_{${b}}${v}$.`, ...int(k) };
    if (t === 1) return { q: `$${b}^{x}=${v}$ ise $x$ kaçtır?`, qe: `If $${b}^{x}=${v}$, find $x$.`, ...int(k) };
    if (t === 2) return { q: `$\\log_{${b}}x=${k}$ ise $x$ kaçtır?`, qe: `If $\\log_{${b}}x=${k}$, find $x$.`, ...int(v) };
    return { q: `$\\log_{${b}}\\tfrac{1}{${v}}$ kaçtır?`, qe: `Find $\\log_{${b}}\\tfrac{1}{${v}}$.`, ...int(-k) };
  },
  b1_log_inv1: (r) => {
    const b = pick(r, [2, 3, 5, 7, 10]);
    if (r() < 0.6) {
      const k = r() < 0.75 ? ri(r, 2, 12) : ri(r, -5, -1);
      return { q: `$\\log_{${b}}${b}^{${k}}$ kaçtır?`, qe: `Find $\\log_{${b}}${b}^{${k}}$.`, ...int(k) };
    }
    const m = ri(r, 1, 9), n = ri(r, 1, 9);
    return { q: `$\\log_{${b}}\\left(${b}^{${m}}\\cdot ${b}^{${n}}\\right)$ kaçtır?`, qe: `Find $\\log_{${b}}\\left(${b}^{${m}}\\cdot ${b}^{${n}}\\right)$.`, ...int(m + n) };
  },
  b1_log_inv2: (r) => {
    const b = pick(r, [2, 3, 5, 7, 10]), x = ri(r, 2, 50), y = ri(r, 2, 20);
    if (r() < 0.6) return { q: `$${b}^{\\log_{${b}}${x}}$ kaçtır?`, qe: `Find $${b}^{\\log_{${b}}${x}}$.`, ...int(x) };
    return { q: `$${b}^{\\log_{${b}}${x}}+${b}^{\\log_{${b}}${y}}$ kaçtır?`, qe: `Find $${b}^{\\log_{${b}}${x}}+${b}^{\\log_{${b}}${y}}$.`, ...int(x + y) };
  },
  b1_log_prod: (r) => {
    const [b, k] = pick(r, [[2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [5, 2], [5, 3], [6, 2], [10, 2], [10, 3]]);
    const N = b ** k, x = pick(r, divisors(N)), y = N / x;
    return { q: `$\\log_{${b}}${x}+\\log_{${b}}${y}$ kaçtır?`, qe: `Find $\\log_{${b}}${x}+\\log_{${b}}${y}$.`, ...int(k) };
  },
  b1_log_quot: (r) => {
    const [b, k] = pick(r, [[2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [3, 1], [3, 2], [3, 3], [5, 1], [5, 2], [10, 1], [10, 2]]);
    const y = ri(r, 2, 9), x = y * b ** k;
    return { q: `$\\log_{${b}}${x}-\\log_{${b}}${y}$ kaçtır?`, qe: `Find $\\log_{${b}}${x}-\\log_{${b}}${y}$.`, ...int(k) };
  },
  b1_log_pow: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const [b, p] = pick(r, [[2, 2], [2, 3], [3, 2], [10, 2], [10, 3], [5, 2]]), m = ri(r, 2, 6);
      return { q: `$\\log_{${b}}${b ** p}^{${m}}$ kaçtır?`, qe: `Find $\\log_{${b}}${b ** p}^{${m}}$.`, ...int(p * m) };
    }
    if (t === 1) {
      const k = nz(r, -4, 6), m = ri(r, 2, 6);
      return { q: `$\\log_a x=${k}$ ise $\\log_a x^{${m}}$ kaçtır?`, qe: `If $\\log_a x=${k}$, find $\\log_a x^{${m}}$.`, ...int(k * m) };
    }
    const b = pick(r, [2, 3, 5, 10]), c = ri(r, 2, 5), m = ri(r, 2, 3);
    return { q: `$${m}\\log_{${b}}${c}=\\log_{${b}}N$ ise $N$ kaçtır?`, qe: `If $${m}\\log_{${b}}${c}=\\log_{${b}}N$, find $N$.`, ...int(c ** m) };
  },
  b1_log_change: (r) => {
    const b = pick(r, [2, 3]), p = pick(r, [2, 3]);
    let qq;
    do { qq = ri(r, 1, b === 2 ? 6 : 5); } while (qq === p);
    if (r() < 0.7) {
      const A = b ** p, X = b ** qq;
      return {
        q: `$\\log_{${A}}${X}$ kaçtır? (İpucu: iki sayı da $${b}$ tabanının bir kuvveti)`,
        qe: `Find $\\log_{${A}}${X}$. (Hint: both numbers are powers of $${b}$.)`,
        ...fr(qq, p),
      };
    }
    const k = ri(r, 2, 5);
    return { q: `$\\dfrac{\\log ${b ** k}}{\\log ${b}}$ kaçtır?`, qe: `Find $\\dfrac{\\log ${b ** k}}{\\log ${b}}$.`, ...int(k) };
  },
  b1_exp_e: (r) => {
    const a = ri(r, 2, 5), x = ri(r, 2, a === 2 ? 5 : 3);
    if (r() < 0.6) return { q: `$e^{${x}\\ln ${a}}$ kaçtır?`, qe: `Find $e^{${x}\\ln ${a}}$.`, ...int(a ** x) };
    return { q: `$${a}^{x}=e^{kx}$ olacak şekilde $k=\\ln m$ ise $m$ kaçtır?`, qe: `If $${a}^{x}=e^{kx}$ for all $x$ and $k=\\ln m$, find $m$.`, ...int(a) };
  },
  /* ---------- b1: binom ---------- */
  b1_ncr: (r) => {
    if (r() < 0.6) {
      const n = ri(r, 2, 10), k = ri(r, 0, n);
      return { q: `$${C(n, k)}$ kaçtır?`, qe: `Find $${C(n, k)}$.`, ...int(nCr(n, k)) };
    }
    const n = ri(r, 5, 10), k = ri(r, 2, 3);
    return {
      q: `$${n}$ kişilik bir gruptan $${k}$ kişilik bir ekip seçilecek (sıra önemli değil). Kaç farklı ekip kurulabilir?`,
      qe: `A team of $${k}$ is chosen from a group of $${n}$ people (order does not matter). How many different teams are possible?`,
      ...int(nCr(n, k)),
    };
  },
  b1_binom: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const n = ri(r, 2, 4), c = pick(r, [1, 2, 3, -1, -2]), j = ri(r, 0, n - 1);
      const what = j === 0 ? ["sabit terim", "the constant term"] : j === 1 ? ["$x$ teriminin katsayısı", "the coefficient of $x$"] : [`$x^{${j}}$ teriminin katsayısı`, `the coefficient of $x^{${j}}$`];
      return { q: `$(x${sg(c)})^{${n}}$ açılımında ${what[0]} kaçtır?`, qe: `In the expansion of $(x${sg(c)})^{${n}}$, find ${what[1]}.`, ...int(nCr(n, n - j) * c ** (n - j)) };
    }
    if (t === 1) {
      const n = ri(r, 3, 12);
      return { q: `$(a+b)^{${n}}$ açılımında kaç terim vardır?`, qe: `How many terms are there in the expansion of $(a+b)^{${n}}$?`, ...int(n + 1) };
    }
    const n = ri(r, 3, 7), k = ri(r, 1, n - 1);
    const term = `a^{${n - k}}b${k === 1 ? "" : `^{${k}}`}`.replace("a^{1}", "a");
    return { q: `$(a+b)^{${n}}$ açılımında $${term}$ teriminin katsayısı kaçtır?`, qe: `In the expansion of $(a+b)^{${n}}$, find the coefficient of $${term}$.`, ...int(nCr(n, k)) };
  },

  /* ---------- x1: diziler ---------- */
  b1_x1_diff: (r) => {
    const u1 = ri(r, -10, 30), d = nz(r, -6, 8);
    if (r() < 0.6) {
      const seq = `${u1},\\ ${u1 + d},\\ ${u1 + 2 * d},\\ \\dots`;
      return { q: `$${seq}$ aritmetik dizisinin ortak farkı ($d$) kaçtır?`, qe: `Find the common difference $d$ of the arithmetic sequence $${seq}$`, ...int(d) };
    }
    const n = ri(r, 3, 15);
    return { q: `Bir aritmetik dizide $u_{${n}}=${u1}$ ve $u_{${n + 1}}=${u1 + d}$. Ortak fark ($d$) kaçtır?`, qe: `In an arithmetic sequence $u_{${n}}=${u1}$ and $u_{${n + 1}}=${u1 + d}$. Find the common difference $d$.`, ...int(d) };
  },
  b1_x1_ratio: (r) => {
    const [p, q] = pick(r, [[2, 1], [3, 1], [-2, 1], [-3, 1], [5, 1], [1, 2], [1, 3], [-1, 2]]);
    const u1 = q === 1 ? pick(r, [1, 2, 3, 5]) : q === 2 ? pick(r, [16, 32, 64, 8]) : pick(r, [27, 81, 54]);
    const t2 = (u1 * p) / q, t3 = (u1 * p * p) / (q * q);
    const seq = `${u1},\\ ${t2},\\ ${t3},\\ \\dots`;
    return { q: `$${seq}$ geometrik dizisinin ortak çarpanı ($r$) kaçtır?`, qe: `Find the common ratio $r$ of the geometric sequence $${seq}$`, ...fr(p, q) };
  },
  b1_x1_nterms: (r) => {
    const u1 = ri(r, 1, 20), d = ri(r, 2, 7), n = ri(r, 8, 40), un = u1 + (n - 1) * d;
    const seq = `${u1},\\ ${u1 + d},\\ ${u1 + 2 * d},\\ \\dots,\\ ${un}`;
    return { q: `$${seq}$ aritmetik dizisinde kaç terim var?`, qe: `How many terms are there in the arithmetic sequence $${seq}$?`, ...int(n) };
  },
  b1_x1_sigma: (r) => {
    if (r() < 0.7) {
      const n = ri(r, 3, 6), a = ri(r, 1, 4), b = nz(r, -3, 5);
      return { q: `$\\displaystyle\\sum_{k=1}^{${n}}(${lin(a, b, "k")})$ kaçtır?`, qe: `Find $\\displaystyle\\sum_{k=1}^{${n}}(${lin(a, b, "k")})$.`, ...int((a * n * (n + 1)) / 2 + b * n) };
    }
    const n = ri(r, 2, 5);
    return { q: `$\\displaystyle\\sum_{k=1}^{${n}}k^{2}$ kaçtır?`, qe: `Find $\\displaystyle\\sum_{k=1}^{${n}}k^{2}$.`, ...int((n * (n + 1) * (2 * n + 1)) / 6) };
  },
  b1_x1_dep: (r) => {
    const PV = pick(r, [1000, 2000, 5000, 10000, 20000]), rt = pick(r, [10, 20, 50]);
    if (r() < 0.7) {
      const n = pick(r, [1, 2]);
      return {
        q: `$${PV}$ TL’lik bir makine her yıl değerinin $\\%${rt}$’${rt === 10 ? "unu" : rt === 20 ? "sini" : "sini"} kaybediyor. $${n}$ yıl sonra kaç TL eder?`,
        qe: `A machine worth $${PV}$ TL loses $${rt}\\%$ of its value every year. What is it worth after $${n}$ year${n > 1 ? "s" : ""}?`,
        ...int(Math.round(PV * (1 - rt / 100) ** n * 1e6) / 1e6),
      };
    }
    const p = pick(r, [5, 8, 12, 15, 25, 30]);
    return {
      q: `Bir araba her yıl değerinin $\\%${p}$ kadarını kaybediyor. Değeri her yıl hangi sayıyla çarpılır? (ondalık yaz)`,
      qe: `A car loses $${p}\\%$ of its value every year. What is its value multiplied by each year? (give a decimal)`,
      ...int(Math.round((1 - p / 100) * 1e6) / 1e6),
    };
  },
  /* ---------- x1: logaritmalar ---------- */
  b1_x1_logbasic: (r) => {
    const a = pick(r, [2, 3, 5, 7, 9, 10, 12]), b = pick(r, [2, 4, 6, 8]), k = ri(r, 2, 9), t = ri(r, 0, 3);
    if (t === 0) return { q: `$\\log_{${a}}1$ kaçtır?`, qe: `Find $\\log_{${a}}1$.`, ...int(0) };
    if (t === 1) return { q: `$\\log_{${a}}${a}$ kaçtır?`, qe: `Find $\\log_{${a}}${a}$.`, ...int(1) };
    if (t === 2) return { q: `$${k}\\log_{${a}}${a}$ kaçtır?`, qe: `Find $${k}\\log_{${a}}${a}$.`, ...int(k) };
    return { q: `$\\log_{${a}}1+\\log_{${b}}${b}$ kaçtır?`, qe: `Find $\\log_{${a}}1+\\log_{${b}}${b}$.`, ...int(1) };
  },
  b1_x1_log10: (r) => {
    const k = ri(r, -3, 5);
    if (r() < 0.65) {
      const tr = k >= 0 ? "1" + "0".repeat(k) : "0{,}" + "0".repeat(-k - 1) + "1";
      const en = k >= 0 ? "1" + "0".repeat(k) : "0." + "0".repeat(-k - 1) + "1";
      return { q: `$\\log ${tr}$ kaçtır?`, qe: `Find $\\log ${en}$.`, ...int(k) };
    }
    const m = ri(r, 1, 4);
    return { q: `$\\log x=${m}$ ise $x$ kaçtır?`, qe: `If $\\log x=${m}$, find $x$.`, ...int(10 ** m) };
  },
  b1_x1_e: (r) => {
    const d = pick(r, [1, 2, 3]);
    const v = [2.7, 2.72, 2.718][d - 1];
    return {
      q: `$e$ sayısını $${d}$ ondalık basamağa yuvarlayarak yaz.`,
      qe: `Write $e$ correct to $${d}$ decimal place${d > 1 ? "s" : ""}.`,
      a: v, tex: v.toFixed(d).replace(".", "{,}"),
    };
  },
  b1_x1_ln: (r) => {
    const k = ri(r, 2, 9), t = ri(r, 0, 3);
    if (t === 0) return { q: `$\\ln e$ kaçtır?`, qe: `Find $\\ln e$.`, ...int(1) };
    if (t === 1) return { q: `$${k}\\ln e$ kaçtır?`, qe: `Find $${k}\\ln e$.`, ...int(k) };
    if (t === 2) return { q: `$\\ln 1+\\ln e$ kaçtır?`, qe: `Find $\\ln 1+\\ln e$.`, ...int(1) };
    return { q: `$\\log_e e^{${k}}$ kaçtır?`, qe: `Find $\\log_e e^{${k}}$.`, ...int(k) };
  },
  b1_x1_lnexp: (r) => {
    const x = ri(r, 2, 40), k = nz(r, -6, 9), t = ri(r, 0, 2);
    if (t === 0) return { q: `$e^{\\ln ${x}}$ kaçtır?`, qe: `Find $e^{\\ln ${x}}$.`, ...int(x) };
    if (t === 1) return { q: `$\\ln e^{${k}}$ kaçtır?`, qe: `Find $\\ln e^{${k}}$.`, ...int(k) };
    return { q: `$e^{\\ln ${x}}+\\ln e^{${k}}$ kaçtır?`, qe: `Find $e^{\\ln ${x}}+\\ln e^{${k}}$.`, ...int(x + k) };
  },
  b1_x1_solve: (r) => {
    const [b, k] = pick(r, [[2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [3, 3], [3, 4], [4, 3], [5, 2], [5, 3], [10, 3]]);
    const t = ri(r, 0, 2);
    if (t === 0) return { q: `$${b}^{x}=${b ** k}$ denklemini çöz: $x$ kaçtır?`, qe: `Solve $${b}^{x}=${b ** k}$ for $x$.`, ...int(k) };
    if (t === 1) return { q: `$\\dfrac{\\ln ${b ** k}}{\\ln ${b}}$ kaçtır?`, qe: `Find $\\dfrac{\\ln ${b ** k}}{\\ln ${b}}$.`, ...int(k) };
    const m = ri(r, 2, 4);
    return { q: `$${b}^{x}=${b}^{${m}}\\cdot ${b ** k}$ ise $x$ kaçtır?`, qe: `If $${b}^{x}=${b}^{${m}}\\cdot ${b ** k}$, find $x$.`, ...int(k + m) };
  },
  /* ---------- x1: faktöriyel ve binom ---------- */
  b1_x1_fact: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) { const n = ri(r, 0, 7); return { q: `$${n}!$ kaçtır?`, qe: `Find $${n}!$.`, ...int(fact(n)) }; }
    if (t === 1) {
      const n = ri(r, 5, 10), k = ri(r, 1, 2);
      return { q: `$\\dfrac{${n}!}{${n - k}!}$ kaçtır?`, qe: `Find $\\dfrac{${n}!}{${n - k}!}$.`, ...int(fact(n) / fact(n - k)) };
    }
    const n = ri(r, 3, 6);
    return { q: `$${n}$ farklı kitap bir rafa yan yana kaç farklı sırada dizilebilir?`, qe: `In how many different orders can $${n}$ different books be arranged in a row on a shelf?`, ...int(fact(n)) };
  },
  b1_x1_ncr: (r) => {
    const n = ri(r, 5, 20), t = ri(r, 0, 3);
    if (t === 0) return { q: `$${C(n, 0)}+${C(n, n)}$ kaçtır?`, qe: `Find $${C(n, 0)}+${C(n, n)}$.`, ...int(2) };
    if (t === 1) return { q: `$${C(n, 1)}$ kaçtır?`, qe: `Find $${C(n, 1)}$.`, ...int(n) };
    let k;
    do { k = ri(r, 1, 3); } while (2 * k === n);
    if (t === 2) return { q: `$${C(n, k)}=${C(n, "m")}$ ve $m\\ne ${k}$ ise $m$ kaçtır?`, qe: `If $${C(n, k)}=${C(n, "m")}$ and $m\\ne ${k}$, find $m$.`, ...int(n - k) };
    const N = ri(r, 6, 12), kk = ri(r, 1, 2);
    return { q: `$${C(N, N - kk)}$ kaçtır?`, qe: `Find $${C(N, N - kk)}$.`, ...int(nCr(N, kk)) };
  },
  b1_x1_pascal: (r) => {
    const n = ri(r, 3, 8), k = ri(r, 1, n);
    if (r() < 0.6) {
      return { q: `$${C(n, k - 1)}+${C(n, k)}=${C("N", k)}$ ise $N$ kaçtır?`, qe: `If $${C(n, k - 1)}+${C(n, k)}=${C("N", k)}$, find $N$.`, ...int(n + 1) };
    }
    return { q: `$${C(n, k - 1)}+${C(n, k)}$ kaçtır?`, qe: `Find $${C(n, k - 1)}+${C(n, k)}$.`, ...int(nCr(n + 1, k)) };
  },
  b1_x1_binom_term: (r) => {
    const n = ri(r, 4, 6), c = pick(r, [1, 2, 3, -1, -2]), k = ri(r, 1, 3);
    if (r() < 0.6) {
      const j = n - k, xj = j === 1 ? "x" : `x^{${j}}`;
      return { q: `$(x${sg(c)})^{${n}}$ açılımında $${xj}$ teriminin katsayısı kaçtır?`, qe: `Find the coefficient of $${xj}$ in the expansion of $(x${sg(c)})^{${n}}$.`, ...int(nCr(n, k) * c ** k) };
    }
    const m = ri(r, 2, 3);
    return { q: `$(x+${m})^{${n}}$ açılımındaki $${k + 1}$. terim $T_{${k + 1}}=A\\,x^{${n - k}}$ ise $A$ kaçtır?`, qe: `In the expansion of $(x+${m})^{${n}}$, the term $T_{${k + 1}}$ is $A\\,x^{${n - k}}$. Find $A$.`, ...int(nCr(n, k) * m ** k) };
  },
};
