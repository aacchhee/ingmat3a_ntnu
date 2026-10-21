::: {.python-setup style="display: none;" aria-hidden="true"}

```{pyodide-python}
#| label: week10-setup
#| autorun: true
#| context: interactive
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

# Himmelblaus funksjon fra uke 9: fire minima, fire sadelpunkter og ett maksimum.
def himmel(z):
    x, y = z
    return (x*x + y - 11)**2 + (x + y*y - 7)**2

def himmel_grad(z):
    x, y = z
    a, b = x*x + y - 11, x + y*y - 7
    return np.array([4*x*a + 2*b, 2*a + 4*y*b])

def himmel_hess(z):
    x, y = z
    return np.array([[12*x*x + 4*y - 42, 4*x + 4*y],
                     [4*x + 4*y, 12*y*y + 4*x - 26]])

# Dobbeltbrønnen har to globale minima og et sadelpunkt i origo.
def well(x):
    u, v = x
    return (u*u - 1)**2 + .5*v*v

def well_grad(x):
    u, v = x
    return np.array([4*u*(u*u-1), v])

def well_hess(x):
    # De blandede andrederiverte er null i dette eksemplet.
    u, v = x
    return np.diag([12*u*u-4, 1.])

# Den bøyde dalen har et globalt minimum i (1, 1).
def valley(x):
    u, v = x
    return (1-u)**2 + 10*(v-u*u)**2

def valley_grad(x):
    u, v = x
    return np.array([2*(u-1)-40*u*(v-u*u), 20*(v-u*u)])

def valley_hess(x):
    u, v = x
    return np.array([[2-40*v+120*u*u, -40*u], [-40*u, 20.]])

def armijo(f, g, x, p, c=1e-4, max_halvings=25):
    """Returner godkjent stegfaktor og antall halveringer."""
    slope = float(g @ p)
    if slope >= 0 or not np.isfinite(slope):
        raise ValueError('Retningen er ikke en nedgangsretning')
    a = 1.
    for j in range(max_halvings + 1):
        if f(x+a*p) <= f(x) + c*a*slope:
            return a, j
        a *= .5
    raise RuntimeError('Ingen godkjent lengde innen budsjettet')

HIMMEL_MINIMA = np.array([[3., 2.], [-2.805118, 3.131312],
                          [-3.779310, -3.283186], [3.584428, -1.848126]])

def newton_basins(safe, n=81, steps=80, which=False):
    """Newton på Himmelblau fra n x n starter i [-5, 5]^2, alle samtidig.

    safe=False: rene Newton-steg. safe=True: Cholesky-forsøk for mu
    (mu = 0, 0.5, 1, 2, ...) og Armijo-halvering, som i 10.4.
    Returnerer startgitteret og typen sluttpunkt: 0 minimum, 1 sadelpunkt,
    2 maksimum, -1 ikke konvergert. Med which=True kommer i tillegg nummeret
    (0-3) på minimumet i HIMMEL_MINIMA som starten ender i (-1 ellers).
    """
    s = np.linspace(-5, 5, n)
    X0, Y0 = np.meshgrid(s, s)
    X, Y = X0.ravel().copy(), Y0.ravel().copy()
    alive = np.ones(X.size, bool)
    for _ in range(steps):
        a, b = X*X + Y - 11, X + Y*Y - 7
        g1, g2 = 4*X*a + 2*b, 2*a + 4*Y*b
        active = alive & (np.hypot(g1, g2) >= 1e-10)
        h11, h12, h22 = 12*X*X + 4*Y - 42, 4*X + 4*Y, 12*Y*Y + 4*X - 26
        mu = np.zeros(X.size)
        if safe:
            # For 2 x 2 lykkes Cholesky nøyaktig når h11+mu > 0 og det > 0.
            while True:
                fail = active & ~((h11+mu > 0) & ((h11+mu)*(h22+mu) - h12**2 > 0))
                if not fail.any():
                    break
                mu[fail] = np.maximum(2*mu[fail], .5)
        A11, A22 = h11 + mu, h22 + mu
        det = A11*A22 - h12**2
        alive &= ~(active & (det == 0))
        active &= alive
        with np.errstate(all='ignore'):
            p1, p2 = (-A22*g1 + h12*g2)/det, (h12*g1 - A11*g2)/det
        step = np.ones(X.size)
        if safe:
            f0, slope = a*a + b*b, g1*p1 + g2*p2
            while True:
                Xn, Yn = X + step*p1, Y + step*p2
                fn = (Xn*Xn + Yn - 11)**2 + (Xn + Yn*Yn - 7)**2
                fail = active & (fn > f0 + 1e-4*step*slope) & (step > 1e-12)
                if not fail.any():
                    break
                step[fail] /= 2
        with np.errstate(all='ignore'):
            X = np.where(active, X + step*p1, X)
            Y = np.where(active, Y + step*p2, Y)
        alive &= np.isfinite(X) & np.isfinite(Y)
    # Klassifiser sluttpunktene med gradient og Hessian, som i uke 8.
    kind = np.full(X.size, -1)
    with np.errstate(all='ignore'):
        a, b = X*X + Y - 11, X + Y*Y - 7
        gnorm = np.hypot(4*X*a + 2*b, 2*a + 4*Y*b)
        h11, h12, h22 = 12*X*X + 4*Y - 42, 4*X + 4*Y, 12*Y*Y + 4*X - 26
        det = h11*h22 - h12**2
    ok = alive & (gnorm < 1e-6)
    kind[ok & (det > 0) & (h11 > 0)] = 0
    kind[ok & (det < 0)] = 1
    kind[ok & (det > 0) & (h11 < 0)] = 2
    if not which:
        return X0, Y0, kind.reshape(X0.shape)
    dist = np.hypot(X[:, None] - HIMMEL_MINIMA[:, 0], Y[:, None] - HIMMEL_MINIMA[:, 1])
    nearest = np.where(kind == 0, np.argmin(np.nan_to_num(dist, nan=np.inf), axis=1), -1)
    return X0, Y0, kind.reshape(X0.shape), nearest.reshape(X0.shape)

# ---------- Visningshjelpere: bare tegning, ingen ny matematikk ----------

def plot_errors(curves):
    """Tegn feil e_k mot steg k med logaritmisk akse. curves = {navn: feilliste}."""
    fig, ax = plt.subplots(figsize=(6.5, 3.8))
    for (name, e), mark in zip(curves.items(), ['o-', 's-', '^-']):
        e = np.asarray(e, float)
        k = np.arange(len(e))[e > 0]          # feil 0 kan ikke tegnes logaritmisk
        ax.semilogy(k, e[e > 0], mark, label=name)
    ax.set(xlabel='steg k', ylabel='feil $e_k$ (logaritmisk)')
    ax.legend(); ax.grid(alpha=.3); fig.tight_layout(); plt.show()

def show_model(phi, dphi, d2phi, x0, mu=0., xlim=(-.5, 2.), name='x'):
    """Tegn phi og parabelen m(p) = phi(x0) + phi'(x0) p + (phi''(x0) + mu) p^2 / 2
    rundt x0, og marker parabelens stasjonære punkt (der Newton-steget lander)."""
    t = np.linspace(*xlim, 300)
    c = d2phi(x0) + mu                       # krumningen til parabelen
    p = -dphi(x0)/c                          # Newton-steget
    fig, ax = plt.subplots(figsize=(6.5, 3.8))
    ax.plot(t, phi(t), label='funksjonen')
    ax.plot(t, phi(x0) + dphi(x0)*(t - x0) + .5*c*(t - x0)**2, '--', label='lokal parabel')
    ax.plot(x0, phi(x0), 'ko', label=f'start: {name} = {x0:g}')
    ax.plot(x0 + p, phi(x0) + dphi(x0)*p + .5*c*p*p, 'r^', markersize=9,
            label=f'parabelens {"bunn" if c > 0 else "topp"}: {name} = {x0 + p:.3f}')
    ax.axvline(x0 + p, color='r', lw=.6, ls=':')
    lo, hi = phi(t).min(), phi(t).max()
    ax.set(xlim=xlim, ylim=(lo - .3*(hi - lo), hi + .1*(hi - lo)), xlabel=name)
    ax.legend(fontsize=8); ax.grid(alpha=.3); fig.tight_layout(); plt.show()

def show_units(p_m, g_m, p_dm, g_dm, start=(2.5, 2.5)):
    """Himmelblau i meter og desimeter: Newton-steg (blå) og gradientretning (rød stiplet)."""
    fig, axes = plt.subplots(1, 2, figsize=(9, 4))
    X, Y = np.meshgrid(np.linspace(1.8, 3.6, 120), np.linspace(1.5, 3.2, 120))
    F = (X*X + Y - 11)**2 + (X + Y*Y - 7)**2
    for ax, scale, name, newton, grad in [
            (axes[0], 1, 'første koordinat (meter)', p_m, g_m),
            (axes[1], 10, 'første koordinat (desimeter)', p_dm, g_dm)]:
        ax.contour(scale*X, Y, F, levels=[.5, 2, 5, 10, 20, 40, 60],
                   colors='#adb5bd', linewidths=.8)
        s = np.array([scale*start[0], start[1]])
        ax.annotate('', s + newton, s,
                    arrowprops={'arrowstyle': '->', 'color': '#1665ad', 'lw': 2})
        shown = np.array([scale, 1.])    # rød pil med samme synlige lengde som den blå
        unit = grad/np.linalg.norm(grad/shown)*np.linalg.norm(newton/shown)
        ax.annotate('', s + unit, s,
                    arrowprops={'arrowstyle': '->', 'color': '#b5483f', 'lw': 2, 'ls': '--'})
        ax.plot(scale*3, 2, 'k*', markersize=10)
        ax.set(xlabel=name, ylabel='andre koordinat',
               title='blå: Newton, rød stiplet: gradientretning')
    fig.tight_layout(); plt.show()

def show_basins(X0, Y0, kind):
    """Farg startpunktene etter typen sluttpunkt: minimum, sadelpunkt eller maksimum."""
    from matplotlib.colors import ListedColormap
    fig, ax = plt.subplots(figsize=(5.5, 5))
    ax.pcolormesh(X0, Y0, kind, cmap=ListedColormap(['#1665ad', '#e8a33d', '#b5483f']),
                  vmin=0, vmax=2, shading='nearest')
    ax.set(xlabel='x₀', ylabel='y₀', title='blå: minimum, oransje: sadel, rød: maksimum')
    ax.set_aspect('equal'); plt.show()

def show_minima(X0, Y0, which):
    """Farg startpunktene etter hvilket av de fire minimumene de ender i (stjernene)."""
    from matplotlib.colors import ListedColormap
    colors = ['#1665ad', '#e8a33d', '#2a9d8f', '#7b5ea7']
    fig, ax = plt.subplots(figsize=(5.5, 5))
    ax.pcolormesh(X0, Y0, which, cmap=ListedColormap(colors), vmin=0, vmax=3, shading='nearest')
    ax.scatter(HIMMEL_MINIMA[:, 0], HIMMEL_MINIMA[:, 1], c='white', marker='*', s=260,
               edgecolors='k', zorder=3)
    ax.set(xlabel='x₀', ylabel='y₀', title='fargen viser hvilket minimum (stjerne) starten ender i')
    ax.set_aspect('equal'); fig.tight_layout(); plt.show()

def valley_newton_path(damped, n):
    """n Newton-steg i den bøyde dalen fra (0, 0), med eller uten Armijo-demping."""
    point = np.array([0., 0.]); points = [point.copy()]
    for _ in range(n):
        grad, hess = valley_grad(point), valley_hess(point)
        direction = np.linalg.solve(hess, -grad)
        step = armijo(valley, grad, point, direction)[0] if damped else 1.
        point = point + step*direction
        points.append(point.copy())
    return np.array(points)

def show_valley(z, p):
    """Venstre: fullt og dempet Newton over nivåkurvene til q. Høyre: q og modellen langs p."""
    full_path, damped_path = valley_newton_path(False, 2), valley_newton_path(True, 5)
    fig, (ax_map, ax_line) = plt.subplots(1, 2, figsize=(10, 4.3))
    u, v = np.meshgrid(np.linspace(-.1, 1.2, 180), np.linspace(-.2, 1.2, 180))
    ax_map.contour(u, v, (1-u)**2 + 10*(v-u*u)**2,
                   levels=[.001, .01, .05, .1, .25, .5, 1, 2, 5, 10],
                   colors='#adb5bd', linewidths=.8)
    for name, points, color in [('fullt Newton', full_path, '#b5483f'),
                                ('Armijo-dempet', damped_path, '#1665ad')]:
        ax_map.plot(points[:, 0], points[:, 1], 'o-', color=color, markersize=4, label=name)
    ax_map.plot(1, 1, 'k*', markersize=11, label='q = 0')
    ax_map.set(xlabel='u', ylabel='v', title='Baner over nivåkurvene til q')
    ax_map.set_aspect('equal'); ax_map.legend(fontsize=8, loc='upper left')
    t = np.linspace(0, 1.1, 180)
    g, H = valley_grad(z), valley_hess(z)
    ax_line.plot(t, [valley(z + s*p) for s in t], label='faktisk q(z+αp)')
    ax_line.plot(t, valley(z) + t*(g @ p) + .5*t*t*(p @ H @ p), '--', label='lokal modell')
    ax_line.set(xlabel='α langs første Newton-retning', ylabel='verdi',
                title='Modellen undervurderer hele steget')
    ax_line.legend(fontsize=8); fig.tight_layout(); plt.show()
```

:::
