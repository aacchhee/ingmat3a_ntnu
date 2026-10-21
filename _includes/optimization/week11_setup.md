::: {.python-setup style="display: none;" aria-hidden="true"}

```{pyodide-python}
#| label: week11-setup
#| autorun: true
#| context: interactive
# NumPy holder koeffisienter og planer som arrayer.
import numpy as np
# Matplotlib tegner tillatte områder og mållinjer.
import matplotlib.pyplot as plt
# linprog løser den lineære modellen i SciPy.
from scipy.optimize import linprog

# Verkstedet fra 11.1, slik at hver celle kan kjøres i hvilken som helst fane.
corners = np.array([[0., 0.], [4., 0.], [4., 1.], [3., 3.], [0., 4.5]])
p = np.array([5., 4.])
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])
result = linprog(-p, A_ub=A, b_ub=b, bounds=(0, None), method="highs")

# Tegnehjelpere for uke 11. De tegner bare: all matematikk (hjørner, planer,
# priser, linprog-kall) står i de synlige cellene og sendes inn som argumenter.
# Privat kopi av hjørnene: figurene virker selv om en celle endrer corners.
_CORNERS = corners.copy()

def _frame(ax, xmax=4.8, ymax=5.1, title=""):
    ax.set(xlim=(0, xmax), ylim=(0, ymax), xlabel="A-partier x",
           ylabel="B-partier y", title=title)
    ax.set_aspect("equal")

def show_region(corners, objective=(5, 4), levels=(), best=None, path=None,
                machine=9., limits=True, title="Tillatt område og mållinjer", ax=None):
    """Fyll mangekanten med hjørnene (rekkefølge rundt kanten), tegn de tre
    grenselinjene (maskintimer 2x+y=machine, arbeidstimer x+2y=9, A-grense x=4),
    mållinjene objective·(x,y)=nivå, beste plan og en eventuell bane mellom hjørner."""
    own = ax is None
    if own:
        fig, ax = plt.subplots(figsize=(8, 5), layout="constrained")
    c = np.asarray(corners, float)
    ax.fill(c[:, 0], c[:, 1], alpha=.22, color="tab:blue", label="Tillatte planer")
    xx = np.linspace(0, 4.8, 2)
    if limits:
        ax.plot(xx, machine - 2*xx, color="tab:blue", lw=1,
                label=f"Maskintimer 2x + y = {machine:g}")
        ax.plot(xx, (9 - xx)/2, color="tab:green", lw=1, label="Arbeidstimer x + 2y = 9")
        ax.axvline(4, color="tab:purple", ls=":", label="A-grense x = 4")
    a, c2 = objective
    shades = plt.cm.Oranges(np.linspace(.45, .9, max(len(levels), 1)))
    for level, col in zip(levels, shades):
        ax.plot(xx, (level - a*xx)/c2, "--", color=col, label=f"P = {level:g}")
    if path is not None:
        q = np.asarray(path, float)
        ax.plot(q[:, 0], q[:, 1], "-o", color="tab:orange", lw=2.5, label="Bane langs kantene")
    if best is not None:
        ax.plot(*best, "o", color="tab:red", ms=8, label=f"Beste plan ({best[0]:g}, {best[1]:g})")
    _frame(ax, title=title)
    ax.legend(fontsize=8, loc="upper left", bbox_to_anchor=(1.02, 1))
    if own:
        plt.show()

def compare_regions(*panels):
    """Tegn flere show_region-tilfeller under hverandre med like akser."""
    fig, axes = plt.subplots(len(panels), 1, figsize=(8, 5*len(panels)), layout="constrained")
    for ax, kw in zip(np.atleast_1d(axes), panels):
        show_region(ax=ax, **kw)
    plt.show()

def show_pairs(vertices, outside):
    """Alle fem grenselinjer, hjørnene (o) og skjæringspunktene utenfor området (x)."""
    fig, ax = plt.subplots(figsize=(6, 6), layout="constrained")
    xx = np.linspace(-0.5, 9.5, 2)
    ax.fill(_CORNERS[:, 0], _CORNERS[:, 1], alpha=.18, color="tab:blue", label="Tillatte planer")
    ax.plot(xx, 9 - 2*xx, color="tab:blue", label="Maskintimer 2x + y = 9")
    ax.plot(xx, (9 - xx)/2, color="tab:green", label="Arbeidstimer x + 2y = 9")
    ax.axvline(4, color="tab:purple", ls=":", label="A-grense x = 4")
    ax.axvline(0, color="gray", lw=1); ax.axhline(0, color="gray", lw=1)
    ax.plot(*np.asarray(vertices, float).T, "o", color="tab:red", label="Hjørne")
    ax.plot(*np.asarray(outside, float).T, "x", color="black", ms=9,
            label="Skjæring utenfor området")
    ax.set(xlim=(-0.5, 9.5), ylim=(-0.5, 9.5), xlabel="A-partier x", ylabel="B-partier y",
           title="Ti par av grenser")
    ax.set_aspect("equal"); ax.legend(fontsize=8, loc="upper right"); plt.show()

def show_price_arrows(at, normals, prices, gradient):
    """Tegn prices[0]*normals[0] og prices[1]*normals[1] etter hverandre fra hjørnet,
    og gradienten fra samme hjørne. Pilene er skalert likt, bare for tegningen."""
    fig, ax = plt.subplots(figsize=(6, 5), layout="constrained")
    ax.fill(_CORNERS[:, 0], _CORNERS[:, 1], alpha=.18, color="tab:blue")
    k, arrow = 0.35, dict(head_width=.1, length_includes_head=True)
    start = np.asarray(at, float)
    for (n, w, col) in zip(normals, prices, ("tab:blue", "tab:green")):
        step = k*w*np.asarray(n, float)
        ax.arrow(*start, *step, color=col, **arrow)
        ax.text(*(start + step/2 + [.1, -.15]), f"{w:g}·{tuple(n)}", color=col)
        start = start + step
    gk = k*np.asarray(gradient, float)
    ax.arrow(*at, *gk, color="tab:red", **arrow)
    ax.text(*(np.asarray(at) + gk + [-.6, .15]), f"gradient {tuple(gradient)}", color="tab:red")
    _frame(ax, xmax=6.4, title="Prisene bygger målretningen"); plt.show()

def show_value_curve(deltas, values, bound, kink=None, xlabel="Ekstra maskintimer Δ"):
    """Beste verdi som funksjon av kapasitetsendringen, sammen med en prisgrense."""
    fig, ax = plt.subplots(figsize=(6, 4), layout="constrained")
    ax.plot(deltas, values, label="Beste bidrag P*(Δ)")
    ax.plot(deltas, bound, "--", label="Prisgrense")
    if kink is not None:
        ax.axvline(kink, color="gray", ls=":", label=f"Δ = {kink:g}")
    ax.set(xlabel=xlabel, ylabel="Tusen kr", title="Stigningstallet er ressursprisen")
    ax.legend(fontsize=8); ax.grid(alpha=.3); plt.show()
```

:::
