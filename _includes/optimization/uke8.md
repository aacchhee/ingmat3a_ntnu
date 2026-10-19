<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 8.0 Oversikt

<div id="uke8-start"></div>

### To spørsmål før vi velger en metode

I [uke 4](uke4.qmd#uke4-mk) flyttet vi på to skyveknapper til kvadratsummen
$S(c_0,c_1)$ ble så liten som mulig. Det var et **optimeringsproblem**:
vi valgte tall som gjorde en **målfunksjon** minst mulig. I
[uke 6](uke6.qmd#uke6-energi) fant vi løsningen av et lineært system som
bunnen av en skål. Nå skal vi se på problemer der bunnen ikke er like lett
å finne, og der et numerisk søk kan gi et svar som ser fornuftig ut, men
ikke er det beste.

Denne uka handler om to spørsmål som en numerisk metode ikke kan besvare
for oss:

- **Finnes det et beste svar?** En følge av stadig bedre forsøk trenger
  ikke å ende i et minimum.
- **Er kandidaten vi fant, den beste?** Et lokalt søk ser bare området
  rundt seg.

Det første spørsmålet besvarer vi med begrepene **infimum** og **kompakthet**.
Det andre besvarer vi med **konveksitet**. Begge er nye. Gradient,
stasjonære punkter og Hessianmatrisen kjenner du fra før; de står samlet i
støtteløpet i 8.7, og vi bruker dem når vi trenger dem.

**Forelesning** viser hovedløpet. **Gå i dybden** åpner bevis og
mellomregninger. Regneoppgavene står i 8.5 og kodeoppgavene i 8.6.

### Kort løype

1. [Et søk som aldri blir ferdig](#uke8-eksistens): infimum og minimum.
2. [To måter å miste minimum på](#uke8-kompakt): lukket, begrenset, kompakt.
3. [Lineær og ikke-lineær tilpasning](#uke8-tilpasning): når dataene avgjør.
4. [Mange starter, ett svar?](#uke8-lokalt): konvekse funksjoner.
5. [Krumning langs alle linjer](#uke8-konveks-test): en test for konveksitet.
6. [En flat dal](#uke8-flat): konveks, men ikke strengt konveks.

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 2: fikspunktiterasjon](page4.qmd) | En følge kan nærme seg noe. Er grensen et tillatt svar? |
| [Uke 3: nullrom](uke3.qmd#uke3-del3) | Hvilke endringer av inputen merker ikke outputen? |
| [Uke 4: minste kvadrater](uke4.qmd#uke4-mk) | Hvorfor fant vi alltid én beste linje? |
| [Uke 5: egenverdier](uke5.qmd) | Hvordan ser vi fortegnet til $h^THh$ i alle retninger? |
| [Uke 6: skålen $\phi$](uke6.qmd#uke6-energi) | Hvorfor hadde skålen bare én bunn? |

### Læringsmål

Etter denne uka skal du kunne

- skille mellom infimum og minimum, og beskrive en minimerende følge,
- avgjøre om en mengde er lukket, begrenset og kompakt, og bruke
  ekstremalverdisetningen,
- forklare hvorfor lineær minste kvadrater alltid har en beste tilpasning,
  mens en ikke-lineær modell kan mangle den,
- avgjøre om en funksjon er konveks med definisjonen eller med Hessianen,
  og forklare hvorfor et lokalt minimum da også er globalt,
- bruke `minimize` i SciPy og vurdere svaret kritisk.

## 8.1 Et søk som aldri blir ferdig

<div id="uke8-eksistens"></div>

### Eksperiment 1 – tilpass en modell til ni målinger

Ni målinger ligger nøyaktig på linjen $y=0.5\,t$. Vi prøver likevel å
beskrive dem med modellen

$$m(t)=a\,(1-e^{-bt}),$$

som brukes for prosesser som flater ut, for eksempel oppvarming eller
lading. Vi velger $a$ og $b$ slik at kvadratsummen

$$S(a,b)=\sum_{i=1}^{9}\bigl(y_i-m(t_i)\bigr)^2$$

blir så liten som mulig, akkurat som i uke 4. Forskjellen er at modellen
ikke er lineær i $b$. Vi lar derfor `minimize` fra SciPy søke, fra tre
ulike startpunkter.

**Forutsi:** Vil de tre søkene finne samme $a$ og $b$?

```{pyodide-python}
#| label: week8-no-minimum
# Ni målinger på linjen y = 0.5 t.
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

**Hva viser forsøket?** Alle tre søkene gir opp (`success = False`) etter
det største antallet steg SciPy tillater. De ender med svært store $a$
(omtrent 240–260), svært små $b$ (omtrent 0.002) og forskjellige tall.
Produktet $ab$ er derimot omtrent 0.50 hver gang, og $S$ er nesten null.

### Sett ord på det du ser

Prøv selv å følge kurven $a=0.5/b$ og gjøre $b$ mindre:

```{pyodide-python}
#| label: week8-minimizing-sequence
for b in [1, .1, .01, .001]:
    print(f'b = {b:6}: S(0.5/b, b) = {S([0.5/b, b]):.1e}')
```

Verdiene blir $6.0,\ 0.27,\ 3.3\cdot10^{-3},\ 3.4\cdot10^{-5}$. Vi kan
altså gjøre $S$ så liten vi vil. Likevel finnes det ingen $(a,b)$ med
$S(a,b)=0$: modellkurven $a(1-e^{-bt})$ er aldri en rett linje, mens
dataene er det. Søket blir aldri ferdig fordi det ikke finnes noe sted å
stoppe.

Når $b$ blir liten og $a=0.5/b$, nærmer modellkurven seg linjen $0.5\,t$.
Den beste «modellen» er altså en grense som selv ikke er en av modellene.

### Infimum og minimum

Et tall $L$ er en **nedre grense** for $f$ på mengden $D$ hvis
$f(z)\ge L$ for alle $z\in D$. Den største nedre grensen kalles
**infimum** og skrives $\inf_{z\in D}f(z)$. Infimum er et tall; det
trenger ikke være verdien i noe punkt.

Et **minimum** er et infimum som **oppnås**: det finnes et tillatt punkt
$z_*$ med $f(z_*)=\inf f$. Da er $z_*$ et **minimumspunkt** og $f(z_*)$
**minimumsverdien**. Tilsvarende er **supremum** den minste øvre grensen,
og **maksimum** et supremum som oppnås.

En **minimerende følge** er en følge $z_1,z_2,\ldots$ av tillatte punkter
med $f(z_k)\to\inf f$. Det er nettopp dette et optimeringsprogram lager:
stadig bedre punkter. Spørsmålet er om følgen har en grense som selv er et
minimumspunkt.

I eksperimentet er $\inf S=0$, og punktene $(0.5/b,\,b)$ med $b\to0$ er en
minimerende følge. Den har ingen grense i planet: $a$ vokser uten grense.
Derfor finnes ikke noe minimum.

::: {.callout-note title="Håndeksempel: tre intervaller, samme funksjon"}

**Utgangspunkt.** Funksjonen er $g(x)=x$. Vi lar bare området endre seg.

**Prøv selv.** Finn infimum på $(0,1]$ og på $[0,1]$. Oppnås det?

**Regnegangen.**

| Område | Infimum | Oppnås? | Supremum | Oppnås? |
|:--|--:|:--|--:|:--|
| $(0,1)$ | $0$ | nei | $1$ | nei |
| $(0,1]$ | $0$ | nei | $1$ | ja, ved $x=1$ |
| $[0,1]$ | $0$ | ja, ved $x=0$ | $1$ | ja, ved $x=1$ |

På $(0,1]$ er følgen $x_k=1/k$ minimerende, med $g(x_k)\to0$. Grensen $0$
er ikke med i området. For hver tillatt $x$ er $x/2$ også tillatt og
bedre; et finere rutenett hjelper ikke.

**Dette tar vi med oss.** Funksjonen er den samme i alle radene. Det er
området som avgjør om minimum finnes.

:::

## 8.2 Kompakthet gir et minimum

<div id="uke8-kompakt"></div>

### To måter å miste minimum på

Vi har nå sett to måter en minimerende følge kan mislykkes på:

1. **Følgen rømmer.** I eksperiment 1 vokser $a$ uten grense. Et enklere
   eksempel er $e^{-x}$ på $[0,\infty)$: infimum er $0$, men følgen
   $x_k=k$ forsvinner mot uendelig.
2. **Grensen mangler.** Følgen $x_k=1/k$ nærmer seg $0$, men $0$ er ikke
   med i $(0,1]$.

Hver av dem gir et krav til området.

En mengde er **begrenset** hvis alle punktene ligger innenfor en endelig
avstand fra origo. Da kan ingen følge rømme. En mengde er **lukket** hvis
den inneholder grensen til hver konvergent følge av punkter fra mengden.
Da mangler ingen grense. En mengde i $\mathbb R^n$ som er både lukket og
begrenset, kalles **kompakt**.

| Mengde | Lukket? | Begrenset? | Kompakt? |
|:--|:--|:--|:--|
| $[0,1]$ | ja | ja | ja |
| $(0,1]$ | nei | ja | nei |
| $[0,\infty)$ | ja | nei | nei |
| skiven $u^2+v^2\le1$ | ja | ja | ja |
| sirkelen $u^2+v^2=1$ | ja | ja | ja |
| hele planet $\mathbb R^2$ | ja | nei | nei |

### Ekstremalverdisetningen

**Ekstremalverdisetningen.** En kontinuerlig funksjon på en ikke-tom,
kompakt mengde har både et minimum og et maksimum.

Bruk den slik: kontroller **området** (ikke-tomt, lukket, begrenset) og
**funksjonen** (kontinuerlig) hver for seg. Setningen sier at minimum
finnes, men ikke hvor det er, og ikke at det er entydig. For
$u^2+v^2$ på skiven $u^2+v^2\le1$ er minimum $0$ i origo, og maksimum $1$
oppnås i alle punktene på randen.

Setningen gir en **tilstrekkelig** betingelse, ikke en nødvendig. Hele
$\mathbb R$ er ikke kompakt, men $x^2$ har likevel minimum der.

<details class="reading-step">
<summary>Gå i dybden: hvorfor gjelder setningen, og hvorfor trengs kontinuitet?</summary>

**Idé til bevis.** La $z_k$ være en minimerende følge i den kompakte
mengden $D$. Fordi $D$ er begrenset, har følgen en delfølge som
konvergerer (Bolzano–Weierstrass). Fordi $D$ er lukket, ligger grensen
$z_*$ i $D$. Fordi $f$ er kontinuerlig, går $f(z_k)$ mot $f(z_*)$ langs
delfølgen. Dermed er $f(z_*)=\inf f$, og infimum oppnås.

**Uten kontinuitet går det galt.** På det kompakte intervallet $[0,1]$
lar vi $h(0)=1$ og $h(x)=x$ ellers. Da er $\inf h=0$, men ingen $x$ gir
$h(x)=0$. Funksjonsverdien gjør et sprang i grensen.

</details>

### Eksperiment 2 – gjør området kompakt

Vi går tilbake til eksperiment 1, men tillater bare
$0\le a\le20$ og $0.05\le b\le5$. Området er nå et lukket rektangel, altså
kompakt, og $S$ er kontinuerlig. Ekstremalverdisetningen lover et minimum.

```{pyodide-python}
#| label: week8-box
# Samme S som i eksperiment 1, men med grenser for a og b.
r = minimize(S, [1., 1.], method='L-BFGS-B', bounds=[(0, 20), (0.05, 5)])
a, b = r.x
print(f'a = {a:.3f}, b = {b:.3f}, S = {r.fun:.2e}')
```

Søket finner $a\approx10.81$, $b=0.05$ og $S\approx5.1\cdot10^{-3}$.
Minimum finnes nå, men det ligger **på randen** $b=0.05$. Der er
gradienten ikke null: $S$ vil fortsatt bli mindre hvis vi får gjøre $b$
mindre. Ved et minimum på randen gjelder altså ikke regelen
$\nabla f=0$. Dette kommer vi tilbake til i uke 11 og 12.

### Lineær og ikke-lineær tilpasning

<div id="uke8-tilpasning"></div>

Hvorfor merket vi ingenting av dette i uke 4? Der var modellen lineær i
koeffisientene: modellverdiene er $Ac$, og alle mulige modellverdier utgjør
kolonnerommet til $A$. Den beste tilpasningen er projeksjonen av dataene på
dette underrommet. **Et underrom er lukket**, så projeksjonen finnes alltid.
Lineær minste kvadrater har derfor alltid en beste tilpasning, også når
kolonnene er avhengige; da er den bare ikke entydig (se 8.4).

For en ikke-lineær modell er mengden av mulige modellkurver ikke et
underrom, og den trenger ikke være lukket. I eksperiment 1 nærmet kurvene
seg en rett linje som ikke selv er en modellkurve.

### Eksperiment 3 – dataene avgjør

Ekte målinger har støy. Vi legger litt støy på de ni målingene og spør om
en beste tilpasning finnes. For en fast $b$ er modellen lineær i $a$, så
den beste $a$ finner vi med minste kvadrater fra uke 4. Vi tegner den
minste verdien av $S$ som funksjon av $b$. Når $b\to0$, nærmer verdien seg
den beste rette linjen gjennom origo, $y\approx c\,t$.

```{pyodide-python}
#| label: week8-noisy-data
bs = np.geomspace(1e-4, 5, 400)
fig, ax = plt.subplots(figsize=(6.5, 4))
for seed in [0, 1, 4]:
    yn = 0.5*t + np.random.default_rng(seed).normal(0, .05, t.size)
    best = []
    for b in bs:
        g = 1 - np.exp(-b*t)
        a = (g @ yn)/(g @ g)            # beste a for denne b (uke 4)
        best.append(np.sum((yn - a*g)**2))
    line = np.sum((yn - (yn @ t)/(t @ t)*t)**2)   # beste linje y = c t
    ax.semilogx(bs, best, label=f'støy nr. {seed}')
    ax.axhline(line, linestyle=':', color=ax.lines[-1].get_color())
ax.set(xlabel='b', ylabel='minste S for denne b')
ax.legend(); plt.show()
```

Den stiplede linjen viser grenseverdien når $b\to0$. For støy nr. 0 og 4
har kurven en bunn under den stiplede linjen: der finnes en beste $(a,b)$.
For støy nr. 1 synker kurven hele veien mot $b\to0$: infimum er
grenseverdien, og den oppnås ikke. Endre listen til alle seks støyseriene
`[0, 1, 2, 3, 4, 5]`: bare to av dem gir en beste tilpasning.

**Dette tar vi med oss.** Et program kan ikke se om minimum mangler; det
lager bare en minimerende følge. Om følgen har en grense, må vi avgjøre
med matematikk: kompakthet, eller en direkte sammenligning som her.

## 8.3 Mange starter, ett svar?

<div id="uke8-lokalt"></div>

### Lokalt og globalt minimum

Et tillatt punkt $z_*$ er et **globalt minimumspunkt** hvis
$f(z_*)\le f(z)$ for alle tillatte $z$. Det er et **lokalt
minimumspunkt** hvis ulikheten gjelder for alle tillatte $z$ tilstrekkelig
nær $z_*$. Et lokalt søk, som `minimize`, finner i beste fall et lokalt
minimum. Vi undersøker når det er nok.

### Eksperiment 4 – mange søk på to problemer

Vi starter lokale søk fra mange punkter på to tilpasningsproblemer:

- **Linjen fra uke 4**, $p(t)=c_0+c_1t$ med de fire målingene derfra.
- **En svingning**, $y\approx a\,e^{-0.3t}\cos(\omega t)$, der vi søker
  amplituden $a$ og frekvensen $\omega$ fra 40 målinger med litt støy.

**Forutsi:** Hvor mange forskjellige svar får vi i hvert problem?

```{pyodide-python}
#| label: week8-many-starts
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

for w0 in [1, 2, 3, 4, 4.5, 5, 6, 7, 8]:
    r = minimize(S_wave, [1., w0], method='BFGS')
    print(f'svingning, start w = {w0:3}: a = {r.x[0]:5.2f}, '
          f'w = {abs(r.x[1]):5.2f}, S = {r.fun:6.3f}, success = {r.success}')
```

**Hva viser forsøket?** Alle ni søkene på linjen ender i
$c=(1.05,\,0.90)$, svaret fra uke 4. For svingningen gir sju starter
$\omega=2.00$ og $S=0.017$, men starten $\omega=4.5$ gir $\omega=4.31$ og
$S=5.44$, og starten $\omega=8$ gir $\omega=8.44$ og $S=5.54$. Alle
søkene melder `success = True`. Programmet kan ikke skille en god dal fra
en dårlig.

### Sett ord på det du ser: skjær funksjonen langs en linje

Velg to punkter og se på funksjonsverdiene på linjestykket mellom dem.
For linjen tar vi $(0,0)$ og $(2,2)$. For svingningen tar vi
$(a,\omega)=(1,2)$ og $(1,4)$.

| Problem | Verdi i endepunktene | Verdi i midtpunktet | Gjennomsnitt av endeverdiene |
|:--|:--|--:|--:|
| Linje | $13.1$ og $15.1$ | $0.1$ | $14.1$ |
| Svingning | $0.022$ og $9.50$ | $7.65$ | $4.76$ |

For linjen ligger midtpunktet langt **under** gjennomsnittet av
endeverdiene. For svingningen ligger det **over**: mellom de to punktene
kommer en «bakketopp». Det er nettopp slike bakketopper som skiller dalene
i eksperiment 4.

### Konvekse funksjoner og konvekse mengder

En funksjon $f$ er **konveks** hvis verdien mellom to punkter aldri ligger
over den rette linjen mellom endeverdiene:

$$f\bigl(ta+(1-t)b\bigr)\le t\,f(a)+(1-t)\,f(b)
\qquad\text{for alle }a,b\text{ og }0\le t\le1.$$

Når $t$ går fra $0$ til $1$, går $ta+(1-t)b$ langs linjestykket fra $b$
til $a$. Ved $t=\tfrac12$ sammenligner vi verdien i midtpunktet med
gjennomsnittet av endeverdiene, som i tabellen. **Ett brudd er nok** til
å vise at en funksjon ikke er konveks. Mange vellykkede kontroller beviser
derimot ikke konveksitet; til det trenger vi et argument som gjelder alle
punkter (8.4).

Funksjonen er **strengt konveks** hvis ulikheten er streng når $a\ne b$ og
$0<t<1$.

Definisjonen krever at linjestykket mellom to tillatte punkter selv er
tillatt. En mengde $D$ er **konveks** hvis $ta+(1-t)b\in D$ for alle
$a,b\in D$ og $0\le t\le1$:

- skiven $u^2+v^2\le1$ er konveks,
- sirkelen $u^2+v^2=1$ er ikke konveks: $(1,0)$ og $(-1,0)$ er med, men
  midtpunktet $(0,0)$ er ikke med,
- heltallene er ikke konvekse: $0$ og $1$ er med, men $\tfrac12$ er ikke med.

Kompakt og konveks er to forskjellige egenskaper: sirkelen er kompakt,
men ikke konveks, og hele planet er konvekst, men ikke kompakt.

### Fra lokalt til globalt

**På en konveks mengde er ethvert lokalt minimum av en konveks funksjon
også globalt. Hvis funksjonen er strengt konveks, finnes det høyst ett
minimumspunkt.**

Dette forklarer eksperiment 4: kvadratsummen for linjen er konveks (8.4),
så alle søk må ende i samme minimum. For svingningen er konveksiteten
brutt, og et søk kan bli stående i en dårlig dal.

«Høyst ett» betyr ikke «ett»: $x^2$ er strengt konveks på $(0,1)$, men har
ikke noe minimum der. **Eksistens** kommer fra 8.2, **entydighet** fra
streng konveksitet. Still alltid begge spørsmålene.

<details class="reading-step">
<summary>Gå i dybden: hvorfor er et lokalt minimum globalt?</summary>

Anta at $x_*$ er et lokalt minimum, men at et tillatt punkt $y$ har
$f(y)<f(x_*)$. Siden mengden er konveks, er alle punktene
$x_t=(1-t)x_*+ty$ tillatte. Konveksitet gir for $0<t\le1$

$$f(x_t)\le(1-t)f(x_*)+t\,f(y)<f(x_*).$$

Ved å velge $t$ liten ligger $x_t$ så nær $x_*$ vi vil, og er likevel
bedre. Det motsier at $x_*$ er et lokalt minimum.

Hvis $f$ er strengt konveks og har to minimumspunkter $a\ne b$ med samme
verdi $m$, gir midtpunktet $f\bigl(\tfrac{a+b}2\bigr)<\tfrac12m+\tfrac12m=m$,
som er umulig. Derfor finnes høyst ett minimumspunkt.

</details>

## 8.4 Krumning langs alle linjer

<div id="uke8-konveks-test"></div>

### Den andrederiverte langs en linje

Definisjonen av konveksitet handler om linjestykker. Vi kan derfor se på
funksjonen langs én linje om gangen. Velg et punkt $z$ og en retning $p$,
og sett

$$\varphi(t)=f(z+tp).$$

Fra uke 6 og støtteløpet i 8.7 er $\varphi'(t)=\nabla f(z+tp)^Tp$. Deriverer
vi en gang til, får vi

$$\varphi''(t)=p^T\,H(z+tp)\,p,$$

der $H$ er Hessianmatrisen. En funksjon av én variabel med
$\varphi''\ge0$ krummer oppover overalt og er konveks. Det gir testen:

| Hessianen i **alle** punkter | Konklusjon |
|:--|:--|
| positiv semidefinit: $p^THp\ge0$ for alle $p$ | $f$ er konveks |
| positiv definit: $p^THp>0$ for alle $p\ne0$ | $f$ er strengt konveks |

Fra [uke 5](uke5.qmd) vet vi at en symmetrisk matrise er positiv
(semi)definit akkurat når alle egenverdiene er positive (ikke-negative).
Legg merke til forskjellen fra den lokale testen i støtteløpet: der ser vi
på Hessianen i **ett** punkt. Her må testen gjelde **overalt**.

::: {.callout-note title="Håndeksempel: krumning i tre retninger"}

**Utgangspunkt.** $f(x,y)=x^2+xy+y^2$ har den konstante Hessianen
$H=\begin{bmatrix}2&1\\1&2\end{bmatrix}$.

**Prøv selv.** Regn ut $p^THp$ for $p=(1,0)$, $(1,1)$ og $(1,-1)$.

**Regnegangen.** Vi får $2$, $6$ og $2$. Egenverdiene til $H$ er $1$ og
$3$, med egenvektorer langs $(1,-1)$ og $(1,1)$. For en enhetsvektor $p$
ligger $p^THp$ alltid mellom $1$ og $3$.

**Dette tar vi med oss.** Alle egenverdiene er positive, så $f$ er
strengt konveks. Fra Matematikk 2 kjenner du kanskje testen
$f_{xx}f_{yy}-f_{xy}^2>0$ og $f_{xx}>0$. Den er den samme testen:
$f_{xx}f_{yy}-f_{xy}^2=\det H=\lambda_1\lambda_2$ og
$f_{xx}+f_{yy}=\lambda_1+\lambda_2$. For flere enn to variabler bruker vi
egenverdiene.

:::

### Skålen fra uke 6 og kvadratsummer

For $\phi(x)=\tfrac12x^TAx-b^Tx$ fra uke 6 er Hessianen $A$ i alle punkter.
Når $A$ er SPD, er $\phi$ strengt konveks. Det forklarer hvorfor skålen
hadde én bunn.

For kvadratsummen $S(c)=\|b-Ac\|_2^2$ fra uke 4 er Hessianen $2A^TA$, og

$$p^T(2A^TA)p=2\|Ap\|_2^2\ge0.$$

**Kvadratsummen er derfor alltid konveks.** Den er strengt konveks når
$Ap\ne0$ for alle $p\ne0$, altså når nullrommet til $A$ bare inneholder
nullvektoren. Konveksitet, rang og nullrom henger sammen.

### En nedre grense fra tangenten

For en deriverbar konveks funksjon ligger tangentplanet under grafen:

$$f(y)\ge f(z)+\nabla f(z)^T(y-z)\qquad\text{for alle }y.$$

Hvis $\nabla f(z)=0$, sier ulikheten at $f(y)\ge f(z)$ for alle $y$.
**For en konveks funksjon er gradient null nok til å bevise globalt
minimum.** Uten konveksitet kan et punkt med gradient null være en dårlig
dal eller et sadelpunkt.

<details class="reading-step">
<summary>Gå i dybden: hvor kommer tangentulikheten fra?</summary>

For $0<t\le1$ gir konveksitet $f(z+t(y-z))\le(1-t)f(z)+tf(y)$. Trekk fra
$f(z)$ og del på $t$:

$$\frac{f(z+t(y-z))-f(z)}{t}\le f(y)-f(z).$$

Når $t\to0^+$, går venstresiden mot den retningsderiverte
$\nabla f(z)^T(y-z)$. Det gir ulikheten. Eksempel: for $f(x)=x^2$ ved
$z=1$ sier den $y^2\ge2y-1$, som er $(y-1)^2\ge0$.

</details>

### Eksperiment 5 – en flat dal

<div id="uke8-flat"></div>

Hva skjer når kvadratsummen er konveks, men ikke strengt konveks? Vi
tilpasser dataene fra uke 4 med kolonnene $1$, $t$ og $2t$. Den tredje
kolonnen er to ganger den andre.

**Forutsi:** Finner søkene fra ulike starter samme koeffisienter?

```{pyodide-python}
#| label: week8-flat-valley
A = np.column_stack([np.ones(4), tl, 2*tl])
def S_dep(c):
    return np.sum((bl - A @ c)**2)

for start in ([0, 0, 0], [0, 3, 0], [0, 0, 3], [5, -2, 4]):
    c = minimize(S_dep, np.array(start, float), method='BFGS').x
    print(f'start {start}: c = {c.round(3)}, S = {S_dep(c):.4f}, '
          f'c1 + 2 c2 = {c[1] + 2*c[2]:.3f}')
print('pinv (uke 7.7):', (np.linalg.pinv(A) @ bl).round(3))
```

**Hva viser forsøket?** Søkene gir forskjellige koeffisienter, men samme
$S=0.05$, samme $c_0=1.05$ og samme $c_1+2c_2=0.90$. Minimumspunktene
ligger langs en linje i retningen $(0,2,-1)$: en endring i denne retningen
endrer ikke $Ac$. Det er **nullrommet** fra uke 3. Alle punktene på linjen
er globale minimumspunkter. Pseudoinversen fra uke 7.7 velger det korteste
av dem, $(1.05,\,0.18,\,0.36)$. Legg merke til at søket fra nullvektoren
ender akkurat der.

**Dette tar vi med oss.** Konveks betyr at alle lokale minimum er globale.
Strengt konveks betyr i tillegg at det bare finnes ett. Forskjellen er
nullrommet.

## 8.5 Regneoppgaver

<div id="uke8-oppgaver"></div>

Oppgave 1–4 følger 8.1–8.2, og oppgave 5–10 følger 8.3–8.4. Svar eksakt
uten avrunding. I uttrykksfeltene bruker du `*` for multiplikasjon og `^`
for potens. Der det spørres om ja/nei, skriver du **1 for ja, 0 for nei**.
Begrunnelsene skriver du i egne notater; feltene kontrollerer regningen.
En oppgave om stasjonære punkter står i støtteløpet i 8.7.

**Oppgave 1 – en følge uten grense.**

```{math-exercise}
#| label: week8-task-sequence
#| caption: Oppgave 1 – en følge uten grense
#| mode: equivalent
#| partial-credit: true
#| field-labels: f langs kurven ved b=1/10, infimum, minimum finnes

La $f(a,b)=(ab-1)^2+b^2$ på hele planet. Begrunn først at $f(a,b)>0$ for alle $(a,b)$: hva skjer hvis $b=0$? Regn så ut $f$ langs kurven $a=1/b$.

$f(10,\,1/10)=$ _[1/100]

Infimum av $f$: _[0]

Finnes et minimum? _[0]

Skriv en minimerende følge i egne notater. Hvilket krav i ekstremalverdisetningen er ikke oppfylt?
```

**Oppgave 2 – grenseverdi eller oppnådd verdi?**

```{math-exercise}
#| label: week8-task-infimum
#| caption: Oppgave 2 – grenseverdi eller oppnådd verdi?
#| mode: equivalent
#| partial-credit: true
#| field-labels: infimum, supremum, minimum finnes på åpent intervall, minimum finnes på lukket intervall

La $g(x)=x^2$. På det åpne intervallet $(0,2)$ er begge endepunktene utelatt. Finn infimum og supremum. Avgjør om et minimum finnes, både på $(0,2)$ og på $[0,2]$.

Infimum på $(0,2)$: _[0]
Supremum på $(0,2)$: _[4]

Minimum finnes på $(0,2)$: _[0]
Minimum finnes på $[0,2]$: _[1]

Forklar i egne notater hvorfor et finere rutenett ikke endrer svaret på det åpne intervallet.
```

**Oppgave 3 – lukket er ikke nok.**

```{math-exercise}
#| label: week8-task-compact
#| caption: Oppgave 3 – lukket er ikke nok
#| mode: equivalent
#| partial-credit: true
#| field-labels: A lukket, A begrenset, A kompakt, B lukket, B begrenset, B kompakt, C lukket, C begrenset, C kompakt

Undersøk $A=[-2,3]$, $B=(-2,3]$ og $C=[0,\infty)$. Begrunn i egne notater hvilke endepunkter som er med, og om punktene kan bli vilkårlig store i absoluttverdi.

$A$: lukket _[1], begrenset _[1], kompakt _[1]

$B$: lukket _[0], begrenset _[1], kompakt _[0]

$C$: lukket _[1], begrenset _[0], kompakt _[0]
```

**Oppgave 4 – et kompakt område med minimum på randen.**

```{math-exercise}
#| label: week8-task-box
#| caption: Oppgave 4 – minimum på randen
#| mode: equivalent
#| partial-credit: true
#| field-labels: minimumsverdi, a i minimumspunktet, b i minimumspunktet, partiellderivert med hensyn på b

Bruk $f(a,b)=(ab-1)^2+b^2$ fra oppgave 1, men bare på rektangelet $0\le a\le10$, $\tfrac14\le b\le1$. Begrunn med ekstremalverdisetningen at minimum finnes. Hint: for en fast $b$ er det beste valget $a=1/b$; da er $f=b^2$.

Minimumsverdi: _[1/16]

Minimumspunkt: $a=$ _[4], $b=$ _[1/4]

$\dfrac{\partial f}{\partial b}$ i minimumspunktet: _[1/2]

Hvorfor kan den partiellderiverte være ulik null i et minimumspunkt?
```

**Oppgave 5 – skive og sirkelrand.**

```{math-exercise}
#| label: week8-task-convex-set
#| caption: Oppgave 5 – skive og sirkelrand
#| mode: equivalent
#| partial-credit: true
#| field-labels: midtpunktets første koordinat, midtpunktets andre koordinat, midtpunktet på sirkelranden, midtpunktet i skiven

Punktene $a=(2,0)$ og $b=(-2,0)$ ligger både på sirkelranden $S=\{(u,v):u^2+v^2=4\}$ og i skiven $D=\{(u,v):u^2+v^2\le4\}$. Finn midtpunktet $m=(a+b)/2$.

$m_1=$ _[0], $m_2=$ _[0]

Er $m$ på sirkelranden $S$? _[0]
Er $m$ i skiven $D$? _[1]

Hvilken av mengdene kan du dermed bevise at ikke er konveks? Forklar hvorfor én midtpunktsberegning ikke alene beviser at den andre mengden er konveks.
```

**Oppgave 6 – ett brudd på konveksitet er nok.**

```{math-exercise}
#| label: week8-task-convex
#| caption: Oppgave 6 – ett brudd på konveksitet er nok
#| mode: equivalent
#| partial-credit: true
#| field-labels: q i midtpunktet, gjennomsnitt av endeverdiene

For $q(x)=x^4-2x^2$ bruker du $a=-1$ og $b=1$. Regn ut verdien i midtpunktet og gjennomsnittet av endeverdiene.

$q((a+b)/2)=$ _[0]
$(q(a)+q(b))/2=$ _[-1]

Hva sier sammenligningen om konveksitet på $\mathbb R$?
```

**Oppgave 7 – krumning i alle retninger.**

```{math-exercise}
#| label: week8-task-curvature
#| caption: Oppgave 7 – krumning i alle retninger
#| mode: equivalent
#| partial-credit: true
#| field-labels: krumning langs (1 -1), krumning langs (1 1), minste egenverdi, største egenverdi, determinant

For $f(x,y)=x^2+xy+y^2$ er $H=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ i alle punkter. Regn ut $p^THp$ for to retninger, og finn egenverdiene og determinanten.

$p=(1,-1)$: $p^THp=$ _[2]
$p=(1,1)$: $p^THp=$ _[6]

Egenverdier: minste _[1], største _[3]

$\det H=$ _[3]

Er $f$ strengt konveks? Begrunn både med egenverdiene og med testen $f_{xx}f_{yy}-f_{xy}^2>0$, $f_{xx}>0$.
```

**Oppgave 8 – én bunn eller en hel linje?**

```{math-exercise}
#| label: week8-task-strict-convex
#| caption: Oppgave 8 – én bunn eller en hel linje?
#| mode: equivalent
#| partial-credit: true
#| field-labels: minste egenverdi til Hf, største egenverdi til Hf, minimumsverdi for f, u ved minimum av g, v ved minimum av g

Sammenlign $f(u,v)=(u-2)^2$ og $g(u,v)=(u-2)^2+(v+1)^2$ på $\mathbb R^2$.

Hessianen til $f$: minste egenverdi _[0], største egenverdi _[2]

Minimumsverdien til $f$: _[0]

Minimumspunktet til $g$: $u=$ _[2], $v=$ _[-1]

Beskriv alle minimumspunktene til $f$. I hvilken retning kan du flytte deg fra et minimumspunkt uten at $f$ endres? Forklar hvorfor begge funksjonene er konvekse, men bare $g$ er strengt konveks.
```

**Oppgave 9 – nullrommet gir en flat dal.**

```{math-exercise}
#| label: week8-task-null-space
#| caption: Oppgave 9 – nullrommet gir en flat dal
#| mode: equivalent
#| partial-credit: true
#| field-labels: c0, c1 + 2 c2, minste kvadratsum, retning i nullrommet

I eksperiment 5 er kolonnene $1$, $t$ og $2t$, og dataene er de fire målingene fra uke 4. Bruk at modellen $c_0+c_1t+c_2(2t)=c_0+(c_1+2c_2)t$ bare avhenger av $c_0$ og $c_1+2c_2$, og at den beste linjen fra uke 4 er $1.05+0.90\,t$ med kvadratsum $0.05$.

$c_0=$ _[21/20]
$c_1+2c_2=$ _[9/10]
Minste kvadratsum: _[1/20]

En retning $(0,2,d)$ som ikke endrer modellen: $d=$ _[-1]

Forklar hvorfor kvadratsummen er konveks, men ikke strengt konveks.
```

**Oppgave 10 – en nedre grense fra tangenten.**

```{math-exercise}
#| label: week8-task-tangent
#| caption: Oppgave 10 – en nedre grense fra tangenten
#| mode: equivalent
#| partial-credit: true
#| field-labels: tangentuttrykk i y, stasjonært punkt, minimumsverdi

La $q(x)=(x-3)^2$. Beregn $q(1)$ og $q'(1)$, og skriv den lineære modellen ved $x=1$ som et uttrykk i $y$.

$q(1)+q'(1)(y-1)=$ __[-4*y+8]

Finn også det stasjonære punktet og funksjonsverdien der:

$x_*=$ _[3]
$q(x_*)=$ _[0]

Bruk $q''(x)$ til å begrunne streng konveksitet. Forklar deretter hvorfor tangentulikheten ved $x_*$ gir et globalt, entydig minimum.
```

## 8.6 Python: SciPy og egne søk

<div id="uke8-python"></div>

<div id="uke8-python-local"></div>

Forsøkene i 8.1–8.4 bruker `minimize` fra SciPy. Oppslagsboksen samler
det du trenger å vite om kallet og resultatet.

<div id="uke8-scipy"></div>

<details>
<summary>SciPy-oppslag: kall, returverdi og kontroll</summary>

| Uttrykk | Betydning |
|:--|:--|
| `minimize(f, x0, method="BFGS")` | Søk lokalt fra `x0`. `f` tar en vektor og returnerer ett tall. |
| `minimize(f, x0, jac=grad_f, method="BFGS")` | Samme søk, men med en egen funksjon for gradienten. |
| `minimize(f, x0, method="L-BFGS-B", bounds=[(lo, hi), ...])` | Søk med nedre og øvre grense for hver variabel. |
| `result.x`, `result.fun` | Punktet som ble funnet, og funksjonsverdien der. |
| `result.success`, `result.message` | Om stoppkravet ble oppfylt, og hvorfor søket stoppet. |
| `result.nit` | Antall iterasjoner. |

`success = True` betyr bare at søket oppfylte sitt eget stoppkrav. Det er
ingen garanti for at punktet er et globalt minimum, og heller ikke for at
et minimum finnes. Det må vi begrunne selv, som i 8.2–8.4.

</details>

Kodeoppgavene kan kjøres hver for seg. Kontrollene vurderer resultatet uten
å vise løsningskoden.

**Oppgave 1 – SciPy-resultatet.** Minimer $q(x,y)=(x+1)^2+3(y-2)^2$ fra
den oppgitte `start`-vektoren med `jac=grad_q` og `method="BFGS"`.
Returner paret `(result.x, result.fun)`.

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

**Oppgave 2 – to starter på svingningen.** Bruk `minimize` med
`method="BFGS"` på `S_wave` fra startene $(a,\omega)=(1,2)$ og $(1,4.5)$.
Returner de to resultatobjektene som `(first, second)`. Sammenlign
verdiene etterpå: hvilken av dem er best, og hvorfor melder begge
`success = True`?

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

**Oppgave 3 – kontroller en midtpunktsulikhet.** Skriv `midpoint_gap(f, a, b)`
som returnerer $\tfrac12\bigl(f(a)+f(b)\bigr)-f\bigl(\tfrac{a+b}{2}\bigr)$.
Et negativt svar for ett par punkter viser at $f$ ikke er konveks.

```{py-exercise}
#| label: week8-python-midpoint
#| caption: Midtpunktsulikheten
#| show-test-hints: false
import numpy as np

def midpoint_gap(f, a, b):
    # TODO: Gjennomsnitt av endeverdiene minus verdien i midtpunktet.
    return None

## TESTS ##
assert np.isclose(midpoint_gap(lambda x: x**2, -1., 1.), 1.)
assert np.isclose(midpoint_gap(lambda x: x**4 - 2*x**2, -1., 1.), -1.)
assert np.isclose(midpoint_gap(lambda z: z @ z, np.array([0., 0.]), np.array([2., 2.])), 2.)
```

## 8.7 Støtteløp: lokale tester ved behov

<div id="uke8-gradient"></div>

Denne delen repeterer stoff fra tidligere emner og fra uke 6. Du trenger
ikke lese den hvis du kan svare ja på disse spørsmålene:

1. Kan du regne ut gradienten og Hessianmatrisen til en funksjon av to variabler?
2. Vet du hva et stasjonært punkt er, og hvorfor gradienten er null i et
   indre lokalt minimum?
3. Kan du avgjøre om et stasjonært punkt er et lokalt minimum, et lokalt
   maksimum eller et sadelpunkt?

### Gradient og retningsderivert

For $f(u,v)$ samler **gradienten** de partiellderiverte,
$\nabla f=(\partial f/\partial u,\ \partial f/\partial v)^T$. For et lite
steg $h$ er $f(z+h)-f(z)\approx\nabla f(z)^Th$. Langs en retning $p$ er den
**retningsderiverte** $\nabla f(z)^Tp$. Den er negativ når $p$ peker nedover.
Fra [uke 6](uke6.qmd#uke6-retning) vet vi at $-\nabla f$ peker brattest
nedover.

**Regn for hånd.** For $f(x,y)=x^2+2y^2$ i $z=(1,-1)$ og $p=(1,1)$:
$\nabla f(1,-1)=(2,-4)$, og $\nabla f^Tp=2-4=-2$. Et steg med $t=0.1$
anslås å endre $f$ med $-0.2$; den faktiske endringen er
$f(1.1,-0.9)-f(1,-1)=-0.17$.

### Stasjonære punkter og Hessianen

<div id="uke8-hessian"></div>

Et **indre** punkt har et lite område rundt seg der alle punkter er
tillatt. I et indre lokalt minimum av en deriverbar funksjon er
$\nabla f=0$. Et punkt med $\nabla f=0$ kalles **stasjonært**. Det er en
nødvendig betingelse, ikke en tilstrekkelig.

**Hessianmatrisen** $H$ samler de andre partiellderiverte. Den er
symmetrisk når de andrederiverte er kontinuerlige. Nær et punkt gjelder
Taylor-tilnærmingen

$$f(z+h)\approx f(z)+\nabla f(z)^Th+\tfrac12h^TH(z)h.$$

I et stasjonært punkt avgjør fortegnet til $h^THh$ typen:

| $H$ i det stasjonære punktet | Egenverdier | Type |
|:--|:--|:--|
| positiv definit | alle positive | strengt lokalt minimum |
| negativ definit | alle negative | strengt lokalt maksimum |
| indefinit | begge fortegn | sadelpunkt |
| semidefinit med en null egenverdi | | testen avgjør ikke |

| Funksjon | Hessian i origo | Type |
|:--|:--|:--|
| $u^2+v^2$ | $\operatorname{diag}(2,2)$ | minimum |
| $-u^2-v^2$ | $\operatorname{diag}(-2,-2)$ | maksimum |
| $u^2-v^2$ | $\operatorname{diag}(2,-2)$ | sadelpunkt |

Både $u^4$ og $-u^4$ har andrederivert null i origo, men den ene har
minimum og den andre maksimum der. Derfor avgjør ikke testen når en
egenverdi er null. Testen krever også et **indre** punkt: $f(x)=x$ på
$[0,1]$ har minimum i $x=0$, der $f'=1$.

### Oppgaver til støtteløpet

```{math-exercise}
#| label: week8-task-hessian
#| caption: Støtteløp – kritisk punkt og krumning
#| mode: equivalent
#| partial-credit: true
#| field-labels: positiv egenverdi, negativ egenverdi, determinant

For $h(u,v)=u^2-4v^2$ skal du først kontrollere at gradienten er null i origo. Finn så egenverdiene og determinanten til Hessianen. Er origo et lokalt minimum, et lokalt maksimum eller et sadelpunkt? Begrunn med verdiene langs de to koordinataksene.

Positiv egenverdi: _[2]
Negativ egenverdi: _[-8]
Determinant: _[-16]
```

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
