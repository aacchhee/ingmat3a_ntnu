:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke3-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke3-average-pool-d3bed1b8 .ai-feedback-context}

`average_pool(X)`

Tar et 4x4-bilde som NumPy-array og returnerer et 2x2-bilde: gjennomsnittet i hver ikke-overlappende 2x2-blokk, i samme rad-/kolonnerekkefølge. Beregningen er `X.reshape(2,2,2,2).mean(axis=(1,3))`.

:::

::: {#ide-uke3-np-6f11581d .ai-feedback-context}

`np`

Tilgjengelig fra oppsettet: `import numpy as np`.

:::

::: {#ide-uke3-show-image-table-9d931363 .ai-feedback-context}

`show_image_table(rows, row_labels, column_labels, cmap='gray', vmin=None, vmax=None, cell_labels=None, cell_styles=None, operators=None, figsize=(5.4, 5.0))`

Vis en bildetabell med samme fysiske størrelse per piksel.

:::

::: {#ide-uke3-x1-4351f978 .ai-feedback-context}

`X1`

Opprinnelig delt definisjon: `X1 = np.full((4, 4), 0.5)`.

:::

::: {#ide-uke3-x2-b6535cc4 .ai-feedback-context}

`X2`

Opprinnelig delt definisjon: `X2 = np.array([[0.1, 0.9, 0.1, 0.9], [0.9, 0.1, 0.9, 0.1], [0.1, 0.9, 0.1, 0.9], [0.9, 0.1, 0.9, 0.1]])`.

:::

::: {#ide-uke3-y1-38e12495 .ai-feedback-context}

`Y1`

I det opprinnelige forsøket er `Y1=average_pool(X1)` og Y1 har form (2,2) med alle verdier 0.5. X1 er et 4x4-bilde med alle verdier 0.5.

:::

::: {#ide-uke3-y2-38e12495 .ai-feedback-context}

`Y2`

I det opprinnelige forsøket er `Y2=average_pool(X2)` og Y2 har form (2,2) med alle verdier 0.5. X2 er et 4x4-sjakkmønster med vekslende 0.1 og 0.9.

:::

::: {#ide-uke3-show-images-4baf6979 .ai-feedback-context}

`show_images(images, titles=None, cols=4, cmap='gray', vmin=None, vmax=None, figsize=None)`

Vis flere 2D-arrays med samme fargeskala.

:::

::: {#ide-uke3-show-flattened-e934fa8d .ai-feedback-context}

`show_flattened(X)`

Vis et 4 x 4-bilde og de samme 16 tallene lagt radvis i én vektor.

:::

::: {#ide-uke3-a-pool-b55b8935 .ai-feedback-context}

`A_pool`

Målematrisen har form (4,16). Input er X.reshape(-1), radvis fra et 4x4-bilde. Rad k har vekten 1/4 i de fire pikselkolonnene til én ikke-overlappende 2x2-blokk og null ellers; blokkene leses øverst venstre, øverst høyre, nederst venstre, nederst høyre. A_pool @ X.reshape(-1) er average_pool(X).reshape(-1).

:::

::: {#ide-uke3-show-two-routes-ad3dc9fb .ai-feedback-context}

`show_two_routes(alpha, beta, route_1, route_2)`

Vis de to regnerekkefølgene i linearitetsforsøket som en bildetabell. route_1 = [alpha\*X1, beta\*X3, S, R1] og route_2 = [alpha\*T(X1), beta\*T(X3), R2, R1-R2].

:::

::: {#ide-uke3-e1-cc234cbc .ai-feedback-context}

`E1`

Opprinnelig delt definisjon: `E1 = np.array([[1.0, 0.0], [0.0, 0.0]])`.

:::

::: {#ide-uke3-e2-a92f3144 .ai-feedback-context}

`E2`

Opprinnelig delt definisjon: `E2 = np.array([[0.0, 1.0], [0.0, 0.0]])`.

:::

::: {#ide-uke3-e3-84efe1df .ai-feedback-context}

`E3`

Opprinnelig delt definisjon: `E3 = np.array([[0.0, 0.0], [1.0, 0.0]])`.

:::

::: {#ide-uke3-e4-f5e56079 .ai-feedback-context}

`E4`

Opprinnelig delt definisjon: `E4 = np.array([[0.0, 0.0], [0.0, 1.0]])`.

:::

::: {#ide-uke3-x-2e7a1080 .ai-feedback-context}

`X`

I forsøket med pikselbasis er `coefficients=[0.2,0.7,0.4,0.9]`, pixel_basis=[E1,E2,E3,E4], components=[c\*E for c,E in zip(coefficients,pixel_basis)] og `X=sum(components)=[[0.2,0.7],[0.4,0.9]]`.

:::

::: {#ide-uke3-coefficients-4a3845b0 .ai-feedback-context}

`coefficients`

Opprinnelig delt definisjon: `coefficients = np.array([0.2, 0.7, 0.4, 0.9])`.

:::

::: {#ide-uke3-pattern-basis-86f90409 .ai-feedback-context}

`pattern_basis`

Listen er [M,H,V,D] med 2x2-mønstrene `M=[[1,1],[1,1]]`, `H=[[1,-1],[1,-1]]`, `V=[[1,1],[-1,-1]]` og `D=[[1,-1],[-1,1]]`, alle med flyttallsverdier.

:::

::: {#ide-uke3-pattern-names-a2778e74 .ai-feedback-context}

`pattern_names`

Opprinnelig delt definisjon: `pattern_names = ['Lysnivå', 'Venstre–høyre', 'Topp–bunn', 'Sjakkmønster']`.

:::

::: {#ide-uke3-d-455a2655 .ai-feedback-context}

`D`

Opprinnelig delt definisjon: `D = np.array([[1.0, -1.0], [-1.0, 1.0]])`.

:::

::: {#ide-uke3-h-91e113d2 .ai-feedback-context}

`H`

Opprinnelig delt definisjon: `H = np.array([[1.0, -1.0], [1.0, -1.0]])`.

:::

::: {#ide-uke3-v-d28bf387 .ai-feedback-context}

`V`

Opprinnelig delt definisjon: `V = np.array([[1.0, 1.0], [-1.0, -1.0]])`.

:::

::: {#ide-uke3-null-basis-cb305c7a .ai-feedback-context}

`null_basis`

Listen bygges ferdig i forsøket: tolv 4x4-bilder, tre for hver av de fire 2x2-blokkene. I hver blokk plasseres ett av nullgjennomsnittsmønstrene H=[[1,-1],[1,-1]], V=[[1,1],[-1,-1]] og D=[[1,-1],[-1,1]]; alle andre piksler er null. Hver listeverdi avbildes til null av average_pool.

:::

::: {#ide-uke3-rng-ab3c6f35 .ai-feedback-context}

`rng`

Opprinnelig delt definisjon: `rng = np.random.default_rng(10)`.

:::

::: {#ide-uke3-nearly-redundant-measurements-ccbbea1d .ai-feedback-context}

`nearly_redundant_measurements(eps, dtype=float)`

Returnerer en matrise med form (2,16) og valgt dtype. Første rad er bare enere; andre rad er enere med eps lagt til siste element før konverteringen til dtype. Avrunding i valgt dtype kan fjerne forskjellen.

:::

::: {#ide-uke3-a-1c236284 .ai-feedback-context}

`A`

Opprinnelig delt definisjon: `A = np.array([[1.0, 2.0, 0.0, 1.0], [0.0, 1.0, 1.0, 1.0], [1.0, 3.0, 1.0, 2.0]])`.

:::

::: {#ide-uke3-pivot-columns-058422ff .ai-feedback-context}

`pivot_columns`

Nullbaserte Python-indekser returnert av row_echelon(A), der pivoten velges fra venstre mot høyre med toleranse 1e-12. Disse velger kolonner fra originalmatrisen A, ikke fra trappeformen R.

:::

::: {#ide-uke3-z-a-ce37b082 .ai-feedback-context}

`Z_A`

Nullromsmatrisen har kolonnene `z1=[2,-1,1,0]` og `z2=[1,-1,0,1]`, altså form (4,2). I kode settes den som np.column_stack([z1,z2]).

:::

::: {#ide-uke3-z1-a493e4a5 .ai-feedback-context}

`z1`

Opprinnelig delt definisjon: `z1 = np.array([2.0, -1.0, 1.0, 0.0])`.

:::

::: {#ide-uke3-row-echelon-0bf91957 .ai-feedback-context}

`row_echelon(A, tol=1e-12, show_steps=False)`

Tar en kopi av den reelle m x n-matrisen A. Går fra venstre mot høyre, velger første gjenværende rad med absolutt pivot større enn tol (ikke største pivot), bytter rader og eliminerer under pivoten. Verdier med absoluttverdi <=tol settes til null. Returnerer (R,pivot_columns), der pivot_columns bruker nullbaserte Python-indekser; show_steps viser radoperasjoner når parameteren finnes i denne versjonen.

:::

::::
