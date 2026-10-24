:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke5-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke5-np-6f11581d .ai-feedback-context}

`np`

Tilgjengelig fra oppsettet: `import numpy as np`.

:::

::: {#ide-uke5-plot-before-after-271ee29f .ai-feedback-context}

`plot_before_after(matrices, start)`

Én rute per matrise: startvektoren (oransje) og M @ start (blå), uten normalisering. matrices: ordbok {navn: matrise}.

:::

::: {#ide-uke5-plot-shares-df428610 .ai-feedback-context}

`plot_shares(steps, curves, title=None)`

Tegn andelene a1(k) (blå) og a2(k) (oransje) mot antall steg. curves: ordbok {navn: andeler}, der andeler har én rad [a1, a2] per steg. Første kurvepar tegnes heltrukket, det neste stiplet.

:::

::: {#ide-uke5-show-eigen-split-9b0c4a99 .ai-feedback-context}

`show_eigen_split(A, x)`

For en symmetrisk 2x2-matrise A: vis x som summen av bidragene langs to ortonormale egenvektorer (venstre), og Ax som summen av de skalerte bidragene (høyre).

:::

::: {#ide-uke5-show-rayleigh-cf5467af .ai-feedback-context}

`show_rayleigh(A, x)`

Tegn x (oransje), Ax (blå), projeksjonen rho\*x av Ax på linjen gjennom x (grønn) og resten r = Ax - rho\*x (stiplet).

:::

::: {#ide-uke5-power-iteration-fb908340 .ai-feedback-context}

`power_iteration(A, x0, tol=1e-10, max_steps=500)`

Tar reell kvadratisk A og en ikke-null startvektor x0; normaliserer startvektoren. Ved hvert punkt lagres (rho,residual) med rho=x@(A@x) og residual=norm(A@x-rho\*x). Stopper ved residual <= tol\*norm(A,"fro"), Ax=0 eller max_steps. Neste x er Ax/norm(Ax). Returnerer (x,rho,history,reason), der history er en array med to kolonner og inkluderer startpunktet. En liten egenresidual sikrer en egenretning, ikke at egenverdien er størst.

:::

::: {#ide-uke5-plot-orbits-3281c7ae .ai-feedback-context}

`plot_orbits(orbits)`

Én rute per tilfelle: endepunktene til de normaliserte vektorene x_0, x_1, ... orbits: ordbok {navn: liste av vektorer}.

:::

::: {#ide-uke5-s-net-82b1f564 .ai-feedback-context}

`S_net`

Opprinnelig delt definisjon: `S_net = np.array([[0.0, 0.0, 1 / 2, 1.0], [1 / 2, 0.0, 0.0, 0.0], [1 / 2, 1.0, 0.0, 0.0], [0.0, 0.0, 1 / 2, 0.0]])`.

:::

::: {#ide-uke5-plot-history-07442e50 .ai-feedback-context}

`plot_history(values, title=None, names='ABCD')`

Sannsynligheten for hver side mot antall steg. values: liste av fordelinger.

:::

::: {#ide-uke5-plot-distributions-d83d9fb5 .ai-feedback-context}

`plot_distributions(results, names='ABCD')`

Én kurve per verdi av alpha: den stasjonære fordelingen over sidene. results: ordbok {alpha: fordeling}.

:::

::::
