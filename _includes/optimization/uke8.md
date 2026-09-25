<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 8.0 Oversikt

<div id="uke8-start"></div>

### Fra et likningssystem til et valg

I [uke 6](uke6.qmd#uke6-energi) fant vi løsningen av et lineært
system ved å minimere en kvadratisk funksjon. Nå skal vi undersøke
problemer der funksjonen kan ha flere bunner, og der noen valg er
utelukket av begrensninger. Før vi velger en regnemetode, må vi vite
hva vi mener med en løsning og hvordan vi kan kontrollere den.

Fire spørsmål følger oss gjennom hele optimeringsdelen:

- **Hva er problemet?** Vi må velge en målfunksjon og angi hvilke punkter som er tillatt.
- **Finnes det en beste verdi?** En følge av stadig bedre svar trenger ikke å nå et minimum.
- **Hvordan finner vi en kandidat?** En numerisk metode undersøker bare en del av området.
- **Hvorfor er kandidaten best?** Vi trenger en matematisk begrunnelse for å gå fra et lovende tall til en garanti.

Denne uken bygger vi begrepene som trengs for å svare. Først lager vi
en modell. Deretter bruker vi deriverte til å undersøke punkter nær en
kandidat. Til slutt ser vi hvilke egenskaper ved hele området og
funksjonen som sikrer at et minimum finnes, og at et lokalt minimum
også er globalt. **Forelesning** viser hovedløpet; **Gå i dybden** åpner
lengre begrunnelser og mellomregninger.

I [uke 9](uke9.qmd) utvikler vi søkemetoder, og i [uke 10](uke10.qmd)
bruker vi andrederiverte til å velge bedre steg. [Uke 11](uke11.qmd)
og [uke 12](uke12.qmd) handler om hvordan begrensninger endrer både
søket og begrunnelsen for at et svar er optimalt.

## 8.1 Modell, valg og tillatt område

<div id="uke8-modell"></div>

Et **optimeringsproblem** ber oss finne det beste tillatte valget.
Valgene samles i en vektor $z=(z_1,\ldots,z_n)^T$, og
**målfunksjonen** $f(z)$ er tallet vi vil gjøre minst eller størst.
Det **tillatte området** $D$ er mengden av valg som oppfyller alle
kravene, også kalt **bibetingelser**. Et punkt i $D$ er et tillatt punkt.

Notasjonen

$$\min_{z\in D} f(z)$$

betyr at vi søker en **minimumsverdi** blant punktene i $D$.
Et punkt $z_*$ som oppnår verdien, er et **minimumspunkt**;
selve tallet er $f(z_*)$. Vi skriver ofte at vi «finner minimum»,
men må holde disse to størrelsene fra hverandre. Å maksimere $f$ er
det samme som å minimere $-f$: de samme punktene blir best.

### Eksperiment 1 – lønner det seg å bruke alle ressursene?

Fire studenter bygger nye datamaskiner og reparerer gamle. La $b$ være antall **nye** maskiner og $r$ antall **reparasjoner** i én uke. En ny maskin gir 500 kr i overskudd før reisen, en reparasjon 250 kr, og en ukentlig innkjøpstur koster 650 kr. Hver ny maskin bruker 10 komponenter og én arbeidstime; hver reparasjon bruker én komponent og tre arbeidstimer. De har høyst 100 komponenter og 50 timer. Begge antall må være ikke-negative heltall.

Målet er å **maksimere** nettooverskuddet $P(b,r)=500b+250r-650$ over det tillatte området

$$D=\{(b,r)\in\mathbb Z_{\ge0}^2:10b+r\le100,\ b+3r\le50\}.$$

Her betyr $\in$ «er med i», $\mathbb Z_{\ge0}$ er de ikke-negative heltallene, og krøllparentesene samler alle par som oppfyller kravene. I svaret skiller vi mellom **maksimumpunktet** $(b,r)$ og **maksimalverdien** $P(b,r)$.

I koden lager `meshgrid` alle par av de to listene med antall. `allowed` markerer hvilke par som oppfyller begge ressurskravene. `np.where` lar bare disse konkurrere, og `argmax` finner plasseringen med høyest overskudd. Det er en systematisk opptelling, ikke en metode basert på deriverte.

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

### Lokalt og globalt svarer på forskjellige spørsmål

Et tillatt punkt $z_*$ er et **globalt minimumspunkt** når
$f(z_*)\le f(z)$ for alle $z\in D$. Det er et **lokalt minimumspunkt**
når ulikheten gjelder for alle tillatte punkter tilstrekkelig nær
$z_*$. «Nær» betyr liten avstand $\|z-z_*\|_2$, med den vanlige
vektorlengden fra [uke 4](uke4.qmd). Et minimum er **strengt** når
ulikheten er streng for andre punkter i området vi sammenligner med.
For maksimum snur vi ulikhetene. **Ekstremum** er en fellesbetegnelse
for minimum og maksimum; **optimalt** betyr best for det valgte målet.

I produksjonsforsøket fant vi et globalt maksimum fordi vi undersøkte
*alle* tillatte heltallspar. For reelle variabler er det som regel
uendelig mange punkter, så den framgangsmåten er ikke tilgjengelig.
Et lokalt søk kan da finne en dalbunn uten å oppdage en dypere dal.

Et tall $L$ er en **nedre grense** dersom $L\le f(z)$ for alle tillatte
$z$; en **øvre grense** defineres med motsatt ulikhet. Hvis et tillatt
punkt oppnår en slik grense, har vi et bevis på at verdien er globalt
best. Denne ideen kommer igjen i alle ukene, særlig som **dualitet**
i uke 11. Vi skal først se den i en enkel sum av ikke-negative ledd.

Heltallsvalg kan ikke endres med vilkårlig små steg. Faktisk blir hvert
isolert heltallspunkt et lokalt optimum etter definisjonen over, fordi
et lite nok område ikke inneholder andre tillatte punkter. Derfor
handler derivasjonstestene i neste avsnitt om **reelle variabler**.

<details class="reading-step">
<summary>Gå i dybden: kontinuerlig avslapning og fast reisekostnad</summary>

Hvis $b,r$ tillates å være reelle, blir det tillatte området en lukket, begrenset mangekant. Denne utvidelsen kalles en **relaksasjon**: vi tillater flere valg, så beste overskudd kan bare øke. $P$ er **affin**, altså lineær pluss en konstant. På en slik mangekant oppnår en affin funksjon et maksimum i minst ett hjørne; langs en kant varierer den lineært og kan også være konstant. I [uke 11](uke11.qmd#uke11-modell) utvikler vi denne hjørnemetoden. Sammenligning av hjørnene gir skjæringen mellom ressursgrensene: $b=250/29$ og $r=400/29$, med $P=225000/29-650\approx7108.62$ kr. Dette er en **øvre grense** for heltallsproblemet, ikke en gjennomførbar produksjonsplan. Punktet $(8,14)$ bruker $10\cdot8+14=94$ komponenter og $8+3\cdot14=50$ timer. Hvis null produksjon ikke krever en tur, må vi i stedet definere $P(0,0)=0$ som eget valg; formelen med $-650$ beskriver en tur som faktisk tas.

</details>

## 8.2 Kritiske punkter er kandidater

<div id="uke8-lokalt"></div>

For å undersøke en dalbunn trenger vi å beskrive hvordan funksjonen
endrer seg når vi flytter et punkt litt. Vi repeterer derfor den
flerdimensjonale derivasjonen fra [uke 6](uke6.qmd#uke6-retning).

<div id="uke8-gradient"></div>

### Gradient: endring i en valgt retning

For $f(u,v)$ er den **partiellderiverte** $\partial f/\partial u$
deriverten når $u$ endres og $v$ holdes fast. De to partiellderiverte
samles i **gradienten**

$$\nabla f(z)=\begin{pmatrix}\partial f/\partial u\\
\partial f/\partial v\end{pmatrix},\qquad z=(u,v)^T.$$

For et lite steg $h$ er endringen omtrent
$f(z+h)-f(z)\approx\nabla f(z)^Th$. Produktet er det vanlige
indreproduktet: hver koordinatendring multipliseres med sin helning.
Langs en bestemt retning $p$ er den deriverte med hensyn på
stegparameteren $t$

$$\left.\frac{d}{dt}f(z+tp)\right|_{t=0}=\nabla f(z)^Tp.$$

Dette følger av kjerneregelen og kalles den **retningsderiverte langs
$p$**; dersom $p$ har lengde 1, måler den endring per lengdeenhet.
Når produktet er negativt, senker tilstrekkelig små positive steg
funksjonen. Retningen $-\nabla f(z)$ har denne egenskapen så lenge
gradienten ikke er null. Vi bruker den til å bygge en metode i uke 9.

Et **indre punkt** i $D$ har et lite område rundt seg der alle punkter
er tillatt. Et **randpunkt** ligger på grensen mellom tillatte og
utelukkede valg. Ved et indre lokalt minimum kan vi bevege oss litt i
begge fortegn langs hver koordinat. Da må alle partiellderiverte være
null. Et punkt med $\nabla f(z)=0$ kalles **stasjonært**, eller
**kritisk** i våre deriverbare problemer. Dette er en **nødvendig
betingelse**: alle slike minima må oppfylle den. Det er ennå ikke en
**tilstrekkelig betingelse**, altså noe som alene garanterer minimum.

### Eksperiment 2 – to starter, to svar

Vi minimerer nå en kostnadsfunksjon med to reelle innstillinger $x,y$. Den er **glatt**: de deriverte vi trenger finnes og varierer kontinuerlig, uten sprang:

$$f(x,y)=20+x^2+y^2-10\bigl(\cos(2\pi x)+\cos(2\pi y)\bigr).$$

Kvadratleddene straffer store innstillinger; cosinusleddene gir flere
små daler. **Forutsi:** Vil to lokale søk fra $(0,0)$ og $(2,2)$ gi
samme verdi? En **nivåkurve** forbinder punkter med samme
funksjonsverdi; figuren under viser slike kurver rundt dalene.

### Første møte med SciPy

**NumPy** gir oss arrayer, vektorregning og elementære funksjoner.
**SciPy** bygger videre på NumPy med ferdige numeriske metoder.
Her bruker vi `minimize` fra delen `scipy.optimize`. Oppsettet på
siden har allerede kjørt importen `from scipy.optimize import minimize`.
Du trenger ikke installere noe for å bruke kodecellene.

Kallet `minimize(wavy, start, jac=wavy_grad, method="BFGS")` betyr:

- `wavy` er Python-funksjonen som skal minimeres. Den tar inn en array `z` og returnerer ett tall. Vi sender inn **funksjonen**, uten parenteser, så SciPy kan kalle den på flere punkter.
- `start` er startvektoren, altså første punkt som prøves.
- `jac=wavy_grad` gir funksjonen som beregner gradienten. Navnet `jac` brukes av SciPy; her skal den returnere en array med én derivert per variabel.
- `method="BFGS"` velger en lokal søkemetode som bruker gradienter til å anslå krumningen. Vi undersøker prinsippet i uke 10; her bruker vi metoden for å sammenligne to startpunkter.

Svaret `result` er en samling opplysninger: `result.x` er punktet
metoden fant, og `result.fun` er funksjonsverdien der. Vi kontrollerer
også **gradientnormen** $\|\nabla f\|_2$, altså lengden på
gradientvektoren. Liten norm betyr små deriverte, og er bare en
kontroll av stasjonaritet, ikke et bevis på minimum.

Kjør cellen og sammenlign punktene, verdiene og gradientnormene.


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

<div id="uke8-hessian"></div>

### Hessian: hvilken vei krummer funksjonen?

Den andrederiverte forteller om en kurve bøyer opp eller ned. For to
variabler samler vi alle andre partiellderiverte i **Hessianmatrisen**:

$$H_f(z)=\nabla^2 f(z)=
\begin{pmatrix}
\dfrac{\partial^2 f}{\partial u^2} & \dfrac{\partial^2 f}{\partial u\partial v}\\[6pt]
\dfrac{\partial^2 f}{\partial v\partial u} & \dfrac{\partial^2 f}{\partial v^2}
\end{pmatrix}.$$

Diagonalene beskriver krumning når én koordinat endres. De blandede
partiellderiverte beskriver hvordan helningen i én koordinat endres
når den andre endres. Når de andrederiverte er kontinuerlige
(skrevet $f\in C^2$), er de blandede deriverte like, så Hessianen er
symmetrisk. I $n$ variabler er den en $n\times n$-matrise.

Hessianen inngår i en **lokal kvadratisk modell**, Taylor-tilnærmingen:

$$f(z+h)\approx f(z)+\nabla f(z)^Th+\tfrac12 h^TH_f(z)h.$$

Her er $h$ en liten endring i punktet, første ledd er verdien vi
starter fra, andre ledd er endringen gradienten forutsier, og siste
ledd tar med krumningen. Ved et stasjonært punkt er det lineære leddet
null; da er fortegnet til $h^TH_f(z)h$ avgjørende for andrederiverttesten.

Fra [uke 5](uke5.qmd) og [uke 6](uke6.qmd#uke6-energi) kjenner vi
følgende egenskaper for symmetriske matriser:

| Egenskap | Hva betyr den for alle vektorer $h\ne0$? | Egenverdier |
|:--|:--|:--|
| Positiv definit | $h^THh>0$ | Alle er positive |
| Positiv semidefinit | $h^THh\ge0$ | Alle er ikke-negative |
| Negativ definit | $h^THh<0$ | Alle er negative |
| Negativ semidefinit | $h^THh\le0$ | Alle er ikke-positive |
| Indefinit | Uttrykket er positivt for noen $h$ og negativt for andre | Begge fortegn finnes |

**SPD** forkorter «symmetrisk positiv definit». I et stasjonært
indre punkt gir positiv definit Hessian et **strengt lokalt minimum**;
negativ definit gir et strengt lokalt maksimum. En indefinit Hessian
gir et **sadelpunkt**: det finnes både høyere og lavere funksjonsverdier
vilkårlig nær punktet. En semidefinit Hessian med en null egenverdi
avgjør ikke typen. For eksempel har både $u^4$ og $-u^4$
andrederivert null i origo, men den ene har minimum og den andre maksimum.

Den kvadratiske funksjonen fra uke 6 var
$\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v$.
Direkte derivasjon gir

$$\nabla\phi(u,v)=\begin{pmatrix}3u+v-5\\u+2v-5\end{pmatrix},
\qquad H_\phi=\begin{pmatrix}3&1\\1&2\end{pmatrix}=A.$$

Hessianen er altså nettopp systemmatrisen. Taylor-modellen er eksakt
for denne funksjonen. For den bølgede funksjonen varierer Hessianen
med punktet, og modellen er bare en lokal tilnærming. Det er dette
skillet vi bygger Newtons metode på i uke 10.

Testen krever et **indre** punkt. Minimum av $f(x)=x$ på $[0,1]$
ligger ved randen $x=0$, selv om den deriverte er 1. Der er alle små
*tillatte* bevegelser mot høyre. I uke 11–12 må vi derfor kombinere
informasjon om funksjonen med informasjon om hvilke bevegelser
begrensningene tillater.

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

Tallene blir $0.1,0.01,0.001$ for de minste verdiene. Vi kan alltid velge et nytt tillatt punkt nærmere 0. **Infimum** er den største nedre grensen for funksjonsverdiene. Her er den 0, men ingen $x\in(0,1)$ oppnår den. **Supremum** er den minste øvre grensen; her er den 1, og den oppnås heller ikke. Minimum og maksimum krever at en tillatt verdi faktisk oppnår grensen. Det er ikke et spørsmål om finere numerisk oppløsning. På $[0,1]$ er begge endepunktene tillatt.

Et **grensepunkt** kan nås som grensen av punkter i mengden. Mengden er **lukket** hvis alle slike grenser også er med, og **begrenset** hvis alle punktene får plass i en ball med endelig radius. I $\mathbb R^n$ betyr **kompakt** at mengden er både lukket og begrenset. For eksempel er $[0,1]$ kompakt, men $(0,1)$ mangler grensepunktene 0 og 1. En **kontinuerlig** funksjon bevarer grenser: når punkter nærmer seg et punkt, nærmer funksjonsverdiene seg verdien der. Setningen om ekstremalverdier sier at en **kontinuerlig** funksjon på en **ikke-tom kompakt** mengde oppnår både minimum og maksimum. Heltallsområdet i 8.1 er endelig og dermed kompakt; den kontinuerlige polygonen er også kompakt. Åpenhet eller ubegrensethet fjerner garantien, men utelukker ikke alltid et optimum: $x^2$ har minimum på hele $\mathbb R$. **Hvorfor garanterer ikke setningen at søket fra én start finner minimumet?**

<details class="reading-step">
<summary>Gå i dybden: hvorfor lukkethet og begrensning begge teller</summary>

Først må funksjonsverdiene være begrenset: ellers kunne vi velge punkter med $|f|$ stadig større uten grense. En konvergent delfølge ville da motsi kontinuitet i grensepunktet. Infimum er derfor et endelig tall. Hvis funksjonen ikke oppnådde sin infimumverdi, kunne vi velge en følge av tillatte punkter med funksjonsverdi stadig nærmere infimum. Kompakthet gir en konvergent delfølge med grensepunkt *i området*. Kontinuitet ville så gitt akkurat infimum i grensepunktet: en motsigelse. Intervallet $(0,1)$ mister grensepunktet 0; på $\mathbb R$ kan en følge i stedet løpe ubegrenset langt bort. Setningen gir **eksistens**, ikke en metode for å lokalisere punktet eller entydighet.

</details>

## 8.4 Konveksitet gir en global garanti

<div id="uke8-konveks"></div>

### Eksperiment 4 – test et punkt mellom to andre

At et minimum finnes, forteller ikke om en lokal metode finner det. Nå ser vi etter en egenskap som gjør alle lokale minima globale. Vi vender tilbake til akkurat den kvadratiske funksjonen fra [uke 6](uke6.qmd#uke6-energi): $\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v$. Vi sammenligner den med $f$ fra 8.2. For to punkter $a,b$ tester vi midtpunktet $m=(a+b)/2$. **Forutsi:** Ligger funksjonsverdien i midten over eller under gjennomsnittet av endeverdiene?

```{pyodide-python}
#| label: week8-convex-midpoints
def phi(z):
    u, v = z
    return 1.5*u*u + u*v + v*v - 5*u - 5*v

a, b = np.array([0., 0.]), np.array([1., 2.])
print(f"Kvadratikk: midten {phi((a+b)/2):.3f}, "
      f"snitt av ender {(phi(a)+phi(b))/2:.3f}")
c, d = np.array([0., 0.]), np.array([1., 0.])
print(f"Bølget:    midten {wavy((c+d)/2):.2f}, "
      f"snitt av ender {(wavy(c)+wavy(d))/2:.2f}")
print("Egenverdier til kvadratikkens Hessian:",
      np.linalg.eigvalsh(np.array([[3., 1.], [1., 2.]])))
```

Kvadratikken gir $-5.625\le-3.750$. Den bølgede gir $20.25>0.50$, så **ett** moteksempel er nok til å avkrefte konveksitet. En mengde $D$ er **konveks** dersom hele linjestykket $ta+(1-t)b$ ligger i $D$ når $a,b\in D$ og $0\le t\le1$. En funksjon på et konvekst område er **konveks** dersom

$$f(ta+(1-t)b)\le t f(a)+(1-t)f(b)\qquad(a,b\in D,\ 0\le t\le1).$$

Venstresiden er verdien i et punkt mellom endepunktene; høyresiden er samme vektede gjennomsnitt av endeverdiene. Grafen ligger dermed under den rette forbindelsen mellom endeverdiene. For å *bevise* konveksitet må ulikheten gjelde alle slike punkter. For en $C^2$-funksjon på et **åpent konvekst område** (alle punktene er indre punkter) er positiv semidefinit Hessian overalt en tilstrekkelig test for konveksitet. **Streng konveksitet** betyr streng ulikhet for ulike endepunkter og $0<t<1$; da kan det finnes høyst ett minimum, men eksistens må vises separat. Kvadratikken har konstant Hessian med egenverdiene $(5-\sqrt5)/2$ og $(5+\sqrt5)/2$, begge positive. Den er strengt konveks, og det kritiske punktet $(1,2)$ er dermed dens unike globale minimum på $\mathbb R^2$. Her betyr **entydig** at ingen andre punkter oppnår minimumsverdien. Dette utvikler SPD-argumentet fra uke 6 til en test for generelle funksjoner: Hessian må nå undersøkes i **hele området**, ikke bare i ett punkt.

På et konvekst område er ethvert lokalt minimum av en konveks
funksjon også globalt. Hvorfor kan heller ikke et stasjonært punkt
skjule en dårligere dal? For en deriverbar konveks funksjon gjelder
**tangentulikheten**

$$f(y)\ge f(z)+\nabla f(z)^T(y-z).$$

Den lineære modellen ved $z$ ligger altså under funksjonen i alle
tillatte punkter $y$. Ved et stasjonært punkt forsvinner
indreproduktet, så $f(y)\ge f(z)$ overalt: punktet er globalt minimum.
Dette gir et bevis, ikke bare en lokal test. I uke 11 lager vi andre
slike globale grenser når målet og bibetingelsene er lineære.
Et randminimum kan fremdeles ha gradient ulik null. Den **reelle** versjonen av produksjonsområdet er konveks, mens heltallspunktene ikke er det: midtpunktet mellom $(0,0)$ og $(1,0)$ er ikke et tillatt heltallsvalg. **Hvordan påvirker dette hvilken garanti vi kan bruke i produksjonsmodellen?**

<details class="reading-step">
<summary>Gå i dybden: fra linjestykke til globalt minimum</summary>

Anta at $x_*$ er lokalt minimum til en konveks funksjon på en konveks mengde $D$. Hvis et annet punkt $y\in D$ hadde $f(y)<f(x_*)$, ville for hvert $0<t\le1$ punktet $x_t=(1-t)x_*+ty$ ligge i $D$, og konveksitet ville gi $f(x_t)\le(1-t)f(x_*)+tf(y)<f(x_*)$. For tilstrekkelig liten positiv $t$ ligger $x_t$ vilkårlig nær $x_*$, i strid med lokal minimalitet.

For en deriverbar konveks funksjon gjelder tangentulikheten $f(y)\ge f(x)+\nabla f(x)^T(y-x)$. Hvis $\nabla f(x_*)=0$, får vi $f(y)\ge f(x_*)$ for alle $y$ i området. For en kvadratisk funksjon $\phi(z)=\tfrac12 z^TAz-b^Tz$ er Hessian lik $A$ overalt, slik vi så i uke 6. Med positiv definit $A$ er minimumet entydig. På en rand må vi undersøke **tillatte retninger**; gradienten trenger ikke være null.

</details>

## 8.5 Oppgaver og Python-huskeliste

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

<div id="uke8-scipy"></div>

### Huskeliste: NumPy, SciPy og resultatet av et søk

De neste ukene bruker vi samme arbeidsmåte: skriv målfunksjonen som en
Python-funksjon, velg startpunkt eller tillatt område, kjør metoden,
og kontroller svaret. Oppsettet på hver side importerer pakkene;
kodecellene på siden kan kjøres og endres direkte. Kjør dem i rekkefølge.

| Uttrykk i koden | Hva det betyr |
|:--|:--|
| `import numpy as np` | Importer NumPy; `np` er et kort navn vi velger. |
| `from scipy.optimize import minimize` | Hent minimeringsrutinen fra SciPy. |
| `z = np.array([1., 2.])` | En vektor med to flyttall. I beregningene brukes punktum som desimaltegn. |
| `u, v = z` | Gi de to komponentene hvert sitt navn. |
| `A @ z` og `p @ q` | Matrise–vektor-produkt og indreprodukt for arrayer med riktig form. `*` betyr elementvis multiplikasjon. |
| `np.linalg.norm(z)` | Den vanlige lengden $\|z\|_2$. |
| `np.linalg.eigvalsh(H)` | Egenverdiene til en reell symmetrisk matrise. |
| `minimize(f, x0, jac=grad_f, method="BFGS")` | Søk etter et lokalt minimum fra `x0`, med gradientfunksjonen `grad_f`. |
| `result.x`, `result.fun` | Punktet som ble funnet, og funksjonsverdien der. |
| `result.success`, `result.message` | Om metodens egne stoppkrav ble oppfylt, og en forklaring på hvorfor den stoppet. |
| `result.nit`, `result.nfev` | Antall iterasjoner og funksjonsevalueringer. En **iterasjon** er én gjentakelse av metodens oppdatering; én iterasjon kan prøve funksjonen flere ganger. |

`success=True` beviser verken at punktet er et globalt minimum eller
at en feilgrense du selv har valgt, er oppfylt. Sjekk verdien,
tillatte valg og relevante deriverte. Med en matematisk nedre grense
kan vi i tillegg sammenligne verdien med det beste som er mulig.

I [uke 9](uke9.qmd#uke9-start) åpner vi selve søkeprosessen: hvilke
punkter skal vi prøve, og når er forbedringen så liten at vi stopper?
Skill da mellom å **finne en kandidat**, å **kontrollere nødvendige
betingelser** og å **bevise global optimalitet**. Forsøkene i denne
uken viser hvorfor det er tre forskjellige oppgaver.

:::
