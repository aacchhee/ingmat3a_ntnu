**Arbeidstid:** omtrent **5 timer** for hele prosjektet, eller **3 timer**
for kjernen alene.

I uke 3 rekonstruerte vi polynomer fra målinger. Nå skal du undersøke
hva som skjer når målingene inneholder støy, og avgjøre om en beregnet
tilpasning er pålitelig. Bruk QR og projeksjon fra uke 4 som verktøy.

**Oppdraget er å begrunne en metode og en tilpasning med egne forsøk.**
En liten residual er én observasjon; du må også undersøke beregningen
og hvordan den tilpassede kurven oppfører seg.

## Arbeidsplan

| Løype | Arbeid | Omtrent |
|---|---|---:|
| **Kjerne** | Del 1–4: vurder en tilpasning, undersøk et sammenbrudd og tilpass polynomer | 3 timer |
| **Valgt fordypning** | Del 5 **eller** del 6: sammenlign beregningsmetoder | 1 time |
| **Redningsforsøk og rapport** | Del 7 og en samlet vurdering | 1 time |

Startcellene lager data og gir noen kodeverktøy. **Du fyller selv inn
beregningene merket `TODO`.** Før hvert forsøk skal du skrive en forventning.
Etterpå skal du vise et resultat og forklare hva det støtter. Endre én
egenskap om gangen, og noter grad, målepunkter, støystørrelse og metode.

Ved behov: [projeksjon i 4.2](uke4.qmd#uke4-projeksjon),
[minste kvadrater i 4.5](uke4.qmd#uke4-mk) og
[polynomer i 4.6](uke4.qmd#uke4-polynomer).
Hintene nedenfor er sammenfoldet, slik at du kan forsøke selv først.

```{pyodide-python}
#| label: project-week4-setup
#| autorun: true
#| context: setup

# Felles verktøy for dette prosjektet; lastes automatisk på siden.
# Funksjonene er samlet her slik at prosjektet kan brukes uten andre sider.
import numpy as np
import matplotlib.pyplot as plt
from numpy.polynomial import polynomial as poly
from numpy.polynomial import chebyshev as cheb

# De samme målematrisene som i uke 3, ferdigstilt her slik at dette
# prosjektet ikke avhenger av kode i en annen nettleserside.
def monomial_matrix(points, n):
    """Målematrise for basisen (1, x, ..., x^n)."""
    points = np.asarray(points, dtype=float)
    # Grad n gir n+1 basisfunksjoner, inkludert konstantleddet.
    powers = np.arange(n+1)
    # Rad i er punkt i; kolonne j er punktet opphøyd i j. None gjør formene kompatible.
    return points[:, None]**powers[None, :]


def chebyshev_matrix(points, n):
    """Målematrise for basisen (T_0, ..., T_n)."""
    # Samme rad/kolonne-betydning, men med Chebyshev-polynomer i stedet for potenser.
    return cheb.chebvander(np.asarray(points, dtype=float), n)


def chebyshev_points(count):
    """Nøyaktig count cosinusfordelte punkter i [-1, 1]."""
    if count < 1:
        raise ValueError("count må være minst 1")
    k = np.arange(count)
    # Cosinus gir flere målepunkter nær endene av intervallet.
    return np.cos((2*k+1)*np.pi/(2*count))


def reference_coordinates(n):
    """Moderate, deterministiske koordinater i Chebyshev-basis."""
    k = np.arange(n+1)
    # Avtakende koeffisienter gir et fast referansepolynom med vekslende fortegn.
    return (-1.0)**k/(k+1.0)**2


def classical_gram_schmidt(A):
    """Klassisk GS uten rangkontroll, brukt for å framprovosere feil."""
    A = np.asarray(A, dtype=float)
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    for j in range(n):
        # CGS beregner alle komponenter mot den opprinnelige kolonnen.
        coefficients = Q[:, :j].T @ A[:, j]
        R[:j, j] = coefficients
        # Trekk summen av tidligere vektorbidrag fra den aktuelle kolonnen.
        v = A[:, j] - Q[:, :j] @ coefficients
        R[j, j] = np.linalg.norm(v)
        Q[:, j] = v/R[j, j]
    return Q, R


def modified_gram_schmidt(A, tolerance=None):
    """Modifisert GS med eksplisitt kontroll av små nye retninger."""
    A = np.asarray(A, dtype=float)
    if A.ndim != 2:
        raise ValueError("A må være todimensjonal")
    m, n = A.shape
    if m < n:
        raise ValueError("Tynn QR her krever minst like mange rader som kolonner")
    if not np.isfinite(A).all():
        raise ValueError("A må bare inneholde endelige tall")
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    if tolerance is None:
        # Skalert grense for når en rest er for liten til å normaliseres pålitelig.
        tolerance = np.finfo(float).eps*max(m, n)*np.linalg.norm(A, "fro")
    for j in range(n):
        # MGS oppdaterer en kopi av kolonnen etter hver subtraksjon.
        v = A[:, j].copy()
        for i in range(j):
            # Denne koeffisienten beregnes på den oppdaterte resten.
            R[i, j] = Q[:, i] @ v
            v = v-R[i, j]*Q[:, i]
        R[j, j] = np.linalg.norm(v)
        if not np.isfinite(R[j, j]):
            raise np.linalg.LinAlgError(
                f"Kolonne {j+1} ga en ikke-endelig rest"
            )
        # Stopp før divisjon med en lengde som er numerisk for liten.
        if R[j, j] <= tolerance:
            raise np.linalg.LinAlgError(
                f"Kolonne {j+1} gir ingen pålitelig ny retning"
            )
        Q[:, j] = v/R[j, j]
    return Q, R


def qr_solution(A, b, qr_method=modified_gram_schmidt):
    """Minste-kvadraters løsning fra en tynn QR-faktorisering."""
    A = np.asarray(A, dtype=float)
    b = np.asarray(b, dtype=float)
    if A.ndim != 2 or b.ndim != 1 or A.shape[0] != b.size:
        raise ValueError("A må være m x k og b må ha lengde m")
    if not np.isfinite(A).all() or not np.isfinite(b).all():
        raise ValueError("A og b må bare inneholde endelige tall")
    Q, R = qr_method(A)
    # Q.T@b er Q-koordinater; løsningen x gir koeffisientene for kolonnene i A.
    x = np.linalg.solve(R, Q.T@b)
    if not np.isfinite(x).all():
        raise np.linalg.LinAlgError("QR-løsningen inneholder ikke-endelige tall")
    return x, Q, R


def safe_ratio(numerator, denominator):
    """Skalert diagnostikk, også definert når begge ledd er null."""
    # Unngå 0/0 i diagnostikken; ikke-null feil med null skala rapporteres som Inf.
    if denominator == 0:
        return 0.0 if numerator == 0 else np.inf
    return float(numerator/denominator)


def method_report(name, A, b, c, Q=None, R=None):
    """Tall til sammenligning av metoder på de samme dataene."""
    A = np.asarray(A, dtype=float)
    b = np.asarray(b, dtype=float)
    c = np.asarray(c, dtype=float)
    # Ett avvik per målepunkt; normen alene tar ikke hensyn til antallet målinger.
    residual = b - A @ c
    residual_norm = np.linalg.norm(residual)
    report = {
        "metode": name,
        "alle_endelige": bool(
            np.isfinite(c).all() and np.isfinite(residual).all()
        ),
        "residualnorm": float(residual_norm),
        "residual_per_maling": float(residual_norm / np.sqrt(b.size)),
    }
    if Q is not None and R is not None:
        report["alle_endelige"] = bool(
            report["alle_endelige"]
            and np.isfinite(Q).all() and np.isfinite(R).all()
        )
        # Første kontroll tester Q; andre kontroll tester produktet QR.
        report["ortogonalitetsfeil_F"] = float(
            np.linalg.norm(Q.T @ Q - np.eye(Q.shape[1]), "fro")
        )
        report["relativ_faktoriseringsfeil_F"] = safe_ratio(
            np.linalg.norm(A - Q @ R, "fro"), np.linalg.norm(A, "fro")
        )
    return report
```

::: {.callout-note collapse="true"}
## Kodeverktøy og kjørerekkefølge

Fellesfunksjonene lastes automatisk på denne siden; du trenger ikke
kopiere kode fra prosjekt 3. Kjør startcellene ovenfra og ned.
Del 5–6 bruker dataene fra del 4. Etter endringer i data må de tilhørende
beregningene kjøres på nytt.

| Verktøy | Hva du får |
|---|---|
| `classical_gram_schmidt(A)` | Klassisk GS: `Q, R`, uten kontroll av små rester |
| `modified_gram_schmidt(A)` | Modifisert GS: `Q, R`, med kontroll av små rester |
| `qr_solution(A, b, metode)` | Koeffisienter, `Q` og `R`; standardmetoden er modifisert GS |
| `method_report(navn, A, b, c, Q, R)` | En samling kontrollverdier til resultattabellen din |

Funksjonene er hjelpemidler for å gjennomføre forsøkene. Du skal
forklare hvorfor kontrollene er relevante, og selv velge hva som skal
sammenlignes. Modifisert GS stopper hvis en ny rest er for liten til
å normaliseres pålitelig.
:::

## Kjerne

### 1. Godkjenn eller forkast en foreslått tilpasning

**Gitt:** seks målinger og modellen $p(t)=c_0+c_1t$.
En foreslått tilpasning har $c_0=0.95$ og $c_1=1.10$.

**Undersøk:** Er dette den beste tilpasningen i minste kvadraters forstand?
Hvilke beregninger trenger du for å avgjøre det?

```{pyodide-python}
#| label: project-week4-first-fit

# Data og en foreslått modell. Ingen optimal løsning er beregnet her.
t = np.linspace(-1.0, 1.0, 6)
b = np.array([-0.12, 0.34, 0.68, 1.32, 1.55, 2.18])
c_try = np.array([0.95, 1.10])

plt.scatter(t, b, color="black", label="målinger")
plt.plot(t, c_try[0] + c_try[1]*t, label="foreslått modell")
plt.xlabel("t"); plt.ylabel("verdi")
plt.grid(alpha=0.25); plt.legend(); plt.show()

# TODO: Bygg A, og beregn residualen og kvadratsummen for forslaget.
# TODO: Bruk Q og R til å finne egne koeffisienter c_qr.
# TODO: Sammenlign modellverdier og residualer, ikke bare koeffisientene.
```

1. Skriv dimensjonene til $A,c,b$ og bygg $A$. Beregn $r=b-Ac_{\text{forslag}}$
   og kvadratsummen. Hvilke målinger ligger over den foreslåtte modellen?
2. Finn en tilpasning med QR. Bruk `modified_gram_schmidt(A)` til å få
   $Q,R$, og beregn deretter koeffisientene selv.
3. Kontroller $Q^TQ-I$, $A-QR$ og $Q^Tr$ for den nye tilpasningen.
   Forklar hva hver kontroll undersøker. Gjør også den siste kontrollen
   for den foreslåtte tilpasningen.
4. Bruk `np.linalg.lstsq(A, b, rcond=None)[0]` som kontroll **etter** egen
   løsning. Lever én figur med begge modellene og en begrunnet avgjørelse:
   Hva gjør du hvis residualen ikke er null, men QR-kontrollene er gode?

Når du vil samle alle elementene i en matrise $E$ til ett kontrolltall,
bruker du **Frobeniusnormen**:
$\lVert E\rVert_F=\sqrt{\sum_{i,j}E_{ij}^2}$.
I Python er dette `np.linalg.norm(E, "fro")`.
Små avrundingsavvik fra null er forventet.

::: {.callout-tip collapse="true"}
## Hint: modellen og QR

Rad $i$ i $A$ er $[1\ \ t_i]$. Fra 4.5 har du
$d=Q^Tb$ og $Rc=d$. `np.linalg.solve(R, d)` løser det siste systemet.
Pass på at residualen beregnes på nytt for koeffisientene du kontrollerer.
:::

### 2. Finn årsaken når beregningen svikter

**Gitt:** en ny matrise $B$ og de to GS-funksjonene.
**Undersøk:** Kan alle tre kolonnene gi hver sin ortonormale vektor?

Før du kjører koden: Finn en eventuell sammenheng mellom kolonnene,
og forutsi hva som skjer med diagonalverdiene i $R$.

```{pyodide-python}
#| label: project-week4-dependent-nan

B = np.array([[1.0, 0.0, 1.0],
              [0.0, 1.0, 1.0],
              [0.0, 0.0, 0.0],
              [0.0, 0.0, 0.0]])

# Samme matrise sendes til begge funksjonene.
# En stopp eller en ugyldig verdi skal registreres som et forsøksresultat.
for name, method in [
    ("klassisk GS", classical_gram_schmidt),
    ("modifisert GS", modified_gram_schmidt),
]:
    try:
        with np.errstate(divide="ignore", invalid="ignore"):
            Q_test, R_test = method(B)
        print(name, "diagonal i R:", np.diag(R_test))
        print("alle verdier endelige:", np.isfinite(Q_test).all())
    except np.linalg.LinAlgError as error:
        print(name, "stoppet:", error)

# TODO: Gjenta med en kopi av B der elementet i rad 3, kolonne 3 er delta.
# Python-indeksen til dette elementet er [2, 2].
```

1. Knytt resultatet til kolonnerelasjonen du fant. Identifiser den konkrete
   divisjonen i GS som må undersøkes; se eventuelt
   [algoritmen fra 4.3](uke4.qmd#uke4-cgs).
2. Sett elementet i tredje rad og tredje kolonne til
   $\delta=10^{-4},10^{-10},10^{-16}$, ett forsøk om gangen.
   Hvor er kolonnene uavhengige på papir, og hvor fullføres beregningen?
3. Den modifiserte funksjonen har en stoppkontroll som den klassiske mangler.
   Hvilken del av forskjellen du observerer skyldes denne kontrollen?
4. Vurder påstanden: «Alle verdiene i $Q$ er endelige, derfor er
   QR-faktoriseringen pålitelig.» Bruk kontrollene fra del 1 som begrunnelse.

::: {.callout-tip collapse="true"}
## Hint: hva betyr «for liten rest»?

Stoppgrensen i hjelpefunksjonen tilpasses størrelsen på matrisen og
presisjonen i flyttallsregningen. En stopp betyr at funksjonen ikke
godtar resten som en pålitelig ny vektor. Det er ikke et bevis på at
kolonnene er nøyaktig avhengige.
:::

### 3. Undersøk hva flere målinger bidrar med

Vi går nå over til polynomer. **Gitt:** et referansepolynom av grad $3$
som vi lager støyfylte målinger av. Referansen er kjent i forsøket,
slik at vi kan kontrollere resultatet. Selve tilpasningen skal bare
bruke målepunktene og de støyfylte målingene.

#### Matrisen med Chebyshev-verdier

Vi skriver modellen i Chebyshev-basis:

$$p(x)=c_0T_0(x)+c_1T_1(x)+\cdots+c_nT_n(x),$$

der

$$T_0(x)=1,\qquad T_1(x)=x,\qquad
T_{j+1}(x)=2xT_j(x)-T_{j-1}(x).$$

**Chebyshev-målematrisen $C$ inneholder verdiene av disse
basisfunksjonene ved målepunktene:** rad $i$ hører til $x_i$,
og kolonne $j$ hører til $T_j$. Altså er $C_{ij}=T_j(x_i)$.
For grad $2$ ser det slik ut, siden $T_2(x)=2x^2-1$:

$$C=\begin{bmatrix}
1&x_0&2x_0^2-1\\
1&x_1&2x_1^2-1\\
\vdots&\vdots&\vdots\\
1&x_{m-1}&2x_{m-1}^2-1
\end{bmatrix}.$$

Dermed inneholder $Cc$ modellverdiene ved de $m$ målepunktene,
akkurat som $Ac$ i linjeforsøket. Grad $n$ gir $n+1$ koeffisienter
og en matrise med $m$ rader og $n+1$ kolonner.

| Kodeverktøy | Bruk |
|---|---|
| `chebyshev_matrix(points, n)` | Lag $C$ for målepunktene og graden |
| `cheb.chebval(points, c)` | Beregn polynomverdier fra Chebyshev-koeffisienter |
| `reference_coordinates(n)` | Lag et fast referansepolynom av grad $n$ |

```{pyodide-python}
#| label: project-week4-polynomial-fit

# Endre én forsøksinnstilling om gangen.
n = 3
m = 12
noise_size = 1e-3
seed = 2026
points = np.linspace(-1.0, 1.0, m)

# Referansen brukes til kontroll; ikke bruk koeffisientene i tilpasningen.
true_coordinates = reference_coordinates(n)
exact_values = cheb.chebval(points, true_coordinates)
rng = np.random.default_rng(seed)
measurements = exact_values + noise_size*rng.standard_normal(m)

# Et tett rutenett gjør det mulig å kontrollere også mellom målepunktene.
grid = np.linspace(-1.0, 1.0, 1001)
reference_curve = cheb.chebval(grid, true_coordinates)

# TODO: Lag C, og finn koeffisientene med qr_solution(C, measurements).
# TODO: Beregn residualen og den tilpassede kurven på grid.
# TODO: Registrer kontrolltall og tegn målinger, referanse og tilpasset kurve.
```

1. Hvor mange ligninger og ukjente har du? Beregn første rad i $C$
   for hånd, og kontroller den mot koden.
2. Gjennomfør tilpasningen. Registrer residualnormen og den største
   absolutte forskjellen mellom tilpasset kurve og referanse på `grid`.
   Hvorfor må begge størrelsene undersøkes?
3. Hold $m=12$ fast og prøv `noise_size` lik $0$, $10^{-3}$ og $10^{-2}$.
   Hva endrer seg i tilpasningen og kontrolltallene?
4. Hold støystørrelsen på $10^{-3}$ og sammenlign $m=8,16,32$.
   Gjenta med frøene $2026,2027,2028$. Er konklusjonen om flere målinger
   den samme i alle forsøkene?

Når antallet målinger varierer, rapporter også
$\lVert r\rVert_2/\sqrt m$: kvadrer avvikene, ta gjennomsnittet og deretter
kvadratroten. Dette gir et mål på avvik per måling. Bruk én liten tabell
til å sammenligne forsøkene; du trenger ikke en figur for hvert frø.

### 4. Samme målinger, to forskjellige basiser

**Gitt:** ett polynomrom, ett sett punkter og én målevektor.
**Undersøk:** Har basisvalget betydning for den beregnede kurven?

Monomialmatrisen $M$ har kolonnene $1,x,\ldots,x^n$ evaluert ved
målepunktene; Chebyshev-matrisen $C$ har kolonnene $T_0,\ldots,T_n$.
Begge beskriver polynomer av grad høyst $n$.
Koeffisientene har ulik betydning, så hver vektor må brukes med riktig
basis når du beregner kurven.

```{pyodide-python}
#| label: project-week4-basis-comparison

# Begge basiser skal få nøyaktig de samme dataene.
n = 12
m = 25
points = np.linspace(-1.0, 1.0, m)
true_chebyshev = reference_coordinates(n)
exact_values = cheb.chebval(points, true_chebyshev)
rng = np.random.default_rng(2026)
noise = 1e-10*rng.standard_normal(m)
b_noisy = exact_values + noise

M = monomial_matrix(points, n)
C = chebyshev_matrix(points, n)
grid = np.linspace(-1.0, 1.0, 2001)
reference = cheb.chebval(grid, true_chebyshev)

# TODO: Tilpass de samme målingene med M og C. Bruk samme QR-metode.
# TODO: Evaluer M-koeffisienter med poly.polyval og C-koeffisienter med cheb.chebval.
# TODO: Sammenlign kurvene med referansen, også mellom målepunktene.
# M, C og b_noisy brukes videre i fordypningsdelene.
```

1. Skriv først hva du forventer: Ville de beste modellverdiene ved
   målepunktene vært like med de to basisene i eksakt regning? Begrunn.
2. Beregn tilpasningene med modifisert GS, og lag én figur av
   absolutt kurvefeil for hver basis. Registrer også residualnorm,
   ortogonalitetsfeil og relativ faktoriseringsfeil.
3. Gjenta med de støyfrie verdiene `exact_values`. Hvor mye endres hver
   beregnet kurve når den lille støyen legges til?
4. Bruk `lstsq` på de samme to matrisene som kontroll. Hva tyder
   resultatene på om effekten av måledata, basisvalg og beregningsmetode?
   Ikke anta at én basis alltid gir den beste kurven.

Selv om forskjellige punkter gir uavhengige modellkolonner på papir,
kan små endringer i målinger eller avrundinger påvirke beregningen mye.
I denne delen beskriver du følsomheten med de endringene du faktisk
måler. Du trenger ikke et nytt matrisebegrep for å gjøre det.

::: {.callout-note collapse="true"}
## Kontrolltall til tabellen

`method_report` beregner residualnorm og avvik per måling.
Hvis du også gir funksjonen $Q,R$, får du:

| Kontroll | Hva som undersøkes |
|---|---|
| $\lVert Q^TQ-I\rVert_F$ | Hvor godt de beregnede kolonnene er ortonormale |
| $\lVert A-QR\rVert_F/\lVert A\rVert_F$ | Hvor godt produktet gjengir matrisen det startet med |
| `alle_endelige` | Om koeffisienter, residual og faktorer inneholder ugyldige verdier |

Bruk henholdsvis $M$ og $C$ som $A$ i kontrollene. En liten verdi
i én kolonne erstatter ikke de andre kontrollene.
:::

## Velg én fordypning

Del 5 undersøker selve ortogonaliseringen. Del 6 undersøker en annen
måte å løse tilpasningsproblemet på. Begge bruker forsøket fra del 4
som utgangspunkt.

### 5. Når betyr GS-varianten noe?

Sammenlign klassisk GS, modifisert GS og `lstsq` for gradene
$n=8,12,16,20$. Bruk $m=2(n+1)+1$ jevnt fordelte målepunkter,
samme referansepolynom for begge basiser ved hver grad og støy av
størrelse $10^{-10}$ med fast frø.

```{pyodide-python}
#| label: project-week4-cgs-mgs

degrees = [8, 12, 16, 20]
methods = [
    ("klassisk GS", classical_gram_schmidt),
    ("modifisert GS", modified_gram_schmidt),
]
results = []

# TODO: Lag nye data, M og C for hver grad, etter mønsteret i del 4.
# TODO: Bruk begge GS-metodene på begge matrisene, og lagre kontrolltall.
# TODO: Sammenlign modellverdier og kurvefeil med lstsq på de samme dataene.
# TODO: Registrer en stopp eller ugyldige verdier; ikke ta dem med som vanlige datapunkter.
```

Lever en tabell og et plott av ortogonalitetsfeil mot grad.
Velg så **ett** resultat som du undersøker nærmere:

- Er en liten faktoriseringsfeil tilstrekkelig til å stole på $Q$?
- Følger endringer i ortogonalitetsfeilen endringene i kurvefeilen?
- Er metodeforskjellen den samme i begge basiser?

Konklusjonen skal vise til egne tall. Unngå å formulere en generell
garanti ut fra ett forsøk.

### 6. Hva endrer normalligningene?

Fra residualbetingelsen $A^T(b-Ac)=0$ kan du samle de ukjente i et
kvadratisk system.

1. Skriv dette systemet selv. Hvilke dimensjoner får matrisen og høyresiden?
2. Implementer løsningen med `np.linalg.solve`.
3. Sammenlign med QR og `lstsq`, først for grad $12$, deretter for
   $16$ og $20$. Bruk samme data som i del 4 og
   $m=2(n+1)+1$ for hver grad.

#### Et mål på følsomhet, når vi trenger det

**Kondisjonstallet** beskriver hvor ulikt matrisen skalerer
koeffisientvektorer i forskjellige retninger. Et stort tall varsler at
noen endringer i koeffisientene er vanskelige å skille fra hverandre i
modellverdiene. Da kan små endringer i data eller avrundinger få stor
betydning for de beregnede koeffisientene.

Vi bruker varianten som skrives $\kappa_2(A)$ og beregnes med
`np.linalg.cond(A)`. Verdier nær $1$ betyr jevn skalering;
svært store verdier varsler følsomhet. Tallet er **ikke** den faktiske
feilen i koeffisientene eller i den tilpassede kurven.

::: {.callout-note collapse="true"}
## Hva betyr senket 2 og spektralnorm?

Senket $2$ viser at vi bruker vanlig euklidsk vektorlengde.
For en matrise definerer vi

$$\lVert A\rVert_2=\max_{\lVert z\rVert_2=1}\lVert Az\rVert_2.$$

Dette kalles **spektralnormen**: den største faktoren matrisen kan
forstørre vektorlengden med. Når kolonnene er lineært uavhengige, er

$$\kappa_2(A)=
\frac{\max_{\lVert z\rVert_2=1}\lVert Az\rVert_2}
{\min_{\lVert z\rVert_2=1}\lVert Az\rVert_2}.$$

Det er altså forholdet mellom den største og den minste skaleringen.
Dette er en annen matrisenorm enn Frobeniusnormen vi bruker til
QR-kontrollene. Du trenger ikke beregne disse maksimums- og
minimumsverdiene selv.

**Et frampek til [uke 5](uke5.qmd):** Egenverdier beskriver hvordan en
kvadratisk matrise skalerer vektorer langs bestemte retninger,
kalt egenvektorretninger. Her er forbindelsen gjennom $A^TA$,
som er kvadratisk selv om $A$ er rektangulær.

Den største og minste egenverdien til $A^TA$ er kvadratene av den
største og minste skaleringen til $A$. Skriver vi disse egenverdiene
som $\lambda_{\max}$ og $\lambda_{\min}$, får vi

$$\lVert A\rVert_2=\sqrt{\lambda_{\max}},\qquad
\kappa_2(A)=\sqrt{\frac{\lambda_{\max}}{\lambda_{\min}}}.$$

Her er $\lambda_{\min}>0$ fordi kolonnene i $A$ er lineært uavhengige.
Dette knytter følsomheten til stoffet om egenverdier som kommer neste
uke. I dette prosjektet bruker du fortsatt $\kappa_2(A)$ som et
følsomhetsvarsel og beregner tallet med `np.linalg.cond(A)`.
:::

```{pyodide-python}
#| label: project-week4-normal-equations

# Kjør først del 4 for å opprette M, C og b_noisy.
# Disse tallene er varsler om følsomhet, ikke målinger av kurvefeilen.
for name, matrix in [("monomial", M), ("Chebyshev", C)]:
    print(name)
    print("kondisjonstall for A:    ", np.linalg.cond(matrix))
    print("kondisjonstall for A.T@A:", np.linalg.cond(matrix.T @ matrix))

# TODO: Løs systemet du utledet, og kontroller at løsningen er endelig.
# TODO: Sammenlign residual og kurvefeil med QR og lstsq.
# TODO: Gjenta etter å ha endret graden og laget alle dataene på nytt.
```

For uavhengige kolonner gjelder
$\kappa_2(A^TA)=\kappa_2(A)^2$ i eksakt regning.
Bruk dette som støtte når du tolker forsøket: Hvilken sammenheng
ser du mellom følsomhetsvarselet og feilen du faktisk målte?
Flyttallsberegnede kondisjonstall kan avvike fra identiteten,
særlig når tallene blir svært store.

::: {.callout-tip collapse="true"}
## Hint til systemet

Fordel $A^T$ over parentesen og flytt leddet med $c$ til den andre siden.
Systemet har $A^TA$ som matrise. Bruk koden fra del 2 som mønster for å
registrere en eventuell `LinAlgError` uten å avbryte resten av forsøket.
:::

## Selvstendig redningsforsøk og rapport

### 7. Gjør én begrunnet forbedring

Ta utgangspunkt i et forsøk fra den valgte fordypningen der resultatet
var mindre pålitelig enn bibliotekets løsning. Hvis du ikke fant en
tydelig forskjell, prøv grad $24$ med $51$ jevnt fordelte punkter og
klassisk GS i monomialbasis. Kontroller resultatet før du velger tiltak.

Velg **én** endring: metode, basis, polynomgrad, antall målinger eller
plassering av målepunktene. Skriv hvorfor du forventer forbedring,
og gjennomfør et før-og-etter-forsøk.

Hold referansepolynomet fast, også om du endrer modellgraden.
Hvis du endrer målepunktene, lag nye målinger av den samme referansen
med samme støystørrelse og fast frø. Bruk minst $n+3$ forskjellige
punkter, modellgrad høyst $25$ og støy høyst $10^{-8}$.
`chebyshev_points(m)` gir $m$ cosinusfordelte punkter i $[-1,1]$;
argumentet er antallet punkter, ikke graden.

Rapporter residualnorm, avvik per måling, største kurvefeil på minst
2001 kontrollpunkter og QR-kontrollene når metoden gir $Q,R$.
Dersom du endrer antall målinger eller modellgrad, forklar også hva
som gjør sammenligningen rettferdig.

**Målet er en dokumentert forbedring.** Hvis tiltaket ikke hjelper,
skal du vise det og begrunne hva du ville undersøkt videre.

### Dette skal leveres

Lever én Quarto-side eller notebook med kjørbar kode.
Figurer skal ha aksetitler og en forklaring av hva som sammenlignes.
Samle kontrolltall i tabeller, og skill tydelig mellom egne forventninger,
observerte resultater og konklusjoner.

| Omfang | Leveranse |
|---|---|
| **Bare kjerne** | Resultater og korte begrunnelser fra del 1–4 |
| **Hele prosjektet** | Kjernen, valgt del 5 eller 6, før-og-etter-forsøket i del 7 og en analyse på 400–600 ord |

Analysen skal bruke konkrete resultater til å svare på:

- Når skyldes avviket at modellen ikke passer målingene, og når tyder
  kontrollene på problemer i beregningen?
- Hva forteller residual, ortogonalitet og kurvefeil hver for seg?
- Hva endret du i redningsforsøket, og hvilke resultater støtter vurderingen?
- Hvilken begrensning ved forsøket gjør at du bør være forsiktige med
  å generalisere?

::: {.callout-note}
## Bruk av kodeassistenter

Du kan få hjelp med syntaks, men skal kunne forklare egne forsøk.
Kontroller at metodene får samme data, og noter hvilke variabler du
endret. Automatisk generert kode eller en utskrift alene er ikke en
faglig begrunnelse.
:::
