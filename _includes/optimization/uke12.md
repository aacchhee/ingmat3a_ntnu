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

Vi velger et punkt $z=(x,y)$ på enhetssirkelen og vil **maksimere**
$f(x,y)=x+2y$. Kravet er $h(x,y)=x^2+y^2-1=0$. Her er $f$
målet og $h=0$ likhetsbetingelsen. Tre tillatte punkter gir
$f(1,0)=1$, $f(0,1)=2$ og $f((1,2)/\sqrt5)=\sqrt5\approx2.236$.
Det siste punktet ligger på sirkelen fordi $(1^2+2^2)/5=1$.

En **nivålinje** har samme verdi av $f$ overalt: $x+2y=c$.
Figuren viser at linjen med størst verdi som fortsatt berører
sirkelen, berører den ved $(1,2)/\sqrt5$. Vi regner også verdier på
et tett utvalg av sirkelpunkter. Utvalget illustrerer plasseringen;
selve garantien for maksimum kommer nedenfor.

```{pyodide-python}
#| label: week12-circle-experiment
# Lag prøvepunkter på sirkelen og regn ut målets verdi i hvert punkt.
theta = np.linspace(0, 2*np.pi, 721)
circle = np.column_stack((np.cos(theta), np.sin(theta)))
values = circle @ np.array([1., 2.])
print("Største prøveverdi:", round(values.max(), 6))
print("Minste prøveverdi:", round(values.min(), 6))

# Tegn nivålinjer og den tillatte kurven i samme koordinatsystem.
xx, yy = np.meshgrid(np.linspace(-1.25, 1.25, 130),
                     np.linspace(-1.25, 1.25, 130))
fig, ax = plt.subplots(figsize=(6, 6))
ax.contour(xx, yy, xx + 2*yy, levels=np.arange(-2, 2.1, .5),
           colors="0.7")
ax.plot(circle[:, 0], circle[:, 1], color="tab:blue", label="h = 0")
ax.plot(xx[0], (np.sqrt(5)-xx[0])/2, "--", color="tab:red",
        label="nivålinje f = √5")
# Markøren er håndregnet; prøvepunktene gir ikke et bevis.
p_max = np.array([1., 2.])/np.sqrt(5)
ax.plot(*p_max, "o", color="tab:red", label="eksakt maksimum")
ax.set(xlabel="x", ylabel="y", xlim=(-1.25, 1.25), ylim=(-1.25, 1.25))
ax.set_aspect("equal")
ax.legend()
plt.show()
```

Ved $(1,0)$ kan vi bevege oss oppover eller nedover *langs*
sirkelen. Den øyeblikkelige **tangentretningen** er $v=(0,1)$.
En **enhetstangent** er en tangentvektor med lengde 1, slik som $v$ her.
Radiusen $(1,0)$ er en **normalretning**, vinkelrett på tangenten.
Den rette linjen $(1,t)$ er derimot ikke på sirkelen når $t\ne0$;
tangenten beskriver bare retningen i punktet. For
$h=x^2+y^2-1$ er gradienten $\nabla h=(2x,2y)$, slik at
$\nabla h(1,0)=(2,0)$ peker langs radiusen. Ved maksimumspunktet
er $\nabla f=(1,2)$ også en normal, selv om den ikke er null.
Dette er forskjellen fra den frie testen $\nabla f=0$ i
[uke 8](uke8.qmd#uke8-lokalt).

For å begrunne dette generelt lar vi $p(t)$ være en glatt kurve med
tillatte punkter og $p(0)=z_*$. Siden $h(p(t))=0$, gir kjerneregelen
$\nabla h(z_*)\cdot p'(0)=0$. Den tillatte tangentretningen $p'(0)$
står altså vinkelrett på $\nabla h$. Ved et lokalt ekstremum langs
kurven må også $\nabla f(z_*)\cdot p'(0)=0$. Når
$\nabla h(z_*)\ne0$, kaller vi betingelsen **regulær** der: lokalt
har vi en glatt kurve og de to gradientene må være parallelle.

Vi skriver parallelliteten ved hjelp av et tall $\lambda$, en
**Lagrangemultiplikator**. Med fortegnskonvensjonen
$L(z,\lambda)=f(z)+\lambda h(z)$, kalt **Lagrangefunksjonen**, er
de nødvendige likningene ved et regulært lokalt ekstremum

$$\boxed{h(z_*)=0,\qquad \nabla f(z_*)+\lambda\nabla h(z_*)=0.}$$

Et tillatt punkt med null derivert langs alle tillatte tangenter
kalles **stasjonært under bibetingelsen**. Ved en regulær betingelse
betyr dette at Lagranges likninger er oppfylt. Det krever ikke
$\nabla f=0$, slik stasjonaritet uten bibetingelser gjorde i uke 8.

Den første likningen sikrer at punktet er tillatt. Den andre sier at
målgradienten ikke har noen komponent langs tangenten. Her blir
$1+2\lambda x=0$ og $2+2\lambda y=0$. Den første likningen
viser at $\lambda\ne0$. Trekker vi to ganger den første fra den
andre, får vi $y=2x$. Sirkelkravet blir da $5x^2=1$. Punktene er
$\pm(1,2)/\sqrt5$, med verdier $\pm\sqrt5$ og multiplikatorer
$\mp\sqrt5/2$. Vi må fremdeles avgjøre hvilket punkt som er best:
**Cauchy–Schwarz-ulikheten** sier at
$|a^Tb|\le\|a\|_2\|b\|_2$: absoluttverdien av et indreprodukt
er høyst produktet av vektorlengdene. For alle tillatte $z$ gir den

$$x+2y=(1,2)\cdot z\le\|(1,2)\|_2\|z\|_2=\sqrt5.$$

Punktet $(1,2)/\sqrt5$ oppnår grensen, og er derfor **globalt**
maksimum. Det motsatte punktet er globalt minimum. At sirkelen er
kompakt, sikrer dessuten at begge verdiene oppnås, slik vi så i 8.3.

<details class="reading-step">
<summary>Gå i dybden: parametrisering og flere likninger</summary>

Parametriser sirkelen med $p(t)=(\cos t,\sin t)$. Da er
$p'(t)=(-\sin t,\cos t)$ og den deriverte av
$f(p(t))=\cos t+2\sin t$ lik $-\sin t+2\cos t$.
Dette er $\nabla f(p(t))\cdot p'(t)$. Null derivert betyr at
målgradienten står normalt på sirkelkurven. En likning i tre
variabler kan på samme måte beskrive en flate: for
$x^2+y^2+z^2=1$ er normalvektoren ved $(0,0,1)$ lik $(0,0,2)$,
og tangentretningene har tredje komponent null.

Hvis vi har flere krav $h_i(z)=0$, får hver likning én multiplikator.
**Jacobianen** $J_h$ er matrisen med radene $\nabla h_i^T$.
En førsteordens tangentretning $v$ oppfyller $J_h(z_*)v=0$.
Når normalene $\nabla h_i(z_*)$ er lineært uavhengige, er kravene
regulære. Da er de nødvendige likningene

$$h_i(z_*)=0\quad(i=1,\ldots,m),\qquad
\nabla f(z_*)+\sum_{i=1}^m\lambda_i\nabla h_i(z_*)=0.$$

For eksempel gir $x^2+y^2+z^2=1$ og $z=0$ ved $(1,0,0)$
normalene $(2,0,0)$ og $(0,0,1)$. De er uavhengige; en tangent
må ha formen $(0,t,0)$. Dersom normalene ikke er uavhengige, kan
Lagranges likninger overse et ekstremum, som i 12.4.

</details>

## 12.2 Lagranges likninger gir kandidater

<div id="uke12-kandidater"></div>

På samme sirkel vil vi nå **maksimere og minimere** $f(x,y)=xy$.
De fire diagonalpunktene $(\pm1,\pm1)/\sqrt2$ ligger på sirkelen.
Ved to av dem er produktet $1/2$, ved de andre $-1/2$.
Den samme likhetsbetingelsen kan altså ha både maksimums- og
minimumskandidater med null endring langs tangenten.

```{pyodide-python}
#| label: week12-xy-experiment
# Undersøk verdier og deriverte langs en tangent i de fire diagonalpunktene.
points = np.array([[1, 1], [1, -1], [-1, 1], [-1, -1]], float)/np.sqrt(2)
for p in points:
    tangent = np.array([-p[1], p[0]])
    gradient = p[::-1]  # For f(x,y)=xy er gradienten (y,x).
    print("punkt", np.round(p, 4), "f =", round(np.prod(p), 4),
          "tangentderivert =", round(gradient @ tangent, 8))
```

For $f=xy$ gir Lagranges likninger

$$y+2\lambda x=0,\qquad x+2\lambda y=0,\qquad x^2+y^2=1.$$

Verken $x$ eller $y$ kan være null i disse likningene. Eliminasjon
gir $4\lambda^2=1$: ved $\lambda=-1/2$ får vi $x=y$ og de
to punktene med verdi $1/2$; ved $\lambda=1/2$ får vi $x=-y$
og de to punktene med verdi $-1/2$. Stasjonaritet alene skiller dem
ikke. Her får vi en global klassifisering uten numerisk søk:
$(x-y)^2\ge0$ gir $2xy\le x^2+y^2=1$, og $(x+y)^2\ge0$ gir
$2xy\ge-1$. Dermed er $-1/2\le xy\le1/2$, og alle fire
kandidatene oppnår en av grensene.

Et annet uttrykk for forskjellen mellom kandidatene er å følge
sirkelen som $p(t)=(\cos t,\sin t)$. Da er
$f(p(t))=\tfrac12\sin(2t)$: rundt $t=\pi/4$ bøyer verdien
nedover (maksimum), og rundt $t=-\pi/4$ bøyer den oppover
(minimum). [Uke 8](uke8.qmd#uke8-hessian) testet tilsvarende
krumning ved frie stasjonære punkter. På en kurve undersøker vi
bare de tillatte tangentretningene. Den globale verdiulikheten
over gir mer enn en lokal andrederiverttest.

<details class="reading-step">
<summary>Gå i dybden: andrederivert langs en tangent</summary>

Anta at $f$ og $h$ er to ganger kontinuerlig deriverbare nær et
regulært stasjonært punkt. For en tillatt kurve $\gamma(t)$ gjennom
punktet, med $\gamma'(0)=v$, er førsteordens endring null. Ved
to derivasjoner av $h(\gamma(t))=0$ og innsetting av
$\nabla f=-\lambda\nabla h$ får vi

$$(f\circ\gamma)''(0)=v^T\nabla^2_{zz}L(z_*,\lambda)v.$$

Vi bruker Hessianen til *L* begrenset til tangentene, fordi kurven
selv bøyer seg. Positiv verdi for alle ikke-null tangenter er en
tilstrekkelig test for strengt lokalt minimum; ved lokalt minimum må verdien
være ikke-negativ. Negativ verdi for alle ikke-null tangenter gir strengt lokalt maksimum,
mens null ikke avgjør saken. Med $f=xy$ og $h=x^2+y^2-1$ er
$\nabla^2_{zz}L=\left(\begin{smallmatrix}2\lambda&1\\1&2\lambda\end{smallmatrix}\right)$.
Ved $p=(1,1)/\sqrt2$, $\lambda=-1/2$ og enhetstangent
$v=(-1,1)/\sqrt2$ gir formen $-2$. Ved $x=-y$ blir den $+2$.
Det stemmer med $\frac{d^2}{dt^2}(\tfrac12\sin 2t)=-2\sin2t$.

For flere regulære likninger bruker vi $L=f+\sum_i\lambda_i h_i$
og bare tangenter med $J_hv=0$. En semidefinit form med null i en
ikke-null tangentretning er fortsatt ikke en avgjørende test.

</details>

## 12.3 Finn et punkt numerisk og kontroller det

<div id="uke12-slsqp"></div>

Et målepunkt $a=(2,1)$ ligger utenfor enhetssirkelen. Vi søker
punktet $z=(x,y)$ på sirkelen som er **nærmest** $a$. Avstanden er
$\|z-a\|_2$; vi minimerer i stedet
$F(z)=\tfrac12\|z-a\|_2^2$ under $h(z)=\|z\|_2^2-1=0$.
Kvadrering og faktoren $1/2$ endrer ikke nærmeste punkt.
I [uke 4](uke4.qmd#uke4-mk) minimerte vi også kvadrerte
residualer; her må residualen $z-a$ ved løsningen stå normalt på
den krumme tillatte mengden. For eksempel er $(1,0)$ tillatt med
$F=1$, mens punktet $a/\sqrt5$ er tillatt med
$F=\tfrac12(\sqrt5-1)^2\approx0.763932$. Geometrisk peker det
nærmeste punktet fra origo mot $a$.

Vi lar nå SciPys `minimize` søke fra $x_0=(0.4,0.9)$ med metoden
`SLSQP`, som kan håndtere likhetsbetingelser. Det nye i kallet er
`constraints=[{'type':'eq', 'fun':h, 'jac':grad_h}]`:
`'eq'` betyr $h(z)=0$, `fun` beregner betingelsesverdien og `jac`
beregner gradienten $\nabla h$. Målgradienten sendes separat som
`jac=grad_F`. `callback` lagrer iteratene metoden faktisk
rapporterer. Resultatet er en **numerisk kandidat**.

Vi undersøker derfor både **betingelsesfeilen** $|h(z)|$ og
**stasjonaritetsfeilen** $\|\nabla F(z)+\lambda\nabla h(z)\|_2$.
For å finne et tall $\lambda$ som gir minst slik feil, projiserer vi
$-\nabla F$ på normalen $\nabla h$:
$\lambda=-\nabla F\cdot\nabla h/\|\nabla h\|_2^2$ når
$\nabla h\ne0$. Begge feil bør være små, for eksempel under
$10^{-7}$ i denne enkle modellen. En liten verdi av bare den ene
sikrer ikke den andre.

```{pyodide-python}
#| label: week12-slsqp-experiment
# SLSQP tar en målfunksjon, dens gradient og et likhetskrav.
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

# Metoden kan rapportere punkter utenfor sirkelen underveis.
result = minimize(F, x0, jac=grad_F, method="SLSQP",
                  constraints=[{"type": "eq", "fun": h, "jac": grad_h}],
                  callback=save_iterate,
                  options={"ftol": 1e-12, "maxiter": 100})
z = result.x

# Finn multiplikatoren ved å projisere minus målgradienten på normalen.
lam = -np.dot(grad_F(z), grad_h(z))/np.dot(grad_h(z), grad_h(z))
feasibility = abs(h(z))
stationarity = np.linalg.norm(grad_F(z)+lam*grad_h(z))
print("punkt:", np.round(z, 8), "F:", round(result.fun, 10))
print("betingelsesfeil:", f"{feasibility:.2e}",
      "stasjonaritetsfeil:", f"{stationarity:.2e}")
print("lambda:", round(lam, 8), "success:", result.success)
print("eksakt punkt:", np.round(a/np.linalg.norm(a), 8))
```

Kjøringen finner omtrent $(0.89442719,0.44721360)$, verdi
$0.76393202$, multiplikator $0.618034$ med vårt plussfortegn,
og små verdier av begge feilene. `success=True` beskriver bare
løserens stopp, ikke en global garanti. Vi kan gi en slik garanti
med håndregning: for ethvert tillatt $z$ gir Cauchy–Schwarz
$a\cdot z\le\sqrt5$, og derfor

$$F(z)=\tfrac12(\|a\|_2^2+1-2a\cdot z)
\ge\tfrac12(\sqrt5-1)^2.$$

Likhet oppnås ved $z=a/\sqrt5$. Det er dermed det globalt
nærmeste punktet. Denne begrunnelsen gjelder alle sirkelpunktene;
residualene kontrollerer likhetskravet og Lagranges likninger.
De gir alene ingen grense for avstanden til minimumspunktet: også
det fjerneste sirkelpunktet oppfyller disse likningene.

Figuren viser nivåkurver for avstandsfunksjonen og **bare iteratene
SLSQP faktisk rapporterte**. Linjestykkene mellom markørene viser
rekkefølgen, ikke en tillatt bane på sirkelen. Et mellomliggende
iterat kan ligge utenfor sirkelen og ha lavere verdi enn det beste
*tillatte* punktet.

```{pyodide-python}
#| label: week12-slsqp-path
# Bruk de observerte callback-punktene, med sluttpunktet hvis det mangler.
track = np.array(path)
if not np.allclose(track[-1], result.x):
    track = np.vstack([track, result.x])

# Tegn nivåkurver til avstandsmålet og hele den tillatte sirkelen.
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

# Forbindelsen angir rekkefølge, ikke en tillatt søkekurve.
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
klassifiserer dem ikke. Den globale ulikheten ovenfor gjør det.

</details>

## 12.4 Degenerasjon og en nedre grense

<div id="uke12-degenerert"></div>

La målet være $f(x,y)=x$, og krev $h(x,y)=x^2+y^2=0$.
Den eneste tillatte løsningen er $(0,0)$, så den er både globalt
minimum og globalt maksimum relativt til denne mengden. Likevel
er $\nabla f(0,0)=(1,0)$ og $\nabla h(0,0)=(0,0)$.
Ingen multiplikator kan gjøre $\nabla f+\lambda\nabla h=0$.
Likningen er **degenerert** i punktet: regularitetskravet i 12.1
mangler. Her må vi undersøke det tillatte punktet direkte.

```{pyodide-python}
#| label: week12-degenerate-experiment
# Kontroller at normalen forsvinner, uansett valg av multiplikator.
p = np.array([0., 0.])
grad_f = np.array([1., 0.])
grad_constraint = 2*p
print("eneste tillatte punkt:", p, "grad h:", grad_constraint)
for lam_test in [-10, 0, 10]:
    # Stasjonaritetsfeilen forblir én når grad h er null.
    error = np.linalg.norm(grad_f + lam_test*grad_constraint)
    print("lambda =", lam_test, "stasjonaritetsfeil =", error)
```

Til slutt bruker vi ideen om **grenser for optimalverdien** fra
[uke 11](uke11.qmd#uke11-dual). I avstandsproblemet er
$L(z,\lambda)=F(z)+\lambda h(z)$. På tillatte punkter er $h(z)=0$,
så $L(z,\lambda)=F(z)$ for ethvert $\lambda$. Velger vi
$\lambda_*=(\sqrt5-1)/2$, blir $L(\cdot,\lambda_*)$ en
kvadratisk funksjon av $z$ med positiv definit Hessian
$(1+2\lambda_*)I=\sqrt5 I$. Det er samme type **SPD-skål** som i
[uke 6](uke6.qmd#uke6-energi). Minimum over *alle* $z$ ligger ved
$z_*=a/\sqrt5$; dette punktet er også tillatt. Dermed gjelder
for hvert tillatt $z$

$$F(z)=L(z,\lambda_*)\ge L(z_*,\lambda_*)
=F(z_*)=\tfrac12(\sqrt5-1)^2.$$

Dette er en global nedre grense som faktisk oppnås. I uke 11 ga
ressurspriser en **øvre** grense for et maksimalt overskudd; her
gir en multiplikator en **nedre** grense for et minimalt mål.
Multiplikatoren til en likning kan ha begge fortegn, og et valg av
$L=f-\lambda h$ ville snudd fortegnet. Vi holder oss til
$L=f+\lambda h$. En ulikhet som $x^2+y^2\le1$ beskriver hele
skiven og har andre krav for indre punkter og rand; denne uken
gjelder likninger.

<details class="reading-step">
<summary>Gå i dybden: generell dualgrense og regning i eksemplet</summary>

For en minimering med likhetskrav setter vi
$d(\lambda)=\inf_z L(z,\lambda)$. Siden $F(z)=L(z,\lambda)$
på alle tillatte punkter, er $d(\lambda)$ en nedre grense for
den tillatte minimumsverdien, også når grensen er ubrukelig
($-\infty$). Hvis et tillatt punkt samtidig minimerer $L$ globalt,
møtes nedre grense og punktets verdi. Likningen $\nabla_zL=0$
alene er ikke nok til å vise dette.

I vårt eksempel er $\|a\|^2=5$ og, når $1+2\lambda>0$,

$$L(z,\lambda)=\tfrac12(1+2\lambda)\|z\|^2-a\cdot z
+\tfrac52-\lambda.$$

Minimumspunktet uten bibetingelser er $a/(1+2\lambda)$. Ved innsetting
får vi $d(\lambda)=\tfrac52-\lambda-
\frac5{2(1+2\lambda)}$. For
$\lambda_*=(\sqrt5-1)/2$ er minimumspunktet $a/\sqrt5$ tillatt,
og den nedre grensen blir nøyaktig $F(a/\sqrt5)$.
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

**1. Tangent og normal.** La $h(x,y)=x^2+4y^2-1$ og $p=(0,1/2)$.
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

**2. Lagrange på sirkelen.** Maksimer $f(x,y)=x+2y$ med
$h=x^2+y^2-1=0$. Finn maksimumspunktet og multiplikatoren
for $L=f+\lambda h$. Forklar hvorfor verdien er større enn
ved det motsatte punktet.

$(x,y)=$ vec[1/sqrt(5),2/sqrt(5)]

$\lambda=$ __[-sqrt(5)/2]
```

```{math-exercise}
#| label: week12-xy-classification
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: funksjonsverdi, andrederivert langs sirkelen

**3. Kandidat og type.** For $f(x,y)=xy$ på sirkelen, bruk
$p=(1,1)/\sqrt2$. Finn verdien og andrederiverten av
$f(\cos t,\sin t)$ ved $t=\pi/4$. Forklar hvorfor punktet er
et maksimum langs sirkelen.

$f(p)=$ __[1/2]

$\frac{d^2}{dt^2}f(\cos t,\sin t)\big|_{t=\pi/4}=$ __[-2]
```

```{math-exercise}
#| label: week12-numeric-check
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: betingelsesfeil, stasjonaritetsfeil

**4. Kontroller et numerisk forslag.** I avstandsproblemet er
$a=(2,1)$, $F(z)=\tfrac12\|z-a\|^2$, $h(z)=\|z\|^2-1$.
En løser rapporterer $z=(1,0)$ og $\lambda=1/2$.
Regn ut $|h(z)|$ og $\|\nabla F(z)+\lambda\nabla h(z)\|_2$.
Hvilken kontroll avslører at dette ikke er et stasjonært punkt?

$|h(z)|=$ __[0] &nbsp; Stasjonaritetsfeil $=$ __[1]
```

```{math-exercise}
#| label: week12-degenerate-check
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: punktets x-koordinat, punktets y-koordinat, betingelsesgradientens x-komponent, betingelsesgradientens y-komponent

**5. Degenerert likning.** La $f(x,y)=x+3y$ og
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

**6. En nedre grense.** Bruk $F(z)=\tfrac12\|z-(2,1)\|^2$,
$h(z)=\|z\|^2-1$ og $\lambda=1/2$. Da er
$L=F+\lambda h$ en kvadratisk funksjon.
Finn tallet $c$ slik at Hessianen til $L$ er $cI$.
Finn deretter minimumsverdien av $L$ over alle $z$, og
verdien $F(1,0)$ i ett tillatt punkt. For å avgjøre om nedre grense
er skarp, sammenlign den med den eksakte minimumsverdien
$\tfrac12(\sqrt5-1)^2$ fra 12.3. Begrunn i egne notater.

$c=$ __[2] &nbsp; $\min_z L(z,1/2)=$ __[3/4] &nbsp;
$F(1,0)=$ __[1]
```

## 12.6 Python: prøv kontrollene selv

<div id="uke12-python"></div>

Sideoppsettet importerer NumPy som `np` og Matplotlib som `plt`.
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
