# Når målingene ikke passer: ortogonal redningsaksjon

Dette prosjektet er et utkast for omtrent **4–5 timer selvstendig arbeid**.
Det bygger videre på polynomene, basisene og avlesningsmatrisene fra uke 3,
men siden er selvstendig: Alle funksjoner du trenger, er definert her. Du skal
ikke kopiere kode fra forrige prosjekt.

I uke 3 brukte vi $n+1$ polynomverdier til å rekonstruere ett polynom i
$\mathcal P_n$. Nå har vi flere målinger enn koeffisienter, og målingene
inneholder støy. Da finnes det vanligvis ikke et polynom som passer alle
verdiene eksakt.

Hovedspørsmålet er:

> **Hvordan finner vi den beste tilpasningen, og hvordan oppdager vi at
> algoritmen mister ortogonalitet eller bryter sammen?**

## Arbeidsmåte

For hvert hovedforsøk:

1. skriv hva du forventer før du kjører;
2. endre bare én egenskap om gangen;
3. kontroller dimensjoner, rang og at alle tall er endelige;
4. mål både residual og ortogonalitet;
5. forklar resultatet med indreprodukt, projeksjon og nesten avhengighet.

En figur er data, ikke en forklaring. Noter alltid grad, punkter,
støystørrelse og metode sammen med resultatet.

```{pyodide-python}
#| label: project-week4-setup
#| autorun: true
#| context: setup

import numpy as np
import matplotlib.pyplot as plt
from numpy.polynomial import polynomial as poly
from numpy.polynomial import chebyshev as cheb

# De samme avlesningsmatrisene som i uke 3, ferdigstilt her slik at dette
# prosjektet ikke avhenger av kode i en annen nettleserside.
def monomial_matrix(points, n):
    """Avlesningsmatrise for basisen (1, x, ..., x^n)."""
    points = np.asarray(points, dtype=float)
    powers = np.arange(n+1)
    return points[:, None]**powers[None, :]


def chebyshev_matrix(points, n):
    """Avlesningsmatrise for basisen (T_0, ..., T_n)."""
    return cheb.chebvander(np.asarray(points, dtype=float), n)


def chebyshev_points(n):
    """De n+1 cosinusfordelte punktene brukt i uke 3."""
    k = np.arange(n+1)
    return np.cos((2*k+1)*np.pi/(2*(n+1)))


def reference_coordinates(n):
    """Moderate, deterministiske koordinater i Chebyshev-basis."""
    k = np.arange(n+1)
    return (-1.0)**k/(k+1.0)**2


def classical_gram_schmidt(A):
    """Klassisk GS uten rangkontroll, brukt for å framprovosere feil."""
    A = np.asarray(A, dtype=float)
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    for j in range(n):
        coefficients = Q[:, :j].T @ A[:, j]
        R[:j, j] = coefficients
        v = A[:, j] - Q[:, :j] @ coefficients
        R[j, j] = np.linalg.norm(v)
        Q[:, j] = v/R[j, j]
    return Q, R


def modified_gram_schmidt(A, tolerance=None):
    """Modifisert GS med eksplisitt kontroll av små nye retninger."""
    A = np.asarray(A, dtype=float)
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    if tolerance is None:
        tolerance = np.finfo(float).eps*max(m, n)*np.linalg.norm(A)
    for j in range(n):
        v = A[:, j].copy()
        for i in range(j):
            R[i, j] = Q[:, i] @ v
            v = v-R[i, j]*Q[:, i]
        R[j, j] = np.linalg.norm(v)
        if R[j, j] <= tolerance:
            raise np.linalg.LinAlgError(
                f"Kolonne {j+1} gir ingen pålitelig ny retning"
            )
        Q[:, j] = v/R[j, j]
    return Q, R


def qr_solution(A, b, qr_method=modified_gram_schmidt):
    """Minste-kvadraters løsning fra en tynn QR-faktorisering."""
    Q, R = qr_method(A)
    return np.linalg.solve(R, Q.T@b), Q, R


def method_report(name, A, b, x, Q=None, R=None):
    """Samle kontroller som ellers er lette å glemme."""
    residual = b-A@x
    report = {
        "metode": name,
        "endelig": bool(np.isfinite(x).all()),
        "residual": float(np.linalg.norm(residual)),
        "normaltest": float(np.linalg.norm(A.T@residual)),
    }
    if Q is not None and R is not None:
        report["ortogonalitetsfeil"] = float(
            np.linalg.norm(Q.T@Q-np.eye(Q.shape[1]))
        )
        report["faktoriseringsfeil"] = float(np.linalg.norm(A-Q@R))
    return report
```

## 1. Start lett: en linje som ikke treffer alle punktene

Vi tilpasser

$$p(t)=c_0+c_1t$$

til seks målinger. Systemet $Ac=b$ er på papir

$$
\underbrace{\begin{bmatrix}
1&-1.0\\
1&-0.6\\
1&-0.2\\
1& 0.2\\
1& 0.6\\
1& 1.0
\end{bmatrix}}_{A\in\mathbb R^{6\times2}}
\underbrace{\begin{bmatrix}c_0\\c_1\end{bmatrix}}_{c\in\mathbb R^2}
=
\underbrace{\begin{bmatrix}
-0.12\\0.34\\0.68\\1.32\\1.55\\2.18
\end{bmatrix}}_{b\in\mathbb R^6}.
$$

To parametre kan ikke vanligvis oppfylle seks støyfylte ligninger samtidig.
Kjør cellen, og sammenlign residualene for tre selvvalgte linjer med
`numpy.linalg.lstsq`.

```{pyodide-python}
#| label: project-week4-first-fit

t = np.linspace(-1.0, 1.0, 6)
b = np.array([-0.12, 0.34, 0.68, 1.32, 1.55, 2.18])
A = np.column_stack([np.ones_like(t), t])

candidates = [
    np.array([1.0, 1.0]),
    np.array([0.9, 1.1]),
    np.array([1.1, 0.8]),
]
c_star, _, _, _ = np.linalg.lstsq(A, b, rcond=None)

for c in candidates+[c_star]:
    print(c, "  ||Ac-b|| =", np.linalg.norm(A@c-b))

grid = np.linspace(-1.05, 1.05, 300)
plt.scatter(t, b, color="black", label="målinger")
plt.plot(grid, c_star[0]+c_star[1]*grid, label="lstsq")
plt.xlabel("t"); plt.ylabel("målt verdi")
plt.title("Ingen eksakt linje, men én beste tilpasning")
plt.grid(alpha=0.25); plt.legend(); plt.show()
```

Svar kort:

1. Hvorfor kan ikke `np.linalg.solve(A, b)` brukes direkte her?
2. Fant du en kandidat med mindre residualnorm enn `lstsq`?
3. Betyr en ikke-null residual at algoritmen har mislyktes?

## 2. Hva kjennetegner den beste residualen?

Definer

$$c_*=\operatorname*{argmin}_c\lVert Ac-b\rVert_2,
\qquad r=b-Ac_*.$$

Kolonnene i $A$ er

$$a_1=\begin{bmatrix}1\\1\\1\\1\\1\\1\end{bmatrix},\qquad
a_2=\begin{bmatrix}-1\\-0.6\\-0.2\\0.2\\0.6\\1\end{bmatrix}.$$

Hvis $r$ fortsatt hadde en komponent langs $a_1$ eller $a_2$, kunne vi
endre en koeffisient og redusere residualen. Ved minimum forventer vi derfor

$$a_1^Tr=0,\qquad a_2^Tr=0,$$

eller samlet

$$\boxed{A^Tr=0.}$$

```{pyodide-python}
#| label: project-week4-residual-test

c_star, _, _, _ = np.linalg.lstsq(A, b, rcond=None)
r = b-A@c_star
print("c_* =", c_star)
print("r =", r)
print("A^T r =", A.T@r)

deltas = np.linspace(-0.4, 0.4, 101)
errors_c0 = [np.linalg.norm(A@(c_star+np.array([d, 0]))-b)
             for d in deltas]
errors_c1 = [np.linalg.norm(A@(c_star+np.array([0, d]))-b)
             for d in deltas]
plt.plot(deltas, errors_c0, label="endre bare c0")
plt.plot(deltas, errors_c1, label="endre bare c1")
plt.axvline(0, color="black", linewidth=0.8)
plt.xlabel("endring fra c_*"); plt.ylabel("residualnorm")
plt.title("Små endringer i hver koordinat gjør tilpasningen dårligere")
plt.grid(alpha=0.25); plt.legend(); plt.show()
```

Forklar hvorfor nullpunktet i $A^Tr$ handler om ortogonalitet, mens
$\lVert r\rVert$ vanligvis ikke er null.

## 3. Løs det samme problemet med QR

En tynn QR-faktorisering av $A\in\mathbb R^{m\times n}$ er

$$
A=QR,
\qquad
Q\in\mathbb R^{m\times n},
\qquad
R\in\mathbb R^{n\times n},
\qquad
Q^TQ=I.
$$

Minste-kvadraters koeffisienter finnes fra

$$\boxed{Rc=Q^Tb.}$$

Kjør begge Gram–Schmidt-variantene på den lille designmatrisen. De bør være
enige her fordi kolonnene er tydelig uavhengige.

```{pyodide-python}
#| label: project-week4-small-qr

c_cgs, Qc, Rc = qr_solution(A, b, classical_gram_schmidt)
c_mgs, Qm, Rm = qr_solution(A, b, modified_gram_schmidt)
c_lib, _, _, _ = np.linalg.lstsq(A, b, rcond=None)

print(method_report("klassisk GS", A, b, c_cgs, Qc, Rc))
print(method_report("modifisert GS", A, b, c_mgs, Qm, Rm))
print(method_report("lstsq", A, b, c_lib))
```

Kontroller spesielt at en liten residualnorm og en liten
ortogonalitetsfeil er to forskjellige tester.

## 4. Framprovoser `NaN`

Matrisen

$$
B=\begin{bmatrix}
1&0&1\\
0&1&1\\
0&0&0\\
0&0&0
\end{bmatrix}
$$

har $b_3=b_1+b_2$. Klassisk Gram–Schmidt bør derfor få nullvektoren når
den tredje kolonnen renses.

```{pyodide-python}
#| label: project-week4-dependent-nan

B = np.array([[1.0, 0.0, 1.0],
              [0.0, 1.0, 1.0],
              [0.0, 0.0, 0.0],
              [0.0, 0.0, 0.0]])

with np.errstate(divide="warn", invalid="warn"):
    Q_bad, R_bad = classical_gram_schmidt(B)

print("rang(B) =", np.linalg.matrix_rank(B))
print("diagonal(R) =", np.diag(R_bad))
print("Q =\n", Q_bad)
print("alle tall endelige?", np.isfinite(Q_bad).all())

try:
    modified_gram_schmidt(B)
except np.linalg.LinAlgError as error:
    print("Kontrollert stopp:", error)
```

Skriv en forklaring som begynner med kolonnerelasjonen $b_3=b_1+b_2$ og
slutter med den konkrete divisjonen som produserer `NaN`. «Python liker ikke
matrisen» er ikke en forklaring.

## 5. Gå tilbake til polynomene fra uke 3

For et polynom

$$p(x)=c_0T_0(x)+\cdots+c_nT_n(x)$$

og målepunkter $x_0,\ldots,x_{m-1}$ er Chebyshev-avlesningsmatrisen

$$
C=\begin{bmatrix}
T_0(x_0)&T_1(x_0)&\cdots&T_n(x_0)\\
T_0(x_1)&T_1(x_1)&\cdots&T_n(x_1)\\
\vdots&\vdots&&\vdots\\
T_0(x_{m-1})&T_1(x_{m-1})&\cdots&T_n(x_{m-1})
\end{bmatrix}.
$$

I uke 3 brukte vi $m=n+1$ og løste et kvadratisk interpolasjonsproblem. Nå
bruker vi $m>n+1$ og legger til målestøy.

Start med grad $3$ og tolv målinger. Alle nødvendige funksjoner er allerede
definert på denne siden.

```{pyodide-python}
#| label: project-week4-polynomial-fit

n = 3
m = 12
points = np.linspace(-1.0, 1.0, m)
true_coordinates = reference_coordinates(n)
exact_values = cheb.chebval(points, true_coordinates)

rng = np.random.default_rng(2026)
noise_size = 1e-3
noise = noise_size*rng.standard_normal(m)
measurements = exact_values+noise

C = chebyshev_matrix(points, n)
recovered, Q, R = qr_solution(C, measurements)
residual = measurements-C@recovered

grid = np.linspace(-1.0, 1.0, 1001)
reference_curve = cheb.chebval(grid, true_coordinates)
fitted_curve = cheb.chebval(grid, recovered)

print("form(C) =", C.shape, " rang(C) =", np.linalg.matrix_rank(C))
print("||r|| =", np.linalg.norm(residual))
print("||C^T r|| =", np.linalg.norm(C.T@residual))
print("||Q^TQ-I|| =", np.linalg.norm(Q.T@Q-np.eye(n+1)))

plt.scatter(points, measurements, color="black", s=25, label="målinger")
plt.plot(grid, reference_curve, "--", label="referanse")
plt.plot(grid, fitted_curve, label="tilpasset polynom")
plt.xlabel("x"); plt.ylabel("p(x)")
plt.title("Flere støyfylte målinger enn koeffisienter")
plt.grid(alpha=0.25); plt.legend(); plt.show()
```

Endre først bare `noise_size`, deretter bare `m`. Hvordan påvirkes
residualen og feilen i den tilpassede kurven? Hvorfor bør residualen ofte
vokse når vi legger til flere målinger, selv om tilpasningen kan bli mer
pålitelig?

## 6. Hold punktene fast og bytt basis

Som i uke 3 bruker vi samme polynom, punkter og målinger i begge systemene.
Bare kolonnene endres:

$$
M_{ij}=x_i^j,
\qquad
C_{ij}=T_j(x_i).
$$

Vi sammenligner nå grad $12$ med $25$ målinger.

```{pyodide-python}
#| label: project-week4-basis-comparison

n = 12
m = 25
points = np.linspace(-1.0, 1.0, m)
true_chebyshev = reference_coordinates(n)
exact_values = cheb.chebval(points, true_chebyshev)
rng = np.random.default_rng(2026)
noise = 1e-10*rng.standard_normal(m)
b_noisy = exact_values+noise

M = monomial_matrix(points, n)
C = chebyshev_matrix(points, n)
xM, QM, RM = qr_solution(M, b_noisy)
xC, QC, RC = qr_solution(C, b_noisy)
xM_lib, _, _, _ = np.linalg.lstsq(M, b_noisy, rcond=None)
xC_lib, _, _, _ = np.linalg.lstsq(C, b_noisy, rcond=None)

print("kappa(M) =", np.linalg.cond(M))
print("kappa(C) =", np.linalg.cond(C))
print(method_report("M, MGS", M, b_noisy, xM, QM, RM))
print(method_report("C, MGS", C, b_noisy, xC, QC, RC))
print(method_report("M, lstsq", M, b_noisy, xM_lib))
print(method_report("C, lstsq", C, b_noisy, xC_lib))

grid = np.linspace(-1.0, 1.0, 2001)
reference = cheb.chebval(grid, true_chebyshev)
curve_M = poly.polyval(grid, xM)
curve_C = cheb.chebval(grid, xC)
plt.semilogy(grid, np.maximum(abs(curve_M-reference), 1e-18), label="monomial")
plt.semilogy(grid, np.maximum(abs(curve_C-reference), 1e-18), label="Chebyshev")
plt.xlabel("x"); plt.ylabel("absolutt kurvefeil")
plt.title("Samme data og polynom, forskjellig basis")
plt.grid(alpha=0.25); plt.legend(); plt.show()
```

Forklar hvilke størrelser som kan sammenlignes på tvers av basisene. Husk at
koeffisient nummer $j$ betyr noe forskjellig i de to basisene.

## 7. Klassisk eller modifisert Gram–Schmidt?

Bruk samme $M$ og $C$ som over. Faktoriser hver matrise både med klassisk og
modifisert Gram–Schmidt. Samle resultatene i en tabell med

$$
\lVert Q^TQ-I\rVert_2,
\qquad
\lVert A-QR\rVert_2,
\qquad
\lVert Ax-b\rVert_2,
\qquad
\lVert A^T(Ax-b)\rVert_2.
$$

```{pyodide-python}
#| label: project-week4-cgs-mgs

for matrix_name, matrix in [("M", M), ("C", C)]:
    for method_name, method in [
        ("klassisk GS", classical_gram_schmidt),
        ("modifisert GS", modified_gram_schmidt),
    ]:
        try:
            x, Q, R = qr_solution(matrix, b_noisy, method)
            print(matrix_name, method_report(method_name, matrix, b_noisy,
                                             x, Q, R))
        except np.linalg.LinAlgError as error:
            print(matrix_name, method_name, "stoppet:", error)
```

Øk graden gjennom $n=8,12,16,20$, men behold omtrent dobbelt så mange
målinger som koeffisienter. Lag et plott av ortogonalitetsfeilen mot graden.
Ikke fortsett blindt etter at en metode returnerer `NaN` eller stopper.

## 8. Normalligningene som sammenligningsmetode

Fra ortogonalitetsbetingelsen

$$A^T(b-Ax)=0$$

får vi normalligningene

$$\boxed{A^TAx=A^Tb.}$$

De er matematisk riktige når $A$ har full kolonnerang, men produktet
$A^TA$ har omtrent kvadrert kondisjonstall:

$$\kappa_2(A^TA)=\kappa_2(A)^2.$$

```{pyodide-python}
#| label: project-week4-normal-equations

def normal_equation_solution(A, b):
    return np.linalg.solve(A.T@A, A.T@b)

for name, matrix in [("monomial", M), ("Chebyshev", C)]:
    x_normal = normal_equation_solution(matrix, b_noisy)
    x_lstsq, _, _, _ = np.linalg.lstsq(matrix, b_noisy, rcond=None)
    print("\n", name)
    print("kappa(A)    =", np.linalg.cond(matrix))
    print("kappa(A^TA) =", np.linalg.cond(matrix.T@matrix))
    print(method_report("normal", matrix, b_noisy, x_normal))
    print(method_report("lstsq", matrix, b_noisy, x_lstsq))
```

Forklar hvorfor en liten residual alene ikke beviser at de beregnede
koeffisientene er pålitelige.

## 9. Åpen utfordring: redd en rekonstruksjon

Lag ett vanskelig, men reproduserbart minste-kvadraters problem. Du kan
endre én av disse egenskapene om gangen:

- graden, høyst $25$;
- antallet målepunkter;
- plasseringen av målepunktene i $[-1,1]$;
- monomial- eller Chebyshev-basis;
- størrelsen på støyen, høyst $10^{-8}$.

Start med et referansepolynom fra `reference_coordinates`. Bruk minst
$n+3$ forskjellige målepunkter og et fast tilfeldig frø. Finn først en
konfigurasjon der klassisk GS eller normalligningene gir tydelig dårligere
diagnostikk enn `lstsq`. Gjør deretter **én** begrunnet endring som forbedrer
rekonstruksjonen.

Rapporter før og etter:

1. $m,n$, punkter og støystørrelse;
2. $\kappa_2(A)$;
3. om alle resultater er endelige;
4. residualnorm og normaltest;
5. ortogonalitetsfeil når metoden produserer $Q$;
6. største kurvefeil på et rutenett med minst 2001 punkter.

Målet er ikke størst mulig feil. Målet er en kontrollert diagnose og en
forbedring du kan forklare.

## Samlet analyse

Skriv en sammenhengende analyse på omtrent **400–600 ord**. Skill mellom:

- ingen eksakt løsning og en dårlig numerisk løsning;
- eksakt avhengighet og nesten avhengighet;
- residualfeil og ortogonalitetsfeil;
- matematisk QR-faktorisering og algoritmen som beregner den;
- effekten av basisvalg og effekten av punktplassering.

Besvar også:

1. Hvor oppstod `NaN`, og hvilken matematisk hendelse kom først?
2. I hvilket forsøk var alle tall endelige, men resultatet likevel
   upålitelig?
3. Når ga klassisk og modifisert GS synlig forskjellige resultater?
4. Hvordan bygget dette prosjektet videre på «blindsonen» fra uke 3?
5. Hvilken forbedring valgte du i den åpne utfordringen, og hvorfor virket
   den?

## Dette skal leveres

Lever én Quarto-side eller notebook med:

1. den første linjetilpasningen og tolkning av residualen;
2. kontrollen $A^Tr\approx0$;
3. QR-diagnostikk for det lille problemet;
4. `NaN`-eksperimentet med årsakskjede;
5. polynomtilpasningen av grad $3$;
6. sammenligning av monomial- og Chebyshev-basis;
7. plottet av CGS- og MGS-ortogonalitetsfeil mot grad;
8. sammenligning med normalligningene og `lstsq`;
9. før-og-etter-resultatet fra den åpne utfordringen;
10. den samlede analysen.

::: {.callout-warning}
## Kodeassistenter og numeriske påstander

Kodeassistenter kan foreslå syntaks, men du er ansvarlig for at to metoder
får nøyaktig samme data når de sammenlignes. En utskrift fra `lstsq` eller
`qr` er ikke en forklaring. Kontroller dimensjoner, rang, residual,
ortogonalitet og endelige tall, og oppgi hvilke variabler du endret.
:::
