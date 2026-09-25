<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 10.0 Oversikt

<div id="uke10-start"></div>

### Fra gradient til lokal krumning

I [uke 6](uke6.qmd#uke6-retning) fant vi en søkeretning for en positivt
definitt kvadratisk funksjon; [uke 9](uke9.qmd) brukte gradienten på
generelle funksjoner. Her spør vi om **krumningen akkurat der vi står**
kan gi et bedre steg. Newtons metode forsøker å løse likningen
$\nabla f(x)=0$ ved en lokal linearisering. Likningen beskriver
stasjonære punkter, og disse er ikke nødvendigvis minima.

| Tid | Felles arbeid i forelesningen | Kontrollspørsmål |
|:--|:--|:--|
| 0–25 min | Ett Newton-steg på en kvadratisk funksjon | Hvorfor er løsningen eksakt? |
| 25–50 min | Et ikke-konvekst moteksempel | Kan et stasjonært punkt være galt mål? |
| 50–90 min | Fortegn, regularisering og steglengde | Hvorfor hjelper ikke bare å halvere alle steg? |
| 90–120 min | Lokal fart, SciPy og overgang til bibetingelser | Hva har vi faktisk kontrollert? |

Etter uken skal du kunne danne gradient og Hessian, løse for
Newton-retningen uten matriseinvers, skille stasjonaritet fra minimum,
velge et forsvarlig dempet steg og kontrollere et numerisk svar.
Vi arbeider med frie, glatt deriverbare funksjoner i to variabler.
Startpunkt og variabelskalering undersøkes videre i
[prosjekt 10](project_week10.qmd).

## 10.1 En ligning for retningen

<div id="uke10-likning"></div>

Vi vil minimere $f(x)$, der $x=(u,v)^T$. Første nødvendige betingelse
for et indre, deriverbart lokalt minimum er $g(x)=\nabla f(x)=0$.
I [uke 2](page4.qmd) brukte vi Newton på en skalar likning. For den
vektorverdige likningen $g(x)=0$ er Jacobimatrisen til $g$ nettopp
**Hessianen** $H(x)=\nabla^2 f(x)$, matrisen av andrepartiellderiverte.
Med to variabler har den postene $f_{uu},f_{uv},f_{vu},f_{vv}$ i
den rekkefølgen en $2\times2$-matrise leses radvis. For en glatt
funksjon er de blandede deriverte like, så Hessianen er symmetrisk.
Den forteller hvordan *gradienten endrer seg* når vi flytter oss,
mens gradienten selv angir den lokale endringen av målet. Dette
er grunnen til at det er Hessianen, og ikke funksjonsverdien, som
står som koeffisientmatrise når vi løser den lineariserte
stasjonslikningen.

**Forutsi:** Hvis $f(x)=\tfrac12x^TAx-b^Tx$ og $A$ er symmetrisk
positivt definit (SPD), hvor mange Newton-steg trengs fra en vilkårlig
start? I [uke 6](uke6.qmd#uke6-energi) så vi at minimum løser $Ax=b$.

```{pyodide-python}
#| label: week10-quadratic-step
A = np.array([[4., 1.], [1., 2.]])
b = np.array([5., 3.])
x = np.array([-2., 3.])
g = A @ x - b
p = np.linalg.solve(A, -g)  # Løs Ap = -g, ikke beregn en invers.
print('g(x0) =', g, 'p =', p)
print('x1 =', x+p, '||g(x1)|| =', np.linalg.norm(A @ (x+p)-b))
```

Her er $g(x_0)=(-10,1)^T$, $p=(3,-2)^T$ og $x_1=(1,1)^T$;
gradientnormen er null (innen flyttallspresisjon). **Hvorfor** er
dette mer enn et heldig startpunkt? Lineariseringen
$g(x+p)\approx g(x)+H(x)p$ gir Newton-likningen

$$H(x_k)p_k=-g(x_k),\qquad x_{k+1}=x_k+p_k.$$

For denne kvadratiske funksjonen er $g(x)=Ax-b$ og $H(x)=A$ overalt.
Lineariseringen er derfor *eksakt*; $g(x+p)=g(x)+Ap=0$. For en
ikke-kvadratisk funksjon endrer $H$ seg med $x$. Da må vi beregne
retningen på nytt, og et helt steg kan være for langt.

<details class="reading-step"><summary>Gå i dybden: hvorfor er retningen fallende ved positiv Hessian?</summary>

Den andreordens lokale modellen er
$m_x(p)=f(x)+g(x)^Tp+\tfrac12p^TH(x)p$. Gradient med hensyn til $p$
er $g(x)+H(x)p$. Når $H(x)$ er SPD, har denne modellen ett minimum,
gitt ved $Hp=-g$. Hvis $g\ne0$, er
$g^Tp=-p^THp<0$: små positive steg langs $p$ senker funksjonen.
SPD *i ett punkt* er likevel bare lokal informasjon. Modellen
garanterer ikke at $f(x+p)<f(x)$ for det hele steget.

</details>

**Overfør:** Hvilket ledd i argumentet for ett steg forsvinner hvis
$H$ varierer mellom $x$ og $x+p$?

## 10.2 Stasjonær er ikke det samme som minimal

<div id="uke10-stasjonaer"></div>

La $f(u,v)=(u^2-1)^2+v^2/2$. De to punktene $(\pm1,0)$ har
funksjonsverdi null og er globale minima siden begge ledd er
ikke-negative. Men $(0,0)$ er også stasjonært. **Forutsi:** Hva gjør
Newton fra $(0.2,0)$? Undersøk fortegnet til både $g^Tp$ og
$f(x+p)-f(x)$ før du kjører.

```{pyodide-python}
#| label: week10-ascent
x = np.array([.2, 0.])
g, H = well_grad(x), well_hess(x)
p = np.linalg.solve(H, -g)
print('g =', g, 'H-diagonal =', np.diag(H))
print('p =', p, 'g·p =', g @ p)
print('f før og etter helt steg:', well(x), well(x+p))
print('Ved origo: ||g|| =', np.linalg.norm(well_grad([0.,0.])),
      ', Hessian-egneverdier =', np.linalg.eigvalsh(well_hess([0.,0.])))
```

$H(x)=\operatorname{diag}(-3.52,1)$, så Newton peker i første
koordinat mot omtrent $-0.01818$, *opp* fra $f(x)=0.9216$ til omtrent
$0.99934$. Retningen har $g^Tp>0$: selv tilstrekkelig små positive
steg øker $f$. I $(0,0)$ er gradienten null, men Hessianen har
egenverdiene $-4$ og $1$. Funksjonen avtar langs $u$ og øker langs
$v$ fra dette punktet: det er et **sadelpunkt**. Gradientnorm null
kontrollerer derfor bare en nødvendig betingelse for et fritt minimum.

En SPD-Hessian ved et stasjonært punkt gir et strengt lokalt minimum
for en to ganger kontinuerlig deriverbar funksjon. For et globalt
minimum trenger vi mer, for eksempel konveksitet på hele området.
Et negativt Hessian-ledd i vårt forsøk gjør også den kvadratiske
modellen ubegrenset nedenfra. Å halvere den uendrede Newton-retningen
er ikke en pålitelig reparasjon av en **oppadgående retning**.

**Overfør:** Hva ville en kode som bare stoppet ved liten gradientnorm
rapportert i origo? Hvilke to ekstra kontroller ville du bedt om?

## 10.3 Når hele Newton-steget ikke duger

<div id="uke10-demping"></div>

Vi kan først rette problemet med negativ krumning: løs
$(H+\lambda I)p=-g$, der $\lambda\geq0$ velges slik at matrisen
er SPD. Her velger vi minste egenverdi minst $0.25$, kun for dette
lille eksemplet. Det er **regularisering**, og endrer retningen.
Deretter prøver vi steglengder $\alpha=1,1/2,1/4,\ldots$ til en
tilstrekkelig reduksjon er oppnådd. Det er **demping**.

**Forutsi:** Med $x=(0.2,0)$ gir denne regelen $\lambda=3.77$,
$p=(3.072,0)$. Vil helt steg, halvt steg eller kvart steg bli
godkjent? Sammenlign faktiske $f$-verdier, ikke bare modellen.

```{pyodide-python}
#| label: week10-regularized-step
x = np.array([.2, 0.]); g, H = well_grad(x), well_hess(x)
lam = max(0., .25 - np.linalg.eigvalsh(H)[0])
p = np.linalg.solve(H + lam*np.eye(2), -g)
for a in [1., .5, .25]:
    print(f'alpha={a:g}: f={well(x+a*p):.6f}')
a, halvings = armijo(well, g, x, p)
print('lambda =', lam, 'g·p =', g @ p,
      'valgt alpha =', a, 'nytt x =', x+a*p)
```

Hele og halve steg øker her $f$; kvart steg gir $x=(0.968,0)$
og reduserer $f$ fra $0.9216$ til omtrent $0.00396$.
Koden godtar et steg når
$f(x+\alpha p)\leq f(x)+10^{-4}\alpha g^Tp$.
Fordi $g^Tp<0$, kreves en reell reduksjon. For en glatt funksjon
finnes et lite nok steg lokalt når $p$ er en nedgangsretning;
vårt begrensede søk kan likevel melde feil. Verdien $0.25$ er ikke
en universell regel: skalering, kostnaden for Hessian og valg av
regularisering må vurderes for et nytt problem.

Også en *positiv* Hessian kan gi et helt steg som mislykkes når
funksjonen bøyer seg bort fra modellen. Prøv den bøyde dalen
$q(u,v)=(1-u)^2+10(v-u^2)^2$, med minimum $q(1,1)=0$.

```{pyodide-python}
#| label: week10-backtrack-positive-hess
x = np.array([0., 0.]); g, H = valley_grad(x), valley_hess(x)
p = np.linalg.solve(H, -g)
a, halvings = armijo(valley, g, x, p)
print('H-egneverdier:', np.linalg.eigvalsh(H), 'p:', p)
print('q(x), q(x+p), q(x+alpha*p):', valley(x), valley(x+p), valley(x+a*p))
print('alpha:', a, 'halveringer:', halvings)
```

Her er $H=\operatorname{diag}(2,20)$ og $p=(1,0)$, men det hele
steget går fra $q=1$ til $q=10$. Linjesøket godtar $\alpha=1/2$;
den nye verdien er $q(0.5,0)=0.875$. SPD gjør retningen fallende
*nær startpunktet*, ikke nødvendigvis på hele veien.

Nær et stasjonært punkt med invertibel Hessian og lokalt Lipschitz-
kontinuerlig Hessian får **rene Newton-steg** lokal kvadratisk
konvergens: feilen i neste steg er høyst en konstant ganger
kvadratet av den nåværende feilen. Hvis Hessianen er SPD der,
er punktet et strengt lokalt minimum. For å bruke denne garantien
direkte på vår sikrede metode må linjesøket etter hvert godta
$\alpha=1$ **og** regulariseringen bli inaktiv ($\lambda=0$).
En fast positiv regularisering kan gjøre sluttfasen tregere.

<details class="reading-step"><summary>Gå i dybden: lokal fart og begrensninger</summary>

La $g(x_*)=0$ og $H(x_*)$ være invertibel. Når Hessianen er
Lipschitz-kontinuerlig i et område rundt $x_*$, og startpunktet er
tilstrekkelig nær, gir lineariseringens restledd en lokal feilgrense
$\|x_{k+1}-x_*\|\leq C\|x_k-x_*\|^2$ for rene Newton-steg.
Det er ikke en garanti fra enhver start. Ved et strengt lokalt
minimum med SPD-Hessian vil et vanlig Armijo-søk med liten nok
Armijo-konstant typisk kunne velge hele steg når vi kommer nær nok.
Å bygge og løse et Hessian-system kan koste mer per steg enn en
gradientoppdatering. En fast Hessian fra et tidlig steg sparer
faktorisering, men mister generelt denne lokale kvadratiske farten.

</details>

**Overfør:** Kan du forklare hvilken feil regularisering og
steglengde håndterer hver for seg?

## 10.4 Sammenlign og kontroller

<div id="uke10-scipy"></div>

SciPy har flere metoder i `scipy.optimize.minimize`. `BFGS` bygger
opp en krumningsmodell fra gradienter, mens `Newton-CG` kan bruke
vår Hessian. De implementerer mer enn de små forsøkene over; de er
ikke identiske med vår eksplisitte SPD-regularisering. Fra samme
start i den bøyde dalen: **forutsi** om færrest iterasjoner også
betyr minst arbeid. Kjør og les objektivverdi, gradientnorm og
funksjons-/gradient-/Hessian-evalueringer i tillegg til status.

```{pyodide-python}
#| label: week10-scipy-compare
for name, kwargs in [('BFGS', {}), ('Newton-CG', {'hess': valley_hess})]:
    res = minimize(valley, np.array([0., 0.]), jac=valley_grad,
                   method=name, options={'maxiter': 100}, **kwargs)
    print(name, 'success:', res.success, 'iter:', res.nit,
          'nfev:', res.nfev, 'njev:', res.njev,
          'nhev:', getattr(res, 'nhev', 0))
    print('  x:', np.round(res.x, 8), 'q:', f'{valley(res.x):.3e}',
          '||g||:', f'{np.linalg.norm(valley_grad(res.x)):.3e}')
```

Begge ender nær $(1,1)$ med liten verdi og liten gradient i dette
eksemplet. Antall *ytre* iterasjoner er ikke et tidsmål: en Newton-
iterasjon bruker krumningsinformasjon og kan ha indre lineære
løsninger; BFGS bruker gradienthistorikk. Et `success`-flagg
beskriver solverens stoppvilkår, ikke et bevis for globalt minimum.
Her kjenner vi global fasit separat fordi $q$ er en sum av
ikke-negative ledd og når null i $(1,1)$.

Når vi legger til lineære bibetingelser og et lineært mål, får vi
et annet slags problem. Da ligger optimum ofte på randen, og
$\nabla f=0$ er ikke lenger kontrollen vi skal bruke. Dette er
overgangen til [lineær optimering i uke 11](uke11.qmd).

## 10.5 Oppgaver, prosjekt og kilder

<div id="uke10-oppgaver"></div>

Regn først selv. Skriv eksakte uttrykk, for eksempel `1/2`, `u^2`
og `sqrt(2)`. For vektorer fyller du inn ett tall i hvert
komponentfelt.
Ingen avrunding er nødvendig.

::: {#uke10-exercise-context .math-exercise-context}

For $f(u,v)=(u^2-1)^2+v^2/2$ gjelder
$\nabla f=(4u(u^2-1),v)^T$ og
$H=\operatorname{diag}(12u^2-4,1)$. Et Newton-steg løser
$Hp=-\nabla f$ og setter $x_{+}=x+p$ når $H$ er invertibel.
Hvis Hessianen har både positiv og negativ egenverdi i et
stasjonært punkt, er dette et sadelpunkt.

:::

### Oppgave 1 – retning i en kvadratisk skål

```{math-exercise}
#| label: week10-task-quadratic
#| mode: equivalent
#| partial-credit: true
#| field-labels: p første komponent, p andre komponent, x1 første komponent, x1 andre komponent

La $A=\begin{bmatrix}3&0\\0&2\end{bmatrix}$, $b=(3,4)^T$ og
$f(x)=\tfrac12x^TAx-b^Tx$. Start i $x_0=(0,0)^T$. Finn Newton-retningen
ved å løse $Ap=-\nabla f(x_0)$ og punktet etter ett steg.

$p=$ vec[1,2]

$x_1=$ vec[1,2]
```

### Oppgave 2 – en annen type stasjonært punkt

```{math-exercise}
#| label: week10-task-saddle
#| context: uke10-exercise-context
#| mode: equivalent
#| partial-credit: true
#| field-labels: Gradient første komponent, Gradient andre komponent, Minste Hessian-egneverdi, Største Hessian-egneverdi

For $f(u,v)=(u^2-1)^2+v^2/2$: Finn gradienten i $(0,0)$ og
egenverdiene til Hessianen der, i stigende rekkefølge.

$\nabla f(0,0)=$ vec[0,0]

$\lambda_{\min}=$ __[-4], $\lambda_{\max}=$ __[1]
```

Begrunn klassifiseringen i egne notater.

### Oppgave 3 – Newton-steg med negativ krumning

```{math-exercise}
#| label: week10-task-direction
#| context: uke10-exercise-context
#| mode: equivalent
#| partial-credit: true
#| field-labels: Første komponent av p, Andre komponent av p, Gradienten prikk p

For $f(u,v)=(u^2-1)^2+v^2/2$: Start i $(1/2,0)$ og løs
$Hp=-\nabla f$ eksakt. Finn skalarproduktet mellom gradient og
retning.

$p=$ vec[-3/2,0]

$\nabla f\cdot p=$ __[9/4]
```

### Oppgave 4 – regularisert retning

```{math-exercise}
#| label: week10-task-regularize
#| context: uke10-exercise-context
#| mode: equivalent
#| partial-credit: true
#| field-labels: Første komponent av regularisert p, Andre komponent av regularisert p, Gradienten prikk p

For $f(u,v)=(u^2-1)^2+v^2/2$: I $(1/2,0)$, løs
$(H+2I)p=-\nabla f$. Finn retningen og $\nabla f\cdot p$
som eksakte tall.

$p=$ vec[3/2,0]

$\nabla f\cdot p=$ __[-9/4]
```

Arbeid videre med [prosjekt 10: startpunkt, skala og Newton](project_week10.qmd).

**Grunnlag i kalenderuke 43 (2025):** Gjøvik: [Newtons flervariabel
metode](https://wiki.math.ntnu.no/_media/imax3011/2025h/newtons_flervariabel_handout.pdf)
og [Newtons metode i optimering](https://wiki.math.ntnu.no/_media/imax3011/2025h/numeriske_metoder_-_newtons_metode.pdf).
Trondheim: [forelesning 19](https://wiki.math.ntnu.no/_media/imax3011/2025h/imat3011-forelesning19.pdf)
og [forelesning 20](https://wiki.math.ntnu.no/_media/imax3011/2025h/imat3011-forelesning20.pdf).
De siste forelesningssidene starter lineær optimering; vi bruker
overgangen her og arbeider med selve metoden i uke 11.

:::
