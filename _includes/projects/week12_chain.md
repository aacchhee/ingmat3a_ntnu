## Hva betyr en Lagrangemultiplikator?

Heng en kjetting mellom to kroker, og den finner formen sin helt av seg selv.
Men hvorfor akkurat den formen? Svaret er et optimeringsproblem med
**likhetskrav**, temaet i [uke 12](uke12.qmd): kjettingen henger så lavt den
kan, men hvert ledd har fast lengde. Det er nøyaktig den typen problem
Lagranges metode er laget for. Vi skal bruke kjettingen til å svare på to
spørsmål:

- **Hva betyr Lagrangemultiplikatorene?** Her viser de seg å være kreftene som
  strekker hvert ledd, og samtidig en pris, som dualprisene i
  [prosjekt 11](project_week11.qmd).
- **Hva skjer hvis vi bytter de stive leddene med svært stive fjærer?** Det er
  **straffemetoden**: kravene erstattes av et straffeledd. Stivere fjærer gir
  et bedre svar, men et vanskeligere problem.

Du regner ett leddpunkt for hånd, skriver fire korte kodebiter, og bruker
ferdige celler for SLSQP, BFGS og figurer. Sett av omtrent 4–6 timer. Skriv
en kort forventning før hvert forsøk, og sammenlign med det du får. Det er
helt i orden å bomme: en forventning som ikke stemmer, er ofte der du lærer
mest.

### En vei gjennom prosjektet

| Del | Spørsmålet vi arbeider med | Det du tar med videre |
|:--|:--|:--|
| 1. Ett leddpunkt for hånd | Hva gir Lagranges likninger når vi kan regne alt? | Multiplikatoren og hva den betyr. |
| 2. Ti ledd med eksakte krav | Hvordan finner vi multiplikatorene fra en numerisk løsning? | Multiplikatortabellen og to kontroller. |
| 3. Multiplikatoren er en pris | Hva er én millimeter mer kjetting verdt? | $dE_*/d\ell_i=-\lambda_i$. |
| 4. Fjærer i stedet for ledd | Hvor stive må fjærene være, og hva koster det? | Straffetabellen og kondisjonstallet. |
| 5. Din undersøkelse | Holder forklaringen når vi endrer kjettingen? | Forutsigelse og kontroll. |

### Først et bilde: en kjetting med tre ledd

Før vi skriver en eneste formel, leker vi litt. Appleten viser en liten
kjetting med tre ledd. Endene $p_0$ og $p_3$ sitter fast i to kroker, 4 m fra
hverandre. Leddene er $1.5$ m, $2$ m og $1.5$ m lange, og i hvert av de to
frie leddpunktene $p_1$ og $p_2$ henger en vekt på $1$ N.

Dra i $p_1$ eller $p_2$. Leddene kan ikke strekkes, så $p_1$ kan bare gli
langs den lyseblå sirkelbuen rundt $p_0$, og $p_2$ langs buen rundt $p_3$.
Flytter du det ene punktet, følger det andre med. Øverst ser du energien $E$,
som her bare er summen av de to høydene (avtale 6 under forklarer hvorfor),
og vinklene. Den tredje linjen viser at alle leddlengdene står fast.

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

Prøv dette:

1. Dra $p_1$ fram og tilbake langs buen. Hvor blir $E$ minst?
2. Trykk **vis likevekt**. Hvordan ligger midtleddet nå? Hvorfor er det
   rimelig at formen er symmetrisk?
3. Følg de røde pilene. Hvilke vinkler er negative, og hvilke er positive?
4. Kryss av for **vis krefter**. I hvert leddpunkt står tre piler etter
   hverandre, én svart og to lilla. Hva skjer med dem i likevekt, og hva
   skjer når du drar $p_1$ bort fra likevekten?

**Hva viser bildet?** Kjettingen henger der energien er minst. I likevekt er
$p_1=(1,\,-1.118)$ og $p_2=(3,\,-1.118)$, midtleddet er vannrett, og
$E=-2.236$ J. Alle tre lengdene er de samme hele tiden: det er kravene. Med
**vis krefter** lukker de tre pilene seg til en trekant i likevekt, og
kraftgapet er null. Utenfor likevekt mangler det noe, og den rosa pilen viser
hva. Hva pilene betyr, finner du ut selv i del 1. Resten av prosjektet gjør
dette bildet til matematikk, med ti ledd i stedet for tre.

### Fra bildet til matematikk, seks avtaler

Alt du så i appleten, har et matematisk navn. Vi går gjennom seks avtaler,
én om gangen, og hver av dem kan du peke på i bildet. Les dem rolig; de
gjelder hele veien.

**1. Punktene og leddene har nummer.** I appleten heter punktene
$p_0,p_1,p_2,p_3$ fra venstre mot høyre. Ledd $i$ går fra $p_{i-1}$ til $p_i$:
ledd 1 fra $p_0$ til $p_1$, ledd 2 fra $p_1$ til $p_2$, og så videre.
Leddpunkt $j$ berører derfor ledd $j$ (til venstre) og ledd $j+1$ (til høyre).
De ukjente er koordinatene til de frie punktene, samlet i én vektor $z$. I
appleten er $z=(x_1,y_1,x_2,y_2)$.

**2. Et ledd med fast lengde er et krav.** I appleten kunne $p_1$ bare gli
langs en sirkelbue, fordi avstanden til $p_0$ alltid er $1.5$ m. Matematisk
blir hvert ledd en likning $h_i(z)=0$, med
$h_i(z)=\lVert p_i-p_{i-1}\rVert_2-\ell_i$, altså
$h_i=\text{lengde}-\ell_i$, der $\ell_i$ er lengden ledd $i$ skal ha. Tre
ledd gir tre krav, $h_1$, $h_2$ og $h_3$. Lengder måles i meter.

**3. Pilen $u_i$ peker fra venstre mot høyre.** De røde pilene er
enhetsvektorene $u_i=(p_i-p_{i-1})/\lVert p_i-p_{i-1}\rVert_2$. De har lengde
1, og hver av dem peker langs sitt ledd fra venstre mot høyre, enten leddet
går opp eller ned.

**4. Vinkelen er negativ når leddet går nedover.** Vi skriver
$u_i=(\cos\theta_i,\sin\theta_i)$. Vinkelen $\theta_i$ måles fra positiv
$x$-akse og er **negativ** når leddet går nedover. I likevekten i appleten er
$\theta_1\approx-48.2^\circ$, $\theta_2=0^\circ$ og $\theta_3\approx48.2^\circ$.
På venstre halvdel av kjettingen er altså $\sin\theta_i<0$, og på høyre
halvdel er $\sin\theta_i>0$.

**5. Høyder måles fra linjen gjennom endene.** Den prikkede linjen i appleten
er nullnivået $y=0$. Alle leddpunktene henger under den, så høydene er
negative, og $E$ blir negativ. Det gjør ingenting: bare forskjeller i $E$
betyr noe.

**6. Energi er vekt ganger høyde.** Hvert fritt leddpunkt har vekt $w=1$ N, og
leddene selv regnes som vektløse. Potensiell energi er vekt ganger høyde, så
målfunksjonen er summen av høydene ganget med $w$: $E=w\,(y_1+y_2)$ i
appleten. Med flere ledd summerer vi over alle de frie leddpunktene. $E$
måles i joule, J = N·m. Å henge «så lavt som mulig» betyr å minimere $E$.

### Kjøring på siden eller i egen notebook

Oppsettet lastes automatisk på siden. Det inneholder `joints`, `energy`,
`grad_energy`, `directions`, `jac_links` (Jacobimatrisen til $h$), `flat_start`,
`penalty_hessian`, `plot_chain` og `plot_constraint_circles`. Kjør cellene i
rekkefølge.

<details>
<summary>Egen notebook: last ned oppsettet og kom i gang</summary>

Last ned [project_week12_setup.py](../assets/project_week12_setup.py){download="project_week12_setup.py"}
og legg filen ved siden av notebooken. Kjør først

```python
from project_week12_setup import *
```

Du trenger NumPy, SciPy og Matplotlib. Kopier deretter cellene fra
prosjektet i rekkefølge. Kontroller til slutt notebooken med
**Restart / Run all**, og ta med oppsettsfilen ved levering.

</details>

## 1. Ett leddpunkt for hånd

Nå regner vi selv, på den minste kjettingen som finnes: to ledd og ett fritt
punkt. Her kan vi finne alt med blyant, også multiplikatorene, og se hva de
betyr før datamaskinen tar over. Alt resten av prosjektet bygger på denne
lille regningen, så ta deg god tid.

Kjettingen har to ledd på $2.5$ m mellom endene $p_0=(0,0)$ og $p_2=(4,0)$;
bare i denne delen er $p_2$ et endepunkt. Det eneste frie leddpunktet er
$p=(x,y)$, med vekt $w$.

| Rolle | Uttrykk |
|:--|:--|
| Valg | $p=(x,y)$ |
| Mål | Minimer $E=w\,y$ |
| Krav | $h_1=\lVert p-p_0\rVert_2-2.5=0$ og $h_2=\lVert p_2-p\rVert_2-2.5=0$ |

Hvert krav sier at $p$ ligger på en sirkel med radius $2.5$ m, akkurat som
sirkelbuene i appleten. Cellen tegner de to kravsirklene rundt endene og de
to punktene der de skjærer hverandre, og kontrollerer at begge punktene
ligger $2.5$ m fra begge endene.

```{pyodide-python}
#| label: project-week12-one-joint
centres = np.array([[0., 0.], [4., 0.]])        # p_0 og p_2
candidates = np.array([[2., -1.5], [2., 1.5]])  # skjæringspunktene mellom sirklene
for p in candidates:
    print(p, 'avstand til endene:', np.linalg.norm(p - centres, axis=1))
plot_constraint_circles(centres, 2.5, candidates, labels=['kandidat (2, -1.5)', 'kandidat (2, 1.5)'])
```

Figuren viser hvor punktet *kan* ligge. Hvor det *vil* ligge, og hvilke
krefter som holder det der, finner du med de fire punktene under. Først to
verktøy.

**Fortegnsavtalen.** Vi bruker $L=E+\sum_i\lambda_ih_i$ og
$h_i=\text{lengde}-\ell_i$, som i uke 12. Lagranges likning er da
$\nabla E+\sum_i\lambda_i\nabla h_i=0$.

**To regneregler fra flervariabel analyse** er gitt:

- gradienten til $\lVert p-q\rVert_2$ med hensyn på $p$ er enhetsvektoren
  $(p-q)/\lVert p-q\rVert_2$;
- derfor er $\nabla_{p_i}h_i=u_i$ og $\nabla_{p_{i-1}}h_i=-u_i$, og alle
  andre deriverte av $h_i$ er null.

I appleten ser du halvparten av den første regelen: $p_1$ kan bare gli langs
buen, altså på tvers av $u_1$, og da endres ikke lengden av ledd 1. Et lite
steg langs $u_1$ ville gjort leddet like mye lengre. Gradienten peker dit
lengden vokser raskest.

Nå de fire punktene:

1. **Kravene alene.** Vis med Pytagoras at sirklene skjærer hverandre i
   $(2,\pm1.5)$. Hvilket av de to tillatte punktene velger målet $E=w\,y$?
2. **Retningene.** Vis at $u_1=(0.8,-0.6)$ og $u_2=(0.8,0.6)$ i det nederste
   punktet. Hva er $\sin\theta_1$ og $\sin\theta_2$?
3. **Lagranges likning.** Fyll inn de to parentesene med regnereglene. Her
   er $p$ sluttpunktet til ledd 1 og startpunktet til ledd 2:
   $$\nabla E+\lambda_1\nabla_ph_1+\lambda_2\nabla_ph_2
   =\begin{bmatrix}0\\w\end{bmatrix}+\lambda_1\bigl(\quad\bigr)+\lambda_2\bigl(\quad\bigr)=0.$$
   Skriv $x$-komponenten og $y$-komponenten hver for seg, og løs for
   $\lambda_1$ og $\lambda_2$ med $w=1$ N.
4. **Det øverste punktet.** Løs den samme likningen i $(2,1.5)$, der
   $u_1=(0.8,0.6)$ og $u_2=(0.8,-0.6)$. Hvilket fortegn får multiplikatorene?

Står du fast i punkt 3, er det helt normalt: skriv først opp vektorene i de
to parentesene med tall, og legg sammen komponent for komponent.

<details>
<summary>Regnehjelp: de to komponentene</summary>

Regnereglene gir $\nabla_ph_1=u_1$ og $\nabla_ph_2=-u_2$, så likningen er
$$\begin{bmatrix}0\\w\end{bmatrix}+\lambda_1u_1-\lambda_2u_2=0.$$

$x$-komponenten er $0.8\lambda_1-0.8\lambda_2=0$, så $\lambda_1=\lambda_2$.
$y$-komponenten er $w-0.6\lambda_1-0.6\lambda_2=0$, så
$\lambda_1=\lambda_2=w/1.2\approx0.833$ N. Den vannrette delen er
$\lambda_1\cos\theta_1=0.833\cdot0.8\approx0.667$ N.

I det øverste punktet er $y$-komponenten $w+0.6\lambda_1+0.6\lambda_2=0$, så
$\lambda_1=\lambda_2\approx-0.833$ N: negativ.

</details>

Nå kommer fysikken, og pilene fra appleten. I mekanikk kalles $\lambda_i$
**strekkraften** i ledd $i$. Gang likningen i punkt 3 med $-1$:

$$\begin{bmatrix}0\\-w\end{bmatrix}-\lambda_1u_1+\lambda_2u_2=0.$$

Her er $(0,-w)$ tyngden, som peker ned (den svarte pilen i appleten). Ledd 1
trekker leddpunktet tilbake mot $p_0$, altså i retning $-u_1$, med kraften
$\lambda_1$, og ledd 2 trekker mot $p_2$, i retning $u_2$, med kraften
$\lambda_2$ (de to lilla pilene). Summen av kreftene er
null: det er kraftbalansen. Det var dette du så med **vis krefter** i
appleten: i likevekt lukker de tre pilene seg til en trekant. Lagranges
likning er altså kraftbalansen med alle fortegn snudd, fordi $\nabla E$
peker dit energien *øker*, mens tyngden peker dit den *avtar*. I det øverste
punktet er multiplikatorene negative: leddene skyver i stedet for å trekke,
som i en bue. Målet $E$ velger det nederste punktet, der begge trekker.

Generelt virker ledd $i$ på $p_i$ med kraften $-\lambda_iu_i$ (mot $p_{i-1}$)
og på $p_{i-1}$ med $+\lambda_iu_i$ (mot $p_i$). Med $\lambda_i>0$ trekkes
endene mot hverandre: leddet **trekker**. Strekkreftene måles i newton, N,
akkurat som $w$.

**Ta med videre:** Multiplikatoren er kraften som skal til for å holde kravet
oppfylt; positiv betyr trekk, negativ betyr trykk. $x$-komponenten av
Lagranges likning ga lik vannrett del i begge leddene.

**Ordboken.** Nå som du har sett at en multiplikator er en kraft, kan vi samle
ordene. Vi bruker bare tre ideer fra skolefysikken: potensiell energi er vekt
ganger høyde, krefter legges sammen som vektorer, og en fjærkraft er stivhet
ganger forlengelse. Hvert fysisk ord på siden betyr nøyaktig det som står i
høyre kolonne, og det er matematikken du arbeider med.

| Fysisk ord | Matematikk |
|:--|:--|
| leddpunkt $j$ | punktet $p_j=(x_j,y_j)$; de to endene ligger fast |
| vekt | $w=1$ N i hvert fritt leddpunkt |
| potensiell energi | målfunksjonen $E(z)=w\cdot(\text{summen av høydene til de frie leddpunktene})$ |
| stivt ledd $i$ | kravet $h_i(z)=\lVert p_i-p_{i-1}\rVert_2-\ell_i=0$ |
| retningen til ledd $i$ | enhetsvektoren $u_i=(\cos\theta_i,\sin\theta_i)$ |
| strekkraften i ledd $i$ | **navnet på multiplikatoren $\lambda_i$** |
| kraftbalanse i leddpunkt $j$ | **Lagranges likning for $p_j$**, med alle fortegn snudd (del 1 og 2) |
| fjær med stivhet $\mu$ | straffeleddet $\tfrac\mu2h_i(z)^2$ (del 4) |
| forlengelse av en fjær | tallet $h_i(z)$ når kravet ikke er oppfylt nøyaktig (del 4) |

## 2. Ti ledd med eksakte krav

Nå blir kjettingen ekte: ti ledd på $\ell=0.5$ m, altså 5 m kjetting over
4 m, slik at punktene går fra $p_0=(0,0)$ til $p_{10}=(4,0)$. Alle leddene
har samme lengde, så $\ell_i=\ell$. De ukjente er de ni frie punktene,
samlet i én vektor $z=(x_1,y_1,\ldots,x_9,y_9)$: 18 tall. Målet er
$E(z)=w\,(y_1+\cdots+y_9)$. I Python er nummereringen én lavere:
`lam[0]` er $\lambda_1$, og rad 0 i `directions(z)` er $u_1$.

Med 18 ukjente og ti krav blir håndregning tungvint, så SLSQP tar over
selve løsningen. Din jobb er å fortelle løseren hva kravene er, og etterpå
finne ut hva multiplikatorene forteller. Vi går fram i tre små steg: skriv
kravfunksjonen, løs, og les av multiplikatorene. Energien og Jacobimatrisen
er ferdige.

**Kode 1.** Uten kravfunksjonen vet ikke SLSQP hva «fast lengde» betyr. Fullfør
`h(z, lengths)`. Den skal returnere de ti tallene
$\lVert p_i-p_{i-1}\rVert_2-\ell$. Bruk `joints(z)`, `np.diff(..., axis=0)` og
`np.linalg.norm(..., axis=1)`. Argumentet `lengths` er $\ell$; det kan være ett
tall eller ti tall (del 3). Utskriften sammenligner svaret ditt med det
forventede for startformen.

```{pyodide-python}
#| label: project-week12-student-h
def h(z, lengths=0.5):
    P = joints(z)            # rader p_0, p_1, ..., p_10
    # TODO: returner lengden av hvert ledd minus lengths (ti tall).
    raise NotImplementedError('Fullfør kravfunksjonen h')

print('din verdi:', np.round(h(flat_start()), 4))
print('forventet: [ 0.1403 -0.1 -0.1 -0.1 -0.1 -0.1 -0.1 -0.1 -0.1  0.1403]')
```

Kontrollen bruker startformen: ni punkter på linjen $y=-0.5$. Forklar for
hånd hvorfor første ledd er $0.1403$ for langt og de midterste $0.1$ for korte.

Når `h` stemmer, kan løseren gjøre jobben. Den ferdige cellen løser
problemet med SLSQP fra startformen, med alle ti kravene samtidig, og tegner
startformen og løsningen i samme figur:

```{pyodide-python}
#| label: project-week12-exact
def solve_exact(lengths=0.5, z0=None, loads=None):
    z0 = flat_start() if z0 is None else z0
    return minimize(energy, z0, args=(loads,), jac=grad_energy, method='SLSQP',
                    constraints=[{'type': 'eq', 'fun': h, 'jac': jac_links, 'args': (lengths,)}],
                    options={'ftol': 1e-14, 'maxiter': 500})

res = solve_exact()
z_exact = res.x
print('success:', res.success, '  største |h_i|:', f'{np.abs(h(z_exact)).max():.1e}')
print('E* =', round(res.fun, 6), 'J   laveste punkt:', round(joints(z_exact)[:, 1].min(), 4), 'm')
plot_chain(flat_start(), z_exact, labels=['start', 'SLSQP'])
```

Kravene er oppfylt til avrundingsnivå, $E_*\approx-8.292394$ J, og laveste
punkt ligger $1.3343$ m under endene.

### Multiplikatorene fra stasjonaritetskravet

Nå har vi formen, men ikke kreftene. SciPy 1.14 i nettleseren gir ikke
multiplikatorene, og nyere SciPy-versjoner gir `res.multipliers`, men med
motsatt fortegn av vårt. Som i uke 12.5 velger vi derfor selv de $\lambda$
som gjør stasjonaritetsfeilen $\lVert\nabla E+J^T\lambda\rVert_2$ minst; det
virker overalt. Det er et minste kvadraters problem med ti ukjente
([uke 4](uke4.qmd#uke4-mk)). Cellen løser det og skriver ut feilen og de ti
multiplikatorene:

```{pyodide-python}
#| label: project-week12-multipliers
J = jac_links(z_exact)
lam = np.linalg.lstsq(J.T, -grad_energy(z_exact), rcond=None)[0]
print('stasjonaritetsfeil:', f'{np.linalg.norm(grad_energy(z_exact) + J.T @ lam):.1e}')
print('lambda (N):', np.round(lam, 4))
```

Stasjonaritetsfeilen er liten, og multiplikatorene er
$5.6238,\ 4.8608,\ 4.1985,\ 3.6915,\ 3.4099$ på venstre halvdel, speilet på
høyre. Alle er positive: hvert ledd trekker.

### Lagranges likning i ett leddpunkt

Hvorfor er strekkreftene størst ved endene? For å se det tar vi fram blyanten
igjen. Det er samme regning som i del 1, bare for et vilkårlig leddpunkt
$p_j$. Bare $h_j$ og $h_{j+1}$ avhenger av $p_j$. Vis med regnereglene at
Lagranges likning for $p_j$ blir

$$\nabla_{p_j}E+\lambda_j\nabla_{p_j}h_j+\lambda_{j+1}\nabla_{p_j}h_{j+1}
=\begin{bmatrix}0\\w\end{bmatrix}+\lambda_ju_j-\lambda_{j+1}u_{j+1}=0.$$

1. Skriv $x$-komponenten. Vis at $\lambda_j\cos\theta_j$ er **det samme tallet
   for alle ti ledd**. Dette er «den vannrette strekkraften er konstant», og
   den følger av at $E$ ikke avhenger av $x$-koordinatene.
2. Skriv $y$-komponenten:
   $\lambda_{j+1}\sin\theta_{j+1}-\lambda_j\sin\theta_j=w$. Hvert leddpunkt
   bærer sin egen vekt.
3. Bruk symmetrien og punkt 2 til å **forutsi** $\lambda_1\sin\theta_1$:
   hvor mye av den totale vekten $9w$ bærer hvert endeledd, og hvilket
   fortegn får tallet når $\sin\theta_1<0$? Forklar med dette hvorfor
   strekkraften er størst ved endene. Tips: legg sammen likningene i punkt 2
   fra $j=1$ til $j=9$. Da kansellerer nesten alt, og bare
   $\lambda_{10}\sin\theta_{10}-\lambda_1\sin\theta_1$ blir igjen på venstre
   side.

**Kode 2.** Nå kontrollerer vi punkt 1–3 med tallene fra SLSQP. Rad $i$ i `U = directions(z_exact)`
er $(\cos\theta_{i+1},\sin\theta_{i+1})$. Skriv linjen for de ti tallene
$\lambda_i\cos\theta_i$, og sett inn forutsigelsen din. Linjen for de ni
tallene i punkt 2 er ferdig.

```{pyodide-python}
#| label: project-week12-balance
U = directions(z_exact)
print('sin(theta_i):', np.round(U[:, 1], 3))
# TODO: horizontal = de ti tallene lambda_i cos(theta_i)
horizontal = None
print('vannrett del:', np.round(np.asarray(horizontal, float), 6))
vertical = lam[1:]*U[1:, 1] - lam[:-1]*U[:-1, 1]   # lambda_(j+1) sin(theta_(j+1)) - lambda_j sin(theta_j)
print('loddrett differanse (forventet w = 1):', np.round(vertical, 6))
prediction = None   # TODO: bytt None med forutsigelsen din for lambda_1 sin(theta_1)
print('lambda_1 sin(theta_1):', round(lam[0]*U[0, 1], 4), '  din forutsigelse:', prediction)
```

Du skal få $3.373011$ N i alle ti ledd og $1.000000$ i alle ni leddpunkt.
Legg merke til at dette er de samme likningene som stasjonaritetsfeilen i
forrige celle, bare skrevet ut komponent for komponent: når den feilen er
liten, må disse tallene stemme. Det nye er tolkningen: konstant vannrett
kraft, og hvert leddpunkt bærer $w$. Forutsigelsen av $\lambda_1\sin\theta_1$
er derimot en ekte test. Den fulgte av symmetri og summen av likningene før
du så tallet.

**Ta med videre:** Multiplikatorene fra minste kvadrater oppfyller
kraftbalansen i hvert leddpunkt. Tabellen over $\lambda_i$ og den konstante
vannrette delen hører med i leveransen.

## 3. Multiplikatoren er en pris

Hittil har multiplikatorene vært krefter. Nå skal du se at de samtidig er
priser: hvor mye lavere henger kjettingen hvis vi gjør ett ledd en bitte liten
smule lengre? Dette er den samme ideen som i uke 11 og prosjekt 11, bare i en
helt annen drakt.

I uke 12.2 fant vi $df_*/ds=-\lambda$ når kravet $h=0$ flyttes til $h=s$.
Her er $h_i=\text{lengde}-\ell_i$. Gjør vi ledd $i$ lengre med $s$ (i koden
under heter tallet `d`), blir kravet $\text{lengde}-\ell_i=s$. Kjettingen
synker, og $E_*$ blir mindre.
Forutsigelsen er

$$\frac{dE_*}{d\ell_i}=-\lambda_i,$$

med enhet J/m = N. Det er samme idé som strømprisen i
[prosjekt 11](project_week11.qmd): dualverdien sier hva én enhet mer av en
ressurs er verdt. Fortegnet er en avtale. I prosjekt 11 var prisen $\lambda$
lik *pluss* endringen i minste kostnad per MWh mer forbruk. Her skriver vi
$L=E+\sum_i\lambda_ih_i$, og da er $\lambda_i$ lik *minus* endringen i $E_*$
per meter mer ledd. Begge sier hvor mye optimal verdi endres per enhet.

**Kode 3.** Nå tester vi forutsigelsen med en differansekvotient, slik vi
gjorde med prisen i uke 12.2. Gjør ledd 5 (det midterste til venstre,
`lengths[4]`) $10^{-4}$ m lengre, løs på nytt med
`solve_exact(lengths, z_exact)`, og regn ut differansekvotienten
$(E_*^{\text{ny}}-E_*)/10^{-4}$. Starten i `z_exact` gjør at løseren bare
trenger å justere litt. Sammenlign med `-lam[4]`. *(Valgfritt: gjenta for
ledd 1.)*

```{pyodide-python}
#| label: project-week12-price
d = 1e-4
lengths = np.full(10, 0.5)
# TODO: gjør ledd 5 d lenger, løs på nytt fra z_exact og regn ut differansekvotienten.
quotient = None
print('differansekvotient:', quotient, '  forventet -lambda_5:', -lam[4])
```

Du skal få omtrent $-3.4097$ mot $-3.4099$ for ledd 5. For ledd 1 blir det
$-5.6237$ mot $-5.6238$: et lengre endeledd senker kjettingen mest.

Hvorfor er differansekvotienten ikke nøyaktig $-\lambda_i$? Hva forventer du
hvis $d$ blir ti ganger mindre?

**Ta med videre:** $\lambda_i$ er hvor mye $E_*$ synker per meter ekstra
lengde i ledd $i$. Den er størst for endeleddene.

## 4. Fjærer i stedet for stive ledd

Til nå har leddene vært helt stive, og SLSQP har holdt kravene nøyaktig. Men
hva om vi slapp kravene og i stedet brukte svært stive fjærer? Da får vi et
problem uten krav, som BFGS fra uke 8 kan løse. Spørsmålet i denne delen er
hva det koster: hvor nær kommer vi, og hvor vanskelig blir det?

Nå bytter vi hvert stivt ledd med en fjær med stivhet $\mu$ (N/m; bokstaven
$\mu$ betyr stivhet her, ikke en pris som i prosjekt 11). Det er
**straffemetoden**: vi fjerner kravene og legger til et ledd som straffer brudd
på dem,

$$F_\mu(z)=E(z)+\frac\mu2\sum_{i=1}^{10}h_i(z)^2.$$

Fysisk er $\tfrac\mu2h_i^2$ energien i en fjær som er forlenget med $h_i$.

**Utledning.** Deriver ett ledd $\tfrac\mu2h_i(z)^2$ med kjerneregelen, og
vis at et minimum av $F_\mu$ oppfyller

$$\nabla F_\mu=\nabla E+\sum_{i=1}^{10}(\mu\,h_i)\,\nabla h_i=0.$$

Sammenlign med Lagranges likning $\nabla E+\sum_i\lambda_i\nabla h_i=0$.
Hvilket tall spiller rollen til $\lambda_i$? Bruk svaret til å forutsi omtrent
hvor mye endeleddet blir forlenget når $\mu=10^4$ N/m. I fysikk heter
sammenhengen «fjærkraft = stivhet ganger forlengelse».

**Kode 4.** Skriv `F_mu` på én linje. Gradienten er ferdig. Løkken kjører
BFGS fra startformen for fire stivheter og skriver én rad per stivhet, slik at
du kan se hva som skjer når fjærene blir stivere.

```{pyodide-python}
#| label: project-week12-penalty
def F_mu(z, mu):
    # TODO: E(z) + mu/2 * summen av h_i(z)^2
    raise NotImplementedError('Fullfør straffefunksjonen')

def grad_F_mu(z, mu):
    return grad_energy(z) + mu*jac_links(z).T @ h(z)

print('    mu   success  iter  største h   avstand    mu*h_1  (lambda_1 = 5.6238)')
for mu in [1e2, 1e4, 1e6, 1e8]:
    r = minimize(F_mu, flat_start(), args=(mu,), jac=grad_F_mu, method='BFGS',
                 options={'gtol': 1e-6, 'maxiter': 50000})
    stretch = h(r.x)
    print(f'{mu:6.0e}  {str(r.success):7s} {r.nit:5d}  {stretch.max():9.1e}'
          f'  {np.linalg.norm(r.x - z_exact):9.1e}  {mu*stretch[0]:8.4f}')
print('melding ved siste mu:', r.message)
```

Løkken tar noen sekunder i nettleseren. Les tabellen kolonne for kolonne:

- **Forlengelsen** blir omtrent hundre ganger mindre for hver
  hundredobling av $\mu$: $5.3\cdot10^{-2}$, $5.6\cdot10^{-4}$,
  $5.6\cdot10^{-6}$, $5.6\cdot10^{-8}$. Alle $h_i$ er positive: fjærene er
  litt lengre enn $\ell$.
- **Avstanden til den eksakte formen** følger med: $0.60$,
  $7.1\cdot10^{-3}$, $7.1\cdot10^{-5}$ og omtrent $7\cdot10^{-7}$. Regn ut
  avstand ganger $\mu$ for hver rad. Hva ser du?
- **Fjærkraften** $\mu h_1$ nærmer seg multiplikatoren: $5.26$, $5.618$,
  $5.6238$, $5.6238$. Straffemetoden gir altså også et anslag for
  multiplikatorene.
- **Antall iterasjoner** vokser fra noen titall til flere tusen.
- **`success`** er `True` for de minste $\mu$, men blir `False` når $\mu$
  blir stor (med denne starten fra $\mu=10^6$). Meldingen sier «precision
  loss»: linjesøket i BFGS fant ikke lenger et steg det godtok. Svaret er
  likevel godt, som tabellen viser. Les meldingen og kontroller svaret, ikke
  bare flagget.

### Hvorfor blir stive fjærer vanskelige?

$E$ er lineær, så Hessianen til $E$ er null. Hessianen til $F_\mu$ er derfor

$$\nabla^2F_\mu=\mu J^TJ+\sum_i(\mu h_i)\nabla^2h_i
\approx\mu J^TJ+\sum_i\lambda_i\nabla^2h_i.$$

<details>
<summary>Regnehjelp: Hessianen til straffeleddet</summary>

Start med gradienten $\nabla F_\mu=\nabla E+\mu\sum_ih_i\nabla h_i$. Deriver
ett ledd $h_i\nabla h_i$ en gang til med produktregelen: det gir
$\nabla h_i\,\nabla h_i^T+h_i\nabla^2h_i$. Summen av $\nabla h_i\nabla h_i^T$
over $i$ er $J^TJ$, fordi radene i $J$ er $\nabla h_i^T$. Til slutt bruker vi
at $\mu h_i\approx\lambda_i$ fra tabellen over. Kontroll med én variabel:
andrederiverten av $\tfrac\mu2h(z)^2$ er $\mu\bigl(h'(z)^2+h(z)h''(z)\bigr)$.

</details>

$J$ har 10 rader og 18 kolonner. Egenverdiene til Hessianen forteller hvor
smal skålen er, og dermed hvor vanskelig problemet er for BFGS. Den ferdige
cellen regner dem ut ved $\mu=10^6$ og sammenligner med rangen til $J$.

```{pyodide-python}
#| label: project-week12-hessian
mu = 1e6
r = minimize(F_mu, z_exact, args=(mu,), jac=grad_F_mu, method='BFGS', options={'gtol': 1e-6})
ev = np.linalg.eigvalsh(penalty_hessian(r.x, mu))
print('rang til J:', np.linalg.matrix_rank(jac_links(r.x)))
print('egenverdier over 1000:', np.sum(ev > 1000))
print('de minste egenverdiene:', np.round(ev[:3], 3))
print('kappa =', f'{ev[-1]/ev[0]:.2e}', '  kappa/mu =', round(ev[-1]/ev[0]/mu, 3))
```

Cellen gir 10 egenverdier over 1000 og 8 små (den minste $2.166$), og
$\kappa\approx1.775\,\mu$. Forklar de 10 store med rangen til $J$: de 8 små
hører til nullrommet fra uke 3, retningene der kjettingen svinger uten å
endre leddlengdene til første orden. Bruk så uke 6 og 9 til å si hvorfor stor
$\kappa$ gir mange BFGS-iterasjoner.

**Valgfritt: for stive fjærer.** Hva skjer hvis vi går enda lenger? Med
$\mu=10^{10}$ starter vi i den eksakte formen, så søket har nesten ingenting å
gjøre. Cellen skriver ut hvor mange steg BFGS tar, anslaget $\mu h_1$ og
kondisjonstallet:

```{pyodide-python}
#| label: project-week12-too-stiff
mu = 1e10
r = minimize(F_mu, z_exact, args=(mu,), jac=grad_F_mu, method='BFGS', options={'gtol': 1e-6})
print('iterasjoner:', r.nit, '  success:', r.success)
print('mu*h_1 =', round(mu*h(r.x)[0], 4), '  lambda_1 =', round(lam[0], 4))
ev = np.linalg.eigvalsh(penalty_hessian(r.x, mu))
print('kappa =', f'{ev[-1]/ev[0]:.1e}')
```

Søket stopper etter noen få steg med `success=False`, og $\mu h_1\approx4.97$
i stedet for $5.62$. Kondisjonstallet er nå omtrent $1.7\cdot10^{10}$. BFGS
lærer krumningen fra gradientforskjeller, og når krumningen varierer med en
faktor $10^{10}$, finner linjesøket ikke lenger et steg det godtar. Det finnes
fortsatt bedre punkter: gradienten har lengde omtrent $3.5$. Det er altså
metoden som gir opp. Med enda større $\mu$ kommer i tillegg avrundingen:
feilen i $\mu h_i$ er omtrent $\mu\cdot10^{-15}$ (uke 1). Straffemetoden har
dermed en grense i begge retninger: for liten $\mu$ gir en straffefeil
proporsjonal med $1/\mu$, og for stor $\mu$ gir et problem som er vanskelig å
løse nøyaktig. Med BFGS skjer det allerede ved $\mu=10^{10}$.

**Ta med videre:** Med stive ledd (SLSQP) får vi kravene nøyaktig og
multiplikatorene fra minste kvadrater. Med fjærer får vi et problem uten krav,
men med en feil som avtar som $1/\mu$ og et kondisjonstall som vokser som
$\mu$ ($\kappa\approx1.8\mu$).

## 5. Din egen undersøkelse

Nå er det du som bestemmer. Du har likningene fra del 2–4 og cellene som
løser dem; spørsmålet er om forklaringen holder når vi endrer kjettingen. Velg
**én** endring. Skriv forutsigelsen før du regner, ut fra likningene i del
2–4, og kontroller den med en ny kjøring. En forutsigelse som bommer, er like
verdifull som en som treffer, så lenge du forklarer hvorfor.

- **En lampe.** Heng en lampe på 5 N i leddpunkt 3:
  `loads = np.ones(9); loads[2] += 5`, og bruk `solve_exact(loads=loads)` og
  `grad_energy(z, loads)` i multiplikatorcellen. Matematisk endrer lampen bare
  målfunksjonen: $E=\sum_jw_jy_j$ med $w_3=1+5=6$ N og $w_j=1$ N ellers.
  Kravene er de samme. Hvilke av likningene i del 2
  endres? Blir den vannrette delen fortsatt lik i alle ledd? Hvor endrer
  $\lambda_i$ seg mest?
- **Ett elastisk ledd.** La ledd 10 være en ekte fjær med $\mu=20$ N/m, mens de
  andre er stive. Matematisk fjernes kravet $h_{10}=0$, og målet får leddet
  $\tfrac{20}2h_{10}^2$. Det gir ni krav og et straffeledd for ledd 10. Forutsi
  forlengelsen fra del 4, og sammenlign. Start med
  `F_el = lambda z: energy(z) + 20/2*h(z)[9]**2`, og gi SLSQP bare de ni
  første kravene: `'fun': lambda z: h(z)[:9]` og
  `'jac': lambda z: jac_links(z)[:9]`. Hvorfor stemmer forutsigelsen bare
  omtrent?
- **Flere ledd.** Bruk 20 ledd på $0.25$ m (`flat_start(20)`,
  `lengths=0.25`). Hver av de 19 frie leddpunktene veier fortsatt $w$. Forutsi
  $\lambda_1\sin\theta_1$ før du kjører. Endrer formen seg mye?

Gi forutsigelsen, resultatet og én setning om hva som stemte og hva som ikke
stemte.

## Spørsmål du skal kunne svare på

1. Formuler kjettingproblemet med valg, mål og krav. Hvor mange ukjente og krav
   har det?
2. Hva betyr en Lagrangemultiplikator i dette problemet, og hvorfor er alle
   $\lambda_i$ positive med vår fortegnsavtale?
3. Hvordan finner du multiplikatorene fra en numerisk løsning, og hva
   kontrollerer du etterpå?
4. Hvorfor er $\lambda_i\cos\theta_i$ lik i alle ledd, og hvorfor er
   strekkraften størst ved endene?
5. Hvorfor er en multiplikator en pris for kravet, og hva er fortegnet til
   $dE_*/d\ell_i$?
6. Hva er straffemetoden, hvorfor nærmer $\mu h_i$ seg $\lambda_i$, og hvordan
   avhenger forlengelsen og avstanden til den eksakte formen av $\mu$?
7. Hvorfor blir problemet vanskeligere jo stivere fjærene er? Bruk
   egenverdiene til Hessianen.
8. Hva forteller `success=False` i del 4, og hva forteller det ikke?
9. *(valgfri fordypning)* Hvorfor blir anslaget $\mu h_1$ dårligere igjen for
    svært stive fjærer?
10. *(valgfri fordypning)* Hvordan endres strekkreftene når en lampe henges på
    ett leddpunkt, og hvilken størrelse er fortsatt lik i alle ledd?

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med cellene kjørt, og med:

- håndregningen fra del 1;
- multiplikatortabellen med den vannrette delen;
- straffetabellen;
- din egen undersøkelse med forutsigelse og resultat.

Skriv i tillegg en vurdering på **300–500 ord**: Hva betyr multiplikatorene
her, hvordan kontrollerte du dem, og hva koster det å bytte stive ledd med
stive fjærer? Skill mellom det likningene beviser og det forsøkene støtter.
