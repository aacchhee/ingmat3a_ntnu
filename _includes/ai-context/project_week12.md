:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week12-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week12-energy-4bbc55c8 .ai-feedback-context}

`energy(z, loads=None)`

For flat z-vektor med x,y-par returneres skalar sum(load_i\*y_i), potensiell energi. loads=None bruker w=1.0 ved alle frie punkter; alternativ loads må kunne multipliseres elementvis med høydevektoren.

:::

::: {#ide-project_week12-grad-energy-93b2c70f .ai-feedback-context}

`grad_energy(z, loads=None)`

Returnerer vektor med samme lengde som flat z: null på x-plasser og vekt på y-plasser. loads=None bruker w=1.0; egne loads tilordnes y-komponentene.

:::

::: {#ide-project_week12-jac-links-3145f2a4 .ai-feedback-context}

`jac_links(z, *args)`

Returnerer lengdekravenes Jacobimatrise, form (N,2\*(N-1)). Rad i har -u_i ved det frie startpunktet og +u_i ved det frie sluttpunktet; faste enders kolonner utelates. Ekstra args ignoreres, siden lengdeparameteren ikke endrer denne deriverte.

:::

::: {#ide-project_week12-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week12-flat-start-e1ee4cb0 .ai-feedback-context}

`flat_start(n_links=10, depth=0.5)`

Returnerer flat startvektor med 2\*(n_links-1) koordinater. Frie x-punkter er jevnt fordelt mellom 0 og span=4.0, alle y=-depth; de faste endepunktene inngår ikke i vektoren.

:::

::: {#ide-project_week12-joints-b2a79435 .ai-feedback-context}

`joints(z)`

z=(x1,y1,...,x_(N-1),y_(N-1)) er de frie koordinatene. Returnerer (N+1,2)-array av alle punkter, med faste ender (0,0) og (span,0), span=4.0. Former z om til par uten å endre koordinatrekkefølgen.

:::

::: {#ide-project_week12-h-e2618920 .ai-feedback-context}

`h(z, lengths=0.5)`

Studentens lengdekrav: flat z med N-1 frie punkter inn, skal gi N restverdier (leddets lengde minus lengths). lengths kan være felles skalar eller én verdi per ledd. Startskissen hever NotImplementedError.

:::

::: {#ide-project_week12-plot-chain-df10e56f .ai-feedback-context}

`plot_chain(*shapes, labels=None)`

Tar én eller flere flate koordinatvektorer z og valgfri liste labels i samme rekkefølge. Legger til faste endepunkter via joints, tegner kjedene sammen med like akser og viser figuren; returnerer None.

:::

::: {#ide-project_week12-solve-exact-4a89bf32 .ai-feedback-context}

`solve_exact(hfun, lengths=0.5, z0=None, loads=None)`

hfun(z,lengths) er studentens kravfunksjon. Minimerer energy med grad_energy og likhetskrav via SLSQP/jac_links; standard z0=flat_start(). lengths går til kravene, loads til energi/gradient. Returnerer OptimizeResult; ftol=1e-14,maxiter=500, ingen garanti om success.

:::

::: {#ide-project_week12-directions-3beb3934 .ai-feedback-context}

`directions(z)`

For N ledd returneres (N,2)-array av enhetsretninger fra punkt i-1 til i, basert på joints(z). Alle ledd må ha positiv lengde; nullengde gir divisjon med null.

:::

::: {#ide-project_week12-multipliers-40736c49 .ai-feedback-context}

`multipliers(z, loads=None)`

Returnerer N multiplikatorer fra np.linalg.lstsq(jac_links(z).T,-grad_energy(z,loads),rcond=None). Fortegnsavtalen er L=E+lambda\^T\*h, så J.T@lambda=-grad E; verdiene er en minste kvadraters løsning av stasjonaritetskravet.

:::

::: {#ide-project_week12-w-fd4dd3b0 .ai-feedback-context}

`w`

Skalaren w=1.0 er standardvekt per fritt leddpunkt i energy og grad_energy. Enkelte hjelpere tar egne loads i stedet for w.

:::

::: {#ide-project_week12-solve-penalty-745aae83 .ai-feedback-context}

`solve_penalty(hfun, penaltyfun, mu, z0=None)`

Tar hfun(z), penaltyfun(z,mu) og mu; standard z0=flat_start(). Bruker BFGS med gradient grad_energy(z)+mu\*jac_links(z).T@hfun(z), gtol=1e-6 og maxiter=1500. Returnerer OptimizeResult; hfun/penaltyfun må beskrive samme krav og standard energi.

:::

::: {#ide-project_week12-f-mu-da08b65a .ai-feedback-context}

`F_mu(z, mu)`

Studentens skalare straffefunksjon F_mu=energy(z)+mu/2\*||h(z)||², med h sitt standard lengths=0.5. Startskissen hever NotImplementedError og må fullføres før solve_penalty kan brukes.

:::

::: {#ide-project_week12-penalty-hessian-a6d8b521 .ai-feedback-context}

`penalty_hessian(z, mu, lengths=0.5)`

Returnerer Hessianen (2\*(N-1),2\*(N-1)) til energy+mu/2\*sum(h_i²), for geometriske lengdekrav med gitt lengths (skalar eller N-vektor). Inkluderer både mu\*J.T@J og restvektet krumning; lineær energy bidrar null. Krever positive leddlengder.

:::

::::
