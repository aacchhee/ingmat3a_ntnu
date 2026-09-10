::: {.panel-tabset}

## 4.0 Oversikt

### Ukens spørsmål

Hvordan kan ett tall fortelle hvor mye av en vektor som peker i en valgt
retning? Dette spørsmålet leder oss fra indreprodukt og ortogonalitet til
projeksjoner, Gram–Schmidt, QR-faktorisering og minste kvadraters metode.

Vi begynner med piler i planet. Deretter bruker vi nøyaktig den samme ideen
som en mønsterdetektor for $2\times2$-bilder fra uke 3. Til slutt lager vi
ortogonale retninger selv og undersøker hva som skjer når kolonner er
avhengige eller nesten avhengige.

### Piler, bilder og polynomer – samme struktur

Denne uken møter vi ulike objekter: en pil i planet, et bilde og et polynom.
De ser forskjellige ut, men har en felles matematisk struktur: Vi kan legge
dem sammen og gange dem med tall. Derfor kan vi behandle dem som **vektorer**
og bruke de samme ideene om byggesteiner, retninger og koordinater.

Vi beholder ofte det uformelle ordet **«pil»** for å holde fast i denne
intuisjonen. En pil representerer selve objektet – noe med størrelse og
retning – mens koordinatene forteller hvordan vi bygger det i en valgt
basis. For et bilde kan «retning» være et bestemt kontrastmønster; for et
polynom kan det være en bestemt polynomform. Å gange med et tall endrer
mengden av dette mønsteret eller denne formen. Vi trenger ikke kunne tegne
en vanlig pil for å bruke denne tankegangen.

Når vi senere snakker om lengde og vinkel, må vi også velge hvordan de skal
måles. Det er indreproduktet som gir oss denne måleregelen.

### Begreper

- indreprodukt, norm og enhetsvektor
- ortogonale og ortonormale vektorer
- ortogonal projeksjon og residual
- klassisk og modifisert Gram–Schmidt
- QR-faktorisering og minste kvadrater

### Etter denne uken

Du skal kunne bruke et indreprodukt som en retningsmåler, forklare hvorfor
$x^Tq=0$ betyr at $x$ og $q$ er ortogonale, og konstruere en ortonormal basis
med Gram–Schmidt. Du skal også kunne diagnostisere eksakt og nesten lineær
avhengighet, sammenligne klassisk og modifisert Gram–Schmidt og tolke en
minste-kvadraters løsning som en ortogonal oppdeling av dataene.

### Kort løype

I forelesningen følger vi hovedløypa:

1. [dra den blå retningsmåleren](#uke4-retning) og oppdag fortegn og null;
2. [finn regneregelen $x^Tq$](#uke4-regneregel);
3. [bruk regelen til å oppdage bildemønstre](#uke4-monster);
4. [fjern én retning](#uke4-projeksjon) og
   [bygg Gram–Schmidt](#uke4-gs);
5. [se algoritmen møte avhengige kolonner](#uke4-avhengighet);
6. [sammenlign klassisk og modifisert Gram–Schmidt](#uke4-mgs);
7. [bruk $A=QR$ til minste kvadrater](#uke4-mk).

De merkede fordypningene gir flere forklaringer og eksperimenter for
selvstudium.

### Slik bruker du siden

JSXGraph-figurene brukes til å dra, se og lage hypoteser. Pyodide-cellene
gjentar forsøkene med tall og lar oss teste mange tilfeller. Figurene og
Python-cellene deler ikke variabler; derfor står nødvendige tall og matriser
på nytt ved hvert forsøk.

Alle vektorer skrives som kolonner på papir. I NumPy lagres den samme vektoren
som en endimensjonal array. Dermed svarer `x @ q` til matriseproduktet $x^Tq$.

::: {.callout-note collapse="true"}
### Oppslagsverk etter utforskningen: notasjon og NumPy

For $x,q\in\mathbb R^m$ bruker vi

$$x^Tq=\sum_{i=1}^m x_iq_i,
\qquad \lVert x\rVert_2=\sqrt{x^Tx}.$$

| På papir | NumPy | Betydning |
|---|---|---|
| $x^Tq$ | `x @ q` | indreprodukt, ett tall |
| $Ax$ | `A @ x` | matrise ganger vektor |
| $A^T$ | `A.T` | transponert matrise |
| $\lVert x\rVert_2$ | `np.linalg.norm(x)` | euklidsk vektornorm |
| $\lVert A\rVert_F$ | `np.linalg.norm(A)` | Frobeniusnorm for en matrise |
| $\lVert A\rVert_2$ | `np.linalg.norm(A, 2)` | spektral matrisenorm |

Når vi skriver et $2\times2$-bilde som en vektor, leser vi radene fra venstre
mot høyre. Denne rekkefølgen er den samme som `X.reshape(-1)`.
:::

```{pyodide-python}
#| label: week4-setup
#| autorun: true
#| context: setup
import numpy as np
import matplotlib.pyplot as plt
```

## 4.1 Retning og indreprodukt

### Hvor mye går vi i en valgt retning? {#uke4-retning}

Vi starter med forskyvningen

$$x=\begin{bmatrix}3\\2\end{bmatrix}.$$

Det er lett å lese at vi går $3$ enheter mot høyre og $2$ enheter opp. Men
hvor mye går vi i en skrå retning?

Før vi velger målepil, trenger vi å vite hva lengden til en pil er.
For $x=(3,2)^T$ gir Pytagoras

$$\text{lengden til }x=\sqrt{3^2+2^2}=\sqrt{13}.$$

Denne lengden kalles den **euklidske normen** og skrives $\lVert x\rVert_2$.
For en pil $v=(v_1,v_2)^T$ betyr notasjonen altså

$$\lVert v\rVert_2=\sqrt{v_1^2+v_2^2}.$$

Normen er ett ikke-negativt tall. Dette er samme lengdebegrep som i uke 3.

Prøv nå pilene $(1,0)^T$ og $(0,1)^T$: Begge har lengde $1$.
En slik pil kalles en **enhetsvektor**. Vi velger en enhetsvektor $q$ som
målepil, slik at størrelsen på målepilen er den samme når vi skifter
retning. Når vi framhever denne rollen, bruker vi også ordet
**enhetsretning**.

Alle piler med lengde $1$ som starter i origo, ender på en sirkel med
radius $1$: **enhetssirkelen**. Dra punktet $q$ rundt sirkelen i figuren.
Den tynne blå hjelpelinjen viser retningen til $q$. Følg den stiplede
linjen fra enden av $x$ vinkelrett bort til hjelpelinjen.
Treffpunktet er merket $P$.

Hvor langt ligger $P$ fra origo, målt langs $q$? Vi kaller dette tallet
**komponenten av $x$ langs $q$**, og skriver det som $c$. Tallet har fortegn:
positivt i samme retning som $q$, negativt i motsatt retning. Mot høyre
får vi $c=3$; oppover får vi $c=2$. Her er komponenten ett tall; senere
bruker vi tallet til å bygge en pil.

Den oransje buen viser vinkelen $\theta$ fra positiv vannrett akse til $q$,
målt mot klokken fra $0^\circ$ til $360^\circ$. Denne vinkelen bruker vi
snart til å finne regneregelen.

```{.jsxgraph width="620" height="440"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-1.7, 3.8, 4.5, -1.8], axis: true,
  showCopyright: false, showNavigation: false, keepaspectratio: true
});
var O = board.create('point', [0, 0], {visible: false, fixed: true});
var X = board.create('point', [3, 2], {
  name: 'x=(3,2)', fixed: true, color: '#222222', size: 3
});
board.create('arrow', [O, X], {strokeColor: '#222222', strokeWidth: 1.5, lastArrow: {type: 2, size: 4}});
var circle = board.create('circle', [O, 1], {
  strokeColor: '#8fa8c7', dash: 2, fixed: true
});
var Q = board.create('glider', [1, 0, circle], {
  name: 'q', color: '#1565c0', size: 3
});
board.create('arrow', [O, Q], {strokeColor: '#1565c0', strokeWidth: 1.5, lastArrow: {type: 2, size: 4}});
var component = function () { return 3*Q.X() + 2*Q.Y(); };
var P = board.create('point', [
  function () { return component()*Q.X(); },
  function () { return component()*Q.Y(); }
], {name: 'P', color: '#1565c0', size: 3});
board.create('line', [O, Q], {
  straightFirst: true, straightLast: true,
  strokeColor: '#1565c0', strokeWidth: 1
});
board.create('segment', [X, P], {
  strokeColor: '#777777', dash: 2, strokeWidth: 1
});
board.create('text', [-1.4, 3.5, function () {
  return 'q = (' + Q.X().toFixed(2) + ', ' + Q.Y().toFixed(2) + ')';
}], {fontSize: 15, color: '#1565c0'});
board.create('text', [-1.4, 3.15, function () {
  return 'c = ' + component().toFixed(3);
}], {fontSize: 15, color: '#1565c0'});
board.create('button', [-1.4, -1.5, 'høyre', function () {
  Q.moveTo([1, 0]);
}]);
board.create('button', [-0.3, -1.5, 'opp', function () {
  Q.moveTo([0, 1]);
}]);
board.create('button', [0.6, -1.5, 'langs x', function () {
  Q.moveTo([3/Math.sqrt(13), 2/Math.sqrt(13)]);
}]);
board.create('button', [1.9, -1.5, 'vinkelrett', function () {
  Q.moveTo([-2/Math.sqrt(13), 3/Math.sqrt(13)]);
}]);
board.create('button', [3.3, -1.5, 'motsatt', function () {
  Q.moveTo([-3/Math.sqrt(13), -2/Math.sqrt(13)]);
}]);
var theta = function () {
  var angle = Math.atan2(Q.Y(), Q.X());
  return angle < 0 ? angle + 2*Math.PI : angle;
};
board.create('curve', [
  function (t) { return 0.55*Math.cos(t); },
  function (t) { return 0.55*Math.sin(t); },
  0, theta
], {strokeColor: '#b45309', strokeWidth: 1.5});
board.create('text', [
  function () { return 0.72*Math.cos(theta()/2); },
  function () { return 0.72*Math.sin(theta()/2); },
  'θ'
], {fontSize: 16, color: '#b45309', fixed: true});
board.create('text', [1.5, 3.5, function () {
  return 'θ = ' + (theta()*180/Math.PI).toFixed(1) + '°';
}], {fontSize: 15, color: '#b45309'});

```

Prøv dette før du leser videre:

1. Sett $q$ mot høyre. Hvorfor blir komponenten $3$?
2. Sett $q$ oppover. Hvorfor blir den $2$?
3. Finn retningen som gir størst positiv komponent.
4. Finn en retning som gir komponent $0$ uten at $x$ er null.
5. Snu $q$ motsatt vei. Hva skjer med fortegnet?

### Finn regneregelen {#uke4-regneregel}

Skriv enhetsretningen som vektoren

$$q=\begin{bmatrix}q_1\\q_2\end{bmatrix},\qquad q_1^2+q_2^2=1.$$

Likningen til høyre er lengdekravet fra starten av fanen:
$\lVert q\rVert_2=\sqrt{q_1^2+q_2^2}=1$.

#### Hvor mye bidrar et vannrett og et loddrett skritt?

La $\theta$ være vinkelen fra den positive vannrette aksen til den blå
målepilen. På enhetssirkelen har pilen koordinatene

$$q=\begin{bmatrix}\cos\theta\\\sin\theta\end{bmatrix}.$$

Dette er den vanlige trekantregelen: cosinus gir vannrett komponent og
sinus gir loddrett komponent når hypotenusen har lengde én.

Se først på en skrå retning mellom høyre og opp. Vi deler turen i to
etapper og spør om hver av dem: **Hvor mye av denne bevegelsen går i
retningen $q$?**

**Første etappe: tre enheter mot høyre.** Tegn først bare ett vannrett
skritt fra origo. Fra endepunktet trekker vi en linje vinkelrett mot
retningen $q$, på samme måte som den stiplede linjen i figuren.
Vi får en rettvinklet trekant: Skrittet er hypotenusen med lengde $1$,
og siden langs $q$ ligger inntil vinkelen $\theta$. Derfor er

$$\cos\theta
=\frac{\text{delen langs }q}{1},
\qquad \text{delen langs }q=\cos\theta.$$

Tre slike skritt gir tre ganger dette bidraget: $3\cos\theta$.

**Andre etappe: to enheter opp.** Et loddrett skritt danner vinkelen
$90^\circ-\theta$ med $q$. Den samme trekantberegningen gir
$\cos(90^\circ-\theta)=\sin\theta$ i retningen $q$ per skritt.
To skritt gir derfor $2\sin\theta$.

**Hele turen.** Den andre etappen begynner der den første slutter.
I hver etappe kan vi skille mellom bevegelse langs $q$ og bevegelse på
tvers av $q$. Delene på tvers gir ingen framgang i retningen $q$.
Dermed er den samlede komponenten summen av bidragene langs $q$:

$$c=
\underbrace{3\cos\theta}_{\text{fra turen mot høyre}}
+\underbrace{2\sin\theta}_{\text{fra turen opp}}.$$

Prøv $\theta=0^\circ$, $90^\circ$ og $45^\circ$ i figuren. Vi får
henholdsvis $3$, $2$ og $5/\sqrt2\approx3.54$. Når målepilen dreies videre,
gir fortegnene til cosinus og sinus automatisk negative bidrag der
bevegelsen går mot måleretningen.

Siden $q_1=\cos\theta$ og $q_2=\sin\theta$, er dette nettopp
$3q_1+2q_2$. Den generelle regelen nedenfor er den samme oppskriften for
$x_1$ vannrette og $x_2$ loddrette skritt.

Prøv de to etappene hver for seg. Koden skriver dem ut før summen.
Endre retningen og forutsi fortegnene først.

```{pyodide-python}
#| label: week4-direction-contributions
import numpy as np
theta_degrees = 45.0  # Prøv også 0, 90, 135 og 180 grader.
theta = np.deg2rad(theta_degrees)  # NumPys cos og sin bruker radianer.
q = np.array([np.cos(theta), np.sin(theta)])
horizontal = 3*q[0]
vertical = 2*q[1]
print("Tre skritt mot høyre bidrar:", horizontal)
print("To skritt opp bidrar:", vertical)
print("Til sammen:", horizontal+vertical)
```

For en tur med $x_1$ vannrette og $x_2$ loddrette skritt får vi derfor:

$$\boxed{x^Tq=x_1q_1+x_2q_2.}$$

For $x=(3,2)^T$ blir komponenten $3q_1+2q_2$. Uttrykket $x^Tq$ kalles
**indreproduktet** mellom $x$ og $q$. Symbolet $T$ betyr transponering: Den
stående kolonnevektoren $x$ vendes til en rad, slik at matriseproduktet
$x^Tq$ blir ett tall.

::: {.callout-important}
#### Retningsmåleren

Når $q$ er en enhetsvektor, er $x^Tq$ et tall som forteller hvor mye av
$x$ som peker i den valgte retningen $q$.
:::

```{pyodide-python}
#| label: week4-direction-readings
x = np.array([3.0, 2.0])
directions = {
    "høyre": np.array([1.0, 0.0]),
    "opp": np.array([0.0, 1.0]),
    "diagonal": np.array([1.0, 1.0]) / np.sqrt(2),
    "motsatt høyre": np.array([-1.0, 0.0]),
}
for name, q in directions.items():
    print(f"{name:16s}: x^T q = {x @ q: .4f}")
```

Legg til en retning som står vinkelrett på $x$, og kontroller at komponenten
er null. Endre bare én retning om gangen. I [delen om ortogonalitet](#uke4-ortogonalitet) gir vi «vinkelrett» et
matematisk navn og en test.

### Lag en målepil fra en vilkårlig retning {#uke4-enhetsretning}

Hvordan lager vi en enhetsvektor som peker samme vei som $v=(3,4)^T$?
Lengden er $\sqrt{3^2+4^2}=5$. Vi deler derfor begge koordinatene på $5$:

$$q=\begin{bmatrix}3/5\\4/5\end{bmatrix},\qquad
\lVert q\rVert_2=\sqrt{\frac9{25}+\frac{16}{25}}=1.$$

Pilen er blitt kortere, men peker samme vei. Å dele en ikke-null vektor
på lengden kalles å **normalisere**. Generelt skriver vi

$$q=\frac{v}{\lVert v\rVert_2},\qquad v\ne0.$$

Nå som vi kjenner indreproduktet, kan vi også skrive lengden på en annen måte:
$v^Tv=v_1^2+v_2^2$, så $\lVert v\rVert_2=\sqrt{v^Tv}$.
Dette er den samme Pytagoras-regelen i kortere notasjon.

#### Et første sammenbrudd

Hva skjer hvis vi prøver å finne retningen til nullvektoren?

```{pyodide-python}
#| label: week4-normalize-zero
with np.errstate(divide="warn", invalid="warn"):
    for v in [np.array([3.0, 4.0]), np.array([0.0, 0.0])]:
        length = np.linalg.norm(v)
        q = v / length
        print("v =", v, "  ||v||_2 =", length, "  v/||v||_2 =", q)
        print("endelige tall?", np.isfinite(q).all())
```

Nullvektoren har ingen retning. Regningen forsøker å dele $0$ på $0$, og
i flyttallsregningen blir resultatet `NaN` («not a number»). Det er maskinens
markering av at regningen ikke ga et gyldig tall. En algoritme må kontrollere
lengden før den normaliserer.

### Hva om vi bruker målepilen uten å normalisere?

Til nå har $q$ hatt lengde én. Det er derfor tallet $x^Tq$ har kunnet
tolkes direkte som komponenten av $x$ langs $q$. Men selve regningen
«gang sammen tilsvarende koordinater og legg sammen» kan vi også utføre
med en lengre eller kortere pil.

Prøv først med $x=(3,2)^T$, $q=(1,0)^T$ og $v=2q=(2,0)^T$:

$$x^Tq=3\cdot1+2\cdot0=3,$$
$$x^Tv=3\cdot2+2\cdot0=6=2(x^Tq).$$

Begge målepiler peker mot høyre. Komponenten av $x$ mot høyre er fortsatt
$3$, men dobling av målepilen dobler resultatet av regningen. Prøv også
$v=q/2$: Resultatet blir $3/2$. Vi må altså skille mellom **regneregelen**
og **tolkningen som en komponent**.

For to vilkårlige vektorer i planet bruker vi den samme regneregelen:

$$\boxed{x^Tv=x_1v_1+x_2v_2.}$$

Dette kalles fortsatt indreproduktet, også når ingen av vektorene har
lengde én. Hva må vi gjøre for å få komponenten langs $v$ tilbake?

Bruk nå normaliseringen vi nettopp fant: $q=v/\lVert v\rVert_2$.
Da har $q$ lengde én og peker samme vei som $v$.

Lengden $\lVert v\rVert_2$ er **ett positivt tall**. For å bygge $v$ tilbake
ganger vi hver koordinat i $q$ med dette tallet:

$$v_1=\lVert v\rVert_2\cdot q_1,\qquad
v_2=\lVert v\rVert_2\cdot q_2.$$

Sett dette inn i indreproduktet:

$$\begin{aligned}
x^Tv
&=x_1v_1+x_2v_2\\
&=x_1\bigl(\lVert v\rVert_2\cdot q_1\bigr)
 +x_2\bigl(\lVert v\rVert_2\cdot q_2\bigr)\\
&=\lVert v\rVert_2\cdot(x_1q_1+x_2q_2)\\
&=\lVert v\rVert_2\cdot(x^Tq).
\end{aligned}$$

I tredje linje trekker vi det samme tallet $\lVert v\rVert_2$ utenfor
begge leddene.

Dermed er

$$\underbrace{x^Tv}_{\text{indreprodukt}}
=\underbrace{\lVert v\rVert_2}_{\text{målepilens lengde}}
\;\underbrace{x^Tq}_{\text{komponenten langs }v}.$$

For å finne komponenten deler vi derfor $x^Tv$ på $\lVert v\rVert_2$.
Når lengden allerede er én, er dette akkurat regelen fra figuren.

**Ta med til neste fane:** En positiv lengdefaktor kan endre størrelsen
på resultatet, men kan ikke gjøre et nullresultat forskjellig fra null.
For $v\ne0$ har vi derfor

$$x^Tv=0\quad\Longleftrightarrow\quad x^T\frac{v}{\lVert v\rVert_2}=0.$$

Vi kan altså teste om en pil står på tvers av en annen uten først å gjøre
målepilen til en enhetsvektor. Nullvektoren gir også indreprodukt null,
men har ingen retning.

## 4.2 Ortogonalitet og projeksjon

I 4.1 fant vi hvor mye av en pil som går i en valgt retning. Nå følger vi
ett spørsmål videre: **Kan vi skille ut én del av et objekt uten å blande
inn de andre delene?** Først ser vi hva null komponent betyr. Deretter
prøver vi samme idé på bilder, og til slutt bygger vi opp den delen vi
har målt og undersøker hva som blir igjen.

### Null komponent betyr ortogonalitet {#uke4-ortogonalitet}

Trykk «vinkelrett» i [retningsmåleren](#uke4-retning). Pilen $x=(3,2)^T$ er fortsatt like
lang, men komponenten er null. Drei målepilen litt til hver side: fortegnet
skifter. Hele bevegelsen går på tvers av måleretningen akkurat ved null.

Prøv nå på papir med $v=(-2,3)^T$:

$$x^Tv=3(-2)+2(3)=-6+6=0.$$

Bidragene opphever hverandre. Del $v$ på $\sqrt{13}$ for å få lengde én;
indreproduktet forblir null, slik skaleringen i forrige fane forklarte.
Vi gir nå denne observerte egenskapen et navn.

To vektorer $x$ og $q$ er **ortogonale** når

$$\boxed{x^Tq=0.}$$

Det betyr ikke at en av vektorene er null. Det betyr at retningsmåleren $q$
ikke finner noen del av $x$ i sin retning. For

$$x=\begin{bmatrix}3\\2\end{bmatrix}$$

er for eksempel

$$v=\begin{bmatrix}-2\\3\end{bmatrix}$$

ortogonal på $x$, fordi $x^Tv=3(-2)+2(3)=0$.

Prøv to målepiler: $(1,0)^T$ og $(0,1)^T$. Begge har lengde én. Hver leser
seg selv som $1$, men den andre som $0$. Dermed måler de vannrett og loddrett
bevegelse hver for seg. Vi kaller en slik samling **ortonormal**: pilene har
lengde én og er parvis ortogonale.

Vi trenger snart flere måleretninger samtidig. Da vil vi kontrollere både
at hver pil har lengde én, og at ulike piler ikke måler hverandres bidrag.
En tabell lar oss holde orden på alle disse kontrollene.

#### Fra enkeltpiler til en tabell med alle testene

La oss først pakke de to pilene vi nettopp prøvde, inn i en matrise.
Vi setter dem **ved siden av hverandre som kolonner**, uten å endre dem.

Fargene følger rollen i produktet: **blått er kolonner fra $Q$**, og
**oransje er rader fra $Q^T$**. Det er de samme tallene før og etter
transponering; fargen viser hvilken faktor vi henter dem fra.

$$\textcolor{#1565c0}{q_1=\begin{bmatrix}1\\0\end{bmatrix}},\qquad
\textcolor{#1565c0}{q_2=\begin{bmatrix}0\\1\end{bmatrix}}.$$

$$\textcolor{#1565c0}{Q}=\textcolor{#1565c0}{\begin{bmatrix}|&|\\q_1&q_2\\|&|\end{bmatrix}}=\textcolor{#1565c0}{\begin{bmatrix}1&0\\0&1\end{bmatrix}}.$$

Når vi transponerer, blir de samme kolonnene til rader:

$$\textcolor{#b45309}{Q^T}=\textcolor{#b45309}{\begin{bmatrix}\text{— }q_1^T\text{ —}\\\text{— }q_2^T\text{ —}\end{bmatrix}}=\textcolor{#b45309}{\begin{bmatrix}1&0\\0&1\end{bmatrix}}.$$

Nå setter vi **begge stablene inn i selve produktet**:

$$\begin{aligned}
\textcolor{#b45309}{Q^T}\textcolor{#1565c0}{Q}
&=\underbrace{\textcolor{#b45309}{\begin{bmatrix}\text{— }q_1^T\text{ —}\\\text{— }q_2^T\text{ —}\end{bmatrix}}}_{\text{rader fra }Q^T}
\underbrace{\textcolor{#1565c0}{\begin{bmatrix}|&|\\q_1&q_2\\|&|\end{bmatrix}}}_{\text{kolonner fra }Q}\\[6pt]
&=\begin{bmatrix}
\textcolor{#b45309}{q_1^T}\textcolor{#1565c0}{q_1}&\textcolor{#b45309}{q_1^T}\textcolor{#1565c0}{q_2}\\
\textcolor{#b45309}{q_2^T}\textcolor{#1565c0}{q_1}&\textcolor{#b45309}{q_2^T}\textcolor{#1565c0}{q_2}
\end{bmatrix}.
\end{aligned}$$

Hver oppføring kommer fra én oransje rad og én blå kolonne.
For eksempel bruker oppføringen øverst til høyre **rad 1 fra $Q^T$**
og **kolonne 2 fra $Q$**:

$$\textcolor{#b45309}{q_1^T}\textcolor{#1565c0}{q_2}
=\textcolor{#b45309}{\begin{bmatrix}1&0\end{bmatrix}}
\textcolor{#1565c0}{\begin{bmatrix}0\\1\end{bmatrix}}
=\textcolor{#b45309}{1}\cdot\textcolor{#1565c0}{0}+\textcolor{#b45309}{0}\cdot\textcolor{#1565c0}{1}=0.$$

Vi gjør det samme i alle fire oppføringene. Fargen følger hvert tall
helt fram til multiplikasjonen:

$$\begin{aligned}
\textcolor{#b45309}{Q^T}\textcolor{#1565c0}{Q}
&=\begin{bmatrix}
\textcolor{#b45309}{1}\cdot\textcolor{#1565c0}{1}+\textcolor{#b45309}{0}\cdot\textcolor{#1565c0}{0}&\textcolor{#b45309}{1}\cdot\textcolor{#1565c0}{0}+\textcolor{#b45309}{0}\cdot\textcolor{#1565c0}{1}\\
\textcolor{#b45309}{0}\cdot\textcolor{#1565c0}{1}+\textcolor{#b45309}{1}\cdot\textcolor{#1565c0}{0}&\textcolor{#b45309}{0}\cdot\textcolor{#1565c0}{0}+\textcolor{#b45309}{1}\cdot\textcolor{#1565c0}{1}
\end{bmatrix}\\[4pt]
&=\begin{bmatrix}1&0\\0&1\end{bmatrix}.
\end{aligned}$$

Resultatene skrives uten farge fordi hvert resultat kommer fra **begge**
faktorene. På diagonalen måler hver pil seg selv:
$\textcolor{#b45309}{q_i^T}\textcolor{#1565c0}{q_i}=\lVert q_i\rVert_2^2=1$.
Utenfor diagonalen måler vi to forskjellige piler: De står vinkelrett på
hverandre, så resultatet er $0$.

#### Samme pakking med flere piler

Hvis vi har $k$ ortonormale piler i $\mathbb R^m$, setter vi igjen pilene
som kolonner og de transponerte pilene som rader. Blått viser kolonnene
fra $Q$; oransje viser radene fra $Q^T$:

$$\textcolor{#1565c0}{Q}=\textcolor{#1565c0}{\begin{bmatrix}|&|&&|\\q_1&q_2&\cdots&q_k\\|&|&&|\end{bmatrix}}
\quad(m\times k),$$

$$\textcolor{#b45309}{Q^T}=\textcolor{#b45309}{\begin{bmatrix}
\text{— }q_1^T\text{ —}\\
\text{— }q_2^T\text{ —}\\
\vdots\\
\text{— }q_k^T\text{ —}
\end{bmatrix}}
\quad(k\times m).$$

De vannrette strekene framhever at hvert $q_i^T$ er en hel rad.
De loddrette strekene framhever at hvert $q_j$ er en hel kolonne.

Nå følger vi hele produktet i én kjede. Rad $i$ fra venstre faktor
møter kolonne $j$ fra høyre faktor:

$$\begin{aligned}
\textcolor{#b45309}{Q^T}\textcolor{#1565c0}{Q}
&=\underbrace{\textcolor{#b45309}{\begin{bmatrix}
\text{— }q_1^T\text{ —}\\
\text{— }q_2^T\text{ —}\\
\vdots\\
\text{— }q_k^T\text{ —}
\end{bmatrix}}}_{\text{rader fra }Q^T}
\underbrace{\textcolor{#1565c0}{\begin{bmatrix}|&|&&|\\q_1&q_2&\cdots&q_k\\|&|&&|\end{bmatrix}}}_{\text{kolonner fra }Q}\\[8pt]
&=\begin{bmatrix}
\textcolor{#b45309}{q_1^T}\textcolor{#1565c0}{q_1}&\textcolor{#b45309}{q_1^T}\textcolor{#1565c0}{q_2}&\cdots&\textcolor{#b45309}{q_1^T}\textcolor{#1565c0}{q_k}\\
\textcolor{#b45309}{q_2^T}\textcolor{#1565c0}{q_1}&\textcolor{#b45309}{q_2^T}\textcolor{#1565c0}{q_2}&\cdots&\textcolor{#b45309}{q_2^T}\textcolor{#1565c0}{q_k}\\
\vdots&\vdots&\ddots&\vdots\\
\textcolor{#b45309}{q_k^T}\textcolor{#1565c0}{q_1}&\textcolor{#b45309}{q_k^T}\textcolor{#1565c0}{q_2}&\cdots&\textcolor{#b45309}{q_k^T}\textcolor{#1565c0}{q_k}
\end{bmatrix}.
\end{aligned}$$

Oppføringen i rad $i$, kolonne $j$ er altså
$\textcolor{#b45309}{q_i^T}\textcolor{#1565c0}{q_j}$. Hver oppføring er ett tall, selv om faktorene
som gir tallet, er en hel rad og en hel kolonne.

Først bruker vi at ulike piler er ortogonale. Så bruker vi at hver pil
har lengde én:

$$\textcolor{#b45309}{Q^T}\textcolor{#1565c0}{Q}=
\begin{bmatrix}
\lVert q_1\rVert_2^2&0&\cdots&0\\
0&\lVert q_2\rVert_2^2&\cdots&0\\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&\lVert q_k\rVert_2^2
\end{bmatrix}
=
\begin{bmatrix}
1&0&\cdots&0\\
0&1&\cdots&0\\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&1
\end{bmatrix}.$$

Matrisen helt til høyre har et navn: **identitetsmatrisen** $I_k$.
Den har $k$ rader og $k$ kolonner, ettall på diagonalen og nuller ellers.
Nå kan vi forkorte hele kjeden til

$$\boxed{\textcolor{#b45309}{Q^T}\textcolor{#1565c0}{Q}=I_k.}$$

Dette er de samme enkelttestene pakket sammen: Diagonalen kontrollerer
lengdene, og resten kontrollerer ortogonaliteten. Selve $Q$ trenger
ikke være en identitetsmatrise; det er **tabellen over indreproduktene**
som blir $I_k$ når kolonnene er ortonormale.

### Fra retningsmåler til mønsterdetektor {#uke4-monster}

Tenk på et bilde som er lyst til venstre og mørkt til høyre. Vi ønsker ett
tall som øker når denne forskjellen blir sterkere, blir null for et jevnt
bilde og skifter fortegn når lys og mørke bytter plass. Vi skal prøve om
indreproduktet kan gjøre dette. Ordet **detektor** betyr her bare en
regneoppskrift som måler mengden av ett bestemt mønster.

#### Se mønstrene først

Her er fire små bilder fra uke 3. Hvert bilde har fire piksler. Lyst betyr
$+1/2$, og mørkt betyr $-1/2$. Dette er **fortegnede mønsterverdier**:
minus betyr et mørkt bidrag i forhold til et referansenivå.

![Fire mønstre: jevnt nivå, venstre–høyre-kontrast, oppe–nede-kontrast og diagonal. Hver piksel er merket med verdi og plass i leserekkefølgen.](/images/week4-patterns.svg){width=760}

Se på H: Hva skjer med forskjellen mellom venstre og høyre side hvis
mønsteret dobles? Hva skjer hvis vi bytter fortegn? Se deretter på M:
Kan et jevnt lyst bilde gi noen forskjell mellom venstre og høyre?

#### Fra fire piksler til én vektor

Vi bruker de samme fire pikselfargene som i uke 3, i samme rekkefølge:

| Plass i bildet | Nummer og farge |
|---|---|
| Øverst til venstre | $\textcolor{#277da1}{1\text{ — blå}}$ |
| Øverst til høyre | $\textcolor{#d98900}{2\text{ — oransje}}$ |
| Nederst til venstre | $\textcolor{#4f8f49}{3\text{ — grønn}}$ |
| Nederst til høyre | $\textcolor{#8b5aa7}{4\text{ — lilla}}$ |

De fargede numrene i bildene viser hvilken piksel som blir hvilken
koordinat. **Fargen følger plassen**, mens fortegnet og tallet angir
pikselverdien. For H leser vi

$$\textcolor{#277da1}{+\tfrac12},\quad \textcolor{#d98900}{-\tfrac12},\quad
\textcolor{#4f8f49}{+\tfrac12},\quad \textcolor{#8b5aa7}{-\tfrac12}
\quad\longrightarrow\quad
\vec h=\begin{bmatrix}
\textcolor{#277da1}{1/2}\\\textcolor{#d98900}{-1/2}\\\textcolor{#4f8f49}{1/2}\\\textcolor{#8b5aa7}{-1/2}
\end{bmatrix}.$$

Vi har beholdt alle pikselverdiene; vi har bare skrevet dem som én kolonne.
Pilen over $\vec h$ sier at symbolet står for **hele vektoren**.

Vi bruker denne notasjonen i bildedelen:

| Notasjon | Hva er det? |
|---|---|
| $x_1,x_2,x_3,x_4$ | fire enkeltverdier, altså tall |
| $\vec x=(x_1,x_2,x_3,x_4)^T$ | hele bildevektoren |
| $\vec m,\vec h,\vec v,\vec d$ | fire mønstervektorer, hver med fire tall |
| $2,-1,1/2$ | koeffisienter som skalerer hele mønstre |
| $M,H,V,D,X$ i koden | pikselverdiene ordnet som $2\times2$-bilder |

For eksempel er $h_2=-1/2$ ett tall, mens $\vec h$ inneholder alle fire.
Vi bruker $x_1,\ldots,x_4$ fremfor $a,b,c,d$ for pikselverdiene, så
bokstaven $d$ ikke får to forskjellige roller.

Les de tre andre bildene i samme rekkefølge. Da får vi

$$\vec m=\frac12\begin{bmatrix}1\\1\\1\\1\end{bmatrix},\qquad
\vec h=\frac12\begin{bmatrix}1\\-1\\1\\-1\end{bmatrix},$$
$$\vec v=\frac12\begin{bmatrix}1\\1\\-1\\-1\end{bmatrix},\qquad
\vec d=\frac12\begin{bmatrix}1\\-1\\-1\\1\end{bmatrix}.$$

Nå kan vi kontrollere lengden. Hver av de fire vektorene har

$$\sqrt{(1/2)^2+(1/2)^2+(1/2)^2+(1/2)^2}=\sqrt1=1.$$

Det er derfor vi valgte størrelsen $1/2$: Mønstrene kan brukes som
enhetsretninger, akkurat som målepilen tidligere.

#### Hvorfor kan et mønster være en retning?

For en vanlig pil sier «samme retning» at vi kan få den ene ved å gange
den andre med et positivt tall. Prøv den samme handlingen på H-bildet:
Når vi dobler alle fire pikselverdiene, beholder vi kontrastmønsteret,
men gjør kontrasten dobbelt så sterk. Vi har beveget oss lenger i samme
**mønsterretning**. Et negativt tall bytter om lyst og mørkt.

Alle bildevektorer av formen $\vec y=t\vec h$, der $t$ er et tall, ligger
derfor langs én retning i rommet av bildevektorer. Dette er ikke en retning
vi beveger oss i på skjermen. Det er en bestemt måte å **endre alle fire
pikselverdiene sammen** på.

I planet har pilen to koordinater. Her har bildevektoren fire koordinater,
én per pikselplass. Vi kan fortsatt gange med tall og legge sammen
koordinat for koordinat. Det er disse handlingene som gjør det mulig å
bruke samme vektoridé på begge objektene. Vi trenger ikke tegne fire
romlige akser for å undersøke regningen.

#### Et kontrollforsøk: finner vi venstre–høyre-kontrasten?

**Gitt:** Vi kjenner enhetsmønsteret $\vec h$ og tre enkle bilder.
**Målet:** Undersøke om indreproduktet gir null for et jevnt bilde,
positivt resultat for H-kontrast og negativt resultat når kontrasten snus.
Dette er et gjennomregnet eksempel.

![Tre kontrollbilder og blandingen som brukes videre. Pikselverdier og H-måling vises under samme gråskala.](/images/week4-pattern-experiment.svg){width=800}

Vi begynner med de tre kontrollbildene til venstre; blandingen til høyre
kommer i neste trinn.

Et jevnt bilde har bildevektor $\vec y=(1,1,1,1)^T$. Bruk H-mønsteret:
Gang sammen verdiene på samme pikselplass og legg sammen.

$$\vec h^{\,T}\vec y
=\tfrac12\cdot1-\tfrac12\cdot1+\tfrac12\cdot1-\tfrac12\cdot1=0.$$

Venstre og høyre side opphever hverandre. Prøv så et bilde som inneholder
tre ganger H-mønsteret:

$$\vec y=3\vec h
=\begin{bmatrix}3/2\\-3/2\\3/2\\-3/2\end{bmatrix},$$
$$\vec h^{\,T}\vec y
=\tfrac34+\tfrac34+\tfrac34+\tfrac34=3.$$

Med $\vec y=-3\vec h$ blir resultatet $-3$. Ett tall måler altså mengden
av dette mønsteret, med fortegn. Det er dette vi mener med en **detektor**.

Vi har brukt samme oppskrift som for to koordinater, bare med fire ledd:

$$\vec h^{\,T}\vec y=h_1y_1+h_2y_2+h_3y_3+h_4y_4.$$

Hver faktor $h_i$ eller $y_i$ er et tall; hele uttrykket gir også ett tall.
Generelt bruker vi for vektorer med $n$ komponenter

$$\boxed{\vec y^{\,T}\vec z=y_1z_1+\cdots+y_nz_n.}$$

#### Neste forsøk: finner vi igjen ingrediensene i en blanding?

Kontrollforsøket viste hva H-målingen gjør med rene bilder. Nå vil vi vite
om den fortsatt finner riktig mengde når flere mønstre er til stede.

**Gitt:** De fire mønstervektorene og oppskriften nedenfor.
**Målet:** Finne igjen koeffisientene fra pikselverdiene alene. Vi kjenner
oppskriften på forhånd slik at vi kan kontrollere svaret.

Bildet til høyre i figuren er denne blandingen:

$$\vec x=
\underbrace{2}_{\text{tall}}\underbrace{\vec m}_{\text{vektor}}
-\underbrace{1}_{\text{tall}}\underbrace{\vec h}_{\text{vektor}}
+\underbrace{\tfrac12}_{\text{tall}}\underbrace{\vec v}_{\text{vektor}}.$$

Regn piksel for piksel:

$$\vec x=
\begin{bmatrix}1\\1\\1\\1\end{bmatrix}
+\begin{bmatrix}-1/2\\1/2\\-1/2\\1/2\end{bmatrix}
+\begin{bmatrix}1/4\\1/4\\-1/4\\-1/4\end{bmatrix}
=\begin{bmatrix}3/4\\7/4\\1/4\\5/4\end{bmatrix}.$$

H-målingen blir

$$\vec h^{\,T}\vec x
=\tfrac12(\tfrac34-\tfrac74+\tfrac14-\tfrac54)=-1.$$

Vi regner de tre andre målingene på samme måte:

$\vec m^{\,T}\vec x
=\tfrac12(\tfrac34+\tfrac74+\tfrac14+\tfrac54)
=\tfrac12\cdot4=2,$

$\vec v^{\,T}\vec x
=\tfrac12(\tfrac34+\tfrac74-\tfrac14-\tfrac54)
=\tfrac12\cdot1=\tfrac12,$

$\vec d^{\,T}\vec x
=\tfrac12(\tfrac34-\tfrac74-\tfrac14+\tfrac54)=0.$

Vi fikk tilbake $2,-1,1/2,0$: akkurat mengdene i oppskriften. Det siste
nullresultatet sier at blandingen ikke inneholder noe D-bidrag i denne
mønsterbasisen.

#### Hvorfor påvirkes ikke H-målingen av de andre ingrediensene?

Se først på to konkrete kontroller:

$\vec h^{\,T}\vec m=\tfrac14(1-1+1-1)=0,\qquad
\vec h^{\,T}\vec v=\tfrac14(1-1-1+1)=0.$

H-målingen gir null på både jevnt nivå og oppe–nede-kontrast.
På sitt eget mønster gir den
$\vec h^{\,T}\vec h=\tfrac14(1+1+1+1)=1$.
Når vi setter hele oppskriften inn, ser vi derfor hvorfor svaret blir $-1$:

$\vec h^{\,T}\vec x
=2(\vec h^{\,T}\vec m)-(\vec h^{\,T}\vec h)
+\tfrac12(\vec h^{\,T}\vec v)
=2\cdot0-1+\tfrac12\cdot0=-1.$

De andre mønsterparene gir også null. Mønstervektorene er altså
**ortonormale**, akkurat som målepilene tidligere: lengde én hver for seg,
og indreprodukt null mellom ulike mønstre. Det er derfor målingene gir
byggekoeffisientene direkte. Med vilkårlige mønstre ville dette ikke vært
garantert.

#### Hvorfor samler vi mønstervektorene i en matrise?

Vi har nå gjort fire separate beregninger på det samme bildet. For hvert
nytt bilde ønsker vi å gjenta nettopp disse fire beregningene, i fast
rekkefølge: M, H, V, D. Matrisen er en kort måte å skrive hele denne
oppskriften på.

Vi setter derfor de fire kjente mønstervektorene ved siden av hverandre
som kolonner i én matrise:

$$Q_{\text{pattern}}=
\begin{bmatrix}|&|&|&|\\
\vec m&\vec h&\vec v&\vec d\\
|&|&|&|
\end{bmatrix}.$$

Da skriver matriseproduktet de fire målingene i én kolonne:

$$Q_{\text{pattern}}^T\vec x
=\begin{bmatrix}
\vec m^{\,T}\vec x\\
\vec h^{\,T}\vec x\\
\vec v^{\,T}\vec x\\
\vec d^{\,T}\vec x
\end{bmatrix}
=\begin{bmatrix}2\\-1\\1/2\\0\end{bmatrix}.$$

Her betyr **måling** ett indreprodukt mellom et enhetsmønster og
bildevektoren. Hvert tall forteller hvor mye av det mønsteret bildet
inneholder i denne ortonormale basisen:

| Måling | Verdi | Hva betyr den i blandingen? |
|---|---:|---|
| $\vec m^{\,T}\vec x$ | $2$ | To ganger M-mønsteret: et jevnt bidrag på $1$ i hver piksel. |
| $\vec h^{\,T}\vec x$ | $-1$ | H-mønsteret med motsatt fortegn: høyre side blir lysere enn venstre. |
| $\vec v^{\,T}\vec x$ | $1/2$ | Halv styrke av V-mønsteret: øvre rad blir lysere enn nedre. |
| $\vec d^{\,T}\vec x$ | $0$ | Ingen del av D-mønsteret i denne blandingen. |

Tallene er **mønstermengder**, ikke de fire pikselverdiene. For eksempel
er M-mengden $2$, mens gjennomsnittet av pikselverdiene er $1$, fordi
hver piksel i enhetsmønsteret M har verdien $1/2$.

I Python skriver vi ikke pil over variabelnavn: `h` svarer til $\vec h$.
`H` lagrer de samme fire verdiene i bildeform, og `H.reshape(-1)` leser
radene i den avtalte rekkefølgen. Omvendt legger `x.reshape(2, 2)` verdiene
tilbake på de fire pikselplassene. Dette endrer bare formen på lagringen.

Koden nedenfor gjentar hele eksemplet og viser bildet sammen med de fire
målte mengdene. Som neste eksperiment kan du endre bare koeffisienten foran
H: Forklaringen over forutsier at bare H-søylen skal flytte seg.

```{pyodide-python}
#| label: week4-pattern-detectors
M = 0.5*np.array([[1.0, 1.0], [1.0, 1.0]])
H = 0.5*np.array([[1.0, -1.0], [1.0, -1.0]])
V = 0.5*np.array([[1.0, 1.0], [-1.0, -1.0]])
D = 0.5*np.array([[1.0, -1.0], [-1.0, 1.0]])
patterns = [M, H, V, D]
names = ["M", "H", "V", "D"]
m, h, v, d = [P.reshape(-1) for P in patterns]
Q_pattern = np.column_stack([m, h, v, d])
coefficients = np.array([2.0, -1.0, 0.5, 0.0])
x = Q_pattern @ coefficients
X = x.reshape(2, 2)
readings = Q_pattern.T @ x

# To kolonner: fire mønstre øverst, blanding og målinger nederst.
fig, grid = plt.subplots(3, 2, figsize=(6, 8), dpi=90)
axes = grid.ravel()
pattern_colors = ["#555555", "#277da1", "#4f8f49", "#8b5aa7"]
for ax, P, name, color in zip(axes[:4], patterns, names, pattern_colors):
    ax.imshow(P, cmap="RdBu_r", vmin=-2, vmax=2)
    ax.set_title(name, color=color)
    ax.set_xticks([]); ax.set_yticks([])
    for row in range(2):
        for col in range(2):
            ax.text(col, row, f"{P[row, col]:g}",
                    ha="center", va="center", fontsize=11)
axes[4].imshow(X, cmap="RdBu_r", vmin=-2, vmax=2)
axes[4].set_title("Blanding x")
axes[4].set_xticks([]); axes[4].set_yticks([])
for row in range(2):
    for col in range(2):
        axes[4].text(col, row, f"{X[row, col]:g}",
                     ha="center", va="center", fontsize=11,
                     color="white" if abs(X[row, col]) > 1 else "black")
axes[5].bar(names, readings, color=pattern_colors)
axes[5].axhline(0, color="black", linewidth=0.8)
axes[5].set_title("Målte mønstermengder")
axes[5].set_ylabel("Indreprodukt med x")
axes[5].margins(y=0.25)
for i, value in enumerate(readings):
    axes[5].annotate(f"{value:g}", (i, value),
                     xytext=(0, 5 if value >= 0 else -5),
                     textcoords="offset points", ha="center",
                     va="bottom" if value >= 0 else "top")
fig.tight_layout()
plt.show()

print("Q^T Q =\n", Q_pattern.T @ Q_pattern)
for name, value in zip(names, readings):
    print(f"Mengde av {name}-mønsteret: {value:g}")

```

Hver måling reagerer på sitt eget mønster og gir null på de andre. Hver kolonne i
$Q_{\text{pattern}}$ har lengde én og er ortogonal på de andre. Derfor er
$Q_{\text{pattern}}^TQ_{\text{pattern}}=I$, og målingene gir
koordinatene direkte.

::: {.callout-tip collapse="true"}
#### Fordypning: legg til støy

Legg `0.05*np.random.default_rng(4).standard_normal((2, 2))` til bildet og
gjenta deteksjonen. Målingene blir ikke identiske med de opprinnelige
koeffisientene, men de forteller fortsatt hvilke mønstre som dominerer.
:::

### Fra komponent til vektor og rest {#uke4-projeksjon}

Vi har brukt indreproduktet til å beregne mengden av et mønster.
Nå undersøker vi hvordan en beregnet komponent gir en vektor i den
valgte retningen, og hva som blir igjen når denne vektoren trekkes fra.
Vi begynner med et konkret eksempel i planet. Symbolene $x,q,p,r$
betegner vektorer, mens $c$ betegner ett tall.

La $x=(3,2)^T$ og $q=(1,0)^T$. Siden $q$ har lengde én, er komponenten
av $x$ i retningen $q$ gitt ved indreproduktet

$$c=q^Tx=1\cdot3+0\cdot2=3.$$

Tallet $c=3$ angir hvor mye av $x$ som går i retningen $q$.
For å uttrykke dette som en **vektor** ganger vi enhetsvektoren $q$
med tallet $c$:

$$p=cq=3\begin{bmatrix}1\\0\end{bmatrix}
=\begin{bmatrix}3\\0\end{bmatrix}.$$

Vi beregner deretter differansen mellom den opprinnelige vektoren $x$
og vektoren $p$:

$$r=x-p=\begin{bmatrix}3\\2\end{bmatrix}
-\begin{bmatrix}3\\0\end{bmatrix}
=\begin{bmatrix}0\\2\end{bmatrix}.$$

Dermed er $x=p+r$. I dette eksemplet er $p$ den vannrette delen av $x$,
mens resten $r$ er loddrett og står vinkelrett på $q$.

**Undersøk i figuren:** Dra i endepunktene til $x$ og $q$. Den grå pilen
viser den beregnede vektoren $p=(q^Tx)q$. Den røde pilen fra enden av $p$
til enden av $x$ viser differansen $r=x-p$. Er $r$ fortsatt vinkelrett på
$q$ når retningen endres? Sammenlign det du ser med tallet $q^Tr$ som
vises i figuren.

```{.jsxgraph width="760" height="510"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-5.5, 5.5, 7.5, -4.5], axis: true,
  showCopyright: false, showNavigation: false, keepaspectratio: true
});
var O = board.create('point', [0,0], {visible:false, fixed:true});
var X = board.create('point', [3,2], {name:'x', color:'#222222', size:5});
board.create('arrow', [O,X], {strokeColor:'#222222', strokeWidth:4});
var C = board.create('circle', [O,1], {strokeColor:'#8fa8c7', dash:2});
var Q = board.create('glider', [1,0,C], {name:'q', color:'#1565c0', size:5});
board.create('arrow', [O,Q], {strokeColor:'#1565c0', strokeWidth:4});
var amount = function(){ return X.X()*Q.X()+X.Y()*Q.Y(); };
var P = board.create('point', [
  function(){return amount()*Q.X();},
  function(){return amount()*Q.Y();}
], {name:'p: projeksjon', color:'#666666', size:4});
board.create('arrow', [O,P], {strokeColor:'#666666', strokeWidth:4});
board.create('arrow', [P,X], {strokeColor:'#c62828', strokeWidth:4});
board.create('line', [O,Q], {strokeColor:'#1565c0', strokeWidth:1});
board.create('text', [-5.1,4.9,function(){
  var rx=X.X()-P.X(), ry=X.Y()-P.Y();
  return 'q^T x = '+amount().toFixed(3)+';  q^T r = '+
         (Q.X()*rx+Q.Y()*ry).toFixed(6);
}], {fontSize:17});
```

La $q$ være en enhetsvektor. Vi kan dele en vektor $x$ i to deler:

$c=q^Tx,\qquad p=cq,\qquad r=x-p.$

- $c$ måler hvor mye av $x$ som går i retning $q$.
- $p=(q^Tx)q$ bygger opp denne delen som en vektor.
- $r=x-p$ er det som er igjen.

#### Hvorfor er komponenten langs $q$ lik null?

Sett $c=q^Tx$ og $r=x-cq$. Siden $c$ er **ett tall**, kan det trekkes
utenfor produktet: $q^T(cq)=c(q^Tq)$. Transponeringen blir stående på $q$.
Dermed får vi

$$\begin{aligned}
q^Tr&=q^T(x-cq)\\
&=q^Tx-c(q^Tq)\\
&=c-c\cdot1=0,
\end{aligned}$$

fordi $q$ har lengde én, slik at $q^Tq=1$. Resten er altså ortogonal på
$q$. Vektoren $p=(q^Tx)q$ kalles den **ortogonale projeksjonen** av $x$
på retningen $q$, og $r=x-p$ kalles **residualen**.

#### Projeksjon på to ortonormale retninger

Vi vil finne den delen av en vektor som kan uttrykkes ved hjelp av
**to** gitte retninger. I dette eksemplet er

$$x=\begin{bmatrix}3\\2\\4\end{bmatrix},\qquad
q_1=\begin{bmatrix}1\\0\\0\end{bmatrix},\qquad
q_2=\begin{bmatrix}0\\1\\0\end{bmatrix}.$$

Begge retningsvektorene har lengde én, og
$q_1^Tq_2=1\cdot0+0\cdot1+0\cdot0=0$.
De er derfor ortonormale. Alle lineærkombinasjoner av dem har tredje
koordinat null. Vektoren $x$ har tredje koordinat $4$, så hele $x$ kan
ikke uttrykkes som en slik kombinasjon.

**Beregn komponentene.** Indreproduktet med hver enhetsvektor gir ett tall:

$$c_1=q_1^Tx=1\cdot3+0\cdot2+0\cdot4=3,$$
$$c_2=q_2^Tx=0\cdot3+1\cdot2+0\cdot4=2.$$

**Beregn vektorbidragene.** Hvert tall multipliseres med den tilhørende
enhetsvektoren:

$$c_1q_1=3\begin{bmatrix}1\\0\\0\end{bmatrix}
=\begin{bmatrix}3\\0\\0\end{bmatrix},\qquad
c_2q_2=2\begin{bmatrix}0\\1\\0\end{bmatrix}
=\begin{bmatrix}0\\2\\0\end{bmatrix}.$$

Summen er vektoren $p$. Differansen $x-p$ er resten $r$:

$$p=c_1q_1+c_2q_2
=\begin{bmatrix}3\\0\\0\end{bmatrix}
+\begin{bmatrix}0\\2\\0\end{bmatrix}
=\begin{bmatrix}3\\2\\0\end{bmatrix},$$

$$r=x-p
=\begin{bmatrix}3\\2\\4\end{bmatrix}
-\begin{bmatrix}3\\2\\0\end{bmatrix}
=\begin{bmatrix}0\\0\\4\end{bmatrix}.$$

**Kontroller resten.** Vi beregner begge indreproduktene:

$$q_1^Tr=1\cdot0+0\cdot0+0\cdot4=0,$$
$$q_2^Tr=0\cdot0+1\cdot0+0\cdot4=0.$$

Resten er ortogonal på begge retningene. Vektoren $p$ er dermed den
ortogonale projeksjonen av $x$ på planet som $q_1$ og $q_2$ spenner ut.

#### Samle komponentberegningene i ett matriseprodukt

Vi har utført to indreprodukter på samme vektor. For å skrive begge
beregningene samlet setter vi retningsvektorene som kolonner i $Q$.
Vi beholder fargene fra $Q^TQ$: **blått for kolonnene i $Q$** og
**oransje for radene i $Q^T$**.

$$\textcolor{#1565c0}{Q}=\textcolor{#1565c0}{\begin{bmatrix}|&|\\q_1&q_2\\|&|\end{bmatrix}}
=\textcolor{#1565c0}{\begin{bmatrix}1&0\\0&1\\0&0\end{bmatrix}},$$
$$\textcolor{#b45309}{Q^T}=\textcolor{#b45309}{\begin{bmatrix}\text{— }q_1^T\text{ —}\\\text{— }q_2^T\text{ —}\end{bmatrix}}
=\textcolor{#b45309}{\begin{bmatrix}1&0&0\\0&1&0\end{bmatrix}}.$$

Samle tallene $c_1$ og $c_2$ i en **koeffisientvektor** $c$.
Vektoren $c$ har to koordinater; $x$ har tre. Radene i $Q^T$ gir
akkurat de to indreproduktene vi allerede har beregnet:

$$\begin{aligned}
c=\textcolor{#b45309}{Q^T}x
&=\textcolor{#b45309}{\begin{bmatrix}\text{— }q_1^T\text{ —}\\\text{— }q_2^T\text{ —}\end{bmatrix}}\begin{bmatrix}3\\2\\4\end{bmatrix}\\
&=\begin{bmatrix}\textcolor{#b45309}{q_1^T}x\\\textcolor{#b45309}{q_2^T}x\end{bmatrix}\\
&=\begin{bmatrix}
\textcolor{#b45309}{1}\cdot3+\textcolor{#b45309}{0}\cdot2+\textcolor{#b45309}{0}\cdot4\\
\textcolor{#b45309}{0}\cdot3+\textcolor{#b45309}{1}\cdot2+\textcolor{#b45309}{0}\cdot4
\end{bmatrix}\\
&=\begin{bmatrix}3\\2\end{bmatrix}.
\end{aligned}$$

#### Fra koeffisientvektoren tilbake til en vektor i planet

Nå bruker vi kolonnene i $Q$. Å multiplisere $Q$ med $c$ betyr å
multiplisere første kolonne med $c_1$, andre kolonne med $c_2$,
og legge sammen de to vektorene:

$$\begin{aligned}
p=\textcolor{#1565c0}{Q}c
&=\textcolor{#1565c0}{\begin{bmatrix}|&|\\q_1&q_2\\|&|\end{bmatrix}}\begin{bmatrix}c_1\\c_2\end{bmatrix}\\
&=c_1\textcolor{#1565c0}{q_1}+c_2\textcolor{#1565c0}{q_2}\\
&=3\textcolor{#1565c0}{\begin{bmatrix}1\\0\\0\end{bmatrix}}
 +2\textcolor{#1565c0}{\begin{bmatrix}0\\1\\0\end{bmatrix}}\\
&=\begin{bmatrix}3\\0\\0\end{bmatrix}
 +\begin{bmatrix}0\\2\\0\end{bmatrix}
=\begin{bmatrix}3\\2\\0\end{bmatrix}.
\end{aligned}$$

Vi får samme $p$ som før. Produktet $Q^Tx$ beregner koeffisientene;
produktet $Qc$ beregner vektoren med disse koeffisientene.
Siden $c=Q^Tx$, kan vi sette det første uttrykket inn i det andre:

$$p=\textcolor{#1565c0}{Q}c
=\textcolor{#1565c0}{Q}\underbrace{(\textcolor{#b45309}{Q^T}x)}_{c}
=(\textcolor{#1565c0}{Q}\textcolor{#b45309}{Q^T})x.$$

Vi utfører altså to operasjoner i rekkefølge. $Q^T$ går fra tre
koordinater til to koeffisienter; $Q$ går fra to koeffisienter til tre
koordinater. Matrisen $QQ^T$ har størrelse $3\times3$ i dette eksemplet.
Den er ikke $Q^TQ$, som har størrelse $2\times2$.

#### Den samme beregningen med flere ortonormale retninger

La nå $q_1,\ldots,q_k$ være ortonormale vektorer i $\mathbb R^m$.
Vi beregner først de $k$ tallene $c_i=q_i^Tx$ og deretter vektoren
$p=c_1q_1+\cdots+c_kq_k$. Med kolonnene samlet i $Q$ blir dette

$$c=\textcolor{#b45309}{Q^T}x
=\textcolor{#b45309}{\begin{bmatrix}\text{— }q_1^T\text{ —}\\\vdots\\\text{— }q_k^T\text{ —}\end{bmatrix}}x
=\begin{bmatrix}q_1^Tx\\\vdots\\q_k^Tx\end{bmatrix},$$

$$p=\textcolor{#1565c0}{Q}c
=\textcolor{#1565c0}{\begin{bmatrix}|&&|\\q_1&\cdots&q_k\\|&&|\end{bmatrix}}
\begin{bmatrix}c_1\\\vdots\\c_k\end{bmatrix}
=c_1\textcolor{#1565c0}{q_1}+\cdots+c_k\textcolor{#1565c0}{q_k}.$$

Hvorfor blir resten $r=x-p$ ortogonal på alle de valgte retningene?
Vi bruker $\sum_{i=1}^k$ som kort skrivemåte for å legge sammen leddene
med $i=1,2,\ldots,k$. For en bestemt $q_j$ får vi

$$\begin{aligned}
q_j^Tr
&=q_j^Tx-\sum_{i=1}^k c_i(q_j^Tq_i)\\
&=c_j-c_j\\
&=0.
\end{aligned}$$

I summen er $q_j^Tq_i=0$ når $i\ne j$, og $q_j^Tq_j=1$.
Bare leddet $c_j$ står derfor igjen. Når vi samler alle disse
nullresultatene som en kolonne, får vi

$$\textcolor{#b45309}{Q^T}r
=\begin{bmatrix}q_1^Tr\\\vdots\\q_k^Tr\end{bmatrix}
=\begin{bmatrix}0\\\vdots\\0\end{bmatrix}.$$

Vi kan nå oppsummere beregningen med den korte matrisenotasjonen:

$$\boxed{c=Q^Tx,\qquad p=Q(Q^Tx),\qquad Q^T(x-p)=0.}$$

::: {.callout-note collapse="true"}
#### Hvis målevektoren ikke har lengde én

For en vilkårlig ikke-null vektor $a$ må vi korrigere for lengden:

$$\operatorname{proj}_a(x)=\frac{a^Tx}{a^Ta}a.$$

Når $a$ er en enhetsvektor, er $a^Ta=1$.
:::

Nå har vi en måte å fjerne en kjent retning på. I neste fane bruker vi
nettopp dette til å lage nye ortogonale retninger: Ta en ny pil, fjern
delen langs de gamle pilene, og normaliser det som står igjen. Dette blir
Gram–Schmidt.


## 4.3 Gram–Schmidt og QR

### Hvor får vi ortogonale detektorer fra? {#uke4-gs}

Anta at vi starter med

$$a_1=\begin{bmatrix}2\\1\end{bmatrix},\qquad
a_2=\begin{bmatrix}1\\2\end{bmatrix}.$$

De spenner ut hele $\mathbb R^2$, men $a_1^Ta_2=4\ne0$. Vi lager nye
vektorer som spenner ut det samme rommet:

$$q_1=\frac{a_1}{\lVert a_1\rVert_2},$$

$$r_{12}=q_1^Ta_2,\qquad
v_2=a_2-r_{12}q_1,\qquad
q_2=\frac{v_2}{\lVert v_2\rVert_2}.$$

Les operasjonene med språket vi allerede har:

1. normaliser den første retningen;
2. mål hvor mye av $a_2$ som går i retning $q_1$;
3. bygg opp og trekk fra denne delen;
4. normaliser det som er igjen.

Hvorfor blir den nye pilen vinkelrett? Måleren $q_1$ leste $r_{12}$ på
$a_2$. Vi trekker fra nøyaktig denne mengden i retning $q_1$:

$$q_1^Tv_2=q_1^Ta_2-r_{12}(q_1^Tq_1)=r_{12}-r_{12}=0.$$

Normalisering endrer bare lengden, ikke retningen. Derfor er også
$q_1^Tq_2=(q_1^Tv_2)/\lVert v_2\rVert_2=0$, så lenge $v_2\ne0$.
I talleksemplet nedenfor kan du kontrollere det direkte:
$(2,1)\begin{bmatrix}-1\\2\end{bmatrix}=-2+2=0$.

Dette er **Gram–Schmidt-prosessen**.

#### Hele regningen for hånd

Vi bruker $a_1=(2,1)^T$ og $a_2=(1,2)^T$.
**Blått følger de nye enhetsvektorene**, og **lilla følger tallene som
angir hvor mye av hver enhetsvektor som inngår**. De samme fargene brukes
når vi senere samler resultatene i $Q$ og $R$.

Første normalisering gir

$$\textcolor{#8b5aa7}{r_{11}}=\lVert a_1\rVert_2
=\sqrt{2^2+1^2}=\textcolor{#8b5aa7}{\sqrt5},\qquad
\textcolor{#1565c0}{q_1}=\frac{a_1}{\textcolor{#8b5aa7}{r_{11}}}=\textcolor{#1565c0}{\frac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix}}.$$

Komponenten av $a_2$ langs $q_1$ er

$$\textcolor{#8b5aa7}{r_{12}}=\textcolor{#1565c0}{q_1^T}a_2
=\frac{2\cdot1+1\cdot2}{\sqrt5}=\textcolor{#8b5aa7}{\frac4{\sqrt5}}.$$

Vi trekker den tilhørende vektoren fra $a_2$:

$$\begin{aligned}
v_2&=a_2-\textcolor{#8b5aa7}{r_{12}}\textcolor{#1565c0}{q_1}\\
&=\begin{bmatrix}1\\2\end{bmatrix}
-\textcolor{#8b5aa7}{\frac4{\sqrt5}}\,\textcolor{#1565c0}{\frac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix}}\\
&=\begin{bmatrix}1\\2\end{bmatrix}
-\begin{bmatrix}8/5\\4/5\end{bmatrix}
=\begin{bmatrix}-3/5\\6/5\end{bmatrix}.
\end{aligned}$$

Andre normalisering gir

$$\textcolor{#8b5aa7}{r_{22}}=\lVert v_2\rVert_2
=\sqrt{\frac9{25}+\frac{36}{25}}
=\textcolor{#8b5aa7}{\frac3{\sqrt5}},\qquad
\textcolor{#1565c0}{q_2}=\frac{v_2}{\textcolor{#8b5aa7}{r_{22}}}=\textcolor{#1565c0}{\frac1{\sqrt5}\begin{bmatrix}-1\\2\end{bmatrix}}.$$

#### Skriv regnskapet for hver opprinnelig vektor

Hva har vi beregnet? Normaliseringen
$q_1=a_1/r_{11}$ kan skrives tilbake som
$a_1=r_{11}q_1$. Tilsvarende gir
$v_2=a_2-r_{12}q_1$ og $v_2=r_{22}q_2$ uttrykket
$a_2=r_{12}q_1+r_{22}q_2$.

Vi har altså to ferdige likninger:

$$a_1=\textcolor{#8b5aa7}{r_{11}}\textcolor{#1565c0}{q_1}+\textcolor{#8b5aa7}{0}\textcolor{#1565c0}{q_2},$$
$$a_2=\textcolor{#8b5aa7}{r_{12}}\textcolor{#1565c0}{q_1}+\textcolor{#8b5aa7}{r_{22}}\textcolor{#1565c0}{q_2}.$$

Kontroller begge med tallene fra regningen:

$$a_1=\textcolor{#8b5aa7}{\sqrt5}\,\textcolor{#1565c0}{\frac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix}}
=\begin{bmatrix}2\\1\end{bmatrix},$$

$$\begin{aligned}
a_2&=\textcolor{#8b5aa7}{\frac4{\sqrt5}}\,\textcolor{#1565c0}{\frac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix}}
+\textcolor{#8b5aa7}{\frac3{\sqrt5}}\,\textcolor{#1565c0}{\frac1{\sqrt5}\begin{bmatrix}-1\\2\end{bmatrix}}\\
&=\begin{bmatrix}8/5\\4/5\end{bmatrix}
+\begin{bmatrix}-3/5\\6/5\end{bmatrix}
=\begin{bmatrix}1\\2\end{bmatrix}.
\end{aligned}$$

Ingen nye vektorer eller koeffisienter skal beregnes for å skrive QR.
Vi skal bare samle disse to likningene.

#### Fra to likninger til to matriser

Begge likningene bruker de samme blå vektorene. Vi setter dem som
kolonner i én matrise:

$$\textcolor{#1565c0}{Q}=\textcolor{#1565c0}{\begin{bmatrix}|&|\\q_1&q_2\\|&|\end{bmatrix}}=\textcolor{#1565c0}{\frac1{\sqrt5}\begin{bmatrix}2&-1\\1&2\end{bmatrix}}.$$

For hver opprinnelig vektor skriver vi koeffisientene i rekkefølgen
«mengde av $q_1$, mengde av $q_2$»:

| Opprinnelig vektor | Koeffisient foran $q_1$ | Koeffisient foran $q_2$ |
|---|---|---|
| $a_1$ | $\textcolor{#8b5aa7}{r_{11}=\sqrt5}$ | $\textcolor{#8b5aa7}{0}$ |
| $a_2$ | $\textcolor{#8b5aa7}{r_{12}=4/\sqrt5}$ | $\textcolor{#8b5aa7}{r_{22}=3/\sqrt5}$ |

Koeffisientene for **én opprinnelig vektor blir én kolonne**.
Dermed får vi matrisen

$$\textcolor{#8b5aa7}{R}=
\textcolor{#8b5aa7}{\begin{bmatrix}r_{11}&r_{12}\\0&r_{22}\end{bmatrix}}
=\textcolor{#8b5aa7}{\begin{bmatrix}\sqrt5&4/\sqrt5\\0&3/\sqrt5\end{bmatrix}}.$$

Første kolonne i $R$ hører til $a_1$, og andre kolonne hører til $a_2$.
Første rad inneholder mengdene av $q_1$; andre rad inneholder mengdene
av $q_2$. Nulloppføringen sier at $a_1$ ikke trenger noe bidrag fra $q_2$.

#### Utvid produktet før vi gir det et navn

Når $Q$ multipliseres med første kolonne i $R$, får vi uttrykket for
$a_1$. Andre kolonne gir uttrykket for $a_2$. Hele produktet er derfor

$$\begin{aligned}
\textcolor{#1565c0}{Q}\textcolor{#8b5aa7}{R}
&=\textcolor{#1565c0}{\begin{bmatrix}|&|\\q_1&q_2\\|&|\end{bmatrix}}
\textcolor{#8b5aa7}{\begin{bmatrix}r_{11}&r_{12}\\0&r_{22}\end{bmatrix}}\\
&=\begin{bmatrix}|&|\\
\textcolor{#8b5aa7}{r_{11}}\textcolor{#1565c0}{q_1}+\textcolor{#8b5aa7}{0}\textcolor{#1565c0}{q_2}&
\textcolor{#8b5aa7}{r_{12}}\textcolor{#1565c0}{q_1}+\textcolor{#8b5aa7}{r_{22}}\textcolor{#1565c0}{q_2}\\
|&|
\end{bmatrix}\\
&=\begin{bmatrix}|&|\\a_1&a_2\\|&|\end{bmatrix}.
\end{aligned}$$

Også vanlig rad-ganger-kolonne-regning gir de samme tallene:

$$\begin{aligned}
\textcolor{#1565c0}{Q}\textcolor{#8b5aa7}{R}
&=\textcolor{#1565c0}{\frac1{\sqrt5}\begin{bmatrix}2&-1\\1&2\end{bmatrix}}\,\textcolor{#8b5aa7}{\begin{bmatrix}\sqrt5&4/\sqrt5\\0&3/\sqrt5\end{bmatrix}}\\
&=\frac1{\sqrt5}\begin{bmatrix}
\textcolor{#1565c0}{2}\cdot\textcolor{#8b5aa7}{\sqrt5}+\textcolor{#1565c0}{(-1)}\cdot\textcolor{#8b5aa7}{0}&
\textcolor{#1565c0}{2}\cdot\textcolor{#8b5aa7}{\frac4{\sqrt5}}+\textcolor{#1565c0}{(-1)}\cdot\textcolor{#8b5aa7}{\frac3{\sqrt5}}\\
\textcolor{#1565c0}{1}\cdot\textcolor{#8b5aa7}{\sqrt5}+\textcolor{#1565c0}{2}\cdot\textcolor{#8b5aa7}{0}&
\textcolor{#1565c0}{1}\cdot\textcolor{#8b5aa7}{\frac4{\sqrt5}}+\textcolor{#1565c0}{2}\cdot\textcolor{#8b5aa7}{\frac3{\sqrt5}}
\end{bmatrix}\\
&=\frac1{\sqrt5}\begin{bmatrix}2\sqrt5&5/\sqrt5\\
\sqrt5&10/\sqrt5\end{bmatrix}
=\begin{bmatrix}2&1\\1&2\end{bmatrix}.
\end{aligned}$$

Matrisen med de opprinnelige vektorene som kolonner kaller vi
$A=[a_1\ a_2]$. Hele regnskapet kan dermed forkortes til

$$\boxed{A=\textcolor{#1565c0}{Q}\textcolor{#8b5aa7}{R}.}$$

Dette er en **QR-faktorisering**: $Q$ inneholder de ortonormale
vektorene, og $R$ inneholder koeffisientene som uttrykker hver
opprinnelig kolonne ved hjelp av dem. Likheten $A=QR$ samler de
vektorlikningene vi allerede har kontrollert.

```{pyodide-python}
#| label: week4-two-vector-gs
a1 = np.array([2.0, 1.0])
a2 = np.array([1.0, 2.0])
q1 = a1 / np.linalg.norm(a1)
r12 = q1 @ a2
v2 = a2 - r12*q1
q2 = v2 / np.linalg.norm(v2)
Q = np.column_stack([q1, q2])
R = np.array([[np.linalg.norm(a1), r12],
              [0.0, np.linalg.norm(v2)]])
A = np.column_stack([a1, a2])
print("Q =\n", Q)
print("Q^T Q =\n", Q.T @ Q)
print("R =\n", R)
print("||A-QR||_F =", np.linalg.norm(A-Q@R, "fro"))
```

Matrisen $R$ er **øvre triangulær**: Alle oppføringer under diagonalen
er null. Koden kontrollerer både at kolonnene i $Q$ er ortonormale,
og at koeffisientene i $R$ gjenskaper de opprinnelige kolonnene i $A$.



### Klassisk Gram–Schmidt for flere kolonner {#uke4-cgs}

#### Fra to til tre vektorer

I eksemplet over lå vektorene i planet. To uavhengige vektorer fyller
allerede hele planet; en tredje kan derfor ikke gi en ny uavhengig retning
der. Nå arbeider vi i $\mathbb R^m$ med $m\ge3$ og antar at de tre
opprinnelige vektorene er lineært uavhengige.

Vi viderefører samme regning og samme farger: **blått er de ortonormale
vektorene**, **lilla er koeffisientene**. Anta at $q_1$ og $q_2$ allerede
er beregnet fra $a_1$ og $a_2$. Målet er å behandle $a_3$ og samtidig
bevare et fullstendig regnskap for den.

**Beregn de to komponentene av $a_3$:**

$$\textcolor{#8b5aa7}{r_{13}}=\textcolor{#1565c0}{q_1^T}a_3,\qquad
\textcolor{#8b5aa7}{r_{23}}=\textcolor{#1565c0}{q_2^T}a_3.$$

Begge koeffisientene er tall. Indeksene i $r_{23}$ betyr «komponenten
langs $q_2$ i den opprinnelige vektoren $a_3$».

**Beregn og trekk fra vektorbidragene:**

$$p_3=\textcolor{#8b5aa7}{r_{13}}\textcolor{#1565c0}{q_1}+\textcolor{#8b5aa7}{r_{23}}\textcolor{#1565c0}{q_2},$$
$$v_3=a_3-p_3=a_3-\textcolor{#8b5aa7}{r_{13}}\textcolor{#1565c0}{q_1}-\textcolor{#8b5aa7}{r_{23}}\textcolor{#1565c0}{q_2}.$$

Her er $p_3$ projeksjonen på de to tidligere retningene, og $v_3$ er resten.
Vi bruker navnet $v_3$ fordi denne resten snart skal normaliseres.

#### Kontroller at resten er ortogonal på begge retningene

For den første retningen får vi

$$\begin{aligned}
\textcolor{#1565c0}{q_1^T}v_3
&=\textcolor{#1565c0}{q_1^T}a_3
-\textcolor{#8b5aa7}{r_{13}}(\textcolor{#1565c0}{q_1^Tq_1})
-\textcolor{#8b5aa7}{r_{23}}(\textcolor{#1565c0}{q_1^Tq_2})\\
&=\textcolor{#8b5aa7}{r_{13}}-\textcolor{#8b5aa7}{r_{13}}\cdot1-\textcolor{#8b5aa7}{r_{23}}\cdot0=0.
\end{aligned}$$

For den andre retningen får vi tilsvarende

$$\begin{aligned}
\textcolor{#1565c0}{q_2^T}v_3
&=\textcolor{#1565c0}{q_2^T}a_3
-\textcolor{#8b5aa7}{r_{13}}(\textcolor{#1565c0}{q_2^Tq_1})
-\textcolor{#8b5aa7}{r_{23}}(\textcolor{#1565c0}{q_2^Tq_2})\\
&=\textcolor{#8b5aa7}{r_{23}}-\textcolor{#8b5aa7}{r_{13}}\cdot0-\textcolor{#8b5aa7}{r_{23}}\cdot1=0.
\end{aligned}$$

Kryssleddene er null fordi $q_1$ og $q_2$ er ortogonale.
Å trekke fra bidraget langs den ene retningen påvirker derfor ikke
komponenten langs den andre. Dette er en forklaring i eksakt regning;
i neste fane undersøker vi hva avrunding kan endre.

Siden $a_3$ tilfører en uavhengig retning, er $v_3\ne0$. Normaliser resten:

$$\textcolor{#8b5aa7}{r_{33}}=\lVert v_3\rVert_2,\qquad
\textcolor{#1565c0}{q_3}=\frac{v_3}{\textcolor{#8b5aa7}{r_{33}}}.$$

Vi deler med ett positivt tall. Lengden blir én, og de to
indreproduktene som var null, forblir null. Dermed er $q_1,q_2,q_3$
ortonormale.

#### Samle regnskapet for tre vektorer

Normaliseringen gir $v_3=r_{33}q_3$. Sett dette inn i
$a_3=p_3+v_3$. Da har vi følgende tre likninger:

$$\begin{aligned}
a_1&=\textcolor{#8b5aa7}{r_{11}}\textcolor{#1565c0}{q_1},\\
a_2&=\textcolor{#8b5aa7}{r_{12}}\textcolor{#1565c0}{q_1}+\textcolor{#8b5aa7}{r_{22}}\textcolor{#1565c0}{q_2},\\
a_3&=\textcolor{#8b5aa7}{r_{13}}\textcolor{#1565c0}{q_1}+\textcolor{#8b5aa7}{r_{23}}\textcolor{#1565c0}{q_2}+\textcolor{#8b5aa7}{r_{33}}\textcolor{#1565c0}{q_3}.
\end{aligned}$$

Som før blir de blå vektorene kolonnene i $Q$. Koeffisientene for
$a_1$, $a_2$ og $a_3$ blir henholdsvis første, andre og tredje kolonne
i $R$:

$$\textcolor{#1565c0}{Q}=\textcolor{#1565c0}{\begin{bmatrix}|&|&|\\q_1&q_2&q_3\\|&|&|\end{bmatrix}},\qquad \textcolor{#8b5aa7}{R}=\textcolor{#8b5aa7}{\begin{bmatrix}r_{11}&r_{12}&r_{13}\\0&r_{22}&r_{23}\\0&0&r_{33}\end{bmatrix}}.$$

Første kolonne i $R$ inneholder $(r_{11},0,0)^T$, fordi uttrykket for
$a_1$ bare bruker $q_1$. Andre kolonne inneholder $(r_{12},r_{22},0)^T$.
Tredje kolonne inneholder alle de tre koeffisientene vi nettopp beregnet.

Produktet samler de tre vektorlikningene:

$$\begin{aligned}
\textcolor{#1565c0}{Q}\textcolor{#8b5aa7}{R}
&=\textcolor{#1565c0}{\begin{bmatrix}|&|&|\\q_1&q_2&q_3\\|&|&|\end{bmatrix}}\textcolor{#8b5aa7}{\begin{bmatrix}r_{11}&r_{12}&r_{13}\\0&r_{22}&r_{23}\\0&0&r_{33}\end{bmatrix}}\\
&=\begin{bmatrix}|&|&|\\
\textcolor{#8b5aa7}{r_{11}}\textcolor{#1565c0}{q_1}&
\textcolor{#8b5aa7}{r_{12}}\textcolor{#1565c0}{q_1}+\textcolor{#8b5aa7}{r_{22}}\textcolor{#1565c0}{q_2}&
\textcolor{#8b5aa7}{r_{13}}\textcolor{#1565c0}{q_1}+\textcolor{#8b5aa7}{r_{23}}\textcolor{#1565c0}{q_2}+\textcolor{#8b5aa7}{r_{33}}\textcolor{#1565c0}{q_3}\\
|&|&|
\end{bmatrix}\\
&=\begin{bmatrix}|&|&|\\a_1&a_2&a_3\\|&|&|\end{bmatrix}=A.
\end{aligned}$$

Også med tre kolonner er $A=QR$ kortformen av regnskapet vi allerede
har ført. Nullene under diagonalen i $R$ beskriver rekkefølgen på
beregningene: Tidligere vektorer bruker ikke retninger som beregnes senere.

#### Den samme beregningen i generell vektorform

La $a_1,\ldots,a_k$ være lineært uavhengige vektorer i $\mathbb R^m$,
med $m\ge k$. Anta at $q_1,\ldots,q_{j-1}$ allerede er beregnet.
For neste vektor $a_j$ gjentar vi nøyaktig de samme operasjonene.

**Først beregner vi tallene som angir komponentene langs tidligere retninger:**

$$\textcolor{#8b5aa7}{r_{1j}}=\textcolor{#1565c0}{q_1^T}a_j,\quad\ldots,\quad
\textcolor{#8b5aa7}{r_{j-1,j}}=\textcolor{#1565c0}{q_{j-1}^T}a_j.$$

Kort skrevet er dette $\textcolor{#8b5aa7}{r_{ij}}=\textcolor{#1565c0}{q_i^T}a_j$ for $i<j$.
I **klassisk Gram–Schmidt** beregnes alle disse indreproduktene med
den opprinnelige vektoren $a_j$.

**Deretter trekker vi fra de tilhørende vektorbidragene:**

$$\begin{aligned}
v_j
&=a_j-\textcolor{#8b5aa7}{r_{1j}}\textcolor{#1565c0}{q_1}-\cdots
-\textcolor{#8b5aa7}{r_{j-1,j}}\textcolor{#1565c0}{q_{j-1}}\\
&=a_j-\sum_{i=1}^{j-1}\textcolor{#8b5aa7}{r_{ij}}\textcolor{#1565c0}{q_i}.
\end{aligned}$$

Summetegnet forkorter de samme $j-1$ leddene som står i første linje.
Til slutt beregner vi lengden og normaliserer:

$$\textcolor{#8b5aa7}{r_{jj}}=\lVert v_j\rVert_2,\qquad
\textcolor{#1565c0}{q_j}=\frac{v_j}{\textcolor{#8b5aa7}{r_{jj}}}.$$

Ved $j=1$ finnes ingen tidligere retninger: Da er $v_1=a_1$.
Lineær uavhengighet sikrer at restene er ikke-null i eksakt regning.
Vi skal senere undersøke hvordan avhengighet og avrunding påvirker
normaliseringen.

Regnskapet for kolonne $j$ er nå

$$a_j=\sum_{i=1}^{j-1}\textcolor{#8b5aa7}{r_{ij}}\textcolor{#1565c0}{q_i}
+\textcolor{#8b5aa7}{r_{jj}}\textcolor{#1565c0}{q_j}
=\sum_{i=1}^{j}\textcolor{#8b5aa7}{r_{ij}}\textcolor{#1565c0}{q_i}.$$

Det er denne likningen kolonne $j$ i $R$ lagrer.

#### Dimensjoner og overgangen til kode

Samle de opprinnelige vektorene i $A=[a_1\ \cdots\ a_k]$.
Lineær uavhengighet betyr at $A$ har **full kolonnerang**, altså rang $k$.
De $k$ beregnede enhetsvektorene har fortsatt $m$ koordinater hver:

$$A\in\mathbb R^{m\times k},\qquad
\textcolor{#1565c0}{Q}\in\mathbb R^{m\times k},\qquad
\textcolor{#8b5aa7}{R}\in\mathbb R^{k\times k}.$$

Dette kalles en **tynn QR-faktorisering**: Vi beholder de $k$ kolonnene
som trengs for å uttrykke kolonnene i $A$. Vi utvider ikke $Q$ til $m$
kolonner når $m>k$.

$$A=\textcolor{#1565c0}{Q}\textcolor{#8b5aa7}{R},\qquad Q^TQ=I_k.$$

Kolonnene i $Q$ er ortonormale, også når $Q$ er rektangulær.
De spenner ut det samme rommet som kolonnene i $A$: $C(Q)=C(A)$.
Her betyr $C(A)$ alle lineærkombinasjoner av kolonnene i $A$.
De positive diagonalverdiene $r_{jj}$ gjør $R$ invertibel i eksakt
regning, så et system $Rc=d$ har én entydig løsning.

Koden nedenfor følger vektorformlene: beregn koeffisientene, trekk fra
vektorbidragene, beregn lengden og normaliser. I NumPy starter indekser
på $0$. Variabelen `n` i koden er antallet kolonner, kalt $k$ på papir.

Koden samler de tidligere vektorene i `Q[:, :j]`. Derfor beregner
`Q[:, :j].T @ A[:, j]` alle de tidligere indreproduktene samtidig,
og `Q[:, :j] @ coefficients` beregner summen som skal trekkes fra.

Matrisen som brukes i forsøket, er

$$A=\begin{bmatrix}1&1&0\\1&0&1\\0&1&1\\1&1&1\end{bmatrix}.$$

Den har fire rader og tre uavhengige kolonner. Resultatet får derfor
$Q$ av størrelse $4\times3$ og $R$ av størrelse $3\times3$.

```{pyodide-python}
#| label: week4-classical-gs
def classical_gram_schmidt(A):
    """Pedagogisk implementasjon uten rangkontroll."""
    A = np.asarray(A, dtype=float)
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    for j in range(n):
        coefficients = Q[:, :j].T @ A[:, j]
        R[:j, j] = coefficients
        v = A[:, j] - Q[:, :j] @ coefficients
        R[j, j] = np.linalg.norm(v)
        Q[:, j] = v / R[j, j]
    return Q, R

A = np.array([[1.0, 1.0, 0.0],
              [1.0, 0.0, 1.0],
              [0.0, 1.0, 1.0],
              [1.0, 1.0, 1.0]])
Q, R = classical_gram_schmidt(A)
print("||Q^TQ-I||_F =", np.linalg.norm(Q.T@Q-np.eye(3), "fro"))
print("||A-QR||_F   =", np.linalg.norm(A-Q@R, "fro"))
```

De to kontrollene bruker Frobeniusnormen og undersøker forskjellige
egenskaper. For en matrise $B=[b_{ij}]$ er den definert ved

$$\lVert B\rVert_F
=\sqrt{\sum_i\sum_j b_{ij}^2}.$$

Frobeniusnormen behandler altså alle matriseoppføringene som én lang vektor
og måler størrelsen på denne. Derfor blir begge kontrollene ett ikke-negativt
tall som er null når matriseidentiteten stemmer eksakt.

- $\lVert Q^TQ-I_k\rVert_F$ måler tap av ortonormalitet;
- $\lVert A-QR\rVert_F$ måler om faktorene bygger opp $A$ igjen.

## 4.4 Når regningen svikter

### Bryt algoritmen: eksakt avhengighet {#uke4-avhengighet}

Før vi ser feilen i en matrise, kan vi framprovosere den geometrisk. I
figuren er

$$
q_1=\frac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix},
\qquad
q_\perp=\frac1{\sqrt5}\begin{bmatrix}-1\\2\end{bmatrix},
$$

og den andre vektoren bygges som

$$a_2=\alpha q_1+\varepsilon q_\perp.$$

Skyv $\varepsilon$ mot null. Den røde resten etter at $q_1$-delen er
trukket fra, er $v_2=\varepsilon q_\perp$.

```{.jsxgraph width="760" height="520"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-1.2, 3.6, 4.6, -1.2], axis: true,
  showCopyright: false, showNavigation: false, keepaspectratio: true
});
var O = board.create('point', [0,0], {visible:false, fixed:true});
var root5 = Math.sqrt(5);
var qx = 2/root5, qy = 1/root5;
var nx = -1/root5, ny = 2/root5;
var alpha = board.create('slider', [[-0.8,-0.45],[1.2,-0.45],[0.5,1.5,3]], {
  name:'alpha', snapWidth:0.1
});
var epsilon = board.create('slider', [[1.6,-0.45],[3.6,-0.45],[0,0.6,1.5]], {
  name:'epsilon', snapWidth:0.05
});
board.create('button', [1.6,-0.95,'sett epsilon = 0',function(){
  epsilon.setValue(0);
}]);
var A1 = board.create('point', [2,1], {
  name:'a1', fixed:true, color:'#1565c0', size:4
});
board.create('arrow', [O,A1], {strokeColor:'#1565c0', strokeWidth:2, lastArrow:{type:2,size:4}});
var P = board.create('point', [
  function(){return alpha.Value()*qx;},
  function(){return alpha.Value()*qy;}
], {name:'projeksjon (delen som fjernes)', color:'#666666', size:3});
var A2 = board.create('point', [
  function(){return alpha.Value()*qx+epsilon.Value()*nx;},
  function(){return alpha.Value()*qy+epsilon.Value()*ny;}
], {name:'a2', color:'#222222', size:5});
board.create('arrow', [O,A2], {strokeColor:'#222222', strokeWidth:2, lastArrow:{type:2,size:4}});
board.create('arrow', [O,P], {strokeColor:'#777777', strokeWidth:2, lastArrow:{type:2,size:4}});
board.create('arrow', [P,A2], {strokeColor:'#c62828', strokeWidth:2, lastArrow:{type:2,size:4}});
board.create('line', [O,A1], {strokeColor:'#1565c0', dash:2, strokeWidth:1});
board.create('text', [-0.9,3.3,function(){
  return '||v2||_2 = |epsilon| = '+Math.abs(epsilon.Value()).toFixed(2);
}], {fontSize:15, color:'#c62828'});
board.create('text', [-0.9,2.95,function(){
  if (Math.abs(epsilon.Value()) < 1e-12) {
    return 'Ingen ny retning: q2 = v2/||v2||_2 er udefinert';
  }
  if (Math.abs(epsilon.Value()) < 0.15) {
    return 'Nesten parallell: den nye retningen kommer fra en svært liten rest';
  }
  return 'Tydelig ny retning';
}], {fontSize:13});
```

Ved $\varepsilon=0$ er $a_2$ et multiplum av $q_1$. I eksakt matematikk er
resten null, og det finnes ingen ny retning å normalisere. I flyttallsregning
kan subtraksjonene etterlate en svært liten rest i stedet for eksakt null.
Derfor er `NaN` et mulig, men ikke garantert, symptom på eksakt avhengighet.
Når $\varepsilon$ er liten, finnes en ny retning matematisk, men hele
retningen må hentes fra en liten differanse.

I matrisen

$$A=\begin{bmatrix}1&2&3\\0&1&1\\0&0&0\end{bmatrix}$$

er $a_3=a_1+a_2$. Den tredje kolonnen inneholder derfor ingen ny retning.
I eksakt aritmetikk trekker Gram–Schmidt fra hele kolonnen og får $v_3=0$.
I dette binært eksakte eksemplet skjer det også i flyttallsregning, og koden
forsøker så å dele på $\lVert v_3\rVert_2=0$.

```{pyodide-python}
#| label: week4-gs-nan
A_dependent = np.array([[1.0, 2.0, 3.0],
                        [0.0, 1.0, 1.0],
                        [0.0, 0.0, 0.0]])
with np.errstate(divide="warn", invalid="warn"):
    Q_bad, R_bad = classical_gram_schmidt(A_dependent)
print("Q =\n", Q_bad)
print("diagonalen i R =", np.diag(R_bad))
print("alle tall endelige?", np.isfinite(Q_bad).all())
```

::: {.callout-important}
#### `NaN` er et symptom, ikke forklaringen

$$\text{lineært avhengig kolonne}
\Longrightarrow v_j=0
\Longrightarrow \lVert v_j\rVert_2=0
\Longrightarrow v_j/\lVert v_j\rVert_2\text{ er udefinert}.$$

En robust implementasjon må bruke en skalert toleranse og stoppe når resten
er for liten til å gi en pålitelig ny retning. Det er en beslutning om
**numerisk rang**, ikke et bevis på eksakt lineær avhengighet.
:::

### Nesten avhengighet: endelige tall kan også være dårlige {#uke4-nesten}

#### Følg GS og avrundingen samtidig

Vi setter **$e=10^{-8}$ fra starten** og bruker vanlig float64-regning.
De tre vektorene er

$$\textcolor{#1565c0}{a_1=(1,e,0,0)^T},\qquad
\textcolor{#238443}{a_2=(1,0,e,0)^T},\qquad
\textcolor{#c62828}{a_3=(1,0,0,e)^T}.$$

De er lineært uavhengige, men peker nesten samme vei. Vi følger klassisk
Gram–Schmidt og undersøker når de beregnede retningene slutter å være
ortogonale. Blått, grønt og rødt følger henholdsvis første, andre og
tredje vektor.

En hatt markerer en beregnet verdi, for eksempel $\widehat q_1$.
Uttrykkene nedenfor viser float64-resultatene med enkle brøker;
$\approx$ skjuler bare de siste avrundede sifrene.

#### Første normalisering: avrundingen skjer allerede her

For å finne lengden til $a_1$ beregner programmet først summen av
kvadrerte koordinater. Her skjer det avgjørende tapet:

$$1+e^2=1+10^{-16}
\quad\xrightarrow{\text{float64}}\quad1.$$

Bidraget $10^{-16}$ er for lite til å endre tallet $1$ i denne
beregningen. Programmet beregner derfor lengden som $1$ og får

$$\textcolor{#1565c0}{\widehat q_1=(1,10^{-8},0,0)^T}.$$

Dette er mekanismen fra [prosjekt 1 – Floating-point attack](project_week1.qmd):
Et lite bidrag forsvinner når det legges til et stort. Nå følger vi
hvordan tapet påvirker neste GS-operasjon.

#### Andre vektor: en liten rest normaliseres

Koeffisienten beregnes med den avrundede første vektoren:

$$\widehat r_{12}=\widehat q_1^Ta_2
=1\cdot1+10^{-8}\cdot0+0\cdot10^{-8}+0\cdot0=1.$$

Deretter trekker programmet fra:

$$\widehat v_2
=\begin{bmatrix}1\\0\\10^{-8}\\0\end{bmatrix}
-\begin{bmatrix}1\\10^{-8}\\0\\0\end{bmatrix}
=\begin{bmatrix}0\\-10^{-8}\\10^{-8}\\0\end{bmatrix}.$$

Første koordinat blir $1-1=0$. Den lille korreksjonen som gikk tapt
i normaliseringen, kan ikke gjenopprettes av subtraksjonen.

Restens lengde er omtrent $10^{-8}\sqrt2$. Divisjonen med denne lille
lengden gjør de små koordinatene til tall av størrelse én:

$$\textcolor{#238443}{\widehat q_2
\approx\frac1{\sqrt2}(0,-1,1,0)^T}.$$

Kontrollen viser allerede en liten feil:

$$\widehat q_1^T\widehat q_2
\approx\frac{1\cdot0+10^{-8}(-1)+0\cdot1+0\cdot0}{\sqrt2}
=-\frac{10^{-8}}{\sqrt2}\approx-7.07\cdot10^{-9}.$$

Resultatet skulle vært null. Foreløpig er avviket lite; neste kolonne
viser hvorfor det likevel får betydning.

#### Tredje vektor: klassisk GS overser et bidrag i resten

Klassisk GS beregner begge koeffisientene mot den **opprinnelige**
vektoren $a_3$:

$$\widehat r_{13}=\widehat q_1^Ta_3=1,$$

$$\widehat r_{23}=\widehat q_2^Ta_3
=0\cdot1+(\widehat q_2)_2\cdot0
+(\widehat q_2)_3\cdot0+0\cdot10^{-8}=0.$$

Siden den andre koeffisienten blir null, trekkes bare bidraget langs
$\widehat q_1$ fra:

$$\widehat v_3
=\begin{bmatrix}1\\0\\0\\10^{-8}\end{bmatrix}
-\begin{bmatrix}1\\10^{-8}\\0\\0\end{bmatrix}
=\begin{bmatrix}0\\-10^{-8}\\0\\10^{-8}\end{bmatrix}.$$

Men denne resten har en negativ andre koordinat, akkurat som
$\widehat q_2$. Klassisk GS beregner ikke koeffisienten på nytt etter
subtraksjonen. Normaliseringen gir derfor

$$\textcolor{#c62828}{\widehat q_3
\approx\frac1{\sqrt2}(0,-1,0,1)^T}.$$

Nå er feilen stor og lett å se:

$$\begin{aligned}
\textcolor{#238443}{\widehat q_2}^{\,T}
\textcolor{#c62828}{\widehat q_3}
&\approx\frac12
\begin{bmatrix}0&-1&1&0\end{bmatrix}
\begin{bmatrix}0\\-1\\0\\1\end{bmatrix}\\
&=\frac{0+1+0+0}{2}=\frac12.
\end{aligned}$$

Begge vektorene har lengde omtrent én, men de er langt fra ortogonale.
Ingen tall er NaN. Forløpet er **avrunding i første normalisering →
liten ortogonalitetsfeil → koeffisient beregnet før resten oppdateres →
stor ortogonalitetsfeil**.

Neste spørsmål er derfor konkret: Hva skjer hvis vi beregner
komponenten langs $\widehat q_2$ **etter** at første bidrag er trukket
fra? Det undersøker vi med modifisert GS.

#### Kjør regningen og se komponentene

```{pyodide-python}
#| label: week4-cgs-worked
import numpy as np
import matplotlib.pyplot as plt
e = 1e-8
a1 = np.array([1., e, 0., 0.])
a2 = np.array([1., 0., e, 0.])
a3 = np.array([1., 0., 0., e])
print("e^2 =", e*e)
print("1 + e^2 i float64 =", np.float64(1) + e*e)
print("beregnet lengde av a1 =", np.linalg.norm(a1))
q1 = a1/np.linalg.norm(a1)
r12 = q1@a2
v2 = a2-r12*q1
q2 = v2/np.linalg.norm(v2)
r13, r23 = q1@a3, q2@a3
v3 = a3-r13*q1-r23*q2
q3 = v3/np.linalg.norm(v3)
for name, value in [('q1', q1), ('r12', r12), ('v2', v2), ('q2', q2),
                    ('r13', r13), ('r23', r23), ('v3', v3), ('q3', q3)]:
    print(name, '=', value)
print('q1 @ q2 =', q1@q2)
print('q2 @ q3 =', q2@q3)
fig, axes = plt.subplots(1, 2, figsize=(10, 3.5))
positions = np.arange(1, 5)
axes[0].bar(positions-.15, q2, width=.3, color='#238443', label='q2, beregnet')
axes[0].bar(positions+.15, q3, width=.3, color='#c62828', label='q3, beregnet')
axes[0].set_xticks(positions)
axes[0].set_xlabel('Komponentnummer')
axes[0].set_title('Samme negative komponent nr. 2')
axes[0].legend()
axes[1].bar(positions, q2*q3, color='#6a51a3')
axes[1].set_xticks(positions)
axes[1].set_xlabel('Komponentnummer')
axes[1].set_title('Bidrag til q2 @ q3: summen er 0.5')
for ax in axes:
    ax.axhline(0, color='black', linewidth=.8)
plt.tight_layout()
plt.show()
```

Endre $e$ til $10^{-4}$ og gjenta. Finn først hvilken komponent i $v_2$
som nå overlever. Sammenlign så de to indreproduktene. De viste
avrundingstrinnene gjelder dette eksemplet ved $10^{-8}$; ikke anta at
alle nesten avhengige piler feiler ved samme grense.

### Modifisert Gram–Schmidt {#uke4-mgs}

#### Prøv en ny måling på resten fra forsøket over

Etter at første del er trukket fra $a_3$, er resten $w=(0,-e,0,e)^T$.
Klassisk GS brukte målingen $\widehat q_2^Ta_3=0$. Hva skjer hvis vi i
stedet måler på $w$?

$$\widehat q_2^Tw=e/\sqrt2.$$

Denne målingen finner den gjenværende delen i retning $\widehat q_2$!
Trekk den fra:

$$w-\frac e{\sqrt2}\widehat q_2=(0,-e/2,-e/2,e)^T.$$

Den normaliserte pilen blir $(0,-1,-1,2)^T/\sqrt6$. Indreproduktet med
$\widehat q_2$ blir $(1-1)/\sqrt{12}=0$. Med $\widehat q_1$ er det
fortsatt en liten feil, $-e/\sqrt6$, så forsøket lover ikke perfekt regning.

Vi har bare endret *hvilken pil vi måler på*: resten etter forrige
subtraksjon. Denne varianten kalles **modifisert Gram–Schmidt**.

Klassisk Gram–Schmidt måler alle komponenter mot den opprinnelige kolonnen
$a_j$ før de trekkes fra. Modifisert Gram–Schmidt måler på nytt etter hver
rensing:

$$v\leftarrow a_j,$$

$$r_{ij}=q_i^Tv,\qquad v\leftarrow v-r_{ij}q_i,
\qquad i=1,\ldots,j-1,$$

$$r_{jj}=\lVert v\rVert_2,\qquad q_j=v/r_{jj}.$$

Kort sagt: Klassisk GS måler alle delene på den opprinnelige pilen. Modifisert GS
trekker fra én del, og måler deretter på resten.

På matrisefamilien under beholder MGS vanligvis ortogonaliteten lenger enn
CGS. Det er ikke en garanti for at feilen alltid avtar monotont, eller at MGS
er best for enhver matrise. Sammenlign derfor diagnostikken, ikke bare
algoritmenavnene.

```{pyodide-python}
#| label: week4-mgs-comparison
def modified_gram_schmidt(A, tolerance=None):
    A = np.asarray(A, dtype=float)
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    if not np.isfinite(A).all():
        raise ValueError("A må bare inneholde endelige tall")
    if tolerance is None:
        tolerance = np.finfo(float).eps * max(m, n) * np.linalg.norm(A, "fro")
    for j in range(n):
        v = A[:, j].copy()
        for i in range(j):
            R[i, j] = Q[:, i] @ v
            v = v - R[i, j]*Q[:, i]
        R[j, j] = np.linalg.norm(v)
        if not np.isfinite(R[j, j]):
            raise np.linalg.LinAlgError("Ikke-endelig rest under faktoriseringen")
        if R[j, j] <= tolerance:
            raise np.linalg.LinAlgError(
                f"Kolonne {j+1} gir ingen pålitelig ny retning"
            )
        Q[:, j] = v/R[j, j]
    return Q, R

epsilons = 10.0**(-np.arange(1, 16))
cgs_errors, mgs_errors = [], []
cgs_factor_errors, mgs_factor_errors = [], []
all_finite = []
for eps in epsilons:
    A_eps = np.vstack([np.ones((1, 3)), eps*np.eye(3)])
    Qc, Rc = classical_gram_schmidt(A_eps)
    # tolerance=0 brukes bare her for å eksponere feilutviklingen i hele sveipet.
    Qm, Rm = modified_gram_schmidt(A_eps, tolerance=0.0)
    cgs_errors.append(np.linalg.norm(Qc.T@Qc-np.eye(3), "fro"))
    mgs_errors.append(np.linalg.norm(Qm.T@Qm-np.eye(3), "fro"))
    scale = np.linalg.norm(A_eps, "fro")
    cgs_factor_errors.append(np.linalg.norm(A_eps-Qc@Rc, "fro")/scale)
    mgs_factor_errors.append(np.linalg.norm(A_eps-Qm@Rm, "fro")/scale)
    all_finite.append(all(np.isfinite(Z).all() for Z in [Qc, Rc, Qm, Rm]))

plt.loglog(epsilons, cgs_errors, "o-", label="klassisk GS")
plt.loglog(epsilons, mgs_errors, "s-", label="modifisert GS")
plt.gca().invert_xaxis()
plt.xlabel(r"$\varepsilon$")
plt.ylabel(r"$\|Q^TQ-I\|_F$")
plt.title("Tap av ortogonalitet for nesten parallelle kolonner")
plt.grid(True, which="both", alpha=0.25); plt.legend(); plt.show()
print("alle faktorer endelige i sveipet?", all(all_finite))
print("største relative faktoriseringsfeil, CGS:", max(cgs_factor_errors))
print("største relative faktoriseringsfeil, MGS:", max(mgs_factor_errors))
```

Les figuren mot mindre $\varepsilon$. Hvor begynner klassisk GS å miste
ortogonalitet i dette forsøket? Hvor mye lenger holder modifisert GS her?
Kontroller også at alle tall er endelige og den relative feilen
$\lVert A-QR\rVert_F/\lVert A\rVert_F$: Et lite rekonstruksjonsavvik
garanterer ikke alene at kolonnene i $Q$ er ortogonale.

::: {.callout-note collapse="true"}
#### Fordypning: hva bruker NumPy?

`numpy.linalg.qr` bruker ikke den pedagogiske Gram–Schmidt-koden over.
Robuste biblioteker bruker vanligvis **Householder-transformasjoner**:
speilinger som lager nuller uten de samme gjentatte subtraksjonene som
Gram–Schmidt. Vi utleder ikke Householder-metoden denne uken.
:::

## 4.5 Minste kvadrater og oppsummering

### Fra QR til minste kvadrater {#uke4-mk}

#### Når ingen linje treffer alt

Se på målingene $(-1,0.2),(0,0.9),(1,2.1),(2,2.8)$. For like store
skritt i første koordinat øker den andre med $0.7$, så $1.2$, så $0.7$.
En rett linje må ha samme økning hver gang. Derfor kan ingen linje treffe
alle fire målingene. Prøv linjen $p(t)=1+t$ på papir: feilene «måling minus
linje» blir $(0.2,-0.1,0.1,-0.2)^T$. Summen av kvadrerte feil er $0.10$.

Prøv så $p(t)=1.05+0.9t$: feilene blir $(0.05,-0.15,0.15,-0.05)^T$, og
summen av kvadratene blir $0.05$. Det er bedre. Hvordan finner vi den
minste mulige summen? Det er spørsmålet **minste kvadraters metode** løser.
Nedenfor bruker vi måle-og-bygge-oppskriften fra [projeksjonsforsøket](#uke4-projeksjon) for å finne svaret.

Anta at

$$A\in\mathbb R^{m\times k},\qquad m>k,$$

har full kolonnerang. Flere målinger enn parametre betyr ikke automatisk at
systemet er inkonsistent, men med støy vil vi vanligvis ha $b\notin C(A)$,
der $C(A)$ er kolonnerommet til $A$. Da finnes ingen $x$ som gir $Ax=b$. Vi
søker i stedet

$$x_*=\operatorname*{argmin}_x\lVert b-Ax\rVert_2.$$

Notasjonen $\operatorname*{argmin}_x$ betyr «den verdien av $x$ som gjør
uttrykket minst». Her er residualen $r=b-Ax$: forskjellen mellom målingene
$b$ og verdiene $Ax$ som modellen produserer.

Hvis $A=QR$ er en tynn QR-faktorisering, er kolonnene i $Q$ en ortonormal
basis for $C(A)$. For en vilkårlig vektor $b$ er $Q^Tb$ koordinatene til
projeksjonen av $b$ på $C(A)$; det er ikke koordinater for hele $b$ med
mindre $b\in C(A)$. Den delen av $b$ som modellen kan lage er $QQ^Tb$.

De to vektorene $b-QQ^Tb$ og $QQ^Tb-QRx$ er ortogonale. Pytagoras gir derfor

$$\lVert b-Ax\rVert_2^2
=\lVert b-QQ^Tb\rVert_2^2
+\lVert Q^Tb-Rx\rVert_2^2.$$

Det første leddet kan ikke påvirkes av $x$. Det andre blir null for den
entydige løsningen av

$$\boxed{Rx_*=Q^Tb.}$$

Residualen $r=b-Ax_*$ er det modellen ikke kan forklare, og den tilfredsstiller

$$Q^Tr=0\qquad\text{og dermed}\qquad A^Tr=0.$$

#### Et helt synlig eksempel

Vi tilpasser linjen $p(t)=c_0+c_1t$ til fire målinger. På papir er

$$A=\begin{bmatrix}1&-1\\1&0\\1&1\\1&2\end{bmatrix},\qquad
b=\begin{bmatrix}0.2\\0.9\\2.1\\2.8\end{bmatrix},\qquad
c=\begin{bmatrix}c_0\\c_1\end{bmatrix}.$$

```{pyodide-python}
#| label: week4-least-squares
t = np.array([-1.0, 0.0, 1.0, 2.0])
b = np.array([0.2, 0.9, 2.1, 2.8])
A = np.column_stack([np.ones_like(t), t])
Q, R = np.linalg.qr(A, mode="reduced")
c_qr = np.linalg.solve(R, Q.T @ b)
c_library, _, _, _ = np.linalg.lstsq(A, b, rcond=None)
r = b-A@c_qr
print("koeffisienter fra QR:   ", c_qr)
print("koeffisienter fra lstsq:", c_library)
print("residual:", r)
print("Q^T r =", Q.T @ r)
print("A^T r =", A.T @ r)

grid = np.linspace(-1.2, 2.2, 200)
plt.scatter(t, b, color="black", label="målinger")
plt.plot(grid, c_qr[0]+c_qr[1]*grid, label="minste kvadrater")
for ti, bi, fitted in zip(t, b, A@c_qr):
    plt.plot([ti, ti], [fitted, bi], color="#c62828", alpha=0.7)
plt.xlabel("t"); plt.ylabel("målt verdi")
plt.title("Residualene kan ikke fjernes, men de kan gjøres kortest")
plt.grid(alpha=0.25); plt.legend(); plt.show()
```

Her er

$$c_*=\begin{bmatrix}1.05\\0.90\end{bmatrix},\qquad
r=b-Ac_*=\begin{bmatrix}0.05\\-0.15\\0.15\\-0.05\end{bmatrix}.$$

De røde vertikale strekene i plottet viser komponentene i residualvektoren i
**datarommet** $\mathbb R^4$. De er ikke euklidske, vinkelrette avstander fra
punktene til den tegnede linjen i $(t,b)$-planet.

Dette er broen til ukeprosjektet: I uke 3 rekonstruerte vi et polynom fra
akkurat nok målinger. Nå bruker vi flere støyfylte målinger og finner
det beste svaret når et eksakt svar ikke finnes.

### Oppsummering og kontroll {#uke4-kontroll}

$$\text{retningsmåling}
\longrightarrow x^Tq
\longrightarrow \text{ortogonalitet}
\longrightarrow \text{projeksjon}
\longrightarrow \text{Gram--Schmidt}
\longrightarrow A=QR
\longrightarrow \text{minste kvadrater}.$$

Kontroller at du kan forklare følgende uten å starte med kode:

1. Hvorfor må en retningsmåler ha lengde én?
2. Hva betyr $x^Tq=0$ geometrisk?
3. Hvorfor gir $Q^Tx$ koordinatene når $Q^TQ=I$?
4. Hvilken del trekker Gram–Schmidt fra en ny kolonne?
5. Hvorfor produserer en avhengig kolonne `NaN` i den naive algoritmen?
6. Hvorfor kan nesten avhengige kolonner gi et endelig, men dårlig $Q$?
7. Hva er forskjellen mellom klassisk og modifisert Gram–Schmidt?
8. Hvorfor er minste-kvadraters residual ortogonal på kolonnerommet?

::: {.callout-tip collapse="true"}
#### Korte svar til egenkontroll

1. Ellers blander målingen retning og lengden til måleren.
2. Vektorene står vinkelrett; $q$ finner ingen komponent av $x$ i sin retning.
3. For $x\in C(Q)$ gir $x=Q(Q^Tx)$; ellers er de koordinatene til projeksjonen.
4. Projeksjonene på retningene som allerede er laget.
5. Eksakt avhengighet gir ingen ny retning; i det viste eksemplet deles
   nullvektoren på sin norm null.
6. En liten rest dannes ved kansellerende subtraksjoner og kan domineres av
   avrundingsfeil.
7. CGS måler mot den opprinnelige kolonnen; MGS måler mot den fortløpende
   rensede resten.
8. Pytagoras viser at den korteste residualen er delen utenfor $C(A)$.
:::

Gå videre til [prosjekt 4: Når målingene ikke passer](project_week4.qmd),
eller gå tilbake til [uke 3](uke3.qmd) hvis vektorrom, basis og kolonnerom
trenger en repetisjon.

## 4.6 Polynomer: fra uke 3 til prosjekt 4 {#uke4-polynomer}

### Samme polynom, flere målinger

I [uke 3, del 3.5](uke3.qmd#uke3-del5) brukte vi polynomer som vektorer og
polynomverdier som målinger. [Prosjekt 3](project_week3.qmd) undersøkte hvordan
punktene og basisen påvirker rekonstruksjonen. Nå beholder vi disse objektene,
men legger til flere målinger og støy. Hva skal vi gjøre når ingen oppskrift
passer alle målingene?

Begynn med et polynom vi kjenner:

$p_*(t)=1+t+\tfrac12t^2.$

Her bruker vi $t$ som variabel og $c_0,c_1,c_2$ som koeffisienter.
I rommet $\mathcal P_2$ av polynomer med grad høyst to skriver vi
$p(t)=c_0+c_1t+c_2t^2$. Tre forskjellige målepunkter bestemmer ett slikt
polynom entydig i eksakt regning. Ta nå fem punkter:

| $t_i$ | $p_*(t_i)$ | Lagt til målefeil | Måling $b_i$ |
|---|---:|---:|---:|
| $-1$ | $0.5$ | $0.01$ | $0.51$ |
| $-1/2$ | $0.625$ | $-0.04$ | $0.585$ |
| $0$ | $1$ | $0.06$ | $1.06$ |
| $1/2$ | $1.625$ | $-0.04$ | $1.585$ |
| $1$ | $2.5$ | $0.01$ | $2.51$ |

Forutsi: Kan ett andregradspolynom treffe alle fem nye verdiene?
Det er ikke antallet alene som gjør det umulig; uten støy ville $p_*$
truffet alle fem. Vi undersøker hva akkurat disse feilene gjør nedenfor.

### Les av hver byggestein før vi lager matrisen

Les først av de tre basispolynomene $1,t,t^2$ hver for seg:

$a_0=(1,1,1,1,1)^T,\qquad
 a_1=(-1,-1/2,0,1/2,1)^T,\qquad
 a_2=(1,1/4,0,1/4,1)^T.$

For å lage de fem verdiene til $p(t)=c_0+c_1t+c_2t^2$ bygger vi

$c_0a_0+c_1a_1+c_2a_2.$

Dette er nøyaktig samme byggeoperasjon som med bildemønstrene. Matrisen
samler bare de tre ferdige vektorene av polynomverdier som kolonner:

$A=[a_0\ a_1\ a_2]=
\begin{bmatrix}
1&-1&1\\1&-1/2&1/4\\1&0&0\\1&1/2&1/4\\1&1&1
\end{bmatrix},\qquad
c=\begin{bmatrix}c_0\\c_1\\c_2\end{bmatrix},\qquad
b=\begin{bmatrix}0.51\\0.585\\1.06\\1.585\\2.51\end{bmatrix}.$

$Ac$ er altså fem **polynomverdier**, mens $c$ er tre **koeffisienter**.
Det er vektorene av polynomverdier i $\mathbb R^5$ vi nå skal gjøre ortogonale.

### Hvorfor trenger vi nye måleretninger?

Prøv å bruke $a_0$ og $a_2$ som uavhengige målere:

$a_0^Ta_2=1+\tfrac14+0+\tfrac14+1=\tfrac52.$

En ren $t^2$-del gir dermed også utslag på måleren for konstant nivå.
Vi kan ikke lese byggekoeffisientene direkte fra disse indreproduktene.

Bruk Gram–Schmidt på de tre vektorene av polynomverdier. Første pil normaliseres:

$q_0=a_0/\sqrt5.$

Den andre har allerede null måling på første pil, fordi
$-1-1/2+0+1/2+1=0$. Derfor er

$q_1=a_1/\sqrt{5/2}.$

Fra tredje pil må vi trekke fra den konstante delen:

$q_0^Ta_2=\frac{5/2}{\sqrt5}=\frac{\sqrt5}{2},\qquad
v_2=a_2-\tfrac12a_0=(1/2,-1/4,-1/2,-1/4,1/2)^T.$

Vi kontrollerer begge retningene ledd for ledd:

$q_0^Tv_2=\frac{1/2-1/4-1/2-1/4+1/2}{\sqrt5}=0,$
$q_1^Tv_2=
\frac{(-1)(1/2)+(-1/2)(-1/4)+0(-1/2)+(1/2)(-1/4)+1(1/2)}
{\sqrt{5/2}}
=\frac{-1/2+1/8-1/8+1/2}{\sqrt{5/2}}=0.$

Dermed trenger vi ikke trekke fra noe mer. Lengden beregnes fra de fem
komponentene:

$\lVert v_2\rVert_2^2
=(1/2)^2+(-1/4)^2+(-1/2)^2+(-1/4)^2+(1/2)^2
=\frac14+\frac1{16}+\frac14+\frac1{16}+\frac14=\frac78.$

Vi deler hver komponent på $\sqrt{7/8}$ og får

$q_2=\frac{(1/2,-1/4,-1/2,-1/4,1/2)^T}{\sqrt{7/8}}.$ Vi har nå tre ortonormale piler
som bygger akkurat de samme mulige vektorene av polynomverdier som før.

Les oppskriftene baklengs, og samle dem til slutt:

$a_0=\sqrt5q_0,\quad a_1=\sqrt{5/2}q_1,\quad
 a_2=\tfrac{\sqrt5}{2}q_0+\sqrt{7/8}q_2,$

$A=QR,\qquad Q=[q_0\ q_1\ q_2],\qquad
R=\begin{bmatrix}\sqrt5&0&\sqrt5/2\\0&\sqrt{5/2}&0\\0&0&\sqrt{7/8}\end{bmatrix}.$

### Hva betyr ortogonale polynomer her?

De nye pilene inneholder verdiene av polynomene

$\phi_0(t)=1/\sqrt5,\qquad \phi_1(t)=t/\sqrt{5/2},\qquad
\phi_2(t)=(t^2-1/2)/\sqrt{7/8}.$

Test for eksempel $\phi_0$ og $\phi_2$: Gang verdiene i hvert målepunkt
og summer. Svaret blir null, fordi dette er $q_0^Tq_2$.
Dette motiverer et **diskret indreprodukt** på polynomer:

$\langle f,g\rangle_{\rm punkter}=\sum_{i=1}^{5}f(t_i)g(t_i).$

For disse punktene er $\phi_0,\phi_1,\phi_2$ ortonormale med denne regelen.
På $\mathcal P_2$ er dette et indreprodukt: Et ikke-null andregradspolynom
kan ikke være null i alle fem forskjellige punkter. På rommet av *alle*
polynomer ville denne testen ikke skille nullpolynomet fra et polynom med
nuller i alle målepunktene.

Ortogonale **koeffisientlister** er noe annet: $(1,0,0)^T$ og $(0,0,1)^T$
er ortogonale som lister, men polynomverdiene for $1$ og $t^2$ var ikke det.
Vi må alltid si hvilken måleregel og hvilke punkter vi bruker.

### Mål dataene og bygg den delen polynomene kan forklare

Mål først $d_i=q_i^Tb$. Bygg så $\widehat b=d_0q_0+d_1q_1+d_2q_2$.
Dette er den delen av de fem målingene som kan lages av et polynom i
$\mathcal P_2$. Kortformen er $d=Q^Tb$ og $\widehat b=Qd$.
For å finne koeffisientene i den opprinnelige basisen løser vi $Rc=d$.
**Komponentene $d$ er ikke monomialkoeffisientene $c$.**

#### Først de tre målingene

Vi regner med de ortonormale pilene fra håndregningen:

$d_0=q_0^Tb
=\frac{0.51+0.585+1.06+1.585+2.51}{\sqrt5}
=\frac{6.25}{\sqrt5}=\frac54\sqrt5,$

$d_1=q_1^Tb
=\frac{-0.51-0.2925+0+0.7925+2.51}{\sqrt{5/2}}
=\frac{2.5}{\sqrt{5/2}}=\sqrt{5/2},$

$d_2=q_2^Tb
=\frac{0.255-0.14625-0.53-0.39625+1.255}{\sqrt{7/8}}
=\frac{0.4375}{\sqrt{7/8}}=\frac12\sqrt{7/8}.$

#### Så tilbake til monomialkoeffisientene

Likningen $Rc=d$ betyr tre vanlige ligninger:

$\sqrt5\,c_0+\frac{\sqrt5}{2}c_2=\frac54\sqrt5,$
$\sqrt{5/2}\,c_1=\sqrt{5/2},$
$\sqrt{7/8}\,c_2=\frac12\sqrt{7/8}.$

Start nederst: $c_2=1/2$. Den midterste gir $c_1=1$. Sett $c_2$ inn i den
første og del på $\sqrt5$:

$c_0+\frac12\cdot\frac12=\frac54
\quad\Longrightarrow\quad c_0=\frac54-\frac14=1.$

Dette er baklengs innsetting: Vi finner først koeffisienten som står alene,
og bruker den i ligningene over. Polynomet blir
$p(t)=1+t+\tfrac12t^2$.

#### Bygg verdiene og trekk dem fra dataene

$\widehat b=a_0+a_1+\tfrac12a_2
=\begin{bmatrix}1-1+1/2\\1-1/2+1/8\\1+0+0\\1+1/2+1/8\\1+1+1/2\end{bmatrix}
=\begin{bmatrix}0.5\\0.625\\1\\1.625\\2.5\end{bmatrix}.$

Resten finnes komponentvis:

$b-\widehat b=
\begin{bmatrix}0.51-0.5\\0.585-0.625\\1.06-1\\1.585-1.625\\2.51-2.5\end{bmatrix}
=\begin{bmatrix}0.01\\-0.04\\0.06\\-0.04\\0.01\end{bmatrix}.$

Altså får vi $c=(1,1,1/2)^T$, og resten blir

$r=b-\widehat b=0.01(1,-4,6,-4,1)^T.$

Kontroller for hånd:

$a_0^Tr=0.01(1-4+6-4+1)=0,$
$a_1^Tr=0.01(-1+2-2+1)=0,\qquad
 a_2^Tr=0.01(1-1-1+1)=0.$

Resten står dermed vinkelrett på *alle* vektorer av polynomverdier vi kan bygge.
Den er ikke null, så ingen andregradspolynom treffer alle målingene.
Enhver endring i koeffisientene legger til en del langs byggeretningene;
Pytagoras viser at den bare øker kvadratfeilen. Her er minimum
$\lVert r\rVert_2^2=0.01^2+(-0.04)^2+0.06^2+(-0.04)^2+0.01^2=0.007$.

At vi finner tilbake til $p_*$ skyldes at støyen er valgt ortogonal på
byggeretningene. Vanlig målefeil har også deler langs disse retningene og
vil som regel endre det tilpassede polynomet.

```{pyodide-python}
#| label: week4-polynomial-bridge
import numpy as np
import matplotlib.pyplot as plt
from numpy.polynomial import polynomial as poly
from numpy.polynomial import chebyshev as cheb

def polynomial_bridge(noise_scale=0.01):
    points = np.array([-1., -.5, 0., .5, 1.])
    reference = 1+points+.5*points**2
    noise = noise_scale*np.array([1., -4., 6., -4., 1.])
    measured = reference+noise
    A = np.column_stack([np.ones(5), points, points**2])
    Q, R = np.linalg.qr(A, mode='reduced')
    detected = Q.T@measured
    coefficients = np.linalg.solve(R, detected)
    fitted = A@coefficients
    residual = measured-fitted

    # Samme polynomrom i Chebyshev-basis: T0=1, T1=t, T2=2t²-1.
    C = cheb.chebvander(points, 2)
    cheb_coefficients = np.linalg.lstsq(C, measured, rcond=None)[0]
    grid = np.linspace(-1, 1, 301)
    fig, axes = plt.subplots(1, 2, figsize=(11, 4))
    axes[0].scatter(points, measured, color='black', label='målinger')
    axes[0].plot(grid, poly.polyval(grid, coefficients), color='#1565c0', label='tilpasset polynom')
    axes[0].plot(grid, cheb.chebval(grid, cheb_coefficients), '--', color='#238443', label='Chebyshev-tilpasning')
    axes[0].vlines(points, fitted, measured, color='#c62828', label='residualkomponenter')
    axes[0].set_xlabel('t'); axes[0].set_ylabel('polynomverdi'); axes[0].legend()
    axes[1].bar(np.arange(3), A.T@residual, color='#c62828')
    axes[1].set_xticks(np.arange(3), ['a0', 'a1', 'a2'])
    axes[1].set_ylim(-.01, .01)
    axes[1].set_title('Resten målt mot hver byggestein')
    axes[1].set_ylabel('indreprodukt'); axes[1].axhline(0, color='black', linewidth=.8)
    plt.tight_layout(); plt.show()
    print('Monomialkoeffisienter:', coefficients)
    print('Chebyshev-koeffisienter:', cheb_coefficients)
    print('Residual:', residual)
    print('Kvadratfeil:', residual@residual)
    print('A.T @ residual:', A.T@residual)
    print('Q.T @ residual:', Q.T@residual)
    print('Samme kurve i begge basiser?', np.allclose(poly.polyval(grid, coefficients), cheb.chebval(grid, cheb_coefficients)))

polynomial_bridge()
```

NumPy kan velge andre fortegn på kolonnene i $Q$ enn i håndregningen.
Da endres også $R$ og komponentene $d$, men sluttpolynomet er det samme.
De røde strekene viser feil i de fem målte verdiene, ikke vinkelrette
avstander til kurven i tegneplanet.

**Prøv:** Øk bare `noise_scale`. Hvorfor vokser residualen uten at
polynomet endrer seg? Bytt så støyvektoren i funksjonen med
`noise_scale*np.array([1., 0., 0., 0., 0.])`. Forutsi hvilke målinger på
byggeretningene som nå blir ulike null, og se hvordan polynomet endres.

### Chebyshev-basis er ikke automatisk det samme som QR

Fra uke 3 kjenner vi $T_0(t)=1$, $T_1(t)=t$ og $T_2(t)=2t^2-1$.
Det samme polynomet kan skrives

$1+t+\tfrac12t^2=\tfrac54T_0(t)+T_1(t)+\tfrac14T_2(t).$

Koeffisientene er forskjellige, men kurven er den samme. Monomial- og
Chebyshev-målematrisene bygger det samme rommet av måleverdier.
Derfor gir minste kvadrater samme tilpassede polynom i eksakt regning
når grad, punkter og data holdes fast. Numerisk kan basisvalget påvirke
hvor pålitelig vi klarer å beregne det.

Chebyshev-navnet alene garanterer ikke ortonormale kolonner i målematrisen.
Prøv punktene $-1,0,1$: Verdiene av $T_0$ og $T_2$ er $(1,1,1)^T$
og $(1,-1,1)^T$, med indreprodukt $1$. QR lager ortonormale måleretninger
for akkurat matrisen og punktene vi har valgt.

### Ta dette med til prosjekt 4

| Fra uke 3 | Verktøyet i uke 4 | Undersøk i prosjektet |
|---|---|---|
| Polynomet bygges av basispolynomer | Kolonnene inneholder verdiene av hver byggestein | Skriv dimensjoner og kontroller rang. |
| Målepunktene kan skjule endringer mellom punktene | Liten residual beskriver bare treff ved målepunktene | Kontroller også kurven mellom punktene. |
| Monomial- og Chebyshev-koordinater beskriver samme polynom | QR gjør kolonnene i målematrisen ortonormale | Hold data fast og sammenlign basisene. |
| Små forstyrrelser kan gi store utslag | CGS og MGS kan gi ulik ortogonalitetsfeil | Mål både residual, ortogonalitet og rekonstruksjon. |

Gå videre til [prosjekt 4 – Når målingene ikke passer](project_week4.qmd).
Del 5–6 bruker polynomene og de to basisene; del 7–9 sammenligner metodene
og lar deg reparere en vanskelig rekonstruksjon. Alle nødvendige
hjelpefunksjoner finnes allerede i prosjektet; ingen kode må kopieres fra
denne fanen eller fra uke 3.

## 4.7 Oppgaver {#uke4-oppgaver}

Arbeid først på papir, og bruk deretter kode til å undersøke det du fant.
Oppgave 1–3 er hovedløpet; 4–6 undersøker numeriske feil og hva «god løsning»
betyr. Beregn omtrent 2–3 timer for hele settet. Alle nødvendige data er
oppgitt her, og hver kodeoppgave importerer sine egne biblioteker.

I matematikkfeltene kan du skrive for eksempel `sqrt(2)` og `1/sqrt(3)`.
Kodeoppgavene kontrollerer funksjonen du skriver på flere datasett.
De åpne forklaringene skriver du i egne notater; de vurderes ikke automatisk.
Et grønt resultat erstatter derfor ikke begrunnelsen.

### Finn det skjulte mønsteret

Et signal er en liste med åtte målinger. Tre mulige byggesteiner er

$$q_1=\frac{(1,1,1,1,1,1,1,1)^T}{\sqrt8},\quad
q_2=\frac{(1,-1,1,-1,1,-1,1,-1)^T}{\sqrt8},$$
$$q_3=\frac{(1,1,-1,-1,1,1,-1,-1)^T}{\sqrt8}.$$

Det første mønsteret måler konstant nivå, det andre veksling fra måling til
måling, og det tredje veksling mellom par. Kontroller lengdene og minst to
indreprodukter før du bruker dem som uavhengige målere.

Signalet er

$$x=(6,4,2,0,4,2,0,-2)^T.$$

Mål $c_i=q_i^Tx$ hver for seg. Bygg så $p=c_1q_1+c_2q_2+c_3q_3$ og finn
resten $r=x-p$. Ikke begynn med matriseproduktet.

```{math-exercise}
#| label: week4-task-pattern-readings
#| caption: Tre mønstre og en uforklart rest
#| mode: equivalent
#| partial-credit: true
#| field-labels: c₁, c₂, c₃, restens lengde

$c_1=$ __[2*sqrt(8)]

$c_2=$ __[sqrt(8)]

$c_3=$ __[2*sqrt(8)]

$\lVert r\rVert_2=$ __[sqrt(8)]
```

**Forklar:** Resten har null måling på alle tre mønstrene. Hvorfor betyr
ikke dette at resten er null? Hvilket fjerde mønster ville forklart den?

**Kode:** Samle mønstrene som kolonnene i $Q$. Fullfør `decompose(Q, x)`;
returner målingene, rekonstruksjonen og resten i denne rekkefølgen.
Forutsett at kolonnene i $Q$ er ortonormale.

```{py-exercise}
#| label: week4-task-pattern-code
#| caption: Mål, rekonstruer og undersøk resten
import numpy as np

def decompose(Q, x):
    # TODO: beregn c, p og r. Returner tre NumPy-vektorer.
    return None

Q = np.array([[1,1,1,1,1,1,1,1],
              [1,-1,1,-1,1,-1,1,-1],
              [1,1,-1,-1,1,1,-1,-1]], dtype=float).T/np.sqrt(8)
x = np.array([6,4,2,0,4,2,0,-2], dtype=float)
# Etter at funksjonen virker: sammenlign decompose(Q, x) med
# decompose(Q, x + np.array([1,0,0,0,0,0,0,0])).

## TESTS ##
result = decompose(Q, x)
assert isinstance(result, (tuple, list)) and len(result) == 3, 'Returner c, p, r i denne rekkefølgen.'
c, p, r = map(np.asarray, result)
assert c.shape == (3,) and p.shape == r.shape == (8,), 'Tre målinger, men åtte signalverdier.'
assert np.allclose(c, [2*np.sqrt(8),np.sqrt(8),2*np.sqrt(8)]), 'Hver måling er ett indreprodukt med et mønster.'
assert np.allclose(r, [1,1,1,1,-1,-1,-1,-1]), 'Trekk den gjenoppbygde delen fra signalet.'
assert np.allclose(p+r, x), 'De to delene må gi det opprinnelige signalet.'
changed = x.copy(); changed[0] += 1
c2, p2, r2 = decompose(Q, changed)
assert np.allclose(np.asarray(c2)-c, np.ones(3)/np.sqrt(8)), 'Første måling inngår med samme vekt i alle tre mønstrene.'
assert np.allclose(Q.T@r2, 0), 'Resten skal gi null på hver av de valgte målerne.'
Qtest = np.array([[1.,0.],[0.,0.],[0.,1.]])
z = np.array([2.,5.,-3.])
ct, pt, rt = decompose(Qtest, z)
assert np.allclose(ct,[2,-3]) and np.allclose(pt,[2,0,-3]) and np.allclose(rt,[0,5,0]), 'Funksjonen må også virke med andre ortonormale piler.'
```

Forutsi hva som skjer med alle tre målingene når bare første måling økes
med $1$. Forklar svaret ut fra komponentene i $q_i$, ikke bare utskriften.

### Når målinger ikke er koordinater

Vi bruker nå tre andre enhetspiler i $\mathbb R^4$:

$$u_1=(1,0,0,0)^T,\quad
u_2=(1,1,0,0)^T/\sqrt2,\quad
u_3=(0,1,1,1)^T/\sqrt3.$$

De er lineært uavhengige. Bygg

$$x=2u_1-\sqrt2\,u_2+\sqrt3\,u_3=(1,0,1,1)^T.$$

Byggekoeffisientene er dermed kjent. Vil målingene $u_i^Tx$ gi disse
koeffisientene tilbake? Regn før du leser videre.

```{math-exercise}
#| label: week4-task-nonorthogonal
#| caption: Sammenlign oppskrift og målinger
#| mode: equivalent
#| partial-credit: true
#| field-labels: u₁ᵀx, u₂ᵀx, u₃ᵀx, u₁ᵀu₂, u₂ᵀu₃

$u_1^Tx=$ __[1]

$u_2^Tx=$ __[1/sqrt(2)]

$u_3^Tx=$ __[2/sqrt(3)]

$u_1^Tu_2=$ __[1/sqrt(2)]

$u_2^Tu_3=$ __[1/sqrt(6)]
```

**Forklar feilen i påstanden:** «Alle pilene har lengde én, derfor leser
hver pil av sin egen byggekoeffisient.» Bruk ett av indreproduktene du fant.

Skriv først ut

$$u_1^Tx=2(u_1^Tu_1)-\sqrt2(u_1^Tu_2)+\sqrt3(u_1^Tu_3).$$

Gjør tilsvarende for de to andre pilene. Samle deretter pilene i
$U=[u_1\ u_2\ u_3]$ og koeffisientene i $c=(2,-\sqrt2,\sqrt3)^T$.
Forklar nå likningen $U^Tx=(U^TU)c$: Hvilke oppføringer i $U^TU$ gjør at
målingene påvirkes av flere byggekoeffisienter?

### Bygg QR og bruk den

Tre byggesteiner i $\mathbb R^4$ er

$$a_1=(1,1,0,0)^T,\quad a_2=(1,0,1,0)^T,\quad a_3=(1,0,0,1)^T.$$

Utfør Gram–Schmidt på papir. Bruk positive lengder $r_{jj}$ når du
normaliserer. Vis spesielt resten etter begge subtraksjonene fra $a_3$.
Kontroller at denne resten er ortogonal på både $q_1$ og $q_2$.

```{math-exercise}
#| label: week4-task-qr-paper
#| caption: Mellomregninger og byggeoppskrifter
#| mode: equivalent
#| partial-credit: true
#| field-labels: r₁₁, r₁₂, r₂₂, r₁₃, r₂₃, r₃₃

$r_{11}=$ __[sqrt(2)]

$r_{12}=$ __[1/sqrt(2)]

$r_{22}=$ __[sqrt(6)/2]

$r_{13}=$ __[1/sqrt(2)]

$r_{23}=$ __[1/sqrt(6)]

$r_{33}=$ __[2/sqrt(3)]
```

Skriv $a_1,a_2,a_3$ som summer av de nye pilene. Samle så oppskriftene
som $A=QR$. For $b=(1,2,3,4)^T$ skal du finne $c$ slik at $Ac$ ligger
nærmest $b$. Regn $Q^Tb$, løs $Rc=Q^Tb$, og skriv opp resten $b-Ac$.

```{math-exercise}
#| label: week4-task-qr-fit
#| caption: Den beste representerbare vektoren
#| mode: equivalent
#| partial-credit: true
#| field-labels: c₁, c₂, c₃, residualens lengde

$c_1=$ __[0]

$c_2=$ __[1]

$c_3=$ __[2]

$\lVert b-Ac\rVert_2=$ __[4]
```

**Kode:** Fullfør modifisert GS og løsningen nedenfor. Algoritmen skal
fungere for en matrise med $m\ge k$ og full kolonnerang. Ikke bruk ferdig
`qr` eller `lstsq` i funksjonen. `solve` er tillatt for det triangulære
systemet. Målingen i den indre løkken skal tas på den oppdaterte resten.

```{py-exercise}
#| label: week4-task-qr-code
#| caption: Fra vektorløkke til minste kvadrater
import numpy as np

def fit_with_gs(A, b):
    A = np.asarray(A, dtype=float)
    m, k = A.shape
    Q = np.zeros((m,k))
    R = np.zeros((k,k))
    for j in range(k):
        v = A[:,j].copy()
        for i in range(j):
            # TODO: mål på v, fyll R[i,j], og trekk delen fra v.
            pass
        # TODO: fyll R[j,j] og Q[:,j] ved å normalisere v.
    # TODO: løs for c. Returner Q, R, c.
    return None

A = np.array([[1,1,1],[1,0,0],[0,1,0],[0,0,1]], dtype=float)
b = np.array([1,2,3,4], dtype=float)

## TESTS ##
out = fit_with_gs(A,b)
assert isinstance(out,(tuple,list)) and len(out)==3, 'Returner Q, R, c.'
Q,R,c = map(np.asarray,out)
assert Q.shape==(4,3) and R.shape==(3,3) and c.shape==(3,), 'Kontroller dimensjonene til den tynne faktoriseringen.'
assert np.allclose(Q.T@Q,np.eye(3)), 'Mål på resten, trekk fra, og normaliser hver nye pil.'
assert np.allclose(Q@R,A), 'R må bevare alle byggekoeffisientene.'
assert np.allclose(np.tril(R,-1),0) and np.all(np.diag(R)>0), 'R skal være øvre triangulær med positive normaliseringslengder.'
assert np.allclose(c,[0,1,2]), 'Løs R c = Q.T @ b, ikke A c = b.'
assert np.allclose(A.T@(b-A@c),0), 'Residualen skal være ortogonal på alle opprinnelige byggesteiner.'
T=np.array([[2.,1.],[0.,1.],[1.,-1.],[1.,2.],[0.,3.]])
z=np.array([1.,-2.,3.,0.,4.])
Qt,Rt,ct=fit_with_gs(T,z)
assert np.allclose(Qt@Rt,T) and np.allclose(Qt.T@Qt,np.eye(2)), 'Løkken må fungere med andre antall rader og kolonner.'
assert np.allclose(ct,np.linalg.lstsq(T,z,rcond=None)[0]), 'Test også høyresider som ikke kan representeres eksakt.'
```

**Begrunn optimaliteten:** Hvorfor vil en endring av $c$ legge en ny del
*langs* byggeretningene til en rest som allerede står vinkelrett på dem?
Bruk Pytagoras til å forklare hvorfor feilen ikke kan bli mindre.

### En nesten usynlig feil blir stor

Sett $e=10^{-8}$ og bruk

$$a_1=(1,e,0,0)^T,\quad a_2=(1,0,e,0)^T,\quad a_3=(1,0,0,e)^T.$$

I float64 avrundes $1+e^2$ til $1$. Etter første normalisering har vi
$\widehat q_1=(1,e,0,0)^T$, og den beregnede andre resten er
$\widehat v_2=(0,-e,e,0)^T$. I eksakt regning ville første komponent vært
$e^2/(1+e^2)$. Følg konsekvensene selv; ikke hopp rett til sluttproduktet.

```{math-exercise}
#| label: week4-task-rounding
#| caption: Fra en tapt komponent til feil retning
#| mode: equivalent
#| partial-credit: true
#| field-labels: tapt komponent omtrent, q₂ andre komponent, beregnet r₂₃, q₂ᵀq₃

Den tapte komponenten er omtrent __[10^(-16)].

Andre komponent i $\widehat q_2=\widehat v_2/\lVert\widehat v_2\rVert_2$ er __[-1/sqrt(2)].

Klassisk GS måler $\widehat r_{23}=\widehat q_2^Ta_3=$ __[0].

Etter tredje normalisering blir $\widehat q_2^T\widehat q_3=$ __[1/2].
```

**Kode:** Begge algoritmene ligger i samme funksjon. Den ene manglende
linjen bestemmer om målingen tas på opprinnelig pil eller oppdatert rest.
Fullfør også de to diagnostikkene. Returner
$(\lVert Q^TQ-I\rVert_F,\lVert A-QR\rVert_F/\lVert A\rVert_F)$.
Funksjonen brukes her bare på uavhengige kolonner med ikke-null rester.

```{py-exercise}
#| label: week4-task-cgs-mgs
#| caption: Samme piler, to beregningsmåter
import numpy as np

def compare_gs(A, modified):
    A = np.asarray(A,dtype=float)
    m,k = A.shape
    Q = np.zeros((m,k)); R = np.zeros((k,k))
    for j in range(k):
        v = A[:,j].copy()
        for i in range(j):
            source = A[:,j]  # TODO: bruk v når modified er True.
            R[i,j] = Q[:,i]@source
            v = v-R[i,j]*Q[:,i]
        R[j,j] = np.linalg.norm(v)
        Q[:,j] = v/R[j,j]
    # TODO: returner ortogonalitetsfeil og relativ rekonstruksjonsfeil.
    return None

# Etter utfylling: skriv en tabell for e=1e-4, 1e-8 og 1e-12.
# A = np.vstack([np.ones((1,3)), e*np.eye(3)])
# Bruk begge verdiene av modified på hver matrise.

## TESTS ##
A=np.vstack([np.ones((1,3)),1e-8*np.eye(3)])
u=compare_gs(A,False); v=compare_gs(A,True)
assert isinstance(u,(tuple,list)) and len(u)==2, 'Returner to diagnostikker i oppgitt rekkefølge.'
assert isinstance(v,(tuple,list)) and len(v)==2, 'Begge varianter skal returnere to diagnostikker.'
assert np.isfinite(u).all() and np.isfinite(v).all(), 'Ingen av disse forsøkene skal gi NaN eller Inf.'
assert .6<u[0]<.8, 'CGS skal her vise stor ortogonalitetsfeil. Måler du mot opprinnelig kolonne?'
assert 0<=v[0]<1e-6, 'MGS skal her måle mot resten etter forrige subtraksjon.'
assert 0<=u[1]<1e-12 and 0<=v[1]<1e-12, 'Begge bygger likevel A godt opp igjen. Kontroller relativ rekonstruksjonsfeil.'
for e in [1e-4,1e-12]:
    B=np.vstack([np.ones((1,3)),e*np.eye(3)])
    for modified in [False,True]:
        orth,recon=compare_gs(B,modified)
        assert np.isfinite([orth,recon]).all() and orth>=0 and 0<=recon<1e-12, 'Kontroller normene og normaliseringen også for andre e.'
```

**Forklar:** Hvordan kan begge algoritmene ha liten rekonstruksjonsfeil når
bare én gir gode måleretninger? Knytt forklaringen til det tapte leddet og
normaliseringen, og til [prosjekt 1](project_week1.qmd). Unngå påstanden
«MGS er alltid stabil»; beskriv hva akkurat disse forsøkene viser.

### Kan et ekstra datapunkt gjøre tilpasningen dårligere?

De tre punktene $(-1,0),(0,1),(1,2)$ ligger på linjen $p(t)=1+t$.
Legg til målingen $(2,6)$. Før du regner: Vil den nye beste linjen fortsatt
treffe de tre gamle punktene? Hva mener vi egentlig med «dårligere»?

Vi skriver linjen som $p(t)=c_0+c_1t$. Første kolonne i designmatrisen er
énere og andre kolonne inneholder $t$-verdiene:

$$A_{\rm ny}=\begin{bmatrix}1&-1\\1&0\\1&1\\1&2\end{bmatrix},\qquad
b_{\rm ny}=(0,1,2,6)^T.$$

```{math-exercise}
#| label: week4-task-extra-point
#| caption: Sammenlign på samme datasett
#| mode: equivalent
#| partial-credit: true
#| field-labels: ny c₀, ny c₁, ny linje gamle punkter, ny linje alle punkter, gammel linje alle punkter

For den nye minste-kvadraters linjen er $c_0=$ __[13/10] og $c_1=$ __[19/10].

Summen av kvadrerte feil for den nye linjen på de tre gamle punktene er __[189/100].

På alle fire punktene er summen for den nye linjen __[27/10].

På alle fire punktene er summen for den gamle linjen $1+t$ __[9].
```

**Kode:** Lag `compare_point(t, y, t_new, y_new)`. Returner de nye
koeffisientene, kvadratfeilen til ny linje på gamle punkter, kvadratfeilen
til ny linje på alle punkter og kvadratfeilen til gammel linje på alle
punkter. Bruk `np.linalg.lstsq` og rekkefølgen $(c_0,c_1)$.

```{py-exercise}
#| label: week4-task-extra-point-code
#| caption: Hvilken feil ble større?
import numpy as np

def compare_point(t, y, t_new, y_new):
    # TODO: tilpass før og etter; evaluer begge linjene på oppgitte data.
    return None

## TESTS ##
out=compare_point(np.array([-1.,0.,1.]),np.array([0.,1.,2.]),2.,6.)
assert isinstance(out,(tuple,list)) and len(out)==4, 'Returner koeffisienter og tre summer av kvadrerte feil.'
c,old_error,total_error,old_line_error=out
assert np.allclose(c,[1.3,1.9]), 'Første kolonne må være énere; koeffisientrekkefølgen er konstantledd, stigning.'
assert np.allclose([old_error,total_error,old_line_error],[1.89,2.7,9.]), 'Skill mellom hvilken linje og hvilket datasett du vurderer.'
for t,y,tn,yn in [(np.array([0.,1.,2.]),np.array([1.,3.,5.]),3.,7.),
                  (np.array([-2.,0.,3.]),np.array([1.,-1.,4.]),1.,8.)]:
    c,e_old,e_all,e_before=compare_point(t,y,tn,yn)
    A=np.column_stack([np.ones(t.size),t]); T=np.append(t,tn); Y=np.append(y,yn)
    B=np.column_stack([np.ones(T.size),T])
    cb=np.linalg.lstsq(A,y,rcond=None)[0]; ca=np.linalg.lstsq(B,Y,rcond=None)[0]
    assert np.allclose(c,ca), 'Funksjonen må også tilpasse andre målinger.'
    expected=[np.sum((y-A@ca)**2),np.sum((Y-B@ca)**2),np.sum((Y-B@cb)**2)]
    assert np.allclose([e_old,e_all,e_before],expected), 'Beregn kvadratfeilene på riktig kombinasjon av linje og data.'
```

**Diskuter:** Den gamle linjen hadde feil null på tre punkter. Den nye har
feil $2.7$ på fire punkter. Hvorfor er ikke denne sammenligningen alene et
argument mot minste kvadrater? Hvilken sammenligning viser at metoden har
funnet en forbedring på det nye problemet?

### Avslør en falsk kvalitetskontroll

En medstudent hevder: «Hvis $QR=A$, kan vi finne minste-kvadraters løsningen
fra $Rc=Q^Tb$.» Undersøk følgende eksakte moteksempel:

$$A=\begin{bmatrix}1&0\\0&1\\0&0\end{bmatrix},\quad
Q=\begin{bmatrix}2&0\\0&1\\0&0\end{bmatrix},\quad
R=\begin{bmatrix}1/2&0\\0&1\end{bmatrix},\quad b=(1,2,3)^T.$$

Kontroller først $QR=A$ på papir. Kontroller deretter lengdene til kolonnene
i $Q$. Finn både kandidaten fra $Rc=Q^Tb$ og den faktiske beste løsningen.

```{math-exercise}
#| label: week4-task-false-qr
#| caption: Eksakt produkt, feil minste-kvadraters løsning
#| mode: equivalent
#| partial-credit: true
#| field-labels: QᵀQ første diagonal, kandidat c₁, kandidat c₂, optimal c₁, optimal c₂, kandidat kvadratfeil, optimal kvadratfeil

Første diagonaloppføring i $Q^TQ$ er __[4].

Kandidaten fra $Rc=Q^Tb$ er $c=($ __[4], __[2] $)^T$.

Den optimale løsningen er $c_*=($ __[1], __[2] $)^T$.

Summen av kvadrerte residualkomponenter er __[18] for kandidaten og __[9] for optimum.
```

**Kode:** Lag en kontroll som returnerer relativ rekonstruksjonsfeil,
ortogonalitetsfeil og lengden til $A^T(b-Ac)$ for kandidaten. Dette er tre
ulike spørsmål: Bygger faktorene $A$? Er måleretningene ortonormale? Er
kandidatens rest ortogonal på byggeretningene?

```{py-exercise}
#| label: week4-task-quality-code
#| caption: Tre kontroller som må skilles
import numpy as np

def diagnose(A, Q, R, b):
    c = np.linalg.solve(R, Q.T@b)
    # TODO: returner relativ rekonstruksjonsfeil, ortogonalitetsfeil,
    # og lengden til A.T @ (b-A@c). Bruk Frobeniusnorm for matriser.
    return None

## TESTS ##
A=np.array([[1.,0.],[0.,1.],[0.,0.]])
Q=np.array([[2.,0.],[0.,1.],[0.,0.]])
R=np.diag([.5,1.]); b=np.array([1.,2.,3.])
out=diagnose(A,Q,R,b)
assert isinstance(out,(tuple,list)) and len(out)==3, 'Returner tre kontroller i oppgitt rekkefølge.'
assert np.allclose(out,[0.,3.,3.]), 'Produktet stemmer, men lengden til første Q-kolonne og normaltesten feiler.'
Qgood,Rgood=np.linalg.qr(A,mode='reduced')
assert np.allclose(diagnose(A,Qgood,Rgood,b),[0.,0.,0.]), 'En gyldig QR skal bestå alle tre kontrollene selv om residualen ikke er null.'
A2=np.array([[1.,1.],[1.,0.],[0.,1.]])
Q2,R2=np.linalg.qr(A2,mode='reduced'); b2=np.array([1.,-2.,4.])
assert np.allclose(diagnose(A2,Q2,R2,b2),[0.,0.,0.]), 'Bruk antallet kolonner i Q når du lager identitetsmatrisen.'
Rbad=R2.copy(); Rbad[0,0] *= 1.5
res=diagnose(A2,Q2,Rbad,b2)
assert np.isclose(res[0],np.linalg.norm(A2-Q2@Rbad,'fro')/np.linalg.norm(A2,'fro')), 'Rekonstruksjonsfeilen skal skaleres med størrelsen på A.'
assert res[0]>0 and abs(res[1])<1e-12 and res[2]>0, 'En feil i R kan bevare ortonormaliteten til Q; skill kontrollene.'
```

Avslutt med å reparere medstudentens påstand. Oppgi forutsetningene som
mangler, og forklar hvorfor liten rekonstruksjonsfeil alene heller ikke
var tilstrekkelig i oppgave 4.

:::
