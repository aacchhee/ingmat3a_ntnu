## Hvor er jeg?

En mobil i en hall kan måle avstander til faste punkter med kjent
plassering, kalt **ankre**. Enheten vi leter etter, kaller vi **taggen**:
en liten radiobrikke. Fire unøyaktige avstander skal gi oss to koordinater.
Ingen posisjon passer nødvendigvis alle målingene nøyaktig.

Vi bruker **Gauss–Newton**, en variant av Newtons metode for minste
kvadrater. Formlene for de deriverte får du ferdig. Arbeidet ditt er å
sette sammen metoden med lineær algebra, kjøre forsøk og begrunne hva
utskriftene og figurene forteller:

- Når er Gauss–Newton omtrent like rask som Newton?
- Hvordan bestemmer plasseringen av ankrene hvor presist vi finner taggen?
- Hvordan kan en metode konvergere pent og likevel gi et galt svar?

### En vei gjennom prosjektet

| Del | Arbeidet ditt |
|:--|:-- |
| Bakgrunn | Bli kjent med avstandsmålingene og den gitte modellen. |
| 1. Fra modell til metode | Les vektorer og matriser; fullfør ett Gauss–Newton-steg. |
| 2. Les konvergensen | Sammenlign feil og faktorer med tre typer målinger. |
| 3. Les følsomheten | Undersøk målefeil og forklar geometrien med SVD. |
| 4. Konvergert, men feil? | Les diagnosene og fullfør en kort Armijo-løkke. |
| 5. Din påstand | Gjør ett kontrollert forsøk og trekk en avgrenset konklusjon. |

Sett av omtrent **4–6 timer**, inkludert oppsett og en kort oppsummering.
Skriv en forventning før et forsøk, kjør det, og vis til konkrete tall når
du konkluderer. Du skal ikke levere utledninger av deriverte.

### Det vi trenger fra tidligere uker

- **Minste kvadrater** ([uke 4](uke4.qmd#uke4-mk)):
  `np.linalg.lstsq(A, b, rcond=None)[0]` finner vektoren som gjør
  $\|Ac-b\|$ minst. Vi unngår å danne $A^TA$, som har kvadrert
  kondisjonstall når $A$ har full kolonnerang.
- **Newton** ([uke 10.1](uke10.qmd#uke10-newton)): steget løser $Hp=-g$.
- **Konvergensfart** ([uke 2](page4.qmd#uke2-konvergensfart)):
  et omtrent fast forhold $e_{k+1}/e_k$ betyr lineær konvergens; ved
  kvadratisk konvergens blir forholdet stadig mindre nær løsningen.
- **SVD** ([uke 7](uke7.qmd#uke7-geometri)): $Jv_i=\sigma_i u_i$.
  Små singulærverdier betyr at noen retninger er vanskelige å skille.
- **Armijo** ([uke 10.4](uke10.qmd#uke10-demping)):
  halver steget til funksjonsverdien har sunket nok.

### Kjøring på siden eller i egen notebook

På nettsiden lastes dataene og hjelpefunksjonene automatisk. Du får
`residual`, `jacobian`, `move`, en Newton-metode og figurhjelperne
`show_hall` og `show_moves`. Du skriver selv `gn_step` og `armijo_step`;
den korte Gauss–Newton-løkken står ferdig på siden. Etter ny lasting må du
kjøre cellene med disse funksjonene igjen før du fortsetter.

<details>
<summary>Egen notebook: last ned oppsettet og kom i gang</summary>

Last ned [project_week10_setup.py](../assets/project_week10_setup.py){download="project_week10_setup.py"}
og legg den ved siden av notebooken. Start med

```python
from project_week10_setup import *
```

Du trenger NumPy og Matplotlib. Kopier cellene i rekkefølge og kontroller
med **Restart / Run all** før levering. Ta med oppsettsfilen.
SVD-appen i del 3 virker bare på nettsiden; Python-figuren viser samme idé.

</details>

## Bakgrunn: avstandsmålingene og modellen (gitt)

Dette avsnittet gir bakgrunnen for posisjonsmålingen. Du skal bruke den
ferdige modellen, ikke utlede en fysisk modell for radiosignaler.

Hallen er 10 m × 8 m, med ett anker i hvert hjørne:

$$b_1=(0,0),\quad b_2=(10,0),\quad b_3=(10,8),\quad b_4=(0,8).$$

Posisjonen er $z=(x,y)$, og anker $i$ måler avstanden $d_i$.
**Residualen** er beregnet avstand minus målt avstand. Vi samler fire
slike tall i en vektor og minimerer kvadratsummen:

$$r_i(z)=\|z-b_i\|-d_i,\qquad
r(z)=\begin{bmatrix}r_1(z)\\r_2(z)\\r_3(z)\\r_4(z)\end{bmatrix},\qquad
F(z)=\tfrac12\sum_{i=1}^4r_i(z)^2=\tfrac12r(z)^Tr(z).$$

Oppsettet inneholder `hall` med ett anker per rad og tre målevektorer
fra en kjent posisjon `z_true`. Fasiten brukes bare til å undersøke
metodene. I praksis kjenner vi målingene, men ikke posisjonen.

## 1. Fra Newton til Gauss–Newton

**Her begynner prosjektarbeidet i numeriske metoder og lineær algebra.**
Vi bruker den gitte modellen til å beregne posisjonen. Først trenger vi
en matrise som kobler en liten flytting til endringer i avstandene.

### Jacobimatrisen: fire avstandsendringer fra én flytting

**Jacobimatrisen** $J$ samler de deriverte av residualene. Du får formelen:

$$\text{rad }i\text{ i }J(z)=\frac{(z-b_i)^T}{\|z-b_i\|},\qquad z\ne b_i.$$

Raden er en enhetsvektor fra ankeret mot taggen. For et lite steg $p$ er

$$r(z+p)\approx r(z)+J(z)p.$$

For eksempel er raden $(0.6,0.8)$ når ankeret er $(0,0)$ og taggen er
$(3,4)$. En flytting $p=(0.1,0)$ endrer da avstanden med omtrent
$0.6\cdot0.1+0.8\cdot0=0.06$ m.

**Koble sammen skrivemåtene:**

1. Hvilke størrelser har $r$, $J$, $p$ og $Jp$ med fire ankre?
2. Skriv første komponent av $Jp$ som en sum. Hva skjer med denne
   avstanden dersom $p$ står vinkelrett på første rad i $J$?
3. Hvorfor er $\tfrac12r^Tr$ det samme tallet som kvadratsummen over?

Vi kan kontrollere forståelsen uten å derivere. Cellen viser matrisen,
en liten flytting og både anslåtte og faktiske avstandsendringer.

```{pyodide-python}
#| label: project10-residual
z0 = np.array([5., 4.])
p = np.array([.1, 0.])
J = jacobian(z0, hall)
print('J =\n', J.round(3), '  form:', J.shape)
print('J @ p:          ', (J @ p).round(5))
print('faktisk endring:', (residual(z0 + p, hall, d_exact) - residual(z0, hall, d_exact)).round(5))
print('residual i fasiten:', residual(z_true, hall, d_exact))
```

Sammenlign anslag og faktisk endring. Blir samsvaret bedre eller dårligere
når du endrer første komponent i $p$ fra $0.1$ til $0.01$?

### Ett lineært minste kvadraters problem per steg

Gauss–Newton velger $p$ slik at den lineære modellen passer best:

$$\min_p\|Jp+r\|=\min_p\|Jp-(-r)\|.$$

Dette er minste kvadrater fra uke 4, med $A=J$, ukjent $p$ og høyreside
$-r$. Normallikningene er $J^TJp=-J^Tr$, men du skal løse med `lstsq`.

**Kodespor 1:** Fullfør `gn_step`. Løkken som bruker steget, er gitt.
Cellen prøver metoden fra midten av hallen med eksakte målinger og skriver
ut feilen etter hvert steg. Fasiten brukes bare til kontroll.

```{pyodide-python}
#| label: project10-gauss-newton
def gn_step(z, B, d):
    J, r = jacobian(z, B), residual(z, B, d)
    # TODO: returner p som løser min ||J p - (-r)|| med np.linalg.lstsq.
    raise NotImplementedError('Fullfør gn_step')

def gauss_newton(z0, B, d, steps=10):
    z = np.array(z0, float)
    points = [z.copy()]
    for k in range(steps):
        z = z + gn_step(z, B, d)
        points.append(z.copy())
    return np.array(points)

path = gauss_newton([5., 4.], hall, d_exact, steps=6)
for k, z in enumerate(path):
    print(f'k = {k}: z = {z.round(6)}, feil mot fasit = {np.linalg.norm(z - z_true):.1e}')
show_hall(hall, d_exact, [path], ['Gauss–Newton'], true=z_true)
```

Les feiltabellen: på hvilket steg er avstanden til fasiten mindre enn
$10^{-4}$ m? Finn også et tegn på at feilen synker raskere enn med en fast
faktor. Kontrollen med forventet posisjon $(3,5)$ er viktig før del 2.

**Ta med videre:** Ett ikke-lineært problem blir en serie lineære minste
kvadraters problemer. $Jp$ kobler en flytting i planet til endringer i
alle fire målte avstander.

## 2. Like rask som Newton?

Vi beholder ankrene og den kjente posisjonen, men endrer målingene:

| Datasett | Målefeil i de fire avstandene |
|:--|:--|
| `d_exact` | Ingen |
| `d_noisy` | $(0.3,-0.4,0.5,-0.2)$ m |
| `d_bad` | $(0,0,3,0)$ m |

Her er det matematiske resultatet du trenger, ferdig beregnet:

$$g=J^Tr,\qquad H=J^TJ+Q.$$

Newton bruker hele Hessianen $H$. Gauss–Newton bruker bare $J^TJ$.
Hjelperen `dropped_part` beregner $Q$; hvert bidrag til denne matrisen er
ganget med en residual. Når alle residualene er null, er derfor $Q=0$.
Store residualer kan gjøre forskjellen mellom metodene viktig.

Nær en regulær løsning med full kolonnerang i $J$ er Gauss–Newton-feilen
omtrent en matrise ganger forrige feil:

$$e_{k+1}\approx M e_k,\qquad M=-(J^TJ)^{-1}Q.$$

Her er $e_k$ en **feilvektor**. Den forutsagte lokale faktoren er største
absoluttverdi av egenverdiene til $M$ ([uke 6](uke6.qmd#uke6-fikspunkt)).
Når residualene er null og løsningen er regulær, får vi den raske lokale,
kvadratiske konvergensen. Dette er en lokal forklaring, ingen garanti fra
alle startpunkter.

**Forutsi:** I hvilket datasett venter du at Gauss–Newton og Newton har
mest lik fart? Kjør så cellen. Den skriver både feilnormer og forhold
mellom etterfølgende feilnormer. Forhold under avrundingsnivå er markert
med `nan` og skal ikke brukes til å vurdere farten.

```{pyodide-python}
#| label: project10-rates
for name, d in [('eksakte', d_exact), ('små feil', d_noisy), ('feil måling', d_bad)]:
    path = gauss_newton([5., 4.], hall, d, steps=20)
    z_end = path[-1]
    e = np.linalg.norm(path - z_end, axis=1)
    ratios = np.divide(e[1:7], e[:6], out=np.full(6, np.nan), where=e[:6] > 1e-10)
    newton = newton_position([5., 4.], hall, d, residual, jacobian)
    J, r = jacobian(z_end, hall), residual(z_end, hall, d)
    M = -np.linalg.solve(J.T @ J, dropped_part(z_end, hall, r, J))
    print(f'{name}: slutt {z_end.round(3)}, ||r|| = {np.linalg.norm(r):.3f}')
    print('  GN feil:     ', np.array2string(e[:7], precision=1))
    print('  GN forhold:  ', ratios.round(3))
    print('  Newton feil: ', np.array2string(np.linalg.norm(newton-newton[-1], axis=1)[:6], precision=1))
    print(f'  forutsagt GN-faktor: {max(abs(np.linalg.eigvals(M))):.3f}')
```

**Les og konkluder:** Lag tre korte rader i en tabell: residualnorm,
observert konvergenstype og forutsagt faktor. Hvilke feilforhold støtter
konklusjonen din? Bruk også forskjellen mellom $J^TJ$ og $J^TJ+Q$ i
forklaringen. En stor residual og langsom konvergens er ulike ting:
rapporter begge, og ikke bruk bare antall steg som diagnose.

## 3. Hvor presist vet vi hvor vi er?

En rask metode kan finne en usikker posisjon. Vi undersøker derfor hva
som skjer når de målte avstandene endres litt, fra $d$ til $d+\delta d$.
Vi starter ved en løsning med eksakte data og full kolonnerang i $J$.
Den **lineære følsomhetsmodellen** er gitt ved

$$\delta z_{\mathrm{lin}}=\underset{w}{\operatorname{argmin}}\,
\|Jw-\delta d\|.$$

Det er den flyttingen som forklarer måleendringene best. Hjelperen
`move(J, delta_d)` bruker `lstsq` til denne beregningen. Den er en lokal
tilnærming, ikke en eksakt regel for store målefeil.

### Én feil eller samme feil i alle målingene?

Midt i hallen peker rad 1 og rad 3 i $J$ i motsatte retninger. Det samme
gjør rad 2 og rad 4. Derfor er $J^T(1,1,1,1)^T=0$: like store feil i alle
fire avstander har ingen del langs kolonnene i $J$. De gir ingen flytting
i den lineære modellen der. Dette er en symmetri vi kan undersøke.

Cellen sammenligner den lineære modellen med en ny Gauss–Newton-løsning.
Kjør først midt i hallen. Bytt så `z_c` til `z_true`, altså $(3,5)$.

```{pyodide-python}
#| label: project10-moves
z_c = np.array([5., 4.])
d_c = np.linalg.norm(z_c - hall, axis=1)
J = jacobian(z_c, hall)
for label, delta_d in [('anker 1 +10 cm', np.array([.1, 0., 0., 0.])),
                       ('alle fire +10 cm', .1*np.ones(4))]:
    linear = move(J, delta_d)
    full = gauss_newton(z_c, hall, d_c + delta_d, steps=8)[-1] - z_c
    print(f'{label}: lineær {linear.round(4)}, ny løsning {full.round(4)}')
```

Hvor godt stemmer tilnærmingen? Forklar hvorfor svaret for «alle fire»
kan endres når taggen flyttes fra midten. Halver målefeilen i ett av
tilfellene og kontroller om avviket mellom modell og ny løsning blir mindre.

### SVD viser den mest følsomme retningen

Fra [uke 7](uke7.qmd#uke7-geometri) er $Jv_i=\sigma_i u_i$.
Hvis målefeilen er $\delta d=\varepsilon u_i$, gir regelen
$\delta z_{\mathrm{lin}}=(\varepsilon/\sigma_i)v_i$.
Du kan kontrollere den med én linje matrisealgebra:

$$J\left(\frac{\varepsilon}{\sigma_i}v_i\right)
=\frac{\varepsilon}{\sigma_i}Jv_i=\varepsilon u_i.$$

Vi gir også regelen for alle retninger: målefeil med
$\|\delta d\|\le\varepsilon$ gir lineære flyttinger inne i ellipsen med
halvakser $\varepsilon/\sigma_1$ og $\varepsilon/\sigma_2$, langs $v_1$ og
$v_2$. Største lineære flytting er $\varepsilon/\sigma_2$.
Dette er en følsomhetsellipse, ikke et statistisk konfidensområde.

I appen er målefeilen til venstre og flyttingen til høyre. Dra det
oransje punktet rundt og inn i skiven, og flytt så taggen i kartet nederst.
De blå punktene viser én målefeil om gangen. Bruk appen til å forutsi
hvilken retning taggen er mest usikker i; Python-forsøket under gir tallene.

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

Cellen viser halvaksene og kontrollerer den mest følsomme retningen med
`move`. Figuren tegner også flyttingene fra feil i ett anker om gangen.

```{pyodide-python}
#| label: project10-ellipse
eps = .1
z_c = np.array([5., 4.])
J = jacobian(z_c, hall)
U, s, Vt = np.linalg.svd(J, full_matrices=False)
print('singulærverdier:', s.round(4), '  halvakser eps/sigma:', (eps/s).round(4))
print('mest følsomme retning v2:', Vt[1].round(3))
print('lengde med delta_d = eps*u2:', np.linalg.norm(move(J, eps*U[:, 1])))
one_anchor = [move(J, sign*eps*e) for e in np.eye(4) for sign in (1, -1)]
show_moves(z_c, J, eps, {'ett anker ±10 cm': one_anchor})
```

**Les og forklar:** Hvilken av halvaksene er lengst, og hvilken retning
har den? Finn igjen $\varepsilon/\sigma_2$ i utskriften. Hvorfor kan en
liten singulærverdi gi stor posisjonsfeil selv om målefeilen er liten?
Fortegnet på $v_2$ er fritt; det er aksen, ikke pilens fortegn, som teller.

### Gå ut av hallen

Vi flytter taggen fra midten av hallen langs linjen $y=4$. Langt unna ser
taggen alle ankrene i nesten samme retning. **Forutsi:** blir det lettest
å skille flyttinger langs eller på tvers av denne retningen?

Cellen sammenligner fire avstander fra midten. Les både singulærverdiene
og den største lineære flyttingen for en målefeil med norm $0.1$ m.

```{pyodide-python}
#| label: project10-far-away
eps = .1
print(' R     sigma_1  sigma_2  største lineære flytting (m)')
for R in [0, 20, 50, 100]:
    z_far = np.array([5. + R, 4.])
    s = np.linalg.svd(jacobian(z_far, hall), compute_uv=False)
    print(f'{R:3d}     {s[0]:.3f}    {s[1]:.3f}          {eps/s[1]:.3f}')
```

Skriv én konklusjon om geometrien og én om tallene. Knytt den mest
usikre retningen til at $J$ blir nesten rangmangelfull. Det holder å bruke
vektorer, singulærverdier og figuren; ingen grenseverdiutledning kreves.

**Ta med videre:** Singulærverdiene måler hvor godt avstandene skiller
ulike flyttinger. God konvergens gjør ikke geometrien mer informativ.

## 4. Konvergert, men feil?

Nå står ankrene nesten på en rett linje langs en vegg:

$$b_1=(0,0),\quad b_2=(4,0.1),\quad b_3=(7,-0.1),\quad b_4=(10,0).$$

Taggen står i $(6,3)$, og `d_wall` er eksakte målinger. Fra avstandene
alene kan et punkt på den andre siden av veggen se nesten like godt ut.
**Forutsi:** Hva vil liten gradient fortelle oss, og hva vil den ikke
fortelle oss?

Cellen bruker to starter og skriver ut sluttpunkt, residualnorm og
gradientnorm. Nivåkurvene hjelper deg å tolke forskjellen.

```{pyodide-python}
#| label: project10-wall
starts = ([5., 4.], [5., -4.])
paths = [gauss_newton(start, wall, d_wall, steps=15) for start in starts]
for start, path in zip(starts, paths):
    z_end = path[-1]
    r, J = residual(z_end, wall, d_wall), jacobian(z_end, wall)
    print(f'start {start}: slutt {z_end.round(4)}, ||r|| = {np.linalg.norm(r):.3f}, '
          f'||J^T r|| = {np.linalg.norm(J.T @ r):.1e}')
show_hall(wall, d_wall, paths, ['start (5,4)', 'start (5,-4)'], true=z_true_wall)
```

**Les og konkluder:** Hvilken start gir riktig posisjon? Kan gradientnormen
alene avsløre det andre svaret? Bruk både residualen og figuren.

I praksis kjenner vi ikke fasiten. Her får du en modellkontroll: hvis
hver av $m$ målinger er høyst $\varepsilon$ feil, finnes en posisjon med
$\|r\|\le\sqrt m\,\varepsilon$. Et globalt minste kvadraters minimum har
minst like liten residual. For fire målinger med høyst $0.05$ m feil er
grensen $0.10$ m.

Sammenlign grensen med begge utskriftene. En residual over grensen betyr
at svaret eller antakelsen om målefeil ikke holder. En residual under
grensen beviser heller ikke at posisjonen er entydig eller riktig.

### Start på veggen: kontroller lengden med Armijo

Start i $(5,0)$. Retningene til ankrene ligger da nesten langs veggen,
og en liten singulærverdi kan gi et langt Gauss–Newton-steg.
Retningen er likevel en nedstigningsretning når gradienten ikke er null:
fra normallikningene får vi den korte matriseidentiteten

$$g^Tp=-p^TJ^TJp=-\|Jp\|^2<0.$$

Vi trenger derfor å kontrollere **lengden**. Armijo prøver
$\alpha=1,1/2,1/4,\ldots$ til

$$F(z+\alpha p)\le F(z)+10^{-4}\alpha g^Tp.$$

**Kodespor 2:** Fullfør halveringsløkken. Cellen viser det første steget
og tar deretter ti sikrede steg. Bruk funksjonsverdiene til å avgjøre om
halveringen hjelper; bruk residualen til å vurdere sluttpunktet.

```{pyodide-python}
#| label: project10-armijo
def armijo_step(z, B, d):
    p = gn_step(z, B, d)
    F = lambda w: .5*np.sum(residual(w, B, d)**2)
    slope = (jacobian(z, B).T @ residual(z, B, d)) @ p
    alpha = 1.
    # TODO: så lenge Armijo-testen ikke holder, halver alpha.
    raise NotImplementedError('Fullfør Armijo-løkken')
    return alpha, p

z0 = np.array([5., 0.])
F = lambda w: .5*np.sum(residual(w, wall, d_wall)**2)
p = gn_step(z0, wall, d_wall)
print('singulærverdier i starten:', np.linalg.svd(jacobian(z0, wall), compute_uv=False).round(3))
print(f'helt steg: lengde {np.linalg.norm(p):.2f} m, F før {F(z0):.2f}, F etter {F(z0+p):.2f}')
alpha, p = armijo_step(z0, wall, d_wall)
print(f'godtatt alpha = {alpha}, F etter = {F(z0+alpha*p):.2f}')
z = z0.copy()
for k in range(10):
    alpha, p = armijo_step(z, wall, d_wall)
    z = z + alpha*p
print(f'slutt {z.round(4)}, ||r|| = {np.linalg.norm(residual(z, wall, d_wall)):.3f}')
```

Sammenlign helt og halvert steg: hva løste Armijo, og hvilket problem fra
forsøket med to starter står igjen? Foreslå én praktisk kontroll når du
ikke kjenner fasiten. Begrunn med tall fra utskriftene, ikke bare med
at metoden har «konvergert».

**Ta med videre:** Steglengde, konvergens, målefeil og entydighet er
forskjellige spørsmål. Ingen enkelt liten norm svarer på dem alle.

## 5. Din påstand

Velg **én** av undersøkelsene. Hold alt annet fast, skriv én forutsigelse,
og bruk et lite kontrollert forsøk til å undersøke den.

- **Et femte anker:** Sammenlign to plasseringer av et nytt anker for en
  tagg i $(3,5)$. Lag `B5 = np.vstack([hall, [x5, y5]])` og sammenlign
  $\sigma_2$ og største lineære flytting $\varepsilon/\sigma_2$.
- **Ankre nøyaktig på én linje:** Sett alle ankre på $y=0$, lag eksakte
  avstander fra $(6,3)$, og prøv én start på hver side. Kan avstandene
  alene avgjøre hvilken side taggen er på?

Vis ett resultat som støtter eller utfordrer forventningen. Avgrens
konklusjonen til forsøket og den matematiske modellen du har brukt.

## Spørsmål du skal kunne svare på

Disse spørsmålene er til egenkontroll, ikke en ekstra rapport.

1. Hva betyr én komponent av $r$, én rad i $J$ og produktet $Jp$?
2. Hvorfor kan Gauss–Newton-steget regnes med `lstsq`?
3. Hva viser feilforholdene om konvergensfarten, og hvilken rolle har $Q$?
4. Hva kan den lineære følsomhetsmodellen si, og når er den bare en tilnærming?
5. Hvordan gir en liten $\sigma_2$ en stor usikker retning?
6. Hva kan residualnormen fortelle som gradientnormen ikke forteller?
7. Hva reparerer Armijo, og hvorfor avgjør det ikke hvilket minimum vi finner?

## Det du leverer

Lever én kjørbar notebook eller Quarto-side med:

- din `gn_step` og `armijo_step`, samt den korte koblingen mellom
  komponenter, vektorer og matriser fra del 1;
- konvergenstabellen fra del 2 og én figur/tabell fra følsomhetsforsøkene;
- diagnosen fra del 4, med konkrete residualer og resultatet av Armijo;
- forutsigelse, kontroll og avgrenset konklusjon fra **én** undersøkelse i del 5.

Forklaringene kan stå rett ved utskriftene. Avslutt med **150–250 ord**
om hva som bestemmer fart, presisjon og troverdighet. Du vurderes på
hvordan du bruker lineær algebra og egne beregninger til å begrunne
konklusjonene. Formler for deriverte skal ikke utledes eller leveres.
