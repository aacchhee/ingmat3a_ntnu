::: {.python-setup style="display: none;" aria-hidden="true"}

```{pyodide-python}
#| label: week8-setup
#| autorun: true
#| context: interactive
# Felles oppsett for forsøkene i 8.1–8.4: vektorregning og figurer.
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
```

:::
