# Newtonfraktaler: Hvilken løsning finner iterasjonen?

Dette prosjektet er laget for omtrent **3–4 timer selvstendig arbeid**. Copilot og andre kodeassistenter er tillatt.

Når en ligning har flere løsninger, er det ikke nok å spørre om en metode
konvergerer. Vi må også spørre *hvilken* løsning den finner, hvor raskt den
kommer dit, og hvor mye svaret avhenger av startverdien. Newtons metode gjør
disse spørsmålene synlige på en særlig tydelig måte.

Metoden løser ligningen

$$
f(z)=0
$$

ved å gjenta

$$
z_{n+1}=z_n-\frac{f(z_n)}{f'(z_n)}.
$$

Dette er en fikspunktiterasjon med oppdateringsregel

$$
g(z)=z-\frac{f(z)}{f'(z)}.
$$

Her arbeider vi med komplekse tall $z=x+iy$. Ved å fargelegge hver startverdi
etter nullpunktet den finner, får vi et kart over metodens oppførsel. Noen
områder gir raske og forutsigbare iterasjoner. Langs grensene kan to nesten
like startverdier få helt forskjellige forløp. Mengden av startverdier som
konvergerer mot et bestemt nullpunkt, kalles nullpunktets
**tiltrekningsområde**.

> **Problemstilling:** Hva kjennetegner gode og dårlige startverdier for
> Newtons metode, og hvordan kan vi undersøke dette numerisk?

::: {.callout-tip}
## Hvordan jobbe med prosjektet

Koden for funksjonstildeling, Newton-iterasjon, rutenett, klassifisering og plotting er gitt. Arbeidet ditt er å planlegge numeriske eksperimenter, velge parametere, kontrollere resultatene og forklare det du observerer.

Dette er også en øvelse i å sette seg inn i eksisterende kode for en
modellmetode. Du skal ikke bygge alt fra bunnen av. Les kommentarene, kjør
koden, finn parameterne som styrer forsøket, og gjør små endringer du kan
kontrollere. Slik arbeider man ofte med vitenskapelig kode: forstå nok til å
stille et spørsmål, endre én ting, og undersøke hva som faktisk skjedde.

Endre én størrelse om gangen. Noter alltid startverdi eller plottevindu,
toleranse og `maxiter` sammen med resultatet. Målet er ikke bare å lage et
fraktalbilde, men å bruke bildet til å velge og begrunne numeriske forsøk.
:::

## 1. Du får tildelt en funksjon

Skriv fornavnet ditt i cellen under. Navnet normaliseres og hashes med SHA-256. Samme normaliserte fornavn gir alltid samme funksjon i dette prosjektet. Studenter med samme fornavn kan derfor få samme funksjon.

Tildelingen skjer lokalt i nettleseren. Navnet sendes ikke noe sted.

```{pyodide-python}
import hashlib
import unicodedata

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Patch


def normalize_name(name):
    """Gjør små navnevariasjoner irrelevante for funksjonstildelingen."""
    name = unicodedata.normalize("NFKD", name.strip().casefold())
    name = "".join(char for char in name
                   if not unicodedata.combining(char))
    return " ".join(name.split())


def function_id(first_name, number_of_functions):
    """Gjør fornavnet om til en stabil indeks i funksjonspuljen."""
    normalized = normalize_name(first_name)
    text = f"IMAX3011-newton-2026:{normalized}"
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    return int.from_bytes(digest[:8], byteorder="big") % number_of_functions


FUNCTIONS = [
    {"label": "A", "coefficients": [1, 0, 0, -1],
     "formula": "z³ − 1", "plot_window": (-2, 2, -2, 2)},
    {"label": "B", "coefficients": [1, -2j, -1, 2j],
     "formula": "(z − 1)(z + 1)(z − 2i)",
     "plot_window": (-2.5, 2.5, -2, 3)},
    {"label": "C", "coefficients": [1, 0, -2, -4],
     "formula": "(z − 2)(z + 1 − i)(z + 1 + i)",
     "plot_window": (-3, 3, -3, 3)},
    {"label": "D", "coefficients": [1, 0, 0, 0, -1],
     "formula": "z⁴ − 1", "plot_window": (-2, 2, -2, 2)},
    {"label": "E", "coefficients": [1, 0, -3.75, 0, -1],
     "formula": "(z − 2)(z + 2)(z − 0.5i)(z + 0.5i)",
     "plot_window": (-3, 3, -2.5, 2.5)},
    {"label": "F", "coefficients": [1, 0, 0, 1, 1],
     "formula": "z⁴ + z + 1", "plot_window": (-2.5, 2.5, -2.5, 2.5)},
    {"label": "G", "coefficients": [1, 0, 0, 0, 0, -1],
     "formula": "z⁵ − 1", "plot_window": (-2, 2, -2, 2)},
    {"label": "H", "coefficients": [1, -1.5, -0.5, -0.5, -1.5, 1],
     "formula": "(z − 2)(z + 1)(z − 0.5)(z − i)(z + i)",
     "plot_window": (-2.5, 2.5, -2.5, 2.5)},
    {"label": "I", "coefficients": [1, 0, 0, 0, -1, 1],
     "formula": "z⁵ − z + 1", "plot_window": (-2.5, 2.5, -2.5, 2.5)},
]


def prepare_function(entry):
    """Lag f, f', nullpunkter og kritiske punkter fra én tabellrad.

    Denne funksjonen gjør oppsettet for oss. I forsøkene nedenfor arbeider vi
    med f og df, og trenger vanligvis ikke å endre selve funksjonen her.
    """
    coefficients = np.asarray(entry["coefficients"], dtype=complex)
    derivative_coefficients = np.polyder(coefficients)
    roots = np.roots(coefficients)
    critical_points = np.roots(derivative_coefficients)

    def f(z):
        return np.polyval(coefficients, z)

    def df(z):
        return np.polyval(derivative_coefficients, z)

    return f, df, roots, critical_points


# Bytt teksten med ditt eget fornavn.
first_name = "Ada"

my_id = function_id(first_name, len(FUNCTIONS))
my_function = FUNCTIONS[my_id]
f, df, roots, critical_points = prepare_function(my_function)

print("Funksjons-ID:", my_function["label"])
print("Funksjon:    ", my_function["formula"])
print("Koeffisienter:", my_function["coefficients"])
print("Nullpunkter:")
for root in roots:
    print(" ", root)
print("Kritiske punkter (f'(z)=0):")
for point in critical_points:
    print(" ", point)
print("Standardvindu:", my_function["plot_window"])
```

Alle funksjonene i puljen har grad 3, 4 eller 5 og bare enkle nullpunkter.
**Skriv ned** funksjons-ID, funksjon, nullpunkter og standardvindu. Bruk den
tildelte funksjonen i resten av prosjektet.

## 2. Newtons metode for én startverdi

Før vi lager et kart med tusenvis av startverdier, følger vi noen få
iterasjoner trinn for trinn. Da kan vi se hva «rask» og «langsom» konvergens
betyr i praksis.

Programmet trenger en regel for å avgjøre når svaret er godt nok. Siden vi
prøver å løse $f(z)=0$, måler vi hvor nær funksjonsverdien er null. Størrelsen

$$
|f(z_n)|
$$

kalles **residualen**. Her stopper vi når

$$
|f(z_n)|<\texttt{tol},
$$

eller når `maxiter` er nådd. En liten residual betyr at den beregnede verdien
nesten oppfyller ligningen. Den er ikke det samme som avstanden til det
eksakte nullpunktet.

Vi registrerer også skrittlengden

$$
|z_{n+1}-z_n|=\left|\frac{f(z_n)}{f'(z_n)}\right|.
$$

Den forteller hvor mye iteratet flytter seg. Den er nyttig når vi skal forstå
store hopp, men i dette prosjektet er det residualen som avgjør konvergens.
Uttrykket $|z-f(z)|$ er ikke residualen til ligningen $f(z)=0$.

```{pyodide-python}
def is_finite_complex(z):
    """Sjekk at både real- og imaginærdelen kan brukes videre."""
    return np.isfinite(np.real(z)) and np.isfinite(np.imag(z))


def nearest_root(z, roots):
    """Returner nummeret til nullpunktet som ligger nærmest z."""
    return int(np.argmin(np.abs(roots - z)))


def newton_trace(f, df, roots, z0, tol=1e-8, maxiter=50,
                 derivative_tol=1e-14):
    """Følg én startverdi slik at vi kan se hva Newton faktisk gjør.

    I forsøkene endrer du først og fremst z0, tol og maxiter. Resultatet er en
    ordbok med stoppårsak, funnet nullpunkt og hele iterasjonshistorikken.
    derivative_tol beskytter oss mot å dele på et tall som er svært nær null.
    """
    z = complex(z0)
    history = [{"n": 0, "z": z,
                "residual": float(abs(f(z))), "step": np.nan}]

    if history[-1]["residual"] < tol:
        return {"z": z, "converged": True, "root": nearest_root(z, roots),
                "reason": "liten residual", "iterations": 0,
                "history": history}

    for n in range(1, maxiter + 1):
        derivative = df(z)
        if not is_finite_complex(derivative) or abs(derivative) <= derivative_tol:
            return {"z": z, "converged": False, "root": None,
                    "reason": "for liten derivert", "iterations": n-1,
                    "history": history}

        with np.errstate(over="ignore", divide="ignore", invalid="ignore"):
            z_new = z - f(z)/derivative

        if not is_finite_complex(z_new):
            return {"z": z_new, "converged": False, "root": None,
                    "reason": "ikke-endelig verdi", "iterations": n,
                    "history": history}

        step = float(abs(z_new-z))
        residual = float(abs(f(z_new)))
        history.append({"n": n, "z": z_new,
                        "residual": residual, "step": step})
        z = z_new

        if residual < tol:
            return {"z": z, "converged": True,
                    "root": nearest_root(z, roots),
                    "reason": "liten residual", "iterations": n,
                    "history": history}

    return {"z": z, "converged": False, "root": None,
            "reason": "maksimalt antall iterasjoner",
            "iterations": maxiter, "history": history}


def print_trace(result):
    """Skriv historikken fra newton_trace som en lesbar tabell."""
    print(" n                 z_n             |f(z_n)|       skrittlengde")
    for row in result["history"]:
        step = "     -" if np.isnan(row["step"]) else f"{row['step']:.3e}"
        print(f"{row['n']:2d}  {row['z']:>22.14g}   "
              f"{row['residual']:.3e}      {step}")
    print("\nStoppårsak:", result["reason"])
    print("Iterasjoner:", result["iterations"])
    if result["converged"]:
        print("Nærmeste nullpunkt:", roots[result["root"]])


def plot_trace(result):
    """Sammenlign residual og skrittlengde gjennom én iterasjon."""
    rows = result["history"]
    n = np.array([row["n"] for row in rows])
    residuals = np.array([row["residual"] for row in rows])
    steps = np.array([row["step"] for row in rows])

    plt.close("all")
    fig, ax = plt.subplots()
    ax.semilogy(n, residuals, "o-", label="Residual |f(zₙ)|")
    if len(steps) > 1:
        ax.semilogy(n[1:], steps[1:], "o-", label="Skritt |zₙ − zₙ₋₁|")
    ax.set_xlabel("Iterasjon n")
    ax.set_ylabel("Størrelse")
    ax.set_title("Residual og skrittlengde")
    ax.grid(True)
    ax.legend()
    plt.show()
```

Kjør først koden med de foreslåtte startverdiene. Legg deretter til minst to egne startverdier.

```{pyodide-python}
starting_values = [1.5, -1+1j, 0.1, 1j]

for z0 in starting_values:
    result = newton_trace(f, df, roots, z0, tol=1e-8, maxiter=50)
    print("\nStartverdi:", z0)
    print("  konvergert:", result["converged"])
    print("  iterasjoner:", result["iterations"])
    print("  stoppårsak:", result["reason"])
    print("  siste residual:", result["history"][-1]["residual"])
    if result["converged"]:
        print("  nullpunkt:", roots[result["root"]])
```

Velg én startverdi som konvergerer raskt, og én som konvergerer langsomt eller ikke konvergerer. Vis hele historikken og plottet for begge.

```{pyodide-python}
#| canvas: false
# Bytt startverdien med en verdi du vil undersøke nærmere.
z0 = -1 + 1j

result = newton_trace(f, df, roots, z0, tol=1e-8, maxiter=50)
print_trace(result)
plot_trace(result)
```

**Svar kort:**

1. Konvergerer alle startverdiene mot samme nullpunkt?
2. Avtar residualen i hvert eneste steg?
3. Avtar residual og skrittlengde i samme takt?
4. Hvorfor trenger programmet både en residualtoleranse og `maxiter`?
5. Hva skjer dersom et iterat kommer nær et punkt der $f'(z)=0$?

## 3. Tiltrekningsområder

Forsøkene med enkeltpunkter viser at startverdien betyr noe, men de sier lite
om hvor vanlig rask eller langsom konvergens er. Derfor gjentar vi samme
forsøk på et helt rutenett i det komplekse planet. Resultatet blir både et
kart og et datasett vi kan stille spørsmål til.

Neste funksjon kjører Newtons metode samtidig for hele rutenettet. Hvert punkt
klassifiseres som et nullpunktnummer, `-1` for ikke konvergert innen
`maxiter`, eller `-2` for ugyldig beregning.

```{pyodide-python}
def newton_grid(f, df, roots, bounds, nx=400, ny=400,
                tol=1e-8, maxiter=50, derivative_tol=1e-14):
    """Kjør det samme Newton-forsøket for alle pikslene i et rektangel.

    bounds velger delen av det komplekse planet vi ser. nx og ny bestemmer
    bildeoppløsningen, ikke nøyaktigheten til én Newton-iterasjon. Returverdien
    inneholder både funnet nullpunkt, iterasjonstall og sluttresidual.
    """
    xmin, xmax, ymin, ymax = bounds
    x = np.linspace(xmin, xmax, nx)
    y = np.linspace(ymin, ymax, ny)
    z = x[None, :] + 1j*y[:, None]

    basin = np.full(z.shape, -1, dtype=int)
    iterations = np.zeros(z.shape, dtype=int)
    # active forteller hvilke piksler som fortsatt trenger et nytt Newton-skritt.
    active = np.ones(z.shape, dtype=bool)

    for n in range(1, maxiter + 1):
        with np.errstate(over="ignore", divide="ignore", invalid="ignore"):
            derivative = df(z)
            safe = (active & np.isfinite(z.real) & np.isfinite(z.imag)
                    & np.isfinite(derivative.real)
                    & np.isfinite(derivative.imag)
                    & (np.abs(derivative) > derivative_tol))

            # Skill ugyldige beregninger fra dem som bare trenger flere steg.
            invalid = active & ~safe
            basin[invalid] = -2
            iterations[invalid] = n-1
            active[invalid] = False

            z[safe] = z[safe] - f(z[safe])/derivative[safe]
            finite = np.isfinite(z.real) & np.isfinite(z.imag)
            invalid_after = active & ~finite
            basin[invalid_after] = -2
            iterations[invalid_after] = n
            active[invalid_after] = False

            residual = np.full(z.shape, np.inf)
            residual[active] = np.abs(f(z[active]))
            converged = active & (residual < tol)

        if np.any(converged):
            # Først nå bestemmer vi hvilket nullpunkt pikslene endte ved.
            converged_values = z[converged]
            distances = np.abs(converged_values[:, None] - roots[None, :])
            basin[converged] = np.argmin(distances, axis=1)
            iterations[converged] = n
            active[converged] = False

        if not np.any(active):
            break

    iterations[active] = maxiter
    final_residual = np.full(z.shape, np.inf)
    finite = np.isfinite(z.real) & np.isfinite(z.imag)
    with np.errstate(over="ignore", invalid="ignore"):
        final_residual[finite] = np.abs(f(z[finite]))

    return {"basin": basin, "iterations": iterations,
            "residual": final_residual, "z": z,
            "bounds": bounds, "tol": tol, "maxiter": maxiter,
            "roots": roots}


ROOT_COLORS = np.array([
    [0.90, 0.20, 0.20], [0.20, 0.65, 0.95], [0.25, 0.80, 0.35],
    [0.90, 0.65, 0.15], [0.65, 0.35, 0.90], [0.20, 0.80, 0.80],
])


def plot_basins(data, title="Newtons metode: tiltrekningsområder",
                critical_points=None, iteration_cap=20):
    """Vis resultat og arbeidsmengde i hvert sitt panel.

    Venstre panel svarer på hvilket nullpunkt som ble funnet. Høyre panel
    viser antall iterasjoner. iteration_cap bestemmer hvor fargeskalaen
    stopper; større verdier vises fortsatt, men får samme endefarge.
    """
    basin = data["basin"]
    iterations = data["iterations"]
    maxiter = data["maxiter"]
    roots = data["roots"]
    xmin, xmax, ymin, ymax = data["bounds"]

    # Basin-fargen skal bare kode nullpunkt, ikke iterasjonstall.
    basin_image = np.full(basin.shape + (3,), 0.25)
    basin_image[basin == -2] = 0.0
    legend_handles = []
    for k in range(len(roots)):
        mask = basin == k
        color = ROOT_COLORS[k % len(ROOT_COLORS)]
        basin_image[mask] = color
        legend_handles.append(Patch(facecolor=color, label=f"Mot r{k+1}"))

    plt.close("all")
    fig, (ax_basin, ax_iterations) = plt.subplots(
        1, 2, figsize=(13, 6), constrained_layout=True
    )

    ax_basin.imshow(basin_image, origin="lower",
                    extent=(xmin, xmax, ymin, ymax),
                    interpolation="nearest")
    ax_basin.scatter(roots.real, roots.imag, c="white", edgecolors="black",
                     s=70, marker="o")
    for k, root in enumerate(roots):
        ax_basin.annotate(f"r{k+1}", (root.real, root.imag),
                          xytext=(7, 7), textcoords="offset points",
                          color="black", weight="bold")
    if critical_points is not None:
        critical_handle = ax_basin.scatter(
            critical_points.real, critical_points.imag,
            c="black", edgecolors="white", s=70, marker="X",
            linewidths=1.5, label="Kritiske punkter"
        )
        legend_handles.append(critical_handle)

    ax_basin.set_title("Funnet nullpunkt")
    ax_basin.legend(handles=legend_handles, loc="best")

    converged = basin >= 0
    # Avkort skalaen slik at noen få trege piksler ikke vasker ut hele kartet.
    capped_iterations = np.ma.masked_where(
        ~converged, np.minimum(iterations, iteration_cap)
    )
    iteration_image = ax_iterations.imshow(
        capped_iterations, origin="lower", extent=(xmin, xmax, ymin, ymax),
        interpolation="nearest", cmap="viridis",
        vmin=1, vmax=iteration_cap
    )
    ax_iterations.scatter(roots.real, roots.imag, c="white",
                          edgecolors="black", s=45, marker="o")
    colorbar = fig.colorbar(iteration_image, ax=ax_iterations, shrink=0.82)
    colorbar.set_label(
        f"Antall iterasjoner ({iteration_cap} = {iteration_cap} eller flere)"
    )
    ax_iterations.set_title("Iterasjoner før residualkravet er oppfylt")

    for ax in (ax_basin, ax_iterations):
        ax.set_xlabel("Re(z₀)")
        ax.set_ylabel("Im(z₀)")
        ax.set_aspect("equal")

    fig.suptitle(title)
    plt.show()


def summarize_grid(data):
    """Trekk ut noen få tall som gjør ulike rutenett sammenlignbare."""
    basin = data["basin"]
    iterations = data["iterations"]
    residual = data["residual"]
    converged = basin >= 0
    total = basin.size

    summary = {
        "total": total,
        "converged": int(np.count_nonzero(converged)),
        "not_converged": int(np.count_nonzero(basin == -1)),
        "invalid": int(np.count_nonzero(basin == -2)),
        "fraction_converged": float(np.mean(converged)),
        "mean_iterations": (float(np.mean(iterations[converged]))
                            if np.any(converged) else np.nan),
        "max_accepted_residual": (float(np.max(residual[converged]))
                                  if np.any(converged) else np.nan),
    }
    return summary


def print_summary(summary):
    """Skriv sammendraget uten at vi må huske alle nøkkelnavnene."""
    print("Antall startverdier:     ", summary["total"])
    print("Konvergert:              ", summary["converged"])
    print("Nådde maxiter:           ", summary["not_converged"])
    print("Ugyldig beregning:       ", summary["invalid"])
    print("Andel konvergert:        ", f"{summary['fraction_converged']:.4f}")
    print("Gjennomsnitt iterasjoner:", f"{summary['mean_iterations']:.2f}")
    print("Største godkjente residual:",
          f"{summary['max_accepted_residual']:.3e}")


```

Kjør standardeksperimentet. Dersom nettleseren arbeider langsomt, kan du først bruke `nx=250, ny=250` og øke oppløsningen til slutt.

```{pyodide-python}
#| canvas: false
bounds = my_function["plot_window"]

basin_data = newton_grid(
    f, df, roots,
    bounds=bounds,
    nx=400, ny=400,
    tol=1e-8,
    maxiter=50,
)

plot_basins(basin_data, f"Funksjon {my_function['label']}: {my_function['formula']}")
print_summary(summarize_grid(basin_data))
```

Figuren til venstre bruker én fast farge for hvert nullpunkt. Den svarer derfor
bare på *hvilket* nullpunkt metoden fant. Figuren til høyre viser antall
iterasjoner før residualkravet ble oppfylt. Les iterasjonstallet fra
fargeskalaen. Verdier på 20 eller mer får samme endefarge, slik at noen få
svært langsomme punkter ikke skjuler forskjellene i resten av kartet.

Mørkegrå punkter i venstre figur nådde `maxiter`, mens svarte punkter ga en
ugyldig beregning. Slike punkter er maskert i iterasjonskartet.

For resten av prosjektet bruker vi følgende målbare beskrivelser:

- En **rask** startverdi oppfyller residualkravet innen 6 iterasjoner.
- En **langsom** startverdi konvergerer, men trenger mer enn 15 iterasjoner.
- En **mislykket** startverdi når `maxiter` eller gir en ugyldig beregning.

Grensene 6 og 15 er arbeidsdefinisjoner for dette forsøket, ikke generelle
grenser for Newtons metode. I diskusjonen bruker vi langsomme og mislykkede
startverdier som konkrete eksempler på «dårlige» startverdier. Finn ett
eksempel i hver kategori som finnes i ditt datasett. Oppgi $z_0$, funnet
nullpunkt, iterasjonstall og siste residual.

Koden under foreslår startverdier fra kategoriene. Du kan bruke dem eller
velge punkter som er lettere å se i figuren.

```{pyodide-python}
def first_start_in(data, mask):
    """Finn én startverdi i en kategori, hvis kategorien finnes."""
    indices = np.argwhere(mask)
    if len(indices) == 0:
        return None
    row, col = indices[len(indices)//2]
    xmin, xmax, ymin, ymax = data["bounds"]
    ny, nx = data["basin"].shape
    x = np.linspace(xmin, xmax, nx)
    y = np.linspace(ymin, ymax, ny)
    return x[col] + 1j*y[row]


converged = basin_data["basin"] >= 0
categories = {
    "rask": converged & (basin_data["iterations"] <= 6),
    "langsom": converged & (basin_data["iterations"] > 15),
    "mislykket": basin_data["basin"] < 0,
}

for name, mask in categories.items():
    print(f"Forslag, {name}:", first_start_in(basin_data, mask))
```

**Svar kort:**

1. Hvilke områder konvergerer mot hvert nullpunkt?
2. Hvor ligger startverdiene som krever flest iterasjoner?
3. Hvordan skiller punkter nær en grense seg fra punkter langt inne i et tiltrekningsområde?
4. Ser figuren symmetrisk ut? Sammenlign med plasseringen av nullpunktene.
5. Kan et endelig rutenett bevise at alle startverdier i vinduet konvergerer?

## 4. Finner metoden alltid nærmeste nullpunkt?

En naturlig gjetning er at Newtons metode finner nullpunktet som ligger
nærmest startverdien. Nå kan vi teste denne gjetningen på hele rutenettet.
Koden under sammenligner nærmeste nullpunkt til $z_0$ med nullpunktet
iterasjonen faktisk fant.

```{pyodide-python}
def compare_with_nearest(data):
    """Test nærmeste-nullpunkt-gjetningen på hele rutenettet."""
    basin = data["basin"]
    roots = data["roots"]
    xmin, xmax, ymin, ymax = data["bounds"]
    ny, nx = basin.shape
    x = np.linspace(xmin, xmax, nx)
    y = np.linspace(ymin, ymax, ny)
    z0 = x[None, :] + 1j*y[:, None]

    nearest = np.argmin(np.abs(z0[..., None] - roots), axis=2)
    converged = basin >= 0
    different = converged & (basin != nearest)
    fraction = np.count_nonzero(different) / np.count_nonzero(converged)
    return {"nearest": nearest, "different": different,
            "fraction": fraction, "z0": z0}


nearest_test = compare_with_nearest(basin_data)
print("Andel konvergerte startverdier som ikke fant nærmeste nullpunkt:",
      f"{nearest_test['fraction']:.4f}")

indices = np.argwhere(nearest_test["different"])
print("Noen moteksempler:")
for row, col in indices[:5]:
    z0 = nearest_test["z0"][row, col]
    nearest_index = nearest_test["nearest"][row, col]
    found_index = basin_data["basin"][row, col]
    print(f"z₀={z0:.5g}: nærmest {roots[nearest_index]:.5g}, "
          f"men fant {roots[found_index]:.5g}")
```

Velg ett av moteksemplene og vis iterasjonshistorikken med `print_trace`.

**Svar kort:**

1. Hvor stor andel av de konvergerte startverdiene fant ikke nærmeste nullpunkt?
2. Hva skjer med avstanden til de ulike nullpunktene gjennom ditt valgte forløp?
3. Hvor i tiltrekningsplottet ligger de fleste moteksemplene?
4. Hva kan du nå si om påstanden «Newton finner nærmeste nullpunkt»?

## 5. Hvorfor kan noen startverdier gi store hopp?

I Newton-formelen deler vi på $f'(z_n)$. Når $f'(z_n)$ er nær null, kan ett
Newton-skritt derfor bli svært stort selv om funksjonsverdien ikke er stor.
Punkter som oppfyller $f'(z)=0$, kalles her **kritiske punkter**. De er ikke
nødvendigvis dårlige startverdier alene, men de gir oss steder det er naturlig
å undersøke nærmere.

```{pyodide-python}
#| canvas: false
plot_basins(basin_data,
            "Nullpunkter, kritiske punkter og tiltrekningsområder",
            critical_points=critical_points)

print("Kritiske punkter:")
for point in critical_points:
    print(" ", point, "  |f(z)| =", abs(f(point)))
```

Velg ett kritisk punkt $c$. Kjør `newton_trace` for $c$, $c+10^{-3}$ og
$c+10^{-2}i$. Oppgi stoppårsak, største skrittlengde, funnet nullpunkt og
antall iterasjoner. Du kan endre perturbasjonene dersom alle tre forsøkene
blir nesten like.

```{pyodide-python}
c = critical_points[0]  # Velg eventuelt et annet kritisk punkt.
critical_starts = [c, c + 1e-3, c + 1e-2j]

for z0 in critical_starts:
    result = newton_trace(f, df, roots, z0, tol=1e-8, maxiter=100)
    steps = [row["step"] for row in result["history"]
             if np.isfinite(row["step"])]
    largest_step = max(steps) if steps else np.nan
    found = roots[result["root"]] if result["converged"] else "ikke funnet"
    print(f"z₀={z0:.8g}: stopp={result['reason']}, "
          f"største skritt={largest_step:.3e}, "
          f"iterasjoner={result['iterations']}, nullpunkt={found}")
```

**Svar kort:**

1. Hva skjer når startverdien er nøyaktig et kritisk punkt?
2. Hvordan oppfører de to nærliggende startverdiene seg?
3. Ligger områder med mange iterasjoner nær noen av de kritiske punktene?
4. Er liten $|f'(z_0)|$ alene nok til å forutsi hele iterasjonsforløpet?

## 6. Hvor følsom er metoden nær en grense?

Tiltrekningsplottet antyder at en svært liten endring i startverdien kan endre
resultatet. For å gjøre dette til et kontrollert forsøk trenger vi et konkret
grensepunkt og en oppgitt perturbasjon. Funksjonen under foreslår et punkt
mellom to nabopiksler med forskjellig farge. Du kan bruke forslaget eller
velge et tydeligere punkt i din egen figur.

```{pyodide-python}
def suggest_boundary_point(data):
    """Finn et sentralt sted der to nabopiksler har forskjellig farge."""
    basin = data["basin"]
    left = basin[:, :-1]
    right = basin[:, 1:]
    candidates = np.argwhere((left >= 0) & (right >= 0) & (left != right))
    if len(candidates) == 0:
        raise ValueError("Fant ingen grense mellom to tiltrekningsområder")

    ny, nx = basin.shape
    margin_y = max(1, ny//20)
    margin_x = max(1, nx//20)
    interior = candidates[(candidates[:, 0] >= margin_y)
                          & (candidates[:, 0] < ny-margin_y)
                          & (candidates[:, 1] >= margin_x)
                          & (candidates[:, 1] < nx-margin_x)]
    if len(interior) > 0:
        candidates = interior

    center = np.array([ny/2, nx/2])
    row, col = candidates[np.argmin(np.sum((candidates-center)**2, axis=1))]
    xmin, xmax, ymin, ymax = data["bounds"]
    x = np.linspace(xmin, xmax, nx)
    y = np.linspace(ymin, ymax, ny)
    return (x[col] + x[col+1])/2 + 1j*y[row]


boundary_point = suggest_boundary_point(basin_data)
delta = 1e-3
nearby_starts = [boundary_point,
                 boundary_point + delta,
                 boundary_point + 1j*delta]

print("Foreslått grensepunkt:", boundary_point)
for z0 in nearby_starts:
    result = newton_trace(f, df, roots, z0, tol=1e-8, maxiter=100)
    found = roots[result["root"]] if result["converged"] else "ikke funnet"
    print(f"z₀={z0:.8g}: {result['iterations']} iterasjoner, "
          f"nullpunkt={found}, stopp={result['reason']}")
```

Hvis alle tre startverdiene gir samme resultat, flytt grensepunktet eller gjør
`delta` mindre. Vis iterasjonshistorikken for to nærliggende startverdier som
finner forskjellige nullpunkter.

**Svar kort:**

1. Hvor stor var avstanden mellom de to valgte startverdiene?
2. Når begynte iterasjonsforløpene å bli tydelig forskjellige?
3. Fant de ulike nullpunkter, eller var forskjellen bare antall iterasjoner?
4. Er samme følsomhet synlig langt inne i et ensfarget område?

## 7. Kontroller stoppreglene

Fargene i kartet avhenger også av reglene i programmet. Før du konkluderer,
kontroller at hovedresultatet ikke bare skyldes ett tilfeldig valg av
toleranse eller `maxiter`. Bruk et mindre rutenett for å spare tid.

```{pyodide-python}
print("      tol  maxiter  konvergert  nådde grensen  gj.snitt steg")
for tolerance, maximum in [(1e-4, 50), (1e-8, 50),
                           (1e-12, 50), (1e-8, 15), (1e-8, 100)]:
    data = newton_grid(f, df, roots, bounds, nx=250, ny=250,
                       tol=tolerance, maxiter=maximum)
    summary = summarize_grid(data)
    print(f"{tolerance:9.0e}  {maximum:7d}  {summary['converged']:10d}  "
          f"{summary['not_converged']:13d}  "
          f"{summary['mean_iterations']:13.2f}")
```

Forklar med konkrete tall hvordan en strengere toleranse og en større
`maxiter` påvirker klassifiseringen. Betyr «nådde `maxiter`» at den matematiske
følgen divergerer? Betyr $|f(z_n)|<10^{-12}$ nødvendigvis at
$|z_n-r|<10^{-12}$?

## 8. Sluttoppdraget: Når blir grensen ferdig?

Tenk deg at du skal lage et digitalt kart over tiltrekningsområdene. På den
første skjermen ser grensene nesten ut som vanlige kurver. Du øker
oppløsningen for å gjøre kartet skarpere, men da dukker det opp nye bukter,
øyer og smale striper. Zoomer du inn, skjer det samme igjen.

Nå skal du undersøke om høyere oppløsning bare tegner den samme kanten bedre,
eller om den faktisk avdekker mer grense. Dette er prosjektets mest åpne del:
koden teller for deg, men du må velge et forsøk som gir en rimelig
sammenligning og avgjøre hva tallene kan fortelle.

### Før du måler

Vi kaller en piksel en **grensepiksel** dersom minst én nabo over, under, til
venstre eller til høyre konvergerer mot et annet nullpunkt. Dette er en regel
for et digitalt bilde, ikke en eksakt matematisk definisjon av fraktalgrensen.

Hold plottevindu, `tol` og `maxiter` faste. Bare oppløsningen skal endres.
Skriv først ned hvilken av disse hypotesene du tror passer best:

- **Vanlig kurve:** Når oppløsningen dobles, blir antall grensepiksler omtrent
  dobbelt så stort.
- **Romfyllende grense:** Når oppløsningen dobles, blir antallet omtrent fire
  ganger så stort.
- **Mellomting:** Veksten ligger systematisk mellom disse ytterpunktene.

### Bygg et digitalt grensekart

Funksjonen under markerer begge sider av en fargeovergang. Les koden og
forklar kort hvorfor vi sammenligner både vannrette og loddrette naboer.

```{pyodide-python}
def boundary_mask(data):
    """Marker piksler som ligger ved en overgang mellom to basin-farger.

    Vi teller bare overganger mellom konvergerte punkter. Ugyldige punkter og
    punkter som nådde maxiter får derfor ikke lage en kunstig basin-grense.
    """
    basin = data["basin"]
    boundary = np.zeros(basin.shape, dtype=bool)

    # Vannrette naboer: kolonne j og j+1.
    valid_horizontal = (basin[:, :-1] >= 0) & (basin[:, 1:] >= 0)
    changes_horizontal = valid_horizontal & (basin[:, :-1] != basin[:, 1:])
    boundary[:, :-1] |= changes_horizontal
    boundary[:, 1:] |= changes_horizontal

    # Loddrette naboer: rad i og i+1.
    valid_vertical = (basin[:-1, :] >= 0) & (basin[1:, :] >= 0)
    changes_vertical = valid_vertical & (basin[:-1, :] != basin[1:, :])
    boundary[:-1, :] |= changes_vertical
    boundary[1:, :] |= changes_vertical
    return boundary


def plot_boundary_mask(data, title="Digitalt grensekart"):
    """Vis hvilke piksler telleregelen vår kaller grensepiksler."""
    xmin, xmax, ymin, ymax = data["bounds"]
    mask = boundary_mask(data)

    plt.close("all")
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.imshow(mask, origin="lower", extent=(xmin, xmax, ymin, ymax),
              cmap="binary", interpolation="nearest")
    ax.set_xlabel("Re(z₀)")
    ax.set_ylabel("Im(z₀)")
    ax.set_title(title)
    ax.set_aspect("equal")
    plt.show()
```

### Mål hva som skjer når oppløsningen dobles

`boundary_experiment` gjenbruker Newton-koden på samme vindu. Start med
oppløsningene 100, 200 og 400. Bruk 800 bare dersom nettleseren håndterer det
greit.

```{pyodide-python}
def boundary_experiment(test_bounds, resolutions=(100, 200, 400),
                        tol=1e-8, maxiter=50):
    """Tell grensepiksler for flere oppløsninger i nøyaktig samme vindu."""
    results = {}
    print(" oppløsning   grensepiksler   andel av bildet")

    for resolution in resolutions:
        data = newton_grid(
            f, df, roots, test_bounds,
            nx=resolution, ny=resolution, tol=tol, maxiter=maxiter
        )
        count = int(np.count_nonzero(boundary_mask(data)))
        results[resolution] = {"data": data, "count": count}
        print(f" {resolution:10d}   {count:14d}   "
              f"{count/data['basin'].size:15.5f}")

    print("\nVekst når oppløsningen økes:")
    sizes = list(resolutions)
    for old, new in zip(sizes[:-1], sizes[1:]):
        growth = results[new]["count"] / results[old]["count"]
        dimension = np.log(growth) / np.log(new/old)
        print(f" {old:4d} → {new:4d}: faktor {growth:.3f}, "
              f"D-estimat {dimension:.3f}")

    return results


resolution_results = boundary_experiment(bounds)
```

Tallet $D$ er et grovt skaleringsestimat. En dobling med vekstfaktor 2 gir
$D\approx1$, mens vekstfaktor 4 gir $D\approx2$. Vi bruker ikke noen få
rutenett til å fastslå en eksakt fraktaldimensjon. Estimatet er et verktøy for
å sammenligne hypotesene.

Vis grensekartet med høyeste oppløsning:

```{pyodide-python}
#| canvas: false
highest_resolution = max(resolution_results)
plot_boundary_mask(
    resolution_results[highest_resolution]["data"],
    f"Grensepiksler ved {highest_resolution} × {highest_resolution}"
)
```

### Dra på ekspedisjon langs grensen

Målingen over blander rolige og svært kompliserte deler av grensen. Velg nå
ett område du synes er interessant. Start gjerne med forslaget fra del 6, men
flytt sentrum dersom zoom-bildet bare inneholder én farge.

```{pyodide-python}
#| canvas: false
def square_bounds(center, width):
    """Lag et kvadratisk plottevindu rundt et komplekst sentrum."""
    half = width/2
    return (center.real-half, center.real+half,
            center.imag-half, center.imag+half)


# Endre disse to verdiene og kjør cellen på nytt for hvert zoomnivå.
zoom_center = boundary_point
zoom_width = min(bounds[1]-bounds[0], bounds[3]-bounds[2]) / 5
local_bounds = square_bounds(zoom_center, zoom_width)

local_data = newton_grid(
    f, df, roots, local_bounds,
    nx=400, ny=400, tol=1e-8, maxiter=100
)
plot_basins(local_data, f"Grenseekspedisjon, bredde={zoom_width:.3g}")
```

Lag minst tre zoomnivåer. Gjør bredden omtrent ti ganger mindre hver gang,
men juster sentrum slik at en grense fortsatt er synlig. Noter sentrum,
bredde, synlige basin-farger og største iterasjonstall for hvert nivå.

Til slutt kjører du `boundary_experiment(local_bounds)` i det siste vinduet.
Da kan du sammenligne skaleringsestimatet fra hele standardvinduet med et
område du selv har valgt fordi det ser komplisert ut.

### Kartleggerens rapport

Svar samlet, ikke som løsrevne énlinjessvar:

1. Hvilken hypotese skrev du ned før forsøket, og støttet målingene den?
2. Hvordan vokste antall grensepiksler når oppløsningen ble doblet?
3. Stabiliserte $D$-estimatene seg, eller endret de seg med oppløsningen?
4. Hva nytt dukket opp da du zoomet inn? Så du nøyaktige kopier eller bare
   nye mønstre med lignende kompleksitet?
5. Var det lokale området mer eller mindre komplisert enn hele vinduet etter
   måleregelen vår?
6. Hvordan kan `tol`, `maxiter`, valg av naboer og pikseloppløsning påvirke
   antall registrerte grensepiksler?
7. Hvilken evidens har du for at grensen er fraktallignende?
8. Hvorfor er ikke tre oppløsninger og tre zoomnivåer et matematisk bevis på
   at detaljene fortsetter på alle skalaer?

## 9. Konklusjon

Skriv en samlet konklusjon på omtrent 200–300 ord. Den skal svare på:

- Hvordan påvirker startverdien hvilket nullpunkt Newtons metode finner?
- Hvor er konvergensen rask, og hvor kreves mange iterasjoner?
- Finner metoden alltid nullpunktet som ligger nærmest startverdien?
- Hvilken rolle ser de kritiske punktene ut til å spille?
- Hva viste perturbasjonsforsøket nær en grense?
- Hva viste oppløsnings- og zoomforsøket om kompleksiteten til grensen?
- Hvordan påvirker residualtoleransen og `maxiter` klassifiseringen?
- Hvilke påstander bygger på numeriske eksperimenter, og hva kan eksperimentene ikke bevise?
- Når mener du det er forsvarlig å rapportere at metoden har konvergert?

## Leveranse

Lever én Quarto-side eller notebook med:

1. tildelt funksjon og nullpunkter,
2. analyserte iterasjonshistorikker for raske, langsomme og følsomme startverdier,
3. hovedfigur med tiltrekningsområder og iterasjonskart,
4. test av om nærmeste nullpunkt blir funnet,
5. undersøkelse av ett kritisk punkt,
6. perturbasjonsforsøk nær en grense,
7. kontroll av toleranse og `maxiter`,
8. grensekart, oppløsningstabell, zoomserie og kartleggerens rapport,
9. konkrete parameterverdier og konklusjonen.

::: {.callout-warning}
## Om bruk av kodeassistenter

Copilot og andre kodeassistenter er tillatt. Du er likevel ansvarlig for at stoppkriteriet har en matematisk betydning, at ugyldige og ikke-konvergente beregninger behandles separat, at figurene viser det du sier de viser, og at konklusjonene støttes av egne resultater.

Kode som produserer en figur, er ikke i seg selv en analyse.
:::
