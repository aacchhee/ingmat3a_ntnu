```{pyodide-python}
#| label: week4-setup
#| autorun: true
#| context: setup
# Skjult oppsett for forelesningen i uke 4 (brukes bare av denne siden).
# Her ligger klassisk Gram–Schmidt (brukt i 4.3 og 4.4) og tegnehjelpere.
# Selve matematikken står i de synlige cellene; hjelperne tegner bare figurene.
import numpy as np
import matplotlib.pyplot as plt


def classical_gram_schmidt(A):
    """Klassisk GS uten rangkontroll, slik den vises i 4.3."""
    A = np.asarray(A, dtype=float)
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    for j in range(n):
        # Alle indreproduktene bruker den opprinnelige kolonnen A[:, j].
        coefficients = Q[:, :j].T @ A[:, j]
        R[:j, j] = coefficients
        v = A[:, j] - Q[:, :j] @ coefficients
        R[j, j] = np.linalg.norm(v)
        # Deler også når lengden er null; 4.4 viser følgen.
        Q[:, j] = v / R[j, j]
    return Q, R


def show_pattern_readings(patterns, names, X, readings):
    """Fire 2x2-mønstre, blandingen X og søyler med de målte mønstermengdene."""
    fig, grid = plt.subplots(3, 2, figsize=(6, 8), dpi=90)
    axes = grid.ravel()
    colors = ["#555555", "#277da1", "#4f8f49", "#8b5aa7"]
    images = list(zip(axes[:4], patterns, names, colors)) + [(axes[4], X, "Blanding x", "black")]
    for ax, P, title, color in images:
        ax.imshow(P, cmap="RdBu_r", vmin=-2, vmax=2)
        ax.set_title(title, color=color)
        ax.set_xticks([]); ax.set_yticks([])
        for row in range(2):
            for col in range(2):
                ax.text(col, row, f"{P[row, col]:g}", ha="center", va="center", fontsize=11,
                        color="white" if abs(P[row, col]) > 1 else "black")
    # Søylene viser mønstermengder, mens rutene viser pikselverdier.
    axes[5].bar(names, readings, color=colors)
    axes[5].axhline(0, color="black", linewidth=0.8)
    axes[5].set_title("Målte mønstermengder")
    axes[5].set_ylabel("Indreprodukt med x")
    axes[5].margins(y=0.25)
    for i, value in enumerate(readings):
        axes[5].annotate(f"{value:g}", (i, value), xytext=(0, 5 if value >= 0 else -5),
                         textcoords="offset points", ha="center",
                         va="bottom" if value >= 0 else "top")
    fig.tight_layout(); plt.show()


def show_component_bars(q2, q3):
    """Komponentene i q2 og q3 side om side, og bidragene til q2 @ q3."""
    fig, axes = plt.subplots(1, 2, figsize=(10, 3.5))
    positions = np.arange(1, len(q2)+1)
    axes[0].bar(positions-.15, q2, width=.3, color="#238443", label="q2, beregnet")
    axes[0].bar(positions+.15, q3, width=.3, color="#c62828", label="q3, beregnet")
    axes[0].set_title("Komponentene i q2 og q3")
    axes[0].legend()
    # q2*q3 gir bidrag koordinat for koordinat; summen er indreproduktet q2 @ q3.
    axes[1].bar(positions, q2*q3, color="#6a51a3")
    axes[1].set_title(f"Bidrag til q2 @ q3: summen er {q2 @ q3:.2g}")
    for ax in axes:
        ax.set_xticks(positions); ax.set_xlabel("Komponentnummer")
        ax.axhline(0, color="black", linewidth=.8)
    plt.tight_layout(); plt.show()


def plot_orthogonality_loss(epsilons, cgs_errors, mgs_errors):
    """Ortogonalitetsfeil mot epsilon på logaritmiske akser."""
    plt.loglog(epsilons, cgs_errors, "o-", label="klassisk GS")
    plt.loglog(epsilons, mgs_errors, "s-", label="modifisert GS")
    plt.gca().invert_xaxis()
    plt.xlabel(r"$\varepsilon$")
    plt.ylabel(r"$\|Q^TQ-I\|_F$")
    plt.title("Tap av ortogonalitet for nesten parallelle kolonner")
    plt.grid(True, which="both", alpha=0.25); plt.legend(); plt.show()


def plot_line_fit(t, b, c, fitted):
    """Målinger, linjen c[0] + c[1] t og de loddrette residualene."""
    grid = np.linspace(t.min()-0.2, t.max()+0.2, 200)
    plt.scatter(t, b, color="black", label="målinger")
    plt.plot(grid, c[0] + c[1]*grid, color="#1565c0", label="tilpasset modell")
    # Hvert rødt segment viser ett av avvikene med lengde |r_i|.
    for ti, bi, pi in zip(t, b, fitted):
        plt.plot([ti, ti], [pi, bi], color="#c62828", alpha=0.7)
    plt.xlabel("t"); plt.ylabel("verdi")
    plt.title(f"Minste kvadraters tilpasning: p(t) = {c[0]:.2f} + {c[1]:.2f}t")
    plt.grid(alpha=0.25); plt.legend(); plt.show()


def plot_polynomial_fits(points, measured, fitted, grid, reference, curves):
    """Målinger, referansekurven, tilpassede kurver og residualene ved målepunktene."""
    fig, ax = plt.subplots(figsize=(6.4, 4))
    ax.scatter(points, measured, color="black", label="målinger")
    ax.plot(grid, reference, color="gray", label="referanse")
    styles = [("#1565c0", "-"), ("#238443", "--")]
    for (name, values), (color, style) in zip(curves.items(), styles):
        ax.plot(grid, values, color=color, linestyle=style, label=name)
    ax.vlines(points, fitted, measured, color="#c62828", label="residualkomponenter")
    ax.set_xlabel("t"); ax.set_ylabel("verdi")
    ax.legend(); ax.grid(alpha=.25)
    fig.tight_layout(); plt.show()
```
