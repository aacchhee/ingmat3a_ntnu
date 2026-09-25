<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 11.0 Oversikt

<div id="uke11-start"></div>

### Hvor mye skal vi lage?

I [uke 8](uke8.qmd#uke8-modell) måtte antall maskiner være heltall.
Nå kan et verksted dele produksjonen i partier, og vi får et sammenhengende
område av tillatte valg. Vi vil gå fra modell og geometri til en beregnet
produksjonsplan, og deretter bevise at ingen annen plan er bedre. Til sist
bruker vi beviset til å verdsette en ekstra ressursenhet. I
[uke 6](uke6.qmd#uke6-retning) ga gradienten en lokal forbedringsretning;
her bestemmer ressursgrensene hvilke steg som faktisk er tillatt.

Etter uken skal du kunne oversette et ressursproblem til ulikheter, skille
**mulig løsning**, **optimal løsning**, **umulig problem** og **ubegrenset
problem**, formulere dualen til et maksimeringsproblem med $Ax\le b$,
og kontrollere en optimalverdi med primal og dual løsning. Du skal tolke
slakk og marginaler uten å forveksle fortegnet i SciPy med ressursens verdi.
I **Gå i dybden** finner du lengre regninger og avgrensninger.

## 11.1 Modell og mulig område

<div id="uke11-modell"></div>

Et verksted lager to delbare produktpartier, $x$ av type A og $y$ av
type B. Ett parti A gir 5 tusen kroner i dekningsbidrag og bruker 2 enheter
av første ressurs og 1 av andre. Ett parti B gir 4 tusen kroner og bruker
henholdsvis 1 og 2 enheter. Vi har 9 enheter av hver ressurs og kan
høyst lage 4 partier A. Anta at partier kan deles; hele partier krever en
annen modell.

**Forutsi:** Er $(4,1)$, $(3,3)$ eller $(0,4.5)$ best? Hvilke
begrensninger er aktive (holder med likhet) ved hvert punkt? Før vi velger, krever vi

\[
\max_{x,y}\; P=5x+4y
\quad\text{slik at}\quad
2x+y\le9,\quad x+2y\le9,\quad x\le4,\quad x,y\ge0.
\]

Punktene som oppfyller alle ulikhetene, er **mulige løsninger**; sammen
danner de det mulige området. Dette området er et **polyeder**, altså et
snitt av halvplan (områder på én side av en rett linje), eller halvrom
i flere dimensjoner; her er det en begrenset
polygon. En begrensning er **aktiv** når den holder med likhet. Dens
**slakk** for en $\le$-ulikhet er høyreside minus venstreside,
for eksempel $9-(2x+y)$;
slakken er null når grensen er aktiv. Vi tegner området og beregner
$P$ i alle hjørnene. Listen kan kontrolleres ved å løse par av
grenselikninger og forkaste skjæringspunkter som bryter andre krav.
Dette er **lineær programmering (LP)**: $P$ er lineær i variablene,
mens grensene kan skrives $a^Tz\le b$. Uttrykket $a^Tz-b$ er
**affint** når $b\ne0$ (lineært uttrykk pluss konstant); det er
fremdeles en LP, ikke et krumt problem.

```{pyodide-python}
#| label: week11-polygon
corners = np.array([[0.,0.], [4.,0.], [4.,1.], [3.,3.], [0.,4.5]])
profits = corners @ np.array([5.,4.])
for point, value in zip(corners, profits):
    print(f"({point[0]:g}, {point[1]:g}) -> {value:g} tusen kr")
fig, ax = plt.subplots()
ax.fill(*corners.T, alpha=.22, color="tab:blue", label="mulig område")
ax.plot(*np.vstack([corners,corners[0]]).T, color="tab:blue")
for point, value in zip(corners, profits):
    ax.annotate(f"{value:g}", point, xytext=(5,5), textcoords="offset points")
xx = np.linspace(0,4.8,100)
ax.plot(xx, (27-5*xx)/4, "--", color="tab:orange", label="P = 27")
ax.set(xlim=(0,4.8), ylim=(0,5.2), xlabel="A: x (partier)",
       ylabel="B: y (partier)")
ax.legend(); ax.set_aspect("equal"); plt.show()
```

Figuren gir målverdiene $0,20,24,27,18$ i oppført rekkefølge.
Dermed er $(3,3)$ best blant disse hjørnene, med 27 tusen kroner.
Linjen $5x+4y=27$ treffer området der de to ressursgrensene møtes.
**Hvorfor kan ikke et punkt midt i en kant gi mer enn begge endepunktene?**
Ethvert punkt i polygonet kan skrives som et veid gjennomsnitt av
hjørnene med ikke-negative vekter som summerer til 1. Fordi $P$ er
lineær, er verdien samme veide gjennomsnitt av hjørneverdiene og kan
derfor ikke overstige 27. Hjørnesammenligningen er et **globalt bevis**
for dette begrensede polygonet. En hel kant kan være optimal når
mållinjen følger kanten. Nedenfor bygger vi også et algebraisk bevis
som virker uten at vi må tegne alle punktene.

Dette forklarer også forskjellen fra [uke 8](uke8.qmd#uke8-lokalt)
og [uke 10](uke10.qmd#uke10-stasjonaer): $\nabla P=(5,4)$ er konstant
og Hessianen er null. Det finnes ikke et indre punkt med
$\nabla P=0$ å lete etter; et beste punkt kan ligge der en forbedrende
retning stoppes av aktive ressursgrenser. Et begrenset, ikke-tomt
polygon gir her et maksimum fordi det er lukket og begrenset, slik
kompakthetsargumentet i [uke 8](uke8.qmd#uke8-kompakt) tilsier.

<details class="reading-step">
<summary>Gå i dybden: hjørner, standardformer og når påstanden trenger forbehold</summary>

Grensene $2x+y=9$ og $x+2y=9$ gir $x=y=3$.
På $x=4$ gir første ressurs $y\le1$, og på $x=0$ gir andre
ressurs $y\le4.5$. Disse sammen med origo gir polygonet i figuren.
Et vilkårlig indre punkt kan flyttes langs en linje i en retning der
målet ikke avtar, til en grense nås; derfra kan vi gjøre det samme langs
en kant. Dette argumentet bruker et begrenset område med hjørner.
**Simpleksmetoden** utnytter dette i større LP-er ved å gå mellom
nabohjørner langs kanter som forbedrer målet. Vi regner ikke
simplekstabeller her; de er ikke nødvendige for å formulere og
kontrollere vår produksjonsmodell.
Et ubundet mulig område kan likevel ha et endelig minimum, og et LP
uten hjørner kan ha et endelig optimum. Ikke påstå at *alle*
optimum nødvendigvis er hjørner.

En vanlig positiv-variabel-form er $\max p^Tz$ slik at $Az\le b$
og $z\ge0$. SciPy bruker $\min c^Tz$, $A_{ub}z\le b_{ub}$,
eventuelt $A_{eq}z=b_{eq}$, og egne grenser på variablene.
En $\ge$-ulikhet snus ved å multiplisere **begge sider** med $-1$;
en fri variabel kan skrives som differansen av to ikke-negative.
Likninger kan legges inn direkte med `A_eq` og `b_eq`.
Med slakkvariabelen $s=b-Az\ge0$ kan $Az\le b$ også skrives som
likningen $Az+s=b$. Hvilken form som kalles «standard», avhenger av
konteksten.

</details>

## 11.2 Løs, og undersøk resultatet

<div id="uke11-linprog"></div>

`linprog` fra `scipy.optimize` løser en **minimering** av $c^Tz$.
Oppsettet øverst på siden importerer `numpy as np`,
`matplotlib.pyplot as plt` og `linprog`; du kan kjøre rutene nedenfor
fortløpende. Vi legger $z=(x,y)$, $p=(5,4)$,
$A=\left(\begin{smallmatrix}2&1\\1&2\\1&0\end{smallmatrix}\right)$
og $b=(9,9,4)$ i arrayer. `A_ub=A, b_ub=b` betyr $Az\le b$,
én begrensning per rad. Fordi vi vil **maksimere** $p^Tz$, sender vi
`-p` som $c$. `bounds=(0,None)` betyr nedre grense 0 og ingen øvre
grense for **hver** av de to variablene; kravet $x\le4$ ligger i
matrisen. `method="highs"` velger LP-løseren HiGHS.
**Forutsi:** Hva blir fortegnet på `result.fun`, og hvilke av de tre
slakkene $b-Az$ blir null?

```{pyodide-python}
#| label: week11-highs
p = np.array([5.,4.])
A = np.array([[2.,1.], [1.,2.], [1.,0.]])
b = np.array([9.,9.,4.])
result = linprog(-p, A_ub=A, b_ub=b, bounds=(0,None), method="highs")
print("status:", result.status, result.message)
if result.status == 0:
    print("partier:", result.x, "fortjeneste:", -result.fun)
    print("slakk b-Az:", b-A@result.x)
    print("største brudd:",
          max(0., float(np.max(A@result.x-b)), float(-np.min(result.x))))
```

`result.status==0` og `result.success` angir at løseren meldte
vellykket avslutning; først da leser vi `result.x` (planen) og
`result.fun` (minimumet av $-P$). Status 2 betegner et umulig problem,
status 3 et ubegrenset problem. `result.message` utdyper statusen.
Status 0 gir $z=(3,3)$, $P=27$, slakk $(0,0,1)$ og største
brudd 0 innenfor avrunding. De to ressursene er fullt utnyttet;
grensen $x\le4$ har én enhet igjen. `result.fun=-27` er verdien
av funksjonen SciPy faktisk minimerte. Ved større problemer må vi
tolke små residualer mot solverens toleranser, ikke kreve eksakt null
av flyttall. Et `success`-flagg alene er heller ikke et håndfast
sertifikat for vår opprinnelige modell: kontroller fortegn, variabelgrenser,
mulighet og målet.

Hva betyr det at metoden **ikke** finner et optimum? Prøv to små
modeller og les status før du prøver å bruke `x` eller `fun`.
Den første krever samtidig $t\le1$ og $t\ge2$. Den andre maksimerer
$t$ med bare $t\ge0$.

```{pyodide-python}
#| label: week11-status
impossible = linprog([1.], A_ub=[[1.],[-1.]], b_ub=[1.,-2.],
                     bounds=(0,None), method="highs")
unbounded = linprog([-1.], bounds=(0,None), method="highs")
print("umulig:", impossible.status, impossible.message)
print("ubegrenset:", unbounded.status, unbounded.message)
```

HiGHS rapporterer vanligvis status 2 for et **umulig** problem og
status 3 for et **ubegrenset** mål. Fravær av mulige punkter og
fravær av en endelig beste verdi er forskjellige ting. Solverens
status gjelder modellen du skrev inn; en feil i modelleringen blir
ikke reparert av algoritmen.

## 11.3 Priser som beviser optimum

<div id="uke11-dual"></div>

Vi vil bevise at ingen mulig plan kan tjene over 27, også uten å
tegne polygonet. Den opprinnelige maksimeringen kalles **primalen**.
Sett ikke-negative priser $q=(u,v,w)$ (tusen kroner per enhet av
den tilsvarende kapasiteten)
på begrensningene
$2x+y\le9$, $x+2y\le9$, $x\le4$. Hvis den samlede prisen på
ressursene som ett parti A bruker minst er 5, og prisen på ressursene
for B minst er 4, får vi et øvre bound:

\[
2u+v+w\ge5,\qquad u+2v\ge4
\quad\Longrightarrow\quad
5x+4y\le(2u+v+w)x+(u+2v)y\le9u+9v+4w.
\]

Den første ulikheten bruker $x,y\ge0$; den andre bruker
ressursgrensene og $u,v,w\ge0$. Dette er **svak dualitet**:
enhver mulig produksjonsplan gir et nedre anslag på beste
fortjeneste, og enhver **dual mulig** prisvektor (en som oppfyller
priskravene over) gir et øvre anslag. Problemet med å finne det
beste, laveste øvre anslaget kalles **dualen**.
**Forutsi:** Kan $u=2,v=1,w=0$ bevise at planen fra forsøket er best?

```{pyodide-python}
#| label: week11-certificate
z = np.array([3.,3.])
prices = np.array([2.,1.,0.])
print("Primal mulig:", np.all(A@z <= b+1e-9), np.all(z >= -1e-9))
print("Dual mulig:", np.all(A.T@prices >= p-1e-9),
      np.all(prices >= -1e-9))
print("Målverdier:", p@z, b@prices)
print("Ressursslakk:", b-A@z, "produktoverskudd:", A.T@prices-p)
```

Begge målverdiene er 27. Enhver mulig plan har verdi høyst 27,
mens $z=(3,3)$ oppnår 27. Vi har dermed bevist optimalitet.
Likhet i de to ulikhetene i beviset krever at en positiv
ressurspris ledsages av null slakk: $q_i(b_i-(Az)_i)=0$.
For et produsert produkt må tilsvarende prisen på innsatsfaktorene
treffe fortjenesten: $z_j((A^Tq)_j-p_j)=0$. Dette kalles
**komplementær slakk**. Her er $w=0$ og $4-x=1$; $x,y>0$ og
produktprisene er nøyaktig 5 og 4. **Overføring:** Hvorfor må en
pris være null ved optimalitet når den tilhørende begrensningen har
positiv slakk?

Generelt gir et primalproblem $\max p^Tz$ med $Az\le b, z\ge0$
dualproblemet
\[
\min_{q\ge0} b^Tq \quad\text{slik at}\quad A^Tq\ge p.
\]
Når begge har mulige løsninger og et endelig optimum, er de beste
målverdiene like (**sterk dualitet**). Vi trenger ikke forutsette
sterk dualitet for å verifisere akkurat dette talleksemplet: vi har
vist en mulig løsning på hver side med samme verdi.

<details class="reading-step">
<summary>Gå i dybden: dualitetsgap og komplementær slakk</summary>

Trekk den primale verdien fra det duale boundet. For mulige $z,q$:
\[
b^Tq-p^Tz
=q^T(b-Az)+z^T(A^Tq-p)\ge0.
\]
Begge ledd er summer av ikke-negative produkter. Gapet er null
akkurat når hvert slikt produkt er null. Derfor gjelder ved optimum
$q_i(b_i-(Az)_i)=0$ for hver ressurs og
$z_j((A^Tq)_j-p_j)=0$ for hvert produkt.
En bindende begrensning kan likevel ha pris null ved degenerasjon;
«aktiv» betyr ikke automatisk «strengt positiv pris».

For en primal **maksimering** bytter dualvariabelen fortegn når en
primal rad snus: en $\le$-rad gir dualvariabel $\ge0$,
en $\ge$-rad gir $\le0$, og en likningsrad gir fri
dualvariabel. På kolonnesiden gir $z_j\ge0$ en dual
$\ge p_j$-ulikhet; en fri $z_j$ gir likhet. Dette følger av
samme øvre-bound-regning når radene og variablene får andre
fortegnsbetingelser. Vi bruker bare $Az\le b, z\ge0$
i hovedforsøket.

Vi kan også regne ut prisene her. Begge produktene er produsert i
positivt antall, så $2u+v+w=5$ og $u+2v=4$.
Tredje begrensning har slakk, så $w=0$. Løsningen er $u=2,v=1$.
Denne beregningen forklarer tallene i sertifikatet; den erstatter
ikke kontrollen av at alle primal- og dualulikheter holder.

</details>

## 11.4 Hva er én ekstra ressurs verdt?

<div id="uke11-sensitivitet"></div>

Vi gir første ressurs $\Delta$ flere enheter. Prisvektoren
$(2,1,0)$ gir da boundet $27+2Δ$. Hvis de samme to
ressursgrensene fortsatt møtes i et mulig punkt, blir dette også
fortjenesten. **Forutsi:** Vil samme økning på 2 tusen kroner per
ekstra ressursenhet gjelde for både $Δ=0.5$ og $Δ=2$?

```{pyodide-python}
#| label: week11-marginals
for delta in (0., .5, 2.):
    changed = b.copy()
    changed[0] += delta
    trial = linprog(-p, A_ub=A, b_ub=changed,
                    bounds=(0,None), method="highs")
    if trial.status == 0:
        print(f"Δ={delta:g}: z={trial.x}, P={-trial.fun:g}, "
              f"lineært anslag={27+2*delta:g}, "
              f"slakk={changed-A@trial.x}")
print("SciPy-marginaler for minimeringsmålet:", result.ineqlin.marginals)
```

Ved $Δ=0.5$ blir fortjenesten 28, akkurat som anslaget.
Ved $Δ=2$ blir den 30, mens den uendrede dualprisen bare
gir et bound på 31: tredje begrensning begynner å binde.
`result.ineqlin.residual` er de tre slakkene $b-Az$,
og `result.ineqlin.marginals` er omtrent $(-2,-1,0)$.
En **marginal** er den lokale endringen i optimal målverdi når
en høyreside økes litt, mens de øvrige dataene holdes fast. SciPy oppgir
derivert av **minimeringsverdien** $-P_*$ med hensyn til
høyresiden. For vårt maksimeringsmål er den lokale
ressursverdien derfor motsatt fortegn: $(2,1,0)$.
Dette er et lokalt utsagn, ikke en lov for vilkårlig store endringer.

Hvis vi holder de første to begrensningene aktive, gir likningene
$x=3+2Δ/3$, $y=3-Δ/3$. Kravene $x,y\ge0$ og $x\le4$
gir $-4.5\leΔ\le1.5$. I akkurat dette intervallet er
planen mulig og dualprisen fortsatt mulig, så verdien er
**eksakt** $27+2Δ$. Ved endepunktene kan flere
begrensninger bli aktive. **Overføring:** Hvorfor gir en pris på null
for $x\le4$ mening før kapasiteten er brukt opp, men ikke
nødvendigvis etterpå?

<details class="reading-step">
<summary>Gå i dybden: flere optimale planer og hele partier</summary>

Hvis målet er parallelt med en aktiv kant, kan alle punkter på et
kantstykke gi samme optimum. For eksempel gir $P=2x+y$ på området
$2x+y\le9, x,y\ge0$ verdien 9 langs hele kanten fra
$(0,9)$ til $(4.5,0)$. En solver returnerer én optimal plan,
ikke en uttømmende liste over alle.

Hvis partier må være hele, er vår kontinuerlige modell en
*relaksasjon*: dens maksverdi er et øvre bound for heltallsproblemet.
I vårt basistilfelle er $(3,3)$ allerede en heltallsplan, men
etter en kapasitetsendring kan løsningene være brøker. Et tall fra
den kontinuerlige modellen kan da ikke ukritisk brukes som
gjennomførbar produksjonsplan.

</details>

## 11.5 Øv selv og arbeid videre

<div id="uke11-oppgaver"></div>

Bruk den samme modellen som i 11.1–11.4. Svar med eksakte tall eller
brøker der det er mulig. Disse oppgavene krever ikke Python.

::: {#week11-exercise-context .math-exercise-context}

La $z=(x,y)\ge0$, $p=(5,4)$,
$A=\begin{bmatrix}2&1\\1&2\\1&0\end{bmatrix}$ og
$b=(9,9,4)$. Primalen maksimerer $p^Tz$ med $Az\le b$.
Dualen minimerer $b^Tq$ med $A^Tq\ge p, q\ge0$.
Slakk er $b-Az$. En primal og en dual mulig løsning med lik verdi
sertifiserer optimum ved svak dualitet.

:::

### Oppgave 1 – oversett en plan

```{math-exercise}
#| label: week11-task-slack
#| context: week11-exercise-context
#| caption: Slakk og fortjeneste
#| mode: equivalent
#| partial-credit: true
#| field-labels: slakk ressurs 1, slakk ressurs 2, slakk A-grense, fortjeneste

Sett $z=(4,1)$. Finn slakk på de to ressursene og grensen på A,
og beregn fortjenesten. Oppgi slakkene i oppført rekkefølge.

Slakk: vec[0,3,0] &nbsp; Fortjeneste: __[24]
```

### Oppgave 2 – lag et bound

```{math-exercise}
#| label: week11-task-bound
#| context: week11-exercise-context
#| caption: Et dualt sertifikat
#| mode: equivalent
#| partial-credit: true
#| field-labels: dual kostnad, pris på A, pris på B

Bruk $q=(2,1,0)$. Finn kostnaden $b^Tq$ og prisene $A^Tq$
på ett parti av hver produkttype. Skriv prisene som en vektor.

Kostnad: __[27] &nbsp; Produktpriser: vec[5,4]
```

### Oppgave 3 – ny kapasitet

```{math-exercise}
#| label: week11-task-perturb
#| context: week11-exercise-context
#| caption: Nytt skjæringspunkt
#| mode: equivalent
#| partial-credit: true
#| field-labels: nye partier A, nye partier B, ny fortjeneste

Øk bare høyresiden i første ressursulikhet fra 9 til 10. Anta at
de to ressursulikhetene fortsatt holder med likhet. Løs dem for
ny produksjonsplan og beregn fortjenesten. Bruk brøk for $x,y$.

Plan: vec[11/3,8/3] &nbsp; Fortjeneste: __[29]
```

### Oppgave 4 – når slutter anslaget?

```{math-exercise}
#| label: week11-task-range
#| context: week11-exercise-context
#| caption: Gyldig marginalpris
#| mode: equivalent
#| field-labels: største kapasitetsøkning

Sett $b_1=9+Δ$, mens de øvrige høyresidene er uendret.
Ved de to aktive ressurslikningene får vi
$x=3+2Δ/3, y=3-Δ/3$. Finn den **største**
verdien av $Δ\ge0$ som fortsatt oppfyller $x\le4$.
Skriv svaret eksakt.

Δ = __[3/2]
```

I [prosjektet](project_week11.qmd) undersøker du et større
produksjonsvalg der du må begrunne hvilke kapasitetsendringer en
ressurspris faktisk kan brukes for.

### Kort oppslag: `linprog`

| Skriv/les | Betydning i dette eksemplet |
|:--|:--|
| `from scipy.optimize import linprog` | Importen finnes i oppsettet over. |
| `linprog(-p, A_ub=A, b_ub=b, bounds=(0,None), method="highs")` | Minimer $-p^Tz$ under $Az\le b$ og $z\ge0$. Med likninger brukes `A_eq`, `b_eq`. |
| `bounds=(0,None)` | Bruker samme nedre grense 0 for alle variabler; `None` betyr ingen øvre grense. Ulike grenser kan gis per variabel, for eksempel `[(0,4),(0,None)]` for $x,y$. |
| `result.success`, `result.status`, `result.message` | Les løserens status først; 0 er vellykket, 2 er umulig, 3 er ubegrenset. |
| `result.x`, `result.fun` | Les ved vellykket status: variabler og verdi av **minimeringsmålet**. Vår fortjeneste er `-result.fun`. |
| `result.ineqlin.residual`, `result.ineqlin.marginals` | Slakk og lokal verdifølsomhet for hver `A_ub`-rad. Her er marginalene negative fordi målet er $-P$; ressursprisene for $P$ får motsatt fortegn. |

I [uke 12](uke12.qmd) bruker vi samme spørsmål om tillatte
retninger og bevis for optimalitet når begrensningene er krumme.

:::
