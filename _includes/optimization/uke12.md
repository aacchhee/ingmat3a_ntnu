::: {.panel-tabset}

## 12.0 Oversikt

::: {#uke12-start}
:::

### Hvor er det høyest på stien, og hva gir den ytre runden?

#### Situasjonen

En sti går rundt en sjø. Terrenget stiger jevnt mot nordøst: jo lenger nordøst du kommer, desto høyere er det. En turgåer vil gå til det høyeste punktet på stien, for eksempel fordi utsikten er best der. Han må holde seg på stien hele veien.

Vi kaller ham **Arild**. Vi gir ham et kart. Tallet $x$ er antall kilometer mot øst og $y$ antall kilometer mot nord, målt fra midten av sjøen. Høyden måler vi i hundre meter, regnet fra et nullnivå midt på kartet. Steder under nullnivået får negativ høyde. I terrenget vårt er høyden
$$f(x,y)=x+2y.$$
Hver kilometer mot øst gir altså 100 meter mer høyde, og hver kilometer mot nord gir 200 meter mer. Terrenget stiger brattest i retningen $(1,2)$: to kilometer mot nord for hver kilometer mot øst.

Modellen er grov. Vi tenker oss terrenget som en jevn skråning og ser bare på høydene langs stien. Sjøen forklarer bare hvorfor Arild må holde seg på stien.

Stien er en avlang ring rundt sjøen: 2 km fra vest til øst og 1 km fra sør til nord. Vi beskriver den med en funksjon, **kravfunksjonen**
$$h(x,y)=x^2+4y^2-1.$$
Funksjonen $h$ forteller Arild hvilken side av stien han er på: $h$ er negativ inne mot sjøen, null på stien og positiv utenfor. Midt i sjøen er $h(0,0)=-1$. **Stien er punktene der $h(x,y)=0$**, altså $x^2+4y^2=1$. For eksempel ligger $(1,0)$ og $(0,\tfrac12)$ på stien.

Arild har tre spørsmål:

1. **Hvor på stien er det høyeste punktet?**
2. **Hvordan kan han være sikker på at det er det høyeste?** Stien har uendelig mange punkter, så han kan ikke gå hele stien og måle hvert sted.
3. **Hva gir den ytre runden?** Litt lenger fra sjøen går en ytre, merket runde med samme form. Hvor mye høyere kommer han hvis han tar den i stedet?

#### Fra turen til matematikk

For å svare oversetter vi turen til matematikk. Hver ting på turen får sin motpart:

| På turen | I matematikken |
|:--|:--|
| Et sted på kartet | Et punkt $(x,y)$ |
| Høyden i terrenget | **Målfunksjonen** $f(x,y)$ (engelsk: *objective function*), her $x+2y$ |
| Høydekurver på kartet (også kalt koter): linjer som forbinder steder med samme høyde | **Nivålinjene** til $f$: kurvene der $f(x,y)$ har samme verdi |
| Hvilken side av stien du er på | Kravfunksjonen $h(x,y)$, for eksempel $x^2+4y^2-1$: negativ inne, null på stien, positiv ute |
| Stien rundt sjøen | Kravet: punktene der $h(x,y)=0$ |
| Brattest oppover | Gradienten $\nabla f=(\partial f/\partial x,\ \partial f/\partial y)$: den peker dit $f$ vokser raskest |
| Rett ut fra stien, vinkelrett på den | Gradienten $\nabla h$: den peker dit $h$ vokser raskest. Langs stien er $h=0$ hele tiden, så $\nabla h$ står vinkelrett på stien; og fordi $h$ går fra negativ inne til positiv ute, peker den utover |
| Det høyeste punktet på stien | Maksimum av $f$ med kravet |

Lengden på $\nabla f$ sier hvor bratt det er. I terrenget vårt er $\nabla f=(1,2)$ overalt. For stien er $\nabla h=(2x,8y)$; i punktet $(1,0)$ er $\nabla h=(2,0)$, rett mot øst og ut fra sjøen.

Å holde seg på stien er et **krav** som er en likning. Et slikt krav kalles en **likhetsbetingelse** eller **bibetingelse**; vi sier ofte bare **krav**.

**Ukens spørsmål.** Med Arilds ord: **Hvor på stien er det høyest, og hvordan kan vi være sikre på det uten å gå hele stien?** I matematikkens språk: **Hva erstatter $\nabla f=0$ når punktet må ligge på en kurve, og hvordan vet vi at kandidaten vi finner, er den beste?** Svaret på det tredje spørsmålet, om den ytre runden, kommer ut av de samme likningene.

#### Veien gjennom uken

Vi svarer på spørsmålene i tre steg:

1. **Hvor er det høyeste punktet? (12.1–12.2).** Først ser vi på kartet. I det høyeste punktet berører høydekurven stien, og «brattest oppover» peker rett ut fra stien. Det gir **Lagranges likninger**, og av dem kan vi regne ut punktet.
2. **Hva gir den ytre runden? (12.2).** Lagranges likninger inneholder et ekstra ukjent tall. Det viser seg å fortelle hvor mye høyere det høyeste punktet blir på en runde litt lenger ut, omtrent som ressursprisene i uke 11 fortalte hva én ekstra maskintime var verdt.
3. **Hvordan kan han være sikker? (12.3–12.5).** Et sted der stien er flat, trenger ikke være det høyeste. Vi finner alle flate steder og velger riktig (12.3). Når høyden er en kvadratisk funksjon, som $xy$, blir det matriseregning (12.4). Til slutt kontrollerer vi et punkt som en kartapp foreslår (12.5).

I [uke 11](uke11.qmd) var kravene rette linjer, og svaret lå i et hjørne. Nå er stien krum, og svaret ligger et sted langs kurven. Prosjektet bruker samme idé: kjettingen henger slik at summen av høydene til leddpunktene (energien) blir minst mulig når leddene har faste lengder, og de ekstra tallene i Lagranges likninger blir kreftene i kjettingen. Det er samme type spørsmål som Arilds, med minimum i stedet for maksimum og ti krav i stedet for ett.

**Forelesning** viser hovedløpet. **Gå i dybden**-boksene gir begrunnelser,
spesialtilfeller og ulikhetskrav. Regneoppgavene står i 12.6 og
kodeoppgavene i 12.7.

### Kort løype

**Hvor er det høyeste punktet?**

1. [Nivålinjen berører stien](#uke12-tangent): en applet med kart over en rund og en avlang sti.
2. [Lagranges likninger](#uke12-lagrange): brattest oppover står vinkelrett på stien.

**Hva gir den ytre runden?**

3. [Hva gir den ytre runden?](#uke12-pris): et ekstra tall i Lagranges likninger virker som en pris, som ressursprisene i uke 11.

**Hvordan kan han være sikker?**

4. [Kandidater er ikke løsninger](#uke12-kandidater): fire flate steder, men bare to høyder.
5. [Kandidattabellen er en egenverditabell](#uke12-egenverdi): uke 5 og 7.
6. [Lineære krav gir et lineært likningssett](#uke12-kkt): uke 3, 6 og 10.
7. [Finn et punkt numerisk og kontroller det](#uke12-slsqp): kartappen SLSQP.

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 3: nullrom](uke3.qmd#uke3-del3) | Hvilke retninger endrer ikke $Cz$? |
| [Uke 4: komponent langs en retning](uke4.qmd#uke4-retning) | Hvilken enhetsretning gir størst komponent? |
| [Uke 5: Rayleigh-kvotienten](uke5.qmd#uke5-rayleigh) | Hva er størst mulig $z^TAz$ når $\lVert z\rVert_2=1$? |
| [Uke 6: CG](uke6.qmd#uke6-cg) og [uke 10: Cholesky](uke10.qmd#uke10-cholesky) | Hva krever metodene av matrisen? |
| [Uke 7: største strekk](uke7.qmd#uke7-geometri) og [pseudoinvers](uke7.qmd#uke7-pseudoinvers) | Hvorfor er $\sigma_1$ det største strekket? |
| [Uke 8: kompakthet](uke8.qmd#uke8-kompakt) | Finnes det alltid et høyeste punkt på en lukket sti? |
| [Uke 11: hva en ekstra enhet er verdt](uke11.qmd#uke11-sensitivitet) | Hva er én enhet mer av en ressurs verdt? |

### Læringsmål

Etter denne uken skal du kunne

- finne tangent og normal til en regulær likhetsbetingelse i et punkt,
- sette opp og løse Lagranges likninger for én likhetsbetingelse,
- tolke multiplikatoren i Lagranges likninger som en pris: hvor mye den beste verdien endres når kravet endres litt (hva en runde litt lenger ut gir),
- skille kandidater (flate steder) fra løsninger ved å sammenligne verdier eller finne en global grense,
- forklare hvorfor en kvadratisk form på enhetssirkelen gir et egenverdiproblem,
- sette opp likningssettet for en kvadratisk målfunksjon med lineære krav, og forklare hvorfor
  matrisen ikke er SPD,
- kontrollere både betingelsesfeil og stasjonaritetsfeil i et numerisk SLSQP-svar.

## 12.1 Nivålinjen berører stien

::: {#uke12-tangent}
:::

### Rund sti eller avlang sti?

Vi begynner med den enkleste stien: en tenkt rund sti med radius 1 km, som om sjøen var rund. Kravfunksjonen er $h(x,y)=x^2+y^2-1$ (negativ inne mot sjøen, positiv utenfor), og stien er punktene der $h(x,y)=0$, altså $x^2+y^2=1$.

På den runde stien kan vi finne det høyeste punktet uten noen ny metode. Hvert punkt
på stien ligger 1 km fra sjøens midte, i en eller annen retning. Høyden $x+2y$ kan skrives som skalarproduktet av
gradienten $\nabla f=(1,2)$, retningen der terrenget stiger brattest, og $(x,y)$:

$$x+2y=(1,2)\cdot(x,y)=\lVert(1,2)\rVert\,\lVert(x,y)\rVert\cos\theta=\sqrt5\cos\theta,$$

der $\theta$ er vinkelen mellom retningen $(1,2)$ og retningen ut til punktet, og
$\lVert(x,y)\rVert=1$ fordi punktet ligger på stien. Høyden er altså størst når
$\cos\theta=1$, det vil si når punktet ligger rett i gradientens retning $(1,2)$ fra midten. Det høyeste punktet på den runde stien er derfor

$$\frac{(1,2)}{\sqrt5}\approx(0.45,\,0.89),$$

og høyden der er $\sqrt5\approx2.24$, altså 224 meter.

Tallet $\sqrt5\cos\theta$ kjenner du fra projeksjonene i [uke 4](uke4.qmd#uke4-projeksjon): det er komponenten av $(1,2)$ langs retningen ut til punktet, altså lengden av projeksjonen av $(1,2)$ på den retningen. Projeksjonen er lengst når retningen er den samme som $(1,2)$.

Men sjøen er ikke rund. Nå bytter vi den runde stien med den avlange stien $x^2+4y^2=1$ fra oversikten. Terrenget er det samme. Argumentet med vinkelen virker ikke lenger, for punktene på stien ligger ikke like langt fra midten. Hvor er det høyeste punktet nå?

Appleten viser et kart over stien med høyden og tre piler i punktet du velger. Hvorfor akkurat pilene er interessante, forklarer vi rett etter forsøket. Målet er å finne det høyeste punktet på den avlange stien og se hva som kjennetegner det.

### Eksperiment 1 – fra rund sti til avlang sti

| Rolle | Uttrykk | Hva det betyr |
|:--|:--|:--|
| Valg | $z=(x,y)$ | Stedet på kartet. Vi flytter det langs stien. |
| Målfunksjon | Maksimer $f(x,y)=x+2y$ | Høyden. Det er også skalarproduktet $(1,2)\cdot z$. |
| Krav | $h(x,y)=0$ med $h(x,y)=x^2+4y^2-1$ | Stien. Bare punkter på ellipsen er tillatt. |

Dra punktet $z$ langs stien. Slik leser du figuren:

- **Stiplet brun linje:** **Nivålinjen** $x+2y=f(z)$ er høydekurven gjennom
  stedet der Arild står: alle steder med samme høyde.
- **Rød pil:** Retningen til $\nabla f=(1,2)$, brattest oppover.
- **Grønn pil:** Retningen til $\nabla h=(2x,8y)$, rett ut fra stien.
- **Grå pil:** $v$ er en enhetstangent til ellipsen, altså retningen langs
  stien. Tallet $\nabla f\cdot v$ øverst i figuren sier hvor mange hundre meter
  høyden endres per kilometer han går i pilens retning. Positivt tall betyr at
  han stiger, negativt at han synker.
- **Grå sirkel og grått punkt:** Den runde stien og dens høyeste punkt $(1,2)/\sqrt5$.

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
// Enhetstangenten v = (-8y, 2x)/|...| står vinkelrett på normalen og peker mot urviseren.
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

1. Start i $z=(1,0)$, østspissen av stien. Hvilken vei langs stien må du gå for at høyden skal øke? Hva sier tallet $\nabla f\cdot v$?
2. Trykk **z langs (1, 2)**. Det er stedet på stien som ligger i retningen $(1,2)$ fra sjøens midte, altså i samme retning som svaret på den runde stien. Er dette fortsatt det høyeste punktet?
3. Dra $z$ til høyden $f$ blir størst mulig. Les av punktet, vinkelen og
   $\nabla f\cdot v$.
4. Hva gjør nivålinjen i det høyeste punktet?

**Hva viser forsøket?** Sammenlign høydene:

| Punkt på stien | Målverdi (høyde) |
|:--|:--|
| Punktet i retningen $(1,2)$ | $f\approx1.213$ |
| Høyeste punkt, $z\approx(0.707,\,0.354)$ | Omtrent $1.414$ |

Svaret fra den runde stien, «gå rett i retningen $(1,2)$ fra midten», gjelder altså ikke på den avlange
stien. Men tre ting gjelder fortsatt i det høyeste punktet:

- tallet $\nabla f\cdot v$ er **null**: stien stiger før punktet og synker
  etter det, så den er flat akkurat der;
- nivålinjen **berører** stien uten å krysse den;
- den røde og den grønne pilen er **parallelle**: vinkelen er $0^\circ$.

**Hva betyr det for Arild?** Nivålinjen er høydekurven gjennom stedet han står.
Krysser høydekurven stien, går stien høyere på den ene siden, og stedet kan ikke være
det høyeste. I det høyeste punktet berører høydekurven stien akkurat, så han går
verken opp eller ned. Terrenget stiger likevel fortsatt mot nordøst, også her:
brattest oppover peker rett ut fra stien. Men der får han ikke gå, for han må
holde seg på stien. Resten av uken handler om denne observasjonen.

### Tangent og normal

- **Tangentretning:** Viser hvilken vei Arild kan begynne å gå langs
  stien fra et punkt.
- **Normalretning:** Står vinkelrett på tangenten, altså rett ut fra stien.
- **Gradienten som normal:** Fra Matematikk 2 vet vi at gradienten står
  vinkelrett på nivåkurvene (gradienten selv møtte vi også i
  [uke 6](uke6.qmd#uke6-retning)). Stien er punktene der $h=0$, altså en
  nivåkurve for $h$. Derfor er $\nabla h$ en normal til stien, så lenge
  $\nabla h\ne0$.
- **Regulært krav:** Når $\nabla h\ne0$, kaller vi kravet **regulært** i
  punktet.

**Regn for hånd.** Vi undersøker østspissen $(1,0)$ av stien.

1. $\nabla h=(2x,8y)$, så $\nabla h(1,0)=(2,0)$. Normalen peker langs
   $x$-aksen, rett ut fra stien.
2. En enhetstangent står vinkelrett på normalen: $v=(0,1)$. Fra $(1,0)$ kan
   vi gå både nordover og sørover langs stien.
3. Målgradienten er $\nabla f=(1,2)$. Stigningen langs tangenten er
   $\nabla f\cdot v=(1,2)\cdot(0,1)=2$.
4. Stigningen er positiv, så Arild stiger når han går nordover: 2 hundre
   meter per kilometer. Østspissen er ikke det høyeste punktet, som i
   spørsmål 1 i appleten.

Appleten viser denne stigningen som tallet $\nabla f\cdot v$. I det høyeste
punktet er den null, og i 12.2 regner vi ut punktet eksakt.

**Dette tar vi med oss.**

- **Langs stien:** I det høyeste og i det laveste punktet på stien må
  stigningen langs tangenten være null.
- **Normalene:** Det er det samme som at $\nabla f$ står vinkelrett på
  tangenten, altså er parallell med normalen $\nabla h$.
- **Gradienten selv:** Målgradienten trenger ikke være null, slik den må være i et indre
  ekstremum (se [uke 8.3](uke8.qmd#uke8-hessian)).

## 12.2 Lagranges likninger

::: {#uke12-lagrange}
:::

### Brattest oppover peker rett ut fra stien

Nå skriver vi bildet fra 12.1 som likninger, slik at vi kan regne ut det
høyeste punktet i stedet for å dra i en applet.

At $\nabla f$ og $\nabla h$ er parallelle, betyr at den ene er et tall ganger
den andre. Vi skriver det som

$$\nabla f+\lambda\nabla h=0.$$

- **Lagrangemultiplikator:** Tallet $\lambda$.
- **Lagrangefunksjonen:** $L(z,\lambda)=f(z)+\lambda h(z)$.

Et regulært lokalt ekstremum $z_*$ må oppfylle begge **Lagranges likninger**:

$$\boxed{h(z_*)=0,\qquad \nabla f(z_*)+\lambda\nabla h(z_*)=0.}$$

- **Første likning:** Punktet er tillatt, altså på stien.
- **Andre likning:** Stigningen langs tangenten er null, så brattest oppover
  står vinkelrett på stien: rett ut fra stien i det høyeste punktet, rett inn
  mot sjøen i det laveste.
- **Samlet fra $L$:** Begge får vi ved å sette alle partiellderiverte av
  $L$ lik null, også den med hensyn på $\lambda$.

Med to variabler er dette tre likninger med tre ukjente: $x$, $y$ og
$\lambda$.

- **Kandidat:** Et punkt som oppfyller likningene, kalles **stasjonært under
  bibetingelsen**. Stien er flat der: Arild verken stiger eller synker i
  første lille skritt. Det er en **kandidat**, ikke automatisk det høyeste
  eller laveste punktet.
- **Forutsetning:** Regularitet, $\nabla h(z_*)\ne0$, trengs fordi
  $\nabla h$ ellers ikke er noen normal; se «Gå i dybden» nedenfor.

::: {.callout-note title="Håndeksempel: den avlange stien fra 12.1"}

**Utgangspunkt.** Vi regner ut punktet appleten viste. Arild går på den avlange stien, og
terrenget er $f(x,y)=x+2y$. Kravfunksjonen er $h(x,y)=x^2+4y^2-1$, og stien er punktene
der $h(x,y)=0$. Her er $\nabla f=(1,2)$ og $\nabla h=(2x,8y)$.

**Prøv selv.** Skriv opp de tre likningene og finn alle kandidatene. Hvilken gir størst
verdi?

**Regnegangen.**

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

:::

**Hva betyr det for Arild?** Likningene har to løsninger: en i nordøst med
høyde $\sqrt2\approx1.414$ og en i sørvest med høyde $-\sqrt2$. I sørvest peker
brattest oppover rett inn mot sjøen; der er det lavest. Stien er en lukket
kurve, så det finnes et høyeste punkt ([uke 8](uke8.qmd#uke8-kompakt)).
Normalen $\nabla h=(2x,8y)$ er aldri null på stien, så det høyeste punktet må
være en av de to løsningene: den i nordøst.

**Svaret til Arild:** Det høyeste punktet på stien er
$(1/\sqrt2,\,1/(2\sqrt2))\approx(0.707,\,0.354)$: omtrent 0.7 km øst og 0.35 km
nord for midten av sjøen, 141 meter over nullnivået. Hvordan han kan være
sikker i mer kronglete terreng, ser vi i 12.3.

::: {.callout-note title="Håndeksempel: den runde stien med Lagranges likninger"}

**Utgangspunkt.** Arild går på den runde stien, og terrenget er
$f(x,y)=x+2y$. Kravfunksjonen er $h(x,y)=x^2+y^2-1$, og stien er punktene der
$h(x,y)=0$. Maksimer $f$ på stien.

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

4. **Er kandidaten det høyeste punktet på hele stien?** Cauchy–Schwarz-ulikheten
   $|a\cdot b|\le\lVert a\rVert_2\lVert b\rVert_2$ gir for hvert tillatt $z$
   $$x+2y=(1,2)\cdot z\le\lVert(1,2)\rVert_2\,\lVert z\rVert_2=\sqrt5.$$
   Den første kandidaten oppnår grensen og er **globalt** maksimum.

**Dette tar vi med oss.**

- **Finn kandidaten:** Lagranges likninger ga oss det samme svaret som vinkelargumentet, uten at vi
  trengte å dra i appleten. På den runde stien ligger det høyeste punktet i
  retningen av bratteste stigning fra sjøens midte.
- **Avgjør om den er best:** Cauchy–Schwarz-ulikheten avgjorde dette. Den
  gjelder for hvert punkt på stien, så Arild trenger ikke gå hele stien.
- **Bruk samme triks på den avlange stien:** Med $w=2y$ blir kravet $x^2+w^2=1$, og
  $x+2y=(1,1)\cdot(x,w)\le\sqrt2$.

:::

::: {.reading-step title="Gå i dybden: kjerneregelen langs kurven, og flere krav"}

**Hvorfor normalene er parallelle.** La $p(t)$ være en glatt kurve langs
stien, altså $h(p(t))=0$, med $p(0)=z_*$. Kjerneregelen gir

$$0=\left.\frac{d}{dt}h(p(t))\right|_{t=0}=\nabla h(z_*)\cdot p'(0).$$

1. **Tangenten:** Enhver tangent $p'(0)$ står altså vinkelrett på
   $\nabla h$.
2. **Ekstremum langs kurven:** Hvis $f$ har et lokalt ekstremum langs kurven
   i $t=0$, gir samme regel $\nabla f(z_*)\cdot p'(0)=0$.
3. **Én normalretning:** Når $\nabla h(z_*)\ne0$, beskriver likningen lokalt
   en glatt kurve, og normalretningen i planet er én linje. Siden begge gradientene står
   vinkelrett på tangenten, må $\nabla f$ og $\nabla h$ være parallelle.

På sirkelen kan vi se dette direkte med $p(t)=(\cos t,\sin t)$:
$(f\circ p)'(t)=-\sin t+2\cos t=\nabla f(p(t))\cdot p'(t)$.

**Flere krav.** For kravfunksjoner $h_1,\ldots,h_m$ og krav
$h_1(z)=0,\ldots,h_m(z)=0$:

- **Samle normalene:** **Jacobimatrisen** $J_h$ har gradientene
  $\nabla h_i^T$ som rader.
- **Finn tangentene:** En tangent $v$ må oppfylle $J_h(z_*)v=0$:
  tangentretningene er **nullrommet** til $J_h$.
- **Kontroller regularitet:** Hvis radene er lineært uavhengige, er kravene
  regulære.

Hvert krav får sin multiplikator:

$$h_i(z_*)=0\quad(i=1,\ldots,m),\qquad
\nabla f(z_*)+\sum_{i=1}^m\lambda_i\nabla h_i(z_*)=0.$$

For eksempel gir kravene $x_1^2+x_2^2+x_3^2=1$ og $x_3=0$ i punktet $(1,0,0)$
normalene $(2,0,0)$ og $(0,0,1)$. Tangentene er $(0,t,0)$. I 12.4 møter vi flere
lineære krav, og i prosjektet ti krav samtidig.

:::

::: {.reading-step title="Gå i dybden: når normalen forsvinner"}

::: {#uke12-degenerert}
:::

Lagranges likninger forutsetter at $\nabla h\ne0$. Se på målfunksjonen $f(x,y)=x$
med kravfunksjonen $h(x,y)=x^2+y^2$ og kravet $h(x,y)=0$. Tenk deg en «sti» som
bare er ett punkt:

1. **Tillatt mengde:** To kvadrater summerer til null bare i $(0,0)$, så
   dette er det eneste tillatte punktet.
2. **Ekstremum:** Punktet er dermed både minimum og maksimum på den tillatte
   mengden.
3. **Normaltesten:** Likevel er $\nabla f(0,0)=(1,0)$ og
   $\nabla h(0,0)=(0,0)$, og

$$\nabla f+\lambda\nabla h=(1,0)\quad\text{uansett hvilken }\lambda\text{ vi velger.}$$

Kravet er **degenerert** i punktet: normaltesten finner ikke ekstremumet.

Vil du se det med tall? Cellen prøver tre ulike multiplikatorer i det eneste
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

Ekstremumet fant vi altså ved å se direkte på den tillatte mengden, ikke med Lagranges likninger.

**Øv på dette:** [et krav uten normal](#uke12-oppg-degenerert) i 12.6 (valgfri).

:::

### Et kort regneeksempel: punktet på veien som er nærmest hytta

Lagranges metode virker like godt for minimum. Vi forlater turen et øyeblikk.
Midt i sjøen, i origo, ligger en holme med en hytte, og en rett vei på land
følger linjen $x+y=2$. Hvor på veien er du nærmest hytta? Her er $f$ ikke en
høyde, men kvadratet av avstanden til hytta, og vi vil ha minimum i stedet for
maksimum.

::: {.callout-note title="Håndeksempel: nærmeste punkt på veien fra hytta på holmen"}

**Utgangspunkt.** Minimer $f(x,y)=x^2+y^2$, kvadratet av avstanden til hytta.
Kravfunksjonen er $h(x,y)=x+y-2$, og veien er punktene der $h(x,y)=0$.
Funksjonen $h$ er negativ på hyttas side av veien og positiv på den andre
siden.

**Prøv selv.** Sett opp Lagranges likninger og finn kandidaten og $\lambda$.

**Regnegangen.**

1. Likningene er $2x+\lambda=0$, $2y+\lambda=0$ og $x+y=2$.
2. De to første gir $x=y$. Kravet gir $(x,y)=(1,1)$, og da er $\lambda=-2$
   og $f(1,1)=2$.
3. **Kontroll av at det er minimum:** på linjen er $y=2-x$, og
   $f(x,2-x)=2+2(x-1)^2\ge2$, med likhet bare for $x=1$.

**Dette tar vi med oss.**

- **Veien:** Det nærmeste punktet er $(1,1)$. Avstanden til hytta er
  $\sqrt2\approx1.41$ km.
- **Kravet som system:** $Cz=d$ med $C=\begin{bmatrix}1&1\end{bmatrix}$ og
  $d=2$.
- **Korteste løsning:** Pseudoinversen fra den valgfrie delen
  [uke 7.7](uke7.qmd#uke7-pseudoinvers) gir det korteste $z$ som løser et
  underbestemt system: $C^+d=(1,1)$.
- **Samme svar:** Lagrange og pseudoinversen gir samme punkt. I «Gå i
  dybden» i 12.4 ser vi hvorfor.

:::

**Øv på dette:** [normal og tangent på ellipsen](#uke12-oppg-normal),
[en annen målfunksjon på ellipsen](#uke12-oppg-ellipse) og
[Lagrange på sirkelen](#uke12-oppg-sirkel) i 12.6.

### Hva gir den ytre runden?

::: {#uke12-pris}
:::

Arilds tredje spørsmål: Litt lenger fra sjøen går en ytre runde med samme
form. Hvor mye høyere kommer han hvis han tar den? Vi beskriver den ytre runden
med den samme kravfunksjonen: den er punktene der $h(x,y)=s$, der $s$ er et lite
positivt tall. For den avlange stien betyr det $x^2+4y^2=1+s$. Tallet $s$ er ikke
en avstand; det sier hvor mye større verdien av $h$ er på den ytre runden. Med
$s=0.1$ ligger den ytre runden omtrent 5 % lenger ut fra sjøens midte, ved det
høyeste punktet omtrent 40 meter.

::: {.callout-note title="Håndeksempel: hvor høyt kommer Arild på den ytre runden?"}

**Utgangspunkt.** Den indre stien er $x^2+4y^2=1$, og det høyeste punktet der er
$\bigl(\tfrac1{\sqrt2},\tfrac1{2\sqrt2}\bigr)\approx(0.707,\,0.354)$ med høyde
$\sqrt2\approx1.414$ (hundre meter). Den ytre runden med $s=0.1$ er punktene der
$x^2+4y^2=1.1$.

**Prøv selv.** Hvor mye større er den ytre runden enn den indre? Hvor ligger det
høyeste punktet på den, og hvor høyt er det?

**Regnegangen.**

1. **Den ytre runden er en forstørret kopi.** Gang begge koordinatene i et punkt
   $(x,y)$ på den indre stien med samme tall $k$. Da blir
   $(kx)^2+4(ky)^2=k^2(x^2+4y^2)=k^2$. Med $k=\sqrt{1.1}\approx1.0488$ blir dette
   $1.1$. Den ytre runden er altså den indre stien forstørret med faktoren $1.0488$
   ut fra sjøens midte, omtrent 5 % større.
2. **Høyden forstørres like mye.** Høyden er $f=x+2y$, så
   $f(kx,ky)=kx+2ky=k\,f(x,y)$. Går du $k$ ganger så langt ut fra midten i samme
   retning, blir høyden $k$ ganger så stor. Det gjelder hvert punkt, så det som var
   høyest på den indre stien, blir høyest på den ytre også.
3. **Det høyeste punktet flytter seg utover.** Det nye høyeste punktet er
   $1.0488\cdot(0.707,\,0.354)\approx(0.742,\,0.371)$.
4. **Den nye høyden:** $1.0488\cdot1.4142\approx1.4832$, mot $1.4142$ før. Arild
   kommer $0.069$ hundre meter høyere, omtrent 7 meter.
5. **Per enhet $s$:** $0.069/0.1=0.69$. Velger vi en enda mindre $s$, nærmer
   forholdet seg den deriverte av $f_*(s)=\sqrt2\,\sqrt{1+s}$ i $s=0$:
   $$\frac{d}{ds}\Bigl(\sqrt2\sqrt{1+s}\Bigr)_{s=0}=\frac{\sqrt2}{2\sqrt{1}}=\frac1{\sqrt2}\approx0.71.$$

:::

Tallet $0.71$ er akkurat $-\lambda$ fra 12.2, der vi fant $\lambda=-1/\sqrt2$. Det
er ikke tilfeldig, som den generelle regelen under viser.

**Generelt:** Flytter vi kravet fra $h(z)=0$ til $h(z)=s$, og løsningen
endrer seg glatt med $s$, er

$$\boxed{\frac{df_*}{ds}=-\lambda\quad\text{ved } s=0.}$$

Hvorfor regelen gjelder for alle glatte problemer, og kontroll med veien fra
hytta, viser «Gå i dybden» rett under.

Tallet $-\lambda$ sier hvor mye optimal verdi endres per enhet vi endrer
kravet, fra $h=0$ til $h=s$:

- **Koblingen til uke 11:** Det er samme idé som i
  [uke 11](uke11.qmd#uke11-sensitivitet): hva er én enhet mer av en ressurs
  verdt? Verkstedeieren spurte om en ekstra maskintime, Arild spør om en runde litt lenger ut.
- **Fortegnet:** I uke 11 var prisen selve endringen, et positivt tall. Her
  er prisen $-\lambda$, fordi vi skriver $L=f+\lambda h$.

**Svaret til Arild:** På en runde der $h=s$ i stedet for $h=0$, ligger det
høyeste punktet omtrent $-\lambda\cdot s$ høyere. På den avlange stien er
$-\lambda=1/\sqrt2\approx0.71$ hundre meter per enhet $s$. Med $s=0.1$ går den
ytre runden omtrent 40 meter lenger ut ved toppen, og han kommer omtrent 7 meter
høyere. Tallet $-\lambda$ er altså hva en runde litt lenger ut gir, målt i høyde.

**Dette tar vi med oss.**

- **Likningene:** $h=0$ og $\nabla f+\lambda\nabla h=0$ gir kandidater,
  både for maksimum og minimum.

**Øv på dette:** [boksen med minst overflate](#uke12-oppg-boks) i 12.6.

::: {.reading-step title="Gå i dybden: hvorfor prisformelen gjelder generelt"}

**Veien fra hytta.** I veieksempelet er $h=x+y-2$, så $h=s$ betyr $x+y=2+s$,
altså $r=2+s$. Vi ser på en parallell vei $x+y=r$ og bruker samme regning som i
håndeksempelet:

1. $2x+\lambda=0$ og $2y+\lambda=0$ gir $x=y$.
2. Kravet gir $x=y=r/2$.
3. Da er $\lambda=-2x=-r$.

Minste kvadrerte avstand og dens deriverte er

$$f_*(r)=\Bigl(\frac r2\Bigr)^2+\Bigl(\frac r2\Bigr)^2=\frac{r^2}{2},\qquad
\frac{df_*}{dr}=r=-\lambda.$$

Sammenhengen $df_*/dr=-\lambda$ gjelder for alle $r$, ikke bare for $r=2$, der vi
fant $\lambda=-2$. Går vi fra veien med $r=2$ til en parallell vei med $r=2.1$, vokser minste
kvadrerte avstand fra $2$ til $2.205$, altså med omtrent $2\cdot0.1$.

**Regelen i alle glatte problemer.** La $z(s)$ være løsningen når kravet er $h(z)=s$, og anta at den endrer seg
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

**Fortegnet til $\lambda$.** Sammenlign eksemplene:

| Ekstremum | Multiplikator |
|:--|:--|
| Maksimum på sirkelen | $\lambda=-\sqrt5/2$ |
| Minimum på linjen | $\lambda=-2$ |
| Minimum i avstandsproblemet i 12.5 | $\lambda=+0.618$ |

- **Ingen klassifisering:** Fortegnet skiller altså ikke maksimum fra
  minimum. For et likhetskrav betyr fortegnet ingenting alene.
- **Avhenger av skrivemåten:** Skriver vi kravet som $-h=0$ i stedet for
  $h=0$, er punktet det samme, men $\lambda$ bytter fortegn.
- **Mening gjennom prisen:** $-\lambda$ er endringen i optimal verdi når vi
  flytter kravet i den retningen $h$ er skrevet.

**Enheten og prosjektet.** Tallet $\lambda$ har enheten til $f$ delt på enheten
til $h$. I uke 11 var prisen i tusen kroner per maskintime; her er den i hundre
meter høyde per enhet $s$. I prosjektet er multiplikatorene krefter, og
«prisen» er energi per meter.

:::

::: {.reading-step title="Gå i dybden: en multiplikator gir en nedre grense"}

Lagrangefunksjonen kan også **bevise** en grense for optimal verdi, slik
dualprisene ga en øvre grense i uke 11. Vi bruker avstandsproblemet som vi
løser numerisk i 12.5, med en rund sti rundt den runde sjøen og en kafé i punktet $(2,1)$. La $a$ være vektoren
fra origo til kaféen. Minimer $F(z)=\tfrac12\lVert z-a\rVert_2^2$, halve
kvadratavstanden til kaféen.
Kravfunksjonen er $h(z)=\lVert z\rVert_2^2-1$, og stien er punktene der
$h(z)=0$ (enhetssirkelen).

- **På stien:** $h=0$, så $L(z,\lambda)=F(z)$ for alle tillatte $z$.
- **Grense for alle punkter:** Hvis $L(\cdot,\lambda)$ aldri går under et
  tall $\beta$ for **alle** $z$, er også $F(z)\ge\beta$ for alle tillatte
  $z$.

1. Velg $\lambda_*=(\sqrt5-1)/2$. Hessianen til $L$ med hensyn på $z$ er
   $(1+2\lambda_*)I=\sqrt5\,I$, som er SPD, så $L$ er en skål.
2. Bunnen av skålen finnes fra $\nabla_zL=(1+2\lambda_*)z-a=0$, altså
   $z_*=a/\sqrt5$.
3. Punktet $z_*$ ligger på sirkelen, og
   $F(z_*)=\tfrac12\lVert a/\sqrt5-a\rVert_2^2=\tfrac12\cdot5\,(1-1/\sqrt5)^2=\tfrac12(\sqrt5-1)^2$.
   Da er
   $$F(z)=L(z,\lambda_*)\ge L(z_*,\lambda_*)=F(z_*)=\tfrac12(\sqrt5-1)^2$$
   for alle tillatte $z$, og grensen er skarp.

Generelt er $\varphi(\lambda)=\inf_zL(z,\lambda)$ en nedre grense for minste
verdi over de tillatte punktene, for hver $\lambda$. I eksempelet ligger bunnen av
skålen i $z(\lambda)=a/(1+2\lambda)$ når $1+2\lambda>0$, og innsatt er
$$\varphi(\lambda)=L(z(\lambda),\lambda)=\frac{5\lambda}{1+2\lambda}-\lambda
=\tfrac52-\lambda-\frac5{2(1+2\lambda)}.$$
En slik skarp grense er ikke garantert for alle problemer.

**Øv på dette:** [en nedre grense fra Lagrangefunksjonen](#uke12-oppg-grense) i 12.6 (valgfri).

:::

## 12.3 Kandidater er ikke løsninger

::: {#uke12-kandidater}
:::

Hittil var terrenget en jevn skråning, og stien var flat på bare to steder: det
høyeste og det laveste punktet. Nå går Arild i et kupert område med høyden
$f(x,y)=xy$ (fortsatt i hundre meter). Det er lavt i nordvest og sørøst, høyt i
nordøst og sørvest, og null langs aksene gjennom midten av sjøen. En slik form
kalles en sadel, som et fjellpass: terrenget stiger mot nordøst og sørvest,
synker mot nordvest og sørøst, og er flatt midt i. Stien er nå rund, rundt en
rund sjø, med kravfunksjonen $h(x,y)=x^2+y^2-1$ og stien $x^2+y^2=1$.

Går han en runde, går stien opp og ned flere ganger. Hvor mange steder er den
flat, og er de like høye? Poenget er at **«stien er flat her» ikke betyr «her
er det høyest»**.

Stien er en lukket sløyfe, så ekstremalverdisetningen fra
[uke 8.2](uke8.qmd#uke8-kompakt) lover et høyeste og et laveste punkt. Hvor
ligger de? Vi lar først datamaskinen gå hele runden i tusen små skritt. Regningen
bak er:

1. **Punkt på stien:** $(x,y)=(\cos t,\sin t)$.
2. **Tangent:** $(-y,x)$, vinkelrett på radien.
3. **Stigning langs stien:**
   $\nabla f\cdot(-y,x)=(y,x)\cdot(-y,x)=x^2-y^2$. Den kan vi regne ut i
   mange punkter samtidig.

Målet er å finne alle stedene der stigningen er null, og se om de er like høye.

### Eksperiment 2 – hvor er stigningen langs stien null?

- Kjør cellen. Hvor mange punkter har stigning null, og hvilke verdier
  har $f$ der?
- Finn de samme punktene i figuren. Hvilke er topper, og hvilke er bunner?
- Bytt til målfunksjonen $x+2y$ fra håndeksempelet: `values = x + 2*y` og
  `slope = -y + 2*x`. Hvor mange punkter får du nå?

Cellen regner ut høyden $f$ og stigningen langs stien i tusen punkter på
sirkelen, og skriver ut punktene der stigningen skifter fortegn. En ferdig
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

**Hva viser forsøket?** Fire punkter, omtrent $(\pm0.707,\pm0.707)$, har
stigning null:

| Antall | Verdi | Form i figuren |
|:--|:--|:--|
| To punkter | $f=1/2$ | Topper |
| To punkter | $f=-1/2$ | Bunner |

På turen går stien altså opp til en topp på $0.5$ (50 meter), ned i en dal på
$-0.5$, og så en gang til. Stigning null finner de flate stedene, men sier ikke
om stedet er en topp eller en dal. Lagranges likninger skal vise at det ikke
finnes flere kandidater, og gi de eksakte punktene.
Med $\nabla f=(y,x)$ og $\nabla h=(2x,2y)$ får vi

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

**Klassifiser globalt.** Hvordan kan Arild vite at $1/2$ er høyest på hele
runden, uten å måle alle stedene?

1. $(x-y)^2\ge0$ gir $2xy\le x^2+y^2=1$.
2. $(x+y)^2\ge0$ gir $2xy\ge-1$.
3. Dermed er $-1/2\le xy\le1/2$ på hele sirkelen. De to kandidatene med
   verdi $1/2$ er globale maksimumspunkter, og de to andre er globale
   minimumspunkter.

**Svaret til Arild:** Han trenger ikke gå hele stien. Han gjør tre ting:

1. Finn alle flate steder med Lagranges likninger.
2. Bruk at et høyeste punkt finnes (lukket sti) og må være blant dem.
3. Sammenlign høydene, eller bruk en ulikhet som gjelder alle punkter på
   stien. Her gjelder ulikhetene for hvert punkt, så ikke noe sted på stien er
   høyere enn 50 meter.

**Dette tar vi med oss.** Lagranges likninger gir en liste med kandidater, og
sammenligningen av verdiene er nok fordi to ting gjelder her:

- **Eksistens:** Kompaktheten garanterer at maksimum og minimum **finnes**.
- **Fullstendig kandidatliste:** $\nabla h=2z\ne0$ i **alle** punkter på
  sirkelen, så alle punktene er regulære, og derfor må maksimum og minimum stå i listen. Uten regularitet kan et
  optimum mangle i listen (se «Gå i dybden: når normalen forsvinner» i 12.2).

**Øv på dette:** [en kvadratisk form på sirkelen](#uke12-oppg-form) i 12.6.

::: {.reading-step title="Gå i dybden: andrederivert langs kurven"}

Vil vi vite om et flatt sted er en topp eller en dal uten å sammenligne alle
høydene, kan vi se på hvordan målfunksjonen bøyer seg langs stien. Vi følger sirkelen
med $p(t)=(\cos t,\sin t)$. Da er $f(p(t))=\tfrac12\sin2t$.

| Vinkel | Andrederivert | Tolkning langs sirkelen |
|:--|:--|:--|
| $t=\pi/4$ | $-2$ | Grafen bøyer nedover: lokalt maksimum. |
| $t=-\pi/4$ | $+2$ | Lokalt minimum. |

Generelt, for en tillatt kurve $\gamma(t)$ gjennom et regulært stasjonært
punkt med tangent $v=\gamma'(0)$:

1. Derivér kravet $h(\gamma(t))=0$ to ganger:
   $v^T\nabla^2h\,v+\nabla h\cdot\gamma''(0)=0$.
2. Den andrederiverte av målfunksjonen langs kurven er
   $v^T\nabla^2f\,v+\nabla f\cdot\gamma''(0)$, og $\nabla f=-\lambda\nabla h$.
3. Fjern leddet med $\gamma''(0)$ ved hjelp av steg 1:
   $$(f\circ\gamma)''(0)=v^T\nabla^2_{zz}L(z_*,\lambda)\,v.$$

Kurven selv bøyer seg, så det er Hessianen til $L$, ikke til $f$, som teller
langs tangentene:

- **Positiv form for alle tangenter $v\ne0$:** Strengt lokalt minimum.
- **Negativ form for alle tangenter $v\ne0$:** Strengt lokalt maksimum.
- **Null i en retning:** Avgjør ikke saken.

For $f=xy$ er
$\nabla^2_{zz}L=\left(\begin{smallmatrix}2\lambda&1\\1&2\lambda\end{smallmatrix}\right)$.
Med $\lambda=-1/2$ og $v=(-1,1)/\sqrt2$ gir formen $-2$, som over.

:::

## 12.4 Lagrange møter lineær algebra

::: {#uke12-egenverdi}
:::

Dette avsnittet er mest lineær algebra, men det handler om de samme turene:

- **Sadelterrenget på den runde stien** fra 12.3: det høyeste og det laveste
  punktet viser seg å ligge i retningen til egenvektorer til en matrise.
- **Rette veier** i stedet for en krum sti: Lagranges likninger blir et lineært
  likningssett.

Resten av 12.4 er den samme ideen skrevet med matriser.

### Kandidattabellen er en egenverditabell

I 12.3 fant vi de flate stedene på den runde stien i det kuperte terrenget
$f(x,y)=xy$ ved å regne for hånd. Nå ser vi at regningen er en egenverdiregning,
som du kjenner fra uke 5. Da kan vi bruke den samme regningen for alle terreng av
denne typen.

**Steg 1: skriv høyden med en matrise.** Vi samler koordinatene til et punkt i en
kolonnevektor,
$$z=\begin{bmatrix}x\\y\end{bmatrix},$$
altså vektoren fra sjøens midte til punktet $(x,y)$. Med den symmetriske matrisen
$$A=\begin{bmatrix}0&\tfrac12\\\tfrac12&0\end{bmatrix}$$
er
$$Az=\begin{bmatrix}\tfrac12y\\\tfrac12x\end{bmatrix},\qquad
z^TAz=x\cdot\tfrac12y+y\cdot\tfrac12x=xy.$$
Høyden er altså $f=z^TAz$.

**Steg 2: gradienten.** Gradienten til $f=xy$ er
$\nabla f=\bigl(\partial f/\partial x,\ \partial f/\partial y\bigr)=(y,x)$. Sammenlign
med $Az$ over: $(y,x)$ er nøyaktig $2Az$. Altså er
$$\nabla f=2Az.$$
Det gjelder for hver symmetrisk matrise $A$, ikke bare vår; utregningen står i
«Gå i dybden» under.

**Steg 3: Lagranges likning.** For den runde stien er kravfunksjonen
$h(x,y)=x^2+y^2-1$, så $\nabla h=(2x,2y)=2z$. Lagranges likning
$\nabla f+\lambda\nabla h=0$ blir
$$2Az+2\lambda z=0\qquad\Longleftrightarrow\qquad Az=-\lambda z.$$

**Steg 4: les likningen.** $Az=-\lambda z$ sier at $A$ ganget med $z$ gir et tall
ganger den samme vektoren. Det er definisjonen av en egenvektor fra uke 5. En
kandidat på stien ligger derfor i retningen til en egenvektor av $A$, og tallet
$-\lambda$ er den tilhørende egenverdien.

**Steg 5: høyden i en kandidat.** På stien er $z^Tz=x^2+y^2=1$, så
$$f=z^TAz=z^T(-\lambda z)=-\lambda\,z^Tz=-\lambda.$$
Høyden i en kandidat er altså egenverdien.

**For vår matrise.** Egenverdiene til $A$ er $\tfrac12$, med egenvektor $(1,1)$, og
$-\tfrac12$, med egenvektor $(1,-1)$. Det er akkurat tabellen i 12.3: punktene i
retningen $(1,1)$ har høyden $\tfrac12$ (de høyeste), og punktene i retningen
$(1,-1)$ har høyden $-\tfrac12$ (de laveste).

**Hva betyr det for Arild?** På en rund sti i et terreng av typen $z^TAz$ trenger
han ikke lete langs hele stien. Han finner egenvektorene til $A$: de høyeste
stedene ligger i retningen til egenvektoren med størst egenverdi, de laveste i
retningen til den med minst, og høydene er selve egenverdiene.

::: {.reading-step title="Gå i dybden: gradienten til en kvadratisk form"}

Skriv en symmetrisk $2\times2$-matrise som
$A=\begin{bmatrix}a&b\\b&c\end{bmatrix}$. Da er
$z^TAz=ax^2+2bxy+cy^2$, og de partielle deriverte er $2ax+2by$ og $2bx+2cy$.
Det er de to komponentene i $2Az$, så $\nabla(z^TAz)=2Az$. Det samme gjelder
i alle dimensjoner. For vår matrise er $a=c=0$ og $b=\tfrac12$, og vi får
$(y,x)$ som over.

:::

**Koblingen til uke 5.** På enhetssirkelen er $z^TAz$ Rayleigh-kvotienten fra
[uke 5](uke5.qmd#uke5-rayleigh), og vi har vist:

> **Største og minste verdi av $z^TAz$ når $\lVert z\rVert_2=1$ er største og
> minste egenverdi av $A$.**

Begrunnelsen er den samme som i 12.3: sirkelen er en lukket og begrenset kurve, så det
finnes et høyeste og et laveste punkt ([uke 8](uke8.qmd#uke8-kompakt)). Normalen $\nabla h=2z$
er aldri null på sirkelen, så de punktene er blant kandidatene, altså blant punktene som
ligger i retningen til egenvektorene.

Vi har vist med likninger at kandidatene ligger i retningen til egenvektorer. Forsøket
viser det samme i et bilde, og lar deg prøve andre matriser. Målet er å se at
nivåkurvene (høydekurvene) berører sirkelen i akkurat de punktene, slik nivålinjen
berørte stien i 12.1.

### Eksperiment 3 – se egenvektorene på sirkelen

- Kjør cellen. Hvilke nivåkurver berører sirkelen, og hvor?
- Bytt siste linje til `plot_quadratic_on_circle(B.T @ B)`, der $B$ er
  strekkmatrisen fra uke 7 (se under). Hvor ligger nå punktet med størst
  strekk?
- Bytt matrisen `A` i cellen med en egen symmetrisk matrise, for eksempel
  `[[2, 1], [1, 2]]`, og forutsi berøringspunktene før du kjører.

Cellen gir oss både tallene og bildet:

- **Tallene:** `np.linalg.eigh` regner ut egenverdiene og egenvektorene. Den
  er som `eigvalsh` fra uke 8, men gir også egenvektorene.
- **Figuren:** En ferdig hjelpefunksjon, `plot_quadratic_on_circle(A)`,
  tegner nivåkurvene til $z^TAz$, enhetssirkelen og egenvektorene.
- **Matrisen $B$:** I [uke 7](uke7.qmd#uke7-geometri) sendte $B$
  enhetssirkelen til en ellipse, og vi spurte hvilken retning som strekkes
  mest. Strekket i retningen til en enhetsvektor $z$ er lengden av $Bz$.
  Kvadratet av lengden er
  et uttrykk av samme type som høyden, $\lVert Bz\rVert_2^2=z^T(B^TB)z$.
  Største strekk er derfor samme spørsmål som Arilds: hvor på sirkelen er
  uttrykket størst? Regningen står i «Gå i dybden» rett etter forsøket.

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

**Hva viser forsøket?**

- **For $A$:** `eigh` gir egenverdiene $-0.5$ og $0.5$. Nivåkurvene
  $xy=\pm\tfrac12$ berører enhetssirkelen i de fire punktene
  $\pm\tfrac1{\sqrt2}(1,1)$ og $\pm\tfrac1{\sqrt2}(1,-1)$. De ligger i
  retningen til egenvektorene $(1,1)$ og $(1,-1)$, én lengdeenhet fra origo,
  og høyden der er egenverdien, som i steg 5: $f=\tfrac12$ i
  $\pm\tfrac1{\sqrt2}(1,1)$ og $f=-\tfrac12$ i $\pm\tfrac1{\sqrt2}(1,-1)$.
- **For $B^TB$:** `eigh` gir egenverdiene $1$ og $4$. Nivåkurvene er ellipsene
  $x^2+4y^2=c$. Ellipsen med $c=4$ berører enhetssirkelen i punktene
  $(0,\pm1)$, som ligger i retningen til egenvektoren $(0,1)$ med egenverdi $4$.
- **Strekket:** Største strekk er $\sqrt4=2$, og `svd` gir
  singulærverdiene $2$ og $1$ (se «Gå i dybden» under).

**Hva betyr det for Arild?** Bildet er det samme som i 12.1: de høyeste og de
laveste stedene er der en høydekurve berører stien. I sadelterrenget ligger
toppene i nordøst og sørvest, 50 meter over nullnivået, og dalene i nordvest og
sørøst, 50 meter under.

**Øv på dette:** [største strekk med Lagrange](#uke12-oppg-strekk) i 12.6.

::: {.reading-step title="Gå i dybden: største strekk fra uke 7 med Lagrange"}

Samme regning svarer på et spørsmål fra uke 7, som ikke handler om turen. I [uke 7](uke7.qmd#uke7-geometri) sendte matrisen
$B=\begin{bmatrix}0&2\\1&0\end{bmatrix}$ (der het den $A$) enhetssirkelen til en
ellipse, og største strekk var $\sigma_1=2$. Nå kan vi utlede det:

1. **Skriv kvadrert strekk:** Her er $Bz=(2y,\,x)$, så
   $\lVert Bz\rVert_2^2=x^2+4y^2=z^T(B^TB)z$ med
   $B^TB=\operatorname{diag}(1,4)$. Det er samme type problem, og uttrykket
   er det samme som for ellipsen i 12.1.
2. **Bruk egenverdiene:** Etter resultatet i 12.4 er den største verdien av
   $z^T(B^TB)z$ på enhetssirkelen den største egenverdien til $B^TB$, altså
   $4$, i retningen til egenvektoren $(0,1)$.
3. **Kontroller uten matriser:** På sirkelen er $x^2=1-y^2$, så
   $x^2+4y^2=1+3y^2\le4$, med likhet i punktene $(0,\pm1)$.
4. **Ta kvadratroten:** Største strekk er $\sqrt4=2$.

:::

### Lineære krav gir et lineært likningssett

::: {#uke12-kkt}
:::

Nå bytter vi den krumme stien mot en rett vei, slik som veien fra hytta på
holmen i 12.2. Da blir to ting enklere:

- **Normalen er den samme overalt.** For veien $x+y=2$ er kravfunksjonen
  $h(x,y)=x+y-2$, og normalen $\nabla h=(1,1)$ er den samme i hvert punkt.
- **Likningene blir lineære.** Er målfunksjonen kvadratisk, som $f=x^2+y^2$,
  er gradienten $\nabla f=(2x,2y)$ lineær. Da har Lagranges likninger ingen
  kvadrater og ingen produkter av ukjente.

**Med tall.** For veien fra hytta fant vi i 12.2 likningene
$$2x+\lambda=0,\qquad 2y+\lambda=0,\qquad x+y=2.$$
De to første er $\nabla f+\lambda\nabla h=0$, komponent for komponent, og den
siste er kravet. Det er et lineært likningssett med tre ukjente, $x$, $y$ og
$\lambda$. Med tallene foran de ukjente som rader i en matrise $K$ blir det

$$\underbrace{\begin{bmatrix}2&0&1\\0&2&1\\1&1&0\end{bmatrix}}_{K}
\begin{bmatrix}x\\y\\\lambda\end{bmatrix}
=\begin{bmatrix}0\\0\\2\end{bmatrix}.$$

Første rad er $2x+0\cdot y+1\cdot\lambda=0$. Et slikt likningssett, der de
ukjente er både punktet og multiplikatoren, kalles et **KKT-system** (etter
Karush, Kuhn og Tucker). Med flere rette krav får hvert krav sin egen
multiplikator og sin egen rad, men formen er den samme. Matriseformen, med
nullrommet fra [uke 3](uke3.qmd#uke3-del3), står i «Gå i dybden» under
eksperimentet.

Matrisen $K$ er symmetrisk, akkurat som matrisene vi løste med CG i
[uke 6](uke6.qmd#uke6-cg) og Cholesky i [uke 10](uke10.qmd#uke10-cholesky).
Men begge metodene krevde mer: matrisen måtte være SPD. Målet med forsøket er å
finne ut om metodene fra uke 6 og 10 kan brukes på et KKT-system.

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
    print('Cholesky feilet: K er ikke positiv definitt')
```

**Hva viser forsøket?**

- **Løsningen:** $(1,1,-2)$, som for hånd i 12.2.
- **Matrisen:** Egenverdiene er $-0.73$, $2$ og $2.73$. Matrisen er
  symmetrisk, men **indefinitt**: den har både positive og negative
  egenverdier, som Hessianen i et sadelpunkt i [uke 8](uke8.qmd#uke8-hessian).
  Cholesky feiler.
- **Hvorfor det skjer:** Kravet $x+y=2$ inneholder ikke $\lambda$, så tallet
  nederst til høyre i $K$ er $0$. Det er nok til at $K$ ikke kan være SPD. En
  SPD-matrise gir $v^TKv>0$ for hver vektor $v\ne0$
  ([uke 6](uke6.qmd#uke6-energi)). Velg $v=(0,0,1)$: ingen flytting, bare
  multiplikatoren. Da plukker $v^TKv$ ut nettopp tallet nederst til høyre, og
  det er $0$. Slik er det i hvert KKT-system (se «Gå i dybden» under), så CG og
  Cholesky kan ikke brukes direkte.

**Dette tar vi med oss.** Når målfunksjonen er kvadratisk, blir Lagranges likninger
lineær algebra:

| Krav | Hva likningene blir |
|:--|:--|
| Sirkelkrav (rund sti) | Egenverdiproblem, der kandidatene ligger i retningen til egenvektorene. |
| Lineære krav (rette veier) | Symmetrisk, men indefinitt likningssett: CG og Cholesky virker ikke direkte. |

Nullromsmetoden i «Gå i dybden» viser én vei rundt.

**Øv på dette:** [KKT-systemet for en linje](#uke12-oppg-kkt) i 12.6 og
[KKT-systemet og pseudoinversen](#uke12-py-kkt) i 12.7.

::: {.reading-step title="Gå i dybden: nullrommet, og hvordan vi kan omgå det indefinitte systemet"}

**Flere lineære krav.** Med flere rette krav skriver vi dem som $Cz=d$, med én
rad i $C$ per krav; for veien fra hytta er $C=\begin{bmatrix}1&1\end{bmatrix}$ og
$d=2$, som i 12.2. Hvert krav får sin multiplikator, og vi samler dem i en
vektor $\lambda$. Lagranges likning blir
$$\nabla f(z)+C^T\lambda=0.$$
Med ett krav er $C^T\lambda=\lambda\,(1,1)=\lambda\nabla h$, altså samme likning
som før. Med flere krav sier den at $\nabla f$ er en lineærkombinasjon av
normalene, altså av radene i $C$.

**Hvorfor $\nabla f+C^T\lambda=0$ er riktig betingelse.** Ideen er den samme
som på stien: i et beste punkt endrer ikke målfunksjonen seg i første lille
skritt i noen retning vi har lov til å gå.

1. **Tillatte retninger:** En retning $v$ endrer ikke $Cz$ når $Cv=0$. De
   tillatte retningene er altså nullrommet til $C$. For veien fra hytta gir
   retningen $v=(1,-1)$ langs veien $Cv=1-1=0$.
2. **Vinkelrett på radene:** At $Cv=0$ betyr at $v$ står vinkelrett på hver
   rad i $C$.
3. **Gradienten balanseres av normalene:** Likningen sier at
   $\nabla f=-C^T\lambda$ er en lineærkombinasjon av radene. Da står også
   $\nabla f$ vinkelrett på alle tillatte retninger:
   $\nabla f\cdot v=-\lambda^TCv=0$.

For veien fra hytta er $\nabla f(1,1)=(2,2)$ og $\nabla f\cdot(1,-1)=2-2=0$.
Målfunksjonen endres altså ikke til første orden i noen tillatt retning.

**Nullromsmetoden.** Ideen er å skrive de tillatte punktene slik at kravet alltid er oppfylt. Ethvert tillatt punkt kan skrives $z=z_0+tZ$:

- $z_0=(2,0)$ er én løsning av kravet.
- $Z=(1,-1)$ spenner ut nullrommet til $C=\begin{bmatrix}1&1\end{bmatrix}$.

Da er kravet oppfylt for alle $t$, og vi minimerer uten krav:

$$f(z_0+tZ)=(2+t)^2+t^2=4+4t+2t^2,\qquad
\frac{d}{dt}=4+4t=0\ \Rightarrow\ t=-1,\ z=(1,1).$$

Det reduserte problemet har én variabel og positiv krumning. Cellen setter
inn $t=-1$, kontrollerer at punktet oppfyller kravet, og tegner bildet med en
ferdig hjelpefunksjon.

- **Punkter og retning:** Du ser $z_0$, nullromsretningen $Z$ og løsningen,
  der $\nabla f=(2,2)$ er parallell med raden $(1,1)$ i $C$.
- **Prikket sirkelbue:** Nivåkurven $f=2$, som berører linjen akkurat der.

```{pyodide-python}
#| label: week12-nullspace
# Nullromsmetoden: z = z0 + t*Z, med C z0 = d og C Z = 0. Regningen over ga t = -1.
z0, Z = np.array([2., 0]), np.array([1., -1])
z_best = z0 + (-1)*Z
print('z =', z_best, '  C z =', z_best.sum(), '  grad f =', 2*z_best)
plot_nullspace_method(z0, Z, z_best, 2*z_best)
```

**Nullromsmetoden generelt.**

1. **Parametriser:** Bruk $z=z_0+Zt$, der kolonnene i $Z$ er en basis for
   nullrommet og $t$ er en vektor med like mange tall som kolonner i $Z$.
2. **Sett inn i målfunksjonen:** Skriv en kvadratisk målfunksjon som
   $f=\tfrac12z^TQz-b^Tz$, med en symmetrisk matrise $Q$ og en vektor $b$, som
   energifunksjonen i [uke 6](uke6.qmd#uke6-energi). For veien fra hytta er
   $Q=2I$ og $b=0$. Da gir utvidelsen av
   $\tfrac12(z_0+Zt)^TQ(z_0+Zt)-b^T(z_0+Zt)$
   $$f(z_0+Zt)=\tfrac12t^T(Z^TQZ)t+t^TZ^T(Qz_0-b)+f(z_0),$$
   som vi minimerer uten krav.
3. **Velg løser:** Matrisen $Z^TQZ$ er SPD når $Q$ er positiv definitt på
   nullrommet, og da virker både Cholesky og CG igjen.

:::

::: {.reading-step title="Gå i dybden: det generelle KKT-systemet og pseudoinversen"}

For $f(z)=\tfrac12z^TQz-b^Tz$ med symmetrisk $Q$ og krav $Cz=d$ er
$\nabla f=Qz-b$, og Lagranges likninger blir

$$\begin{bmatrix}Q&C^T\\C&0\end{bmatrix}
\begin{bmatrix}z\\\lambda\end{bmatrix}=\begin{bmatrix}b\\d\end{bmatrix}.$$

For veien fra hytta er $Q=2I$, $b=0$, $C=\begin{bmatrix}1&1\end{bmatrix}$ og
$d=2$, og blokkmatrisen er nøyaktig $K$ fra eksperiment 4.

- **Invertibel:** Hvis $C$ har $m$ uavhengige rader og $Q$ er positiv
  definitt på nullrommet til $C$, er matrisen invertibel.
- **Aldri positiv definitt:** Kall blokkmatrisen $K$. For en vektor $v=(0,w)$
  med null i $z$-delen og $w\ne0$ er $v^TKv=0$, fordi blokken nederst til høyre
  er null.
- **Negative egenverdier:** Under disse forutsetningene kan man vise at matrisen har
  nøyaktig $m$ negative egenverdier; i eksperiment 4 var $m=1$.

**Minste norm.** Med $Q=I$ og $b=0$ minimerer vi $\tfrac12\lVert z\rVert_2^2$
under $Cz=d$:

1. Første blokkrad gir $z=-C^T\lambda$.
2. Andre blokkrad gir $-CC^T\lambda=d$.

Dermed er

$$z=C^T(CC^T)^{-1}d,$$

som er pseudoinversløsningen $C^+d$ fra [uke 7.7](uke7.qmd#uke7-pseudoinvers)
når radene i $C$ er uavhengige. Kodeoppgaven
[KKT-systemet og pseudoinversen](#uke12-py-kkt) i 12.7 kontrollerer dette.

:::

## 12.5 Finn et punkt numerisk og kontroller det

::: {#uke12-slsqp}
:::

Arild går nå rundt en annen sjø, på en rund sti med radius 1 km. Kaféen ligger i
punktet $(2,1)$, utenfor stien. Han vil til stedet på stien som er nærmest
kaféen, og spør en kartapp. Appen er løseren `minimize` med metoden `SLSQP`,
som tar imot likhetskrav. Den foreslår et punkt. Kan han stole på det?

Dette er ikke en høydeoppgave: vi vil ha minst mulig avstand til kaféen. Som i
12.4 er $z=(x,y)$ vektoren fra sjøens midte til stedet der Arild står, og
$a=(2,1)$ er vektoren fra sjøens midte til kaféen. Da er $z-a$ vektoren fra
kaféen til stedet, og lengden $\lVert z-a\rVert_2$ er avstanden. I $(0.8,\,0.6)$
er $z-a=(-1.2,\,-0.4)$ og avstanden $\sqrt{1.6}\approx1.26$ km. Vi minimerer
halve kvadratet av avstanden, $F$ i tabellen: det nærmeste stedet blir det
samme, og gradienten blir enkel, $\nabla F=z-a$, rett bort fra kaféen.

| Rolle | Uttrykk |
|:--|:--|
| Valg | $z=(x,y)$, stedet på kartet |
| Målfunksjon | Minimer $F(z)=\tfrac12\lVert z-a\rVert_2^2$, med $\nabla F(z)=z-a$ |
| Kravfunksjon | $h(z)=\lVert z\rVert_2^2-1$, med $\nabla h(z)=2z$, rett ut fra sjøens midte |
| Krav | $h(z)=0$: punktet ligger på stien, altså enhetssirkelen |

For større problemer, som kjettingen i [prosjekt 12](project_week12.qmd) med ti
krav, løser vi ikke Lagranges likninger for hånd. Løseren gir en **numerisk
kandidat**. At den melder at den stoppet normalt, erstatter ikke to kontroller
Arild må gjøre selv. Begge skal gi et tall nær null:

- **Ligger punktet på stien?** Det måler **betingelsesfeilen** $|h(z)|$ (i
  prosjektet: **kravbruddet**). Den er null på stien og større jo lenger unna
  punktet ligger. Punktet $(0.9,\,0.45)$ ligger litt utenfor:
  $h=0.81+0.2025-1=0.0125$.
- **Er stien flat der?** I det nærmeste punktet endrer ikke avstanden seg i
  første lille skritt langs stien, slik høyden i det høyeste punktet i 12.1.
  Da er $\nabla F$ parallell med normalen, og et tall $\lambda$ gir
  $\nabla F+\lambda\nabla h=0$. I et numerisk punkt blir det litt igjen.
  Lengden av resten er **stasjonaritetsfeilen**
  $\lVert\nabla F(z)+\lambda\nabla h(z)\rVert_2$.

Løseren gir oss bare punktet, så vi **velger den $\lambda$ som gjør
stasjonaritetsfeilen minst**. Det er projeksjonen fra
[uke 4](uke4.qmd#uke4-projeksjon): $\lambda\nabla h$ blir den delen av
$-\nabla F$ som peker langs normalen, og resten peker langs stien.

::: {.callout-note title="Håndeksempel: kontroller punktet (0.8, 0.6)"}

**Utgangspunkt.** Kartappen foreslår $z=(0.8,\,0.6)$. Er det nærmest kaféen?

**Prøv selv.** Regn ut begge kontrollfeilene.

**Regnegangen.**

1. **På stien?** $h(z)=0.64+0.36-1=0$, så betingelsesfeilen er $0$.
2. **Gradientene:** $\nabla F=z-a=(-1.2,\,-0.4)$ og
   $\nabla h=2z=(1.6,\,1.2)$.
3. **Beste $\lambda$:** Normalen med lengde 1 er $n=(0.8,\,0.6)$. Komponenten
   av $-\nabla F=(1.2,\,0.4)$ langs $n$ er $1.2\cdot0.8+0.4\cdot0.6=1.2$, og
   $1.2\,n=(0.96,\,0.72)=0.6\,\nabla h$. Altså er $\lambda=0.6$.
4. **Stasjonaritetsfeilen:** $\nabla F+0.6\,\nabla h=(-0.24,\,0.32)$, med
   lengde $0.4$.
5. **Les svaret:** Resten $(-0.24,\,0.32)=0.4\,(-0.6,\,0.8)$ peker langs
   stien: går Arild mot nordvest, øker avstanden, og går han andre veien, mot
   kaféen, minker den. Stien er ikke flat her, og punktet er ikke det nærmeste.

:::

**Generelt** er den beste multiplikatoren
$$\lambda=-\frac{\nabla F\cdot\nabla h}{\lVert\nabla h\rVert_2^2},$$
et minste kvadraters problem med én ukjent som i [uke 4](uke4.qmd#uke4-mk). Med
flere krav, som i kjettingen, samles normalene som rader i
**Jacobimatrisen** $J$ fra [prosjekt 10](project_week10.qmd), og
`np.linalg.lstsq` finner alle multiplikatorene (se «Gå i dybden» under).

Hvorfor vi ikke bruker SciPys egne multiplikatorer, står i
[SciPy-oppslaget](#uke12-scipy).

::: {.reading-step title="Gå i dybden: formelen for multiplikatoren med minst feil"}

Kvadratet av stasjonaritetsfeilen er et andregradspolynom i $\lambda$:

$$\lVert\nabla F+\lambda\nabla h\rVert_2^2=\nabla F\cdot\nabla F
+2\lambda\,\nabla F\cdot\nabla h+\lambda^2\,\nabla h\cdot\nabla h.$$

1. **Derivér med hensyn på $\lambda$:** Den deriverte er
   $2\,\nabla F\cdot\nabla h+2\lambda\,\nabla h\cdot\nabla h$.
2. **Sett lik null:** Den er null for
   $\lambda=-\nabla F\cdot\nabla h/\lVert\nabla h\rVert_2^2$.
3. **Kontroller minimum:** Den andrederiverte, $2\lVert\nabla h\rVert_2^2$,
   er positiv når kravet er regulært, så dette er minimum.

**Flere krav.** Hvert krav $h_i$ har sin normal $\nabla h_i$ og sin
multiplikator $\lambda_i$:

1. **Samle normalene:** $\nabla h_i^T$ blir rader i **Jacobimatrisen** $J$.
2. **Løs minste kvadrater:** Velg $\lambda$ slik at
   $\lVert\nabla F+J^T\lambda\rVert_2$ blir minst mulig, med
   `np.linalg.lstsq(J.T, -grad, rcond=None)[0]` som i
   [SciPy-oppslaget](#uke12-scipy).

:::

Nå prøver vi alt dette på kartappen. Målet er å se hva
kontrollfeilene sier, og hva de ikke sier.

### Eksperiment 5 – finn og kontroller et sirkelpunkt

- Kjør cellen, og sammenlign punktet med $a/\lVert a\rVert_2$: stedet på
  stien som ligger rett mot kaféen fra sjøens midte.
- Bytt startpunktet til `np.array([-.9, -.45])`. Det ligger på linjen gjennom
  sjøens midte og kaféen, på motsatt side av kaféen. Hva rapporterer løseren
  nå, og hvilke av tallene avslører at punktet ikke er det nærmeste?
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

**Hva viser forsøket?** Sammenlign to startpunkter:

| Startpunkt | Funnet sirkelpunkt | $F$ og $\lambda$ |
|:--|:--|:--|
| $(0.4,0.9)$ | $z\approx(0.89442719,\,0.44721360)$ | $F\approx0.76393202$, $\lambda\approx0.618034$ |
| $(-0.9,-0.45)$ | $z\approx(-0.894,-0.447)=-a/\lVert a\rVert_2$ | $F\approx5.236$, $\lambda\approx-1.618$ |

Punktet fra det første startpunktet stemmer med $a/\lVert a\rVert_2$.

- **Samme kontrollresultat:** Begge ganger er kontrollfeilene små, og løseren
  rapporterer `success=True`. Flagget betyr bare at løseren stoppet på vanlig måte.
- **Ulik kvalitet:** Den andre kandidaten er det **fjerneste** punktet. Det
  andre startpunktet ligger på linjen gjennom sjøens midte og kaféen. Der peker
  både $\nabla F$ (bort fra kaféen) og normalen (ut fra sjøens midte) langs
  linjen, så ingenting dytter løseren til siden.
- **Litt endret start:** Flytter du startpunktet litt bort fra linjen, finner
  løseren det nærmeste punktet igjen.

**Er det globalt nærmest?** Kontrollfeilene viser bare at punktet er en
kandidat. At det er det nærmeste, viser vi som på den runde stien i 12.1: sett
fra sjøens midte er et sted på stien nærmere kaféen jo mer det ligger i retning av kaféen.
Med tall: $\lVert z-a\rVert_2^2=z\cdot z-2\,a\cdot z+a\cdot a$, og på stien er
$z\cdot z=1$ og $a\cdot a=5$, så
$$F(z)=\tfrac12(1-2\,a\cdot z+5)=3-a\cdot z.$$
Skalarproduktet $a\cdot z$ er komponenten av $a$ langs retningen til stedet. Den
er størst, $\lVert a\rVert_2=\sqrt5$, når stedet ligger rett mot kaféen
(Cauchy–Schwarz, som i 12.2). Derfor er
$F(z)\ge3-\sqrt5=\tfrac12(\sqrt5-1)^2\approx0.764$ på hele stien, med likhet
bare i $z=a/\sqrt5$, punktet fra det første startpunktet.

**Svaret til Arild:** Kartappen kan si «ferdig» også når den har funnet det
fjerneste punktet. Han kan stole på forslaget først når han har sjekket tre
ting selv: Ligger punktet på stien (betingelsesfeilen)? Er stien flat der, så
avstanden ikke endrer seg i første lille skritt (stasjonaritetsfeilen)? Og er
verdien den beste, vist med en ulikhet som gjelder alle punkter på stien? Da er
han sikker, uten å gå hele stien.

**Øv på dette:** [to kontrollfeil for et feil forslag](#uke12-oppg-kontroll)
i 12.6 og [de tre første kodeoppgavene](#uke12-python) i 12.7.

::: {.reading-step title="Gå i dybden: en annen vei, straffemetoden"}

- **Uten et eksplisitt krav:** I stedet for å forby punkter utenfor stien kan
  vi straffe dem, med en straff som vokser med kvadratet av $h$. Vi minimerer
  $F+\tfrac\mu2h^2$ uten krav, med et stort tall $\mu$. I prosjektet er dette de
  stive fjærene i stedet for faste ledd.
- **Gradienten:** $\nabla F+(\mu h)\nabla h$. Sammenlign med
  $\nabla F+\lambda\nabla h$: tallet $\mu h$ spiller rollen til $\lambda$.
- **Tilnærmingen:** Da blir $h$ liten, men ikke null, og $\mu h$ nærmer seg
  multiplikatoren. I [prosjekt 12](project_week12.qmd) ser du hva det koster
  når $\mu$ blir stor.

:::

::: {.reading-step title="Gå i dybden: hva rapporterer SLSQP underveis?"}

Hvordan kommer SLSQP fram til svaret? Cellen kjører samme søk med en
`callback` som lagrer punktene SLSQP rapporterer, skriver ut $h$ og $F$ i
hvert av dem, og tegner dem sammen med nivåkurvene til $F$.

- **Linjestykkene:** Viser bare rekkefølgen.
- **Mellompunktene:** Trenger ikke ligge på sirkelen. Appen kan altså gå
  gjennom steder utenfor stien underveis. Et punkt utenfor
  sirkelen kan ha lavere $F$ enn det beste tillatte punktet.

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

**Begge de stasjonære punktene.**

1. Fra $z-a+2\lambda z=0$ følger $z=a/(1+2\lambda)$.
2. Kravet gir $|1+2\lambda|=\sqrt5$.
3. Det nærmeste punktet $a/\sqrt5$ og det fjerneste $-a/\sqrt5$ er begge
   stasjonære.

Små kontrollfeil alene skiller dem ikke; verdien av $F$ gjør det.

:::

::: {.reading-step title="Gå i dybden: ulikhetskrav – skiven i stedet for sirkelen"}

Om vinteren er sjøen islagt, og isen bærer. Da kan Arild gå hvor som helst
**i** området innenfor stien, ikke bare på selve stien. Punktet må da oppfylle $g(z)\le0$ med $g(z)=\lVert z\rVert_2^2-1$
(skiven). Da er det to muligheter:

- Ligger $a$ inne i skiven, er $z=a$ selv svaret. Kravet er **ikke aktivt**,
  og målfunksjonen har gradient null der. Vi setter $\lambda=0$.
- Ligger $a$ utenfor, er svaret på randen, som over. Kravet er **aktivt**.

Begge tilfellene dekkes av **KKT-betingelsene** for en minimering med
$g\le0$ og $L=F+\lambda g$:

$$\nabla F+\lambda\nabla g=0,\qquad g\le0,\qquad \lambda\ge0,\qquad \lambda\,g=0.$$

- **Komplementær slakk:** Den siste likningen er **komplementær slakk** fra
  [uke 11](uke11.qmd#uke11-slakk): enten er kravet aktivt ($g=0$), eller så
  er prisen null ($\lambda=0$).
- **Fortegnskravet:** $\lambda\ge0$ sier at $-\nabla F$, retningen der $F$
  avtar, peker ut av skiven. Å slippe opp kravet litt kan derfor bare gjøre minimumsverdien lavere eller la den være uendret.

Cellen prøver begge tilfellene med SLSQP: én $a$ inne i skiven og én
utenfor. For hvert svar sjekker den om kravet er aktivt, og regner i så fall
ut $\lambda$ med formelen for minste kvadrater over.

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

SciPy skriver ulikheter som `fun(z) >= 0`, derfor sender vi `1 - q @ q`.

| Punktet vi søker nærmest | Er kravet aktivt? | Multiplikator |
|:--|:--|:--|
| $a=(0.5,0.25)$ | Nei | $\lambda=0$ |
| $a=(2,1)$ | Ja | $\lambda=0.618034=(\sqrt5-1)/2$ |

I det siste tilfellet er multiplikatoren den samme som med sirkelkravet.

**Øv på dette:** [aktivt eller ikke aktivt krav](#uke12-oppg-skive) i 12.6 (valgfri).

:::

### Svar på ukens spørsmål

Arild spurte tre ting. Svarene er nå komplette:

1. **Hvor er det høyeste punktet?** I det høyeste punktet berører høydekurven
   stien, og brattest oppover peker rett ut fra stien. Det gir Lagranges
   likninger: kravet $h=0$ og $\nabla f+\lambda\nabla h=0$. På den avlange stien
   ligger punktet i $(0.707,\,0.354)$, 141 meter over nullnivået.
2. **Hvordan kan han være sikker?** Flate steder er bare kandidater. Han finner
   dem alle og sammenligner høydene, eller bruker en ulikhet som gjelder alle
   punkter på stien. Er høyden kvadratisk og stien rund, ligger kandidatene i
   retningen til egenvektorene, og høyeste og laveste høyde er største og minste
   egenverdi (12.4). Et punkt fra en kartapp sjekker han med de to
   kontrollfeilene først.
3. **Hva gir den ytre runden?** Prisen er $-\lambda$: på en runde der $h=s$,
   ligger det høyeste punktet omtrent $-\lambda\cdot s$ høyere.
   For den avlange stien er $-\lambda=1/\sqrt2\approx0.71$, så $s=0.1$ gir
   omtrent 7 meter.

Kjettingen i prosjektet stiller de samme spørsmålene. Kjettingen henger slik at
energien blir minst mulig når leddene har faste lengder. Multiplikatorene er
kreftene i leddene, og prisen $-\lambda$ sier hva litt mer lengde er verdt i
energi.

### Hva de tolv ukene har bygget

::: {#uke12-avslutning}
:::

Slik henger de tolv ukene sammen:

| Uker | Det vi bygget |
|:--|:--|
| 1–7 | Flyttall og avrunding, iterasjon, likningssett, nullrom og rang, minste kvadrater, egenverdier, SPD-matriser og CG, og singulærverdier. |
| 8 | Eksistens, Hessianen og konveksitet. |
| 9–10 | Gradient- og Newtonmetoden med kondisjonstallet og Cholesky. |
| 11–12 | Multiplikatorer som priser og optimalitetssertifikater. |

Ukene 8–12 brukte altså verktøyene fra ukene 1–7 på optimering.
[Tre spørsmål](uke8.qmd#uke8-start) har fulgt oss siden uke 8, og underveis
kom et fjerde til:

1. Finnes det et beste svar?
2. Hva forteller krumningen?
3. Er kandidaten vi fant, den beste?
4. Hvordan kontrollerer vi et tall som en løser gir oss?

Denne uken svarte vi på dem med kompakthet (et høyeste punkt finnes), krumningen
langs stien («Gå i dybden» i 12.3), en ulikhet som gjelder hele stien, og to
kontrollfeil. Lagranges likninger ga kandidatene og svarer på ukens spørsmål fra
12.0: de erstatter $\nabla f=0$ når punktet må ligge på en kurve. Arbeidsmåten
tar du med deg videre: regn ut et svar, og kontroller det med et argument eller
en uavhengig test.

## 12.6 Regneoppgaver

::: {#uke12-oppgaver}
:::

Oppgavene er sortert etter de tre delene av uken, og de fleste har Arild,
hytta eller kaféen som utgangspunkt. De tre siste hører til «Gå i dybden»-boksene og er
valgfrie.

- **Arbeidsmåte:** Arbeid på papir først. Begrunnelsene skriver du i egne
  notater; feltene kontrollerer tallene.
- **Eksakte svar:** Gi eksakte svar, for eksempel `1/sqrt(5)`. I uttrykksfeltene bruker
  du `*` for multiplikasjon.
- **Ja/nei:** Skriv **1 for ja, 0 for nei**.

::: {#week12-exercise-convention .math-exercise-context}

Vi bruker $h=0$ og $L=f+\lambda h$. Ved et regulært ekstremum må $h=0$ og
$\nabla f+\lambda\nabla h=0$. Løsningene av disse likningene er kandidater
som må klassifiseres.

:::

### Idé 1: Lagranges likninger og prisen (12.1–12.2)

::: {#uke12-oppg-normal}
:::

Arild står på den avlange stien fra 12.1. Kravfunksjonen er
$h(x,y)=x^2+4y^2-1$, og stien er punktene der $h(x,y)=0$. Det nordligste
punktet på stien (toppen av ellipsen på kartet, ikke det høyeste punktet i terrenget) er $p=(0,1/2)$. Finn normalen $\nabla h(p)$ og en enhetstangent
med positiv $x$-komponent.

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

::: {#uke12-oppg-ellipse}
:::

Arild går samme avlange sti, men i et annet terreng med høyde
$f(x,y)=2x+y$. Hvor er det høyeste punktet på stien $x^2+4y^2=1$, og hvor høyt
er det? Bruk substitusjonen $w=2y$, slik at stien blir en sirkel, og bruk
Cauchy–Schwarz som i håndeksempelet i 12.2. Finn også multiplikatoren $\lambda$.

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

::: {#uke12-oppg-sirkel}
:::

På en rund sti med radius 1 km er terrenget $f(x,y)=3x-4y$: det stiger mot
øst og synker mot nord. Kravfunksjonen er $h(x,y)=x^2+y^2-1$, og stien er
punktene der $h(x,y)=0$. Finn det høyeste punktet på stien og multiplikatoren.

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

::: {#uke12-oppg-boks}
:::

Her er det ingen tur, men samme idé: et krav, en målfunksjon og en pris. En
sylinderformet boks har radius $x>0$ og høyde $y>0$. Overflaten er
$f(x,y)=2\pi x^2+2\pi xy$. Volumet skal være $V$. Kravfunksjonen er
$h(x,y)=\pi x^2y-V$, og kravet er $h(x,y)=0$, altså $\pi x^2y-V=0$.

Gradientene er gitt:

$\nabla f=\begin{bmatrix}4\pi x+2\pi y\\2\pi x\end{bmatrix},\qquad
\nabla h=\begin{bmatrix}2\pi xy\\\pi x^2\end{bmatrix}.$

1. Sett opp vektorlikningen $\nabla f+\lambda\nabla h=0$ sammen med $h=0$.
2. Bruk den andre komponentlikningen til å finne $\lambda$ uttrykt
   med $x$, og den første komponentlikningen til å finne forholdet mellom høyde og
   radius.
3. Bruk til slutt prisformelen fra 12.2: hvor mye øker minste overflate
   $A_*$ per enhet ekstra volum?

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

::: {#uke12-oppg-form}
:::

Arild går den runde stien $x^2+y^2=1$ i terrenget $f(x,y)=x^2+4xy+y^2$.
Han står i $p=(1,1)/\sqrt2$.

1. Skriv $f=z^TAz$ med en symmetrisk $A$, og finn egenverdiene og $f(p)$.
2. Finn multiplikatoren fra $Ap=-\lambda p$.
3. Krumningen langs sirkelen er gitt av $v^TBv$, der
   $B=2A+2\lambda I$ og enhetstangenten er $v=(-1,1)/\sqrt2$.
   Regn ut matriseproduktet. Hva forteller fortegnet om kandidaten $p$?

```{math-exercise}
#| label: week12-quadratic-form
#| caption: Kandidat, krumning og egenverdier for en kvadratisk form
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: funksjonsverdi i p, tangentkrumning v^T B v, største egenverdi, minste egenverdi, multiplikator i p

$f(p)=$ _[3]

$v^TBv=$ _[-8]

Egenverdier til $A$: største _[3], minste _[-1]

$\lambda$ i $p$: _[-3]
```

::: {#uke12-oppg-strekk}
:::

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

::: {#uke12-oppg-kkt}
:::

Hytta ligger på en holme i origo, og en rett vei på land følger kravet $x+2y=5$. Minimer kvadratet
av avstanden til hytta, $f(x,y)=x^2+y^2$, langs veien. Skriv Lagranges likninger som et
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

::: {#uke12-oppg-kontroll}
:::

I avstandsproblemet fra 12.5 ligger kaféen i punktet $(2,1)$, og $a=(2,1)$ er vektoren dit. Her er
$F(z)=\tfrac12\lVert z-a\rVert_2^2$ og kravfunksjonen
$h(z)=\lVert z\rVert_2^2-1$. Kartappen foreslår $z=(1,0)$ og $\lambda=1/2$.
Regn ut begge kontrollfeilene.

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

::: {#uke12-oppg-degenerert}
:::

Hører til «Gå i dybden: når normalen forsvinner» i 12.2. La $f(x,y)=x+3y$, med
kravfunksjonen $h(x,y)=x^2+y^2$ og kravet $h(x,y)=0$. Finn det eneste
tillatte punktet og $\nabla h$ der.

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

::: {#uke12-oppg-grense}
:::

Hører til «Gå i dybden: en multiplikator gir en nedre grense» i 12.2. Bruk
$F(z)=\tfrac12\lVert z-(2,1)\rVert_2^2$, kravfunksjonen
$h(z)=\lVert z\rVert_2^2-1$ og $\lambda=1/2$. Da er $L=F+\lambda h$ kvadratisk.

Finn:

1. $c$ slik at Hessianen til $L$ er $cI$,
2. minimumsverdien av $L$ over alle $z$,
3. $F(1,0)$.

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

::: {#uke12-oppg-skive}
:::

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

::: {#uke12-python}
:::

Her øver du på kontrollene Arild bruker: normalen til stien, de to
kontrollfeilene og kartappen SLSQP. Oppgavene har egne importer og definisjoner
og kan kjøres uavhengig av forsøkene. Fyll bare inn hullene merket `TODO`. De automatiske testene vurderer
resultatet uten å vise løsningen.

::: {#uke12-scipy}
:::

::: {.details title="SciPy-oppslag: SLSQP og multiplikatoren"}

| Uttrykk | Betydning |
|:--|:--|
| `method="SLSQP"` | En metode i `minimize` som tar imot likhets- og ulikhetskrav. |
| `{"type": "eq", "fun": h, "jac": grad_h}` | Krever $h(z)=0$ og oppgir gradienten (normalen). |
| `{"type": "ineq", "fun": lambda z: -g(z)}` | Krever at funksjonen er $\ge0$. Et krav $g(z)\le0$ sendes derfor som $-g$. |
| `options={"ftol": 1e-12, "maxiter": 100}` | Løserens stopptoleranse og grense for antall iterasjoner. |
| `np.linalg.lstsq(J.T, -grad, rcond=None)[0]` | Multiplikatorene som gjør $\lVert\nabla F+J^T\lambda\rVert_2$ minst, med `grad` $=\nabla F$. |

**Flere krav:** Bruk en liste med ordbøker, eller én `fun` som returnerer
en vektor og en `jac` som returnerer Jacobimatrisen.

`result.x`, `result.fun` og `result.success` betyr det samme som i
[uke 8](uke8.qmd#uke8-python-local).

- **Nyere SciPy-versjoner:** Gir også `result.multipliers`, men med motsatt
  fortegn av vårt ($L=f-\lambda h$).
- **SciPy 1.14 i nettleseren:** Gir dem ikke.
- **Vår kontroll:** Vi beregner derfor $\lambda$ selv med `lstsq`, som virker
  overalt, og kontrollerer $|h|$ og
  $\lVert\nabla F+\lambda\nabla h\rVert_2$.

:::

::: {#uke12-py-normal}
:::

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

::: {#uke12-py-kontroll}
:::

**Les et numerisk svar.** For avstandsproblemet i 12.5 skal
`check(z, lam)` returnere betingelsesfeilen $|h(z)|$ og
stasjonaritetsfeilen $\lVert\nabla F(z)+\lambda\nabla h(z)\rVert_2$.

```{py-exercise}
#| label: week12-python-residuals
#| caption: Kontroller betingelsesfeil og stasjonaritetsfeil
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

::: {#uke12-py-slsqp}
:::

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

::: {#uke12-py-kkt}
:::

**KKT-systemet og pseudoinversen.** *Valgfri: bygger på den valgfrie fanen
[7.7](uke7.qmd#uke7-pseudoinvers).* Minimer $\tfrac12\lVert z\rVert_2^2$ når
$Cz=d$.

1. Bygg blokkmatrisen $K=\begin{bmatrix}I&C^T\\C&0\end{bmatrix}$ med
   `np.block`.
2. Løs $K(z,\lambda)^T=(0,d)^T$ og returner bare $z$.
3. Sammenlign etterpå med `np.linalg.pinv(C) @ d`.

```{py-exercise}
#| label: week12-python-kkt
#| caption: Løs et KKT-system og sammenlign med pseudoinversen
#| show-test-hints: false
import numpy as np

C = np.array([[1., 1, 1], [1, -1, 2]])
d = np.array([3., 1])

def kkt_min_norm(C, d):
    m, n = C.shape
    # TODO: Bygg K med np.block og høyresiden (0, d), løs, og returner z (de n første komponentene).
    return np.zeros(n)

## TESTS ##
z = kkt_min_norm(C, d)
assert np.allclose(C @ z, d)
assert np.allclose(z, np.linalg.pinv(C) @ d)
C2 = np.array([[1., 2, 0, 1]]); d2 = np.array([4.])
assert np.allclose(kkt_min_norm(C2, d2), np.linalg.pinv(C2) @ d2)
```

:::
