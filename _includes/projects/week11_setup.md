```{pyodide-python}
#| label: project-week11-setup
#| autorun: true
#| context: setup
# Grunndata for prosjektet. Alle tall er oppdiktede og forenklede.
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import linprog

# Ett prisområde (del 1-2): kostnad i kr/MWh og kapasitet i MW.
plant_names = ['vind', 'vannkraft', 'import', 'gass']
cost = np.array([0., 10., 40., 70.])
capacity = np.array([30., 50., 30., 40.])

# Tre timer (del 4): forbruk og tilgjengelig vind i hver time (MW),
# og vannmengden som vannkraften kan bruke til sammen (MWh).
demand3 = np.array([60., 95., 120.])
wind3 = np.array([30., 10., 20.])
water = 120.

# Samme funksjon som i del 1b, slik at senere celler virker etter ny innlasting.
def one_zone(D):
    return linprog(cost, A_eq=[np.ones(4)], b_eq=[D],
                   bounds=list(zip(np.zeros(4), capacity)), method="highs")

# Samme tre-timersmodell som i del 4, men med tom vannrad (den fyller du inn der).
c3 = np.tile(cost, 3)
bounds3 = []
for h in range(3):
    bounds3 += [(0, wind3[h]), (0, 50.), (0, 30.), (0, 40.)]
A_eq3 = np.zeros((3, 12))
for h in range(3):
    A_eq3[h, 4*h:4*h + 4] = 1
A_water = np.zeros((1, 12))
```
