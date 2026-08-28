## Først et eksperiment

Vi tilpasser en modell til støyfylte data. Systemet $Ax=b$ har ingen eksakt løsning, men NumPy finner likevel et best mulig svar. Hvorfor er residualen ortogonal på kolonnerommet?

## Begreper vi trenger

- indreprodukt, norm og vinkel
- ortogonalitet og ortogonalt komplement
- projeksjon på et underrom
- minste kvadraters metode
- ortogonale og ortonormale basiser

## Algoritmer og numeriske undersøkelser

- klassisk og modifisert Gram–Schmidt
- QR-faktorisering
- minste kvadrater med QR
- sammenligning av normalligningene, QR og `numpy.linalg.lstsq`

## Etter denne uken

Studentene skal kunne formulere et tilpasningsproblem som et minste-kvadraters problem, tolke residualen geometrisk og forklare hvorfor QR vanligvis er bedre enn normalligningene.
