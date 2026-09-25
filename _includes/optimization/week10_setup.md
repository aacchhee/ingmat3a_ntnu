```{pyodide-python}
#| label: week10-setup
#| autorun: true
#| context: interactive
#| code-fold: false
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

# Dobbeltbrønnen har to globale minima og et sadelpunkt i origo.
def well(x):
    # Pakk ut begge koordinatene og returner funksjonsverdien.
    u, v = x
    return (u*u - 1)**2 + .5*v*v

def well_grad(x):
    # Returner de to partiellderiverte i en vektor.
    u, v = x
    return np.array([4*u*(u*u-1), v])

def well_hess(x):
    # De blandede andrederiverte er null i dette eksemplet.
    u, v = x
    return np.diag([12*u*u-4, 1.])

# Den bøyde dalen har et globalt minimum i (1, 1).
def valley(x):
    # Begge kvadratledd er ikke-negative.
    u, v = x
    return (1-u)**2 + 10*(v-u*u)**2

def valley_grad(x):
    # Bruk kjerneregelen på leddet (v-u²)².
    u, v = x
    return np.array([2*(u-1)-40*u*(v-u*u), 20*(v-u*u)])

def valley_hess(x):
    # Den symmetriske matrisen endrer seg langs dalen.
    u, v = x
    return np.array([[2-40*v+120*u*u, -40*u],[-40*u, 20.]])

def armijo(f, g, x, p, c=1e-4, max_halvings=25):
    """Returner godkjent stegfaktor og antall halveringer."""
    # Positiv retningsderivert gir ikke nedgang for små positive steg.
    slope = float(g @ p)
    if slope >= 0 or not np.isfinite(slope):
        raise ValueError('Retningen er ikke en nedgangsretning')
    # Prøv fullt steg først og halver til testen er oppfylt.
    a = 1.
    for j in range(max_halvings + 1):
        if f(x+a*p) <= f(x) + c*a*slope:
            return a, j
        a *= .5
    # Et begrenset budsjett er ikke en matematisk garanti om aksept.
    raise RuntimeError('Ingen godkjent lengde innen budsjettet')
# Meldingen vises først når alle importene og definisjonene er klare.
print("Oppsett for uke 10 er klart. Nå kan du kjøre eksperimentene.")
```
