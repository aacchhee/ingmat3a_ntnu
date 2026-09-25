```{pyodide-python}
#| label: week9-setup
#| autorun: true
#| context: interactive
#| code-fold: false
# NumPy gir vektorer og gitter; Matplotlib tegner prøvepunkter og baner.
import numpy as np
import matplotlib.pyplot as plt
# SciPy brukes bare til det avgrensede linjesøket i 9.4.
from scipy.optimize import minimize_scalar

# Samme målfunksjon og analytiske gradient i alle ukens forsøk.
def f9(z):
    # Pakk ut punktet og summer de to kvadrerte avvikene.
    x, y = z
    return (x*x + y - 11)**2 + (x + y*y - 7)**2

def grad9(z):
    # Mellomuttrykkene gjør kjerneregelen synlig i begge komponenter.
    x, y = z
    a, b = x*x + y - 11, x + y*y - 7
    return np.array([4*x*a + 2*b, 2*a + 4*y*b])
# Meldingen vises først når både importene og funksjonsdefinisjonene er klare.
print("Oppsett for uke 9 er klart. Nå kan du kjøre eksperimentene.")
```
