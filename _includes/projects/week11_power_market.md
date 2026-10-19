## Hvorfor koster strømmen det den koster?

På en kraftbørs skjer det samme hver time. Produsentene oppgir hva det koster
dem å produsere én MWh til. Markedet velger den billigste kombinasjonen som
dekker forbruket, og alle produsentene i området får **samme pris** per MWh.
Tre ting ved dette virker rart:

- Alle får betalt prisen til det dyreste kraftverket som er i drift, selv
  når nesten all kraften er billig.
- To deler av landet kan ha ulik pris i samme time.
- Vann i et magasin har en pris, selv om regnet er gratis.

I dette prosjektet ser du at alle tre svarene er **dualvariabler** i et
lineært program: de samme ressursprisene som i [uke 11](uke11.qmd#uke11-dual).

**Alle tall i prosjektet er oppdiktede og sterkt forenklede.** Ekte
kraftmarkeder har bud i mange trinn, tap i nettet, kostnader ved å starte og
stoppe kraftverk og usikkerhet om vær og forbruk. Vi antar dessuten at
forbruket er fast (det reagerer ikke på prisen), og at budene er lik de
virkelige kostnadene. Modellen beholder bare det som trengs for å se
matematikken. I Norge settes prisen oftest av vannverdien (del 4), ikke av gass.

### En vei gjennom prosjektet

| Del | Spørsmålet | Det du tar med videre |
|:--|:--|:--|
| 1. Ett prisområde | Hvilke kraftverk produserer, og hva blir prisen? | Håndløsning, `linprog` og en pristrapp. |
| 2. Prisen er en dualvariabel | Hvorfor er prisen kostnaden til det marginale kraftverket? | En kontroll med to løsninger, et prisbevis og komplementær slakk i ord. |
| 3. To områder og en linje | Når får to områder ulik pris? | Verdien av én MW mer linjekapasitet. |
| 4. Vannkraft med lite vann | Hva er vannet verdt? | Vannverdien som dualvariabel. |
| 5. Din undersøkelse | Kan dualvariablene forutsi et tiltak? | En forutsigelse, en kontroll og grensen for anslaget. |

Sett av tre til fire timer. Gjør papirregningene før du kjører koden, og
skriv ned en forventning før hvert forsøk.

### Det vi trenger fra uke 11

- En **LP** har lineært mål og lineære krav. Når det tillatte området er
  ikke-tomt og begrenset, finnes en beste løsning i et hjørne, der et sett av
  grenser er aktive ([11.1](uke11.qmd#uke11-hjorner)).
- Hver grense har en **pris** (dualvariabel). Prisene gir en grense for
  optimalverdien, og når grensen nås, har vi et bevis ([11.3](uke11.qmd#uke11-dual)).
- **Komplementær slakk:** en grense med slakk har pris null, og et produkt
  som lages i positiv mengde, har innsatspris lik bidrag
  ([11.3](uke11.qmd#uke11-slakk)). I prosjektet er kapasiteten $x_i\le k_i$ en
  grense med egen pris $\mu_i$, akkurat som A-grensen $x\le4$ med pris $w$ i
  verkstedet.
- En pris er den **lokale** verdien av én enhet mer. Den gjelder bare så lenge
  de samme grensene er aktive ([11.4](uke11.qmd#uke11-sensitivitet)).

**Enheter.** Effekt måles i MW og energi i MWh. Vi ser på én time om gangen,
så 1 MW i én time er 1 MWh. Kostnader og priser er i kr per MWh.

**Fortegn i SciPy, én gang for alle.** I uke 11 maksimerte vi og måtte snu
fortegn. Her **minimerer** vi kostnad, så vi bruker målet direkte. En
`marginals`-verdi er den **lokale** endringsraten (den deriverte) av minste
kostnad `res.fun` når en høyreside eller en grense økes. Så lenge de samme
grensene er aktive, er den lik endringen når høyresiden økes med 1. Der aktive
grenser bytter (et trappetrinn), gjelder den bare på den ene siden.

| Utskrift | Betydning her | Fortegn |
|:--|:--|:--|
| `res.eqlin.marginals[i]` | ekstra kostnad per ekstra MW forbruk i likning $i$ (lokalt): **prisen** | $\ge0$ |
| `res.upper.marginals[j]` | endring i kostnad per ekstra MW kapasitet for variabel $j$ (lokalt) | $\le0$ |
| `res.ineqlin.marginals[k]` | endring i kostnad per ekstra enhet på høyresiden i en $\le$-rad (lokalt), for eksempel vannmengden | $\le0$ |

Mer kapasitet kan bare gjøre det billigere. **Verdien** av én enhet mer
kapasitet er derfor minus marginalen.

### Kjøring på siden eller i egen notebook

Dataene lastes automatisk på siden. Kjør cellene i rekkefølge; senere celler
bruker funksjoner fra tidligere deler.

<details>
<summary>Egen notebook: last ned oppsettet og kom i gang</summary>

Last ned [project_week11_setup.py](../assets/project_week11_setup.py){download="project_week11_setup.py"}
og legg filen ved siden av notebooken. Kjør først

```python
from project_week11_setup import *
```

Miljøet trenger NumPy, SciPy og Matplotlib. Filen inneholder dataene og
funksjonen `one_zone` fra del 1b.
Kopier deretter kodecellene fra prosjektet i rekkefølge. Kontroller til slutt
notebooken med **Restart / Run all**, og ta med oppsettsfilen ved levering.

</details>

## 1. Ett prisområde: billigste først

Fire kraftverk kan dekke forbruket $D$ (MW) i én time:

| Kraftverk | Kostnad $c_i$ (kr/MWh) | Kapasitet $k_i$ (MW) |
|:--|--:|--:|
| vind | 0 | 30 |
| vannkraft | 10 | 50 |
| import | 40 | 30 |
| gass | 70 | 40 |

La $x_1,\ldots,x_4$ være produksjonen fra vind, vannkraft, import og gass.
Markedet løser

$$\min\;0x_1+10x_2+40x_3+70x_4\quad\text{slik at}\quad x_1+x_2+x_3+x_4=D,\qquad 0\le x_i\le k_i.$$

Med ord: gjør samlet kostnad minst mulig, dekk forbruket nøyaktig, og hold
hvert kraftverk innenfor kapasiteten.

### 1a. Løs for hånd

Den billigste måten er å fylle opp kraftverkene i kostnadsrekkefølge,
«billigste først». Det kraftverket som er i bruk, men ikke fullt, kaller vi
**marginalt**. Fyll ut tabellen for $D=90$ og $D=130$. Første rad er gitt.

| $D$ | vind | vannkraft | import | gass | samlet kostnad | marginalt kraftverk | gjennomsnitt per MWh |
|--:|--:|--:|--:|--:|--:|:--|--:|
| 60 | 30 | 30 | 0 | 0 | 300 | vannkraft | 5.0 |
| 90 | | | | | | | |
| 130 | | | | | | | |

Hvorfor er løsningen et hjørne i betydningen fra uke 11? Tell de aktive
grensene for $D=90$: likningen og hvilke kapasitets- eller nullgrenser?

### 1b. Kontroller med `linprog`

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

Sammenlign med tabellen din, særlig for $D=130$: hvor stor er prisen, og
hvor stor er gjennomsnittskostnaden? Alle produsentene får prisen for hver
MWh de leverer. Hvorfor bestemmes prisen av det dyreste kraftverket i drift, og ikke
av gjennomsnittet? Del 2 gir svaret; skriv ned din egen gjetning nå.

### 1c. Prisen som funksjon av forbruket

Fullfør løkken slik at den lagrer prisen og gjennomsnittskostnaden for hver
$D$. Figuren tegnes når arrayene er fylt. Vi bruker halve tall
$D=0.5,1.5,\ldots,149.5$, slik at ingen $D$ havner nøyaktig på et trappetrinn.

```{pyodide-python}
#| label: project11-price-steps
Ds = np.arange(0.5, 150, 1.0)   # halve tall: ingen D ligger på et trinn
prices = np.zeros(len(Ds))
averages = np.zeros(len(Ds))
for i, D in enumerate(Ds):
    res = one_zone(D)
    # TODO: lagre prisen og gjennomsnittskostnaden for denne D.

fig, ax = plt.subplots(figsize=(7, 4))
ax.step(Ds, prices, where="mid", label="Pris (dual)")
ax.plot(Ds, averages, label="Gjennomsnittskostnad")
ax.set(xlabel="Forbruk D (MW)", ylabel="kr/MWh")
ax.legend(); ax.grid(alpha=.3); plt.show()
```

1. Prisen blir en **trappefunksjon**. Ved hvilke $D$ kommer trinnene, og
   hvorfor akkurat der? Bruk kapasitetene. (Sammenlign med knekkpunktene i
   11.1: der hoppet planen når et bidrag endret seg; her hopper prisen når
   forbruket endres.)
2. Hvorfor er gjennomsnittskostnaden kontinuerlig, mens prisen hopper?
3. På et trinn, for eksempel $D=80$, er både vind og vannkraft fulle og
   ingen andre i drift. Hva koster én MW mer, og hva sparer én MW mindre?

**Ta med videre:** tabellen for tre forbruk og pristrappen. Prisen er
kostnaden til det marginale kraftverket; gjennomsnittet er noe annet.

## 2. Prisen er en dualvariabel

### 2a. Prisen er det én MW til koster

Dualvariabelen til forbrukslikningen er endringen i minste kostnad når $D$
øker med 1 MW. Kontroller dette med to løsninger:

```{pyodide-python}
#| label: project11-finite-difference
for D in (60, 90, 130):
    extra = one_zone(D + 1).fun - one_zone(D).fun
    print(f"D = {D}: kostnad(D+1) - kostnad(D) = {extra:g},"
          f" dual = {one_zone(D).eqlin.marginals[0]:g}")
```

Fullfør begrunnelsen for $D=90$ på papir. Første linje er gitt.

1. Ved $D=90$ er vind og vannkraft fulle, import produserer 10 av 30 MW, og
   gass står.
2. Én MW til kan ikke komme fra vind eller vannkraft fordi …
3. Den billigste kilden med ledig kapasitet er … med kostnad … kr/MWh.
4. Ved én MW *mindre* skrur vi ned det dyreste kraftverket som er i drift,
   altså … , og sparer … kr.
5. Derfor er prisen … kr/MWh, og den bestemmes av det marginale kraftverket.

### 2b. Et prisbevis

I uke 11 beviste en plan og et sett priser med samme verdi at planen var best.
Her gjør vi det samme for $D=90$. Gi forbruket prisen $\lambda$ (kr per MWh)
og hver kapasitetsgrense en ikke-negativ pris $\mu_i$ (kr per MW kapasitet).
Priskravet er at for hvert kraftverk er

$$\lambda-\mu_i\le c_i:$$

det kraftverket får for én MW, minus det kapasiteten koster, er ikke mer enn
kostnaden. Prisen $\lambda$ har ikke noe fortegnskrav fordi forbrukskravet er
en likning (se *Gå i dybden: andre fortegn i primalen* i
[11.3](uke11.qmd#uke11-slakk)); her blir den likevel positiv. Velg
$\lambda=40$ og $\mu=(40,\,30,\,0,\,0)$.

1. Kontroller priskravet for alle fire kraftverk.
2. Regn ut den nedre grensen $\lambda D-\sum_i\mu_ik_i$ og sammenlign med
   kostnaden i tabellen fra 1a. Hva har du bevist?

<details>
<summary>Regnehjelp: hvorfor er $\lambda D-\sum_i\mu_ik_i$ en nedre grense?</summary>

Ta en hvilken som helst plan $x$ som dekker $D$ og holder kapasitetene.
Priskravet gir $c_i\ge\lambda-\mu_i$, og $x_i\ge0$, så

$$\sum_ic_ix_i\ge\sum_i(\lambda-\mu_i)x_i=\lambda\sum_ix_i-\sum_i\mu_ix_i
=\lambda D-\sum_i\mu_ix_i\ge\lambda D-\sum_i\mu_ik_i.$$

Den siste ulikheten bruker $x_i\le k_i$ og $\mu_i\ge0$. Dette er den samme
vektede ulikheten som i uke 11, nå for et minimeringsproblem.

</details>

### 2c. Komplementær slakk i ord

For dette markedet sier komplementær slakk:

- et kraftverk som produserer **strengt mellom** 0 og kapasiteten, har
  kostnad lik prisen;
- et kraftverk på **full kapasitet** har kostnad mindre enn eller lik prisen,
  og tjener pris minus kostnad per MWh;
- et kraftverk som **står**, har kostnad større enn eller lik prisen.

Lag en tabell for $D=100$ med kolonnene kraftverk, produksjon, tilstand
(står / mellom / fullt), pris minus kostnad og `-one_zone(100).upper.marginals`.
Skriv en kort løkke over de fire kraftverkene som skriver ut tallene (bruk
`-res.upper.marginals + 0`, så slipper du utskriften `-0`).

1. Kontroller de tre reglene. Hvilke kraftverk har `-upper.marginals` lik
   pris minus kostnad? Hva betyr tallet for vind og vannkraft i kroner?
2. For gass er pris minus kostnad negativ, men `-upper.marginals` er 0.
   Hvorfor kan verdien av mer kapasitet aldri bli negativ?
3. Hvorfor kan ikke et kraftverk som står, ha kostnad lavere enn prisen i en
   optimal plan?

**Ta med videre:** prisen er dualvariabelen til forbrukslikningen. Kraftverk
på full kapasitet tjener pris minus kostnad, og det er nettopp verdien av én
MW mer av deres kapasitet.

## 3. To prisområder og en linje

Nå deler vi markedet i to områder med en overføringslinje mellom dem.

| Område | Kraftverk (kostnad, kapasitet) | Forbruk |
|:--|:--|--:|
| Nord | vind (0 kr, 20 MW), vannkraft (10 kr, 80 MW) | 30 MW |
| Sør | import (40 kr, 30 MW), gass (70 kr, 80 MW) | 80 MW |

Linjen fører $f$ MW fra nord til sør, med $-L\le f\le L$; negativ $f$ betyr
at kraften går nordover. Hvert område har sin egen forbrukslikning:

$$\text{nord: }x_{\text{vind}}+x_{\text{vann}}-f=30,\qquad
\text{sør: }x_{\text{import}}+x_{\text{gass}}+f=80.$$

Hver likning har sin egen dualvariabel: **prisen i det området**.

### 3a. Forutsi før du kjører

1. Finn prisene i nord og sør og samlet kostnad for $L=0$ med «billigste
   først» i hvert område.
2. Hvor mye kan nord eksportere i høyden? Hva tror du skjer med prisene når
   $L$ er mye større enn dette?

### 3b. Kjør og les prisene

```{pyodide-python}
#| label: project11-two-zones
def two_zones(L, wind_north=20.):
    # Variabler: vind N, vannkraft N, import S, gass S, flyt f fra N til S.
    c = np.array([0., 10., 40., 70., 0.])
    A_eq = np.array([[1., 1., 0., 0., -1.],    # nord: produksjon - eksport = 30
                     [0., 0., 1., 1., 1.]])    # sør: produksjon + import = 80
    bounds = [(0, wind_north), (0, 80), (0, 30), (0, 80), (-L, L)]
    return linprog(c, A_eq=A_eq, b_eq=[30., 80.], bounds=bounds, method="highs")

print("   L  kostnad  pris N  pris S  flyt  linjens marginal")
for L in (0, 20, 40, 60, 100):
    res = two_zones(L)
    pN, pS = res.eqlin.marginals
    print(f"{L:4}{res.fun:9g}{pN:8g}{pS:8g}{res.x[4] + 0:6g}"
          f"{res.upper.marginals[4] + 0:12g}")
```

1. For hvilke $L$ er linjen full ($f=L$)? Sammenlign med prisene: når er de
   ulike, og når er de like?
2. Ved $L=100$ er prisen i nord 40 kr/MWh, selv om alle kraftverkene i nord
   koster høyst 10 kr. Forklar: hvor må én MW mer forbruk i nord komme fra?

### 3c. Hvorfor er en full linje verdt prisforskjellen?

Linjen er en variabel som kraftverkene, med kostnad 0. Én MW mer flyt gir
$-1$ i nordlikningen og $+1$ i sørlikningen. Grensen $f\le L$ får en
ikke-negativ pris $\mu_L$ (kr per MW linjekapasitet). Fullfør begrunnelsen på
papir. Første linje er gitt.

1. For et kraftverk sier priskravet fra 2b: det kraftverket får for én MW,
   minus kapasitetsprisen, er ikke mer enn kostnaden. Linjen *får* prisen i
   sør, $\lambda_S$, for én MW den leverer der, og *betaler* prisen i nord,
   $\lambda_N$, for den samme MW.
2. Priskravet for linjen blir derfor $\lambda_S-\lambda_N-\mu_L\le\;…$
3. Hvis linjen ikke er full ($-L<f<L$), har grensen slakk, så $\mu_L=\;…$.
   Linjen er da strengt mellom grensene sine, og priskravet gjelder med likhet,
   så $\lambda_S\;…\;\lambda_N$.
4. Hvis linjen er full ($f=L>0$), gjelder priskravet med likhet, så
   $\mu_L=\;…\;-\;…$: én MW mer linje er verdt **prisforskjellen**.
5. Talleksempel: ved $L=40$ er prisene 10 og 70 kr/MWh, så $\mu_L=\;…$ kr per
   MW. Sammenlign med linjens marginal i tabellen. Kontroller med ord: én MW
   mer på linjen gir 1 MW mer vannkraft i nord (kostnad … kr) og 1 MW mindre
   … i sør (sparer … kr).

Norge er delt i fem prisområder. Når overføringen mellom to områder er full,
får de ulike priser av nettopp denne grunnen.

### 3d. Hvor lenge gjelder linjeverdien?

Endre listen i cellen i 3b til $L=45,55,75$, og skriv også ut produksjonen
`res.x`.

- Les linjeverdien (minus linjens marginal) for de tre $L$. Den endrer seg
  ved $L=50$ og ved $L=70$. Hvilket kraftverk skifter rolle der, og hvordan
  forklarer det de nye verdiene med regelen fra 3c?
- Kontroller med tabellen fra 3b: hvor mye faller kostnaden per MW fra $L=20$
  til $L=40$? Sammenlign med linjeverdien.

**Ta med videre:** en full linje gir prisforskjell, og én MW mer linje er verdt
prisforskjellen, men bare til en annen grense blir aktiv.

## 4. Vannkraft med begrenset vann

Nå ser vi på ett område i tre timer. Kostnader og kapasiteter er som i del 1,
men vinden varierer, og vannkraften har bare **120 MWh vann til sammen** for de
tre timene.

| Time | 1 | 2 | 3 |
|:--|--:|--:|--:|
| forbruk (MW) | 60 | 95 | 120 |
| tilgjengelig vind (MW) | 30 | 10 | 20 |

Vannkraften kan levere høyst 50 MW i hver time. Uten vannbegrensningen ville
den brukt $30+50+50=130$ MWh: i time 1 trengs bare 30 MW etter vinden. Med
120 MWh mangler det altså 10 MWh. Kravet blir

$$x_{\text{vann},1}+x_{\text{vann},2}+x_{\text{vann},3}\le120.$$

**Forutsi:** I hvilke timer bør det knappe vannet brukes? Begrunn med
hvilket kraftverk én MWh vann ville erstatte i hver time (det dyreste som
ellers må gå).

Modellen har 12 variabler: vind, vannkraft, import og gass for time 1, deretter
de samme fire for time 2 og time 3. Cellen bygger målet, grensene og de tre
forbrukslikningene. **Du fyller inn vannraden.**

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

Når vannraden er riktig, bruker modellen 120 MWh, prisene blir 40, 70 og 70 kr,
og **vannverdien** blir 30 kr/MWh.

1. Kontroller komplementær slakk for vannkraften, med vannverdien som en
   ekstra kostnad: i time 1 er vannkraften strengt mellom 0 og 50, så
   $10+\text{vannverdi}$ skal være lik prisen. Hva gjelder i time 2 og 3?
2. Hvis du fikk 1 MWh vann til: i hvilken time ville det blitt brukt, hva
   ville det erstattet, og hva sparer det? Kontroller med `water + 1`.
3. Forklar med ord hvorfor vannet går til de dyre timene først, og hvorfor
   vannet er verdt det det sparer i timen der det er marginalt.
4. Fullfør løkken under (kjør cellen med vannraden først). Hvor er trinnene i
   vannverdien, og hva erstatter vannet på hvert trinn? Løs også én gang med
   40 MWh og les `status`: hvorfor finnes det ingen plan?

```{pyodide-python}
#| label: project11-water-steps
Ws = np.arange(50.5, 160, 1.0)   # halve tall: ingen W ligger på et trinn
values = np.zeros(len(Ws))
for i, W in enumerate(Ws):
    r = linprog(c3, A_ub=A_water, b_ub=[W], A_eq=A_eq3, b_eq=demand3,
                bounds=bounds3, method="highs")
    # TODO: lagre vannverdien (minus marginalen til vannraden) for denne W.

fig, ax = plt.subplots(figsize=(7, 4))
ax.step(Ws, values, where="mid")
ax.set(xlabel="Vannmengde W (MWh)", ylabel="Vannverdi (kr/MWh)")
ax.grid(alpha=.3); plt.show()
```

**Ta med videre:** vannverdien er dualvariabelen til vannkravet. Den er
prisen i timen der vannet er marginalt, minus vannkraftens egen kostnad.

## 5. Din undersøkelse: forutsi med dualvariabler

Velg **ett** tiltak. Skriv først ned hva dualvariablene fra del 3 eller 4
forutsier om endringen i samlet kostnad og priser. Løs deretter den nye
modellen og sammenlign. Undersøk to størrelser av tiltaket: én der du tror
anslaget holder, og én der du tror det bryter sammen.

- **Batteri i tre-timersmodellen.** Et batteri kan lade eller lade ut høyst
  `power` MW i hver time og lagre høyst `power` MWh. Det starter og slutter
  tomt og har ingen tap. Hva er én MWh flyttet fra en billig til en dyr time
  verdt ifølge prisene?
- **Mer vind i nord.** Øk vindkapasiteten i nord fra 20 til 40 MW i
  `two_zones(40, wind_north=40)`. Bruk vindens marginal.
- **Dobbel linje.** Øk $L$ fra 40 til 80. Bruk linjens marginal ved $L=40$.

For batteriet kan du bruke denne ferdige utvidelsen av modellen fra del 4.
Den bygger hele modellen på nytt, med vannraden, og `power=0` gir modellen
uten batteri.

```{pyodide-python}
#| label: project11-battery
def with_battery(power):
    # Variabler: (vind, vann, import, gass) for hver time, lading (3), utlading (3).
    c = np.r_[np.tile(cost, 3), np.zeros(6)]
    bounds = []
    for h in range(3):
        bounds += [(0, wind3[h]), (0, 50.), (0, 30.), (0, 40.)]
    bounds += [(0, power)]*6
    A_eq = np.zeros((3, 18))
    for h in range(3):
        A_eq[h, 4*h:4*h + 4] = 1                 # produksjon i time h
        A_eq[h, 12 + h], A_eq[h, 15 + h] = -1, 1  # lading er ekstra forbruk
    water_row = np.zeros(18)
    water_row[[1, 5, 9]] = 1
    rows, rhs = [water_row], [water]
    for h in range(3):                            # lagret mengde etter time h
        upto = (np.arange(3) <= h)*1.
        level = np.r_[np.zeros(12), upto, -upto]
        rows += [level, -level]                   # mellom 0 og power MWh
        rhs += [power, 0.]
    rows.append(np.r_[np.zeros(12), np.ones(3), -np.ones(3)])   # slutter tomt
    rhs.append(0.)
    return linprog(c, A_ub=np.array(rows), b_ub=rhs, A_eq=A_eq, b_eq=demand3,
                   bounds=bounds, method="highs")

base = with_battery(0.)
for power in (10,):     # legg til en større verdi
    r = with_battery(power)
    print(f"batteri {power} MW: kostnad {r.fun:g} (uten: {base.fun:g}),"
          f" priser {r.eqlin.marginals}")
```

Forklar hvor anslaget holder og hvor det bryter sammen. Hvilken grense blir
aktiv, og hvordan henger det sammen med gyldighetsområdet til en pris i
[uke 11.4](uke11.qmd#uke11-sensitivitet)?

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
   mindre sparer 10 kr. Hvorfor rapporterer `linprog` 10 og ikke 40, og
   hvilke priser mellom 10 og 40 gir også et gyldig prisbevis?
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
