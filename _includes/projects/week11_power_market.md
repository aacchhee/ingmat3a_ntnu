## Hvorfor koster strømmen det den koster?

Du har kanskje sett at strømprisen i Sør-Norge kan være mange ganger så høy
som i Midt-Norge i samme time. Noen dager er prisen nesten null, andre dager
er den høy. I dette prosjektet finner du ut hvor disse tallene kommer fra.
Svaret er mer matematisk enn du kanskje tror: prisene er **dualvariabler** i
et lineært program, akkurat som ressursprisene i verkstedet fra
[uke 11](uke11.qmd#uke11-dual).

Slik virker strømmarkedet i vår forenklede versjon. Hver time oppgir hvert
kraftverk hva det koster å produsere én MWh til. Markedet velger den
billigste kombinasjonen av kraftverk som dekker forbruket. Det er et
minimeringsproblem, et LP. Etterpå får alle kraftverkene i området **samme
pris** for hver MWh de leverer. Tre ting ved dette virker rart:

- Alle får betalt prisen til det dyreste kraftverket som er i drift, selv
  når nesten all kraften er billig.
- To deler av landet kan ha ulik pris i samme time.
- Vann i et magasin har en pris, selv om regnet er gratis.

Når du er ferdig, kan du forklare alle tre med dine egne tall.

**Du trenger ingen økonomi.** I hele prosjektet betyr *prisen* i et område
ett bestemt tall som vi kan regne ut: **prisen er hvor mye den billigste
samlede kostnaden øker når forbruket øker med 1 MW.** Det er en derivert:
endringen i minste kostnad per MW ekstra forbruk. (På et trappetrinn finnes
det to slike tall, ett for mer og ett for mindre forbruk. Det ser du i 1c.)
I del 1 og 2 ser du at tallet er dualvariabelen til likningen «produksjon =
forbruk».

**Alle tall i prosjektet er oppdiktede og sterkt forenklede.** Ekte
kraftverk oppgir priser i mange trinn, og det finnes tap i nettet, kostnader
ved å starte og stoppe kraftverk og usikkerhet om vær og forbruk. Vi antar
dessuten at forbruket er fast (det reagerer ikke på prisen), og at
kraftverkene oppgir de virkelige kostnadene sine. Modellen beholder bare det
som trengs for å se matematikken. I Norge settes prisen oftest av vannverdien
(del 4), ikke av gass.

### En vei gjennom prosjektet

| Del | Spørsmålet | Det du tar med videre |
|:--|:--|:--|
| 1. Ett prisområde | Hvilke kraftverk produserer, og hva blir prisen? | En håndløsning, `linprog` og en pristrapp. |
| 2. Prisen er en dualvariabel | Hvorfor er prisen kostnaden til det marginale kraftverket? | En kontroll med to løsninger, et prisbevis og komplementær slakk i ord. |
| 3. To områder og en linje | Når får to områder ulik pris? | Hva én MW mer linje er verdt, og hvorfor. |
| 4. Vannkraft med lite vann | Hva er vannet verdt? | Vannverdien som dualvariabel. |
| 5. Din undersøkelse | Kan dualvariablene forutsi et tiltak? | En forutsigelse, en kontroll og grensen for anslaget. |

Sett av omtrent 4–6 timer. Gjør papirregningene før du kjører koden, og
skriv ned en forventning før hvert forsøk. Det gjør ingenting om
forventningen er feil. Det er ofte der du lærer mest.

### Det vi trenger fra uke 11

Vi bruker tre ideer fra verkstedet. Her er de i ord:

- **Den beste planen ligger i et hjørne.** I et LP er målet og kravene
  lineære. Når det finnes tillatte planer og området er begrenset, ligger en
  beste plan i et hjørne. Et hjørne er et punkt der like mange grenser er
  nådd (**aktive**) som det er ukjente ([11.1](uke11.qmd#uke11-hjorner)).
- **Priser kan bevise at en plan er best.** Hver grense kan få en pris (en
  dualvariabel). I verkstedet ga prisene en øvre grense for dekningsbidraget.
  Da en plan nådde grensen, var den bevist best ([11.3](uke11.qmd#uke11-dual)).
  En grense som ikke er nådd, har pris null: det er **komplementær slakk**
  ([11.3](uke11.qmd#uke11-slakk)).
- **En pris gjelder lokalt.** Prisen sier hva én enhet mer er verdt, men bare
  så lenge de samme grensene er aktive ([11.4](uke11.qmd#uke11-sensitivitet)).

**Enheter.** Effekt måles i MW og energi i MWh. Vi ser på én time om gangen,
så 1 MW i én time er 1 MWh. Kostnader og priser er i kr per MWh.

### Kjøring på siden eller i egen notebook

Dataene og noen tegnehjelpere lastes automatisk på siden. Kjør cellene i
rekkefølge innenfor hver del.

<details>
<summary>Egen notebook: last ned oppsettet og kom i gang</summary>

Last ned [project_week11_setup.py](../assets/project_week11_setup.py){download="project_week11_setup.py"}
og legg filen ved siden av notebooken. Kjør først

```python
from project_week11_setup import *
```

Miljøet trenger NumPy, SciPy og Matplotlib. Filen inneholder dataene,
funksjonene `one_zone` og `two_zones`, batterimodellen `with_battery`,
kontrollen `water_row_ok` og tegnehjelperne `show_merit_order`, `show_steps`
og `show_two_zones`.
Kopier deretter kodecellene fra prosjektet i rekkefølge. Kontroller til slutt
notebooken med **Restart / Run all**, og ta med oppsettsfilen ved levering.

</details>

## 1. Ett prisområde: billigste først

Vi begynner med det enkleste markedet vi kan tenke oss: ett område, én time
og fire kraftverk. Her kan du finne den billigste planen for hånd. Det er
nyttig, for da vet du hva svaret skal bli når datamaskinen regner. Målet er
å se at prisen og gjennomsnittskostnaden er to forskjellige tall, og å gjette
hvorfor alle får betalt prisen.

| Kraftverk | Kostnad $c_i$ (kr/MWh) | Kapasitet $k_i$ (MW) |
|:--|--:|--:|
| vind | 0 | 30 |
| vannkraft | 10 | 50 |
| import | 40 | 30 |
| gass | 70 | 40 |

**Kapasiteten** er det mest kraftverket kan levere. *Import* er strøm vi
kjøper fra utlandet. Her behandler vi den som et kraftverk som koster 40 kr
per MWh og kan levere høyst 30 MW. La $x_1,\ldots,x_4$ være produksjonen fra
vind, vannkraft, import og gass, og la $D$ være forbruket i MW. Markedet løser

$$\min\;0x_1+10x_2+40x_3+70x_4\quad\text{slik at}\quad x_1+x_2+x_3+x_4=D,\qquad 0\le x_i\le k_i.$$

Med ord: gjør samlet kostnad minst mulig, dekk forbruket nøyaktig, og hold
hvert kraftverk innenfor kapasiteten. Likningen $x_1+x_2+x_3+x_4=D$ kaller vi
**forbrukslikningen**.

### 1a. Løs for hånd

Hvis du skulle dekke forbruket så billig som mulig, ville du brukt det
billigste kraftverket først, så det nest billigste, og så videre. Det kaller
vi **billigste først**. Cellen tegner kraftverkene som en trapp, slik at du
kan se regelen før du regner.

```{pyodide-python}
#| label: project11-merit-order
# Hver blokk er ett kraftverk: bredden er kapasiteten, høyden er kostnaden.
show_merit_order(cost, capacity, D=60)   # bytt til 90 og 130
```

Alt til venstre for den røde linjen er i drift. For $D=60$ gir vind 30 MW
gratis, og de siste 30 MW kommer fra vannkraft til 10 kr. Samlet kostnad er
$30\cdot0+30\cdot10=300$ kr, og gjennomsnittet er $300/60=5$ kr per MWh.
Vannkraft er i bruk, men ikke full. Et slikt kraftverk kaller vi
**marginalt**: det er dette kraftverket som skrus opp eller ned når
forbruket endrer seg litt. Det marginale kraftverket står der den røde linjen
skjærer en blokk.

Fyll ut tabellen for $D=90$ og $D=130$. Bytt gjerne `D` i cellen først.
Første rad er gitt.

| $D$ | vind | vannkraft | import | gass | samlet kostnad | marginalt kraftverk | gjennomsnitt per MWh |
|--:|--:|--:|--:|--:|--:|:--|--:|
| 60 | 30 | 30 | 0 | 0 | 300 | vannkraft | 5.0 |
| 90 | | | | | | | |
| 130 | | | | | | | |

Hvorfor er løsningen et hjørne i betydningen fra uke 11? Tell de aktive
grensene for $D=90$.

<details>
<summary>Regnehjelp: hvorfor er dette et hjørne?</summary>

I verkstedet hadde vi to ukjente, og et hjørne var to aktive grenser. Her har
vi fire ukjente, så et hjørne er fire aktive grenser. For $D=90$ er planen
$(30,50,10,0)$:

- vind er full: $x_1=30$ (aktiv kapasitetsgrense),
- vannkraft er full: $x_2=50$ (aktiv kapasitetsgrense),
- gass står: $x_4=0$ (aktiv nullgrense),
- og forbrukslikningen $x_1+x_2+x_3+x_4=90$ er alltid aktiv.

Det er fire aktive grenser. De bestemmer import: $x_3=90-30-50-0=10$. Import
er det eneste kraftverket som ligger strengt mellom grensene sine. Det er
det marginale kraftverket.

</details>

### 1b. Kontroller med `linprog`

Tabellen din bygger på regelen «billigste først». Nå lar vi `linprog` løse
den samme LP-en uten å vite om regelen. Funksjonen `one_zone(D)` sender
kostnadene som mål, forbrukslikningen som `A_eq` og `b_eq`, og kapasitetene
som `bounds`.

I tillegg til planen skriver cellen ut `res.eqlin.marginals[0]`. Det er
**dualvariabelen til forbrukslikningen**: tallet SciPy regner ut for å vise
at planen er best. Vi kaller den *prisen* allerede nå. I del 2 viser du at
navnet er fortjent. SciPy gir alle slike marginaler på samme måte: som den
lokale endringen i `res.fun` når en høyreside eller en grense økes med én
enhet. Her øker kostnaden når forbruket øker, så tallet er positivt. Målet er å kontrollere tabellen din og se hvilket tall i
tabellen dualvariabelen er lik.

```{pyodide-python}
#| label: project11-one-zone
def one_zone(D):
    # Minimer kostnad slik at produksjonen dekker D og ingen går over kapasitet.
    return linprog(cost, A_eq=[np.ones(4)], b_eq=[D],
                   bounds=list(zip(np.zeros(4), capacity)), method="highs")

D = 60   # endre til 90 og 130
res = one_zone(D)
print("status:", res.status)
for name, x in zip(plant_names, res.x):
    print(f"{name:<10}{x:6.1f} MW")
print(f"samlet kostnad {res.fun:g} kr, gjennomsnitt {res.fun/D:.1f} kr/MWh")
print(f"pris (dual til forbrukslikningen): {res.eqlin.marginals[0] + 0:g} kr/MWh")
```

- Kjør for $D=60$, $90$ og $130$. Stemmer planene med tabellen din?
- Hvilket kraftverk har samme kostnad som prisen hver gang?
- Se på $D=130$: hvor stor er prisen, og hvor stor er gjennomsnittet? Alle
  kraftverkene får prisen for hver MWh de leverer. Hvorfor bestemmes prisen av
  det dyreste kraftverket i drift, og ikke av gjennomsnittet? Del 2 gir
  svaret. Skriv ned din egen gjetning nå.

### 1c. Prisen som funksjon av forbruket

Tre forbruk viser ikke hele bildet. Nå løser vi problemet for 150 forbruk og
ser hvordan prisen endrer seg når $D$ vokser. Du skriver de to linjene som
lagrer prisen og gjennomsnittet. Hjelperen `show_steps` tegner figuren når
arrayene er fylt.

Vi bruker halve tall $D=0.5,1.5,\ldots,149.5$, slik at ingen $D$ havner
nøyaktig på et trappetrinn (der er prisen ikke entydig, se spørsmål 3).

```{pyodide-python}
#| label: project11-price-steps
Ds = np.arange(0.5, 150, 1.0)   # halve tall: ingen D ligger på et trinn
prices = np.zeros(len(Ds))
averages = np.zeros(len(Ds))
for i, D in enumerate(Ds):
    res = one_zone(D)
    # TODO: lagre prisen og gjennomsnittskostnaden for denne D.

show_steps(Ds, prices, averages, xlabel="Forbruk D (MW)")
```

1. Prisen blir en **trappefunksjon**. Ved hvilke $D$ kommer trinnene, og
   hvorfor akkurat der? Tips: legg sammen kapasitetene i rekkefølge,
   billigste først. (I 11.1 hoppet planen når et bidrag endret seg. Her
   hopper prisen når forbruket endres.)
2. Hvorfor er gjennomsnittskostnaden en sammenhengende kurve, mens prisen
   hopper?
3. På et trinn, for eksempel $D=80$, er vind og vannkraft akkurat fulle og
   ingen andre i drift. Hva koster én MW mer, og hva sparer du på én MW mindre?
   Hvorfor finnes det ikke ett enkelt tall for prisen akkurat der?

**Ta med videre:** Tabellen for tre forbruk og pristrappen. Prisen er
kostnaden til det marginale kraftverket. Gjennomsnittet er noe annet.

## 2. Prisen er en dualvariabel

I del 1 kalte vi tallet `res.eqlin.marginals[0]` for prisen. Men hvorfor
skulle et tall fra et minimeringsproblem være prisen alle får betalt? I denne
delen ser du på det samme tallet på tre måter: som det én MW til koster (2a),
som en del av et bevis for at planen er billigst (2b), og gjennom
komplementær slakk (2c). Målet er at du kan forklare prisen uten å kjøre kode.

### 2a. Prisen er det én MW til koster

Påstanden fra innledningen er at prisen er den deriverte av minste kostnad med
hensyn på $D$. En derivert kan vi anslå med en differanse: løs problemet for
$D$ og for $D+1$, og trekk fra. Cellen gjør dette for de tre forbrukene fra
tabellen og skriver dualvariabelen ved siden av, slik at du kan sammenligne.

```{pyodide-python}
#| label: project11-finite-difference
for D in (60, 90, 130):
    extra = one_zone(D + 1).fun - one_zone(D).fun
    print(f"D = {D}: kostnad(D+1) - kostnad(D) = {extra:g},"
          f" dual = {one_zone(D).eqlin.marginals[0]:g}")
```

Når du kjører cellen, ser du at tallene er like. Dualvariabelen er altså en derivert: en *lokal*
endringsrate. Inni et trappetrinn er den lik endringen ved 1 MW mer. Akkurat
på et trinn, som $D=80$, gjelder den bare på den ene siden (spørsmål 3 i 1c).

Men hvorfor er tallene like? Fullfør begrunnelsen for $D=90$ på papir.
Første linje er gitt.

1. Ved $D=90$ er vind og vannkraft fulle, import produserer 10 av 30 MW, og
   gass står.
2. Én MW til kan ikke komme fra vind eller vannkraft fordi …
3. Den billigste kilden med ledig kapasitet er … med kostnad … kr/MWh.
4. Ved én MW *mindre* skrur vi ned det dyreste kraftverket som er i drift,
   altså … , og sparer … kr.
5. Derfor er prisen … kr/MWh, og den bestemmes av det marginale kraftverket.

### 2b. Et prisbevis

Hvordan kan du overbevise noen om at 900 kr er den billigste måten å dekke
90 MW på, uten å prøve alle planer? I uke 11 brukte vi priser til å lage et
slikt bevis. Der maksimerte vi og fikk en *øvre* grense. Nå minimerer vi, så
vi leter etter en *nedre* grense for kostnaden.

Tenk deg at hver MWh får prisen $\lambda=40$ kr («lambda»), slik du fant i 2a.
Kraftverk som er fulle, får mer enn de koster: vind sitter igjen med
$40-0=40$ kr per MWh, og vannkraft med $40-10=30$ kr. Dette overskuddet kaller vi
**verdien av kapasiteten** og skriver $\mu_i$ («my»). Én MW mer vindkapasitet
ville vært verdt 40 kr: den erstatter 1 MW import, så kostnaden faller med
$40-0=40$ kr. Én MW mer vannkraft erstatter også import, men koster 10 kr selv,
så den er verdt $40-10=30$ kr. Import og gass er ikke fulle, så mer kapasitet
er ikke verdt noe for dem. Prisene er altså
$\lambda=40$ og $\mu=(40,\,30,\,0,\,0)$.

Prisene er **gyldige** hvis verdien av kapasitet aldri er negativ,
$\mu_i\ge0$, og hvis dette gjelder for hvert kraftverk:

$$\lambda-\mu_i\le c_i.$$

Med ord: mer kapasitet er verdt null eller mer, og prisen minus verdien av
kapasiteten er høyst kostnaden. Med gyldige priser er tallet
$\lambda D-\sum_i\mu_ik_i$ en nedre grense: ingen plan kan koste mindre. Her
er $k_i$ kapasiteten fra tabellen.

1. Kontroller begge reglene for alle fire kraftverk. Vind er gjort:
   $\mu_1=40\ge0$ og $40-40=0\le0$.
2. Regn ut den nedre grensen $40\cdot90-(40\cdot30+30\cdot50)$ og sammenlign
   med kostnaden i tabellen fra 1a. Hva har du bevist?

<details>
<summary>Regnehjelp: hvorfor er dette en nedre grense?</summary>

Ta en hvilken som helst plan $(x_1,x_2,x_3,x_4)$ som dekker 90 MW og holder
kapasitetene. Regelen $c_i\ge\lambda-\mu_i$ gir $c_1\ge40-40=0$,
$c_2\ge40-30=10$, $c_3\ge40-0=40$ og $c_4\ge40-0=40$. Siden alle $x_i\ge0$, kan vi gange ledd for ledd:

$$0x_1+10x_2+40x_3+70x_4\ \ge\ 0x_1+10x_2+40x_3+40x_4.$$

Høyresiden kan skrives som $40(x_1+x_2+x_3+x_4)-40x_1-30x_2=40\cdot90-40x_1-30x_2$.
Kapasitetene gir $x_1\le30$ og $x_2\le50$. Her bruker vi at verdiene 40 og
30 er positive: $x_1\le30$ ganget med 40 gir $-40x_1\ge-1200$, og på samme
måte er $-30x_2\ge-1500$. Med en negativ kapasitetsverdi ville ulikheten
snudd, og da var tallet ingen nedre grense. Dermed er

$$\text{kostnad}\ \ge\ 3600-40\cdot30-30\cdot50=3600-1200-1500=900.$$

Ingen plan kan altså koste mindre enn 900 kr, og planen fra 1a koster nøyaktig
900. Da er den bevist billigst. Med symboler er dette
$\sum_ic_ix_i\ge\lambda D-\sum_i\mu_ik_i$, den samme vektede ulikheten som i
uke 11, nå for et minimeringsproblem.

Én forskjell fra verkstedet: forbrukskravet er en likning, ikke en ulikhet.
Derfor har $\lambda$ ikke noe fortegnskrav (se *Gå i dybden: andre fortegn i
primalen* i [11.3](uke11.qmd#uke11-fortegn)). Her blir den likevel positiv.

</details>

### 2c. Komplementær slakk i ord

I 2b fikk de fulle kraftverkene en kapasitetsverdi, mens de andre fikk null.
Det er komplementær slakk: en grense som ikke er nådd, har pris null. For
kraftverkene gir det tre enkle regler, én for hver tilstand:

- et kraftverk som produserer **mellom** 0 og kapasiteten, har kostnad lik
  prisen (det er det marginale kraftverket);
- et kraftverk på **full** kapasitet har kostnad høyst lik prisen, og sitter
  igjen med pris minus kostnad per MWh;
- et kraftverk som **står**, har kostnad minst lik prisen.

SciPy gir kapasitetsverdiene i `res.upper.marginals`, men med minus foran:
mer kapasitet kan bare gjøre det billigere, så marginalen er negativ eller
null. **Verdien** av én MW mer kapasitet er derfor `-res.upper.marginals`.

Nå kontrollerer du reglene for $D=100$, der alle tre tilstandene finnes.
Cellen løser problemet og skriver overskriften. Du fyller ut linjen i løkken.
(Skriv `-m + 0`, så slipper du utskriften `-0`.)

```{pyodide-python}
#| label: project11-slackness
res = one_zone(100)
price = res.eqlin.marginals[0]
print(f"pris {price:g} kr/MWh")
print("kraftverk  produksjon  pris-kostnad  verdi av mer kapasitet")
for name, x, c, m in zip(plant_names, res.x, cost, res.upper.marginals):
    # TODO: skriv ut navn, produksjon, pris minus kostnad og -m + 0 på én linje.
    pass
```

Lag en tabell med kolonnene kraftverk, produksjon, tilstand (står / mellom /
full), pris minus kostnad og verdi av mer kapasitet. Første rad er
vind: 30, full, 40, 40.

1. Kontroller de tre reglene. For hvilke kraftverk er verdien av mer
   kapasitet lik pris minus kostnad? Hva betyr tallet for vind og vannkraft i
   kroner?
2. For gass er pris minus kostnad negativ, men verdien av mer kapasitet er 0.
   Hvorfor kan verdien av mer kapasitet aldri bli negativ?
3. Hvorfor kan ikke et kraftverk som står, ha kostnad lavere enn prisen i en
   billigste plan? (Tenk: hva ville skjedd om vi byttet litt fra det marginale
   kraftverket til dette?)

**Ta med videre:** Prisen er dualvariabelen til forbrukslikningen og lik
kostnaden til det marginale kraftverket. Et fullt kraftverk sitter igjen med
pris minus kostnad per MWh, og det er nettopp verdien av én MW mer av
kapasiteten.

## 3. To prisområder og en linje

Hittil har hele markedet hatt én pris. I Norge er landet delt i fem
prisområder, og prisen i sør kan være mye høyere enn i nord i samme time.
Hvordan kan det skje, når strømmen kan sendes gjennom ledninger? Svaret er at
ledningene har en grense for hvor mye de kan føre.

Vi deler markedet i to: nord med billig vind og vannkraft, sør med dyrere
import og gass, og en overføringslinje mellom dem. Målet er å finne ut når de
to områdene får ulik pris, og hva én MW mer linjekapasitet er verdt.

| Område | Kraftverk (kostnad, kapasitet) | Forbruk |
|:--|:--|--:|
| Nord | vind (0 kr, 20 MW), vannkraft (10 kr, 80 MW) | 30 MW |
| Sør | import (40 kr, 30 MW), gass (70 kr, 80 MW) | 80 MW |

Linjen fører $f$ MW fra nord til sør. Linjens **kapasitet** $L$ er det mest
den tåler i hver retning: $-L\le f\le L$. Negativ $f$ betyr at strømmen går
nordover. Hvert område får sin egen forbrukslikning. I nord skal produksjonen
minus det som sendes sørover dekke forbruket. I sør skal produksjonen pluss
det som kommer nordfra dekke forbruket:

$$\text{nord: }x_{\text{vind}}+x_{\text{vann}}-f=30,\qquad
\text{sør: }x_{\text{import}}+x_{\text{gass}}+f=80.$$

Hver likning har sin egen dualvariabel. Vi kaller dem $\lambda_N$ (**prisen i
nord**) og $\lambda_S$ (**prisen i sør**). Akkurat som i del 1 er $\lambda_N$
hvor mye den billigste samlede kostnaden øker når forbruket i nord øker med
1 MW.

### 3a. Forutsi før du kjører

1. Uten linje ($L=0$) er hvert område et lite marked som i del 1. Finn prisen
   i nord, prisen i sør og samlet kostnad med «billigste først» i hvert område.
2. Hvor mye kan nord eksportere i høyden? Hva tror du skjer med prisene når
   $L$ er mye større enn dette?

### 3b. Kjør og les prisene

Nå lar vi `linprog` løse modellen for fem linjekapasiteter. Den femte
variabelen er flyten $f$, med kostnad 0 og grensene $-L\le f\le L$. Den står
med $-1$ i nordlikningen og $+1$ i sørlikningen, akkurat som i likningene
over. Den siste kolonnen er **linjeverdien**: hvor mye billigere det blir per
MW ekstra linjekapasitet (minus marginalen til grensen $f\le L$).

```{pyodide-python}
#| label: project11-two-zones
def two_zones(L, wind_north=20.):
    # Variabler: vind N, vannkraft N, import S, gass S, flyt f fra N til S.
    c = np.array([0., 10., 40., 70., 0.])
    A_eq = np.array([[1., 1., 0., 0., -1.],    # nord: produksjon - eksport = 30
                     [0., 0., 1., 1., 1.]])    # sør: produksjon + import = 80
    bounds = [(0, wind_north), (0, 80), (0, 30), (0, 80), (-L, L)]
    return linprog(c, A_eq=A_eq, b_eq=[30., 80.], bounds=bounds, method="highs")

print("   L  kostnad  pris N  pris S  flyt  linjeverdi")
for L in (0, 20, 40, 60, 100):
    res = two_zones(L)
    pN, pS = res.eqlin.marginals
    print(f"{L:4}{res.fun:9g}{pN:8g}{pS:8g}{res.x[4] + 0:6g}"
          f"{-res.upper.marginals[4] + 0:12g}")
```

Sammenlign først med forutsigelsene dine fra 3a.

1. For hvilke $L$ er linjen full ($f=L$)? Når er prisene ulike, og når er de
   like?
2. Ved $L=100$ er prisen i nord 40 kr/MWh, selv om alle kraftverkene i nord
   koster høyst 10 kr. Hvordan kan det skje? Tips: er det ledig kapasitet i
   nord? Hvor må én MW mer forbruk i nord da komme fra?

### 3c. Hva er én MW mer linjekapasitet verdt?

Ved $L=40$ er linjen full, og prisen er 10 kr i nord og 70 kr i sør. Tenk deg
at linjen blir litt sterkere, så den tåler 41 MW i stedet for 40: hva endrer
seg da i den billigste planen?

Cellen tegner den billigste planen ved $L=40$, slik at du ser hvilke
kraftverk som går, og hvor mye.

```{pyodide-python}
#| label: project11-line-picture
L = 40   # prøv også 41 og 100
show_two_zones(two_zones(L), L)
```

Fullfør regningen på papir. Første linje er gitt.

1. Ved $L=40$ produserer nord $30+40=70$ MW: vind 20 og vannkraft 50. Sør
   trenger $80-40=40$ MW: import 30 og gass 10. Samlet kostnad er 2400 kr.
2. Med $L=41$ sender vi 1 MW mer sørover. Vinden i nord er full, så det er …
   som produserer 1 MW mer. Det koster … kr.
3. Sør trenger nå 1 MW mindre. Det dyreste kraftverket som er i drift der, er
   …, så vi skrur det ned og sparer … kr.
4. Til sammen faller kostnaden med … − … = … kr. Linjeverdien i tabellen fra
   3b er … kr.

<details>
<summary>Regnehjelp: hele regningen for $L=40$ og $L=41$</summary>

| | vind N | vannkraft N | import S | gass S | kostnad |
|:--|--:|--:|--:|--:|--:|
| $L=40$ | 20 | 50 | 30 | 10 | $500+1200+700=2400$ |
| $L=41$ | 20 | 51 | 30 | 9 | $510+1200+630=2340$ |

Vannkraften i nord øker med 1 MW og koster 10 kr mer. Gassen i sør minker med
1 MW og sparer 70 kr. Kostnaden faller med $70-10=60$ kr. Det er linjeverdien
60 i tabellen.

</details>

**Fra tall til regel.** Se på de to tallene du brukte. 10 kr er prisen i
nord: så mye koster det å produsere 1 MW mer der. 70 kr er prisen i sør: så
mye sparer vi når sør trenger 1 MW mindre. Én MW mer over linjen betyr
nettopp 1 MW mer produksjon i nord og 1 MW mindre i sør. Derfor er én MW mer
på en full linje verdt **prisen i sør minus prisen i nord**. (Du kan også
tenke deg at du eier linjen: du kjøper 1 MWh i nord for 10 kr og selger den i
sør for 70 kr.)

Hva om linjen *ikke* er full, som ved $L=100$? Da hjelper det ingenting å
gjøre den sterkere, så linjeverdien er 0. Og prisene må være like. Hvis sør
var dyrere enn nord, kunne vi sendt litt mer strøm gjennom den ledige
kapasiteten og spart penger. Da var ikke planen den billigste.

Med symboler: kall linjeverdien $\mu_L$, i kr per MW linjekapasitet. Husk at
$\lambda_N$ er prisen i nord og $\lambda_S$ prisen i sør. Da er

Når linjen er full i retning nord–sør, $f=L$, er

$\mu_L=\lambda_S-\lambda_N.$

Når linjen har ledig kapasitet, $-L<f<L$, er

$\mu_L=0,\qquad \lambda_S=\lambda_N.$

Dette er de samme reglene som for kraftverkene i 2c. Linjen er som et
kraftverk med kostnad 0 som får prisforskjellen $\lambda_S-\lambda_N$ for hver
MW. Er den full, er verdien av mer kapasitet lik «pris minus kostnad». Er den
ikke full, er den «mellom», og da må «prisen» være lik kostnaden 0.

5. Kontroller regelen med tabellen fra 3b for $L=60$ og $L=100$. Er linjen
   full? Stemmer linjeverdien med prisforskjellen?

En full linje kan være en **flaskehals**: den kan hindre billigere strøm
i å nå fram og dermed gi ulike priser. Men at linjen er full, er ikke alene
nok til å vite at mer kapasitet har verdi.

### 3d. Hvor lenge gjelder linjeverdien?

Linjeverdien 60 kr bygger på at hver ekstra MW over linjen erstatter gass i
sør. Ved $L=40$ går gassen med bare 10 MW. Hva skjer når gassen er borte, og
hva skjer når nord ikke har mer å sende? Endre listen i cellen i 3b til
$L=45,55,75$, og skriv også ut produksjonen `res.x` i løkken.

- Les linjeverdien for de tre $L$. Den endrer seg ved $L=50$ og ved $L=70$.
  Hvilket kraftverk skifter rolle der, og hvordan forklarer regelen fra 3c de
  nye verdiene?

<details>
<summary>Regnehjelp: $L=55$</summary>

Sør trenger $80-55=25$ MW. Det dekker import alene, så gassen står, og import
er det marginale kraftverket i sør. Prisen i sør er derfor 40 kr. Nord
produserer $30+55=85$ MW: vind 20 og vannkraft 65, så prisen i nord er
fortsatt 10 kr. Linjen er full, og linjeverdien er $40-10=30$ kr. Én MW mer på
linjen erstatter nå import (40 kr), ikke gass (70 kr).

</details>

**Ta med videre:** En full linje kan gi ulike priser. Når mer linjekapasitet
senker kostnaden, er verdien lik prisforskjellen så lenge de samme
begrensningene bestemmer løsningen. Ved et knekkpunkt kan linjen være full
selv om én ekstra MW ikke gir noen besparelse. Her er kostnaden 1200 kr både
ved $L=70$ og $L=71$, selv om flyten ved $L=70$ fyller linjen.

## 4. Vannkraft med begrenset vann

Nå kommer vi til det som oftest setter prisen i Norge: vannet i magasinene.
Regnet er gratis, men vannet er begrenset. En MWh vann du bruker nå, kan du
ikke bruke i en dyrere time senere. Derfor har vannet en verdi, selv om det
ikke koster noe å få det.

Vi går tilbake til ett område, men ser på tre timer samtidig, slik at det
lønner seg å planlegge. Kostnader og kapasiteter er som i del 1, men vinden
varierer, og vannkraften har bare **120 MWh vann til sammen** for de tre
timene. Vannkraftens kostnad på 10 kr er drift og vedlikehold. Vannet selv er
gratis.

| Time | 1 | 2 | 3 |
|:--|--:|--:|--:|
| forbruk (MW) | 60 | 95 | 120 |
| tilgjengelig vind (MW) | 30 | 10 | 20 |

Vannkraften kan levere høyst 50 MW i hver time. Uten vannbegrensningen ville
den brukt $30+50+50=130$ MWh: i time 1 trengs bare 30 MW etter vinden. Med
120 MWh mangler det altså 10 MWh. Kravet blir

$$x_{\text{vann},1}+x_{\text{vann},2}+x_{\text{vann},3}\le120.$$

**Vannverdien** er, som prisen, et tall vi kan regne ut: hvor mye den
billigste samlede kostnaden synker hvis vannkraften får 1 MWh mer vann. Det er
dualvariabelen til vannkravet. Målet er å forutsi vannverdien for hånd,
kontrollere den med `linprog` og se når den endrer seg.

**Forutsi:** I hvilke timer bør det knappe vannet brukes? Begrunn med
hvilket kraftverk én MWh vann ville erstatte i hver time (det dyreste som
ellers må gå).

<details>
<summary>Regnehjelp: hva erstatter én MWh vann?</summary>

Uten vannbegrensningen er planen slik:

| Time | vind | vann | import | gass | dyreste i drift |
|:--|--:|--:|--:|--:|:--|
| 1 | 30 | 30 | 0 | 0 | vannkraft |
| 2 | 10 | 50 | 30 | 5 | gass |
| 3 | 20 | 50 | 30 | 20 | gass |

Tar vi bort 1 MWh vann i time 1, må import ta over: det koster $40-10=30$ kr
mer. I time 2 og 3 må gass ta over: det koster $70-10=60$ kr mer. De 10 MWh
som mangler, tas derfor fra time 1. Der erstatter de import, og hver MWh vann
er verdt 30 kr.

</details>

### 4a. Bygg vannraden

Modellen har 12 variabler, i grupper på fire: plass 0–3 er time 1, plass 4–7
er time 2 og plass 8–11 er time 3. I hver gruppe står vind først, så
vannkraft, import og gass. Cellen bygger målet, grensene og de tre
forbrukslikningene. **Du fyller inn vannraden**, slik at `A_water @ x` blir
den samlede vannbruken.

```{pyodide-python}
#| label: project11-hydro
c3 = np.tile(cost, 3)
bounds3 = []
for h in range(3):
    bounds3 += [(0, wind3[h]), (0, 50.), (0, 30.), (0, 40.)]
A_eq3 = np.zeros((3, 12))
for h in range(3):
    A_eq3[h, 4*h:4*h + 4] = 1        # produksjon i time h = forbruk i time h

A_water = np.zeros((1, 12))
# TODO: sett 1 på plassene til vannkraft i hver time (nr. 2 i hver gruppe på fire).

res3 = linprog(c3, A_ub=A_water, b_ub=[water], A_eq=A_eq3, b_eq=demand3,
               bounds=bounds3, method="highs")
print("status:", res3.status, "  samlet kostnad:", res3.fun)
print("time   vind  vann  import  gass   pris")
for h in range(3):
    print(f"{h + 1:4}", *[f"{v:6g}" for v in res3.x[4*h:4*h + 4]],
          f"{res3.eqlin.marginals[h]:6g}")
print("vann brukt:", (A_water @ res3.x)[0], "av", water, "MWh")
print("vannverdi (kr/MWh):", -res3.ineqlin.marginals[0] + 0)
```

Vannverdien er `-res3.ineqlin.marginals[0]`. Minus foran har samme grunn som
i 2c: mer vann kan bare gjøre det billigere. Når vannraden er riktig, bruker
modellen 120 MWh, prisene blir 40, 70 og 70 kr, og vannverdien blir 30 kr/MWh.
Stemmer det med forutsigelsen din?

1. Tenk på vannverdien som en ekstra kostnad for vannkraften. Å bruke 1 MWh
   vann nå koster 10 kr i drift, *og* vannet kan ikke brukes i en annen time.
   I time 1 er vannkraften verken full eller avslått, så det må lønne seg
   akkurat like mye å bruke vannet som å spare det:
   $10+\text{vannverdi}=\text{pris i time 1}$. Kontroller: $10+30=\;…$ . Hva
   gjelder i time 2 og 3, der vannkraften går for fullt? (Bruk reglene fra 2c.)
2. Hvis du fikk 1 MWh vann til: i hvilken time ville det blitt brukt, hva
   ville det erstattet, og hva sparer det? Kontroller med `water + 1`.

### 4b. Vannverdien som funksjon av vannmengden

Vannverdien 30 kr gjelder for 120 MWh vann. Med mer vann erstatter vannet
etter hvert billigere kraftverk, og med mindre vann må det dekke dyrere
timer. Cellen løser tre-timersmodellen for mange vannmengder $W$, med
vannraden din, så kjør cellen i 4a først. Du fyller inn én linje som lagrer
vannverdien for hver $W$. Vi bruker igjen halve tall, slik at ingen $W$
havner på et trinn.

```{pyodide-python}
#| label: project11-water-steps
water_row_ok(A_water)            # varsler hvis vannraden fra 4a ikke er fylt inn
Ws = np.arange(50.5, 160, 1.0)   # halve tall: ingen W ligger på et trinn
values = np.zeros(len(Ws))
for i, W in enumerate(Ws):
    r = linprog(c3, A_ub=A_water, b_ub=[W], A_eq=A_eq3, b_eq=demand3,
                bounds=bounds3, method="highs")
    # TODO: lagre vannverdien (minus marginalen til vannraden) for denne W.

show_steps(Ws, values, xlabel="Vannmengde W (MWh)", ylabel="Vannverdi (kr/MWh)")
```

- Hvor er trinnene i vannverdien, og hva erstatter vannet på hvert trinn?
- Løs én gang med 40 MWh og les `status`. Hvorfor finnes det ingen plan?

**Ta med videre:** Vannverdien er dualvariabelen til vannkravet. Den er
prisen i timen der vannet er marginalt, minus vannkraftens egen kostnad. Når
vannkraften er marginal, er prisen 10 kr pluss vannverdien. Derfor settes
prisen i Norge ofte av vannverdien.

## 5. Din undersøkelse: forutsi med dualvariabler

Nå har du sett tre slags dualvariabler: prisen, linjeverdien og vannverdien.
Alle sier hva én enhet mer er verdt. Det er fristende å bruke dem som en
snarvei: «linjeverdien er 60 kr, så 40 MW mer linje sparer 2400 kr». Men fra
3d vet du at en dualverdi bare gjelder til en annen grense blir aktiv. I denne
delen undersøker du selv hvor langt snarveien holder. Målet er en
forutsigelse, en kontroll og en forklaring av hvor anslaget slutter å gjelde.

Slik kan en forutsigelse se ut, med vannet fra del 4: «Vannverdien er
30 kr/MWh. Med 5 MWh mer vann (125 MWh) venter jeg at kostnaden faller med
$5\cdot30=150$ kr, fra 5750 til 5600 kr. Med 20 MWh mer tror jeg anslaget
svikter, fordi vannverdien bare gjelder opp til 130 MWh (4b).»

Velg **ett** av tiltakene under. Skriv først ned hva dualvariablene forutsier
om endringen i samlet kostnad og priser. Løs deretter den nye modellen og
sammenlign. Undersøk to størrelser av tiltaket: én der du tror anslaget
holder, og én der du tror det bryter sammen.

- **Batteri i tre-timersmodellen.** Et batteri kan lade i en billig time og
  lade ut i en dyr. Hva er én MWh flyttet fra en billig til en dyr time verdt
  ifølge prisene i 4a?
- **Mer vind i nord.** Øk vindkapasiteten i nord fra 20 til 40 MW med
  `two_zones(40, wind_north=40)`. Bruk verdien av mer vind,
  `-two_zones(40).upper.marginals[0]`.
- **Dobbel linje.** Øk $L$ fra 40 til 80. Bruk linjeverdien ved $L=40$.

**Batteriet som matematikk.** Batteriet gir seks nye variabler: lading
$\ell_h$ og utlading $u_h$ i time $h=1,2,3$, med $0\le\ell_h\le$ `power` og
$0\le u_h\le$ `power`. Lading er ekstra forbruk og utlading ekstra
produksjon, så forbrukslikningen i time $h$ blir

$$\text{produksjon i time }h-\ell_h+u_h=D_h.$$

Lagret mengde etter time $h$ er $s_h=(\ell_1-u_1)+\dots+(\ell_h-u_h)$. Den må
ligge mellom 0 og `power` MWh. Batteriet starter tomt og må slutte tomt:
$s_3=0$. Det har ingen tap.

Den ferdige funksjonen `with_battery(power, A_water)` løser denne utvidede
modellen med vannraden din fra 4a, så kjør den cellen først. Cellen under
sammenligner modellen med og uten batteri (`power=0`).

```{pyodide-python}
#| label: project11-battery
base = with_battery(0., A_water)
for power in (10,):     # legg til en større verdi
    r = with_battery(power, A_water)
    print(f"batteri {power} MW: kostnad {r.fun:g} (uten: {base.fun:g}),"
          f" priser {r.eqlin.marginals}")
```

Forklar hvor anslaget holder og hvor det bryter sammen. Hvilken grense blir
aktiv, og hvordan henger det sammen med at en pris bare gjelder lokalt
([uke 11.4](uke11.qmd#uke11-sensitivitet))?

## Spørsmål du skal kunne svare på

1. Hvorfor bestemmes prisen av det dyreste kraftverket som er i drift, og ikke
   av gjennomsnittskostnaden?
2. Hva betyr dualvariabelen til forbrukslikningen, og hvordan kontrollerer du
   den med to løsninger?
3. Hvilke kraftverk har kostnad lik prisen, og hva sier komplementær slakk om
   de andre?
4. Hvorfor blir prisen en trappefunksjon av forbruket?
5. Når får to områder ulik pris, og hva er én ekstra MW linjekapasitet verdt?
6. Hva er vannverdien, og hvorfor brukes vannet i de dyreste timene?
7. Hvordan ser du i resultatet fra `linprog` om en grense er aktiv?
8. Hva forteller en dualverdi *ikke*? Hvorfor gjelder den bare innenfor et
   intervall?
9. *(valgfri fordypning)* Ved $D=80$ koster én MW mer 40 kr, mens én MW
   mindre sparer 10 kr. `linprog` rapporterer 10. Vis at hver pris $\lambda$
   mellom 10 og 40 gir et gyldig prisbevis med samme nedre grense 500 kr, og
   forklar hvorfor en løser bare kan rapportere én av dem.
10. *(valgfri fordypning)* Hvordan endrer et batteri prisene i de tre timene,
    og hvorfor gir et batteri større enn 20 MW ingen ekstra besparelse?
    Hvilken grense blir aktiv?

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med:

- tabellen fra 1a, pristrappen fra 1c og de utfylte begrunnelsene i 2a, 2b og 3c;
- tabellen med komplementær slakk for $D=100$;
- tabellen over linjekapasitet, forklaringen av prisen i nord ved $L=100$ og
  rollebyttene ved $L=50$ og $L=70$;
- den utfylte vannraden, kontrollen av vannverdien og figuren av vannverdien;
- din undersøkelse fra del 5: forutsigelse, resultat og hvor anslaget holder.

Skriv i tillegg en analyse på **300–500 ord** som svarer på de tre spørsmålene
i innledningen med dine egne tall. Skill mellom det dualvariablene forutsier
lokalt og det du har kontrollert med nye løsninger.
