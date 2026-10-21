<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 10.0 Oversikt

<div id="uke10-start"></div>

### Fra helning til krumning

I [uke 9](uke9.qmd) gjorde Armijo-testen gradientmetoden trygg, men ikke
rask. Selv med det beste faste steget krymper feilen bare med en fast
faktor i hvert steg. Gradienten forteller hvor bratt bakken er, men ikke
hvordan den krummer.

Denne uken bruker vi også **krumningen**, altså Hessianen. Det gir
**Newtons metode** for optimering.

- **Forelesning:** Hovedløpet har fire steg. Vi tar oss tid til å regne
  hvert av dem for hånd, linje for linje.
- **Gå i dybden:** beviset for at sifrene dobles, hva som skjer når vi bytter
  enheter, hvordan Cholesky løser Newton-systemet, hva et Newton-steg koster,
  og en sammenligning med SciPy.
- **Øving:** Flere regneoppgaver i 10.5 og kodeoppgaver i 10.6. På slutten
  av hvert steg lenker vi til regneoppgavene som øver på akkurat det steget.

### Kort løype

1. [Newton er regelen fra uke 2](#uke10-newton): den lokale kvadratiske
   modellen og Newton-likningen $Hp=-g$.
2. [Sifrene dobles](#uke10-kvadratisk): Newton mot gradientmetoden, og
   kvadratisk konvergens i en feiltabell.
3. [Newton kan gå til feil punkt](#uke10-stasjonaer): sadelpunkter,
   maksimum og steg som går oppover.
4. [Reparasjonen](#uke10-demping): Cholesky-forsøket retter retningen,
   Armijo kontrollerer lengden.

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 2: fikspunktiterasjon](page4.qmd) | Hvorfor var den tredje omskrivingen så mye raskere enn de andre? |
| [Prosjekt 2: Newtonfraktaler](project_week2.qmd) | Hvilket nullpunkt finner Newton fra en gitt start? |
| [Uke 8: gradient og Hessian](uke8.qmd#uke8-hessian) | Hvordan ser Taylor-tilnærmingen av andre orden ut? |
| [Uke 6: SPD-matriser](uke6.qmd#uke6-energi) | Hva betyr det at en symmetrisk matrise er positiv definitt? |
| [Uke 9: Armijo](uke9.qmd#uke9-linjesok) | Hvordan godtar eller halverer vi et steg? |

### Læringsmål

Etter denne uken skal du kunne

- utlede Newton-steget som bunnen av den lokale kvadratiske modellen, og
  regne ut ett Newton-steg for hånd for en funksjon av to variabler:
  gradient, Hessian, et $2\times2$-system og det nye punktet,
- kjenne igjen kvadratisk konvergens i en feiltabell ved at antall riktige
  sifre omtrent dobles, og forklare forskjellen fra den faste faktoren i uke 9,
- bruke $g^Tp=-p^THp$ til å forklare når Newton-retningen peker oppover, og
  hvorfor ren Newton kan ende i et sadelpunkt eller et maksimum,
- teste om en $2\times2$-matrise er SPD med Cholesky, og sikre Newton med et
  Cholesky-forsøk for $H+\mu I$ og Armijo-halvering.

## 10.1 Newton er regelen fra uke 2

<div id="uke10-newton"></div>

### Kan krumningen gjøre søket raskere?

I uke 9 brukte vi gradientmetoden til å lete etter bunnen av Himmelblaus funksjon:

$$f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2$$

Dette så vi:

- **Trygg nedstigning:** Metoden gikk trygt nedover.
- **Langsom framgang:** Nær minimumet $(3,2)$ ble feilen bare ganget med
  omtrent $0.52$ i hvert steg, selv med det beste faste steget.
- **Bare lokal helning:** Gradienten sier hvor bratt det er akkurat her, men
  ingenting om hvordan bakken bøyer seg litt lenger borte.

Nå tar vi også med krumningen, altså Hessianen. Metoden som gjør det, heter
**Newtons metode**, og du har møtt den før: i uke 2 for $\sqrt2$ og i
prosjekt 2. En av omskrivingene fra uke 2 var også Newton, uten at vi sa det.

I 10.1 bygger vi oppskriften i tre rolige trinn:

1. Newton for én likning.
2. Newton for minimering i én variabel.
3. Newton i to variabler, med ett steg for hånd på Himmelblaus funksjon.

Hvor rask metoden er, ser vi i 10.2.

### Uke 2 var Newton

<div id="uke10-likning"></div>

I uke 2 løste vi likningen

$$h(x)=x^3+x-1=0.$$

Den har én reell løsning, $r\approx0.6823$. Vi prøvde tre omskrivinger
$x=g(x)$, og den tredje,

$$g_3(x)=\frac{2x^3+1}{3x^2+1},$$

var langt raskest. Nå skal vi se hvor den kom fra.

**Idéen i én variabel.** Vi kan ikke løse $h(x)=0$ direkte, så vi bruker
noe enklere nær gjetningen $x_k$:

- **Lokal tilnærming:** grafen til $h$ ligner på tangentlinjen.
- **Enklere likning:** nullpunktet til en rett linje kan vi alltid finne.

Tangentlinjen i $x_k$ er

$$y=h(x_k)+h'(x_k)(x-x_k).$$

Vi setter $y=0$ og løser for $x$, ett trinn om gangen:

$$0=h(x_k)+h'(x_k)(x-x_k)
\quad\Longrightarrow\quad
x-x_k=-\frac{h(x_k)}{h'(x_k)}
\quad\Longrightarrow\quad
x=x_k-\frac{h(x_k)}{h'(x_k)}.$$

Dette nullpunktet blir neste gjetning $x_{k+1}$. Det er **Newtons metode**
for en likning.

**Regelen for vår likning.** Vi setter inn $h$ og forenkler:

1. Deriver: $h'(x)=3x^2+1$.
2. Sett inn: $x-\dfrac{h(x)}{h'(x)}=x-\dfrac{x^3+x-1}{3x^2+1}$.
3. Skriv $x$ med samme nevner, $x=\dfrac{x(3x^2+1)}{3x^2+1}$, og trekk fra:
   $$x-\frac{x^3+x-1}{3x^2+1}=\frac{x(3x^2+1)-(x^3+x-1)}{3x^2+1}.$$
4. Gang ut telleren: $x(3x^2+1)=3x^3+x$, så telleren er
   $3x^3+x-x^3-x+1=2x^3+1$.
5. Altså er $x-\dfrac{h(x)}{h'(x)}=\dfrac{2x^3+1}{3x^2+1}=g_3(x)$.

**$g_3$ var Newtons metode.** Vi regner de to første iterasjonene fra
$x_0=0.5$, som i uke 2:

$$x_1=g_3(0.5)=\frac{2\cdot0.125+1}{3\cdot0.25+1}=\frac{1.25}{1.75}=\frac57\approx0.7143,$$

$$x_2=g_3\!\left(\tfrac57\right)
=\frac{2\cdot\frac{125}{343}+1}{3\cdot\frac{25}{49}+1}
=\frac{593/343}{124/49}
=\frac{593\cdot49}{343\cdot124}
=\frac{593}{868}\approx0.6832.$$

Cellen fortsetter iterasjonen fra $x_0=0.5$ og skriver ut feilen $|x_k-r|$
etter hvert steg. Slik ser vi hvor raskt $g_3$ nærmer seg løsningen, og
tallene bruker vi igjen i 10.2.

```{pyodide-python}
#| label: week10-week2-table
r = 0.6823278038280193          # løsningen fra uke 2
x = 0.5
print(' k   x_k            feil |x_k - r|')
for k in range(6):
    print(f'{k:2d}   {x:.10f}   {abs(x - r):.1e}')
    x = (2*x**3 + 1)/(3*x**2 + 1)
```

Feilene er $0.18$, $0.032$, $8.5\cdot10^{-4}$, $6.2\cdot10^{-7}$,
$3.3\cdot10^{-13}$ og til slutt null i flyttall. Legg merke til
eksponentene; vi kommer tilbake til dem i 10.2.

### Newton for minimering: der den deriverte er null

For å minimere en funksjon $f$ av én variabel leter vi etter et punkt der
$f'(x)=0$. Det er også en likning, så vi bruker Newton på den. Vi setter
altså $h=f'$, og da er $h'=f''$:

$$x_{k+1}=x_k-\frac{f'(x_k)}{f''(x_k)}.$$

Likningen fra uke 2 var faktisk et minimeringsproblem i forkledning. Ta

$$f(x)=\tfrac14x^4+\tfrac12x^2-x.$$

- **Deriver ledd for ledd:** $f'(x)=x^3+x-1$ og $f''(x)=3x^2+1$.
- **Kontroller krumningen:** siden $f''(x)>0$ for alle $x$, krummer $f$
  oppover overalt. Funksjonen er konveks (uke 8), og det eneste stasjonære
  punktet $r$ er minimumet.
- **Bruk Newton:** Newton for å minimere $f$ er nøyaktig $g_3$.

**Det samme steget fra en modell.** Denne måten å se steget på virker også
i flere variabler:

- **Modellen:** nær $x_k$ erstatter vi $f$ med parabelen som har samme verdi,
  samme helning og samme krumning som $f$ i $x_k$.
- **Steget:** vi skriver Taylor-polynomet av andre grad med $p=x-x_k$:

$$m(p)=f(x_k)+f'(x_k)\,p+\tfrac12f''(x_k)\,p^2.$$

Når $f''(x_k)>0$, har parabelen et bunnpunkt. Vi finner det ved å derivere
med hensyn på $p$ og sette lik null:

$$m'(p)=f'(x_k)+f''(x_k)\,p=0
\quad\Longrightarrow\quad
p=-\frac{f'(x_k)}{f''(x_k)}.$$

Det er Newton-steget. **Newton går til bunnen av den lokale parabelen.**

Kontroll med tallene over, i $x_0=0.5$:

1. **Helning og krumning:** $f'(0.5)=0.125+0.5-1=-0.375$ og
   $f''(0.5)=0.75+1=1.75$.
2. **Steg:** $p=0.375/1.75=3/14\approx0.2143$.
3. **Nytt punkt:** $x_1=0.5+3/14=5/7$, som før.

La oss se dette som et bilde. Cellen tegner $f$ og parabelen $m$ rundt
$x_0=0.5$, og en trekant der parabelen har bunnen sin. Det er punktet
Newton hopper til.

```{pyodide-python}
#| label: week10-model-1d
# f fra uke 2, parabelen i x0 = 0.5 og bunnen av parabelen (Newton-punktet x1).
show_model(lambda x: x**4/4 + x**2/2 - x, lambda x: x**3 + x - 1,
           lambda x: 3*x**2 + 1, x0=.5, xlim=(-.5, 1.5))
```

**Hva viser bildet?**

- **Tilnærmingen:** nær $x_0$ ligger parabelen nesten oppå $f$.
- **Neste punkt:** bunnen av parabelen, $x_1=5/7\approx0.714$, ligger derfor
  nær bunnen av $f$ i $r\approx0.682$.
- **Videre:** i $x_1$ tegner vi en ny parabel, og slik fortsetter vi.

### Flere variabler: Newton-likningen

I to variabler skriver vi punktet som $z=(x,y)$. Vi bytter $f'$ med
gradienten $g=\nabla f$ og $f''$ med Hessianen $H$ fra
[uke 8.3](uke8.qmd#uke8-hessian). Parabelen blir den
kvadratiske modellen

$$m(p)=f(z_k)+g^Tp+\tfrac12p^THp,$$

Her betyr symbolene:

- **Data i nåværende punkt:** $g=g(z_k)$ og $H=H(z_k)$.
- **Steg:** $p=(p_1,p_2)$.
- **Matriseelementer:** tallene $h_{ij}$ er elementene i $H$ (de har ikke
  noe med likningen $h$ over å gjøre). Hessianen er symmetrisk, så
  $h_{21}=h_{12}$.

Hvis vektorformen ikke sitter, kan vi skrive modellen ut med komponenter:

$$m(p)=f(z_k)+g_1p_1+g_2p_2+\tfrac12\big(h_{11}p_1^2+2h_{12}p_1p_2+h_{22}p_2^2\big).$$

Bunnen av modellen ligger der begge partiellderiverte er null:

$$\frac{\partial m}{\partial p_1}=g_1+h_{11}p_1+h_{12}p_2=0,\qquad
\frac{\partial m}{\partial p_2}=g_2+h_{12}p_1+h_{22}p_2=0.$$

Som matriselikning er dette $g+Hp=0$. Det gir **Newton-likningen**

$$\boxed{H(z_k)\,p_k=-g(z_k),\qquad z_{k+1}=z_k+p_k.}$$

- **Arbeidet i hvert steg:** løs ett lineært system; med to variabler er det
  et $2\times2$-system.
- **Når $H$ er SPD:** modellen er en skål, og $p_k$ er bunnen av skålen.
  Hva som skjer når $H$ ikke er SPD, ser vi i 10.3.
- **For en kvadratisk funksjon med SPD-Hessian:** modellen er lik
  funksjonen, og da treffer ett steg minimumet. Det regner du på i 10.5.

::: {.callout-note title="Håndeksempel: ett Newton-steg fra (2.5, 2.5)"}

**Utgangspunkt.** Himmelblaus funksjon
$f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2$ og startpunktet $z_0=(2.5,\,2.5)$. Vi
kaller de to parentesene $a=x^2+y-11$ og $b=x+y^2-7$ (i uke 9 het de $u$ og
$w$), slik at $f=a^2+b^2$.

**Prøv selv.** Regn ut $g$ og $H$ i $z_0$, løs $Hp=-g$ og finn $z_1$. Blir
$f(z_1)$ mindre enn $f(z_0)$?

**Regnegangen.**

1. **Gradienten** fant vi i [uke 9](uke9.qmd#uke9-gradient) med
   kjerneregelen:
   $$f_x=4xa+2b,\qquad f_y=2a+4yb.$$
2. **Hessianen.** Vi deriverer gradienten en gang til med produktregelen.
   Vi trenger $\partial a/\partial x=2x$, $\partial a/\partial y=1$,
   $\partial b/\partial x=1$ og $\partial b/\partial y=2y$:
   $$\begin{aligned}
   f_{xx}&=\tfrac{\partial}{\partial x}(4xa+2b)=4a+4x\cdot2x+2=4a+8x^2+2,\\
   f_{xy}&=\tfrac{\partial}{\partial y}(4xa+2b)=4x\cdot1+2\cdot2y=4x+4y,\\
   f_{yy}&=\tfrac{\partial}{\partial y}(2a+4yb)=2+4b+4y\cdot2y=4b+8y^2+2.
   \end{aligned}$$
   Kontroll: $\tfrac{\partial}{\partial x}(2a+4yb)=4x+4y$ er også $f_{xy}$.
   Ganget ut er $f_{xx}=12x^2+4y-42$ og $f_{yy}=12y^2+4x-26$, som Hessianen
   i uke 9.
3. **Sett inn $z_0=(2.5,\,2.5)$.** Først
   $a=6.25+2.5-11=-2.25$ og $b=2.5+6.25-7=1.75$, så
   $f(z_0)=5.0625+3.0625=8.125$. Deretter
   $$\begin{aligned}
   g_1&=4\cdot2.5\cdot(-2.25)+2\cdot1.75=-22.5+3.5=-19,\\
   g_2&=2\cdot(-2.25)+4\cdot2.5\cdot1.75=-4.5+17.5=13,\\
   h_{11}&=4\cdot(-2.25)+8\cdot6.25+2=-9+50+2=43,\\
   h_{12}&=4\cdot2.5+4\cdot2.5=20,\\
   h_{22}&=4\cdot1.75+8\cdot6.25+2=7+50+2=59.
   \end{aligned}$$
4. **Newton-likningen** $Hp=-g$ er
   $$43p_1+20p_2=19\quad\text{(I)},\qquad 20p_1+59p_2=-13\quad\text{(II)}.$$
5. **Løs systemet.** Fra (I) er $p_1=(19-20p_2)/43$. Sett inn i (II) og
   gang hele likningen med $43$:
   $$\begin{aligned}
   20(19-20p_2)+43\cdot59\,p_2&=-13\cdot43,\\
   380-400p_2+2537p_2&=-559,\\
   2137p_2&=-939,
   \end{aligned}$$
   så $p_2=-939/2137\approx-0.4394$. Da er
   $p_1=(19+20\cdot0.4394)/43=27.788/43\approx0.6462$.
   Kontroll i (II): $20\cdot0.6462+59\cdot(-0.4394)=12.924-25.925\approx-13.00$.
6. **Nytt punkt.** $z_1=(2.5+0.6462,\ 2.5-0.4394)=(3.1462,\ 2.0606)$.
7. **Kontroll av $f$.** Med flere desimaler er $z_1\approx(3.14623,\,2.06060)$:

   - $3.14623^2\approx9.8988$, så $a\approx9.8988+2.0606-11=0.9594$.
   - $2.0606^2\approx4.2461$, så $b\approx3.1462+4.2461-7=0.3923$.
   - Dermed er $f(z_1)\approx0.9594^2+0.3923^2\approx0.9204+0.1539=1.074$.
     Verdien falt fra $8.125$.

8. **Kontroll av avstanden:** avstanden til minimumet $(3,2)$ krympet fra
   $\sqrt{0.5^2+0.5^2}\approx0.71$ til $\sqrt{0.1462^2+0.0606^2}\approx0.16$.

**Dette tar vi med oss.**

1. Regn ut $g$ og $H$.
2. Løs ett lineært system.
3. Flytt til det nye punktet.

Modellen er bare lokal, så i $z_1$ må vi regne ut ny $g$ og ny $H$ og løse
et nytt system.

:::

Cellen kontrollerer håndregningen. I Python løser `np.linalg.solve(H, -g)`
systemet i trinn 5 uten å regne ut en invers matrise; det øver du på i
kodeoppgavene i 10.6.

```{pyodide-python}
#| label: week10-hand-step
z0 = np.array([2.5, 2.5])
g, H = himmel_grad(z0), himmel_hess(z0)
p = np.linalg.solve(H, -g)
z1 = z0 + p
print('g =', g, '  H =', H.tolist())
print('p =', p.round(4), '  z1 =', z1.round(4))
print(f'f(z0) = {himmel(z0):.3f},  f(z1) = {himmel(z1):.4f}')
print(f'avstand til (3,2): {np.linalg.norm(z1 - [3, 2]):.3f},  g·p = {g @ p:.2f}')
```

**Øv på dette:** [Newton-regelen fra uke 2](#uke10-ov-uke2), [ett Newton-steg for hånd](#uke10-ov-handsteg) og [ett steg treffer for en kvadratisk funksjon](#uke10-ov-kvadratisk).

## 10.2 Sifrene dobles

<div id="uke10-kvadratisk"></div>

### Hvor rask er Newton?

I 10.1 tok vi ett Newton-steg for hånd fra $(2.5,\,2.5)$, og avstanden til
minimumet $(3,2)$ krympet fra $0.71$ til $0.16$. Nå lar vi cellen ta flere
slike steg, og vi lar gradientmetoden fra uke 9 starte i samme punkt.

- **Felles mål:** avstanden $e_k=\|z_k-(3,2)\|$, der $z_k$ er punktet etter
  $k$ steg.
- **Gradientmetodens steg:** det beste faste steget fra uke 9,
  $\alpha=2/(\lambda_{\min}+\lambda_{\max})$, der $\lambda_i$ er
  egenverdiene til Hessianen i $(3,2)$.

Cellen tar Newton-stegene med `np.linalg.solve(H, -g)`, akkurat slik vi
kontrollerte håndeksemplet. Målet er å se hvor mye raskere et søk blir når
det også bruker krumningen, og å få en feiltabell vi kan tolke.

### Eksperiment 1 – Newton og gradientmetoden fra samme start

- Forutsi først: feilen starter på $0.71$, og gradientmetoden ganger den med
  omtrent $0.52$ per steg. Hvor stor er feilen etter fem steg?
- Kjør cellen og sammenlign de to kolonnene i tabellen.
- Se på plottet: hvilken kurve er en rett linje, og hvilken bøyer nedover?
- Bytt startpunktet til $(3.5,\,1.5)$ og undersøk om Newton fortsatt er
  like rask.

```{pyodide-python}
#| label: week10-newton-vs-gradient
# Fem steg med Newton (oppskriften fra 10.1) og med gradientmetoden fra uke 9.
# Utskriften viser avstanden til minimumet (3, 2) etter hvert steg.
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
plot_errors({'Newton': e_newton, 'gradient, beste faste steg': e_grad})
```

| $k$ | 0 | 1 | 2 | 3 | 4 | 5 |
|:--|--:|--:|--:|--:|--:|--:|
| Newton | 0.71 | 0.16 | $1.0\cdot10^{-2}$ | $6.3\cdot10^{-5}$ | $1.6\cdot10^{-9}$ | 0 |
| gradient | 0.71 | 0.30 | 0.13 | 0.065 | 0.033 | 0.017 |

**Hva viser forsøket?**

- **Første Newton-steg:** feilen $0.16$ er håndeksemplet fra 10.1.
- **Gradientmetoden:** feilen halveres omtrent i hvert steg, slik uke 9
  forutsa. Etter fem steg er den fortsatt over $10^{-2}$. Faktoren $0.52$
  gir forutsigelsen $0.71\cdot0.52^5\approx0.03$; tabellen viser $0.017$,
  altså samme størrelsesorden.
- **Newton etter fem steg:** feilen er null i flyttall.

Resten av 10.2 handler om hvorfor feilen faller så brått.

### Tell sifrene

Se igjen på Newton-raden i tabellen over. Nå teller vi sifrene:

- **Praktisk mål:** $-\log_{10}e_k$ angir omtrent hvor mange riktige sifre vi
  har. Feilen $10^{-3}$ betyr omtrent tre riktige desimaler.
- **Siste kolonne:** forholdet $e_{k+1}/e_k^2$ forklarer vi like under.

Cellen regner ut begge størrelsene for hvert steg.

```{pyodide-python}
#| label: week10-quadratic-ratio
z_min = np.array([3., 2.]); z = np.array([2.5, 2.5]); e = []
for k in range(5):
    e.append(np.linalg.norm(z - z_min))
    z = z + np.linalg.solve(himmel_hess(z), -himmel_grad(z))
print(' k   e_k       riktige sifre   e_k+1 / e_k^2')
for k in range(5):
    ratio = f'{e[k+1]/e[k]**2:.2f}' if k < 4 else ''
    print(f'{k:2d}   {e[k]:.1e}   {-np.log10(e[k]):5.1f}           {ratio}')
```

| $k$ | 0 | 1 | 2 | 3 | 4 |
|:--|--:|--:|--:|--:|--:|
| $e_k$ | 0.71 | 0.16 | $1.0\cdot10^{-2}$ | $6.3\cdot10^{-5}$ | $1.6\cdot10^{-9}$ |
| riktige sifre $\approx-\log_{10}e_k$ | 0.2 | 0.8 | 2.0 | 4.2 | 8.8 |

| Metode | Hva skjer med sifrene? |
|:--|:--|
| Newton | Fra steg 1 er antall riktige sifre omtrent $1,\ 2,\ 4,\ 8$: **sifrene dobles i hvert steg**. |
| Gradientmetoden | Halvering av feilen gir bare $\log_{10}2\approx0.3$ nye sifre per steg. Ti steg gir omtrent tre sifre, uansett hvor nær vi er. |

Samme Newton-mønster står i tabellen fra uke 2 i 10.1: eksponentene er
$10^{-2}$, $10^{-4}$, $10^{-7}$ og $10^{-13}$.

- **I uke 9:** kondisjonstallet $\kappa$ bestemte farten.
- **For Newton nær minimumet:** $\kappa$ spiller ingen rolle. Metoden bruker
  hele Hessianen som målestokk, og bytter vi enheter, får vi nøyaktig det
  samme steget.
- **Mellomregningene:** se de to «Gå i dybden»-boksene om enheter lenger ned
  i 10.2 og om koordinatene der $H=I$ i 10.4.

### Hvorfor dobles sifrene?

Anta at neste feil er omtrent en konstant ganger **kvadratet** av forrige
feil:

$$e_{k+1}\approx C\,e_k^2.$$

- **Kvadrering av feilen:** med $e_k=10^{-4}$ er $e_k^2=10^{-8}$, og da er
  $e_{k+1}\approx C\cdot10^{-8}$. Kvadratet dobler eksponenten; konstanten
  $C$ flytter bare sifrene litt.
- **Fast faktor:** for gradientmetoden er $e_{k+1}\approx S\,e_k$ med en fast
  konvergensfaktor $S<1$, som i uke 2 og 9. Det kalles **lineær konvergens**,
  og da kommer det like mange nye sifre i hvert steg.

For Newton gjelder dette under tre forutsetninger:

- $z_*$ er et stasjonært punkt der $H(z_*)$ er invertibel.
- Hessianen endrer seg ikke for brått nær $z_*$.
- Vi tar rene Newton-steg fra en start nær nok $z_*$.

Da finnes en konstant $C$ slik at

$$e_{k+1}\le C\,e_k^2,\qquad e_k=\|z_k-z_*\|.$$

Dette er **kvadratisk konvergens** fra
[uke 2](page4.qmd#uke2-konvergensfart).

- **Kontroll i siste kolonne:** forholdet $e_{k+1}/e_k^2$ holder seg mellom
  $0.3$ og $0.6$.
- **Tolkning:** feilen kvadreres i hvert steg, ganget med en moderat konstant.

Legg merke til at setningen sier **stasjonært punkt**, ikke minimum. Det
kommer vi tilbake til i 10.3.

<details class="reading-step">
<summary>Gå i dybden: hvor kommer $e_{k+1}\le Ce_k^2$ fra?</summary>

Vi ser på én variabel. La $x_*$ være et stasjonært punkt, $f'(x_*)=0$, med
$f''(x_*)\ne0$, og la $e_k=x_k-x_*$ (med fortegn).

1. Taylors formel med restledd for funksjonen $f'$ rundt $x_k$ gir, for en
   $\xi$ mellom $x_k$ og $x_*$,
   $$f'(x_*)=f'(x_k)+f''(x_k)(x_*-x_k)+\tfrac12f'''(\xi)(x_*-x_k)^2.$$
2. Venstresiden er null, og $x_*-x_k=-e_k$:
   $$0=f'(x_k)-f''(x_k)\,e_k+\tfrac12f'''(\xi)\,e_k^2.$$
3. Del på $f''(x_k)$, som ikke er null nær $x_*$:
   $$0=\frac{f'(x_k)}{f''(x_k)}-e_k+\frac{f'''(\xi)}{2f''(x_k)}\,e_k^2.$$
4. Newton-steget $x_{k+1}=x_k-f'(x_k)/f''(x_k)$ betyr at
   $f'(x_k)/f''(x_k)=x_k-x_{k+1}$. Sett inn, og skriv $e_k=x_k-x_*$:
   $$0=(x_k-x_{k+1})-(x_k-x_*)+\frac{f'''(\xi)}{2f''(x_k)}\,e_k^2
   =-(x_{k+1}-x_*)+\frac{f'''(\xi)}{2f''(x_k)}\,e_k^2.$$
5. Siden $x_{k+1}-x_*=e_{k+1}$, står det
   $$e_{k+1}=\frac{f'''(\xi)}{2f''(x_k)}\,e_k^2.$$
6. Ta absoluttverdi. Nær $x_*$ er $\xi\approx x_*$ og
   $f''(x_k)\approx f''(x_*)$, så
   $$|e_{k+1}|\approx C\,|e_k|^2,\qquad C=\left|\frac{f'''(x_*)}{2f''(x_*)}\right|.$$

**Kontroll med uke 2.** For $f(x)=\tfrac14x^4+\tfrac12x^2-x$ er
$f''(x)=3x^2+1$ og $f'''(x)=6x$. Da er

$$C=\frac{6r}{2(3r^2+1)}=\frac{3r}{3r^2+1}
\approx\frac{2.0470}{2.3967}\approx0.854.$$

Cellen regner ut forholdet $e_{k+1}/e_k^2$ for iterasjonen fra uke 2 og
sammenligner det med $C$. Stemmer utledningen, skal forholdene nærme seg $C$.

```{pyodide-python}
#| label: week10-taylor-check
r = 0.6823278038280193
x, e = 0.5, []
for k in range(5):
    e.append(abs(x - r))
    x = (2*x**3 + 1)/(3*x**2 + 1)
print('e_k+1 / e_k^2:', [round(e[k+1]/e[k]**2, 3) for k in range(3)])
print(f'C = 3r/(3r^2+1) = {3*r/(3*r*r + 1):.3f}')
```

Forholdene $0.961$, $0.834$ og $0.854$ nærmer seg $C\approx0.854$.

**Flere variabler.** Samme regning går gjennom med Taylor for gradienten.

- **Regularitetskravet:** «Hessianen endrer seg ikke for brått» erstatter
  $f'''$. Man krever $\|H(z)-H(w)\|\le M\|z-w\|$ nær $z_*$ (lokalt
  Lipschitz-kontinuerlig).
- **Likningssystemet:** for $G(z)=0$ bruker Newton **Jacobimatrisen**
  $(J_G)_{ij}=\partial G_i/\partial z_j$.
- **Minimering:** for $G=\nabla f$ er $J_G=H$. Newton for minimering er
  derfor Newton for likningssystemet $\nabla f=0$.

</details>

<details class="reading-step">
<summary>Gå i dybden: Newton bryr seg ikke om enhetene</summary>

<div id="uke10-skala"></div>

En grunn til at Newton er så rask, er at metoden selv velger riktig skala.
Anta at vi måler den første koordinaten i desimeter i stedet for meter,
mens den andre beholdes. Punktet $z=(x,y)$ får de nye koordinatene

$$\tilde z=Dz,\qquad D=\begin{bmatrix}10&0\\0&1\end{bmatrix},$$

og funksjonen i de nye koordinatene er
$\tilde f(\tilde z)=f(D^{-1}\tilde z)=f(\tilde z_1/10,\ \tilde z_2)$. Det er
samme funksjon og samme minimum, bare med nye tall på aksene.

**Gradient og Hessian i nye enheter.** Med $x=\tilde z_1/10$ og $y=\tilde z_2$
gir kjerneregelen

$$\frac{\partial\tilde f}{\partial\tilde z_1}=f_x\cdot\frac{1}{10},\qquad
\frac{\partial\tilde f}{\partial\tilde z_2}=f_y,$$

og en gang til

$$\frac{\partial^2\tilde f}{\partial\tilde z_1^2}=\frac{f_{xx}}{100},\qquad
\frac{\partial^2\tilde f}{\partial\tilde z_1\partial\tilde z_2}=\frac{f_{xy}}{10},\qquad
\frac{\partial^2\tilde f}{\partial\tilde z_2^2}=f_{yy}.$$

På matriseform er det $\tilde g=D^{-1}g$ og $\tilde H=D^{-1}HD^{-1}$.

**Den generelle regelen.** Senere trenger vi en $D$ som ikke er diagonal, så
vi gjør regningen for en vilkårlig invertibel $D$. Nå er $z=D^{-1}\tilde z$,
altså $z_i=\sum_j(D^{-1})_{ij}\tilde z_j$ og
$\partial z_i/\partial\tilde z_j=(D^{-1})_{ij}$. Kjerneregelen gir

$$\frac{\partial\tilde f}{\partial\tilde z_j}
=\sum_i\frac{\partial f}{\partial z_i}\,\frac{\partial z_i}{\partial\tilde z_j}
=\sum_i(D^{-1})_{ij}\,g_i=\big(D^{-T}g\big)_j.$$

Deriverer vi dette en gang til med hensyn på $\tilde z_l$, på samme måte,
får vi $\sum_{i,k}(D^{-1})_{ij}\,h_{ik}\,(D^{-1})_{kl}$, som er element
$(j,l)$ i $D^{-T}HD^{-1}$. Altså er

$$\tilde g=D^{-T}g,\qquad \tilde H=D^{-T}HD^{-1}.$$

For en diagonal $D$ er $D^{-T}=D^{-1}$, og vi får formlene over igjen.

**Tallene fra 10.1.** I $z_0=(2.5,\,2.5)$ var $g=(-19,13)^T$ og
$H=\begin{bmatrix}43&20\\20&59\end{bmatrix}$. I desimeter blir

$$\tilde g=\begin{bmatrix}-1.9\\13\end{bmatrix},\qquad
\tilde H=\begin{bmatrix}43/100&20/10\\20/10&59\end{bmatrix}
=\begin{bmatrix}0.43&2\\2&59\end{bmatrix}.$$

Kontroller steget i de nye enhetene:

1. **Newton-likningen:** $\tilde H\tilde p=-\tilde g$ gir
   $0.43\tilde p_1+2\tilde p_2=1.9$ og $2\tilde p_1+59\tilde p_2=-13$.
2. **Prøv $\tilde p=(6.462,\,-0.4394)$:**
   $0.43\cdot6.462+2\cdot(-0.4394)=2.779-0.879=1.900$ og
   $2\cdot6.462+59\cdot(-0.4394)=12.924-25.925\approx-13.00$. Det stemmer.
3. **Regn om meter-steget:**
   $Dp=(10\cdot0.6462,\ -0.4394)=(6.462,\,-0.4394)$.

**Steget i desimeter er nøyaktig steget i meter, omregnet.** Vi havner i
samme punkt.

**Hvorfor gjelder det alltid?** Med regelen $(ABC)^{-1}=C^{-1}B^{-1}A^{-1}$ er
$(D^{-T}HD^{-1})^{-1}=DH^{-1}D^T$. Da er

$$\tilde p=-\tilde H^{-1}\tilde g=-DH^{-1}D^T\,D^{-T}g=-DH^{-1}g=D\,p.$$

**Gradientretningen oppfører seg annerledes.**

| Retning | I desimeter |
|:--|:--|
| Negativ gradient regnet i de nye enhetene | $-\tilde g=(1.9,\,-13)$ |
| Negativ gradient fra meter, omregnet | $D(-g)=(190,\,-13)$ |

De to peker i helt forskjellige retninger.

Cellen regner ut Newton-steget og den negative gradienten i begge
enhetssystemene og tegner dem over nivåkurvene. Slik ser vi hvilken av de to
retningene som peker mot samme punkt etter enhetsbyttet.

```{pyodide-python}
#| label: week10-invariance
D = np.diag([10., 1.]); Dinv = np.linalg.inv(D)
z = np.array([2.5, 2.5])
g, H = himmel_grad(z), himmel_hess(z)
p = np.linalg.solve(H, -g)                                # Newton i meter
p_new = np.linalg.solve(Dinv @ H @ Dinv, -(Dinv @ g))     # Newton i desimeter
print('Newton:   D p =', (D @ p).round(2), '    p i nye koordinater =', p_new.round(2))
print('Gradient: D(-g) =', D @ (-g), '  -g i nye koordinater =', -(Dinv @ g))
show_units(p, -g, p_new, -(Dinv @ g))
```

- **Blå Newton-pil:** ender i samme punkt i begge bildene.
- **Rød gradientpil i meter:** peker her tilfeldigvis nesten samme vei som
  Newton-steget, så den stiplede røde pilen ligger oppå den blå.
- **Rød gradientpil i desimeter:** peker nesten rett ned, langt fra
  retningen mot minimumet.

Newtons metode er **affint invariant**: den svarer det samme uansett
hvilke enheter vi velger. Gradientmetoden er det ikke.

**Øv på dette:** [samme steg i nye enheter](#uke10-ov-enheter).

</details>

**Øv på dette:** [feilen kvadreres](#uke10-ov-sifre).

## 10.3 Newton kan gå til feil punkt

<div id="uke10-stasjonaer"></div>

### Finner Newton alltid et minimum?

I 10.1 og 10.2 startet vi nær minimumet $(3,2)$, og Newton var svært rask.
Men setningen i 10.2 lovet bare at Newton finner et **stasjonært punkt**,
altså et punkt der $\nabla f=0$. Himmelblaus funksjon har ni slike punkter:
fire minima, fire sadelpunkter og ett maksimum.

Bildet vi skal lage, er ikke nytt: i prosjekt 2 fargela du startpunkter
etter hvilket nullpunkt Newton fant. Nå gjør vi det samme for Newton på
likningen $\nabla f=0$.

- **Starter:** $81\times81$ punkter i $[-5,5]^2$.
- **Ferdig hjelper:** `newton_basins` tar opptil 80 rene Newton-steg fra hver
  start og klassifiserer sluttpunktet med gradienten og Hessianen, som i uke 8.

Hvorfor fordelingen blir som den blir, forklarer vi etter forsøket.

Målet er å se hvor ofte ren Newton ender i et punkt vi ikke ville ha: et
sadelpunkt eller et maksimum.

### Eksperiment 2 – Newton fra mange starter (tilbakeblikk på prosjekt 2)

- Forutsi: hvor stor andel av startene tror du ender i et minimum?
- Kjør cellen og les av antallet for hver type sluttpunkt.
- Finn et område i bildet der nabostarter ender i ulike typer punkter.
- Bytt til et finere gitter, `newton_basins(safe=False, n=161)`, og undersøk
  om andelene endrer seg.

```{pyodide-python}
#| label: week10-basins-pure
# Rene Newton-steg fra 81 x 81 starter; fargen viser typen sluttpunkt.
X0, Y0, kind = newton_basins(safe=False)
for k, name in [(0, 'minimum'), (1, 'sadelpunkt'), (2, 'maksimum'), (-1, 'ikke konvergert')]:
    n = np.sum(kind == k)
    print(f'{name:16s}: {n:5d} starter ({100*n/kind.size:.0f} %)')
show_basins(X0, Y0, kind)
```

| Sluttpunkt | Antall starter | Andel |
|:--|--:|--:|
| et av de fire minimumene | 3826 | 58 % |
| et av de fire sadelpunktene | 2336 | 36 % |
| maksimumet $(-0.27,-0.92)$, med $f=181.6$ | 399 | 6 % |

**Hva viser forsøket?**

- **Resultatet:** bare 58 % av startene ender i et minimum. Ren Newton finner
  alle typene stasjonære punkter, også maksimumet.
- **Forklaringen:** det er ikke en feil i programmet. Newton løser likningen
  $\nabla f=0$ og spør ikke om punktet er et minimum.
- **Farten:** setningen om kvadratisk konvergens i 10.2 gjelder like godt
  nær et sadelpunkt eller et maksimum.
- **Kontrollen:** en liten gradient alene kan ikke skille et minimum fra
  et sadelpunkt. Til det trenger vi krumningen, som i uke 8.

### Når peker Newton-retningen nedover?

Fra [støtteløpet i uke 8](uke8.qmd#uke8-gradient) vet vi at et lite steg
$\alpha p$ endrer $f$ med omtrent $\alpha\,g^Tp$. Retningen $p$ peker
altså **nedover** når den retningsderiverte $g^Tp$ er negativ.

For Newton-retningen kan vi regne ut fortegnet. Vi starter med
Newton-likningen og ganger begge sider fra venstre med radvektoren $p^T$:

$$Hp=-g\quad\Longrightarrow\quad p^THp=-p^Tg.$$

Tallet $p^Tg=p_1g_1+p_2g_2$ er det samme som $g^Tp$. Derfor er

$$g^Tp=-p^THp.$$

**Newton-retningen peker nedover akkurat når $p^THp>0$.**

| Hessianen | Hva kan vi si om retningen? |
|:--|:--|
| $H$ er SPD | Betingelsen er alltid oppfylt. I håndeksemplet i 10.1 var $g^Tp=-17.99<0$. |
| $H$ har en negativ egenverdi | Newton-retningen kan peke **oppover**. |

Det siste ser vi i et lite eksempel.

::: {.callout-note title="Håndeksempel: et Newton-steg som går oppover"}

**Utgangspunkt.** Dobbeltbrønnen $f(u,v)=(u^2-1)^2+\tfrac12v^2$ har to
globale minima, $(\pm1,0)$, der $f=0$. Vi står i $z=(0.2,\,0)$.

**Prøv selv.** Finn $g$ og $H$ i $z$, løs $Hp=-g$ og avgjør fortegnet til
$g^Tp$.

**Regnegangen.**

1. **Deriver.** $f_u=2(u^2-1)\cdot2u=4u(u^2-1)$ og $f_v=v$. En gang til:
   $f_{uu}=\tfrac{\partial}{\partial u}(4u^3-4u)=12u^2-4$, $f_{uv}=0$ og
   $f_{vv}=1$. Altså
   $$g(u,v)=\begin{bmatrix}4u(u^2-1)\\v\end{bmatrix},\qquad
   H(u,v)=\begin{bmatrix}12u^2-4&0\\0&1\end{bmatrix}.$$
2. **Origo først.** I $(0,0)$ er $g=0$ og $H=\operatorname{diag}(-4,1)$, med én
   negativ og én positiv egenverdi: et **sadelpunkt** (uke 8). Langs $u$ er
   $f(t,0)=1-2t^2+t^4<1$ for små $t\ne0$, og langs $v$ er
   $f(0,t)=1+t^2/2>1$.
3. **Sett inn $z=(0.2,\,0)$.** Her er $u^2=0.04$ og $u^2-1=-0.96$, så
   $$g_1=4\cdot0.2\cdot(-0.96)=-0.768,\quad g_2=0,\quad
   h_{11}=12\cdot0.04-4=-3.52,\quad h_{22}=1.$$
4. **Newton-likningen.** Matrisen er diagonal, så likningene står hver for seg:
   $-3.52\,p_1=0.768$ gir $p_1=-0.768/3.52\approx-0.2182$, og $1\cdot p_2=0$
   gir $p_2=0$.
5. **Fortegnet.** $p^THp=-3.52\cdot(-0.2182)^2\approx-3.52\cdot0.0476\approx-0.1676$,
   så $g^Tp=-p^THp\approx0.1676>0$. Direkte:
   $g^Tp=(-0.768)(-0.2182)\approx0.1676$. **Retningen peker oppover.**
6. **Funksjonsverdiene.** $f(0.2,0)=(0.04-1)^2=0.9216$. Etter et helt steg
   står vi i $(0.2-0.2182,\ 0)=(-0.0182,\ 0)$, der
   $f\approx(0.0003-1)^2\approx0.9993$. Verdien økte.

**Dette tar vi med oss.**

- **Krumningen:** langs $u$ krummer $f$ nedover i $z$, fordi $h_{11}<0$.
- **Modellen:** parabelen langs $u$ åpner nedover, og dens eneste
  stasjonære punkt er **toppen**.
- **Newton-steget:** går til toppen av modellbakken, mot sadelpunktet i origo.

Uten krumningen kan vi altså ikke vite om Newton-retningen fører mot et minimum.

:::

Cellen kontrollerer håndregningen. Den skriver ut egenverdiene til $H$,
Newton-retningen, $g^Tp$ og verdien av $f$ før og etter et helt steg.

```{pyodide-python}
#| label: week10-ascent
z = np.array([.2, 0.])
g, H = well_grad(z), well_hess(z)
p = np.linalg.solve(H, -g)
print('I (0.2, 0): egenverdier H =', np.linalg.eigvalsh(H))
print(f'Newton-retning p = {p.round(4) + 0.}, g·p = {g @ p:.4f}')
print(f'f før = {well(z):.4f}, f etter helt steg = {well(z + p):.4f}')
```

Hvorfor går steget feil vei? Langs linjen $v=0$ er dobbeltbrønnen bare
$(u^2-1)^2$. Cellen tegner denne kurven og Newton-parabelen i $u=0.2$, på
samme måte som bildet i 10.1.

```{pyodide-python}
#| label: week10-model-saddle
# Dobbeltbrønnen langs v = 0 og parabelen i u = 0.2; trekanten er Newton-punktet.
show_model(lambda u: (u*u - 1)**2, lambda u: 4*u*(u*u - 1),
           lambda u: 12*u*u - 4, x0=.2, xlim=(-1.5, 2.), name='u')
```

**Hva viser bildet?**

- **Parabelen:** åpner nedover, fordi krumningen $h_{11}=-3.52$ er negativ.
- **Newton-punktet:** toppen av parabelen, i $u\approx-0.018$, nesten rett
  til sadelpunktet i origo.
- **Minimumene:** de to i $u=\pm1$ ligger lenger borte, og dem ser ikke parabelen.

**Øv på dette:** [et sadelpunkt i en annen funksjon](#uke10-ov-sadel) og [negativ krumning i et annet punkt](#uke10-ov-retning).

## 10.4 Reparasjonen: Cholesky-forsøket og Armijo

<div id="uke10-demping"></div>

To ting kan gå galt i et Newton-steg. Vi retter dem i denne rekkefølgen:

1. **Retningen kan peke oppover,** slik vi nettopp så. Først sørger vi for
   at den peker nedover. Til det trenger vi en billig test på om $H$ er SPD.
2. **Steget kan være for langt.** Deretter velger vi lengden.

### Cholesky: en SPD-test ved faktorisering

<div id="uke10-cholesky"></div>

I uke 8 avgjorde vi definitthet med egenverdiene. For store matriser er
egenverdier dyre å regne ut. **Cholesky-faktoriseringen**, som ble lovet i
[uke 6](uke6.qmd#uke6-energi), gir en billigere test: vi prøver å skrive

$$H=LL^T,$$

der $L$ er nedre triangulær med positive diagonalelementer. En symmetrisk
matrise har en slik faktorisering **nøyaktig når den er SPD**.

| Cholesky-forsøket | Konklusjon |
|:--|:--|
| Faktoriseringen lykkes | $H$ er SPD. |
| Faktoriseringen stopper | $H$ er ikke SPD. |

**Hvordan finner vi $L$ for en $2\times2$-matrise?** Skriv
$L=\begin{bmatrix}a&0\\b&c\end{bmatrix}$ med $a,c>0$. Da er

$$LL^T=\begin{bmatrix}a&0\\b&c\end{bmatrix}\begin{bmatrix}a&b\\0&c\end{bmatrix}
=\begin{bmatrix}a^2&ab\\ab&b^2+c^2\end{bmatrix}.$$

Vi sammenligner med $H=\begin{bmatrix}h_{11}&h_{12}\\h_{12}&h_{22}\end{bmatrix}$
ett element om gangen:

1. $a^2=h_{11}$. Vi trenger $h_{11}>0$ for å ta kvadratroten, $a=\sqrt{h_{11}}$.
2. $ab=h_{12}$ gir $b=h_{12}/a$.
3. $b^2+c^2=h_{22}$ gir $c^2=h_{22}-b^2$. Vi trenger $c^2>0$, og da er $c=\sqrt{c^2}$.

De to tallene vi tar kvadratroten av, $a^2$ og $c^2$, kalles **pivotene**.
Cholesky lykkes nøyaktig når begge pivotene er positive. Er én av dem null
eller negativ, stopper faktoriseringen.

Hvorfor er dette det samme som SPD? Med $b=h_{12}/a$ og $a^2=h_{11}$ er

$$c^2=h_{22}-\frac{h_{12}^2}{h_{11}}=\frac{h_{11}h_{22}-h_{12}^2}{h_{11}}=\frac{\det H}{h_{11}}.$$

Begge pivotene er altså positive nøyaktig når $h_{11}>0$ og $\det H>0$.
Det er testen $f_{xx}>0$ og $f_{xx}f_{yy}-f_{xy}^2>0$ fra
[uke 8.3](uke8.qmd#uke8-hessian), som sier at begge egenverdiene er
positive.

::: {.callout-note title="Håndeksempel: tre matriser, tre Cholesky-forsøk"}

**Utgangspunkt.** Tre symmetriske matriser:

- $H_A=\begin{bmatrix}4&2\\2&3\end{bmatrix}$.
- Hessianen $H_B=\begin{bmatrix}43&20\\20&59\end{bmatrix}$ fra håndeksemplet i 10.1.
- Hessianen $H_C=\begin{bmatrix}-3.52&0\\0&1\end{bmatrix}$ i dobbeltbrønnen fra 10.3.

**Prøv selv.** Regn ut $a^2$, $b$ og $c^2$ for hver matrise. Hvilke er SPD?

**Regnegangen.**

1. $H_A$: $a^2=4$, så $a=2$. Deretter $b=2/2=1$ og $c^2=3-1^2=2>0$, så
   $c=\sqrt2$. Begge pivotene er positive: $H_A$ er SPD, og
   $L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}$.
2. $H_B$: $a^2=43$, $b=20/\sqrt{43}$, $b^2=400/43\approx9.30$ og
   $c^2=59-400/43=2137/43\approx49.70>0$. $H_B$ er SPD. Derfor var
   $g^Tp<0$ i 10.1: Newton-steget der måtte peke nedover.
3. $H_C$: $a^2=-3.52<0$. Faktoriseringen **stopper i første pivot**, og
   $H_C$ er ikke SPD.

**Dette tar vi med oss.** Cholesky avgjør SPD med noen få multiplikasjoner
og kvadratrøtter, uten egenverdier.

:::

`np.linalg.cholesky` gjør det samme for oss. Den kaster
`np.linalg.LinAlgError` når en pivot ikke er positiv. Cellen skriver ut
pivotene, som er kvadratene av diagonalelementene i $L$:

```{pyodide-python}
#| label: week10-cholesky-test
for name, H in [('H_A', [[4., 2.], [2., 3.]]),
                ('H_B', himmel_hess(np.array([2.5, 2.5]))),
                ('H_C', well_hess(np.array([.2, 0.])))]:
    try:
        L = np.linalg.cholesky(np.array(H))
        print(f'{name}: Cholesky lykkes, pivoter = {(np.diag(L)**2).round(2)}')
    except np.linalg.LinAlgError:
        print(f'{name}: Cholesky stopper, matrisen er ikke SPD')
```

Når Cholesky lykkes, kan vi også bruke $L$ til å løse $Hp=-g$ med to enkle
triangulære systemer. Det står regnet ut i «Gå i dybden» nedenfor. I
hovedløpet trenger vi bare testen.

**Øv på dette:** [finn Cholesky-faktoren](#uke10-ov-cholesky-faktor).

<details class="reading-step">
<summary>Gå i dybden: løs Newton-systemet med Cholesky, og koordinatene der $H=I$</summary>

Når $H=LL^T$, deler vi $Hp=-g$ i to. Kall $y=L^Tp$ (en hjelpevektor, ikke et
nytt punkt). Da er $Hp=L(L^Tp)=Ly$, og systemet blir

$$Ly=-g,\qquad L^Tp=y.$$

Vi finner $y$ ovenfra og ned, og deretter $p$ nedenfra og opp.

::: {.callout-note title="Håndeksempel: Cholesky og to triangulære systemer"}

**Utgangspunkt.** $H_A=\begin{bmatrix}4&2\\2&3\end{bmatrix}$ med
$L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}$ fra håndeksemplet over, og
$g=(-6,-5)^T$, så høyresiden er $-g=(6,5)^T$.

**Prøv selv.** Løs $Ly=(6,5)^T$ og deretter $L^Tp=y$.

**Regnegangen.**

1. $Ly=(6,5)^T$ ovenfra og ned: første rad er $2y_1=6$, så $y_1=3$. Andre rad
   er $1\cdot y_1+\sqrt2\,y_2=5$, altså $3+\sqrt2\,y_2=5$ og
   $y_2=2/\sqrt2=\sqrt2$.
2. $L^Tp=y$ nedenfra og opp, med $L^T=\begin{bmatrix}2&1\\0&\sqrt2\end{bmatrix}$:
   andre rad er $\sqrt2\,p_2=\sqrt2$, så $p_2=1$. Første rad er $2p_1+p_2=3$,
   så $2p_1=2$ og $p_1=1$.
3. Kontroll: $Hp=(4+2,\ 2+3)^T=(6,5)^T=-g$.

**Dette tar vi med oss.** Hvert triangulært system løses ved innsetting, én
ukjent om gangen.

:::

Cellen gjør de samme to trinnene med NumPy: først Cholesky-faktoren, så de
to triangulære systemene. Til slutt kontrollerer den at $Hp=-g$.

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

**Koordinatene der $H=I$.** Velg de nye koordinatene $\tilde z=L^Tz$. Det er
regelen fra «Gå i dybden» om enheter i 10.2 med $D=L^T$, så

$$\tilde H=D^{-T}HD^{-1}=L^{-1}H\,L^{-T}=L^{-1}LL^TL^{-T}=I\cdot I=I.$$

Med tall: $L^{-1}=\begin{bmatrix}1/2&0\\-1/(2\sqrt2)&1/\sqrt2\end{bmatrix}$
(kontroller at $LL^{-1}=I$). Rad for rad er

$$L^{-1}H_A=\begin{bmatrix}\tfrac12\cdot4&\tfrac12\cdot2\\
-\tfrac{4}{2\sqrt2}+\tfrac{2}{\sqrt2}&-\tfrac{2}{2\sqrt2}+\tfrac{3}{\sqrt2}\end{bmatrix}
=\begin{bmatrix}2&1\\0&\sqrt2\end{bmatrix}=L^T,$$

og dermed $\tilde H=(L^{-1}H_A)L^{-T}=L^TL^{-T}=I$. I disse koordinatene er
skålen rund: alle egenverdier er 1, og $\kappa=1$. Faktoren
$(\kappa-1)/(\kappa+1)$ fra uke 9 blir **null**.

Følg gradientsteget fra de nye koordinatene tilbake:

1. **I $\tilde z$:** med $\alpha=1$ er steget
   $-\tilde g=-L^{-1}g=L^{-1}(-g)$. Det er nøyaktig hjelpevektoren
   $y=(3,\sqrt2)^T$ over.
2. **Tilbake i $z$:** steget blir $L^{-T}y=p=(1,1)^T$, altså Newton-steget.

**Newton er gradientmetoden i koordinatene der $H=I$.**

- **Sammenligning:** i [prosjekt 6](project_week6.qmd) skalerte vi med
  diagonalen av matrisen og fikk en rundere skål. Newton bruker hele
  Hessianen som skala: det er den ideelle prekondisjoneringen.
- **Prisen:** $H$ endrer seg fra punkt til punkt, så vi må finne nye
  koordinater og løse et nytt system i hvert steg.

**Øv på dette:** [to triangulære systemer](#uke10-ov-triangulaer).

</details>

<details class="reading-step">
<summary>Gå i dybden: hva koster et Newton-steg? Newton utenpå, CG inni</summary>

| Arbeid | Omtrent antall regneoperasjoner | For $n=1000$ |
|:--|:--|:--|
| Cholesky av en $n\times n$-matrise | $n^3/3$ | $1000^3/3\approx3.3\cdot10^8$ |
| Selve gradientsteget, i tillegg til å regne ut gradienten | $n$ | $10^3$ |

Ett Newton-steg er altså mye dyrere enn ett gradientsteg.

Til gjengjeld trenger Newton langt færre steg. I eksperiment 1 startet vi
med feilen $0.71$. For å få den ned til $10^{-9}$ med faktoren $0.52$
trenger gradientmetoden $0.71\cdot0.52^k\le10^{-9}$, altså

$$k\ge\frac{\ln(10^{-9}/0.71)}{\ln0.52}\approx\frac{-20.38}{-0.654}\approx31.2,$$

det vil si 32 steg. Newton var nesten der etter fire steg.

- **Små $n$, som i eksperiment 1:** Newton lønner seg derfor.
- **Store $n$:** vi løser heller Newton-systemet iterativt, for eksempel med
  CG fra uke 6.

Slik kobles CG til Newton:

- **Fra [uke 6](uke6.qmd#uke6-cg):** CG løste $Az=b$ for SPD $A$ ved å
  minimere $\tfrac12z^TAz-b^Tz$.
- **På hvert ytre Newton-steg:** vi får et *nytt* system
  $H(z_k)p_k=-g(z_k)$.
- **I det indre CG-søket:** sett $A=H(z_k)$, ukjent $p_k$ og høyreside
  $-g(z_k)$. Da minimerer CG nettopp den lokale modellen $m(p)$, bortsett
  fra konstantleddet.

Med $b=-g$ er nemlig

$$\tfrac12p^THp-b^Tp=\tfrac12p^THp+g^Tp=m(p)-f(z_k).$$

| Nivå | Hva endres? | Med $H_A$ og $g=(-6,-5)^T$ fra håndeksemplet |
|:--|:--|:--|
| Indre CG | Anslaget på $p$ i $H_Ap=(6,5)^T$. | Fra $p=0$ finner eksakt CG $p=(1,1)^T$ på høyst to indre iterasjoner. |
| Ytre Newton | Punktet etter at retningen er funnet. | Én oppdatering flytter punktet med $(1,1)^T$. |

Cholesky og CG er altså to måter å løse det samme indre SPD-systemet på.

- **Krav:** vanlig CG krever SPD; at $H$ er invertibel er ikke nok.
- **Tidlig stopp:** stopper vi CG tidlig, får vi en tilnærmet Newton-retning.

</details>

### Rett retningen: Cholesky-forsøket med $\mu I$

Når $H$ ikke er SPD, erstatter vi $H$ med $H+\mu I$ for et tall $\mu\ge0$.
Hvorfor hjelper det?

1. **Egenverdiene flyttes:** hvis $Hv=\lambda v$, er
   $(H+\mu I)v=\lambda v+\mu v=(\lambda+\mu)v$. Hver egenverdi øker med $\mu$.
2. **Matrisen blir SPD:** for stor nok $\mu$ er alle egenverdiene positive.
3. **Retningen finnes:** løs $(H+\mu I)p=-g$. Samme regning som i 10.3 gir

$$g^Tp=-p^T(H+\mu I)p<0,$$

så retningen peker nedover. Men hvor stor må $\mu$ være? Vi trenger ikke
egenverdiene. **Vi prøver Cholesky:**

1. Start med $\mu=0$.
2. Så lenge faktoriseringen stopper, sett $\mu\leftarrow\max(2\mu,\,0.5)$.
3. Bruk den første $\mu$ som lykkes.

Listen blir $\mu=0,\ 0.5,\ 1,\ 2,\ 4,\ldots$

::: {.callout-note title="Håndeksempel: Cholesky-forsøket i dobbeltbrønnen"}

**Utgangspunkt.** I $z=(0.2,\,0)$ er $H=\operatorname{diag}(-3.52,\,1)$ og
$g=(-0.768,\,0)^T$, fra 10.3.

**Prøv selv.** For $H+\mu I$ er første pivot $a^2=-3.52+\mu$. For hvilke
$\mu$ på listen er den positiv?

**Regnegangen.**

1. Her er $h_{12}=0$, så $b=0$ og andre pivot er $c^2=1+\mu$. Vi prøver
   listen:

   | $\mu$ | $a^2=-3.52+\mu$ | $c^2=1+\mu$ | Cholesky |
   |:--|--:|--:|:--|
   | $0$ | $-3.52$ | – | stopper |
   | $0.5$ | $-3.02$ | – | stopper |
   | $1$ | $-2.52$ | – | stopper |
   | $2$ | $-1.52$ | – | stopper |
   | $4$ | $0.48$ | $5$ | lykkes |

2. Løs $(H+4I)p=-g$, altså
   $\begin{bmatrix}0.48&0\\0&5\end{bmatrix}p=\begin{bmatrix}0.768\\0\end{bmatrix}$:
   $0.48\,p_1=0.768$ gir $p_1=0.768/0.48=1.6$, og $5p_2=0$ gir $p_2=0$.
3. Fortegnet: $g^Tp=-0.768\cdot1.6=-1.2288<0$. Retningen peker nå nedover,
   mot minimumet $(1,0)$ i stedet for mot sadelpunktet.

**Dette tar vi med oss.** Cholesky gjør to jobber på én gang:

- **Tester:** avgjør om matrisen er SPD.
- **Faktoriserer:** når den lykkes, gir den faktoren $L$, som vi løser
  systemet med (to triangulære systemer, se «Gå i dybden» over).

Når $H$ allerede er SPD, godtas $\mu=0$, og vi beholder det rene Newton-steget.

:::

Cellen gjør Cholesky-forsøket med listen $\mu=0,\,0.5,\,1,\,2,\,4$ og skriver
ut første pivot hver gang faktoriseringen stopper. Når den lykkes, løser den
$(H+\mu I)p=-g$ med faktoren $L$ og kontrollerer fortegnet til $g^Tp$.

```{pyodide-python}
#| label: week10-cholesky-shift
z = np.array([.2, 0.])
g, H = well_grad(z), well_hess(z)
mu = 0.
while True:
    try:
        L = np.linalg.cholesky(H + mu*np.eye(2))
        break
    except np.linalg.LinAlgError:
        print(f'mu = {mu}: første pivot {H[0, 0] + mu:.2f}, Cholesky stopper')
        mu = max(2*mu, .5)
p = np.linalg.solve(L.T, np.linalg.solve(L, -g))   # to triangulære systemer med L
print(f'mu = {mu}: pivoter {(np.diag(L)**2).round(2)}, p = {p + 0.}, g·p = {g @ p:.4f}')
```

**Øv på dette:** [når Cholesky stopper](#uke10-ov-cholesky-test) og [Cholesky-forsøket i et annet punkt](#uke10-ov-forskyvning).

### Kontroller lengden: Armijo

Retningen peker nå nedover. Men er steget riktig langt? Cellen tegner
kurven langs $v=0$ igjen, nå med parabelen for $H+4I$, slik at vi ser hvor
et helt steg havner.

```{pyodide-python}
#| label: week10-model-shift
# Samme kurve som i 10.3, nå med parabelen for H + 4I i u = 0.2.
show_model(lambda u: (u*u - 1)**2, lambda u: 4*u*(u*u - 1),
           lambda u: 12*u*u - 4, x0=.2, mu=4., xlim=(-1.5, 2.), name='u')
```

**Hva viser bildet?**

- **Krumningen er rettet:** med $\mu=4$ er $-3.52+4=0.48>0$, så parabelen
  åpner oppover og har en bunn.
- **Steget går for langt:** bunnen ligger i $u=1.8$, langt forbi minimumet
  i $u=1$, og der er $f$ over 5.

Retningen er riktig, men steget er for langt.

Det er jobben til [Armijo-testen fra uke 9](uke9.qmd#uke9-linjesok): prøv
$\alpha=1,\tfrac12,\tfrac14,\ldots$ og godta den første som gir

$$f(z+\alpha p)\le f(z)+10^{-4}\,\alpha\,g^Tp.$$

I uke 9 var $p=-\nabla f$. Nå er $p$ den rettede Newton-retningen. Testen
er den samme; bare helningen $g^Tp$ er en annen. Her er $f(z)=0.9216$ og
$g^Tp=-1.2288$:

Armijo-grensen er $0.9216+10^{-4}\alpha\cdot(-1.2288)$. Vi prøver to lengder:

1. **Helt steg, $\alpha=1$: avvis.**

   - Punkt: $z+\alpha p=(0.2+1.6,\ 0)=(1.8,\ 0)$.
   - Verdi: $f(z+\alpha p)=(3.24-1)^2=2.24^2=5.0176$.
   - Grense: $0.9216-0.00012288\approx0.92148$.

2. **Halvt steg, $\alpha=1/2$: godta.**

   - Punkt: $z+\alpha p=(0.2+0.8,\ 0)=(1,\ 0)$.
   - Verdi: $f(z+\alpha p)=(1-1)^2=0$.
   - Grense: $0.9216-0.00006144\approx0.92154$.

Cellen regner ut tallene i de to forsøkene og lar så hjelperen `armijo` gjøre
halveringen selv. Begge veier skal gi $\alpha=1/2$.

```{pyodide-python}
#| label: week10-regularized-step
z = np.array([.2, 0.])
g = well_grad(z)
p = np.array([1.6, 0.])          # retningen fra Cholesky-forsøket
print(f'f(z) = {well(z):.4f},  g·p = {g @ p:.4f}')
for a in [1., .5]:
    print(f'alpha = {a}: z + alpha p = {z + a*p}, f = {well(z + a*p):.4f}, '
          f'grense = {well(z) + 1e-4*a*(g @ p):.5f}')
a, halvings = armijo(well, g, z, p)
print('Armijo godtar alpha =', a, 'etter', halvings, 'halvering')
```

- **Helt steg:** avvises.
- **Halvt steg:** godtas og treffer her tilfeldigvis minimumet $(1,0)$
  nøyaktig; vanligvis trengs flere steg.
- **Arbeidsdelingen:** forskyvningen endret retningen, Armijo bestemte lengden.
- **Også med SPD-Hessian:** Armijo trengs fordi modellen kan undervurdere
  funksjonen. Det står i «Gå i dybden» like under.

**Øv på dette:** [Armijo i dobbeltbrønnen](#uke10-ov-armijo).

<details class="reading-step">
<summary>Gå i dybden: et helt steg kan svikte også når $H$ er SPD</summary>

Ta den **bøyde dalen**

$$q(u,v)=(1-u)^2+10(v-u^2)^2,$$

med globalt minimum $q(1,1)=0$. Med kjerneregelen er

$$g(u,v)=\begin{bmatrix}2(u-1)-40u(v-u^2)\\20(v-u^2)\end{bmatrix},\qquad
H(u,v)=\begin{bmatrix}2-40v+120u^2&-40u\\-40u&20\end{bmatrix}.$$

1. I $(0,0)$ er $g=(2(0-1)-0,\ 20\cdot0)^T=(-2,0)^T$ og
   $H=\begin{bmatrix}2&0\\0&20\end{bmatrix}$. Pivotene er $2$ og $20$, så $H$
   er SPD.
2. Newton: $2p_1=2$ og $20p_2=0$, så $p=(1,0)^T$, og $g^Tp=-2<0$.
3. Langs $\alpha p$ står vi i $(\alpha,0)$. Den faktiske verdien er
   $q(\alpha,0)=(1-\alpha)^2+10(0-\alpha^2)^2=(1-\alpha)^2+10\alpha^4$.
4. Modellen er
   $m(\alpha p)=q(0,0)+\alpha\,g^Tp+\tfrac12\alpha^2p^THp=1-2\alpha+\tfrac12\alpha^2\cdot2=(1-\alpha)^2$.

| Faktor $\alpha$ | Modellen $(1-\alpha)^2$ | Faktisk $(1-\alpha)^2+10\alpha^4$ |
|:--|--:|--:|
| $0$ | $1$ | $1$ |
| $1$ | $0$ | $10$ |
| $1/2$ | $1/4$ | $1/4+10/16=7/8=0.875$ |

Hele steget øker verdien fra 1 til 10; halvt steg senker den til $0.875$
og godtas av Armijo. Leddet $10\alpha^4$ fanger ikke modellen opp.

Cellen kontrollerer tabellen med Armijo-hjelperen og tegner to bilder:
banene til fullt og dempet Newton over nivåkurvene, og $q$ sammen med
modellen langs den første Newton-retningen.

```{pyodide-python}
#| label: week10-backtrack-positive-hess
z = np.array([0., 0.])
g, H = valley_grad(z), valley_hess(z)
p = np.linalg.solve(H, -g)
a, halvings = armijo(valley, g, z, p)
print('H-egenverdier =', np.linalg.eigvalsh(H), ' p =', p)
print('Fullt steg: q =', valley(z + p), ' Armijo: alpha =', a, ', q =', valley(z + a*p))
show_valley(z, p)     # baner over nivåkurvene, og q mot modellen langs p
```

Fullt Newton går først til $(1,0)$, der $q=10$, og deretter til $(1,1)$.
Den dempede banen senker verdien allerede i første steg. SPD sikrer
nedgang for *tilstrekkelig små* steg, ikke for hvert helt steg.

**Øv på dette:** [modell og virkelig verdi i den bøyde dalen](#uke10-ov-dalen).

</details>

### Hjelper reparasjonen i hele bildet?

I eksperiment 2 endte 42 % av startene i et sadelpunkt eller i
maksimumet. Siden da har vi rettet ett enkelt steg i dobbeltbrønnen: først
retningen med Cholesky-forsøket, så lengden med Armijo. Nå setter vi de to
reparasjonene sammen til den **sikrede Newton-metoden**. I hvert steg:

1. regn ut $g$ og $H$ i punktet;
2. finn $\mu$ med Cholesky-forsøket ($\mu=0,\ 0.5,\ 1,\ 2,\ldots$);
3. løs $(H+\mu I)p=-g$;
4. velg $\alpha$ med Armijo-halvering ($\alpha=1,\ \tfrac12,\ \tfrac14,\ldots$);
5. flytt til $z+\alpha p$.

Nå lar vi hjelperen `newton_basins(safe=True)` gjøre nettopp dette:

- **Samme sammenligning:** de samme $81\times81$ startene som i eksperiment 2.
- **Farge i bildet:** med `which=True` forteller hjelperen hvilket av de fire
  minimumene hver start ender i, og bildet farger startene etter det.

Målet er å se om de to reparasjonene er nok til at hver start ender i et
minimum, og i hvilket.

### Eksperiment 3 – sikret Newton fra de samme startene

- Forutsi: hvor mange starter ender nå i et sadelpunkt eller i maksimumet?
- Kjør cellen og sammenlign antallene med tabellen fra eksperiment 2.
- Se på bildet: ender en start alltid i minimumet som ligger nærmest?

```{pyodide-python}
#| label: week10-basins-safe
# Samme 81 x 81 starter som i eksperiment 2, nå med Cholesky-forsøk og Armijo.
X0, Y0, kind_safe, which = newton_basins(safe=True, which=True)
for k, name in [(0, 'minimum'), (1, 'sadelpunkt'), (2, 'maksimum'), (-1, 'ikke konvergert')]:
    print(f'{name:16s}: {np.sum(kind_safe == k):5d} starter')
show_minima(X0, Y0, which)
```

**Hva viser forsøket?**

- **På dette gitteret:** alle 6561 startene ender i et minimum, ingen i et
  sadelpunkt eller i maksimumet.
- **Hvorfor reparasjonen hjelper:** Armijo godtar bare steg som senker $f$,
  og etter Cholesky-forsøket peker retningen alltid nedover. Derfor kan
  metoden ikke ende i maksimumet, og nær et sadelpunkt fører den negative
  krumningen den videre nedover.
- **Forbeholdet:** bare helt spesielle starter kan ende i et sadelpunkt;
  ingen av de 6561 gjorde det.
- **Nær et minimum:** $H$ er SPD, så $\mu=0$ og $\alpha=1$ godtas. Sikringen
  slår seg av, og den kvadratiske farten fra 10.2 beholdes.

Hvilket av de fire minimumene vi ender i, avhenger fortsatt av starten:

- **Oftest:** startene ender i minimumet som ligger nærmest.
- **Et unntak:** starten $(2,\,0)$ ligger nærmest $(3,2)$, men ligger i det
  lilla området og ender i $(3.58,\,-1.85)$.
- **Begrensningen:** sikringen gir et minimum, men vi kan ikke velge hvilket.
  Her har alle fire minimumene $f=0$; i andre problemer kan et lokalt
  minimum være mye dårligere enn det globale.

<details class="reading-step">
<summary>Gå i dybden: sammenlign med SciPy</summary>

<div id="uke10-scipy"></div>

SciPys `minimize` fra [uke 8](uke8.qmd#uke8-scipy) kan gjøre hele søket for
den bøyde dalen.

| Metode | Hvordan brukes krumningen? |
|:--|:--|
| `Newton-CG` | Bruker Hessianen og løser hvert Newton-system med en indre CG-iterasjon, som i «Gå i dybden» om kostnaden over. |
| `BFGS` | Regner aldri ut $H$; bygger en tilnærmet Hessian fra hvordan gradienten endrer seg fra steg til steg. |

For `BFGS` gjør dette hvert steg billigere, mens farten nær minimum likevel
er nesten like god.

Cellen kjører begge metodene fra $(0,0)$ og skriver ut antall ytre
iterasjoner, sluttpunktet, $q$ og gradientnormen.

```{pyodide-python}
#| label: week10-scipy-compare
for name, kwargs in [('BFGS', {}), ('Newton-CG', {'hess': valley_hess})]:
    res = minimize(valley, np.array([0., 0.]), jac=valley_grad,
                   method=name, options={'maxiter': 100}, **kwargs)
    print(f'{name}: success = {res.success}, ytre iterasjoner = {res.nit}')
    print('  x =', np.round(res.x, 6), f' q(x) = {valley(res.x):.1e}',
          f' ||g(x)|| = {np.linalg.norm(valley_grad(res.x)):.1e}')
```

- **Sluttpunkt:** begge ender nær $(1,1)$ med liten verdi og gradientnorm.
- **Stoppstatus:** `success = True` betyr at metodens egne stoppkrav ble
  møtt, ikke at et globalt minimum er bevist. Det viser vi separat ved at
  $q$ er en sum av kvadrater og $q(1,1)=0$.
- **Arbeid:** færre ytre iterasjoner er ikke nødvendigvis mindre arbeid,
  siden Hessian, gradient og indre løsninger koster forskjellig.

Kallene er forklart i SciPy-oppslaget i 10.6.

</details>

I [prosjekt 10](project_week10.qmd) bruker du Newton-idéen på et
tilpasningsproblem: å finne en posisjon fra unøyaktige avstander. I
[uke 11](uke11.qmd) får vi lineære krav (ulikheter) og ofte et beste punkt på
randen. Da er gradient null ikke lenger den riktige kontrollen.

## 10.5 Regneoppgaver

<div id="uke10-oppgaver"></div>

Oppgavene er ordnet etter de fire stegene i hovedløpet, og til slutt
kommer tre oppgaver til «Gå i dybden». Kodeoppgavene står i 10.6.

- **Eksakte svar:** svar eksakt der det står «eksakt».
- **Uttrykk:** bruk `*` for multiplikasjon og `^` for potens.
- **Vektorer:** fyll inn én verdi i hvert komponentfelt.
- **Begrunnelser:** begrunn klassifiseringene i egne notater; feltene
  kontrollerer regningen.

### Steg 1: Newton er regelen fra uke 2

<div id="uke10-ov-uke2"></div>

#### Newton-regelen fra uke 2

I uke 2 løste vi $h(x)=x^3+x-1=0$. Nå knytter vi likningen til minimering.
Svar eksakt.

1. Skriv Newton-iterasjonen $x-h(x)/h'(x)$ som én brøk (prøv uten å se
   tilbake i 10.1), og avgjør hvilken av omskrivingene $g_1$, $g_2$, $g_3$
   fra uke 2 den er.
2. Vi vil så minimere $f(x)=x^4/4-x$. Skriv Newton-regelen
   $x-f'(x)/f''(x)$ som et uttrykk i $x$.
3. Regn ut første iterasjon fra $x_0=2$.

```{math-exercise}
#| label: week10-task-week2-newton
#| caption: To Newton-regler og én iterasjon
#| mode: equivalent
#| partial-credit: true
#| field-labels: Newton-iterasjonen som én brøk, Newton-regelen for f'=0, x1

$x-\dfrac{h(x)}{h'(x)}=$ __[(2*x^3+1)/(3*x^2+1)]

$x-\dfrac{f'(x)}{f''(x)}=$ __[x-(x^3-1)/(3*x^2)]

$x_1=$ _[17/12]
```

Feilene $|x_k-1|$ for minimeringen er $1,\ 0.42,\ 0.11,\ 1.1\cdot10^{-2},\
1.1\cdot10^{-4},\ 1.2\cdot10^{-8}$ for $k=0,\ldots,5$. Hvor mange riktige
desimaler har du etter hvert steg?

<div id="uke10-ov-handsteg"></div>

#### Ett Newton-steg for hånd

Ta $f(x,y)=\tfrac14x^4+2xy+y^2$ og startpunktet $z_0=(1,1)$. Gjør de samme
trinnene som i håndeksemplet i 10.1, og svar eksakt:

1. Finn gradienten og Hessianen generelt.
2. Sett inn $z_0$.
3. Løs $2\times2$-systemet $Hp=-g$ med innsetting.
4. Regn ut $f(z_1)$ for $z_1=z_0+p$.

```{math-exercise}
#| label: week10-task-hand-step
#| caption: Gradient, Hessian og steget fra (1, 1)
#| mode: equivalent
#| partial-credit: true
#| field-labels: første komponent av g, andre komponent av g, h11, h12, h22, første komponent av p, andre komponent av p, f etter steget

$g(z_0)=$ vec[3,4]

$h_{11}=$ _[3], $h_{12}=$ _[2], $h_{22}=$ _[2]

$p=$ vec[1,-3]

$f(z_1)=$ _[0]
```

Sammenlign med $f(z_0)$. Er $z_1$ minimumet? Kontroller ved å regne ut
gradienten i $z_1$.

<div id="uke10-ov-kvadratisk"></div>

#### Ett steg treffer for en kvadratisk funksjon

Bruk $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$, $b=(5,5)^T$ og
$\phi(x)=\tfrac12x^TAx-b^Tx$ fra uke 6. Her er $\nabla\phi(x)=Ax-b$ og
Hessianen er $A$ i alle punkter. Start i $x_0=(0,0)^T$, løs
$Ap=-\nabla\phi(x_0)$ og finn punktet etter ett Newton-steg. Svar eksakt.

```{math-exercise}
#| label: week10-task-quadratic
#| caption: Newton-steget i skålen fra uke 6
#| mode: equivalent
#| partial-credit: true
#| field-labels: første komponent av p, andre komponent av p, første komponent av x1, andre komponent av x1

$p=$ vec[1,2]

$x_1=$ vec[1,2]
```

Kontroller at $\nabla\phi(x_1)=0$. Forklar med modellen $m(p)$ hvorfor ett
steg er nok for en kvadratisk funksjon, uansett startpunkt.

### Steg 2: sifrene dobles

<div id="uke10-ov-sifre"></div>

#### Feilen kvadreres

Vi sammenligner to metoder fra samme startfeil:

1. **Kvadrering:** anta $e_{k+1}=C\,e_k^2$ med $C=1/2$ og $e_0=1/10$.
   Regn ut $e_1$, $e_2$ og $e_3$ eksakt.
2. **Halvering:** en annen metode har $e_k=\tfrac1{10}\left(\tfrac12\right)^k$.
   Finn det minste antallet steg $k$ som gir en feil som ikke er større enn $e_3$.

```{math-exercise}
#| label: week10-task-digits
#| caption: Tre kvadratiske steg mot mange halveringer
#| mode: equivalent
#| partial-credit: true
#| field-labels: e1, e2, e3, antall halveringer

$e_1=$ _[1/200]

$e_2=$ _[1/80000]

$e_3=$ _[1/12800000000]

$k=$ _[31]
```

Skriv $e_1$, $e_2$ og $e_3$ som desimaltall. Hvor mange riktige sifre gir
hvert steg? Hvorfor trenger halveringen så mange flere steg?

### Steg 3: Newton kan gå til feil punkt

<div id="uke10-ov-sadel"></div>

#### Et sadelpunkt i en annen funksjon

Funksjonen $f(u,v)=(u^2-1)^2+(v^2-1)^2$ er to dobbeltbrønner lagt sammen,
én i hver retning. Regn ut gradienten i punktet $(1,0)$ og Hessianens
egenverdier der, i stigende rekkefølge. Svar eksakt.

```{math-exercise}
#| label: week10-task-saddle
#| caption: Gradient og egenverdier i punktet (1, 0)
#| mode: equivalent
#| partial-credit: true
#| field-labels: første komponent av gradienten, andre komponent av gradienten, minste egenverdi, største egenverdi

$\nabla f(1,0)=$ vec[0,0]

$\lambda_{\min}=$ _[-4], $\lambda_{\max}=$ _[8]
```

Hvorfor er punktet ikke et minimum? I hvilken retning går $f$ nedover? Hvor
går et rent Newton-steg fra dette punktet?

<div id="uke10-ov-retning"></div>

#### Negativ krumning i et annet punkt

Bruk dobbeltbrønnen $f(u,v)=(u^2-1)^2+\tfrac12v^2$ i punktet $z=(1/2,\,0)$.
Regn ut $g$ og $H$ med formlene i håndeksemplet i 10.3, løs $Hp=-g$, og regn ut
både $p^THp$ og $g^Tp$. Svar eksakt.

```{math-exercise}
#| label: week10-task-direction
#| caption: Newton-retning, krumning og retningsderivert
#| mode: equivalent
#| partial-credit: true
#| field-labels: første komponent av p, andre komponent av p, p transponert H p, g prikk p

$p=$ vec[-3/2,0]

$p^THp=$ _[-9/4]

$g^Tp=$ _[9/4]
```

- **Små steg:** betyr fortegnet til $g^Tp$ nedgang eller oppgang for små
  positive steg?
- **Helt steg:** regn ut $f(z+p)$. Steget havner her tilfeldigvis nøyaktig
  i det andre minimumet, $(-1,0)$.
- **Forklaring:** hvorfor motsier ikke det at retningen peker oppover?
  (Hint: se på $f(z+tp)$ for små $t>0$.)

### Steg 4: Cholesky-forsøket og Armijo

<div id="uke10-ov-cholesky-faktor"></div>

#### Finn Cholesky-faktoren

Matrisen $H=\begin{bmatrix}9&3\\3&5\end{bmatrix}$ er SPD. Skriv $H=LL^T$ med
$L=\begin{bmatrix}a&0\\b&c\end{bmatrix}$ og $a,c>0$, og finn $a$, $b$ og $c$
ved å sammenligne $LL^T$ med $H$ ett element om gangen, som i 10.4. Svar
eksakt.

```{math-exercise}
#| label: week10-task-cholesky-factor
#| caption: Elementene i den nedre triangulære faktoren
#| mode: equivalent
#| partial-credit: true
#| field-labels: første diagonalelement a, nedre element b, andre diagonalelement c

$a=$ _[3]

$b=$ _[1]

$c=$ _[2]
```

Hva er de to pivotene? Kontroller at $c^2=\det H/h_{11}$.

<div id="uke10-ov-cholesky-test"></div>

#### Når Cholesky stopper

Prøv Cholesky på $H=\begin{bmatrix}1&2\\2&2\end{bmatrix}$ med
$L=\begin{bmatrix}a&0\\b&c\end{bmatrix}$. Svar eksakt.

1. Regn ut $a^2$, deretter $b$, og til slutt tallet som skal bli $c^2$.
2. Regn også ut $\det H$.
3. Gjenta regningen for $H+\mu I$ med $\mu=0.5$ og $\mu=1$.
4. Finn hvilken $\mu$ i listen $0,\,0.5,\,1,\,2,\ldots$ Cholesky-forsøket
   godtar først.

```{math-exercise}
#| label: week10-task-cholesky-test
#| caption: Pivoter, determinant og første godkjente forskyvning
#| mode: equivalent
#| partial-credit: true
#| field-labels: a i andre potens, b, c i andre potens, determinant, første mu som godtas

$a^2=$ _[1]

$b=$ _[2]

$c^2=$ _[-2]

$\det H=$ _[-2]

$\mu=$ _[1]
```

Hva forteller fortegnet til $c^2$ om egenverdiene til $H$?

<div id="uke10-ov-forskyvning"></div>

#### Cholesky-forsøket i et annet punkt

Bruk dobbeltbrønnen i punktet $z=(1/2,\,0)$ igjen, med $g$ og $H$ fra oppgaven
«Negativ krumning i et annet punkt». Svar eksakt.

1. Prøv Cholesky på $H+\mu I$ med $\mu=0,\,0.5,\,1,\,2,\ldots$ og skriv ned
   første pivot for hver $\mu$. **En pivot som er nøyaktig null, godtas ikke.**
2. Løs $(H+\mu I)p=-g$ med den første $\mu$ som virker.
3. Regn ut $g^Tp$.

```{math-exercise}
#| label: week10-task-regularize
#| caption: Første godkjente forskyvning og den nye retningen
#| mode: equivalent
#| partial-credit: true
#| field-labels: første mu som godtas, første komponent av p, andre komponent av p, g prikk p

$\mu=$ _[2]

$p=$ vec[3/2,0]

$g^Tp=$ _[-9/4]
```

Forklar hvorfor et lite positivt steg langs $p$ nå gir nedgang.

<div id="uke10-ov-armijo"></div>

#### Armijo i dobbeltbrønnen

Fortsett oppgaven over: i $z=(1/2,\,0)$ bruker du retningen $p$ og tallet
$g^Tp$ som du fant med Cholesky-forsøket. Svar eksakt.

1. Regn ut $f(z)$, verdien etter et helt steg $f(z+p)$ og verdien etter et
   halvt steg $f(z+p/2)$.
2. Regn ut Armijo-grensen $f(z)+10^{-4}\cdot\tfrac12\cdot g^Tp$ for $\alpha=1/2$.
3. Avgjør hvilken $\alpha$ Armijo godtar.

```{math-exercise}
#| label: week10-task-armijo-well
#| caption: Helt og halvt steg langs den rettede retningen
#| mode: equivalent
#| partial-credit: true
#| field-labels: f i z, f etter helt steg, f etter halvt steg, Armijo-grensen for halvt steg, godkjent alpha

$f(z)=$ _[9/16]

$f(z+p)=$ _[9]

$f(z+p/2)=$ _[81/256]

Armijo-grensen: _[44991/80000]

$\alpha=$ _[1/2]
```

Hvorfor ble $\alpha=1$ avvist, selv om retningen peker nedover?

### Til «Gå i dybden»

<div id="uke10-ov-enheter"></div>

#### Samme steg i nye enheter

Denne oppgaven hører til «Gå i dybden» om enheter i 10.2. La
$f(u,v)=u^2+100v^2$ og $z=(1,1)$.

1. **Opprinnelige koordinater:** finn Newton-retningen $p$ og den negative
   gradienten $-g$ i $z$.
2. **Bytt enheter:** bruk $\tilde z=(u,\,10v)$, slik at punktet blir
   $\tilde z=(1,10)$. Skriv $f$ som funksjon av $\tilde z$.
3. **Nye koordinater:** finn den negative gradienten $-\tilde g$ og
   steglengden $\alpha$ som gjør at $\tilde z+\alpha(-\tilde g)$ er
   minimumspunktet.

```{math-exercise}
#| label: week10-task-invariance
#| caption: Newton-retning og gradient i to koordinatsystemer
#| mode: equivalent
#| partial-credit: true
#| field-labels: første komponent av Newton-retningen, andre komponent av Newton-retningen, første komponent av minus gradienten, andre komponent av minus gradienten, første komponent av minus gradienten i nye koordinater, andre komponent av minus gradienten i nye koordinater, steglengde i nye koordinater

$p=$ vec[-1,-1]

$-g=$ vec[-2,-200]

$-\tilde g=$ vec[-2,-20]

$\alpha=$ _[1/2]
```

Regn retningen $-\tilde g$ om til $(u,v)$-koordinater. Er den parallell med
$p$ eller med $-g$? Hva sier det om hvilke koordinater som er
«riktige» for gradientmetoden her?

<div id="uke10-ov-triangulaer"></div>

#### To triangulære systemer

Denne oppgaven hører til «Gå i dybden» om å løse Newton-systemet med
Cholesky i 10.4. Bruk faktoren $L$ for $H=\begin{bmatrix}9&3\\3&5\end{bmatrix}$
fra oppgaven «Finn Cholesky-faktoren» og høyresiden $-g=(9,7)^T$. Svar eksakt.

1. Løs $Ly=-g$ ovenfra og ned.
2. Løs deretter $L^Tp=y$ nedenfra og opp.

```{math-exercise}
#| label: week10-task-cholesky-solves
#| caption: Hjelpevektor og Newton-retning
#| mode: equivalent
#| partial-credit: true
#| field-labels: første komponent av y, andre komponent av y, første komponent av p, andre komponent av p

$y_1=$ _[3]

$y_2=$ _[2]

$p_1=$ _[2/3]

$p_2=$ _[1]
```

Kontroller svaret ved å regne ut $Hp$.

<div id="uke10-ov-dalen"></div>

#### Modell og virkelig verdi i den bøyde dalen

Denne oppgaven hører til «Gå i dybden» om den bøyde dalen i 10.4. Vi gjør
dalen litt slakere: $q(u,v)=(1-u)^2+5(v-u^2)^2$. Svar eksakt.

1. **Deriver:** regn ut $g(0,0)$ og $H(0,0)$ (du skal få $g=(-2,0)^T$ og
   $H=\operatorname{diag}(2,10)$).
2. **Løs:** finn $p$ fra $Hp=-g$.
3. **Sammenlign:** finn modellverdien $m(p)=q(0,0)+g^Tp+\tfrac12p^THp$,
   den faktiske verdien $q((0,0)+p)$ og verdien etter et halvt steg,
   $q((0,0)+p/2)$.

```{math-exercise}
#| label: week10-task-valley
#| caption: Modellen lover mer enn funksjonen gir
#| mode: equivalent
#| partial-credit: true
#| field-labels: første komponent av Newton-retningen, andre komponent av Newton-retningen, modellverdi ved fullt steg, faktisk verdi ved fullt steg, faktisk verdi ved halvt steg

$p=$ vec[1,0]

$m(p)=$ _[0]

$q(p)=$ _[5]

$q(p/2)=$ _[9/16]
```

Hvilket ledd i $q$ fanger ikke modellen opp? Godtar Armijo $\alpha=1/2$?
Sammenlign med tallene for den brattere dalen i «Gå i dybden».

Arbeid videre med [prosjekt 10: posisjon fra avstander](project_week10.qmd).

## 10.6 Python: prøv stegene selv

<div id="uke10-python"></div>

Sammenligningen med SciPy i «Gå i dybden» i 10.4 bruker `minimize`.
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

Fullfør fire korte funksjoner til stegene i hovedløpet.

- **Uavhengige oppgaver:** hver har egne importer og definisjoner og kan
  kjøres uavhengig av cellene over.
- **Din kode:** `TODO` markerer det du skal fylle inn.
- **Kontroll:** prøver flere inndata uten å vise løsningskoden.

Den første funksjonen skal returnere Newton-retningen $p$ for den
kvadratiske skålen $\phi(x)=\tfrac12x^TAx-b^Tx$, med Hessian $A$, i et
vilkårlig punkt `x`.

```{py-exercise}
#| label: week10-python-quadratic
#| caption: Løs Newton-systemet uten invers matrise
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

Den andre funksjonen tester om dobbeltbrønnens Hessian i `x` er SPD.

- **Returverdi:** `True` når Hessianen er SPD, og `False` ellers.
- **Metode:** bruk `np.linalg.cholesky` i en `try`-blokk. Den kaster
  `np.linalg.LinAlgError` når matrisen ikke er SPD.
- **Avrunding:** for en matrise som er nøyaktig singulær, kan avrundingen
  avgjøre utfallet; det skjer ikke her.

```{py-exercise}
#| label: week10-python-curvature
#| caption: SPD-test med Cholesky
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

Den tredje funksjonen skriver løkken fra Cholesky-forsøket i 10.4:

1. Start med `mu = 0`.
2. Så lenge `np.linalg.cholesky(H + mu*I)` kaster `np.linalg.LinAlgError`,
   sett `mu = max(2*mu, 0.5)`.
3. Returner den første `mu` som virker.

Løkken har et fast antall forsøk, slik at den alltid stopper, også om noe er galt.

```{py-exercise}
#| label: week10-python-shift
#| caption: Finn forskyvningen med Cholesky-forsøket
#| show-test-hints: false
import numpy as np

def cholesky_shift(H):
    I = np.eye(len(H))
    mu = 0.
    for attempt in range(60):
        # TODO: Prøv np.linalg.cholesky(H + mu*I). Lykkes den, returner mu.
        # Kaster den np.linalg.LinAlgError, sett mu = max(2*mu, 0.5).
        pass
    return mu

## TESTS ##
assert cholesky_shift(np.diag([-3.52, 1.])) == 4.
assert cholesky_shift(np.diag([8., 1.])) == 0.
assert cholesky_shift(np.array([[1., 2.], [2., 2.]])) == 1.
assert cholesky_shift(np.diag([-1., 1.])) == 2.
```

Den fjerde funksjonen velger steglengde i dobbeltbrønnen.

- **Gitt:** et punkt `z`, en retning `p` og gradienten `g` i `z`.
- **Prøv i rekkefølge:** `1`, `1/2` og `1/4`.
- **Returner:** første faktor som oppfyller Armijo-ulikheten med $c=10^{-4}$.
  Hvis ingen av de tre godtas, returnerer funksjonen `None`.

```{py-exercise}
#| label: week10-python-armijo
#| caption: Første godkjente steglengde
#| show-test-hints: false
import numpy as np

def well(z):
    u, v = z
    return (u*u - 1)**2 + .5*v*v

def first_accepted(z, p, g):
    c = 1e-4
    for alpha in (1., .5, .25):
        # TODO: Erstatt False med Armijo-testen for dette alpha.
        if False:
            return alpha
    return None

## TESTS ##
assert first_accepted(np.array([.2, 0.]), np.array([1.6, 0.]),
                      np.array([-.768, 0.])) == .5
assert first_accepted(np.array([1., 1.]), np.array([0., -1.]),
                      np.array([0., 1.])) == 1.
assert first_accepted(np.array([.2, 0.]), np.array([3.2, 0.]),
                      np.array([-.768, 0.])) == .25
assert first_accepted(np.array([.2, 0.]), np.array([10., 0.]),
                      np.array([-.768, 0.])) is None
```

:::
