"""Prosjekt 11: data og kjørbare LP-forsøk til egen editor.

Krever numpy, scipy og matplotlib. Dette er ikke en løsningsfil. Regn selv ut
modell, dualt sertifikat, gyldig kapasitetsintervall og innkjøpsvalg.
"""
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

# Del 1: gjør egen modellering før du leser resultater fra solveren.
base = linprog(-profit, A_ub=use, b_ub=capacity,
               bounds=(0, None), method='highs')
print('status:', base.status, base.message)
if base.status == 0:
    print('plan:', base.x, 'dekningsbidrag:', -base.fun)
    print('forbruk:', use @ base.x, 'slakk:', capacity-use @ base.x)

# Sett inn egne forslag, og undersøk om de gir et optimalt sertifikat.
candidate_plan = np.zeros(3)    # TODO: sett inn din plan (A, B, C)
candidate_prices = np.zeros(3)  # TODO: sett inn priser (maskin, montering, materiale)
print('primal brudd:', np.maximum(use@candidate_plan-capacity, 0),
      'negative variabler:', np.minimum(candidate_plan,0))
print('dual mangel:', np.maximum(profit-use.T@candidate_prices, 0),
      'negative priser:', np.minimum(candidate_prices,0))
print('målverdier:', profit@candidate_plan, capacity@candidate_prices)

# Del 2: prøv noen kapasitetsendringer. Utled eksakt gyldig intervall selv.
for delta in (0., 6., 12.):
    new_capacity = capacity.copy()
    new_capacity[0] += delta
    trial = linprog(-profit, A_ub=use, b_ub=new_capacity,
                    bounds=(0, None), method='highs')
    print('endring:', delta, 'status:', trial.status)
    if trial.status == 0:
        print(' plan:', trial.x, 'bidrag:', -trial.fun,
              'slakk:', new_capacity-use@trial.x,
              'marginaler for min-målet:', trial.ineqlin.marginals)

# Del 3: lag egne tester av netto bidrag og en endret C-pris.
# Skriv først ned en regel for innkjøp og kontroller prisens gyldighet.
