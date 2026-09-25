<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 12.0 Oversikt

<div id="uke12-start"></div>

### En begrensning kan være en kurve

I [uke 11](uke11.qmd#uke11-modell) var ressurskravene ulikheter, og
vi sammenlignet hjørner i et tillatt område. Nå må et punkt oppfylle
en **likning**, for eksempel $x^2+y^2=1$. Da er bare selve
sirkelranden tillatt, ikke skiven inni. Vi finner først de retningene
vi kan bevege oss i langs kurven. Så bruker vi Lagranges metode til
å finne kandidater, kontrollerer et numerisk svar og undersøker når
metoden kan svikte. I 12.5 kommer regneoppgaver; i 12.6 kan du prøve
korte Python-oppgaver. **Forelesning** viser hovedideen, mens
**Gå i dybden** åpner begrunnelser med flere likninger og andrederiverte.

### Læringsmål

Etter denne uken skal du kunne

- finne tangent og normal til en regulær likhetsbetingelse i et punkt,
- sette opp og løse Lagranges likninger for én likhetsbetingelse,
- skille kandidater fra lokale og globale ekstremalpunkter ved å sammenligne verdier eller finne en global grense,
- kontrollere både betingelsesfeil og stasjonaritetsfeil i et numerisk SLSQP-svar,
- kjenne igjen en degenerert betingelse og forklare hvordan en Lagrangemultiplikator kan gi en nedre grense.

## 12.1 Sirkelen: retninger som er tillatt

<div id="uke12-tangent"></div>

Tenk at vi skal velge et punkt på kanten av en rund plate. En verdi
blir større når vi går mot høyre, og vokser dobbelt så raskt når vi
går oppover. Hvor på kanten blir verdien størst? Dette gir modellen

| Rolle | Uttrykk | Hva det betyr |
|:--|:--|:--|
| Valg | $z=(x,y)$ | Punktet vi flytter på. |
| Mål | Maksimer $f(x,y)=x+2y$ | Vi ønsker størst mulig verdi. |
| Krav | $h(x,y)=x^2+y^2-1=0$ | Bare punkter på enhetssirkelens rand er tillatt. |

Vi kan begynne med å sammenligne noen punkter som oppfyller kravet:

| Tillatt punkt $z$ | Kontroll av $x^2+y^2$ | Målverdi $f(z)$ |
|:--|:--|:--|
| $(1,0)$ | $1$ | $1$ |
| $(0,1)$ | $1$ | $2$ |
| $(1,2)/\sqrt5$ | $(1^2+2^2)/5=1$ | $\sqrt5\approx2.236$ |

Den siste raden er bedre enn de to første, men tre prøver beviser ikke at
verdien er størst mulig. En **nivålinje** $x+2y=c$ samler alle
punkter med samme målverdi $c$. I figuren nedenfor ser du
sirkelen og flere nivålinjer. Legg merke til hvor linjen med
$c=\sqrt5$ berører sirkelen; senere skal vi bevise at ingen
høyere nivålinje treffer et tillatt punkt.

### Eksperiment 1 – hvor berører nivålinjen sirkelen?

Koden prøver mange sirkelpunkter og tegner nivålinjene. Utvalgets
største verdi er en pekepinn, mens den tegnede berøringen viser
hvilket punkt vi skal undersøke for hånd.

```{pyodide-python}
#| label: week12-circle-experiment
# NumPy gir vektorregning, Matplotlib figurer og SciPy minimeringsrutinen.
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

# 1. Prøv mange tillatte punkter for å se omtrentlige ytterverdier.
theta = np.linspace(0, 2*np.pi, 721)
circle = np.column_stack((np.cos(theta), np.sin(theta)))
values = circle @ np.array([1., 2.])
print("Prøvepunkter på sirkelen:", len(circle))
print("Største verdi i utvalget:", round(values.max(), 6))
print("Minste verdi i utvalget:", round(values.min(), 6))

# 2. Sammenlign nivålinjene med hele den tillatte kurven.
xx, yy = np.meshgrid(np.linspace(-1.25, 1.25, 130),
                     np.linspace(-1.25, 1.25, 130))
fig, ax = plt.subplots(figsize=(6, 6))
ax.contour(xx, yy, xx + 2*yy, levels=np.arange(-2, 2.1, .5),
           colors="0.7")
ax.plot(circle[:, 0], circle[:, 1], color="tab:blue", label="h = 0")
ax.plot(xx[0], (np.sqrt(5)-xx[0])/2, "--", color="tab:red",
        label="nivålinje f = √5")
# 3. Merk det eksakte punktet som vi skal begrunne nedenfor.
p_max = np.array([1., 2.])/np.sqrt(5)
ax.plot(*p_max, "o", color="tab:red", label="eksakt maksimum")
ax.set(xlabel="x", ylabel="y", xlim=(-1.25, 1.25), ylim=(-1.25, 1.25))
ax.set_aspect("equal")
ax.legend()
plt.show()
```

### Tangent og normal: hvilke retninger kan vi følge?

En **tangentretning** viser hvilken vei vi kan begynne å gå
langs kurven fra et punkt. Den rette tangentlinjen er bare et
lokalt bilde av kurven: ved $(1,0)$ ligger $(1,t)$ utenfor
sirkelen når $t\ne0$. En **normalretning** står vinkelrett på
tangenten.

**Regn for hånd.** Vi bruker punktet $(1,0)$ for å se hva
sirkelkravet tillater, og hvordan målverdien endres der.

1. Sirkelens radius fra origo til $(1,0)$ peker som $(1,0)$.
   Retningen $v=(0,1)$ står vinkelrett på radiusen og er en
   **enhetstangent**: den har lengde 1. På kurven kan vi gå
   både oppover og nedover fra punktet.
2. Gradientene er $\nabla h=(2x,2y)$ og $\nabla f=(1,2)$.
   Ved $(1,0)$ er $\nabla h=(2,0)$, altså en normal til
   sirkelen. Den deriverte av målet i tangentretningen er
   $\nabla f\cdot v=(1,2)\cdot(0,1)=2$.
3. Fordi denne deriverte ikke er null, øker målet når vi
   begynner å gå oppover. Punktet $(1,0)$ er derfor ikke
   et maksimum på sirkelen, selv om det er tillatt.

Generelt er $\nabla h$ en normal til kurven $h=0$ når
$\nabla h\ne0$. Da kaller vi kravet **regulært** i punktet.
Ved et lokalt maksimum eller minimum må den deriverte av målet
langs enhver tillatt tangent være null. Målets gradient $\nabla f$ må derfor
også stå normalt på kurven. Den trenger ikke være null, slik den
gjorde ved et fritt indre ekstremum i [uke 8](uke8.qmd#uke8-lokalt).
Den generelle begrunnelsen med kjerneregelen står under
«Gå i dybden».

### Lagranges likninger: finn punkter uten endring til første orden

To normalvektorer til en regulær kurve i planet er parallelle.
Vi innfører tallet $\lambda$, en **Lagrangemultiplikator**, og
skriver parallelliteten som $\nabla f+\lambda\nabla h=0$.
Funksjonen $L(z,\lambda)=f(z)+\lambda h(z)$ kalles
**Lagrangefunksjonen**. Et regulært lokalt ekstremum må dermed
oppfylle begge **Lagranges likninger**:

$$\boxed{h(z_*)=0,\qquad \nabla f(z_*)+\lambda\nabla h(z_*)=0.}$$

Den første krever et tillatt punkt. Den andre krever null
derivert langs tangenten. Et tillatt punkt med denne egenskapen
kalles **stasjonært under bibetingelsen**. Det er en kandidat,
ikke automatisk et maksimum eller minimum.

For vårt mål og vår sirkel blir likningene

$$1+2\lambda x=0,\qquad 2+2\lambda y=0,\qquad x^2+y^2=1.$$

**Regn for hånd.** Vi finner alle kandidatene før vi
sammenligner verdiene.

1. Fra de to gradientlikningene er $\lambda\ne0$; ellers
   ville den første likningen gi $1=0$.
2. Likningene gir $x=-1/(2\lambda)$ og $y=-1/\lambda$.
   Dermed må $y=2x$.
3. Sett dette inn i kravet: $x^2+(2x)^2=5x^2=1$.
   Altså er $x=\pm1/\sqrt5$ og $y=2x$.

Kandidatene har forskjellige målverdier:

| Kandidat | $f=x+2y$ | $\lambda$ |
|:--|:--|:--|
| $(1,2)/\sqrt5$ | $\sqrt5$ | $-\sqrt5/2$ |
| $-(1,2)/\sqrt5$ | $-\sqrt5$ | $\sqrt5/2$ |

For en global garanti bruker vi **Cauchy–Schwarz-ulikheten**:
$|a\cdot b|\le\|a\|_2\|b\|_2$. Indreproduktet kan altså
ikke være større i absoluttverdi enn produktet av vektorenes
lengder. Hvert tillatt $z$ har lengde 1, så

$$x+2y=(1,2)\cdot z\le\|(1,2)\|_2\|z\|_2=\sqrt5.$$

Punktet $(1,2)/\sqrt5$ oppnår grensen og er **globalt**
maksimum; det motsatte punktet er globalt minimum. Sirkelen er
kompakt, så ytterverdiene oppnås også etter resultatet i 8.3.

<details class="reading-step">
<summary>Gå i dybden: hvorfor normalene er parallelle, og flere krav</summary>

**Kjerneregelen langs en tillatt kurve.** La $p(t)$ være en glatt
kurve med $h(p(t))=0$ og $p(0)=z_*$. Kjerneregelen gir

$$0=\left.\frac{d}{dt}h(p(t))\right|_{t=0}
=\nabla h(z_*)\cdot p'(0).$$

Dermed står enhver tangent $p'(0)$ vinkelrett på $\nabla h$.
Ved et lokalt ekstremum for $f$ langs kurven gir samme regel
$\nabla f(z_*)\cdot p'(0)=0$. Når $\nabla h(z_*)\ne0$,
kan vi lokalt beskrive likningen som en glatt kurve. Normalrommet
i planet er da endimensjonalt, slik at $\nabla f$ og
$\nabla h$ er parallelle. Det gir multiplikatorlikningen i
hovedteksten.

På sirkelen kan vi se tangentregningen direkte med
$p(t)=(\cos t,\sin t)$. Da er $p'(t)=(-\sin t,\cos t)$
og $(f\circ p)'(t)=-\sin t+2\cos t
=\nabla f(p(t))\cdot p'(t)$.

**Fra kurve til flate.** I tre variabler beskriver
$x^2+y^2+z^2=1$ en flate. Ved $(0,0,1)$ er normalen
$(0,0,2)$, så tangentretningene har tredje komponent null.

**Flere likninger.** For krav $h_i(z)=0$ er **Jacobianen**
$J_h$ matrisen med radene $\nabla h_i^T$. En tangent $v$ må
oppfylle $J_h(z_*)v=0$. Er normalene $\nabla h_i(z_*)$
lineært uavhengige, er kravene regulære. Hver normal får sin
multiplikator, og de nødvendige likningene er

$$h_i(z_*)=0\quad(i=1,\ldots,m),\qquad
\nabla f(z_*)+\sum_{i=1}^m\lambda_i\nabla h_i(z_*)=0.$$

For eksempel gir kravene $x^2+y^2+z^2=1$ og $z=0$ ved
$(1,0,0)$ normalene $(2,0,0)$ og $(0,0,1)$. De er
uavhengige, og tangentene er $(0,t,0)$. Hvis normalene ikke er
uavhengige, kan Lagranges likninger overse et ekstremum;
12.4 viser et slikt tilfelle.

</details>

### Et kort regneeksempel: nærmest origo på en linje

Før vi går videre til flere kandidater, prøver vi samme metode med
en rett linje som tillatt mengde. Vi vil **minimere**
$f(x,y)=x^2+y^2$ under kravet $h(x,y)=x+y-2=0$. Målet er
kvadratet av avstanden til origo, så vi søker punktet på linjen
som ligger nærmest origo.

1. Sett $L=x^2+y^2+\lambda(x+y-2)$. Kravet og de to
   gradientlikningene er $x+y-2=0$, $2x+\lambda=0$ og
   $2y+\lambda=0$.
2. Trekk de to gradientlikningene fra hverandre: $2x-2y=0$,
   så $x=y$.
3. Sett $x=y$ inn i kravet. Da er $2x=2$, altså $(x,y)=(1,1)$.
   Gradientlikningene gir $\lambda=-2$ med vårt plussfortegn,
   og $f(1,1)=2$.
4. Kontroller at kandidaten virkelig er et minimum: på linjen
   er $y=2-x$. Da er
   $f(x,2-x)=x^2+(2-x)^2=2+2(x-1)^2\ge2$.

Likhet gjelder bare ved $x=1$, så $(1,1)$ er linjens **globale**
minimumspunkt. Lagranges likninger fant kandidaten; den siste
ulikheten klassifiserte den.

## 12.2 Lagranges likninger gir kandidater

<div id="uke12-kandidater"></div>

På samme sirkel bytter vi mål til $f(x,y)=xy$ og søker
både maksimum og minimum. Nå kan flere punkter ha null endring
langs tangenten uten å ha samme målverdi. Før vi løser likningene,
undersøker vi de fire tillatte diagonalpunktene
$(\pm1,\pm1)/\sqrt2$. Vi regner ut $xy$ og den
**tangentderiverte** $\nabla f\cdot v$ i hvert punkt. Null
tangentderivert gjør punktet til en kandidat; målverdien avgjør
ikke alene om det er størst eller minst på hele sirkelen.

### Eksperiment 2 – samme tangenttest, ulike verdier

Kjør koden og sammenlign særlig kolonnene for målverdi og
tangentderivert.

```{pyodide-python}
#| label: week12-xy-experiment
# 1. Ta med begge fortegn for hver koordinat; alle punktene er tillatt.
points = np.array([[1, 1], [1, -1], [-1, 1], [-1, -1]], float)/np.sqrt(2)
print("Punkt (x, y)       | f = xy | derivert langs tangenten")
for p in points:
    # 2. En tangent på sirkelen står vinkelrett på radiusen p.
    tangent = np.array([-p[1], p[0]])
    gradient = p[::-1]  # Gradienten til xy er (y, x).
    directional = gradient @ tangent
    print(f"{np.array2string(p, precision=4):20s} |"
          f" {np.prod(p):6.3f} | {directional: .2e}")
```

Utskriften gir null tangentderivert ved alle fire punktene,
men verdiene er $1/2$ og $-1/2$. Lagranges likninger skal nå
vise at vi ikke har oversett andre kandidater. Fordi
$\nabla f=(y,x)$, får vi

$$y+2\lambda x=0,\qquad x+2\lambda y=0,\qquad x^2+y^2=1.$$

**Regn for hånd.**

1. Ingen koordinat kan være null: $x=0$ tvinger $y=0$ i
   første likning, og $y=0$ tvinger $x=0$ i den andre.
   Begge strider mot sirkelkravet.
2. Skriv $y=-2\lambda x$ og $x=-2\lambda y$. Når vi
   setter den første inn i den andre og deler på $x\ne0$,
   får vi $4\lambda^2=1$.
3. Med $\lambda=-1/2$ blir $x=y$; med $\lambda=1/2$
   blir $x=-y$. Sirkelkravet gir de fire punktene i tabellen.

| $\lambda$ | Relasjon | Kandidater | Verdi $xy$ |
|:--|:--|:--|:--|
| $-1/2$ | $x=y$ | $(1,1)/\sqrt2$ og $(-1,-1)/\sqrt2$ | $1/2$ |
| $1/2$ | $x=-y$ | $(1,-1)/\sqrt2$ og $(-1,1)/\sqrt2$ | $-1/2$ |

For å klassifisere dem globalt uten numerisk søk bruker vi at
$(x-y)^2\ge0$ gir $2xy\le x^2+y^2=1$, og $(x+y)^2\ge0$ gir
$2xy\ge-1$. Dermed er $-1/2\le xy\le1/2$, og alle fire
kandidatene oppnår en av grensene. De to med verdi $1/2$ er
globale maksimum; de andre er globale minimum.

### Krumning langs tillatte retninger

Vi har nå en global klassifisering. Vil vi i stedet undersøke
formen på målet helt nær et punkt, kan vi følge sirkelen som
$p(t)=(\cos t,\sin t)$. Da er
$f(p(t))=\tfrac12\sin(2t)$. Ved $t=\pi/4$ bøyer verdien
nedover, og ved $t=-\pi/4$ bøyer den oppover. Dette er en
lokal andrederiverttest langs *tillatte* retninger, i slekt med
[uke 8](uke8.qmd#uke8-hessian). Den globale ulikheten over
sier i tillegg hva som skjer på hele sirkelen.

<details class="reading-step">
<summary>Gå i dybden: andrederivert langs en tangent</summary>

I hovedteksten klassifiserte vi $xy$ med en global ulikhet.
Her finner vi en *lokal* krumningstest når $f$ og $h$ er to
ganger kontinuerlig deriverbare nær et regulært stasjonært punkt.
La $\gamma(t)$ være en tillatt kurve gjennom punktet, med
tangent $\gamma'(0)=v$.

1. Deriver kravet $h(\gamma(t))=0$ to ganger. Det gir
   $\nabla h\cdot v=0$ og

   $$v^T\nabla^2h\,v+\nabla h\cdot\gamma''(0)=0.$$

2. Den andrederiverte av målet langs kurven er
   $v^T\nabla^2f\,v+\nabla f\cdot\gamma''(0)$.
   Ved stasjonaritet er $\nabla f=-\lambda\nabla h$.
3. Bruk likningen fra steg 1 til å fjerne leddet med
   $\gamma''(0)$. Da står vi igjen med

   $$(f\circ\gamma)''(0)
   =v^T\nabla^2_{zz}L(z_*,\lambda)v.$$

Kurven selv bøyer seg, så vi må bruke Hessianen til *L* langs
tillatte tangenter. Ved et lokalt minimum må formen være
ikke-negativ for alle slike tangenter. Er den positiv for alle
ikke-null tangenter, har vi et strengt lokalt minimum. Tilsvarende
gir en negativ form for alle ikke-null tangenter et strengt lokalt
maksimum. Null i en retning avgjør ikke saken.

For $f=xy$ og $h=x^2+y^2-1$ blir
$\nabla^2_{zz}L=
\left(\begin{smallmatrix}2\lambda&1\\1&2\lambda\end{smallmatrix}\right)$.
Ved $p=(1,1)/\sqrt2$, $\lambda=-1/2$ og enhetstangent
$v=(-1,1)/\sqrt2$ gir formen $-2$: et maksimum langs
sirkelen. Ved $x=-y$ blir den $+2$: et minimum. Direkte
derivasjon av $f(\cos t,\sin t)=\tfrac12\sin2t$ gir
samme fortegn.

For flere regulære likninger bruker vi $L=f+\sum_i\lambda_i h_i$
og bare tangenter med $J_hv=0$. En semidefinit form med null i en
ikke-null tangentretning er fortsatt ikke en avgjørende test.

</details>

## 12.3 Finn et punkt numerisk og kontroller det

<div id="uke12-slsqp"></div>

Et målepunkt $a=(2,1)$ ligger utenfor enhetssirkelen. Vi
vil finne sirkelpunktet som er **nærmest** målepunktet. Målet
er halvparten av kvadrert avstand, og kravet er fortsatt sirkelen:

| Rolle | Uttrykk |
|:--|:--|
| Valg | $z=(x,y)$ |
| Mål | Minimer $F(z)=\tfrac12\|z-a\|_2^2$ |
| Krav | $h(z)=\|z\|_2^2-1=0$ |

Kvadrering og faktoren $1/2$ endrer ikke nærmeste punkt.
Dette ligner kvadrerte residualer i [uke 4](uke4.qmd#uke4-mk),
men residualen $z-a$ må nå stå normalt på den tillatte kurven
ved et regulært optimum. Til sammenligning har $(1,0)$ verdien
$F=1$, mens $a/\sqrt5$ har
$F=\tfrac12(\sqrt5-1)^2\approx0.763932$.

Vi lar `minimize` fra SciPy søke fra $x_0=(0.4,0.9)$ med
metoden `SLSQP`, som kan håndtere likningskrav. I kallet betyr
`type='eq'` at $h(z)=0$. `fun=h` beregner kravet, og
`jac=grad_h` leverer normalen $\nabla h$. Vi sender også
målgradienten som `jac=grad_F`. En `callback` samler punktene
som søket rapporterer, til figuren etterpå.

Resultatet er en **numerisk kandidat**. Vi kontrollerer
to ting som løserens stoppflagg ikke kan avgjøre for oss:

- **Betingelsesfeilen** $|h(z)|$ tester om punktet ligger på
  sirkelen.
- **Stasjonaritetsfeilen**
  $\|\nabla F(z)+\lambda\nabla h(z)\|_2$ tester om
  målgradienten kan balanseres av kravnormalen.

Vi velger $\lambda$ slik at stasjonaritetsfeilen blir minst
mulig for punktet løseren fant:

1. Sett $g=\nabla F(z)$ og $n=\nabla h(z)$. Her er
   $g=z-a$ og $n=2z$.
2. For et fast $z$ minimerer vi $\|g+\lambda n\|_2^2$.
   Deriverten med hensyn til $\lambda$ er
   $2n\cdot(g+\lambda n)$.
3. Når $n\ne0$, setter vi deriverten lik null og får
   $\lambda=-g\cdot n/\|n\|_2^2$.

En liten verdi av bare den ene feilen sikrer ikke den andre. I
dette enkle problemet bør begge for eksempel være under
$10^{-7}$. Vi sammenligner også punktet med $a/\sqrt5$,
som vi begrunner eksakt etter forsøket.

### Eksperiment 3 – finn og kontroller et sirkelpunkt

Koden rapporterer punkt, målverdi, begge kontrollfeilene og
løserens stoppflagg hver for seg.

```{pyodide-python}
#| label: week12-slsqp-experiment
# 1. Definer avstandsmålet, sirkelkravet og gradientene deres.
from scipy.optimize import minimize

a = np.array([2., 1.])

def F(z):
    # Halvparten av kvadrert avstand gir samme minimumspunkt som avstand.
    return .5*np.sum((z-a)**2)

def grad_F(z):
    # Gradienten til halvparten av kvadrert avstand er residualen.
    return z-a

def h(z):
    # Null betyr at punktet ligger på enhetssirkelen.
    return np.dot(z, z)-1.

def grad_h(z):
    # Denne normalen må ikke være null i kontrollen nedenfor.
    return 2*z

x0 = np.array([.4, .9])
path = [x0.copy()]

def save_iterate(z):
    # Lagre en kopi, slik at senere oppdateringer ikke endrer eldre iterater.
    path.append(z.copy())

# 2. Løs problemet. Rapporterte mellomiterater kan bryte sirkelkravet.
result = minimize(F, x0, jac=grad_F, method="SLSQP",
                  constraints=[{"type": "eq", "fun": h, "jac": grad_h}],
                  callback=save_iterate,
                  options={"ftol": 1e-12, "maxiter": 100})
z = result.x

# 3. Finn multiplikatoren som gir minst stasjonaritetsfeil.
lam = -np.dot(grad_F(z), grad_h(z))/np.dot(grad_h(z), grad_h(z))
feasibility = abs(h(z))
stationarity = np.linalg.norm(grad_F(z)+lam*grad_h(z))
print("Numerisk kandidat:")
print("  punkt z             =", np.round(z, 8))
print("  verdi F(z)          =", round(result.fun, 10))
print("Kontroller:")
print("  betingelsesfeil |h| =", f"{feasibility:.2e}")
print("  stasjonaritetsfeil  =", f"{stationarity:.2e}")
print("  multiplikator       =", round(lam, 8))
print("  løserens success    =", result.success)
print("Eksakt referansepunkt =", np.round(a/np.linalg.norm(a), 8))
```

Kjøringen finner omtrent $(0.89442719,0.44721360)$ med
målverdi $0.76393202$ og multiplikator $0.618034$ i vår
fortegnskonvensjon. Begge feilene er små. `success=True`
forteller at løseren stanset på vanlig måte; en global garanti
krever fortsatt en begrunnelse som dekker hele sirkelen.

For ethvert tillatt $z$ gir Cauchy–Schwarz
$a\cdot z\le\|a\|_2\|z\|_2=\sqrt5$. Da er

$$F(z)=\tfrac12(\|a\|_2^2+1-2a\cdot z)
\ge\tfrac12(\sqrt5-1)^2.$$

Likhet gjelder ved $z=a/\sqrt5$. Dermed er dette det globalt
nærmeste punktet. De to numeriske feilene kontrollerer bare
kravet og stasjonariteten. Også det fjerneste sirkelpunktet kan
være stasjonært; det gir ikke like liten avstand.

Banefiguren viser hva søket rapporterte på vei mot sluttpunktet.
Den tegner nivåkurver for $F$ og markerer startpunktet, de
rapporterte iteratene og det eksakte punktet. Linjestykkene
viser rekkefølgen, ikke en bane som nødvendigvis er tillatt.
Et mellompunkt kan ligge utenfor sirkelen og ha lavere verdi
enn det beste *tillatte* punktet.

### Eksperiment 4 – se de rapporterte iteratene

Kjør SLSQP-cellen over først. Sammenlign markørene med sirkelen;
den oransje linjen er bare en visuell forbindelse mellom dem.

```{pyodide-python}
#| label: week12-slsqp-path
# 1. Bruk rapporterte iterater, og legg til sluttpunktet ved behov.
track = np.array(path)
if not np.allclose(track[-1], result.x):
    track = np.vstack([track, result.x])

# 2. Tegn nivåkurver til målet og hele den tillatte sirkelen.
u, v = np.meshgrid(np.linspace(-1.2, 2.55, 220),
                   np.linspace(-1.25, 2.25, 220))
levels = .5*((u-a[0])**2 + (v-a[1])**2)
fig, ax = plt.subplots(figsize=(7, 6))
contours = ax.contour(u, v, levels, levels=[.25, .5, .764, 1., 2., 3.],
                      colors="0.72", linestyles="dotted")
ax.clabel(contours, inline=True, fontsize=8, fmt="F = %g")
angles = np.linspace(0, 2*np.pi, 400)
ax.plot(np.cos(angles), np.sin(angles), color="tab:blue", lw=2,
        label="tillatt sirkel h = 0")

# 3. Forbind markørene i rapportert rekkefølge.
ax.plot(track[:, 0], track[:, 1], "-o", color="tab:orange",
        lw=1.5, markersize=4, label="rapporterte iterater")
ax.scatter(*x0, marker="s", s=75, color="tab:purple", zorder=5,
           label="start")
exact = a/np.linalg.norm(a)
ax.scatter(*exact, marker="o", facecolors="none", edgecolors="tab:green",
           linewidths=2.2, s=260, zorder=5, label="eksakt nærmeste punkt")
ax.scatter(*result.x, marker="*", s=170, color="tab:red", zorder=6,
           label="numerisk sluttpunkt")
# Nummerer bare de første rapporterte iteratene, hvis de finnes.
for i in range(1, min(4, len(track))):
    ax.annotate(str(i), track[i], xytext=(5, 6),
                textcoords="offset points", fontsize=9)
ax.scatter(*a, marker="x", color="black", s=65, label="målepunkt a")
ax.set(xlabel="x", ylabel="y", xlim=(-1.2, 2.55), ylim=(-1.25, 2.25))
ax.set_aspect("equal")
ax.legend(loc="upper center", bbox_to_anchor=(.5, -.10), ncol=2,
          frameon=False, fontsize=9)
fig.tight_layout()
plt.show()
```

<details class="reading-step">
<summary>Gå i dybden: begge stasjonære punkter i avstandsproblemet</summary>

Fra $z-a+2\lambda z=0$ følger $z=a/(1+2\lambda)$ når nevneren
er ulik null. Kravet $\|z\|_2=1$ gir $|1+2\lambda|=\sqrt5$.
Det finnes dermed to stasjonære sirkelpunkter: det nærmeste
$a/\sqrt5$ og det fjerneste $-a/\sqrt5$. En null residual alene
klassifiserer dem ikke. For alle sirkelpunkter gir Cauchy–Schwarz
$-\sqrt5\le a\cdot z\le\sqrt5$. Siden
$F(z)=\tfrac12(6-2a\cdot z)$, følger den tosidige grensen

$$\tfrac12(\sqrt5-1)^2\le F(z)\le\tfrac12(\sqrt5+1)^2.$$

De to punktene oppnår hver sin grense.

</details>

## 12.4 Degenerasjon og en nedre grense

<div id="uke12-degenerert"></div>

### Når normalen forsvinner

Lagranges likninger i 12.1 forutsatte at $\nabla h\ne0$.
Vi prøver et krav som bare tillater ett punkt, for å se hvorfor
den forutsetningen trengs:

| Rolle | Uttrykk |
|:--|:--|
| Mål | $f(x,y)=x$ |
| Krav | $h(x,y)=x^2+y^2=0$ |
| Tillatt punkt | Bare $(0,0)$, fordi to kvadrater summerer til null bare der. |

Det eneste tillatte punktet er både globalt minimum og globalt
maksimum *på den tillatte mengden*. Likevel er
$\nabla f(0,0)=(1,0)$ og $\nabla h(0,0)=(0,0)$.
Dermed blir $\nabla f+\lambda\nabla h=(1,0)$ uansett
hvilket tall vi velger for $\lambda$. Dette er et
**degenerert krav** i punktet: gradienten til kravet er null,
så normaltesten fra 12.1 kan overse et ekstremum.

### Eksperiment 5 – prøv multiplikatorer ved et degenerert krav

Koden kontrollerer tre valg av $\lambda$. Se at
stasjonaritetsfeilen ikke endrer seg. Vi fant ekstremum ved å
undersøke den tillatte mengden direkte.

```{pyodide-python}
#| label: week12-degenerate-experiment
# 1. Regn ut gradientene i det eneste tillatte punktet.
p = np.array([0., 0.])
grad_f = np.array([1., 0.])
grad_constraint = 2*p
print("Tillatt punkt:", p)
print("Målgradient grad f:", grad_f)
print("Betingelsesgradient grad h:", grad_constraint)
print("Prøvd multiplikator | stasjonaritetsfeil")
# 2. Ingen av valgene kan endre grad f når grad h er null.
for lam_test in [-10, 0, 10]:
    error = np.linalg.norm(grad_f + lam_test*grad_constraint)
    print(f"{lam_test:18d} | {error:.1f}")
```

### En multiplikator som gir en nedre grense

Nå bruker vi avstandsproblemet fra 12.3 til noe annet: å bevise
en **nedre grense for optimalverdien**. Dette knytter an til
grensene i [uke 11](uke11.qmd#uke11-dual). Med vår
fortegnskonvensjon er Lagrangefunksjonen
$L(z,\lambda)=F(z)+\lambda h(z)$.

På sirkelen er $h(z)=0$, og dermed $L(z,\lambda)=F(z)$.
Hvis vi velger en $\lambda$ slik at $L(z,\lambda)$ aldri
går under et tall $d$, må også målet ved *ethvert tillatt*
punkt være minst $d$. Her kan vi finne en slik grense for hånd:

1. Velg $\lambda_*=(\sqrt5-1)/2$. Da er Hessianen til
   $L$ med hensyn til $z$ lik
   $(1+2\lambda_*)I=\sqrt5 I$. Den er positiv definit
   (SPD): $L$ er en kvadratisk skål.
2. Bunnen av skålen finnes ved $\nabla_zL=0$.
   Det gir $(1+2\lambda_*)z-a=0$ og dermed
   $z_*=a/\sqrt5$. Siden skålen er SPD, er dette dens
   globale minimum over alle $z$.
3. Punktet $z_*$ oppfyller også $\|z_*\|_2=1$.
   Bunnen av skålen er altså selv tillatt, og grensen er
   skarp.

For hvert tillatt $z$ følger dermed

$$F(z)=L(z,\lambda_*)\ge L(z_*,\lambda_*)
=F(z_*)=\tfrac12(\sqrt5-1)^2.$$

I uke 11 ga ressurspriser en **øvre** grense for et maksimalt
overskudd. Her gir multiplikatoren en **nedre** grense for et
minimalt mål. Et likningskrav har ingen påtvunget
fortegnsbetingelse på multiplikatoren. Vi beholder konvensjonen
$L=f+\lambda h$ gjennom hele uken. Et ulikhetskrav som
$x^2+y^2\le1$ beskriver hele skiven og er et annet problem.

<details class="reading-step">
<summary>Gå i dybden: generell dualgrense og regning i eksemplet</summary>

For en minimering med likhetskrav setter vi
$d(\lambda)=\inf_z L(z,\lambda)$. Siden $F(z)=L(z,\lambda)$
på alle tillatte punkter, er $d(\lambda)$ en nedre grense for
den tillatte minimumsverdien, også når grensen er ubrukelig
($-\infty$). Hvis et tillatt punkt samtidig minimerer $L$ globalt,
møtes nedre grense og punktets verdi. Likningen $\nabla_zL=0$
alene er ikke nok til å vise dette.

I vårt eksempel utvider vi kvadratet i $F$ og samler leddene
med $\|z\|^2$. Siden $\|a\|^2=5$, får vi, når $1+2\lambda>0$,

$$L(z,\lambda)=\tfrac12(1+2\lambda)\|z\|^2-a\cdot z
+\tfrac52-\lambda.$$

Gradienten med hensyn til $z$ er $(1+2\lambda)z-a$.
Derfor ligger minimum uten bibetingelser ved
$z=a/(1+2\lambda)$. Innsetting i $L$ gir

$$d(\lambda)=\tfrac52-\lambda-\frac5{2(1+2\lambda)}.$$

Når $\lambda=\lambda_*=(\sqrt5-1)/2$, blir nevneren
$1+2\lambda_*=\sqrt5$. Da er minimumspunktet $a/\sqrt5$
tillatt, og den nedre grensen blir nøyaktig $F(a/\sqrt5)$.
En slik skarp grense er ikke garantert for enhver likhetsbetingelse.

Hvis målet har enhet kroner og kravet er $h=g-r=0$ målt i
en ressursenhet, har $\lambda$ enhet kroner per ressursenhet,
slik at $f+\lambda h$ kan summeres. Når optimal verdi varierer
glatt med $r$ uten skifte av løsningstype, er $-\lambda$ den
lokale endringen per ekstra enhet $r$.

</details>

## 12.5 Regneoppgaver

<div id="uke12-oppgaver"></div>

Oppgave 1–2 bruker normal, tangent og Lagranges likninger fra
12.1. Oppgave 3 gjelder klassifisering i 12.2, oppgave 4
betingelsesfeil fra 12.3, og oppgave 5–6 degenerasjon og en
nedre grense fra 12.4. Begrunn framgangsmåten i egne notater;
feltene kontrollerer tallene. Skriv eksakte uttrykk som
`1/sqrt(5)` med mindre oppgaven ber om desimaler.

::: {#week12-exercise-convention .math-exercise-context}

Vi bruker $h=0$ og $L=f+\lambda h$. Ved et regulært ekstremum
må $h=0$ og $\nabla f+\lambda\nabla h=0$. Løsning av disse
likningene gir kandidater som må klassifiseres.

:::

```{math-exercise}
#| label: week12-normal-tangent
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: normalens x-komponent, normalens y-komponent, tangentens x-komponent, tangentens y-komponent

<strong>1. Tangent og normal.</strong> La $h(x,y)=x^2+4y^2-1$ og $p=(0,1/2)$.
Finn $\nabla h(p)$ og en enhetstangent med positiv $x$-komponent.
Kontroller at skalarproduktet av de to vektorene er null.

$\nabla h(p)=$ vec[0,4]

Enhetstangent $=$ vec[1,0]
```

```{math-exercise}
#| label: week12-circle-lagrange
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: maksimumspunktets x-koordinat, maksimumspunktets y-koordinat, multiplikator ved maksimum

<strong>2. Lagrange på sirkelen.</strong> Maksimer $f(x,y)=x+2y$ med
$h=x^2+y^2-1=0$. Finn maksimumspunktet og multiplikatoren
for $L=f+\lambda h$. Forklar hvorfor verdien er større enn
ved det motsatte punktet.

$(x,y)=$ vec[1/sqrt(5),2/sqrt(5)]

$\lambda=$ _[-sqrt(5)/2]
```

```{math-exercise}
#| label: week12-xy-classification
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: funksjonsverdi, andrederivert langs sirkelen

<strong>3. Kandidat og type.</strong> For $f(x,y)=xy$ på sirkelen, bruk
$p=(1,1)/\sqrt2$. Finn verdien og andrederiverten av
$f(\cos t,\sin t)$ ved $t=\pi/4$. Forklar hvorfor punktet er
et maksimum langs sirkelen.

$f(p)=$ _[1/2]

$\frac{d^2}{dt^2}f(\cos t,\sin t)\big|_{t=\pi/4}=$ _[-2]
```

```{math-exercise}
#| label: week12-numeric-check
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: betingelsesfeil, stasjonaritetsfeil

<strong>4. Kontroller et numerisk forslag.</strong> I avstandsproblemet er
$a=(2,1)$, $F(z)=\tfrac12\|z-a\|^2$, $h(z)=\|z\|^2-1$.
En løser rapporterer $z=(1,0)$ og $\lambda=1/2$.
Regn ut $|h(z)|$ og $\|\nabla F(z)+\lambda\nabla h(z)\|_2$.
Hvilken kontroll avslører at dette ikke er et stasjonært punkt?

$|h(z)|=$ _[0] &nbsp; Stasjonaritetsfeil $=$ _[1]
```

```{math-exercise}
#| label: week12-degenerate-check
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: punktets x-koordinat, punktets y-koordinat, betingelsesgradientens x-komponent, betingelsesgradientens y-komponent

<strong>5. Degenerert likning.</strong> La $f(x,y)=x+3y$ og
$h(x,y)=x^2+y^2=0$. Finn det eneste tillatte punktet og
$\nabla h$ der. Forklar hvorfor ingen multiplikator kan gjøre
$\nabla f+\lambda\nabla h=0$, selv om punktet er et optimum.

Tillatt punkt $=$ vec[0,0]

$\nabla h(0,0)=$ vec[0,0]
```

```{math-exercise}
#| label: week12-dual-bound
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: SPD Hessianverdi, minste verdi av L, F i tillatt punkt

<strong>6. En nedre grense.</strong> Bruk $F(z)=\tfrac12\|z-(2,1)\|^2$,
$h(z)=\|z\|^2-1$ og $\lambda=1/2$. Da er
$L=F+\lambda h$ en kvadratisk funksjon.
Finn tallet $c$ slik at Hessianen til $L$ er $cI$.
Finn deretter minimumsverdien av $L$ over alle $z$, og
verdien $F(1,0)$ i ett tillatt punkt. For å avgjøre om nedre grense
er skarp, sammenlign den med den eksakte minimumsverdien
$\tfrac12(\sqrt5-1)^2$ fra 12.3. Begrunn i egne notater.

$c=$ _[2] &nbsp; $\min_z L(z,1/2)=$ _[3/4] &nbsp;
$F(1,0)=$ _[1]
```

## 12.6 Python: prøv kontrollene selv

<div id="uke12-python"></div>

Importene av NumPy som `np` og Matplotlib som `plt` står i første kodecelle.
Oppgavene nedenfor har egne importer og definisjoner og kan kjøres
uavhengig av forsøkene over. Fyll bare hullene merket `TODO`.
Testene kontrollerer resultatene uten å vise løsningen.

**Oppgave 1 – normal og tangent.** For
$h(x,y)=x^2+4y^2-1$, returner gradienten som en vektor.
Den ferdige kontrollen undersøker normalens komponenter; tangentene
fra 12.1 står vinkelrett på denne normalen.

```{py-exercise}
#| label: week12-python-normal
#| caption: Beregn normalvektoren til en ellipse
#| show-test-hints: false
import numpy as np

# En likningsgradient har én komponent per variabel.
def grad_h(z):
    x, y = z
    # TODO: Bytt ut begge komponentene med partiellderiverte av h.
    return np.array([0., 0.])

## TESTS ##
# Test i flere punkter, også et punkt med to ikke-null koordinater.
assert np.allclose(grad_h(np.array([0., .5])), [0., 4.])
assert np.allclose(grad_h(np.array([1., 0.])), [2., 0.])
assert np.allclose(grad_h(np.array([.25, -.5])), [.5, -4.])
```

**Oppgave 2 – les et numerisk svar.** For avstandsproblemet fra
12.3 er målet og de to gradientene gitt. Fullfør funksjonen som
returnerer begge kontrollfeilene for et foreslått punkt og en
oppgitt multiplikator. En liten stasjonaritetsfeil kan ikke erstatte
en liten betingelsesfeil.

```{py-exercise}
#| label: week12-python-residuals
#| caption: Kontroller mulighet og stasjonaritet
#| show-test-hints: false
import numpy as np

# Definer hele modellen lokalt, så cellen kan kjøres alene.
a = np.array([2., 1.])

def h(z):
    return np.dot(z, z)-1.

def grad_h(z):
    return 2*z

def grad_F(z):
    return z-a

def check(z, lam):
    # TODO: Regn ut absolutt betingelsesfeil.
    feasibility = None
    # TODO: Regn ut lengden av grad_F(z) + lam*grad_h(z).
    stationarity = None
    return feasibility, stationarity

## TESTS ##
# Ett punkt er tillatt, men ikke stasjonært; det andre er ikke tillatt.
assert np.allclose(check(np.array([1., 0.]), .5), (0., 1.))
assert np.allclose(check(np.array([0., 0.]), 0.), (1., np.sqrt(5)))
# Den eksakte løsningen tilfredsstiller begge kontrollene.
exact = a/np.sqrt(5)
assert np.allclose(check(exact, (np.sqrt(5)-1)/2), (0., 0.), atol=1e-12)
```

**Oppgave 3 – send likningen til SLSQP.** Mål og gradient er
ferdig definert. Fyll inn den ene ordboken som angir
$h(z)=0$ og dens gradient, og returner løserresultatet.
SLSQP kan starte utenfor sirkelen; kontrollen gjelder sluttpunktet.

```{py-exercise}
#| label: week12-python-slsqp
#| caption: Legg inn likhetsbetingelsen i SLSQP
#| show-test-hints: false
import numpy as np
from scipy.optimize import minimize

# Målfunksjon og gradient er gitt; oppgaven gjelder constraints.
a = np.array([2., 1.])

def F(z):
    return .5*np.sum((z-a)**2)

def grad_F(z):
    return z-a

def h(z):
    return np.dot(z, z)-1.

def grad_h(z):
    return 2*z

def solve(start):
    # TODO: Sett inn ordboken med type 'eq', fun h og jac grad_h.
    condition = None
    # Den oppgitte metoden og målgradienten er klare.
    return minimize(F, start, jac=grad_F, method="SLSQP",
                    constraints=[condition], options={"ftol": 1e-12})

## TESTS ##
# To starter skal begge gi et tillatt punkt nær det håndregnede svaret.
for start in (np.array([.4, .9]), np.array([1., 0.])):
    result = solve(start)
    assert result.success
    assert abs(h(result.x)) < 1e-8
    assert np.allclose(result.x, a/np.sqrt(5), atol=1e-6)
```

<div id="uke12-scipy"></div>

<details>
<summary>SciPy-oppslag: det nye ved SLSQP</summary>

| Uttrykk | Betydning i avstandsproblemet |
|:--|:--|
| `method="SLSQP"` | Velger en numerisk metode som kan bruke likhetsbetingelser. |
| `{"type":"eq", "fun":h, "jac":grad_h}` | Krever $h(z)=0$ og oppgir gradienten som normalvektor. For flere likninger brukes flere slike ordbøker. |
| `callback=save_iterate` | Lagrer rapporterte iterater; de behøver ikke ligge på den tillatte kurven. |
| `options={"ftol":1e-12, "maxiter":100}` | Setter løserens interne stopptoleranse og grense for iterasjoner; kontroller residualene selv. |

`result.x`, `result.fun` og `result.success` har samme betydning som
ved de frie søkene i [uke 8](uke8.qmd#uke8-python-local): punkt,
verdi og rapportert stopp. Her må vi i tillegg kontrollere $|h|$
og $\|\nabla F+\lambda\nabla h\|_2$. Koden i 12.3 beregner selv
$\lambda$ med vår fortegnskonvensjon.

</details>

:::
