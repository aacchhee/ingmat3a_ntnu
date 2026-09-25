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

## Python-oppsett

<div id="uke11-oppsett"></div>

Denne cellen importerer pakkene som brukes i ukens forsøk. Den kjøres automatisk når Python er klart. **Vent på meldingen
«Oppsett for uke 11 er klart» før du kjører et eksperiment.** Første oppstart
kan ta litt tid fordi nettleseren må hente pakkene.

`linprog` er SciPy-funksjonen som løser de lineære modellene.
Koeffisientene til hver modell settes i forsøket der de brukes.
Du kan lese koden og kjøre oppsettet på nytt med **Kjør**.
Hvis en celle melder at et navn ikke er definert, kjør oppsettet på nytt
og deretter forsøket. Kodeoppgavene til slutt inneholder sine egne importer.

{{< include ../_includes/optimization/week11_setup.md >}}

## 11.1 Fra tabell til tillatt område

<div id="uke11-modell"></div>

### Modellen: to produkter og to typer timer

Verkstedet produserer partier av A og B. **Dekningsbidrag** betyr salgsinntekt minus kostnadene som følger produksjonen, for eksempel materialer; her måles det i tusen kroner per parti. Vi antar at hele produksjonen blir solgt, at timer kan fordeles på delbare partier, og at tabellens tall er konstante i denne perioden.

| Produkt | Maskintimer per parti | Arbeidstimer per parti | Dekningsbidrag per parti |
|:--|--:|--:|--:|
| A | 2 | 1 | 5 tusen kr |
| B | 1 | 2 | 4 tusen kr |
| Tilgjengelig kapasitet | 9 | 9 | |

I tillegg kan verkstedet lage høyst fire A-partier. La $x$ være antall A-partier og $y$ antall B-partier. Vi vil gjøre $P=5x+4y$ (tusen kroner) størst mulig. En plan er **tillatt** når alle kravene er oppfylt:

| Krav | Regning for en plan $(x,y)$ | Grense |
|:--|:--|:--|
| Maskintimer | $2x+y$ | $2x+y\le9$ |
| Arbeidstimer | $x+2y$ | $x+2y\le9$ |
| Antall A-partier | $x$ | $x\le4$ |
| Ikke-negativ produksjon | $x,y$ | $x\ge0,\ y\ge0$ |

Les hver rad i produkttabellen som «timer per parti × antall partier». For den lille planen $(x,y)=(2,1)$ er regningen:

| Kontroll | Utregning | Sammenligning |
|:--|:--|:--|
| Maskintimer | $2\cdot2+1\cdot1=5$ | $5\le9$ |
| Arbeidstimer | $1\cdot2+2\cdot1=4$ | $4\le9$ |
| A-grense | $x=2$ | $2\le4$ |
| Dekningsbidrag | $5\cdot2+4\cdot1=14$ | 14 tusen kr |

Begge partimengdene er ikke-negative, så planen er tillatt. Den har $9-5=4$ ubrukte maskintimer, $9-4=5$ ubrukte arbeidstimer og rom for $4-2=2$ flere A-partier.

### Sammenlign hjørnene

For å finne en beste plan tegner vi først alle planene som oppfyller kravene. Deretter undersøker vi hjørnene: her kan et lineært mål ikke bli større i det indre av en kant enn ved begge endene. Grensene der to krav holder med likhet, gir følgende hjørner. Et skjæringspunkt som bryter et annet krav, tas ikke med.

| Hjørne $(x,y)$ | Maskintimer $2x+y$ | Arbeidstimer $x+2y$ | Bidrag $5x+4y$ (tusen kr) |
|:--|--:|--:|--:|
| $(0,0)$ | 0 | 0 | 0 |
| $(4,0)$ | 8 | 4 | 20 |
| $(4,1)$ | 9 | 6 | 24 |
| $(3,3)$ | 9 | 9 | **27** |
| $(0,9/2)$ | $9/2$ | 9 | 18 |

I $(3,3)$ er begge timekapasitetene brukt opp, men det er rom for ett A-parti før grensen $x\le4$ nås. **Slakk** er kapasitet minus bruk. De tre slakkene er altså $(0,0,1)$. En grense med null slakk er **aktiv**.

Vi tegner området for å se *hvorfor* sammenligningen av hjørner virker. Se først hvilke punkter som ligger innenfor alle grensene; følg så de stiplede linjene med konstant $P$. Når bidraget øker fra 20 til 27, flyttes linjen opp og til høyre. Den siste linjen som treffer området, møter det ved $(3,3)$.

```{pyodide-python}
#| label: week11-polygon
# Hvert hjørne er en plan (antall A-partier, antall B-partier).
# Rekkefølgen følger kanten rundt området, slik at utfyllingen blir riktig.
corners = np.array([[0., 0.], [4., 0.], [4., 1.],
                    [3., 3.], [0., 4.5]])

# Fyll alle tillatte planer og trekk opp kanten ved å gjenta første hjørne.
fig, ax = plt.subplots(figsize=(6, 5))
ax.fill(corners[:, 0], corners[:, 1], alpha=.22, color="tab:blue",
        label="Tillatte planer")
ax.plot(*np.vstack((corners, corners[0])).T, color="tab:blue")
ax.plot(3, 3, "o", color="tab:red", label="Beste plan (3, 3)")

# Løs 5x + 4y = nivå for y; hvert nivå gir én parallell mållinje.
# Sammenlign hvor linjene for 20, 24 og 27 treffer det blå området.
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

Vi kan hente hjørnene fra grenselikningene i tre trinn:

1. Sett begge timekrav lik 9: $2x+y=9$ og $x+2y=9$. Trekk den andre likningen fra den første: $(2x+y)-(x+2y)=9-9$, så $x-y=0$ og $x=y$. Sett dette inn i $x+2y=9$: $y+2y=9$, altså $3y=9$ og $y=3$. Dermed er $x=3$.
2. Sett $x=4$: maskintimene gir $8+y\le9$, altså $y\le1$. Sett $x=0$: arbeidstimene gir $2y\le9$, altså $y\le9/2$.
3. Ta med skjæringene med aksene og kontroller hvert punkt mot *alle* kravene. Da står vi igjen med de fem hjørnene i tabellen.

**Simpleksmetoden** går mellom nabohjørner for å forbedre målet.
I vårt polygon er en mulig forbedrende hjørnebane
$(0,0)\to(4,0)\to(4,1)\to(3,3)$, med verdiene
$0,20,24,27$. Vi trenger ingen simplekstabell for å lese denne banen fra figuren.

En LP kan også ha et tomt tillatt område eller et mål som kan bli vilkårlig stort. Hjørneargumentet over gjelder vårt ikke-tomme, begrensede område. Gradient $\nabla P=(5,4)$ er konstant og Hessianen er null. Det finnes derfor ikke noe indre stasjonært punkt slik de lokale testene fra [uke 8](uke8.qmd#uke8-lokalt) og [uke 10](uke10.qmd) undersøkte; grensene stopper forbedringen.

</details>

## 11.2 Finn planen med `linprog`

<div id="uke11-linprog"></div>

For mange produkter er en hjørnetabell tungvint. Vi samler tallene i vektorer og en matrise. **Kolonnene** står i produktrekkefølgen A, B; **radene** står i kravrekkefølgen maskintimer, arbeidstimer, A-grense:

| Symbol | Betydning | Verdi |
|:--|:--|:--|
| $z$ | Antall partier A, B | $(x,y)$ |
| $p$ | Bidrag per parti A, B | $(5,4)$ |
| $b$ | Kapasitet per rad i $A$ | $(9,9,4)$ |

$$A=\begin{pmatrix}2&1\\1&2\\1&0\end{pmatrix},\qquad Az\le b.$$

SciPys `linprog` **minimerer**. For å maksimere $p^Tz$ sender vi derfor inn `-p`. Argumentene `A_ub`, `b_ub` angir radene $Az\le b$, mens `bounds=(0,None)` gir både $x$ og $y$ nedre grense null.

Dette forsøket gir en uavhengig kontroll av hjørnetabellen og viser hvilke tall vi bør sjekke når en løser svarer: status, plan, bidrag og slakk. Sammenlign særlig `Slakk` med `Kontroll` i utskriften. De skal vise samme tre verdier.

```{pyodide-python}
#| label: week11-highs
# Bidrag per parti: først A, så B, i tusen kroner.
p = np.array([5., 4.])
# Kolonner: A, B. Rader: maskintimer, arbeidstimer, A-grense.
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])

# SciPy minimerer. Minus foran p gjør minimum av -P til maksimum av P.
# bounds angir at både x og y er minst null.
result = linprog(-p, A_ub=A, b_ub=b, bounds=(0, None), method="highs")
print(f"Løserstatus: {result.status} — {result.message}")

# x og fun kan mangle dersom løseren ikke fant et endelig optimum.
if result.success:
    print(f"Plan: A = {result.x[0]:g}, B = {result.x[1]:g} partier")
    print(f"Dekningsbidrag: {-result.fun:g} tusen kr")
    print("Ressurs          Kapasitet  Brukt  Slakk  Kontroll")
    # Slakk fra SciPy skal stemme med b - A @ planen, rad for rad.
    for name, capacity, used, slack, check in zip(
        ("Maskintimer", "Arbeidstimer", "A-grense"),
        b, A @ result.x, result.ineqlin.residual, b - A @ result.x
    ):
        print(f"{name:<16}{capacity:>9g}{used:>7g}{slack:>7g}{check:>10g}")
```

Status 0 og `success=True` gir $(3,3)$, verdi 27 og slakk $(0,0,1)$. `result.fun=-27` er funksjonen SciPy faktisk minimerte. Vi kontrollerer fortegnet og at planen oppfyller kravene. Flyttallsregning kan gi små avvik fra null.

Hva skjer hvis løseren *ikke* finner en beste plan? Vi prøver to små modeller for å skille **umulig** (ingen plan oppfyller alle krav, status 2) fra **ubegrenset** (målet kan forbedres uten en endelig beste verdi, status 3). Se hvilken status hver modell får; ikke les `x` og `fun` uten først å sjekke status:

```{pyodide-python}
#| label: week11-status
# Første modell: t <= 1 og t >= 2 motsier hverandre.
# Skriv t >= 2 som -t <= -2 for A_ub og b_ub.
impossible = linprog([1.], A_ub=[[1.], [-1.]], b_ub=[1., -2.],
                     bounds=(0, None), method="highs")

# Andre modell: minimer -t, altså maksimer t, med bare t >= 0.
# Uten en øvre grense kan t og målet vokse så mye vi vil.
unbounded = linprog([-1.], bounds=(0, None), method="highs")
print("Modell                Status  Tolkning")
print(f"Motstridende krav     {impossible.status:>6}  Umulig")
print(f"Mål uten øvre grense  {unbounded.status:>6}  Ubegrenset")
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

Hjørnene og løseren peker på 27. For å vite at ingen oversett plan er bedre, lager vi en øvre grense som gjelder *hver* tillatte plan. Sett en tenkt pris på 2 tusen kroner per maskintime og 1 tusen kroner per arbeidstime. Grensen på A-partier får pris null. Sammenlign innsatspris og bidrag for hvert produkt:

| Produkt | Priset ressursbruk per parti | Bidrag per parti (tusen kr) |
|:--|:--|--:|
| A | $2\cdot2+1\cdot1+0\cdot1=5$ | 5 |
| B | $2\cdot1+1\cdot2+0\cdot0=4$ | 4 |

Hvert partis bidrag dekkes av innsatsprisen. Multipliser derfor maskintimekravet med 2 og arbeidstimekravet med 1, og legg sammen:

$$2(2x+y)+(x+2y)=5x+4y\le2\cdot9+9=27.$$

Ingen tillatt plan kan gi mer enn 27, mens $(3,3)$ gir 27. Vi har et **optimalitetssertifikat** uten å måtte undersøke flere punkter. Prisen på A-grensen er null, og grensen har ett ubrukt parti: å øke bare denne grensen litt hjelper ikke nå.

### Fra prisforslag til et nytt optimeringsproblem

Bruk nå $u$ som pris per maskintime, $v$ som pris per arbeidstime og $w$ som pris per ekstra tillatt A-parti, målt i tusen kroner per enhet. Alle tre er ikke-negative. Innsatsen må koste **minst** bidraget per parti, ellers kan prisregningen ikke avgrense bidraget:

| Prisregel | Ressurser per parti × pris | Krav |
|:--|:--|:--|
| A-parti | $2u+v+w$ | $2u+v+w\ge5$ |
| B-parti | $u+2v$ | $u+2v\ge4$ |
| Prisene | $u,v,w$ | $u,v,w\ge0$ |

Prisregningen gir to trinn for hver tillatt plan:

$$5x+4y\le(2u+v+w)x+(u+2v)y\le9u+9v+4w.$$

Først bruker vi prisreglene og $x,y\ge0$ til å dekke produktenes bidrag. Så bruker vi kapasitetskravene til å erstatte ressursbruken med kapasitetene. Ethvert gyldig prisvalg gir en øvre grense. Å finne den laveste slike grensen er et eget problem: **dualen** til produksjonsproblemet, som kalles **primalen**. At planens verdi aldri overstiger prisgrensen, kalles **svak dualitet**. Lik verdi 27 på begge sider beviser optimalitet her.

Mer kompakt kan et maksimeringsproblem skrives

$$\max_{z\ge0}p^Tz\quad\text{slik at }Az\le b.$$

Hver rad i $A$ får én ikke-negativ pris i $q$; her er $q=(u,v,w)$ i rekkefølgen maskintimer, arbeidstimer, A-grense. Priskravene er $A^Tq\ge p$. Den samme vektede ulikheten gir dualproblemet

$$\min_{q\ge0}b^Tq\quad\text{slik at }A^Tq\ge p.$$

For enhver tillatt plan $z$ og ethvert gyldig prisvalg $q$ gjelder den svake dualiteten $p^Tz\le b^Tq$.

Når begge LP-er har mulige løsninger og et endelig optimum, er de beste verdiene like (**sterk dualitet**). Vårt talleksempel trenger ikke denne generelle setningen: vi har allerede vist to mulige valg med samme verdi.

<details class="reading-step">
<summary>Gå i dybden: hvor blir forskjellen mellom grensene av?</summary>

For mulige $z,q$ kan differansen deles i summer av ikke-negative produkter:

$$b^Tq-p^Tz=q^T(b-Az)+z^T(A^Tq-p)\ge0.$$

Når forskjellen er null, må hver positiv pris møte en aktiv begrensning: $q_i(b_i-(Az)_i)=0$. Hvert produkt som lages i positiv mengde, må ha innsatspris lik bidraget: $z_j((A^Tq)_j-p_j)=0$. Dette kalles **komplementær slakk**. Ved $z=(3,3)$ og $q=(2,1,0)$ er kapasitetslakken $(0,0,1)$ og produktprisene $(5,4)$. En aktiv grense kan likevel ha pris null, som vi ser ved kapasitetsskiftet i 11.4.

**Slik finner vi prisene fra planen $(3,3)$.** A-grensen har slakk 1, så komplementær slakk gir $w=0$. Begge produktene lages i positiv mengde, derfor må $2u+v+w=5$ og $u+2v=4$. Med $w=0$ blir den første likningen $2u+v=5$, altså $v=5-2u$. Sett dette inn i den andre:

$$u+2(5-2u)=4\quad\Longrightarrow\quad 10-3u=4\quad\Longrightarrow\quad u=2.$$

Da er $v=5-2\cdot2=1$, og sammen med $w=0$ får vi prisene $(u,v,w)=(2,1,0)$. Kontrollen er $2u+v+w=5$ for A, $u+2v=4$ for B, og totalprisen for kapasitetene er $9u+9v+4w=27$. Prisene kan altså utledes fra hvilke varer som produseres og hvilke grenser som har slakk.

Hvis rader eller variabler har andre fortegn, må også prisreglene endres. For et primalproblem som maksimeres, gir en $\ge$-rad en ikke-positiv dualvariabel og en likningsrad en fri dualvariabel. En fri primalvariabel gir et likhetskrav i dualen. Den vektede ulikheten forklarer fortegnsreglene. I hovedmodellen bruker vi bare $Az\le b$ og $z\ge0$.

</details>

## 11.4 Hva er en ekstra maskintime verdt?

<div id="uke11-sensitivitet"></div>

### Når den gamle timeprisen fortsatt virker

Hvor mye bør verkstedet betale for mer maskinkapasitet? Gi det $\Delta$ flere maskintimer. De gamle prisene $(2,1,0)$ gir da øvre grense $2(9+\Delta)+9=27+2\Delta$. For $\Delta=1/2$ møtes timegrensene ved $(10/3,17/6)$. Kontroller planen rad for rad:

| Kontroll ved $\Delta=1/2$ | Beregning | Resultat |
|:--|:--|:--|
| Maskintimer | $2(10/3)+17/6$ | $19/2=9+1/2$ |
| Arbeidstimer | $10/3+2(17/6)$ | $9$ |
| A-grense | $10/3\le4$ | Oppfylt |
| Bidrag | $5(10/3)+4(17/6)$ | $28$ tusen kr |

Planen oppnår prisgrensen $27+2(1/2)=28$. Den halve ekstra maskintimen øker dermed det beste bidraget med 1 tusen kroner.

### Når en annen grense stopper produksjonen

Kan vi fortsatt bruke prisen 2 per maskintime etter en større økning? Ved $\Delta=2$ øker maskinkapasiteten til 11. Skjæringen mellom timegrensene ville gi $x=13/3>4$ og bryter A-grensen. Vi setter derfor $x=4$ og lar arbeidstiden være brukt opp: $4+2y=9$ gir $2y=5$ og $y=5/2$. Kontroller planen $(4,5/2)$:

| Kontroll ved $\Delta=2$ | Beregning | Resultat |
|:--|:--|:--|
| Maskintimer | $2\cdot4+5/2$ | $21/2\le11$ |
| Arbeidstimer | $4+2(5/2)$ | $9$ |
| A-grense | $x=4$ | Brukt opp |
| Bidrag | $5\cdot4+4(5/2)$ | $30$ tusen kr |

Den gamle prisformelen gir fortsatt en gyldig øvre grense på $27+2\cdot2=31$, men planen oppnår den ikke. Vi kan bevise den nye grensen med prisene $(u,v,w)=(0,2,3)$:

$$2(x+2y)+3x=5x+4y\le2\cdot9+3\cdot4=30.$$

Planen $(4,5/2)$ oppnår 30. Nå er det arbeidstimene og A-grensen
som bestemmer beste verdi; ekstra maskintimer alene hjelper ikke.
Allerede ved $\Delta=3/2$ er disse prisene optimale, selv om
maskintimekravet fortsatt er aktivt. En aktiv grense kan altså ha pris null.
Figuren lar oss se *hvilken grense* som stopper forbedringen. Sammenlign hvor mållinjen berører det blå området i øverste panel (opprinnelig kapasitet) og nederste panel (to ekstra maskintimer). Begge panelene har samme akser.

```{pyodide-python}
#| label: week11-capacity-geometry
# Bruk vertikale paneler med samme akser, så endret form kan sammenlignes.
fig, axes = plt.subplots(2, 1, figsize=(6, 10), constrained_layout=True)
# x-verdiene brukes til å tegne grense- og mållinjene i hvert panel.
xx = np.linspace(0, 4.8, 120)
# For hvert tilfelle: ekstra timer, hjørnene rundt området, beste plan, bidrag.
cases = [
    (0., np.array([[0., 0.], [4., 0.], [4., 1.],
                    [3., 3.], [0., 4.5]]), (3., 3.), 27.),
    (2., np.array([[0., 0.], [4., 0.], [4., 2.5],
                    [0., 4.5]]), (4., 2.5), 30.),
]
for ax, (delta, polygon, best, value) in zip(axes, cases):
    # Fyll planene som oppfyller alle krav; de rette linjene viser timegrenser.
    ax.fill(polygon[:, 0], polygon[:, 1], alpha=.22, color="tab:blue",
            label="Tillatte planer")
    # En økt høyreside skyver bare maskinlinjen utover.
    ax.plot(xx, 9 + delta - 2*xx, color="tab:blue", label="Maskintimer")
    ax.plot(xx, (9 - xx)/2, color="tab:green", label="Arbeidstimer")
    # A-grensen står fast; den blir avgjørende i det nederste panelet.
    ax.axvline(4, color="tab:purple", linestyle=":", label="A-grense x = 4")
    # Legg mållinjen gjennom beste plan og marker berøringspunktet.
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

Vi kontrollerer de tre tilfellene numerisk for å se når det gamle prisanslaget slutter å være eksakt. Se på kolonnene «Beste bidrag» og «Gammel grense»: de er like ved $\Delta=0$ og $1/2$, men ulike ved $\Delta=2$. `ineqlin.marginals` beskriver den *lokale* endringen i minimeringsverdien når en høyreside økes. SciPy minimerer $-P$, så vi snur fortegnet for å lese ressursverdier for $P$.

```{pyodide-python}
#| label: week11-marginals
# Endre bare første kapasitet (maskintimene); hold A, p og andre grenser fast.
# Sammenlign løserens beste verdi med øvre grense fra de gamle prisene.
print("Δ timer  A-partier  B-partier  Beste bidrag  Gammel grense")
for delta in (0., .5, 2.):
    changed = b.copy()
    changed[0] += delta
    # Vi minimerer -P også her, så snu fortegnet på fun i utskriften.
    trial = linprog(-p, A_ub=A, b_ub=changed,
                    bounds=(0, None), method="highs")
    if trial.success:
        print(f"{delta:>7g}{trial.x[0]:>12.3f}{trial.x[1]:>12.3f}"
              f"{-trial.fun:>14g}{27+2*delta:>16g}")
    else:
        # Meld fra om status før et resultatobjekt uten plan kan brukes.
        print(f"{delta:>7g}  Status {trial.status}: {trial.message}")

# Marginalene fra startmodellen gjelder lokalt rundt Δ = 0.
# De tre tallene står i samme rekkefølge som radene i A.
print("\nLokal ressursverdi ved Δ = 0 (tusen kr per ekstra enhet)")
for name, value in zip(("Maskintime", "Arbeidstime", "A-parti"),
                       -result.ineqlin.marginals):
    print(f"{name:<16}{value:g}")
```

Bidragene blir $27,28,30$, mens den gamle prisformelen gir $27,28,31$. Ved utgangspunktet er SciPy-marginalene omtrent $(-2,-1,0)$; de lokale verdiene for ekstra maskintime, arbeidstime og høyere A-grense er $(2,1,0)$. For større endringer må vi sjekke om en plan fortsatt kan oppnå prisgrensen.

<details class="reading-step">
<summary>Gå i dybden: hvor lenge er prisformelen eksakt?</summary>

For å finne hele intervallet der gammel pris gir riktig *optimalverdi*, lar vi $\Delta$ være en endring i maskinkapasiteten: positiv $\Delta$ betyr flere timer, negativ $\Delta$ betyr færre. Den nye kapasiteten $9+\Delta$ må være ikke-negativ. Hold begge timegrensene aktive og sett $2x+y=9+\Delta$ og $x+2y=9$. Eliminering gir

$$x=3+\frac{2\Delta}{3},\qquad y=3-\frac{\Delta}{3}.$$

Kontroller den nye planen mot de tre andre kravene:

| Krav | Sett inn $x=3+2\Delta/3$, $y=3-\Delta/3$ | Grense for $\Delta$ |
|:--|:--|:--|
| $x\ge0$ | $3+2\Delta/3\ge0$ | $\Delta\ge-9/2$ |
| $y\ge0$ | $3-\Delta/3\ge0$ | $\Delta\le9$ |
| $x\le4$ | $3+2\Delta/3\le4$ | $\Delta\le3/2$ |

Det felles intervallet er $-9/2\le\Delta\le3/2$, som også gir ikke-negativ maskinkapasitet. La $P_*(\Delta)$ betegne *størst mulig dekningsbidrag* ved maskinkapasitet $9+\Delta$. I dette intervallet er planen tillatt og har verdien $5x+4y=27+2\Delta$. Siden den oppnår den gamle prisgrensen, er $P_*(\Delta)=27+2\Delta$. For kapasitetsøkninger gjelder dette til og med $\Delta=3/2$. Etterpå må vi finne et nytt beste punkt.

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

Slakk: vec[0,3,0] &nbsp; Dekningsbidrag: _[24]

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

Øvre grense: _[27] &nbsp; Innsatspriser (A, B): vec[5,4]

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

Plan: vec[11/3,8/3] &nbsp; Dekningsbidrag: _[29]
```

**Oppgave 4 – prisen har et gyldighetsområde.**

```{math-exercise}
#| label: week11-task-range
#| context: week11-exercise-context
#| caption: Største økning med gammel pris
#| mode: equivalent
#| field-labels: største kapasitetsøkning

Med maskinkapasitet $9+\Delta$ gir de to aktive timegrensene $x=3+2\Delta/3$ og $y=3-\Delta/3$. Finn den største $\Delta\ge0$ som fortsatt oppfyller $x\le4$. Hvorfor må prisanslaget undersøkes på nytt etter denne økningen?

$\Delta=$ _[3/2]
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

Innsatspriser (A, B): vec[7,5] &nbsp; Øvre grense: _[36]
```

**Oppgave 6 – skille mellom ulike utfall.**

```{math-exercise}
#| label: week11-task-status
#| context: week11-exercise-context
#| caption: Tillatt område og ubegrenset mål
#| mode: equivalent
#| partial-credit: true
#| field-labels: motstridende t-krav, t uten øvre grense

Problem I krever $t\ge0$, $t\le1$ og $t\ge2$. Problem II maksimerer $t$ under bare $t\ge0$. Skriv <strong>2</strong> for umulig problem og <strong>3</strong> for ubegrenset mål. Forklar i egne notater hvorfor utfallene er forskjellige.

Problem I: _[2] &nbsp; Problem II: _[3]
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

# Radene er ressurskravene; kapasitetene står i b. Kolonner: A, B.
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
