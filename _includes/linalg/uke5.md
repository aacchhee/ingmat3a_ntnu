<div class="learning-mode" data-learning-mode data-reading-label="Gå i dybden" role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 5.0 Hva overlever?

<div id="uke5-start"></div>

Hva skjer hvis vi bruker den samme matrisen på en vektor mange ganger?
Og kan den samme regneoperasjonen brukes til å rangere nettsider?

Vi begynner med å prøve. Deretter forklarer vi mønsteret vi ser, og bygger
matematikken som trengs for å undersøke når det virker.



**Prøv først, forklar etterpå.** Bruk figurene og de korte kodeforsøkene.
Under **Gå i dybden** finner du håndregning, begrunnelser og flere spørsmål.

Vi skal oppdage spesielle retninger, forklare hvorfor noen bidrag tar over,
og bruke den samme ideen til å rangere nettsider etter besøk.

```{pyodide-python}
#| label: week5-setup
#| autorun: true
#| context: setup
import numpy as np
import matplotlib.pyplot as plt
```

## 5.1 En retning vokser fram

<div id="uke5-erfaring"></div>

### Prøv før vi forklarer

Matrisen er

$$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}.$$

**Felles forsøk — bruk figuren:**

1. Velg **(1, 0)**. Gjett hvilken linje den blå vektoren vil nærme seg.
   Trykk **Ett steg** fem ganger og noter om koordinatene nærmer seg hverandre.
2. Velg **(−1, 0)** og gjenta. Er det samme linje? Samme orientering?
3. Velg **(1, 1)** og deretter **(1, −1)**. Gjør tre steg fra hver start.
   Endres retningen? Skriv én observasjon for hver start.
4. Prøv også **(0, 1)** og **(1, −0.9)**. Det siste valget ligger nær den
   spesielle retningen $(1,-1)^T$. Dra deretter til en egen start.

Startvalgene angir retninger. Å **normalisere** betyr her å dele på lengden,
slik at vektoren får lengde én. Den oransje
vektoren $x_0$ er starten; den blå er det nåværende resultatet. Hvert klikk
regner ut $Ax$ og deler på lengden til svaret. Vi bruker ingen
normalisering av enkeltkoordinater. Formelen under figuren viser hvilket
produkt den blå retningen kommer fra; lengden er alltid normalisert til én.
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
    <button type="button" class="week5-reset">Tilbake til start</button>
  </div>
  <div class="week5-graph-slot"></div>
  <div class="week5-readout">
    <p class="week5-start-key"></p>
    <p class="week5-start-key">Dra den oransje ringen for å velge en egen start.</p>
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
function formatCoordinate(value) { return (Math.abs(value) < 0.0005 ? 0 : value).toFixed(3); }
function updateReadout() {
  startKey.textContent = 'Oransje ring · '+(selectedStart || 'Egen start')+': x₀ = ('+
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

Mange startvektorer nærmer seg samme **linje**, men kan ha motsatt orientering.
Startene langs $(1,1)^T$ og $(1,-1)^T$ skiller seg ut: der endres ikke
retningen. Vi skal undersøke hva matrisen gjør langs disse linjene.

Figurens regneoperasjon kan nå skrives

$$x_{k+1}=\frac{Ax_k}{\lVert Ax_k\rVert_2},\qquad
x_k=\frac{A^kx_0}{\lVert A^kx_0\rVert_2}.$$

Her teller $k$ multiplikasjonene, $\lVert x\rVert_2$ er vektorens vanlige lengde,
og $I$ er identitetsmatrisen, som lar vektoren være uendret. Vi setter $A^0=I$.
**Diskuter:** Hvorfor kan vi miste informasjon om lengde og likevel se
hvilken retning matrisen favoriserer? Hva skiller de to spesielle startene?

<details class="reading-step">
<summary>Gå i dybden: skaler uten å dreie</summary>

For starten $(1,0)^T$ er første steg helt konkret

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
Da er $Ax_0=x_0$ allerede ved start. Dette er et viktig unntak fra
observasjonen om linjen $x_2=x_1$, som vi forklarer i 5.2–5.3.

</details>

## 5.2 Finn de spesielle retningene

<div id="uke5-egen"></div>

### Fra geometrisk observasjon til algebra

I figuren i 5.1 ble startene langs $(1,1)^T$ og $(1,-1)^T$ liggende på
hver sin linje. Figuren normaliserte lengden etter hvert steg. Nå spør vi:
**Hva gjør transformasjonen langs disse linjene før vi normaliserer?**

Vi tar den geometriske observasjonen «samme linje» og skriver den som
algebra: resultatet må være **ett tall ganger startvektoren**. For
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

Bruk de to retningene fra figuren.

$$A=\begin{bmatrix}2&1\\1&2\end{bmatrix},\qquad
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

Matrisen $A$ tredobler lengden langs $v$ og lar $w$ være uendret.
Matrisen $B$ bytter koordinatene. For $w$ betyr dette en fortegnsendring,
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

Finn egenverdier og egenrom til
$C=\begin{bmatrix}2&1\\0&1\end{bmatrix}$. Kontroller med $Cv=\lambda v$.
Er egenvektorene ortogonale?

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
Ulike egenverdier gir ikke generelt ortogonale egenvektorer. Vi kommer til
symmetriske matriser, der dette faktisk gjelder, i 5.3.

</details>

<details class="reading-step">
<summary>Gå i dybden: undersøk også en transformasjon som snur en retning</summary>

Matrisen $B$ bytter koordinatene. Gjett hva den gjør med $(1,-1)^T$,
og bruk plottet til å kontrollere tolkningen av en negativ egenverdi.
Prøv også $(1,1)^T$ og $(1,0)^T$. Dette er en ekstra kontroll etter håndarbeidet.

```{pyodide-python}
#| label: week5-directions
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

### Prøv: hvilken del tar over?

Vi bruker samme $A$ og egenvektorene $v_1=(1,1)^T$, $v_2=(1,-1)^T$.
Starten skrives $x_0=c_1v_1+c_2v_2$. Med `c1 = c2 = 0.5` er dette
$x_0=(1,0)^T$: summen av to like lange bidrag langs de to linjene.

Ved hver multiplikasjon får det første bidraget en faktor
${\color{#1565c0}3}$ og det andre en faktor ${\color{#a04a00}1}$.
I plottet følger vi **hvor stor del av summen av bidragenes lengder** som
kommer fra hver retning. Dette er ikke koordinatene til resultatvektoren,
og heller ikke lengdene delt på lengden til summen av vektorene.

- Blå kurve: bidraget med egenverdi ${\color{#1565c0}\lambda_1=3}$.
- Oransje kurve: bidraget med egenverdi ${\color{#a04a00}\lambda_2=1}$.
- Vannrett akse: antall multiplikasjoner; ved 0 har begge andel $1/2$.

**Før kjøring:** Blir det oransje bidraget kortere, eller blir bare andelen
mindre? Kjør deretter med `c1 = 0.0`, mens `c2 = 0.5` beholdes.
Da starter vi bare langs $v_2$. Kan multiplikasjonene skape det blå bidraget?

```{pyodide-python}
#| label: week5-contributions
c1, c2 = 0.5, 0.5
steps = np.arange(7)
if c1 == 0 and c2 == 0:
    raise ValueError('Velg minst ett bidrag ulik null')
# v1 og v2 har samme lengde sqrt(2); den forkortes bort i andelene.
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
Hvis den raskest voksende delen mangler ved start, kan eksakt regning ikke
skape den. **Diskuter:** Hvorfor er både matrisen og starten viktige?

### Skriv observasjonen som algebra

Linearitet betyr at $A$ virker på hvert bidrag for seg. De to egenverdiene
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
og $c_i$ er startens koeffisient i retning $v_i$, får vi

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

**Prøv en annen start:** Hva endres hvis starten er $x_0=v_2/\sqrt2$?
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

**Hvordan finner vi koeffisientene?** For en vilkårlig start $(a,b)^T$ løser vi

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

### En forbindelse til uke 4

Matrisen $A$ er **symmetrisk**: $A^T=A$, altså uendret når rader og
kolonner bytter plass. Egenretningene i figuren står vinkelrett.
Vektorer med lengde én som står parvis vinkelrett, kalles **ortonormale**.

De normaliserte vektorene danner en ortonormal basis. Dette er en generell
mulighet for **reelle symmetriske matriser**: de har reelle egenverdier og
kan skrives

$$A=Q\Lambda Q^T.$$

Koordinatene i denne ortonormale basisen er indreproduktene
$c_i=q_i^Tx$, samlet i $c=Q^Tx$. Den ortogonale projeksjonen av $x$ på
linjen spent ut av $q_i$ er vektoren $(q_i^Tx)q_i$.
$\Lambda$ ganger koordinat $c_i$ med egenverdi $\lambda_i$, og $Q$ danner
summen av de skalerte basisbidragene. Her er $Q$ kvadratisk og inneholder en full basis.
Dette er **spektralteoremet**, oppkalt etter spekteret: egenverdiene står
på diagonalen i $\Lambda$. $Q$ har de ortonormale egenvektorene som kolonner.
**Diskuter:** Hvorfor gir indreproduktet basisens koordinater når
basisvektorene har lengde én og står vinkelrett?

<details class="reading-step">
<summary>Gå i dybden: hvorfor ortogonale egenvektorer?</summary>

**Gjenta for hånd:** Normaliser $(1,1)^T$ og $(1,-1)^T$.
Sett resultatene som kolonner i $Q$. Beregn de fire elementene i $Q^TQ$,
og beregn $Q^T(1,0)^T$. Sammenlign deretter med regningen nedenfor.

$$Q=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix},\quad
Q^TQ=\frac12\begin{bmatrix}2&0\\0&2\end{bmatrix}=I,\quad
Q^T\begin{bmatrix}1\\0\end{bmatrix}=\frac1{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}.$$

Her måler $Q^Tx$ koeffisientene i den **normaliserte** basisen.
De er $1/\sqrt2$, mens koeffisientene i basisen $(v_1,v_2)$ var $1/2$.

For $A=A^T$, $Av=\lambda v$ og $Aw=\mu w$ har vi
$\lambda v^Tw=(Av)^Tw=v^TAw=\mu v^Tw$.
Hvis $\lambda\ne\mu$, må $v^Tw=0$. Innenfor et egenrom kan vi bruke
Gram–Schmidt. Spektralteoremet sikrer at vi får nok vektorer til en full basis.

Med $z=Q^Tx$ følger også
$x^TAx=z^T\Lambda z=\sum_i\lambda_i z_i^2$.
Hvis alle egenverdiene er positive, er uttrykket positivt for alle $x\ne0$.
Dette blir nyttig når vi studerer energi og lineære systemer i uke 6.

**Les beviset ledd for ledd.** Først er $(Av)^Tw=(\lambda v)^Tw=\lambda v^Tw$.
Transponeringsregelen gir $(Av)^T=v^TA^T=v^TA$, fordi $A$ er symmetrisk.
Til slutt er $v^TAw=v^T(\mu w)=\mu v^Tw$.
Derfor er $(\lambda-\mu)v^Tw=0$. Når første faktor er ulik null,
må indreproduktet være null.

Innenfor ett egenrom virker $A$ som samme skalering på alle vektorer.
Lineærkombinasjoner laget av Gram–Schmidt blir derfor i det egenrommet.
Beviset over forklarer ortogonalitet mellom ulike egenrom; selve
spektralteoremet sikrer i tillegg at egenrommene til sammen fyller hele rommet.

I vårt eksempel gir faktoriseringen den konkrete beregningen

$$Ax=Q\begin{bmatrix}3&0\\0&1\end{bmatrix}(Q^Tx).$$

For $x=(1,0)^T$ er målingene $(1/\sqrt2,1/\sqrt2)^T$.
Etter skalering er de $(3/\sqrt2,1/\sqrt2)^T$.
Rekonstruksjonen med $Q$ gir $(2,1)^T$, akkurat som direkte multiplikasjon.

I energiuttrykket er $z\ne0$ når $x\ne0$, siden $Q$ er invertibel.
Minst ett $z_i^2$ er da positivt. Med alle $\lambda_i>0$ blir summen
$\sum_i\lambda_i z_i^2>0$. Denne egenskapen kalles **positiv definitet**: $x^TAx>0$ for alle $x\ne0$.

</details>

## 5.4 Potensmetoden

<div id="uke5-potens"></div>

### Et forsøk med farten

**Felles forsøk — forutsi, kjør cellen, les av:** Vi bruker
$A_\mu=Q\operatorname{diag}(3,\mu)Q^T$. Kolonnene i $Q$ er de normaliserte
egenvektorene fra 5.3; $\operatorname{diag}(3,\mu)$ betyr en matrise med $3$
og $\mu$ på diagonalen og null ellers.
Starten er $(1,0)^T$ i begge kjøringer.

1. Gjett om $\mu=1$ eller $\mu=2.9$ gir raskest utskilling av én retning.
2. Kjør cellen. Les av forholdet mellom bidragene etter 10 steg for hver kurve.
3. Noter hvilken kurve som først kommer under $10^{-2}$. Hvis den andre
   ikke når dit innen 80 steg, noter det også.

De to matrisene har samme egenvektorer; bare den andre skaleringen endres.

```{pyodide-python}
#| label: week5-speed
Q = np.array([[1., 1.], [1., -1.]]) / np.sqrt(2)
fig, ax = plt.subplots()
for second in [1., 2.9]:
    A = Q @ np.diag([3., second]) @ Q.T
    x = np.array([1., 0.])
    ratios = []
    for k in range(81):
        # Her kjenner vi basisen og kan måle de to bidragene.
        c = Q.T @ x
        ratios.append(abs(c[1] / c[0]))
        x = A @ x
        x = x / np.linalg.norm(x)
    ax.semilogy(range(81), np.maximum(ratios, 1e-16), label=f"λ₂ = {second}")
ax.set(xlabel="Antall multiplikasjoner", ylabel="|andre bidrag / første bidrag|",
       title="Hvor raskt blir ett bidrag dominerende?")
ax.legend()
plt.show()
```

Farten styres av den **relative** skaleringen. Forholdene er $1/3$ og
$2.9/3$. Det siste er nær én, så bidragene skiller lag langsomt.
Maskinen lagrer tall med begrenset presisjon. Forskjellen mellom det eksakte
tallet og det lagrede tallet kalles **avrunding**. Den kan til slutt dominere
det lille bidraget nederst i plottet.
**Diskuter:** Kan flere steg alltid gjøre svaret bedre, eller kan maskinens
avrunding til slutt bli større enn bidraget vi prøver å måle?

<details class="reading-step">
<summary>Gå i dybden: les konvergensplottet</summary>

Siden startkoeffisientene her er like store, forutsier teorien

$$\left|\frac{c_2^{(k)}}{c_1^{(k)}}\right|
=\left(\frac{|\mu|}{3}\right)^k,\qquad
(1/3)^{10}\approx1.69\cdot10^{-5},\quad
(2.9/3)^{10}\approx0.712.$$

Normaliseringen deler begge koeffisientene på samme tall og endrer ikke
forholdet. Derfor kan vi sammenligne kurvene direkte med denne formelen.


`c = Q.T @ x` måler de to koeffisientene i den ortonormale basisen.
`abs(c[1]/c[0])` er størrelsen på det andre bidraget relativt til det første.
Det er ikke den andre koordinaten til $x$ i standardbasisen.

Med $q=|\mu|/3$ får vi etter hvert steg ett nytt produkt med $q$.
For å nå under $10^{-2}$ må $q^k<10^{-2}$.
For $q=1/3$ er fem steg nok; for $q=2.9/3$ trengs 136 steg.
Utvid løkken og den horisontale aksen sammen dersom du vil se det siste.

På en logaritmisk vertikal akse blir
$\log(q^k)=k\log q$ en rett linje i eksakt regning.
Når det andre bidraget blir omtrent like lite som avrundingen, kan kurven
flate ut eller variere. Koden viser ikke verdier under $10^{-16}$ i plottet;
dette er en visningsgrense, ikke en bevist nedre grense for feilen.

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
starten, utviklingen i forsøket og residualen når vi vurderer resultatet.

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
$Ax=(2,1)^T$, $\rho=2$ og $r=(0,1)^T$. Matrisen gir altså også et
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

Retningen er ennå ikke en egenretning, men residualen har falt fra $1$ ved
start til $3/5$ etter ett steg.

</details>

<details class="reading-step">
<summary>Gå i dybden: implementasjonen av potensmetoden</summary>

Definisjonen kjøres automatisk. Les koden etter pseudokoden: normalisering,
Rayleigh-kvotient, residual og en øvre grense for antall steg.

```{pyodide-python}
#| label: week5-power
#| autorun: true
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
    scale = np.linalg.norm(A, 'fro')
    history = []
    for k in range(max_steps + 1):
        y = A @ x
        rho = x @ y
        residual = np.linalg.norm(y - rho * x)
        history.append((rho, residual))
        if np.linalg.norm(y) == 0:
            return x, rho, np.array(history), "Ax = 0; kan ikke normalisere"
        if residual <= tol * scale:
            return x, rho, np.array(history), "liten egenresidual"
        if k < max_steps:
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

### Forutsi fire problemtilfeller

**Prøv:** Kjør cellen og sammenlign de fire banene. Hvilke blir på samme
linje, hvilke veksler, og hvilken går rundt? Utpek ett tilfelle der en liten
residual kan gi et misvisende inntrykk av hva metoden har funnet.
Figuren viser seks steg; utskriften bruker algoritmens stoppkriterium.

| Matrise | Start før normalisering |
|---|---|
| $\operatorname{diag}(3,1)$ | $(0,1)^T$ |
| $\operatorname{diag}(-3,1)$ | $(1,1)^T$ |
| $\operatorname{diag}(1,-1)$ | $(1,1)^T$ |
| $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$ | $(1,0)^T$ |

```{pyodide-python}
#| label: week5-failures
cases = [
    ("Feil startretning", np.diag([3., 1.]), [0., 1.]),
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
    print(name, ":", status, "; ρ =", rho, "; residual =", h[-1, 1])
fig.tight_layout()
plt.show()
```

En linje kan stabilisere seg selv om vektoren skifter fortegn. Og en liten
residual kan tilhøre en annen egenverdi enn den dominante.
For å måle endring av **linje** kan vi bruke
$\min(\lVert x_{k+1}-x_k\rVert_2,\lVert x_{k+1}+x_k\rVert_2)$ for enhetsvektorer.

<details class="reading-step">
<summary>Gå i dybden: slik kan du tenke om de fire tilfellene</summary>

Gjenta de to første stegene for hånd før du følger forklaringen.

- Starten $(0,1)^T$ mangler det dominante bidraget. Residualen er null
  allerede ved start, men egenverdien er $1$, ikke $3$.
- Med $-3$ som dominant egenverdi nærmer vektorene seg samme linje og skifter
  fortegn. Rayleigh-kvotienten nærmer seg $-3$.
- For $1$ og $-1$ er forholdet mellom absoluttverdiene én. Begge bidragene
  består, og den valgte starten gir en syklus med to ulike vektorer.
- En kvart omdreining har ingen reell egenretning. Over komplekse tall er
  egenverdiene $i$ og $-i$, begge med absoluttverdi én. Her går vektoren i sirkel.

I flyttallsregning kan avrunding tilføre et lite manglende bidrag.
Den eksakte diagonale starttesten gjør det lettere å isolere prinsippet.

Regningen før normalisering viser forskjellene tydelig:

$$\begin{aligned}
\operatorname{diag}(3,1)^k(0,1)^T&=(0,1)^T,\\
\operatorname{diag}(-3,1)^k(1,1)^T&=((-3)^k,1)^T,\\
\operatorname{diag}(1,-1)^k(1,1)^T&=(1,(-1)^k)^T.
\end{aligned}$$

I andre linje blir første koordinat dominerende, men skifter fortegn.
I tredje linje er begge koordinatene alltid like store i absoluttverdi;
normalisering endrer derfor ikke syklusen.

Rotasjonen gir $(1,0)^T\mapsto(0,1)^T\mapsto(-1,0)^T\mapsto(0,-1)^T$
og tilbake til starten. For enhver reell enhetsvektor er $x^TAx=0$ her,
så $\rho=0$ og residualnormen er $\lVert Ax\rVert_2=1$.
Det er ingen reell egenvektor som metoden kan nærme seg.

</details>

### Prøv: en nesten usynlig startforskjell

Kjør cellen: kan en startendring
på $10^{-12}$ bli synlig etter bare 30 steg?

```{pyodide-python}
#| label: week5-roundoff
A = np.diag([3., 1.])
for tiny in [0., 1e-12]:
    x = np.array([tiny, 1.])
    x /= np.linalg.norm(x)
    for k in range(30):
        x = A @ x
        x /= np.linalg.norm(x)
    print("Første startkoordinat:", tiny, "→ etter 30 steg:", x)
```

Her legger vi inn en liten forstyrrelse med vilje; vi måler ikke faktisk
maskinavrunding. Forsøket viser mekanismen: en liten del i den raskest
voksende retningen kan forsterkes ved gjentakelse. Nye avrundinger kan tilføres
hver runde. **Diskuter:** Hvorfor kan to nesten like starter følge svært ulike
baner? Hvorfor hjelper ikke lengde én mot alle former for feil?

<details class="reading-step">
<summary>Gå i dybden: skill mellom startfeil og feil i hvert steg</summary>

Uten normalisering blir starten $(\varepsilon,1)^T$ til
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

## 5.5 Besøk på nettsider

<div id="uke5-nett"></div>

### Hvorfor dukker egenvektorer opp når vi rangerer nettsider?

Vi ønsker å gi hver av fire nettsider A, B, C og D et tall som beskriver
hvor mye den blir besøkt i en enkel modell. En **nettside** er et dokument
vi kan lese i nettleseren. En **lenke** er noe vi kan klikke på for å komme
fra dokumentet vi leser til et annet. Vi trenger ingen kunnskap om hvordan
nettsidene er programmert; det eneste vi bruker, er hvilke sider som lenker til hvilke.

Én idé er å telle hvor mange lenker som peker til en side. Men en lenke fra
en mye besøkt side kan føre flere besøk videre enn en lenke fra en lite
besøkt side. Da avhenger betydningen av én side av betydningen til de andre.
**Hvordan kan vi finne alle disse tallene samtidig?** Vi begynner med en
besøksregel og følger hva som skjer når den gjentas.

### Slik leser du figuren

::: {.week5-network-model}
::: {.week5-network-description}

Hvert punkt er en nettside, og bokstaven er navnet. En pil A → B betyr at
A har en lenke til B: en besøkende på A kan klikke seg til B. Den samme
lenken er **utgående fra A** og **innkommende til B**. Pilen angir bare
mulig bevegelse denne veien; en vei tilbake må ha sin egen pil.
Avstanden mellom punktene og plasseringen på skjermen har ingen betydning i modellen.

Ved hvert klikk velger den besøkende én av lenkene fra siden hen er på,
med lik sannsynlighet. **Tallene på pilene er overgangssannsynligheter:**
et tall angir sannsynligheten for å velge akkurat denne neste siden,
gitt at den besøkende er på siden pilen starter i. Fra A er det to valg,
så hver har sannsynlighet $1/2$. Fra B er C det eneste valget,
så overgangen B → C har sannsynlighet $1$.

:::
::: {.week5-network-figure}

![Tallene angir sannsynligheten for neste side, gitt siden vi er på nå.](../assets/week5-network.svg){fig-alt="Nettverk med fire nettsider og seks rettede lenker. Tallene ved lenkene angir overgangssannsynligheter."}

:::
:::

| Siden den besøkende er på | Mulige neste sider | Regelen for ett klikk |
|---|---|---|
| A | B og C | B med sannsynlighet $1/2$; C med sannsynlighet $1/2$ |
| B | C | C med sannsynlighet $1$ |
| C | A og D | A med sannsynlighet $1/2$; D med sannsynlighet $1/2$ |
| D | A | A med sannsynlighet $1$ |

### Hva betyr én runde og prosentene?

Vi forestiller oss en besøkende som fortsetter å klikke etter denne regelen.
En slik tilfeldig følge av besøk kalles en **tilfeldig vandring** (*random walk*)
på nettverket. A → C → D → A → B er ett mulig forløp. Ved et nytt forsøk
kan de tilfeldige valgene gi et annet forløp. Ett steg i vandringen er ett klikk.
Valget av neste side avhenger bare av siden den besøkende er på nå, ikke av tidligere besøk.
Vi antar foreløpig at ingen går ut av disse fire sidene, at ingen kommer
utenfra, og at lenkene ikke endres. Alle fire har minst én lenke å følge.

Prosenten ved en side angir **sannsynligheten for å være på akkurat denne
siden etter det aktuelle steget**. Den angir ikke hvor mange besøk siden har
samlet opp siden start. Ved «Alle på A» er startsannsynligheten 100 % på A;
ved «Jevn start» er den 25 % på hver side.

En enkelt besøkende kan bare være på én side om gangen. Likevel kan vi
fordele sannsynligheten mellom flere mulige steder. Alternativt kan vi
tenke på en stor gruppe uavhengige besøkende: 50 % på B betyr da den
**forventede andelen** på B. Hvis 100 personer starter på A, forventer vi
50 på B og 50 på C etter ett klikk, men et faktisk tilfeldig forsøk trenger
ikke gi nøyaktig 50 av hver.

Den interaktive figuren nedenfor regner direkte på **sannsynlighetsfordelingen**
for hvor den besøkende befinner seg etter hvert steg. Den viser altså ikke én
tilfeldig vandring og simulerer ikke enkeltpersoners tilfeldige klikk. Derfor får du samme fordeling hver gang du velger samme start.
**Neste runde** lar alle bidragene flyttes én gang etter tabellen;
**20 runder** gjentar dette 20 ganger fra fordelingen som vises nå.
Summen er alltid 100 %, fordi den besøkende må være på én av de fire sidene.

### Prøv: hvor flytter sannsynligheten seg?

Velg **Alle på A**, og trykk **Neste runde**. Les av hvilke sider som får
besøk, og bruk pilene fra A til å forklare fordelingen. Før neste klikk:
**Hvor kan besøkene fra B og C gå nå?** Se deretter hva figuren viser.

Prøv så **Jevn start** og **20 runder**. Gjenta fra **Alle på A**.
Ser det ut som startfordelingen fortsatt betyr mye, eller nærmer begge
forsøkene seg samme fordeling? Vi skal forklare observasjonen med lineær algebra.

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
lab.innerHTML='<div class="net-controls"><button type="button" class="net-even" aria-pressed="true">Jevn start</button><button type="button" class="net-all" aria-pressed="false">Alle på A</button><button type="button" class="net-step">Neste runde</button><button type="button" class="net-many">20 runder</button></div><div class="net-slot"></div><div class="net-status" role="status" aria-live="polite" aria-atomic="true"></div>';
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
  lab.querySelector('.net-status').textContent='Runde '+round+' · '+names.map(function(name,i){return name+': '+(100*distribution[i]).toFixed(1)+' %';}).join(' · ')+' · Sum: '+(100*distribution.reduce(function(a,b){return a+b;},0)).toFixed(1)+' %';
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

### Fra besøksfordeling til vektor

Vi samler sannsynlighetene i en kolonne, i den faste rekkefølgen A, B, C, D:

$$p_k=\begin{bmatrix}p_A^{(k)}\\p_B^{(k)}\\p_C^{(k)}\\p_D^{(k)}\end{bmatrix}.$$

Her er $k$ antall klikk etter start. For eksempel betyr $p_C^{(k)}=0.5$
at sannsynligheten for å være på C etter $k$ klikk er 50 %.
Elementene er ikke-negative og summerer til én; en slik vektor kalles en
**sannsynlighetsvektor**. Koordinatene er andeler, ikke plasseringen av
punktene i tegningen.

Fra «Alle på A» viser figuren de to første oppdateringene:

$$\begin{bmatrix}1\\0\\0\\0\end{bmatrix}
\longmapsto\begin{bmatrix}0\\1/2\\1/2\\0\end{bmatrix}
\longmapsto\begin{bmatrix}1/4\\0\\1/2\\1/4\end{bmatrix}.$$

Ved det andre klikket går hele B-bidraget på $1/2$ til C. C-bidraget på
$1/2$ deles i to: $1/4$ til A og $1/4$ til D. Dette er forklaringen på
prosentene vi nettopp observerte. Nå skriver vi den samme flytteregelen
som ett matriseprodukt, slik at vi kan bruke teorien fra resten av uken.

### Fra lenker til en matrise

En **overgangsmatrise** lagrer sannsynlighetene for neste klikk.
Vi lar **kolonne $j$ være siden vi går fra, og rad $i$ være siden vi går til**:
$S_{ij}$ er sannsynligheten for å gå fra $j$ til $i$.
A-kolonnen er derfor $(0,1/2,1/2,0)^T$: den viser neste fordeling hvis
hele starten er på A. Tilsvarende viser B-kolonnen hvor en start bare på B
havner. Hver kolonne er altså resultatet av å bruke regelen på én
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
I dette eksemplet nærmer vi oss
$p_*=(1/3,1/6,1/3,1/6)^T$. Den besøkende fortsetter å flytte seg, men
fordelingen er uendret: hver side får like mye sannsynlighet inn som den
sender videre. For A kommer $1/6$ fra C og $1/6$ fra D, altså $1/3$ på nytt.
**Stasjonær** betyr dermed ikke at noen har sluttet å klikke.

### Hva sier rangeringen – og hva sier den ikke?

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

**Prøv som kontroll:** Kjør cellen fra begge startene. Hvilken forskjell
måler utskriften? Kan et lite tall alene si at lenkene er lagt inn riktig?

```{pyodide-python}
#| label: week5-network
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

En stasjonær fordeling er ikke automatisk grensen for alle starter på
alle nettverk. To sider som bare lenker til hverandre, kan gi pendling.
Forsøkene i 5.6 undersøker hvorfor modellen trenger en ekstra regel.


Fra jevn start er første mottak til A $\tfrac12\cdot\tfrac14+1\cdot\tfrac14=3/8$.
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

### Bryt nettverket

Vi endrer **bare D**: siden lenker nå kun til seg selv.
**Gjett først:** D har fortsatt bare én innkommende lenke fra en annen side.
Kan D likevel ende med nesten alle besøkene?

**Felles forsøk:** Skriv forventningen for D etter 100 runder, kjør cellen,
og noter sluttverdien. Forklar så med lenkene hvorfor besøk kan komme inn
på D, men ikke slippe ut. Cellen definerer selv nettverket fra 5.5.

```{pyodide-python}
#| label: week5-trap
# Samme nettverk som i 5.5; tallene gjentas så denne fanen kan kjøres direkte.
S = np.array([[0., 0., 1/2, 1.],
              [1/2, 0., 0., 0.],
              [1/2, 1., 0., 0.],
              [0., 0., 1/2, 0.]])
trap = S.copy()
trap[:, 3] = [0., 0., 0., 1.]
p = np.ones(4) / 4
values = [p.copy()]
for k in range(100):
    p = trap @ p
    values.append(p.copy())
plt.figure()
plt.plot(values)
plt.xlabel("Runde")
plt.ylabel("Andel besøk")
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
Denne vektoren oppfyller $S_{\mathrm{felle}}p=p$ nøyaktig.
Problemet er derfor ikke nødvendigvis stor residual.

### Prøv en ny besøksregel

La besøkende følge en lenke med sannsynlighet $\alpha$, og ellers hoppe til
en tilfeldig side. **Hva tror du skjer når $\alpha$ senkes fra $0.95$ til
$0.5$?**

**Felles forsøk:** Noter om D får større eller mindre andel når flere
besøkende hopper tilfeldig. Kjør cellen etter felleforsøket og sammenlign
D for $0.95$, $0.85$ og $0.5$. Undersøk samtidig om noen sider får score null.

```{pyodide-python}
#| label: week5-teleport
# Kjør felleforsøket først. u fordeler de tilfeldige hoppene likt.
u = np.ones(4) / 4
fig, ax = plt.subplots()
for alpha in [0.5, 0.85, 0.95]:
    p = u.copy()
    for k in range(500):
        p = alpha * (trap @ p) + (1-alpha) * u
    ax.plot(list("ABCD"), p, 'o-', label=f"α = {alpha}")
ax.set(xlabel="Side", ylabel="Stasjonær andel besøk", title="En utvei fra fellen")
ax.legend()
plt.show()
```

### Bygg matematikken fra besøksregelen

Hoppene gir en vei ut. For en sannsynlighetsvektor $p_k$ er oppdateringen

$$p_{k+1}=\alpha Sp_k+(1-\alpha)u,$$

Her bruker vi $S$ for den valgte lenkemodellen, inkludert fellen.
Vektoren $u$ er sannsynlighetsvektoren for tilfeldige hopp. I forsøket er alle
elementene $1/4$, slik at hver side er like sannsynlig.
Her er $n$ antall sider, og $\mathbf1$ er kolonnen med $n$ ettall.
De tilfeldige hoppene kalles **teleportering**. Hele besøksregelen kan også
samles i én overgangsmatrise:

$$G=\alpha S+(1-\alpha)u\mathbf1^T.$$

Matrisen $G$ kalles **Google-matrisen**, og dens stasjonære sannsynlighetsvektor er
**PageRank-vektoren**. $\alpha$ er dempingsfaktoren; større $\alpha$ gir
lenkene mer vekt. Det innebærer et modellvalg, ikke bare et valg av regnefart.

**Hva hvis en side ikke har lenker?** En nullkolonne mister besøk og er
ikke stokastisk. Erstatt den med $u$ **før** du lager $G$. Dette er behandlingen
av en **hengende node**. Den skiller seg fra en side som lenker til seg selv:
selvlenken bevarer besøkene, men kan fange dem.

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
positiv andel, og gjentatte oppdateringer fra enhver startfordeling nærmer seg den.
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
&=\alpha Sp_k+(1-\alpha)u-igl(\alpha Sp_*+(1-\alpha)u\bigr)\\
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

**Diskuter:** Kan vi ha en liten residual uten å ha den egenverdien vi var
ute etter? Kan en rangering være beregnet nøyaktig og likevel være lite nyttig?
Bruk ett forsøk fra uken som eksempel.

<details class="reading-step">
<summary>Gå i dybden: oppgaver med egen begrunnelse</summary>

Løs på papir først, og bruk Python som kontroll der det passer.
Åpne «Slik kan du tenke» etter at du har prøvd selv.

1. Finn egenverdier og egenrom til $\begin{bmatrix}4&0\\0&-2\end{bmatrix}$.
   Forutsi $A^kx_0$ fra $x_0=(1,1)^T$. Hva gjør normalisering med bildet?
2. Bruk $C$ fra 5.2. Skriv $(2,1)^T$ i en egenvektorbasis og finn $C^k(2,1)^T$.
3. Lag en startvektor som gir null egenresidual uten å finne den dominante
   egenverdien til $\operatorname{diag}(5,2)$. Forklar hvorfor testen godtar den.
4. To sider lenker bare til hverandre. Prøv start $(1,0)^T$ og $(1/2,1/2)^T$.
   Finn begge egenverdiene. Finnes en entydig stasjonær sannsynlighetsvektor?
   Konvergerer begge startene til den?
5. En tredje side har ingen utgående lenker. Forklar hvordan du bygger
   kolonnen dens, og hvorfor teleportering alene ikke reparerer en nullkolonne.

<details class="learning-hint">
<summary>Slik kan du tenke</summary>

1. Egenverdier $4,-2$, koordinataksene er egenrommene. Vektoren er
   $(4^k,(-2)^k)^T$; den normaliserte retningen nærmer seg første akse.
2. $(2,1)^T=3(1,0)^T-(1,-1)^T$, så svaret er
   $3\cdot2^k(1,0)^T-(1,-1)^T$.
3. Start med $(0,1)^T$: egenverdien er $2$, og residualen er null.
4. Matrisen er $\begin{bmatrix}0&1\\1&0\end{bmatrix}$, med egenverdier $1,-1$.
   Den eneste stasjonære sannsynlighetsvektoren er $(1/2,1/2)^T$, men første
   start veksler mellom sidene. Entydighet alene sikrer ikke konvergens.
5. Erstatt nullkolonnen med $u$. Hvis du beholder nullkolonnen, får den
   tilsvarende kolonnen i $G$ sum $1-\alpha$, ikke én.

**Mellomregning til oppgave 2:** Med $v_1=(1,0)^T$, $v_2=(1,-1)^T$ løser vi
$c_1v_1+c_2v_2=(2,1)^T$. Andre koordinat gir $-c_2=1$, altså $c_2=-1$.
Første gir $c_1+c_2=2$, altså $c_1=3$. Siden $Cv_1=2v_1$ og $Cv_2=v_2$,
er resultatet $C^k(2,1)^T=(3\cdot2^k-1,1)^T$.

**Mellomregning til oppgave 4:** Stasjonaritet gir $p_1=p_2$.
Sammen med $p_1+p_2=1$ gir dette nøyaktig én sannsynlighetsvektor.
Men fra $(1,0)^T$ blir resultatene $(0,1)^T,(1,0)^T,\ldots$.
Den andre egenverdien $-1$ bevarer størrelsen på avviket fra likevekt og
snur fortegnet hver gang. Dette er grunnen til at entydighet ikke er nok.

</details>

</details>

I [prosjekt 5](project_week5.qmd) skal du bygge og kontrollere en rangering,
diagnostisere et problem og gjennomføre en egen undersøkelse. Ta med disse
spørsmålene: **Oppfyller svaret likningen? Konvergerer metoden? Måler modellen
det vi ønsket?** De er tre forskjellige spørsmål.

:::
