::: {.panel-tabset}

## Oversikt

### Først et eksperiment

Vi leser et gråtonebilde som en matrise, beregner SVD og rekonstruerer bildet med én, fem, ti og flere singulære komponenter. Studentene ser både bildet og kurven av singulærverdier og må foreslå hvor en rimelig trunkering ligger. Deretter bruker vi de samme faktorene til å identifisere kolonnerom, nullrom, numerisk rang og følsomme retninger. SVD blir dermed en samlet forklaring på de foregående ukene.

### Begreper vi trenger

- venstre og høyre singulærvektorer
- singulærverdier
- numerisk rang og nullrom
- kondisjonstall
- pseudoinvers og minimumsnormløsning
- lavrangsapproksimasjon

### Algoritmer og numeriske undersøkelser

- `numpy.linalg.svd`
- trunkert SVD og kompresjon
- minste kvadrater og pseudoinvers
- følsomhet nær rangtap
- enkel regularisering ved filtrering av små singulærverdier

### Etter denne uken

Studentene skal kunne bruke SVD til å samle trådene fra rom, ortogonalitet, minste kvadrater, rang og kondisjonering.

## Aktivitetsplan

1. **Komprimer et bilde:** Beregn SVD og vis rekonstruksjoner med forskjellig rang sammen med lagringsbehovet.
2. **Les spekteret:** Plott singulærverdiene både lineært og logaritmisk, og velg en trunkering ut fra dataene.
3. **Tolk faktorene:** Følg en vektor gjennom $V^T$, $\Sigma$ og $U$ og beskriv rotasjon, skalering og ny orientering.
4. **Finn rommene igjen:** Bruk singulærvektorene til å konstruere basiser for kolonnerom og nullrom og kontroller dem numerisk.
5. **Nær rangtap:** Perturber en matrise med en liten singulærverdi og mål hvordan løsningen av $Ax=b$ endres.
6. **Pseudoinvers og filtrering:** Sammenlign `lstsq`, `pinv` og trunkert SVD på et følsomt minste-kvadraters problem.
7. **Syntese:** Knytt SVD eksplisitt til rang, ortogonal projeksjon, minste kvadrater, kondisjonering og regularisering.
8. **Kort leveranse:** En kompresjons- eller denoisingrapport med valgt rang, feilmål og faglig begrunnelse.

:::
