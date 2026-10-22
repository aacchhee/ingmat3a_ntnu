::: {.panel-tabset}

## 5.0 Hva overlever?

::: {#uke5-start}
:::

### Ukens spørsmål: hva overlever når vi ganger med den samme matrisen om og om igjen?

Tenk deg at du bruker den samme lineære transformasjonen på en vektor, igjen
og igjen. Vektoren blir kanskje lengre, men hva skjer med *retningen*?
Denne uken oppdager vi at noen helt spesielle retninger, egenvektorene,
tar over. Og vi skal se at akkurat den samme ideen kan rangere nettsider ut
fra lenkene mellom dem. Det er ideen bak Googles PageRank.

- [En retning vokser fram](#uke5-erfaring): et forsøk der du ser én retning ta over.
- [Finn de spesielle retningene](#uke5-egen): egenverdier og egenvektorer, regnet for hånd.
- [Basis og gjentakelse](#uke5-basis): hvorfor den største egenverdien vinner, og spektralteoremet.
- [Potensmetoden](#uke5-potens): en algoritme som finner den dominerende retningen, og Rayleigh-kvotienten.
- [PageRank](#uke5-nett) og [en felle og en utvei](#uke5-google): rangering som gjentatt matrisemultiplikasjon.

Etter uken skal du kunne forklare gjentatt multiplikasjon med bidrag langs
egenvektorer, bruke potensmetoden og Rayleigh-kvotienten, og regne ut en
PageRank-fordeling for et lite nettverk.

### To deler: hente fram og bygge videre

| Matematikk 1 – dette henter vi fram | Matematikk 3A – dette bygger vi nå |
|---|---|
| Løse lineære likningssystemer; finne egenverdier og egenvektorer. Håndregning i 5.2. | Forklare gjentatt multiplikasjon med bidrag langs egenvektorer, og undersøke når én retning dominerer. Forsøk i 5.1, teori i 5.3–5.4. |
| Bruke $(A-\lambda I)v=0$ til å finne alle egenvektorene til en egenverdi. | Knytte egenvektorbasis til tidligere arbeid med basis og ortogonalitet, og bruke dette i potensmetoden og PageRank (5.3–5.6). |

Du trenger ikke huske regneoppskriftene før første forsøk. Vi henter dem
fram i håndeksempelet i 5.2. Oppgavene i **5.8 Hovedløp** bruker ukens
nye ideer. **5.7 Støtteløp** gir repetisjon av lineære systemer, egenverdier og
egenvektorer ved behov. Du trenger ikke gjøre hele støtteløpet før hovedløpet.

## 5.1 En retning vokser fram

::: {#uke5-erfaring}
:::

Vi starter med et forsøk, ikke med en definisjon. Matrisen

$$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$$

beskriver en lineær transformasjon $T(x)=Ax$ av planet. Hva skjer hvis vi
bruker den samme transformasjonen igjen og igjen på en startvektor?

Lengden vokser fort, så figuren deler på lengden etter hvert steg.
Å **normalisere** betyr å dele en vektor på lengden sin, slik at den får
lengde én. Da ser vi bare retningen. Den oransje pilen er startvektoren
$x_0$, den blå er vektoren $x_k$ etter $k$ steg. Målet er å finne ut om
ulike startvektorer ender i samme retning, og om noen retninger aldri
endrer seg i det hele tatt.

### Eksperiment 1 – hvilken retning blir igjen?

- Velg **(1, 0)** og trykk **Ett steg** fem ganger. Hvilken linje nærmer den blå pilen seg?
- Velg **(−1, 0)** og deretter **(0, 1)**. Samme linje? Samme orientering?
- Velg **(1, 1)** og **(1, −1)**. Endres retningen i det hele tatt?
  Prøv til slutt **(1, −0.9)**, som ligger nær $(1,-1)$.

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

**Hva viser forsøket?** For mange startvektorer nærmer de normaliserte
vektorene $x_k$ seg samme **linje**, gjennom $(1,1)^T$. Fra $(1,0)$ og
$(-1,0)$ havner pilen på samme linje, men med motsatt orientering.
Med startvektor langs $(1,1)^T$ eller $(1,-1)^T$ endres retningen ikke i
det hele tatt. Fra $(1,-0.9)$, som ligger nær $(1,-1)^T$, drar pilen
likevel bort og ender også på linjen gjennom $(1,1)^T$. Nå undersøker vi hva
transformasjonen gjør langs disse to spesielle linjene.

Vi samler multiplikasjon og normalisering i én oppdateringsregel:

$$F(x)=\frac{Ax}{\lVert Ax\rVert_2},\qquad x_{k+1}=F(x_k).$$

Her er $\lVert x\rVert_2$ vektorens vanlige lengde, og $k$ teller stegene.
Regelen er definert når $Ax\ne0$.

Etter $k$ steg er $x_k=A^kx_0/\lVert A^kx_0\rVert_2$, med $A^0=I$:
normaliseringene underveis forkortes bort (se fordypningen under).

**Diskuter:** Hvorfor kan vi miste informasjon om lengde og likevel se
hvilken retning som dominerer etter gjentatt transformasjon? Hva skiller de to spesielle startvektorene?

::: {.reading-step title="Gå i dybden: skaler uten å dreie"}

**Kjenner dere igjen formen fra [uke 2](page4.qmd#fikspunkt-og-konvergens)?**
Da sendte vi et tall inn i en regel og brukte svaret som neste verdi.
Hva er likt nå, og hva er annerledes? Hvilken likning må en vektor
oppfylle hvis neste steg skal gi akkurat samme vektor? Vi svarer i 5.4.

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

:::

## 5.2 Finn de spesielle retningene

::: {#uke5-egen}
:::

**Matematikk 1: hent fram egenverdier og egenvektorer.** Her repeterer vi
betydningen og regnemetoden, med full håndregning i håndeksempelet.

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
egenvektorer med samme egenverdi. Samlingen av egenverdier kalles
matrisens **spektrum**; for $A$ er spekteret $\{3,1\}$.

For en bestemt egenverdi $\lambda$ samler vi **alle** vektorer som oppfyller
likningen i **egenrommet**

$$E_\lambda=\{v:Av=\lambda v\}=\operatorname{Null}(A-\lambda I).$$

Det er et underrom og inneholder også nullvektoren. De øvrige vektorene i
rommet er egenvektorer. Her er $E_3=\operatorname{span}\{(1,1)^T\}$ og
$E_1=\operatorname{span}\{(1,-1)^T\}$: to linjer gjennom origo.

Men så langt har vi bare *sjekket* retninger vi så i figuren. Hvordan
finner vi egenverdiene og egenvektorene når vi ikke har en figur å gjette ut fra?

::: {.callout-note title="Håndeksempel: finn egenverdiene og egenvektorene uten å gjette"}

**Utgangspunkt.** I figuren fant vi retningene $(1,1)^T$ og $(1,-1)^T$ ved
å prøve. Nå finner vi dem med regning for $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$.

**Prøv selv.** Skriv $Av=\lambda v$ som $(A-\lambda I)v=0$. Når kan et
slikt system ha en løsning $v\ne0$?

**Regnegangen.** Siden $Iv=v$, er $Av=\lambda v$ det samme som
$Av-\lambda Iv=0$, altså $(A-\lambda I)v=0$. Vi vil ha $v\ne0$. Da må
$A-\lambda I$ være singulær, for ellers kunne vi gange med inversen og få
$v=0$. For en $2\times2$-matrise er $\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc$, så

$$\begin{aligned}
\det(A-\lambda I)=\det\begin{bmatrix}2-\lambda&1\\1&2-\lambda\end{bmatrix}
&=(2-\lambda)^2-1\\
&=\lambda^2-4\lambda+3=(\lambda-3)(\lambda-1)=0.
\end{aligned}$$

Egenverdiene er altså $\lambda=3$ og $\lambda=1$. Vi setter inn én om gangen:

- $\lambda=3$: $\begin{bmatrix}-1&1\\1&-1\end{bmatrix}\begin{bmatrix}v_1\\v_2\end{bmatrix}=0$
  gir $-v_1+v_2=0$, altså $v_2=v_1$ og $v=t(1,1)^T$.
- $\lambda=1$: $\begin{bmatrix}1&1\\1&1\end{bmatrix}\begin{bmatrix}v_1\\v_2\end{bmatrix}=0$
  gir $v_1+v_2=0$, altså $v_2=-v_1$ og $v=t(1,-1)^T$.

Kontroll: $A(1,1)^T=(3,3)^T=3(1,1)^T$ og $A(1,-1)^T=(1,-1)^T$.

**Dette tar vi med oss.** $\lambda$ er en egenverdi akkurat når $A-\lambda I$
er singulær, altså når $\det(A-\lambda I)=0$. Er $\lambda$ *ikke* en
egenverdi, er $A-\lambda I$ invertibel. Egenrommet er nullrommet til
$A-\lambda I$ fra [uke 3](uke3.qmd#uke3-del3). Den samme regningen bruker vi på Hessianer i uke 8 og 9.

:::

**Øv på dette:** [egenverdier og egenvektorer for hånd](#uke5-oppg-egen) i støtteløpet.

::: {.reading-step title="Gå i dybden: flere detaljer i håndregningen"}

**Hvorfor utelates nullvektoren?** $A0=\lambda0$ gjelder for alle $\lambda$,
så nullvektoren identifiserer ingen spesiell retning. Ordet **spektral**
betyr at vi beskriver noe ved hjelp av egenverdiene. Fortegnet til en
egenverdi forteller om orientering, og absoluttverdien om lengdeskalering.
Et egenrom kan også ha høyere dimensjon; for identitetsmatrisen er hele
rommet egenrommet til egenverdien 1.

**Hvorfor singulær?** Hvis $A-\lambda I$ var invertibel, kunne vi multiplisere
$(A-\lambda I)v=0$ med inversen og få $v=0$. Vi leter etter $v\ne0$.
Derfor må matrisen være singulær, det vil si at kolonnene er lineært avhengige
og at determinanten er null. Dette knytter egenverdiberegningen til nullrom i [uke 3](uke3.qmd#uke3-del3).

**Utvid kvadratet.** I eksemplet er $a=d=2-\lambda$ og $b=c=1$:

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

Her er $t$ fritt. **Egenrommet** er hele nullrommet til $A-\lambda I$,
inkludert $t=0$. **Egenvektorene** er løsningene med $t\ne0$.
Velger du $t=2$, er $(2,2)^T$ en like god egenvektor for $3$ som $(1,1)^T$.
Velger du $t=1/\sqrt2$, får du en egenvektor med lengde én.
Normalisering velger en representant; den endrer ikke egenverdien.
Kontroller alltid svaret i den opprinnelige likningen $Av=\lambda v$.

På store matriser bruker vi numeriske algoritmer fremfor å utvide store
determinantpolynomer. Håndregningen her forklarer hva algoritmene leter etter.

:::

::: {.reading-step title="Gå i dybden: koordinatbyttet – Bx = x, Bx = −x eller en ny linje?"}

**Kan samme transformasjon la én vektor være uendret, snu en annen og
sende en tredje til en annen linje?** Undersøk koordinatbyttet
$R(x_1,x_2)=(x_2,x_1)$, representert ved
$B=\begin{bmatrix}0&1\\1&0\end{bmatrix}$, og sammenlign med $A$.
Målet er å skille mellom **positiv egenverdi, negativ egenverdi og en
startvektor som ikke er en egenvektor**.

**Først for hånd**, med $v=(1,1)^T$ og $w=(1,-1)^T$. Skriv hvert svar som
et tall ganger startvektoren. Ikke normaliser.

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
men vektoren ligger fortsatt på samme linje gjennom origo: egenverdien er $-1$.

**Så med figuren.** For hver startvektor: forutsi først hvor $Bx$ ligger,
og bruk deretter figuren som kontroll.

1. Sett `start = [1., -1.]`. Er $Bx=x$, $Bx=-x$ eller ingen av delene?
   Ligger $Ax$ på samme linje som $Bx$, og peker de samme vei?
2. Sett `start = [1., 1.]`. Hvilket tall $\lambda$ oppfyller $Bx=\lambda x$?
3. Sett `start = [1., 0.]`. Finnes det noe tall $\lambda$ slik at
   $Bx=\lambda x$? Begrunn svaret med koordinatene, ikke bare med tegningen.

Cellen tegner startvektoren og resultatet for begge matrisene, uten
normalisering, slik at både lengde og orientering er synlige.

```{pyodide-python}
#| label: week5-directions
# Endre bare startvektoren: blir resultatet på samme linje, og endres lengde eller fortegn?

A = np.array([[2., 1.], [1., 2.]])
B = np.array([[0., 1.], [1., 0.]])
start = np.array([1., -1.])  # Prøv også [1., 1.] og [1., 0.].
print("Ax =", A @ start, "  Bx =", B @ start)
plot_before_after({"A": A, "B": B}, start)
```

**Formuler konklusjonen:** Hva skiller det å snu orienteringen på samme
linje fra det å sende vektoren til en annen linje?

:::

::: {.reading-step title="Gå i dybden: egenretninger som ikke står vinkelrett"}

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

:::

## 5.3 Basis og gjentakelse

::: {#uke5-basis}
:::

**Matematikk 3A: hvorfor nærmer iterasjonsfølgene seg samme linje fra ulike startvektorer?**
I 5.1 valgte vi startvektoren $x_0=(1,0)^T$. Ved gjentatt anvendelse av
transformasjonen $T(x)=Ax$, med normalisering etter hvert steg, nærmet
vektorene $x_k$ seg linjen gjennom $(1,1)^T$.
I 5.2 fant vi de to egenretningene. Nå bruker vi dem til å dele startvektoren
i to bidrag og følge hvert bidrag når transformasjonen gjentas.

Med $v_1=(1,1)^T$ og $v_2=(1,-1)^T$ kan startvektoren bygges slik:

$$x_0=\begin{bmatrix}1\\0\end{bmatrix}
={\color{#1565c0}\underbrace{\tfrac12\begin{bmatrix}1\\1\end{bmatrix}}_{c_1v_1}}
+{\color{#a04a00}\underbrace{\tfrac12\begin{bmatrix}1\\-1\end{bmatrix}}_{c_2v_2}}.$$

Etter $k$ anvendelser av transformasjonen, før normalisering, er bidragene

$${\color{#1565c0}b_1(k)=c_1\,3^k v_1},\qquad
{\color{#a04a00}b_2(k)=c_2\,1^k v_2},\qquad
A^kx_0=b_1(k)+b_2(k).$$

Ved hvert steg tredobles lengden til $b_1(k)$, mens $b_2(k)$ beholder lengden.
For å se hvilket bidrag som bestemmer retningen, regner cellen ut hvor stor
**andel** hvert bidrag har av summen av de to lengdene:

$${\color{#1565c0}a_1(k)=
\frac{\lVert b_1(k)\rVert_2}{\lVert b_1(k)\rVert_2+\lVert b_2(k)\rVert_2}},
\qquad
{\color{#a04a00}a_2(k)=
\frac{\lVert b_2(k)\rVert_2}{\lVert b_1(k)\rVert_2+\lVert b_2(k)\rVert_2}}.$$

Nevneren er summen av de to lengdene, ikke lengden av summen $b_1(k)+b_2(k)$.
For $c_1=c_2=1/2$ starter begge andelene på $1/2$, og de summerer alltid til 1.
Målet er å se hvilket av de to bidragene som tar over, og om det andre
bidraget virkelig forsvinner.

### Eksperiment 2 – hvilken del tar over?

- Kjør med `c1 = c2 = 0.5`. Blir det oransje bidraget kortere,
  eller blir det bare mindre sammenlignet med det blå?
- Sett deretter `c1 = 0.0` og behold `c2 = 0.5`.
  Nå mangler bidraget langs $v_1$ i startvektoren. Kan $b_1(k)$ bli ulik null?

```{pyodide-python}
#| label: week5-contributions
# Lengdene av b1(k) og b2(k), delt på den felles lengden sqrt(2) til v1 og v2.
# Forutsi kurvene før du kjører.

c1, c2 = 0.5, 0.5
steps = np.arange(7)
first = abs(c1) * 3.**steps
second = abs(c2) * 1.**steps
shares = np.column_stack([first, second]) / (first + second)[:, None]
print("Lengden av b₂(k)/√2:", second)
print("Andelen a₂(k):     ", np.round(shares[:, 1], 4))
plot_shares(steps, {"λ₁ = 3, λ₂ = 1": shares})
```

**Hva viser forsøket?** Den oransje *andelen* går mot null, men den oransje
*lengden* er hele tiden den samme. Bidraget langs $(1,-1)^T$ forsvinner
altså ikke. Det blir bare lite sammenlignet med bidraget langs $(1,1)^T$,
som tredobles i hvert steg. Er $c_1=0$, forblir det blå bidraget null:
uten et bidrag langs den dominante egenvektoren fra start kan det ikke vokse fram.

### Skriv observasjonen som algebra

Linearitet betyr at transformasjonen virker på hvert bidrag for seg:
$A(c_1v_1+c_2v_2)=c_1Av_1+c_2Av_2$. De to egenverdiene
brukes én gang for hvert steg; vi lar potensene stå synlige:

$$\begin{aligned}
Ax_0&=\tfrac12{\color{#1565c0}3}\,v_1+\tfrac12{\color{#a04a00}1}\,v_2=(2,1)^T,\\
A^2x_0&=\tfrac12{\color{#1565c0}3^2}\,v_1+\tfrac12{\color{#a04a00}1^2}\,v_2=(5,4)^T,\\
A^3x_0&=\tfrac12{\color{#1565c0}3^3}\,v_1+\tfrac12{\color{#a04a00}1^3}\,v_2=(14,13)^T.
\end{aligned}$$

Den oransje koeffisienten er hele tiden $\tfrac12$, mens den blå tredobles.

### Fra dette eksemplet til teorien

En **basis** ([uke 3](uke3.qmd#uke3-del2)) lar oss skrive enhver vektor entydig som en sum av bidrag
langs basisvektorene. Hvis egenvektorene $v_1,\ldots,v_n$ er en basis,
og $c_i$ er startvektorens koeffisient i retning $v_i$, får vi

$$x_0=\sum_{i=1}^n c_iv_i,
\qquad A^kx_0=\sum_{i=1}^n c_i\lambda_i^kv_i.$$

Matrisen kalles da **diagonaliserbar**. Egenverdien $\lambda_1$ er
**dominant** når $|\lambda_1|>|\lambda_i|$ for alle $i>1$.
Hvis $c_1\ne0$, vokser dens bidrag relativt til de andre. Forholdet
$|\lambda_2/\lambda_1|$, med egenverdiene sortert etter absoluttverdi,
forklarer farten etter mange steg: nær én betyr langsom utskilling.

::: {.reading-step title="Gå i dybden: hvorfor kan vi behandle bidragene hver for seg?"}

Over skrev vi $Ax_0$, $A^2x_0$ og $A^3x_0$ som summer langs $v_1=(1,1)^T$ og
$v_2=(1,-1)^T$: i hvert steg får hvert bidrag en ny faktor, $3$ langs $v_1$ og
$1$ langs $v_2$. Etter $k$ steg er

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

:::

### Fra projeksjon i uke 4 til egenvektorbidrag

I [uke 4.2](uke4.qmd#uke4-projeksjon) fant vi den ortogonale projeksjonen av en vektor $x$
på en linje med enhetsvektor $q$. Vi skilte mellom **ett tall** og **en vektor**:

$$\underbrace{c=q^Tx}_{\text{koordinaten langs }q},\qquad
\underbrace{p=(q^Tx)q=cq}_{\text{projeksjonen på linjen gjennom }q}.$$

Nå bruker vi de samme projeksjonene på de to normaliserte egenretningene:

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

Figuren viser dette for $x=(1,0)^T$. Til venstre er $x$ summen av de to
projeksjonene. Til høyre er det blå bidraget tredoblet og det oransje
uendret, og summen er $Ax=(2,1)^T$. Cellen regner ut koordinatene
$q_1^Tx$ og $q_2^Tx$ og kontrollerer summen mot $Ax$.

```{pyodide-python}
#| label: week5-eigen-split
# Del x i bidrag langs q1 og q2, skaler hvert bidrag med sin egenverdi, og legg sammen.
A = np.array([[2., 1.], [1., 2.]])
q1 = np.array([1., 1.]) / np.sqrt(2)
q2 = np.array([1., -1.]) / np.sqrt(2)
x = np.array([1., 0.])            # Prøv også [0., 1.] eller [1., -1.].
c1, c2 = q1 @ x, q2 @ x
print("koordinatene:", c1, c2)
print("3*c1*q1 + 1*c2*q2 =", 3*c1*q1 + 1*c2*q2, "  A @ x =", A @ x)
show_eigen_split(A, x)
```

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

Hvorfor står egenvektorene vinkelrett? Med $A^T=A$ gir en regning på fire
linjer $(\lambda-\mu)v^Tw=0$, så egenvektorer til ulike egenverdier er
ortogonale (se fordypningen under). At det alltid finnes nok egenvektorer
til en hel basis, tar vi som et kjent resultat.

**En følge vi bruker i uke 6 og 9.** Skriver vi $x=\sum_ic_iq_i$ i
egenvektorbasisen, er $Ax=\sum_i\lambda_ic_iq_i$. Siden $q_i^Tq_j$ er 1 når
$i=j$ og 0 ellers, blir $x^TAx=\sum_i\lambda_ic_i^2$. Derfor er $A$
**positivt definitt**, altså $x^TAx>0$ for alle $x\ne0$, akkurat når alle
egenverdiene er positive. Og for alle $x$ er
$x^TAx\ge\lambda_{\min}\lVert x\rVert_2^2$, der $\lambda_{\min}$ er den
minste egenverdien. Regningen står i fordypningen under, trinn 4.

**Øv på dette:** [koordinater i en egenvektorbasis](#uke5-oppg-koordinater)
og [gjentatt transformasjon i en egenvektorbasis](#uke5-oppg-potenser).

::: {.reading-step title="Gå i dybden: fra projeksjonskoordinater til spektralteoremet"}

Vi følger ett eksempel hele veien: $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ og
$x=(1,0)^T$. Deretter undersøker vi hva symmetrien garanterer generelt.

I uke 4 kunne $Q$ inneholde en basis for bare et underrom; da var $QQ^Tx$
projeksjonen på dette underrommet. **Her er basisen fullstendig**, så
$QQ^Tx=x$ for alle $x$ og $QQ^T=I$.

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

Innenfor samme egenrom kan vi bruke [Gram–Schmidt fra uke 4](uke4.qmd#uke4-gs); alle
lineærkombinasjonene forblir i egenrommet. Spektralteoremet sier i tillegg
at det finnes nok egenvektorer til en basis for hele rommet.
Dette siste utsagnet er ikke bevist av regningen ovenfor.

**4. En følge vi bruker i uke 6 og 9**

For en reell symmetrisk matrise skriver vi $x=Qc$, der $c=Q^Tx$. Da gir
$Q^TQ=I$ og $A=Q\Lambda Q^T$ at

$$x^TAx=c^TQ^TQ\Lambda Q^TQc=c^T\Lambda c=\sum_i\lambda_i c_i^2.$$

Er alle egenverdiene positive, er summen positiv for enhver $x\ne0$,
fordi minst én koordinat $c_i$ da er ulik null. Matrisen kalles da
**positivt definitt**. Omvendt gir $x=q_i$ at $c=e_i$ og $x^TAx=\lambda_i$,
så positivt definitt krever at alle $\lambda_i>0$. Dermed er en reell
symmetrisk matrise positivt definitt **akkurat når** alle egenverdiene er positive.

Siden $Q^TQ=I$, er $\sum_ic_i^2=\lVert c\rVert_2^2=c^TQ^TQc=\lVert x\rVert_2^2$.
Hvert ledd ligger mellom $\lambda_{\min}c_i^2$ og $\lambda_{\max}c_i^2$, så

$$\lambda_{\min}\lVert x\rVert_2^2\le x^TAx\le\lambda_{\max}\lVert x\rVert_2^2.$$

I uke 6 bruker vi egenskapen til å knytte løsningen av et lineært system
til et entydig minimum, og i uke 9 til å vise at en kvadratisk funksjon vokser
langt ute.

:::

## 5.4 Potensmetoden

::: {#uke5-potens}
:::

I denne fanen møter du eksperiment 3 om farten, potensmetoden med
Rayleigh-kvotienten, og eksperiment 4. Tilfelle 2 og 3 i eksperiment 4 er
**fortegnsforsøket** som prosjekt 5 viser til.

I eksperiment 2 vant bidraget med egenverdi 3 fordi det ble tredoblet i
hvert steg, mens det andre bare ble ganget med 1. Men hva om de to
egenverdiene ligger nær hverandre? Da vokser begge bidragene nesten like fort.

Vi beholder egenvektorene fra 5.3 og bytter bare ut den minste egenverdien,
$\mu$. Transformasjonen er $A_\mu=Q\operatorname{diag}(3,\mu)Q^T$, der
kolonnene i $Q$ er de ortonormale egenvektorene $q_1,q_2$. Vi sammenligner
$\mu=1$ og $\mu=2.9$, begge fra startvektoren $x_0=(1,0)^T$. Cellen regner ut
de samme andelene $a_1(k)$ og $a_2(k)$ som i eksperiment 2. Blå er $a_1$,
oransje er $a_2$; heltrukket er $\mu=1$ og stiplet er $\mu=2.9$.
Målet er å se hva som bestemmer *farten* når én retning tar over.

### Eksperiment 3 – hva bestemmer farten?

- Forutsi hvilket kurvepar som raskest nærmer seg andelene 1 og 0.
- Kjør cellen og sammenlign de to oransje kurvene etter 10 steg.
- Omtrent hvor mange steg trengs før hver oransje kurve kommer under 0.1?

```{pyodide-python}
#| label: week5-speed
# Samme andelsmål og farger som i eksperiment 2; bare mu varierer.
Q = np.array([[1., 1.], [1., -1.]]) / np.sqrt(2)   # kolonnene q1 og q2
steps = np.arange(81)
curves = {}
for mu in [1., 2.9]:
    A = Q @ np.diag([3., mu]) @ Q.T
    x = np.array([1., 0.])
    shares = []
    for k in steps:
        lengths = np.abs(Q.T @ x)     # |q_i^T x| er lengden av bidraget langs q_i
        shares.append(lengths / lengths.sum())
        x = A @ x
        x = x / np.linalg.norm(x)     # felles normalisering endrer ikke andelene
    curves[f"μ = {mu}"] = shares
    print(f"μ = {mu}: a₂ etter 10 steg =", shares[10][1])
plot_shares(steps, curves, title='Samme startvektor, ulik avstand mellom egenverdiene')
```

**Hva viser forsøket?** For $\mu=1$ er den oransje andelen nesten borte
etter 10 steg, mens den for $\mu=2.9$ fortsatt er over 0.4. Når $\mu$ ligger
nær 3, vokser begge bidragene nesten like mye ved hvert steg, og det tar
lang tid før det ene tar over. Det er **forholdet mellom egenverdiene**,
$\mu/3$, som bestemmer farten.

::: {.reading-step title="Gå i dybden: knytt andelskurvene til egenverdiene"}

Startvektoren har like store koordinater langs $q_1$ og $q_2$.
Etter $k$ multiplikasjoner er forholdet mellom bidragenes lengder derfor

$$R_k=\frac{\lVert b_2(k)\rVert_2}{\lVert b_1(k)\rVert_2}
=\left(\frac{|\mu|}{3}\right)^k.$$

Forholdet $R_k$ og andelen $a_2(k)$ er ulike størrelser. Del teller og
nevner i andelsformelen på $\lVert b_1(k)\rVert_2$:

$${\color{#1565c0}a_1(k)=\frac{1}{1+R_k}},\qquad
{\color{#a04a00}a_2(k)=\frac{R_k}{1+R_k}}.$$

Ved $k=0$ er begge andelene $1/2$. Etter 10 steg er den oransje andelen
omtrent $0.0000169$ for $\mu=1$, men $0.416$ for $\mu=2.9$.

For å få $a_2(k)<0.1$ må

$$\frac{R_k}{1+R_k}<0.1\quad\Longleftrightarrow\quad R_k<\frac19.$$

Dette gir 3 steg for $\mu=1$ og 65 steg for $\mu=2.9$. For $\mu=1$ er
andelen nøyaktig 0.1 ved $k=2$, så kurven berører grensen allerede der.
Kontroller med potensuttrykket for $R_k$.

Dette minner om [konvergensfarten i uke 2.2–2.3](page4.qmd#uke2-helning):
der ble en liten feil omtrent ganget med $|g'(r)|$ ved hvert steg.
Her gjelder den eksakte skaleringen $R_{k+1}=(|\mu|/3)R_k$ for forholdet
mellom bidragene. En faktor nær én gir langsom endring i begge tilfeller.

I koden beregner vi koordinatene fra de itererte vektorene, ikke direkte
fra potensformelen. Avrunding kan derfor påvirke svært små bidrag.
Den lineære andelsaksen gjør sammenligningen med eksperiment 2 direkte,
men viser ikke slike små avvik tydelig.

:::

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

Ett steg består av multiplikasjon og normalisering:

$$y_k=Ax_k,\qquad x_{k+1}=\frac{y_k}{\lVert y_k\rVert_2}.$$

### Potensmetoden som fikspunktiterasjon

I [uke 2.1](page4.qmd#fikspunkt-og-konvergens) brukte vi
$x_{k+1}=g(x_k)$ for å nærme oss et tall $r$ med $g(r)=r$.
Oppdateringen $x_{k+1}=F(x_k)$ med $F(x)=Ax/\lVert Ax\rVert_2$ fra 5.1
har samme form, bare for vektorer: potensmetoden er en **fikspunktiterasjon**.
Et **fikspunkt** $F(x_*)=x_*$ betyr

$$Ax_*=\lVert Ax_*\rVert_2\,x_*,$$

altså at $x_*$ er en enhetsegenvektor med **positiv** egenverdi. Om
følgen nærmer seg et fikspunkt, avgjør egenverdiene og bidragene i startvektoren.

::: {#uke5-rayleigh}
:::

### Fra projeksjon til et anslag for egenverdien

Potensmetoden finner først en mulig egenvektorretning $x$. Vi trenger
også en skalering: **hvilket tall $t$ gjør $tx$ til den beste tilnærmingen
til $Ax$?** Vi søker altså den ortogonale projeksjonen av $Ax$ på linjen
$\operatorname{span}\{x\}$, ikke på en av koordinataksene.

Fra [uke 4](uke4.qmd#uke4-projeksjon) er projeksjonen av en vektor $b$ på linjen gjennom $x\ne0$
lik $\frac{x^Tb}{x^Tx}x$. Med $b=Ax$ blir projeksjonen $\rho(x)x$, der

$$\rho(x)=\frac{x^TAx}{x^Tx},\qquad r=Ax-\rho(x)x,\qquad x^Tr=0.$$

$\rho$ kalles **Rayleigh-kvotienten** og er koeffisienten som minimerer
$\|Ax-tx\|_2$ over alle tall $t$. **Egenresidualen** $r$ er den delen av
$Ax$ som står vinkelrett på $x$ og derfor ikke kan beskrives som en skalering
av $x$.

::: {.callout-note title="Håndeksempel: skalering og rest før og etter ett steg"}

**Utgangspunkt.** $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$. Vi sammenligner
startvektoren $x_0=(1,0)^T$ med første normaliserte steg $x_1=(2,1)^T/\sqrt5$ fra 5.1.

**Prøv selv.** Regn ut $Ax_0$, $\rho(x_0)$ og $r_0$ før du leser videre.

**Regnegangen.** Begge vektorene har lengde én, så $\rho=x^TAx$.

- $x_0$: $Ax_0=(2,1)^T$ og $\rho=x_0^TAx_0=1\cdot2+0\cdot1=2$.
  Resten er $r_0=(2,1)^T-2(1,0)^T=(0,1)^T$, med $\lVert r_0\rVert_2=1$.
- $x_1$: $Ax_1=\dfrac1{\sqrt5}\begin{bmatrix}2\cdot2+1\\2+2\cdot1\end{bmatrix}=\dfrac{(5,4)^T}{\sqrt5}$ og
  $\rho=x_1^TAx_1=\dfrac{2\cdot5+1\cdot4}{5}=\dfrac{14}{5}$.
  Resten er
  $$r_1=Ax_1-\tfrac{14}{5}x_1=\frac1{5\sqrt5}\Bigl(\begin{bmatrix}25\\20\end{bmatrix}-\begin{bmatrix}28\\14\end{bmatrix}\Bigr)
  =\frac1{5\sqrt5}\begin{bmatrix}-3\\6\end{bmatrix},$$
  med $\lVert r_1\rVert_2=\dfrac{\sqrt{9+36}}{5\sqrt5}=\dfrac{\sqrt{45}}{5\sqrt5}=\dfrac35$.
- Kontroll: $x_1^Tr_1=\tfrac1{25}\bigl(2\cdot(-3)+1\cdot6\bigr)=0$. Resten står vinkelrett på $x_1$.

**Dette tar vi med oss.** Etter ett steg er $\rho$ nærmere egenverdien 3
(fra 2 til 2.8), og resten har krympet fra 1 til 3/5. For
$x=(1,1)^T/\sqrt2$ er $\rho=3$ og $r=0$: da er $x$ en egenvektor.

:::

Figuren viser projeksjonen av $Ax$ på linjen gjennom $x$: den grønne pilen
er $\rho x$, og den stiplede er resten $r$, som står vinkelrett på $x$.
Cellen regner ut $\rho$ og $r$ for $x_0$ fra håndeksempelet.

```{pyodide-python}
#| label: week5-rayleigh
# Rayleigh-kvotienten og egenresidualen for én vektor x.
A = np.array([[2., 1.], [1., 2.]])
x = np.array([1., 0.])            # Prøv også [2., 1.] og [1., 1.].
rho = (x @ A @ x) / (x @ x)
r = A @ x - rho * x
print("ρ =", rho, "  r =", r, "  xᵀr =", x @ r)
show_rayleigh(A, x)
```

**Hva forteller kontrollen?** Liten $\|r\|_2$ betyr at egenvektorlikningen
nesten er oppfylt. Det sier ikke at vi har funnet den dominante egenverdien:
retningen med egenverdi 1 gir også null residual. Derfor ser vi både på
startvektoren, utviklingen i forsøket og residualen når vi vurderer resultatet.

::: {.reading-step title="Gå i dybden: hvorfor akkurat denne kvotienten?"}

Vi prøver å beskrive $Ax$ ved én vektor $\rho x$ på linjen gjennom $x$.
Projeksjonskoeffisienten minimerer $\lVert Ax-tx\rVert_2$ over tall $t$.
Vi kan også finne den ved ortogonalitetskravet fra [uke 4](uke4.qmd#uke4-projeksjon):

$$x^T(Ax-\rho x)=0
\quad\Longrightarrow\quad
x^TAx-\rho x^Tx=0
\quad\Longrightarrow\quad
\rho=\frac{x^TAx}{x^Tx}.$$

For en enhetsvektor blir dette $\rho=x^TAx$. For en generell matrise gir
en liten residual heller ikke alene en garanti for at vektoren ligger nær en
bestemt eksakt egenvektor.

**Fikspunkt.** Normaliseringen gjør $F$ til en ikke-lineær avbildning,
selv om $x\mapsto Ax$ er lineær. I 5.4 så vi at et fikspunkt er en
enhetsegenvektor med positiv egenverdi. Omvendt er enhver enhetsegenvektor med
positiv egenverdi $\lambda$ et fikspunkt, fordi $F(v)=\lambda v/\lambda=v$.

**Fikspunktresidual og egenresidual er ulike.** I
[uke 2.4](page4.qmd#uke2-residual) målte vi
fikspunktresidualen $g(x)-x$. Her måler vi egenresidualen
$Ax-\rho x$, som kontrollerer en annen likning.
For en enhetsegenvektor $v$ med negativ egenverdi er $F(v)=-v$ og
$F(-v)=v$. Iterasjonen veksler da mellom to vektorer på samme linje:
linjen er uendret, men vektoren er ikke et fikspunkt.
Egenresidualen er null, mens fikspunktresidualen er $F(v)-v=-2v$.
Derfor kan potensmetoden ha funnet en egenvektor selv om neste normaliserte
vektor har motsatt fortegn. Dette ser vi i eksperiment 4.

En residual er en vektor; residualnormen er ett tall. I koden lagrer vi
både $\rho$ og residualnormen, ikke hele residualvektoren.

:::

::: {.reading-step title="Gå i dybden: implementasjonen av potensmetoden"}

Definisjonen kjøres automatisk. Les koden etter pseudokoden: normalisering,
Rayleigh-kvotient, residual og en øvre grense for antall steg.

```{pyodide-python}
#| label: week5-power
#| autorun: true
# Potensmetoden følger en retning; normalisering hindrer at lengden vokser ukontrollert.
# Rayleigh-kvotienten anslår egenverdien, mens egenresidualen kontrollerer Av ≈ rho*v.

# Definer funksjonen som brukes i de korte forsøkene nedenfor.
def power_iteration(A, x0, tol=1e-10, max_steps=500):
    A = np.asarray(A, dtype=float)
    x = np.array(x0, dtype=float)
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
alle kvadrerte matriseelementer. **Toleransen** `tol` angir hvor liten relativ
residual vi krever: stoppkravet er
$\lVert r\rVert_2/\lVert A\rVert_F\le\text{tol}$ for $A\ne0$.
En felles skalering av $A$ skalerer både teller og nevner like mye.
`max_steps` hindrer at et ikke-konvergerende forsøk fortsetter uten grense.

Hvis $Ax=0$, er $x$ allerede en egenvektor for null, men vi kan ikke utføre
neste normalisering. Meldingen forklarer dette særtilfellet.

:::

Nå prøver vi potensmetoden på matrisen fra 5.1, med startvektoren $(1,0)^T$.
Funksjonen `power_iteration` er skrevet ferdig i fordypningen over og er
allerede lastet inn. Den gjør nøyaktig stegene i pseudokoden og stopper når
egenresidualen er liten. Kjør cellen og sammenlign $\rho$ med egenverdien 3 fra 5.2.

```{pyodide-python}
#| label: week5-power-demo
# Funksjonen returnerer både et forslag (x, rho) og en kontroll (status, residual).
A = np.array([[2., 1.], [1., 2.]])
x, rho, history, status = power_iteration(A, [1., 0.])
print(status, "ρ =", rho, "x =", x)
print("egenresidual:", history[-1, 1])
```

Potensmetoden virket fint i eksperiment 3 og her. Men den bygger på to
forutsetninger: én egenverdi er størst i absoluttverdi, og startvektoren
har et bidrag langs den tilhørende egenvektoren. Nå bryter vi
forutsetningene én om gangen, med enkle matriser der vi kan regne alt for hånd.
I alle fire tilfellene bruker vi samme oppdatering
$x_{k+1}=Ax_k/\lVert Ax_k\rVert_2$. Målet er å se at «retningen
stabiliseres», «vi har funnet en egenvektor» og «vi har funnet den største
egenverdien» er tre forskjellige påstander.

### Eksperiment 4 – når stabiliseres ikke retningen?

| Tilfelle | Matrise for transformasjonen | Startvektor før normalisering | Spørsmål før kjøring |
|---|---|---|---|
| Manglende dominant bidrag | $\operatorname{diag}(3,1)$ | $(0,1)^T$ | Kan første koordinat bli ulik null? |
| Negativ dominant egenverdi | $\operatorname{diag}(-3,1)$ | $(1,1)^T$ | Hva skjer med fortegnet til første koordinat ved hvert steg? |
| Like store absoluttverdier | $\operatorname{diag}(1,-1)$ | $(1,1)^T$ | Kan ett av de to bidragene dominere det andre? |
| Rotasjon | $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$ | $(1,0)^T$ | Hva skjer når en kvart omdreining gjentas? |

- Forutsi: hvilket tilfelle gir samme vektor ved hvert steg?
- Hvilket nærmer seg én linje uten å nærme seg én bestemt enhetsvektor?
- Hvilke gir en gjentakende syklus? Kjør og sammenlign.

Hvert punkt i figuren er endepunktet til en normalisert vektor $x_k$,
for $k=0,\ldots,6$; strekene forbinder påfølgende punkter, og like punkter
ligger oppå hverandre.
Utskriften kommer fra en egen kjøring av `power_iteration` med inntil 100 steg,
så den kan rapportere et annet antall steg enn de seks som tegnes.

```{pyodide-python}
#| label: week5-failures
# Fire tilfeller som utfordrer forutsetningene for potensmetoden.
cases = [
    ("Manglende dominant bidrag", np.diag([3., 1.]), [0., 1.]),
    ("Negativ dominant", np.diag([-3., 1.]), [1., 1.]),
    ("Lik absoluttverdi", np.diag([1., -1.]), [1., 1.]),
    ("Rotasjon", np.array([[0., -1.], [1., 0.]]), [1., 0.]),
]
orbits = {}
for name, A, start in cases:
    x = np.array(start) / np.linalg.norm(start)
    points = [x]
    for k in range(6):
        x = A @ x
        x = x / np.linalg.norm(x)
        points.append(x)
    orbits[name] = points
    _, rho, h, status = power_iteration(A, start, max_steps=100)
    print(name, ":", status, "; steg =", len(h)-1, "; ρ =", rho, "; residual =", h[-1, 1])
plot_orbits(orbits)
```

**Hva viser forsøket?** Hvert tilfelle bryter en annen forutsetning.

**1. Manglende dominant bidrag: riktig egenvektor, men feil egenverdi for målet vårt.**
Fra $x_0=(0,1)^T$ er $Ax_0=x_0$. Første koordinat forblir null, så
iterasjonen kan ikke utvikle et bidrag langs egenvektoren til egenverdi 3.
Den returnerer egenverdi 1 med residual null. Kontrollen bekrefter et
egenpar, men bekrefter ikke at egenverdien er størst i absoluttverdi.

**2. Negativ dominant egenverdi: linjen stabiliseres, orienteringen veksler.**
Før normalisering er $A^k(1,1)^T=((-3)^k,1)^T$. Første koordinat dominerer
og skifter fortegn, så vektorene nærmer seg vekselvis $(1,0)^T$ og
$(-1,0)^T$ på samme egenlinje. $\rho$ nærmer seg $-3$ og residualen null,
selv om vektorene ikke konvergerer mot ett punkt.

**3. Like store absoluttverdier: ingen av bidragene blir dominerende.**
Vektorene veksler mellom $(1,1)^T/\sqrt2$ og $(1,-1)^T/\sqrt2$: to
forskjellige linjer. Bidragene beholder lengden; bare fortegnet til det
andre endres. $\rho=0$ og residualen er 1 (utskriften kan vise et tall
som 4e-17 for $\rho$; det er 0 pluss avrunding).

Tilfelle 2 og 3 kaller vi **fortegnsforsøket**: en negativ egenverdi får
bidraget til å skifte fortegn ved hvert steg. I tilfelle 3 er størrelsen
$|-1|=1$, så vekslingen fortsetter for alltid. Hva som skjer når den
negative egenverdien har absoluttverdi mindre enn én, ser du i fordypningen
om pendling i 5.6 og i prosjekt 5.

**4. Rotasjon: ingen reell egenlinje å nærme seg.**
Hver multiplikasjon dreier vektoren $90^\circ$, så iterasjonen besøker fire
punkter og starter på nytt. Ingen reell ikke-null vektor oppfyller $Ax=\lambda x$.

**Diskuter:** Hvorfor er det tre forskjellige spørsmål om vektorene
konvergerer, om linjen de spenner ut stabiliseres, og om vi har funnet
egenverdien med størst absoluttverdi? Bruk tilfelle 1 og 2 som eksempler.

**Øv på dette:** [ett steg av potensmetoden for hånd, og programmer potensmetoden](#uke5-oppg-potensmetode).

::: {.reading-step title="Gå i dybden: beregn forløpene og skill mellom vektor og linje"}

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

**Rotasjonen.** Den gir $(1,0)^T\mapsto(0,1)^T\mapsto(-1,0)^T\mapsto(0,-1)^T$
og deretter startvektoren igjen. For enhver reell enhetsvektor står $Ax$
vinkelrett på $x$, så $\rho=x^TAx=0$ og $\lVert Ax-\rho x\rVert_2=1$.
Determinantlikningen er $\lambda^2+1=0$,
som ikke har reelle løsninger. Over komplekse tall er egenverdiene $i$ og $-i$.

**Sykler.** I [uke 2.3](page4.qmd#lokalt-globalt-og-raskt) så vi at en iterasjon
kan nærme seg en 2-syklus i stedet for et fikspunkt.
Tilfelle 2 og 3 viser samme skille for vektorer: to tilstander gjentas
eller nærmes vekselvis, selv om ett enkelt grensepunkt mangler.

Tilfelle 1 beskriver eksakt regning. Avrunding kan i andre beregninger
tilføre et lite bidrag som mangler matematisk. Her brukes en diagonalmatrise
og en eksakt nullkoordinat for å isolere mekanismen. Den neste fordypningen
undersøker hva som skjer når startvektoren får et lite bidrag langs den
dominante egenretningen.

:::

::: {.reading-step title="Gå i dybden: kan en liten startforskjell vokse?"}

I tilfelle 1 i eksperiment 4 ble iterasjonsfølgen værende langs $(0,1)^T$, selv om
egenverdien $3$ tilhører retningen $(1,0)^T$. Startvektoren hadde **nøyaktig null**
bidrag i denne retningen. **Hvor følsom er denne konklusjonen for en liten endring
i startvektoren?** Dette er relevant når startdata ikke er helt nøyaktige.
Målet er å se om en nesten manglende retning oppfører seg som en helt manglende.

Vi bruker fortsatt $A=\operatorname{diag}(3,1)$ og sammenligner startvektorene
$(0,1)^T$ og $(10^{-12},1)^T$, begge normalisert til lengde én.
Cellen gjør 30 steg med multiplikasjon og normalisering og skriver ut
de to vektorene. Vil de fortsatt være nesten like? Prøv deretter 10 og
20 steg: når blir forskjellen tydelig?

```{pyodide-python}
#| label: week5-roundoff
# Bare første startkoordinat endres; matrisen og antall steg holdes faste.
# 1e-12 er en bevisst innlagt forstyrrelse, ikke en måling av maskinens avrundingsfeil.

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

$$\frac{|(x_k)_1|}{|(x_k)_2|}=3^k|\varepsilon|.$$

For $\varepsilon=10^{-12}$ og $k=30$ er forholdet
$3^{30}10^{-12}\approx206$. Den opprinnelig lille delen dominerer.
Et bidrag som er nøyaktig null, forblir null i dette eksemplet.
Et lite bidrag som ikke er null, kan etter tilstrekkelig mange steg dominere.

**Startfeil og feil i hvert steg.** Her er $10^{-12}$ en bevisst innlagt
forstyrrelse av startdata. For en unormalisert beregning med lokal
avrundingsfeil $\delta_k$ i steg $k$, skriv $\widehat y_{k+1}=A\widehat y_k+\delta_k$.
Feilen mot eksakt regning oppfyller da $e_{k+1}=Ae_k+\delta_k$.
Etter $k$ steg blir den

$$e_k=A^ke_0+\sum_{j=0}^{k-1}A^{k-1-j}\delta_j.$$

Hver lokal feil virker videre gjennom de neste multiplikasjonene. Stor
absoluttverdi av en egenverdi kan forsterke et feilbidrag i egenretningen.
Formelen gjelder den unormaliserte beregningen; normalisering endrer feillikningen,
men fjerner ikke mekanismen med relativ vekst mellom retningene.

:::

## 5.5 PageRank

::: {#uke5-nett}
:::

### Fra lenker til en rangering

**Hvordan kan lenkene fortelle oss hvilke nettsider som er viktige?**
Vi vil gi hver side et tall og **rangere** sidene fra høyest til lavest verdi.
En lenke kan tolkes som en anbefaling, men en lenke fra en side mange besøker,
bør telle mer enn en lenke fra en side få besøker.

**PageRank** bygger på denne ideen. Vi lar en tenkt besøkende følge lenkene
fra side til side. En side regnes som viktig hvis den besøkende ofte havner der.

::: {.week5-network-model}
::: {.week5-network-description}

Vi begynner med de fire nettsidene A–D i figuren. En pil A → B betyr at A
har en lenke til B. Den besøkende velger én av lenkene på siden hen er på,
med lik sannsynlighet, og åpner siden lenken peker til.
Dette **lenkeklikket er ett steg** i besøksmodellen.

Fra A er det to valg: B og C, hver med sannsynlighet $1/2$.
Fra B er C det eneste valget. Tallene på pilene er
**overgangssannsynligheter**: sannsynligheten for neste side, gitt siden
den besøkende er på nå. Punktenes plassering i tegningen påvirker ikke regelen.

En slik tilfeldig følge av besøk, for eksempel A → B → C → D → A,
kalles en **tilfeldig vandring** (*random walk*).

:::
::: {.week5-network-figure}

![Lenkene og sannsynligheten for neste side.](../assets/week5-network.svg){fig-alt="A til B og C: 1/2 hver. B til C: 1. C til A og D: 1/2 hver. D til A: 1."}

:::
:::

En tilfeldig vandring gir én side ved hvert steg. For å undersøke hvilke
sider besøksregelen favoriserer, følger vi i stedet
**sannsynlighetsfordelingen**: fire tall som angir sannsynligheten for å
være på A, B, C og D etter et bestemt antall steg. Tallene summerer til
100 %. De beskriver dette tidspunktet, ikke antall besøk samlet over tid.

Figuren regner ut fordelingen direkte; den trekker ikke en enkelt
besøkendes rute. **100 % på A** betyr sikker start på A, og **25 % på hver
side** betyr tilfeldig startside. **Beregn ett steg** oppdaterer fordelingen
for ett lenkeklikk. Målet er å se om startsiden betyr noe for rangeringen
når den besøkende har klikket seg rundt lenge.

### Eksperiment 5 – gir ulike startfordelinger samme rangering?

- Velg **100 % på A**. Forutsi med pilene hvilke sider som er mulige etter
  ett steg, og trykk **Beregn ett steg** to ganger.
- Start på nytt med **100 % på A** og trykk **Beregn 20 steg**.
  Hvilke sider ser ut til å få høyest rang?
- Gjenta fra **25 % på hver side**. Påvirker startvalget rangeringen etter mange steg?

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
lab.innerHTML='<div class="net-controls"><button type="button" class="net-even" aria-pressed="true">25 % på hver side</button><button type="button" class="net-all" aria-pressed="false">100 % på A</button><button type="button" class="net-step">Beregn ett steg</button><button type="button" class="net-many">Beregn 20 steg</button></div><div class="net-slot"></div><div class="net-status" role="status" aria-live="polite" aria-atomic="true"></div>';
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
  lab.querySelector('.net-status').textContent='Steg k = '+round+' · '+names.map(function(name,i){return name+': '+(100*distribution[i]).toFixed(1)+' %';}).join(' · ')+' · Sum: '+(100*distribution.reduce(function(a,b){return a+b;},0)).toFixed(1)+' %';
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

**Hva viser forsøket?** Etter 20 steg er fordelingen nesten den samme fra
begge startene: A og C har omtrent 33.3 %, B og D omtrent 16.7 %.
Startvalget ser ikke ut til å påvirke rangeringen etter mange steg.
Nå forklarer vi hvorfor, med en matrise.

### Fra besøksregelen til et matriseprodukt

Vi samler sannsynlighetene i en kolonnevektor, i rekkefølgen A, B, C, D:

$$p_k=(p_A^{(k)},p_B^{(k)},p_C^{(k)},p_D^{(k)})^T.$$

Her teller $k$ stegene i modellen. For eksempel er $p_0=(1,0,0,0)^T$
når startsiden sikkert er A. En vektor med ikke-negative elementer og sum
én kalles en **sannsynlighetsvektor**.

Besøksregelen lagres i en **overgangsmatrise** $S$.
Elementet $S_{ij}$ er sannsynligheten for å gå fra side $j$ til side $i$:
**kolonnen er siden vi går fra, og raden er siden vi går til**.
Kolonne A blir derfor $(0,1/2,1/2,0)^T$.

$$S=\begin{array}{c|rrrr}
 & A&B&C&D\\\hline
 A&0&0&1/2&1\\
 B&1/2&0&0&0\\
 C&1/2&1&0&0\\
 D&0&0&1/2&0
\end{array},\qquad p_{k+1}=Sp_k.$$

Matriseproduktet vekter hver kolonne med sannsynligheten for å være på
avsendersiden og summerer bidragene til hver mottaker.
For eksempel mottar A halvparten av bidraget fra C og hele bidraget fra D.
Bidraget fra en side er proporsjonalt med sannsynligheten for å være der,
og deles likt mellom sidens utgående lenker.

Tenk på 1000 besøkende som følger regelen samtidig. Er 400 av dem på C, går
halvparten, altså 200, videre til A og 200 til D. Sannsynlighetene i $p$ kan
leses som slike andeler, og $Sp$ regner ut de nye andelene.

Alle kolonnene har ikke-negative elementer og sum én.
En slik matrise kalles **kolonnestokastisk**. Oppdateringen $p\mapsto Sp$
bevarer summen i $p$.

Hvorfor bevares summen? La $\mathbf1=(1,1,1,1)^T$. Summen av elementene i
$p$ er $\mathbf1^Tp$, og kolonnesum én betyr $\mathbf1^TS=\mathbf1^T$.
Da er $\mathbf1^T(Sp)=(\mathbf1^TS)p=\mathbf1^Tp=1$. Siden $S$ og $p$ har
ikke-negative elementer, har også $Sp$ det. Gjentar vi oppdateringen, får vi $p_k=S^kp_0$: samme gjentatte
matrisemultiplikasjon som tidligere i uken, nå uten normalisering av lengden.

### Når fordelingen ikke lenger endres

I forsøket nærmet de to startfordelingene seg samme fordeling.
En fordeling som er uendret ved neste steg, kalles **stasjonær**.
Dette er et **fikspunkt**, slik som i [uke 2.1](page4.qmd#fikspunkt-og-konvergens),
nå for oppdateringen $p\mapsto Sp$.
Vi markerer den med en stjerne:

$$Sp_*=p_*=1p_*.$$

Her møter vi egenvektorene igjen: $p_*$ er en egenvektor med egenverdi
**1**, skalert til sum én. Iterasjonen $p_{k+1}=Sp_k$ er dermed både
en fikspunktiterasjon og en variant av potensmetoden fra 5.4.
Her bevares summen én av besøksregelen, så vi trenger ingen ekstra
normalisering. Men vi kan også finne $p_*$ direkte, uten å iterere.

::: {.callout-note title="Håndeksempel: den stasjonære fordelingen for fire sider"}

**Utgangspunkt.** Vi leter etter en sannsynlighetsvektor
$p=(p_A,p_B,p_C,p_D)^T$ med $Sp=p$.

**Prøv selv.** Skriv opp én likning per rad i $S$. Hvilken likning er
enklest å starte med?

**Regnegangen.** Radene i $S$ gir

$$p_A=\tfrac12p_C+p_D,\quad p_B=\tfrac12p_A,\quad p_C=\tfrac12p_A+p_B,\quad p_D=\tfrac12p_C.$$

- Andre likning: $p_B=\tfrac12p_A$.
- Sett inn i tredje: $p_C=\tfrac12p_A+\tfrac12p_A=p_A$.
- Fjerde: $p_D=\tfrac12p_C=\tfrac12p_A$.
- Første likning stemmer nå av seg selv: $\tfrac12p_A+\tfrac12p_A=p_A$.

Alle løsninger er $t(1,\tfrac12,1,\tfrac12)^T$. Summen er $3t$, så kravet
«sum én» gir $t=\tfrac13$ og

$$p_*=(1/3,\,1/6,\,1/3,\,1/6)^T.$$

**Dette tar vi med oss.** $Sp=p$ bestemmer en egenretning med egenverdi 1.
Kravet «sum én» velger den ene vektoren på linjen som er en
sannsynlighetsfordeling. I prosjekt 5 bygger du $S$ for seks sider på samme måte.

:::

Rangerer vi etter disse sannsynlighetene, deler A og C førsteplassen,
mens B og D deler neste plass. Den besøkende fortsetter å følge lenker;
det er sannsynlighetene som er uendret.

Dette er et mål på **viktighet under besøksregelen**; modellen kjenner
ikke innholdet. Og likningen $Sp_*=p_*$ alene sier ikke at alle
startfordelinger nærmer seg $p_*$. Det undersøker vi i 5.6.

**Øv på dette:** [stasjonære fordelinger for to og tre sider](#uke5-oppg-stasjonaer).

::: {.reading-step title="Gå i dybden: fra lenkeklikk til matriseprodukt"}

Én besøkende er på én side om gangen. Etter ett steg fra A er
sannsynligheten $1/2$ for B og $1/2$ for C.
Starter mange uavhengige besøkende på A, er dette også de forventede
andelene på B og C. De faktiske andelene i et tilfeldig forsøk kan avvike.

De to første oppdateringene fra A gir

$$\underbrace{\begin{bmatrix}1\\0\\0\\0\end{bmatrix}}_{p_0}
\longmapsto\underbrace{\begin{bmatrix}0\\1/2\\1/2\\0\end{bmatrix}}_{p_1}
\longmapsto\underbrace{\begin{bmatrix}1/4\\0\\1/2\\1/4\end{bmatrix}}_{p_2}.$$

Ved det andre steget går hele B-bidraget på $1/2$ til C.
C-bidraget på $1/2$ deles i to: $1/4$ til A og $1/4$ til D.

Generelt er $S_{ij}$ sannsynligheten for å gå til $i$ når vi er på $j$.
Produktet $S_{ij}p_j$ er derfor sannsynligheten for både å være på $j$ nå
og gå videre til $i$. Siden avsendersidene utelukker hverandre, summerer
vi bidragene:

$$(Sp)_i=\sum_j S_{ij}p_j.$$

Dette er rad-ganger-kolonne-regelen. Vi kan også lese produktet kolonnevis:
$Sp$ er summen av kolonnene i $S$, vektet med koordinatene i $p$.
Kolonne $j$ er $Se_j$, der $e_j$ er standardbasisvektoren som betyr sikker
start på side $j$. Slik kjenner vi igjen matriserepresentasjonen av en
lineær transformasjon fra tidligere uker.

**Prøv for hånd:** Start med $p=(1/4,1/4,1/4,1/4)^T$.
Til A kommer $\tfrac12\cdot\tfrac14+1\cdot\tfrac14=3/8$.
Kontroller de andre radene og få $Sp=(3/8,1/8,3/8,1/8)^T$.

Oppdateringen sender altså sannsynlighetsvektorer til
sannsynlighetsvektorer, som vi viste over. Vi trenger ikke dele på vektorlengden.
Merk forskjellen på kolonne- og radsummer: $\mathbf1^TS=\mathbf1^T$
betyr ikke $S\mathbf1=\mathbf1$. Rad A summerer til $3/2$, fordi den
samler bidrag fra forskjellige avsendere.

:::

::: {.reading-step title="Gå i dybden: hvorfor har S egenverdi 1, og en kontroll med kode"}

Kolonnesummene viser dessuten at $S^T\mathbf1=\mathbf1$.
Dermed har $S^T$ egenverdi én. En matrise og dens transponerte har samme
karakteristiske polynom $\det(S-\lambda I)$, så også $S$ har egenverdi én.
Dette argumentet alene sier ikke at $S^kp_0$ konvergerer.

**Kontroller med kode:** Kjør cellen fra begge startfordelingene.
Sammenlign resultatet med den eksakte løsningen $p_*=(1/3,1/6,1/3,1/6)^T$. Utskriften måler
største koordinatendring ved neste steg. Hvorfor kan et lite tall
bekrefte at fordelingen er nesten stasjonær uten å bekrefte at vi la inn
riktige lenker?

```{pyodide-python}
#| label: week5-network
# Kolonne j er avsender, rad i er mottaker; S @ p gir neste fordeling.
# Velg 25 % på hver side eller 100 % på A som startfordeling; sammenlign etter 40 steg.
# Summen skal forbli 1 uten normalisering av vektorlengden.

S = np.array([[0., 0., 1/2, 1.],
              [1/2, 0., 0., 0.],
              [1/2, 1., 0., 0.],
              [0., 0., 1/2, 0.]])
p = np.ones(4)/4  # Prøv np.array([1., 0., 0., 0.]).
for k in range(40):
    p = S @ p
print("A, B, C, D:", p)
print("Sum:", p.sum(), "største endring ved neste steg:", np.max(abs(S @ p-p)))
```

:::

## 5.6 En felle og en utvei

::: {#uke5-google}
:::

I 5.5 ga lenkene en fornuftig rangering, og begge startfordelingene vi prøvde, endte likt.
Men lenkene på ekte nettsider er ikke alltid så snille. **Kan en side få
høyest verdi bare fordi besøkende ikke kommer seg videre?**
Vi beholder nettverket fra 5.5, men endrer **bare lenken fra D**:
D → A blir D → D, så den eneste lenken på D fører tilbake til D selv.
Det endrer bare én kolonne i $S$. Cellen kjører den samme oppdateringen
$p_{k+1}=Sp_k$ som før, fra 25 % på hver side, og tegner sannsynligheten
for hver side mot antall steg. Målet er å se at en fordeling kan være
stasjonær og likevel gi en rangering vi ikke vil ha.

### Eksperiment 6 – kan én side fange besøkene?

- Gjett først: D har fortsatt bare én innkommende lenke fra en annen side.
  Hvordan utvikler sannsynligheten for D seg?
- Kjør cellen. Hvilke veier fører til D, og hvilke fører ut igjen?
- Hva blir rangeringen etter mange steg?

```{pyodide-python}
#| label: week5-trap
# S_net er lenkematrisen S fra 5.5 (ligger i oppsettet).
# Vi endrer bare kolonne 3: lenkene UT fra D.
trap = S_net.copy()
trap[:, 3] = [0., 0., 0., 1.]   # D lenker bare til seg selv
p = np.ones(4) / 4
values = [p]
for k in range(100):
    p = trap @ p
    values.append(p)
print("Etter 100 steg (A, B, C, D):", np.round(p, 4))
plot_history(values, title="Besøkene slipper ikke ut av D")
```

**Hva viser forsøket?** D er blitt en **felle**: den besøkende kan komme
dit, men lenkene gir ingen utvei. Fordelingen nærmer seg $(0,0,0,1)^T$,
slik at D får all vekt i rangeringen. D kommer øverst fordi siden holder
på besøkene, ikke fordi mange anbefaler den.

Regningen konvergerer altså til en stasjonær fordeling, men besøksregelen
gir et lite nyttig mål på viktighet. En liten residual $Sp-p$ viser at $p$
omtrent oppfyller modellens likning; den kan ikke bekrefte at modellen
måler det vi ønsker.

::: {.reading-step title="Gå i dybden: en korrekt løsning for en uheldig besøksregel"}

Kall den endrede overgangsmatrisen $S_{\mathrm{felle}}$.
Endringen D → A til D → D bytter siste kolonne fra $(1,0,0,0)^T$ til
$(0,0,0,1)^T$. Den nye D-raden gir

$$p_D^{(k+1)}=\tfrac12p_C^{(k)}+p_D^{(k)}\geq p_D^{(k)}.$$

Sannsynlighet på D blir der, mens C kan sende mer inn.
For $p=(0,0,0,1)^T$ får vi nøyaktig

$$S_{\mathrm{felle}}p=p,\qquad r=S_{\mathrm{felle}}p-p=0.$$

En null residual bekrefter stasjonaritet. At D får all vekt, følger av
lenkene vi valgte. En selvlenke er altså noe annet enn mangel på lenker:
her finnes et lenkevalg, men det gir ingen utvei.

:::

Vi gir den besøkende en ny mulighet. Ved hvert steg velger hen mellom to handlinger:

- Med sannsynlighet $\alpha$ følger hen en lenke etter regelen vi allerede har.
- Med sannsynlighet $1-\alpha$ velger hen neste side uavhengig av lenkene,
  med lik sannsynlighet blant A–D. Også nåværende side kan velges.

Det siste kalles **teleportering**. Ett steg i denne modellen kan altså
være et lenkeklikk eller et tilfeldig hopp.
**Dempingsfaktoren** $\alpha$ bestemmer hvor stor vekt lenkene får.
Når $\alpha=0.85$, er sannsynligheten 85 % for et lenkeklikk og 15 % for et hopp.
**Hoppfordelingen** $u=(1/4,1/4,1/4,1/4)^T$ beskriver hvor hoppet lander.
Cellen bruker fellen fra eksperiment 6 og gjør 500 steg med regelen
$p\mapsto\alpha\,(\text{lenkesteg})+(1-\alpha)u$ for tre verdier av $\alpha$.
Målet er å se om hoppene gir alle sidene en positiv verdi, og hvor mye
valget av $\alpha$ betyr.

### Eksperiment 7 – hva endres når vi kan hoppe ut?

- Gjett først: hvordan endres verdien til D når vi gjør hopp vanligere?
- Kjør cellen og sammenlign $\alpha=0.95$, $0.85$ og $0.5$.
- Hvor stor vekt beholder D, og får de andre sidene positiv sannsynlighet?

```{pyodide-python}
#| label: week5-teleport
# alpha er sannsynligheten for å følge en lenke; 1-alpha er sannsynligheten for et hopp.
trap = S_net.copy()
trap[:, 3] = [0., 0., 0., 1.]   # samme felle som i eksperiment 6
u = np.ones(4) / 4              # hoppene fordeles likt
results = {}
for alpha in [0.5, 0.85, 0.95]:
    p = u.copy()
    for k in range(500):
        p = alpha * (trap @ p) + (1-alpha) * u
    results[alpha] = p
    print(f"α = {alpha}: A, B, C, D =", np.round(p, 3))
plot_distributions(results)
```

**Hva viser forsøket?** D beholder fortsatt mest, men nå får alle sidene
positiv sannsynlighet. Jo vanligere hopp, desto mindre vekt på D: omtrent
0.38 ved $\alpha=0.5$, 0.67 ved $\alpha=0.85$ og 0.86 ved $\alpha=0.95$.
Rekkefølgen D, C, A, B er den samme for alle tre verdiene her, men på
andre nettverk kan også rekkefølgen endres: å endre sannsynligheten for
et hopp er å endre modellen.

### Fra den nye regelen til PageRank

La nå $S$ være lenkematrisen for nettverket vi undersøker; i forsøket
er det matrisen med fellen på D. For en sannsynlighetsvektor $p_k$ blir
neste fordeling

$$p_{k+1}=\underbrace{\alpha Sp_k}_{\text{lenkeklikk}}+
\underbrace{(1-\alpha)u}_{\text{tilfeldige hopp}}.$$

I prosjekt 5 kaller vi denne oppdateringen $T(p)=\alpha Sp+(1-\alpha)u$.
Der betyr $T$ altså «ett steg med lenker og hopp», ikke den lineære
transformasjonen $T(x)=Ax$ fra 5.1.

En side uten utgående lenker, en **hengende node**, får $u$ som sin
kolonne i $S$, slik at $S$ alltid er kolonnestokastisk (se fordypningen
«utled Google-matrisen»).

For et nettverk med $n$ sider velger vi en fast hoppfordeling $u$ med $n$
koordinater og lar $\mathbf1$ være kolonnen med $n$ ettall. Matrisen
$u\mathbf1^T$ har hoppfordelingen $u$ i hver kolonne, fordi hoppene har
samme fordeling fra alle avsendersider. Den samlede overgangsmatrisen er derfor

$$G=\alpha S+(1-\alpha)u\mathbf1^T,\qquad p_{k+1}=Gp_k.$$

Fordi $p$ har sum én, er $(u\mathbf1^T)p=u(\mathbf1^Tp)=u$. Derfor gir
$Gp=\alpha Sp+(1-\alpha)u$ akkurat regelen over.
$G$ kalles **Google-matrisen**. Dens stasjonære sannsynlighetsvektor
$p_*$ er **PageRank-vektoren**:

$$Gp_*=p_*,\qquad p_{*,i}\geq0,\qquad \sum_i p_{*,i}=1.$$

Elementene er sidenes PageRank-verdier, som vi rangerer fra størst til minst.
Også her bruker vi fikspunktiterasjon fra uke 2: $p_{k+1}=Gp_k$.
Fikspunktresidualen er $Gp-p$, forskjellen mellom neste og nåværende fordeling.
Spørsmålet er nå om iterasjonen nærmer seg samme fikspunkt fra alle
startfordelinger.

### Hvorfor får vi nå én bestemt rangering?

Anta at $S$ er kolonnestokastisk, at $u_i>0$ for alle sider,
at $\sum_i u_i=1$, og at $0<\alpha<1$.
Da er alle elementene i $G$ positive, og hver kolonne summerer til én.
**Perron–Frobenius-teoremet** gir da det vi trenger:
Det finnes nøyaktig én stasjonær sannsynlighetsvektor, alle elementene
er positive (fordi $p_*=\alpha Sp_*+(1-\alpha)u$ har hvert element minst
$(1-\alpha)u_i>0$), og $G^kp_0$ konvergerer mot den fra enhver startfordeling $p_0$.
Dette krever verken symmetri eller en egenvektorbasis.

Grunnen er at hvert steg med $G$ krymper avstanden mellom to fordelinger
med minst faktor $\alpha$, målt i 1-normen $\lVert z\rVert_1=\sum_i|z_i|$
(se fordypningen «en feilgrense uten en egenvektorbasis»). Da kan to forskjellige startfordelinger ikke
holde seg fra hverandre, og det finnes bare én stasjonær fordeling.

**Hvor nær er vi?** I 1-normen gjelder feilgrensen

$$\lVert p-p_*\rVert_1\le\frac{\lVert Gp-p\rVert_1}{1-\alpha}.$$

Liten residual gir altså liten feil, men nær $\alpha=1$ må residualen være
mye mindre. Utledningen står i fordypningen «en feilgrense uten en
egenvektorbasis». Grensen brukes som stoppkrav i prosjekt 5.

**Diskuter:** Ved $\alpha=0$ velges alle sider etter $u$, og ved $\alpha=1$
mister vi garantien. Kan en rangering være entydig og lett å beregne,
men likevel lite relevant for det en bruker leter etter?

### Svaret på ukens spørsmål

Vi spurte hva som overlever når vi ganger med den samme matrisen om og om
igjen. Nå kan vi svare:

- Skriv startvektoren som en sum av bidrag langs egenvektorene. I hvert
  steg ganges hvert bidrag med sin egenverdi.
- Bidraget med størst egenverdi i absoluttverdi vokser raskest i forhold
  til de andre. Det bestemmer retningen etter mange steg, så sant det var
  med fra start. Forholdet $|\lambda_2/\lambda_1|$ bestemmer farten.
- Potensmetoden bruker dette til å finne en egenvektor, og
  Rayleigh-kvotienten gir egenverdien.
- I PageRank er det som overlever den stasjonære fordelingen: en
  egenvektor med egenverdi 1. Tilfeldige hopp gjør at avviket fra den
  krymper med minst faktor $\alpha$ per steg, så rangeringen blir den
  samme uansett hvor den besøkende starter.

I [prosjekt 5](project_week5.qmd) undersøker du hvor mye besøksmønsteret
må endres før to sider bytter plass.

**Øv på dette:** [tilfeldige hopp](#uke5-oppg-hopp), og gå deretter til prosjekt 5.

::: {.reading-step title="Gå i dybden: utled Google-matrisen"}

Produktet av kolonnen $u$ og raden $\mathbf1^T$ er en $n\times n$-matrise:

$$u\mathbf1^T=\begin{bmatrix}u&u&\cdots&u\end{bmatrix}.$$

Siden $p_k$ har sum én, får vi

$$(u\mathbf1^T)p_k=u(\mathbf1^Tp_k)=u.$$

Dermed blir $Gp_k=\alpha Sp_k+(1-\alpha)u$, som er akkurat den nye
besøksregelen. I fellen med $\alpha=0.85$ og jevn hoppfordeling blir
D-regelen for eksempel

$$p_D^{(k+1)}
=0.85\bigl(\tfrac12p_C^{(k)}+p_D^{(k)}\bigr)+0.0375.$$

Under forutsetningene i teoremet er hvert element positivt:

$$G_{ij}=\alpha S_{ij}+(1-\alpha)u_i>0.$$

Kolonnesummene er

$$\sum_i G_{ij}
=\alpha\underbrace{\sum_i S_{ij}}_{1}
 +(1-\alpha)\underbrace{\sum_i u_i}_{1}=1.$$

På en hengende node finnes ingen lenke å velge. Vi bruker derfor $u$ også
når den besøkende er på en slik side og skulle ha fulgt en lenke.
Hvis en hengende node hadde beholdt en nullkolonne i $S$, ville den
tilsvarende kolonnen i $G$ summert til $1-\alpha$.
Derfor erstatter vi nullkolonnen med $u$ før vi danner $G$.

Ved stasjonaritet kan vi flytte ledd og få et lineært system:

$$p_*=\alpha Sp_*+(1-\alpha)u
\quad\Longleftrightarrow\quad
(I-\alpha S)p_*=(1-\alpha)u.$$

På små nettverk kan dette brukes som en uavhengig kontroll av iterasjonen.
På store nettverk beregner vi $\alpha Sp+(1-\alpha)u$ direkte; vi trenger
ikke lagre den tette matrisen $u\mathbf1^T$.

:::

::: {.reading-step title="Gå i dybden: egenverdier forklarer pendling og avtagende avvik"}

Se dette konkret med to sider som bare lenker til hverandre.
Uten hopp blir fordelingen fra sikker start på første side
$(1,0)^T,(0,1)^T,(1,0)^T,\ldots$.
Fordelingen $(1/2,1/2)^T$ er stasjonær, men denne følgen nærmer seg den ikke.

Med jevn hoppfordeling og $\alpha=\tfrac12$ (halvparten lenkeklikk,
halvparten hopp) får vi

$$G=\tfrac12\begin{bmatrix}0&1\\1&0\end{bmatrix}
+\tfrac12\begin{bmatrix}1/2&1/2\\1/2&1/2\end{bmatrix}
=\begin{bmatrix}1/4&3/4\\3/4&1/4\end{bmatrix}.$$

For $v=(1,1)^T$ og $w=(1,-1)^T$ er

$$Gv=\begin{bmatrix}1/4+3/4\\3/4+1/4\end{bmatrix}=v,\qquad
Gw=\begin{bmatrix}1/4-3/4\\3/4-1/4\end{bmatrix}=\begin{bmatrix}-1/2\\1/2\end{bmatrix}=-\tfrac12w.$$

Den stasjonære fordelingen er $p_*=v/2=(1/2,1/2)^T$.
Fra $p_0=(1,0)^T=(v+w)/2$ får vi, fordi hvert steg ganger $w$-bidraget med $-\tfrac12$,

$$p_k=\tfrac12v+\tfrac12\bigl(-\tfrac12\bigr)^kw,\qquad
p_1=\begin{bmatrix}1/4\\3/4\end{bmatrix},\quad
p_2=\begin{bmatrix}5/8\\3/8\end{bmatrix}.$$

Fortegnet på avviket veksler, men størrelsen halveres i hvert steg.
Dette knytter besøksmodellen til fortegnsforsøket i 5.4. I prosjekt 5 gjør
du den samme analysen for en vilkårlig $\alpha$, og undersøker hva som skjer
når hoppene fjernes.

:::

::: {.reading-step title="Gå i dybden: en feilgrense uten en egenvektorbasis"}

Vi bruker normen $\lVert z\rVert_1=\sum_i|z_i|$.
Fordi $S$ har ikke-negative elementer og kolonnesum én, gir
trekantulikheten $|a+b|\le|a|+|b|$

$$\begin{aligned}
\lVert Sz\rVert_1
&=\sum_i\left|\sum_j S_{ij}z_j\right|\\
&\leq\sum_j|z_j|\underbrace{\sum_iS_{ij}}_{1}
=\lVert z\rVert_1.
\end{aligned}$$

Hvis $Sz=\lambda z$ med $z\ne0$, gir dette
$|\lambda|\,\lVert z\rVert_1\le\lVert z\rVert_1$, altså $|\lambda|\le1$:
egenverdiene til en kolonnestokastisk matrise har absoluttverdi høyst én.

La $z$ være en vektor med sum null, $\mathbf1^Tz=0$, for eksempel
forskjellen mellom to sannsynlighetsvektorer. Da er
$(u\mathbf1^T)z=u(\mathbf1^Tz)=0$, så $Gz=\alpha Sz$ og

$$\lVert Gz\rVert_1\le\alpha\lVert z\rVert_1.$$

Ett steg med $G$ krymper altså avstanden mellom to fordelinger med minst
faktor $\alpha$. Etter $k$ steg er avstanden høyst $\alpha^k$ ganger den opprinnelige.

Vi får også en kontroll som ikke krever at vi kjenner $p_*$.
La $p$ være en sannsynlighetsvektor, $e=p-p_*$ og $r=Gp-p$.
Siden $Gp_*=p_*$, er $Ge=Gp-p_*=r+e$, altså $e=-r+Ge$.
Fordi $e$ har sum null, er $\lVert Ge\rVert_1\leq\alpha\lVert e\rVert_1$, og

$$\lVert e\rVert_1\leq\lVert r\rVert_1+\alpha\lVert e\rVert_1
\quad\Longrightarrow\quad
\boxed{\lVert p-p_*\rVert_1\leq
\frac{\lVert Gp-p\rVert_1}{1-\alpha}}.$$

Her er $0\leq\alpha<1$. Nær $\alpha=1$ må residualen være mindre for å
garantere samme feil. Med $\lVert r\rVert_1=10^{-8}$ er feilgrensen
omtrent $6.67\cdot10^{-8}$ ved $\alpha=0.85$, men $10^{-6}$ ved $\alpha=0.99$.

:::

## 5.7 Støtteløp: repetisjon ved behov {quiz=uke5-7-oppgaver}

::: {#uke5-stotte-oppgaver}
:::

De to oppgavene her repeterer verktøy fra Matematikk 1. Bruk dem som selvtest
dersom lineære systemer, egenverdier eller egenvektorer ikke sitter friskt.
Du trenger ikke fullføre støtteløpet dersom forkunnskapene sitter;
gå da direkte til [5.8 Hovedløp](#uke5-oppgaver).

Arbeid først på papir og bruk svarfeltene til å kontrollere regningen.
Bruk eksakte tall, for eksempel `3/2` og `sqrt(2)`. Skriftlige begrunnelser
føres i egne notater.

::: {#uke5-oppg-koordinater}
:::

### Koordinater i en egenvektorbasis

Vi har $v_1=(1,1)^T$, $v_2=(1,-1)^T$ og $x=(2,1)^T$, og vil finne tallene
$c_1,c_2$ slik at $x=c_1v_1+c_2v_2$. Skriv først én likning for hver
koordinat i egne notater, og løs deretter systemet. Skriv ett tall i hvert felt.

```{math-exercise}
#| label: week5-task-coordinates
#| caption: Finn koeffisientene ved å løse et lineært system
#| mode: equivalent
#| partial-credit: true
#| field-labels: c₁, c₂

$c_1=$ __[3/2]

$c_2=$ __[1/2]
```

**Kontroller og tolk:** Beregn $c_1v_1+c_2v_2$, og forklar hvorfor
$c_1,c_2$ ikke er de samme som standardkoordinatene $2,1$.

::: {.hint title="Hint: koordinater i en egenvektorbasis"}

Likningene er $c_1+c_2=2$ og $c_1-c_2=1$. Hva skjer når du legger dem sammen?

:::

::: {#uke5-oppg-egen}
:::

### Egenverdier og egenvektorer for hånd

Vi undersøker $A=\begin{bmatrix}1&2\\2&1\end{bmatrix}$. Sett opp
$\det(A-\lambda I)=0$ i egne notater og løs likningen. Løs deretter
$(A-\lambda I)v=0$ for hver egenverdi. Du velger selv skaleringen av
egenvektorene. Skriv den største egenverdien først; kontrollen sjekker
bare at $Av=\lambda v$.

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
#|           return {"score": 0, "feedback": "Bruk konkrete, endelige reelle tall. Beskriv parameterfamiliene i egne notater."}
#|       A = Matrix([[1, 2], [2, 1]])
#|       checks = []
#|       messages = []
#|       for i, target in enumerate((3, -1)):
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

For $A=\begin{bmatrix}1&2\\2&1\end{bmatrix}$: oppgi $\lambda_1>\lambda_2$
og ikke-null vektorer som oppfyller $Av_i=\lambda_i v_i$.

Største egenverdi: $\lambda_1=$ __[3]

En tilhørende egenvektor: $v_1=$ vec[1,1]

Minste egenverdi: $\lambda_2=$ __[-1]

En tilhørende egenvektor: $v_2=$ vec[1,-1]
```

**Beskriv alle valgene:** Bruk de to egenvektorene dine til å beskrive
alle egenvektorene til hver egenverdi og de to egenrommene, som
parameterfamilier $tv_i$. Hvilket vilkår på $t$ gjelder for egenvektorer,
og hvilket for egenrom? Hva gjør den negative egenverdien med retningen?

::: {.hint title="Hint: egenverdier og egenvektorer"}

Determinantlikningen er $(1-\lambda)^2-4=0$, altså $1-\lambda=\pm2$.
Sett hver rot inn i $A-\lambda I$ og løs det homogene systemet. Matrisen
er singulær, så du skal ikke forsøke å invertere den.

:::

## 5.8 Hovedløp: iterasjon og PageRank {quiz=uke5-8-oppgaver}

::: {#uke5-oppgaver}
:::

Oppgavene her bruker ukens nye ideer i Matematikk 3A: utvikling i en
egenvektorbasis, potensmetoden og PageRank. Dette er hovedløpet.
Hvis du trenger repetisjon av lineære systemer, egenverdier eller egenvektorer,
bruk [5.7 Støtteløp](#uke5-stotte-oppgaver) og kom tilbake hit.

Hver oppgave angir hva du skal levere: tall i svarfeltene, kode i kodevinduet
eller begrunnelser i egne notater. Bruk eksakte tall i matematikkfeltene,
for eksempel `3/2` og `sqrt(2)`.

::: {#uke5-oppg-potenser}
:::

### Gjentatt transformasjon i en egenvektorbasis

Vi undersøker en ny transformasjon, representert ved

$$B=\begin{bmatrix}2&2\\2&5\end{bmatrix},\qquad x_0=(3,1)^T.$$

Du får oppgitt egenvektorene $w_1=(1,2)^T$ og $w_2=(2,-1)^T$, med
henholdsvis egenverdiene $6$ og $1$. Bestem først $c_1,c_2$ fra
$x_0=c_1w_1+c_2w_2$, og bruk deretter $B^kx_0=c_1 6^k w_1+c_2 1^k w_2$.
Skriv de to standardkoordinatene til $B^kx_0$ som uttrykk i $k$,
for eksempel med `6^k`.

```{math-exercise}
#| label: week5-task-powers-general
#| caption: Vektorformelen for alle steg
#| mode: custom
#| vars: k
#| field-labels: første koordinat som funksjon av k, andre koordinat som funksjon av k
#| checker: |
#|   def check(response, symbols):
#|       values = response["expressions"]
#|       if len(values) != 2:
#|           return {"score": 0, "feedback": "Fyll inn alle feltene."}
#|       k = symbols["k"]
#|       n = Symbol("n", integer=True, nonnegative=True)
#|       if any(value.free_symbols - {k} for value in values):
#|           return {"score": 0, "feedback": "Bruk bare variabelen k og eksakte tall."}
#|       expected = [6**n + 2, 2*6**n - 1]
#|       correct = [simplify(value.subs(k, n) - target) == 0 for value, target in zip(values, expected)]
#|       hints = ["Første koordinat: kontroller bidragene fra begge egenvektorene.","Andre koordinat: kontroller bidragene og fortegnene."]
#|       feedback = " ".join(hint for hint, ok in zip(hints, correct) if not ok)
#|       return {"score": sum(correct)/len(correct), "show_score": False,
#|               "feedback": feedback or "Uttrykkene stemmer for alle heltall k ≥ 0."}

$B^kx_0=$ vec[6^k+2,2*6^k-1]
```

::: {.hint title="Hint: gjentatt transformasjon i en egenvektorbasis"}

Løs $c_1(1,2)^T+c_2(2,-1)^T=(3,1)^T$ koordinat for koordinat. Sett deretter
$c_1,c_2$ inn i $B^kx_0=c_16^kw_1+c_2w_2$ og les av første og andre koordinat.

:::

Sett inn $k=3$. De to første feltene under er standardkoordinatene til
$B^3x_0$. Det siste feltet er ett ikke-negativt tall: lengden av bidraget
langs $w_2$ delt på lengden av bidraget langs $w_1$,

$$\frac{\lVert c_2 1^3 w_2\rVert_2}{\lVert c_1 6^3 w_1\rVert_2}.$$

```{math-exercise}
#| label: week5-task-powers
#| caption: To bidrag som utvikler seg forskjellig
#| mode: equivalent
#| partial-credit: true
#| field-labels: første koordinat, andre koordinat, forhold mellom bidragslengder

$B^3x_0=($ __[218] $, $ __[431] $)^T$

Lengden av bidraget langs $w_2$, delt på lengden av bidraget langs $w_1$, etter tre steg:
__[1/216]
```

La nå $R_k$ være det samme forholdet etter $k$ steg:

$$R_k=\frac{\lVert c_2 1^k w_2\rVert_2}{\lVert c_1 6^k w_1\rVert_2}.$$

Finn et uttrykk for $R_k$, grenseverdien når $k\to\infty$, og lengden av
det andre bidraget. Bruk de samme $c_1,c_2$ som over.

```{math-exercise}
#| label: week5-task-powers-direction
#| caption: Relativ vekst og grense
#| mode: custom
#| vars: k
#| field-labels: forhold Rₖ, grenseverdi for Rₖ, lengde av bidraget langs w₂
#| checker: |
#|   def check(response, symbols):
#|       values = response["expressions"]
#|       if len(values) != 3:
#|           return {"score": 0, "feedback": "Fyll inn alle feltene."}
#|       k = symbols["k"]
#|       n = Symbol("n", integer=True, nonnegative=True)
#|       if any(value.free_symbols - {k} for value in values):
#|           return {"score": 0, "feedback": "Bruk bare variabelen k og eksakte tall."}
#|       expected = [6**(-n), Integer(0), sqrt(5)]
#|       correct = [simplify(value.subs(k, n) - target) == 0 for value, target in zip(values, expected)]
#|       hints = ["Kontroller forholdet mellom de to bidragslengdene.","Kontroller grenseverdien når k øker.","Bruk vektornormen, ikke bare koeffisienten til w₂."]
#|       feedback = " ".join(hint for hint, ok in zip(hints, correct) if not ok)
#|       return {"score": sum(correct)/len(correct), "show_score": False,
#|               "feedback": feedback or "Uttrykkene stemmer for alle heltall k ≥ 0."}

$R_k=$ __[6^(-k)]

$\displaystyle\lim_{k\to\infty}R_k=$ __[0]

$\lVert c_2 1^k w_2\rVert_2=$ __[sqrt(5)]
```

**Forklar:** Bruk svarene til å forklare i egne notater hvorfor de
normaliserte vektorene nærmer seg linjen gjennom $w_1$, selv om det andre
bidraget ikke blir kortere.

Finn så en ikke-null startvektor som gir en iterasjonsfølge som **ikke**
nærmer seg linjen gjennom $w_1$. Skriv to konkrete koordinater; alle
gyldige skaleringer godtas.

```{math-exercise}
#| label: week5-task-powers-exception
#| caption: En startvektor uten dominant bidrag
#| mode: custom
#| field-labels: første startkoordinat, andre startkoordinat
#| checker: |
#|   def check(response, symbols):
#|       values = response["expressions"]
#|       if len(values) != 2 or any(z.free_symbols or z.is_real is not True or z.is_finite is not True for z in values):
#|           return {"score": 0, "feedback": "Oppgi to konkrete, endelige reelle tall."}
#|       v = Matrix(values)
#|       if all(simplify(z) == 0 for z in v):
#|           return {"score": 0, "feedback": "Startvektoren må være forskjellig fra null."}
#|       B = Matrix([[2, 2], [2, 5]])
#|       ok = all(simplify(z) == 0 for z in B*v-v)
#|       return {"correct": ok, "feedback": "Startvektoren gir en følge som blir på den andre egenlinjen." if ok else "Undersøk om startvektoren har et bidrag langs w₁."}

En startvektor for transformasjonen med matrise $B$: vec[2,-1]
```

Begrunn i egne notater hvorfor vektoren din har den ønskede egenskapen.

Til slutt endrer vi fortegnet på én egenverdi. Behold $x_0=(3,1)^T$ og
basisvektorene, men la den nye transformasjonen $\widetilde B$ ha
egenverdiene $6$ og $-1$. Skriv de to standardkoordinatene til
$\widetilde B^kx_0$ som uttrykk i $k$. Bruk parenteser i `(-1)^k`.

```{math-exercise}
#| label: week5-task-powers-sign
#| caption: Vektorformelen med negativ egenverdi
#| mode: custom
#| vars: k
#| field-labels: første koordinat som funksjon av k, andre koordinat som funksjon av k
#| checker: |
#|   def check(response, symbols):
#|       values = response["expressions"]
#|       if len(values) != 2:
#|           return {"score": 0, "feedback": "Fyll inn alle feltene."}
#|       k = symbols["k"]
#|       n = Symbol("n", integer=True, nonnegative=True)
#|       if any(value.free_symbols - {k} for value in values):
#|           return {"score": 0, "feedback": "Bruk bare variabelen k og eksakte tall."}
#|       expected = [6**n + 2*(-1)**n, 2*6**n - (-1)**n]
#|       correct = [simplify(value.subs(k, n) - target) == 0 for value, target in zip(values, expected)]
#|       hints = ["Første koordinat: følg begge bidragene gjennom k steg.","Andre koordinat: kontroller både egenverdien og fortegnet i w₂."]
#|       feedback = " ".join(hint for hint, ok in zip(hints, correct) if not ok)
#|       return {"score": sum(correct)/len(correct), "show_score": False,
#|               "feedback": feedback or "Uttrykkene stemmer for alle heltall k ≥ 0."}

$\widetilde B^kx_0=$ vec[6^k+2*(-1)^k,2*6^k-(-1)^k]
```

**Sammenlign:** Hva endres ved fortegnet og lengden til det andre bidraget?
Begrunn svaret i egne notater.

::: {#uke5-oppg-potensmetode}
:::

### Ett steg av potensmetoden for hånd

Vi bruker $A=\begin{bmatrix}3&1\\1&3\end{bmatrix}$ og startvektoren
$x_0=(1,0)^T$. Regn ut Rayleigh-kvotienten $\rho(x_0)$ og lengden av
egenresidualen $r_0=Ax_0-\rho(x_0)x_0$. Gjør så ett steg av potensmetoden,
$x_1=Ax_0/\lVert Ax_0\rVert_2$, og regn ut det samme for $x_1$.
Skriv eksakte tall, for eksempel `18/5`.

```{math-exercise}
#| label: week5-task-power-step
#| caption: Rayleigh-kvotient og egenresidual før og etter ett steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: ρ(x₀), lengden av r₀, ρ(x₁), lengden av r₁

$\rho(x_0)=$ __[3]

$\lVert r_0\rVert_2=$ __[1]

$\rho(x_1)=$ __[18/5]

$\lVert r_1\rVert_2=$ __[4/5]
```

**Tolk:** Egenverdiene til $A$ er $4$ og $2$. Hvilken av dem nærmer
$\rho$ seg, og hva skjer med residualen? Kontroller at $x_1^Tr_1=0$.

::: {.hint title="Hint: ett steg av potensmetoden"}

$Ax_0=(3,1)^T$, så $x_1=(3,1)^T/\sqrt{10}$. Siden $x_1$ har lengde én, er
$\rho(x_1)=x_1^TAx_1$. Regn ut $Ax_1$ først.

:::

### Hva kontrollerer en liten egenresidual?

Nå programmerer du potensmetoden. Fullfør `power_check`: normaliser
startvektoren og utfør deretter nøyaktig `steps` oppdateringer
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
x, rho, residual = power_check(np.array([[2.,1.],[1.,2.]]), np.array([3.,4.]), 0)
assert np.allclose(x,[.6,.8]), 'Også startvektoren skal normaliseres når steps er 0.'
assert np.isclose(rho,2.96) and np.isclose(residual,.28), 'Bruk Rayleigh-kvotienten og egenresidualen for vektoren x.'
x, rho, residual = power_check(np.diag([5.,2.]), np.array([1.,1.]), 2)
assert np.allclose(x, np.array([25.,4.])/np.sqrt(641)), 'Utfør akkurat det oppgitte antallet steg.'
```

**Sammenlign tre startvektorer:** Bruk $A=\operatorname{diag}(5,2)$ og
$(1,1)^T$, $(0,1)^T$, $(10^{-8},1)^T$. Forutsi hvilke som vil gi
tilnærming til egenverdien $5$, og hvilken som vil gi raskest tilnærming.
Prøv deretter 5, 20 og 40 steg for hver startvektor. Legg egne
funksjonskall før `## TESTS ##` i kodevinduet, og lag en tabell med
startvektor, antall steg, $\rho$ og residualens lengde.

**Tolk kontrollen:** Kan residualen være null når $\rho=2$?
Hva bekrefter en null residual, og hva sier den ikke om størrelsen på egenverdien?
Bruk uttrykket for $A^kx_0$ til å forklare forskjellen mellom startvektorene
$(0,1)^T$ og $(10^{-8},1)^T$, med én vektorformel og en kort konklusjon.

::: {#uke5-oppg-stasjonaer}
:::

### Stasjonær fordeling for tre sider

Tre nettsider lenker slik: A lenker til B og C, B lenker til C, og C
lenker til A. Den besøkende velger en av lenkene med lik sannsynlighet.
Skriv overgangsmatrisen $S$ i egne notater, med kolonnene som sidene vi går
fra og rekkefølgen A, B, C. Regn så ut ett steg fra jevn startfordeling
$p_0=(1/3,1/3,1/3)^T$, og finn den stasjonære fordelingen $p_*$ med sum én.

```{math-exercise}
#| label: week5-task-three-pages
#| caption: Ett steg og den stasjonære fordelingen for tre sider
#| mode: equivalent
#| partial-credit: true
#| field-labels: A etter ett steg, B etter ett steg, C etter ett steg, stasjonær andel for A, stasjonær andel for B, stasjonær andel for C

$Sp_0=($ __[1/3] $, $ __[1/6] $, $ __[1/2] $)^T$

$p_*=($ __[2/5] $, $ __[1/5] $, $ __[2/5] $)^T$
```

**Kontroller:** Har $Sp_0$ sum én? Sett $p_*$ inn i $Sp=p$ og sjekk alle
tre radene. Hvilken side rangeres lavest, og hvorfor, ut fra lenkene?

::: {.hint title="Hint: stasjonær fordeling"}

Gå fram som i håndeksempelet i 5.5: skriv én likning per rad i $S$,
start med den enkleste, og uttrykk alle andelene ved $p_A$. Bruk kravet
«sum én» til slutt.

:::

### Stasjonær fordeling uten konvergens

To nettsider lenker bare til hverandre. Overgangsmatrisen er
$S=\begin{bmatrix}0&1\\1&0\end{bmatrix}$, med kolonner som avsendersider.
Løs $Sp_*=p_*$ sammen med $p_{*,1}+p_{*,2}=1$, og finn begge egenverdiene
til $S$. Skriv de to sannsynlighetene og egenverdien som ikke er $1$.

```{math-exercise}
#| label: week5-task-stationary-cycle
#| caption: Skill mellom en uendret fordeling og en grense
#| mode: equivalent
#| partial-credit: true
#| field-labels: første stasjonære andel, andre stasjonære andel, andre egenverdi

$p_*=($ __[1/2] $, $ __[1/2] $)^T$

Egenverdien forskjellig fra $1$ er __[-1]
```

**Følg to startfordelinger:** Finn $p_0,p_1,p_2,p_3$ både når
$p_0=(1,0)^T$ og når $p_0=p_*$.

**Forklar forskjellen:** Bruk den andre egenverdien til å forklare
hvorfor en entydig stasjonær fordeling ikke sikrer konvergens fra enhver
startfordeling. Knytt forklaringen til vektorene du fant.

::: {.hint title="Hint: stasjonær fordeling uten konvergens"}

Skriv $Sp=p$ som to likninger, én per rad. Egenverdiene finner du fra
$\det(S-\lambda I)=\lambda^2-1=0$. For følgene: $S$ bytter de to koordinatene,
så bruk den regelen tre ganger.

:::

::: {#uke5-oppg-hopp}
:::

### Tilfeldige hopp endrer forløp og rangering

Vi følger lenkene med sannsynlighet $\alpha$ og velger ellers neste side
etter en fast sannsynlighetsvektor $u$. Oppdateringen er
$p_{k+1}=\alpha Sp_k+(1-\alpha)u$. Fullfør `visit_step`, som gjør
**ett** slikt steg.

| Navn | Type og betydning |
|---|---|
| `S` | NumPy-matrise med form `(n, n)`, ikke-negative elementer og kolonnesum én |
| `alpha` | Reelt skalar med $0\leq\alpha<1$ |
| `u`, `p` | NumPy-vektorer med form `(n,)`, ikke-negative elementer og sum én |
| Returverdi | NumPy-vektor med form `(n,)`: fordelingen etter **ett** steg |

Bruk nøyaktig denne rekkefølgen på argumentene: samme funksjon bruker du i
prosjekt 5, del 2. Funksjonen skal returnere vektoren, ikke skrive den ut
eller returnere flere verdier.

```{py-exercise}
#| label: week5-task-teleportation
#| caption: Fra pendling til konvergens
# Denne funksjonen skal gjøre ETT steg, ikke iterere til konvergens.
# S @ p fordeler lenkebesøkene; u beskriver hvor de uavhengige hoppene lander.
# En løkke utenfor funksjonen kan deretter følge hele utviklingen.

import numpy as np

def visit_step(S, alpha, u, p):
    # Returner fordelingen etter ett steg med teleportering.
    return None

S = np.array([[0.,1.],[1.,0.]])
u = np.array([.5,.5])
p = np.array([1.,0.])
# Når funksjonen virker: gjenta steget og følg avstanden ||p-u||.

## TESTS ##
S2 = np.array([[0.,1.],[1.,0.]])
out = visit_step(S2, .8, np.array([.5,.5]), np.array([1.,0.]))
assert np.allclose(out,[.1,.9]), 'Bland lenkesteget med den faste fordelingen u.'
S3 = np.array([[0.,0.,1.],[1.,0.,0.],[0.,1.,0.]])
out = visit_step(S3, .6, np.array([.5,.25,.25]), np.array([1.,0.,0.]))
assert np.allclose(out,[.2,.7,.1]), 'Bruk kolonner som avsendere; funksjonen skal også virke for tre sider.'
```

**Undersøk farten:** Bruk $S=\begin{bmatrix}0&1\\1&0\end{bmatrix}$,
$u=(1/2,1/2)^T$ og $p_0=(1,0)^T$. Velg to verdier $0<\alpha<1$ som du tror
vil gi tydelig forskjellig konvergensfart, med samme startfordeling og
antall steg i begge forsøk. Lag ett plott av $\lVert p_k-u\rVert_2$ mot $k$
med én merket kurve for hver verdi av $\alpha$, og sammenlign med
forventningen din. Legg forsøkskoden før `## TESTS ##`.

Nå bytter vi til en skjev hoppfordeling $u=(0.8,\,0.2)^T$ og $\alpha=\tfrac12$,
fortsatt med de to sidene som lenker til hverandre. Finn den stasjonære
fordelingen $p_*$ ved å løse $p_*=\tfrac12Sp_*+\tfrac12u$ for hånd.
Skriv deretter avviket $e_k=p_k-p_*$ som et tall ganger $(1,-1)^T$, og finn
tallet som dette tallet ganges med i hvert steg.

```{math-exercise}
#| label: week5-task-skewed-jump
#| caption: Stasjonær fordeling og avviksfaktor med skjeve hopp
#| mode: equivalent
#| partial-credit: true
#| field-labels: første stasjonære andel, andre stasjonære andel, faktor per steg for avviket

$p_*=($ __[3/5] $, $ __[2/5] $)^T$

Avviket ganges i hvert steg med __[-1/2]
```

**Begrunn:** Skriv $e_k$ som en formel i $k$ når $p_0=(1,0)^T$, og forklar
både fortegnet og farten. Hvorfor er $p_*$ ikke lik $u$ her?

::: {.hint title="Hint: skjeve hopp"}

Med $S=\begin{bmatrix}0&1\\1&0\end{bmatrix}$ blir $p_*=\tfrac12Sp_*+\tfrac12u$ til de
to likningene $p_1=\tfrac12p_2+0.4$ og $p_2=\tfrac12p_1+0.1$. Regn så ut $p_1$ og
$p_2$ fra $p_0=(1,0)^T$ og sammenlign avvikene $e_0,e_1,e_2$.

:::

**Skill regnefart fra modellvalg:** Forklar hva en lavere $\alpha$ betyr
for vekten på lenkene. I det symmetriske eksemplet med $u=(1/2,1/2)^T$ er
den stasjonære fordelingen $u$ for alle $0\leq\alpha<1$. Hvorfor betyr ikke
dette at rangeringen på andre nettverk er uavhengig av $\alpha$? Bruk
fellen i 5.6 som sammenligningsgrunnlag.

I [prosjekt 5](project_week5.qmd) bruker du dette til en egen undersøkelse
av rangering. Skill mellom tre spørsmål: Oppfyller svaret likningen?
Konvergerer metoden? Måler modellen det vi ønsket?

:::
