:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week2-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week2-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week2-plt-7be21394 .ai-feedback-context}

`plt`

Importert med `import matplotlib.pyplot as plt`; Matplotlibs pyplot er tilgjengelig gjennom plt.

:::

::: {#ide-project_week2-roots-8df4041d .ai-feedback-context}

`roots`

Kompleks NumPy-vektor av nullpunktene til valgt polynom, beregnet med np.roots(my_function["coefficients"]). Rekkefølgen definerer de ikke-negative indeksene i basin og result["root"].

:::

::: {#ide-project_week2-df-8df4041d .ai-feedback-context}

`df`

Den analytisk deriverte av den valgte polynomfunksjonen, laget med np.polyder og evaluert med np.polyval. Støtter komplekst tall og NumPy-array; samme funksjonstildeling som f.

:::

::: {#ide-project_week2-f-8df4041d .ai-feedback-context}

`f`

Den valgte polynomfunksjonen fra prepare_function(my_function); evaluerer my_function["coefficients"] med np.polyval, høyeste grad først. Tar komplekst tall eller NumPy-array og gir tilsvarende funksjonsverdier.

:::

::: {#ide-project_week2-newton-trace-288cbf47 .ai-feedback-context}

`newton_trace(f, df, roots, z0, tol=1e-08, maxiter=50, derivative_tol=1e-14)`

Én kompleks startverdi; Newton-iterasjon stopper ved abs(f(z)) < tol, for liten/ugyldig derivert, ikke-endelig nytt punkt eller maxiter. Returnerer dict med z, converged, root (nullpunktindeks eller None), reason, iterations og history. Hver historikkrad har n, z, residual, step; startens step er NaN.

:::

::: {#ide-project_week2-plot-trace-3cdeb5d9 .ai-feedback-context}

`plot_trace(result)`

Tar dict fra newton_trace. Tegner residual og skrittlengde mot iterasjonsnummer med logaritmisk y-akse; startens NaN-skritt utelates. Lukker eldre figurer, viser figuren og returnerer None.

:::

::: {#ide-project_week2-print-trace-6868512c .ai-feedback-context}

`print_trace(result)`

Tar dict fra newton_trace, skriver historikkens n, z, residual og step samt stoppårsak og iterasjonstall. Ved konvergens slår den opp nullpunktet i sidens globale roots; returnerer None.

:::

::: {#ide-project_week2-patch-886e31f5 .ai-feedback-context}

`Patch`

Importert med `from matplotlib.patches import Patch`; rektangulære Patch-objekter brukes som fargeforklaring i basinfiguren.

:::

::: {#ide-project_week2-my-function-b21bc776 .ai-feedback-context}

`my_function`

Den valgte raden i FUNCTIONS, bestemt deterministisk fra normalisert fornavn. Ordboken har label, coefficients (høyeste grad først), formula og plot_window; aktuell rad avhenger av navnet som ble kjørt.

:::

::: {#ide-project_week2-newton-grid-6ef1e72a .ai-feedback-context}

`newton_grid(f, df, roots, bounds, nx=400, ny=400, tol=1e-08, maxiter=50, derivative_tol=1e-14)`

bounds=(xmin,xmax,ymin,ymax), nx punkter vannrett og ny loddrett. Returnerer dict med basin, iterations, residual og z som (ny,nx)-arrays samt bounds,tol,maxiter,roots. basin >= 0 er nærmeste nullpunktindeks etter residual < tol; -1 betyr maxiter og -2 ugyldig beregning/liten derivert. Iterasjonstall teller utførte steg.

:::

::: {#ide-project_week2-plot-basins-d72a8324 .ai-feedback-context}

`plot_basins(data, title='Newtons metode: tiltrekningsområder', critical_points=None, iteration_cap=20)`

Tar dict fra newton_grid. Venstre bilde koder basin/nullpunkt (grått for -1, svart for -2); høyre viser iterasjoner bare for konvergerte piksler. iteration_cap avkorter fargeskalaen, ikke selve iterasjonene. Nullpunkter og eventuelle critical_points markeres; returnerer None.

:::

::: {#ide-project_week2-print-summary-4b298aa6 .ai-feedback-context}

`print_summary(summary)`

Skriver dict fra summarize_grid: antall startverdier, konvergerte, maxiter, ugyldige, konvergensandel, gjennomsnittlige iterasjoner og største godkjente residual. Returnerer None.

:::

::: {#ide-project_week2-summarize-grid-9d41bc57 .ai-feedback-context}

`summarize_grid(data)`

Tar newton_grid-dict; returnerer total, converged, not_converged, invalid, fraction_converged, mean_iterations og max_accepted_residual. Gjennomsnitt og største residual gjelder bare basin >= 0, og blir NaN når ingen konvergerte.

:::

::: {#ide-project_week2-basin-data-88c3f2d1 .ai-feedback-context}

`basin_data`

Resultatdict fra newton_grid(f,df,roots,bounds=bounds,nx=400,ny=400,tol=1e-8,maxiter=50). Inneholder blant annet 400×400-arrays for basin, iterations, residual og z; faktisk resultat følger studentens funksjonstildeling og kjørte parametere.

:::

::: {#ide-project_week2-critical-points-8df4041d .ai-feedback-context}

`critical_points`

Kompleks NumPy-vektor av nullpunktene til df: np.roots på de deriverte polynomkoeffisientene. Dette er kritiske punkter der Newtons divisjon med df kan være problematisk.

:::

::: {#ide-project_week2-bounds-fc418329 .ai-feedback-context}

`bounds`

Den valgte funksjonens plot_window, en tuple (xmin,xmax,ymin,ymax) i det komplekse planet. Brukes til det første basin-rutenettet; faktisk verdi avhenger av my_function.

:::

::: {#ide-project_week2-print-boundary-summary-3f9df8fb .ai-feedback-context}

`print_boundary_summary(data)`

Tar newton_grid-dict og skriver vindusbredde, pikselbredde, synlige basin, andel grensepiksler og iterasjonsmål på grense/indre. Grense betyr boundary_mask, andelen måles blant konvergerte piksler; returnerer None.

:::

::: {#ide-project_week2-boundary-point-5a4f1705 .ai-feedback-context}

`boundary_point`

Komplekst punkt fra suggest_boundary_point(basin_data): midt mellom vannrette nabopiksler som konvergerte mot ulike nullpunkter, valgt nær bildets sentrum og helst unna kanten. Beregningen feiler hvis ingen slik grense finnes.

:::

::: {#ide-project_week2-boundary-mask-53c85037 .ai-feedback-context}

`boundary_mask(data)`

Tar newton_grid-dict; returnerer bool-array med samme form som basin. Begge piksler markeres når vannrette/loddrette naboer har ulike ikke-negative basin-indekser. Maxiter og ugyldige piksler lager ikke grenser; diagonale naboer sammenlignes ikke.

:::

::::
