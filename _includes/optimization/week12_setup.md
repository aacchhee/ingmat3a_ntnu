::: {.python-setup style="display: none;" aria-hidden="true"}

```{pyodide-python}
#| label: week12-setup
#| autorun: true
#| context: interactive
# Felles oppsett for forsøkene i 12.1–12.5: avstandsproblemet og ferdige figurhjelpere.
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

# Avstandsproblemet fra 12.5: nærmeste punkt på enhetssirkelen til a = (2, 1).
a = np.array([2., 1.])

def F(z):
    return .5*np.sum((z-a)**2)

def grad_F(z):
    return z-a

def h(z):
    return np.dot(z, z)-1.

def grad_h(z):
    return 2*z

# Ferdige figurhjelpere. Cellene viser regningen; tegningen skjer her.
_t_circle = np.linspace(0, 2*np.pi, 300)

def plot_along_circle(t, values, t_marks=()):
    """Tegn f(cos t, sin t) som funksjon av vinkelen t, med markerte vinkler."""
    fig, ax = plt.subplots(figsize=(6, 3))
    ax.plot(t, values, color='tab:blue')
    for tm in t_marks:
        ax.axvline(tm, color='0.7', ls=':')
    ax.set(xlabel='vinkel t (radianer)', ylabel='f(cos t, sin t)')
    ax.grid(alpha=.3); plt.tight_layout(); plt.show()

def plot_quadratic_on_circle(A, levels=None):
    """Nivåkurver for z^T A z, enhetssirkelen og egenvektorene til A (begge fortegn)."""
    A = np.asarray(A, float)
    vals, vecs = np.linalg.eigh(A)
    xx, yy = np.meshgrid(np.linspace(-1.3, 1.3, 200), np.linspace(-1.3, 1.3, 200))
    q = A[0, 0]*xx**2 + 2*A[0, 1]*xx*yy + A[1, 1]*yy**2
    fig, ax = plt.subplots(figsize=(5, 5))
    levels = np.unique(np.round(np.r_[vals/2, vals, 2*vals], 6)) if levels is None else levels
    levels = [c for c in levels if c != 0]
    cs = ax.contour(xx, yy, q, levels=levels, colors='0.6')
    ax.clabel(cs, fontsize=8)
    ax.plot(np.cos(_t_circle), np.sin(_t_circle), color='tab:blue', label='enhetssirkelen')
    for k, (val, v) in enumerate(zip(vals, vecs.T)):
        colour = 'tab:green' if k == 0 else 'tab:red'
        for s in (1, -1):
            ax.plot(*(s*v), 'o', color=colour)
        ax.annotate(f'egenverdi {val:+.2f}', v, xytext=(8, 8), textcoords='offset points')
    ax.set(xlabel='x', ylabel='y'); ax.set_aspect('equal'); ax.legend(loc='lower left')
    plt.show()

def plot_nullspace_method(z0, Z, z_best, grad_best):
    """Linjen z0 + tZ, nullromsretningen Z, løsningen og gradienten der."""
    t = np.linspace(-2.5, 1, 100)
    line = z0[:, None] + Z[:, None]*t
    fig, ax = plt.subplots(figsize=(5, 4.5))
    ax.plot(line[0], line[1], color='tab:blue', label='tillatte punkter z0 + tZ')
    ax.plot(*z0, 's', color='tab:purple', label='z0')
    ax.annotate('', z0 + .8*Z, z0, arrowprops=dict(arrowstyle='->', color='tab:purple'))
    ax.text(*(z0 + .8*Z + [.05, 0]), 'Z (nullrommet)', color='tab:purple')
    ax.plot(*z_best, 'o', color='tab:red', label='løsning')
    g = .35*grad_best/np.linalg.norm(grad_best)
    ax.annotate('', z_best + g, z_best, arrowprops=dict(arrowstyle='->', color='tab:red'))
    ax.text(*(z_best + g + [.05, .05]), 'grad f', color='tab:red')
    r = np.linalg.norm(z_best); s = np.linspace(0, np.pi/2, 50)
    ax.plot(r*np.cos(s), r*np.sin(s), ':', color='0.5', label='nivåkurven gjennom løsningen')
    ax.set(xlabel='x', ylabel='y', xlim=(-.3, 3), ylim=(-1.3, 2.3)); ax.set_aspect('equal')
    ax.legend(loc='lower left', fontsize=8); plt.show()

def plot_path_on_circle(path, a, levels=(.25, .5, .764, 1, 2, 3)):
    """Nivåkurver for F = |z-a|^2/2, enhetssirkelen og punktene en løser rapporterte."""
    path = np.asarray(path)
    u, v = np.meshgrid(np.linspace(-1.2, 2.5, 200), np.linspace(-1.2, 2.2, 200))
    fig, ax = plt.subplots(figsize=(6, 5))
    cs = ax.contour(u, v, .5*((u-a[0])**2 + (v-a[1])**2), levels=levels,
                    colors='0.7', linestyles='dotted')
    ax.clabel(cs, fontsize=8, fmt='F = %g')
    ax.plot(np.cos(_t_circle), np.sin(_t_circle), color='tab:blue', label='h = 0')
    ax.plot(path[:, 0], path[:, 1], '-o', ms=4, color='tab:orange', label='rapporterte punkter')
    ax.plot(*path[0], 's', color='tab:purple', label='start')
    ax.plot(*a, 'x', color='k', label='a')
    ax.set(xlabel='x', ylabel='y'); ax.set_aspect('equal'); ax.legend(fontsize=8)
    plt.show()
```

:::
