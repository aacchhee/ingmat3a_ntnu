```{pyodide-python}
#| label: week6-lecture-setup
#| autorun: true
#| context: setup
# Tegnehjelpere for forelesningsnotatene i uke 6 (ikke for prosjektet).
# Cellene på siden viser matematikken og tallene; figurene tegnes her.
# Oppsettet kjøres automatisk; det er ikke en ekstra implementasjonsoppgave.

import numpy as np
import matplotlib.pyplot as plt
from fractions import Fraction


def _as_fraction(t):
    """Tekst for et tall, som brøk hvis det er en enkel brøk (2/7 i stedet for 0.2857)."""
    f = Fraction(float(t)).limit_denominator(100)
    return str(f) if abs(float(f) - t) < 1e-12 else f'{t:.4g}'


def error_plot(curves, xlabel='Sveip', ylabel='Avstand til løsningen'):
    """Tegn feilkurver på logaritmisk skala. curves: {navn: feilnormer}."""
    fig, ax = plt.subplots()
    for name, values in curves.items():
        ax.semilogy(range(len(values)), values, 'o-', label=name)
    ax.set(xlabel=xlabel, ylabel=ylabel)
    ax.legend(); plt.show()


def show_unit_circle_image(B):
    """Enhetssirkelen og bildet av den under en 2x2-matrise B, med bildene av e1 og e2."""
    B = np.asarray(B, float)
    theta = np.linspace(0, 2*np.pi, 300)
    circle = np.array([np.cos(theta), np.sin(theta)])
    ellipse = B @ circle
    reach = max(1.2, 1.15*np.abs(ellipse).max())
    fig, axes = plt.subplots(2, 1, figsize=(7, 9))
    for ax, points, vectors, title in zip(axes, [circle, ellipse], [np.eye(2), B],
                                         ['Enhetsvektorer z', 'Bildene Bz']):
        ax.plot(*points, color='#64748b')
        for j, color in [(0, '#2563eb'), (1, '#c2410c')]:
            ax.annotate('', xy=vectors[:, j], xytext=(0, 0),
                        arrowprops=dict(arrowstyle='->', color=color, lw=2))
        ax.set(xlim=(-reach, reach), ylim=(-reach/2, reach/2), xlabel='Første koordinat',
               ylabel='Andre koordinat', title=title)
        ax.set_aspect('equal'); ax.grid(alpha=.2)
    for j, color in [(0, '#2563eb'), (1, '#c2410c')]:
        end = B[:, j]
        axes[1].annotate(f'lengde {np.linalg.norm(end):g}', end, xytext=(6, 6),
                         textcoords='offset points', color=color)
    fig.tight_layout(); plt.show()


def show_conditioning(K_verdier, feil):
    """Relativ foroverfeil mot kondisjonstall, begge på logaritmisk skala."""
    fig, ax = plt.subplots()
    ax.loglog(K_verdier, feil, 'o-')
    ax.set(xlabel='Kondisjonstall K', ylabel='Relativ foroverfeil',
           title='Avstand fra den opprinnelige løsningen')
    ax.grid(alpha=.25); plt.show()


def show_surface_and_levels(phi, minimum, marked, levels=(-7, -6, -4, 0, 5, 10),
                            bounds=(-1, 3, -1, 4)):
    """Flaten z = phi(u, v) og nivåkurvene sett ovenfra, med minimum og markerte punkter."""
    lo, hi, bottom, top = bounds
    u, v = np.meshgrid(np.linspace(lo, hi, 120), np.linspace(bottom, top, 120))
    Z = phi(u, v)
    fig = plt.figure(figsize=(7, 10))
    surface = fig.add_subplot(2, 1, 1, projection='3d')
    surface.plot_surface(u, v, Z, cmap='viridis', alpha=.8)
    surface.scatter([minimum[0]], [minimum[1]], [phi(*minimum)], color='red', s=50)
    surface.set(xlabel='u', ylabel='v', title='Høyde z = φ(u,v)')
    surface.set_xticks(range(int(lo), int(hi) + 1, 2))
    surface.text2D(1.03, .5, 'φ(u,v)', transform=surface.transAxes, rotation=90, va='center')
    ax = fig.add_subplot(2, 1, 2)
    curves = ax.contour(u, v, Z, levels=list(levels), cmap='viridis')
    ax.clabel(curves, inline=True, fontsize=9)
    ax.plot(*minimum, 'r*', markersize=12, label=f'Minimum {tuple(minimum)}')
    marked = np.array(marked, float)
    ax.plot(marked[:, 0], marked[:, 1], 'ko', label='markerte punkter')
    ax.set(xlabel='u', ylabel='v', title='Nivåkurver sett ovenfra')
    ax.set_aspect('equal'); ax.legend()
    fig.subplots_adjust(left=.08, right=.83, bottom=.06, top=.95, hspace=.25)
    plt.show()


def two_bowls(cases, bounds=(-.5, 1.5, -1.5, .5)):
    """Nivåkurvebilder over hverandre, ett per tilfelle. cases: liste med (A, b, baner, tittel);
    banene tegnes med bowl_plot, og startpunktet (0, 0) merkes."""
    fig, axes = plt.subplots(len(cases), 1, figsize=(7, 4.5*len(cases)))
    for ax, (A, b, paths, title) in zip(np.atleast_1d(axes), cases):
        bowl_plot(ax, A, b, paths, bounds=bounds)
        ax.annotate('start', (0, 0), xytext=(8, 8), textcoords='offset points')
        ax.set_title(title)
    fig.tight_layout(); plt.show()


def line_search_plot(A, b, x0, p0, alpha0, bounds=(-.5, 2.7, -.5, 3.2)):
    """Øverst: søkelinjen x0 + alpha*p0, nivåkurven gjennom x1, ny residual og rett linje
    til løsningen. Nederst: psi(alpha) = phi(x0 + alpha*p0) med linjens og skålens minimum."""
    A, b = np.asarray(A, float), np.asarray(b, float)
    x0, p0 = np.asarray(x0, float), np.asarray(p0, float)
    phi = lambda x: .5*x @ A @ x - b @ x
    x1 = x0 + alpha0*p0
    star = np.linalg.solve(A, b)        # bare referansepunkt i figuren
    lo, hi, bottom, top = bounds
    fig, axes = plt.subplots(2, 1, figsize=(7, 9))
    ax = axes[0]
    bowl_plot(ax, A, b, {'Første steg': np.array([x0, x1])}, bounds=bounds)
    t = np.linspace(-2, 2, 2)
    ax.plot(x0[0] + t*p0[0], x0[1] + t*p0[1], '--', color='#2563eb', alpha=.5,
            label='søkelinje (retning r₀)')
    ax.plot([x0[0], star[0]], [x0[1], star[1]], ':', color='#c2410c', lw=2,
            label='rett linje til løsningen')
    u, v = np.meshgrid(np.linspace(lo, hi, 220), np.linspace(bottom, top, 220))
    Z = .5*(A[0, 0]*u*u + 2*A[0, 1]*u*v + A[1, 1]*v*v) - b[0]*u - b[1]*v
    ax.contour(u, v, Z, levels=[phi(x1)], colors=['#c2410c'], linewidths=2)
    r1 = b - A @ x1
    arrow_end = x1 + .5*r1/np.linalg.norm(r1)
    ax.annotate('', xy=arrow_end, xytext=x1,
                arrowprops=dict(arrowstyle='->', color='#15803d', lw=2))
    ax.annotate('r₁', arrow_end, xytext=(-14, 4), textcoords='offset points', color='#15803d')
    ax.annotate('x₀', x0, xytext=(8, -14), textcoords='offset points')
    ax.annotate('x₁: best på linjen', x1, xytext=(25, -40), textcoords='offset points',
                arrowprops=dict(arrowstyle='-', color='#64748b'))
    ax.set(xlabel='u', ylabel='v', xlim=(lo, hi), ylim=(bottom, top),
           title='Retning p₀ = r₀ og linjesøket')
    ax.legend(loc='upper left', fontsize=8)
    alpha = np.linspace(-.2*alpha0, 2.1*alpha0, 250)
    psi = [phi(x0 + a*p0) for a in alpha]
    axes[1].plot(alpha, psi, label='ψ(α) = φ(x₀ + αp₀)')
    axes[1].plot(alpha0, phi(x1), 'o', color='#2563eb', label='Linjens minimum')
    axes[1].axvline(alpha0, color='#2563eb', ls=':', label=f'α₀ = {_as_fraction(alpha0)}')
    axes[1].axhline(phi(star), color='black', ls='--',
                    label=f'Hele skålens minimum: {phi(star):g}')
    axes[1].set(xlabel='α', ylabel='Funksjonsverdi', title='Hvor langt bør vi gå?')
    axes[1].legend(fontsize=8); axes[1].grid(alpha=.2)
    fig.tight_layout(); plt.show()


def parallel_minima_plot(A, b, d, offsets, bounds=(.35, 2.1, .65, 2.65)):
    """Linjer (0, c) + t*d for hver c i offsets, minimum på hver linje og linjen
    d^T(Ax - b) = 0 som går gjennom alle disse minimumspunktene."""
    A, b, d = np.asarray(A, float), np.asarray(b, float), np.asarray(d, float)
    lo, hi, bottom, top = bounds
    fig, ax = plt.subplots(figsize=(6.5, 5.5))
    bowl_plot(ax, A, b, {}, bounds=bounds)
    t = np.linspace(-5, 5, 2)
    for i, c in enumerate(offsets):
        base = np.array([0., c])
        ax.plot(base[0] + t*d[0], base[1] + t*d[1], color='#2563eb', alpha=.5, lw=1.3,
                label='Parallelle søkelinjer' if i == 0 else None)
        # Linjesøket fra 6.5 langs d, startet i base.
        point = base + d @ (b - A @ base)/(d @ A @ d)*d
        ax.plot(*point, 'o', color='#c2410c', markersize=7,
                label='Minimum på hver sin linje' if i == 0 else None)
        if c == 0:
            ax.annotate('x₁', point, xytext=(10, -18), textcoords='offset points')
    Ad = A @ d
    u = np.linspace(lo, hi, 2)
    ax.plot(u, (d @ b - Ad[0]*u)/Ad[1], '--', color='#15803d',
            label='Linjen gjennom minimumspunktene')
    ax.set(xlabel='u', ylabel='v', xlim=(lo, hi), ylim=(bottom, top),
           title='Minimer langs hver blå linje')
    ax.legend(loc='upper right', fontsize=8); fig.tight_layout(); plt.show()


def second_step_plot(A, b, first, S, M, solution, bounds=(.78, 1.60, 1.28, 2.16)):
    """Andre steg fra x1: bratteste nedstigning til S, CG til løsningen, og M = minimum
    på linjen gjennom S i den gamle retningen (1, 1)."""
    A, b = np.asarray(A, float), np.asarray(b, float)
    lo, hi, bottom, top = bounds
    fig, ax = plt.subplots(figsize=(7.5, 7.5))
    bowl_plot(ax, A, b, {}, bounds=bounds)
    ax.get_legend().remove()
    for collection in ax.collections:
        collection.set_alpha(.45)
    d = np.array([1., 1.])
    Ad = A @ d
    u = np.linspace(lo, hi, 200)
    ax.plot(u, (d @ b - Ad[0]*u)/Ad[1], '--', color='#15803d', lw=1.5)
    # Denne blå linjen er parallell med den første søkeretningen.
    u_blue = np.linspace(.84, 1.16, 100)
    ax.plot(u_blue, u_blue + S[1] - S[0], ':', color='#2563eb', lw=1.8)
    for end, color in [(S, '#c2410c'), (solution, '#15803d')]:
        ax.annotate('', xy=end, xytext=first,
                    arrowprops=dict(arrowstyle='->', color=color, lw=2.5,
                                    shrinkA=5, shrinkB=7, mutation_scale=15))
    ax.plot(*first, 'o', color='#111827', markersize=7, zorder=5)
    ax.plot(*S, 'o', color='#c2410c', markersize=7, zorder=5)
    ax.plot(*M, 'o', markerfacecolor='white', markeredgecolor='#2563eb',
            markeredgewidth=1.8, markersize=7, zorder=5)
    ax.plot(*solution, '*', color='black', markersize=13, zorder=6)
    label_box = dict(facecolor='white', edgecolor='none', alpha=.9, pad=2)
    ax.annotate('x₁: felles utgangspunkt', first, xytext=(1.17, 1.34), fontsize=11,
                bbox=label_box, arrowprops=dict(arrowstyle='-', color='#64748b'))
    ax.annotate('S: bratteste\nnedstigning', S, xytext=(.80, 1.76), fontsize=11,
                color='#9a3412', bbox=label_box,
                arrowprops=dict(arrowstyle='-', color='#c2410c'))
    ax.annotate('CG: løsningen', solution, xytext=(.80, 2.09), fontsize=11,
                color='#166534', bbox=label_box,
                arrowprops=dict(arrowstyle='-', color='#15803d'))
    ax.annotate('M: minimum på\nden blå linjen', M, xytext=(1.19, 2.02), fontsize=11,
                color='#1d4ed8', bbox=label_box,
                arrowprops=dict(arrowstyle='-', color='#2563eb'))
    ax.set(xlabel='u', ylabel='v', xlim=(lo, hi), ylim=(bottom, top),
           title='Samme første steg – to ulike andre steg')
    fig.tight_layout(); plt.show()
```
