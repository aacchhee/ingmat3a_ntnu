:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week5-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week5-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week5-s-862a1ab0 .ai-feedback-context}

`S`

Studentens 6×6 overgangsmatrise. Kolonne j er avsenderside j, rad i er mottakerside i; den skal beskrive lenkesannsynligheter fra papirnettet. Startskissen inneholder bare nuller og må fylles ut.

:::

::: {#ide-project_week5-direct-rank-e619ed46 .ai-feedback-context}

`direct_rank(S, alpha, u)`

Returnerer den direkte løsningen av (I-alpha\*S)p=(1-alpha)\*u med np.linalg.solve. For S(n,n) og u(n,) fås vektor p(n,); forutsetter at koeffisientmatrisen er invertibel.

:::

::: {#ide-project_week5-names-65b5f86f .ai-feedback-context}

`names`

list("ABCDEF"), navnene til de seks sidene i samme rekkefølge som radene/kolonnene i S.

:::

::: {#ide-project_week5-pagerank-6f6871bf .ai-feedback-context}

`pagerank(S, alpha, u, p0, error_goal=1e-08, max_steps=10000)`

Forutsetter fullførte studentfunksjoner visit_step og residual_norm. Kopierer p0; returnerer (p,residuals,converged), med 1-normresidualer inklusive starten, høyst max_steps+1 verdier. Stopper når residual <= (1-alpha)\*error_goal, ellers False ved stegrensen. Feilgarantien forutsetter prosjektets stokastiske modell og 0<=alpha<1.

:::

::: {#ide-project_week5-u0-54c3d00d .ai-feedback-context}

`u0`

np.ones(6)/6, den uniforme sannsynlighetsvektoren med seks komponenter; sum 1. Brukes som standard hoppfordeling i prosjektet.

:::

::: {#ide-project_week5-plt-7be21394 .ai-feedback-context}

`plt`

Importert med `import matplotlib.pyplot as plt`; Matplotlibs pyplot er tilgjengelig gjennom plt.

:::

::: {#ide-project_week5-visit-step-88ad3ef8 .ai-feedback-context}

`visit_step(S, alpha, u, p)`

Studentens ettstegsfunksjon: S(n,n), hoppandelens parameter alpha, hoppfordeling u(n,) og gjeldende fordeling p(n,) inn; skal gi ny fordeling (n,) etter lenker og hopp. Startskissen returnerer None og må fullføres.

:::

::::
