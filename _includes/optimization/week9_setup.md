::: {.python-setup style="display: none;" aria-hidden="true"}

```{pyodide-python}
#| label: week9-setup
#| autorun: true
#| context: interactive
# Felles oppsett: alle forsøk i 9.1–9.7 kan kjøres i hvilken som helst fane.
import numpy as np
import matplotlib.pyplot as plt
# SciPy brukes bare i fordypningen om ett linjesøk i 9.6 og importeres der.

# Ukens målfunksjon, gradient og Hessian; u og w er parentesene i f.
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
```

:::
