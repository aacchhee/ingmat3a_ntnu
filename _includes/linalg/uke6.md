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

I **Forelesning** kjører vi korte demonstrasjoner og diskuterer det vi ser.
**Gå i dybden** åpner oppgaver, mellomregninger og forklaringer til hvert
forsøk i ett samlet felt. Der følger **Prøv selv**, **Regnegangen** og
**Hva forklarer dette?** etter hverandre, uten flere felt å åpne.

- [Husk oppdateringene](#uke6-gs) og [følg feilen](#uke6-fikspunkt).
- [Skill residual fra feil](#uke6-residual).
- [Se løsningen som et minimum](#uke6-energi) og [prøv CG](#uke6-retning).
- [Undersøk prekondisjonering i prosjektet](#uke6-prosjekt).

Etter uken skal du kunne knytte fikspunktiterasjon til egenverdier,
forklare hva CG bruker konjugerte retninger til, og kontrollere en numerisk
løsning med residualen. I prosjektet undersøker du hvordan skalering kan
endre arbeidsmengden for CG.

## 6.1 Husk Gauss–Seidel

<div id="uke6-gs"></div>

### Demonstrasjon — når bruker vi den nye verdien?

Jacobi og Gauss–Seidel er kjent fra numerikk. Vi henter fram én idé:
**bruk én likning til å korrigere én ukjent mens de andre holdes faste.**
Et forslag trenger ikke oppfylle alle likningene samtidig. Etter en
korreksjon kan én likning stemme, men neste korreksjon kan forstyrre den igjen.
Derfor gjentar vi runden.

For systemet $3u+v=5$, $u+2v=5$ isolerer vi henholdsvis $u$ og $v$.
Dette gir oppdateringene

$$\begin{array}{ll}
\text{Jacobi:}&u_{k+1}=(5-v_k)/3,\quad v_{k+1}=(5-u_k)/2,\\
\text{Gauss–Seidel (GS):}&u_{k+1}=(5-v_k)/3,\quad v_{k+1}=(5-u_{k+1})/2.
\end{array}$$

Jacobi bruker forrige rundes verdier. GS bruker den nye verdien straks den
er tilgjengelig. En runde gjennom alle ukjente kalles et **sveip**.
**Hva forventer dere å se når vi starter fra null?**

```{pyodide-python}
#| label: week6-gs-experiment
A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 5.])
gs = gs_path(A, b, [0., 0.], sweeps=6)[::2]
jacobi = [np.zeros(2)]
for k in range(6):
    u, v = jacobi[-1]
    jacobi.append(np.array([(5-v)/3, (5-u)/2]))
fig, ax = plt.subplots()
for name, values in [('Jacobi', np.array(jacobi)), ('GS', gs)]:
    ax.semilogy(range(len(values)), np.linalg.norm(values-[1.,2.], axis=1),
                'o-', label=name)
ax.set(xlabel='Sveip', ylabel='Avstand til løsningen (1, 2)')
ax.legend(); plt.show()
```

Begge nærmer seg løsningen her. **Ville dere stole på samme oppskrift for
ethvert system?** Neste forsøk endrer bare matrisen og høyresiden.

<details class="reading-step">
<summary>Gå i dybden: gjenskap de første oppdateringene</summary>

**Prøv selv**

1. Isoler $u$ og $v$ i hver sin likning, og gjør ett Jacobi-sveip fra null.
2. Gjør to GS-sveip. Marker hvor en ny verdi brukes.
3. Kontroller at $(1,2)$ løser begge de opprinnelige likningene.

**Regnegangen**

Første likning gir $u=(5-v)/3$, andre gir $v=(5-u)/2$.
Jacobi gir $(5/3,5/2)$ i første sveip. GS gir

$$(0,0)\longmapsto(5/3,5/3)\longmapsto(10/9,35/18).$$

**Hva forklarer dette?**

Generelt er GS-oppdateringen

$$x_i^{(k+1)}=\frac{b_i-\sum_{j<i}a_{ij}x_j^{(k+1)}
-\sum_{j>i}a_{ij}x_j^{(k)}}{a_{ii}},$$

som krever $a_{ii}\ne0$. Koden bruker den likeverdige korreksjonen
$x_i\leftarrow x_i+(b_i-(Ax)_i)/a_{ii}$ og overskriver én koordinat om gangen.
`gs_path` lagrer alle koordinatoppdateringer; `path[::n]` velger hele sveip.

</details>

## 6.2 Følg feilen

<div id="uke6-fikspunkt"></div>

### Demonstrasjon — flere sveip er ikke alltid bedre

I første forsøk hjalp det å gjenta sveipene. Nå beholder vi samme
oppdateringsregel, men endrer koblingen mellom de ukjente. Kan en
korreksjon forstyrre den andre likningen så mye at neste korreksjon blir enda større?

Vi bruker kjent løsning $x_*=(1,2)^T$ og lager $b=Ax_*$ for hver matrise.
Slik vet vi hvor kurvene skal ende, og kan måle feilen direkte.
**Hvilket forløp tror dere vokser?**

```{pyodide-python}
#| label: week6-convergence
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
som algebra for å forklare forskjellen; matrisen som styrer feilen, kan
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
$\rho(T)=\max_i|\lambda_i(T)|$. Iterasjonen konvergerer fra enhver start
akkurat når $\rho(T)<1$. Det er $T$ vi undersøker her.
**Hvorfor er én vellykket kjøring ikke nok til å si at alle starter virker?**

<details class="reading-step">
<summary>Gå i dybden: finn matrisen som oppdaterer feilen</summary>

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
En spesiell start kan mangle feilbidraget langs en voksende egenvektor.
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

### Demonstrasjon — liten rest, stor feil?

Hittil har vi målt avstanden til en løsning vi selv la inn. I et virkelig
problem er løsningen ukjent – ellers hadde vi ikke trengt iterasjonen.
Vi trenger derfor en kontroll som bare bruker $A$, $b$ og forslaget $x$.

**Residualen** $r=b-Ax$ er det som mangler for at forslaget $x$ skal oppfylle
likningene. Feilen $e=x-x_*$ er forskjellen mellom forslaget og den ukjente løsningen.
Vi kjenner $x_*$ i dette forsøket og kan sammenligne begge.
**Tror dere forslaget med minst residual også ligger nærmest løsningen?**

```{pyodide-python}
#| label: week6-residual-experiment
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

### Demonstrasjon — samme løsning, et annet bilde

Vi har nå en enkel metode og en kontroll av svaret. Men GS velger retning
etter koordinataksene, uavhengig av hvordan problemet ser ut. For å finne
bedre retninger trenger vi et geometrisk bilde av hva vi prøver å oppnå.

Vi går tilbake til systemet i 6.1. I figuren tegner vi **nivåkurver**:
kurver som forbinder punkter med samme verdi av funksjonen
$\phi(x)=\tfrac12x^TAx-b^Tx$. **Hvor ser løsningen ut til å ligge?**

```{pyodide-python}
#| label: week6-coordinate-energy
A = np.array([[3.,1.],[1.,2.]])
b = np.array([5.,5.])
fig, ax = plt.subplots()
bowl_plot(ax, A, b, {'GS': gs_path(A, b, [0.,0.], sweeps=3)})
plt.show()
```

Vi bruker **symmetrisk positivt definitte (SPD)** matriser:
$A^T=A$ og $z^TAz>0$ for alle $z\ne0$. For en reell symmetrisk matrise
betyr dette at alle egenverdiene er positive.

Denne forutsetningen gjør grafen til $\phi$ til en skål med én bunn.
Hvorfor er bunnen akkurat løsningen? Med $e=x-x_*$ får vi

$$\phi(x)-\phi(x_*)=\tfrac12e^TAe>0\qquad(x\ne x_*).$$

Alle andre punkter har altså høyere funksjonsverdi. Å løse $Ax=b$ er
derfor det samme som å minimere $\phi$ for disse matrisene.
Vi trenger ikke en ny oppgave; vi har fått et nytt bilde av den samme.

GS finner minimum langs én koordinatretning om gangen, med de andre koordinatene faste. **Kunne vi komme raskere fram
ved å velge andre retninger?** Det prøver vi i neste fane.

<details class="reading-step">
<summary>Gå i dybden: hvorfor er løsningen et minimum?</summary>

**Prøv selv**

1. Utvid $\phi(u,v)$ for matrisen i forsøket.
2. Sett $x=x_*+e$ og vis at $\phi(x)-\phi(x_*)=\tfrac12e^TAe$.
3. Finn en symmetrisk matrise med positiv diagonal som likevel ikke er SPD.

**Regnegangen**

Her er $\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v$.
Symmetrien slår sammen kryssleddene når vi utvider rundt $x_*$:

$$\phi(x_*+e)=\phi(x_*)+e^TAx_*-b^Te+\tfrac12e^TAe.$$

**Hva forklarer dette?**

Siden $Ax_*=b$, forsvinner de to midterste leddene. Positiv definitet gir
$\phi(x)-\phi(x_*)>0$ for alle $x\ne x_*$, så minimumet er entydig.
Med $A=Q\Lambda Q^T$ og $z=Q^Te$ er $e^TAe=\sum_i\lambda_i z_i^2$:
egenverdiene forteller hvor raskt funksjonen stiger i hver egenvektorretning.

Matrisen $\begin{bmatrix}1&2\\2&1\end{bmatrix}$ har positiv diagonal, men
egenverdier $3$ og $-1$. For $z=(1,-1)^T$ er $z^TAz=-2$.
Positiv diagonal alene er derfor ikke nok.

</details>

## 6.5 Konjugert gradient

<div id="uke6-retning"></div>
<div id="uke6-cg"></div>

### Demonstrasjon — velg retninger med hukommelse

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
$\kappa_2(A)=\lambda_{\max}/\lambda_{\min}$ et mål på hvor ulikt matrisen
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
