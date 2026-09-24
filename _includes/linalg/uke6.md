<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 6.0 Oversikt

<div id="uke6-start"></div>

### Fra gjentatte korreksjoner til CG

I uke 5 brukte vi gjentatte matriseprodukter til å finne en retning som
stabiliserte seg. Nå skal gjentakelse hjelpe oss med et annet mål: å løse
$Ax=b$. Vi starter med et forslag og korrigerer det, i stedet for å finne
hele løsningen i én direkte beregning. Det er særlig interessant for store
systemer der matrise–vektor-produkter er billige, men faktorisering krever mye arbeid eller lagring.

**Hvordan vet vi om korreksjonene bringer oss nærmere løsningen – og kan vi
velge dem smartere?**
Vi henter kort fram Jacobi og Gauss–Seidel, undersøker hva som styrer
konvergensen, og prøver **konjugert gradient (CG)**: en metode som bygger
nye søkeretninger ut fra informasjonen i tidligere steg.

I **Forelesning** undersøker vi korte eksperimenter og diskuterer det vi ser.
**Gå i dybden** åpner oppgaver, mellomregninger og forklaringer til hvert
forsøk i ett samlet felt. Der følger **Prøv selv**, **Regnegangen** og
**Hva forklarer dette?** etter hverandre, uten flere felt å åpne.

- [Bygg opp GS-oppdateringen](#uke6-gs) og [følg feilen](#uke6-fikspunkt).
- [Skill residual fra feil](#uke6-residual).
- [Se løsningen som et minimum](#uke6-energi) og [prøv CG](#uke6-retning).
- [Undersøk prekondisjonering i prosjektet](#uke6-prosjekt).

Etter uken skal du kunne knytte fikspunktiterasjon til egenverdier,
forklare hva CG bruker konjugerte retninger til, og kontrollere en numerisk
løsning med residualen. I prosjektet undersøker du hvordan skalering kan
endre arbeidsmengden for CG.

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
\textcolor{#1565C0}{L}&=\textcolor{#1565C0}{\begin{bmatrix}0&0&0&0\\-1&0&0&0\\0&-1&0&0\\0&0&-1&0\end{bmatrix}},\\[4pt]
\textcolor{#B45309}{D}&=\textcolor{#B45309}{\begin{bmatrix}4&0&0&0\\0&4&0&0\\0&0&4&0\\0&0&0&4\end{bmatrix}},\\[4pt]
\textcolor{#7E22CE}{U}&=\textcolor{#7E22CE}{\begin{bmatrix}0&-1&0&0\\0&0&-1&0\\0&0&0&-1\\0&0&0&0\end{bmatrix}}.
\end{aligned}
$$

Vi kan skrive $L+D+U$ eller $D+L+U$; summen er den samme.
**Kontroller én rad ved å legge sammen de tre delmatrisene.**

Ta $b=(3,2,2,3)^T$ og oppdater i rekkefølgen $x_1,x_2,x_3,x_4$.
GS gir

$$
\begin{aligned}
x_1^{(k+1)}&=(3+x_2^{(k)})/4,\\
x_2^{(k+1)}&=(2+\textcolor{#1565C0}{x_1^{(k+1)}}+\textcolor{#7E22CE}{x_3^{(k)}})/4,\\
x_3^{(k+1)}&=(2+\textcolor{#1565C0}{x_2^{(k+1)}}+\textcolor{#7E22CE}{x_4^{(k)}})/4,\\
x_4^{(k+1)}&=(3+\textcolor{#1565C0}{x_3^{(k+1)}})/4.
\end{aligned}
$$

Når vi arbeider med rad $i$, er koordinatene med indeks $j<i$ allerede
oppdatert. De hører til $L$ og bruker **nye verdier**. Koordinatene med
$j>i$ venter på tur. De hører til $U$ og bruker **gamle verdier**.
Diagonalelementet brukes til å isolere koordinaten vi beregner nå.
Fra nullstart blir første sveip

$$x^{(1)}=\begin{bmatrix}3/4\\11/16\\43/64\\235/256\end{bmatrix}.$$

Samler vi alle radene, får vi den samme oppskriften i matriseform:

$$(D+L)x^{(k+1)}=b-Ux^{(k)}.$$

Venstresiden er et nedre trekantsystem. Vi løser det ovenfra og ned,
nettopp slik vi gjorde i de fire oppdateringene. Jacobi bruker derimot
bare gamle verdier på høyresiden:

$$Dx^{(k+1)}=b-(L+U)x^{(k)}.$$

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
<summary>Gå i dybden: fra radoppdatering til matriseform</summary>

**Prøv selv**

1. Gjør to GS-sveip for $2\times2$-systemet. Ta med mellompunktet i hvert sveip.
2. Gjør første Jacobi-sveip for $4\times4$-systemet fra nullstart, og
   sammenlign med GS. Kontroller at $(1,1,1,1)^T$ løser systemet.
3. Skriv rad $i$ i $(D+L)x^{(k+1)}=b-Ux^{(k)}$ og isoler $x_i^{(k+1)}$.

**Regnegangen**

I to dimensjoner er de første koordinatstegene

$$(0,0)\longmapsto(5/3,0)\longmapsto(5/3,5/3)
\longmapsto(10/9,5/3)\longmapsto(10/9,35/18).$$

I fire dimensjoner gir Jacobi $x^{(1)}=(3/4,1/2,1/2,3/4)^T$.
GS bruker derimot $3/4$ i andre rad, deretter $11/16$ i tredje rad
og til slutt $43/64$ i fjerde rad. Produktet $A(1,1,1,1)^T$ er
$(3,2,2,3)^T=b$.

**Hva forklarer dette?**

Rad $i$ i matriseformen er

$$\sum_{j<i}a_{ij}x_j^{(k+1)}+a_{ii}x_i^{(k+1)}
=b_i-\sum_{j>i}a_{ij}x_j^{(k)}.$$

Dermed får vi den generelle GS-oppdateringen

$$x_i^{(k+1)}=\frac{b_i-\sum_{j<i}a_{ij}x_j^{(k+1)}
-\sum_{j>i}a_{ij}x_j^{(k)}}{a_{ii}}.$$

Koden bruker den likeverdige korreksjonen
$x_i\leftarrow x_i+(b_i-(Ax)_i)/a_{ii}$, der $x$ inneholder de nyeste
verdiene som er tilgjengelige. Bidraget $a_{ii}x_i$ i $(Ax)_i$
kansellerer den gamle $x_i$ når uttrykket utvides.

</details>

## 6.2 Følg feilen

<div id="uke6-fikspunkt"></div>

### Eksperiment 2 – er flere sveip alltid bedre?

I første forsøk hjalp det å gjenta sveipene. Nå beholder vi samme
oppdateringsregel, men endrer koblingen mellom de ukjente. Kan en
korreksjon forstyrre den andre likningen så mye at neste korreksjon blir enda større?

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

Kurvene viser at feilen kan avta eller vokse. Vi skriver nå oppdateringen
som algebra for å forklare forskjellen; matriserepresentasjonen av feiloppdateringen kan
deretter finnes ved regning.

Et GS-sveip kan skrives $x_{k+1}=Tx_k+c$. Løsningen er et **fikspunkt**:
den endres ikke av oppdateringen, altså $x_*=Tx_*+c$.
**Feilen** $e_k=x_k-x_*$ følger derfor

$$e_{k+1}=(Tx_k+c)-(Tx_*+c)=T(x_k-x_*)=Te_k.$$

Dermed er $e_k=T^ke_0$. Dette er forbindelsen til uke 5: der fulgte vi
hvilket vektorbidrag som tok over; nå ønsker vi at **alle feilbidrag skal
forsvinne**. $T$ beskriver ett helt sveip, mens $A$ beskriver det opprinnelige
likningssystemet. De to matrisene har forskjellige roller.

Her kommer egenverdiene tilbake. For første matrise har
**iterasjonsmatrisen $T$** egenverdier $0$ og $1/6$; for den andre $0$ og $4$.
Feil langs en egenvektor blir ganget med den tilhørende egenverdien per sveip.

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

## 6.3 Kontroller svaret

<div id="uke6-residual"></div>

### Eksperiment 3 – liten rest, stor feil?

Hittil har vi målt avstanden til en løsning vi selv la inn. I et virkelig
problem er løsningen ukjent – ellers hadde vi ikke trengt iterasjonen.
Vi trenger derfor en kontroll som bare bruker $A$, $b$ og forslaget $x$.

**Residualen** $r=b-Ax$ er det som mangler for at forslaget $x$ skal oppfylle
likningene. Feilen $e=x-x_*$ er forskjellen mellom forslaget og den ukjente løsningen.
Vi kjenner $x_*$ i dette forsøket og kan sammenligne begge.
**Tror dere forslaget med minst residual også ligger nærmest løsningen?**

```{pyodide-python}
#| label: week6-residual-experiment
# De to forslagene har feil i hver sin koordinat.
# Residualen måles ETTER at A har virket på feilen; andre koordinat dempes kraftig.
# Sammenlign begge kolonnene før du velger hvilket forslag som er best.

A = np.diag([1., 1e-4])
star = np.ones(2); b = A @ star
print('Forslag       residualnorm       feilnorm')
for x in [np.array([1.,0.]), np.array([.99,1.])]:
    print(x, f'{np.linalg.norm(b-A@x):16.4g}',
          f'{np.linalg.norm(x-star):14.4g}')
```

Transformasjonen $x\mapsto Ax$ demper feil i andre koordinat kraftig. En stor feil kan dermed gi
liten residual: $r=-Ae$. Residualen kan vi beregne i praksis; faktisk feil
krever at løsningen er kjent.

Et mulig stoppkrav er

$$\lVert b-Ax_k\rVert_2\le\text{atol}+\text{rtol}\lVert b\rVert_2,$$

Her er `atol` en absolutt feilmargin for residualen, mens `rtol` setter
marginen i forhold til størrelsen på høyresiden. Dette er et krav til hvor
godt likningene er oppfylt, ikke en garanti for like mange riktige sifre i $x$.
Vi bruker også en øvre grense
for antall steg. **Hva ville dere rapportert hvis maksimalgrensen nås før
residualkravet er oppfylt?**

<details class="reading-step">
<summary>Gå i dybden: residual, feil og følsomhet</summary>

**Prøv selv**

1. Regn residual og feil for begge forslagene i forsøket.
2. Forklar hvorfor null residual gir riktig løsning når $A$ er invertibel.
3. Bruk $e=-A^{-1}r$ til å begrunne hvorfor liten residual ikke alene er nok.

**Regnegangen**

Her er $b=(1,10^{-4})^T$. Første forslag har $r=(0,10^{-4})^T$,
$e=(0,-1)^T$. Andre har $r=(0.01,0)^T$, $e=(-0.01,0)^T$.
Derfor har det første minst residual og størst feil.

**Hva forklarer dette?**

For invertibel $A$ gir $e=-A^{-1}r$ at
$\lVert e\rVert_2\le\lVert A^{-1}\rVert_2\lVert r\rVert_2$.
Når $b\ne0$, får vi

$$\frac{\lVert e\rVert_2}{\lVert x_*\rVert_2}
\le\kappa_2(A)\frac{\lVert r\rVert_2}{\lVert b\rVert_2},\qquad
\kappa_2(A)=\lVert A\rVert_2\lVert A^{-1}\rVert_2.$$

Her er matrisenormen $\lVert A\rVert_2$ den største faktoren som
transformasjonen kan forstørre en vektorlengde med:
$\lVert A\rVert_2=\max_{z\ne0}\lVert Az\rVert_2/\lVert z\rVert_2$.

**Kondisjonstallet** $\kappa_2(A)$ beskriver mulig forsterkning av relative
avvik. Her er det $10^4$. Uke 7 forklarer dette med SVD for generelle matriser.
Hvis maksimalgrensen nås, rapporterer vi manglende konvergens og oppnådd
residual. En liten endring i $x$ mellom to steg er heller ikke et sikkert stopptegn.

</details>

## 6.4 Løsningen som minimum

<div id="uke6-energi"></div>

### Fra to likninger til én funksjon

I 6.1 korrigerte vi én ukjent om gangen. I 6.3 brukte vi residualen til
å kontrollere hvor godt likningene var oppfylt. Nå spør vi:
**Kan vi knytte en funksjonsverdi til hvert forslag, slik at løsningen
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

Først finner vi løsningen av systemet for hånd. Fra andre likning får
vi $u=5-2v$. Innsetting i første gir $15-5v=5$, altså $v=2$ og $u=1$.
Dermed er

$$x_*=(1,2)^T,\qquad \phi(1,2)=-\tfrac{15}{2}=-7.5.$$

At dette punktet løser likningene, er ikke i seg selv et bevis på at
funksjonen er minst der. Vi sammenligner derfor med et vilkårlig punkt.
Skriv $p=u-1$ og $q=v-2$. Innsetting og samling av ledd gir

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
fig = plt.figure(figsize=(11, 4.5))
surface = fig.add_subplot(1, 2, 1, projection='3d')
surface.plot_surface(u, v, Z, cmap='viridis', alpha=.8)
surface.scatter([1], [2], [-7.5], color='red', s=50)
surface.set(xlabel='u', ylabel='v', zlabel='φ(u,v)', title='Funksjonsverdien som høyde')

ax = fig.add_subplot(1, 2, 2)
curves = ax.contour(u, v, Z, levels=[-7, -6, -4, 0, 5, 10], cmap='viridis')
ax.clabel(curves, inline=True, fontsize=9)
ax.plot(1, 2, 'r*', markersize=12, label='Minimum (1, 2)')
ax.plot([0, 2], [2, 2], 'ko', label='φ = −6')
ax.set(xlabel='u', ylabel='v', title='Nivåkurver sett ovenfra')
ax.set_aspect('equal'); ax.legend()
fig.tight_layout(); plt.show()
```

**Finn nivåkurven med verdi $-6$. Hvorfor er det ingen ellipse merket
$-8$? Hvor i figuren må en metode ende hvis den skal minimere $\phi$?**

### Hvilke matriser gir en skål med én bunn?

Vi bruker her **symmetrisk positivt definitte (SPD)** matriser:

$$A^T=A,\qquad z^TAz>0\quad\text{for alle }z\ne0.$$

Symmetrien gjør at kryssleddene fra hver side av diagonalen passer
sammen. Positiv definitet betyr at det kvadratiske bidraget er
positivt i enhver ikke-null retning. For vår matrise er

$$z^TAz=3p^2+2pq+2q^2
=3(p+q/3)^2+\tfrac53q^2>0\quad\text{når }(p,q)\ne(0,0).$$

For en reell symmetrisk matrise er positiv definitet likeverdig med
at alle egenverdiene er positive. Det knytter skålformen til uke 5.
En SPD-matrise er invertibel, så $Ax=b$ har én løsning $x_*$.
For $e=x-x_*$ gjelder

$$\boxed{\phi(x)-\phi(x_*)=\tfrac12e^TAe.}$$

Høyresiden er positiv hvis $x\ne x_*$. Dette er den generelle versjonen
av kvadratfullføringen over: løsningen er det **entydige globale
minimumet**, altså det laveste punktet blant alle $x\in\mathbb R^n$.
En full utledning og et eksempel med tre ukjente ligger i «Gå i dybden».

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

`bowl_plot` er en **hjelpefunksjon definert i sidens Python-oppsett**;
det er ikke en innebygd NumPy-funksjon eller en ny numerisk metode.
Navnet viser til skålformen. Kallet
`bowl_plot(ax, A, b, paths)` gjør følgende:

- beregner $\tfrac12x^TAx-b^Tx$ på et rutenett og tegner nivåkurvene
  i tegnefeltet `ax`, slik `contour` gjorde over;
- tegner de ferdig beregnede banene i `paths`, med navn som forklaring;
- markerer løsningen med en stjerne. Den bruker `np.linalg.solve`
  bare for dette referansepunktet; GS-banen beregnes av `gs_path`.

Hjelperen brukes her for symmetriske $2\times2$-matriser.
`{'GS': path}` betyr «tegn punktene i `path` og kall banen GS».
Nå beholder vi hvert koordinatsteg, slik at de horisontale og vertikale
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

For å knytte dette til neste fane samler vi de partiellderiverte i
**gradienten**:

$$\nabla\phi(u,v)=\begin{bmatrix}3u+v-5\\u+2v-5\end{bmatrix}
=Ax-b=-r.$$

Ved minimum er begge komponentene null samtidig, altså $Ax=b$.
GS setter én komponent lik null om gangen ved å minimere langs en
koordinatretning. **Kan vi velge andre retninger som tar oss raskere
mot minimumet, og som bevarer det vi allerede har oppnådd?** Dette
leder til bratteste nedstigning og konjugert gradient i 6.5.

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

</details>

## 6.5 Konjugert gradient

<div id="uke6-retning"></div>
<div id="uke6-cg"></div>

### Eksperiment 5 – hvilke retninger unngår sikksakk?

I en lang, smal skål kan lokale forbedringer gi en omvei: vi krysser
dalen flere ganger mens vi langsomt beveger oss mot bunnen. Nå spør vi
om en metode kan ta vare på det den allerede har oppnådd i tidligere retninger.

Vi sammenligner to metoder på samme SPD-system. **Bratteste nedstigning**
velger residualen som retning og finner beste punkt langs den linjen.
**Konjugert gradient (CG)** bruker også forrige retning når den velger den neste.
**Hvilken bane tror dere slipper unna sikksakk på den smale skålen?**

Venstre bilde har to like egenverdier; høyre har én liten egenverdi og
derfor en retning der skålen stiger mye langsommere. Begge metodene starter
i origo og søker samme minimum. Følg både banene og antall CG-steg.

```{pyodide-python}
#| label: week6-cg-experiment
# Vi beholder egenvektorene i Q og endrer skålens form via egenverdiene.
# Begge metodene får samme system og nullstart i hvert bilde.
# Tell CG-steg, men husk at dette bare er et todimensjonalt problem.

Q = np.array([[1.,-1.],[1.,1.]])/np.sqrt(2)
star = np.array([1.,-1.1])
fig, axes = plt.subplots(1, 2, figsize=(10,4))
for ax, small in zip(axes, [1., .04]):
    A = Q @ np.diag([1.,small]) @ Q.T
    b = A @ star
    sd = descent_path(A, b, [0.,0.], steps=16)
    result = cg(A, b, rtol=1e-10, max_steps=20)
    bowl_plot(ax, A, b, {'Bratteste nedstigning':sd, 'CG':result['path']},
              bounds=(-.5,1.5,-1.5,.5))
    ax.set_title(f'Egenverdier 1 og {small}')
    print(f'Egenverdier 1 og {small}: CG-steg = {len(result["path"])-1}, '
          f'residual = {result["residuals"][-1]:.2e}')
fig.tight_layout(); plt.show()
```

### Hva tar CG vare på?

Bratteste nedstigning følger residualen fordi $-r=Ax-b$ er
**gradienten** til $\phi$: vektoren av de partiellderiverte, som peker i
retningen for raskest lokal økning. $r$ peker dermed mot raskest lokal
nedgang. Men den retningen trenger ikke peke rett mot bunnen.

En **søkeretning** $p_k$ angir linjen vi beveger oss langs:
$x_{k+1}=x_k+\alpha_kp_k$, der $\alpha_k$ er **steglengden**.
CG starter med $p_0=r_0$ og kombinerer senere en ny residual med forrige retning.

For SPD kan vi måle ortogonalitet med indreproduktet
$\langle p,q\rangle_A=p^TAq$. Retninger som oppfyller

$$p_i^TAp_j=0\qquad(i\ne j)$$

kalles **A-konjugerte**. De trenger ikke stå vinkelrett i det vanlige plottet.
CG velger slike retninger i eksakt regning. Når metoden finner minimum
langs en ny retning, bevarer den minimumsegenskapen langs de tidligere
retningene. Det er dette «hukommelsen» brukes til. Vanlig ortogonalitet fra uke 4
måler vinkler med $p^Tq$; her tilpasses indreproduktet til skålen gjennom
$A$. CG trenger derfor ikke gjøre om en tidligere minimering når den
arbeider videre i en ny konjugert retning.

I **eksakt regning**, uten avrunding, når CG løsningen av et SPD-system med
$n$ ukjente etter høyst $n$ steg, og noen ganger langt tidligere.
I **flyttallsregning**, der tall avrundes, kan retningene miste konjugerthet
og flere steg bli nødvendige. Derfor kontrollerer koden $b-Ax$ direkte.
Residualnormen trenger ikke bli mindre i hvert steg.

Egenverdienes fordeling påvirker hvor raskt CG arbeider. For SPD er
$\kappa_2(A)=\lambda_{\max}/\lambda_{\min}$ et mål på hvor ulikt transformasjonen $x\mapsto Ax$
skalerer forskjellige retninger; dette kalles **kondisjonstallet**.
Det alene bestemmer ikke antall steg. **Hva viser todimensjonsforsøket om
forskjellen mellom en smal skål og mange CG-steg?**

<details class="reading-step">
<summary>Gå i dybden: følg CG og forklar retningene</summary>

**Prøv selv**

Når residualen ikke er null, bruker CG

$$\alpha_k=\frac{r_k^Tr_k}{p_k^TAp_k},\qquad
x_{k+1}=x_k+\alpha_kp_k,\qquad r_{k+1}=r_k-\alpha_kAp_k,$$

$$\beta_k=\frac{r_{k+1}^Tr_{k+1}}{r_k^Tr_k},\qquad
p_{k+1}=r_{k+1}+\beta_kp_k.$$

1. For $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$, $b=(5,5)^T$ og $x_0=0$:
   finn $\alpha_0$, $x_1$, $r_1$ og $p_1$. Kontroller $p_0^TAp_1=0$.
2. Sammenlign med bratteste nedstigning, som alltid velger $p_k=r_k$.
3. Forklar hvorfor et nytt steg langs $p_j$ bevarer minimeringen langs $p_i$
   når $p_i^TAp_j=0$.
4. Endre `small` i forsøket. Hvorfor bør dere ikke bruke en figur i to
   dimensjoner til å forutsi antall CG-steg i et stort problem?

**Regnegangen**

Først er $p_0=r_0=(5,5)^T$ og $Ap_0=(20,15)^T$. Da blir

$$\alpha_0=2/7,\quad x_1=(10/7,10/7)^T,\quad r_1=(-5/7,5/7)^T,$$

$$\beta_0=1/49,\quad p_1=(-30/49,40/49)^T,\quad
Ap_1=(-50/49,50/49)^T.$$

Dermed er $p_0^TAp_1=0$. Bratteste nedstigning ville brukt $r_1$ som neste
retning. Begge bruker bare matrise-vektor-produkter og indreprodukter her.

**Hva forklarer dette?**

For å forklare minimeringen holder vi $x,p$ faste og ser på én variabel:

$$\phi(x+\alpha p)=\phi(x)-\alpha p^Tr+\tfrac12\alpha^2p^TAp.$$

Beste steg er $\alpha=p^Tr/(p^TAp)$, fordi $p^TAp>0$.
Etter steget er $p^Tr_{\mathrm{ny}}=0$. Hvis vi deretter går langs en
A-konjugert retning $q$, endres residualen med $-\alpha Aq$, så
$p^Tr$ endres med $-\alpha p^TAq=0$. Den gamle minimeringen bevares.
I CG gir ortogonaliteten $p_k^Tr_k=r_k^Tr_k$, som forklarer telleren over.

Ikke-null A-konjugerte retninger er lineært uavhengige. Det finnes høyst
$n$ slike retninger i $\mathbb R^n$. CG minimerer over stadig flere av dem;
derfor er hele rommet dekket etter høyst $n$ steg i eksakt regning.
Todimensjonsforsøket kan kreve høyst to slike steg uansett hvor smal skålen er.
I større problemer spiller både fordelingen av egenverdiene og startfeilen inn.

**Energifeilen** er $\lVert e\rVert_A=\sqrt{e^TAe}$. Den avtar under
CGs minimering i eksakt regning. Den vanlige residualnormen
$\lVert r\rVert_2$ er et annet mål og har ingen tilsvarende garanti for hvert steg.
For SPD må vi dessuten skille mellom små avrundingsfeil i implementasjonen
og det matematiske utsagnet om eksakt regning.

</details>

## 6.6 Prosjekt og egenarbeid

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

