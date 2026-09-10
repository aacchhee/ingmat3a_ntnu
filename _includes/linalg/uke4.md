::: {.panel-tabset}

## Oversikt

### Ukens spørsmål

Hvordan kan ett tall fortelle hvor mye av en vektor som peker i en valgt
retning? Dette spørsmålet leder oss fra indreprodukt og ortogonalitet til
projeksjoner, Gram–Schmidt, QR-faktorisering og minste kvadraters metode.

Vi begynner med piler i planet. Deretter bruker vi nøyaktig den samme ideen
som en mønsterdetektor for $2\times2$-bilder fra uke 3. Til slutt lager vi
ortogonale retninger selv og undersøker hva som skjer når kolonner er
avhengige eller nesten avhengige.

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

## 4.1 Hvor mye går vi i en valgt retning? {#uke4-retning}

Vi starter med forskyvningen

$$x=\begin{bmatrix}3\\2\end{bmatrix}.$$

Det er lett å lese at vi går $3$ enheter mot høyre og $2$ enheter opp. Men
hvor mye går vi i en skrå retning?

En **enhetsretning** er en pil med lengde $1$ som bare angir en retning. Vi
kaller pilen $q$. Alle slike piler som starter i origo, ender på
**enhetssirkelen**: sirkelen med sentrum i origo og radius $1$. Dra punktet
$q$ rundt denne sirkelen i figuren. Den blå linjen er en tallinje i den
valgte retningen, og den blå prikken viser den fortegnede avlesningen av $x$
langs linjen. Positiv avlesning betyr samme vei som $q$; negativ avlesning
betyr motsatt vei.

```{.jsxgraph width="760" height="500"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-6.2, 5.5, 7.8, -4.8], axis: true,
  showCopyright: false, showNavigation: false, keepaspectratio: true
});
var O = board.create('point', [0, 0], {visible: false, fixed: true});
var X = board.create('point', [3, 2], {
  name: 'x=(3,2)', fixed: true, color: '#222222', size: 4
});
board.create('arrow', [O, X], {strokeColor: '#222222', strokeWidth: 4});
var circle = board.create('circle', [O, 1], {
  strokeColor: '#8fa8c7', dash: 2, fixed: true
});
var Q = board.create('glider', [1, 0, circle], {
  name: 'q', color: '#1565c0', size: 5
});
board.create('arrow', [O, Q], {strokeColor: '#1565c0', strokeWidth: 4});
var reading = function () { return 3*Q.X() + 2*Q.Y(); };
var P = board.create('point', [
  function () { return reading()*Q.X(); },
  function () { return reading()*Q.Y(); }
], {name: 'avlesning', color: '#1565c0', size: 5});
board.create('line', [O, Q], {
  straightFirst: true, straightLast: true,
  strokeColor: '#1565c0', strokeWidth: 2
});
board.create('segment', [X, P], {
  strokeColor: '#777777', dash: 2, strokeWidth: 2
});
board.create('text', [-5.8, 4.9, function () {
  return 'q = (' + Q.X().toFixed(2) + ', ' + Q.Y().toFixed(2) + ')';
}], {fontSize: 17, color: '#1565c0'});
board.create('text', [-5.8, 4.3, function () {
  return 'avlesning = ' + reading().toFixed(3);
}], {fontSize: 18, color: '#1565c0'});
board.create('button', [-5.8, -3.7, 'høyre', function () {
  Q.moveTo([1, 0]);
}]);
board.create('button', [-3.6, -3.7, 'opp', function () {
  Q.moveTo([0, 1]);
}]);
board.create('button', [-1.8, -3.7, 'langs x', function () {
  Q.moveTo([3/Math.sqrt(13), 2/Math.sqrt(13)]);
}]);
board.create('button', [0.7, -3.7, 'vinkelrett', function () {
  Q.moveTo([-2/Math.sqrt(13), 3/Math.sqrt(13)]);
}]);
board.create('button', [4.0, -3.7, 'motsatt', function () {
  Q.moveTo([-3/Math.sqrt(13), -2/Math.sqrt(13)]);
}]);
```

Prøv dette før du leser videre:

1. Sett $q$ mot høyre. Hvorfor blir avlesningen $3$?
2. Sett $q$ oppover. Hvorfor blir den $2$?
3. Finn retningen som gir størst positiv avlesning.
4. Finn en retning som gir avlesning $0$ uten at $x$ er null.
5. Snu $q$ motsatt vei. Hva skjer med fortegnet?

## 4.2 Finn regneregelen {#uke4-regneregel}

Skriv enhetsretningen som vektoren

$$q=\begin{bmatrix}q_1\\q_2\end{bmatrix},\qquad q_1^2+q_2^2=1.$$

Likningen til høyre sier nettopp at lengden er $1$: Hvis vi bruker
Pytagoras på den vannrette og loddrette komponenten, får vi
$\lVert q\rVert_2=\sqrt{q_1^2+q_2^2}=1$.

### Hvorfor blir dette regneregelen?

Se på den stiplede linjen i 4.1: Fra endepunktet går vi vinkelrett inn til
den blå tallinjen. Vi kan dele turen $(3,2)^T$ i tre skritt mot høyre og to
opp. Hvor mye bidrar hver etappe langs den blå linjen?

Den blå enhetspilen $q=(q_1,q_2)^T$ danner en rettvinklet trekant med
vannrett side $q_1$, loddrett side $q_2$ og hypotenus $1$. Likeformede
rettvinklede trekanter viser at ett vannrett skritt gir avlesningen $q_1$
langs den blå linjen, mens ett loddrett skritt gir $q_2$. Fortegnet følger
retningen: et skritt motsatt vei gir motsatt bidrag.

Tre vannrette skritt gir derfor $3q_1$, og to loddrette gir $2q_2$.
Når vi setter etappene etter hverandre, legges avlesningene på tallinjen
sammen. Prøv $q=(1,1)^T/\sqrt2$: bidragene er $3/\sqrt2$ og $2/\sqrt2$,
så avlesningen blir $5/\sqrt2\approx3.54$. Kontroller med figuren.

Prøv de to etappene hver for seg. Koden skriver dem ut før summen.
Endre retningen og forutsi fortegnene først.

```{pyodide-python}
#| label: week4-direction-contributions
import numpy as np
q = np.array([1., 1.])/np.sqrt(2)
horizontal = 3*q[0]
vertical = 2*q[1]
print("Tre skritt mot høyre bidrar:", horizontal)
print("To skritt opp bidrar:", vertical)
print("Til sammen:", horizontal+vertical)
```

For en tur med $x_1$ vannrette og $x_2$ loddrette skritt får vi derfor:

$$\boxed{x^Tq=x_1q_1+x_2q_2.}$$

For $x=(3,2)^T$ blir avlesningen $3q_1+2q_2$. Uttrykket $x^Tq$ kalles
**indreproduktet** mellom $x$ og $q$. Symbolet $T$ betyr transponering: Den
stående kolonnevektoren $x$ vendes til en rad, slik at matriseproduktet
$x^Tq$ blir ett tall.

::: {.callout-important}
### Retningsmåleren

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

Legg til en retning som står vinkelrett på $x$, og kontroller at avlesningen
er null. Endre bare én retning om gangen. I del 4.4 gir vi «vinkelrett» et
matematisk navn og en test.

## 4.3 En retning må ha lengde én {#uke4-enhetsretning}

Vektorene

$$q=\frac1{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}
\quad\text{og}\quad v=\begin{bmatrix}10\\10\end{bmatrix}$$

peker samme vei, men $x^Tv$ er mye større enn $x^Tq$. Et indreprodukt med
en vilkårlig målevektor blander retning og lengde. Derfor normaliserer vi:

$$\lVert v\rVert_2=\sqrt{v^Tv},\qquad q=\frac{v}{\lVert v\rVert_2}.$$

Normen ble introdusert i uke 3 som avstanden til nullvektoren. Her bruker vi
den til å lage en vektor med lengde én.

En vektor med lengde én kalles en **enhetsvektor**. Når vi bruker den for å
angi en retning, kaller vi den også en enhetsretning. Dermed er ordene to
sider av samme objekt: «enhetsvektor» beskriver lengden, mens
«enhetsretning» framhever rollen som målepil.

### Et første sammenbrudd

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
I flyttallsregningen blir resultatet `NaN` («not a number»). Det er maskinens
markering av at regningen ikke ga et gyldig tall. En algoritme må kontrollere
lengden før den normaliserer.

## 4.4 Null avlesning betyr ortogonalitet {#uke4-ortogonalitet}

Trykk «vinkelrett» i figuren i 4.1. Pilen $x=(3,2)^T$ er fortsatt like
lang, men avlesningen er null. Drei målepilen litt til hver side: fortegnet
skifter. Hele bevegelsen går på tvers av måleretningen akkurat ved null.

Prøv nå på papir med $v=(-2,3)^T$:

$$x^Tv=3(-2)+2(3)=-6+6=0.$$

Bidragene opphever hverandre. Del $v$ på $\sqrt{13}$ for å få lengde én;
avlesningen forblir null. Vi gir nå denne observerte egenskapen et navn.

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

Med navnene $q_1,\ldots,q_k$ skrives de to egenskapene slik:

$$q_i^Tq_j=\begin{cases}1,&i=j,\\0,&i\ne j.\end{cases}$$

Hvis vi samler vektorene som kolonner i $Q=[q_1\ \cdots\ q_k]$, samles alle
disse testene i

$$\boxed{Q^TQ=I_k.}$$

Her er $I_k$ **identitetsmatrisen** av størrelse $k\times k$: Den har $1$ på
diagonalen og $0$ ellers. Diagonalen kontrollerer lengdene til kolonnene,
mens oppføringene utenfor diagonalen kontrollerer at ulike kolonner er
ortogonale.

## 4.5 Fra retningsmåler til mønsterdetektor {#uke4-monster}

Tenk på et bilde som er lyst til venstre og mørkt til høyre. Vi ønsker ett
tall som øker når denne forskjellen blir sterkere, blir null for et jevnt
bilde og skifter fortegn når lys og mørke bytter plass. Vi skal prøve om
indreproduktet kan gjøre dette. Ordet **detektor** betyr her bare en
regneoppskrift som måler mengden av ett bestemt mønster.

Vi bruker fire mønstre fra uke 3. Store bokstaver betegner de synlige
$2\times2$-bildene:

$$M=\frac12\begin{bmatrix}1&1\\1&1\end{bmatrix},\quad
H=\frac12\begin{bmatrix}1&-1\\1&-1\end{bmatrix},$$

$$V=\frac12\begin{bmatrix}1&1\\-1&-1\end{bmatrix},\quad
D=\frac12\begin{bmatrix}1&-1\\-1&1\end{bmatrix}.$$

De uskalerte mønstrene har vektorlengde $2$, så faktoren $1/2$ gjør hvert
mønster til en enhetsvektor. Et bilde er fortsatt en $2\times2$-rute på
skjermen, men indreproduktet virker på vektorer. Vi avtaler derfor eksplisitt
radvis vektorisering:

$$\operatorname{vec}_r\!\left(\begin{bmatrix}a&b\\c&d\end{bmatrix}\right)
=\begin{bmatrix}a\\b\\c\\d\end{bmatrix}.$$

La de små bokstavene være de tilsvarende detektorvektorene

$$m=\operatorname{vec}_r(M),\quad h=\operatorname{vec}_r(H),\quad
v=\operatorname{vec}_r(V),\quad d=\operatorname{vec}_r(D),$$

og bygg bildet og bildevektoren

$$X=2M-H+\frac12V,\qquad x=\operatorname{vec}_r(X).$$

Retningsmåleren er ikke begrenset til to komponenter. For vektorer
$y,z\in\mathbb R^n$ er det euklidske indreproduktet

$$\boxed{y^Tz=y_1z_1+y_2z_2+\cdots+y_nz_n.}$$

Her er $n=4$: De fire pikselverdiene spiller samme rolle som de to
koordinatene i pilfiguren. Derfor kan ett bildemønster brukes som en retning
og et annet bilde måles mot den.

Regn først bare med $h=(1,-1,1,-1)^T/2$. Et jevnt bilde $y=(1,1,1,1)^T$
gir $h^Ty=(1-1+1-1)/2=0$. Et rent mønster $y=3h$ gir
$h^Ty=3(h^Th)=3$. Bytter vi lyst og mørkt, gir $y=-3h$ avlesningen $-3$.
Dette er grunnen til å kalle målingen en detektor.

For blandingen vår er $x=(3/4,7/4,1/4,5/4)^T$. Da er

$$h^Tx=\tfrac12(\tfrac34-\tfrac74+\tfrac14-\tfrac54)=-1.$$

Regn også ut $m^Tx=2$, $v^Tx=1/2$ og $d^Tx=0$. Endre bare mengden av
$H$ i koden og forutsi hvilken søyle som flytter seg. Først nå samler vi de
fire målingene i én liste:

Med $Q_{\text{pattern}}=[m\ h\ v\ d]$ blir avlesningene

$$Q_{\text{pattern}}^Tx=
\begin{bmatrix}m^Tx\\h^Tx\\v^Tx\\d^Tx\end{bmatrix}
=\begin{bmatrix}2\\-1\\1/2\\0\end{bmatrix}.$$

Kontroller dette for hånd før du kjører koden. Hvilke nullprodukter bruker du?

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

fig, axes = plt.subplots(1, 6, figsize=(11, 2.2))
for ax, P, name in zip(axes[:4], patterns, names):
    ax.imshow(P, cmap="RdBu_r", vmin=-1, vmax=1)
    ax.set_title(name); ax.set_xticks([]); ax.set_yticks([])
axes[4].imshow(X, cmap="RdBu_r", vmin=-2, vmax=2)
axes[4].set_title("blanding")
axes[4].set_xticks([]); axes[4].set_yticks([])
axes[5].bar(names, readings, color="#1565c0")
axes[5].axhline(0, color="black", linewidth=0.8)
axes[5].set_title("avlesning")
plt.tight_layout(); plt.show()

print("Q^T Q =\n", Q_pattern.T @ Q_pattern)
print("avlesninger =", readings)
```

Hver måling reagerer på sitt eget mønster og gir null på de andre. Hver kolonne i
$Q_{\text{pattern}}$ har lengde én og er ortogonal på de andre. Derfor er
$Q_{\text{pattern}}^TQ_{\text{pattern}}=I$, og avlesningene gir
koordinatene direkte.

::: {.callout-tip collapse="true"}
### Fordypning: legg til støy

Legg `0.05*np.random.default_rng(4).standard_normal((2, 2))` til bildet og
gjenta deteksjonen. Avlesningene blir ikke identiske med de opprinnelige
koeffisientene, men de forteller fortsatt hvilke mønstre som dominerer.
:::

## 4.6 Mål, bygg opp og trekk fra {#uke4-projeksjon}

Start med $x=(3,2)^T$ og målepilen $q=(1,0)^T$. Den leser $3$.
Bygg denne delen: $3q=(3,0)^T$. Trekk den fra: resten er $(0,2)^T$.
Dra så $q$ i figuren. Følg den grå delen vi bygger og den røde resten.
Resten står på tvers av målepilen. Nå skriver vi handlingene med symboler.

La $q$ være en enhetsvektor. Vi kan dele en vektor $x$ i to deler:

$$c=q^Tx,\qquad p=cq,\qquad r=x-p.$$

- $c$ måler hvor mye av $x$ som går i retning $q$.
- $p=(q^Tx)q$ bygger opp denne delen som en vektor.
- $r=x-p$ er det som er igjen.

Dra både $x$ og $q$. Den grå pilen viser $p$, og den røde pilen viser resten
$r$. Legg merke til avlesningen $q^Tr$.

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

Regn ut kontrollen på papir:

$$q^Tr=q^T\bigl(x-(q^Tx)q\bigr)=q^Tx-(q^Tx)q^Tq=0,$$

fordi $q^Tq=1$. Vektoren

$$\boxed{p=(q^Tx)q}$$

kalles den **ortogonale projeksjonen** av $x$ på retningen $q$. Residualen
$r=x-p$ er ortogonal på $q$.

### Flere piler før vi pakker dem i en matrise

La $x=(3,2,4)^T$, $q_1=(1,0,0)^T$ og $q_2=(0,1,0)^T$.
Mål separat: $c_1=q_1^Tx=3$ og $c_2=q_2^Tx=2$.
Bygg så delene og legg sammen:

$$p=3q_1+2q_2=(3,2,0)^T,\qquad r=x-p=(0,0,4)^T.$$

Begge målerne gir null på resten. Ingen av de valgte pilene kan bygge den
tredje komponenten. Med flere ortonormale piler gjør vi det samme:
$c_i=q_i^Tx$, så $p=c_1q_1+\cdots+c_kq_k$.

Vi pakker nå pilene som kolonner og målingene som en liste:

$$Q=[q_1\ q_2]=\begin{bmatrix}1&0\\0&1\\0&0\end{bmatrix},
\qquad c=\begin{bmatrix}3\\2\end{bmatrix}.$$

$Q^Tx$ betyr «gjør begge målingene». $Qc$ betyr «bygg $c_1q_1+c_2q_2$».
Matrisespråket forkorter altså handlinger vi allerede har utført.

For en matrise $Q=[q_1\ \cdots\ q_k]$ med ortonormale kolonner blir alle
avlesningene og den samlede projeksjonen

$$c=Q^Tx,\qquad p=Qc=QQ^Tx,\qquad Q^T(x-p)=0.$$

::: {.callout-note collapse="true"}
### Hvis målevektoren ikke har lengde én

For en vilkårlig ikke-null vektor $a$ må vi korrigere for lengden:

$$\operatorname{proj}_a(x)=\frac{a^Tx}{a^Ta}a.$$

Når $a$ er en enhetsvektor, er $a^Ta=1$.
:::

## 4.7 Hvor får vi ortogonale detektorer fra? {#uke4-gs}

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

### Hele regningen for hånd

For de to vektorene over får vi

$$\lVert a_1\rVert_2=\sqrt5,\qquad
q_1=\frac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix},\qquad
r_{12}=q_1^Ta_2=\frac4{\sqrt5}.$$

Dermed er

$$v_2=a_2-r_{12}q_1
=\begin{bmatrix}1\\2\end{bmatrix}
-\frac45\begin{bmatrix}2\\1\end{bmatrix}
=\begin{bmatrix}-3/5\\6/5\end{bmatrix},$$

$$\lVert v_2\rVert_2=\frac3{\sqrt5},\qquad
q_2=\frac1{\sqrt5}\begin{bmatrix}-1\\2\end{bmatrix}.$$

Samle først de opprinnelige vektorene som kolonnene i

$$A=[a_1\ a_2]=\begin{bmatrix}2&1\\1&2\end{bmatrix}.$$

Da er resultatet

$$Q=\frac1{\sqrt5}\begin{bmatrix}2&-1\\1&2\end{bmatrix},\qquad
R=\begin{bmatrix}\sqrt5&4/\sqrt5\\0&3/\sqrt5\end{bmatrix},\qquad
A=QR.$$

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

Koeffisientene vi målte underveis danner en **øvre triangulær matrise** $R$,
det vil si at alle oppføringer under diagonalen er null. De opprinnelige
kolonnene kan bygges opp igjen som

$$\boxed{A=QR.}$$



## 4.8 Klassisk Gram–Schmidt for flere kolonner {#uke4-cgs}

### En tredje pil: samme handling igjen

Vi har allerede vinkelrette enhetspiler $q_1,q_2$. For en ny pil $a_3$
måler vi $r_{13}=q_1^Ta_3$ og $r_{23}=q_2^Ta_3$. Trekk delene fra:

$$v_3=a_3-r_{13}q_1-r_{23}q_2.$$

Den andre subtraksjonen ødelegger ikke nullavlesningen langs $q_1$, fordi
$q_1^Tq_2=0$. Kontroller ved å gange uttrykket med $q_1^T$ og $q_2^T$.
Hvis resten ikke er null, setter vi $r_{33}=\lVert v_3\rVert_2$ og
$q_3=v_3/r_{33}$. Les regningen baklengs:

$$a_1=r_{11}q_1,\quad a_2=r_{12}q_1+r_{22}q_2,\quad
 a_3=r_{13}q_1+r_{23}q_2+r_{33}q_3.$$

Dette er tre byggeoppskrifter. Samle pilene i kolonner, og skriv hver
oppskrift som en kolonne med koeffisienter:

$$[a_1\ a_2\ a_3]=[q_1\ q_2\ q_3]
\begin{bmatrix}r_{11}&r_{12}&r_{13}\\0&r_{22}&r_{23}\\0&0&r_{33}\end{bmatrix}.$$

Nullene sier at første pil ikke trenger $q_2,q_3$, og andre ikke trenger
$q_3$. Vi kaller matrisene $A,Q,R$, så likningen blir $A=QR$.
En **faktorisering** skriver en matrise som et produkt. «Tynn» betyr at vi
beholder bare de $k$ nødvendige pilene, selv om de har $m>k$ komponenter.

### Den samme oppskriften i kortform

La

$$A=[a_1\ a_2\ \cdots\ a_k]\in\mathbb R^{m\times k},\qquad m\ge k,$$

og anta foreløpig at kolonnene er lineært uavhengige. Da har $A$ **full
kolonnerang**: rangen er lik antallet kolonner $k$. En **tynn
QR-faktorisering** har da

$$Q\in\mathbb R^{m\times k},\qquad
R\in\mathbb R^{k\times k},\qquad Q^TQ=I_k.$$

Den rektangulære matrisen $Q$ er altså ikke en ortogonal kvadratisk matrise;
det er kolonnene dens som er ortonormale. De spenner ut det samme
kolonnerommet som $A$: $C(Q)=C(A)$. Her betyr $C(A)$ samlingen av alle
vektorer $Ax$ som kolonnene i $A$ kan bygge. Siden $A$ har full
kolonnerang, er $R$ invertibel, så et system $Rx=d$ har én entydig løsning.

Klassisk Gram–Schmidt konstruerer $q_j$ ved

$$r_{ij}=q_i^Ta_j\quad(i<j),$$

$$v_j=a_j-\sum_{i=1}^{j-1}r_{ij}q_i,\qquad
r_{jj}=\lVert v_j\rVert_2,\qquad q_j=\frac{v_j}{r_{jj}}.$$

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

## 4.9 Bryt algoritmen: eksakt avhengighet {#uke4-avhengighet}

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
### `NaN` er et symptom, ikke forklaringen

$$\text{lineært avhengig kolonne}
\Longrightarrow v_j=0
\Longrightarrow \lVert v_j\rVert_2=0
\Longrightarrow v_j/\lVert v_j\rVert_2\text{ er udefinert}.$$

En robust implementasjon må bruke en skalert toleranse og stoppe når resten
er for liten til å gi en pålitelig ny retning. Det er en beslutning om
**numerisk rang**, ikke et bevis på eksakt lineær avhengighet.
:::

## 4.10 Nesten avhengighet: endelige tall kan også være dårlige {#uke4-nesten}

### Følg tre piler, én regneoperasjon om gangen

Vi bruker blått for første pil, grønt for andre og rødt for tredje.
Fargene følges alltid av navn, slik at regningen også kan leses uten farger.
La $e=10^{-8}$, og skriv først pilene hver for seg:

$$\color{#1565c0}{a_1=(1,e,0,0)^T},\qquad
\color{#238443}{a_2=(1,0,e,0)^T},\qquad
\color{#c62828}{a_3=(1,0,0,e)^T}.$$

Alle har en stor første komponent og én liten ekstra komponent. De er
uavhengige for $e\ne0$, men peker nesten samme vei. Matrisen er bare en
samling av disse pilene:

$$A_e=[a_1\ a_2\ a_3]=\begin{bmatrix}1&1&1\\e&0&0\\0&e&0\\0&0&e\end{bmatrix}.$$

### Først regner vi med eksakte tall

**Første pil.** Lengden er $\sqrt{1+e^2}$, så

$$\color{#1565c0}{q_1=\frac{(1,e,0,0)^T}{\sqrt{1+e^2}}}.$$

**Andre pil.** Mål, trekk fra og normaliser:

$$r_{12}=q_1^Ta_2=\frac1{\sqrt{1+e^2}},$$
$$v_2=a_2-r_{12}q_1
=\left(\frac{e^2}{1+e^2},-\frac e{1+e^2},e,0\right)^T,$$
$$\lVert v_2\rVert_2=e\sqrt{\frac{2+e^2}{1+e^2}},\qquad
\color{#238443}{q_2=\frac{(e,-1,1+e^2,0)^T}{\sqrt{(1+e^2)(2+e^2)}}}.$$

Kontrollen blir null fordi telleren i $q_1^Tq_2$ er $e-e=0$.
Legg spesielt merke til den lille første komponenten i $v_2$, omtrent
$e^2=10^{-16}$. Den er nødvendig for denne kanselleringen.

**Tredje pil.** Begge målingene tas på den opprinnelige $a_3$:

$$r_{13}=\frac1{\sqrt{1+e^2}},\qquad
r_{23}=\frac e{\sqrt{(1+e^2)(2+e^2)}}.$$

Etter begge subtraksjoner får vi

$$v_3=a_3-r_{13}q_1-r_{23}q_2
=\left(\frac{e^2}{2+e^2},-\frac e{2+e^2},-\frac e{2+e^2},e\right)^T,$$
$$\lVert v_3\rVert_2=e\sqrt{\frac{3+e^2}{2+e^2}},\qquad
\color{#c62828}{q_3=\frac{(e,-1,-1,2+e^2)^T}{\sqrt{(2+e^2)(3+e^2)}}}.$$

Telleren i $q_1^Tq_3$ er $e-e=0$. Telleren i $q_2^Tq_3$ er
$e^2+1-(1+e^2)=0$. Alle tre er altså parvis ortogonale i eksakt regning.

::: {.callout-note}
### Tilbake til prosjektet i uke 1

Dette er samme mekanisme som i [prosjekt 1 – Floating-point attack](project_week1.qmd),
særlig del 1 («kan du få et tall til å forsvinne?»): Et lite bidrag
forsvinner når det legges til et stort tall. Når det store bidraget senere
trekkes fra, får vi ikke den tapte informasjonen tilbake.

Her er det lille bidraget $e^2=10^{-16}$ i $1+e^2$. Følg regningen nedenfor
med samme spørsmål som i prosjekt 1: **I hvilket regnetrinn går informasjon
tapt, og når blir tapet synlig?** I Gram–Schmidt blir konsekvensen ekstra
tydelig fordi den lille resten etterpå deles på lengden sin.

Del 5 og 7 av prosjekt 1 undersøker hvordan en annen beregningsrekkefølge
eller algoritme kan hjelpe. Det er også motivasjonen for modifisert
Gram–Schmidt i 4.11: Vi måler på resten etter hver subtraksjon.
:::

### Så skjer dette i vanlig float64-regning

En hatt, som i $\widehat q_2$, betyr en beregnet verdi. For $e=10^{-8}$
blir $1+e^2=1+10^{-16}$ avrundet til $1$. Følg konsekvensene:

| Trinn | Beregnet resultat | Hva forsvinner? |
|---|---|---|
| Normaliser første pil | $\widehat q_1=(1,e,0,0)^T$ | Lengdekorreksjonen avrundes bort. |
| Mål andre pil | $\widehat r_{12}=1$ | Første subtraksjon blir $1-1$. |
| Trekk fra | $\widehat v_2=(0,-e,e,0)^T$ | Første komponent, omtrent $e^2$, blir null. |
| Normaliser resten | $\widehat q_2=(0,-1,1,0)^T/\sqrt2$ | Feilen forstørres ved divisjon med $e\sqrt2$. |

Den første ortogonalitetsfeilen er liten, men ikke null:

$$\widehat q_1^T\widehat q_2=-e/\sqrt2\approx-7.07\cdot10^{-9}.$$

Nå kommer den avgjørende feilen: Klassisk GS måler $a_3$ mot denne
beregnede andre pilen. Den leser **null**:

$$\widehat r_{23}=\widehat q_2^Ta_3
=0\cdot1+(-1/\sqrt2)\cdot0+(1/\sqrt2)\cdot0+0\cdot e=0.$$

I eksakt regning var dette tallet omtrent $e/\sqrt2$. Algoritmen trekker
nå bare fra første retning:

$$\widehat v_3=a_3-\widehat q_1=(0,-e,0,e)^T,\qquad
\color{#c62828}{\widehat q_3=(0,-1,0,1)^T/\sqrt2}.$$

Derfor blir

$$\boxed{\color{#238443}{\widehat q_2}^T
\color{#c62828}{\widehat q_3}=0+\tfrac12+0+0=\tfrac12.}$$

De to pilene er langt fra vinkelrette! Begge har den samme negative andre
komponenten. Et lite bortfall under den første subtraksjonen førte til en
feil måling ved neste pil. Ingen av tallene er NaN.

### Kjør regningen og se komponentene

```{pyodide-python}
#| label: week4-cgs-worked
import numpy as np
import matplotlib.pyplot as plt
e = 1e-8
a1 = np.array([1., e, 0., 0.])
a2 = np.array([1., 0., e, 0.])
a3 = np.array([1., 0., 0., e])
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

## 4.11 Modifisert Gram–Schmidt {#uke4-mgs}

### Prøv en ny måling på resten fra 4.10

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
### Fordypning: hva bruker NumPy?

`numpy.linalg.qr` bruker ikke den pedagogiske Gram–Schmidt-koden over.
Robuste biblioteker bruker vanligvis **Householder-transformasjoner**:
speilinger som lager nuller uten de samme gjentatte subtraksjonene som
Gram–Schmidt. Vi utleder ikke Householder-metoden denne uken.
:::

## 4.12 Fra QR til minste kvadrater {#uke4-mk}

### Når ingen linje treffer alt

Se på målingene $(-1,0.2),(0,0.9),(1,2.1),(2,2.8)$. For like store
skritt i første koordinat øker den andre med $0.7$, så $1.2$, så $0.7$.
En rett linje må ha samme økning hver gang. Derfor kan ingen linje treffe
alle fire målingene. Prøv linjen $p(t)=1+t$ på papir: feilene «måling minus
linje» blir $(0.2,-0.1,0.1,-0.2)^T$. Summen av kvadrerte feil er $0.10$.

Prøv så $p(t)=1.05+0.9t$: feilene blir $(0.05,-0.15,0.15,-0.05)^T$, og
summen av kvadratene blir $0.05$. Det er bedre. Hvordan finner vi den
minste mulige summen? Det er spørsmålet **minste kvadraters metode** løser.
Nedenfor bruker vi måle-og-bygge-oppskriften fra 4.6 for å finne svaret.

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

### Et helt synlig eksempel

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
akkurat nok avlesninger. Nå bruker vi flere støyfylte avlesninger og finner
det beste svaret når et eksakt svar ikke finnes.

## 4.13 Oppsummering og kontroll {#uke4-kontroll}

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
### Korte svar til egenkontroll

1. Ellers blander avlesningen retning og lengden til måleren.
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

:::
