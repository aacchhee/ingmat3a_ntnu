::: {.python-setup style="display: none;" aria-hidden="true"}

```{pyodide-python}
#| label: week9-setup
#| autorun: true
#| context: interactive
# Felles oppsett: alle forsøk i 9.1–9.5 kan kjøres i hvilken som helst fane.
# Her står ukens funksjon og tegnehjelperne; selve matematikken står i cellene.
import numpy as np
import matplotlib.pyplot as plt
# SciPy importeres i fordypningene om linjesøk i 9.3 og Nelder–Mead i 9.4.

# Himmelblaus funksjon, gradient og Hessian; u og w er parentesene i f.
def f9(z):
    x, y = z
    return (x*x + y - 11)**2 + (x + y*y - 7)**2

def grad9(z):
    x, y = z
    u, w = x*x + y - 11, x + y*y - 7
    return np.array([4*x*u + 2*w, 2*u + 4*y*w])

def hess9(z):
    x, y = z
    return np.array([[12*x*x + 4*y - 42, 4*x + 4*y],
                     [4*x + 4*y, 12*y*y + 4*x - 26]])

# De fire minimumspunktene til f (koordinater med seks desimaler).
minima = [(3., 2.), (-2.805118, 3.131312), (-3.779310, -3.283186), (3.584428, -1.848126)]

def fixed_steps(alpha, start=(0., 0.), n=40):
    """Gradientmetoden med fast steg alpha; stopper hvis punktet forsvinner (|z| > 10^6).
    Returnerer sluttpunkt, f-verdiene og punktene."""
    z = np.array(start, float)
    values, points = [f9(z)], [z.copy()]
    for k in range(n):
        z = z - alpha*grad9(z)
        if not np.all(np.isfinite(z)) or np.linalg.norm(z) > 1e6:
            break
        values.append(f9(z)); points.append(z.copy())
    return z, np.array(values), np.array(points)

def compass(z, step, min_step, maxpolls=10000):
    """Kompassøk (reglene i 9.4) fra z med startsteg step, til step < min_step.
    Returnerer sluttpunkt, Δ i siste mislykkede runde, antall prøverunder og banen."""
    if not np.isfinite(min_step) or min_step <= 0:
        raise ValueError("min_step må være endelig og positiv")
    if not np.isfinite(step) or step < min_step:
        raise ValueError("step må være endelig og minst min_step")
    directions = np.array([[1., 0.], [-1., 0.], [0., 1.], [0., -1.]])
    current, polls, path = f9(z), 0, [z]
    while step >= min_step:
        if polls >= maxpolls:
            raise RuntimeError("Kompassøket nådde maksimalt antall prøverunder")
        trials = z + step*directions
        values = np.array([f9(t) for t in trials]); polls += 1
        best = np.argmin(values)
        if values[best] < current:            # akseptert flytting
            z, current = trials[best], values[best]; path.append(z)
        else:                                 # mislykket runde: bli stående, halver
            last_failed = step; step /= 2
    return z, last_failed, polls, path

# Tilpasningen fra uke 8 (8.1): ni målinger på linjen y = 0.5 t.
t8 = np.linspace(0, 4, 9)
y8 = 0.5*t8

def S8(z):
    a, b = z
    return np.sum((y8 - a*(1 - np.exp(-b*t8)))**2)

def grad_S8(z):
    a, b = z
    e = np.exp(-b*t8)
    r = y8 - a*(1 - e)
    return np.array([-2*np.sum(r*(1 - e)), -2*np.sum(r*a*t8*e)])

# ---------- Tegnehjelpere ----------
COLORS = ['#1665ad', '#b5483f', '#2b8a61', '#7a4fa0', '#c98a1b']

def _contours(ax, box):
    """Nivåkurver for f9 i kvadratet box = (a, b)."""
    gx, gy = np.meshgrid(np.linspace(*box, 180), np.linspace(*box, 180))
    ax.contour(gx, gy, f9([gx, gy]), levels=[1, 5, 20, 50, 100, 200],
               colors='#adb5bd', linewidths=.8)

def plot_x_paths(xs_per_alpha):
    """x-koordinaten steg for steg, én kurve per steglengde (dict alpha -> liste)."""
    fig, ax = plt.subplots(figsize=(6.5, 4))
    for (alpha, xs), color in zip(xs_per_alpha.items(), COLORS):
        ax.plot(xs, '.-', markersize=3, linewidth=.7, color=color, label=f'α = {alpha}')
    ax.axhline(3, color='gray', linestyle=':')
    ax.set(xlabel='steg k', ylabel='x-koordinat', ylim=(2.4, 3.6))
    ax.legend(); plt.show()

def plot_step_factors(lam, marked=()):
    """|1 - αλ₁|, |1 - αλ₂| og S(α) = den største av dem, med beste α og α_krit merket."""
    alphas = np.linspace(0, 1.25*2/lam[-1], 601)
    fig, ax = plt.subplots(figsize=(6.5, 4))
    ax.plot(alphas, abs(1 - alphas*lam[0]), ':', label=f'|1 − αλ₁|, λ₁ = {lam[0]:.1f}')
    ax.plot(alphas, abs(1 - alphas*lam[-1]), ':', label=f'|1 − αλ₂|, λ₂ = {lam[-1]:.1f}')
    ax.plot(alphas, np.maximum(abs(1 - alphas*lam[0]), abs(1 - alphas*lam[-1])), 'k',
            label='S(α), den største faktoren')
    for alpha in marked:
        ax.plot(alpha, max(abs(1 - alpha*lam)), 'o', color='#bb4a37')
    ax.axhline(1, color='gray', linewidth=.8)
    for alpha, name in [(2/(lam[0] + lam[-1]), 'beste α'), (2/lam[-1], 'α_krit')]:
        ax.axvline(alpha, color='gray', linestyle='--', linewidth=.8)
        ax.text(alpha, 1.62, ' ' + name, fontsize=8)
    ax.set(xlabel='fast steglengde α', ylabel='faktor per steg', ylim=(0, 1.8))
    ax.legend(loc='upper left', fontsize=8); plt.show()

def plot_errors(curves, ylabel='feil', xlog=False):
    """Feilkurver i logaritmisk skala (dict navn -> liste med feil)."""
    fig, ax = plt.subplots(figsize=(6.5, 4))
    for (name, errors), color in zip(curves.items(), COLORS):
        ax.semilogy(errors, color=color, label=name)
    ax.set(xlabel='steg k', ylabel=ylabel)
    if xlog:
        ax.set_xscale('log')
    ax.legend(); plt.show()

def plot_runs(runs, on_map=None, box=(-1, 4)):
    """Øverst: punktene på nivåkurvene. Nederst: f steg for steg (logaritmisk).
    runs: dict navn -> (sluttpunkt, f-verdier, punkter); on_map: navnene som tegnes i kartet."""
    fig, (ax_map, ax) = plt.subplots(2, 1, figsize=(6.5, 9))
    _contours(ax_map, box)
    for (name, (end, values, points)), color in zip(runs.items(), COLORS):
        if on_map is None or name in on_map:
            ax_map.plot(points[:, 0], points[:, 1], 'o-', color=color,
                        markersize=2.5, linewidth=1.2, label=name)
        # Logaritmisk akse kan ikke tegne null; løft bare viste verdier under 1e-15.
        ax.semilogy(np.maximum(values, 1e-15), 'o-', markersize=3, color=color, label=name)
    ax_map.plot(3, 2, 'k*', markersize=11, label='kjent minimum')
    ax_map.set(xlim=box, ylim=box, xlabel='x', ylabel='y',
               title='Aksepterte punkter på nivåkurvene')
    ax_map.set_aspect('equal'); ax_map.legend(fontsize=8, loc='upper left')
    ax.set(xlabel='steg k', ylabel='f (logaritmisk skala)')
    ax.legend(); fig.tight_layout(); plt.show()

def plot_path(path, label, box=(-4, 4)):
    """Én bane av aksepterte punkter på nivåkurvene til f9."""
    path = np.array(path)
    fig, ax = plt.subplots(figsize=(6, 5.5))
    _contours(ax, box)
    ax.plot(path[:, 0], path[:, 1], 'o-', color='#bb4a37', markersize=4, label=label)
    ax.plot(3, 2, 'k*', markersize=11, label='kjent minimum')
    ax.set(xlim=box, ylim=box, xlabel='x', ylabel='y',
           title='Aksepterte punkter på nivåkurvene')
    ax.set_aspect('equal'); ax.legend(); plt.show()

def plot_drift(path):
    """Armijo-iteratene for kvadratsummen fra uke 8 i (a, b)-planet, med kurven a = 0.5/b."""
    path = np.array(path)
    bb = np.linspace(0.1, 1.2, 200)
    fig, ax = plt.subplots(figsize=(6.5, 4))
    ax.plot(0.5/bb, bb, ':', color='gray', label='kurven a = 0.5/b')
    ax.plot(path[:, 0], path[:, 1], '-', color='#2b8a61', label='Armijo-iterater')
    ax.plot(*path[0], 'ks', label='start (1, 1)')
    ax.set(xlabel='a', ylabel='b', xlim=(0, 5), ylim=(0, 1.2))
    ax.legend(); plt.show()

def plot_samples(grid, random_points):
    """Gitterpunkter og tilfeldige prøver i kvadratet [-4, 4]^2."""
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.scatter(grid[:, 0], grid[:, 1], s=22, label='gitter')
    ax.scatter(random_points[:, 0], random_points[:, 1], s=12, alpha=.7,
               label='tilfeldig, frø 42')
    ax.plot(3, 2, 'k*', markersize=12, label='kjent minimum (3, 2)')
    ax.set(xlim=(-4.2, 4.2), ylim=(-4.2, 4.2), xlabel='x', ylabel='y')
    ax.set_aspect('equal'); ax.legend(); plt.show()
```

:::
