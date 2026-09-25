```{pyodide-python}
#| label: week10-setup
#| autorun: true
#| context: setup
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

# To mål: en ikke-konveks dobbeltbrønn og en bøyd dal.
def well(x):
    u, v = x
    return (u*u - 1)**2 + .5*v*v

def well_grad(x):
    u, v = x
    return np.array([4*u*(u*u-1), v])

def well_hess(x):
    u, v = x
    return np.diag([12*u*u-4, 1.])

def valley(x):
    u, v = x
    return (1-u)**2 + 10*(v-u*u)**2

def valley_grad(x):
    u, v = x
    return np.array([2*(u-1)-40*u*(v-u*u), 20*(v-u*u)])

def valley_hess(x):
    u, v = x
    return np.array([[2-40*v+120*u*u, -40*u],[-40*u, 20.]])

def armijo(f, g, x, p, c=1e-4, max_halvings=25):
    """Halver fra 1 til tilstrekkelig reduksjon eller meld feil."""
    slope = float(g @ p)
    if slope >= 0 or not np.isfinite(slope):
        raise ValueError('Retningen er ikke en nedgangsretning')
    a = 1.
    for j in range(max_halvings + 1):
        if f(x+a*p) <= f(x) + c*a*slope:
            return a, j
        a *= .5
    raise RuntimeError('Ingen godkjent lengde innen budsjettet')
```
