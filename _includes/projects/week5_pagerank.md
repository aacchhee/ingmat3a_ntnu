<div class="learning-mode" data-learning-mode data-lecture-label="Oppgaver" data-reading-label="Arbeid videre" role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Oppgaver</button>
<button type="button" data-mode="reading" aria-pressed="false">Arbeid videre</button>
<span role="status" aria-live="polite"></span>
</div>

## Ukens spørsmål

**Kan en korrekt beregning gi en rangering vi ikke stoler på?**

I forelesningen så vi hvordan besøk flyttes mellom nettsider, og hvordan en
stasjonær fordeling blir en egenvektor. Nå skal du bygge en rangering,
kontrollere regningen og undersøke hva et modellvalg gjør med resultatet.

Følg samme arbeidsform i hver del: **forutsi → prøv → beskriv → forklar**.
Skriv forventningen før du kjører forsøket. Del 1–4 gir verktøy og kontroller.
Deretter gjør du **én egen undersøkelse** fra del 5–6. Begge deler inngår i
prosjektet: kontrollerte beregninger alene er ikke en ferdig undersøkelse.
Du kan kjøre hele prosjektet uten å kjøre cellene i forelesningsnotatene først.

## 1. Hvem tror du blir viktigst?

Vi bruker seks sider med følgende lenker. Selvlenker er tillatt i denne
modellen; hver oppført lenke fra samme side får lik vekt.

| Fra | Til |
|---|---|
| A | B, C |
| B | C, D |
| C | A |
| D | C, E |
| E | F |
| F | D |

En pil fra A til B er en lenke besøkende kan følge. Den går ut fra A og
inn til B. Ved hvert klikk velges én utgående lenke med lik sannsynlighet.
Vi følger fordelingen av besøk: én andel per side, alle ikke-negative og med
sum én. En slik kolonne av andeler er en **sannsynlighetsvektor**.

Ranger sidene før du kjører modellen, og begrunn førsteplassen.
Hva er forskjellen på å telle innkommende lenker og å telle besøk?
I matrisen $S$ er kolonne $j$ avsender og rad $i$ mottaker. $S_{ij}$ er
sannsynligheten for et klikk fra $j$ til $i$. Kolonnene må ha sum én;
sammen med ikke-negative elementer gjør dette $S$ **kolonnestokastisk**.

<details class="reading-step">
<summary>Arbeid videre: tegn og kontroller én runde for hånd</summary>

Tegn grafen på papir, og flytt en jevn besøksfordeling én runde langs pilene.
Ta vare på resultatet som uavhengig kontroll av koden.

</details>

```{pyodide-python}
#| label: project-week5-setup
#| autorun: true
#| context: setup
import numpy as np
import matplotlib.pyplot as plt
```

```{pyodide-python}
#| label: project-week5-data
names = list("ABCDEF")
links = [[1, 2], [2, 3], [0], [2, 4], [5], [3]]
u = np.ones(len(names)) / len(names)

# links[j] inneholder mottakerne fra side j; A=0, B=1, osv.
# Lag S selv: én kolonne per avsender, én rad per mottaker.
# For en tom mottakerliste skal kolonnen være u.
def transition_matrix(links, u):
    n = len(links)
    S = np.zeros((n, n))
    # TODO: Fyll én kolonne om gangen. Fordel likt mellom mottakerne.
    # TODO: Bruk u hvis mottakerlisten er tom.
    return S

# Fjern kommentartegnene når funksjonen er ferdig.
# S = transition_matrix(links, u)
# print(S)
# print("kolonnesummer:", S.sum(axis=0))
# print("én runde:", S @ u)
```

**Kontroller før du går videre:** Alle elementer skal være ikke-negative,
kolonnesummene skal være én. Sammenlign $Su$ med lenkene og den uavhengige
kontrollen under «Arbeid videre».
Ikke normaliser et feilaktig resultat for å skjule at besøk blir borte.

<details class="learning-hint">
<summary>Slik kan du tenke: kontroller én avsender om gangen</summary>

Fra A går halvparten til B og halvparten til C, altså
$S_{1,0}=S_{2,0}=1/2$ med Python-indekser. Alle andre elementer i kolonne
null er null. Start med denne kolonnen og kolonnen for C, som bare har én lenke.

Første runde fra jevn start skal bli
$(1/6,1/12,1/4,1/4,1/12,1/6)^T$.

</details>

## 2. Beregn og kontroller rangeringen

Vi gir besøkende to valg: følg en lenke med sannsynlighet $\alpha$, eller
hopp til en side trukket etter sannsynlighetsvektoren $u$. Disse tilfeldige
hoppene kalles **teleportering**; $\alpha$ kalles **dempingsfaktoren**.
Bruk først $\alpha=0.85$ og jevn $u$. **Forutsi:** Vil alle sider få
positiv vekt? Tror du en annen startfordeling endrer sluttresultatet?

Implementer oppdateringen

$$p_{k+1}=\alpha Sp_k+(1-\alpha)u.$$

Du kan bruke potensmetoden fra forelesningen som mønster, men her bevarer
vi summen én og trenger ikke normalisere til euklidsk lengde én.

```{pyodide-python}
#| label: project-week5-iteration
# S skal være kolonnestokastisk. u og p0 skal være sannsynlighetsvektorer.
def pagerank(S, alpha, u, p0, tol=1e-10, max_steps=10000):
    # TODO: Kontroller 0 < alpha < 1, positive u-elementer, riktig form,
    #       ikke-negative S- og p0-elementer og summer lik én.
    # TODO: Kopier p0. Beregn stasjonær residual før hver oppdatering.
    # TODO: Stopp når residual <= tol, eller når max_steps er brukt.
    # Returner p, residualhistorikk og en boolsk verdi converged.
    # Siste verdi i historikken skal gjelde vektoren du returnerer.
    raise NotImplementedError("Implementer besøksregelen og stoppkriteriet")
```

En fordeling er **stasjonær** når neste oppdatering gir samme andeler.
Besøkende beveger seg fortsatt; det er fordelingen som er uendret.
Vi rangerer sidene etter denne fordelingen. **Stasjonær residual** måler
hvor mye én ny oppdatering ville endre vektoren:

$$r_k=\lVert \alpha Sp_k+(1-\alpha)u-p_k\rVert_1,
\qquad \lVert z\rVert_1=\sum_i|z_i|.$$

Bruk en øvre grense for antall steg og meld fra hvis toleransen ikke nås.
Den samme funksjonen skal kunne brukes på nettverk med ulike størrelser.
Antall steg er antall utførte oppdateringer. Når historikken inneholder
residualen ved start og ved hver returnert iterasjon, er dette
`len(residuals)-1`. Kontroller også residualen etter siste tillatte oppdatering;
ikke merk en løsning som mislykket bare fordi den nådde kravet på siste steg.

For denne lille grafen kan du kontrollere svaret uavhengig av iterasjonen.
Fra den stasjonære likningen får vi

$$(I-\alpha S)p_*=(1-\alpha)u.$$

```{pyodide-python}
#| label: project-week5-reference
# Kjør når transition_matrix og pagerank er implementert.
# alpha = 0.85
# S = transition_matrix(links, u)
# p, residuals, converged = pagerank(S, alpha, u, u)
# p_ref = np.linalg.solve(np.eye(len(u)) - alpha*S, (1-alpha)*u)
# print("konvergert:", converged)
# print("sum og minste element:", p.sum(), p.min())
# print("siste residual:", residuals[-1])
# print("feil mot referansen:", np.linalg.norm(p-p_ref, 1))
# for j in np.argsort(-p):
#     print(names[j], p[j])
```

Presenter rangering og kontrolltall. Gjenta med alle besøk på A ved start.
Forklar hvorfor referanseberegningen må bruke samme $S$, $u$ og $\alpha$.
Enighet mellom to metoder på ulike modeller ville ikke være en kontroll.

<details class="learning-hint">
<summary>Slik kan du tenke: hvorfor kan referansesystemet løses?</summary>

Egenverdiene til en stokastisk matrise har absoluttverdi høyst én.
Når $0<\alpha<1$, kan ikke $\alpha S$ ha egenverdi én.
Dermed er $I-\alpha S$ invertibel.

Du kan kontrollere kolonnesummer med `np.allclose(S.sum(axis=0), 1)`.
Hvis en inngang er ugyldig, bruk `raise ValueError(...)` med en forklaring.
Ikke endre inngangsvektoren til brukeren: lag en kopi av `p0`.

</details>

## 3. Diagnostiser et problem før du reparerer det

Velg ett av tilfellene nedenfor. **Skriv forventningen først.** Bruk til å
begynne med ren iterasjon $p_{k+1}=Sp_k$ i et fast antall runder, for eksempel
100. Funksjonen fra del 2 er laget for $0<\alpha<1$ og skal ikke brukes med
$\alpha=1$.

| Tilfelle | Nettverk uten teleportering | Undersøk |
|---|---|---|
| Felle | Seks-siders grafen fra del 1, men F lenker bare til F | Hvor havner besøkene? Er dette en feil i regningen? |
| To adskilte grupper | A→B, B→A, C→D, D→C | Avhenger fordelingen mellom gruppene av starten? |
| Pendling | A→B, B→A | Sammenlign start $(1,0)^T$ og $(1/2,1/2)^T$. |

Bruk nye variabelnavn for problemgrafen, slik at grunnmodellen fra del 1 er
bevart. Lag minst to startfordelinger. Vis komponentene gjennom iterasjonen.

**Forklar observasjonen:** Er problemet manglende konvergens, flere mulige
stasjonære fordelinger eller en rangering som er lite nyttig? Flere av
fenomenene kan forekomme samtidig.

Reparer så modellen med jevn teleportering og $\alpha=0.85$. Bruk samme
startfordelinger og sammenlign før og etter. Hva endret seg, og hvorfor?

**En separat kontroll av hengende noder:** Lag også varianten av seks-siders
grafen der F har en tom mottakerliste. Kontroller at din konstruksjon gir
F-kolonnen lik $u$. Forklar forskjellen mellom denne siden og en selvlenke.

## 4. La egenverdiene forklare et forsøk

Egenverdiene til en matrise utgjør dens **spektrum**. Den største
absoluttverdien kalles **spektralradiusen**. Her vil egenverdien én beskrive
den stasjonære fordelingen; de andre beskriver hvordan avvik fra den endres.

Bruk problemgrafen du valgte, med teleportering. Bygg den lille matrisen

$$G=\alpha S+(1-\alpha)u\mathbf1^T.$$

Her er $\mathbf1$ en kolonne med ettall. Siden $\mathbf1^Tp=1$, gir
$Gp$ akkurat besøksregelen i del 2. For $0<\alpha<1$, positiv $u$ og
kolonnestokastisk $S$ er $G$ positiv og kolonnestokastisk. Da finnes én
stasjonær sannsynlighetsvektor, og iterasjonen konvergerer fra enhver
startfordeling. Dette er garantien vi bruker; den sier ikke at modellen
gir en god måling av kvalitet.

**Forutsi:** Hvilken egenverdi må du finne? Hva forventer du om absoluttverdien
av de andre når $0<\alpha<1$?

```{pyodide-python}
#| label: project-week5-spectrum
# Sett S_case, u_case og p0_case til grafen og starten fra del 3.
# alpha = 0.85
# n = len(u_case)
# G = alpha*S_case + (1-alpha)*np.outer(u_case, np.ones(n))
# eigenvalues = np.linalg.eigvals(G)
# stationary_index = np.argmin(abs(eigenvalues-1))
# others = np.delete(eigenvalues, stationary_index)
# beta = np.max(abs(others))
# print("egenverdier:", eigenvalues)
# print("største absoluttverdi blant de andre:", beta)
```

Finn $p_*$ med referansesystemet fra del 2. Kjør et fast antall oppdateringer,
lagre $\lVert p_k-p_*\rVert_1$ og plott feilen med logaritmisk vertikal akse.
Sammenlign forholdet mellom to påfølgende feil med $\beta$ i området før
avrunding dominerer. Gjenta med en annen start hvis du ikke ser forventet fart.

<details class="reading-step">
<summary>Arbeid videre: forklar pendlingen for hånd</summary>

For pendlingstilfellet: finn begge egenverdiene til $G$, uttrykt ved
$\alpha$, og forklar fortegnet til den andre.

</details>

For de andre tilfellene: velg en egenverdi ulik én og kontroller en tilhørende
numerisk egenvektor med $\lVert Gv-\lambda v\rVert_2$.

Svar med ord: **Hvorfor trenger vi de andre egenverdiene når PageRank selv
bruker egenverdien én?**

<details class="learning-hint">
<summary>Slik kan du tenke: startfordelingen kan skjule en egenretning</summary>

Forskjellen $p_k-p_*$ har sum null. Et bidrag i en egenretning med egenverdi
$\lambda$ får faktoren $\lambda^k$. Hvis den valgte starten mangler bidraget
som avtar langsomst, kan du observere raskere konvergens enn $\beta$ antyder.
Komplekse egenverdier og flere bidrag kan også gi variasjon i feilforholdet.

For to sider med jevn teleportering er
$G=\begin{bmatrix}(1-\alpha)/2&(1+\alpha)/2\\(1+\alpha)/2&(1-\alpha)/2\end{bmatrix}$.
Prøv den på $(1,1)^T$ og $(1,-1)^T$ før du beregner determinanten.

</details>

## 5. Velg én egen undersøkelse

Velg én av A–C. Bruk planleggingspunktene i del 6 **før du kjører** den valgte
undersøkelsen. Del 5 og 6 er ett arbeid, ikke to separate forsøksoppgaver.

### A. Demping, rangering og regnefart

Hold grafen og startfordelingen fast. Velg verdier av $\alpha$ som kan
belyse påstanden din; $\{0.5,0.85,0.95,0.99\}$ er mulige startverdier. Forutsi først hvordan rangering og antall
steg endres. Mål faktisk feil mot referansesystemet, antall steg og $\beta$.

For en rettferdig sammenligning av arbeid ved samme garanterte nøyaktighet,
bruk residualtoleranse $(1-\alpha)\cdot10^{-8}$. Da gir feilgrensen nedenfor $\lVert p-p_*\rVert_1\le10^{-8}$.
Hold maksimalgrensen fast og rapporter hvis en kjøring ikke når toleransen.
Høyere $\alpha$ gir ikke nødvendigvis en streng økning av antall steg på
alle grafer; forklar det du faktisk observerer.

<details class="reading-step">
<summary>Arbeid videre: hvorfor justere toleransen med dempingen?</summary>

Sett $T(p)=\alpha Sp+(1-\alpha)u$. Kolonnesummene og ikke-negativiteten gir
$\|Sz\|_1\leq\|z\|_1$, så $\|T(p)-T(q)\|_1\leq\alpha\|p-q\|_1$.
Med $T(p_*)=p_*$ og $r=\|T(p)-p\|_1$ gir trekantulikheten

$$\|p-p_*\|_1\leq r+\alpha\|p-p_*\|_1,
\qquad \|p-p_*\|_1\leq\frac{r}{1-\alpha}.$$

Samme residualtoleranse ved ulike $\alpha$ betyr derfor ikke samme
garanterte løsningsnøyaktighet. Sammenlign også med den direkte løsningen.

</details>

### B. Kan lenker manipulere rangeringen?

Velg en målside og legg til to nye sider. Sammenlign to grafer med de samme
åtte sidene: én der de nye sidene bare lenker til hverandre, og én der du
endrer lenkene deres for å fremme målsiden. Hold $\alpha$, $u$ og antall sider
fast mellom disse to grafene. Oppgi alle lenkene før og etter.

Mål målsidens score og plassering, og vis hvem som mister andel.
Prøv minst to verdier av $\alpha$. Sikrer en entydig stasjonær fordeling at
rangeringen er vanskelig å manipulere?

### C. Hvem er rangeringen laget for?

Behold grafen og $\alpha=0.85$. Velg selv en positiv $u$ ut fra et
angitt besøksmønster, og sammenlign med jevn $u$. Et mulig utgangspunkt er
$u=(0.5,0.1,0.1,0.1,0.1,0.1)^T$. Alle elementene er fortsatt positive.
Forutsi hvem som får mer vekt, og mål endringene i score og plassering.
Formuler hva rangeringen nå uttrykker om besøkendes interesser.

## 6. Sett din egen påstand på prøve

Bruk dette som forsøksplan og rapportstruktur for undersøkelsen du velger
i del 5. Formuler **én påstand som kan vise
seg å være feil**, og bestem forsøket før du kjører det. For eksempel kan
du undersøke om en bestemt lenkeendring gir målsiden høyere score også når
startgrafen endres, eller om et valgt hoppmønster oppfyller et angitt mål.

Skriv en kort forsøksplan med:

1. Påstanden og en mekanisme: hvorfor skulle besøksregelen gi denne effekten?
2. Hva du endrer, hva du holder fast, og hva som ville tale mot påstanden.
3. Et målbart kriterium: for eksempel endring i score, topplassering eller
   arbeid ved samme feilgrense. Bestem hvordan nesten like scorer skal behandles.

Gjennomfør det kontrollerte før-og-etter-paret du designer i del 5.
Det samme paret brukes her; du skal ikke gjøre en ekstra undersøkelse.
**Valgfritt:** Prøv deretter samme tiltak på én ny graf eller ett nytt positivt hoppmønster
valgt for å utfordre forklaringen. Endre bare denne bakgrunnsbetingelsen;
behold tiltaket og vurderingskriteriet. Du trenger ikke en stor samling kjøringer.

Vis det kontrollerte paret og eventuell ekstra kontroll, også hvis effekten uteblir eller snur. Forklar hva resultatene
støtter, hva de avkrefter, og hvor snever konklusjonen må være. Å velge den
best utseende kjøringen i ettertid er ikke en kontroll av påstanden.

### Dette skal leveres

Lever én kjørbar notebook eller Quarto-side. Figurer skal ha aksetitler,
kurveforklaringer og korte tolkninger. Vis forventninger før resultater.

Lever kontroller fra del 1–4 og én valgt undersøkelse fra del 5,
dokumentert med forsøksplanen og det kontrollerte paret i del 6. Analysen på **400–600 ord** skal inneholde påstanden skrevet
før forsøket, forsøksvalgene, et mulig motfunn og en avgrenset konklusjon.

Analysen skal bruke konkrete resultater til å skille mellom:

- en liten residual og en riktig implementert modell;
- entydighet av stasjonær fordeling og konvergens fra en valgt start;
- god numerisk nøyaktighet og en meningsfull rangering;
- virkningen av egenverdiene og virkningen av modellvalgene.

Kode fra en assistent eller et bibliotek må kunne forklares og kontrolleres.
En rangert liste alene er ikke en faglig begrunnelse.

Se [uke 5](uke5.qmd#uke5-google) for besøksregelen, egenverdiforklaringen
og feilgrensen. Prosjektet bruker egne grafer inspirert av
[PageRank-notebooken](https://github.com/jiadaizhao/Mathematics-for-Machine-Learning/blob/master/Linear%20Algebra/Week5/PageRank.ipynb)
og [Interactive Linear Algebra](https://textbooks.math.gatech.edu/ila/stochastic-matrices.html).
