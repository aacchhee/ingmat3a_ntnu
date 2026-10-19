<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 10.0 Oversikt

<div id="uke10-start"></div>

### Fra helning til krumning

I [uke 9](uke9.qmd) så vi at gradientmetoden med fast steg er en
fikspunktiterasjon. Nær et minimum ganges feilen med
$1-\alpha\lambda_i$ langs hver egenretning til Hessianen, steget må
oppfylle $\alpha<2/\lambda_{\max}$, og selv det beste faste steget gir
bare faktoren $(\kappa-1)/(\kappa+1)$ per steg. Armijo-testen gjorde
steget trygt, men ikke raskere.

Denne uka bruker vi **krumningen**, altså Hessianen, til å velge både
retning og lengde. Det gir **Newtons metode** for optimering. Du har
allerede brukt den: den raskeste omskrivingen i uke 2 var Newton, uten at
vi sa det. Vi skal se hvorfor metoden er så rask, hvorfor den ikke bryr
seg om hvilke enheter vi måler i, og hva et steg koster. Deretter ser vi
hva som går galt når den lokale modellen lyver, og hvordan Cholesky og
Armijo sikrer metoden. Til slutt blir Newton til Gauss–Newton for
minste kvadrater.

**Forelesning** viser hovedløpet. **Gå i dybden** åpner bevis, Newton med
CG inni steget og sammenligningen med SciPy. Regneoppgavene står i 10.6 og
kodeoppgavene i 10.7.

### Kort løype

1. [Sifrene dobles](#uke10-newton): Newton mot gradientmetoden.
2. [Uke 2 var Newton](#uke10-likning): den lokale kvadratiske modellen og $Hp=-g$.
3. [Riktig skala gratis](#uke10-skala): kvadratisk konvergens og enheter.
4. [Hva koster et steg?](#uke10-cholesky): Cholesky løser Newton-systemet.
5. [Når modellen lyver](#uke10-stasjonaer): sadelpunkter og maksimum.
6. [Sikre retning og lengde](#uke10-demping): Cholesky-forsøket og Armijo.
7. [Gauss–Newton](#uke10-gauss-newton): Newton for minste kvadrater og Levenberg–Marquardt.

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 2: fikspunktiterasjon](page4.qmd) | Hvorfor var den tredje omskrivingen så mye raskere enn de andre? |
| [Prosjekt 2: Newtonfraktaler](project_week2.qmd) | Hvilket nullpunkt finner Newton fra en gitt start? |
| [Uke 4: minste kvadrater](uke4.qmd#uke4-mk) | Hvordan løser vi $\min\|Ap-b\|$ med QR? |
| [Uke 6: CG og SPD](uke6.qmd#uke6-cg) | Hvordan løser vi et SPD-system, direkte eller iterativt? |
| [Prosjekt 6: prekondisjonering](project_week6.qmd) | Hvilken skala gjør en skål rund? |
| [Uke 9: fast steg og Armijo](uke9.qmd) | Hvorfor er gradientmetoden treg, og hvordan sikrer vi et steg? |

### Læringsmål

Etter denne uka skal du kunne

- utlede Newton-steget som minimum av den lokale kvadratiske modellen og
  løse $Hp=-g$, også med Cholesky-faktorisering,
- kjenne igjen kvadratisk konvergens i en feiltabell og forklare
  forskjellen fra den lineære faktoren i uke 9,
- forklare hvorfor Newton-steget ikke avhenger av enhetene, mens
  gradientretningen gjør det,
- bruke $g^Tp=-p^THp$ til å forklare når Newton-retningen peker oppover,
  og sikre metoden med et Cholesky-forsøk for $H+\mu I$ og Armijo-demping,
- sette opp et Gauss–Newton-steg som et minste kvadraters problem.

## 10.1 Sifrene dobles

<div id="uke10-newton"></div>

### Eksperiment 1 – to metoder fra samme start

Vi bruker Himmelblaus funksjon fra uke 9,

$$f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2,$$

med minimumet $(3,2)$. Fra start i $(2.5,\,2.5)$ sammenligner vi to
metoder:

- **gradientmetoden** med det beste faste steget fra uke 9,
  $\alpha=2/(\lambda_{\min}+\lambda_{\max})$, der $\lambda_i$ er
  egenverdiene til Hessianen i $(3,2)$;
- **Newtons metode**, som du snart skal se oppskriften på.

Vi måler avstanden $e_k=\|z_k-(3,2)\|$ etter $k$ steg.

**Forutsi:** Uke 9 ga faktoren $(\kappa-1)/(\kappa+1)\approx0.52$ for
gradientmetoden. Hvor stor tror du feilen er etter fem steg, når den
starter på $0.71$?

```{pyodide-python}
#| label: week10-newton-vs-gradient
z_min = np.array([3., 2.])
lam = np.linalg.eigvalsh(himmel_hess(z_min))
alpha = 2/(lam[0] + lam[1])
print(f'Egenverdier i (3,2): {lam.round(1)}, beste faste steg alpha = {alpha:.4f}')

z_newton = np.array([2.5, 2.5]); z_grad = z_newton.copy()
e_newton, e_grad = [], []
for k in range(6):
    e_newton.append(np.linalg.norm(z_newton - z_min))
    e_grad.append(np.linalg.norm(z_grad - z_min))
    z_newton = z_newton + np.linalg.solve(himmel_hess(z_newton), -himmel_grad(z_newton))
    z_grad = z_grad - alpha*himmel_grad(z_grad)
print(' k   Newton      gradient')
for k in range(6):
    print(f'{k:2d}   {e_newton[k]:.1e}    {e_grad[k]:.1e}')

fig, ax = plt.subplots(figsize=(6.5, 3.8))
ax.semilogy(range(5), e_newton[:5], 'o-', label='Newton')
ax.semilogy(range(6), e_grad, 's-', label='gradient, beste faste steg')
ax.set(xlabel='steg k', ylabel='feil $e_k$ (logaritmisk)')
ax.legend(); ax.grid(alpha=.3); plt.show()
```

**Hva viser forsøket?**

| $k$ | 0 | 1 | 2 | 3 | 4 | 5 |
|:--|--:|--:|--:|--:|--:|--:|
| Newton | 0.71 | 0.16 | $1.0\cdot10^{-2}$ | $6.3\cdot10^{-5}$ | $1.6\cdot10^{-9}$ | 0 |
| gradient | 0.71 | 0.30 | 0.13 | 0.065 | 0.033 | 0.017 |

Gradientmetoden halverer omtrent feilen i hvert steg, slik uke 9
forutsa; etter fem steg er den fortsatt over $10^{-2}$. For Newton
**dobles eksponenten**: $10^{-2}$, $10^{-5}$, $10^{-9}$. Etter fem steg er
feilen null i flyttall. I plottet er gradientkurven en rett linje, mens
Newton-kurven bøyer stadig brattere nedover.

### Uke 2 var Newton

<div id="uke10-likning"></div>

En slik tabell har du sett før. I uke 2 løste vi $x^3+x-1=0$ med tre
omskrivinger, og den tredje,

$$g_3(x)=\frac{2x^3+1}{3x^2+1},$$

var langt raskest, med $g_3'(r)=0$. Skriv Newtons metode for
$h(x)=x^3+x-1$ på én brøk:

$$x-\frac{h(x)}{h'(x)}=x-\frac{x^3+x-1}{3x^2+1}
=\frac{x(3x^2+1)-(x^3+x-1)}{3x^2+1}=\frac{2x^3+1}{3x^2+1}.$$

**$g_3$ var Newtons metode.** Derfor var den lineære faktoren null, og
derfor doblet sifrene seg, akkurat som i
[2.3](page4.qmd#lokalt-globalt-og-raskt) og i prosjekt 2.

### Newton for minimering: minimer den lokale modellen

For å minimere en funksjon $f$ av én variabel søker vi $f'(x)=0$. Newton
på denne likningen gir

$$x_{k+1}=x_k-\frac{f'(x_k)}{f''(x_k)}.$$

Det samme steget får vi ved å minimere den lokale kvadratiske modellen
$f(x_k)+f'(x_k)p+\tfrac12f''(x_k)p^2$: den deriverte med hensyn på $p$
er $f'(x_k)+f''(x_k)p$, og den er null for $p=-f'(x_k)/f''(x_k)$.

I flere variabler er $g=\nabla f$ gradienten og $H$ Hessianen, og
modellen fra [støtteløpet i uke 8](uke8.qmd#uke8-hessian) er

$$m_x(p)=f(x)+g(x)^Tp+\tfrac12p^TH(x)p.$$

Modellens gradient med hensyn på $p$ er $g(x)+H(x)p$. Når den settes
lik null, får vi **Newton-likningen**

$$\boxed{H(x_k)\,p_k=-g(x_k),\qquad x_{k+1}=x_k+p_k.}$$

Den har en entydig løsning når $H$ er invertibel. Når $H$ i tillegg er
SPD, er $p_k$ det entydige minimumet av modellen. For en kvadratisk
funksjon er modellen eksakt, og da treffer ett steg:

::: {.callout-note title="Håndeksempel: ett Newton-steg i skålen fra uke 6"}

**Utgangspunkt.** $\phi(x)=\tfrac12x^TAx-b^Tx$ med
$A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$ og $b=(5,5)^T$. Her er
$g(x)=Ax-b$ og $H=A$ i alle punkter. Start i $x_0=(-2,3)^T$.

**Prøv selv.** Finn $g(x_0)$, løs $Ap=-g(x_0)$ og regn ut $x_1=x_0+p$.

**Regnegangen.**

1. $g(x_0)=(-8,-1)^T$, så systemet er $3p_1+p_2=8$ og $p_1+2p_2=1$.
2. Første likning gir $p_2=8-3p_1$. Innsatt: $p_1+2(8-3p_1)=1$, så
   $p_1=3$ og $p_2=-1$.
3. $x_1=(-2,3)^T+(3,-1)^T=(1,2)^T$, og $Ax_1-b=0$.

**Dette tar vi med oss.** Fra ethvert startpunkt er
$g(x+p)=g(x)+Ap=0$. For en ikke-kvadratisk funksjon er modellen bare
lokal; da må vi regne ut en ny $H$ og en ny retning i hvert punkt.

:::

I Python løser `np.linalg.solve(A, -g)` systemet uten å regne ut en invers
matrise. Det øver du på i kodeoppgave 1 i 10.7.

## 10.2 Riktig skala gratis

<div id="uke10-skala"></div>

### Lokal kvadratisk konvergens

Tabellen i 10.1 er ikke et lykketreff. La $x_*$ være et stasjonært punkt
der $H(x_*)$ er invertibel, og anta at Hessianen ikke endrer seg for brått
nær $x_*$. Da finnes en konstant $C$ slik at rene Newton-steg fra en start
nær nok $x_*$ oppfyller

$$e_{k+1}\le C\,e_k^2,\qquad e_k=\|x_k-x_*\|.$$

Dette er **kvadratisk konvergens** fra
[uke 2](page4.qmd#lokalt-globalt-og-raskt): når feilen er $10^{-3}$, blir
neste feil omtrent $C\cdot10^{-6}$. Vi kan kontrollere
påstanden i tabellen fra 10.1 ved å se på forholdet $e_{k+1}/e_k^2$:

```{pyodide-python}
#| label: week10-quadratic-ratio
z_min = np.array([3., 2.]); z = np.array([2.5, 2.5]); e = []
for k in range(5):
    e.append(np.linalg.norm(z - z_min))
    z = z + np.linalg.solve(himmel_hess(z), -himmel_grad(z))
for k in range(4):
    print(f'k = {k}: e_k+1 / e_k^2 = {e[k+1]/e[k]**2:.2f}')
```

Forholdet holder seg mellom 0.3 og 0.6. Feilen kvadreres altså i hvert
steg, ganget med en moderat konstant. Legg merke til at setningen sier
**stasjonært punkt**, ikke minimum. Det kommer vi tilbake til i 10.4.

<details class="reading-step">
<summary>Gå i dybden: hvor kommer $e_{k+1}\le Ce_k^2$ fra?</summary>

Se på én variabel, med $f'(x_*)=0$ og $f''(x_*)\ne0$. Taylor for $f'$
rundt $x_k$ gir, for en $\xi$ mellom $x_k$ og $x_*$,

$$0=f'(x_*)=f'(x_k)+f''(x_k)(x_*-x_k)+\tfrac12f'''(\xi)(x_*-x_k)^2.$$

Del på $f''(x_k)$ og bruk $x_{k+1}=x_k-f'(x_k)/f''(x_k)$:

$$x_{k+1}-x_*=\frac{f'''(\xi)}{2f''(x_k)}\,(x_k-x_*)^2.$$

Nær $x_*$ er $f''(x_k)\approx f''(x_*)\ne0$, så $C\approx|f'''(x_*)/(2f''(x_*))|$.
Kravet «Hessianen endrer seg ikke for brått» erstatter $f'''$ i flere
variabler: man krever $\|H(x)-H(y)\|\le M\|x-y\|$ nær $x_*$
(lokalt Lipschitz-kontinuerlig). For et system $g(x)=0$ bruker Newton
**Jacobimatrisen** $(J_g)_{ij}=\partial g_i/\partial x_j$, og for
$g=\nabla f$ er $J_g=H$. Newton for minimering er derfor Newton for
likningssystemet $\nabla f=0$.

</details>

### Bytt enhet: hva skjer med steget?

Anta at vi måler den første koordinaten i desimeter i stedet for meter,
mens den andre beholdes. Et punkt $x$ med to koordinater får da de nye
koordinatene

$$\tilde x=Dx,\qquad D=\begin{bmatrix}10&0\\0&1\end{bmatrix},$$

og funksjonen i de nye koordinatene er $\tilde f(\tilde x)=f(D^{-1}\tilde x)$.
Det er samme funksjon og samme minimum, bare med nye tall på aksene.
Kjerneregelen gir, for en invertibel matrise $D$,

$$\tilde g=D^{-T}g,\qquad \tilde H=D^{-T}HD^{-1}.$$

Her er $D$ diagonal, så $D^{-T}=D^{-1}$.

- **Newton i $\tilde x$:** $\tilde p=-\tilde H^{-1}\tilde g
  =-DH^{-1}D^TD^{-T}g=D\,p$, der $p$ er Newton-steget i $x$.
  Steget i $\tilde x$ er nøyaktig steget i $x$, omregnet til de nye
  enhetene. Vi havner i **samme punkt**.
- **Gradientretning i $\tilde x$:** $-\tilde g=-D^{-1}g$. Omregnet til $x$
  er det $-D^{-2}g$, som peker i en annen retning enn $-g$.

```{pyodide-python}
#| label: week10-invariance
D = np.diag([10., 1.]); Dinv = np.linalg.inv(D)
x = np.array([2.5, 2.5])
g, H = himmel_grad(x), himmel_hess(x)
p = np.linalg.solve(H, -g)                                # Newton i x
p_new = np.linalg.solve(Dinv @ H @ Dinv, -(Dinv @ g))     # Newton i nye koordinater
print('Newton:   D p =', (D @ p).round(2), '    p i nye koordinater =', p_new.round(2))
print('Gradient: D(-g) =', D @ (-g), '  -g i nye koordinater =', -(Dinv @ g))

# Tegn begge koordinatsystemene med Newton-steget og gradientretningen.
fig, axes = plt.subplots(1, 2, figsize=(9, 4))
s = np.linspace(1.8, 3.6, 120); t = np.linspace(1.5, 3.2, 120)
X, Y = np.meshgrid(s, t)
F = (X*X + Y - 11)**2 + (X + Y*Y - 7)**2
for ax, scale, name, newton, grad in [
        (axes[0], 1, 'første koordinat (meter)', p, -g),
        (axes[1], 10, 'første koordinat (desimeter)', p_new, -(Dinv @ g))]:
    ax.contour(scale*X, Y, F, levels=[.5, 2, 5, 10, 20, 40, 60],
               colors='#adb5bd', linewidths=.8)
    start = np.array([scale*2.5, 2.5])
    ax.annotate('', start + newton, start,
                arrowprops={'arrowstyle': '->', 'color': '#1665ad', 'lw': 2})
    shown = np.array([scale, 1.])    # rød pil med samme synlige lengde som den blå
    unit = grad/np.linalg.norm(grad/shown)*np.linalg.norm(newton/shown)
    ax.annotate('', start + unit, start,
                arrowprops={'arrowstyle': '->', 'color': '#b5483f', 'lw': 2, 'ls': '--'})
    ax.plot(scale*3, 2, 'k*', markersize=10)
    ax.set(xlabel=name, ylabel='andre koordinat',
           title='blå: Newton, rød stiplet: gradientretning')
fig.tight_layout(); plt.show()
```

Begge Newton-stegene er $(6.46,\,-0.44)$ i de nye enhetene. Gradientretningen
derimot gir $(190,\,-13)$ når vi regner om fra $x$, men $(1.9,\,-13)$ når vi
regner direkte i $\tilde x$. I figuren peker den blå pilen på samme sted i
begge bildene. I meter peker gradientretningen her tilfeldigvis nesten samme
vei som Newton-steget, så den stiplede røde pilen ligger oppå den blå. I
desimeter peker den nesten rett ned, bort fra minimumet. Newtons metode er
**affint invariant**: den svarer det samme uansett hvilke enheter vi velger.
Gradientmetoden er det ikke.

### Newton er gradientmetoden i koordinatene der $H=I$

Hvis $H$ er SPD, kan vi skrive $H=LL^T$ (Cholesky, se 10.3) og velge de
spesielle koordinatene $\tilde x=L^Tx$. Med $D=L^T$ gir regelen over

$$\tilde H=L^{-1}HL^{-T}=I.$$

I disse koordinatene er skålen rund: alle egenverdier er 1, og $\kappa=1$.
Faktoren $(\kappa-1)/(\kappa+1)$ fra uke 9 blir **null**, og et
gradientsteg med $\alpha=1$ i $\tilde x$ er nøyaktig Newton-steget i $x$.

I [prosjekt 6](project_week6.qmd) skalerte vi med diagonalen av matrisen
og fikk en rundere skål. Newton bruker **hele** Hessianen som skala: det er
den ideelle prekondisjoneringen. Prisen er at $H$ endrer seg fra punkt til
punkt, så vi må finne nye koordinater og løse et nytt system i hvert steg.

## 10.3 Hva koster et Newton-steg?

### Cholesky løser Newton-systemet når Hessianen er SPD

<div id="uke10-cholesky"></div>

For en SPD-matrise $H$ finnes **Cholesky-faktoriseringen** $H=LL^T$, der
$L$ er nedre triangulær med positive diagonalelementer. Dette ble lovet i
[uke 6](uke6.qmd#uke6-energi). Newton-systemet $Hp=-g$ deles i to enkle
systemer:

$$Ly=-g,\qquad L^Tp=y.$$

$y$ er en hjelpevektor, ikke et nytt punkt. Vi finner $y$ ovenfra og ned,
og deretter $p$ nedenfra og opp.

::: {.callout-note title="Håndeksempel: Cholesky og to triangulære systemer"}

**Utgangspunkt.** $H=\begin{bmatrix}4&2\\2&3\end{bmatrix}$ og
$g=(-6,-5)^T$, så høyresiden er $-g=(6,5)^T$.

**Prøv selv.** Skriv $L=\begin{bmatrix}a&0\\b&c\end{bmatrix}$ med $a,c>0$,
og sammenlign $LL^T$ med $H$ ett element om gangen.

**Regnegangen.**

1. $LL^T=\begin{bmatrix}a^2&ab\\ab&b^2+c^2\end{bmatrix}$. Fra $a^2=4$ får
   vi $a=2$, fra $ab=2$ får vi $b=1$, og fra $b^2+c^2=3$ får vi $c=\sqrt2$.
2. $Ly=(6,5)^T$ ovenfra og ned: $2y_1=6$ gir $y_1=3$, og
   $3+\sqrt2\,y_2=5$ gir $y_2=\sqrt2$.
3. $L^Tp=y$ nedenfra og opp: $\sqrt2\,p_2=\sqrt2$ gir $p_2=1$, og
   $2p_1+1=3$ gir $p_1=1$. Kontroll: $Hp=(6,5)^T=-g$.

**Dette tar vi med oss.** Hvert trinn krever en kvadratrot av et positivt
tall: $a^2=4>0$ og $c^2=3-b^2=2>0$. Hvis et slikt tall blir null eller
negativt, stopper faktoriseringen. Det bruker vi i 10.5.

:::

```{pyodide-python}
#| label: week10-cholesky-solve
H = np.array([[4., 2.], [2., 3.]])
g = np.array([-6., -5.])
L = np.linalg.cholesky(H)
y = np.linalg.solve(L, -g)      # første triangulære system
p = np.linalg.solve(L.T, y)     # andre triangulære system
print('L =\n', L)
print('y =', y, ' p =', p, ' kontroll H p =', H @ p)
```

`np.linalg.cholesky` regner bare ut $L$; de to løsningene finner $y$ og $p$.
I større programmer kan `scipy.linalg.solve_triangular` utnytte at
faktorene er triangulære.

**Kostnad.** Cholesky av en $n\times n$-matrise krever omtrent $n^3/3$
regneoperasjoner, mens et gradientsteg koster omtrent $n$ operasjoner i
tillegg til selve gradienten. Ett Newton-steg er altså mye dyrere enn ett
gradientsteg, men Newton trenger langt færre steg; for små $n$, som i 10.1,
lønner det seg. For store $n$ løser vi heller systemet iterativt, for
eksempel med CG fra uke 6.

<details class="reading-step">
<summary>Gå i dybden: Newton utenpå, CG inni</summary>

I [uke 6](uke6.qmd#uke6-cg) løste CG $Az=b$ for SPD $A$ ved å minimere
$\tfrac12z^TAz-b^Tz$. På hvert ytre Newton-steg får vi et *nytt* system
$H(x_k)p_k=-g(x_k)$. Med $A=H(x_k)$, $z=p_k$ og $b=-g(x_k)$ minimerer CG
nettopp den lokale modellen $m_{x_k}(p)$, bortsett fra konstantleddet.

| Nivå | Hva endres? | I skålen fra 10.1, start $x_0=(-2,3)^T$ |
|:--|:--|:--|
| Indre CG | Anslaget på $p$ i $Ap=(8,1)^T$. | Fra $p=0$ finner eksakt CG $p=(3,-1)^T$ på høyst to indre iterasjoner. |
| Ytre Newton | Punktet $x$ etter at retningen er funnet. | Én oppdatering gir $x_1=x_0+p=(1,2)^T$. |

Cholesky og CG er altså to måter å løse det samme indre SPD-systemet på.
**Vanlig CG krever SPD**; at $H$ er invertibel er ikke nok. Stopper vi CG
tidlig, får vi en tilnærmet Newton-retning.

</details>

## 10.4 Når modellen lyver: feil punkt

<div id="uke10-stasjonaer"></div>

### Eksperiment 2 – Newton fra mange starter (tilbakeblikk på prosjekt 2)

Bildet nedenfor er ikke nytt: i prosjekt 2 fargela du startpunkter etter
hvilket nullpunkt Newton fant. Vi gjør det samme for Newton på
$\nabla f=0$ for Himmelblaus funksjon, fra $81\times81$ starter i
$[-5,5]^2$. Det som er nytt, er spørsmålet: **hva slags** stasjonært punkt
ender vi i?

```{pyodide-python}
#| label: week10-basins-pure
from matplotlib.colors import ListedColormap
X0, Y0, kind = newton_basins(safe=False)
for k, name in [(0, 'minimum'), (1, 'sadelpunkt'), (2, 'maksimum'), (-1, 'ikke konvergert')]:
    n = np.sum(kind == k)
    print(f'{name:16s}: {n:5d} starter ({100*n/kind.size:.0f} %)')
fig, ax = plt.subplots(figsize=(5.5, 5))
ax.pcolormesh(X0, Y0, kind, cmap=ListedColormap(['#1665ad', '#e8a33d', '#b5483f']),
              vmin=0, vmax=2, shading='nearest')
ax.set(xlabel='x₀', ylabel='y₀', title='blå: minimum, oransje: sadel, rød: maksimum')
ax.set_aspect('equal'); plt.show()
```

| Sluttpunkt | Antall starter | Andel |
|:--|--:|--:|
| et av de fire minimumene | 3826 | 58 % |
| et av de fire sadelpunktene | 2336 | 36 % |
| maksimumet $(-0.27,-0.92)$, med $f=181.6$ | 399 | 6 % |

Himmelblau har ni stasjonære punkter, og ren Newton finner alle typene.
Det er ikke en feil i programmet: Newton løser $\nabla f=0$, og
setningen om kvadratisk konvergens i 10.2 gjelder like godt nær et
sadelpunkt eller et maksimum. En liten gradientnorm alene kan derfor ikke
skille et minimum fra et sadelpunkt; til det trenger vi krumningen, som i
uke 8.

### Når peker Newton-retningen nedover?

Fra $Hp=-g$ får vi

$$g^Tp=-p^THp.$$

Den retningsderiverte $g^Tp$ er negativ, altså en nedgangsretning, akkurat
når $p^THp>0$. Hvis $H$ er SPD, er det alltid oppfylt. Hvis $H$ har en
negativ egenverdi, kan Newton-retningen peke **oppover**.

Studer **dobbeltbrønnen** $f(u,v)=(u^2-1)^2+v^2/2$, med globale minima
$(\pm1,0)$ og

$$g(u,v)=\begin{bmatrix}4u(u^2-1)\\v\end{bmatrix},\qquad
H(u,v)=\begin{bmatrix}12u^2-4&0\\0&1\end{bmatrix}.$$

- I origo er $g=0$ og $H=\operatorname{diag}(-4,1)$: langs $u$ er
  $f(t,0)=1-2t^2+t^4<1$, langs $v$ er $f(0,t)=1+t^2/2>1$. Origo er et
  **sadelpunkt**.
- I $(0.2,0)$ er $g=(-0.768,0)^T$ og $H=\operatorname{diag}(-3.52,1)$.
  Newton gir $p\approx(-0.218,0)^T$, og $g^Tp\approx0.168>0$: retningen
  peker oppover, mot sadelpunktet.

```{pyodide-python}
#| label: week10-ascent
x = np.array([.2, 0.])
g, H = well_grad(x), well_hess(x)
p = np.linalg.solve(H, -g)
print('I (0.2, 0): egenverdier H =', np.linalg.eigvalsh(H))
print(f'Newton-retning p = {p.round(4) + 0.}, g·p = {g @ p:.4f}')
print(f'f før = {well(x):.4f}, f etter helt steg = {well(x + p):.4f}')
```

Ett helt steg øker $f$ fra $0.9216$ til omtrent $0.9993$. Uten krumningen
kan vi altså ikke vite om Newton-retningen fører mot et minimum.

## 10.5 Sikre retningen og lengden

<div id="uke10-demping"></div>

### Rett retningen: prøv Cholesky

Vi erstatter $H$ med $H+\mu I$, der $\mu\ge0$. Hver egenverdi øker med
$\mu$, så for stor nok $\mu$ blir matrisen SPD. Men hvor stor? Vi trenger
ikke regne ut egenverdiene. **Vi prøver Cholesky:** start med $\mu=0$, og
så lenge faktoriseringen stopper, sett $\mu\leftarrow\max(2\mu,\,0.5)$.

::: {.callout-note title="Håndeksempel: Cholesky-forsøket i dobbeltbrønnen"}

**Utgangspunkt.** I $(0.2,0)$ er $H=\operatorname{diag}(-3.52,1)$ og
$g=(-0.768,0)^T$. Vi prøver $\mu=0,\ 0.5,\ 1,\ 2,\ 4,\ldots$

**Prøv selv.** Første steg i Cholesky er $a^2=h_{11}+\mu$. For hvilke
$\mu$ på listen er dette positivt?

**Regnegangen.**

1. $a^2=-3.52+\mu$ er negativ for $\mu=0,\ 0.5,\ 1,\ 2$. Faktoriseringen
   stopper i første trinn.
2. For $\mu=4$ er $a^2=0.48$ og $c^2=1+4=5$. Faktoriseringen lykkes.
3. Løs $(H+4I)p=-g$: $0.48\,p_1=0.768$ gir $p=(1.6,\,0)^T$, og
   $g^Tp=-0.768\cdot1.6\approx-1.23<0$.

**Dette tar vi med oss.** Cholesky gjør to jobber på én gang: den løser
systemet, og den **tester om matrisen er SPD**. I uke 8 avgjorde vi
definitthet med egenverdiene; for store matriser er Cholesky-forsøket den
praktiske testen, og den er langt billigere enn å regne ut egenverdiene.

:::

```{pyodide-python}
#| label: week10-cholesky-shift
x = np.array([.2, 0.])
g, H = well_grad(x), well_hess(x)
mu = 0.
while True:
    try:
        L = np.linalg.cholesky(H + mu*np.eye(2))
        break
    except np.linalg.LinAlgError:
        print(f'mu = {mu}: Cholesky stopper')
        mu = max(2*mu, .5)
p = np.linalg.solve(L.T, np.linalg.solve(L, -g))
print(f'mu = {mu}: Cholesky lykkes, p = {p + 0.}, g·p = {g @ p:.4f}')
```

### Kontroller lengden: Armijo

Retningen peker nå nedover, men et helt steg kan likevel være for langt.
Vi bruker [Armijo-testen fra uke 9](uke9.qmd#uke9-linjesok): prøv
$\alpha=1,\tfrac12,\tfrac14,\ldots$ og godta den første som gir

$$f(x+\alpha p)\le f(x)+10^{-4}\,\alpha\,g^Tp.$$

```{pyodide-python}
#| label: week10-regularized-step
x = np.array([.2, 0.])
g = well_grad(x)
p = np.array([1.6, 0.])          # retningen fra Cholesky-forsøket
print(f'f(x) = {well(x):.4f}')
for a in [1., .5]:
    print(f'alpha = {a}: x + alpha p = {x + a*p}, f = {well(x + a*p):.4f}')
a, halvings = armijo(well, g, x, p)
print('Armijo godtar alpha =', a, 'etter', halvings, 'halvering')
```

Hele steget går til $(1.8,0)$, der $f=5.0176$, og avvises. Halvt steg
går til $(1,0)$, der $f=0$: et globalt minimum. Her treffer halvt steg
tilfeldigvis minimumet nøyaktig; vanligvis trengs flere steg.
Regulariseringen endret **retningen**, dempingen bestemte **lengden**.

Et helt steg kan svikte også når $H$ er SPD. Ta den **bøyde dalen**

$$q(u,v)=(1-u)^2+10(v-u^2)^2,$$

med globalt minimum $q(1,1)=0$ og

$$g(u,v)=\begin{bmatrix}2(u-1)-40u(v-u^2)\\20(v-u^2)\end{bmatrix},\qquad
H(u,v)=\begin{bmatrix}2-40v+120u^2&-40u\\-40u&20\end{bmatrix}.$$

I $(0,0)$ er $g=(-2,0)^T$ og $H=\operatorname{diag}(2,20)$, altså SPD, og
Newton gir $p=(1,0)^T$. Langs denne retningen skiller modell og funksjon lag:

| Faktor $\alpha$ | Modellen $m_x(\alpha p)=(1-\alpha)^2$ | Faktisk $q(x+\alpha p)=(1-\alpha)^2+10\alpha^4$ |
|:--|--:|--:|
| $0$ | $1$ | $1$ |
| $1$ | $0$ | $10$ |
| $1/2$ | $1/4$ | $7/8=0.875$ |

Hele steget øker verdien fra 1 til 10; halvt steg senker den til $0.875$
og godtas av Armijo. Leddet $10\alpha^4$ fanger ikke modellen opp.

```{pyodide-python}
#| label: week10-backtrack-positive-hess
x = np.array([0., 0.])
g, H = valley_grad(x), valley_hess(x)
p = np.linalg.solve(H, -g)
a, halvings = armijo(valley, g, x, p)
print('H-egenverdier =', np.linalg.eigvalsh(H), ' p =', p)
print('Fullt steg: q =', valley(x + p), ' Armijo: alpha =', a, ', q =', valley(x + a*p))

def newton_path(damped, n):
    point = np.array([0., 0.]); points = [point.copy()]
    for _ in range(n):
        grad, hess = valley_grad(point), valley_hess(point)
        direction = np.linalg.solve(hess, -grad)
        step = armijo(valley, grad, point, direction)[0] if damped else 1.
        point = point + step*direction
        points.append(point.copy())
    return np.array(points)

full_path, damped_path = newton_path(False, 2), newton_path(True, 5)
fig, (ax_map, ax_line) = plt.subplots(1, 2, figsize=(10, 4.3))
u, v = np.meshgrid(np.linspace(-.1, 1.2, 180), np.linspace(-.2, 1.2, 180))
ax_map.contour(u, v, (1-u)**2 + 10*(v-u*u)**2,
               levels=[.001, .01, .05, .1, .25, .5, 1, 2, 5, 10],
               colors='#adb5bd', linewidths=.8)
for name, points, color in [('fullt Newton', full_path, '#b5483f'),
                            ('Armijo-dempet', damped_path, '#1665ad')]:
    ax_map.plot(points[:, 0], points[:, 1], 'o-', color=color, markersize=4, label=name)
ax_map.plot(1, 1, 'k*', markersize=11, label='q = 0')
ax_map.set(xlabel='u', ylabel='v', title='Baner over nivåkurvene til q')
ax_map.set_aspect('equal'); ax_map.legend(fontsize=8, loc='upper left')
alpha_grid = np.linspace(0, 1.1, 180)
ax_line.plot(alpha_grid, [valley(x + t*p) for t in alpha_grid], label='faktisk q(x+αp)')
ax_line.plot(alpha_grid, (1 - alpha_grid)**2, '--', label='lokal modell')
ax_line.set(xlabel='α langs første Newton-retning', ylabel='verdi',
            title='Modellen undervurderer hele steget')
ax_line.legend(fontsize=8); fig.tight_layout(); plt.show()
```

Fullt Newton går først til $(1,0)$, der $q=10$, og deretter til $(1,1)$.
Den dempede banen senker verdien allerede i første steg. SPD sikrer
nedgang for *tilstrekkelig små* steg, ikke for hvert helt steg.

### Resultat – sikret Newton fra de samme startene

Nå kjører vi Eksperiment 2 på nytt, men med begge sikringene: Cholesky-forsøket
for $\mu$ og Armijo-demping.

```{pyodide-python}
#| label: week10-basins-safe
X0, Y0, kind_safe = newton_basins(safe=True)
for k, name in [(0, 'minimum'), (1, 'sadelpunkt'), (2, 'maksimum'), (-1, 'ikke konvergert')]:
    print(f'{name:16s}: {np.sum(kind_safe == k):5d} starter')
```

**Alle 6561 startene ender i et minimum.** Armijo godtar bare steg som
senker $f$, og etter Cholesky-forsøket peker retningen alltid nedover.
Derfor kan metoden ikke ende i maksimumet, og nær et sadelpunkt fører den
negative krumningen den videre nedover. Bare helt spesielle starter kan
ende i et sadelpunkt; ingen av de 6561 gjorde det. Nær et minimum er $H$
SPD, så $\mu=0$ og $\alpha=1$ godtas: sikringen slår seg av, og den
kvadratiske farten fra 10.2 beholdes.
Hvilket av de fire minimumene vi ender i, avhenger fortsatt av starten:
sikringen gir et minimum, ikke det globale.

<details class="reading-step">
<summary>Gå i dybden: sammenlign med SciPy</summary>

<div id="uke10-scipy"></div>

SciPys `minimize` fra [uke 8](uke8.qmd#uke8-scipy) kan gjøre hele søket for
den bøyde dalen. `Newton-CG` bruker Hessianen og løser hvert Newton-system
med en indre CG-iterasjon, som i 10.3. `BFGS` regner aldri ut $H$; den
bygger en tilnærmet Hessian fra hvordan gradienten endrer seg fra steg til
steg. Det gjør hvert steg billigere, mens farten nær minimum likevel er
nesten like god.

```{pyodide-python}
#| label: week10-scipy-compare
for name, kwargs in [('BFGS', {}), ('Newton-CG', {'hess': valley_hess})]:
    res = minimize(valley, np.array([0., 0.]), jac=valley_grad,
                   method=name, options={'maxiter': 100}, **kwargs)
    print(f'{name}: success = {res.success}, ytre iterasjoner = {res.nit}')
    print('  x =', np.round(res.x, 6), f' q(x) = {valley(res.x):.1e}',
          f' ||g(x)|| = {np.linalg.norm(valley_grad(res.x)):.1e}')
```

Begge ender nær $(1,1)$ med liten verdi og gradientnorm. `success = True`
betyr at metodens egne stoppkrav ble møtt, ikke at et globalt minimum er
bevist; det viser vi separat ved at $q$ er en sum av kvadrater og
$q(1,1)=0$. Færre ytre iterasjoner er heller ikke nødvendigvis mindre
arbeid, siden Hessian, gradient og indre løsninger koster forskjellig.
Kallene er forklart i SciPy-oppslaget i 10.7.

</details>

### Gauss–Newton: Newton for minste kvadrater

<div id="uke10-gauss-newton"></div>

Mange optimeringsproblemer er tilpasninger, som i uke 4 og uke 8. Med
vektoren $z$ av ukjente parametre minimerer vi

$$F(z)=\tfrac12\|r(z)\|^2=\tfrac12\sum_{i=1}^m r_i(z)^2,$$

der $r_i$ er avviket mellom modell og måling nummer $i$. La $J$ være
**Jacobimatrisen** til $r$: rad $i$ er gradienten til $r_i$. Da er

$$\nabla F=J^Tr,\qquad
\nabla^2F=J^TJ+\sum_{i=1}^m r_i\,\nabla^2r_i.$$

**Gauss–Newton** dropper summen, som er ganget med residualene og er liten
når modellen passer godt. Steget løser da $J^TJp=-J^Tr$. Det er
normallikningene for

$$\min_p\ \|Jp+r\|,$$

altså et lineært minste kvadraters problem fra
[uke 4](uke4.qmd#uke4-mk), som vi løser med QR eller `np.linalg.lstsq`.
Vi trenger ingen andrederiverte av modellen. Siden
$g^Tp=-\|Jp\|^2\le0$, peker steget aldri oppover, i motsetning til
Newton-retningen i 10.4.

Prøv det på svingningen fra uke 8, $y\approx a\,e^{-0.3t}\cos(\omega t)$,
fra start $(a,\omega)=(1,\,2.3)$:

```{pyodide-python}
#| label: week10-gauss-newton
tf = np.linspace(0, 6, 40)
yf = np.exp(-.3*tf)*np.cos(2*tf) + np.random.default_rng(8).normal(0, .02, tf.size)
def r_wave(z):
    a, w = z
    return a*np.exp(-.3*tf)*np.cos(w*tf) - yf
def J_wave(z):
    a, w = z
    e = np.exp(-.3*tf)
    return np.column_stack([e*np.cos(w*tf), -a*tf*e*np.sin(w*tf)])

z = np.array([1., 2.3])
for k in range(1, 6):
    p = np.linalg.lstsq(J_wave(z), -r_wave(z), rcond=None)[0]   # uke 4
    z = z + p
    print(f'steg {k}: a = {z[0]:.4f}, omega = {z[1]:.4f}, S = {np.sum(r_wave(z)**2):.5f}')
```

Etter tre–fire steg står $a=0.973$, $\omega=2.005$ og $S=0.017$ stille.
Det er den gode dalen fra uke 8. Hvert steg var ett minste kvadraters
problem.

Hvis $J$ er nesten singulær, kan steget bli svært langt. Da bruker vi samme
forskyvning som for $H$ over og løser $(J^TJ+\mu I)p=-J^Tr$. Dette er
**Levenberg–Marquardt**; i litteraturen kalles $\mu$ ofte $\lambda$. I
[prosjekt 10](project_week10.qmd) undersøker du hva det koster å droppe
leddet med residualene, og hva singulærverdiene til $J$ forteller.

I [uke 11](uke11.qmd) får vi lineære bibetingelser og ofte et beste punkt
på randen. Da er gradient null ikke lenger den riktige kontrollen.

## 10.6 Regneoppgaver

<div id="uke10-oppgaver"></div>

Oppgave 1–2 følger 10.1, oppgave 3 følger 10.2, oppgave 4–5 Cholesky i
10.3, oppgave 6–7 dobbeltbrønnen i 10.4, oppgave 8–11 sikringene i 10.5 og
oppgave 12 Gauss–Newton i 10.5.
Svar eksakt der det står «eksakt». I uttrykksfeltene bruker du `*` for
multiplikasjon og `^` for potens. For vektorer fyller du inn én verdi i
hvert komponentfelt. Begrunn klassifiseringene i egne notater; feltene
kontrollerer regningen. Kodeoppgavene står i 10.7.

**Oppgave 1 – uke 2 var Newton.**

```{math-exercise}
#| label: week10-task-week2-newton
#| caption: Oppgave 1 – uke 2 var Newton
#| mode: equivalent
#| partial-credit: true
#| field-labels: Newton-iterasjonen som én brøk, Newton-regelen for f'=0, x1

I uke 2 løste vi $h(x)=x^3+x-1=0$. Skriv Newton-iterasjonen $x-h(x)/h'(x)$ som én brøk. Hvilken av omskrivingene $g_1$, $g_2$, $g_3$ fra uke 2 er dette?

$x-\dfrac{h(x)}{h'(x)}=$ __[(2*x^3+1)/(3*x^2+1)]

Vi vil minimere $f(x)=x^4/4-x$. Skriv Newton-regelen $x-f'(x)/f''(x)$ som et uttrykk i $x$, og regn ut første iterasjon fra $x_0=2$. Svar eksakt.

$x-\dfrac{f'(x)}{f''(x)}=$ __[x-(x^3-1)/(3*x^2)]

$x_1=$ _[17/12]

Feilene $|x_k-1|$ for $k=0,\ldots,5$ er $1,\ 0.42,\ 0.11,\ 1.1\cdot10^{-2},\ 1.1\cdot10^{-4},\ 1.2\cdot10^{-8}$. Hvor mange korrekte desimaler har du etter hvert steg?
```

**Oppgave 2 – ett Newton-steg i skålen fra uke 6.**

```{math-exercise}
#| label: week10-task-quadratic
#| caption: Oppgave 2 – ett Newton-steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: p første komponent, p andre komponent, x1 første komponent, x1 andre komponent

Bruk $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$, $b=(5,5)^T$ og $\phi(x)=\tfrac12x^TAx-b^Tx$. Fra $x_0=(0,0)^T$: løs $Ap=-\nabla\phi(x_0)$ og finn punktet etter ett steg. Svar eksakt.

$p=$ vec[1,2]

$x_1=$ vec[1,2]
```

**Oppgave 3 – samme steg i nye enheter.**

```{math-exercise}
#| label: week10-task-invariance
#| caption: Oppgave 3 – Newton og gradient i nye koordinater
#| mode: equivalent
#| partial-credit: true
#| field-labels: Newton-retning første komponent, Newton-retning andre komponent, minus gradient første komponent, minus gradient andre komponent, minus gradient i z første komponent, minus gradient i z andre komponent, steglengde i z

La $f(u,v)=u^2+100v^2$ og $x=(1,1)^T$. Finn Newton-retningen $p$ og den negative gradienten $-\nabla f$ i $x$.

$p=$ vec[-1,-1]

$-\nabla f(x)=$ vec[-2,-200]

Bytt til koordinatene $z=(u,\,10v)$, slik at $x$ svarer til $z=(1,10)$. Skriv $f$ som funksjon av $z$, og finn den negative gradienten med hensyn på $z$. Finn også steglengden $\alpha$ som gjør at $z+\alpha(-\nabla_z f)$ er minimumspunktet.

$-\nabla_z f=$ vec[-2,-20]

$\alpha=$ _[1/2]

Regn retningen $-\nabla_z f$ om til $(u,v)$-koordinater. Er den parallell med $p$ eller med $-\nabla f$? Hva sier det om hvilke koordinater som er «riktige» for gradientmetoden her?
```

I oppgave 4 og 5 er $H=\begin{bmatrix}9&3\\3&5\end{bmatrix}$ SPD, og vi
skriver $H=LL^T$ med $L$ nedre triangulær med positiv diagonal, som i 10.3.

**Oppgave 4 – finn Cholesky-faktoren.**

```{math-exercise}
#| label: week10-task-cholesky-factor
#| caption: Oppgave 4 – Cholesky-faktor
#| mode: equivalent
#| partial-credit: true
#| field-labels: Første diagonalelement, Nedre element, Andre diagonalelement

For $H=\begin{bmatrix}9&3\\3&5\end{bmatrix}$, finn $a$, $b$ og $c$ i $H=LL^T$ der $L=\begin{bmatrix}a&0\\b&c\end{bmatrix}$ og $a,c>0$. Svar eksakt.

$a=$ _[3]
$b=$ _[1]
$c=$ _[2]
```

**Oppgave 5 – to triangulære systemer.**

```{math-exercise}
#| label: week10-task-cholesky-solves
#| caption: Oppgave 5 – hjelpevektor og Newton-retning
#| mode: equivalent
#| partial-credit: true
#| field-labels: Første komponent av y, Andre komponent av y, Første komponent av p, Andre komponent av p

Bruk faktoren $L$ fra oppgave 4 og høyresiden $-g=(9,7)^T$. Løs først $Ly=-g$ ovenfra og ned, og deretter $L^Tp=y$ nedenfra og opp. Svar eksakt.

$y_1=$ _[3]
$y_2=$ _[2]

$p_1=$ _[2/3]
$p_2=$ _[1]

Kontroller svaret ved å regne ut $Hp$.
```

**Oppgave 6 – sadelpunktet i dobbeltbrønnen.**

```{math-exercise}
#| label: week10-task-saddle
#| caption: Oppgave 6 – sadelpunkt
#| mode: equivalent
#| partial-credit: true
#| field-labels: Gradient første komponent, Gradient andre komponent, Minste egenverdi, Største egenverdi

For $f(u,v)=(u^2-1)^2+v^2/2$, beregn gradienten i $(0,0)$ og Hessianens egenverdier der i stigende rekkefølge. Svar eksakt. Hvorfor er punktet ikke et minimum?

$\nabla f(0,0)=$ vec[0,0]

$\lambda_{\min}=$ _[-4], $\lambda_{\max}=$ _[1]
```

**Oppgave 7 – Newton-retning med negativ krumning.**

```{math-exercise}
#| label: week10-task-direction
#| caption: Oppgave 7 – retningsderivert
#| mode: equivalent
#| partial-credit: true
#| field-labels: Første komponent av p, Andre komponent av p, g prikk p

For dobbeltbrønnen over: start i $(1/2,0)$ og løs $Hp=-g$ eksakt. Beregn $g^Tp$. Betyr fortegnet nedgang eller oppgang for små positive steg?

$p=$ vec[-3/2,0]

$g^Tp=$ _[9/4]
```

**Oppgave 8 – Cholesky som test.**

```{math-exercise}
#| label: week10-task-cholesky-test
#| caption: Oppgave 8 – stopper Cholesky?
#| mode: equivalent
#| partial-credit: true
#| field-labels: a i andre potens, b, c i andre potens, determinant, første mu som godtas

Prøv Cholesky på $H=\begin{bmatrix}1&2\\2&2\end{bmatrix}$ med $L=\begin{bmatrix}a&0\\b&c\end{bmatrix}$. Regn ut $a^2$, deretter $b$, og til slutt det tallet som skal bli $c^2$. Svar eksakt.

$a^2=$ _[1]
$b=$ _[2]
$c^2=$ _[-2]

$\det H=$ _[-2]

Gjenta regningen for $H+\mu I$ med $\mu=0.5$ og $\mu=1$. Hvilken $\mu$ i listen $0,\,0.5,\,1,\,2,\ldots$ godtar Cholesky-forsøket først?

$\mu=$ _[1]

Hva forteller fortegnet til $c^2$ om egenverdiene til $H$? Vis at $c^2=\det H/a^2$ for en $2\times2$-matrise.
```

**Oppgave 9 – Cholesky-forsøket retter retningen.**

```{math-exercise}
#| label: week10-task-regularize
#| caption: Oppgave 9 – regularisert retning
#| mode: equivalent
#| partial-credit: true
#| field-labels: Første mu som godtas, Første komponent av p, Andre komponent av p, g prikk p

I dobbeltbrønnen i punktet $(1/2,0)$ prøver vi Cholesky på $H+\mu I$ med $\mu=0,\,0.5,\,1,\,2,\ldots$ Hvilken $\mu$ godtas først? Løs så $(H+\mu I)p=-g$ og beregn $g^Tp$. Svar eksakt.

$\mu=$ _[2]

$p=$ vec[3/2,0]

$g^Tp=$ _[-9/4]

Forklar hvorfor et lite positivt steg langs $p$ nå gir nedgang.
```

**Oppgave 10 – modellen i den bøyde dalen.**

```{math-exercise}
#| label: week10-task-valley
#| caption: Oppgave 10 – modell og virkelig verdi
#| mode: equivalent
#| partial-credit: true
#| field-labels: Newton-retning første komponent, Newton-retning andre komponent, modell ved fullt steg, faktisk verdi ved fullt steg

For $q(u,v)=(1-u)^2+10(v-u^2)^2$ er $g(0,0)=(-2,0)^T$ og $H(0,0)=\operatorname{diag}(2,20)$. Finn $p$ fra $Hp=-g$, modellverdien $m_{(0,0)}(p)=q(0,0)+g^Tp+\tfrac12p^THp$, og den faktiske verdien $q((0,0)+p)$. Svar eksakt.

$p=$ vec[1,0]

$m_{(0,0)}(p)=$ _[0]
$q(p)=$ _[10]
```

**Oppgave 11 – halvt steg og Armijo.**

```{math-exercise}
#| label: week10-task-half-step
#| caption: Oppgave 11 – dempet steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: Halvt steg første koordinat, Halvt steg andre koordinat, Funksjonsverdien etter halvt steg, Armijo-grensen

Bruk $q(u,v)=(1-u)^2+10(v-u^2)^2$, start $(0,0)$, retning $p=(1,0)$ og $g=(-2,0)^T$. Beregn punktet og funksjonsverdien for $\alpha=1/2$, og høyresiden $q(0,0)+10^{-4}\alpha\,g^Tp$ i Armijo-testen. Svar eksakt.

$x_+=$ vec[1/2,0]

$q(x_+)=$ _[7/8]

Armijo-grensen: _[9999/10000]

Godtas $\alpha=1/2$? Hvorfor ble $\alpha=1$ avvist?
```

**Oppgave 12 – Gauss–Newton eller Newton?**

```{math-exercise}
#| label: week10-task-gauss-newton
#| caption: Oppgave 12 – Gauss–Newton-steg og Newton-steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: J transponert r, J transponert J, Gauss-Newton-steget, andrederivert av F, Newton-steget

Én ukjent $c$ og to residualer: $r_1(c)=c-1$ og $r_2(c)=c^2-4$. Vi minimerer $F(c)=\tfrac12\big(r_1(c)^2+r_2(c)^2\big)$. Her er $J$ en kolonne med de to tallene $r_1'(c)$ og $r_2'(c)$. Regn i $c=1$, og svar eksakt.

$J^Tr=$ _[-6]

$J^TJ=$ _[5]

Gauss–Newton-steget $p=-J^Tr/(J^TJ)$: _[6/5]

$F''(1)=J^TJ+r_1r_1''+r_2r_2''=$ _[-1]

Newton-steget $p=-F'(1)/F''(1)$, der $F'(1)=J^Tr$: _[-6]

Hvilket av de to stegene peker nedover, altså gir $F'(1)\,p<0$? Forklar med fortegnet til $F''(1)$ og til $J^TJ$, og knytt svaret til 10.4.
```

Arbeid videre med [prosjekt 10: posisjon fra avstander](project_week10.qmd).

## 10.7 Python: prøv stegene selv

<div id="uke10-python"></div>

Sammenligningen med SciPy i 10.5 (Gå i dybden) bruker `minimize`.
Oppslagsboksen samler det du trenger å vite om kallet og resultatet.

<details>
<summary>SciPy-oppslag: kall og resultat</summary>

| Uttrykk | Betydning her |
|:--|:--|
| `minimize(fun, x0, jac=grad, method='BFGS')` | Søk fra `x0`; `fun` returnerer et tall, `grad` en vektor. |
| `method='Newton-CG', hess=H` | Gi også funksjonen som returnerer Hessianmatrisen. |
| `options={'maxiter': 100}` | Begrens antall ytre iterasjoner. |
| `res.x`, `res.fun`, `res.success` | Funnet punkt, verdi og solverens stoppstatus. |
| `res.nit`, `res.nfev`, `res.njev`, `res.nhev` | Ytre iterasjoner og antall mål-, gradient- og Hessian-evalueringer når feltene finnes. |

`jac` er SciPys navn på gradientargumentet.

</details>

Fullfør fire korte funksjoner. Hver oppgave har egne importer og
definisjoner og kan kjøres uavhengig av cellene over. `TODO` markerer det
du skal fylle inn. Kontrollene prøver flere inndata uten å vise
løsningskoden.

**Oppgave 1 – løs Newton-systemet.** Funksjonen skal returnere retningen
$p$ for den kvadratiske skålen med Hessian $A$, for et vilkårlig punkt `x`.

```{py-exercise}
#| label: week10-python-quadratic
#| caption: Newton-retning i den kvadratiske skålen
#| show-test-hints: false
import numpy as np

A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 5.])

def newton_direction(x):
    g = A @ x - b
    # TODO: Løs A p = -g uten å beregne matriseinversen.
    p = np.zeros(2)
    return p

## TESTS ##
assert np.allclose(newton_direction(np.array([-2., 3.])), [3., -1.])
assert np.allclose(newton_direction(np.array([0., 0.])), [1., 2.])
assert np.allclose(newton_direction(np.array([1., 2.])), [0., 0.])
```

**Oppgave 2 – test krumningen med Cholesky.** Funksjonen skal returnere
`True` når dobbeltbrønnens Hessian ved `x` er SPD, og `False` ellers.
Bruk `np.linalg.cholesky` i en `try`-blokk: den kaster
`np.linalg.LinAlgError` når matrisen ikke er SPD. (For en matrise som er
nøyaktig singulær, kan avrundingen avgjøre utfallet; det skjer ikke her.)

```{py-exercise}
#| label: week10-python-curvature
#| caption: Er Hessianen SPD?
#| show-test-hints: false
import numpy as np

def well_hess(x):
    u, v = x
    return np.diag([12*u*u - 4, 1.])

def positive_curvature(x):
    H = well_hess(x)
    # TODO: Prøv np.linalg.cholesky(H). Returner True hvis den lykkes,
    # og False hvis den kaster np.linalg.LinAlgError.
    return False

## TESTS ##
assert positive_curvature(np.array([1., 0.]))
assert positive_curvature(np.array([-1., 3.]))
assert not positive_curvature(np.array([0., 0.]))
assert not positive_curvature(np.array([.5, 0.]))
```

**Oppgave 3 – velg mellom tre steglengder.** Bruk den bøyde dalen med et
oppgitt punkt `x`, en retning `p` og gradient `g`. Prøv `1`, `1/2` og `1/4`
i den rekkefølgen, og returner første faktor som oppfyller Armijo-ulikheten
med $c=10^{-4}$.

```{py-exercise}
#| label: week10-python-armijo
#| caption: Velg første godkjente steglengde
#| show-test-hints: false
import numpy as np

def valley(x):
    u, v = x
    return (1-u)**2 + 10*(v-u*u)**2

def first_accepted(x, p, g):
    c = 1e-4
    for alpha in (1., .5, .25):
        # TODO: Erstatt False med Armijo-testen for dette alpha.
        if False:
            return alpha
    return None

## TESTS ##
assert first_accepted(np.array([0., 0.]), np.array([1., 0.]),
                      np.array([-2., 0.])) == .5
assert first_accepted(np.array([1., 0.]), np.array([0., 1.]),
                      np.array([40., -20.])) == 1.
assert first_accepted(np.array([0., 0.]), np.array([.1, 0.]),
                      np.array([-2., 0.])) == 1.
```

**Oppgave 4 – Cholesky-forsøket.** Skriv løkken fra 10.5: start med
`mu = 0`; så lenge `np.linalg.cholesky(H + mu*I)` kaster
`np.linalg.LinAlgError`, sett `mu = max(2*mu, 0.5)`. Returner den første
`mu` som virker.

```{py-exercise}
#| label: week10-python-shift
#| caption: Finn forskyvningen med Cholesky
#| show-test-hints: false
import numpy as np

def cholesky_shift(H):
    I = np.eye(len(H))
    mu = 0.
    # TODO: Prøv Cholesky på H + mu*I, og doble mu (minst 0.5) til det lykkes.
    return mu

## TESTS ##
assert cholesky_shift(np.diag([-3.52, 1.])) == 4.
assert cholesky_shift(np.diag([8., 1.])) == 0.
assert cholesky_shift(np.array([[1., 2.], [2., 2.]])) == 1.
assert cholesky_shift(np.diag([-1., 1.])) == 2.
```

:::
