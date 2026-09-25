<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 10.0 Oversikt

<div id="uke10-start"></div>

### Fra gradient til lokal krumning

I [uke 6](uke6.qmd#uke6-energi) løste vi et kvadratisk minimum ved et
lineært system. I [uke 8](uke8.qmd#uke8-hessian) brukte vi gradient og
Hessian til å undersøke *hvilken type punkt* et søk hadde funnet. I
[uke 9](uke9.qmd#uke9-gradient) valgte vi retning fra gradienten og
sjekket steglengden mot de faktiske funksjonsverdiene. Nå bruker vi også
**krumningen akkurat der vi står** til å foreslå retningen. Newtons
metode forsøker å løse $\nabla f(x)=0$ ved en lokal tilnærming. Først
viser samme kvadratikk fra uke 6 hvorfor tilnærmingen kan være eksakt.
Deretter møter vi to ikke-kvadratiske problemer: en stasjonær kandidat
som er feil mål, og en god retning med for langt steg. Slik blir
regularisering og demping svar på to forskjellige problemer.

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
Dette er ingen tilstrekkelig test, slik vi så i uke 8. I
[uke 2](page4.qmd) brukte vi Newton på en skalar likning. For en
vektorfunksjon $g=(g_1,g_2)^T$ betyr **Jacobimatrisen** $J_g$ matrisen
der post $(i,j)$ er den partiellderiverte $\partial g_i/\partial x_j$.
Når $g=\nabla f$, er denne matrisen nettopp **Hessianen**:

$$H_f(x)=J_g(x)=\nabla^2 f(x)=
\begin{bmatrix}f_{uu}(x)&f_{uv}(x)\\f_{vu}(x)&f_{vv}(x)\end{bmatrix}.$$

For en to ganger kontinuerlig deriverbar funksjon er de blandede
deriverte like, så Hessianen er symmetrisk. Den beskriver hvordan
gradienten endrer seg. Den lokale andreordensmodellen fra
[uke 8](uke8.qmd#uke8-hessian) er

$$m_x(p)=f(x)+g(x)^Tp+\tfrac12p^TH(x)p.$$

Hvis $H(x)$ er positiv definit (SPD), har denne kvadratiske modellen
ett minimum. Modellens gradient med hensyn til $p$ er $g(x)+H(x)p$;
dermed fås **Newton-retningen** ved å løse

$$H(x_k)p_k=-g(x_k),\qquad x_{k+1}=x_k+p_k.$$

Dette er også Newton-lineariseringen $g(x+p)\approx g(x)+H(x)p$ av
stasjonslikningen. Vi løser det lineære systemet med
`np.linalg.solve(H, -g)`; vi beregner ikke $H^{-1}$ eksplisitt.
Når $H$ er SPD og $g\ne0$,
gir $g^Tp=-p^THp<0$, så retningen er lokalt nedgående. Hele steget må
fortsatt kontrolleres mot den virkelige funksjonen.

**Forutsi:** For kvadratikken $\phi(x)=\tfrac12x^TAx-b^Tx$ med
$A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$ og $b=(5,5)^T$ fra uke 6:
hvor mange Newton-steg trengs fra en vilkårlig start for å nå $(1,2)$?

```{pyodide-python}
#| label: week10-quadratic-step
A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 5.])
x = np.array([-2., 3.])
g = A @ x - b
p = np.linalg.solve(A, -g)  # Løs Ap = -g, ikke beregn en invers.
print('g(x0) =', g, 'p =', p)
print('x1 =', x+p, '||g(x1)|| =', np.linalg.norm(A @ (x+p)-b))
```

Her er $g(x_0)=(-8,-1)^T$, $p=(3,-1)^T$ og $x_1=(1,2)^T$;
gradientnormen er null (innen flyttallspresisjon). **Hvorfor** er
dette mer enn et heldig startpunkt? For denne kvadratiske funksjonen
er $g(x)=Ax-b$ og $H(x)=A$ overalt. Den lokale modellen $m_x(p)$ er
hele funksjonen $\phi(x+p)$, ikke bare en tilnærming, og
$g(x+p)=g(x)+Ap=0$. Siden $A$ er SPD, er dette også det unike globale
minimumet. For en ikke-kvadratisk funksjon endrer $H$ seg med $x$.
Da må vi beregne retningen på nytt, og et helt steg kan være for langt.

<details class="reading-step"><summary>Gå i dybden: hvorfor er retningen fallende ved positiv Hessian?</summary>

For en SPD-Hessian er $p=-H^{-1}g$ godt definert matematisk, selv om
koden løser systemet direkte. Setter vi $Hp=-g$ inn i modellen, blir
$m_x(p)-m_x(0)=g^Tp+\tfrac12p^THp=-\tfrac12p^THp<0$ når $g\ne0$.
Dette gjelder modellens verdi ved $p$. For den virkelige funksjonen
gir $g^Tp<0$ garantert reduksjon bare ved tilstrekkelig små positive
steg; et stort steg kan forlate området der modellen er god.

</details>

**Overfør:** Hvilket ledd i argumentet for ett steg forsvinner hvis
$H$ varierer mellom $x$ og $x+p$?

## 10.2 Stasjonær er ikke det samme som minimal

<div id="uke10-stasjonaer"></div>

La $f(u,v)=(u^2-1)^2+v^2/2$. De to punktene $(\pm1,0)$ har
funksjonsverdi null og er globale minima siden begge ledd er
ikke-negative. Her er

$$g(u,v)=\begin{bmatrix}4u(u^2-1)\\v\end{bmatrix},\qquad
H(u,v)=\begin{bmatrix}12u^2-4&0\\0&1\end{bmatrix}.$$

Oppsettet definerer `well(x)`, `well_grad(x)` og `well_hess(x)` for
disse tre uttrykkene; hver tar vektoren `x = [u, v]` og returnerer
henholdsvis ett tall, en vektor og en $2\times2$-matrise.
Men $(0,0)$ er også stasjonært. **Forutsi:** Hva gjør
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

Vi kan først rette problemet med negativ krumning. La $I$ være
identitetsmatrisen (`np.eye(2)` i kode); løs så
$(H+\lambda I)p=-g$, der $\lambda\geq0$ velges slik at matrisen er SPD.
Når vi legger til $\lambda I$, øker hver egenverdi til $H$ med
$\lambda$. Hvis $\lambda_{\min}$ er den minste egenverdien, gir
$\lambda=\max(0,0.25-\lambda_{\min})$ derfor minste egenverdi minst
$0.25$ i dette lille eksemplet. Det er **regularisering**, og endrer
retningen.
Deretter prøver vi steglengder $\alpha=1,1/2,1/4,\ldots$ til en
tilstrekkelig reduksjon er oppnådd. Det er **demping**. Vi bruker
Armijo-testen fra [uke 9](uke9.qmd#uke9-gradient), nå for en generell
retning $p$: $f(x+\alpha p)\leq f(x)+10^{-4}\alpha g^Tp$. Den krever
$g^Tp<0$. Hvis $g^Tp>0$, øker funksjonen langs alle tilstrekkelig
små positive steg, så halvering gir ingen garanti for nedgang.
Oppsettets `armijo(f, g, x, p)` tar selve funksjonen, gradientvektoren,
startpunktet og retningen; den returnerer godkjent $\alpha$ og antall
halveringer, eller melder feil ved manglende nedgang innen budsjettet.

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
Fordi $g^Tp<0$, kreves en reell reduksjon. For en glatt funksjon
finnes et lite nok steg lokalt når $p$ er en nedgangsretning;
vårt begrensede søk kan likevel melde feil. Verdien $0.25$ er ikke
en universell regel: skalering, kostnaden for Hessian og valg av
regularisering må vurderes for et nytt problem.

Også en *positiv* Hessian kan gi et helt steg som mislykkes når
funksjonen bøyer seg bort fra modellen. Prøv den bøyde dalen
$q(u,v)=(1-u)^2+10(v-u^2)^2$, med minimum $q(1,1)=0$.
Gradienten er $(2(u-1)-40u(v-u^2),\ 20(v-u^2))^T$, og Hessianen er
$\begin{bmatrix}2-40v+120u^2&-40u\\-40u&20\end{bmatrix}$.
Oppsettet kaller disse `valley`, `valley_grad` og `valley_hess`, med
samme inndata og utdatatypene som for dobbeltbrønnen.
**Forutsi:** I startpunktet er Hessianen SPD, så modellen har et
minimum langs Newton-retningen. Ligger det foreslåtte punktet også
lavere på den *virkelige* bøyde dalen? Sammenlign fullstegbanen og
Armijo-banen på nivåkurvene. Nederst sammenligner vi modellen og den
virkelige funksjonen langs den første retningen.

```{pyodide-python}
#| label: week10-backtrack-positive-hess
x = np.array([0., 0.]); g, H = valley_grad(x), valley_hess(x)
p = np.linalg.solve(H, -g)
a, halvings = armijo(valley, g, x, p)
print('H-egneverdier:', np.linalg.eigvalsh(H), 'p:', p)
print('q(x), q(x+p), q(x+alpha*p):', valley(x), valley(x+p), valley(x+a*p))
print('alpha:', a, 'halveringer:', halvings)

def newton_path(damped, n):
    point = np.array([0., 0.])
    points = [point.copy()]
    for k in range(n):
        grad, hess = valley_grad(point), valley_hess(point)
        direction = np.linalg.solve(hess, -grad)
        step = armijo(valley, grad, point, direction)[0] if damped else 1.
        point = point + step*direction
        points.append(point.copy())
    return np.array(points)

full_path = newton_path(damped=False, n=2)
damped_path = newton_path(damped=True, n=5)
fig, (ax_map, ax_line) = plt.subplots(2, 1, figsize=(6.5, 9))
u, v = np.meshgrid(np.linspace(-.1, 1.2, 180), np.linspace(-.2, 1.2, 180))
q_grid = (1-u)**2 + 10*(v-u*u)**2
ax_map.contour(u, v, q_grid,
               levels=[.001, .01, .05, .1, .25, .5, 1, 2, 5, 10],
               colors='#adb5bd', linewidths=.8)
for name, points, color in [('full Newton', full_path, '#b5483f'),
                            ('Armijo-dempet', damped_path, '#1665ad')]:
    ax_map.plot(points[:, 0], points[:, 1], 'o-', color=color,
                markersize=4, linewidth=1.5, label=name)
ax_map.plot(0, 0, 'ks', markersize=6, label='start k=0')
ax_map.plot(1, 1, 'k*', markersize=11, label='q=0')
ax_map.annotate('full: k=1, q=10', (1, 0), xytext=(-130, 45),
                textcoords='offset points', color='#92392f', fontsize=8,
                arrowprops={'arrowstyle': '-', 'color': '#92392f'})
ax_map.annotate('dempet: k=1, q=0.875', (.5, 0), xytext=(5, -29),
                textcoords='offset points', color='#14517f', fontsize=8,
                arrowprops={'arrowstyle': '-', 'color': '#14517f'})
ax_map.set(xlim=(-.1, 1.2), ylim=(-.2, 1.2), xlabel='u', ylabel='v',
           title='Baner over nivåkurvene til faktisk q')
ax_map.set_aspect('equal'); ax_map.legend(fontsize=8, loc='upper left')

alpha_grid = np.linspace(0, 1.1, 180)
actual = np.array([valley(x+t*p) for t in alpha_grid])
model = valley(x) + alpha_grid*(g @ p) + .5*alpha_grid**2*(p @ H @ p)
ax_line.plot(alpha_grid, actual, color='#34495e', label='faktisk q(x+αp)')
ax_line.plot(alpha_grid, model, '--', color='#9262a4',
             label='lokal modell mₓ(αp)')
ax_line.plot([a, 1], [valley(x+a*p), valley(x+p)], 'ko', markersize=4)
ax_line.set(xlabel='Faktor α langs første Newton-retning',
            ylabel='Verdi', title='Modellen undervurderer hele steget')
ax_line.legend(fontsize=8)
fig.tight_layout(); plt.show()
```

Her er $H=\operatorname{diag}(2,20)$ og $p=(1,0)$, men det hele
steget går fra $q=1$ til $q=10$. Linjesøket godtar $\alpha=1/2$;
den nye verdien er $q(0.5,0)=0.875$. SPD gjør retningen fallende
*nær startpunktet*, ikke nødvendigvis på hele veien. I øvre figur går
full Newton først til modellens foreslåtte bunn $(1,0)$ og øker $q$;
neste steg når $(1,1)$. Den dempede banen avviser første fullsteg,
velger $(0.5,0)$ og senker $q$ videre i fem aksepterte steg. I nedre
figur er første kvadratiske modell $m_x(\alpha p)=(1-\alpha)^2$,
mens den faktiske verdien langs samme linje er
$q(\alpha,0)=(1-\alpha)^2+10\alpha^4$. Differansen kommer fra
den bøyde dalen som andreordensmodellen ved start ikke fanger opp.
Krumning velger retningen; demping velger hvor langt vi følger den.

En Hessian er **lokalt Lipschitz-kontinuerlig** nær $x_*$ hvis den ikke
endrer seg raskere enn en fast konstant ganger avstanden: det finnes
$L$ slik at $\|H(x)-H(y)\|\le L\|x-y\|$ for nærliggende $x,y$.
Når $x_*$ er stasjonært, $H(x_*)$ er invertibel, Hessianen har denne
egenskapen og starten er tilstrekkelig nær $x_*$, får **rene
Newton-steg** lokal kvadratisk konvergens: feilen i neste steg er
høyst en konstant ganger kvadratet av den nåværende feilen.
Hvis Hessianen er SPD ved $x_*$, er punktet et strengt lokalt
minimum. For å bruke samme lokale garanti på vår sikrede metode
må linjesøket etter hvert godta $\alpha=1$ **og** regulariseringen
bli inaktiv ($\lambda=0$). En fast positiv regularisering kan
gjøre sluttfasen tregere.

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

SciPy-rutinen `minimize` fra [uke 8](uke8.qmd#uke8-scipy) tar en
mål-funksjon av vektoren $x$, startpunktet `x0` og en valgt metode.
`jac=valley_grad` gir den analytiske gradientfunksjonen (SciPy kaller
argumentet `jac`), og `hess=valley_hess` gir Hessianen når metoden
trenger den. `BFGS` bygger en tilnærming til krumning fra endringer i
gradienten, så vi slipper å gi Hessianen. `Newton-CG` bruker Hessianen
til å beregne en Newton-liknende retning ved en indre iterasjon, og
kan bruke et linjesøk for steget. De implementerer mer enn forsøkene
over; ingen av dem er identisk med vår eksplisitte SPD-regularisering.
Fra samme start i den bøyde dalen: **forutsi** om færrest ytre
iterasjoner også betyr minst arbeid. Vi bruker `options={'maxiter':
100}` som øvre grense og leser både verdi, gradient og antall
funksjons-/gradient-/Hessian-evalueringer.

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

**SciPy-huskelapp for dette forsøket.**

| Del | Bruk her |
|:--|:--|
| Import og kall | `from scipy.optimize import minimize` (gjort i oppsettet); `minimize(fun, x0, jac=grad, method='BFGS')` tar mål, start og gradient. |
| Krumningsmetode | `method='Newton-CG'` med `hess=H` bruker også Hessianen. |
| Stoppvalg | `options={'maxiter': 100}` begrenser ytre iterasjoner i koden. `gtol` er en valgfri gradientnormtoleranse for BFGS, mens `xtol` er en valgfri relativ løsningstoleranse for Newton-CG; de er ikke satt i dette forsøket. |
| Resultat | `res.x` er punktet, `res.fun` verdien, `res.success` rutines stoppstatus, `res.nit` ytre iterasjoner. `res.nfev`, `res.njev`, `res.nhev` teller mål-, gradient- og Hessian-kall når feltene finnes. |

Evaluer selv $\|\nabla f(\texttt{res.x})\|$ og spør hva som eventuelt
beviser globalitet. `np.linalg.solve(H, -g)` i de små forsøkene løser
$Hp=-g$ direkte; `minimize` håndterer en hel serie slike oppdateringer.

Når vi legger til lineære bibetingelser og et lineært mål, får vi
et annet slags problem. Da ligger optimum ofte på randen, og
$\nabla f=0$ er ikke lenger kontrollen vi skal bruke. Dette er
overgangen til [lineær optimering i uke 11](uke11.qmd).

## 10.5 Oppgaver og prosjekt

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

:::
