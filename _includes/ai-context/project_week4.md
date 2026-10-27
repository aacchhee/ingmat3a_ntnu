:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week4-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week4-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week4-plt-7be21394 .ai-feedback-context}

`plt`

Importert med `import matplotlib.pyplot as plt`; Matplotlibs pyplot er tilgjengelig gjennom plt.

:::

::: {#ide-project_week4-classical-gram-schmidt-0f5f205a .ai-feedback-context}

`classical_gram_schmidt(A)`

A konverteres til float, form (m,n); returnerer tynn Q (m,n) og R (n,n). Beregner hver projeksjon mot den opprinnelige kolonnen før samlet subtraksjon. Ingen rangkontroll: null/svært liten rest kan gi divisjonsproblemer og tap av ortogonalitet.

:::

::: {#ide-project_week4-modified-gram-schmidt-8c2c1dd4 .ai-feedback-context}

`modified_gram_schmidt(A, tolerance=None)`

For endelig 2D-A med m>=n returneres Q (m,n),R (n,n); projeksjonene bruker fortløpende oppdatert rest. Standard tolerance=eps\*max(m,n)\*||A||_F. Hever ValueError ved ugyldig input og LinAlgError når restlengden er ikke-endelig eller <= tolerance.

:::

::: {#ide-project_week4-cheb-1e0b010a .ai-feedback-context}

`cheb`

Importert med `from numpy.polynomial import chebyshev as cheb`; Chebyshev-koeffisienter står i stigende grad, og cheb.chebval evaluerer dem.

:::

::: {#ide-project_week4-reference-coordinates-222618bf .ai-feedback-context}

`reference_coordinates(n)`

Returnerer n+1 deterministiske Chebyshev-koeffisienter c_k=(-1)\^k/(k+1)\^2, k=0,...,n, med vekslende fortegn og avtakende størrelse.

:::

::: {#ide-project_week4-chebyshev-matrix-771551eb .ai-feedback-context}

`chebyshev_matrix(points, n)`

Returnerer cheb.chebvander på float-punkter: for 1D-input form (len(points),n+1), med kolonne k lik T_k(points). Samme radbetydning som monomial_matrix.

:::

::: {#ide-project_week4-monomial-matrix-898f4130 .ai-feedback-context}

`monomial_matrix(points, n)`

For 1D-punkter returneres float-matrisen (len(points),n+1). Rad i er punkt i og kolonne j er points[i]\*\*j, med konstantkolonne først.

:::

::: {#ide-project_week4-c-007f1c18 .ai-feedback-context}

`C`

chebyshev_matrix(points,n) fra basissammenligningen: startverdier n=12,m=27,points=np.linspace(-1,1,27), derfor form (27,13). Samme målepunkter som M; tilpasses til samme b_noisy.

:::

::: {#ide-project_week4-m-0c4c08fd .ai-feedback-context}

`M`

monomial_matrix(points,n) fra basissammenligningen: startverdier n=12,m=27,points=np.linspace(-1,1,27), derfor form (27,13). Samme målepunkter som C; tilpasses til samme b_noisy.

:::

::::
