<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 6.0 Oversikt

<div id="uke6-start"></div>

### Fra et første anslag til CG

I uke 5 brukte vi gjentatte matriseprodukter til å finne en retning som
stabiliserte seg. Nå skal gjentakelse hjelpe oss med et annet mål: å løse
$Ax=b$. Vi starter med en vektor med foreløpige verdier for de ukjente, og
beregner nye verdier flere ganger. Håpet er å komme stadig nærmere løsningen. Det er særlig interessant for store
systemer der matrise–vektor-produkter er billige, men faktorisering krever mye arbeid eller lagring.

**Hvordan vet vi om de nye verdiene er bedre enn de gamle – og hvordan
skal vi beregne dem?**
Vi henter kort fram Jacobi og Gauss–Seidel, undersøker hva som styrer
konvergensen, og prøver **konjugert gradient (CG)**: en metode som bygger
nye søkeretninger ut fra informasjonen i tidligere steg.

I **Forelesning** undersøker vi korte eksperimenter og diskuterer det vi ser.
**Gå i dybden** åpner oppgaver, mellomregninger og forklaringer til hvert
forsøk i ett samlet felt. Der følger **Prøv selv**, **Regnegangen** og
**Hva forklarer dette?** etter hverandre, uten flere felt å åpne.

- [Bygg opp GS-oppdateringen](#uke6-gs) og [følg feilen](#uke6-fikspunkt).
- [Skill residual fra feil, og forstå kondisjonstallet](#uke6-residual).
- [Se løsningen som et minimum](#uke6-energi), [velg søkeretning](#uke6-retning)
  og [bygg opp CG](#uke6-cg).
- [Undersøk prekondisjonering i prosjektet](#uke6-prosjekt).

Etter uken skal du kunne knytte fikspunktiterasjon til egenverdier,
tolke matrisens 2-norm og kondisjonstall, og skille liten residual fra
liten feil. Du skal også kunne forklare veien fra gradient og linjesøk
til CGs konjugerte retninger. I prosjektet undersøker du hvordan
skalering kan endre arbeidsmengden for CG.

## 6.1 Fra likningssystem til Gauss–Seidel

<div id="uke6-gs"></div>

### Én likning og én ukjent om gangen

I uke 2 fant vi løsninger ved å gjenta en oppdatering: vi startet med et
forslag, beregnet et nytt og fortsatte til forslagene stabiliserte seg.
Nå vil vi bruke samme idé på et lineært likningssystem $Ax=b$.
Ved Gauss-eliminasjon endrer vi likningene og løser et trekantsystem.
Her beholder vi likningene og **forbedrer et løsningsforslag flere ganger**.

Vi begynner med et system vi også kan løse for hånd:

$$
\begin{aligned}
3u+v&=5,\\
u+2v&=5.
\end{aligned}
\qquad
A=\begin{bmatrix}3&1\\1&2\end{bmatrix},\quad
x=\begin{bmatrix}u\\v\end{bmatrix},\quad
b=\begin{bmatrix}5\\5\end{bmatrix}.
$$

Løsningen er $(u,v)=(1,2)$. Men tenk at vi ennå ikke kjenner den, og
starter med $(0,0)$. Første likning kan brukes til å bestemme $u$ hvis
vi holder $v$ fast. Andre likning kan bestemme $v$ hvis vi holder $u$ fast:

$$u=\frac{5-v}{3},\qquad v=\frac{5-u}{2}.$$

**Bruk første likning til å korrigere $u$ fra nullstart. Hvilken verdi
av $u$ vil dere deretter sette inn i andre likning?**

Vi har to naturlige valg. **Jacobi** bruker verdiene fra starten av
runden i begge uttrykkene. **Gauss–Seidel (GS)** bruker den nye verdien
så snart den er beregnet. En runde gjennom alle ukjente kalles et **sveip**.

| Metode | Ny verdi av $u$ | Ny verdi av $v$ | Etter første sveip |
|:--|:--|:--|:--|
| Jacobi | $(5-0)/3=5/3$ | $(5-0)/2=5/2$ | $(5/3,5/2)$ |
| Gauss–Seidel | $(5-0)/3=5/3$ | $(5-5/3)/2=5/3$ | $(5/3,5/3)$ |

GS går altså gjennom **mellompunktet** $(5/3,0)$ før første sveip er
ferdig. I dette mellompunktet er første likning oppfylt. Når $v$ så
endres til $5/3$, blir andre likning oppfylt, men første blir forstyrret:
$3\cdot5/3+5/3\ne5$. Derfor er én runde vanligvis ikke nok.

Med $k$ som nummer på et helt sveip skriver vi

$$\begin{array}{ll}
\text{Jacobi:}&u_{k+1}=(5-v_k)/3,\quad v_{k+1}=(5-u_k)/2,\\
\text{GS:}&u_{k+1}=(5-v_k)/3,\quad v_{k+1}=(5-u_{k+1})/2.
\end{array}$$

Forskjellen ligger i indeksen på $u$ i den siste oppdateringen.
**Gjør ett GS-sveip til. Kommer dere nærmere $(1,2)$?**

### Fire ukjente: hva er gammelt, og hva er nytt?

For å se mønsteret tydeligere bruker vi nå en $4\times4$-matrise.
Vi deler den i tre deler: $L$ består av tallene **under** diagonalen,
$D$ av tallene **på** diagonalen og $U$ av tallene **over** diagonalen.
Bokstavene kommer fra *lower*, *diagonal* og *upper*. Alle tall beholder
fortegnene sine, og $L$ og $U$ har null på diagonalen.

Fargene følger delene: **blått for $L$**, **oransje for $D$** og
**lilla for $U$**. Plasseringen og bokstavene viser også hvilken del
hvert tall tilhører.

$$
A=\begin{bmatrix}
\textcolor{#B45309}{4}&\textcolor{#7E22CE}{-1}&\textcolor{#7E22CE}{0}&\textcolor{#7E22CE}{0}\\
\textcolor{#1565C0}{-1}&\textcolor{#B45309}{4}&\textcolor{#7E22CE}{-1}&\textcolor{#7E22CE}{0}\\
\textcolor{#1565C0}{0}&\textcolor{#1565C0}{-1}&\textcolor{#B45309}{4}&\textcolor{#7E22CE}{-1}\\
\textcolor{#1565C0}{0}&\textcolor{#1565C0}{0}&\textcolor{#1565C0}{-1}&\textcolor{#B45309}{4}
\end{bmatrix}
=\textcolor{#1565C0}{L}+\textcolor{#B45309}{D}+\textcolor{#7E22CE}{U}.
$$

De tre $4\times4$-matrisene er

$$
\begin{aligned}
\textcolor{#1565C0}{L}&=\begin{bmatrix}0&0&0&0\\\textcolor{#1565C0}{-1}&0&0&0\\\textcolor{#1565C0}{0}&\textcolor{#1565C0}{-1}&0&0\\\textcolor{#1565C0}{0}&\textcolor{#1565C0}{0}&\textcolor{#1565C0}{-1}&0\end{bmatrix},\\[4pt]
\textcolor{#B45309}{D}&=\begin{bmatrix}\textcolor{#B45309}{4}&0&0&0\\0&\textcolor{#B45309}{4}&0&0\\0&0&\textcolor{#B45309}{4}&0\\0&0&0&\textcolor{#B45309}{4}\end{bmatrix},\\[4pt]
\textcolor{#7E22CE}{U}&=\begin{bmatrix}0&\textcolor{#7E22CE}{-1}&\textcolor{#7E22CE}{0}&\textcolor{#7E22CE}{0}\\0&0&\textcolor{#7E22CE}{-1}&\textcolor{#7E22CE}{0}\\0&0&0&\textcolor{#7E22CE}{-1}\\0&0&0&0\end{bmatrix}.
\end{aligned}
$$

Fargede tall er hentet fra den tilsvarende delen av $A$, også når
verdien er null. Svarte nuller er satt inn for å fylle plassene som
ikke tilhører denne delen.

Vi kan skrive $L+D+U$ eller $D+L+U$; summen er den samme.
**Kontroller én rad ved å legge sammen de tre delmatrisene.**

Ta $b=(3,2,2,3)^T$ og oppdater i rekkefølgen $x_1,x_2,x_3,x_4$.
Her er de to oppskriftene ved siden av hverandre. Fargene viser fortsatt
bidragene fra $L$ og $U$; eksponenten $k$ eller $k+1$ viser om verdien
er gammel eller ny.

::: {.columns}
::: {.column width="50%"}

**Jacobi: alle høyresider bruker gamle verdier**

$$
\begin{aligned}
x_1^{(k+1)}&=(3+\textcolor{#7E22CE}{x_2^{(k)}})/4,\\
x_2^{(k+1)}&=(2+\textcolor{#1565C0}{x_1^{(k)}}+\textcolor{#7E22CE}{x_3^{(k)}})/4,\\
x_3^{(k+1)}&=(2+\textcolor{#1565C0}{x_2^{(k)}}+\textcolor{#7E22CE}{x_4^{(k)}})/4,\\
x_4^{(k+1)}&=(3+\textcolor{#1565C0}{x_3^{(k)}})/4.
\end{aligned}
$$

:::
::: {.column width="50%"}

**Gauss–Seidel: bruk nye verdier straks de finnes**

$$
\begin{aligned}
x_1^{(k+1)}&=(3+\textcolor{#7E22CE}{x_2^{(k)}})/4,\\
x_2^{(k+1)}&=(2+\textcolor{#1565C0}{x_1^{(k+1)}}+\textcolor{#7E22CE}{x_3^{(k)}})/4,\\
x_3^{(k+1)}&=(2+\textcolor{#1565C0}{x_2^{(k+1)}}+\textcolor{#7E22CE}{x_4^{(k)}})/4,\\
x_4^{(k+1)}&=(3+\textcolor{#1565C0}{x_3^{(k+1)}})/4.
\end{aligned}
$$

:::
:::

**Sammenlign andre rad. Hvor oppstår den første forskjellen?**
I GS er koordinatene med indeks $j<i$ allerede oppdatert når vi
arbeider med rad $i$. De hører til $L$ og bruker nye verdier.
Koordinatene med $j>i$ hører til $U$ og venter på tur.
Diagonalelementet brukes til å isolere koordinaten vi beregner nå.

Samler vi alle radene for GS, får vi

$$(\textcolor{#B45309}{D}+\textcolor{#1565C0}{L})x^{(k+1)}
=b-\textcolor{#7E22CE}{U}x^{(k)}.$$

Venstresiden er et nedre trekantsystem. Vi løser det ovenfra og ned,
nettopp slik vi gjorde i de fire oppdateringene. Jacobi bruker derimot
bare gamle verdier på høyresiden:

$$\textcolor{#B45309}{D}x^{(k+1)}
=b-(\textcolor{#1565C0}{L}+\textcolor{#7E22CE}{U})x^{(k)}.$$

Dette forklarer forskjellen mellom metodene for et vilkårlig antall
ukjente. Begge oppskriftene krever $a_{ii}\ne0$ for alle $i$; det alene
garanterer ikke at iterasjonen konvergerer.

### Eksperiment 1 – når bruker vi den nye verdien?

Vi går tilbake til $2\times2$-systemet med løsning $(1,2)$.
**Hvilken metode tror dere reduserer feilen raskest i dette eksemplet?**

Hjelpefunksjonen `gs_path(A, b, x0, sweeps)` utfører GS fra `x0` og
lagrer startpunktet og hvert koordinatsteg. Med to ukjente velger
`[::2]` startpunktet og slutten av hvert helt sveip. Dermed sammenligner
vi samme antall sveip for begge metoder.

```{pyodide-python}
#| label: week6-gs-experiment
# Samme system, nullstart og antall hele sveip for begge metodene.
A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 5.])
gs = gs_path(A, b, [0., 0.], sweeps=6)[::2]
jacobi = [np.zeros(2)]
for k in range(6):
    # Begge uttrykkene bruker samme gamle par (u,v).
    u, v = jacobi[-1]
    jacobi.append(np.array([(5-v)/3, (5-u)/2]))
fig, ax = plt.subplots()
for name, values in [('Jacobi', np.array(jacobi)), ('GS', gs)]:
    ax.semilogy(range(len(values)), np.linalg.norm(values-[1.,2.], axis=1),
                'o-', label=name)
ax.set(xlabel='Sveip', ylabel='Avstand til løsningen (1, 2)')
ax.legend(); plt.show()
```

Begge iterasjonsfølgene nærmer seg løsningen her. **Ville dere stole på
samme oppskrift for ethvert system?** I 6.2 endrer vi matrisen for å
undersøke dette.

<details class="reading-step">
<summary>Gå i dybden: rekkefølgen i sveipet og korreksjonen i koden</summary>

**Prøv selv**

1. Bruk $4\times4$-systemet over, men oppdater i motsatt rekkefølge:
   $x_4,x_3,x_2,x_1$. Regn ett sveip fra nullstart. Hvilke verdier er
   nå nye, og hvordan må matriseformen endres?
2. Skriv rad $i$ i det vanlige GS-sveipet
   $(D+L)x^{(k+1)}=b-Ux^{(k)}$, og isoler $x_i^{(k+1)}$.
3. Hjelperen `gs_path` bruker korreksjonen
   $x_i\leftarrow x_i+(b_i-(Ax)_i)/a_{ii}$. Vis at den gir samme
   oppdatering. Hvorfor må $Ax$ bruke den gjeldende vektoren?

**Regnegangen**

I det omvendte sveipet får vi først $x_4=3/4$, deretter
$x_3=(2+3/4)/4=11/16$, $x_2=(2+11/16)/4=43/64$ og til slutt
$x_1=(3+43/64)/4=235/256$. Etter sveipet er altså

$$x^{(1)}=\begin{bmatrix}235/256\\43/64\\11/16\\3/4\end{bmatrix}.$$

Nå er koordinatene med høyere indeks allerede oppdatert. Matriseformen
blir derfor

$$(\textcolor{#B45309}{D}+\textcolor{#7E22CE}{U})x^{(k+1)}
=b-\textcolor{#1565C0}{L}x^{(k)}.$$

Vi løser et øvre trekantsystem nedenfra og opp. Rekkefølgen endrer
mellomregningen og iterasjonsfølgen, selv om vi søker løsningen av
samme system. Jacobi har ikke denne avhengigheten mellom nye verdier
innenfor ett sveip.

For det vanlige sveipet er rad $i$

$$\sum_{j<i}a_{ij}x_j^{(k+1)}+a_{ii}x_i^{(k+1)}
=b_i-\sum_{j>i}a_{ij}x_j^{(k)}.$$

Isolerer vi koordinaten på diagonalen, får vi

$$x_i^{(k+1)}=\frac{b_i-\sum_{j<i}a_{ij}x_j^{(k+1)}
-\sum_{j>i}a_{ij}x_j^{(k)}}{a_{ii}}.$$

**Hva forklarer dette?**

La $x$ i koden inneholde de nyeste verdiene som er tilgjengelige.
Siden $(Ax)_i=a_{ii}x_i+\sum_{j\ne i}a_{ij}x_j$, er

$$x_i+\frac{b_i-(Ax)_i}{a_{ii}}
=\frac{b_i-\sum_{j\ne i}a_{ij}x_j}{a_{ii}}.$$

Den gamle $x_i$ kansellerer. Når vi overskriver én koordinat om
gangen, bruker neste rad de oppdaterte verdiene automatisk.
Beregner vi derimot hele residualen én gang ved starten av sveipet
og bruker den uendret i alle korreksjonene, får vi Jacobi.

</details>

## 6.2 Følg feilen

<div id="uke6-fikspunkt"></div>

### Eksperiment 2 – er flere sveip alltid bedre?

I første forsøk kom GS nærmere løsningen for hvert sveip. Skjer det
alltid? Vi sammenligner nå to matriser:

$$A_a=\begin{bmatrix}3&1\\1&2\end{bmatrix},\qquad
A_b=\begin{bmatrix}1&2\\2&1\end{bmatrix}.$$

I begge systemene inngår både $u$ og $v$ i hver likning. Når vi endrer
$u$ for å oppfylle den første likningen, endres derfor også venstresiden
i den andre. GS beregner deretter en ny $v$, som igjen påvirker den
første likningen. Vi undersøker om disse vekselvise oppdateringene
bringer oss nærmere løsningen for begge matrisene.

Vi bruker kjent løsning $x_*=(1,2)^T$ og lager $b=Ax_*$ for hver matrise.
Slik vet vi hvor kurvene skal ende, og kan måle feilen direkte.
**Hvilket forløp tror dere vokser?**

```{pyodide-python}
#| label: week6-convergence
# Vi konstruerer b fra en kjent løsning for å isolere effekten av A.
# Samme GS-regel kan dempe eller forsterke feil, avhengig av iterasjonsmatrisen.
# Se på utviklingen over flere sveip, ikke bare første forbedring.

star = np.array([1., 2.])
fig, ax = plt.subplots()
for name, A in [('A_a = [[3,1],[1,2]]', np.array([[3.,1.],[1.,2.]])),
                ('A_b = [[1,2],[2,1]]', np.array([[1.,2.],[2.,1.]]))]:
    values = gs_path(A, A @ star, np.zeros(2), sweeps=10)[::2]
    ax.semilogy(range(len(values)), np.linalg.norm(values-star, axis=1),
                'o-', label=name)
ax.set(xlabel='GS-sveip', ylabel='‖x_k − x_*‖₂')
ax.legend(); plt.show()
```

For $A_a$ avtar feilen; for $A_b$ vokser den fra vår startvektor.
Vi kan allerede se en viktig forskjell i matrisene. I hver rad i
$A_a$ er diagonalelementet større i absoluttverdi enn summen av de
andre elementenes absoluttverdier: $3>1$ og $2>1$. Dette kalles
**streng diagonaldominans**. Det er en tilstrekkelig betingelse for
at GS konvergerer fra enhver startvektor.

$A_b$ oppfyller ikke denne betingelsen, siden $1<2$. Det alene beviser
ikke at GS mislykkes: diagonaldominans er en garanti, ikke et nødvendig
krav. For å forklare hva som skjer i akkurat disse to forsøkene,
undersøker vi hvordan ett sveip endrer feilen.

Som i [uke 2](page4.qmd) kan vi skrive metoden som en fikspunktiterasjon.
Her er oppdateringen $x_{k+1}=Tx_k+c$. Løsningen er et **fikspunkt**:
den endres ikke av oppdateringen, altså $x_*=Tx_*+c$.
**Feilen** $e_k=x_k-x_*$ følger derfor

$$e_{k+1}=(Tx_k+c)-(Tx_*+c)=T(x_k-x_*)=Te_k.$$

Dermed er $e_k=T^ke_0$. Dette er forbindelsen til uke 5: der fulgte vi
hvilket vektorbidrag som tok over; nå ønsker vi at **alle feilbidrag skal
forsvinne**. $T$ beskriver ett helt sveip, mens $A$ beskriver det opprinnelige
likningssystemet. De to matrisene har forskjellige roller.

Ved å sette oppdateringen av $u$ inn i oppdateringen av $v$ får vi
de to **iterasjonsmatrisene** (mellomregningen står i «Gå i dybden»):

$$T_a=\begin{bmatrix}0&-1/3\\0&1/6\end{bmatrix},\qquad
T_b=\begin{bmatrix}0&-2\\0&4\end{bmatrix}.$$

**Hvorfor undersøke egenverdier her?** Hvis feilvektoren er en
egenvektor $w$ til $T$, er neste feil $Tw=\lambda w$. Da forteller
$\lambda$ akkurat hvilken faktor feilen ganges med i hvert sveip.
Dette er samme gjentatte matriseprodukt som i uke 5.

Begge $T$-matrisene er trekantmatriser, så egenverdiene står på
diagonalen: $0$ og $1/6$ for $T_a$, $0$ og $4$ for $T_b$.
Et feilbidrag langs egenvektoren til $1/6$ blir seks ganger mindre
per sveip. Et bidrag langs egenvektoren til $4$ blir fire ganger større.
Det er egenverdiene til **$T$, ikke til $A$**, som beskriver denne
feilutviklingen.

**Spektralradiusen** er største absoluttverdi av egenverdiene:
$\rho(T)=\max_i|\lambda_i(T)|$. Iterasjonen konvergerer fra enhver startvektor
akkurat når $\rho(T)<1$. Det er $T$ vi undersøker her.
**Hvorfor er én vellykket kjøring ikke nok til å garantere konvergens fra enhver startvektor?**

<details class="reading-step">
<summary>Gå i dybden: finn matriserepresentasjonen av feiloppdateringen</summary>

**Prøv selv**

1. Sett GS-uttrykket for $u_{k+1}$ inn i uttrykket for $v_{k+1}$ for $A_a$.
   Les av $T$ og $c$.
2. Gjør det samme for $A_b$, der $b=(5,4)^T$.
3. Finn $T$ og $\rho(T)$ når $A=\begin{bmatrix}4&1\\1&3\end{bmatrix}$.
   Avhenger $T$ av $b$?

**Regnegangen**

For første system er $u_{k+1}=5/3-v_k/3$ og $v_{k+1}=5/3+v_k/6$:

$$T_a=\begin{bmatrix}0&-1/3\\0&1/6\end{bmatrix},\quad c_a=(5/3,5/3)^T.$$

For andre er $u_{k+1}=5-2v_k$, $v_{k+1}=-6+4v_k$:

$$T_b=\begin{bmatrix}0&-2\\0&4\end{bmatrix},\quad c_b=(5,-6)^T.$$

**Hva forklarer dette?**

Å trekke $x_*=Tx_*+c$ fra iterasjonen gir $e_{k+1}=Te_k$ og $e_k=T^ke_0$.
For enkelte startvektorer er bidraget til startfeilen langs en voksende egenretning null.
Når en egenvektorbasis finnes, skaleres hvert bidrag med $\lambda_i^k$.
Kriteriet $\rho(T)<1$ gjelder også uten en egenvektorbasis.

I oppgave 3 er $T=\begin{bmatrix}0&-1/4\\0&1/12\end{bmatrix}$ og
$\rho(T)=1/12$. $b$ endrer fikspunktet, men ikke $T$.

**Fra eksemplet til en generell matrise**

For generell $A=D+L+U$ er $D$ diagonalen, $L$ den strengt nedre delen og
$U$ den strengt øvre delen, med opprinnelige fortegn. Da er

$$(D+L)x_{k+1}=b-Ux_k,\qquad T=-(D+L)^{-1}U.$$

Dette er et analyseuttrykk; implementasjonen trenger ikke en eksplisitt invers.
For Jacobi er $T=-D^{-1}(L+U)$.

</details>

## 6.3 Residual, norm og kondisjonstall

<div id="uke6-residual"></div>

### Fra ett tall i uke 2 til en vektor i uke 6

I [uke 1](page2.qmd) målte vi absolutt og relativ feil. I
[uke 2, del 2.4](page4.qmd) skilte vi mellom **foroverfeil** (feil i
svaret) og **bakoverfeil** (hvor mye problemet må endres for at svaret
skal bli eksakt). Vi bruker nå de samme spørsmålene for $Ax=b$.

La $x_*$ være den eksakte løsningen og $\hat x$ en **beregnet tilnærming**.
$\hat x$ kan for eksempel være vektoren etter ti GS-sveip; den er ikke
nødvendigvis startvektoren. For en vektor bruker vi den vanlige lengden

$$\lVert z\rVert_2=\sqrt{z_1^2+\cdots+z_n^2}.$$

De to spørsmålene gir forskjellige størrelser:

| Spørsmål | Beregning | Hva trenger vi? |
|:--|:--|:--|
| Hvor langt er svaret fra løsningen? | Absolutt **foroverfeil** $\lVert\hat x-x_*\rVert_2$ | Den eksakte løsningen eller en god referanse. |
| Hvor godt oppfyller svaret likningene? | **Residual** $r=b-A\hat x$, med størrelse $\lVert r\rVert_2$ | Bare $A$, $b$ og den beregnede vektoren. |

Residualen er det som mangler når vi setter $\hat x$ inn i likningene.
Den kan beregnes selv om vi ikke kjenner $x_*$.

### To beregnede svar: minst residual eller minst feil?

Se på systemet

$$A=\begin{bmatrix}1&0\\0&10^{-4}\end{bmatrix},\qquad
b=\begin{bmatrix}1\\10^{-4}\end{bmatrix}.$$

Likningene er $x_1=1$ og $10^{-4}x_2=10^{-4}$, så den eksakte
løsningen er $x_*=(1,1)^T$. Tenk at to beregninger har gitt oss
$\hat x^{(a)}=(1,0)^T$ og $\hat x^{(b)}=(0.99,1)^T$.
Vi sammenligner svarene; vi starter ikke to nye iterasjoner.

| Beregnet svar $\hat x$ | Residual $b-A\hat x$ | Feilvektor $\hat x-x_*$ | Residualnorm | Absolutt foroverfeil |
|:--|:--|:--|:--|:--|
| $(1,0)^T$ | $(0,10^{-4})^T$ | $(0,-1)^T$ | $10^{-4}$ | $1$ |
| $(0.99,1)^T$ | $(0.01,0)^T$ | $(-0.01,0)^T$ | $0.01$ | $0.01$ |

Det første svaret bommer med $1$ i andre koordinat, men denne feilen
ganges med $10^{-4}$ når vi setter svaret inn i andre likning.
Det andre svaret bommer bare med $0.01$ i første koordinat, der
koeffisienten er $1$. **Svaret med minst residual har altså størst
foroverfeil.** Dette ligner den flate funksjonsgrafen i uke 2:
stor avstand til løsningen kan gi en liten residual.

### Bakoverfeil: hvor mye må høyresiden endres?

Se igjen på det beregnede svaret $\hat x=(1,0)^T$. Det oppfyller

$$x_1=1,\qquad 10^{-4}x_2=0.$$

Det opprinnelige systemet hadde $10^{-4}$ på høyresiden i andre
likning. Endrer vi dette tallet til $0$, blir det beregnede svaret
helt riktig for de nye likningene.

**Bakoverfeilen måler hvor mye vi må endre problemet for at det
beregnede svaret skal bli eksakt.** Her endrer vi bare høyresiden;
matrisen $A$ beholdes.

Dette kan vi gjøre for enhver beregnet vektor $\hat x$.
Residualen $r=b-A\hat x$ forteller akkurat hva vi må trekke fra $b$:

$$A\hat x=b-r.$$

Den nødvendige endringen i høyresiden er altså $-r$, og størrelsen
på endringen er $\lVert r\rVert_2$. **Med fast $A$ er residualnormen
den absolutte bakoverfeilen.** I eksemplet er den $10^{-4}$.

Vi har dermed et svar med liten bakoverfeil, men stor foroverfeil.
For å forstå hvor stor forskjellen kan bli, må vi først se på
hvordan matrisen endrer vektorlengder.

### Matrisens 2-norm: den største strekkfaktoren

Vi har nettopp brukt 2-normen til vektorer. Til matriser har vi
tidligere brukt **Frobenius-normen**:

$$\lVert A\rVert_F=\sqrt{\sum_{i,j}a_{ij}^2}.$$

Den summerer kvadratene av alle matriseelementene. Nå trenger vi en
annen norm, som er knyttet direkte til transformasjonen $z\mapsto Az$.
Vi definerer **matrisens 2-norm** ved

$$\boxed{\lVert A\rVert_2
=\max_{z\ne0}\frac{\lVert Az\rVert_2}{\lVert z\rVert_2}
=\max_{\lVert z\rVert_2=1}\lVert Az\rVert_2.}$$

Vi sender alle enhetsvektorer gjennom $A$ og finner den lengste
resultatvektoren. Normen er lengden til denne, altså den største
strekkfaktoren. En strekkfaktor på $0.01$ betyr at vektoren blir
hundre ganger kortere; dette kalles også at vektoren **dempes**.
Faktoren trenger altså ikke være større enn $1$. Definisjonen gir
$\lVert Az\rVert_2\le\lVert A\rVert_2\lVert z\rVert_2$ for enhver $z$.

For $B=\operatorname{diag}(3,1)$ blir $(1,0)^T$ strukket til $(3,0)^T$,
mens $(0,1)^T$ beholder lengden sin. Ingen enhetsvektor blir lengre enn
$3$, så $\lVert B\rVert_2=3$. Frobenius-normen er derimot
$\lVert B\rVert_F=\sqrt{10}$. **De to normene måler forskjellige ting.**

**Hvordan ser bildet av enhetssirkelen ut under denne matrisen?**

```{pyodide-python}
#| label: week6-matrix-norm
B = np.diag([3., 1.])
theta = np.linspace(0, 2*np.pi, 300)
circle = np.array([np.cos(theta), np.sin(theta)])
ellipse = B @ circle
fig, axes = plt.subplots(2, 1, figsize=(7, 9))
for ax, points, vectors, title in zip(axes, [circle, ellipse], [np.eye(2), B],
                                     ['Enhetsvektorer z', 'Bildene Bz']):
    ax.plot(*points, color='#64748b')
    for j, color in [(0, '#2563eb'), (1, '#c2410c')]:
        ax.annotate('', xy=vectors[:,j], xytext=(0,0),
                    arrowprops=dict(arrowstyle='->', color=color, lw=2))
    ax.set(xlim=(-3.4,3.4), ylim=(-1.6,1.6), xlabel='Første koordinat',
           ylabel='Andre koordinat', title=title)
    ax.set_aspect('equal'); ax.grid(alpha=.2)
axes[1].text(1.3, .15, 'Lengst: 3', color='#2563eb')
axes[1].text(.15, .65, 'Kortest: 1', color='#c2410c')
fig.tight_layout(); plt.show()
print('2-norm:', np.linalg.norm(B, 2))
print('Frobenius-norm:', np.linalg.norm(B, 'fro'))
```

Begge bilder har samme akseskala. Øverste bilde viser retningene vi
prøver; nederste viser hvordan $B$ virker på dem. Den lengste halvaksen
i ellipsen gir 2-normen. En rotasjon av ellipsen ville ikke endret
lengden til denne halvaksen.

I NumPy er `np.linalg.norm(A, 2)` matrisens 2-norm, mens
`np.linalg.norm(A)` uten normvalg gir Frobenius-normen når `A` er en
matrise. For en vektor gir `np.linalg.norm(z)` den vanlige 2-normen.
Vi skriver normvalget eksplisitt når vi regner på matriser.

### Kondisjonstall: forholdet mellom størst og minst strekk

For en invertibel, kvadratisk matrise definerer vi

$$\boxed{\kappa_2(A)=\lVert A\rVert_2\lVert A^{-1}\rVert_2.}$$

Den inverse transformasjonen må oppheve også den svakeste strekkingen
fra $A$. Derfor er $\lVert A^{-1}\rVert_2$ den inverse av den minste
strekkfaktoren. Kondisjonstallet er dermed **største strekkfaktor delt
på minste strekkfaktor**. Det er minst $1$. Et stort tall betyr
at transformasjonen behandler ulike retninger svært ulikt.

| Matrise | $\lVert A\rVert_2$ | $\lVert A^{-1}\rVert_2$ | $\kappa_2(A)$ | Hva ser vi? |
|:--|:--|:--|:--|:--|
| $I_2$ | $1$ | $1$ | $1$ | Alle lengder bevares. |
| $1000I_2$ | $1000$ | $10^{-3}$ | $1$ | Alle retninger skaleres like mye. |
| $\operatorname{diag}(3,1)$ | $3$ | $1$ | $3$ | Tre ganger så stort strekk i én retning. |
| $\operatorname{diag}(1,10^{-4})$ | $1$ | $10^4$ | $10^4$ | Andre koordinat ganges med $10^{-4}$. |

Store matriseelementer betyr altså ikke automatisk dårlig kondisjon.
Å multiplisere hele $A$ med samme ikke-null tall endrer ikke
$\kappa_2(A)$. En singulær matrise har ingen invers; da bruker vi
konvensjonen $\kappa_2(A)=\infty$.

Matrisen fra det første eksemplet har altså kondisjonstall $10^4$.
Når vi løser systemet, må vi dele andre komponent i høyresiden på
$10^{-4}$. Da kan små endringer i denne komponenten gi store endringer
i svaret. Nå skal vi gjøre denne sammenhengen presis.

### Hva betyr tallet for nøyaktigheten?

Vi ønsker en grense for **foroverfeilen**, men kan vanligvis bare
beregne residualen. Nå bruker vi matrisenormen til å knytte dem sammen.
Sett $e=\hat x-x_*$. Siden den eksakte løsningen oppfyller $Ax_*=b$, er

$$r=b-A\hat x=Ax_*-A\hat x=-Ae.$$

Anta at $A$ er invertibel og $b\ne0$. Da er også $x_*\ne0$,
så vi kan dele på både $\lVert b\rVert_2$ og $\lVert x_*\rVert_2$.
Vi tar utledningen i tre trinn.

**1. Del den absolutte feilgrensen på størrelsen til løsningen.**

Fra $r=-Ae$ får vi $e=-A^{-1}r$. Matrisenormen gir en grense for
lengden av et matriseprodukt: $\lVert Cz\rVert_2\le\lVert C\rVert_2\lVert z\rVert_2$.
Vi bruker dette med $C=A^{-1}$ og $z=r$. Minustegnet endrer ikke lengden, så

$$\lVert e\rVert_2=\lVert A^{-1}r\rVert_2
\le\lVert A^{-1}\rVert_2\lVert r\rVert_2.$$

Del begge sider på $\lVert x_*\rVert_2$. Da får vi relativ feil på venstresiden:

$$\frac{\lVert e\rVert_2}{\lVert x_*\rVert_2}
\le\lVert A^{-1}\rVert_2\lVert r\rVert_2
\frac{1}{\lVert x_*\rVert_2}.$$

**2. Finn en øvre grense for faktoren $1/\lVert x_*\rVert_2$.**

Høyresiden inneholder fortsatt den ukjente løsningen $x_*$.
Vi bruker at $b=Ax_*$. Den samme regelen for matrisenormen gir

$$\lVert b\rVert_2=\lVert Ax_*\rVert_2
\le\lVert A\rVert_2\lVert x_*\rVert_2.$$

Del nå **begge sider** på det positive tallet
$\lVert b\rVert_2\lVert x_*\rVert_2$. På venstresiden forkortes
$\lVert b\rVert_2$, og på høyresiden forkortes $\lVert x_*\rVert_2$:

$$\frac{1}{\lVert x_*\rVert_2}
\le\frac{\lVert A\rVert_2}{\lVert b\rVert_2}.$$

Dette er mellomsteget vi trenger: faktoren med den ukjente løsningen
kan erstattes av en øvre grense som bare bruker $A$ og $b$.

**3. Sett denne grensen inn i resultatet fra trinn 1.**

Faktoren $\lVert A^{-1}\rVert_2\lVert r\rVert_2$ er ikke-negativ.
Vi kan derfor bruke ulikheten fra trinn 2 uten å snu ulikhetstegnet:

$$
\begin{aligned}
\frac{\lVert e\rVert_2}{\lVert x_*\rVert_2}
&\le\lVert A^{-1}\rVert_2\lVert r\rVert_2
       \frac{1}{\lVert x_*\rVert_2}\\[4pt]
&\le\lVert A^{-1}\rVert_2\lVert r\rVert_2
       \frac{\lVert A\rVert_2}{\lVert b\rVert_2}\\[4pt]
&=\bigl(\lVert A^{-1}\rVert_2\lVert A\rVert_2\bigr)
       \frac{\lVert r\rVert_2}{\lVert b\rVert_2}.
\end{aligned}
$$

I siste linje har vi bare byttet rekkefølge på tallfaktorene.
Produktet i parentes er kondisjonstallet $\kappa_2(A)$.
Setter vi tilbake $e=\hat x-x_*$ og $r=b-A\hat x$, får vi

$$\boxed{
\frac{\lVert\hat x-x_*\rVert_2}{\lVert x_*\rVert_2}
\le\kappa_2(A)\frac{\lVert b-A\hat x\rVert_2}{\lVert b\rVert_2}.
}$$

Venstresiden er **relativ foroverfeil**. Siste brøk på høyresiden er
**relativ bakoverfeil med fast $A$**: residualnormen delt på
størrelsen til høyresiden $b$.

Dette er rollen til kondisjonstallet: det gir en øvre grense for
hvor mye en liten bakoverfeil kan slå ut i svaret. Relativ residual
$10^{-8}$ og $\kappa_2(A)=10^2$ gir foroverfeil høyst $10^{-6}$.
Med $\kappa_2(A)=10^8$ blir grensen $1$, som ikke garanterer et
nøyaktig svar. En øvre grense sier hvor stor feilen **kan** bli,
ikke at den alltid blir så stor.

Vi kan også endre dataene med vilje og løse $A\tilde x=b+\delta b$.
Da gir subtraksjon av $Ax_*=b$ at
$A(\tilde x-x_*)=\delta b$. Samme regning gir

$$\frac{\lVert\tilde x-x_*\rVert_2}{\lVert x_*\rVert_2}
\le\kappa_2(A)\frac{\lVert\delta b\rVert_2}{\lVert b\rVert_2}.$$

En eksakt løsning av de endrede likningene kan altså ligge langt fra
løsningen av de opprinnelige. Dette er **følsomhet i problemet**,
også kalt kondisjon. Det er ikke i seg selv en feil i algoritmen.
Neste forsøk viser forskjellen.

### Eksperiment 3 – liten dataendring, stor endring i svaret?

**Kan programmet løse likningene godt, men likevel gi et svar langt
fra den opprinnelige løsningen?**

Vi bruker samme løser, `np.linalg.solve`, på fem systemer.
Likningene er $x_1=1$ og $x_2/K=0$, med løsning $(1,0)$.
Matrisen er diagonal og har kondisjonstall $K$: første koordinat
beholdes, mens andre deles på $K$.

Så endrer vi høyresiden i andre likning fra $0$ til $10^{-8}$.
Koden kaller den nye høyresiden `b_endret` og sender den til løseren.
Vi måler både hvor langt svaret har flyttet seg, og hvor godt det
oppfyller de endrede likningene.

```{pyodide-python}
#| label: week6-conditioning-experiment
K_verdier = [1., 1e2, 1e4, 1e6, 1e8]
x_fasit = np.array([1., 0.])
b = np.array([1., 0.])
b_endret = b + np.array([0., 1e-8])
feil, residualer = [], []
for K in K_verdier:
    A = np.diag([1., 1/K])
    x = np.linalg.solve(A, b_endret)
    # Sammenlign med den opprinnelige løsningen.
    feil.append(np.linalg.norm(x - x_fasit) / np.linalg.norm(x_fasit))
    # Kontroller de samme likningene som løseren fikk.
    residualer.append(np.linalg.norm(b_endret - A @ x) / np.linalg.norm(b_endret))

fig, axes = plt.subplots(2, 1, figsize=(7, 9))
axes[0].loglog(K_verdier, feil, 'o-')
axes[0].set(ylabel='Relativ foroverfeil',
            title='Avstand fra den opprinnelige løsningen')
# Lineær skala på loddrett akse, slik at også null residual kan vises.
axes[1].semilogx(K_verdier, residualer, 'o-')
axes[1].set(ylabel='Relativ residual',
            title='Kontroll mot den endrede høyresiden',
            ylim=(-0.2e-16, 5e-16))
for ax in axes:
    ax.set_xlabel('Kondisjonstall K')
    ax.grid(alpha=.25)
fig.tight_layout(); plt.show()
```

**Øverste bilde: hvor mye flyttet svaret seg?** Når kondisjonstallet
øker fra $1$ til $10^8$, vokser feilen fra $10^{-8}$ til $1$, altså
$100\%$ relativ feil. Den andre likningen løses ved å gange med $K$;
derfor blir også dataendringen ganget med $K$.

**Nederste bilde: løste programmet likningene det fikk?** Her bruker
vi det samme beregnede svaret, men kontrollerer `b_endret - A @ x`.
Høyresiden er altså den **endrede** høyresiden som ble sendt til
`solve`. Residualen er null eller svært liten. Programmet oppfyller
de endrede likningene godt, selv når svaret ligger langt fra den
opprinnelige løsningen.

**Et følsomt problem kan gi stor feil i svaret selv om løseren gjør
en god jobb.** Her valgte vi en dataendring som gir størst utslag.
Kondisjonstallet sier hvor stor feilen kan bli; den faktiske feilen
avhenger også av hvilken komponent vi endrer. Det prøver vi i
«Gå i dybden».

### Hva betyr dette for stoppkravet vårt?

I et iterativt program kan vi kreve

$$\lVert b-Ax_k\rVert_2\le\text{atol}+\text{rtol}\lVert b\rVert_2.$$

`atol` er en absolutt toleranse og `rtol` en relativ toleranse.
Dette setter en grense for residualen, og dermed for bakoverfeilen
med fast $A$. Det garanterer ikke like liten foroverfeil; den avhenger
også av kondisjonstallet og nøyaktigheten i dataene. Vi begrenser i
tillegg antall steg, og rapporterer manglende konvergens hvis
stoppkravet ikke er nådd. En liten endring mellom to iterasjoner
alene er ikke et sikkert stopptegn.

**Hvis relativ residual er $10^{-10}$ og kondisjonstallet er $10^6$,
hvilken øvre grense får dere for relativ feil?**

<details class="reading-step">
<summary>Gå i dybden: normer, feilgrenser og retningen til forstyrrelsen</summary>

**Prøv selv**

1. Finn både 2-normen og Frobenius-normen til $I_2$ og
   $\operatorname{diag}(1,10^{-4})$. Finn også kondisjonstallene.
2. Begrunn at $\kappa_2(cA)=\kappa_2(A)$ når $c\ne0$.
3. Forklar mellomsteget fra de to normulikhetene til den relative
   feilgrensen. Hvorfor må $b$ være ulik null?
4. Finn den nye løsningen i eksperiment 3 uten Python. Hva blir
   foroverfeilen hvis vi i stedet legger $10^{-8}$ til første
   komponent i høyresiden?

**Regnegangen**

For $I_2$ er normene $1$ og $\sqrt2$, mens kondisjonstallet er $1$.
For diagonalmatrisen er normene $1$ og $\sqrt{1+10^{-8}}$,
mens kondisjonstallet er $10^4$. To nesten like normer på $A$ kan
altså høre til svært ulike kondisjonstall: også $A^{-1}$ spiller inn.
Skalering gir $\lVert cA\rVert_2=|c|\lVert A\rVert_2$ og
$\lVert(cA)^{-1}\rVert_2=|c|^{-1}\lVert A^{-1}\rVert_2$;
faktorene kansellerer i produktet.

For feilgrensen bruker vi definisjonen av matrisenormen to ganger:

$$\lVert e\rVert_2\le\lVert A^{-1}\rVert_2\lVert r\rVert_2,
\qquad \lVert b\rVert_2\le\lVert A\rVert_2\lVert x_*\rVert_2.$$

Siste ulikhet gir $1/\lVert x_*\rVert_2\le\lVert A\rVert_2/\lVert b\rVert_2$.
Multiplikasjon gir den relative feilgrensen. Null residual gir null
feil når $A$ er invertibel. For stoppkravseksemplet er grensen
$10^6\cdot10^{-10}=10^{-4}$.

I eksperiment 3 har både den opprinnelige høyresiden og løsningen
lengde $1$. Vi kan derfor lese den relative feilen direkte fra
endringen i løsningen. Sett $\varepsilon=10^{-8}$:

| Hvor legger vi til $\varepsilon$? | Nøyaktig løsning av de endrede likningene | Relativ foroverfeil |
|:--|:--|:--|
| Første komponent i høyresiden | $(1+\varepsilon,0)$ | $\varepsilon$ |
| Andre komponent, som i forsøket | $(1,K\varepsilon)$ | $K\varepsilon$ |

Kontrollerer vi forsøket mot den **opprinnelige** høyresiden,
blir residualen $(0,-\varepsilon)$ og relativ bakoverfeil
$\varepsilon$. Nederste bilde kontrollerer den **endrede**
høyresiden, og viser derfor en annen residual.

**Hva forklarer dette?**

Kondisjonstallet beskriver den største mulige relative forsterkningen,
og det andre valget treffer denne grensen. Grovt kan en forsterkning
på $10^m$ koste omtrent $m$ desimalsifre i relativ nøyaktighet, men
ikke alle forstyrrelser utløser dette tapet. For generelle matriser
må vi bruke strekkfaktorer, ikke bare egenverdier. For eksempel har
$\begin{bmatrix}1&10\\0&1\end{bmatrix}$ begge egenverdier lik $1$,
men kondisjonstall omtrent $102$.

**Når kan vi bruke egenverdiene til å finne kondisjonstallet?**

For reelle symmetriske matriser finnes en ortonormal egenvektorbasis.
Hvis alle egenverdiene er positive, er de også strekkfaktorene i
egenvektorretningene. Da er
$\kappa_2(A)=\lambda_{\max}/\lambda_{\min}$.
Dette er de **symmetrisk positivt definitte** matrisene vi bruker fra 6.4.
For $\begin{bmatrix}3&1\\1&2\end{bmatrix}$ er egenverdiene
$(5\pm\sqrt5)/2$, og kondisjonstallet er omtrent $2.62$.
For en generell matrise kan vi ikke bruke denne egenverdikvotienten;
uke 7 forklarer sammenhengen med singularverdier.

**Et ekstra forsøk: betyr det noe hvilken komponent vi endrer?**

Vi bruker de samme matrisene og samme løser. Tabellen skriver ut
relativ foroverfeil for tre valg av høyreside.

```{pyodide-python}
#| label: week6-conditioning-roundoff
x_fasit = np.array([1., 0.])
b = np.array([1., 0.])
epsilon = 1e-8
print('K          ingen endring    endring i første    endring i andre')
for K in [1., 1e2, 1e4, 1e6, 1e8]:
    A = np.diag([1., 1/K])
    feil = []
    for endring in [[0., 0.], [epsilon, 0.], [0., epsilon]]:
        x = np.linalg.solve(A, b + endring)
        feil.append(np.linalg.norm(x - x_fasit) / np.linalg.norm(x_fasit))
    print(f'{K:9.1e}  {feil[0]:13.2e}  {feil[1]:18.2e}  {feil[2]:17.2e}')
```

Bare endringen i andre komponent forsterkes med $K$. Stor feil er
altså mulig ved stort kondisjonstall, men oppstår ikke for alle
dataendringer. Uten endring får vi eksakt fasit i dette enkle
eksemplet; andre systemer kan også få feil fra flyttallsavrunding.

</details>

## 6.4 Løsningen som minimum

<div id="uke6-energi"></div>

### Fra to likninger til én funksjon

I 6.1 beregnet vi en ny verdi for én ukjent om gangen. I 6.3 brukte vi residualen til
å kontrollere hvor godt likningene var oppfylt. Nå spør vi:
**Kan vi knytte en funksjonsverdi til hver vektor $x$, slik at løsningen
er punktet der funksjonen er minst?** Da kan vi forstå GS geometrisk
og undersøke om andre søkeretninger kan være bedre.

Vi bruker det samme systemet som før:

$$A=\begin{bmatrix}3&1\\1&2\end{bmatrix},\qquad
b=\begin{bmatrix}5\\5\end{bmatrix},\qquad
x=\begin{bmatrix}u\\v\end{bmatrix}.$$

Til denne matrisen og høyresiden knytter vi den **kvadratiske funksjonen**

$$\phi(x)=\tfrac12x^TAx-b^Tx.$$

Her er $x$ en vektor, mens $\phi(x)$ er **ett tall**. Symbolet $\phi$
uttales «fi». Vi regner ut matriseproduktene for å se hvilken vanlig
funksjon av to variabler vi har fått:

$$
Ax=\begin{bmatrix}3u+v\\u+2v\end{bmatrix},\qquad
x^TAx=u(3u+v)+v(u+2v)=3u^2+2uv+2v^2,
$$

$$b^Tx=5u+5v,\qquad
\boxed{\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v.}$$

Diagonalelementene i $A$ bestemmer koeffisientene foran kvadratleddene.
De to like elementene utenfor diagonalen gir til sammen $2uv$ i
$x^TAx$, og faktoren $1/2$ gjør dette til $uv$ i $\phi$.
Høyresiden $b$ bestemmer de lineære leddene. Vi har dermed en konkret
oversettelse mellom **matrise og høyreside** og **funksjonsuttrykk**.

### Hvorfor er løsningen akkurat minimumet?

Å løse $Ax=b$ betyr her å finne $u$ og $v$ som oppfyller **begge**
likningene $3u+v=5$ og $u+2v=5$ samtidig.
Først finner vi disse tallene for hånd. Fra andre likning får
vi $u=5-2v$. Innsetting i første gir $15-5v=5$, altså $v=2$ og $u=1$.
Dermed er

$$x_*=(1,2)^T,\qquad \phi(1,2)=-\tfrac{15}{2}=-7.5.$$

Punktet $(u,v)=(1,2)$ oppfyller altså begge likningene: $3\cdot1+2=5$
og $1+2\cdot2=5$. Men hvorfor skal også $\phi$ være minst akkurat der?
Vi tar et vilkårlig annet punkt $(u,v)$ og beregner hvor mye høyere
funksjonsverdien er. Skriv $p=u-1$ og $q=v-2$ for forskjellene i de
to koordinatene. Ved å sette $u=1+p$ og $v=2+q$ inn i $\phi$ får vi

$$
\begin{aligned}
\phi(u,v)-\phi(1,2)
&=\tfrac32p^2+pq+q^2\\
&=\tfrac32\left(p+\tfrac13q\right)^2+\tfrac56q^2.
\end{aligned}
$$

Begge leddene er ikke-negative, og summen er null bare når $p=q=0$.
**Alle andre punkter har større funksjonsverdi enn $(1,2)$.**
Vi kan derfor formulere oppgaven på to likeverdige måter:

$$\boxed{Ax=b\quad\Longleftrightarrow\quad
x\text{ minimerer }\phi(x)=\tfrac12x^TAx-b^Tx.}$$

Dette gjelder for matrisen vår. Snart skal vi se nøyaktig hvilken
forutsetning på $A$ som gjør at det også gjelder generelt.
Merk at vi **minimerer $\phi$**, ikke prøver å gjøre $\phi$ lik null.
I dette eksemplet er minsteverdien negativ. Funksjonen er heller ikke
residualnormen fra 6.3; det er en annen størrelse med samme
minimumpunkt for dette systemet.

### Hvorfor tegne nivåkurver?

Grafen $z=\phi(u,v)$ er en flate i tre dimensjoner: to koordinater
beskriver forslaget $(u,v)$, og høyden viser funksjonsverdien.
Her danner flaten en skål med bunn i $(1,2,-7.5)$.
Det er nyttig å se høyden, men i et tredimensjonalt bilde kan en bane
på flaten bli vanskelig å følge. Vi vil gjerne se alle forslagene
rett ovenfra, i det samme $(u,v)$-planet der GS flytter seg.

En **nivåmengde** er mengden av punkter som har en bestemt
funksjonsverdi $c$:

$$\{(u,v):\phi(u,v)=c\}.$$

For funksjonen vår er dette en **nivåkurve** når $c>-7.5$.
Tenk på høydekurver på et kart: følg én kurve, og høyden endrer seg
ikke. Geometrisk skjærer vi skålen med planet $z=c$ og tegner
skjæringskurven sett ovenfra. Høyden $c$ står som merking på kurven.

Setter vi inn uttrykket rundt minimumet, får vi

$$\tfrac32(u-1)^2+(u-1)(v-2)+(v-2)^2=c+\tfrac{15}{2}.$$

Dette er ellipser med sentrum $(1,2)$ når høyresiden er positiv.
For $c=-7.5$ består nivåmengden bare av minimumpunktet, og for
$c<-7.5$ er den tom. Kryssleddet gjør at ellipsenes hovedakser ikke
følger koordinataksene.

**Punktene $(0,2)$ og $(2,2)$ har begge funksjonsverdi $-6$.
Hvor vil dere plassere dem på skålen og i nivåkurvebildet?**
De ligger på samme høyde på flaten og på samme ellipse i planet.
Nivåkurvene lar oss altså lese både *hvor vi er* og *hvilken
funksjonsverdi vi har*, uten en tredje akse.

### Eksperiment 4 – samme funksjon, to bilder

Her definerer vi `phi(u, v)` direkte fra uttrykket vi nettopp regnet ut.
`meshgrid` lager et rutenett av $(u,v)$-punkter, og `Z` inneholder
funksjonsverdien i hvert punkt. `plot_surface` tegner høydene, mens
`contour` tegner de valgte nivåkurvene. Negative nivåverdier er helt
naturlige: bunnen ligger på $-7.5$.

```{pyodide-python}
#| label: week6-energy-surface
# Samme phi brukes til både flaten og nivåkurvene.
def phi(u, v):
    return 1.5*u**2 + u*v + v**2 - 5*u - 5*v

u, v = np.meshgrid(np.linspace(-1, 3, 120), np.linspace(-1, 4, 120))
Z = phi(u, v)
fig = plt.figure(figsize=(7, 10))
surface = fig.add_subplot(2, 1, 1, projection='3d')
surface.plot_surface(u, v, Z, cmap='viridis', alpha=.8)
surface.scatter([1], [2], [-7.5], color='red', s=50)
surface.set(xlabel='u', ylabel='v', title='Høyde z = φ(u,v)')
surface.text2D(1.03, .5, 'φ(u,v)', transform=surface.transAxes,
               rotation=90, va='center')

ax = fig.add_subplot(2, 1, 2)
curves = ax.contour(u, v, Z, levels=[-7, -6, -4, 0, 5, 10], cmap='viridis')
ax.clabel(curves, inline=True, fontsize=9)
ax.plot(1, 2, 'r*', markersize=12, label='Minimum (1, 2)')
ax.plot([0, 2], [2, 2], 'ko', label='φ = −6')
ax.set(xlabel='u', ylabel='v', title='Nivåkurver sett ovenfra')
ax.set_aspect('equal'); ax.legend()
# Ekstra høyremarg gir plass til høydeaksens tittel i 3D-bildet.
fig.subplots_adjust(left=.08, right=.83, bottom=.06, top=.95, hspace=.25)
plt.show()
```

**Finn nivåkurven med verdi $-6$. Hvorfor er det ingen ellipse merket
$-8$? Hvor i figuren må en metode ende hvis den skal minimere $\phi$?**

### Hvilke matriser gir en skål med én bunn?

Vi bruker her **symmetrisk positivt definitte (SPD)** matriser:

$$A^T=A,\qquad z^TAz>0\quad\text{for alle }z\ne0.$$

Symmetrien gjør at kryssleddene fra hver side av diagonalen passer
sammen. Positiv definitet betyr at det kvadratiske bidraget er positivt i enhver
ikke-null retning. Kvadratfullføringen ovenfor viser at matrisen vår
har nettopp denne egenskapen.

**Hva får vi igjen for denne forutsetningen?** For enhver SPD-matrise
kan vi løse $Ax=b$ ved å finne minimumet til $\phi$. Det finnes
nøyaktig én løsning, og den er det eneste punktet der $\phi$ er minst.
Vi trenger altså ikke gjenta kvadratfullføringen for hver ny matrise.
Det generelle beviset og et eksempel med tre ukjente står i «Gå i dybden».

Fra uke 5 har vi også en måte å kontrollere kravet på: en reell
symmetrisk matrise er positivt definit akkurat når alle egenverdiene
er positive. I en ortonormal egenvektorbasis er disse egenverdiene
strekkfaktorene. For SPD er derfor
$\kappa_2(A)=\lambda_{\max}/\lambda_{\min}$: stor forskjell mellom
egenverdiene gir en skål som er bratt i én retning og slak i en annen.

Forutsetningen betyr noe. Matrisen
$\begin{bmatrix}1&2\\2&1\end{bmatrix}$ fra 6.2 har positiv diagonal,
men $z^TAz=-2$ for $z=(1,-1)^T$. Den tilhørende funksjonen har ikke en
skål med én bunn. Vi kan derfor ikke tolke ethvert lineært system som
minimering av denne $\phi$.

### Hvorfor er GS minimering langs én retning?

Gå tilbake til $\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v$.
Hold først $v=v_k$ fast og la bare $u$ variere. Da har vi en funksjon
av **én variabel**:

$$g(u)=\phi(u,v_k)
=\tfrac32u^2+(v_k-5)u+\underbrace{v_k^2-5v_k}_{\text{konstant når }v_k\text{ er fast}}.$$

Grafen til $g$ er en oppovervendt parabel. Derivasjon gir

$$g'(u)=3u+v_k-5=0
\quad\Longrightarrow\quad u_{k+1}=\frac{5-v_k}{3}.$$

Siden $g''(u)=3>0$, er dette minimum langs hele den horisontale linjen
$v=v_k$. Det er nøyaktig den første GS-oppdateringen.
Vi holder så **den nye** $u=u_{k+1}$ fast og minimerer langs den
vertikale linjen:

$$h(v)=\phi(u_{k+1},v),\qquad
h'(v)=u_{k+1}+2v-5=0
\quad\Longrightarrow\quad v_{k+1}=\frac{5-u_{k+1}}2.$$

Også dette er et minimum, fordi $h''(v)=2>0$.
**GS løser altså et lite minimeringsproblem for hver koordinat.**
«Én retning» betyr her at vi lar én koordinat variere fritt, mens de
andre står fast. Vi velger det beste punktet langs denne linjen.
Vi beveger oss ikke nødvendigvis i retningen for brattest nedgang.

Fra startpunktet $(0,0)$ blir første sveip:

| Punkt | Hva er nettopp minimert? | Funksjonsverdi |
|:--|:--|:--|
| $(0,0)$ | Startforslag | $0$ |
| $(5/3,0)$ | $\phi(u,0)$ over alle $u$ | $-25/6\approx-4.167$ |
| $(5/3,5/3)$ | $\phi(5/3,v)$ over alle $v$ | $-125/18\approx-6.944$ |
| $(1,2)$ | Minimum over begge variablene samtidig | $-15/2=-7.5$ |

Den siste raden er målet, ikke neste GS-steg. Etter første sveip er
vi lavere i skålen, men ennå ikke på bunnen. Endringen av $v$ har
endret hvilken $u$ som er best: $3u+v-5$ er ikke lenger null.
Vi må derfor minimere på nytt langs $u$ og fortsette med flere sveip.
Dette er den geometriske forklaringen på at en likning kan bli
forstyrret igjen, slik vi så i 6.1.

### GS-banen i nivåkurvebildet – hva er `bowl_plot`?

`bowl_plot` er en hjelper i sidens Python-oppsett som tegner nivåkurvene
til $\phi$ og den ferdig beregnede GS-banen. Stjernen er en direkte
beregnet referanseløsning; den brukes ikke av GS-iterasjonen.
Nå beholder vi hvert koordinatsteg, så de horisontale og vertikale
bevegelsene blir synlige. Figuraksene $x_1,x_2$ er våre $u,v$.

```{pyodide-python}
#| label: week6-coordinate-energy
A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 5.])
path = gs_path(A, b, [0., 0.], sweeps=3)
fig, ax = plt.subplots()
bowl_plot(ax, A, b, {'GS': path})
ax.set_title('GS minimerer langs én koordinatretning om gangen')
plt.show()

# Samme phi som i figuren over, skrevet direkte som et NumPy-uttrykk.
energies = 1.5*path[:,0]**2 + path[:,0]*path[:,1] + path[:,1]**2 - 5*path[:,0] - 5*path[:,1]
print('Første sveip: start, etter u, etter v')
for point, value in zip(path[:3], energies[:3]):
    print(point, f'φ = {value:.6f}')
```

**Hvilke linjer minimerer de to første stegene langs? Hvorfor fortsetter
ikke første steg helt til sentrum av ellipsene?** Å gå lenger langs
samme linje ville økt funksjonen igjen; sentrum ligger på en annen
linje. I dette SPD-problemet kan funksjonsverdien aldri øke ved et
eksakt GS-steg, og den avtar strengt når koordinaten faktisk endres.
Dette er et utsagn om $\phi$, ikke om at residualnormen nødvendigvis
avtar i hvert koordinatsteg.

GS minimerer langs koordinataksene. **Kan vi velge andre linjer som tar
oss raskere mot minimumet?** I 6.5 bruker vi funksjonens helninger til
å velge retning. I 6.6 undersøker vi hvordan CG kan bevare det vi
allerede har oppnådd i tidligere retninger.

<details class="reading-step">
<summary>Gå i dybden: tre ukjente og den generelle minimeringen</summary>

**Prøv selv**

1. For det todimensjonale eksemplet: regn ut $\phi$ i de tre første
   punktene i tabellen, og finn neste GS-mellompunkt etter $(5/3,5/3)$.
2. La
   $$A=\begin{bmatrix}4&1&0\\1&3&1\\0&1&2\end{bmatrix},\qquad
   b=\begin{bmatrix}6\\10\\8\end{bmatrix},\qquad x=(u,v,w)^T.$$
   Skriv $\phi(u,v,w)=\tfrac12x^TAx-b^Tx$ uten matriseprodukter.
   Hvilke kryssledd finnes, og hvorfor mangler $uw$?
3. Kontroller at $x_*=(1,2,3)^T$ løser systemet. Finn $\phi(x_*)$,
   og gjør ett GS-sveip fra null ved å minimere i $u$, deretter $v$,
   deretter $w$.
4. Utled $\phi(x)-\phi(x_*)=\tfrac12(x-x_*)^TA(x-x_*)$ for SPD.
   Hvor bruker dere symmetrien, og hvor bruker dere positiv definitet?

**Regnegangen – det fullstendige $3\times3$-eksemplet**

Matriseproduktet gir

$$Ax=\begin{bmatrix}4u+v\\u+3v+w\\v+2w\end{bmatrix},\qquad
x^TAx=4u^2+2uv+3v^2+2vw+2w^2.$$

Dermed er funksjonen

$$\boxed{\phi(u,v,w)=2u^2+uv+\tfrac32v^2+vw+w^2-6u-10v-8w.}$$

Koeffisientene foran $u^2,v^2,w^2$ er halvparten av
$4,3,2$ på diagonalen. Hvert symmetrisk par utenfor diagonalen
bidrar til ett kryssledd: $a_{12}=a_{21}=1$ gir $uv$, og
$a_{23}=a_{32}=1$ gir $vw$. Fordi $a_{13}=a_{31}=0$, er det ikke
noe $uw$-ledd. Vi kan også gå motsatt vei: dobler vi
kvadratkoeffisientene og plasserer krysskoeffisientene symmetrisk,
får vi tilbake $A$. De lineære koeffisientene er $-b_i$.

For å kontrollere SPD lar vi $z=(p,q,s)^T$. Kvadratfullføring gir

$$z^TAz=4(p+q/4)^2+\tfrac{11}{4}(q+4s/11)^2+\tfrac{18}{11}s^2.$$

Alle koeffisientene er positive. Summen kan være null bare hvis først
$s=0$, deretter $q=0$ og til slutt $p=0$. Matrisen er altså SPD.

Likningssystemet er

$$4u+v=6,\qquad u+3v+w=10,\qquad v+2w=8.$$

Første og tredje likning gir $u=(6-v)/4$ og $w=(8-v)/2$.
Setter vi disse inn i andre, får vi

$$\frac{6-v}{4}+3v+\frac{8-v}{2}=10
\quad\Longrightarrow\quad 22+9v=40.$$

Dermed er $v=2$, $u=1$ og $w=3$, som lovet.
Vi kontrollerer $Ax_*=(6,10,8)^T=b$ og finner

$$\phi(x_*)=-\tfrac12b^Tx_*=-\tfrac12(6+20+24)=-25.$$

La nå $p=u-1$, $q=v-2$ og $s=w-3$. Forskjellen fra minsteverdien er

$$\phi(u,v,w)+25
=\tfrac12\left[4(p+q/4)^2+\tfrac{11}{4}(q+4s/11)^2+\tfrac{18}{11}s^2\right].$$

Dette viser direkte at $(1,2,3)$ er det eneste minimumet.
Grafen til en funksjon av tre variabler trenger **fire koordinater**:
$(u,v,w,\phi(u,v,w))$. Den kan derfor ikke tegnes som den vanlige
skålflaten i forsøket over. Men nivåmengdene $\phi(u,v,w)=c$ ligger i
vanlig tredimensjonalt rom. For $c>-25$ er de **ellipsoideflater**,
for $c=-25$ ett punkt og for $c<-25$ tomme. Nivåmengder lar oss igjen
beskrive funksjonen med én dimensjon mindre enn selve grafen.

Vi kan også holde $w=3$ fast og studere snittet

$$\phi(u,v,3)=2u^2+uv+\tfrac32v^2-6u-7v-15.$$

Dette er en funksjon av to variabler som kan tegnes som en skål.
Den viser bare punktene i planet $w=3$, ikke hele funksjonen av tre
variabler. Sammenhengen med matrisen er fortsatt synlig: $vw$ blir
$3v$, mens $w^2-8w$ blir konstanten $-15$.

GS minimerer nå langs tre koordinatretninger. De partiellderiverte gir

$$
\begin{aligned}
4u+v-6=0&\quad\Longrightarrow\quad u_{k+1}=(6-v_k)/4,\\
u+3v+w-10=0&\quad\Longrightarrow\quad v_{k+1}=(10-u_{k+1}-w_k)/3,\\
v+2w-8=0&\quad\Longrightarrow\quad w_{k+1}=(8-v_{k+1})/2.
\end{aligned}
$$

Andrederivertene langs disse linjene er henholdsvis $4$, $3$ og $2$,
så hvert uttrykk gir et minimum. Fra nullstart blir koordinatstegene

$$(0,0,0)\longmapsto(3/2,0,0)
\longmapsto(3/2,17/6,0)\longmapsto(3/2,17/6,31/12).$$

Verdien synker ved hvert steg, men etter ett sveip er vi ennå ikke
ved $(1,2,3)$. Minimering langs hver linje bruker de andre koordinatene
slik de er akkurat da, og de vil endres senere i sveipet.

I oppgave 1 er funksjonsverdiene $0,-25/6,-125/18$. Neste
mellompunkt blir $(10/9,5/3)$: bare $u$ endres i dette steget.

**Hva forklarer dette? – fra eksemplene til generell SPD**

Sett $x=x_*+e$. Når $A^T=A$, er de to kryssleddene like:
$x_*^TAe=e^TAx_*$. Derfor får vi

$$
\begin{aligned}
\phi(x_*+e)
&=\tfrac12(x_*+e)^TA(x_*+e)-b^T(x_*+e)\\
&=\phi(x_*)+e^TAx_*-b^Te+\tfrac12e^TAe\\
&=\phi(x_*)+\tfrac12e^TAe.
\end{aligned}
$$

Siste likhet bruker $Ax_*=b$. Positiv definitet gjør at det siste
leddet er strengt positivt når $e\ne0$. Det beviser minimeringen.
Med egenverdidekomposisjonen $A=Q\Lambda Q^T$ og $y=Q^Te$ blir

$$\phi(x)-\phi(x_*)=\tfrac12\sum_i\lambda_i y_i^2.$$

Egenvektorene gir hovedretningene til ellipsene eller ellipsoidene.
En liten positiv egenverdi betyr at funksjonen stiger langsomt i den
retningen; en stor egenverdi betyr rask stigning. Dette forklarer
hvorfor forholdet mellom egenverdiene påvirker formen på skålen i 6.5.

Til slutt kan vi utlede GS-korreksjonen i alle dimensjoner.
La $e_i$ være vektoren med $1$ på plass $i$ og $0$ ellers, og la $x$
være det **gjeldende** forslaget, inkludert koordinatene som allerede
er oppdatert. Langs linjen $x+t e_i$ er

$$\phi(x+t e_i)=\phi(x)+t(Ax-b)_i+\tfrac12t^2a_{ii}.$$

Dette er en parabel i $t$. For SPD er $a_{ii}>0$, så minimum finnes ved

$$(Ax-b)_i+t a_{ii}=0
\quad\Longrightarrow\quad t=\frac{b_i-(Ax)_i}{a_{ii}}.$$

Oppdateringen $x_i\leftarrow x_i+t$ er akkurat GS-korreksjonen i 6.1.
Den endrer funksjonsverdien med

$$\phi(x+t e_i)-\phi(x)=-\frac{(b_i-(Ax)_i)^2}{2a_{ii}}\le0.$$

Likhet betyr at koordinaten allerede er optimal langs den valgte
linjen. Bare når **alle** komponentene i $Ax-b$ er null samtidig,
har vi nådd hele problemets minimum. Jacobi beregner alle
koordinatforslagene med gamle verdier; vi kan derfor ikke uten videre
overføre argumentet om påfølgende minimeringer til Jacobi.

**Hva gjør plottehjelperen?**

`bowl_plot` er ikke en innebygd NumPy-funksjon eller en ny numerisk
metode. Navnet viser til skålformen. Kallet
`bowl_plot(ax, A, b, paths)` gjør følgende:

- beregner $\tfrac12x^TAx-b^Tx$ på et rutenett og tegner nivåkurvene
  i tegnefeltet `ax`, slik `contour` gjorde i det første forsøket;
- tegner de ferdig beregnede banene i `paths`, med navn som forklaring;
- markerer løsningen med en stjerne. Den bruker `np.linalg.solve`
  bare for dette referansepunktet; GS-banen beregnes av `gs_path`.

Hjelperen brukes her for symmetriske $2\times2$-matriser.
`{'GS': path}` betyr «tegn punktene i `path` og kall banen GS».
Matrisen og høyresiden bestemmer nivåkurvene, mens `path` bestemmer
hvilke løsningsforslag som forbindes i figuren.

</details>

## 6.5 Fra skål til søkeretning

<div id="uke6-retning"></div>

### Vi kan velge andre linjer enn koordinataksene

I 6.4 så vi at GS går nedover skålen ved å minimere langs én
koordinatretning om gangen. Men koordinataksene er valgt av oss;
de trenger ikke passe spesielt godt til skålen. Nå vil vi velge
retning ut fra **hvordan funksjonen endrer seg der vi står**.

Tenk at nivåkurvene er høydekurver på et kart. Vi kjenner ikke veien
til bunnen, men vi kan måle helningen i nærheten av vårt nåværende
punkt. To spørsmål må besvares før vi tar et steg:

1. **Hvilken retning skal vi gå i?**
2. **Hvor langt skal vi gå langs denne retningen?**

Disse valgene er forskjellige. En god retning gir ikke automatisk
en god steglengde. Går vi for langt, kan vi passere det laveste punktet
på linjen og begynne å gå oppover igjen.

### Hvor kommer gradienten fra?

Vi bruker fremdeles funksjonen fra 6.4:

$$\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v.$$

Hold $v$ fast og deriver med hensyn på $u$. Dette gir helningen i
horisontal retning. Holder vi $u$ fast, får vi helningen i vertikal
retning. Disse to **partiellderiverte** er

$$\frac{\partial\phi}{\partial u}=3u+v-5,\qquad
\frac{\partial\phi}{\partial v}=u+2v-5.$$

Vi samler dem i en vektor, **gradienten**:

$$\nabla\phi(u,v)=\begin{bmatrix}3u+v-5\\u+2v-5\end{bmatrix}.$$

Dette er den samme vektoren som $Ax-b$. Vi har altså ikke innført
nye data: helningene kan regnes ut fra matrisen og det gjeldende punktet $x=(u,v)^T$.
Med residualkonvensjonen $r=b-Ax$ får vi

$$\boxed{\nabla\phi(x)=Ax-b=-r.}$$

Et **steg** betyr nå en endring i koordinatene: fra $x=(u,v)^T$ til
$x+h=(u+h_u,v+h_v)^T$. Vektoren $h=(h_u,h_v)^T$ beskriver bevegelsen
i planet. Dette må skilles fra endringen i **funksjonsverdi**,
$\phi(x+h)-\phi(x)$.

Fra derivasjon i én variabel kjenner vi «endring omtrent lik
derivert ganger endring i variabelen». For små endringer i begge
koordinatene legger vi sammen bidragene:

$$\phi(u+h_u,v+h_v)-\phi(u,v)
\approx \frac{\partial\phi}{\partial u}h_u
+\frac{\partial\phi}{\partial v}h_v
=\nabla\phi(x)^Th.$$

Vi sammenligner små steg med **samme lengde**. Indreproduktet blir
mest negativt når steget peker motsatt gradienten. Derfor gir
$-\nabla\phi(x)=r$ den bratteste lokale nedgangen i funksjonsverdi.
Begrunnelsen med Cauchy–Schwarz står i «Gå i dybden».

### Se forskjellen mellom nedoverretningen og veien til løsningen

I startpunktet $x_0=(0,0)^T$ er gradienten $(-5,-5)^T$ og residualen
$r_0=(5,5)^T$. Et lite steg i residualens retning øker derfor både
$u$ og $v$. Likevel **synker** $\phi$: «nedover» viser til høyden på
skålen, ikke til nedover på arket.

```{pyodide-python}
#| label: week6-gradient-direction
A = np.array([[3.,1.], [1.,2.]])
b = np.array([5.,5.])
fig, ax = plt.subplots(figsize=(6.5,5.5))
bowl_plot(ax, A, b, {}, bounds=(-.4,2.5,-.4,2.7))
ax.plot(0, 0, 'ko')
ax.annotate('x₀ = (0, 0)', (0,0), xytext=(7,-18), textcoords='offset points')
# Pilen viser retningen (5,5), forkortet for å passe i figuren.
ax.annotate('', xy=(1.4,1.4), xytext=(0,0),
            arrowprops=dict(arrowstyle='->', color='#2563eb', lw=2))
ax.text(1.45,1.25, 'r₀-retning', color='#2563eb')
ax.plot([0,1], [0,2], '--', color='#c2410c', label='Rett linje til løsningen')
ax.set(xlabel='u', ylabel='v', title='Brattest ned her er ikke rett mot bunnen')
ax.legend(loc='upper right'); fig.tight_layout(); plt.show()
```

Den blå pilen viser residualens retning; lengden er forkortet for å
passe i figuren. Den stiplede linjen går rett til $x_*=(1,2)^T$.
Dette er to forskjellige retninger. Vi kjenner løsningen i dette
lille eksemplet og kan tegne den som referanse; metoden bruker bare
$A$, $b$ og sitt nåværende punkt til å beregne den blå retningen.

**Hvorfor peker ikke den blå pilen rett på stjernen?** Gradienten
beskriver helningen akkurat der vi står. Helningen endres når vi
flytter oss. Vi må derfor skille mellom retningen som gir brattest
lokal nedgang og retningen til bunnen av hele skålen.

### Fra retning til det beste punktet på linjen

La $x$ være punktet vi har kommet til, altså vår nåværende tilnærming
til løsningen av $Ax=b$. Vi vil finne et nytt punkt med mindre
funksjonsverdi. Først velger vi en vektor $p\ne0$ som
**søkeretning**. Så begrenser vi letingen til linjen gjennom $x$:

$$x_{\mathrm{ny}}=x+\alpha p.$$

For hver verdi av tallet $\alpha$ får vi ett punkt på linjen. Vi setter
punktet inn i $\phi$ og velger den $\alpha$-verdien som gir minst
funksjonsverdi. Dette kalles et **linjesøk**. Vi finner det beste
punktet på denne ene linjen, ikke nødvendigvis minimumet i hele planet.

Bevegelsen fra gammelt til nytt punkt er
$x_{\mathrm{ny}}-x=\alpha p$. Derfor er avstanden vi flytter oss

$$\lVert x_{\mathrm{ny}}-x\rVert_2
=\lVert\alpha p\rVert_2=|\alpha|\lVert p\rVert_2.$$

$\alpha$ er altså en faktor vi ganger $p$ med. Bare når $p$ har
lengde $1$, er $|\alpha|$ også avstanden. For eksempel gir
$p=(5,5)^T$ og $\alpha=0.2$ bevegelsen $(1,1)^T$, med lengde
$\sqrt2$, ikke $0.2$.

Fra $x_0=(0,0)^T$ velger vi $p_0=r_0=(5,5)^T$. Punktene på linjen
er $(5\alpha,5\alpha)$. Setter vi disse inn i $\phi$, får vi

$$\psi(\alpha)=\phi(5\alpha,5\alpha)
=\tfrac{175}{2}\alpha^2-50\alpha.$$

For å finne minimum deriverer vi: $\psi'(\alpha)=175\alpha-50=0$
gir $\alpha_0=2/7$. Koeffisienten foran $\alpha^2$ er positiv, så
punktet er parabelens minimum. Dermed er første nye punkt
$x_1=(10/7,10/7)^T$. Det er det beste punktet på linjen $u=v$,
men det er ennå ikke minimumet $(1,2)$ i hele planet.

### Eksperiment 5a – ett steg, sett på to måter

Vi skal velge **hvor langt vi går i retningen $p_0=(5,5)^T$**.
Retningen er allerede bestemt; forsøket skal vise hvordan linjesøket
velger neste punkt. Følg samme valg av $\alpha$ i begge bildene:

| $\alpha$ | Punktet $x_0+\alpha p_0$ i planet | Høyden $\psi(\alpha)$ |
|:--|:--|:--|
| $0$ | $(0,0)$ | $0$ |
| $0.2$ | $(1,1)$ | $-6.5$ |
| $2/7$ | $(10/7,10/7)$ | $-50/7\approx-7.143$ |
| $0.4$ | $(2,2)$ | $-6$ |

Øverste bilde viser **hvor punktene ligger** i $(u,v)$-planet.
Nederste bilde viser **hvilken funksjonsverdi de har**, som en parabel
med $\alpha$ på vannrett akse. Det blå punktet på parabelen og
$x_1$ i øverste bilde er samme valg, $\alpha=2/7$.

**Forutsi:** Hvorfor gir $\alpha=0.4$ et dårligere punkt enn $2/7$,
selv om vi har gått lenger fra start? Vi tegner også hele skålens
minsteverdi $-7.5$ som sammenligning. Den verdien kan vi ikke nå langs
linjen $u=v$, fordi løsningen $(1,2)$ ikke ligger på den.

```{pyodide-python}
#| label: week6-line-search
A = np.array([[3.,1.], [1.,2.]])
b = np.array([5.,5.])
x0 = np.zeros(2)
p0 = b - A @ x0
alpha0 = (p0 @ p0)/(p0 @ A @ p0)
x1 = x0 + alpha0*p0
fig, axes = plt.subplots(2, 1, figsize=(7, 9))
bowl_plot(axes[0], A, b, {'Første steg':np.array([x0,x1])},
          bounds=(-.5,2.7,-.5,3.2))
axes[0].plot([-.5,2.7], [-.5,2.7], '--', color='#2563eb', alpha=.5)
# Tegn akkurat nivåkurven gjennom x1, som søkelinjen tangerer.
u, v = np.meshgrid(np.linspace(-.5,2.7,220), np.linspace(-.5,3.2,220))
Z = 1.5*u**2 + u*v + v**2 - 5*u - 5*v
axes[0].contour(u, v, Z, levels=[-50/7], colors=['#c2410c'], linewidths=2)
r1 = b - A @ x1
arrow_end = x1 + .5*r1/np.linalg.norm(r1)
axes[0].annotate('', xy=arrow_end, xytext=x1,
                 arrowprops=dict(arrowstyle='->', color='#15803d', lw=2))
axes[0].annotate('r₁', arrow_end, xytext=(-12,5), textcoords='offset points', color='#15803d')
axes[0].annotate('x₀', x0, xytext=(8,-14), textcoords='offset points')
axes[0].annotate('x₁: best på linjen', x1, xytext=(-90,-28), textcoords='offset points')
axes[0].set(xlabel='u', ylabel='v', title='Retning p₀ = r₀: linjen u = v')
alpha = np.linspace(-.05, .6, 250)
psi = 87.5*alpha**2 - 50*alpha
axes[1].plot(alpha, psi, label='ψ(α) = φ(x₀ + αp₀)')
axes[1].plot(alpha0, -50/7, 'o', color='#2563eb', label='Linjens minimum')
axes[1].axvline(alpha0, color='#2563eb', ls=':', label='α₀ = 2/7')
axes[1].axhline(-7.5, color='black', ls='--', label='Hele skålens minimum: −7.5')
axes[1].set(xlabel='α', ylabel='Funksjonsverdi', title='Hvor langt bør vi gå?')
axes[1].legend(fontsize=8); axes[1].grid(alpha=.2)
fig.tight_layout(); plt.show()
```

**Følg steget i begge bilder.** Når $\alpha$ øker fra null, går vi
langs den blå linjen i øverste bilde og nedover parabelen i nederste.
Ved $\alpha=2/7$ er videre bevegelse langs samme linje ingen forbedring.
Den stiplede vannrette linjen i nederste bilde ligger enda litt lavere:
minimumet i hele planet er ikke tilgjengelig langs den valgte linjen.
Vi må velge en ny retning.

Den oransje nivåkurven går gjennom $x_1$ og berører søkelinjen der.
Den grønne pilen viser retningen til neste residual $r_1$; lengden er
tilpasset figuren. Gradienten, og dermed også residualen, står
vinkelrett på nivåkurven. Pilen står derfor vinkelrett på søkelinjen
i dette punktet. Slik ser vi hvorfor et eksakt linjesøk gir en ny
residual som er ortogonal til den første søkeretningen.

### Bratteste nedstigning: mål helningen på nytt

Den enkleste oppskriften er å gjenta samme idé: beregn residualen i
det nye punktet, bruk den som retning, og finn minimum langs den nye
linjen. Dette kalles **bratteste nedstigning med eksakt linjesøk**.

I vårt eksempel er den nye residualen $r_1=(-5/7,5/7)^T$.
Den peker mot venstre og oppover. Metoden husker ikke retningen fra
forrige steg; den følger bare den nye lokale helningen.

Dette gir alltid en lavere funksjonsverdi før vi er framme, i eksakt
regning for SPD. Men det kan gi mange små forbedringer. På en smal
skål kan metoden gå på kryss og tvers av dalen i stedet for raskt
langs den mot bunnen.

### Eksperiment 5b – rund eller smal skål?

Nå sammenligner vi to nye systemer. Begge får den kjente løsningen
$x_*=(1,-1.1)^T$ og startvektoren $(0,0)^T$. Vi lager $b=Ax_*$ for
hver matrise. Egenvektorretningene er de samme; bare egenverdiene endres.
I øverste bilde er begge egenverdiene $1$, slik at nivåkurvene er sirkler.
I nederste bilde er egenverdiene $1$ og $0.04$, slik at nivåkurvene er
ellipser. Kondisjonstallene er henholdsvis $1$ og $25$.

**I hvilket bilde tror dere residualen peker rett mot løsningen?**

```{pyodide-python}
#| label: week6-steepest-descent
Q = np.array([[1.,-1.],[1.,1.]])/np.sqrt(2)
star = np.array([1.,-1.1])
fig, axes = plt.subplots(2, 1, figsize=(7, 9))
for ax, small in zip(axes, [1., .04]):
    A = Q @ np.diag([1.,small]) @ Q.T
    b = A @ star
    path = descent_path(A, b, [0.,0.], steps=16)
    bowl_plot(ax, A, b, {'Bratteste nedstigning':path},
              bounds=(-.5,1.5,-1.5,.5))
    ax.annotate('start', (0,0), xytext=(8,8), textcoords='offset points')
    ax.set_title(f'κ₂(A) = {1/small:g}: {len(path)-1} steg vist')
fig.tight_layout(); plt.show()
```

I øverste bilde treffer ett linjesøk bunnen. For $A=I$ er
$r=b-x=x_*-x$, altså nøyaktig vektoren fra gjeldende punkt til løsningen.
I nederste bilde er residualen påvirket av ulik skalering i de to
egenretningene. Banen skifter retning ved hvert markerte punkt,
men bruker mange steg på å nærme seg stjernen.

Hvert linjesøk er optimalt på sin linje. Det er **valget av neste
linje** som gjør hele banen langsom. I 6.6 spør vi om det neste
linjesøket kan velges slik at vi slipper å lete i den gamle retningen
på nytt. Dette leder til CG.

<details class="reading-step">
<summary>Gå i dybden: fra partiellderiverte til eksakt linjesøk</summary>

**Prøv selv**

1. Regn ut $\nabla\phi(0,0)$ og $\nabla\phi(10/7,10/7)$.
   Kontroller at $r_0^Tr_1=0$.
2. Deriver $\psi(\alpha)$ i første forsøk. Finn minimumsverdien,
   og sammenlign med $\phi(1,2)$.
3. Vis formelen for $\phi(x+\alpha p)$ nedenfor, og finn beste $\alpha$.
4. Forklar med Cauchy–Schwarz hvorfor negativ gradient gir brattest
   lokal nedgang når vi sammenligner retninger med lengde $1$.

**Regnegangen**

Gradientene er $(-5,-5)^T$ og $(5/7,-5/7)^T$. Derfor er
$r_0^Tr_1=(5,5)(-5/7,5/7)^T=0$.
Videre er $\psi'(\alpha)=175\alpha-50$, så $\alpha_0=2/7$.
Linjens minsteverdi er $-50/7\approx-7.143$, mens hele skålens
minsteverdi er $-7.5$.

For en generell SPD-matrise utvider vi rundt det gjeldende punktet $x$.
Symmetrien samler kryssleddene, og $r=b-Ax$ gir

$$\phi(x+\alpha p)=\phi(x)-\alpha p^Tr+\tfrac12\alpha^2p^TAp.$$

Når $p\ne0$, er $p^TAp>0$. Derivasjon med hensyn på $\alpha$ gir

$$\alpha_* = \frac{p^Tr}{p^TAp}.$$

For bratteste nedstigning velger vi $p=r$, og får
$\alpha_*=(r^Tr)/(r^TAr)$. Hjelperen `descent_path` i forsøket
bruker denne formelen, beregner ny residual og gjentar.
Det nye punktet oppfyller $p^T(Ax_{\mathrm{ny}}-b)=0$,
altså $p^Tr_{\mathrm{ny}}=0$. Denne ortogonaliteten følger av
linjesøket; den sier ikke at to vilkårlige nedstigningssteg er vinkelrette.

**Hva forklarer dette?**

For et lite steg $h$ gjelder

$$\phi(x+h)-\phi(x)=\nabla\phi(x)^Th+\tfrac12h^TAh.$$

Det første leddet beskriver den lokale helningen; det siste er
kvadratisk i steglengden. Sett $h=td$ med $\lVert d\rVert_2=1$.
Den deriverte ved $t=0$ er $\nabla\phi(x)^Td$, og Cauchy–Schwarz gir

$$\nabla\phi(x)^Td\ge-\lVert\nabla\phi(x)\rVert_2.$$

For ikke-null gradient oppnås likhet ved
$d=-\nabla\phi(x)/\lVert\nabla\phi(x)\rVert_2$.
Dette beviser påstanden om brattest nedgang per lengdeenhet.
Langs en nivåkurve er funksjonsendringen null, så tangentretningen
står vinkelrett på gradienten. Ved minimum er gradienten null,
og vi trenger ingen ny søkeretning.

</details>

## 6.6 Konjugert gradient

<div id="uke6-cg"></div>

### Først: hva har ett linjesøk gitt oss?

Vi skal fortsatt løse $Ax=b$ ved å gjøre $\phi(x)$ minst mulig.
Matrisen er $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$ og $b=(5,5)^T$.
Fra $x_0=(0,0)^T$ gikk vi langs $p_0=(5,5)^T$, altså linjen $u=v$.
Linjesøket ga $x_1=(10/7,10/7)^T$.

Fra $x_1$ hjelper det ikke å gå videre eller tilbake langs $u=v$:
alle andre punkter på **denne linjen** har større funksjonsverdi.
Men vi er ikke ferdige, for stjernen $(1,2)$ ligger lavere og utenfor
linjen. Vi må velge en ny retning.

Bratteste nedstigning bruker den nye residualen. CG velger den nye
retningen slik at vi slipper å gjøre om igjen minimeringen i den
første retningen. For å forstå hva dette betyr, ser vi først på
flere linjer som er parallelle med $u=v$.

### Én linje, ett minimum – flere linjer, flere minimumspunkter

Tenk at vi flytter linjen $u=v$ parallelt med seg selv. På hver av
disse linjene finnes ett punkt der $\phi$ er minst. De oransje
punktene i figuren er slike **minimum på hver sin linje**.
Bare ett av dem er også minimum i hele planet.

```{pyodide-python}
#| label: week6-parallel-minima
A = np.array([[3.,1.], [1.,2.]])
b = np.array([5.,5.])
fig, ax = plt.subplots(figsize=(6.5,5.5))
bowl_plot(ax, A, b, {}, bounds=(.35,2.1,.65,2.65))
u = np.linspace(.35,2.1,180)
for c in [-.4, 0., .5, 1.]:
    ax.plot(u, u+c, color='#2563eb', alpha=.5, lw=1.3,
            label='Parallelle søkelinjer' if c == -.4 else None)
    point = np.array([(10-3*c)/7, (10+4*c)/7])
    ax.plot(*point, 'o', color='#c2410c', markersize=7,
            label='Minimum på hver sin linje' if c == -.4 else None)
ax.plot(u, (10-4*u)/3, '--', color='#15803d', label='Linjen gjennom minimumspunktene')
ax.annotate('x₁', (10/7,10/7), xytext=(10,-18), textcoords='offset points')
ax.set(xlabel='u', ylabel='v', title='Minimer langs hver blå linje')
ax.legend(loc='upper right', fontsize=8); fig.tight_layout(); plt.show()
```

**Velg et oransje punkt.** Hvis vi flytter oss fra dette punktet i
begge retninger langs dets blå linje, går funksjonsverdien opp.
Vi har gjort oss ferdige med letingen langs akkurat den linjen.
I dette eksemplet ligger alle slike minimumspunkter på den grønne
linjen $4u+3v=10$. Likningen utledes i «Gå i dybden».

Nå blir målet konkret: **Fra $x_1$ vil vi gå til et nytt punkt som
også er best på sin egen blå linje.** Vi beholder ikke samme punkt
eller samme funksjonsverdi. Vi beholder egenskapen «ingen forbedring
ved å gå i den gamle retningen». Derfor skal den nye retningen følge
den grønne linjen.

Den grønne linjen er **ikke en nivåkurve**. Funksjonsverdien varierer
langs den; hver oransje prikk er minimum på en annen blå linje.
Stjernen er lavest av alle. De grå ellipsene er nivåkurvene.

### Sammenlign to valg for neste retning

Vi tegner nå **begge metodene i samme koordinatplan**. Begge har kommet
til $x_1$ etter første linjesøk. Derfra tar de ulike andre steg:
bratteste nedstigning følger den nye residualen, mens CG følger den
grønne linjen gjennom minimumspunktene.

Start med den svarte prikken $x_1$ i figuren, og følg de to pilene.
Den **oransje pilen** ender i $S$, punktet bratteste nedstigning kommer
til. Den **grønne pilen** ender i stjernen, der CG kommer til løsningen.
Pilene viser bare andre steg; startpunktet $x_0=(0,0)^T$ ligger utenfor
utsnittet. Aksene viser koordinatene $u$ og $v$, og de grå kurvene er
nivåkurver for $\phi$.

```{pyodide-python}
#| label: week6-cg-preservation
A = np.array([[3.,1.], [1.,2.]])
b = np.array([5.,5.])
sd_two = descent_path(A, b, [0.,0.], steps=2)
cg_two = cg(A, b, rtol=1e-12)['path']
first = sd_two[1]
S = sd_two[2]
solution = cg_two[2]

# M er minimum på linjen gjennom S i den gamle retningen (1,1).
# Det er et sammenligningspunkt, ikke et ekstra steg i noen av banene.
old_direction = np.array([1.,1.])
t = old_direction @ (b-A@S) / (old_direction @ A @ old_direction)
M = S + t*old_direction

fig, ax = plt.subplots(figsize=(7.5,7.5))
bowl_plot(ax, A, b, {}, bounds=(.78,1.60,1.28,2.16))
ax.get_legend().remove()
for collection in ax.collections:
    collection.set_alpha(.45)
u = np.linspace(.78,1.60,200)
ax.plot(u, (10-4*u)/3, '--', color='#15803d', lw=1.5)
# Denne blå linjen er parallell med den første søkeretningen.
u_blue = np.linspace(.84,1.16,100)
ax.plot(u_blue, u_blue+S[1]-S[0], ':', color='#2563eb', lw=1.8)

for end, color in [(S, '#c2410c'), (solution, '#15803d')]:
    ax.annotate('', xy=end, xytext=first,
                arrowprops=dict(arrowstyle='->', color=color, lw=2.5,
                                shrinkA=5, shrinkB=7, mutation_scale=15))
ax.plot(*first, 'o', color='#111827', markersize=7, zorder=5)
ax.plot(*S, 'o', color='#c2410c', markersize=7, zorder=5)
ax.plot(*M, 'o', markerfacecolor='white', markeredgecolor='#2563eb',
        markeredgewidth=1.8, markersize=7, zorder=5)
ax.plot(*solution, '*', color='black', markersize=13, zorder=6)

label_box = dict(facecolor='white', edgecolor='none', alpha=.9, pad=2)
ax.annotate('x₁: felles utgangspunkt', first, xytext=(1.17,1.34),
            fontsize=11, bbox=label_box,
            arrowprops=dict(arrowstyle='-', color='#64748b'))
ax.annotate('S: bratteste\nnedstigning', S, xytext=(.80,1.76),
            fontsize=11, color='#9a3412', bbox=label_box,
            arrowprops=dict(arrowstyle='-', color='#c2410c'))
ax.annotate('CG: løsningen', solution, xytext=(.80,2.09),
            fontsize=11, color='#166534', bbox=label_box,
            arrowprops=dict(arrowstyle='-', color='#15803d'))
ax.annotate('M: minimum på\nden blå linjen', M, xytext=(1.19,2.02),
            fontsize=11, color='#1d4ed8', bbox=label_box,
            arrowprops=dict(arrowstyle='-', color='#2563eb'))
ax.set(xlabel='u', ylabel='v', title='Samme første steg – to ulike andre steg')
fig.tight_layout(); plt.show()
```

**1. Hva forteller den grønne, stiplede linjen?** Dette er samme linje
som i forrige figur. Hvert punkt på den er minimum langs en linje
parallell med den første søkeretningen $(1,1)^T$. Fra et slikt punkt
kan vi altså ikke senke $\phi$ ved å øke eller redusere begge
koordinatene like mye. Både $x_1$ og stjernen ligger på den grønne linjen.

**2. Følg den oransje pilen til $S$.** Bratteste nedstigning har funnet
minimum langs linjen fra $x_1$ i den nye residualens retning. Men $S$
ligger utenfor den grønne linjen. For å se hva det betyr, har vi tegnet
den blå, prikkede linjen gjennom $S$. Den går i den **gamle** retningen:
begge koordinatene endres like mye. Minimum på denne blå linjen er
den åpne sirkelen $M$, der den krysser den grønne linjen.
Dermed er $\phi(M)<\phi(S)$: fra $S$ kan vi senke funksjonsverdien
igjen ved å gå i en retning vi allerede har brukt.
$M$ er bare tegnet for å vise dette; det er ikke metodens neste steg
og heller ikke selve løsningen.

**3. Følg den grønne pilen fra $x_1$.** CG går langs den grønne linjen.
Hvert punkt underveis er derfor fortsatt minimum i den gamle retningen,
langs sin egen parallelle linje. Det nye linjesøket finner det laveste
punktet langs den grønne linjen: i dette todimensjonale eksemplet er
det stjernen $(1,2)^T$. Vi har nå minimert i begge søkeretningene,
uten at det andre steget har gjort ny leting i den første nødvendig.

Det er denne egenskapen vi vil bygge inn i regneoppskriften:
**Den nye retningen skal bevare minimeringen i den gamle retningen.**

### Fra figuren til konjugerte retninger

Hvordan kan vi velge en slik retning uten å tegne alle linjene?
For en kvadratisk funksjon med SPD-matrise $A$ finnes et enkelt
regnekrav: to søkeretninger $p$ og $q$ skal oppfylle

$$\boxed{p^TAq=0.}$$

Da kalles de **A-konjugerte**. Betydningen er nettopp den vi så:
etter at vi har minimert langs $p$, kan vi gå langs $q$ uten at
det blir nødvendig å minimere i $p$-retningen på nytt.
Utledningen står i «Gå i dybden».

I figuren med de parallelle blå linjene er den første retningen
$p_0=(5,5)^T$. En retning langs
den grønne linjen er $q=(-3,4)^T$: endringene gir
$4\cdot(-3)+3\cdot4=0$, så vi holder oss på linjen $4u+3v=10$.
Vi kan også kontrollere $p_0^TAq=0$ med matrisen vår.

### Gram–Schmidt igjen – med et nytt indreprodukt

I uke 4.3 laget vi ortogonale retninger med **Gram–Schmidt**:
Fra en ny vektor trakk vi fra projeksjonene på de gamle retningene.
Vi kan bruke samme framgangsmåte her, men med et annet indreprodukt:

$$\langle p,q\rangle_A=p^TAq.$$

Dette er et indreprodukt fordi $A$ er symmetrisk positiv definit:
symmetrien gjør at rekkefølgen på vektorene ikke spiller noen rolle,
og $\langle p,p\rangle_A>0$ for $p\ne0$. Regnereglene for summer og
skalering følger av matriseproduktet.
**A-konjugerte retninger er altså ortogonale med dette indreproduktet.**
De trenger ikke stå vinkelrett på arket. Når $A=I$, får vi det vanlige
indreproduktet og vanlig ortogonalitet tilbake.

Hvordan lager vi den andre søkeretningen? Vi kjenner $p_0$ og den nye
residualen $r_1$. Start med $r_1$, og trekk fra en passende mengde av
$p_0$: skriv $p_1=r_1-cp_0$. Vi velger tallet $c$ slik at
$\langle p_0,p_1\rangle_A=0$. Innsetting gir

$$0=\langle p_0,r_1\rangle_A-c\langle p_0,p_0\rangle_A
\quad\Longrightarrow\quad
c=\frac{\langle p_0,r_1\rangle_A}{\langle p_0,p_0\rangle_A}.$$

Dermed blir Gram–Schmidt-steget

$$\boxed{p_1=r_1-\frac{p_0^TAr_1}{p_0^TAp_0}\,p_0.}$$

Leddet vi trekker fra, er **projeksjonen av $r_1$ på $p_0$ målt med
A-indreproduktet**. Nevneren er med fordi $p_0$ ikke er normalisert.
Vi trenger heller ikke normalisere den nye retningen: linjesøket
bestemmer hvor langt vi går langs den.

I eksemplet er $r_1=(-5/7,5/7)^T$ og $c=-1/49$. Da får vi
$p_1=r_1+(1/49)p_0=(-30/49,40/49)^T$. Denne vektoren er
$10/49$ ganger $(-3,4)^T$: **Gram–Schmidt gir nettopp retningen langs
den grønne linjen.** Nå har vi en regneoppskrift for retningen vi
fant geometrisk.

### Hva gjør CG i praksis?

Navnet **konjugert gradient (CG)** viser til begge ideene: residualen
er negativ gradient, og søkeretningene konstrueres for å være
A-konjugerte. Etter første steg er søkeretningen vanligvis **ikke**
lik residualen alene.

Den praktiske oppskriften er:

1. Velg en startvektor $x_0$, for eksempel nullvektoren. Beregn
   residualen $r_0=b-Ax_0$, og bruk den som første retning hvis vi ikke allerede er framme.
2. Finn minimum langs linjen gjennom gjeldende punkt i søkeretningen.
   Dette gir neste tilnærming $x_{k+1}$.
3. Beregn ny residual. Stopp hvis residualkravet er oppfylt.
4. Trekk fra projeksjonen av den nye residualen på forrige søkeretning,
   målt med A-indreproduktet, slik vi nettopp gjorde. Gjenta linjesøket
   med retningen som står igjen.

I vanlig Gram–Schmidt må vi trekke fra bidrag i **alle** tidligere
retninger. For CG med SPD-matrise og eksakte linjesøk holder det å
bruke **den siste**: den nye retningen blir også A-ortogonal til de
eldre retningene, i eksakt regning. Dette er en egen egenskap ved CG.

CG skriver oppdateringen som $p_{k+1}=r_{k+1}+\beta_kp_k$.
Plusstegnet skyldes at $\beta_k$ er minus projeksjonskoeffisienten;
i eksemplet er $\beta_0=1/49$. I «Gå i dybden» utleder vi den korte
formelen for $\beta_k$ og regner ferdig eksemplet. Hovedideen er den
samme som i uke 4: **fjern bidrag i gamle retninger før du bruker den
nye**, nå med A-indreproduktet.

### Eksperiment 6 – samme skåler, nye retninger

Vi vender tilbake til de to skålene fra 6.5. Denne gangen legger vi
CG-banen oppå banen til bratteste nedstigning. Hjelperen `cg` returnerer
blant annet `path`, som inneholder startvektoren og tilnærmingen etter hvert steg,
og `residuals`, som inneholder direkte beregnede residualnormer.
Stjernen fra `bowl_plot` er bare et referansepunkt; CG bruker ikke
en direkte løsning for å beregne banen.

**Hva forventer dere at de to metodene gjør på den runde skålen?
Og hva tror dere endrer seg på den smale?**

```{pyodide-python}
#| label: week6-cg-experiment
Q = np.array([[1.,-1.],[1.,1.]])/np.sqrt(2)
star = np.array([1.,-1.1])
fig, axes = plt.subplots(2, 1, figsize=(7, 9))
for ax, small in zip(axes, [1., .04]):
    A = Q @ np.diag([1.,small]) @ Q.T
    b = A @ star
    sd = descent_path(A, b, [0.,0.], steps=16)
    result = cg(A, b, rtol=1e-10, max_steps=20)
    bowl_plot(ax, A, b, {'Bratteste nedstigning':sd, 'CG':result['path']},
              bounds=(-.5,1.5,-1.5,.5))
    ax.annotate('start', (0,0), xytext=(8,8), textcoords='offset points')
    ax.set_title(f'κ₂(A) = {1/small:g}; CG: {len(result["path"])-1} steg')
    print(f'κ₂(A) = {1/small:g}: CG-residual = {result["residuals"][-1]:.2e}')
fig.tight_layout(); plt.show()
```

I øverste bilde ligger banene oppå hverandre: første retning peker rett
mot løsningen, og ett linjesøk er nok. I nederste bilde er første steg også
felles, men deretter skiller metodene lag. Bratteste nedstigning måler
bare den nye lokale helningen og fortsetter sikksakk. CG korrigerer
den nye residualretningen ved hjelp av den forrige søkeretningen og
når løsningen i to steg i dette eksemplet.

Dette betyr ikke at CG alltid tar to steg, eller at et kondisjonstall
på $25$ bestemmer et bestemt antall steg. Forsøket har bare **to ukjente**.

### Hva kan vi forvente i større systemer?

For et SPD-system med $n$ ukjente når CG løsningen etter **høyst $n$
steg i eksakt regning**, ofte før. Ikke-null, parvis A-konjugerte
retninger er lineært uavhengige. Etter høyst $n$ slike retninger
har vi nok retninger til å dekke hele rommet. I store problemer
håper vi å oppnå en tilstrekkelig liten residual lenge før dette.

På datamaskinen avrundes tallene. Retningene kan miste konjugerthet,
og flere steg enn $n$ kan bli nødvendig. Derfor bruker vi både en
maksimalgrense og en direkte kontroll av $b-Ax$, slik vi diskuterte i
6.3. Residualnormen trenger ikke avta i hvert steg, selv om CG
reduserer den kvadratiske funksjonen i eksakt regning.

Kondisjonstallet har nå to roller som må skilles. I 6.3 beskrev det
**følsomheten i løsningen**. Her sier det også noe om skålens form og
inngår i grenser for konvergenshastigheten. Det bestemmer ikke alene
antall CG-steg; fordelingen av egenverdiene og startfeilen betyr også
noe. Derfor trenger vi forsøk i større dimensjon før vi kan vurdere
arbeidsmengden. Det blir en del av prosjektet i 6.7.

<details class="reading-step">
<summary>Gå i dybden: hvorfor bevares minimeringen, og hvor kommer CG-formlene fra?</summary>

**Prøv selv**

1. Vis at punktene som er optimale langs $p_0=(5,5)^T$ i eksemplet,
   oppfyller $4u+3v=10$.
2. Finn en ny retning av formen $p_1=r_1+\beta_0p_0$ som er
   A-konjugert med $p_0$. Beregn andre CG-steg.
3. Vis at et steg langs $q$ bevarer minimeringen langs $p$ når $p^TAq=0$.
4. Forklar hvorfor to konjugerte retninger ikke behøver å stå
   vinkelrett i figuren, og hvorfor to dimensjoner gir høyst to CG-steg
   i eksakt regning.

**Regnegangen – hele $2\times2$-eksemplet**

Et punkt $x$ er minimum langs linjen $x+tp_0$ akkurat når den
deriverte i $t=0$ er null. Fra 6.5 er betingelsen
$p_0^T(Ax-b)=0$. Her blir den

$$5(3u+v-5)+5(u+2v-5)=0
\quad\Longleftrightarrow\quad 4u+3v=10.$$

Etter første steg kjenner vi

$$x_1=(10/7,10/7)^T,\qquad r_1=(-5/7,5/7)^T.$$

Kravet $p_0^TAp_1=0$ for $p_1=r_1+\beta_0p_0$ gir

$$\beta_0=-\frac{p_0^TAr_1}{p_0^TAp_0}
=-\frac{-25/7}{175}=\frac1{49}.$$

Dette er Gram–Schmidt med A-indreproduktet for den nye retningen.
Dermed får vi

$$p_1=(-30/49,40/49)^T,\qquad Ap_1=(-50/49,50/49)^T.$$

Vi kan kontrollere $p_0^TAp_1=0$ direkte. Men
$p_0^Tp_1=50/49\ne0$, så retningene er ikke vanlig ortogonale.
Beste steglengde fra linjesøket i 6.5 er

$$\alpha_1=\frac{p_1^Tr_1}{p_1^TAp_1}=\frac7{10},\qquad
x_2=x_1+\alpha_1p_1=(1,2)^T.$$

Residualen er nå null, og vi stopper. Begge likningene er oppfylt.

**Hva forklarer dette? – minimering som ikke forstyrres**

Anta at vi allerede har minimert langs retningen $p$. Da er
$p^T(Ax-b)=0$. Etter et steg $x_{\mathrm{ny}}=x+\alpha q$ får vi

$$p^T(Ax_{\mathrm{ny}}-b)
=p^T(Ax-b)+\alpha p^TAq.$$

Første ledd er null. Det andre er også null hvis $p^TAq=0$.
Dermed bevares minimeringen langs $p$. Dette forklarer både den
grønne linjen i figuren og hvorfor konjugerthet er riktig krav.

Mer generelt vil kryssleddene forsvinne når vi skriver en korreksjon
som en kombinasjon av parvis konjugerte retninger. Minimering i en
ny retning endrer da ikke de optimale koeffisientene i tidligere
retninger. Dette er bakgrunnen for grensen på $n$ steg.

**Den korte CG-oppdateringen**

Vi starter med $r_0=b-Ax_0$ og $p_0=r_0$. Hvis startresidualen allerede
er liten nok, stopper vi før første divisjon. Ellers bruker vi

$$\alpha_k=\frac{r_k^Tr_k}{p_k^TAp_k},\qquad
x_{k+1}=x_k+\alpha_kp_k,\qquad
r_{k+1}=r_k-\alpha_kAp_k.$$

Etter ny stoppkontroll beregner vi

$$\beta_k=\frac{r_{k+1}^Tr_{k+1}}{r_k^Tr_k},\qquad
p_{k+1}=r_{k+1}+\beta_kp_k.$$

Den generelle linjesøkformelen har $p_k^Tr_k$ i telleren. I CG er
residualen ortogonal til de tidligere søkeretningene i eksakt
regning. Fordi $p_k$ er $r_k$ pluss et bidrag i forrige retning,
får vi $p_k^Tr_k=r_k^Tr_k$. Det forklarer telleren i $\alpha_k$.

Kravet om konjugerthet med $p_k$ gir først
$\beta_k=-p_k^TAr_{k+1}/(p_k^TAp_k)$, slik vi regnet i eksemplet.
Bruk så $\alpha_kAp_k=r_k-r_{k+1}$ og
$r_{k+1}^Tr_k=0$, som gjelder i eksakt CG:

$$-p_k^TAr_{k+1}
=\frac{r_{k+1}^Tr_{k+1}}{\alpha_k}.$$

Sammen med uttrykket for $\alpha_k$ gir dette den korte formelen for
$\beta_k$. For SPD sikrer CG-strukturen konjugerthet også med de eldre
retningene; vi trenger ikke utføre en full Gram–Schmidt-runde i hvert
steg. Dette er en egenskap ved CG, ikke en regel for vilkårlig valgte
residualer og retninger.

For SPD er $p_k^TAp_k>0$ når $p_k\ne0$. Formlene krever derfor
at vi stopper når residualkravet er oppfylt, og at vi ikke fortsetter
med null retning. Hjelperen `cg` kontrollerer dessuten den direkte
beregnede residualen, fordi gjentatte oppdateringer av $r_k$ kan
samle avrundingsfeil.

**Funksjonsverdi, energifeil og residual**

Fra 6.4 vet vi at $\phi(x)-\phi(x_*)=\tfrac12e^TAe$.
For SPD definerer $\lVert e\rVert_A=\sqrt{e^TAe}$ en vektornorm,
kalt **energinormen**. Dette er en norm på feilvektoren; den må ikke
blandes sammen med matrisens 2-norm fra 6.3.
CGs minimering reduserer energifeilen i eksakt regning.
Den vanlige residualnormen $\lVert b-Ax\rVert_2$ måler en annen
størrelse og har ingen tilsvarende garanti for hvert enkelt steg.

</details>



## 6.7 Prosjekt og egenarbeid

<div id="uke6-prosjekt"></div>

### Diskusjon — samme løsning, bedre skalering?

CG utnytter tidligere retninger, men arbeider fortsatt med geometrien
til det systemet vi gir metoden. Neste spørsmål er derfor:
**Kan vi først endre koordinatskalaen slik at problemet blir lettere for CG?**
En ren endring av koordinater må kunne oversettes tilbake til den samme
løsningen av det opprinnelige systemet.

I [prosjekt 6](project_week6.qmd) undersøker du dette.
**Prekondisjonering** betyr at vi bruker et enklere system til å endre
skaleringen eller geometrien som den iterative metoden arbeider med.
Målet er færre eller billigere steg fram til samme opprinnelige løsning.

Du prøver **diagonal prekondisjonering**, som bruker diagonalen til $A$,
og fullfører **prekondisjonert konjugert gradient (PCG)** fra pseudokode.
Ett problem får stor forbedring; et annet viser en begrensning.
**Er færre steg tilstrekkelig, eller må vi også se på ekstra arbeid per steg
og hvilken residual som brukes til å stoppe?**

<details class="reading-step">
<summary>Gå i dybden: forbered prosjektet</summary>

**Prøv selv**

1. For $A=\operatorname{diag}(1,100)$, sett $y_1=x_1$, $y_2=10x_2$.
   Skriv $x^TAx$ med de nye koordinatene. Hvordan finner du $x$ fra $y$?
2. Forklar forskjellen mellom en Jacobi-iterasjon og diagonal prekondisjonering.
3. Skriv hvilke størrelser du vil holde like når du sammenligner CG og PCG.

**Regnegangen**

Her blir $x^TAx=y_1^2+y_2^2$; tilbake får vi $x_1=y_1$, $x_2=y_2/10$.
Den nye skalaen gir runde nivåkurver. Prosjektet viser hvordan hele
likningssystemet må omregnes for å bevare løsningen og symmetrien.

**Hva forklarer dette?**

Jacobi er en egen iterasjon som oppdaterer løsningen. Diagonal
prekondisjonering bruker $M=\operatorname{diag}(A)$ som et hjelpemiddel inne
i for eksempel CG. Sammenlign på samme $A,b,x_0$, samme opprinnelige
residualkrav og samme maksimalgrense. Tell også matrise-vektor-produkter
og arbeid med prekondisjoneringen.

</details>

:::
