/* Üniversite formülleri */
export default String.raw`
## kalkulus

# kl-taylor | 3 | Taylor serisi
L f(x)
R \sum_{n=0}^{\infty}\dfrac{f^{(n)}(a)}{n!}\,(x-a)^n
X \sum_{n=0}^{\infty}f^{(n)}(a)\,(x-a)^n ;; \sum_{n=0}^{\infty}\dfrac{f^{(n)}(x)}{n!}\,(x-a)^n ;; \sum_{n=1}^{\infty}\dfrac{f^{(n)}(a)}{n}\,(x-a)^n
K $a$ civarında açılım ($a=0$ ise Maclaurin serisi)
W Fonksiyonu, $a$ noktasındaki tüm türevlerini eşleyen bir polinomla yaklaşıkla.

# kl-ex | 3 | $e^x$’in Maclaurin serisi
L e^x
R \sum_{n=0}^{\infty}\dfrac{x^n}{n!}
X \sum_{n=1}^{\infty}\dfrac{x^n}{n} ;; \sum_{n=0}^{\infty}x^n ;; \sum_{n=0}^{\infty}\dfrac{(-1)^n x^n}{n!}
E $e=1+1+\tfrac12+\tfrac16+\tfrac1{24}+\cdots\approx 2{,}718$
V x:-2:2

# kl-sin | 2 | $\sin x$’in Maclaurin serisi
L \sin x
R \sum_{n=0}^{\infty}\dfrac{(-1)^n x^{2n+1}}{(2n+1)!}
X \sum_{n=0}^{\infty}\dfrac{(-1)^n x^{2n}}{(2n)!} ;; \sum_{n=0}^{\infty}\dfrac{x^{2n+1}}{(2n+1)!} ;; \sum_{n=0}^{\infty}\dfrac{(-1)^n x^{2n+1}}{2n+1}
W Tek kuvvetler, işaretler sırayla değişir: $x-\tfrac{x^3}{6}+\tfrac{x^5}{120}-\cdots$
V x:-2:2

# kl-cos | 2 | $\cos x$’in Maclaurin serisi
L \cos x
R \sum_{n=0}^{\infty}\dfrac{(-1)^n x^{2n}}{(2n)!}
X \sum_{n=0}^{\infty}\dfrac{(-1)^n x^{2n+1}}{(2n+1)!} ;; \sum_{n=0}^{\infty}\dfrac{x^{2n}}{(2n)!} ;; \sum_{n=0}^{\infty}\dfrac{(-1)^n x^{2n}}{n!}
W Çift kuvvetler: $1-\tfrac{x^2}{2}+\tfrac{x^4}{24}-\cdots$
V x:-2:2

# kl-ln | 2 | $\ln(1+x)$ serisi
L \ln(1+x)
R \sum_{n=1}^{\infty}\dfrac{(-1)^{n+1}x^n}{n}
X \sum_{n=1}^{\infty}\dfrac{x^n}{n} ;; \sum_{n=1}^{\infty}\dfrac{(-1)^{n+1}x^n}{n!} ;; \sum_{n=0}^{\infty}(-1)^n x^n
K $-1<x\le 1$
V x:-0.5:0.5

# kl-geo | 3 | Geometrik seri
L \dfrac{1}{1-x}
R \sum_{n=0}^{\infty}x^n
X \sum_{n=0}^{\infty}(-x)^n ;; \sum_{n=1}^{\infty}x^n ;; \sum_{n=0}^{\infty}\dfrac{x^n}{n!}
K $|x|<1$
W Birçok serinin atası: türev ve integralini alarak $\ln$ ve $\arctan$ serileri bulunur.
V x:-0.5:0.5

# kl-euler | 3 | Euler formülü
L e^{i\theta}
R \cos\theta+i\sin\theta
X \sin\theta+i\cos\theta ;; \cos\theta-i\sin\theta ;; e\,(\cos\theta+i\sin\theta)
W $e^x$, $\sin x$ ve $\cos x$ serilerini $x=i\theta$ için karşılaştır.
S Feynman bu eşitliği gençliğinde defterine “matematiğin en dikkat çekici formülü” diye not etmişti.

# kl-eulerozd | 3 | Euler özdeşliği
L e^{i\pi}+1
R 0
X 1 ;; -1 ;; 2
W Euler formülünde $\theta=\pi$ al: $\cos\pi+i\sin\pi=-1$.
S Beş temel sabit ($e$, $i$, $\pi$, $1$, $0$) ile toplama, çarpma ve üs alma tek bir eşitlikte buluşur.

# kl-gauss | 2 | Gauss integrali
L \int_{-\infty}^{\infty}e^{-x^2}\,dx
R \sqrt{\pi}
X \pi ;; \dfrac{\sqrt\pi}{2} ;; 1
W Karesini alıp kutupsal koordinatlara geç: $\int_0^{2\pi}\int_0^\infty e^{-r^2}r\,dr\,d\theta=\pi$.

# kl-yay | 2 | Eğri uzunluğu
L L
R \int_a^b\sqrt{1+[f'(x)]^2}\,dx
X \int_a^b\left(1+[f'(x)]^2\right)dx ;; \int_a^b\sqrt{1+f(x)^2}\,dx ;; \int_a^b|f'(x)|\,dx
W Küçük parça $ds=\sqrt{dx^2+dy^2}$ Pisagor’dan gelir.

# kl-otd | 3 | Ortalama değer teoremi
L f'(c)
R \dfrac{f(b)-f(a)}{b-a}
X \dfrac{f(b)+f(a)}{b-a} ;; f(b)-f(a) ;; \dfrac{f(b)-f(a)}{2}
K $f$, $[a,b]$’de sürekli ve $(a,b)$’de türevliyse bir $c\in(a,b)$ vardır
W Bir yerde anlık eğim, ortalama eğime (kiriş eğimine) eşit olmak zorundadır.

# kl-gradyan | 2 | Gradyan
L \nabla f
R \left(\dfrac{\partial f}{\partial x},\ \dfrac{\partial f}{\partial y},\ \dfrac{\partial f}{\partial z}\right)
X \dfrac{\partial f}{\partial x}+\dfrac{\partial f}{\partial y}+\dfrac{\partial f}{\partial z} ;; \left(\dfrac{\partial^2 f}{\partial x^2},\ \dfrac{\partial^2 f}{\partial y^2},\ \dfrac{\partial^2 f}{\partial z^2}\right) ;; \sqrt{f_x^2+f_y^2+f_z^2}
W Gradyan en hızlı artış yönünü gösterir; büyüklüğü o yöndeki artış hızıdır.

# kl-yonlu | 2 | Yönlü türev
L D_{\mathbf u}f
R \nabla f\cdot\mathbf u
X \nabla f\times\mathbf u ;; |\nabla f| ;; \nabla f+\mathbf u
K $\mathbf u$: birim vektör

# kl-basel | 1 | Basel problemi
L \sum_{n=1}^{\infty}\dfrac{1}{n^2}
R \dfrac{\pi^2}{6}
X \dfrac{\pi^2}{8} ;; \dfrac{\pi}{4} ;; 2
S Bernoulli kardeşlerin yıllarca çözemediği bu toplamı Euler 1734’te buldu ve ünü bir anda yayıldı.

# kl-leibniz | 1 | Leibniz serisi
L 1-\dfrac13+\dfrac15-\dfrac17+\cdots
R \dfrac{\pi}{4}
X \dfrac{\pi}{2} ;; \dfrac{\pi^2}{6} ;; \ln 2
W $\arctan x$ serisinde $x=1$ al.

# kl-alterne | 1 | Alterne harmonik seri
L 1-\dfrac12+\dfrac13-\dfrac14+\cdots
R \ln 2
X \dfrac{\pi}{4} ;; 1 ;; e^{-1}
W $\ln(1+x)$ serisinde $x=1$ al. (Harmonik seri $\sum\tfrac1n$ ise ıraksar.)

# kl-stirling | 1 | Stirling yaklaşımı
L n!
O \approx
R \sqrt{2\pi n}\left(\dfrac{n}{e}\right)^n
X \sqrt{\pi n}\left(\dfrac{n}{e}\right)^n ;; \left(\dfrac{n}{e}\right)^n ;; \sqrt{2\pi n}\left(\dfrac{e}{n}\right)^n
W Büyük $n$ için faktöriyeli hesaplamadan tahmin etmeyi sağlar.

# kl-gamma | 1 | Gama fonksiyonu
L \Gamma(n)
R (n-1)!
X n! ;; (n+1)! ;; n\,(n-1)
K $n$ pozitif tam sayı; $\Gamma(x)=\int_0^\infty t^{x-1}e^{-t}\,dt$
W Faktöriyeli tam sayı olmayan değerlere genişletir: $\Gamma(\tfrac12)=\sqrt\pi$.

## lineer

# ln-det2 | 3 | 2×2 determinant
L \begin{vmatrix}a&b\\c&d\end{vmatrix}
R ad-bc
X ab-cd ;; ad+bc ;; ac-bd
W Ana köşegen çarpımı eksi yan köşegen çarpımı.
E $\begin{vmatrix}3&2\\1&4\end{vmatrix}=12-2=10$
G det2

# ln-ters2 | 3 | 2×2 matrisin tersi
L \begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1}
R \dfrac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}
X \dfrac{1}{ad-bc}\begin{pmatrix}a&-b\\-c&d\end{pmatrix} ;; \dfrac{1}{ad-bc}\begin{pmatrix}-d&b\\c&-a\end{pmatrix} ;; \dfrac{1}{ad+bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}
K $ad-bc\ne 0$
H Köşegendekiler yer değiştirir, diğerleri işaret değiştirir, hepsi determinanta bölünür.

# ln-detcarpim | 2 | Çarpımın determinantı
L \det(AB)
R \det A\cdot\det B
X \det A+\det B ;; \dfrac{\det A}{\det B} ;; \det(A+B)
W Determinant, alan/hacim ölçeklemesidir; ardışık dönüşümlerde ölçekler çarpılır.

# ln-tersc | 2 | Çarpımın tersi
L (AB)^{-1}
R B^{-1}A^{-1}
X A^{-1}B^{-1} ;; -AB ;; A^{-1}+B^{-1}
H Çorap–ayakkabı: son uygulanan ilk geri alınır.

# ln-transpoz | 2 | Çarpımın devriği
L (AB)^T
R B^TA^T
X A^TB^T ;; A^T+B^T ;; (AB)^{-1}

# ln-detT | 1 | Devriğin determinantı
L \det(A^T)
R \det A
X -\det A ;; \dfrac{1}{\det A} ;; (\det A)^2

# ln-detk | 2 | Skalerle çarpılmış matris
L \det(kA)
R k^n\det A
X k\det A ;; n\,k\det A ;; k^2\det A
K $A$: $n\times n$ matris
W Her satır $k$ ile çarpılır; $n$ satır olduğundan $k^n$.

# ln-detters | 2 | Tersin determinantı
L \det(A^{-1})
R \dfrac{1}{\det A}
X -\det A ;; \det A ;; \dfrac{1}{(\det A)^2}
W $\det(A)\det(A^{-1})=\det(I)=1$.

# ln-ozdeger | 3 | Karakteristik denklem
L \lambda\ \text{özdeğer}
O \iff
R \det(A-\lambda I)=0
X \det(A)-\lambda=0 ;; A\lambda=I ;; \det(A+\lambda I)=1
W $A\mathbf v=\lambda\mathbf v$ ve $\mathbf v\ne\mathbf 0$ için $(A-\lambda I)$ tekil olmalıdır.

# ln-iz | 2 | İz ve özdeğerler
L \operatorname{iz}(A)
R \lambda_1+\lambda_2+\dots+\lambda_n
X \lambda_1\lambda_2\cdots\lambda_n ;; \max_i\lambda_i ;; \lambda_1^2+\dots+\lambda_n^2
K İz: köşegen elemanlarının toplamı

# ln-detoz | 2 | Determinant ve özdeğerler
L \det A
R \lambda_1\lambda_2\cdots\lambda_n
X \lambda_1+\lambda_2+\dots+\lambda_n ;; \lambda_1^2\lambda_2^2\cdots\lambda_n^2 ;; n\,\lambda_1

# ln-skaler | 3 | Skaler (iç) çarpım
L \vec a\cdot\vec b
R |\vec a|\,|\vec b|\cos\theta
X |\vec a|\,|\vec b|\sin\theta ;; |\vec a|\,|\vec b| ;; |\vec a|\,|\vec b|\tan\theta
K $\theta$: vektörler arasındaki açı
W Bir vektörün diğeri üzerindeki izdüşümü çarpı diğerinin boyu.

# ln-skaler2 | 2 | Bileşenlerle skaler çarpım
L \vec a\cdot\vec b
R a_1b_1+a_2b_2+a_3b_3
X a_1a_2a_3+b_1b_2b_3 ;; a_1b_1\cdot a_2b_2\cdot a_3b_3 ;; (a_1+b_1)(a_2+b_2)(a_3+b_3)

# ln-vektorel | 2 | Vektörel çarpımın büyüklüğü
L |\vec a\times\vec b|
R |\vec a|\,|\vec b|\sin\theta
X |\vec a|\,|\vec b|\cos\theta ;; |\vec a|+|\vec b| ;; \dfrac{|\vec a|\,|\vec b|\sin\theta}{2}
W Kenarları $\vec a$ ve $\vec b$ olan paralelkenarın alanıdır.

# ln-rank | 2 | Boyut (rank–sıfırlık) teoremi
L \operatorname{rank}A+\operatorname{null}A
R n
X m ;; m+n ;; \min(m,n)
K $A$: $m\times n$ matris ($n$: sütun sayısı)
W Tanım kümesinin boyutu, görüntünün ve çekirdeğin boyutları toplamıdır.

# ln-cramer | 2 | Cramer kuralı
L x_i
R \dfrac{\det A_i}{\det A}
X \dfrac{\det A}{\det A_i} ;; \det A_i-\det A ;; \det(A_i)\cdot\det(A)
K $A\mathbf x=\mathbf b$; $A_i$: $A$’nın $i$. sütunu $\mathbf b$ ile değiştirilmiş hâli

# ln-izdusum | 2 | Vektörün izdüşümü
L \operatorname{proj}_{\vec b}\vec a
R \dfrac{\vec a\cdot\vec b}{|\vec b|^2}\,\vec b
X \dfrac{\vec a\cdot\vec b}{|\vec a|^2}\,\vec a ;; \dfrac{\vec a\cdot\vec b}{|\vec b|}\,\vec b ;; (\vec a\cdot\vec b)\,\vec b

# ln-dik | 2 | Dik vektörler
L \vec a\perp\vec b
O \iff
R \vec a\cdot\vec b=0
X \vec a\times\vec b=\vec 0 ;; \vec a\cdot\vec b=1 ;; |\vec a|=|\vec b|
W $\cos 90^\circ=0$. (Vektörel çarpımın sıfır olması paralellik demektir.)

## istatistik

# st-varyans | 3 | Varyans (anakütle)
L \sigma^2
R \dfrac{1}{N}\sum_{i=1}^{N}(x_i-\mu)^2
X \dfrac{1}{N}\sum_{i=1}^{N}(x_i-\mu) ;; \dfrac{1}{N}\sum_{i=1}^{N}|x_i-\mu| ;; \sqrt{\dfrac{1}{N}\sum_{i=1}^{N}(x_i-\mu)^2}
W Sapmaların karelerinin ortalaması. Sapmaların kendisinin ortalaması her zaman 0’dır.

# st-orneklem | 2 | Örneklem varyansı
L s^2
R \dfrac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar x)^2
X \dfrac{1}{n}\sum_{i=1}^{n}(x_i-\bar x)^2 ;; \dfrac{1}{n+1}\sum_{i=1}^{n}(x_i-\bar x)^2 ;; \dfrac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar x)
W $n-1$: Bessel düzeltmesi. Ortalama veriden tahmin edildiği için bir serbestlik derecesi kaybolur.

# st-std | 2 | Standart sapma
L \sigma
R \sqrt{\operatorname{Var}(X)}
X \operatorname{Var}(X)^2 ;; \dfrac{\operatorname{Var}(X)}{2} ;; \operatorname{Var}(X)
W Varyansın karekökü; verinin birimine geri döner.

# st-varbek | 3 | Varyansın kısa yolu
L \operatorname{Var}(X)
R E[X^2]-(E[X])^2
X (E[X])^2-E[X^2] ;; E[X^2] ;; E[X^2]-E[X]
H Karenin ortalaması eksi ortalamanın karesi.

# st-dogrusal | 2 | Beklenen değerin doğrusallığı
L E[aX+b]
R a\,E[X]+b
X a\,E[X] ;; a^2E[X]+b ;; E[X]+b

# st-vardogrusal | 2 | Doğrusal dönüşümde varyans
L \operatorname{Var}(aX+b)
R a^2\operatorname{Var}(X)
X a\operatorname{Var}(X)+b ;; a^2\operatorname{Var}(X)+b ;; a\operatorname{Var}(X)
W Sabit kaydırma ($b$) yayılımı değiştirmez; ölçek ise karesiyle etkiler.

# st-bagimsizvar | 2 | Bağımsız değişkenlerin toplamının varyansı
L \operatorname{Var}(X+Y)
R \operatorname{Var}(X)+\operatorname{Var}(Y)
X \operatorname{Var}(X)\cdot\operatorname{Var}(Y) ;; \left(\sqrt{\operatorname{Var}(X)}+\sqrt{\operatorname{Var}(Y)}\right)^2 ;; \operatorname{Var}(X)-\operatorname{Var}(Y)
K $X$ ve $Y$ bağımsız
W Bağımsızken varyanslar toplanır, standart sapmalar toplanmaz.

# st-bayes | 3 | Bayes teoremi
L P(A\mid B)
R \dfrac{P(B\mid A)\,P(A)}{P(B)}
X \dfrac{P(B\mid A)\,P(B)}{P(A)} ;; P(B\mid A) ;; \dfrac{P(A)\,P(B)}{P(B\mid A)}
W Kanıt ($B$) gözlendikten sonra hipotezin ($A$) olasılığını günceller.
E %1 görülen bir hastalık için %99 doğru bir testte pozitif çıkan birinin hasta olma olasılığı yalnızca %50 civarındadır.
S Rahip Thomas Bayes’in çalışması, ölümünden sonra 1763’te arkadaşı Richard Price tarafından yayımlandı.
G bayes

# st-toplam | 2 | Toplam olasılık
L P(B)
R \sum_i P(B\mid A_i)\,P(A_i)
X \sum_i P(A_i\mid B)\,P(A_i) ;; \sum_i P(B\mid A_i) ;; \prod_i P(B\mid A_i)\,P(A_i)
K $A_i$’ler örnek uzayın ayrık bir parçalanışı

# st-binom | 3 | Binom dağılımı
L P(X=k)
R \dbinom{n}{k}p^k(1-p)^{n-k}
X p^k(1-p)^{n-k} ;; \dbinom{n}{k}p^{n-k}(1-p)^{k} ;; \dbinom{n}{k}p^k(1-p)^{n}
K $X\sim B(n,p)$: $n$ bağımsız denemede başarı sayısı
W Hangi $k$ denemenin başarılı olacağı $\binom nk$ şekilde seçilir.
G binomdag

# st-binomort | 2 | Binom dağılımının ortalaması ve varyansı
L E[X],\ \operatorname{Var}(X)
R np,\ np(1-p)
X np,\ np^2 ;; p,\ p(1-p) ;; np,\ \sqrt{np(1-p)}
K $X\sim B(n,p)$

# st-poisson | 2 | Poisson dağılımı
L P(X=k)
R \dfrac{\lambda^k e^{-\lambda}}{k!}
X \dfrac{\lambda^k e^{\lambda}}{k!} ;; \dfrac{e^{-\lambda}}{k!} ;; \lambda^k e^{-\lambda}
K $X\sim\text{Poisson}(\lambda)$; ortalaması da varyansı da $\lambda$
W Belirli bir aralıktaki nadir olayların sayısını modeller.

# st-normal | 2 | Normal dağılımın yoğunluğu
L f(x)
R \dfrac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}
X \dfrac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x-\mu)^2}{\sigma^2}} ;; \dfrac{1}{\sqrt{2\pi}}\,e^{-\frac{(x-\mu)^2}{2\sigma}} ;; \dfrac{1}{2\pi\sigma}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}
K $X\sim N(\mu,\sigma^2)$
W Önündeki katsayı, eğrinin altındaki toplam alanı 1 yapar.

# st-z | 3 | Z-skoru
L z
R \dfrac{x-\mu}{\sigma}
X \dfrac{x-\mu}{\sigma^2} ;; \dfrac{\mu-x}{\sigma} ;; (x-\mu)\,\sigma
W Değerin ortalamadan kaç standart sapma uzakta olduğunu söyler.
E $\mu=70$, $\sigma=10$ iken $x=85$ için $z=1{,}5$.
G zskor

# st-standarthata | 2 | Ortalamanın standart hatası
L \sigma_{\bar x}
R \dfrac{\sigma}{\sqrt n}
X \dfrac{\sigma}{n} ;; \sigma\sqrt n ;; \dfrac{\sigma^2}{n}
W Örneklem büyüdükçe ortalama tahmini daralır; ama ancak $\sqrt n$ hızında.

# st-kovaryans | 2 | Kovaryans
L \operatorname{Cov}(X,Y)
R E[XY]-E[X]\,E[Y]
X E[XY] ;; E[X]\,E[Y]-E[XY] ;; E[X+Y]-E[X]-E[Y]

# st-korelasyon | 2 | Korelasyon katsayısı
L \rho_{XY}
R \dfrac{\operatorname{Cov}(X,Y)}{\sigma_X\,\sigma_Y}
X \dfrac{\operatorname{Cov}(X,Y)}{\sigma_X^2\,\sigma_Y^2} ;; \operatorname{Cov}(X,Y)\,\sigma_X\sigma_Y ;; \dfrac{\sigma_X\,\sigma_Y}{\operatorname{Cov}(X,Y)}
K $-1\le\rho\le 1$
W Kovaryansın birimlerden arındırılmış hâli.

# st-geometrik | 1 | Geometrik dağılımın ortalaması
L E[X]
R \dfrac{1}{p}
X p ;; \dfrac{1}{1-p} ;; n\,p
K $X$: ilk başarı gelene kadar yapılan deneme sayısı (başarı olasılığı $p$)
E Zarda 6 gelene kadar ortalama 6 atış gerekir.
`;
