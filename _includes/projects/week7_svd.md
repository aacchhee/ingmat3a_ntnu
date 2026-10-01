## Hvilken informasjon bør vi beholde?

En SVD kan brukes til å forenkle et bilde eller rekonstruere et signal.
Men hvorfor skulle færre komponenter gi et bedre svar? Og hvilken
informasjon risikerer vi å fjerne sammen med støyen?

**Alle gjør både A og B, i denne rekkefølgen.**
I hver del skal du regne på et lite eksempel, utlede en feilformel og bruke den til
å begrunne og undersøke et valg. Hovedarbeidet er matematisk; ferdige
hjelpere utfører SVD, rekonstruksjon og plotting. Du trenger ikke
implementere algoritmene eller gjenta bildeforsøkene fra forelesningen.

| Del | Hovedspørsmål | Matematisk verktøy |
|:--|:--|:--|
| A. Støy i et bilde | Når fjerner lav rang støy, og når fjerner den signal? | Ortogonal projeksjon og Frobeniusnorm. |
| B. Et uskarpt signal | Hvorfor kan bedre tilpasning til data gi dårligere rekonstruksjon? | SVD-koordinater, residual og følsomhet. |

Sett av omtrent fire timer; utledningene og sluttvurderingen kan kreve mer tid. A og B bruker samme hovedidé:
feilen består av informasjon vi forkaster og støy vi slipper gjennom.
I B blir den beholdte støyen dessuten forsterket av inversjonen.
Gjør papirregningene før du åpner hvert forsøk.
For hver del skal det være tydelig hva du påstår, hvilken regning som
begrunner det, og hva en numerisk kontroll faktisk kan si.

### Oppsett og begreper

Vi bruker SVD og trunkering fra [uke 7.3–7.5](uke7.qmd#uke7-svd),
ortogonale projeksjoner fra [uke 4](uke4.qmd) og skillet mellom residual
og feil fra [uke 6](uke6.qmd#uke6-residual). Singulærverdiene ordnes fra
størst til minst. Frobeniusnormen er
$\|M\|_F^2=\sum_{i,j}M_{ij}^2$; for vektorer bruker vi euklidsk norm.
Du kan bruke teoremet om beste rang-$k$-tilnærming fra notatene uten bevis.

På nettsiden er oppsettet klart automatisk. I en egen notebook laster du
ned [oppsettsfilen](../assets/project_week7_setup.py){download="project_week7_setup.py"}
og kjører `from project_week7_setup import *`. Du trenger NumPy og
Matplotlib. Kopier forsøkscellene i A3 og B3, og deretter én kontrollcelle fra sluttdelen.
Ta med oppsettsfilen, og kontroller notebooken med **Restart / Run all**.
Portrettet er tilpasset fra [NTNUs mm.gif](https://wiki.math.ntnu.no/_media/imax3011/2025h/mm.gif).

## A. Kan færre komponenter gi et bedre bilde?

Vi skriver de tilgjengelige bildedataene som $Y=C+E$, der $C$ er det
rene bildet og $E$ er støy. En trunkert SVD av **$Y$**, ikke av $C$,
gir $Y_k$. Vi vil ha liten feil mot $C$, selv om det er $Y$ vi kjenner.
Fasiten er tilgjengelig i forsøket bare for å undersøke valget etterpå.

### A1. Et lite bilde der vi kan finne alt for hånd

Bruk

$$C=\operatorname{diag}(4,1,0),\qquad
E=\operatorname{diag}(0,0,\eta),\qquad Y=C+E.$$

Undersøk først $\eta=1/2$, deretter $\eta=2$. Dette er to separate
forsøk med samme rene bilde.

1. Finn singulærverdiene og tilhørende retninger til $Y$ i hvert tilfelle.
   Husk å sortere dem. Skriv $Y_1$, $Y_2$ og $Y_3$ eksplisitt.
2. Lag en tabell med $\|Y-Y_k\|_F$ og $\|Y_k-C\|_F$ for $k=1,2,3$.
   Hvilken rang gir minst feil mot dataene? Hvilken gir minst feil mot
   det rene bildet?
3. Vurder påstanden: «Det rene bildet har rang 2, så vi bør beholde to
   komponenter.» Er rang alene nok til å begrunne dette? Forklar hva som
   skjer når støybidraget passerer den minste positive singulærverdien til $C$.
4. Er det alltid slik at feilen mot det rene bildet først synker og så
   stiger når $k$ øker? Bruk tabellen til å begrunne svaret.

**Ta med videre:** et konkret eksempel som skiller mellom å tilpasse
oppgitte data og å rekonstruere informasjonen vi ønsker.

### A2. Hvor kommer feilen fra?

La $U_k$ inneholde de $k$ første venstre singulærvektorene til $Y$, og
sett $P_k=U_kU_k^T$. Fra uke 4 er dette den ortogonale projeksjonen på
rommet spent ut av disse vektorene. Vi setter $P_0=0$.

1. Vis at $Y_k=P_kY$, og at
   $$Y_k-C=-(I-P_k)C+P_kE.$$
2. Vis at de to matrisene på høyresiden er ortogonale i
   Frobeniusindreproduktet. Du kan undersøke én kolonne om gangen og
   bruke at $P_k(I-P_k)=0$. Utled deretter
   $$\boxed{\|Y_k-C\|_F^2=\|(I-P_k)C\|_F^2+\|P_kE\|_F^2}.$$
   Hvilket ledd er tapt signal, og hvilket er beholdt støy?
3. Når vi holder $Y$ og dens valgte SVD fast og øker $k$, blir
   projeksjonsrommene større. Begrunn at det første leddet ikke øker,
   mens det andre ikke avtar. Hvorfor betyr ikke dette at summen må
   avta, eller at den bare kan ha ett minimum?
4. Bruk formelen på
   $C=\operatorname{diag}(4,0,0)$ og $E=\operatorname{diag}(\eta,0,0)$
   med $\eta>0$. Kan rang 1 fjerne denne støyen? Hva er annerledes?

Merk at $P_k$ kommer fra **de støyete dataene** og selv avhenger av $E$.
Identiteten gjelder likevel for hvert enkelt datasett. Vi antar ikke
at singulærvektorene til $Y$ og $C$ er like.

### A3. Velg rang uten å bruke det rene bildet

Anta at vi har en øvre grense $\delta>0$ for $\|E\|_F$. En mulig regel
er å velge den **minste** rangen $k$ slik at

$$\|Y-Y_k\|_F\leq\tau\delta,\qquad \tau=1.05.$$

Regelen tillater et avvik på størrelse med støyen, i stedet for å kreve
at rekonstruksjonen passer alle dataene nøyaktig. Dette kalles et
**diskrepansprinsipp**. Det er en regel vi skal undersøke, ikke en garanti
for best mulig rekonstruksjon.

1. Skriv regelen med bare singulærverdiene til $Y$. Hvorfor finnes en
   tillatt rang blant $0,\ldots,\min(m,n)$ i eksakt regning?

<details>
<summary>Valgfri fordypning: hva kan regelen garantere?</summary>

Bruk trekantulikheten til å vise at et valgt $Y_k$ oppfyller
   $$\|Y_k-C\|_F\leq(\tau+1)\delta.$$
   Garanterer denne grensen at feilen blir mindre enn i $Y$?
Hvis $\operatorname{rank}(C)\leq r$, bruk beste-tilnærmingsteoremet
   til å vise at regelen velger $k\leq r$. Hvorfor følger det likevel
   ikke at $Y_k=C$? Knytt svaret til A2.

</details>

**Skriv en forventning før kjøring:** Vil det valgte $Y_k$ få mindre
feil mot $C$ enn $Y$? Hvilket av de to feilleddene tror du vil dominere?
Begrunn med A2, og angi ett resultat som ville utfordre forventningen.

Hjelperen nedenfor bruker et $96\times96$-portrett og uavhengige normale
støyverdier med standardavvik `noise_level`. I dette kontrollerte forsøket
settes $\delta=\|E\|_F$. Støynormen brukes til rangvalget; det rene bildet
brukes bare til feilanalysen. Regelen søker alle ranger, også null.

```{pyodide-python}
#| label: project7-image-first
result_A = image_svd_trial(noise_level=.12, seed=23, tau=1.05)
```

Hjelperen viser dataavvik, feil mot fasit, tapt signal og beholdt støy.
Den markerer rangen fra regelen og skriver ut de to leddene i A2.

- Kontroller at feilidentiteten stemmer numerisk ved den valgte rangen.
- Sammenlign valgt rekonstruksjon med det ubehandlede støybildet.
  Forklar forskjellen med de to feilleddene, ikke bare med utseendet.
- Hvor langt er regelen fra den beste rangen for akkurat denne fasiten?
  Dette siste valget er en etterpå-vurdering og kan ikke brukes i neste forsøk.

**Ta med videre til B:** Feilen deles i to ortogonale bidrag. Hvilken
endring forventer du i denne oppdelingen når vi i tillegg må dele på
singulærverdiene for å finne signalet?

## B. Kan vi gjøre et uskarpt signal skarpt igjen?

En lineær transformasjon $T(x)=Hx$ gjør signalet uskarpt. Dataene er
$b=Hx_*+\eta$, der $x_*$ er signalet vi vil finne og $\eta$ er støy.
Små singulærverdier betyr at noen signalretninger blir svært svake i dataene.
Vi undersøker hva som skjer når vi lar være å invertere disse retningene.

### B1. To ukjente og to forskjellige feil

Bruk

$$H=\begin{bmatrix}1&0\\0&\varepsilon\end{bmatrix},\quad
x_*=\begin{bmatrix}1\\1\end{bmatrix},\quad
\eta=\begin{bmatrix}0\\d\end{bmatrix},\quad
b=Hx_*+\eta,\qquad 0<\varepsilon<1.$$

1. Finn løsningen $x_{\mathrm{full}}$ av $Hx=b$ og den trunkerte
   løsningen $x_1$ som bare bruker den største singulærverdien.
2. Finn residualnormen $\|b-Hx\|_2$ og rekonstruksjonsfeilen
   $\|x-x_*\|_2$ for begge. Når er trunkering bedre enn full inversjon?
   Gi en betingelse uttrykt med $|d|$ og $\varepsilon$.
3. Regn ut tallene for $\varepsilon=0.01$, først med $d=0.002$ og så
   med $d=0.02$. Forklar hvorfor minst residual ikke alltid gir best signal.


Med fast $H$ er residualnormen **absolutt bakoverfeil for systemet
$Hx=b$**. Rekonstruksjonsfeilen her er avstanden til $x_*$, løsningen
for dataene **uten støy**. Den er ikke foroverfeilen mot den eksakte
løsningen av det støyete systemet. Forklar dette skillet med B1.

### B2. Del feilen i tapt signal og forsterket støy

Anta i denne papirregningen at $H$ er en invertibel $n\times n$-matrise
med SVD $H=U\Sigma V^T$ og $\sigma_1\geq\cdots\geq\sigma_n>0$.
Skriv

$$a_i=v_i^Tx_*,\qquad e_i=u_i^T\eta,\qquad
\beta_i=u_i^Tb.$$

Vi bruker den trunkerte løsningen

$$x_k=\sum_{i=1}^k\frac{\beta_i}{\sigma_i}v_i,
\qquad 0\leq k\leq n,$$

med $x_0=0$. Dette er formelen fra [uke 7.7](uke7.qmd#uke7-pseudoinvers);
du trenger ikke lese hele den valgfrie fanen for å bruke den her.

1. Vis at $\beta_i=\sigma_i a_i+e_i$. Skriv så $x_k-x_*$ som en sum
   langs $v_i$ og utled med Pytagoras
   $$\boxed{\|x_k-x_*\|_2^2=
   \sum_{i=1}^k\frac{e_i^2}{\sigma_i^2}+\sum_{i=k+1}^n a_i^2}.$$
2. Utled også
   $$\boxed{\|b-Hx_k\|_2^2=\sum_{i=k+1}^n\beta_i^2}.$$
   Hvorfor avtar residualnormen når vi beholder flere retninger,
   mens rekonstruksjonsfeilen kan øke?
3. Finn betingelsen for at det å ta med retning $k+1$ **reduserer**
   rekonstruksjonsfeilen. Hvilke størrelser i betingelsen kjenner vi
   ikke i et problem uten fasit? Kontroller resultatet mot B1.
<details>
<summary>Valgfri fordypning: en grense for støyforsterkningen</summary>

Vis for $k\geq1$ at

$$\|x_k-x_*\|_2^2\leq
\frac{\|\eta\|_2^2}{\sigma_k^2}+\sum_{i=k+1}^n a_i^2.$$

Hva vinner vi ved å kutte før de minste singulærverdiene, og hvorfor
er det ikke uten kostnad?

</details>

### B3. Velg hvor inversjonen skal stoppe

Anta at vi kjenner en øvre grense $\delta>0$ for $\|\eta\|_2$.
Velg den minste $k$ slik at

$$\|b-Hx_k\|_2\leq\tau\delta,\qquad\tau=1.05.$$

Dette er samme **diskrepansprinsipp** som i A3, nå brukt på residualen
i et likningssystem. Vi krever ikke at rekonstruksjonen forklarer all støyen.

1. Bruk B2 til å skrive regelen med datakoordinatene $\beta_i$.
   Hvorfor kan rangvalget gjøres uten å kjenne $x_*$?
2. Finn rangen regelen velger i begge talltilfellene i B1, med
   $\delta=|d|$. Gir den best rekonstruksjon i begge? Hva forteller det
   om forskjellen mellom en begrunnet regel og et optimalt valg?

<details>
<summary>Valgfri fordypning: hvor sterk er en garanti fra residualen?</summary>

For et valgt $x_k$, bruk trekantulikheten og
   $\|Hz\|_2\geq\sigma_n\|z\|_2$ til å vise
   $$\|x_k-x_*\|_2\leq\frac{(\tau+1)\delta}{\sigma_n}.$$
   Hvorfor kan denne garantien være lite nyttig? Hva viser den om
   begrensningen ved å vurdere rekonstruksjonen bare gjennom residualen?

</details>

**Skriv en forventning før kjøring:** Hvordan vil feilen endres hvis vi
beholder langt flere retninger enn regelen velger? Bruk B2 til å begrunne
svaret, og angi hva som ville utfordre forventningen.

Forsøket bruker 80 signalverdier. Hver rad i $H$ er et normalisert
Gauss-filter som blander nærliggende verdier; matrisen er sterkt
illkondisjonert. Hjelperen bruker $\delta=\|\eta\|_2$ fra den kontrollerte
støyen. Som i A er støynormen oppgitt forsøksinformasjon, ikke noe vi
vanligvis kan beregne fra $b$ alene.

```{pyodide-python}
#| label: project7-signal-first
result_B = signal_svd_trial(noise_level=.005, seed=17, tau=1.05)
```

I flyttallsregning søker hjelperen bare blant retninger med
$\sigma_i>n\epsilon_{\mathrm{mach}}\sigma_1$. Her er
$\epsilon_{\mathrm{mach}}$ maskinpresisjonen fra uke 1, ikke
$\varepsilon$ i B1. Hvis ingen tillatt rang oppfyller kravet, meldes
nettopp det. Det skal ikke tolkes som et vellykket rangvalg.

- Sammenlign regelen med den på forhånd valgte referansen $k=5$.
  Vis både residual og rekonstruksjonsfeil. Forklar med B2.
- Kontroller feil- og residualidentitetene ved den valgte rangen.
  Hjelperen skriver ut begge sider; små avrundingsavvik er forventet.
- Finn beste rang mot fasiten blant de numerisk tillatte rangene.
  Hvorfor kan dette etterpå-valget ikke brukes som en regel uten fasit?
  Hvorfor bør vi ikke tolke de minste beregnede singulærverdiene som eksakte?

## Samle trådene og kontroller én konklusjon

Du har nå undersøkt **begge** problemene. Sammenlign feilformlene fra
A2 og B2: Hvorfor kan vi omtale begge som «tapt signal og beholdt støy»,
og hvorfor er små singulærverdier en ekstra utfordring i B?
Sammenlign også med prekondisjonering fra uke 6: bevarer trunkering
den eksakte løsningen på samme måte som et invertibelt koordinatskifte?

Velg deretter **én av konklusjonene dine** fra A eller B for en kontroll
med ny støy. Dette valget gjelder bare kontrollforsøket; begge hoveddelene
er obligatoriske. Behold signal/bilde, støynivå og $\tau$. Skriv hva du
forventer før kjøring, og bruk samme regel, ikke den fasitvalgte rangen.
Den valgte rangen kan endre seg når dataene endres.

For å kontrollere konklusjonen fra A, kjør:

```{pyodide-python}
#| label: project7-image-check
check_A = image_svd_trial(noise_level=.12, seed=24, tau=1.05)
```

For å kontrollere konklusjonen fra B, kjør i stedet:

```{pyodide-python}
#| label: project7-signal-check
check_B = signal_svd_trial(noise_level=.005, seed=18, tau=1.05)
```

Sammenlign med første kjøring av **samme** problem og samme referanse.
Skill mellom det feilformlene beviser og det forsøkene støtter.
Hva trenger vi å vite om støyen for å bruke regelen uten fasit?

**Valgfri fordypning — velg etter interesse:**

- I A: Prøv `image_name='diagonal'`. Forklar forskjellen fra portrettet
  med A1–A2 og singulærverdiene til identitetsmatrisen.
- I B: Hold $\|\eta\|_2=\delta$ fast, men legg all støyen langs én
  $u_i$. Sammenlign en stor og en liten singulærverdi. Forutsi feilene
  med B2 før du eventuelt lager en numerisk kontroll.

## Det du leverer

Lever **både A og B**, og én kontroll på nye data, med:

- håndregningene, tabellen fra det lille eksempelet og de etterspurte
  utledningene; vis mellomsteg og hvilke forutsetninger du bruker;
- forventningene før forsøkene i A og B og før kontrollen, med et mulig motfunn;
- en liten tabell for hvert hovedforsøk: valgt rang, dataavvik/residual
  og rekonstruksjonsfeil, sammen med referansen; legg kontrollen til
  tabellen for den delen du kontrollerte;
- forklaring til høyst tre utvalgte figurer, og koden som gjenskaper forsøket;
  de øvrige automatiske kontrollplottene kan stå i notebooken;
- en avsluttende vurdering på **200–350 ord**: hva har A og B til felles,
  hvorfor er inversjon mer følsom, og hva kan du konkludere med uten fasit?

Papirregninger kan leveres som leselige bilder i notebooken eller i en
separat PDF. Tekstmengden gjelder bare sluttvurderingen. Du vurderes først
og fremst på matematisk begrunnelse, skillet mellom ulike feil og en
konklusjon som ikke sier mer enn argumentene og forsøkene støtter.
