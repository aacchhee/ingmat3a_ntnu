<!-- Upublisert utkast til uke 9. Ikke inkludert av noen side.
     Flyttet fra uke 6: koordinatminimering, gradient og eksakt linjesøk.
     Kodecellene bruker gs_path, descent_path og bowl_plot fra week6_setup.md;
     en selvstendig oppsettcelle må følge materialet når det tas i bruk. -->

## Løsningen som minimum


### Felles forsøk — følg GS på en flate

Vi vender tilbake til $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$ og $b=(5,5)^T$.
Nedenfor viser kurvene punkter med lik verdi av

$$\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v.$$

Gjett hvor verdien er lavest. Kjør cellen, følg de fire første
koordinatoppdateringene fra null, og noter hvilken koordinat som endres
hver gang. Sammenlign bunnpunktet med løsningen med $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$ og $b=(5,5)^T$.

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
Å sette dette lik null og løse for $x_i$ gir oppdateringen for Gauss–Seidel.
Positiv $a_{ii}$ sikrer et minimum langs koordinaten. SPD sikrer dessuten
et felles entydig globalt minimum og konvergens av GS.

</details>

## Retning og steglengde


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

**Kontroll for hånd:** For $A$ og $b$ med $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$ og $b=(5,5)^T$, fra null er $r_0=(5,5)^T$.
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
