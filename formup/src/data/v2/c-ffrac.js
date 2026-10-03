import { ri, pick, fr, int, num, gcd } from "./genkit.js";

/* FormUp v2 · parça "ffrac": f-frac (Kesirler) + f-pct (Ondalık, Yüzde ve Oran)
   Kartlar öğretme sırasıyla (kolaydan zora). Biçim: content/SPEC.md */

export const CARDS = String.raw`
## f-frac

# f-frac-meaning | 3 | Kesir ne demek? | What a fraction means
L \dfrac{a}{b}
O :
R ~$b$ eşit parçanın $a$ tanesi
X ~$a$ eşit parçanın $b$ tanesi ;; ~Farklı boyda $b$ parçanın $a$ tanesi ;; ~$a$ ile $b$’nin çarpımı
K $a$: pay (üstteki sayı), $b$: payda (alttaki sayı). Payda asla $0$ olamaz: $b\ne 0$.
KE $a$: numerator (top number), $b$: denominator (bottom number), $b\ne 0$ (you cannot divide by zero).
U Bir bütünün ne kadarını aldığını tek bir sayıyla söyler.
UE Describes what part of a whole you have, using one number.
W Pizzayı $b$ eşit dilime kes, $a$ dilimini al: elinde $\tfrac{a}{b}$ pizza var. Kesir çizgisi aslında bölme demektir: $\tfrac{a}{b}=a\div b$.
WE Cut a pizza into b equal slices and take a of them: you have a/b of the pizza. The fraction bar also means "divided by".
E $\tfrac{3}{8}$: pizza 8 eşit dilim, sen 3 dilim aldın. $\tfrac{0}{5}=0$ ama $\tfrac{5}{0}$ tanımsızdır (undefined).
H Denominator = Down: payda da aşağıda durur.
T fraction = kesir ;; numerator = pay ;; denominator = payda
Q Bir çikolata 12 eşit kareye bölünmüş, sen 5 kare yedin. Çikolatanın ne kadarını yedin?
QE A chocolate bar is split into 12 equal squares and you eat 5 of them. What part of the bar did you eat?
G ffrac_part
LAB fraction
S Fibonacci, 1202’de yazdığı Liber Abaci kitabıyla kesir çizgisini Avrupa’da yaygınlaştırdı.

# f-frac-equiv | 3 | Denk kesirler | Equivalent fractions
L \dfrac{a}{b}
R \dfrac{ka}{kb}
X \dfrac{a+k}{b+k} ;; \dfrac{ka}{b} ;; \dfrac{a}{kb}
K Pay ve paydayı aynı $k$ sayısıyla çarp. $k\ne 0$, $b\ne 0$.
KE Multiply the numerator and the denominator by the same number $k$; $k\ne 0$, $b\ne 0$.
U Bir kesri, değerini değiştirmeden başka sayılarla yazmanı sağlar.
UE Lets you rewrite a fraction with different numbers without changing its value.
W Pizzanın yarısı ile 4 dilimden 2’si aynı miktardır. Her dilimi ikiye kesince hem parça sayısı hem aldığın parça 2 katına çıkar.
WE Half a pizza is the same as 2 slices out of 4: cutting every slice in two doubles both numbers.
E $\tfrac{3}{4}=\tfrac{3\cdot 5}{4\cdot 5}=\tfrac{15}{20}$
H Üste ne yaparsan alta da aynısını yap.
T equivalent fractions = denk kesirler ;; multiply = çarpmak
Q Ali, 4 dilime kesilmiş pizzasının 2 dilimini; Ela aynı boy bir pizzanın yarısını yedi. Kim daha çok yedi?
QE Ali eats 2 slices of his pizza, which is cut into 4 slices. Ela eats half of a pizza of the same size. Who eats more?
B \dfrac{[[ka]]}{[[kb]]} || a+k ;; b+k
C a=3:1:20:1 ; b=4:1:20:1 ; k=5:1:10:1 => a/b
CT \dfrac{@a@}{@b@}=\dfrac{@k@\cdot @a@}{@k@\cdot @b@}=@=@
G ffrac_equiv
LAB fraction
V a,b,k

# f-frac-simplify | 3 | Kesri sadeleştirme | Simplifying a fraction
L \dfrac{a}{b}
R \dfrac{a\div h}{b\div h}
X \dfrac{a-h}{b-h} ;; \dfrac{a\div h}{b} ;; \dfrac{a}{b\div h}
K $h$: $a$ ile $b$’nin EBOB’u (en büyük ortak bölen). Sonuç kesrin en sade hâlidir.
KE $h$: the highest common factor (HCF) of $a$ and $b$. The result is the fraction in its lowest terms.
U Kesri en küçük sayılarla yazarak hesabı kolaylaştırır.
UE Writes a fraction with the smallest possible numbers, which makes calculations easier.
W Bu, denk kesrin tersidir: pay ve paydayı aynı sayıya bölersin, değer değişmez. EBOB’a bölersen tek adımda en sade hâle gelir.
WE It is equivalent fractions in reverse: dividing both numbers by the same number keeps the value, and dividing by the HCF finishes in one step.
E $\tfrac{18}{24}$: EBOB$(18,24)=6$, yani $\tfrac{18\div 6}{24\div 6}=\tfrac{3}{4}$.
H Hem üstü hem altı bölen en büyük sayıyı bul.
T simplify = sadeleştirmek ;; lowest terms = en sade hâl ;; highest common factor (HCF) = EBOB
Q Bir sınavda 40 sorunun 30’unu doğru yaptın. Bunu en küçük sayılarla kesir olarak nasıl yazarsın?
QE You got 30 out of 40 questions right. How do you write this as a fraction using the smallest possible numbers?
B \dfrac{a\div [[h]]}{b\div [[h]]} || 2 ;; a ;; b
C a=18:1:120:1 ; b=24:1:120:1 => gcd(a,b)
CT h=\text{HCF}(@a@,@b@)=@=@
G ffrac_simplify
LAB fraction

# f-frac-mixed | 2 | Tam sayılı kesri bileşik kesre çevirme | Mixed number to improper fraction
L a\tfrac{b}{c}
R \dfrac{ac+b}{c}
X \dfrac{a+b}{c} ;; \dfrac{ab}{c} ;; \dfrac{ab+c}{c}
K $a\tfrac{b}{c}$ demek $a+\tfrac{b}{c}$ demektir (çarpma değil!). $a$: tam kısım, $c\ne 0$.
KE $a\tfrac{b}{c}$ means $a+\tfrac{b}{c}$ (not a times b over c). $a$: whole-number part, $c\ne 0$.
U Tam sayılı kesirleri ($2\tfrac{3}{4}$ gibi) hesaba hazır tek bir kesre çevirir.
UE Turns a mixed number such as $2\tfrac{3}{4}$ into a single fraction that is ready for calculations.
W Her bütün $c$ parçadır; $a$ bütün $a\cdot c$ parça eder. Üstüne $b$ parça daha eklenir.
WE Each whole has c parts, so a wholes give ac parts; then add the extra b parts.
E $2\tfrac{3}{4}=\tfrac{2\cdot 4+3}{4}=\tfrac{11}{4}$. Tersine: $\tfrac{17}{5}=3\tfrac{2}{5}$, çünkü $17=3\cdot 5+2$.
H Alt ile tamı çarp, üstü ekle, alt aynı kalsın.
T mixed number = tam sayılı kesir ;; improper fraction = bileşik kesir ;; whole number = tam sayı
Q Tarifte $2\tfrac{1}{3}$ bardak un yazıyor ama elindeki ölçek $\tfrac{1}{3}$ bardaklık. Ölçeği kaç kez doldurmalısın?
QE A recipe needs $2\tfrac{1}{3}$ cups of flour, but your scoop holds 1/3 of a cup. How many scoops do you need?
B \dfrac{[[ac]]+b}{[[c]]} || ab ;; a+c ;; b
C a=2:0:20:1 ; b=3:0:20:1 ; c=4:1:20:1 => a*c+b
CT @a@\tfrac{@b@}{@c@}=\dfrac{@a@\cdot @c@+@b@}{@c@}=\dfrac{@=@}{@c@}
G ffrac_mixed

# f-frac-compare | 2 | Kesirleri karşılaştırma | Comparing fractions
L \dfrac{a}{b}<\dfrac{c}{d}
O \iff
R ad<bc
X ac<bd ;; a<c ;; ad>bc
K Paydalar pozitif olmalı: $b>0$, $d>0$. Hesapta $ad-bc$ negatif çıkarsa soldaki kesir küçüktür.
KE The denominators must be positive: $b>0$, $d>0$. If $ad-bc$ is negative, the first fraction is the smaller one.
U İki kesirden hangisinin büyük olduğunu hızlıca bulur.
UE Quickly tells you which of two fractions is bigger.
W İki kesri de $bd$ paydasına genişlet: paylar $ad$ ve $bc$ olur. Payda aynıysa payı büyük olan kesir büyüktür.
WE Rewrite both fractions over the common denominator bd: the numerators become ad and bc, and the bigger numerator wins.
E $\tfrac{3}{5}$ mi, $\tfrac{5}{8}$ mi? $3\cdot 8=24<25=5\cdot 5$, yani $\tfrac{3}{5}<\tfrac{5}{8}$.
H Çapraz çarp: her çarpım kendi payının tarafında durur, büyük çarpım büyük kesri gösterir.
T compare = karşılaştırmak ;; cross-multiply = çapraz çarpmak
Q Ali 5 atışın 3’ünü, Can 8 atışın 5’ini sokuyor. Hangisi daha isabetli?
QE Ali scores 3 of his 5 shots and Can scores 5 of his 8 shots. Who is more accurate?
B [[ad]]<[[bc]] || ac ;; bd
C a=3:0:20:1 ; b=5:1:20:1 ; c=5:0:20:1 ; d=8:1:20:1 => a*d-b*c
CT ad-bc=@a@\cdot @d@-@b@\cdot @c@=@=@
G ffrac_compare
LAB fraction

# f-frac-add-same | 3 | Paydaları eşit kesirleri toplama | Adding fractions with the same denominator
L \dfrac{a}{c}+\dfrac{b}{c}
R \dfrac{a+b}{c}
X \dfrac{a+b}{c+c} ;; \dfrac{a+b}{c^2} ;; \dfrac{ab}{c}
K $c\ne 0$. Paydalar aynıysa yalnızca paylar toplanır; payda aynen kalır. Çıkarmada da aynısı: $\tfrac{a}{c}-\tfrac{b}{c}=\tfrac{a-b}{c}$.
KE $c\ne 0$. With the same denominator, add only the numerators and keep the denominator. Subtraction works the same way.
U Aynı boydaki parçaları toplar.
UE Adds pieces that are the same size.
W 2 dilim + 3 dilim = 5 dilim; dilimlerin boyu (payda) değişmez. Paydaları da toplarsan dilimler küçülür, bu yanlış olur.
WE 2 slices plus 3 slices make 5 slices; the slice size (the denominator) does not change.
E $\tfrac{2}{9}+\tfrac{4}{9}=\tfrac{6}{9}=\tfrac{2}{3}$
H Payda bir “birim”dir: 2 elma + 3 elma = 5 elma, “elma” değişmez.
T denominator = payda ;; sum = toplam
Q Bir pastanın önce $\tfrac{2}{8}$’sini, sonra $\tfrac{3}{8}$’ünü yedin. Toplam pastanın ne kadarını yedin?
QE You eat 2/8 of a cake, then another 3/8 of it. What part of the cake have you eaten in total?
B \dfrac{[[a+b]]}{[[c]]} || c+c ;; ab ;; c^2
C a=2:0:20:1 ; b=3:0:20:1 ; c=7:1:20:1 => (a+b)/c
CT \dfrac{@a@}{@c@}+\dfrac{@b@}{@c@}=\dfrac{@a@+@b@}{@c@}=@=@
G ffrac_addsame
LAB fraction
V a,b,c

# f-frac-add | 3 | Paydaları farklı kesirleri toplama | Adding fractions with different denominators
L \dfrac{a}{b}+\dfrac{c}{d}
R \dfrac{ad+bc}{bd}
X \dfrac{a+c}{b+d} ;; \dfrac{ac+bd}{bd} ;; \dfrac{ad+bc}{b+d}
K $b\ne 0$, $d\ne 0$. Ortak payda olarak EKOK$(b,d)$ de kullanılabilir; sonuç aynı çıkar. Sonda sadeleştir.
KE $b\ne 0$, $d\ne 0$. You may also use the lowest common multiple (LCM) of $b$ and $d$ as the common denominator. Simplify at the end.
U Farklı boydaki parçaları ortak bir boya çevirip toplar.
UE Adds pieces of different sizes by first giving them a common denominator.
W Yarım ile üçte bir doğrudan toplanmaz, çünkü dilimler farklı boyda. İlk kesri $d$ ile, ikinciyi $b$ ile genişletince ikisi de $bd$ parçalık olur; sonra paylar toplanır.
WE Halves and thirds cannot be added directly. Multiplying the first fraction by d/d and the second by b/b gives both the common denominator bd.
E $\tfrac{1}{2}+\tfrac{1}{3}=\tfrac{1\cdot 3+2\cdot 1}{2\cdot 3}=\tfrac{5}{6}$
H Kelebek yöntemi: çapraz çarp ve topla, sonra paydaları çarp.
T common denominator = ortak payda ;; lowest common multiple (LCM) = EKOK
Q Bir tarifte $\tfrac{1}{2}$ bardak süt ve $\tfrac{1}{3}$ bardak su var. Toplam kaç bardak sıvı kullanılıyor?
QE A recipe uses 1/2 cup of milk and 1/3 cup of water. How many cups of liquid does it use in total?
B \dfrac{[[ad+bc]]}{[[bd]]} || a+c ;; b+d ;; ac+bd
C a=1:-10:10:1 ; b=2:1:12:1 ; c=1:-10:10:1 ; d=3:1:12:1 => (a*d+b*c)/(b*d)
CT \dfrac{@a@}{@b@}+\dfrac{@c@}{@d@}=\dfrac{@a@\cdot @d@+@b@\cdot @c@}{@b@\cdot @d@}=@=@
G ffrac_add
LAB fraction
V a,b,c,d
S Eski Mısırlılar kesirleri çoğunlukla payı 1 olan kesirlerin toplamı olarak yazardı: $\tfrac{3}{4}=\tfrac{1}{2}+\tfrac{1}{4}$.

# f-frac-sub | 3 | Kesirleri çıkarma | Subtracting fractions
L \dfrac{a}{b}-\dfrac{c}{d}
R \dfrac{ad-bc}{bd}
X \dfrac{a-c}{b-d} ;; \dfrac{bc-ad}{bd} ;; \dfrac{ad-bc}{b-d}
K $b\ne 0$, $d\ne 0$. Sıra önemli: önce ilk kesirden gelen $ad$ yazılır.
KE $b\ne 0$, $d\ne 0$. Order matters: $ad$ (from the first fraction) comes first.
U Bir miktardan kesirli bir parçayı çıkarır.
UE Takes a fractional part away from an amount.
W Toplamayla aynı fikir: önce ortak payda, sonra paylar çıkarılır. Paydalar asla birbirinden çıkarılmaz.
WE Same idea as adding: get a common denominator, then subtract the numerators. Never subtract the denominators.
E $\tfrac{3}{4}-\tfrac{1}{6}=\tfrac{3\cdot 6-4\cdot 1}{4\cdot 6}=\tfrac{14}{24}=\tfrac{7}{12}$
H Toplamanın ikizi: kelebek yine çalışır, ortadaki işaret “−” olur.
T difference = fark ;; subtract = çıkarmak
Q Şişede $\tfrac{3}{4}$ litre su vardı, $\tfrac{1}{3}$ litresini içtin. Şişede ne kadar su kaldı?
QE A bottle held 3/4 of a litre of water and you drank 1/3 of a litre. How much water is left?
B \dfrac{[[ad-bc]]}{[[bd]]} || bc-ad ;; a-c ;; b-d
C a=3:-10:10:1 ; b=4:1:12:1 ; c=1:-10:10:1 ; d=6:1:12:1 => (a*d-b*c)/(b*d)
CT \dfrac{@a@}{@b@}-\dfrac{@c@}{@d@}=\dfrac{@a@\cdot @d@-@b@\cdot @c@}{@b@\cdot @d@}=@=@
G ffrac_sub
LAB fraction
V a,b,c,d

# f-frac-mul | 3 | Kesirleri çarpma | Multiplying fractions
L \dfrac{a}{b}\times\dfrac{c}{d}
R \dfrac{ac}{bd}
X \dfrac{ad}{bc} ;; \dfrac{ad+bc}{bd} ;; \dfrac{a+c}{b+d}
K $b\ne 0$, $d\ne 0$. Ortak payda gerekmez! Çarpmadan önce çapraz sadeleştirme yapabilirsin.
KE $b\ne 0$, $d\ne 0$. No common denominator is needed. You can cancel common factors before multiplying.
U Bir kesrin bir kesir kadarını bulur (ör. yarının yarısı).
UE Finds a fraction of a fraction (for example, half of a half).
W Yarının yarısı $\tfrac12\times\tfrac12=\tfrac14$’dir: parçayı tekrar böldüğün için payda büyür. Pay payla, payda paydayla çarpılır.
WE Half of a half is a quarter: you split the piece again, so the denominators multiply, and so do the numerators.
E $\tfrac{2}{3}\times\tfrac{9}{10}=\tfrac{18}{30}=\tfrac{3}{5}$
H Çarpmada kolay yol: üst × üst, alt × alt.
T product = çarpım ;; cancel = sadeleştirmek (çarpmadan önce)
Q Pizzanın yarısı kalmıştı; kalan kısmın $\tfrac{1}{3}$’ini yedin. Bütün pizzanın ne kadarını yedin?
QE Half a pizza was left and you ate 1/3 of what was left. What fraction of the whole pizza did you eat?
B \dfrac{[[ac]]}{[[bd]]} || ad ;; bc ;; a+c
C a=2:-10:10:1 ; b=3:1:12:1 ; c=9:-10:10:1 ; d=10:1:12:1 => (a*c)/(b*d)
CT \dfrac{@a@}{@b@}\times\dfrac{@c@}{@d@}=\dfrac{@a@\cdot @c@}{@b@\cdot @d@}=@=@
G ffrac_mul
LAB fraction
V a,b,c,d

# f-frac-of | 3 | Bir miktarın kesri | A fraction of an amount
L ~$N$ sayısının $\tfrac{a}{b}$ kadarı ($\tfrac{a}{b}$ of $N$)
R \dfrac{a}{b}\times N
X \dfrac{N}{b} ;; \dfrac{b}{a}\times N ;; \dfrac{a}{b}+N
K $b\ne 0$. Pratik yol: önce $N$’yi $b$’ye böl, sonra $a$ ile çarp.
KE $b\ne 0$. Quick method: divide $N$ by $b$, then multiply by $a$.
U Bir miktarın belli bir kesri kadarını hesaplar (ör. maaşın $\tfrac{1}{4}$’i).
UE Works out a fraction of an amount, for example a quarter of a salary.
W Önce $N$’yi $b$ eşit parçaya bölersin, sonra $a$ parçayı alırsın. İngilizcede “of” gördüğün yerde çarparsın.
WE Split N into b equal parts and take a of them. In maths, "of" means multiply.
E $60$’ın $\tfrac{3}{4}$’ü: $60\div 4=15$, $15\times 3=45$.
H “of” $=\times$
T of = -nin/-ın (çarpma demek) ;; amount = miktar
Q Sınıftaki 30 öğrencinin $\tfrac{2}{5}$’si gözlüklü. Kaç öğrenci gözlüklü?
QE 2/5 of the 30 students in a class wear glasses. How many students wear glasses?
B \dfrac{a}{b}[[\times]] N || + ;; - ;; \div
C a=3:0:20:1 ; b=4:1:20:1 ; N=60:0:1000:1 => a/b*N
CT \dfrac{@a@}{@b@}\times @N@=@=@
G ffrac_of
LAB fraction

# f-frac-recip | 2 | Bir kesrin tersi | The reciprocal of a fraction
L ~$\tfrac{a}{b}$ kesrinin çarpmaya göre tersi (reciprocal)
R \dfrac{b}{a}
X -\dfrac{a}{b} ;; -\dfrac{b}{a} ;; 1-\dfrac{a}{b}
K $a\ne 0$, $b\ne 0$. Bir sayı ile tersinin çarpımı her zaman $1$’dir. Tam sayı $n$’nin tersi $\tfrac{1}{n}$’dir.
KE $a\ne 0$, $b\ne 0$. A number times its reciprocal is always $1$. The reciprocal of a whole number $n$ is $\tfrac{1}{n}$.
U Kesre bölerken kullanılır; ileride dik doğruların eğiminde de karşına çıkar.
UE Used when you divide by a fraction, and later for the gradients of perpendicular lines.
W Kesri ters çevir: pay aşağı, payda yukarı. $\tfrac{a}{b}\times\tfrac{b}{a}=\tfrac{ab}{ab}=1$ olduğu için “çarpmaya göre ters” denir.
WE Flip the fraction upside down. Because a/b × b/a = 1, it is also called the multiplicative inverse.
E $\tfrac{3}{7}$’ün tersi $\tfrac{7}{3}$; $5$’in tersi $\tfrac{1}{5}$.
H Ters çevir (flip): ikisini çarpınca hep $1$ çıkar.
T reciprocal = çarpmaya göre ters ;; flip = ters çevirmek
Q $\tfrac{3}{4}$’ü hangi sayıyla çarparsan sonuç tam olarak $1$ olur?
QE Which number do you multiply 3/4 by to get exactly 1?
B \dfrac{[[b]]}{[[a]]} || 1 ;; -b
C a=3:1:12:1 ; b=4:1:12:1 => b/a
CT \dfrac{@a@}{@b@}\ \to\ \dfrac{@b@}{@a@}=@=@
G ffrac_recip

# f-frac-div | 3 | Kesirleri bölme | Dividing fractions
L \dfrac{a}{b}\div\dfrac{c}{d}
R \dfrac{a}{b}\times\dfrac{d}{c}
X \dfrac{b}{a}\times\dfrac{c}{d} ;; \dfrac{b}{a}\times\dfrac{d}{c} ;; \dfrac{a}{b}\times\dfrac{c}{d}
K $b,c,d\ne 0$ (sıfıra bölünmez). Yalnızca ikinci kesir (bölen) ters çevrilir.
KE $b,c,d\ne 0$ (you cannot divide by zero). Only the second fraction (the divisor) is flipped.
U Bir miktarın içine kaç tane kesirli parça sığdığını bulur.
UE Finds how many fractional pieces fit into an amount.
W $3\div\tfrac12$, “3’ün içinde kaç yarım var?” demektir: 6 tane, yani $3\times 2$. Bir kesre bölmek, tersiyle çarpmakla aynıdır.
WE 3 ÷ 1/2 asks how many halves fit into 3: six, which is 3 × 2. Dividing by a fraction is the same as multiplying by its reciprocal.
E $\tfrac{3}{4}\div\tfrac{1}{8}=\tfrac{3}{4}\times\tfrac{8}{1}=\tfrac{24}{4}=6$
H KCF: Keep, Change, Flip. İlkini tut, bölmeyi çarpmaya çevir, ikinciyi ters çevir.
T divide = bölmek ;; divisor = bölen ;; quotient = bölüm
Q $\tfrac{3}{4}$ litre meyve suyunu $\tfrac{1}{8}$ litrelik bardaklara dolduracaksın. Kaç bardak dolar?
QE You pour 3/4 of a litre of juice into glasses that each hold 1/8 of a litre. How many glasses can you fill?
B \dfrac{a}{b}\times\dfrac{[[d]]}{[[c]]} || a ;; b
C a=3:-10:10:1 ; b=4:1:12:1 ; c=1:1:12:1 ; d=8:1:12:1 => (a*d)/(b*c)
CT \dfrac{@a@}{@b@}\div\dfrac{@c@}{@d@}=\dfrac{@a@}{@b@}\times\dfrac{@d@}{@c@}=@=@
G ffrac_div
LAB fraction

## f-pct

# f-pct-decimal | 3 | Kesri ondalık sayıya çevirme | Converting a fraction to a decimal
L \dfrac{a}{b}
R a\div b
X b\div a ;; a{,}b ;; \dfrac{a}{100}
K $b\ne 0$. Türkiye’de ondalık ayırıcı virgüldür ($0{,}75$), IB’de noktadır ($0.75$). Uygulama ikisini de kabul eder.
KE $b\ne 0$. In Turkey the decimal separator is a comma ($0{,}75$); IB uses a decimal point ($0.75$).
U Kesri, hesap makinesine yazılabilen bir ondalık sayıya çevirir.
UE Turns a fraction into a decimal that you can type into a calculator.
W Kesir çizgisi “bölü” demektir: $\tfrac{3}{4}$, $3$’ü $4$’e bölmektir, yani $0{,}75$. Payı paydaya bölersin, tersini değil. $\tfrac{3}{4}$ asla $3{,}4$ değildir!
WE The fraction bar means "divided by": 3/4 is 3 ÷ 4 = 0.75. Divide the numerator by the denominator, not the other way round.
E $\tfrac{3}{8}=3\div 8=0{,}375$ ve $\tfrac{1}{3}=0{,}333\ldots$
H Üst ÷ alt (top ÷ bottom).
T decimal = ondalık sayı ;; decimal point = ondalık ayırıcı (virgül)
Q Bir tarifte $\tfrac{3}{8}$ kg şeker yazıyor ama terazin ondalık sayı gösteriyor. Terazide kaç kg görmelisin?
QE A recipe asks for 3/8 kg of sugar, but your scale shows decimals. What reading should you see on the scale?
B [[a]]\div[[b]] || 100 ;; 10
C a=3:0:50:1 ; b=8:1:50:1 => a/b
CT \dfrac{@a@}{@b@}=@a@\div @b@=@=@
G ffrac_dec

# f-pct-dp | 3 | Ondalık basamağa yuvarlama | Rounding to decimal places
L ~$n$ ondalık basamağa yuvarlama (rounding to $n$ d.p.)
O :
R ~Sonraki rakam $\ge 5$ ise artır, $<5$ ise bırak
X ~Sonraki rakam $>5$ ise artır, $\le 5$ ise bırak ;; ~Fazla rakamları sil, hiç artırma ;; ~Her zaman bir yukarı yuvarla
K “Sonraki rakam”: virgülden sonraki $(n+1)$. rakam. Ondan sonrakilere bakılmaz.
KE The deciding digit is the $(n+1)$th digit after the decimal point; ignore the digits after it.
U Uzun bir ondalık sayıyı istenen basamak sayısıyla kısaca yazar.
UE Shortens a long decimal to the number of decimal places you need.
W Sayı, iki aday arasındaki yolun yarısını geçtiyse yukarı, geçmediyse aşağı gider. Tam yarıda ($5$) yukarı gidilir.
WE A number rounds up if it is halfway or more to the next value, and down if it is less than halfway.
E $3{,}14159$ → 2 ondalık basamak: üçüncü rakam $1<5$, cevap $3{,}14$. $0{,}0372$ → 2 ondalık basamak: $7\ge 5$, cevap $0{,}04$.
H 5 ve üstü kaldır, 4 ve altı bırak.
T decimal places (d.p.) = ondalık basamak ;; round = yuvarlamak
Q Hesap makinen $7{,}3846$ gösteriyor ve soru “cevabı 2 ondalık basamakla ver” diyor. Ne yazarsın?
QE Your calculator shows 7.3846 and the question says "give your answer to 2 decimal places". What do you write?
G ffrac_dp

# f-pct-def | 3 | Yüzde nedir? | What a percentage means
L p\%
R \dfrac{p}{100}
X \dfrac{100}{p} ;; \dfrac{p}{10} ;; 100p
K Türkçede işaret sayıdan önce yazılır: $\%20$ (“yüzde yirmi”). İngilizcede sonra: $20\%$ (“twenty percent”).
KE In English the sign comes after the number: $20\%$ ("twenty percent").
U Bir parçayı “100 üzerinden” anlatır; böylece kıyaslamak kolaylaşır.
UE Describes a part out of 100, which makes things easy to compare.
W “Yüzde” demek “her yüzde” demek. $\%20$, 100 parçanın 20’si demektir: $\tfrac{20}{100}=0{,}2$.
WE Percent means "per hundred": 20% is 20 out of every 100, so 20% = 20/100 = 0.2.
E $\%35=\tfrac{35}{100}=0{,}35$; $\%5=0{,}05$ (dikkat: $0{,}5$ değil!); $\%120=1{,}2$.
H Yüzdeyi ondalığa çevirmek için virgülü 2 basamak sola kaydır.
T percentage = yüzde ;; out of 100 = 100 üzerinden
Q Telefonunun ekranında şarj %45 görünüyor. Bataryanın ne kadarı dolu? Kesir ya da ondalık sayı olarak yaz.
QE Your phone shows 45% battery. What part of the battery is full? Write it as a fraction or a decimal.
B \dfrac{[[p]]}{[[100]]} || 10 ;; 1000
C p=20:0:200:1 => p/100
CT @p@\%=\dfrac{@p@}{100}=@=@
G ffrac_pctdec
LAB percent
S “Percent” sözcüğü Latince “per centum”, yani “her yüz için” ifadesinden gelir.

# f-pct-of | 3 | Bir miktarın yüzdesi | A percentage of an amount
L ~$N$’nin $\%p$’si ($p\%$ of $N$)
R \dfrac{p}{100}\times N
X \dfrac{N}{p}\times 100 ;; p\times N ;; \dfrac{100}{p}\times N
K $p$: yüzde, $N$: bütün miktar.
KE $p$: the percentage, $N$: the whole amount.
U Bir miktarın belli bir yüzdesini (indirim, vergi, faiz) hesaplar.
UE Works out a percentage of an amount, such as a discount, a tax or interest.
W $\%p$ demek $\tfrac{p}{100}$ demek; “of” da çarpma demek. Yani $N$’yi 100 parçaya bölüp $p$ tanesini alırsın.
WE p% means p/100 and "of" means multiply, so you split N into 100 parts and take p of them.
E $240$’ın $\%25$’i: $\tfrac{25}{100}\times 240=60$.
H %10 kolaydır: virgülü bir basamak sola kaydır. %5, %10’un yarısıdır.
T percentage = yüzde ;; discount = indirim ;; tax = vergi
Q 80 TL’lik bir montta %25 indirim var. İndirim kaç TL?
QE A coat costs 80 TL and has a 25% discount. How much is the discount?
B \dfrac{[[p]]}{[[100]]}\times N || N ;; 10
C p=25:0:100:1 ; N=240:0:2000:5 => p/100*N
CT \dfrac{@p@}{100}\times @N@=@=@
G ffrac_pctof
LAB percent

# f-pct-as | 3 | Bir sayı diğerinin yüzde kaçı? | One number as a percentage of another
L ~$x$, $y$’nin yüzde kaçı? ($x$ as a percentage of $y$)
R \dfrac{x}{y}\times 100\%
X \dfrac{y}{x}\times 100\% ;; \dfrac{x}{100}\times y ;; \dfrac{x-y}{y}\times 100\%
K $y\ne 0$. $y$: bütün (toplam), $x$: parça.
KE $y\ne 0$. $y$: the whole, $x$: the part.
U Sınav puanı, başarı oranı gibi sonuçları yüzdeye çevirir.
UE Turns scores and results into percentages.
W Önce kesri yaz (parça bölü bütün), sonra 100 ile çarp. Bütün her zaman paydaya gider.
WE Write the fraction part over whole, then multiply by 100. The whole always goes in the denominator.
E 40 sorunun 34’ünü doğru yaptın: $\tfrac{34}{40}\times 100=85$, yani $\%85$.
H Parça bölü bütün, çarpı yüz.
T as a percentage of = yüzde kaçı ;; whole = bütün
Q Bir basketbolcu 20 şutun 15’ini soktu. İsabet oranı yüzde kaç?
QE A basketball player scores 15 of 20 shots. What is the success rate as a percentage?
B \dfrac{[[x]]}{[[y]]}\times 100\% || 100 ;; x-y
C x=34:0:200:1 ; y=40:1:200:1 => x/y*100
CT \dfrac{@x@}{@y@}\times 100\%=@=@\%
G ffrac_pctas
LAB percent

# f-pct-change | 3 | Yüzde değişim | Percentage change
L ~Yüzde değişim (percentage change)
R \dfrac{\text{new}-\text{old}}{\text{old}}\times 100\%
X \dfrac{\text{new}-\text{old}}{\text{new}}\times 100\% ;; (\text{new}-\text{old})\times 100\% ;; \dfrac{\text{new}}{\text{old}}\times 100\%
K new: yeni değer, old: eski (ilk) değer. Sonuç negatifse azalma vardır. Payda her zaman eski değerdir!
KE new: the new value, old: the original value. A negative answer means a decrease. Always divide by the original value.
U Bir şeyin ilk hâline göre yüzde kaç arttığını ya da azaldığını bulur.
UE Finds by what percentage something has increased or decreased compared with its original value.
W Önce değişimi bul (yeni − eski). Sonra “bu değişim, eski değerin yüzde kaçı?” diye sor: eskiye böl, 100 ile çarp.
WE Find the change (new − old), then ask what percentage of the original value it is.
E Fiyat 80 TL’den 100 TL’ye çıktı: $\tfrac{100-80}{80}\times 100=25$, yani $\%25$ artış.
H Değişim bölü ESKİ, çarpı yüz.
T percentage change = yüzde değişim ;; original value = ilk değer ;; percentage increase = yüzde artış
Q Bir hisse senedi 40 TL’den 50 TL’ye çıktı. Değeri yüzde kaç arttı?
QE A share price rose from 40 TL to 50 TL. By what percentage did its value increase?
B \dfrac{[[\text{new}-\text{old}]]}{[[\text{old}]]}\times 100\% || \text{new} ;; \text{old}-\text{new}
C Old=80:1:1000:1 ; New=100:0:1000:1 => (New-Old)/Old*100
CT \dfrac{@New@-@Old@}{@Old@}\times 100\%=@=@\%
G ffrac_pctchange
LAB percent

# f-pct-inc | 3 | Yüzde artış ve çarpan | Percentage increase and the multiplier
L ~$N$, $\%p$ artınca yeni değer (increase $N$ by $p\%$)
R N\left(1+\dfrac{p}{100}\right)
X N+\dfrac{p}{100} ;; N\times\dfrac{p}{100} ;; N+p
K $1+\tfrac{p}{100}$ sayısına çarpan (multiplier) denir. Ör. $\%15$ artış: $\times 1{,}15$.
KE $1+\tfrac{p}{100}$ is the multiplier. For example, a $15\%$ increase means $\times 1.15$.
U Zam ya da büyüme sonrası yeni değeri tek bir çarpmayla bulur.
UE Finds the new value after an increase with a single multiplication.
W Yeni değer = eskinin tamamı ($\%100$) + artış ($\%p$), yani eskinin $\%(100+p)$’si. Bu da $1+\tfrac{p}{100}$ ile çarpmak demektir.
WE The new value is all of the old value (100%) plus the increase (p%), so it is (100 + p)% of N.
E 200 TL’ye %15 zam: $200\times 1{,}15=230$ TL.
H Artış çarpanı = $1+$ yüzde.
T multiplier = çarpan ;; percentage increase = yüzde artış
Q Maaşın 8000 TL ve %20 zam aldın. Yeni maaşın kaç TL?
QE Your salary is 8000 TL and you get a 20% pay rise. What is your new salary?
B N\left([[1]]+\dfrac{p}{[[100]]}\right) || 0 ;; 10 ;; p
C N=200:0:2000:5 ; p=15:0:100:1 => N*(1+p/100)
CT @N@\left(1+\dfrac{@p@}{100}\right)=@=@
G ffrac_inc
LAB percent

# f-pct-dec | 3 | Yüzde azalış ve çarpan | Percentage decrease and the multiplier
L ~$N$, $\%p$ azalınca yeni değer (decrease $N$ by $p\%$)
R N\left(1-\dfrac{p}{100}\right)
X N-\dfrac{p}{100} ;; N\times\dfrac{p}{100} ;; \dfrac{N}{1+\frac{p}{100}}
K Çarpan $1-\tfrac{p}{100}$’dür. Ör. $\%30$ indirim: $\times 0{,}7$.
KE The multiplier is $1-\tfrac{p}{100}$. For example, a $30\%$ discount means $\times 0.7$.
U İndirim ya da değer kaybından sonra kalan değeri bulur.
UE Finds what is left after a decrease such as a discount or a loss in value.
W $\%p$ gidiyorsa geriye $\%(100-p)$ kalır. $\%30$ indirimde fiyatın $\%70$’ini ödersin.
WE If p% is taken away, (100 − p)% is left: with a 30% discount you pay 70% of the price.
E 120 TL’lik kitapta %25 indirim: $120\times 0{,}75=90$ TL.
H Azalış çarpanı = $1-$ yüzde.
T percentage decrease = yüzde azalış ;; discount = indirim ;; depreciation = değer kaybı
Q 250 TL’lik ayakkabıda %30 indirim var. Kasada kaç TL ödersin?
QE A pair of shoes costs 250 TL and has a 30% discount. How much do you pay at the till?
B N\left(1[[-]]\dfrac{p}{100}\right) || + ;; \times
C N=250:0:2000:5 ; p=30:0:100:1 => N*(1-p/100)
CT @N@\left(1-\dfrac{@p@}{100}\right)=@=@
G ffrac_decr
LAB percent

# f-pct-successive | 2 | Art arda yüzde değişimler | Successive percentage changes
L ~$N$ önce $\%a$ artar, sonra $\%b$ azalır
R N\left(1+\dfrac{a}{100}\right)\left(1-\dfrac{b}{100}\right)
X N\left(1+\dfrac{a-b}{100}\right) ;; N\left(1+\dfrac{a}{100}\right)-\dfrac{b}{100} ;; N\left(1+\dfrac{a}{100}\right)\left(1+\dfrac{b}{100}\right)
K $N$: ilk değer. İkinci yüzde, ilk değişimden sonraki yeni değer üzerinden hesaplanır.
KE $N$: the original value. The second percentage is taken of the new value, not of the original one.
U Art arda gelen zam ve indirimlerden sonraki son değeri bulur.
UE Finds the final value after several percentage changes in a row.
W Yüzdeler toplanmaz, çarpanlar çarpılır. %20 zam sonra %20 indirim: $1{,}2\times 0{,}8=0{,}96$; başa dönmezsin, %4 kaybedersin!
WE Percentages do not add; the multipliers multiply. A 20% rise and then a 20% fall give 1.2 × 0.8 = 0.96, a 4% loss overall.
E 400 TL’ye önce %25 zam, sonra %20 indirim: $400\times 1{,}25\times 0{,}8=400$ TL.
H Yüzdeleri toplama, çarpanları çarp!
T successive = art arda ;; multiplier = çarpan
Q Bir ürüne önce %20 zam yapıldı, sonra yeni fiyat üzerinden %20 indirim. Son fiyat ilk fiyata göre nasıl değişti?
QE An item's price goes up by 20%, then the new price goes down by 20%. How does the final price compare with the original?
B N\left(1+\dfrac{a}{100}\right)\left([[1-\dfrac{b}{100}]]\right) || 1+\dfrac{b}{100} ;; -\dfrac{b}{100}
C N=400:0:2000:5 ; a=25:0:100:1 ; b=20:0:100:1 => N*(1+a/100)*(1-b/100)
CT @N@\left(1+\dfrac{@a@}{100}\right)\left(1-\dfrac{@b@}{100}\right)=@=@
G ffrac_succ
LAB percent

# f-pct-reverse | 2 | Ters yüzde: asıl değeri bulma | Reverse percentages: finding the original value
L ~$\%p$ artıştan önceki asıl değer (original value before a $p\%$ increase)
R \dfrac{\text{new}}{1+\frac{p}{100}}
X \text{new}\left(1-\dfrac{p}{100}\right) ;; \dfrac{\text{new}}{1-\frac{p}{100}} ;; \text{new}-p
K new: artıştan sonraki yeni değer. Azalıştan sonra ise yeni değer $1-\tfrac{p}{100}$ çarpanına bölünür.
KE new: the value after the increase. After a decrease, divide by the multiplier $1-\tfrac{p}{100}$ instead.
U Zamlı ya da indirimli fiyattan, değişimden önceki fiyatı geri bulur.
UE Works backwards from a changed value to the value before the change.
W Asıl değer × çarpan = yeni değer. Geri gitmek için çarpana bölersin. Yeni değerden %p çıkarmak yanlıştır, çünkü %p eski değerin yüzdesiydi.
WE Original × multiplier = new value, so to go back you divide by the multiplier. Taking p% off the new value is wrong, because p% was a percentage of the original.
E Zamlı fiyat 240 TL, zam %20: $\tfrac{240}{1{,}2}=200$ TL. Kontrol: $200\times 1{,}2=240$.
H Geri gitmek = çarpana bölmek.
T reverse percentage = ters yüzde ;; original value = asıl değer
Q KDV dahil 118 TL ödedin; KDV oranı %18. Ürünün KDV’siz fiyatı neydi?
QE You paid 118 TL including 18% VAT. What was the price before VAT?
B \dfrac{\text{new}}{[[1+\frac{p}{100}]]} || 1-\frac{p}{100} ;; \frac{p}{100}
C New=240:0:2000:1 ; p=20:0:100:1 => New/(1+p/100)
CT \dfrac{@New@}{1+\frac{@p@}{100}}=@=@
G ffrac_reverse

# f-pct-ratio | 3 | Oran | Ratio
L a:b
R \dfrac{a}{b}
X \dfrac{b}{a} ;; a\times b ;; a-b
K $a:b$, “$a$’nın $b$’ye oranı” diye okunur. $b\ne 0$. Sıra önemlidir: $2:3\ne 3:2$.
KE $a:b$ is read "the ratio of $a$ to $b$". $b\ne 0$. Order matters: $2:3\ne 3:2$.
U İki miktarı birbiriyle karşılaştırır (tarif, harita ölçeği, karışım).
UE Compares two quantities with each other (recipes, map scales, mixtures).
W $2:3$ demek “her 2 kıza karşılık 3 erkek” demek. Türkiye’de “:” zaten bölme işaretidir; oran da aslında bir bölmedir.
WE A ratio of 2 : 3 means "for every 2 of the first there are 3 of the second". A ratio can be written as a fraction.
E Sınıfta 12 kız, 18 erkek var: kız : erkek $=12:18=\tfrac{12}{18}=\tfrac{2}{3}$.
H Oran = sırası önemli olan bir bölme.
T ratio = oran ;; scale = ölçek
Q Bir limonata tarifinde 2 bardak limon suyuna 5 bardak su konuyor. Limon suyu ile suyun miktarını tek bir ifadeyle nasıl karşılaştırırsın?
QE A lemonade recipe uses 2 cups of lemon juice for every 5 cups of water. How do you compare the lemon juice with the water in one expression?
B \dfrac{[[a]]}{[[b]]} || a+b ;; 1
C a=2:1:50:1 ; b=3:1:50:1 => a/b
CT @a@:@b@=\dfrac{@a@}{@b@}=@=@
G ffrac_ratio

# f-pct-ratio-simplify | 2 | Oranı sadeleştirme | Simplifying a ratio
L a:b
R (a\div h):(b\div h)
X (a-h):(b-h) ;; (a\div h):b ;; b:a
K $h$: $a$ ile $b$’nin EBOB’u. İki tarafı aynı sayıyla çarpmak da oranı değiştirmez: $a:b=ka:kb$.
KE $h$: the HCF of $a$ and $b$. Multiplying both parts by the same number also keeps the ratio: $a:b=ka:kb$.
U Oranı en küçük tam sayılarla yazar.
UE Writes a ratio using the smallest possible whole numbers.
W Kesri sadeleştirmekle aynı: iki tarafı aynı sayıya bölersin, karşılaştırma değişmez.
WE Just like simplifying a fraction: divide both parts by the same number and the comparison stays the same.
E $24:36$: EBOB $12$, yani $2:3$. Ondalıklı oranda önce 10 ile çarp: $0{,}5:2=5:20=1:4$.
H İki tarafa da aynı işlem.
T simplest form = en sade hâl ;; equivalent ratio = denk oran
Q Bir okulda 240 öğrenci ve 16 öğretmen var. Öğrenci–öğretmen oranını en küçük tam sayılarla nasıl yazarsın?
QE A school has 240 students and 16 teachers. How do you write the student to teacher ratio using the smallest whole numbers?
B (a\div[[h]]):(b\div[[h]]) || 2 ;; a
C a=24:1:200:1 ; b=36:1:200:1 => gcd(a,b)
CT h=\text{HCF}(@a@,@b@)=@=@
G ffrac_ratiosimp

# f-pct-share | 3 | Bir miktarı oranla paylaştırma | Sharing an amount in a ratio
L ~$T$, $a:b$ oranında paylaşılınca birinci pay (first share)
R \dfrac{a}{a+b}\times T
X \dfrac{a}{b}\times T ;; \dfrac{T}{a+b} ;; \dfrac{T}{a}
K $T$: toplam miktar. İkinci pay $\tfrac{b}{a+b}\times T$’dir. İki pay toplanınca $T$ etmeli.
KE $T$: the total amount. The second share is $\tfrac{b}{a+b}\times T$; the two shares must add up to $T$.
U Bir toplamı (para, kâr, malzeme) verilen orana göre adilce böler.
UE Splits a total (money, profit, ingredients) fairly in a given ratio.
W $a:b$ oranında toplam $a+b$ eşit parça vardır. Önce bir parçanın değerini bul ($T\div(a+b)$), sonra $a$ ile çarp.
WE A ratio a : b splits the total into a + b equal parts. Find one part (T ÷ (a + b)), then multiply by a.
E 450 TL, $2:3$ oranında: 1 parça $=450\div 5=90$; paylar $180$ TL ve $270$ TL.
H Parçaları topla, bir parçayı bul, çarp.
T share = pay ;; in the ratio = oranında ;; total = toplam
Q Ali ile Can bir işe 2’ye 3 oranında para koydu ve 1000 TL kâr ettiler. Ali kârdan kaç TL almalı?
QE Ali and Can invested money in the ratio 2 : 3 and made a profit of 1000 TL. How much of the profit should Ali get?
B \dfrac{[[a]]}{[[a+b]]}\times T || b ;; ab
C a=2:1:20:1 ; b=3:1:20:1 ; T=450:0:5000:5 => a/(a+b)*T
CT \dfrac{@a@}{@a@+@b@}\times @T@=@=@
G ffrac_share

# f-pct-direct | 3 | Doğru orantı | Direct proportion
L y\propto x
O \iff
R y=kx
X y=\dfrac{k}{x} ;; y=x+k ;; y=kx^2
K $k$: orantı sabiti, $k\ne 0$. $\tfrac{y}{x}=k$ oranı hep aynı kalır.
KE $k$: the constant of proportionality, $k\ne 0$. The ratio $\tfrac{y}{x}=k$ always stays the same.
U Biri kaç katına çıkarsa diğeri de o kadar katına çıkan miktarları hesaplar.
UE Deals with quantities where doubling one doubles the other.
W 1 kg elma 15 TL ise 2 kg 30 TL, 3 kg 45 TL: $y=15x$. Grafiği orijinden geçen bir doğrudur.
WE If 1 kg of apples costs 15 TL, then 2 kg cost 30 TL: y = 15x. Its graph is a straight line through the origin.
E 3 kg elma 45 TL: $k=\tfrac{45}{3}=15$. 7 kg: $y=15\cdot 7=105$ TL.
H Doğru orantı: biri kaç kat artarsa diğeri de o kadar kat artar.
T directly proportional = doğru orantılı ;; constant of proportionality = orantı sabiti
Q Bir araba 4 litre benzinle 60 km gidiyor. 10 litre benzinle kaç km gider?
QE A car travels 60 km on 4 litres of fuel. How far can it travel on 10 litres?
B y=[[kx]] || \dfrac{k}{x} ;; x+k
C k=15:-20:20:0.5 ; x=7:-20:20:1 => k*x
CT y=@k@\cdot @x@=@=@
G ffrac_direct
LAB line

# f-pct-inverse | 2 | Ters orantı | Inverse proportion
L y\propto\dfrac{1}{x}
O \iff
R y=\dfrac{k}{x}
X y=kx ;; y=k-x ;; y=\dfrac{x}{k}
K $k\ne 0$, $x\ne 0$. Çarpım hep aynı kalır: $xy=k$.
KE $k\ne 0$, $x\ne 0$. The product always stays the same: $xy=k$.
U Biri artınca diğeri aynı oranda azalan miktarları (işçi–gün, hız–zaman) hesaplar.
UE Deals with quantities where doubling one halves the other (workers and days, speed and time).
W 4 işçi işi 6 günde bitiriyorsa iş $4\cdot 6=24$ “işçi-gün”dür. 8 işçi gelirse $24\div 8=3$ gün sürer.
WE If 4 workers take 6 days, the job is 4 × 6 = 24 worker-days; with 8 workers it takes 24 ÷ 8 = 3 days.
E $x=4$ iken $y=6$: $k=24$. $x=3$ iken $y=\tfrac{24}{3}=8$.
H Ters orantı: çarpım sabit.
T inversely proportional = ters orantılı ;; constant of proportionality = orantı sabiti
Q 6 musluk bir havuzu 4 saatte dolduruyor. Aynı musluklardan 8 tane olsa havuz kaç saatte dolar?
QE 6 identical taps fill a pool in 4 hours. How long would 8 of these taps take?
B y=\dfrac{[[k]]}{[[x]]} || 1 ;; kx
C k=24:-100:100:1 ; x=3:1:24:1 => k/x
CT y=\dfrac{@k@}{@x@}=@=@
G ffrac_inverse

# f-pct-sf | 3 | Anlamlı basamak | Significant figures
L ~Anlamlı basamakları saymaya başladığın yer (significant figures)
O :
R ~Soldaki ilk sıfır olmayan rakam
X ~Virgülden sonraki ilk rakam ;; ~En soldaki rakam, sıfır olsa bile ;; ~En sağdaki rakam
K Baştaki sıfırlar ($0{,}00$…) sayılmaz; aradaki sıfırlar ($405$’teki $0$) sayılır. Yuvarlarken son basamaktan sonraki rakama bakılır ($\ge 5$ ise artır).
KE Leading zeros (0.00…) are not significant; zeros between other digits (the 0 in 405) are. To round, look at the next digit.
U Çok büyük ya da çok küçük sayıları önemli rakamlarına göre yuvarlar.
UE Rounds very large or very small numbers by their important digits.
W Baştaki sıfırlar sadece virgülün yerini gösterir, değer taşımaz. Bu yüzden saymaya ilk “gerçek” rakamdan başlarsın.
WE Leading zeros only show where the decimal point is, so you start counting at the first non-zero digit.
E $0{,}004567$ → 3 anlamlı basamak: $0{,}00457$. $45\,678$ → 3 anlamlı basamak: $45\,700$ (sondaki sıfırlar yer tutucudur).
H Sıfır baştaysa sayılmaz, aradaysa sayılır.
T significant figures (s.f.) = anlamlı basamaklar ;; leading zeros = baştaki sıfırlar
Q Bir bakteri $0{,}0003048$ mm uzunluğunda. Bu uzunluğu 2 anlamlı basamakla yaz.
QE A bacterium is 0.0003048 mm long. Write this length to 2 significant figures.
G ffrac_sfcount

# f-pct-3sf | 3 | IB kuralı: kesin değer ya da 3 anlamlı basamak | IB rule: exact or three significant figures
L ~IB’de kesin (exact) olmayan bir cevap
O :
R ~3 anlamlı basamağa (3 s.f.) yuvarlanır
X ~2 ondalık basamağa yuvarlanır ;; ~En yakın tam sayıya yuvarlanır ;; ~Hiç yuvarlanmaz, tüm basamaklar yazılır
K Soru başka bir şey istemedikçe geçerlidir. Ara adımlarda yuvarlama yapma; tam değeri hesap makinesinde tut, sadece en sonda yuvarla.
KE Unless otherwise stated in the question, all numerical answers should be given exactly or correct to three significant figures. Do not round in the middle of a calculation.
U IB sınavında son cevabını puan kaybetmeden doğru biçimde yazmanı sağlar.
UE Makes sure you write your final answer in the form IB examiners expect.
W Kesin cevap ($\tfrac{2}{3}$, $\sqrt{5}$, $2\pi$) yazabiliyorsan onu yaz. Yazamıyorsan 3 anlamlı basamak kullan. Ara adımlarda yuvarlarsan son cevap kayabilir.
WE Give the exact answer if you can; otherwise round to 3 s.f. Rounding too early can make the final answer wrong.
E Hesap makinesi $12{,}3456$ → $12{,}3$. $0{,}0045678$ → $0{,}00457$. $2345{,}6$ → $2350$.
H IB’nin sihirli sayısı: 3.
T correct to three significant figures = 3 anlamlı basamağa doğru ;; exact = kesin ;; unless otherwise stated = aksi belirtilmedikçe
Q Sınavda hesap makinen $17{,}38962$ gösteriyor ve soruda yuvarlamayla ilgili hiçbir şey yazmıyor. Cevap kâğıdına ne yazarsın?
QE In an exam your calculator shows 17.38962 and the question says nothing about rounding. What do you write on your answer sheet?
G ffrac_sf3
`;

/* ---------- Türkçe ek yardımcıları ----------
   Sayıdan sonra gelen ekin doğru biçimi: 60’ın, 20’nin, %25’i, %20’si, 3’ünü, 2’sini.
   Ek, sayının okunuşundaki son kelimeye göre seçilir (ünlü uyumu + sert ünsüz). */
const BIRLER = ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
const ONLAR = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
const UNLU = "aeıioöuü";
function sonKelime(v) {
  let s = String(Math.abs(v));
  if (s.includes(".")) s = s.split(".")[1]; // ondalıkta virgülden sonrası okunur: 0,25 → "yirmi beş"
  const n = Number(s);
  if (n === 0) return "sıfır";
  if (n % 10) return BIRLER[n % 10];
  if (n % 100) return ONLAR[(n % 100) / 10];
  if (n % 1000) return "yüz";
  if (n % 1e6) return "bin";
  return "milyon";
}
function ek(v, tur) {
  const w = sonKelime(v);
  const sesli = [...w].filter((h) => UNLU.includes(h)).pop();
  const dar = { a: "ı", ı: "ı", o: "u", u: "u", e: "i", i: "i", ö: "ü", ü: "ü" }[sesli];
  const genis = "aıou".includes(sesli) ? "a" : "e";
  const son = w[w.length - 1];
  const unluyle = UNLU.includes(son);
  const d = "çfhkpsşt".includes(son) ? "t" : "d";
  const ekler = {
    in: (unluyle ? "n" : "") + dar + "n", //          tamlayan: 60’ın, 20’nin
    i: (unluyle ? "s" : "") + dar, //                 iyelik: %25’i, %20’si
    ini: (unluyle ? "s" : "") + dar + "n" + dar, //   iyelik + belirtme: 3’ünü, 2’sini
    e: (unluyle ? "y" : "") + genis, //               yönelme: 60’a, 20’ye
    den: d + genis + "n", //                          ayrılma: 20’den, 3’ten
  };
  return "’" + ekler[tur];
}
/* Yuvarlama cevabı: sondaki sıfırlar korunur (57,0 ya da 82,80) — değer aynı kalır */
const fixed = (v, d) => ({ a: v, tex: v.toFixed(d).replace(".", "{,}") });
/* İngilizce metin için ondalık nokta */
const en = (v) => String(Math.round(v * 1e6) / 1e6);
/* Büyük tam sayıları IB gibi ince boşlukla grupla: 45\,678 */
const group = (s) => (s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") : s);
/* Paydası b olan, en sade, 1’den küçük bir kesrin payı (ör. b = 6 → 1 ya da 5) */
function proper(r, b) {
  let a;
  do { a = ri(r, 1, b - 1); } while (gcd(a, b) !== 1);
  return a;
}
/* Aralarında asal iki sayı (p < q ya da p ≠ q) */
function coprime(r, lo, hi, less) {
  let p, q;
  do { p = ri(r, lo, hi); q = ri(r, lo + 1, hi + 1); } while (p === q || gcd(p, q) !== 1 || (less && p >= q));
  return [p, q];
}

export const GEN = {
  /* ---------- f-frac ---------- */
  ffrac_part: (r) => {
    if (r() < 0.5) {
      const g = ri(r, 4, 15), b = ri(r, 4, 15);
      return {
        q: `Bir sınıfta $${g}$ kız ve $${b}$ erkek öğrenci var. Kızlar sınıfın kaçta kaçıdır? (kesir olarak yaz)`,
        qe: `A class has $${g}$ girls and $${b}$ boys. What fraction of the class are girls?`,
        ...fr(g, g + b),
      };
    }
    const n = pick(r, [6, 8, 10, 12]), k = ri(r, 1, n - 1);
    return {
      q: `Bir pizza $${n}$ eşit dilime kesildi ve $${k}$ dilimi yendi. Pizzanın kaçta kaçı kaldı?`,
      qe: `A pizza is cut into $${n}$ equal slices and $${k}$ slices are eaten. What fraction of the pizza is left?`,
      ...fr(n - k, n),
    };
  },
  ffrac_equiv: (r) => {
    const b = ri(r, 2, 9), a = proper(r, b), k = ri(r, 2, 6);
    if (r() < 0.5) {
      return {
        q: `$\\tfrac{${a}}{${b}}=\\tfrac{x}{${k * b}}$ ise $x$ kaçtır?`,
        qe: `If $\\tfrac{${a}}{${b}}=\\tfrac{x}{${k * b}}$, find $x$.`,
        ...int(k * a),
      };
    }
    return {
      q: `$\\tfrac{${a}}{${b}}=\\tfrac{${k * a}}{x}$ ise $x$ kaçtır?`,
      qe: `If $\\tfrac{${a}}{${b}}=\\tfrac{${k * a}}{x}$, find $x$.`,
      ...int(k * b),
    };
  },
  ffrac_simplify: (r) => {
    const [p, q] = coprime(r, 1, 8, true);
    const k = ri(r, 2, 9), a = k * p, b = k * q, t = ri(r, 0, 2);
    if (t === 0) return { q: `$\\tfrac{${a}}{${b}}$ kesrini en sade hâline getir. Payı kaç olur?`, qe: `Write $\\tfrac{${a}}{${b}}$ in its lowest terms. What is the numerator?`, ...int(p) };
    if (t === 1) return { q: `$\\tfrac{${a}}{${b}}$ kesrini en sade hâline getir. Paydası kaç olur?`, qe: `Write $\\tfrac{${a}}{${b}}$ in its lowest terms. What is the denominator?`, ...int(q) };
    return {
      q: `$\\tfrac{${a}}{${b}}$ kesrini tek adımda sadeleştirmek için pay ve paydayı hangi sayıya bölmelisin? (EBOB)`,
      qe: `To simplify $\\tfrac{${a}}{${b}}$ in one step, what number should you divide the numerator and denominator by? (HCF)`,
      ...int(k),
    };
  },
  ffrac_mixed: (r) => {
    const c = ri(r, 2, 9), b = proper(r, c), a = ri(r, 1, 6);
    if (r() < 0.6) {
      return {
        q: `$${a}\\tfrac{${b}}{${c}}=\\tfrac{x}{${c}}$ ise $x$ kaçtır?`,
        qe: `If $${a}\\tfrac{${b}}{${c}}=\\tfrac{x}{${c}}$, find $x$.`,
        ...int(a * c + b),
      };
    }
    return {
      q: `$\\tfrac{${a * c + b}}{${c}}$ kesrini tam sayılı kesir olarak yaz. Tam kısmı kaçtır?`,
      qe: `Write $\\tfrac{${a * c + b}}{${c}}$ as a mixed number. What is the whole-number part?`,
      ...int(a),
    };
  },
  ffrac_compare: (r) => {
    let a, b, c, d;
    do { b = ri(r, 2, 12); a = proper(r, b); d = ri(r, 2, 12); c = proper(r, d); } while (a * d === b * c);
    const [p, q] = a * d > b * c ? [a, b] : [c, d];
    return {
      q: `Hangisi daha büyük: $\\tfrac{${a}}{${b}}$ mi, $\\tfrac{${c}}{${d}}$ mi? Büyük olanı yaz.`,
      qe: `Which is bigger, $\\tfrac{${a}}{${b}}$ or $\\tfrac{${c}}{${d}}$? Write the bigger one.`,
      ...fr(p, q),
    };
  },
  ffrac_addsame: (r) => {
    const c = ri(r, 3, 15), a = ri(r, 1, c - 1), b = ri(r, 1, c - 1);
    if (r() < 0.3 && a !== b) {
      const [x, y] = a > b ? [a, b] : [b, a];
      return { q: `$\\tfrac{${x}}{${c}}-\\tfrac{${y}}{${c}}$ kaçtır?`, qe: `Work out $\\tfrac{${x}}{${c}}-\\tfrac{${y}}{${c}}$.`, ...fr(x - y, c) };
    }
    return { q: `$\\tfrac{${a}}{${c}}+\\tfrac{${b}}{${c}}$ kaçtır?`, qe: `Work out $\\tfrac{${a}}{${c}}+\\tfrac{${b}}{${c}}$.`, ...fr(a + b, c) };
  },
  ffrac_add: (r) => {
    let b, d;
    do { b = pick(r, [2, 3, 4, 5, 6, 8, 10]); d = pick(r, [2, 3, 4, 5, 6, 8, 10]); } while (b === d);
    const a = proper(r, b), c = proper(r, d);
    if (r() < 0.4) {
      return {
        q: `Bir tarifte $\\tfrac{${a}}{${b}}$ bardak süt ve $\\tfrac{${c}}{${d}}$ bardak su var. Toplam kaç bardak sıvı var?`,
        qe: `A recipe uses $\\tfrac{${a}}{${b}}$ cup of milk and $\\tfrac{${c}}{${d}}$ cup of water. How many cups of liquid is that in total?`,
        ...fr(a * d + b * c, b * d),
      };
    }
    return { q: `$\\tfrac{${a}}{${b}}+\\tfrac{${c}}{${d}}$ kaçtır?`, qe: `Work out $\\tfrac{${a}}{${b}}+\\tfrac{${c}}{${d}}$.`, ...fr(a * d + b * c, b * d) };
  },
  ffrac_sub: (r) => {
    let a, b, c, d;
    do {
      b = pick(r, [2, 3, 4, 5, 6, 8, 10]); d = pick(r, [2, 3, 4, 5, 6, 8, 10]);
      a = proper(r, b); c = proper(r, d);
    } while (b === d || a * d <= b * c);
    if (r() < 0.4) {
      return {
        q: `Şişede $\\tfrac{${a}}{${b}}$ litre su vardı, $\\tfrac{${c}}{${d}}$ litresini içtin. Kaç litre su kaldı?`,
        qe: `A bottle held $\\tfrac{${a}}{${b}}$ of a litre of water and you drank $\\tfrac{${c}}{${d}}$ of a litre. How many litres are left?`,
        ...fr(a * d - b * c, b * d),
      };
    }
    return { q: `$\\tfrac{${a}}{${b}}-\\tfrac{${c}}{${d}}$ kaçtır?`, qe: `Work out $\\tfrac{${a}}{${b}}-\\tfrac{${c}}{${d}}$.`, ...fr(a * d - b * c, b * d) };
  },
  ffrac_mul: (r) => {
    const b = ri(r, 2, 9), a = proper(r, b), d = ri(r, 2, 9), c = proper(r, d);
    if (r() < 0.4) {
      return {
        q: `Pizzanın $\\tfrac{${a}}{${b}}$${ek(a, "i")} kalmıştı; kalanın $\\tfrac{${c}}{${d}}$${ek(c, "ini")} yedin. Bütün pizzanın ne kadarını yedin?`,
        qe: `$\\tfrac{${a}}{${b}}$ of a pizza was left and you ate $\\tfrac{${c}}{${d}}$ of what was left. What fraction of the whole pizza did you eat?`,
        ...fr(a * c, b * d),
      };
    }
    return { q: `$\\tfrac{${a}}{${b}}\\times\\tfrac{${c}}{${d}}$ kaçtır?`, qe: `Work out $\\tfrac{${a}}{${b}}\\times\\tfrac{${c}}{${d}}$.`, ...fr(a * c, b * d) };
  },
  ffrac_of: (r) => {
    const b = ri(r, 2, 10), a = proper(r, b), m = ri(r, 2, 15), N = b * m;
    if (r() < 0.5) {
      return { q: `$${N}$ sayısının $\\tfrac{${a}}{${b}}$${ek(a, "i")} kaçtır?`, qe: `What is $\\tfrac{${a}}{${b}}$ of $${N}$?`, ...int(a * m) };
    }
    return {
      q: `Sınıftaki $${N}$ öğrencinin $\\tfrac{${a}}{${b}}$${ek(a, "i")} gözlüklü. Kaç öğrenci gözlüklü?`,
      qe: `$\\tfrac{${a}}{${b}}$ of the $${N}$ students in a class wear glasses. How many students wear glasses?`,
      ...int(a * m),
    };
  },
  ffrac_recip: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const n = ri(r, 2, 12);
      return { q: `$${n}$ sayısının çarpmaya göre tersi (reciprocal) kaçtır?`, qe: `What is the reciprocal of $${n}$?`, ...fr(1, n) };
    }
    const [a, b] = coprime(r, 1, 9, false);
    if (t === 1) return { q: `$\\tfrac{${a}}{${b}}$ kesrinin çarpmaya göre tersi (reciprocal) kaçtır?`, qe: `What is the reciprocal of $\\tfrac{${a}}{${b}}$?`, ...fr(b, a) };
    return { q: `$\\tfrac{${a}}{${b}}$ hangi sayıyla çarpılırsa sonuç $1$ olur?`, qe: `What number do you multiply $\\tfrac{${a}}{${b}}$ by to get $1$?`, ...fr(b, a) };
  },
  ffrac_div: (r) => {
    if (r() < 0.5) {
      const b = pick(r, [2, 3, 4, 5]), k = pick(r, [2, 3]), a = proper(r, b), d = b * k;
      return {
        q: `$\\tfrac{${a}}{${b}}$ litre meyve suyunu $\\tfrac{1}{${d}}$ litrelik bardaklara dolduruyorsun. Kaç bardak dolar?`,
        qe: `You pour $\\tfrac{${a}}{${b}}$ of a litre of juice into glasses that each hold $\\tfrac{1}{${d}}$ of a litre. How many glasses can you fill?`,
        ...int(a * k),
      };
    }
    const b = ri(r, 2, 9), a = proper(r, b), d = ri(r, 2, 9), c = proper(r, d);
    return { q: `$\\tfrac{${a}}{${b}}\\div\\tfrac{${c}}{${d}}$ kaçtır?`, qe: `Work out $\\tfrac{${a}}{${b}}\\div\\tfrac{${c}}{${d}}$.`, ...fr(a * d, b * c) };
  },

  /* ---------- f-pct ---------- */
  ffrac_dec: (r) => {
    const b = pick(r, [2, 4, 5, 8, 10, 20, 25, 50]), a = proper(r, b);
    return { q: `$\\tfrac{${a}}{${b}}$ kesrini ondalık sayı olarak yaz.`, qe: `Write $\\tfrac{${a}}{${b}}$ as a decimal.`, ...int(a / b) };
  },
  ffrac_dp: (r) => {
    const I = ri(r, 1, 99), D = 10 * ri(r, 100, 999) + ri(r, 1, 9), n = pick(r, [1, 2]); // son rakam 0 değil
    const R = Math.round((I * 10000 + D) / 10 ** (4 - n)) / 10 ** n;
    return {
      q: `$${I}{,}${D}$ sayısını $${n}$ ondalık basamağa yuvarla.`,
      qe: `Round $${I}.${D}$ to $${n}$ decimal place${n > 1 ? "s" : ""}.`,
      ...fixed(R, n),
    };
  },
  ffrac_pctdec: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const p = pick(r, [5, 8, 12, 15, 20, 25, 35, 40, 45, 60, 75, 120, 150]);
      return { q: `%${p} ondalık sayı olarak nasıl yazılır?`, qe: `Write ${p}% as a decimal.`, ...int(p / 100) };
    }
    if (t === 1) {
      const p = ri(r, 1, 99);
      return { q: `$${num(p / 100)}$ sayısını yüzde olarak yaz. (% kaç?)`, qe: `Write $${en(p / 100)}$ as a percentage.`, ...int(p), unit: "%" };
    }
    const b = pick(r, [2, 4, 5, 10, 20, 25]), a = proper(r, b);
    return { q: `$\\tfrac{${a}}{${b}}$ yüzde kaçtır?`, qe: `Write $\\tfrac{${a}}{${b}}$ as a percentage.`, ...int((a * 100) / b), unit: "%" };
  },
  ffrac_pctof: (r) => {
    const p = pick(r, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75]), N = 20 * ri(r, 1, 30), v = (p * N) / 100;
    if (r() < 0.5) return { q: `$${N}$ sayısının %${p}${ek(p, "i")} kaçtır?`, qe: `What is ${p}% of $${N}$?`, ...int(v) };
    return {
      q: `$${N}$ TL’lik bir üründe %${p} indirim var. İndirim kaç TL’dir?`,
      qe: `An item costs $${N}$ TL and has a ${p}% discount. How much is the discount?`,
      ...int(v), unit: "TL",
    };
  },
  ffrac_pctas: (r) => {
    const y = pick(r, [20, 25, 50]), x = ri(r, 1, y - 1), v = (x * 100) / y;
    if (r() < 0.5) {
      return {
        q: `$${y}$ soruluk bir sınavda $${x}$ soruyu doğru yaptın. Soruların yüzde kaçını doğru yaptın?`,
        qe: `In a test with $${y}$ questions you got $${x}$ right. What percentage of the questions did you get right?`,
        ...int(v), unit: "%",
      };
    }
    return {
      q: `Bir torbada $${y}$ bilye var ve bunların $${x}$ tanesi kırmızı. Bilyelerin yüzde kaçı kırmızı?`,
      qe: `A bag holds $${y}$ marbles and $${x}$ of them are red. What percentage of the marbles are red?`,
      ...int(v), unit: "%",
    };
  },
  ffrac_pctchange: (r) => {
    const old = 20 * ri(r, 1, 25), p = pick(r, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75]), ch = (old * p) / 100;
    if (r() < 0.5) {
      return {
        q: `Bir ürünün fiyatı $${old}$ TL’den $${old + ch}$ TL’ye çıktı. Fiyat yüzde kaç arttı?`,
        qe: `The price of an item rose from $${old}$ TL to $${old + ch}$ TL. What is the percentage increase?`,
        ...int(p), unit: "%",
      };
    }
    return {
      q: `Bir ürünün fiyatı $${old}$ TL’den $${old - ch}$ TL’ye düştü. Fiyat yüzde kaç azaldı?`,
      qe: `The price of an item fell from $${old}$ TL to $${old - ch}$ TL. What is the percentage decrease?`,
      ...int(p), unit: "%",
    };
  },
  ffrac_inc: (r) => {
    const p = pick(r, [5, 10, 15, 20, 25, 30, 40, 50]);
    if (r() < 0.3) return { q: `%${p} artış için çarpan (multiplier) kaçtır?`, qe: `What is the multiplier for a ${p}% increase?`, ...int(1 + p / 100) };
    const N = 20 * ri(r, 1, 50);
    return {
      q: `$${N}$ TL’lik bir ürüne %${p} zam geldi. Yeni fiyatı kaç TL’dir?`,
      qe: `An item costs $${N}$ TL. Its price increases by ${p}%. What is the new price?`,
      ...int(N + (N * p) / 100), unit: "TL",
    };
  },
  ffrac_decr: (r) => {
    const p = pick(r, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75]);
    if (r() < 0.3) return { q: `%${p} azalış için çarpan (multiplier) kaçtır?`, qe: `What is the multiplier for a ${p}% decrease?`, ...int(1 - p / 100) };
    const N = 20 * ri(r, 1, 50);
    return {
      q: `$${N}$ TL’lik bir üründe %${p} indirim var. İndirimli fiyatı kaç TL’dir?`,
      qe: `An item costs $${N}$ TL and has a ${p}% discount. What is the sale price?`,
      ...int(N - (N * p) / 100), unit: "TL",
    };
  },
  ffrac_succ: (r) => {
    const a = pick(r, [10, 20, 25, 50]), b = pick(r, [10, 20, 25, 50]);
    if (r() < 0.5) {
      const N = 400 * ri(r, 1, 5);
      return {
        q: `$${N}$ TL’lik bir ürüne önce %${a} zam yapıldı, sonra yeni fiyat üzerinden %${b} indirim. Son fiyat kaç TL?`,
        qe: `An item costs $${N}$ TL. Its price goes up by ${a}%, then the new price goes down by ${b}%. What is the final price?`,
        ...int((N * (100 + a) * (100 - b)) / 10000), unit: "TL",
      };
    }
    return {
      q: `Bir ürüne önce %${a} zam, sonra yeni fiyat üzerinden %${b} indirim yapıldı. Son fiyat, ilk fiyatın yüzde kaçıdır?`,
      qe: `A price goes up by ${a}%, then the new price goes down by ${b}%. The final price is what percentage of the original price?`,
      ...int(((100 + a) * (100 - b)) / 100), unit: "%",
    };
  },
  ffrac_reverse: (r) => {
    const O = 20 * ri(r, 1, 30), p = pick(r, [5, 10, 15, 20, 25, 30, 40, 50]), ch = (O * p) / 100;
    if (r() < 0.5) {
      return {
        q: `Bir ürüne %${p} zam geldi ve yeni fiyatı $${O + ch}$ TL oldu. Zamdan önceki fiyatı kaç TL’ydi?`,
        qe: `After a ${p}% increase, the price of an item is $${O + ch}$ TL. What was the price before the increase?`,
        ...int(O), unit: "TL",
      };
    }
    return {
      q: `%${p} indirimle $${O - ch}$ TL’ye satılan bir ürünün indirimsiz fiyatı kaç TL’dir?`,
      qe: `An item is sold for $${O - ch}$ TL after a ${p}% discount. What was the original price?`,
      ...int(O), unit: "TL",
    };
  },
  ffrac_ratio: (r) => {
    const [p, q] = coprime(r, 1, 6, false), k = ri(r, 2, 8);
    if (r() < 0.5) {
      return {
        q: `Bir sınıfta kız sayısının erkek sayısına oranı $${p}:${q}$. Sınıfta $${p * k}$ kız varsa kaç erkek vardır?`,
        qe: `In a class the ratio of girls to boys is $${p}:${q}$. If there are $${p * k}$ girls, how many boys are there?`,
        ...int(q * k),
      };
    }
    return {
      q: `Bir limonatada limon suyunun suya oranı $${p}:${q}$. $${q * k}$ bardak su kullanırsan kaç bardak limon suyu gerekir?`,
      qe: `In a lemonade the ratio of lemon juice to water is $${p}:${q}$. If you use $${q * k}$ cups of water, how many cups of lemon juice do you need?`,
      ...int(p * k),
    };
  },
  ffrac_ratiosimp: (r) => {
    const [p, q] = coprime(r, 1, 8, false), k = ri(r, 2, 12), a = p * k, b = q * k;
    if (r() < 0.5) {
      return {
        q: `$${a}:${b}$ oranının en sade hâli $${p}:x$ ise $x$ kaçtır?`,
        qe: `The ratio $${a}:${b}$ in its simplest form is $${p}:x$. Find $x$.`,
        ...int(q),
      };
    }
    return {
      q: `$${a}:${b}$ oranını tek adımda sadeleştirmek için iki tarafı hangi sayıya bölmelisin? (EBOB)`,
      qe: `To simplify the ratio $${a}:${b}$ in one step, what number should you divide both parts by? (HCF)`,
      ...int(k),
    };
  },
  ffrac_share: (r) => {
    let a, b;
    do { a = ri(r, 1, 7); b = ri(r, 1, 7); } while (a === b);
    const m = 10 * ri(r, 1, 30), T = (a + b) * m;
    const [n1, n2] = pick(r, [["Ali", "Can"], ["Ece", "Mert"], ["Elif", "Deniz"]]);
    const first = r() < 0.5;
    const who = first ? n1 : n2;
    return {
      q: `$${T}$ TL, ${n1} ile ${n2} arasında $${a}:${b}$ oranında paylaştırılıyor. ${who} kaç TL alır?`,
      qe: `$${T}$ TL is shared between ${n1} and ${n2} in the ratio $${a}:${b}$. How much does ${who} get?`,
      ...int((first ? a : b) * m), unit: "TL",
    };
  },
  ffrac_direct: (r) => {
    const k = ri(r, 2, 9);
    let x1, x2;
    do { x1 = ri(r, 2, 6); x2 = ri(r, 2, 12); } while (x1 === x2);
    if (r() < 0.5) {
      return {
        q: `$y$, $x$ ile doğru orantılıdır. $x=${x1}$ iken $y=${k * x1}$. $x=${x2}$ iken $y$ kaçtır?`,
        qe: `$y$ is directly proportional to $x$. When $x=${x1}$, $y=${k * x1}$. Find $y$ when $x=${x2}$.`,
        ...int(k * x2),
      };
    }
    const price = 5 * k;
    return {
      q: `$${x1}$ kg elma $${price * x1}$ TL. Aynı elmadan $${x2}$ kg kaç TL?`,
      qe: `$${x1}$ kg of apples cost $${price * x1}$ TL. How much do $${x2}$ kg of the same apples cost?`,
      ...int(price * x2), unit: "TL",
    };
  },
  ffrac_inverse: (r) => {
    const k = pick(r, [12, 18, 24, 30, 36, 48, 60]);
    const divs = [];
    for (let i = 2; i <= k / 2; i++) if (k % i === 0) divs.push(i);
    let w1, w2;
    do { w1 = pick(r, divs); w2 = pick(r, divs); } while (w1 === w2);
    if (r() < 0.5) {
      return {
        q: `$${w1}$ işçi bir işi $${k / w1}$ günde bitiriyor. Aynı hızda çalışan $${w2}$ işçi bu işi kaç günde bitirir?`,
        qe: `$${w1}$ workers finish a job in $${k / w1}$ days. How many days would $${w2}$ workers take, working at the same rate?`,
        ...int(k / w2),
      };
    }
    return {
      q: `$y$, $x$ ile ters orantılıdır. $x=${w1}$ iken $y=${k / w1}$. $x=${w2}$ iken $y$ kaçtır?`,
      qe: `$y$ is inversely proportional to $x$. When $x=${w1}$, $y=${k / w1}$. Find $y$ when $x=${w2}$.`,
      ...int(k / w2),
    };
  },
  ffrac_sfcount: (r) => {
    const k = ri(r, 1, 4);
    let s = String(ri(r, 1, 9));
    for (let i = 1; i < k; i++) s += String(i === k - 1 ? ri(r, 1, 9) : r() < 0.35 ? 0 : ri(r, 1, 9));
    let tr, enS;
    if (k === 1 || r() < 0.55) {
      const z = "0".repeat(ri(r, 1, 3));
      tr = `0{,}${z}${s}`; enS = `0.${z}${s}`;
    } else {
      const m = ri(r, 1, k - 1);
      tr = `${s.slice(0, m)}{,}${s.slice(m)}`; enS = `${s.slice(0, m)}.${s.slice(m)}`;
    }
    return {
      q: `$${tr}$ sayısında kaç anlamlı basamak (significant figure) vardır?`,
      qe: `How many significant figures does $${enS}$ have?`,
      ...int(k),
    };
  },
  ffrac_sf3: (r) => {
    /* Cevap hep 1’den büyük: çok küçük ondalıklarda uygulamanın yuvarlama toleransı yanlış cevabı kabul edebilir. */
    const L = ri(r, 4, 6);
    let s = String(ri(r, 1, 9));
    for (let i = 1; i < L; i++) s += String(i === L - 1 ? ri(r, 1, 9) : ri(r, 0, 9)); // son rakam 0 değil
    const m = ri(r, 1, L); // tam kısmın basamak sayısı
    const R3 = Math.round(Number(s) / 10 ** (L - 3));
    const v = m >= 3 ? R3 * 10 ** (m - 3) : R3 / 10 ** (3 - m);
    const tr = m === L ? group(s) : `${s.slice(0, m)}{,}${s.slice(m)}`;
    const enS = m === L ? group(s) : `${s.slice(0, m)}.${s.slice(m)}`;
    const ans = fixed(v, Math.max(0, 3 - String(Math.floor(v)).length)); // 57,0 gibi: tam 3 anlamlı basamak
    if (r() < 0.5) {
      return {
        q: `$${tr}$ sayısını 3 anlamlı basamağa yuvarla.`,
        qe: `Round $${enS}$ to 3 significant figures.`,
        ...ans,
      };
    }
    return {
      q: `Hesap makinen $${tr}$ gösteriyor. Cevabı IB kuralına göre (3 anlamlı basamak) yaz.`,
      qe: `Your calculator shows $${enS}$. Write the answer as IB expects (3 significant figures).`,
      ...ans,
    };
  },
};
