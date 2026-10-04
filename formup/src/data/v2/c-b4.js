/* FormUp v2 — parça "b4": Konu 4 · İstatistik ve Olasılık (b4, kitapçık 4.2–4.12) + İstatistik: Kitapçık Dışı (x4).
   Kartlar öğretme sırasıyla (kolaydan zora). Biçim: content/SPEC.md */
import { ri, pick, fr, int, nCr } from "./genkit.js";

export const CARDS = String.raw`
## b4

# b4-iqr | 3 | Çeyrekler açıklığı | Interquartile range
L \mathrm{IQR}
R Q_3-Q_1
X Q_1-Q_3 ;; Q_3+Q_1 ;; \max-\min
K $Q_1$: alt çeyrek (verinin %25’i altında), $Q_3$: üst çeyrek (verinin %75’i altında)
KE $Q_1$: lower quartile, $Q_3$: upper quartile
U Verinin ortadaki yarısının ne kadar yayıldığını ölçer.
UE Measures how spread out the middle half of the data is.
W $Q_1$ ile $Q_3$ arasında verinin tam ortadaki %50’si durur. Uç değerler bu farkı bozmaz.
WE The middle 50% of the data lies between $Q_1$ and $Q_3$, so extreme values do not affect it.
E $Q_1=12$, $Q_3=20$ ise $\mathrm{IQR}=20-12=8$.
H Büyük çeyrek eksi küçük çeyrek.
T interquartile range = çeyrekler açıklığı ;; lower quartile = alt çeyrek ;; upper quartile = üst çeyrek
Q Bir sınıfın sınav notlarında alt çeyrek 45, üst çeyrek 70. Ortadaki öğrencilerin notları ne kadar yayılmış?
QE In a class's test scores the lower quartile is 45 and the upper quartile is 70. How spread out are the middle scores?
B [[Q_3]]-[[Q_1]] || Q_2 ;; \min ;; \max
C Q1=12:0:50:1 ; Q3=20:0:100:1 => Q3-Q1
CT \mathrm{IQR}=@Q3@-@Q1@=@=@
G b4_iqr
LAB boxplot
BK 4.2

# b4-freq-n | 2 | Frekans tablosunda veri sayısı | Number of data values in a frequency table
L n
R \sum_{i=1}^{k} f_i
X \sum_{i=1}^{k} x_i ;; \sum_{i=1}^{k} f_i x_i ;; k
K $f_i$: $i$. değerin frekansı (kaç kez geçtiği), $k$: farklı değer sayısı
KE $f_i$: frequency of the $i$th value, $k$: number of different values
U Frekans tablosunda toplam kaç veri olduğunu bulur.
UE Finds the total number of data values in a frequency table.
W Her değer $f_i$ kez tekrar ediyor; tüm frekansları toplayınca toplam veri sayısı çıkar.
WE Each value appears $f_i$ times, so adding all the frequencies gives the total count.
E Frekanslar $3,\ 5,\ 2$ ise $n=3+5+2=10$.
T frequency = frekans, sıklık ;; frequency table = frekans tablosu
Q Bir ankette 4 kişi 1 kardeşim var, 7 kişi 2, 3 kişi 3 kardeşim var dedi. Ankete kaç kişi katıldı?
QE In a survey 4 people said they have 1 sibling, 7 said 2 and 3 said 3. How many people took part?
B \sum_{i=1}^{k} [[f_i]] || x_i ;; f_i x_i ;; k
C f1=3:0:20:1 ; f2=5:0:20:1 ; f3=2:0:20:1 => f1+f2+f3
CT n=@f1@+@f2@+@f3@=@=@
BK 4.3

# b4-mean | 3 | Frekans tablosundan ortalama | Mean of a set of data
L \bar{x}
R \dfrac{\sum_{i=1}^{k} f_i x_i}{n}
X \dfrac{\sum_{i=1}^{k} x_i}{k} ;; \dfrac{\sum_{i=1}^{k} f_i}{n} ;; \dfrac{\sum_{i=1}^{k} f_i x_i}{k}
K $x_i$: değer, $f_i$: frekansı, $n=\sum f_i$: toplam veri sayısı
KE $x_i$: data value, $f_i$: its frequency, $n=\sum f_i$: total number of values
U Frekans tablosu verilen verinin ortalamasını bulur.
UE Finds the mean of data given in a frequency table.
W Her değeri kaç kez geçtiyse o kadar sayarsın ($f_i x_i$), hepsini toplar ve toplam kişi sayısına bölersin.
WE Each value is counted as many times as it occurs ($f_i x_i$); add them up and divide by the total number of values.
E $x$: 1, 2, 3; $f$: 2, 5, 3. $\bar{x}=\dfrac{2+10+9}{10}=2{,}1$.
H Önce çarp ($f\cdot x$), sonra topla, en son $n$’ye böl.
T mean = ortalama ;; frequency = frekans ;; sigma notation = toplam sembolü
Q 10 öğrencinin 2’si 1 kitap, 5’i 2 kitap, 3’ü 3 kitap okudu. Öğrenci başına ortalama kaç kitap okundu?
QE Of 10 students, 2 read 1 book, 5 read 2 books and 3 read 3 books. What is the average number of books per student?
B \dfrac{\sum_{i=1}^{k} [[f_i x_i]]}{[[n]]} || x_i ;; f_i ;; k
C f1=2:0:10:1 ; f2=5:1:10:1 ; f3=3:0:10:1 => (f1*1+f2*2+f3*3)/(f1+f2+f3)
CT \bar{x}=\dfrac{@f1@\cdot 1+@f2@\cdot 2+@f3@\cdot 3}{@f1@+@f2@+@f3@}=@=@
G b4_mean
BK 4.3

# b4-prob | 3 | Bir olayın olasılığı | Probability of an event
L \mathrm{P}(A)
R \dfrac{n(A)}{n(U)}
X \dfrac{n(U)}{n(A)} ;; n(A)-n(U) ;; \dfrac{n(A)}{n(U)-n(A)}
K $n(A)$: $A$ olayındaki sonuç sayısı, $n(U)$: tüm olası sonuçların sayısı (sonuçlar eşit olasılıklı)
KE $n(A)$: number of outcomes in event $A$, $n(U)$: number of outcomes in the sample space (equally likely outcomes)
U Bir şeyin olma şansını sayarak hesaplar.
UE Works out the chance of an event by counting outcomes.
W İstediğin sonuçları sayarsın, tüm sonuçlara bölersin. Sonuç 0 ile 1 arasındadır.
WE Count the outcomes you want and divide by all possible outcomes; the answer is between 0 and 1.
E Zarda çift sayı: $\mathrm{P}=\dfrac{3}{6}=\dfrac{1}{2}$.
H İstenen bölü tüm.
T probability = olasılık ;; event = olay ;; sample space = örnek uzay
Q Bir torbada 3 kırmızı ve 7 mavi bilye var. Rastgele çekilen bilyenin kırmızı olma şansı nedir?
QE A bag has 3 red and 7 blue marbles. What is the chance that a randomly chosen marble is red?
B \dfrac{[[n(A)]]}{[[n(U)]]} || n(A') ;; \mathrm{P}(A) ;; 1
C nA=3:0:20:1 ; nU=10:10:40:1 => nA/nU
CT \mathrm{P}(A)=\dfrac{@nA@}{@nU@}=@=@
G b4_prob
LAB venn
BK 4.5

# b4-comp | 3 | Tümleyen olaylar | Complementary events
L \mathrm{P}(A)+\mathrm{P}(A')
R 1
X 0 ;; \dfrac{1}{2} ;; 2\,\mathrm{P}(A)
K $A'$: $A$’nın olmaması (tümleyeni)
KE $A'$: the complement of $A$ ($A$ does not happen)
U Bir şeyin olmama olasılığını, olma olasılığından bulur: $\mathrm{P}(A')=1-\mathrm{P}(A)$.
UE Finds the probability that an event does not happen: $\mathrm{P}(A')=1-\mathrm{P}(A)$.
W Ya olur ya olmaz; ikisinden biri kesin gerçekleşir. Kesin olayın olasılığı 1’dir.
WE Either $A$ happens or it does not, and one of them is certain, so the probabilities add to 1.
E Yağmur yağma olasılığı $0{,}3$ ise yağmama olasılığı $1-0{,}3=0{,}7$.
H Olur + olmaz = kesin = 1.
T complementary events = tümleyen olaylar ;; complement = tümleyen
Q Bir otobüsün geç gelme olasılığı $0{,}15$. Zamanında gelme olasılığı nedir?
QE The probability that a bus is late is $0{,}15$. What is the probability it is not late?
C P=0.3:0:1:0.05 => 1-P
CT \mathrm{P}(A')=1-@P@=@=@
G b4_comp
LAB venn
BK 4.5

# b4-union | 3 | Birleşik olaylar (ya da) | Combined events
L \mathrm{P}(A\cup B)
R \mathrm{P}(A)+\mathrm{P}(B)-\mathrm{P}(A\cap B)
X \mathrm{P}(A)+\mathrm{P}(B) ;; \mathrm{P}(A)+\mathrm{P}(B)+\mathrm{P}(A\cap B) ;; \mathrm{P}(A)\,\mathrm{P}(B)
K $A\cup B$: $A$ ya da $B$ (ya da ikisi), $A\cap B$: $A$ ve $B$ birlikte
KE $A\cup B$: $A$ or $B$ (or both), $A\cap B$: both $A$ and $B$
U İki olaydan en az birinin olma olasılığını bulur.
UE Finds the probability that at least one of two events happens.
W Venn şemasında ortak bölge iki kez sayılır; bu yüzden bir kez çıkarırsın.
WE In a Venn diagram the overlap is counted twice, so you subtract it once.
E $\mathrm{P}(A)=0{,}5$, $\mathrm{P}(B)=0{,}4$, $\mathrm{P}(A\cap B)=0{,}2$ ise $\mathrm{P}(A\cup B)=0{,}7$.
H Topla, ortağı bir kez çıkar.
T union = birleşim ;; intersection = kesişim ;; Venn diagram = Venn şeması
Q Bir sınıfta öğrencilerin %60’ı futbol, %50’si basketbol seviyor, %30’u ikisini de. Rastgele bir öğrencinin en az birini sevme olasılığı nedir?
QE In a class 60% like football, 50% like basketball and 30% like both. What is the probability a random student likes at least one?
B \mathrm{P}(A)+\mathrm{P}(B)[[-]]\mathrm{P}([[A\cap B]]) || + ;; A\cup B ;; \times
C PA=0.5:0:1:0.05 ; PB=0.4:0:1:0.05 ; PAB=0.2:0:0.5:0.05 => PA+PB-PAB
CT \mathrm{P}(A\cup B)=@PA@+@PB@-@PAB@=@=@
G b4_union
LAB venn
BK 4.6

# b4-mutex | 3 | Ayrık olaylarda birleşim | Mutually exclusive events
L \mathrm{P}(A\cup B)
R \mathrm{P}(A)+\mathrm{P}(B)
X \mathrm{P}(A)\,\mathrm{P}(B) ;; \mathrm{P}(A)+\mathrm{P}(B)-1 ;; \mathrm{P}(A)-\mathrm{P}(B)
K Yalnızca $A$ ile $B$ ayrık ise (aynı anda olamıyorsa) geçerli.
KE Only when $A$ and $B$ are mutually exclusive (cannot happen together).
U Aynı anda olamayan iki olaydan birinin olma olasılığını bulur.
UE Finds the probability of either of two events that cannot happen together.
W Ortak bölge boş, yani çıkarılacak bir şey yok; sadece toplarsın.
WE There is no overlap, so nothing is counted twice; just add.
E Zarda 1 ya da 6: $\dfrac{1}{6}+\dfrac{1}{6}=\dfrac{1}{3}$.
T mutually exclusive = ayrık (bağdaşmaz) ;; union = birleşim
Q Bir zar atılıyor. 2 ya da 5 gelme olasılığı nedir?
QE A die is rolled. What is the probability of getting a 2 or a 5?
B \mathrm{P}(A)[[+]]\mathrm{P}(B) || - ;; \times
C PA=0.2:0:0.5:0.05 ; PB=0.3:0:0.5:0.05 => PA+PB
CT \mathrm{P}(A\cup B)=@PA@+@PB@=@=@
G b4_mutex
LAB venn
BK 4.6

# b4-cond | 3 | Koşullu olasılık | Conditional probability
L \mathrm{P}(A|B)
R \dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(B)}
X \dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(A)} ;; \mathrm{P}(A)\,\mathrm{P}(B) ;; \dfrac{\mathrm{P}(A)}{\mathrm{P}(B)}
K $\mathrm{P}(A|B)$: “$B$ olduğu bilindiğine göre $A$’nın olasılığı”. $\mathrm{P}(B)\ne 0$
KE $\mathrm{P}(A|B)$: probability of $A$ given $B$; $\mathrm{P}(B)\ne 0$
U Bir bilgi verildiğinde (B oldu) olasılığı yeniden hesaplar.
UE Updates a probability when you know that $B$ has happened.
W $B$ olduysa artık evren $B$’dir. Bu yeni evrende $A$’nın payı, ortak bölge bölü $B$’dir.
WE Once $B$ has happened, $B$ becomes the new sample space, so divide the overlap by $\mathrm{P}(B)$.
E $\mathrm{P}(A\cap B)=0{,}2$, $\mathrm{P}(B)=0{,}5$ ise $\mathrm{P}(A|B)=0{,}4$.
H Çizginin sağındaki olay paydaya gider.
T conditional probability = koşullu olasılık ;; given = verildiğinde, bilindiğine göre
Q Bir okulda öğrencilerin %40’ı kız, %10’u hem kız hem gözlüklü. Seçilen öğrencinin kız olduğu biliniyor; gözlüklü olma olasılığı nedir?
QE In a school 40% of students are girls and 10% are girls who wear glasses. A chosen student is a girl. What is the probability she wears glasses?
B \dfrac{\mathrm{P}([[A\cap B]])}{\mathrm{P}([[B]])} || A ;; A\cup B
C PAB=0.2:0:0.5:0.05 ; PB=0.5:0.5:1:0.05 => PAB/PB
CT \mathrm{P}(A|B)=\dfrac{@PAB@}{@PB@}=@=@
G b4_cond
LAB venn
BK 4.6

# b4-indep | 3 | Bağımsız olaylar | Independent events
L \mathrm{P}(A\cap B)
R \mathrm{P}(A)\,\mathrm{P}(B)
X \mathrm{P}(A)+\mathrm{P}(B) ;; 0 ;; \dfrac{\mathrm{P}(A)}{\mathrm{P}(B)}
K Yalnızca $A$ ile $B$ bağımsızsa (biri diğerini etkilemiyorsa) geçerli.
KE Only when $A$ and $B$ are independent (one does not affect the other).
U İki bağımsız olayın birlikte olma olasılığını bulur.
UE Finds the probability that two independent events both happen.
W Para tura gelince zarın ne geleceği değişmez. “Ve” için olasılıkları çarparsın.
WE A coin landing tails does not change the die, so for “and” you multiply.
E Yazı ve 6: $\dfrac{1}{2}\cdot\dfrac{1}{6}=\dfrac{1}{12}$.
H Bağımsız + “ve” = çarp.
T independent events = bağımsız olaylar ;; intersection = kesişim
Q Bir para ve bir zar atılıyor. Paranın yazı, zarın 6 gelme olasılığı nedir?
QE A coin is tossed and a die is rolled. What is the probability of heads and a 6?
C PA=0.5:0:1:0.05 ; PB=0.4:0:1:0.05 => PA*PB
CT \mathrm{P}(A\cap B)=@PA@\cdot @PB@=@=@
G b4_indep
LAB venn
BK 4.6

# b4-ev | 3 | Beklenen değer | Expected value of a discrete random variable
L \mathrm{E}(X)
R \sum x_i\,\mathrm{P}(X=x_i)
X \sum x_i ;; \sum \mathrm{P}(X=x_i) ;; \dfrac{\sum x_i}{n}
K $x_i$: $X$’in alabileceği değerler, $\mathrm{P}(X=x_i)$: her birinin olasılığı
KE $x_i$: possible values of $X$, $\mathrm{P}(X=x_i)$: their probabilities
U Çok kez tekrarlarsan ortalama ne çıkacağını söyler.
UE Gives the long-run average value of $X$.
W Her değeri ne kadar sık geldiğiyle (olasılığıyla) ağırlıklandırıp toplarsın; bu olasılıkla ortalamadır.
WE Each value is weighted by how likely it is, giving a probability-weighted average.
E $X$: 0, 10; olasılıklar $0{,}8$, $0{,}2$. $\mathrm{E}(X)=0+2=2$.
H Değer × olasılık, hepsini topla.
T expected value = beklenen değer ;; discrete random variable = kesikli rastgele değişken
Q Bir oyunda %20 ihtimalle 10 TL, %80 ihtimalle 0 TL kazanıyorsun. Uzun vadede oyun başına ortalama ne kazanırsın?
QE In a game you win 10 lira with probability 0.2 and nothing otherwise. On average how much do you win per game?
B \sum [[x_i]]\,\mathrm{P}(X=[[x_i]]) || 1 ;; n
C x1=0:-10:10:1 ; p1=0.8:0:1:0.05 ; x2=10:-10:20:1 => x1*p1+x2*(1-p1)
CT \mathrm{E}(X)=@x1@\cdot @p1@+@x2@\cdot(1-@p1@)=@=@
G b4_ev
BK 4.7

# b4-bin-mean | 3 | Binom dağılımının ortalaması | Mean of the binomial distribution
L \mathrm{E}(X)
R np
X n+p ;; np(1-p) ;; \dfrac{n}{p}
K $X\sim \mathrm{B}(n,\ p)$: $n$ deneme, her denemede başarı olasılığı $p$
KE $X\sim \mathrm{B}(n,\ p)$: $n$ trials, probability of success $p$ in each trial
U Binom durumda ortalama kaç başarı beklendiğini bulur.
UE Finds the expected number of successes in a binomial situation.
W Her denemede ortalama $p$ başarı gelir; $n$ denemede $n$ kere $p$.
WE Each trial gives on average $p$ successes, so $n$ trials give $np$.
E 20 soruyu tahminle cevaplıyorsun, $p=0{,}25$: $\mathrm{E}(X)=5$.
T binomial distribution = binom dağılımı ;; trial = deneme ;; success = başarı
Q Bir okçu her atışta hedefi $0{,}7$ olasılıkla vuruyor. 30 atışta ortalama kaç kez vurmasını beklersin?
QE An archer hits the target with probability $0{,}7$ on each shot. How many hits do you expect in 30 shots?
B [[n]][[p]] || 1-p ;; r
C n=20:1:50:1 ; p=0.25:0:1:0.05 => n*p
CT \mathrm{E}(X)=@n@\cdot @p@=@=@
G b4_binmean
LAB binomial
BK 4.8

# b4-bin-var | 2 | Binom dağılımının varyansı | Variance of the binomial distribution
L \mathrm{Var}(X)
R np(1-p)
X np ;; np^2 ;; n(1-p)
K $X\sim \mathrm{B}(n,\ p)$
KE $X\sim \mathrm{B}(n,\ p)$
U Binom dağılımında başarı sayısının ne kadar dağıldığını ölçer.
UE Measures how spread out the number of successes is in a binomial distribution.
W Ortalamaya ($np$) başarısızlık olasılığı $(1-p)$ da katılır. $p$ 0 ya da 1’e yakınsa sonuç hemen hemen kesindir, varyans küçük olur.
WE The mean $np$ is multiplied by the failure probability $1-p$; if $p$ is near 0 or 1 the outcome is nearly certain, so the variance is small.
E $n=20$, $p=0{,}25$: $20\cdot 0{,}25\cdot 0{,}75=3{,}75$.
H Ortalama × başarısızlık.
T variance = varyans ;; standard deviation = standart sapma
Q Bir fabrikada ürünlerin %10’u kusurlu. 100 üründen kusurlu sayısının varyansı nedir?
QE In a factory 10% of items are faulty. Find the variance of the number of faulty items in 100.
B np([[1-p]]) || p ;; 1+p
C n=20:1:50:1 ; p=0.25:0:1:0.05 => n*p*(1-p)
CT \mathrm{Var}(X)=@n@\cdot @p@\cdot(1-@p@)=@=@
G b4_binvar
LAB binomial
BK 4.8

# b4-z | 3 | Standart normal değişken | Standardized normal variable
L z
R \dfrac{x-\mu}{\sigma}
X \dfrac{\mu-x}{\sigma} ;; \dfrac{x-\sigma}{\mu} ;; (x-\mu)\,\sigma
K $\mu$: ortalama, $\sigma$: standart sapma, $X\sim \mathrm{N}(\mu,\ \sigma^2)$
KE $\mu$: mean, $\sigma$: standard deviation, $X\sim \mathrm{N}(\mu,\ \sigma^2)$
U Bir değerin ortalamadan kaç standart sapma uzakta olduğunu söyler.
UE Tells you how many standard deviations a value is from the mean.
W Önce ortalamadan farkı bulursun, sonra bu farkın kaç “$\sigma$ adımı” olduğunu bölerek görürsün.
WE Find the distance from the mean, then divide to see how many standard deviations that is.
E $\mu=50$, $\sigma=10$, $x=65$: $z=1{,}5$.
H Fark bölü sapma.
T standardized normal variable = standart normal değişken ;; z-score = z değeri ;; normal distribution = normal dağılım
Q Sınav ortalaması 60, standart sapma 8. 76 alan Ali, ortalamanın kaç standart sapma üstünde?
QE A test has mean 60 and standard deviation 8. How many standard deviations above the mean is Ali's score of 76?
B \dfrac{x-[[\mu]]}{[[\sigma]]} || x ;; \sigma^2
C x=65:0:100:1 ; mu=50:0:100:1 ; s=10:1:20:1 => (x-mu)/s
CT z=\dfrac{@x@-@mu@}{@s@}=@=@
G b4_z
LAB normal
BK 4.12

## x4

# x4-mean-raw | 3 | Ham verinin ortalaması | Mean of raw data
L \bar{x}
R \dfrac{\sum x}{n}
X \dfrac{n}{\sum x} ;; \sum x ;; \dfrac{\max+\min}{2}
K $n$: veri sayısı
KE $n$: number of data values
U Bir veri listesinin ortalamasını bulur.
UE Finds the mean of a list of data.
W Hepsini topla ve eşit paylaştır: kişi başına düşen miktar.
WE Add everything up and share it equally.
E $4,\ 6,\ 11$: $\bar{x}=\dfrac{21}{3}=7$.
T mean = ortalama ;; raw data = ham veri
Q Beş arkadaşın cep harçlıkları 20, 30, 25, 40, 35 TL. Kişi başına ortalama ne kadar?
QE Five friends have 20, 30, 25, 40 and 35 lira pocket money. What is the average?
B \dfrac{[[\sum x]]}{[[n]]} || x ;; 2
C a=4:0:20:1 ; b=6:0:20:1 ; c=11:0:20:1 => (a+b+c)/3
CT \bar{x}=\dfrac{@a@+@b@+@c@}{3}=@=@
G b4_meanraw
BK 0.0

# x4-median | 3 | Medyanın yeri | Position of the median
L ~Sıralı $n$ verinin medyanının sırası
O :
R \dfrac{n+1}{2}
X \dfrac{n}{2} ;; \dfrac{n-1}{2} ;; n+\dfrac{1}{2}
K Önce veriyi küçükten büyüğe sırala. Sonuç ondalık (ör. 4,5) ise iki ortadaki değerin ortalamasını al.
KE Order the data first. If the position is not whole (e.g. 4.5), take the mean of the two middle values.
U Ortadaki değeri (median) bulmak için kaçıncı sıraya bakacağını söyler.
UE Tells you which position holds the median.
W Ortanca değerin iki yanında eşit sayıda veri olmalı.
WE The median has the same number of values on each side.
E $n=9$: 5. değer. $n=10$: 5. ve 6. değerin ortalaması.
T median = medyan, ortanca ;; ordered data = sıralı veri
Q 11 öğrencinin boyları küçükten büyüğe dizildi. Ortadaki öğrenci kaçıncı sırada?
QE The heights of 11 students are put in order. In which position is the middle student?
B \dfrac{n+[[1]]}{[[2]]} || 0 ;; n
C n=9:1:50:1 => (n+1)/2
CT \dfrac{@n@+1}{2}=@=@
G b4_median
LAB boxplot
BK 0.0

# x4-mode | 2 | Mod (tepe değer) | Mode
L ~Mod (mode)
O :
R ~En sık tekrar eden değer
X ~Ortadaki değer ;; ~En büyük değer ;; ~Değerlerin ortalaması
KE The mode is the most frequent value; a data set can have more than one mode.
U Verideki en popüler değeri bulur.
UE Finds the most common value in the data.
W “Moda olan” değer, en çok görülen değerdir.
WE The value that is “in fashion” is the one seen most often.
E $2,\ 3,\ 3,\ 5,\ 7$: mod $3$.
H Mod = moda = en çok giyilen.
T mode = mod, tepe değer ;; frequency = frekans
Q Bir mağaza en çok hangi ayakkabı numarasının satıldığını öğrenmek istiyor.
QE A shop wants to know which shoe size sells most often.
BK 0.0

# x4-range | 2 | Açıklık | Range
L \text{range}
R \max-\min
X \max+\min ;; Q_3-Q_1 ;; \dfrac{\max-\min}{2}
KE Range = largest value − smallest value.
U Verinin ne kadar geniş bir aralığa yayıldığını hızlıca gösterir.
UE Quickly shows how widely the data is spread.
W En büyükten en küçüğe olan mesafe.
WE The distance from the smallest to the largest value.
E $3,\ 8,\ 15$: açıklık $12$.
T range = açıklık ;; maximum = en büyük ;; minimum = en küçük
Q Bir hafta boyunca sıcaklıklar 12°C ile 27°C arasında değişti. Sıcaklıklar ne kadar dağılmış?
QE During one week temperatures varied between 12°C and 27°C. How spread out were they?
B [[\max]]-[[\min]] || Q_3 ;; Q_1
C mx=15:0:100:1 ; mn=3:0:50:1 => mx-mn
CT @mx@-@mn@=@=@
G b4_range
LAB boxplot
BK 0.0

# x4-out-low | 2 | Aykırı değer: alt sınır | Outlier: lower boundary
L ~Bu değerin altındaki veri aykırı değerdir
O :
R Q_1-1.5\times\mathrm{IQR}
X Q_1-\mathrm{IQR} ;; Q_1+1.5\times\mathrm{IQR} ;; Q_3-1.5\times\mathrm{IQR}
KE A value below $Q_1-1.5\times\mathrm{IQR}$ is an outlier.
U Diğerlerinden çok küçük, “tuhaf” bir değeri yakalar.
UE Detects a value that is unusually small.
W Kutunun altına bir buçuk kutu boyu kadar mesafe bırakırsın; daha aşağıdakiler aykırıdır.
WE You allow one and a half box lengths below the box; anything further is an outlier.
E $Q_1=10$, $\mathrm{IQR}=8$: sınır $10-12=-2$.
H 1,5 kutu boyu dışarı.
T outlier = aykırı değer ;; interquartile range = çeyrekler açıklığı
Q Notlarda $Q_1=40$, $Q_3=60$. 5 alan bir öğrencinin notu “tuhaf” sayılır mı?
QE In test scores $Q_1=40$ and $Q_3=60$. Is a score of 5 unusual?
B Q_1-[[1.5]]\times[[\mathrm{IQR}]] || 2 ;; Q_3
C Q1=10:0:50:1 ; Q3=18:0:100:1 => Q1-1.5*(Q3-Q1)
CT @Q1@-1{,}5\times(@Q3@-@Q1@)=@=@
G b4_outlier
LAB boxplot
BK 0.0

# x4-out-high | 2 | Aykırı değer: üst sınır | Outlier: upper boundary
L ~Bu değerin üstündeki veri aykırı değerdir
O :
R Q_3+1.5\times\mathrm{IQR}
X Q_3+\mathrm{IQR} ;; Q_3-1.5\times\mathrm{IQR} ;; Q_1+1.5\times\mathrm{IQR}
KE A value above $Q_3+1.5\times\mathrm{IQR}$ is an outlier.
U Diğerlerinden çok büyük, “tuhaf” bir değeri yakalar.
UE Detects a value that is unusually large.
W Kutunun üstüne bir buçuk kutu boyu mesafe bırakırsın; daha yukarıdakiler aykırıdır.
WE You allow one and a half box lengths above the box; anything further is an outlier.
E $Q_3=18$, $\mathrm{IQR}=8$: sınır $18+12=30$.
T outlier = aykırı değer ;; upper quartile = üst çeyrek
Q Maaşlarda $Q_1=20$, $Q_3=30$ (bin TL). 90 bin TL kazanan biri aykırı mı?
QE In salaries $Q_1=20$ and $Q_3=30$ (thousand). Is a salary of 90 thousand an outlier?
B Q_3+[[1.5]]\times[[\mathrm{IQR}]] || 2 ;; Q_1
C Q1=10:0:50:1 ; Q3=18:0:100:1 => Q3+1.5*(Q3-Q1)
CT @Q3@+1{,}5\times(@Q3@-@Q1@)=@=@
G b4_outlier
LAB boxplot
BK 0.0

# x4-shift | 2 | Her veriye $k$ eklemek | Adding a constant to every value
L ~Her veriye $k$ eklenirse
O \Rightarrow
R ~Ortalama $k$ artar, standart sapma aynı kalır
X ~İkisi de $k$ artar ;; ~Ortalama aynı, standart sapma $k$ artar ;; ~İkisi de değişmez
KE Adding $k$ to every value: the mean increases by $k$, the standard deviation is unchanged.
U Veri hep birlikte kayınca ölçülerin nasıl değiştiğini söyler.
UE Says how the statistics change when all data shift by $k$.
W Herkes aynı miktar ilerler; aralarındaki mesafeler değişmez, yayılım aynı kalır.
WE Everything moves together, so the gaps between values (the spread) stay the same.
E $2,\ 4,\ 6$ (ort. 4) → $7,\ 9,\ 11$ (ort. 9); yayılım aynı.
T standard deviation = standart sapma ;; mean = ortalama ;; constant = sabit
Q Öğretmen herkesin notuna 5 puan ekledi. Ortalama ve standart sapmaya ne olur?
QE A teacher adds 5 marks to everyone's score. What happens to the mean and the standard deviation?
G b4_shift
BK 0.0

# x4-scale | 2 | Her veriyi $k$ ile çarpmak | Multiplying every value by a constant
L ~Her veri $k$ ile çarpılırsa
O \Rightarrow
R ~Ortalama $k$ katı, standart sapma $|k|$ katı olur
X ~Ortalama $k$ katı, standart sapma aynı ;; ~Ortalama $k$ artar ;; ~Standart sapma $k^2$ katı
KE Multiplying every value by $k$: the mean is multiplied by $k$, the standard deviation by $|k|$.
U Birim değiştirince (ör. cm → mm) ölçülerin nasıl değiştiğini söyler.
UE Says how the statistics change when you rescale the data (e.g. change units).
W Her şey $k$ kat büyür, aradaki mesafeler de. Mesafe negatif olamaz, bu yüzden $|k|$.
WE Everything, including the gaps, gets $k$ times bigger; spread cannot be negative, so it is $|k|$.
E Ort. 5, s.s. 2; hepsi ×3 → ort. 15, s.s. 6.
T standard deviation = standart sapma ;; scale factor = ölçek çarpanı
Q Uzunluklar metre yerine santimetre ile yazıldı (×100). Ortalama ve standart sapma ne olur?
QE Lengths are rewritten in centimetres instead of metres (×100). What happens to the mean and standard deviation?
G b4_scale
BK 0.0

# x4-var | 2 | Varyans | Variance
L \mathrm{Var}(X)
R \sigma^{2}
X \sigma ;; \sqrt{\sigma} ;; 2\sigma
K $\sigma$: standart sapma
KE $\sigma$: standard deviation
U Standart sapma ile varyans arasında geçiş yapmanı sağlar.
UE Lets you switch between standard deviation and variance.
W Varyans, sapmanın karesidir; standart sapma da varyansın kareköküdür.
WE Variance is the square of the standard deviation; the standard deviation is the square root of the variance.
E $\sigma=3$ ise varyans $9$.
T variance = varyans ;; standard deviation = standart sapma
Q Bir verinin standart sapması 4. Varyansı kaçtır?
QE The standard deviation of some data is 4. What is the variance?
B \sigma^{[[2]]} || 1 ;; \frac{1}{2}
C s=3:0:20:0.5 => s^2
CT @s@^2=@=@
G b4_var
BK 0.0

# x4-relfreq | 2 | Göreli frekans | Relative frequency
L ~Göreli frekans
O :
R \dfrac{\text{frekans}}{\text{toplam}}
X \dfrac{\text{toplam}}{\text{frekans}} ;; \text{toplam}-\text{frekans} ;; \text{frekans}\times\text{toplam}
KE Relative frequency = frequency ÷ total; it estimates a probability.
U Bir deneyden olasılığı tahmin eder.
UE Estimates a probability from experimental data.
W 50 atışta 20 kez tura geldiyse, tura “oranı” $\dfrac{20}{50}$’dir.
WE If tails came up 20 times in 50 throws, its proportion is $\dfrac{20}{50}$.
E 40 öğrencinin 10’u gözlüklü: $\dfrac{10}{40}=0{,}25$.
T relative frequency = göreli frekans ;; total = toplam
Q 200 kez atılan bir raptiye 70 kez ucu yukarı düştü. Ucu yukarı düşme olasılığını nasıl tahmin edersin?
QE A drawing pin is dropped 200 times and lands point up 70 times. Estimate the probability it lands point up.
B \dfrac{\text{[[frekans]]}}{\text{[[toplam]]}} || olasılık ;; sayı
C f=10:0:50:1 ; t=40:40:100:1 => f/t
CT \dfrac{@f@}{@t@}=@=@
G b4_relfreq
BK 0.0

# x4-sumprob | 3 | Olasılıkların toplamı | Sum of probabilities
L \sum \mathrm{P}(X=x)
R 1
X 0 ;; 100 ;; n
KE The probabilities of all possible values of a discrete random variable add up to 1.
U Olasılık tablosunda eksik olasılığı bulmanı sağlar.
UE Lets you find a missing probability in a probability distribution table.
W $X$ mutlaka değerlerinden birini alır; kesin olayın olasılığı 1’dir.
WE $X$ must take one of its values, and a certain event has probability 1.
E $0{,}2+0{,}5+k=1$ ise $k=0{,}3$.
T probability distribution = olasılık dağılımı ;; discrete = kesikli
Q Tabloda olasılıklar $0{,}1$, $0{,}4$, $k$, $0{,}2$. $k$ kaçtır?
QE A table shows probabilities $0{,}1$, $0{,}4$, $k$, $0{,}2$. Find $k$.
C a=0.2:0:0.5:0.05 ; b=0.5:0:0.5:0.05 => 1-a-b
CT k=1-@a@-@b@=@=@
G b4_sumprob
BK 0.0

# x4-expn | 2 | Beklenen sayı | Expected number of occurrences
L ~$n$ denemede $A$’nın beklenen sayısı
O :
R n\cdot\mathrm{P}(A)
X \dfrac{n}{\mathrm{P}(A)} ;; n+\mathrm{P}(A) ;; \mathrm{P}(A)
KE Expected number of occurrences of $A$ in $n$ trials $=n\,\mathrm{P}(A)$.
U Bir şeyin kaç kez olacağını tahmin eder.
UE Predicts how many times an event will happen.
W Zarı 60 kez atarsan, 6 her 6 atışta bir gelir: $60\cdot\dfrac{1}{6}=10$.
WE If you roll a die 60 times, a 6 comes up about once in every 6 rolls: $60\cdot\dfrac{1}{6}=10$.
T expected number = beklenen sayı ;; trial = deneme
Q Bir para 50 kez atılıyor. Kaç kez yazı gelmesini beklersin?
QE A coin is tossed 50 times. How many heads do you expect?
B [[n]]\cdot\mathrm{P}([[A]]) || A' ;; 1
C n=60:1:200:1 ; p=0.1667:0:1:0.0001 => n*p
CT @n@\cdot @p@=@=@
G b4_expn
BK 0.0

# x4-fair | 2 | Adil oyun | Fair game
L ~Adil oyun (fair game)
O :
R \mathrm{E}(X)=0
X \mathrm{E}(X)=1 ;; \mathrm{E}(X)=0.5 ;; \mathrm{P}(X)=0.5
K $X$: oyuncunun net kazancı (kazanç − ödenen ücret)
KE $X$: the player's net gain; a game is fair when the expected gain is 0.
U Bir oyunun kimseyi kayırmadığını kontrol eder.
UE Checks whether a game favours nobody.
W Uzun vadede ne kazanırsın ne kaybedersin; ortalama net kazanç sıfırdır.
WE In the long run you neither win nor lose: the average net gain is zero.
E 2 TL ödeyip $\dfrac{1}{5}$ olasılıkla 10 TL kazanıyorsan: $\mathrm{E}=10\cdot\dfrac15-2=0$, adil.
T fair game = adil oyun ;; expected gain = beklenen kazanç
Q Bir oyuna girmek 3 TL. Kazanma olasılığı $\dfrac{1}{4}$. Oyunun kimseyi kayırmaması için ödül kaç TL olmalı?
QE A game costs 3 lira to play and you win with probability $\dfrac{1}{4}$. What prize makes the game favour nobody?
G b4_fair
BK 0.0

# x4-mutex-int | 2 | Ayrık olaylarda kesişim | Mutually exclusive: intersection
L \mathrm{P}(A\cap B)
R 0
X 1 ;; \mathrm{P}(A)\,\mathrm{P}(B) ;; \mathrm{P}(A)+\mathrm{P}(B)
K $A$ ile $B$ ayrık (aynı anda olamaz)
KE $A$ and $B$ are mutually exclusive.
U İki olayın ayrık olup olmadığını kontrol etmeni sağlar.
UE Lets you test whether two events are mutually exclusive.
W Aynı anda olamıyorlarsa, birlikte olma olasılıkları sıfırdır. Venn’de daireler kesişmez.
WE If they cannot happen together, the probability of both is zero; the circles do not overlap.
E Zarda “1 gelir” ve “6 gelir”: ikisi birden olamaz.
T mutually exclusive = ayrık ;; intersection = kesişim
Q Bir zar atılıyor. Hem tek hem çift sayı gelme olasılığı nedir?
QE A die is rolled. What is the probability of getting a number that is both odd and even?
LAB venn
BK 0.0

# x4-binpmf | 3 | Binom olasılığı | Binomial probability
L \mathrm{P}(X=r)
R \binom{n}{r}p^{r}(1-p)^{n-r}
X p^r(1-p)^{n-r} ;; \binom{n}{r}p^{n-r}(1-p)^r ;; \binom{n}{r}p^r(1-p)^{n}
K $X\sim \mathrm{B}(n,\ p)$, $r$: başarı sayısı. IB’de genelde GDC ile hesaplanır.
KE $X\sim \mathrm{B}(n,\ p)$, $r$: number of successes; usually found with the GDC in IB.
U $n$ denemede tam $r$ başarı olma olasılığını bulur.
UE Finds the probability of exactly $r$ successes in $n$ trials.
W $r$ başarı ($p^r$), $n-r$ başarısızlık ($(1-p)^{n-r}$); bunların kaç farklı sırada olabileceği $\binom{n}{r}$.
WE $r$ successes and $n-r$ failures, and $\binom{n}{r}$ ways to order them.
E 3 para atışında tam 2 yazı: $3\cdot 0{,}5^2\cdot 0{,}5=0{,}375$.
T binomial probability = binom olasılığı ;; success = başarı ;; failure = başarısızlık
Q 4 soruluk testte her soruyu $0{,}5$ olasılıkla bilen biri tam 3 soruyu bilir mi?
QE Someone answers each of 4 questions correctly with probability $0{,}5$. What is the probability of exactly 3 correct?
B \binom{n}{r}p^{[[r]]}(1-p)^{[[n-r]]} || n ;; r-n
C n=3:1:10:1 ; r=2:0:10:1 ; p=0.5:0:1:0.05 => nCr(n,min(r,n))*p^min(r,n)*(1-p)^(n-min(r,n))
CT \binom{@n@}{@r@}\cdot @p@^{@r@}(1-@p@)^{@n@-@r@}=@=@
G b4_binpmf
LAB binomial
BK 0.0

# x4-norm-1s | 2 | Normal dağılım: 1 standart sapma | Normal distribution: within one standard deviation
L \mathrm{P}(\mu-\sigma<X<\mu+\sigma)
O \approx
R 0.68
X 0.95 ;; 0.5 ;; 0.997
K Yaklaşık %95’i $\mu\pm 2\sigma$, %99,7’si $\mu\pm 3\sigma$ içinde.
KE About 68% lies within 1σ, 95% within 2σ and 99.7% within 3σ of the mean.
U Normal dağılımda verinin çoğunun nerede olduğunu hızlıca söyler.
UE Quickly tells you where most of the data lie in a normal distribution.
W Çan eğrisi ortada yüksek; verinin yaklaşık üçte ikisi ortalamaya bir sapma yakındır.
WE The bell curve is tall in the middle, so about two thirds of the data are within one standard deviation.
H 68 – 95 – 99,7.
T normal distribution = normal dağılım ;; bell-shaped = çan eğrisi biçiminde
Q Boylar ortalaması 170, standart sapması 10 olan normal dağılıma uyuyor. Yaklaşık yüzde kaçı 160–180 arasındadır?
QE Heights are normal with mean 170 and standard deviation 10. Roughly what percentage are between 160 and 180?
LAB normal
BK 0.0

# x4-norm-sym | 2 | Normal dağılımda simetri | Symmetry of the normal distribution
L \mathrm{P}(X<\mu)
R 0.5
X 1 ;; 0 ;; 0.68
KE The normal curve is symmetric about the mean, so half the area is below $\mu$.
U Ortalamanın altında kalma olasılığını hesap yapmadan verir.
UE Gives the probability of being below the mean with no calculation.
W Çan eğrisi ortalamaya göre simetrik; alanın tam yarısı solda.
WE The curve is symmetric about the mean, so exactly half the area is on the left.
T symmetric = simetrik ;; mean = ortalama
Q Ağırlıklar normal dağılımlı, ortalama 70 kg. Rastgele birinin 70 kg’dan hafif olma olasılığı nedir?
QE Weights are normally distributed with mean 70 kg. What is the probability a random person weighs less than 70 kg?
LAB normal
BK 0.0

# x4-norm-gt | 3 | “Büyüktür” olasılığı | Probability greater than a value
L \mathrm{P}(X>a)
R 1-\mathrm{P}(X<a)
X \mathrm{P}(X<a) ;; \mathrm{P}(X<a)-1 ;; 1+\mathrm{P}(X<a)
KE The total area under the curve is 1, so $\mathrm{P}(X>a)=1-\mathrm{P}(X<a)$.
U Sağ taraftaki olasılığı sol taraftakinden bulur.
UE Finds a right-tail probability from a left-tail one.
W Eğrinin altındaki toplam alan 1; sağ parça = 1 − sol parça.
WE The whole area is 1, so the right part is 1 minus the left part.
E $\mathrm{P}(X<a)=0{,}8$ ise $\mathrm{P}(X>a)=0{,}2$.
T cumulative probability = birikimli olasılık ;; normal curve = normal eğri
Q Bir makinenin 5 yıldan önce bozulma olasılığı $0{,}3$. 5 yıldan fazla dayanma olasılığı nedir?
QE The probability a machine breaks down before 5 years is $0{,}3$. What is the probability it lasts more than 5 years?
B [[1]]-\mathrm{P}(X[[<]]a) || 0 ;; >
C P=0.8:0:1:0.05 => 1-P
CT 1-@P@=@=@
G b4_greater
LAB normal
BK 0.0

# x4-pearson | 2 | Pearson korelasyon katsayısı | Pearson's correlation coefficient
L r
O \in
R [-1,\ 1]
X [0,\ 1] ;; [0,\ 100] ;; (-\infty,\ \infty)
KE $r$ near 1: strong positive linear correlation; near −1: strong negative; near 0: little or no linear correlation.
K $r$ 1’e yakın: güçlü pozitif doğrusal ilişki; −1’e yakın: güçlü negatif; 0’a yakın: doğrusal ilişki yok denecek kadar az.
U İki değişkenin ne kadar doğrusal ilişkili olduğunu ölçer.
UE Measures how strongly two variables are linearly related.
W İşaret yönü (artan/azalan), büyüklük ise noktaların doğruya ne kadar yakın olduğunu söyler.
WE The sign gives the direction and the size tells how close the points are to a straight line.
E $r=-0{,}9$: biri artınca diğeri güçlü biçimde azalır.
T correlation coefficient = korelasyon katsayısı ;; positive correlation = pozitif korelasyon ;; scatter diagram = serpilme diyagramı
Q Ders çalışma saati ile not arasında ilişki ne kadar güçlü, tek bir sayıyla nasıl ifade edilir?
QE How can you describe with one number how strongly study time and test score are related?
BK 0.0

# x4-reg-point | 2 | Regresyon doğrusu ortalama noktadan geçer | Regression line passes through the mean point
L ~$y$’nin $x$ üzerine regresyon doğrusu şu noktadan geçer
O :
R (\bar{x},\ \bar{y})
X (0,\ 0) ;; (\bar{y},\ \bar{x}) ;; (Q_1,\ Q_3)
KE The regression line always passes through the mean point $(\bar{x},\ \bar{y})$.
U Regresyon doğrusunu çizmek ya da eksik katsayıyı bulmak için hazır bir nokta verir.
UE Gives a known point for drawing the regression line or finding a missing coefficient.
W En iyi doğru, verinin “ağırlık merkezinden” geçer.
WE The line of best fit goes through the centre of the data.
E $y=2x+b$, $\bar{x}=3$, $\bar{y}=10$ ise $10=6+b$, $b=4$.
T regression line = regresyon doğrusu ;; mean point = ortalama noktası ;; line of best fit = en uygun doğru
Q Regresyon doğrusu $y=3x+b$; $\bar{x}=2$, $\bar{y}=11$. $b$ kaçtır?
QE The regression line is $y=3x+b$ with $\bar{x}=2$ and $\bar{y}=11$. Find $b$.
G b4_regpoint
BK 0.0
`;

const P = (k) => `\\tfrac{${k}}{10}`;

export const GEN = {
  b4_iqr: (r) => {
    const q1 = ri(r, 5, 40), q3 = q1 + ri(r, 3, 30);
    return { q: `$Q_1=${q1}$, $Q_3=${q3}$. $\\mathrm{IQR}$ kaçtır?`, qe: `$Q_1=${q1}$, $Q_3=${q3}$. Find the $\\mathrm{IQR}$.`, ...int(q3 - q1) };
  },
  b4_mean: (r) => {
    const f = [ri(r, 1, 5), ri(r, 1, 5), ri(r, 1, 5)], n = f[0] + f[1] + f[2];
    const s = f[0] + 2 * f[1] + 3 * f[2];
    return { q: `Değerler $1,\\ 2,\\ 3$; frekanslar $${f.join(",\\ ")}$. Ortalama kaçtır? (kesir yazabilirsin)`, qe: `Values $1,\\ 2,\\ 3$ with frequencies $${f.join(",\\ ")}$. Find the mean (a fraction is fine).`, ...fr(s, n) };
  },
  b4_prob: (r) => {
    const a = ri(r, 1, 9), b = ri(r, 1, 9);
    return { q: `Torbada $${a}$ kırmızı, $${b}$ mavi bilye var. Kırmızı çekme olasılığı nedir?`, qe: `A bag has $${a}$ red and $${b}$ blue marbles. Find the probability of drawing red.`, ...fr(a, a + b) };
  },
  b4_comp: (r) => {
    const k = ri(r, 1, 9);
    return { q: `$\\mathrm{P}(A)=${P(k)}$ ise $\\mathrm{P}(A')$ kaçtır?`, qe: `If $\\mathrm{P}(A)=${P(k)}$, find $\\mathrm{P}(A')$.`, ...fr(10 - k, 10) };
  },
  b4_union: (r) => {
    const c = ri(r, 1, 3), a = c + ri(r, 1, 3), b = c + ri(r, 1, 3);
    return { q: `$\\mathrm{P}(A)=${P(a)}$, $\\mathrm{P}(B)=${P(b)}$, $\\mathrm{P}(A\\cap B)=${P(c)}$. $\\mathrm{P}(A\\cup B)$ kaçtır?`, qe: `$\\mathrm{P}(A)=${P(a)}$, $\\mathrm{P}(B)=${P(b)}$, $\\mathrm{P}(A\\cap B)=${P(c)}$. Find $\\mathrm{P}(A\\cup B)$.`, ...fr(a + b - c, 10) };
  },
  b4_mutex: (r) => {
    const a = ri(r, 1, 4), b = ri(r, 1, 5);
    return { q: `$A$ ve $B$ ayrık; $\\mathrm{P}(A)=${P(a)}$, $\\mathrm{P}(B)=${P(b)}$. $\\mathrm{P}(A\\cup B)$ kaçtır?`, qe: `$A$ and $B$ are mutually exclusive, $\\mathrm{P}(A)=${P(a)}$, $\\mathrm{P}(B)=${P(b)}$. Find $\\mathrm{P}(A\\cup B)$.`, ...fr(a + b, 10) };
  },
  b4_cond: (r) => {
    const b = ri(r, 2, 9), c = ri(r, 1, b);
    return { q: `$\\mathrm{P}(A\\cap B)=${P(c)}$, $\\mathrm{P}(B)=${P(b)}$. $\\mathrm{P}(A|B)$ kaçtır?`, qe: `$\\mathrm{P}(A\\cap B)=${P(c)}$, $\\mathrm{P}(B)=${P(b)}$. Find $\\mathrm{P}(A|B)$.`, ...fr(c, b) };
  },
  b4_indep: (r) => {
    const a = ri(r, 1, 9), b = ri(r, 1, 9);
    return { q: `$A$, $B$ bağımsız; $\\mathrm{P}(A)=${P(a)}$, $\\mathrm{P}(B)=${P(b)}$. $\\mathrm{P}(A\\cap B)$ kaçtır?`, qe: `$A$ and $B$ are independent, $\\mathrm{P}(A)=${P(a)}$, $\\mathrm{P}(B)=${P(b)}$. Find $\\mathrm{P}(A\\cap B)$.`, ...fr(a * b, 100) };
  },
  b4_ev: (r) => {
    const x1 = ri(r, 0, 5), x2 = ri(r, 6, 20), k = ri(r, 1, 9);
    return { q: `$X$ değerleri $${x1}$ ve $${x2}$; olasılıkları $${P(10 - k)}$ ve $${P(k)}$. $\\mathrm{E}(X)$ kaçtır?`, qe: `$X$ takes values $${x1}$ and $${x2}$ with probabilities $${P(10 - k)}$ and $${P(k)}$. Find $\\mathrm{E}(X)$.`, ...fr(x1 * (10 - k) + x2 * k, 10) };
  },
  b4_binmean: (r) => {
    const n = pick(r, [10, 20, 30, 40, 50]), k = ri(r, 1, 9);
    return { q: `$X\\sim \\mathrm{B}(${n},\\ ${P(k)})$. $\\mathrm{E}(X)$ kaçtır?`, qe: `$X\\sim \\mathrm{B}(${n},\\ ${P(k)})$. Find $\\mathrm{E}(X)$.`, ...fr(n * k, 10) };
  },
  b4_binvar: (r) => {
    const n = pick(r, [10, 20, 50, 100]), k = ri(r, 1, 9);
    return { q: `$X\\sim \\mathrm{B}(${n},\\ ${P(k)})$. $\\mathrm{Var}(X)$ kaçtır?`, qe: `$X\\sim \\mathrm{B}(${n},\\ ${P(k)})$. Find $\\mathrm{Var}(X)$.`, ...fr(n * k * (10 - k), 100) };
  },
  b4_z: (r) => {
    const mu = ri(r, 4, 16) * 5, s = pick(r, [2, 4, 5, 10]), z = pick(r, [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]);
    const x = mu + z * s;
    return { q: `$\\mu=${mu}$, $\\sigma=${s}$, $x=${String(x).replace(".", "{,}")}$. $z$ kaçtır?`, qe: `$\\mu=${mu}$, $\\sigma=${s}$, $x=${x}$. Find $z$.`, ...int(z) };
  },
  b4_meanraw: (r) => {
    const m = ri(r, 3, 15), d = ri(r, 1, 3), xs = [m - d, m, m + 2 * d, m - d];
    return { q: `$${xs.join(",\\ ")}$ verisinin ortalaması kaçtır?`, qe: `Find the mean of $${xs.join(",\\ ")}$.`, ...fr(xs.reduce((a, b) => a + b, 0), 4) };
  },
  b4_median: (r) => {
    const n = ri(r, 5, 40);
    return { q: `Sıralı $${n}$ veride medyan kaçıncı sıradadır? (ondalık olabilir)`, qe: `For $${n}$ ordered values, what is the position of the median? (may be a decimal)`, ...int((n + 1) / 2) };
  },
  b4_range: (r) => {
    const a = ri(r, 1, 20), b = a + ri(r, 2, 30), c = ri(r, a, b);
    return { q: `$${c},\\ ${b},\\ ${a}$ verisinin açıklığı kaçtır?`, qe: `Find the range of $${c},\\ ${b},\\ ${a}$.`, ...int(b - a) };
  },
  b4_outlier: (r) => {
    const q1 = ri(r, 10, 30), iqr = 2 * ri(r, 2, 8), q3 = q1 + iqr;
    if (r() < 0.5) return { q: `$Q_1=${q1}$, $Q_3=${q3}$. Bu değerin üstü aykırıdır: sınır kaçtır?`, qe: `$Q_1=${q1}$, $Q_3=${q3}$. Find the upper boundary for outliers.`, ...int(q3 + 1.5 * iqr) };
    return { q: `$Q_1=${q1}$, $Q_3=${q3}$. Bu değerin altı aykırıdır: sınır kaçtır?`, qe: `$Q_1=${q1}$, $Q_3=${q3}$. Find the lower boundary for outliers.`, ...int(q1 - 1.5 * iqr) };
  },
  b4_shift: (r) => {
    const m = ri(r, 10, 30), s = ri(r, 2, 6), k = ri(r, 2, 9);
    if (r() < 0.5) return { q: `Ortalama $${m}$, standart sapma $${s}$. Her veriye $${k}$ eklenirse yeni ortalama kaç?`, qe: `Mean $${m}$, standard deviation $${s}$. If $${k}$ is added to every value, what is the new mean?`, ...int(m + k) };
    return { q: `Ortalama $${m}$, standart sapma $${s}$. Her veriye $${k}$ eklenirse yeni standart sapma kaç?`, qe: `Mean $${m}$, standard deviation $${s}$. If $${k}$ is added to every value, what is the new standard deviation?`, ...int(s) };
  },
  b4_scale: (r) => {
    const m = ri(r, 2, 15), s = ri(r, 1, 5), k = pick(r, [2, 3, 4, 5, 10, -2, -3]);
    if (r() < 0.5) return { q: `Ortalama $${m}$, standart sapma $${s}$. Her veri $${k}$ ile çarpılırsa yeni ortalama kaç?`, qe: `Mean $${m}$, standard deviation $${s}$. If every value is multiplied by $${k}$, what is the new mean?`, ...int(m * k) };
    return { q: `Ortalama $${m}$, standart sapma $${s}$. Her veri $${k}$ ile çarpılırsa yeni standart sapma kaç?`, qe: `Mean $${m}$, standard deviation $${s}$. If every value is multiplied by $${k}$, what is the new standard deviation?`, ...int(s * Math.abs(k)) };
  },
  b4_var: (r) => {
    const s = ri(r, 2, 12);
    if (r() < 0.5) return { q: `Standart sapma $${s}$. Varyans kaç?`, qe: `The standard deviation is $${s}$. Find the variance.`, ...int(s * s) };
    return { q: `Varyans $${s * s}$. Standart sapma kaç?`, qe: `The variance is $${s * s}$. Find the standard deviation.`, ...int(s) };
  },
  b4_relfreq: (r) => {
    const t = pick(r, [20, 40, 50, 100, 200]), f = ri(r, 1, t - 1);
    return { q: `$${t}$ denemede olay $${f}$ kez oldu. Göreli frekans kaçtır?`, qe: `An event happened $${f}$ times in $${t}$ trials. Find the relative frequency.`, ...fr(f, t) };
  },
  b4_sumprob: (r) => {
    const a = ri(r, 1, 4), b = ri(r, 1, 4), c = ri(r, 0, 9 - a - b);
    return { q: `Olasılıklar $${P(a)},\\ ${P(b)},\\ ${P(c)},\\ k$. $k$ kaçtır?`, qe: `The probabilities are $${P(a)},\\ ${P(b)},\\ ${P(c)},\\ k$. Find $k$.`, ...fr(10 - a - b - c, 10) };
  },
  b4_expn: (r) => {
    const d = pick(r, [2, 4, 5, 6, 10]), n = d * ri(r, 3, 20);
    return { q: `Olasılığı $\\tfrac{1}{${d}}$ olan bir olay, $${n}$ denemede kaç kez beklenir?`, qe: `An event has probability $\\tfrac{1}{${d}}$. How many times is it expected in $${n}$ trials?`, ...int(n / d) };
  },
  b4_fair: (r) => {
    const d = pick(r, [2, 4, 5, 10]), c = ri(r, 1, 6);
    return { q: `Oyun ücreti $${c}$ TL, kazanma olasılığı $\\tfrac{1}{${d}}$. Oyunun adil olması için ödül kaç TL olmalı?`, qe: `A game costs $${c}$ lira and the probability of winning is $\\tfrac{1}{${d}}$. What prize makes the game fair?`, ...int(c * d) };
  },
  b4_binpmf: (r) => {
    const n = ri(r, 2, 4), k = ri(r, 0, n);
    return { q: `$X\\sim \\mathrm{B}(${n},\\ \\tfrac{1}{2})$. $\\mathrm{P}(X=${k})$ kaçtır?`, qe: `$X\\sim \\mathrm{B}(${n},\\ \\tfrac{1}{2})$. Find $\\mathrm{P}(X=${k})$.`, ...fr(nCr(n, k), 2 ** n) };
  },
  b4_greater: (r) => {
    const k = ri(r, 1, 99);
    return { q: `$\\mathrm{P}(X<a)=\\tfrac{${k}}{100}$. $\\mathrm{P}(X>a)$ kaçtır?`, qe: `$\\mathrm{P}(X<a)=\\tfrac{${k}}{100}$. Find $\\mathrm{P}(X>a)$.`, ...fr(100 - k, 100) };
  },
  b4_regpoint: (r) => {
    const a = ri(r, 1, 5), xb = ri(r, 1, 8), b = ri(r, -5, 9), yb = a * xb + b;
    return { q: `Regresyon doğrusu $y=${a}x+b$; $\\bar{x}=${xb}$, $\\bar{y}=${yb}$. $b$ kaçtır?`, qe: `The regression line is $y=${a}x+b$ with $\\bar{x}=${xb}$ and $\\bar{y}=${yb}$. Find $b$.`, ...int(b) };
  },
};
