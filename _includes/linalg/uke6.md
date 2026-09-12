<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Selvstudium</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 6.0 Oversikt

<div id="uke6-start"></div>

### Hvorfor virker gjentatte korreksjoner?

Du har møtt Jacobi og Gauss–Seidel tidligere. Nå skal vi bruke dem til å
knytte sammen **fikspunkt, egenverdier og minimering**. Vi starter med å
regne, beskriver det vi ser, og bygger forklaringen etterpå.

Alt utenfor de sammenleggbare boksene er fellesløpet. I forelesningen gjør
vi forsøkene sammen; i selvstudium gjør du dem selv før du leser videre.
Selvstudium åpner mellomregningene. Hint og løsninger åpner du etter eget forsøk.

| Tid i en 90-minutters forelesning | Fellesløp |
|---|---|
| 0–15 min | [Husk oppdateringene](#uke6-gs): én sammenligning med Jacobi, deretter GS |
| 15–35 min | [Følg feilen](#uke6-fikspunkt): fikspunkt og egenverdier |
| 35–45 min | [Kontroller svaret](#uke6-residual): residual og faktisk feil |
| 45–65 min | [Finn minimum](#uke6-energi): GS som koordinatvis minimering |
| 65–85 min | [Velg retning og steglengde](#uke6-retning): bratteste nedstigning |
| 85–90 min | [Prosjektbro](#uke6-prosjekt): samme løsning, bedre skalering |

Etter uken skal du kunne forklare GS som fikspunktiterasjon og, for SPD-systemer,
som koordinatvis minimering. Du skal kunne tolke residualer og forbinde
konvergens med egenverdier. I prosjektet undersøker du CG og prekondisjonering.
Uke 7 handler om SVD. Senere bruker vi igjen målfunksjon, gradient,
søkeretning, steglengde og krumning i optimering.

## 6.1 Husk Gauss–Seidel

<div id="uke6-gs"></div>

### Felles forsøk — hent fram en gammel metode

Vi skal løse

$$3u+v=5,\qquad u+2v=5.$$

Start med $(u_0,v_0)=(0,0)$. Skriv først likningene slik at $u$ står alene
i den første og $v$ i den andre. Gjør deretter **én runde på to måter**:

1. Bruk bare de gamle verdiene på høyresidene.
2. Beregn ny $u$ først, og bruk denne straks når du beregner ny $v$.
3. Gjør enda én runde med den andre regelen. Noter begge verdiene etter hver runde.

### Sammenlign etter at du har prøvd

Reglene er

$$\begin{array}{ll}
\text{Jacobi:}&u_{k+1}=(5-v_k)/3,\quad v_{k+1}=(5-u_k)/2,\\
\text{Gauss–Seidel:}&u_{k+1}=(5-v_k)/3,\quad v_{k+1}=(5-u_{k+1})/2.
\end{array}$$

Jacobi gir $(5/3,5/2)$ etter første runde. GS gir

$$(0,0)\longmapsto(5/3,5/3)\longmapsto(10/9,35/18).$$

Forskjellen er **når verdiene brukes**. Vi følger GS videre.
Løsningen er $(1,2)$; kontroller den i begge de opprinnelige likningene.
En hel runde gjennom alle ukjente kalles et **sveip**.

```{pyodide-python}
#| label: week6-gs-experiment
A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 5.])
path = gs_path(A, b, [0., 0.], sweeps=8)
# Hvert sveip inneholder to koordinatoppdateringer.
print("Etter hele sveip:\n", path[::2])
plt.figure()
plt.plot(range(9), path[::2], 'o-')
plt.axhline(1, color='gray', linestyle=':')
plt.axhline(2, color='gray', linestyle=':')
plt.xlabel('Antall GS-sveip'); plt.ylabel('Koordinatverdi')
plt.legend(['u', 'v']); plt.show()
```

**Noter:** Nærmer begge koordinatene seg riktig verdi? Vi har observert
konvergens for én start; det er ennå ikke en forklaring på hvorfor metoden virker.

<details class="reading-step">
<summary>Forklaring steg for steg: fra likning til oppdatering</summary>

Første likning gir $3u=5-v$, altså $u=(5-v)/3$.
Andre gir $2v=5-u$, altså $v=(5-u)/2$.
I GS blir første sveip $u_1=5/3$ og
$v_1=(5-5/3)/2=5/3$. Andre sveip gir
$u_2=(5-5/3)/3=10/9$ og $v_2=(5-10/9)/2=35/18$.

I et større system deler vi summen i kjente nye og fortsatt gamle verdier:

$$x_i^{(k+1)}=\frac{b_i-\sum_{j<i}a_{ij}x_j^{(k+1)}
-\sum_{j>i}a_{ij}x_j^{(k)}}{a_{ii}}.$$

Dette krever $a_{ii}\ne0$. Én arbeidsvektor er nok: når koordinat $i$
overskrives, bruker neste koordinat den nye verdien.

```text
Gjenta et avtalt antall sveip:
    For i = 1, …, n:
        x_i = (b_i − summen av a_ij x_j for j ≠ i) / a_ii
```

Den leverte funksjonen bruker den likeverdige korreksjonen
$x_i\leftarrow x_i+(b_i-(Ax)_i)/a_{ii}$.
Den lagrer også mellompunktet etter hver koordinat, slik at vi senere kan
se GS-bevegelsen på et konturplott. `path[::n]` velger hele sveip.
Vi bruker et fast antall sveip her for å se forløpet; et stoppkriterium kommer i 6.3.

</details>

## 6.2 Følg feilen

<div id="uke6-fikspunkt"></div>

### Felles forsøk — samme oppskrift, ulikt resultat

Prøv systemene med

$$A_a=\begin{bmatrix}3&1\\1&2\end{bmatrix},\qquad
A_b=\begin{bmatrix}1&2\\2&1\end{bmatrix}.$$

I begge velger vi kjent løsning $x_*=(1,2)^T$ og lager $b=Ax_*$.
Gjett hvilket system GS klarer fra null. Kjør, og noter om feilen blir
mindre eller større. Er ti ekstra sveip alltid en forbedring?

```{pyodide-python}
#| label: week6-convergence
star = np.array([1., 2.])
fig, ax = plt.subplots()
for name, A in [('A_a', np.array([[3.,1.],[1.,2.]])),
                ('A_b', np.array([[1.,2.],[2.,1.]]))]:
    b = A @ star
    values = gs_path(A, b, np.zeros(2), sweeps=10)[::2]
    errors = np.linalg.norm(values-star, axis=1)
    ax.semilogy(range(len(values)), errors, 'o-', label=name)
ax.set(xlabel='GS-sveip', ylabel='‖x_k − x_*‖₂')
ax.legend(); plt.show()
```

### Fra observasjon til fikspunkt

Sett uttrykket for $u_{k+1}$ inn i uttrykket for $v_{k+1}$ i første system:

$$u_{k+1}=\frac53-\frac13v_k,\qquad
v_{k+1}=\frac{5-(5-v_k)/3}{2}=\frac53+\frac16v_k.$$

Dermed er hele sveipet én affin fikspunktiterasjon:

$$x_{k+1}=Tx_k+c,\qquad
T=\begin{bmatrix}0&-1/3\\0&1/6\end{bmatrix},\quad
c=\begin{bmatrix}5/3\\5/3\end{bmatrix}.$$

Ved løsningen er $x_*=Tx_*+c$. Trekk fra:

$$e_k=x_k-x_*,\qquad e_{k+1}=Te_k,\qquad e_k=T^ke_0.$$

**Her kommer uke 5 tilbake:** Det er egenverdiene til **iterasjonsmatrisen
$T$**, ikke til systemmatrisen $A$, som avgjør om alle startfeil forsvinner.
For første system er de $0$ og $1/6$; for det andre er de $0$ og $4$.

Generelt konvergerer iterasjonen fra enhver start når og bare når

$$\rho(T)=\max_i|\lambda_i(T)|<1.$$

Dette kalles spektralradiusen. En egenverdi med absoluttverdi over én kan
forsterke et feilbidrag. En spesiell start kan mangle dette bidraget, så
én vellykket kjøring beviser ikke konvergens fra alle starter.

<details class="reading-step">
<summary>Forklaring steg for steg: bygg T uten å blande den med A</summary>

For andre system er $b=A_b(1,2)^T=(5,4)^T$. GS gir
$u_{k+1}=5-2v_k$ og $v_{k+1}=4-2u_{k+1}=-6+4v_k$.
Dermed er $T_b=\begin{bmatrix}0&-2\\0&4\end{bmatrix}$ og $c_b=(5,-6)^T$.
Fra null er $e_0=(-1,-2)^T$ og $e_1=T_be_0=(4,-8)^T$.
Et voksende bidrag langs egenverdien fire er faktisk til stede.

For generell $A=D+L+U$ inneholder $D$ diagonalen, $L$ elementene strengt
under og $U$ elementene strengt over diagonalen, **med deres opprinnelige fortegn**.

$$(D+L)x_{k+1}=b-Ux_k,\qquad
T=-(D+L)^{-1}U,\qquad c=(D+L)^{-1}b.$$

Vi bruker uttrykket til analyse. I kode løser vi med den triangulære
matrisen eller oppdaterer koordinatene; vi trenger ikke danne inversen.
For Jacobi ville $T=-D^{-1}(L+U)$. Det er en annen iterasjonsmatrise.

Når en egenvektorbasis finnes, forklarer $T^ke_0$ konvergens ved å skalere
hvert bidrag med $\lambda_i^k$. Kriteriet $\rho(T)<1$ gjelder også når
$T$ ikke er diagonaliserbar; vi bruker ikke det mer generelle beviset her.

Streng diagonal dominans, $|a_{ii}|>\sum_{j\ne i}|a_{ij}|$ i hver rad,
er en tilstrekkelig betingelse for både Jacobi og GS.
Hvis betingelsen ikke er oppfylt, kan vi ikke konkludere med divergens.
GS konvergerer også for SPD-matriser, som vi møter i 6.4.

</details>

## 6.3 Kontroller svaret

<div id="uke6-residual"></div>

### Felles forsøk — liten rest, stor feil?

Bruk $A=\operatorname{diag}(1,10^{-4})$, $x_*=(1,1)^T$ og $b=Ax_*$.
Sammenlign forslagene $x^{(a)}=(1,0)^T$ og $x^{(b)}=(0.99,1)^T$.
Regn $b-Ax$ og $x-x_*$ for begge. Hvilket forslag oppfyller likningene best?
Hvilket ligger nærmest løsningen?

### Sammenlign regningen

$$\begin{array}{c|c|c}
&\lVert b-Ax\rVert_2&\lVert x-x_*\rVert_2\\\hline
x^{(a)}&10^{-4}&1\\
x^{(b)}&10^{-2}&10^{-2}
\end{array}$$

Matrisen demper feil i andre koordinat kraftig. Derfor kan en stor feil der
bli nesten usynlig i likningene.

$$r=b-Ax=Ax_*-Ax=-Ae,\qquad e=x-x_*.$$

Residualen kan vi beregne uten å kjenne løsningen. Feilen kjenner vi her
fordi forsøket er konstruert med $x_*$. I praksis stopper vi for eksempel når

$$\lVert b-Ax_k\rVert_2\le\text{atol}+\text{rtol}\lVert b\rVert_2,$$

og setter dessuten en øvre grense for antall iterasjoner.
Vi må ikke tolke residualtoleransen som en automatisk garanti for samme løsningsfeil.

<details class="reading-step">
<summary>Forklaring steg for steg: følsomhet og relative mål</summary>

Her er $b=(1,10^{-4})^T$.
For første forslag er $r=(0,10^{-4})^T$ og $e=(0,-1)^T$.
For andre er $r=(0.01,0)^T$ og $e=(-0.01,0)^T$.
Dette er to tilnærminger til samme problem, så sammenligningen er direkte.

For invertibel $A$ gir $e=-A^{-1}r$ at
$\lVert e\rVert_2\le\lVert A^{-1}\rVert_2\lVert r\rVert_2$.
Med $b\ne0$ får vi den relative grensen

$$\frac{\lVert e\rVert_2}{\lVert x_*\rVert_2}
\le\kappa_2(A)\frac{\lVert r\rVert_2}{\lVert b\rVert_2}.$$

For SPD er $\kappa_2(A)=\lambda_{\max}/\lambda_{\min}$.
I eksemplet er dette $10^4$. Et lite residual kan altså være forenlig med
betydelig feil. Uke 7 bruker SVD til å forklare kondisjonering for mer generelle matriser.

Bruk både absolutt og relativ toleranse når $b$ kan være null eller svært lite.
En liten endring mellom to iterater er heller ikke alene nok: en metode kan
bevege seg langsomt langt fra løsningen. Beregn den opprinnelige residualen.

</details>

## 6.4 Løsningen som minimum

<div id="uke6-energi"></div>

### Felles forsøk — følg GS på en flate

Vi vender tilbake til $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$ og $b=(5,5)^T$.
Nedenfor viser kurvene punkter med lik verdi av

$$\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v.$$

Gjett hvor verdien er lavest. Kjør cellen, følg de fire første
koordinatoppdateringene fra null, og noter hvilken koordinat som endres
hver gang. Sammenlign bunnpunktet med løsningen fra 6.1.

```{pyodide-python}
#| label: week6-coordinate-energy
A = np.array([[3.,1.],[1.,2.]])
b = np.array([5.,5.])
path = gs_path(A, b, [0.,0.], sweeps=4)
fig, ax = plt.subplots()
bowl_plot(ax, A, b, {'GS, én koordinat om gangen': path})
plt.show()
energy = np.array([.5*x @ A @ x - b @ x for x in path])
print('Funksjonsverdier:', energy)
```

### Hvorfor havner vi i et minimum?

Skriv funksjonen som $\phi(x)=\frac12x^TAx-b^Tx$.
For symmetrisk positivt definitt (**SPD**) $A$ gjelder
$A^T=A$ og $z^TAz>0$ for alle $z\ne0$.
Fra uke 5: en reell symmetrisk matrise er positivt definitt akkurat når
alle egenverdiene er positive. Her er de $(5\pm\sqrt5)/2$.

Sett $x=x_*+e$, og bruk $Ax_*=b$. Kryssleddene kanselleres:

$$\phi(x)-\phi(x_*)=\tfrac12e^TAe>0\quad\text{når }e\ne0.$$

Dermed er løsningen det entydige minimumet. Ingen ny løsning er innført;
vi har gitt det samme systemet en ny tolkning.

### Samme GS-regel, ny forklaring

Hold $v$ fast og minimer med hensyn på $u$. Deretter holder vi den nye $u$ fast:

$$\frac{\partial\phi}{\partial u}=3u+v-5=0
\ \Longrightarrow\ u=(5-v)/3,$$

$$\frac{\partial\phi}{\partial v}=u+2v-5=0
\ \Longrightarrow\ v=(5-u)/2.$$

Dette er akkurat GS. Vi har sett **koordinatvis minimering**.
Hver endimensjonal funksjon har positiv andrederivert, henholdsvis $3$ og $2$.
Senere kaller vi denne arbeidsmåten koordinatnedstigning i optimering.

<details class="reading-step">
<summary>Forklaring steg for steg: kvadratet, egenverdiene og koordinatene</summary>

Utvid $x^TAx$ for $x=(u,v)^T$:
$u(3u+v)+v(u+2v)=3u^2+2uv+2v^2$.
Faktoren $1/2$ gir funksjonen i forsøket.
For $x_*=(1,2)^T$ er $\phi(x_*)=-15/2$.

Utvid nå rundt løsningen:

$$\phi(x_*+e)=\tfrac12x_*^TAx_*+e^TAx_*+\tfrac12e^TAe-b^Tx_*-b^Te.$$

Symmetri slår sammen de to kryssleddene. Siden $Ax_*=b$, er
$e^TAx_*-b^Te=0$. Det som står igjen er $\phi(x_*)+\frac12e^TAe$.

Med $A=Q\Lambda Q^T$ og $z=Q^Te$ er
$e^TAe=\sum_i\lambda_i z_i^2$. Positive egenverdier betyr at verdien stiger
bort fra minimum i alle retninger. Hvis en egenverdi er negativ, kan en
stasjonær løsning være et sadelpunkt. Minimeringstolkningen vår krever SPD.

Partiellderivert betyr at de andre koordinatene holdes faste mens vi deriverer.
Generelt er $\partial\phi/\partial x_i=(Ax-b)_i$.
Å sette dette lik null og løse for $x_i$ gir oppdateringen i 6.1.
Positiv $a_{ii}$ sikrer et minimum langs koordinaten. SPD sikrer dessuten
et felles entydig globalt minimum og konvergens av GS.

</details>

## 6.5 Retning og steglengde

<div id="uke6-retning"></div>

### Felles forsøk — er koordinatretningene nødvendige?

Vi lar en annen metode gå i retning $r=b-Ax$. En ferdig funksjon velger
beste steglengde langs denne retningen. Gjett om dette alltid gir få steg.
Kjør først på en rund og deretter en smal, rotert skål. Noter forskjellen
mellom GS-banen og den nye banen; se spesielt etter sikksakk.

```{pyodide-python}
#| label: week6-descent
Q = np.array([[1.,-1.],[1.,1.]])/np.sqrt(2)
star = np.array([1.,2.])
fig, axes = plt.subplots(1, 2, figsize=(10,4))
for ax, small in zip(axes, [1., .04]):
    A = Q @ np.diag([1.,small]) @ Q.T
    b = A @ star
    gs = gs_path(A, b, [0.,0.], sweeps=8)
    sd = descent_path(A, b, [0.,0.], steps=16)
    bowl_plot(ax, A, b, {'GS':gs, 'langs residualen':sd})
    ax.set_title(f'Egenverdier 1 og {small}')
fig.tight_layout(); plt.show()
```

### Hvorfor residualretningen?

Samle de partiellderiverte i **gradienten**:

$$\nabla\phi(x)=Ax-b=-r.$$

Gradienten peker i retningen med størst lokal økning per lengdeenhet.
Negativ gradient gir størst lokal reduksjon. Dette er en lokal opplysning,
ikke et løfte om at én rett bevegelse treffer minimumet.

Vi skiller mellom valg av retning $p$ og valg av steglengde $\alpha$:

$$x_{\mathrm{ny}}=x+\alpha p.$$

### Finn beste steg med én variabel

**Felles regning:** Hold $x$ og $p\ne0$ faste. Utvid og deriver med hensyn på $\alpha$:

$$g(\alpha)=\phi(x+\alpha p)
=\phi(x)-\alpha p^Tr+\tfrac12\alpha^2p^TAp,$$

$$g'(\alpha)=-p^Tr+\alpha p^TAp=0
\quad\Longrightarrow\quad \alpha=\frac{p^Tr}{p^TAp}.$$

SPD gir $p^TAp>0$, så dette er et minimum langs linjen.
Med $p=r$ får vi **bratteste nedstigning**:

$$\alpha_k=\frac{r_k^Tr_k}{r_k^TAr_k},\qquad x_{k+1}=x_k+\alpha_kr_k.$$

**Kontroll for hånd:** For $A$ og $b$ fra 6.1, fra null er $r_0=(5,5)^T$.
Da er $Ar_0=(20,15)^T$, $\alpha_0=50/175=2/7$ og $x_1=(10/7,10/7)^T$.
Dette er et annet steg enn GS-sveipet.

<details class="reading-step">
<summary>Forklaring steg for steg: hvorfor sikksakk og hva skal vi huske?</summary>

Siden $r_{k+1}=r_k-\alpha_kAr_k$, får vi

$$r_k^Tr_{k+1}=r_k^Tr_k-\alpha_kr_k^TAr_k=0.$$

Med eksakt linjeminimering blir påfølgende residualretninger ortogonale.
På en smal skål kan dette gi mange korte bevegelser på tvers av dalen.
Nye retninger kan fortsatt ha bidrag i retninger vi allerede har undersøkt.

Retningsderiverten i en enhetsretning $d$ er $\nabla\phi(x)^Td$.
Cauchy–Schwarz viser at den minste verdien oppnås for
$d=-\nabla\phi/\lVert\nabla\phi\rVert_2$ når gradienten er ulik null.
Dette forklarer navnet «bratteste». Steglengden bestemmes i en egen beregning.

I den leverte funksjonen beregnes først $r$, så $Ar$, så forholdet mellom
de to indreproduktene. Hvis residualen er null, stopper vi før divisjonen.
Vi trenger bare matrise-vektor-produkter, ikke en invers.

Til optimeringsukene tar vi med fem begreper:
**målfunksjon** $\phi$, **gradient** $\nabla\phi$, **søkeretning** $p$,
**steglengde** $\alpha$ og **krumning** $p^TAp$ langs retningen.
Her er Hessimatrisen lik $A$; den generelle teorien kommer senere.
Vi har minimert en funksjon ved å bruke den samme løsningen som i $Ax=b$.

</details>

## 6.6 Prosjekt og egenarbeid

<div id="uke6-prosjekt"></div>

### Felles avslutning — samme løsning, nye koordinater?

Tenk på $A=\operatorname{diag}(1,100)$: nivåkurvene er smale ellipser.
Sett $y_1=x_1$ og $y_2=10x_2$. Da blir kvadratleddet

$$x^TAx=x_1^2+100x_2^2=y_1^2+y_2^2.$$

**Gjett:** Kan denne endringen gjøre en iterativ metode raskere? Hvilken
omregning må vi gjøre for å rapportere svaret i de opprinnelige koordinatene?

I [prosjekt 6](project_week6.qmd) undersøker du dette som **prekondisjonering**.
Du får en fungerende CG-metode og bygger PCG. Prosjektet sammenligner ett
system der diagonal skalering hjelper med ett der den ikke endrer vanskeligheten.
CG bruker søkeretninger som er ortogonale i indreproduktet $p^TAq$.
Detaljene, algoritmen og eksperimentene ligger i prosjektet.

### Egenarbeid etter forelesningen

1. Finn GS-iterasjonsmatrisen for $A=\begin{bmatrix}4&1\\1&3\end{bmatrix}$.
   Hva er spektralradiusen? Trenger du kjenne $b$ for å svare?
2. Forklar hvorfor $r=0$ gir riktig løsning når $A$ er invertibel, mens
   «$r$ er liten» krever mer omtanke.
3. Deriver $\phi(x+\alpha p)$ og forklar hvor symmetrien brukes.
4. Finn et eksempel med positiv diagonal som likevel ikke er SPD.
5. Forklar forskjellen mellom en Jacobi-iterasjon og en diagonal preconditioner.

<details class="learning-hint">
<summary>Løsningsforslag og mellomregninger</summary>

1. $u_{k+1}=b_1/4-v_k/4$ og
   $v_{k+1}=b_2/3-b_1/12+v_k/12$. Derfor er
   $T=\begin{bmatrix}0&-1/4\\0&1/12\end{bmatrix}$ og $\rho(T)=1/12$.
   $b$ endrer fikspunktet, men ikke denne iterasjonsmatrisen.
2. $r=-Ae$ gir $e=0$ hvis $r=0$ og $A$ er invertibel. For liten residual
   kan $A^{-1}$ forsterke residualen, som i forsøket i 6.3.
3. Kryssleddene er $\alpha(x^TAp+p^TAx)/2$.
   Symmetri gir $x^TAp=p^TAx$, og summen med $-\alpha b^Tp$ er $-\alpha p^Tr$.
4. $\begin{bmatrix}1&2\\2&1\end{bmatrix}$ har positiv diagonal, men
   $(1,-1)A(1,-1)^T=-2$. Egenverdiene er $3$ og $-1$.
5. Jacobi oppdaterer løsningen gjentatte ganger. Diagonal prekondisjonering
   bruker $M=\operatorname{diag}(A)$ til å endre skaleringen i en annen metode.

</details>

<details class="learning-extension">
<summary>Valgfritt: Cholesky som en annen bruk av SPD</summary>

SPD gir også faktoriseringen $A=LL^T$, med nedre triangulær $L$ og positiv diagonal.
For $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$ setter vi
$L=\begin{bmatrix}a&0\\c&d\end{bmatrix}$. Produktet gir
$a^2=3$, $ac=1$ og $c^2+d^2=2$, altså

$$L=\begin{bmatrix}\sqrt3&0\\1/\sqrt3&\sqrt{5/3}\end{bmatrix}.$$

Løs først $Ly=b$, deretter $L^Tx=y$. Dette er en direkte metode.
Vi trenger ikke Cholesky for ukens fellesløp. For store problemer må både
direkte og iterative metoder vurderes ut fra struktur, minne og ønsket nøyaktighet.

</details>

### Bakgrunn

[De tidligere GS-notatene](https://wiki.math.ntnu.no/_media/imax3011/2025h/iterativemetoderac.pdf)
og [notatene om SPD og CG](https://wiki.math.ntnu.no/_media/imax3011/2025h/iterative2-h24.pdf)
er bakgrunn for denne omarbeidede løypen. Vi bruker konsekvent $r=b-Ax$.

:::
