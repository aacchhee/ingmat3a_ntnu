:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke6-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke6-error-plot-65438c90 .ai-feedback-context}

`error_plot(curves, xlabel='Sveip', ylabel='Avstand til løsningen')`

Tegn feilkurver på logaritmisk skala. curves: {navn: feilnormer}.

:::

::: {#ide-uke6-gs-path-e78d0fee .ai-feedback-context}

`gs_path(A, b, x0, sweeps=12)`

Gauss–Seidel for A med form (n,n), b og x0 med form (n,), med ikke-null diagonalelementer. Oppdaterer koordinatene i rekkefølge med `x[i]+=(b[i]-A[i]@x)/A[i,i]`, og bruker allerede oppdaterte koordinater. Returnerer hele banen som array med form (1+sweeps\*n,n): både startpunktet og hvert koordinatmellomsteg lagres.

:::

::: {#ide-uke6-np-6f11581d .ai-feedback-context}

`np`

Tilgjengelig fra oppsettet: `import numpy as np`.

:::

::: {#ide-uke6-show-unit-circle-image-586343cb .ai-feedback-context}

`show_unit_circle_image(B)`

Enhetssirkelen og bildet av den under en 2x2-matrise B, med bildene av e1 og e2.

:::

::: {#ide-uke6-show-conditioning-055de0e4 .ai-feedback-context}

`show_conditioning(K_verdier, feil)`

Relativ foroverfeil mot kondisjonstall, begge på logaritmisk skala.

:::

::: {#ide-uke6-show-surface-and-levels-7ac86ea0 .ai-feedback-context}

`show_surface_and_levels(phi, minimum, marked, levels=(-7, -6, -4, 0, 5, 10), bounds=(-1, 3, -1, 4))`

Flaten z = phi(u, v) og nivåkurvene sett ovenfra, med minimum og markerte punkter.

:::

::: {#ide-uke6-bowl-plot-a08ab78f .ai-feedback-context}

`bowl_plot(ax, A, b, paths, bounds=(-1, 3, -1, 3))`

Tegner nivåkurver for phi(x)=0.5\*x@A@x-b@x på det gitte Matplotlib-akseobjektet ax, for symmetrisk 2x2 A og b med to komponenter. paths er {navn: array med to koordinater per rad}. Direkte np.linalg.solve(A,b) brukes bare til å markere løsningen som referanse i figuren.

:::

::: {#ide-uke6-plt-7be21394 .ai-feedback-context}

`plt`

Tilgjengelig fra oppsettet: `import matplotlib.pyplot as plt`.

:::

::: {#ide-uke6-line-search-plot-fb0f9618 .ai-feedback-context}

`line_search_plot(A, b, x0, p0, alpha0, bounds=(-0.5, 2.7, -0.5, 3.2))`

Øverst: søkelinjen x0 + alpha\*p0, nivåkurven gjennom x1, ny residual og rett linje til løsningen. Nederst: psi(alpha) = phi(x0 + alpha\*p0) med linjens og skålens minimum.

:::

::: {#ide-uke6-descent-path-3710b68f .ai-feedback-context}

`descent_path(A, b, x0, steps=25, rtol=1e-10)`

Bratteste nedstigning for SPD A med form (n,n) og b,x0 med form (n,). Residual r=b-A@x; stopp ved norm(r)<=rtol\*norm(b). Hvert steg er `x += (r@r)/(r@(A@r))*r`, med kontroll av positiv krumning. Returnerer array av startpunktet og de lagrede oppdaterte punktene, høyst steps oppdateringer.

:::

::: {#ide-uke6-two-bowls-b41c6f38 .ai-feedback-context}

`two_bowls(cases, bounds=(-0.5, 1.5, -1.5, 0.5))`

Nivåkurvebilder over hverandre, ett per tilfelle. cases: liste med (A, b, baner, tittel); banene tegnes med bowl_plot, og startpunktet (0, 0) merkes.

:::

::: {#ide-uke6-parallel-minima-plot-4a41e7d4 .ai-feedback-context}

`parallel_minima_plot(A, b, d, offsets, bounds=(0.35, 2.1, 0.65, 2.65))`

Linjer (0, c) + t\*d for hver c i offsets, minimum på hver linje og linjen d\^T(Ax - b) = 0 som går gjennom alle disse minimumspunktene.

:::

::: {#ide-uke6-cg-7910cbff .ai-feedback-context}

`cg(A, b, x0=None, rtol=1e-08, atol=0.0, max_steps=1000)`

Konjugert gradient for SPD A med form (n,n), b og valgfri x0 med form (n,); standard x0 er null. Krever endelige tall, rtol>0, atol>=0, max_steps>=1 og positiv krumning. Med r=b-A@x og p=r brukes alpha=(r@r)/(p@(A@p)), kort residualoppdatering og p=r_new+(rr_new/rr)\*p. Direkte norm(b-A@x) kontrolleres mot atol+rtol\*norm(b), også ved start. Returnerer ordbok med path (start og iterater), residuals (direkte normer), converged, matvecs og preconditioner_calls=0.

:::

::: {#ide-uke6-second-step-plot-709b2ade .ai-feedback-context}

`second_step_plot(A, b, first, S, M, solution, bounds=(0.78, 1.6, 1.28, 2.16))`

Andre steg fra x1: bratteste nedstigning til S, CG til løsningen, og M = minimum på linjen gjennom S i den gamle retningen (1, 1).

:::

::::
