```{pyodide-python}
#| label: week5-setup
#| autorun: true
#| context: setup
# Oppsett for forelesningen i uke 5. Det kjøres automatisk.
# NumPy gir oss vektorer og matriser. Tegnehjelperne under lager figurene,
# slik at cellene i notatene kan vise selve regningen.

import numpy as np
import matplotlib.pyplot as plt

BLUE, ORANGE, GREEN, GREY = '#1565c0', '#a04a00', '#2e7d32', '#455a64'

# Lenkematrisen for de fire sidene A, B, C, D i 5.5.
# Kolonne j er siden vi går fra, rad i er siden vi går til.
S_net = np.array([[0., 0., 1/2, 1.],
                  [1/2, 0., 0., 0.],
                  [1/2, 1., 0., 0.],
                  [0., 0., 1/2, 0.]])


def _arrow(ax, vector, color, label=None, start=(0., 0.), alpha=1.):
    """Tegn én pil fra start til start + vector."""
    ax.quiver(start[0], start[1], vector[0], vector[1], angles='xy', scale_units='xy',
              scale=1, width=0.012, color=color, alpha=alpha, label=label)


def _square_axes(ax, vectors, title=None):
    """Like akser som rommer alle vektorene, med rutenett."""
    lim = 1.2 * max(1., max(np.abs(np.asarray(v, float)).max() for v in vectors))
    ax.set(xlim=(-lim, lim), ylim=(-lim, lim), xlabel='første koordinat', ylabel='andre koordinat')
    ax.set_aspect('equal')
    ax.grid(alpha=.4)
    if title:
        ax.set_title(title)


def plot_before_after(matrices, start):
    """Én rute per matrise: startvektoren (oransje) og M @ start (blå), uten normalisering.
    matrices: ordbok {navn: matrise}."""
    start = np.asarray(start, float)
    fig, axes = plt.subplots(1, len(matrices), figsize=(3.6*len(matrices), 3.6), squeeze=False)
    for ax, (name, M) in zip(axes[0], matrices.items()):
        after = np.asarray(M, float) @ start
        _arrow(ax, start, ORANGE, 'før', alpha=.8)
        _arrow(ax, after, BLUE, 'etter', alpha=.8)
        _square_axes(ax, [start, after, [3, 3]], name)
        ax.legend(loc='lower right')
    plt.tight_layout()
    plt.show()


def plot_shares(steps, curves, title=None):
    """Tegn andelene a1(k) (blå) og a2(k) (oransje) mot antall steg.
    curves: ordbok {navn: andeler}, der andeler har én rad [a1, a2] per steg.
    Første kurvepar tegnes heltrukket, det neste stiplet."""
    fig, ax = plt.subplots()
    every = max(1, len(steps) // 16)
    for (name, shares), style in zip(curves.items(), ['-', '--', ':']):
        shares = np.asarray(shares, float)
        ax.plot(steps, shares[:, 0], color=BLUE, linestyle=style, marker='o',
                markevery=every, markersize=3, label=f'a₁, {name}')
        ax.plot(steps, shares[:, 1], color=ORANGE, linestyle=style, marker='o',
                markevery=every, markersize=3, label=f'a₂, {name}')
    ax.set(xlabel='Antall multiplikasjoner', ylabel='Andel av de to bidragenes lengder',
           ylim=(-0.03, 1.03))
    if title:
        ax.set_title(title)
    ax.legend()
    plt.show()


def show_eigen_split(A, x):
    """For en symmetrisk 2x2-matrise A: vis x som summen av bidragene langs to
    ortonormale egenvektorer (venstre), og Ax som summen av de skalerte bidragene (høyre)."""
    A = np.asarray(A, float)
    x = np.asarray(x, float)
    lam, Q = np.linalg.eigh(A)
    lam, Q = lam[::-1], Q[:, ::-1]          # største egenverdi først
    c = Q.T @ x                              # koordinatene q_i^T x
    before = [c[i] * Q[:, i] for i in range(2)]
    after = [lam[i] * c[i] * Q[:, i] for i in range(2)]
    fig, axes = plt.subplots(1, 2, figsize=(8, 4))
    panels = [(before, x, 'x = c₁q₁ + c₂q₂'),
              (after, A @ x, f'Ax = {lam[0]:g}·c₁q₁ + {lam[1]:g}·c₂q₂')]
    for ax, (parts, total, title) in zip(axes, panels):
        for line in Q.T:                     # egenlinjene
            ax.plot([-5*line[0], 5*line[0]], [-5*line[1], 5*line[1]], color='0.85', lw=1)
        _arrow(ax, parts[0], BLUE, 'bidrag langs q₁')
        _arrow(ax, parts[1], ORANGE, 'bidrag langs q₂')
        # Stiplet: flytt det ene bidraget til spissen av det andre.
        ax.plot([parts[0][0], total[0]], [parts[0][1], total[1]], color=ORANGE, ls='--', lw=1)
        ax.plot([parts[1][0], total[0]], [parts[1][1], total[1]], color=BLUE, ls='--', lw=1)
        _arrow(ax, total, GREY, 'summen')
        _square_axes(ax, before + after + [x, A @ x], title)   # felles skala i begge ruter
        ax.legend(loc='lower left', fontsize=8)
    plt.tight_layout()
    plt.show()


def show_rayleigh(A, x):
    """Tegn x (oransje), Ax (blå), projeksjonen rho*x av Ax på linjen gjennom x (grønn)
    og resten r = Ax - rho*x (stiplet)."""
    A = np.asarray(A, float)
    x = np.asarray(x, float)
    Ax = A @ x
    rho = x @ Ax / (x @ x)
    proj = rho * x
    fig, ax = plt.subplots(figsize=(4.6, 4.6))
    d = x / np.linalg.norm(x)
    ax.plot([-5*d[0], 5*d[0]], [-5*d[1], 5*d[1]], color='0.8', lw=1, label='linjen gjennom x')
    _arrow(ax, proj, GREEN, 'ρx', alpha=.8)
    _arrow(ax, x, ORANGE, 'x')
    _arrow(ax, Ax, BLUE, 'Ax')
    ax.plot([proj[0], Ax[0]], [proj[1], Ax[1]], 'k--', label='r = Ax − ρx')
    _square_axes(ax, [x, Ax, proj], f'ρ = {rho:.3g}')
    ax.legend(loc='lower left', fontsize=8)
    plt.show()


def plot_orbits(orbits):
    """Én rute per tilfelle: endepunktene til de normaliserte vektorene x_0, x_1, ...
    orbits: ordbok {navn: liste av vektorer}."""
    fig, axes = plt.subplots(2, 2, figsize=(8, 6))
    t = np.linspace(0, 2*np.pi, 200)
    for ax, (name, points) in zip(axes.flat, orbits.items()):
        points = np.asarray(points, float)
        ax.plot(np.cos(t), np.sin(t), color='0.85', lw=1)
        ax.plot(points[:, 0], points[:, 1], 'o-', color=BLUE)
        ax.plot(points[0, 0], points[0, 1], 'o', color=ORANGE, markersize=9, label='x₀')
        ax.set(title=name, xlabel='x₁', ylabel='x₂', xlim=(-1.2, 1.2), ylim=(-1.2, 1.2))
        ax.set_aspect('equal')
        ax.legend(loc='lower left', fontsize=8)
    fig.tight_layout()
    plt.show()


def plot_history(values, title=None, names='ABCD'):
    """Sannsynligheten for hver side mot antall steg. values: liste av fordelinger."""
    plt.figure()
    plt.plot(np.asarray(values, float))
    plt.xlabel('Antall steg')
    plt.ylabel('Sannsynlighet for å være på siden')
    plt.legend(list(names))
    if title:
        plt.title(title)
    plt.show()


def plot_distributions(results, names='ABCD'):
    """Én kurve per verdi av alpha: den stasjonære fordelingen over sidene.
    results: ordbok {alpha: fordeling}."""
    fig, ax = plt.subplots()
    for alpha, p in results.items():
        ax.plot(list(names), p, 'o-', label=f'α = {alpha}')
    ax.set(xlabel='Side', ylabel='Stasjonær sannsynlighet', title='En utvei fra fellen')
    ax.legend()
    plt.show()
```
