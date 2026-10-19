::: {.python-setup style="display: none;" aria-hidden="true"}

```{pyodide-python}
#| label: week12-setup
#| autorun: true
#| context: interactive
# Felles oppsett for forsøkene i 12.1–12.5: vektorregning, figurer og SLSQP.
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
```

:::
