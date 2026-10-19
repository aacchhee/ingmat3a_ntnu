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

def newton_basins(safe, n=81, steps=80):
    """Newton på Himmelblau fra n x n starter i [-5, 5]^2, alle samtidig.

    safe=False: rene Newton-steg. safe=True: Cholesky-forsøk for mu
    (mu = 0, 0.5, 1, 2, ...) og Armijo-halvering, som i 10.5.
    Returnerer startgitteret og typen sluttpunkt: 0 minimum, 1 sadelpunkt,
    2 maksimum, -1 ikke konvergert.
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
    return X0, Y0, kind.reshape(X0.shape)
```

:::
