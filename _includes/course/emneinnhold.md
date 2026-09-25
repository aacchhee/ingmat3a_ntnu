## Tall og algoritmer

| Uke | Spørsmålet vi starter med | Matematisk innhold og kobling til anvendelser |
|---|---|---|
| **1** | **Hvorfor kan to matematisk riktige beregningsmåter koste svært forskjellig – og hvorfor gir datamaskinen noen ganger overraskende svar?** Vi sammenligner algoritmer for polynomevaluering og undersøker hvordan tall faktisk representeres i maskinen. | Regneoperasjoner og Horners metode, binære tall, IEEE 754-flyttall, avrunding og numerisk stabilitet. Dette forklarer både beregningskostnad og hvorfor vanlige regneregler ikke alltid oppfører seg som forventet i flyttallsaritmetikk. |
| **2** | **Hvorfor nærmer noen gjentatte beregninger seg en løsning, mens andre går i syklus eller løper bort?** Vi skriver samme ligning som forskjellige fikspunktiterasjoner og sammenligner utviklingen numerisk og grafisk. | Fikspunkt, lokal og global konvergens, konvergensfart, feil, residual, skrittlengde og toleranse. Vi bygger en robust iterasjonsalgoritme med historikk, stoppkriterium og diagnostikk. |

## Numerisk lineær algebra

| Uke | Spørsmålet vi starter med | Matematisk innhold og kobling til anvendelser |
|---|---|---|
| **3** | **Kan forskjellige inputvektorer gi samme output?** Vi undersøker en transformasjon der $Ax_1=Ax_2$, selv om $x_1\neq x_2$. Outputen er da ikke tilstrekkelig til å avgjøre hvilken input som ble brukt. Forskjellen $x_1-x_2$ transformeres til null. | Kolonnerommet beskriver alle outputvektorer transformasjonen kan produsere. Nullrommet består av inputretningene som transformeres til null. Ved bildereduksjon kan ulike bilder derfor gi samme reduserte bilde. |
| **4** | **Hva gjør vi når en ønsket output ikke kan produseres nøyaktig?** For støyfylte data ligger $b$ vanligvis ikke blant outputvektorene $Ax$ som modellen kan produsere. Vi søker derfor den oppnåelige outputen som ligger nærmest $b$. | Ortogonal projeksjon leder til minste kvadraters metode, Gram–Schmidt og QR-faktorisering. Minste kvadrater er en grunnleggende metode for å tilpasse lineære modeller til data. |
| **5** | **Hva skjer når vi gjentar den samme transformasjonen?** Vi beregner $x_{k+1}=Ax_k$ flere ganger og normaliserer underveis. Under bestemte betingelser vil én retning etter hvert dominere. | Egenvektorer er retninger som transformasjonen bevarer, bortsett fra skalering og eventuelt fortegn. Dette leder til potensmetoden og PageRank. Beslektede spektrale metoder brukes til å analysere grafer og finne mønstre i data. |
| **6** | **Hvordan finner vi inputen som gir en bestemt output når systemet er stort?** Vi ønsker å løse $Ax=b$, men en generell tett løsningsmetode kan bruke unødvendig mye tid og minne. | Cholesky, Gauss–Seidel, konjugerte gradienter og prekondisjonering viser hvordan matrisestruktur kan utnyttes. Store lineære systemer oppstår blant annet i optimering og maskinlæring. |
| **7** | **Hvilke inputretninger påvirker outputen mest?** Vi deler transformasjonen opp i ortogonale inputretninger og måler hvor sterkt hver retning forsterkes eller dempes. | SVD samler ideene om kolonnerom, nullrom, rang og følsomhet. Lavrangsapproksimasjoner brukes til dimensjonsreduksjon, kompresjon, støyfiltrering og tilnærming av store vektmatriser. |

## Optimering

Vi bygger videre på minimum, gradient og linjesøk fra uke 6.
Minste kvadraters metode er allerede behandlet i uke 4 og 7; her bruker
vi forbindelsen når den hjelper oss å forstå et nytt problem.

| Uke | Spørsmålet vi starter med | Matematisk innhold og kobling til anvendelser |
|---|---|---|
| **[8](uke8.qmd)** | **Hva mener vi med den beste løsningen, og finnes den?** Vi skiller mellom det beste punktet vi har prøvd, et lokalt minimum og et globalt minimum. | Målfunksjon og tillatt område, kompakthet, konvekse mengder og funksjoner, og betingelser for et minimum. |
| **[9](uke9.qmd)** | **Hvordan leter vi etter et minimum med få funksjonsberegninger?** Vi sammenligner prøving av punkter med bevegelser som bruker lokal informasjon. | Gittersøk, tilfeldig søk, kompassøk og gradientmetoden. Valg av steglengde og stoppkriterium viderefører uke 6 til funksjoner som ikke er kvadratiske. |
| **[10](uke10.qmd)** | **Kan krumningen hjelpe oss fram, og når fører den oss feil?** Vi sammenligner gradient- og Newton-steg fra ulike startpunkter. | Hessian, lokal kvadratisk modell, Newtons metode og sikring av nedgang. Et prosjekt undersøker startpunkt, skalering og kontroll av numeriske svar. |
| **[11](uke11.qmd)** | **Hvordan fordeler vi begrensede ressurser best?** Vi formulerer en produksjonsmodell og undersøker verdien av mer kapasitet. | Lineær programmering, tillatte hjørnepunkter, dualitet og skyggepriser. SciPy brukes sammen med matematiske optimalitetskontroller. |
| **[12](uke12.qmd)** | **Hvordan finner vi et minimum når vi må holde oss på en kurve eller flate?** Vi undersøker hvilke bevegelser bibetingelsene tillater. | Lagranges multiplikatorer, tangentretninger, regularitet og kontroll av kandidater. Numeriske løsninger kontrolleres mot både bibetingelser og optimalitetsbetingelser. |
