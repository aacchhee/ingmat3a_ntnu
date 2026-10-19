## Hva betyr en Lagrangemultiplikator?

En kjetting henger mellom to kroker. Hvorfor får den akkurat den formen?
Svaret er et optimeringsproblem med **likhetskrav**, temaet i
[uke 12](uke12.qmd): kjettingen henger så lavt som mulig, men hvert ledd har
fast lengde. Vi skal bruke dette problemet til å svare på to spørsmål:

- **Hva betyr Lagrangemultiplikatorene?** Her viser de seg å være kreftene som
  strekker hvert ledd, og samtidig en pris, som dualprisene i
  [prosjekt 11](project_week11.qmd).
- **Hva skjer hvis vi bytter de stive leddene med svært stive fjærer?** Det er
  **straffemetoden**: kravene erstattes av et straffeledd. Stivere fjærer gir
  et bedre svar, men et vanskeligere problem.

Du regner ett leddpunkt for hånd, skriver fire korte kodebiter, og bruker
ferdige celler for SLSQP, BFGS og figurer. Sett av 3–4 timer. Skriv en kort
forventning før hvert forsøk, og sammenlign med det du får.

### En vei gjennom prosjektet

| Del | Spørsmålet vi arbeider med | Det du tar med videre |
|:--|:--|:--|
| 1. Ett leddpunkt for hånd | Hva gir Lagranges likninger når vi kan regne alt? | Multiplikatoren og hva den betyr. |
| 2. Ti ledd med eksakte krav | Hvordan finner vi multiplikatorene fra en numerisk løsning? | Multiplikatortabellen og to kontroller. |
| 3. Multiplikatoren er en pris | Hva er én millimeter mer kjetting verdt? | $dE_*/d\ell_i=-\lambda_i$. |
| 4. Fjærer i stedet for ledd | Hvor stive må fjærene være, og hva koster det? | Straffetabellen og kondisjonstallet. |
| 5. Din undersøkelse | Holder forklaringen når vi endrer kjettingen? | Forutsigelse og kontroll. |

### Fra fysikk til matematikk

Vi bruker bare tre ideer fra skolefysikken: potensiell energi er vekt ganger
høyde, krefter legges sammen som vektorer, og en fjærkraft er stivhet ganger
forlengelse. Hvert fysisk ord på denne siden betyr nøyaktig det som står i
høyre kolonne, og det er matematikken du arbeider med.

| Fysisk ord | Matematikk |
|:--|:--|
| leddpunkt $j$ | punktet $p_j=(x_j,y_j)$. Endene $p_0=(0,0)$ og $p_{10}=(4,0)$ ligger fast. De ukjente er $z=(x_1,y_1,\ldots,x_9,y_9)$, 18 tall. |
| vekt | hvert fritt leddpunkt har vekt $w=1$ N. Leddene selv regnes som vektløse. |
| potensiell energi | målfunksjonen $E(z)=w\,(y_1+\cdots+y_9)$: summen av høydene, ganget med $w$. |
| stivt ledd $i$ | kravet $h_i(z)=\lVert p_i-p_{i-1}\rVert_2-\ell=0$, for $i=1,\ldots,10$, med $\ell=0.5$ m. |
| retningen til ledd $i$ | enhetsvektoren $u_i=(p_i-p_{i-1})/\lVert p_i-p_{i-1}\rVert_2=(\cos\theta_i,\sin\theta_i)$. |
| strekkraften i ledd $i$ | **navnet på multiplikatoren $\lambda_i$**. |
| kraftbalanse i leddpunkt $j$ | **Lagranges likning for $p_j$**, med alle fortegn snudd (del 1 og 2). |
| fjær med stivhet $\mu$ | straffeleddet $\tfrac\mu2h_i(z)^2$ (del 4). |
| forlengelse av en fjær | tallet $h_i(z)$ når kravet ikke er oppfylt nøyaktig. |

### Avtaler vi bruker hele veien

- **Nummerering.** Ledd $i$ går fra $p_{i-1}$ til $p_i$. Leddpunkt $j$ berører
  derfor ledd $j$ (til venstre) og ledd $j+1$ (til høyre). I Python er
  nummereringen én lavere: `lam[0]` er $\lambda_1$, og rad 0 i `directions(z)`
  er $u_1$.
- **Retning og vinkel.** $u_i$ peker fra venstre mot høyre. Vinkelen
  $\theta_i$ måles fra positiv $x$-akse og er **negativ** når leddet går
  nedover. På venstre halvdel er altså $\sin\theta_i<0$, på høyre halvdel
  $\sin\theta_i>0$.
- **Fortegn.** Vi bruker $L=E+\sum_i\lambda_ih_i$ og $h_i=\text{lengde}-\ell$,
  som i uke 12. Da blir alle $\lambda_i$ positive. Positiv betyr at leddet
  **trekker** i begge leddpunktene sine: ledd $i$ virker på $p_i$ med kraften
  $-\lambda_iu_i$ (mot $p_{i-1}$) og på $p_{i-1}$ med $+\lambda_iu_i$ (mot
  $p_i$), så endene trekkes mot hverandre.
- **Nullnivå.** Høyder måles fra linjen gjennom endene, så $E$ blir negativ.
  Bare forskjeller i $E$ betyr noe.
- **Enheter.** $w$ i N, lengder i m, $E$ i J (= N·m), $\lambda$ i N og $\mu$
  i N/m.

To regneregler fra flervariabel analyse er gitt:

- gradienten til $\lVert p-q\rVert_2$ med hensyn på $p$ er enhetsvektoren
  $(p-q)/\lVert p-q\rVert_2$;
- derfor er $\nabla_{p_i}h_i=u_i$ og $\nabla_{p_{i-1}}h_i=-u_i$, og alle
  andre deriverte av $h_i$ er null.

### Kjøring på siden eller i egen notebook

Oppsettet lastes automatisk på siden. Det inneholder `joints`, `energy`,
`grad_energy`, `directions`, `jac_links` (Jacobianen til $h$), `flat_start`,
`penalty_hessian` og `plot_chain`. Kjør cellene i rekkefølge.

<details>
<summary>Egen notebook: last ned oppsettet og kom i gang</summary>

Last ned [project_week12_setup.py](../assets/project_week12_setup.py){download="project_week12_setup.py"}
og legg filen ved siden av notebooken. Kjør først

```python
from project_week12_setup import *
```

Du trenger NumPy, SciPy og Matplotlib. Kopier deretter cellene fra
prosjektet i rekkefølge. Kontroller til slutt notebooken med
**Restart / Run all**, og ta med oppsettsfilen ved levering.

</details>

## 1. Ett leddpunkt for hånd

Vi starter med den minste kjettingen: to ledd på $2.5$ m mellom endene
$p_0=(0,0)$ og $p_2=(4,0)$; bare i denne delen er $p_2$ et endepunkt. Det
eneste frie leddpunktet er $p=(x,y)$, med vekt $w$.

| Rolle | Uttrykk |
|:--|:--|
| Valg | $p=(x,y)$ |
| Mål | Minimer $E=w\,y$ |
| Krav | $h_1=\lVert p-p_0\rVert_2-2.5=0$ og $h_2=\lVert p_2-p\rVert_2-2.5=0$ |

```{pyodide-python}
#| label: project-week12-one-joint
t = np.linspace(0, 2*np.pi, 300)
fig, ax = plt.subplots(figsize=(6, 4.5))
for c in ([0, 0], [4, 0]):
    ax.plot(c[0] + 2.5*np.cos(t), c[1] + 2.5*np.sin(t), color='0.7')
ax.plot([0, 2, 4], [0, -1.5, 0], 'o-', color='tab:blue', label='kandidat (2, -1.5)')
ax.plot([0, 2, 4], [0, 1.5, 0], 'o--', color='tab:orange', label='kandidat (2, 1.5)')
ax.set(xlabel='x (m)', ylabel='y (m)'); ax.set_aspect('equal'); ax.legend()
plt.show()
```

1. **Kravene alene.** Hvert krav sier at $p$ ligger på en sirkel med radius
   $2.5$. Vis med Pytagoras at sirklene skjærer hverandre i $(2,\pm1.5)$. Hvilket
   av de to tillatte punktene velger målet $E=w\,y$?
2. **Retningene.** Vis at $u_1=(0.8,-0.6)$ og $u_2=(0.8,0.6)$ i det nederste
   punktet. Hva er $\sin\theta_1$ og $\sin\theta_2$?
3. **Lagranges likning.** Fullfør, med regnereglene over:
   $$\nabla E+\lambda_1\nabla_ph_1+\lambda_2\nabla_ph_2
   =\begin{bmatrix}0\\w\end{bmatrix}+\lambda_1u_1-\lambda_2u_2=0.$$
   Skriv $x$-komponenten og $y$-komponenten hver for seg, og løs for
   $\lambda_1$ og $\lambda_2$ med $w=1$ N.
4. **Det øverste punktet.** Løs den samme likningen i $(2,1.5)$, der
   $u_1=(0.8,0.6)$ og $u_2=(0.8,-0.6)$. Hvilket fortegn får multiplikatorene?

<details>
<summary>Regnehjelp: de to komponentene</summary>

$x$-komponenten er $0.8\lambda_1-0.8\lambda_2=0$, så $\lambda_1=\lambda_2$.
$y$-komponenten er $w-0.6\lambda_1-0.6\lambda_2=0$, så
$\lambda_1=\lambda_2=w/1.2\approx0.833$ N. Den vannrette delen er
$\lambda_1\cos\theta_1=0.833\cdot0.8\approx0.667$ N.

I det øverste punktet er $y$-komponenten $w+0.6\lambda_1+0.6\lambda_2=0$, så
$\lambda_1=\lambda_2\approx-0.833$ N: negativ.

</details>

Først nå kommer fysikken: i mekanikk kalles $\lambda_i$ **strekkraften** i
ledd $i$. Gang likningen i punkt 3 med $-1$:

$$\begin{bmatrix}0\\-w\end{bmatrix}-\lambda_1u_1+\lambda_2u_2=0.$$

Her er $(0,-w)$ tyngden, som peker ned. Ledd 1 trekker leddpunktet tilbake
mot $p_0$, altså i retning $-u_1$, med kraften $\lambda_1$, og ledd 2 trekker
mot $p_2$, i retning $u_2$, med kraften $\lambda_2$. Summen av kreftene er
null: det er kraftbalansen. Lagranges likning er altså kraftbalansen med alle
fortegn snudd, fordi $\nabla E$ peker dit energien *øker*, mens tyngden peker
dit den *avtar*. I det øverste punktet er multiplikatorene negative: leddene
skyver i stedet for å trekke, som i en bue. Målet $E$ velger det nederste
punktet, der begge trekker.

**Ta med videre:** Multiplikatoren er kraften som skal til for å holde kravet
oppfylt; positiv betyr trekk, negativ betyr trykk. $x$-komponenten av
Lagranges likning ga lik vannrett del i begge leddene.

## 2. Ti ledd med eksakte krav

Nå har vi ti ledd på $\ell=0.5$ m, altså 5 m kjetting over 4 m. Energien og
Jacobianen er ferdige. Du skriver selve kravfunksjonen.

**Kode 1.** Fullfør `h(z, lengths)`. Den skal returnere de ti tallene
$\lVert p_i-p_{i-1}\rVert_2-\ell$. Bruk `joints(z)`, `np.diff(..., axis=0)` og
`np.linalg.norm(..., axis=1)`. Argumentet `lengths` er $\ell$; det kan være ett
tall eller ti tall (del 3).

```{pyodide-python}
#| label: project-week12-student-h
def h(z, lengths=0.5):
    P = joints(z)            # rader p_0, p_1, ..., p_10
    # TODO: returner lengden av hvert ledd minus lengths (ti tall).
    raise NotImplementedError('Fullfør kravfunksjonen h')

print('din verdi:', np.round(h(flat_start()), 4))
print('forventet: [ 0.1403 -0.1 -0.1 -0.1 -0.1 -0.1 -0.1 -0.1 -0.1  0.1403]')
```

Kontrollen bruker startformen: ni punkter på linjen $y=-0.5$. Forklar for
hånd hvorfor første ledd er $0.1403$ for langt og de midterste $0.1$ for korte.

Den ferdige cellen løser problemet med SLSQP fra startformen, med alle ti
kravene samtidig:

```{pyodide-python}
#| label: project-week12-exact
def solve_exact(lengths=0.5, z0=None, loads=None):
    z0 = flat_start() if z0 is None else z0
    return minimize(energy, z0, args=(loads,), jac=grad_energy, method='SLSQP',
                    constraints=[{'type': 'eq', 'fun': h, 'jac': jac_links, 'args': (lengths,)}],
                    options={'ftol': 1e-14, 'maxiter': 500})

res = solve_exact()
z_exact = res.x
print('success:', res.success, '  største |h_i|:', f'{np.abs(h(z_exact)).max():.1e}')
print('E* =', round(res.fun, 6), 'J   laveste punkt:', round(joints(z_exact)[:, 1].min(), 4), 'm')
plot_chain(flat_start(), z_exact, labels=['start', 'SLSQP'])
```

Kravene er oppfylt til avrundingsnivå, $E_*\approx-8.292394$ J, og laveste
punkt ligger $1.3343$ m under endene.

### Multiplikatorene fra stasjonaritetskravet

SciPy 1.14 i nettleseren gir ikke multiplikatorene. Nyere SciPy-versjoner gir
`res.multipliers`, men med motsatt fortegn av vårt. Som i uke 12.5 velger vi
derfor selv de $\lambda$ som gjør stasjonaritetsfeilen
$\lVert\nabla E+J^T\lambda\rVert_2$ minst; det virker overalt. Det er et minste kvadraters problem med ti ukjente
([uke 4](uke4.qmd#uke4-mk)):

```{pyodide-python}
#| label: project-week12-multipliers
J = jac_links(z_exact)
lam = np.linalg.lstsq(J.T, -grad_energy(z_exact), rcond=None)[0]
print('stasjonaritetsfeil:', f'{np.linalg.norm(grad_energy(z_exact) + J.T @ lam):.1e}')
print('lambda (N):', np.round(lam, 4))
```

Stasjonaritetsfeilen er liten, og multiplikatorene er
$5.6238,\ 4.8608,\ 4.1985,\ 3.6915,\ 3.4099$ på venstre halvdel, speilet på
høyre. Alle er positive: hvert ledd trekker.

### Lagranges likning i ett leddpunkt

Bare $h_j$ og $h_{j+1}$ avhenger av $p_j$. Bruk regnereglene, og fullfør:

$$\nabla_{p_j}E+\lambda_j\nabla_{p_j}h_j+\lambda_{j+1}\nabla_{p_j}h_{j+1}
=\begin{bmatrix}0\\w\end{bmatrix}+\lambda_ju_j-\lambda_{j+1}u_{j+1}=0.$$

1. Skriv $x$-komponenten. Vis at $\lambda_j\cos\theta_j$ er **det samme tallet
   for alle ti ledd**. Dette er «den vannrette strekkraften er konstant», og
   den følger av at $E$ ikke avhenger av $x$-koordinatene.
2. Skriv $y$-komponenten:
   $\lambda_{j+1}\sin\theta_{j+1}-\lambda_j\sin\theta_j=w$. Hvert leddpunkt
   bærer sin egen vekt.
3. Bruk symmetrien og punkt 2 til å **forutsi** $\lambda_1\sin\theta_1$:
   hvor mye av den totale vekten $9w$ bærer hvert endeledd, og hvilket
   fortegn får tallet når $\sin\theta_1<0$? Forklar med dette hvorfor
   strekkraften er størst ved endene.

**Kode 2.** Kontroller punkt 1–3 numerisk. Rad $i$ i `U = directions(z_exact)`
er $(\cos\theta_{i+1},\sin\theta_{i+1})$. Skriv linjen for de ti tallene
$\lambda_i\cos\theta_i$, og sett inn forutsigelsen din. Linjen for de ni
tallene i punkt 2 er ferdig.

```{pyodide-python}
#| label: project-week12-balance
U = directions(z_exact)
print('sin(theta_i):', np.round(U[:, 1], 3))
# TODO: horizontal = de ti tallene lambda_i cos(theta_i)
horizontal = None
print('vannrett del:', np.round(np.asarray(horizontal, float), 6))
vertical = lam[1:]*U[1:, 1] - lam[:-1]*U[:-1, 1]   # lambda_(j+1) sin(theta_(j+1)) - lambda_j sin(theta_j)
print('loddrett differanse (forventet w = 1):', np.round(vertical, 6))
prediction = None   # TODO: bytt None med forutsigelsen din for lambda_1 sin(theta_1)
print('lambda_1 sin(theta_1):', round(lam[0]*U[0, 1], 4), '  din forutsigelse:', prediction)
```

Du skal få $3.373011$ N i alle ti ledd og $1.000000$ i alle ni leddpunkt.
Legg merke til at dette er de samme likningene som stasjonaritetsfeilen i
forrige celle, bare skrevet ut komponent for komponent: når den feilen er
liten, må disse tallene stemme. Det nye er tolkningen: konstant vannrett
kraft, og hvert leddpunkt bærer $w$. Forutsigelsen av $\lambda_1\sin\theta_1$
er derimot en ekte test. Den fulgte av symmetri og summen av likningene før
du så tallet.

**Ta med videre:** Multiplikatorene fra minste kvadrater oppfyller
kraftbalansen i hvert leddpunkt. Tabellen over $\lambda_i$ og den konstante
vannrette delen hører med i leveransen.

## 3. Multiplikatoren er en pris

I uke 12.2 fant vi $df_*/ds=-\lambda$ når kravet $h=0$ flyttes til $h=s$.
Her er $h_i=\text{lengde}-\ell_i$. Gjør vi ledd $i$ lengre med $s$ (i koden
under heter tallet `d`), blir kravet $\text{lengde}-\ell_i=s$. Kjettingen synker, og $E_*$ blir mindre.
Forutsigelsen er

$$\frac{dE_*}{d\ell_i}=-\lambda_i,$$

med enhet J/m = N. Det er samme idé som strømprisen i
[prosjekt 11](project_week11.qmd): dualverdien sier hva én enhet mer av en
ressurs er verdt. Fortegnet er en avtale. I prosjekt 11 var prisen $\lambda$
lik *pluss* endringen i minste kostnad per MWh mer forbruk. Her skriver vi
$L=E+\sum_i\lambda_ih_i$, og da er $\lambda_i$ lik *minus* endringen i $E_*$
per meter mer ledd. Begge sier hvor mye optimal verdi endres per enhet.

**Kode 3.** Gjør ledd 5 (det midterste til venstre, `lengths[4]`) $10^{-4}$ m
lengre, løs på nytt med `solve_exact(lengths, z_exact)`, og regn ut
differansekvotienten $(E_*^{\text{ny}}-E_*)/10^{-4}$. Sammenlign med
`-lam[4]`. *(Valgfritt: gjenta for ledd 1.)*

```{pyodide-python}
#| label: project-week12-price
d = 1e-4
lengths = np.full(10, 0.5)
# TODO: gjør ledd 5 d lenger, løs på nytt fra z_exact og regn ut differansekvotienten.
quotient = None
print('differansekvotient:', quotient, '  forventet -lambda_5:', -lam[4])
```

Du skal få omtrent $-3.4097$ mot $-3.4099$ for ledd 5. For ledd 1 blir det
$-5.6237$ mot $-5.6238$: et lengre endeledd senker kjettingen mest.

Hvorfor er differansekvotienten ikke nøyaktig $-\lambda_i$? Hva forventer du
hvis $d$ blir ti ganger mindre?

**Ta med videre:** $\lambda_i$ er hvor mye $E_*$ synker per meter ekstra
lengde i ledd $i$. Den er størst for endeleddene.

## 4. Fjærer i stedet for stive ledd

Nå bytter vi hvert stivt ledd med en fjær med stivhet $\mu$ (N/m; bokstaven
$\mu$ betyr stivhet her, ikke en pris som i prosjekt 11). Det er
**straffemetoden**: vi fjerner kravene og legger til et ledd som straffer brudd
på dem,

$$F_\mu(z)=E(z)+\frac\mu2\sum_{i=1}^{10}h_i(z)^2.$$

Fysisk er $\tfrac\mu2h_i^2$ energien i en fjær som er forlenget med $h_i$.
Problemet har ingen krav, så vi kan bruke BFGS, som vi har brukt siden uke 8.

**Utledning.** Fullfør, med kjerneregelen:

$$\nabla F_\mu=\nabla E+\sum_{i=1}^{10}(\mu\,h_i)\,\nabla h_i=0.$$

Sammenlign med Lagranges likning $\nabla E+\sum_i\lambda_i\nabla h_i=0$.
Hvilket tall spiller rollen til $\lambda_i$? Bruk svaret til å forutsi omtrent
hvor mye endeleddet blir forlenget når $\mu=10^4$ N/m. I fysikk heter
sammenhengen «fjærkraft = stivhet ganger forlengelse».

**Kode 4.** Skriv `F_mu` på én linje. Gradienten er ferdig. Løkken kjører
BFGS fra startformen for fire stivheter.

```{pyodide-python}
#| label: project-week12-penalty
def F_mu(z, mu):
    # TODO: E(z) + mu/2 * summen av h_i(z)^2
    raise NotImplementedError('Fullfør straffefunksjonen')

def grad_F_mu(z, mu):
    return grad_energy(z) + mu*jac_links(z).T @ h(z)

print('    mu   success  iter  største h   avstand    mu*h_1  (lambda_1 = 5.6238)')
for mu in [1e2, 1e4, 1e6, 1e8]:
    r = minimize(F_mu, flat_start(), args=(mu,), jac=grad_F_mu, method='BFGS',
                 options={'gtol': 1e-6, 'maxiter': 50000})
    stretch = h(r.x)
    print(f'{mu:6.0e}  {str(r.success):7s} {r.nit:5d}  {stretch.max():9.1e}'
          f'  {np.linalg.norm(r.x - z_exact):9.1e}  {mu*stretch[0]:8.4f}')
print('melding ved siste mu:', r.message)
```

Løkken tar noen sekunder i nettleseren. Les tabellen kolonne for kolonne:

- **Forlengelsen** blir omtrent hundre ganger mindre for hver
  hundredobling av $\mu$: $5.3\cdot10^{-2}$, $5.6\cdot10^{-4}$,
  $5.6\cdot10^{-6}$, $5.6\cdot10^{-8}$. Alle $h_i$ er positive: fjærene er
  litt lengre enn $\ell$.
- **Avstanden til den eksakte formen** følger med: $0.60$,
  $7.1\cdot10^{-3}$, $7.1\cdot10^{-5}$ og omtrent $7\cdot10^{-7}$. Regn ut
  avstand ganger $\mu$ for hver rad. Hva ser du?
- **Fjærkraften** $\mu h_1$ nærmer seg multiplikatoren: $5.26$, $5.618$,
  $5.6238$, $5.6238$. Straffemetoden gir altså også et anslag for
  multiplikatorene.
- **Antall iterasjoner** vokser fra noen titall til flere tusen.
- **`success`** er `True` for de minste $\mu$, men blir `False` når $\mu$
  blir stor (med denne starten fra $\mu=10^6$). Meldingen sier «precision
  loss»: linjesøket i BFGS fant ikke lenger et steg det godtok. Svaret er
  likevel godt, som tabellen viser. Les meldingen og kontroller svaret, ikke
  bare flagget.

### Hvorfor blir stive fjærer vanskelige?

$E$ er lineær, så Hessianen til $E$ er null. Hessianen til $F_\mu$ er derfor

$$\nabla^2F_\mu=\mu J^TJ+\sum_i(\mu h_i)\nabla^2h_i
\approx\mu J^TJ+\sum_i\lambda_i\nabla^2h_i.$$

$J$ har 10 rader og 18 kolonner. Den ferdige cellen regner ut egenverdiene ved
$\mu=10^6$ og sammenligner med rangen til $J$.

```{pyodide-python}
#| label: project-week12-hessian
mu = 1e6
r = minimize(F_mu, z_exact, args=(mu,), jac=grad_F_mu, method='BFGS', options={'gtol': 1e-6})
ev = np.linalg.eigvalsh(penalty_hessian(r.x, mu))
print('rang til J:', np.linalg.matrix_rank(jac_links(r.x)))
print('egenverdier over 1000:', np.sum(ev > 1000))
print('de minste egenverdiene:', np.round(ev[:3], 3))
print('kappa =', f'{ev[-1]/ev[0]:.2e}', '  kappa/mu =', round(ev[-1]/ev[0]/mu, 3))
```

Cellen gir 10 egenverdier over 1000 og 8 små (den minste $2.166$), og
$\kappa\approx1.775\,\mu$. Forklar de 10 store med rangen til $J$: de 8 små
hører til nullrommet fra uke 3, retningene der kjettingen svinger uten å
endre leddlengdene til første orden. Bruk så uke 6 og 9 til å si hvorfor stor
$\kappa$ gir mange BFGS-iterasjoner.

**Valgfritt: for stive fjærer.** Med $\mu=10^{10}$ starter vi i den eksakte
formen, så søket har nesten ingenting å gjøre:

```{pyodide-python}
#| label: project-week12-too-stiff
mu = 1e10
r = minimize(F_mu, z_exact, args=(mu,), jac=grad_F_mu, method='BFGS', options={'gtol': 1e-6})
print('iterasjoner:', r.nit, '  success:', r.success)
print('mu*h_1 =', round(mu*h(r.x)[0], 4), '  lambda_1 =', round(lam[0], 4))
ev = np.linalg.eigvalsh(penalty_hessian(r.x, mu))
print('kappa =', f'{ev[-1]/ev[0]:.1e}')
```

Søket stopper etter noen få steg med `success=False`, og $\mu h_1\approx4.97$
i stedet for $5.62$. Kondisjonstallet er nå omtrent $1.7\cdot10^{10}$. BFGS
lærer krumningen fra gradientforskjeller, og når krumningen varierer med en
faktor $10^{10}$, finner linjesøket ikke lenger et steg det godtar. Det finnes
fortsatt bedre punkter: gradienten har lengde omtrent $3.5$. Det er altså
metoden som gir opp. Med enda større $\mu$ kommer i tillegg avrundingen:
feilen i $\mu h_i$ er omtrent $\mu\cdot10^{-15}$ (uke 1). Straffemetoden har
dermed en grense i begge retninger: for liten $\mu$ gir en straffefeil
proporsjonal med $1/\mu$, og for stor $\mu$ gir et problem som er vanskelig å
løse nøyaktig. Med BFGS skjer det allerede ved $\mu=10^{10}$.

**Ta med videre:** Med stive ledd (SLSQP) får vi kravene nøyaktig og
multiplikatorene fra minste kvadrater. Med fjærer får vi et problem uten krav,
men med en feil som avtar som $1/\mu$ og et kondisjonstall som vokser som
$\mu$ ($\kappa\approx1.8\mu$).

## 5. Din egen undersøkelse

Velg **én** endring. Skriv forutsigelsen før du regner, ut fra
likningene i del 2–4, og kontroller den med en ny kjøring.

- **En lampe.** Heng en lampe på 5 N i leddpunkt 3:
  `loads = np.ones(9); loads[2] += 5`, og bruk `solve_exact(loads=loads)` og
  `grad_energy(z, loads)` i multiplikatorcellen. Hvilke av likningene i del 2
  endres? Blir den vannrette delen fortsatt lik i alle ledd? Hvor endrer
  $\lambda_i$ seg mest?
- **Ett elastisk ledd.** La ledd 10 være en ekte fjær med $\mu=20$ N/m, mens de
  andre er stive. Det gir ni krav og et straffeledd for ledd 10. Forutsi
  forlengelsen fra del 4, og sammenlign. Start med
  `F_el = lambda z: energy(z) + 20/2*h(z)[9]**2`, og gi SLSQP bare de ni
  første kravene: `'fun': lambda z: h(z)[:9]` og
  `'jac': lambda z: jac_links(z)[:9]`. Hvorfor stemmer forutsigelsen bare
  omtrent?
- **Flere ledd.** Bruk 20 ledd på $0.25$ m (`flat_start(20)`,
  `lengths=0.25`). Hver av de 19 frie leddpunktene veier fortsatt $w$. Forutsi
  $\lambda_1\sin\theta_1$ før du kjører. Endrer formen seg mye?

Gi forutsigelsen, resultatet og én setning om hva som stemte og hva som ikke
stemte.

## Spørsmål du skal kunne svare på

1. Formuler kjettingproblemet med valg, mål og krav. Hvor mange ukjente og krav
   har det?
2. Hva betyr en Lagrangemultiplikator i dette problemet, og hvorfor er alle
   $\lambda_i$ positive med vår fortegnsavtale?
3. Hvordan finner du multiplikatorene fra en numerisk løsning, og hva
   kontrollerer du etterpå?
4. Hvorfor er $\lambda_i\cos\theta_i$ lik i alle ledd, og hvorfor er
   strekkraften størst ved endene?
5. Hvorfor er en multiplikator en pris for kravet, og hva er fortegnet til
   $dE_*/d\ell_i$?
6. Hva er straffemetoden, hvorfor nærmer $\mu h_i$ seg $\lambda_i$, og hvordan
   avhenger forlengelsen og avstanden til den eksakte formen av $\mu$?
7. Hvorfor blir problemet vanskeligere jo stivere fjærene er? Bruk
   egenverdiene til Hessianen.
8. Hva forteller `success=False` i del 4, og hva forteller det ikke?
9. *(valgfri fordypning)* Hvorfor blir anslaget $\mu h_1$ dårligere igjen for
    svært stive fjærer?
10. *(valgfri fordypning)* Hvordan endres strekkreftene når en lampe henges på
    ett leddpunkt, og hvilken størrelse endres ikke?

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med cellene kjørt, og med:

- håndregningen fra del 1;
- multiplikatortabellen med den vannrette delen;
- straffetabellen;
- din egen undersøkelse med forutsigelse og resultat.

Skriv i tillegg en vurdering på **300–500 ord**: Hva betyr multiplikatorene
her, hvordan kontrollerte du dem, og hva koster det å bytte stive ledd med
stive fjærer? Skill mellom det likningene beviser og det forsøkene støtter.
