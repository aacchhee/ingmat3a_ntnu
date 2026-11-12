## Hvorfor koster strømmen det den koster?

Du har kanskje sett at strømprisen kan være forskjellig i to deler av landet i samme time. Norge er
delt i flere **prisområder**, og hvert har sin egen pris. Men hvor kommer prisen fra?

Tenk på én time i ett område. Flere kraftverk kan levere strøm, og hvert oppgir hvor mye det kan
levere og hva det koster. Markedet velger den billigste planen som dekker forbruket, og alle som
leverer, får samme pris per MWh. Det er samme type oppgave som verkstedet i uke 11, bare med lavest
kostnad i stedet for størst fortjeneste.

Vi bygger et lite, oppdiktet kraftmarked og bruker `linprog` til å undersøke tre spørsmål:

- Hvilket kraftverk bestemmer prisen når forbruket øker litt?
- Når kan en overføringslinje gi ulike priser i to områder?
- Hvorfor har vannet i et magasin verdi selv om regnet er gratis?

En **overføringslinje** er en kraftledning mellom to områder, og et **magasin** er en innsjø der
vannkraftverket lagrer vann. Svarene er tall som løseren regner ut; jobben din er å kontrollere og
forklare dem.

### Bakgrunn: slik leser vi kraftmarkedet

Dette er en kort orientering, ikke en egen oppgavedel. Du trenger ingen forkunnskaper i økonomi.

**Enheter.** 1 MW levert i én time gir 1 MWh strøm. Vi ser på én time om gangen, så 1 MW ekstra
forbruk er 1 MWh ekstra strøm. Kostnader og priser står i kr/MWh.

**Fra verkstedet til kraftmarkedet:**

| Verkstedet i uke 11 | Kraftmarkedet her |
|:--|:--|
| Eieren vil ha størst fortjeneste. | Markedet vil ha lavest samlet kostnad. |
| Verkstedet har 9 maskintimer i uka. | Hvert kraftverk har en **kapasitet**: høyst så mange MW. |
| **Slakk:** ubrukte maskintimer. | **Ledig kapasitet:** MW et kraftverk kunne levert i tillegg. |
| **Ressurspris:** hva én maskintime mer er verdt. | **Pris:** hva det koster å dekke 1 MW mer forbruk på billigste måte. |
| Prisen gjelder bare for de første halvannen ekstra timene. | Prisen gjelder bare for små endringer (del 2). |

Løseren regner ut slike priser. I [uke 11.3](uke11.qmd#uke11-dual) kalte vi dem ressurspriser eller
**dualverdier**; her heter de pris, kapasitetsverdi, linjeverdi og vannverdi.

Alle tall er oppdiktede, og modellen er forenklet. Vi antar at

- forbruket er fast: kundene bruker like mye strøm uansett pris,
- kostnadene er kjente,
- all strøm som sendes, kommer fram (ingen tap i ledningene),
- et kraftverk kan levere et hvilket som helst antall MW mellom null og kapasiteten, slik
  verkstedet kunne lage deler av et parti.

Modellen skal forklare sammenhenger, ikke forutsi den faktiske strømprisen.

### En vei gjennom prosjektet

| Del | Det du undersøker |
|:--|:-- |
| 1 | Hvilket kraftverk bestemmer prisen, og hvorfor er prisen ikke gjennomsnittskostnaden? |
| 2 | Stemmer prisen når forbruket endres med 1 MW? Hva er mer kapasitet verdt? |
| 3 | Når får nord og sør ulik pris, og hva er en sterkere linje verdt? |
| 4 | Hva er 1 MWh ekstra vann verdt, og når er vannet ikke lenger knapt? |
| 5 og levering | Hvor langt holder en forutsigelse med en verdi fra løseren? Samle konklusjonene. |

Sett av omtrent **4–6 timer**. Du skriver to korte funksjoner; resten er å velge forsøk, lese
utskriftene og forklare tallene. Skriv en kort forventning før hver sammenligning. Du trenger ikke
bevise prisreglene; de står på siden.

### Oppsett og begreper

På nettsiden er dataene, `one_zone`, `two_zones` og figurhjelperne allerede lastet inn. De to
funksjonene du skriver selv, `read_market` og `make_water_row`, må du kjøre på nytt hver gang siden
lastes inn; cellene som bruker dem, trenger dem. Alle andre celler kan kjøres alene.

Tabellen er et oppslag; du trenger den først i del 1. `res` er resultatet fra `linprog`.

| Les i resultatet | Betydning |
|:--|:--|
| `res.status`, `res.success` | Sjekk først: 0 betyr at løseren fant en plan, 2 at kravene ikke kan oppfylles samtidig. |
| `res.x`, `res.fun` | Produksjonen i hvert kraftverk og hva den billigste planen koster. |
| `res.eqlin.marginals` | Prisen: hvor mye kostnaden øker per MW ekstra forbruk (ett tall per område eller time). |
| `res.upper.residual` | Ledig kapasitet (slakk): kapasitet minus produksjon. |
| `-res.upper.marginals` | Kapasitetsverdien: hva 1 MW mer kapasitet sparer. |
| `-res.ineqlin.marginals` | Vannverdien i del 4: hva 1 MWh mer vann sparer. |

**Hvorfor minus?** SciPy gir hvor mye kostnaden endres. Mer kapasitet eller mer vann kan aldri gjøre
kostnaden høyere, så tallet er negativt eller null, og det du sparer, er minus tallet. (I uke 11
kom minuset av at SciPy minimerte $-P$.)

Som i uke 11 er en grense **aktiv** når slakken er null: kraftverket går for fullt. Et kraftverk
med ledig kapasitet har kapasitetsverdi null. Men også et kraftverk som går for fullt, kan ha verdi
null. Verdiene gjelder for små endringer; ved større endringer løser du modellen på nytt
([uke 11.4](uke11.qmd#uke11-sensitivitet)).

::: {.details title="Egen notebook: last ned oppsettet og kom i gang"}

Last ned [project_week11_setup.py](../assets/project_week11_setup.py){download="project_week11_setup.py"}
og legg den ved siden av notebooken. Kjør først

```python
from project_week11_setup import *
```

Du trenger NumPy, SciPy og Matplotlib. Oppsettet gir data og ferdige
modell- og figurhjelpere. De to funksjonene du skriver selv (`read_market` og `make_water_row`), er ikke med i filen.
Kopier cellene i rekkefølge og kontroller med **Restart / Run all** før
levering. Ta med oppsettsfilen.

:::

**Her begynner prosjektarbeidet.** Fra nå av kjører du celler, leser tallene og forklarer dem med
vektorer, matriser og prisene fra uke 11.

## 1. Ett prisområde: les markedet

Først ser vi på ett prisområde i én time. Alle kraftverkene og kundene i området er koblet sammen,
så hele området får én pris. Fire kraftverk kan levere. Markedet skal dekke forbruket så billig som
mulig, slik eieren i uke 11 ville ha størst mulig fortjeneste. Hvert kraftverk oppgir en kostnad
per MWh og hvor mye det kan levere, altså **kapasiteten**.

| Kraftverk | Kostnad $c_i$ (kr/MWh) | Kapasitet $k_i$ (MW) |
|:--|--:|--:|
| vind | 0 | 30 |
| vannkraft | 10 | 50 |
| import | 40 | 30 |
| gass | 70 | 40 |

**Import** er strøm som kjøpes fra et naboområde: høyst 30 MW, til 40 kr/MWh. I modellen oppfører
den seg som et kraftverk.

Nå oversetter vi markedet til matematikk, som verkstedet i uke 11:

| I markedet | I matematikken |
|:--|:--|
| En plan: hvor mange MW vind, vannkraft, import og gass leverer | Produksjonsvektoren $x=(x_1,x_2,x_3,x_4)^T$ |
| Hva planen koster | $c^Tx$ kroner, der $c$ er kostnadene i tabellen |
| Forbruket $D$ må dekkes nøyaktig | $\mathbf1^Tx=D$, der $\mathbf1=(1,1,1,1)^T$ |
| Ingen kan levere mer enn kapasiteten | $0\le x_i\le k_i$ for hvert kraftverk |
| Den billigste planen | Minimum av $c^Tx$ |

Modellen er altså

$$\min c^Tx\quad\text{slik at}\quad
\mathbf1^Tx=D,\qquad 0\le x_i\le k_i.$$

**Koble sum og vektor:** Skriv $c^Tx$ som en sum med de fire kostnadene.
Hvilken rad i `A_eq` uttrykker at all produksjon til sammen skal bli $D$? Du finner `A_eq` i
cellen etter figuren. Dette er samme rad-for-rad-tenkning som i [uke 3](uke3.qmd#uke3-del1): én rad
i matrisen gir én måling.

### Se planen før du leser tallene

Figuren ordner kraftverkene fra billigst til dyrest. Hver blokk er ett kraftverk: bredden er
kapasiteten, og høyden er kostnaden per MWh. Den røde linjen viser forbruket. Forutsi hvilke kraftverk som må brukes
ved `D=90`. Kjør så cellen; du trenger ikke lage en full tabell for hånd.

```{pyodide-python}
#| label: project11-merit-order
show_merit_order(cost, capacity, D=90)
```

Et kraftverk som kan skrus litt opp eller ned i den beste planen, er **marginalt**. Det produserer
altså mer enn null, men mindre enn full kapasitet. **Gjennomsnittskostnaden** er samlet kostnad
delt på forbruket, altså hva én MWh koster i snitt. Nå sammenligner du prisen med både det
marginale kraftverkets kostnad og gjennomsnittskostnaden.

Cellen viser modellen som sendes til `linprog` og skriver ut løsningen. Kjør den først med
`D = 90`, endre så tallet til 60 og til 130 og kjør på nytt. Noter én linje med produksjon, pris og
gjennomsnittskostnad for hvert forbruk. Den siste linjen i utskriften er en kontroll: avviket 0
betyr at produksjonen dekker forbruket nøyaktig.

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

Planen er et hjørne, som i uke 11: vind og vann går for fullt og gass står stille, og sammen med forbrukslikningen gir det et lineært likningssett med fire likninger og fire ukjente.

**Les og konkluder:** Hvilket kraftverk er marginalt i hver kjøring?
Sammenlign kostnaden til dette kraftverket med prisen og gjennomsnittet.
Bruk utskriften til å forklare hvorfor pris og gjennomsnitt er ulike tall.

### Fra tre kjøringer til en pristrapp

Nå løser vi modellen for mange verdier av forbruket. **Kodespor 1:** Fullfør `read_market` slik at den
returnerer paret `(pris, gjennomsnittskostnad)` fra et vellykket resultat og
forbruket `D`. Du trenger bare opplysningene i resultattabellen under «Oppsett og begreper». Cellen over regner ut de samme to tallene.

```{pyodide-python}
#| label: project11-read-market
def read_market(res, D):
    # TODO: returner prisen og gjennomsnittskostnaden.
    return None
```

Løkken bruker funksjonen din til å tegne begge kurvene. Forbruket går gjennom 0.5, 1.5, 2.5, … MW.
Da treffer vi aldri nøyaktig et forbruk der et kraftverk akkurat blir fullt. Der kan prisen være én
verdi rett under og en annen rett over, som du ser i del 2.

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

Nå kontrollerer vi prisen fra løseren ved å løse modellen på nytt med litt endret forbruk. Du har
allerede gjort det én gang for hånd: ved $D=90$ kostet 1 MW ekstra 40 kroner, akkurat prisen fra
løseren.

Prisen fra løseren er et **lokalt anslag**: den sier hva en liten endring koster, ikke hva enhver
endring koster. Den oppgitte prisen $\lambda$ gir anslaget

$$C(D+\Delta D)\approx C(D)+\lambda\Delta D,$$

der $C(D)$ er den laveste samlede kostnaden ved forbruket $D$. Kostnaden $C(D)$ består av rette
stykker, som kurven for verkstedets beste fortjeneste i
[uke 11.4](uke11.qmd#uke11-sensitivitet). Så lenge vi holder oss på ett rett stykke, er anslaget
eksakt. I et knekkpunkt, der et kraftverk akkurat blir fullt, er stigningen ulik på hver side. Da
kan ikke ett tall passe begge veier.

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
du trenger ikke regne med derivasjon. En annen løserversjon kan velge en annen gyldig dualverdi
akkurat på trinnet; derfor er det kostnadsendringene ved én MW mer og mindre
som er kontrollen din.

### Komplementær slakk fra utskriften

Fra [uke 11.3](uke11.qmd#uke11-slakk) har vi disse reglene:

| Kraftverkets tilstand | Forhold mellom kostnad $c_i$ og pris $\lambda$ |
|:--|:--|
| Mellom null og kapasitet | $c_i=\lambda$ |
| Full kapasitet | $c_i\le\lambda$ |
| Ingen produksjon | $c_i\ge\lambda$ |

I ord: et kraftverk som kan skrus opp og ned, koster akkurat prisen. Et kraftverk som går for
fullt, er billigere enn prisen og ville gjerne levert mer. Et kraftverk som står stille, er for
dyrt ved denne prisen.

**Kapasitetsverdien** $\mu_i=-$`res.upper.marginals[i]` er det 1 MW mer kapasitet i kraftverk $i$
sparer. Ved $D=60$ er prisen 10, og 1 MW mer vind ville erstattet 1 MW vannkraft: vinden sparer
$10-0=10$ kroner.

Prisene gir også et bevis, som leien i [uke 11.3](uke11.qmd#uke11-dual), bare snudd: der ga
prisene et tak for fortjenesten, her gir de et gulv for kostnaden. Ingen plan kan koste mindre enn
$\lambda D-\mu^Tk$, så lenge $\mu\ge0$ og $\lambda\mathbf1-\mu\le c$ (altså $\lambda-\mu_i\le c_i$
for hvert kraftverk). Utskriften kaller dette tallet `prisgrense`. Når gulvet er lik kostnaden til
en plan, finnes det ingen billigere plan, akkurat som $27=27$ i verkstedet.
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
reglene. For hvilke kraftverk har mer kapasitet verdi, og hvilken produksjon ville den ekstra
kapasiteten erstatte? Hvorfor er ledig kapasitet og en kapasitetsverdi på null to forskjellige
opplysninger? Tips: kjør cellen også med `D = 80`, der vannkraften akkurat går for fullt, og se på
kapasitetsverdien.

## 3. To områder og en linje

Nå deler vi markedet i nord og sør. Mellom dem går en **linje**, altså en kraftledning, som kan
frakte høyst $L$ MW. Nord har billig kraft, men linjen sørover har en kapasitetsgrense. Vi vil
undersøke både prisforskjellen og hva det er verdt å bygge en litt sterkere linje. Legg merke til
at kapasitetene og forbruket er andre enn i del 1.

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
også den lokale verdien av mer linjekapasitet. Flyten har to grenser, $-L$ og $L$, og SciPy gir én
verdi for hver: `lower.marginals[4]` og `upper.marginals[4]`. Når linjen utvides (med $L>0$),
flytter begge grensene seg utover, den ene opp og den andre ned. Derfor er linjeverdien
`lower.marginals[4] - upper.marginals[4]`. Her går flyten sørover, så det er den øvre grensen som
teller.

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

Hvis du vil se planen som en figur, endrer du `L = 40` i cellen under til én av verdiene fra
tabellen (20, 55, 70 eller 100). Figuren viser
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

En linjeverdi gjelder bare så lenge de samme grensene er aktive, på samme måte som maskintimeprisen
i [uke 11.4](uke11.qmd#uke11-sensitivitet) bare gjaldt for de første halvannen timene. Nå tester du både en liten og en større utvidelse fra
`L=40`, og én ekstra MW fra `L=70`. Linjeverdien gir en forutsigelse som
du skal sammenligne med nye løsninger; du skal ikke utlede den for hånd.
Den nye planen skrives ut i rekkefølgen (vind N, vann N, import S, gass S, $f$).

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

En MWh vann brukt nå kan ikke brukes i en dyrere time senere. Vi ser derfor på tre timer samtidig.
Vannet måles i strømmen det kan gi: 1 MWh vann er vann nok til å lage 1 MWh strøm. Kraftverkene har
kostnadene fra del 1, og import og gass har kapasitetene fra del 1 (30 og 40 MW) i hver time. Vind
varierer, og vannkraften kan levere høyst 50 MW per time og bruke høyst **120 MWh vann til
sammen**.

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
Kraftselskapene bruker det samme ordet: vannverdien er det vannet i magasinet er verdt.

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
tester hvor langt en forutsigelse med verdien fra startmodellen (vindverdien eller vannverdien) holder.
Du trenger ikke bygge en ny modell.

- **Mer vind i nord:** Bruk `two_zones(40, wind_north=20 + delta)` og
  vindverdien, altså hva 1 MW mer vind i nord sparer: `-two_zones(40).upper.marginals[0]` fra startmodellen.
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
anslag. Skill mellom det regelen lover (bare for små endringer) og det forsøkene dine faktisk viser.

::: {#project11-battery}
:::

## Spørsmål du skal kunne svare på

Disse spørsmålene samler ideene; de er ikke en ekstra innleveringsdel.

1. Hvordan leser du kostnad og forbrukskrav fra vektorer og matrisrader?
2. Hvorfor er gjennomsnittskostnad og pris forskjellige tall?
3. Hvordan kontrollerer du en pris fra løseren (en marginal) med to nye kostnadsverdier?
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
