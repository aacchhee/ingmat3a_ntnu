## Når skalaen bestemmer farten

Samme data og samme gradientmetode kan gi svært ulik arbeidsmengde.
**Hvor mye av forskjellen skyldes skalaen på variablene, og hva kan Armijo-søk hjelpe med?**
Du undersøker dette med en sannsynlighetsmodell for O-ringskade på romfergeoppskytinger før
Challenger-ulykken.

Du får de nødvendige deriverte og en ferdig Armijo-metode. Du skriver en
kort gradientfunksjon og en gradientløkke. Hovedarbeidet er å sammenligne
kjøringer, lese tall og figurer og begrunne konklusjonene dine.

## Før prosjektarbeidet: en kort innføring i statistikken

**Dette er bakgrunn, ikke en egen innleveringsdel.** Les og kjør
eksemplene. Du trenger ingen forkunnskaper i statistikk.
Selve optimeringsarbeidet begynner i [del 1](#project9-start).

### Data og en kurve mellom 0 og 1

Vi har temperatur og O-ringskade fra 23 romfergeoppskytinger før Challenger:

- `temps` inneholder temperaturene $T_i$, fra 53 til 81 °F.
- `damage` inneholder $y_i=1$ ved skade og $y_i=0$ ellers.
- Sju av de 23 oppskytingene hadde skade. Dataene er fra Dalal, Fowlkes og
  Hoadley (1989, *Journal of the American Statistical Association* 84,
  s. 945–957), for oppskytingene der motorene kunne undersøkes.

Challenger ble skutt opp ved 31 °F, altså kaldere enn alle temperaturene i dette datasettet.
Derfor må vi skille mellom det en tilpasset modell sier, og det dataene faktisk støtter.

En rett linje kan gi verdier utenfor $[0,1]$, og slike verdier kan ikke være sannsynligheter. Derfor bruker vi en S-kurve:

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
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-damage-fcb0b628, ide-project_week9-design-ae6c56f5, ide-project_week9-np-6f11581d, ide-project_week9-show-line-fit-dc5363ee, ide-project_week9-temps-9a041e91
line = np.linalg.lstsq(design(temps), damage, rcond=None)[0]
for T in [31, 53, 81]:
    print(f'rett linje ved {T} °F: {line[0] + line[1]*T:.3f}')
show_line_fit(line)
```

Den neste viser en logistisk referansekurve og en slakere kurve med samme
terskel. Referansekoeffisientene `beta_oracle` er gitt slik at du kan kontrollere
optimeringen senere; du skal ikke beregne dem selv i innføringen.

```{pyodide-python}
#| label: project9-s-curve
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-beta-oracle-325a7892, ide-project_week9-show-curves-1da5c293, ide-project_week9-sigma-2bf05701
for name, beta in [('referanse', beta_oracle), ('halverte tall', beta_oracle/2)]:
    print(name, 'terskel:', -beta[0]/beta[1],
          'p(53):', sigma(beta[0] + beta[1]*53))
show_curves([beta_oracle, beta_oracle/2], ['referanse', 'halverte tall'])
```

### Hva betyr «kurven passer»?

Hvis kurven passer, bør en oppskyting med skade få stor $p_i=p(T_i)$; en uten skade bør få
stor $1-p_i$. Vi antar at utfallene fra ulike oppskytinger er uavhengige.
Da måler produktet av disse faktorene hvor sannsynlige de observerte
utfallene er ifølge modellen.

::: {#project9-two-launches}
:::

Se på to oppskytinger: én med skade ved 58 °F og én uten skade ved 78 °F. Da er produktet
$p(58)(1-p(78))$. Cellen sammenligner to kurver. Du trenger ikke regne
sannsynlighetene for hånd.

```{pyodide-python}
#| label: project9-product
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-np-6f11581d, ide-project_week9-sigma-2bf05701
for name, beta in [('A', np.array([13.6, -0.2])),
                   ('B', np.array([6.8, -0.1]))]:
    p = sigma(beta[0] + beta[1]*np.array([58., 78.]))
    probability = p[0]*(1-p[1])
    print(name, 'produkt:', probability, 'minus log:', -np.log(probability))
```

Kurven med størst produkt passer best. Produktet blir fort svært lite, så i stedet for å maksimere det
minimerer vi **summen av minus logaritmen til faktorene**. Det gir samme
beste kurve. Tapet som brukes videre, er gitt ferdig:

$$L(\beta)=\sum_{i=1}^{23}\left(\log(1+e^{s_i})-y_i s_i\right),
\qquad s_i=\beta_0+\beta_1T_i.$$

Å tilpasse kurven på denne måten heter **logistisk regresjon**. I Python beregner `loss`
denne summen på en numerisk stabil måte. Lavere $L$ betyr bedre tilpasning
etter dette målet, men denne verdien alene sier ikke hvor godt modellen virker
utenfor dataene.

**Ta med videre:** To parametre bestemmer en sannsynlighetskurve. Vi
finner dem ved å minimere en gitt funksjon $L$ av to variabler.

### Oppsett og arbeidsplan

På nettsiden er data, `sigma`, `design`, `loss`, `hessian`, `armijo_gd` og
hjelpefunksjonene for figurer lastet inn automatisk. Cellene der du definerer `grad` og `gd`, må du
kjøre igjen hvis siden lastes på nytt.

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

Først skriver vi gradienten med matriser, slik at den blir enkel å programmere. Vi bruker matrisen $X$ med rad $i$ lik $(1,T_i)$ og vektorene
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
matrise–vektor-produkt. Med argumentet `yy` kan vi undersøke andre utfall i
sluttdelen.

```{pyodide-python}
#| label: project9-grad
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-damage-fcb0b628
def grad(X, beta, yy=damage):
    # TODO: returner X^T(p-y), der p = sigma(X beta).
    raise NotImplementedError('Skriv matriseproduktet')
```

::: {#project9-gradient-zero}
:::

::: {#project9-safe-step}
:::

En ferdig regel for steglengden, basert på en grense for krumningen, er

$$\alpha=\frac{4}{\sigma_1(X)^2},$$

der $\sigma_1(X)$ er største singulærverdi, ikke den logistiske
funksjonen. Dette gir et trygt fast steg: i eksakt regning synker $L$
i hvert steg så lenge gradienten ikke er null. Du trenger ikke utlede grensen.

Cellen kontrollerer gradienten din i ett punkt og beregner det trygge
steget. Bruk utskriften til å finne en eventuell feil før du fortsetter.

```{pyodide-python}
#| label: project9-grad-check
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-x-raw-49f2e1a7, ide-project_week9-grad-35026aaa, ide-project_week9-np-6f11581d
sv = np.linalg.svd(X_raw, compute_uv=False)
print('dimensjon X:', X_raw.shape, 'singulærverdier:', sv)
print('din gradient i 0:', grad(X_raw, np.zeros(2)))
print('kontrollverdi:    ', np.array([4.5, 354.]))
print('trygt steg:', 4/sv[0]**2)
```

**c. Fullfør løkken.** Gradientmetoden er
$\beta_{k+1}=\beta_k-\alpha\nabla L(\beta_k)$.
Stopp når gradientnormen er mindre enn `tol`, eller når alle `max_steps` steg er brukt.
Returner både sluttpunkt og antall utførte steg.

```{pyodide-python}
#| label: project9-gd
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-damage-fcb0b628, ide-project_week9-np-6f11581d
def gd(X, alpha, tol=1e-6, max_steps=2000, yy=damage):
    beta = np.zeros(2)
    k = 0
    # TODO: gjenta oppdateringen mens gradientnormen >= tol og k < max_steps.
    raise NotImplementedError('Skriv gradientløkken')
    return beta, k
```

Cellen kjører først fem steg og deretter med et større, men begrenset budsjett. `stoppkrav`
må være sann før vi kan si at metoden har nådd den valgte toleransen.

```{pyodide-python}
#| label: project9-raw-run
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-x-raw-49f2e1a7, ide-project_week9-alpha-raw-f48c6c91, ide-project_week9-beta-oracle-325a7892, ide-project_week9-gd-ea2a7253, ide-project_week9-grad-35026aaa, ide-project_week9-loss-94eeaeea, ide-project_week9-np-6f11581d
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

Hittil har vi brukt temperaturene direkte. Tallene i den andre kolonnen i $X$ er nesten 70 ganger så store som i den første. Vi endrer ikke
målingene, men måten vi beskriver temperaturene på:

| Navn | Temperaturkoordinat $t$ | Parametre $\gamma$ som gir samme kurve |
|:--|:--|:--|
| Rå | $T$ | $(\beta_0,\beta_1)$ |
| Sentrert | $T-70$ | $(\beta_0+70\beta_1,\beta_1)$ |
| Standardisert | $(T-m)/d$ | $(\beta_0+m\beta_1,d\beta_1)$ |

Her er $m=$ `temps.mean()` gjennomsnittet av temperaturene, og $d=$ `temps.std()` er
standardavviket, et mål på spredningen. Omregningene i tabellen er gitt. De
sikrer at $\gamma_0+\gamma_1t=\beta_0+\beta_1T$ for hver temperatur, altså at kurven blir den samme.

**a. Forutsi.** Hvilket koordinatvalg tror du gir færrest steg? Knytt
forventningen til forholdet mellom de to singulærverdiene.

Cellen bygger matrisene og skriver ut singulærverdier og forholdet.
Tolk tallene selv; se på forholdet, ikke bare på hvor stor hver verdi er.

```{pyodide-python}
#| label: project9-singular
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-design-ae6c56f5, ide-project_week9-np-6f11581d, ide-project_week9-temps-9a041e91
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

**b. Kjør og sammenlign.** Cellen under kjører din `gd` med samme start,
toleranse og tak på antall steg. Utskriften viser også kondisjonstallet til
Hessianen ved referanseløsningen og faktoren fra uke 9:

$$S=\max_i|1-\alpha\lambda_i(H_*)|.$$

Denne faktoren er en **lokal modell** for farten nær minimumet, ikke en garanti
for antall steg fra startpunktet. En faktor nær 1 betyr langsom framgang.

Cellen beregner omregningen og diagnostikken ferdig. Skriv selv en kort
sammenligning av faktisk arbeid og forventet lokal fart.

```{pyodide-python}
#| label: project9-three-runs
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-beta-oracle-325a7892, ide-project_week9-d-4f9c0b40, ide-project_week9-designs-827c08f4, ide-project_week9-gd-ea2a7253, ide-project_week9-grad-35026aaa, ide-project_week9-hessian-c504b170, ide-project_week9-loss-94eeaeea, ide-project_week9-m-4f9c0b40, ide-project_week9-np-6f11581d
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

- Hvilke kjøringer nådde toleransen? En kjøring som ble avbrutt ved taket på antall steg, teller ikke som en
  rask løsning.
- Sammenlign kondisjonstall, $S$ og observerte steg. Hva er bevart ved
  koordinatskiftet, og hva er endret?
- Velg sentrering. Sett den gitte $\gamma$ inn i $\gamma_0+\gamma_1(T-70)$
  og forenkle til $\beta_0+\beta_1T$. To korte linjer er nok.

**c. Tolk modellen med forbehold.** Vi kan regne en løsning i
standardiserte koordinater tilbake til de opprinnelige parametrene med
$\beta_1=\gamma_1/d$, $\beta_0=\gamma_0-m\gamma_1/d$.

Cellen finner en løsning med din gradientløkke, regner den tilbake og viser kurven både innenfor og
utenfor temperaturområdet i dataene.

```{pyodide-python}
#| label: project9-launch-day
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-x-std-0939bc5a, ide-project_week9-d-4f9c0b40, ide-project_week9-gd-ea2a7253, ide-project_week9-m-4f9c0b40, ide-project_week9-np-6f11581d, ide-project_week9-show-fit-bf5fd38d, ide-project_week9-sigma-2bf05701
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

Et trygt steg trenger ikke å være det raskeste. Nær minimumet er
$2/\lambda_{\max}(H_*)$ den lokale kritiske grensen for steglengden fra
[uke 9](uke9.qmd#uke9-stabilitet). Grensen sier ikke hva som skjer når vi
starter et vilkårlig sted langt fra minimumet.

::: {#project9-critical}
:::

**a. Forutsi og undersøk.** Sammenlign $\alpha=0.55$, $0.6$ og $1.5$
med grensen. Tror du større steg alltid betyr mindre arbeid?

Cellen beregner grensen, kjører 1000 steg og viser de siste punktene.
Den trygge steglengden prøves også med stoppregel.

```{pyodide-python}
#| label: project9-too-large
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-x-std-0939bc5a, ide-project_week9-beta-oracle-325a7892, ide-project_week9-d-4f9c0b40, ide-project_week9-gd-ea2a7253, ide-project_week9-grad-35026aaa, ide-project_week9-hessian-c504b170, ide-project_week9-m-4f9c0b40, ide-project_week9-np-6f11581d, ide-project_week9-show-cycles-2392b60f
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
Husk at et forsøk med et endelig antall steg ikke alene beviser hvordan alle senere steg blir.

### Armijo: løser et tilpasset steg problemet?

Armijo-søket starter med $\alpha=1$ og halverer steglengden til tapet synker nok.
Funksjonen `armijo_gd` er gitt. **Forutsi:** Vil et tilpasset steg fjerne forskjellen i arbeidsmengde mellom
rå og standardiserte temperaturer?

Cellen bruker gradienten din i to metoder, fast steg og Armijo, på de samme dataene. Den teller
iterasjoner og de ekstra prøvepunktene Armijo avviser. Med implementasjonen
her bruker Armijo $2k+$ `extra` tapsberegninger: én i det nåværende punktet og én for den godtatte
prøven per steg, i tillegg til de avviste prøvene. Sluttkontrollen i
utskriften er ikke regnet med. Metoden med fast steg bruker ingen tapsberegninger i løkken.

```{pyodide-python}
#| label: project9-armijo
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-armijo-gd-28a92a6f, ide-project_week9-designs-827c08f4, ide-project_week9-gd-ea2a7253, ide-project_week9-grad-35026aaa, ide-project_week9-loss-94eeaeea, ide-project_week9-np-6f11581d
budget = 2000                 # du kan prøve 4000; ikke kjør med millioner av steg
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
- Hva koster halveringene? Gir antall iterasjoner alene en rettferdig
  sammenligning?
- Gjenta med `budget = 4000` bare for de rå dataene. Hva sier dette
  forsøket om Armijo, og hva kan det ikke si om senere iterasjoner?
- Bruk [Armijo-garantien](uke9.qmd#uke9-linjesok) og kondisjonstallene
  til å skille mellom å sikre nedgang og å få rask konvergens.

## 4. Sluttundersøkelse: liten gradient, men hvilken løsning?

Hva om alle skader lå under en bestemt temperatur og alle skadefrie oppskytinger
over den? Da passer en S-kurve bedre jo brattere den er. Dette kalles
**full separasjon**. Vi lager et tenkt datasett med skade akkurat når
$T<65$; vi endrer ikke de virkelige dataene.

Sammenlign de virkelige og de tenkte utfallene med samme sentrerte
datamatrise og samme trygge steg. Cellen viser tap, gradientnorm og
parameterstørrelse etter tre ulike antall steg.

```{pyodide-python}
#| label: project9-separable
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-x-c-9179e629, ide-project_week9-alpha-c-ae727d57, ide-project_week9-damage-fcb0b628, ide-project_week9-grad-35026aaa, ide-project_week9-loss-94eeaeea, ide-project_week9-np-6f11581d, ide-project_week9-temps-9a041e91
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

Vi oppgir en matematisk egenskap som forklarer hva vi må se etter: Ved full
separasjon er infimum av $L$ lik 0, men ingen endelig parametervektor
oppnår det. Her er én familie av kurver der tapet nærmer seg dette infimumet:

$$p(T)=\sigma(c(65-T)),\qquad
\gamma=(-5c,-c)^T\quad\text{i sentrerte koordinater}.$$

Du skal ikke bevise egenskapen eller utlede familien. Med cellen kan du
undersøke familien direkte, uten en lang gradientkjøring.

```{pyodide-python}
#| label: project9-ray
#| feedback-context: ide-project_week9-reference-assumptions, ide-project_week9-x-c-9179e629, ide-project_week9-grad-35026aaa, ide-project_week9-loss-94eeaeea, ide-project_week9-np-6f11581d, ide-project_week9-temps-9a041e91
skilt = (temps < 65).astype(float)
for c in [1, 2, 5, 10]:
    gamma = np.array([-5.*c, -c])
    print('c:', c, '|gamma|:', np.linalg.norm(gamma), 'L:', loss(X_c, gamma, skilt),
          '|gradient|:', np.linalg.norm(grad(X_c, gamma, skilt)))
```

Skriv én kort konklusjon med tall fra begge utskriftene:

1. Hvordan skiller parameterstørrelse, tap og gradientnorm seg mellom de to
   datasettene?
2. Ville «gradienten er liten» alene ha vært et godt belegg for at vi har funnet et
   minimum i det skilte datasettet?
3. Bruk den gitte familien til å beskrive en ubegrenset subnivåmengde.
   Hvilken forutsetning i [garantien fra uke 9](uke9.qmd#uke9-garanti)
   er ikke oppfylt her? Du kan bruke den oppgitte matematiske egenskapen uten bevis.

## Spørsmål du skal kunne svare på

Disse er repetisjon, ikke en ekstra innlevering.

1. Hva er data, parametre og tapsfunksjon i dette prosjektet?
2. Hvordan kan samme gradient skrives med to summer og ett matriseprodukt?
3. Hva bevarer sentrering og standardisering, og hva kan de endre?
4. Hva forteller egenverdiene til Hessianen om hvordan gradientmetoden oppfører seg nær minimumet?
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
