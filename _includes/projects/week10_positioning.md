## Hvor er jeg?

En mobil i en hall, en drone i et lager eller en GPS-mottaker vet ikke
hvor den er. Den kan bare måle **avstander** til noen faste punkter med
kjent plassering, kalt **ankre**. Fra fire unøyaktige avstander skal vi
finne to koordinater. Det er et ikke-lineært minste kvadraters problem,
og i uke 10 så vi metoden som passer: **Gauss–Newton**.

Gauss–Newton er Newtons metode med ett ledd kastet bort. Prosjektet
handler om tre spørsmål:

- Når koster det ingenting å kaste bort leddet, og når koster det mye?
- Hva forteller singulærverdiene til Jacobimatrisen om hvor presist vi
  vet hvor vi er?
- Kan metoden konvergere pent og likevel gi feil svar?

| Del | Spørsmålet vi arbeider med | Det du tar med videre |
|:--|:--|:--|
| 1. Modell og første steg | Hvordan blir et Gauss–Newton-steg et minste kvadraters problem? | $J$ for hånd og din egen Gauss–Newton-kode. |
| 2. Like rask som Newton? | Hva koster det droppede leddet? | Målt og forutsagt konvergensfaktor. |
| 3. Hvor presist? | Hva sier SVD om usikkerheten? | Ellipse mot Monte Carlo; hva skjer langt unna. |
| 4. Konvergert, men feil? | Kan residualen avsløre et falskt minimum? | En diagnose og Levenberg–Marquardt. |
| 5. Din påstand | Hvor langt holder forklaringen? | Én forutsigelse og én kontroll. |

Sett av 3–4 timer. Gjør papirregningen før du åpner hver kodecelle, og
skriv en kort forventning før hvert forsøk. Dataene er simulert, så vi
kjenner den riktige posisjonen. Den brukes bare til kontroll.

### Det vi trenger fra tidligere uker

- **Newton og Gauss–Newton** ([uke 10.5](uke10.qmd#uke10-gauss-newton)):
  for $F(z)=\tfrac12\|r(z)\|^2$ er gradienten $J^Tr$. Gauss–Newton løser
  $\min_p\|Jp+r\|$ i hvert steg.
- **Minste kvadrater** ([uke 4](uke4.qmd#uke4-mk)): `np.linalg.lstsq(J, -r, rcond=None)[0]`
  løser $\min_p\|Jp+r\|$ med en ortogonal metode, uten å danne $J^TJ$.
- **Konvergensfaktor** ([uke 2](page4.qmd)): en iterasjon er lineær med
  faktor $c$ når $e_{k+1}\approx c\,e_k$, og kvadratisk når
  $e_{k+1}\approx Ce_k^2$.
- **Spektralradius** ([uke 6](uke6.qmd#uke6-fikspunkt)): når feilen ganges
  med en matrise $M$ i hvert steg, er faktoren den største $|\lambda|$ for $M$.
- **SVD** ([uke 7](uke7.qmd#uke7-svd)): $J=U\Sigma V^T$; $\sigma_1\ge\sigma_2$
  er største og minste strekk, langs $v_1$ og $v_2$.
- **Forskyvningen $\mu I$** ([uke 10.5](uke10.qmd#uke10-gauss-newton)):
  $(J^TJ+\mu I)p=-J^Tr$ er Levenberg–Marquardt.

### Kjøring på siden eller i egen notebook

Oppsettet på siden lastes automatisk. Det inneholder dataene, en ferdig
Newton-metode, en ferdig Levenberg–Marquardt med tilpasset $\mu$ og to
tegnehjelpere. Hjelperne bruker egne formler, ikke din kode, slik at de kan
kontrollere den.

<details>
<summary>Egen notebook: last ned oppsettet og kom i gang</summary>

Last ned [project_week10_setup.py](../assets/project_week10_setup.py){download="project_week10_setup.py"}
og legg filen ved siden av notebooken. Kjør først

```python
from project_week10_setup import *
```

Du trenger NumPy og Matplotlib. Kopier deretter cellene fra prosjektet i
rekkefølge. Hele notebooken skal kunne kjøres med **Restart / Run all**.
Ta med oppsettsfilen ved levering.

</details>

## 1. Modell, Jacobimatrise og første steg

Hallen er 10 m × 8 m, med ett anker i hvert hjørne:

$$b_1=(0,0),\quad b_2=(10,0),\quad b_3=(10,8),\quad b_4=(0,8).$$

Den ukjente posisjonen er $z=(x,y)$. Anker $i$ måler avstanden $d_i$. Hvis
målingen var perfekt, ville $\|z-b_i\|=d_i$. Vi samler avvikene i
**residualvektoren**

$$r_i(z)=\|z-b_i\|-d_i=\sqrt{(x-b_{i1})^2+(y-b_{i2})^2}-d_i,
\qquad i=1,\ldots,4,$$

og minimerer $F(z)=\tfrac12\sum_i r_i(z)^2$. Det er fire likninger og to
ukjente, så med målefeil kan vi ikke få alle residualene lik null.

### 1a. En rad i $J$ (papir)

Rad $i$ i Jacobimatrisen $J$ er gradienten til $r_i$.

1. Fullfør regningen. Første linje er gitt:
   $$\frac{\partial r_i}{\partial x}
   =\frac{1}{2\sqrt{(x-b_{i1})^2+(y-b_{i2})^2}}\cdot2(x-b_{i1})=\ \ldots$$
   Gjør det samme for $\partial r_i/\partial y$, og skriv raden med
   $z-b_i$ og $\|z-b_i\|$.
2. Lite talleksempel: anker $(0,0)$ og $z=(3,4)$. Finn raden. Tegn ankeret,
   punktet og raden som en pil. Hvilken vei peker pilen, og hvor lang er den?
3. Forklar med ord: hvis vi flytter $z$ et lite stykke $p$, hvor mye endres
   avstanden til ankeret? Hvorfor endres den ikke når $p$ står vinkelrett
   på pilen?

<details>
<summary>Regnehjelp: raden i talleksempelet</summary>

$\|z-b_1\|=\sqrt{3^2+4^2}=5$, så raden er $(3,4)/5=(0.6,\,0.8)$. Den peker
fra ankeret mot $z$ og har lengde 1. Generelt er rad $i$ **enhetsvektoren
fra anker $i$ til $z$**. En liten flytting $p$ endrer avstanden med omtrent
(rad)$\cdot p$: bare komponenten mot eller fra ankeret teller.

</details>

### 1b. Gauss–Newton-steget (papir)

Hessianen til $F$ består av to deler: $J^TJ$ og en del der hvert ledd er
ganget med en residual $r_i$. **Gauss–Newton dropper delen som er ganget
med residualene.** Steget $p$ løser da

$$J^TJ\,p=-J^Tr.$$

Vis at dette er normallikningene for $\min_p\|Jp+r\|$. Første linje er gitt:
$$\|Jp+r\|^2=p^TJ^TJp+2p^TJ^Tr+r^Tr.$$
Sett gradienten med hensyn på $p$ lik null.

**Ta med videre:** En rad i $J$ er en enhetsvektor fra et anker, og et
Gauss–Newton-steg er ett lineært minste kvadraters problem. Vi løser det med
`lstsq`, en ortogonal metode som QR i uke 4, og ikke via normallikningene:
$J^TJ$ har kvadrert kondisjonstall (uke 7 og prosjekt 4, del 6).

### Kodespor 1: residual, Jacobimatrise og Gauss–Newton

`B` er en matrise med ett anker per rad, og `d` er vektoren med målte
avstander. Bruk `np.linalg.norm(..., axis=1)` for å få én avstand per rad.

```{pyodide-python}
#| label: project10-residual
def residual(z, B, d):
    # TODO: avstanden fra z til hvert anker minus målt avstand (én verdi per anker).
    raise NotImplementedError('Fullfør residual')

def jacobian(z, B):
    # TODO: rad i er enhetsvektoren fra anker i til z.
    # Tips: D = z - B har én rad per anker. Start med J = np.zeros_like(D),
    # og del hver rad D[i] på lengden sin i en løkke over i.
    raise NotImplementedError('Fullfør jacobian')

print('Rad for anker (0,0) og z=(3,4):', jacobian(np.array([3., 4.]), np.array([[0., 0.]])),
      ' forventet [[0.6 0.8]]')
print('Residual i fasiten med eksakte data:', residual(z_true, hall, d_exact), ' forventet nuller')
```

Fullfør så steget og løkken. Funksjonen skal returnere alle punktene,
slik at vi kan måle feilen i hvert steg.

```{pyodide-python}
#| label: project10-gauss-newton
def gn_step(z, B, d):
    # TODO: løs min ||J p + r|| med np.linalg.lstsq og returner p.
    raise NotImplementedError('Fullfør gn_step')

def gauss_newton(z0, B, d, steps=10):
    z = np.array(z0, float)
    points = [z.copy()]
    for k in range(steps):
        # TODO: ta ett Gauss-Newton-steg og legg det nye punktet i listen.
        raise NotImplementedError('Fullfør løkken')
    return np.array(points)

path = gauss_newton([5., 4.], hall, d_exact, steps=6)
for k, z in enumerate(path):
    print(f'k = {k}: z = {z.round(6)},  avstand til fasit = {np.linalg.norm(z - z_true):.1e}')
show_hall(hall, d_exact, [path], ['Gauss-Newton'], true=z_true)
```

Med eksakte data skal du nå $(3,5)$ fra midten av hallen. Avstandene til
fasiten skal være omtrent $2.2,\ 4.5\cdot10^{-2},\ 5.9\cdot10^{-5},\
6.5\cdot10^{-11}$ og så null. Nivåkurvene viser $\|r(z)\|$.

## 2. Like rask som Newton?

Vi har tre datasett fra samme posisjon $(3,5)$:

| Datasett | Hva er galt med målingene? |
|:--|:--|
| `d_exact` | ingenting |
| `d_noisy` | målefeil på $0.3,\ -0.4,\ 0.5,\ -0.2$ m |
| `d_bad` | anker 3 måler 3 m for langt, de andre er eksakte |

**Skriv en forventning før du kjører:** I hvilke tilfeller tror du
Gauss–Newton konvergerer kvadratisk, som Newton? Begrunn med hvilket ledd
som droppes og hvor stort det er nær løsningen.

Fyll inn de to linjene som regner ut forholdene $e_{k+1}/e_k$, der
$e_k=\|z_k-z_\infty\|$ og $z_\infty$ er siste punkt.

```{pyodide-python}
#| label: project10-rates
for name, d in [('eksakte', d_exact), ('støy', d_noisy), ('feil måling', d_bad)]:
    path = gauss_newton([5., 4.], hall, d, steps=12)
    z_end = path[-1]
    print(f'{name}: z = {z_end.round(3)}, ||r|| = {np.linalg.norm(residual(z_end, hall, d)):.3f}')
    # TODO: e = avstandene fra hvert punkt i path til z_end; ratios = e[k+1]/e[k] for k = 0, ..., 6.
    e = None
    ratios = None
    print('   Gauss-Newton, e_k:', np.array2string(e[:7], precision=1))
    print('   forhold e_k+1/e_k:', np.round(ratios, 3))
    newton = newton_position([5., 4.], hall, d)
    print('   Newton, e_k:      ', np.array2string(np.linalg.norm(newton - newton[-1], axis=1)[:6], precision=1))
```

Du skal se at Newton konvergerer kvadratisk i alle tre tilfellene. Gauss–Newton
gjør det bare med eksakte data. Med støy er forholdet omtrent konstant,
rundt $0.05$, og med den feile målingen rundt $0.19$: **lineær konvergens**.
Residualnormen ved løsningen er $0$, $0.730$ og $2.085$. Med eksakte data
blir $e_k$ null etter fire steg; forholdene blir da `nan` (0/0), og dem kan
du se bort fra. Før det krymper selve forholdet fra steg til steg: det er
kjennetegnet på kvadratisk konvergens.

### Forutsi faktoren

Kall delen som Gauss–Newton dropper, for $Q$. Hjelperen
`dropped_part(z, B, d)` regner den ut. La $e_k=z_k-z_\infty$ være feilen.

1. I $z_\infty$ er gradienten null, og Hessianen der er $J^TJ+Q$. Nær
   løsningen gir Taylor (som i uke 8) derfor $J^Tr\approx(J^TJ+Q)\,e_k$.
   Gauss–Newton tar steget $p=-(J^TJ)^{-1}J^Tr$. Fullfør regningen (første
   linje er gitt):
   $$e_{k+1}=e_k+p\approx e_k-(J^TJ)^{-1}(J^TJ+Q)\,e_k=\ \ldots$$
2. Du skal komme fram til $e_{k+1}\approx M e_k$ med
   $M=-(J^TJ)^{-1}Q$. Dette er en fikspunktiterasjon som i uke 2, og
   faktoren er spektralradiusen til $M$, som i uke 6. Hva blir $M$ når alle
   residualene er null?

Cellen regner ut spektralradiusen i det siste punktet:

```{pyodide-python}
#| label: project10-predict
for name, d in [('støy', d_noisy), ('feil måling', d_bad)]:
    z_end = gauss_newton([5., 4.], hall, d, steps=30)[-1]
    J = jacobian(z_end, hall)
    M = -np.linalg.solve(J.T @ J, dropped_part(z_end, hall, d))
    print(f'{name}: forutsagt faktor = {max(abs(np.linalg.eigvals(M))):.3f}')
```

Sammenlign med de målte forholdene. Du skal få $0.048$ og $0.192$.

**Ta med videre:** Gauss–Newton er Newton nøyaktig når residualen er null.
Prisen for det droppede leddet vokser med residualen, og vi kan forutsi den
som en spektralradius.

## 3. Hvor presist vet vi hvor vi er?

Anta at hver måling har en tilfeldig feil med standardavvik $\sigma$, uavhengig
av de andre. Da spres posisjonsanslaget rundt den riktige posisjonen.

**Regelen (gitt):** Spredningen danner en ellipse. Halvaksene peker langs de
høyre singulærvektorene $v_1,v_2$ til $J$, og standardavviket langs $v_i$ er
$\sigma/\sigma_i$. En liten singulærverdi gir altså stor usikkerhet i sin
retning.

1. Regn ut SVD av $J$ i $(3,5)$ og forutsi de to standardavvikene for
   $\sigma=0.05$ m.
2. Skriv en **Monte Carlo**-løkke: gjenta forsøket mange ganger med nye
   tilfeldige målefeil, og se hvor anslagene havner.

```{pyodide-python}
#| label: project10-monte-carlo
sigma = .05
J = jacobian(z_true, hall)
U, s, Vt = np.linalg.svd(J)
print('singulærverdier:', s.round(3), ' forutsagt standardavvik:', (sigma/s).round(3))

def monte_carlo(z_center, B, sigma, n=300, seed=1):
    rng = np.random.default_rng(seed)
    d0 = np.linalg.norm(z_center - B, axis=1)
    estimates = []
    for k in range(n):
        # TODO: lag målinger d0 + sigma*rng.standard_normal(len(B)),
        # kjør gauss_newton fra z_center med steps=6 og lagre siste punkt.
        raise NotImplementedError('Fullfør Monte Carlo-løkken')
    return np.array(estimates)

estimates = monte_carlo(z_true, hall, sigma)
measured = np.std((estimates - z_true) @ Vt.T, axis=0)
print('målt standardavvik langs v1, v2:', measured.round(3))
show_ellipse(estimates, z_true, J, sigma)
```

`(estimates - z_true) @ Vt.T` gir koordinatene til hvert avvik langs $v_1$ og
$v_2$. Forventet: omtrent $0.033$ og $0.039$ m fra SVD, og tall innen noen
prosent av dette fra Monte Carlo.

### Gå ut av hallen

Flytt taggen bort fra hallen langs linjen $y=4$, til punktene $(5+R,\,4)$.

**Forutsi først:** Hvilken av de to usikkerhetene vokser, og hvilken holder
seg? Tenk på hvordan ankrene ser ut sett fra langt unna.

```{pyodide-python}
#| label: project10-far-away
print('    R   sigma(J)        forutsagt std    Monte Carlo std')
for R in [0, 20, 50, 100]:
    z_far = np.array([5. + R, 4.])
    J = jacobian(z_far, hall)
    U, s, Vt = np.linalg.svd(J)
    est = monte_carlo(z_far, hall, sigma)
    measured = np.std((est - z_far) @ Vt.T, axis=0)
    print(f'{R:5d}   {s.round(3)}   {(sigma/s).round(3)}   {measured.round(3)}')
```

Usikkerheten langs $v_1$ (her retningen mot hallen, $x$) synker mot
$0.025$ m, mens usikkerheten langs $v_2$ (på tvers, $y$) vokser omtrent
proporsjonalt med avstanden: forutsagt $0.117$, $0.309$ og $0.623$ m for
$R=20,50,100$. Monte Carlo med 300 gjentakelser treffer innen omtrent 5–10 %.

1. Langt unna peker alle radene i $J$ nesten i samme retning $u$. Bruk det
   til å forklare at $\sigma_1\to2$. (Hint: $J\approx\mathbf 1u^T$, der
   $\mathbf 1$ er vektoren med fire enere.)
2. Forklar med ord hvorfor $\sigma_2\to0$, og hvorfor det gir stor
   usikkerhet på tvers.

<details>
<summary>Regnehjelp: singulærverdiene langt unna</summary>

Med $J\approx\mathbf 1u^T$ og $\|u\|=1$ er
$J^TJ\approx u\,\mathbf 1^T\mathbf 1\,u^T=4\,uu^T$. Denne matrisen har
egenverdien $4$ langs $u$ og $0$ på tvers, så $\sigma_1\approx\sqrt4=2$ og
$\sigma_2\approx0$. Avstandsmålingene sier altså nesten bare noe om
avstanden langs $u$, ikke om posisjonen på tvers.

</details>

**Ta med videre:** Singulærverdiene til $J$ måler hvor godt målingene
skiller ulike retninger. Ankre som ses i nesten samme retning, gir en nesten
rangmangelfull $J$.

## 4. Konvergert, men feil?

Nå står ankrene langs én vegg, nesten på en rett linje:

$$b_1=(0,0),\quad b_2=(4,\,0.1),\quad b_3=(7,\,-0.1),\quad b_4=(10,0).$$

Taggen står i $(6,3)$, og målingene er **eksakte** (`wall`, `d_wall`).

```{pyodide-python}
#| label: project10-wall
for start in ([5., 4.], [5., -4.]):
    path = gauss_newton(start, wall, d_wall, steps=15)
    z_end = path[-1]
    r = residual(z_end, wall, d_wall)
    J = jacobian(z_end, wall)
    print(f'start {start}: slutt {z_end.round(4)}, ||r|| = {np.linalg.norm(r):.3f}, '
          f'||J^T r|| = {np.linalg.norm(J.T @ r):.1e}')
show_hall(wall, d_wall, [gauss_newton(s, wall, d_wall, 15) for s in ([5., 4.], [5., -4.])],
          ['start (5, 4)', 'start (5, -4)'], true=z_true_wall)
```

Fra $(5,4)$ finner vi $(6,3)$. Fra $(5,-4)$ ender vi i $(5.92,\,-3.02)$.
Der er gradienten $J^Tr$ null i flyttall, så metoden har konvergert, men
**residualnormen er $0.224$ m med eksakte data**.

1. Bruk nivåkurvene til å forklare hva punktet $(5.92,-3.02)$ er, og
   hvorfor det ligger nær speilbildet $(6,-3)$ av den riktige posisjonen.
   Hvorfor kan gradient null ikke skille det fra det riktige punktet? Knytt
   svaret til uke 8: er $F$ konveks?
2. **Modellkontroll.** Med $m$ målinger, $n=2$ ukjente og målefeil med
   standardavvik $\sigma$ forventer vi $\|r\|\approx\sigma\sqrt{m-n}$ i
   den beste tilpasningen når modellen er riktig. Hva gir det for
   $\sigma=0.05$? Hva betyr da $\|r\|=0.224$?

### Start på veggen: Levenberg–Marquardt

Start nå i $(5,0)$, på linjen gjennom ankrene. Da peker alle radene i $J$
nesten langs veggen.

Fullfør Levenberg–Marquardt-steget $(J^TJ+\mu I)p=-J^Tr$ med én linje, og
sammenlign med Gauss–Newton:

```{pyodide-python}
#| label: project10-lm
def lm_step(z, B, d, mu):
    J, r = jacobian(z, B), residual(z, B, d)
    # TODO: løs (J^T J + mu I) p = -J^T r og returner p.
    raise NotImplementedError('Fullfør lm_step')

z0 = np.array([5., 0.])
print('singulærverdier av J i (5,0):', np.linalg.svd(jacobian(z0, wall), compute_uv=False).round(3))
print(f'Gauss-Newton: første steg er {np.linalg.norm(gn_step(z0, wall, d_wall)):.1f} m langt')
for mu in [.1, 1., 10.]:
    p = lm_step(z0, wall, d_wall, mu)
    print(f'LM, mu = {mu:4}: første steg er {np.linalg.norm(p):.2f} m langt, til {(z0 + p).round(3)}')
lm_path = lm_adaptive(z0, wall, d_wall)
print('LM med tilpasset mu ender i', lm_path[-1].round(4))
```

Du skal få $\sigma_2\approx0.08$ og et første Gauss–Newton-steg på
$11.3$ m, langt utenfor hallen. Levenberg–Marquardt gir $1.02$, $0.60$ og
$0.21$ m for $\mu=0.1,1,10$. Hjelperen `lm_adaptive` godtar et steg og deler
$\mu$ på 10 når $F$ synker, og ganger $\mu$ med 10 ellers.

1. Forklar med singulærverdiene hvorfor Gauss–Newton-steget blir så langt.
   Hvorfor gjør $+\mu I$ steget kortere? (Hint: hva skjer med egenverdiene
   til $J^TJ$?)
2. `lm_adaptive` ender likevel i $(5.92,-3.02)$. Hva fikser
   Levenberg–Marquardt, og hva fikser metoden ikke?

**Ta med videre:** Residualen kan avsløre et falskt minimum som gradienten
ikke ser. Levenberg–Marquardt gjør stegene trygge, men gjør ikke problemet
konvekst.

## 5. Din påstand

Velg **én** av veiene nedenfor. Skriv påstanden og forutsigelsen **før** du
kjører, helst med singulærverdiene til $J$. Kontroller deretter med Monte
Carlo eller med Gauss–Newton fra flere starter.

- **Et femte anker.** Hvor i eller ved hallen bør et femte anker stå for å
  krympe ellipsen mest for en tag i $(3,5)$? Lag
  `B5 = np.vstack([hall, [x5, y5]])`.
- **Ankre nøyaktig på én linje.** Sett alle fire ankrene på $y=0$. Hva skjer
  med speilpunktet nå? Kan noen metode avgjøre hvilken side taggen er på?
- **Finn den feile målingen.** Se på residualvektoren i løsningen for
  `d_bad`. Peker den ut anker 3? Prøv å fjerne ett anker om gangen og
  sammenlign $\|r\|$ med modellkontrollen fra del 4.

Hold alt annet fast, og endre én ting. Avgrens konklusjonen til det du faktisk
har undersøkt, og vis også et eventuelt motfunn.

## Spørsmål du skal kunne svare på

1. Hva betyr en rad i Jacobimatrisen geometrisk?
2. Hvorfor er et Gauss–Newton-steg et minste kvadraters problem, og hvorfor
   løser vi det med `lstsq`?
3. Når konvergerer Gauss–Newton like raskt som Newton, og hvorfor?
4. Hvordan forutsier du konvergensfaktoren, og stemte forutsigelsen?
5. Hva forteller singulærverdiene til $J$ om usikkerheten i posisjonen?
6. Hvorfor blir posisjonen usikker på tvers når taggen er langt unna?
7. Hvordan kan residualen avsløre et falskt minimum?
8. Hva gjør Levenberg–Marquardt, og hva gjør metoden ikke?
9. *(valgfri fordypning)* Hvor bør et femte anker stå?
10. *(valgfri fordypning)* Hva skjer når alle ankrene står på én linje?

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med:

- papirregningene fra 1a, 1b og utledningen av $M$ i del 2;
- din kode for `residual`, `jacobian`, `gn_step`, `gauss_newton`,
  `monte_carlo` og `lm_step`;
- konvergenstabellen fra del 2 med målte og forutsagte faktorer;
- én ellipsefigur (SVD mot Monte Carlo) og tabellen fra «Gå ut av hallen»;
- diagnosen av det falske minimumet i del 4;
- forutsigelse, kontroll og konklusjon for din påstand i del 5.

Skriv i tillegg en vurdering på **300–500 ord**: når er Gauss–Newton like
god som Newton, hva bestemmer hvor presist vi vet posisjonen, og hvordan
oppdager du at et konvergert svar er feil? Papirregninger kan leveres som
leselige bilder i notebooken eller i en egen PDF.
