# Newtonfraktaler: Hvilken løsning finner iterasjonen?

Dette prosjektet er laget for omtrent **3–4 timer selvstendig arbeid**. Copilot og andre kodeassistenter er tillatt.

Newtons metode kan brukes til å løse ligningen

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

Her arbeider vi med komplekse tall $z=x+iy$. En startverdi kan konvergere mot ulike nullpunkter, og små endringer i startverdien kan endre hvilket nullpunkt metoden finner. Mengden av startverdier som konvergerer mot et bestemt nullpunkt, kalles nullpunktets **tiltrekningsområde**.

> **Problemstilling:** Hvordan avhenger Newton-metodens resultat, residual og antall iterasjoner av startverdien i det komplekse planet?

::: {.callout-tip}
## Hvordan jobbe med prosjektet

Koden for funksjonstildeling, Newton-iterasjon, rutenett, klassifisering og plotting er gitt. Arbeidet ditt er å planlegge numeriske eksperimenter, velge parametere, kontrollere resultatene og forklare det du observerer.

Endre én størrelse om gangen. Noter alltid startverdi eller plottevindu, residualtoleranse og `maxiter` sammen med resultatet.
:::

::: {.callout-important}
## Tre størrelser som ikke må blandes

For den opprinnelige ligningen $f(z)=0$ bruker vi ligningsresidualen

$$
|f(z_n)|.
$$

Fikspunktresidualen og Newton-skrittet er

$$
|z_n-g(z_n)|
=\left|\frac{f(z_n)}{f'(z_n)}\right|
=|z_{n+1}-z_n|.
$$

Uttrykket $|z-f(z)|$ er ikke residualen til ligningen $f(z)=0$.
:::

## 1. Du får tildelt en funksjon

Skriv fornavnet ditt i cellen under. Navnet normaliseres og hashes med SHA-256. Samme normaliserte fornavn gir alltid samme funksjon i dette prosjektet. Studenter med samme fornavn kan derfor få samme funksjon.

Tildelingen skjer lokalt i nettleseren. Navnet sendes ikke noe sted.

```{pyodide-python}
import hashlib
import unicodedata

import numpy as np
import matplotlib.pyplot as plt


def normalize_name(name):
    name = unicodedata.normalize("NFKD", name.strip().casefold())
    name = "".join(char for char in name
                   if not unicodedata.combining(char))
    return " ".join(name.split())


def function_id(first_name, number_of_functions):
    normalized = normalize_name(first_name)
    text = f"IMAX3011-newton-2026:{normalized}"
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    return int.from_bytes(digest[:8], byteorder="big") % number_of_functions


FUNCTIONS = [
    {"label": "A", "coefficients": [1, 0, 0, -1],
     "formula": "z³ − 1", "plot_window": (-2, 2, -2, 2)},
    {"label": "B", "coefficients": [1, 0, 0, 1],
     "formula": "z³ + 1", "plot_window": (-2, 2, -2, 2)},
    {"label": "C", "coefficients": [1, 0, -1, 0],
     "formula": "z³ − z", "plot_window": (-2, 2, -2, 2)},
    {"label": "D", "coefficients": [1, 0, -2, 2],
     "formula": "z³ − 2z + 2", "plot_window": (-2.5, 2.5, -2.5, 2.5)},
    {"label": "E", "coefficients": [1, 0, -2, -2],
     "formula": "z³ − 2z − 2", "plot_window": (-2.5, 2.5, -2.5, 2.5)},
    {"label": "F", "coefficients": [1, 0, 2, -2],
     "formula": "z³ + 2z − 2", "plot_window": (-2.5, 2.5, -2.5, 2.5)},
]


def prepare_function(entry):
    coefficients = np.asarray(entry["coefficients"], dtype=complex)
    derivative_coefficients = np.polyder(coefficients)
    roots = np.roots(coefficients)

    def f(z):
        return np.polyval(coefficients, z)

    def df(z):
        return np.polyval(derivative_coefficients, z)

    return f, df, roots


# Bytt teksten med ditt eget fornavn.
first_name = "Ada"

my_id = function_id(first_name, len(FUNCTIONS))
my_function = FUNCTIONS[my_id]
f, df, roots = prepare_function(my_function)

print("Funksjons-ID:", my_function["label"])
print("Funksjon:    ", my_function["formula"])
print("Koeffisienter:", my_function["coefficients"])
print("Nullpunkter:")
for root in roots:
    print(" ", root)
print("Standardvindu:", my_function["plot_window"])
```

**Skriv ned** funksjons-ID, funksjon, nullpunkter og standardvindu. Bruk den tildelte funksjonen i resten av prosjektet.

## 2. Newtons metode for én startverdi

Før vi undersøker tusenvis av startverdier, følger vi noen få iterasjoner trinn for trinn. Funksjonen under stopper når ligningsresidualen tilfredsstiller

$$
|f(z_n)|<\texttt{tol},
$$

eller når `maxiter` er nådd. Den stopper også dersom $f'(z_n)$ blir for liten til at Newton-skrittet kan beregnes pålitelig, eller dersom beregningen gir `nan` eller `inf`.

```{pyodide-python}
def is_finite_complex(z):
    return np.isfinite(np.real(z)) and np.isfinite(np.imag(z))


def nearest_root(z, roots):
    return int(np.argmin(np.abs(roots - z)))


def newton_trace(f, df, roots, z0, tol=1e-8, maxiter=50,
                 derivative_tol=1e-14):
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

Neste funksjon kjører Newtons metode samtidig for et helt rutenett. Hvert punkt klassifiseres som et nullpunktnummer, `-1` for ikke konvergert innen `maxiter`, eller `-2` for ugyldig beregning.

```{pyodide-python}
def newton_grid(f, df, roots, bounds, nx=400, ny=400,
                tol=1e-8, maxiter=50, derivative_tol=1e-14):
    xmin, xmax, ymin, ymax = bounds
    x = np.linspace(xmin, xmax, nx)
    y = np.linspace(ymin, ymax, ny)
    z = x[None, :] + 1j*y[:, None]

    basin = np.full(z.shape, -1, dtype=int)
    iterations = np.zeros(z.shape, dtype=int)
    active = np.ones(z.shape, dtype=bool)

    for n in range(1, maxiter + 1):
        with np.errstate(over="ignore", divide="ignore", invalid="ignore"):
            derivative = df(z)
            safe = (active & np.isfinite(z.real) & np.isfinite(z.imag)
                    & np.isfinite(derivative.real)
                    & np.isfinite(derivative.imag)
                    & (np.abs(derivative) > derivative_tol))

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


def plot_basins(data, title="Newtons metode: tiltrekningsområder"):
    basin = data["basin"]
    iterations = data["iterations"]
    maxiter = data["maxiter"]
    roots = data["roots"]
    xmin, xmax, ymin, ymax = data["bounds"]

    image = np.full(basin.shape + (3,), 0.12)
    image[basin == -2] = 0.0
    for k in range(len(roots)):
        mask = basin == k
        brightness = 0.35 + 0.65*(1-iterations[mask]/maxiter)
        image[mask] = ROOT_COLORS[k % len(ROOT_COLORS)]*brightness[:, None]

    plt.close("all")
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.imshow(image, origin="lower", extent=(xmin, xmax, ymin, ymax),
              interpolation="nearest")
    ax.scatter(roots.real, roots.imag, c="white", edgecolors="black",
               s=70, marker="o", label="Nullpunkter")
    ax.set_xlabel("Re(z₀)")
    ax.set_ylabel("Im(z₀)")
    ax.set_title(title)
    ax.set_aspect("equal")
    ax.legend()
    plt.show()


def summarize_grid(data):
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
    print("Antall startverdier:     ", summary["total"])
    print("Konvergert:              ", summary["converged"])
    print("Nådde maxiter:           ", summary["not_converged"])
    print("Ugyldig beregning:       ", summary["invalid"])
    print("Andel konvergert:        ", f"{summary['fraction_converged']:.4f}")
    print("Gjennomsnitt iterasjoner:", f"{summary['mean_iterations']:.2f}")
    print("Største godkjente residual:",
          f"{summary['max_accepted_residual']:.3e}")


def plot_iteration_histogram(data):
    converged_iterations = data["iterations"][data["basin"] >= 0]
    plt.close("all")
    fig, ax = plt.subplots()
    ax.hist(converged_iterations,
            bins=np.arange(0.5, data["maxiter"]+1.5, 1))
    ax.set_xlabel("Antall iterasjoner")
    ax.set_ylabel("Antall startverdier")
    ax.set_title("Iterasjoner før residualkravet er oppfylt")
    ax.grid(True)
    plt.show()
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
plot_iteration_histogram(basin_data)
```

Fargen viser hvilket nullpunkt iterasjonen fant. Lysstyrken viser antall iterasjoner: lyse punkter konvergerte med færre iterasjoner enn mørke punkter. Mørkegrå punkter nådde `maxiter`, mens svarte punkter ga en ugyldig beregning.

**Svar kort:**

1. Hvilke områder konvergerer mot hvert nullpunkt?
2. Hvor ligger startverdiene som krever flest iterasjoner?
3. Hvordan skiller punkter nær en grense seg fra punkter langt inne i et tiltrekningsområde?
4. Ser figuren symmetrisk ut? Sammenlign med plasseringen av nullpunktene.
5. Kan et endelig rutenett bevise at alle startverdier i vinduet konvergerer?

## 4. Hva gjør toleransen?

Bruk samme rutenett og `maxiter=50`, men sammenlign

$$
\texttt{tol}=10^{-4},\quad 10^{-8},\quad 10^{-12}.
$$

```{pyodide-python}
tolerance_results = {}

for tolerance in [1e-4, 1e-8, 1e-12]:
    data = newton_grid(f, df, roots, bounds, nx=300, ny=300,
                       tol=tolerance, maxiter=50)
    tolerance_results[tolerance] = data
    summary = summarize_grid(data)
    print(f"\ntol = {tolerance:.0e}")
    print_summary(summary)
```

Lag en tabell med toleranse, andel konvergerte punkter, gjennomsnittlig antall iterasjoner, største godkjente residual og antall punkter som nådde `maxiter`.

Velg deretter to toleranser og vis tiltrekningsområdene ved siden av hverandre eller som to separate figurer.

```{pyodide-python}
#| canvas: false
# Endre toleransen for å vise en annen beregning.
tolerance_to_plot = 1e-12
plot_basins(tolerance_results[tolerance_to_plot],
            f"Tiltrekningsområder med tol={tolerance_to_plot:.0e}")
```

**Svar kort:**

1. Hvordan påvirker en strengere toleranse antall iterasjoner?
2. Endrer noen startverdier klassifisering?
3. Er forskjellene størst inne i områdene eller nær grensene?
4. Betyr residualkravet $|f(z_n)|<10^{-12}$ nødvendigvis at $|z_n-r|<10^{-12}$?
5. Hvilken toleranse ville du brukt i hovedfiguren? Begrunn med måleresultater.

## 5. Hva gjør `maxiter`?

Hold `tol=1e-8` fast, og sammenlign `maxiter=10`, `30` og `100`.

```{pyodide-python}
maxiter_results = {}

print(" maxiter   konvergert   nådde grensen   ugyldig   gj.snitt steg")
for maximum in [10, 30, 100]:
    data = newton_grid(f, df, roots, bounds, nx=300, ny=300,
                       tol=1e-8, maxiter=maximum)
    maxiter_results[maximum] = data
    summary = summarize_grid(data)
    print(f" {maximum:7d}   {summary['converged']:10d}   "
          f"{summary['not_converged']:13d}   {summary['invalid']:7d}   "
          f"{summary['mean_iterations']:12.2f}")
```

**Svar kort:**

1. Hvor mange punkter som feiler ved `maxiter=10`, konvergerer når grensen økes?
2. Betyr «nådde `maxiter`» at den matematiske følgen divergerer?
3. Hvor i tiltrekningsplottet ligger punktene som trenger mer enn 30 iterasjoner?
4. Hvilken `maxiter` gir en rimelig balanse mellom regnetid og feilklassifisering for ditt rutenett?

## 6. Zoom inn på en grense

Velg et rektangel der to eller tre farger ligger tett sammen. Bruk først et moderat rutenett. Zoom deretter inn én gang til ved å gjøre intervallet mindre.

```{pyodide-python}
#| canvas: false
# Eksempelvindu. Bytt grensene slik at de passer din figur.
zoom_bounds = (-0.5, 0.5, -0.5, 0.5)

zoom_data = newton_grid(
    f, df, roots,
    bounds=zoom_bounds,
    nx=500, ny=500,
    tol=1e-8,
    maxiter=100,
)

plot_basins(zoom_data, "Forstørrelse av en grense")
print_summary(summarize_grid(zoom_data))
```

For hvert zoomnivå skal du oppgi plottevindu, rutenettstørrelse, toleranse og `maxiter`.

**Svar kort:**

1. Blir grensen enklere eller mer detaljert når du zoomer inn?
2. Finn to startverdier som ligger nær hverandre, men konvergerer mot forskjellige nullpunkter.
3. Sammenlign iterasjonshistorikken for de to startverdiene.
4. Hva forteller eksperimentet om følsomhet for startverdien?

## 7. Konklusjon

Skriv en samlet konklusjon på omtrent 200–300 ord. Den skal svare på:

- Hvordan påvirker startverdien hvilket nullpunkt Newtons metode finner?
- Hvor er konvergensen rask, og hvor kreves mange iterasjoner?
- Hvordan påvirker residualtoleransen og `maxiter` klassifiseringen?
- Hvilke påstander bygger på numeriske eksperimenter, og hva kan eksperimentene ikke bevise?
- Når mener du det er forsvarlig å rapportere at metoden har konvergert?

## Leveranse

Lever én Quarto-side eller notebook med:

1. tildelt funksjon og nullpunkter,
2. to analyserte iterasjonshistorikker,
3. hovedfigur med tiltrekningsområder og histogram,
4. tabell for tre toleranser,
5. tabell for tre verdier av `maxiter`,
6. minst to zoomnivåer ved en grense,
7. konkrete parameterverdier for alle figurer,
8. konklusjonen.

::: {.callout-warning}
## Om bruk av kodeassistenter

Copilot og andre kodeassistenter er tillatt. Du er likevel ansvarlig for at stoppkriteriet har en matematisk betydning, at ugyldige og ikke-konvergente beregninger behandles separat, at figurene viser det du sier de viser, og at konklusjonene støttes av egne resultater.

Kode som produserer en figur, er ikke i seg selv en analyse.
:::
