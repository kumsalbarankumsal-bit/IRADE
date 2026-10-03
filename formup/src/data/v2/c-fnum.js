/* FormUp v2 — parça "fnum": Sayılar ve İşlemler (f-num) + Bölünebilme ve Asallar (f-div).
   Biçim: content/SPEC.md */
import { ri, pick, fr, int, gcd } from "./genkit.js";

export const CARDS = String.raw`
## f-num

# f-num-nat | 3 | Doğal sayılar | Natural numbers
L \mathbb{N}
R \lbrace 0,1,2,3,\dots\rbrace
X \lbrace 1,2,3,\dots\rbrace ;; \lbrace \dots,-2,-1,0,1,2,\dots\rbrace ;; \lbrace 0,2,4,6,\dots\rbrace
K IB’de $0$ bir doğal sayıdır. $0$ olmadan yazılan küme $\mathbb{Z}^+=\lbrace 1,2,3,\dots\rbrace$: pozitif tam sayılar.
KE In IB notation 0 is a natural number. Without 0 you get $\mathbb{Z}^+=\lbrace 1,2,3,\dots\rbrace$, the positive integers.
U Saymak için kullandığın sayılardır: $0$’dan başlar, sonsuza kadar gider.
UE The counting numbers: they start at 0 and go on forever.
W Elinde $0$ elma da olabilir, $7$ elma da; ama $-2$ ya da $1{,}5$ elma sayamazsın. Doğal sayılar tam da bu “sayılabilen” miktarlardır.
WE You can have 0 or 7 apples, but you cannot count $-2$ or $1.5$ apples. Natural numbers are exactly these countable amounts.
E $7\in\mathbb{N}$ ve $0\in\mathbb{N}$; ama $-3\notin\mathbb{N}$ ve $2{,}5\notin\mathbb{N}$.
H N’yi “Nesne sayısı” diye düşün: kaç tane nesne var? $0, 1, 2, \dots$
T natural numbers = doğal sayılar ;; positive integers = pozitif tam sayılar ;; is an element of = elemanıdır ($\in$)
Q Bir otoparktaki araba sayısı $-3$, $4{,}5$ ya da $0$ olabilir mi? Hangisi mümkün?
QE Could the number of cars in a car park be $-3$, $4.5$ or $0$? Which one is possible?
B \lbrace [[0]],1,2,3,\dots\rbrace || 1 ;; -1
G fnum_nat
LAB numberline

# f-num-int | 3 | Tam sayılar | Integers
L \mathbb{Z}
R \lbrace \dots,-2,-1,0,1,2,\dots\rbrace
X \lbrace 0,1,2,3,\dots\rbrace ;; \lbrace 1,2,3,\dots\rbrace ;; \lbrace \dots,-1,-\tfrac12,0,\tfrac12,1,\dots\rbrace
K Kesirli ya da ondalıklı sayılar tam sayı değildir. $\mathbb{Z}^+$: pozitif tam sayılar, $\lbrace 1,2,3,\dots\rbrace$.
KE Fractions and decimals are not integers. $\mathbb{Z}^+$: the positive integers, $\lbrace 1,2,3,\dots\rbrace$.
U Borç, sıcaklık, kat numarası gibi eksi de olabilen “tam” miktarları yazar.
UE Writes whole amounts that can also be negative: debts, temperatures, floor numbers.
W Doğal sayılara eksi kardeşlerini ekle: $-1, -2, -3, \dots$ Böylece sayı doğrusunda $0$’ın iki yanı da dolar.
WE Take the natural numbers and add their negatives; now both sides of 0 on the number line are filled.
E $-5\in\mathbb{Z}$, $0\in\mathbb{Z}$, $12\in\mathbb{Z}$; ama $\tfrac12\notin\mathbb{Z}$.
H Z harfi, Almanca “Zahlen” (sayılar) kelimesinden gelir.
T integers = tam sayılar ;; positive integers = pozitif tam sayılar ;; negative = negatif
Q Bir binada zemin kat $0$; otopark katları yerin altında. Bütün kat numaralarını yazmak için hangi sayılar gerekir?
QE In a building the ground floor is 0 and the car park floors are underground. Which numbers do you need to label every floor?
B \lbrace \dots,-2,[[-1]],0,1,2,\dots\rbrace || 1 ;; \tfrac12
G fnum_int
LAB numberline

# f-num-addneg | 3 | Negatif sayı eklemek | Adding a negative number
L a+(-b)
R a-b
X a+b ;; -a-b ;; b-a
K Sayı doğrusunda pozitif sayı eklemek sağa, negatif sayı eklemek sola gitmektir.
KE On the number line, adding a positive number moves you right; adding a negative number moves you left.
U $5+(-8)$ ya da $-3+(-4)$ gibi işlemleri sayı doğrusunda adım adım çözer.
UE Solves sums like $5+(-8)$ or $-3+(-4)$ step by step on the number line.
W Negatif sayı eklemek, borç eklemek gibidir: paran azalır. Yani $+(-b)$ ile $-b$ aynı şeydir.
WE Adding a negative is like adding a debt: your money goes down, so $+(-b)$ is the same as $-b$.
E $5+(-8)=5-8=-3$ (5’ten 8 adım sola). $-3+(-4)=-3-4=-7$ (eksideyken 4 adım daha sola).
H Artı ile eksi yan yana gelince eksi kazanır: sola git.
T negative number = negatif sayı ;; number line = sayı doğrusu ;; sum = toplam
Q Sabah hava $-3^{\circ}\mathrm{C}$. Akşama doğru sıcaklık $4$ derece daha düşüyor. Akşam sıcaklık kaç derece olur?
QE In the morning it is $-3^{\circ}\mathrm{C}$. By the evening the temperature falls by another 4 degrees. What is the evening temperature?
B a[[-]]b || + ;; \cdot
C a=5:-10:10:1 ; b=8:0:10:1 => a-b
CT @a@+(-@b@)=@a@-@b@=@=@
G fnum_addneg
LAB numberline
V a:-5:5,b:-5:5

# f-num-subneg | 3 | Negatif sayı çıkarmak | Subtracting a negative number
L a-(-b)
R a+b
X a-b ;; -(a+b) ;; b-a
K İki eksi yan yana gelince artı olur: $-(-b)=+b$.
KE Two minus signs side by side make a plus: $-(-b)=+b$.
U $7-(-3)$ gibi “eksinin eksisi” işlemlerini ve iki sıcaklık arasındaki farkı doğru hesaplar.
UE Handles “minus a negative”, such as $7-(-3)$, and differences like the gap between two temperatures.
W Bir borcu silmek, sana para vermekle aynıdır. $3$ TL’lik borcunu (yani $-3$’ü) çıkarırsan $3$ TL kazanmış olursun.
WE Taking away a debt is the same as being given money: remove a debt of 3 (that is, $-3$) and you gain 3.
E $7-(-3)=7+3=10$; $-2-(-5)=-2+5=3$.
H Eksi eksi artı: “Borcu sil, zengin ol.”
T subtract = çıkarmak ;; difference = fark ;; minus sign = eksi işareti
Q Gece hava $-4^{\circ}\mathrm{C}$, öğlen $6^{\circ}\mathrm{C}$. Öğlen, geceden kaç derece daha sıcak?
QE At night it is $-4^{\circ}\mathrm{C}$ and at noon it is $6^{\circ}\mathrm{C}$. How many degrees warmer is it at noon?
B a[[+]]b || - ;; \cdot
C a=7:-10:10:1 ; b=3:0:10:1 => a+b
CT @a@-(-@b@)=@a@+@b@=@=@
G fnum_subneg
LAB numberline
V a:-5:5,b:-5:5

# f-num-negneg | 3 | Eksi çarpı eksi | Negative times negative
L (-a)\cdot(-b)
R a\cdot b
X -a\cdot b ;; -(a+b) ;; a+b
K Bölmede de aynı kural geçerli: $\dfrac{-a}{-b}=\dfrac{a}{b}$ ($b\ne 0$). Aynı işaretler pozitif sonuç verir.
KE The same rule works for division: $\dfrac{-a}{-b}=\dfrac{a}{b}$ ($b\ne 0$). Same signs give a positive answer.
U İki negatif sayıyı çarparken ya da bölerken sonucun işaretini söyler.
UE Gives the sign of the answer when you multiply or divide two negative numbers.
W Eksi işareti “arkanı dön” demektir. İki kez dönersen yine ileriye bakarsın: sonuç pozitif.
WE A minus sign means “turn around”. Turn around twice and you face forwards again, so the answer is positive.
E $(-3)\cdot(-4)=12$; $(-12)\div(-3)=4$.
H Aynı işaretler → artı. “Düşmanımın düşmanı dostumdur.”
T product = çarpım ;; quotient = bölüm ;; positive = pozitif
Q Bir dalgıç her dakika $3$ m aşağı iniyor ($-3$ m/dk). $4$ dakika önce ($-4$ dk) şimdikinden kaç metre yukarıdaydı?
QE A diver goes down 3 m every minute ($-3$ m/min). Four minutes ago ($-4$ min), how many metres higher was she?
C a=3:0:12:1 ; b=4:0:12:1 => a*b
CT (-@a@)\cdot(-@b@)=@=@
G fnum_negneg
LAB numberline
V a:-3:3,b:-3:3

# f-num-negpos | 3 | Eksi çarpı artı | Negative times positive
L (-a)\cdot b
R -a\cdot b
X a\cdot b ;; -(a+b) ;; b-a
K Sıra fark etmez: $a\cdot(-b)=-a\cdot b$. Bölmede de aynı: $\dfrac{-a}{b}=-\dfrac{a}{b}$ ($b\ne 0$). Farklı işaretler negatif sonuç verir.
KE Order does not matter: $a\cdot(-b)=-a\cdot b$. Division works the same: $\dfrac{-a}{b}=-\dfrac{a}{b}$ ($b\ne 0$). Different signs give a negative answer.
U Bir negatif ile bir pozitif sayıyı çarparken ya da bölerken sonucun işaretini söyler.
UE Gives the sign of the answer when you multiply or divide a negative number and a positive one.
W $(-3)\cdot 4$, “$-3$’ü 4 kez topla” demektir: $-3-3-3-3=-12$. Borç üst üste birikir, sonuç negatif kalır.
WE $(-3)\times 4$ means adding $-3$ four times: $-12$. Debts pile up, so the answer stays negative.
E $(-3)\cdot 4=-12$; $20\div(-5)=-4$.
H Farklı işaretler → eksi.
T multiply = çarpmak ;; divide = bölmek ;; sign = işaret
Q Her gün hesabından $15$ TL fatura ödemesi çekiliyor. $6$ günde bakiyen toplam ne kadar değişir?
QE Every day 15 lira is taken from your account for a bill. By how much does your balance change in 6 days?
B [[-]]a\cdot b || + ;; \pm
C a=3:0:12:1 ; b=4:0:12:1 => -a*b
CT (-@a@)\cdot @b@=@=@
G fnum_negpos
LAB numberline
V a:-3:3,b:-3:3

# f-num-bidmas | 3 | İşlem önceliği (BIDMAS) | Order of operations (BIDMAS)
L 2+3\cdot 4
R 14
X 20 ;; 9 ;; 24
K Sıra: Parantez (Brackets) → Üs (Indices) → Çarpma ve Bölme, soldan sağa (Division, Multiplication) → Toplama ve Çıkarma, soldan sağa (Addition, Subtraction).
KE Order: Brackets → Indices → Division and Multiplication, left to right → Addition and Subtraction, left to right.
U Uzun bir işlemde hangi adımın önce yapılacağını söyler; böylece herkes aynı sonucu bulur.
UE Tells you which step comes first in a long calculation, so everyone gets the same answer.
W Çarpma, kısaltılmış toplamadır ($3\cdot 4=4+4+4$); bu yüzden önce o yapılır: $3\cdot 4=12$, sonra $2+12=14$.
WE Multiplication is shorthand for repeated addition, so it is done first: $3\times 4=12$, then $2+12=14$.
E $(2+3)\cdot 4=20$ (önce parantez). $2\cdot 3^2=2\cdot 9=18$ (önce üs). $12\div 3\cdot 2=4\cdot 2=8$ (soldan sağa).
H BIDMAS (ya da BODMAS): Brackets, Indices, Division, Multiplication, Addition, Subtraction.
T order of operations = işlem önceliği ;; brackets = parantez ;; indices = üsler
Q Kafede $2$ TL’lik bir çay ve tanesi $3$ TL olan $4$ simit aldın. Hesabı tek bir işlem satırı olarak yazıp hesaplarsan kaç TL ödersin?
QE At a café you buy a 2 lira tea and 4 bagels at 3 lira each. If you write the bill as one calculation, how much do you pay?
C a=2:0:20:1 ; b=3:0:12:1 ; c=4:0:12:1 => a+b*c
CT @a@+@b@\cdot @c@=@=@
G fnum_bidmas
V -

# f-num-abs | 3 | Mutlak değer | Absolute value (modulus)
L |-5|
R 5
X -5 ;; \pm 5 ;; \dfrac{1}{5}
K $|x|$: $x$’in sayı doğrusunda $0$’a uzaklığı. Uzaklık negatif olamaz, bu yüzden her zaman $|x|\ge 0$. Önce içini hesapla: $|3-8|=|-5|=5$.
KE $|x|$: the distance of $x$ from 0 on the number line. A distance cannot be negative, so $|x|\ge 0$ always. Work out the inside first: $|3-8|=|-5|=5$.
U Bir sayının işaretine bakmadan ne kadar “büyük” olduğunu, yani $0$’a uzaklığını verir.
UE Gives the size of a number without its sign: its distance from 0.
W $-5$ de $5$ de $0$’dan tam $5$ adım uzaktadır; biri solda, biri sağda. Mutlak değer yalnızca adım sayısını sorar, yönü sormaz.
WE Both $-5$ and $5$ are exactly 5 steps from 0, one on the left and one on the right. Absolute value counts the steps, not the direction.
E $|-5|=5$, $|7|=7$, $|0|=0$, $|3-8|=5$.
H Mutlak değer = uzaklık. Uzaklık hiç eksi olur mu?
T absolute value = mutlak değer ;; modulus = mutlak değer (IB’de $|x|$) ;; distance = uzaklık
Q Bir dalgıç deniz seviyesinin $5$ m altında, bir martı ise $5$ m üstünde. İkisinin de deniz seviyesine uzaklığı kaç metredir?
QE A diver is 5 m below sea level and a seagull is 5 m above it. How far is each of them from sea level?
C x=-5:-20:20:1 => abs(x)
CT \left|@x@\right|=@=@
G fnum_abs
LAB numberline
V -

# f-num-even | 2 | Çift sayının genel biçimi | General form of an even number
L ~Her çift sayı
R 2k
X k+2 ;; 2k+1 ;; k^2
K $k\in\mathbb{Z}$ (herhangi bir tam sayı). $k=0, 1, 2, -1$ için $0, 2, 4, -2$ çıkar.
KE $k\in\mathbb{Z}$ (any integer). $k=0, 1, 2, -1$ gives $0, 2, 4, -2$.
U “Bu sayı çift” cümlesini cebir diline çevirir; basit ispatlarda kullanılır.
UE Turns “this number is even” into algebra; used in simple proofs.
W Çift sayı, $2$’ye kalansız bölünen sayıdır; yani $2$ çarpı bir tam sayıdır: $8=2\cdot 4$.
WE An even number divides exactly by 2, so it is 2 times an integer: $8=2\times 4$.
E $14=2\cdot 7$ ($k=7$). $0=2\cdot 0$, yani $0$ da çifttir. $-6=2\cdot(-3)$.
H Çift = “$2$ çarpı bir şey”.
T even number = çift sayı ;; integer = tam sayı ;; divisible by 2 = 2’ye bölünebilir
Q Bir sınıf tam olarak ikili gruplara ayrılıyor ve kimse açıkta kalmıyor. Öğrenci sayısını genel olarak nasıl yazarsın?
QE A class splits exactly into pairs with nobody left over. How can you write the number of students in general?
B [[2]]k || 1 ;; 3 ;; k
C k=7:-20:20:1 => 2*k
CT 2\cdot @k@=@=@
G fnum_even

# f-num-odd | 2 | Tek sayının genel biçimi | General form of an odd number
L ~Her tek sayı
R 2k+1
X 2k ;; k+1 ;; 2(k+1)
K $k\in\mathbb{Z}$. Tek sayı = çift sayı $+\,1$. ($2k-1$ biçimi de doğrudur.)
KE $k\in\mathbb{Z}$. An odd number is an even number plus 1. (The form $2k-1$ also works.)
U “Bu sayı tek” cümlesini cebire çevirir; ardışık sayı ve tek/çift ispatlarında kullanılır.
UE Turns “this number is odd” into algebra, for consecutive-number and odd/even proofs.
W Tek sayıda nesneyi ikişer ikişer eşlersen hep $1$ tane açıkta kalır: $9=2\cdot 4+1$.
WE Pair up an odd number of objects and exactly one is always left over: $9=2\times 4+1$.
E $9=2\cdot 4+1$ ($k=4$); $-3=2\cdot(-2)+1$ ($k=-2$).
H Tek = çift $+\,1$: biri hep açıkta kalır.
T odd number = tek sayı ;; consecutive = ardışık ;; remainder = kalan
Q Bir otobüste herkes ikili koltuklara oturuyor ama hep bir kişi tek başına kalıyor. Yolcu sayısını genel olarak nasıl yazarsın?
QE On a bus everyone sits in pairs but one person is always left alone. How can you write the number of passengers in general?
B 2k+[[1]] || 0 ;; 2 ;; k
C k=4:-20:20:1 => 2*k+1
CT 2\cdot @k@+1=@=@
G fnum_odd

# f-num-sq | 3 | Bir sayının karesi | Square of a number
L n^2
R n\cdot n
X 2n ;; 2^n ;; n\cdot n\cdot n
K Tam kareler: $1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225$. Dikkat: $(-3)^2=9$ ama $-3^2=-9$ (önce üs, sonra eksi).
KE Perfect squares: 1, 4, 9, 16, 25, …, 225. Careful: $(-3)^2=9$ but $-3^2=-9$ (the index first, then the minus).
U Alan hesabının, Pisagor’un ve üslerin temel taşıdır.
UE The building block of area, Pythagoras and indices.
W Kenarı $n$ olan bir karede $n$ sıra ve her sırada $n$ küçük kare vardır: toplam $n\cdot n$ tane.
WE A square of side $n$ has $n$ rows of $n$ small squares: $n\times n$ in total.
E $7^2=7\cdot 7=49$ ($14$ değil!). $12^2=144$. $(-5)^2=25$.
H Kare = sayı kendisiyle çarpılır; $2$ ile çarpılmaz!
T square = kare ;; perfect square = tam kare ;; index (power) = üs
Q Kare biçimli bir odanın bir kenarı $6$ m. Zemini kaplamak için kaç metrekare halı gerekir?
QE A square room has sides of 6 m. How many square metres of carpet cover the floor?
B [[n]]\cdot n || 2 ;; n^2 ;; 1
C n=7:-20:20:1 => n^2
CT @n@^2=@n@\cdot @n@=@=@
G fnum_sq
LAB power
V n:-3:3

# f-num-sqrt | 3 | Tam karenin karekökü | Square root of a perfect square
L \sqrt{b^2}
R b
X \dfrac{b^2}{2} ;; 2b ;; -b
K $b\ge 0$. Karekök her zaman negatif olmayan sonucu verir: $\sqrt{49}=7$ (yalnızca $7$, $-7$ değil).
KE $b\ge 0$. The square root always gives the non-negative answer: $\sqrt{49}=7$ (only 7, not $-7$).
U Karesi bilinen sayıyı geri bulur: alanı $49$ olan karenin kenarı $7$’dir.
UE Undoes squaring: a square with area 49 has side 7.
W Karekök, “hangi sayının karesi bu?” sorusudur. $7^2=49$ olduğu için $\sqrt{49}=7$.
WE A square root asks “which number squared gives this?”. Since $7^2=49$, $\sqrt{49}=7$.
E $\sqrt{144}=12$, çünkü $12^2=144$. Dikkat: $\sqrt{16}=4$; yarısı olan $8$ değil!
H Kök = “kendisiyle çarpınca bunu veren sayı”.
T square root = karekök ;; perfect square = tam kare ;; non-negative = negatif olmayan
Q Kare biçimli bir fayansın alanı $81\ \text{cm}^2$. Bir kenarı kaç cm’dir?
QE A square tile has an area of $81\ \text{cm}^2$. How long is each side?
C b=7:0:20:1 => b*b
CT \sqrt{@=@}=@b@\quad(@b@^2=@=@)
G fnum_sqrt
LAB power
V b

# f-num-recip | 2 | Bir sayı ile tersinin çarpımı | A number times its reciprocal
L a\cdot\dfrac{1}{a}
R 1
X 0 ;; a ;; a^2
K $a\ne 0$ ($0$’ın tersi yoktur). Bir kesrin tersi, kesri alt üst ederek bulunur: $\tfrac{p}{q}$ kesrinin tersi $\tfrac{q}{p}$.
KE $a\ne 0$ (0 has no reciprocal). To find the reciprocal of a fraction, turn it upside down: the reciprocal of $\tfrac{p}{q}$ is $\tfrac{q}{p}$.
U Bir sayıyı neyle çarparsan $1$ elde edeceğini söyler; kesirle bölmenin anahtarıdır.
UE Tells you what to multiply a number by to get 1; it is the key to dividing by fractions.
W Bir pastayı $4$ eşit parçaya böl: her parça $\tfrac14$. Dört tane $\tfrac14$ yine bütün pastayı, yani $1$’i verir.
WE Cut a cake into 4 equal pieces: each is $\tfrac14$. Four quarters make the whole cake, which is 1.
E $5\cdot\tfrac15=1$, yani $5$’in tersi $\tfrac15$. $0{,}5\cdot 2=1$, yani $0{,}5$’in tersi $2$. $-2$’nin tersi $-\tfrac12$ (işaret aynı kalır).
H Sayı × tersi = 1, her zaman! (Yalnızca $0$’ın tersi yok.)
T reciprocal = çarpmaya göre ters ;; multiplicative inverse = çarpımsal ters ;; fraction = kesir
Q Bir tarif $\tfrac34$ bardak süt istiyor. Bu miktarı kaçla çarparsan tam $1$ bardak elde edersin?
QE A recipe needs $\tfrac34$ of a cup of milk. What do you multiply this amount by to get exactly 1 cup?
C a=4:1:20:1 => 1/a
CT @a@\cdot\dfrac{1}{@a@}=1,\quad \dfrac{1}{@a@}\approx @=@
G fnum_recip
LAB fraction
V a:-3:3

# f-num-rat | 2 | Rasyonel sayılar | Rational numbers
L \mathbb{Q}
R \left\lbrace \dfrac{p}{q}\ :\ p,q\in\mathbb{Z},\ q\ne 0\right\rbrace
X \left\lbrace \dfrac{p}{q}\ :\ p,q\in\mathbb{Z}\right\rbrace ;; \left\lbrace \dfrac{p}{q}\ :\ p,q\in\mathbb{N},\ q\ne 0\right\rbrace ;; \left\lbrace \dfrac{p}{q}\ :\ p,q\in\mathbb{R},\ q\ne 0\right\rbrace
K $p$: pay, $q$: payda. $q\ne 0$, çünkü $0$’a bölme tanımsızdır. Sonlu ondalıklar ($0{,}75=\tfrac34$) ve devirli ondalıklar ($0{,}\overline{3}=\tfrac13$) da rasyoneldir.
KE $p$: numerator, $q$: denominator. $q\ne 0$ because division by zero is undefined. Terminating decimals ($0.75=\tfrac34$) and recurring decimals ($0.\overline{3}=\tfrac13$) are rational too.
U İki tam sayının bölümü olarak yazılabilen bütün sayıları bir arada toplar: $\tfrac34$, $-2$, $0{,}5$ gibi.
UE Collects every number that can be written as one integer over another: $\tfrac34$, $-2$, $0.5$ and so on.
W “Rasyonel” sözcüğü İngilizce “ratio” (oran) sözcüğünden gelir: iki tam sayının oranı. Her tam sayı da rasyoneldir: $5=\tfrac51$.
WE “Rational” comes from “ratio”: a ratio of two integers. Every integer is rational too: $5=\tfrac51$.
E $-2=\tfrac{-2}{1}$, $0{,}5=\tfrac12$, $0{,}\overline{3}=\tfrac13$: hepsi rasyonel. $\tfrac30$ ise bir sayı bile değildir.
H Rasyonel = ratio = kesir. Q harfi “quotient” (bölüm) kelimesinden gelir.
T rational number = rasyonel sayı ;; numerator = pay ;; denominator = payda
Q Bir pizzayı $8$ eşit dilime böldün ve $3$ dilim yedin. Yediğin miktar ve $0{,}375$ gibi sayılar hangi sayı ailesindendir?
QE You cut a pizza into 8 equal slices and eat 3. Which family of numbers do the amount you ate and numbers like $0.375$ belong to?
B \left\lbrace \dfrac{p}{q}\ :\ p,q\in[[\mathbb{Z}]],\ q\ne [[0]]\right\rbrace || \mathbb{R} ;; \mathbb{N} ;; 1
LAB fraction

# f-num-irr | 2 | İrrasyonel sayılar | Irrational numbers
L ~İrrasyonel sayı
O :
R ~Kesir olarak yazılamayan gerçek sayı
X ~Negatif olan her sayı ;; ~Ondalık kısmı olan her sayı ;; ~Kök içinde yazılan her sayı
K Örnek: $\sqrt{2}=1{,}41421\dots$ ve $\pi=3{,}14159\dots$ Ondalıkları sonsuza dek, tekrar etmeden sürer. Dikkat: $\sqrt{9}=3$ rasyoneldir!
KE A real number that cannot be written as a fraction $\tfrac pq$. Examples: $\sqrt{2}=1.41421\dots$, $\pi=3.14159\dots$; the decimals never end or repeat. Careful: $\sqrt{9}=3$ is rational!
U $\sqrt2$ ve $\pi$ gibi tam değeri ondalık olarak asla bitirilemeyen sayıları tanımanı sağlar.
UE Helps you recognise numbers like $\sqrt2$ and $\pi$ whose exact value can never be finished as a decimal.
W $\pi$’nin ondalıkları hiç bitmez ve bir kalıp hâlinde tekrar etmez. Böyle bir sayı iki tam sayının bölümü olamaz.
WE The decimals of $\pi$ never end and never repeat, so it cannot be a ratio of two integers.
E $\sqrt{2}$, $\sqrt{5}$, $\pi$ irrasyoneldir. $\sqrt{16}=4$, $0{,}25=\tfrac14$ ve $\tfrac{22}{7}$ ise rasyoneldir.
H İr-rasyonel = rasyonel “olmayan”. Hesap makinesi ekranı yetmez!
S $\pi$’nin irrasyonel olduğunu ilk kez 1761’de Johann Heinrich Lambert kanıtladı.
T irrational number = irrasyonel sayı ;; real number = gerçek (reel) sayı ;; exact value = tam değer
Q Kenarı $1$ m olan bir karenin köşegeni $\sqrt{2}$ m. Kaç basamak yazarsan yaz, bu uzunluğun ondalıkları bitmiyor. Böyle sayılara ne denir?
QE The diagonal of a square with side 1 m is $\sqrt{2}$ m. However many decimals you write, they never end. What are such numbers called?
G fnum_irr

# f-num-sets | 2 | Sayı kümeleri iç içe | Number sets inside each other
L \mathbb{N}
O \subset
R \mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}
X \mathbb{Q}\subset\mathbb{Z}\subset\mathbb{R} ;; \mathbb{Z}\subset\mathbb{R}\subset\mathbb{Q} ;; \mathbb{R}\subset\mathbb{Q}\subset\mathbb{Z}
K $\mathbb{R}$: gerçek sayılar, yani sayı doğrusundaki bütün noktalar (rasyoneller + irrasyoneller). $\subset$: “alt kümesidir”.
KE $\mathbb{R}$: the real numbers, every point on the number line (rationals and irrationals). $\subset$: “is a subset of”.
U Bir sayının aynı anda hangi kümelere ait olduğunu gösterir: $5$ hem doğal, hem tam, hem rasyonel, hem gerçek sayıdır.
UE Shows which sets a number belongs to at once: 5 is natural, an integer, rational and real.
W Kümeler matruşka bebekleri gibi iç içedir: her doğal sayı bir tam sayıdır, her tam sayı bir kesirdir ($5=\tfrac51$), her kesir sayı doğrusunda bir noktadır.
WE The sets nest like Russian dolls: every natural number is an integer, every integer is a fraction, and every fraction is a point on the number line.
E $-3$: $\mathbb{Z}$, $\mathbb{Q}$ ve $\mathbb{R}$’de var, $\mathbb{N}$’de yok. $\sqrt2$ ise yalnızca $\mathbb{R}$’de.
H Küçükten büyüğe N, Z, Q, R: “Nasılsın Zeynep? Quiz Rahattı!”
T subset = alt küme ;; real numbers = gerçek sayılar ;; set = küme
Q Termometrede $-7$ yazıyor. Bu sayı hangi sayı kümelerinin hepsine birden aittir ve bu kümeler nasıl sıralanır?
QE A thermometer shows $-7$. Which number sets does this number belong to, and how are those sets ordered?
B [[\mathbb{Z}]]\subset[[\mathbb{Q}]]\subset\mathbb{R} || \mathbb{N} ;; \mathbb{R}

## f-div

# f-div-factor | 3 | Bölen ve kat | Factor and multiple
L ~$a$, $b$’nin bölenidir
O \iff
R b=a\cdot k
X a=b\cdot k ;; b=a+k ;; a\cdot b=k
K $k$ bir tam sayı. Bu durumda $b$, $a$’nın katıdır ve $a\mid b$ yazılır (“$a$, $b$’yi böler”).
KE $k$ is an integer. Then $b$ is a multiple of $a$, written $a\mid b$ (“$a$ divides $b$”).
U Bir sayının diğerini tam bölüp bölmediğini söyler; “bölen” ile “kat”ı karıştırmamanı sağlar.
UE Tells you whether one number divides another exactly, and stops you mixing up “factor” and “multiple”.
W $12=3\cdot 4$ olduğundan $3$, $12$’yi tam böler. Bölen küçük taraftır, kat büyük taraf: $12$, $3$’ün katıdır.
WE Since $12=3\times 4$, 3 divides 12 exactly. The factor is the small side and the multiple the big side: 12 is a multiple of 3.
E $12$’nin pozitif bölenleri: $1, 2, 3, 4, 6, 12$. $3$’ün katları: $3, 6, 9, 12, 15, \dots$
H Bölen içeri sığar (küçük), kat dışarı büyür (büyük).
T factor = bölen (çarpan) ;; multiple = kat ;; divides = böler
Q $24$ öğrenciyi kimse açıkta kalmadan eşit gruplara ayırmak istiyorsun. Her grupta kaç öğrenci olabilir?
QE You want to split 24 students into equal groups with nobody left over. How many students could each group have?
B b=[[a]]\cdot k || b ;; k+1 ;; 2
C a=3:1:12:1 ; k=4:1:12:1 => a*k
CT @a@\cdot @k@=@=@
G fnum_factor
LAB divisibility

# f-div-rem | 3 | Kalanlı bölme | Division with remainder
L a
R b\,q+r
X b\,r+q ;; b\,q-r ;; (b+r)\,q
K $a$: bölünen, $b$: bölen, $q$: bölüm, $r$: kalan. Şart: $0\le r<b$ (kalan bölenden küçüktür, negatif olamaz).
KE $a$: dividend, $b$: divisor, $q$: quotient, $r$: remainder, with $0\le r<b$ (the remainder is smaller than the divisor and never negative).
U Bir bölmeyi kontrol eder ve kalanı bulur; kalan $0$ ise $b$, $a$’yı tam böler.
UE Checks a division and finds the remainder; if the remainder is 0, $b$ divides $a$ exactly.
W $47$ şekeri $5$ çocuğa eşit dağıt: herkese $9$ düşer, $2$ artar. Artan $5$ ya da daha fazla olsaydı bir tur daha dağıtırdın; bu yüzden $r<b$.
WE Share 47 sweets among 5 children: each gets 9 and 2 are left. If 5 or more were left you could share another round, so $r<b$.
E $47=5\cdot 9+2$: bölüm $9$, kalan $2$.
H Bölünen = bölen × bölüm + kalan.
T remainder = kalan ;; quotient = bölüm ;; divisor = bölen
Q $47$ yumurtayı $6$’lık kolilere yerleştiriyorsun. Kaç koli tam dolar, kaç yumurta artar?
QE You pack 47 eggs into boxes of 6. How many boxes are full and how many eggs are left over?
B [[b]]\,q+[[r]] || a ;; q ;; 1
C a=47:0:300:1 ; b=5:1:12:1 => a-b*floor(a/b)
CT @a@=@b@\cdot q+@=@
G fnum_rem
LAB divisibility

# f-div-2 | 3 | 2 ile bölünebilme | Divisibility by 2
L 2\mid n
O \iff
R ~Son rakamı çifttir: 0, 2, 4, 6 ya da 8
X ~Rakamlarının toplamı çifttir ;; ~İlk rakamı çifttir ;; ~Son rakamı 0 ya da 5’tir
K $2\mid n$: “$2$, $n$’yi böler”. Son rakam tekse $2$’ye bölümden kalan $1$’dir.
KE $2\mid n$: “2 divides $n$”, so $n$ is even exactly when its last digit is 0, 2, 4, 6 or 8. If the last digit is odd, the remainder is 1.
U Bir sayının çift olup olmadığını tek bakışta söyler.
UE Tells you at a glance whether a number is even.
W $10$, $100$, $1000$… hepsi $2$’ye bölünür. Bu yüzden yalnızca birler basamağı önemlidir.
WE 10, 100, 1000, … are all divisible by 2, so only the units digit matters.
E $3574$: son rakam $4$ → $2$’ye bölünür. $813$: son rakam $3$ → bölünmez, kalan $1$.
H Sona bak: son rakam çiftse sayı da çift.
T divisible by 2 = 2’ye bölünebilir ;; units digit = birler basamağı ;; even = çift
Q $3574$ ceviz, iki kardeşe hiç artmadan eşit paylaştırılabilir mi?
QE Can 3574 walnuts be shared equally between two siblings with none left over?
C n=3574:0:99999:1 => n-2*floor(n/2)
CT @n@=2\cdot q+@=@
G fnum_d2
LAB divisibility

# f-div-5 | 3 | 5 ile bölünebilme | Divisibility by 5
L 5\mid n
O \iff
R ~Son rakamı 0 ya da 5’tir
X ~Son rakamı 5’tir ;; ~Rakamlarının toplamı 5’in katıdır ;; ~Son rakamı çifttir
K $5$’e bölümden kalan, son rakamın $5$’e bölümünden kalana eşittir: $732$ için $2$.
KE $5\mid n$ exactly when the last digit is 0 or 5. The remainder on division by 5 equals the remainder of the last digit: 2 for 732.
U Fiyat, dakika ve bozuk para hesaplarında hızlı kontrol sağlar.
UE A quick check for prices, minutes and coins.
W $10$ zaten $5$’e bölünür; onlar ve daha büyük basamaklar sorun çıkarmaz. Geriye son rakam kalır: $0$ ya da $5$ olmalı.
WE 10 is already a multiple of 5, so only the last digit matters: it must be 0 or 5.
E $4185$: son rakam $5$ → bölünür. $732$: son rakam $2$ → bölünmez, kalan $2$.
H Saatteki dakikalar gibi: :00, :05, :10… hep 0 ya da 5.
T multiple of 5 = 5’in katı ;; last digit = son rakam ;; remainder = kalan
Q Bir kumbarada yalnızca $5$ TL’lik madeni paralar var. İçindeki toplam para $4185$ TL olabilir mi?
QE A money box holds only 5 lira coins. Could the total inside be 4185 lira?
C n=4185:0:99999:1 => n-5*floor(n/5)
CT @n@=5\cdot q+@=@
G fnum_d5
LAB divisibility

# f-div-10 | 2 | 10 ile bölünebilme | Divisibility by 10
L 10\mid n
O \iff
R ~Son rakamı 0’dır
X ~Son rakamı 0 ya da 5’tir ;; ~Rakamlarının toplamı 10’dur ;; ~İçinde en az bir 0 vardır
K $10$’a bölümden kalan doğrudan son rakamdır: $3847$ için kalan $7$.
KE $10\mid n$ exactly when the last digit is 0. The remainder on division by 10 is just the last digit: 7 for 3847.
U Para, yuvarlama ve onluk paketlerle çalışırken anında karar verdirir.
UE Gives an instant answer when you work with money, rounding or packs of ten.
W $10$’a bölünen bir sayı hem $2$’ye hem $5$’e bölünür. Son rakam hem çift hem de $0$ ya da $5$ olmalı; ikisini birden sağlayan tek rakam $0$.
WE A number divisible by 10 is divisible by both 2 and 5: its last digit must be even and also 0 or 5, and only 0 is both.
E $2450$ → $10$’a bölünür. $1405$ → bölünmez, kalan $5$.
H Sonu sıfırsa onluk dostu.
T divisible by 10 = 10’a bölünebilir ;; place value = basamak değeri ;; units digit = birler basamağı
Q Elinde yalnızca $10$ TL’lik banknotlar var. $2450$ TL’lik bir ödemeyi para üstü almadan tam yapabilir misin?
QE You only have 10 lira notes. Can you pay a bill of 2450 lira exactly, without getting change?
C n=3847:0:99999:1 => n-10*floor(n/10)
CT @n@=10\cdot q+@=@
G fnum_d10
LAB divisibility

# f-div-3 | 3 | 3 ile bölünebilme | Divisibility by 3
L 3\mid n
O \iff
R ~Rakamlarının toplamı 3’ün katıdır
X ~Son rakamı 3, 6 ya da 9’dur ;; ~Son iki basamağı 3’ün katıdır ;; ~Rakamlarının çarpımı 3’ün katıdır
K Toplam büyükse rakamlarını yine topla: $98\,765\to 35\to 8$. Kalan da aynıdır: $n$ ile rakamları toplamı, $3$’e bölümde aynı kalanı verir.
KE $3\mid n$ exactly when the sum of its digits is a multiple of 3. If the sum is big, add its digits again; $n$ and its digit sum also leave the same remainder.
U Uzun bir sayının $3$’e bölünüp bölünmediğini bölme yapmadan, sadece toplama ile bulur.
UE Tells you if a long number is divisible by 3 using only addition, no long division.
W $10=9+1$, $100=99+1$, …: her basamak değeri “$3$’ün katı $+\,1$”dir. Bu yüzden $3$’e bölümde her rakam yalnızca kendi değeri kadar iz bırakır.
WE $10=9+1$, $100=99+1$, …: every place value is a multiple of 3 plus 1, so each digit only counts as itself.
E $5172$: $5+1+7+2=15$ → $3$’ün katı → bölünür. $5173$: $16$ → bölünmez, kalan $1$.
H 3 ve 9 için: rakamları topla!
T sum of the digits = rakamlar toplamı ;; divisible by 3 = 3’e bölünebilir ;; place value = basamak değeri
Q $5172$ bilet, $3$ kardeş arasında hiç artmadan eşit paylaştırılabilir mi?
QE Can 5172 tickets be shared equally among 3 siblings with none left over?
C a=5:1:9:1 ; b=1:0:9:1 ; c=7:0:9:1 ; d=2:0:9:1 => a+b+c+d
CT @a@@b@@c@@d@\ \to\ @a@+@b@+@c@+@d@=@=@
G fnum_d3
LAB divisibility

# f-div-9 | 3 | 9 ile bölünebilme | Divisibility by 9
L 9\mid n
O \iff
R ~Rakamlarının toplamı 9’un katıdır
X ~Son rakamı 9’dur ;; ~Rakamlarının toplamı 3’ün katıdır ;; ~Son iki basamağı 9’un katıdır
K $9$’a bölünen her sayı $3$’e de bölünür; tersi doğru değil: $12$, $3$’e bölünür ama $9$’a bölünmez. Kalan: rakamlar toplamının $9$’a bölümünden kalan.
KE $9\mid n$ exactly when the sum of its digits is a multiple of 9. Every multiple of 9 is a multiple of 3, but not the other way round: 12 is divisible by 3 but not by 9.
U $9$’a bölünebilmeyi ve $9$’a bölümden kalanı yalnızca toplama ile bulur.
UE Finds divisibility by 9, and the remainder, using only addition.
W $10=9+1$, $100=99+1$, $1000=999+1$: her basamak değeri $9$’un bir katından tam $1$ fazladır. Bu yüzden sayı ile rakamları toplamı $9$’a bölümde aynı kalanı verir.
WE Each place value is one more than a multiple of 9, so a number and its digit sum leave the same remainder on division by 9.
E $8307$: $8+3+0+7=18$ → $9$’un katı → bölünür. $1234$: $10$ → bölünmez, kalan $1$.
H Dokuzda da topla; sonuç $9, 18, 27, \dots$ olmalı.
T sum of the digits = rakamlar toplamı ;; divisible by 9 = 9’a bölünebilir ;; multiple of 9 = 9’un katı
Q $8307$ fidan, $9$ eşit sıraya hiç fidan artmadan dikilebilir mi?
QE Can 8307 saplings be planted in 9 equal rows with none left over?
C a=8:1:9:1 ; b=3:0:9:1 ; c=0:0:9:1 ; d=7:0:9:1 => a+b+c+d
CT @a@@b@@c@@d@\ \to\ @a@+@b@+@c@+@d@=@=@
G fnum_d9
LAB divisibility

# f-div-6 | 2 | 6 ile bölünebilme | Divisibility by 6
L 6\mid n
O \iff
R ~Hem 2’ye hem 3’e bölünür
X ~Son rakamı 6’dır ;; ~Rakamlarının toplamı 6’nın katıdır ;; ~2’ye ya da 3’e bölünür
K $6=2\cdot 3$. İki şart birlikte sağlanmalı: son rakam çift ve rakamlar toplamı $3$’ün katı.
KE $6\mid n$ exactly when $n$ is divisible by both 2 and 3 ($6=2\times 3$): the last digit is even and the digit sum is a multiple of 3.
U İki kolay kuralı birleştirerek $6$’ya bölünebilmeyi kontrol eder.
UE Combines two easy rules to test divisibility by 6.
W $6$’ya bölünen sayı hem ikişerli hem üçerli gruplara tam ayrılır. $2$ ile $3$’ün $1$’den başka ortak böleni olmadığı için ikisi birlikte $6$’yı garanti eder.
WE A multiple of 6 splits into groups of 2 and into groups of 3; since 2 and 3 share no common factor other than 1, the two rules together guarantee 6.
E $1236$: son rakam $6$ (çift) ve $1+2+3+6=12$ ($3$’ün katı) → bölünür. $1234$: çift ama $1+2+3+4=10$, $3$’ün katı değil → bölünmez.
H 6 = 2 VE 3, ikisi birden!
T divisible by 6 = 6’ya bölünebilir ;; condition = koşul ;; both = ikisi de
Q $1236$ yumurta, altılık viyollere hiç yumurta artmadan yerleştirilebilir mi?
QE Can 1236 eggs be packed into boxes of six with none left over?
C n=1236:0:99999:1 => n-6*floor(n/6)
CT @n@=6\cdot q+@=@
G fnum_d6
LAB divisibility

# f-div-4 | 2 | 4 ile bölünebilme | Divisibility by 4
L 4\mid n
O \iff
R ~Son iki basamağı 4’ün katıdır
X ~Son rakamı 4’tür ;; ~Son rakamı çifttir ;; ~Rakamlarının toplamı 4’ün katıdır
K Son iki basamak: onlar ve birler basamağının oluşturduğu sayı ($3716$ için $16$). $00$ da $4$’ün katı sayılır.
KE $4\mid n$ exactly when the number formed by its last two digits (tens and units) is a multiple of 4, e.g. 16 for 3716. 00 also counts.
U Büyük sayılarda bile yalnızca son iki rakama bakarak karar verdirir.
UE Lets you decide by looking only at the last two digits, even for huge numbers.
W $100=4\cdot 25$ olduğu için yüzler ve daha büyük basamaklar her zaman $4$’e bölünür. Geriye son iki basamak kalır.
WE $100=4\times 25$, so the hundreds and above are always divisible by 4; only the last two digits matter.
E $3716$: $16=4\cdot 4$ → bölünür. $514$: $14$, $4$’ün katı değil → bölünmez (son rakamı $4$ olsa da!).
H $4$ için son $2$ rakam.
T last two digits = son iki basamak ;; tens digit = onlar basamağı ;; multiple of 4 = 4’ün katı
Q Artık yıllar (çoğunlukla) $4$’e bölünebilen yıllardır. $2036$ yılı bu koşulu sağlar mı?
QE Leap years are (mostly) the years divisible by 4. Does the year 2036 satisfy this condition?
C n=3716:0:99999:1 => n-4*floor(n/4)
CT @n@=4\cdot q+@=@
G fnum_d4
LAB divisibility

# f-div-8 | 1 | 8 ile bölünebilme | Divisibility by 8
L 8\mid n
O \iff
R ~Son üç basamağı 8’in katıdır
X ~Son iki basamağı 8’in katıdır ;; ~Son rakamı 8’dir ;; ~Rakamlarının toplamı 8’in katıdır
K Son üç basamak: yüzler, onlar ve birler basamağının oluşturduğu sayı ($5416$ için $416$).
KE $8\mid n$ exactly when the number formed by its last three digits is a multiple of 8, e.g. 416 for 5416.
U Çok basamaklı sayılarda $8$’e bölünebilmeyi son üç rakamla çözer.
UE Checks divisibility by 8 using only the last three digits.
W $1000=8\cdot 125$ olduğu için binler ve üstü hep $8$’e bölünür. Zincir: $2\to$ son $1$, $4\to$ son $2$, $8\to$ son $3$ basamak.
WE $1000=8\times 125$, so the thousands and above are always divisible by 8. Pattern: 2 → last 1 digit, 4 → last 2, 8 → last 3.
E $5416$: $416=8\cdot 52$ → bölünür. $7116$: $116$, $8$’in katı değil → bölünmez (son iki basamak $16$ olsa da).
H 2-4-8 → son 1-2-3 rakam.
T last three digits = son üç basamak ;; hundreds digit = yüzler basamağı ;; multiple of 8 = 8’in katı
Q $5416$ kalem, $8$’li kutulara hiç kalem artmadan yerleştirilebilir mi?
QE Can 5416 pens be packed into boxes of 8 with none left over?
C n=5416:0:99999:1 => n-8*floor(n/8)
CT @n@=8\cdot q+@=@
G fnum_d8
LAB divisibility

# f-div-11 | 1 | 11 ile bölünebilme | Divisibility by 11
L 11\mid n
O \iff
R ~Rakamlar sağdan $+,-,+,\dots$ diye toplanınca 11’in katı çıkar
X ~Rakamlarının toplamı 11’in katıdır ;; ~Son iki basamağı 11’in katıdır ;; ~Bütün rakamları aynıdır
K Birler basamağından başla, işaretleri sırayla $+,-,+,-,\dots$ ver. Sonuç $0$ da olabilir; $0$ da $11$’in katıdır.
KE $11\mid n$ exactly when the alternating sum of its digits (from the units digit: $+,-,+,-,\dots$) is a multiple of 11. The result may be 0, which counts.
U $11$’e bölünebilmeyi uzun bölme yapmadan, toplama ve çıkarma ile kontrol eder.
UE Checks divisibility by 11 with additions and subtractions instead of long division.
W $10=11-1$ olduğundan basamak değerleri $11$’e bölümde sırayla $+1, -1, +1, \dots$ gibi davranır.
WE Because $10=11-1$, the place values act like $+1, -1, +1, \dots$ when you divide by 11.
E $8371$: $1-7+3-8=-11$ → bölünür ($8371=11\cdot 761$). $1234$: $4-3+2-1=2$ → bölünmez.
H 11 için “artı, eksi, artı, eksi” dansı; sağdan başlar.
T alternating sum = işaretleri sırayla değişen toplam ;; divisible by 11 = 11’e bölünebilir ;; units digit = birler basamağı
Q $8371$ öğrenci, $11$ kişilik futbol takımlarına kimse dışarıda kalmadan ayrılabilir mi?
QE Can 8371 students be split into football teams of 11 with nobody left out?
C a=8:1:9:1 ; b=3:0:9:1 ; c=7:0:9:1 ; d=1:0:9:1 => d-c+b-a
CT @a@@b@@c@@d@\ \to\ @d@-@c@+@b@-@a@=@=@
G fnum_d11
LAB divisibility

# f-div-prime | 3 | Asal sayı | Prime number
L ~Asal sayı
O :
R ~Tam iki pozitif böleni (1 ve kendisi) olan pozitif tam sayı
X ~Kendisine ve 1’e bölünebilen her sayı ;; ~Bütün tek sayılar ;; ~En az iki pozitif böleni olan sayı
K $1$ asal değildir (yalnızca bir böleni var). Çift olan asal yalnızca bir tane var: $2$. İlk asallar: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29$. $1$’den büyük ve asal olmayan sayılara bileşik sayı denir.
KE A prime is a positive integer with exactly two positive factors, 1 and itself. 1 is not prime (it has only one factor). 2 is the only even prime. The first primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. A number greater than 1 that is not prime is composite.
U Asallar bütün tam sayıların yapı taşlarıdır; çarpanlara ayırma, EBOB ve EKOK bunlarla yapılır.
UE Primes are the building blocks of all whole numbers; factorizing, HCF and LCM all use them.
W $7$ kareyi dikdörtgen biçiminde dizmeye çalış: yalnızca $1\times 7$ olur. $6$ kareyle $2\times 3$ de yapabilirsin; bu yüzden $6$ asal değildir.
WE Try arranging 7 squares into a rectangle: only $1\times 7$ works. With 6 you can also make $2\times 3$, so 6 is not prime.
E $13$: bölenleri $1, 13$ → asal. $15$: $1, 3, 5, 15$ → asal değil. $9$ tek ama asal değil ($9=3\cdot 3$).
H Asal = “yalnız kurt”: yalnızca $1$ ve kendisi.
S Eratosthenes kalburu: $2$’den başla, her asalın katlarını sil; geriye yalnızca asallar kalır.
T prime number = asal sayı ;; composite number = bileşik sayı ;; factor = bölen
Q $13$ kurabiyeyi birkaç tabağa, her tabakta eşit sayıda ve tabak başına birden fazla kurabiye olacak şekilde koymak istiyorsun. Neden yapamıyorsun?
QE You want to put 13 biscuits on several plates, the same number on each plate and more than one per plate. Why can you not do it?
G fnum_prime
LAB divisibility

# f-div-pf | 3 | Asal çarpanlara ayırma | Prime factorization
L 60
R 2^{2}\cdot 3\cdot 5
X 4\cdot 3\cdot 5 ;; 2\cdot 3\cdot 5 ;; 2\cdot 3\cdot 10
K Her $n>1$ tam sayısı, asalların çarpımı olarak tek bir biçimde yazılır (sıra önemsiz). Yöntem: bölünebildiği en küçük asala böl, tekrarla: $60\to 30\to 15\to 5\to 1$ (bölenler $2, 2, 3, 5$).
KE Every integer $n>1$ is a product of primes in exactly one way (ignoring order). Method: keep dividing by the smallest prime that works: $60\to 30\to 15\to 5\to 1$.
U Bir sayının “DNA”sını çıkarır; EBOB, EKOK ve kök sadeleştirme hep bununla başlar.
UE Finds a number’s “DNA”; HCF, LCM and simplifying roots all start here.
W Sayıyı en küçük parçalarına ayırırsın. Asallar daha fazla bölünemez; $4$ ya da $10$ hâlâ bölünebildiği için sonuçta kalamaz.
WE You break the number into its smallest pieces. Primes cannot be split any further, so 4 or 10 cannot stay in the answer.
E $60=2\cdot 30=2\cdot 2\cdot 15=2\cdot 2\cdot 3\cdot 5=2^2\cdot 3\cdot 5$.
H Çarpan ağacı: dallar asal olana kadar bölmeye devam.
T prime factorization = asal çarpanlara ayırma ;; factor tree = çarpan ağacı ;; power (index) = üs
Q $60$ şekeri eşit gruplara bölmenin bütün yollarını bulmak istiyorsun. İşe $60$’ı hangi en küçük “yapı taşlarına” ayırarak başlarsın?
QE You want every way of splitting 60 sweets into equal groups. Into which smallest building blocks do you break 60 first?
B 2^{[[2]]}\cdot [[3]]\cdot 5 || 4 ;; 1 ;; 6
C a=2:0:6:1 ; b=1:0:4:1 ; c=1:0:3:1 => 2^a*3^b*5^c
CT 2^{@a@}\cdot 3^{@b@}\cdot 5^{@c@}=@=@
G fnum_pf
LAB divisibility

# f-div-hcf | 3 | EBOB (en büyük ortak bölen) | Highest common factor (HCF)
L \text{HCF}(2^{2}\cdot 3,\ 2\cdot 3\cdot 5)
R 2\cdot 3
X 2^{2}\cdot 3\cdot 5 ;; 2\cdot 3\cdot 5 ;; 2^{2}\cdot 3
K Yalnızca ortak asalları al, her birini en küçük üssüyle. Burada $12=2^2\cdot 3$ ve $30=2\cdot 3\cdot 5$; $\text{HCF}(12,30)=6$.
KE Take only the common primes, each with its smallest power. Here $12=2^2\cdot 3$ and $30=2\cdot 3\cdot 5$, so $\text{HCF}(12,30)=6$. Also called the greatest common divisor (GCD).
U İki sayıyı da tam bölen en büyük sayıyı bulur: eşit paketler yapmak ve kesir sadeleştirmek için.
UE Finds the largest number that divides both numbers: for equal packs and simplifying fractions.
W Ortak bölen iki sayının içine de sığmalı. Bu yüzden yalnızca ikisinde de olan asallar, ikisinde de bulunduğu kadar (küçük üs) alınır.
WE A common factor must fit inside both numbers, so you take only the primes they share, and only as many as both have (the smaller power).
E $\text{HCF}(12,30)$: ortak asallar $2$ ve $3$; küçük üsler $2^1$ ve $3^1$ → $6$. Yani $12$ elma ve $30$ armut en fazla $6$ özdeş pakete bölünür.
H EBOB: Ortaklar, Küçük üs.
T highest common factor (HCF) = en büyük ortak bölen (EBOB) ;; common factor = ortak bölen ;; prime factor = asal çarpan
Q $12$ elma ve $30$ armudu, hiç meyve artmadan birbirinin aynısı olan paketlere koymak istiyorsun. En fazla kaç paket yapabilirsin?
QE You want to put 12 apples and 30 pears into identical bags with no fruit left over. What is the greatest number of bags you can make?
B [[2]]\cdot 3 || 2^{2} ;; 5 ;; 1
C a=12:1:200:1 ; b=30:1:200:1 => gcd(a,b)
CT \text{HCF}(@a@,@b@)=@=@
G fnum_hcf

# f-div-lcm | 3 | EKOK (en küçük ortak kat) | Lowest common multiple (LCM)
L \text{LCM}(2^{2}\cdot 3,\ 2\cdot 3\cdot 5)
R 2^{2}\cdot 3\cdot 5
X 2\cdot 3 ;; 2^{2}\cdot 3 ;; 2^{3}\cdot 3^{2}\cdot 5
K Bütün asalları al (ortak olsun olmasın), her birini en büyük üssüyle. Burada $\text{LCM}(12,30)=60$.
KE Take every prime that appears (shared or not), each with its largest power. Here $\text{LCM}(12,30)=60$. Also called the least common multiple.
U İki sayının da katı olan en küçük sayıyı bulur: “ne zaman yine birlikte?” soruları ve payda eşitleme için.
UE Finds the smallest number that is a multiple of both: for “when do they meet again?” problems and common denominators.
W Ortak kat, iki sayıyı da içinde taşımalı. Bu yüzden her asal, hangi sayıda en çok varsa o kadar (büyük üs) alınır.
WE A common multiple must contain both numbers, so each prime is taken as many times as the number that has the most of it (the larger power).
E $12=2^2\cdot 3$, $30=2\cdot 3\cdot 5$ → $\text{LCM}=2^2\cdot 3\cdot 5=60$. $12$ ve $30$ dakikada bir kalkan iki otobüs, $60$ dakika sonra yine birlikte kalkar.
H EKOK: Hepsi, Büyük üs.
T lowest common multiple (LCM) = en küçük ortak kat (EKOK) ;; common multiple = ortak kat ;; power = üs
Q Bir otobüs $12$ dakikada bir, diğeri $30$ dakikada bir kalkıyor. İkisi şu an birlikte kalktı. En az kaç dakika sonra yine birlikte kalkarlar?
QE One bus leaves every 12 minutes and another every 30 minutes. They have just left together. After how many minutes will they next leave together?
B 2^{[[2]]}\cdot 3\cdot [[5]] || 1 ;; 3 ;; 0
C a=12:1:100:1 ; b=30:1:100:1 => lcm(a,b)
CT \text{LCM}(@a@,@b@)=@=@
G fnum_lcm

# f-div-hcflcm | 2 | EBOB × EKOK | HCF × LCM
L \text{HCF}(a,b)\cdot\text{LCM}(a,b)
R a\cdot b
X a+b ;; \dfrac{a\cdot b}{2} ;; (a\cdot b)^2
K $a, b$ pozitif tam sayılar.
KE $a, b$ are positive integers.
U EBOB ya da EKOK’tan biri biliniyorsa diğerini tek adımda bulur.
UE If you know the HCF or the LCM, it gives you the other in one step.
W EBOB her asalın küçük üssünü, EKOK büyük üssünü alır. İkisi birlikte iki sayının bütün asal çarpanlarını tam bir kez kullanır; sonuç $a\cdot b$ olur.
WE The HCF takes the smaller power of each prime and the LCM the larger one; together they use every prime factor of $a$ and $b$ exactly once, giving $a\cdot b$.
E $\text{HCF}(12,30)=6$, $\text{LCM}(12,30)=60$ ve $6\cdot 60=360=12\cdot 30$.
H Küçük × büyük = iki sayının çarpımı.
T product = çarpım ;; highest common factor = en büyük ortak bölen ;; lowest common multiple = en küçük ortak kat
Q İki sayının çarpımı $360$, en büyük ortak bölenleri $6$. Hiç çarpanlara ayırmadan en küçük ortak katlarını nasıl bulursun?
QE Two numbers multiply to 360 and their highest common factor is 6. How can you find their lowest common multiple without any factorizing?
B [[a\cdot b]] || a+b ;; (a\cdot b)^2 ;; \text{HCF}(a,b)
C a=12:1:60:1 ; b=30:1:60:1 => gcd(a,b)*lcm(a,b)
CT \text{HCF}\cdot\text{LCM}=@=@=@a@\cdot @b@
G fnum_hcflcm
`;

/* ---------------- yardımcılar ---------------- */
/** 10000 ve üstü sayılarda binlik ayıracı (ince boşluk) */
const big = (n) => {
  const s = String(Math.abs(n));
  return (n < 0 ? "-" : "") + (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") : s);
};
const dsum = (n) => String(Math.abs(n)).split("").reduce((s, d) => s + Number(d), 0);
const isPrime = (n) => {
  if (n < 2) return false;
  for (let k = 2; k * k <= n; k++) if (n % k === 0) return false;
  return true;
};
const nFactors = (n) => {
  let c = 0;
  for (let k = 1; k <= n; k++) if (n % k === 0) c++;
  return c;
};
const lcm = (a, b) => (a / gcd(a, b)) * b;
const DIG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
/** lo..9 arasından k farklı rakam */
const distinct = (r, k, lo = 1) => {
  const s = [];
  while (s.length < k) {
    const x = ri(r, lo, 9);
    if (!s.includes(x)) s.push(x);
  }
  return s;
};
/** Üç rakamın baştaki sıfırsız tüm dizilişleri */
const perms3 = (d) =>
  [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]
    .filter(([i]) => d[i] !== 0)
    .map(([i, j, k]) => 100 * d[i] + 10 * d[j] + d[k]);
const shuffle = (r, arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
/** Rakam dizisini, pos konumunda kutu (\square) olacak biçimde TeX’e çevir */
const boxed = (ds, pos) => ds.map((x, i) => (i === pos ? "\\square " : String(x))).join("");
const bigSmall = (r) => (r() < 0.5 ? ["büyük", "largest", Math.max] : ["küçük", "smallest", Math.min]);
/** Kutulu sayı sorusu: tek rakam uyuyorsa "hangi rakam", birden çok uyuyorsa en büyük/en küçük */
const boxQ = (r, s, d, suf, ok) => {
  const head = `$${s}$ sayısı $${d}$${suf} bölünebiliyorsa kutuya`;
  const headE = `The number $${s}$ is divisible by $${d}$.`;
  if (ok.length === 1) return { q: `${head} hangi rakam gelir?`, qe: `${headE} Which digit goes in the box?`, ...int(ok[0]) };
  const [tr, en, f] = bigSmall(r);
  return { q: `${head} yazılabilecek en ${tr} rakam kaçtır?`, qe: `${headE} What is the ${en} digit that can go in the box?`, ...int(f(...ok)) };
};

/* Rasyonel / irrasyonel sayı havuzu: [TR TeX, EN TeX] */
const RAT = [
  ["\\sqrt{4}", "\\sqrt{4}"], ["\\sqrt{9}", "\\sqrt{9}"], ["\\sqrt{25}", "\\sqrt{25}"], ["\\sqrt{100}", "\\sqrt{100}"],
  ["0{,}5", "0.5"], ["-7", "-7"], ["\\tfrac{22}{7}", "\\tfrac{22}{7}"], ["3{,}14", "3.14"],
  ["0{,}\\overline{3}", "0.\\overline{3}"], ["0", "0"],
];
const IRR = [
  ["\\sqrt{2}", "\\sqrt{2}"], ["\\sqrt{3}", "\\sqrt{3}"], ["\\sqrt{5}", "\\sqrt{5}"], ["\\sqrt{7}", "\\sqrt{7}"],
  ["\\pi", "\\pi"], ["\\sqrt{10}", "\\sqrt{10}"], ["2\\pi", "2\\pi"], ["1+\\sqrt{2}", "1+\\sqrt{2}"],
];
const SUF = { 2: "’nin", 3: "’ün", 5: "’in", 7: "’nin" };

export const GEN = {
  /* ---------- f-num ---------- */
  fnum_nat: (r) => {
    if (r() < 0.5) {
      const n = ri(r, 3, 15);
      return { q: `$${n}$ sayısından küçük kaç doğal sayı vardır?`, qe: `How many natural numbers are less than $${n}$?`, ...int(n) };
    }
    const a = ri(r, 2, 9), b = ri(r, 3, 12);
    return {
      q: `$-${a}$ ile $${b}$ arasında (ikisi de dahil) kaç doğal sayı vardır?`,
      qe: `How many natural numbers are there from $-${a}$ to $${b}$ inclusive?`,
      ...int(b + 1),
    };
  },
  fnum_int: (r) => {
    const a = ri(r, 1, 9), b = ri(r, 1, 9);
    if (r() < 0.6) {
      return {
        q: `$-${a}$ ile $${b}$ arasında (ikisi de dahil) kaç tam sayı vardır?`,
        qe: `How many integers are there from $-${a}$ to $${b}$ inclusive?`,
        ...int(a + b + 1),
      };
    }
    return {
      q: `$-${a}$ ile $${b}$ arasında (ikisi de hariç) kaç tam sayı vardır?`,
      qe: `How many integers are there strictly between $-${a}$ and $${b}$?`,
      ...int(a + b - 1),
    };
  },
  fnum_addneg: (r) => {
    const a = ri(r, -9, 12), b = ri(r, 2, 12);
    return { q: `$${a}+(-${b})$ kaçtır?`, qe: `Work out $${a}+(-${b})$.`, ...int(a - b) };
  },
  fnum_subneg: (r) => {
    const a = ri(r, -9, 12), b = ri(r, 1, 12);
    return { q: `$${a}-(-${b})$ kaçtır?`, qe: `Work out $${a}-(-${b})$.`, ...int(a + b) };
  },
  fnum_negneg: (r) => {
    const a = ri(r, 2, 12), b = ri(r, 2, 12);
    if (r() < 0.6) return { q: `$(-${a})\\cdot(-${b})$ kaçtır?`, qe: `Work out $(-${a})\\times(-${b})$.`, ...int(a * b) };
    return { q: `$(-${a * b})\\div(-${b})$ kaçtır?`, qe: `Work out $(-${a * b})\\div(-${b})$.`, ...int(a) };
  },
  fnum_negpos: (r) => {
    const a = ri(r, 2, 12), b = ri(r, 2, 12);
    const [tr, en, v] = pick(r, [
      [`(-${a})\\cdot ${b}`, `(-${a})\\times ${b}`, -a * b],
      [`${a}\\cdot(-${b})`, `${a}\\times(-${b})`, -a * b],
      [`(-${a * b})\\div ${b}`, `(-${a * b})\\div ${b}`, -a],
      [`${a * b}\\div(-${b})`, `${a * b}\\div(-${b})`, -a],
    ]);
    return { q: `$${tr}$ kaçtır?`, qe: `Work out $${en}$.`, ...int(v) };
  },
  fnum_bidmas: (r) => {
    const a = ri(r, 2, 9), b = ri(r, 2, 6), c = ri(r, 2, 6);
    const [tr, en, v] = pick(r, [
      [`${a}+${b}\\cdot ${c}`, `${a}+${b}\\times ${c}`, a + b * c],
      [`(${a}+${b})\\cdot ${c}`, `(${a}+${b})\\times ${c}`, (a + b) * c],
      [`${a * c}\\div ${c}\\cdot ${b}`, `${a * c}\\div ${c}\\times ${b}`, a * b],
      [`${b * c + a}-${b}\\cdot ${c}`, `${b * c + a}-${b}\\times ${c}`, a],
      [`${a}+${b}^2`, `${a}+${b}^2`, a + b * b],
      [`${a}\\cdot ${b}^2`, `${a}\\times ${b}^2`, a * b * b],
      [`${a}\\cdot(${b}+${c})-${b}`, `${a}\\times(${b}+${c})-${b}`, a * (b + c) - b],
    ]);
    return { q: `$${tr}$ işleminin sonucu kaçtır?`, qe: `Work out $${en}$.`, ...int(v) };
  },
  fnum_abs: (r) => {
    const a = ri(r, 2, 15), b = ri(r, 2, 15);
    const lo = Math.min(a, b), hi = Math.max(a, b) + 1;
    const k = ri(r, 0, 5);
    if (k === 5) {
      return { q: `Sayı doğrusunda $-${a}$ sayısının $0$’a uzaklığı kaçtır?`, qe: `On the number line, how far is $-${a}$ from $0$?`, ...int(a) };
    }
    const [e, v] = [
      [`|-${a}|`, a],
      [`|${lo}-${hi}|`, hi - lo],
      [`|-${a}|+|${b}|`, a + b],
      [`-|-${a}|`, -a],
      [`|-${a}|\\cdot|-${b}|`, a * b],
    ][k];
    return { q: `$${e}$ kaçtır?`, qe: `Work out $${e}$.`, ...int(v) };
  },
  fnum_even: (r) => {
    const k = ri(r, 0, 2);
    if (k === 0) {
      const n = 2 * ri(r, 6, 49);
      return { q: `$${n}=2k$ ise $k$ kaçtır?`, qe: `If $${n}=2k$, find $k$.`, ...int(n / 2) };
    }
    if (k === 1) {
      const m = ri(r, 10, 60);
      return { q: `$1$ ile $${m}$ arasında (ikisi de dahil) kaç çift sayı vardır?`, qe: `How many even numbers are there from $1$ to $${m}$ inclusive?`, ...int(Math.floor(m / 2)) };
    }
    const n = -2 * ri(r, 2, 20);
    return { q: `$k$ bir tam sayı ve $2k=${n}$ ise $k$ kaçtır?`, qe: `$k$ is an integer and $2k=${n}$. Find $k$.`, ...int(n / 2) };
  },
  fnum_odd: (r) => {
    const k = ri(r, 0, 2);
    if (k === 0) {
      const n = 2 * ri(r, 5, 49) + 1;
      return { q: `$${n}=2k+1$ ise $k$ kaçtır?`, qe: `If $${n}=2k+1$, find $k$.`, ...int((n - 1) / 2) };
    }
    if (k === 1) {
      const m = ri(r, 10, 60);
      return { q: `$1$ ile $${m}$ arasında (ikisi de dahil) kaç tek sayı vardır?`, qe: `How many odd numbers are there from $1$ to $${m}$ inclusive?`, ...int(Math.ceil(m / 2)) };
    }
    const n = -(2 * ri(r, 1, 15) + 1);
    return { q: `$k$ bir tam sayı ve $2k+1=${n}$ ise $k$ kaçtır?`, qe: `$k$ is an integer and $2k+1=${n}$. Find $k$.`, ...int((n - 1) / 2) };
  },
  fnum_sq: (r) => {
    const n = ri(r, 2, 15), k = ri(r, 0, 4);
    if (k <= 1) return { q: `$${n}^2$ kaçtır?`, qe: `Work out $${n}^2$.`, ...int(n * n) };
    if (k === 2) return { q: `$(-${n})^2$ kaçtır?`, qe: `Work out $(-${n})^2$.`, ...int(n * n) };
    if (k === 3) return { q: `$-${n}^2$ kaçtır? (Dikkat: parantez yok!)`, qe: `Work out $-${n}^2$. (Careful: no brackets!)`, ...int(-n * n) };
    return { q: `Kenarı $${n}$ m olan bir karenin alanı kaç metrekaredir?`, qe: `A square has sides of $${n}$ m. What is its area in square metres?`, ...int(n * n), unit: "m²" };
  },
  fnum_sqrt: (r) => {
    const b = ri(r, 2, 15), k = ri(r, 0, 2);
    if (k === 0) return { q: `$\\sqrt{${b * b}}$ kaçtır?`, qe: `Work out $\\sqrt{${b * b}}$.`, ...int(b) };
    if (k === 1) {
      const a = ri(r, 2, 10);
      return { q: `$\\sqrt{${a * a}}+\\sqrt{${b * b}}$ kaçtır?`, qe: `Work out $\\sqrt{${a * a}}+\\sqrt{${b * b}}$.`, ...int(a + b) };
    }
    return {
      q: `Alanı $${b * b}\\ \\text{cm}^2$ olan bir karenin bir kenarı kaç cm’dir?`,
      qe: `A square has an area of $${b * b}\\ \\text{cm}^2$. How long is one side, in cm?`,
      ...int(b),
      unit: "cm",
    };
  },
  fnum_recip: (r) => {
    const k = ri(r, 0, 3);
    if (k === 0) {
      const n = ri(r, 2, 15);
      return { q: `$${n}\\cdot x=1$ ise $x$ kaçtır?`, qe: `If $${n}\\times x=1$, find $x$.`, ...fr(1, n) };
    }
    if (k === 1) {
      const [tr, en, p, q] = pick(r, [
        ["0{,}5", "0.5", 2, 1], ["0{,}25", "0.25", 4, 1], ["0{,}2", "0.2", 5, 1], ["0{,}1", "0.1", 10, 1],
        ["0{,}125", "0.125", 8, 1], ["2{,}5", "2.5", 2, 5], ["1{,}25", "1.25", 4, 5], ["0{,}75", "0.75", 4, 3],
      ]);
      return { q: `$${tr}$ sayısının çarpmaya göre tersi kaçtır?`, qe: `What is the reciprocal of $${en}$?`, ...fr(p, q) };
    }
    if (k === 2) {
      const n = ri(r, 2, 12);
      return { q: `$-${n}$ sayısının çarpmaya göre tersi kaçtır?`, qe: `What is the reciprocal of $-${n}$?`, ...fr(-1, n) };
    }
    let p, q;
    do { p = ri(r, 1, 9); q = ri(r, 2, 9); } while (p === q || gcd(p, q) !== 1);
    return { q: `$-\\tfrac{${p}}{${q}}\\cdot x=1$ ise $x$ kaçtır?`, qe: `If $-\\tfrac{${p}}{${q}}\\times x=1$, find $x$.`, ...fr(-q, p) };
  },
  fnum_irr: (r) => {
    const all = shuffle(r, [...RAT.map((x) => [x, 0]), ...IRR.map((x) => [x, 1])]).slice(0, 5);
    const v = all.reduce((s, [, i]) => s + i, 0);
    const tr = all.map(([x]) => x[0]).join(";\\quad ");
    const en = all.map(([x]) => x[1]).join(",\\quad ");
    return { q: `Bu sayılardan kaç tanesi irrasyoneldir? $${tr}$`, qe: `How many of these numbers are irrational? $${en}$`, ...int(v) };
  },

  /* ---------- f-div ---------- */
  fnum_factor: (r) => {
    const k = ri(r, 0, 2);
    if (k === 0) {
      const n = pick(r, [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48]);
      return { q: `$${n}$ sayısının kaç pozitif böleni vardır?`, qe: `How many positive factors does $${n}$ have?`, ...int(nFactors(n)) };
    }
    const a = ri(r, 3, 9);
    if (k === 1) {
      const m = ri(r, 4, 12);
      return { q: `$${a}$ sayısının $${m}$. pozitif katı kaçtır?`, qe: `What is the ${m}th positive multiple of $${a}$?`, ...int(a * m) };
    }
    const m = ri(r, 30, 90);
    return {
      q: `$1$ ile $${m}$ arasında (ikisi de dahil) $${a}$ sayısının kaç katı vardır?`,
      qe: `How many multiples of $${a}$ are there from $1$ to $${m}$ inclusive?`,
      ...int(Math.floor(m / a)),
    };
  },
  fnum_rem: (r) => {
    const b = ri(r, 3, 12), qq = ri(r, 4, 25), rr = ri(r, 0, b - 1), a = b * qq + rr;
    const k = ri(r, 0, 2);
    if (k === 0) {
      return {
        q: `Bir sayı $${b}$ ile bölündüğünde bölüm $${qq}$, kalan $${rr}$ oluyor. Bu sayı kaçtır?`,
        qe: `When a number is divided by $${b}$, the quotient is $${qq}$ and the remainder is $${rr}$. What is the number?`,
        ...int(a),
      };
    }
    if (k === 1) return { q: `$${a}$ sayısının $${b}$ ile bölümünden kalan kaçtır?`, qe: `What is the remainder when $${a}$ is divided by $${b}$?`, ...int(rr) };
    return { q: `$${a}$ sayısı $${b}$ ile bölündüğünde bölüm kaçtır?`, qe: `What is the quotient when $${a}$ is divided by $${b}$?`, ...int(qq) };
  },
  fnum_d2: (r) => {
    let d;
    do { d = distinct(r, 3, 1); } while (!d.some((x) => x % 2 === 0) || !d.some((x) => x % 2 === 1));
    const [tr, en, f] = bigSmall(r);
    const v = f(...perms3(d).filter((n) => n % 2 === 0));
    return {
      q: `$${d[0]}$, $${d[1]}$ ve $${d[2]}$ rakamlarını birer kez kullanarak yazılabilecek en ${tr} üç basamaklı çift sayı kaçtır?`,
      qe: `Using each of the digits $${d[0]}$, $${d[1]}$ and $${d[2]}$ exactly once, what is the ${en} even three-digit number you can make?`,
      ...int(v),
    };
  },
  fnum_d5: (r) => {
    if (r() < 0.5) {
      const n = ri(r, 1000, 9999);
      return { q: `$${n}$ sayısının $5$ ile bölümünden kalan kaçtır?`, qe: `What is the remainder when $${n}$ is divided by $5$?`, ...int(n % 5) };
    }
    let d;
    do { d = distinct(r, 2, 1).concat(pick(r, [0, 5])); } while (new Set(d).size < 3);
    d.sort((x, y) => x - y);
    const [tr, en, f] = bigSmall(r);
    const v = f(...perms3(d).filter((n) => n % 5 === 0));
    return {
      q: `$${d[0]}$, $${d[1]}$ ve $${d[2]}$ rakamlarını birer kez kullanarak yazılabilecek, $5$ ile bölünebilen en ${tr} üç basamaklı sayı kaçtır?`,
      qe: `Using each of the digits $${d[0]}$, $${d[1]}$ and $${d[2]}$ exactly once, what is the ${en} three-digit number divisible by $5$ you can make?`,
      ...int(v),
    };
  },
  fnum_d10: (r) => {
    let n;
    if (r() < 0.5) {
      n = ri(r, 1000, 9999);
      return { q: `$${n}$ sayısının $10$ ile bölümünden kalan kaçtır?`, qe: `What is the remainder when $${n}$ is divided by $10$?`, ...int(n % 10) };
    }
    do { n = ri(r, 1000, 9999); } while (n % 10 === 0);
    return {
      q: `$${n}$ sayısına en az kaç eklenirse sonuç $10$’a tam bölünür?`,
      qe: `What is the smallest positive whole number you can add to $${n}$ so that the result is divisible by $10$?`,
      ...int(10 - (n % 10)),
    };
  },
  fnum_d4: (r) => {
    if (r() < 0.5) {
      const n = ri(r, 1000, 9999);
      return { q: `$${n}$ sayısının $4$ ile bölümünden kalan kaçtır?`, qe: `What is the remainder when $${n}$ is divided by $4$?`, ...int(n % 4) };
    }
    const ds = [ri(r, 1, 9), ri(r, 0, 9), 0, pick(r, [0, 2, 4, 6, 8])];
    const ok = DIG.filter((x) => (10 * x + ds[3]) % 4 === 0);
    return boxQ(r, boxed(ds, 2), 4, "’e", ok);
  },
  fnum_d8: (r) => {
    const rr = ri(r, 0, 7), last = 8 * ri(r, 5, 40) + rr, n = 1000 * ri(r, 10, 99) + last;
    if (rr === 0 || r() < 0.6) {
      return { q: `$${big(n)}$ sayısının $8$ ile bölümünden kalan kaçtır?`, qe: `What is the remainder when $${big(n)}$ is divided by $8$?`, ...int(rr) };
    }
    return {
      q: `$${big(n)}$ sayısına en az kaç eklenirse sonuç $8$’e tam bölünür?`,
      qe: `What is the smallest positive whole number you can add to $${big(n)}$ so that the result is divisible by $8$?`,
      ...int(8 - rr),
    };
  },
  fnum_d3: (r) => {
    if (r() < 0.4) {
      const n = ri(r, 1000, 99999);
      return { q: `$${big(n)}$ sayısının $3$ ile bölümünden kalan kaçtır?`, qe: `What is the remainder when $${big(n)}$ is divided by $3$?`, ...int(dsum(n) % 3) };
    }
    const ds = [ri(r, 1, 9), ri(r, 0, 9), ri(r, 0, 9), ri(r, 0, 9)], pos = ri(r, 1, 3);
    const S = ds.reduce((s, x, i) => (i === pos ? s : s + x), 0);
    const ok = DIG.filter((x) => (S + x) % 3 === 0);
    return boxQ(r, boxed(ds, pos), 3, "’e", ok);
  },
  fnum_d9: (r) => {
    if (r() < 0.4) {
      const n = ri(r, 1000, 99999);
      return { q: `$${big(n)}$ sayısının $9$ ile bölümünden kalan kaçtır?`, qe: `What is the remainder when $${big(n)}$ is divided by $9$?`, ...int(dsum(n) % 9) };
    }
    const ds = [ri(r, 1, 9), ri(r, 0, 9), ri(r, 0, 9), ri(r, 0, 9)], pos = ri(r, 1, 3);
    const S = ds.reduce((s, x, i) => (i === pos ? s : s + x), 0);
    const ok = DIG.filter((x) => (S + x) % 9 === 0);
    return boxQ(r, boxed(ds, pos), 9, "’a", ok);
  },
  fnum_d6: (r) => {
    const ds = [ri(r, 1, 9), ri(r, 0, 9), ri(r, 0, 9), pick(r, [0, 2, 4, 6, 8])], pos = ri(r, 1, 3);
    const S = ds.reduce((s, x, i) => (i === pos ? s : s + x), 0);
    const ok = DIG.filter((x) => (S + x) % 3 === 0 && (pos !== 3 || x % 2 === 0));
    const s = boxed(ds, pos);
    if (r() < 0.3) {
      return {
        q: `$${s}$ sayısı $6$’ya bölünebiliyorsa kutuya kaç farklı rakam yazılabilir?`,
        qe: `The number $${s}$ is divisible by $6$. How many different digits can go in the box?`,
        ...int(ok.length),
      };
    }
    return boxQ(r, s, 6, "’ya", ok);
  },
  fnum_d11: (r) => {
    // Dört basamaklı sayı: ds[0] binler … ds[3] birler. Sağdan +,-,+,- : ds[3]-ds[2]+ds[1]-ds[0]
    const sign = (i) => ((3 - i) % 2 === 0 ? 1 : -1);
    let ds, pos, x;
    do {
      ds = [ri(r, 1, 9), ri(r, 0, 9), ri(r, 0, 9), ri(r, 0, 9)];
      pos = ri(r, 0, 3);
      const T = ds.reduce((s, d, i) => (i === pos ? s : s + sign(i) * d), 0);
      x = (((-sign(pos) * T) % 11) + 11) % 11;
    } while (x > 9 || (pos === 0 && x === 0));
    return boxQ(r, boxed(ds, pos), 11, "’e", [x]);
  },
  fnum_prime: (r) => {
    const k = ri(r, 0, 2);
    if (k === 0) {
      const a = ri(r, 1, 40), b = a + ri(r, 8, 20);
      let c = 0;
      for (let n = a; n <= b; n++) if (isPrime(n)) c++;
      return { q: `$${a}$ ile $${b}$ arasında (ikisi de dahil) kaç asal sayı vardır?`, qe: `How many prime numbers are there from $${a}$ to $${b}$ inclusive?`, ...int(c) };
    }
    if (k === 1) {
      const n = ri(r, 8, 60);
      let p = n + 1;
      while (!isPrime(p)) p++;
      return { q: `$${n}$ sayısından büyük en küçük asal sayı kaçtır?`, qe: `What is the smallest prime number greater than $${n}$?`, ...int(p) };
    }
    const m = ri(r, 8, 25);
    let s = 0;
    for (let n = 2; n < m; n++) if (isPrime(n)) s += n;
    return { q: `$${m}$ sayısından küçük bütün asal sayıların toplamı kaçtır?`, qe: `What is the sum of all the prime numbers less than $${m}$?`, ...int(s) };
  },
  fnum_pf: (r) => {
    const P = [2, 3, 5, 7];
    let e, n;
    do {
      e = [ri(r, 0, 4), ri(r, 0, 3), ri(r, 0, 2), ri(r, 0, 1)];
      n = P.reduce((s, p, i) => s * p ** e[i], 1);
    } while (n > 600 || n < 12 || e.filter(Boolean).length < 2);
    const present = P.filter((p, i) => e[i] > 0);
    const k = ri(r, 0, 3);
    if (k === 0) {
      const i = P.indexOf(pick(r, present));
      const p = P[i];
      return {
        q: `$${n}$ sayısı asal çarpanlarına ayrıldığında $${p}$${SUF[p]} üssü kaçtır?`,
        qe: `When $${n}$ is written as a product of prime factors, what is the power of $${p}$?`,
        ...int(e[i]),
      };
    }
    if (k === 1) return { q: `$${n}$ sayısının en büyük asal çarpanı kaçtır?`, qe: `What is the largest prime factor of $${n}$?`, ...int(Math.max(...present)) };
    if (k === 2 || e[3] > 0) return { q: `$${n}$ sayısının kaç farklı asal çarpanı vardır?`, qe: `How many different prime factors does $${n}$ have?`, ...int(present.length) };
    return {
      q: `$${n}=2^x\\cdot 3^y\\cdot 5^z$ ise $x+y+z$ kaçtır?`,
      qe: `If $${n}=2^x\\times 3^y\\times 5^z$, find $x+y+z$.`,
      ...int(e[0] + e[1] + e[2]),
    };
  },
  fnum_hcf: (r) => {
    const g = ri(r, 2, 12);
    let m, k;
    do { m = ri(r, 2, 9); k = ri(r, 2, 9); } while (m === k || gcd(m, k) !== 1);
    const A = g * m, B = g * k;
    if (r() < 0.5) return { q: `$\\text{HCF}(${A},${B})$ (EBOB) kaçtır?`, qe: `Find $\\text{HCF}(${A},${B})$.`, ...int(g) };
    return {
      q: `$${A}$ elma ve $${B}$ armut, hiç meyve artmadan birbirinin aynısı olan paketlere konacak. En fazla kaç paket yapılabilir?`,
      qe: `$${A}$ apples and $${B}$ pears are packed into identical bags with no fruit left over. What is the greatest number of bags?`,
      ...int(g),
    };
  },
  fnum_lcm: (r) => {
    let a, b;
    do { a = ri(r, 2, 20); b = ri(r, 2, 20); } while (a === b || a % b === 0 || b % a === 0 || lcm(a, b) > 180);
    if (r() < 0.5) return { q: `$\\text{LCM}(${a},${b})$ (EKOK) kaçtır?`, qe: `Find $\\text{LCM}(${a},${b})$.`, ...int(lcm(a, b)) };
    return {
      q: `İki ışıktan biri $${a}$ saniyede bir, diğeri $${b}$ saniyede bir yanıyor. Şimdi birlikte yandılar. En az kaç saniye sonra yine birlikte yanarlar?`,
      qe: `One light flashes every $${a}$ seconds and another every $${b}$ seconds. They have just flashed together. After how many seconds will they next flash together?`,
      ...int(lcm(a, b)),
    };
  },
  fnum_hcflcm: (r) => {
    const g = ri(r, 2, 9);
    let m, k;
    do { m = ri(r, 2, 9); k = ri(r, 2, 9); } while (m === k || gcd(m, k) !== 1);
    const A = g * m, B = g * k, L = g * m * k;
    if (r() < 0.5) {
      return {
        q: `$\\text{HCF}(${A},${B})=${g}$ olduğuna göre $\\text{LCM}(${A},${B})$ kaçtır?`,
        qe: `Given that $\\text{HCF}(${A},${B})=${g}$, find $\\text{LCM}(${A},${B})$.`,
        ...int(L),
      };
    }
    return {
      q: `İki pozitif tam sayının EBOB’u $${g}$, EKOK’u $${L}$. Sayılardan biri $${A}$ ise diğeri kaçtır?`,
      qe: `Two positive integers have HCF $${g}$ and LCM $${L}$. One of them is $${A}$. What is the other?`,
      ...int(B),
    };
  },
};
