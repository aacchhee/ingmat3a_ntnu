```{pyodide-python}
#| label: project-week11-setup
#| autorun: true
#| context: setup
# Grunndata for et selvstendig prosjekt. Ingen resultater er forhåndsberegnet.
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import linprog

product_names = ('A', 'B', 'C')
resource_names = ('maskintid', 'monteringstid', 'materiale')
profit = np.array([6., 5., 7.])          # tusen kroner per produktparti
use = np.array([[2., 1., 3.],         # rader = ressurser, kolonner = produkter
                [1., 2., 1.],
                [1., 1., 2.]])
capacity = np.array([20., 16., 15.])   # ressursenheter per uke
```
