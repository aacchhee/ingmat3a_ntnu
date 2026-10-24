:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke10-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke10-show-model-f6e8471b .ai-feedback-context}

`show_model(phi, dphi, d2phi, x0, mu=0.0, xlim=(-0.5, 2.0), name='x')`

phi må tåle både skalare og endimensjonale arrayargumenter; dphi og d2phi brukes i det skalare x0. Viser phi og den lokale parabelen med krumning d2phi(x0)+mu, samt parabelens stasjonære punkt x0-dphi(x0)/(d2phi(x0)+mu). Krever nevner ulik null; xlim styrer x-intervallet og name akseetiketten. Returnerer None.

:::

::: {#ide-uke10-himmel-d0d2da78 .ai-feedback-context}

`himmel(z)`

Tar z = (x,y) og returnerer skalar Himmelblau-verdi (x\*x + y - 11)\*\*2 + (x + y\*y - 7)\*\*2.

:::

::: {#ide-uke10-himmel-grad-75df97b1 .ai-feedback-context}

`himmel_grad(z)`

Tar z = (x,y), returnerer gradienten til himmel som et NumPy-array med form (2,): [4\*x\*a + 2\*b, 2\*a + 4\*y\*b], der a = x\*x+y-11 og b = x+y\*y-7.

:::

::: {#ide-uke10-himmel-hess-c5868e2e .ai-feedback-context}

`himmel_hess(z)`

Tar z = (x,y), returnerer den symmetriske Hessianen til himmel med form (2,2): [[12\*x\*x + 4\*y - 42, 4\*x + 4\*y], [4\*x + 4\*y, 12\*y\*y + 4\*x - 26]].

:::

::: {#ide-uke10-np-6f11581d .ai-feedback-context}

`np`

NumPy er importert som np: import numpy as np.

:::

::: {#ide-uke10-plot-errors-7affd196 .ai-feedback-context}

`plot_errors(curves)`

Tar curves = {navn: feilfølge}; viser høyst tre kurver mot opprinnelige stegindekser med logaritmisk y-akse. Bare strengt positive feil tegnes; null og negative verdier utelates. Returnerer None.

:::

::: {#ide-uke10-show-units-6e9d7047 .ai-feedback-context}

`show_units(p_m, g_m, p_dm, g_dm, start=(2.5, 2.5))`

Tar fire 2-vektorer: Newton-steg p_m/p_dm og gradientretninger g_m/g_dm i henholdsvis meter- og desimeterkoordinater. Viser Himmelblau med første koordinat skalert med 1 og 10; røde gradientpiler får samme synlige lengde som de blå Newton-pilene. Gradientvektorene må være ulike null. Returnerer None.

:::

::: {#ide-uke10-newton-basins-26bcd7a4 .ai-feedback-context}

`newton_basins(safe, n=81, steps=80, which=False)`

Returnerer (X0,Y0,kind), alle med form (n,n), for Himmelblau fra et jevnt startgitter i [-5,5]\*\*2 etter høyst steps oppdateringer. safe=True bruker H+mu\*I med mu = 0,0.5,1,2,... til positiv definitet og Armijo-halvering; ellers rene Newton-steg. kind er 0 minimum, 1 sadel, 2 maksimum, -1 uklassifisert/ikke konvergert, med sluttkrav gradientnorm < 1e-6. which=True legger til et (n,n)-array med indeks 0–3 til nærmeste oppgitte minimum, -1 ellers; rekkefølgen er (3,2), (-2.805118,3.131312), (-3.779310,-3.283186), (3.584428,-1.848126).

:::

::: {#ide-uke10-show-basins-dece837f .ai-feedback-context}

`show_basins(X0, Y0, kind)`

Tar X0, Y0 og kind som like store todimensjonale arrays fra newton_basins. Farger startgitteret etter kind: 0 minimum (blå), 1 sadel (oransje), 2 maksimum (rød); rutinen klassifiserer ikke punktene selv. Returnerer None.

:::

::: {#ide-uke10-well-149ac5c5 .ai-feedback-context}

`well(x)`

Tar x = (u,v) og returnerer skalar (u\*u - 1)\*\*2 + 0.5\*v\*v.

:::

::: {#ide-uke10-well-grad-0afe68bb .ai-feedback-context}

`well_grad(x)`

Tar x = (u,v) og returnerer gradienten til well som et NumPy-array med form (2,): [4\*u\*(u\*u-1), v].

:::

::: {#ide-uke10-well-hess-0bb9d786 .ai-feedback-context}

`well_hess(x)`

Tar x = (u,v) og returnerer Hessianen til well, np.diag([12\*u\*u-4, 1.]), med form (2,2); de blandede andrederiverte er null.

:::

::: {#ide-uke10-armijo-991d89e2 .ai-feedback-context}

`armijo(f, g, x, p, c=0.0001, max_halvings=25)`

f gir en skalar; g, x og p er like lange NumPy-vektorer, med g som gradient i x. Krever endelig g@p < 0, ellers ValueError. Prøver alpha = 1, 1/2, ... til f(x+alpha\*p) <= f(x)+c\*alpha\*(g@p). Returnerer (alpha, antall halveringer), eller RuntimeError etter forsøkene med 0 til max_halvings halveringer.

:::

::: {#ide-uke10-show-valley-91b556a5 .ai-feedback-context}

`show_valley(z, p)`

Tar 2-vektorer z og p og viser valley(z+alpha\*p) og den kvadratiske Taylor-modellen langs p. Venstre panel beregner egne baner fra (0,0): to fulle Newton-steg og fem Armijo-dempede Newton-steg, uavhengig av z og p. Returnerer None.

:::

::: {#ide-uke10-valley-58d616b4 .ai-feedback-context}

`valley(x)`

Tar x = (u,v) og returnerer skalar dalfunksjon q = (1-u)\*\*2 + 10\*(v-u\*u)\*\*2.

:::

::: {#ide-uke10-valley-grad-08bc0a48 .ai-feedback-context}

`valley_grad(x)`

Tar x = (u,v) og returnerer gradienten til valley som et NumPy-array med form (2,): [2\*(u-1)-40\*u\*(v-u\*u), 20\*(v-u\*u)].

:::

::: {#ide-uke10-valley-hess-53f962d5 .ai-feedback-context}

`valley_hess(x)`

Tar x = (u,v) og returnerer den symmetriske Hessianen til valley med form (2,2): [[2-40\*v+120\*u\*u, -40\*u], [-40\*u, 20.]].

:::

::: {#ide-uke10-show-minima-bc8da9dd .ai-feedback-context}

`show_minima(X0, Y0, which)`

Tar X0, Y0 og which som like store todimensjonale arrays fra newton_basins(..., which=True). Farger gitteret med minimumindeks 0–3 og markerer fire minimumpunkter for Himmelblau med stjerner. Utfører ingen Newton-iterasjoner. Returnerer None.

:::

::: {#ide-uke10-minimize-862d1fc3 .ai-feedback-context}

`minimize`

Importert med from scipy.optimize import minimize; SciPys lokale minimeringsrutine kalles her med blant annet jac og hess for metoder som bruker deriverte.

:::

::::
