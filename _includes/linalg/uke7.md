<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 7.0 Oversikt

<div id="uke7-start"></div>

### Hvilken informasjon bevares når vi forenkler?

Et bilde kan forenkles til noen få mønstre. En måling kan gjøre enkelte
forskjeller nesten usynlige. SVD hjelper oss å forklare begge deler.
Geometrien til **lineære transformasjoner** gir inngangen: hva endres,
hva bevares, og hva kan vi rekonstruere etterpå?

**Forelesning** starter med forsøk og samtale om det vi ser.
**Gå i dybden** åpner forklaringene, håndregningen og forbindelsene
som gjør observasjonene til matematikk. Du kan også åpne hver forklaring separat.

- [Et bilde med få byggeklosser](#uke7-bilde): en forbindelse til basis og koordinater.
- [Fra sirkel til ellipse](#uke7-geometri): se hvilke retninger som strekkes.
- [To basiser](#uke7-svd): forstå singulærverdidekomposisjonen, forkortet SVD.
- [Usikre data](#uke7-kondisjon): knytt strekk til kondisjonering og residual.
- [Velg hva som beholdes](#uke7-rang): sammenlign rang, feil og bildedetaljer.

Etter uken skal du kunne tolke $Av_i=\sigma_i u_i$, bruke en ferdig beregnet
SVD til å forenkle en matrise, og forklare hvorfor små singulærverdier gjør
rekonstruksjon følsom. Selve SVD-beregningen gjør vi med et bibliotek.

## 7.1 Et bilde som en sum av mønstre

<div id="uke7-bilde"></div>

### Prøv først — hvor lite trenger vi?

Kjør cellen og se samme bilde med 1, 5 og 20 **komponenter**, altså
byggemønstre som legges sammen. Bytt deretter ett av tallene og prøv igjen.
Vi undersøker bildene før vi forklarer hvordan komponentene beregnes.

```{pyodide-python}
#| label: week7-first-image
# rank_image beholder de k første SVD-leddene i bildet.
# Se etter hvilke detaljer som forsvinner først; få ledd trenger ikke bevare alt viktig.

show_images({'original': portrait, **{f'{k} komponenter': rank_image(portrait,k) for k in (1,5,20)}})
```

**Snakk sammen:** Hvilken detalj kommer tilbake først? Hva er fortsatt
utydelig? Ville det samme antallet komponenter vært nok til en diagonal
strek eller tilfeldig støy?

### Fra vektorer til bildemønstre

I tidligere uker skrev vi en vektor som en sum av **basisvektorer** med
**koordinater** som vekter. Nå kan vi tenke tilsvarende om et bilde:
vi legger sammen faste bildemønstre, med ett tall som vekt for hvert mønster.
Vi skifter dermed fra «hva er lysstyrken i hver piksel?» til
«hvor mye trenger vi av hvert mønster?».

SVD finner mønstre som er tilpasset akkurat dette bildet. Hvert mønster
bygges av én loddrett og én vannrett profil. Den vannrette profilen bestemmer
hvor sterkt den samme loddrette profilen skal gjentas i hver kolonne.
Et slikt mønster har **rang 1**: alle kolonnene ligger langs én og samme
vektorretning. Den første komponenten er derfor et helt bildemønster,
ikke én piksel eller én bildeflate som er klippet ut.

Når vi beholder få komponenter, bruker vi færre av disse mønstrene.
Noen lysstyrkeforskjeller bevares godt, mens andre blir borte.
Mønstrene er en slags bildebyggeklosser; vi skal se både hvordan de lages
og hvorfor denne forbindelsen til basis er nyttig.

<details class="reading-step">
<summary>Gå i dybden: se én byggekloss og knytt den til basis</summary>

Bildet er en $96\times96$-matrise $A$. Hvert element er en lysstyrke mellom
0 og 1. En enkelt komponent har formen $\sigma_i u_i v_i^T$:
$u_i$ er en kolonnevektor med den loddrette profilen, $v_i^T$ en radvektor
med den vannrette, og $\sigma_i$ er vekten. Vi forklarer hvordan SVD velger
disse i 7.2–7.3.

Produktet $u_i v_i^T$ kalles et **ytreprodukt**. Element $(j,\ell)$ er
$(u_i)_j(v_i)_\ell$. Dermed er kolonne $\ell$ lik $(v_i)_\ell u_i$,
og en ikke-null slik matrise har rang 1.

Prøv først for hånd med $u=(1,2)^T$ og $v=(1,0,-1)^T$.
Skriv de tre kolonnene i $uv^T$, og forklar hvorfor matrisen har rang 1.

**Slik kan du tenke:** Kolonnene er $u$, nullvektoren og $-u$:

$$uv^T=\begin{bmatrix}1&0&-1\\2&0&-2\end{bmatrix}.$$

Det finnes bare én uavhengig kolonneretning. I et faktisk bilde kan både
profiler og komponenter ha negative elementer. De er bidrag til summen,
og trenger ikke hver for seg være vanlige gråtonebilder.

```{pyodide-python}
#| label: week7-building-block
# Ett SVD-ledd er en loddrett profil ganger en vannrett profil, skalert med sigma_i.
# Indekser starter på 0 i Python; i=1 velger derfor det andre leddet.
# Fargene viser positive og negative bidrag, ikke et ferdig gråtonebilde.

U_img,s_img,Vt_img = np.linalg.svd(portrait,full_matrices=False)
i = 1  # 0 er første komponent; prøv også 2 og 3.
# Ytreproduktet lager én verdi per piksel fra de to endimensjonale profilene.
component = s_img[i]*np.outer(U_img[:,i],Vt_img[i,:])
fig,ax = plt.subplots(1,3,figsize=(10,3))
ax[0].plot(U_img[:,i]); ax[0].set_title('Loddrett profil')
ax[1].plot(Vt_img[i,:]); ax[1].set_title('Vannrett profil')
limit = np.max(np.abs(component))
ax[2].imshow(component,cmap='RdBu_r',vmin=-limit,vmax=limit)
ax[2].set_title('Produkt × vekt'); ax[2].axis('off')
plt.tight_layout(); plt.show()
```

En presisering av basisbildet: med ortonormale basiser $u_1,\ldots,u_m$
og $v_1,\ldots,v_n$ utgjør **alle** $mn$ matriser $u_i v_j^T$ en basis
for rommet av $m\times n$-matriser. SVD velger basisene slik at akkurat
$A$ bare trenger de diagonale mønstrene $u_i v_i^T$. Disse alene er vanligvis
ikke en basis for alle bilder. Vi kommer tilbake til ortogonalitet mellom
bildemønstre i 7.5.

Portrett: [NTNU, mm.gif](https://wiki.math.ntnu.no/_media/imax3011/2025h/mm.gif),
tilpasset til $96\times96$ gråtoner. Vi sentrerer ikke bildet.
Alle gråtonebilder vises med samme skala; visningen metter verdier utenfor
$[0,1]$, men feilberegningene bruker tallene uten klipping.

</details>

## 7.2 Fra sirkel til ellipse

<div id="uke7-geometri"></div>

### Prøv først — følg en retning gjennom transformasjonen

I forsøket nedenfor er alle startpunktene på en **enhetssirkel**: de
representerer vektorer med lengde 1. Velg **Ellipse** og flytt den rosa
prikken rundt sirkelen i rute 1. Følg den rosa vektoren helt til rute 4.
Retningsskyverne kan også brukes med tastaturet.

- I hvilke startretninger blir resultatvektoren lengst og kortest?
- Velg **Smal ellipse**. Hva blir vanskeligere å skille i resultatet?
- Velg **Rangtap**. Kan ulike startvektorer nå gi samme resultat?

Se først på rute 1 og 4. De to mellomrutene undersøker vi i neste fane.
En **dreiing** snur alle retninger like mye; en **speiling** vender
orienteringen som i et speil. Begge bevarer lengder og vinkler.

<iframe src="../assets/svd-visualizer.html" title="Interaktivt SVD-forsøk: følg retninger fra sirkel til ellipse" loading="lazy" style="width:100%;height:920px;border:1px solid #d4e0e7;border-radius:6px;"></iframe>

[Åpne forsøket i eget vindu](../assets/svd-visualizer.html){target="_blank" rel="noopener"}.

### Sett ord på det du ser

Den lengste og korteste halvaksen i ellipsen viser største og minste
**strekkfaktor**. Disse tallene kalles **singulærverdier**. Vi skriver
$\sigma_1$ for den største og $\sigma_2$ for den minste. De er aldri negative:
en vending av retningen hører til basisretningene, ikke til strekkfaktoren.

Blå og fiolett viser to vinkelrette startretninger. De kalles **høyre
singulærvektorer**, $v_1$ og $v_2$. De tilsvarende enhetsretningene i
resultatrommet kalles **venstre singulærvektorer**, $u_1$ og $u_2$.
Ordene «høyre» og «venstre» viser til plasseringen i faktoriseringen vi
snart skal se. Koblingen er

$$\boxed{Av_i=\sigma_i u_i}.$$

Start langs $v_i$, så ligger resultatet langs $u_i$ og har lengde $\sigma_i$.
Ved en positiv, men liten strekkfaktor blir forskjeller små. Ved strekkfaktor
null forsvinner all informasjon om den startkomponenten: dette er **nullrommet**
fra uke 3. Lengde og vinkel trenger ikke bevares av hele transformasjonen,
selv om dreie- og speiltrinnene bevarer begge deler.

<details class="reading-step">
<summary>Gå i dybden: finn største og minste strekk for hånd</summary>

Eksempelet **Ellipse** bruker

$$A=\begin{bmatrix}0&2\\1&0\end{bmatrix}.$$

Beregn først $Ax$ for $x=e_1$, $e_2$ og $(1,1)^T/\sqrt2$. Her er
$e_1=(1,0)^T$ og $e_2=(0,1)^T$ standardbasisvektorene. Alle tre har lengde 1.
Hvilket resultat blir lengst? Forklar så hvorfor ingen annen enhetsvektor
kan gi større lengde enn 2 eller mindre enn 1.

**Slik kan du tenke:** $Ae_1=e_2$, $Ae_2=2e_1$ og
$A(1,1)^T/\sqrt2=(2,1)^T/\sqrt2$, med lengder $1$, $2$ og $\sqrt{5/2}$.
For en generell enhetsvektor $x=(a,b)^T$ har vi $a^2+b^2=1$, så

$$Ax=(2b,a)^T,\qquad \|Ax\|_2^2=4b^2+a^2=1+3b^2.$$

Symbolet $\|x\|_2$ er vektorens vanlige euklidske lengde,
$\sqrt{x_1^2+\cdots+x_n^2}$. Resultatlengden ligger mellom 1 og 2.
Setter vi nedre venstre matriseelement til $s\in[0,1]$, blir
$\|Ax\|_2^2=4b^2+s^2a^2$. Minste strekkfaktor er da $s$.
Ved $s=0$ er alle vektorer langs $e_1$ i nullrommet, og ellipsen
blir et linjestykke.

Når strekkfaktorene er like, finnes flere mulige ortonormale
singulærvektorbasiser. Retninger kan derfor skifte brått i en visualisering
selv om transformasjonen endres lite. Ved $\sigma_i=0$ bestemmer
$Av_i=0$ ingen bestemt $u_i$; vi fullfører resultatbasis med en
vinkelrett enhetsvektor.

Forsøket er tilpasset fra [den opprinnelige SVD-demoen](https://andreyac.folk.ntnu.no/svd_complete.html).
Originalen viser også de numeriske faktorene og produkter med basisvektorene.

</details>

## 7.3 To basiser, én enkel operasjon

<div id="uke7-svd"></div>

### Prøv først — hvor endres lengden?

Gå tilbake til forsøket, velg **Skråstilling**, og følg én farge gjennom
**alle fire rutene**. Skråstillingen forskyver punkter horisontalt med
en avstand som avhenger av høyden. Mellom hvilke ruter endres vektorens lengde?
Hva skjer med den blå og den fiolette retningen når de uttrykkes i
nye koordinater? Prøv deretter et negativt matriseelement.

**Snakk sammen:** Hvordan kan en transformasjon som både endrer vinkler
og lengder settes sammen av noen trinn som bevarer begge deler,
og ett som strekker langs aksene?

### SVD er et valg av koordinater på hver side

Vi så geometrisk at transformasjonen kunne deles i koordinatskift og strekk.
Nå skriver vi trinnene som matriseprodukter. Det gir en algebraisk beskrivelse
som lar oss beregne retningene, strekkfaktorene og effekten på en vilkårlig vektor.

Fra uke 4 kjenner vi en **ortonormal basis**: vektorene er vinkelrette
og har lengde 1. Koordinaten langs en slik basisvektor $v_i$ er
indreproduktet $v_i^Tx$. SVD bruker én ortonormal basis for startvektorene
og én for resultatvektorene.

**Singulærverdidekomposisjonen**, eller **SVD**, skriver en reell matrise som

$$\boxed{A=U\Sigma V^T}.$$

Her er $V$ matrisen med startbasisvektorene $v_i$ som kolonner, $U$ har
resultatbasisvektorene $u_i$ som kolonner, og $\Sigma$ har
singulærverdiene på diagonalen og null ellers. Bokstaven $\Sigma$ leses
«sigma». Transponering, $V^T$, bytter rader og kolonner.

| Del | Hva betyr den? | Hva bevares eller endres? |
|---|---|---|
| $V^Tx$ | Finn koordinatene til startvektoren i basisen $v_i$. | Lengder og vinkler bevares. |
| $\Sigma(V^Tx)$ | Gang hver koordinat med dens strekkfaktor. | Lengder endres; en nullfaktor fjerner en komponent. |
| $U(\Sigma V^Tx)$ | Bygg resultatet med basisvektorene $u_i$. | Lengder og vinkler bevares i dette trinnet. |

Faktoriseringen endrer altså ikke transformasjonen $x\mapsto Ax$.
Den beskriver den med koordinater som gjør strekk og informasjonstap tydelig.
Vi kan bruke SVD også når en matrise er rektangulær og start- og resultatrommet
har forskjellig dimensjon.

<details class="reading-step">
<summary>Gå i dybden: utfør de tre trinnene for hånd</summary>

Bruk $A=\begin{bmatrix}0&2\\1&0\end{bmatrix}$ og $x=(3,4)^T$.
Velg $v_1=e_2$, $v_2=e_1$, $u_1=e_1$ og $u_2=e_2$.
Skriv først $x$ i $v$-basisen, skaler koordinatene med 2 og 1, og bygg
resultatet i $u$-basisen. Kontroller med direkte matrisemultiplikasjon.

**Slik kan du tenke:** $x=4v_1+3v_2$, og derfor
$Ax=8u_1+3u_2=(8,3)^T$. Samlet blir faktorene

$$U=I,\qquad \Sigma=\begin{bmatrix}2&0\\0&1\end{bmatrix},\qquad
V=\begin{bmatrix}0&1\\1&0\end{bmatrix}.$$

De tre trinnene er

$$x\ \xrightarrow{V^T}\ \begin{bmatrix}4\\3\end{bmatrix}
\ \xrightarrow{\Sigma}\ \begin{bmatrix}8\\3\end{bmatrix}
\ \xrightarrow{U}\ Ax.$$

For en full SVD av en $m\times n$-matrise er $U$ av størrelse
$m\times m$, $V$ er $n\times n$, og $\Sigma$ er $m\times n$.
Vi har $U^TU=I_m$ og $V^TV=I_n$, der $I_m$ og $I_n$ er identitetsmatriser.
Dette er grunnen til at koordinatskiftene bevarer indreprodukt og lengde.
De $p=\min(m,n)$ diagonalverdiene ordnes
$\sigma_1\geq\cdots\geq\sigma_p\geq0$.

</details>

<details class="reading-step">
<summary>Gå i dybden: forbindelsen til egenverdier fra uke 5</summary>

En egenvektor til $A$ oppfyller $Av=\lambda v$: resultatet ligger langs
samme vektorretning. SVD tillater forskjellige start- og resultatretninger,
også i rom med ulik dimensjon. Derfor er singulærverdier og egenverdier
ikke generelt det samme.

Sett inn faktoriseringen og bruk $U^TU=I$:

$$A^TA=(U\Sigma V^T)^T(U\Sigma V^T)
=V\Sigma^TU^TU\Sigma V^T=V\Sigma^T\Sigma V^T.$$

Matrisen $A^TA$ er symmetrisk og **positiv semidefinit**:
$x^TA^TAx=\|Ax\|_2^2\geq0$. Den har derfor en ortonormal egenvektorbasis
og ikke-negative egenverdier. Vektorene $v_i$ kan velges som disse
egenvektorene, og tilhørende egenverdier er $\sigma_i^2$, med eventuelle
ekstra nullverdier når $n>m$. For $\sigma_i>0$ setter vi $u_i=Av_i/\sigma_i$.
Da er

$$u_i^Tu_j=\frac{v_i^TA^TAv_j}{\sigma_i\sigma_j}
=\frac{\sigma_j^2 v_i^Tv_j}{\sigma_i\sigma_j},$$

som er 1 når $i=j$ og 0 ellers. Dette forklarer hvorfor også de valgte
resultatretningene er ortonormale. Vi fullfører med ortonormale vektorer
om nødvendig.

En **symmetrisk positiv definit matrise**, forkortet SPD, er symmetrisk og
oppfyller $x^TAx>0$ for alle $x\ne0$. For en slik matrise kan vi velge
$U=V$ og $\sigma_i=\lambda_i$. Dette knytter SVD til geometrien i uke 6.

Vi bruker `np.linalg.svd(A)` i beregninger. Vi danner ikke $A^TA$ for å
finne en generell SVD: avrunding kan skjule de minste singulærverdiene.
I 7.4 ser vi også hvorfor dette kvadrerer forholdet mellom største og
minste strekk når $A$ har full kolonnerang.

</details>

<details class="reading-step">
<summary>Gå i dybden: rang, kolonnerom, nullrom og NumPy</summary>

La $r$ være antallet positive singulærverdier. **Rangen** er antallet
uavhengige resultatretninger, **kolonnerommet** er alle mulige resultater
$Ax$, og **nullrommet** er startvektorene som gir $Ax=0$. SVD gir

$$\operatorname{rank}(A)=r,\qquad
\operatorname{Col}(A)=\operatorname{span}(u_1,\ldots,u_r),\qquad
\operatorname{Null}(A)=\operatorname{span}(v_{r+1},\ldots,v_n).$$

Her betyr $\operatorname{span}$ alle lineærkombinasjoner av de oppgitte
vektorene. I full SVD er de siste $m-r$ kolonnene i $U$ en basis for
nullrommet til $A^T$. Rangsatsen fra uke 3 blir $r+(n-r)=n$.

Python returnerer `U, s, Vt`: `s` er listen med singulærverdier,
og `Vt` er **allerede transponert**. Med `full_matrices=False` får vi
$p=\min(m,n)$ kolonner i `U` og $p$ rader i `Vt`. Det holder for
rekonstruksjon, men en bred matrise mangler da noen høyre nullromsretninger.
Bruk full SVD når du vil finne en basis for hele nullrommet.

I flyttallsregning bruker vi en terskel i stedet for bare `s > 0`.
En vanlig terskel er $\tau=\max(m,n)\epsilon\sigma_1$, der $\epsilon$
er maskinpresisjonen fra uke 1. Antallet verdier over terskelen kalles
**numerisk rang**. Usikre måledata kan begrunne en større terskel.
Numerisk rang avhenger av toleransen; eksakt rang teller nøyaktig positive
singulærverdier.

</details>

## 7.4 Små datafeil, store løsningsfeil

<div id="uke7-kondisjon"></div>

### Prøv først — samme dataendring, to utfall

Kjør forsøket. Vi starter med en kjent løsning, lager data, og endrer
én datakomponent om gangen med samme lille beløp. **Gjett først:**
Blir løsningsendringen like stor i begge tilfeller?

```{pyodide-python}
#| label: week7-perturbation
# Begge dataendringene har samme lengde, men ulike retninger.
# Vi løser systemet for de ENDREDE dataene og sammenligner med den opprinnelige fasiten.
# En liten residual mot endrede data utelukker ikke en stor løsningsendring.

A = np.array([[0.,2.],[.02,0.]])
x_true = np.ones(2)
b = A @ x_true
for db in (np.array([.01,0]), np.array([0,.01])):
    x = np.linalg.solve(A,b+db)
    print('Dataendring:',db,' Løsningsendring:',x-x_true,
          ' Residual mot målte data:',np.linalg.norm(b+db-A@x))
```

**Snakk sammen:** Begge løsningene passer sine målte data svært godt.
Hvorfor kan den ene likevel være langt fra løsningen vi startet med?
Knytt forskjellen til den smale ellipsen i 7.2.

### Svak informasjon er vanskelig å rekonstruere

I én retning er strekkfaktoren 2; i den andre er den bare 0.02.
Når vi rekonstruerer startvektoren, deler vi på strekkfaktorene. En liten
strekkfaktor betyr dermed stor forsterkning av datafeil langs den
tilhørende resultatretningen. Vi kaller et problem **dårlig kondisjonert**
når små relative dataendringer kan gi store relative løsningsendringer.

**2-normen** er vektorens vanlige euklidske lengde, altså kvadratroten
av summen av de kvadrerte koordinatene. For en invertibel, kvadratisk
matrise måler **kondisjonstallet i 2-norm**
forholdet mellom største og minste strekk:

$$\boxed{\kappa_2(A)=\frac{\sigma_1}{\sigma_n}}.$$

Her er $n$ antall kolonner, og $\sigma_n>0$ er den minste singulærverdien.
I forsøket er forholdet 100. En relativ feil betyr feilens størrelse delt
på lengden til referansevektoren. Kondisjonstallet gir en
øvre grense for hvor mye en relativ datafeil kan forsterkes når bare
høyresiden endres. Retningen betyr noe; ikke alle feil forsterkes like mye.

**Residualen** fra uke 6 er avviket mellom de oppgitte dataene og dataene
beregnet fra løsningen, $b-A\widehat x$. En liten residual viser god
tilpasning til disse dataene. Den kan ikke alene vise at den rekonstruerte
løsningen er nær sannheten når dataene er usikre.

<details class="reading-step">
<summary>Gå i dybden: norm, kondisjonstall og håndregning</summary>

For en vektor er **2-normen** den vanlige lengden,
$\|x\|_2=\sqrt{\sum_i x_i^2}$. Matrisens **spektralnorm**, også kalt
matrisens 2-norm, er den største lengden av $Ax$ når $x$ har lengde 1:

$$\|A\|_2=\max_{\|x\|_2=1}\|Ax\|_2=\sigma_1.$$

Den måler altså største strekk. For invertibel $A$ er
$\|A^{-1}\|_2=1/\sigma_n$, slik at den vanlige normdefinisjonen av
kondisjonstallet blir

$$\kappa_2(A)=\|A\|_2\|A^{-1}\|_2=\sigma_1/\sigma_n.$$

Regn gjennom de to dataendringene fra forsøket for hånd med $x_*=(1,1)^T$
og $b=(2,0.02)^T$.

**Slik kan du tenke:** Likningene er $2x_2=b_1$ og $0.02x_1=b_2$.
En økning på $0.01$ i $b_1$ gir løsningsendringen $(0,0.005)^T$;
samme økning i $b_2$ gir $(0.5,0)^T$. Generelt, hvis dataendringen
$\delta b$ ligger langs $u_i$ og har størrelse $\eta$, blir

$$\delta b=\eta u_i\quad\Longrightarrow\quad
\delta x=\frac{\eta}{\sigma_i}v_i.$$

For $Ax=b\ne0$ og $A(x+\delta x)=b+\delta b$ er
$\delta x=A^{-1}\delta b$. Bruk definisjonen av matrisenormen til å få
$\|\delta x\|_2\leq\|A^{-1}\|_2\|\delta b\|_2$ og
$\|b\|_2\leq\|A\|_2\|x\|_2$. Sammen gir disse

$$\frac{\|\delta x\|_2}{\|x\|_2}
\leq\kappa_2(A)\frac{\|\delta b\|_2}{\|b\|_2}.$$

For en beregnet $\widehat x$, sett $r=b-A\widehat x$ og $e=x-\widehat x$.
Da er $Ae=r$ og $\|e\|_2\leq\|r\|_2/\sigma_n$. Dette gjelder mot
løsningen for **samme** $b$. I forsøket måler vi residualen mot
forstyrrede data, men feilen mot den kjente, uforstyrrede løsningen.

Hvis $\sigma_n=0$, finnes ingen invers; informasjon i nullrommet kan
ikke rekonstrueres entydig. For en rektangulær matrise med full kolonnerang
brukes også forholdet $\sigma_1/\sigma_n$, men følsomheten til et generelt
minste-kvadratersproblem avhenger dessuten av residualen og hvilke data
som forstyrres. Grensen ovenfor gjelder et invertibelt system med bare
forstyrrelser i $b$.

</details>

<details class="reading-step">
<summary>Gå i dybden: nesten like kolonner og polynomtilpasning fra uke 4</summary>

I en polynommodell er $A_{ij}=t_i^j$, der $t_i$ er målepunktene og
$c_j$ er koeffisientene. Produktet $Ac$ gir modellverdiene. Når punktene
ligger tett rundt 1, ligner kolonnene hverandre. Med en liten singulærverdi
kan en stor endring i koeffisientene gi nesten samme modellverdier:

$$A(c+\alpha v_i)-Ac=\alpha\sigma_i u_i.$$

Her angir $\alpha$ størrelsen på koeffisientendringen langs $v_i$.
Kjør cellen og sammenlign de to lengdene. Gjenta med punkter over $[-1,1]$.

```{pyodide-python}
#| label: week7-polynomial
# P sender polynomkoeffisienter til verdier i de valgte punktene, som i uke 4.
# Punktene ligger tett rundt 1; ulike koeffisienter kan gi nesten samme verdier.
# Vi undersøker koeffisientretningen som gir minst endring i verdiene.

nodes = np.linspace(.95,1.05,12)
# Kolonnene er 1, t, t², t³ evaluert i nodes: P @ c gir polynomverdiene.
P = np.vander(nodes,4,increasing=True)
U,s,Vt = np.linalg.svd(P,full_matrices=False)
# Siste rad er høyre singularvektor for minste singulærverdi; lengden er 1.
dc = Vt[-1]
print('Koeffisientendring:',np.linalg.norm(dc))
print('Endring i modellverdier:',np.linalg.norm(P@dc))
print('Singulærverdier:',s)
```

God tilpasning betyr dermed ikke alene at koeffisientene er godt bestemt.
QR-faktorisering fra uke 4 unngår å danne normallikningene
$A^TAc=A^Tb$, men kan ikke fjerne følsomheten i selve problemet.
Ved full kolonnerang er $\kappa_2(A^TA)=\kappa_2(A)^2$, fordi største
og minste egenverdi i $A^TA$ er $\sigma_1^2$ og $\sigma_n^2$.
Bedre skalering eller valg av polynombasis kan hjelpe. Flere sifre i
regningen kan ikke gjenopprette informasjon som målingene ikke gir presist.

</details>

<details class="reading-step">
<summary>Gå i dybden: minste kvadrater, pseudoinvers og regularisering</summary>

Et **minste-kvadratersproblem** søker $x$ som gjør summen av kvadrerte
residualkomponenter, $\|Ax-b\|_2^2$, minst mulig. Hvis flere løsninger
oppnår samme minimum, velger **pseudoinversen** den med minst lengde.
Pseudoinversen betegnes $A^+$; den er definert også for rektangulære og
rangdefekte matriser og er lik $A^{-1}$ når inversen finnes.

Sett $z=V^Tx$ og $c=U^Tb$. Ortonormale koordinatskift bevarer lengden, så
$\|Ax-b\|_2=\|\Sigma z-c\|_2$. La $r$ være antall positive singulærverdier.
For $i\leq r$ får vi minste residual med $z_i=c_i/\sigma_i$.
Komponentene $c_{r+1},\ldots,c_m$ ligger utenfor kolonnerommet og kan
ikke tilpasses. Frie startkoordinater settes til null for minst lengde:

$$x^+=A^+b=\sum_{i=1}^r\frac{u_i^Tb}{\sigma_i}v_i.$$

**Trunkering** betyr å avkorte en sum. En **trunkert SVD-løsning** beholder
bare leddene med de $k$ største singulærverdiene, der $k<r$.
Dette er **regularisering**: vi begrenser tillatte løsningskomponenter
for å få mindre forsterkning av usikre data, selv om datatilpasningen blir
dårligere. Også virkelig signal langs de utelatte retningene går tapt.

**Prekondisjonering** fra uke 6 omformer likningssystemet for at en
iterativ metode skal konvergere bedre, mens den søkte eksakte løsningen
bevares. For en SPD-matrise er singulærverdier og egenverdier de samme;
et stort forhold gir avlange nivåkurver. Ved symmetrisk prekondisjonering
med en SPD-matrise $M$ studerer vi $M^{-1/2}AM^{-1/2}$. Her er $M^{1/2}$
den symmetriske positive definite kvadratroten og $M^{-1/2}$ dens invers.
Trunkering har et annet mål: å begrense hva vi forsøker å rekonstruere
fra usikre data.

</details>

## 7.5 Rang som et valg

<div id="uke7-rang"></div>

### Prøv først — mer detalj, flere tall

Kjør cellen med ulike verdier av `k`. Den viser bildet, antallet tall i
den lagrede faktorrepresentasjonen og en samlet pikselfeil.
**Gjett først:** Vil dobbelt så mange komponenter omtrent halvere feilen?

```{pyodide-python}
#| label: week7-tail
# Vi beholder bare de k største singulærverdiene og tilhørende basisvektorer.
# Endre k og vurder både bildet, feilnormen og antall lagrede tall.
# Antall tall er et parameterbudsjett, ikke størrelsen på en PNG-fil.

A = portrait
U,s,Vt = np.linalg.svd(A,full_matrices=False)
k = 20  # Prøv 5, 10 og 40.
# * skalerer hver U-kolonne; @ summerer de k vektede rang-1-bidragene.
Ak = (U[:,:k]*s[:k]) @ Vt[:k,:]
show_images({'original':A,f'{k} komponenter':Ak})
print('Tall i faktorene:',k*(sum(A.shape)+1),' Mot original:',A.size)
print('Samlet relativ pikselfeil:',np.linalg.norm(A-Ak,'fro')/np.linalg.norm(A,'fro'))
```

**Snakk sammen:** Blir den detaljen dere valgte i 7.1 tydelig i samme tempo
som den samlede feilen blir liten? Hva kan én feilverdi fortelle om et bilde?

### Fra byggeklosser til rangreduksjon

Vi kan nå gi mønstrene fra 7.1 navn. En **komponent** er
$\sigma_i u_i v_i^T$: et rang-1-mønster $u_i v_i^T$ med vekt $\sigma_i$.
Hele bildet og en rekonstruksjon med de $k$ første komponentene er

$$A=\sum_{i=1}^r\sigma_i u_i v_i^T,\qquad
A_k=\sum_{i=1}^k\sigma_i u_i v_i^T.$$

Her er $r$ antall positive singulærverdier. Matrisen $A_k$ har rang høyst $k$.
**Rangreduksjon** betyr å erstatte matrisen med en slik representasjon
med færre uavhengige retninger.

**Frobeniusnormen** måler størrelsen til en matrise som om alle elementene
var lagt i én lang vektor: kvadrer elementene, summer og ta kvadratroten.
Dermed måler $\|A-A_k\|_F$ en samlet pikselfeil, mens
$\|A-A_k\|_F/\|A\|_F$ er den relative feilen fra forsøket.

SVD-rekonstruksjonen er en **beste tilnærming** i Frobeniusnorm blant alle
matriser med rang høyst $k$. Dette er en presis påstand om samlet tallfeil;
den sier ikke at alle detaljer som er viktige for oss blir bevart.

<details class="reading-step">
<summary>Gå i dybden: feilformelen, ortogonalitet og lagring</summary>

For en matrise $B$ er $\|B\|_F^2=\sum_{i,j}B_{ij}^2$.
Vi kan også definere **Frobeniusindreproduktet** som
$\langle B,C\rangle_F=\sum_{i,j}B_{ij}C_{ij}$: gang sammen tilsvarende
elementer og summer. Det gjør basisideen fra 7.1 presis.

Rang-1-mønstrene $u_i v_i^T$ er ortonormale for dette indreproduktet:

$$\langle u_i v_i^T,u_j v_j^T\rangle_F
=(u_i^Tu_j)(v_i^Tv_j).$$

Uttrykket er 1 når $i=j$ og 0 ellers. Pytagoras fra uke 4 gir derfor
kvadrert feil som summen av de utelatte vektene i andre potens:

$$\boxed{\|A-A_k\|_F^2=\sum_{i=k+1}^{p}\sigma_i^2},
\qquad p=\min(m,n).$$

Kontroller formelen med cellen. Den er uavhengig av forrige celles tilstand.

```{pyodide-python}
#| label: week7-tail-check
# Samme feil beregnes på to uavhengige måter: fra bildet og fra utelatte singulærverdier.
# Tallene skal stemme opp til avrunding; det kontrollerer koblingen mellom kode og teori.

A = portrait
U,s,Vt = np.linalg.svd(A,full_matrices=False)
k = 20
# * skalerer hver U-kolonne; @ summerer de k vektede rang-1-bidragene.
Ak = (U[:,:k]*s[:k]) @ Vt[:k,:]
print('Direkte feil²:',np.linalg.norm(A-Ak,'fro')**2)
print('Sum av utelatte vekter²:',np.sum(s[k:]**2))
```

At ingen annen matrise med rang høyst $k$ gir mindre Frobeniusfeil,
er optimalitetsteoremet til Eckart–Young. Pytagoras forklarer feilformelen,
men beviser ikke alene optimaliteten. Ved like singulærverdier kan den
beste tilnærmingen være ikke-entydig.

**Arbeid for hånd:** Et bilde har $m$ rader og $n$ kolonner. Tell hvor
mange tall som kreves for $k$ vektorer $u_i$, $k$ vektorer $v_i$ og
$k$ singulærverdier. Sammenlign $k=20$ for et $96\times96$-bilde
med lagring av alle pikslene.

**Slik kan du tenke:** Én komponent trenger $m+n+1$ tall; $k$ komponenter
trenger $k(m+n+1)$. Her blir det 3860 mot 9216 tall. Lagrer vi den
rekonstruerte matrisen i stedet for faktorene, trenger vi fortsatt $mn$ tall.
Tall er dessuten ikke bytes: float64-faktorer bruker 8 bytes per tall,
et 8-bits gråtonebilde én byte per piksel før filkomprimering.
Denne opptellingen er ikke en sammenligning med PNG eller JPEG.

</details>

## 7.6 Hva betyr «god nok»?

<div id="uke7-prosjekt"></div>

### Prøv først — samme budsjett, ulik informasjon

Se de fire bildene og ranger dem etter hvor godt dere tror lav rang vil
fungere. Kjør så sammenligningen. Koden velger samme antall komponenter
for alle bildene slik at faktorene krever høyst **25 % så mange tall**
som de opprinnelige bildematrisene.

```{pyodide-python}
#| label: week7-budget
# Alle bildene har samme dimensjoner og får samme parameterbudsjett.
# Rang k bestemmes av hva vi har råd til å lagre, ikke av ønsket bildekvalitet.
# Undersøk hvorfor samme rang kan gi svært ulikt resultat.

images = challenge_images()
show_images(images)
m,n = portrait.shape
# Heltallsdivisjon runder ned slik at k*(m+n+1) ikke overskrider budsjettet.
k = int(.25*m*n//(m+n+1))
print('Felles rang:',k)
show_images({name:rank_image(A,k) for name,A in images.items()})
```

**Snakk sammen:** Hvilken forventning ble utfordret? Velg én detalj som
må bevares i et av bildene. Er liten samlet pikselfeil nok til å sikre det?
Forklar hvorfor et bilde kan være enkelt å beskrive med ord og likevel
kreve mange SVD-komponenter. Dette er utgangspunktet for
[prosjekt 7](project_week7.qmd).

<details class="reading-step">
<summary>Gå i dybden: regn på budsjettet og den diagonale streken</summary>

Finn største heltall $k$ som oppfyller $k(m+n+1)\leq0.25mn$ for
$m=n=96$. **Slik kan du tenke:** $0.25\cdot96^2/193\approx11.94$,
så $k=11$ er største tillatte rang.

Den diagonale streken er identitetsmatrisen. Alle 96 singulærverdier er 1,
så den relative Frobeniusfeilen ved rang $k$ er

$$\frac{\|A-A_k\|_F}{\|A\|_F}=\sqrt{\frac{96-k}{96}}.$$

Den er enkel å beskrive, men ingen av SVD-komponentene har mindre vekt
enn de andre. SVD-forenkling utnytter bestemte lineære sammenhenger mellom
rader og kolonner, ikke enhver form for visuell enkelhet.

</details>

<details class="reading-step">
<summary>Gå i dybden: samle trådene og se fram mot optimering</summary>

Forklar med egne ord: Hvorfor bruker SVD to basiser? Hvorfor deler inversjon
på $\sigma_i$? Hva er forskjellen mellom null og nesten null? Hvorfor
kan samme rang gi svært ulik bildefeil?

Forbindelsen til optimering kan uttrykkes med
$f(x)=\tfrac12\|Ax-b\|_2^2$. **Gradienten**, vektoren av førstederiverte,
er $A^T(Ax-b)$. **Hessianen**, matrisen av andrederiverte, er $A^TA$.
Retningen $v_i$ har derfor krumning $\sigma_i^2$. Små singulærverdier gir
flate retninger: store endringer i $x$ gir liten endring i modellen.
Det er den samme geometrien som i nivåkurvene og gradientmetoden fra uke 6.

</details>

:::
