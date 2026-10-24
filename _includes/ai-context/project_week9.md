:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week9-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week9-damage-fcb0b628 .ai-feedback-context}

`damage`

0/1-utfall for samme 23 oppskytinger som temps, 1 ved minst én skadet O-ring: np.array([0,1,0,0,0,0,0,0,1,1,1,0,0,1,0,0,0,0,0,0,1,0,1.]). Formen er (23,).

:::

::: {#ide-project_week9-design-ae6c56f5 .ai-feedback-context}

`design(t)`

For temperaturvektor t(m,) returneres float-designmatrise (m,2): første kolonne ettall, andre kolonne t. Konstantledd kommer før temperaturkoeffisient.

:::

::: {#ide-project_week9-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week9-show-line-fit-dc5363ee .ai-feedback-context}

`show_line_fit(line)`

Tar koeffisientvektor line=(konstantledd,temperaturkoeffisient) for rå temperatur i °F. Viser data og linjen line[0]+line[1]\*T på T fra 25 til 85, og markerer verdier under 0/over 1. Returnerer None.

:::

::: {#ide-project_week9-temps-9a041e91 .ai-feedback-context}

`temps`

Temperaturene i °F for 23 oppskytinger: np.array([66,70,69,68,67,72,73,70,57,63,70,78,67,53,67,75,70,81,76,79,75,76,58.]). Radrekkefølgen samsvarer med damage.

:::

::: {#ide-project_week9-beta-oracle-325a7892 .ai-feedback-context}

`beta_oracle`

Publiserte referansekoeffisienter np.array([15.0429,-0.23216]) for logistisk modell med temperatur i °F: komponent 0 er konstantledd, komponent 1 temperaturkoeffisient. Ikke koeffisienter for sentrert eller standardisert temperatur.

:::

::: {#ide-project_week9-show-curves-1da5c293 .ai-feedback-context}

`show_curves(betas, labels)`

Tar parallelle lister betas og labels; hver beta er en 2-vektor for rå temperatur i °F. Viser data og logistiske kurver for T=40..90, samt p=1/2-terskelen fra den første beta-vektoren. Returnerer None.

:::

::: {#ide-project_week9-sigma-2bf05701 .ai-feedback-context}

`sigma(s)`

Elementvis logistisk funksjon 1/(1+exp(-s)); støtter skalar eller NumPy-array og beholder formen. Brukes til sannsynlighetene p=sigma(X@beta).

:::

::: {#ide-project_week9-x-raw-49f2e1a7 .ai-feedback-context}

`X_raw`

designs["rå T"]=design(temps), form (23,2), med ettall og temperaturer i °F som kolonner.

:::

::: {#ide-project_week9-grad-35026aaa .ai-feedback-context}

`grad(X, beta, yy=damage)`

Studentens gradientfunksjon for loss: X(m,2), beta(2,), yy(m,) inn; skal returnere gradientvektor (2,) og bruke damage som standard yy. Startskissen hever NotImplementedError.

:::

::: {#ide-project_week9-alpha-raw-f48c6c91 .ai-feedback-context}

`alpha_raw`

Skalaren 4/np.linalg.svd(X_raw,compute_uv=False)[0]\*\*2, altså 4 delt på kvadratet av største singulærverdi til rå designmatrise.

:::

::: {#ide-project_week9-gd-ea2a7253 .ai-feedback-context}

`gd(X, alpha, tol=1e-06, max_steps=2000, yy=damage)`

Studentens gradientmetode med fast alpha og start beta=zeros(2). Skal returnere (beta,k), stoppe når gradientnormen er under tol eller k når max_steps og bruke grad(X,beta,yy). Startskissen hever NotImplementedError.

:::

::: {#ide-project_week9-loss-94eeaeea .ai-feedback-context}

`loss(X, beta, yy=damage)`

Skalart logistisk tap summert over observasjonene: sum(logaddexp(0,X@beta)-yy\*(X@beta)). X(m,2), beta(2,), yy(m,); yy er damage som standard. np.logaddexp brukes for stabil beregning av log(1+exp(s)).

:::

::: {#ide-project_week9-d-4f9c0b40 .ai-feedback-context}

`d`

Standardavviket temps.std() med NumPys standard ddof=0 over de 23 temperaturene. Brukes som skalering i (temps-m)/d.

:::

::: {#ide-project_week9-designs-827c08f4 .ai-feedback-context}

`designs`

Ordbok med tre (23,2)-designmatriser: "rå T"=design(temps), "sentrert T - 70"=design(temps-70), "standardisert (T - m)/d"=design((temps-m)/d). Første kolonne er alltid ettall; m=temps.mean(), d=temps.std().

:::

::: {#ide-project_week9-hessian-c504b170 .ai-feedback-context}

`hessian(X, beta)`

Returnerer Hessianen X.T@W@X, form (2,2) for sidens X(m,2), med diagonalvekter p_i\*(1-p_i), p=sigma(X@beta). Returnerer en matrise, ikke en optimaliseringsløsning.

:::

::: {#ide-project_week9-m-4f9c0b40 .ai-feedback-context}

`m`

Gjennomsnittet temps.mean() over de 23 temperaturene i °F; brukes som sentrum i standardiseringen (temps-m)/d.

:::

::: {#ide-project_week9-x-std-0939bc5a .ai-feedback-context}

`X_std`

designs["standardisert (T - m)/d"]=design((temps-m)/d), form (23,2). m=temps.mean(), d=temps.std(); modellkoeffisientene gjelder standardiserte temperaturer.

:::

::: {#ide-project_week9-show-fit-bf5fd38d .ai-feedback-context}

`show_fit(beta_F, label='tilpasset modell')`

Tar en 2-vektor beta_F for modellen i opprinnelige °F-koordinater. Viser logistisk kurve og data på T=25..85, datatemperaturenes intervall og markeringen 31 °F; returnerer None.

:::

::: {#ide-project_week9-show-cycles-2392b60f .ai-feedback-context}

`show_cycles(paths, beta_min)`

paths={alpha:array med form (lagrede punkter,2)} i standardiserte beta-koordinater. Tegner de siste 200 punktene per alpha og markerer referansepunktet beta_min (2,); returnerer None.

:::

::: {#ide-project_week9-armijo-gd-28a92a6f .ai-feedback-context}

`armijo_gd(X, grad, max_steps=2000, tol=1e-06, yy=damage)`

Tar studentens grad(X,beta,yy); starter beta=zeros(2). Hvert steg prøver alpha=1 og halverer til Armijo med konstant 1e-4 er oppfylt; stopper ved gradientnorm<tol eller max_steps. Returnerer (beta,k,extra), der extra teller halveringer/ekstra funksjonsverdier.

:::

::: {#ide-project_week9-x-c-9179e629 .ai-feedback-context}

`X_c`

designs["sentrert T - 70"]=design(temps-70), form (23,2), med ettall og temperaturavvik fra 70 °F.

:::

::: {#ide-project_week9-alpha-c-ae727d57 .ai-feedback-context}

`alpha_c`

Skalaren 4/np.linalg.svd(X_c,compute_uv=False)[0]\*\*2, altså 4 delt på kvadratet av største singulærverdi til sentrert designmatrise.

:::

::::
