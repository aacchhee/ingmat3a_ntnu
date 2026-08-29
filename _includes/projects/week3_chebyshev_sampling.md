# Polynomer i blindsonen

Dette prosjektet er laget for omtrent **4–5 timer selvstendig arbeid**.
Kodeassistenter er tillatt, men du er ansvarlig for at eksperimentene faktisk
svarer på de matematiske spørsmålene.

I uke 3 har vi sett at samme vektorrom kan beskrives med forskjellige basiser.
I eksakt matematikk er dette bare forskjellige koordinater for de samme
objektene. På en datamaskin kan basisvalget likevel få stor betydning.

Vi skal undersøke polynomrommet $\mathcal P_n$. Tenk deg at vi ikke kjenner
hele grafen til et polynom, men bare leser av polynomverdien på $n+1$ steder.
Vi samler avlesningene i en tallkolonne:

$$
E(p)=
\begin{bmatrix}
p(x_0)\\p(x_1)\\\vdots\\p(x_n)
\end{bmatrix}.
$$

Prosjektets hovedspørsmål er:

> **Hvordan kan matematisk likeverdige beskrivelser av det samme
> polynomrommet gi svært forskjellige numeriske resultater?**

Du skal gjøre tre kontrollerte sammenligninger. Først arbeider du med lav grad
og eksakt lineær algebra. Deretter endrer du bare basisen. Til slutt holder du
basis fast og endrer bare avlesningspunktene. Ikke bland disse eksperimentene:
Ellers vet du ikke hva som forårsaket forskjellen.

```{pyodide-python}
#| label: project-week3-setup
#| autorun: true
#| context: setup

# Felles verktøy for alle kodecellene i prosjektet. Cellen kjøres
# automatisk og vises ikke på den ferdige siden.
import numpy as np
import matplotlib.pyplot as plt
from numpy.polynomial import polynomial as poly
from numpy.polynomial import chebyshev as cheb
```

:::: {.callout-tip}
## Forslag til arbeidsmåte

For hvert hovedeksperiment:

1. Skriv ned hva du tror vil skje.
2. Endre bare én ting.
3. Kjør forsøket og lagre tallene og figuren.
4. Finn hvor forskjellen er størst.
5. Forklar resultatet med begrepene basis, koordinater, rang og nullrom.

Store fargerike figurer er ikke et mål i seg selv. Figuren skal brukes som data
for en matematisk forklaring.
::::

## 1. Chebyshev-polynomene

Chebyshev-polynomene bygges med rekursjonen

$$
T_0(x)=1,\qquad T_1(x)=x,\qquad
T_{n+1}(x)=2xT_n(x)-T_{n-1}(x).
$$

De første polynomene er altså ikke oppgitt ferdig. Bruk rekursjonen til å
regne ut $T_2$, $T_3$ og $T_4$ for hånd. Samle ledd med samme potens av $x$.

### Fra matematisk rekursjon til Python

Funksjonen under er en direkte oversettelse av definisjonen. Før du kjører,
følg kallene som trengs for å beregne $T_4(0.3)$, og forklar hvilken linje som
svarer til hvert av de tre tilfellene i den matematiske definisjonen.

```{pyodide-python}
import numpy as np
import matplotlib.pyplot as plt


def chebyshev_recursive(n, x):
    """Beregn T_n(x) direkte fra den rekursive definisjonen."""
    if n < 0:
        raise ValueError("n må være et ikke-negativt heltall")
    if n == 0:
        return 1 + 0*x       # TODO: forklar hvorfor 0*x er nyttig for arrays
    if n == 1:
        return x
    return (2*x*chebyshev_recursive(n-1, x)
            - chebyshev_recursive(n-2, x))


for n in range(5):
    print(f"T_{n}(0.3) = {chebyshev_recursive(n, 0.3): .8f}")
```

Kontroller de håndregnede uttrykkene ved å evaluere dem og
`chebyshev_recursive` i minst tre verdier av $x$. Legg deretter inn en teller
i funksjonen og sammenlign antall funksjonskall for $n=5,10,15$. Nullstill
telleren mellom hvert forsøk.

Den direkte rekursjonen gjør mange av de samme beregningene flere ganger. I
resten av prosjektet bruker vi derfor en tabell som lagrer alle verdiene fra
$T_0$ til $T_n$:

```{pyodide-python}
import numpy as np

def chebyshev_table(x, n):
    """Returner en tabell med T_0(x), ..., T_n(x) som kolonner."""
    x = np.asarray(x, dtype=float)
    # Den siste aksen reserveres for polynomnummeret k.
    table = np.empty(x.shape + (n+1,), dtype=float)
    table[..., 0] = 1.0
    if n >= 1:
        table[..., 1] = x
    # Hver ny kolonne bruker de to foregående kolonnene i tabellen.
    for k in range(1, n):
        table[..., k+1] = 2*x*table[..., k] - table[..., k-1]
    return table


x_test = np.array([-1.0, -0.25, 0.0, 0.4, 1.0])
print(chebyshev_table(x_test, 4))
```

Forklar hvorfor den iterative funksjonen trenger omtrent $n$ regnetrinn,
mens den direkte rekursjonen gjentar stadig flere delberegninger. Du trenger
ikke gjøre en formell kjøretidsanalyse.

### Fra rekursjon til grafer

```{pyodide-python}
import numpy as np
import matplotlib.pyplot as plt

x_plot = np.linspace(-1.0, 1.0, 1200)
T_plot = chebyshev_table(x_plot, 8)

plt.close("all")
fig, axes = plt.subplots(3, 3, figsize=(8, 6), sharex=True, sharey=True)
for n, ax in enumerate(axes.ravel()):
    ax.plot(x_plot, T_plot[:, n], color="#277da1")
    ax.axhline(0, color="0.75", linewidth=0.8)
    ax.set_title(f"$T_{n}$")
    ax.grid(alpha=0.2)
    ax.set_ylim(-1.15, 1.15)
fig.supxlabel("x")
fig.supylabel("$T_n(x)$")
plt.tight_layout()
plt.show()
```

Undersøk figurene før du leser videre:

1. Hvor store og små blir polynomene på $[-1,1]$?
2. Hva skjer i endepunktene $-1$ og $1$?
3. Hvordan endres antall nullpunkter og svingninger med $n$?
4. Hvilke polynomer er symmetriske om $y$-aksen? Hva gjør de andre ved
   fortegnsskifte av $x$?
5. Hvilke av observasjonene dine kan du begrunne fra rekursjonen?

### Er dette en basis?

For å undersøke $T_0,\ldots,T_4$ som mulige basispolynomer trenger vi deres
koordinater i $(1,x,x^2,x^3,x^4)$. Start med koeffisientene du fant for hånd.
Fyll deretter kolonnene i `Q`:

```{pyodide-python}
# Hver kolonne skal inneholde monomialkoeffisientene til ett T_k.
# Rekkefølgen på radene er 1, x, x^2, x^3, x^4.
Q = np.full((5, 5), np.nan)
Q[:, 0] = [1, 0, 0, 0, 0]  # T_0
Q[:, 1] = [0, 1, 0, 0, 0]  # T_1

# TODO: Fyll kolonne 2, 3 og 4 fra håndregningen.

if np.isnan(Q).any():
    print("Fyll inn de tre siste kolonnene før rangtesten.")
else:
    print("Rang:", np.linalg.matrix_rank(Q))
    print("Diagonal:", np.diag(Q))
```

Kontroller alle kolonnene mot håndregningen. Bestem deretter om
$(T_0,T_1,T_2,T_3,T_4)$ er en basis for $\mathcal P_4$. Begrunnelsen skal
bruke matrisen, ikke bare at figurene ser forskjellige ut.

Hva forteller formen til `Q` om samme spørsmål for
$(T_0,\ldots,T_n)$ ved høyere grad? Formuler en begrunnet regel. Pek på
mønsteret i matrisen; du trenger ikke bevise regelen for alle $n$.

## 2. Del 1 – avlesning som en lineær transformasjon

Vi går tilbake til lav grad før vi gjør store numeriske eksperimenter. La
$p\in\mathcal P_3$, og les av verdien til $p$ i punktene

$$x_0=-1,\qquad x_1=-\frac13,\qquad x_2=\frac13,\qquad x_3=1.$$

Transformasjonen

$$
E(p)=
\begin{bmatrix}
p(x_0)\\p(x_1)\\p(x_2)\\p(x_3)
\end{bmatrix}
$$

sender altså et polynom til fire polynomverdier. Avbildningen er lineær:
Hvis vi dobler polynomet, dobles alle avlesningene, og avlesning av en sum
gir summen av avlesningene.

### Matrisen avhenger av basisen

Hvis

$$p(x)=a_0+a_1x+a_2x^2+a_3x^3,$$

er den første avlesningen

$$p(x_0)=a_0+a_1x_0+a_2x_0^2+a_3x_0^3.$$

Dermed er første rad i avlesningsmatrisen
$[1,x_0,x_0^2,x_0^3]$. Utled de tre andre radene før du fullfører funksjonen
under.

```{pyodide-python}
def monomial_matrix(points, n):
    """Avlesningsmatrise for basisen (1, x, ..., x^n)."""
    points = np.asarray(points, dtype=float)
    powers = np.arange(n+1)
    # Kolonne j inneholder x^j evaluert i alle punktene.
    return points[:, None] ** powers[None, :]


def chebyshev_matrix(points, n):
    """Avlesningsmatrise for basisen (T_0, ..., T_n)."""
    return chebyshev_table(points, n)


points_small = np.array([-1.0, -1/3, 1/3, 1.0])
M_small = monomial_matrix(points_small, 3)
C_small = chebyshev_matrix(points_small, 3)

print("Monomialbasis:\n", M_small)
print("\nChebyshev-basis:\n", C_small)
print("\nRanger:", np.linalg.matrix_rank(M_small),
      np.linalg.matrix_rank(C_small))
```

Svar før du løser et system:

1. Hva er definisjonsrommet og verdirommet til $E$?
2. Hvorfor er `M_small` og `C_small` forskjellige når de beskriver samme
   transformasjon?
3. Hva forteller full rang om avlesningene?
4. Betyr forskjellig koordinatvektor at vi har fått et annet polynom?

### Finn det samme polynomet i to basiser

Vi lager avlesningsverdier fra

$$p(x)=1-2x+\frac12x^2+x^3.$$

```{pyodide-python}
from numpy.polynomial import polynomial as poly
from numpy.polynomial import chebyshev as cheb


monomial_true = np.array([1.0, -2.0, 0.5, 1.0])
# Dette er de eneste dataene de to lineære systemene får.
measurements_small = poly.polyval(points_small, monomial_true)

monomial_recovered = np.linalg.solve(M_small, measurements_small)
chebyshev_recovered = np.linalg.solve(C_small, measurements_small)

print("Avlesninger:", measurements_small)
print("Monomialkoordinater:", monomial_recovered)
print("Chebyshev-koordinater:", chebyshev_recovered)

x_dense = np.linspace(-1, 1, 1001)
p_reference = poly.polyval(x_dense, monomial_true)
p_from_monomials = poly.polyval(x_dense, monomial_recovered)
p_from_chebyshev = cheb.chebval(x_dense, chebyshev_recovered)

print("Største forskjell, monomial:",
      np.max(np.abs(p_from_monomials-p_reference)))
print("Største forskjell, Chebyshev:",
      np.max(np.abs(p_from_chebyshev-p_reference)))
```

Kontroller at de to koordinatvektorene virkelig bygger samme polynom. Skriv
polynomet som en lineærkombinasjon av $T_0,T_1,T_2,T_3$ og sammenlign med
monomialformen.

### Når mister avlesningene informasjon?

Kjør de to endringene under én om gangen:

```{pyodide-python}
# Forsøk A: Fjern den siste avlesningen.
points_three = points_small[:-1]
M_three = monomial_matrix(points_three, 3)

# Forsøk B: Bruk fire plasser, men les av samme punkt to ganger.
points_repeated = np.array([-1.0, -1/3, 1/3, 1/3])
M_repeated = monomial_matrix(points_repeated, 3)

print("Form og rang med tre avlesninger:",
      M_three.shape, np.linalg.matrix_rank(M_three))
print("Form og rang med gjentatt punkt:",
      M_repeated.shape, np.linalg.matrix_rank(M_repeated))
```

Finn et ikke-null polynom $z\in\mathcal P_3$ som tilfredsstiller

$$z(-1)=z(-1/3)=z(1/3)=0.$$

**Hint ved behov:** Et polynom med nullpunktene $r_1,r_2,r_3$ inneholder
faktorene $(x-r_1)(x-r_2)(x-r_3)$.

Bruk deretter koden under til å kontrollere svaret og lage to forskjellige
polynomer med identiske tre avlesninger:

```{pyodide-python}
invisible_coefficients = poly.polyfromroots(points_three)

# Velg selv en synlig skaleringsfaktor.
alpha = 2.0
second_polynomial = monomial_true + alpha*invisible_coefficients

# De to polynomene er forskjellige, men z er null i alle tre punktene.
first_values = poly.polyval(points_three, monomial_true)
second_values = poly.polyval(points_three, second_polynomial)

print("Koeffisienter til z:", invisible_coefficients)
print("Avlesninger av p:       ", first_values)
print("Avlesninger av p+alpha*z:", second_values)
print("Forskjell i avlesningene:", second_values-first_values)

plt.close("all")
plt.plot(x_dense, poly.polyval(x_dense, monomial_true), label="$p$")
plt.plot(x_dense, poly.polyval(x_dense, second_polynomial),
         label="$p+\\alpha z$")
plt.scatter(points_three, first_values, color="black", zorder=3,
            label="Tre avlesninger")
plt.xlabel("x")
plt.ylabel("polynomverdi")
plt.title("Forskjellige polynomer, identiske avlesninger")
plt.grid(alpha=0.25)
plt.legend()
plt.show()
```

Forklar resultatet med nullrommet til $E$. Hvor mange uavhengige usynlige
retninger forventer du når vi leser av et polynom i $\mathcal P_n$ i bare $m$
forskjellige punkter, der $m<n+1$? Begrunn svaret med rang–nullitet, og oppgi
forutsetningene du bruker.

## 3. Del 2 – samme avlesningspunkter, forskjellig basis

Ved grad 3 virker begge basisene uproblematiske. Nå øker vi graden, men holder
avlesningspunktene helt faste mens vi bytter basis. Da kan en eventuell
forskjell ikke skyldes at vi leste av polynomet andre steder.

Vi bruker foreløpig punktene

$$
x_k=\cos\left(\frac{(2k+1)\pi}{2(n+1)}\right),
\qquad k=0,\ldots,n.
$$

Hvorfor disse punktene er interessante, undersøker vi først i del 3. Her er
de bare ett fast valg som begge basisene må bruke.

```{pyodide-python}
def chebyshev_points(n):
    """Returner n+1 cosinusfordelte punkter i intervallet [-1,1]."""
    k = np.arange(n+1)
    return np.cos((2*k+1)*np.pi/(2*(n+1)))


def reference_coordinates(n):
    """Moderate, deterministiske koordinater i Chebyshev-basis."""
    k = np.arange(n+1)
    return (-1.0)**k/(k+1.0)**2


def max_grid_error(values, reference):
    return float(np.max(np.abs(values-reference)))
```

Før du kjører grad 30, gjør et overslag: Ligger alle de valgte
Chebyshev-koordinatene mellom $-1$ og $1$? Betyr det automatisk at
monomialkoordinatene til samme polynom også er små?

### Ett komplett forsøk

```{pyodide-python}
def compare_bases(n, grid_size=2001):
    # Det samme polynomet leses av i de samme punktene for begge basiser.
    points = chebyshev_points(n)
    true_chebyshev = reference_coordinates(n)
    measurements = cheb.chebval(points, true_chebyshev)

    # Bare koordinatsystemet endres mellom de to lineære systemene.
    M = monomial_matrix(points, n)
    C = chebyshev_matrix(points, n)

    recovered_monomial = np.linalg.solve(M, measurements)
    recovered_chebyshev = np.linalg.solve(C, measurements)

    # Det tette rutenettet gir ingen nye data til systemet. Det brukes bare
    # til å sammenligne de to ferdige polynomene mellom avlesningspunktene.
    grid = np.linspace(-1.0, 1.0, grid_size)
    reference = cheb.chebval(grid, true_chebyshev)
    from_monomials = poly.polyval(grid, recovered_monomial)
    from_chebyshev = cheb.chebval(grid, recovered_chebyshev)

    return {
        "n": n,
        "points": points,
        "measurements": measurements,
        "grid": grid,
        "reference": reference,
        "monomial_values": from_monomials,
        "chebyshev_values": from_chebyshev,
        "monomial_coordinates": recovered_monomial,
        "chebyshev_coordinates": recovered_chebyshev,
        "monomial_error": max_grid_error(from_monomials, reference),
        "chebyshev_error": max_grid_error(from_chebyshev, reference),
    }


basis_data = compare_bases(30)
print("Grad:", basis_data["n"])
print("Største |monomialkoordinat|:",
      np.max(np.abs(basis_data["monomial_coordinates"])))
print("Største |Chebyshev-koordinat|:",
      np.max(np.abs(basis_data["chebyshev_coordinates"])))
print("Maksfeil med monomialbasis:", basis_data["monomial_error"])
print("Maksfeil med Chebyshev-basis:", basis_data["chebyshev_error"])
```

Ikke gå direkte videre. Kontroller først:

1. Er avlesningsverdiene identiske i de to beregningene?
2. Hvor mange størrelsesordener skiller de største koordinatene?
3. Hvor på intervallet er feilen i det gjenfunne polynomet størst?
4. Har vi byttet polynomrom, avbildning eller avlesningspunkter?
5. Hvilket av svarene dine er eksakt matematikk, og hvilket handler om
   flyttallsregning?

### Følg forskjellen når graden øker

```{pyodide-python}
degrees = [3, 10, 20, 25, 30]
basis_results = [compare_bases(n) for n in degrees]

print(f"{'grad':>5} {'maks |a_k|':>16} {'maks |c_k|':>16} "
      f"{'feil monomial':>18} {'feil Chebyshev':>18}")
print("-"*79)
for data in basis_results:
    print(f"{data['n']:5d} "
          f"{np.max(np.abs(data['monomial_coordinates'])):16.4e} "
          f"{np.max(np.abs(data['chebyshev_coordinates'])):16.4e} "
          f"{data['monomial_error']:18.4e} "
          f"{data['chebyshev_error']:18.4e}")
```

Lag en logaritmisk feilfigur for grad 30:

```{pyodide-python}
grid = basis_data["grid"]
error_monomial = np.abs(
    basis_data["monomial_values"]-basis_data["reference"]
)
error_chebyshev = np.abs(
    basis_data["chebyshev_values"]-basis_data["reference"]
)

tiny = np.finfo(float).tiny
plt.close("all")
plt.semilogy(grid, np.maximum(error_monomial, tiny),
             label="Monomialbasis")
plt.semilogy(grid, np.maximum(error_chebyshev, tiny),
             label="Chebyshev-basis")
plt.xlabel("x")
plt.ylabel("absolutt feil")
plt.title("Samme polynom og samme avlesningspunkter")
plt.grid(alpha=0.25)
plt.legend()
plt.show()
```

Skriv en foreløpig forklaring. Bruk minst disse observasjonene:

- størrelsen på koordinatene;
- størrelsen på basisfunksjonene på $[-1,1]$;
- at et moderat sluttresultat kan bygges ved at store ledd nesten kansellerer;
- at hvert mellomresultat lagres med endelig presisjon.

Ikke skriv at «datamaskinen er unøyaktig» uten å identifisere hvilke tall som
er store, og hvor kanselleringen oppstår.

### En kontrollert forstyrrelse av avlesningene

Til slutt endrer vi hver avlesningsverdi med omtrent $10^{-10}$, men beholder
punktene. Bruk samme forstyrrelse for begge basisene.

```{pyodide-python}
n = 30
points = chebyshev_points(n)
true_chebyshev = reference_coordinates(n)
measurements = cheb.chebval(points, true_chebyshev)

rng = np.random.default_rng(2026)
# Fast startverdi gjør at alle får nøyaktig samme forstyrrelse.
measurement_noise = 1e-10*rng.standard_normal(n+1)

M = monomial_matrix(points, n)
C = chebyshev_matrix(points, n)

a_before = np.linalg.solve(M, measurements)
a_after = np.linalg.solve(M, measurements+measurement_noise)
c_before = np.linalg.solve(C, measurements)
c_after = np.linalg.solve(C, measurements+measurement_noise)

print("Største endring i avlesning:", np.max(np.abs(measurement_noise)))
print("Endring i monomialkoordinater:", np.linalg.norm(a_after-a_before))
print("Endring i Chebyshev-koordinater:", np.linalg.norm(c_after-c_before))
```

Hvorfor er det rimelig å sammenligne endringene *innen* hver koordinattype,
men misvisende å si at én bestemt monomialkoeffisient og én bestemt
Chebyshev-koeffisient betyr det samme?

## 4. Del 3 – samme basis, forskjellige avlesningspunkter

Nå holder vi Chebyshev-basis fast. Det eneste vi endrer, er hvor vi leser av
polynomverdiene. Dermed undersøker vi et annet spørsmål enn i del 2.

De to punktfamiliene er

$$
x_k^{\mathrm{jevn}}=-1+\frac{2k}{n}
$$

og

$$
x_k^{\mathrm{Cheb}}
=\cos\left(\frac{(2k+1)\pi}{2(n+1)}\right),
$$

for $k=0,\ldots,n$.

### Se på plasseringen før du regner

```{pyodide-python}
n = 30
equal_points = np.linspace(-1.0, 1.0, n+1)
cheb_points = chebyshev_points(n)

plt.close("all")
fig, axes = plt.subplots(2, 1, figsize=(8, 2.5), sharex=True)
axes[0].scatter(equal_points, np.zeros_like(equal_points), marker="|", s=180)
axes[0].set_title("Like langt mellom avlesningspunktene")
axes[1].scatter(cheb_points, np.zeros_like(cheb_points), marker="|", s=180,
                color="#d98900")
axes[1].set_title("Cosinusfordelte avlesningspunkter")
for ax in axes:
    ax.set_yticks([])
    ax.grid(axis="x", alpha=0.2)
axes[1].set_xlabel("x")
plt.tight_layout()
plt.show()
```

Hvor er punktavstanden størst og minst i hvert oppsett? Hvilket oppsett ville
du valgt dersom du var spesielt redd for at polynomet skulle gjøre noe
uventet nær $-1$ eller $1$? Skriv hypotesen før forsøket med forstyrrelser.

### Den samme lille feilen i begge forsøk

Vi forstyrrer avlesningene med det faste mønsteret

$$\delta y_k=10^{-10}(-1)^k.$$

Det er viktig at både størrelsen og fortegnsmønsteret er identisk i de to
forsøkene. Dermed kan ikke forskjellen forklares med at det ene forsøket fikk
en større eller mer gunstig feil.

```{pyodide-python}
def point_placement_experiment(n, points, noise_size=1e-10,
                               grid_size=5001):
    # Lag de nøyaktige avlesningene fra ett fast referansepolynom.
    true_coordinates = reference_coordinates(n)
    measurements = cheb.chebval(points, true_coordinates)
    # Det samme fortegnsmønsteret brukes uansett hvor punktene ligger.
    noise = noise_size*(-1.0)**np.arange(n+1)

    # Finn polynomet som passer til de litt forstyrrede avlesningene.
    C = chebyshev_matrix(points, n)
    recovered = np.linalg.solve(C, measurements+noise)

    # Sammenlign med referansepolynomet også mellom avlesningspunktene.
    grid = np.linspace(-1.0, 1.0, grid_size)
    reference = cheb.chebval(grid, true_coordinates)
    perturbed = cheb.chebval(grid, recovered)
    error = perturbed-reference

    return {
        "n": n,
        "points": points,
        "noise": noise,
        "grid": grid,
        "error": error,
        "max_data_error": float(np.max(np.abs(noise))),
        "max_curve_error": float(np.max(np.abs(error))),
    }


equal_data = point_placement_experiment(
    n, equal_points, noise_size=1e-10
)
cheb_data = point_placement_experiment(
    n, cheb_points, noise_size=1e-10
)

for name, data in [("Jevne punkter", equal_data),
                   ("Cosinusfordelte punkter", cheb_data)]:
    amplification = data["max_curve_error"]/data["max_data_error"]
    print(f"{name:27s}",
          f"feil i avlesning={data['max_data_error']:.3e}",
          f"kurvefeil={data['max_curve_error']:.3e}",
          f"forsterkning={amplification:.3e}")
```

Hvor mange størrelsesordener skiller kurvefeilene? Kontroller at forskjellen
ikke skyldes ulik forstyrrelse eller ulik basis.

### Det nesten usynlige polynomet

Forskjellen mellom det gjenfunne og det opprinnelige polynomet er selv et
polynom:

$$r(x)=p_{\mathrm{forstyrret}}(x)-p_{\mathrm{opprinnelig}}(x).$$

Ved avlesningspunktene er $r(x_k)$ bare den lille forstyrrelsen vi la til.
Mellom punktene vet vi ennå ikke hvor stort polynomet kan bli.

```{pyodide-python}
plt.close("all")
fig, axes = plt.subplots(2, 1, figsize=(8, 6), sharex=True)

for ax, title, data, color in [
    (axes[0], "Like langt mellom punktene", equal_data, "#277da1"),
    (axes[1], "Cosinusfordelte punkter", cheb_data, "#d98900"),
]:
    ax.plot(data["grid"], data["error"], color=color,
            label="$r(x)$ mellom avlesningene")
    ax.scatter(data["points"], data["noise"], color="black", s=16,
               zorder=3, label="$r(x_k)$ ved avlesningspunktene")
    ax.axhline(0, color="0.7", linewidth=0.8)
    ax.set_title(title)
    ax.set_ylabel("feil")
    ax.grid(alpha=0.25)
    ax.legend(loc="upper center")

axes[1].set_xlabel("x")
plt.tight_layout()
plt.show()
```

Analyser figuren nøye:

1. Hvor er $|r(x)|$ størst i hvert forsøk?
2. Hvor små er verdiene ved selve avlesningspunktene?
3. Hvordan kan et polynom være nesten usynlig i avlesningene og samtidig stort
   mellom dem?
4. Hva minner dette om fra nullrommet i del 1?
5. Hvorfor er det ikke korrekt å kalle $r$ en eksakt nullromsvektor?
6. Hvordan henger feiltoppene sammen med fordelingen av avlesningspunktene?

Et ikke-null polynom som avbildningen $E$ sender til en svært liten
avlesningsvektor, kan tolkes som en **numerisk nullromsretning**. Dette er en
uformell beskrivelse, ikke et nytt eksakt nullrom: Avlesningsvektoren er
liten, men ikke null.
Formuler med egne ord hva som skiller de to situasjonene.

### Når blir forskjellen synlig?

```{pyodide-python}
degrees = [5, 10, 15, 20, 25, 30, 35]

print(f"{'grad':>5} {'forsterkning, jevn':>22} "
      f"{'forsterkning, cosinus':>25}")
print("-"*57)
for n_test in degrees:
    equal = point_placement_experiment(
        n_test, np.linspace(-1.0, 1.0, n_test+1)
    )
    cosine = point_placement_experiment(
        n_test, chebyshev_points(n_test)
    )
    amp_equal = equal["max_curve_error"]/equal["max_data_error"]
    amp_cosine = cosine["max_curve_error"]/cosine["max_data_error"]
    print(f"{n_test:5d} {amp_equal:22.4e} {amp_cosine:25.4e}")
```

Velg minst to ekstra grader selv. Beskriv når forskjellen først blir tydelig,
og om veksten ser jevn ut. Tallene viser hva som skjer i forsøkene dine, men
de beviser ikke hva som skjer for alle grader.

## 5. Finale – et polynom mellom −1 og 1

Plottene i starten antydet at $T_n$ holder seg mellom $-1$ og $1$ på
intervallet. Identiteten

$$T_n(x)=\cos(n\arccos x),\qquad -1\le x\le1,$$

gir oss en uavhengig måte å kontrollere dette på.

Vi skal nå evaluere $T_{50}(0.99)$ på tre matematisk likeverdige måter:

1. konverter til monomialkoeffisienter og bruk vanlig polynomevaluering;
2. bruk Chebyshev-representasjonen direkte;
3. bruk cosinusidentiteten som referanse.

Skriv ned hvilken metode du forventer vil være mest pålitelig før du kjører.

```{pyodide-python}
n = 50
x0 = 0.99

cheb_coordinates = np.zeros(n+1)
# Denne koordinatvektoren betyr 0*T_0 + ... + 1*T_50.
cheb_coordinates[n] = 1.0
monomial_coordinates = cheb.cheb2poly(cheb_coordinates)

value_monomial = poly.polyval(x0, monomial_coordinates)
value_chebyshev = cheb.chebval(x0, cheb_coordinates)
value_reference = np.cos(n*np.arccos(x0))

print("Største monomialkoeffisient:",
      np.max(np.abs(monomial_coordinates)))
print("Monomialevaluering:   ", value_monomial)
print("Chebyshev-evaluering: ", value_chebyshev)
print("Cosinusreferanse:     ", value_reference)
print("Feil, monomial:       ", abs(value_monomial-value_reference))
print("Feil, Chebyshev:      ", abs(value_chebyshev-value_reference))
```

Hvis et svar ligger langt utenfor intervallet $[-1,1]$, er det ikke en liten
avrundingsforskjell. Undersøk mekanismen før du konkluderer.

### Følg sammenbruddet mot grad 50

```{pyodide-python}
print(f"{'grad':>5} {'største koeff.':>18} "
      f"{'feil monomial':>18} {'feil Chebyshev':>18}")
print("-"*63)

for n_test in [10, 20, 30, 40, 50]:
    c = np.zeros(n_test+1)
    c[n_test] = 1.0
    a = cheb.cheb2poly(c)
    reference = np.cos(n_test*np.arccos(x0))
    monomial_value = poly.polyval(x0, a)
    chebyshev_value = cheb.chebval(x0, c)
    print(f"{n_test:5d} {np.max(np.abs(a)):18.4e} "
          f"{abs(monomial_value-reference):18.4e} "
          f"{abs(chebyshev_value-reference):18.4e}")
```

Svar grundig:

1. Hvordan kan et polynom som er begrenset av 1, ha
   monomialkoeffisienter nær $10^{18}$?
2. Hvorfor må store monomialledd kansellere hverandre?
3. Hva skjer med kanselleringen når mellomresultatene avrundes?
4. Er feilen her forårsaket av avlesningspunktene?
5. Hvilke deler av forklaringen kommer fra uke 1, og hvilke kommer fra uke 3?
6. Hvorfor følger numerisk pålitelighet ikke automatisk av algebraisk
   likeverdighet?

## 6. Åpen utfordring – lag din egen blindsone

Nå får du bruke ideene fra prosjektet mer fritt. Plasser avlesningspunktene
slik at en svært liten feil i avlesningene gir størst mulig feil mellom
punktene. Følg disse reglene:

- polynomgraden skal være høyst 35;
- alle $n+1$ avlesningspunkter skal være forskjellige og ligge i $[-1,1]$;
- hver avlesningsfeil skal ha absoluttverdi høyst $10^{-10}$;
- polynomet skal finnes i Chebyshev-basis;
- forsterkningen skal beregnes på et tett rutenett med minst 5001 punkter.

Du kan endre graden, punktene og fortegnsmønsteret i forstyrrelsen. Du kan
ikke gjøre avlesningsfeilen større eller legge to punkter nøyaktig oppå
hverandre.

```{pyodide-python}
# Startforslag: Bytt ut både punktene og fortegnsmønsteret i feilen.
n_design = 20
my_points = np.linspace(-1.0, 1.0, n_design+1)
my_noise = 1e-10*(-1.0)**np.arange(n_design+1)

true_coordinates = reference_coordinates(n_design)
my_measurements = cheb.chebval(my_points, true_coordinates)
my_matrix = chebyshev_matrix(my_points, n_design)
my_recovered = np.linalg.solve(my_matrix, my_measurements+my_noise)

my_grid = np.linspace(-1.0, 1.0, 5001)
my_reference = cheb.chebval(my_grid, true_coordinates)
my_curve = cheb.chebval(my_grid, my_recovered)
my_error = my_curve-my_reference

assert len(np.unique(my_points)) == n_design+1
assert np.all(np.abs(my_points) <= 1.0)
assert np.max(np.abs(my_noise)) <= 1.000001e-10

# Sammenlign den største feilen mellom punktene med den største feilen
# vi faktisk la inn i avlesningene.
my_amplification = (np.max(np.abs(my_error))
                    / np.max(np.abs(my_noise)))
print("Forsterkning:", my_amplification)

plt.close("all")
plt.plot(my_grid, my_error, label="feilpolynomet")
plt.scatter(my_points, my_noise, color="black", s=15,
            label="feil ved avlesningspunktene")
plt.xlabel("x")
plt.ylabel("feil")
plt.title("Min blindsone")
plt.grid(alpha=0.25)
plt.legend()
plt.show()
```

Prøv minst tre ideer, og endre én egenskap om gangen. Det beste forsøket er
ikke nødvendigvis det med størst tall. Du må også kunne forklare hvorfor
plasseringen av punktene skjuler feilpolynomet.

## 7. Samlet analyse

Skriv en sammenhengende analyse på omtrent **500–700 ord**. Figurer og
tabeller underbygger analysen, men de erstatter ikke forklaringen.

Analysen skal skille tydelig mellom:

1. polynomrommet og koordinatene i en valgt basis;
2. avlesningsavbildningen og matrisen som representerer den;
3. eksakt informasjonstap og numerisk nesten-informasjonstap;
4. effekten av å bytte basis med punktene faste;
5. effekten av å flytte avlesningspunktene med basisen fast;
6. algebraisk likeverdighet og numerisk pålitelighet.

Besvar også følgende hovedspørsmål:

- Hvilket eksperiment ga den største forskjellen, og hvor stor var den?
- Hvor i intervallet oppstod de største feilene?
- Hvilke store tall eller nesten-kanselleringer fant du?
- Hva var nesten usynlig for avlesningsavbildningen?
- Hvilke påstander har du vist matematisk, og hvilke bygger bare på numeriske
  forsøk?
- Hva lærte $T_{50}$-forsøket som ikke allerede var synlig ved grad 3?

## Leveranse

Lever én Quarto-side eller notebook med:

1. håndregnede $T_2,T_3,T_4$ og kontroll av rekursjonen;
2. oppvarmingsfigurene og observasjonene dine;
3. basis- og rangargumentet for $T_0,\ldots,T_4$;
4. begge avlesningsmatrisene i lav grad og nullromseksperimentet;
5. tabell og feilfigur for basiseksperimentet;
6. tabell, punktfigur og feilpolynom for forsøket med avlesningspunkter;
7. $T_{50}$-resultatene og forklaringen på sammenbruddet;
8. minst tre forsøk i den åpne utfordringen;
9. den samlede analysen.

Oppgi alltid grad, punkter, størrelsen på forstyrrelsen og rutenettstørrelse sammen
med et resultat. Ellers kan forsøket ikke gjentas.

:::: {.callout-warning}
## Om kodeassistenter og numeriske påstander

Kodeassistenter kan hjelpe med Python-syntaks og plotting, men de kan også
blande sammen effekten av basisvalg og plasseringen av avlesningspunktene. Du må kunne forklare
hvorfor hvert eksperiment bare endrer én av dem.

Et tall fra `np.linalg.solve` er ikke i seg selv en matematisk forklaring.
Kontroller dimensjoner, rang, residualer og hva koordinatene representerer.
Påstander om «stabilitet» skal støttes av konkrete forstyrrelser og beregnede
feil.
::::
