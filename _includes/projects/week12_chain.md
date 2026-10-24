## Kjettingen som henger

Heng en kjetting mellom to kroker, og den finner formen sin selv. Vi skal
finne samme form med **optimering med likhetskrav** fra [uke 12](uke12.qmd).
Etterpå undersøker du hva løserens svar forteller:

- **Multiplikatorene:** Hvilke ledd trekker mest, og hva er litt mer lengde verdt?
- **Straffemetoden:** Kan svært stive fjærer erstatte de faste lengdene?

Du får gradienter, Jacobimatriser og løserne ferdig. Arbeidet er å skrive
tre korte kodeuttrykk, lese utskriftene og begrunne konklusjonene dine.
Sett av omtrent **4–6 timer**, inkludert den korte undersøkelsen til slutt.
Skriv en forventning før et forsøk; sammenlign den med det du faktisk ser.

| Del | Hovedarbeid |
|:--|:-- |
| Bildet og modellen | Bli kjent med punkter, lengder og energi |
| 1. Finn og kontroller formen | Kravfunksjon, dimensjoner og løserens svar |
| 2. Les multiplikatorene | Kraftbalanse og en liten lengdeendring |
| 3. Bytt ledd med fjærer | Straffefeil, kondisjon og solvermeldinger |
| 4. En lampe på kjettingen | Ett eget forsøk og kort rapport |

### Bakgrunn: bildet og den ferdige fysiske modellen

Dette er en kort innføring i anvendelsen, ikke en fysikkoppgave. Energi-,
kraft- og derivatformlene du trenger, er gitt. Prosjektarbeidet i numerikk
og lineær algebra begynner ved del 1.

Appleten viser tre ledd mellom to kroker, 4 m fra hverandre. Leddene er
1.5 m, 2 m og 1.5 m lange. I hvert av de to frie punktene henger en vekt
på 1 N. Dra i et blått punkt; lengdene skal holde seg faste.

```{.jsxgraph width="620" height="420" style="width:100%;max-width:620px;height:420px;border:0;"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-0.6, 1.35, 4.6, -2.05], axis: false, keepaspectratio: true,
  showNavigation: false, showCopyright: false,
  pan: {enabled:false}, zoom: {enabled:false}
});
// Tre ledd med fast lengde mellom de faste endene p0 = (0, 0) og p3 = (4, 0).
// Hvert fritt leddpunkt p1, p2 har vekten w = 1 N. Kjettingen har én frihetsgrad.
var span = 4, len = [1.5, 2, 1.5], w = 1, deg = Math.PI/180;
// Skjæringspunktet mellom sirkelen om c1 (radius r1) og sirkelen om c2 (radius r2)
// som ligger til høyre for retningen c1 -> c2, altså under linjen fra c1 til c2.
function meet(c1, r1, c2, r2) {
  var dx = c2[0]-c1[0], dy = c2[1]-c1[1], d = Math.sqrt(dx*dx + dy*dy);
  var s = (r1*r1 - r2*r2 + d*d)/(2*d), t = Math.sqrt(Math.max(0, r1*r1 - s*s));
  return [c1[0] + (s*dx + t*dy)/d, c1[1] + (s*dy - t*dx)/d];
}
function joint1(phi) { return [len[0]*Math.cos(phi), len[0]*Math.sin(phi)]; }
function joint2(p1) { return meet(p1, len[1], [span, 0], len[2]); }
// Vinkelområdet for ledd 1: fra «ledd 2 og 3 på linje» til «ledd 1 og 2 på linje».
var phiLo = -Math.acos((len[0]*len[0] + span*span - Math.pow(len[1]+len[2], 2))/(2*len[0]*span));
var phiHi = -Math.acos((Math.pow(len[0]+len[1], 2) + span*span - len[2]*len[2])/(2*(len[0]+len[1])*span));
function energyAt(phi) { var p = joint1(phi), q = joint2(p); return w*(p[1] + q[1]); }
// Likevekt: minst energi. E er unimodal i vinkelen, så gyllent snitt holder.
function equilibrium() {
  var a = phiLo, b = phiHi, g = (Math.sqrt(5) - 1)/2;
  for (var k = 0; k < 80; k++) {
    var c = b - g*(b - a), d = a + g*(b - a);
    if (energyAt(c) < energyAt(d)) { b = d; } else { a = c; }
  }
  return (a + b)/2;
}
var hide = {visible:false, fixed:true};
var P0 = board.create('point', [0, 0], {name:'p₀', fixed:true, color:'#37474f', size:4,
  label:{offset:[-22, 12], fontSize:14}});
var P3 = board.create('point', [span, 0], {name:'p₃', fixed:true, color:'#37474f', size:4,
  label:{offset:[8, 12], fontSize:14}});
// Sporene leddpunktene kan gli langs: sirkelbuer, fordi endeleddene har fast lengde.
var track1 = board.create('arc', [P0, board.create('point', joint1(phiLo), hide),
  board.create('point', joint1(phiHi), hide)],
  {strokeColor:'#90caf9', strokeWidth:5, strokeOpacity:0.6, fixed:true, highlight:false});
var track2 = board.create('arc', [P3, board.create('point', joint2(joint1(phiLo)), hide),
  board.create('point', joint2(joint1(phiHi)), hide)],
  {strokeColor:'#90caf9', strokeWidth:5, strokeOpacity:0.6, fixed:true, highlight:false});
var phiStart = -30*deg, s1 = joint1(phiStart), s2 = joint2(s1);
var J1 = board.create('glider', [s1[0], s1[1], track1], {name:'p₁', color:'#1565c0', size:6,
  label:{offset:[-26, -14], fontSize:14}});
var J2 = board.create('glider', [s2[0], s2[1], track2], {name:'p₂', color:'#1565c0', size:6,
  label:{offset:[10, -14], fontSize:14}});
// Drar du i ett leddpunkt, følger det andre med, slik at alle tre lengdene står fast.
J1.on('drag', function () {
  J2.setPositionDirectly(JXG.COORDS_BY_USER, joint2([J1.X(), J1.Y()]));
  board.update();
});
J2.on('drag', function () {
  J1.setPositionDirectly(JXG.COORDS_BY_USER, meet([0, 0], len[0], [J2.X(), J2.Y()], len[1]));
  board.update();
});
function setShape(phi) {
  var p = joint1(phi);
  J1.setPositionDirectly(JXG.COORDS_BY_USER, p);
  J2.setPositionDirectly(JXG.COORDS_BY_USER, joint2(p));
  board.update();
}
var pts = [P0, J1, J2, P3];
function unit(i) {
  var dx = pts[i+1].X() - pts[i].X(), dy = pts[i+1].Y() - pts[i].Y(), n = Math.sqrt(dx*dx + dy*dy);
  return [dx/n, dy/n];
}
function linkLength(i) { return Math.hypot(pts[i+1].X() - pts[i].X(), pts[i+1].Y() - pts[i].Y()); }
function angle(i) { var u = unit(i), a = Math.atan2(u[1], u[0])/deg; return Math.abs(a) < 0.05 ? 0 : a; }
var sub = ['₁', '₂', '₃'];
function makeLink(i) {
  board.create('segment', [pts[i], pts[i+1]], {strokeColor:'#90a4ae', strokeWidth:7,
    fixed:true, highlight:false});
  // Enhetsvektoren u_i: lengde 1, fra venstre mot høyre langs leddet.
  board.create('arrow', [
    [function () { return pts[i].X(); }, function () { return pts[i].Y(); }],
    [function () { return pts[i].X() + unit(i)[0]; }, function () { return pts[i].Y() + unit(i)[1]; }]
  ], {strokeColor:'#c62828', strokeWidth:3, fixed:true, highlight:false});
  board.create('text', [
    function () { return pts[i].X() + 0.5*unit(i)[0] + 0.25*unit(i)[1] - 0.08; },
    function () { return pts[i].Y() + 0.5*unit(i)[1] - 0.25*unit(i)[0] - 0.04; },
    'u' + sub[i]], {fontSize:15, color:'#c62828', fixed:true, highlight:false});
}
for (var i = 0; i < 3; i++) { makeLink(i); }
// Høyden til hvert fritt leddpunkt, målt fra nullnivået y = 0 (linjen gjennom endene).
function makeHeight(J, k) {
  var side = k === 0 ? 1 : -1;   // y1 til høyre for den stiplede linjen, y2 til venstre
  board.create('segment', [J, [function () { return J.X(); }, 0]],
    {strokeColor:'#ef6c00', dash:2, strokeWidth:2, fixed:true, highlight:false});
  board.create('text', [function () { return J.X() + 0.06*side; }, function () { return J.Y()*(k === 0 ? 0.35 : 0.65); },
    function () { return 'y' + sub[k] + ' = ' + J.Y().toFixed(3); }],
    {fontSize:13, color:'#ef6c00', fixed:true, highlight:false, anchorX: k === 0 ? 'left' : 'right'});
}
makeHeight(J1, 0); makeHeight(J2, 1);
// Nullnivået: linjen gjennom de to faste endene.
board.create('line', [P0, P3], {strokeColor:'#78909c', dash:1, strokeWidth:1, fixed:true,
  highlight:false, straightFirst:true, straightLast:true});
board.create('text', [0.9, 0.12, 'nullnivå: y = 0'], {fontSize:12, color:'#546e7a', fixed:true});
// Kreftene i leddpunktene. Tyngden er (0, -w). Ledd i virker på p_i med -lambda_i u_i og
// på p_(i-1) med +lambda_i u_i. Vi velger lambda_1, lambda_2, lambda_3 slik at summen av
// kreftene i p1 og p2 blir minst mulig (minste kvadrater, 4 likninger og 3 ukjente).
function forces() {
  var u1 = unit(0), u2 = unit(1), u3 = unit(2);
  var a = u1[0]*u2[0] + u1[1]*u2[1], b = u2[0]*u3[0] + u2[1]*u3[1];
  var r = [-w*u1[1], 0, w*u3[1]];                 // høyresiden i normallikningene
  var det = 2 - a*a - b*b;                        // determinanten til [[1,-a,0],[-a,2,-b],[0,-b,1]]
  var l2 = (r[0]*a + r[1] + r[2]*b)/det;
  var lam = [r[0] + a*l2, l2, r[2] + b*l2];
  function sum(j) {                               // summen av kreftene i leddpunkt j = 1, 2
    var ul = j === 1 ? u1 : u2, ur = j === 1 ? u2 : u3;
    return [-lam[j-1]*ul[0] + lam[j]*ur[0], -w - lam[j-1]*ul[1] + lam[j]*ur[1]];
  }
  return {lam: lam, s1: sum(1), s2: sum(2), u: [u1, u2, u3]};
}
var sc = 0.5;                                     // meter per newton i tegningen
var forceItems = [];
function forceChain(J, j) {
  // Pilene legges etter hverandre: tyngde, kraft fra venstre ledd, kraft fra høyre ledd.
  function tip(k) {
    var F = forces(), ul = F.u[j-1], ur = F.u[j], x = J.X(), y = J.Y();
    if (k >= 1) { y -= sc*w; }
    if (k >= 2) { x -= sc*F.lam[j-1]*ul[0]; y -= sc*F.lam[j-1]*ul[1]; }
    if (k >= 3) { x += sc*F.lam[j]*ur[0]; y += sc*F.lam[j]*ur[1]; }
    return [x, y];
  }
  var colours = ['#263238', '#7b1fa2', '#7b1fa2'];
  for (var k = 0; k < 3; k++) {
    (function (k) {
      forceItems.push(board.create('arrow', [
        [function () { return tip(k)[0]; }, function () { return tip(k)[1]; }],
        [function () { return tip(k+1)[0]; }, function () { return tip(k+1)[1]; }]
      ], {strokeColor:colours[k], strokeWidth:2.5, fixed:true, highlight:false, visible:false}));
    })(k);
  }
  // Det som mangler for balanse: fra siste pilspiss tilbake til leddpunktet.
  forceItems.push(board.create('arrow', [
    [function () { return tip(3)[0]; }, function () { return tip(3)[1]; }],
    [function () { return J.X(); }, function () { return J.Y(); }]
  ], {strokeColor:'#d81b60', strokeWidth:3, fixed:true, highlight:false, visible:false,
       strokeOpacity: function () { var F = forces(), s = j === 1 ? F.s1 : F.s2;
                                    return Math.hypot(s[0], s[1]) > 1e-3 ? 1 : 0; }}));
}
forceChain(J1, 1); forceChain(J2, 2);
var gapText = board.create('text', [-0.1, 0.40, function () {
  var F = forces(), g = Math.hypot(F.s1[0], F.s1[1], F.s2[0], F.s2[1]);
  return 'kraftgap = ' + (g < 5e-4 ? 0 : g).toFixed(3) + ' N';
}], {fontSize:13, color:'#d81b60', fixed:true, visible:false});
forceItems.push(gapText);
board.create('text', [-0.5, 1.30, function () {
  return 'E = w·(y₁ + y₂) = ' + (w*(J1.Y() + J2.Y())).toFixed(3) + ' J';
}], {fontSize:14, color:'#1565c0', fixed:true});
board.create('text', [-0.5, 1.00, function () {
  return 'θ₁ = ' + angle(0).toFixed(1) + '°,   θ₂ = ' + angle(1).toFixed(1) +
    '°,   θ₃ = ' + angle(2).toFixed(1) + '°';
}], {fontSize:14, color:'#c62828', fixed:true});
board.create('text', [-0.5, 0.70, function () {
  return 'leddlengder: ' + linkLength(0).toFixed(3) + ', ' + linkLength(1).toFixed(3) + ', ' +
    linkLength(2).toFixed(3) + ' m';
}], {fontSize:13, color:'#37474f', fixed:true});
board.create('button', [-0.5, -1.85, 'vis likevekt', function () { setShape(equilibrium()); }]);
board.create('button', [1.0, -1.85, 'start på nytt', function () { setShape(phiStart); }]);
var showForces = board.create('checkbox', [2.6, 0.40, 'vis krefter'], {fixed:true, fontSize:13});
JXG.addEvent(showForces.rendNodeCheckbox, 'change', function () {
  var on = this.Value();
  for (var k = 0; k < forceItems.length; k++) { forceItems[k].setAttribute({visible:on}); }
  board.update();
}, showForces);
```

1. Finn en form med lav energi, og sammenlign med **vis likevekt**.
2. Slå på **vis krefter**. Hva skjer med pilkjeden og kraftgapet når du
   flytter punktet bort fra likevekten?

De røde pilene viser retningene til leddene. De svarte og lilla pilene er
krefter lagt etter hverandre som vektorer. Det er denne vektorregningen vi
skal kjenne igjen i løserens utskrift.

### Ordboken fra bilde til modell

Vi regner leddene som vektløse og legger vekten i de frie punktene.
Endepunktene ligger fast på samme høyde. Dette er modellen vi undersøker:

| Navn | Betydning i modellen |
|:--|:--|
| Leddpunkt $p_j$ | Koordinatene $(x_j,y_j)$ |
| Ukjent vektor $z$ | $(x_1,y_1,\ldots,x_{N-1},y_{N-1})$ |
| Energi $E(z)$ | $w\sum_{j=1}^{N-1}y_j$, med $w=1$ N |
| Lengdekrav $h_i(z)=0$ | $h_i(z)=\lVert p_i-p_{i-1}\rVert_2-\ell_i$ |
| Retning $u_i$ | $(p_i-p_{i-1})/\lVert p_i-p_{i-1}\rVert_2$ |
| Strekkraft | Multiplikatoren $\lambda_i$, med fortegnsavtalen nedenfor |
| Forlengelse | $h_i(z)$ når vi bruker fjærer i stedet for faste lengder |

Høydene måles fra linjen gjennom krokene. De hengende punktene har negativ
høyde; negativ energi er derfor helt i orden. Energi måles i J = N·m.

### Oppsett

På siden lastes NumPy, SciPy og figurhjelperne automatisk. Derivatene er
også ferdige: `grad_energy(z)` gir $g=\nabla E$, og `jac_links(z)` gir
$J$, matrisen med radene $\nabla h_i^T$. Du skal bruke dem, ikke derivere dem.

Fullfør først funksjonen `h` i del 1 og senere `F_mu` i del 3. De andre
cellene kan kjøres i vilkårlig rekkefølge når disse studentfunksjonene er
definert; hver celle finner sine egne løsningsdata.

::: {.details title="Egen notebook: last ned oppsettet og kom i gang"}

Last ned [project_week12_setup.py](../assets/project_week12_setup.py){download="project_week12_setup.py"}
til samme mappe som notebooken. Kjør `from project_week12_setup import *`,
og kopier prosjektcellene i rekkefølge. Du trenger NumPy, SciPy og Matplotlib.
Kontroller med **Restart / Run all**, og ta med oppsettsfilen ved levering.

:::

## 1. Finn og kontroller formen

**Her begynner prosjektarbeidet.** Vi bruker den ferdige modellen til å
beregne, kontrollere og tolke en løsning. Du skal ikke utlede fysikken.

Vi begynner med to ledd på 2.5 m og ett fritt punkt. De eneste tillatte
punktene er $(2,-1.5)$ og $(2,1.5)$. Vi bruker fortegnsavtalen

$$L=E+\lambda^Th,\qquad g+J^T\lambda=0.$$

Formlene for $g$ og $J$ er gitt i oppsettet. Cellen beregner energien og
løser det lille lineære systemet for multiplikatorene ved begge punktene.

```{pyodide-python}
#| label: project-week12-one-joint
#| feedback-context: ide-project_week12-reference-assumptions, ide-project_week12-energy-4bbc55c8, ide-project_week12-grad-energy-93b2c70f, ide-project_week12-jac-links-3145f2a4, ide-project_week12-np-6f11581d
for point in [np.array([2., -1.5]), np.array([2., 1.5])]:
    J = jac_links(point)
    g = grad_energy(point)
    lam = np.linalg.lstsq(J.T, -g, rcond=None)[0]
    print('punkt:', point, ' E:', energy(point), ' lambda:', lam.round(3))
```

**Les svaret:** Hvilket punkt minimerer energien? Begge oppfyller
Lagranges likning; er den likningen alene nok til å velge minimumet?

Med vår avtale betyr positiv $\lambda_i$ at leddet trekker. På punkt
$p_j$ virker tyngden $(0,-w)$, venstre ledd med $-\lambda_ju_j$ og høyre
ledd med $+\lambda_{j+1}u_{j+1}$. Summen er null i likevekt. Negativ
multiplikator ville bety trykk, ikke trekk.

### Fra punkter til en kravvektor

Resten av prosjektet har **ti ledd på 0.5 m** mellom $(0,0)$ og $(4,0)$.
Det gir ni frie punkter og 18 ukjente koordinater. SLSQP løser problemet;
du forteller den hva «fast lengde» betyr.

**Kodespor 1.** `joints(z)` gir alle punktene som rader i en matrise.
Fullfør `h` med `np.diff(P, axis=0)` og `np.linalg.norm(..., axis=1)`.
`lengths` kan være ett tall eller én lengde for hvert ledd.

```{pyodide-python}
#| label: project-week12-student-h
#| feedback-context: ide-project_week12-reference-assumptions, ide-project_week12-flat-start-e1ee4cb0, ide-project_week12-joints-b2a79435, ide-project_week12-np-6f11581d
def h(z, lengths=0.5):
    P = joints(z)
    # TODO: lengden av hvert ledd minus lengths.
    raise NotImplementedError('Fullfør kravfunksjonen h')

print('din verdi:', np.round(h(flat_start()), 4))
print('forventet: [ 0.1403 -0.1 -0.1 -0.1 -0.1 -0.1 -0.1 -0.1 -0.1  0.1403]')
```

**Koble sammen språkene:** Hvor mange komponenter har $h$ og $g$? Hvilken
form må $J$ og $J^T$ ha for at $g+J^T\lambda$ skal være en vektor med
18 komponenter? Forklar hva én komponent av `h` måler.

Når kontrollen stemmer, finner den ferdige løseren formen. Cellen skriver
ut både løsermeldingen og størrelsen på kravbruddene, og tegner løsningen.

```{pyodide-python}
#| label: project-week12-exact
#| feedback-context: ide-project_week12-reference-assumptions, ide-project_week12-flat-start-e1ee4cb0, ide-project_week12-h-e2618920, ide-project_week12-joints-b2a79435, ide-project_week12-np-6f11581d, ide-project_week12-plot-chain-df10e56f, ide-project_week12-solve-exact-4a89bf32
res = solve_exact(h)
print('success:', res.success, ' melding:', res.message)
print('største |h_i|:', f'{np.abs(h(res.x)).max():.2e}')
print('energi:', round(res.fun, 6), 'J')
print('laveste høyde:', round(joints(res.x)[:, 1].min(), 4), 'm')
plot_chain(flat_start(), res.x, labels=['start', 'SLSQP'])
```

**Vurder løsningen:** Er den tillatt innenfor den nøyaktigheten du ser?
Passer formen med symmetrien i dataene? Bruk utskriften i svaret.
Et vellykket stopp og små kravbrudd er nyttige kontroller; de er ikke
alene et bevis for et globalt minimum i et ikke-lineært problem.

## 2. Les multiplikatorene som krefter og priser

Nå kjenner vi formen. For å finne $\lambda$ løser vi
$J^T\lambda\approx-g$ med minste kvadrater fra [uke 4](uke4.qmd#uke4-mk).
Samme framgangsmåte virker med begge SciPy-versjonene vi bruker, uavhengig
av hvilke multiplikatorer selve SLSQP-utgaven rapporterer.

Cellen finner formen på nytt og skriver ut både $\lambda$ og residualen
i stasjonaritetslikningen. Rad 0 i Python er ledd 1 i matematikken.

```{pyodide-python}
#| label: project-week12-multipliers
#| feedback-context: ide-project_week12-reference-assumptions, ide-project_week12-grad-energy-93b2c70f, ide-project_week12-h-e2618920, ide-project_week12-jac-links-3145f2a4, ide-project_week12-np-6f11581d, ide-project_week12-solve-exact-4a89bf32
res = solve_exact(h)
J = jac_links(res.x)
g = grad_energy(res.x)
lam = np.linalg.lstsq(J.T, -g, rcond=None)[0]
print('rang til J:', np.linalg.matrix_rank(J))
print('stasjonaritetsfeil:', f'{np.linalg.norm(g + J.T @ lam):.2e}')
print('ledd:  ', np.arange(1, 11))
print('lambda:', np.round(lam, 4))
```

**Les tabellen:** Hvilke ledd trekker mest, og hvilke trekker minst?
Hva i kjettingformen kan forklare mønsteret? Knytt sammen fortegn,
symmetri og størrelser før du går videre.

### Samme likning komponent for komponent

Kraftbalansen kan også skrives som en kort vektorlikning:

$$\begin{bmatrix}0\\w\end{bmatrix}+\lambda_ju_j-\lambda_{j+1}u_{j+1}=0.$$

Skriv dens $x$- og $y$-komponent. Dette er bare å legge sammen vektorer;
derivatene er allerede gitt. Hvilken komponent skal være lik fra ledd
til ledd, og hvilken differanse skal være lik vekten $w$?

**Kodespor 2.** Fullfør uttrykket for den vannrette delen. Cellen
sammenligner komponentene med stasjonaritetskontrollen over.

```{pyodide-python}
#| label: project-week12-balance
#| feedback-context: ide-project_week12-reference-assumptions, ide-project_week12-directions-3beb3934, ide-project_week12-h-e2618920, ide-project_week12-multipliers-40736c49, ide-project_week12-np-6f11581d, ide-project_week12-solve-exact-4a89bf32, ide-project_week12-w-fd4dd3b0
res = solve_exact(h)
lam = multipliers(res.x)
U = directions(res.x)
horizontal = None  # TODO: lambda_i ganger x-komponenten til u_i.
vertical = lam[1:]*U[1:, 1] - lam[:-1]*U[:-1, 1]
print('vannrett del:', np.round(np.asarray(horizontal, float), 5))
print('loddrett differanse:', np.round(vertical, 5), ' forventet:', w)
print('loddrett del i endeleddene:', (lam*U[:, 1])[[0, -1]].round(4))
```

**Konkluder:** Støtter tallene komponentlikningene dine? Bruk også de to
endeleddene til å kontrollere at de til sammen bærer vekten av ni punkter.
Det er samme stasjonaritetslikning som før, nå med en tolkning av hver del.

### Litt mer lengde: en lokal pris

En multiplikator gir også følsomheten til optimal energi. For en regulær,
stabil lokal løsning er den ferdige formelen

$$\frac{dE_*}{d\ell_i}=-\lambda_i.$$

Pluss litt lengde gir altså omtrent $-\lambda_i$ ganger lengdeendringen
i energi. Fortegnet følger av $h_i=\text{lengde}-\ell_i$ og avtalen for $L$.
Som i [prosjekt 11](project_week11.qmd) er dette en **lokal** pris.

Cellen gjør ledd 5 litt lengre og kontrollerer formelen ved to små
endringer. Den starter den nye løsningen i den gamle formen.

```{pyodide-python}
#| label: project-week12-price
#| feedback-context: ide-project_week12-reference-assumptions, ide-project_week12-h-e2618920, ide-project_week12-multipliers-40736c49, ide-project_week12-np-6f11581d, ide-project_week12-solve-exact-4a89bf32
res = solve_exact(h)
lam = multipliers(res.x)
for d in [1e-3, 1e-4]:
    lengths = np.full(10, 0.5)
    lengths[4] += d
    changed = solve_exact(h, lengths=lengths, z0=res.x)
    quotient = (changed.fun - res.fun)/d
    print('d:', d, ' endring/d:', round(quotient, 5),
          ' -lambda_5:', round(-lam[4], 5), ' success:', changed.success)
```

**Les og vurder:** Stemmer fortegnet? Blir differansekvotienten nærmere
$-\lambda_5$ når endringen blir mindre? Hvorfor er dette en tilnærming,
og hvorfor kan vi ikke uten videre bruke samme pris for en stor endring?

## 3. Bytt de stive leddene med fjærer

Et annet valg er å tillate litt lengdefeil og straffe den. Da kan BFGS
løse et problem uten eksplisitte krav. Med stivhet $\mu>0$ bruker vi

$$F_\mu(z)=E(z)+\frac\mu2\lVert h(z)\rVert_2^2.$$

Her er $\lVert h\rVert_2^2=\sum_i h_i^2$. Gradienten er ferdig:

$$\nabla F_\mu=g+\mu J^Th.$$

Sammenlign denne med $g+J^T\lambda=0$. **Hvilken vektor spiller rollen
til $\lambda$ når straffeproblemet er nær en stasjonær løsning?**
For et ledd er dette fjærkraft = stivhet ganger forlengelse.

**Kodespor 3.** Skriv straffefunksjonen på én linje. Den ferdige
`solve_penalty` bruker gradientformelen over. Hver kjøring har et tak på
1500 iterasjoner; løkken viser også meldingen når løseren ikke lykkes.

```{pyodide-python}
#| label: project-week12-penalty
#| feedback-context: ide-project_week12-reference-assumptions, ide-project_week12-h-e2618920, ide-project_week12-multipliers-40736c49, ide-project_week12-np-6f11581d, ide-project_week12-solve-exact-4a89bf32, ide-project_week12-solve-penalty-745aae83
def F_mu(z, mu):
    # TODO: E(z) + mu/2 ganger summen av h_i(z)^2.
    raise NotImplementedError('Fullfør straffefunksjonen')

exact = solve_exact(h)
lam = multipliers(exact.x)
print(' mu   success  iter   største |h|   formavstand   mu*h_1')
for mu in [1e2, 1e4, 1e6]:
    result = solve_penalty(h, F_mu, mu)
    stretch = h(result.x)
    print(f'{mu:5.0e} {str(result.success):>7} {result.nit:5d}'
          f' {np.abs(stretch).max():13.2e}'
          f' {np.linalg.norm(result.x - exact.x):12.2e} {mu*stretch[0]:9.4f}')
    if not result.success:
        print('  melding:', result.message)
print('sammenlign mu*h_1 med lambda_1 =', round(lam[0], 4))
```

**Les tabellen før du konkluderer:**

1. Hvordan endres største lengdefeil og avstanden til SLSQP-formen når
   $\mu$ øker? Sammenlign faktorer mellom radene.
2. Støtter siste kolonne tolkningen din av multiplikatoren?
3. Blir større $\mu$ også enklere for BFGS? Bruk iterasjoner og meldinger.
   Skill mellom «løseren nådde sin stoppregel» og «formen er nær referansen».

### Hva gjør problemet vanskelig?

En ferdig Hessianformel har et ledd $\mu J^TJ$ pluss et korreksjonsledd
som `penalty_hessian` også tar med. For en vektor $v$ er
$v^T(\mu J^TJ)v=\mu\lVert Jv\rVert_2^2$. Dermed straffes retninger som
endrer lengdene sterkt, mens dette leddet er null for $v$ i nullrommet til $J$.

Cellen bruker en god start for å undersøke krumningen ved stor $\mu$.
Den skriver ut rang, nullromsdimensjon og egenverdier; dette er en annen
kjøring enn sammenligningen fra den flate starten over.

```{pyodide-python}
#| label: project-week12-hessian
#| feedback-context: ide-project_week12-reference-assumptions, ide-project_week12-f-mu-da08b65a, ide-project_week12-h-e2618920, ide-project_week12-jac-links-3145f2a4, ide-project_week12-np-6f11581d, ide-project_week12-penalty-hessian-a6d8b521, ide-project_week12-solve-exact-4a89bf32, ide-project_week12-solve-penalty-745aae83
exact = solve_exact(h)
mu = 1e6
result = solve_penalty(h, F_mu, mu, z0=exact.x)
J = jac_links(result.x)
ev = np.linalg.eigvalsh(penalty_hessian(result.x, mu))
rank = np.linalg.matrix_rank(J)
print('rang:', rank, ' nullromsdimensjon:', J.shape[1] - rank)
print('egenverdier:', np.round(ev, 2))
print('minste/største:', ev[0], ev[-1])
print('kondisjonstall:', f'{ev[-1]/ev[0]:.2e}')
print('success:', result.success, ' melding:', result.message)
```

**Koble til lineær algebra:** Hvor mange retninger ligger i nullrommet?
Hvor mange egenverdier er store sammenlignet med de minste? Forklar
hvorfor $\mu J^TJ$ skiller mellom disse retningene, og bruk
[uke 9](uke9.qmd#uke9-stabilitet) til å tolke kondisjonstallet.

::: {#project-week12-too-stiff}
:::

**Ta med videre:** Et større straffeledd kan gi mindre kravbrudd samtidig
som problemet blir vanskeligere å løse. Tallene avhenger også av start,
stoppregel og avrunding. En løsermelding må derfor leses sammen med
kravfeilen og de andre kontrollene.

## 4. Din undersøkelse: en lampe på kjettingen

Nå legger du til én endring: en lampe på 5 N i leddpunkt 3. Den vekten
blir $w_3=6$ N, mens de andre fortsatt er 1 N. Kravene endres ikke, men
energien blir $E=\sum_jw_jy_j$ og gradienten får de nye vektene på
$y$-plassene. Disse formlene er allerede bygget inn i oppsettet.

**Forutsi:** Hvor blir formen mest endret? Blir den vannrette kraftdelen
fortsatt lik fra ledd til ledd? Begrunn med komponentlikningene i del 2.

Cellen løser den endrede modellen og skriver ut kontrollene. Den siste
kolonnen viser hver loddrett differanse og vekten den skal sammenlignes med.

```{pyodide-python}
#| label: project-week12-lamp
#| feedback-context: ide-project_week12-reference-assumptions, ide-project_week12-directions-3beb3934, ide-project_week12-grad-energy-93b2c70f, ide-project_week12-h-e2618920, ide-project_week12-jac-links-3145f2a4, ide-project_week12-multipliers-40736c49, ide-project_week12-np-6f11581d, ide-project_week12-plot-chain-df10e56f, ide-project_week12-solve-exact-4a89bf32
base = solve_exact(h)
loads = np.ones(9)
loads[2] += 5
changed = solve_exact(h, loads=loads)
lam = multipliers(changed.x, loads)
U = directions(changed.x)
vertical = lam[1:]*U[1:, 1] - lam[:-1]*U[:-1, 1]
print('success:', changed.success, ' største |h|:', np.abs(h(changed.x)).max())
print('stasjonaritetsfeil:', np.linalg.norm(grad_energy(changed.x, loads) + jac_links(changed.x).T @ lam))
print('lambda:', lam.round(4))
print('vannrett del:', (lam*U[:, 0]).round(4))
print('loddrett differanse / vekt:', np.column_stack([vertical, loads]).round(4))
plot_chain(base.x, changed.x, labels=['uten lampe', 'med lampe'])
```

Sammenlign med forutsigelsen. Velg ett mønster i utskriften og ett i
figuren som støtter forklaringen din. Ikke sammenlign bare energiene:
med lampen er selve målfunksjonen endret.

## Spørsmål du skal kunne svare på

Dette er repetisjon, ikke en ekstra innleveringsdel.

1. Hva er valg, mål og krav, og hvilke dimensjoner har $z$, $h$, $J$ og $\lambda$?
2. Hvordan finner vi $\lambda$ med minste kvadrater, og hva kontrollerer residualen?
3. Hvordan blir $g+J^T\lambda=0$ til kraftbalanse komponent for komponent?
4. Hva betyr fortegnet i den lokale prisformelen $dE_*/d\ell_i=-\lambda_i$?
5. Hva må vi sammenligne for å vurdere en straffeløsning?
6. Hvordan hjelper rang, nullrom og egenverdier oss å forklare stor stivhet?
7. Hvorfor bør en `success`-verdi aldri være hele konklusjonen?

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med de tre fullførte
kodeuttrykkene og de kjørte cellene. Ta med:

- dimensjonene og den korte komponentoversettelsen fra del 1–2;
- multiplikatortabellen, lengdeendringen og straffetabellen, med korte
  konklusjoner som peker på tall i din egen utskrift;
- figuren og kontrollene for lampen, med forutsigelse og konklusjon.

Avslutt med **150–250 ord** om hva multiplikatorene betyr og hva det
koster å erstatte faste lengder med et straffeledd. Bruk egne resultater,
og skill mellom numeriske kontroller og et bevis for et globalt minimum.
