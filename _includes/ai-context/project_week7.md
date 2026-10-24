:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week7-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week7-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week7-image-svd-trial-f45a5335 .ai-feedback-context}

`image_svd_trial(noise_level=0.12, seed=23, tau=1.05, image_name='portrett')`

Krever noise_level>0 og tau>=1; image_name velger lokalt portrett/mønster, C(96×96) i [0,1]; pikseldata gjengis ikke her. Legger frøstyrt Gauss-støy E til C og velger minste rang k med Frobenius-dataavvik <= tau\*delta, delta=||E||_F. Tegner/skriver forsøket. Returnerer k,delta,residuals,errors,lost_squared,noise_squared,singular_values,C,E,Y,reconstruction i dict; rangkurvene inkluderer k=0, og data klippes ikke før feilberegning.

:::

::: {#ide-project_week7-signal-svd-trial-2f5b02f2 .ai-feedback-context}

`signal_svd_trial(noise_level=0.005, seed=17, tau=1.05)`

Krever noise_level>0 og tau>=1. Frøstyrt 80-punkts uskarphetsforsøk, H(80,80); trunkert SVD bruker bare singulærverdier over max(H.shape)\*eps\*s[0]. Velger minste k med residual<=tau\*delta. Returnerer k,delta,cap; ved gyldig rang også residuals,errors,residual_formula,lost_squared,noise_squared,singular_values,H,b,truth,eta,reconstruction. k=None betyr at ingen tillatt rang nådde kravet.

:::

::::
