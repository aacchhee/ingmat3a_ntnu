:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week10-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week10-d-exact-5d11171c .ai-feedback-context}

`d_exact`

np.linalg.norm(z_true-hall,axis=1): vektor (4,) av nøyaktige avstander fra z_true til hallens ankerrader, i meter.

:::

::: {#ide-project_week10-hall-05c3f3b7 .ai-feedback-context}

`hall`

Ankermatrisen np.array([[0.,0.],[10.,0.],[10.,8.],[0.,8.]]), form (4,2), i meter. Hver rad er ett anker i hallen.

:::

::: {#ide-project_week10-jacobian-70c58482 .ai-feedback-context}

`jacobian(z, B)`

For z(2,) og B(m,2) returneres J(m,2); rad i er (z-B[i])/||z-B[i]||. Krever z ulik alle ankrene for at nevnerne skal være positive.

:::

::: {#ide-project_week10-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week10-residual-faa78ea1 .ai-feedback-context}

`residual(z, B, d)`

For z(2,), B(m,2), d(m,) returneres avstandsresidualen (m,): norm(z-B[i])-d[i]. Fortegnet er beregnet minus målt avstand.

:::

::: {#ide-project_week10-z-true-9d2e97c2 .ai-feedback-context}

`z_true`

Referanseposisjonen np.array([3.,5.]), form (2,), i meter for hall-forsøket.

:::

::: {#ide-project_week10-show-hall-cf529db4 .ai-feedback-context}

`show_hall(B, d=None, paths=(), labels=(), true=None, box=(-2, 12, -6, 10))`

Tar ankerrader B(m,2), eventuelt d(m,), lister med baner (punkter,2) og parallelle labels, samt true(2,). Tegner ankre, valgfrie ||r(z)||-nivåkurver/baner/fasit innen box=(xmin,xmax,ymin,ymax), med like akser i meter. Returnerer None.

:::

::: {#ide-project_week10-d-bad-f5992bb8 .ai-feedback-context}

`d_bad`

d_exact + np.array([0.,0.,3.,0.]); bare tredje ankers avstand får en positiv feil på 3 meter.

:::

::: {#ide-project_week10-d-noisy-1992b3c2 .ai-feedback-context}

`d_noisy`

d_exact + np.array([.3,-.4,.5,-.2]); fire avstander med de angitte additive målefeilene i meter. Samme ankerrekkefølge som hall.

:::

::: {#ide-project_week10-dropped-part-e0bb18a9 .ai-feedback-context}

`dropped_part(z, B, r, J)`

For z(2,), B(m,2), residual r(m,) og tilhørende J(m,2) returneres 2×2-leddet sum_i r_i\*(I-J_i J_i\^T)/||z-B_i||. Dette er delen utelatt fra J.T@J i Gauss-Newton; z må være ulik ankrene.

:::

::: {#ide-project_week10-gauss-newton-da0fde47 .ai-feedback-context}

`gauss_newton(z0, B, d, steps=10)`

Kopierer z0 og utfører nøyaktig steps oppdateringer z=z+gn_step(z,B,d). Returnerer alle punkter inklusive startpunkt som array (steps+1,2). Har ingen innebygd toleransestopp eller demping.

:::

::: {#ide-project_week10-newton-position-238c4ade .ai-feedback-context}

`newton_position(z0, B, d, residual, jacobian, steps=8)`

Bruker de innsendte residual-/jacobian-funksjonene for F=1/2||r||². Tar rene Newton-steg med H=J.T@J+dropped_part og løser H\*p=-J.T@r. Returnerer banen inklusive z0 som (steps+1,2); ingen linjesøk eller toleransestopp, og H må være løsbar.

:::

::: {#ide-project_week10-move-b94d63cf .ai-feedback-context}

`move(J, delta_d)`

Tar J(m,2) og måleendring delta_d(m,); returnerer minste kvadraters forflytning dz(2,) for J\*dz=delta_d med np.linalg.lstsq(...,rcond=None).

:::

::: {#ide-project_week10-show-moves-f100bc59 .ai-feedback-context}

`show_moves(center, J, eps, groups)`

Tar center(2,), fullkolonnerang-J(m,2), eps og groups={navn:liste med dz(2,)}. Viser center+dz og SVD-ellipsen med halvakser eps/sigma_i langs høyresingulærvektorene. For visning gjøres største komponent i hver v_i positiv; ingen endring av inputpunktene. Returnerer None.

:::

::: {#ide-project_week10-d-wall-d4128296 .ai-feedback-context}

`d_wall`

np.linalg.norm(z_true_wall-wall,axis=1): vektor (4,) av nøyaktige avstander fra vegg-forsøkets referanseposisjon til wall-ankrene.

:::

::: {#ide-project_week10-wall-e1fdb0bc .ai-feedback-context}

`wall`

Ankermatrisen np.array([[0.,0.],[4.,.1],[7.,-.1],[10.,0.]]), form (4,2), nesten langs samme horisontale vegg.

:::

::: {#ide-project_week10-z-true-wall-6bbf796f .ai-feedback-context}

`z_true_wall`

Referanseposisjonen np.array([6.,3.]), form (2,), i meter for vegg-forsøket.

:::

::: {#ide-project_week10-gn-step-fbf22546 .ai-feedback-context}

`gn_step(z, B, d)`

Studentens Gauss-Newton-steg: z(2,), B(m,2), d(m,) inn, skal gi forflytning p(2,) fra minste kvadraters linearisering av residualen. Startskissen hever NotImplementedError; gauss_newton er avhengig av at denne fullføres.

:::

::::
