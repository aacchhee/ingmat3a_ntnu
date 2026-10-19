## Når skalaen bestemmer farten

Samme modell, samme data og samme metode. Likevel trenger gradientmetoden
titalls millioner steg i én beskrivelse av problemet og under femti i en annen.
**Hvorfor?** I dette prosjektet bruker du ukas teori, kritisk steg,
konvergensfaktor, kondisjonstall, Armijo og koersivitet, på ekte data.

### Dataene

Natten før romfergen Challenger ble skutt opp 28. januar 1986, ble det
diskutert om kulde kunne svekke O-ringene som tetter skjøtene i
rakettmotorene. Romfergen brøt sammen 73 sekunder etter oppskytingen, og alle
sju om bord omkom. Romfergene hadde fløyet 24 ganger før Challenger. Etter
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

### Modellen som et optimeringsproblem

Vi beskriver sannsynligheten for skade ved temperaturen $T$ med

$$p(T)=\sigma(\beta_0+\beta_1T),\qquad \sigma(s)=\frac{1}{1+e^{-s}}.$$

Funksjonen $\sigma$ går fra 0 til 1, og $\sigma(0)=\tfrac12$. Skriv
$s_i=\beta_0+\beta_1T_i$ og $p_i=\sigma(s_i)$. Vi velger $\beta=(\beta_0,\beta_1)$
slik at de observerte utfallene blir så sannsynlige som mulig:

- en oppskyting med skade ($y_i=1$) bidrar med $-\log p_i$, som er lite når $p_i$ er nær 1,
- en oppskyting uten skade ($y_i=0$) bidrar med $-\log(1-p_i)$.

Begge tilfellene kan skrives som ett uttrykk, og vi minimerer

$$L(\beta)=\sum_{i=1}^{23}\Bigl(\log\bigl(1+e^{s_i}\bigr)-y_is_i\Bigr)$$

over hele planet $\beta\in\mathbb R^2$. (Kontroll: for $y_i=1$ er
$-\log p_i=\log(1+e^{-s_i})=\log(1+e^{s_i})-s_i$, og for $y_i=0$ er
$-\log(1-p_i)=\log(1+e^{s_i})$.) Dette kalles **logistisk regresjon**.
Med matrisen $X$ med radene $(1,T_i)$ er $s=X\beta$. **Lite talleksempel:** for
$\beta=0$ er alle $p_i=\tfrac12$, hvert ledd er $\log2$, og $L(0)=23\log2\approx15.94$.

**Fasiten.** Maksimum-likelihood-koeffisientene for denne modellen er
$\beta_0=15.0429$ og $\beta_1=-0.23216$. Dataene er en øvelse i Agresti,
*An Introduction to Categorical Data Analysis* (2. utg., 2007, s. 123–124).
Koeffisientene gir enhver statistikkpakke, og vi har kontrollert dem med
Newtons metode. De ligger i oppsettet som `beta_oracle`. Vi bruker dem bare til
å kontrollere metoden.

| Del | Spørsmål | Det du tar med videre |
|:--|:--|:--|
| 1 | Gradient, Hessian og et trygt steg | $\nabla L$, din `grad` og steget $4/\sigma_1^2$ |
| 2 | Første kjøring med rå temperaturer | Din `gd`, en forutsigelse fra egenverdiene |
| 3 | Sentrer og skaler | Samme modell i nye koordinater; tabell med steg |
| 4 | For store og tilpassede steg | Kritisk steg, 2-syklus, Armijo |
| 5 | Når ingen beste modell finnes | Gradient mot null uten minimum |
| 6 | Din påstand: °F eller °C? | Forutsigelse og test |

Sett av omtrent fire timer. Skriv en kort forventning før hvert forsøk.

### Kjøring på siden eller i egen notebook

På nettsiden lastes oppsettet automatisk. Det inneholder dataene `temps` og
`damage`, `design(t)` (matrisen $X$), `sigma`, `loss(X, beta)`,
`hessian(X, beta)`, Armijo-metoden `armijo_gd` og figurhjelperen `show_fit`.
De ferdige datamatrisene `X_raw`, `designs`, `X_c` og `X_std` og det trygge
steget `alpha_raw` står også der. Laster du siden på nytt, må du kjøre cellene
der du skrev `grad`, `gd` og `predict_steps`, og cellen med `beta_star` i del 3,
på nytt før du fortsetter. I en egen notebook laster du ned
[oppsettsfilen](../assets/project_week9_setup.py){download="project_week9_setup.py"}
og kjører `from project_week9_setup import *`. Du trenger NumPy og
Matplotlib. Kopier cellene i rekkefølge, og kontroller notebooken med
**Restart / Run all** før levering.

## 1. Gradient, Hessian og et trygt steg

### Utled gradienten

Du trenger to regler: $\sigma'(s)=\sigma(s)\bigl(1-\sigma(s)\bigr)$, og
$\dfrac{d}{ds}\log(1+e^s)=\dfrac{e^s}{1+e^s}=\sigma(s)$.

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
oppskyting $i$. For $\beta=0$ er $p_i-y_i=\tfrac12-y_i$, som gir
$\sum_i(\tfrac12-y_i)=11.5-7$ og $\sum_iT_i(\tfrac12-y_i)=800-446$.

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

Deriverer vi en gang til, får vi Hessianen

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

Uke 9s regel $\alpha<2/(\text{største krumning})$ ville gitt $8/\sigma_1^2$.
Vi bruker halvparten: da gir hvert steg en nedgang på minst
$\tfrac{\alpha}{2}\|\nabla L\|_2^2$, mens garantien for nedgang forsvinner ved
$8/\sigma_1^2$.

Sammenlign med uke 9: $\alpha_{\text{krit}}=2/\lambda_{\max}(H_*)$ gjelder bare
nær minimumet, og vi må kjenne minimumet for å regne den ut. Regelen her er
global og bruker bare dataene.

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

Kjør med et tak på 20 000 steg. Det tar noen sekunder.

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

Fra uke 9 er konvergensfaktoren $S=\max_i|1-\alpha\lambda_i|$, der $\lambda_i$ er
egenverdiene til Hessianen i minimumet. Gradienten krymper til slutt med omtrent
faktoren $S$ per steg. I ord:

> **antall steg** $\approx$ ln(toleransen / startgradientens norm) delt på ln $S$.

Talleksempel: med $S=0.5$, startnorm $1$ og toleranse $10^{-6}$ blir det
$\ln(10^{-6})/\ln0.5\approx20$ steg.

**Kodespor 3.** Fullfør forutsigelsen (to–tre linjer). Vi bruker fasiten som
minimumspunkt.

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

### Hvorfor er kondisjonstallet så stort?

Kolonnene i $X$ er $(1,1,\ldots,1)$ og $(T_1,\ldots,T_{23})$. Temperaturene
ligger mellom 53 og 81, så den andre kolonnen er nesten 70 ganger den første:
kolonnene er **nesten parallelle**, som de nesten avhengige kolonnene i
[uke 4](uke4.qmd). Da er den minste singulærverdien liten ([uke 7](uke7.qmd#uke7-svd)).

Vi prøver to andre beskrivelser av temperaturen:

- **sentrert:** $T-70$,
- **standardisert:** $(T-m)/d$, der $m\approx69.57$ er gjennomsnittet og
  $d\approx6.90$ standardavviket (`temps.mean()` og `temps.std()`).

**Forutsi:** Hva skjer med singulærverdiene og forholdet $\sigma_1/\sigma_2$?

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

Modellen er den samme hvis den gir samme $s$ for hver temperatur:

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

### Over det kritiske steget

Bruk standardiserte data. Regn ut $\alpha_{\text{krit}}=2/\lambda_{\max}(H_*)$
med $\lambda_{\max}(H_*)$ fra tabellen i del 3.

```{math-exercise}
#| label: project9-critical
#| caption: Kritisk steg for standardiserte data
#| mode: numeric
#| tolerance: 1%
#| field-labels: kritisk steg
$\alpha_{\text{krit}}=$ _[0.5547]
```

**Forutsi:** Hva skjer med $\alpha=0.55$, $0.6$ og $1.5$? I uke 9 eksploderte
gradientmetoden på ukas funksjon med for stort steg.

```{pyodide-python}
#| label: project9-too-large
X_std = designs['standardisert (T - m)/d']
fig, ax = plt.subplots(figsize=(6, 5))
for alpha in [0.55, 0.6, 1.5]:
    beta = np.zeros(2)
    path = [beta]
    for k in range(3000):
        beta = beta - alpha*grad(X_std, beta)
        path.append(beta)
    path = np.array(path)
    print(f'α = {alpha}: siste to punkter {path[-2].round(3)} og {path[-1].round(3)}, '
          f'største |β| underveis {np.abs(path).max():.1f}')
    ax.plot(path[-200:, 0], path[-200:, 1], '.', markersize=5, label=f'α = {alpha}, siste 200')
ax.plot(*beta_star['standardisert (T - m)/d'], 'k*', markersize=12, label='minimum')
ax.set(xlabel='β₀″', ylabel='β₁″'); ax.legend(); plt.show()
print('steg med α = 0.55:', gd(X_std, 0.55)[1])
```

Med $\alpha=0.55$ konvergerer metoden. Med $\alpha=0.6$ veksler den for alltid
mellom to punkter, en **2-syklus** som i uke 2 og uke 9. Med $\alpha=1.5$ hopper
den rundt mellom et dusin punkter langt fra minimumet, men $|\beta|$ holder seg
under 12 i alle de 3000 stegene. Legg også merke til at
$\alpha=0.55$ trenger 641 steg, mot 42 med det trygge steget $0.174$.

Hvorfor er et steg like under $\alpha_{\text{krit}}$ så langsomt? Se på faktoren
$1-\alpha\lambda_{\max}$ når $\alpha$ er nær $\alpha_{\text{krit}}$.

### Armijo: løser et tilpasset steg problemet?

**Forutsi:** Armijo-søket fra uke 9 velger steget selv. Blir rå temperaturer
da raske? Blir standardiserte data enda raskere?

```{pyodide-python}
#| label: project9-armijo
for name in ['rå T', 'standardisert (T - m)/d']:
    beta, k, extra = armijo_gd(designs[name], grad, max_steps=2000)
    print(f'{name:<24} steg: {k:5}, ekstra funksjonsverdier: {extra:6}, '
          f'beta = {beta.round(4)}, |∇L| = {np.linalg.norm(grad(designs[name], beta)):.2e}')
```

På rå data er $\beta_0$ bare omtrent $0.12$ etter 2000 Armijo-steg, og
$\|\nabla L\|_2$ er omtrent 1. En lengre kjøring utenfor nettleseren kom til
$\beta_0\approx15.01$ etter to millioner Armijo-steg og nesten 28 millioner
funksjonsverdier, men nådde fortsatt ikke toleransen. På standardiserte data
trenger Armijo 67 steg, mot 42 med det faste trygge steget. Forklar med uke 9:
hva garanterer Armijo, og hva gjør det ikke?

**Ta med videre:** Armijo fikser stabiliteten, ikke kondisjonstallet.

## 5. Når ingen beste modell finnes

Hva om bare de kalde oppskytingene hadde hatt skade? Vi lager et **tenkt
datasett** der utfallene ved 70, 70 og 75 °F endres til «ingen skade». Da har
alle oppskytinger under 65 °F skade og alle over ingen: dataene kan **skilles**
med en terskeltemperatur. Terskelen er temperaturen der $p(T)=\tfrac12$, altså
der $s=0$. For sentrerte data er den $T=70-\beta_0'/\beta_1$.

**Forutsi:** Hva gjør gradientmetoden (sentrerte data, trygt steg)? Finner den
et minimum?

```{pyodide-python}
#| label: project9-separable
separable = damage.copy()
separable[temps >= 65] = 0          # bare de kalde oppskytingene beholder skaden
X_c = designs['sentrert T - 70']
alpha_c = 4/np.linalg.svd(X_c, compute_uv=False)[0]**2
beta = np.zeros(2)
ks, Ls, gs, b1s = [], [], [], []
for k in range(1, 10001):
    beta = beta - alpha_c*grad(X_c, beta, separable)
    if k % 10 == 0:
        ks.append(k); Ls.append(loss(X_c, beta, separable))
        gs.append(np.linalg.norm(grad(X_c, beta, separable))); b1s.append(-beta[1])
    if k in (100, 1000, 10000):
        print(f'k = {k:5}: L = {Ls[-1]:.3g}, |∇L| = {gs[-1]:.2g}, '
              f'beta = {beta.round(3)}, terskel = {70 - beta[0]/beta[1]:.2f} °F')
fig, ax = plt.subplots(figsize=(6.5, 4))
ax.loglog(ks, Ls, label='L(β)'); ax.loglog(ks, gs, label='|∇L|'); ax.loglog(ks, b1s, label='−β₁')
ax.set(xlabel='steg k'); ax.legend(); plt.show()
```

En lengre kjøring utenfor nettleseren gir:

| $k$ | $10^2$ | $10^3$ | $10^4$ | $10^5$ | $10^6$ |
|:--|--:|--:|--:|--:|--:|
| $L$ | 4.16 | 1.09 | 0.225 | 0.031 | 0.0036 |
| $\|\nabla L\|_2$ | 2.5 | 0.42 | 0.070 | 0.0088 | 0.00097 |
| $\beta_1$ | −0.33 | −0.75 | −1.63 | −2.86 | −4.26 |
| terskel $70-\beta_0'/\beta_1$ (°F) | 65.2 | 64.3 | 64.5 | 64.6 | 64.6 |

1. Vis at $L(\beta)>0$ for alle $\beta$, men at $L$ kan gjøres så liten du vil:
   velg terskelen 65 °F og la $\beta_1=-c$, $\beta_0'=-5c$ med $c\to\infty$.
   Hva er infimum, og oppnås det ([uke 8](uke8.qmd#uke8-eksistens))?
2. Terskelen stabiliserer seg likevel. Hvorfor kan den være nyttig selv om
   $\beta$ ikke er det?

Dette er [eksperiment 8 fra uke 9](uke9.qmd#uke9-garanti) i ekte data: $L$ er
ikke koersiv her, $\beta$ konvergerer ikke, og gradienten går mot null likevel,
så en stoppregel på gradienten ville meldt suksess i et tilfeldig punkt. Med de
ekte dataene finnes en oppskyting med skade ved 75 °F og flere uten skade ved
lavere temperaturer, så ingen terskel skiller dem. Da vokser $L$ mot uendelig i
alle retninger, og minimumet finnes.

**Ta med videre:** En gradient nær null betyr ikke at et minimum er funnet.

## 6. Din påstand: °F eller °C?

En kollega foreslår å regne i celsius i stedet for fahrenheit. Formuler en
påstand om hvordan valget av enhet påvirker farten til gradientmetoden med det
trygge steget, og test den.

1. **Forutsi fra singulærverdiene.** Regn ut singulærverdiene til $X$ for °C,
   $T_C=(T-32)\cdot5/9$, og sammenlign $\sigma_1/\sigma_2$ med °F. Hvilken
   enhet bør gi raskest konvergens?
2. **Finn fasiten i °C** med samme type overgang som i del 3, og bruk
   `predict_steps` til å anslå antall steg.
3. **Test.** Verken °F eller °C når toleransen innen 20 000 steg. Kjør
   20 000 steg i °C, og sammenlign $L(\beta)-L_*$ med kjøringen i °F fra del 2.
   Her er $L_*$ minsteverdien av $L$. Hvorfor er $L_*$ den samme i begge
   enhetene?
4. Stemmer resultatet med forutsigelsen? Hvis ikke, hva i resonnementet holdt
   ikke?

```{pyodide-python}
#| label: project9-claim
# Eksempel: celsius. Bytt ut med din egen påstand.
t_claim = (temps - 32)*5/9
X_claim = design(t_claim)
print('singulærverdier:', np.linalg.svd(X_claim, compute_uv=False))
L_star = loss(design(temps), beta_oracle)    # samme minsteverdi i alle enheter
# Fortsett selv: forutsigelse, kjøring med max_steps=20000 og L - L_star.
```

*(Valgfri fordypning.)* «Regn i kelvin, det er SI-enheten.» Gjenta punkt 1–3
med $T_K=T_C+273.15$, og sammenlign både $L(\beta)-L_*$ og $\|\nabla L\|_2$
etter 20 000 steg i de tre enhetene. Hvilket av de to målene gir riktig
rangering, og hvorfor? Tips: $L$ er den samme for samme modell i alle enheter,
men gradienten avhenger av koordinatene. I en retning med svært liten krumning
kan en liten gradient skjule en stor feil. Merk også at 20 000 steg er for få
til at verken °F eller K kommer noen vei i den langsomme retningen.

**Andre påstander du kan velge i stedet:** sentrer ved et annet tall enn 70
(for eksempel 50 eller 80), eller fjern én oppskyting og forklar hvordan
singulærverdiene og farten endres.

## Spørsmål du skal kunne svare på

1. Hvordan er gradienten til det logistiske tapet bygd opp, og hva betyr $p_i-y_i$?
2. Hvorfor gir et for stort fast steg ingen konvergens, og hvordan finner du
   grensen fra Hessianen?
3. Hvorfor trenger de rå temperaturene millioner av steg?
4. Hvorfor er den sentrerte og den rå modellen samme modell, og hva er det som endres?
5. Hva forteller singulærverdiene til $X$ om farten til gradientmetoden?
6. Hva gjør Armijo-søket, og hva gjør det ikke?
7. Hvorfor finnes ingen beste modell når bare kalde oppskytinger har skade, og
   hvorfor går gradienten likevel mot null?
8. Hva kan modellen, og hva kan den ikke, si om 31 °F?
9. *(valgfri fordypning)* Bruk $|p_i-y_i|\le1$ til å vise at
   $\|\nabla L\|_2\le\sigma_1\sqrt{23}$ for alle $\beta$. Hvor langt kan ett steg
   da flytte $\beta$, og hvorfor eksploderer ikke metoden med for store steg,
   slik den gjorde på Himmelblaus funksjon i uke 9?
10. *(valgfri fordypning)* °F, °C eller K: forklar forskjellen i fart med
    singulærverdier, og forklar hvorfor gradientnormen er et dårlig mål når
    enhetene skal sammenlignes.

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med:

- utledningen av $\nabla L$ og $\nabla L(0)$, overgangene mellom koordinatene og
  begrunnelsene i del 4 og 5;
- din `grad`, `gd` og `predict_steps`, med kontrollutskriftene;
- tabellen fra del 3: steg, $\kappa(H_*)$, forutsagt og observert antall steg
  for rå, sentrerte og standardiserte data;
- figuren fra del 5 med en forklaring av hver kurve;
- $p(31\text{ °F})$ med en setning om hvorfor tallet ikke kan stoles på uten forbehold;
- påstanden din fra del 6, forutsigelsen og testen.

Skriv i tillegg en analyse på **300–500 ord** som svarer på hovedspørsmålet:
hvorfor bestemmer skalaen farten, og hva kan og kan ikke et tilpasset steg gjøre
med det? Utregningene og koden kommer utenom tekstmengden.
