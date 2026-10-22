::: {.panel-tabset}

## 6.0 Oversikt

::: {#uke6-start}
:::

### Kan vi løse tusenvis av likninger ved å begynne med et grovt svar og forbedre det litt om gangen?

I uke 5 brukte vi gjentatte matriseprodukter til å finne en retning som
stabiliserte seg. Nå skal gjentakelse hjelpe oss med et annet mål: å løse
$Ax=b$. Vi starter med en vektor med foreløpige verdier for de ukjente, og
beregner nye verdier flere ganger. Håpet er å komme stadig nærmere løsningen.
Det er særlig interessant for store, **glisne** systemer, der de fleste
matriseelementene er null. Da er matrise–vektor-produkter billige, men
faktorisering krever mye arbeid eller lagring.

Spørsmålet deler seg i to:

- **Hvordan vet vi om de nye verdiene er bedre enn de gamle?**
- **Hvordan skal vi beregne dem?**

Vi henter kort fram Jacobi og Gauss–Seidel, undersøker hva som styrer
konvergensen, og prøver **konjugert gradient (CG)**: en metode som bygger
nye søkeretninger ut fra informasjonen i tidligere steg. Til slutt i 6.6
[svarer vi på ukens spørsmål](#uke6-svar).

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

::: {#uke6-gs}
:::

### Én likning og én ukjent om gangen

I uke 2 fant vi løsninger ved å gjenta en oppdatering: vi startet med et
forslag, beregnet et nytt og fortsatte til forslagene stabiliserte seg.
Nå vil vi bruke samme idé på et lineært likningssystem $Ax=b$: vi
beholder likningene og **forbedrer et løsningsforslag flere ganger**.

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
Første sveip fra $(0,0)$ ser slik ut:

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
(Dere skal få $(10/9,35/18)$, som ligger nærmere.)

### Jacobi som korreksjon

Oppdateringene kan også skrives med **residualen** $r=b-Ax$, altså det
som mangler i likningene. For Jacobi er

$$u_{k+1}=\frac{5-v_k}{3}=u_k+\frac{5-3u_k-v_k}{3},\qquad
v_{k+1}=\frac{5-u_k}{2}=v_k+\frac{5-u_k-2v_k}{2}.$$

Vi legger altså til residualen i hver likning, delt på diagonalelementet.
Med $D=\operatorname{diag}(3,2)$, diagonalen til $A$, er dette

$$x^{(k+1)}=x^{(k)}+D^{-1}\bigl(b-Ax^{(k)}\bigr).$$

Denne operasjonen kommer tilbake i prosjektet. GS gjør det samme, men
regner residualen i andre likning på nytt med den nye $u$ før $v$
korrigeres. Begge oppskriftene krever $a_{ii}\ne0$; det alene garanterer
ikke at iterasjonen konvergerer. Matriseformen med $A=L+D+U$ og et
eksempel med fire ukjente står i «Gå i dybden».

De to oppskriftene skiller seg bare i om vi bruker den nye verdien av $u$
straks. Betyr det noe for hvor fort vi nærmer oss $(1,2)$? Hjelperen
`gs_path` gjør GS-sveipene og lagrer hvert koordinatsteg; `[::2]` velger
startpunktet og slutten av hvert helt sveip. Jacobi-oppdateringen står
synlig i cellen. Målet er å se hvor mange ganger mindre feilen blir per
sveip med hver metode.

### Eksperiment 1 – når bruker vi den nye verdien?

- Kjør cellen, og sammenlign de to kurvene.
- Les forholdet mellom to påfølgende feil i utskriften.
- Bytt `sweeps=6` og `range(6)` til 10, og undersøk om forholdet holder seg.

```{pyodide-python}
#| label: week6-gs-experiment
# Samme system, nullstart og like mange hele sveip for begge metodene.
A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 5.])
gs = gs_path(A, b, [0., 0.], sweeps=6)[::2]
jacobi = [np.zeros(2)]
for k in range(6):
    # Begge uttrykkene bruker samme gamle par (u,v).
    u, v = jacobi[-1]
    jacobi.append(np.array([(5-v)/3, (5-u)/2]))
feil_gs = np.linalg.norm(gs - [1., 2.], axis=1)
feil_j = np.linalg.norm(np.array(jacobi) - [1., 2.], axis=1)
print('GS, ny feil / gammel feil:    ', np.round(feil_gs[1:]/feil_gs[:-1], 3))
print('Jacobi, ny feil / gammel feil:', np.round(feil_j[1:]/feil_j[:-1], 3))
error_plot({'Jacobi': feil_j, 'GS': feil_gs}, ylabel='Avstand til løsningen (1, 2)')
```

**Hva viser forsøket?** GS-kurven faller brattest: etter første sveip blir
feilen seks ganger mindre per sveip (forholdet $0.167$). Jacobi veksler
mellom forholdene $0.373$ og $0.447$, så **to** Jacobi-sveip gjør omtrent
like mye som **ett** GS-sveip. I 6.2 finner vi $1/6$ igjen som en
egenverdi. Men virker oppskriften for ethvert system?

**Øv på dette:** [Jacobi eller Gauss–Seidel?](#uke6-ov-sveip)

::: {.reading-step title="Gå i dybden: fire ukjente, rekkefølgen i sveipet og korreksjonen i koden"}

**Den samme oppskriften som matriseregning**

For å skrive oppskriftene for et vilkårlig antall ukjente deler vi $A$ i
tre deler: $L$ består av tallene **under** diagonalen, $D$ av tallene
**på** diagonalen og $U$ av tallene **over** diagonalen. Bokstavene kommer
fra *lower*, *diagonal* og *upper*. Alle tall beholder fortegnene sine.
For vår matrise er

$$
A=\begin{bmatrix}\textcolor{#B45309}{3}&\textcolor{#7E22CE}{1}\\\textcolor{#1565C0}{1}&\textcolor{#B45309}{2}\end{bmatrix}
=\underbrace{\begin{bmatrix}0&0\\\textcolor{#1565C0}{1}&0\end{bmatrix}}_{\textcolor{#1565C0}{L}}
+\underbrace{\begin{bmatrix}\textcolor{#B45309}{3}&0\\0&\textcolor{#B45309}{2}\end{bmatrix}}_{\textcolor{#B45309}{D}}
+\underbrace{\begin{bmatrix}0&\textcolor{#7E22CE}{1}\\0&0\end{bmatrix}}_{\textcolor{#7E22CE}{U}}.
$$

I GS er $u$ allerede ny når vi beregner $v$, og tallet foran $u$ i andre
likning hører til $L$. Vi samler derfor $D$ og $L$ på venstresiden, der de
nye verdiene står, og lar $U$ virke på de gamle verdiene på høyresiden:

$$(\textcolor{#B45309}{D}+\textcolor{#1565C0}{L})x^{(k+1)}=b-\textcolor{#7E22CE}{U}x^{(k)},
\qquad\text{her}\qquad
\begin{bmatrix}3&0\\1&2\end{bmatrix}\begin{bmatrix}u_{k+1}\\v_{k+1}\end{bmatrix}
=\begin{bmatrix}5-v_k\\5\end{bmatrix}.$$

Første rad sier $3u_{k+1}=5-v_k$, og andre rad sier $u_{k+1}+2v_{k+1}=5$.
Det er nøyaktig GS-oppdateringene over. Venstresiden er et nedre
trekantsystem, og vi løser det ovenfra og ned. Jacobi bruker derimot bare
gamle verdier på høyresiden:

$$\textcolor{#B45309}{D}x^{(k+1)}=b-(\textcolor{#1565C0}{L}+\textcolor{#7E22CE}{U})x^{(k)}.$$

Siden $L+U=A-D$, er høyresiden $b-Ax^{(k)}+Dx^{(k)}$. Deler vi hver rad
på diagonalelementet sitt, kan Jacobi skrives som en korreksjon:

$$x^{(k+1)}=x^{(k)}+D^{-1}\bigl(b-Ax^{(k)}\bigr),$$

som er korreksjonsformen fra hovedteksten. Oppdelingen $A=L+D+U$ virker
for enhver kvadratisk matrise.

**Fire ukjente: hva er gammelt, og hva er nytt?**

For å se mønsteret tydeligere bruker vi en $4\times4$-matrise.
Fargene følger delene: **blått for $L$**, **oransje for $D$** og
**lilla for $U$**. $L$ og $U$ har null på diagonalen.

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
ikke tilhører denne delen. Vi kan skrive $L+D+U$ eller $D+L+U$; summen
er den samme. **Kontroller én rad ved å legge sammen de tre delmatrisene.**

Ta $b=(3,2,2,3)^T$ (løsningen er $(1,1,1,1)^T$) og oppdater i rekkefølgen
$x_1,x_2,x_3,x_4$. Her er de to oppskriftene ved siden av hverandre.
Fargene viser bidragene fra $L$ og $U$; eksponenten $k$ eller $k+1$ viser
om verdien er gammel eller ny.

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

Den første forskjellen oppstår i andre rad. I GS er koordinatene med
indeks $j<i$ allerede oppdatert når vi arbeider med rad $i$. De hører til
$L$ og bruker nye verdier. Koordinatene med $j>i$ hører til $U$ og venter
på tur. Diagonalelementet brukes til å isolere koordinaten vi beregner nå.
Samler vi alle radene, får vi de samme matriseformene
$(D+L)x^{(k+1)}=b-Ux^{(k)}$ og $Dx^{(k+1)}=b-(L+U)x^{(k)}$ som for
$2\times2$-systemet.

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

:::

## 6.2 Følg feilen

::: {#uke6-fikspunkt}
:::

I eksperiment 1 krympet GS-feilen med samme faktor i hvert sveip etter
det første. Skjer det
alltid, og hva bestemmer faktoren? Vi gir GS en ny matrise der tallene
utenfor diagonalen er større enn diagonaltallene, og sammenligner med den
gamle:

$$A_a=\begin{bmatrix}3&1\\1&2\end{bmatrix},\qquad
A_b=\begin{bmatrix}1&2\\2&1\end{bmatrix}.$$

Begge systemene får samme kjente løsning $x_*=(1,2)^T$: vi lager
$b=Ax_*$ for hver matrise og kan måle feilen direkte. Målet er å finne
ett tall, regnet ut fra matrisen, som forteller om feilen krymper eller
vokser.

### Eksperiment 2 – er flere sveip alltid bedre?

- Kjør cellen. Hvilken kurve vokser?
- Les forholdet mellom to påfølgende feil for hver matrise.
- Forutsi forholdet for $\begin{bmatrix}4&1\\1&3\end{bmatrix}$, og bytt den
  inn i stedet for $A_b$ (både tallene og navnet).

```{pyodide-python}
#| label: week6-convergence
# Vi konstruerer b fra en kjent løsning for å isolere effekten av A.
star = np.array([1., 2.])
kurver = {}
for name, A in [('A_a = [[3,1],[1,2]]', np.array([[3.,1.],[1.,2.]])),
                ('A_b = [[1,2],[2,1]]', np.array([[1.,2.],[2.,1.]]))]:
    values = gs_path(A, A @ star, np.zeros(2), sweeps=10)[::2]
    kurver[name] = np.linalg.norm(values - star, axis=1)
    print(name, ' ny feil / gammel feil:', np.round(kurver[name][1:]/kurver[name][:-1], 3))
error_plot(kurver, xlabel='GS-sveip', ylabel='‖x_k − x_*‖₂')
```

**Hva viser forsøket?** For $A_a$ blir feilen seks ganger mindre per
sveip, for $A_b$ fire ganger større. I hver rad i $A_a$ er
diagonalelementet større i absoluttverdi enn summen av de andre ($3>1$ og
$2>1$). Dette kalles **streng diagonaldominans**, og det garanterer at GS
konvergerer fra enhver startvektor. $A_b$ mangler denne egenskapen, men
det alene forklarer ikke tallene $1/6$ og $4$. Vi følger derfor hvordan
ett sveip endrer feilen.

### Hvordan endrer ett sveip feilen?

Som i [uke 2](page4.qmd#fikspunkt-og-konvergens) kan vi skrive metoden som
en fikspunktiterasjon. Her er oppdateringen $x_{k+1}=Tx_k+c$. Løsningen er
et **fikspunkt**: den endres ikke av oppdateringen, altså $x_*=Tx_*+c$.
**Feilen** $e_k=x_k-x_*$ følger derfor

$$e_{k+1}=(Tx_k+c)-(Tx_*+c)=T(x_k-x_*)=Te_k.$$

Dermed er $e_k=T^ke_0$: det gjentatte matriseproduktet fra uke 5. Der
fulgte vi hvilket bidrag som tok over; nå ønsker vi at **alle feilbidrag
skal forsvinne**. $T$ beskriver ett helt sveip, ikke likningssystemet.

For $A_a$ finner vi $T$ ved å sette den nye $u$ inn i oppdateringen av $v$:

$$u_{k+1}=\tfrac53-\tfrac13v_k,\qquad
v_{k+1}=\frac{5-u_{k+1}}{2}=\frac{5-\frac53+\frac13v_k}{2}=\tfrac53+\tfrac16v_k.$$

Begge nye verdier avhenger bare av den gamle $v_k$. Som matriseregning er dette

$$\begin{bmatrix}u_{k+1}\\v_{k+1}\end{bmatrix}=
\underbrace{\begin{bmatrix}0&-1/3\\0&1/6\end{bmatrix}}_{T_a}
\begin{bmatrix}u_k\\v_k\end{bmatrix}+\begin{bmatrix}5/3\\5/3\end{bmatrix}.$$

Samme regning for $A_b$ («Gå i dybden») gir
$T_b=\begin{bmatrix}0&-2\\0&4\end{bmatrix}$.

Hvis feilen er en egenvektor $w$ til $T$, er neste feil $Tw=\lambda w$:
$\lambda$ er faktoren feilen ganges med per sveip. Begge $T$-matrisene er
trekantmatriser, så egenverdiene står på diagonalen: $0$ og $1/6$ for
$T_a$, $0$ og $4$ for $T_b$. Det er egenverdiene til **$T$, ikke til
$A$**, som beskriver feilutviklingen.

**Følg feilen for hånd.** Startfeilen er $e_0=(0,0)^T-(1,2)^T=(-1,-2)^T$.
Ett sveip med $A_a$ gir

$$e_1=T_ae_0=\begin{bmatrix}0\cdot(-1)-\frac13\cdot(-2)\\[2pt]0\cdot(-1)+\frac16\cdot(-2)\end{bmatrix}
=\begin{bmatrix}2/3\\-1/3\end{bmatrix}=-\tfrac13\begin{bmatrix}-2\\1\end{bmatrix},
\qquad T_a\begin{bmatrix}-2\\1\end{bmatrix}=\begin{bmatrix}-1/3\\1/6\end{bmatrix}=\tfrac16\begin{bmatrix}-2\\1\end{bmatrix}.$$

Bidraget langs egenvektoren til egenverdien $0$ forsvant i første sveip. Resten ligger
langs egenvektoren til $1/6$, så hvert nytt sveip deler feilen på seks:
$\lVert e_0\rVert_2=\sqrt5\approx2.24$, $\lVert e_1\rVert_2=\sqrt5/3\approx0.745$
og $\lVert e_2\rVert_2=\sqrt5/18\approx0.124$, nøyaktig punktene på kurven.
Derfor er første forhold i utskriften $1/3$.
For $A_b$ gir samme regning $e_1=T_be_0=(4,-8)^T$, med lengde
$\sqrt{80}\approx8.94$. Det er en egenvektor til $4$.

**Spektralradiusen** er største absoluttverdi av egenverdiene:
$\rho(T)=\max_i|\lambda_i(T)|$. Iterasjonen konvergerer fra enhver startvektor
akkurat når $\rho(T)<1$. Det er $T$ vi undersøker her.
**Hvorfor er én vellykket kjøring ikke nok til å garantere konvergens fra enhver startvektor?**

**Øv på dette:** [Blir feilen mindre?](#uke6-ov-feilfaktor)

::: {.reading-step title="Gå i dybden: finn matriserepresentasjonen av feiloppdateringen"}

**Prøv selv**

1. Gjør utregningen av $T_a$ og $c_a$ over selv, uten å se på den.
2. Gjør det samme for $A_b$, der $b=A_bx_*=(5,4)^T$.
3. Finn $T$ og $\rho(T)$ når $A=\begin{bmatrix}4&1\\1&3\end{bmatrix}$.
   Avhenger $T$ av $b$?

**Regnegangen**

For første system er $u_{k+1}=5/3-v_k/3$ og $v_{k+1}=5/3+v_k/6$:

$$T_a=\begin{bmatrix}0&-1/3\\0&1/6\end{bmatrix},\quad c_a=(5/3,5/3)^T.$$

For andre system er $u_{k+1}=5-2v_k$. Innsatt i andre likning gir det
$v_{k+1}=4-2u_{k+1}=4-2(5-2v_k)=-6+4v_k$:

$$T_b=\begin{bmatrix}0&-2\\0&4\end{bmatrix},\quad c_b=(5,-6)^T.$$

**Hva forklarer dette?**

Å trekke $x_*=Tx_*+c$ fra iterasjonen gir $e_{k+1}=Te_k$ og $e_k=T^ke_0$.
For enkelte startvektorer er bidraget til startfeilen langs en voksende egenretning null.
Når en egenvektorbasis finnes, skaleres hvert bidrag med $\lambda_i^k$.
Kriteriet $\rho(T)<1$ gjelder også uten en egenvektorbasis.

I punkt 3 under «Prøv selv» er $T=\begin{bmatrix}0&-1/4\\0&1/12\end{bmatrix}$ og
$\rho(T)=1/12$. $b$ endrer fikspunktet, men ikke $T$. Bytter du denne
matrisen inn i eksperiment 2, blir forholdet $1/12\approx0.083$ etter første sveip.

**Diagonaldominans er en garanti, ikke et krav**

Streng diagonaldominans er en tilstrekkelig betingelse for at GS
konvergerer fra enhver startvektor. At $A_b$ ikke oppfyller den, beviser
alene ikke at GS mislykkes. Det er $\rho(T_b)=4>1$ som avgjør det.

**Fra eksemplet til en generell matrise**

For generell $A=D+L+U$ er $D$ diagonalen, $L$ den strengt nedre delen og
$U$ den strengt øvre delen, med opprinnelige fortegn. Da er

$$(D+L)x_{k+1}=b-Ux_k,\qquad T=-(D+L)^{-1}U.$$

Dette er et analyseuttrykk; implementasjonen trenger ikke en eksplisitt invers.
For Jacobi er $T=-D^{-1}(L+U)$.

:::

## 6.3 Residual, norm og kondisjonstall

::: {#uke6-residual}
:::

### Fra ett tall i uke 2 til en vektor i uke 6

I [uke 1](page2.qmd) målte vi absolutt og relativ feil. I
[uke 2, del 2.4](page4.qmd#feil-residual-og-toleranse) skilte vi mellom **foroverfeil** (feil i
svaret) og **bakoverfeil** (hvor mye problemet må endres for at svaret
skal bli eksakt). Vi bruker nå de samme spørsmålene for $Ax=b$.

La $x_*$ være den eksakte løsningen og $\hat x$ en **beregnet tilnærming**,
for eksempel vektoren etter ti GS-sveip. For en vektor bruker vi den vanlige lengden

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

| Beregnet svar $\hat x$ | Residual $b-A\hat x$ | Feilvektor $\hat x-x_*$ | Residualnorm | Absolutt foroverfeil |
|:--|:--|:--|:--|:--|
| $(1,0)^T$ | $(0,10^{-4})^T$ | $(0,-1)^T$ | $10^{-4}$ | $1$ |
| $(0.99,1)^T$ | $(0.01,0)^T$ | $(-0.01,0)^T$ | $0.01$ | $0.01$ |

Det første svaret bommer med $1$ i andre koordinat, men denne feilen
ganges med $10^{-4}$ når vi setter svaret inn i andre likning.
Det andre svaret bommer bare med $0.01$ i første koordinat, der
koeffisienten er $1$. **Svaret med minst residual har altså størst
foroverfeil.** Dette ligner den flate funksjonsgrafen i
[uke 2](page4.qmd#uke2-flat-graf): stor avstand til løsningen
kan gi en liten residual.

### Bakoverfeil: hvor mye må høyresiden endres?

Se igjen på det beregnede svaret $\hat x=(1,0)^T$. Det oppfyller

$$x_1=1,\qquad 10^{-4}x_2=0.$$

Det opprinnelige systemet hadde $10^{-4}$ på høyresiden i andre
likning. Endrer vi dette tallet til $0$, blir det beregnede svaret
helt riktig for de nye likningene.

**Bakoverfeilen måler hvor mye vi må endre problemet for at det
beregnede svaret skal bli eksakt.** Her endrer vi bare høyresiden;
matrisen $A$ beholdes. For enhver beregnet vektor $\hat x$ forteller
residualen $r=b-A\hat x$ akkurat hva vi må trekke fra $b$:

$$A\hat x=b-r.$$

Den nødvendige endringen i høyresiden er altså $-r$, og størrelsen
på endringen er $\lVert r\rVert_2$. **Med fast $A$ er residualnormen
den absolutte bakoverfeilen.** I eksemplet er den $10^{-4}$.

Liten bakoverfeil, men stor foroverfeil: for å forstå forskjellen må vi
se på hvordan matrisen endrer vektorlengder.

### Matrisens 2-norm: den største strekkfaktoren

Vi har nettopp brukt 2-normen til vektorer. Nå trenger vi en norm for
matriser som er knyttet direkte til transformasjonen $z\mapsto Az$.
Vi definerer **matrisens 2-norm** ved

$$\boxed{\lVert A\rVert_2
=\max_{z\ne0}\frac{\lVert Az\rVert_2}{\lVert z\rVert_2}
=\max_{\lVert z\rVert_2=1}\lVert Az\rVert_2.}$$

Vi sender alle enhetsvektorer gjennom $A$ og finner den lengste
resultatvektoren. Normen er lengden til denne, altså den største
strekkfaktoren. Definisjonen gir
$\lVert Az\rVert_2\le\lVert A\rVert_2\lVert z\rVert_2$ for enhver $z$.

For $B=\operatorname{diag}(3,1)$ blir $(1,0)^T$ strukket til $(3,0)^T$,
mens $(0,1)^T$ beholder lengden sin. Ingen enhetsvektor blir lengre enn
$3$, så $\lVert B\rVert_2=3$: enhetssirkelen blir en ellipse med lengste
halvakse $3$ (bildet står i «Gå i dybden», og uke 7 viser det interaktivt).
I NumPy er `np.linalg.norm(A, 2)` matrisens 2-norm; uten `2` får du
Frobenius-normen, som måler noe annet («Gå i dybden»).

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

For diagonalmatrisene i tabellen er strekkfaktorene diagonaltallene, så
$\kappa_2$ er største delt på minste. I 6.4 ser vi at det samme gjelder
egenverdiene til en SPD-matrise: $\kappa_2(A)=\lambda_{\max}/\lambda_{\min}$.

Matrisen fra det første eksemplet har altså kondisjonstall $10^4$:
når vi løser systemet, deler vi andre komponent i høyresiden på $10^{-4}$.
Nå gjør vi denne sammenhengen presis.

### Hva betyr tallet for nøyaktigheten?

Vi vil vite hvor stor **foroverfeilen** kan være, men vi kan bare regne ut
residualen. Kondisjonstallet binder dem sammen:

$$\boxed{\frac{\lVert\hat x-x_*\rVert_2}{\lVert x_*\rVert_2}
\le\kappa_2(A)\,\frac{\lVert b-A\hat x\rVert_2}{\lVert b\rVert_2}.}$$

Til venstre står **relativ foroverfeil**. Til høyre står **relativ
bakoverfeil** med fast $A$, ganget med kondisjonstallet. Hvorfor? Feilen er
$\hat x-x_*=-A^{-1}r$, og $A^{-1}$ kan strekke $r$ med opptil
$\lVert A^{-1}\rVert_2$. Når vi gjør feilen relativ til løsningen, kommer
også $\lVert A\rVert_2$ inn. De tre korte trinnene står i «Gå i dybden».

**Sjekk på eksemplet over.** Svaret $\hat x=(1,0)^T$ har relativ residual
omtrent $10^{-4}$, og $\kappa_2(A)=10^4$. Grensen blir omtrent $1$. Den
faktiske relative feilen er
$\lVert(0,-1)\rVert_2/\lVert(1,1)\rVert_2=1/\sqrt2\approx0.71$. Grensen
holder, og den er nesten nådd.

Grensen sier hvor stor feilen **kan** bli, ikke at den alltid blir så stor.
Stor feil i et dårlig kondisjonert problem skyldes **følsomhet i
problemet**, ikke en feil i algoritmen; et forsøk i «Gå i dybden» viser dette.

### Hva betyr dette for stoppkravet vårt?

I et iterativt program kan vi kreve

$$\lVert b-Ax_k\rVert_2\le\text{atol}+\text{rtol}\lVert b\rVert_2.$$

`atol` er en absolutt toleranse og `rtol` en relativ toleranse.
Dette begrenser residualen, altså bakoverfeilen med fast $A$, men ikke
foroverfeilen direkte; den avhenger også av kondisjonstallet. Vi
begrenser i tillegg antall steg, og rapporterer manglende konvergens hvis
stoppkravet ikke er nådd. En liten endring mellom to iterasjoner alene er
ikke et sikkert stopptegn.

**Hvis relativ residual er $10^{-10}$ og kondisjonstallet er $10^6$,
hvilken øvre grense får dere for relativ feil?**

**Øv på dette:** [Liten residual, godt svar?](#uke6-ov-residual)

::: {.reading-step title="Gå i dybden: feilgrensen, enhetssirkelen og et forsøk med kondisjonstall"}

**Feilgrensen i tre trinn**

Sett $e=\hat x-x_*$. Siden den eksakte løsningen oppfyller $Ax_*=b$, er

$$r=b-A\hat x=Ax_*-A\hat x=-Ae.$$

Anta at $A$ er invertibel og $b\ne0$. Da er også $x_*\ne0$,
så vi kan dele på både $\lVert b\rVert_2$ og $\lVert x_*\rVert_2$.

*1. Del den absolutte feilgrensen på størrelsen til løsningen.*
Fra $r=-Ae$ får vi $e=-A^{-1}r$. Matrisenormen gir en grense for
lengden av et matriseprodukt: $\lVert Cz\rVert_2\le\lVert C\rVert_2\lVert z\rVert_2$.
Vi bruker dette med $C=A^{-1}$ og $z=r$. Minustegnet endrer ikke lengden, så

$$\lVert e\rVert_2=\lVert A^{-1}r\rVert_2
\le\lVert A^{-1}\rVert_2\lVert r\rVert_2.$$

Del begge sider på $\lVert x_*\rVert_2$. Da får vi relativ feil på venstresiden:

$$\frac{\lVert e\rVert_2}{\lVert x_*\rVert_2}
\le\lVert A^{-1}\rVert_2\lVert r\rVert_2
\frac{1}{\lVert x_*\rVert_2}.$$

*2. Finn en øvre grense for faktoren $1/\lVert x_*\rVert_2$.*
Høyresiden inneholder fortsatt den ukjente løsningen $x_*$.
Vi bruker at $b=Ax_*$. Den samme regelen for matrisenormen gir

$$\lVert b\rVert_2=\lVert Ax_*\rVert_2
\le\lVert A\rVert_2\lVert x_*\rVert_2.$$

Del nå **begge sider** på det positive tallet
$\lVert b\rVert_2\lVert x_*\rVert_2$. På venstresiden forkortes
$\lVert b\rVert_2$, og på høyresiden forkortes $\lVert x_*\rVert_2$:

$$\frac{1}{\lVert x_*\rVert_2}
\le\frac{\lVert A\rVert_2}{\lVert b\rVert_2}.$$

Faktoren med den ukjente løsningen kan altså erstattes av en øvre grense
som bare bruker $A$ og $b$.

*3. Sett denne grensen inn i resultatet fra trinn 1.*
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
Produktet i parentes er kondisjonstallet $\kappa_2(A)$. Setter vi tilbake
$e=\hat x-x_*$ og $r=b-A\hat x$, får vi grensen i hovedteksten.

Vi kan også endre dataene med vilje og løse $A\tilde x=b+\delta b$.
Da gir subtraksjon av $Ax_*=b$ at $A(\tilde x-x_*)=\delta b$. Samme regning gir

$$\frac{\lVert\tilde x-x_*\rVert_2}{\lVert x_*\rVert_2}
\le\kappa_2(A)\frac{\lVert\delta b\rVert_2}{\lVert b\rVert_2}.$$

En eksakt løsning av de endrede likningene kan altså ligge langt fra
løsningen av de opprinnelige: den relative endringen i svaret kan være
opptil $\kappa_2(A)$ ganger den relative endringen i dataene. Dette er
følsomhet i problemet, også kalt kondisjon.

**Mer om normer og kondisjonstall**

En strekkfaktor på $0.01$ betyr at vektoren blir hundre ganger kortere;
dette kalles også at vektoren **dempes**. Faktoren trenger altså ikke være
større enn $1$. Til matriser har vi tidligere brukt **Frobenius-normen**
$\lVert A\rVert_F=\sqrt{\sum_{i,j}a_{ij}^2}$, som summerer kvadratene av
alle elementene. For $B=\operatorname{diag}(3,1)$ er
$\lVert B\rVert_F=\sqrt{10}$, mens $\lVert B\rVert_2=3$: de to normene
måler forskjellige ting.

Store matriseelementer betyr ikke automatisk dårlig kondisjon.
Å multiplisere hele $A$ med samme ikke-null tall endrer ikke
$\kappa_2(A)$. En singulær matrise har ingen invers; da bruker vi
konvensjonen $\kappa_2(A)=\infty$.

**Bildet av enhetssirkelen**

Cellen sender enhetssirkelen gjennom $B=\operatorname{diag}(3,1)$ og
skriver ut begge normene, slik at vi kan sammenligne med tallene i
hovedteksten.

```{pyodide-python}
#| label: week6-matrix-norm
# Enhetsvektorer inn, bildene Bz ut; hjelperen tegner begge.
B = np.diag([3., 1.])
show_unit_circle_image(B)
print('2-norm:', np.linalg.norm(B, 2))
print('Frobenius-norm:', np.linalg.norm(B, 'fro'))
```

Begge bilder har samme akseskala. Øverste bilde viser retningene vi
prøver; nederste viser hvordan $B$ virker på dem. Den lengste halvaksen
i ellipsen gir 2-normen. En rotasjon av ellipsen ville ikke endret
lengden til denne halvaksen.

**Fordypningsforsøk: liten dataendring, stor endring i svaret?**

Feilgrensen sier hva som *kan* skje. Nå vil vi se det skje. Vi lager fem
systemer der bare kondisjonstallet endres: likningene er $x_1=1$ og
$x_2/K=0$, med løsning $(1,0)$, og matrisen $\operatorname{diag}(1,1/K)$
har kondisjonstall $K$. Så endrer vi høyresiden i andre likning fra $0$ til
$10^{-8}$. Koden kaller den nye høyresiden `b_endret` og lar
`np.linalg.solve` løse hvert system. Målet er å se om feilen i svaret
virkelig vokser med kondisjonstallet, selv om løseren gjør jobben sin.

- Kjør cellen, og les av den relative feilen for $K=10^8$.
- Sammenlign med residualen mot den endrede høyresiden.
- Flytt endringen til første komponent (`[1e-8, 0.]`), og kjør igjen. Hva skjer nå?

```{pyodide-python}
#| label: week6-conditioning-experiment
# Samme løser på fem systemer; bare kondisjonstallet K endres.
K_verdier = [1., 1e2, 1e4, 1e6, 1e8]
x_fasit = np.array([1., 0.])
b = np.array([1., 0.])
b_endret = b + np.array([0., 1e-8])
feil = []
print('K          relativ feil   relativ residual mot b_endret')
for K in K_verdier:
    A = np.diag([1., 1/K])
    x = np.linalg.solve(A, b_endret)
    # Sammenlign med den opprinnelige løsningen ...
    feil.append(np.linalg.norm(x - x_fasit) / np.linalg.norm(x_fasit))
    # ... og kontroller de samme likningene som løseren fikk.
    residual = np.linalg.norm(b_endret - A @ x) / np.linalg.norm(b_endret)
    print(f'{K:9.1e}  {feil[-1]:12.2e}  {residual:12.2e}')
show_conditioning(K_verdier, feil)
```

**Hva viser forsøket?** Når kondisjonstallet øker fra $1$ til $10^8$,
vokser feilen fra $10^{-8}$ til $1$, altså $100\%$ relativ feil. Den andre
likningen løses ved å gange med $K$; derfor blir også dataendringen ganget
med $K$. Residualen mot den endrede høyresiden er null: programmet
oppfyller de likningene det fikk, selv når svaret ligger langt fra den
opprinnelige løsningen. **Et følsomt problem kan gi stor feil i svaret selv
om løseren gjør en god jobb.** Flytter du endringen til første komponent,
blir feilen $10^{-8}$ for alle $K$. Kondisjonstallet sier hvor stor feilen
kan bli; den faktiske feilen avhenger også av hvilken komponent vi endrer.

**Prøv selv**

1. Finn både 2-normen og Frobenius-normen til $I_2$ og
   $\operatorname{diag}(1,10^{-4})$. Finn også kondisjonstallene.
2. Begrunn at $\kappa_2(cA)=\kappa_2(A)$ når $c\ne0$.
3. Lukk boksen, og gjenta de tre trinnene i feilgrensen selv.
   Hvorfor må $b$ være ulik null?
4. Finn den nye løsningen i forsøket uten Python. Hva blir
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

Med $b=0$ er $x_*=0$, og vi kan ikke dele på $\lVert x_*\rVert_2$.
Null residual gir null feil når $A$ er invertibel. For stoppkravseksemplet
er grensen $10^6\cdot10^{-10}=10^{-4}$.

I forsøket har både den opprinnelige høyresiden og løsningen
lengde $1$. Vi kan derfor lese den relative feilen direkte fra
endringen i løsningen. Sett $\varepsilon=10^{-8}$:

| Hvor legger vi til $\varepsilon$? | Nøyaktig løsning av de endrede likningene | Relativ foroverfeil |
|:--|:--|:--|
| Første komponent i høyresiden | $(1+\varepsilon,0)$ | $\varepsilon$ |
| Andre komponent, som i forsøket | $(1,K\varepsilon)$ | $K\varepsilon$ |

Kontrollerer vi forsøket mot den **opprinnelige** høyresiden,
blir residualen $(0,-\varepsilon)$ og relativ bakoverfeil
$\varepsilon$. Utskriften kontrollerer den **endrede**
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
uke 7 forklarer sammenhengen med singulærverdier.

:::

## 6.4 Løsningen som minimum

::: {#uke6-energi}
:::

### Fra to likninger til én funksjon

**Kan vi knytte en funksjonsverdi til hver vektor $x$, slik at løsningen
er punktet der funksjonen er minst?** Da kan vi forstå GS geometrisk
og lete etter bedre søkeretninger.

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

Diagonalen i $A$ gir kvadratleddene, de to like elementene utenfor
diagonalen gir kryssleddet $uv$, og $b$ gir de lineære leddene.

### Hvorfor er løsningen akkurat minimumet?

Løsningen av likningene er $x_*=(1,2)^T$, og $\phi(1,2)=-\tfrac{15}{2}=-7.5$.
Hvorfor skal $\phi$ være minst akkurat der? Vi tar et vilkårlig annet
punkt $(u,v)$ og beregner hvor mye høyere funksjonsverdien er. Skriv $h_u=u-1$ og $h_v=v-2$ for forskjellene i de
to koordinatene, og sett $u=1+h_u$ og $v=2+h_v$ inn i hvert ledd av $\phi$:

$$
\begin{aligned}
\tfrac32(1+h_u)^2&=\tfrac32+3h_u+\tfrac32h_u^2,\\
(1+h_u)(2+h_v)&=2+2h_u+h_v+h_uh_v,\\
(2+h_v)^2&=4+4h_v+h_v^2,\\
-5(1+h_u)-5(2+h_v)&=-15-5h_u-5h_v.
\end{aligned}
$$

Vi samler leddene etter grad:

$$\phi(1+h_u,2+h_v)=\underbrace{\phi(1,2)}_{-15/2}+\underbrace{(3\cdot1+2-5)}_{=0}\,h_u
+\underbrace{(1+2\cdot2-5)}_{=0}\,h_v+\tfrac32h_u^2+h_uh_v+h_v^2 .$$

De lineære leddene forsvinner **fordi $(1,2)$ løser likningene**:
koeffisientene er nettopp $3u+v-5$ og $u+2v-5$ regnet ut i løsningen.
Det som står igjen, fullfører vi til kvadrater:

$$\tfrac32h_u^2+h_uh_v+h_v^2=\tfrac32\Bigl(h_u+\tfrac13h_v\Bigr)^2-\tfrac16h_v^2+h_v^2
=\tfrac32\Bigl(h_u+\tfrac13h_v\Bigr)^2+\tfrac56h_v^2 .$$

Begge leddene er ikke-negative, og summen er null bare når $h_u=h_v=0$.
**Alle andre punkter har større funksjonsverdi enn $(1,2)$.**
Vi kan derfor formulere oppgaven på to likeverdige måter:

$$\boxed{Ax=b\quad\Longleftrightarrow\quad
x\text{ minimerer }\phi(x)=\tfrac12x^TAx-b^Tx.}$$

Dette gjelder for matrisen vår. Snart skal vi se nøyaktig hvilken
forutsetning på $A$ som gjør at det også gjelder generelt.
Merk at vi **minimerer $\phi$**, ikke prøver å gjøre $\phi$ lik null.
I dette eksemplet er minsteverdien negativ.

### Hvorfor tegne nivåkurver?

Grafen $z=\phi(u,v)$ er en skål med bunn i $(1,2,-7.5)$. En bane på
flaten er vanskelig å følge i et tredimensjonalt bilde, så vi vil også se
skålen rett ovenfra, i $(u,v)$-planet der GS flytter seg. Som høydekurver
på et kart viser **nivåkurvene** $\phi(u,v)=c$ alle punkter med samme
funksjonsverdi; du kjenner dem fra Matematikk 2. For vår $\phi$ er de
ellipser med sentrum $(1,2)$ (utregningen står i «Gå i dybden»).
Funksjonen står synlig i cellen; en hjelper tegner flaten og nivåkurvene.
Målet er å kunne lese av en funksjonsverdi i nivåkurvebildet.
**Punktene $(0,2)$ og $(2,2)$ har begge funksjonsverdi $-6$. Hvor vil dere
plassere dem på skålen og i nivåkurvebildet?**

### Eksperiment 3 – samme funksjon, to bilder

- Kjør cellen, og finn nivåkurven merket $-6$.
- Finn de to svarte punktene på den.
- Forklar hvorfor ingen kurve er merket $-8$.

```{pyodide-python}
#| label: week6-energy-surface
# Samme phi brukes til både flaten og nivåkurvene.
def phi(u, v):
    return 1.5*u**2 + u*v + v**2 - 5*u - 5*v

print('phi(1,2) =', phi(1, 2), ' phi(0,2) =', phi(0, 2), ' phi(2,2) =', phi(2, 2))
show_surface_and_levels(phi, minimum=(1, 2), marked=[(0, 2), (2, 2)])
```

**Hva viser forsøket?** Punktene $(0,2)$ og $(2,2)$ ligger på samme høyde
på flaten og på samme ellipse, merket $-6$: nivåkurvene viser både *hvor
vi er* og *hvilken funksjonsverdi vi har*. Ingen kurve er merket $-8$,
fordi $\phi$ aldri blir mindre enn $-7.5$. En metode som minimerer $\phi$,
må ende i stjernen.

### Hvilke matriser gir en skål med én bunn?

Vi bruker her **symmetrisk positivt definitte (SPD)** matriser:

$$A^T=A,\qquad z^TAz>0\quad\text{for alle }z\ne0.$$

Symmetrien gjør at kryssleddene fra hver side av diagonalen passer
sammen. Positiv definitthet betyr at det kvadratiske bidraget er positivt i enhver
ikke-null retning. Kvadratfullføringen ovenfor viser at matrisen vår
har nettopp denne egenskapen.

**Hva får vi igjen for denne forutsetningen?** For enhver SPD-matrise
finnes nøyaktig én løsning av $Ax=b$, og den er det eneste punktet der
$\phi$ er minst. Beviset og et eksempel med tre ukjente står i «Gå i dybden».

Et SPD-system kan også løses direkte med **Cholesky-faktorisering**:
vi skriver $A=LL^T$ og løser først $Ly=b$, så $L^Tx=y$.
Her er $L$ nedre triangulær, altså null over diagonalen.
(Dette er en annen matrise enn den strengt nedre delen $L$ av $A$ fra 6.1.)
I [uke 10](uke10.qmd#uke10-cholesky) regner vi gjennom denne metoden
og bruker den til å finne Newton-retninger.

En symmetrisk matrise er positivt definitt akkurat når alle egenverdiene er
positive (begrunnelsen, med spektralteoremet fra uke 5, står i
«Gå i dybden»). Egenverdiene er da strekkfaktorene, så for SPD er
$\kappa_2(A)=\lambda_{\max}/\lambda_{\min}$: stor forskjell mellom
egenverdiene gir en skål som er bratt i én retning og slak i en annen.
Matrisen $A_b$ fra 6.2 er ikke SPD: $z^TA_bz=-2$ for $z=(1,-1)^T$.

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
$v=v_k$. Det er nøyaktig den første GS-oppdateringen. På samme måte gir
minimering langs den vertikale linjen $u=u_{k+1}$ den andre
GS-oppdateringen (regningen står i «Gå i dybden»).
**GS løser altså et lite minimeringsproblem for hver koordinat.**
Vi lar én koordinat variere fritt og velger det beste punktet langs
denne linjen (GS-banen i nivåkurvebildet står i «Gå i dybden»).
GS minimerer langs koordinataksene. **Kan vi velge andre
linjer som tar oss raskere mot minimumet?** I 6.5 bruker vi funksjonens helninger til
å velge retning. I 6.6 undersøker vi hvordan CG kan bevare det vi
allerede har oppnådd i tidligere retninger.

**Øv på dette:** [Fra likningssystem til minimum](#uke6-ov-skal) og
[kondisjonstall fra egenverdiene](#uke6-ov-kondisjon).

::: {.reading-step title="Gå i dybden: nivåkurver, hele GS-sveipet, tre ukjente og den generelle minimeringen"}

**Nivåkurvene er ellipser**

En **nivåmengde** er mengden av punkter som har en bestemt
funksjonsverdi $c$:

$$\{(u,v):\phi(u,v)=c\}.$$

For funksjonen vår er dette en **nivåkurve** når $c>-7.5$.
Følg én kurve, og høyden endrer seg ikke. Geometrisk skjærer vi skålen
med planet $z=c$ og tegner skjæringskurven sett ovenfra. Høyden $c$ står
som merking på kurven. Setter vi inn uttrykket rundt minimumet, får vi

$$\tfrac32(u-1)^2+(u-1)(v-2)+(v-2)^2=c+\tfrac{15}{2}.$$

Dette er ellipser med sentrum $(1,2)$ når høyresiden er positiv.
For $c=-7.5$ består nivåmengden bare av minimumpunktet, og for
$c<-7.5$ er den tom. Kryssleddet gjør at ellipsenes hovedakser ikke
følger koordinataksene.

**Positiv definitthet og egenverdier**

Fra [uke 5](uke5.qmd#uke5-basis) («Gå i dybden» om spektralteoremet) har vi
$z^TAz=\sum_i\lambda_ic_i^2$ for en symmetrisk matrise, der $c_i$ er
koordinatene til $z$ i en ortonormal egenvektorbasis $q_1,\ldots,q_n$. Er
alle $\lambda_i>0$, er $A$ positivt definitt. Omvendt gir $z=q_i$ at
$q_i^TAq_i=\lambda_i$, så positiv definitthet krever $\lambda_i>0$.

Forutsetningen betyr noe. For $A_b$ fra 6.2 så vi i hovedteksten at
$z^TA_bz<0$ for $z=(1,-1)^T$, selv om diagonalen er positiv. Den tilhørende
funksjonen har ikke en skål med én bunn. Vi kan derfor ikke tolke ethvert lineært system som
minimering av denne $\phi$.

**Andre halvdel av GS-sveipet**

Vi holder **den nye** $u=u_{k+1}$ fast og minimerer langs den
vertikale linjen:

$$h(v)=\phi(u_{k+1},v),\qquad
h'(v)=u_{k+1}+2v-5=0
\quad\Longrightarrow\quad v_{k+1}=\frac{5-u_{k+1}}2.$$

Også dette er et minimum, fordi $h''(v)=2>0$.
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
forstyrret igjen, slik vi så i 6.1. I dette SPD-problemet kan
funksjonsverdien aldri øke ved et eksakt GS-steg, og den avtar strengt når
koordinaten faktisk endres. Dette er et utsagn om $\phi$; residualnormen
trenger ikke avta i hvert koordinatsteg.

**GS-banen i nivåkurvebildet**

Vi tegner GS-banen fra eksperiment 1 oppå nivåkurvene, med hvert
koordinatsteg, slik at vi ser minimeringene langs linjene. Hjelperen
`bowl_plot` tegner nivåkurvene til $\phi$ og en ferdig beregnet bane.
Stjernen er en direkte beregnet referanseløsning; den brukes ikke av
GS-iterasjonen. Figuraksene $x_1,x_2$ er våre $u,v$.

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

Utskriften viser at $\phi$ synker fra $0$ til $-4.166667$ og $-6.944444$ i
de to første koordinatstegene, men ikke helt ned til $-7.5$.
**Hvilke linjer minimerer de to første stegene langs? Hvorfor fortsetter
ikke første steg helt til sentrum av ellipsene?** Å gå lenger langs
samme linje ville økt funksjonen igjen; sentrum ligger på en annen
linje.

**Prøv selv**

1. For det todimensjonale eksemplet: regn ut $\phi$ i de tre første
   punktene i tabellen over, og finn neste GS-mellompunkt etter $(5/3,5/3)$.
2. La
   $$A=\begin{bmatrix}4&1&0\\1&3&1\\0&1&2\end{bmatrix},\qquad
   b=\begin{bmatrix}6\\10\\8\end{bmatrix},\qquad x=(u,v,w)^T.$$
   Skriv $\phi(u,v,w)=\tfrac12x^TAx-b^Tx$ uten matriseprodukter.
   Hvilke kryssledd finnes, og hvorfor mangler $uw$?
3. Kontroller at $x_*=(1,2,3)^T$ løser systemet. Finn $\phi(x_*)$,
   og gjør ett GS-sveip fra null ved å minimere i $u$, deretter $v$,
   deretter $w$.
4. Utled $\phi(x)-\phi(x_*)=\tfrac12(x-x_*)^TA(x-x_*)$ for SPD.
   Hvor bruker dere symmetrien, og hvor bruker dere positiv definitthet?

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

For å kontrollere SPD lar vi $z=(z_1,z_2,z_3)^T$. Kvadratfullføring gir

$$z^TAz=4(z_1+z_2/4)^2+\tfrac{11}{4}(z_2+4z_3/11)^2+\tfrac{18}{11}z_3^2.$$

Alle koeffisientene er positive. Summen kan være null bare hvis først
$z_3=0$, deretter $z_2=0$ og til slutt $z_1=0$. Matrisen er altså SPD.

Likningssystemet er

$$4u+v=6,\qquad u+3v+w=10,\qquad v+2w=8.$$

Første og tredje likning gir $u=(6-v)/4$ og $w=(8-v)/2$.
Setter vi disse inn i andre, får vi

$$\frac{6-v}{4}+3v+\frac{8-v}{2}=10
\quad\Longrightarrow\quad 22+9v=40.$$

Dermed er $v=2$, $u=1$ og $w=3$, som lovet.
Vi kontrollerer $Ax_*=(6,10,8)^T=b$ og finner

$$\phi(x_*)=-\tfrac12b^Tx_*=-\tfrac12(6+20+24)=-25.$$

La nå $h_u=u-1$, $h_v=v-2$ og $h_w=w-3$, som i hovedteksten. Forskjellen
fra minsteverdien er

$$\phi(u,v,w)+25
=\tfrac12\left[4(h_u+h_v/4)^2+\tfrac{11}{4}(h_v+4h_w/11)^2+\tfrac{18}{11}h_w^2\right].$$

Dette viser direkte at $(1,2,3)$ er det eneste minimumet.
Grafen til en funksjon av tre variabler trenger **fire koordinater**:
$(u,v,w,\phi(u,v,w))$. Den kan derfor ikke tegnes som den vanlige
skålflaten i eksperiment 3. Men nivåmengdene $\phi(u,v,w)=c$ ligger i
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

I punkt 1 under «Prøv selv» er funksjonsverdiene $0,-25/6,-125/18$. Neste
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

Siste likhet bruker $Ax_*=b$. Positiv definitthet gjør at det siste
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
  i tegnefeltet `ax`, slik nivåkurvebildet i eksperiment 3 gjorde;
- tegner de ferdig beregnede banene i `paths`, med navn som forklaring;
- markerer løsningen med en stjerne. Den bruker `np.linalg.solve`
  bare for dette referansepunktet; GS-banen beregnes av `gs_path`.

Hjelperen brukes her for symmetriske $2\times2$-matriser.
`{'GS': path}` betyr «tegn punktene i `path` og kall banen GS».
Matrisen og høyresiden bestemmer nivåkurvene, mens `path` bestemmer
hvilke løsningsforslag som forbindes i figuren.

:::

## 6.5 Fra skål til søkeretning

::: {#uke6-retning}
:::

### Vi kan velge andre linjer enn koordinataksene

GS minimerer langs koordinataksene, men de er valgt av oss og trenger
ikke passe til skålen. Nå vil vi velge retning ut fra **hvordan funksjonen
endrer seg der vi står**. To spørsmål må besvares før hvert steg:
**hvilken retning** skal vi gå i, og **hvor langt** skal vi gå? Går vi for
langt, kan vi passere det laveste punktet på linjen og begynne å gå
oppover igjen.

### Hvor kommer gradienten fra?

Vi bruker fremdeles funksjonen fra 6.4:

$$\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v.$$

Holder vi $v$ fast og deriverer med hensyn på $u$, får vi helningen i
horisontal retning, og omvendt. De to **partiellderiverte** er

$$\frac{\partial\phi}{\partial u}=3u+v-5,\qquad
\frac{\partial\phi}{\partial v}=u+2v-5.$$

Vi samler dem i en vektor, **gradienten**:

$$\nabla\phi(u,v)=\begin{bmatrix}3u+v-5\\u+2v-5\end{bmatrix}.$$

Dette er den samme vektoren som $Ax-b$. Med $r=b-Ax$ får vi

$$\boxed{\nabla\phi(x)=Ax-b=-r.}$$

For et lite steg $h=(h_u,h_v)^T$ i planet bruker vi «endring omtrent lik
derivert ganger endring i variabelen» i hver koordinat og legger sammen:

$$\phi(u+h_u,v+h_v)-\phi(u,v)
\approx \frac{\partial\phi}{\partial u}h_u
+\frac{\partial\phi}{\partial v}h_v
=\nabla\phi(x)^Th.$$

Vi sammenligner små steg med **samme lengde**. Indreproduktet blir
mest negativt når steget peker motsatt gradienten. Derfor gir
$-\nabla\phi(x)=r$ den bratteste lokale nedgangen i funksjonsverdi.
Begrunnelsen med Cauchy–Schwarz står i «Gå i dybden».

### Fra retning til det beste punktet på linjen

La $x$ være punktet vi har kommet til. Vi velger en vektor $p\ne0$ som
**søkeretning** og leter bare langs linjen gjennom $x$:

$$x_{\mathrm{ny}}=x+\alpha p.$$

Vi velger den $\alpha$ som gir minst funksjonsverdi langs linjen. Dette
kalles et **linjesøk**; det gir det beste punktet på denne ene linjen,
ikke nødvendigvis minimumet i hele planet.

I startpunktet $x_0=(0,0)^T$ er gradienten $(-5,-5)^T$ og residualen
$r_0=(5,5)^T$. Et lite steg i residualens retning øker derfor både
$u$ og $v$. Likevel **synker** $\phi$: «nedover» viser til høyden på
skålen, ikke til nedover på arket. Vi velger $p_0=r_0=(5,5)^T$.
Punktene på linjen er $(5\alpha,5\alpha)$. Setter vi disse inn i $\phi$, får vi

$$\psi(\alpha)=\phi(5\alpha,5\alpha)
=\tfrac32\cdot25\alpha^2+25\alpha^2+25\alpha^2-25\alpha-25\alpha
=\tfrac{175}{2}\alpha^2-50\alpha.$$

Derivasjon gir $\psi'(\alpha)=175\alpha-50=0$, altså $\alpha_0=2/7$, og
parabelen vender opp. Første nye punkt er $x_1=(10/7,10/7)^T$: best på
linjen $u=v$, men ennå ikke $(1,2)$.

Legg merke til hvor tallene i $\psi$ kommer fra: $50=p_0^Tr_0$ og
$175=p_0^TAp_0$. Det gjelder generelt. For et punkt $x$ med residual
$r=b-Ax$ og en retning $p$ gir symmetrien til $A$ at de to kryssleddene
$\tfrac12\alpha\,x^TAp$ og $\tfrac12\alpha\,p^TAx$ er like, så

$$
\begin{aligned}
\phi(x+\alpha p)&=\tfrac12(x+\alpha p)^TA(x+\alpha p)-b^T(x+\alpha p)\\
&=\tfrac12x^TAx+\alpha\,p^TAx+\tfrac12\alpha^2\,p^TAp-b^Tx-\alpha\,p^Tb\\
&=\phi(x)-\alpha\,p^Tr+\tfrac12\alpha^2\,p^TAp .
\end{aligned}
$$

Derivasjon med hensyn på $\alpha$ gir $-p^Tr+\alpha\,p^TAp=0$, altså

$$\boxed{\alpha=\frac{p^Tr}{p^TAp}.}$$

Nevneren er positiv når $A$ er SPD og $p\ne0$. Med $p_0=r_0$ får vi igjen
$\alpha_0=50/175=2/7$. Cellen nedenfor bruker denne formelen.

Nå ser vi linjesøket i to bilder: hvor punktene $x_0+\alpha p_0$ ligger i
planet, og hvilken verdi $\psi(\alpha)$ de har.

| $\alpha$ | Punktet $x_0+\alpha p_0$ i planet | Høyden $\psi(\alpha)$ |
|:--|:--|:--|
| $0$ | $(0,0)$ | $0$ |
| $0.2$ | $(1,1)$ | $-6.5$ |
| $2/7$ | $(10/7,10/7)$ | $-50/7\approx-7.143$ |
| $0.4$ | $(2,2)$ | $-6$ |

Figuren tegner også den rette linjen fra $x_0$ til løsningen, som metoden
ikke kjenner. Målet er å se hvorfor $\alpha_0=2/7$ er best langs linjen,
og hvorfor det likevel ikke er nok.

### Eksperiment 4a – ett steg, sett på to måter

- Kjør cellen, og følg $\alpha=2/7$ i begge bildene.
- Forklar hvorfor $\alpha=0.4$ er dårligere enn $2/7$, selv om vi går lenger.
- Sammenlign søkelinjen med den prikkede linjen til løsningen.

```{pyodide-python}
#| label: week6-line-search
# Linjesøket fra x0 i residualens retning, med formelen alpha = pᵀr / pᵀAp.
A = np.array([[3.,1.], [1.,2.]])
b = np.array([5.,5.])
x0 = np.zeros(2)
r0 = b - A @ x0
p0 = r0.copy()
alpha0 = (p0 @ r0)/(p0 @ A @ p0)
x1 = x0 + alpha0*p0
print('alpha0 =', alpha0, ' x1 =', x1, ' r1 =', b - A @ x1)
line_search_plot(A, b, x0, p0, alpha0)
```

**Hva viser forsøket?** Utskriften gir $\alpha_0\approx0.2857=2/7$,
$x_1\approx(1.4286,1.4286)$ og $r_1\approx(-0.714,0.714)$. Ved
$\alpha=2/7$ er vi i bunnen av parabelen; ved $\alpha=0.4$ har vi gått
forbi og er på vei opp igjen. Hele skålens minimum $-7.5$ nås ikke langs
linjen, fordi residualen peker brattest ned der vi står, ikke mot bunnen.
Den oransje nivåkurven berører søkelinjen i $x_1$, og den grønne pilen
$r_1$ står vinkelrett på både nivåkurven og søkelinjen: et eksakt
linjesøk gir en ny residual som er ortogonal til søkeretningen.

### Bratteste nedstigning: mål helningen på nytt

Den enkleste oppskriften gjentar samme idé: beregn residualen i det nye
punktet, bruk den som retning, og gjør et linjesøk. Dette kalles
**bratteste nedstigning med eksakt linjesøk**. Metoden husker ikke
forrige retning. Funksjonsverdien synker i hvert steg, men på en smal
skål kan metoden gå på kryss og tvers av dalen.

For å se dette sammenligner vi to systemer med samme løsning
$x_*=(1,-1.1)^T$, samme start $(0,0)^T$ og samme egenvektorretninger. I
øverste bilde er begge egenverdiene $1$ (sirkler, $\kappa_2=1$), i
nederste $1$ og $0.04$ (smale ellipser, $\kappa_2=25$). Hjelperen
`descent_path` gjør stegene med formelen for $\alpha$ over, og `two_bowls`
tegner nivåkurvene og banen for hver skål. Målet er å se
om formen på skålen bestemmer hvor mange steg metoden trenger.
**I hvilket bilde tror dere residualen peker rett mot løsningen?**

### Eksperiment 4b – rund eller smal skål?

- Kjør cellen, og tell stegene i nederste bilde.
- Bytt `.04` til `.2` ($\kappa_2=5$). Hvor raskt kommer banen nær stjernen nå?

```{pyodide-python}
#| label: week6-steepest-descent
# Samme dreining Q og samme løsning; bare den minste egenverdien endres.
Q = np.array([[1.,-1.],[1.,1.]])/np.sqrt(2)
star = np.array([1.,-1.1])
cases = []
for small in [1., .04]:
    A = Q @ np.diag([1.,small]) @ Q.T
    b = A @ star
    path = descent_path(A, b, [0.,0.], steps=16)
    cases.append((A, b, {'Bratteste nedstigning': path},
                  f'κ₂(A) = {1/small:g}: {len(path)-1} steg vist'))
two_bowls(cases)
```

**Hva viser forsøket?** I øverste bilde treffer ett linjesøk bunnen. For
$A=I$ er $r=b-x=x_*-x$, altså nøyaktig vektoren fra gjeldende punkt til
løsningen. I nederste bilde er residualen påvirket av ulik skalering i de to
egenretningene. Banen skifter retning ved hvert markerte punkt, bruker
alle de 16 stegene som er vist, og er fortsatt et godt stykke fra stjernen.

Hvert linjesøk er optimalt på sin linje. Det er **valget av neste
linje** som gjør hele banen langsom. I 6.6 spør vi om det neste
linjesøket kan velges slik at vi slipper å lete i den gamle retningen
på nytt. Dette leder til CG.

**Øv på dette:** [Ett steg med bratteste nedstigning](#uke6-ov-linjesok)

::: {.reading-step title="Gå i dybden: fra partiellderiverte til eksakt linjesøk"}

**Prøv selv**

1. Regn ut $\nabla\phi(0,0)$ og $\nabla\phi(10/7,10/7)$.
   Kontroller at $r_0^Tr_1=0$.
2. Deriver $\psi(\alpha)$ i eksperiment 4a. Finn minimumsverdien,
   og sammenlign med $\phi(1,2)$.
3. Vis at punktet etter et eksakt linjesøk oppfyller $p^Tr_{\mathrm{ny}}=0$.
4. Forklar med Cauchy–Schwarz hvorfor negativ gradient gir brattest
   lokal nedgang når vi sammenligner retninger med lengde $1$.

**Regnegangen**

Gradientene er $(-5,-5)^T$ og $(5/7,-5/7)^T$. Derfor er
$r_0^Tr_1=(5,5)(-5/7,5/7)^T=0$.
Videre er $\psi'(\alpha)=175\alpha-50$, så $\alpha_0=2/7$.
Linjens minsteverdi er $-50/7\approx-7.143$, mens hele skålens
minsteverdi er $-7.5$.

Med $\alpha=p^Tr/p^TAp$ fra hovedteksten er
$p^T(Ax_{\mathrm{ny}}-b)=p^T(Ax-b)+\alpha\,p^TAp=-p^Tr+p^Tr=0$,
altså $p^Tr_{\mathrm{ny}}=0$. Denne ortogonaliteten følger av
linjesøket; den sier ikke at to vilkårlige nedstigningssteg er vinkelrette.
For bratteste nedstigning velger vi $p=r$, og får
$\alpha=(r^Tr)/(r^TAr)$. Hjelperen `descent_path` i eksperiment 4b
bruker denne formelen, beregner ny residual og gjentar.

**Steglengde og avstand er ikke det samme.** Bevegelsen fra gammelt til
nytt punkt er $x_{\mathrm{ny}}-x=\alpha p$. Derfor er avstanden vi flytter oss

$$\lVert x_{\mathrm{ny}}-x\rVert_2
=\lVert\alpha p\rVert_2=|\alpha|\lVert p\rVert_2.$$

$\alpha$ er altså en faktor vi ganger $p$ med. Bare når $p$ har
lengde $1$, er $|\alpha|$ også avstanden. For eksempel gir
$p=(5,5)^T$ og $\alpha=0.2$ bevegelsen $(1,1)^T$, med lengde
$\sqrt2$, ikke $0.2$.

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

:::

## 6.6 Konjugert gradient

::: {#uke6-cg}
:::

### Først: hva har ett linjesøk gitt oss?

Fra $x_0=(0,0)^T$ gikk vi langs $p_0=(5,5)^T$, altså linjen $u=v$, og
linjesøket ga $x_1=(10/7,10/7)^T$. Langs $u=v$ kommer vi ikke lenger, men
stjernen $(1,2)$ ligger lavere og utenfor linjen. Bratteste nedstigning
bruker den nye residualen som retning. CG velger den nye retningen slik at
vi slipper å gjøre om igjen minimeringen i den første. For å forstå hva
det betyr, ser vi på flere linjer som er parallelle med $u=v$.

### Én linje, ett minimum – flere linjer, flere minimumspunkter

**Hvor ligger minimumspunktene på linjene som er parallelle med $u=v$?**
På hver slik linje finnes ett punkt der $\phi$ er minst.
Cellen finner disse punktene med linjesøkformelen fra 6.5, med retning
$(1,1)^T$, og skriver også ut $4u+3v$ i hvert punkt. De oransje punktene i
figuren er slike **minimum på hver sin linje**. Målet er å se om punktene
har noe felles.

```{pyodide-python}
#| label: week6-parallel-minima
# Linjesøk langs retningen (1,1) fra et punkt på hver parallelle linje v = u + c.
A = np.array([[3.,1.], [1.,2.]])
b = np.array([5.,5.])
d = np.array([1., 1.])
for c in [-.4, 0., .5, 1.]:
    start = np.array([0., c])
    alpha = d @ (b - A @ start) / (d @ A @ d)
    punkt = start + alpha*d
    print(f'linjen v = u {c:+.1f}:  minimum i', np.round(punkt, 4),
          ' 4u+3v =', round(4*punkt[0] + 3*punkt[1], 10))
parallel_minima_plot(A, b, d, offsets=[-.4, 0., .5, 1.])
```

Fra et oransje punkt går funksjonsverdien opp i begge retninger langs den
blå linjen; letingen langs den linjen er ferdig. Linjen med $c=0$ er
$u=v$, med minimum $x_1\approx(1.4286,1.4286)$. Utskriften viser at alle
minimumspunktene ligger på den grønne linjen $4u+3v=10$ (utledet i
«Gå i dybden»). Den grønne linjen er **ikke en nivåkurve**: stjernen er
lavest av punktene på den.

Fra $x_1$ vil vi derfor gå **langs den grønne linjen**: da er hvert nytt
punkt fortsatt best på sin egen blå linje. Bratteste nedstigning havner
utenfor den grønne linjen og ødelegger minimeringen i den gamle retningen
(et fordypningsforsøk i «Gå i dybden» viser dette). Det er denne
egenskapen vi vil bygge inn: **Den nye retningen skal bevare minimeringen
i den gamle retningen.**

### Fra figuren til konjugerte retninger

Hvordan kan vi velge en slik retning uten å tegne alle linjene?
For en kvadratisk funksjon med SPD-matrise $A$ finnes et enkelt
regnekrav: to søkeretninger $p$ og $q$ skal oppfylle

$$\boxed{p^TAq=0.}$$

Da kalles de **A-konjugerte**. Betydningen er nettopp den vi så:
etter at vi har minimert langs $p$, kan vi gå langs $q$ uten at
det blir nødvendig å minimere i $p$-retningen på nytt. Hvorfor? Er $x$
allerede minimum langs $p$, er $p^T(Ax-b)=0$ (6.5). Etter et steg
$x_{\rm ny}=x+\alpha q$ er

$$p^T(Ax_{\rm ny}-b)=p^T(Ax-b)+\alpha\,p^TAq=\alpha\,p^TAq.$$

Den er null for alle $\alpha$ akkurat når $p^TAq=0$.

I figuren med de parallelle blå linjene er den første retningen
$p_0=(5,5)^T$. En retning langs
den grønne linjen er $q=(-3,4)^T$: endringene gir
$4\cdot(-3)+3\cdot4=0$, så vi holder oss på linjen $4u+3v=10$.
Vi kan også kontrollere $p_0^TAq=0$ med matrisen vår:
$Aq=(-5,5)^T$ og $p_0^TAq=-25+25=0$.

### Gram–Schmidt igjen – med et nytt indreprodukt

I uke 4.3 laget vi ortogonale retninger med **Gram–Schmidt**:
Fra en ny vektor trakk vi fra projeksjonene på de gamle retningene.
Vi kan bruke samme framgangsmåte her, men med et annet indreprodukt:

$$\langle p,q\rangle_A=p^TAq.$$

Dette er et indreprodukt fordi $A$ er SPD: rekkefølgen på vektorene
spiller ingen rolle, og $\langle p,p\rangle_A>0$ for $p\ne0$.
**A-konjugerte retninger er altså ortogonale med dette indreproduktet.**
De trenger ikke stå vinkelrett på arket. Når $A=I$, får vi vanlig
ortogonalitet tilbake.

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
A-indreproduktet**; nevneren er med fordi $p_0$ ikke er normalisert.

I eksemplet er $r_1=(-5/7,5/7)^T$ og $Ar_1=(-10/7,5/7)^T$, så
$p_0^TAr_1=5\cdot(-10/7+5/7)=-25/7$ og $c=(-25/7)/175=-1/49$. Da får vi
$p_1=r_1+(1/49)p_0=(-30/49,40/49)^T$. Denne vektoren er
$10/49$ ganger $(-3,4)^T$: **Gram–Schmidt gir nettopp retningen langs
den grønne linjen.** Nå har vi en regneoppskrift for retningen vi
fant geometrisk.

### Hva gjør CG i praksis?

Navnet **konjugert gradient (CG)** viser til begge ideene: residualen
er negativ gradient, og søkeretningene gjøres A-konjugerte. Den praktiske
oppskriften samler det vi har gjort, i én løkke:

```text
r = b − A x
Hvis residualen er liten nok: stopp.
p = r; rr = rᵀ r
Gjenta:
    Ap = A p
    alpha = rr / (pᵀ Ap)
    x = x + alpha p
    r = r − alpha Ap
    Kontroller residualen b − A x; stopp hvis liten nok.
    rr_ny = rᵀ r
    beta = rr_ny / rr
    p = r + beta p
    rr = rr_ny
```

Hver linje er noe vi allerede har gjort. `alpha` er linjesøket fra 6.5,
$\alpha=p^Tr/p^TAp$. I CG er $p^Tr=r^Tr$: $p$ er $r$ pluss et multiplum av
forrige retning, og linjesøket i 6.5 gjorde den nye residualen vinkelrett
på forrige retning. Den nye residualen får vi uten et ekstra produkt med
$A$, fordi $b-A(x+\alpha p)=r-\alpha Ap$. `beta` er Gram–Schmidt-koeffisienten
med motsatt fortegn, skrevet kortere.

**Regn det gjennom for eksemplet:** $r_0^Tr_0=50$ og $p_0^TAp_0=175$ gir
$\alpha_0=2/7$ og $x_1=(10/7,10/7)^T$. Da er
$r_1=(5,5)^T-\tfrac27(20,15)^T=(-5/7,5/7)^T$, $r_1^Tr_1=50/49$ og
$\beta_0=(50/49)/50=1/49$, samme tall som Gram–Schmidt ga, og
$p_1=(-30/49,40/49)^T$. Andre runde gir $Ap_1=(-50/49,50/49)^T$,
$p_1^TAp_1=500/343$, $\alpha_1=(50/49)/(500/343)=7/10$ og
$x_2=(1,2)^T$, der residualen er null. To ukjente, to steg.
Hvorfor de korte formene for `alpha` og `beta` stemmer, står i «Gå i dybden».

I vanlig Gram–Schmidt må vi trekke fra bidrag i **alle** tidligere
retninger. For CG med SPD-matrise og eksakte linjesøk holder det å
bruke **den siste**: den nye retningen blir også A-ortogonal til de
eldre retningene, i eksakt regning. Dette er en egen egenskap ved CG.

**Øv på dette:** [Neste CG-retning med Gram–Schmidt](#uke6-ov-cg) og
[to CG-steg med de korte formlene](#uke6-ov-cg-oppskrift).

Vi vender tilbake til de to skålene fra eksperiment 4b og legger CG-banen
oppå banen til bratteste nedstigning. Hjelperen `cg` er oppskriften over
skrevet i Python; den returnerer blant annet `path` (punktene) og
`residuals` (direkte beregnede residualnormer). Målet er å se om CG
unngår sikksakken på den smale skålen.
**Hva forventer dere at de to metodene gjør på den runde skålen?
Og hva tror dere endrer seg på den smale?**

### Eksperiment 5 – samme skåler, nye retninger

- Kjør cellen, og sammenlign antall steg i titlene.
- Bytt `.04` til `.2`. Endrer antall CG-steg seg? Hva med bratteste nedstigning?

```{pyodide-python}
#| label: week6-cg-experiment
# Samme to skåler som i eksperiment 4b; CG legges oppå bratteste nedstigning.
Q = np.array([[1.,-1.],[1.,1.]])/np.sqrt(2)
star = np.array([1.,-1.1])
cases = []
for small in [1., .04]:
    A = Q @ np.diag([1.,small]) @ Q.T
    b = A @ star
    sd = descent_path(A, b, [0.,0.], steps=16)
    result = cg(A, b, rtol=1e-10, max_steps=20)
    print(f'κ₂(A) = {1/small:g}: CG-residual = {result["residuals"][-1]:.2e}')
    cases.append((A, b, {'Bratteste nedstigning': sd, 'CG': result['path']},
                  f'κ₂(A) = {1/small:g}; CG: {len(result["path"])-1} steg'))
two_bowls(cases)
```

**Hva viser forsøket?** På den runde skålen ligger banene oppå hverandre,
og ett linjesøk er nok. På den smale er første steg felles; deretter
fortsetter bratteste nedstigning i sikksakk, mens CG korrigerer
residualretningen med den forrige søkeretningen og er framme etter to
steg. Det skyldes at forsøket har **to ukjente**, ikke kondisjonstallet.

### Hva kan vi forvente i større systemer?

For et SPD-system med $n$ ukjente når CG løsningen etter **høyst $n$
steg i eksakt regning**, ofte før: ikke-null, parvis A-konjugerte
retninger er lineært uavhengige, så $n$ av dem dekker hele rommet. I
store problemer håper vi å nå en liten nok residual lenge før dette.

Ett CG-steg koster ett matrise–vektor-produkt $Ap_k$ og noen få
indreprodukter. Hjelperen `cg` bruker ett produkt til i hvert steg for å
kontrollere $b-Ax$ direkte. Antall produkter med $A$ er derfor et godt mål
på arbeidet, og det er dette prosjektet teller.

På datamaskinen avrundes tallene. Retningene kan miste konjugerthet, og
flere steg enn $n$ kan trengs. Derfor bruker vi både en maksimalgrense og
en direkte kontroll av $b-Ax$ (6.3). Residualnormen trenger ikke avta i
hvert steg.

Kondisjonstallet har altså to roller. I 6.3 beskrev det følsomheten i
løsningen; her sier det noe om skålens form og inngår i grenser for hvor
fort CG konvergerer. Det bestemmer ikke alene antall steg; fordelingen av
egenverdiene og startfeilen betyr også noe. Det undersøker du i prosjektet.

::: {#uke6-svar}
:::

### Svar på ukens spørsmål

**Er de nye verdiene bedre?** Residualen $b-Ax_k$ kan vi alltid regne ut,
og med fast $A$ er den bakoverfeilen. Foroverfeilen kan vi bare anslå: den
relative feilen er høyst $\kappa_2(A)$ ganger den relative residualen (6.3).
Derfor stopper vi på residualen og setter en grense for antall steg.

**Hvordan beregner vi dem?** Tre oppskrifter med tre løfter:

| Metode | Hva den krever | Hva den lover |
|:--|:--|:--|
| Jacobi og Gauss–Seidel (6.1–6.2) | $a_{ii}\ne0$ | Konvergens fra enhver start akkurat når $\rho(T)<1$ |
| Bratteste nedstigning (6.5) | SPD | Lavere $\phi$ i hvert steg, men sikksakk i en smal skål |
| CG (6.6) | SPD | Høyst $n$ steg i eksakt regning; i praksis stopper vi på residualen |

Alle tre bruker bare produkter med $A$ og en startvektor, ingen
faktorisering. Derfor passer de for store, glisne systemer. Så kan vi
løse tusenvis av likninger ved å forbedre et grovt svar litt om gangen?
Ja, når metoden passer til matrisen ($\rho(T)<1$ for Jacobi og GS, SPD
for bratteste nedstigning og CG), hvert steg er billig og vi måler
framgangen med residualen.
I prosjektet spør vi om vi kan gjøre skålen rundere før CG starter.

::: {.reading-step title="Gå i dybden: hva taper bratteste nedstigning, og hvor kommer CG-formlene fra?"}

**Fordypningsforsøk: hva taper bratteste nedstigning?**

Vi tegner **begge metodene i samme koordinatplan**. Begge har kommet
til $x_1$ etter første linjesøk. Derfra tar de ulike andre steg:
bratteste nedstigning følger den nye residualen, mens CG følger den
grønne linjen gjennom minimumspunktene. Cellen regner ut punktet $S$ der
bratteste nedstigning havner, og et sammenligningspunkt $M$: minimum på
linjen gjennom $S$ i den gamle retningen $(1,1)^T$, funnet med
linjesøkformelen. Den skriver ut funksjonsverdiene, og en hjelper tegner
figuren.

- Kjør cellen, og sammenlign $\phi(S)$ med $\phi(M)$.
- Følg de to pilene fra den svarte prikken $x_1$.

```{pyodide-python}
#| label: week6-cg-preservation
# To steg med hver metode fra (0,0); M er et sammenligningspunkt, ikke et steg.
A = np.array([[3.,1.], [1.,2.]])
b = np.array([5.,5.])
sd_two = descent_path(A, b, [0.,0.], steps=2)
cg_two = cg(A, b, rtol=1e-12)['path']
first, S, solution = sd_two[1], sd_two[2], cg_two[2]
d = np.array([1., 1.])
M = S + d @ (b - A @ S) / (d @ A @ d) * d
phi_x = lambda x: .5*x @ A @ x - b @ x
print('phi(S) =', round(phi_x(S), 6), ' phi(M) =', round(phi_x(M), 6),
      ' phi(løsning) =', round(phi_x(solution), 6))
second_step_plot(A, b, first, S, M, solution)
```

Den **oransje pilen** ender i $S$, punktet bratteste nedstigning kommer
til. Den **grønne pilen** ender i stjernen, der CG kommer til løsningen.
Pilene viser bare andre steg; startpunktet $x_0=(0,0)^T$ ligger utenfor
utsnittet.

*1. Hva forteller den grønne, stiplede linjen?* Dette er samme linje
som i figuren med parallelle linjer. Hvert punkt på den er minimum langs en
linje parallell med den første søkeretningen $(1,1)^T$. Fra et slikt punkt
kan vi altså ikke senke $\phi$ ved å øke eller redusere begge
koordinatene like mye. Både $x_1$ og stjernen ligger på den grønne linjen.

*2. Følg den oransje pilen til $S$.* Bratteste nedstigning har funnet
minimum langs linjen fra $x_1$ i den nye residualens retning. Men $S$
ligger utenfor den grønne linjen. Den blå, prikkede linjen gjennom $S$
går i den **gamle** retningen: begge koordinatene endres like mye. Minimum
på denne blå linjen er den åpne sirkelen $M$, der den krysser den grønne
linjen. Utskriften viser $\phi(M)<\phi(S)$: fra $S$ kan vi senke
funksjonsverdien igjen ved å gå i en retning vi allerede har brukt.
$M$ er bare tegnet for å vise dette; det er ikke metodens neste steg
og heller ikke selve løsningen.

*3. Følg den grønne pilen fra $x_1$.* CG går langs den grønne linjen.
Hvert punkt underveis er derfor fortsatt minimum i den gamle retningen,
langs sin egen parallelle linje. Det nye linjesøket finner det laveste
punktet langs den grønne linjen: i dette todimensjonale eksemplet er
det stjernen $(1,2)^T$. Vi har nå minimert i begge søkeretningene,
uten at det andre steget har gjort ny leting i den første nødvendig.

**Prøv selv**

1. Vis at punktene som er optimale langs $p_0=(5,5)^T$ i eksemplet,
   oppfyller $4u+3v=10$.
2. Finn en ny retning av formen $p_1=r_1+\beta_0p_0$ som er
   A-konjugert med $p_0$, uten å se på hovedteksten.
3. Vis at $p_0^Tp_1\ne0$: retningene er ikke vanlig ortogonale.
4. Forklar hvorfor to konjugerte retninger ikke behøver å stå
   vinkelrett i figuren, og hvorfor to dimensjoner gir høyst to CG-steg
   i eksakt regning.

**Regnegangen**

Et punkt $x$ er minimum langs linjen $x+tp_0$ akkurat når den
deriverte i $t=0$ er null. Fra 6.5 er betingelsen
$p_0^T(Ax-b)=0$. Her blir den

$$5(3u+v-5)+5(u+2v-5)=0
\quad\Longleftrightarrow\quad 20u+15v=50
\quad\Longleftrightarrow\quad 4u+3v=10.$$

Kravet $p_0^TAp_1=0$ for $p_1=r_1+\beta_0p_0$ gir

$$\beta_0=-\frac{p_0^TAr_1}{p_0^TAp_0}
=-\frac{-25/7}{175}=\frac1{49}.$$

Dette er Gram–Schmidt med A-indreproduktet for den nye retningen, og
gir $p_1=(-30/49,40/49)^T$ og $Ap_1=(-50/49,50/49)^T$.
Vi kan kontrollere $p_0^TAp_1=5(-50/49+50/49)=0$ direkte. Men
$p_0^Tp_1=5(-30/49+40/49)=50/49\ne0$, så retningene er ikke vanlig ortogonale.

**Hva forklarer dette? – minimering som ikke forstyrres**

Hovedteksten viste at et steg langs $q$ bevarer minimeringen langs $p$
når $p^TAq=0$. Mer generelt vil kryssleddene forsvinne når vi skriver en
korreksjon som en kombinasjon av parvis konjugerte retninger. Minimering i
en ny retning endrer da ikke de optimale koeffisientene i tidligere
retninger. Dette er bakgrunnen for grensen på $n$ steg. I to dimensjoner
er to ikke-null konjugerte retninger lineært uavhengige og dekker hele
planet, så to steg er nok i eksakt regning.

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

:::



## 6.7 Prosjekt og egenarbeid

::: {#uke6-prosjekt}
:::

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
Hjelpesystemet i PCG er $Mz=r$ med $M=\operatorname{diag}(A)$, altså
$z_i=r_i/a_{ii}$: samme korreksjon som i Jacobi (6.1). Derfor kalles
metoden også Jacobi-prekondisjonering, selv om vi ikke kjører
Jacobi-iterasjoner. I prosjektet heter diagonalen $M$, fordi bokstaven $D$
der brukes om en skalering. Pseudokoden for PCG kan du legge ved siden av
CG-oppskriften i 6.6 og sammenligne linje for linje.
Ett problem får stor forbedring; et annet viser en begrensning.
**Er færre steg tilstrekkelig, eller må vi også se på ekstra arbeid per steg
og hvilken residual som brukes til å stoppe?**

### Oppgaver til ukens pensum

Regn på papir, og bruk svarfeltene til å kontrollere regningen.
Alle svar skal være eksakte; ikke avrund til desimaltall. Du kan skrive
brøker og kvadratrøtter, for eksempel `5/7` og `sqrt(3)`. I uttrykk bruker
du `*` for multiplikasjon og `^` for potens. Skriv bare uttrykket i
feltet, uten likhetstegn. Korte begrunnelser fører du i egne notater.

I alle oppgavene unntatt «Liten residual, godt svar?» og «To CG-steg med
de korte formlene» bruker vi det samme systemet:

$$A=\begin{bmatrix}2&1\\1&2\end{bmatrix},\qquad
b=\begin{bmatrix}3\\0\end{bmatrix},\qquad
x=\begin{bmatrix}u\\v\end{bmatrix}.$$

Det vil si $2u+v=3$ og $u+2v=0$. Oppgavene krever ingen programmering.

### Iterasjon og feil

::: {#uke6-ov-sveip}
:::

#### Jacobi eller Gauss–Seidel?

Start i $x_0=(0,0)^T$. Isoler $u$ i første likning og $v$ i andre.
Beregn **ett helt sveip** med Jacobi og ett med Gauss–Seidel.
I begge tilfeller oppdaterer du $u$ først og deretter $v$.

```{math-exercise}
#| label: week6-task-sweeps
#| caption: Punktet etter ett sveip
#| mode: equivalent
#| partial-credit: true
#| field-labels: u etter Jacobi, v etter Jacobi, u etter Gauss–Seidel, v etter Gauss–Seidel

Jacobi: $x_1=$ vec[3/2,0]

Gauss–Seidel: $x_1=$ vec[3/2,-3/4]
```

**Forklar i egne notater:** Hvorfor får metodene ulik andre koordinat?
Pek på hvilken verdi av $u$ hver metode bruker.

::: {#uke6-ov-feilfaktor}
:::

#### Blir feilen mindre?

Fortsett med Gauss–Seidel. Sett uttrykket for $u_{k+1}$ inn i
oppdateringen for $v_{k+1}$. Da får du en regel som bare bruker $v_k$.
I det første svarfeltet skriver du **v** for den gamle verdien $v_k$.

La $v_*$ være andre koordinat i den eksakte løsningen, og sett
$e_k=v_k-v_*$. Dette er feilen i andre koordinat etter $k$ sveip.
Finn tallet $q$ slik at $e_{k+1}=q e_k$.

```{math-exercise}
#| label: week6-task-error-factor
#| caption: Fra oppdateringsregel til feil etter flere sveip
#| vars: v
#| mode: equivalent
#| partial-credit: true
#| field-labels: ny v som uttrykk i gammel v, feilfaktoren q, feilfaktoren etter tre sveip

Ny verdi av andre koordinat: __[-3/4+v/4]

$q=$ __[1/4]

Etter tre sveip er $e_{k+3}=c e_k$, der $c=$ __[1/64]
```

**Forklar i egne notater:** Hvorfor går feilen mot null fra enhver
startverdi? Hvorfor går da også første koordinat mot riktig verdi?

### Residual og kondisjon

::: {#uke6-ov-residual}
:::

#### Liten residual, godt svar?

**Bare i denne oppgaven** bruker vi

$$A=\begin{bmatrix}1&0\\0&0.01\end{bmatrix},\qquad
b=\begin{bmatrix}1\\0.01\end{bmatrix},\qquad
\hat x=\begin{bmatrix}1\\0.5\end{bmatrix}.$$

**a.** Finn den eksakte løsningen $x_*$ og residualen $r=b-A\hat x$.

```{math-exercise}
#| label: week6-task-residual
#| caption: Eksakt løsning og residual
#| mode: equivalent
#| partial-credit: true
#| field-labels: første koordinat i løsningen, andre koordinat i løsningen, første residualkomponent, andre residualkomponent

$x_*=$ vec[1,1]

$r=$ vec[0,1/200]
```

**b.** Beregn de to relative feilene og kondisjonstallet.
Bruk 2-normen. For bakoverfeilen holder vi $A$ fast og tillater
bare endringer i $b$. Skriv feilene som eksakte uttrykk med
kvadratrøtter, ikke avrundede desimaltall.

```{math-exercise}
#| label: week6-task-forward-backward
#| caption: Hvor stor er feilen i svar og data?
#| mode: equivalent
#| partial-credit: true
#| field-labels: relativ foroverfeil, relativ bakoverfeil med fast A, kondisjonstall

Relativ foroverfeil, $\lVert\hat x-x_*\rVert_2/\lVert x_*\rVert_2=$ __[sqrt(2)/4]

Relativ bakoverfeil, $\lVert r\rVert_2/\lVert b\rVert_2=$ __[1/(2*sqrt(10001))]

$\kappa_2(A)=$ __[100]
```

**Forklar i egne notater:** Hva sier tallene om nøyaktigheten i
$\hat x$? Kontroller feilgrensen fra 6.3, og forklar hvorfor liten
bakoverfeil ikke nødvendigvis gir liten foroverfeil. Er grensen nesten
nådd her, slik den var i eksemplet i 6.3?

::: {#uke6-ov-kondisjon}
:::

#### Kondisjonstall fra egenverdiene

Vi går tilbake til det felles systemet med
$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$. Matrisen er symmetrisk.
Finn egenverdiene, og bruk dem til å finne kondisjonstallet $\kappa_2(A)$.

```{math-exercise}
#| label: week6-task-condition-eigenvalues
#| caption: Egenverdier og kondisjonstall for en SPD-matrise
#| mode: equivalent
#| partial-credit: true
#| field-labels: minste egenverdi, største egenverdi, kondisjonstall

$\lambda_{\min}=$ __[1]

$\lambda_{\max}=$ __[3]

$\kappa_2(A)=$ __[3]
```

**Forklar i egne notater:** Hvorfor viser egenverdiene at $A$ er SPD, og
hvorfor kan vi her bruke $\lambda_{\max}/\lambda_{\min}$? Matrisen
$\begin{bmatrix}1&10\\0&1\end{bmatrix}$ fra «Gå i dybden» i 6.3 har begge
egenverdier lik $1$. Hvorfor gir kvotienten ikke kondisjonstallet for den?

### Skål, linjesøk og CG

::: {#uke6-ov-skal}
:::

#### Fra likningssystem til minimum

Vi bruker det felles systemet med $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$,
$b=(3,0)^T$ og $x=(u,v)^T$.

**a. Skriv funksjonen selv.** Multipliser ut
$\phi(x)=\tfrac12x^TAx-b^Tx$, og skriv resultatet som et uttrykk i
$u$ og $v$. Finn deretter begge de partiellderiverte.
Funksjonsfeltet skal inneholde hele uttrykket for $\phi(u,v)$.

```{math-exercise}
#| label: week6-task-quadratic-function
#| caption: Funksjonen og gradienten
#| vars: u, v
#| mode: equivalent
#| partial-credit: true
#| field-labels: funksjonsuttrykket phi, den deriverte med hensyn på u, den deriverte med hensyn på v

$\phi(u,v)=$ ___[u^2+u*v+v^2-3*u]

$\nabla\phi(u,v)=$ vec[2*u+v-3,u+2*v]
```

**b.** Finn punktet der begge de partiellderiverte er null.

```{math-exercise}
#| label: week6-task-minimum
#| caption: Punktet der gradienten er null
#| mode: equivalent
#| partial-credit: true
#| field-labels: u i minimumspunktet, v i minimumspunktet

$x_*=$ vec[2,-1]
```

**Forklar i egne notater:** Hvorfor er dette punktet minimum for
$\phi$? Begrunn at $A$ er positivt definitt, for eksempel med egenverdiene.
At gradienten er null, er ikke alene nok til å avgjøre dette.

::: {#uke6-ov-linjesok}
:::

#### Ett steg med bratteste nedstigning

Bruk samme $A$ og $b$ som i «Fra likningssystem til minimum», men start i
$x_0=(0,0)^T$. Vi skal gå i residualens retning $p_0=r_0=b-Ax_0$.

**a.** Finn $r_0$ og tallet $\alpha_0$ som gjør
$\phi(x_0+\alpha_0p_0)$ minst mulig. Bruk $p_0=r_0$ uten å normalisere.

```{math-exercise}
#| label: week6-task-first-line-search
#| caption: Retningen og faktoren i første steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: første residualkomponent, andre residualkomponent, alpha i første linjesøk

$r_0=$ vec[3,0]

$\alpha_0=$ __[1/2]
```

**b.** Beregn $x_1=x_0+\alpha_0p_0$ og den nye residualen $r_1=b-Ax_1$.

```{math-exercise}
#| label: week6-task-first-step
#| caption: Det nye punktet og residualen der
#| mode: equivalent
#| partial-credit: true
#| field-labels: første koordinat etter steget, andre koordinat etter steget, første nye residualkomponent, andre nye residualkomponent

$x_1=$ vec[3/2,0]

$r_1=$ vec[0,-3/2]
```

**Forklar i egne notater:** Hvorfor har vi funnet minimum langs
søkelinjen uten å ha løst hele likningssystemet? Bruk residualen i svaret.

::: {#uke6-ov-cg}
:::

#### Neste CG-retning med Gram–Schmidt

Fortsett fra forrige oppgave. Vi har $p_0=(3,0)^T$, $x_1=(3/2,0)^T$ og
$r_1=(0,-3/2)^T$. I stedet for å bruke $r_1$ alene vil vi lage en ny
retning som er A-konjugert med $p_0$.

**a.** Bruk Gram–Schmidt med $\langle p,q\rangle_A=p^TAq$.
Finn tallet $c$ slik at $p_1=r_1-cp_0$ oppfyller $p_0^TAp_1=0$.
Behold akkurat denne skaleringen av $p_1$; ikke normaliser den.

```{math-exercise}
#| label: week6-task-conjugate-direction
#| caption: Trekk fra projeksjonen med A-indreproduktet
#| mode: equivalent
#| partial-credit: true
#| field-labels: projeksjonskoeffisienten c, første koordinat i p₁, andre koordinat i p₁, A-indreproduktet, vanlig indreprodukt

$c=$ __[-1/4]

$p_1=$ vec[3/4,-3/2]

Kontroller: $p_0^TAp_1=$ __[0]

Sammenlign med vanlig indreprodukt: $p_0^Tp_1=$ __[9/4]
```

**b.** Gjør linjesøket fra $x_1$ langs $p_1$.
Finn $\alpha_1$, beregn $x_2=x_1+\alpha_1p_1$, og kontroller residualen.

```{math-exercise}
#| label: week6-task-second-cg-step
#| caption: Andre CG-steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: alpha i andre linjesøk, første koordinat i x₂, andre koordinat i x₂, residualnormen etter andre steg

$\alpha_1=$ __[2/3]

$x_2=$ vec[2,-1]

$\lVert b-Ax_2\rVert_2=$ __[0]
```

**Forklar i egne notater:** Hvorfor trenger ikke de to søkeretningene
stå vinkelrett i det vanlige koordinatplanet? Hva sikrer
A-konjugertheten når vi gjør det andre linjesøket?

::: {#uke6-ov-cg-oppskrift}
:::

#### To CG-steg med de korte formlene

**Bare i denne oppgaven** bruker vi

$$A=\begin{bmatrix}4&1\\1&3\end{bmatrix},\qquad
b=\begin{bmatrix}1\\2\end{bmatrix},\qquad x_0=\begin{bmatrix}0\\0\end{bmatrix}.$$

Følg CG-oppskriften i 6.6 linje for linje, med $p_0=r_0$ og de korte
formlene `alpha = rr / (pᵀ Ap)` og `beta = rr_ny / rr`.

**a.** Gjør første runde: finn $\alpha_0$, $x_1$ og den oppdaterte
residualen $r_1=r_0-\alpha_0Ap_0$.

```{math-exercise}
#| label: week6-task-cg-recipe-first
#| caption: Første runde i CG-løkken
#| mode: equivalent
#| partial-credit: true
#| field-labels: alpha0, første koordinat i x₁, andre koordinat i x₁, første komponent i r₁, andre komponent i r₁

$\alpha_0=$ __[1/4]

$x_1=$ vec[1/4,1/2]

$r_1=$ vec[-1/2,1/4]
```

**b.** Finn $\beta_0$ og den nye retningen $p_1$. Gjør så andre runde, og
finn $\alpha_1$ og $x_2$.

```{math-exercise}
#| label: week6-task-cg-recipe-second
#| caption: Ny retning og andre runde
#| mode: equivalent
#| partial-credit: true
#| field-labels: beta0, første koordinat i p₁, andre koordinat i p₁, alpha1, første koordinat i x₂, andre koordinat i x₂

$\beta_0=$ __[1/16]

$p_1=$ vec[-7/16,3/8]

$\alpha_1=$ __[4/11]

$x_2=$ vec[1/11,7/11]
```

**Forklar i egne notater:** Kontroller at $x_2$ løser $Ax=b$. Kontroller
også at $p_0^TAp_1=0$, selv om du aldri brukte Gram–Schmidt direkte.

:::
