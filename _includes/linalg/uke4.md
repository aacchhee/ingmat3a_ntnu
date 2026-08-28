::: {.panel-tabset}

## Oversikt

### Først et eksperiment

Vi lager støyfylte måledata som nesten følger en rett linje. Studentene forsøker først å løse alle ligningene eksakt og oppdager at systemet er inkonsistent. `numpy.linalg.lstsq` gir likevel et svar. Ved å beregne residualen $r=b-Ax_*$ og produktet $A^Tr$ oppdager de den ortogonale betingelsen før projeksjon og minste kvadrater blir formulert geometrisk.

### Begreper vi trenger

- indreprodukt, norm og vinkel
- ortogonalitet og ortogonalt komplement
- projeksjon på et underrom
- minste kvadraters metode
- ortogonale og ortonormale basiser

### Algoritmer og numeriske undersøkelser

- klassisk og modifisert Gram–Schmidt
- QR-faktorisering
- minste kvadrater med QR
- sammenligning av normalligningene, QR og `numpy.linalg.lstsq`

### Etter denne uken

Studentene skal kunne formulere et tilpasningsproblem som et minste-kvadraters problem, tolke residualen geometrisk og forklare hvorfor QR vanligvis er bedre enn normalligningene.

## Aktivitetsplan

1. **Et system uten løsning:** Bygg designmatrisen for en linjetilpasning og vis numerisk at ingen parametervektor gir null residual.
2. **Hva betyr «best»?** Sammenlign flere parametervektorer og residualnormer med løsningen fra `numpy.linalg.lstsq`.
3. **Den overraskende testen:** Beregn $A^Tr$ og bruk resultatet til å motivere ortogonal projeksjon på kolonnerommet.
4. **Lag en ortonormal basis:** Implementer klassisk Gram–Schmidt og kontroller $Q^TQ\approx I$.
5. **Bryt algoritmen:** Bruk nesten parallelle kolonner og sammenlign klassisk og modifisert Gram–Schmidt.
6. **Tre løsningsmetoder:** Sammenlign normalligninger, egen QR-implementasjon og `numpy.linalg.lstsq` på en dårlig kondisjonert Vandermonde-matrise.
7. **Kort leveranse:** Et konvergens- eller feildiagram og en begrunnet anbefaling av metode.

:::
