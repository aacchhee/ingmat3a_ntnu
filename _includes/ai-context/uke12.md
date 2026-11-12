:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke12-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke12-np-6f11581d .ai-feedback-context}

`np`

NumPy er importert som np: import numpy as np.

:::

::: {#ide-uke12-plot-along-circle-2a47762f .ai-feedback-context}

`plot_along_circle(t, values, t_marks=())`

Tar t og values som like lange endimensjonale følger, der values allerede inneholder f(cos(t),sin(t)); t er i radianer. Viser verdiene mot t og vertikale linjer ved vinklene i t_marks. Beregner ikke funksjonsverdiene. Returnerer None.

:::

::: {#ide-uke12-plot-quadratic-on-circle-370944fa .ai-feedback-context}

`plot_quadratic_on_circle(A, levels=None)`

Tar en reell symmetrisk 2x2-matrise A og valgfrie nivåer. Viser z.T@A@z, enhetssirkelen og begge fortegn av egenvektorene fra np.linalg.eigh(A). Når levels=None dannes nivåer fra egenverdiene/2, egenverdiene og 2\*egenverdiene; nullnivå fjernes alltid. Returnerer None.

:::

::: {#ide-uke12-plot-nullspace-method-54967506 .ai-feedback-context}

`plot_nullspace_method(z0, Z, z_best, grad_best)`

Tar NumPy-vektorer z0, Z, z_best og grad_best med form (2,). Viser linjen z0+t\*Z, nullromsretningen, løsningspunktet og gradientretningen der, samt en kvartsirkel med radius norm(z_best). Krever grad_best ulik null fordi pilen normaliseres; funksjonen løser ikke problemet. Returnerer None.

:::

::: {#ide-uke12-minimize-862d1fc3 .ai-feedback-context}

`minimize`

Importert med from scipy.optimize import minimize. Cellen bruker SLSQP med en startvektor og constraints; type='eq' betyr fun(z)=0.

:::

::::
