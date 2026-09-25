<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 8.0 Oversikt

<div id="uke8-start"></div>

### Fra et likningssystem til et valg

I [uke 6](uke6.qmd#uke6-energi) fant vi minimum til en kvadratisk funksjon med positiv definit matrise. Der svarte null gradient til én global løsning. Hva skjer når vi må velge mellom heltall, når funksjonen har flere bunner, eller når det beste tallet ligger utenfor det tillatte området?

Vi forutsetter partiellderivasjon, gradient og egenverdier fra tidligere uker. Etter denne uken skal du kunne formulere et mål og et tillatt område, skille lokale og globale optima, undersøke indre kritiske punkter med gradient og Hessian, og forklare hva kompakt og konveks betyr for et minimum. **Forelesning** følger forsøkene; **Gå i dybden** åpner mellomregningene.

| Tid | Felles rute | Spørsmål |
|:--|:--|:--|
| 0–25 min | [8.1 Modell og område](#uke8-modell) | Hvilke valg er tillatt? |
| 25–60 min | [8.2 Lokalt og globalt](#uke8-lokalt) | Hva kan gradient og Hessian avgjøre? |
| 60–85 min | [8.3 Kompakthet](#uke8-kompakt) | Finnes det alltid et beste punkt? |
| 85–120 min | [8.4 Konveksitet](#uke8-konveks) | Når er et lokalt minimum globalt? |

Pensum her følger **Gjøvik, kalenderuke 41**, og **Trondheim, kalenderuke 41 (forelesning 15–16)**. Uke 9–10 tar for seg hvordan vi faktisk bygger og forbedrer iterative optimeringsmetoder. Denne uken undersøker vi først hvilket problem de skal løse, og hvilke konklusjoner et numerisk svar tåler.

## 8.1 Modell, valg og tillatt område

<div id="uke8-modell"></div>

### Eksperiment 1 – lønner det seg å bruke alle ressursene?

Fire studenter bygger nye datamaskiner og reparerer gamle. La $b$ være antall **nye** maskiner og $r$ antall **reparasjoner** i én uke. En ny maskin gir 500 kr i overskudd før reisen, en reparasjon 250 kr, og en ukentlig innkjøpstur koster 650 kr. Hver ny maskin bruker 10 komponenter og én arbeidstime; hver reparasjon bruker én komponent og tre arbeidstimer. De har høyst 100 komponenter og 50 timer. Begge antall må være ikke-negative heltall.

Målet er å **maksimere** nettooverskuddet $P(b,r)=500b+250r-650$ over det tillatte området

$$D=\{(b,r)\in\mathbb Z_{\ge0}^2:10b+r\le100,\ b+3r\le50\}.$$

Her betyr $\in$ «er med i», og krøllparentesene samler alle par som oppfyller kravene. I svaret skiller vi mellom **maksimumpunktet** $(b,r)$ og **maksimalverdien** $P(b,r)$.

Forutsatt at turen gjennomføres, er reisekostnaden fast. **Gjett:** Er det beste heltallsvalget et punkt som bruker nøyaktig begge ressursene? Vi prøver alle mulige heltallspar i det lille, avgrensede området. Figuren viser bare tillatte valg.

```{pyodide-python}
#| label: week8-production
b, r = np.meshgrid(np.arange(51), np.arange(101), indexing="ij")
allowed = (10*b + r <= 100) & (b + 3*r <= 50)
profit = 500*b + 250*r - 650
best = tuple(int(i) for i in np.unravel_index(
    np.argmax(np.where(allowed, profit, -np.inf)), profit.shape))
print(f"Best blant {allowed.sum()} tillatte heltallspar: (b,r)={best}, P={profit[best]} kr")
print(f"Ressursbruk: {10*best[0]+best[1]} komponenter, {best[0]+3*best[1]} timer")
fig, ax = plt.subplots(figsize=(6, 5))
points = ax.scatter(b[allowed], r[allowed], c=profit[allowed], s=19, cmap="viridis")
ax.plot(*best, "r*", markersize=16, label="Beste heltallsvalg")
ax.set(xlabel="Nye maskiner b", ylabel="Reparasjoner r", title="Tillatte heltallsvalg")
fig.colorbar(points, ax=ax, label="Nettooverskudd (kr)")
ax.legend(); plt.show()
```

Forsøket finner $(b,r)=(8,14)$ og 6850 kr. Det bruker 94 komponenter og alle 50 timene. Et uttrykk med $b=8.62$ kan ikke beskrive antall maskiner, selv om det er et tillatt punkt når vi **midlertidig** lar variablene være reelle. Modellen bestemmer både *hva som måles*, og *hvilke svar som teller*. Om turen kunne droppes, måtte også valget «ingen tur, ingen fast kostnad» stå i modellen.

Et punkt $x_*$ er et **lokalt minimum** for $f$ på $D$ når $f(x_*)\le f(x)$ for alle tillatte $x$ tilstrekkelig nær $x_*$. Det er **globalt** når ulikheten gjelder for alle $x\in D$. For maksimum snur vi ulikheten. Ordene gjelder alltid et bestemt **mål og område**. Heltallsvalgene er isolerte: i den vanlige topologiske definisjonen blir faktisk hvert slikt punkt et lokalt optimum ved å velge et lite nok nabolag. En gradient forteller derfor ikke hvilke heltallsvalg som er bedre. **Hva ville endret seg hvis $b$ og $r$ var delbare størrelser?**

<details class="reading-step">
<summary>Gå i dybden: kontinuerlig avslapning og fast reisekostnad</summary>

Hvis $b,r$ tillates å være reelle, er området en kompakt polygon. $P$ er affin: langs hver rette kant er verdien lineær, så et maksimum finnes i et hjørne (eller på en hel kant med samme verdi). Sammenligning av hjørnene gir skjæringen mellom ressursgrensene: $b=250/29$ og $r=400/29$, med $P=225000/29-650\approx7108.62$ kr. Dette er en **øvre grense** for heltallsproblemet, ikke en gjennomførbar produksjonsplan. Punktet $(8,14)$ bruker $10\cdot8+14=94$ komponenter og $8+3\cdot14=50$ timer. Hvis null produksjon ikke krever en tur, må vi i stedet definere $P(0,0)=0$ som eget valg; formelen med $-650$ beskriver en tur som faktisk tas.

</details>

## 8.2 Kritiske punkter er kandidater

<div id="uke8-lokalt"></div>

### Eksperiment 2 – to starter, to svar

Vi minimerer nå en glatt kostnadsfunksjon med to reelle innstillinger $x,y$:

$$f(x,y)=20+x^2+y^2-10\bigl(\cos(2\pi x)+\cos(2\pi y)\bigr).$$

Kvadratleddene straffer store innstillinger; cosinusleddene gir flere små daler. **Forutsi:** Vil to lokale søk fra $(0,0)$ og $(2,2)$ rapportere samme verdi? Vi gir SciPy den analytiske gradienten og kontrollerer verdi og gradient etterpå. Rutinen er foreløpig et måleinstrument; vi utleder algoritmene i senere uker.

```{pyodide-python}
#| label: week8-local-minima
def wavy(z):
    x, y = z
    return 20 + x*x + y*y - 10*(np.cos(2*np.pi*x) + np.cos(2*np.pi*y))

def wavy_grad(z):
    x, y = z
    return np.array([2*x + 20*np.pi*np.sin(2*np.pi*x),
                     2*y + 20*np.pi*np.sin(2*np.pi*y)])

for start in ([0., 0.], [2., 2.]):
    result = minimize(wavy, start, jac=wavy_grad, method="BFGS")
    x, y = result.x
    print(f"Start {start}: punkt ({x:.4f}, {y:.4f}), "
          f"f={result.fun:.4f}, ||grad f||={np.linalg.norm(wavy_grad(result.x)):.2e}")

grid = np.linspace(-.3, 2.4, 180)
X, Y = np.meshgrid(grid, grid)
fig, ax = plt.subplots(figsize=(6, 5))
curves = ax.contour(X, Y, wavy((X, Y)), levels=np.arange(0, 24, 2))
ax.clabel(curves, inline=True, fontsize=8)
ax.plot(0, 0, "ko", label="Start nær (0,0)")
ax.plot(2, 2, "r*", markersize=12, label="Start nær (2,2)")
ax.set(xlabel="x", ylabel="y", title="Nivåkurver for kostnaden")
ax.legend(); plt.show()
```

Fra null får vi verdi 0. Fra $(2,2)$ får vi omtrent $(1.9899,1.9899)$, verdi 7.9597 og gradientnorm rundt $10^{-6}$. Begge ligger ved dalbunner; gradienten er nesten null også ved den **dårligere** dalen. Dessuten kan vi her bevise globalitet uten å stole på søket: $x^2+y^2\ge0$ og hver cosinus er høyst 1, så $f(x,y)\ge0$ for alle $(x,y)$. Nullpunktet oppnår grensen. **Ville to starter alene vært et bevis for denne påstanden?**

Anta at $f$ er to ganger kontinuerlig deriverbar i et åpent nabolag av et punkt **inne i** området. Ved et lokalt ekstremum må $\nabla f(x_*)=0$: punktet er **kritisk**. For å skille kandidater undersøker vi Hessianmatrisen $H_f$, matrisen av andre partiellderiverte. Er alle egenverdier positive i et kritisk punkt, har vi et strengt lokalt minimum; alle negative gir et strengt lokalt maksimum. Egenverdier med begge fortegn gir et sadelpunkt, også om andre egenverdier er null. Er Hessian semidefinit med en null egenverdi, avgjør testen ikke punktets type. Klassifikasjonen sier fortsatt ikke at minimum er globalt. På **randen** kan optimum ha gradient ulik null, slik som minimum av $f(x)=x$ på $[0,1]$ ved $x=0$.

<details class="reading-step">
<summary>Gå i dybden: nødvendige og tilstrekkelige lokale tester</summary>

Ved et indre lokalt minimum kan vi gå både fram og tilbake langs hver koordinat uten å forlate området. Den endimensjonale derivasjonstesten gir derfor alle partiellderiverte lik null. For en to ganger kontinuerlig deriverbar funksjon gjelder dessuten $v^TH_f(x_*)v\ge0$ for enhver retning $v$: Hessian er **positiv semidefinit**, en nødvendig betingelse som tillater null egenverdier. I et kritisk punkt er positiv **definit** Hessian en tilstrekkelig betingelse for strengt lokalt minimum. Null egenverdi i en semidefinit Hessian avgjør ingenting: $x^4$ har lokalt minimum ved null, mens $-x^4$ har lokalt maksimum der; begge har andrederivert null. Dette er den generelle utvidelsen av den [positive definite kvadratiske funksjonen fra uke 6](uke6.qmd#uke6-energi).

For den bølgede funksjonen er $H_f(x,y)=\operatorname{diag}(2+40\pi^2\cos(2\pi x),2+40\pi^2\cos(2\pi y))$. Begge diagonalverdiene er positive nær $(1.9899,1.9899)$. Punktet er altså et lokalt minimum, mens ulikheten $f\ge0$ viser at det ikke er globalt. Ved $f(x,y)=x^2-y^2$ er gradienten null i origo, men Hessian har egenverdiene $2$ og $-2$: et sadelpunkt.

</details>

## 8.3 Kompakthet og eksistens

<div id="uke8-kompakt"></div>

### Eksperiment 3 – et tall vi nærmer oss uten å nå

Tenk at vi vil minimere $g(x)=x$. På det lukkede intervallet $[0,1]$ er svaret 0. Hva med det **åpne** intervallet $(0,1)$? La et rutenett med flere og flere indre punkter prøve å finne minimum. **Forutsi:** Vil det minste rapporterte punktet noensinne være et tillatt minimum?

```{pyodide-python}
#| label: week8-open-domain
for n in (10, 100, 1000):
    sample = np.arange(1, n)/n  # Begge endepunkter er utelatt.
    print(f"{n-1:4d} indre punkter: minste g={sample.min():.3f}, "
          f"største g={sample.max():.3f}")
```

Tallene blir $0.1,0.01,0.001$ for de minste verdiene. Vi kan alltid velge et nytt tillatt punkt nærmere 0. **Infimum** er 0, men ingen $x\in(0,1)$ oppnår det; heller ikke supremum 1 er et maksimum der. Det er ikke et spørsmål om finere numerisk oppløsning. På $[0,1]$ er begge endepunktene tillatt.

En mengde i $\mathbb R^n$ er **kompakt** når den er **lukket** (inneholder alle sine grensepunkter) og **begrenset** (får plass innenfor en endelig radius). Setningen om ekstremalverdier sier at en **kontinuerlig** funksjon på en **ikke-tom kompakt** mengde oppnår både minimum og maksimum. Heltallsområdet i 8.1 er endelig og dermed kompakt; den kontinuerlige polygonen er også kompakt. Åpenhet eller ubegrensethet fjerner garantien, men utelukker ikke alltid et optimum: $x^2$ har minimum på hele $\mathbb R$. **Hvorfor garanterer ikke setningen at søket fra én start finner minimumet?**

<details class="reading-step">
<summary>Gå i dybden: hvorfor lukkethet og begrensning begge teller</summary>

Hvis en kontinuerlig funksjon på en ikke-tom kompakt mengde ikke oppnådde sin infimumverdi, kunne vi velge en følge av tillatte punkter med funksjonsverdi stadig nærmere infimum. Kompakthet gir en konvergent delfølge med grensepunkt *i området*. Kontinuitet ville så gitt akkurat infimum i grensepunktet: en motsigelse. Intervallet $(0,1)$ mister grensepunktet 0; på $\mathbb R$ kan en følge i stedet løpe ubegrenset langt bort. Setningen gir **eksistens**, ikke en metode for å lokalisere punktet eller entydighet.

</details>

## 8.4 Konveksitet gir en global garanti

<div id="uke8-konveks"></div>

### Eksperiment 4 – test et punkt mellom to andre

Vi tar en kvadratikk av samme type som i [uke 6, valg av søkeretning](uke6.qmd#uke6-retning): $\phi(u,v)=u^2+uv+v^2-3u$. Vi sammenligner den med $f$ fra 8.2. For to punkter $a,b$ tester vi midtpunktet $m=(a+b)/2$. **Forutsi:** Ligger funksjonsverdien i midten over eller under gjennomsnittet av endeverdiene?

```{pyodide-python}
#| label: week8-convex-midpoints
def phi(z):
    u, v = z
    return u*u + u*v + v*v - 3*u

a, b = np.array([0., 0.]), np.array([2., -1.])
print(f"Kvadratikk: midten {phi((a+b)/2):.2f}, "
      f"snitt av ender {(phi(a)+phi(b))/2:.2f}")
c, d = np.array([0., 0.]), np.array([1., 0.])
print(f"Bølget:    midten {wavy((c+d)/2):.2f}, "
      f"snitt av ender {(wavy(c)+wavy(d))/2:.2f}")
print("Egenverdier til kvadratikkens Hessian:",
      np.linalg.eigvalsh(np.array([[2., 1.], [1., 2.]])))
```

Kvadratikken gir $-2.25\le-1.50$. Den bølgede gir $20.25>0.50$, så **ett** moteksempel er nok til å avkrefte konveksitet. En mengde $D$ er **konveks** dersom hele linjestykket $ta+(1-t)b$ ligger i $D$ når $a,b\in D$ og $0\le t\le1$. En funksjon på et konvekst område er **konveks** dersom

$$f(ta+(1-t)b)\le t f(a)+(1-t)f(b)\qquad(a,b\in D,\ 0\le t\le1).$$

For å *bevise* konveksitet må ulikheten gjelde alle slike punkter. For en $C^2$-funksjon på et **åpent konvekst område** er positiv semidefinit Hessian overalt en tilstrekkelig test for konveksitet. **Streng konveksitet** betyr streng ulikhet for ulike endepunkter og $0<t<1$; da kan det finnes høyst ett minimum, men eksistens må vises separat. Kvadratikken har konstant Hessian med egenverdiene 1 og 3. Den er strengt konveks, og det kritiske punktet $(2,-1)$ er dermed dens unike globale minimum på $\mathbb R^2$. Dette utvikler SPD-argumentet fra uke 6 til en test for generelle funksjoner: Hessian må nå undersøkes i **hele området**, ikke bare i ett punkt.

På et konvekst område er ethvert lokalt minimum av en konveks funksjon også globalt. Et indre kritisk punkt er dermed globalt, men et randminimum kan fremdeles ha gradient ulik null. Den **reelle** versjonen av produksjonsområdet er konveks, mens heltallspunktene ikke er det: midtpunktet mellom $(0,0)$ og $(1,0)$ er ikke et tillatt heltallsvalg. **Hvordan påvirker dette hvilken garanti vi kan bruke i produksjonsmodellen?**

<details class="reading-step">
<summary>Gå i dybden: fra linjestykke til globalt minimum</summary>

Anta at $x_*$ er lokalt minimum til en konveks funksjon på en konveks mengde $D$. Hvis et annet punkt $y\in D$ hadde $f(y)<f(x_*)$, ville for hvert $0<t\le1$ punktet $x_t=(1-t)x_*+ty$ ligge i $D$, og konveksitet ville gi $f(x_t)\le(1-t)f(x_*)+tf(y)<f(x_*)$. For tilstrekkelig liten positiv $t$ ligger $x_t$ vilkårlig nær $x_*$, i strid med lokal minimalitet.

For en deriverbar konveks funksjon gjelder tangentulikheten $f(y)\ge f(x)+\nabla f(x)^T(y-x)$. Hvis $\nabla f(x_*)=0$, får vi $f(y)\ge f(x_*)$ for alle $y$ i området. For en kvadratisk funksjon $\phi(z)=\tfrac12 z^TAz-b^Tz$ er Hessian lik $A$ overalt, slik vi så i uke 6. Med positiv definit $A$ er minimumet entydig. På en rand må vi undersøke **tillatte retninger**; gradienten trenger ikke være null.

</details>

## 8.5 Oppgaver og kilder

<div id="uke8-oppgaver"></div>

### Kontroller regningen selv

Svar eksakt uten avrunding. Skriv `*` for multiplikasjon og `^` for potens i uttrykksfelter. Skriv bare uttrykket, uten likhetstegn. Begrunn klassifikasjoner i egne notater; kontrollfeltene sjekker de konkrete beregningene og gir ingen løsningsgang.

::: {#uke8-exercise-model-context .math-exercise-context}

I produksjonsmodellen er $b,r$ ikke-negative heltall. Det går med $10b+r$ komponenter og $b+3r$ arbeidstimer, med kapasitet henholdsvis 100 og 50. Turen koster 650 kr når den tas. Nettooverskudd er $P=500b+250r-650$ for en tur som gjennomføres.

:::

**Oppgave 1 – modell.**

```{math-exercise}
#| label: week8-task-model
#| context: uke8-exercise-model-context
#| caption: Sjekk modellen
#| mode: equivalent
#| partial-credit: true
#| field-labels: antall komponenter, antall timer, nettooverskudd i kroner

Du planlegger $b=6$ nye maskiner og $r=12$ reparasjoner. Beregn ressursbruk og nettooverskudd. Er valget tillatt? Begrunn i egne notater.

Komponenter: __[72] &nbsp; Timer: __[42] &nbsp; Nettooverskudd (kr): __[5350]
```

::: {#uke8-exercise-hessian-context .math-exercise-context}

For en $C^2$-funksjon på et åpent område er null gradient nødvendig ved et indre lokalt ekstremum. I et kritisk punkt gir positiv definit Hessian et strengt lokalt minimum, negativ definit Hessian et strengt lokalt maksimum, og egenverdier med begge fortegn et sadelpunkt, også når flere egenverdier er null. En semidefinit Hessian med en null egenverdi gir ingen konklusjon fra andrederiverttesten. For $h(u,v)=u^2-4v^2$ er Hessian matrisen med andre partiellderiverte.

:::

**Oppgave 2 – krumning.**

```{math-exercise}
#| label: week8-task-hessian
#| context: uke8-exercise-hessian-context
#| caption: Test et kritisk punkt
#| mode: equivalent
#| partial-credit: true
#| field-labels: positiv egenverdi, negativ egenverdi

Finn egenverdiene til Hessian for $h(u,v)=u^2-4v^2$ ved origo. Klassifiser punktet i egne notater.

Positiv egenverdi: __[2] &nbsp; Negativ egenverdi: __[-8]
```

::: {#uke8-exercise-domain-context .math-exercise-context}

Et minimum for en funksjon på $D$ krever et tillatt punkt som oppnår den minste verdien. Infimum trenger ikke å oppnås. Et intervall i $\mathbb R$ er kompakt hvis det er lukket og begrenset. Betrakt $g(x)=x^2$ på $D=(0,2)$; begge endepunktene er utelatt.

:::

**Oppgave 3 – eksistens.**

```{math-exercise}
#| label: week8-task-infimum
#| context: uke8-exercise-domain-context
#| caption: Grenseverdi eller oppnådd verdi?
#| mode: equivalent
#| field-labels: infimum til g

Finn infimum for $g(x)=x^2$ på $(0,2)$. Finnes det et minimum? Gi begrunnelse i egne notater.

$\inf_{x\in(0,2)}g(x)=$ __[0]
```

::: {#uke8-exercise-convex-context .math-exercise-context}

For en konveks funksjon skal midtpunktsulikheten $f((a+b)/2)\le(f(a)+f(b))/2$ gjelde. For å motbevise konveksitet er ett brudd nok. Bruk $q(x)=x^4-2x^2$ og punktene $a=-1$, $b=1$.

:::

**Oppgave 4 – konveksitet.**

```{math-exercise}
#| label: week8-task-convex
#| context: uke8-exercise-convex-context
#| caption: Midtpunktsulikheten
#| mode: equivalent
#| partial-credit: true
#| field-labels: q i midtpunktet, gjennomsnitt av endeverdiene

For $q(x)=x^4-2x^2$ bruker du $a=-1$ og $b=1$. Regn ut verdien i midtpunktet og gjennomsnittet av endeverdiene. Hva sier sammenligningen om konveksitet? Begrunn i egne notater.

$q((a+b)/2)=$ __[0] &nbsp; $(q(a)+q(b))/2=$ __[-1]
```

### Kilder og videre arbeid

Uken bygger på Gjøviks notater [Introduksjon til optimering](https://wiki.math.ntnu.no/_media/imax3011/2025h/introduksjon_til_optimering.pdf) og [Konveksitet og kompakthet](https://wiki.math.ntnu.no/_media/imax3011/2025h/konveksitet_og_kompakthet.pdf) fra kalenderuke 41, samt Trondheims [forelesning 15](https://wiki.math.ntnu.no/_media/imax3011/2025h/imat3011-forelesning15.pdf) og [forelesning 16](https://wiki.math.ntnu.no/_media/imax3011/2025h/imat3011-forelesning16.pdf). Vi har brukt `scipy.optimize.minimize` til å undersøke *lokale* resultater; senere uker bygger metodene som ligger bak slike søk.

:::
