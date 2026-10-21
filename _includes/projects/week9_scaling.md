## Når skalaen bestemmer farten

Samme data og samme gradientmetode kan gi svært ulik arbeidsmengde.
**Hva skyldes skalaen på variablene, og hva kan Armijo-søk hjelpe med?**
Du undersøker dette med en sannsynlighetsmodell for O-ringskade før
Challenger-ulykken.

Du får de nødvendige deriverte og en ferdig Armijo-metode. Du skriver en
kort gradientfunksjon og en gradientløkke. Hovedarbeidet er å sammenligne
kjøringer, lese tall og figurer og begrunne konklusjonene dine.

## Før prosjektarbeidet: en kort innføring i statistikken

**Dette er bakgrunn, ikke en egen innleveringsdel.** Les og kjør
eksemplene. Du trenger ingen statistikk fra før.
Selve optimeringsarbeidet begynner i [del 1](#project9-start).

### Data og en kurve mellom 0 og 1

Vi har temperatur og O-ringskade fra 23 romfergeoppskytinger før Challenger:

- `temps` inneholder temperaturene $T_i$, fra 53 til 81 °F.
- `damage` inneholder $y_i=1$ ved skade og $y_i=0$ ellers.
- Sju av de 23 oppskytingene hadde skade. Dataene er fra Dalal, Fowlkes og
  Hoadley (1989, *Journal of the American Statistical Association* 84,
  s. 945–957), for oppskytingene der motorene kunne undersøkes.

Challenger ble skutt opp ved 31 °F, under temperaturene i dette datasettet.
Vi må skille mellom det en tilpasset modell sier og det dataene støtter.

En rett linje kan gi verdier utenfor $[0,1]$. Derfor bruker vi en S-kurve:

$$p(T)=\sigma(\beta_0+\beta_1T),\qquad
\sigma(s)=\frac{1}{1+e^{-s}}.$$

Her er $p(T)$ modellens sannsynlighet for skade ved temperatur $T$.

- **Terskel:** Når $\beta_1\ne0$, er $p(T)=1/2$ ved $T=-\beta_0/\beta_1$.
- **Retning og bratthet:** Negativ $\beta_1$ gir mindre $p$ når temperaturen
  øker. Større $|\beta_1|$ gir en brattere overgang.

Den første cellen viser hvorfor den rette linjen ikke kan brukes som
sannsynlighetskurve.

```{pyodide-python}
#| label: project9-line
line = np.linalg.lstsq(design(temps), damage, rcond=None)[0]
for T in [31, 53, 81]:
    print(f'rett linje ved {T} °F: {line[0] + line[1]*T:.3f}')
show_line_fit(line)
```

Den neste viser en logistisk referansekurve og en slakere kurve med samme
terskel. Referansekoeffisientene `beta_oracle` er gitt for å kontrollere
optimeringen senere; du skal ikke finne dem i innføringen.

```{pyodide-python}
#| label: project9-s-curve
for name, beta in [('referanse', beta_oracle), ('halverte tall', beta_oracle/2)]:
    print(name, 'terskel:', -beta[0]/beta[1],
          'p(53):', sigma(beta[0] + beta[1]*53))
show_curves([beta_oracle, beta_oracle/2], ['referanse', 'halverte tall'])
```

### Hva betyr «kurven passer»?

En oppskyting med skade bør få stor $p_i=p(T_i)$; en uten skade bør få
stor $1-p_i$. Vi antar at utfallene fra ulike oppskytinger er uavhengige.
Da måler produktet av disse faktorene hvor sannsynlige de observerte
utfallene er under modellen.

::: {#project9-two-launches}
:::

For skade ved 58 °F og ingen skade ved 78 °F er produktet
$p(58)(1-p(78))$. Cellen sammenligner to kurver. Du trenger ikke regne
sannsynlighetene for hånd.

```{pyodide-python}
#| label: project9-product
for name, beta in [('A', np.array([13.6, -0.2])),
                   ('B', np.array([6.8, -0.1]))]:
    p = sigma(beta[0] + beta[1]*np.array([58., 78.]))
    probability = p[0]*(1-p[1])
    print(name, 'produkt:', probability, 'minus log:', -np.log(probability))
```

Størst produkt er best. I stedet for å maksimere et lite produkt
minimerer vi **summen av minus logaritmen til faktorene**. Det gir samme
beste kurve. Tapet som brukes videre, er ferdig skrevet som

$$L(\beta)=\sum_{i=1}^{23}\left(\log(1+e^{s_i})-y_i s_i\right),
\qquad s_i=\beta_0+\beta_1T_i.$$

Dette heter **logistisk regresjon**. I Python bruker `loss` en numerisk
stabil måte å beregne denne summen på. Lavere $L$ betyr bedre tilpasning
etter denne regelen; det sier ikke alene hvor godt modellen virker
utenfor dataene.

**Ta med videre:** To parametre bestemmer en sannsynlighetskurve. Vi
finner dem ved å minimere en gitt funksjon $L$ av to variabler.

### Oppsett og arbeidsplan

På nettsiden er data, `sigma`, `design`, `loss`, `hessian`, `armijo_gd` og
figurhjelperne klare automatisk. Dine to funksjoner `grad` og `gd` må kjøres
igjen hvis siden lastes på nytt.

I egen notebook: last ned
[oppsettsfilen](../assets/project_week9_setup.py){download="project_week9_setup.py"}
og kjør `from project_week9_setup import *`. Du trenger NumPy og
Matplotlib. Kopier cellene i rekkefølge, og kontroller med
**Restart / Run all** før levering.

| Del | Arbeidet ditt |
|:--|:-- |
| Innføring | Les og kjør statistikkeksemplene; ingen egen levering |
| 1 | Koble summer til matriseprodukt og fullfør to korte funksjoner |
| 2 | Sammenlign tre koordinatvalg og forklar forskjellene |
| 3 | Undersøk steglengde og Armijo med dine egne utskrifter |
| 4 | En kort sluttundersøkelse av stoppkravet |
| Levering | Samle utvalgte resultater og korte konklusjoner |

Regn med omtrent 4–6 timer inkludert innføringen. Skriv en kort
forventning før forsøkene og bruk resultatene som grunnlag for svaret.

::: {#project9-start}
:::

## 1. Her begynner prosjektet: fra formel til metode

Vi bruker matrisen $X$ med rad $i$ lik $(1,T_i)$ og vektorene
$\beta=(\beta_0,\beta_1)^T$, $y=(y_1,\ldots,y_{23})^T$.
Da er $s=X\beta$ og $p=\sigma(s)$, der $\sigma$ brukes på hvert element.

De analytiske deriverte er gitt:

$$\nabla L(\beta)=
\begin{bmatrix}
\sum_i(p_i-y_i)\\
\sum_i T_i(p_i-y_i)
\end{bmatrix}
=X^T(p-y),\qquad
H(\beta)=X^TWX,\quad W=\operatorname{diag}(p_i(1-p_i)).$$

Du skal **bruke** disse uttrykkene, ikke derivere dem.
$H$ er positiv semidefinit, så $L$ er konveks. `hessian` er allerede gitt.

**a. Les matriseproduktet.** Oppgi dimensjonene til $X$, $p-y$ og
$X^T(p-y)$. Forklar kort hvorfor de to radene i produktet blir summene
over. Dette er samme kobling mellom rader og enkeltuttrykk som i uke 3.

**b. Fullfør gradienten.** Bruk `X.T` for transponering og `@` for
matrise–vektor-produkt. Argumentet `yy` lar oss undersøke andre utfall i
sluttdelen.

```{pyodide-python}
#| label: project9-grad
def grad(X, beta, yy=damage):
    # TODO: returner X^T(p-y), der p = sigma(X beta).
    raise NotImplementedError('Skriv matriseproduktet')
```

::: {#project9-gradient-zero}
:::

::: {#project9-safe-step}
:::

En ferdig regel fra krumningsgrensen er

$$\alpha=\frac{4}{\sigma_1(X)^2},$$

der $\sigma_1(X)$ er største singulærverdi, ikke den logistiske
funksjonen. Dette er et trygt fast steg: i eksakt regning synker $L$
når gradienten ikke er null. Du trenger ikke utlede grensen.

Cellen kontrollerer gradienten din i ett punkt og beregner det trygge
steget. Bruk utskriften til å finne en eventuell feil før du fortsetter.

```{pyodide-python}
#| label: project9-grad-check
sv = np.linalg.svd(X_raw, compute_uv=False)
print('dimensjon X:', X_raw.shape, 'singulærverdier:', sv)
print('din gradient i 0:', grad(X_raw, np.zeros(2)))
print('kontrollverdi:    ', np.array([4.5, 354.]))
print('trygt steg:', 4/sv[0]**2)
```

**c. Fullfør løkken.** Gradientmetoden er
$\beta_{k+1}=\beta_k-\alpha\nabla L(\beta_k)$.
Stopp på gradientnorm `tol` eller når `max_steps` er brukt.
Returner både sluttpunkt og antall utførte steg.

```{pyodide-python}
#| label: project9-gd
def gd(X, alpha, tol=1e-6, max_steps=2000, yy=damage):
    beta = np.zeros(2)
    k = 0
    # TODO: gjenta oppdateringen mens gradientnormen >= tol og k < max_steps.
    raise NotImplementedError('Skriv gradientløkken')
    return beta, k
```

Cellen prøver fem steg og deretter et begrenset budsjett. `stoppkrav`
må være sann før vi sier at metoden nådde den valgte toleransen.

```{pyodide-python}
#| label: project9-raw-run
for budget in [5, 2000]:
    beta, k = gd(X_raw, alpha_raw, max_steps=budget)
    norm = np.linalg.norm(grad(X_raw, beta))
    print('budsjett:', budget, 'steg:', k, 'beta:', beta.round(4),
          '|gradient|:', norm, 'L:', loss(X_raw, beta), 'stoppkrav:', norm < 1e-6)
print('referanse beta:', beta_oracle, 'L:', loss(X_raw, beta_oracle))
```

**Les resultatet:** Går $L$ ned? Er lavere $L$ det samme som at
stoppkravet er nådd? Bruk både `beta` og gradientnormen i svaret.

## 2. Samme modell i bedre koordinater?

Den andre kolonnen i $X$ er nesten 70 ganger den første. Vi endrer ikke
målingene, men hvordan temperaturene beskrives:

| Navn | Temperaturkoordinat $t$ | Parametre $\gamma$ som gir samme kurve |
|:--|:--|:--|
| Rå | $T$ | $(\beta_0,\beta_1)$ |
| Sentrert | $T-70$ | $(\beta_0+70\beta_1,\beta_1)$ |
| Standardisert | $(T-m)/d$ | $(\beta_0+m\beta_1,d\beta_1)$ |

Her er $m=$ `temps.mean()` gjennomsnittet og $d=$ `temps.std()`
standardavviket, et mål på spredningen. Omregningene er gitt. De
bevarer $\gamma_0+\gamma_1t=\beta_0+\beta_1T$ for hver temperatur.

**a. Forutsi.** Hvilket koordinatvalg tror du gir færrest steg? Knytt
forventningen til forholdet mellom de to singulærverdiene.

Cellen bygger matrisene og skriver ut singulærverdier og forholdet.
Finn forskjellen i tallene selv; ikke se bare på størrelsen til hver verdi.

```{pyodide-python}
#| label: project9-singular
m, d = temps.mean(), temps.std()
designs = {'rå T': design(temps),
           'sentrert T - 70': design(temps-70),
           'standardisert (T - m)/d': design((temps-m)/d)}
for name, X in designs.items():
    sv = np.linalg.svd(X, compute_uv=False)
    print(name, 'singulærverdier:', sv.round(3), 'forhold:', sv[0]/sv[1])
```

::: {#project9-centred}
:::

**b. Kjør og sammenlign.** Tabellen under bruker din `gd` med samme start,
toleranse og tak på antall steg. Den oppgir også kondisjonstallet til
Hessianen ved referanseløsningen og faktoren fra uke 9:

$$S=\max_i|1-\alpha\lambda_i(H_*)|.$$

Dette er en **lokal modell** for farten nær minimumet, ikke en garanti
for antall steg fra startpunktet. En faktor nær 1 betyr langsom framgang.

Cellen beregner omregningen og diagnostikken ferdig. Skriv selv en kort
sammenligning av faktisk arbeid og forventet lokal fart.

```{pyodide-python}
#| label: project9-three-runs
b0, b1 = beta_oracle
beta_star = {'rå T': beta_oracle,
             'sentrert T - 70': np.array([b0+70*b1, b1]),
             'standardisert (T - m)/d': np.array([b0+m*b1, d*b1])}
for name, X in designs.items():
    alpha = 4/np.linalg.svd(X, compute_uv=False)[0]**2
    lam = np.linalg.eigvalsh(hessian(X, beta_star[name]))
    beta, k = gd(X, alpha, max_steps=2000)
    norm = np.linalg.norm(grad(X, beta))
    print(name, 'steg:', k, 'stoppkrav:', norm < 1e-6,
          'kondisjon H*:', lam[-1]/lam[0], 'lokal faktor S:',
          np.max(np.abs(1-alpha*lam)), 'L:', loss(X, beta))
```

::: {#project9-predict}
:::

- Hvilke kjøringer nådde toleransen? En avbrutt kjøring teller ikke som en
  rask løsning.
- Sammenlign kondisjonstall, $S$ og observerte steg. Hva er bevart ved
  koordinatskiftet, og hva er endret?
- Velg sentrering. Sett den gitte $\gamma$ inn i $\gamma_0+\gamma_1(T-70)$
  og forenkle til $\beta_0+\beta_1T$. To korte linjer er nok.

**c. Tolk modellen med forbehold.** Vi kan regne tilbake fra
standardiserte koordinater med
$\beta_1=\gamma_1/d$, $\beta_0=\gamma_0-m\gamma_1/d$.

Cellen bruker din løsning, regner den tilbake og viser kurven ved og
utenfor temperaturene i dataene.

```{pyodide-python}
#| label: project9-launch-day
alpha_std = 4/np.linalg.svd(X_std, compute_uv=False)[0]**2
gamma, k = gd(X_std, alpha_std)
beta_F = np.array([gamma[0]-m*gamma[1]/d, gamma[1]/d])
for T in [31, 53, 70]:
    print(f'p({T} °F) = {sigma(beta_F[0]+beta_F[1]*T):.4f}')
show_fit(beta_F)
```

Hvilke av de tre temperaturene ligger utenfor observasjonene?
Forklar hvorfor et tall nær 1 fra modellen ikke er en målt sannsynlighet.
Dette forbeholdet skal være med i konklusjonen din.

## 3. Steglengde: stabilitet, fart og arbeidsmengde

Et trygt steg trenger ikke være det raskeste. Nær minimumet gir
$2/\lambda_{\max}(H_*)$ den lokale kritiske grensen fra
[uke 9](uke9.qmd#uke9-stabilitet). Den sier ikke hva en vilkårlig
start vil gjøre langt fra minimumet.

::: {#project9-critical}
:::

**a. Forutsi og undersøk.** Sammenlign $\alpha=0.55$, $0.6$ og $1.5$
med grensen. Tror du større steg alltid betyr mindre arbeid?

Cellen beregner grensen, kjører 1000 steg og viser de siste punktene.
Den trygge steglengden prøves også med stoppregel.

```{pyodide-python}
#| label: project9-too-large
b0, b1 = beta_oracle
reference_std = np.array([b0+m*b1, d*b1])
lam = np.linalg.eigvalsh(hessian(X_std, reference_std))
print('lokal kritisk grense:', 2/lam[-1])
paths = {}
for alpha in [0.55, 0.6, 1.5]:
    beta = np.zeros(2)
    path = [beta.copy()]
    for k in range(1000):
        beta = beta-alpha*grad(X_std, beta)
        path.append(beta.copy())
    paths[alpha] = np.array(path)
    print('alpha:', alpha, 'siste punkter:', path[-2].round(3), path[-1].round(3),
          'gradientnorm:', np.linalg.norm(grad(X_std, beta)))
show_cycles(paths, reference_std)
alpha_std = 4/np.linalg.svd(X_std, compute_uv=False)[0]**2
for alpha in [alpha_std, 0.55]:
    beta, k = gd(X_std, alpha)
    print('fast alpha:', alpha, 'steg:', k,
          'stoppkrav:', np.linalg.norm(grad(X_std, beta)) < 1e-6)
```

Beskriv forskjellen mellom konvergens, veksling mellom punkter og en
kjøring som fremdeles er langt fra stoppkravet. Bruk også $S$ fra del 2
til å forklare hvorfor et steg rett under grensen kan være langsomt.
Et endelig forsøk alene beviser ikke hvordan alle senere steg blir.

### Armijo: løser et tilpasset steg problemet?

Armijo starter med $\alpha=1$ og halverer til tapet synker nok.
`armijo_gd` er gitt. **Forutsi:** Vil dette fjerne forskjellen mellom
rå og standardiserte temperaturer?

Cellen kjører din gradient med to metoder på de samme dataene. Den teller
iterasjoner og de ekstra prøvepunktene Armijo avviser. Med implementasjonen
her bruker Armijo $2k+$ `extra` tapsberegninger: én nåverdi og én godtatt
prøve per steg, i tillegg til de avviste prøvene. Sluttkontrollen i
utskriften er ikke med. Fast steg bruker ingen tapsberegning i løkken.

```{pyodide-python}
#| label: project9-armijo
budget = 2000                 # du kan prøve 4000; ikke bruk millionkjøringer
for name in ['rå T', 'standardisert (T - m)/d']:
    X = designs[name]
    alpha = 4/np.linalg.svd(X, compute_uv=False)[0]**2
    fixed, k_fixed = gd(X, alpha, max_steps=budget)
    adaptive, k, extra = armijo_gd(X, grad, max_steps=budget)
    print(name)
    for method, beta, steps, evaluations in [
            ('fast', fixed, k_fixed, 0), ('Armijo', adaptive, k, 2*k+extra)]:
        norm = np.linalg.norm(grad(X, beta))
        print(method, 'steg:', steps, 'L-beregninger i metoden:', evaluations,
              'L:', loss(X, beta), '|gradient|:', norm, 'stoppkrav:', norm < 1e-6)
```

**b. Konkluder fra din tabell.**

- Hvilken kombinasjon av koordinater og metode når toleransen?
- Hva koster halveringene? Er færre iterasjoner alene en rettferdig
  sammenligning?
- Gjenta med `budget = 4000` bare for de rå dataene. Hva støtter dette
  forsøket om Armijo, og hva kan det ikke si om framtidige iterasjoner?
- Bruk [Armijo-garantien](uke9.qmd#uke9-linjesok) og kondisjonstallene
  til å skille mellom å sikre nedgang og å få rask konvergens.

## 4. Sluttundersøkelse: liten gradient, men hvilken løsning?

Hva om alle skader lå under én temperatur og alle skadefrie oppskytinger
over? Da kan en stadig brattere S-kurve passe bedre. Dette kalles
**full separasjon**. Vi lager et tenkt datasett med skade akkurat når
$T<65$; vi endrer ikke de virkelige dataene.

Sammenlign de virkelige og de tenkte utfallene med samme sentrerte
datamatrise og samme trygge steg. Cellen viser tap, gradientnorm og
parameterstørrelse ved tre tidspunkter.

```{pyodide-python}
#| label: project9-separable
for name, yy in [('virkelige', damage), ('skilte', (temps < 65).astype(float))]:
    beta = np.zeros(2)
    for k in range(1, 10001):
        beta = beta-alpha_c*grad(X_c, beta, yy)
        if k in [100, 1000, 10000]:
            print(name, 'steg:', k, '|beta|:', np.linalg.norm(beta),
                  'L:', loss(X_c, beta, yy),
                  '|gradient|:', np.linalg.norm(grad(X_c, beta, yy)))
```

::: {#project9-separated-terms}
:::

En gitt matematisk egenskap forklarer hva vi må se etter: For full
separasjon er infimum av $L$ lik 0, men ingen endelig parametervektor
oppnår det. Her er én familie som nærmer seg dette infimumet:

$$p(T)=\sigma(c(65-T)),\qquad
\gamma=(-5c,-c)^T\quad\text{i sentrerte koordinater}.$$

Du skal ikke bevise egenskapen eller derivere familien. Cellen lar deg
undersøke den direkte, uten en lang gradientkjøring.

```{pyodide-python}
#| label: project9-ray
skilt = (temps < 65).astype(float)
for c in [1, 2, 5, 10]:
    gamma = np.array([-5.*c, -c])
    print('c:', c, '|gamma|:', np.linalg.norm(gamma), 'L:', loss(X_c, gamma, skilt),
          '|gradient|:', np.linalg.norm(grad(X_c, gamma, skilt)))
```

Skriv én kort konklusjon med tall fra begge utskriftene:

1. Hvordan skiller parameterstørrelse, tap og gradientnorm seg i de to
   datasettene?
2. Ville «gradienten er liten» alene ha vært et godt belegg for et funnet
   minimum i det skilte datasettet?
3. Bruk den gitte familien til å beskrive en ubegrenset subnivåmengde.
   Hvilken forutsetning i [garantien fra uke 9](uke9.qmd#uke9-garanti)
   mangler? Du kan bruke den oppgitte matematiske egenskapen uten bevis.

## Spørsmål du skal kunne svare på

Disse er repetisjon, ikke en ekstra innlevering.

1. Hva er data, parametre og tapsfunksjon i dette prosjektet?
2. Hvordan kan samme gradient skrives med to summer og ett matriseprodukt?
3. Hva bevarer sentrering og standardisering, og hva kan de endre?
4. Hva forteller egenverdiene om det lokale gradientforløpet?
5. Hvorfor er ikke et større fast steg alltid raskere?
6. Hva sikrer Armijo, og hva forteller egen utskrift om arbeidsmengden?
7. Hvorfor må en stoppmelding tolkes sammen med egenskapene til problemet?

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med:

- dine to funksjoner `grad` og `gd`, dimensjonene og den korte
  sammenhengen mellom summer og matriseprodukt fra del 1;
- tabellen for de tre koordinatvalgene, én figur av den tilpassede kurven
  og forbeholdet om temperaturer utenfor dataene;
- utvalgte utskrifter fra faste steg og Armijo, med en sammenligning av
  stoppstatus, steg og tapsberegninger;
- den korte konklusjonen fra sluttundersøkelsen.

Samle konklusjonene i omtrent **200–300 ord**, med tall som støtter dem.
Du trenger ikke levere innføringseksemplene, håndderivasjoner eller en
ekstra besvarelse av repetisjonsspørsmålene. Ta med oppsettsfilen hvis du
leverer notebook, og kontroller at alt kjører fra en ny start.
