<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Selvstudium</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 5.0 Hva overlever?

<div id="uke5-start"></div>

Hva skjer hvis vi bruker den samme matrisen på en vektor mange ganger?
Og kan den samme regneoperasjonen brukes til å rangere nettsider?

Vi begynner med å prøve. Deretter forklarer vi mønsteret vi ser, og bygger
matematikken som trengs for å undersøke når det virker.



Begge visninger følger samme løype. **Prøv og lag en hypotese før du leser
forklaringen.** «Forklaring steg for steg» åpnes i selvstudium; hint,
løsningsforslag og fordypninger åpner du selv. Uten JavaScript kan alle
forklaringene fortsatt åpnes enkeltvis.

**Hva hører til hvilket løp?** Alt utenfor de sammenleggbare boksene er
fellesløpet: Vi gjør forsøkene sammen i forelesningen, og du gjør de samme
forsøkene på egen hånd i selvstudium. Hvert forsøk sier hva du skal gjøre,
hva du skal notere, og hvor du sammenligner resultatet. Les videre først
etter at du har prøvd. Boksene utdyper regningen; de introduserer ikke en
annen rekkefølge. Oppgavene i 5.7 er til egenarbeid etter fellesløpet.

**I forelesningen:** [en retning vokser fram](#uke5-erfaring) →
[finn retningene](#uke5-egen) → [forklar gjentakelsen](#uke5-basis) →
[bygg og utfordre metoden](#uke5-potens) → [besøk på et nettverk](#uke5-nett) →
[en felle og en utvei](#uke5-google).

Etter uken skal du kunne finne egenverdier og egenvektorer i små eksempler,
forklare gjentatt multiplikasjon i en egenvektorbasis, implementere og
kontrollere potensmetoden og forklare PageRank som en stasjonær fordeling.

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

Startvalgene angir retninger og normaliseres til lengde én. Den oransje
vektoren $x_0$ er starten; den blå er det nåværende resultatet. Hvert klikk
regner ut $Ax$ og deler på lengden til svaret. Vi bruker ingen
normalisering av enkeltkoordinater. Merkingen $A^kx_0$ ved endepunktet viser
hvilket produkt retningen kommer fra; lengden i figuren er alltid normalisert til én.

```{.jsxgraph width="680" height="640"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-1.65, 1.8, 1.65, -2.55], axis: true,
  showCopyright: false, showNavigation: false, keepaspectratio: true
});
var origin = board.create('point', [0, 0], {visible: false, fixed: true});
var circle = board.create('circle', [origin, 1], {strokeColor: '#aab6c1', dash: 2});
var start = board.create('glider', [1, 0, circle], {name: 'x₀', color: '#a04a00'});
board.create('arrow', [origin, start], {strokeColor: '#a04a00', strokeWidth: 1.5, dash: 2});
var current = [1, 0], count = 0;
var end = board.create('point', [function(){return current[0];}, function(){return current[1];}],
  {name: '', withLabel: false, fixed: true, color: '#1565c0'});
board.create('arrow', [origin, end], {strokeColor: '#1565c0', strokeWidth: 3});
board.create('text', [
  function(){return current[0] + 0.08;},
  function(){return current[1] + 0.12;},
  function(){return 'A<sup>'+count+'</sup>x<sub>0</sub>';}
], {display: 'html', fontSize: 19, color: '#1565c0', fixed: true, highlight: false});
function reset() {
  current = [start.X(), start.Y()]; count = 0; board.update();
}
function choose(a, b) {
  var length = Math.hypot(a, b);
  start.moveTo([a/length, b/length]); reset();
}
start.on('drag', reset);
var stepButton = board.create('button', [-1.5, -1.3, 'Ett steg', function() {
  var y = [2*current[0]+current[1], current[0]+2*current[1]];
  var length = Math.hypot(y[0], y[1]);
  current = [y[0]/length, y[1]/length]; count++; board.update();
}]);
// Style the actual HTML button, not its positioned JSXGraph wrapper.
if (stepButton.rendNodeButton) stepButton.rendNodeButton.classList.add('week5-main-step');
board.create('button', [-0.2, -1.3, 'Start på nytt', reset]);
board.create('text', [-1.5, -1.62, 'Velg startretning:'],
  {fontSize: 14, fixed: true, highlight: false});
board.create('button', [-1.5, -1.85, '(1, 0)', function(){choose(1, 0);}]);
board.create('button', [-0.2, -1.85, '(−1, 0)', function(){choose(-1, 0);}]);
board.create('button', [-1.5, -2.15, '(1, 1)', function(){choose(1, 1);}]);
board.create('button', [-0.2, -2.15, '(1, −1)', function(){choose(1, -1);}]);
board.create('button', [-1.5, -2.45, '(0, 1)', function(){choose(0, 1);}]);
board.create('button', [-0.2, -2.45, '(1, −0.9)', function(){choose(1, -0.9);}]);
board.create('text', [-1.5, 1.57, function() {
  return 'x<sub>'+count+'</sub> = A<sup>'+count+'</sup>x<sub>0</sub>' +
    ' / ‖A<sup>'+count+'</sup>x<sub>0</sub>‖<sub>2</sub>';
}], {display: 'html', fontSize: 16, fixed: true, highlight: false});
board.create('text', [-1.5, 1.27, function() {
  return 'x<sub>'+count+'</sub> = ('+current[0].toFixed(3)+', '+current[1].toFixed(3)+')';
}], {display: 'html', fontSize: 14, fixed: true, highlight: false});
```

### Hva la du merke til?

Mange startvektorer nærmer seg samme **linje**, men kan ha motsatt orientering.
Startene langs $(1,1)^T$ og $(1,-1)^T$ skiller seg ut: der endres ikke
retningen. Vi skal undersøke hva matrisen gjør langs disse linjene.

Figurens regneoperasjon kan nå skrives

$$x_{k+1}=\frac{Ax_k}{\lVert Ax_k\rVert_2},\qquad
x_k=\frac{A^kx_0}{\lVert A^kx_0\rVert_2}.$$

Her teller $k$ multiplikasjonene, $A^0=I$, og $x_0$ har lengde én.
For starten $(1,0)^T$ er første steg helt konkret

$$Ax_0=\begin{bmatrix}2\\1\end{bmatrix},\quad
\lVert Ax_0\rVert_2=\sqrt5,\quad
x_1=\frac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix}.$$

**Sjekk:** Regn ut hva som skjer med $(1,1)^T$ og $(1,-1)^T$.
Blir vektorene dreid, eller blir de bare ganget med et tall?

<details class="reading-step">
<summary>Forklaring steg for steg: skaler uten å dreie</summary>

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

### Felles forsøk — regn fire matriseprodukter for hånd

Bruk de to retningene fra figuren. Dette forsøket er en del av
**forelesningsløpet**, og gjentas for hånd i selvstudium; du skal ikke
endre matrisen i figuren i 5.1.

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

### Sammenlign etter at du har regnet

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

### Nå gir vi mønsteret et navn

En ikke-null vektor $v$ som oppfyller

$$Av=\lambda v$$

kalles en **egenvektor**. Tallet $\lambda$ er dens **egenverdi**.
For $\lambda\ne0$ blir vektoren på samme linje. Negativ $\lambda$ snur vektoren;
$\lambda=0$ sender den til null. Alle ikke-null multipler av $v$ er også
egenvektorer med samme egenverdi. Nullvektoren er utelatt fordi $A0=\lambda0$
gjelder for alle $\lambda$ og derfor ikke identifiserer noen spesiell retning.

### Hvordan finner vi dem uten å gjette?

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

<details class="reading-step">
<summary>Forklaring steg for steg: fra egenverdi til egenrom</summary>

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

**Felles kontroll (for hånd):** Finn egenverdier og egenrom til
$C=\begin{bmatrix}2&1\\0&1\end{bmatrix}$. Kontroller med $Cv=\lambda v$.
Er egenvektorene ortogonale?

<details class="learning-hint">
<summary>Løsningsforslag: en matrise uten ortogonale egenretninger</summary>

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

## 5.3 Basis og gjentakelse

<div id="uke5-basis"></div>

### Felles forsøk — følg to bidrag for hånd

Bruk $A$ fra 5.1. Start med

$$x_0=\begin{bmatrix}1\\0\end{bmatrix}
=\tfrac12\begin{bmatrix}1\\1\end{bmatrix}
+\tfrac12\begin{bmatrix}1\\-1\end{bmatrix}.$$

**Før du leser videre:** Bruk resultatene $Av_1=3v_1$ og $Av_2=v_2$ fra
5.2, med $v_1=(1,1)^T$ og $v_2=(1,-1)^T$.
Skriv $Ax_0$, $A^2x_0$ og $A^3x_0$ som summer av disse to vektorene.
Noter forholdet mellom den andre og den første koeffisienten.

**Sammenlign regningen:** Linearitet lar oss behandle ett bidrag om gangen:

$$\begin{aligned}
Ax_0&=\tfrac12Av_1+\tfrac12Av_2=\tfrac32v_1+\tfrac12v_2=(2,1)^T,\\
A^2x_0&=\tfrac32Av_1+\tfrac12Av_2=\tfrac92v_1+\tfrac12v_2=(5,4)^T,\\
A^3x_0&=\tfrac{27}2v_1+\tfrac12v_2=(14,13)^T.
\end{aligned}$$

Etter $k$ steg er

$$A^kx_0=\tfrac12 3^k\begin{bmatrix}1\\1\end{bmatrix}
+\tfrac12\begin{bmatrix}1\\-1\end{bmatrix}.$$

Det andre bidraget forsvinner ikke. Men forholdet mellom bidragene er
$3^{-k}$, og derfor nærmer den normaliserte vektoren seg den første linjen.
Vi kan se dette direkte ved å dele ut den dominerende skaleringen:

$$A^kx_0=\tfrac12 3^k\bigl(v_1+3^{-k}v_2\bigr),\qquad
x_k=\frac{v_1+3^{-k}v_2}{\lVert v_1+3^{-k}v_2\rVert_2}
\longrightarrow\frac{v_1}{\sqrt2}.$$

**Felles kontroll:** Hva endres hvis starten er $x_0=v_2/\sqrt2$?
Da mangler bidraget langs $v_1$ helt, slik du så med startvalget $(1,-1)$ i figuren.

### Fra dette eksemplet til teorien

Hvis egenvektorene $v_1,\ldots,v_n$ danner en basis, kan vi skrive

$$x_0=\sum_{i=1}^n c_iv_i,
\qquad A^kx_0=\sum_{i=1}^n c_i\lambda_i^kv_i.$$

Matrisen kalles da **diagonaliserbar**. En enkel egenverdi $\lambda_1$ er
**dominant** når $|\lambda_1|>|\lambda_i|$ for alle $i>1$.
Hvis $c_1\ne0$, vokser dens bidrag relativt til de andre. Forholdet
$|\lambda_2/\lambda_1|$, med egenverdiene sortert etter absoluttverdi,
forklarer den asymptotiske farten: nær én betyr langsom utskilling.

<details class="reading-step">
<summary>Forklaring steg for steg: hvorfor kan vi behandle bidragene hver for seg?</summary>

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

**Felles forsøk (for hånd):** Normaliser $(1,1)^T$ og $(1,-1)^T$.
Sett resultatene som kolonner i $Q$. Beregn de fire elementene i $Q^TQ$,
og beregn $Q^T(1,0)^T$. Sammenlign deretter med regningen nedenfor.

$$Q=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix},\quad
Q^TQ=\frac12\begin{bmatrix}2&0\\0&2\end{bmatrix}=I,\quad
Q^T\begin{bmatrix}1\\0\end{bmatrix}=\frac1{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}.$$

Her måler $Q^Tx$ koeffisientene i den **normaliserte** basisen.
De er $1/\sqrt2$, mens koeffisientene i basisen $(v_1,v_2)$ var $1/2$.

De normaliserte vektorene danner en ortonormal basis. Dette er en generell
mulighet for **reelle symmetriske matriser**: de har reelle egenverdier og
kan skrives

$$A=Q\Lambda Q^T.$$

Som i uke 4: $Q^T$ måler komponentene, $\Lambda$ skalerer dem, og $Q$ bygger
vektoren igjen. Her er $Q$ kvadratisk og inneholder en full basis.
Dette er spektralteoremet; en generell overgangsmatrise i PageRank trenger
ikke være symmetrisk eller ha ortogonale egenvektorer.

<details class="reading-step">
<summary>Forklaring steg for steg: hvorfor ortogonale egenvektorer?</summary>

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
$\sum_i\lambda_i z_i^2>0$. Dette forklarer forbindelsen til positiv definitet.

</details>

## 5.4 Potensmetoden

<div id="uke5-potens"></div>

### Et forsøk med farten

**Felles forsøk — forutsi, kjør cellen, les av:** Vi bruker
$A_\mu=Q\operatorname{diag}(3,\mu)Q^T$ med samme $Q$ som i 5.3.
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
Etter hvert kan avrunding bestemme hva vi ser nederst i plottet.
Siden startkoeffisientene her er like store, forutsier teorien

$$\left|\frac{c_2^{(k)}}{c_1^{(k)}}\right|
=\left(\frac{|\mu|}{3}\right)^k,\qquad
(1/3)^{10}\approx1.69\cdot10^{-5},\quad
(2.9/3)^{10}\approx0.712.$$

Normaliseringen deler begge koeffisientene på samme tall og endrer ikke
forholdet. Derfor kan vi sammenligne kurvene direkte med denne formelen.

<details class="reading-step">
<summary>Forklaring steg for steg: les konvergensplottet</summary>

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

Vi trenger både et tall for skaleringen og en kontroll. Fra uke 4 vet vi
hvordan vi måler langs en retning:

$$\rho(x)=\frac{x^TAx}{x^Tx},\qquad r=Ax-\rho(x)x.$$

$\rho$ kalles **Rayleigh-kvotienten**, og $r$ er **egenresidualen**.
Hvis $x$ er en egenvektor, får vi dens egenverdi og null residual.

<details class="reading-step">
<summary>Forklaring steg for steg: hvorfor akkurat denne kvotienten?</summary>

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

**Felles kontroll:** Bruk første normaliserte steg $x=(2,1)^T/\sqrt5$ fra 5.1.
Beregn først $Ax$, deretter $\rho$ og $r$. Sammenlign med

$$Ax=\frac1{\sqrt5}\begin{bmatrix}5\\4\end{bmatrix},\qquad
\rho=\frac{2\cdot5+1\cdot4}{5}=\frac{14}{5},$$

$$r=\frac1{5\sqrt5}\begin{bmatrix}-3\\6\end{bmatrix},\qquad
\lVert r\rVert_2=\frac35.$$

Retningen er ennå ikke en egenretning, men residualen har falt fra $1$ ved
start til $3/5$ etter ett steg.

<details class="reading-step">
<summary>Forklaring steg for steg: implementasjonen av potensmetoden</summary>

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

`scale` er $\lVert A\rVert_F$. Stoppkravet er
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

Vi sammenligner residualen med $\text{tol}\,\lVert A\rVert_F$ fordi $x$ har
lengde én. Frobeniusnormen er kvadratroten av summen av de kvadrerte
matriseelementene. Dette gjør testen uavhengig av en felles skalering av $A$.

### Forutsi fire problemtilfeller

**Felles forsøk:** Regn de to første normaliserte stegene for hver rad i
tabellen. Noter «fast retning», «fortegn veksler», «to retninger» eller
«rotasjon». Gjett også om egenresidualen kan bli null. Kjør deretter cellen
og sammenlign med din tabell. Figuren viser seks steg uten tidlig stopp;
utskriften bruker algoritmen med stoppkriterium.

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

<details class="learning-hint">
<summary>Løsningsforslag: hva svikter?</summary>

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

## 5.5 Besøk på nettsider

<div id="uke5-nett"></div>

### Fordel besøkene før vi innfører nye ord

Fire sider har disse lenkene:

| Fra side | Lenker til |
|---|---|
| A | B og C |
| B | C |
| C | A og D |
| D | A |

**Gjett rangeringen.** Er antall innkommende lenker nok til å avgjøre den?
**Felles forsøk:** Legg først en firedel av besøkene på hver side.
Hver runde fordeles alle besøk fra en side likt mellom dens utgående lenker.

1. Lag fire summer på papir: ett mottaksregnskap for hver side A–D.
2. Kontroller at summen av alle mottakene er én.
3. Kjør cellen og sammenlign de to startfordelingene. Noter om de nærmer
   seg samme sluttfordeling, og hvilke sider som deler førsteplassen.

```{pyodide-python}
#| label: week5-network
# Kolonne j viser hvor besøkene FRA side j går; rad i er mottaker.
S = np.array([[0., 0., 1/2, 1.],
              [1/2, 0., 0., 0.],
              [1/2, 1., 0., 0.],
              [0., 0., 1/2, 0.]])
starts = [np.ones(4)/4, np.array([1., 0., 0., 0.])]
fig, axes = plt.subplots(1, 2, figsize=(9, 3))
for ax, p0 in zip(axes, starts):
    p = p0.copy()
    values = [p.copy()]
    for k in range(40):
        p = S @ p
        values.append(p.copy())
    ax.plot(values)
    ax.set(xlabel="Runde", ylabel="Andel besøk", title=f"Start: {p0}")
    ax.legend(list("ABCD"))
print("Kolonnesummer:", S.sum(axis=0))
print("Etter 40 runder:", p, "sum:", p.sum())
fig.tight_layout()
plt.show()
```

### Forklar regnskapet

Fra jevn start er mottaksregnskapet

$$\begin{aligned}
p_A^{(1)}&=\tfrac12\cdot\tfrac14+1\cdot\tfrac14=\tfrac38,
& p_B^{(1)}&=\tfrac12\cdot\tfrac14=\tfrac18,\\
p_C^{(1)}&=\tfrac12\cdot\tfrac14+1\cdot\tfrac14=\tfrac38,
& p_D^{(1)}&=\tfrac12\cdot\tfrac14=\tfrac18.
\end{aligned}$$

Samle det samme regnskapet i ett produkt, med rekkefølgen A, B, C, D:

$$\underbrace{\begin{bmatrix}0&0&1/2&1\\1/2&0&0&0\\1/2&1&0&0\\0&0&1/2&0\end{bmatrix}}_{S}
\begin{bmatrix}1/4\\1/4\\1/4\\1/4\end{bmatrix}
=\begin{bmatrix}3/8\\1/8\\3/8\\1/8\end{bmatrix}.$$

Hver kolonne fordeler alt som kom fra én side. Derfor summerer kolonnene
til én. En viktig side sender mer videre enn en lite besøkt side, og den
må dele dette bidraget mellom lenkene sine.

En matrise med ikke-negative elementer og kolonnesum én kalles
**kolonnestokastisk**. En **sannsynlighetsvektor** har ikke-negative elementer
som summerer til én. Oppdateringen er $p_{k+1}=Sp_k$.

Hvis fordelingen ikke lenger endres, har vi

$$Sp=p.$$

Dette er en egenvektorlikning med egenverdi **1**. Fordelingen kalles
**stasjonær**. Den har fast sum, ikke nødvendigvis euklidsk lengde én.
Individuelle besøkende fortsetter å flytte seg selv om fordelingen er stasjonær.

<details class="reading-step">
<summary>Forklaring steg for steg: ett matriseprodukt og en bevaringslov</summary>

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
Siden en matrise og dens transponerte har samme karakteristiske polynom,
har $S$ også egenverdi én. Men dette alene garanterer ikke at iterasjonen
konvergerer til én bestemt fordeling.

**Les én kolonne og én rad.** Kolonne C er $(1/2,0,0,1/2)^T$ fordi en
besøkende på C går til A eller D med lik sannsynlighet. Rad A er
$(0,0,1/2,1)$ fordi A mottar halvparten fra C og alt fra D.
Rad A summerer til $3/2$, som er helt i orden: raden samler ulike avsendere.

**Løs stasjonaritetslikningen for hånd:**

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

hvor $u$ er fordelingen for tilfeldige hopp. I forsøket er $u=\mathbf1/n$.
Siden $\mathbf1^Tp_k=1$, kan vi også skrive $p_{k+1}=Gp_k$, med

$$G=\alpha S+(1-\alpha)u\mathbf1^T.$$

Produktet $u\mathbf1^T$ har $u$ i hver kolonne:

$$u\mathbf1^T=\begin{bmatrix}u&u&\cdots&u\end{bmatrix},\qquad
(u\mathbf1^T)p_k=u\underbrace{(\mathbf1^Tp_k)}_{1}=u.$$

Dermed beskriver $Gp_k$ akkurat samme besøksregel. For fire sider og
$\alpha=0.85$ får hver side et hoppbidrag $0.15/4=0.0375$ per runde.
I fellen blir for eksempel D-regelen

$$p_D^{(k+1)}=0.85\bigl(\tfrac12p_C^{(k)}+p_D^{(k)}\bigr)+0.0375.$$

Matrisen $G$ kalles **Google-matrisen**, og dens stasjonære sannsynlighetsvektor er
**PageRank-vektoren**. $\alpha$ er dempingsfaktoren; større $\alpha$ gir
lenkene mer vekt. Det innebærer et modellvalg, ikke bare et valg av regnefart.

**Hva hvis en side ikke har lenker?** En nullkolonne mister besøk og er
ikke stokastisk. Erstatt den med $u$ **før** du lager $G$. Dette er behandlingen
av en **hengende node**. Den skiller seg fra en side som lenker til seg selv:
selvlenken bevarer besøkene, men kan fange dem.

**Felles kontroll (for hånd):** Hvis D-kolonnen var null, hva ville
kolonnesummen til $G$ bli? Regn før du sammenligner:

$$\sum_iG_{iD}=\alpha\cdot0+(1-\alpha)\cdot1=1-\alpha.$$

Derfor må vi først erstatte nullkolonnen med $u$, slik at summen blir
$\alpha\cdot1+(1-\alpha)\cdot1=1$.

<details class="reading-step">
<summary>Forklaring steg for steg: fra besøksregel til Google-matrise</summary>

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
En slik matrise har en **entydig positiv stasjonær sannsynlighetsvektor**,
og iterasjon fra enhver sannsynlighetsvektor konvergerer til den.
Dette er en anvendelse av Perron–Frobenius-teoremet; vi beviser ikke hele
teoremet her. Det krever ikke at $G$ er symmetrisk eller diagonaliserbar.

**Sjekk forståelsen:** Lover teoremet at rangeringen er en god måling av
kvalitet? Hva skjer med lenkenes betydning når $\alpha=0$? Hvilken garanti
mister vi ved $\alpha=1$?

<details class="reading-step">
<summary>Forklaring steg for steg: andre egenverdier beskriver avvikene</summary>

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

**Egenarbeid etter fellesløpet:** Løs oppgavene på papir først. Bruk Python
som kontroll der det passer. Åpne svarboksen etter at du har skrevet en egen
begrunnelse. I forelesningen kan én av oppgavene brukes som avsluttende sjekk.

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
<summary>Korte svar til egenkontroll</summary>

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

I [prosjekt 5](project_week5.qmd) skal du bygge og kontrollere en rangering,
diagnostisere et problem og gjennomføre en egen undersøkelse. Ta med disse
spørsmålene: **Oppfyller svaret likningen? Konvergerer metoden? Måler modellen
det vi ønsket?** De er tre forskjellige spørsmål.

### Referanser

- [Interactive Linear Algebra: Stochastic Matrices](https://textbooks.math.gatech.edu/ila/stochastic-matrices.html):
  stasjonære fordelinger, positive stokastiske matriser og PageRank.
- [PageRank-notebook i Mathematics for Machine Learning](https://github.com/jiadaizhao/Mathematics-for-Machine-Learning/blob/master/Linear%20Algebra/Week5/PageRank.ipynb):
  inspirasjon til et lite nettverk og et felleforsøk. Nettverkene og koden her
  er selvstendige eksempler.

:::
