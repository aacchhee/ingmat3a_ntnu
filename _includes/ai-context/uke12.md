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

Importert med from scipy.optimize import minimize. Cellene bruker SLSQP med en startvektor og constraints; type='eq' betyr fun(z)=0 og type='ineq' betyr fun(z)>=0.

:::

::: {#ide-uke12-f-3505fdc9 .ai-feedback-context}

`F(z)`

Tar en NumPy-vektor z med form (2,) og returnerer skalar 0.5\*sum((z-a)\*\*2), halve kvadrerte avstanden til det globale målpunktet a; oppsettet setter a = np.array([2.,1.]).

:::

::: {#ide-uke12-a-9d45c0c7 .ai-feedback-context}

`a`

Startdefinisjon: a = np.array([2., 1.]), en NumPy-vektor med form (2,) som er målpunktet i avstandsproblemet.

:::

::: {#ide-uke12-grad-f-d371153a .ai-feedback-context}

`grad_F(z)`

Tar en NumPy-vektor z med form (2,) og returnerer z-a, gradienten til F med samme form. Leser global a, som i oppsettet settes til np.array([2.,1.]).

:::

::: {#ide-uke12-grad-h-d495f7a7 .ai-feedback-context}

`grad_h(z)`

Tar en NumPy-vektor z med form (2,) og returnerer 2\*z, gradienten til h(z)=z@z-1, med samme form.

:::

::: {#ide-uke12-h-d5a1c2a7 .ai-feedback-context}

`h(z)`

Tar en NumPy-vektor z med form (2,) og returnerer skalar np.dot(z,z)-1.; likhetsbetingelsen h(z)=0 beskriver enhetssirkelen.

:::

::: {#ide-uke12-plot-path-on-circle-3dc52216 .ai-feedback-context}

`plot_path_on_circle(path, a, levels=(0.25, 0.5, 0.764, 1, 2, 3))`

Tar en ikke-tom punktfølge path med form (m,2) og en 2-vektor a. Viser nivåkurver for 0.5\*|z-a|\*\*2, enhetssirkelen og punktene i path, med markert start og målpunkt a. levels angir konturverdiene; funksjonen utfører ingen optimering. Returnerer None.

:::

::::
