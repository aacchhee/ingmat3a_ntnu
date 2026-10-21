::: {.python-setup style="display: none;" aria-hidden="true"}

```{pyodide-python}
#| label: week8-setup
#| autorun: true
#| context: interactive
# Felles oppsett for forsøkene i 8.1–8.4: data, målfunksjoner og tegnehjelpere.
import numpy as np
import matplotlib.pyplot as plt
# SciPys lokale minimeringsrutine; hvert forsøk oppgir funksjon og startpunkt.
from scipy.optimize import minimize

# Data og funksjoner fra forsøkene, slik at hver fane kan kjøres for seg.
# De synlige cellene definerer de samme navnene på nytt.
t = np.linspace(0, 4, 9)
y = 0.5*t

def S(z):
    a, b = z
    return np.sum((y - a*(1 - np.exp(-b*t)))**2)

tl = np.array([-1., 0., 1., 2.]); bl = np.array([.2, .9, 2.1, 2.8])

def S_line(c):
    return np.sum((bl - c[0] - c[1]*tl)**2)

tf = np.linspace(0, 6, 40)
yf = np.exp(-.3*tf)*np.cos(2*tf) + np.random.default_rng(8).normal(0, .02, tf.size)

def S_wave(z):
    a, w = z
    return np.sum((yf - a*np.exp(-.3*tf)*np.cos(w*tf))**2)

# Tegnehjelpere. De synlige cellene viser matematikken og kaller en av disse.

def plot_model_curves(b_values):
    """Målingene og modellkurvene a(1 - e^(-bt)) med a = 0.5/b."""
    tt = np.linspace(0, 4, 200)
    fig, ax = plt.subplots(figsize=(6.5, 4))
    ax.plot(t, y, 'ko', label='målingene (på linjen y = 0.5 t)')
    for b in b_values:
        a = 0.5/b
        ax.plot(tt, a*(1 - np.exp(-b*tt)), label=f'b = {b}, a = 0.5/b = {a:.3g}')
    ax.set(xlabel='t', ylabel='y', title='Modellkurver langs a = 0.5/b')
    ax.legend(); plt.show()

def plot_inf_examples():
    """Tre funksjoner med infimum 0: x på [0, 1], x på (0, 1] og e^(-x) på [0, ∞)."""
    fig, axes = plt.subplots(1, 3, figsize=(9.5, 3.2), sharey=True)
    xs = np.linspace(0, 1, 101)
    k = np.arange(1, 8)
    axes[0].plot(xs, xs)
    axes[0].plot(0, 0, 'ko', ms=7)                         # fylt prikk: med i området
    axes[0].set_title('g(x) = x på [0, 1]\nminimum 0 i x = 0')
    axes[1].plot(xs, xs)
    axes[1].plot(0, 0, 'o', ms=7, mfc='white', mec='k')    # åpen prikk: ikke med
    axes[1].plot(1/k, 1/k, 'r.', ms=9, label='x_k = 1/k')
    axes[1].set_title('g(x) = x på (0, 1]\ninfimum 0, ikke oppnådd')
    axes[1].legend()
    xe = np.linspace(0, 7, 200)
    axes[2].plot(xe, np.exp(-xe))
    axes[2].axhline(0, ls=':', color='gray')
    axes[2].plot(k, np.exp(-k), 'r.', ms=9, label='x_k = k')
    axes[2].set_title('e^(-x) på [0, ∞)\ninfimum 0, ikke oppnådd')
    axes[2].legend()
    for ax in axes:
        ax.set_xlabel('x')
    fig.tight_layout(); plt.show()

def plot_profiles(b_values, curves):
    """Minste S for hver b minus grenseverdien når b -> 0. Under null: bedre enn grensen."""
    fig, ax = plt.subplots(figsize=(6.5, 4))
    for name, difference in curves.items():
        ax.semilogx(b_values, difference, label=name)
    ax.axhline(0, linestyle=':', color='gray', label='grenseverdien (b → 0)')
    ax.set(xlabel='b', ylabel='minste S for denne b, minus grenseverdien',
           ylim=(-0.004, 0.006))
    ax.legend(); fig.tight_layout(); plt.show()

def plot_saddle():
    """Nivåkurver for f = x^3 + y^3 - 3xy og to snitt gjennom origo."""
    f = lambda x, y: x**3 + y**3 - 3*x*y
    X, Y = np.meshgrid(np.linspace(-1.2, 1.8, 241), np.linspace(-1.2, 1.8, 241))
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.3))
    cs = ax1.contour(X, Y, f(X, Y), levels=[-0.9, -0.6, -0.3, 0, 0.5, 1, 2, 3],
                     cmap='viridis')
    ax1.clabel(cs, fontsize=7)
    ax1.plot(1, 1, 'ks'); ax1.annotate('minimum (1, 1)', (1, 1), (1.05, 1.25))
    ax1.plot(0, 0, 'ko'); ax1.annotate('sadelpunkt (0, 0)', (0, 0), (-1.15, -0.3))
    ax1.arrow(0, 0, .5, .5, color='C3', width=.015)      # p = (1, 1)
    ax1.arrow(0, 0, .5, -.5, color='C0', width=.015)     # p = (1, -1)
    ax1.set(xlabel='x', ylabel='y', aspect='equal',
            title='Nivåkurver for f(x, y) = x³ + y³ − 3xy')
    s = np.linspace(-0.8, 0.8, 161)
    ax2.plot(s, f(s, s), 'C3', label='langs p = (1, 1):  φ(s) = 2s³ − 3s²')
    ax2.plot(s, f(s, -s), 'C0', label='langs p = (1, −1):  φ(s) = 3s²')
    ax2.axhline(0, color='gray', lw=.6); ax2.axvline(0, color='gray', lw=.6)
    ax2.set(xlabel='s', ylabel='φ(s) = f(s p)', title='To snitt gjennom origo')
    ax2.legend(); fig.tight_layout(); plt.show()

def plot_chord_examples():
    """En konveks og en ikke-konveks funksjon, hver med én korde."""
    fig, axes = plt.subplots(1, 2, figsize=(9.5, 3.8))
    examples = [(lambda x: 0.5*x**2 + 0.3*x, -2, 2, -1.6, 1.2,
                 'Konveks: korden ligger over grafen'),
                (lambda x: x**4 - 3*x**2 + x, -1.9, 1.8, -1.3, 1.1,
                 'Ikke konveks: grafen stikker over korden')]
    for ax, (f, lo, hi, P, Q, title) in zip(axes, examples):
        xs = np.linspace(lo, hi, 200)
        ax.plot(xs, f(xs), label='graf')
        ax.plot([P, Q], [f(P), f(Q)], 'r--o', label='korde')
        ax.set(title=title, xlabel='x'); ax.legend()
    fig.tight_layout(); plt.show()

def plot_slice(F, P, Q, name):
    """F langs linjestykket fra P til Q, sammen med korden mellom endeverdiene."""
    u = np.linspace(0, 1, 101)
    fig, ax = plt.subplots(figsize=(6, 3.2))
    ax.plot(u, [F((1 - s)*P + s*Q) for s in u], label='funksjonsverdi')
    ax.plot([0, 1], [F(P), F(Q)], 'r--', label='korde')
    ax.set(title=name, xlabel='posisjon på linjestykket'); ax.legend()
    fig.tight_layout(); plt.show()

def plot_convex_sets():
    """To konvekse og to ikke-konvekse mengder, hver med ett linjestykke."""
    U, V = np.meshgrid(np.linspace(-1.3, 1.3, 400), np.linspace(-1.3, 1.3, 400))
    r2 = U**2 + V**2
    sets = [('Skive: konveks', r2 <= 1, (-0.7, -0.4), (0.5, 0.6), 'g-o'),
            ('Rektangel: konveks', (abs(U) <= 1.1) & (abs(V) <= 0.7),
             (-0.9, 0.5), (0.8, -0.5), 'g-o'),
            ('Ring: ikke konveks', (r2 <= 1) & (r2 >= 0.4**2),
             (-0.7, 0.1), (0.7, -0.1), 'r-o'),
            ('Månesigd: ikke konveks', (r2 <= 1) & ((U - 0.55)**2 + V**2 >= 0.85**2),
             (-0.25, 0.85), (-0.25, -0.85), 'r-o')]
    fig, axes = plt.subplots(1, 4, figsize=(11, 3))
    for ax, (name, inside, P, Q, style) in zip(axes, sets):
        ax.contourf(U, V, inside.astype(float), levels=[0.5, 1.5], colors=['#cfe2f3'])
        ax.contour(U, V, inside.astype(float), levels=[0.5], colors='C0', linewidths=1)
        ax.plot(*zip(P, Q), style)
        ax.set(title=name, aspect='equal', xticks=[], yticks=[])
    fig.tight_layout(); plt.show()
```

:::
