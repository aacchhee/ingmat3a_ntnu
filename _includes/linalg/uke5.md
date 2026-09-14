<div class="learning-mode" data-learning-mode data-reading-label="Gå i dybden" role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 5.0 Hva overlever?

<div id="uke5-start"></div>

Hva skjer hvis vi gjentar den samme lineære transformasjonen på en vektor mange ganger?
Og kan den samme regneoperasjonen brukes til å rangere nettsider?

Eksperimentene gir observasjoner å diskutere. Vi formulerer hypoteser,
skriver dem som algebra og undersøker hvilke betingelser de trenger.



**Undersøk, diskuter og begrunn.** Bruk figurene og de korte kodeforsøkene.
Under **Gå i dybden** finner du håndregning, begrunnelser og flere spørsmål.

Vi skal oppdage spesielle retninger, forklare hvorfor noen bidrag tar over,
og bruke den samme ideen til å rangere nettsider etter besøk.

### To deler: hente fram og bygge videre

| Matte 1 – dette henter vi fram | Matte 3A – dette bygger vi nå |
|---|---|
| Løse lineære likningssystemer; finne egenverdier og egenvektorer. Repetisjon i 5.2. | Forklare gjentatt multiplikasjon med bidrag langs egenvektorer, og undersøke når én retning dominerer. Forsøk i 5.1, teori i 5.3–5.4. |
| Bruke $(A-\lambda I)v=0$ til å finne alle egenvektorene til en egenverdi. | Knytte egenvektorbasis til tidligere arbeid med basis og ortogonalitet, og bruke dette i potensmetoden og PageRank (5.3–5.6). |

Du trenger ikke huske regneoppskriftene før første forsøk. I **Gå i dybden**
henter vi dem fram trinn for trinn. Oppgavene i 5.7 er delt i de samme to delene.

```{pyodide-python}
#| label: week5-setup
#| autorun: true
#| context: setup
# NumPy gir oss vektorer og matriser; Matplotlib tegner resultatene.
# Oppsettet kjøres automatisk og brukes av forsøkene i denne uken.

import numpy as np
import matplotlib.pyplot as plt
```

## 5.1 En retning vokser fram

<div id="uke5-erfaring"></div>

**Matte 3A: et nytt spørsmål.** Vi bruker et forsøk til å vekke til live
begrepene fra Matte 1; repetisjonen kommer i 5.2.

### Eksperiment 1 – hvilken retning blir igjen?

Vi gjentar transformasjonen $T(x)=Ax$, representert i standardbasisen ved

$$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}.$$

**Spørsmålet er om iterasjonsfølgene fra ulike startvektorer nærmer seg samme linje.**
Et klikk bruker transformasjonen én gang og setter deretter vektorlengden til én.
Dermed kan vi følge retningen uten at voksende lengder tar vektoren ut av figuren.
Undersøk både startvektorer som gir endret retning under iterasjonen,
og egenvektorer der alle itererte vektorer forblir på samme linje:

1. Velg **(1, 0)**. Gjett hvilken linje den blå vektoren vil nærme seg.
   Trykk **Ett steg** fem ganger og noter om koordinatene nærmer seg hverandre.
2. Velg **(−1, 0)** og gjenta. Er det samme linje? Samme orientering?
3. Velg **(1, 1)** og deretter **(1, −1)**. Gjør tre steg fra hver startvektor.
   Endres retningen? Skriv én observasjon for hver start.
4. Prøv også **(0, 1)** og **(1, −0.9)**. Det siste valget ligger nær den
   spesielle retningen $(1,-1)^T$. Dra deretter til en egen startvektor.

Startvalgene angir retninger. Å **normalisere** betyr her å dele på lengden,
slik at vektoren får lengde én. Den oransje
vektoren viser startvektoren $x_0$; den blå viser den normaliserte vektoren $x_k$. Hvert klikk
regner ut $Ax$ og deler på lengden til svaret. Vi bruker ingen
normalisering av enkeltkoordinater. Formelen ved det blå endepunktet viser
hvilket produkt retningen kommer fra, og at lengden er normalisert til én.
Den oransje ringen kan dras også når den ligger rundt det blå endepunktet.

```{.jsxgraph width="680" height="650" style="width:100%;max-width:680px;height:650px;border:0;"}
// The extension isolates this document in a sandboxed iframe. Keep both
// controls and their CSS here; board coordinates are only for mathematics.
document.documentElement.lang = 'nb';
var graph = document.querySelector('.jxgbox');
var labStyle = document.createElement('style');
labStyle.textContent = `
  html, body { margin: 0; width: 100%; height: 100%; font-family: system-ui, sans-serif; color: #243447; }
  * { box-sizing: border-box; }
  .week5-lab { height: 100%; padding: 16px; display: flex; flex-direction: column; gap: 12px;
    border: 1px solid #d4dde5; border-radius: 12px; background: #fff; }
  .week5-lab fieldset { margin: 0; padding: 0; border: 0; min-width: 0; }
  .week5-lab legend { padding: 0; margin-bottom: 8px; font-weight: 650; font-size: 16px; }
  .week5-presets { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .week5-lab button { min-height: 44px; padding: 8px; border: 1px solid #a8b6c4; border-radius: 7px;
    background: #fff; color: #243447; font: inherit; font-size: 15px; cursor: pointer; }
  .week5-lab button:hover { background: #f0f4f8; }
  .week5-lab button[aria-pressed="true"] { background: #fff1df; border: 2px solid #a04a00; font-weight: 700; }
  .week5-lab button:focus-visible { outline: 3px solid #1565c0; outline-offset: 2px; }
  .week5-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .week5-lab .week5-main-step { min-height: 48px; background: #1557a0; border-color: #1557a0;
    color: #fff; font-size: 18px; font-weight: 700; }
  .week5-lab .week5-main-step:hover { background: #10457f; }
  .week5-graph-slot { flex: 1 1 auto; min-height: 180px; position: relative; }
  .week5-graph-slot .jxgbox { position: absolute; inset: 0; width: 100% !important; height: 100% !important; border: 0; }
  .week5-readout { flex: 0 0 auto; padding: 12px; border-radius: 8px; background: #f3f6fa; }
  .week5-readout p { margin: 0; line-height: 1.5; }
  .week5-start-key { color: #854000; font-size: 14px; }
  .week5-formula { color: #1557a0; font-size: clamp(16px, 3vw, 20px); font-weight: 650; overflow-wrap: anywhere; }
  .week5-coordinates { font-size: 15px; font-variant-numeric: tabular-nums; }
  @media (max-width: 380px) { .week5-lab { padding: 10px; gap: 10px; } .week5-readout { padding: 10px; } .week5-actions { grid-template-columns: 1fr; } }
`;
document.head.appendChild(labStyle);
var lab = document.createElement('section');
lab.className = 'week5-lab';
lab.setAttribute('aria-label', 'Gjentatt matrisemultiplikasjon');
lab.innerHTML = `
  <fieldset><legend>Velg startretning</legend><div class="week5-presets"></div></fieldset>
  <div class="week5-actions">
    <button type="button" class="week5-main-step">Ett steg</button>
    <button type="button" class="week5-reset">Tilbake til startvektoren</button>
  </div>
  <div class="week5-graph-slot"></div>
  <div class="week5-readout">
    <p class="week5-start-key"></p>
    <p class="week5-start-key">Dra den oransje ringen for å velge en egen startvektor.</p>
    <div role="status" aria-live="polite" aria-atomic="true">
      <p class="week5-formula"></p>
      <p class="week5-coordinates"></p>
    </div>
  </div>
`;
graph.parentNode.insertBefore(lab, graph);
lab.querySelector('.week5-graph-slot').appendChild(graph);
var formula = lab.querySelector('.week5-formula');
var coordinates = lab.querySelector('.week5-coordinates');
var startKey = lab.querySelector('.week5-start-key');
var selectedStart = '(1, 0)';
var presets = [[1, 0, '(1, 0)'], [-1, 0, '(−1, 0)'], [1, 1, '(1, 1)'],
  [1, -1, '(1, −1)'], [0, 1, '(0, 1)'], [1, -0.9, '(1, −0.9)']];
var presetButtons = [];
var bounds = [-1.3, 1.3, 1.3, -1.3];
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: bounds, axis: true, pan: {enabled: false}, zoom: {enabled: false},
  showCopyright: false, showNavigation: false, keepaspectratio: true
});
var origin = board.create('point', [0, 0], {visible: false, fixed: true});
var circle = board.create('circle', [origin, 1], {strokeColor: '#aab6c1', dash: 2, fixed: true, highlight: false});
var start = board.create('glider', [1, 0, circle], {
  name: '', withLabel: false, size: 9, strokeWidth: 3, strokeColor: '#a04a00',
  fillColor: '#fff', fillOpacity: 0, highlightFillOpacity: 0, highlightStrokeColor: '#a04a00', layer: 9
});
board.create('arrow', [origin, start], {strokeColor: '#a04a00', strokeWidth: 2, dash: 2, fixed: true, highlight: false});
var current = [1, 0], count = 0;
var end = board.create('point', [function(){return current[0];}, function(){return current[1];}],
  {name: '', withLabel: false, fixed: true, size: 3, color: '#1565c0', highlight: false, layer: 8});
board.create('arrow', [origin, end], {strokeColor: '#1565c0', strokeWidth: 3, fixed: true, highlight: false});
// Keep the normalized iterate identifiable next to the blue endpoint.
// The compact fraction fits inside the board even for starts near its edges.
function canvasFormula() {
  var power = 'A<sup>'+count+'</sup>x<sub>0</sub>';
  return '<span style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;' +
    'background:rgba(255,255,255,.94);padding:3px 5px;border-radius:4px;color:#1565c0">' +
    '<span>x<sub>'+count+'</sub> =</span>' +
    '<span style="display:inline-flex;flex-direction:column;text-align:center;line-height:1.25">' +
    '<span style="border-bottom:1px solid #1565c0;padding:0 3px">'+power+'</span>' +
    '<span>‖'+power+'‖<sub>2</sub></span></span>';
}
// Use a DOM overlay inside the plotting area so JSXGraph's text renderer
// does not process or hide the HTML fraction.
var iterateLabel = document.createElement('div');
iterateLabel.className = 'week5-canvas-label';
iterateLabel.style.cssText = 'position:absolute;z-index:20;pointer-events:none;font-size:14px;line-height:1.25;';
lab.querySelector('.week5-graph-slot').appendChild(iterateLabel);
function positionIterateLabel() {
  var width = graph.clientWidth, height = graph.clientHeight;
  if (!(width > 0 && height > 0)) return;
  var px = board.origin.scrCoords[1] + current[0] * board.unitX;
  var py = board.origin.scrCoords[2] - current[1] * board.unitY;
  var labelWidth = iterateLabel.offsetWidth;
  var labelHeight = iterateLabel.offsetHeight;
  var left = Math.max(6, Math.min(width-labelWidth-6, px+12));
  var top = py-labelHeight-12;
  if (top < 6) top = py+12;
  top = Math.max(6, Math.min(height-labelHeight-6, top));
  iterateLabel.style.left = left+'px';
  iterateLabel.style.top = top+'px';
}
function formatCoordinate(value) { return (Math.abs(value) < 0.0005 ? 0 : value).toFixed(3); }
function updateReadout() {
  iterateLabel.innerHTML = canvasFormula();
  positionIterateLabel();
  startKey.textContent = 'Oransje ring · '+(selectedStart || 'Egen startvektor')+': x₀ = ('+
    formatCoordinate(start.X())+', '+formatCoordinate(start.Y())+')';
  formula.innerHTML = 'Blå: x<sub>'+count+'</sub> = A<sup>'+count+'</sup>x<sub>0</sub>' +
    ' / ‖A<sup>'+count+'</sup>x<sub>0</sub>‖<sub>2</sub>';
  var rounded = current.map(formatCoordinate);
  coordinates.textContent = 'Steg '+count+' · ('+rounded[0]+', '+rounded[1]+')';
}
function reset() {
  current = [start.X(), start.Y()]; count = 0; board.update(); updateReadout();
}
function choose(a, b, selected) {
  var length = Math.hypot(a, b);
  start.moveTo([a/length, b/length]);
  selectedStart = selected ? selected.textContent : null;
  presetButtons.forEach(function(button) { button.setAttribute('aria-pressed', String(button === selected)); });
  reset();
}
presets.forEach(function(preset) {
  var button = document.createElement('button');
  button.type = 'button'; button.textContent = preset[2];
  button.setAttribute('aria-pressed', String(presetButtons.length === 0));
  button.addEventListener('click', function() { choose(preset[0], preset[1], button); });
  presetButtons.push(button); lab.querySelector('.week5-presets').appendChild(button);
});
start.on('drag', function() {
  selectedStart = null;
  presetButtons.forEach(function(button) { button.setAttribute('aria-pressed', 'false'); });
  reset();
});
lab.querySelector('.week5-main-step').addEventListener('click', function() {
  var y = [2*current[0]+current[1], current[0]+2*current[1]];
  var length = Math.hypot(y[0], y[1]);
  current = [y[0]/length, y[1]/length]; count++; board.update(); updateReadout();
});
lab.querySelector('.week5-reset').addEventListener('click', reset);
// Re-measure on width changes and when the containing Quarto tab becomes visible.
// Ignore zero dimensions while hidden; retain CSS ownership of the graph size.
function resizeGraph() {
  var width = graph.clientWidth, height = graph.clientHeight;
  if (!(width > 0 && height > 0)) return;
  board.resizeContainer(width, height, true);
  board.setBoundingBox(bounds, true); board.fullUpdate();
  positionIterateLabel();
}
if (typeof ResizeObserver !== 'undefined') {
  var graphObserver = new ResizeObserver(resizeGraph);
  graphObserver.observe(graph);
}
window.addEventListener('resize', resizeGraph);
window.addEventListener('pageshow', resizeGraph);
updateReadout(); resizeGraph();
```

### Hva la du merke til?

For mange startvektorer nærmer følgen av normaliserte vektorer $x_k$ seg samme
**linje** når transformasjonen gjentas, men grensevektorene kan ha motsatt orientering.
Med startvektor langs $(1,1)^T$ eller $(1,-1)^T$ er retningen uendret gjennom iterasjonen. Vi skal undersøke hvordan transformasjonen virker langs disse linjene.

Figurens regneoperasjon kan nå skrives

$$x_{k+1}=\frac{Ax_k}{\lVert Ax_k\rVert_2},\qquad
x_k=\frac{A^kx_0}{\lVert A^kx_0\rVert_2}.$$

Her teller $k$ multiplikasjonene, $\lVert x\rVert_2$ er vektorens vanlige lengde,
og $I$ representerer identitetstransformasjonen $x\mapsto x$. Vi setter $A^0=I$.
**Diskuter:** Hvorfor kan vi miste informasjon om lengde og likevel se
hvilken retning som dominerer etter gjentatt transformasjon? Hva skiller de to spesielle startvektorene?

<details class="reading-step">
<summary>Gå i dybden: skaler uten å dreie</summary>

For startvektoren $(1,0)^T$ er første steg helt konkret

$$Ax_0=\begin{bmatrix}2\\1\end{bmatrix},\quad
\lVert Ax_0\rVert_2=\sqrt5,\quad
x_1=\frac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix}.$$

**Sjekk:** Regn ut hva som skjer med $(1,1)^T$ og $(1,-1)^T$.
Blir vektorene dreid, eller blir de bare ganget med et tall?

For $x=(a,b)^T$ gir rad-ganger-kolonne-regelen

$$Ax=\begin{bmatrix}2a+b\\a+2b\end{bmatrix},\qquad
\lVert Ax\rVert_2=\sqrt{(2a+b)^2+(a+2b)^2}.$$

Vi deler begge koordinatene på det samme positive tallet. Forholdet mellom
koordinatene og orienteringen bevares. Vektoren får lengde én.

Fra $x_0=(1,0)^T$ får vi

$$x_1=\frac{(2,1)^T}{\sqrt5},\qquad
Ax_1=\frac{(5,4)^T}{\sqrt5},\qquad
\lVert Ax_1\rVert_2=\frac{\sqrt{41}}{\sqrt5}.$$

Dermed kanselleres den tidligere normaliseringen:

$$x_2=\frac{(5,4)^T/\sqrt5}{\sqrt{41}/\sqrt5}
=\frac{(5,4)^T}{\sqrt{41}}
=\frac{A^2x_0}{\lVert A^2x_0\rVert_2}.$$

Den samme kanselleringen skjer ved hvert steg, og forklarer formelen i
figuren. Vi utfører små, normaliserte steg; vi trenger ikke beregne hele
$A^k$ eksplisitt. Formelen forutsetter at nevnerne er ulike null.

Uten normalisering er de første resultatene
$(1,0)^T,(2,1)^T,(5,4)^T,(14,13)^T$.
Koordinatforskjellen er hele tiden én, men forskjellen blir liten relativt
til størrelsen. Derfor nærmer retningen seg linjen $x_2=x_1$.
Her betyr $x_1,x_2$ i linjelikningen koordinater, mens indeksen $k$ i
$x_k$ ovenfor teller steg.

Ved valget $(1,-1)$ bruker figuren $x_0=(1,-1)^T/\sqrt2$.
Da er $Ax_0=x_0$ allerede for startvektoren. Dette er et viktig unntak fra
observasjonen om linjen $x_2=x_1$, som vi forklarer i 5.2–5.3.

</details>

## 5.2 Finn de spesielle retningene

<div id="uke5-egen"></div>

**Matte 1: hent fram egenverdier og egenvektorer.** Her repeterer vi
betydningen og regnemetoden; du finner full håndregning under «Gå i dybden».

### Fra geometrisk observasjon til algebra

I figuren i 5.1 forble alle itererte vektorer på samme linje som startvektoren
når denne lå langs $(1,1)^T$ eller $(1,-1)^T$. Figuren normaliserte lengden etter hvert steg. Nå spør vi:
**Hva gjør transformasjonen langs disse linjene før vi normaliserer?**

Vi tar den geometriske observasjonen «samme linje» og skriver den som
algebra: **resultatet $T(x)$ er et tall ganger startvektoren $x$**, altså
$T(x)=\lambda x$ for et tall $\lambda$ og en startvektor $x\ne0$.
Siden $T(x)=Ax$, blir dette $Ax=\lambda x$. For
$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ får vi

$$A\begin{bmatrix}1\\1\end{bmatrix}=3\begin{bmatrix}1\\1\end{bmatrix},
\qquad A\begin{bmatrix}1\\-1\end{bmatrix}=1\begin{bmatrix}1\\-1\end{bmatrix}.$$

Den ene retningen strekkes med faktor 3; den andre har faktor 1.
**Hva kunne normaliseringen i figuren skjule?** Vi bruker observasjonen
til å formulere en likning, og bruker så regning til å finne både
strekkfaktorene og alle vektorene som oppfyller likningen.

### Nå gir vi mønsteret et navn

En ikke-null vektor $v$ som oppfyller

$$Av=\lambda v$$

kalles en **egenvektor**. Tallet $\lambda$ er dens **egenverdi**.
For $\lambda\ne0$ blir vektoren på samme linje. Negativ $\lambda$ snur vektoren;
$\lambda=0$ sender den til null. Alle ikke-null multipler av $v$ er også
egenvektorer med samme egenverdi. Nullvektoren er utelatt fordi $A0=\lambda0$
gjelder for alle $\lambda$ og derfor ikke identifiserer noen spesiell retning.

Samlingen av egenverdier kalles matrisens **spektrum**.
Ordet **spektral** betyr at vi beskriver noe ved hjelp av disse egenverdiene.
For $A$ er spekteret $\{3,1\}$.
Fortegn forteller om orientering, og absoluttverdi forteller om lengdeskalering.

For en bestemt egenverdi $\lambda$ samler vi **alle** vektorer som oppfyller
likningen i **egenrommet**

$$E_\lambda=\{v:Av=\lambda v\}=\operatorname{Null}(A-\lambda I).$$

Det er et underrom og inneholder også nullvektoren. De øvrige vektorene i
rommet er egenvektorer. Her er $E_3=\operatorname{span}\{(1,1)^T\}$ og
$E_1=\operatorname{span}\{(1,-1)^T\}$: to linjer gjennom origo.
Et egenrom kan også ha høyere dimensjon; for identitetsmatrisen er hele
rommet egenrommet til egenverdien 1.

<details class="reading-step">
<summary>Gå i dybden: finn egenverdier og egenrom for hånd</summary>

**Undersøk de observerte retningene for hånd.**

Vi sammenligner to transformasjoner på de samme to retningene fra figuren.
Den første, $T(x)=Ax$, er den vi allerede har undersøkt. Den andre,
$R(x)=Bx$, bytter koordinatene: $R(x_1,x_2)=(x_2,x_1)$.
Vi innfører $B$ for å undersøke om en egenretning også kan få motsatt orientering.
Begge matrisene er gitt i standardbasisen.

$A=\begin{bmatrix}2&1\\1&2\end{bmatrix},\qquad
B=\begin{bmatrix}0&1\\1&0\end{bmatrix},\qquad
v=\begin{bmatrix}1\\1\end{bmatrix},\quad
w=\begin{bmatrix}1\\-1\end{bmatrix}.$$

1. Beregn $Av$ og $Aw$ med rad-ganger-kolonne-regelen.
2. Beregn $Bv$ og $Bw$ på samme måte.
3. Skriv hvert svar som et tall ganger startvektoren:
   $Av=\square v$, $Aw=\square w$, $Bv=\square v$, $Bw=\square w$.
4. Noter hvilke produkter som endrer lengden, og hvilket som snur
   orienteringen. **Ikke normaliser i dette forsøket.**

**Slik kan du tenke**

$$\begin{aligned}
Av&=\begin{bmatrix}2\cdot1+1\cdot1\\1\cdot1+2\cdot1\end{bmatrix}
=\begin{bmatrix}3\\3\end{bmatrix}=3v,
& Aw&=\begin{bmatrix}2-1\\1-2\end{bmatrix}
=\begin{bmatrix}1\\-1\end{bmatrix}=w,\\
Bv&=\begin{bmatrix}1\\1\end{bmatrix}=v,
& Bw&=\begin{bmatrix}-1\\1\end{bmatrix}=-w.
\end{aligned}$$

Transformasjonen $x\mapsto Ax$ tredobler lengden langs $v$ og lar $w$ være uendret.
Transformasjonen $x\mapsto Bx$ bytter koordinatene. For $w$ betyr dette en fortegnsendring,
men vektoren ligger fortsatt på samme linje gjennom origo.

**Hvordan finner vi dem uten å gjette?**

Vi vil finne et tall og en ikke-null vektor som oppfyller samme mønster.
Siden $Iv=v$, får vi

$$Av=\lambda v
\quad\Longleftrightarrow\quad
Av-\lambda Iv=0
\quad\Longleftrightarrow\quad
(A-\lambda I)v=0.$$

Vi trenger en ikke-null løsning. Derfor må $A-\lambda I$ være singulær:

$$\det(A-\lambda I)=0.$$

For $A$ fra forsøket viser vi begge regnetrinnene: først tallene, så vektorene.

$$A-\lambda I=\begin{bmatrix}2-\lambda&1\\1&2-\lambda\end{bmatrix},$$

$$\begin{aligned}
\det(A-\lambda I)&=(2-\lambda)(2-\lambda)-1\cdot1\\
&=\lambda^2-4\lambda+3=(\lambda-3)(\lambda-1)=0.
\end{aligned}$$

Dermed er $\lambda=3$ eller $\lambda=1$. Sett inn én verdi om gangen:

$$\begin{aligned}
\lambda=3:\quad
\begin{bmatrix}-1&1\\1&-1\end{bmatrix}
\begin{bmatrix}v_1\\v_2\end{bmatrix}=0
&\ \Longrightarrow\ v_2=v_1
\ \Longrightarrow\ v=t\begin{bmatrix}1\\1\end{bmatrix},\\
\lambda=1:\quad
\begin{bmatrix}1&1\\1&1\end{bmatrix}
\begin{bmatrix}v_1\\v_2\end{bmatrix}=0
&\ \Longrightarrow\ v_2=-v_1
\ \Longrightarrow\ v=t\begin{bmatrix}1\\-1\end{bmatrix}.
\end{aligned}$$

Her er $t$ fritt. **Egenrommet** er hele nullrommet til $A-\lambda I$,
inkludert $t=0$. **Egenvektorene** er løsningene med $t\ne0$.
Dermed har vi funnet igjen de to retningene fra forsøket uten å gjette dem.


**Hvorfor singulær?** Hvis $A-\lambda I$ var invertibel, kunne vi multiplisere
$(A-\lambda I)v=0$ med inversen og få $v=0$. Vi leter etter $v\ne0$.
Derfor må matrisen være singulær, det vil si at kolonnene er lineært avhengige
og at determinanten er null. Dette knytter egenverdiberegningen til nullrom i uke 3.

For en $2\times2$-matrise er
$\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc$.
I vårt eksempel er $a=d=2-\lambda$ og $b=c=1$. Utvid kvadratet:

$$(2-\lambda)^2-1=4-4\lambda+\lambda^2-1
=\lambda^2-4\lambda+3.$$

Tallene $-3$ og $-1$ har sum $-4$ og produkt $3$, så polynomet faktoriseres
som $(\lambda-3)(\lambda-1)$. Nullproduktregelen gir de to egenverdiene.

**For $\lambda=3$:** Systemet er

$$-v_1+v_2=0,\qquad v_1-v_2=0.$$

Andre likning er den første ganget med $-1$. Vi har én fri variabel.
Velg $v_1=t$, så $v_2=t$, og løsningen er $t(1,1)^T$.
En basis for egenrommet er $\{(1,1)^T\}$; egenrommet har dimensjon én.

**For $\lambda=1$:** Begge rader gir $v_1+v_2=0$.
Med $v_1=t$ blir $v_2=-t$, så løsningen er $t(1,-1)^T$.
Også dette egenrommet har dimensjon én.

Velger du $t=2$, er $(2,2)^T$ en like god egenvektor for $3$ som $(1,1)^T$.
Velger du $t=1/\sqrt2$, får du en egenvektor med lengde én.
Normalisering velger en representant; den endrer ikke egenverdien.
Kontroller alltid svaret i den opprinnelige likningen $Av=\lambda v$.

På store matriser bruker vi numeriske algoritmer fremfor å utvide store
determinantpolynomer. Håndregningen her forklarer hva algoritmene leter etter.

</details>

<details class="reading-step">
<summary>Gå i dybden: egenretninger som ikke står vinkelrett</summary>

I eksemplene med $A$ og $B$ står de to egenretningene vinkelrett.
Skyldes det ulike egenverdier, eller en ekstra egenskap ved disse eksemplene?
Undersøk transformasjonen med standardmatrise
$C=\begin{bmatrix}2&1\\0&1\end{bmatrix}$.
Finn egenverdier og egenrom, kontroller med $Cv=\lambda v$, og beregn
indreproduktet mellom en egenvektor fra hvert egenrom.

**Slik kan du tenke.**

For $C=\begin{bmatrix}2&1\\0&1\end{bmatrix}$ er

$$\det(C-\lambda I)=(2-\lambda)(1-\lambda),$$

så egenverdiene er $2$ og $1$.

- For $2$ gir $(C-2I)v=0$ likningene $v_2=0$ og $-v_2=0$.
  $v_1$ er fri, så egenrommet er $\operatorname{span}\{(1,0)^T\}$.
- For $1$ gir $(C-I)v=0$ likningen $v_1+v_2=0$ og en nullrad.
  Egenrommet er $\operatorname{span}\{(1,-1)^T\}$.

Kontrollen er

$$C(1,0)^T=(2,0)^T=2(1,0)^T,\qquad
C(1,-1)^T=(1,-1)^T.$$

Indreproduktet mellom basisvektorene er $1\cdot1+0\cdot(-1)=1$, ikke null.
Ulike egenverdier gir altså ikke generelt ortogonale egenvektorer.

**For en reell symmetrisk matrise er egenvektorer til ulike egenverdier
ortogonale:** Hvis $A^T=A$, $Av=\lambda v$, $Aw=\mu w$ og
$\lambda\ne\mu$, så er $v^Tw=0$. Dette viktige resultatet begrunnes i 5.3.
Eksemplet med $C$ viser at **ulike egenverdier alene ikke garanterer
ortogonale egenvektorer**. Symmetri er en tilstrekkelig betingelse som gir
oss denne garantien. Eksemplet sier ikke at ortogonalitet er umulig uten
symmetri: også en ikke-symmetrisk matrise kan ha enkelte ortogonale
egenvektorer til ulike egenverdier.

</details>

<details class="reading-step">
<summary>Gå i dybden: når gir koordinatbyttet Bx = x, Bx = −x eller en ny linje?</summary>

**Kan samme transformasjon la én vektor være uendret, snu en annen og
sende en tredje til en annen linje?** Undersøk koordinatbyttet
$R(x_1,x_2)=(x_2,x_1)$, representert ved
$B=\begin{bmatrix}0&1\\1&0\end{bmatrix}$.
Målet er å skille mellom **positiv egenverdi, negativ egenverdi og en
startvektor som ikke er en egenvektor**.

Plottet sammenligner $R(x)=Bx$ med den kjente transformasjonen $T(x)=Ax$,
der $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$.
For hver startvektor: forutsi først hvor resultatet av koordinatbyttet ligger,
og bruk deretter figuren som kontroll.

1. Sett `start = [1., -1.]`. Er $Bx=x$, $Bx=-x$ eller ingen av delene?
   Ligger $Ax$ på samme linje som $Bx$, og peker de samme vei?
2. Sett `start = [1., 1.]`. Gjør koordinatbyttet nå det samme som i første tilfelle?
   Hvilket tall $\lambda$ oppfyller $Bx=\lambda x$?
3. Sett `start = [1., 0.]`. Finnes det noe tall $\lambda$ slik at
   $Bx=\lambda x$? Begrunn svaret med koordinatene, ikke bare med tegningen.

**Formuler konklusjonen:** Hva skiller det å snu orienteringen på samme
linje fra det å sende vektoren til en annen linje?
Plottet bruker ingen normalisering; både lengde og orientering er synlige.

```{pyodide-python}
#| label: week5-directions
# Vi sammenligner én transformasjon med startvektoren, uten normalisering.
# Endre bare startvektoren: blir resultatet på samme linje, og endres lengde eller fortegn?

A = np.array([[2., 1.], [1., 2.]])
B = np.array([[0., 1.], [1., 0.]])
start = np.array([1., -1.])  # Prøv også [1., 1.] og [1., 0.].
fig, axes = plt.subplots(1, 2, figsize=(7, 3))
for ax, M, name in zip(axes, [A, B], ["A", "B"]):
    for vector, color, label in [(start, "#a04a00", "Før"), (M @ start, "#1565c0", "Etter")]:
        ax.quiver(0, 0, *vector, angles="xy", scale_units="xy", scale=1,
                  color=color, alpha=.7, label=label)
    ax.set(xlim=(-3.5, 3.5), ylim=(-3.5, 3.5), title=name, xlabel="Første koordinat", ylabel="Andre koordinat")
    ax.set_aspect("equal")
    ax.grid()
    ax.legend()
plt.tight_layout()
plt.show()
```

</details>

## 5.3 Basis og gjentakelse

<div id="uke5-basis"></div>

**Matte 3A: hvorfor nærmer iterasjonsfølgene seg samme linje fra ulike startvektorer?**
I 5.1 valgte vi startvektoren $x_0=(1,0)^T$. Ved gjentatt anvendelse av
transformasjonen $T(x)=Ax$, med normalisering etter hvert steg, nærmet
vektorene $x_k$ seg linjen gjennom $(1,1)^T$.
I 5.2 fant vi de to egenretningene. Nå bruker vi dem til å dele startvektoren
i to bidrag og følge hvert bidrag når transformasjonen gjentas.

### Eksperiment 2 – hvilken del tar over?

For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ bruker vi
$v_1=(1,1)^T$ og $v_2=(1,-1)^T$. Startvektoren kan bygges slik:

$$x_0=\begin{bmatrix}1\\0\end{bmatrix}
={\color{#1565c0}\underbrace{\tfrac12\begin{bmatrix}1\\1\end{bmatrix}}_{c_1v_1}}
+{\color{#a04a00}\underbrace{\tfrac12\begin{bmatrix}1\\-1\end{bmatrix}}_{c_2v_2}}.$$

Etter $k$ anvendelser av transformasjonen, før normalisering, er bidragene

$${\color{#1565c0}b_1(k)=c_1\,3^k v_1},\qquad
{\color{#a04a00}b_2(k)=c_2\,1^k v_2},\qquad
A^kx_0=b_1(k)+b_2(k).$$

Ved hvert steg tredobles lengden til $b_1(k)$, mens $b_2(k)$ beholder lengden.
**Hvordan endres bidragenes relative størrelse under gjentatt transformasjon?**

Kurvene viser hver sin andel av summen av bidragenes lengder:

$${\color{#1565c0}a_1(k)=
\frac{\lVert b_1(k)\rVert_2}{\lVert b_1(k)\rVert_2+\lVert b_2(k)\rVert_2}},
\qquad
{\color{#a04a00}a_2(k)=
\frac{\lVert b_2(k)\rVert_2}{\lVert b_1(k)\rVert_2+\lVert b_2(k)\rVert_2}}.$$

Nevneren er summen av **bidragenes lengder**, ikke lengden av summen
$b_1(k)+b_2(k)$. For $c_1=c_2=1/2$ er $a_1(0)=a_2(0)=1/2$.
For alle $k$ er $a_1(k)+a_2(k)=1$. Vannrett akse viser $k$;
blå kurve viser $a_1(k)$ og oransje viser $a_2(k)$.

1. Kjør med `c1 = c2 = 0.5`. Blir det oransje bidraget kortere,
   eller blir det bare mindre sammenlignet med det blå?
2. Sett deretter `c1 = 0.0` og behold `c2 = 0.5`.
   Nå er koeffisienten til $v_1$ i startvektoren null. Kan $b_1(k)$ bli ulik null under iterasjonen?

```{pyodide-python}
#| label: week5-contributions
# Følg bidragene langs to egenvektorer hver for seg.
# Endre c1 og c2, og forutsi kurvene før du kjører.
# En mindre ANDEL betyr ikke nødvendigvis at bidragets lengde avtar.

c1, c2 = 0.5, 0.5
steps = np.arange(7)
if c1 == 0 and c2 == 0:
    raise ValueError('Velg minst ett bidrag ulik null')
# v1 og v2 har samme lengde sqrt(2); den forkortes bort i andelene.
# Absoluttverdien brukes fordi vi sammenligner lengder, ikke fortegn.
first = abs(c1) * 3.**steps
second = abs(c2) * 1.**steps
plt.figure()
plt.plot(steps, first/(first+second), "o-", color="#1565c0", label="λ₁ = 3: andel langs (1, 1)")
plt.plot(steps, second/(first+second), "o-", color="#a04a00", label="λ₂ = 1: andel langs (1, −1)")
plt.xlabel("Antall multiplikasjoner")
plt.ylabel("Andel av de to bidragenes lengder")
plt.legend()
plt.show()
```

En del kan bestå i absolutte tall og likevel miste betydning for retningen.
Hvis koeffisienten langs egenvektoren med størst egenverdi i absoluttverdi
er null i startvektoren, forblir dette bidraget null under iterasjonen i eksakt regning. **Diskuter:** Hvordan avhenger iterasjonsfølgen av transformasjonen og startvektoren?

### Skriv observasjonen som algebra

Linearitet betyr at transformasjonen virker på hvert bidrag for seg:
$A(c_1v_1+c_2v_2)=c_1Av_1+c_2Av_2$. De to egenverdiene
brukes én gang for hvert steg; vi lar potensene stå synlige:

$$\begin{aligned}
Ax_0&=\tfrac12{\color{#1565c0}3}\,v_1+\tfrac12{\color{#a04a00}1}\,v_2=(2,1)^T,\\
A^2x_0&=\tfrac12{\color{#1565c0}3^2}\,v_1+\tfrac12{\color{#a04a00}1^2}\,v_2=(5,4)^T,\\
A^3x_0&=\tfrac12{\color{#1565c0}3^3}\,v_1+\tfrac12{\color{#a04a00}1^3}\,v_2=(14,13)^T.
\end{aligned}$$

Dette forklarer kurvene: den oransje lengden er konstant, mens den blå
vokser. At en andel nærmer seg null, betyr altså ikke at selve bidraget blir null.

### Fra dette eksemplet til teorien

En **basis** lar oss skrive enhver vektor entydig som en sum av bidrag
langs basisvektorene. Hvis egenvektorene $v_1,\ldots,v_n$ er en basis,
og $c_i$ er startvektorens koeffisient i retning $v_i$, får vi

$$x_0=\sum_{i=1}^n c_iv_i,
\qquad A^kx_0=\sum_{i=1}^n c_i\lambda_i^kv_i.$$

Matrisen kalles da **diagonaliserbar**. Egenverdien $\lambda_1$ er
**dominant** når $|\lambda_1|>|\lambda_i|$ for alle $i>1$.
Hvis $c_1\ne0$, vokser dens bidrag relativt til de andre. Forholdet
$|\lambda_2/\lambda_1|$, med egenverdiene sortert etter absoluttverdi,
forklarer farten etter mange steg: nær én betyr langsom utskilling.

<details class="reading-step">
<summary>Gå i dybden: hvorfor kan vi behandle bidragene hver for seg?</summary>

**Følg to bidrag for hånd.**

Bruk $A$ fra 5.1. Start med

$$x_0=\begin{bmatrix}1\\0\end{bmatrix}
=\tfrac12\begin{bmatrix}1\\1\end{bmatrix}
+\tfrac12\begin{bmatrix}1\\-1\end{bmatrix}.$$

**Før du leser videre:** Bruk resultatene $Av_1=3v_1$ og $Av_2=v_2$ fra
5.2, med $v_1=(1,1)^T$ og $v_2=(1,-1)^T$.
Skriv $Ax_0$, $A^2x_0$ og $A^3x_0$ som summer av disse to vektorene.
Noter forholdet mellom den andre og den første koeffisienten.

**Slik kan du tenke:** Bruk $Av_1=3v_1$ og $Av_2=1v_2$ på hvert ledd.
Fargene er de samme som i plottet:

$$\begin{aligned}
Ax_0&=\tfrac12Av_1+\tfrac12Av_2
=\tfrac12{\color{#1565c0}3}\,v_1+\tfrac12{\color{#a04a00}1}\,v_2,\\
A^2x_0&=\tfrac12{\color{#1565c0}3^2}\,v_1+\tfrac12{\color{#a04a00}1^2}\,v_2,\\
A^3x_0&=\tfrac12{\color{#1565c0}3^3}\,v_1+\tfrac12{\color{#a04a00}1^3}\,v_2.
\end{aligned}$$

Etter $k$ steg er

$$A^kx_0=\tfrac12{\color{#1565c0}3^k}\begin{bmatrix}1\\1\end{bmatrix}
+\tfrac12{\color{#a04a00}1^k}\begin{bmatrix}1\\-1\end{bmatrix}.$$

Det andre bidraget forsvinner ikke. Men forholdet mellom bidragene er
$3^{-k}$, og derfor nærmer den normaliserte vektoren seg den første linjen.
Vi kan se dette direkte ved å dele ut den dominerende skaleringen:

$$A^kx_0=\tfrac12 3^k\bigl(v_1+3^{-k}v_2\bigr),\qquad
x_k=\frac{v_1+3^{-k}v_2}{\lVert v_1+3^{-k}v_2\rVert_2}
\longrightarrow\frac{v_1}{\sqrt2}.$$

**Prøv en annen startvektor:** Hva endres i iterasjonsfølgen hvis startvektoren er $x_0=v_2/\sqrt2$?
Da mangler bidraget langs $v_1$ helt, slik du så med startvalget $(1,-1)$ i figuren.

Linearitet gir $A(c_1v_1+c_2v_2)=c_1Av_1+c_2Av_2$.
Sett inn $Av_i=\lambda_iv_i$. Ved neste multiplikasjon får hvert bidrag
enda en faktor $\lambda_i$. Gjenta $k$ ganger.

Samle basisvektorene i $V=[v_1\ \cdots\ v_n]$ og egenverdiene i
$\Lambda=\operatorname{diag}(\lambda_1,\ldots,\lambda_n)$.
Da betyr $AV=V\Lambda$ at hver kolonne oppfyller egenvektorlikningen.
Siden kolonnene er en basis, er $V$ invertibel:

$$A=V\Lambda V^{-1},\qquad A^k=V\Lambda^kV^{-1}.$$

Les fra høyre: finn bidragene, skaler dem, og bygg vektoren igjen.
Ikke alle matriser har en egenvektorbasis. Vi bruker en slik basis som
forutsetning i denne forklaringen av potensmetoden.

**Hvordan finner vi koeffisientene?** For en vilkårlig startvektor $(a,b)^T$ løser vi

$$c_1(1,1)^T+c_2(1,-1)^T=(a,b)^T.$$

Koordinatene gir $c_1+c_2=a$ og $c_1-c_2=b$. Legg sammen og trekk fra:

$$c_1=\frac{a+b}{2},\qquad c_2=\frac{a-b}{2}.$$

For $(1,0)^T$ er begge $1/2$. For $(1,-1)^T$ er $c_1=0$.
I matrisenotasjon er dette $c=V^{-1}x_0$, hvor

$$V=\begin{bmatrix}1&1\\1&-1\end{bmatrix},\qquad
V^{-1}=\frac12\begin{bmatrix}1&1\\1&-1\end{bmatrix}.$$

Videre er $A^2=(V\Lambda V^{-1})(V\Lambda V^{-1})=V\Lambda^2V^{-1}$,
fordi de to midterste faktorene gir $V^{-1}V=I$. Slik får vi formelen for $A^k$.

For to generelle egenverdier er forholdet mellom koeffisientenes absoluttverdier

$$\frac{|c_2\lambda_2^k|}{|c_1\lambda_1^k|}
=\left|\frac{c_2}{c_1}\right|\left|\frac{\lambda_2}{\lambda_1}\right|^k.$$

Dette krever $c_1\ne0$. Hvis $\lambda_1<0$, skifter den dominerende
koeffisienten fortegn; da konvergerer linjen, mens de normaliserte vektorene
kan veksle mellom motsatte orienteringer.

</details>

### Fra projeksjon i uke 4 til egenvektorbidrag

I [uke 4.2](uke4.qmd) fant vi den ortogonale projeksjonen av en vektor $x$
på en linje med enhetsvektor $q$. Vi skilte mellom **ett tall** og **en vektor**:

$$\underbrace{c=q^Tx}_{\text{koordinaten langs }q},\qquad
\underbrace{p=(q^Tx)q=cq}_{\text{projeksjonen på linjen gjennom }q}.$$

Koordinaten $c$ kan være negativ; fortegnet angir orientering langs $q$.
Projeksjonsvektoren $p$ er bidraget til $x$ langs denne linjen.

Her bruker vi de samme projeksjonene på de to egenretningene. Vi normaliserer
egenvektorene fra eksperimentet:

$${\color{#1565c0}q_1=\frac1{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}},
\qquad
{\color{#a04a00}q_2=\frac1{\sqrt2}\begin{bmatrix}1\\-1\end{bmatrix}}.$$

De har lengde én og står vinkelrett, så de danner en **ortonormal basis**
for $\mathbb R^2$. Dermed er enhver vektor summen av de to projeksjonene:

$$x={\color{#1565c0}(q_1^Tx)q_1}
  +{\color{#a04a00}(q_2^Tx)q_2}.$$

**Hva er nytt i uke 5?** Basisvektorene er også egenvektorer:
$Aq_1=3q_1$ og $Aq_2=1q_2$. Under transformasjonen $T(x)=Ax$
skaleres derfor hvert projeksjonsbidrag med sin egenverdi:

$$Ax={\color{#1565c0}3(q_1^Tx)q_1}
   +{\color{#a04a00}1(q_2^Tx)q_2}.$$

**Diskuter:** Hvis projeksjonen av startvektoren på linjen gjennom $q_1$
er null, kan gjentatt anvendelse av $T$ gi et bidrag langs denne linjen?

### Spektralteoremet: en ortonormal basis av egenvektorer

Dette er mulig for alle reelle symmetriske matriser, ikke bare for eksemplet
vårt. **Spektralteoremet:** En reell symmetrisk matrise $A$ ($A^T=A$) har
reelle egenverdier og en ortonormal basis av egenvektorer
$q_1,\ldots,q_n$ for hele $\mathbb R^n$.

Sett egenvektorene som kolonner i $Q=[q_1\ \cdots\ q_n]$ og de tilhørende
egenverdiene på diagonalen i $\Lambda$. Da er

$$A=Q\Lambda Q^T,\qquad
Ax=\sum_{i=1}^n\lambda_i(q_i^Tx)q_i.$$

Faktoriseringen uttrykker akkurat oppdelingen vi nettopp brukte:
$Q^Tx$ gir koordinatene, $\Lambda(Q^Tx)$ gir de skalerte koordinatene,
og multiplikasjon med $Q$ gir summen av de skalerte egenvektorbidragene.
Navnet **spektral** viser til spekteret, samlingen av egenverdier.

I uke 4 kunne $Q$ inneholde en basis for bare et underrom; da var $QQ^Tx$
projeksjonen på dette underrommet. **Her er basisen fullstendig**, så
$QQ^Tx=x$ for alle $x$ og $QQ^T=I$.

<details class="reading-step">
<summary>Gå i dybden: fra projeksjonskoordinater til spektralteoremet</summary>

Vi følger ett eksempel hele veien: $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ og
$x=(1,0)^T$. Deretter undersøker vi hva symmetrien garanterer generelt.

**1. Finn koordinatene med projeksjon fra uke 4**

Normaliser egenvektorene $v_1=(1,1)^T$ og $v_2=(1,-1)^T$. Sett dem
som kolonner i $Q$, og beregn selv $Q^TQ$ og $c=Q^Tx$.

$$Q=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix},
\qquad Q^TQ=I,\qquad
c=Q^Tx=\frac1{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}.$$

Hver koordinat $c_i=q_i^Tx$ er et tall. Projeksjonsvektoren er $c_iq_i$.
For denne $x$ får vi

$$x={\color{#1565c0}\frac1{\sqrt2}q_1}
+{\color{#a04a00}\frac1{\sqrt2}q_2}
={\color{#1565c0}\frac12v_1}+{\color{#a04a00}\frac12v_2}.$$

Koordinatene endres når basisvektorene normaliseres, men de to
projeksjonsvektorene er uendret.

**2. Skaler projeksjonsbidragene med egenverdiene**

Siden $Aq_1=3q_1$ og $Aq_2=q_2$, blir

$$Ax={\color{#1565c0}\frac3{\sqrt2}q_1}
+{\color{#a04a00}\frac1{\sqrt2}q_2}
=\begin{bmatrix}2\\1\end{bmatrix}.$$

Dette er beregningen $Ax=Q\Lambda(Q^Tx)$: finn koordinatene, skaler dem
med egenverdiene, og summer de nye basisbidragene. Kontroller med direkte
multiplikasjon at resultatet er det samme.

**3. Hvorfor står egenretningene vinkelrett?**

La nå $A$ være en vilkårlig reell symmetrisk matrise, med
$Av=\lambda v$ og $Aw=\mu w$. Da er

$$\begin{aligned}
\lambda v^Tw&=(Av)^Tw &&\text{fordi }Av=\lambda v,\\
&=v^TA^Tw &&\text{ved transponering},\\
&=v^TAw &&\text{fordi }A^T=A,\\
&=\mu v^Tw &&\text{fordi }Aw=\mu w.
\end{aligned}$$

Dermed er $(\lambda-\mu)v^Tw=0$. **Ulike egenverdier gir derfor
ortogonale egenvektorer når $A$ er reell og symmetrisk.**

Innenfor samme egenrom kan vi bruke Gram–Schmidt fra uke 4; alle
lineærkombinasjonene forblir i egenrommet. Spektralteoremet sier i tillegg
at det finnes nok egenvektorer til en basis for hele rommet.
Dette siste utsagnet er ikke bevist av regningen ovenfor.

**4. En følge vi bruker i uke 6**

For en reell symmetrisk matrise skriver vi $x=Qc$, der $c=Q^Tx$. Da gir
$Q^TQ=I$ og $A=Q\Lambda Q^T$ at

$$x^TAx=c^T\Lambda c=\sum_i\lambda_i c_i^2.$$

Er alle egenverdiene positive, er summen positiv for enhver $x\ne0$,
fordi minst én koordinat $c_i$ da er ulik null. Dette kalles
**positiv definitet**. I uke 6 bruker vi egenskapen til å knytte
løsningen av et lineært system til et entydig minimum.

</details>

## 5.4 Potensmetoden

<div id="uke5-potens"></div>

### Eksperiment 3 – hva bestemmer farten?

**Hvor raskt øker andelen langs egenvektoren med størst egenverdi?**
Vi beholder egenvektorene fra eksperiment 2 og sammenligner
$A_\mu=Q\operatorname{diag}(3,\mu)Q^T$ for $\mu=1$ og $\mu=2.9$.
Kolonnene i $Q$ er de ortonormale egenvektorene fra 5.3.
Startvektoren er $x_0=(1,0)^T$ i begge iterasjonsfølgene.

Vi bruker **de samme andelene som i eksperiment 2**:

$$a_i(k)=\frac{\lVert b_i(k)\rVert_2}
{\lVert b_1(k)\rVert_2+\lVert b_2(k)\rVert_2},\qquad i=1,2.$$

Her er $b_1(k)$ bidraget langs $q_1$ med egenverdi 3, og $b_2(k)$
bidraget langs $q_2$ med egenverdi $\mu$. Figuren har fire kurver:

- **Blå:** $a_1(k)$. **Oransje:** $a_2(k)$.
- **Heltrukket:** $\mu=1$. **Stiplet:** $\mu=2.9$.

1. Forutsi hvilket kurvepar som raskest nærmer seg andelene 1 og 0.
2. Kjør cellen. Sammenlign de to oransje kurvene etter 10 steg.
3. Omtrent hvor mange steg kreves før hver oransje kurve kommer under 0.1?
   Hva sier forskjellen om effekten av nesten like egenverdier?

```{pyodide-python}
#| label: week5-speed
# Samme andelsmål og farger som i eksperiment 2.
# Linjestilen skiller transformasjonene; fargen skiller egenvektorbidragene.
# Begge iterasjonsfølgene bruker samme startvektor og 80 multiplikasjoner.

Q = np.array([[1., 1.], [1., -1.]]) / np.sqrt(2)
steps = np.arange(81)
fig, ax = plt.subplots()
for mu, style in [(1., '-'), (2.9, '--')]:
    A = Q @ np.diag([3., mu]) @ Q.T
    x = np.array([1., 0.])
    shares = []
    for k in steps:
        # Indreproduktene gir koordinatene i den ortonormale egenvektorbasisen.
        c = Q.T @ x
        # q1 og q2 har lengde 1, så |c_i| er lengden av bidraget c_i*q_i.
        lengths = np.abs(c)
        shares.append(lengths / lengths.sum())
        if k < steps[-1]:
            x = A @ x
            # Felles normalisering endrer ikke andelene av bidragenes lengder.
            x = x / np.linalg.norm(x)
    shares = np.array(shares)
    ax.plot(steps, shares[:, 0], color='#1565c0', linestyle=style,
            marker='o', markevery=5, markersize=3, label=f'a₁: λ₁ = 3, μ = {mu}')
    ax.plot(steps, shares[:, 1], color='#a04a00', linestyle=style,
            marker='o', markevery=5, markersize=3, label=f'a₂: λ₂ = μ = {mu}')
ax.set(xlabel='Antall multiplikasjoner', ylabel='Andel av de to bidragenes lengder',
       ylim=(-0.03, 1.03), title='Samme startvektor, ulik avstand mellom egenverdiene')
ax.legend()
plt.show()
```

For $\mu=1$ øker den blå andelen raskt mot 1. For $\mu=2.9$ endres
andelene langsommere: begge bidragene vokser nesten like mye ved hvert steg.
Det er **forholdet mellom egenverdiene**, $\mu/3$, som bestemmer farten.

<details class="reading-step">
<summary>Gå i dybden: knytt andelskurvene til egenverdiene</summary>

Startvektoren har like store koordinater langs $q_1$ og $q_2$.
Etter $k$ multiplikasjoner er forholdet mellom bidragenes lengder derfor

$$r_k=\frac{\lVert b_2(k)\rVert_2}{\lVert b_1(k)\rVert_2}
=\left(\frac{|\mu|}{3}\right)^k.$$

Forholdet $r_k$ og andelen $a_2(k)$ er ulike størrelser. Del teller og
nevner i andelsformelen på $\lVert b_1(k)\rVert_2$:

$${\color{#1565c0}a_1(k)=\frac{1}{1+r_k}},\qquad
{\color{#a04a00}a_2(k)=\frac{r_k}{1+r_k}}.$$

Ved $k=0$ er begge andelene $1/2$. Etter 10 steg er den oransje andelen
omtrent $0.0000169$ for $\mu=1$, men $0.416$ for $\mu=2.9$.

For å få $a_2(k)<0.1$ må

$$\frac{r_k}{1+r_k}<0.1\quad\Longleftrightarrow\quad r_k<\frac19.$$

Dette gir 3 steg for $\mu=1$ og 65 steg for $\mu=2.9$.
Kontroller med potensuttrykket for $r_k$.

I koden beregner vi koordinatene fra de itererte vektorene, ikke direkte
fra potensformelen. Avrunding kan derfor påvirke svært små bidrag.
Den lineære andelsaksen gjør sammenligningen med eksperiment 2 direkte,
men viser ikke slike små avvik tydelig.

</details>

### Skriv opp det vi nettopp gjorde

Dette er **potensmetoden**:

```text
Velg x ≠ 0 og del x på lengden sin.
Gjenta, med en øvre grense for antall steg:
    y = A x
    Hvis y = 0: stopp; normalisering er ikke mulig.
    x = y / ‖y‖₂
    Finn et tall ρ som beskriver skaleringen langs x.
    Kontroller hvor godt A x ≈ ρ x.
```

Ett steg og de to kontrollstørrelsene er

$$y_k=Ax_k,\qquad x_{k+1}=\frac{y_k}{\lVert y_k\rVert_2}.$$

### Fra projeksjon til et anslag for egenverdien

Potensmetoden finner først en mulig egenvektorretning $x$. Vi trenger
også en skalering: **hvilket tall $t$ gjør $tx$ til den beste tilnærmingen
til $Ax$?** Vi søker altså den ortogonale projeksjonen av $Ax$ på linjen
$\operatorname{span}\{x\}$, ikke på en av koordinataksene.

Fra uke 4: For $x\ne0$ er projeksjonen av en vektor $b$ på denne linjen
$\frac{x^Tb}{x^Tx}x$. **Indreproduktet** $x^Tb=\sum_i x_i b_i$ gir telleren;
nevneren $x^Tx=\|x\|_2^2$ korrigerer for lengden til $x$.
Med $b=Ax$ blir projeksjonen $\rho(x)x$, der

$$\rho(x)=\frac{x^TAx}{x^Tx},\qquad r=Ax-\rho(x)x,\qquad x^Tr=0.$$

$\rho$ kalles **Rayleigh-kvotienten** og er koeffisienten som minimerer
$\|Ax-tx\|_2$ over alle tall $t$. **Egenresidualen** $r$ er den delen av
$Ax$ som står vinkelrett på $x$ og derfor ikke kan beskrives som en skalering
av $x$. Geometrien gir projeksjonen; algebraen gir en formel vi kan beregne.

For $x=(1,0)^T$ og matrisen fra 5.1 er $Ax=(2,1)^T$.
Projeksjonen på førsteaksen er $(2,0)^T=2x$, så $\rho=2$ og $r=(0,1)^T$.
Det gjenstår et bidrag på tvers: $x$ er ikke en egenvektor.
For $x=(1,1)^T/\sqrt2$ ligger hele $Ax$ på samme linje: $\rho=3$ og $r=0$.

**Hva forteller kontrollen?** Liten $\|r\|_2$ betyr at egenvektorlikningen
nesten er oppfylt. Det sier ikke at vi har funnet den dominante egenverdien:
retningen med egenverdi 1 gir også null residual. Derfor ser vi både på
startvektoren, utviklingen i forsøket og residualen når vi vurderer resultatet.

<details class="reading-step">
<summary>Gå i dybden: hvorfor akkurat denne kvotienten?</summary>

Vi prøver å beskrive $Ax$ ved én vektor $\rho x$ på linjen gjennom $x$.
Projeksjonsregelen fra uke 4 gir koeffisienten
$\rho=x^T(Ax)/(x^Tx)$. Resten er ortogonal på $x$.
For en enhetsvektor blir dette $\rho=x^TAx$.

En liten residual viser at likningen nesten er oppfylt. Den beviser ikke
at vi har funnet den dominante egenverdien. For en generell matrise gir den
heller ikke alene en garanti for at vektoren ligger nær en bestemt eksakt
egenvektor. Derfor undersøker vi også startvektor og forventet spekter.

Projeksjonskoeffisienten minimerer $\lVert Ax-tx\rVert_2$ over tall $t$.
Vi kan også finne den ved ortogonalitetskravet fra uke 4:

$$x^T(Ax-\rho x)=0
\quad\Longrightarrow\quad
x^TAx-\rho x^Tx=0
\quad\Longrightarrow\quad
\rho=\frac{x^TAx}{x^Tx}.$$

For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ og $x=(1,0)^T$ er
$Ax=(2,1)^T$, $\rho=2$ og $r=(0,1)^T$. Transformasjonen gir altså også et
bidrag på tvers av den valgte retningen; den er ennå ingen egenretning.
For $x=(1,1)^T/\sqrt2$ blir derimot $\rho=3$ og $r=0$.

En residual er en vektor; residualnormen er ett tall. I koden lagrer vi
både $\rho$ og residualnormen, ikke hele residualvektoren.

</details>

<details class="reading-step">
<summary>Gå i dybden: beregn skaleringen og det som blir igjen</summary>

**Gjenta for hånd:** Bruk første normaliserte steg $x=(2,1)^T/\sqrt5$ fra 5.1.
Beregn først $Ax$, deretter $\rho$ og $r$. Sammenlign med

$$Ax=\frac1{\sqrt5}\begin{bmatrix}5\\4\end{bmatrix},\qquad
\rho=\frac{2\cdot5+1\cdot4}{5}=\frac{14}{5},$$

$$r=\frac1{5\sqrt5}\begin{bmatrix}-3\\6\end{bmatrix},\qquad
\lVert r\rVert_2=\frac35.$$

Retningen er ennå ikke en egenretning, men residualnormen har falt fra $1$ ved
$k=0$ til $3/5$ etter ett steg.

</details>

<details class="reading-step">
<summary>Gå i dybden: implementasjonen av potensmetoden</summary>

Definisjonen kjøres automatisk. Les koden etter pseudokoden: normalisering,
Rayleigh-kvotient, residual og en øvre grense for antall steg.

```{pyodide-python}
#| label: week5-power
#| autorun: true
# Potensmetoden følger en retning; normalisering hindrer at lengden vokser ukontrollert.
# Rayleigh-kvotienten anslår egenverdien, mens egenresidualen kontrollerer Av ≈ rho*v.
# En liten egenresidual sier ikke at vi har funnet den største egenverdien.

# Definer funksjonen som brukes i de korte forsøkene nedenfor.
def power_iteration(A, x0, tol=1e-10, max_steps=500):
    A = np.asarray(A, dtype=float)
    x = np.array(x0, dtype=float, copy=True)
    if A.ndim != 2 or A.shape[0] != A.shape[1] or x.shape != (A.shape[0],):
        raise ValueError("A må være kvadratisk og x0 ha riktig lengde")
    if not np.all(np.isfinite(A)) or not np.all(np.isfinite(x)):
        raise ValueError("Bruk endelige tall")
    if np.linalg.norm(x) == 0 or tol <= 0 or max_steps < 1:
        raise ValueError("Bruk x0 ≠ 0, positiv toleranse og minst ett steg")
    x /= np.linalg.norm(x)
    # Skaler stoppkravet med matrisens størrelse; tol er ikke en absolutt feilgrense for rho.
    scale = np.linalg.norm(A, 'fro')
    history = []
    for k in range(max_steps + 1):
        y = A @ x
        # x er normert, så Rayleigh-kvotientens nevner x.T @ x er 1.
        rho = x @ y
        # Mål delen av Ax som ikke forklares av skaleringen rho*x.
        residual = np.linalg.norm(y - rho * x)
        history.append((rho, residual))
        if np.linalg.norm(y) == 0:
            return x, rho, np.array(history), "Ax = 0; kan ikke normalisere"
        if residual <= tol * scale:
            return x, rho, np.array(history), "liten egenresidual"
        if k < max_steps:
            # Behold retningen, men sett lengden tilbake til 1 før neste multiplikasjon.
            x = y / np.linalg.norm(y)
    return x, rho, np.array(history), "maksimalt antall steg"
```

**Følg én løkkeomgang:** `y` er $Ax$, `rho` er $x^TAx$ siden $\lVert x\rVert_2=1$,
og `residual` er $\lVert Ax-\rho x\rVert_2$.
Vi lagrer kontrollene **før** neste oppdatering. Derfor gjelder siste rad i
`history` akkurat den vektoren funksjonen returnerer.

`scale` er $\lVert A\rVert_F$, **Frobeniusnormen**: kvadratroten av summen av
alle kvadrerte matriseelementer. Stoppkravet er
$\lVert r\rVert_2/\lVert A\rVert_F\le\text{tol}$ for $A\ne0$.
En felles skalering av $A$ skalerer både teller og nevner like mye.
`max_steps` hindrer at et ikke-konvergerende forsøk fortsetter uten grense.

Hvis $Ax=0$, er $x$ allerede en egenvektor for null, men vi kan ikke utføre
neste normalisering. Meldingen forklarer dette særtilfellet.
«Liten egenresidual» betyr at likningen er godt oppfylt; funksjonen lover
ikke at det er den dominante egenverdien som er funnet.

</details>

```{pyodide-python}
#| label: week5-power-demo
# Funksjonen fra forrige celle returnerer både et forslag og en kontroll.
# Les status sammen med rho og siste residual; ikke vurder bare vektoren x.

A = np.array([[2., 1.], [1., 2.]])
x, rho, history, status = power_iteration(A, [1., 0.])
print(status, "ρ =", rho, "x =", x)
print("egenresidual:", history[-1, 1])
```

Den valgte **toleransen** $\text{tol}$ angir hvor liten relativ residual vi
krever før vi stopper. Vi sammenligner residualnormen med
$\text{tol}\,\lVert A\rVert_F$ fordi $x$ har
lengde én. Frobeniusnormen er kvadratroten av summen av de kvadrerte
matriseelementene. Dette gjør testen uavhengig av en felles skalering av $A$.

### Eksperiment 4 – når stabiliseres ikke retningen?

I eksperiment 3 var én egenverdi størst i absoluttverdi, og startvektoren
hadde et bidrag langs den tilhørende egenvektoren. Nå undersøker vi hva
som skjer når et slikt bidrag mangler, når fortegnet skifter, eller når
ingen egenretning får større relativ vekt.

I alle fire tilfellene bruker vi samme oppdatering:

$$x_{k+1}=\frac{Ax_k}{\lVert Ax_k\rVert_2}.$$

| Tilfelle | Matrise for transformasjonen | Startvektor før normalisering | Spørsmål før kjøring |
|---|---|---|---|
| Manglende dominant bidrag | $\operatorname{diag}(3,1)$ | $(0,1)^T$ | Kan første koordinat bli ulik null? |
| Negativ dominant egenverdi | $\operatorname{diag}(-3,1)$ | $(1,1)^T$ | Hva skjer med fortegnet til første koordinat ved hvert steg? |
| Like store absoluttverdier | $\operatorname{diag}(1,-1)$ | $(1,1)^T$ | Kan ett av de to bidragene dominere det andre? |
| Rotasjon | $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$ | $(1,0)^T$ | Hva skjer når en kvart omdreining gjentas? |

**Slik leser du figurene:** Hvert punkt er endepunktet til en normalisert
vektor $x_k$. Aksene viser koordinatene, ikke antall steg.
Strekene forbinder påfølgende punkter; de viser ikke en kontinuerlig bevegelse.
Figuren viser $x_0,\ldots,x_6$. Punkter som er like, ligger oppå hverandre.

**Forutsi, og kjør:** Hvilket tilfelle gir samme vektor ved hvert steg?
Hvilket nærmer seg én linje uten å nærme seg én bestemt enhetsvektor?
Hvilke gir en gjentakende syklus?

Utskriften kommer fra en **egen kjøring av potensmetoden** med inntil 100 steg.
Den stopper når egenresidualen er liten nok, eller når steggrensen nås.
Derfor kan den rapportere et annet antall steg enn de seks som tegnes.

```{pyodide-python}
#| label: week5-failures
# De fire tilfellene utfordrer forskjellige forutsetninger for potensmetoden.
# Forutsi først om retningen stabiliseres, skifter fortegn eller roterer.
# Sammenhold banen med status og egenresidual: de svarer på ulike spørsmål.

cases = [
    ("Manglende dominant bidrag", np.diag([3., 1.]), [0., 1.]),
    ("Negativ dominant", np.diag([-3., 1.]), [1., 1.]),
    ("Lik absoluttverdi", np.diag([1., -1.]), [1., 1.]),
    ("Rotasjon", np.array([[0., -1.], [1., 0.]]), [1., 0.]),
]
fig, axes = plt.subplots(2, 2, figsize=(8, 6))
for ax, (name, A, start) in zip(axes.flat, cases):
    x = np.array(start) / np.linalg.norm(start)
    points = [x.copy()]
    for k in range(6):
        x = A @ x
        x /= np.linalg.norm(x)
        points.append(x.copy())
    points = np.array(points)
    ax.plot(points[:, 0], points[:, 1], 'o-')
    ax.set(title=name, xlabel="x₁", ylabel="x₂", xlim=(-1.2, 1.2), ylim=(-1.2, 1.2))
    ax.set_aspect('equal')
    _, rho, h, status = power_iteration(A, start, max_steps=100)
    print(name, ":", status, "; steg =", len(h)-1, "; ρ =", rho, "; residual =", h[-1, 1])
fig.tight_layout()
plt.show()
```

**1. Manglende dominant bidrag: riktig egenvektor, men feil egenverdi for målet vårt**

Fra $x_0=(0,1)^T$ er $Ax_0=x_0$. Første koordinat forblir null, så
iterasjonen kan ikke utvikle et bidrag langs egenvektoren til egenverdi 3.
Den returnerer egenverdi 1 med residual null. Kontrollen bekrefter et
egenpar, men bekrefter ikke at egenverdien er størst i absoluttverdi.

**2. Negativ dominant egenverdi: linjen stabiliseres, orienteringen veksler**

Før normalisering er $A^k(1,1)^T=((-3)^k,1)^T$.
Første koordinat dominerer i absoluttverdi og skifter fortegn.
De normaliserte vektorene nærmer seg derfor vekselvis $(1,0)^T$ og $(-1,0)^T$.
Begge ligger på samme egenlinje. Rayleigh-kvotienten nærmer seg $-3$,
og egenresidualen nærmer seg null selv om vektorene ikke konvergerer mot ett punkt.

**3. Like store absoluttverdier: ingen av bidragene blir dominerende**

Her veksler de normaliserte vektorene mellom
$(1,1)^T/\sqrt2$ og $(1,-1)^T/\sqrt2$.
Bidragene beholder samme lengde; bare fortegnet til det andre endres.
Dette er to forskjellige linjer, ikke motsatt orientering på én linje.
Rayleigh-kvotienten er 0 og egenresidualens norm er 1.

**4. Rotasjon: ingen reell egenlinje å nærme seg**

Transformasjonen roterer vektoren $90^\circ$ mot klokken ved hvert steg.
Iterasjonen besøker fire punkter før den gjentas.
For enhver reell enhetsvektor står $Ax$ vinkelrett på $x$, så
$\rho=x^TAx=0$ og $\lVert Ax-\rho x\rVert_2=1$.
Ingen reell ikke-null vektor oppfyller $Ax=\lambda x$.

**Diskuter:** Hvorfor er det tre forskjellige spørsmål om vektorene
konvergerer, om linjen de spenner ut stabiliseres, og om vi har funnet
egenverdien med størst absoluttverdi? Bruk tilfelle 1 og 2 som eksempler.

<details class="reading-step">
<summary>Gå i dybden: beregn forløpene og skill mellom vektor og linje</summary>

**Beregn to steg i hvert tilfelle.** Normaliser startvektoren først.
Beregn deretter Rayleigh-kvotienten $\rho_k=x_k^TAx_k$ og
egenresidualen $r_k=Ax_k-\rho_kx_k$. Sammenhold med observasjonene ovenfor.

For de tre diagonalmatrisene kan vi først regne uten normalisering:

$$\begin{aligned}
\operatorname{diag}(3,1)^k(0,1)^T&=(0,1)^T,\\
\operatorname{diag}(-3,1)^k(1,1)^T&=((-3)^k,1)^T,\\
\operatorname{diag}(1,-1)^k(1,1)^T&=(1,(-1)^k)^T.
\end{aligned}$$

I andre tilfelle deler vi på $\sqrt{3^{2k}+1}$.
Andre koordinat går da mot null, mens første går mot 1 langs partallsstegene
og mot $-1$ langs oddetallsstegene. I tredje tilfelle deler vi alltid på
$\sqrt2$, så begge bidragene består.

**Hvordan måle endring av linje?** Enhetsvektorene $x$ og $-x$ spenner ut
samme linje. Derfor kan vi sammenligne begge orienteringene:

$$d_k=\min\bigl(\lVert x_{k+1}-x_k\rVert_2,
\lVert x_{k+1}+x_k\rVert_2\bigr).$$

Første norm er liten når vektorene er nesten like; andre norm er liten
når de er nesten motsatte. I tilfelle 2 går $d_k$ mot null, selv om
$\lVert x_{k+1}-x_k\rVert_2$ går mot 2.
I tilfelle 3 og 4 er påfølgende vektorer ortogonale, så $d_k=\sqrt2$.
En liten $d_k$ alene sier likevel ikke hvilken egenverdi vi har funnet.

Rotasjonen gir $(1,0)^T\mapsto(0,1)^T\mapsto(-1,0)^T\mapsto(0,-1)^T$
og deretter startvektoren igjen. Determinantlikningen er $\lambda^2+1=0$,
som ikke har reelle løsninger. Over komplekse tall er egenverdiene $i$ og $-i$.

Tilfelle 1 beskriver eksakt regning. Avrunding kan i andre beregninger
tilføre et lite bidrag som mangler matematisk. Her brukes en diagonalmatrise
og en eksakt nullkoordinat for å isolere mekanismen. Eksperiment 5 undersøker
hva som skjer når startvektoren får et lite bidrag langs den dominante egenretningen.

</details>

### Eksperiment 5 – kan en liten startforskjell vokse?

I eksperiment 4 ble iterasjonsfølgen værende langs $(0,1)^T$, selv om
egenverdien $3$ tilhører retningen $(1,0)^T$. Startvektoren hadde **nøyaktig null**
bidrag i denne retningen. **Hvor følsom er denne konklusjonen for en liten endring
i startvektoren?** Dette er relevant når startdata ikke er helt nøyaktige.

Vi bruker fortsatt $A=\operatorname{diag}(3,1)$ og sammenligner startvektorene
$(0,1)^T$ og $(10^{-12},1)^T$, begge normalisert til lengde én.
Forskjellen er svært liten. I hver iterasjon beregner vi $Ax_k$ og normaliserer
resultatet; cellen skriver ut de to vektorene etter 30 steg.

**Undersøk:** Vil de to beregningene fortsatt gi nesten samme vektor etter 30 steg?
Kjør cellen. Hvilken egenretning ligger hvert resultat nær?
Prøv deretter 10 og 20 steg: når blir forskjellen tydelig?

```{pyodide-python}
#| label: week5-roundoff
# Bare første startkoordinat endres; matrisen og antall steg holdes faste.
# 1e-12 er en bevisst innlagt forstyrrelse, ikke en måling av maskinens avrundingsfeil.
# Forklar forskjellen ved at det første bidraget får en faktor 3 i hvert steg.

A = np.diag([3., 1.])
for tiny in [0., 1e-12]:
    x = np.array([tiny, 1.])
    x /= np.linalg.norm(x)
    for k in range(30):
        x = A @ x
        x /= np.linalg.norm(x)
    print("Første startkoordinat:", tiny, "→ etter 30 steg:", x)
```

**Koble observasjonen til egenverdiene:** Ved hver multiplikasjon blir det første
bidraget skalert med $3$, mens det andre blir skalert med $1$.
Normaliseringen deler begge koordinatene på samme tall og endrer derfor ikke
forholdet mellom dem. For startvektoren $(\varepsilon,1)^T$ får vi

$\frac{|(x_k)_1|}{|(x_k)_2|}=3^k|\varepsilon|.$

Et bidrag som er nøyaktig null, forblir null i dette eksemplet.
Et lite bidrag som ikke er null, kan etter tilstrekkelig mange steg dominere.
**Diskuter:** Hvorfor kan normalisering holde lengden lik én uten å hindre
at en liten endring i startvektoren etter hvert gir en helt annen retning?

Her er $10^{-12}$ en bevisst innlagt forstyrrelse av startdata, ikke en måling
av maskinavrunding. Avrundingsfeil som oppstår under selve beregningen,
behandles i «Gå i dybden».

<details class="reading-step">
<summary>Gå i dybden: skill mellom startfeil og feil i hvert steg</summary>

Uten normalisering blir startvektoren $(\varepsilon,1)^T$ til
$(3^k\varepsilon,1)^T$. For $\varepsilon=10^{-12}$ og $k=30$ er forholdet
$3^{30}10^{-12}\approx206$. Den opprinnelig lille delen dominerer.
Dette forklarer også hvorfor en eksakt manglende egenretning og en nesten
manglende egenretning kan gi ulike resultater.

For en unormalisert beregning med lokal avrundingsfeil $\delta_k$ i steg $k$,
skriv $\widehat y_{k+1}=A\widehat y_k+\delta_k$. Feilen mot eksakt regning
oppfyller da $e_{k+1}=Ae_k+\delta_k$.
Etter $k$ steg blir den

$$e_k=A^ke_0+\sum_{j=0}^{k-1}A^{k-1-j}\delta_j.$$

Hver lokal feil virker videre gjennom de neste multiplikasjonene. Stor
absoluttverdi av en egenverdi kan forsterke et feilbidrag i egenretningen.
Formelen gjelder den unormaliserte beregningen; normalisering endrer feillikningen,
men fjerner ikke mekanismen med relativ vekst mellom retningene.

</details>

## 5.5 PageRank

<div id="uke5-nett"></div>

### Fra lenker til en rangering

**Hvordan kan vi rangere nettsider ved hjelp av lenkene mellom dem?**
Å telle lenker er én mulighet. Men en lenke fra en mye besøkt side kan gi
flere besøk enn en lenke fra en lite besøkt side. Vi trenger derfor en modell
der besøksandelene bestemmes sammen. Dette er utgangspunktet for **PageRank**:
en rangering basert på en modell for hvordan en besøkende beveger seg mellom nettsider.
Vi bygger først modellen med lenker; i 5.6 legger vi til tilfeldige hopp.

::: {.week5-network-model}
::: {.week5-network-description}

Tenk deg én besøkende på fire nettsider A–D. En pil A → B betyr at A har
en lenke til B. Ved hvert steg klikker den besøkende på én av lenkene fra
siden hen er på, valgt med lik sannsynlighet. Fra A er det dermed like
sannsynlig å gå til B som til C. Fra B er C det eneste valget.

Den besøkende fortsetter etter samme regel, uten å forlate disse fire sidene.
En slik tilfeldig følge av besøk kalles en **tilfeldig vandring** (*random walk*).
For eksempel er A → B → C → D → A et mulig forløp.

Tallene på pilene er **overgangssannsynligheter**: sannsynligheten for neste
side, gitt siden den besøkende er på nå. Plasseringen av punktene har ingen
betydning for besøksregelen.

:::
::: {.week5-network-figure}

![Sannsynlighet for neste side, gitt siden den besøkende er på nå.](../assets/week5-network.svg){fig-alt="A til B og C: 1/2 hver. B til C: 1. C til A og D: 1/2 hver. D til A: 1."}

:::
:::

### Eksperiment 6 – blir rangeringen uavhengig av startsiden?

Vi følger **sannsynlighetsfordelingen**: fire tall som angir sannsynligheten
for å være på hver side etter et bestemt antall klikk. De summerer til 100 %.
Figuren beregner disse tallene, i stedet for å trekke én tilfeldig vandring.

- **100 % på A** betyr at den besøkende starter på A med sikkerhet.
- **25 % på hver side** betyr at startsiden velges med lik sannsynlighet.
- **Ett klikk** beregner fordelingen etter neste klikk; **20 klikk** gjentar
  oppdateringen 20 ganger fra fordelingen som vises.

Velg **100 % på A**. Hvor kan den besøkende være etter ett klikk?
Trykk **Ett klikk**, og undersøk så ett klikk til.
Velg deretter hver av de to startfordelingene og trykk **20 klikk**.
**Ser de samme sidene ut til å få størst sannsynlighet, uansett startfordeling?**

<details class="reading-step">
<summary>Gå i dybden: én vandring og en fordeling</summary>

Én besøkende er bare på én side om gangen. Fordelingen beskriver usikkerheten
om hvilken side det er. Etter ett klikk fra A er sannsynligheten 50 % for B
og 50 % for C; den besøkende er ikke delt mellom sidene.

Vi kan også tenke på mange uavhengige besøkende som følger samme regel.
Starter 100 personer på A, er det forventede antallet etter ett klikk
50 på B og 50 på C. Et tilfeldig forsøk trenger ikke gi nøyaktig disse tallene.
Figuren viser de beregnede sannsynlighetene, som også er de forventede andelene.
Den viser ikke antall besøk samlet over tid.

</details>
```{.jsxgraph width="680" height="550" style="width:100%;max-width:680px;height:550px;border:0;"}
document.documentElement.lang = 'nb';
var graph = document.querySelector('.jxgbox');
var style = document.createElement('style');
style.textContent = `
html,body{margin:0;width:100%;height:100%;font-family:system-ui,sans-serif;color:#243447}*{box-sizing:border-box}
.net-lab{height:100%;display:flex;flex-direction:column;gap:10px;padding:14px;border:1px solid #d4dde5;border-radius:12px}
.net-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.net-controls button{font:inherit;min-height:44px;border:1px solid #a8b6c4;border-radius:7px;background:white;color:#243447;cursor:pointer}
.net-controls button:focus-visible{outline:3px solid #1565c0;outline-offset:2px}
.net-controls button[aria-pressed=true]{background:#fff1df;border:2px solid #a04a00}
.net-controls .net-step{background:#1557a0;color:white;font-weight:650}
.net-slot{position:relative;flex:1;min-height:200px}.net-slot .jxgbox{position:absolute;inset:0;width:100%!important;height:100%!important;border:0}
.net-status{background:#f3f6fa;border-radius:8px;padding:12px;line-height:1.5;font-variant-numeric:tabular-nums}
`;
document.head.appendChild(style);
var lab = document.createElement('section');
lab.className='net-lab'; lab.setAttribute('aria-label','Besøk mellom fire nettsider');
lab.innerHTML='<div class="net-controls"><button type="button" class="net-even" aria-pressed="true">25 % på hver side</button><button type="button" class="net-all" aria-pressed="false">100 % på A</button><button type="button" class="net-step">Ett klikk</button><button type="button" class="net-many">20 klikk</button></div><div class="net-slot"></div><div class="net-status" role="status" aria-live="polite" aria-atomic="true"></div>';
graph.parentNode.insertBefore(lab,graph);lab.querySelector('.net-slot').appendChild(graph);
var bounds=[-2.1,1.7,2.1,-1.7];
var board=JXG.JSXGraph.initBoard(BOARDID,{boundingbox:bounds,axis:false,keepaspectratio:true,showCopyright:false,showNavigation:false,pan:{enabled:false},zoom:{enabled:false}});
var distribution=[.25,.25,.25,.25], round=0;
var positions=[[-1.2,.85],[1.2,.85],[1.2,-.85],[-1.2,-.85]];
var names=['A','B','C','D'];
var links=[[1,2],[2],[0,3],[0]];
// Separate the opposite A–C arrows so both directions remain visible.
links.forEach(function(targets,j){targets.forEach(function(i){
  var a=positions[j], b=positions[i], dx=b[0]-a[0],dy=b[1]-a[1], length=Math.hypot(dx,dy);
  var offset=(j===0&&i===2)||(j===2&&i===0) ? .06 : 0;
  var start=[a[0]+.21*dx/length-offset*dy/length,a[1]+.21*dy/length+offset*dx/length];
  var end=[b[0]-.21*dx/length-offset*dy/length,b[1]-.21*dy/length+offset*dx/length];
  board.create('arrow',[start,end],{strokeColor:'#728499',strokeWidth:2,fixed:true,highlight:false});
});});
positions.forEach(function(xy,i){
  board.create('point',xy,{name:names[i],fixed:true,size:11,fillColor:'#e4eef8',strokeColor:'#1557a0',highlight:false,label:{offset:[-4,24],fontSize:18}});
  board.create('text',[xy[0],xy[1]-.29,function(){return (100*distribution[i]).toFixed(1)+' %';}],{anchorX:'middle',fixed:true,fontSize:17,highlight:false});
});
function show(){
  board.update();
  lab.querySelector('.net-status').textContent='Antall klikk: '+round+' · '+names.map(function(name,i){return name+': '+(100*distribution[i]).toFixed(1)+' %';}).join(' · ')+' · Sum: '+(100*distribution.reduce(function(a,b){return a+b;},0)).toFixed(1)+' %';
}
function reset(all){distribution=all?[1,0,0,0]:[.25,.25,.25,.25];round=0;
  lab.querySelector('.net-even').setAttribute('aria-pressed',String(!all));
  lab.querySelector('.net-all').setAttribute('aria-pressed',String(all));show();}
function advance(n){for(var k=0;k<n;k++){
  var next=[0,0,0,0];links.forEach(function(targets,j){targets.forEach(function(i){next[i]+=distribution[j]/targets.length;});});distribution=next;round++;
}show();}
lab.querySelector('.net-even').addEventListener('click',function(){reset(false);});
lab.querySelector('.net-all').addEventListener('click',function(){reset(true);});
lab.querySelector('.net-step').addEventListener('click',function(){advance(1);});
lab.querySelector('.net-many').addEventListener('click',function(){advance(20);});
function resize(){if(graph.clientWidth>0&&graph.clientHeight>0){board.resizeContainer(graph.clientWidth,graph.clientHeight,true);board.setBoundingBox(bounds,true);board.fullUpdate();}}
if(typeof ResizeObserver!=='undefined'){var observer=new ResizeObserver(resize);observer.observe(graph);}
window.addEventListener('resize',resize);window.addEventListener('pageshow',resize);show();resize();
```

### Fra figuren til lineær algebra

Vi samler sannsynlighetene i $p_k=(p_A^{(k)},p_B^{(k)},p_C^{(k)},p_D^{(k)})^T$.
Her teller $k$ klikk. En **sannsynlighetsvektor** har ikke-negative elementer
med sum én. Når den besøkende starter på A med sikkerhet, er $p_0=(1,0,0,0)^T$.
Besøksregelen gir da

$$\underbrace{\begin{bmatrix}1\\0\\0\\0\end{bmatrix}}_{p_0}
\longmapsto\underbrace{\begin{bmatrix}0\\1/2\\1/2\\0\end{bmatrix}}_{p_1}
\longmapsto\underbrace{\begin{bmatrix}1/4\\0\\1/2\\1/4\end{bmatrix}}_{p_2}.$$

Vi samler overgangssannsynlighetene i en **overgangsmatrise** $S$.
Elementet $S_{ij}$ er sannsynligheten for å gå til side $i$, gitt at den
besøkende er på side $j$. **Kolonnen angir siden vi går fra; raden angir siden
vi går til.** Kolonne A er derfor $(0,1/2,1/2,0)^T$.

$$S=\begin{array}{c|rrrr}
 & A&B&C&D\\\hline
 A&0&0&1/2&1\\
 B&1/2&0&0&0\\
 C&1/2&1&0&0\\
 D&0&0&1/2&0
\end{array},\qquad p_{k+1}=Sp_k.$$

For en vilkårlig fordeling vekter vi hver kolonne med sannsynligheten for
å være på den aktuelle siden. Summen av disse kolonnebidragene er matriseproduktet
$Sp_k$: den nye fordelingen. Rad A sier
$p_A^{(k+1)}=\tfrac12p_C^{(k)}+p_D^{(k)}$: vi summerer
bidragene fra C og D. Hver kolonne summerer til én. Med ikke-negative
elementer kalles $S$ **kolonnestokastisk**; oppdateringen bevarer summen i $p_k$.

### Hvor kommer egenvektoren inn?

Når neste fordeling er lik den vi har, kaller vi fordelingen **stasjonær**:

$$\underbrace{Sp_*}_{\text{neste fordeling}}=
\underbrace{p_*}_{\text{nåværende fordeling}}
\qquad\Longleftrightarrow\qquad Sp_*=1p_*.$$

Dette er en egenvektor med egenverdi **1**, skalert til sum én.
Her er $p_*=(1/3,1/6,1/3,1/6)^T$: A og C deler førsteplassen.
Den besøkende flytter fortsatt; det er **fordelingen** som er uendret.

**Diskuter:** Hvorfor kan en lenke fra en mye besøkt side gi flere besøk enn
en lenke fra en lite besøkt side? Besøk under vår regel er ikke det samme
som kvalitet eller relevans. I 5.6 undersøker vi dessuten om fordelingen alltid stabiliserer seg.

<details class="reading-step">
<summary>Gå i dybden: fra besøksregel til matrise og egenvektor</summary>

**Fra besøksfordeling til vektor**

Vi samler sannsynlighetene i en kolonne, i den faste rekkefølgen A, B, C, D:

$$p_k=\begin{bmatrix}p_A^{(k)}\\p_B^{(k)}\\p_C^{(k)}\\p_D^{(k)}\end{bmatrix}.$$

Her er $k$ antall klikk etter at startfordelingen er valgt. For eksempel betyr $p_C^{(k)}=0.5$
at sannsynligheten for å være på C etter $k$ klikk er 50 %.
Elementene er ikke-negative og summerer til én; en slik vektor kalles en
**sannsynlighetsvektor**. Koordinatene er andeler, ikke plasseringen av
punktene i tegningen.

Når den besøkende starter på A med sikkerhet, gir de to første klikkene:

$$\begin{bmatrix}1\\0\\0\\0\end{bmatrix}
\longmapsto\begin{bmatrix}0\\1/2\\1/2\\0\end{bmatrix}
\longmapsto\begin{bmatrix}1/4\\0\\1/2\\1/4\end{bmatrix}.$$

Ved det andre klikket går hele B-bidraget på $1/2$ til C. C-bidraget på
$1/2$ deles i to: $1/4$ til A og $1/4$ til D. Dette gir prosentene i figuren. Nå skriver vi den samme flytteregelen
som ett matriseprodukt, slik at vi kan bruke teorien fra resten av uken.

**Fra lenker til en matrise**

En **overgangsmatrise** lagrer sannsynlighetene for neste klikk.
Vi lar **kolonne $j$ være siden vi går fra, og rad $i$ være siden vi går til**:
$S_{ij}$ er sannsynligheten for å gå fra $j$ til $i$.
A-kolonnen er derfor $(0,1/2,1/2,0)^T$: den viser neste fordeling hvis
startfordelingen er $p_0=(1,0,0,0)^T$. Tilsvarende viser B-kolonnen
fordelingen etter ett klikk fra $p_0=(0,1,0,0)^T$. Hver kolonne er altså resultatet av å bruke regelen på én
standardbasisvektor, akkurat som for lineære transformasjoner tidligere.

For en blandet fordeling vekter vi A-kolonnen med $p_A$, B-kolonnen med
$p_B$, og så videre, og legger bidragene sammen. Dette er nettopp
**kolonnetolkningen av matrisemultiplikasjon**:

$$S=\begin{bmatrix}0&0&1/2&1\\1/2&0&0&0\\1/2&1&0&0\\0&0&1/2&0\end{bmatrix},
\qquad p_{k+1}=Sp_k.$$

Se også på første rad: Bare C og D sender besøk til A. Halvparten av
C-bidraget og hele D-bidraget gir

$$p_A^{(k+1)}=\tfrac12p_C^{(k)}+p_D^{(k)}.$$

Faktoren $1/2$ er ikke Cs andel av alle besøk. Den er andelen av **Cs eget
bidrag** som sendes til A. Derfor må den multipliseres med $p_C^{(k)}$.
De fire radene gjør samme opptelling for hver sin side.

Produktet summerer bidragene til hver mottaker. Alle besøk fra én avsender
fordeles videre, så hver kolonne summerer til én. En matrise med denne
egenskapen og ikke-negative elementer kalles **kolonnestokastisk**.
Her teller $k$ rundene. Vi deler ikke på vektorlengden: summen én bevares av modellen.

Når andelene er de samme etter ett nytt klikk, er **fordelingen uendret**,
selv om hver besøkende fortsatt flytter seg. «Ny fordeling = gammel fordeling»
skrives

$$Sp_*=p_*.$$

Stjernen markerer en slik uendret fordeling. Den kalles **stasjonær**.
Dette er egenvektorlikningen fra 5.2 med egenverdi **1**.
I dette eksemplet konvergerer følgen av sannsynlighetsvektorer mot
$p_*=(1/3,1/6,1/3,1/6)^T$. Den besøkende fortsetter å flytte seg, men
fordelingen er uendret: hver side får like mye sannsynlighet inn som den
sender videre. For A kommer $1/6$ fra C og $1/6$ fra D, altså $1/3$ på nytt.
**Stasjonær** betyr dermed ikke at noen har sluttet å klikke.

**Hva sier rangeringen – og hva sier den ikke?**

Vi gir høyere rang til sidene med størst andel i denne uendrede fordelingen.
A og C deler førsteplassen her. Dette er et mål på **besøk under den valgte
regelen**, ikke en direkte måling av kvalitet, sannhet eller relevans.
Alle lenker fra samme side ble behandlet likt; modellen vet ingenting om
hva teksten på siden inneholder, eller hva en virkelig person foretrekker.

Vi har gått fra et spørsmål om besøk til en likning om egenvektorer:
$Sp_*=1p_*$. Summen én bestemmer skaleringen av sannsynlighetsvektoren.
I 5.6 undersøker vi hva som kan gå galt med besøksregelen, og endrer
modellen før vi kaller den endelige rangeringen PageRank.

**Diskuter:** Hvorfor kan en side få mange besøk selv om få sider lenker til den?
Og hvorfor kan riktig løsning av likningen likevel gi en lite nyttig rangering?

**Prøv som kontroll:** Kjør cellen fra begge startfordelingene. Hvilken forskjell
måler utskriften? Kan et lite tall alene si at lenkene er lagt inn riktig?

```{pyodide-python}
#| label: week5-network
# Kolonne j er avsender, rad i er mottaker; S @ p gir neste fordeling.
# Start fra jevn fordeling eller alle på A, og sammenlign sluttfordelingene.
# Summen skal forbli 1 uten normalisering av vektorlengden.

S = np.array([[0., 0., 1/2, 1.],
              [1/2, 0., 0., 0.],
              [1/2, 1., 0., 0.],
              [0., 0., 1/2, 0.]])
p = np.ones(4)/4  # Prøv np.array([1., 0., 0., 0.]).
for k in range(40):
    p = S @ p
print("A, B, C, D:", p)
print("Sum:", p.sum(), "største endring ved neste klikk:", np.max(abs(S @ p-p)))
```


</details>

<details class="reading-step">
<summary>Gå i dybden: ett matriseprodukt og en bevaringslov</summary>

**Sannsynlighet for neste side og samlet sannsynlighet.** $S_{ij}$ gjelder
under forutsetning av at vi allerede er på side $j$. Produktet $S_{ij}p_j$
er sannsynligheten for både å være på $j$ nå og gå videre til $i$.
Bidrag fra forskjellige avsendersider legges sammen fordi man bare kan
være på én av dem om gangen. Derfor er

$$(Sp)_i=\sum_j S_{ij}p_j.$$

Dette forklarer både multiplikasjonen og summeringen i matriseregelen.
Slik skiller vi selve modellen (hvem som kan flytte hvor, med hvilke
sannsynligheter) fra regnemetoden (gjentatte matriseprodukter).

En stasjonær fordeling er ikke automatisk grensen for iterasjonsfølgene fra alle startfordelinger på
alle nettverk. To sider som bare lenker til hverandre, kan gi pendling.
Forsøkene i 5.6 undersøker hvorfor modellen trenger en ekstra regel.


Fra jevn startfordeling er første mottak til A $\tfrac12\cdot\tfrac14+1\cdot\tfrac14=3/8$.
Hele svaret blir $(3/8,1/8,3/8,1/8)^T$.
Generelt er $(Sp)_i=\sum_j S_{ij}p_j$: summer alle bidrag til mottaker $i$.

Skriv $\mathbf1=(1,\ldots,1)^T$. Kolonnesummene betyr
$\mathbf1^TS=\mathbf1^T$, og dermed $\mathbf1^TSp=\mathbf1^Tp$.
Summen bevares. Dette betyr **ikke** at $S\mathbf1=\mathbf1$; det ville
kreve at også radsummene var én.

Her gir $Sp=p$ likningene $p_B=p_A/2$, $p_D=p_C/2$ og $p_A=p_C$.
Normalisering gir $p=(1/3,1/6,1/3,1/6)^T$. A og C deler førsteplassen.

Kolonnesummene gir også $S^T\mathbf1=\mathbf1$, så $S^T$ har egenverdi én.
Siden en matrise og dens transponerte har samme polynom $\det(S-\lambda I)$, kalt det **karakteristiske polynomet**,
har $S$ også egenverdi én. Men dette alene garanterer ikke at iterasjonen
konvergerer til én bestemt fordeling.

**Les én kolonne og én rad.** Kolonne C er $(1/2,0,0,1/2)^T$ fordi en
besøkende på C går til A eller D med lik sannsynlighet. Rad A er
$(0,0,1/2,1)$ fordi A mottar halvparten fra C og alt fra D.
Rad A summerer til $3/2$, som er helt i orden: raden samler ulike avsendere.

**Finn den uendrede fordelingen for hånd:**

$$\begin{aligned}
p_A&=p_C/2+p_D, &p_B&=p_A/2,\\
p_C&=p_A/2+p_B, &p_D&=p_C/2.
\end{aligned}$$

Sett inn $p_B=p_A/2$ i tredje likning: $p_C=p_A$.
Da er også $p_D=p_A/2$. Alle stasjonære løsninger har formen
$t(1,1/2,1,1/2)^T$. Kravet om sum én gir $3t=1$ og $t=1/3$.
Dermed er $p_*=(1/3,1/6,1/3,1/6)^T$.

Det homogene systemet $(S-I)p=0$ velger en retning. Tilleggskravet
$\sum_i p_i=1$ velger én vektor på denne retningen.
Dette er normalisering med et annet formål enn lengde én i potensmetoden.

</details>

## 5.6 En felle og en utvei

<div id="uke5-google"></div>

### Eksperiment 7 – kan én side fange besøkene?

I 5.5 brukte vi en stasjonær fordeling til å rangere sidene. Men kan lenkene
gi en høy rangering av en helt annen grunn enn at en side er nyttig?
Vi undersøker dette ved å endre **bare lenken fra D**: i stedet for å gå til A
fører den nå tilbake til D. Den som følger denne lenken, blir på samme side.
**Gjett først:** D har fortsatt bare én innkommende lenke fra en annen side.
Kan D likevel ende med nesten alle besøkene?

**Undersøk:** Startfordelingen er 25 % på hver side. Hvordan tror du
sannsynligheten for å være på D utvikler seg? Kjør cellen og følg de fire
kurvene. Hvilke lenker gjør at den besøkende kan komme til D, men ikke forlate D?
Vannrett akse viser antall klikk; hver kurve viser sannsynligheten for én side.

```{pyodide-python}
#| label: week5-trap
# Vi endrer bare lenkene UT fra D, altså én kolonne.
# En besøksandel som kommer til D, kan deretter ikke forlate siden.
# Følg alle fire andeler: en stabil fordeling trenger ikke gi en nyttig rangering.

# Samme nettverk som i 5.5; tallene gjentas så denne fanen kan kjøres direkte.
S = np.array([[0., 0., 1/2, 1.],
              [1/2, 0., 0., 0.],
              [1/2, 1., 0., 0.],
              [0., 0., 1/2, 0.]])
trap = S.copy()
# Kolonne 3 er D: alle som er på D, går tilbake til D ved neste klikk.
trap[:, 3] = [0., 0., 0., 1.]
p = np.ones(4) / 4
values = [p.copy()]
for k in range(100):
    p = trap @ p
    # Lagre et eget øyeblikksbilde av fordelingen for hver runde.
    values.append(p.copy())
plt.figure()
plt.plot(values)
plt.xlabel("Antall klikk")
plt.ylabel("Sannsynlighet for å være på siden")
plt.legend(list("ABCD"))
plt.title("Besøkene slipper ikke ut av D")
plt.show()
print(p)
```

D er en felle: besøk kan komme inn, men ikke ut. Regningen kan konvergere
helt fint selv om rangeringen ikke uttrykker det vi ønsket å måle.
Den nye siste raden viser oppsamlingen:

$$p_D^{(k+1)}=\tfrac12p_C^{(k)}+p_D^{(k)}\ge p_D^{(k)}.$$

I dette nettverket nærmer fordelingen seg $(0,0,0,1)^T$.
Lar vi $S_{\mathrm{felle}}$ betegne overgangsmatrisen med den endrede D-kolonnen,
oppfyller denne vektoren $S_{\mathrm{felle}}p=p$ nøyaktig.
Residualen $r=S_{\mathrm{felle}}p-p$ er altså null: vi har løst modellens likning,
men selve besøksregelen gir D høyest rang fordi siden holder på besøkene.

### Eksperiment 8 – gir tilfeldige hopp en utvei?

Vi trenger en mulighet til å forlate D. Derfor endrer vi besøksregelen:
ved hvert steg følger den besøkende en lenke med sannsynlighet $\alpha$.
Med sannsynlighet $1-\alpha$ velger hen i stedet én av de fire sidene med
lik sannsynlighet, uavhengig av lenkene. Også siden hen allerede er på, kan velges.
Et slikt tilfeldig hopp kalles **teleportering**.

Tallet $\alpha$ kalles **dempingsfaktoren** og styrer hvor stor vekt lenkene får.
For $\alpha=0.85$ er det 85 % sannsynlighet for å følge en lenke og 15 % for
et hopp. **Vil D beholde like høy rang når den besøkende kan hoppe ut av fellen?**

**Undersøk:** Kjør cellen etter eksperiment 7. Hver kurve viser fordelingen
etter 500 steg for én verdi av $\alpha$. Sammenlign D for $0.95$, $0.85$ og
$0.5$: hva skjer når tilfeldige hopp blir vanligere? Får alle sidene positiv sannsynlighet?

```{pyodide-python}
#| label: week5-teleport
# alpha er sannsynligheten for å følge lenker; 1-alpha er sannsynligheten for et hopp.
# Hoppfordelingen u er fast, mens p er den nåværende besøksfordelingen.
# Sammenlign den stasjonære sannsynligheten for D når hopp blir vanligere.

# Kjør felleforsøket først. u fordeler de tilfeldige hoppene likt.
u = np.ones(4) / 4
fig, ax = plt.subplots()
for alpha in [0.5, 0.85, 0.95]:
    p = u.copy()
    for k in range(500):
        p = alpha * (trap @ p) + (1-alpha) * u
    ax.plot(list("ABCD"), p, 'o-', label=f"α = {alpha}")
ax.set(xlabel="Side", ylabel="Stasjonær sannsynlighet", title="En utvei fra fellen")
ax.legend()
plt.show()
```

### Bygg matematikken fra besøksregelen

La $S$ være overgangsmatrisen for lenkene, her med fellen på D.
La $u=(1/4,1/4,1/4,1/4)^T$ være **hoppfordelingen**: sannsynlighetene for
hvilken side et tilfeldig hopp ender på. Den nye fordelingen er summen av
bidraget fra lenkeklikk og bidraget fra hopp:

$$p_{k+1}=\underbrace{\alpha Sp_k}_{\text{følger lenker}}+
\underbrace{(1-\alpha)u}_{\text{tilfeldige hopp}}.$$

For å skrive dette som ett matriseprodukt lar vi $n$ være antall sider og
$\mathbf1$ kolonnen med $n$ ettall. Matrisen $u\mathbf1^T$ har $u$ i hver
kolonne: den beskriver samme hoppfordeling fra alle sider. Siden
$\mathbf1^Tp_k=1$, er $(u\mathbf1^T)p_k=u$. Dermed er oppdateringen
$p_{k+1}=Gp_k$, der

$$G=\alpha S+(1-\alpha)u\mathbf1^T.$$

Matrisen $G$ kalles **Google-matrisen**, og dens stasjonære sannsynlighetsvektor er
**PageRank-vektoren** $p_*$. Den oppfyller $Gp_*=p_*$: igjen en egenvektor
med egenverdi én, skalert til sum én. Sidene rangeres etter elementene i $p_*$.
Valget av $\alpha$ påvirker dermed selve rangeringen.

**Hva hvis en side ikke har lenker?** En slik side kalles en **hengende node**
i nettverket. Da mangler vandringen et neste steg hvis lenkeregelen velges.
Vi lar derfor også denne overgangen følge $u$: erstatt sidens nullkolonne i
$S$ med $u$ **før** $G$ dannes. Kolonnen summerer da til én, som de andre.

<details class="reading-step">
<summary>Gå i dybden: fra besøksregel til Google-matrise</summary>

Siden $\mathbf1^Tp_k=1$, kan vi også skrive $p_{k+1}=Gp_k$, med

$$G=\alpha S+(1-\alpha)u\mathbf1^T.$$

Produktet $u\mathbf1^T$ har $u$ i hver kolonne:

$$u\mathbf1^T=\begin{bmatrix}u&u&\cdots&u\end{bmatrix},\qquad
(u\mathbf1^T)p_k=u\underbrace{(\mathbf1^Tp_k)}_{1}=u.$$

Dermed beskriver $Gp_k$ akkurat samme besøksregel. For fire sider og
$\alpha=0.85$ får hver side et hoppbidrag $0.15/4=0.0375$ per runde.
I fellen blir for eksempel D-regelen

$$p_D^{(k+1)}=0.85\bigl(\tfrac12p_C^{(k)}+p_D^{(k)}\bigr)+0.0375.$$

**Kontroller for hånd:** Hvis D-kolonnen var null, hva ville
kolonnesummen til $G$ bli? Regn før du sammenligner:

$$\sum_iG_{iD}=\alpha\cdot0+(1-\alpha)\cdot1=1-\alpha.$$

Derfor må vi først erstatte nullkolonnen med $u$, slik at summen blir
$\alpha\cdot1+(1-\alpha)\cdot1=1$.

Det er to valg i hver runde. Andelen $\alpha$ følger lenkene og gir bidraget
$\alpha Sp_k$. Resten, $1-\alpha$, fordeles etter $u$ og gir $(1-\alpha)u$.
Siden alle besøk må telles, legger vi bidragene sammen.

Matrisen $u\mathbf1^T$ har dimensjon $n\times n$: en kolonne med $n$ elementer
ganges med en rad med $n$ ettall. Element $(i,j)$ blir $u_i\cdot1=u_i$.
Hver avsender får dermed samme fordeling for tilfeldige hopp.

Med $u_i>0$ er $G_{ij}=\alpha S_{ij}+(1-\alpha)u_i>0$.
Kolonnesummen er $\alpha\sum_iS_{ij}+(1-\alpha)\sum_iu_i=1$.
Dette er de to egenskapene vi trenger for teoremet nedenfor.

En hengende node har ingen utgående lenker. Vi velger at besøkende derfra
fordeles etter $u$. En selvlenke er derimot et eksisterende lenkevalg:
ved å følge den blir besøkende på samme side. Teleporteringen gir også
disse besøkende en mulighet til å gå videre.

Vi kan beregne den stasjonære fordelingen på to måter. Iterasjonen gir
$p_{k+1}=\alpha Sp_k+(1-\alpha)u$. Ved stasjonaritet får vi

$$p_*=\alpha Sp_*+(1-\alpha)u
\quad\Longrightarrow\quad
(I-\alpha S)p_*=(1-\alpha)u.$$

Dette lille lineære systemet blir en uavhengig kontroll i prosjektet.
På store nettverk bruker vi matrise-vektor-produktet; vi trenger ikke
lagre den tette matrisen $u\mathbf1^T$.

</details>

### Hva kan vi nå garantere?

Hvis $S$ er kolonnestokastisk, $u_i>0$, $\sum_i u_i=1$ og $0<\alpha<1$,
er alle elementene i $G$ positive og kolonnene summerer til én.
Da finnes **nøyaktig én stasjonær sannsynlighetsvektor**, alle sidene får
positiv andel. Iterasjonsfølgen konvergerer mot denne fordelingen fra enhver startfordeling.
Dette er konklusjonen vi bruker fra **Perron–Frobenius-teoremet**. Det krever ikke at $G$ er symmetrisk eller diagonaliserbar.

**Sjekk forståelsen:** Lover teoremet at rangeringen er en god måling av
kvalitet? Hva skjer med lenkenes betydning når $\alpha=0$? Hvilken garanti
mister vi ved $\alpha=1$?

<details class="reading-step">
<summary>Gå i dybden: andre egenverdier beskriver avvikene</summary>

La $p_*$ være den stasjonære fordelingen. Differansen $e_k=p_k-p_*$ har sum
null, så teleporteringstermen kanselleres:

$$e_{k+1}=Ge_k=\alpha Se_k.$$

Et avvik i en egenretning skaleres med den tilhørende egenverdien ved hvert
steg. Derfor er de andre egenverdiene relevante selv om selve rangeringen
alltid bruker egenverdien én. Med $0<\alpha<1$ har alle de andre
egenverdiene til $G$ absoluttverdi mindre enn én, faktisk høyst $\alpha$.

På små grafer kan vi finne alle egenverdiene og sammenligne størrelsen på
den nest største med et konvergensplott. Flere bidrag, startfordelingen og
avrunding kan påvirke plottet; det er ikke alltid én rett linje fra første steg.

Trekk de to oppdateringslikningene fra hverandre:

$$\begin{aligned}
e_{k+1}&=p_{k+1}-p_*\\
&=\alpha Sp_k+(1-\alpha)u-\bigl(\alpha Sp_*+(1-\alpha)u\bigr)\\
&=\alpha S(p_k-p_*)=\alpha Se_k.
\end{aligned}$$

Siden begge fordelinger summerer til én, har $e_k$ sum null, og
$u\mathbf1^Te_k=0$. Derfor er også $Ge_k=\alpha Se_k$.

Se på to sider som bare lenker til hverandre. Med jevne hopp blir

$$G=\begin{bmatrix}(1-\alpha)/2&(1+\alpha)/2\\
(1+\alpha)/2&(1-\alpha)/2\end{bmatrix}.$$

Regn på $v=(1,1)^T$ og $w=(1,-1)^T$: $Gv=v$ og $Gw=-\alpha w$.
Den stasjonære fordelingen er $p_*=v/2$. Fra $p_0=(1,0)^T$ er

$$p_k=\tfrac12v+\tfrac12(-\alpha)^kw.$$

Fortegnet til avviket veksler, men størrelsen avtar med faktoren $\alpha$
per steg. Ved $\alpha=1$ avtar det ikke. Dette knytter nettverket direkte
til fortegnsforsøket i 5.4.

</details>

<details class="learning-extension">
<summary>Fordypning: en feilgrense uten en egenvektorbasis</summary>

For $\lVert z\rVert_1=\sum_i|z_i|$ gir kolonnesummene og trekantulikheten

$$\lVert Sz\rVert_1\le\sum_{i,j}S_{ij}|z_j|=\lVert z\rVert_1.$$

Derfor er $\lVert e_{k+1}\rVert_1\le\alpha\lVert e_k\rVert_1$.
For en sannsynlighetsvektor $p$ får vi dessuten

$$\lVert p-p_*\rVert_1\le\frac{\lVert Gp-p\rVert_1}{1-\alpha}.$$

For å se dette, skriv $p-p_*=(p-Gp)+(Gp-Gp_*)$, bruk trekantulikheten
og flytt $\alpha\lVert p-p_*\rVert_1$ til venstre.
Nær $\alpha=1$ må residualen være mindre for å gi samme feilgaranti.

Mer detaljert starter normulikheten slik:

$$\begin{aligned}
\lVert Sz\rVert_1
&=\sum_i\left|\sum_jS_{ij}z_j\right|\\
&\le\sum_i\sum_j S_{ij}|z_j|\\
&=\sum_j|z_j|\underbrace{\sum_iS_{ij}}_{1}=\lVert z\rVert_1.
\end{aligned}$$

Ikke-negative matriseelementer gjør at $|S_{ij}z_j|=S_{ij}|z_j|$.
For feilgrensen setter vi $e=p-p_*$ og $r=Gp-p$.
Da er $e=-r+Ge$, og fordi $e$ har sum null, er
$\lVert Ge\rVert_1\le\alpha\lVert e\rVert_1$.

$$\lVert e\rVert_1\le\lVert r\rVert_1+\alpha\lVert e\rVert_1
\quad\Longrightarrow\quad
(1-\alpha)\lVert e\rVert_1\le\lVert r\rVert_1.$$

For $\alpha=0.85$ og residual $10^{-8}$ blir feilgrensen
$10^{-8}/0.15\approx6.67\cdot10^{-8}$.
For $\alpha=0.99$ blir den $10^{-6}$ ved samme residual.
En lik residualtoleranse gir altså ikke samme feilgaranti når $\alpha$ endres.

</details>

## 5.7 Oppgaver

<div id="uke5-oppgaver"></div>

Oppgave 1–2 repeterer Matte 1. Oppgave 3–6 bruker verktøyene til å undersøke
iterasjon og PageRank i Matte 3A. Hver del angir hva du skal levere:
tall i svarfeltene, kode i kodevinduet eller en skriftlig begrunnelse i egne notater.
Bruk eksakte tall i matematikkfeltene, for eksempel `3/2` og `sqrt(2)`.

### Oppgave 1 – koordinater i en annen basis

Vi har $v_1=(1,1)^T$, $v_2=(1,-1)^T$ og $x=(2,1)^T$.
Vi skal finne tallene $c_1,c_2$ slik at $x=c_1v_1+c_2v_2$.

**a. Sett opp systemet.** Skriv én likning for hver koordinat.
**Svar i egne notater:** to lineære likninger med ukjente $c_1,c_2$.

**b. Løs systemet.** Skriv ett reelt tall i hvert felt, ikke en vektor eller en likning.

```{math-exercise}
#| label: week5-task-coordinates
#| caption: Finn koeffisientene ved å løse et lineært system
#| mode: equivalent
#| partial-credit: true
#| field-labels: c₁, c₂

$c_1=$ __[3/2]

$c_2=$ __[1/2]
```

**c. Kontroller og tolk.** Beregn $c_1v_1+c_2v_2$, og forklar hvorfor
$c_1,c_2$ ikke er de samme som standardkoordinatene $2,1$.
**Svar i egne notater:** én vektorberegning og en kort forklaring.

<details class="learning-hint">
<summary>Hint til oppgave 1</summary>

Likningene er $c_1+c_2=2$ og $c_1-c_2=1$. Hva skjer når du legger dem sammen?

</details>

### Oppgave 2 – egenverdier og valgfrie egenvektorer

Vi undersøker $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$.

**a. Finn egenverdiene.** Sett opp $\det(A-\lambda I)=0$ og løs likningen.
**Svar i egne notater:** determinantlikningen med mellomregning.

**b. Finn en egenvektor til hver egenverdi.** Løs $(A-\lambda I)v=0$
for hver egenverdi. Du velger selv skaleringen: vektorene trenger ikke ha
lengde én eller første koordinat lik én.

**Svarformat:** to reelle egenverdier i synkende rekkefølge, hver med en
tilhørende ikke-null vektor i $\mathbb R^2$. Skriv ett tall per felt;
vektorfeltene står som kolonner. Kontrollen undersøker $Av_i=\lambda_i v_i$
og godtar alle gyldige skaleringer.

```{math-exercise}
#| label: week5-task-eigenvectors
#| caption: To egenverdier med tilhørende egenvektorer
#| mode: custom
#| field-labels: største egenverdi λ₁, første koordinat i v₁, andre koordinat i v₁, minste egenverdi λ₂, første koordinat i v₂, andre koordinat i v₂
#| checker: |
#|   def check(response, symbols):
#|       values = response["expressions"]
#|       if len(values) != 6:
#|           return {"score": 0, "feedback": "Fyll inn to egenverdier og to koordinater i hver egenvektor."}
#|       # Godta eksakte reelle tall, også brøker og røtter, men ikke frie parametre.
#|       if any(z.free_symbols or z.is_real is not True or z.is_finite is not True for z in values):
#|           return {"score": 0, "feedback": "Bruk konkrete, endelige reelle tall. Beskriv parameterfamiliene i del c."}
#|       A = Matrix([[2, 1], [1, 2]])
#|       checks = []
#|       messages = []
#|       for i, target in enumerate((3, 1)):
#|           lam = values[3*i]
#|           v = Matrix(values[3*i+1:3*i+3])
#|           eigenvalue_ok = simplify(lam-target) == 0
#|           nonzero = any(simplify(z) != 0 for z in v)
#|           # Test egenvektorlikningen, ikke likhet med én forhåndsvalgt vektor.
#|           eigenvector_ok = nonzero and all(simplify(z) == 0 for z in A*v-lam*v)
#|           checks.extend([eigenvalue_ok, eigenvalue_ok and eigenvector_ok])
#|           if not eigenvalue_ok:
#|               messages.append(f"Par {i+1}: kontroller egenverdien og den synkende rekkefølgen.")
#|           elif not nonzero:
#|               messages.append(f"Par {i+1}: nullvektoren er ikke en egenvektor.")
#|           elif not eigenvector_ok:
#|               messages.append(f"Par {i+1}: kontroller at Av = λv med din egenverdi og vektor.")
#|           else:
#|               messages.append(f"Par {i+1}: egenverdien og egenvektoren stemmer.")
#|       return {"score": sum(checks)/4, "show_score": False, "feedback": " ".join(messages)}

For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$: oppgi $\lambda_1>\lambda_2$
og ikke-null vektorer som oppfyller $Av_i=\lambda_i v_i$.

Største egenverdi: $\lambda_1=$ __[3]

En tilhørende egenvektor: $v_1=$ vec[1,1]

Minste egenverdi: $\lambda_2=$ __[1]

En tilhørende egenvektor: $v_2=$ vec[1,-1]
```

**c. Beskriv alle valgene.** Bruk de to egenvektorene dine til å beskrive
alle egenvektorene til hver egenverdi og de to egenrommene.
**Svar i egne notater:** to parameterfamilier $t v_i$, med presist vilkår på
$t\in\mathbb R$ for henholdsvis egenvektorer og egenrom. Forklar hvorfor
nullvektoren behandles forskjellig.

<details class="learning-hint">
<summary>Hint til oppgave 2</summary>

Determinantlikningen er $(2-\lambda)^2-1=0$. Sett hver rot inn i
$A-\lambda I$ og løs det homogene systemet. Matrisen er singulær,
så du skal ikke forsøke å invertere den.

</details>

### Oppgave 3 – gjentatt transformasjon i en egenvektorbasis

Her bruker vi $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, $x_0=(2,1)^T$,
$v_1=(1,1)^T$ og $v_2=(1,-1)^T$, med egenverdier $3$ og $1$.
Bruk disse faste basisvektorene i oppgaven, uansett hvilke skaleringer du valgte i oppgave 2.

**a. Finn et uttrykk for alle steg.** Skriv $A^kx_0=c_1 3^k v_1+c_2 1^k v_2$
og bestem $c_1,c_2$.
**Svar i egne notater:** én vektorformel som gjelder for alle heltall $k\geq0$.

**b. Beregn ved $k=3$.** De to første feltene er standardkoordinatene
til vektoren $A^3x_0$. Det siste feltet er ett ikke-negativt tall:

$$\frac{\lVert c_2 1^3 v_2\rVert_2}{\lVert c_1 3^3 v_1\rVert_2}.$$

```{math-exercise}
#| label: week5-task-powers
#| caption: To bidrag som utvikler seg forskjellig
#| mode: equivalent
#| partial-credit: true
#| field-labels: første koordinat, andre koordinat, forhold mellom bidragslengder

$A^3x_0=($ __[41] $, $ __[40] $)^T$

Lengden av bidraget langs $v_2$, delt på lengden av bidraget langs $v_1$, etter tre steg:
__[1/81]
```

**c. Forklar retningen.** Hvorfor nærmer de normaliserte vektorene seg
linjen gjennom $v_1$, selv om lengden av bidraget langs $v_2$ ikke avtar?
**Svar i egne notater:** en kort forklaring med forholdet mellom bidragslengdene.

**d. Undersøk to endringer.**

1. Oppgi én konkret ikke-null startvektor som gir en iterasjonsfølge som
   ikke nærmer seg linjen gjennom $v_1$. Begrunn valget.
2. Behold $x_0=(2,1)^T$ og basisvektorene, men la egenverdiene være $3$ og $-1$.
   Skriv den nye formelen for $A^kx_0$. Hva endres ved fortegnet og størrelsen
   til det andre bidraget?

**Svar i egne notater:** én vektor, én vektorformel og begrunnelser.

### Oppgave 4 – hva kontrollerer en liten egenresidual?

**a. Programmer potensmetoden.** Fullfør `power_check`.
Normaliser startvektoren og utfør deretter nøyaktig `steps` oppdateringer
$x\leftarrow Ax/\lVert Ax\rVert_2$. Beregn til slutt

$$\rho=\frac{x^TAx}{x^Tx},\qquad r=Ax-\rho x.$$

| Navn | Type og betydning |
|---|---|
| `A` | Reell NumPy-matrise med form `(n, n)` |
| `start` | Reell NumPy-vektor med form `(n,)`, forskjellig fra null |
| `steps` | Heltall større enn eller lik null |
| Returverdi | Tuple `(x, rho, residual)` |
| `x` | NumPy-vektor med form `(n,)` og lengde én |
| `rho` | Reelt skalar: Rayleigh-kvotienten for siste vektor |
| `residual` | Ikke-negativt skalar: $\lVert r\rVert_2$ |

Forutsett at ingen multiplikasjon gir nullvektoren.
Når `steps=0`, skal funksjonen fortsatt normalisere startvektoren og beregne de to skalarene.

```{py-exercise}
#| label: week5-task-power-residual
#| caption: Implementer potensmetoden og utfordre kontrollen
# Skill mellom retningen x, egenverdianslaget rho og residualens lengde.
# Samme antall steg gjør startvektorene sammenlignbare.
# Behold funksjonens returformat slik at kontrollene kan undersøke alle tre.

import numpy as np

def power_check(A, start, steps):
    # x = start / ||start||; deretter steps ganger: x = Ax / ||Ax||.
    # rho = (x.T @ A @ x)/(x.T @ x), residual = ||A @ x - rho*x||.
    # Returner x, rho, residual.
    return None

A = np.diag([5., 2.])
# Undersøk [1., 1.], [0., 1.] og [1.e-8, 1.] med samme antall steg.

## TESTS ##
x, rho, residual = power_check(np.diag([5.,2.]), np.array([0.,3.]), 4)
assert np.allclose(x, [0,1]) and np.isclose(rho,2) and np.isclose(residual,0), 'En startvektor i det andre egenrommet gir itererte vektorer i samme egenrom.'
x, rho, residual = power_check(np.diag([5.,2.]), np.array([1.,1.]), 2)
y = np.array([25.,4.]); y /= np.linalg.norm(y)
assert np.allclose(x,y), 'Normaliser, og utfør akkurat det oppgitte antallet steg.'
assert np.isclose(rho, np.dot(y, np.diag([5.,2.])@y)), 'Bruk Rayleigh-kvotienten for siste vektor.'
assert np.isclose(residual,np.linalg.norm(np.diag([5.,2.])@y-rho*y)), 'Mål egenresidualen, ikke endringen mellom iterasjoner.'
x, rho, residual = power_check(np.array([[2.,1.],[1.,2.]]), np.array([3.,4.]), 0)
assert np.allclose(x,[.6,.8]), 'Også startvektoren skal normaliseres når steps er 0.'
assert np.isclose(rho,2.96) and np.isclose(residual,.28), 'Funksjonen må også virke for en matrise som ikke er diagonal.'
```

**b. Sammenlign tre startvektorer.** Bruk $A=\operatorname{diag}(5,2)$ og
$(1,1)^T$, $(0,1)^T$, $(10^{-8},1)^T$.
Forutsi hvilke som vil gi tilnærming til egenverdien $5$, og hvilken som vil
gi raskest tilnærming. Prøv deretter 5, 20 og 40 steg for hver startvektor.
Legg egne funksjonskall før `## TESTS ##` i kodevinduet.

**Svar:** en tabell med startvektor, antall steg, $\rho$ og residualens lengde.

**c. Tolk kontrollen.** Kan residualen være null når $\rho=2$?
Hva bekrefter en null residual, og hva sier den ikke om størrelsen på egenverdien?
Bruk uttrykket for $A^kx_0$ til å forklare forskjellen mellom startvektorene
$(0,1)^T$ og $(10^{-8},1)^T$.
**Svar i egne notater:** én vektorformel og en kort konklusjon.

### Oppgave 5 – stasjonær fordeling uten konvergens

To nettsider lenker bare til hverandre. Overgangsmatrisen er
$S=\begin{bmatrix}0&1\\1&0\end{bmatrix}$, med kolonner som avsendersider.

**a. Finn den stasjonære fordelingen.** Løs $Sp_*=p_*$ sammen med
$p_{*,1}+p_{*,2}=1$, og finn begge egenverdiene.
**Svarformat:** to sannsynligheter mellom 0 og 1 med sum én,
og ett reelt tall for egenverdien forskjellig fra $1$.

```{math-exercise}
#| label: week5-task-stationary-cycle
#| caption: Skill mellom en uendret fordeling og en grense
#| mode: equivalent
#| partial-credit: true
#| field-labels: første stasjonære andel, andre stasjonære andel, andre egenverdi

$p_*=($ __[1/2] $, $ __[1/2] $)^T$

Egenverdien forskjellig fra $1$ er __[-1]
```

**b. Følg to startfordelinger.** Finn $p_0,p_1,p_2,p_3$ både når
$p_0=(1,0)^T$ og når $p_0=p_*$.
**Svar i egne notater:** to følger med fire vektorer hver.

**c. Forklar forskjellen.** Bruk den andre egenverdien til å forklare
hvorfor en entydig stasjonær fordeling ikke sikrer konvergens fra enhver startfordeling.
**Svar i egne notater:** en kort begrunnelse knyttet til vektorene i del b.

### Oppgave 6 – tilfeldige hopp endrer både forløp og rangering

Vi følger lenkene med sannsynlighet $\alpha$ og velger ellers neste side
etter en fast sannsynlighetsvektor $u$. Oppdateringen er
$p_{k+1}=\alpha Sp_k+(1-\alpha)u$.

**a. Programmer ett steg.** Fullfør `visit_step`.

| Navn | Type og betydning |
|---|---|
| `S` | NumPy-matrise med form `(n, n)`, ikke-negative elementer og kolonnesum én |
| `p`, `u` | NumPy-vektorer med form `(n,)`, ikke-negative elementer og sum én |
| `alpha` | Reelt skalar med $0\leq\alpha<1$ |
| Returverdi | NumPy-vektor med form `(n,)`: fordelingen etter **ett** steg |

Funksjonen skal returnere vektoren, ikke skrive den ut eller returnere flere verdier.

```{py-exercise}
#| label: week5-task-teleportation
#| caption: Fra pendling til konvergens
# Denne funksjonen skal gjøre ETT steg, ikke iterere til konvergens.
# S @ p fordeler lenkebesøkene; u beskriver hvor de uavhengige hoppene lander.
# En løkke utenfor funksjonen kan deretter følge hele utviklingen.

import numpy as np

def visit_step(S, p, alpha, u):
    # Returner fordelingen etter ett steg med teleportering.
    return None

S = np.array([[0.,1.],[1.,0.]])
u = np.array([.5,.5])
p = np.array([1.,0.])
# Når funksjonen virker: gjenta steget og følg avstanden ||p-u||.

## TESTS ##
S2 = np.array([[0.,1.],[1.,0.]])
out = visit_step(S2, np.array([1.,0.]), .8, np.array([.5,.5]))
assert np.allclose(out,[.1,.9]), 'Bland lenkesteget med den faste fordelingen u.'
assert np.allclose(visit_step(S2,np.array([.3,.7]),0,np.array([.8,.2])),[.8,.2]), 'Ved alpha=0 bestemmer u hele neste fordeling.'
S3 = np.array([[0.,0.,1.],[1.,0.,0.],[0.,1.,0.]])
out = visit_step(S3,np.array([1.,0.,0.]),.6,np.array([.5,.25,.25]))
assert np.allclose(out,[.2,.7,.1]), 'Bruk kolonner som avsendere; funksjonen skal også virke for tre sider.'
assert np.isclose(np.sum(out),1) and np.all(np.asarray(out)>=0), 'Resultatet skal være en sannsynlighetsvektor.'
```

**b. Undersøk farten.** Bruk $S=\begin{bmatrix}0&1\\1&0\end{bmatrix}$,
$u=(1/2,1/2)^T$ og $p_0=(1,0)^T$. Velg to verdier $0<\alpha<1$ som
du tror vil gi tydelig forskjellig konvergensfart. Bruk samme startfordeling
og antall steg i begge forsøk.

**Svar:** ett plott av $\lVert p_k-u\rVert_2$ mot $k$ med én merket kurve
for hver verdi av $\alpha$, og en kort sammenligning med forventningen din.
Legg forsøkskoden før `## TESTS ##`.

**c. Begrunn observasjonen.** Skriv avviket $p_k-u$ som et tall ganger
$(1,-1)^T$. Vis hvordan dette tallet endres ved ett steg.
**Svar i egne notater:** en formel i $k$ og $\alpha$ og en forklaring av
både fortegnet og konvergensfarten.

**d. Skill regnefart fra modellvalg.** Forklar hva en lavere $\alpha$ betyr
for vekten på lenkene. I dette symmetriske eksemplet er den stasjonære
fordelingen $u$ for alle $0\leq\alpha<1$. Hvorfor betyr ikke dette at
rangeringen på andre nettverk er uavhengig av $\alpha$? Bruk fellen i 5.6
som sammenligningsgrunnlag.
**Svar i egne notater:** en kort forklaring med henvisning til besøksregelen.

I [prosjekt 5](project_week5.qmd) bruker du dette til en egen undersøkelse
av rangering. Skill mellom tre spørsmål: Oppfyller svaret likningen?
Konvergerer metoden? Måler modellen det vi ønsket?

:::
