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
**Gå i dybden** åpner utfyllende oppgaver og mellomregninger. De korte
håndeksemplene står i selve teksten, slik at du kan følge veien fra
forsøk til formel også uten å åpne fordypningen.

- [Et bilde med få byggeklosser](#uke7-bilde): en forbindelse til basis og koordinater.
- [Fra sirkel til ellipse](#uke7-geometri): se hvilke retninger som strekkes.
- [To basiser](#uke7-svd): forstå singulærverdidekomposisjonen, forkortet SVD.
- [Usikre data](#uke7-kondisjon): knytt strekk til kondisjonering og residual.
- [Velg hva som beholdes](#uke7-rang): sammenlign rang, feil og bildedetaljer.
- [Pseudoinversen](#uke7-pseudoinvers): en valgfri videreføring av minste kvadrater.

Etter uken skal du kunne tolke $Av_i=\sigma_i u_i$, bruke en ferdig beregnet
SVD til å forenkle en matrise, og forklare hvorfor små singulærverdier gjør
rekonstruksjon følsom. Selve SVD-beregningen gjør vi med et bibliotek.

### Dette bygger vi videre på

I [uke 6](uke6.qmd#uke6-residual) så vi at en liten residual ikke alltid
betyr en liten løsningsfeil. Forklaringen var at matrisen kan strekke
ulike retninger svært forskjellig. Denne uken finner vi nettopp disse
retningene og strekkfaktorene. Det samme verktøyet forteller hvilke
mønstre som bidrar mest i en bildematrise.

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 1: flyttall og avrunding](page2.qmd) | Hva skjer med små feil når vi deler på et svært lite tall? |
| [Uke 2: fikspunktiterasjon](page4.qmd) | Er en liten endring i beregningen nok til å stole på svaret? |
| [Uke 3: basis, kolonnerom og nullrom](uke3.qmd#uke3-del3) | Hvilke deler av startvektoren kan vi finne igjen fra resultatet? |
| [Uke 4: ortogonalitet og minste kvadrater](uke4.qmd) | Kan gode koordinater gjøre tilpasningen enklere? |
| [Uke 5: egenverdier](uke5.qmd) | Hvilke spesielle retninger finnes når matrisen også kan være rektangulær? |
| [Uke 6: norm, residual og kondisjonstall](uke6.qmd#uke6-residual) | Hvordan finner vi største og minste strekk i praksis? |

## 7.1 Et bilde som en sum av mønstre

<div id="uke7-bilde"></div>

### Eksperiment 1 – hvor lite trenger vi?

Her bygger vi opp det samme bildet med stadig flere SVD-mønstre. Hvert
mønster bidrar til mange piksler samtidig, så antallet mønstre sier noe
om hvor mye informasjon vi beholder. Forsøket gir oss et konkret spørsmål
å ta med videre: Hvorfor kan noen få bidrag gjengi hovedtrekkene i et
bilde, mens små detaljer krever flere?

Kjør cellen og se samme bilde med 1, 5 og 20 **komponenter**, altså
byggemønstre som legges sammen. Bytt deretter ett av tallene og prøv igjen.
Hvilke detaljer kan dere gjenkjenne med få komponenter, og hvilke krever flere?

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

### Én byggekloss, regnet for hånd

Bildet er en $96\times96$-matrise $A$. Hvert element er en lysstyrke mellom
0 og 1. En enkelt komponent har formen $\sigma_i u_i v_i^T$:
$u_i$ er en kolonnevektor med den loddrette profilen, $v_i^T$ en radvektor
med den vannrette, og $\sigma_i$ er vekten. Hvordan disse profilene og vektene henger sammen med geometrien,
undersøker vi i 7.2–7.3.

Produktet $u_i v_i^T$ kalles et **ytreprodukt**. Element $(j,\ell)$ er
$(u_i)_j(v_i)_\ell$. Dermed er kolonne $\ell$ lik $(v_i)_\ell u_i$,
og en ikke-null slik matrise har rang 1.

**Prøv selv:** Bruk $u=(1,2)^T$ og $v=(1,0,-1)^T$.
Skriv de tre kolonnene i $uv^T$, og forklar hvorfor matrisen har rang 1.

**Regnegangen:** Kolonnene er $u$, nullvektoren og $-u$:

$$uv^T=\begin{bmatrix}1&0&-1\\2&0&-2\end{bmatrix}.$$

**Hva forklarer dette?** I [uke 3](uke3.qmd#uke3-del3) telte vi
uavhengige kolonner for å finne rang. Her er andre kolonne null og tredje
kolonne minus den første. Kolonnerommet er derfor linjen spent ut av
$(1,2)^T$, selv om matrisen har seks elementer. Vi kan lagre de to profilene
og bygge alle seks elementene fra dem.

Disse profilene er ikke normaliserte. Hvis vi vil skrive akkurat dette
produktet som ett SVD-ledd, bruker vi enhetsvektorene
$\widehat u=u/\sqrt5$ og $\widehat v=v/\sqrt2$. Da blir
$uv^T=\sqrt{10}\,\widehat u\widehat v^T$: lengdene flyttes inn i vekten.

I et faktisk bilde kan både
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


## 7.2 Fra sirkel til ellipse

<div id="uke7-geometri"></div>

### Eksperiment 2 – følg en retning gjennom transformasjonen

En matrise sender hver startvektor til en ny vektor. Her lar vi alle
startvektorene ha lengde 1, slik at forskjeller i resultatlengde bare
skyldes matrisen og retningen vi velger. Sirkelen blir en ellipse, og
halvaksene gjør største og minste strekk synlige. Det gir en geometrisk
inngang til både singulærverdier og tap av informasjon.

Startpunktene ligger på en **enhetssirkel**. Velg **Ellipse** og flytt den rosa
prikken rundt sirkelen i rute 1. Følg den rosa vektoren helt til rute 4.
Retningsskyverne kan også brukes med tastaturet.

- I hvilke startretninger blir resultatvektoren lengst og kortest?
- Velg **Smal ellipse**. Hva blir vanskeligere å skille i resultatet?
- Velg **Rangtap**. Kan ulike startvektorer nå gi samme resultat?

Se først på rute 1 og 4. De blå og fiolette pilene er merket $v_1$,
$v_2$ ved starten og $\sigma_1u_1$, $\sigma_2u_2$ ved resultatet.
Matrisene under diagrammet oppdateres når du flytter skyverne.
De to mellomrutene og faktorene undersøker vi i neste fane.
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

### Finn største og minste strekk for hånd

Eksempelet **Ellipse** bruker

$$A=\begin{bmatrix}0&2\\1&0\end{bmatrix}.$$

Beregn først $Ax$ for $x=e_1$, $e_2$ og $(1,1)^T/\sqrt2$. Her er
$e_1=(1,0)^T$ og $e_2=(0,1)^T$ standardbasisvektorene. Alle tre har lengde 1.
Hvilket resultat blir lengst? Forklar så hvorfor ingen annen enhetsvektor
kan gi større lengde enn 2 eller mindre enn 1.

**Regnegangen:** $Ae_1=e_2$, $Ae_2=2e_1$ og
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
Under diagrammet kan du lese faktorene $A=U\Sigma V^T$, basisvektorene
i $V$ og koordinatene til de to valgte vektorene i hvert trinn.


## 7.3 To basiser, én enkel operasjon

<div id="uke7-svd"></div>

### Eksperiment 3 – hvor endres lengden?

Nå undersøker vi mellomtrinnene i den samme transformasjonen. SVD deler
matriseproduktet i to koordinatskift og ett strekk langs aksene. Ved å
følge én vektor og dens tallverdier gjennom alle tre operasjonene kan vi
se hva hver faktor gjør. Målet er å forstå hvorfor produktet
$U\Sigma V^T$ beskriver akkurat samme transformasjon som $A$.

Gå tilbake til forsøket, velg **Skråstilling**, og følg én farge gjennom
**alle fire rutene**. Skråstillingen forskyver punkter horisontalt med
en avstand som avhenger av høyden. Mellom hvilke ruter endres vektorens lengde?
Hva skjer med den blå og den fiolette retningen når de uttrykkes i
nye koordinater? Prøv deretter et negativt matriseelement.

Velg så **Ellipse**, og sett den rosa retningen til $0^\circ$, altså
$x=(1,0)^T$. Bruk matrisene under diagrammet til å regne
$V^Tx$, deretter $\Sigma(V^Tx)$ og til slutt $U(\Sigma V^Tx)$.
Sammenlign med tallene i raden **Rosa** og med direkte beregning av $Ax$.
SVD-basisvektorene kan ha andre fortegn enn dem vi velger i håndregningen;
bruk faktorene som faktisk vises. Sluttresultatet skal være det samme.

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

La oss først bruke basisideen fra [uke 3](uke3.qmd#uke3-del2).
For en $2\times2$-matrise kan vi skrive

$$x=(v_1^Tx)v_1+(v_2^Tx)v_2.$$

Hvert indreprodukt er ett tall: hvor mye av $x$ som ligger langs den
valgte retningen, slik vi målte komponenter i [uke 4](uke4.qmd#uke4-retning).
Linearitet og $Av_i=\sigma_i u_i$ gir så

$$Ax=(v_1^Tx)Av_1+(v_2^Tx)Av_2
=\sigma_1(v_1^Tx)u_1+\sigma_2(v_2^Tx)u_2.$$

Vi har dermed funnet en oppskrift: mål to koordinater, gang med hver sin
strekkfaktor, og legg sammen to bidrag i resultatrommet. Matriseformen
samler bare denne oppskriften i ett uttrykk.
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

### De tre trinnene for hånd

Bruk $A=\begin{bmatrix}0&2\\1&0\end{bmatrix}$ og $x=(3,4)^T$.
Velg $v_1=e_2$, $v_2=e_1$, $u_1=e_1$ og $u_2=e_2$.
Skriv først $x$ i $v$-basisen, skaler koordinatene med 2 og 1, og bygg
resultatet i $u$-basisen. Kontroller med direkte matrisemultiplikasjon.

**Regnegangen:** $x=4v_1+3v_2$, og derfor
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


### Hvorfor bruker vi ikke bare egenverdiene fra uke 5?

En egenvektor oppfyller $Av=\lambda v$ og beholder linjen sin.
Singulærvektorer beskriver i stedet et par retninger:
$Av_i=\sigma_i u_i$. Startretningen og resultatretningen trenger ikke
være den samme. Dermed kan vi også beskrive en matrise som sender
vektorer fra $\mathbb R^3$ til $\mathbb R^2$, der en egenverdilikning
for selve matrisen ikke gir mening.

For eksempelet vårt er

$$A^TA=\begin{bmatrix}1&0\\0&4\end{bmatrix}.$$

Egenverdiene til $A^TA$ er 1 og 4. Kvadratrøttene gir strekkfaktorene
1 og 2, og egenvektorene gir startretningene $e_1$ og $e_2$.
Egenverdiene til $A$ selv er derimot $\pm\sqrt2$.
**Kontroller dette ved å sette $\det(A-\lambda I)=0$.**

For de symmetriske positivt definite matrisene fra uke 6 er situasjonen
enklere: da kan vi bruke samme basis på begge sider, og
$\sigma_i=\lambda_i>0$. Kondisjonstallet fra uke 6 er altså et
spesialtilfelle av forholdet mellom største og minste singulærverdi.

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

### Hva forteller SVD om rommene fra uke 3?

La $r$ være antallet positive singulærverdier. **Rangen** er antallet
uavhengige resultatretninger, **kolonnerommet** er alle mulige resultater
$Ax$, og **nullrommet** er startvektorene som gir $Ax=0$. SVD gir

$$\operatorname{rank}(A)=r,\qquad
\operatorname{Col}(A)=\operatorname{span}(u_1,\ldots,u_r),\qquad
\operatorname{Null}(A)=\operatorname{span}(v_{r+1},\ldots,v_n).$$

Her betyr $\operatorname{span}$ alle lineærkombinasjoner av de oppgitte
vektorene. I full SVD er de siste $m-r$ kolonnene i $U$ en basis for
nullrommet til $A^T$. Rangsatsen fra uke 3 blir $r+(n-r)=n$.

**Et lite rektangulært eksempel:** La

$$B=\begin{bmatrix}2&0&0\\0&0&0\end{bmatrix},\qquad
Bx=\begin{bmatrix}2x_1\\0\end{bmatrix}.$$

Bare $x_1$ påvirker resultatet. Kolonnerommet er linjen spent ut av
$(1,0)^T$ i $\mathbb R^2$, mens nullrommet er planet spent ut av
$(0,1,0)^T$ og $(0,0,1)^T$ i $\mathbb R^3$.
Her kan vi velge $U=I_2$, $V=I_3$ og $\Sigma=B$.
De to diagonalverdiene er 2 og 0, men nullrommet har **to** dimensjoner:
den tredje startkoordinaten forsvinner også. Rangsatsen gir $1+2=3$.
Dette er forskjellen mellom antall oppførte singulærverdier og antall
retninger i startrommet.

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


## 7.4 Små datafeil, store løsningsfeil

<div id="uke7-kondisjon"></div>

### Løs baklengs, én koordinat om gangen

I [uke 6.3](uke6.qmd#uke6-residual) skilte vi mellom residualen og
feilen i de ukjente. Nå kan vi se årsaken direkte i to likninger.
Bytt det nederste venstre elementet i eksempelet vårt fra 1 til $0.02$:

$$A=\begin{bmatrix}0&2\\0.02&0\end{bmatrix},\qquad
Ax=b\quad\Longleftrightarrow\quad
2x_2=b_1,\quad 0.02x_1=b_2.$$

For $b=(2,0.02)^T$ er løsningen $x=(1,1)^T$.
**Øk først $b_1$ med $0.01$, og deretter bare $b_2$ med samme beløp.
Hvilken ukjent endres mest?**

| Endring i data | Regning | Endring i løsningen |
|:--|:--|:--|
| $b_1: 2\to2.01$ | $x_2=2.01/2=1.005$ | $\delta x=(0,0.005)^T$ |
| $b_2: 0.02\to0.03$ | $x_1=0.03/0.02=1.5$ | $\delta x=(0.5,0)^T$ |

Vi deler på 2 i det første tilfellet og på $0.02$ i det andre.
Like store dataendringer gir derfor løsningsendringer som skiller med
en faktor 100. Begge nye løsninger oppfyller sine endrede likninger
nøyaktig. Det er selve rekonstruksjonen som er følsom, selv med eksakt regning.
Avrundingsfeil fra [uke 1](page2.qmd) kan forsterkes på samme måte som
målefeil dersom de havner i den følsomme retningen.

### Eksperiment 4 – samme dataendring, to utfall

Vi undersøker hvor mye retningen til en datafeil betyr når vi løser et
likningssystem. Matrisen og den opprinnelige løsningen holdes faste;
bare retningen til en like stor endring i høyresiden varierer.
Sammenligningen viser hvorfor god tilpasning til målte data ikke alene
sikrer riktige verdier for de ukjente. Det er skillet mellom residual
og løsningsfeil fra uke 6, nå forklart med singulærverdier.

Kjør forsøket. Vi velger en kjent løsning, beregner tilhørende data, og endrer
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

### To forskjellige spørsmål om små tall

I [uke 2](page4.qmd) undersøkte vi om en oppdatering demper forskjeller,
og i [uke 6.2](uke6.qmd#uke6-fikspunkt) skrev vi feilen i en lineær
iterasjon som $e_{k+1}=Te_k$. Da spør vi om gjentatte produkter med
**iterasjonsmatrisen** $T$ gjør feilen mindre.
Her spør vi hvor følsom løsningen av **systemmatrisen** $A$ er for datafeil.
En liten singulærverdi til $A$ betyr at vi må dele på et lite tall når
vi løser baklengs. Det er ikke en konvergensfaktor for iterasjonen.

SVD gir også $\|Te\|_2\leq\sigma_1(T)\|e\|_2$.
Hvis $\sigma_1(T)<1$, krymper derfor enhver feil i hvert steg.
Dette er et tilstrekkelig krav. Kravet $\rho(T)<1$ fra uke 6 er svakere:
iterasjonen kan konvergere selv om noen feil først vokser.
Vi må altså holde fra hverandre **konvergensen til metoden** og
**følsomheten til problemet**.

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

**Prøv selv:** Forklar håndregningen over med $Av_i=\sigma_i u_i$.
Hvilken resultatretning $u_i$ tilhører hver av de to dataendringene?

**Regnegangen:** Hvis dataendringen $\delta b$ ligger langs $u_i$ og
har størrelse $\eta$, må endringen i løsningen ligge langs $v_i$.
Vi deler på strekkfaktoren for å finne størrelsen:

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

Minste kvadrater fra uke 4 lar oss også behandle data utenfor kolonnerommet.
I den [valgfrie fanen om pseudoinversen](#uke7-pseudoinvers) bruker vi SVD
til å finne den korteste løsningen blant dem som passer dataene best.

## 7.5 Rang som et valg

<div id="uke7-rang"></div>

### Eksperiment 5 – mer detalj, flere tall

Vi går tilbake til bildet og setter tall på avveiningen mellom lagring
og nøyaktighet. Flere SVD-ledd krever flere tall i faktorene og gir mindre
samlet pikselfeil, men forbedringen trenger ikke være like stor for hvert
nytt ledd. Ved å sammenligne bildet, feilnormen og antallet lagrede tall
får vi et grunnlag for å velge hvor mange ledd som er verdt å beholde.

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

### To mønstre og en feil vi kan regne ut på papir

Ta den lille bildematrisen

$$A=\begin{bmatrix}2&1\\1&2\end{bmatrix},\qquad
q_1=\frac1{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix},\quad
q_2=\frac1{\sqrt2}\begin{bmatrix}1\\-1\end{bmatrix}.$$

**Kontroller at $Aq_1=3q_1$ og $Aq_2=q_2$.** Vektorene er ortonormale,
og begge egenverdiene er positive. Vi kan derfor velge $u_i=v_i=q_i$.
Da er SVD-summen

$$A=3q_1q_1^T+q_2q_2^T
=\frac32\begin{bmatrix}1&1\\1&1\end{bmatrix}
+\frac12\begin{bmatrix}1&-1\\-1&1\end{bmatrix}.$$

Første mønster er jevnt, mens andre beskriver kontrasten mellom diagonalene.
Dette ligner mønsterdetektorene fra [uke 4](uke4.qmd#uke4-monster).
Ved rang 1 beholder vi bare det første mønsteret:

$$A_1=\begin{bmatrix}1.5&1.5\\1.5&1.5\end{bmatrix},\qquad
A-A_1=\begin{bmatrix}0.5&-0.5\\-0.5&0.5\end{bmatrix}.$$

Vi mister kontrasten, selv om alle fire elementene fortsatt er omtrent
riktige. Feilen kan regnes uten en datamaskin:

$$\|A-A_1\|_F=\sqrt{4\cdot0.5^2}=1,\qquad
\|A\|_F=\sqrt{2^2+1^2+1^2+2^2}=\sqrt{10}.$$

Den relative feilen er $1/\sqrt{10}\approx0.316$. Den absolutte feilen
1 er akkurat den utelatte singulærverdien. Med flere utelatte mønstre
bruker vi Pytagoras, fordi mønstrene er ortogonale:

$$\|A-A_k\|_F^2=\sigma_{k+1}^2+\cdots+\sigma_p^2,
\qquad p=\min(m,n).$$

Dette gir en måte å velge $k$ på før vi bygger bildet på nytt:
legg sammen kvadratene av de vektene vi vil utelate, og sammenlign med
feilen vi tillater. I dette $2\times2$-eksempelet sparer vi ikke lagring
med faktorene; eksempelet viser regningen. Lagringsgevinsten kommer først
når $k(m+n+1)<mn$.

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

**Regnegangen:** Én komponent trenger $m+n+1$ tall; $k$ komponenter
trenger $k(m+n+1)$. Her blir det 3860 mot 9216 tall. Lagrer vi den
rekonstruerte matrisen i stedet for faktorene, trenger vi fortsatt $mn$ tall.
Tall er dessuten ikke bytes: float64-faktorer bruker 8 bytes per tall,
et 8-bits gråtonebilde én byte per piksel før filkomprimering.
Denne opptellingen er ikke en sammenligning med PNG eller JPEG.

</details>

## 7.6 Hva betyr «god nok»?

<div id="uke7-prosjekt"></div>

### Eksperiment 6 – samme budsjett, ulik informasjon

En metode som fungerer godt på ett bilde, trenger ikke fungere like godt
på et annet. Her får fire like store bilder det samme lagringsbudsjettet,
slik at forskjellen ligger i bildenes mønstre. Forsøket lar oss undersøke
når lav rang er en nyttig forenkling, og når den mister informasjon vi
vil bevare. Dette er vurderingen dere skal gjøre i ukens prosjekt.

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
$m=n=96$. **Regnegangen:** $0.25\cdot96^2/193\approx11.94$,
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

## 7.7 Pseudoinversen (valgfritt)

<div id="uke7-pseudoinvers"></div>

### Når vi ikke kan bruke en vanlig invers

I [uke 4](uke4.qmd) valgte vi $x$ som minimerer $\|Ax-b\|_2^2$.
Geometrisk projiserer vi $b$ på kolonnerommet. Men hva om flere $x$ gir
akkurat den samme beste tilpasningen? Nullrommet fra uke 3 forklarer
hvorfor det kan skje, og SVD gir oss en enkel måte å velge ett svar på.

Vi bruker den rektangulære matrisen fra 7.3 og velger en høyreside:

$$B=\begin{bmatrix}2&0&0\\0&0&0\end{bmatrix},\qquad
b=\begin{bmatrix}6\\4\end{bmatrix}.$$

**Prøv selv:** Kan $Bx=b$ løses nøyaktig? Hvilke $x$ gir minst residual,
og hvilken av disse vektorene har minst lengde?

**Regnegangen:** Vi skal gjøre

$$\|Bx-b\|_2^2=(2x_1-6)^2+4^2$$

minst mulig. Første ledd blir null når $x_1=3$; andre ledd kan vi ikke
endre. Alle vektorer $(3,s,t)^T$ gir derfor den samme minste residualen.
Lengden i andre potens er $9+s^2+t^2$, så den korteste er

$$x^+=\begin{bmatrix}3\\0\\0\end{bmatrix},\qquad
Bx^+=\begin{bmatrix}6\\0\end{bmatrix},\qquad
b-Bx^+=\begin{bmatrix}0\\4\end{bmatrix}.$$

**Hva forklarer dette?** Vi projiserer først dataene på kolonnerommet,
akkurat som i uke 4. Deretter setter vi de frie nullromskomponentene til
null for å få minst mulig lengde. Den gjenværende residualen er ortogonal
på kolonnerommet, og $B^T(b-Bx^+)=0$: normallikningene er oppfylt.

### Samme oppskrift med SVD

La $A=U\Sigma V^T$ være en full SVD, og la $r$ være antallet positive
singulærverdier. Sett $z=V^Tx$ og $c=U^Tb$. Siden ortonormale
koordinatskift bevarer lengde, får vi

$$\|Ax-b\|_2^2=\|\Sigma z-c\|_2^2
=\sum_{i=1}^r(\sigma_i z_i-c_i)^2+\sum_{i=r+1}^m c_i^2.$$

Første sum minimeres ved $z_i=c_i/\sigma_i$. Siste sum er bidraget
utenfor kolonnerommet og kan ikke endres. Koordinatene $z_{r+1},\ldots,z_n$
påvirker ikke residualen, så vi setter dem til null for å minimere
$\|x\|_2=\|z\|_2$. Tilbake i de opprinnelige koordinatene blir svaret

$$\boxed{x^+=A^+b=\sum_{i=1}^r\frac{u_i^Tb}{\sigma_i}v_i}.$$

Matrisen $A^+$ kalles **pseudoinversen**. Vi kan skrive
$A^+=V\Sigma^+U^T$, der $\Sigma^+$ har størrelse $n\times m$:
bytt hver positiv diagonalverdi i $\Sigma$ med dens inverse, behold
nullene, og transponer den rektangulære formen. Vi deler aldri på null.
For eksempelet er

$$B^+=\begin{bmatrix}1/2&0\\0&0\\0&0\end{bmatrix}.$$

Hvis $A$ er kvadratisk og invertibel, er $A^+=A^{-1}$.
Hvis $A$ har full kolonnerang, gir dette den entydige minste-kvadratersløsningen
vi fant med QR i uke 4. Ved rangtap velger pseudoinversen den korteste
blant alle minste-kvadratersløsningene.

### Null og nesten null er forskjellige valg

En positiv singulærverdi inngår i den eksakte pseudoinversen, selv om
den er svært liten. Divisjonen med denne verdien kan forsterke støy,
som i 7.4. **Trunkert SVD** beholder bare de $k$ største positive
singulærverdiene:

$$x_k=\sum_{i=1}^k\frac{u_i^Tb}{\sigma_i}v_i,\qquad k<r.$$

Dette er **regularisering**: vi begrenser løsningen til noen utvalgte
retninger. Vi kan få mindre støyforsterkning, men mister også virkelig
signal i retningene vi utelater. $x_k$ trenger derfor ikke være en
minste-kvadratersløsning for det opprinnelige problemet.

I [prosjekt 6](project_week6.qmd) endret prekondisjonering systemet for
å hjelpe iterasjonen, samtidig som den eksakte løsningen kunne finnes
igjen. Trunkering endrer hvilke løsninger vi tillater. Dette skillet
blir viktig i [prosjekt 7, del B](project_week7.qmd), der vi prøver å
rekonstruere et signal fra usikre målinger.

I flyttallsregning bruker også `np.linalg.pinv` en terskel og behandler
svært små singulærverdier som null. En terskel for avrunding fra uke 1
og en terskel valgt ut fra måleusikkerhet svarer på ulike spørsmål.

:::
