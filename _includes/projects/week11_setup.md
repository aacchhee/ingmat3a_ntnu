```{pyodide-python}
#| label: project-week11-setup
#| autorun: true
#| context: setup
# Grunndata og hjelpere for prosjektet. Alle tall er oppdiktede og forenklede.
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import linprog

# Ett prisområde (del 1-2): kostnad i kr/MWh og kapasitet i MW.
plant_names = ['vind', 'vannkraft', 'import', 'gass']
cost = np.array([0., 10., 40., 70.])
capacity = np.array([30., 50., 30., 40.])

# Tre timer (del 4): forbruk og tilgjengelig vind i hver time (MW),
# og vannmengden som vannkraften kan bruke til sammen (MWh).
demand3 = np.array([60., 95., 120.])
wind3 = np.array([30., 10., 20.])
water = 120.


# Samme funksjon som i del 1b, slik at senere celler virker etter ny innlasting.
def one_zone(D):
    return linprog(cost, A_eq=[np.ones(4)], b_eq=[D],
                   bounds=list(zip(np.zeros(4), capacity)), method="highs")


# Samme funksjon som i del 3b. Variabler: vind N, vannkraft N, import S, gass S, flyt f.
def two_zones(L, wind_north=20.):
    c = np.array([0., 10., 40., 70., 0.])
    A_eq = np.array([[1., 1., 0., 0., -1.],
                     [0., 0., 1., 1., 1.]])
    bounds = [(0, wind_north), (0, 80), (0, 30), (0, 80), (-L, L)]
    return linprog(c, A_eq=A_eq, b_eq=[30., 80.], bounds=bounds, method="highs")


# Samme tre-timersmodell som i del 4, men med tom vannrad (den fyller du inn der).
def _three_hours():
    c3 = np.tile(cost, 3)
    bounds3 = []
    for h in range(3):
        bounds3 += [(0, wind3[h]), (0, 50.), (0, 30.), (0, 40.)]
    A_eq3 = np.zeros((3, 12))
    for h in range(3):
        A_eq3[h, 4*h:4*h + 4] = 1
    return c3, bounds3, A_eq3


c3, bounds3, A_eq3 = _three_hours()
A_water = np.zeros((1, 12))


def water_row_ok(A_water):
    """Varsler hvis vannraden fra 4a ennå bare består av nuller."""
    if not np.any(A_water):
        print("Obs: vannraden er tom. Kjør cellen i 4a med vannraden din først.")
        return False
    return True


def with_battery(power, A_water, W=water):
    """Tre-timersmodellen med vannraden din og et batteri (del 5).
    Variabler: (vind, vann, import, gass) for hver time, lading l1-l3, utlading u1-u3.
    Lading er ekstra forbruk, utlading ekstra produksjon. Lagret mengde etter
    time h er (l1 - u1) + ... + (lh - uh), mellom 0 og power MWh, og 0 etter time 3.
    power = 0 gir modellen uten batteri."""
    water_row_ok(A_water)
    c = np.r_[np.tile(cost, 3), np.zeros(6)]
    bounds = []
    for h in range(3):
        bounds += [(0, wind3[h]), (0, 50.), (0, 30.), (0, 40.)]
    bounds += [(0, power)]*6
    A_eq = np.zeros((3, 18))
    for h in range(3):
        A_eq[h, 4*h:4*h + 4] = 1
        A_eq[h, 12 + h], A_eq[h, 15 + h] = -1, 1
    rows = [np.r_[np.ravel(A_water), np.zeros(6)]]
    rhs = [W]
    for h in range(3):
        upto = (np.arange(3) <= h)*1.
        level = np.r_[np.zeros(12), upto, -upto]
        rows += [level, -level]
        rhs += [power, 0.]
    rows.append(np.r_[np.zeros(12), np.ones(3), -np.ones(3)])
    rhs.append(0.)
    return linprog(c, A_ub=np.array(rows), b_ub=rhs, A_eq=A_eq, b_eq=demand3,
                   bounds=bounds, method="highs")


# Tegnehjelpere: de tegner bare tall som allerede er regnet ut.
def show_merit_order(cost, capacity, D, names=plant_names):
    """Tilbudstrappen: hvert kraftverk er en blokk med bredde = kapasitet og
    høyde = kostnad, sortert billigst først. Den røde linjen er forbruket D."""
    fig, ax = plt.subplots(figsize=(7, 3.5), layout="constrained")
    left = 0.
    for i in np.argsort(cost, kind="stable"):
        ax.bar(left, max(cost[i], 1.5), width=capacity[i], align="edge",
               alpha=.6, edgecolor="k")
        ax.text(left + capacity[i]/2, max(cost[i], 1.5) + 2,
                f"{names[i]}\n{cost[i]:g} kr", ha="center", va="bottom", fontsize=8)
        left += capacity[i]
    ax.axvline(D, color="tab:red", lw=2)
    ax.text(D, 92, f" D = {D:g} MW", color="tab:red", va="top")
    ax.set(xlim=(0, left), ylim=(0, 95), ylabel="kostnad (kr/MWh)",
           xlabel="samlet kapasitet, billigste først (MW)")
    plt.show()


def show_steps(x, steps, smooth=None, xlabel="", ylabel="kr/MWh",
               labels=("Pris (dual)", "Gjennomsnittskostnad")):
    """Trappekurve (dualverdier) og eventuelt en glatt kurve i samme figur."""
    fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
    ax.step(x, steps, where="mid", label=labels[0])
    if smooth is not None:
        ax.plot(x, smooth, label=labels[1])
        ax.legend()
    ax.set(xlabel=xlabel, ylabel=ylabel)
    ax.grid(alpha=.3)
    plt.show()


def show_two_zones(res, L):
    """Nord og sør som to bokser med produksjon og pris, og linjen som en pil."""
    x, (pN, pS), f = res.x, res.eqlin.marginals, res.x[4]
    fig, ax = plt.subplots(figsize=(7, 2.8), layout="constrained")
    boxes = [(0.02, "NORD (forbruk 30 MW)", [("vind", x[0]), ("vannkraft", x[1])], pN),
             (0.62, "SØR (forbruk 80 MW)", [("import", x[2]), ("gass", x[3])], pS)]
    for x0, title, plants, price in boxes:
        ax.add_patch(plt.Rectangle((x0, .08), .36, .84, fill=False, lw=1.5))
        lines = [title] + [f"{n}: {v:g} MW" for n, v in plants] + [f"pris: {price + 0:g} kr/MWh"]
        ax.text(x0 + .18, .5, "\n".join(lines), ha="center", va="center", fontsize=9)
    full = "full" if abs(f) >= L - 1e-9 else "ikke full"
    ax.annotate("", xy=(.61, .5), xytext=(.39, .5),
                arrowprops=dict(arrowstyle="->", lw=2 + 3*(full == "full"),
                                color="tab:red" if full == "full" else "tab:blue"))
    ax.text(.5, .62, f"f = {f + 0:g} MW\nL = {L:g} MW ({full})", ha="center", fontsize=9)
    ax.set(xlim=(0, 1), ylim=(0, 1))
    ax.axis("off")
    plt.show()
```
