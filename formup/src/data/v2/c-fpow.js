import { ri, pick, fr, int, num, gcd } from "./genkit.js";

/* FormUp v2 · parça "fpow": f-pow (Üsler, Kökler, Bilimsel Gösterim) + f-alg (Cebir Temelleri)
   Kartlar öğretme sırasıyla (kolaydan zora). Biçim: content/SPEC.md */

export const CARDS = String.raw`
## f-pow

# f-pow-meaning | 3 | Üs ne demek? | What a power means
L a^n
R \underbrace{a\times a\times\cdots\times a}_{n}
X n\times a ;; \underbrace{a+a+\cdots+a}_{n} ;; \underbrace{n\times n\times\cdots\times n}_{a}
K $a$: taban, $n$: üs (kaç tane $a$ çarpılacağı). $a^2$: $a$’nın karesi, $a^3$: $a$’nın küpü, $a^1=a$.
KE $a$: base, $n$: exponent (also called power or index), the number of copies of $a$ multiplied together. $a^2$ is "a squared", $a^3$ is "a cubed", and $a^1=a$.
U Aynı sayıyla tekrar tekrar çarpmayı kısa yoldan yazar.
UE A short way to write repeated multiplication by the same number.
W $2^5$ yazmak, $2\times 2\times 2\times 2\times 2$ yazmaktan çok daha kısa. Üs tabanı toplamaz, kendisiyle çarpar: $2^3=8$, $6$ değil.
WE Writing $2^5$ is much shorter than $2\times 2\times 2\times 2\times 2$. The exponent counts multiplications, not additions: $2^3=8$, not $6$.
E $3^4=3\times 3\times 3\times 3=81$. $10^3=1000$ ($1$’in arkasına $3$ sıfır). $(-2)^3=(-2)(-2)(-2)=-8$.
H Üs, “kaç tane taban çarpılıyor?” sorusunun cevabıdır: $2^3\ne 2\cdot 3$.
T base = taban ;; exponent (power, index) = üs ;; squared = karesi alınmış
Q Bir bakteri her saat ikiye bölünüyor. Tek bir bakteriyle başlarsan 5 saat sonra kaç bakteri olur?
QE A bacterium splits into two every hour. Starting with one bacterium, how many are there after 5 hours?
B \underbrace{a\times a\times\cdots\times a}_{[[n]]} || n-1 ;; a ;; 2n
C a=2:-10:10:1 ; n=3:1:10:1 => a^n
CT @a@^{@n@}=@=@
G fpow_eval
LAB power
S Efsaneye göre satrancın mucidi ödül olarak ilk kareye 1, sonraki her kareye öncekinin 2 katı pirinç istedi. Son karede $2^{63}$, yani yaklaşık $9\times 10^{18}$ tane pirinç olurdu!

# f-pow-neg-square | 3 | $-3^2$ mi, $(-3)^2$ mi? | $-3^2$ versus $(-3)^2$
L -3^2
R -9
X 9 ;; -6 ;; 6
K Üs yalnızca hemen solundaki sayıya etki eder. Eksi işaretinin de üsse girmesi için parantez gerekir: $(-3)^2=9$.
KE An exponent applies only to the number directly before it. To include the minus sign you need brackets: $(-3)^2=9$.
U Hesapta en sık yapılan işaret hatalarından birini önler.
UE Prevents one of the most common sign mistakes in calculations.
W $-3^2$ demek $-(3^2)=-9$ demektir: önce üs, sonra eksi. $(-3)^2$ ise $(-3)\times(-3)=9$ eder.
WE $-3^2$ means $-(3^2)=-9$: the power is done first, then the minus. But $(-3)^2=(-3)\times(-3)=9$.
E $-5^2=-25$ ama $(-5)^2=25$. Tek üste ikisi aynı çıkar: $-2^3=-8$ ve $(-2)^3=-8$.
H Parantez yoksa eksi, üssün içine giremez.
T brackets (parentheses) = parantez ;; negative number = negatif sayı ;; order of operations = işlem önceliği
Q Hesap makinesine $-3^2$ yazdın ve $-9$ çıktı. Arkadaşın sonucun $9$ olması gerektiğini söylüyor. Kim haklı?
QE You type $-3^2$ into your calculator and get $-9$. Your friend says the answer should be $9$. Who is right?
C a=3:1:12:1 => -(a^2)
CT -@a@^2=-(@a@\times @a@)=@=@
G fpow_negsq
LAB numberline
V -

# f-pow-product | 3 | Aynı tabanlı üsleri çarpma | Multiplying powers with the same base
L a^m\times a^n
R a^{m+n}
X a^{mn} ;; (a^2)^{m+n} ;; 2a^{m+n}
K Tabanlar aynı olmalı. $2^3\times 5^4$ gibi farklı tabanlarda bu kural kullanılamaz.
KE The bases must be the same. You cannot use this rule for different bases, such as $2^3\times 5^4$.
U Aynı tabanlı iki kuvvetin çarpımını tek bir kuvvet olarak yazar.
UE Writes a product of two powers with the same base as a single power.
W $2^3\times 2^4=(2\cdot 2\cdot 2)\times(2\cdot 2\cdot 2\cdot 2)$: toplam $3+4=7$ tane $2$ çarpılıyor. Üsler toplanır, taban aynen kalır.
WE $2^3\times 2^4$ is three 2s times four 2s, so seven 2s in total: add the exponents and keep the base.
E $2^3\times 2^4=2^7=128$. $x^5\times x=x^{5+1}=x^6$ (yalnız duran $x$’in üssü $1$’dir).
H Çarpmada üsler toplanır, taban aynı kalır.
T laws of exponents = üs kuralları ;; product = çarpım
Q Bir ekranda $2^3$ satır var ve her satırda $2^4$ piksel bulunuyor. Toplam piksel sayısını $2$’nin tek bir kuvveti olarak yaz.
QE A screen has $2^3$ rows with $2^4$ pixels in each row. Write the total number of pixels as a single power of $2$.
B a^{[[m+n]]} || mn ;; m-n
C a=2:1:10:1 ; m=3:0:6:1 ; n=4:0:6:1 => a^(m+n)
CT @a@^{@m@}\times @a@^{@n@}=@a@^{@m@+@n@}=@=@
G fpow_prod
LAB power
V a:0.5:3,m:-2:3,n:-2:3

# f-pow-quotient | 3 | Aynı tabanlı üsleri bölme | Dividing powers with the same base
L \dfrac{a^m}{a^n}
R a^{m-n}
X a^{\frac{m}{n}} ;; a^{m+n} ;; a^{n-m}
K $a\ne 0$ ve tabanlar aynı olmalı. Sonuçta üs negatif çıkabilir: $\tfrac{2^3}{2^5}=2^{-2}$.
KE $a\ne 0$ and the bases must be the same. The answer may have a negative exponent: $\tfrac{2^3}{2^5}=2^{-2}$.
U Aynı tabanlı iki kuvvetin bölümünü tek bir kuvvet olarak yazar.
UE Writes a quotient of two powers with the same base as a single power.
W $\tfrac{2^5}{2^3}=\tfrac{2\cdot 2\cdot 2\cdot 2\cdot 2}{2\cdot 2\cdot 2}$: alttaki üç $2$, üsttekilerle sadeleşir ve $5-3=2$ tane kalır. Bölmede üsler çıkarılır.
WE In $\tfrac{2^5}{2^3}$ three 2s cancel, leaving $5-3=2$ of them: subtract the exponents.
E $\tfrac{5^7}{5^4}=5^3=125$. $\tfrac{x^9}{x^3}=x^6$ ($x^3$ değil: üsler bölünmez, çıkarılır).
H Bölmede üsler çıkarılır: üstteki eksi alttaki.
T quotient = bölüm ;; cancel = sadeleştirmek
Q $10^6$ TL, $10^2$ kişiye eşit olarak paylaştırılıyor. Kişi başına düşen parayı $10$’un tek bir kuvveti olarak yaz.
QE $10^6$ TL is shared equally among $10^2$ people. Write each person’s share as a single power of $10$.
B a^{[[m-n]]} || n-m ;; m+n
C a=2:1:10:1 ; m=7:0:10:1 ; n=4:0:10:1 => a^(m-n)
CT \dfrac{@a@^{@m@}}{@a@^{@n@}}=@a@^{@m@-@n@}=@=@
G fpow_quot
LAB power
V a:0.5:3,m:-2:3,n:-2:3

# f-pow-power | 3 | Üssün üssü | Power of a power
L (a^m)^n
R a^{mn}
X a^{m+n} ;; a^{m^n} ;; ma^n
K $(a^m)^n$ ile $a^{m^n}$ farklıdır: $(2^3)^2=2^6=64$ ama $2^{3^2}=2^9=512$.
KE $(a^m)^n$ is not the same as $a^{m^n}$: $(2^3)^2=2^6=64$ but $2^{3^2}=2^9=512$.
U Bir kuvvetin tekrar kuvvetini alırken işi tek adımda bitirir.
UE Raises a power to another power in one step.
W $(2^3)^2=2^3\times 2^3$: toplam $3+3=2\times 3=6$ tane $2$ var. Aynı sayıyı tekrar tekrar toplamak çarpma olduğu için üsler çarpılır.
WE $(2^3)^2=2^3\times 2^3$, which is $3+3=2\times 3$ twos in total, so the exponents multiply.
E $(3^2)^3=3^6=729$. $(x^4)^5=x^{20}$. $4^3=(2^2)^3=2^6$.
H Parantezin dışındaki üs içeriyi çarpar: içteki × dıştaki.
T power = kuvvet ;; cubed = küpü alınmış
Q Bir küpün bir kenarı $5^2$ cm. Küpün hacmini $5$’in tek bir kuvveti olarak yaz.
QE The edge of a cube is $5^2$ cm long. Write the volume of the cube as a single power of $5$.
B a^{[[mn]]} || m+n ;; m^n
C a=2:1:5:1 ; m=3:0:4:1 ; n=2:0:4:1 => a^(m*n)
CT (@a@^{@m@})^{@n@}=@a@^{@m@\cdot @n@}=@=@
G fpow_powpow
LAB power
V a:0.5:3,m:0.5:3,n:0.5:3

# f-pow-zero | 3 | Sıfırıncı kuvvet | The zero exponent
L a^0
R 1
X 0 ;; a ;; ~Tanımsız (undefined)
K $a\ne 0$. Negatif tabanda da geçerli: $(-7)^0=1$. Ama $-7^0=-1$, çünkü eksi dışarıda kalır.
KE $a\ne 0$. It also works for negative bases: $(-7)^0=1$. But $-7^0=-1$, because the minus sign stays outside.
U Üssü sıfır olan her kuvvetin değerini anında verir.
UE Gives the value of any power whose exponent is zero.
W $\tfrac{a^3}{a^3}$ bir yandan $1$’dir (her sayı bölü kendisi), öbür yandan bölme kuralıyla $a^{3-3}=a^0$’dır. Demek ki $a^0=1$.
WE $\tfrac{a^3}{a^3}$ equals $1$, and by the quotient rule it also equals $a^{3-3}=a^0$. So $a^0=1$.
E $2026^0=1$, $(-5)^0=1$, $5\times 3^0=5\times 1=5$.
H Sıfırıncı kuvvette herkes $1$ olur (taban $0$ hariç).
T zero exponent = sıfır üs ;; undefined = tanımsız
Q Hesap makinen $2026^0$ için $1$ gösteriyor. Arkadaşın sonucun $0$ olması gerektiğini düşünüyor. Hangi kural haklı olanı gösterir?
QE Your calculator gives $1$ for $2026^0$. Your friend thinks it should be $0$. Which rule shows who is right?
C a=5:1:20:1 ; n=3:0:6:1 => a^n/a^n
CT \dfrac{@a@^{@n@}}{@a@^{@n@}}=@a@^{@n@-@n@}=@a@^0=@=@
G fpow_zero
LAB power
V a

# f-pow-negative | 3 | Negatif üs | Negative exponents
L a^{-n}
R \dfrac{1}{a^{n}}
X -a^{n} ;; -\dfrac{1}{a^{n}} ;; a^{\frac{1}{n}}
K $a\ne 0$. Negatif üs sonucu negatif yapmaz, tabanı ters çevirir: $2^{-3}=\tfrac18$, $-8$ değil.
KE $a\ne 0$. A negative exponent does not make the answer negative; it gives the reciprocal: $2^{-3}=\tfrac18$, not $-8$.
U Negatif üslü bir kuvveti kesir olarak yazar.
UE Rewrites a power with a negative exponent as a fraction.
W Üs $1$ azalınca sonuç tabana bölünür: $2^2=4$, $2^1=2$, $2^0=1$, $2^{-1}=\tfrac12$, $2^{-2}=\tfrac14$. Örüntü sıfırın altında da devam eder.
WE Each time the exponent goes down by 1 you divide by the base: $2^1=2$, $2^0=1$, $2^{-1}=\tfrac12$, $2^{-2}=\tfrac14$.
E $5^{-2}=\tfrac{1}{25}$. $10^{-3}=\tfrac{1}{1000}=0{,}001$. $\left(\tfrac{2}{3}\right)^{-1}=\tfrac{3}{2}$.
H Eksi üs “bir bölü” demektir: kesri ters çevir.
T negative exponent = negatif üs ;; reciprocal = çarpmaya göre ters
Q Bir milimetre $10^{-3}$ metredir. Bunu kesir olarak nasıl yazarsın?
QE One millimetre is $10^{-3}$ metres. How do you write this as a fraction?
B \dfrac{[[1]]}{a^{[[n]]}} || -1 ;; -n ;; a
C a=2:1:10:1 ; n=3:0:6:1 => a^n
CT @a@^{-@n@}=\dfrac{1}{@a@^{@n@}}=\dfrac{1}{@=@}
G fpow_neg
LAB power
V a:0.5:3,n:0.5:3

# f-pow-product-power | 2 | Çarpımın kuvveti | Power of a product
L (ab)^n
R a^{n}b^{n}
X ab^{n} ;; a^{n}+b^{n} ;; nab
K Üs, parantezin içindeki her çarpana gider. Toplamada çalışmaz: $(a+b)^2\ne a^2+b^2$.
KE The exponent applies to every factor inside the brackets. It does not work for sums: $(a+b)^2\ne a^2+b^2$.
U Bir çarpımın kuvvetini, her çarpanın ayrı kuvvetine ayırır.
UE Splits the power of a product into a product of powers.
W $(2x)^3=2x\cdot 2x\cdot 2x=(2\cdot 2\cdot 2)(x\cdot x\cdot x)=8x^3$. Çarpmada sıra önemli olmadığı için sayılar ve harfler ayrı gruplanır.
WE $(2x)^3=2x\cdot 2x\cdot 2x=8x^3$: you can regroup the numbers and the letters because order does not matter in multiplication.
E $(3x)^2=9x^2$ ($3x^2$ değil!). $2^5\times 5^5=(2\times 5)^5=10^5$.
H Üs, parantezin içindeki herkese tek tek uğrar.
T factor = çarpan ;; brackets = parantez
Q Bir küpün bir kenarı $2x$ cm. Hacmini $x$ cinsinden parantezsiz yaz.
QE The edge of a cube is $2x$ cm long. Write its volume in terms of $x$ without brackets.
B a^{n}[[b^{n}]] || b ;; nb
C a=2:1:10:1 ; b=5:1:10:1 ; n=3:0:5:1 => (a*b)^n
CT (@a@\times @b@)^{@n@}=@a@^{@n@}\times @b@^{@n@}=@=@
G fpow_prodpow
V a,b,n

# f-pow-quotient-power | 2 | Kesrin kuvveti | Power of a fraction
L \left(\dfrac{a}{b}\right)^{n}
R \dfrac{a^{n}}{b^{n}}
X \dfrac{a^{n}}{b} ;; \dfrac{a}{b^{n}} ;; \dfrac{b^{n}}{a^{n}}
K $b\ne 0$. Negatif üste önce kesri ters çevir: $\left(\tfrac{a}{b}\right)^{-n}=\left(\tfrac{b}{a}\right)^{n}$.
KE $b\ne 0$. For a negative exponent, flip the fraction first: $\left(\tfrac{a}{b}\right)^{-n}=\left(\tfrac{b}{a}\right)^{n}$.
U Bir kesrin kuvvetini, pay ve paydanın ayrı ayrı kuvveti olarak hesaplar.
UE Works out the power of a fraction by raising the numerator and the denominator separately.
W $\left(\tfrac23\right)^2=\tfrac23\cdot\tfrac23=\tfrac{2\cdot 2}{3\cdot 3}=\tfrac49$. Kesir çarparken pay payla, payda paydayla çarpılır; bu yüzden üs ikisine de gider.
WE $\left(\tfrac23\right)^2=\tfrac23\cdot\tfrac23=\tfrac49$: numerators multiply together and denominators multiply together, so both get the power.
E $\left(\tfrac12\right)^3=\tfrac18$. $\left(\tfrac{3}{2}\right)^{-2}=\left(\tfrac{2}{3}\right)^{2}=\tfrac{4}{9}$.
H Üs hem üste hem alta çıkar.
T numerator = pay ;; denominator = payda
Q Bir fotoğrafın her kenarı, eski uzunluğunun $\tfrac{2}{3}$ katı olacak şekilde küçültülüyor. Yeni alan, eski alanın kaç katıdır?
QE Every side of a photo is scaled to $\tfrac{2}{3}$ of its length. What fraction of the original area is the new area?
B \dfrac{a^{n}}{[[b^{n}]]} || b ;; nb
C a=2:1:10:1 ; b=3:1:10:1 ; n=2:0:5:1 => (a/b)^n
CT \left(\dfrac{@a@}{@b@}\right)^{@n@}=\dfrac{@a@^{@n@}}{@b@^{@n@}}\approx @=@
G fpow_quotpow
V a,b,n

# f-pow-sqrt | 3 | Karekök ne demek? | What a square root means
L \sqrt{a}=b
O \iff
R ~$b^2=a$ ve $b\ge 0$
X ~$2b=a$ ;; ~$b=a^2$ ;; ~$b^2=a$ ve $b$ negatif de olabilir
K $a\ge 0$ olmalı. $\sqrt{\ }$ sembolü her zaman negatif olmayan kökü verir: $\sqrt{9}=3$ ($-3$ değil).
KE $a\ge 0$. $\sqrt{a}=b$ means $b^2=a$ and $b\ge 0$: the symbol $\sqrt{\ }$ always gives the non-negative root, so $\sqrt{9}=3$, not $-3$.
U Karesi verilen sayıyı bulur; kare almayı geri alır.
UE Finds the number whose square is $a$, so it undoes squaring.
W Karekök, kare almanın tersidir: $7^2=49$ olduğu için $\sqrt{49}=7$. $(-7)^2$ de $49$ eder ama $\sqrt{\ }$ sembolü yalnızca pozitif olanı seçer.
WE Square rooting undoes squaring: $7^2=49$, so $\sqrt{49}=7$. $(-7)^2$ is also $49$, but the symbol picks only the non-negative root.
E $\sqrt{64}=8$, $\sqrt{1}=1$, $\sqrt{0}=0$. $\sqrt{-4}$ bir gerçek sayı değildir.
H Kare alır, karekök geri verir.
T square root = karekök ;; perfect square = tam kare ;; non-negative = negatif olmayan
Q Alanı $49\text{ m}^2$ olan kare bir odanın bir kenarı kaç metre?
QE A square room has an area of $49\text{ m}^2$. How long is one side?
C b=7:0:20:1 => b^2
CT @b@^2=@=@\;\Rightarrow\;\sqrt{@=@}=@b@
G fpow_sqrt

# f-pow-root | 3 | Kesirli üs ve $n$. dereceden kök | Fractional exponents and the nth root
L a^{\frac{1}{n}}
R \sqrt[n]{a}
X \dfrac{a}{n} ;; \dfrac{1}{a^{n}} ;; n\sqrt{a}
K $a^{\frac12}=\sqrt{a}$. $n$ çift ise $a\ge 0$ olmalı. $\sqrt[n]{a}$: $n$. kuvveti $a$ olan sayı.
KE $a^{\frac12}=\sqrt{a}$. If $n$ is even, $a\ge 0$. $\sqrt[n]{a}$ is the number whose $n$th power is $a$.
U Üssü $\tfrac1n$ olan bir kuvveti köke çevirir.
UE Turns an exponent of the form $\tfrac1n$ into a root.
W $\left(a^{\frac13}\right)^3=a^{\frac13\cdot 3}=a^1=a$. Küpü $a$ olan sayı, $a$’nın küp köküdür; yani $a^{\frac13}=\sqrt[3]{a}$.
WE $\left(a^{\frac13}\right)^3=a^1=a$, so $a^{\frac13}$ is the number whose cube is $a$: the cube root.
E $9^{\frac12}=\sqrt9=3$. $27^{\frac13}=\sqrt[3]{27}=3$. $16^{\frac14}=2$, çünkü $2^4=16$.
H Üssün paydası, kökün derecesi olur.
T cube root = küp kök ;; nth root = $n$. dereceden kök ;; rational exponent = kesirli üs
Q Hacmi $27\text{ cm}^3$ olan bir küpün bir kenarı kaç cm?
QE A cube has a volume of $27\text{ cm}^3$. How long is one edge?
B \sqrt[ [[n]] ]{a} || 2 ;; a ;; \frac{1}{n}
C a=8:0:100:1 ; n=3:2:6:1 => a^(1/n)
CT @a@^{\frac{1}{@n@}}=\sqrt[@n@]{@a@}\approx @=@
G fpow_root
V a:0.5:3,n:int:2:5

# f-pow-frac-exp | 2 | Üssü kesir olan sayılar | Exponents of the form $\tfrac{m}{n}$
L a^{\frac{m}{n}}
R \left(\sqrt[n]{a}\right)^{m}
X \sqrt[m]{a^{n}} ;; \dfrac{a^{m}}{n} ;; a^{m-n}
K $a>0$. Payda ($n$) kökün derecesi, pay ($m$) kuvvettir. Aynı sonuç: $\sqrt[n]{a^m}$. Önce kökü almak sayıları küçük tutar.
KE $a>0$. The denominator $n$ gives the root and the numerator $m$ gives the power. It equals $\sqrt[n]{a^m}$ too; taking the root first keeps the numbers small.
U Üssü kesir olan bir sayıyı hesap makinesiz hesaplamanı sağlar.
UE Lets you evaluate a number with a fractional exponent without a calculator.
W Üssün üssü kuralıyla $a^{\frac{m}{n}}=\left(a^{\frac1n}\right)^m$. $a^{\frac1n}$ zaten $\sqrt[n]{a}$ demektir.
WE By the power of a power rule, $a^{\frac{m}{n}}=\left(a^{\frac1n}\right)^m$, and $a^{\frac1n}$ is $\sqrt[n]{a}$.
E $8^{\frac23}=\left(\sqrt[3]{8}\right)^2=2^2=4$. $4^{\frac32}=\left(\sqrt{4}\right)^3=2^3=8$. $25^{-\frac12}=\tfrac{1}{\sqrt{25}}=\tfrac15$.
H Payda kök, pay kuvvet: önce kök, sonra kuvvet.
T root = kök ;; power = kuvvet
Q Hesap makinesi olmadan $8^{\frac{2}{3}}$ değerini bulman gerekiyor. Nereden başlarsın?
QE You need to find $8^{\frac{2}{3}}$ without a calculator. Where do you start?
B \left(\sqrt[ [[n]] ]{a}\right)^{[[m]]} || mn ;; m+n ;; 2
C a=8:0:100:1 ; m=2:1:6:1 ; n=3:2:6:1 => a^(m/n)
CT @a@^{\frac{@m@}{@n@}}=\left(\sqrt[@n@]{@a@}\right)^{@m@}\approx @=@
G fpow_ratexp
V a:0.5:3,m:int:1:5,n:int:2:5

# f-pow-sqrt-product | 3 | Kökleri çarpma | Multiplying square roots
L \sqrt{a}\times\sqrt{b}
R \sqrt{ab}
X \sqrt{a+b} ;; ab ;; 2\sqrt{ab}
K $a\ge 0$, $b\ge 0$. Toplamada çalışmaz: $\sqrt{9}+\sqrt{16}=7$ ama $\sqrt{9+16}=5$.
KE $a\ge 0$, $b\ge 0$. It does not work for addition: $\sqrt{9}+\sqrt{16}=7$ but $\sqrt{9+16}=5$.
U İki kökün çarpımını tek bir kökün altında birleştirir.
UE Combines a product of two square roots into one square root.
W $\sqrt{a}=a^{\frac12}$ olduğu için bu, çarpımın kuvveti kuralıdır: $a^{\frac12}b^{\frac12}=(ab)^{\frac12}$.
WE Since $\sqrt{a}=a^{\frac12}$, this is just the power of a product rule: $a^{\frac12}b^{\frac12}=(ab)^{\frac12}$.
E $\sqrt{2}\times\sqrt{8}=\sqrt{16}=4$. $\sqrt{3}\times\sqrt{3}=\sqrt9=3$.
H Kökler çarpışınca tek çatı altında birleşir.
T square root = karekök ;; surd = köklü sayı (irrasyonel kök)
Q Bir dikdörtgenin kenarları $\sqrt{2}$ cm ve $\sqrt{8}$ cm. Alanı kaç $\text{cm}^2$?
QE A rectangle has sides of $\sqrt{2}$ cm and $\sqrt{8}$ cm. What is its area?
B \sqrt{[[ab]]} || a+b ;; 2ab
C a=2:0:50:1 ; b=8:0:50:1 => sqrt(a*b)
CT \sqrt{@a@}\times\sqrt{@b@}=\sqrt{@a@\times @b@}\approx @=@
G fpow_sqrtmul
V a,b

# f-pow-sqrt-quotient | 2 | Kesrin karekökü | Square root of a fraction
L \sqrt{\dfrac{a}{b}}
R \dfrac{\sqrt{a}}{\sqrt{b}}
X \dfrac{\sqrt{a}}{b} ;; \dfrac{a}{\sqrt{b}} ;; \sqrt{a}-\sqrt{b}
K $a\ge 0$, $b>0$. Karekök hem paya hem paydaya ayrı ayrı uygulanır.
KE $a\ge 0$, $b>0$. Take the square root of the numerator and of the denominator separately.
U Bir kesrin karekökünü, pay ve paydanın kökü olarak hesaplar.
UE Finds the square root of a fraction by rooting the top and the bottom separately.
W Bu, kesrin kuvveti kuralının $\tfrac12$ üslü hâlidir: $\left(\tfrac{a}{b}\right)^{\frac12}=\tfrac{a^{\frac12}}{b^{\frac12}}$.
WE It is the power of a fraction rule with exponent $\tfrac12$.
E $\sqrt{\tfrac{9}{16}}=\tfrac{3}{4}$. $\sqrt{\tfrac{25}{4}}=\tfrac{5}{2}$. $\tfrac{\sqrt{50}}{\sqrt{2}}=\sqrt{25}=5$.
H Kök kesre girince ikiye ayrılır: biri üste, biri alta.
T fraction = kesir ;; square root = karekök
Q Alanı $\tfrac{9}{16}\text{ m}^2$ olan kare bir fayansın bir kenarı kaç metre?
QE A square tile has an area of $\tfrac{9}{16}\text{ m}^2$. How long is one side?
B \dfrac{\sqrt{a}}{[[\sqrt{b}]]} || b ;; \sqrt{a} ;; b^2
C a=9:0:100:1 ; b=16:1:100:1 => sqrt(a/b)
CT \sqrt{\dfrac{@a@}{@b@}}=\dfrac{\sqrt{@a@}}{\sqrt{@b@}}\approx @=@
G fpow_sqrtdiv
V a,b

# f-pow-surd | 3 | Kökü sadeleştirme | Simplifying surds
L \sqrt{a^2b}
R a\sqrt{b}
X a^2\sqrt{b} ;; \sqrt{a}\,b ;; a+\sqrt{b}
K $a\ge 0$, $b\ge 0$. Kökün içinden en büyük tam kare çarpanı ($4, 9, 16, 25, 36, \dots$) ayır; onun kökü dışarı çıkar.
KE $a\ge 0$, $b\ge 0$. Split off the largest perfect square factor ($4, 9, 16, 25, 36, \dots$); its square root comes outside.
U Bir kökü, IB’nin istediği en sade biçimde yazar.
UE Writes a surd in its simplest form, as IB expects.
W Kökleri çarpma kuralıyla $\sqrt{a^2b}=\sqrt{a^2}\times\sqrt{b}=a\sqrt{b}$. Tam kare olan çarpan kökten kurtulur.
WE Using the product rule for roots, $\sqrt{a^2b}=\sqrt{a^2}\times\sqrt{b}=a\sqrt{b}$: the square factor escapes the root.
E $\sqrt{12}=\sqrt{4\cdot 3}=2\sqrt3$. $\sqrt{50}=\sqrt{25\cdot 2}=5\sqrt2$. $\sqrt{72}=\sqrt{36\cdot 2}=6\sqrt2$.
H Tam kare kaçar, kalan içeride kalır.
T simplest surd form = en sade kök biçimi ;; perfect square = tam kare
Q IB sınavında cevabın $\sqrt{72}$ çıktı ama soru cevabı en sade kök biçiminde istiyor. Ne yazarsın?
QE Your answer in an IB exam is $\sqrt{72}$, but the question asks for it in simplest surd form. What do you write?
B [[a]]\sqrt{[[b]]} || a^2 ;; 2 ;; ab
C a=2:1:10:1 ; b=3:1:10:1 => a*sqrt(b)
CT \sqrt{@a@^2\times @b@}=@a@\sqrt{@b@}\approx @=@
G fpow_surd
V a,b

# f-pow-rationalize | 2 | Paydayı kökten kurtarma | Rationalizing the denominator
L \dfrac{1}{\sqrt{a}}
R \dfrac{\sqrt{a}}{a}
X \sqrt{a} ;; \dfrac{1}{a} ;; \dfrac{\sqrt{a}}{a^{2}}
K $a>0$. Pay ve paydayı $\sqrt{a}$ ile çarp; $\sqrt{a}\times\sqrt{a}=a$ olduğu için payda kökten kurtulur.
KE $a>0$. Multiply the numerator and the denominator by $\sqrt{a}$; since $\sqrt{a}\times\sqrt{a}=a$, the root leaves the denominator.
U Paydasında kök olan bir kesri, paydası kök içermeyecek şekilde yazar.
UE Rewrites a fraction so that there is no root in the denominator.
W Pay ve paydayı aynı sayıyla çarpmak kesrin değerini değiştirmez. O sayı $\sqrt{a}$ olursa payda $\sqrt{a}\cdot\sqrt{a}=a$ olur.
WE Multiplying top and bottom by the same number keeps the value; choosing $\sqrt{a}$ turns the denominator into $a$.
E $\tfrac{1}{\sqrt5}=\tfrac{\sqrt5}{5}$. $\tfrac{6}{\sqrt3}=\tfrac{6\sqrt3}{3}=2\sqrt3$.
H Paydadaki kökü, kendisiyle çarparak kurtar.
T rationalize the denominator = paydayı rasyonel yapmak ;; denominator = payda
Q Cevabın $\tfrac{6}{\sqrt{3}}$ çıktı ama IB paydada kök bırakmamanı istiyor. Nasıl yazarsın?
QE Your answer is $\tfrac{6}{\sqrt{3}}$, but IB wants no root in the denominator. How do you write it?
B \dfrac{\sqrt{a}}{[[a]]} || \sqrt{a} ;; a^2 ;; 1
C a=5:1:50:1 => 1/sqrt(a)
CT \dfrac{1}{\sqrt{@a@}}=\dfrac{\sqrt{@a@}}{@a@}\approx @=@
G fpow_rat
V a

# f-pow-sf | 3 | Bilimsel gösterim | Standard form (scientific notation)
L a\times 10^{k}
O :
R ~$1\le a<10$ ve $k$ bir tam sayı
X ~$0<a<1$ ve $k$ bir tam sayı ;; ~$1\le a\le 10$ ve $k$ herhangi bir sayı ;; ~$a$ herhangi bir sayı ve $k>0$
K Büyük sayılarda $k$ pozitif, $0$ ile $1$ arasındaki sayılarda $k$ negatiftir. $k$, virgülün kaç basamak kaydığını söyler.
KE The form $a\times 10^{k}$, where $1\le a<10$ and $k\in\mathbb{Z}$ ($k$ is an integer). For large numbers $k>0$; for numbers between $0$ and $1$, $k<0$.
U Çok büyük ve çok küçük sayıları kısa ve okunaklı yazar.
UE Writes very large and very small numbers in a short, readable way.
W $45\,000=4{,}5\times 10\,000=4{,}5\times 10^4$: virgül $4$ basamak sola kaydı. Virgülden önce sıfır olmayan tek bir rakam kalır, gerisini $10$’un kuvveti taşır.
WE $45\,000=4.5\times 10^4$ because the decimal point moves 4 places. One non-zero digit stays before the point and the power of 10 does the rest.
E $45\,000=4{,}5\times 10^{4}$. $0{,}0032=3{,}2\times 10^{-3}$. $32\times 10^{3}$ bilimsel gösterim değildir ($32\ge 10$); doğrusu $3{,}2\times 10^{4}$.
H Virgülden önce tek bir rakam (sıfır olmayan), gerisi $10$’un işi.
T standard form = bilimsel gösterim ;; scientific notation = bilimsel gösterim ;; integer = tam sayı
Q Dünya ile Güneş arasındaki uzaklık yaklaşık $150\,000\,000$ km. Bu sayıyı IB’nin kullandığı kısa biçimde nasıl yazarsın?
QE The distance from the Earth to the Sun is about $150\,000\,000$ km. How do you write this number in the short form used by IB?
C a=4.5:1:9.9:0.1 ; k=4:0:9:1 => a*10^k
CT @a@\times 10^{@k@}=@=@
G fpow_sf

# f-pow-sf-multiply | 2 | Bilimsel gösterimde çarpma | Multiplying numbers in standard form
L (a\times 10^{m})\times(b\times 10^{n})
R (ab)\times 10^{m+n}
X ab\times 10^{mn} ;; (a+b)\times 10^{m+n} ;; ab\times 100^{m+n}
K Sonuçta $ab\ge 10$ çıkarsa bir adım daha var: $12\times 10^{5}=1{,}2\times 10^{6}$ (virgül bir sola, üs bir yukarı).
KE If $ab\ge 10$, adjust once more: $12\times 10^{5}=1.2\times 10^{6}$ (the point moves one place left and the exponent goes up by 1).
U Bilimsel gösterimdeki iki sayıyı hesap makinesiz çarpar.
UE Multiplies two numbers in standard form without a calculator.
W Çarpmada sıra önemli değildir: sayıları kendi aralarında, $10$’un kuvvetlerini kendi aralarında çarp. $10^m\times 10^n=10^{m+n}$ (aynı tabanlı çarpma).
WE Multiplication can be done in any order: multiply the numbers, then multiply the powers of 10 by adding the exponents.
E $(3\times 10^4)\times(2\times 10^5)=6\times 10^9$. $(5\times 10^3)\times(4\times 10^{-1})=20\times 10^2=2\times 10^3$.
H Sayılar çarpılır, üsler toplanır; sonra $a$’yı $1$ ile $10$ arasına geri getir.
T standard form = bilimsel gösterim ;; exponent = üs
Q Işık saniyede yaklaşık $3\times 10^{5}$ km yol alır. Güneş’ten çıkan ışık bize yaklaşık $5\times 10^{2}$ saniyede ulaşıyor. Güneş bize kaç km uzakta?
QE Light travels about $3\times 10^{5}$ km per second. Light from the Sun reaches us in about $5\times 10^{2}$ seconds. How far away is the Sun?
B (ab)\times 10^{[[m+n]]} || mn ;; m-n
C a=3:1:9.9:0.1 ; m=4:-9:9:1 ; b=2:1:9.9:0.1 ; n=5:-9:9:1 => a*b
CT (@a@\times 10^{@m@})\times(@b@\times 10^{@n@})=@=@\times 10^{@m@+@n@}
G fpow_sfmul
V a,b,m:-3:3,n:-3:3
S Bu hesaba göre Güneş bize yaklaşık $1{,}5\times 10^{8}$ km uzaktadır; ışık bu yolu 8 dakikadan biraz fazla sürede alır.

## f-alg

# f-alg-like-terms | 3 | Benzer terimleri toplama | Collecting like terms
L ax+bx
R (a+b)x
X (a+b)x^2 ;; abx ;; a+bx
K Benzer terimler: harfi ve üssü aynı olan terimler. $3x$ ile $5x$ benzerdir; $3x$ ile $5x^2$ ya da $5y$ benzer değildir, toplanamaz.
KE Like terms have exactly the same letters and powers. $3x$ and $5x$ are like terms; $3x$ and $5x^2$ (or $5y$) are not.
U Bir ifadeyi kısaltıp sadeleştirir.
UE Simplifies an expression by combining terms of the same kind.
W 3 elma ile 5 elma 8 elma eder; “elma” değişmez. $3x+5x=8x$ de böyledir: yalnızca sayılar (katsayılar) toplanır, $x$ aynen kalır.
WE 3 apples plus 5 apples make 8 apples. In the same way $3x+5x=8x$: only the coefficients are added and $x$ stays the same.
E $3x+5x=8x$. $4y-7y=-3y$. $2x+3y+5x-y=7x+2y$. $x+x=2x$ ($x^2$ değil!).
H Elmayla elma, armutla armut toplanır.
T like terms = benzer terimler ;; coefficient = katsayı ;; simplify = sadeleştirmek
Q Ali 3 paket, Can 5 paket kalem aldı. Her pakette $x$ kalem var. İkisinin toplam kalem sayısını $x$ cinsinden en kısa hâliyle yaz.
QE Ali buys 3 packs of pens and Can buys 5 packs. Each pack has $x$ pens. Write their total number of pens in terms of $x$, as simply as possible.
B ([[a+b]])x || ab ;; a-b
C a=3:-10:10:1 ; b=5:-10:10:1 ; x=2:-10:10:1 => (a+b)*x
CT @a@\cdot @x@+@b@\cdot @x@=(@a@+@b@)\cdot @x@=@=@
G fpow_like
V a,b,x:-3:3

# f-alg-substitute | 3 | Harfin yerine sayı koyma | Substitution
L 2x^2-x\;\;(x=3)
R 15
X 33 ;; 9 ;; 21
K Harfin yerine sayıyı parantez içinde koy: $2\cdot(3)^2-(3)$. İşlem sırası: önce üs, sonra çarpma, en son toplama ve çıkarma.
KE Replace the letter with the number in brackets: $2\cdot(3)^2-(3)$. Order of operations: powers first, then multiplication, then addition and subtraction.
U Harflerin değeri verildiğinde bir ifadenin ya da formülün sonucunu bulur.
UE Finds the value of an expression or formula when you are given the values of the letters.
W $2x^2$ demek $2\cdot x\cdot x$ demektir; üs yalnızca $x$’e aittir. Bu yüzden $2\cdot 9=18$, sonra $18-3=15$.
WE $2x^2$ means $2\cdot x\cdot x$: the power belongs only to $x$. So $2\cdot 9=18$ and then $18-3=15$.
E $x=-2$ için: $2\cdot(-2)^2-(-2)=2\cdot 4+2=10$. Negatif sayıyı parantezsiz koyarsan işaret hatası yaparsın.
H Harf gider, parantezli sayı gelir.
T substitute = yerine koymak ;; evaluate = değerini hesaplamak ;; expression = ifade
Q Bir topun yüksekliği $h=20t-5t^2$ metre ($t$: saniye). $t=2$ saniyede top kaç metre yükseklikte?
QE The height of a ball is $h=20t-5t^2$ metres, where $t$ is the time in seconds. How high is the ball when $t=2$?
C x=3:-10:10:1 => 2*x^2-x
CT 2\cdot @x@^2-@x@=@=@
G fpow_subst

# f-alg-distribute | 3 | Dağılma özelliği | The distributive law
L a(b+c)
R ab+ac
X ab+c ;; a+bc ;; abc
K Parantezin önündeki sayı, içerideki her terimle ayrı ayrı çarpılır. İşarete dikkat: $-(b-c)=-b+c$.
KE The number in front multiplies every term inside the brackets. Watch the signs: $-(b-c)=-b+c$.
U Parantezi kaldırıp ifadeyi açar.
UE Removes the brackets by multiplying out, which is called expanding.
W $3(x+4)$, üç tane $(x+4)$ demektir: $(x+4)+(x+4)+(x+4)=3x+12$. İçerideki her terim $3$ kez sayılır.
WE $3(x+4)$ means three lots of $(x+4)$, which is $3x+12$: every term inside is counted 3 times.
E $3(x+4)=3x+12$. $-2(x-5)=-2x+10$. $x(x+7)=x^2+7x$.
H Öndeki sayı, içerideki herkesi tek tek ziyaret eder.
T expand = parantezi açmak ;; distributive law = dağılma özelliği ;; term = terim
Q Sinemaya 3 kişi gidiyorsunuz. Her biriniz 80 TL’lik bilet ve 45 TL’lik mısır alıyorsunuz. Toplam ne kadar ödersiniz?
QE Three of you go to the cinema. Each person buys an 80 TL ticket and 45 TL of popcorn. How much do you pay altogether?
B ab+[[ac]] || c ;; bc ;; a+c
C a=3:-10:10:1 ; b=2:-10:10:1 ; c=4:-10:10:1 => a*(b+c)
CT @a@(@b@+@c@)=@a@\cdot @b@+@a@\cdot @c@=@=@
G fpow_dist
V a,b,c

# f-alg-common-factor | 3 | Ortak çarpan parantezine alma | Factorizing by taking out a common factor
L ab+ac
R a(b+c)
X a(b+ac) ;; a+(b+c) ;; 2a(b+c)
K Dağılma özelliğinin tersidir. Her terimi bölen en büyük ortak çarpanı (sayı ve harf) dışarı al. Kontrol: parantezi açınca başladığın ifadeye dönmelisin.
KE This is the distributive law in reverse. Take out the highest common factor (numbers and letters). Check: expanding again must give what you started with.
U Bir toplamı, çarpım biçiminde yazar (çarpanlarına ayırır).
UE Writes a sum as a product, which is called factorizing.
W $6x+9$: iki terim de $3$’e bölünür. $3$’ü dışarı alınca içeride $6x\div 3=2x$ ve $9\div 3=3$ kalır: $3(2x+3)$.
WE In $6x+9$ both terms are divisible by 3; taking 3 out leaves $2x$ and $3$ inside: $3(2x+3)$.
E $6x+9=3(2x+3)$. $x^2+5x=x(x+5)$. $10x^2-15x=5x(2x-3)$.
H Herkeste ortak olanı kapının önüne çıkar.
T factorize = çarpanlarına ayırmak ;; common factor = ortak çarpan ;; highest common factor (HCF) = EBOB
Q Bir dikdörtgenin alanı $3x^2+6x$ ve bir kenarı $3x$. Öbür kenarı nedir?
QE A rectangle has area $3x^2+6x$ and one side of length $3x$. What is the length of the other side?
B a([[b+c]]) || bc ;; ab+c
C a=3:-10:10:1 ; b=2:-10:10:1 ; c=3:-10:10:1 => a*b+a*c
CT @a@\cdot @b@+@a@\cdot @c@=@a@(@b@+@c@)=@=@
G fpow_cf
V a,b,c

# f-alg-expand | 3 | İki parantezi çarpma | Expanding two brackets
L (a+b)(c+d)
R ac+ad+bc+bd
X ac+bd ;; ab+cd ;; ac+ad+bc
K Birinci parantezdeki her terim, ikinci parantezdeki her terimle çarpılır: toplam $2\times 2=4$ çarpım.
KE Every term in the first bracket multiplies every term in the second: $2\times 2=4$ products in total.
U İki parantezin çarpımını açar.
UE Expands the product of two brackets.
W Kenarları $(a+b)$ ve $(c+d)$ olan dikdörtgeni $4$ küçük dikdörtgene böl: alanları $ac$, $ad$, $bc$, $bd$. Büyük alan, bu dördünün toplamıdır.
WE Split a rectangle with sides $(a+b)$ and $(c+d)$ into 4 smaller rectangles with areas $ac$, $ad$, $bc$ and $bd$.
E $(x+2)(x+5)=x^2+5x+2x+10=x^2+7x+10$. $(x-3)(x+4)=x^2+4x-3x-12=x^2+x-12$.
H FOIL: First, Outer, Inner, Last (ilkler, dışlar, içler, sonlar).
T expand = parantezi açmak ;; term = terim ;; quadratic expression = ikinci dereceden ifade
Q Bir dikdörtgenin kenarları $(x+2)$ cm ve $(x+5)$ cm. Alanını parantezsiz bir ifade olarak yaz.
QE A rectangle has sides $(x+2)$ cm and $(x+5)$ cm. Write its area as an expression without brackets.
B ac+[[ad]]+bc+bd || ab ;; cd ;; a+d
C a=2:-10:10:1 ; b=3:-10:10:1 ; c=4:-10:10:1 ; d=5:-10:10:1 => (a+b)*(c+d)
CT (@a@+@b@)(@c@+@d@)=@a@\cdot @c@+@a@\cdot @d@+@b@\cdot @c@+@b@\cdot @d@=@=@
G fpow_expand
V a,b,c,d

# f-alg-square-sum | 3 | Toplamın karesi | The square of a sum
L (a+b)^2
R a^2+2ab+b^2
X a^2+b^2 ;; a^2+ab+b^2 ;; 2a+2b
K $(a+b)^2=(a+b)(a+b)$: iki parantezi çarpma kuralıdır. Ortadaki $2ab$’yi unutma!
KE $(a+b)^2=(a+b)(a+b)$, so expand two brackets. Do not forget the middle term $2ab$.
U Bir toplamın karesini hızlıca açar.
UE Quickly expands the square of a sum.
W Kenarı $a+b$ olan kare; bir $a^2$ karesi, bir $b^2$ karesi ve iki tane $ab$ dikdörtgeninden oluşur.
WE A square of side $a+b$ is made of an $a^2$ square, a $b^2$ square and two $ab$ rectangles.
E $(x+3)^2=x^2+6x+9$. $21^2=(20+1)^2=400+40+1=441$.
H Birincinin karesi, iki katı çarpım, ikincinin karesi.
T perfect square = tam kare ;; middle term = ortadaki terim
Q Kenarı $(x+3)$ cm olan bir karenin alanını parantezsiz yaz.
QE Write the area of a square with side $(x+3)$ cm without brackets.
B a^2+[[2ab]]+b^2 || ab ;; a+b ;; 0
C a=20:-20:50:1 ; b=1:-10:10:1 => (a+b)^2
CT (@a@+@b@)^2=@a@^2+2\cdot @a@\cdot @b@+@b@^2=@=@
G fpow_sqsum
V a,b

# f-alg-square-diff | 3 | Farkın karesi | The square of a difference
L (a-b)^2
R a^2-2ab+b^2
X a^2-b^2 ;; a^2-2ab-b^2 ;; a^2+b^2
K Ortadaki terim eksidir ama $b^2$ her zaman artıdır, çünkü $(-b)^2=b^2$.
KE The middle term is negative, but $b^2$ is always positive because $(-b)^2=b^2$.
U Bir farkın karesini hızlıca açar.
UE Quickly expands the square of a difference.
W $(a-b)^2=(a+(-b))^2$: toplamın karesinde $b$ yerine $-b$ koy. $2a(-b)=-2ab$ ve $(-b)^2=+b^2$ olur.
WE $(a-b)^2=(a+(-b))^2$: put $-b$ in place of $b$ in the square of a sum, giving $-2ab$ and $+b^2$.
E $(x-5)^2=x^2-10x+25$. $99^2=(100-1)^2=10000-200+1=9801$.
H Ortada eksi, uçlarda artı.
T perfect square = tam kare ;; difference = fark
Q Hesap makinesi olmadan $99\times 99$ çarpımını 10 saniyede bulman gerekiyor.
QE You need to work out $99\times 99$ in your head in 10 seconds.
B a^2[[-2ab]]+b^2 || +2ab ;; -ab ;; -2b
C a=100:-20:100:1 ; b=1:-10:10:1 => (a-b)^2
CT (@a@-@b@)^2=@a@^2-2\cdot @a@\cdot @b@+@b@^2=@=@
G fpow_sqdiff
V a,b

# f-alg-dots | 3 | İki kare farkı | The difference of two squares
L a^2-b^2
R (a-b)(a+b)
X (a-b)^2 ;; (b-a)(b+a) ;; (a+b)^2
K Yalnızca iki kare arasında eksi varsa çalışır. $a^2+b^2$ bu şekilde çarpanlarına ayrılamaz.
KE It works only when one square is subtracted from another. $a^2+b^2$ cannot be factorized this way.
U İki kare farkını hızlıca çarpanlarına ayırır.
UE Quickly factorizes a difference of two squares.
W $(a-b)(a+b)$’yi aç: $a^2+ab-ab-b^2$. Ortadaki $+ab$ ile $-ab$ birbirini götürür, geriye $a^2-b^2$ kalır.
WE Expand $(a-b)(a+b)$: the middle terms $+ab$ and $-ab$ cancel, leaving $a^2-b^2$.
E $x^2-9=(x-3)(x+3)$. $4x^2-25=(2x-5)(2x+5)$. $51\times 49=(50+1)(50-1)=2500-1=2499$.
H Kareler farkı = fark × toplam.
T difference of two squares = iki kare farkı ;; factorize = çarpanlarına ayırmak
Q $51\times 49$ çarpımını hesap makinesi olmadan 10 saniyede bulmak istiyorsun.
QE You want to work out $51\times 49$ in your head in 10 seconds.
B (a-b)([[a+b]]) || a-b ;; b-a
C a=50:-50:100:1 ; b=1:-20:20:1 => a^2-b^2
CT @a@^2-@b@^2=(@a@-@b@)(@a@+@b@)=@=@
G fpow_dots
V a,b

# f-alg-factor-quad | 3 | $x^2+bx+c$ ifadesini çarpanlarına ayırma | Factorizing $x^2+bx+c$
L x^2+(p+q)x+pq
R (x+p)(x+q)
X (x-p)(x-q) ;; (x+p)(x-q) ;; (x+p+q)(x+pq)
K Toplamı $x$’in katsayısını, çarpımı sabit terimi veren iki sayı ($p$ ve $q$) ara. İşaretlere dikkat!
KE Look for two numbers $p$ and $q$ that add up to the coefficient of $x$ and multiply to the constant term. Watch the signs.
U İkinci dereceden bir ifadeyi iki parantezin çarpımı olarak yazar.
UE Writes a quadratic expression as a product of two brackets.
W Bu, parantez açmanın tersidir: $(x+p)(x+q)=x^2+qx+px+pq$. Yani ortadaki katsayı $p+q$, sondaki sayı $pq$ olur.
WE It is expanding in reverse: $(x+p)(x+q)=x^2+(p+q)x+pq$, so the middle coefficient is the sum and the constant term is the product.
E $x^2+7x+12$: $3+4=7$ ve $3\cdot 4=12$, yani $(x+3)(x+4)$. $x^2-x-6$: $-3+2=-1$ ve $(-3)\cdot 2=-6$, yani $(x-3)(x+2)$.
H Çarpımları sonda, toplamları ortada.
T quadratic = ikinci dereceden ;; constant term = sabit terim ;; factorize = çarpanlarına ayırmak
Q Bir dikdörtgenin alanı $x^2+7x+12$. Kenar uzunluklarını $x$ cinsinden bul.
QE The area of a rectangle is $x^2+7x+12$. Find the lengths of its sides in terms of $x$.
C p=3:-9:9:1 ; q=4:-9:9:1 => p*q
CT (x+@p@)(x+@q@)=x^2+(@p@+@q@)x+@=@
G fpow_fquad
V p,q,x:-3:3

# f-alg-balance | 3 | Terazi kuralı | The balance rule
L a=b
O \Rightarrow
R ~İki tarafa da aynı işlem yapılır
X ~İşlem yalnızca $x$’in olduğu tarafa yapılır ;; ~İki taraf farklı sayılarla çarpılır ;; ~İki taraf da $0$’a bölünür
K Ekleme, çıkarma, çarpma, bölme: hepsi olur, yeter ki iki tarafa da aynısı yapılsın. Tek yasak: $0$’a bölmek.
KE You may add, subtract, multiply or divide, as long as you do exactly the same to both sides. Never divide by $0$.
U Denklemi bozmadan adım adım sadeleştirip $x$’i yalnız bırakmanı sağlar.
UE Lets you change an equation step by step, without breaking it, until $x$ is on its own.
W Denklem, dengede duran bir terazidir. İki kefeye aynı şeyi eklersen ya da ikisinden aynı şeyi alırsan terazi yine dengede kalır.
WE An equation is like balanced scales: if you do the same thing to both pans, they stay balanced.
E $x+5=12$: iki taraftan $5$ çıkar, $x=7$. $\tfrac{x}{3}=4$: iki tarafı $3$ ile çarp, $x=12$.
H “Karşıya at, işaret değiştir” kısayolunun asıl adı budur.
T equation = denklem ;; both sides = iki taraf ;; solve = çözmek
Q Terazinin bir kefesinde bir kutu ve 5 kg’lık bir ağırlık, öbür kefesinde 12 kg var; terazi dengede. Kutunun kaç kg olduğunu nasıl bulursun?
QE One pan of a balance holds a box and a 5 kg weight; the other pan holds 12 kg. The scales balance. How do you find the mass of the box?
G fpow_onestep
S “Cebir” ve İngilizce “algebra”, 9. yüzyılda Harezmî’nin kitabındaki “el-cebr” (tamamlama) kelimesinden gelir. “Algoritma” sözcüğü de Harezmî’nin adından türemiştir.

# f-alg-linear | 3 | Birinci dereceden denklem çözme | Solving a linear equation
L ax+b=c
O \Rightarrow
R x=\dfrac{c-b}{a}
X x=\dfrac{c+b}{a} ;; x=\dfrac{c}{a}-b ;; x=\dfrac{a}{c-b}
K $a\ne 0$. Önce iki taraftan $b$’yi çıkar ($ax=c-b$), sonra iki tarafı $a$’ya böl.
KE $a\ne 0$. First subtract $b$ from both sides ($ax=c-b$), then divide both sides by $a$.
U Tek bilinmeyenli, birinci dereceden bir denklemi çözer.
UE Solves a linear equation with one unknown.
W Terazi kuralını iki kez kullanırsın: toplamayı çıkarmayla, sonra çarpmayı bölmeyle geri alırsın. $x$’e en son ne yapıldıysa ilk onu geri al.
WE Use the balance rule twice: undo the addition by subtracting, then undo the multiplication by dividing.
E $3x+5=20$, yani $3x=15$, yani $x=5$. Kontrol: $3\cdot 5+5=20$.
H Ters sırayla geri al: önce $+b$, sonra $\times a$.
T linear equation = birinci dereceden (doğrusal) denklem ;; unknown = bilinmeyen ;; solve = çözmek
Q Bir taksi binişte 15 TL alıyor, sonra her kilometre için 6 TL ekliyor. Yolculuğun 75 TL tuttu. Kaç km gittin?
QE A taxi charges 15 TL to start and then 6 TL per kilometre. Your ride costs 75 TL. How many kilometres did you travel?
B x=\dfrac{c[[-b]]}{[[a]]} || +b ;; c ;; b
C a=3:1:10:1 ; b=5:-20:20:1 ; c=20:-50:50:1 => (c-b)/a
CT @a@x+@b@=@c@\;\Rightarrow\;x=\dfrac{@c@-@b@}{@a@}=@=@
G fpow_lin

# f-alg-subject | 2 | Formülde bir harfi yalnız bırakma | Changing the subject of a formula
L y=mx+c
O \Rightarrow
R x=\dfrac{y-c}{m}
X x=\dfrac{y+c}{m} ;; x=\dfrac{y}{m}-c ;; x=m(y-c)
K $m\ne 0$. Harfleri sayı gibi düşün ve denklem çözer gibi iki tarafa aynı işlemi yap.
KE $m\ne 0$. Treat the letters like numbers and use the balance rule, exactly as when solving an equation.
U Bir formülü, başka bir harfi hesaplayacak şekilde yeniden yazar.
UE Rearranges a formula so that a different letter is on its own.
W $y=mx+c$’de $x$’i yalnız bırakmak, $mx+c=y$ denklemini çözmekle aynıdır: önce $c$’yi çıkar, sonra $m$’ye böl.
WE Making $x$ the subject is the same as solving $mx+c=y$: subtract $c$, then divide by $m$.
E $F=1{,}8C+32$ ise $C=\tfrac{F-32}{1{,}8}$. $F=50$ için $C=\tfrac{18}{1{,}8}=10$.
H Hedef harf yalnız kalana kadar terazi kuralı.
T change the subject = bir harfi yalnız bırakmak ;; rearrange = yeniden düzenlemek ;; formula = formül
Q Sıcaklık formülü $F=1{,}8C+32$. Fahrenheit verilince Celsius’u doğrudan veren bir formül istiyorsun.
QE The temperature formula is $F=1.8C+32$. You want a formula that gives Celsius directly from Fahrenheit.
B x=\dfrac{[[y-c]]}{[[m]]} || y+c ;; c-y ;; y
C y=11:-50:50:1 ; m=2:1:10:0.5 ; c=5:-20:20:1 => (y-c)/m
CT x=\dfrac{@y@-@c@}{@m@}=@=@
G fpow_subj

# f-alg-square-eq | 3 | $x^2=k$ denklemi | Solving $x^2=k$
L x^2=k
O \Rightarrow
R x=\pm\sqrt{k}
X x=\sqrt{k} ;; x=\dfrac{k}{2} ;; x=\pm\dfrac{k}{2}
K $k>0$ ise iki çözüm vardır. $k=0$ ise tek çözüm $x=0$’dır. $k<0$ ise gerçek çözüm yoktur.
KE If $k>0$ there are two solutions; if $k=0$, only $x=0$; if $k<0$, there are no real solutions.
U Kareli basit bir denklemin iki çözümünü de bulur.
UE Finds both solutions of a simple equation with a square.
W Hem $7^2=49$ hem $(-7)^2=49$. Yani $x^2=49$ ise $x$, $7$ de olabilir $-7$ de. $\pm$ işareti “artı ya da eksi” demektir.
WE Both $7^2$ and $(-7)^2$ equal $49$, so $x^2=49$ has two solutions. The sign $\pm$ means "plus or minus".
E $x^2=49$ ise $x=\pm 7$. $x^2-5=11$ ise $x^2=16$, yani $x=\pm 4$. Uzunluk gibi pozitif olması gereken bir şeyde yalnızca pozitif çözüm alınır.
H Karekök alırken artı-eksiyi unutma.
T solution = çözüm ;; plus or minus = artı ya da eksi ;; real solution = gerçek çözüm
Q Bir sayının karesi 64. Bu sayı kaç olabilir? Tüm olasılıkları düşün.
QE The square of a number is 64. What could the number be? Think of every possibility.
B x=[[\pm]]\sqrt{[[k]]} || + ;; k^2 ;; 2
C k=49:0:400:1 => sqrt(k)
CT x^2=@k@\;\Rightarrow\;x=\pm\sqrt{@k@}=\pm @=@
G fpow_sqeq

# f-alg-zero-product | 3 | Sıfır çarpım kuralı | The zero product property
L ab=0
O \Rightarrow
R ~$a=0$ ya da $b=0$
X ~$a$ ve $b$’nin ikisi de $0$ olmak zorunda ;; ~$a=b$ ;; ~$a=1$ ya da $b=1$
K En az biri sıfırdır (ikisi birden de olabilir). Yalnızca sağ taraf $0$ iken çalışır: $ab=6$ olunca böyle bir sonuç çıkmaz.
KE If $ab=0$, then $a=0$ or $b=0$ (or both). It only works when one side is $0$: $ab=6$ tells you nothing like this.
U Çarpanlarına ayrılmış bir denklemi kolayca çözer.
UE Solves an equation once it has been factorized.
W Sıfırdan farklı iki sayıyı çarparak $0$ elde edemezsin. Çarpım $0$ ise çarpanlardan biri mutlaka $0$’dır.
WE You cannot get $0$ by multiplying two non-zero numbers, so if a product is $0$, one of the factors must be $0$.
E $(x-3)(x+5)=0$ ise $x-3=0$ ya da $x+5=0$; yani $x=3$ ya da $x=-5$.
H Çarpım sıfırsa suçlu, çarpanlardan biridir.
T factor = çarpan ;; roots = kökler (çözümler) ;; zero = sıfır
Q Bir topun yüksekliği $h=t(10-5t)$ metre ($t$: saniye). Top hangi anlarda yerdedir ($h=0$)?
QE The height of a ball is $h=t(10-5t)$ metres, where $t$ is in seconds. At what times is the ball on the ground ($h=0$)?
G fpow_zp

# f-alg-ineq-solve | 3 | Eşitsizlik çözme | Solving an inequality
L x+a<b
O \iff
R x<b-a
X x<b+a ;; x>b-a ;; x<a-b
K $<$: küçüktür, $>$: büyüktür, $\le$: küçük ya da eşit, $\ge$: büyük ya da eşit. Toplama ve çıkarma eşitsizliğin yönünü değiştirmez.
KE $<$ less than, $>$ greater than, $\le$ less than or equal to, $\ge$ greater than or equal to. Adding or subtracting does not change the direction of the inequality.
U Bir eşitsizliği hangi sayıların sağladığını bulur.
UE Finds all the numbers that make an inequality true.
W Eşitsizlik, denklem gibi çözülür; tek fark cevabın tek bir sayı değil, bir aralık olmasıdır. $x+5<12$ ise $x<7$: $7$’den küçük her sayı çalışır.
WE Solve it like an equation; the difference is that the answer is a whole range of numbers, not just one.
E $x+5<12$ ise $x<7$. $x-3\ge 4$ ise $x\ge 7$. $2x+1\le 9$ ise $2x\le 8$, yani $x\le 4$.
H Timsahın ağzı her zaman büyük sayıya açılır: $3<7$.
T inequality = eşitsizlik ;; less than or equal to = küçük ya da eşit ;; number line = sayı doğrusu
Q Cüzdanında 50 TL var. 15 TL’lik bir sinema bileti aldıktan sonra, en fazla ne kadarlık atıştırmalık alabilirsin?
QE You have 50 TL. After buying a 15 TL cinema ticket, what is the most you can spend on snacks?
B x<[[b-a]] || b+a ;; a-b
C a=5:-20:20:1 ; b=12:-20:20:1 => b-a
CT x+@a@<@b@\iff x<@b@-@a@=@=@
G fpow_ineqs
LAB numberline

# f-alg-ineq-flip | 3 | Negatif sayıyla çarpınca yön değişir | Multiplying an inequality by a negative number
L a<b,\; c<0
O \Rightarrow
R ac>bc
X ac<bc ;; ac>b ;; \dfrac{a}{c}<\dfrac{b}{c}
K $c$ negatif bir sayı. Negatif bir sayıyla çarpar ya da bölersen eşitsizliğin yönü döner ($<$ olur $>$). Pozitif sayıda yön değişmez.
KE $c$ is a negative number. When you multiply or divide both sides by a negative number, the inequality sign reverses ($<$ becomes $>$). With a positive number it stays the same.
U Eksi katsayılı eşitsizlikleri doğru çözmeni sağlar.
UE Lets you solve inequalities with a negative coefficient correctly.
W $2<5$ doğrudur. İki tarafı $-1$ ile çarp: $-2$ ve $-5$ olur. Sayı doğrusunda $-2$, $-5$’in sağında olduğu için $-2>-5$: yön döndü.
WE $2<5$, but after multiplying by $-1$ we get $-2>-5$, because $-2$ is to the right of $-5$ on the number line.
E $-2x<6$: iki tarafı $-2$’ye böl ve yönü çevir, $x>-3$.
H Eksiyle çarpınca timsah arkasını döner.
T inequality sign = eşitsizlik işareti ;; reverse = ters çevirmek ;; negative = negatif
Q Bir dalgıç her dakika 2 m aşağı iniyor; $t$ dakika sonra konumu $-2t$ metre. Konumunun $-10$ m’den yukarıda kalması için $t$ hangi koşulu sağlamalı?
QE A diver goes down 2 m every minute, so after $t$ minutes the diver is at $-2t$ metres. What condition must $t$ satisfy for the diver to stay above $-10$ m?
B ac[[>]]bc || < ;; = ;; \le
G fpow_ineq
LAB numberline

# f-alg-simultaneous | 2 | Yok etme yöntemi (denklem sistemi) | Simultaneous equations by elimination
L \begin{cases}x+y=s\\x-y=d\end{cases}
O \Rightarrow
R x=\dfrac{s+d}{2}
X x=\dfrac{s-d}{2} ;; x=s+d ;; x=\dfrac{sd}{2}
K Taraf tarafa topla: $y$’ler yok olur ve $2x=s+d$ kalır. Sonra $y=s-x$. Katsayılar uymuyorsa önce bir denklemi bir sayıyla çarp.
KE Add the equations: the $y$ terms cancel, so $2x=s+d$; then $y=s-x$. If no coefficients match, first multiply one equation by a number.
U İki bilinmeyenli iki denklemi birlikte çözer.
UE Solves two equations with two unknowns together.
W İki denklemi toplamak, terazinin iki kefesine eşit şeyler eklemek gibidir. $+y$ ile $-y$ birbirini götürür; geriye tek bilinmeyenli kolay bir denklem kalır.
WE Adding the equations keeps them balanced, and $+y$ and $-y$ cancel, leaving an easy equation with one unknown.
E $x+y=10$ ve $x-y=4$: topla, $2x=14$, $x=7$; sonra $y=10-7=3$. $2x+y=11$ ve $x-y=1$: topla, $3x=12$, $x=4$, $y=3$.
H Toplayınca biri yok olsun!
T simultaneous equations = denklem sistemi ;; eliminate = yok etmek ;; unknown = bilinmeyen
Q İki sayının toplamı 30, farkı 8. Büyük sayı kaçtır?
QE Two numbers add up to 30 and their difference is 8. What is the larger number?
B x=\dfrac{[[s+d]]}{2} || s-d ;; sd
C s=10:-20:20:1 ; d=4:-20:20:1 => (s+d)/2
CT x+y=@s@,\;x-y=@d@\;\Rightarrow\;x=\dfrac{@s@+@d@}{2}=@=@
G fpow_sim
`;

/* ---------- yardımcılar ---------- */
/** Katsayılı terim (baştaki): 3x, x, -x, -3x */
const co = (c, v) => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);
/** İşaretli terim (sonraki): +3x, +x, -x, -3x; 0 ise boş */
const sco = (c, v) => (c === 0 ? "" : c > 0 ? `+${co(c, v)}` : co(c, v));
/** İşaretli sabit: +3, -3; 0 ise boş */
const sc = (c) => (c === 0 ? "" : c > 0 ? `+${c}` : `${c}`);
/** Sıfır olmayan tam sayı */
const nz = (r, a, b) => {
  let v;
  do { v = ri(r, a, b); } while (v === 0);
  return v;
};
/** (x+p) çarpanı: p = 3 → (x+3), p = -3 → (x-3) */
const fac = (p) => `(x${sc(p)})`;
/** ax^2+bx+c (a ≠ 0) */
const quad = (a, b, c) => `${co(a, "x^2")}${sco(b, "x")}${sc(c)}`;
/** Büyük tam sayıları ince boşlukla grupla: 45\,000 */
const group = (s) => (s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") : s);
/** İngilizce metin için ondalık nokta */
const en = (v) => String(Math.round(v * 1e6) / 1e6);

export const GEN = {
  /* ---------- f-pow ---------- */
  fpow_eval: (r) => {
    const t = ri(r, 0, 3);
    if (t === 0) {
      const [b, e] = pick(r, [[2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [10, 3], [10, 5], [1, 9]]);
      return { q: `$${b}^{${e}}$ kaçtır?`, qe: `Work out $${b}^{${e}}$.`, ...int(b ** e) };
    }
    if (t === 1) {
      const [b, e] = pick(r, [[2, 2], [2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [4, 2], [5, 2], [1, 7], [1, 10]]);
      return { q: `$(-${b})^{${e}}$ kaçtır?`, qe: `Work out $(-${b})^{${e}}$.`, ...int((-b) ** e) };
    }
    if (t === 2) {
      const b = ri(r, 2, 9), n = ri(r, 3, 6);
      const prod = Array(n).fill(b).join("\\times ");
      return { q: `$${prod}=${b}^{k}$ ise $k$ kaçtır?`, qe: `If $${prod}=${b}^{k}$, find $k$.`, ...int(n) };
    }
    const h = ri(r, 2, 6);
    return {
      q: `Bir bakteri her saat ikiye bölünüyor. Tek bir bakteriyle başlarsan $${h}$ saat sonra kaç bakteri olur?`,
      qe: `A bacterium splits into two every hour. Starting with one bacterium, how many are there after $${h}$ hours?`,
      ...int(2 ** h),
    };
  },
  fpow_negsq: (r) => {
    const k = ri(r, 2, 9), m = ri(r, 2, 4), t = ri(r, 0, 3);
    if (t === 0) return { q: `$-${k}^2$ kaçtır?`, qe: `Work out $-${k}^2$.`, ...int(-(k * k)) };
    if (t === 1) return { q: `$(-${k})^2$ kaçtır?`, qe: `Work out $(-${k})^2$.`, ...int(k * k) };
    if (t === 2) return { q: `$(-${m})^3$ kaçtır?`, qe: `Work out $(-${m})^3$.`, ...int(-(m ** 3)) };
    return { q: `$-${k}^2+(-${m})^2$ kaçtır?`, qe: `Work out $-${k}^2+(-${m})^2$.`, ...int(m * m - k * k) };
  },
  fpow_prod: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const b = pick(r, [2, 3, 5, 7, 10]), m = nz(r, -3, 8), n = nz(r, -3, 8);
      return { q: `$${b}^{${m}}\\times ${b}^{${n}}=${b}^{k}$ ise $k$ kaçtır?`, qe: `If $${b}^{${m}}\\times ${b}^{${n}}=${b}^{k}$, find $k$.`, ...int(m + n) };
    }
    if (t === 1) {
      const v = pick(r, ["x", "y", "a"]), m = ri(r, 2, 9), n = ri(r, 1, 9);
      const second = n === 1 ? v : `${v}^{${n}}`;
      return { q: `$${v}^{${m}}\\times ${second}=${v}^{k}$ ise $k$ kaçtır?`, qe: `If $${v}^{${m}}\\times ${second}=${v}^{k}$, find $k$.`, ...int(m + n) };
    }
    const b = pick(r, [2, 3]), m = ri(r, 1, b === 2 ? 4 : 2), n = ri(r, 1, b === 2 ? 3 : 2);
    return { q: `$${b}^{${m}}\\times ${b}^{${n}}$ kaçtır?`, qe: `Work out $${b}^{${m}}\\times ${b}^{${n}}$.`, ...int(b ** (m + n)) };
  },
  fpow_quot: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const b = pick(r, [2, 3, 5, 7, 10]), m = ri(r, 1, 9), n = ri(r, 1, 9);
      return { q: `$\\dfrac{${b}^{${m}}}{${b}^{${n}}}=${b}^{k}$ ise $k$ kaçtır?`, qe: `If $\\dfrac{${b}^{${m}}}{${b}^{${n}}}=${b}^{k}$, find $k$.`, ...int(m - n) };
    }
    if (t === 1) {
      const v = pick(r, ["x", "y", "a"]), n = ri(r, 2, 5), m = n + ri(r, 1, 6);
      return { q: `$\\dfrac{${v}^{${m}}}{${v}^{${n}}}=${v}^{k}$ ise $k$ kaçtır?`, qe: `If $\\dfrac{${v}^{${m}}}{${v}^{${n}}}=${v}^{k}$, find $k$.`, ...int(m - n) };
    }
    const b = pick(r, [2, 3, 10]), d = ri(r, 1, b === 2 ? 5 : b === 3 ? 3 : 4), n = ri(r, 1, 5), m = n + d;
    return { q: `$\\dfrac{${b}^{${m}}}{${b}^{${n}}}$ kaçtır?`, qe: `Work out $\\dfrac{${b}^{${m}}}{${b}^{${n}}}$.`, ...int(b ** d) };
  },
  fpow_powpow: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const b = pick(r, [2, 3, 5, 10]), m = ri(r, 2, 5), n = ri(r, 2, 4);
      return { q: `$(${b}^{${m}})^{${n}}=${b}^{k}$ ise $k$ kaçtır?`, qe: `If $(${b}^{${m}})^{${n}}=${b}^{k}$, find $k$.`, ...int(m * n) };
    }
    if (t === 1) {
      const v = pick(r, ["x", "y"]), m = ri(r, 2, 6), n = ri(r, 2, 5);
      return { q: `$(${v}^{${m}})^{${n}}=${v}^{k}$ ise $k$ kaçtır?`, qe: `If $(${v}^{${m}})^{${n}}=${v}^{k}$, find $k$.`, ...int(m * n) };
    }
    const [B, b, p] = pick(r, [[4, 2, 2], [8, 2, 3], [16, 2, 4], [9, 3, 2], [27, 3, 3], [25, 5, 2], [100, 10, 2]]);
    const n = ri(r, 2, 5);
    return { q: `$${B}^{${n}}=${b}^{k}$ ise $k$ kaçtır?`, qe: `If $${B}^{${n}}=${b}^{k}$, find $k$.`, ...int(p * n) };
  },
  fpow_zero: (r) => {
    const a = pick(r, [3, 7, 12, 25, 99, 2026]), b = ri(r, 2, 9), t = ri(r, 0, 5);
    if (t === 0) return { q: `$${a}^0$ kaçtır?`, qe: `Work out $${a}^0$.`, ...int(1) };
    if (t === 1) return { q: `$(-${b})^0$ kaçtır?`, qe: `Work out $(-${b})^0$.`, ...int(1) };
    if (t === 2) return { q: `$-${b}^0$ kaçtır?`, qe: `Work out $-${b}^0$.`, ...int(-1) };
    if (t === 3) return { q: `$${b}\\times ${a}^0$ kaçtır?`, qe: `Work out $${b}\\times ${a}^0$.`, ...int(b) };
    if (t === 4) return { q: `$${a}^0+${b}^0$ kaçtır?`, qe: `Work out $${a}^0+${b}^0$.`, ...int(2) };
    const n = ri(r, 2, 9);
    return { q: `$\\dfrac{${b}^{${n}}}{${b}^{${n}}}=${b}^{k}$ ise $k$ kaçtır?`, qe: `If $\\dfrac{${b}^{${n}}}{${b}^{${n}}}=${b}^{k}$, find $k$.`, ...int(0) };
  },
  fpow_neg: (r) => {
    const t = ri(r, 0, 3);
    if (t === 0) {
      const [b, n] = pick(r, [[2, 1], [2, 2], [2, 3], [2, 4], [3, 1], [3, 2], [4, 2], [5, 1], [5, 2], [10, 1], [10, 2], [10, 3]]);
      return { q: `$${b}^{-${n}}$ kaçtır? (kesir olarak yaz)`, qe: `Work out $${b}^{-${n}}$ as a fraction.`, ...fr(1, b ** n) };
    }
    if (t === 1) {
      const [b, n] = pick(r, [[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [4, 2], [5, 2]]);
      return { q: `$\\left(\\tfrac{1}{${b}}\\right)^{-${n}}$ kaçtır?`, qe: `Work out $\\left(\\tfrac{1}{${b}}\\right)^{-${n}}$.`, ...int(b ** n) };
    }
    if (t === 2) {
      const b = pick(r, [2, 3, 5, 7]), n = ri(r, 1, 6);
      const den = n === 1 ? `${b}` : `${b}^{${n}}`;
      return { q: `$\\dfrac{1}{${den}}=${b}^{k}$ ise $k$ kaçtır?`, qe: `If $\\dfrac{1}{${den}}=${b}^{k}$, find $k$.`, ...int(-n) };
    }
    let p, q;
    do { p = ri(r, 1, 9); q = ri(r, 2, 9); } while (p === q || gcd(p, q) !== 1);
    return { q: `$\\left(\\tfrac{${p}}{${q}}\\right)^{-1}$ kaçtır?`, qe: `Work out $\\left(\\tfrac{${p}}{${q}}\\right)^{-1}$.`, ...fr(q, p) };
  },
  fpow_prodpow: (r) => {
    const t = ri(r, 0, 3);
    if (t === 0) {
      const c = ri(r, 2, 5), n = c === 5 ? 2 : ri(r, 2, 3), s = r() < 0.3 ? -c : c;
      return { q: `$(${s}x)^{${n}}=kx^{${n}}$ ise $k$ kaçtır?`, qe: `If $(${s}x)^{${n}}=kx^{${n}}$, find $k$.`, ...int(s ** n) };
    }
    if (t === 1) {
      const n = ri(r, 2, 6), [p, q] = pick(r, [[2, 5], [5, 2]]);
      return { q: `$${p}^{${n}}\\times ${q}^{${n}}$ kaçtır? (İpucu: önce tabanları çarp.)`, qe: `Work out $${p}^{${n}}\\times ${q}^{${n}}$. (Hint: multiply the bases first.)`, ...int(10 ** n) };
    }
    if (t === 2) {
      const c = ri(r, 2, 3), m = ri(r, 2, 4), n = ri(r, 2, 3);
      return { q: `$(${c}x^{${m}})^{${n}}=kx^{${m * n}}$ ise $k$ kaçtır?`, qe: `If $(${c}x^{${m}})^{${n}}=kx^{${m * n}}$, find $k$.`, ...int(c ** n) };
    }
    const c = ri(r, 2, 5), m = ri(r, 2, 5), n = ri(r, 2, 4);
    return { q: `$(${c}x^{${m}})^{${n}}=${c ** n}x^{k}$ ise $k$ kaçtır?`, qe: `If $(${c}x^{${m}})^{${n}}=${c ** n}x^{k}$, find $k$.`, ...int(m * n) };
  },
  fpow_quotpow: (r) => {
    const t = ri(r, 0, 2);
    let p, q;
    do { p = ri(r, 1, 5); q = ri(r, 2, 5); } while (p === q || gcd(p, q) !== 1);
    if (t === 0) {
      const n = ri(r, 2, 3);
      return { q: `$\\left(\\tfrac{${p}}{${q}}\\right)^{${n}}$ kaçtır?`, qe: `Work out $\\left(\\tfrac{${p}}{${q}}\\right)^{${n}}$.`, ...fr(p ** n, q ** n) };
    }
    if (t === 1) {
      const n = ri(r, 1, 2);
      return { q: `$\\left(\\tfrac{${p}}{${q}}\\right)^{-${n}}$ kaçtır?`, qe: `Work out $\\left(\\tfrac{${p}}{${q}}\\right)^{-${n}}$.`, ...fr(q ** n, p ** n) };
    }
    const a = ri(r, 2, 3), b = ri(r, 2, 5), n = ri(r, 2, 3);
    return { q: `$\\dfrac{${a * b}^{${n}}}{${b}^{${n}}}$ kaçtır? (İpucu: önce kesri sadeleştir.)`, qe: `Work out $\\dfrac{${a * b}^{${n}}}{${b}^{${n}}}$. (Hint: simplify the fraction first.)`, ...int(a ** n) };
  },
  fpow_sqrt: (r) => {
    const n = ri(r, 2, 15), t = ri(r, 0, 2);
    if (t === 0) return { q: `$\\sqrt{${n * n}}$ kaçtır?`, qe: `Work out $\\sqrt{${n * n}}$.`, ...int(n) };
    if (t === 1) {
      return {
        q: `Alanı $${n * n}\\text{ cm}^2$ olan bir karenin bir kenarı kaç cm?`,
        qe: `A square has an area of $${n * n}\\text{ cm}^2$. How long is one side?`,
        ...int(n), unit: "cm",
      };
    }
    const a = ri(r, 2, 30);
    return { q: `$\\left(\\sqrt{${a}}\\right)^2$ kaçtır?`, qe: `Work out $\\left(\\sqrt{${a}}\\right)^2$.`, ...int(a) };
  },
  fpow_root: (r) => {
    const [b, n] = pick(r, [[2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [10, 3], [2, 4], [3, 4], [2, 5], [2, 6]]);
    const t = ri(r, 0, 2), B = b ** n;
    if (t === 0) return { q: `$\\sqrt[${n}]{${B}}$ kaçtır?`, qe: `Work out $\\sqrt[${n}]{${B}}$.`, ...int(b) };
    if (t === 1) return { q: `$${B}^{\\frac{1}{${n}}}$ kaçtır?`, qe: `Work out $${B}^{\\frac{1}{${n}}}$.`, ...int(b) };
    const c = pick(r, [2, 3, 4, 5, 6, 10]);
    return {
      q: `Hacmi $${c ** 3}\\text{ cm}^3$ olan bir küpün bir kenarı kaç cm?`,
      qe: `A cube has a volume of $${c ** 3}\\text{ cm}^3$. How long is one edge?`,
      ...int(c), unit: "cm",
    };
  },
  fpow_ratexp: (r) => {
    const cands = [];
    for (const b of [2, 3, 4, 5]) for (const n of [2, 3, 4]) for (let m = 2; m <= 5; m++) {
      if (m === n || gcd(m, n) !== 1 || b ** n > 256 || b ** m > 125) continue;
      cands.push([b, n, m]);
    }
    const [b, n, m] = pick(r, cands), B = b ** n;
    if (r() < 0.3) {
      return { q: `$${B}^{-\\frac{${m}}{${n}}}$ kaçtır? (kesir olarak yaz)`, qe: `Work out $${B}^{-\\frac{${m}}{${n}}}$ as a fraction.`, ...fr(1, b ** m) };
    }
    return { q: `$${B}^{\\frac{${m}}{${n}}}$ kaçtır?`, qe: `Work out $${B}^{\\frac{${m}}{${n}}}$.`, ...int(b ** m) };
  },
  fpow_sqrtmul: (r) => {
    if (r() < 0.25) {
      const p = ri(r, 2, 15);
      return { q: `$\\sqrt{${p}}\\times\\sqrt{${p}}$ kaçtır?`, qe: `Work out $\\sqrt{${p}}\\times\\sqrt{${p}}$.`, ...int(p) };
    }
    const [p, q] = pick(r, [[2, 8], [2, 18], [2, 32], [2, 50], [3, 12], [3, 27], [3, 48], [5, 20], [5, 45], [6, 24], [7, 28], [8, 18], [12, 27], [10, 40]]);
    const [x, y] = r() < 0.5 ? [p, q] : [q, p];
    return { q: `$\\sqrt{${x}}\\times\\sqrt{${y}}$ kaçtır?`, qe: `Work out $\\sqrt{${x}}\\times\\sqrt{${y}}$.`, ...int(Math.round(Math.sqrt(p * q))) };
  },
  fpow_sqrtdiv: (r) => {
    if (r() < 0.5) {
      let a, b;
      do { a = ri(r, 1, 9); b = ri(r, 2, 9); } while (a === b || gcd(a, b) !== 1);
      return { q: `$\\sqrt{\\dfrac{${a * a}}{${b * b}}}$ kaçtır?`, qe: `Work out $\\sqrt{\\dfrac{${a * a}}{${b * b}}}$.`, ...fr(a, b) };
    }
    const m = pick(r, [2, 3, 5, 6, 7]), k = ri(r, 2, 9);
    return { q: `$\\dfrac{\\sqrt{${k * k * m}}}{\\sqrt{${m}}}$ kaçtır?`, qe: `Work out $\\dfrac{\\sqrt{${k * k * m}}}{\\sqrt{${m}}}$.`, ...int(k) };
  },
  fpow_surd: (r) => {
    const m = pick(r, [2, 3, 5, 6, 7, 10]), k = ri(r, 2, 6), N = k * k * m;
    if (r() < 0.6) return { q: `$\\sqrt{${N}}=k\\sqrt{${m}}$ ise $k$ kaçtır?`, qe: `If $\\sqrt{${N}}=k\\sqrt{${m}}$, find $k$.`, ...int(k) };
    return {
      q: `$\\sqrt{${N}}$ sayısını en sade kök biçiminde $${k}\\sqrt{b}$ olarak yazarsan $b$ kaçtır?`,
      qe: `When $\\sqrt{${N}}$ is written in simplest surd form as $${k}\\sqrt{b}$, what is $b$?`,
      ...int(m),
    };
  },
  fpow_rat: (r) => {
    const p = pick(r, [2, 3, 5, 6, 7]), t = ri(r, 0, 2);
    if (t === 0) {
      const k = ri(r, 1, 5);
      return { q: `$\\dfrac{${k * p}}{\\sqrt{${p}}}=c\\sqrt{${p}}$ ise $c$ kaçtır?`, qe: `If $\\dfrac{${k * p}}{\\sqrt{${p}}}=c\\sqrt{${p}}$, find $c$.`, ...int(k) };
    }
    if (t === 1) return { q: `$\\dfrac{1}{\\sqrt{${p}}}=\\dfrac{\\sqrt{${p}}}{q}$ ise $q$ kaçtır?`, qe: `If $\\dfrac{1}{\\sqrt{${p}}}=\\dfrac{\\sqrt{${p}}}{q}$, find $q$.`, ...int(p) };
    const c = ri(r, 2, 9);
    return { q: `$\\dfrac{${c}}{\\sqrt{${p}}}=\\dfrac{${c}\\sqrt{${p}}}{q}$ ise $q$ kaçtır?`, qe: `If $\\dfrac{${c}}{\\sqrt{${p}}}=\\dfrac{${c}\\sqrt{${p}}}{q}$, find $q$.`, ...int(p) };
  },
  fpow_sf: (r) => {
    const d1 = ri(r, 1, 9), d2 = r() < 0.5 ? 0 : ri(r, 1, 9), t = ri(r, 0, 2);
    const manTr = d2 ? `${d1}{,}${d2}` : `${d1}`, manEn = d2 ? `${d1}.${d2}` : `${d1}`;
    if (t === 0) {
      const k = ri(r, 3, 8), N = String((10 * d1 + d2) * 10 ** (k - 1));
      return { q: `$${group(N)}=${manTr}\\times 10^{k}$ ise $k$ kaçtır?`, qe: `If $${group(N)}=${manEn}\\times 10^{k}$, find $k$.`, ...int(k) };
    }
    if (t === 1) {
      const k = -ri(r, 1, 5), z = "0".repeat(-k - 1), digits = d2 ? `${d1}${d2}` : `${d1}`;
      return { q: `$0{,}${z}${digits}=${manTr}\\times 10^{k}$ ise $k$ kaçtır?`, qe: `If $0.${z}${digits}=${manEn}\\times 10^{k}$, find $k$.`, ...int(k) };
    }
    const k = ri(r, 2, 6), N = (10 * d1 + d2) * 10 ** (k - 1);
    return { q: `$${manTr}\\times 10^{${k}}$ sayısını normal (bilimsel gösterimsiz) yaz.`, qe: `Write $${manEn}\\times 10^{${k}}$ as an ordinary number.`, ...int(N) };
  },
  fpow_sfmul: (r) => {
    const a = ri(r, 2, 9), b = ri(r, 2, 9), m = nz(r, -4, 8), n = nz(r, -4, 8);
    const p = a * b, big = p >= 10, K = m + n + (big ? 1 : 0);
    const cTr = big ? num(p / 10) : String(p), cEn = big ? en(p / 10) : String(p);
    const lhs = `(${a}\\times 10^{${m}})\\times(${b}\\times 10^{${n}})`;
    if (r() < 0.6) return { q: `$${lhs}=${cTr}\\times 10^{k}$ ise $k$ kaçtır?`, qe: `If $${lhs}=${cEn}\\times 10^{k}$, find $k$.`, ...int(K) };
    return {
      q: `$${lhs}$ sonucunu bilimsel gösterimde $a\\times 10^{${K}}$ olarak yaz. $a$ kaçtır?`,
      qe: `Write $${lhs}$ in standard form as $a\\times 10^{${K}}$. Find $a$.`,
      ...int(big ? p / 10 : p),
    };
  },

  /* ---------- f-alg ---------- */
  fpow_like: (r) => {
    if (r() < 0.55) {
      const a = nz(r, -9, 9), b = nz(r, -9, 9), c = nz(r, -9, 9);
      const e = `${co(a, "x")}${sco(b, "x")}${sco(c, "x")}`;
      return { q: `$${e}=kx$ ise $k$ kaçtır?`, qe: `If $${e}=kx$, find $k$.`, ...int(a + b + c) };
    }
    const a = nz(r, -6, 9), b = nz(r, -6, 9), c = nz(r, -6, 9), d = nz(r, -6, 9);
    const e = `${co(a, "x")}${sco(b, "y")}${sco(c, "x")}${sco(d, "y")}`;
    if (r() < 0.5) return { q: `$${e}=px+qy$ ise $p$ kaçtır?`, qe: `If $${e}=px+qy$, find $p$.`, ...int(a + c) };
    return { q: `$${e}=px+qy$ ise $q$ kaçtır?`, qe: `If $${e}=px+qy$, find $q$.`, ...int(b + d) };
  },
  fpow_subst: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const x = nz(r, -4, 5);
      return { q: `$x=${x}$ iken $2x^2-x$ kaçtır?`, qe: `Find the value of $2x^2-x$ when $x=${x}$.`, ...int(2 * x * x - x) };
    }
    if (t === 1) {
      const a = ri(r, 1, 3), b = nz(r, -5, 5), c = nz(r, -9, 9), x = nz(r, -3, 4);
      return { q: `$x=${x}$ iken $${quad(a, b, c)}$ kaçtır?`, qe: `Find the value of $${quad(a, b, c)}$ when $x=${x}$.`, ...int(a * x * x + b * x + c) };
    }
    const s = ri(r, 1, 4);
    return {
      q: `Bir topun yüksekliği $h=20t-5t^2$ metre ($t$: saniye). $t=${s}$ iken top kaç metre yükseklikte?`,
      qe: `The height of a ball is $h=20t-5t^2$ metres ($t$ in seconds). How high is the ball when $t=${s}$?`,
      ...int(20 * s - 5 * s * s), unit: "m",
    };
  },
  fpow_dist: (r) => {
    const k = pick(r, [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), p = ri(r, 1, 5), q = nz(r, -9, 9);
    const e = `${k}(${co(p, "x")}${sc(q)})`;
    if (r() < 0.5) return { q: `$${e}=ax+b$ ise $b$ kaçtır?`, qe: `If $${e}=ax+b$, find $b$.`, ...int(k * q) };
    return { q: `$${e}=ax+b$ ise $a$ kaçtır?`, qe: `If $${e}=ax+b$, find $a$.`, ...int(k * p) };
  },
  fpow_cf: (r) => {
    const g = ri(r, 2, 9), t = ri(r, 0, 2);
    let p, q;
    do { p = ri(r, 1, 6); q = ri(r, 1, 9); } while (gcd(p, q) !== 1);
    const e = `${co(g * p, "x")}+${g * q}`;
    if (t === 0) return { q: `$${e}=${g}(${co(p, "x")}+k)$ ise $k$ kaçtır?`, qe: `If $${e}=${g}(${co(p, "x")}+k)$, find $k$.`, ...int(q) };
    if (t === 1) return { q: `$${e}$ ifadesinde paranteze alınabilecek en büyük ortak sayı (ortak çarpan) kaçtır?`, qe: `What is the highest common factor of the terms of $${e}$?`, ...int(g) };
    const b = ri(r, 2, 9);
    return { q: `$x^2+${b}x=x(x+k)$ ise $k$ kaçtır?`, qe: `If $x^2+${b}x=x(x+k)$, find $k$.`, ...int(b) };
  },
  fpow_expand: (r) => {
    const p = nz(r, -9, 9), q = nz(r, -9, 9);
    const e = `${fac(p)}${fac(q)}`;
    if (r() < 0.5) return { q: `$${e}=x^2+bx+c$ ise $b$ kaçtır?`, qe: `If $${e}=x^2+bx+c$, find $b$.`, ...int(p + q) };
    return { q: `$${e}=x^2+bx+c$ ise $c$ kaçtır?`, qe: `If $${e}=x^2+bx+c$, find $c$.`, ...int(p * q) };
  },
  fpow_sqsum: (r) => {
    const t = ri(r, 0, 2), k = ri(r, 1, 9);
    if (t === 0) return { q: `$(x+${k})^2=x^2+bx+c$ ise $b$ kaçtır?`, qe: `If $(x+${k})^2=x^2+bx+c$, find $b$.`, ...int(2 * k) };
    if (t === 1) return { q: `$(x+${k})^2=x^2+bx+c$ ise $c$ kaçtır?`, qe: `If $(x+${k})^2=x^2+bx+c$, find $c$.`, ...int(k * k) };
    const B = pick(r, [10, 20, 30, 40, 50, 100]), j = ri(r, 1, 4);
    return { q: `$${B + j}^2$ kaçtır? (İpucu: $(${B}+${j})^2$)`, qe: `Work out $${B + j}^2$. (Hint: $(${B}+${j})^2$)`, ...int((B + j) ** 2) };
  },
  fpow_sqdiff: (r) => {
    const t = ri(r, 0, 2), k = ri(r, 1, 9);
    if (t === 0) return { q: `$(x-${k})^2=x^2+bx+c$ ise $b$ kaçtır?`, qe: `If $(x-${k})^2=x^2+bx+c$, find $b$.`, ...int(-2 * k) };
    if (t === 1) return { q: `$(x-${k})^2=x^2+bx+c$ ise $c$ kaçtır?`, qe: `If $(x-${k})^2=x^2+bx+c$, find $c$.`, ...int(k * k) };
    const B = pick(r, [20, 30, 50, 100]), j = ri(r, 1, 3);
    return { q: `$${B - j}^2$ kaçtır? (İpucu: $(${B}-${j})^2$)`, qe: `Work out $${B - j}^2$. (Hint: $(${B}-${j})^2$)`, ...int((B - j) ** 2) };
  },
  fpow_dots: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const k = ri(r, 2, 12);
      return { q: `$x^2-${k * k}=(x-a)(x+a)$ ve $a>0$ ise $a$ kaçtır?`, qe: `If $x^2-${k * k}=(x-a)(x+a)$ and $a>0$, find $a$.`, ...int(k) };
    }
    if (t === 1) {
      const c = ri(r, 2, 5), k = ri(r, 1, 7);
      return { q: `$${c * c}x^2-${k * k}=(${c}x-${k})(${c}x+m)$ ise $m$ kaçtır?`, qe: `If $${c * c}x^2-${k * k}=(${c}x-${k})(${c}x+m)$, find $m$.`, ...int(k) };
    }
    const B = pick(r, [20, 30, 50, 100]), j = ri(r, 1, 4);
    return { q: `$${B + j}\\times ${B - j}$ kaçtır?`, qe: `Work out $${B + j}\\times ${B - j}$.`, ...int(B * B - j * j) };
  },
  fpow_fquad: (r) => {
    let p, q;
    do { p = nz(r, -9, 9); q = nz(r, -9, 9); } while (p + q === 0);
    const e = `x^2${sco(p + q, "x")}${sc(p * q)}`;
    const tail = q > 0 ? "(x+k)" : "(x-k)";
    return {
      q: `$${e}=${fac(p)}${tail}$ ve $k>0$ ise $k$ kaçtır?`,
      qe: `If $${e}=${fac(p)}${tail}$ and $k>0$, find $k$.`,
      ...int(Math.abs(q)),
    };
  },
  fpow_onestep: (r) => {
    const t = ri(r, 0, 3), x = ri(r, -9, 15);
    if (t === 0) {
      const a = ri(r, 2, 20);
      return { q: `$x+${a}=${x + a}$ ise $x$ kaçtır?`, qe: `Solve $x+${a}=${x + a}$.`, ...int(x) };
    }
    if (t === 1) {
      const a = ri(r, 2, 20);
      return { q: `$x-${a}=${x - a}$ ise $x$ kaçtır?`, qe: `Solve $x-${a}=${x - a}$.`, ...int(x) };
    }
    if (t === 2) {
      const a = ri(r, 2, 9);
      return { q: `$${a}x=${a * x}$ ise $x$ kaçtır?`, qe: `Solve $${a}x=${a * x}$.`, ...int(x) };
    }
    const a = ri(r, 2, 9);
    return { q: `$\\dfrac{x}{${a}}=${x}$ ise $x$ kaçtır?`, qe: `Solve $\\dfrac{x}{${a}}=${x}$.`, ...int(a * x) };
  },
  fpow_lin: (r) => {
    if (r() < 0.6) {
      const a = ri(r, 2, 9), x = ri(r, -6, 12), b = nz(r, -15, 15);
      return { q: `$${a}x${sc(b)}=${a * x + b}$ ise $x$ kaçtır?`, qe: `Solve $${a}x${sc(b)}=${a * x + b}$.`, ...int(x) };
    }
    const F = pick(r, [10, 15, 20]), p = ri(r, 3, 8), d = ri(r, 2, 15);
    return {
      q: `Bir taksi binişte $${F}$ TL alıyor, sonra her kilometre için $${p}$ TL ekliyor. Yolculuk $${F + p * d}$ TL tuttu. Kaç km gidildi?`,
      qe: `A taxi charges $${F}$ TL to start and then $${p}$ TL per kilometre. A ride costs $${F + p * d}$ TL. How many kilometres was the ride?`,
      ...int(d), unit: "km",
    };
  },
  fpow_subj: (r) => {
    if (r() < 0.5) {
      const m = ri(r, 2, 6), c = nz(r, -10, 10), x = ri(r, -5, 10);
      return { q: `$y=${m}x${sc(c)}$ formülünde $y=${m * x + c}$ iken $x$ kaçtır?`, qe: `In the formula $y=${m}x${sc(c)}$, find $x$ when $y=${m * x + c}$.`, ...int(x) };
    }
    const C = 5 * ri(r, -4, 8), F = (9 * C) / 5 + 32;
    return {
      q: `Sıcaklık formülü $F=1{,}8C+32$. $F=${F}$ iken $C$ kaçtır?`,
      qe: `The temperature formula is $F=1.8C+32$. Find $C$ when $F=${F}$.`,
      ...int(C), unit: "°C",
    };
  },
  fpow_sqeq: (r) => {
    const k = ri(r, 2, 12), t = ri(r, 0, 3);
    if (t === 0) return { q: `$x^2=${k * k}$ denkleminin pozitif çözümü kaçtır?`, qe: `Find the positive solution of $x^2=${k * k}$.`, ...int(k) };
    if (t === 1) return { q: `$x^2=${k * k}$ denkleminin negatif çözümü kaçtır?`, qe: `Find the negative solution of $x^2=${k * k}$.`, ...int(-k) };
    if (t === 2) {
      const c = ri(r, 1, 20);
      return { q: `$x^2-${c}=${k * k - c}$ denkleminin pozitif çözümü kaçtır?`, qe: `Find the positive solution of $x^2-${c}=${k * k - c}$.`, ...int(k) };
    }
    const a = pick(r, [2, 3, 5]), s = ri(r, 1, 6);
    return { q: `$${a}x^2=${a * s * s}$ denkleminin negatif çözümü kaçtır?`, qe: `Find the negative solution of $${a}x^2=${a * s * s}$.`, ...int(-s) };
  },
  fpow_zp: (r) => {
    if (r() < 0.25) {
      const b = ri(r, 2, 12);
      return { q: `$x(x-${b})=0$ denkleminin sıfırdan farklı çözümü kaçtır?`, qe: `Find the non-zero solution of $x(x-${b})=0$.`, ...int(b) };
    }
    let p, q;
    do { p = nz(r, -9, 9); q = nz(r, -9, 9); } while (p === q);
    const e = `${fac(-p)}${fac(-q)}=0`;
    if (r() < 0.5) return { q: `$${e}$ denkleminin büyük olan çözümü kaçtır?`, qe: `Find the larger solution of $${e}$.`, ...int(Math.max(p, q)) };
    return { q: `$${e}$ denkleminin küçük olan çözümü kaçtır?`, qe: `Find the smaller solution of $${e}$.`, ...int(Math.min(p, q)) };
  },
  fpow_ineqs: (r) => {
    const t = ri(r, 0, 2);
    if (t === 0) {
      const a = ri(r, 2, 15), k = ri(r, -5, 15);
      return { q: `$x+${a}<${k + a}$ eşitsizliğinin çözümü $x<k$ ise $k$ kaçtır?`, qe: `The solution of $x+${a}<${k + a}$ is $x<k$. Find $k$.`, ...int(k) };
    }
    if (t === 1) {
      const a = ri(r, 2, 15), k = ri(r, -5, 15);
      return { q: `$x-${a}\\ge ${k - a}$ eşitsizliğinin çözümü $x\\ge k$ ise $k$ kaçtır?`, qe: `The solution of $x-${a}\\ge ${k - a}$ is $x\\ge k$. Find $k$.`, ...int(k) };
    }
    const a = ri(r, 2, 6), b = nz(r, -9, 9), k = ri(r, -4, 8);
    return {
      q: `$${a}x${sc(b)}\\le ${a * k + b}$ eşitsizliğini sağlayan en büyük tam sayı $x$ kaçtır?`,
      qe: `Find the largest integer $x$ that satisfies $${a}x${sc(b)}\\le ${a * k + b}$.`,
      ...int(k),
    };
  },
  fpow_ineq: (r) => {
    const a = ri(r, 2, 6), B = ri(r, -6, 6), t = ri(r, 0, 2);
    if (t === 0) {
      /* -a·x < -a·B  →  x > B  →  en küçük tam sayı B + 1 */
      const rhs = -a * B || 0;
      return {
        q: `$-${a}x<${rhs}$ eşitsizliğini sağlayan en küçük tam sayı $x$ kaçtır?`,
        qe: `Find the smallest integer $x$ that satisfies $-${a}x<${rhs}$.`,
        ...int(B + 1),
      };
    }
    if (t === 1) {
      /* -a·x + c ≥ -a·B + c  →  x ≤ B  →  en büyük tam sayı B */
      const c = nz(r, -9, 9), rhs = -a * B + c;
      return {
        q: `$-${a}x${sc(c)}\\ge ${rhs}$ eşitsizliğini sağlayan en büyük tam sayı $x$ kaçtır?`,
        qe: `Find the largest integer $x$ that satisfies $-${a}x${sc(c)}\\ge ${rhs}$.`,
        ...int(B),
      };
    }
    /* c - x > c - B  →  x < B  →  en büyük tam sayı B - 1 */
    const c = ri(r, 1, 12);
    return {
      q: `$${c}-x>${c - B}$ eşitsizliğini sağlayan en büyük tam sayı $x$ kaçtır?`,
      qe: `Find the largest integer $x$ that satisfies $${c}-x>${c - B}$.`,
      ...int(B - 1),
    };
  },
  fpow_sim: (r) => {
    const t = ri(r, 0, 4);
    if (t <= 1) {
      const x = ri(r, -5, 12), y = ri(r, -5, 12);
      const tr = `$x+y=${x + y}$ ve $x-y=${x - y}$`, enS = `$x+y=${x + y}$ and $x-y=${x - y}$`;
      if (t === 0) return { q: `${tr} ise $x$ kaçtır?`, qe: `If ${enS}, find $x$.`, ...int(x) };
      return { q: `${tr} ise $y$ kaçtır?`, qe: `If ${enS}, find $y$.`, ...int(y) };
    }
    if (t === 2) {
      const big = ri(r, 10, 40), small = ri(r, 1, big - 1);
      return {
        q: `İki sayının toplamı $${big + small}$, farkı $${big - small}$. Büyük sayı kaçtır?`,
        qe: `Two numbers add up to $${big + small}$ and their difference is $${big - small}$. What is the larger number?`,
        ...int(big),
      };
    }
    if (t === 3) {
      const p = ri(r, 5, 20), n = ri(r, 10, 40);
      return {
        q: `2 kalem ve 1 defter $${2 * p + n}$ TL; 1 kalem ve 1 defter $${p + n}$ TL. Bir kalem kaç TL?`,
        qe: `2 pens and 1 notebook cost $${2 * p + n}$ TL; 1 pen and 1 notebook cost $${p + n}$ TL. How much is one pen?`,
        ...int(p), unit: "TL",
      };
    }
    const x = ri(r, 1, 9), y = ri(r, 1, 9);
    return { q: `$2x+y=${2 * x + y}$ ve $x-y=${x - y}$ ise $x$ kaçtır?`, qe: `If $2x+y=${2 * x + y}$ and $x-y=${x - y}$, find $x$.`, ...int(x) };
  },
};
