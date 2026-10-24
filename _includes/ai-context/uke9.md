:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke9-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke9-grad9-7f3a74d2 .ai-feedback-context}

`grad9(z)`

Tar z = (x,y) og returnerer et NumPy-array med form (2,), gradienten til f9: [4\*x\*u + 2\*w, 2\*u + 4\*y\*w], der u = x\*x + y - 11 og w = x + y\*y - 7.

:::

::: {#ide-uke9-np-6f11581d .ai-feedback-context}

`np`

NumPy er importert som np: import numpy as np.

:::

::: {#ide-uke9-plot-x-paths-c37dbe7b .ai-feedback-context}

`plot_x_paths(xs_per_alpha)`

Tar xs_per_alpha = {steglengde: følge av x-koordinater}; viser høyst fem følger mot stegindeks med referanselinjen x = 3. Ingen gradientsteg beregnes. Returnerer None.

:::

::: {#ide-uke9-hess9-01410542 .ai-feedback-context}

`hess9(z)`

Tar z = (x,y) og returnerer den symmetriske Hessianen til f9 med form (2,2): [[12\*x\*x + 4\*y - 42, 4\*x + 4\*y], [4\*x + 4\*y, 12\*y\*y + 4\*x - 26]].

:::

::: {#ide-uke9-plot-step-factors-91af84e4 .ai-feedback-context}

`plot_step_factors(lam, marked=())`

lam er et array med stigende positive egenverdier; første og siste brukes som ytterpunkter. Viser |1-alpha\*lam[0]|, |1-alpha\*lam[-1]| og maksimumet deres, samt merkene 2/(lam[0]+lam[-1]) og 2/lam[-1]. marked inneholder ekstra alpha-verdier som markeres. Returnerer None.

:::

::: {#ide-uke9-plot-errors-57115135 .ai-feedback-context}

`plot_errors(curves, ylabel='feil', xlog=False)`

Tar curves = {navn: feilfølge}; viser høyst fem kurver med logaritmisk y-akse og stegindeks som x. ylabel velger y-etikett; xlog=True gir også logaritmisk x-akse. Verdiene endres ikke før plotting. Returnerer None.

:::

::: {#ide-uke9-minima-cb2037cb .ai-feedback-context}

`minima`

Startdefinisjonen er listen med fire minimumpunkter for Himmelblau: [(3., 2.), (-2.805118, 3.131312), (-3.779310, -3.283186), (3.584428, -1.848126)]. De siste tre er avrundet.

:::

::: {#ide-uke9-f9-0f604562 .ai-feedback-context}

`f9(z)`

Tar en vektor z = (x,y) med to komponenter og returnerer skalar Himmelblau-verdi (x\*x + y - 11)\*\*2 + (x + y\*y - 7)\*\*2.

:::

::: {#ide-uke9-fixed-steps-b00fa515 .ai-feedback-context}

`fixed_steps(alpha, start=(0.0, 0.0), n=40)`

Utfører inntil n oppdateringer z <- z - alpha\*grad9(z) på f9 fra en todimensjonal start. Returnerer (slutt-z, verdiarray, punktarray med to kolonner); loggene inkluderer starten. Stopper før logging av et ikke-endelig punkt eller norm over 1e6; slutt-z kan ligge utenfor loggen.

:::

::: {#ide-uke9-plot-runs-cbf815ae .ai-feedback-context}

`plot_runs(runs, on_map=None, box=(-1, 4))`

Tar runs = {navn: (sluttpunkt, verdiarray, punktarray)}; punktarray må ha form (m,2). Viser høyst fem kjøringer: baner på f9-nivåkurver og verdier mot steg med logaritmisk y-akse. on_map filtrerer bare banekartet; ved plotting løftes verdier under 1e-15 til 1e-15. Returnerer None.

:::

::: {#ide-uke9-compass-c3234512 .ai-feedback-context}

`compass(z, step, min_step, maxpolls=10000)`

Minimerer f9 fra en 2-vektor ved å prøve fire koordinatretninger med lengde step. Aksepterer den strengt beste forbedringen; ellers halveres step. Returnerer (2-vektor, siste mislykkede steglengde, antall prøverunder, liste med start og aksepterte punkter). Krever endelig 0 < min_step <= step; stopper når step < min_step og gir RuntimeError ved maxpolls.

:::

::: {#ide-uke9-plot-path-ae7201a8 .ai-feedback-context}

`plot_path(path, label, box=(-4, 4))`

Tar en ikke-tom punktfølge med form (m,2), en kurveetikett og box = (nedre,øvre) for begge koordinatakser. Viser banen over nivåkurver for f9 og markerer (3,2). Returnerer None.

:::

::: {#ide-uke9-plot-samples-f6a080b4 .ai-feedback-context}

`plot_samples(grid, random_points)`

Tar grid og random_points som NumPy-arrays med to kolonner; viser begge punktmengdene i kvadratet [-4,4]\*\*2 og markerer (3,2). Lager ingen prøver og utfører ingen søk. Returnerer None.

:::

::: {#ide-uke9-s8-ab2d0174 .ai-feedback-context}

`S8(z)`

Tar z = (a,b) og returnerer skalar kvadratsum sum((y8-a\*(1-exp(-b\*t8)))\*\*2). De globale dataene i oppsettet er t8 = np.linspace(0,4,9) og y8 = 0.5\*t8.

:::

::: {#ide-uke9-grad-s8-91705fbf .ai-feedback-context}

`grad_S8(z)`

Tar z = (a,b) og returnerer et NumPy-array med form (2,), gradient til S8: [-2\*sum(r\*(1-e)), -2\*sum(r\*a\*t8\*e)], der e = exp(-b\*t8), r = y8-a\*(1-e). Oppsettets globale data er t8 = np.linspace(0,4,9), y8 = 0.5\*t8.

:::

::: {#ide-uke9-plot-drift-3e942b81 .ai-feedback-context}

`plot_drift(path)`

Tar en ikke-tom punktfølge med form (m,2), kolonner (a,b), og viser den sammen med a = 0.5/b i (a,b)-planet. Kurven beregnes for b i [0.1,1.2]; ingen iterasjoner utføres. Returnerer None.

:::

::::
