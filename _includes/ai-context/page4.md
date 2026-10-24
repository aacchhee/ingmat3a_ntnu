:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-page4-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-page4-plot-function-5d5eca31 .ai-feedback-context}

`plot_function(f, x_min, x_max, title)`

Tegn y = f(x) på [x_min, x_max] sammen med x-aksen.

:::

::: {#ide-page4-iterate-5e30a8e5 .ai-feedback-context}

`iterate(g, x0, number_of_steps)`

Starter med float(x0) og anvender g nøyaktig number_of_steps ganger. Returnerer en NumPy-array med lengde number_of_steps+1 som inneholder x_0 og alle etterfølgende iterater.

:::

::: {#ide-page4-np-6f11581d .ai-feedback-context}

`np`

Tilgjengelig fra oppsettet: `import numpy as np`.

:::

::: {#ide-page4-plot-sequences-8133eeeb .ai-feedback-context}

`plot_sequences(rules, labels, x0, steps, reference=solution)`

Tegner x_n mot n for reglene i rules fra samme x0 ved hjelp av iterate; labels navngir kurvene. Standard reference er solution=0.6823278038280193, vist som stiplet linje.

:::

::: {#ide-page4-g2-fba8dd00 .ai-feedback-context}

`g2(x)`

Oppdateringsregelen er `g2(x)=np.cbrt(1-x)`, med reell kubikkrot også når 1-x er negativ.

:::

::: {#ide-page4-cobweb-row-61f5138a .ai-feedback-context}

`cobweb_row(rules, x0, steps, titles, x_min=0, x_max=1, mark=None)`

Spindelvev side om side. x0, steps, x_min og x_max kan være tall eller lister.

:::

::: {#ide-page4-g1-ed97e13c .ai-feedback-context}

`g1(x)`

Oppdateringsregelen er `g1(x)=1-x**3` for modellproblemet x\*\*3+x-1=0.

:::

::: {#ide-page4-g3-119d5cc6 .ai-feedback-context}

`g3(x)`

Oppdateringsregelen er `g3(x)=(2*x**3+1)/(3*x**2+1)` for modellproblemet x\*\*3+x-1=0.

:::

::: {#ide-page4-plot-final-values-82d3946a .ai-feedback-context}

`plot_final_values(starting_values, final_values, steps=100, reference=solution)`

Tegner punktene (starting_values,final_values) etter steps steg og referansen som stiplet linje. Standard reference er solution=0.6823278038280193.

:::

::: {#ide-page4-plot-errors-d61a283a .ai-feedback-context}

`plot_errors(rules, labels, x0, steps, reference=solution)`

Tegner abs(x_n-reference) mot n på logaritmisk y-akse for reglene i rules; feil lik null utelates fra log-plottet. Standard reference er solution=0.6823278038280193.

:::

::: {#ide-page4-iterate-959821b9 .ai-feedback-context}

`iterate(g, x0, number_of_steps)`

Starter med float(x0) og anvender g nøyaktig number_of_steps ganger. Returnerer en NumPy-array med lengde number_of_steps+1 som inneholder x_0 og alle etterfølgende iterater.

:::

::: {#ide-page4-r-reference-2b9c3fed .ai-feedback-context}

`r_reference`

Referanseverdien er `r_reference=solution=0.6823278038280193` for roten av x\*\*3+x-1; den brukes til å måle feil, ikke i oppdateringsreglene.

:::

::: {#ide-page4-plot-error-curves-34829957 .ai-feedback-context}

`plot_error_curves(curves, labels, title, ylabel='Absolutt feil $|e_n|$', ylim=None)`

Tegn flere feilkurver mot n med logaritmisk y-akse (blå, oransje, grønn ...).

:::

::: {#ide-page4-fixed-point-93c1ac45 .ai-feedback-context}

`fixed_point(g, x0, f=None, atol=1e-10, rtol=1e-10, maxiter=100)`

Følger x_new=g(x) fra float(x0). Stopp ved `abs(x_new-x) <= atol+rtol*abs(x_new)`; maxiter begrenser antall steg. Residual er abs(f(x)) hvis f er gitt, ellers abs(g(x)-x). Avviser regnefeil og ikke-endelige verdier. Returnerer en ordbok med x, converged, reason, iterations, history, steps og residuals; history inkluderer startverdien, steps gjør det ikke. «lite skritt» bekrefter ikke alene et separat residualkrav.

:::

::: {#ide-page4-plot-step-and-residual-2d44354e .ai-feedback-context}

`plot_step_and_residual(result)`

Tegn skrittlengde og residual fra fixed_point med logaritmisk y-akse.

:::

::: {#ide-page4-cobweb-plot-7ff6f21b .ai-feedback-context}

`cobweb_plot(g, x0, number_of_steps=20, x_min=0, x_max=1, title='Spindelvevplott')`

Ett spindelvevplott. Returnerer x_0, ..., x_n.

:::

::: {#ide-page4-make-sqrt-iteration-66efff32 .ai-feedback-context}

`make_sqrt_iteration(a)`

Returnerer funksjonen `g(x)=0.5*(x+a/x)` som brukes til å iterere mot kvadratroten av a. Krever x forskjellig fra null ved hvert steg.

:::

::: {#ide-page4-plot-runs-3bac01b5 .ai-feedback-context}

`plot_runs(runs, requirement)`

Ett panel per kjøring av fixed_point: skrittlengde, residual og kravlinjen.

:::

::::
