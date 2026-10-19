## Når skalaen bestemmer farten

Samme modell, samme data og samme metode. Likevel trenger gradientmetoden
titalls millioner steg i én beskrivelse av problemet og under femti i en annen.
**Hvorfor?** I dette prosjektet bruker du teorien fra uke 9 på ekte data:
kritisk steg, konvergensfaktor og kondisjonstall fra del A, Armijo fra del B
og garantien med subnivåmengder og koersivitet fra del D.

Funksjonen vi skal minimere, kommer fra statistikk. Du trenger ingen
forkunnskaper der: vi bygger den opp fra en figur, to oppskytinger og en
kalkulator før vi begynner å optimere.

### Dataene

Natten før romfergen Challenger ble skutt opp 28. januar 1986, ble det
diskutert om kulde kunne svekke O-ringene som tetter skjøtene i
rakettmotorene. Romfergen brøt sammen 73 sekunder etter oppskytingen, og alle
sju om bord omkom. Romfergene hadde hatt 24 oppskytinger før denne. Etter
ulykken analyserte Dalal, Fowlkes og Hoadley (1989, *Journal of the American
Statistical Association* 84, s. 945–957) dataene fra de 23 av disse
oppskytingene der rakettmotorene ble berget og O-ringene kunne undersøkes. For
hver oppskyting har vi

- temperaturen $T_i$ ved oppskytingen, i °F (fra 53 til 81),
- $y_i=1$ hvis minst én O-ring viste varmeskade, ellers $y_i=0$
  (7 av 23 oppskytinger hadde skade).

I analysen deres er temperaturen ved Challenger-oppskytingen oppgitt til
31 °F, altså 22 °F under den laveste temperaturen i dataene. Vi kommer tilbake
til hva modellen kan og ikke kan si om det.

### Fra ja/nei-data til en sannsynlighetskurve

Vi vil vite hvordan sjansen for skade avhenger av temperaturen. Men hver
oppskyting gir bare svaret 0 eller 1, aldri en sannsynlighet. Vi trenger derfor
to ting: en **kurve** $p(T)$ som gir sannsynligheten for skade ved
temperaturen $T$, og en **regel** som sier hvilken kurve som passer best med
dataene. Vi tar det i tre små steg.

#### Hvorfor ikke en rett linje?

Det første vi kan prøve, er minste kvadraters metode fra [uke 4](uke4.qmd#uke4-mk):
tilpass en rett linje $a+bT$ til de 23 punktene $(T_i,y_i)$. Cellen regner ut
linjen med `np.linalg.lstsq`, skriver ut noen verdier og tegner den.

```{pyodide-python}
#| label: project9-line
# Minste kvadraters linje a + b·T gjennom 0/1-dataene (uke 4).
line = np.linalg.lstsq(design(temps), damage, rcond=None)[0]
a, b = line
print(f'linjen: {a:.3f} + ({b:.4f})·T')
print(f'linjen er 0 ved T = {-a/b:.1f} °F og 1 ved T = {(1 - a)/b:.1f} °F')
for T in [31, 53, 81]:
    print(f'«sannsynlighet» ved {T} °F: {a + b*T:.3f}')
show_line_fit(line)
```

Linjen synker med temperaturen, slik vi venter. Men den er 0 ved 77.7 °F og
negativ for varmere oppskytinger: ved 81 °F gir den $-0.123$, og tre av
oppskytingene (78, 79 og 81 °F) får en negativ «sannsynlighet». I den andre
enden er linjen 1 ved 51.0 °F, og ved 31 °F gir den 1.746. En sannsynlighet må
ligge mellom 0 og 1. Vi trenger en kurve som flater ut mot 1 for kalde og mot 0
for varme oppskytinger.

#### S-kurven og hva parameterne betyr

Den **logistiske funksjonen**

$$\sigma(s)=\frac{1}{1+e^{-s}}$$

gjør nettopp det. Den er nær 1 for store positive $s$, nær 0 for store
negative $s$, og $\sigma(0)=\tfrac12$. Noen små tall: $\sigma(1)\approx0.731$,
$\sigma(2)\approx0.881$ og $\sigma(4)\approx0.982$. Kurven er symmetrisk:
$\sigma(-s)=1-\sigma(s)$, så $\sigma(-2)\approx0.119$. Vi lar $s$ avhenge
lineært av temperaturen:

$$p(T)=\sigma(\beta_0+\beta_1T).$$

De to tallene $\beta_0$ og $\beta_1$ har en enkel betydning:

- **Terskelen.** $p(T)=\tfrac12$ nøyaktig når $\beta_0+\beta_1T=0$, altså ved
  $T=-\beta_0/\beta_1$. Med negativ $\beta_1$ er skade mest sannsynlig når det
  er kaldere enn terskelen.
- **Brattheten.** $\beta_1$ sier hvor mye $s$ endres per grad. Negativ
  $\beta_1$ betyr at $p$ synker når det blir varmere. Jo større $|\beta_1|$,
  desto brattere er overgangen fra «nesten sikkert skade» til «nesten sikkert
  ikke».

Cellen tegner kurven med fasiten $\beta_0=15.0429$, $\beta_1=-0.23216$, som du
skal finne med gradientmetoden senere, og en kurve der begge tallene er
halvert.

```{pyodide-python}
#| label: project9-s-curve
# To S-kurver: fasiten og en kurve med halvparten så store koeffisienter.
for name, beta in [('fasit', beta_oracle), ('halve koeffisienter', beta_oracle/2)]:
    print(f'{name:<20} terskel -β0/β1 = {-beta[0]/beta[1]:.1f} °F,  '
          f'p(53) = {sigma(beta[0] + beta[1]*53):.2f},  p(75) = {sigma(beta[0] + beta[1]*75):.2f}')
show_curves([beta_oracle, beta_oracle/2], ['fasit', 'halve koeffisienter'])
```

Begge kurvene har terskelen 64.8 °F, for å halvere begge tallene endrer ikke
forholdet $-\beta_0/\beta_1$. Men den halverte kurven er slakere: ved 53 °F gir
den 0.80 i stedet for 0.94, og ved 75 °F 0.23 i stedet for 0.09. Hvordan ville
kurven sett ut med $\beta_1=0$? Og med $\beta_1>0$?

#### Hvilken kurve passer best? To oppskytinger

Hvert valg av $(\beta_0,\beta_1)$ gir en kurve. Statistikkens svar på hvilken
som er best: **velg kurven som gjør det som faktisk skjedde, mest
sannsynlig.** Det kalles *sannsynlighetsmaksimering* (engelsk *maximum
likelihood*). Vi prøver ideen på bare to av oppskytingene:

- oppskyting 1 ved 58 °F, **med** skade,
- oppskyting 2 ved 78 °F, **uten** skade.

Med en kurve $p(T)$ er sannsynligheten for skade ved 58 °F lik
$p_1=p(58)$, og sannsynligheten for *ingen* skade ved 78 °F er $1-p_2$, der
$p_2=p(78)$. Vi antar at oppskytingene ikke påvirker hverandre. Da er
sannsynligheten for begge utfallene produktet $p_1\cdot(1-p_2)$, akkurat som
for to myntkast: sannsynligheten for kron to ganger er
$\tfrac12\cdot\tfrac12=\tfrac14$. Vi
sammenligner to kandidater, begge med terskel 68 °F:

- **A:** $\beta_0=13.6$, $\beta_1=-0.2$,
- **B:** $\beta_0=6.8$, $\beta_1=-0.1$ (halvparten så bratt).

1. For A er $s=13.6-0.2\cdot58=2$ ved 58 °F og $s=13.6-0.2\cdot78=-2$ ved
   78 °F. Fullfør:
   $$p_1\cdot(1-p_2)=\sigma(2)\cdot\bigl(1-\sigma(-2)\bigr)=\ \ldots$$
2. Gjør det samme for B. Hvilken kandidat passer best med de to
   oppskytingene?
3. **Forutsi, og regn så:** Hva får du med en kurve som er dobbelt så bratt
   som A, altså $\beta=(27.2,\,-0.4)$?

<details>
<summary>Regnehjelp: sannsynlighetene for A og B</summary>

For A er $p_1=\sigma(2)$. Symmetrien $\sigma(-s)=1-\sigma(s)$ gir
$1-p_2=1-\sigma(-2)=\sigma(2)$, så produktet er $\sigma(2)^2$. Tallet
$\sigma(2)\approx0.881$ står i avsnittet om S-kurven.

For B er $s=6.8-0.1\cdot58=1$ og $s=6.8-0.1\cdot78=-1$, så produktet er
$\sigma(1)^2$. For den dobbelt så bratte kurven er $s=\pm4$, og produktet er
$\sigma(4)^2$. Den kurven som gir det største produktet, passer best.

</details>

```{math-exercise}
#| label: project9-two-launches
#| caption: Sannsynligheten for det vi så, for tre kurver
#| mode: numeric
#| tolerance: 1%
#| partial-credit: true
#| field-labels: sannsynlighet med A, sannsynlighet med B, sannsynlighet med dobbelt så bratt A
Oppgi $p_1\cdot(1-p_2)$ med tre desimaler.

A: _[0.776]

B: _[0.534]

$\beta=(27.2,\,-0.4)$: _[0.964]
```

Med bare disse to oppskytingene blir en brattere kurve med terskel mellom 58 og
78 °F *alltid* bedre. Med alle 23 oppskytingene er det ikke slik, for der
overlapper utfallene: det er skade ved 75 °F og ingen skade ved 66 °F. En for
bratt kurve tar da svært feil om noen av oppskytingene. Hva som skjer når
utfallene *ikke* overlapper, er temaet i del 5.

#### Fra produkt til sum: hvorfor logaritmen?

Med alle 23 oppskytingene er sannsynligheten for det vi så et produkt av 23
faktorer: $p_i$ for hver oppskyting med skade og $1-p_i$ for hver uten. Et
produkt av 23 tall mellom 0 og 1 blir svært lite. For $\beta=0$ er alle
$p_i=\tfrac12$, og produktet er $(\tfrac12)^{23}\approx1.2\cdot10^{-7}$.
Produkter er dessuten tungvinte å derivere. Logaritmen løser begge problemene:

- logaritmen av et produkt er summen av logaritmene,
- logaritmen er voksende, så den kurven som gjør produktet størst, gjør også
  $\log(\text{produktet})$ størst, og dermed $-\log(\text{produktet})$ minst.

Her og i resten av prosjektet er $\log$ den naturlige logaritmen ($\ln$ på
kalkulatoren, `np.log` i Python).

I stedet for å maksimere produktet **minimerer vi summen av $-\log$ av
faktorene**. For de to oppskytingene over er $-\log0.776\approx0.254$ for A
og $-\log0.534\approx0.627$ for B: minst er best.

Cellen kontrollerer først håndregningen din for de to oppskytingene: den
skriver ut $p_1$, $1-p_2$, produktet og $-\log$ for A og B. Legg selv til den
dobbelt så bratte kurven som en tredje kandidat i listen. Deretter gjør cellen
det samme for alle 23 oppskytingene, for $\beta=0$ og for fasiten.

```{pyodide-python}
#| label: project9-product
T2 = np.array([58., 78.])          # skade ved 58 °F, ingen skade ved 78 °F
for name, beta in [('A', np.array([13.6, -0.2])), ('B', np.array([6.8, -0.1]))]:
    p = sigma(beta[0] + beta[1]*T2)
    prob = p[0]*(1 - p[1])
    print(f'{name}: p1 = {p[0]:.3f}, 1 - p2 = {1 - p[1]:.3f}, '
          f'p1·(1 - p2) = {prob:.3f}, -log = {-np.log(prob):.3f}')
# Alle 23 utfall: produktet av faktorene og summen av -log, for β = 0 og for fasiten.
for name, beta in [('β = 0', np.zeros(2)), ('fasit', beta_oracle)]:
    p = sigma(design(temps) @ beta)
    factors = np.where(damage == 1, p, 1 - p)      # p_i ved skade, 1 - p_i ellers
    print(f'{name:<6} produkt = {np.prod(factors):.2e},  sum av -log = {-np.sum(np.log(factors)):.3f}')
```

Fasiten gjør dataene mer enn 300 ganger så sannsynlige som $\beta=0$
(produktet $3.88\cdot10^{-5}$ mot $1.19\cdot10^{-7}$), og summen av $-\log$
synker fra 15.942 til 10.158.

**Ta med videre:** Modellen er $p(T)=\sigma(\beta_0+\beta_1T)$, med terskel
$-\beta_0/\beta_1$ og bratthet $\beta_1$. Den beste kurven gjør dataene mest
sannsynlige, og det betyr at den minimerer summen av $-\log$ av faktorene.

### Modellen som et optimeringsproblem

Skriv $s_i=\beta_0+\beta_1T_i$ og $p_i=\sigma(s_i)$. Fra forrige avsnitt
bidrar

- en oppskyting med skade ($y_i=1$) med $-\log p_i$, som er lite når $p_i$ er nær 1,
- en oppskyting uten skade ($y_i=0$) med $-\log(1-p_i)$, som er lite når $p_i$ er nær 0.

Begge tilfellene kan skrives som ett uttrykk, og vi minimerer

$$L(\beta)=\sum_{i=1}^{23}\Bigl(\log\bigl(1+e^{s_i}\bigr)-y_is_i\Bigr)$$

over hele planet $\beta\in\mathbb R^2$. (Kontroll: for $y_i=1$ er
$-\log p_i=\log(1+e^{-s_i})=\log(1+e^{s_i})-s_i$, og for $y_i=0$ er
$-\log(1-p_i)=\log(1+e^{s_i})$.) Dette kalles **logistisk regresjon**.
Med matrisen $X$ med radene $(1,T_i)$ er $s=X\beta$. **Lite talleksempel:** for
$\beta=0$ er alle $p_i=\tfrac12$, hvert ledd er $\log2$, og
$L(0)=23\log2\approx15.94$, samme tall som cellen over.

**Fasiten.** Koeffisientene som gjør dataene mest sannsynlige, er
$\beta_0=15.0429$ og $\beta_1=-0.23216$. Dataene er en øvelse i Agresti,
*An Introduction to Categorical Data Analysis* (2. utg., 2007, s. 123–124).
Enhver statistikkpakke gir de samme koeffisientene, og vi har kontrollert dem med
Newtons metode. De ligger i oppsettet som `beta_oracle`. Vi bruker dem bare til
å kontrollere metoden.

| Del | Spørsmål | Det du tar med videre |
|:--|:--|:--|
| Innledning | Hvorfor en S-kurve, og hva er «best»? | Terskel, bratthet og summen av $-\log$ |
| 1 | Gradient, Hessian og et trygt steg | $\nabla L$, din `grad` og steget $4/\sigma_1^2$ |
| 2 | Første kjøring med rå temperaturer | Din `gd`, en forutsigelse fra egenverdiene |
| 3 | Sentrer og skaler | Samme modell i nye koordinater; tabell med steg |
| 4 | For store og tilpassede steg | Kritisk steg, 2-syklus, Armijo |
| 5 | Utforskende sluttoppgave: når ingen beste modell finnes | Gradient mot null uten minimum |

Sett av omtrent 4–6 timer. Skriv en kort forventning før hvert forsøk.

### Kjøring på siden eller i egen notebook

På nettsiden lastes oppsettet automatisk. Det inneholder dataene `temps` og
`damage`, `design(t)` (matrisen $X$), `sigma`, `loss(X, beta)`,
`hessian(X, beta)`, Armijo-metoden `armijo_gd`, de ferdige datamatrisene og de
trygge stegene, og figurhjelperne. Laster du
siden på nytt, må du kjøre cellene der du skrev `grad`, `gd` og
`predict_steps`, og cellen med `beta_star` i del 3, på nytt før du fortsetter.
I en egen notebook laster du ned
[oppsettsfilen](../assets/project_week9_setup.py){download="project_week9_setup.py"}
og kjører `from project_week9_setup import *`. Du trenger NumPy og
Matplotlib. Kopier cellene i rekkefølge, og kontroller notebooken med
**Restart / Run all** før levering.

## 1. Gradient, Hessian og et trygt steg

Nå har vi en funksjon $L$ av to variabler, $\beta_0$ og $\beta_1$, som skal
minimeres. Gradientmetoden fra uke 9 trenger to ting: gradienten, som gir
retningen, og et steg som ikke er for stort. For steget trenger vi et anslag
for krumningen, altså Hessianen. Begge kan vi finne for hånd. Målet med denne
delen er en egen `grad`-funksjon og et steg vi *vet* er trygt.

### Utled gradienten

Du trenger én regel: $\dfrac{d}{ds}\log(1+e^s)=\dfrac{e^s}{1+e^s}=\sigma(s)$.

1. Vis at det $i$-te leddet i $L$ har derivert $p_i-y_i$ med hensyn på $s_i$.
2. Bruk kjerneregelen med $\partial s_i/\partial\beta_0=1$ og
   $\partial s_i/\partial\beta_1=T_i$. Fullfør:
   $$\frac{\partial L}{\partial\beta_0}=\sum_{i}(p_i-y_i),\qquad
   \frac{\partial L}{\partial\beta_1}=\ \ldots$$
3. Skriv svaret som én matriseformel med $X$, $p$ og $y$.
4. Regn ut $\nabla L(0)$ for hånd. Du trenger at 7 av 23 oppskytinger hadde
   skade, at summen av alle temperaturene er 1600, og at summen av temperaturene
   ved de 7 skadene er 446.

<details>
<summary>Regnehjelp: fra ledd til matriseformel</summary>

Leddet er $\log(1+e^{s_i})-y_is_i$, så den deriverte med hensyn på $s_i$ er
$\sigma(s_i)-y_i=p_i-y_i$. Kjerneregelen gir
$\partial L/\partial\beta_1=\sum_iT_i(p_i-y_i)$. De to summene er de to
komponentene i $X^T(p-y)$, fordi kolonnene i $X$ er ettallene og temperaturene:

$$\nabla L(\beta)=X^T\bigl(p-y\bigr),\qquad p=\sigma(X\beta).$$

Tolkning: $p_i-y_i$ er feilen i den forutsagte sannsynligheten for
oppskyting $i$. For $\beta=0$ er $p_i-y_i=\tfrac12-y_i$. Da er
$\sum_i(\tfrac12-y_i)=\tfrac{23}{2}-(\text{antall skader})$ og
$\sum_iT_i(\tfrac12-y_i)=\tfrac12\sum_iT_i-(\text{summen av temperaturene ved skadene})$.

</details>

```{math-exercise}
#| label: project9-gradient-zero
#| caption: Gradienten i origo
#| mode: equivalent
#| partial-credit: true
#| field-labels: første komponent, andre komponent
Regn ut $\nabla L(0)$ for de 23 oppskytingene.

$\nabla L(0)=$ vec[9/2, 354]
```

**Kodespor 1.** Skriv gradienten som én linje. `yy` er utfallene; vi bruker
andre utfall i del 5.

```{pyodide-python}
#| label: project9-grad
def grad(X, beta, yy=damage):
    # TODO: én linje, X^T (p - y) med p = sigma(X beta).
    raise NotImplementedError('Skriv gradienten')
```

### Hessianen og et trygt steg

Deriverer vi en gang til, får vi Hessianen. Regelen
$\sigma'(s)=\sigma(s)\bigl(1-\sigma(s)\bigr)$ gir at $p_i-y_i$ har derivert
$p_i(1-p_i)$ med hensyn på $s_i$, og kjerneregelen som i punkt 2 gir

$$H(\beta)=X^TWX,\qquad W=\operatorname{diag}\bigl(p_i(1-p_i)\bigr).$$

Den er positiv semidefinit: $v^THv=\sum_ip_i(1-p_i)\,(Xv)_i^2\ge0$. Altså er $L$
konveks ([uke 8](uke8.qmd#uke8-konveks-test)).

Hver vekt $p_i(1-p_i)$ er høyst $\tfrac14$. Fra [uke 7](uke7.qmd#uke7-svd) er
$\|Xv\|_2\le\sigma_1\|v\|_2$, der $\sigma_1$ er største singulærverdi til $X$.
($\sigma$ uten indeks er fortsatt den logistiske funksjonen; $\sigma_1$ og
$\sigma_2$ er singulærverdiene, som i uke 7.) Krumningen er derfor aldri større
enn $\sigma_1^2/4$, i noen retning og i noe punkt. Det gir en **regel** vi
bruker hele prosjektet:

> **Trygt fast steg:** $\alpha=4/\sigma_1^2$. Med dette steget synker $L$ i
> hvert eneste steg, uansett hvor vi starter.

Sammenlign med [uke 9, del A](uke9.qmd#uke9-stabilitet):
$\alpha_{\text{krit}}=2/\lambda_{\max}(H_*)$ gjelder bare nær minimumet, og vi
må kjenne minimumet for å regne den ut. Regelen her er global og bruker bare
dataene. Med den største krumningen $\sigma_1^2/4$ ville grensen $2/(\text{største
krumning})$ gitt $8/\sigma_1^2$; vi bruker halvparten, for da gir hvert steg en
nedgang på minst $\tfrac{\alpha}{2}\|\nabla L\|_2^2$. Cellen regner ut steget og
kontrollerer gradienten din mot håndregningen.

```{pyodide-python}
#| label: project9-grad-check
X_raw = design(temps)          # X_raw og alpha_raw står også i oppsettet
sv = np.linalg.svd(X_raw, compute_uv=False)
alpha_raw = 4/sv[0]**2
print('singulærverdier til X:', sv, ' trygt steg 4/σ1² =', alpha_raw)
print('din ∇L(0):      ', grad(X_raw, np.zeros(2)))
print('forventet ∇L(0):', np.array([4.5, 354.]))
```

```{math-exercise}
#| label: project9-safe-step
#| caption: Største singulærverdi og trygt steg
#| mode: numeric
#| tolerance: 1%
#| partial-credit: true
#| field-labels: største singulærverdi, trygt steg
Oppgi $\sigma_1$ for $X$ med rå temperaturer og det trygge steget $4/\sigma_1^2$
(tre gjeldende siffer, for eksempel `3.21e-4`).

$\sigma_1=$ _[335.295]

$\alpha=$ _[3.558e-5]
```

**Ta med videre:** $\nabla L=X^T(p-y)$, $L$ er konveks, og $\alpha=4/\sigma_1^2$
er et trygt fast steg.

## 2. Første kjøring med rå temperaturer

Nå har vi alt gradientmetoden trenger: retningen $-\nabla L$ og et trygt steg.
Vi starter i $\beta=0$, altså kurven som sier $p=\tfrac12$ ved alle
temperaturer, og lar metoden forbedre kurven steg for steg. Du skriver løkken
selv. Målet er å se hvor langt metoden kommer, og så forklare farten med
konvergensfaktoren fra uke 9.

**Forutsi før du koder:** Hvor mange steg trenger gradientmetoden med det
trygge steget, fra $\beta=0$, før $\|\nabla L\|_2<10^{-6}$? Skriv et tall.

**Kodespor 2.** Fullfør gradientmetoden med stoppregel og stegteller.
Stopp når $\|\nabla L\|_2<$ `tol` eller når `max_steps` steg er brukt.

```{pyodide-python}
#| label: project9-gd
def gd(X, alpha, tol=1e-6, max_steps=20000, yy=damage):
    beta = np.zeros(2)
    k = 0
    # TODO: så lenge |∇L(beta)| >= tol og k < max_steps:
    #       beta <- beta - alpha * grad(X, beta, yy), og øk k med 1.
    raise NotImplementedError('Skriv løkken')
    return beta, k
```

Cellen kjører din `gd` først i 5 steg og så med et tak på 20 000 steg, og
sammenligner med fasiten. Den tar noen sekunder.

```{pyodide-python}
#| label: project9-raw-run
for steps in [5, 20000]:
    beta, k = gd(X_raw, alpha_raw, max_steps=steps)
    print(f'etter {k:5} steg: beta = {beta.round(4)}, '
          f'|∇L| = {np.linalg.norm(grad(X_raw, beta)):.4f}, L = {loss(X_raw, beta):.3f}')
print(f'fasit:               beta = {beta_oracle}, L = {loss(X_raw, beta_oracle):.3f}')
```

Etter de første få stegene er $\|\nabla L\|_2\approx0.55$. Etter 20 000 steg er
den fortsatt omtrent $0.53$, og $\beta_0$ har bare kommet fra 0 til omtrent
$0.38$ (fasiten er 15.04). Metoden går i riktig retning, men ekstremt sakte.

### Forklar med uke 9

Er metoden bare uheldig, eller kunne vi ha forutsagt dette? Fra
[uke 9, del A](uke9.qmd#uke9-stabilitet) er konvergensfaktoren
$S=\max_i|1-\alpha\lambda_i|$, der $\lambda_i$ er egenverdiene til Hessianen i
minimumet. Gradienten krymper til slutt med omtrent faktoren $S$ per steg. I ord:

> **antall steg** $\approx$ ln(toleransen / startgradientens norm) delt på ln $S$.

Talleksempel: med $S=0.5$, startnorm $1$ og toleranse $10^{-6}$ blir det
$\ln(10^{-6})/\ln0.5\approx20$ steg.

<details>
<summary>Regnehjelp: hvor regelen kommer fra</summary>

Krymper gradientnormen med faktoren $S$ per steg, er den
$S^k\cdot(\text{startnorm})$ etter $k$ steg. Vi stopper når dette er lik
toleransen. Ta logaritmen på begge sider:
$k\ln S+\ln(\text{startnorm})=\ln(\text{toleransen})$, altså
$k=\ln(\text{toleransen}/\text{startnorm})/\ln S$. Begge logaritmene er
negative, så $k$ blir positiv. Når $S$ er nær 1, er $\ln S$ nær 0, og $k$
blir svært stor.

</details>

**Kodespor 3.** Fullfør forutsigelsen (to–tre linjer). Vi bruker fasiten som
minimumspunkt. Etter funksjonen skriver cellen ut egenverdiene,
kondisjonstallet og forutsigelsen for rå data.

```{pyodide-python}
#| label: project9-predict
def predict_steps(X, alpha, beta_star, tol=1e-6):
    lam = np.linalg.eigvalsh(hessian(X, beta_star))
    # TODO: S = største |1 - alpha*lambda_i|, og antall steg etter regelen over.
    #       Startnormen er |∇L(0)|, altså np.linalg.norm(grad(X, np.zeros(2))).
    raise NotImplementedError('Skriv forutsigelsen')

lam = np.linalg.eigvalsh(hessian(X_raw, beta_oracle))
print('egenverdier til H*:', lam, ' kondisjonstall:', lam[1]/lam[0])
print('forutsagt antall steg:', predict_steps(X_raw, alpha_raw, beta_oracle))
```

Kondisjonstallet til $H_*$ er omtrent $8.3\cdot10^5$, og forutsigelsen er
omtrent $3\cdot10^7$ steg. Hvilken egenverdi bestemmer $S$ her? Sammenlign med
din forventning, og med de 20 000 stegene du faktisk kjørte.

**Ta med videre:** Metoden er stabil (steget er trygt), men kondisjonstallet
gjør den håpløst langsom.

## 3. Sentrer og skaler: samme modell i nye koordinater

Del 2 endte med en diagnose: [kondisjonstallet](uke9.qmd#uke9-kondisjon) er
enormt. Vi kan ikke endre dataene, men vi kan endre *hvordan vi skriver*
temperaturen. Som i [prosjekt 6](project_week6.qmd) endrer vi koordinatene i
stedet for metoden.

### Hvorfor er kondisjonstallet så stort?

Kolonnene i $X$ er $(1,1,\ldots,1)$ og $(T_1,\ldots,T_{23})$. Temperaturene
ligger mellom 53 og 81, så den andre kolonnen er nesten 70 ganger den første:
kolonnene er **nesten parallelle**, som de nesten avhengige kolonnene i
[uke 4](uke4.qmd#uke4-nesten). Da er den minste singulærverdien liten ([uke 7](uke7.qmd#uke7-svd)).

Vi prøver to andre beskrivelser av temperaturen:

- **sentrert:** $T-70$,
- **standardisert:** $(T-m)/d$, der $m\approx69.57$ er gjennomsnittet og
  $d\approx6.90$ standardavviket, et mål for hvor mye temperaturene sprer seg
  rundt $m$ (`temps.mean()` og `temps.std()`).

**Forutsi:** Hva skjer med singulærverdiene og forholdet $\sigma_1/\sigma_2$?

Cellen lager de tre matrisene $X$ og skriver ut singulærverdiene, så du kan
sjekke forutsigelsen.

```{pyodide-python}
#| label: project9-singular
# De samme tre matrisene står også i oppsettet.
m, d = temps.mean(), temps.std()
designs = {'rå T': design(temps),
           'sentrert T - 70': design(temps - 70),
           'standardisert (T - m)/d': design((temps - m)/d)}
for name, X in designs.items():
    sv = np.linalg.svd(X, compute_uv=False)
    print(f'{name:<24} singulærverdier {sv.round(3)}, σ1/σ2 = {sv[0]/sv[1]:.3g}')
```

For rå temperaturer er $\sigma_1=335$ og $\sigma_2=0.47$. Sentrering gir
$\sigma_1=33.2$ og $\sigma_2=4.79$, og standardisering gir to like
singulærverdier.

### Samme modell, nye koordinater

Før vi kjører, må vi vite hva fasiten er i de nye koordinatene. Ellers kan vi
ikke regne ut Hessianen i minimumet. Modellen er den samme hvis den gir samme
$s$ for hver temperatur:

$$\beta_0+\beta_1T=\beta_0'+\beta_1'(T-70)\quad\text{for alle }T.$$

1. Finn $\beta_0'$ og $\beta_1'$ uttrykt med $\beta_0$ og $\beta_1$. Første linje:
   $\beta_0'+\beta_1'(T-70)=(\beta_0'-70\beta_1')+\beta_1'T$.
2. For $(T-m)/d$ står overgangen til $\beta_0''$ og $\beta_1''$ i regnehjelpen
   under. Gå gjennom den, og kontroller at den har samme form som svaret ditt i
   punkt 1.
3. Forklar hvorfor $L$ har samme minsteverdi i alle tre koordinatsystemene,
   men ikke samme Hessian.

<details>
<summary>Regnehjelp: overgangen for standardisering</summary>

$\beta_0''+\beta_1''\dfrac{T-m}{d}=\Bigl(\beta_0''-\dfrac{\beta_1''m}{d}\Bigr)+\dfrac{\beta_1''}{d}T$.
Sammenlign koeffisientene: $\beta_1=\beta_1''/d$ og
$\beta_0=\beta_0''-\beta_1''m/d$. Motsatt vei: $\beta_1''=d\beta_1$ og
$\beta_0''=\beta_0+m\beta_1$.

</details>

**Kodespor 4.** Legg inn fasiten i de nye koordinatene, og kjør hele
sammenligningen. Cellen bruker din `gd` og din `predict_steps`.

```{pyodide-python}
#| label: project9-three-runs
b0, b1 = beta_oracle
# TODO: fasiten i nye koordinater, med overgangene du utledet.
beta_star = {'rå T': beta_oracle,
             'sentrert T - 70': None,
             'standardisert (T - m)/d': None}

print(f'{"Data":<24} {"α = 4/σ1²":>9} {"λmin(H*)":>9} {"λmax(H*)":>9} {"κ(H*)":>9} '
      f'{"forutsagt":>9} {"observert":>9}')
for name, X in designs.items():
    alpha = 4/np.linalg.svd(X, compute_uv=False)[0]**2
    lam = np.linalg.eigvalsh(hessian(X, beta_star[name]))
    beta, k = gd(X, alpha)
    print(f'{name:<24} {alpha:>9.3g} {lam[0]:>9.4g} {lam[1]:>9.4g} {lam[1]/lam[0]:>9.3g} '
          f'{predict_steps(X, alpha, beta_star[name]):>9.3g} {k:>9}')
    if name == 'sentrert T - 70':
        beta_c = beta
    if name == 'standardisert (T - m)/d':
        beta_s = beta
print('sentrert, regnet tilbake:      ', beta_c[0] - 70*beta_c[1], beta_c[1])
print('standardisert, regnet tilbake: ', beta_s[0] - beta_s[1]*m/d, beta_s[1]/d)
```

Rå temperaturer når ikke toleransen innen 20 000 steg. Sentrerte temperaturer
trenger 1433 steg (forutsagt omtrent 1700), og standardiserte bare 42
(forutsagt omtrent 48). Begge gir tilbake fasiten $(15.0429,\,-0.2322)$.
Forutsigelsen er litt for høy. Den bruker Hessianen i minimumet for hele
kjøringen, men i starten er alle $p_i=\tfrac12$, og vektene
$p_i(1-p_i)=\tfrac14$ er så store som mulig. Krumningen er derfor større der
enn i minimumet, og de første stegene går raskere enn faktoren $S$ sier. Mot
slutten krymper gradienten med nøyaktig faktoren $S$ per steg.

```{math-exercise}
#| label: project9-centred
#| caption: Sentrert modell
#| mode: numeric
#| tolerance: 1%
#| partial-credit: true
#| field-labels: beta0 etter sentrering, kondisjonstall til H* sentrert
Bruk fasiten $\beta_0=15.0429$, $\beta_1=-0.23216$. Finn $\beta_0'$ i den
sentrerte modellen, og oppgi kondisjonstallet til Hessianen i minimumet for
sentrerte data fra kjøringen.

$\beta_0'=$ _[-1.2083]

$\kappa(H_*)=$ _[35.29]
```

### Hva sier modellen om 31 °F?

Nå som vi har modellen, kan vi stille spørsmålet fra natten før oppskytingen.
Cellen regner ut $p(T)$ ved tre temperaturer og tegner kurven sammen med
dataene.

```{pyodide-python}
#| label: project9-launch-day
beta_F = beta_oracle      # det samme som din standardiserte løsning regnet tilbake
for T in [31, 53, 70]:
    print(f'p({T} °F) = {sigma(beta_F[0] + beta_F[1]*T):.4f}')
show_fit(beta_F)
```

Modellen gir $p(31\text{ °F})\approx0.9996$, mot $0.94$ ved 53 °F og $0.23$ ved
70 °F. Men 31 °F ligger langt utenfor temperaturene i dataene (det skraverte
området). Der finnes ingen observasjoner som kan bekrefte at kurven har riktig
form. Tallet viser hva **denne modellen** forutsier; det er ikke en målt
sannsynlighet.

**Ta med videre:** Å sentrere eller standardisere er et invertibelt
koordinatskifte. Løsningen er den samme, men Hessianen og dermed farten endres.
Det er prekondisjonering fra [prosjekt 6](project_week6.qmd), gjort som én
linje med data. I [uke 10](uke10.qmd) møter vi en metode som ikke bryr seg om
slike koordinatskifter.

## 4. For store steg og tilpassede steg

Det trygge steget er forsiktig. To spørsmål ligger da nær: kan vi bare ta
større steg, og kan Armijo-søket fra [uke 9, del B](uke9.qmd#uke9-linjesok)
velge steget for oss? Vi bruker standardiserte data, der vi kjenner
egenverdiene fra tabellen i del 3.

### Over det kritiske steget

Regn ut $\alpha_{\text{krit}}=2/\lambda_{\max}(H_*)$ med $\lambda_{\max}(H_*)$
for standardiserte data fra tabellen i del 3.

```{math-exercise}
#| label: project9-critical
#| caption: Kritisk steg for standardiserte data
#| mode: numeric
#| tolerance: 1%
#| field-labels: kritisk steg
$\alpha_{\text{krit}}=$ _[0.5547]
```

**Forutsi:** Hva skjer med $\alpha=0.55$, $0.6$ og $1.5$? I eksperiment 1 i
uke 9 eksploderte gradientmetoden på Himmelblaus funksjon med for stort steg.

Cellen kjører 3000 steg med hver steglengde, skriver ut de to siste punktene og
tegner de siste 200 punktene.

```{pyodide-python}
#| label: project9-too-large
paths = {}
for alpha in [0.55, 0.6, 1.5]:
    beta = np.zeros(2)
    path = [beta]
    for k in range(3000):
        beta = beta - alpha*grad(X_std, beta)
        path.append(beta)
    paths[alpha] = np.array(path)
    print(f'α = {alpha}: siste to punkter {path[-2].round(3)} og {path[-1].round(3)}, '
          f'største |β| underveis {np.abs(paths[alpha]).max():.1f}')
show_cycles(paths, beta_star['standardisert (T - m)/d'])
print('steg med α = 0.55:', gd(X_std, 0.55)[1])
```

Med $\alpha=0.55$ konvergerer metoden. Med $\alpha=0.6$ veksler den for alltid
mellom to punkter, en **2-syklus** som i uke 2 og uke 9. Med $\alpha=1.5$ hopper
den rundt mellom et dusin punkter langt fra minimumet, men $|\beta|$ holder seg
under 12 i alle de 3000 stegene. Legg også merke til at
$\alpha=0.55$ trenger 641 steg, mot 42 med det trygge steget $0.174$.

Hvorfor er et steg like under $\alpha_{\text{krit}}$ så langsomt? Se på faktoren
$1-\alpha\lambda_{\max}$ når $\alpha$ er nær $\alpha_{\text{krit}}$.

<details>
<summary>Regnehjelp: faktoren nær det kritiske steget</summary>

Regn ut $1-\alpha\lambda_{\max}$ for $\alpha=0.55$ med $\lambda_{\max}$ fra
tabellen i del 3. Hva er faktoren ved $\alpha=\alpha_{\text{krit}}$? Regn så ut
$S=\max_i|1-\alpha\lambda_i|$ for det trygge steget $\alpha\approx0.174$, der
begge egenverdiene er med. Hva betyr en faktor nær $-1$ for gradienten i den
bratte egenretningen?

</details>

### Armijo: løser et tilpasset steg problemet?

**Forutsi:** Armijo-søket fra del B i uke 9 velger steget selv. Blir rå temperaturer
da raske? Blir standardiserte data enda raskere?

Cellen kjører `armijo_gd` med din `grad` i høyst 2000 steg på begge datasettene,
og teller de ekstra funksjonsverdiene som halveringene koster.

```{pyodide-python}
#| label: project9-armijo
for name in ['rå T', 'standardisert (T - m)/d']:
    beta, k, extra = armijo_gd(designs[name], grad, max_steps=2000)
    print(f'{name:<24} steg: {k:5}, ekstra funksjonsverdier: {extra:6}, '
          f'beta = {beta.round(4)}, |∇L| = {np.linalg.norm(grad(designs[name], beta)):.2e}')
```

På rå data er $\beta_0$ bare omtrent $0.12$ etter 2000 Armijo-steg, og
$\|\nabla L\|_2$ er omtrent 1. En lengre kjøring utenfor nettleseren kom til
$\beta_0\approx15.01$ etter to millioner Armijo-steg og nesten 26 millioner
ekstra funksjonsverdier, men nådde fortsatt ikke toleransen. På standardiserte data
trenger Armijo 67 steg, mot 42 med det faste trygge steget. Forklar med del B i
uke 9: hva garanterer Armijo, og hva gjør det ikke?

**Ta med videre:** Armijo fikser stabiliteten, ikke kondisjonstallet.

## 5. Utforskende sluttoppgave: når ingen beste modell finnes

Med to oppskytinger i innledningen ble en brattere kurve alltid bedre. Med de
ekte dataene skjer ikke det, fordi utfallene overlapper: det er skade ved
75 °F og ingen skade ved 66–73 °F. Men hva om de *ikke* hadde overlappet? Da
kunne utfallene **skilles** av en terskeltemperatur: skade under terskelen,
ingen skade over. I denne delen lager du et slikt datasett ved å endre ett
eneste utfall, og ser hva gradientmetoden gjør. Du trenger
[del D i uke 9](uke9.qmd#uke9-garanti): subnivåmengder, koersivitet og
eksperiment 5, søket som aldri kommer fram.

Cellen under starter fra et **tenkt datasett** der de to skadene ved 70 °F er
gjort om til «ingen skade». Da er det skade ved 53, 57, 58, 63 og 75 °F, og
oppskytingen ved 75 °F er den eneste skaden over 65 °F. Cellen kjører
gradientmetoden med sentrerte data og det trygge steget i 10 000 steg, og
skriver ut $\|\beta\|_2$, $L$, $\|\nabla L\|_2$ og terskelen
$T=70-\beta_0'/\beta_1'$ (der $p=\tfrac12$) underveis. Målet er å se at én
enkelt oppskyting avgjør om det finnes en beste modell.

### Forutsi, endre én verdi og fyll ut tabellen

1. Kjør cellen uendret. Konvergerer metoden? Noter $\beta$, $L$ og terskelen
   etter 10 000 steg.
2. **Forutsi:** Nå gjør du om skaden ved 75 °F til «ingen skade». Da skiller
   terskelen 65 °F utfallene helt. Hva tror du skjer med $\|\beta\|_2$, $L$ og
   $\|\nabla L\|_2$? Skriv svaret ned før du kjører.
3. Endre den ene verdien på TODO-linjen (gjør det som linjen over, men for
   75 °F), og kjør cellen på nytt. Fyll ut tabellen.

Du bruker den samme cellen i punkt 1 og punkt 3; bare TODO-linjen endres.
Figuren viser $\|\beta\|_2$, $L$ og $\|\nabla L\|_2$ for alle stegene.

```{pyodide-python}
#| label: project9-separable
# Tenkt datasett: de to skadene ved 70 °F er gjort om til «ingen skade».
tenkt = damage.copy()
tenkt[(temps == 70) & (damage == 1)] = 0
# TODO (punkt 3): gjør om skaden ved 75 °F til 0 på samme måte.

print('skade ved', temps[tenkt == 1], '°F')
beta, history = np.zeros(2), []
for k in range(1, 10001):
    beta = beta - alpha_c*grad(X_c, beta, tenkt)          # sentrerte data, trygt steg
    if k % 10 == 0:
        history.append((k, np.linalg.norm(beta), loss(X_c, beta, tenkt),
                        np.linalg.norm(grad(X_c, beta, tenkt))))
    if k in (100, 1000, 10000):
        print(f'k = {k:5}: |β| = {history[-1][1]:.3g}, L = {history[-1][2]:.3g}, '
              f'|∇L| = {history[-1][3]:.2g}, terskel = {70 - beta[0]/beta[1]:.2f} °F')
show_separation(history)
```

| $k$ | $10^2$ | $10^3$ | $10^4$ |
|:--|--:|--:|--:|
| $\|\beta\|_2$ | | | |
| $L$ | | | |
| $\|\nabla L\|_2$ | | | |
| terskel (°F) | | | |

Uendret konvergerer metoden: etter 10 000 steg er $\|\beta\|_2\approx2.24$,
$L\approx6.86$, gradienten er praktisk talt null (under $10^{-12}$), og
terskelen er 63.05 °F. Etter endringen ser du noe helt annet. En lengre kjøring
utenfor nettleseren gir:

| $k$ | $10^5$ | $10^6$ |
|:--|--:|--:|
| $\|\beta\|_2$ | 15.8 | 23.6 |
| $L$ | 0.031 | 0.0036 |
| $\|\nabla L\|_2$ | 0.0088 | 0.00097 |
| terskel (°F) | 64.57 | 64.56 |

### Hvorfor kan $L$ komme så nær 0?

Velg terskelen 65 °F og en bratthet $c>0$, og se på kurvene
$p(T)=\sigma\bigl(c\,(65-T)\bigr)$. Alle har terskel 65 °F, og større $c$ gir
brattere kurve. I sentrerte koordinater er $c(65-T)=-5c-c\,(T-70)$, altså
$\beta_0'=-5c$ og $\beta_1'=-c$.

4. Oppskytingen med skade ved 58 °F har $s=c\,(65-58)=7c$, så leddet i $L$ er
   $-\log p=\log(1+e^{-7c})$. Fullfør: når $c\to\infty$, går $e^{-7c}\to\ \ldots$,
   og leddet går mot $\ldots$
5. Forklar med ord hvorfor *alle* 23 leddene går mot 0 når $c\to\infty$, mens
   hvert ledd er positivt for hver $\beta$. Se for eksempel på oppskytingen uten
   skade ved 78 °F, der $s=c\,(65-78)=-13c$ og leddet er $\log(1+e^{s})$. Hva er
   infimum av $L$, og oppnås det ([uke 8](uke8.qmd#uke8-eksistens))?
6. Gradienten er $X^T(p-y)$. Hva skjer med hver $p_i-y_i$ langs disse kurvene,
   og hvorfor går $\|\nabla L\|_2$ mot null selv om $\beta$ ikke konvergerer?

```{math-exercise}
#| label: project9-separated-terms
#| caption: To ledd i tapet langs kurvene med terskel 65 °F
#| mode: numeric
#| tolerance: 1%
#| partial-credit: true
#| field-labels: leddet ved 58 °F for c = 1, leddet ved 66 °F for c = 10
Oppgi leddene med tre gjeldende siffer (for eksempel `1.23e-4`). Oppskytingen
ved 66 °F er uten skade.

58 °F, $c=1$: _[9.115e-4]

66 °F, $c=10$: _[4.540e-5]
```

<details>
<summary>Regnehjelp: leddene langs kurvene</summary>

Ved 58 °F er leddet $\log(1+e^{-7c})$: regn ut $e^{-7}$, legg til 1 og ta
$\ln$. For små $x$ er $\log(1+x)\approx x$, så leddet er omtrent $e^{-7c}$. Ved
66 °F er $s=c\,(65-66)=-c$, og leddet er $\log(1+e^{-c})$. Oppskytingen
nærmest terskelen er den som går tregest mot null.

</details>

Cellen regner ut hele $L$ langs kurvene for det skilte datasettet, slik at du
ser hvordan $L$ og $\|\beta\|_2$ endres når $c$ vokser.

```{pyodide-python}
#| label: project9-ray
skilt = (temps < 65).astype(float)       # skade under 65 °F, ingen over: datasettet fra punkt 3
for c in [0, 1, 2, 5, 10]:
    beta_ray = np.array([-5.*c, -c])      # β0' = -5c, β1' = -c i sentrerte koordinater
    print(f'c = {c:2}: |β| = {np.linalg.norm(beta_ray):5.1f},  L = {loss(X_c, beta_ray, skilt):.2e}')
```

$L$ synker fra $L(0)\approx15.94$ til $0.917$ for $c=1$, $0.203$ for $c=2$ og
$4.54\cdot10^{-5}$ for $c=10$, mens $\|\beta\|_2$ vokser fra 0 til 51.

### Koble til del D i uke 9

7. **Subnivåmengden og garantien.** Forklar med cellen over hvorfor alle
   punktene $\beta'=(-5c,\,-c)$ med $c\ge0$ ligger i subnivåmengden
   $\{\beta: L(\beta)\le L(0)\}$. Er mengden begrenset, og er $L$ koersiv for
   det skilte datasettet? Hvilken del av garantien i del D faller da bort, og
   hvor ser du det i tabellen? Sammenlign med eksperiment 5 i uke 9: hva ville en
   stoppregel som $\|\nabla L\|_2<0.1$ ha meldt?
8. Terskelen holder seg nær 64.5–64.6 °F selv om $\beta$ ikke konvergerer.
   Hvorfor kan terskelen være nyttig selv om $\beta$ ikke er det?

**Ta med videre:** En gradient nær null betyr ikke at et minimum er funnet.
Uten koersivitet kan iteratene rømme langs en ubegrenset subnivåmengde, og
med de ekte dataene er det én enkelt oppskyting som hindrer det.

## Spørsmål du skal kunne svare på

1. Hvorfor passer ikke en rett linje for 0/1-data, og hva betyr $\beta_0$ og
   $\beta_1$ i S-kurven (terskel og bratthet)?
2. Hva betyr det at én kurve passer bedre enn en annen, og hvorfor minimerer vi
   summen av $-\log$ i stedet for å maksimere produktet av sannsynlighetene?
3. Hvordan er gradienten til $L$ bygd opp, og hva betyr $p_i-y_i$?
4. Hvorfor gir et for stort fast steg ingen konvergens, og hvordan finner du
   grensen fra Hessianen?
5. Hvorfor trenger de rå temperaturene millioner av steg, og hva forteller
   singulærverdiene til $X$ om det?
6. Hvorfor er den sentrerte og den rå modellen samme modell, og hva er det som endres?
7. Hva gjør Armijo-søket, og hva gjør det ikke?
8. Hvorfor finnes ingen beste modell når utfallene kan skilles av en terskel,
   hvorfor går gradienten likevel mot null, og hva sier subnivåmengden om det?
9. *(valgfri fordypning)* Bruk $|p_i-y_i|\le1$ til å vise at
   $\|\nabla L\|_2\le\sigma_1\sqrt{23}$ for alle $\beta$. Hvor langt kan ett steg
   da flytte $\beta$, og hvorfor eksploderer ikke metoden med for store steg,
   slik den gjorde på Himmelblaus funksjon i uke 9?
10. *(valgfri fordypning)* Vis at $L$ er koersiv for de ekte dataene. Tips: ta
    en retning $v\ne0$ og la $\beta=cv$ med $c\to\infty$. Bruk oppskytingene ved
    53 og 81 °F når $v_1>0$, og ved 66 og 75 °F når $v_1<0$, og finn et ledd som
    vokser mot uendelig. Hva skjer når $v_1=0$? Fordi $L$ er konveks (del 1),
    holder det å se på slike stråler ut fra origo.

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med:

- regningen med de to oppskytingene (A, B og den dobbelt så bratte kurven) og
  et par setninger om hvorfor vi minimerer summen av $-\log$;
- utledningen av $\nabla L$ og $\nabla L(0)$, overgangene mellom koordinatene og
  begrunnelsen for farten nær det kritiske steget i del 4;
- din `grad`, `gd` og `predict_steps`, med kontrollutskriftene;
- tabellen fra del 3: steg, $\kappa(H_*)$, forutsagt og observert antall steg
  for rå, sentrerte og standardiserte data;
- $p(31\text{ °F})$ med en setning om hvorfor tallet ikke kan stoles på uten forbehold;
- del 5: forutsigelsen, den utfylte tabellen, figuren med en forklaring av hver
  kurve, svarene på punkt 4–6 og koblingen til subnivåmengder og koersivitet
  (punkt 7–8).

Skriv i tillegg en analyse på **200–350 ord** som svarer på hovedspørsmålet:
hvorfor bestemmer skalaen farten, og hva kan og kan ikke et tilpasset steg gjøre
med det? Utregningene og koden kommer utenom tekstmengden.
