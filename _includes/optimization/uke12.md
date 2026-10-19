<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 12.0 Oversikt

<div id="uke12-start"></div>

### Når svaret må ligge på en kurve

I [uke 8](uke8.qmd#uke8-kompakt) lå minimum av en kvadratsum på randen av et
rektangel. Der var gradienten **ikke** null: funksjonen ville gjerne bli
mindre, men kravet stoppet den. I [uke 11](uke11.qmd) var kravene lineære
ulikheter, og løsningen lå i et hjørne. Nå skal et punkt oppfylle en
**likning**, for eksempel $x^2+4y^2=1$. Da er bare punktene på selve kurven
tillatt. Et slikt krav kalles en **likhetsbetingelse** eller
**bibetingelse**; vi sier ofte bare **krav**.

Ukens spørsmål er: **Hva erstatter $\nabla f=0$ når punktet må ligge på en
kurve, og hvordan vet vi at kandidaten vi finner, er den beste?** Vi bygger
svaret i tre steg, ett om gangen:

1. **Hva må gjelde i et beste punkt på kurven?** Nivålinjen til målet
   berører kurven, og gradienten står vinkelrett på den. Det gir
   **Lagranges likninger**, som er nye i kurset. Multiplikatoren i dem viser
   seg å være en pris, som i uke 11 (12.1–12.3).
2. **Hva blir likningene når målet er kvadratisk?** Med et sirkelkrav blir de
   et egenverdiproblem, og med lineære krav et lineært likningssystem (12.4).
3. **Hvordan kontrollerer vi et punkt som en løser gir oss?** SLSQP finner et
   punkt, og vi kontrollerer det med to kontrollfeil og et globalt argument
   (12.5).

**Forelesning** viser hovedløpet. **Gå i dybden** åpner begrunnelser,
spesialtilfeller og ulikhetskrav. Regneoppgavene står i 12.6 og
kodeoppgavene i 12.7.

### Kort løype

**Hva må gjelde i et beste punkt?**

1. [Nivålinjen berører kurven](#uke12-tangent): en applet som i uke 4, nå med en ellipse.
2. [Lagranges likninger](#uke12-lagrange): to normaler som er parallelle.
3. [Multiplikatoren er en pris](#uke12-pris): uke 11.
4. [Kandidater er ikke løsninger](#uke12-kandidater): fire kandidater, to verdier.

**Hva blir likningene når målet er kvadratisk?**

5. [Kandidattabellen er en egenverditabell](#uke12-egenverdi): uke 5 og 7.
6. [Lineære krav gir et lineært system](#uke12-kkt): uke 3, 6 og 10.

**Hvordan kontrollerer vi et numerisk svar?**

7. [Finn et punkt numerisk og kontroller det](#uke12-slsqp): SLSQP.

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 3: nullrom](uke3.qmd#uke3-del3) | Hvilke retninger endrer ikke $Cz$? |
| [Uke 4: komponent langs en retning](uke4.qmd#uke4-retning) | Hvilken enhetsretning gir størst komponent? |
| [Uke 5: Rayleigh-kvotienten](uke5.qmd#uke5-potens) | Hva er størst mulig $z^TAz$ når $\lVert z\rVert_2=1$? |
| [Uke 6: CG](uke6.qmd#uke6-cg) og [uke 10: Cholesky](uke10.qmd#uke10-cholesky) | Hva krever metodene av matrisen? |
| [Uke 7: største strekk](uke7.qmd#uke7-geometri) og [pseudoinvers](uke7.qmd#uke7-pseudoinvers) | Hvorfor er $\sigma_1$ det største strekket? |
| [Uke 8: kompakthet](uke8.qmd#uke8-kompakt) | Finnes et maksimum på en kurve? |
| [Uke 11: hva en ekstra enhet er verdt](uke11.qmd#uke11-sensitivitet) | Hva er én enhet mer av en ressurs verdt? |

### Læringsmål

Etter denne uken skal du kunne

- finne tangent og normal til en regulær likhetsbetingelse i et punkt,
- sette opp og løse Lagranges likninger for én likhetsbetingelse,
- tolke $-\lambda$ som endringen i optimal verdi per enhet vi flytter kravet,
- skille kandidater fra løsninger ved å sammenligne verdier eller finne en global grense,
- forklare hvorfor en kvadratisk form på enhetssirkelen gir et egenverdiproblem,
- sette opp likningssystemet for et kvadratisk mål med lineære krav, og forklare hvorfor
  matrisen ikke er SPD,
- kontrollere både betingelsesfeil og stasjonaritetsfeil i et numerisk SLSQP-svar.

## 12.1 Nivålinjen berører kurven

<div id="uke12-tangent"></div>

### Hva skjer når sirkelen blir en ellipse?

I [uke 4.1](uke4.qmd#uke4-retning) dro du en enhetsvektor $q$ rundt
enhetssirkelen og leste av komponenten av $x=(3,2)$ langs $q$. Du fant at
komponenten, $3q_1+2q_2$, blir størst når $q$ peker samme vei som $x$. Det
var et optimeringsproblem på enhetssirkelen. Her bruker vi vektoren $(1,2)$,
som gir enklere tall. Komponenten av $(1,2)$ langs $q=(x,y)$ er $x+2y$, og
etter regelen fra uke 4 er

$$\text{maksimum av } f(x,y)=x+2y \quad\text{når}\quad x^2+y^2=1$$

nådd i $(1,2)/\sqrt5$. Nå bytter vi sirkelen med ellipsen $x^2+4y^2=1$.
Målet er det samme.

Appleten gjør regningen for oss: den viser målverdien og to piler i punktet
du velger. Hvorfor akkurat disse pilene er interessante, forklarer vi rett
etter forsøket. Målet er å finne det beste punktet på ellipsen og se hva som
kjennetegner det, nå som regelen fra uke 4 ikke lenger gjelder.

### Eksperiment 1 – fra sirkel til ellipse

| Rolle | Uttrykk | Hva det betyr |
|:--|:--|:--|
| Valg | $z=(x,y)$ | Punktet vi flytter på. |
| Mål | Maksimer $f(x,y)=x+2y$ | Skalarproduktet $(1,2)\cdot z$, som komponenten i uke 4. |
| Krav | $h(x,y)=x^2+4y^2-1=0$ | Bare punkter på ellipsen er tillatt. |

Dra punktet $z$ langs ellipsen. Den stiplede brune linjen er
**nivålinjen** $x+2y=f(z)$: alle punkter med samme målverdi som $z$. Den
røde pilen viser retningen til $\nabla f=(1,2)$, og den grønne viser
retningen til $\nabla h=(2x,8y)$. Den grå pilen $v$ er en enhetstangent til
ellipsen, og tallet $\nabla f\cdot v$ øverst sier hvor fort $f$ endres når vi
går langs ellipsen i pilens retning. Den grå sirkelen og det grå punktet
viser svaret på sirkelen, etter regelen fra uke 4.

```{.jsxgraph width="620" height="460" style="width:100%;max-width:620px;height:460px;border:0;"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-1.7,1.6,1.9,-1.1], axis: true, keepaspectratio: true,
  showNavigation: false, showCopyright: false,
  pan: {enabled:false}, zoom: {enabled:false}
});
board.create('circle',[[0,0],1],{
  strokeColor:'#9aa5ad',dash:2,strokeWidth:1,fixed:true,highlight:false
});
board.create('point',[1/Math.sqrt(5),2/Math.sqrt(5)],{
  name:'svar på sirkelen',fixed:true,color:'#9aa5ad',size:2
});
var ell = board.create('curve',[
  function(t){return Math.cos(t);},
  function(t){return 0.5*Math.sin(t);},0,2*Math.PI
],{strokeColor:'#345f78',strokeWidth:2.5,numberPointsHigh:200});
var Q = board.create('glider',[1,0,ell],{name:'z',color:'#1565c0',size:4});
var f = function(){return Q.X()+2*Q.Y();};
board.create('line',[function(){return -f();},1,2],{
  strokeColor:'#b45309',dash:2,strokeWidth:1.5,fixed:true,highlight:false
});
var g = 0.45/Math.sqrt(5);
board.create('arrow',[Q,[function(){return Q.X()+g;},function(){return Q.Y()+2*g;}]],{
  strokeColor:'#c62828',strokeWidth:2.5,fixed:true
});
var nl = function(){return Math.sqrt(4*Q.X()*Q.X()+64*Q.Y()*Q.Y());};
board.create('arrow',[Q,[
  function(){return Q.X()+0.45*2*Q.X()/nl();},
  function(){return Q.Y()+0.45*8*Q.Y()/nl();}
]],{strokeColor:'#2e7d32',strokeWidth:2.5,fixed:true});
// Enhetstangenten v = (-8y, 2x)/|...| står vinkelrett på normalen og peker mot klokka.
var tx = function(){return -8*Q.Y()/nl();}, ty = function(){return 2*Q.X()/nl();};
board.create('arrow',[Q,[
  function(){return Q.X()+0.45*tx();},
  function(){return Q.Y()+0.45*ty();}
]],{strokeColor:'#6b7280',strokeWidth:2.5,fixed:true});
var slope = function(){var s = tx()+2*ty(); return Math.abs(s) < 5e-4 ? 0 : s;};
var angle = function(){
  var c = (2*Q.X()+16*Q.Y())/(Math.sqrt(5)*nl());
  return Math.acos(Math.max(-1,Math.min(1,c)))*180/Math.PI;
};
// Tekstlinjene står et fast antall piksler under øvre venstre hjørne av det synlige brettet.
var tx0 = function(){return board.getBoundingBox()[0]+10/board.unitX;};
var ty0 = function(k){return function(){return board.getBoundingBox()[1]-(14+19*k)/board.unitY;};};
board.create('text',[tx0,ty0(0),function(){
  return 'z = ('+Q.X().toFixed(3)+', '+Q.Y().toFixed(3)+'),  f = '+f().toFixed(3);
}],{fontSize:13,color:'#1565c0',fixed:true});
board.create('text',[tx0,ty0(1),function(){
  return 'vinkel rød–grønn: '+angle().toFixed(1)+'°';
}],{fontSize:13,fixed:true});
board.create('text',[tx0,ty0(2),function(){
  return 'langs grå tangent: ∇f·v = '+slope().toFixed(3);
}],{fontSize:13,color:'#4b5563',fixed:true});
board.create('button',[-1.6,-0.95,'z = (1, 0)',function(){Q.moveTo([1,0]);}]);
board.create('button',[-0.6,-0.95,'z langs (1, 2)',function(){
  Q.moveTo([1/Math.sqrt(17),2/Math.sqrt(17)]);
}]);
```

Prøv dette før du leser videre:

1. Start i $z=(1,0)$. I hvilken retning langs ellipsen må du gå for at $f$
   skal øke? Hva sier tallet $\nabla f\cdot v$?
2. Trykk **z langs (1, 2)**. Er dette fortsatt det beste punktet?
3. Dra $z$ til $f$ blir størst mulig. Les av punktet, vinkelen og
   $\nabla f\cdot v$.
4. Hva gjør nivålinjen i det beste punktet?

**Hva viser forsøket?** Punktet langs $(1,2)$ gir bare $f\approx1.213$.
Det største tallet du kan lese av, er omtrent $1.414$, ved
$z\approx(0.707,\,0.354)$. Regelen fra uke 4, «pek langs vektoren», gjelder
altså ikke lenger. Men tre ting gjelder fortsatt i det beste punktet:

- tallet $\nabla f\cdot v$ er **null**: det er positivt før punktet og
  negativt etter, så $f$ slutter å vokse akkurat der;
- nivålinjen **berører** ellipsen uten å krysse den;
- den røde og den grønne pilen er **parallelle**: vinkelen er $0^\circ$.

Et punkt der nivålinjen krysser kurven, kan ikke være best: på den ene siden
av krysningen ligger tillatte punkter med høyere verdi. Resten av uken handler
om denne observasjonen.

### Tangent og normal

En **tangentretning** viser hvilken vei vi kan begynne å gå langs kurven fra
et punkt. En **normalretning** står vinkelrett på tangenten. Fra Matematikk 2
vet vi at gradienten står vinkelrett på nivåkurvene (gradienten selv møtte vi
også i [uke 6](uke6.qmd#uke6-retning)). Kurven $h=0$ er en nivåkurve for $h$, så $\nabla h$ er en
normal til kurven, så lenge $\nabla h\ne0$. Da kaller vi kravet
**regulært** i punktet.

**Regn for hånd.** Vi undersøker punktet $(1,0)$ på ellipsen.

1. $\nabla h=(2x,8y)$, så $\nabla h(1,0)=(2,0)$. Normalen peker langs
   $x$-aksen.
2. En enhetstangent står vinkelrett på normalen: $v=(0,1)$. Fra $(1,0)$ kan
   vi gå både oppover og nedover langs ellipsen.
3. Målgradienten er $\nabla f=(1,2)$. Den deriverte av $f$ langs tangenten
   er $\nabla f\cdot v=(1,2)\cdot(0,1)=2$.
4. Fordi denne deriverte er positiv, øker $f$ når vi begynner å gå oppover.
   Punktet $(1,0)$ er tillatt, men ikke et maksimum. Det stemmer med
   spørsmål 1 i appleten.

Det er denne deriverte appleten viser som $\nabla f\cdot v$. I det beste
punktet er den null, og i 12.2 regner vi ut punktet eksakt.

**Dette tar vi med oss.** I et ekstremalpunkt på kurven må den deriverte av
målet langs tangenten være null. Det er det samme som at $\nabla f$ står
vinkelrett på tangenten, altså parallelt med normalen $\nabla h$. Gradienten
selv trenger ikke være null, slik den må i et indre ekstremum (se
[uke 8.3](uke8.qmd#uke8-hessian)).

## 12.2 Lagranges likninger

<div id="uke12-lagrange"></div>

### To parallelle normaler

At $\nabla f$ og $\nabla h$ er parallelle, betyr at den ene er et tall ganger
den andre. Vi skriver det som

$$\nabla f+\lambda\nabla h=0.$$

Tallet $\lambda$ kalles en **Lagrangemultiplikator**. Funksjonen
$L(z,\lambda)=f(z)+\lambda h(z)$ kalles **Lagrangefunksjonen**. Et regulært
lokalt ekstremum $z_*$ må oppfylle begge **Lagranges likninger**:

$$\boxed{h(z_*)=0,\qquad \nabla f(z_*)+\lambda\nabla h(z_*)=0.}$$

Den første likningen sier at punktet er tillatt. Den andre sier at den
deriverte langs tangenten er null. Legg merke til at begge får vi ved å sette
alle partiellderiverte av $L$ lik null, også den med hensyn på $\lambda$.
Med to variabler er dette tre likninger med tre ukjente: $x$, $y$ og
$\lambda$.

Et punkt som oppfyller likningene, kalles **stasjonært under
bibetingelsen**. Det er en **kandidat**, ikke automatisk et maksimum eller
minimum. Kravet om regularitet, $\nabla h(z_*)\ne0$, trengs fordi
$\nabla h$ ellers ikke er noen normal; se «Gå i dybden» nedenfor.

**Ellipsen fra 12.1, steg for steg.** La oss regne ut det appleten viste oss.
Her er $\nabla f=(1,2)$ og $\nabla h=(2x,8y)$.

1. Likningene er $1+2\lambda x=0$, $2+8\lambda y=0$ og $x^2+4y^2=1$.
2. Her er $\lambda\ne0$, ellers sier den første likningen $1=0$. Da er
   $x=-\dfrac1{2\lambda}$ og $y=-\dfrac2{8\lambda}=-\dfrac1{4\lambda}$,
   altså $x=2y$.
3. Sett $x=2y$ inn i kravet: $(2y)^2+4y^2=8y^2=1$, så
   $y=\pm\dfrac1{2\sqrt2}$ og $x=2y=\pm\dfrac1{\sqrt2}$.
4. Målverdiene er
   $f=x+2y=\pm\Bigl(\dfrac1{\sqrt2}+\dfrac1{\sqrt2}\Bigr)=\pm\sqrt2$.
5. Første likning gir $\lambda=-\dfrac1{2x}=-\dfrac1{\sqrt2}$ i den positive
   kandidaten. Der er $\nabla h=(\sqrt2,\,2\sqrt2)=\sqrt2\,(1,2)$, parallell
   med $\nabla f$, slik appleten viste.

Den positive kandidaten er punktet appleten pekte ut, med
$f=\sqrt2\approx1.414$.

::: {.callout-note title="Håndeksempel: sirkelen og regelen fra uke 4"}

**Utgangspunkt.** Maksimer $f(x,y)=x+2y$ når $h(x,y)=x^2+y^2-1=0$.

**Prøv selv.** Skriv opp de tre likningene og finn alle kandidatene. Hvilken
gir størst verdi?

**Regnegangen.**

1. Likningene er $1+2\lambda x=0$, $2+2\lambda y=0$ og $x^2+y^2=1$. Her er
   $\lambda\ne0$, ellers gir den første $1=0$.
2. Da er $x=-1/(2\lambda)$ og $y=-1/\lambda$, så $y=2x$.
3. Kravet gir $x^2+(2x)^2=5x^2=1$. Kandidatene er $\pm(1,2)/\sqrt5$, og
   $\lambda=-1/(2x)=\mp\sqrt5/2$:

| Kandidat | $f=x+2y$ | $\lambda$ |
|:--|:--|:--|
| $(1,2)/\sqrt5$ | $\sqrt5$ | $-\sqrt5/2$ |
| $-(1,2)/\sqrt5$ | $-\sqrt5$ | $\sqrt5/2$ |

4. **Er kandidaten best på hele sirkelen?** Cauchy–Schwarz-ulikheten
   $|a\cdot b|\le\lVert a\rVert_2\lVert b\rVert_2$ gir for hvert tillatt $z$
   $$x+2y=(1,2)\cdot z\le\lVert(1,2)\rVert_2\,\lVert z\rVert_2=\sqrt5.$$
   Den første kandidaten oppnår grensen og er **globalt** maksimum.

**Dette tar vi med oss.** Lagranges likninger fant regelen fra uke 4 uten at
vi dro i noe. Ulikheten avgjorde at kandidaten er best. Samme triks virker for
ellipsen: med $w=2y$ blir kravet $x^2+w^2=1$, og
$x+2y=(1,1)\cdot(x,w)\le\sqrt2$.

:::

<details class="reading-step">
<summary>Gå i dybden: kjerneregelen langs kurven, og flere krav</summary>

**Hvorfor normalene er parallelle.** La $p(t)$ være en glatt kurve med
$h(p(t))=0$ og $p(0)=z_*$. Kjerneregelen gir

$$0=\left.\frac{d}{dt}h(p(t))\right|_{t=0}=\nabla h(z_*)\cdot p'(0).$$

Enhver tangent $p'(0)$ står altså vinkelrett på $\nabla h$. Hvis $f$ har et
lokalt ekstremum langs kurven i $t=0$, gir samme regel
$\nabla f(z_*)\cdot p'(0)=0$. Når $\nabla h(z_*)\ne0$, beskriver likningen
lokalt en glatt kurve, og normalretningen i planet er én linje. Da må
$\nabla f$ og $\nabla h$ være parallelle. På sirkelen kan vi se dette direkte
med $p(t)=(\cos t,\sin t)$: $(f\circ p)'(t)=-\sin t+2\cos t
=\nabla f(p(t))\cdot p'(t)$.

**Flere krav.** For krav $h_1(z)=0,\ldots,h_m(z)=0$ samler **Jacobimatrisen**
$J_h$ gradientene $\nabla h_i^T$ som rader. En tangent $v$ må oppfylle
$J_h(z_*)v=0$: tangentretningene er **nullrommet** til $J_h$. Hvis radene er
lineært uavhengige, er kravene regulære. Hvert krav får sin multiplikator:

$$h_i(z_*)=0\quad(i=1,\ldots,m),\qquad
\nabla f(z_*)+\sum_{i=1}^m\lambda_i\nabla h_i(z_*)=0.$$

For eksempel gir $x_1^2+x_2^2+x_3^2=1$ og $x_3=0$ i punktet $(1,0,0)$
normalene $(2,0,0)$ og $(0,0,1)$. Tangentene er $(0,t,0)$. I 12.4 møter vi flere
lineære krav, og i prosjektet ti krav samtidig.

</details>

<details class="reading-step">
<summary>Gå i dybden: når normalen forsvinner</summary>

<div id="uke12-degenerert"></div>

Lagranges likninger forutsetter at $\nabla h\ne0$. Se på målet $f(x,y)=x$
med kravet $h(x,y)=x^2+y^2=0$. To kvadrater summerer til null bare i
$(0,0)$, så dette er det eneste tillatte punktet. Det er dermed både
minimum og maksimum på den tillatte mengden. Likevel er
$\nabla f(0,0)=(1,0)$ og $\nabla h(0,0)=(0,0)$, og

$$\nabla f+\lambda\nabla h=(1,0)\quad\text{uansett hvilken }\lambda\text{ vi velger.}$$

Kravet er **degenerert** i punktet: normaltesten finner ikke ekstremumet.
Vil du se det med tall, prøver cellen tre ulike multiplikatorer i det eneste
tillatte punktet. Stasjonaritetsfeilen blir den samme hver gang, fordi
normalen er nullvektoren.

```{pyodide-python}
#| label: week12-degenerate-experiment
p = np.array([0., 0.])
grad_f = np.array([1., 0.])
grad_constraint = 2*p          # gradienten til x^2 + y^2 i det eneste tillatte punktet
for lam_test in [-10, 0, 10]:
    error = np.linalg.norm(grad_f + lam_test*grad_constraint)
    print(f'lambda = {lam_test:4d}:  |grad f + lambda grad h| = {error:.1f}')
```

Ekstremumet fant vi ved å se direkte på den tillatte mengden.

**Øv på dette:** [et krav uten normal](#uke12-oppg-degenerert) i 12.6 (valgfri).

</details>

### Et kort regneeksempel: nærmest origo på en linje

Lagranges metode virker like godt for minimum. Vi søker punktet på linjen
$x+y=2$ som ligger nærmest origo, og minimerer kvadrert avstand.

::: {.callout-note title="Håndeksempel: nærmeste punkt på en linje"}

**Utgangspunkt.** Minimer $f(x,y)=x^2+y^2$ når $h(x,y)=x+y-2=0$.

**Prøv selv.** Sett opp Lagranges likninger og finn kandidaten og $\lambda$.

**Regnegangen.**

1. Likningene er $2x+\lambda=0$, $2y+\lambda=0$ og $x+y=2$.
2. De to første gir $x=y$. Kravet gir $(x,y)=(1,1)$, og da er $\lambda=-2$
   og $f(1,1)=2$.
3. **Kontroll av at det er minimum:** på linjen er $y=2-x$, og
   $f(x,2-x)=2+2(x-1)^2\ge2$, med likhet bare for $x=1$.

**Dette tar vi med oss.** Kravet er $Cz=d$ med $C=\begin{bmatrix}1&1\end{bmatrix}$
og $d=2$. Det korteste $z$ som løser et underbestemt system, gir
pseudoinversen fra den valgfrie delen [uke 7.7](uke7.qmd#uke7-pseudoinvers):
$C^+d=(1,1)$. Lagrange og pseudoinversen gir samme punkt. I «Gå i dybden»
i 12.4 ser vi hvorfor.

:::

**Øv på dette:** [normal og tangent på ellipsen](#uke12-oppg-normal),
[et annet mål på ellipsen](#uke12-oppg-ellipse) og
[Lagrange på sirkelen](#uke12-oppg-sirkel) i 12.6.

### Multiplikatoren er en pris

<div id="uke12-pris"></div>

Hva skjer med optimal verdi hvis vi flytter kravet litt? La linjen være
$x+y=r$. Samme regning som i håndeksempelet: $2x+\lambda=0$ og
$2y+\lambda=0$ gir $x=y$, kravet gir $x=y=r/2$, og da er $\lambda=-2x=-r$.
Optimal verdi og dens deriverte er

$$f_*(r)=\Bigl(\frac r2\Bigr)^2+\Bigl(\frac r2\Bigr)^2=\frac{r^2}{2},\qquad
\frac{df_*}{dr}=r=-\lambda.$$

Sammenhengen $df_*/dr=-\lambda$ gjelder altså for alle $r$, ikke bare for
$r=2$, der vi fant $\lambda=-2$. Det samme gjelder generelt: flytter vi
kravet fra $h(z)=0$ til $h(z)=s$, og løsningen endrer seg glatt med $s$, er

$$\boxed{\frac{df_*}{ds}=-\lambda\quad\text{ved } s=0.}$$

I eksempelet er $h=x+y-2$, så $h=s$ betyr $x+y=2+s$, altså $r=2+s$.
Hvorfor regelen gjelder for alle glatte problemer, viser «Gå i dybden» rett
under.

Multiplikatoren sier hvor mye optimal verdi endres per enhet vi flytter
kravet. Det er samme idé som i [uke 11](uke11.qmd#uke11-sensitivitet):
hva er én enhet mer av en ressurs verdt? I uke 11 var prisen selve
endringen, et positivt tall. Her er prisen $-\lambda$, fordi vi skriver
$L=f+\lambda h$. Enhetene passer: har $f$ enhet kroner og $s$ enhet kilo,
har $\lambda$ enhet kroner per kilo. I prosjektet er multiplikatorene
krefter, og «prisen» er energi per meter.

**Dette tar vi med oss.** Lagranges likninger $h=0$ og
$\nabla f+\lambda\nabla h=0$ gir kandidater, både for maksimum og minimum.
Multiplikatoren har en betydning: $-\lambda$ er hvor mye optimal verdi endres
per enhet vi flytter kravet.

**Øv på dette:** [boksen med minst overflate](#uke12-oppg-boks) i 12.6.

<details class="reading-step">
<summary>Gå i dybden: hvorfor prisformelen gjelder generelt</summary>

La $z(s)$ være løsningen når kravet er $h(z)=s$, og anta at den endrer seg
glatt med $s$. Da er $f_*(s)=f(z(s))$.

1. Kjerneregelen: $\dfrac{df_*}{ds}=\nabla f(z(s))\cdot z'(s)$.
2. Lagranges likning i løsningen er $\nabla f=-\lambda\nabla h$, så
   $\dfrac{df_*}{ds}=-\lambda\,\nabla h(z(s))\cdot z'(s)$.
3. Kravet $h(z(s))=s$ gjelder for alle $s$. Deriver begge sider:
   $\nabla h(z(s))\cdot z'(s)=1$.
4. Sett inn: $\dfrac{df_*}{ds}=-\lambda$.

Kontroll med linjen: $z(s)=\bigl(\tfrac{2+s}2,\tfrac{2+s}2\bigr)$ gir
$z'(s)=(\tfrac12,\tfrac12)$ og $\nabla h\cdot z'=(1,1)\cdot(\tfrac12,\tfrac12)=1$.
Med $\nabla f(1,1)=(2,2)$ blir $df_*/ds=(2,2)\cdot(\tfrac12,\tfrac12)=2=-\lambda$.

Vi kan også kontrollere regelen uten Lagrange i det hele tatt. Cellen finner
$f_*(r)$ ved å minimere direkte langs linjen $x+y=r$, og regner ut
differansekvotienter rundt $r=2$; de skal nærme seg $-\lambda=2$.

```{pyodide-python}
#| label: week12-price
from scipy.optimize import minimize_scalar

def f_star(r):
    # Punktene på linjen x + y = r er (t, r - t). Vi minimerer over t, uten Lagrange.
    return minimize_scalar(lambda t: t**2 + (r - t)**2).fun

for dr in [.1, .01, .001]:
    print(f'dr = {dr:5}: (f*(2+dr) - f*(2))/dr = {(f_star(2+dr) - f_star(2))/dr:.4f}')
print('-lambda fra håndeksempelet =', 2.0)
```

Differansekvotientene $2.05$, $2.005$ og $2.0005$ nærmer seg $2=-\lambda$.

**Fortegnet til $\lambda$.** I eksemplene er $\lambda$ negativ både ved
maksimum på sirkelen ($-\sqrt5/2$) og ved minimum på linjen ($-2$), mens
minimum i avstandsproblemet i 12.5 har $\lambda=+0.618$. Fortegnet skiller
altså ikke maksimum fra minimum. For et likhetskrav betyr
fortegnet ingenting alene. Skriver vi kravet som $-h=0$ i
stedet for $h=0$, er punktet det samme, men $\lambda$ bytter fortegn. Det er
prisformelen som gir fortegnet mening: $-\lambda$ er endringen i optimal
verdi når vi flytter kravet i den retningen $h$ er skrevet.

</details>

<details class="reading-step">
<summary>Gå i dybden: en multiplikator gir en nedre grense</summary>

Lagrangefunksjonen kan også **bevise** en grense for optimal verdi, slik
dualprisene ga en øvre grense i uke 11. Vi bruker avstandsproblemet som vi
løser numerisk i 12.5: minimer $F(z)=\tfrac12\lVert z-a\rVert_2^2$ med
$a=(2,1)$ når $h(z)=\lVert z\rVert_2^2-1=0$.

På sirkelen er $h=0$, så $L(z,\lambda)=F(z)$ for alle tillatte $z$. Hvis
$L(\cdot,\lambda)$ aldri går under et tall $\beta$ for **alle** $z$, er også
$F(z)\ge\beta$ for alle tillatte $z$.

1. Velg $\lambda_*=(\sqrt5-1)/2$. Hessianen til $L$ med hensyn på $z$ er
   $(1+2\lambda_*)I=\sqrt5\,I$, som er SPD: $L$ er en skål.
2. Bunnen av skålen finnes fra $\nabla_zL=(1+2\lambda_*)z-a=0$, altså
   $z_*=a/\sqrt5$.
3. Punktet $z_*$ ligger på sirkelen, og
   $F(z_*)=\tfrac12\lVert a/\sqrt5-a\rVert_2^2=\tfrac12\cdot5\,(1-1/\sqrt5)^2=\tfrac12(\sqrt5-1)^2$.
   Da er
   $$F(z)=L(z,\lambda_*)\ge L(z_*,\lambda_*)=F(z_*)=\tfrac12(\sqrt5-1)^2$$
   for alle tillatte $z$, og grensen er skarp.

Generelt er $\varphi(\lambda)=\inf_zL(z,\lambda)$ en nedre grense for den
tillatte minimumsverdien, for hver $\lambda$. I eksemplet ligger bunnen av
skålen i $z(\lambda)=a/(1+2\lambda)$ når $1+2\lambda>0$, og innsatt er
$$\varphi(\lambda)=L(z(\lambda),\lambda)=\frac{5\lambda}{1+2\lambda}-\lambda
=\tfrac52-\lambda-\frac5{2(1+2\lambda)}.$$
En slik skarp grense er ikke garantert for alle problemer.

**Øv på dette:** [en nedre grense fra Lagrangefunksjonen](#uke12-oppg-grense) i 12.6 (valgfri).

</details>

## 12.3 Kandidater er ikke løsninger

<div id="uke12-kandidater"></div>

Hittil har eksemplene gitt én eller to kandidater, og det var lett å se
hvilken som var best. Nå ser vi hva som skjer når likningene gir flere
kandidater. På enhetssirkelen bytter vi mål til $f(x,y)=xy$ og søker både
maksimum og minimum. Sirkelen er kompakt og $f$ er kontinuerlig, så
ekstremalverdisetningen fra [uke 8.2](uke8.qmd#uke8-kompakt) lover at begge
finnes. Spørsmålet er hvor, og om tangenttesten fra 12.1 kan skille dem.

Før vi løser Lagranges likninger, skanner vi hele sirkelen. Et punkt på
sirkelen er $(x,y)=(\cos t,\sin t)$, og tangenten der er $(-y,x)$,
vinkelrett på radien. Den deriverte langs tangenten er derfor
$\nabla f\cdot(-y,x)=(y,x)\cdot(-y,x)=x^2-y^2$, og den kan vi regne ut i
mange punkter samtidig. Målet er å finne alle punktene som består
tangenttesten, og se om de er like gode.

### Eksperiment 2 – hvor er den deriverte langs tangenten null?

- Kjør cellen. Hvor mange punkter består tangenttesten, og hvilke verdier
  har $f$ der?
- Finn de samme punktene i figuren. Hvilke er topper, og hvilke er bunner?
- Bytt til målet $x+2y$ fra håndeksempelet: `values = x + 2*y` og
  `slope = -y + 2*x`. Hvor mange punkter får du nå?

Cellen regner ut $f$ og den deriverte langs tangenten i tusen punkter på
sirkelen, og skriver ut punktene der den deriverte skifter fortegn. En ferdig
hjelpefunksjon tegner $f$ som funksjon av vinkelen $t$.

```{pyodide-python}
#| label: week12-xy-experiment
# Punkter (cos t, sin t) på sirkelen og den deriverte av f = xy langs tangenten (-y, x).
t = np.linspace(0, 2*np.pi, 1000)
x, y = np.cos(t), np.sin(t)
values = x*y
slope = y*(-y) + x*x                     # (y, x) · (-y, x)
turn = np.where(np.sign(slope[:-1]) != np.sign(slope[1:]))[0]
print('punkt (x, y)          f')
for i in turn:
    print(f'({x[i]: .3f}, {y[i]: .3f})      {values[i]: .3f}')
plot_along_circle(t, values, t[turn])
```

**Hva viser forsøket?** Fire punkter, omtrent $(\pm0.707,\pm0.707)$, består
tangenttesten. To har $f=1/2$ og er topper i figuren, og to har $f=-1/2$ og
er bunner. Tangenttesten finner kandidatene, men den skiller ikke maksimum
fra minimum. Lagranges likninger skal nå vise at det ikke finnes flere
kandidater, og gi de eksakte punktene. Med $\nabla f=(y,x)$ og
$\nabla h=(2x,2y)$ får vi

$$y+2\lambda x=0,\qquad x+2\lambda y=0,\qquad x^2+y^2=1.$$

**Regn for hånd.**

1. Ingen koordinat kan være null: $x=0$ gir $y=0$ i første likning, og det
   strider mot kravet. Tilsvarende for $y=0$.
2. Sett $y=-2\lambda x$ inn i den andre likningen:
   $x+2\lambda(-2\lambda x)=x(1-4\lambda^2)=0$. Siden $x\ne0$, er
   $4\lambda^2=1$, altså $\lambda=\pm\tfrac12$.
3. Med $\lambda=-\tfrac12$ gir $y=-2\lambda x$ at $y=x$. Kravet blir
   $2x^2=1$, så $x=y=\pm1/\sqrt2$. Med $\lambda=\tfrac12$ blir $y=-x$, og
   igjen er $x=\pm1/\sqrt2$.

| $\lambda$ | Relasjon | Kandidater | Verdi $xy$ |
|:--|:--|:--|:--|
| $-1/2$ | $x=y$ | $\pm(1,1)/\sqrt2$ | $1/2$ |
| $1/2$ | $x=-y$ | $\pm(1,-1)/\sqrt2$ | $-1/2$ |

**Klassifiser globalt.** $(x-y)^2\ge0$ gir $2xy\le x^2+y^2=1$, og
$(x+y)^2\ge0$ gir $2xy\ge-1$. Dermed er $-1/2\le xy\le1/2$ på hele
sirkelen. De to kandidatene med verdi $1/2$ er globale maksimumspunkter, de
to andre globale minimumspunkter.

**Dette tar vi med oss.** Lagranges likninger gir en liste med kandidater.
Hvilken som er best, avgjør vi ved å sammenligne verdiene, eller med en
ulikhet som gjelder alle tillatte punkter. Sammenligningen er nok fordi to
ting holder her: kompaktheten garanterer at maksimum og minimum **finnes**,
og $\nabla h=2z\ne0$ i **alle** punkter på sirkelen, så de er regulære og må
stå i listen. Uten regularitet kan et optimum mangle i listen (se «Gå i
dybden: når normalen forsvinner» i 12.2).

**Øv på dette:** [en kvadratisk form på sirkelen](#uke12-oppg-form) i 12.6.

<details class="reading-step">
<summary>Gå i dybden: andrederivert langs kurven</summary>

Vil vi undersøke formen helt nær én kandidat, kan vi følge sirkelen med
$p(t)=(\cos t,\sin t)$. Da er $f(p(t))=\tfrac12\sin2t$. Ved $t=\pi/4$ er
den andrederiverte $-2$: verdien bøyer nedover, og punktet er et lokalt
maksimum langs sirkelen. Ved $t=-\pi/4$ er den $+2$: et lokalt minimum.

Generelt, for en tillatt kurve $\gamma(t)$ gjennom et regulært stasjonært
punkt med tangent $v=\gamma'(0)$:

1. Derivér kravet $h(\gamma(t))=0$ to ganger:
   $v^T\nabla^2h\,v+\nabla h\cdot\gamma''(0)=0$.
2. Den andrederiverte av målet langs kurven er
   $v^T\nabla^2f\,v+\nabla f\cdot\gamma''(0)$, og $\nabla f=-\lambda\nabla h$.
3. Fjern leddet med $\gamma''(0)$ ved hjelp av steg 1:
   $$(f\circ\gamma)''(0)=v^T\nabla^2_{zz}L(z_*,\lambda)\,v.$$

Kurven selv bøyer seg, så det er Hessianen til $L$, ikke til $f$, som teller
langs tangentene. Er formen positiv for alle tangenter $v\ne0$, har vi et
strengt lokalt minimum; er den negativ, et strengt lokalt maksimum. Null i en
retning avgjør ikke saken. For $f=xy$ er
$\nabla^2_{zz}L=\left(\begin{smallmatrix}2\lambda&1\\1&2\lambda\end{smallmatrix}\right)$.
Med $\lambda=-1/2$ og $v=(-1,1)/\sqrt2$ gir formen $-2$, som over.

</details>

## 12.4 Lagrange møter lineær algebra

<div id="uke12-egenverdi"></div>

### Kandidattabellen er en egenverditabell

Skriv målet fra 12.3 med en symmetrisk matrise:

$$xy=z^TAz,\qquad A=\begin{bmatrix}0&\tfrac12\\\tfrac12&0\end{bmatrix}.$$

Hva er gradienten til $z^TAz$? Vi regner den ut i det lille tilfellet først.
For en symmetrisk $2\times2$-matrise er
$z^TAz=a_{11}x^2+2a_{12}xy+a_{22}y^2$, med partiellderiverte
$2a_{11}x+2a_{12}y$ og $2a_{12}x+2a_{22}y$. Altså er $\nabla(z^TAz)=2Az$ (det
gjelder i alle dimensjoner). Kontroll med vår $A$:
$2Az=2\bigl(\tfrac12y,\tfrac12x\bigr)=(y,x)=\nabla(xy)$. For sirkelen er
$\nabla h=2z$, og Lagranges likning blir da

$$2Az+2\lambda z=0\qquad\Longleftrightarrow\qquad Az=-\lambda z.$$

**En kandidat er en egenvektor, og $-\lambda$ er egenverdien.** Målverdien er
$z^TAz=-\lambda\,z^Tz=-\lambda$. Egenverdiene til $A$ er $\pm\tfrac12$, med
egenvektorer langs $(1,1)$ og $(1,-1)$. Det er akkurat tabellen i 12.3:
$\lambda=-\tfrac12$ gir maksimum $\tfrac12$, og $\lambda=\tfrac12$ gir
minimum $-\tfrac12$. På enhetssirkelen er $z^TAz$ Rayleigh-kvotienten fra
[uke 5](uke5.qmd#uke5-potens), og vi har vist:

> **Største og minste verdi av $z^TAz$ når $\lVert z\rVert_2=1$ er største og
> minste egenverdi av $A$.**

Begrunnelsen er den samme som i 12.3: maksimum og minimum finnes fordi
sirkelen er kompakt, og hvert punkt på sirkelen er regulært, så de er blant
kandidatene, altså egenvektorene.

**Største strekk.** I [uke 7](uke7.qmd#uke7-geometri) sendte matrisen
$B=\begin{bmatrix}0&2\\1&0\end{bmatrix}$ (der het den $A$) enhetssirkelen til en ellipse, og
største strekk var $\sigma_1=2$. Nå kan vi utlede det. Her er $Bz=(2y,\,x)$,
så $\lVert Bz\rVert_2^2=x^2+4y^2=z^T(B^TB)z$ med
$B^TB=\operatorname{diag}(1,4)$: samme type problem, og samme uttrykk som
ellipsen i 12.1. På sirkelen er $x^2=1-y^2$, så $x^2+4y^2=1+3y^2\le4$, med
likhet i $z=\pm e_2$, og største strekk er $\sqrt4=2$.

Vi har vist med likninger at kandidatene er egenvektorer. Forsøket viser det
samme som et bilde, og lar deg prøve andre matriser. Målet er å se at nivåkurvene
berører sirkelen nøyaktig i egenvektorene, slik nivålinjen berørte ellipsen
i 12.1.

### Eksperiment 3 – se egenvektorene på sirkelen

- Kjør cellen. Hvilke nivåkurver berører sirkelen, og hvor?
- Bytt til `plot_quadratic_on_circle(B.T @ B)`. Hvor ligger nå punktet med
  største strekk?
- Velg en egen symmetrisk matrise, for eksempel `[[2, 1], [1, 2]]`, og
  forutsi berøringspunktene før du kjører.

Cellen regner ut egenverdiene og egenvektorene med `np.linalg.eigh`, som er
`eigvalsh` fra uke 8, men som også gir egenvektorene. Figuren
lages av en ferdig hjelpefunksjon, `plot_quadratic_on_circle(A)`: den tegner
nivåkurvene til $z^TAz$, enhetssirkelen og egenvektorene.

```{pyodide-python}
#| label: week12-eigen-experiment
# Egenverdier og egenvektorer til A; figuren viser nivåkurvene til z^T A z på sirkelen.
A = np.array([[0, .5], [.5, 0]])
B = np.array([[0, 2.], [1, 0]])
vals, vecs = np.linalg.eigh(A)
print('egenverdier til A:     ', vals)
print('egenvektorer (kolonner):\n', vecs.round(4))
print('egenverdier til B^T B: ', np.linalg.eigvalsh(B.T @ B))
print('singulærverdier til B: ', np.linalg.svd(B, compute_uv=False))
plot_quadratic_on_circle(A)
```

**Hva viser forsøket?** Nivåkurvene $xy=\pm\tfrac12$ berører sirkelen
nøyaktig i egenvektorene, og verdien der er egenverdien: `eigh` gir $\pm0.5$
for $A$. For $B^TB$ gir `eigh` $1$ og $4$; nivåkurvene er ellipsene
$x^2+4y^2=c$, og kurven $c=4$ berører sirkelen i $\pm e_2$. Største strekk er
$\sqrt4=2$, og `svd` gir singulærverdiene $2$ og $1$.

**Øv på dette:** [største strekk med Lagrange](#uke12-oppg-strekk) i 12.6.

### Lineære krav gir et lineært system

<div id="uke12-kkt"></div>

Med ett lineært krav $c^Tz=d$ er normalen $c$ den samme i alle punkter. Med
flere lineære krav samler vi dem som $Cz=d$, der hver rad i $C$ er ett krav.
Hvert krav får sin multiplikator $\lambda_i$, og Lagranges likning blir

$$\nabla f(z)+C^T\lambda=0.$$

Likningen sier at $\nabla f$ er en kombinasjon av radene i $C$, altså av
normalene, akkurat som $\nabla f$ var parallell med $\nabla h$ i 12.2. De
tillatte retningene er **nullrommet** til $C$ fra
[uke 3](uke3.qmd#uke3-del3); hvorfor $\nabla f$ da står vinkelrett på dem,
viser «Gå i dybden» under eksperimentet.

Når $f$ er kvadratisk, er $\nabla f$ lineær i $z$, og alle likningene blir
lineære. For linjeeksempelet i 12.2, $f=x^2+y^2$ og $x+y=2$, får vi

$$\underbrace{\begin{bmatrix}2&0&1\\0&2&1\\1&1&0\end{bmatrix}}_{K}
\begin{bmatrix}x\\y\\\lambda\end{bmatrix}
=\begin{bmatrix}0\\0\\2\end{bmatrix}.$$

De to første radene er $\nabla f+\lambda\nabla h=0$, den siste er kravet.
Et slikt system kalles et **KKT-system** (etter Karush, Kuhn og Tucker).

Systemet er symmetrisk, akkurat som systemene vi løste med CG i uke 6 og
Cholesky i uke 10. Men begge metodene krevde mer: matrisen måtte være SPD.
Målet er å finne ut om metodene fra uke 6 og 10 kan brukes på et
KKT-system.

### Eksperiment 4 – løs KKT-systemet og prøv Cholesky

**Forutsi:** $K$ er symmetrisk. Er den SPD, slik at Cholesky fra uke 10 og
CG fra uke 6 kan brukes?

- Skriv ned forutsigelsen, og kjør cellen.
- Bytt høyresiden til `(0, 0, 4)`, altså linjen $x+y=4$. Forutsi løsningen
  før du kjører. Endrer egenverdiene seg?

Cellen løser systemet med `np.linalg.solve`, som ikke krever SPD, regner ut
egenverdiene og prøver Cholesky.

```{pyodide-python}
#| label: week12-kkt-experiment
# KKT-systemet for linjeeksempelet: løs det, se på egenverdiene og prøv Cholesky.
K = np.array([[2., 0, 1], [0, 2, 1], [1, 1, 0]])
rhs = np.array([0., 0, 2])
print('løsning (x, y, lambda):', np.linalg.solve(K, rhs))
print('egenverdier til K:     ', np.linalg.eigvalsh(K).round(2))
try:
    np.linalg.cholesky(K)
    print('Cholesky lyktes')
except np.linalg.LinAlgError:
    print('Cholesky feilet: K er ikke positiv definit')
```

**Hva viser forsøket?** Løsningen er $(1,1,-2)$, som for hånd i 12.2.
Egenverdiene er $-0.73$, $2$ og $2.73$: matrisen er symmetrisk, men
**indefinit**, og Cholesky feiler. Det er ikke en tilfeldighet: nullen
nederst til høyre gir $e_3^TKe_3=0$, og en SPD-matrise har $v^TKv>0$ for
alle $v\ne0$. Et KKT-system er derfor aldri SPD (se «Gå i dybden» under), og
CG og Cholesky kan ikke brukes direkte.

**Dette tar vi med oss.** Når målet er kvadratisk, blir Lagranges likninger
lineær algebra. Med sirkelkrav blir de et egenverdiproblem, der kandidatene
er egenvektorene. Med lineære krav blir de et symmetrisk, men indefinit
likningssystem, så CG og Cholesky virker ikke direkte. Nullromsmetoden i
«Gå i dybden» viser én vei rundt.

**Øv på dette:** [KKT-systemet for en linje](#uke12-oppg-kkt) i 12.6 og
[KKT-systemet og pseudoinversen](#uke12-py-kkt) i 12.7.

<details class="reading-step">
<summary>Gå i dybden: nullrommet, og en vei rundt det indefinitte systemet</summary>

**Hvorfor $\nabla f+C^T\lambda=0$ er riktig betingelse.** En retning $v$
endrer ikke $Cz$ når $Cv=0$. De tillatte retningene er altså nullrommet til
$C$. At $Cv=0$ betyr at $v$ står vinkelrett på hver rad i $C$. Likningen
sier at $\nabla f=-C^T\lambda$ er en lineærkombinasjon av radene. Da står
også $\nabla f$ vinkelrett på alle tillatte retninger:
$\nabla f\cdot v=-\lambda^TCv=0$. Målet endres altså ikke til første orden i
noen tillatt retning.

**Nullromsmetoden.** Ethvert tillatt punkt kan skrives $z=z_0+tZ$, der $z_0=(2,0)$ er én løsning
av kravet og $Z=(1,-1)$ spenner ut nullrommet til
$C=\begin{bmatrix}1&1\end{bmatrix}$. Da er kravet oppfylt for alle $t$, og vi
minimerer uten krav:

$$f(z_0+tZ)=(2+t)^2+t^2=4+4t+2t^2,\qquad
\frac{d}{dt}=4+4t=0\ \Rightarrow\ t=-1,\ z=(1,1).$$

Det reduserte problemet har én variabel og positiv krumning. Cellen setter
inn $t=-1$, kontrollerer at punktet oppfyller kravet, og tegner bildet med en
ferdig hjelpefunksjon. Der ser du $z_0$, nullromsretningen $Z$ og løsningen,
der $\nabla f=(2,2)$ er parallell med raden $(1,1)$ i $C$. Den prikkede
sirkelbuen er nivåkurven $f=2$, som berører linjen akkurat der.

```{pyodide-python}
#| label: week12-nullspace
# Nullromsmetoden: z = z0 + t*Z, med C z0 = d og C Z = 0. Regningen over ga t = -1.
z0, Z = np.array([2., 0]), np.array([1., -1])
z_best = z0 + (-1)*Z
print('z =', z_best, '  C z =', z_best.sum(), '  grad f =', 2*z_best)
plot_nullspace_method(z0, Z, z_best, 2*z_best)
```

**Nullromsmetoden generelt.** Med $z=z_0+Zt$, der kolonnene i $Z$ er en basis
for nullrommet og $t$ er en vektor med like mange tall som kolonner i $Z$,
setter vi inn i $f=\tfrac12z^TQz-b^Tz$ (som i neste boks). Utvidelsen av
$\tfrac12(z_0+Zt)^TQ(z_0+Zt)-b^T(z_0+Zt)$ gir
$$f(z_0+Zt)=\tfrac12t^T(Z^TQZ)t+t^TZ^T(Qz_0-b)+f(z_0),$$
som vi minimerer uten krav. Matrisen $Z^TQZ$ er SPD når $Q$ er positiv
definit på nullrommet, og da virker både Cholesky og CG igjen.

</details>

<details class="reading-step">
<summary>Gå i dybden: det generelle KKT-systemet og pseudoinversen</summary>

For $f(z)=\tfrac12z^TQz-b^Tz$ med symmetrisk $Q$ og krav $Cz=d$ er
$\nabla f=Qz-b$, og Lagranges likninger blir

$$\begin{bmatrix}Q&C^T\\C&0\end{bmatrix}
\begin{bmatrix}z\\\lambda\end{bmatrix}=\begin{bmatrix}b\\d\end{bmatrix}.$$

Hvis $C$ har $m$ uavhengige rader og $Q$ er positiv definit på nullrommet
til $C$, er matrisen invertibel. Den er likevel aldri positiv definit: for
$v=(0,w)$ er $v^TKv=0$. (Man kan vise at den har nøyaktig $m$ negative
egenverdier; i eksperiment 4 var $m=1$.)

**Minste norm.** Med $Q=I$ og $b=0$ minimerer vi $\tfrac12\lVert z\rVert_2^2$
under $Cz=d$. Første blokkrad gir $z=-C^T\lambda$, og andre gir
$-CC^T\lambda=d$. Dermed er

$$z=C^T(CC^T)^{-1}d,$$

som er pseudoinversløsningen $C^+d$ fra [uke 7.7](uke7.qmd#uke7-pseudoinvers)
når radene i $C$ er uavhengige. Kodeoppgaven
[KKT-systemet og pseudoinversen](#uke12-py-kkt) i 12.7 kontrollerer dette.

</details>

## 12.5 Finn et punkt numerisk og kontroller det

<div id="uke12-slsqp"></div>

For større problemer, som kjettingen i [prosjekt 12](project_week12.qmd) med ti
krav, løser vi ikke
Lagranges likninger for hånd. Vi bruker `minimize` med metoden `SLSQP`, som
tar imot likhetskrav, og kontrollerer svaret selv.

Eksempelet: punktet $a=(2,1)$ ligger utenfor enhetssirkelen. Finn
sirkelpunktet som ligger nærmest.

| Rolle | Uttrykk |
|:--|:--|
| Valg | $z=(x,y)$ |
| Mål | Minimer $F(z)=\tfrac12\lVert z-a\rVert_2^2$ |
| Krav | $h(z)=\lVert z\rVert_2^2-1=0$ |

Løseren gir en **numerisk kandidat**. Stoppflagget erstatter ikke to
kontroller vi må gjøre selv:

- **Betingelsesfeilen** $|h(z)|$: ligger punktet på sirkelen?
- **Stasjonaritetsfeilen** $\lVert\nabla F(z)+\lambda\nabla h(z)\rVert_2$:
  kan målgradienten balanseres av normalen?

Trenger vi $\lambda$, **velger vi den $\lambda$ som gjør
stasjonaritetsfeilen minst**. Det er minste kvadrater med én ukjent, som i
[uke 4](uke4.qmd#uke4-mk), og svaret er

$$\lambda=-\frac{\nabla F\cdot\nabla h}{\lVert\nabla h\rVert_2^2}.$$

Med flere krav samler vi gradientene $\nabla h_i^T$ som rader i
**Jacobimatrisen** $J$ (som i prosjekt 10), og løser
$\min_\lambda\lVert\nabla F+J^T\lambda\rVert_2$ med `np.linalg.lstsq`. Det
gjør vi i prosjektet. Hvorfor vi ikke bruker SciPys egne multiplikatorer,
står i [SciPy-oppslaget](#uke12-scipy).

<details class="reading-step">
<summary>Gå i dybden: formelen for multiplikatoren med minst feil</summary>

Kvadratet av stasjonaritetsfeilen er et andregradspolynom i $\lambda$:

$$\lVert\nabla F+\lambda\nabla h\rVert_2^2=\nabla F\cdot\nabla F
+2\lambda\,\nabla F\cdot\nabla h+\lambda^2\,\nabla h\cdot\nabla h.$$

Den deriverte med hensyn på $\lambda$ er
$2\,\nabla F\cdot\nabla h+2\lambda\,\nabla h\cdot\nabla h$, og den er null
for $\lambda=-\nabla F\cdot\nabla h/\lVert\nabla h\rVert_2^2$. Den
andrederiverte, $2\lVert\nabla h\rVert_2^2$, er positiv når kravet er
regulært, så dette er minimum.

</details>

Nå kan vi prøve alt dette på avstandsproblemet. Målet er å se hva
kontrollfeilene sier, og hva de ikke sier.

### Eksperiment 5 – finn og kontroller et sirkelpunkt

- Kjør cellen, og sammenlign punktet med $a/\lVert a\rVert_2$.
- Bytt startpunktet til `np.array([-.9, -.45])`, som ligger på linjen
  gjennom origo og $a$. Hva rapporterer løseren nå, og hvilke av tallene
  avslører at punktet ikke er det nærmeste?
- Flytt startpunktet litt bort fra linjen, for eksempel til
  `np.array([-.9, -.5])`. Hvor havner løseren nå?

Cellen kjører SLSQP fra punktet $(0.4,0.9)$, regner ut de to kontrollfeilene
og velger $\lambda$ med formelen over.

```{pyodide-python}
#| label: week12-slsqp-experiment
# F, grad_F, h og grad_h er definert i oppsettet; her står de igjen for oversiktens skyld.
a = np.array([2., 1.])
def F(z): return .5*np.sum((z-a)**2)
def grad_F(z): return z-a
def h(z): return np.dot(z, z)-1.
def grad_h(z): return 2*z

result = minimize(F, np.array([.4, .9]), jac=grad_F, method='SLSQP',
                  constraints=[{'type': 'eq', 'fun': h, 'jac': grad_h}],
                  options={'ftol': 1e-12, 'maxiter': 100})
z = result.x
gF, gh = grad_F(z), grad_h(z)
lam = -(gF @ gh)/(gh @ gh)                    # minste kvadraters valg av lambda
print('punkt z               =', z.round(8))
print('verdi F(z)            =', round(result.fun, 8))
print('betingelsesfeil |h|   =', f'{abs(h(z)):.1e}')
print('stasjonaritetsfeil    =', f'{np.linalg.norm(gF + lam*gh):.1e}')
print('multiplikator lambda  =', round(lam, 6))
print('løserens success      =', result.success)
print('eksakt a/|a|          =', (a/np.linalg.norm(a)).round(8))
```

**Hva viser forsøket?** Løseren finner $z\approx(0.89442719,\,0.44721360)$
med $F\approx0.76393202$ og $\lambda\approx0.618034$. Begge kontrollfeilene
er små, og punktet stemmer med $a/\lVert a\rVert_2$. At
`success=True` betyr bare at løseren stoppet på vanlig måte.

Fra $(-0.9,-0.45)$ finner løseren
$z\approx(-0.894,-0.447)=-a/\lVert a\rVert_2$, med `success=True`, begge
kontrollfeilene små og $\lambda\approx-1.618$. Det er det **fjerneste**
punktet, med $F\approx5.236$. Startpunktet ligger på linjen gjennom origo og
$a$. Der peker både $\nabla F$ og normalen langs linjen, så hvert steg blir
liggende på den. Flytter du starten litt bort fra linjen, finner løseren det
nærmeste punktet igjen. Kontrollfeilene viser bare at punktet er en
kandidat. Først verdien av $F$, eller ulikheten under, avgjør hvilken
kandidat som er best.

**Er det globalt nærmest?** For tillatte $z$ gir Cauchy–Schwarz
$a\cdot z\le\lVert a\rVert_2=\sqrt5$, så

$$F(z)=\tfrac12\bigl(\lVert a\rVert_2^2+1-2a\cdot z\bigr)\ge\tfrac12(\sqrt5-1)^2,$$

med likhet bare i $z=a/\sqrt5$. De to numeriske kontrollene viser at punktet
er en kandidat; ulikheten viser at det er det beste.

**Øv på dette:** [to kontrollfeil for et feil forslag](#uke12-oppg-kontroll)
i 12.6 og [de tre første kodeoppgavene](#uke12-python) i 12.7.

**En annen vei: straffemetoden.** I stedet for å kreve $h=0$ kan vi minimere
$F+\tfrac\mu2h^2$ uten krav, med et stort tall $\mu$. Gradienten er
$\nabla F+(\mu h)\nabla h$. Sammenlign med $\nabla F+\lambda\nabla h$: tallet
$\mu h$ spiller rollen til $\lambda$. Da blir $h$ liten, men ikke null, og
$\mu h$ nærmer seg multiplikatoren; i [prosjekt 12](project_week12.qmd) ser
du hva det koster når $\mu$ blir stor.

<details class="reading-step">
<summary>Gå i dybden: hva rapporterer SLSQP underveis?</summary>

Hvordan kommer SLSQP fram til svaret? Cellen kjører samme søk med en
`callback` som lagrer punktene SLSQP rapporterer, skriver ut $h$ og $F$ i
hvert av dem, og tegner dem sammen med nivåkurvene til $F$. Linjestykkene
viser bare rekkefølgen. Mellompunktene trenger ikke ligge på sirkelen, og
et punkt utenfor sirkelen kan ha lavere $F$ enn det beste tillatte punktet.

```{pyodide-python}
#| label: week12-slsqp-path
x0 = np.array([.4, .9])
path = [x0.copy()]
res = minimize(F, x0, jac=grad_F, method='SLSQP',
               constraints=[{'type': 'eq', 'fun': h, 'jac': grad_h}],
               callback=lambda zk: path.append(zk.copy()),
               options={'ftol': 1e-12, 'maxiter': 100})
print('h i de rapporterte punktene:', ' '.join(f'{h(p):.3f}' for p in path))
print('F i de rapporterte punktene:', ' '.join(f'{F(p):.3f}' for p in path))
plot_path_on_circle(path, a)
```

Det andre rapporterte punktet har $h=2.021$, langt utenfor sirkelen, og
$F=0.264$, lavere enn $F=0.764$ i det beste punktet på sirkelen.

**Begge stasjonære punkter.** Fra $z-a+2\lambda z=0$ følger
$z=a/(1+2\lambda)$, og kravet gir $|1+2\lambda|=\sqrt5$. Det nærmeste punktet
$a/\sqrt5$ og det fjerneste $-a/\sqrt5$ er begge stasjonære. Små
kontrollfeil alene skiller dem ikke; verdien av $F$ gjør det.

</details>

<details class="reading-step">
<summary>Gå i dybden: ulikhetskrav – skiven i stedet for sirkelen</summary>

Hva om punktet bare må ligge **i** skiven, $g(z)=\lVert z\rVert_2^2-1\le0$?
Da er det to muligheter:

- Ligger $a$ inne i skiven, er $z=a$ selv svaret. Kravet er **ikke aktivt**,
  og målet har gradient null der. Vi setter $\lambda=0$.
- Ligger $a$ utenfor, er svaret på randen, som over. Kravet er **aktivt**.

Begge tilfellene dekkes av **KKT-betingelsene** for en minimering med
$g\le0$ og $L=F+\lambda g$:

$$\nabla F+\lambda\nabla g=0,\qquad g\le0,\qquad \lambda\ge0,\qquad \lambda\,g=0.$$

Den siste likningen er **komplementær slakk** fra
[uke 11](uke11.qmd#uke11-slakk): enten er kravet aktivt ($g=0$), eller så er
prisen null ($\lambda=0$). Fortegnskravet $\lambda\ge0$ sier at $-\nabla F$,
retningen der $F$ avtar, peker ut av skiven. Å slippe kravet litt kan bare
hjelpe.

Cellen prøver begge tilfellene med SLSQP: én $a$ inne i skiven og én
utenfor. For hvert svar sjekker den om kravet er aktivt, og regner i så fall
ut $\lambda$ med formelen for minste kvadrater fra 12.5.

```{pyodide-python}
#| label: week12-disc
for a_test in (np.array([.5, .25]), np.array([2., 1.])):
    r = minimize(lambda q: .5*np.sum((q-a_test)**2), np.zeros(2), method='SLSQP',
                 constraints=[{'type': 'ineq', 'fun': lambda q: 1 - q @ q}])
    q = r.x
    active = abs(1 - q @ q) < 1e-8
    lam_d = -((q-a_test) @ (2*q))/((2*q) @ (2*q)) if active else 0.
    print(f'a = {a_test}: z = {q.round(6)}, aktivt: {active}, lambda = {lam_d:.6f}')
```

SciPy skriver ulikheter som `fun(z) >= 0`, derfor `1 - q @ q`. For
$a=(0.5,0.25)$ er kravet ikke aktivt og $\lambda=0$. For $a=(2,1)$ er det
aktivt, og $\lambda=0.618034=(\sqrt5-1)/2$, samme multiplikator som med
sirkelkravet.

**Øv på dette:** [aktivt eller ikke aktivt krav](#uke12-oppg-skive) i 12.6 (valgfri).

</details>

### Hva de tolv ukene har bygget

<div id="uke12-avslutning"></div>

Ukens spørsmål var hva som erstatter $\nabla f=0$ når punktet må ligge på en
kurve. Svaret er Lagranges likninger: $h=0$ og $\nabla f+\lambda\nabla h=0$.
De gir kandidater, ikke løsninger. Hvilken kandidat som er best, avgjorde vi
ved å sammenligne verdier eller med en global ulikhet. For kvadratiske mål
ble likningene lineær algebra, og et punkt fra en løser kontrollerte vi med
to kontrollfeil.

Ukene 1–7 ga verktøyene: flyttall og avrunding, iterasjon, likningssystemer,
nullrom og rang, minste kvadrater, egenverdier, SPD-matriser og CG, og
singulærverdier. Ukene 8–12 brukte dem på optimering: uke 8 ga eksistens,
Hessianen og konveksitet, uke 9 og 10 gradient- og Newtonmetoden med
kondisjonstallet og Cholesky, og uke 11 og 12 multiplikatorer som priser og
sertifikater. [Tre spørsmål](uke8.qmd#uke8-start) har fulgt oss siden
uke 8: Finnes det et beste svar? Hva forteller krumningen? Er kandidaten vi
fant, den beste? Underveis kom et fjerde til: Hvordan kontrollerer vi et tall
som en løser gir oss? Denne uken svarte vi med kompakthet, Lagranges
likninger, en global ulikhet og to kontrollfeil. Den arbeidsmåten
tar du med deg videre: regn ut et svar, og kontroller det med et argument
eller en uavhengig test.

## 12.6 Regneoppgaver

<div id="uke12-oppgaver"></div>

Oppgavene er sortert etter de tre ideene. De tre siste hører til «Gå i
dybden»-boksene og er valgfrie. Arbeid på papir først. Svar eksakt, for
eksempel `1/sqrt(5)`. I uttrykksfeltene bruker du `*` for multiplikasjon. Der
det spørres om ja/nei, skriver du **1 for ja, 0 for nei**. Begrunnelsene
skriver du i egne notater; feltene kontrollerer tallene.

::: {#week12-exercise-convention .math-exercise-context}

Vi bruker $h=0$ og $L=f+\lambda h$. Ved et regulært ekstremum må $h=0$ og
$\nabla f+\lambda\nabla h=0$. Løsningene av disse likningene er kandidater
som må klassifiseres.

:::

### Idé 1: Lagranges likninger og prisen (12.1–12.2)

<div id="uke12-oppg-normal"></div>

Ellipsen $h(x,y)=x^2+4y^2-1=0$ fra 12.1 har sitt øverste punkt i
$p=(0,1/2)$. Finn normalen $\nabla h(p)$ og en enhetstangent med positiv
$x$-komponent.

```{math-exercise}
#| label: week12-normal-tangent
#| caption: Normal og tangent i toppen av ellipsen
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: normalens x-komponent, normalens y-komponent, tangentens x-komponent, tangentens y-komponent

$\nabla h(p)=$ vec[0,4]

Enhetstangent $=$ vec[1,0]
```

**Forklar:** Kontroller at skalarproduktet av de to vektorene er null. Hva
betyr det geometrisk?

<div id="uke12-oppg-ellipse"></div>

Maksimer $f(x,y)=2x+y$ når $x^2+4y^2=1$. Bruk substitusjonen $w=2y$, slik at
kravet blir en sirkel, og bruk Cauchy–Schwarz som i håndeksempelet i 12.2.

```{math-exercise}
#| label: week12-ellipse-max
#| caption: Maksimum av 2x + y på ellipsen
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: maksimumspunktets x-koordinat, maksimumspunktets y-koordinat, maksimumsverdi, multiplikator ved maksimum

$(x,y)=$ vec[4/sqrt(17),1/(2*sqrt(17))]

Maksimumsverdi: _[sqrt(17)/2]

$\lambda=$ _[-sqrt(17)/4]
```

**Forklar:** Kontroller svaret med Lagranges likninger, og kontroller at
$\nabla h$ er parallell med $(2,1)$ i punktet.

<div id="uke12-oppg-sirkel"></div>

Maksimer $f(x,y)=3x-4y$ på enhetssirkelen, med $h=x^2+y^2-1=0$. Finn
maksimumspunktet og multiplikatoren.

```{math-exercise}
#| label: week12-circle-lagrange
#| caption: Et lineært mål på sirkelen
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: maksimumspunktets x-koordinat, maksimumspunktets y-koordinat, multiplikator ved maksimum

$(x,y)=$ vec[3/5,-4/5]

$\lambda=$ _[-5/2]
```

**Forklar:** Hvorfor er punktet globalt maksimum, og ikke bare en kandidat?

<div id="uke12-oppg-boks"></div>

En sylinderformet boks har radius $x>0$ og høyde $y>0$. Volumet skal være
$V$, altså $h(x,y)=\pi x^2y-V=0$. Overflaten er $f(x,y)=2\pi x^2+2\pi xy$.
Sett opp Lagranges likninger. Bruk likningen for $\partial L/\partial y$ til
å finne $\lambda$ uttrykt med $x$, og den andre likningen til å finne
forholdet mellom høyde og radius. Bruk til slutt prisformelen fra 12.2: hvor
mye øker minste overflate $A_*$ per enhet ekstra volum?

```{math-exercise}
#| label: week12-can
#| caption: Boksen med minst overflate for gitt volum
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: høyde delt på radius, multiplikator som uttrykk i x, økning i overflate per volumenhet

$y/x=$ _[2]

$\lambda=$ __[-2/x]

$\frac{dA_*}{dV}=$ __[2/x]
```

**Forklar:** Hvorfor er ekte hermetikkbokser ofte høyere enn dette? Nevn én
ting modellen ser bort fra.

### Idé 2: Kandidater, egenverdier og KKT-systemet (12.3–12.4)

<div id="uke12-oppg-form"></div>

La $f(x,y)=x^2+4xy+y^2$ på enhetssirkelen og $p=(1,1)/\sqrt2$. Regn ut
$f(p)$ og andrederiverten av $f(\cos t,\sin t)$ ved $t=\pi/4$ (tips:
$f(\cos t,\sin t)=1+2\sin2t$). Skriv $f=z^TAz$ med en symmetrisk $A$, og finn
egenverdiene. Hvilken multiplikator hører til $p$?

```{math-exercise}
#| label: week12-quadratic-form
#| caption: Kandidat, krumning og egenverdier for en kvadratisk form
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: funksjonsverdi i p, andrederivert langs sirkelen, største egenverdi, minste egenverdi, multiplikator i p

$f(p)=$ _[3]

$\frac{d^2}{dt^2}f(\cos t,\sin t)\big|_{t=\pi/4}=$ _[-8]

Egenverdier til $A$: største _[3], minste _[-1]

$\lambda$ i $p$: _[-3]
```

<div id="uke12-oppg-strekk"></div>

La $B=\begin{bmatrix}3&0\\4&5\end{bmatrix}$. Maksimer
$\lVert Bz\rVert_2^2=z^TB^TBz$ når $\lVert z\rVert_2=1$. Regn ut $B^TB$ og
egenverdiene. Velg maksimumspunktet med positive koordinater.

```{math-exercise}
#| label: week12-stretch
#| caption: Største strekk som egenverdiproblem
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: største egenverdi til BᵀB, minste egenverdi til BᵀB, største strekk, maksimumspunktets x-koordinat, maksimumspunktets y-koordinat

Egenverdier til $B^TB$: største _[45], minste _[5]

Største strekk $\max\lVert Bz\rVert_2=$ _[3*sqrt(5)]

Maksimumspunkt $z=$ vec[1/sqrt(2),1/sqrt(2)]
```

**Forklar:** Sammenlign med `np.linalg.svd(B)`.

<div id="uke12-oppg-kkt"></div>

Minimer $f(x,y)=x^2+y^2$ når $x+2y=5$. Skriv Lagranges likninger som et
$3\times3$-system $K(x,y,\lambda)^T=(0,0,5)^T$ og løs det. Regn ut
determinanten til $K$, og avgjør om $K$ er SPD.

```{math-exercise}
#| label: week12-kkt
#| caption: KKT-systemet for nærmeste punkt på en linje
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: x, y, multiplikator, determinant til K, K er SPD

$(x,y)=$ vec[1,2]

$\lambda=$ _[-2]

$\det K=$ _[-10]

$K$ er SPD: _[0]
```

**Forklar:** Hvorfor viser fortegnet til determinanten alene at $K$ ikke er
SPD?

### Idé 3: Kontroller et numerisk svar (12.5)

<div id="uke12-oppg-kontroll"></div>

I avstandsproblemet fra 12.5 er $a=(2,1)$,
$F(z)=\tfrac12\lVert z-a\rVert_2^2$ og $h(z)=\lVert z\rVert_2^2-1$. En løser
rapporterer $z=(1,0)$ og $\lambda=1/2$. Regn ut begge kontrollfeilene.

```{math-exercise}
#| label: week12-numeric-check
#| caption: To kontrollfeil for et feil forslag
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: betingelsesfeil, stasjonaritetsfeil

$|h(z)|=$ _[0]

$\lVert\nabla F(z)+\lambda\nabla h(z)\rVert_2=$ _[1]
```

**Forklar:** Hvilken kontroll avslører at punktet ikke er stasjonært? Kan en
annen $\lambda$ gjøre stasjonaritetsfeilen mindre?

### Til fordypningene (valgfritt)

<div id="uke12-oppg-degenerert"></div>

Hører til «Gå i dybden: når normalen forsvinner» i 12.2. La $f(x,y)=x+3y$ og
$h(x,y)=x^2+y^2=0$. Finn det eneste tillatte punktet og $\nabla h$ der.

```{math-exercise}
#| label: week12-degenerate-check
#| caption: Et krav uten normal
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: punktets x-koordinat, punktets y-koordinat, x-komponent av grad h, y-komponent av grad h

Tillatt punkt $=$ vec[0,0]

$\nabla h=$ vec[0,0]
```

**Forklar:** Hvorfor kan ingen multiplikator gjøre $\nabla f+\lambda\nabla h=0$,
selv om punktet er et optimum?

<div id="uke12-oppg-grense"></div>

Hører til «Gå i dybden: en multiplikator gir en nedre grense» i 12.2. Bruk
$F(z)=\tfrac12\lVert z-(2,1)\rVert_2^2$, $h(z)=\lVert z\rVert_2^2-1$ og
$\lambda=1/2$. Da er $L=F+\lambda h$ kvadratisk. Finn $c$ slik at Hessianen
til $L$ er $cI$, minimumsverdien av $L$ over alle $z$, og $F(1,0)$.

```{math-exercise}
#| label: week12-dual-bound
#| caption: En nedre grense fra Lagrangefunksjonen
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: tallet c i Hessianen, minste verdi av L, F i punktet (1 0)

$c=$ _[2]

$\min_zL(z,1/2)=$ _[3/4]

$F(1,0)=$ _[1]
```

**Forklar:** Er grensen skarp? Sammenlign med $\tfrac12(\sqrt5-1)^2$.

<div id="uke12-oppg-skive"></div>

Hører til «Gå i dybden: ulikhetskrav» i 12.5. Finn punktet i skiven
$\lVert z\rVert_2^2\le1$ som ligger nærmest $a$, med
$F=\tfrac12\lVert z-a\rVert_2^2$, $g=\lVert z\rVert_2^2-1$ og $L=F+\lambda g$.
Gjør det for $a=(0.3,0.4)$ og for $a=(0,3)$.

```{math-exercise}
#| label: week12-disc-kkt
#| caption: Aktivt eller ikke aktivt krav i skiven
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: aktivt for a=(0.3 0.4), multiplikator for a=(0.3 0.4), x-koordinat for a=(0 3), y-koordinat for a=(0 3), multiplikator for a=(0 3)

$a=(0.3,0.4)$: aktivt _[0], $\lambda=$ _[0]

$a=(0,3)$: $z=$ vec[0,1], $\lambda=$ _[1]
```

**Forklar:** Kontroller fortegnskravet og komplementær slakk i begge
tilfellene.

## 12.7 Python: prøv kontrollene selv

<div id="uke12-python"></div>

Oppgavene har egne importer og definisjoner og kan kjøres uavhengig av
forsøkene. Fyll bare hullene merket `TODO`. Kontrollene vurderer resultatet
uten å vise løsningen.

<div id="uke12-scipy"></div>

<details>
<summary>SciPy-oppslag: SLSQP og multiplikatoren</summary>

| Uttrykk | Betydning |
|:--|:--|
| `method="SLSQP"` | En metode i `minimize` som tar imot likhets- og ulikhetskrav. |
| `{"type": "eq", "fun": h, "jac": grad_h}` | Krever $h(z)=0$ og oppgir gradienten (normalen). Flere krav: en liste med ordbøker, eller én `fun` som returnerer en vektor og en `jac` som returnerer Jacobimatrisen. |
| `{"type": "ineq", "fun": lambda z: -g(z)}` | Krever at funksjonen er $\ge0$. Et krav $g(z)\le0$ sendes derfor som $-g$. |
| `options={"ftol": 1e-12, "maxiter": 100}` | Løserens stopptoleranse og grense for antall iterasjoner. |
| `np.linalg.lstsq(J.T, -grad, rcond=None)[0]` | Multiplikatorene som gjør $\lVert\nabla F+J^T\lambda\rVert_2$ minst, med `grad` $=\nabla F$. |

`result.x`, `result.fun` og `result.success` betyr det samme som i
[uke 8](uke8.qmd#uke8-python-local). Nyere SciPy-versjoner gir også
`result.multipliers`, men med motsatt fortegn av vårt ($L=f-\lambda h$).
SciPy 1.14 i nettleseren gir dem ikke. Vi beregner derfor $\lambda$ selv med
`lstsq`, som virker overalt, og kontrollerer $|h|$ og
$\lVert\nabla F+\lambda\nabla h\rVert_2$.

</details>

<div id="uke12-py-normal"></div>

**Normalen til ellipsen.** For $h(x,y)=x^2+4y^2-1$ skal
`grad_h(z)` returnere gradienten som en NumPy-array.

```{py-exercise}
#| label: week12-python-normal
#| caption: Beregn normalvektoren til en ellipse
#| show-test-hints: false
import numpy as np

def grad_h(z):
    x, y = z
    # TODO: Bytt ut begge komponentene med de partiellderiverte av h.
    return np.array([0., 0.])

## TESTS ##
assert np.allclose(grad_h(np.array([0., .5])), [0., 4.])
assert np.allclose(grad_h(np.array([1., 0.])), [2., 0.])
assert np.allclose(grad_h(np.array([.25, -.5])), [.5, -4.])
```

<div id="uke12-py-kontroll"></div>

**Les et numerisk svar.** For avstandsproblemet i 12.5 skal
`check(z, lam)` returnere betingelsesfeilen $|h(z)|$ og
stasjonaritetsfeilen $\lVert\nabla F(z)+\lambda\nabla h(z)\rVert_2$.

```{py-exercise}
#| label: week12-python-residuals
#| caption: Kontroller betingelsesfeil og stasjonaritet
#| show-test-hints: false
import numpy as np

a = np.array([2., 1.])

def h(z):
    return np.dot(z, z)-1.

def grad_h(z):
    return 2*z

def grad_F(z):
    return z-a

def check(z, lam):
    # TODO: Regn ut absolutt betingelsesfeil.
    feasibility = None
    # TODO: Regn ut lengden av grad_F(z) + lam*grad_h(z).
    stationarity = None
    return feasibility, stationarity

## TESTS ##
assert np.allclose(check(np.array([1., 0.]), .5), (0., 1.))
assert np.allclose(check(np.array([0., 0.]), 0.), (1., np.sqrt(5)))
assert np.allclose(check(a/np.sqrt(5), (np.sqrt(5)-1)/2), (0., 0.), atol=1e-12)
```

<div id="uke12-py-slsqp"></div>

**Send kravet til SLSQP.** Fyll inn ordboken som angir
$h(z)=0$ og gradienten.

```{py-exercise}
#| label: week12-python-slsqp
#| caption: Legg inn likhetsbetingelsen i SLSQP
#| show-test-hints: false
import numpy as np
from scipy.optimize import minimize

a = np.array([2., 1.])

def F(z):
    return .5*np.sum((z-a)**2)

def grad_F(z):
    return z-a

def h(z):
    return np.dot(z, z)-1.

def grad_h(z):
    return 2*z

def solve(start):
    # TODO: Sett inn ordboken med type 'eq', fun h og jac grad_h.
    condition = None
    return minimize(F, start, jac=grad_F, method="SLSQP",
                    constraints=[condition], options={"ftol": 1e-12})

## TESTS ##
for start in (np.array([.4, .9]), np.array([1., 0.])):
    result = solve(start)
    assert abs(h(result.x)) < 1e-8
    assert np.allclose(result.x, a/np.sqrt(5), atol=1e-6)
```

<div id="uke12-py-kkt"></div>

**KKT-systemet og pseudoinversen.** *Valgfri: bygger på den valgfrie fanen
[7.7](uke7.qmd#uke7-pseudoinvers).* Minimer
$\tfrac12\lVert z\rVert_2^2$ når $Cz=d$. Bygg blokkmatrisen
$K=\begin{bmatrix}I&C^T\\C&0\end{bmatrix}$ med `np.block`, løs
$K(z,\lambda)^T=(0,d)^T$ og returner bare $z$. Sammenlign etterpå med
`np.linalg.pinv(C) @ d`.

```{py-exercise}
#| label: week12-python-kkt
#| caption: Løs et KKT-system og sammenlign med pseudoinversen
#| show-test-hints: false
import numpy as np

C = np.array([[1., 1, 1], [1, -1, 2]])
d = np.array([3., 1])

def kkt_min_norm(C, d):
    m, n = C.shape
    # TODO: Bygg K med np.block, høyresiden (0, d), løs og returner z (de n første).
    return np.zeros(n)

## TESTS ##
z = kkt_min_norm(C, d)
assert np.allclose(C @ z, d)
assert np.allclose(z, np.linalg.pinv(C) @ d)
C2 = np.array([[1., 2, 0, 1]]); d2 = np.array([4.])
assert np.allclose(kkt_min_norm(C2, d2), np.linalg.pinv(C2) @ d2)
```

:::
