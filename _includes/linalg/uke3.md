## Femukersplan for numerisk lineær algebra

| Uke | Spørsmålet vi starter med | Matematisk innhold og kobling til anvendelser |
|---|---|---|
| **3** | **Kan forskjellige inputvektorer gi samme output?** Vi undersøker en transformasjon der $Ax_1=Ax_2$, selv om $x_1\neq x_2$. Outputen er da ikke tilstrekkelig til å avgjøre hvilken input som ble brukt. Forskjellen $x_1-x_2$ transformeres til null. | Kolonnerommet beskriver alle outputvektorer transformasjonen kan produsere. Nullrommet består av inputretningene som transformeres til null. I et KI-lag kan ulike inputvektorer derfor gi samme output, særlig når laget reduserer dimensjonen. |
| **4** | **Hva gjør vi når en ønsket output ikke kan produseres nøyaktig?** For støyfylte data ligger $b$ vanligvis ikke blant outputvektorene $Ax$ som modellen kan produsere. Vi søker derfor den oppnåelige outputen som ligger nærmest $b$. | Ortogonal projeksjon leder til minste kvadraters metode, Gram–Schmidt og QR-faktorisering. Minste kvadrater er en grunnleggende metode for å tilpasse lineære modeller til data. |
| **5** | **Hva skjer når vi gjentar den samme transformasjonen?** Vi beregner $x_{k+1}=Ax_k$ flere ganger og normaliserer underveis. Under bestemte betingelser vil én retning etter hvert dominere. | Egenvektorer er retninger som transformasjonen bevarer, bortsett fra skalering og eventuelt fortegn. Dette leder til potensmetoden og PageRank. Beslektede spektrale metoder brukes til å analysere grafer og finne mønstre i data. |
| **6** | **Hvordan finner vi inputen som gir en bestemt output når systemet er stort?** Vi ønsker å løse $Ax=b$, men en generell tett løsningsmetode kan bruke unødvendig mye tid og minne. | Cholesky, Gauss–Seidel, konjugerte gradienter og prekondisjonering viser hvordan matrisestruktur kan utnyttes. Store lineære systemer oppstår blant annet i optimering og maskinlæring. |
| **7** | **Hvilke inputretninger påvirker outputen mest?** Vi deler transformasjonen opp i ortogonale inputretninger og måler hvor sterkt hver retning forsterkes eller dempes. | SVD samler ideene om kolonnerom, nullrom, rang og følsomhet. Lavrangsapproksimasjoner brukes til dimensjonsreduksjon, kompresjon, støyfiltrering og tilnærming av store vektmatriser i KI-modeller. |

::: {.panel-tabset}

## Oversikt

### Først et eksperiment

Vi starter med en $2\times3$-matrise $A$ med rang 2. Siden avbildningen går fra $\mathbb R^3$ til $\mathbb R^2$, sier rang-nullitet at nullrommet har dimensjon 1. Studentene leter først etter $x_1\ne x_2$ med samme output. Av $Ax_1=Ax_2$ følger

$$
A(x_1-x_2)=0,
$$

så forskjellen mellom de to inputvektorene ligger i nullrommet. Omvendt gir enhver $z\in N(A)$ samme output fra $x$ og $x+z$. Dermed blir nullrommet en presis beskrivelse av informasjonen som $A$ mister, mens kolonnerommet beskriver alle outputvektorer som faktisk kan produseres.

Etter dette erstatter vi en kolonne med en kolonne som er nesten, men ikke eksakt, avhengig av de andre. Matrisen har fortsatt eksakt rang 2, men numerisk rang avhenger av målestokk, presisjon og valgt toleranse. Sammenligningen mellom `float64` og `float32` skal derfor ikke brukes til å «finne den sanne rangen», men til å skille eksakt rang fra en toleranseavhengig numerisk rang.

### Begreper vi trenger

- lineærkombinasjon, spenn og basis
- lineær uavhengighet
- kolonnerom og nullrom
- rang og dimensjon
- konsistens og løsningsmengden til $Ax=b$

### Algoritmer og numeriske undersøkelser

- radreduksjon og numerisk rang
- nøyaktig og nesten lineær avhengighet
- toleranser, `float32` og `float64`
- geometrisk visualisering av lineære avbildninger

### Etter denne uken

Studentene skal kunne bruke kolonnerommet til å avgjøre om $Ax=b$ er konsistent, og nullrommet til å beskrive entydighet. Dersom systemet er konsistent, er løsningen entydig akkurat når $N(A)=\{0\}$; ellers finnes det uendelig mange løsninger $x_p+z$, der $z\in N(A)$.

## Aktivitetsplan

1. **Samme output, forskjellig input:** Studentene eksperimenterer med en gitt $2\times3$-matrise og leter etter $x_1\neq x_2$ med $Ax_1=Ax_2$.
2. **Finn den usynlige retningen:** Beregn $z=x_1-x_2$ og kontroller $\lVert Az\rVert$. Når det er kontrollert at $z$ spenner det endimensjonale nullrommet, beskrives alle vektorer med samme output som $x_1+tz$, $t\in\mathbb R$.
3. **Hvilke output er mulige?** Generer mange tilfeldige $x$, plott $Ax$, og sammenlign punktskyen med matrisens kolonner.
4. **Fra observasjon til språk:** Innfør spenn, lineær uavhengighet, basis, kolonnerom, nullrom, rang og rang-nullitet.
5. **Bryt eksperimentet:** Erstatt en kolonne med en nesten lineærkombinasjon av de andre. Varier perturbasjonen og toleransen i `numpy.linalg.matrix_rank`.
6. **Systemklassifisering:** For den faste $2\times3$-matrisen undersøkes høyresider som gir ingen eller uendelig mange løsninger; en unik løsning er umulig fordi nullrommet ikke er trivielt. Bytt deretter til en matrise med trivielt nullrom for å lage et konsistent system med unik løsning.
7. **Kort leveranse:** Én figur, én numerisk tabell og en forklaring av hva matrisen bevarer og mister.

:::
