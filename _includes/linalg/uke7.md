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
betyr en liten løsningsfeil. Forklaringen var at den lineære transformasjonen kan strekke
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

### Hvordan kan vi bygge et bilde av enklere bilder?

Et gråtonebilde kan lagres som en tabell med ett tall for hver piksel.
Tallet angir hvor lyst det er akkurat der. I [uke 4](uke4.qmd#uke4-monster)
satte vi sammen små bilder ved å legge sammen mønstre. Nå skal vi gjøre
det samme med et større bilde: først et grovt bidrag, så flere bidrag
som til sammen gjengir stadig mer av originalen.

Et **mønster** betyr her en hel tabell med bidrag til pikslene.
Når vi legger sammen to mønstre, legger vi sammen tallene på tilsvarende
plasser. Ett mønster kan for eksempel gjøre et bredt område lysere,
mens et annet framhever en kontrast. Mønstrene kan ha både positive og
negative tall, fordi et bidrag også kan trekke lysstyrke fra summen.

Metoden vi bruker til å finne slike bidrag, heter **singulærverdidekomposisjon**,
forkortet **SVD**. Vi skal bygge opp matematikken bak den gjennom uken.
Foreløpig får vi bidragene ferdig beregnet. Hvert bidrag kaller vi en
**komponent**. Det første forsøket viser hva vi får igjen når vi beholder
bare noen få av dem. Målet er å oppdage hva som kommer tidlig tilbake i
bildet, og hva som krever flere bidrag.

### Eksperiment 1 – hvor lite trenger vi?

- Kjør cellen og sammenlign originalen med summene av 1, 5 og 20 komponenter.
- Velg én detalj, for eksempel øynene eller hårfestet. Når blir den synlig?
- Bytt ett av tallene, og undersøk om flere komponenter hjelper akkurat der.

```{pyodide-python}
#| label: week7-first-image
# Hjelperen finner bidragene og legger sammen de k første.
# Her undersøker vi resultatet; oppskriften bak bidragene kommer senere.

show_images({'original': portrait, **{f'{k} komponenter': rank_image(portrait,k) for k in (1,5,20)}})
```

**Hva viser forsøket?** Noen hovedtrekk kan være synlige lenge før
alle detaljene er tilbake. Vi kan derfor spørre hvor få komponenter vi
trenger for et bestemt formål. Senere skal vi også måle hvor stor tallfeil
forenklingen gir.

### Hvordan lages én byggekloss?

Hver av komponentene over bygges av to lister med tall. Én liste beskriver
variasjon nedover i bildet, og én beskriver variasjon bortover.
Vi kaller dem en **loddrett profil** og en **vannrett profil**.
En verdi i bildemønsteret blir produktet av ett tall fra hver profil.
La oss først regne på to korte lister, slik at vi ser hele oppskriften.

::: {.callout-note title="Håndeksempel: to profiler gir tre kolonner"}

**Utgangspunkt.** Vi velger profilene
$u=(1,2)^T$ og $v=(1,0,-1)^T$. Målet er å bygge en tabell med to rader
og tre kolonner.

**Prøv selv.** Lag kolonnene $1u$, $0u$ og $-1u$. Hvor mange
uavhengige kolonner får du?

**Regnegangen.** Vi legger kolonnene ved siden av hverandre:

$$uv^T=\begin{bmatrix}1\\2\end{bmatrix}
\begin{bmatrix}1&0&-1\end{bmatrix}
=\begin{bmatrix}1&0&-1\\2&0&-2\end{bmatrix}.$$

- Første tall i den vannrette profilen er 1: første kolonne er $u$.
- Andre tall er 0: andre kolonne blir null.
- Tredje tall er $-1$: tredje kolonne er $-u$.

**Dette tar vi med oss.** Alle kolonnene ligger langs samme vektorretning.
Tabellen har derfor rang 1, slik vi definerte rang i uke 3.
Produktet $uv^T$ kalles et **ytreprodukt**. Det lager en hel tabell
av to profiler.

:::

### Se profilene og det ferdige bidraget

Nå bruker vi samme oppskrift på én av komponentene i portrettet.
Profilene er lengre, men hver piksel beregnes fortsatt ved å gange
tilsvarende profiltall. En ekstra vekt bestemmer hvor sterkt bidraget
skal inngå i bildet. I koden heter vekten `s_img[i]`; hvorfor nettopp
disse vektene og profilene brukes, forklarer vi i 7.3 og 7.5.

Les figuren i denne rekkefølgen:

- **Øverst til venstre:** Den loddrette profilen har ett tall for hver rad.
  Se etter rader der verdien er positiv, negativ eller nær null.
- **Øverst til høyre:** Den vannrette profilen har ett tall for hver kolonne.
  Den bestemmer hvor mye av den loddrette profilen hver kolonne får.
- **Under:** Det ferdige bidraget er produktet av profilene, ganget med vekten.
  Rødt betyr positivt bidrag, blått negativt, og hvitt omtrent null.
  Se etter hvordan skifte av fortegn i en profil gir skifte av farge i bildet.

Kjør cellen med `i = 1`, og prøv så `i = 2`. Dette viser ett bidrag om
gangen, ikke summen av de første bidragene som i eksperiment 1.

```{pyodide-python}
#| label: week7-building-block
# Ett bidrag bygges av to profiler og én vekt.
# Python teller fra 0; i=1 velger det andre bidraget.

U_img,s_img,Vt_img = np.linalg.svd(portrait,full_matrices=False)
i = 1
component = s_img[i]*np.outer(U_img[:,i],Vt_img[i,:])
fig = plt.figure(figsize=(6.4,6.2), layout='constrained')
grid = fig.add_gridspec(2,2, height_ratios=[1,1.35])
ax_u = fig.add_subplot(grid[0,0])
ax_v = fig.add_subplot(grid[0,1])
ax_result = fig.add_subplot(grid[1,:])
ax_u.plot(U_img[:,i]); ax_u.axhline(0,color='gray',linewidth=.6)
ax_u.set_title('1. Loddrett profil'); ax_u.set_xlabel('Radnummer')
ax_v.plot(Vt_img[i,:]); ax_v.axhline(0,color='gray',linewidth=.6)
ax_v.set_title('2. Vannrett profil'); ax_v.set_xlabel('Kolonnenummer')
limit = np.max(np.abs(component))
ax_result.imshow(component,cmap='RdBu_r',vmin=-limit,vmax=limit)
ax_result.set_title('3. Bidraget: profiler ganget sammen, deretter vektet')
ax_result.axis('off')
plt.show()
```

**Dette tar vi med oss.** En komponent er et mønster som dekker hele
bildet. To profiler og en vekt er nok til å beskrive det. I 7.5 setter
vi flere slike komponenter sammen igjen; først undersøker vi geometrien
som forklarer hvor profilene og vektene kommer fra.

## 7.2 Fra sirkel til ellipse

<div id="uke7-geometri"></div>

### Hva gjør transformasjonen med like lange vektorer?

En lineær transformasjon $T$ knytter hver startvektor $x$ til en
resultatvektor $T(x)$. Når vi har valgt koordinater, kan vi regne ut
resultatet med en matrise $A$: vi skriver **$T(x)=Ax$**.
Transformasjonen er selve avbildningen; matrisen inneholder tallene vi
bruker til å beregne den.

Her lar vi alle startvektorene ha lengde 1, slik at forskjeller i
resultatlengde bare skyldes transformasjonen og retningen vi velger. Sirkelen blir en ellipse, og
halvaksene gjør største og minste strekk synlige. Det gir en geometrisk
inngang til både singulærverdier og tap av informasjon.

### Eksperiment 2 – følg en retning gjennom transformasjonen

Startpunktene ligger på en **enhetssirkel**. Velg **Ellipse** og flytt den rosa
prikken rundt sirkelen i rute 1 **øverst til venstre**. Sammenlign med
resultatet i rute 4 **øverst til høyre**.
Retningsskyverne kan også brukes med tastaturet.

- I hvilke startretninger blir resultatvektoren lengst og kortest?
- Velg **Smal ellipse**. Hva blir vanskeligere å skille i resultatet?
- Velg **Rangtap**. Kan ulike startvektorer nå gi samme resultat?

Arbeidsrekkefølgen er **1 → 2 → 3 → 4**: øverst til venstre, ned til
venstre, bort til høyre og opp til høyre. Se først bare på start og slutt,
altså rute 1 og 4. De blå og fiolette pilene er merket $v_1$,
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

### Fra det vi ser, til noe vi kan regne ut

I appletens eksempel **Ellipse** blir noen enhetsvektorer lengre enn
andre. Vi skal nå finne yttergrensene med vanlig matrisemultiplikasjon.
Det gir en kontroll av figuren, og viser hvorfor akkurat 2 og 1 er
singulærverdiene i dette eksempelet.

::: {.callout-note title="Håndeksempel: størst og minst strekk"}

**Utgangspunkt.** Transformasjonen er

$$T(x)=Ax,\qquad A=\begin{bmatrix}0&2\\1&0\end{bmatrix}.$$

Vi sammenligner bare startvektorer med lengde 1. Ellers kunne vi få et
større resultat bare ved å velge en lengre startvektor.

**Prøv selv.** Regn ut $T(e_1)$ og $T(e_2)$, der $e_1=(1,0)^T$ og
$e_2=(0,1)^T$. Hvilken av disse to vektorene blir strukket mest?

**Regnegangen.**

- Langs første koordinatakse får vi $T(e_1)=(0,1)^T$. Lengden er 1.
- Langs andre koordinatakse får vi $T(e_2)=(2,0)^T$. Lengden er 2.
- Mellom aksene kan vi velge $x=(1,1)^T/\sqrt2$. Da er
  $T(x)=(2,1)^T/\sqrt2$, med lengde $\sqrt{5/2}\approx1.58$.
  Dette ligger mellom de to første lengdene.

**Kan en annen retning gi noe utenfor intervallet?** Skriv en vilkårlig
enhetsvektor som $x=(a,b)^T$. Da er $a^2+b^2=1$, og

$$T(x)=(2b,a)^T,\qquad
\|T(x)\|_2^2=4b^2+a^2=1+3b^2.$$

Siden $0\leq b^2\leq1$, ligger lengden i andre potens mellom 1 og 4.
Selve lengden ligger derfor mellom 1 og 2. Her betyr $\|\cdot\|_2$
vanlig euklidsk lengde, som i uke 6.

**Dette tar vi med oss.** Største strekk er 2 og oppnås langs $e_2$.
Minste strekk er 1 og oppnås langs $e_1$. Dermed er
$\sigma_1=2$ og $\sigma_2=1$.

:::

### Hva endres når ellipsen blir smalere?

Behold 2 øverst til høyre i $A$, men bytt 1 nederst til venstre med
et tall $s$ mellom 0 og 1. Da får vi $T_s(a,b)=(2b,sa)$.

- For $s=1$ har vi eksempelet vi nettopp regnet på.
- For $s=0.2$ blir resultatet av $e_1$ bare $0.2e_2$.
  Minste strekk er nå $0.2$, mens største strekk fortsatt er 2.
- For $s=0$ får alle vektorer langs $e_1$ resultatet null.
  Ellipsen blir et linjestykke, og nullrommet er ikke lenger bare nullvektoren.

Forskjellen mellom en liten positiv verdi og null blir viktig når vi
skal rekonstruere startvektoren i 7.4.

<details class="reading-step">
<summary>Gå i dybden: hvorfor kan pilene ha ulike fortegn?</summary>

Hvis $Av_i=\sigma_i u_i$, gjelder også $A(-v_i)=\sigma_i(-u_i)$.
Vi kan altså snu begge basisvektorene i et par uten å endre transformasjonen.
Appletens valg for **Ellipse** er $v_1=e_2$, $v_2=e_1$ og $U=I$.
Da bytter koordinatskiftet $V^T$ om aksene, strekket endrer lengden langs
første akse, og siste trinn lar alle vektorer stå i ro.

Mellom **rute 2 og 3** multipliseres koordinatene med ikke-negative
singulærverdier. Den fiolette aksepilen kan derfor bli kortere eller
forsvinne, men den skal ikke snu. Mellom **rute 3 og 4** kan den
siste ortogonale transformasjonen derimot dreie eller speile pilene.
For **Ellipse** skjer ingen slik endring fordi $U=I$.

Ved like singulærverdier kan flere basisvalg være like gode. Ved en
singulærverdi lik null bestemmer ikke $Av_i=0$ retningen til $u_i$;
vi fullfører med en ortogonal enhetsvektor. Faktorene kan derfor endre
utseende selv om transformasjonen endres lite.

</details>

Forsøket er tilpasset fra [den opprinnelige SVD-demoen](https://andreyac.folk.ntnu.no/svd_complete.html).

## 7.3 To basiser, én enkel operasjon

<div id="uke7-svd"></div>

### Del transformasjonen i forståelige trinn

Nå undersøker vi mellomtrinnene i den samme transformasjonen. SVD deler
matriseproduktet i to koordinatskift og ett strekk langs aksene. Ved å
følge én vektor og dens tallverdier gjennom alle tre operasjonene kan vi
se hva hver faktor gjør. Målet er å forstå hvorfor produktet
$U\Sigma V^T$ beskriver akkurat samme transformasjon som $A$.

### Eksperiment 3 – hvor endres lengden?

Åpne [appleten fra 7.2](#uke7-geometri), velg **Skråstilling**, og følg
én farge i rekkefølgen **1 → 2 → 3 → 4** (ned, høyre, opp). Skråstillingen forskyver punkter horisontalt med
en avstand som avhenger av høyden. Mellom hvilke ruter endres vektorens lengde?
Hva skjer med den blå og den fiolette retningen når de uttrykkes i
nye koordinater? Prøv deretter et negativt matriseelement.

Velg så **Ellipse**, og sett den rosa retningen til $0^\circ$, altså
$x=(1,0)^T$. Bruk matrisene under diagrammet til å regne
$V^Tx$, deretter $\Sigma(V^Tx)$ og til slutt $U(\Sigma V^Tx)$.
Sammenlign med tallene i raden **Rosa** og med direkte beregning av $Ax$.
For **Ellipse** bruker appleten samme basisvalg som håndregningen nedenfor.
Kontroller særlig at siste trinn ikke endrer vektoren: her er $U=I$.

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

Vi kontrollerer nå hele oppskriften på én bestemt vektor. Eksempelet
bruker samme faktorer som appletens valg **Ellipse**.

::: {.callout-note title="Håndeksempel: fra x til T(x) i tre trinn"}

**Utgangspunkt.** Bruk $A=\begin{bmatrix}0&2\\1&0\end{bmatrix}$ og $x=(3,4)^T$.
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

**Dette tar vi med oss.** Vi får $(8,3)^T$, akkurat som ved direkte
beregning av $T(x)=Ax$. Mellomtrinnene forklarer hvordan resultatet bygges opp.

:::

### Når start og resultat har ulik dimensjon

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
være den samme. Dermed kan vi også beskrive en lineær transformasjon fra $\mathbb R^3$ til $\mathbb R^2$, der en egenverdilikning
for en rektangulær matrise ikke gir mening.

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

### Hvilke opplysninger kan vi finne igjen?

I uke 3 skilte vi mellom resultatene som er mulige (**kolonnerommet**)
og startvektorene som gir null (**nullrommet**). SVD gjør disse rommene
synlige: et positivt strekk beholder en startkomponent, mens et nullstrekk
fjerner den. Vi begynner med et eksempel der dette kan leses rett av.

::: {.callout-note title="Håndeksempel: tre startkoordinater, én synlig komponent"}

**Utgangspunkt.** Vi har en transformasjon fra $\mathbb R^3$ til
$\mathbb R^2$:

$$T(x)=Bx,\qquad B=\begin{bmatrix}2&0&0\\0&0&0\end{bmatrix},
\qquad T(x_1,x_2,x_3)=\begin{bmatrix}2x_1\\0\end{bmatrix}.$$

**Prøv selv.** Sammenlign resultatene av $(1,0,0)^T$ og $(1,2,-3)^T$.
Hvilke koordinater kan du endre uten at resultatet endres?

**Regnegangen.** Begge startvektorene gir $(2,0)^T$.

- **Hva kan resultatet være?** Andre resultatkoordinat er alltid null.
  Alle mulige resultater ligger derfor på linjen spent ut av $(1,0)^T$.
  Dette er kolonnerommet, som har dimensjon 1. Derfor er rangen 1.
- **Når blir resultatet null?** Akkurat når $x_1=0$.
  Både $x_2$ og $x_3$ kan velges fritt. Nullrommet er derfor planet
  spent ut av $(0,1,0)^T$ og $(0,0,1)^T$, og har dimensjon 2.
- **Hva sier SVD?** Her kan vi velge $U=I_2$, $V=I_3$ og $\Sigma=B$.
  Første koordinat ganges med 2. De to andre startkoordinatene bidrar
  ikke til resultatet. Rangsatsen blir $1+2=3$.

**Dette tar vi med oss.** Vi kan finne $x_1$ fra resultatet, men får ingen
opplysninger om $x_2$ og $x_3$. Merk at $\Sigma$ har bare to diagonalplasser,
selv om startrommet har tre dimensjoner. Nullrommet har derfor to dimensjoner,
selv om listen med singulærverdier bare inneholder én null.

:::

### Les rommene av en full SVD

La $r$ være antallet positive singulærverdier. Den samme tankegangen gir:

- **Rang:** De $r$ positive strekkfaktorene gir $r$ uavhengige
  resultatretninger. Derfor er $\operatorname{rank}(A)=r$.
- **Kolonnerom:** De mulige resultatene er kombinasjoner av
  $u_1,\ldots,u_r$. Altså
  $\operatorname{Col}(A)=\operatorname{span}(u_1,\ldots,u_r)$.
- **Nullrom:** De resterende startretningene gir null.
  Derfor er $\operatorname{Null}(A)=\operatorname{span}(v_{r+1},\ldots,v_n)$.

Her betyr $\operatorname{span}$ alle lineærkombinasjoner av de oppgitte
vektorene. Vi har $r$ synlige og $n-r$ usynlige startretninger,
slik at rang pluss nullromsdimensjon blir $n$, som i uke 3.

<details class="reading-step">
<summary>Gå i dybden: full SVD i NumPy og numerisk rang</summary>

**Full eller redusert SVD.** Python returnerer `U, s, Vt`:

- `s` inneholder singulærverdiene i synkende rekkefølge.
- `Vt` er allerede transponert; høyre singulærvektorer ligger i radene.
- Med `full_matrices=False` får vi $p=\min(m,n)$ kolonner i `U` og
  $p$ rader i `Vt`. Dette er nok til å rekonstruere matrisen.
- For en bred matrise, som $B$ over, mangler da noen nullromsretninger.
  Bruk full SVD når du trenger en basis for hele nullrommet.

I full SVD gir også de siste $m-r$ kolonnene i $U$ en basis for
nullrommet til $A^T$. Disse retningene er ortogonale på hele kolonnerommet.

**Null i eksakt regning eller nesten null på datamaskinen?**
I flyttallsregning teller vi verdier over en terskel, ikke bare verdier
som er strengt positive. En vanlig terskel er
$\tau=\max(m,n)\epsilon\sigma_1$, der $\epsilon$ er maskinpresisjonen fra
uke 1. Antallet singulærverdier over terskelen kalles **numerisk rang**.
Usikre måledata kan begrunne en større terskel. Numerisk rang avhenger
av toleransen; eksakt rang teller nøyaktig positive singulærverdier.

</details>

## 7.4 Små datafeil, store løsningsfeil

<div id="uke7-kondisjon"></div>

### Fra resultatet tilbake til startvektoren

Så langt har vi beregnet $T(x)=Ax$ når $x$ er kjent. Nå snur vi spørsmålet:
Vi kjenner resultatet $b$, og vil finne startvektoren $x$ fra $Ax=b$.
Hvis én retning blir kraftig forkortet av transformasjonen, må vi
forstørre den igjen når vi regner baklengs. Da forstørres også feil i dataene.
Det forklarer skillet mellom residual og løsningsfeil fra
[uke 6.3](uke6.qmd#uke6-residual).

::: {.callout-note title="Håndeksempel: samme datafeil i to forskjellige retninger"}

**Utgangspunkt.** Vi bruker transformasjonen

$$T(x)=Ax,\qquad A=\begin{bmatrix}0&2\\0.02&0\end{bmatrix}.$$

Dette ligner eksempelet i 7.2, men minste strekk er nå $0.02$.
Vi velger en kjent startvektor $x_*=(1,1)^T$. Da er det eksakte resultatet
$b=Ax_*=(2,0.02)^T$. Tenk at $b$ er to måleverdier.

**Hva skal vi undersøke?** Vi gjør to separate forsøk med en målefeil
på $0.01$. Begge starter med de samme eksakte dataene $b$:

- I første forsøk endres bare første måleverdi: $\widetilde b=(2.01,0.02)^T$.
- I andre forsøk endres bare andre måleverdi: $\widetilde b=(2,0.03)^T$.

Vi skal finne den nye løsningen $\widetilde x$ i hvert tilfelle og
sammenligne den med $x_*$. Det andre forsøket fortsetter altså ikke fra det første.

**Regnegangen.** Likningene $A\widetilde x=\widetilde b$ er
$2\widetilde x_2=\widetilde b_1$ og
$0.02\widetilde x_1=\widetilde b_2$. Dermed får vi

| Tilfelle | Nye data $\widetilde b$ | Ny løsning $\widetilde x$ | Endring $\widetilde x-x_*$ |
|:--|:--|:--|:--|
| Bare første måling endres | $(2.01,0.02)^T$ | $(1,1.005)^T$ | $(0,0.005)^T$ |
| Bare andre måling endres | $(2,0.03)^T$ | $(1.5,1)^T$ | $(0.5,0)^T$ |

I første tilfelle deler vi målefeilen på 2: $0.01/2=0.005$.
I andre tilfelle deler vi den på $0.02$: $0.01/0.02=0.5$.

**Dette tar vi med oss.** Like store målefeil gir her løsningsendringer
som skiller med en faktor 100. Begge nye løsninger passer sine endrede
data nøyaktig, så $\widetilde b-A\widetilde x=0$. Likevel er den andre
langt fra den opprinnelige løsningen. En liten residual mot målte data
kan derfor ikke alene bekrefte at vi har funnet den sanne startvektoren.

:::

### Kontroller de to tilfellene med Python

Vi undersøker hvor mye retningen til en datafeil betyr når vi løser et
likningssystem. Matrisen og den opprinnelige løsningen holdes faste;
bare retningen til en like stor endring i høyresiden varierer.
Sammenligningen viser hvorfor god tilpasning til målte data ikke alene
sikrer riktige verdier for de ukjente. Det er skillet mellom residual
og løsningsfeil fra uke 6, nå forklart med singulærverdier.

### Eksperiment 4 – samme dataendring, to utfall

Kjør cellen og finn igjen begge radene i håndeksempelet.
Bytt så målefeilen fra `0.01` til `0.001` begge steder. **Gjett først:**
Hva skjer med de to løsningsendringene og forholdet mellom dem?

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
<summary>Gå i dybden: følsomhet og konvergens er ulike spørsmål</summary>

I [uke 2](page4.qmd) undersøkte vi om en oppdatering demper forskjeller,
og i [uke 6.2](uke6.qmd#uke6-fikspunkt) skrev vi feilen i en lineær
iterasjon som $e_{k+1}=Ge_k$. Her kaller vi iterasjonsmatrisen $G$
for å skille den fra transformasjonen $T$. Da spør vi om gjentatte produkter med
**iterasjonsmatrisen** $G$ gjør feilen mindre.
Her spør vi hvor følsom løsningen av **systemmatrisen** $A$ er for datafeil.
En liten singulærverdi til $A$ betyr at vi må dele på et lite tall når
vi løser baklengs. Det er ikke en konvergensfaktor for iterasjonen.

SVD gir også $\|Ge\|_2\leq\sigma_1(G)\|e\|_2$.
Hvis $\sigma_1(G)<1$, krymper derfor enhver feil i hvert steg.
Dette er et tilstrekkelig krav. Kravet $\rho(G)<1$ fra uke 6 er svakere:
iterasjonen kan konvergere selv om noen feil først vokser.
Vi må altså holde fra hverandre **konvergensen til metoden** og
**følsomheten til problemet**.

</details>

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
# Transformasjonen c -> P @ c gir polynomverdier fra koeffisientene, som i uke 4.
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

### Hvor mye får vi igjen for flere komponenter?

Vi går tilbake til bildet og setter tall på avveiningen mellom lagring
og nøyaktighet. Flere SVD-ledd krever flere tall i faktorene og gir mindre
samlet pikselfeil, men forbedringen trenger ikke være like stor for hvert
nytt ledd. Ved å sammenligne bildet, feilnormen og antallet lagrede tall
får vi et grunnlag for å velge hvor mange ledd som er verdt å beholde.

### Eksperiment 5 – mer detalj, flere tall

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

Her er $r$ antall positive singulærverdier, og vi velger $0\leq k\leq r$
i denne summen. For $k=0$ er summen nullmatrisen. Matrisen $A_k$ har rang høyst $k$.
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

Vi vil se nøyaktig hva vi mister når vi beholder bare én komponent.

::: {.callout-note title="Håndeksempel: ett jevnt mønster og én kontrast"}

**Utgangspunkt.** Ta den lille bildematrisen

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
bruker vi Pytagoras, fordi mønstrene er ortogonale. Her betyr ortogonale
at tabellene, skrevet som lange vektorer, har indreprodukt null:

$$\|A-A_k\|_F^2=\sigma_{k+1}^2+\cdots+\sigma_p^2,
\qquad p=\min(m,n).$$

Dette gir en måte å velge $k$ på før vi bygger bildet på nytt:
legg sammen kvadratene av de vektene vi vil utelate, og sammenlign med
feilen vi tillater. I dette $2\times2$-eksempelet sparer vi ikke lagring
med faktorene; eksempelet viser regningen. Lagringsgevinsten kommer først
når $k(m+n+1)<mn$.

**Dette tar vi med oss.** Det utelatte mønsteret forklarer både den tapte
kontrasten og den beregnede feilen.

:::

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

### Virker samme forenkling like godt på alle bilder?

En metode som fungerer godt på ett bilde, trenger ikke fungere like godt
på et annet. Her får fire like store bilder det samme lagringsbudsjettet,
slik at forskjellen ligger i bildenes mønstre. Forsøket lar oss undersøke
når lav rang er en nyttig forenkling, og når den mister informasjon vi
vil bevare. Dette er vurderingen dere skal gjøre i ukens prosjekt.

### Eksperiment 6 – samme budsjett, ulik informasjon

Kjør først cellen som bare viser originalene.

```{pyodide-python}
#| label: week7-budget-inputs
# Se originalene før du vurderer hvilke bilder lav rang vil passe for.

images = challenge_images()
show_images(images)
```

**Før du går videre:** Ranger bildene etter hvor godt du tror lav rang
vil fungere, og skriv én begrunnelse. Velg også en detalj du vil bevare.

Kjør deretter sammenligningen nedenfor. Koden velger samme antall komponenter
for alle bildene slik at faktorene krever høyst **25 % så mange tall**
som de opprinnelige bildematrisene.

```{pyodide-python}
#| label: week7-budget
# Alle bildene har samme dimensjoner og får samme parameterbudsjett.
# Rang k bestemmes av hva vi har råd til å lagre, ikke av ønsket bildekvalitet.
# Undersøk hvorfor samme rang kan gi svært ulikt resultat.

images = challenge_images()
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
Det tilpassede resultatet $Ax$ er da projeksjonen av $b$ på kolonnerommet. Men hva om flere $x$ gir
akkurat den samme beste tilpasningen? Nullrommet fra uke 3 forklarer
hvorfor det kan skje, og SVD gir oss en enkel måte å velge ett svar på.

::: {.callout-note title="Håndeksempel: best tilpasning, deretter kortest løsning"}

**Utgangspunkt.** Vi bruker den rektangulære matrisen fra 7.3 og velger en høyreside:

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

:::

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
