## Hvorfor koster strømmen det den koster?

Du har kanskje sett at strømprisen kan være forskjellig i to deler av
landet i samme time. Her bygger vi et lite kraftmarked og bruker
`linprog` til å undersøke tre spørsmål:

- Hvilket kraftverk bestemmer prisen når forbruket øker litt?
- Når kan en overføringslinje gi ulike priser i to områder?
- Hvorfor har vannet i et magasin verdi selv om regnet er gratis?

### Bakgrunn: slik leser vi energimodellen

Dette er en kort orientering, ikke en egen oppgavedel. Du trenger ingen forkunnskaper i økonomi. Vi bruker **pris** om endringen i den laveste
samlede kostnaden per MW ekstra forbruk. En produksjon på 1 MW i én time gir
1 MWh energi. En **dualvariabel** er tallet løseren gir for denne lokale
endringen, slik som ressursprisene i [uke 11](uke11.qmd#uke11-dual).
Ved et knekkpunkt kan endringen være ulik på hver side.

Alle tall er oppdiktede. Vi antar fast forbruk, kjente kostnader, ingen tap i
nettet og delbar produksjon. Modellen skal forklare sammenhenger, ikke
forutsi den faktiske strømprisen.

### En vei gjennom prosjektet

| Del | Det du undersøker |
|:--|:-- |
| 1 | Les produksjon, pris og gjennomsnitt fra løseren. |
| 2 | Kontroller prisene med små endringer og les slakk. |
| 3 | Sammenlign prisene på hver side av en linje. |
| 4 | Bygg én matrisrad og undersøk vannverdien. |
| 5 og levering | Test ett lokalt prisanslag og samle konklusjonene. |

Sett av omtrent **4–6 timer**. Du skriver to korte funksjoner; resten av
arbeidet er å velge forsøk, lese utskrifter og begrunne konklusjoner.
Skriv en kort forventning før hver sammenligning. Du skal ikke utlede
pristeorien på nytt.

### Oppsett og begreper

På nettsiden er dataene, `one_zone`, `two_zones` og hjelpefunksjonene for figurer allerede klare.
Studentfunksjonene `read_market` og `make_water_row` må du kjøre igjen
hver gang siden lastes inn på nytt. Ellers kan hver forsøkscelle kjøres alene
med oppsettet, uten at tidligere forsøksceller er kjørt.

| Les i resultatet | Betydning |
|:--|:--|
| `res.status`, `res.success` | Sjekk utfallet først: 0 er vellykket, 2 betyr umulige krav. |
| `res.x`, `res.fun` | Produksjonsplan og laveste samlede kostnad. |
| `res.eqlin.marginals` | Lokal kostnadsendring per ekstra enhet på høyresiden av likningene. |
| `res.upper.residual` | Ledig kapasitet: øvre grense minus produksjon. |
| `-res.upper.marginals` | Verdien av litt mer kapasitet. |
| `-res.ineqlin.marginals` | Verdien av litt mer på en øvre ressursgrense. |

En grense med null slakk er **aktiv**. En grense med ledig kapasitet har
alltid verdi null. Men også en aktiv grense kan ha verdi null. Marginalene er lokale:
ved større endringer må du løse modellen igjen
([uke 11.4](uke11.qmd#uke11-sensitivitet)).

::: {.details title="Egen notebook: last ned oppsettet og kom i gang"}

Last ned [project_week11_setup.py](../assets/project_week11_setup.py){download="project_week11_setup.py"}
og legg den ved siden av notebooken. Kjør først

```python
from project_week11_setup import *
```

Du trenger NumPy, SciPy og Matplotlib. Oppsettet gir data og ferdige
modell- og figurhjelpere. De to studentfunksjonene skriver du selv.
Kopier cellene i rekkefølge og kontroller med **Restart / Run all** før
levering. Ta med oppsettsfilen.

:::

**Her begynner prosjektarbeidet.** Fra nå av bruker du lineær algebra,
løserresultater og egne sammenligninger.

## 1. Ett prisområde: les markedet

Først har vi ett område, én time og fire kraftverk. Markedet skal dekke
forbruket så billig som mulig. Hvert kraftverk oppgir en kostnad per MWh og hvor
mye det kan levere, altså **kapasiteten**.

| Kraftverk | Kostnad $c_i$ (kr/MWh) | Kapasitet $k_i$ (MW) |
|:--|--:|--:|
| vind | 0 | 30 |
| vannkraft | 10 | 50 |
| import | 40 | 30 |
| gass | 70 | 40 |

Import behandles som et kraftverk. Med produksjonsvektor
$x=(x_1,x_2,x_3,x_4)^T$ og forbruk $D$ er modellen

$$\min c^Tx\quad\text{slik at}\quad
\mathbf1^Tx=D,\qquad 0\le x_i\le k_i.$$

**Koble sum og vektor:** Skriv $c^Tx$ som en sum med de fire kostnadene.
Hvilken rad i `A_eq` uttrykker at all produksjon til sammen skal bli $D$?
Dette er samme rad-for-rad-tenkning som i [uke 3](uke3.qmd).

### Se planen før du leser tallene

Figuren ordner kraftverkene fra billigst til dyrest. Bredden er kapasitet,
og den røde linjen viser forbruket. Forutsi hvilke kraftverk som må brukes
ved `D=90`. Kjør så cellen; du trenger ikke lage en full tabell for hånd.

```{pyodide-python}
#| label: project11-merit-order
show_merit_order(cost, capacity, D=90)
```

Et kraftverk som kan skrus litt opp eller ned i den beste planen, er
**marginalt**. Det produserer altså mer enn null, men mindre enn full kapasitet. Nå sammenligner du
prisen med både det marginale kraftverkets kostnad og gjennomsnittskostnaden.

Cellen viser modellen som sendes til `linprog` og skriver ut løsningen.
Kjør cellen med `D` lik 60, 90 og 130 etter tur, og noter én linje med
produksjon, pris og gjennomsnittskostnad for hvert forbruk.

```{pyodide-python}
#| label: project11-one-zone
def one_zone(D):
    return linprog(cost, A_eq=[np.ones(4)], b_eq=[D],
                   bounds=list(zip(np.zeros(4), capacity)), method="highs")

D = 90
res = one_zone(D)
print("status:", res.status)
for name, x in zip(plant_names, res.x):
    print(f"{name:<10}{x:6.1f} MW")
print(f"kostnad {res.fun:g} kr, gjennomsnitt {res.fun/D:.2f} kr/MWh")
print(f"pris {res.eqlin.marginals[0] + 0:g} kr/MWh")
print("avvik i forbrukslikningen:", res.eqlin.residual)
```

**En kort håndsjekk:** For $D=90$ bruker du de billigste kraftverkene først.
Finn produksjonsvektoren og regn ut kostnaden med $c^Tx$. Hvis forbruket
øker fra 90 til 91, hvilket kraftverk justeres, og hva koster den ekstra MWh-en?
Sammenlign med utskriften. Du trenger bare denne ene håndsjekken.

**Les og konkluder:** Hvilket kraftverk er marginalt i hver kjøring?
Sammenlign kostnaden til dette kraftverket med prisen og gjennomsnittet.
Bruk utskriften til å forklare hvorfor pris og gjennomsnitt er ulike tall.

### Fra tre kjøringer til en pristrapp

Nå løser vi modellen for mange verdier av forbruket. **Kodespor 1:** Fullfør `read_market` slik at den
returnerer paret `(pris, gjennomsnittskostnad)` fra et vellykket resultat og
forbruket `D`. Du trenger bare opplysningene i resultattabellen under «Oppsett og begreper».

```{pyodide-python}
#| label: project11-read-market
def read_market(res, D):
    # TODO: returner prisen og gjennomsnittskostnaden.
    return None
```

Løkken bruker funksjonen din til å tegne begge kurvene. Forbruket går i halve
tall, slik at vi unngår punkter der prisen kan ha to ulike ensidige verdier.

```{pyodide-python}
#| label: project11-price-steps
Ds = np.arange(0.5, 150, 1.0)
prices = np.zeros(len(Ds))
averages = np.zeros(len(Ds))
for i, D in enumerate(Ds):
    prices[i], averages[i] = read_market(one_zone(D), D)
show_steps(Ds, prices, averages, xlabel="Forbruk D (MW)")
```

**Les og konkluder:** Finn de tre stedene der priskurven hopper. Koble hvert trinn
til kapasitetene i kraftverkstabellen. Hvorfor trenger ikke gjennomsnittskostnaden
å hoppe når et nytt kraftverk blir marginalt?

## 2. Kontroller prisen og kapasiteten

Nå kontrollerer vi prisen fra løseren ved å løse modellen på nytt med litt
endret forbruk. En marginal er et **lokalt anslag**, ikke et løfte for enhver endring.
Den oppgitte prisen $\lambda$ gir anslaget

$$C(D+\Delta D)\approx C(D)+\lambda\Delta D,$$

der $C(D)$ er den laveste samlede kostnaden. Så lenge vi holder oss på
ett rett stykke av kostnadskurven, er anslaget eksakt. Ved et knekkpunkt kan det være ulike endringsrater på hver side;
derfor trenger ikke én rapportert dualverdi å passe begge veier.

Cellen sammenligner prisen med kostnadsendringen ved én MW mer og én MW
mindre. Forutsi først hvilket av de tre forbrukene som skiller seg ut.

```{pyodide-python}
#| label: project11-finite-difference
print(" D   pris   kostnad ved 1 MW mer   spart ved 1 MW mindre")
for D in (60, 80, 90):
    r = one_zone(D)
    more = one_zone(D + 1).fun - r.fun
    less = r.fun - one_zone(D - 1).fun
    print(f"{D:3}{r.eqlin.marginals[0]:7g}{more:22g}{less:24g}")
```

**Les og konkluder:** For hvilke forbruk er én pris nok til å beskrive begge endringene?
Hvorfor er `D=80` annerledes? Forklar ut fra hvilke kraftverk som kan justeres;
du trenger ingen ny derivasjon. En annen løserversjon kan velge en annen gyldig dualverdi
akkurat på trinnet; derfor er det kostnadsendringene ved én MW mer og mindre
som er kontrollen din.

### Komplementær slakk fra utskriften

Fra [uke 11.3](uke11.qmd#uke11-slakk) har vi disse reglene:

| Kraftverkets tilstand | Forhold mellom kostnad $c_i$ og pris $\lambda$ |
|:--|:--|
| Mellom null og kapasitet | $c_i=\lambda$ |
| Full kapasitet | $c_i\le\lambda$ |
| Ingen produksjon | $c_i\ge\lambda$ |

For denne modellen er kapasitetsverdien $\mu_i=-$`res.upper.marginals[i]`.
Prisene gir dessuten en nedre kostnadsgrense
$\lambda D-\mu^Tk$, med $\mu\ge0$ og $\lambda\mathbf1-\mu\le c$.
Denne sammenhengen er gitt; oppgaven din er å lese og kontrollere tallene.

Cellen skriver ut produksjon, ledig kapasitet og kapasitetsverdi.
Sammenlign også den nedre kostnadsgrensen med kostnaden fra løseren.

```{pyodide-python}
#| label: project11-slackness
D = 100
res = one_zone(D)
price = res.eqlin.marginals[0]
mu = -res.upper.marginals
print("kraftverk   produksjon   ledig kapasitet   kapasitetsverdi")
for name, x, slack, value in zip(plant_names, res.x, res.upper.residual, mu):
    print(f"{name:<12}{x:10g}{slack:18g}{value + 0:19g}")
print("pris:", price, "  kostnad:", res.fun, "  prisgrense:", price*D - mu @ capacity)
```

**Les og konkluder:** Finn ett kraftverk i hver tilstand og kontroller
reglene. For hvilket kraftverk har mer kapasitet verdi, og hvilken produksjon ville
den ekstra kapasiteten erstatte? Hvorfor er ledig kapasitet og en kapasitetsverdi på null
to forskjellige opplysninger?

## 3. To områder og en linje

Nå deler vi markedet i nord og sør. Nord har billig kraft, men linjen
sørover har en kapasitetsgrense. Vi vil undersøke både prisforskjellen og hva det er
verdt å bygge en litt sterkere linje.

| Område | Kraftverk (kostnad, kapasitet) | Forbruk (MW) |
|:--|:--|--:|
| Nord | vind (0 kr, 20 MW), vannkraft (10 kr, 80 MW) | 30 |
| Sør | import (40 kr, 30 MW), gass (70 kr, 80 MW) | 80 |

Flyten $f$ er positiv fra nord til sør og har grensene $-L\le f\le L$.
Med rekkefølgen `(vind N, vann N, import S, gass S, f)` er balansene

$$\begin{pmatrix}1&1&0&0&-1\\0&0&1&1&1\end{pmatrix}x
=\begin{pmatrix}30\\80\end{pmatrix}.$$

**Les en matrisrad:** Skriv de to radene som hver sin sum. Forklar hvorfor
$f$ har ulikt fortegn i de to radene, og hvorfor flyten forsvinner når du
legger sammen radene.

Forutsi om områdene kan ha ulik pris når linjen har mye ledig kapasitet.
Cellen løser samme modell for flere verdier av linjekapasiteten `L` og viser
også den lokale verdien av mer linjekapasitet. For `L>0` flyttes begge
grensene `(-L, L)` utover når linjen utvides, og derfor er verdien `lower.marginals[4] - upper.marginals[4]`.

```{pyodide-python}
#| label: project11-two-zones
print("  L   kostnad   pris N   pris S   flyt   ledig mot sør   linjeverdi")
for L in (20, 40, 55, 70, 100):
    r = two_zones(L)
    pN, pS = r.eqlin.marginals
    value = r.lower.marginals[4] - r.upper.marginals[4]
    print(f"{L:3}{r.fun:10g}{pN:9g}{pS:9g}{r.x[4] + 0:7g}"
          f"{r.upper.residual[4]:16g}{value + 0:13g}")
```

**Les og konkluder:** Sammenlign `L=40`, `55` og `100`. Når er prisene like,
og når er linjen full mot sør? Forklar prisen i nord ved `L=100` ved å se
på hvor en ekstra MW til forbruket i nord måtte komme fra.

Hvis du vil se planen som en figur, velger du linjegrensen fra én av kjøringene i cellen under. Figuren viser
hvilke kraftverk som produserer på hver side av linjen.

```{pyodide-python}
#| label: project11-line-picture
L = 40
show_two_zones(two_zones(L), L)
```

### Hvor lenge virker linjeverdien?

Prisreglene for denne tapsfrie modellen er gitt her:

- **Full mot sør, $f=L>0$:** Linjeverdien er $\lambda_S-\lambda_N$.
- **Ledig begge veier, $-L<f<L$:** Linjeverdien er null og prisene er like.
- **Ved et knekkpunkt:** En full linje kan ha verdi null. At linjen er full,
  er ikke alene nok til å vite at mer kapasitet senker kostnaden.

En lokal verdi gjelder bare mens de samme begrensningene bestemmer
kostnadsendringen. Nå tester du både en liten og en større utvidelse fra
`L=40`, og én ekstra MW fra `L=70`. Linjeverdien gir en forutsigelse som
du skal sammenligne med nye løsninger; du skal ikke utlede den for hånd.

```{pyodide-python}
#| label: project11-line-change
for L, extra in ((40, 1), (40, 40), (70, 1)):
    base = two_zones(L)
    value = base.lower.marginals[4] - base.upper.marginals[4]
    changed = two_zones(L + extra)
    print(f"L={L}, ekstra={extra}: anslått spart {value*extra:g}, "
          f"faktisk spart {base.fun - changed.fun:g}, ny plan {changed.x}")
```

**Les og konkluder:** I hvilke forsøk stemmer anslaget, og i hvilke stemmer det ikke?
Bruk produksjonsplanene til å peke på hvilken grense som skifter rolle.
Sammenlign særskilt `L=70` med én ekstra MW: er «full» det samme som
«verdifull å utvide»?

## 4. Vannkraft med begrenset vann

En MWh vann brukt nå kan ikke brukes i en dyrere time senere. Vi ser derfor
på tre timer samtidig. Kraftverkene har kostnadene fra del 1; vind varierer,
og vannkraften kan levere høyst 50 MW per time og bruke høyst **120 MWh vann
til sammen**.

| Time | 1 | 2 | 3 |
|:--|--:|--:|--:|
| Forbruk (MW) | 60 | 95 | 120 |
| Tilgjengelig vind (MW) | 30 | 10 | 20 |

### Bygg én rad i modellen

Variablene kommer i tre grupper, én per time, hver i rekkefølgen `(vind, vann, import, gass)`.
Vannkravet er

$$x_{\text{vann},1}+x_{\text{vann},2}+x_{\text{vann},3}\le120.$$

**Kodespor 2:** Fullfør `make_water_row` slik at den returnerer en
`(1, 12)`-matrise som velger ut akkurat de tre vannvariablene. Forklar
hvordan `A_water @ x` da blir summen over de tre timene. Dette er den samme
koblingen mellom en sum og en matrisrad som i del 1. Kontrollen bruker
2, 3 og 5 MWh vann i de tre timene; summen skal bli 10 MWh. Rett raden
før du løser modellen dersom kontrollen ikke stemmer.

```{pyodide-python}
#| label: project11-water-row
def make_water_row():
    row = np.zeros((1, 12))
    # TODO: sett 1 på plassene til vannkraft; behold 0 ellers.
    return row

example = np.array([0., 2., 0., 0., 0., 3., 0., 0., 0., 5., 0., 0.])
print("vannmengde fra din rad:", (make_water_row() @ example)[0])
print("forventet vannmengde: 10 MWh")
```

Resten av tretimersmodellen er gitt i oppsettet: `A_eq3` har én
forbrukslikning per time. Cellen bruker vannraden din og skriver ut planen,
prisene og **vannverdien**, altså spart kostnad per MWh ekstra vann.

```{pyodide-python}
#| label: project11-hydro
A_water = make_water_row()
res3 = linprog(c3, A_ub=A_water, b_ub=[water], A_eq=A_eq3, b_eq=demand3,
               bounds=bounds3, method="highs")
print("status:", res3.status, "  kostnad:", res3.fun)
print("time   vind  vann  import  gass   pris")
for h in range(3):
    print(f"{h + 1:4}", *[f"{v:6g}" for v in res3.x[4*h:4*h + 4]],
          f"{res3.eqlin.marginals[h]:6g}")
print("vann brukt:", (A_water @ res3.x)[0], "av", water)
print("ledig vann:", res3.ineqlin.residual[0])
print("vannverdi:", -res3.ineqlin.marginals[0] + 0, "kr/MWh")
```

**Les og konkluder:** I hvilken time kunne vannkraften bruke litt mer vann
uten å nå 50 MW-grensen? Hvilket annet kraftverk ville den erstatte? Bruk
kostnadsforskjellen til å tolke vannverdien i utskriften. Sammenlign også
`10 + vannverdi` med prisene; hva endres når vannkraften går for fullt?

### Når slutter vannet å være knapt?

Den neste cellen gjentar løsningen for flere vannmengder og kontrollerer én
liten økning fra 120 MWh. Forutsi først om mer vann alltid har samme verdi.

```{pyodide-python}
#| label: project11-water-steps
A_water = make_water_row()
Ws = np.arange(50.5, 160, 1.0)
values = []
for W in Ws:
    r = linprog(c3, A_ub=A_water, b_ub=[W], A_eq=A_eq3, b_eq=demand3,
                bounds=bounds3, method="highs")
    values.append(-r.ineqlin.marginals[0])
show_steps(Ws, values, xlabel="Vannmengde W (MWh)", ylabel="Vannverdi (kr/MWh)")
for W in (40, 120, 121, 140):
    r = linprog(c3, A_ub=A_water, b_ub=[W], A_eq=A_eq3, b_eq=demand3,
                bounds=bounds3, method="highs")
    if r.success:
        print(f"W={W}: kostnad {r.fun:g}, ledig vann {r.ineqlin.residual[0]:g}, "
              f"vannverdi {-r.ineqlin.marginals[0] + 0:g}")
    else:
        print(f"W={W}: status {r.status}, ingen tillatt plan")
```

**Les og konkluder:** Kontroller vannverdien ved 120 MWh mot besparelsen ved
121 MWh. Finn trinnene i figuren og forklar ett av dem med hvilket kraftverk
vannet erstatter. Bruk utskriften til å skille mellom «vann har verdi null»
og «det finnes ingen tillatt plan».

## 5. Din undersøkelse: bruk et lokalt prisanslag

Du har undersøkt både linje- og vannverdier. Nå velger du **ett** tiltak og
tester hvor langt en forutsigelse med startmodellens dualverdi holder.
Du trenger ikke bygge en ny modell.

- **Mer vind i nord:** Bruk `two_zones(40, wind_north=20 + delta)` og
  vindverdien `-two_zones(40).upper.marginals[0]` fra startmodellen.
- **Mer vann:** Bruk tretimersmodellen, vannraden din og startmodellens
  vannverdi ved 120 MWh.

Gjør én liten og én større endring. Du velger størrelsene; målet er å finne
både et tilfelle der anslaget virker og et der en annen grense tar over.

1. Skriv forventet besparelse som `dualverdi * endring` før du løser på nytt.
2. Skriv ut faktisk besparelse og produksjonsplan for hver endring.
3. Forklar med tallene hvilken grense som gjør anslaget for den store endringen
   mindre presist. Hvis anslaget fortsatt stemmer, velg en enda større endring.

**Ta med videre:** Et lokalt anslag er nyttig fordi du slipper å løse modellen på
nytt for små endringer. En ny løsning og dens slakk viser når du trenger et nytt
anslag. Skill mellom det prisregelen sier under sine forutsetninger og det
dine konkrete forsøk viser.

::: {#project11-battery}
:::

## Spørsmål du skal kunne svare på

Disse spørsmålene samler ideene; de er ikke en ekstra innleveringsdel.

1. Hvordan leser du kostnad og forbrukskrav fra vektorer og matrisrader?
2. Hvorfor er gjennomsnittskostnad og pris forskjellige tall?
3. Hvordan kontrollerer du en marginal med to nye kostnadsverdier?
4. Hva forteller ledig kapasitet og kapasitetsverdi om et kraftverk?
5. Når kan en full linje ha verdi null, og når er linjeverdien prisforskjellen?
6. Hva betyr vannverdien, og hvordan ser du hvilken time som kan bruke mer vann?
7. Hvorfor må et lokalt prisanslag kontrolleres ved en større endring?

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med de to studentfunksjonene,
oppsettsfilen og disse resultatene:

- pristrappen og en kort forklaring av pris mot gjennomsnitt;
- kontrollen ved `D=80` og ett eksempel på komplementær slakk;
- sammenligningen av linjeutvidelsene fra del 3, med forklaring av rollebyttet;
- vannraden, figuren av vannverdi og kontrollen med 1 MWh ekstra vann;
- din undersøkelse fra del 5: forventning, faktisk endring og en avgrenset konklusjon.

Bruk omtrent **150–250 ord til sammen** på konklusjonene, gjerne ved siden av
de tilhørende utskriftene. Du trenger ikke skrive en egen samlet rapport eller
svare på alle repetisjonsspørsmålene.
