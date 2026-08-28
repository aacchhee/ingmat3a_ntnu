## Femukersplan for numerisk lineær algebra

| Uke | Eksperimentelt startpunkt | Begreper vi bygger opp igjen | Viktigste algoritmer |
|---:|---|---|---|
| 3 | For en matrise med ikke-trivielt nullrom finner vi $x_1\ne x_2$ med $Ax_1=Ax_2$. Differansen ligger i nullrommet og viser nøyaktig hvilken inputinformasjon avbildningen mister. | lineærkombinasjoner, spenn, basis, kolonnerom, nullrom, rang og rang-nullitet | eliminasjon, løsning av lineære systemer og undersøkelse av numerisk rang |
| 4 | Vi velger støyfylte data slik at $Ax=b$ er inkonsistent. `numpy.linalg.lstsq` finner da en vektor som minimerer $\lVert Ax-b\rVert_2$; vi undersøker den ortogonale geometrien bak minimumet. | indreprodukt, ortogonalitet, projeksjon og minste kvadrater | Gram–Schmidt og QR-faktorisering |
| 5 | Normalisert potensiterasjon stabiliserer seg mot en egenretning når matrisen har én dominant egenverdi og startvektoren har komponent i den tilhørende egenretningen. Vi undersøker også når dette feiler. | egenverdier, egenvektorer, invariante underrom og spektralgap | potensmetoden og PageRank |
| 6 | En tett, generell `numpy.linalg.solve` utnytter ikke nødvendigvis strukturen i et stort system. Vi sammenligner strukturerte direkte metoder med iterasjoner som hovedsakelig bruker matrise-vektor-produkter. | SPD-matriser, kvadratisk energi, residual, feil og kondisjonering | Cholesky, Gauss–Seidel, konjugerte gradienter og prekondisjonering |
| 7 | Noen data har raskt avtagende singulærverdier og kan da approksimeres godt med lav rang. Vi undersøker hvilke inputretninger som forsterkes, dempes eller forsvinner. | singulærverdier, kolonnerom, nullrom, kondisjonering og lavrangsapproksimasjon | SVD, pseudoinvers og trunkert SVD |

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
