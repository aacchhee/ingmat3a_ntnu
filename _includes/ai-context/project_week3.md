:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week3-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week3-chebyshev-table-6cc5accb .ai-feedback-context}

`chebyshev_table(x, n)`

Konverterer x til float-array; returnerer form x.shape+(n+1,) med T_0,...,T_n langs siste akse. Bygger tabellen fra T_0=1, T_1=x og treleddsrekursjonen; n forutsettes ikke-negativ.

:::

::: {#ide-project_week3-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week3-c-small-1e2e5a92 .ai-feedback-context}

`C_small`

Chebyshev-matrisen chebyshev_matrix(points_small,3), form (4,4), med rad i for points_small[i] og kolonne k for T_k.

:::

::: {#ide-project_week3-m-small-6bfc516b .ai-feedback-context}

`M_small`

Monomialmatrisen monomial_matrix(points_small,3), forventet form (4,4). Rad i svarer til points_small[i], og kolonne j til x\*\*j; krever at studentens monomial_matrix er fullført.

:::

::: {#ide-project_week3-cheb-1e0b010a .ai-feedback-context}

`cheb`

Importert med `from numpy.polynomial import chebyshev as cheb`; Chebyshev-koeffisienter står i stigende grad, og cheb.chebval evaluerer dem.

:::

::: {#ide-project_week3-points-small-90387913 .ai-feedback-context}

`points_small`

Float-vektoren np.array([-1.0,-1/3,1/3,1.0]); fire forskjellige avlesningspunkter for polynomer av grad 3.

:::

::: {#ide-project_week3-poly-894ef2d6 .ai-feedback-context}

`poly`

Importert med `from numpy.polynomial import polynomial as poly`; monomialkoeffisienter står i stigende grad, og poly.polyval evaluerer dem.

:::

::: {#ide-project_week3-monomial-matrix-4391e9ee .ai-feedback-context}

`monomial_matrix(points, n)`

Studentens avlesningsmatrise for en 1D-punktvektor og grad n: forventet form (len(points),n+1), med rad i for punkt i og kolonne j for x\*\*j fra grad 0. Startskissen hever NotImplementedError og må fullføres før senere forsøk.

:::

::: {#ide-project_week3-monomial-true-789ac4f4 .ai-feedback-context}

`monomial_true`

np.array([1.0,-2.0,0.5,1.0]), koeffisienter i stigende monomialgrad. Referansepolynomet er 1 - 2x + 0.5x² + x³.

:::

::: {#ide-project_week3-plt-7be21394 .ai-feedback-context}

`plt`

Importert med `import matplotlib.pyplot as plt`; Matplotlibs pyplot er tilgjengelig gjennom plt.

:::

::: {#ide-project_week3-points-three-4e89b03e .ai-feedback-context}

`points_three`

points_small[:-1], altså np.array([-1.0,-1/3,1/3]); tre avlesningspunkter til forsøket med for få målinger for et grad-3-polynom.

:::

::: {#ide-project_week3-x-dense-a120796e .ai-feedback-context}

`x_dense`

np.linspace(-1,1,1001), et tett evalueringsrutenett i [-1,1]. Brukes til å sammenligne polynomkurver mellom målepunktene, ikke som nye avlesninger til systemet.

:::

::: {#ide-project_week3-chebyshev-matrix-49f2042e .ai-feedback-context}

`chebyshev_matrix(points, n)`

Returnerer chebyshev_table(points,n). For en 1D-punktvektor får matrisen form (len(points),n+1), rad i = punkt i og kolonne k = T_k evaluert i punktene.

:::

::: {#ide-project_week3-chebyshev-points-9c6634dc .ai-feedback-context}

`chebyshev_points(n)`

Returnerer en vektor med n+1 cosinusfordelte, forskjellige punkter i (-1,1): cos((2k+1)π/(2(n+1))) for k=0,...,n. Endepunktene ±1 er ikke inkludert.

:::

::: {#ide-project_week3-max-grid-error-b3661a5a .ai-feedback-context}

`max_grid_error(values, reference)`

Returnerer float(np.max(np.abs(values-reference))). Input sammenlignes elementvis; maksimum på et endelig rutenett er en måling og ikke et bevis for maksimum på hele intervallet.

:::

::: {#ide-project_week3-reference-coordinates-8e58a20d .ai-feedback-context}

`reference_coordinates(n)`

Returnerer n+1 deterministiske Chebyshev-koeffisienter c_k=(-1)\^k/(k+1)\^2 for k=0,...,n. Dette definerer samme moderate referansepolynom ved gjentatte forsøk.

:::

::: {#ide-project_week3-compare-bases-2e0b251a .ai-feedback-context}

`compare_bases(n, grid_size=2001)`

Samme referansepolynom og n+1 Chebyshev-punkter brukes i to kvadratiske solve-systemer. Returnerer dict med n,points,measurements,grid,reference,monomial_values,chebyshev_values,monomial_coordinates,chebyshev_coordinates,monomial_error,chebyshev_error. Kurver/feil evalueres på grid_size punkter i [-1,1]; koeffisientene tilhører ulike basiser.

:::

::: {#ide-project_week3-basis-data-52b41529 .ai-feedback-context}

`basis_data`

Resultatdict fra compare_bases(30): samme grad-30-polynom rekonstruert i monomial- og Chebyshev-basis fra 31 målinger, med standard evalueringsrutenett på 2001 punkter.

:::

::: {#ide-project_week3-cheb-points-a8daaa35 .ai-feedback-context}

`cheb_points`

chebyshev_points(n); n+1 cosinusfordelte avlesningspunkter uten endepunktene. Med startverdien n=30 er formen (31,).

:::

::: {#ide-project_week3-equal-points-6d1ee98f .ai-feedback-context}

`equal_points`

np.linspace(-1.0,1.0,n+1); n+1 jevnt fordelte avlesningspunkter inklusive endepunktene. Med startverdien n=30 er formen (31,).

:::

::: {#ide-project_week3-n-c51783d1 .ai-feedback-context}

`n`

I punktplasseringsforsøket settes n=30; graden n krever n+1=31 avlesningspunkter. Verdien kan endres ved ny kjøring av studentcellen.

:::

::: {#ide-project_week3-cheb-data-3b1d810c .ai-feedback-context}

`cheb_data`

Resultatdict fra point_placement_experiment(n,cheb_points,noise_size=1e-10); bruker cosinusfordelte punkter og standard grid_size=5001. Samme referansepolynom og fortegnsmønster som equal_data.

:::

::: {#ide-project_week3-equal-data-89ad45a2 .ai-feedback-context}

`equal_data`

Resultatdict fra point_placement_experiment(n,equal_points,noise_size=1e-10); bruker jevnt fordelte punkter og standard grid_size=5001. Samme referansepolynom og fortegnsmønster som cheb_data.

:::

::: {#ide-project_week3-point-placement-experiment-bb8dcd1e .ai-feedback-context}

`point_placement_experiment(n, points, noise_size=1e-10, grid_size=5001)`

Forutsetter n+1 punkter og løsbart Chebyshev-system. Legger samme alternerende støy noise_size\*(-1)\^k til referanseavlesningene og løser for koeffisientene. Returnerer n,points,noise,grid,error,max_data_error,max_curve_error; error er perturbert minus referansekurve på grid_size punkter i [-1,1].

:::

::: {#ide-project_week3-x0-b8af24e1 .ai-feedback-context}

`x0`

Skalaren x0=0.99; evalueringspunkt for å sammenligne samme polynom skrevet i monomial- og Chebyshev-koordinater.

:::

::::
