## Hvor er jeg?

En mobil i en hall, en drone i et lager eller en GPS-mottaker vet ikke
hvor den er. Den kan bare måle **avstander** til noen faste punkter med
kjent plassering, kalt **ankre**. Enheten vi leter etter, kaller vi
**taggen** (fra engelsk *tag*, en liten radiobrikke). Fra fire unøyaktige
avstander skal vi finne to koordinater. Det er et ikke-lineært minste
kvadraters problem: fire likninger, to ukjente, og ingen posisjon passer
alle målingene nøyaktig.

I uke 10 brukte vi Newtons metode på én funksjon om gangen. Her er
funksjonen en kvadratsum, og da kan Newtons metode forenkles. I del 1
utleder du selv forenklingen, **Gauss–Newton**: Newtons metode med ett
ledd kastet bort. Resten av prosjektet bygger på den og handler om tre
spørsmål:

- Når koster det ingenting å kaste bort leddet, og når koster det mye?
- Hvor langt kan en liten målefeil flytte posisjonen vi regner ut, og hva
  har singulærverdiene til Jacobimatrisen med det å gjøre?
- Kan metoden konvergere pent og likevel gi feil svar?

| Del | Spørsmålet vi arbeider med | Det du tar med videre | Sett av |
|:--|:--|:--|--:|
| 1. Fra Newton til Gauss–Newton | Hvordan blir et Newton-steg for en kvadratsum et minste kvadraters problem? | Jacobimatrisen, ett steg for hånd og din egen Gauss–Newton-kode. | 80 min |
| 2. Like rask som Newton? | Hva koster det droppede leddet? | Målt og forutsagt konvergensfaktor. | 30 min |
| 3. Hvor presist? | Hvor langt flytter en målefeil anslaget? | Formelen for flyttingen og ellipsen fra SVD; hva som skjer langt unna. | 60 min |
| 4. Konvergert, men feil? | Kan residualen avsløre et falskt minimum? | En diagnose, et for langt steg og Armijo. | 35 min |
| 5. Din påstand | Hvor langt holder forklaringen? | Én forutsigelse og én kontroll. | 30 min |

Sett av omtrent 4–6 timer i alt: snaut fire timer til delene i tabellen,
ti minutter til oppsettet og en halvtime til den skriftlige vurderingen.
Tar papirregningen lengre tid, er det helt vanlig. Gjør papirregningen
før du åpner hver kodecelle, og skriv en kort forventning før hvert
forsøk. Dataene er laget med en kjent posisjon, så vi vet fasiten. Den
brukes bare til kontroll.

### Det vi trenger fra tidligere uker

- **Newtons metode** ([uke 10.1](uke10.qmd#uke10-newton)): Newton-steget
  $p$ løser $Hp=-g$, der $g$ er gradienten og $H$ Hessianen.
- **Når peker et steg nedover?** ([uke 10.3](uke10.qmd#uke10-stasjonaer)):
  fra $Hp=-g$ følger $g^Tp=-p^THp$, så steget peker nedover når
  $p^THp>0$.
- **Cholesky-forsøket** ([uke 10.4](uke10.qmd#uke10-demping)): stopper
  Cholesky-faktoriseringen av $H$, prøver vi $H+\mu I$ med
  $\mu=0.5,1,2,\ldots$ til den lykkes. Da peker steget nedover.
- **Armijo** ([uke 10.4](uke10.qmd#uke10-demping)): prøv
  $\alpha=1,\tfrac12,\tfrac14,\ldots$ og godta den første som gir
  $F(z+\alpha p)\le F(z)+10^{-4}\alpha\,g^Tp$.
- **Minste kvadrater** ([uke 4](uke4.qmd#uke4-mk)): i løsningen av
  $\min_c\|Ac-b\|$ står residualen $b-Ac$ vinkelrett på alle kolonnene,
  $A^T(b-Ac)=0$. Det er **normallikningene** $A^TAc=A^Tb$ ([uke 4](uke4.qmd#uke4-normal)). I praksis
  løser vi med QR eller `np.linalg.lstsq(A, b, rcond=None)[0]`, som ikke
  danner $A^TA$.
- **Konvergensfaktor** ([uke 2](page4.qmd#uke2-konvergensfart)): en
  iterasjon er lineær med konvergensfaktor $S$ når $e_{k+1}\approx S\,e_k$
  (som i uke 2 og 9), og kvadratisk når $e_{k+1}\approx Ce_k^2$.
- **Spektralradius** ([uke 6](uke6.qmd#uke6-fikspunkt)): når feilen ganges
  med en matrise $M$ i hvert steg, er faktoren den største $|\lambda|$ for $M$.
- **SVD** ([uke 7](uke7.qmd#uke7-geometri)): $J=U\Sigma V^T$ og
  $Jv_i=\sigma_iu_i$. Enhetssirkelen blir en ellipse; $\sigma_1\ge\sigma_2$
  er største og minste strekk, langs $v_1$ og $v_2$.

### Kjøring på siden eller i egen notebook

Oppsettet på siden lastes automatisk. Det inneholder dataene, en ferdig
Newton-metode og to tegnehjelpere, `show_hall` og `show_moves`. Hjelperne
tegner resultatene; Newton-metoden bruker dine funksjoner `residual` og
`jacobian` fra del 1. Kontroller derfor først disse mot tallene i kodespor 1.

<details>
<summary>Egen notebook: last ned oppsettet og kom i gang</summary>

Last ned [project_week10_setup.py](../assets/project_week10_setup.py){download="project_week10_setup.py"}
og legg filen ved siden av notebooken. Kjør først

```python
from project_week10_setup import *
```

Du trenger NumPy og Matplotlib. Kopier deretter cellene fra prosjektet i
rekkefølge. Hele notebooken skal kunne kjøres med **Restart / Run all**.
Ta med oppsettsfilen ved levering. De to appene i 1b og 3b virker bare
på nettsiden.

</details>

## 1. Fra Newton til Gauss–Newton

Først setter vi opp problemet og finner metoden. Hallen er 10 m × 8 m, med
ett anker i hvert hjørne:

$$b_1=(0,0),\quad b_2=(10,0),\quad b_3=(10,8),\quad b_4=(0,8).$$

Den ukjente posisjonen er $z=(x,y)$. Anker $i$ måler avstanden $d_i$. Hvis
målingen var perfekt, ville $\|z-b_i\|=d_i$. Vi samler avvikene i
**residualvektoren**

$$r_i(z)=\|z-b_i\|-d_i=\sqrt{(x-b_{i1})^2+(y-b_{i2})^2}-d_i,
\qquad i=1,\ldots,4,$$

og minimerer kvadratsummen

$$F(z)=\tfrac12\sum_{i=1}^4 r_i(z)^2.$$

Det er fire likninger og to ukjente, så med målefeil kan vi ikke få alle
residualene lik null. Vi kunne brukt Newtons metode fra uke 10 direkte på
$F$. Men for en kvadratsum har gradienten og Hessianen en spesiell form,
og den gir en enklere metode. Vi tar det i fire små steg. Først får du et
nytt verktøy, Jacobimatrisen (1a). Så regner vi ett Newton-steg der alt er
tall, med bare én ukjent (1b). Deretter gjør vi det samme med to ukjente og
finner Gauss–Newton (1c). Til slutt ser vi hva radene i $J$ betyr i hallen
(1d). Målet med del 1 er at du forstår hvor metoden kommer fra, har regnet
ett steg for hånd og ender med en kode du stoler på.

### 1a. Et nytt verktøy: Jacobimatrisen (papir)

Residualen $r(z)$ er ikke én funksjon, men fire, alle av de to variablene
$x$ og $y$. Fra [uke 8](uke8.qmd#uke8-gradient) kjenner du gradienten, som
samler de partielle deriverte av én funksjon. Har vi flere funksjoner,
legger vi gradientene deres som rader i en matrise. Den kalles
**Jacobimatrisen** $J$ (også kalt Jacobianen): element $(i,j)$ er den
partielle deriverte av $r_i$ med hensyn på variabel $j$, så rad $i$ er
gradienten til $r_i$, $(\partial r_i/\partial x,\ \partial r_i/\partial y)$.
Med fire ankre og to ukjente er $J$ en $4\times2$-matrise.

$J$ spiller samme rolle som den deriverte i én variabel. I
[uke 8](uke8.qmd#uke8-gradient) så vi at et lite steg $p$ endrer en
funksjon med omtrent gradienten prikket med $p$. Bruker vi det på hver
komponent, får vi

$$r(z+p)\approx r(z)+J\,p.$$

**Lite talleksempel.** Ta to funksjoner $r_1(x,y)=x^2-y$ og
$r_2(x,y)=3x+y^2$ i punktet $z=(1,2)$. Skriv opp $J$ med symboler, sett inn
punktet, og bruk $r(z+p)\approx r(z)+Jp$ med $p=(0.1,\,0)$ til å anslå
$r(1.1,\,2)$. Sammenlign med den eksakte verdien.

<details>
<summary>Regnehjelp: Jacobimatrisen i talleksempelet</summary>

Rad 1 er gradienten til $r_1=x^2-y$, altså $(2x,\,-1)$, og rad 2 er
gradienten til $r_2=3x+y^2$, altså $(3,\,2y)$. I $(1,2)$ er

$$J=\begin{bmatrix}2x&-1\\3&2y\end{bmatrix}=\begin{bmatrix}2&-1\\3&4\end{bmatrix},\qquad
r(1,2)=\begin{bmatrix}1-2\\3+4\end{bmatrix}=\begin{bmatrix}-1\\7\end{bmatrix}.$$

Med $p=(0.1,\,0)$ er $Jp=(2\cdot0.1,\ 3\cdot0.1)=(0.2,\,0.3)$, så
$r(1.1,\,2)\approx(-1+0.2,\ 7+0.3)=(-0.8,\ 7.3)$. Eksakt er
$r(1.1,\,2)=(1.21-2,\ 3.3+4)=(-0.79,\ 7.3)$. Anslaget bommer bare med
$0.01$ i første komponent, som er leddet $0.1^2$ som den lineære
tilnærmingen ikke tar med.

</details>

**Ta med videre:** Rad $i$ i $J$ er gradienten til $r_i$, og $Jp$ er
omtrent endringen i alle residualene når vi flytter oss $p$. Radene i $J$
for hallen regner du ut i 1d.

### 1b. Ett Newton-steg med tall: én ukjent (papir)

Før vi går til hallen, regner vi ett steg der alt er tall. Da ser vi
tydelig hvilket ledd Gauss–Newton dropper, og hvor lite det er. Taggen
ligger på gulvet, på linjen $y=0$, så bare $x$ er ukjent. Ankrene henger i
$(0,4)$ og $(7,3)$ og måler $d_1=5.6$ og $d_2=4.4$. Skriv anker $i$ som
$(a_i,h_i)$. Avstanden til det er $\rho_i=\sqrt{(x-a_i)^2+h_i^2}$,
residualen er $r_i=\rho_i-d_i$, og vi minimerer
$F(x)=\tfrac12(r_1^2+r_2^2)$. Start i $x_0=3$.

1. Regn ut avstandene $\rho_i$ og residualene $r_i$ i $x_0$.
2. Med én ukjent er $J$ en kolonne med de to tallene
   $r_i'(x_0)=(x_0-a_i)/\rho_i$. Regn ut $J$.
3. **Den deriverte av $F$.** Bruk kjerneregelen. Første linje er gitt:
   $$F'(x)=\tfrac12\bigl(2r_1r_1'+2r_2r_2'\bigr)=\ \ldots$$
   Forklar at dette er $J^Tr$, og regn ut tallet i $x_0$.
4. **Den andrederiverte.** Deriver en gang til med produktregelen.
   Første linje er gitt:
   $$F''(x)=\bigl(r_1'r_1'+r_2'r_2'\bigr)+\bigl(r_1r_1''+r_2r_2''\bigr).$$
   Den første parentesen er $J^TJ$. Den andre kaller vi $Q$: der er hvert
   ledd **ganget med en residual**. Regn ut $J^TJ$ og $Q$ i $x_0$, med
   $r_i''=h_i^2/\rho_i^3$ (gitt).
5. **Newton og Gauss–Newton.** Newton-steget fra uke 10 er
   $p=-F'/F''=-J^Tr/(J^TJ+Q)$. Hvor havner $x_1$? Hvor havner det hvis vi
   dropper $Q$ og tar $p=-J^Tr/(J^TJ)$? Hvor stor er forskjellen, og
   hvorfor er den liten her?

<details>
<summary>Regnehjelp: talleksempelet</summary>

$\rho_1=\sqrt{3^2+4^2}=5$ og $\rho_2=\sqrt{(3-7)^2+3^2}=\sqrt{16+9}=5$.
Residualene er $r=(5-5.6,\ 5-4.4)=(-0.6,\ 0.6)$, og

$$J=\begin{bmatrix}3/5\\-4/5\end{bmatrix}=\begin{bmatrix}0.6\\-0.8\end{bmatrix}.$$

**Den deriverte.** $F'=r_1r_1'+r_2r_2'$ er $J$ prikket med $r$, altså
$J^Tr=0.6\cdot(-0.6)+(-0.8)\cdot0.6=-0.36-0.48=-0.84$.

**Den andrederiverte.** $J^TJ=0.6^2+0.8^2=0.36+0.64=1$. Videre er
$r_1''=16/125=0.128$ og $r_2''=9/125=0.072$, så
$Q=-0.6\cdot0.128+0.6\cdot0.072=-0.0768+0.0432=-0.0336$. Det er bare
omtrent 3 % av $J^TJ=1$, fordi residualene $\pm0.6$ er små.

**Stegene.** Newton gir $p=0.84/(1-0.0336)\approx0.869$, så
$x_1\approx3.869$. Uten $Q$ blir $p=0.84/1=0.84$ og $x_1=3.84$.
Residualnormen faller fra $0.85$ til $0.070$, og videre steg ender i
$x\approx3.847$. De to stegene er nesten like. Her lander steget uten $Q$
til og med litt nærmere minimumet.

</details>

**Se det i en app.** Newton går til bunnen av den lokale parabelen, som i
uke 10.1. Dropper vi $Q$, får vi en annen parabel: samme verdi og samme
helning i $x_0$, men krumningen $J^TJ$ i stedet for $J^TJ+Q$. Appen tegner
$F$ og begge parablene, og trekantene viser bunnene deres. Dra $x_0$ langs
aksen og se hvor trekantene havner. Flytt så skyveren $e$. Den legger like
mye til begge målingene, slik at de ikke lenger passer sammen og
residualene blir store. Følg med på $Q$ og på avstanden mellom trekantene.

```{.jsxgraph width="620" height="440" style="width:100%;max-width:620px;height:440px;border:0;"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [1.15, 4.7, 6.8, -1.2], axis: false, keepaspectratio: false,
  showNavigation: false, showCopyright: false,
  pan: {enabled:false}, zoom: {enabled:false}
});
board.create('axis', [[0, 0], [1, 0]], {name:'x', withLabel:true,
  label:{position:'rt', offset:[-12, -14], fontSize:13}, ticks:{drawZero:false}});
// Talleksempelet: taggen på linjen y = 0, ankre i (0, 4) og (7, 3), målt d = (5.6, 4.4).
// Skyveren e legger like mye til begge målingene, så de ikke lenger passer sammen.
var a = [0, 7], h = [4, 3], d0 = [5.6, 4.4];
var e = board.create('slider', [[1.6, -0.6], [3.4, -0.6], [-1, 0, 1]], {
  name:'e', snapWidth:0.1, precision:1, withLabel:true
});
board.create('text', [1.45, -0.98, 'e: ekstra feil i begge målingene (m)'],
  {fontSize:12, color:'#37474f', fixed:true, anchorY:'middle'});
function parts(x) {             // residualer r, J og det droppede leddet Q i punktet x
  var r = [], J = [], Q = 0;
  for (var i = 0; i < 2; i++) {
    var rho = Math.sqrt((x - a[i])*(x - a[i]) + h[i]*h[i]);
    r.push(rho - d0[i] - e.Value());
    J.push((x - a[i])/rho);
    Q += r[i]*h[i]*h[i]/(rho*rho*rho);
  }
  return {r: r, Jr: J[0]*r[0] + J[1]*r[1], JJ: J[0]*J[0] + J[1]*J[1], Q: Q};
}
function F(x) { var p = parts(x); return 0.5*(p.r[0]*p.r[0] + p.r[1]*p.r[1]); }
function xmin() {               // minimumet av F: mange Gauss-Newton-steg
  var x = 3;
  for (var k = 0; k < 60; k++) { var p = parts(x); x -= p.Jr/p.JJ; }
  return x;
}
var track = board.create('segment', [[1.5, 0], [6.5, 0]], {visible:false, fixed:true});
var X0 = board.create('glider', [3, 0, track], {name:'x₀', size:5, color:'#212121',
  label:{offset:[-6, -16], fontSize:14}});
function model(curv) {          // parabel med samme verdi og helning som F i x0
  return function (x) {
    var x0 = X0.X(), p = parts(x0), t = x - x0;
    return F(x0) + p.Jr*t + 0.5*curv(p)*t*t;
  };
}
var gn = function (p) { return p.JJ; }, nt = function (p) { return p.JJ + p.Q; };
board.create('functiongraph', [F, 1.3, 6.7], {strokeColor:'#345f78', strokeWidth:3, highlight:false});
board.create('functiongraph', [model(gn), 1.3, 6.7],
  {strokeColor:'#1565c0', strokeWidth:2, dash:2, highlight:false});
board.create('functiongraph', [model(nt), 1.3, 6.7],
  {strokeColor:'#ef6c00', strokeWidth:2, dash:1, highlight:false});
function bottom(curv) {         // bunnen av parabelen: x0 + steget
  return function () { var p = parts(X0.X()); return X0.X() - p.Jr/curv(p); };
}
function bottomPoint(curv, color) {
  var bx = bottom(curv);
  board.create('point', [bx, function () { return model(curv)(bx()); }],
    {name:'', face:'triangleup', size:6, strokeColor:color, fillColor:color, fixed:true, highlight:false});
  board.create('segment', [[bx, 0], [bx, function () { return model(curv)(bx()); }]],
    {strokeColor:color, dash:1, strokeWidth:1, fixed:true, highlight:false});
}
bottomPoint(gn, '#1565c0'); bottomPoint(nt, '#ef6c00');
board.create('point', [xmin, function () { return F(xmin()); }],
  {name:'', face:'x', size:5, strokeColor:'#212121', strokeWidth:2, fixed:true, highlight:false});
board.create('point', [function () { return X0.X(); }, function () { return F(X0.X()); }],
  {name:'', size:3, color:'#212121', fixed:true, highlight:false});
board.create('text', [1.45, 4.45, function () {
  var p = parts(X0.X());
  return 'x₀ = ' + X0.X().toFixed(2) + ':  r = (' + p.r[0].toFixed(2) + ', ' + p.r[1].toFixed(2) + ')';
}], {fontSize:13, color:'#212121', cssStyle:'background-color:rgba(255,255,255,0.85);', highlight:false, fixed:true});
board.create('text', [1.45, 4.17, function () {
  var p = parts(X0.X());
  return 'Jᵀr = ' + p.Jr.toFixed(3) + ',  JᵀJ = ' + p.JJ.toFixed(3) + ',  Q = ' + p.Q.toFixed(3);
}], {fontSize:13, color:'#212121', cssStyle:'background-color:rgba(255,255,255,0.85);', highlight:false, fixed:true});
board.create('text', [1.45, 3.89, function () {
  return 'Gauss–Newton (krumning JᵀJ): x₁ = ' + bottom(gn)().toFixed(3);
}], {fontSize:13, color:'#1565c0', cssStyle:'background-color:rgba(255,255,255,0.85);', highlight:false, fixed:true});
board.create('text', [1.45, 3.61, function () {
  return 'Newton (krumning JᵀJ + Q): x₁ = ' + bottom(nt)().toFixed(3);
}], {fontSize:13, color:'#ef6c00', cssStyle:'background-color:rgba(255,255,255,0.85);', highlight:false, fixed:true});
board.create('text', [1.45, 3.33, function () {
  return 'minimum av F (×): x = ' + xmin().toFixed(3);
}], {fontSize:13, color:'#212121', cssStyle:'background-color:rgba(255,255,255,0.85);', highlight:false, fixed:true});
```

**Hva viser bildet?** Med de opprinnelige målingene, $e=0$, ligger de to
parablene nesten oppå hverandre. Trekantene havner i $3.840$ og $3.869$,
tett ved minimumet i $3.847$. Gjør du $e$ større, blir residualene større,
og $Q$ vokser med dem. Med $e=1$ og $x_0=3$ er $Q=-0.234$. Da stopper
Gauss–Newton-steget i $3.640$, mens Newton-steget når $3.835$, nær
minimumet i $3.808$. Det droppede leddet er altså lite akkurat når
residualene er små. Det kommer vi tilbake til i del 2.

**Ta med videre:** For $F=\tfrac12(r_1^2+r_2^2)$ er $F'=J^Tr$ og
$F''=J^TJ+Q$, der $Q$ er ganget med residualene. Å droppe $Q$ endrer
steget lite når residualene er små.

### 1c. Det samme med to ukjente: Gauss–Newton (papir)

Nå gjør vi det samme i hallen, med to ukjente og fire ankre. Regningen er
den samme som i 1b, bare med partielle deriverte, og $J$ er en
$4\times2$-matrise. Du skal kjenne igjen $J^Tr$, $J^TJ$ og $Q$ fra 1b.

1. **Gradienten.** Deriver $F$ med kjerneregelen. Første linje er gitt:
   $$\frac{\partial F}{\partial x}=\tfrac12\sum_i 2\,r_i\,\frac{\partial r_i}{\partial x}=\ \ldots$$
   Gjør det samme for $\partial F/\partial y$. Forklar at de to tallene er
   komponentene i $J^Tr$. (Hint: komponent 1 i $J^Tr$ er kolonne 1 i $J$
   prikket med $r$.)
2. **Hessianen.** Deriver $\partial F/\partial x$ en gang til med
   produktregelen. Første linje er gitt:
   $$\frac{\partial^2F}{\partial x^2}=\sum_i\left(\frac{\partial r_i}{\partial x}\cdot\frac{\partial r_i}{\partial x}+r_i\,\frac{\partial^2 r_i}{\partial x^2}\right).$$
   Skriv tilsvarende uttrykk for $\partial^2F/\partial x\,\partial y$ og
   $\partial^2F/\partial y^2$. Som i 1b består hvert av to deler. Forklar at
   delene uten $r_i$ foran er elementene i $J^TJ$. Resten kaller vi $Q$,
   og Hessianen er altså $J^TJ+Q$.
3. **Dropp $Q$.** Nær en god løsning passer målingene nesten, så alle $r_i$
   er små, og $Q$ er liten sammenlignet med $J^TJ$, slik vi så i 1b.
   **Gauss–Newton** bytter derfor Hessianen med $J^TJ$ i Newton-likningen:
   $$J^TJ\,p=-J^Tr.$$
   Skriv med ord to fordeler: Hva slags deriverte trenger vi ikke lenger?
   Og hva gir $g^Tp=-p^TJ^TJp=-\|Jp\|^2$ fra uke 10.3 om retningen?
4. **Et minste kvadraters problem.** Sammenlign $J^TJp=-J^Tr$ med
   normallikningene $A^TAc=A^Tb$ for $\min_c\|Ac-b\|$ (uke 4 og 7). Hva er
   «$A$», «$c$» og «$b$» her?

<details>
<summary>Regnehjelp: gradient, Hessian og minste kvadrater</summary>

**Gradienten.** $\partial F/\partial x=\sum_i r_i\,\partial r_i/\partial x$ og
$\partial F/\partial y=\sum_i r_i\,\partial r_i/\partial y$. Kolonne 1 i $J$
inneholder alle $\partial r_i/\partial x$, så komponent 1 i $J^Tr$ er
nettopp $\sum_i(\partial r_i/\partial x)\,r_i$. Altså $\nabla F=J^Tr$.

**Hessianen.** For eksempel er
$$\frac{\partial^2F}{\partial x\,\partial y}=\sum_i\left(\frac{\partial r_i}{\partial x}\,\frac{\partial r_i}{\partial y}+r_i\,\frac{\partial^2r_i}{\partial x\,\partial y}\right).$$
Den første summen er element $(1,2)$ i $J^TJ$, altså kolonne 1 prikket med
kolonne 2. Den andre summen er element $(1,2)$ i
$Q=\sum_i r_i\cdot(\text{Hessianen til }r_i)$.

**Fordelene.** Vi trenger bare førstederiverte av $r_i$. Og siden
$p^TJ^TJp=\|Jp\|^2\ge0$, er $g^Tp\le0$: et Gauss–Newton-steg peker aldri
oppover, slik et Newton-steg kan gjøre (uke 10.3).

**Minste kvadrater.** Med $A=J$, ukjent $c=p$ og høyreside $b=-r$ er
normallikningene nettopp $J^TJp=-J^Tr$. Hvert Gauss–Newton-steg løser
altså $\min_p\|Jp+r\|$: det finner steget $p$ som gjør den lineære
tilnærmingen $r(z+p)\approx r(z)+Jp$ fra 1a så liten som mulig.

</details>

**Ta med videre:** For $F=\tfrac12\|r\|^2$ er gradienten $J^Tr$ og
Hessianen $J^TJ+Q$, der $Q$ er ganget med residualene. Gauss–Newton dropper
$Q$, og da blir hvert steg ett lineært minste kvadraters problem
$\min_p\|Jp+r\|$. Det koster lite når residualene er små. I del 2 måler vi
hva det koster når de ikke er det.

### 1d. En rad i $J$ (papir)

Utledningen i 1c gjelder for alle residualer. For å regne trenger vi nå
selve radene i $J$ for hallen, med to ukjente. Det viser seg at de har en
enkel geometrisk betydning, som vi bruker igjen i del 3 og 4.

1. Fullfør regningen. Første linje er gitt:
   $$\frac{\partial r_i}{\partial x}
   =\frac{1}{2\sqrt{(x-b_{i1})^2+(y-b_{i2})^2}}\cdot2(x-b_{i1})=\ \ldots$$
   Gjør det samme for $\partial r_i/\partial y$, og skriv raden med
   $z-b_i$ og $\|z-b_i\|$.
2. Lite talleksempel: anker $(0,0)$ og $z=(3,4)$. Finn raden. Tegn ankeret,
   punktet og raden som en pil. Hvilken vei peker pilen, og hvor lang er den?
3. Forklar med ord: hvis vi flytter $z$ et lite stykke $p$, hvor mye endres
   avstanden til ankeret? Hvorfor endres den ikke når $p$ står vinkelrett
   på pilen?

<details>
<summary>Regnehjelp: raden og talleksempelet</summary>

Den deriverte av $\sqrt{u}$ er $1/(2\sqrt u)$, og den indre deriverte av
$u=(x-b_{i1})^2+(y-b_{i2})^2$ med hensyn på $x$ er $2(x-b_{i1})$. Toerne
forkortes:

$$\frac{\partial r_i}{\partial x}=\frac{x-b_{i1}}{\|z-b_i\|},\qquad
\frac{\partial r_i}{\partial y}=\frac{y-b_{i2}}{\|z-b_i\|},\qquad
\text{rad } i=\frac{(z-b_i)^T}{\|z-b_i\|}.$$

($d_i$ er et fast tall og forsvinner når vi deriverer.) I talleksempelet er
$\|z-b_1\|=\sqrt{3^2+4^2}=5$, så raden er $(3,4)/5=(0.6,\,0.8)$. Den peker
fra ankeret mot $z$ og har lengde 1. Generelt er rad $i$ **enhetsvektoren
fra anker $i$ til $z$**. En liten flytting $p$ endrer avstanden med omtrent
(rad)$\cdot p$: bare komponenten mot eller fra ankeret teller.

</details>

**Ta med videre:** En rad i $J$ er en enhetsvektor fra et anker, og $Jp$
er vektoren med de fire avstandsendringene når vi flytter oss $p$. Vi løser
hvert Gauss–Newton-steg med `lstsq`, en ortogonal metode som QR i uke 4, og
ikke via normallikningene: $J^TJ$ har kvadrert kondisjonstall (uke 7 og
prosjekt 4, del 6).

### Kodespor 1: residual, Jacobimatrise og Gauss–Newton

Nå gjør vi papirregningen om til kode. Vi trenger tre byggesteiner:
residualvektoren, Jacobimatrisen og ett Gauss–Newton-steg. Den første
cellen kontrollerer de to første mot talleksempelet i 1d og mot den riktige
posisjonen, der alle residualene skal være null med eksakte data. Målet er
å ha en Gauss–Newton-metode du stoler på før vi bruker den i del 2–4.

`B` er en matrise med ett anker per rad, og `d` er vektoren med målte
avstander. Bruk `np.linalg.norm(..., axis=1)` for å få én avstand per rad.
Cellen under definerer de to funksjonene og skriver ut to kontroller, slik
at du ser med en gang om de regner riktig.

```{pyodide-python}
#| label: project10-residual
def residual(z, B, d):
    # TODO: avstanden fra z til hvert anker minus målt avstand (én verdi per anker).
    raise NotImplementedError('Fullfør residual')

def jacobian(z, B):
    # TODO: rad i er enhetsvektoren fra anker i til z.
    # Tips: D = z - B har én rad per anker. Start med J = np.zeros_like(D),
    # og del hver rad D[i] på lengden sin i en løkke over i.
    raise NotImplementedError('Fullfør jacobian')

print('Rad for anker (0,0) og z=(3,4):', jacobian(np.array([3., 4.]), np.array([[0., 0.]])),
      ' forventet [[0.6 0.8]]')
print('Residual i fasiten med eksakte data:', residual(z_true, hall, d_exact), ' forventet nuller')
```

Fullfør så steget fra 1c og løkken. Funksjonen skal returnere alle punktene,
slik at vi kan måle feilen i hvert steg. Cellen kjører deretter seks steg
med eksakte data fra midten av hallen og tegner banen.

```{pyodide-python}
#| label: project10-gauss-newton
def gn_step(z, B, d):
    # TODO: løs min ||J p + r|| med np.linalg.lstsq og returner p.
    raise NotImplementedError('Fullfør gn_step')

def gauss_newton(z0, B, d, steps=10):
    z = np.array(z0, float)
    points = [z.copy()]
    for k in range(steps):
        # TODO: ta ett Gauss-Newton-steg og legg det nye punktet i listen.
        raise NotImplementedError('Fullfør løkken')
    return np.array(points)

path = gauss_newton([5., 4.], hall, d_exact, steps=6)
for k, z in enumerate(path):
    print(f'k = {k}: z = {z.round(6)},  avstand til fasit = {np.linalg.norm(z - z_true):.1e}')
show_hall(hall, d_exact, [path], ['Gauss-Newton'], true=z_true)
```

Med eksakte data skal du nå $(3,5)$ fra midten av hallen. Avstandene til
fasiten skal være omtrent $2.2,\ 4.5\cdot10^{-2},\ 5.9\cdot10^{-5},\
6.5\cdot10^{-11}$ og så null. Nivåkurvene viser $\|r(z)\|$.

## 2. Like rask som Newton?

Gauss–Newton virker. I 1b og 1c droppet vi $Q$ fordi residualene er små nær
løsningen, og med eksakte data var de null. Men ekte målinger har feil,
og da blir residualene ikke null i løsningen. Nå undersøker vi hva det
koster. Vi har tre datasett fra samme posisjon $(3,5)$:

| Datasett | Hva er galt med målingene? |
|:--|:--|
| `d_exact` | ingenting |
| `d_noisy` | små målefeil: $0.3,\ -0.4,\ 0.5,\ -0.2$ m |
| `d_bad` | anker 3 måler 3 m for langt, de andre er eksakte |

Cellen kjører din Gauss–Newton og den ferdige Newton-metoden
`newton_position` (som bruker hele Hessianen $J^TJ+Q$) fra samme start.
Begge metodene bruker dine funksjoner `residual` og `jacobian`; sammenligningen
er derfor ikke en uavhengig kontroll av disse to funksjonene.
For å se farten måler vi forholdet $e_{k+1}/e_k$, der $e_k=\|z_k-z_\infty\|$
og $z_\infty$ er siste punkt: et omtrent fast forhold betyr lineær
konvergens, og et forhold som krymper mot null betyr raskere konvergens.
Målet er å finne ut når det droppede leddet gjør Gauss–Newton tregere enn
Newton.

**Skriv en forventning før du kjører:** I hvilke tilfeller tror du
Gauss–Newton konvergerer kvadratisk, som Newton? Begrunn med hvilket ledd
som droppes og hvor stort det er nær løsningen.

Fyll inn de to linjene som regner ut avstandene og forholdene. Cellen
kjører så begge metodene på de tre datasettene og skriver ut feilene side om
side, slik at du kan se farten direkte.

```{pyodide-python}
#| label: project10-rates
for name, d in [('eksakte', d_exact), ('små feil', d_noisy), ('feil måling', d_bad)]:
    path = gauss_newton([5., 4.], hall, d, steps=12)
    z_end = path[-1]
    print(f'{name}: z = {z_end.round(3)}, ||r|| = {np.linalg.norm(residual(z_end, hall, d)):.3f}')
    # TODO: e = avstandene fra hvert punkt i path til z_end, som en NumPy-vektor
    # (se Newton-linjen nederst i cellen); ratios = e[k+1]/e[k] for k = 0, ..., 6.
    e = None
    ratios = None
    print('   Gauss-Newton, e_k:', np.array2string(e[:7], precision=1))
    print('   forhold e_k+1/e_k:', np.round(ratios, 3))
    newton = newton_position([5., 4.], hall, d, residual, jacobian)
    print('   Newton, e_k:      ', np.array2string(np.linalg.norm(newton - newton[-1], axis=1)[:6], precision=1))
```

Du skal se at Newton konvergerer kvadratisk i alle tre tilfellene. Gauss–Newton
gjør det bare med eksakte data. Med de små målefeilene er forholdet omtrent
konstant, rundt $0.05$, og med den feile målingen rundt $0.19$: **lineær
konvergens**. Residualnormen ved løsningen er $0$, $0.730$ og $2.085$. Med
eksakte data blir $e_k$ null etter fire steg; forholdene blir da `nan`
(0/0), og dem kan du se bort fra. NumPy skriver også en advarsel
(`RuntimeWarning`) om 0/0; den er ufarlig. Før det krymper selve forholdet
fra steg til steg: det er kjennetegnet på kvadratisk konvergens.

### Forutsi faktoren

Tallene $0.05$ og $0.19$ er målt. Kan vi forutsi dem før vi kjører? Det
ville vise at vi forstår *hvorfor* Gauss–Newton blir lineær.

Tenk tilbake på appen i 1b. Newton bruker krumningen $J^TJ+Q$, Gauss–Newton
bare $J^TJ$. Derfor bommer hvert Gauss–Newton-steg litt, og nær løsningen
er bommen proporsjonal med feilen vi har igjen. Det gir en enkel regel. La
$e_k=z_k-z_\infty$ være feilen som vektor. Da er

$$e_{k+1}\approx M\,e_k,\qquad M=-(J^TJ)^{-1}Q,$$

der $J$ og $Q$ er regnet ut i løsningen $z_\infty$. Hjelperen
`dropped_part(z, B, r, J)` regner ut $Q$ fra residualvektoren $r$ og
Jacobimatrisen $J$ som du har beregnet. Feilen ganges altså med den samme
matrisen i hvert steg. Det er en fikspunktiterasjon som i uke 2, og
faktoren er spektralradiusen til $M$, som i uke 6. Vi tar regelen som gitt
og kontrollerer den med tall.

1. Hva blir $M$ når alle residualene er null? Hva sier det om farten med
   eksakte data?
2. Med én ukjent er $M=-Q/(J^TJ)$ bare et tall. Kontroller regelen på
   talleksempelet fra 1b. I løsningen $x\approx3.847$ er $J^TJ\approx1.005$
   og $Q\approx-0.0099$. Regn ut $M$. Sammenlign med forholdet $e_2/e_1$,
   der $e_1=3.847-3.84\approx0.0072$ og $e_2\approx7.1\cdot10^{-5}$ er
   feilene etter ett og to Gauss–Newton-steg.
3. Forklar med ord hvorfor faktoren blir større når residualene blir
   større. (Hint: hva står foran hvert ledd i $Q$?)

<details>
<summary>Regnehjelp: regelen med tall</summary>

**Punkt 1.** Når alle residualene er null, er $Q=0$ og $M=0$. Feilen
forsvinner da i første orden, og det som er igjen, er mye mindre. Det er
den kvadratiske konvergensen vi så med eksakte data.

**Punkt 2.** $M=-Q/(J^TJ)\approx0.0099/1.005\approx0.0099$. Forholdet er
$e_2/e_1\approx7.1\cdot10^{-5}/0.0072\approx0.0099$. Regelen stemmer.

**Punkt 3.** Hvert ledd i $Q$ er ganget med en residual $r_i$. Store
residualer gir en stor $Q$, og dermed en stor $M$. Det så du også i appen i
1b: med større $e$ kom de to parablene lenger fra hverandre.

</details>

Nå kan vi sette tall på $M$. Cellen regner ut spektralradiusen til $M$ i
det siste punktet for de to datasettene med feil, slik at vi kan
sammenligne forutsigelsen med de målte forholdene.

```{pyodide-python}
#| label: project10-predict
for name, d in [('små feil', d_noisy), ('feil måling', d_bad)]:
    z_end = gauss_newton([5., 4.], hall, d, steps=30)[-1]
    J = jacobian(z_end, hall)
    r = residual(z_end, hall, d)
    M = -np.linalg.solve(J.T @ J, dropped_part(z_end, hall, r, J))
    print(f'{name}: forutsagt faktor = {max(abs(np.linalg.eigvals(M))):.3f}')
```

Sammenlign med de målte forholdene. Du skal få $0.048$ og $0.192$.

**Ta med videre:** Gauss–Newton er like rask som Newton når residualene i
løsningen er null. Prisen for det droppede leddet vokser med residualen, og
vi kan forutsi den som en spektralradius.

## 3. Hvor presist vet vi hvor vi er?

Til nå har vi spurt hvor raskt metoden finner løsningen. Nå spør vi hvor
god selve løsningen er. Hver avstandsmåling har en liten feil, gjerne noen
centimeter, og vi vet ikke hvor stor den er. Men vi kan stille et
konkret spørsmål: **hvis anker 1 måler 10 cm for langt, hvor langt og i
hvilken retning flytter det posisjonen vi regner ut?** Kan vi svare på
det for hver tenkelig målefeil, vet vi hvor presist posisjonen er
bestemt.

Vi trenger ingen nye verktøy. Minste kvadrater fra uke 4 gir en formel for
flyttingen, og SVD fra uke 7 sier hvilken målefeil som flytter mest. Målet
med del 3 er å finne den største mulige flyttingen for en målefeil av gitt
størrelse, uten å prøve ut alle feil, og å se hvordan plasseringen av
ankrene bestemmer den.

### 3a. Hvor flytter en målefeil anslaget? (papir)

Taggen står i den riktige posisjonen $z_*$, og med eksakte avstander $d$
er alle residualene null der. Så endres de målte avstandene litt, fra $d$
til $d+\delta d$. For eksempel betyr $\delta d=(0.1,\,0,\,0,\,0)$ at anker 1
måler 10 cm for langt. Løsningen flytter seg til $z_*+\delta z$, og vi vil
finne $\delta z$.

**Idéen:** start i den gamle løsningen $z_*$ og ta ett Gauss–Newton-steg
med de nye målingene. Residualene blir små, og da er Gauss–Newton svært
rask (del 2), så ett steg kommer nesten hele veien.

1. **Den nye residualen i $z_*$.** Fullfør (første linje er gitt):
   $$r_i^{\text{ny}}(z_*)=\|z_*-b_i\|-(d_i+\delta d_i)=r_i(z_*)-\delta d_i=\ \ldots$$
   Bruk at $r(z_*)=0$.
2. **Steget.** Sett $r^{\text{ny}}$ inn i Gauss–Newton-likningen
   $J^TJ\,\delta z=-J^Tr^{\text{ny}}$ fra 1c, og vis at
   $$J^TJ\,\delta z=J^T\delta d.$$
   Dette er normallikningene for $\min_{\delta z}\|J\,\delta z-\delta d\|$.
   Forklar med 1d hva det betyr: $J\,\delta z$ er de fire
   avstandsendringene når vi flytter oss $\delta z$. Hvilken flytting
   velger minste kvadrater da?
3. **Talleksempel midt i hallen.** La $z_*=(5,4)$. Enhetsvektorene fra
   ankrene til $z_*$ gir
   $$J=\frac{1}{\sqrt{41}}\begin{bmatrix}5&4\\-5&4\\-5&-4\\5&-4\end{bmatrix}.$$
   Regn ut $J^TJ$. Finn så $\delta z$ når
   (a) anker 1 måler 10 cm for langt, $\delta d=(0.1,\,0,\,0,\,0)$, og
   (b) alle fire måler 10 cm for langt, $\delta d=(0.1,\,0.1,\,0.1,\,0.1)$.
   Hvilken vei flytter anslaget seg i (a)? Forklar med ord svaret i (b).

<details>
<summary>Regnehjelp: flyttingen og talleksempelet</summary>

**Steget.** Med $r(z_*)=0$ er $r^{\text{ny}}(z_*)=-\delta d$. Da er
$-J^Tr^{\text{ny}}=J^T\delta d$, så $J^TJ\,\delta z=J^T\delta d$. Det er uke 4
med $A=J$, ukjent $c=\delta z$ og høyreside $b=\delta d$. Minste kvadrater
velger altså **den flyttingen som forklarer målefeilene best**: den
flyttingen som gir avstandsendringer $J\,\delta z$ så nær $\delta d$ som mulig.

**$J^TJ$.** Element $(1,1)$ er kolonne 1 prikket med seg selv,
$(25+25+25+25)/41=100/41$. Element $(1,2)$ er
$(5\cdot4-5\cdot4+5\cdot4-5\cdot4)/41=0$, og element $(2,2)$ er
$(16+16+16+16)/41=64/41$. Altså
$$J^TJ=\frac{1}{41}\begin{bmatrix}100&0\\0&64\end{bmatrix}.$$

**(a)** $J^T\delta d=0.1\cdot(\text{rad }1)^T=\dfrac{0.1}{\sqrt{41}}(5,\,4)$.
Matrisen er diagonal, så vi deler komponent for komponent:
$$\delta z=\Bigl(\frac{41}{100}\cdot\frac{0.5}{\sqrt{41}},\ \frac{41}{64}\cdot\frac{0.4}{\sqrt{41}}\Bigr)
=\Bigl(\frac{0.5\sqrt{41}}{100},\ \frac{0.4\sqrt{41}}{64}\Bigr)\approx(0.0320,\ 0.0400).$$
Anslaget flytter seg omtrent 5 cm bort fra anker 1, litt skjevt: mer i
$y$ enn i $x$. Avstanden til anker 1 øker med
(rad 1)$\cdot\delta z=(5\cdot0.032+4\cdot0.040)/\sqrt{41}\approx0.05$, altså
halvparten av feilen. Resten blir igjen i residualen.

**(b)** $J^T\delta d=0.1\cdot(\text{summen av radene})^T=0.1\cdot(5-5-5+5,\
4+4-4-4)/\sqrt{41}=(0,0)$, så $\delta z=0$. Rad 1 og rad 3 er motsatte
vektorer, og det samme gjelder rad 2 og 4. En liten flytting endrer derfor
avstandene til to motsatte hjørner like mye, men med motsatt fortegn, og
summen av de fire endringene er null. Ingen liten flytting kan forklare at
alle fire er like mye for lange, så feilen blir værende i residualen.

</details>

**Ta med videre:** En liten målefeil $\delta d$ flytter anslaget med
$\delta z$, der $J^TJ\,\delta z=J^T\delta d$: flyttingen som forklarer
målefeilene best. Noen målefeil flytter anslaget, andre blir bare
liggende i residualen.

### Kodespor 2: kontroller formelen

Formelen bygger på ett Gauss–Newton-steg. Er det nok? Vi kontrollerer den
ved å kjøre hele Gauss–Newton på nytt med de endrede målingene og
sammenligne. Du skriver formelen som én linje, på samme måte som `gn_step`.
Målet er å se at formelen stemmer så godt at vi kan bruke den i resten av
del 3 i stedet for å regne alt på nytt.

- Fullfør `move` og kjør cellen. Stemmer den første linjen med (a) i 3a?
- Bytt `z_c` til `z_true`, altså $(3,5)$, og kjør igjen. Flytter «alle
  fire for lange» fortsatt ingenting? Hvorfor ikke?

Cellen regner ut flyttingen med formelen og med hele Gauss–Newton for hver
av de fire ett-anker-feilene, og til slutt for «alle fire for lange».

```{pyodide-python}
#| label: project10-moves
def move(J, delta_d):
    # TODO: løs min ||J dz - delta_d|| med np.linalg.lstsq og returner dz.
    raise NotImplementedError('Fullfør move')

z_c = np.array([5., 4.])                     # midt i hallen
d_c = np.linalg.norm(z_c - hall, axis=1)     # eksakte avstander derfra
J = jacobian(z_c, hall)
for i in range(4):
    delta_d = np.zeros(4); delta_d[i] = .1   # anker i+1 måler 10 cm for langt
    full = gauss_newton(z_c, hall, d_c + delta_d, steps=5)[-1] - z_c
    print(f'anker {i+1}: formel {move(J, delta_d).round(4)},  Gauss-Newton på nytt {full.round(4)}')
print('alle fire 10 cm for lange:', move(J, .1*np.ones(4)).round(4) + 0.)
```

Midt i hallen skal du få $(0.032,\,0.040)$ for anker 1 fra begge
metodene; Gauss–Newton på nytt gir $0.0401$ i andre komponent.
Flyttingene for de andre ankrene er speilbilder av denne, og «alle fire
for lange» gir $(0,0)$. I $(3,5)$ gir den siste linjen
$(-0.0212,\,0.0175)$.

### 3b. Verste fall: ellipsen fra SVD

Vi har prøvd noen få målefeil. Men målefeilen er ukjent og kan være en
hvilken som helst vektor i $\mathbb R^4$. Vi spør derfor: **av alle
målefeil med lengde $\varepsilon$, hvilken flytter anslaget mest, og hvor
langt?** Her svarer SVD fra uke 7. Der så vi at $J$ sender enhetssirkelen
til en ellipse, med $Jv_i=\sigma_iu_i$. Høyre singulærvektorer $v_1,v_2$
er retninger vi kan flytte oss i (i planet), og venstre singulærvektorer
$u_1,u_2$ er mønstre av avstandsendringer (i $\mathbb R^4$).

1. **Målefeilen $\varepsilon u_i$.** Anta at $\delta d=\varepsilon u_i$. Vis
   at flyttingen $\delta z=\varepsilon v_i/\sigma_i$ forklarer målefeilen
   nøyaktig. Første linje er gitt:
   $$J\Bigl(\frac{\varepsilon}{\sigma_i}v_i\Bigr)=\frac{\varepsilon}{\sigma_i}Jv_i=\ \ldots$$
   Residualen $J\,\delta z-\delta d$ blir null, så ingen flytting kan gjøre
   det bedre: dette er minste kvadraters løsning. Hvor langt flytter anslaget seg?
2. **Tolk.** For å endre avstandene med mønsteret $u_2$ må vi flytte oss
   $\varepsilon/\sigma_2$ langs $v_2$. Forklar med ord hvorfor en liten
   $\sigma_2$ betyr at en liten målefeil kan flytte anslaget langt.
3. **Regelen (gitt).** Alle målefeil med lengde $\varepsilon$ flytter
   anslaget til et punkt **inne i ellipsen** med halvakser
   $\varepsilon/\sigma_1$ langs $v_1$ og $\varepsilon/\sigma_2$ langs $v_2$.
   Målefeil som er kombinasjoner av $u_1$ og $u_2$, havner på kanten.
   Den største mulige flyttingen er altså $\varepsilon/\sigma_2$. Appen
   under viser hvorfor.
4. **Midt i hallen.** Bruk $J^TJ$ fra 3a. Den er diagonal, så egenverdiene
   er diagonalelementene, og $\sigma_i$ er kvadratroten av dem. Finn
   $\sigma_1$, $\sigma_2$, $v_1$, $v_2$ og halvaksene for
   $\varepsilon=0.1$ m. Ligger flyttingen fra (a) i 3a inne i ellipsen?

<details>
<summary>Regnehjelp: verste fall og ellipsen</summary>

**Punkt 1.** $\frac{\varepsilon}{\sigma_i}Jv_i=\frac{\varepsilon}{\sigma_i}\sigma_iu_i=\varepsilon u_i=\delta d$.
Flyttingen har lengde $\varepsilon/\sigma_i$, fordi $\|v_i\|=1$.

**Hvorfor en ellipse?** Den delen av målefeilen som ikke er en
kombinasjon av $u_1$ og $u_2$, flytter ingenting, akkurat som «alle fire
for lange» midt i hallen. Appen under viser resten.

**Midt i hallen** er egenverdiene $100/41$ og $64/41$, så
$\sigma_1=10/\sqrt{41}\approx1.562$ langs $v_1=(1,0)$ og
$\sigma_2=8/\sqrt{41}\approx1.249$ langs $v_2=(0,1)$. (Fortegnet på en
singulærvektor er fritt: $-v_i$ og $-u_i$ passer like godt. Her, i appen og
i figuren velger vi det som gjør største komponent positiv.) Halvaksene er
$0.1/1.562\approx0.064$ m i $x$-retning og $0.1/1.249\approx0.080$ m i
$y$-retning. Flyttingen $(0.032,\,0.040)$ har lengde $0.051$ og ligger
inne i ellipsen: $(0.032/0.064)^2+(0.040/0.080)^2=0.25+0.25=0.5<1$.

</details>

**Se regelen i en app.** Til venstre er målefeilen $\delta d$. Vi tegner
bare delen langs $u_1$ og $u_2$, altså tallene $c_1$ og $c_2$ i
$\delta d=c_1u_1+c_2u_2+\ldots$, for resten flytter ingenting. Skiven har
radius $\varepsilon=10$ cm. Til høyre er flyttingen
$\delta z=c_1v_1/\sigma_1+c_2v_2/\sigma_2$ og ellipsen fra regelen. Dra det
oransje punktet rundt kanten av skiven og se hvor $\delta z$ går. Dra det
så inn mot midten. De blå punktene er de åtte målefeilene «ett anker
$\pm10$ cm». Dra til slutt taggen i kartet nederst, for eksempel til
$(3,5)$ eller langt ut av hallen til høyre.

```{.jsxgraph width="620" height="460" style="width:100%;max-width:620px;height:460px;border:0;"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-0.1, 7.6, 10.3, -0.1], axis: false, keepaspectratio: true,
  showNavigation: false, showCopyright: false,
  pan: {enabled:false}, zoom: {enabled:false}
});
// Hallen 10 m x 8 m med ett anker i hvert hjørne. eps = 10 cm er lengden på målefeilen.
var B = [[0, 0], [10, 0], [10, 8], [0, 8]], eps = 0.1;
var c1 = [2.0, 4.6], rad = 1.6;   // venstre: skiven for målefeilen (radius rad svarer til eps)
var c2 = [7.6, 4.6], k = 8;       // høyre: flyttingen, k tegneenheter per meter
var m0 = [0.4, 0.15], km = 0.15;  // nederst: kartet, km tegneenheter per meter
function toMap(x, y) { return [m0[0] + km*x, m0[1] + km*y]; }
// Kartet: hallen, ankrene og taggen, som du kan dra (rutenett 0.5 m).
board.create('polygon', [toMap(0, 0), toMap(10, 0), toMap(10, 8), toMap(0, 8)],
  {fillColor:'#eceff1', fillOpacity:1, borders:{strokeColor:'#90a4ae', strokeWidth:1},
   vertices:{visible:false}, fixed:true, highlight:false});
for (var i = 0; i < 4; i++) {
  board.create('point', toMap(B[i][0], B[i][1]), {name:'', face:'square', size:3,
    color:'#212121', fixed:true, highlight:false});
}
var T = board.create('point', toMap(5, 4), {name:'tag', size:5, strokeColor:'#c62828', fillColor:'#c62828',
  label:{offset:[6, 8], fontSize:12}});
function tag() { return [(T.X() - m0[0])/km, (T.Y() - m0[1])/km]; }
T.on('drag', function () {      // hold taggen i området x i [0.5, 30], y i [0.5, 7.5], på et 0.5 m-rutenett
  var z = tag(), x = Math.round(2*Math.min(30, Math.max(0.5, z[0])))/2,
      y = Math.round(2*Math.min(7.5, Math.max(0.5, z[1])))/2;
  T.setPositionDirectly(JXG.COORDS_BY_USER, toMap(x, y));
});
for (var i = 0; i < 4; i++) {
  (function (b) {
    board.create('segment', [toMap(b[0], b[1]), [function () { return T.X(); }, function () { return T.Y(); }]],
      {strokeColor:'#b0bec5', strokeWidth:1, fixed:true, highlight:false});
  })(B[i]);
}
board.create('text', [5.3, 1.0, 'dra taggen i kartet'], {fontSize:12, color:'#c62828', fixed:true});
board.create('text', [5.3, 0.45, function () {
  var z = tag(); return 'taggen i (' + z[0].toFixed(1) + ', ' + z[1].toFixed(1) + ') m';
}], {fontSize:12, color:'#37474f', cssStyle:'background-color:rgba(255,255,255,0.85);', highlight:false, fixed:true});
// SVD av J (4 x 2) via egenverdiene til J^T J (2 x 2).
function svd() {
  var z = tag(), J = [], a = 0, b = 0, c = 0;
  for (var i = 0; i < 4; i++) {
    var dx = z[0] - B[i][0], dy = z[1] - B[i][1], n = Math.sqrt(dx*dx + dy*dy);
    J.push([dx/n, dy/n]); a += dx*dx/(n*n); b += dx*dy/(n*n); c += dy*dy/(n*n);
  }
  var m = (a + c)/2, q = Math.sqrt((a - c)*(a - c)/4 + b*b), l1 = m + q, l2 = m - q, v1;
  if (Math.abs(b) > 1e-12) { v1 = [l1 - c, b]; } else { v1 = a >= c ? [1, 0] : [0, 1]; }
  var nv = Math.hypot(v1[0], v1[1]); v1 = [v1[0]/nv, v1[1]/nv];
  var v2 = [-v1[1], v1[0]], s1 = Math.sqrt(l1), s2 = Math.sqrt(l2), U = [];
  // Fortegnet på et par u_i, v_i er fritt; vi velger det som gjør største komponent i v_i positiv.
  function plus(v) { return (Math.abs(v[1]) > Math.abs(v[0]) ? v[1] < 0 : v[0] < 0) ? [-v[0], -v[1]] : v; }
  v1 = plus(v1); v2 = plus(v2);
  for (var i = 0; i < 4; i++) {
    U.push([(J[i][0]*v1[0] + J[i][1]*v1[1])/s1, (J[i][0]*v2[0] + J[i][1]*v2[1])/s2]);
  }
  return {J: J, s1: s1, s2: s2, v1: v1, v2: v2, U: U, A: [a, b, c]};
}
// Venstre: skiven med alle målefeil eps*(cos t u1 + sin t u2) på kanten.
board.create('circle', [c1, rad], {strokeColor:'#ef6c00', strokeWidth:1.5, dash:2,
  fillColor:'#fff3e0', fillOpacity:0.5, fixed:true, highlight:false});
board.create('arrow', [c1, [c1[0] + rad, c1[1]]], {strokeColor:'#546e7a', strokeWidth:1.5, fixed:true, highlight:false});
board.create('arrow', [c1, [c1[0], c1[1] + rad]], {strokeColor:'#546e7a', strokeWidth:1.5, fixed:true, highlight:false});
board.create('text', [c1[0] + rad + 0.08, c1[1], 'u₁'], {fontSize:14, color:'#546e7a', fixed:true, anchorY:'middle'});
board.create('text', [c1[0] + 0.1, c1[1] + rad + 0.15, 'u₂'], {fontSize:14, color:'#546e7a', fixed:true});
board.create('text', [c1[0] + 0.75*rad, c1[1] - 0.85*rad, 'lengde ε = 10 cm'], {fontSize:12, color:'#ef6c00', fixed:true});
var C = board.create('point', [c1[0] + rad*Math.cos(1.05), c1[1] + rad*Math.sin(1.05)],
  {name:'δd', size:5, color:'#ef6c00', label:{offset:[8, 8], fontSize:14}});
C.on('drag', function () {      // målefeilen har lengde høyst eps: hold punktet i skiven
  var dx = C.X() - c1[0], dy = C.Y() - c1[1], n = Math.hypot(dx, dy);
  if (n > rad) { C.setPositionDirectly(JXG.COORDS_BY_USER, [c1[0] + rad*dx/n, c1[1] + rad*dy/n]); }
});
function cvec() { return [eps*(C.X() - c1[0])/rad, eps*(C.Y() - c1[1])/rad]; }   // (c1, c2) i meter
function move(c) {              // delta z = c1 v1/s1 + c2 v2/s2
  var S = svd();
  return [c[0]*S.v1[0]/S.s1 + c[1]*S.v2[0]/S.s2, c[0]*S.v1[1]/S.s1 + c[1]*S.v2[1]/S.s2];
}
// Høyre: ellipsen med halvakser eps/s1 langs v1 og eps/s2 langs v2.
board.create('curve', [
  function (t) { var S = svd(); return c2[0] + k*eps*(Math.cos(t)*S.v1[0]/S.s1 + Math.sin(t)*S.v2[0]/S.s2); },
  function (t) { var S = svd(); return c2[1] + k*eps*(Math.cos(t)*S.v1[1]/S.s1 + Math.sin(t)*S.v2[1]/S.s2); },
  0, 2*Math.PI], {strokeColor:'#c62828', strokeWidth:2, highlight:false});
function axisArrow(j) {
  var tip = function (q) { return function () { var S = svd(), v = j ? S.v2 : S.v1, s = j ? S.s2 : S.s1;
    return c2[q] + k*eps*v[q]/s; }; };
  board.create('arrow', [c2, [tip(0), tip(1)]], {strokeColor:'#546e7a', strokeWidth:1.5, fixed:true, highlight:false});
  board.create('text', [function () { var S = svd(), v = j ? S.v2 : S.v1; return tip(0)() + 0.18*v[0] - 0.1; },
                        function () { var S = svd(), v = j ? S.v2 : S.v1; return tip(1)() + 0.18*v[1]; },
                        j ? 'v₂' : 'v₁'], {fontSize:14, color:'#546e7a', fixed:true, anchorY:'middle'});
}
axisArrow(0); axisArrow(1);
board.create('point', c2, {name:'', face:'x', size:4, color:'#212121', fixed:true, highlight:false});
var Z = board.create('point', [function () { return c2[0] + k*move(cvec())[0]; },
                               function () { return c2[1] + k*move(cvec())[1]; }],
  {name:'δz', size:5, color:'#ef6c00', fixed:true, label:{offset:[8, 8], fontSize:14}});
board.create('arrow', [c2, Z], {strokeColor:'#ef6c00', strokeWidth:2, fixed:true, highlight:false});
// Blå: de åtte målefeilene «ett anker +-10 cm». Venstre: delen langs u1 og u2. Høyre: flyttingen.
for (var i = 0; i < 4; i++) {
  for (var sg = -1; sg <= 1; sg += 2) {
    (function (i, sg) {
      board.create('point', [function () { return c1[0] + sg*rad*svd().U[i][0]; },
                             function () { return c1[1] + sg*rad*svd().U[i][1]; }],
        {name:'', size:3, color:'#1565c0', fixed:true, highlight:false});
      board.create('point', [function () { return c2[0] + k*move([sg*eps*svd().U[i][0], sg*eps*svd().U[i][1]])[0]; },
                             function () { return c2[1] + k*move([sg*eps*svd().U[i][0], sg*eps*svd().U[i][1]])[1]; }],
        {name:'', size:3, color:'#1565c0', fixed:true, highlight:false});
    })(i, sg);
  }
}
// Målestokk for flyttingen.
board.create('segment', [[5.4, 7.0], [5.4 + k*0.1, 7.0]], {strokeColor:'#212121', strokeWidth:3, fixed:true, highlight:false});
board.create('text', [5.4, 7.3, '10 cm'], {fontSize:12, color:'#212121', fixed:true});
board.create('text', [0.1, 7.3, 'målefeilen δd'], {fontSize:14, color:'#ef6c00', fixed:true});
board.create('text', [7.0, 7.3, 'flyttingen δz'], {fontSize:14, color:'#ef6c00', fixed:true});
board.create('text', [0.1, 2.75, function () {
  var dz = move(cvec()); return '|δz| = ' + Math.hypot(dz[0], dz[1]).toFixed(3) + ' m';
}], {fontSize:12, color:'#ef6c00', cssStyle:'background-color:rgba(255,255,255,0.85);', highlight:false, fixed:true});
board.create('text', [0.1, 2.15, function () {
  return 'største |δz|: ε/σ₂ = ' + (eps/svd().s2).toFixed(3) + ' m';
}], {fontSize:12, color:'#c62828', cssStyle:'background-color:rgba(255,255,255,0.85);', highlight:false, fixed:true});
board.create('text', [0.1, 1.55, function () {
  var S = svd(); return 'σ₁ = ' + S.s1.toFixed(3) + ',  σ₂ = ' + S.s2.toFixed(3);
}], {fontSize:12, color:'#37474f', cssStyle:'background-color:rgba(255,255,255,0.85);', highlight:false, fixed:true});
```

**Hva viser bildet?** Når $\delta d$ går rundt kanten av skiven, går
$\delta z$ rundt ellipsen, og inne i skiven havner $\delta z$ inne i
ellipsen. Den lengste flyttingen får vi når $\delta d$ peker langs $u_2$:
midt i hallen er den $\varepsilon/\sigma_2=0.080$ m. De blå punktene ligger
inne i skiven, fordi en ett-anker-feil også har en del som ikke er en
kombinasjon av $u_1$ og $u_2$, og den delen flytter ingenting. Derfor
havner de inne i ellipsen. I $(3,5)$ er ellipsen dreid. Når taggen går ut
av hallen, blir den lang og smal på tvers, og det ser vi nærmere på i «Gå
ut av hallen».

Nå kontrollerer vi regelen med din egen `move` for to grupper av
målefeil, alle med lengde $\varepsilon=0.1$: ett anker om gangen med
$\pm10$ cm, og 24 målefeil $\varepsilon(\cos t\,u_1+\sin t\,u_2)$ med lik
avstand rundt en sirkel. Hjelperen `show_moves` tegner flyttingene og
ellipsen fra SVD.

- Forutsi ut fra appen: hvilken gruppe havner på kanten av ellipsen, og
  hvilken inne i?
- Kjør cellen. Bytt så `z_c` til `z_true` igjen: hva skjer med aksene?

Cellen skriver først ut singulærverdiene og lengden av den verste
flyttingen, og tegner så alle flyttingene sammen med ellipsen.

```{pyodide-python}
#| label: project10-ellipse
eps = .1
z_c = np.array([5., 4.])
J = jacobian(z_c, hall)
U, s, Vt = np.linalg.svd(J, full_matrices=False)
print('singulærverdier:', s.round(4), '  halvakser eps/sigma:', (eps/s).round(4))
worst = move(J, eps*U[:, 1])
print(f'flyttingen for målefeilen eps*u2 har lengde {np.linalg.norm(worst):.4f}')
one_anchor = [move(J, sign*eps*e) for e in np.eye(4) for sign in (1, -1)]
circle = [move(J, eps*(np.cos(t)*U[:, 0] + np.sin(t)*U[:, 1])) for t in np.linspace(0, 2*np.pi, 25)]
show_moves(z_c, J, eps, {'ett anker ±10 cm': one_anchor, 'eps (cos t u1 + sin t u2)': circle})
```

Midt i hallen er singulærverdiene $1.5617$ og $1.2494$, halvaksene
$0.064$ og $0.080$ m, og den verste målefeilen flytter anslaget
$0.0800$ m. Sirkelgruppen ligger på ellipsen, og ett-anker-gruppen ligger
inne i den. (Midt i hallen gir $+10$ cm i anker 1 og $-10$ cm i anker 3
samme flytting, så du ser bare fire blå punkter.) I $(3,5)$ er halvaksene
$0.0656$ og $0.0772$ m, og ellipsen er dreid: $v_1$ og $v_2$ følger ikke
lenger aksene.

### Gå ut av hallen

I hallen ser taggen ankrene i fire ganske forskjellige retninger, og
ellipsen er nesten rund. Hva skjer når den ikke gjør det? Vi flytter
taggen bort fra hallen langs linjen $y=4$, til punktene $(5+R,\,4)$. Da
ligger ankrene etter hvert nesten i samme retning sett fra taggen. Målet er
å se hvordan retningene til ankrene styrer presisjonen.

**Forutsi først:** Hvilken halvakse vokser, og hvilken holder seg? Tenk på
hvordan ankrene ser ut sett fra langt unna.

Cellen gjentar regningen fra 3b for fire avstander $R$, én rad per
avstand: singulærverdiene, den største mulige flyttingen
$\varepsilon/\sigma_2$, flyttingen når anker 1 måler 10 cm for langt (fra
formelen og fra Gauss–Newton på nytt) og når alle fire gjør det.

```{pyodide-python}
#| label: project10-far-away
eps = .1
print('    R   sigma_1  sigma_2   eps/sigma_2   anker 1 +10 cm: formel (GN på nytt)   alle fire +10 cm')
for R in [0, 20, 50, 100]:
    z_far = np.array([5. + R, 4.])
    d_far = np.linalg.norm(z_far - hall, axis=1)
    J = jacobian(z_far, hall)
    s = np.linalg.svd(J, compute_uv=False)
    delta_d = np.array([eps, 0., 0., 0.])
    full = gauss_newton(z_far, hall, d_far + delta_d, steps=8)[-1] - z_far
    print(f'{R:5d}   {s[0]:.3f}    {s[1]:.3f}     {eps/s[1]:.3f}        '
          f'{move(J, delta_d).round(3)} ({full.round(3)})   {move(J, eps*np.ones(4)).round(3) + 0.}')
```

Den største flyttingen $\varepsilon/\sigma_2$ vokser omtrent proporsjonalt
med avstanden: $0.080$, $0.234$, $0.618$ og $1.246$ m for $R=0,20,50,100$.
Langt unna flytter en feil på 10 cm i anker 1 anslaget omtrent $0.59$ m
på tvers ($y$), mens 10 cm for mye i alle fire flytter det omtrent
$0.10$ m mot eller fra hallen ($x$). Formelen og Gauss–Newton på nytt
stemmer på noen millimeter også her.

1. Forklar med ord hvorfor $\sigma_2\to0$, og hvorfor det gir stor
   usikkerhet på tvers. Bruk 1d: hvor mye endres avstandene når taggen
   flytter seg litt på tvers av retningen til ankrene?
2. *(valgfri fordypning)* Langt unna peker alle radene i $J$ nesten i samme
   retning. Kall den $a$, med $\|a\|=1$. Bruk det til å forklare at
   $\sigma_1\to2$. (Hint: $J\approx\mathbf 1a^T$, der $\mathbf 1$ er
   vektoren med fire enere.)

<details>
<summary>Regnehjelp: singulærverdiene langt unna</summary>

En flytting på tvers står nesten vinkelrett på alle radene, så den endrer
nesten ingen avstand. Da kan en liten målefeil bare forklares med en stor
flytting på tvers, og det er det en liten $\sigma_2$ betyr.
Avstandsmålingene sier altså nesten bare noe om avstanden til hallen, ikke
om posisjonen på tvers.

*Valgfri del.* Med $J\approx\mathbf 1a^T$ er
$J^TJ\approx a\,\mathbf 1^T\mathbf 1\,a^T=4\,aa^T$. Denne matrisen har
egenverdien $4$ langs $a$ (så $v_1\approx a$) og $0$ på tvers, så
$\sigma_1\approx\sqrt4=2$ og $\sigma_2\approx0$.

</details>

**Ta med videre:** En målefeil med lengde $\varepsilon$ flytter anslaget
høyst $\varepsilon/\sigma_2$, langs $v_2$. Singulærverdiene til $J$ måler
hvor godt målingene skiller ulike retninger, og ankre som ses i nesten
samme retning, gir en nesten rangmangelfull $J$ og en lang, smal ellipse.

## 4. Konvergert, men feil?

I del 3 så vi at ankre i nesten samme retning gir dårlig presisjon på
tvers. Nå tar vi det et steg videre og setter ankrene nesten på en rett
linje, langs én vegg:

$$b_1=(0,0),\quad b_2=(4,\,0.1),\quad b_3=(7,\,-0.1),\quad b_4=(10,0).$$

Taggen står i $(6,3)$, og målingene er **eksakte** (`wall`, `d_wall`). Ut
fra avstandene alene er speilbildet av taggen i veggen nesten like godt
som den riktige posisjonen. Cellen kjører Gauss–Newton fra ett punkt på hver side
av veggen og skriver ut sluttpunktet, residualnormen og gradientnormen
$\|J^Tr\|$. Målet er å finne ut om gradienten eller residualen avslører et
galt svar.

```{pyodide-python}
#| label: project10-wall
for start in ([5., 4.], [5., -4.]):
    path = gauss_newton(start, wall, d_wall, steps=15)
    z_end = path[-1]
    r = residual(z_end, wall, d_wall)
    J = jacobian(z_end, wall)
    print(f'start {start}: slutt {z_end.round(4)}, ||r|| = {np.linalg.norm(r):.3f}, '
          f'||J^T r|| = {np.linalg.norm(J.T @ r):.1e}')
show_hall(wall, d_wall, [gauss_newton(s, wall, d_wall, 15) for s in ([5., 4.], [5., -4.])],
          ['start (5, 4)', 'start (5, -4)'], true=z_true_wall)
```

Fra $(5,4)$ finner vi $(6,3)$. Fra $(5,-4)$ ender vi i $(5.92,\,-3.02)$.
Der er gradienten $J^Tr$ null i flyttall, så metoden har konvergert, men
**residualnormen er $0.224$ m med eksakte data**.

1. Bruk nivåkurvene til å forklare hva punktet $(5.92,-3.02)$ er, og
   hvorfor det ligger nær speilbildet $(6,-3)$ av den riktige posisjonen.
   Hvorfor kan gradient null ikke skille det fra det riktige punktet? Knytt
   svaret til [uke 8.4](uke8.qmd#uke8-lokalt): er $F$ konveks?
2. **Modellkontroll uten fasit.** I praksis kjenner vi ikke fasiten. Anta
   at hver av de $m=4$ målingene er høyst $\varepsilon$ feil. I den
   riktige posisjonen er residualen $r=-\delta d$ (som i 3a), så der er
   $\|r\|\le\sqrt{4\varepsilon^2}=2\varepsilon$. Den beste tilpasningen har
   en residual som er høyst like stor, for den minimerer jo $\|r\|$. Hva
   er grensen for $\varepsilon=0.05$ m? Hva betyr da $\|r\|=0.224$? Kan en
   residual over grensen ha en annen forklaring enn et falskt minimum? Og
   beviser en residual under grensen at svaret er riktig?

### Start på veggen: et steg som blir for langt

Hva skjer hvis vi starter **på** linjen gjennom ankrene, i $(5,0)$? Da peker
alle radene i $J$ nesten langs veggen, og $J$ er nesten rangmangelfull, som
langt unna hallen i del 3. Cellen skriver ut singulærverdiene til $J$ og
lengden av det første Gauss–Newton-steget. Målet er å se hvordan en liten
singulærverdi gir et svært langt steg, og å reparere det med Armijo fra
uke 10.4.

```{pyodide-python}
#| label: project10-wall-start
z0 = np.array([5., 0.])
print('singulærverdier av J i (5,0):', np.linalg.svd(jacobian(z0, wall), compute_uv=False).round(3))
p = gn_step(z0, wall, d_wall)
print(f'Gauss-Newton: første steg er {np.linalg.norm(p):.1f} m langt, til {(z0 + p).round(2)}')
```

Du skal få $\sigma_2\approx0.08$ og et første steg på $11.3$ m, til et
punkt langt ute på feil side av veggen.

1. Forklar med singulærverdiene hvorfor steget blir så langt. (Hint:
   egenverdiene til $J^TJ$ er $\sigma_1^2$ og $\sigma_2^2$. Hva skjer når vi
   løser et system med en matrise som har egenverdien $\sigma_2^2\approx0.007$?)
2. Hvilken av sikringene fra [uke 10.4](uke10.qmd#uke10-demping) trengs
   her: Cholesky-forsøket for retningen eller Armijo for lengden? Begrunn
   med punkt 3 i 1c: $p^TJ^TJp=\|Jp\|^2\ge0$.

<details>
<summary>Regnehjelp: hvorfor steget blir langt, og hvilken sikring</summary>

Skriv $-J^Tr$ i egenvektorene til $J^TJ$, som er $v_1$ og $v_2$. Å løse
$J^TJp=-J^Tr$ betyr å dele komponenten langs $v_i$ på $\sigma_i^2$. Å dele
på $0.007$ er å gange med omtrent $150$, så selv en liten komponent langs
$v_2$ (på tvers av veggen) gir et svært langt steg.

Retningen er ikke problemet: $g^Tp=-\|Jp\|^2\le0$, så Gauss–Newton-steget
peker aldri oppover, og Cholesky-forsøket ville godta $\mu=0$. Det er
**lengden** som er gal, og den kontrollerer Armijo.

</details>

Fullfør Armijo-løkken i `armijo_step`: halver `alpha` så lenge testen fra
uke 10.4 ikke holder. Cellen bruker den først på det lange steget fra
$(5,0)$, og tar så ti sikrede steg.

```{pyodide-python}
#| label: project10-armijo
def armijo_step(z, B, d):
    p = gn_step(z, B, d)
    F = lambda w: .5*np.sum(residual(w, B, d)**2)
    slope = (jacobian(z, B).T @ residual(z, B, d)) @ p      # g^T p
    alpha = 1.
    # TODO: halver alpha så lenge F(z + alpha p) > F(z) + 1e-4 alpha g^T p.
    raise NotImplementedError('Fullfør Armijo-løkken')
    return alpha, p

z0 = np.array([5., 0.])                                     # starten på veggen, som over
F = lambda w: .5*np.sum(residual(w, wall, d_wall)**2)
alpha, p = armijo_step(z0, wall, d_wall)
print(f'F(z0) = {F(z0):.2f}, helt steg: F = {F(z0 + p):.1f}; Armijo godtar alpha = {alpha}, '
      f'F = {F(z0 + alpha*p):.2f} i {(z0 + alpha*p).round(2)}')
z = z0.copy()
for k in range(10):
    alpha, p = armijo_step(z, wall, d_wall)
    z = z + alpha*p
print(f'sikret Gauss-Newton fra (5,0) ender i {z.round(4)}, ||r|| = {np.linalg.norm(residual(z, wall, d_wall)):.3f}')
```

Du skal få $F(z_0)=5.42$. Det hele steget gir $F=107.4$, og Armijo godtar
$\alpha=0.25$ med $F=0.71$ i $(5.08,\,-2.83)$. Videre steg ender i
$(5.9162,\,-3.0193)$ med $\|r\|=0.224$: det falske minimumet fra starten
av del 4. **Armijo bestemmer hvor langt vi går, ikke hvilket minimum vi
ender i.** Det sikrede steget lander på feil side av veggen, og derfra
fører metoden oss pent til speilpunktet.

3. Armijo gjorde steget trygt. Hvorfor fant metoden likevel ikke $(6,3)$?
   Hva ville du gjøre for å finne den riktige posisjonen, når du ikke
   kjenner fasiten?

**Ta med videre:** Residualen kan avsløre et falskt minimum som gradienten
ikke ser. En nesten rangmangelfull $J$ gir både stor usikkerhet og svært
lange steg. Gauss–Newton-retningen peker alltid nedover, så Armijo er den
sikringen som trengs; den gjør stegene trygge, men gjør ikke problemet
konvekst.

## 5. Din påstand

Nå har du verktøyene: Gauss–Newton, formelen for flyttingen, ellipsen fra
SVD og modellkontrollen. Velg **én** av veiene nedenfor. Skriv påstanden
og forutsigelsen **før** du kjører, helst med singulærverdiene til $J$.
Kontroller deretter med `move` og `show_moves`, med Gauss–Newton på nytt,
eller med Gauss–Newton fra flere starter.

- **Et femte anker.** Hvor i eller ved hallen bør et femte anker stå for å
  gjøre den største mulige flyttingen $\varepsilon/\sigma_2$ minst mulig
  for en tag i $(3,5)$? Lag `B5 = np.vstack([hall, [x5, y5]])`.
- **Ankre nøyaktig på én linje.** Sett alle fire ankrene på $y=0$. Hva skjer
  med speilpunktet nå? Kan noen metode avgjøre hvilken side taggen er på?
- **Finn den feile målingen.** Se på residualvektoren i løsningen for
  `d_bad`. Peker den ut anker 3? Prøv å fjerne ett anker om gangen og
  sammenlign $\|r\|$ med modellkontrollen fra del 4 (nå med $m=3$).

Hold alt annet fast, og endre én ting. Avgrens konklusjonen til det du faktisk
har undersøkt, og vis også et eventuelt motfunn.

## Spørsmål du skal kunne svare på

1. Hva er gradienten og Hessianen til $F=\tfrac12\|r\|^2$, og hvilket ledd
   dropper Gauss–Newton?
2. Hvorfor er et Gauss–Newton-steg et minste kvadraters problem, og hvorfor
   løser vi det med `lstsq`?
3. Hva er Jacobimatrisen, og hva betyr en rad i den geometrisk?
4. Når konvergerer Gauss–Newton like raskt som Newton, og hvorfor?
5. Hvordan forutsier du konvergensfaktoren, og stemte forutsigelsen?
6. Hvordan flytter en liten målefeil $\delta d$ anslaget, og hvorfor
   flytter «alle fire 10 cm for lange» ingenting midt i hallen?
7. Hvor langt kan en målefeil med lengde $\varepsilon$ flytte anslaget, i
   hvilken retning, og hvorfor blir posisjonen usikker på tvers langt unna?
8. Hvordan kan residualen avsløre et falskt minimum, og hvorfor trenger
   Gauss–Newton Armijo, men ikke Cholesky-forsøket?
9. *(valgfri fordypning)* Hvor bør et femte anker stå?
10. *(valgfri fordypning)* Hva skjer når alle ankrene står på én linje?

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med:

- papirregningene fra 1a–1d (Jacobi-eksempelet, talleksempelet med én
  ukjent, gradienten og Hessianen med to ukjente og raden i $J$), kontrollen
  av regelen for $M$ på talleksempelet i del 2, og 3a–3b (flyttingen,
  talleksempelet midt i hallen og ellipsen);
- din kode for `residual`, `jacobian`, `gn_step`, `gauss_newton`, `move`
  og Armijo-løkken;
- konvergenstabellen fra del 2 med målte og forutsagte faktorer;
- ellipsefiguren fra 3b, tabellen fra «Gå ut av hallen» og forklaringen av
  hvorfor $\sigma_2\to0$ langt unna;
- diagnosen av det falske minimumet, forklaringen av det lange steget og
  resultatet av Armijo i del 4;
- forutsigelse, kontroll og konklusjon for din påstand i del 5.

Skriv i tillegg en vurdering på **300–500 ord**: når er Gauss–Newton like
god som Newton, hva bestemmer hvor presist vi vet posisjonen, og hvordan
oppdager du at et konvergert svar er feil? Papirregninger kan leveres som
leselige bilder i notebooken eller i en egen PDF.
