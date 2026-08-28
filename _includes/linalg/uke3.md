## Femukersplan for numerisk lineær algebra

| Uke | Eksperimentelt startpunkt | Begreper vi bygger opp igjen | Viktigste algoritmer |
|---:|---|---|---|
| 3 | Vi finner forskjellige vektorer $x_1$ og $x_2$ som gir samme resultat $Ax_1=Ax_2$, og undersøker hvilke deler av inputen matrisen ikke kan se. | spenn, basis, kolonnerom, nullrom og rang | eliminasjon og numerisk rangundersøkelse |
| 4 | Et overbestemt system har ingen eksakt løsning, men `numpy.linalg.lstsq` finner likevel en «beste» løsning. Vi undersøker hva som gjør den best. | ortogonalitet, projeksjon og minste kvadrater | Gram–Schmidt og QR-faktorisering |
| 5 | Gjentatt matrisemultiplikasjon og normalisering gjør at en tilfeldig startvektor ofte stabiliserer seg i én retning. | egenverdier, egenvektorer og invariante retninger | potensmetoden og PageRank |
| 6 | `numpy.linalg.solve` virker for et lite system, men tids- og minnebruken vokser raskt. Vi prøver derfor å forbedre en tilnærming med bare matrise-vektor-produkter. | SPD-matriser, kvadratisk energi, residual og feil | Cholesky, Gauss–Seidel, konjugerte gradienter og prekondisjonering |
| 7 | Et bilde eller en datamatrise kan rekonstrueres overraskende godt etter at mange retninger er fjernet. Vi undersøker hvilke retninger som bærer informasjonen. | singulærverdier, kondisjonering og lavrangsapproksimasjon | SVD, pseudoinvers og trunkert SVD |

::: {.panel-tabset}

## Oversikt

### Først et eksperiment

Vi starter med en liten matrise med tre inputkomponenter og to outputkomponenter. Studentene får først lete etter to forskjellige vektorer som gir samme output. Deretter studerer vi differansen $z=x_1-x_2$ og oppdager at $Az=0$. Vi endrer én kolonne slik at den er nesten, men ikke helt, avhengig av de andre, og sammenligner hva NumPy rapporterer i `float64` og `float32`. Målet er at behovet for kolonnerom, nullrom, basis, rang og toleranse skal oppstå fra observasjonene.

### Begreper vi trenger

- lineærkombinasjon, spenn og basis
- lineær uavhengighet
- kolonnerom og nullrom
- rang og dimensjon
- ingen, én eller flere løsninger av $Ax=b$

### Algoritmer og numeriske undersøkelser

- radreduksjon og numerisk rang
- nøyaktig og nesten lineær avhengighet
- toleranser, `float32` og `float64`
- geometrisk visualisering av lineære avbildninger

### Etter denne uken

Studentene skal kunne tolke kolonnerom, nullrom og rang numerisk, og forklare hvorfor et lineært system har ingen, én eller flere løsninger.

## Aktivitetsplan

1. **Samme output, forskjellig input:** Studentene eksperimenterer med en gitt $2\times3$-matrise og leter etter $x_1\neq x_2$ med $Ax_1=Ax_2$.
2. **Finn den usynlige retningen:** Beregn $z=x_1-x_2$, kontroller residualen $\lVert Az\rVert$, og beskriv alle vektorer $x_1+tz$ som gir samme output.
3. **Hvilke output er mulige?** Generer mange tilfeldige $x$, plott $Ax$, og sammenlign punktskyen med matrisens kolonner.
4. **Fra observasjon til språk:** Innfør spenn, lineær uavhengighet, basis, kolonnerom, nullrom, rang og rang-nullitet.
5. **Bryt eksperimentet:** Erstatt en kolonne med en nesten lineærkombinasjon av de andre. Varier perturbasjonen og toleransen i `numpy.linalg.matrix_rank`.
6. **Systemklassifisering:** Undersøk tre høyresider som gir henholdsvis ingen, én eller flere løsninger. Kontroller svarene med residualer.
7. **Kort leveranse:** Én figur, én numerisk tabell og en forklaring av hva matrisen bevarer og mister.

:::
