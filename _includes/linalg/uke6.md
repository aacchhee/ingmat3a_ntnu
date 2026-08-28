::: {.panel-tabset}

## Oversikt

### Først et eksperiment

Vi bygger et diskret én-dimensjonalt Poisson-problem og løser først små systemer med `numpy.linalg.solve`. Når dimensjonen økes, måler studentene tid og minnebehov og ser at den direkte tilnærmingen ikke skalerer godt. Deretter starter vi med $x_0=0$ og forsøker å redusere residualen ved hjelp av matrise-vektor-produkter. Energiperspektivet introduseres for å forklare hvorfor SPD-strukturen gjør effektive iterasjoner mulige.

### Begreper vi trenger

- symmetrisk positivt definitte matriser
- kvadratisk energi og minimering
- residual og løsningsfeil
- konjugerte retninger
- kondisjonering og skalering

### Algoritmer og numeriske undersøkelser

- Cholesky-faktorisering
- Gauss–Seidel som koordinatvis korreksjon
- bratteste nedstigning
- konjugerte gradienter
- enkel diagonal prekondisjonering

### Etter denne uken

Studentene skal kunne kjenne igjen positivt definitte problemer, knytte løsning av $Ax=b$ til minimering og implementere en grunnleggende variant av konjugerte gradienter.

## Aktivitetsplan

1. **Et voksende problem:** Bygg Poisson-matrisen for flere dimensjoner og mål kjøretiden til `numpy.linalg.solve`.
2. **Se strukturen:** Undersøk symmetri, egenverdier og $x^TAx$ for tilfeldige $x$, og formuler SPD-egenskapene fra observasjonene.
3. **Løsning som minimum:** Plott nivåkurver av $\phi(x)=\tfrac12x^TAx-b^Tx$ i to dimensjoner og koble gradienten til residualen.
4. **To enkle iterasjoner:** Implementer Gauss–Seidel og bratteste nedstigning. Plott residual, faktisk feil og energi.
5. **Konjugerte gradienter:** Bygg algoritmen trinnvis og sammenlign antall matrise-vektor-produkter med bratteste nedstigning.
6. **Kondisjonering betyr noe:** Kjør samme metoder på to like store systemer med ulike kondisjonstall.
7. **Prekondisjonering:** Skaler med diagonalen og undersøk hvordan konvergenshistorikken endres.
8. **Kort leveranse:** Sammenligning av minst tre metoder med en forklaring av når residual og faktisk feil forteller forskjellige historier.

:::
