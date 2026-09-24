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

## 6.3 Residual, norm og kondisjonstall

<div id="uke6-residual"></div>

### Når er et beregnet svar godt nok?

I de første forsøkene kjente vi løsningen og kunne måle feilen direkte.
Det gjør vi vanligvis ikke. Vi har i stedet en beregnet vektor $\hat x$,
og må undersøke om den er til å stole på. To spørsmål må skilles:

- **Hvor godt oppfyller $\hat x$ likningene?** Sett den inn og beregn
  residualen $r=b-A\hat x$.
- **Hvor nær er $\hat x$ den riktige løsningen $x_*$?** Dette måles av
  feilen $e=\hat x-x_*$, men krever at vi kjenner $x_*$.

Siden $Ax_*=b$, henger de to sammen ved $r=-Ae$.
Matrisen virker altså på feilen før vi ser den som en residual.
Hvis $A$ demper en retning kraftig, kan en stor feil i den retningen
bli nesten usynlig i residualen.

### Et lite eksempel før vi regner på datamaskinen

La

$$A=\begin{bmatrix}1&0\\0&10^{-4}\end{bmatrix},\qquad
b=\begin{bmatrix}1\\10^{-4}\end{bmatrix},\qquad x_*=(1,1)^T.$$

**Hvilket av forslagene $(1,0)^T$ og $(0.99,1)^T$ vil dere foretrekke?**
Det første bommer med én hel enhet i andre koordinat. Likevel er det
bare $10^{-4}$ som mangler i andre likning. Det andre forslaget bommer
med $0.01$ i første koordinat, og dette synes fullt ut i første likning.

| Forslag $\hat x$ | Residual $r=b-A\hat x$ | Feil $e=\hat x-x_*$ | $\lVert r\rVert_2$ | $\lVert e\rVert_2$ |
|:--|:--|:--|:--|:--|
| $(1,0)^T$ | $(0,10^{-4})^T$ | $(0,-1)^T$ | $10^{-4}$ | $1$ |
| $(0.99,1)^T$ | $(0.01,0)^T$ | $(-0.01,0)^T$ | $0.01$ | $0.01$ |

Forslaget med minst residual har størst feil. For å forstå hvor mye
matrisen kan skjule eller forsterke, trenger vi et mål på hvordan den
endrer **vektorlengder**.

### Matrisens 2-norm: den største strekkfaktoren

For en vektor er 2-normen den vanlige euklidiske lengden:
$\lVert z\rVert_2=\sqrt{z_1^2+\cdots+z_n^2}$.
Tidligere brukte vi **Frobenius-normen** til matriser:

$$\lVert A\rVert_F=\sqrt{\sum_{i,j}a_{ij}^2}.$$

Den summerer kvadratene av alle matriseelementene. Nå trenger vi en
annen norm, som er knyttet direkte til transformasjonen $z\mapsto Az$.
Vi definerer **matrisens 2-norm** ved

$$\boxed{\lVert A\rVert_2
=\max_{z\ne0}\frac{\lVert Az\rVert_2}{\lVert z\rVert_2}
=\max_{\lVert z\rVert_2=1}\lVert Az\rVert_2.}$$

Vi sender alle enhetsvektorer gjennom $A$ og finner den lengste
resultatvektoren. Normen er lengden til denne, altså den største
strekkfaktoren. Ordet «strekk» omfatter også demping: normen kan være
mindre enn $1$. Definisjonen gir straks
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
fig, axes = plt.subplots(1, 2, figsize=(10, 3.8))
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

Begge bilder har samme akseskala. Venstre bilde viser retningene vi
prøver; høyre viser hvordan $B$ virker på dem. Den lengste halvaksen
i ellipsen gir 2-normen. En rotasjon av ellipsen ville ikke endret
lengden til denne halvaksen.

I NumPy er `np.linalg.norm(A, 2)` matrisens 2-norm, mens
`np.linalg.norm(A)` uten normvalg gir Frobenius-normen når `A` er en
matrise. For en vektor gir `np.linalg.norm(z)` den vanlige 2-normen.
Vi skriver normvalget eksplisitt når vi regner på matriser.

### Kondisjonstall: forholdet mellom størst og minst strekk

For en invertibel, kvadratisk matrise definerer vi

$$\boxed{\kappa_2(A)=\lVert A\rVert_2\lVert A^{-1}\rVert_2.}$$

Den inverse transformasjonen forstørrer mest i den retningen der $A$
demper mest. Derfor er kondisjonstallet også **største strekkfaktor
delt på minste strekkfaktor**. Det er minst $1$. Et stort tall betyr
at transformasjonen behandler ulike retninger svært ulikt.

| Matrise | $\lVert A\rVert_2$ | $\lVert A^{-1}\rVert_2$ | $\kappa_2(A)$ | Hva ser vi? |
|:--|:--|:--|:--|:--|
| $I_2$ | $1$ | $1$ | $1$ | Alle lengder bevares. |
| $1000I_2$ | $1000$ | $10^{-3}$ | $1$ | Alle retninger skaleres like mye. |
| $\operatorname{diag}(3,1)$ | $3$ | $1$ | $3$ | Tre ganger så stort strekk i én retning. |
| $\operatorname{diag}(1,10^{-4})$ | $1$ | $10^4$ | $10^4$ | Én retning dempes kraftig. |

Store matriseelementer betyr altså ikke automatisk dårlig kondisjon.
Å multiplisere hele $A$ med samme ikke-null tall endrer ikke
$\kappa_2(A)$. En singulær matrise har ingen invers; da bruker vi
konvensjonen $\kappa_2(A)=\infty$.

For **symmetrisk positivt definitte** matriser, som vi møter i 6.4,
er strekkfaktorene egenverdiene, og
$\kappa_2(A)=\lambda_{\max}/\lambda_{\min}$.
For matrisen $\begin{bmatrix}3&1\\1&2\end{bmatrix}$ fra 6.1 er
egenverdiene $(5\pm\sqrt5)/2$, og kondisjonstallet er omtrent $2.62$.
Kvotienten av egenverdiene er ikke en generell oppskrift for alle
matriser. Uke 7 forklarer den generelle sammenhengen med singularverdier.

### Hva betyr tallet for nøyaktigheten?

For invertibel $A$ og $b\ne0$ har vi feilgrensen

$$\frac{\lVert\hat x-x_*\rVert_2}{\lVert x_*\rVert_2}
\le\kappa_2(A)\frac{\lVert b-A\hat x\rVert_2}{\lVert b\rVert_2}.$$

Venstresiden er **relativ feil**, og siste brøk på høyresiden er
**relativ residual**. Hvis residualen er $10^{-8}$ relativt til $b$,
gir $\kappa_2(A)=10^2$ en feilgrense på $10^{-6}$. Med
$\kappa_2(A)=10^8$ blir grensen $1$, som ikke garanterer en liten
relativ feil. Grensen beskriver en mulig forsterkning, ikke en
påstand om at alle feil blir så store.

Det samme tallet beskriver følsomhet for data. Hvis vi i stedet løser
$A\tilde x=b+\delta b$, gjelder

$$\frac{\lVert\tilde x-x_*\rVert_2}{\lVert x_*\rVert_2}
\le\kappa_2(A)\frac{\lVert\delta b\rVert_2}{\lVert b\rVert_2}.$$

Selv en eksakt algoritme vil da finne en annen løsning fordi den får
andre data. **Kondisjon er en egenskap ved problemet.** Avrundingsfeil
og valg av løsningsalgoritme kommer i tillegg.

### Eksperiment 3 – samme algoritme, ulikt tap av nøyaktighet

Vi bruker `np.linalg.solve` i alle tilfellene. Vi endrer matrisens
kondisjonstall, men beholder dimensjonen, egenretningene, den riktige
løsningen og størrelsen på dataforstyrrelsen.

Matrisene er $A_K=Q\operatorname{diag}(1,1/K)Q^T$, der kolonnene
$q_1,q_2$ i $Q$ er ortonormale. De strekker med henholdsvis $1$ og
$1/K$, slik at $\kappa_2(A_K)=K$. Vi velger $x_*=q_1$.
Høyresiden får en relativ forstyrrelse $\varepsilon=10^{-8}$,
én gang langs $q_1$ og én gang langs $q_2$.

**Hva tror dere skjer med svaret når forstyrrelsen ligger i retningen
som matrisen demper mest?**

```{pyodide-python}
#| label: week6-conditioning-experiment
Q = np.array([[.8, -.6], [.6, .8]])  # ortonormale kolonner
star = Q[:,0]
epsilon = 1e-8
kappas, errors_strong, errors_weak, residuals_weak = [], [], [], []
print('cond₂(A)    feil uten tilført støy    feil med støy langs q₂')
for K in [1., 1e2, 1e4, 1e6, 1e8]:
    A = Q @ np.diag([1., 1/K]) @ Q.T
    b = A @ star
    x_clean = np.linalg.solve(A, b)
    b_strong = b + epsilon*np.linalg.norm(b)*Q[:,0]
    b_weak = b + epsilon*np.linalg.norm(b)*Q[:,1]
    x_strong = np.linalg.solve(A, b_strong)
    x_weak = np.linalg.solve(A, b_weak)
    kappas.append(np.linalg.cond(A, 2))
    errors_strong.append(np.linalg.norm(x_strong-star)/np.linalg.norm(star))
    errors_weak.append(np.linalg.norm(x_weak-star)/np.linalg.norm(star))
    # Kontroller de likningene løseren faktisk fikk, altså med b_weak.
    residuals_weak.append(np.linalg.norm(b_weak-A@x_weak)/np.linalg.norm(b_weak))
    print(f'{kappas[-1]:9.1e}   {np.linalg.norm(x_clean-star)/np.linalg.norm(star):20.2e}'
          f'   {errors_weak[-1]:20.2e}')

kappas = np.array(kappas)
fig, axes = plt.subplots(1, 2, figsize=(11, 4))
axes[0].loglog(kappas, errors_weak, 'o-', label='Støy langs svakt strukket retning q₂')
axes[0].loglog(kappas, errors_strong, 's-', label='Støy langs q₁')
axes[0].loglog(kappas, epsilon*kappas, 'k:', label='κ₂(A) · ε')
axes[0].set(xlabel='Kondisjonstall κ₂(A)', ylabel='Relativ feil i løsningen',
            title='Samme løser og samme relative datastøy')
axes[0].legend(fontsize=8)
# Lineær skala her: residualen kan være nøyaktig null i flyttallsregningen.
axes[1].semilogx(kappas, residuals_weak, 'o-')
axes[1].set(xlabel='Kondisjonstall κ₂(A)', ylabel='Relativ residual mot forstyrret b',
            title='Likningene løseren fikk, er godt oppfylt',
            ylim=(0, max(5e-16, 1.2*max(residuals_weak))))
for ax in axes: ax.grid(alpha=.25)
fig.tight_layout(); plt.show()
```

**Slik leser vi bildene.** Til venstre måler vi feil mot den opprinnelige
løsningen. Langs $q_2$ vokser feilen omtrent som $K\varepsilon$:
$10^{-8},10^{-6},10^{-4},10^{-2},1$. Samme lille endring i høyresiden
kan altså gi alt fra en svært presis løsning til omtrent $100\%$
relativ feil. Langs $q_1$ er forsterkningen langt mindre, selv med
samme kondisjonstall. Retningen til forstyrrelsen betyr noe.

Til høyre er residualen liten for **det forstyrrede systemet som
algoritmen faktisk løste**. Det motsier ikke den store feilen mot
opprinnelig løsning. Kontrollerer vi mot opprinnelig $b$, vil
residualen i stedet være omtrent på størrelse med dataforstyrrelsen.

Den utskrevne kolonnen uten tilført støy viser virkningen av
flyttallsregningen i dette forsøket. Den kan variere mellom maskiner
og trenger ikke vokse jevnt. Plottets store, kontrollerte effekt kommer
fra følsomheten for den påførte datastøyen; den skal ikke omtales som
ren avrundingsfeil i `solve`.

### Hva betyr dette for stoppkravet vårt?

I et iterativt program kan vi kreve

$$\lVert b-Ax_k\rVert_2\le\text{atol}+\text{rtol}\lVert b\rVert_2.$$

`atol` er en absolutt toleranse og `rtol` en relativ toleranse.
Dette kontrollerer likningene, men hvor god løsningen er, avhenger
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
3. Utled feilgrensen fra $e=-A^{-1}r$ og $b=Ax_*$.
4. Vis uten Python at forsøket gir relativ feil $\varepsilon$ for
   $\delta b=\varepsilon q_1$, og $K\varepsilon$ for
   $\delta b=\varepsilon q_2$, i eksakt regning.

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

I forsøket er $b=q_1$ og både $b$ og $x_*$ har lengde $1$.
Siden $A_K^{-1}q_1=q_1$ og $A_K^{-1}q_2=Kq_2$, får vi

$$\delta x=A_K^{-1}\delta b=
\begin{cases}\varepsilon q_1,&\delta b=\varepsilon q_1,\\
K\varepsilon q_2,&\delta b=\varepsilon q_2.
\end{cases}$$

**Hva forklarer dette?**

Kondisjonstallet beskriver den største mulige relative forsterkningen,
og det andre valget treffer denne grensen. Grovt kan en forsterkning
på $10^m$ koste omtrent $m$ desimalsifre i relativ nøyaktighet, men
ikke alle forstyrrelser utløser dette tapet. For generelle matriser
må vi bruke strekkfaktorer, ikke bare egenverdier. For eksempel har
$\begin{bmatrix}1&10\\0&1\end{bmatrix}$ begge egenverdier lik $1$,
men kondisjonstall omtrent $102$.

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
leder til bratteste nedstigning i 6.5 og konjugert gradient i 6.6.

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
nye data: helningene kan regnes ut fra matrisen og forslaget vårt.
Med residualkonvensjonen $r=b-Ax$ får vi

$$\boxed{\nabla\phi(x)=Ax-b=-r.}$$

Hva sier vektoren om en bevegelse som endrer **begge** koordinatene?
For et lite steg $h=(h_u,h_v)^T$ er endringen omtrent
$\nabla\phi(x)^Th$. De to helningene bidrar med hver sin
koordinatendring. Blant steg med samme lille lengde blir dette
indreproduktet mest negativt når $h$ peker motsatt gradienten.
Derfor peker **$-\nabla\phi=r$ mot brattest lokal nedgang**.
Utledningen med Cauchy–Schwarz ligger i «Gå i dybden».

I startpunktet $(0,0)$ er gradienten $(-5,-5)^T$, så residualen er
$(5,5)^T$. Nedoverretningen går diagonalt mot høyre og oppover i
koordinatplanet. «Nedover» gjelder funksjonsverdien, ikke plasseringen
på arket. Retningen til selve løsningen $(1,2)$ er annerledes.

**Hvorfor kan en retning være brattest ned akkurat her, uten å peke
rett mot det laveste punktet i hele skålen?** Skålens helning endrer
seg når vi flytter oss. Gradienten gir lokal informasjon.

### Fra retning til det beste punktet på linjen

La $p$ være en valgt **søkeretning**. Vi leter blant punktene

$$x+\alpha p,$$

der tallet $\alpha$ bestemmer hvor langt vi går. Et **linjesøk**
betyr at vi velger $\alpha$ ved å se på funksjonen langs akkurat denne
linjen. For vår kvadratiske funksjon får vi en oppovervendt parabel
som funksjon av $\alpha$, så minimumet kan finnes nøyaktig.
Stegets faktiske lengde er $|\alpha|\lVert p\rVert_2$;
$\alpha$ alene avhenger av hvor lang vektoren $p$ er.

Fra $x_0=(0,0)^T$ velger vi $p_0=r_0=(5,5)^T$. Punktene på linjen
er $(5\alpha,5\alpha)$. Setter vi disse inn i $\phi$, får vi

$$\psi(\alpha)=\phi(5\alpha,5\alpha)
=\tfrac{175}{2}\alpha^2-50\alpha.$$

Parabelen har minimum ved $\alpha_0=2/7$. Dermed er første nye punkt
$x_1=(10/7,10/7)^T$. Det er det beste punktet på linjen $u=v$,
men det er ennå ikke minimumet $(1,2)$ i hele planet.

### Eksperiment 5a – ett steg, sett på to måter

Venstre bilde viser linjen i koordinatplanet. Høyre bilde viser
funksjonsverdien langs **den samme linjen**, med $\alpha$ på
vannrett akse. Stjernen til venstre er løsningen av hele problemet;
punktet nederst i parabelen til høyre er bare linjens minimum.

```{pyodide-python}
#| label: week6-line-search
A = np.array([[3.,1.], [1.,2.]])
b = np.array([5.,5.])
x0 = np.zeros(2)
p0 = b - A @ x0
alpha0 = (p0 @ p0)/(p0 @ A @ p0)
x1 = x0 + alpha0*p0
fig, axes = plt.subplots(1, 2, figsize=(11, 4.5))
bowl_plot(axes[0], A, b, {'Første steg':np.array([x0,x1])},
          bounds=(-.5,2.7,-.5,3.2))
axes[0].plot([-.5,2.7], [-.5,2.7], '--', color='#2563eb', alpha=.5)
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
langs den blå linjen til venstre og nedover parabelen til høyre.
Ved $\alpha=2/7$ er videre bevegelse langs samme linje ingen forbedring.
Den stiplede vannrette linjen til høyre ligger enda litt lavere:
minimumet i hele planet er ikke tilgjengelig langs den valgte linjen.
Vi må velge en ny retning.

Nivåkurven gjennom $x_1$ berører søkelinjen der. Gradienten står
vinkelrett på nivåkurven, og dermed også på søkelinjen i dette punktet.
Det forklarer hvorfor neste residual står vinkelrett på den første
søkeretningen når vi gjør et eksakt linjesøk.

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

Vi beholder løsningen $x_*=(1,-1.1)^T$, startpunktet og egenretningene.
Til venstre er begge egenverdiene $1$, slik at nivåkurvene er sirkler.
Til høyre er egenverdiene $1$ og $0.04$, slik at nivåkurvene er
ellipser. Kondisjonstallene er henholdsvis $1$ og $25$.

**I hvilket bilde tror dere residualen peker rett mot løsningen?**

```{pyodide-python}
#| label: week6-steepest-descent
Q = np.array([[1.,-1.],[1.,1.]])/np.sqrt(2)
star = np.array([1.,-1.1])
fig, axes = plt.subplots(1, 2, figsize=(10, 4.3))
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

Til venstre treffer ett linjesøk bunnen. For $A=I$ er
$r=b-x=x_*-x$, altså nøyaktig vektoren fra forslaget til løsningen.
Til høyre er residualen påvirket av ulik skalering i de to
egenretningene. Banen skifter retning ved hvert markerte punkt,
men bruker mange steg på å nærme seg stjernen.

Hvert linjesøk er optimalt på sin linje. Det er **valget av neste
linje** som gjør hele banen langsom. Dette er spørsmålet CG skal
svare på i 6.6: Kan vi velge en ny retning uten å ødelegge
minimumsegenskapen vi allerede har oppnådd langs en tidligere retning?

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

### Hva vil vi beholde fra forrige steg?

Bratteste nedstigning finner det beste punktet på én linje, måler
helningen på nytt og velger en ny linje. Vi så at dette kan gi en
sikksakkbane. Nå vil vi bruke informasjonen fra tidligere steg til
å velge retning mer bevisst.

Vi fortsetter med $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$,
$b=(5,5)^T$ og start i origo. Første linjesøk langs $p_0=(5,5)^T$
ga $x_1=(10/7,10/7)^T$. I $x_1$ kan vi ikke senke $\phi$ ved å
bevege oss langs den første søkeretningen: vi har allerede funnet
minimum på den linjen.

**Kan vi flytte oss videre og samtidig beholde denne egenskapen?**
Det betyr at det nye punktet også skal være minimum langs linjen
gjennom punktet som er **parallell med $p_0$**. Vi vil kunne gå
videre uten å måtte korrigere oss i den gamle retningen etterpå.

### Et bilde av hva som bevares

I dette eksemplet kan vi tegne alle punkter som allerede er optimale
langs retningen $p_0$. De ligger på den grønne linjen
$4u+3v=10$. Vi utleder likningen i «Gå i dybden».
Både $x_1$ og den endelige løsningen ligger på denne linjen.

I venstre bilde velger vi den nye residualen som retning, slik
bratteste nedstigning gjør. I høyre bilde velger vi en retning
**langs den grønne linjen**, og gjør linjesøk der.
Begge metoder har samme startpunkt og samme første steg.
Vi zoomer inn rundt $x_1$ og løsningen for å se forskjellen tydelig;
startpunktet $x_0$ ligger utenfor disse utsnittene.

**Hvilken av de to nye retningene bevarer det første linjesøkets
minimumsegenskap?**

```{pyodide-python}
#| label: week6-cg-preservation
A = np.array([[3.,1.], [1.,2.]])
b = np.array([5.,5.])
sd_two = descent_path(A, b, [0.,0.], steps=2)
cg_two = cg(A, b, rtol=1e-12)['path']
fig, axes = plt.subplots(1, 2, figsize=(11, 4.8))
for ax, path, name in zip(axes, [sd_two, cg_two], ['Bratteste nedstigning', 'CG']):
    bowl_plot(ax, A, b, {name:path[1:]}, bounds=(.75,1.65,1.2,2.2))
    u = np.linspace(.75,1.65,150)
    ax.plot(u, (10-4*u)/3, '--', color='#15803d',
            label='Fortsatt minimum langs p₀')
    for j, point in enumerate(path[1:], start=1):
        offset = (9,-15) if j == 1 else (-28,-18)
        ax.annotate(f'x{j}', point, xytext=offset, textcoords='offset points')
    ax.set(xlabel='u', ylabel='v', title=name + ': andre steg')
    ax.legend(loc='lower left', fontsize=8)
fig.tight_layout(); plt.show()
```

**Les først venstre bilde.** Første steg ender på den grønne linjen.
Neste steg går til et lavere funksjonsnivå, men forlater linjen.
I det nye punktet kan vi igjen forbedre svaret ved å gå i den gamle
retningen. Det er noe av forklaringen på at metoden må korrigere seg
flere ganger.

**Les deretter høyre bilde.** Den nye retningen følger den grønne
linjen, så minimumsegenskapen langs den første retningen bevares.
Linjesøket langs den nye retningen treffer stjernen. Nå kan vi ikke
forbedre funksjonen langs noen av de to uavhengige retningene.
I to dimensjoner har vi da nådd minimumet i hele planet.

De grønne strekene er **ikke nivåkurver**: funksjonsverdien endrer
seg langs dem. De viser punkter som er optimale langs en bestemt
annen retning. De grå ellipsene er fortsatt nivåkurvene fra 6.4.

### Konjugerte retninger passer til matrisen

Hvilken betingelse på den nye retningen gjør at den gamle
minimumsegenskapen bevares? For en kvadratisk funksjon med SPD-matrise
$A$ er svaret

$$\boxed{p^TAq=0.}$$

Da kalles $p$ og $q$ **A-konjugerte retninger**. Dette ligner
ortogonalitet fra uke 4, men matrisen er med i indreproduktet.
Vi bruker $\langle p,q\rangle_A=p^TAq$ i stedet for $p^Tq$.
SPD-forutsetningen gjør dette til et indreprodukt.

Retningene behøver derfor ikke se vinkelrette ut på arket.
Vanlig rett vinkel betyr $p^Tq=0$; konjugerthet betyr $p^TAq=0$.
Når $A=I$, er de to begrepene like. For en skjev eller smal skål
må retningene tilpasses matrisen. Det høyre bildet viser nettopp
et slikt par retninger som virker sammen uten å forstyrre hverandres
minimeringer.

Dette knytter CG til **Gram–Schmidt**: vi kan starte med en foreslått
retning og fjerne bidrag langs tidligere retninger, men nå med
indreproduktet bestemt av $A$. CG bruker den nye residualen som
utgangspunkt. For SPD kan hele beregningen organiseres slik at vi
bare trenger residualen og forrige søkeretning for å lage den neste.
Vi behøver ikke lagre alle de gamle retningene.

### Hva gjør CG i praksis?

Navnet **konjugert gradient (CG)** viser til begge ideene: residualen
er negativ gradient, og søkeretningene konstrueres for å være
A-konjugerte. Etter første steg er søkeretningen vanligvis **ikke**
lik residualen alene.

Den praktiske oppskriften er:

1. Start med et forslag $x_0$, beregn residualen, og bruk den som første retning.
2. Finn minimum langs søkeretningen og oppdater forslaget.
3. Beregn ny residual. Stopp hvis residualkravet er oppfylt.
4. Kombiner ny residual med forrige søkeretning slik at den nye
   retningen blir konjugert med de tidligere. Gjenta linjesøket.

Faktorene som bestemmer steglengden og kombinasjonen, kan beregnes
med indreprodukter. Formlene og et fullstendig regneeksempel står
nedenfor. Hovedideen er at **hvert steg utvider mengden av retninger
vi allerede har minimert over**, samtidig som tidligere minimeringer
bevares i eksakt regning.

### Eksperiment 6 – samme skåler, nye retninger

Vi vender tilbake til de to skålene fra 6.5. Denne gangen legger vi
CG-banen oppå banen til bratteste nedstigning. Hjelperen `cg` returnerer
blant annet `path`, som inneholder startpunktet og de nye forslagene,
og `residuals`, som inneholder direkte beregnede residualnormer.
Stjernen fra `bowl_plot` er bare et referansepunkt; CG bruker ikke
en direkte løsning for å beregne banen.

**Hva forventer dere at de to metodene gjør på den runde skålen?
Og hva tror dere endrer seg på den smale?**

```{pyodide-python}
#| label: week6-cg-experiment
Q = np.array([[1.,-1.],[1.,1.]])/np.sqrt(2)
star = np.array([1.,-1.1])
fig, axes = plt.subplots(1, 2, figsize=(10,4.3))
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

Til venstre ligger banene oppå hverandre: første retning peker rett
mot løsningen, og ett linjesøk er nok. Til høyre er første steg også
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

Oppbygningen er inspirert av Jonas J. Harangs
[Iterative metoder 2 (30. oktober 2024)](https://wiki.math.ntnu.no/_media/imax3011/2025h/iterative2-h24.pdf),
særlig koblingen mellom kvadratisk minimering, A-indreprodukt og
Gram–Schmidt. Her bruker vi konsekvent residualen $r=b-Ax$.

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

