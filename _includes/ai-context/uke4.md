:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke4-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke4-np-6f11581d .ai-feedback-context}

`np`

Tilgjengelig fra oppsettet: `import numpy as np`.

:::

::: {#ide-uke4-show-pattern-readings-ff5e657f .ai-feedback-context}

`show_pattern_readings(patterns, names, X, readings)`

Fire 2x2-mønstre, blandingen X og søyler med de målte mønstermengdene.

:::

::: {#ide-uke4-classical-gram-schmidt-73ba741b .ai-feedback-context}

`classical_gram_schmidt(A)`

Pedagogisk klassisk Gram–Schmidt uten rangkontroll. For A med form (m,n): coefficients=Q[:,:j].T@A[:,j], v=A[:,j]-Q[:,:j]@coefficients, R[j,j]=norm(v), Q[:,j]=v/R[j,j]. Returnerer (Q,R) med former (m,n) og (n,n). Alle målinger bruker den opprinnelige kolonnen. Den naive implementasjonen deler også når resten er null, så avhengige kolonner kan gi nan/inf.

:::

::: {#ide-uke4-show-component-bars-dc9d5cb1 .ai-feedback-context}

`show_component_bars(q2, q3)`

Komponentene i q2 og q3 side om side, og bidragene til q2 @ q3.

:::

::: {#ide-uke4-plot-orthogonality-loss-0ebd1bc2 .ai-feedback-context}

`plot_orthogonality_loss(epsilons, cgs_errors, mgs_errors)`

Ortogonalitetsfeil mot epsilon på logaritmiske akser.

:::

::: {#ide-uke4-plot-line-fit-b5929777 .ai-feedback-context}

`plot_line_fit(t, b, c, fitted)`

Målinger, linjen c[0] + c[1] t og de loddrette residualene.

:::

::: {#ide-uke4-plot-polynomial-fits-1325d7a1 .ai-feedback-context}

`plot_polynomial_fits(points, measured, fitted, grid, reference, curves)`

Målinger, referansekurven, tilpassede kurver og residualene ved målepunktene.

:::

::::
