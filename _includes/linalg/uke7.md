<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Selvstudium</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 7.0 Oversikt

<div id="uke7-start"></div>

### Hva forsvinner når vi forenkler en matrise?

Denne uken undersøker vi både **hva en matrise bevarer**, og **hva den nesten
visker ut**. Det samme verktøyet forklarer bildekomprimering, rang og følsomme
likningssystemer: singulærverdidekomposisjonen (SVD).

Fellesløpet er det synlige innholdet. Gjør forsøkene før du leser forklaringen.
**Selvstudium** åpner mellomregninger og forbindelser til tidligere uker.
Hint og fordypning åpner du selv etter eget forsøk.

| Minutter | Fellesløp i én forelesning |
|---|---|
| 0–10 | [Se hva som overlever](#uke7-bilde): et bilde med få komponenter |
| 10–30 | [Finn strekkretningene](#uke7-geometri): sirkel blir ellipse |
| 30–45 | [Bygg SVD](#uke7-svd): to ortonormale basiser |
| 45–65 | [Forstyrre data](#uke7-kondisjon): når en liten feil blir stor |
| 65–80 | [Velg rang](#uke7-rang): komprimering og feil |
| 80–90 | [Ta en beslutning](#uke7-prosjekt): lagringsbudsjett og prosjekt |

Etter uken skal du kunne tolke $Av_i=\sigma_i u_i$, bruke en ferdig beregnet
SVD til rangreduksjon, og forklare sammenhengen mellom små singulærverdier,
nullrom og kondisjonering. Vi **beregner** SVD med et bibliotek; en generell
algoritme for å finne SVD er ikke pensum i denne forelesningen.

## 7.1 Se før du forklarer

<div id="uke7-bilde"></div>

### Felles forsøk — hvor lite trenger vi?

Kjør cellen. Den viser samme bilde rekonstruert med henholdsvis 1, 5 og 20
komponenter. Du trenger ennå ikke forstå funksjonen som lager dem.

```{pyodide-python}
#| label: week7-first-image
show_images({'original': portrait, **{f'{k} komponenter': rank_image(portrait,k) for k in (1,5,20)}})
```

**Før forklaringen:** Beskriv én detalj som kommer tilbake mellom 1 og 5,
og én mellom 5 og 20. Gjett om 20 komponenter ville vært like tilstrekkelig
for en diagonal strek eller tilfeldig støy. Begrunn uten å regne.

En matrise kan bygges som en sum av enkle matriser. Her beholdt vi bare noen
av dem. «Få komponenter» betyr foreløpig færre byggeklosser; det betyr ikke
at vi har beholdt et bestemt antall piksler.

<details class="reading-step">
<summary>Lesesporet: hva er matrisen i dette forsøket?</summary>

Bildet er en $96\times96$-matrise. Hvert element er en lysstyrke mellom 0 og 1.
En rad er en rad av piksler, ikke en observasjon med en innebygd statistisk
betydning. Vi sentrerer ikke bildet her. SVD kan brukes direkte på matrisen.

Forsøksbildet er hentet fra [det tidligere SVD-prosjektet](https://wiki.math.ntnu.no/_media/imax3011/2025h/svd_challenge-1.pdf),
og er skalert til gråtoner i $96\times96$ for rask kjøring.
Alle bilder vises med samme gråtoneskala. Rekonstruksjonene kan ha elementer
utenfor $[0,1]$; visningen metter disse, men feilberegningene bruker de
opprinnelige tallene uten klipping.

</details>

## 7.2 Fra sirkel til ellipse

<div id="uke7-geometri"></div>

### Felles forsøk — finn to spesielle retninger

La

$$A=\begin{bmatrix}0&2\\1&0\end{bmatrix}.$$

Beregn $Ax$ for $x=e_1$, $e_2$ og $(1,1)^T/\sqrt2$. Alle tre startvektorene
har lengde 1. Hvilken gir størst lengde etter multiplikasjon? Minst?
Gjett bildet av hele enhetssirkelen, og kjør deretter cellen.

```{pyodide-python}
#| label: week7-ellipse
small = 1.0  # Prøv deretter 0.2 og 0.0. Gjett formen før du kjører.
A = np.array([[0.,2.],[small,0.]])
theta = np.linspace(0,2*np.pi,300)
X = np.array([np.cos(theta),np.sin(theta)])
fig, ax = plt.subplots(1,2,figsize=(8,3))
for axis, points, title in zip(ax,[X,A@X],['Start: x','Resultat: Ax']):
    axis.plot(*points)
    axis.set(xlim=(-2.2,2.2),ylim=(-2.2,2.2),title=title)
    axis.axhline(0,color='gray',lw=.5); axis.axvline(0,color='gray',lw=.5)
    axis.set_aspect('equal'); axis.grid()
plt.show()
```

### Forklar det du ser

For den opprinnelige matrisen er $Ae_2=2e_1$ og $Ae_1=e_2$.
To vinkelrette **inputretninger** gir to vinkelrette **outputretninger**,
med strekkfaktorene 2 og 1. Retningene før og etter er forskjellige.

Skriv $v_1=e_2$, $v_2=e_1$, $u_1=e_1$, $u_2=e_2$. Da er

$$Av_1=2u_1,\qquad Av_2=1u_2.$$

Dette er mønsteret vi vil finne også for andre matriser:

$$\boxed{Av_i=\sigma_i u_i},\qquad \sigma_i\geq0.$$

Tallene $\sigma_i$ kalles **singulærverdier**. Vi ordner dem fra størst til minst.

<details class="reading-step">
<summary>Hvorfor er dette største og minste strekk?</summary>

For $x=(a,b)^T$ med $a^2+b^2=1$ får vi

$$Ax=(2b,a)^T,\qquad \|Ax\|_2^2=4b^2+a^2=1+3b^2.$$

Lengden ligger derfor mellom 1 og 2. Den blir 2 for $x=\pm e_2$ og 1 for
$x=\pm e_1$. Setter vi nedre venstre element til $s\in[0,1]$, får vi
$\|Ax\|_2^2=4b^2+s^2a^2$. Den minste strekkfaktoren blir $s$.
Ved $s=0$ sendes hele retningen $e_1$ til null: ellipsen blir et linjestykke.
Dette er nullrom og rang fra uke 3, nå synlig som geometri.

</details>

## 7.3 To basiser, én enkel operasjon

<div id="uke7-svd"></div>

### Felles forsøk — sett sammen delene

Bruk retningene fra forrige fane. Skriv $x=(3,4)^T$ som en kombinasjon av
$v_1=e_2$ og $v_2=e_1$. Bruk så $Av_i=\sigma_i u_i$ til å finne $Ax$.
Kontroller med vanlig matrisemultiplikasjon før du leser videre.

### Fra koordinater til faktorisering

Vi har $x=4v_1+3v_2$, altså $Ax=8u_1+3u_2=(8,3)^T$.
Samle basisvektorene som kolonner:

$$U=I,\qquad \Sigma=\begin{bmatrix}2&0\\0&1\end{bmatrix},\qquad
V=\begin{bmatrix}0&1\\1&0\end{bmatrix}.$$

Da kan samme regning skrives

$$x\ \xrightarrow{V^T}\ \begin{bmatrix}4\\3\end{bmatrix}
\ \xrightarrow{\Sigma}\ \begin{bmatrix}8\\3\end{bmatrix}
\ \xrightarrow{U}\ Ax.$$

**Mål koordinatene, skaler dem, bygg opp resultatet.** Fra uke 4 kjenner vi
koordinatene $v_i^Tx$ i en ortonormal basis. Her bruker vi én basis på hver side.

For enhver reell $m\times n$-matrise finnes en full SVD

$$\boxed{A=U\Sigma V^T},\qquad U^TU=I_m,\quad V^TV=I_n.$$

Her er $U$ av størrelse $m\times m$, $V$ av størrelse $n\times n$, og
$\Sigma$ er $m\times n$ med singulærverdiene på diagonalen.

<details class="reading-step">
<summary>Egenverdier fra uke 5: hvor kommer retningene fra?</summary>

Sett inn faktoriseringen og bruk ortogonaliteten:

$$A^TA=(U\Sigma V^T)^T(U\Sigma V^T)
=V\Sigma^TU^TU\Sigma V^T=V\Sigma^T\Sigma V^T.$$

Dermed er $A^TAv_i=\sigma_i^2v_i$ for de tilhørende diagonalverdiene.
Inputretningene er ortonormale egenvektorer til $A^TA$; singulærverdiene
kommer fra kvadratrøttene av de ikke-negative egenverdiene.
For $\sigma_i>0$ kan vi så sette $u_i=Av_i/\sigma_i$.

Dette forklarer forbindelsen, men er ikke oppskriften vi bruker numerisk:
vi kaller `np.linalg.svd(A)` direkte. Å danne $A^TA$ kan miste informasjon
om de minste retningene og kvadrerer kondisjonstallet når $A$ har full kolonnerang.

Egenvektorer til $A$ oppfyller $Av=\lambda v$ i samme rom og retning.
SVD tillater to forskjellige retninger og også rektangulære matriser.
For en SPD-matrise kan vi velge $U=V$ og $\sigma_i=\lambda_i$.

</details>

<details class="reading-step">
<summary>Rang, kolonnerom og nullrom fra uke 3</summary>

Hvis $r$ singulærverdier er positive, er

$$\operatorname{rank}(A)=r,\qquad
\operatorname{Col}(A)=\operatorname{span}(u_1,\ldots,u_r),\qquad
\operatorname{Null}(A)=\operatorname{span}(v_{r+1},\ldots,v_n).$$

For full SVD er de siste $m-r$ kolonnene i $U$ en basis for nullrommet til
$A^T$. Rangsatsen blir $r+(n-r)=n$.

Python returnerer `U, s, Vt`: den siste matrisen er **allerede transponert**.
Med `full_matrices=False` får vi $p=\min(m,n)$ kolonner i $U$ og $p$ rader i
`Vt`. Det holder for rekonstruksjon, men for en bred matrise mangler da noen
av høyre nullromsretningene. Bruk full SVD når hele nullromsbasis skal finnes.

I flyttallsregning teller vi ikke bare `s > 0`. En vanlig relativ terskel er
$\tau=\max(m,n)\epsilon\sigma_1$; tell verdier over $\tau$. For målte data
kan usikkerheten begrunne en langt større terskel. Numerisk rang avhenger
av skala og toleranse, mens eksakt rang er et matematisk heltall.

</details>

## 7.4 Små datafeil, store løsningsfeil

<div id="uke7-kondisjon"></div>

### Felles forsøk — samme forstyrrelse, to utfall

Nå bruker vi $A=\begin{bmatrix}0&2\\0.02&0\end{bmatrix}$ og
$x_*=(1,1)^T$, slik at $b=(2,0.02)^T$.
**Gjett først:** Hva skjer med løsningen hvis vi øker første komponent av $b$
med $0.01$? Hva hvis vi i stedet øker den andre med samme beløp?

```{pyodide-python}
#| label: week7-perturbation
A = np.array([[0.,2.],[.02,0.]])
x_true = np.ones(2)
b = A @ x_true
for db in (np.array([.01,0]), np.array([0,.01])):
    x = np.linalg.solve(A,b+db)
    print('dataendring:',db,' løsningsendring:',x-x_true,
          ' residual mot målte data:',np.linalg.norm(b+db-A@x))
```

### Forklar med strekkretningene

Likningene er $2x_2=b_1$ og $0.02x_1=b_2$. Dermed blir endringene
henholdsvis $(0,0.005)^T$ og $(0.5,0)^T$. Inversjon **deler på strekkfaktorene**:

$$\delta b=\eta u_i\quad\Longrightarrow\quad
\delta x=\frac{\eta}{\sigma_i}v_i.$$

For en invertibel matrise definerer vi

$$\boxed{\kappa_2(A)=\|A\|_2\|A^{-1}\|_2=
\frac{\sigma_1}{\sigma_n}}.$$

Her er $\kappa_2(A)=100$. En relativ datafeil kan i verste fall forsterkes
med denne faktoren. Retningen til feilen betyr noe; ikke alle feil forsterkes like mye.

**Husk uke 6:** En liten residual bekrefter at vi løser de oppgitte likningene
godt. Den garanterer ikke at løsningen er nær sannheten når data er usikre.

<details class="reading-step">
<summary>Residual, feil og en presis relativ grense</summary>

For invertibel $A$, $Ax=b\ne0$ og $A(x+\delta x)=b+\delta b$ er
$\delta x=A^{-1}\delta b$. Bruk $\|b\|\leq\|A\|\|x\|$ til å få

$$\frac{\|\delta x\|_2}{\|x\|_2}
\leq\kappa_2(A)\frac{\|\delta b\|_2}{\|b\|_2}.$$

For en beregnet $\widehat x$, sett $r=b-A\widehat x$ og $e=x-\widehat x$.
Da er $Ae=r$ og $\|e\|\leq\|r\|/\sigma_n$. Dette gjelder mot løsningen
for **samme** $b$. I forsøket er residualen målt mot forstyrrede data, mens
feilen er målt mot den kjente, uforstyrrede løsningen.

Hvis $\sigma_n=0$, kan input i nullrommet ikke bestemmes fra output.
For en matrise med full kolonnerang brukes også forholdet
$\sigma_1/\sigma_n$ som kondisjonstall, men følsomheten til et generelt
minste-kvadratersproblem avhenger i tillegg av residualen og hvilke data
som forstyrres. Den enkle relative grensen over er her utledet for et
invertibelt system med bare forstyrrelser i $b$.

</details>

<details class="reading-step">
<summary>Uke 4: nesten like kolonner og ustabile polynomkoeffisienter</summary>

For en polynommodell er $A_{ij}=t_i^j$ og $Ac$ modellverdiene i målepunktene.
Hvis $t_i$ ligger tett rundt 1, kan kolonnene ligne hverandre sterkt.
En liten singulærverdi gir da en koeffisientretning $v_i$ med

$$A(c+\alpha v_i)-Ac=\alpha\sigma_i u_i.$$

Store koeffisientendringer kan gi nesten uendrede verdier i målepunktene.
Det forklarer hvorfor god tilpasning ikke alene betyr godt bestemte koeffisienter.

Prøv cellen og sammenlign de to normene. Gjenta med punkter over $[-1,1]$.

```{pyodide-python}
#| label: week7-polynomial
nodes = np.linspace(.95,1.05,12)
P = np.vander(nodes,4,increasing=True)
U, s, Vt = np.linalg.svd(P,full_matrices=False)
dc = Vt[-1]
print('Koeffisientendring:',np.linalg.norm(dc))
print('Endring i modellverdier:',np.linalg.norm(P@dc))
print('Singulærverdier:',s)
```

QR fra uke 4 unngår å danne normallikningene, men kan ikke fjerne
følsomheten som allerede ligger i problemet. For full kolonnerang er
$\kappa_2(A^TA)=\kappa_2(A)^2$. Dette følger av egenverdiene $\sigma_i^2$.
Bedre skalering/basis kan hjelpe; mer presis aritmetikk alene reparerer ikke
usikre måledata.

</details>

<details class="learning-extension">
<summary>Videre: minste kvadrater, pseudoinvers og prekondisjonering</summary>

Sett $z=V^Tx$ og $c=U^Tb$. Ortogonalitet bevarer lengder, så
$\|Ax-b\|_2=\|\Sigma z-c\|_2$. For $i\leq r$ minimerer vi ved
$z_i=c_i/\sigma_i$. Komponentene $c_{r+1},\ldots,c_m$ kan ikke tilpasses.
Frie inputkoordinater settes til null for å få løsningen med minst norm:

$$x^+=\sum_{i=1}^r\frac{u_i^Tb}{\sigma_i}v_i.$$

Dette er pseudoinversløsningen. Å utelate små positive singulærverdier gir
en **trunkert SVD-løsning**, en form for regularisering. Vi aksepterer da
at noen data ikke tilpasses helt for å begrense forsterkningen av støy.

I uke 6 endret prekondisjonering geometrien som den iterative metoden så.
For SPD-systemer er singulærverdier og egenverdier de samme; et stort
forhold gir avlange nivåkurver. I symmetrisk prekondisjonering studerer vi
$M^{-1/2}AM^{-1/2}$, ikke ukritisk egenverdiene til en vilkårlig matrise.
Prekondisjonering endrer løsningsprosessen. Trunkering endrer hvilke
komponenter av løsningen vi forsøker å rekonstruere.

</details>

## 7.5 Rang som et valg

<div id="uke7-rang"></div>

### Felles forsøk — hva koster én komponent?

En komponent er $\sigma_i u_i v_i^T$. For et $96\times96$-bilde:
Hvor mange tall trenger vi til én slik komponent hvis vi lagrer begge
vektorene og singulærverdien? Hvor mange til 20? Sammenlign med alle pikslene.

### Bygg teorien fra komponentene

Matrisemultiplikasjonen i SVD kan skrives

$$A=\sum_{i=1}^r\sigma_i u_i v_i^T,\qquad
A_k=\sum_{i=1}^k\sigma_i u_i v_i^T.$$

Hver ikke-null komponent har rang 1: alle kolonnene er multipler av $u_i$.
$A_k$ har rang høyst $k$. I Frobeniusnorm er den en beste tilnærming blant
alle matriser med rang høyst $k$:

$$\boxed{\|A-A_k\|_F^2=\sum_{i=k+1}^{p}\sigma_i^2},
\qquad p=\min(m,n).$$

Her er $\|B\|_F^2=\sum_{i,j}B_{ij}^2$. Vi oppgir optimalitetsteoremet;
vi skal kunne tolke og kontrollere feilformelen.

```{pyodide-python}
#| label: week7-tail
A = portrait
U,s,Vt = np.linalg.svd(A,full_matrices=False)
k = 20
Ak = (U[:,:k]*s[:k]) @ Vt[:k,:]
print('Direkte feil²:',np.linalg.norm(A-Ak,'fro')**2)
print('Halen av s²:',np.sum(s[k:]**2))
print('Parameterandel:',k*(sum(A.shape)+1)/A.size)
```

<details class="reading-step">
<summary>Hvorfor summerer vi kvadrater? Og hva betyr lagringsgevinsten?</summary>

Rang-én-matrisene $u_i v_i^T$ er ortonormale for Frobeniusindreproduktet:

$$\langle u_i v_i^T,u_j v_j^T\rangle_F
=(u_i^Tu_j)(v_i^Tv_j)=\delta_{ij}.$$

Pytagoras fra uke 4 gir derfor feilformelen for den utelatte summen.
At ingen annen rang-$k$-matrise gjør det bedre, er et eget teorem
(Eckart–Young); Pytagoras alene beviser ikke hele optimalitetspåstanden.
Ved like singulærverdier kan beste tilnærming være ikke-entydig.

Lagrer vi faktorene, teller vi $k(m+n+1)$ tall mot opprinnelig $mn$.
For $96\times96$ og $k=20$ blir det 3860 mot 9216 tall.
Lagrer vi den rekonstruerte matrisen, trenger vi fortsatt $mn$ tall!
Og tall er ikke bytes: float64-faktorer bruker 8 bytes per tall, mens et
8-bits gråtonebilde bruker én byte per piksel før filkomprimering.
Dette er ikke en sammenligning med PNG eller JPEG.

</details>

## 7.6 Hva betyr «god nok»?

<div id="uke7-prosjekt"></div>

### Felles beslutning — samme budsjett, ulik informasjon

Se bildene, og ranger dem etter hvor godt du tror lav rang vil virke.
Velg deretter **ett felles parameterbudsjett på høyst 25 %** av antall piksler.
Finn største tillatte $k$ med $k(m+n+1)\leq0.25mn$, og sammenlign.

```{pyodide-python}
#| label: week7-budget
images = challenge_images()
show_images(images)
m,n = portrait.shape
k = int(.25*m*n//(m+n+1))
print('Felles rang:',k)
show_images({name:rank_image(A,k) for name,A in images.items()})
```

Velg én detalj som må overleve i et av bildene. Er lav normfeil nok til å
sikre dette? Ta med ett eksempel der «ser enkelt ut» gir feil forventning
om lav rang. Dette er utgangspunktet for [prosjekt 7](project_week7.qmd).

<details class="learning-hint">
<summary>Etter egen vurdering: den diagonale streken</summary>

Den diagonale streken er identitetsmatrisen: alle 96 singulærverdier er 1.
Relativ Frobeniusfeil ved rang $k$ blir $\sqrt{(96-k)/96}$.
Den er enkel å beskrive med ord, men har ingen foretrukne små SVD-komponenter
å kaste. SVD-komprimering utnytter bestemte lineære sammenhenger, ikke enhver
form for visuell enkelhet.

</details>

<details class="reading-step">
<summary>Sjekk deg selv og se forbindelsen til optimering</summary>

Forklar uten kode: hvorfor to basiser? Hvorfor deler inversjon på $\sigma_i$?
Hva er forskjellen mellom null og nesten null? Hvorfor kan samme rang gi
svært ulik feil i to bilder?

I kommende uker vil vi minimere funksjoner. For
$f(x)=\tfrac12\|Ax-b\|_2^2$ er gradienten $A^T(Ax-b)$ og Hessianen $A^TA$.
Dermed gir $v_i$ retninger med krumning $\sigma_i^2$. Små singulærverdier
betyr flate retninger: store endringer i $x$ gir liten endring i modellen.
Dette knytter dagens geometri til gradientmetoden og nivåkurvene fra uke 6.

</details>

:::
