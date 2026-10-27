::: {.panel-tabset}

## 8.0 Oversikt

::: {#uke8-start}
:::

### Tre spørsmål før vi velger en metode

Vi bygger videre på to erfaringer:

- **Uke 4:** I [uke 4](uke4.qmd#uke4-mk) flyttet vi på to skyveknapper til
  kvadratsummen $S(c_0,c_1)$ ble så liten som mulig. Det var et
  **optimeringsproblem**: vi valgte tall som gjorde en **målfunksjon** minst
  mulig.
- **Uke 6:** I [uke 6](uke6.qmd#uke6-energi) fant vi løsningen av et lineært
  system som bunnen av en skål.

Nå skal vi se på problemer der bunnen ikke er like lett å finne, og der et
numerisk søk kan gi et svar som ser fornuftig ut, men ikke er det beste.

Denne uken bygger vi tre ideer, én om gangen:

1. **Finnes det et beste svar?** En følge av stadig bedre forsøk trenger
   ikke å ende i et minimum. Vi trenger begrepene **infimum** og
   **kompakthet** (8.1–8.2).
2. **Hva forteller krumningen?** Gradienten sier hvilken vei funksjonen
   stiger. **Hessianmatrisen** sier hvordan den krummer, i alle retninger
   på en gang. Med den skiller vi et minimum fra et sadelpunkt (8.3).
3. **Er kandidaten vi fant, den beste?** Et lokalt søk ser bare området
   rundt seg. For **konvekse** funksjoner er et lokalt søk nok, og
   Hessianen er testen på konveksitet (8.4).

- **Forkunnskaper:** Gradient og Hessian har du møtt i tidligere
  matematikkemner. Vi bygger dem likevel opp på nytt i 8.3, fordi resten av
  kurset står på dem.
- **Ved behov:** Trenger du å friske opp partiellderiverte og kjerneregelen
  først, er [støtteløpet i 8.7](#uke8-gradient) laget for det.

| Hvor? | Hva finner du der? |
|:--|:--|
| **Forelesning** | Hovedløpet. |
| **Gå i dybden** | Bevis, mellomregninger og noen sidespor. |
| 8.5 og 8.6 | Regneoppgaver sortert etter de tre ideene, og kodeoppgaver. |
| Prosjekttiden | Denne uken er det ikke noe nytt prosjekt; fullfør [prosjekt 7](project_week7.qmd). |

### Kort løype

1. [Et søk som aldri blir ferdig](#uke8-eksistens): infimum, minimum og minimerende følger.
2. [Kompakthet gir et minimum](#uke8-kompakt): lukket, begrenset og ekstremalverdisetningen.
3. [Hessianen](#uke8-hessian): krumning langs en linje, minimum eller sadelpunkt.
4. [Konveksitet: når lokalt er globalt](#uke8-lokalt): mange starter, konvekse funksjoner og mengder, lokalt blir globalt.
5. [Konveksitet fra Hessianen](#uke8-konveks-test): $p^THp\ge0$ i alle punkter.

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 2: fikspunktiterasjon](page4.qmd) | En følge kan nærme seg noe. Er grensen et tillatt svar? |
| [Uke 4: minste kvadrater](uke4.qmd#uke4-mk) | Hvorfor fant vi alltid én beste linje? |
| [Uke 5: egenverdier](uke5.qmd#uke5-basis) | Hvordan ser vi fortegnet til $p^THp$ i alle retninger? |
| [Uke 6: skålen $\phi$](uke6.qmd#uke6-energi) | Hvorfor hadde skålen bare én bunn? |
| Tidligere emner: partiellderiverte ([støtteløpet](#uke8-gradient)) | Hvordan deriverer vi en funksjon langs en linje? |

### Læringsmål

Etter denne uken skal du kunne

- skille mellom infimum og minimum, og lage en minimerende følge,
- avgjøre om en mengde er lukket, begrenset og kompakt, og bruke
  ekstremalverdisetningen,
- regne ut gradienten og Hessianmatrisen for hånd, og bruke at
  $\varphi(s)=f(z+sp)$ har $\varphi'(0)=\nabla f(z)^Tp$ og
  $\varphi''(0)=p^TH(z)p$,
- avgjøre om et stasjonært punkt er et minimum, et maksimum eller et
  sadelpunkt, med fortegnet til $p^THp$ eller med egenverdiene til $H$,
- avgjøre om en funksjon er konveks med definisjonen eller med Hessianen,
  og forklare hvorfor et lokalt minimum da også er globalt,
- bruke `minimize` i SciPy og vurdere svaret kritisk.

## 8.1 Et søk som aldri blir ferdig

::: {#uke8-eksistens}
:::

### Kan vi stole på at et søk er ferdig?

I uke 4 fant vi den beste linjen gjennom noen målinger. Det gikk alltid:
QR ga ett svar, og vi lurte aldri på om svaret fantes.

Mange modeller i praksis er ikke linjer. En prosess som flater ut, for
eksempel oppvarming eller lading av et batteri, beskrives ofte med modellen

$$m(t)=a\,(1-e^{-bt}).$$

- **Nivå:** Tallet $a$ er nivået kurven flater ut mot.
- **Fart:** $b$ sier hvor fort kurven flater ut.

Vi velger $a$ og $b$ slik at kvadratsummen

$$S(a,b)=\sum_{i=1}^{9}\bigl(y_i-m(t_i)\bigr)^2$$

blir så liten som mulig, akkurat som i uke 4.

- **Krav:** Kurven skal flate ut, så vi krever $b>0$; $a$ kan være et
  hvilket som helst tall.
- **Tillatte valg:** Valgene som oppfyller kravene, kalles det **tillatte
  området**; her er $D=\{(a,b):b>0\}$, og et punkt i $D$ er **tillatt**.

Forskjellen fra uke 4 er at modellen ikke er lineær i $b$, så vi har ingen
formel for svaret. Vi lar i stedet SciPys funksjon `minimize` søke:

1. Den starter i et punkt vi velger.
2. Den prøver seg fram mot stadig lavere verdier av $S$.
3. Den melder til slutt om søket lyktes.

Foreløpig bruker vi den som et ferdig verktøy; hvordan slike søk virker,
er temaet i uke 9 og 10.

For å sette søket på prøve gir vi det målinger som ligger nøyaktig på
linjen $y=0.5\,t$. Målet er å finne ut om tre søk fra ulike starter blir
enige, og om programmet selv kan si fra når svaret ikke er til å stole på.

### Eksperiment 1 – tilpass en modell til ni målinger

- Forutsi før du kjører: vil de tre søkene finne samme $a$ og $b$?
- Kjør cellen og les $a$, $b$ og `success` for hver start.
- Sammenlign produktet $ab$ og verdien $S$ i de tre linjene. Bytt så én
  av startverdiene og undersøk om mønsteret holder.

```{pyodide-python}
#| label: week8-no-minimum
# Ni målinger på linjen y = 0.5 t, modellen a(1 - e^(-bt)) og tre søk.
# minimize søker fra hvert startpunkt; vi skriver ut sluttpunktet.
t = np.linspace(0, 4, 9)
y = 0.5*t

def S(z):
    a, b = z
    return np.sum((y - a*(1 - np.exp(-b*t)))**2)

for start in ([1., 1.], [5., .1], [2., .5]):
    r = minimize(S, start, method='BFGS')
    a, b = r.x
    print(f'start {start}: a = {a:6.1f}, b = {b:.5f}, '
          f'a*b = {a*b:.3f}, S = {r.fun:.1e}, success = {r.success}')
```

**Hva viser forsøket?**

- **Ulike svar:** Søkene blir ikke enige om $a$ og $b$, og ingen av dem
  melder suksess (`success = False`).
- **Sluttpunktene:** De ender i ulike punkter, alle med svært store $a$ (flere
  hundre) og svært små $b$ (omtrent 0.002).
- **Felles mønster:** Produktet $ab$ er omtrent 0.50 hver gang, og $S$ er
  nesten null.

Programmet merker at noe er galt, men ikke hva. Resten av 8.1 forklarer det.

### Se på kurvene

Hvorfor blir $ab$ omtrent $0.5$? Når $bt$ er liten, er
$e^{-bt}\approx1-bt$, og da er

$$m(t)=a\,(1-e^{-bt})\approx a\,\bigl(1-(1-bt)\bigr)=ab\,t.$$

Med $ab=0.5$ ligner modellen altså linjen $0.5\,t$, og tilnærmingen blir
bedre jo mindre $b$ er. Vi vil se det med egne øyne: figuren tegner
modellkurvene med $a=0.5/b$ for fire verdier av $b$, sammen med målingene.

```{pyodide-python}
#| label: week8-model-curves
#| autorun: true
# Modellkurvene med a = 0.5/b for fire verdier av b (tegnes av en hjelper).
plot_model_curves([1, 0.3, 0.1, 0.03])
```

- **I figuren:** Hver kurve bøyer seg litt nedover, men mindre jo mindre
  $b$ er. Ingen av dem går gjennom alle de ni målingene.
- **Konklusjonen:** **$S(a,b)>0$ i alle tillatte punkter**. Hvorfor det
  gjelder for *alle* $a$ og $b>0$, og ikke bare for kurvene i figuren,
  står i fordypningen under.

::: {.reading-step title="Gå i dybden: hvorfor er kvadratsummen positiv i alle tillatte punkter?"}

Vi skiller mellom to tilfeller:

- **Når $a=0$:** Modellen er nullinjen. Den går ikke gjennom målingen
  $(4,\,2)$, så $S>0$.
- **Når $a\ne0$ og $b>0$:** Vi ser på avstanden mellom modellen og linjen,
  $d(t)=m(t)-0.5\,t$. Den andrederiverte er

$$d''(t)=m''(t)=-ab^2e^{-bt},$$

som aldri er null. Nå teller vi mulige nullpunkter:

1. Derfor er $d'$ enten strengt voksende eller strengt avtagende, så $d'$ har høyst
   ett nullpunkt.
2. Mellom to nullpunkter av $d$ har $d$ et toppunkt eller et bunnpunkt, og
   der er $d'=0$. Hadde $d$ tre nullpunkter, ville $d'$ altså hatt to, ett
   mellom hvert nabopar.
3. Derfor har $d$ høyst to nullpunkter: modellkurven treffer linjen i høyst
   to punkter.

Målingene er ni punkter på linjen. Minst sju av dem ligger altså utenfor
modellkurven, og hver av dem gir et positivt ledd i $S$. Derfor er
$S(a,b)>0$ i alle tillatte punkter.

:::

Hvor liten kan kvadratsummen bli? Cellen regner ut $S$ langs kurven $a=0.5/b$
for stadig mindre $b$, slik at vi ser i tall hvor fort $S$ synker.

```{pyodide-python}
#| label: week8-minimizing-sequence
# S langs kurven a = 0.5/b: b blir ti ganger mindre for hver linje.
for b in [1, .1, .01, .001]:
    print(f'b = {b:6}: a = {0.5/b:6}, S(a, b) = {S([0.5/b, b]):.1e}')
```

- **Tallene:** Verdiene blir $6.0,\ 0.27,\ 3.3\cdot10^{-3},\ 3.4\cdot10^{-5}$.
  Vi kan altså gjøre $S$ så liten vi vil, men aldri null.
- **Hvorfor søket fortsetter:** Søket blir aldri ferdig fordi det ikke
  finnes noe sted å stoppe. Den beste «modellen» er linjen $0.5\,t$, og den
  er selv ikke en av modellene.

### Infimum og minimum

Vi trenger et ord for tallet $0$ som $S$ kommer vilkårlig nær, men aldri
treffer.

- **Nedre grense:** Et tall $L$ er en **nedre grense** for $f$ på mengden
  $D$ hvis $f(z)\ge L$ for alle $z\in D$. For $S$ er både $-1$ og $0$ nedre
  grenser.
- **Infimum:** Den **største** nedre grensen kalles **infimum** og skrives
  $\inf_{z\in D}f(z)$. For $S$ er infimum $0$: ikke noe større tall er en nedre
  grense, fordi $S$ får verdier under ethvert positivt tall.
- **Et tall, ikke nødvendigvis en verdi:** Infimum er et tall; det trenger
  ikke være verdien i noe punkt.
- **Minimum:** Et **minimum** er et infimum som **oppnås**: det finnes et
  tillatt punkt $z_*$ med $f(z_*)=\inf f$. Da er $z_*$ et **minimumspunkt**
  og $f(z_*)$ **minimumsverdien**.
- **Tilsvarende oppover:** **Supremum** er den minste øvre grensen, og
  **maksimum** et supremum som oppnås.

Forskjellen mellom infimum og minimum ses best på en graf. Figuren viser
tre enkle funksjoner som alle har infimum $0$; se etter om verdien $0$
faktisk blir nådd i et punkt som er med i området.

```{pyodide-python}
#| label: week8-inf-pictures
#| autorun: true
# Tre funksjoner med infimum 0. Bare i den første oppnås verdien.
plot_inf_examples()
```

- **Venstre:** $g(x)=x$ på det lukkede intervallet $[0,1]$. Punktet $x=0$
  er med (fylt prikk), og $g(0)=0$. Minimum finnes.
- **Midten:** samme funksjon på $(0,1]$. Nå er $x=0$ utelatt (åpen prikk).
  Verdiene kommer så nær $0$ vi vil, men $0$ er aldri en verdi.
- **Høyre:** $e^{-x}$ på $[0,\infty)$. Grafen nærmer seg den stiplede
  linjen $0$, men treffer den aldri, fordi $e^{-x}>0$ for alle $x$.

::: {.callout-note title="Håndeksempel: tre intervaller, samme funksjon"}

**Utgangspunkt.** Funksjonen er $g(x)=x$. Vi lar bare området endre seg.

**Prøv selv.** Finn infimum og supremum på $(0,1)$, $(0,1]$ og $[0,1]$.
Oppnås de?

**Regnegangen.** Alle tre områdene har $0$ som største nedre grense og $1$
som minste øvre grense. Spørsmålet er bare om endepunktene er med.

| Område | Infimum | Oppnås? | Supremum | Oppnås? |
|:--|--:|:--|--:|:--|
| $(0,1)$ | $0$ | nei | $1$ | nei |
| $(0,1]$ | $0$ | nei | $1$ | ja, ved $x=1$ |
| $[0,1]$ | $0$ | ja, ved $x=0$ | $1$ | ja, ved $x=1$ |

På $(0,1]$ er det for hver tillatt $x$ et bedre tillatt punkt, nemlig
$x/2$. Ingen tillatt $x$ kan derfor være minimumspunkt. Å prøve flere
punkter, for eksempel på et finere rutenett, hjelper ikke.

**Dette tar vi med oss.** Funksjonen er den samme i alle radene. Det er
området som avgjør om minimum finnes.

:::

### Minimerende følger

Et optimeringsprogram lager punkt etter punkt, helst med stadig lavere
verdi. En **minimerende følge** er en følge $z_1,z_2,z_3,\ldots$ av
tillatte punkter med $f(z_k)\to\inf f$. De røde punktene i figuren er to
slike følger. Med tall:

| $k$ | $1$ | $2$ | $3$ | $4$ | $5$ | grense |
|:--|--:|--:|--:|--:|--:|:--|
| $x_k=1/k$ på $(0,1]$ | $1$ | $0.5$ | $0.333$ | $0.25$ | $0.2$ | $x_k\to0$, som **ikke er med** |
| $g(x_k)=1/k$ | $1$ | $0.5$ | $0.333$ | $0.25$ | $0.2$ | $\to0=\inf g$ |
| $x_k=k$ på $[0,\infty)$ | $1$ | $2$ | $3$ | $4$ | $5$ | $x_k\to\infty$, **rømmer** |
| $e^{-x_k}=e^{-k}$ | $0.368$ | $0.135$ | $0.050$ | $0.018$ | $0.007$ | $\to0=\inf e^{-x}$ |

Begge følgene er minimerende, men ingen av dem ender i et tillatt punkt:

- **Den første** nærmer seg et punkt utenfor området.
- **Den andre** forsvinner mot uendelig.

I eksperiment 1 er punktene $z_k=(0.5/b_k,\,b_k)$ med
$b_k=1,\ 0.1,\ 0.01,\ 0.001,\ldots$ en minimerende følge: $S(z_k)\to0=\inf S$.
Her skjer begge deler på en gang:

- Koordinaten $a_k=0.5,\ 5,\ 50,\ 500,\ldots$ rømmer.
- $b_k$ nærmer seg $0$, som ikke er tillatt.

**Hva beviser at minimum mangler?**

- At én minimerende følge mangler grense, beviser ikke alene at minimum
  mangler; en annen følge kunne kanskje hatt en grense.
- Det som avgjør i eksperimentet, er at $S>0$ i **alle** tillatte punkter,
  mens $\inf S=0$. Verdien $0$ oppnås derfor aldri, og ikke noe minimum
  finnes.

**Øv på dette:** [infimum på et åpent intervall](#uke8-oppg-infimum) og
[en minimerende følge](#uke8-oppg-folge) i 8.5, og kodeoppgaven
[kjør BFGS og les punkt og verdi](#uke8-kode-minimize) i 8.6.

## 8.2 Kompakthet gir et minimum

::: {#uke8-kompakt}
:::

### To måter å miste minimum på

I 8.1 så vi to måter en minimerende følge kan mislykkes på:

1. **Følgen rømmer.** Høyre del av figuren: $x_k=k$ forsvinner mot
   uendelig.
2. **Grensen mangler.** Midten av figuren: $x_k=1/k$ nærmer seg $0$, men
   $0$ er ikke med i $(0,1]$.

Eksperiment 1 viste begge på en gang. Hver av de to måtene gir et krav til området:

- En mengde er **begrenset** hvis det finnes et tall $R$ slik at alle
  punktene ligger innenfor avstand $R$ fra origo. Da kan ingen følge rømme.
- En mengde er **lukket** hvis den inneholder grensen til hver konvergent
  følge av punkter fra mengden. Da kan ingen grense mangle. Typisk betyr det
  at alle randpunktene er med.
- En mengde i $\mathbb R^n$ som er både lukket og begrenset, kalles
  **kompakt**.

| Mengde | Lukket? | Begrenset? | Kompakt? |
|:--|:--|:--|:--|
| $[0,1]$ | ja | ja | ja |
| $(0,1]$ | nei: $1/k\to0$, og $0$ mangler | ja | nei |
| $[0,\infty)$ | ja | nei: $k\to\infty$ | nei |
| skiven $u^2+v^2\le1$ | ja | ja | ja |
| sirkelen $u^2+v^2=1$ | ja | ja | ja |
| hele planet $\mathbb R^2$ | ja | nei | nei |
| $D=\{(a,b):b>0\}$ fra eksperiment 1 | nei: $(1,1/k)\to(1,0)$ | nei | nei |

### Ekstremalverdisetningen

**Ekstremalverdisetningen.** En kontinuerlig funksjon på en ikke-tom,
kompakt mengde har både et minimum og et maksimum.

Bruk setningen ved å kontrollere to ting hver for seg:

1. **Området:** Er det ikke-tomt, lukket og begrenset?
2. **Funksjonen:** Er den kontinuerlig?

- **Hva setningen lover:** Minimum finnes, men setningen sier ikke hvor
  det er, og ikke at det er entydig.
- **Eksempel:** For $u^2+v^2$ på skiven $u^2+v^2\le1$ er minimum $0$ i
  origo, og maksimum $1$ oppnås i alle punktene på randen.
- **Tilstrekkelig betingelse:** Setningen gir en **tilstrekkelig**
  betingelse, ikke en nødvendig. Hele $\mathbb R$ er ikke kompakt, men
  $x^2$ har likevel minimum der.

::: {.reading-step title="Gå i dybden: hvorfor gjelder setningen, og hvorfor trengs kontinuitet?"}

**Idé til bevis.** La $z_k$ være en minimerende følge i den kompakte
mengden $D$.

1. **Begrenset:** Fordi $D$ er begrenset, har følgen en delfølge som
   konvergerer (Bolzano–Weierstrass).
2. **Lukket:** Fordi $D$ er lukket, ligger grensen $z_*$ i $D$.
3. **Kontinuerlig:** Fordi $f$ er kontinuerlig, går $f(z_k)$ mot $f(z_*)$
   langs delfølgen. Dermed er $f(z_*)=\inf f$, og infimum oppnås.

**Uten kontinuitet går det galt.** På det kompakte intervallet $[0,1]$
lar vi $h(0)=1$ og $h(x)=x$ ellers. Da er $\inf h=0$, men ingen $x$ gir
$h(x)=0$. Funksjonsverdien gjør et sprang i grensen.

:::

### Kan vi redde tilpasningen fra eksperiment 1?

Nå vet vi hvorfor søket i eksperiment 1 aldri ble ferdig. Området
$D=\{(a,b):b>0\}$ er verken lukket eller begrenset, og den minimerende
følgen brukte begge smutthullene:

- $a$ rømte.
- $b$ nærmet seg den utelatte verdien $0$.

I praksis vet vi ofte på forhånd omtrent hvor store parameterne kan være.
Et batteri kan ikke lades opp til et vilkårlig høyt nivå, og en oppvarming
som tar tusen år, er ikke interessant.

- **Grensene vi velger for $a$ og $b$ før søket:** $0\le a\le20$ og $0.05\le b\le5$.
- **Hvorfor minimum finnes:** Området er da et lukket rektangel, altså
  kompakt, og $S$ er kontinuerlig.
- **Verktøyet:** Cellen bruker en variant av `minimize` (metoden
  `L-BFGS-B`) som holder seg innenfor grensene. Vi bruker den som et ferdig verktøy;
  hvordan et søk tar hensyn til grenser, kommer i uke 11 og 12.

Målet er å se om ekstremalverdisetningen holder det den lover, og hvor
minimumspunktet havner.

### Eksperiment 2 – gjør området kompakt

- Kjør cellen og les $a$, $b$ og $S$.
- Sammenlign $b$ med grensene $0.05$ og $5$. Ligger punktet inne i
  rektangelet eller på kanten?
- Bytt den nedre grensen for $b$ til $0.1$ og deretter $0.2$. Hvor havner
  minimumspunktet, og hva skjer med $S$?

```{pyodide-python}
#| label: week8-box
# Samme S som i eksperiment 1, men nå med grenser for a og b.
# L-BFGS-B søker bare blant punkter innenfor grensene.
r = minimize(S, [1., 1.], method='L-BFGS-B', bounds=[(0, 20), (0.05, 5)])
a, b = r.x
print(f'a = {a:.3f}, b = {b:.3f}, S = {r.fun:.2e}')
```

**Hva viser forsøket?**

- **Svaret:** Søket finner $a\approx10.81$, $b=0.05$ og
  $S\approx5.1\cdot10^{-3}$. Minimum finnes nå, som setningen lovet, men det
  ligger **på randen** $b=0.05$.
- **Gradienten:** Der er gradienten ikke null: $S$ vil fortsatt bli mindre
  hvis vi får gjøre $b$ mindre.
- **Nye grenser:** Med grensen $0.1$ eller $0.2$ havner minimumspunktet på
  den nye grensen, og $S$ blir større.
- **Regelen på randen:** Ved et minimum på randen gjelder altså ikke
  regelen $\nabla f=0$. Dette kommer vi tilbake til i uke 11 og 12.

::: {.reading-step title="Gå i dybden: lineær og ikke-lineær tilpasning – hvorfor merket vi ingenting i uke 4?"}

::: {#uke8-tilpasning}
:::

**Én koeffisient, regnet ut.** Den enkleste lineære modellen er en linje
gjennom origo, $y\approx c\,t$. Kvadratsummen er

$$
\begin{aligned}
Q(c)&=\sum_i(y_i-c\,t_i)^2
=\sum_i y_i^2-2c\sum_i t_iy_i+c^2\sum_i t_i^2\\
&=\|y\|^2-2c\,(t^Ty)+c^2\,(t^Tt).
\end{aligned}
$$

Dette er en parabel i $c$ med positiv andregradskoeffisient $t^Tt$ (når
$t\ne0$). Den deriverte $-2\,t^Ty+2c\,t^Tt$ er null for

$$c_*=\frac{t^Ty}{t^Tt},\qquad
Q(c_*)=\|y\|^2-2\frac{(t^Ty)^2}{t^Tt}+\frac{(t^Ty)^2}{t^Tt}
=\|y\|^2-\frac{(t^Ty)^2}{t^Tt}.$$

En parabel som åpner oppover, har alltid en bunn. Minimum finnes.

**Mange koeffisienter.** Når modellverdiene er $Ac$, utgjør alle mulige
modellverdier kolonnerommet til $A$, som er et underrom.

1. **Avgrens søket:** Vi trenger bare å lete blant modellverdiene som ligger
   minst like nær dataene som nullvektoren.
2. **Sikre eksistens:** Den delen av underrommet er lukket og begrenset, og
   avstanden er kontinuerlig, så ekstremalverdisetningen gir et nærmeste
   punkt. Lineær minste kvadrater har derfor alltid en beste tilpasning,
   også når kolonnene er avhengige.
3. **Skill kurve fra koeffisienter:** Den beste kurven er dessuten entydig:
   ekstremalverdisetningen sier bare at et nærmeste punkt finnes, men fra
   [uke 4](uke4.qmd#uke4-mk) vet vi at det nærmeste punktet er projeksjonen
   av dataene på kolonnerommet, og den er entydig.

Når kolonnene er avhengige, er koeffisientene $c$ likevel ikke entydige
(se fordypningen om den flate dalen i 8.4).

For en ikke-lineær modell er mengden av mulige modellkurver ikke et
underrom, og den trenger ikke være lukket. I eksperiment 1 nærmet kurvene
seg en rett linje som ikke selv er en modellkurve.

**Hva med ekte målinger?** Målingene i eksperiment 1 lå nøyaktig på en
linje, og det var derfor minimum manglet. Ekte målinger har støy, og da
ligger de ikke på noen linje. Kanskje finnes en beste tilpasning likevel?

Vi trenger en måte å se det på uten å stole på et søk. For en fast $b$ er
modellen $a\,g$ med $g_i=1-e^{-bt_i}$, altså lineær i $a$. Regningen over,
med $g$ i stedet for $t$, gir den beste $a$ og den minste kvadratsummen
for denne $b$:

$$a_*(b)=\frac{g^Ty}{g^Tg},\qquad
S_{\min}(b)=\|y\|^2-\frac{(g^Ty)^2}{g^Tg}.$$

- **Grensen:** Når $b\to0$, er $g\approx b\,t$, og faktoren $b$ forkortes i
  brøken: $S_{\min}(b)\to\|y\|^2-(t^Ty)^2/(t^Tt)$, som er kvadratsummen
  for den beste linjen gjennom origo.
- **Det figuren viser:** Forskjellene vi leter etter, er små, så cellen
  tegner $S_{\min}(b)$ **minus** denne grenseverdien.
- **Slik leser vi figuren:** Går kurven under null-linjen, er en modell med
  $b>0$ bedre enn alt vi kommer nær når $b\to0$.

Støyen lager vi med en tilfeldighetsgenerator med fast frø, slik at alle
får de samme tallene. Målet er å se om kurven har en bunn med $b>0$, eller
om den synker helt mot $b\to0$.

**Fordypningsforsøk A – dataene avgjør.**

- Kjør cellen og se om hver kurve går under null-linjen.
- Bytt listen til alle seks støyseriene `[0, 1, 2, 3, 4, 5]`, og tell hvor
  mange som har en bunn under null.

```{pyodide-python}
#| label: week8-noisy-data
# For hver b: beste a med formelen over og den minste S, minus grensen når b -> 0.
bs = np.geomspace(1e-4, 1, 400)
curves = {}
for seed in [0, 1, 4]:
    yn = 0.5*t + np.random.default_rng(seed).normal(0, .05, t.size)
    g = 1 - np.exp(-np.outer(bs, t))                    # én rad g for hver b
    S_min = yn @ yn - (g @ yn)**2/np.sum(g*g, axis=1)   # ||y||^2 - (g^T y)^2/(g^T g)
    limit = yn @ yn - (t @ yn)**2/(t @ t)               # den beste linjen gjennom origo
    curves[f'støy nr. {seed}'] = S_min - limit
plot_profiles(bs, curves)
```

**Hva viser forsøket?** Det avhenger av dataene:

- **Støy nr. 0 og 4:** Kurven går under null-linjen og har en bunn der:
  det finnes en beste $(a,b)$ med $b>0$.
- **Støy nr. 1:** Kurven ligger over null hele veien og synker mot null når
  $b\to0$: infimum er grenseverdien, og den oppnås ikke.
- **Utenfor figuren:** For $b>1$ fortsetter kurvene å stige.
- **Alle seks støyseriene:** Bare to gir en beste tilpasning med $b>0$.

**Hva om vi også tillater $b<0$?**

- **Modellen:** Med $b<0$ og $a<0$ krummer modellkurven oppover i stedet
  for å flate ut.
- **Metoden:** Formelen for $S_{\min}(b)$ gjelder like godt for negative
  $b$, så vi kan undersøke det uten et søk.

Cellen finner den beste negative $b$ for hver støyserie og sammenligner
den minste $S$ med den beste linjen.

```{pyodide-python}
#| label: week8-negative-b
# Samme formel for b < 0: beste b og a, og S minus kvadratsummen for den beste linjen.
bn = -np.geomspace(1e-4, 1, 400)
gn = 1 - np.exp(-np.outer(bn, t))
for seed in range(6):
    yn = 0.5*t + np.random.default_rng(seed).normal(0, .05, t.size)
    S_neg = yn @ yn - (gn @ yn)**2/np.sum(gn*gn, axis=1)
    k = S_neg.argmin()
    a_best = (gn[k] @ yn)/(gn[k] @ gn[k])
    line = yn @ yn - (t @ yn)**2/(t @ t)
    print(f'støy nr. {seed}: b = {bn[k]:.4f}, a = {a_best:7.1f}, '
          f'S minus beste linje = {S_neg[k] - line:.1e}')
```

- **Støy nr. 1, 2, 3 og 5:** For de fire seriene som manglet en bunn med
  $b>0$, er differansen negativ: de har en beste tilpasning med $b<0$.
- **Et tallfestet eksempel:** For støy nr. 2 ligger den ved
  $b\approx-0.020$ og $a\approx-24$, med $S$ omtrent $9\cdot10^{-4}$ lavere
  enn for den beste linjen.
- **Støy nr. 0 og 4:** Den beste negative $b$ havner helt inntil $0$, og
  differansen er positiv: der ligger den beste tilpasningen på siden $b>0$.

Valget av tillatt område er altså en del av problemet: det avgjør om en beste tilpasning finnes.

:::

**Dette tar vi med oss.**

- **Programmet** kan ikke se om minimum mangler; det lager bare en følge
  av stadig bedre punkter.
- **Matematikken** må avgjøre om minimum finnes, med kompakthet eller med en
  direkte sammenligning som $S>0=\inf S$.

**Øv på dette:** [lukket, begrenset, kompakt](#uke8-oppg-kompakt),
[ekstremalverdisetningen på en skive](#uke8-oppg-evt) og
[minimum på randen av et rektangel](#uke8-oppg-rand) i 8.5.

## 8.3 Hessianen: krumning i alle retninger

::: {#uke8-hessian}
:::

### Fra én variabel til flere

For en funksjon av én variabel kjenner du oppskriften: der $f'(x)=0$ og
$f''(x)>0$, har $f$ et lokalt minimum. Grunnen er Taylor-tilnærmingen

$$f(x+h)\approx f(x)+f'(x)\,h+\tfrac12f''(x)\,h^2.$$

Når $f'(x)=0$, er endringen omtrent $\tfrac12f''(x)h^2$. Den er positiv for
alle små $h\ne0$ når $f''(x)>0$: funksjonen krummer oppover.

- **Utfordringen i to variabler:** Funksjonen kan krumme oppover i én
  retning og nedover i en annen, som en sal.
- **Verktøyet:** Vi trenger derfor «den andrederiverte i retningen $p$»
  for **alle** retninger $p$. Det er jobben til Hessianmatrisen.

Vi bygger den opp med ett eksempel som følger oss gjennom hele 8.3:

$$f(x,y)=x^3+y^3-3xy.$$

### Gradienten og de stasjonære punktene

Den **partiellderiverte** $f_x$ finner vi ved å derivere med hensyn på $x$
og behandle $y$ som en konstant. Leddet $y^3$ er da en konstant, og $-3xy$
er $-3y$ ganger $x$:

$$f_x=3x^2-3y,\qquad f_y=3y^2-3x.$$

Er det en stund siden du regnet slik, finner du flere eksempler og små
oppgaver i [støtteløpet 8.7](#uke8-gradient).

**Gradienten** samler dem i en vektor:
$\nabla f(x,y)=\bigl(3x^2-3y,\ 3y^2-3x\bigr)^T$. Den peker dit $f$ stiger
brattest ([uke 6](uke6.qmd#uke6-retning)).

Et punkt der $\nabla f=0$, kalles **stasjonært**. Vi løser
$3x^2-3y=0$ og $3y^2-3x=0$:

- Den første likningen gir $y=x^2$.
- Setter vi det inn i den andre, får vi $x^4-x=0$, altså $x\,(x^3-1)=0$, så $x=0$ eller
  $x=1$.
- Med $y=x^2$ får vi punktene $(0,0)$ og $(1,1)$.

Funksjonsverdiene er $f(0,0)=0$ og $f(1,1)=1+1-3=-1$.

- **Hvorfor gradient null?** Et lokalt minimum **inne i** området kan ikke
  ha en retning som går nedover. Derfor leter vi etter $\nabla f=0$.
- **Hva det lover:** Betingelsen er **nødvendig**, men ikke
  tilstrekkelig: et stasjonært punkt trenger ikke være et minimum.
- **På randen:** Betingelsen gjelder ikke på randen: i eksperiment 2 lå
  minimum på randen, og der var gradienten ikke null.

::: {.reading-step title="Gå i dybden: hvorfor må gradienten være null i et indre minimum?"}

Et **indre** punkt har et lite område rundt seg der alle punkter er
tillatt. I et indre lokalt minimum kan ingen retning gå nedover.

1. Like nedenfor ser vi at stigningen i retningen $p$ er $\nabla f^Tp$.
   Hvis den var negativ for en $p$, kunne vi gått litt i retning $p$ og
   fått lavere verdi.
2. Var den positiv, kunne vi gått i retning $-p$, der stigningen er
   $-\nabla f^Tp<0$.
3. Altså må $\nabla f^Tp=0$ for alle $p$. Med $p=\nabla f$ får vi
   $\|\nabla f\|^2=0$, og da er $\nabla f=0$.

:::

### Hessianmatrisen, ledd for ledd

**Hessianmatrisen** $H$ samler de fire andreordens partiellderiverte. Vi
deriverer $f_x=3x^2-3y$ og $f_y=3y^2-3x$ én gang til:

| | derivert med hensyn på $x$ | derivert med hensyn på $y$ |
|:--|:--|:--|
| $f_x=3x^2-3y$ | $f_{xx}=6x$ | $f_{xy}=-3$ |
| $f_y=3y^2-3x$ | $f_{yx}=-3$ | $f_{yy}=6y$ |

$$H(x,y)=\begin{bmatrix}f_{xx}&f_{xy}\\f_{yx}&f_{yy}\end{bmatrix}
=\begin{bmatrix}6x&-3\\-3&6y\end{bmatrix}.$$

De to blandede leddene er like, $f_{xy}=f_{yx}$. Det gjelder alltid når de
andrederiverte er kontinuerlige, så $H$ er **symmetrisk**. I de to
stasjonære punktene er

$$H(0,0)=\begin{bmatrix}0&-3\\-3&0\end{bmatrix},\qquad
H(1,1)=\begin{bmatrix}6&-3\\-3&6\end{bmatrix}.$$

### Krumning langs en linje

For å bruke det vi kan fra én variabel, lager vi nå en funksjon av én variabel. Velg et punkt $z=(x_0,y_0)$ og en
retning $p=(p_1,p_2)$, og gå langs linjen $z+sp$:

$$\varphi(s)=f(z+sp)=f(x_0+sp_1,\ y_0+sp_2).$$

**Den førstederiverte.** Når $s$ øker, endres $x=x_0+sp_1$ med farten
$p_1$ og $y=y_0+sp_2$ med farten $p_2$. Kjerneregelen gir

$$\varphi'(s)=f_x\,p_1+f_y\,p_2=\nabla f(z+sp)^T\,p,$$

der $f_x$ og $f_y$ regnes ut i punktet $z+sp$. Ved $s=0$ er
$\varphi'(0)=\nabla f(z)^Tp$, den **retningsderiverte**.

**Den andrederiverte.** Vi bruker kjerneregelen én gang til, nå på hver av
faktorene $f_x$ og $f_y$. Da dukker alle de fire andrederiverte opp, hver
ganget med to av tallene $p_1,p_2$:

$$\varphi''(s)=f_{xx}p_1^2+2f_{xy}\,p_1p_2+f_{yy}p_2^2=p^T\,H(z+sp)\,p.$$

Det siste likhetstegnet ser du ved å gange ut $p^THp$ med matrisen $H$
ovenfor. Håndeksempelet under kontrollerer formelen på et konkret polynom.

::: {.reading-step title="Gå i dybden: den andrederiverte langs linjen, ledd for ledd"}

Vi deriverer $\varphi'(s)=f_x\,p_1+f_y\,p_2$ én gang til. Tallene
$p_1,p_2$ er konstanter. Faktorene $f_x$ og $f_y$ er selv funksjoner av $x$
og $y$, så vi bruker kjerneregelen på hver av dem:

$$
\begin{aligned}
\frac{d}{ds}f_x(z+sp)&=f_{xx}\,p_1+f_{xy}\,p_2,\\
\frac{d}{ds}f_y(z+sp)&=f_{yx}\,p_1+f_{yy}\,p_2.
\end{aligned}
$$

Ganger vi med $p_1$ og $p_2$ og legger sammen, får vi

$$
\begin{aligned}
\varphi''(s)&=(f_{xx}p_1+f_{xy}p_2)\,p_1+(f_{yx}p_1+f_{yy}p_2)\,p_2\\
&=f_{xx}p_1^2+2f_{xy}\,p_1p_2+f_{yy}p_2^2\\
&=\begin{bmatrix}p_1&p_2\end{bmatrix}
\begin{bmatrix}f_{xx}&f_{xy}\\f_{yx}&f_{yy}\end{bmatrix}
\begin{bmatrix}p_1\\p_2\end{bmatrix}
=p^T\,H(z+sp)\,p.
\end{aligned}
$$

:::

**Krumningen i retningen $p$ er tallet $p^THp$.** Én matrise gir oss den
andrederiverte langs alle linjer gjennom punktet.

::: {.callout-note title="Håndeksempel: helning og krumning fra matriseprodukter"}

**Utgangspunkt.** $f(x,y)=x^3+y^3-3xy$, punktet $z=(2,1)$ og retningen
$p=(1,1)$.

**Prøv selv.** Bruk gradienten og Hessianen nedenfor til å regne ut
$\nabla f(z)^Tp$ og $p^TH(z)p$. Hva forteller de to fortegnene om
helningen og krumningen langs linjen?

**Regnegangen.** Først formlene:

- $\nabla f(2,1)=(3\cdot4-3,\ 3\cdot1-6)=(9,-3)$, så
  $\nabla f(z)^Tp=9-3=6$.
- $H(2,1)=\begin{bmatrix}12&-3\\-3&6\end{bmatrix}$, så
  $Hp=(12-3,\ -3+6)=(9,3)$ og $p^THp=9+3=12$.

Til sammenligning er de ferdig beregnede linjederiverte
$\varphi'(0)=6$ og $\varphi''(0)=12$. De stemmer med de to
matriseproduktene; du trenger ikke gange ut og derivere polynomet for å finne dem.

**Dette tar vi med oss.** $\varphi'(0)=\nabla f(z)^Tp$ og
$\varphi''(0)=p^TH(z)p$. Vi trenger ikke gange ut $\varphi$ hver gang; to
små matriseprodukter gir det samme.

:::

### Den kvadratiske modellen

Nå setter vi helningen og krumningen sammen til en tilnærming av funksjonen. For små $s$ gir Taylor-tilnærmingen for $\varphi$ ved $s=0$
$\varphi(s)\approx\varphi(0)+\varphi'(0)\,s+\tfrac12\varphi''(0)\,s^2$.
Setter vi inn det vi nettopp fant, får vi den **kvadratiske modellen**

$$f(z+sp)\approx f(z)+s\,\nabla f(z)^Tp+\tfrac12\,s^2\,p^TH(z)\,p.$$

- **Lineær modell:** Uten det siste leddet er det den lineære modellen.
- **Kvadratisk modell:** Håndeksempelet viser hvor god den er: der er
  $\varphi(s)=3+6s+6s^2+2s^3$, og modellen $3+6s+6s^2$ mangler bare leddet
  $2s^3$.
- **Videre:** Den kvadratiske modellen er grunnlaget for Newtons metode i
  uke 10.

::: {.reading-step title="Gå i dybden: hvor mye vinner vi på det kvadratiske leddet?"}

Vi kan måle det. Cellen regner ut feilen i den lineære og den kvadratiske
modellen ved $z=(2,1)$ i retningen $p=(1,1)$, for $s=0.1$, $0.01$ og
$0.001$. Se hvor mange ganger mindre feilen blir når $s$ blir ti ganger
mindre.

```{pyodide-python}
#| label: week8-taylor-check
# f(x, y) = x^3 + y^3 - 3xy ved z = (2, 1) i retningen p = (1, 1).
def f3(v):
    x, y = v
    return x**3 + y**3 - 3*x*y

z = np.array([2., 1.]); p = np.array([1., 1.])
grad = np.array([3*z[0]**2 - 3*z[1], 3*z[1]**2 - 3*z[0]])   # (9, -3)
H = np.array([[6*z[0], -3.], [-3., 6*z[1]]])                # [[12, -3], [-3, 6]]
for s in [0.1, 0.01, 0.001]:
    exact = f3(z + s*p)
    linear = f3(z) + s*(grad @ p)
    quadratic = linear + 0.5*s**2*(p @ H @ p)
    print(f's = {s:5}: feil i lineær modell = {exact - linear:.1e}, '
          f'feil i kvadratisk modell = {exact - quadratic:.1e}')
```

- **Lineær modell:** Feilen er $6.2\cdot10^{-2}$, $6.0\cdot10^{-4}$ og
  $6.0\cdot10^{-6}$: den blir hundre ganger mindre når steget blir ti
  ganger kortere.
- **Kvadratisk modell:** Feilen er $2.0\cdot10^{-3}$, $2.0\cdot10^{-6}$ og
  $2.0\cdot10^{-9}$: tusen ganger mindre.
- **Hvorfor:** Håndeksempelet forklarer tallene: den lineære modellen
  mangler $6s^2+2s^3$, og den kvadratiske mangler bare $2s^3$.

:::

### Minimum, maksimum eller sadelpunkt?

I et stasjonært punkt er $\nabla f(z)=0$, så modellen blir

$$f(z+sp)\approx f(z)+\tfrac12s^2\,p^TH(z)\,p.$$

Fortegnet til $p^THp$ avgjør altså om $f$ stiger eller synker når vi går
litt ut fra $z$ i retningen $p$:

| $p^TH(z)p$ for alle $p\ne0$ | Navn på $H$ | Type stasjonært punkt |
|:--|:--|:--|
| alltid $>0$ | positiv definitt | strengt lokalt minimum |
| alltid $<0$ | negativ definitt | strengt lokalt maksimum |
| $>0$ for noen $p$, $<0$ for andre | indefinit | sadelpunkt |
| $\ge0$ (eller $\le0$), men $=0$ for en $p\ne0$ | semidefinitt | testen avgjør ikke |

Tabellen sier at fortegnet til $p^THp$ avgjør typen. Figuren viser hvordan
et minimum og et sadelpunkt ser ut for eksempelfunksjonen:

- **Til venstre:** Nivåkurvene med de to stasjonære punktene.
- **Til høyre:** $f$ langs to linjer gjennom origo.

```{pyodide-python}
#| label: week8-saddle-picture
#| autorun: true
# Nivåkurver for f = x^3 + y^3 - 3xy og f langs p = (1, 1) og p = (1, -1).
plot_saddle()
```

- **Rundt $(1,1)$:** Nivåkurvene er lukkede ovaler: en skål.
- **Rundt origo:** Nivåkurven $f=0$ krysser seg selv: en sal. Langs den
  røde retningen går $f$ **nedover** på begge sider av origo, langs den blå
  går den **oppover**.

::: {.callout-note title="Håndeksempel: ett minimum og ett sadelpunkt"}

**Utgangspunkt.** $H(0,0)=\begin{bmatrix}0&-3\\-3&0\end{bmatrix}$ og
$H(1,1)=\begin{bmatrix}6&-3\\-3&6\end{bmatrix}$.

**Prøv selv.** Regn ut $p^THp$ i origo for $p=(1,1)$ og $p=(1,-1)$. Vis så
at $p^TH(1,1)p>0$ for **alle** $p\ne0$.

**Regnegangen.** I origo:

- $p=(1,1)$: $Hp=(0-3,\ -3+0)=(-3,-3)$, så $p^THp=-3-3=-6<0$.
- $p=(1,-1)$: $Hp=(0+3,\ -3-0)=(3,-3)$, så $p^THp=3+3=6>0$.

Begge fortegn forekommer, så origo er et **sadelpunkt**. Vi kan kontrollere
direkte:

- $f(s,s)=2s^3-3s^2$, som er negativ for alle små $s\ne0$.
- $f(s,-s)=s^3-s^3+3s^2=3s^2$ er positiv.

Det er de to kurvene i figuren.

I $(1,1)$ er, for en vilkårlig $p=(p_1,p_2)$,

$$p^THp=6p_1^2-6p_1p_2+6p_2^2=3(p_1-p_2)^2+3p_1^2+3p_2^2.$$

(Gang ut $3(p_1-p_2)^2=3p_1^2-6p_1p_2+3p_2^2$ og kontroller.) En sum av
kvadrater er $\ge0$, og den er null bare når $p_1=p_2=0$. Altså er
$p^THp>0$ for alle $p\ne0$, og $(1,1)$ er et **strengt lokalt minimum**.

**Dette tar vi med oss.**

- **Sadelpunkt:** Det holder med to retninger med motsatt fortegn.
- **Minimum:** Vi må vise at $p^THp>0$ for **alle** $p\ne0$. Det kan vi
  gjøre ved å skrive $p^THp$ som en sum av kvadrater, eller med egenverdier.

:::

### Egenverdiene gir fortegnet i alle retninger

Nå ser vi hvordan egenverdiene til Hessianen avgjør fortegnet i alle retninger samtidig.
Fra [uke 5](uke5.qmd#uke5-basis) vet vi at en symmetrisk matrise har
ortogonale egenvektorer $v_1,v_2$ med egenverdier $\lambda_1,\lambda_2$.

1. Vi velger dem som enhetsvektorer.
2. Vi skriver retningen i denne basisen, $p=c_1v_1+c_2v_2$.
3. Da blir krumningen en sum av kvadrater med egenverdiene som vekter:

$$p^THp=\lambda_1c_1^2+\lambda_2c_2^2.$$

Grunnen er at $H$ bare strekker hver egenretning, og at de to retningene
står vinkelrett på hverandre, så blandingsleddene forsvinner.

::: {.reading-step title="Gå i dybden: krumningen skrevet i egenvektorbasisen"}

Enhetsvektorene oppfyller $v_1^Tv_1=v_2^Tv_2=1$ og $v_1^Tv_2=0$. Med
$p=c_1v_1+c_2v_2$ er $Hp=c_1\lambda_1v_1+c_2\lambda_2v_2$, og

$$
\begin{aligned}
p^THp&=(c_1v_1+c_2v_2)^T(c_1\lambda_1v_1+c_2\lambda_2v_2)\\
&=\lambda_1c_1^2\,v_1^Tv_1+(\lambda_1+\lambda_2)\,c_1c_2\,v_1^Tv_2+\lambda_2c_2^2\,v_2^Tv_2\\
&=\lambda_1c_1^2+\lambda_2c_2^2.
\end{aligned}
$$

:::

- **Begge positive:** Summen er positiv for alle $p\ne0$.
- **Motsatt fortegn:** Vi kan velge $p=v_1$ eller $p=v_2$ og få hvert av
  fortegnene.

Tabellen over kan derfor leses med egenverdier:

| Egenverdier | Type stasjonært punkt |
|:--|:--|
| **Alle positive** | Minimum. |
| **Alle negative** | Maksimum. |
| **Minst én positiv og minst én negativ** | Sadelpunkt, også om noen av de andre er null. |
| Ingen er negativ, men minst én er null; eller ingen er positiv, men minst én er null | Testen avgjør ikke. |

For eksempelet finner vi egenverdiene fra $\det(H-\lambda I)=0$:

- $H(1,1)$: $(6-\lambda)^2-9=0$, så $6-\lambda=\pm3$ og
  $\lambda=3$ eller $\lambda=9$. Begge positive: minimum.
- $H(0,0)$: $\lambda^2-9=0$, så $\lambda=-3$ eller $\lambda=3$. Begge
  fortegn: sadelpunkt.

Egenvektorene er de samme for begge matrisene: $(1,1)$ og $(1,-1)$.

- **Kontroll:** For eksempel er
  $H(0,0)\,(1,1)^T=(-3,-3)^T=-3\,(1,1)^T$.
- **I figuren:** Retningen $(1,1)$ med egenverdi $-3$ er den røde retningen,
  der $f$ går nedover.
- **Lengden teller:** Vektoren $(1,1)$ har lengde $\sqrt2$, så $p^THp=-6$
  er $2\cdot(-3)$.

### D-testen er 2×2-tilfellet

Fra tidligere emner kjenner du kanskje testen med
$D=f_{xx}f_{yy}-f_{xy}^2$:

| Betingelse | Type stasjonært punkt |
|:--|:--|
| $D>0$ og $f_{xx}>0$ | Minimum. |
| $D>0$ og $f_{xx}<0$ | Maksimum. |
| $D<0$ | Sadelpunkt. |

Den er egenverditesten i forkledning: for en $2\times2$-Hessian er
$D=\det H=\lambda_1\lambda_2$. Fordypningen under viser hvorfor.

For eksempelet:

- $D(1,1)=36-9=27=3\cdot9>0$ og $f_{xx}=6>0$, så minimum.
- $D(0,0)=0-9=-9=(-3)\cdot3<0$, så sadelpunkt.

For flere enn to variabler finnes ingen enkel $D$; da bruker vi egenverdiene.

::: {.reading-step title="Gå i dybden: hvorfor D-testen er egenverditesten"}

**Determinant og sum fra egenverdiene.** Skriv
$H=\begin{bmatrix}f_{xx}&f_{xy}\\f_{xy}&f_{yy}\end{bmatrix}$. Egenverdiene
er røttene i

$$\det(H-\lambda I)=(f_{xx}-\lambda)(f_{yy}-\lambda)-f_{xy}^2
=\lambda^2-(f_{xx}+f_{yy})\,\lambda+(f_{xx}f_{yy}-f_{xy}^2).$$

Et andregradspolynom med ledende koeffisient $1$ og røtter
$\lambda_1,\lambda_2$ kan også skrives
$(\lambda-\lambda_1)(\lambda-\lambda_2)=\lambda^2-(\lambda_1+\lambda_2)\,\lambda+\lambda_1\lambda_2$.
Vi sammenligner koeffisientene:

$$D=f_{xx}f_{yy}-f_{xy}^2=\lambda_1\lambda_2,\qquad
f_{xx}+f_{yy}=\lambda_1+\lambda_2.$$

For $H(1,1)$ gir det $27=3\cdot9$ og $12=3+9$.

**Testen, steg for steg.**

- **$D<0$:** Egenverdiene har motsatt fortegn: sadelpunkt.
- **$D=0$:** Minst én egenverdi er null: testen avgjør ikke.

**Når $D>0$, følger vi fortegnene:**

1. Egenverdiene har samme fortegn og ingen er null.
2. Da er $f_{xx}f_{yy}>f_{xy}^2\ge0$, så $f_{xx}$ og $f_{yy}$ har også samme
   fortegn.
3. Er $f_{xx}>0$, er summen $\lambda_1+\lambda_2=f_{xx}+f_{yy}>0$, og begge
   egenverdiene er positive: minimum.
4. Er $f_{xx}<0$, er begge negative: maksimum.

:::

::: {.reading-step title="Gå i dybden: når testen ikke avgjør"}

- **Flat retning:** Hvis en egenverdi er null og de andre har samme
  fortegn, er $p^THp=0$ i egenretningen.
- **Hva modellen mangler:** Den kvadratiske modellen er da flat i den
  retningen, og leddene av høyere orden avgjør typen.

Tre funksjoner med gradient null og samme Hessian
$H(0,0)=\begin{bmatrix}2&0\\0&0\end{bmatrix}$ i origo viser at alt kan skje:

Først gradientene og Hessianene, regnet ut generelt og så i origo:

| Funksjon | $\nabla f(u,v)$ | $H(u,v)$ | i origo |
|:--|:--|:--|:--|
| $u^2+v^4$ | $(2u,\ 4v^3)$ | $\begin{bmatrix}2&0\\0&12v^2\end{bmatrix}$ | $\nabla f=0$, $H=\begin{bmatrix}2&0\\0&0\end{bmatrix}$ |
| $u^2-v^4$ | $(2u,\ -4v^3)$ | $\begin{bmatrix}2&0\\0&-12v^2\end{bmatrix}$ | $\nabla f=0$, $H=\begin{bmatrix}2&0\\0&0\end{bmatrix}$ |
| $u^2+v^3$ | $(2u,\ 3v^2)$ | $\begin{bmatrix}2&0\\0&6v\end{bmatrix}$ | $\nabla f=0$, $H=\begin{bmatrix}2&0\\0&0\end{bmatrix}$ |

Alle tre er $0$ i origo og har $f(u,0)=u^2>0$ langs $u$-aksen. Forskjellen
ligger langs $v$-aksen ($u=0$):

| Funksjon | Langs $v$-aksen | Type i origo |
|:--|:--|:--|
| $u^2+v^4$ | $v^4\ge0$; faktisk er $f\ge0=f(0,0)$ overalt | minimum |
| $u^2-v^4$ | $-v^4<0$ for $v\ne0$ | sadelpunkt |
| $u^2+v^3$ | $v^3<0$ for $v<0$ | sadelpunkt |

- **Sadelpunkt:** Et **sadelpunkt** er her et stasjonært punkt som verken
  er et lokalt minimum eller et lokalt maksimum: det finnes både høyere og
  lavere verdier vilkårlig nær.
- **Hvorfor testen ikke avgjør:** Alle tre funksjonene har
  $\nabla f(0,0)=0$ og samme $H$, men forskjellig type. Derfor sier tabellen
  «testen avgjør ikke».

:::

**Dette tar vi med oss.**

- **Gradienten** finner kandidatene.
- **Hessianen** gir krumningen $p^THp$ i hver retning, og fortegnet avgjør
  typen.
- **Neste steg:** I 8.4 bruker vi den samme $p^THp$ til noe nytt: å
  kontrollere krumningen i **alle punkter**, ikke bare i ett.

**Øv på dette:** [regn ut en Hessian og finn et sadelpunkt](#uke8-oppg-hessian),
[krumning langs en linje](#uke8-oppg-linje) og
[to stasjonære punkter](#uke8-oppg-stasjonaer) i 8.5, og kodeoppgaven
[klassifiser med egenverdier](#uke8-kode-klassifiser) i 8.6.

## 8.4 Konveksitet: når lokalt er globalt

::: {#uke8-lokalt}
:::

### Er kandidaten vi fant, den beste?

Med 8.1–8.3 kan vi avgjøre om et minimum finnes, og om et stasjonært punkt
er et lokalt minimum. Det gjenstår et tredje spørsmål.

- **Globalt minimumspunkt:** Et tillatt punkt $z_*$ er et **globalt
  minimumspunkt** hvis $f(z_*)\le f(z)$ for alle tillatte $z$.
- **Lokalt minimumspunkt:** Punktet er et **lokalt minimumspunkt** hvis
  ulikheten gjelder for alle tillatte $z$ tilstrekkelig nær $z_*$.
- **Lokale verktøy:** Hessianen i 8.3 er en lokal test: den ser bare et lite
  område rundt punktet. Et søk som `minimize` er også lokalt; det går
  nedover fra der det starter.

Funksjonen $x^3+y^3-3xy$ fra 8.3 viser at et lokalt minimum ikke trenger å være globalt: $(1,1)$ er et
lokalt minimum, men langs linjen $y=x$ synker $f$ mot $-\infty$ når
$x\to-\infty$.

En enkel måte å teste et lokalt søk på er å starte det mange steder. Vi
gjør det på to tilpasningsproblemer:

- **Linjen fra uke 4**, $p(t)=c_0+c_1t$ med de fire målingene derfra. Her
  vet vi svaret, $c=(1.05,\,0.90)$.
- **En svingning**, $y\approx a\,e^{-0.3t}\cos(\omega t)$, der vi søker
  amplituden $a$ og frekvensen $\omega$ fra 40 målinger med litt støy.
  Målingene er laget med $a=1$ og $\omega=2$.

Cellen kjører søkene og skriver ut sluttpunktene. Målet er å finne ut
hvilken egenskap ved målfunksjonen som gjør at alle søkene blir enige, og
hva som skjer når den mangler.

### Eksperiment 3 – mange søk på to problemer

- Forutsi før du kjører: hvor mange forskjellige svar får vi i hvert problem?
- Kjør cellen og tell de forskjellige sluttpunktene for linjen og for
  svingningen. Sammenlign $S$ og `success` for svingningen.
- Legg til egne startverdier for $\omega$ i listen, og undersøk hvor de ender.

```{pyodide-python}
#| label: week8-many-starts
# Ni søk på linjefunksjonen og sju søk på svingningen, fra ulike starter.
# Problem 1: rett linje, data fra uke 4.
tl = np.array([-1., 0., 1., 2.]); bl = np.array([.2, .9, 2.1, 2.8])
def S_line(c):
    return np.sum((bl - c[0] - c[1]*tl)**2)

for c0 in (-8., 0., 8.):
    for c1 in (-8., 0., 8.):
        r = minimize(S_line, [c0, c1], method='BFGS')
        print(f'linje, start ({c0:4}, {c1:4}): c = {r.x.round(4)}')

# Problem 2: svingning med ukjent amplitude a og frekvens w.
tf = np.linspace(0, 6, 40)
yf = np.exp(-.3*tf)*np.cos(2*tf) + np.random.default_rng(8).normal(0, .02, tf.size)
def S_wave(z):
    a, w = z
    return np.sum((yf - a*np.exp(-.3*tf)*np.cos(w*tf))**2)

for w0 in [1, 2, 3, 4, 4.5, 7, 8]:
    r = minimize(S_wave, [1., w0], method='BFGS')
    # cos er en jevn funksjon: w og -w gir samme kurve, så vi skriver |w|.
    print(f'svingning, start w = {w0:3}: a = {r.x[0]:5.2f}, '
          f'w = {abs(r.x[1]):5.2f}, S = {r.fun:6.3f}, success = {r.success}')
```

**Hva viser forsøket?**

- **Linjen:** Alle ni søkene ender i $c=(1.05,\,0.90)$, svaret fra uke 4.
- **Svingningen:** Fem starter gir $\omega=2.00$ og $S=0.017$, men starten
  $\omega=4.5$ gir $\omega=4.31$ og $S=5.44$, og starten $\omega=8$ gir
  $\omega=8.44$ og $S=5.54$.
- **Stoppmeldingen:** Alle søkene melder `success = True`. Programmet vet
  ikke om det finnes en bedre dal et annet sted.

Linjefunksjonen har en egenskap som svingningen mangler, og den kan vi se
i en figur.

### Bildet: korden over grafen

Vi leter etter egenskapen som linjeproblemet har og svingningen mangler.

- **Prøv selv:** Velg to punkter på grafen og trekk den rette linjen mellom
  dem, **korden**.
- **Sammenlign figurene:** Du ser en funksjon med én dal og en med to daler,
  hver med én korde. Se om korden ligger over grafen hele veien.

```{pyodide-python}
#| label: week8-chord-pictures
#| autorun: true
# Venstre: en konveks funksjon. Høyre: en funksjon med to daler.
plot_chord_examples()
```

- **Til venstre:** Korden ligger over grafen, hvor du enn velger
  endepunktene. Grafen er én skål.
- **Til høyre:** Grafen stikker opp over korden: mellom de to dalene ligger
  en bakketopp. En funksjon med to daler kan aldri ha alle kordene over
  grafen.

Det samme kan vi prøve på de to tilpasningsproblemene ved å se på
funksjonsverdiene langs et linjestykke i planet:

- **Svingningen:** Vi tar linjestykket fra $(a,\omega)=(1,2)$ til $(1,4)$.
  Der er $S$ lik $7.65$ i midtpunktet, mens korden har høyden $4.76$: grafen
  stikker over korden, akkurat som til høyre i figuren.
- **Linjen:** Midtpunktet ligger langt under korden.

Tallene og bildene står i fordypningen.

::: {.reading-step title="Gå i dybden: kordetesten på de to tilpasningsproblemene"}

For en funksjon av to variabler velger vi to punkter i planet og ser på
funksjonsverdiene langs linjestykket mellom dem. For linjen tar vi $(0,0)$
og $(2,2)$. For svingningen tar vi $(a,\omega)=(1,2)$ og $(1,4)$.

| Problem | Verdi i endepunktene | Verdi i midtpunktet | Gjennomsnitt av endeverdiene |
|:--|:--|--:|--:|
| Linje | $13.1$ og $15.1$ | $0.1$ | $14.1$ |
| Svingning | $0.022$ og $9.50$ | $7.65$ | $4.76$ |

- **Linjen:** Midtpunktet ligger langt **under** gjennomsnittet av
  endeverdiene, det vil si under korden.
- **Svingningen:** Midtpunktet ligger **over**: mellom de to punktene
  kommer en bakketopp.

Cellen regner ut tallene i tabellen og tegner funksjonen langs hvert
linjestykke sammen med korden.

```{pyodide-python}
#| label: week8-chords
# Endeverdier, midtpunkt og gjennomsnitt langs to linjestykker, og figuren.
for F, P, Q, name in [(S_line, [0., 0.], [2., 2.], 'Linje'),
                      (S_wave, [1., 2.], [1., 4.], 'Svingning')]:
    P, Q = np.array(P), np.array(Q)
    print(f'{name}: endeverdier {F(P):.3g} og {F(Q):.3g}, '
          f'midtpunkt {F((P + Q)/2):.3g}, gjennomsnitt {(F(P) + F(Q))/2:.3g}')
    plot_slice(F, P, Q, name)
```

:::

### Konvekse funksjoner

Nå skriver vi bildet som en ulikhet:

- **Linjestykket:** Punktene fra $z$ til $x$ er $s\,x+(1-s)\,z$ med
  $0\le s\le1$: $s=0$ gir $z$, $s=1$ gir $x$, og $s=\tfrac12$ gir
  midtpunktet.
- **Korden:** Den har høyden $s\,f(x)+(1-s)\,f(z)$ over det samme punktet.

En funksjon $f$ på en mengde $D$ er **konveks** hvis grafen aldri ligger
over korden:

$$f\bigl(s\,x+(1-s)\,z\bigr)\le s\,f(x)+(1-s)\,f(z)
\qquad\text{for alle }x,z\in D\text{ og }0\le s\le1.$$

Funksjonen er **strengt konveks** hvis ulikheten er streng når $x\ne z$ og
$0<s<1$: grafen ligger da strengt under korden.

- **Moteksempel:** **Ett brudd er nok** til å vise at en funksjon ikke er
  konveks, slik midtpunktet for svingningen viste.
- **Begrunnelse for konveksitet:** Mange vellykkede kontroller beviser
  derimot ikke konveksitet; til det trenger vi et argument som gjelder alle
  punkter. Det gir Hessianen nedenfor.

### Konvekse mengder

Definisjonen av en konveks funksjon forutsetter at linjestykket mellom to
tillatte punkter selv er tillatt. En mengde $D$ er **konveks** hvis linjestykket mellom to punkter i
$D$ alltid ligger helt i $D$: $s\,x+(1-s)\,z\in D$ for alle $x,z\in D$ og
$0\le s\le1$.

Også her hjelper et bilde. Figuren viser to konvekse og to ikke-konvekse
mengder med ett linjestykke hver; finn stedet der linjestykket forlater
mengden.

```{pyodide-python}
#| label: week8-convex-sets
#| autorun: true
# To konvekse og to ikke-konvekse mengder, hver med ett linjestykke.
plot_convex_sets()
```

- **Skiven og rektangelet:** Hvert linjestykke mellom to punkter ligger i
  mengden.
- **Ringen og månesigden:** I ringen går linjestykket gjennom hullet, og i
  månesigden går det ut i innhakket.

**Ett linjestykke som forlater mengden, viser at den ikke er konveks.**
Flere eksempler:

- Sirkelen $u^2+v^2=1$ (bare randen) er ikke konveks: $(1,0)$ og $(-1,0)$
  er med, men midtpunktet $(0,0)$ er ikke med.
- Heltallene er ikke konvekse: $0$ og $1$ er med, men $\tfrac12$ er ikke med.
- Hele planet, et halvplan og et intervall er konvekse.

Kompakt og konveks er to forskjellige egenskaper:

| Mengde | Kompakt? | Konveks? |
|:--|:--|:--|
| Sirkelen | Ja. | Nei. |
| Hele planet | Nei. | Ja. |

### Fra lokalt til globalt

**Setning.** På en konveks mengde er ethvert lokalt minimum av en konveks
funksjon også globalt. Hvis funksjonen er strengt konveks, finnes det høyst
ett minimumspunkt.

Bildet bak argumentet:

1. Står du i bunnen av en dal, og det finnes et lavere punkt et annet sted,
   så går korden fra deg til det lavere punktet nedover.
2. For en konveks funksjon ligger grafen under korden.
3. Da går også grafen nedover rett ved siden av deg, og du sto ikke i en
   bunn likevel.

Dette kan du prøve selv i appleten under. Den viser en funksjon av én
variabel på intervallet $[0,4]$. Det svarte punktet $\hat x$ er et lokalt
minimum, og den stiplede grå linjen viser høyden $f(\hat x)$.

### Eksperiment 4 – finnes et lavere punkt?

- Dra det fiolette punktet $z$ langs grafen. Klarer du å finne en $z$ som
  ligger under den stiplede linjen?
- Korden går fra $\hat x$ til $z$. Dra det oransje punktet $w$ langs korden
  helt inn mot $\hat x$, eller trykk **w nær x̂**. Den lille loddrette streken
  i $w$ er grønn når grafen ligger under korden, og rød når den ligger over.
- Trykk **ikke-konveks f** og gjenta: legg $z$ i dalen til høyre og flytt
  $w$ inn mot $\hat x$.

Målet er å se hvorfor «konveks» og «et lavere punkt $z$» ikke kan gjelde
samtidig, og hvor argumentet svikter når funksjonen ikke er konveks.

```{.jsxgraph width="620" height="460" style="width:100%;max-width:620px;height:460px;border:0;"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-0.5,4.45,4.35,-0.45], axis: true, keepaspectratio: false,
  showNavigation: false, showCopyright: false,
  pan: {enabled:false}, zoom: {enabled:false}
});
var convex = true;
var F = function(x){
  var base = 1 + 0.28*(x - 1.2)*(x - 1.2);
  return convex ? base : base - 1.4*Math.exp(-(x - 3)*(x - 3)/0.22);
};
var xhat = 1.2;
var findMin = function(){
  var a = 0.4, b = 2, r = (Math.sqrt(5) - 1)/2;
  for (var k = 0; k < 60; k++){
    var c = b - r*(b - a), d = a + r*(b - a);
    if (F(c) < F(d)) { b = d; } else { a = c; }
  }
  xhat = (a + b)/2;
};
findMin();
var fhat = function(){return F(xhat);};
var graph = board.create('functiongraph',[F,0,4],{
  strokeColor:'#345f78',strokeWidth:2.5,highlight:false
});
board.create('line',[[0,fhat],[1,fhat]],{
  strokeColor:'#9aa5ad',dash:2,strokeWidth:1.5,fixed:true,highlight:false
});
var X = board.create('point',[function(){return xhat;},fhat],{
  name:'x̂',fixed:true,color:'#222222',size:4,label:{offset:[-6,16]}
});
var Z = board.create('glider',[3,F(3),graph],{name:'z',color:'#7846ad',size:5});
var chord = board.create('segment',[X,Z],{
  strokeColor:'#b45309',dash:2,strokeWidth:2,fixed:true,highlight:false
});
var W = board.create('glider',[1.2 + 0.3*1.8,F(1.2) + 0.3*(F(3) - F(1.2)),chord],{
  name:'w',color:'#b45309',size:4,label:{offset:[6,-12]}
});
var gw = function(){return F(W.X());};
var below = function(){return gw() <= W.Y() + 1e-9;};
board.create('segment',[W,[function(){return W.X();},gw]],{
  strokeColor:function(){return below() ? '#2e7d32' : '#c62828';},
  strokeWidth:3,fixed:true,highlight:false
});
var setMode = function(c){
  convex = c; findMin(); board.update();
  Z.moveTo([Z.X(),F(Z.X())]); board.update();
};
board.create('text',[0.12,4.2,function(){
  var d = Z.Y() - fhat();
  return 'f(z) − f(x̂) = '+d.toFixed(2).replace('-','−')+(d < -1e-9 ? ': z ligger lavere' : ': z ligger ikke lavere');
}],{fontSize:13,color:'#7846ad',fixed:true});
board.create('text',[0.12,3.92,function(){
  return 'i w: korden '+W.Y().toFixed(2)+', grafen '+gw().toFixed(2)+', f(x̂) = '+fhat().toFixed(2);
}],{fontSize:13,color:'#b45309',fixed:true});
board.create('text',[0.12,3.64,function(){
  return below() ? 'grafen ligger under korden' : 'grafen ligger over korden';
}],{fontSize:13,fixed:true,color:function(){return below() ? '#2e7d32' : '#c62828';}});
board.create('button',[-0.45,-0.3,'konveks f',function(){setMode(true);}]);
board.create('button',[0.93,-0.3,'ikke-konveks f',function(){setMode(false);}]);
board.create('button',[2.8,-0.3,'w nær x̂',function(){
  var t = 0.03;
  W.moveTo([xhat + t*(Z.X() - xhat),fhat() + t*(Z.Y() - fhat())]);
}]);
```

**Hva viser bildet?**

- **Den konvekse funksjonen:** Du finner ingen $z$ under den stiplede
  linjen, uansett hvor du drar: $f(z)-f(\hat x)$ blir aldri negativ.
- **Den ikke-konvekse funksjonen:** Dalen til høyre ligger lavere. Da går
  korden **nedover** fra $\hat x$, og $w$ ligger under $f(\hat x)$ samme
  hvor nær $\hat x$ du flytter det.
- **Hva konveksitet ville krevd:** Hvis grafen hadde ligget under korden,
  slik den gjør for en konveks funksjon, ville den også ligget under
  $f(\hat x)$ rett ved siden av $\hat x$, og $\hat x$ ville ikke vært noen
  bunn.
- **Hvor det svikter:** Nær $\hat x$ er streken rød: grafen stiger over
  korden før den faller ned i den andre dalen. Bakketoppen mellom dalene er
  nettopp bruddet på konveksiteten.

Det er derfor et lokalt søk kan bli stående i $\hat x$, slik søkene på
svingningen ble stående i eksperiment 3.

::: {.reading-step title="Gå i dybden: beviset steg for steg"}

1. Anta at $\hat x$ er et lokalt minimum, men at et tillatt punkt $z$ har
   lavere verdi, $f(z)<f(\hat x)$.
2. Mengden er konveks, så alle punktene $x_s=(1-s)\,\hat x+s\,z$ med
   $0\le s\le1$ er tillatte. I appleten er $x_s$ førstekoordinaten til $w$.
3. Konveksitet gir for $0<s\le1$:
   $f(x_s)\le(1-s)\,f(\hat x)+s\,f(z)$. Høyresiden er kordens høyde.
4. Høyresiden er $f(\hat x)+s\,\bigl(f(z)-f(\hat x)\bigr)$, og parentesen
   er negativ. Altså er $f(x_s)<f(\hat x)$ for alle $0<s\le1$.
5. Når $s$ er liten, ligger $x_s$ så nær $\hat x$ vi vil. Det finnes altså
   bedre punkter vilkårlig nær $\hat x$, og det motsier at $\hat x$ er et
   lokalt minimum.

Derfor finnes ingen slik $z$, og $\hat x$ er et globalt minimum.

:::

Beviset for entydigheten ved streng konveksitet er bare én linje: hvis $x\ne z$ begge var
minimumspunkter med verdi $m$, ville midtpunktet gi
$f\bigl(\tfrac{x+z}2\bigr)<\tfrac12m+\tfrac12m=m$, som er umulig.

«Høyst ett» betyr ikke «ett»: $x^2$ er strengt konveks på $(0,1)$, men har
ikke noe minimum der. Still alltid begge spørsmålene:

- **Eksistens** kommer fra 8.2.
- **Entydighet** kommer fra streng konveksitet.

### Konveksitet fra Hessianen

::: {#uke8-konveks-test}
:::

Definisjonen handler om linjestykker, og i 8.3 regnet vi ut
krumningen langs en linje:

$$\varphi(s)=f(z+sp),\qquad\varphi''(s)=p^T\,H(z+sp)\,p.$$

1. **Én variabel:** En funksjon med $\varphi''\ge0$ har en stigning
   $\varphi'$ som aldri avtar. Grafen bøyer seg da oppover hele veien, og
   korden ligger over den.
2. **Alle linjer:** Er krumningen $p^THp\ge0$ langs **alle** linjer, er $f$
   altså konveks langs alle linjestykker.

Det gir testen, på hele $\mathbb R^n$ eller på et åpent, konvekst område:

| Hessianen i **alle** punkter | Egenverdier | Konklusjon |
|:--|:--|:--|
| positiv semidefinitt: $p^THp\ge0$ for alle $p$ | ingen negative | $f$ er konveks |
| positiv definitt: $p^THp>0$ for alle $p\ne0$ | alle positive | $f$ er strengt konveks |

Legg merke til forskjellen fra 8.3: der så vi på Hessianen i **ett**
punkt. Her må testen gjelde **overalt**.

Testen for streng konveksitet går bare én vei:

- **Eksempel:** $x^4$ er strengt konveks, selv om den andrederiverte
  $12x^2$ er null i $x=0$.
- **Hva null ikke viser:** En egenverdi lik null viser altså ikke alene at
  funksjonen ikke er strengt konveks.
- **Hva vi må finne:** For å vise at funksjonen ikke er strengt konveks,
  må vi finne et linjestykke der den ikke krummer, slik som i fordypningen om den flate dalen nedenfor.

::: {.callout-note title="Håndeksempel: en strengt konveks funksjon"}

**Utgangspunkt.** $f(x,y)=x^2+xy+y^2$.

**Prøv selv.** Finn gradienten og Hessianen. Vis at $p^THp>0$ for alle
$p\ne0$, og finn minimumspunktet.

**Regnegangen.**

- Partiellderiverte: $f_x=2x+y$ og $f_y=x+2y$.
- Én gang til: $f_{xx}=2$, $f_{xy}=f_{yx}=1$, $f_{yy}=2$, så
  $H=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ i **alle** punkter.
- Krumningen i retningen $p$:
  $p^THp=2p_1^2+2p_1p_2+2p_2^2=(p_1+p_2)^2+p_1^2+p_2^2$. Det er en sum av
  kvadrater, og den er null bare for $p=0$. Altså er $H$ positiv definitt
  overalt, og $f$ er **strengt konveks** på hele planet.
- $\nabla f=0$: $2x+y=0$ og $x+2y=0$. Den første gir $y=-2x$, og da gir
  den andre $x-4x=0$, så $x=y=0$.

Origo er et lokalt minimum (positiv definitt $H$). Setningen over gjør det
**globalt**, og streng konveksitet gjør det til det **eneste**
minimumspunktet.

**Dette tar vi med oss.** Med en konstant Hessian holder det å vise
$p^THp>0$ én gang. Da er det lokale svaret også det globale.

:::

**Tilbake til eksperiment 3.**

- **Samme Hessian overalt:** For linjen er
  $S(c_0,c_1)=\sum_i(b_i-c_0-c_1t_i)^2$ et andregradspolynom i $c_0$ og
  $c_1$, så Hessianen er den samme i alle punkter.
- **Streng konveksitet:** Med $t=(-1,0,1,2)$ er den
  $\begin{bmatrix}8&4\\4&12\end{bmatrix}$, med $\det H=96-16=80>0$ og
  $S_{c_0c_0}=8>0$. Den er positiv definitt overalt, så $S$ er strengt
  konveks.
- **Ett svar for linjen:** Minimumspunktet finnes (vi fant det i uke 4),
  og det er det eneste. Derfor må alle søkene ende i det samme punktet.
- **Flere daler for svingningen:** Midtpunktet viste et brudd på
  konveksiteten, og et søk kan bli stående i en dårlig dal.

::: {.reading-step title="Gå i dybden: Hessianen til kvadratsummen for linjen"}

Hvert ledd deriveres med kjerneregelen:

$$\frac{\partial S}{\partial c_0}=-2\sum_i(b_i-c_0-c_1t_i),\qquad
\frac{\partial S}{\partial c_1}=-2\sum_it_i\,(b_i-c_0-c_1t_i).$$

Deriverer vi én gang til, får vi:

- $S_{c_0c_0}=2\sum_i1=8$.
- $S_{c_0c_1}=2\sum_it_i=4$.
- $S_{c_1c_1}=2\sum_it_i^2=12$.

Her gir $t=(-1,0,1,2)$ at $\sum t_i=2$ og $\sum t_i^2=6$. Ingen av tallene
avhenger av $c_0$ eller $c_1$.

:::

Konveksitet hører alltid til et bestemt område. Funksjonen
$x^3+y^3-3xy$ fra 8.3 er ikke konveks på hele planet, men den er strengt
konveks på området $x>\tfrac12$, $y>\tfrac12$.

::: {.reading-step title="Gå i dybden: konveks på et område, men ikke på hele planet"}

**Ikke konveks på hele planet.**

- **Fra Hessianen:** $H(0,0)$ har egenverdien $-3$, så krumningen er
  negativ i retningen $(1,1)$.
- **Ett brudd med tall:** $f(-1,-1)=-1-1-3=-5$ og $f(1,1)=-1$, med
  gjennomsnitt $-3$, mens midtpunktet gir $f(0,0)=0>-3$. Grafen stikker over
  korden.

**Strengt konveks på et område.** Se på det åpne, konvekse området
$x>\tfrac12$, $y>\tfrac12$. Der er $f_{xx}=6x>3>0$, og

$$\det H=f_{xx}f_{yy}-f_{xy}^2=6x\cdot6y-(-3)^2=36xy-9>0,$$

fordi $xy>\tfrac12\cdot\tfrac12=\tfrac14$ gir $36xy>9$.

- **I hele området:** Hessianen er positiv definitt, så $f$ er strengt
  konveks **der**.
- **Minimumspunktet:** Punktet $(1,1)$ ligger i området og er et lokalt
  minimum, så setningen om lokalt og globalt gjør det til det eneste
  minimumspunktet i området.
- **Utenfor området:** Der gjelder ikke garantien: $f$ synker mot
  $-\infty$ langs $y=x$.

:::

::: {.reading-step title="Gå i dybden: kvadratsummer er alltid konvekse – og den flate dalen"}

::: {#uke8-flat}
:::

**Langs en linje, regnet ut.** For kvadratsummen $S(c)=\|b-Ac\|_2^2$ fra
uke 4 kan vi regne langs en linje direkte. Med residualen $r=b-Ac$ er
$b-A(c+sp)=r-s\,Ap$, og

$$
\begin{aligned}
S(c+sp)&=(r-sAp)^T(r-sAp)\\
&=r^Tr-2s\,r^TAp+s^2\,(Ap)^T(Ap)\\
&=\|r\|_2^2-2s\,r^TAp+s^2\|Ap\|_2^2.
\end{aligned}
$$

- **Konveksitet:** Dette er en parabel i $s$, så
  $\varphi''(s)=2\|Ap\|_2^2\ge0$. **Kvadratsummen er derfor alltid konveks.**
- **Streng konveksitet:** Den er strengt konveks når $Ap\ne0$ for alle
  $p\ne0$, altså når nullrommet til $A$ bare inneholder nullvektoren.
- **Linjen fra eksperiment 3:**
  $2A^TA=\begin{bmatrix}8&4\\4&12\end{bmatrix}$, den samme Hessianen som vi
  fant over.
- **Skålen fra uke 6:** Skålen $\phi$ er et annet eksempel: langs en linje
  er den andrederiverte $p^TAp$, som er positiv når $A$ er SPD. Derfor hadde
  skålen én bunn.

**Hva skjer når nullrommet inneholder mer enn nullvektoren?** Regningen over sier at
kvadratsummen er konveks, men bare strengt konveks når $Ap\ne0$ for alle
$p\ne0$.

Det er lett å lage et tilfelle der det ikke gjelder: vi tar med en kolonne
som ikke tilfører noe nytt.

- **Data og modell:** Vi tilpasser dataene fra uke 4 med kolonnene $1$, $t$
  og $2t$.
- **Avhengigheten:** Den tredje kolonnen er to ganger den andre, så
  modellen kan ikke beskrive mer enn en linje.
- **Sammenligningen:** Cellen kjører BFGS fra fire starter og regner også
  ut løsningen med pseudoinversen fra uke 7.

Målet er å se hvordan et konvekst, men ikke strengt konvekst problem ser
ut for et søk.

**Fordypningsforsøk B – en flat dal.**

- Forutsi før du kjører: finner søkene fra ulike starter samme koeffisienter?
- Kjør cellen og sammenlign $c$, $S$ og $c_1+2c_2$ for de fire startene.

```{pyodide-python}
#| label: week8-flat-valley
# Tre kolonner der den tredje er 2 ganger den andre; fire BFGS-søk
# og løsningen med pseudoinversen til sammenligning.
A = np.column_stack([np.ones(4), tl, 2*tl])
def S_dep(c):
    return np.sum((bl - A @ c)**2)

for start in ([0, 0, 0], [0, 3, 0], [0, 0, 3], [5, -2, 4]):
    c = minimize(S_dep, np.array(start, float), method='BFGS').x
    print(f'start {start}: c = {c.round(3)}, S = {S_dep(c):.4f}, '
          f'c1 + 2 c2 = {c[1] + 2*c[2]:.3f}')
print('pinv (uke 7.7):', (np.linalg.pinv(A) @ bl).round(3))
```

**Hva viser forsøket?**

- **Forskjellige koeffisienter:** Søkene gir forskjellige koeffisienter,
  men samme $S=0.05$, samme $c_0=1.05$ og samme $c_1+2c_2=0.90$.
- **Samme modell:** Modellen er
  $c_0+c_1t+c_2(2t)=c_0+(c_1+2c_2)\,t$, så bare $c_0$ og $c_1+2c_2$ betyr
  noe. Endrer vi $c_1$ og $c_2$ slik at $c_1+2c_2$ står fast, endres ikke $Ac$.
- **Flate retninger:** Retningene $p$ med $Ap=0$ er **nullrommet** fra
  [uke 3](uke3.qmd#uke3-del3), og langs dem er $\varphi''=2\|Ap\|^2=0$:
  funksjonen er helt flat.
- **En hel linje med minimumspunkter:** Alle punktene på en slik linje
  gjennom et minimumspunkt er globale minimumspunkter.

I [oppgaven om den flate dalen](#uke8-oppg-nullrom) i 8.5 finner du en slik
retning selv.

- **Pseudoinversen:** Pseudoinversen fra den valgfrie
  [fanen 7.7](uke7.qmd#uke7-pseudoinvers) velger det av
  minimumspunktene som har kortest lengde.
- **Søket fra null:** Søket fra nullvektoren ender praktisk talt i samme
  punkt: alle gradientene $-2A^Tr$ står vinkelrett på nullrommet, så søket
  fra $0$ beveger seg nesten ikke langs det. Et lite avvik kommer fra at
  `minimize` regner gradientene numerisk.

| Egenskap | Hva betyr det for minimum? |
|:--|:--|
| Konveks | Alle lokale minimumspunkter er globale. |
| Strengt konveks | I tillegg finnes det høyst ett minimumspunkt. |

For kvadratsummer er det nullrommet som avgjør forskjellen.

:::

::: {.reading-step title="Gå i dybden: en nedre grense fra tangenten"}

::: {#uke8-tangent}
:::

For en deriverbar konveks funksjon ligger tangentplanet under grafen:

$$f(x)\ge f(z)+\nabla f(z)^T(x-z)\qquad\text{for alle }x.$$

- **Med konveksitet:** Hvis $\nabla f(z)=0$, sier ulikheten at
  $f(x)\ge f(z)$ for alle $x$. For en konveks funksjon er altså **gradient
  null nok til å bevise at punktet er et globalt minimum**.
- **Uten konveksitet:** Det holder ikke: et punkt med gradient null kan
  være en dårlig dal eller et sadelpunkt, som origo i 8.3.

Ulikheten kommer fra definisjonen. For $0<s\le1$ gir konveksitet
$f(z+s(x-z))\le(1-s)f(z)+s\,f(x)$. Trekk fra $f(z)$ og del på $s$:

$$\frac{f(z+s(x-z))-f(z)}{s}\le f(x)-f(z).$$

Når $s\to0^+$, går venstresiden mot den retningsderiverte
$\nabla f(z)^T(x-z)$. Eksempel: for $f(x)=x^2$ ved $z=1$ sier ulikheten
$x^2\ge2x-1$, som er $(x-1)^2\ge0$.

Øv på dette i [oppgaven om tangenten](#uke8-oppg-tangent) i 8.5.

:::

**Dette tar vi med oss.**

- **Bildet:** Konveks betyr at korden ligger over grafen.
- **Garantien:** Da er hvert lokalt minimum globalt, og streng konveksitet
  gir høyst ett.
- **Testen:** Hessianen avgjør: $p^THp\ge0$ i alle punkter og alle retninger.

**Øv på dette:** [midtpunktet i en skive og på en sirkel](#uke8-oppg-mengde),
[ett brudd er nok](#uke8-oppg-korde),
[vis konveksitet med Hessianen](#uke8-oppg-konveks) og
[én bunn eller en hel linje](#uke8-oppg-streng) i 8.5, og kodeoppgavene
[to starter på svingningen](#uke8-kode-svingning) og
[midtpunktsulikheten](#uke8-kode-midtpunkt) i 8.6.

## 8.5 Regneoppgaver

::: {#uke8-oppgaver}
:::

Oppgavene er sortert etter de tre ideene.

- **Arbeidsmåte:** Arbeid på papir først. Begrunnelsene skriver du i egne
  notater; feltene kontrollerer bare regningen.
- **Tall:** Svar eksakt uten avrunding, for eksempel `3/2`.
- **Uttrykk:** I uttrykksfeltene bruker du `*` for multiplikasjon og `^`
  for potens.
- **Ja/nei:** Skriv **1 for ja, 0 for nei**.
- **Fordypning og repetisjon:** Oppgaver som hører til en fordypning, er
  merket med det. Oppgaver om partiellderiverte og gradienter står i
  støtteløpet i 8.7.

### Idé 1: Finnes det et minimum?

::: {#uke8-oppg-infimum}
:::

La $g(x)=x^2$. På det åpne intervallet $(0,2)$ er begge endepunktene
utelatt; på $[0,2]$ er de med. Finn infimum og supremum på det åpne
intervallet, og avgjør om et minimum finnes på hvert av intervallene.

```{math-exercise}
#| label: week8-task-infimum
#| caption: Grenseverdi eller oppnådd verdi?
#| mode: equivalent
#| partial-credit: true
#| field-labels: infimum, supremum, minimum finnes på åpent intervall, minimum finnes på lukket intervall

Infimum på $(0,2)$: _[0]
Supremum på $(0,2)$: _[4]

Minimum finnes på $(0,2)$: _[0]
Minimum finnes på $[0,2]$: _[1]
```

**Forklar:** Hvorfor endrer ikke et finere rutenett svaret på det åpne
intervallet?

::: {#uke8-oppg-folge}
:::

Funksjonen $f(a,b)=(ab-1)^2+b^2$ er definert på hele planet. Begrunn først
at $f(a,b)>0$ for alle $(a,b)$: hva skjer hvis $b=0$, og hva hvis $b\ne0$?
Regn så ut $f$ langs kurven $a=1/b$.

```{math-exercise}
#| label: week8-task-sequence
#| caption: En minimerende følge uten grense
#| mode: equivalent
#| partial-credit: true
#| field-labels: f langs kurven ved b=1/10, infimum, minimum finnes

$f(10,\,1/10)=$ _[1/100]

Infimum av $f$: _[0]

Finnes et minimum? _[0]
```

**Forklar:** Skriv opp en minimerende følge. Hvilket krav i
ekstremalverdisetningen er ikke oppfylt?

::: {#uke8-oppg-kompakt}
:::

Undersøk de tre intervallene $A=[-2,3]$, $B=(-2,3]$ og $C=[0,\infty)$.
Avgjør for hvert av dem hvilke endepunkter som er med, og om punktene kan
bli vilkårlig store i absoluttverdi.

```{math-exercise}
#| label: week8-task-compact
#| caption: Lukket, begrenset og kompakt
#| mode: equivalent
#| partial-credit: true
#| field-labels: A lukket, A begrenset, A kompakt, B lukket, B begrenset, B kompakt, C lukket, C begrenset, C kompakt

$A$: lukket _[1], begrenset _[1], kompakt _[1]

$B$: lukket _[0], begrenset _[1], kompakt _[0]

$C$: lukket _[1], begrenset _[0], kompakt _[0]
```

**Forklar:** Gi en følge i $B$ som konvergerer mot et punkt utenfor $B$.

::: {#uke8-oppg-evt}
:::

Vi undersøker $f(u,v)=u^2+v^2$ på skiven
$D=\{(u,v):u^2+v^2\le4\}$. Kontroller først kravene i
ekstremalverdisetningen: er området ikke-tomt og kompakt, og er funksjonen
kontinuerlig? Finn så ekstremalverdiene.

```{math-exercise}
#| label: week8-task-existence-disk
#| caption: Ekstremalverdisetningen på en skive
#| mode: equivalent
#| partial-credit: true
#| field-labels: minimumsverdi, maksimumsverdi, u i minimumspunktet, v i minimumspunktet

Minimumsverdi: _[0]
Maksimumsverdi: _[4]

Minimumspunkt: $u=$ _[0], $v=$ _[0]
```

**Forklar:** Beskriv alle maksimumspunktene. Hvorfor gir ikke setningen et
entydig maksimumspunkt her?

::: {#uke8-oppg-rand}
:::

Vi bruker $f(a,b)=(ab-1)^2+b^2$ igjen, men bare på rektangelet
$0\le a\le10$, $\tfrac14\le b\le1$. Begrunn med ekstremalverdisetningen at
minimum finnes. Hint: hold $b$ fast og finn den beste $a$ først.

```{math-exercise}
#| label: week8-task-box
#| caption: Minimum på randen av et rektangel
#| mode: equivalent
#| partial-credit: true
#| field-labels: minimumsverdi, a i minimumspunktet, b i minimumspunktet, partiellderivert med hensyn på b

Minimumsverdi: _[1/16]

Minimumspunkt: $a=$ _[4], $b=$ _[1/4]

$\dfrac{\partial f}{\partial b}$ i minimumspunktet: _[1/2]
```

**Forklar:** Hvorfor kan den partiellderiverte være ulik null i et
minimumspunkt?

### Idé 2: Hessianen

::: {#uke8-oppg-hessian}
:::

Funksjonen $f(x,y)=x^2+4xy+y^2$ har gradient null i origo.

1. Regn ut de andrederiverte én om gangen, og sett dem inn i Hessianen.
2. Regn ut krumningen $p^THp$ i to retninger.
3. Finn til slutt egenverdiene.

```{math-exercise}
#| label: week8-task-hessian-entries
#| caption: Hessianen ledd for ledd og krumningen i to retninger
#| mode: equivalent
#| partial-credit: true
#| field-labels: f_xx, f_xy, f_yy, krumning langs (1 1), krumning langs (1 -1), minste egenverdi, største egenverdi

$f_{xx}=$ _[2], $f_{xy}=$ _[4], $f_{yy}=$ _[2]

$p=(1,1)$: $p^THp=$ _[12]
$p=(1,-1)$: $p^THp=$ _[-4]

Egenverdier: minste _[-2], største _[6]
```

**Forklar:** Hvilken type stasjonært punkt er origo? Gi en retning der $f$
synker når du går ut fra origo. Hvorfor er $p^THp$ for $p=(1,1)$ akkurat
to ganger en av egenverdiene?

::: {#uke8-oppg-linje}
:::

La $f(x,y)=x^2+y^3$, punktet $z=(1,1)$ og retningen $p=(1,-1)$.

1. Sett $\varphi(s)=f(1+s,\,1-s)$, og gang ut $\varphi(s)$ som et polynom i $s$.
2. Regn så ut $\nabla f(z)^Tp$ og $p^TH(z)p$ med gradienten og Hessianen.
3. Skriv opp den kvadratiske modellen
   $f(z)+s\,\nabla f(z)^Tp+\tfrac12s^2\,p^TH(z)p$.

```{math-exercise}
#| label: week8-task-line-curvature
#| caption: Krumning langs en linje, to veier
#| mode: equivalent
#| vars: s
#| partial-credit: true
#| field-labels: phi(s) som polynom, retningsderivert, krumning i retningen p, kvadratisk modell i s

$\varphi(s)=$ __[2 - s + 4*s^2 - s^3]

$\nabla f(z)^Tp=$ _[-1]

$p^TH(z)p=$ _[8]

Kvadratisk modell: __[2 - s + 4*s^2]
```

**Forklar:** Sammenlign $\varphi'(0)$ og $\varphi''(0)$ fra polynomet med
de to tallene. Hvilket ledd mangler i den kvadratiske modellen?

::: {#uke8-oppg-stasjonaer}
:::

Funksjonen $f(x,y)=x^3-3xy+y^2$ har to stasjonære punkter, og det ene er
origo. Løs $\nabla f=0$ for å finne det andre. Regn ut Hessianen i begge
punktene.

```{math-exercise}
#| label: week8-task-two-stationary
#| caption: To stasjonære punkter, to typer
#| mode: equivalent
#| partial-credit: true
#| field-labels: x i det andre punktet, y i det andre punktet, determinant i origo, determinant i det andre punktet, f_xx i det andre punktet, krumning i origo langs (1 1)

Det andre stasjonære punktet: $x=$ _[3/2], $y=$ _[9/4]

$\det H(0,0)=$ _[-9]

$\det H$ i det andre punktet: _[9]

$f_{xx}$ i det andre punktet: _[9]

$p^TH(0,0)p$ for $p=(1,1)$: _[-4]
```

**Forklar:** Avgjør typen til begge punktene, både med D-testen og med
fortegnet til $p^THp$.

### Idé 3: Konveksitet

::: {#uke8-oppg-mengde}
:::

Punktene $P=(2,0)$ og $Q=(-2,0)$ ligger både på sirkelranden
$K=\{(u,v):u^2+v^2=4\}$ og i skiven $D=\{(u,v):u^2+v^2\le4\}$. Finn
midtpunktet $m=(P+Q)/2$ og avgjør hvor det ligger.

```{math-exercise}
#| label: week8-task-convex-set
#| caption: Midtpunktet i en skive og på en sirkel
#| mode: equivalent
#| partial-credit: true
#| field-labels: midtpunktets første koordinat, midtpunktets andre koordinat, midtpunktet på sirkelranden, midtpunktet i skiven

$m_1=$ _[0], $m_2=$ _[0]

Er $m$ på sirkelranden $K$? _[0]
Er $m$ i skiven $D$? _[1]
```

**Forklar:** Hvilken av mengdene kan du dermed bevise at ikke er konveks?
Hvorfor beviser ikke én midtpunktsberegning alene at den andre mengden er
konveks?

::: {#uke8-oppg-korde}
:::

For $q(x)=x^4-2x^2$ bruker du endepunktene $-1$ og $1$. Regn ut verdien i
midtpunktet og gjennomsnittet av endeverdiene, altså kordens høyde over
midtpunktet.

```{math-exercise}
#| label: week8-task-convex
#| caption: Ett brudd på konveksitet er nok
#| mode: equivalent
#| partial-credit: true
#| field-labels: q i midtpunktet, gjennomsnitt av endeverdiene

$q(0)=$ _[0]
$(q(-1)+q(1))/2=$ _[-1]
```

**Forklar:** Hva sier sammenligningen om konveksitet på $\mathbb R$? Tegn
grafen og korden.

::: {#uke8-oppg-konveks}
:::

Vi undersøker $f(x,y)=x^2-2xy+2y^2+3x$ på hele planet. Regn ut Hessianen
og avgjør om $f$ er strengt konveks. Finn så det stasjonære punktet.

```{math-exercise}
#| label: week8-task-convex-test
#| caption: Konveksitet fra Hessianen og det eneste minimumspunktet
#| mode: equivalent
#| partial-credit: true
#| field-labels: f_xx, f_xy, f_yy, determinant, krumning langs (1 1), x i minimumspunktet, y i minimumspunktet

$f_{xx}=$ _[2], $f_{xy}=$ _[-2], $f_{yy}=$ _[4]

$\det H=$ _[4]

$p=(1,1)$: $p^THp=$ _[2]

Minimumspunkt: $x=$ _[-3], $y=$ _[-3/2]
```

**Forklar:** Skriv $p^THp$ som en sum av kvadrater. Hvorfor er det
stasjonære punktet et **globalt** minimum, og hvorfor det **eneste**?

::: {#uke8-oppg-streng}
:::

Sammenlign $f(u,v)=(u-2)^2$ og $g(u,v)=(u-2)^2+(v+1)^2$ på $\mathbb R^2$.
Finn Hessianen til $f$ og egenverdiene dens, minimumsverdien til $f$ og
minimumspunktet til $g$.

```{math-exercise}
#| label: week8-task-strict-convex
#| caption: Én bunn eller en hel linje?
#| mode: equivalent
#| partial-credit: true
#| field-labels: minste egenverdi til Hessianen til f, største egenverdi til Hessianen til f, minimumsverdi for f, u ved minimum av g, v ved minimum av g

Hessianen til $f$: minste egenverdi _[0], største egenverdi _[2]

Minimumsverdien til $f$: _[0]

Minimumspunktet til $g$: $u=$ _[2], $v=$ _[-1]
```

**Forklar:** Beskriv alle minimumspunktene til $f$. I hvilken retning kan
du flytte deg fra et minimumspunkt uten at $f$ endres? Forklar hvorfor
begge funksjonene er konvekse, men bare $g$ er strengt konveks.

::: {#uke8-oppg-nullrom}
:::

*Til fordypningen om den flate dalen i 8.4.*

- **Data:** I fordypningsforsøk B er kolonnene $1$, $t$ og $2t$, og dataene
  er de fire målingene fra uke 4.
- **Modellen:** $c_0+c_1t+c_2(2t)=c_0+(c_1+2c_2)t$ avhenger bare av $c_0$
  og $c_1+2c_2$.
- **Fra forsøket:** Alle minimumspunktene har $c_0=1.05$ og $c_1+2c_2=0.9$.

```{math-exercise}
#| label: week8-task-null-space
#| caption: Nullrommet gir en flat dal
#| mode: equivalent
#| partial-credit: true
#| field-labels: c2 når c1 er en halv, c2 når c1 er lik c2, d i retningen (0 4 d)

Minimumspunktet med $c_1=1/2$: $c_2=$ _[1/5]

Minimumspunktet med $c_1=c_2$: $c_2=$ _[3/10]

En retning $(0,4,d)$ som ikke endrer modellen: $d=$ _[-2]
```

**Forklar:**

1. Hvorfor er kvadratsummen konveks, men ikke strengt konveks?
2. Pseudoinversen ga minimumspunktet $(1.05,\,0.18,\,0.36)$. Kontroller at
   det står vinkelrett på retningen $(0,4,d)$ du fant.
3. Hvorfor betyr det at punktet har kortest lengde av alle minimumspunktene?

::: {#uke8-oppg-tangent}
:::

*Til fordypningen om tangenten i 8.4.* La $q(x)=(x-3)^2$. Beregn $q(1)$ og
$q'(1)$, og skriv den lineære modellen ved $x=1$ som et uttrykk i $x$.
Finn også det stasjonære punktet og funksjonsverdien der.

```{math-exercise}
#| label: week8-task-tangent
#| caption: En nedre grense fra tangenten
#| mode: equivalent
#| vars: x
#| partial-credit: true
#| field-labels: tangentuttrykk i x, stasjonært punkt, minimumsverdi

$q(1)+q'(1)(x-1)=$ __[-4*x+8]

$x_*=$ _[3]
$q(x_*)=$ _[0]
```

**Forklar:** Bruk $q''(x)$ til å begrunne streng konveksitet. Hvorfor gir
tangentulikheten ved $x_*$ et globalt minimum, og hvorfor gjør streng
konveksitet det entydig?

## 8.6 Python: SciPy-oppslag og kodeoppgaver

::: {#uke8-python}
:::

::: {#uke8-python-local}
:::

Forsøkene i 8.1–8.4 bruker `minimize` fra SciPy. Oppslagsboksen samler
det du trenger å vite om kallet og resultatet.

::: {#uke8-scipy}
:::

::: {.details title="SciPy-oppslag: kall, returverdi og kontroll"}

| Uttrykk | Betydning |
|:--|:--|
| `minimize(f, x0, method="BFGS")` | Søk lokalt fra `x0`. `f` tar en vektor og returnerer ett tall. |
| `minimize(f, x0, jac=grad_f, method="BFGS")` | Samme søk, men med en egen funksjon for gradienten. |
| `minimize(f, x0, method="L-BFGS-B", bounds=[(lo, hi), ...])` | Søk med nedre og øvre grense for hver variabel. |
| `result.x`, `result.fun` | Punktet som ble funnet, og funksjonsverdien der. |
| `result.success`, `result.message` | Om stoppkravet ble oppfylt, og hvorfor søket stoppet. |
| `result.nit` | Antall iterasjoner. |
| `np.linalg.eigvalsh(H)` | Egenverdiene til en symmetrisk matrise, i stigende rekkefølge. |

- **Hva stoppmeldingen sier:** `success = True` betyr bare at søket
  oppfylte sitt eget stoppkrav.
- **Hva vi må begrunne:** Det er ingen garanti for at punktet er et
  globalt minimum, og heller ikke for at et minimum finnes. Det må vi
  begrunne selv, som i 8.2–8.4.

:::

Kodeoppgavene kan kjøres hver for seg. Kontrollene vurderer resultatet uten
å vise løsningskoden.

::: {#uke8-kode-minimize}
:::

**SciPy-resultatet.** Minimer $q(x,y)=(x+1)^2+3(y-2)^2$ fra den oppgitte
`start`-vektoren med `jac=grad_q` og `method="BFGS"`. Returner paret
`(result.x, result.fun)`.

```{py-exercise}
#| label: week8-python-minimize
#| caption: Kjør BFGS og les punkt og verdi
#| show-test-hints: false
import numpy as np
from scipy.optimize import minimize

def q(z):
    x, y = z
    return (x + 1)**2 + 3*(y - 2)**2

def grad_q(z):
    x, y = z
    return np.array([2*(x + 1), 6*(y - 2)])

def solve_q(start):
    # TODO: Kall minimize med funksjon, startpunkt, gradient og metode.
    result = None
    # TODO: Returner punktet og funksjonsverdien.
    return None

## TESTS ##
assert np.allclose(solve_q(np.array([0., 0.]))[0], [-1., 2.], atol=1e-5)
assert np.isclose(solve_q(np.array([0., 0.]))[1], 0., atol=1e-9)
assert np.allclose(solve_q(np.array([7., 3.]))[0], [-1., 2.], atol=1e-5)
```

::: {#uke8-kode-klassifiser}
:::

**Klassifiser med egenverdier.**

- **Returverdi:** Skriv `classify(H)` som returnerer `'minimum'`,
  `'maksimum'`, `'sadelpunkt'` eller `'uavgjort'` for en symmetrisk
  Hessian i et stasjonært punkt, slik regelen med egenverdier i 8.3 sier.
- **Toleranse:** Regn egenverdier med absoluttverdi under `tol` som null.
- **Prøv etterpå:** Bruk $H(0,0)$ og $H(1,1)$ fra eksempelet i 8.3.

```{py-exercise}
#| label: week8-python-classify
#| caption: Type stasjonært punkt fra egenverdiene
#| show-test-hints: false
import numpy as np

def classify(H, tol=1e-10):
    lam = np.linalg.eigvalsh(H)
    # TODO: Bruk fortegnene til egenverdiene i lam.
    return None

## TESTS ##
assert classify(np.array([[6., -3.], [-3., 6.]])) == 'minimum'
assert classify(np.array([[0., -3.], [-3., 0.]])) == 'sadelpunkt'
assert classify(-np.eye(3)) == 'maksimum'
assert classify(np.diag([2., 0.])) == 'uavgjort'
assert classify(np.diag([1., 4., -2.])) == 'sadelpunkt'
assert classify(np.diag([-1., 0., 1.])) == 'sadelpunkt'
```

::: {#uke8-kode-svingning}
:::

**To starter på svingningen.**

1. Bruk `minimize` med `method="BFGS"` på `S_wave` fra startene
   $(a,\omega)=(1,2)$ og $(1,4.5)$.
2. Returner de to resultatobjektene som `(first, second)`.
3. Sammenlign verdiene etterpå: hvilken av dem er best, og hvorfor melder
   begge `success = True`?

```{py-exercise}
#| label: week8-python-two-starts
#| caption: Sammenlign to lokale søk
#| show-test-hints: false
import numpy as np
from scipy.optimize import minimize

tf = np.linspace(0, 6, 40)
yf = np.exp(-.3*tf)*np.cos(2*tf) + np.random.default_rng(8).normal(0, .02, tf.size)

def S_wave(z):
    a, w = z
    return np.sum((yf - a*np.exp(-.3*tf)*np.cos(w*tf))**2)

def two_searches():
    # TODO: Kjør BFGS fra (1, 2) og fra (1, 4.5).
    first = None
    second = None
    return first, second

## TESTS ##
assert np.isclose(abs(two_searches()[0].x[1]), 2.0, atol=0.02)
assert two_searches()[0].fun < 0.05
assert two_searches()[1].fun > 5
```

::: {#uke8-kode-midtpunkt}
:::

**Kontroller en midtpunktsulikhet.** Skriv `midpoint_gap(f, x, z)` som
returnerer $\tfrac12\bigl(f(x)+f(z)\bigr)-f\bigl(\tfrac{x+z}{2}\bigr)$,
altså hvor høyt korden ligger over grafen i midtpunktet. Et negativt svar
for ett par punkter viser at $f$ ikke er konveks.

```{py-exercise}
#| label: week8-python-midpoint
#| caption: Midtpunktsulikheten
#| show-test-hints: false
import numpy as np

def midpoint_gap(f, x, z):
    # TODO: Gjennomsnitt av endeverdiene minus verdien i midtpunktet.
    return None

## TESTS ##
assert np.isclose(midpoint_gap(lambda x: x**2, -1., 1.), 1.)
assert np.isclose(midpoint_gap(lambda x: x**4 - 2*x**2, -1., 1.), -1.)
assert np.isclose(midpoint_gap(lambda z: z @ z, np.array([0., 0.]), np.array([2., 2.])), 2.)
```

## 8.7 Støtteløp: flervariabel derivasjon ved behov

::: {#uke8-gradient}
:::

Denne delen repeterer stoff fra tidligere emner: partiellderiverte,
gradienten, den retningsderiverte og kjerneregelen langs en linje. Avsnitt 8.3
bygger på alt dette. Det er kanskje en stund siden du lærte det, så vi forventer
ikke at regningen sitter friskt. Bruk spørsmålene som en rask selvtest:

1. Kan du regne ut $f_x$ og $f_y$ for $f(x,y)=x^2y-y^3$?
2. Vet du hva gradienten er, og hvilken vei den peker?
3. Kan du regne ut stigningen til $f$ i en gitt retning $p$?
4. Kan du skrive $f(z+sp)$ som en funksjon av $s$ og derivere den?

Hvis svaret er ja på alle fire, kan du gå rett til oppgavene nederst.

### Partiellderiverte

Den partiellderiverte $f_x$ er den vanlige deriverte med hensyn på $x$,
der $y$ behandles som en konstant. $f_y$ finner vi på tilsvarende måte. For
$f(x,y)=x^2y+3y$:

- $f_x$: leddet $x^2y$ er $y$ ganger $x^2$, med derivert $2xy$. Leddet
  $3y$ inneholder ikke $x$ og er en konstant, med derivert $0$. Altså er
  $f_x=2xy$.
- $f_y$: leddet $x^2y$ er $x^2$ ganger $y$, med derivert $x^2$. Leddet $3y$
  har derivert $3$. Altså er $f_y=x^2+3$.

I punktet $(1,2)$ er $f_x=4$ og $f_y=4$.

### Gradient og retningsderivert

- **Gradient:** For $f(u,v)$ samler **gradienten** de partiellderiverte,
  $\nabla f=(\partial f/\partial u,\ \partial f/\partial v)^T$.
- **Et lite steg:** For et lite steg $h$ er
  $f(z+h)-f(z)\approx\nabla f(z)^Th$.
- **Retningsderivert:** Langs en retning $p$ er den **retningsderiverte**
  $\nabla f(z)^Tp$. Den er negativ når $p$ peker nedover.

Fra [uke 6](uke6.qmd#uke6-retning) vet vi at $-\nabla f$ peker brattest
nedover.

**Regn for hånd.** For $f(x,y)=x^2+2y^2$ i $z=(1,-1)$ og $p=(1,1)$:

1. **Gradienten:** $f_x=2x$ og $f_y=4y$ gir $\nabla f(1,-1)=(2,-4)$, og
   $\nabla f^Tp=2-4=-2$.
2. **Anslaget:** Et steg $0.1\,p$ anslås å endre $f$ med $0.1\cdot(-2)=-0.2$.
3. **Den faktiske endringen:** $f(1.1,-0.9)-f(1,-1)=2.83-3=-0.17$.

### Kjerneregelen langs en linje

Når vi går langs linjen $z+sp$, blir $f$ en funksjon av én variabel,
$\varphi(s)=f(z+sp)$. Med samme $f$, $z$ og $p$ som over:

$$\varphi(s)=(1+s)^2+2(-1+s)^2=1+2s+s^2+2-4s+2s^2=3-2s+3s^2.$$

1. **Førstederivert:** Da er $\varphi'(s)=-2+6s$, så $\varphi'(0)=-2$,
   akkurat lik $\nabla f(z)^Tp$.
2. **Kjerneregelen:** $x=1+s$ endres med farten $p_1=1$ og $y=-1+s$ med
   farten $p_2=1$, så $\varphi'(s)=f_x\cdot p_1+f_y\cdot p_2$.
3. **Andrederivert:** Videre er $\varphi''(s)=6$, og med
   $H=\begin{bmatrix}2&0\\0&4\end{bmatrix}$ er $p^THp=2+4=6$. Det er
   formelen $\varphi''=p^THp$ fra 8.3.
4. **Kontroll:** Til slutt gir $\varphi(0.1)=3-0.2+0.03=2.83$ den samme
   verdien som over.

### Oppgaver til støtteløpet

Vi bruker funksjonen $f(x,y)=x^2y-y^3$ i de tre første oppgavene. Skriv
først de partiellderiverte som uttrykk i $x$ og $y$, og sett så inn
punktet $(2,1)$.

```{math-exercise}
#| label: week8-support-partials
#| caption: Partiellderiverte og gradienten i et punkt
#| mode: equivalent
#| vars: x, y
#| partial-credit: true
#| field-labels: f_x som uttrykk, f_y som uttrykk, f_x i (2 1), f_y i (2 1)

$f_x=$ __[2*x*y]

$f_y=$ __[x^2 - 3*y^2]

$f_x(2,1)=$ _[4], $f_y(2,1)=$ _[1]
```

Bruk gradienten i $(2,1)$ fra forrige oppgave. Regn ut stigningen i
retningen $p=(1,-2)$. Finn så tallet $d$ som gjør at retningen $(1,d)$ har
stigning null, og regn til slutt ut stigningen i retningen $-\nabla f(2,1)$.

```{math-exercise}
#| label: week8-support-directional
#| caption: Stigning i tre retninger
#| mode: equivalent
#| partial-credit: true
#| field-labels: retningsderivert langs (1 -2), d med stigning null, retningsderivert langs minus gradienten

$\nabla f(2,1)^Tp$ for $p=(1,-2)$: _[2]

$d=$ _[-4]

$\nabla f(2,1)^T\bigl(-\nabla f(2,1)\bigr)=$ _[-17]
```

Deriver $f_x$ og $f_y$ én gang til, og sett inn $(2,1)$. Kontroller at de
to blandede leddene blir like.

```{math-exercise}
#| label: week8-support-hessian-entries
#| caption: Hessianen i et punkt, ledd for ledd
#| mode: equivalent
#| partial-credit: true
#| field-labels: f_xx, f_xy, f_yx, f_yy, determinant

$f_{xx}(2,1)=$ _[2], $f_{xy}(2,1)=$ _[4]

$f_{yx}(2,1)=$ _[4], $f_{yy}(2,1)=$ _[-6]

$\det H(2,1)=$ _[-28]
```

For $h(u,v)=u^2-4v^2$ skal du først kontrollere at gradienten er null i
origo. Finn så egenverdiene og determinanten til Hessianen.

```{math-exercise}
#| label: week8-task-hessian
#| caption: Klassifiser et stasjonært punkt
#| mode: equivalent
#| partial-credit: true
#| field-labels: positiv egenverdi, negativ egenverdi, determinant

Positiv egenverdi: _[2]
Negativ egenverdi: _[-8]
Determinant: _[-16]
```

**Forklar:** Er origo et lokalt minimum, et lokalt maksimum eller et
sadelpunkt? Begrunn med verdiene langs de to koordinataksene.

**Kodeoppgave – gradienten.** For $q(x,y)=(x-1)^2+2(y+2)^2$ skal
`grad_q(z)` returnere begge partiellderiverte som en NumPy-array.

```{py-exercise}
#| label: week8-python-gradient
#| caption: Beregn gradienten til en kvadratisk funksjon
#| show-test-hints: false
import numpy as np

def grad_q(z):
    x, y = z
    # TODO: Returner de to partiellderiverte i riktig rekkefølge.
    return np.array([0., 0.])

## TESTS ##
assert np.allclose(grad_q(np.array([1., -2.])), [0., 0.])
assert np.allclose(grad_q(np.array([3., 0.])), [4., 8.])
assert np.allclose(grad_q(np.array([-2., -3.])), [-6., -4.])
```

:::
