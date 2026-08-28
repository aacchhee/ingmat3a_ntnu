::: {.panel-tabset}

## Oversikt

### Først et eksperiment

Vi begynner med en tilfeldig vektor, multipliserer gjentatte ganger med den samme matrisen og normaliserer etter hvert steg. Studentene plotter både komponentene, vinkelen mellom to påfølgende iterater og Rayleigh-kvotienten. Deretter endrer vi matrisen slik at de to største egenverdiene ligger nær hverandre, eller har samme absoluttverdi, og ser hvordan mønsteret endres. Egenvektorer introduseres som forklaringen på observerte stabile retninger.

### Begreper vi trenger

- egenverdier og egenvektorer
- invariante retninger og underrom
- dominant egenverdi
- spektralgap og konvergensfart
- symmetriske matriser og ortogonale egenvektorer

### Algoritmer og numeriske undersøkelser

- potensmetoden
- Rayleigh-kvotient og egenverdiresidual
- konvergensplott og stoppkriterier
- PageRank som egenvektorproblem

### Etter denne uken

Studentene skal kunne tolke egenvektorer dynamisk, implementere potensmetoden og bruke residual og konvergenshistorikk til å vurdere resultatet.

## Aktivitetsplan

1. **En retning vokser fram:** Kjør normalisert gjentatt matrisemultiplikasjon fra flere tilfeldige startvektorer.
2. **Mål stabiliseringen:** Plott vinkelendring, Rayleigh-kvotient og residualen $\lVert Ax_k-\lambda_kx_k\rVert$.
3. **Forklar mønsteret:** Introduser egenverdier, egenvektorer, invariante retninger og dominant egenverdi.
4. **Hva bestemmer farten?** Sammenlign matriser med stort og lite spektralgap og knytt observasjonen til konvergensplottet.
5. **Når virker det ikke?** Undersøk uheldig startvektor, negativ dominant egenverdi og to dominante egenverdier med samme absoluttverdi.
6. **PageRank-laboratorium:** Bygg en overgangsmatrise fra en liten graf, oppdag problemer med hengende noder og reparer modellen med damping.
7. **Kort leveranse:** En implementasjon av potensmetoden med stoppkriterium og en diagnose av ett problemtilfelle.

:::
