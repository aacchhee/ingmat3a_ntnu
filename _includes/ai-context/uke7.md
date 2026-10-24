:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-uke7-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-uke7-portrait-28c7bf94 .ai-feedback-context}

`portrait`

Det faste portrettet er en 96x96-array med gråtoneverdier fra 0 til 1, dekodet fra 8-bits bildepiksler i oppsettet. De 9216 konkrete pikselverdiene er ikke gjengitt i denne referansen; numeriske resultater må vurderes fra den aktuelle kjøringen eller oppgitte bildedata.

:::

::: {#ide-uke7-rank-image-c8fb2c8d .ai-feedback-context}

`rank_image(A, k)`

For en reell m x n-array A beregnes U,s,Vt=np.linalg.svd(A,full_matrices=False). Returnerer `(U[:,:k]*s[:k])@Vt[:k,:]`, altså rekonstruksjonen med de k største singulærverdiene, med samme form som A.

:::

::: {#ide-uke7-show-images-a8b96b0c .ai-feedback-context}

`show_images(images)`

Tar en ordbok {navn: todimensjonal array}; tegner ett gråtonebilde per element med felles fargeskala vmin=0, vmax=1 og uten koordinatakser. Endrer ikke bildematrisene.

:::

::: {#ide-uke7-np-6f11581d .ai-feedback-context}

`np`

Tilgjengelig fra oppsettet: `import numpy as np`.

:::

::: {#ide-uke7-show-component-801aaed2 .ai-feedback-context}

`show_component(U, s, Vt, i, row=25, col=50)`

Tar redusert SVD U,s,Vt og nullbasert komponentindeks i. Tegner profilene U[:,i], Vt[i,:] og bildet `s[i]*np.outer(U[:,i],Vt[i,:])` med symmetrisk rød–blå fargeskala. row,col markerer samme piksel i profilene og bildet.

:::

::: {#ide-uke7-show-singular-values-1359b82e .ai-feedback-context}

`show_singular_values(spectra, k=None)`

Tar spectra={navn: array av singulærverdier}; tegner verdiene mot ettbasert nummer på logaritmisk y-akse. Verdier under 1e-16 tegnes som 1e-16. Valgfri k markerer de k beholdte komponentene.

:::

::: {#ide-uke7-challenge-images-29ca5158 .ai-feedback-context}

`challenge_images()`

Returnerer en ordbok med fire 96x96-bilder: en kopi av portrait; binære bokstavformer H,I,L,I laget i nullmatrise; identitetsmatrisen np.eye(96); og tilfeldige uniformverdier fra np.random.default_rng(7).random((96,96)). Bildene har ulik struktur selv om formene er like.

:::

::::
