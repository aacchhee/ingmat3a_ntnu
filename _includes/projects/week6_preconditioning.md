## Kan vi gjøre systemet lettere uten å endre løsningen?

Du skal undersøke **diagonal prekondisjonering av konjugert gradient (CG)**.
CG er introdusert i [uke 6](uke6.qmd#uke6-cg); her bruker vi diagonalen i
matrisen til å endre skaleringen og undersøker om det gir mindre arbeid.
Vi følger samme
arbeidsform som i notatene: **forutsi → kjør → beskriv → forklar**.
Skriv forventningene før du kjører sammenligningen; bruk forklaringene til å tolke resultatene.

Kjernen er del 1–5. Du får fungerende CG, matriser og plottverktøy.
Din implementasjonsoppgave er å fullføre **prekondisjonert konjugert gradient
(PCG)** fra pseudokoden i del 4.

### Før du begynner

Alle systemer i kjernen har **symmetrisk positivt definitte (SPD)** matriser:
$A^T=A$ og $z^TAz>0$ for alle $z\ne0$. De har kjent løsning $x_*$.
Vi lager $b=Ax_*$ for å kunne måle faktisk feil. Dette er et kontrollert
forsøk, ikke en påstand om at vi kjenner løsningen i praktiske problemer.
Matrisene er små og tette for å gjøre alle kontrollene tilgjengelige i nettleseren.
Et **glissent system** har en matrise med få elementer som er ulike null.
Arbeid og lagring for slike store systemer kan ikke vurderes ut fra
kjøretidene til disse små, tette matrisene.

### Kjør her eller i en egen notebook

På denne siden lastes oppsettet automatisk; du trenger ikke åpne forelesningsnotatene.
For en egen notebook: last ned [oppsettsfilen](../assets/project_week6_setup.py){download="project_week6_setup.py"},
legg den i samme mappe som notebooken, og kjør følgende i første celle:

```python
from project_week6_setup import *
```

Python-miljøet må ha NumPy og Matplotlib installert. Filen inneholder hjelpefunksjonene
og forsøksdataene; du trenger ingen nettforbindelse når den er lastet ned.
Kopier deretter prosjektets kodeceller i rekkefølge og fullfør de markerte oppgavene.
Ta med oppsettsfilen ved levering, og kontroller notebooken med **Restart / Run all**.
Importlinjen over er bare for egen notebook, ikke for cellene på nettsiden.

**Residualen** er $r=b-Ax$: avviket i de opprinnelige likningene.
Vi bruker vanlig vektorlengde $\|r\|_2=\sqrt{\sum_i r_i^2}$.
Relativ residual er $\|b-Ax\|_2/\|b\|_2$, og relativ løsningsfeil er
$\|x-x_*\|_2/\|x_*\|_2$; forsøksdataene har ikke-null nevnere.
**Spekteret** er samlingen av egenverdier. For SPD er
$\kappa_2(A)=\lambda_{\max}/\lambda_{\min}$ **kondisjonstallet**, som
måler forholdet mellom største og minste strekk. Det bestemmer ikke alene
antall CG-steg; egenverdienes fordeling og høyresiden spiller også inn.

## 1. Oppdag en forskjell i arbeidsmengde

To SPD-matriser kan ha samme størrelse og likevel kreve svært ulikt arbeid.
**Forutsi:** Er antallet ukjente nok til å forutsi hvor mange CG-steg vi trenger?

```{pyodide-python}
#| label: project-week6-data
n = 60
B = 2*np.eye(n) - .25*np.eye(n, k=1) - .25*np.eye(n, k=-1)
d = np.geomspace(1., 100., n)
A_scaled = d[:,None] * B * d[None,:]
A_poisson = 2*np.eye(n) - np.eye(n, k=1) - np.eye(n, k=-1)
rng = np.random.default_rng(6)
x_star = rng.normal(size=n)
problems = {'Ujevn skalering': A_scaled, 'Poisson': A_poisson}
# Samme kjente løsning og samme nullstart. Høyresiden blir forskjellig.
```

Bruk CG-funksjonen nedenfor på begge systemene, foreløpig uten
prekondisjonering. Noter antall steg og hvilken residual som ble nådd.
Bruk retningstolkningen fra uke 6 når du forklarer forskjellen etter forsøket.

**Fungerende CG og måling av original residual**

Denne cellen definerer CG automatisk. Den returnerer hele banen og kontrolltall.
Vi sjekker $b-Ax$ direkte ved hvert steg, også om algoritmen vedlikeholder
en residual med en kort oppdateringsformel.

```{pyodide-python}
#| label: project-week6-cg
#| autorun: true

def cg(A, b, x0=None, rtol=1e-8, atol=0., max_steps=1000):
    A, b = np.asarray(A, float), np.asarray(b, float)
    if A.shape != (b.size, b.size) or not np.allclose(A, A.T):
        raise ValueError('Bruk en symmetrisk kvadratisk matrise')
    x = np.zeros_like(b) if x0 is None else np.array(x0, float, copy=True)
    if x.shape != b.shape or rtol <= 0 or atol < 0 or max_steps < 1:
        raise ValueError('Kontroller start, toleranser og maksimalgrense')
    if not all(np.all(np.isfinite(t)) for t in [A, b, x]):
        raise ValueError('Bruk endelige tall')
    r = b - A @ x
    path, residuals = [x.copy()], [np.linalg.norm(r)]
    target = atol + rtol*np.linalg.norm(b)
    matvecs = 1
    if residuals[-1] <= target:
        return {'path':np.array(path), 'residuals':np.array(residuals),
                'converged':True, 'matvecs':matvecs, 'preconditioner_calls':0}
    p = r.copy()
    rr = r @ r
    for k in range(max_steps):
        Ap = A @ p
        matvecs += 1
        curvature = p @ Ap
        if curvature <= 0 or not np.isfinite(curvature):
            raise ValueError('CG trenger positiv krumning; kontroller SPD')
        alpha = rr / curvature
        x = x + alpha*p
        r = r - alpha*Ap
        # Direkte kontroll i det opprinnelige systemet.
        actual = np.linalg.norm(b - A @ x)
        matvecs += 1
        path.append(x.copy()); residuals.append(actual)
        if actual <= target:
            break
        rr_new = r @ r
        if rr_new == 0:
            break  # Rapporter manglende konvergens hvis direkte kontroll ikke var liten.
        p = r + (rr_new/rr)*p
        rr = rr_new
    return {'path':np.array(path), 'residuals':np.array(residuals),
            'converged':residuals[-1] <= target, 'matvecs':matvecs,
            'preconditioner_calls':0}
```

Symmetrikontrollen er ikke et SPD-bevis. De leverte matrisene er SPD av
konstruksjon. Testen på $p^TAp$ oppdager enkelte problemer, men erstatter ikke
forutsetningen om SPD. Vi håndterer riktig start ved å stoppe før divisjon.


```{pyodide-python}
#| label: project-week6-baseline
baseline = {}
for name, A in problems.items():
    b = A @ x_star
    result = cg(A, b)
    baseline[name] = result
    print(name, 'steg:', len(result['path'])-1,
          'relativ residual:', result['residuals'][-1]/np.linalg.norm(b),
          'konvergert:', result['converged'])
```

**Knytt forsøket til CG fra forelesningen**

Bratteste nedstigning velger $p_k=r_k$ hver gang. CG kombinerer den nye
residualen med forrige søkeretning slik at retningene i eksakt regning er
**A-konjugerte**:

$$p_i^TAp_j=0\quad(i\ne j).$$

Fra uke 4 kjenner vi ortogonalitet. Her er måleregelen
$\langle v,w\rangle_A=v^TAw$, som er et indreprodukt fordi $A$ er SPD.
En linjeminimering langs en ny konjugert retning bevarer optimaliteten i
de gamle retningene. CG trenger ikke lagre alle retningene:

$$\alpha_k=\frac{r_k^Tr_k}{p_k^TAp_k},\quad
x_{k+1}=x_k+\alpha_kp_k,\quad r_{k+1}=r_k-\alpha_kAp_k,$$

$$\beta_k=\frac{r_{k+1}^Tr_{k+1}}{r_k^Tr_k},\quad
p_{k+1}=r_{k+1}+\beta_kp_k.$$

I eksakt regning terminerer CG etter høyst $n$ steg for SPD-systemer.
Flyttallsregning kan kreve flere. Antall steg påvirkes av fordelingen av
egenverdiene og hvilke feilbidrag starten har, ikke bare dimensjonen.
Et kondisjonstall alene beskriver ikke hele konvergenshistorikken.
**Energifeilen** er $\lVert x-x_*\rVert_A=\sqrt{(x-x_*)^TA(x-x_*)}$.
CG minimerer den over stadig større rom av tilgjengelige søkeretninger; den euklidske
residualnormen trenger ikke avta i hvert eneste steg.


## 2. Prøv å endre koordinatene

Velg $M=\operatorname{diag}(A)$ og skriv $m_i=a_{ii}$.
Alle $m_i$ er positive for SPD. **Gjett først:** Vil det hjelpe like mye på
begge problemene å gjøre alle diagonalelementene lik én?

Utfør følgende omregning og kjør vanlig CG på det nye systemet:

```{pyodide-python}
#| label: project-week6-transform
transformed = {}
for name, A in problems.items():
    b = A @ x_star
    m = np.diag(A)
    invroot = 1/np.sqrt(m)
    At = invroot[:,None] * A * invroot[None,:]
    bt = invroot*b
    result = cg(At, bt, rtol=1e-12)
    # Hver rad i path er y_k. Omregn alle tilbake til x-koordinater.
    x_path = result['path'] * invroot[None,:]
    x = x_path[-1]
    transformed[name] = (At, x_path)
    print(name, 'diagonal etter skalering:', np.diag(At)[:3],
          'ORIGINAL relativ residual:', np.linalg.norm(b-A@x)/np.linalg.norm(b))
```

Noter hva som endret seg. Dette er en første undersøkelse, **ikke ennå en
rettferdig sammenligning av antall steg**: stoppet her bruker en transformert
residual. Del 4 bruker samme opprinnelige residualkrav i begge metoder.

**Samme løsning og bevart symmetri**

Vi setter $x=M^{-1/2}y$ og multipliserer $Ax=b$ fra venstre med $M^{-1/2}$:

$$\underbrace{M^{-1/2}AM^{-1/2}}_{\widetilde A}y
=\underbrace{M^{-1/2}b}_{\widetilde b},\qquad x=M^{-1/2}y.$$

Diagonalmatrisene anvendes ved å dele koordinatvis på $\sqrt{m_i}$.
Ingen tett invers trengs. For $z\ne0$ er

$$z^T\widetilde Az=(M^{-1/2}z)^TA(M^{-1/2}z)>0,$$

og $\widetilde A^T=\widetilde A$. Dermed kan vi bruke vanlig CG på dette systemet.
Derimot er $M^{-1}A$ generelt ikke symmetrisk i det vanlige indreproduktet;
vi skal ikke bare sende denne matrisen til en vanlig CG-rutine.

Original residual er $r=b-Ax$. Transformert residual er $\widetilde r=M^{-1/2}r$.
De to normene måler derfor forskjellige skaleringer av det samme avviket.
Det er den originale residualen som brukes til hovedsammenligningen vår.


## 3. Se hva skaleringen faktisk endrer

**Før beregning:** Skriv hva du forventer at skjer med egenverdienes forhold
for hvert problem. Finn deretter egenverdiene til $A$ og $\widetilde A$.

```{pyodide-python}
#| label: project-week6-spectrum
fig, axes = plt.subplots(1, 2, figsize=(10,3))
for ax, (name, A) in zip(axes, problems.items()):
    At = transformed[name][0]
    lam, lamt = np.linalg.eigvalsh(A), np.linalg.eigvalsh(At)
    ax.semilogy(lam, '.', label='A')
    ax.semilogy(lamt, '.', label='symmetrisk skalert A')
    ax.set(title=name, xlabel='Sortert indeks', ylabel='Egenverdi')
    ax.legend()
    print(name, 'κ₂ før:', lam[-1]/lam[0], 'etter:', lamt[-1]/lamt[0])
plt.show()
```

Lag også et lite konturforsøk. Endre bare koordinatene, og kontroller at
minimumet omregnes riktig:

```{pyodide-python}
#| label: project-week6-contours
A2 = np.array([[1., 2.], [2., 100.]])
s2 = np.array([1., 1.]); b2 = A2 @ s2
w = 1/np.sqrt(np.diag(A2))
At2 = w[:,None]*A2*w[None,:]; bt2=w*b2
fig, axes = plt.subplots(1,2,figsize=(10,4))
bowl_plot(axes[0], A2, b2, {}, bounds=(-2,4,-1,3))
bowl_plot(axes[1], At2, bt2, {}, bounds=(-3,5,6,14))
axes[0].set_title('Opprinnelige x-koordinater')
axes[1].set(title='Nye y-koordinater', xlabel='y₁', ylabel='y₂')
plt.show()
```

**Hvorfor kan ett tiltak gi to forskjellige resultater?**

Første system er $A=DBD$ med $D=\operatorname{diag}(d)$.
Siden $B$ har diagonal to, er $M=2D^2$ og

$$M^{-1/2}AM^{-1/2}=B/2.$$

Den store forskjellen mellom koordinatskaleringene fjernes.
$B$ er SPD: diagonal to er større enn summen av de to nabobidragene $0.5$,
og egenverdiene ligger mellom $1.5$ og $2.5$.
Skalering på begge sider med invertibel diagonal $D$ bevarer positiv
definitet: $z^TDBDz=(Dz)^TB(Dz)>0$ for $z\ne0$.

For Poisson-matrisen er $M=2I$, slik at $\widetilde A=A/2$.
Alle egenverdier halveres, men forholdet mellom største og minste er det
samme. Diagonal prekondisjonering endrer derfor ikke vanskeligheten for CG
i eksakt regning. Små forskjeller i flyttall er ikke en systematisk forbedring.

Poisson-matrisen er SPD fordi, med $z_0=z_{n+1}=0$,
$z^TAz=\sum_{i=0}^n(z_{i+1}-z_i)^2>0$ for $z\ne0$.
Navnet **Jacobi-prekondisjonering** betyr her bruk av diagonalen, ikke at
vi kjører Jacobi-iterasjoner.


## 4. Fullfør PCG

Vi kan få effekten av koordinatskiftet uten å bygge $\widetilde A$.
For hver residual løser vi det enkle systemet $Mz=r$.
Med diagonal $M$ betyr dette $z_i=r_i/m_i$. I malen lagres diagonalen
som vektoren `m`, så `r/m` deler koordinatvis.

**Din kodeoppgave:** Fyll de tre markerte uttrykkene i malen. Følg pseudokoden:

```text
r = b − A x
Hvis original residual er liten nok: stopp.
z = løs M z = r
p = z; gamma = rᵀ z
Gjenta:
    Ap = A p
    alpha = gamma / (pᵀ Ap)
    x = x + alpha p
    r = r − alpha Ap
    Kontroller den originale residualen b − A x; stopp hvis liten nok.
    z = løs M z = r
    gamma_ny = rᵀ z
    beta = gamma_ny / gamma
    p = z + beta p
    gamma = gamma_ny
```

```{pyodide-python}
#| label: project-week6-pcg-template

def pcg(A, b, m, x0=None, rtol=1e-8, atol=0., max_steps=1000):
    A, b, m = np.asarray(A,float), np.asarray(b,float), np.asarray(m,float)
    if A.shape != (b.size,b.size) or not np.allclose(A,A.T):
        raise ValueError('Bruk en symmetrisk kvadratisk matrise')
    if m.shape != b.shape or np.any(m <= 0):
        raise ValueError('Prekondisjoneringen må ha positiv diagonal')
    x = np.zeros_like(b) if x0 is None else np.array(x0,float,copy=True)
    if x.shape != b.shape or rtol <= 0 or atol < 0 or max_steps < 1:
        raise ValueError('Kontroller start, toleranser og maksimalgrense')
    if not all(np.all(np.isfinite(t)) for t in [A,b,m,x]):
        raise ValueError('Bruk endelige tall')
    r = b - A @ x
    path, residuals = [x.copy()], [np.linalg.norm(r)]
    target = atol + rtol*np.linalg.norm(b)
    matvecs, applies = 1, 0
    if residuals[-1] <= target:
        return {'path':np.array(path), 'residuals':np.array(residuals),
                'converged':True, 'matvecs':matvecs, 'preconditioner_calls':applies}
    def apply_M_inverse(r):
        # TODO 1: returner løsningen av M z = r ved koordinatvis divisjon.
        raise NotImplementedError('TODO 1')
    z = apply_M_inverse(r); applies += 1
    p = z.copy(); gamma = r @ z
    for k in range(max_steps):
        Ap = A @ p; matvecs += 1
        curvature = p @ Ap
        if curvature <= 0 or not np.isfinite(curvature):
            raise ValueError('PCG krever SPD')
        alpha = gamma / curvature
        x = x + alpha*p
        r = r - alpha*Ap
        actual = np.linalg.norm(b - A @ x); matvecs += 1
        path.append(x.copy()); residuals.append(actual)
        if actual <= target:
            break
        z = apply_M_inverse(r); applies += 1
        gamma_new = r @ z
        if gamma_new <= 0:
            break
        # TODO 2: beregn beta fra gamma_new og gamma.
        beta = None
        # TODO 3: oppdater søkeretningen med z og forrige p.
        p = None
        gamma = gamma_new
    return {'path':np.array(path), 'residuals':np.array(residuals),
            'converged':residuals[-1] <= target, 'matvecs':matvecs,
            'preconditioner_calls':applies}
```

**Kontroller før hovedforsøket:**

- På $A=\operatorname{diag}(1,100)$ med $m=(1,100)$ skal PCG nå løsningen
  i ett steg fra null, bortsett fra avrunding.
- Med $m=(1,\ldots,1)$ skal du få samme forløp som CG, opp til avrunding.
- Med $x_0=x_*$ skal metoden stoppe uten et eneste søkesteg.
- På det lille $A_2$ i del 3 skal svaret stemme med vanlig CG på det
  symmetrisk transformerte systemet etter omregning til $x$.

**Hvorfor byttes rᵀr ut med rᵀz?**

I de nye koordinatene er residualen $\widetilde r=M^{-1/2}r$.
Dermed er

$$\widetilde r^T\widetilde r=r^TM^{-1}r=r^Tz.$$

Den vanlige CG-metoden i de nye koordinatene kan derfor skrives med
$\gamma=r^Tz$ i de opprinnelige koordinatene. Første retning blir
$p=M^{-1}r=z$. Ved å omregne resten av CG får vi pseudokoden over.

En prekondisjonering skal være billig å anvende og gjøre det transformerte
problemet lettere. Vi beregner ikke $M^{-1}$ eksplisitt. Diagonal $M$ trenger
$n$ lagrede tall og $n$ divisjoner per anvendelse. Et mer avansert valg kan
kreve større oppsett og en egen lineær løsning hver gang.
PCG trenger en fast SPD-prekondisjonering i denne formuleringen.


## 5. En rettferdig sammenligning

**Skriv forventningen først:** Hvilket system vil få færrest ekstra gevinster
av prekondisjonering? Bruk forklaringen fra del 3 til å begrunne svaret.

Bruk samme $A,b,x_0=0$, `rtol=1e-8`, `atol=0` og maksimalgrense 1000 for
CG og PCG. Begge skal stoppe på **original** residual $\lVert b-Ax\rVert_2$.
Fyll først PCG-malen; fjern deretter kommentartegnene i kjørecellen.

```{pyodide-python}
#| label: project-week6-comparison

def compare_runs(A, b, star, runs):
    fig, axes = plt.subplots(1,2,figsize=(10,3))
    for name, out in runs.items():
        path = out['path']
        # I disse implementasjonene: én startberegning og to produkter per steg.
        work = 1 + 2*np.arange(len(path))
        residuals = out['residuals']/np.linalg.norm(b)
        errors = np.linalg.norm(path-star,axis=1)/np.linalg.norm(star)
        axes[0].semilogy(work, np.maximum(residuals,1e-16), label=name)
        axes[1].semilogy(work, np.maximum(errors,1e-16), label=name)
        print(name, 'steg',len(path)-1,'A-produkter',out['matvecs'],
              'M-løsninger',out['preconditioner_calls'],'konvergert',out['converged'])
    for ax, label in zip(axes,['Original relativ residual','Relativ løsningsfeil']):
        ax.set(xlabel='Antall A-vektor-produkter inkl. stoppkontroll',ylabel=label)
        ax.legend()
    plt.show()

# for name, A in problems.items():
#     b = A @ x_star
#     results = {'CG':cg(A,b), 'PCG':pcg(A,b,np.diag(A))}
#     print(name)
#     compare_runs(A,b,x_star,results)
```

Rapporter også oppsett og anvendelse av $M$: $n$ diagonalverdier lagres én
gang, og hver anvendelse krever $n$ divisjoner. Våre tellere inkluderer
direkte residualkontroll, men ikke etterfølgende analyseplott, spektralberegninger
eller konstruksjon av testdata. Skillet skal oppgis i rapporten.

### Din undersøkelse: når er diagonal skalering nok?

De to ferdige systemene viser en mulig gevinst og en begrensning. De er
**kalibrering av verktøyene**, ikke belegg for en generell konklusjon.
Formuler én påstand om hva som styrer gevinsten, og konstruer et nytt
kontrollert forsøk som kan utfordre den. Du skal selv begrunne både
matrisevalget og hva som ville telle som et moteksempel.

Velg én vei:

- Hold diagonalen og størrelsen fast, men endre koblingene utenfor diagonalen.
  Er samme diagonale skala nok til å forutsi samme gevinst?
- Hold matrisen fast, men endre den kjente løsningen og dermed $b=Ax_*$.
  Er gevinsten uavhengig av hvilke egenretninger problemet aktiverer?

Du kan bruke konstruksjonen nedenfor til den første veien. Velg selv
parameterverdier og påstand; funksjonen er dataverktøy, ikke en ferdig undersøkelse.

```{pyodide-python}
#| label: project-week6-research-family
def coupled_problem(n, span, coupling):
    if n < 2 or span < 1 or not 0 <= coupling < 1:
        raise ValueError('Bruk n >= 2, span >= 1 og 0 <= coupling < 1')
    d = np.geomspace(1., span, n)
    B = 2*np.eye(n) - coupling*(np.eye(n,k=1)+np.eye(n,k=-1))
    return d[:,None]*B*d[None,:]
```

For fast `n` og `span` er diagonalen alltid $2d_i^2$. $B$ er symmetrisk og
strengt diagonaldominant: diagonalelementet er større enn summen av
absoluttverdiene til de andre elementene i raden. Med positiv diagonal gir
dette SPD her. Med $D=\operatorname{diag}(d)$ er $A=DBD$.
Skaleringen bevarer positiv definitet siden
$z^TAz=(Dz)^TB(Dz)>0$ for $z\ne0$. Ved andre egne konstruksjoner
må du selv begrunne at CGs forutsetninger fortsatt er oppfylt.

Skriv påstand, kontrollvariabler og suksesskriterium **før** kjøring.
Mål gevinsten med antall matrise-vektor-produkter ved samme originale
residualkrav; oppgi også PCGs ekstra arbeid. Ikke kall en avbrutt kjøring
raskere fordi den brukte færre steg.

Lag ett kontrollert par. **Valgfritt:** Prøv deretter forklaringen på ett nytt par
med en mer krevende kobling eller en annen høyreside. Behold
sammenligningsreglene. Vis alle kjøringene du bruker, også et eventuelt motfunn,
og avgrens konklusjonen til det du faktisk har undersøkt.

### Leveranse

Lever én kjørbar notebook eller Quarto-side med fullført PCG, de fire
kontrollene i del 4, de to kalibreringssystemene og din egen undersøkelse
med ett kontrollert par. Skriv en analyse på 400–600 ord med påstand,
forsøksdesign, et mulig motfunn og en avgrenset konklusjon.
Bruk figurer med aksetitler og en tabell med kontrolltall. Analysen skal svare på:

1. Hvorfor løser vi fortsatt det samme opprinnelige problemet?
2. Hvilken endring i spekteret (samlingen av egenverdier) forklarer forbedringen, og hvorfor hjelper
   diagonal prekondisjonering ikke nødvendigvis på Poisson-systemet?
3. Oppnådde begge metodene samme residualkrav? Hva forteller faktisk feil i tillegg?
4. Hvilken ekstra kostnad har prekondisjoneringen, og hva må undersøkes
   før vi generaliserer til store, glisne systemer?

### Tilbake til notatene

Se [CG i uke 6](uke6.qmd#uke6-cg) for konjugerte retninger og
[residualforsøket](uke6.qmd#uke6-residual) for forskjellen mellom residual og feil.
