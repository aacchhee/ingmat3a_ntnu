## Oppdrag: når er en ekstra maskintime verdt pengene?

En bedrift kan lage tre typer **delbare produktpartier**, A, B og C.
Hver uke begrenses produksjonen av maskintid, monteringstid og materiale.
Du skal gi en begrunnet anbefaling om produksjonsplan og mulig kjøp av
mer maskintid. Tallene er i tabellen; dekningsbidraget er oppgitt i tusen
kroner per parti. Dette er en kontinuerlig planleggingsmodell. Dersom
produksjon må skje i hele partier, må modellen endres.

| | A | B | C | Tilgjengelig |
|:--|--:|--:|--:|--:|
| Maskintid | 2 | 1 | 3 | 20 |
| Monteringstid | 1 | 2 | 1 | 16 |
| Materiale | 1 | 1 | 2 | 15 |
| Dekningsbidrag (tusen kr) | 6 | 5 | 7 | – |

**Lever en kort rapport med regninger, kontrolltabeller og en anbefaling.**
Arbeidet er beregnet for flere timer: først modell og dualt bevis, deretter
en eksakt følsomhetsanalyse og til slutt en ny beslutningssituasjon. Kode
kan brukes til å teste hypoteser, men erstatter ikke begrunnelsen for når
en ressurspris gjelder. [Uke 11](uke11.qmd#uke11-dual) viser hvordan to
mulige løsninger med lik målverdi sertifiserer optimum.

### Kjør forsøkene på denne siden

Prosjektets data lastes automatisk i `pyodide-python`. Kjør kodecellene
i rekkefølge på siden, og endre de markerte variablene her når du vil
teste egne forslag. Regningene og begrunnelsene skriver du i rapporten.
Hvis du foretrekker en egen editor, finnes det også
[én samlet Python-fil](../assets/project_week11.py){download="project_week11.py"}
med de samme dataene og kjørbare forsøkene. Oppgavene løses fremdeles
med dine egne regninger og forklaringer.

## Del 1 – lag en plan og prøv å motbevise den

Kall antall partier $x_A,x_B,x_C$. Formuler selv målfunksjonen og
alle ressursulikhetene på papir før du kjører kode. Skriv også problemet
på formen $\max p^Tx$ slik at $Ux\le b,\ x\ge0$. Forklar hva
hver rad og kolonne i $U$ betyr. En negativt oppført kostnad i
`linprog` er nødvendig fordi løserens mål er et **minimum**.

**Forutsi:** Vil produktet med høyest bidrag per parti alltid inngå i
beste plan? Begrunn hypotesen med ressursbruk, og noter hva som kan
falsifisere den.

```{pyodide-python}
#| label: project11-baseline
# Vi minimerer det negative dekningsbidraget.
base = linprog(-profit, A_ub=use, b_ub=capacity,
               bounds=(0,None), method="highs")
print("status:", base.status, base.message)
if base.status == 0:
    print("plan:", base.x, "dekningsbidrag:", -base.fun)
    print("forbruk:", use @ base.x, "slakk:", capacity-use @ base.x)
```

1. Kontroller alle begrensninger og bidraget med egne utregninger.
   Hvilke ressurser er brukt opp, og hvilke produkter velger modellen?
   Oppgi planen i partier og bidraget i tusen kroner.
2. Finn to andre mulige planer, én med positiv produksjon av C og én
   der en ressurs står ubrukt. Sammenlign bidrag, forbruk og slakk.
   Forklar hvorfor en høyere fortjeneste per parti ikke alene avgjør valget.
3. Skriv dualproblemet: én ikke-negativ pris per ressurs, én ulikhet
   per produkttype. Angi enhet på hver pris. Bruk planens aktive
   begrensninger og komplementær slakk som **kandidater** for likninger;
   kontroller så alle dualulikhetene. Kan en mulig produksjonsplan og
   en mulig prisvektor med samme målverdi gi et bevis her? Vis hele
   kjeden $p^Tx\le q^TUx\le q^Tb$, og kontroller likhet.

Koden nedenfor er et kontrollverktøy for dine egne forslag. Erstatt
nullvektorene med din plan og prisvektor. Den kjører som den står og
viser hvilke krav som ennå ikke er oppfylt; ikke bruk utskriften som en
ferdig løsning.

```{pyodide-python}
#| label: project11-own-certificate
candidate_plan = np.zeros(3)    # TODO: sett inn din plan (A, B, C)
candidate_prices = np.zeros(3)  # TODO: sett inn priser (maskin, montering, materiale)
print("primal brudd:", np.maximum(use@candidate_plan-capacity, 0),
      "negative variabler:", np.minimum(candidate_plan,0))
print("dual mangel:", np.maximum(profit-use.T@candidate_prices, 0),
      "negative priser:", np.minimum(candidate_prices,0))
print("målverdier:", profit@candidate_plan, capacity@candidate_prices)
```

## Del 2 – undersøk hvor langt én pris rekker

La maskinkapasiteten bli $20+\delta$, mens de andre tallene forblir
uforandret. Anta først at samme to begrensninger fortsatt er aktive,
og at det samme produktet fortsatt ikke produseres. Løs de aktive
likningene symbolsk for antall partier som funksjoner av $\delta$.

4. Utled et **eksakt intervall** for $\delta$ der denne planen er
   mulig. Sjekk både ikke-negative produktmengder og den hittil
   ubrukte ressursen. Vis at den opprinnelige dualprisen fortsatt er
   dualt mulig, og bruk like målverdier til å bevise at det lineære
   verdianslaget er eksakt på intervallet. Undersøk endepunktene
   særskilt: hvilke nye likheter oppstår?
5. Regn ut plan og bidrag ved $\delta=6$ og $\delta=12$. Ett av
   punktene ligger utenfor intervallet du fant. Sammenlign løserens
   resultat med å forlenge den opprinnelige tangentlinjen. Hvilket
   utsagn gir dualprisen fortsatt utenfor intervallet? Forklar hvorfor
   en **øvre grense** ikke nødvendigvis er den oppnåelige fortjenesten.
6. Kontroller fortegnet på `base.ineqlin.marginals` mot en liten positiv
   endring av én kapasitet. Hva må du gjøre med fortegnet når du
   tolker en marginal for **maksimert** dekningsbidrag? Oppgi enheten
   og presiser hvor stor endring du har vist at tolkningen gjelder for.

Her er en kjørbar kontroll for de to konkrete endringene. Endre den selv
for å undersøke flere $\delta$-verdier eller lage **én** figur med
faktisk optimalverdi og ditt lineære anslag. Ikke tegn en kurve med
`-trial.fun` hvis `trial.status` ikke er 0.

```{pyodide-python}
#| label: project11-perturbations
for delta in (0., 6., 12.):
    new_capacity = capacity.copy()
    new_capacity[0] += delta
    trial = linprog(-profit, A_ub=use, b_ub=new_capacity,
                    bounds=(0,None), method="highs")
    print("endring:", delta, "status:", trial.status)
    if trial.status == 0:
        print(" plan:", trial.x, "bidrag:", -trial.fun,
              "slakk:", new_capacity-use@trial.x,
              "marginaler for min-målet:", trial.ineqlin.marginals)
```

## Del 3 – gjør anbefalingen robust

Et tilbud om ekstra maskintid har pris $r$ tusen kroner per
ressursenhet. Bedriften kan kjøpe $0\le\delta\le12$, og betaler
$r\delta$ også hvis tiden ikke brukes. Drøft følgende på papir og
bruk en liten beregning som uavhengig kontroll:

7. Finn en regel for hvilke kjøp som kan øke **netto** bidrag for små
   $\delta$. Velg deretter to konkrete priser, én på hver side av
   din terskel. Undersøk beste netto bidrag for $\delta$ i hele
   intervallet $[0,12]$, ikke bare heltallsverdiene 0 og 12.
   Begrunn eventuelle knekkpunkter ved aktive begrensninger.
8. Markedet kan endre bidraget per parti C til 9 tusen kroner, mens
   ressursbruk og kapasiteter er uendret. Test om **det gamle** duale
   sertifikatet fortsatt er gyldig. Løs den nye modellen og forklar
   hva som må revurderes før man bruker den gamle maskinprisen i et
   innkjøpsvalg. Her holder det med en ny primal og dual kontroll;
   du trenger ikke utlede et fullstendig todimensjonalt
   følsomhetsområde.

Avslutt rapporten med en tabell over opprinnelig plan, de to
kapasitetsendringene og den endrede C-prisen. Oppgi mulighet, målverdi,
slakk, dualt bound der du har et, og om prisanslaget er eksakt eller bare
et bound. En anbefaling skal si **hvilken modellantakelse** om delbare
partier den bygger på. Dersom du ønsker hele partier, er det et eget
heltallsproblem; avrunding av en kontinuerlig optimalplan har ingen
garanti for optimalitet.
