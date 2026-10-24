:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke8-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke8-minimize-862d1fc3 .ai-feedback-context}

`minimize`

Importert med from scipy.optimize import minimize; SciPys lokale minimeringsrutine brukes med funksjon, startpunkt og metode.

:::

::: {#ide-uke8-np-6f11581d .ai-feedback-context}

`np`

NumPy er importert som np: import numpy as np.

:::

::: {#ide-uke8-plot-model-curves-646bcb9d .ai-feedback-context}

`plot_model_curves(b_values)`

Tar en iterable med verdier b ulik null og viser modellkurvene a\*(1-exp(-b\*t)) med a = 0.5/b sammen med målingene. Oppsettets måledata er t = np.linspace(0, 4, 9), y = 0.5\*t; kurvene tegnes på [0, 4]. Returnerer None.

:::

::: {#ide-uke8-s-75bcf490 .ai-feedback-context}

`S(z)`

Tar z = (a, b), returnerer skalar kvadratsum sum((y - a\*(1 - exp(-b\*t)))\*\*2). Oppsettet bruker t = np.linspace(0, 4, 9) og y = 0.5\*t; funksjonen leser disse globale dataene.

:::

::: {#ide-uke8-plot-inf-examples-25cbe052 .ai-feedback-context}

`plot_inf_examples()`

Ingen argumenter. Viser x på [0, 1], x på (0, 1] og exp(-x) på [0, uendelig), med åpent endepunkt ved 0 i det andre tilfellet og lukket endepunkt i det første og følgene 1/k og k. Alle har infimum 0; bare den første oppnår det. Returnerer None.

:::

::: {#ide-uke8-plot-profiles-bb6de665 .ai-feedback-context}

`plot_profiles(b_values, curves)`

Tar endimensjonale b_values og curves = {navn: differanser} med samme lengde. Viser allerede beregnede forskjeller mellom minste kvadratsum for hver b og grensen b -> 0, med logaritmisk b-akse og nullinje; beregner ingen minimering. Returnerer None.

:::

::: {#ide-uke8-t-ddd4f94e .ai-feedback-context}

`t`

Startdefinisjon: t = np.linspace(0, 4, 9), et endimensjonalt array med ni tidspunkter, jevnt fordelt, begge endepunkter med.

:::

::: {#ide-uke8-plot-saddle-e0ff341e .ai-feedback-context}

`plot_saddle()`

Ingen argumenter. Viser nivåkurver for f(x,y) = x\*\*3 + y\*\*3 - 3\*x\*y og to snitt: f(s,s) = 2\*s\*\*3 - 3\*s\*\*2 og f(s,-s) = 3\*s\*\*2. Markerer (0,0) og (1,1). Returnerer None.

:::

::: {#ide-uke8-plot-chord-examples-14658a0f .ai-feedback-context}

`plot_chord_examples()`

Ingen argumenter. Viser graf og én korde for 0.5\*x\*\*2 + 0.3\*x og x\*\*4 - 3\*x\*\*2 + x, som eksempler på henholdsvis konveks og ikke-konveks funksjon. Returnerer None.

:::

::: {#ide-uke8-s-line-21cfeb59 .ai-feedback-context}

`S_line(c)`

Tar c = (konstantledd, stigning), returnerer skalar kvadratsum sum((bl - c[0] - c[1]\*tl)\*\*2). Oppsettets globale data er tl = [-1., 0., 1., 2.] og bl = [.2, .9, 2.1, 2.8].

:::

::: {#ide-uke8-s-wave-d888a2fd .ai-feedback-context}

`S_wave(z)`

Tar z = (a, w), med amplitude a og frekvens w, returnerer skalar sum((yf - a\*exp(-.3\*tf)\*cos(w\*tf))\*\*2). Globale data er 40 målinger med frø 8 i støyen: tf = np.linspace(0, 6, 40); yf = exp(-.3\*tf)\*cos(2\*tf) + np.random.default_rng(8).normal(0, .02, tf.size).

:::

::: {#ide-uke8-plot-slice-96257137 .ai-feedback-context}

`plot_slice(F, P, Q, name)`

F må ta en vektor og gi en skalar; P og Q er NumPy-vektorer med lik form. Viser F((1-s)\*P+s\*Q) for s i [0,1] og korden mellom F(P) og F(Q); name blir figurtittel. Returnerer None.

:::

::: {#ide-uke8-plot-convex-sets-f760b091 .ai-feedback-context}

`plot_convex_sets()`

Ingen argumenter. Viser skive, rektangel, ring og månesigd, hver med et linjestykke mellom to punkter i mengden; de to første er konvekse. Returnerer None.

:::

::: {#ide-uke8-bl-d2141758 .ai-feedback-context}

`bl`

Startdefinisjon: bl = np.array([.2, .9, 2.1, 2.8]); fire målinger som svarer til tl = [-1., 0., 1., 2.].

:::

::: {#ide-uke8-tl-92e37580 .ai-feedback-context}

`tl`

Startdefinisjon: tl = np.array([-1., 0., 1., 2.]); fire tidspunkter for linjetilpasningen.

:::

::::
