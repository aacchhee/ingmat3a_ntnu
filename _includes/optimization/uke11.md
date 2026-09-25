<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 11.0 Oversikt

<div id="uke11-start"></div>

### En produksjonsplan og en garanti

I [uke 8](uke8.qmd#uke8-modell) talte vi opp hele maskiner. Nå lager et verksted produktpartier som kan deles opp: $2.5$ partier er to hele partier og et halvt. Vi tegner de tillatte planene, finner den beste og kontrollerer den med en ressursregning som setter en øvre grense for *alle* planer. Til sist undersøker vi hva mer kapasitet kan være verdt.

### Læringsmål

Etter denne uken skal du kunne

- oversette en produksjonstabell til et lineært mål og ressursulikheter og finne ubrukt kapasitet for en plan,
- bruke hjørner og mållinjer til å finne og begrunne en beste plan i to variabler,
- prissette ressursene for å gi en øvre grense og bevise optimalitet når en plan oppnår grensen,
- tolke verdien av en liten kapasitetsendring og undersøke når den gamle prisen slutter å gi den nye optimalverdien,
- kode modellen med `linprog`, sjekke løserens status og kontrollere resultatet mot kravene.

I 11.1–11.4 følger vi ett verksted. Regneoppgavene i 11.5 og kodeoppgavene i 11.6 bruker samme tall. **Gå i dybden** åpner lengre begrunnelser.

## 11.1 Fra tabell til tillatt område

<div id="uke11-modell"></div>

### Modellen: to produkter og to typer timer

Verkstedet produserer partier av A og B. **Dekningsbidrag** betyr salgsinntekt minus kostnadene som følger produksjonen, for eksempel materialer; her måles det i tusen kroner per parti. Vi antar at hele produksjonen blir solgt, at timer kan fordeles på delbare partier, og at tabellens tall er konstante i denne perioden.

| Produkt | Maskintimer per parti | Arbeidstimer per parti | Dekningsbidrag per parti |
|:--|--:|--:|--:|
| A | 2 | 1 | 5 tusen kr |
| B | 1 | 2 | 4 tusen kr |
| Tilgjengelig kapasitet | 9 | 9 | |

I tillegg kan verkstedet lage høyst fire A-partier. La $x$ være antall A-partier og $y$ antall B-partier. Vi vil gjøre $P=5x+4y$ (tusen kroner) størst mulig. En plan er **tillatt** når

$$2x+y\le9\quad\text{(maskintimer)},\qquad x+2y\le9\quad\text{(arbeidstimer)},\qquad x\le4,\qquad x,y\ge0.$$

### Sammenlign hjørnene

Grensene der to krav holder med likhet, gir følgende hjørner. Vi forkaster skjæringspunkter som bryter et annet krav.

| Hjørne $(x,y)$ | $P$ (tusen kr) | Brukte maskintimer, arbeidstimer |
|:--|--:|:--|
| $(0,0)$ | 0 | $(0,0)$ |
| $(4,0)$ | 20 | $(8,4)$ |
| $(4,1)$ | 24 | $(9,6)$ |
| $(3,3)$ | **27** | $(9,9)$ |
| $(0,9/2)$ | 18 | $(9/2,9)$ |

I $(3,3)$ er begge timekapasitetene brukt opp, men det er rom for ett A-parti før grensen $x\le4$ nås. **Slakk** er kapasitet minus bruk. De tre slakkene er altså $(0,0,1)$. En grense med null slakk er **aktiv**.

Figuren viser området og linjer med konstant $P$. En høyere mållinje flyttes opp og til høyre; $P=27$ treffer området ved $(3,3)$.

```{pyodide-python}
#| label: week11-polygon
# Legg hjørnene i rekkefølge rundt det tillatte området.
corners = np.array([[0., 0.], [4., 0.], [4., 1.],
                    [3., 3.], [0., 4.5]])

# Fyll området og marker planen med høyest dekningsbidrag.
fig, ax = plt.subplots(figsize=(6, 5))
ax.fill(corners[:, 0], corners[:, 1], alpha=.22, color="tab:blue",
        label="Tillatte planer")
ax.plot(*np.vstack((corners, corners[0])).T, color="tab:blue")
ax.plot(3, 3, "o", color="tab:red", label="Beste plan (3, 3)")

# Hver stiplet linje viser planene med samme dekningsbidrag.
xx = np.linspace(0, 4.8, 120)
for level in (20, 24, 27):
    ax.plot(xx, (level - 5*xx)/4, "--", label=f"P = {level}")
ax.set(xlim=(0, 4.8), ylim=(0, 5.1), xlabel="A-partier x",
       ylabel="B-partier y", title="Tillatt område og mållinjer")
ax.set_aspect("equal")
ax.legend(fontsize=8)
plt.show()
```

### Hvorfor er hjørnene nok her?

Dette er **lineær programmering (LP)**: både målet og ressursbruken er lineære i $x,y$. Langs en kant varierer $P$ lineært mellom hjørnene. Hvert punkt inni mangekanten kan skrives som et veid gjennomsnitt av hjørnene, så verdien av $P$ blir samme gjennomsnitt av tabellverdiene. Ingen plan kan dermed gi mer enn 27. Hvis en mållinje følger en kant, kan flere planer være like gode.
For eksempel ville et annet mål, $R=2x+y$, fått maksimum 9
både ved $(4,1)$ og $(3,3)$, og i alle punktene på kanten mellom dem.
Det finnes da mange maksimumspunkter, selv om maksimalverdien er ett tall.

Området er lukket og begrenset, altså **kompakt** slik vi så i [uke 8](uke8.qmd#uke8-kompakt); et kontinuerlig mål oppnår et maksimum der. Området er også **konvekst**: linjestykket mellom to tillatte planer er tillatt. Ressurskravene er rader av koeffisienter som i de lineære systemene tidligere i kurset, men her må vi beholde *ulikhetene* når vi sjekker skjæringspunktene.

<details class="reading-step">
<summary>Gå i dybden: hjørner og begrensninger for argumentet</summary>

Løs $2x+y=9$ og $x+2y=9$ som et lineært system: $x=y=3$. På $x=4$ krever maskintimene $y\le1$; på $x=0$ krever arbeidstimene $y\le9/2$. Aksene og disse skjæringene gir de fem hjørnene. **Simpleksmetoden** går mellom nabohjørner for å forbedre målet.
I vårt polygon er en mulig forbedrende hjørnebane
$(0,0)\to(4,0)\to(4,1)\to(3,3)$, med verdiene
$0,20,24,27$. Vi trenger ingen simplekstabell for å lese denne banen fra figuren.

En LP kan også ha et tomt tillatt område eller et mål som kan bli vilkårlig stort. Hjørneargumentet over gjelder vårt ikke-tomme, begrensede område. Gradient $\nabla P=(5,4)$ er konstant og Hessianen er null. Det finnes derfor ikke noe indre stasjonært punkt slik de lokale testene fra [uke 8](uke8.qmd#uke8-lokalt) og [uke 10](uke10.qmd) undersøkte; grensene stopper forbedringen.

</details>

## 11.2 Finn planen med `linprog`

<div id="uke11-linprog"></div>

For mange produkter er en hjørnetabell tungvint. Samle bidragene i $p=(5,4)$, timebruken og A-grensen i $A=\left(\begin{smallmatrix}2&1\\1&2\\1&0\end{smallmatrix}\right)$ og kapasitetene i $b=(9,9,4)$. Da betyr $Az\le b$ kravene for $z=(x,y)$. SciPys `linprog` **minimerer**, så vi sender inn `-p` for å maksimere $p^Tz$. `A_ub`, `b_ub` angir $\le$-rader, mens `bounds=(0,None)` gir begge variabler nedre grense null.

```{pyodide-python}
#| label: week11-highs
# Legg produktene i kolonner og begrensningene i rader.
p = np.array([5., 4.])
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])

# Minimer -P under de tre kravene og ikke-negative produksjonstall.
result = linprog(-p, A_ub=A, b_ub=b, bounds=(0, None), method="highs")
print("Status:", result.status, result.message)

# Les planen bare dersom løseren fant et optimum.
if result.success:
    print("Plan:", result.x, "dekningsbidrag:", -result.fun)
    print("Slakk:", result.ineqlin.residual)
    print("Direkte kontroll b-Az:", b - A @ result.x)
```

Status 0 og `success=True` gir $(3,3)$, verdi 27 og slakk $(0,0,1)$. `result.fun=-27` er funksjonen SciPy faktisk minimerte. Vi kontrollerer fortegnet og at planen oppfyller kravene. Flyttallsregning kan gi små avvik fra null.

Et problem kan også være **umulig** (ingen plan oppfyller alle krav, status 2), eller målet kan være **ubegrenset** (det kan forbedres uten en endelig beste verdi, status 3). Les status *før* du bruker `x` og `fun`:

```{pyodide-python}
#| label: week11-status
# t <= 1 og t >= 2 kan ikke begge gjelde.
impossible = linprog([1.], A_ub=[[1.], [-1.]], b_ub=[1., -2.],
                     bounds=(0, None), method="highs")

# Maksimering av t >= 0 uten en øvre grense har ingen endelig verdi.
unbounded = linprog([-1.], bounds=(0, None), method="highs")
print("Umulig problem:", impossible.status)
print("Ubegrenset problem:", unbounded.status)
```

Statusen gjelder modellen vi skrev inn. En feil i produksjonskravene blir ikke rettet av løseren.

<details class="reading-step">
<summary>Gå i dybden: skriv andre krav på samme form</summary>

SciPy tar imot ulikheter på formen $Az\le b$. Et krav
$x+y\ge2$ skrives derfor $-x-y\le-2$: både koeffisientene og
høyresiden skifter fortegn. Likninger kan gis direkte med
`A_eq` og `b_eq`.

En **fri variabel** kan være både positiv og negativ. Hvis $y$ er
fri, kan vi skrive $y=y_+-y_-$ med $y_+,y_-\ge0$.
For eksempel representeres $y=-3$ av $y_+=0$, $y_-=3$.
Kravet over blir da $-x-y_++y_-\le-2$. Med denne omskrivingen
kan vi bruke bare ikke-negative variabler. Alternativt kan `linprog`
gi $y$ grensene `(None, None)` direkte.

En **slakkvariabel** gjør ubrukt kapasitet til en egen variabel:
$2x+y\le9$ er det samme som
$2x+y+s=9$ med $s\ge0$. Ved planen $(4,1)$ er $s=0$;
ved $(3,2)$ er $s=1$. Å samle alle krav i én slik avtalt form
kalles å skrive problemet på **standardform**. Ulike framstillinger
velger ulikhetsform eller likhetsform; oppgi derfor alltid formen.

</details>

## 11.3 Ressurspriser gir en øvre grense

<div id="uke11-dual"></div>

### Et prisbevis med tall

Hjørnene og løseren peker på 27. Nå får vi en kort kontroll som gjelder *hver* tillatte plan. Sett en tenkt pris på 2 tusen kroner per maskintime og 1 tusen kroner per arbeidstime. Grensen på A-partier får pris null. Innsatsen til ett A-parti prises da til $2\cdot2+1\cdot1=5$, og til ett B-parti til $1\cdot2+2\cdot1=4$: akkurat produktenes bidrag.

Multipliser maskintimekravet med 2 og arbeidstimekravet med 1, og legg sammen:

$$2(2x+y)+(x+2y)=5x+4y\le2\cdot9+9=27.$$

Ingen tillatt plan kan gi mer enn 27, mens $(3,3)$ gir 27. Vi har et **optimalitetssertifikat** uten å måtte undersøke flere punkter. Prisen på A-grensen er null, og grensen har ett ubrukt parti: å øke bare denne grensen litt hjelper ikke nå.

### Fra prisforslag til et nytt optimeringsproblem

Bruk nå andre ikke-negative timepriser $u,v$ og pris $w$ på A-grensen. Innsatsen må koste **minst** bidraget per parti, ellers kan prisregningen ikke avgrense bidraget:

$$2u+v+w\ge5\quad\text{(A)},\qquad u+2v\ge4\quad\text{(B)},\qquad u,v,w\ge0.$$

For hver tillatt plan får vi dermed

$$5x+4y\le(2u+v+w)x+(u+2v)y\le9u+9v+4w.$$

Den første ulikheten bruker $x,y\ge0$, den andre de tre kapasitetskravene. Ethvert gyldig prisvalg gir en øvre grense. Å finne den laveste slike grensen er et eget problem: **dualen** til produksjonsproblemet, som kalles **primalen**. At planens verdi aldri overstiger prisgrensen, kalles **svak dualitet**. Lik verdi 27 på begge sider beviser optimalitet her.

Mer kompakt kan et maksimeringsproblem skrives

$$\max_{z\ge0}p^Tz\quad\text{slik at }Az\le b.$$

Hver rad i $A$ får én ikke-negativ pris i $q$. Den samme vektede ulikheten gir dualen

$$\min_{q\ge0}b^Tq\quad\text{slik at }A^Tq\ge p,\qquad p^Tz\le b^Tq.$$

Når begge LP-er har mulige løsninger og et endelig optimum, er de beste verdiene like (**sterk dualitet**). Vårt talleksempel trenger ikke denne generelle setningen: vi har allerede vist to mulige valg med samme verdi.

<details class="reading-step">
<summary>Gå i dybden: hvor blir forskjellen mellom grensene av?</summary>

For mulige $z,q$ kan differansen deles i summer av ikke-negative produkter:

$$b^Tq-p^Tz=q^T(b-Az)+z^T(A^Tq-p)\ge0.$$

Når forskjellen er null, må hver positiv pris møte en aktiv begrensning: $q_i(b_i-(Az)_i)=0$. Hvert produkt som lages i positiv mengde, må ha innsatspris lik bidraget: $z_j((A^Tq)_j-p_j)=0$. Dette kalles **komplementær slakk**. Ved $z=(3,3)$ og $q=(2,1,0)$ er kapasitetslakken $(0,0,1)$ og produktprisene $(5,4)$. En aktiv grense kan likevel ha pris null, som vi ser ved kapasitetsskiftet i 11.4.

**Slik finner vi prisene fra planen $(3,3)$.** A-grensen har slakk 1,
så komplementær slakk gir $w=0$. Begge produktene lages i positiv
mengde, derfor må $2u+v=5$ og $u+2v=4$. Løsning av disse to
likningene gir $u=2$, $v=1$. Prisene $(2,1,0)$ kan altså utledes
fra hvilke varer som produseres og hvilke grenser som har slakk.

Hvis rader eller variabler har andre fortegn, må også prisreglene endres. For et primalproblem som maksimeres, gir en $\ge$-rad en ikke-positiv dualvariabel og en likningsrad en fri dualvariabel. En fri primalvariabel gir et likhetskrav i dualen. Den vektede ulikheten forklarer fortegnsreglene. I hovedmodellen bruker vi bare $Az\le b$ og $z\ge0$.

</details>

## 11.4 Hva er en ekstra maskintime verdt?

<div id="uke11-sensitivitet"></div>

### Når den gamle timeprisen fortsatt virker

Gi verkstedet $\Delta$ flere maskintimer. Prisene $(2,1,0)$ gir nå en øvre grense $27+2\Delta$. For $\Delta=1/2$ møtes timegrensene ved $(10/3,17/6)$, en tillatt plan med $P=28$. Grensen oppnås: en halv ekstra maskintime er verdt 1 tusen kroner her.

### Når en annen grense stopper produksjonen

For $\Delta=2$ ville skjæringen fått $x=13/3>4$, som bryter A-grensen. Nå er $(4,5/2)$ best og gir $P=30$. Den gamle prisformelen gir fortsatt en gyldig øvre grense på 31, men den oppnås ikke. Vi kan bevise den nye grensen med prisene $(u,v,w)=(0,2,3)$:

$$2(x+2y)+3x=5x+4y\le2\cdot9+3\cdot4=30.$$

Planen $(4,5/2)$ oppnår 30. Nå er det arbeidstimene og A-grensen
som bestemmer beste verdi; ekstra maskintimer alene hjelper ikke.
Allerede ved $\Delta=3/2$ er disse prisene optimale, selv om
maskintimekravet fortsatt er aktivt. En aktiv grense kan altså ha pris null.
Figuren viser opprinnelig kapasitet øverst og to ekstra maskintimer
nederst, med samme akser.

```{pyodide-python}
#| label: week11-capacity-geometry
# Sammenlign startkapasitet med to ekstra maskintimer i vertikale paneler.
fig, axes = plt.subplots(2, 1, figsize=(6, 10), constrained_layout=True)
xx = np.linspace(0, 4.8, 120)
cases = [
    (0., np.array([[0., 0.], [4., 0.], [4., 1.],
                    [3., 3.], [0., 4.5]]), (3., 3.), 27.),
    (2., np.array([[0., 0.], [4., 0.], [4., 2.5],
                    [0., 4.5]]), (4., 2.5), 30.),
]
for ax, (delta, polygon, best, value) in zip(axes, cases):
    # Vis tillatte planer og grensene for maskin- og arbeidstimer.
    ax.fill(polygon[:, 0], polygon[:, 1], alpha=.22, color="tab:blue",
            label="Tillatte planer")
    ax.plot(xx, 9 + delta - 2*xx, color="tab:blue", label="Maskintimer")
    ax.plot(xx, (9 - xx)/2, color="tab:green", label="Arbeidstimer")
    # Vis også A-grensen som blir avgjørende når maskinkapasiteten øker.
    ax.axvline(4, color="tab:purple", linestyle=":", label="A-grense x = 4")
    # Mållinjen gjennom optimum viser hvor forbedringen stoppes.
    ax.plot(xx, (value - 5*xx)/4, "--", color="tab:orange",
            label=f"P = {value:g}")
    ax.plot(*best, "o", color="tab:red", label="Beste plan")
    ax.set(xlim=(0, 4.8), ylim=(0, 5.1), xlabel="A-partier x",
           ylabel="B-partier y", title=f"Ekstra maskintimer: Δ = {delta:g}")
    ax.set_aspect("equal")
    ax.legend(fontsize=8, loc="upper right")
plt.show()
```

### Les ressursverdiene fra SciPy

Vi kontrollerer endringen med `linprog`. `ineqlin.marginals` beskriver den *lokale* endringen i minimeringsverdien når en høyreside økes. SciPy minimerer $-P$, så vi snur fortegnet for å lese ressursverdier for $P$.

```{pyodide-python}
#| label: week11-marginals
# Løs samme modell med tre timekapasiteter og samme øvrige data.
for delta in (0., .5, 2.):
    changed = b.copy()
    changed[0] += delta
    trial = linprog(-p, A_ub=A, b_ub=changed,
                    bounds=(0, None), method="highs")
    if trial.success:
        print(f"Δ={delta:g}: plan={trial.x}, P={-trial.fun:g}, "
              f"gammelt prisanslag={27+2*delta:g}")

# Dette er marginalene for bidraget P, ikke for -P.
print("Ressursverdier nær Δ=0:", -result.ineqlin.marginals)
```

Bidragene blir $27,28,30$, mens den gamle prisformelen gir $27,28,31$. Ved utgangspunktet er SciPy-marginalene omtrent $(-2,-1,0)$; de lokale verdiene for ekstra maskintime, arbeidstime og høyere A-grense er $(2,1,0)$. For større endringer må vi sjekke om en plan fortsatt kan oppnå prisgrensen.

<details class="reading-step">
<summary>Gå i dybden: hvor lenge er prisformelen eksakt?</summary>

Når begge timegrensene fortsatt er aktive, gir systemet

$$x=3+\frac{2\Delta}{3},\qquad y=3-\frac{\Delta}{3}.$$

Kravene $x,y\ge0$ og $x\le4$ gir $-9/2\le\Delta\le3/2$. I dette intervallet er planen tillatt og de gamle prisene gir samme verdi: $P_*(\Delta)=27+2\Delta$. For kapasitetsøkninger gjelder dette til og med $\Delta=3/2$. Etterpå må vi finne et nytt beste punkt.

Hvis partier måtte være hele, ville den delbare modellen bare gi en øvre grense for heltallsmodellen, slik som i [uke 8](uke8.qmd#uke8-modell). Etter $\Delta=1/2$ er $(10/3,17/6)$ ikke en plan med hele partier.

</details>

## 11.5 Regneoppgaver

<div id="uke11-oppgaver"></div>

Oppgave 1–2 følger modell og prisbevis; oppgave 3–4 følger kapasitetsforsøket; oppgave 5–6 kontrollerer om en grense eller et problem faktisk gir et optimum. Svar eksakt uten avrunding. Begrunn tolkningene i egne notater. Kodeoppgavene er i 11.6.

::: {#week11-exercise-context .math-exercise-context}

Verkstedet maksimerer $P=5x+4y$ under $2x+y\le9$, $x+2y\le9$, $x\le4$ og $x,y\ge0$. Slakk er kapasitet minus bruk. Gyldige ikke-negative priser $(u,v,w)$ oppfyller $2u+v+w\ge5$ og $u+2v\ge4$; da er $9u+9v+4w$ en øvre grense for $P$.

:::

**Oppgave 1 – undersøk en plan.**

```{math-exercise}
#| label: week11-task-slack
#| context: week11-exercise-context
#| caption: Slakk og dekningsbidrag
#| mode: equivalent
#| partial-credit: true
#| field-labels: slakk maskintimer, slakk arbeidstimer, slakk A-grense, dekningsbidrag

Sett $(x,y)=(4,1)$. Finn slakken i de tre begrensningene i oppført rekkefølge og beregn dekningsbidraget. Forklar i egne notater om planen er tillatt og hvilke grenser som er aktive.

Slakk: vec[0,3,0] &nbsp; Dekningsbidrag: __[24]

Finn også skjæringen mellom de to timegrensene. Sammenlign bidraget
der med bidragene i hjørnetabellen i 11.1, og forklar hvilken plan som er best.
```

**Oppgave 2 – bygg en øvre grense.**

```{math-exercise}
#| label: week11-task-bound
#| context: week11-exercise-context
#| caption: Ressurspriser som sertifikat
#| mode: equivalent
#| partial-credit: true
#| field-labels: øvre grense, innsatspris A, innsatspris B

Bruk prisene $(u,v,w)=(2,1,0)$. Finn øvre grense $9u+9v+4w$ og innsatsprisene $2u+v+w$ for A og $u+2v$ for B. Forklar hvorfor en tillatt plan med bidrag lik grensen er optimal.

Øvre grense: __[27] &nbsp; Innsatspriser (A, B): vec[5,4]

Utled deretter prisene fra planen $(3,3)$ ved hjelp av komplementær
slakk: hvilken pris må være null, og hvilke to likninger bestemmer
de andre prisene? Skriv regningen i egne notater.
```

**Oppgave 3 – endret kapasitet.**

```{math-exercise}
#| label: week11-task-perturb
#| context: week11-exercise-context
#| caption: Nytt skjæringspunkt
#| mode: equivalent
#| partial-credit: true
#| field-labels: nye partier A, nye partier B, nytt dekningsbidrag

Øk bare maskintimene fra 9 til 10. Anta at de to timegrensene fortsatt er aktive. Løs grenselikningene, kontroller $x\le4$ og finn det nye dekningsbidraget. Skriv produksjonstallene som brøker.

Plan: vec[11/3,8/3] &nbsp; Dekningsbidrag: __[29]
```

**Oppgave 4 – prisen har et gyldighetsområde.**

```{math-exercise}
#| label: week11-task-range
#| context: week11-exercise-context
#| caption: Største økning med gammel pris
#| mode: equivalent
#| field-labels: største kapasitetsøkning

Med maskinkapasitet $9+\Delta$ gir de to aktive timegrensene $x=3+2\Delta/3$ og $y=3-\Delta/3$. Finn den største $\Delta\ge0$ som fortsatt oppfyller $x\le4$. Hvorfor må prisanslaget undersøkes på nytt etter denne økningen?

$\Delta=$ __[3/2]
```

**Oppgave 5 – en øvre grense trenger ikke være skarp.**

```{math-exercise}
#| label: week11-task-loose-bound
#| context: week11-exercise-context
#| caption: Gyldig, men løs øvre grense
#| mode: equivalent
#| partial-credit: true
#| field-labels: innsatspris A, innsatspris B, øvre grense

Prøv $(u,v,w)=(3,1,0)$. Finn innsatsprisene for A og B og den øvre grensen. Sammenlign med planen $(3,3)$: beviser akkurat dette prisvalget at den er optimal?

Innsatspriser (A, B): vec[7,5] &nbsp; Øvre grense: __[36]
```

**Oppgave 6 – skille mellom ulike utfall.**

```{math-exercise}
#| label: week11-task-status
#| context: week11-exercise-context
#| caption: Tillatt område og ubegrenset mål
#| mode: equivalent
#| partial-credit: true
#| field-labels: motstridende t-krav, t uten øvre grense

Problem I krever $t\ge0$, $t\le1$ og $t\ge2$. Problem II maksimerer $t$ under bare $t\ge0$. Skriv **2** for umulig problem og **3** for ubegrenset mål. Forklar i egne notater hvorfor utfallene er forskjellige.

Problem I: __[2] &nbsp; Problem II: __[3]
```

I [prosjektet](project_week11.qmd) bruker du ressurspriser på et større produksjonsvalg.

## 11.6 Python: undersøk og kontroller

<div id="uke11-python"></div>

Disse korte oppgavene kan kjøres uavhengig av hverandre. Data, importer og funksjonsrammer er gitt; fyll inn bare `TODO`-stedene. Kontrollene vurderer returverdier uten å vise løsningskode.

**Oppgave 1 – beregn slakk og bidrag.** Returner paret `(slack, profit)` for en plan `z`. `slack` skal ha én verdi per rad i `A`, også når planen bryter en grense.

```{py-exercise}
#| label: week11-python-evaluate
#| caption: Beregn ressursbruk og dekningsbidrag
#| show-test-hints: false
# Bruk NumPy til matrise- og vektorregningen.
import numpy as np

# Radene er kapasitetene; kolonnene er produktene A og B.
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])
p = np.array([5., 4.])

def evaluate(z):
    # TODO: Beregn slakk som kapasitet minus bruk og bidrag som p@z.
    return None

## TESTS ##
assert np.allclose(evaluate(np.array([3., 3.]))[0], [0., 0., 1.])
assert np.isclose(evaluate(np.array([3., 3.]))[1], 27.)
assert np.allclose(evaluate(np.array([4., 2.]))[0], [-1., 1., 0.])
assert np.isclose(evaluate(np.array([4., 2.]))[1], 28.)
```

**Oppgave 2 – send modellen til SciPy.** Bruk arrayene til å maksimere bidraget med `linprog`. Returner hele resultatobjektet, slik at det kan kontrolleres.

```{py-exercise}
#| label: week11-python-solve
#| caption: Løs den delbare produksjonsmodellen
#| show-test-hints: false
# NumPy holder dataene, mens SciPy løser LP-modellen.
import numpy as np
from scipy.optimize import linprog

# En rad per begrensning og en kolonne per produkt.
p = np.array([5., 4.])
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])

def solve_production():
    # TODO: Bruk linprog til å maksimere p@z med Az<=b og z>=0.
    result = None
    return result

## TESTS ##
assert solve_production().success
assert np.allclose(solve_production().x, [3., 3.], atol=1e-7)
assert np.isclose(-solve_production().fun, 27., atol=1e-7)
assert np.allclose(b - A @ solve_production().x, [0., 0., 1.], atol=1e-7)
```

**Oppgave 3 – kontroller et prisbevis.** Returner `(plan_ok, prices_ok, gap)`: om planen oppfyller alle krav, om prisene oppfyller alle prisreglene, og forskjellen mellom øvre grense og planens bidrag. Bruk toleranse `1e-9` ved sammenligning.

```{py-exercise}
#| label: week11-python-certificate
#| caption: Kontroller en plan og ressurspriser
#| show-test-hints: false
# Bruk NumPy til å kontrollere ulikhetene koordinatvis.
import numpy as np

# Hver rad svarer til én kapasitet, hver kolonne til ett produkt.
p = np.array([5., 4.])
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])

def certificate(z, q):
    # TODO: Sjekk Az<=b og z>=0, deretter A.T@q>=p og q>=0.
    # TODO: Beregn gapet b@q-p@z og returner alle tre verdiene.
    return None

## TESTS ##
plan_ok, prices_ok, gap = certificate(np.array([3., 3.]), np.array([2., 1., 0.]))
assert plan_ok and prices_ok and np.isclose(gap, 0.)
assert not certificate(np.array([5., 0.]), np.array([2., 1., 0.]))[0]
assert not certificate(np.array([3., 3.]), np.array([0., 0., 0.]))[1]
assert np.isclose(certificate(np.array([4., 1.]), np.array([3., 1., 0.]))[2], 12.)
```

<details>
<summary>Kort SciPy-oppslag</summary>

| Skriv/les | Betydning i modellen |
|:--|:--|
| `linprog(-p, A_ub=A, b_ub=b, bounds=(0,None), method="highs")` | Minimer $-p^Tz$ under $Az\le b$ og $z\ge0$. Likninger kan gis med `A_eq`, `b_eq`. |
| `result.status`, `result.success`, `result.message` | Undersøk utfallet først; status 0 er vellykket, 2 umulig, 3 ubegrenset. |
| `result.x`, `result.fun` | Plan og **minimeringsverdi**. Vårt bidrag er `-result.fun`. |
| `result.ineqlin.residual`, `result.ineqlin.marginals` | Slakk og lokal verdiendring for minimeringsmålet per rad. Snudd fortegn gir ressursverdien for $P$. |

</details>

I [uke 12](uke12.qmd) undersøker vi igjen tillatte retninger og optimalitet, også når grensene er krumme.

:::
