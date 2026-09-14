## Kan et annet besøksmønster få to sider til å bytte plass?

PageRank gir hver nettside en verdi som mål på viktighet ut fra en besøksmodell.
Vi rangerer sidene fra høyest til lavest verdi. Men besøkende kan ha ulike
interesser. **Hvor mye må vi endre besøksmønsteret før to sider bytter plass?**

I dette prosjektet skal du først bygge og kontrollere modellen. Deretter bruker
du lineær algebra til å undersøke et selvvalgt besøksmønster. Koden brukes til
å regne og kontrollere; de matematiske begrunnelsene er hovedarbeidet.
Prosjektet er lagt opp til omtrent 3–4 timers arbeid med notatene tilgjengelig.

Du trenger [besøksmodellen i 5.5](uke5.qmd#uke5-nett),
[PageRank og tilfeldige hopp i 5.6](uke5.qmd#uke5-google) og
[fikspunktiterasjon fra uke 2](page4.qmd).
Utledningene under bruker også egenverdier og egenvektorer fra 5.2–5.4.
Alle nødvendige data og kodefunksjoner finnes på denne siden.

**Arbeidsform:** Skriv en forventning før hvert forsøk. Regn og begrunn, bruk
koden som kontroll, og forklar eventuelle forskjeller. Alle fire delene inngår
i prosjektet. Det er ikke nødvendig å bygge flere nettverk eller prøve mange parametre.

## 1. Fra lenker til en overgangsmatrise

Vi bruker seks nettsider. Hver rad i tabellen viser hvilke lenker som finnes
på en side:

| Fra side | Lenker til |
|---|---|
| A | B, C |
| B | C, D |
| C | A |
| D | C, E |
| E | F |
| F | D |

En tenkt besøkende velger én av lenkene på siden hen er på, med lik
sannsynlighet, og åpner siden lenken peker til. Dette er ett steg.
Vi følger sannsynligheten for å være på hver side etter et bestemt antall steg,
ikke antall besøk samlet over tid.

**a. Tegn og forutsi.** Tegn de seks sidene og pilene mellom dem.
Hvilken side tror du besøksregelen vil gi høyest verdi? Begrunn forventningen
med lenkene. En side med mange innkommende lenker er én mulig kandidat,
men hvilke sider lenkene kommer fra, kan også ha betydning.

**b. Skriv matrisen.** Bruk rekkefølgen A, B, C, D, E, F.
Elementet $S_{ij}$ er sannsynligheten for å gå fra side $j$ til side $i$.
Kolonne $j$ beskriver altså siden vi går fra, og rad $i$ siden vi går til.

**Svar:** en $6\times6$ overgangsmatrise $S$. Forklar én kolonne og én rad med ord.

**c. Beregn ett steg og vis at summen bevares.** La

$$u_0=\frac16(1,1,1,1,1,1)^T.$$

Beregn $Su_0$ for hånd. Vis deretter at $Sp$ har ikke-negative elementer
og sum én når $p$ har det. Du kan bruke $\mathbf1=(1,1,1,1,1,1)^T$
og uttrykke kolonnesummene som $\mathbf1^TS=\mathbf1^T$.

**Svar:** én sannsynlighetsvektor og en kort generell utledning.
En matrise med ikke-negative elementer og kolonnesum én kalles
**kolonnestokastisk**.

```{pyodide-python}
#| label: project-week5-setup
#| autorun: true
#| context: setup
# Felles verktøy for prosjektet. Ingen celler fra notatene må kjøres først.
import numpy as np
import matplotlib.pyplot as plt
```

```{pyodide-python}
#| label: project-week5-data
# Overfør matrisen fra papir. Hver innerste liste er EN RAD.
# Kolonnene er avsendersider, selv om vi skriver matrisen radvis i Python.
names = list("ABCDEF")
u0 = np.ones(6) / 6
S = np.array([
    [0., 0., 0., 0., 0., 0.],  # TODO: sannsynligheter for å komme til A
    [0., 0., 0., 0., 0., 0.],  # TODO: til B
    [0., 0., 0., 0., 0., 0.],  # TODO: til C
    [0., 0., 0., 0., 0., 0.],  # TODO: til D
    [0., 0., 0., 0., 0., 0.],  # TODO: til E
    [0., 0., 0., 0., 0., 0.],  # TODO: til F
])

# Disse kontrollene avslører feil summer, men ikke alle feilplasserte lenker.
assert S.shape == (6, 6) and np.all(S >= 0)
assert np.allclose(S.sum(axis=0), 1), "Fyll inn S og kontroller hver avsenderkolonne."
print("Fordelingen etter ett steg:", S @ u0)
# Sammenlign med håndberegningen. Ikke normaliser bort en feil i matrisen.
```

## 2. Finn en stasjonær fordeling og kontroller beregningen

Vi legger til tilfeldige hopp, slik som i 5.6. Ved hvert steg følger den
besøkende en lenke med sannsynlighet $\alpha$, og velger ellers neste side
etter en **hoppfordeling** $u$. Denne sannsynlighetsvektoren beskriver hvor
et hopp ender, uavhengig av nåværende side. Vi bruker $\alpha=0.85$
i denne delen og i del 4.

En oppdatering er

$$T(p)=\alpha Sp+(1-\alpha)u,\qquad p_{k+1}=T(p_k).$$

En **stasjonær fordeling** $p_*$ er et fikspunkt: $T(p_*)=p_*$.
Den besøkende fortsetter å bevege seg, men fordelingen endres ikke.
PageRank-verdiene er koordinatene i $p_*$.

**a. Utled et lineært system.** Start med $T(p_*)=p_*$.
Samle leddene som inneholder $p_*$ på venstre side, og skriv systemet
på formen $Mp_*=b$. Oppgi $M$ og $b$ uttrykt ved $S$, $u$ og $\alpha$.

**Hvorfor finnes én løsning?** Du kan bruke at egenverdiene til en
kolonnestokastisk matrise har absoluttverdi høyst én.
Forklar hvorfor matrisen $M$ er invertibel når $0<\alpha<1$.
Fra 5.6 vet vi dessuten at positiv $u$ gir en positiv stasjonær fordeling
som iterasjonen nærmer seg fra enhver startfordeling.

**b. Fullfør to regneuttrykk.** Koden under har ferdig løkke, stoppkontroll
og direkte løsning. Du fyller bare inn besøksregelen og residualnormen:

$$r(p)=T(p)-p,\qquad \lVert r(p)\rVert_1=\sum_i|r(p)_i|.$$

`S` er en NumPy-matrise med form `(n, n)`. `p` og `u` er
NumPy-vektorer med form `(n,)`. `visit_step` skal returnere en vektor med
samme form; `residual_norm` skal returnere ett ikke-negativt tall.
Bruk `np.linalg.norm(vektor, 1)` for 1-normen.

```{pyodide-python}
#| label: project-week5-iteration
def visit_step(S, alpha, u, p):
    # TODO: returner fordelingen etter ett steg med lenker og hopp.
    return None

def residual_norm(S, alpha, u, p):
    # TODO: bruk visit_step og returner ||T(p) - p||_1.
    return None

# Ferdig støttefunksjon: forutsetter gyldige sannsynlighetsvektorer,
# kolonnestokastisk S og 0 < alpha < 1. Den endrer ikke p0.
def pagerank(S, alpha, u, p0, error_goal=1e-8, max_steps=10000):
    p = np.array(p0, dtype=float, copy=True)
    residuals = []
    # Grensen fra 5.6 gjør residualkravet til en garanti for faktisk feil.
    tolerance = (1-alpha) * error_goal
    for k in range(max_steps + 1):
        r = float(residual_norm(S, alpha, u, p))
        residuals.append(r)
        if r <= tolerance:
            return p, np.array(residuals), True
        if k < max_steps:
            p = visit_step(S, alpha, u, p)
    return p, np.array(residuals), False

def direct_rank(S, alpha, u):
    # Sammenlign systemet i denne linjen med din utledning i del a.
    return np.linalg.solve(np.eye(len(u)) - alpha*S, (1-alpha)*u)
```

**c. Sammenlign to metoder.** Bruk jevn hoppfordeling $u=u_0$.
Forutsi om startfordelingen kan endre den stasjonære løsningen.
Kjør fra både jevn startfordeling og sikker start på A.

```{pyodide-python}
#| label: project-week5-reference
alpha = 0.85
p_ref = direct_rank(S, alpha, u0)

# Samme S, alpha og u i begge metodene: bare regnemetoden varierer.
starts = {"jevn": u0, "sikker start på A": np.eye(6)[0]}
print("Start | steg | residualnorm | feil mot direkte løsning | stoppkrav nådd")
for label, p_start in starts.items():
    p, history, converged = pagerank(S, alpha, u0, p_start)
    error = np.linalg.norm(p - p_ref, 1)
    print(label, len(history)-1, history[-1], error, converged)

print("Side | PageRank-verdi")
for j in np.argsort(-p_ref):
    print(names[j], p_ref[j])
```

**Svar:** rangeringen og kontrolltabellen fra de to startfordelingene.
Forklar hva enighet mellom iterasjon og direkte løsning kontrollerer.
Kan begge metodene være enige selv om en lenke er lagt inn feil?

Stoppkravet bygger på feilgrensen fra [5.6](uke5.qmd#uke5-google):

$$\lVert p-p_*\rVert_1\leq\frac{\lVert T(p)-p\rVert_1}{1-\alpha}.$$

Forklar hvorfor koden sammenligner residualnormen med
$(1-\alpha)\cdot10^{-8}$ når målet er feil høyst $10^{-8}$.
Du trenger ikke utlede denne grensen på nytt.

## 3. Forklar konvergens med egenverdier

Vi bruker nå et lite nettverk som kan analyseres helt for hånd:
to sider som bare lenker til hverandre. La $S_2$ være overgangsmatrisen
og $u_2=(1/2,1/2)^T$ den jevne hoppfordelingen.
I denne delen er $\alpha$ en parameter med $0<\alpha<1$.

**a. Finn egenverdiene.** Skriv $S_2$ og Google-matrisen
$G_2=\alpha S_2+(1-\alpha)u_2\mathbf1^T$, der $\mathbf1=(1,1)^T$.
Beregn $G_2v$ og $G_2w$ for $v=(1,1)^T$ og $w=(1,-1)^T$.
Finn begge egenverdiene som uttrykk i $\alpha$, og bestem den
stasjonære sannsynlighetsvektoren.

**b. Utled feiloppdateringen.** For det generelle nettverket setter vi
$e_k=p_k-p_*$. Trekk de to likningene

$$p_{k+1}=\alpha Sp_k+(1-\alpha)u,\qquad
p_*=\alpha Sp_*+(1-\alpha)u$$

fra hverandre. Vis at $e_{k+1}=\alpha Se_k$.
Forklar også hvorfor $\mathbf1^Te_k=0$.
Dette gjelder uten at vi trenger en egenvektorbasis for $S$.

**c. Finn hele følgen for to sider.** Bruk $p_0=(1,0)^T$.
Skriv startfordelingen som en lineærkombinasjon av $v$ og $w$,
og finn et uttrykk for $p_k$ og $p_k-u_2$ for alle heltall $k\geq0$.
Forklar både fortegnsvekslingen og konvergensfarten.
Hva skjer ved $\alpha=1$, når hoppene fjernes?

**Svar:** de to egenverdiene, en stasjonær fordeling, feiloppdateringen
og en eksplisitt vektorformel for $p_k$. Sammenlign med
[fortegnsforsøket i 5.4](uke5.qmd#uke5-potens).

```{pyodide-python}
#| label: project-week5-two-pages
# Kontroller den håndutledede formelen; her er S2 allerede oppgitt.
S2 = np.array([[0., 1.], [1., 0.]])
u2 = np.array([0.5, 0.5])
alpha2 = 0.85
p2 = np.array([1., 0.])
values2 = [p2.copy()]
for k in range(20):
    p2 = visit_step(S2, alpha2, u2, p2)
    values2.append(p2.copy())
values2 = np.array(values2)

# Begge koordinatene skal nærme seg den stasjonære fordelingen.
plt.figure()
plt.plot(np.arange(21), values2[:, 0], 'o-', label="Side 1")
plt.plot(np.arange(21), values2[:, 1], 's-', label="Side 2")
plt.axhline(0.5, color="gray", linestyle="--", label="Stasjonær sannsynlighet")
plt.xlabel("Antall steg k")
plt.ylabel("Sannsynlighet for å være på siden")
plt.legend()
plt.show()
# Bruk din formel til å kontrollere verdiene ved k=1 og k=2.
print("p1 og p2:", values2[1], values2[2])
```

## 4. Egen undersøkelse: når bytter to sider plass?

Vi vender tilbake til seksidersgrafen. **Hold $S$ og $\alpha=0.85$ faste.**
Vi endrer bare hvor tilfeldige hopp lander.
Ingen side i denne grafen mangler lenker, så $S$ er uavhengig av hoppfordelingen.

**a. Velg et besøksmønster og en påstand.** Velg en positiv
sannsynlighetsvektor $u_1\ne u_0$ som uttrykker en interesse du kan beskrive.
For eksempel kan besøkende oftere hoppe til F. Alle seks koordinater
skal være større enn null og summere til én.

Vi blander jevn hopping og dette besøksmønsteret:

$$u(t)=(1-t)u_0+tu_1,\qquad 0\leq t\leq1.$$

Her er $t$ vekten på det nye besøksmønsteret, **ikke antall steg**.
$t=0$ gir jevne hopp, og $t=1$ gir hopp etter $u_1$.
Vis at $u(t)$ er en positiv sannsynlighetsvektor for hele intervallet.

Velg to forskjellige sider, $i$ og $j$, og skriv en påstand **før du kjører**:
Vil de bytte plass når $t$ øker fra 0 til 1? Hvorfor?
Bruk lenkene til å begrunne forventningen. Oppgi hva som ville avkrefte den.

**b. Vis hvordan løsningen avhenger av $t$.** La $p(t)$ være den
stasjonære fordelingen for hoppfordelingen $u(t)$.
Notasjonen $p(0)$ og $p(1)$ betegner altså to **stasjonære løsninger**,
ikke startvektoren og første iterasjon.

Bruk det lineære systemet fra del 2 til å vise at

$$p(t)=(1-t)p(0)+tp(1).$$

Du kan sette høyresiden inn i systemet og bruke at løsningen er entydig.
Dette er en eksakt matematisk sammenheng; et plott alene beviser den ikke.

**c. Finn en terskel, eller vis at det ikke finnes noen.**
Sett $d(t)=p_i(t)-p_j(t)$. Utled et uttrykk for $d(t)$ fra del b.
Finn når $d(t)=0$, og bestem hvilken side som ligger høyest på hver side
av en eventuell terskel. Ta med tilfellene der $d(t)$ er konstant,
der sidene er like for alle $t$, og der likhet bare oppstår ved et endepunkt.

**Svar:** et uttrykk for $d(t)$, en terskel i $[0,1]$ dersom den finnes,
og en konklusjon om plassforholdet. En terskel utenfor intervallet gir
ikke et plassbytte i forsøket. Hvis plassbyttet uteblir, er det også et
gyldig resultat når du begrunner det.

**d. Kontroller med få beregninger.** Beregn $p(0)$ og $p(1)$ direkte.
Bruk tallene til å bestemme terskelen numerisk, etter at du har utledet
formelen. Velg noen få verdier av $t$ som tester konklusjonen, for eksempel
én på hver side av terskelen. Sammenlign direkte løsning med uttrykket
fra del b. Du trenger ikke søke gjennom et stort antall verdier.

```{pyodide-python}
#| label: project-week5-personalization
# Startforslag: hopp oftere til F. Velg og begrunn ditt eget mønster.
# Du kan bruke forslaget hvis det svarer til påstanden du vil undersøke.
u1 = np.array([0.1, 0.1, 0.1, 0.1, 0.1, 0.5])
pair = ("A", "F")  # Velg to forskjellige sider FØR kjøring.

assert u1.shape == u0.shape and np.all(u1 > 0) and np.isclose(u1.sum(), 1)
assert not np.allclose(u1, u0), "Velg et annet besøksmønster enn jevne hopp."
assert pair[0] != pair[1] and all(name in names for name in pair)
i, j = (names.index(name) for name in pair)
alpha = 0.85
p_left = direct_rank(S, alpha, u0)   # p(0), en stasjonær løsning
p_right = direct_rank(S, alpha, u1)  # p(1), en annen stasjonær løsning
print("Side | p(0) | p(1)")
for name, left, right in zip(names, p_left, p_right):
    print(name, left, right)

# Endepunktene bestemmer de rette linjene. Kontroller formelen matematisk!
t_plot = np.linspace(0, 1, 101)
p_blend = (1-t_plot[:, None])*p_left + t_plot[:, None]*p_right
plt.figure()
plt.plot(t_plot, p_blend[:, i], label=pair[0])
plt.plot(t_plot, p_blend[:, j], label=pair[1])
plt.xlabel("Vekt t på det nye besøksmønsteret")
plt.ylabel("Stasjonær sannsynlighet")
plt.legend()
plt.show()

# Endre kontrollpunktene ut fra din matematisk bestemte terskel.
# De direkte løsningene er en kontroll, ikke en leting etter terskelen.
t_checks = [0.25, 0.75]
print("t | forskjell mellom sidene | avvik fra blandingsformelen")
for t in t_checks:
    assert 0 <= t <= 1
    u_t = (1-t)*u0 + t*u1
    p_direct = direct_rank(S, alpha, u_t)
    predicted = (1-t)*p_left + t*p_right
    print(t, p_direct[i]-p_direct[j], np.linalg.norm(p_direct-predicted, 1))
```

**Hvor sikker er konklusjonen?** Oppgi hvor mange sifre du bruker i terskelen.
Et svært lite beregnet avvik er ikke automatisk en eksakt likhet.
Hvis to verdier er så nær hverandre at beregningsfeilen kan avgjøre
fortegnet, rapporter usikkerheten eller bruk strengere nøyaktighet.
Drøft også forskjellen på at to sider bytter innbyrdes plass og at en side
blir høyest rangert blant alle seks.

## Dette skal leveres

Lever én kjørbar notebook eller Quarto-side med:

- Grafen, overgangsmatrisen og håndberegningen av ett steg.
- Korte utledninger av bevaring av sum én, referansesystemet og feiloppdateringen.
- Tosideanalysen med egenverdier, stasjonær fordeling og formel for iterasjonsfølgen.
- Rangeringen og kontrolltabellen fra del 2, samt høyst to figurer totalt.
- Den egne undersøkelsen: valgt $u_1$ og sidepar, påstanden før forsøket,
  beviset for blandingsformelen, terskelberegningen og de numeriske kontrollene.

Skriv omtrent **300–500 ord analyse** i tillegg til formler og beregninger.
Bruk de konkrete resultatene til å skille mellom:

1. Om koden løser den innlagte modellens likning.
2. Om iterasjonen konvergerer.
3. Hva modellen måler som «viktighet», og hvordan besøksmønsteret påvirker dette.

En påstand som blir avkreftet, er et godt prosjektresultat når undersøkelsen
og begrunnelsen er tydelige. Det er ikke nødvendig å finne et dramatisk plassbytte.
Kode du får hjelp til å skrive, må du kunne forklare og kontrollere.
