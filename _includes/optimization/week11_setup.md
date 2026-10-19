::: {.python-setup style="display: none;" aria-hidden="true"}

```{pyodide-python}
#| label: week11-setup
#| autorun: true
#| context: interactive
# NumPy holder koeffisienter og planer som arrayer.
import numpy as np
# Matplotlib tegner tillatte områder og mållinjer.
import matplotlib.pyplot as plt
# linprog løser den lineære modellen i SciPy.
from scipy.optimize import linprog

# Verkstedet fra 11.1, slik at hver celle kan kjøres i hvilken som helst fane.
corners = np.array([[0., 0.], [4., 0.], [4., 1.], [3., 3.], [0., 4.5]])
p = np.array([5., 4.])
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])
result = linprog(-p, A_ub=A, b_ub=b, bounds=(0, None), method="highs")
```

:::
