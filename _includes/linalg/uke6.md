## Først et eksperiment

Vi øker størrelsen på et strukturert lineært system. `numpy.linalg.solve` gir et svar, men arbeidet og minnebruken vokser. Kan vi forbedre en tilnærming ved bare å bruke matrise-vektor-produktet?

## Begreper vi trenger

- symmetrisk positivt definitte matriser
- kvadratisk energi og minimering
- residual og løsningsfeil
- konjugerte retninger
- kondisjonering og skalering

## Algoritmer og numeriske undersøkelser

- Cholesky-faktorisering
- Gauss–Seidel som koordinatvis korreksjon
- bratteste nedstigning
- konjugerte gradienter
- enkel diagonal prekondisjonering

## Etter denne uken

Studentene skal kunne kjenne igjen positivt definitte problemer, knytte løsning av $Ax=b$ til minimering og implementere en grunnleggende variant av konjugerte gradienter.
