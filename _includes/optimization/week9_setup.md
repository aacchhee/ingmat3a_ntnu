```{pyodide-python}
#| label: week9-setup
#| autorun: true
#| context: setup
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize_scalar

# Samme målfunksjon og analytiske gradient i alle ukens forsøk.
def f9(z):
    x, y = z
    return (x*x + y - 11)**2 + (x + y*y - 7)**2

def grad9(z):
    x, y = z
    a, b = x*x + y - 11, x + y*y - 7
    return np.array([4*x*a + 2*b, 2*a + 4*y*b])
```
