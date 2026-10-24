:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke11-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke11-np-6f11581d .ai-feedback-context}

`np`

NumPy er importert som np: import numpy as np.

:::

::: {#ide-uke11-show-region-5e50084a .ai-feedback-context}

`show_region(corners, objective=(5, 4), levels=(), best=None, path=None, machine=9.0, limits=True, title='Tillatt område og mållinjer', ax=None)`

Tar corners med form (m,2), med hjørnene ordnet rundt mangekanten; objective er en 2-vektor. Tegner gitt område, valgte mållinjenivåer, eventuelt best og path (to kolonner). machine endrer maskinlinjen, limits=False skjuler grenselinjene; geometrien beregnes ikke på nytt. Andre objective-komponent må være ulik null når levels brukes. Bruker gitt ax eller lager og viser egen figur. Returnerer None.

:::

::: {#ide-uke11-show-pairs-e42f231f .ai-feedback-context}

`show_pairs(vertices, outside)`

Tar vertices og outside som ikke-tomme punktarrayer med form (m,2) og (k,2). Viser oppgitte hjørner som o og oppgitte ytre skjæringer som x sammen med grensene 2x+y=9, x+2y=9, x=4, x=0 og y=0 og det opprinnelige området. Hjelperen beregner ingen skjæringer. Returnerer None.

:::

::: {#ide-uke11-corners-14b8a886 .ai-feedback-context}

`corners`

Startdefinisjon: corners = np.array([[0,0],[4,0],[4,1],[3,3],[0,4.5]]), med form (5,2); hjørnene står i rekkefølge rundt kanten av det opprinnelige tillatte området.

:::

::: {#ide-uke11-linprog-5e96555f .ai-feedback-context}

`linprog`

Importert med from scipy.optimize import linprog. Cellene bruker method="highs" for minimering med A_ub\*x <= b_ub og bounds=(0,None); et maksimeringsmål p sendes derfor inn som -p.

:::

::: {#ide-uke11-show-price-arrows-522fbcd2 .ai-feedback-context}

`show_price_arrows(at, normals, prices, gradient)`

at og gradient er 2-vektorer; normals har to normalvektorer og prices to priser. Tegner prisvektoren prices[0]\*normals[0] og deretter prices[1]\*normals[1], samt gradienten fra at, alle skalert med 0.35 over det opprinnelige området. Beregner ingen priser. Returnerer None.

:::

::: {#ide-uke11-compare-regions-5f3825f4 .ai-feedback-context}

`compare_regions(*panels)`

Tar ett eller flere panelargumenter, hvert et dict med nøkkelord til show_region. Lager én akse per panel under hverandre og kaller show_region(ax=..., \*\*panel) før samlet visning; panelene må derfor ikke selv angi ax. Returnerer None.

:::

::: {#ide-uke11-show-value-curve-84803970 .ai-feedback-context}

`show_value_curve(deltas, values, bound, kink=None, xlabel='Ekstra maskintimer Δ')`

Tar deltas, values og bound som like lange endimensjonale følger. Viser allerede beregnet optimalverdi og prisgrense mot kapasitetsendring; markerer kink når oppgitt og bruker xlabel som x-etikett. Utfører ingen optimering. Returnerer None.

:::

::::
