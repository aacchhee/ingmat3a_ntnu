# Prosjekt 4 – Når målingene ikke passer

Dette prosjektet er et utkast for omtrent **4–5 timer selvstendig arbeid**.
Det bygger videre på polynomene, basisene og avlesningsmatrisene fra uke 3,
men siden er selvstendig: Alle funksjoner du trenger, er definert her. Du skal
ikke kopiere kode fra forrige prosjekt.

[Uke 4: Ortogonalitet, QR og minste kvadrater](uke4.qmd) gir den interaktive
veien inn i stoffet, men definisjonene som trengs gjentas nedenfor. Trenger du
å repetere basis, kolonnerom eller polynomavlesninger, bruk
[uke 3](uke3.qmd) og [prosjekt 3](project_week3.qmd).

I uke 3 brukte vi $n+1$ polynomverdier til å rekonstruere ett polynom i
$\mathcal P_n$. Nå har vi flere målinger enn koeffisienter, og målingene
inneholder støy. Da finnes det vanligvis ikke et polynom som passer alle
verdiene eksakt.

Hovedspørsmålet er:

> **Hvordan finner vi den beste tilpasningen, og hvordan oppdager vi at
> algoritmen mister ortogonalitet eller bryter sammen?**

Her er notasjonen vi trenger. Polynomrommet

$$\mathcal P_n=\{c_0+c_1x+\cdots+c_nx^n:c_j\in\mathbb R\}$$

har dimensjon $n+1$. Vi lagrer alltid koordinatene i stigende grad:

$$c=\begin{bmatrix}c_0&c_1&\cdots&c_n\end{bmatrix}^T.$$

Chebyshev-polynomene er definert ved

$$T_0(x)=1,\qquad T_1(x)=x,\qquad
T_{j+1}(x)=2xT_j(x)-T_{j-1}(x).$$

For $m$ forskjellige målepunkter og grad $n$ får både monomial- og
Chebyshev-matrisen form $m\times(n+1)$. Når $m\ge n+1$, gir forskjellige
punkter full kolonnerang i eksakt matematikk. Det utelukker ikke at matrisen
kan være numerisk dårlig kondisjonert.

Med en **blindsone** mener vi her en perturbasjon som er liten ved
målepunktene, men som gir mye større endring mellom punktene. Uke 4 spør
hvordan flere målinger, et annet basisvalg eller en annen løsningsmetode kan
redusere denne effekten.

For vektorer $u,v\in\mathbb R^m$ er

$$u^Tv=\sum_{i=1}^m u_iv_i,\qquad
\lVert u\rVert_2=\sqrt{u^Tu}.$$

Vektorene er ortogonale når $u^Tv=0$. Hvis $Q$ har ortonormale kolonner,
betyr $Q^TQ=I$, og $QQ^Tb$ er projeksjonen av $b$ på kolonnerommet $C(Q)$.
For matrisediagnostikk bruker vi Frobeniusnormen
$\lVert A\rVert_F=(\sum_{ij}a_{ij}^2)^{1/2}$; NumPys norm uten ekstra
argument bruker denne normen på matriser. Kondisjonstall skrives
$\kappa_2(A)$ og bruker spektralnormen.

## Omfang og tidsbruk

| Løype | Deler | Omtrent |
|---|---|---:|
| **Kjerne** | 1–6: residual, QR, kontrollert sammenbrudd og polynomtilpasning | 2 t 45 min |
| **Utvidelse** | 7–9: algoritmesveip, normalligninger og egen redningsaksjon | 1 t 15 min |
| **Analyse og rydding** | figurer, tabell og 400–600 ord | 45 min |

Gjør kjerneløypa i rekkefølge. Del 1 lager variablene A og b som del
2–4 bruker. Del 5 lager polynomvariablene; del 6 lager M, C og b_noisy
som del 7–8 bruker. Hvis du åpner siden på nytt, kjør derfor cellene fra
start og nedover.

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

# Felles verktøy for dette prosjektet; kjør denne cellen først.
# Funksjonene er samlet her slik at prosjektet kan brukes uten andre sider.
import numpy as np
import matplotlib.pyplot as plt
from numpy.polynomial import polynomial as poly
from numpy.polynomial import chebyshev as cheb

# De samme avlesningsmatrisene som i uke 3, ferdigstilt her slik at dette
# prosjektet ikke avhenger av kode i en annen nettleserside.
def monomial_matrix(points, n):
    """Avlesningsmatrise for basisen (1, x, ..., x^n)."""
    points = np.asarray(points, dtype=float)
    # Grad n gir n+1 basisfunksjoner, inkludert konstantleddet.
    powers = np.arange(n+1)
    # Rad i er punkt i; kolonne j er punktet opphøyd i j. None gjør formene kompatible.
    return points[:, None]**powers[None, :]


def chebyshev_matrix(points, n):
    """Avlesningsmatrise for basisen (T_0, ..., T_n)."""
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


def method_report(name, A, b, x, Q=None, R=None):
    """Samle kontroller som ellers er lette å glemme."""
    A = np.asarray(A, dtype=float)
    b = np.asarray(b, dtype=float)
    x = np.asarray(x, dtype=float)
    # Residualen er data minus modellens verdier, ett avvik per rad i A.
    residual = b-A@x
    finite = np.isfinite(A).all() and np.isfinite(b).all()
    finite = finite and np.isfinite(x).all() and np.isfinite(residual).all()
    residual_norm = np.linalg.norm(residual)
    # Skaler residualen mot størrelsen på både modellbidraget og dataene.
    data_scale = np.linalg.norm(A, "fro")*np.linalg.norm(x)+np.linalg.norm(b)
    # A.T@residual tester om resten er ortogonal på alle modellens kolonner.
    normal_norm = np.linalg.norm(A.T@residual)
    # Denne normaltesten er følsom når residualnormen er svært nær null.
    normal_scale = np.linalg.norm(A, 2)*residual_norm
    report = {
        "metode": name,
        "form": f"{A.shape[0]}x{A.shape[1]}",
        "rang": int(np.linalg.matrix_rank(A)),
        "alle_endelige": bool(finite),
        "relativ_residual": safe_ratio(residual_norm, data_scale),
        "skalert_normaltest": safe_ratio(normal_norm, normal_scale),
    }
    # For QR-metoder undersøker vi også ortonormalitet og rekonstruksjon separat.
    if Q is not None and R is not None:
        finite_qr = np.isfinite(Q).all() and np.isfinite(R).all()
        report["alle_endelige"] = bool(report["alle_endelige"] and finite_qr)
        report["ortogonalitetsfeil_F"] = float(
            np.linalg.norm(Q.T@Q-np.eye(Q.shape[1]), "fro")
        )
        report["relativ_faktoriseringsfeil_F"] = safe_ratio(
            np.linalg.norm(A-Q@R, "fro"), np.linalg.norm(A, "fro")
        )
    return report
```

### Synlig referanse for hjelpefunksjonene

| Funksjon | Input | Output |
|---|---|---|
| monomial_matrix(points, n) | $m$ punkter, grad $n$ | $m\times(n+1)$-matrise med $x_i^j$ |
| chebyshev_matrix(points, n) | $m$ punkter, grad $n$ | $m\times(n+1)$-matrise med $T_j(x_i)$ |
| chebyshev_points(count) | antall punkter | nøyaktig count punkter |
| poly.polyval(points, c) | monomialkoordinater | polynomverdier |
| cheb.chebval(points, c) | Chebyshev-koordinater | polynomverdier |
| cheb.chebvander(points, n) | punkter, grad | samme matrise som chebyshev_matrix |
| qr_solution(A, b) | full-rang $A$, data $b$ | løsning $x$ og tynn $Q,R$ |
| method_report(...) | metode og beregnede størrelser | skalerte diagnostikker |

Standardtoleransen i MGS er

$$\tau=\varepsilon_{\mathrm{maskin}}\max(m,n)\lVert A\rVert_F.$$

En rest under $\tau$ blir behandlet som numerisk null. Denne skalerte testen
er mer meningsfull enn å sammenligne med et fast desimaltall, men avgjørelsen
er fortsatt en numerisk rangvurdering og ikke et bevis på eksakt avhengighet.

## Kjerne
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

# A og b brukes videre i de neste tre forsøkene.
# Sammenlign noen foreslåtte linjer med løsningen som minimerer residualnormen.
t = np.linspace(-1.0, 1.0, 6)
b = np.array([-0.12, 0.34, 0.68, 1.32, 1.55, 2.18])
# Kolonnene svarer til konstantledd og stigningstall.
A = np.column_stack([np.ones_like(t), t])

candidates = [
    np.array([1.0, 1.0]),
    np.array([0.9, 1.1]),
    np.array([1.1, 0.8]),
]
c_star, _, _, _ = np.linalg.lstsq(A, b, rcond=None)

# Hver kandidat vurderes på de samme seks målepunktene.
for c in candidates+[c_star]:
    print(c, "  ||Ac-b||_2 =", np.linalg.norm(A@c-b))

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

# Bruk linjedataene A og b fra forrige celle.
# Endre én koeffisient om gangen rundt optimum og se hvordan feilen øker.
c_star, _, _, _ = np.linalg.lstsq(A, b, rcond=None)
# Residualen er en vektor med ett avvik per måling.
r = b-A@c_star
print("c_* =", c_star)
print("r =", r)
print("A^T r =", A.T@r)

deltas = np.linspace(-0.4, 0.4, 101)
# Flytt bare konstantleddet; hold stigningstallet fast.
errors_c0 = [np.linalg.norm(A@(c_star+np.array([d, 0]))-b)
             for d in deltas]
# Flytt bare stigningstallet; hold konstantleddet fast.
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
$\lVert r\rVert_2$ vanligvis ikke er null.

## 3. Løs det samme problemet med QR

En tynn QR-faktorisering av $A\in\mathbb R^{m\times k}$ er

$$
A=QR,
\qquad
Q\in\mathbb R^{m\times k},
\qquad
R\in\mathbb R^{k\times k},
\qquad
Q^TQ=I_k.
$$

Her antar vi $m\ge k$ og at $A$ har full kolonnerang. Da har $Q$
ortonormale kolonner som spenner ut $C(A)$, og den øvre triangulære matrisen
$R$ er invertibel. For enhver kandidat $c$ gir den ortogonale oppdelingen

$$\lVert b-Ac\rVert_2^2
=\lVert b-QQ^Tb\rVert_2^2+\lVert Q^Tb-Rc\rVert_2^2.$$

Det første leddet kan ikke endres av $c$. Minste-kvadraters koeffisienter
finnes derfor fra

$$\boxed{Rc=Q^Tb.}$$

Kjør begge Gram–Schmidt-variantene på den lille designmatrisen. De bør være
enige her fordi kolonnene er tydelig uavhengige.

```{pyodide-python}
#| label: project-week4-small-qr

# Samme A og b som i linjeforsøket; bare løsningsmetoden endres.
# Små residualer og gode ortonormale kolonner er to forskjellige kontroller.
c_cgs, Qc, Rc = qr_solution(A, b, classical_gram_schmidt)
c_mgs, Qm, Rm = qr_solution(A, b, modified_gram_schmidt)
c_lib, _, _, _ = np.linalg.lstsq(A, b, rcond=None)

# Rapporten skiller mellom residual, normaltest og kvaliteten på QR-faktorene.
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

har $b_3=b_1+b_2$. I eksakt aritmetikk får Gram–Schmidt derfor nullvektoren
når den tredje kolonnen renses. Denne matrisen bruker binært eksakte tall, så
den naive flyttallskoden nedenfor gjør det samme og produserer en ugyldig
verdi. For en annen eksakt avhengig matrise kan avrunding etterlate en liten,
endelig rest; fravær av ugyldige verdier beviser derfor ikke uavhengighet.

```{pyodide-python}
#| label: project-week4-dependent-nan

# B har tre kolonner, men den tredje er summen av de to første.
# Sammenlign en ugyldig normalisering med en kontrollert stopp før divisjonen.
B = np.array([[1.0, 0.0, 1.0],
              [0.0, 1.0, 1.0],
              [0.0, 0.0, 0.0],
              [0.0, 0.0, 0.0]])

# Vi lar den naive funksjonen produsere NaN for å kunne forklare feilen.
with np.errstate(divide="warn", invalid="warn"):
    Q_bad, R_bad = classical_gram_schmidt(B)

print("rang(B) =", np.linalg.matrix_rank(B))
print("diagonal(R) =", np.diag(R_bad))
print("Q =\n", Q_bad)
print("alle tall endelige?", np.isfinite(Q_bad).all())

# MGS-verktøyet skal oppdage den for lille resten og gi en forklaring.
try:
    modified_gram_schmidt(B)
except np.linalg.LinAlgError as error:
    print("Kontrollert stopp:", error)
```

Skriv en forklaring som begynner med kolonnerelasjonen $b_3=b_1+b_2$ og
slutter med den konkrete divisjonen som produserer `NaN`. «Python liker ikke
matrisen» er ikke en forklaring.

Forklar også hvorfor stoppet i MGS er en beslutning om **numerisk rang** ved
en skalert toleranse, ikke et bevis på den eksakte rangen.

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

Husk API-et: funksjonskallet chebyshev_points(m) lager $m$ punkter;
argumentet er antall punkter, ikke polynomgraden.

```{pyodide-python}
#| label: project-week4-polynomial-fit

# n er polynomgraden; antallet ukjente koeffisienter er n+1.
# m er antallet målinger, som her er større enn antallet ukjente.
n = 3
m = 12
points = np.linspace(-1.0, 1.0, m)
true_coordinates = reference_coordinates(n)
exact_values = cheb.chebval(points, true_coordinates)

# Fast frø gjør støyen reproduserbar, slik at metodeendringer kan sammenlignes.
rng = np.random.default_rng(2026)
noise_size = 1e-3
noise = noise_size*rng.standard_normal(m)
measurements = exact_values+noise

# Kolonne j inneholder T_j evaluert ved alle målepunktene.
C = chebyshev_matrix(points, n)
# Løs et overbestemt system med QR; recovered er Chebyshev-koeffisienter.
recovered, Q, R = qr_solution(C, measurements)
residual = measurements-C@recovered

# Et tettere rutenett viser også kurven mellom målepunktene.
grid = np.linspace(-1.0, 1.0, 1001)
reference_curve = cheb.chebval(grid, true_coordinates)
fitted_curve = cheb.chebval(grid, recovered)

print("form(C) =", C.shape, " rang(C) =", np.linalg.matrix_rank(C))
print("||r||_2 =", np.linalg.norm(residual))
print("||C^T r||_2 =", np.linalg.norm(C.T@residual))
print("||Q^TQ-I||_F =", np.linalg.norm(Q.T@Q-np.eye(n+1), "fro"))

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

# Hold målepunkter, referansepolynom og støy fast i begge basiser.
# Koeffisientene har ulik betydning; sammenlign de evaluerte kurvene.
n = 12
m = 25
points = np.linspace(-1.0, 1.0, m)
true_chebyshev = reference_coordinates(n)
exact_values = cheb.chebval(points, true_chebyshev)
rng = np.random.default_rng(2026)
noise = 1e-10*rng.standard_normal(m)
b_noisy = exact_values+noise

# Begge matrisene beskriver samme polynomrom ved de samme punktene.
M = monomial_matrix(points, n)
C = chebyshev_matrix(points, n)
# QR-løsninger i hver basis; neste par løsninger gir biblioteksreferanser.
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
# Evaluer hver koeffisientvektor i den basisen den tilhører.
curve_M = poly.polyval(grid, xM)
curve_C = cheb.chebval(grid, xC)
# Gulvet 1e-18 brukes bare til log-plottet: log(0) kan ikke tegnes.
plt.semilogy(grid, np.maximum(abs(curve_M-reference), 1e-18), label="monomial")
plt.semilogy(grid, np.maximum(abs(curve_C-reference), 1e-18), label="Chebyshev")
plt.xlabel("x"); plt.ylabel("absolutt kurvefeil")
plt.title("Samme data og polynom, forskjellig basis")
plt.grid(alpha=0.25); plt.legend(); plt.show()
```

Forklar hvilke størrelser som kan sammenlignes på tvers av basisene. Husk at
koeffisient nummer $j$ betyr noe forskjellig i de to basisene.

## Utvidelse

## 7. Klassisk eller modifisert Gram–Schmidt?

Bruk samme $M$ og $C$ som over. Faktoriser hver matrise både med klassisk og
modifisert Gram–Schmidt. Samle resultatene i en tabell med

$$
\lVert Q^TQ-I\rVert_F,
\qquad
\frac{\lVert A-QR\rVert_F}{\lVert A\rVert_F},
\qquad
\frac{\lVert Ax-b\rVert_2}
{\lVert A\rVert_F\lVert x\rVert_2+\lVert b\rVert_2},
\qquad
\frac{\lVert A^T(Ax-b)\rVert_2}
{\lVert A\rVert_2\lVert Ax-b\rVert_2}.
$$

```{pyodide-python}
#| label: project-week4-cgs-mgs

# Gjenbruk M, C og b_noisy fra basisforsøket.
# For hver basis sammenlignes CGS og MGS på nøyaktig samme problem.
for matrix_name, matrix in [("M", M), ("C", C)]:
    for method_name, method in [
        ("klassisk GS", classical_gram_schmidt),
        ("modifisert GS", modified_gram_schmidt),
    ]:
        # En kontrollert stopp er et resultat å forklare, ikke en kurve som skal ignoreres.
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

Kontroller finitet og relativ faktoriseringsfeil ved hvert trinn. Beskriv MGS
som bedre **i dette forsøket** dersom målingene støtter det; kurvene trenger
ikke være monotone, og MGS er ingen universell garanti.

## 8. Normalligningene som sammenligningsmetode

Fra ortogonalitetsbetingelsen

$$A^T(b-Ax)=0$$

får vi normalligningene

$$\boxed{A^TAx=A^Tb.}$$

Normalligningene karakteriserer alle minste-kvadraters minimatorer også uten
full kolonnerang. Full kolonnerang gjør $A^TA$ invertibel og minimatoren
entydig. Matematisk gjelder da identiteten

$$\kappa_2(A^TA)=\kappa_2(A)^2.$$

Flyttallsestimatene som skrives ut trenger ikke oppfylle identiteten nøyaktig,
og dannelsen av $A^TA$ gjør problemet numerisk mer sårbart.

```{pyodide-python}
#| label: project-week4-normal-equations

# Normal-likningene samler problemet i A.T @ A.
# Undersøk hvordan dette påvirker kondisjonstall og løsning for begge basiser.
def normal_equation_solution(A, b):
    # Normal-likningene løser (A.T A)x=A.T b; produktet kan forsterke kondisjonsproblemer.
    return np.linalg.solve(A.T@A, A.T@b)

for name, matrix in [("monomial", M), ("Chebyshev", C)]:
    # Biblioteksløsningen brukes som sammenligningsgrunnlag på samme data.
    x_lstsq, _, _, _ = np.linalg.lstsq(matrix, b_noisy, rcond=None)
    print("\n", name)
    print("kappa(A)    =", np.linalg.cond(matrix))
    print("kappa(A^TA) =", np.linalg.cond(matrix.T@matrix))
    # Selv en endelig løsning kan være unøyaktig; undersøk rapporten etterpå.
    try:
        x_normal = normal_equation_solution(matrix, b_noisy)
        if not np.isfinite(x_normal).all():
            raise np.linalg.LinAlgError("ikke-endelig løsning")
        print(method_report("normal", matrix, b_noisy, x_normal))
    except np.linalg.LinAlgError as error:
        print("normal stoppet kontrollert:", error)
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
rekonstruksjonen. Hvis du bruker cosinusfordelte punkter, skal funksjonen
chebyshev_points kalles med $m$, altså antall punkter.

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

For **kjerneløypa**, lever én Quarto-side eller notebook med punkt 1–6 og en
kort analyse av disse. For hele prosjektet med **utvidelse**, lever også
punkt 7–10:

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
