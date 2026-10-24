:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week6-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week6-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week6-show-coordinate-change-02d23263 .ai-feedback-context}

`show_coordinate_change(A, b, At, bt)`

Tar to 2D-kvadratiske problemer (A,b) og (At,bt), hver med 2×2-matrise og 2-vektor. Tegner nivåkurver i opprinnelige x- og nye y-koordinater; beregner ikke koordinatskiftet selv og returnerer None.

:::

::: {#ide-project_week6-cg-7910cbff .ai-feedback-context}

`cg(A, b, x0=None, rtol=1e-08, atol=0.0, max_steps=1000)`

For symmetrisk positiv definit A(n,n), b(n,), eventuelt x0(n,). Stopper på direkte ||b-Ax|| <= atol+rtol\*||b||. Returnerer dict: path (lagrede punkter,n) med startpunkt, residuals med absolutte originalresidualer, converged, matvecs og preconditioner_calls=0. Teller ett startprodukt og to A-produkter per steg; ugyldig input/ikke-positiv krumning gir ValueError.

:::

::: {#ide-project_week6-make-week6-problems-97c5f5c4 .ai-feedback-context}

`make_week6_problems(n=60)`

Returnerer (star,problems): star er en deterministisk normalfordelt n-vektor (frø 6), problems er navngitte SPD-matriser (n,n) for "Ujevn skalering" og "Poisson". Høyresider lages senere som A@star. Poisson er tridiagonal med diagonal 2 og nabodiagonaler -1.

:::

::: {#ide-project_week6-problems-bcb283d6 .ai-feedback-context}

`problems`

Andre returverdi fra make_week6_problems(n=60): dict med "Ujevn skalering" og "Poisson", hver en 60×60 SPD-matrise. Hvert system får høyreside A@x_star og dermed samme kjente løsning.

:::

::: {#ide-project_week6-x-star-bcb283d6 .ai-feedback-context}

`x_star`

Første returverdi fra make_week6_problems(n=60), en kjent referanseløsning med form (60,) fra default_rng(6).normal. Samme vektor brukes til høyresiden b=A@x_star for hvert problems-system.

:::

::: {#ide-project_week6-show-spectra-9d5da394 .ai-feedback-context}

`show_spectra(problems, transformed)`

Tar problems={navn:A} og transformed={navn:(At,x_path)} med samsvarende navn. Bruker transformed[name][0], tegner sorterte egenverdier med logaritmisk y-akse og skriver κ₂ før/etter som største/minste egenverdi. Returnerer None.

:::

::: {#ide-project_week6-transformed-2e6e0054 .ai-feedback-context}

`transformed`

Ordbok fylt i transformasjonscellen, ikke bare startverdien {}. For hvert navn i problems lagres (At,x_path): At=D\^(-1/2) A D\^(-1/2) og x_path er CG-banen omregnet til opprinnelige x-koordinater; D=diag(diag(A)). x_path har én rad per lagret punkt.

:::

::: {#ide-project_week6-check-pcg-ef277aee .ai-feedback-context}

`check_pcg(pcg_method)`

Offentlig kontrollhjelper som tar studentens pcg-funksjon og kjører fire kontroller før hovedforsøket. Den krever det avtalte PCG-grensesnittet og resultatordboken; selve kontrollimplementasjonen inngår ikke i denne konteksten.

:::

::: {#ide-project_week6-pcg-7ff74ab5 .ai-feedback-context}

`pcg(A, b, m, x0=None, rtol=1e-08, atol=0.0, max_steps=1000)`

Studentens PCG-mal for SPD-A(n,n), b(n,) og positiv diagonal m(n,). Skal returnere dict med path,residuals,converged,matvecs,preconditioner_calls, samme originalresidualkrav atol+rtol\*||b|| som cg. Startpunktet lagres og kan stoppe direkte; de markerte TODO-delene for prekondisjonering og søkeretning er ikke fullført.

:::

::: {#ide-project_week6-compare-runs-40ba6d69 .ai-feedback-context}

`compare_runs(A, b, star, runs)`

runs er {metodenavn:resultatdict} med path,residuals,converged,matvecs,preconditioner_calls. Sammenligner ||b-Ax||/||b|| og ||x-star||/||star|| mot arbeidsaksen 1+2\*k; path har punktene som rader. Skriver sluttmål/arbeid og viser to figurer; returnerer None.

:::

::::
