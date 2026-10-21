```{pyodide-python}
#| label: project-week12-setup
#| autorun: true
#| context: setup
# Ferdige modellderivater, løsere og figurer. Studentfunksjonene h og F_mu
# er ikke en del av oppsettet; de skrives i prosjektet.
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

span = 4.0   # avstand mellom de faste endepunktene (m)
w = 1.0      # vekt per fritt leddpunkt (N)


def joints(z):
    """Alle leddpunktene p_0, p_1, ..., p_N som rader. Endepunktene ligger fast."""
    return np.vstack([[0., 0.], np.reshape(z, (-1, 2)), [span, 0.]])


def energy(z, loads=None):
    """E(z): vekt ganger høyde, summert over de frie leddpunktene (J)."""
    heights = np.reshape(z, (-1, 2))[:, 1]
    return np.sum((w if loads is None else loads)*heights)


def grad_energy(z, loads=None):
    """Gradienten til E: vekten står på hver y-plass, null på hver x-plass."""
    g = np.zeros(len(z))
    g[1::2] = w if loads is None else loads
    return g


def directions(z):
    """Enhetsvektorene u_i fra p_(i-1) til p_i, én rad per ledd: (cos, sin)."""
    D = np.diff(joints(z), axis=0)
    return D/np.linalg.norm(D, axis=1)[:, None]


def jac_links(z, *args):
    """Jacobimatrisen til h: raden for ledd i har -u_i på plassene til p_(i-1) og u_i på plassene til p_i."""
    U = directions(z)
    n = len(U)
    J = np.zeros((n, 2*(n-1)))
    for i in range(n):          # Python-rad i er ledd nummer i+1
        if i > 0:
            J[i, 2*i-2:2*i] = -U[i]
        if i < n-1:
            J[i, 2*i:2*i+2] = U[i]
    return J


def flat_start(n_links=10, depth=0.5):
    """Startpunkt: de frie leddpunktene jevnt fordelt på en vannrett linje under endene."""
    x = np.linspace(0, span, n_links+1)[1:-1]
    return np.column_stack([x, -depth*np.ones(n_links-1)]).ravel()


def penalty_hessian(z, mu, lengths=0.5):
    """Hessianen til F_mu = E + mu/2 * sum h_i^2. E er lineær og bidrar med null."""
    D = np.diff(joints(z), axis=0)
    L = np.linalg.norm(D, axis=1)
    n = len(L)
    stretch = L - np.broadcast_to(lengths, L.shape)
    H = mu*jac_links(z).T @ jac_links(z)
    for i in range(n):
        u = D[i]/L[i]
        M = mu*stretch[i]*(np.eye(2) - np.outer(u, u))/L[i]
        for a, sa in ((i-1, -1), (i, 1)):
            for b, sb in ((i-1, -1), (i, 1)):
                if 0 <= a < n-1 and 0 <= b < n-1:
                    H[2*a:2*a+2, 2*b:2*b+2] += sa*sb*M
    return H


def plot_chain(*shapes, labels=None):
    """Tegn én eller flere kjettingformer i samme figur, med like akser."""
    fig, ax = plt.subplots(figsize=(7, 3.8))
    for k, z in enumerate(shapes):
        P = joints(z)
        ax.plot(P[:, 0], P[:, 1], 'o-', ms=4,
                label=None if labels is None else labels[k])
    ax.set(xlabel='x (m)', ylabel='y (m)')
    ax.set_aspect('equal')
    ax.grid(alpha=.3)
    if labels is not None:
        ax.legend()
    plt.show()



def solve_exact(hfun, lengths=0.5, z0=None, loads=None):
    """SLSQP med studentens kravfunksjon og ferdige modellderivater."""
    z0 = flat_start() if z0 is None else z0
    return minimize(energy, z0, args=(loads,), jac=grad_energy, method='SLSQP',
                    constraints=[{'type': 'eq', 'fun': hfun, 'jac': jac_links,
                                  'args': (lengths,)}],
                    options={'ftol': 1e-14, 'maxiter': 500})


def multipliers(z, loads=None):
    """Multiplikatorene i avtalen L = E + lambda^T h, fra minste kvadrater."""
    return np.linalg.lstsq(jac_links(z).T, -grad_energy(z, loads), rcond=None)[0]


def solve_penalty(hfun, penaltyfun, mu, z0=None):
    """BFGS med gitt gradientformel; høyst 1500 iterasjoner per kjøring."""
    z0 = flat_start() if z0 is None else z0
    def gradient(z, mu):
        return grad_energy(z) + mu*jac_links(z).T @ hfun(z)
    return minimize(penaltyfun, z0, args=(mu,), jac=gradient, method='BFGS',
                    options={'gtol': 1e-6, 'maxiter': 1500})
```
