::: {.panel-tabset}

## 9.0 Oversikt

::: {#uke9-start}
:::

### Hvordan velger vi neste punkt?

I [uke 6](uke6.qmd#uke6-retning) gikk vi nedover en kvadratisk skål langs
negativ gradient og regnet ut den beste steglengden eksakt. Nå spør vi hva
som skjer når vi forlater skålen:

- **Erfaringen fra [uke 8](uke8.qmd#uke8-eksistens):** Et søk kan gi stadig
  bedre punkter uten å ende i et minimum.
- **Denne uken:** Vi ser på søkemetoder for funksjoner som **ikke** er
  kvadratiske.

Hele uken svarer på ett spørsmål:

> **Hvordan velger vi neste punkt, og hvor langt går vi, når vi vet stadig
> mindre om funksjonen?**

::: {#week9-himmelblau-definition .math-exercise-context}

Vi bruker hele uken **Himmelblaus funksjon**

$$f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2.$$

:::

- **Testfunksjonen:** Den er en klassisk testfunksjon for søkemetoder og har
  fire daler.
- **Kontrollpunktet:** I $(3,2)$ er begge parentesene null, så $f(3,2)=0$.
  Siden $f$ er en sum av kvadrater, er dette et globalt minimumspunkt.
- **Metodenes informasjon:** Metodene får ikke vite det; vi bruker punktet
  til å kontrollere dem.

Uken har fire deler. I hver del vet metoden mindre enn i delen før:

| Del | Metoden bruker | Steget velges slik | Hva kan vi love? |
|:--|:--|:--|:--|
| **A. Fast steg** (9.1–9.2) | $f$, $\nabla f$ og krumningen i minimumet | samme $\alpha$ i hvert steg | ? |
| **B. Armijo** (9.3) | $f$ og $\nabla f$ | start med $\alpha=1$, halver til $f$ synker nok | ? |
| **C. Kompassøk** (9.4) | bare $f$ | halver $\Delta$ når ingen nabo er bedre | ? |
| **D. Garantien** (9.5) | | | ? |

Den siste kolonnen fyller vi ut underveis. Del D spør hva metodene kan love
til sammen, og hva funksjonen må oppfylle for at løftet skal holde.

- **Forelesning** viser hovedløpet.
- **Gå i dybden** åpner bevis, mellomregninger og noen sidespor.
- **Oppgaver:** Regneoppgavene står i 9.6 og kodeoppgavene i 9.7, ordnet etter
  de fire delene. På slutten av hver del lenker vi til oppgavene som hører til.

### Kort løype

1. [A. Fast steg i én variabel](#uke9-gradient): fem steglengder, og faktoren $1-\alpha\lambda$ regnet for hånd.
2. [A. Fast steg i to variabler](#uke9-stabilitet): kritisk steg, beste steg og [kondisjonstallet](#uke9-kondisjon).
3. [B. Armijo](#uke9-linjesok): når vi ikke kjenner krumningen.
4. [C. Kompassøk](#uke9-kompass): når vi ikke engang har gradienten.
5. [D. Garantien](#uke9-garanti): et søk som aldri kommer fram, subnivåmengder og koersivitet.
6. [Regneoppgaver](#uke9-oppgaver) og [kodeoppgaver](#uke9-python).

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 2: fikspunktiterasjon](page4.qmd) | Når er et fikspunkt attraktivt, og hva er konvergensfaktoren? |
| [Uke 5: egenverdier](uke5.qmd#uke5-basis) | Hvordan virker en symmetrisk matrise på hver egenretning? |
| [Uke 6: bratteste nedstigning](uke6.qmd#uke6-retning) | Hvorfor går metoden sakte i en smal skål? |
| [Uke 8: kompakthet](uke8.qmd#uke8-kompakt) | Når har en følge av punkter en konvergent delfølge? |
| [Uke 8: tilpasning uten minimum](uke8.qmd#uke8-eksistens) | Hva gjør en søkemetode når minimum ikke finnes? |

### Læringsmål

Etter denne uken skal du kunne

- regne ut ett steg med gradientmetoden med fast steg, og vise for hånd at
  $f(x)=\tfrac12\lambda x^2$ gir $x_{k+1}=(1-\alpha\lambda)x_k$,
- finne det kritiske steget $2/\lambda_{\max}$ og konvergensfaktoren
  $\max_i|1-\alpha\lambda_i|$ fra Hessianen i minimumspunktet,
- utlede det beste faste steget og faktoren $(\kappa-1)/(\kappa+1)$, og
  forklare hvorfor antall steg vokser med kondisjonstallet,
- bruke Armijo-testen til å godta eller halvere et steg,
- utføre kompassøk og forklare, med en figur, hvorfor en mislykket prøverunde
  gir en grense for gradienten,
- forklare hva subnivåmengde og koersivitet garanterer for iteratene, og gi et
  moteksempel.

## 9.1 A. Fast steg i én variabel

::: {#uke9-gradient}
:::

| Del | Metoden bruker | Steget velges slik | Hva kan vi love? |
|:--|:--|:--|:--|
| **A. Fast steg** | $f$, $\nabla f$ og krumningen i minimumet | samme $\alpha$ i hvert steg | ? |

### Retningen kjenner vi

Fra [uke 6](uke6.qmd#uke6-retning) og [støtteløpet i uke 8](uke8.qmd#uke8-gradient)
vet vi at $-\nabla f(z)$ peker brattest nedover. **Gradientmetoden** tar
steget

$$z_{k+1}=z_k-\alpha\,\nabla f(z_k),$$

Her er $\alpha>0$ **steglengden** (egentlig en faktor; selve steget har
lengde $\alpha\|\nabla f(z_k)\|_2$).

For Himmelblaus funksjon setter vi $u=x^2+y-11$ og $w=x+y^2-7$.
Kjerneregelen gir

$$\nabla f(x,y)=\begin{pmatrix}4xu+2w\\2u+4yw\end{pmatrix}.$$

I origo er $u=-11$ og $w=-7$, så
$\nabla f(0,0)=(2\cdot(-7),\ 2\cdot(-11))^T=(-14,-22)^T$. To steglengder gir
svært ulike resultater:

| Steglengde | Nytt punkt | Funksjonsverdi |
|:--|:--|:--|
| $\alpha=1/100$ | $(0.14,\,0.22)$ | synker fra 170 til omtrent 162 |
| $\alpha=1$ | $(14,22)$ | $f$ er 283930 (vi regner den ut i 9.3) |

Retningen er den samme; bare steglengden er forskjellig. **Retningen er altså
ikke problemet. Spørsmålet i del A er hvor langt vi skal gå.**

### Hvor stort kan et fast steg være?

Det enkleste valget er å bruke samme $\alpha$ i hvert steg. Da må vi velge
$\alpha$ før vi starter:

- **For liten:** Vi kommer sakte fram.
- **For stor:** Ett steg kan gå langt forbi dalen, slik vi nettopp så.

I forsøket kjører vi gradientmetoden fra $(0,0)$ med fem faste steglengder.
Cellen gir oss følgende sammenligning:

- **Stopp:** Punktet er nærmere enn $10^{-8}$ fra $(3,2)$, avstanden til
  $(3,2)$ er større enn $10^6$, eller vi har tatt 200 steg.
- **Resultat:** For hver kjøring får vi antall steg og avstanden til $(3,2)$
  til slutt.
- **Fart:** Vi måler hvor mye feilen $e_k=\|z_k-(3,2)\|_2$ ganges med per
  steg, slik vi anslo konvergensfaktoren i uke 2. Når $x$ hopper fra side til
  side, er feilen litt ulik på de to sidene. Derfor tar cellen et snitt over
  de to siste stegene: $\sqrt{e_k/e_{k-2}}$.

Vi har ingen teori ennå; den kommer rett etter forsøket.

Målet er å finne grensen for hvor stort et fast steg kan være, og å se hva som
skjer rett på hver side av den.

### Eksperiment 1 – fem faste steglengder

- **Forutsi først:** Mellom hvilke to av verdiene $0.005$, $0.02$, $0.024$,
  $0.025$ og $0.1$ går grensen for hva som virker?
- Kjør cellen. Se på kolonnen «faktor per steg»: hvilken steglengde gir
  raskest konvergens?
- Bytt en av steglengdene i listen `alphas` til $0.0243$ eller $0.0244$, og undersøk hvor
  grensen ligger.

```{pyodide-python}
#| label: week9-fixed-step-sweep
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-grad9-7f3a74d2, ide-uke9-np-6f11581d, ide-uke9-plot-x-paths-c37dbe7b
# Samme start og samme metode; bare den faste steglengden endres.
z_star = np.array([3., 2.])
xs_per_alpha = {}
print(f'{"α":>6} {"steg":>5} {"avstand til (3, 2)":>19} {"faktor per steg":>16}')
alphas = [0.005, 0.02, 0.024, 0.025, 0.1]
for alpha in alphas:
    z = np.array([0., 0.])
    errors, xs = [np.linalg.norm(z - z_star)], [z[0]]
    for k in range(1, 201):
        z = z - alpha*grad9(z)
        errors.append(np.linalg.norm(z - z_star)); xs.append(z[0])
        if errors[-1] < 1e-8 or errors[-1] > 1e6:
            break
    xs_per_alpha[alpha] = xs
    if errors[-1] > 1e6:
        print(f'{alpha:>6} {k:>5}   eksploderer: avstand > 10^6')
    else:
        factor = np.sqrt(errors[-1]/errors[-3])           # snitt over de to siste stegene
        cycle = f'   x veksler: {xs[-2]:.3f}, {xs[-1]:.3f}' if abs(factor - 1) < 5e-4 else ''
        print(f'{alpha:>6} {k:>5} {errors[-1]:>19.1e} {factor:>16.4f}{cycle}')

plot_x_paths({a: xs_per_alpha[a] for a in alphas[1:4]})
```

**Hva viser forsøket?**

- Med $\alpha=0.005$ og $0.02$ når metoden $(3,2)$, etter 140 og 39 steg.
  Feilen ganges med omtrent $0.8714$ og $0.6457$ i hvert steg.
- Med $\alpha=0.024$ er den ikke helt framme etter 200 steg, og $x$ hopper
  fra side til side av $3$ (figuren). Feilen ganges med omtrent $0.9748$.
- Med $\alpha=0.025$ **blir den aldri ferdig**: $x$ veksler mellom $2.683$
  og $3.235$ så lenge vi orker å regne. Faktoren per steg er $1.0000$; feilen
  krymper ikke lenger, så cellen skriver også ut de to $x$-verdiene.
- Med $\alpha=0.1$ eksploderer den: i steg 5 er avstanden større enn $10^6$.

Grensen ligger altså mellom $0.024$ og $0.025$, og faktorene i siste kolonne
ser tilfeldige ut. Det er de ikke. Vi forklarer dem først for en funksjon av
én variabel, der alt kan regnes for hånd.

### Fast steg på en parabel, regnet for hånd

Nær et minimum ligner en glatt funksjon av én variabel på en parabel. Vi
flytter minimumet til $x=0$ og ser på

$$f(x)=\tfrac12\lambda x^2,\qquad\lambda>0.$$

Her er $f''(x)=\lambda$: tallet $\lambda$ er **krumningen**. Den deriverte er
$f'(x)=\lambda x$. Ett steg med gradientmetoden blir

$$
\begin{aligned}
x_{k+1}&=x_k-\alpha f'(x_k)\\
&=x_k-\alpha\lambda x_k\\
&=(1-\alpha\lambda)\,x_k.
\end{aligned}
$$

**Hvert steg ganger punktet med samme tall $1-\alpha\lambda$.** Etter $k$ steg
er derfor $x_k=(1-\alpha\lambda)^k x_0$. Siden minimumet er $0$, er $x_k$ også
feilen. Alt vi så i eksperiment 1, kan leses av denne ene linjen:

- **Konvergens eller ikke.** $x_k\to0$ nøyaktig når $|1-\alpha\lambda|<1$. Vi
  løser ulikheten:
  $$
  -1<1-\alpha\lambda<1
  \quad\Longleftrightarrow\quad
  -2<-\alpha\lambda<0
  \quad\Longleftrightarrow\quad
  0<\alpha<\frac{2}{\lambda}.
  $$
  Når $\alpha>2/\lambda$, er $|1-\alpha\lambda|>1$, og feilen vokser i hvert
  steg.
- **Farten.** Feilen ganges med $|1-\alpha\lambda|$ i hvert steg. Det er
  konvergensfaktoren.
- **Hopping.** Når $1/\lambda<\alpha<2/\lambda$, er $1-\alpha\lambda$
  negativ. Da skifter $x_k$ fortegn i hvert steg og hopper fra side til side
  av minimumet.

Med tall: for $\lambda=10$ er grensen $2/\lambda=0.2$.

| $\alpha$ | $1-10\alpha$ | hva skjer |
|:--|--:|:--|
| $0.05$ | $0.5$ | feilen halveres i hvert steg, samme side |
| $0.1$ | $0$ | minimumet nås i ett steg |
| $0.15$ | $-0.5$ | feilen halveres, men skifter fortegn |
| $0.25$ | $-1.5$ | feilen vokser og skifter fortegn |

I én variabel finnes altså et perfekt steg, $\alpha=1/\lambda$, som gir
faktor $0$. I neste fane ser vi at dette ikke går med to krumninger samtidig.

For en vilkårlig glatt $f$ med minimum i $r$ er krumningen $\lambda=f''(r)$.
Sammenhengen med helningsregelen fra [uke 2](page4.qmd#uke2-helning) er:

- **Fikspunktiterasjonen:** Gradientmetoden er $g(x)=x-\alpha f'(x)$.
- **Faktoren:** $g'(r)=1-\alpha f''(r)$ er akkurat faktoren over.
- **Attraktivt fikspunkt:** Når $|g'(r)|<1$, er fikspunktet attraktivt.

**Dette tar vi med oss.**

- Et fast steg ganger feilen med $1-\alpha\lambda$.
- Det virker bare når $\alpha<2/\lambda$, og en negativ faktor gir hopping.

I to variabler er det to krumninger. Neste fane finner ut hvilken som bestemmer.

## 9.2 A. Fast steg i to variabler

::: {#uke9-stabilitet}
:::

### Først en diagonal skål

Vi tar det enkleste tilfellet med to variabler:

$$f(x,y)=\tfrac12\lambda_1x^2+\tfrac12\lambda_2y^2,\qquad
\nabla f(x,y)=\begin{pmatrix}\lambda_1x\\\lambda_2y\end{pmatrix},\qquad
H=\begin{bmatrix}\lambda_1&0\\0&\lambda_2\end{bmatrix}.$$

Ett steg med gradientmetoden er

$$\begin{pmatrix}x_{k+1}\\y_{k+1}\end{pmatrix}
=\begin{pmatrix}x_k\\y_k\end{pmatrix}-\alpha\begin{pmatrix}\lambda_1x_k\\\lambda_2y_k\end{pmatrix}
=\begin{pmatrix}(1-\alpha\lambda_1)\,x_k\\(1-\alpha\lambda_2)\,y_k\end{pmatrix}.$$

**Hver koordinat oppfører seg som parabelen i 9.1, med sin egen krumning.**
Med $\lambda_1=1$ og $\lambda_2=10$ er $y$-koordinaten nettopp parabelen fra
tabellen i 9.1:

- **Ved $\alpha=0.25$:** $y$-faktoren er $-1.5$, og $y$ eksploderer, selv om
  $x$-faktoren $1-\alpha=0.75$ er fin.
- **Ved $\alpha=0.05$ og $0.15$:** Begge krymper, men $x$ (faktor $0.95$ og
  $0.85$) er tregest.

Dette gir to regler:

- **Grensen:** Begge koordinatene må krympe, så **den største krumningen
  bestemmer grensen**: $\alpha<2/\lambda_2=0.2$.
- **Farten:** Feilen som helhet krymper ikke raskere enn den tregeste
  koordinaten. Konvergensfaktoren er derfor **den største** av de to
  faktorene i absoluttverdi.

Generelt, med krumningene $\lambda_1\le\lambda_2$:

$$\boxed{\alpha_{\text{krit}}=\frac{2}{\lambda_{\max}},\qquad
S=\max_i|1-\alpha\lambda_i|.}$$

### Hessianen i et minimum

Nær et minimumspunkt $z_*$ ligner $f$ på en skål med Hessianen $H_*=H(z_*)$
fra [uke 8.3](uke8.qmd#uke8-hessian). Vi finner krumningene slik:

1. **Krumning langs en retning:** I uke 8.3 så vi at krumningen langs en
   enhetsretning $p$ er $p^TH_*p$.
2. **Velg egenretningene:** Hessianen er sjelden diagonal, men den er
   symmetrisk. Fra [uke 5](uke5.qmd#uke5-basis) har den ortogonale
   egenvektorer $v_1,v_2$ med egenverdier $\lambda_1\le\lambda_2$. Langs $v_i$
   er krumningen $v_i^TH_*v_i=\lambda_i$.
3. **Bytt akser:** Med egenvektorene som nye akser blir skålen diagonal, med
   egenverdiene som krumninger. Derfor gjelder de samme to formlene, med
   $\lambda_i$ lik egenverdiene til $H_*$.

**Når gjelder konklusjonen?** Når $H_*$ er positiv definitt (alle
$\lambda_i>0$, som i $(3,2)$), konvergerer metoden lokalt nøyaktig når
$\alpha<2/\lambda_{\max}$.

::: {.reading-step title="Gå i dybden: hele regningen med en vilkårlig symmetrisk Hessian"}

**Feilen ganges med en matrise.** La $e_k=z_k-z_*$. Bruk Taylor på hver
komponent av gradienten. For $\partial f/\partial x$ gir det

$$\frac{\partial f}{\partial x}(z_k)=\frac{\partial f}{\partial x}(z_*)
+\Bigl(\frac{\partial^2f}{\partial x^2},\ \frac{\partial^2f}{\partial x\,\partial y}\Bigr)\Big|_{z_*}e_k
+\text{rest},$$

Her er resten høyst en konstant ganger $\|e_k\|_2^2$. Nå samler vi leddene:

- Det samme gjelder $\partial f/\partial y$.
- De to radene av andrederiverte er radene i $H_*$, og $\nabla f(z_*)=0$.
- Altså er $\nabla f(z_k)=H_*e_k+O(\|e_k\|_2^2)$.

Vi setter inn i $e_{k+1}=e_k-\alpha\nabla f(z_k)$:

$$e_{k+1}=(I-\alpha H_*)\,e_k+O(\|e_k\|_2^2).$$

Dette er en iterasjonsmatrise, som $e_{k+1}=Te_k$ for Gauss–Seidel i
[uke 6](uke6.qmd#uke6-fikspunkt).

**Egenvektorene gjør den diagonal.** Skriv feilen i egenvektorbasisen,
$e_k=c_1v_1+c_2v_2$. Fordi $H_*v_i=\lambda_iv_i$, er

$$(I-\alpha H_*)e_k=c_1(v_1-\alpha\lambda_1v_1)+c_2(v_2-\alpha\lambda_2v_2)
=(1-\alpha\lambda_1)\,c_1v_1+(1-\alpha\lambda_2)\,c_2v_2.$$

Koordinatene $c_1,c_2$ ganges altså med $1-\alpha\lambda_1$ og
$1-\alpha\lambda_2$, akkurat som $x$ og $y$ i den diagonale skålen.

**Normen.** Fordi $v_1,v_2$ er ortonormale, er $\|e_k\|_2^2=c_1^2+c_2^2$. Med
$S=\max_i|1-\alpha\lambda_i|$ blir

$$\|(I-\alpha H_*)e_k\|_2^2=(1-\alpha\lambda_1)^2c_1^2+(1-\alpha\lambda_2)^2c_2^2
\le S^2(c_1^2+c_2^2)=S^2\|e_k\|_2^2.$$

- **Hovedleddet:** Det krymper med minst faktoren $S$ i hvert steg, og
  nøyaktig med $S$ i den egenretningen som gir den største faktoren.
- **Restleddet:** Når feilen er liten, er restleddet mye mindre enn
  hovedleddet.
- **Rekkevidden:** Konklusjonene gjelder derfor **lokalt**, som
  helningsregelen i uke 2. Langt fra $z_*$ sier de ingenting.

:::

::: {.callout-note title="Håndeksempel: det kritiske steget i (3,2)"}

**Utgangspunkt.** Vi deriverer gradientens komponenter én gang til med
produktregelen:

- For eksempel er
  $f_{xx}=\partial_x(4xu+2w)=4u+4x\cdot2x+2=12x^2+4y-42$.
- De andre leddene regnes på samme måte.

Hessianen til Himmelblaus funksjon er

$$H(x,y)=\begin{bmatrix}12x^2+4y-42&4x+4y\\4x+4y&12y^2+4x-26\end{bmatrix}.$$

**Prøv selv.** Regn ut $H(3,2)$, egenverdiene og $\alpha_{\text{krit}}$.
Hvilken av $\alpha=0.024$ og $\alpha=0.025$ gir en faktor under $-1$?

**Regnegangen.** Innsetting gir

$$H(3,2)=\begin{bmatrix}108+8-42&12+8\\12+8&48+12-26\end{bmatrix}
=\begin{bmatrix}74&20\\20&34\end{bmatrix}.$$

Den karakteristiske likningen er

$$(74-\lambda)(34-\lambda)-20^2=\lambda^2-108\lambda+2516-400=\lambda^2-108\lambda+2116=0,$$

så

$$\lambda=\frac{108\pm\sqrt{108^2-4\cdot2116}}{2}=54\pm\sqrt{800},\qquad
\lambda_1\approx25.72,\quad\lambda_2\approx82.28.$$

Dermed er $\alpha_{\text{krit}}=2/82.28\approx0.0243$. Faktorene blir

| $\alpha$ | $1-\alpha\lambda_1$ | $1-\alpha\lambda_2$ |
|:--|--:|--:|
| $0.024$ | $0.383$ | $-0.975$ |
| $0.025$ | $0.357$ | $-1.057$ |

- **Ved $\alpha=0.024$:** Komponenten langs $v_2$ krymper og skifter fortegn
  i hvert steg: det er hoppingen fra side til side.
- **Ved $\alpha=0.025$:** Komponenten vokser og skifter fortegn. Den vokser
  likevel ikke for alltid: lenger ut er ikke $f$ kvadratisk, og iteratene
  låses i en **2-syklus**, som i uke 2.

**Dette tar vi med oss.** $\alpha_{\text{krit}}=2/\lambda_{\max}(H_*)$ skiller
nøyaktig mellom de to steglengdene i eksperiment 1.

:::

### Stemmer faktorene, og hvilket steg er best?

Håndeksemplet forklarte grensen. Men eksperiment 1 målte også en faktor for
hver steglengde, og teorien sier at den skal være $S=\max_i|1-\alpha\lambda_i|$
med egenverdiene til $H(3,2)$. Det kan vi kontrollere.

Cellen gir to måter å kontrollere teorien på:

- **Tall:** Den regner ut egenverdiene og den forutsagte $S$ for de fire
  steglengdene som ikke eksploderte.
- **Figur:** Den tegner $|1-\alpha\lambda_1|$ og $|1-\alpha\lambda_2|$ som
  funksjoner av $\alpha$, sammen med $S(\alpha)$, som er den største av dem.
  Punktene er steglengdene fra eksperiment 1.

Målet er å kontrollere de målte faktorene, og å lese av figuren hvilken fast
$\alpha$ som gir minst $S$.

### Eksperiment 2 – forutsagt faktor og det beste steget

- Kjør cellen og sammenlign med kolonnen «faktor per steg» i eksperiment 1.
- Finn bunnen av den svarte kurven. Hvilken egenverdi bestemmer $S$ til
  venstre for bunnen, og hvilken til høyre?
- Bytt $(3,2)$ med et annet minimumspunkt, for eksempel `minima[2]`, og
  undersøk hvordan figuren endrer seg.

```{pyodide-python}
#| label: week9-best-step-figure
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-hess9-01410542, ide-uke9-np-6f11581d, ide-uke9-plot-step-factors-91af84e4
lam = np.linalg.eigvalsh(hess9([3., 2.]))      # stigende: λ1 ≤ λ2
print('egenverdier til H(3, 2):', lam.round(2), f'  kritisk steg 2/λ2 = {2/lam[1]:.4f}')
for alpha in [0.005, 0.02, 0.024, 0.025]:
    print(f'α = {alpha:5}: forutsagt S = max|1 - αλ| = {max(abs(1 - alpha*lam)):.4f}')
plot_step_factors(lam, marked=[0.005, 0.02, 0.024, 0.025])
```

**Hva viser forsøket?**

- **Samsvar:** For $\alpha=0.005$, $0.02$ og $0.024$ er de forutsagte
  faktorene $0.8714$, $0.6457$ og $0.9748$, de samme som de målte med fire
  desimaler.
- **For stort steg:** For $\alpha=0.025$ er $S=1.0571>1$, og metoden
  konvergerer ikke.
- **Beste steg:** Kurven $S(\alpha)$ har form som en V. Til venstre er det
  den minste egenverdien som bestemmer, til høyre den største. Bunnen er
  det beste faste steget.

**Egenverdiene til Hessianen forutsier både grensen og farten.**

::: {#uke9-kondisjon}
:::

### Det beste faste steget, regnet ut

Vi leser de to sidene av V-en hver for seg:

| Side av bunnen | Største faktor | Når $\alpha$ vokser |
|:--|:--|:--|
| Til venstre | $1-\alpha\lambda_{\min}$ er positiv, så $S=1-\alpha\lambda_{\min}$ | $S$ **avtar** |
| Til høyre | $1-\alpha\lambda_{\max}$ er negativ og størst i absoluttverdi, så $S=\alpha\lambda_{\max}-1$ | $S$ **vokser** |

Bunnen ligger der de to er like store:

$$
\begin{aligned}
1-\alpha\lambda_{\min}&=\alpha\lambda_{\max}-1\\
2&=\alpha(\lambda_{\min}+\lambda_{\max})\\
\alpha_{\text{best}}&=\frac{2}{\lambda_{\min}+\lambda_{\max}}.
\end{aligned}
$$

Faktoren der finner vi ved å sette inn i den venstre siden:

$$
\begin{aligned}
S_{\text{best}}&=1-\frac{2\lambda_{\min}}{\lambda_{\min}+\lambda_{\max}}
=\frac{\lambda_{\min}+\lambda_{\max}-2\lambda_{\min}}{\lambda_{\min}+\lambda_{\max}}
=\frac{\lambda_{\max}-\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}.
\end{aligned}
$$

Del teller og nevner på $\lambda_{\min}$. Med kondisjonstallet
$\kappa=\lambda_{\max}/\lambda_{\min}$ fra [uke 6](uke6.qmd#uke6-residual) blir

$$\boxed{S_{\text{best}}=\frac{\kappa-1}{\kappa+1}.}$$

For $H(3,2)$ er $\kappa=82.28/25.72\approx3.2$,
$\alpha_{\text{best}}=2/108\approx0.0185$ og $S_{\text{best}}\approx0.52$.

**Hvor mange steg?** Vi regner i to trinn:

1. **Kravet:** For å redusere feilen med en faktor $10^{-8}$ trenger vi
   $S^k\le10^{-8}$, altså $k\ge\ln(10^{-8})/\ln S$.
2. **Stor $\kappa$:** Skriv $S_{\text{best}}=1-2/(\kappa+1)$. Når $\kappa$ er
   stor, er $\ln(1-t)\approx-t$ for liten $t$, så
   $\ln S_{\text{best}}\approx-2/\kappa$ og

$$k\approx\frac{\ln(10^{8})}{2/\kappa}=\frac{18.42}{2}\,\kappa\approx9.2\,\kappa.$$

**Antall steg vokser proporsjonalt med kondisjonstallet.**

::: {.reading-step title="Gå i dybden: hvorfor er balansepunktet best, også med flere egenverdier?"}

**Hvorfor balanse?** $S$ er den største av to funksjoner:

- $\alpha\mapsto|1-\alpha\lambda_{\min}|$ avtar på
  $0<\alpha<2/(\lambda_{\min}+\lambda_{\max})$.
- $\alpha\mapsto|1-\alpha\lambda_{\max}|$ vokser etter sitt nullpunkt
  $1/\lambda_{\max}$.

Tar vi $\alpha$ mindre enn balansepunktet, blir den første større; tar vi den
større, blir den andre større. Minimum av maksimum ligger derfor der de er like.

**Hva med flere egenverdier?**

1. Hver $\lambda_i$ ligger mellom $\lambda_{\min}$ og $\lambda_{\max}$, så
   $1-\alpha\lambda_i$ ligger mellom $1-\alpha\lambda_{\max}$ og
   $1-\alpha\lambda_{\min}$.
2. Faktoren $|1-\alpha\lambda_i|$ er derfor aldri større enn den største av
   de to ytterste, og svaret endres ikke.

:::

For $H(3,2)$ er $\kappa$ bare $3.2$, så eksperiment 1 gikk raskt. På smale
skåler som i [uke 6](uke6.qmd#uke6-retning) ser vi tydeligere hva regelen betyr:

- **Samme dreining og løsning:** Med $\kappa=10$, $100$ og $1000$ gir regelen
  $92$, $922$ og $9211$ steg.
- **Målt antall:** Gradientmetoden med det beste faste steget bruker nøyaktig
  så mange (fordypningen under kjører forsøket). **Ti ganger større
  kondisjonstall gir ti ganger så mange steg.**
- **Tilbake til uke 6:** Bratteste nedstigning med eksakt linjesøk har i
  verste fall den samme faktoren; det er derfor den gikk i sikksakk i den
  smale skålen.

::: {.reading-step title="Gå i dybden: lovene på de smale skålene fra uke 6"}

Vi bruker $\phi(x)=\tfrac12x^TAx-b^Tx$ med samme dreining og løsning
$x_*=(1,-1.1)^T$ som i uke 6, men med egenverdier $1$ og $1/\kappa$.

- **Modellen:** Hessianen er $A$ overalt, så teorien gjelder eksakt.
- **Sammenligningen:** Cellen kjører det beste faste steget til den relative
  feilen er under $10^{-8}$, og sammenligner med det minste hele $k$ som gir
  $S_{\text{best}}^k\le10^{-8}$.
- **Prøv videre:** Prøv også et litt mindre steg, for eksempel `0.9*alpha`,
  og se hvor mye tregere det går.

```{pyodide-python}
#| label: week9-condition
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-np-6f11581d, ide-uke9-plot-errors-57115135
Q = np.array([[1., -1.], [1., 1.]])/np.sqrt(2)     # samme dreining som i uke 6
x_star = np.array([1., -1.1])
curves = {}
for kappa in [10, 100, 1000]:
    A = Q @ np.diag([1., 1/kappa]) @ Q.T
    b = A @ x_star
    alpha, S = 2/(1 + 1/kappa), (kappa - 1)/(kappa + 1)   # beste steg og S_best
    x, errors = np.zeros(2), [1.]                          # relativ feil, start i origo
    while errors[-1] > 1e-8:
        x = x - alpha*(A @ x - b)
        errors.append(np.linalg.norm(x - x_star)/np.linalg.norm(x_star))
    print(f'κ = {kappa:5}: {len(errors) - 1:5} steg, forutsagt {np.ceil(np.log(1e-8)/np.log(S)):.0f}')
    curves[f'κ = {kappa}'] = errors
plot_errors(curves, ylabel='relativ feil', xlog=True)
```

Gradientmetoden bruker 92, 922 og 9211 steg, nøyaktig som forutsagt.

:::

**Dette tar vi med oss fra del A.**

- **For å virke:** Et fast steg krever $\alpha<2/\lambda_{\max}$.
- **Beste fart:** Det gir i beste fall faktoren $(\kappa-1)/(\kappa+1)$.
- **Hovedproblemet:** Begge tallene kommer fra egenverdiene til $H_*$,
  **Hessianen i et minimum vi ennå ikke har funnet**.

Det problemet løser del B.

| Del | Metoden bruker | Steget velges slik | Hva kan vi love? |
|:--|:--|:--|:--|
| **A. Fast steg** | $f$, $\nabla f$ og krumningen i minimumet | samme $\alpha$ i hvert steg | nær minimumet: feilen ganges med $\max_i\lvert1-\alpha\lambda_i\rvert$ når $\alpha<2/\lambda_{\max}$ |

**Øv på del A:** [regneoppgavene A](#uke9-oppg-a) og [kodeoppgave A](#uke9-py-a).

## 9.3 B. Armijo

::: {#uke9-linjesok}
:::

| Del | Metoden bruker | Steget velges slik | Hva kan vi love? |
|:--|:--|:--|:--|
| **B. Armijo** | $f$ og $\nabla f$ | start med $\alpha=1$, halver til $f$ synker nok | ? |

### Vi kjenner ikke krumningen

Del A forutsatte at vi kjenner $\lambda_{\max}$ i minimumet. Det gjør vi ikke:

- **Ulike daler:** Himmelblaus funksjon har fire minimumspunkter, med
  kritiske steg fra $0.0149$ til $0.0248$ (fordypningen under regner dem ut).
  Et fast steg som er trygt i én dal, kan være for stort i en annen.
- **Langt fra minimumet:** Hessianen er en helt annen.
- **Det vi kan beregne her og nå:** Funksjonsverdier og gradienten i punktet
  vi står i.

Vi trenger derfor en regel som velger steget **underveis**. Ideen er enkel:
prøv et stort steg, og halver det til funksjonen synker nok.

::: {.reading-step title="Gå i dybden: det kritiske steget i de fire minimumene"}

Cellen regner ut egenverdiene til Hessianen i hvert av de fire
minimumspunktene og det kritiske steget $2/\lambda_{\max}$.

```{pyodide-python}
#| label: week9-critical-steps
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-hess9-01410542, ide-uke9-minima-cb2037cb, ide-uke9-np-6f11581d
for m in minima:                     # de fire minimumspunktene fra oppsettet
    lam = np.linalg.eigvalsh(hess9(m))
    print(f'minimum ({m[0]:9.6f}, {m[1]:9.6f}): λ = {lam.round(2)}, '
          f'kritisk steg = {2/lam[1]:.4f}')
```

De kritiske stegene er $0.0243$, $0.0248$, $0.0149$ og $0.0190$. Et fast steg
på $0.02$ virker i $(3,2)$, men ikke nær minimumet i $(-3.78,\,-3.28)$.

:::

### Armijo-testen

Et **linjesøk** holder punktet $z$ og retningen $p=-\nabla f(z)$ fast og
prøver steglengder $\alpha>0$. Langs linjen ser vi på funksjonen av én
variabel

$$h(\alpha)=f(z+\alpha p).$$

- **Starten:** Linjen starter i $h(0)=f(z)$ med helningen
  $h'(0)=\nabla f(z)^Tp=-\|\nabla f(z)\|_2^2<0$.
- **Løftet fra tangenten:** Tangentlinjen $h(0)+\alpha h'(0)$ er den nedgangen
  starthelningen lover.
- **Kravet:** **Armijo-testen** godtar $\alpha$ når funksjonen har sunket med
  minst en liten brøkdel ($10^{-4}$) av denne nedgangen:

$$f(z+\alpha p)\le f(z)+10^{-4}\,\alpha\,\nabla f(z)^Tp.$$

Testen krever altså en reell nedgang, men ikke det beste steget.
**Armijo-søket** bruker testen slik:

1. Start med $\alpha=1$.
2. Halver til testen er oppfylt, og flytt til det godtatte punktet.
3. Beregn en ny gradient og start et nytt linjesøk.

::: {.callout-note title="Håndeksempel: det første linjesøket fra origo"}

**Utgangspunkt.** I $(0,0)$ er $f=170$ og $\nabla f(0,0)=(-14,-22)^T$ (fra 9.1), så
$p=(14,22)^T$ og

$$\nabla f^Tp=(-14)\cdot14+(-22)\cdot22=-196-484=-680.$$

**Prøv selv.** Regn ut punktet $z+\alpha p$, verdien der og høyresiden i
Armijo-testen for $\alpha=1/8$.

**Regnegangen.** Punktet er $z+\alpha p=(14\alpha,\,22\alpha)$, og
høyresiden er $170+10^{-4}\cdot\alpha\cdot(-680)=170-0.068\,\alpha$. For hver
prøve regner vi ut $u=x^2+y-11$, $w=x+y^2-7$ og $f=u^2+w^2$:

| $\alpha$ | punkt | $u$ | $w$ | $f=u^2+w^2$ | grense | resultat |
|:--|:--|--:|--:|--:|--:|:--|
| $1$ | $(14,\,22)$ | $207$ | $491$ | $283930$ | $169.932$ | avvis |
| $1/2$ | $(7,\,11)$ | $49$ | $121$ | $17042$ | $169.966$ | avvis |
| $1/4$ | $(3.5,\,5.5)$ | $6.75$ | $26.75$ | $761.125$ | $169.983$ | avvis |
| $1/8$ | $(1.75,\,2.75)$ | $-5.1875$ | $2.3125$ | $32.2578125$ | $169.9915$ | godta |

Siste rad kan kontrolleres ledd for ledd:

- $u=1.75^2+2.75-11=-5.1875$ og $w=1.75+2.75^2-7=2.3125$.
- Dermed er $f=26.91015625+5.34765625=32.2578125$.
- Søket godtar $\alpha=1/8$ og flytter til $(1.75,\,2.75)$.

**Dette tar vi med oss.**

- **Retningen:** Starthelningen gir retningen, men bare den faktiske
  funksjonsverdien kan godkjenne steget.
- **Lengden:** Det godtatte steget $1/8$ er fem ganger større enn det kritiske
  steget $0.0243$ fra del A. Det er trygt fordi testen har sett at $f$ faktisk
  sank.

:::

::: {.reading-step title="Gå i dybden: hvorfor halveringen til slutt finner et steg"}

Vi setter opp funksjonen langs linjen og ser på små steg:

- Sett $h(\alpha)=f(z+\alpha p)$ med $p=-\nabla f(z)$.
- Da er $h'(0)=\nabla f(z)^Tp=-\|\nabla f(z)\|_2^2<0$ når gradienten ikke er null.
- For en deriverbar funksjon er $h(\alpha)=h(0)+\alpha h'(0)+o(\alpha)$, der
  restleddet delt på $\alpha$ går mot null.

Vi skriver testen som

$$\frac{h(\alpha)-h(0)}{\alpha}\le10^{-4}h'(0).$$

1. Venstresiden går mot $h'(0)$ når $\alpha\to0$.
2. Fordi $h'(0)<0$, er $h'(0)<10^{-4}h'(0)$.
3. Derfor er testen oppfylt for alle små nok positive $\alpha$, og halveringen
   stopper etter endelig mange forsøk.

**Forutsetningen:** Uten en nedgangsretning ($\nabla f(z)^Tp<0$) gjelder ikke
argumentet. En stor fast steglengde har ingen tilsvarende garanti.

:::

### Er Armijo bedre enn et fast steg?

Nå har vi to måter å velge steget på. Vi sammenligner dem fra $(0,0)$:

| Valg | Hva vi vet fra del A |
|:--|:--|
| Godt fast steg, $\alpha=0.02$ | krever at vi kjenner $\lambda_{\max}$ i minimumet |
| Dårlig fast steg, $\alpha=0.1$ | eksploderte i eksperiment 1 |
| Armijo-søket | trenger ingen av delene |

Cellen kjører alle tre med følgende oppsett:

- **Faste steg:** De får 40 steg. Funksjonen `fixed_steps` i oppsettet er
  løkken fra eksperiment 1.
- **Armijo:** Løkken står i cellen og stopper når $\|\nabla f\|_2<10^{-6}$.
- **Sammenligning:** Tabellen viser antall steg, siste verdi og
  gradientnormen; figuren viser punktene på nivåkurvene og $f$ steg for steg.

Målet er å se om en metode uten kjennskap til krumningen kan konkurrere med
det gode faste steget, og om den unngår det dårlige.

### Eksperiment 3 – fast steg eller halvering?

- Kjør cellen. Hvor mange steg bruker Armijo-søket?
- Se på kartet: hvor stort er det første Armijo-steget sammenlignet med de
  faste stegene?
- Bytt faktoren `1e-4` med `0.5`, og undersøk om søket blir raskere eller
  tregere.

```{pyodide-python}
#| label: week9-gradient-steps
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-f9-0f604562, ide-uke9-fixed-steps-b00fa515, ide-uke9-grad9-7f3a74d2, ide-uke9-np-6f11581d, ide-uke9-plot-runs-cbf815ae
def armijo_steps(z, n=60):
    values, points = [f9(z)], [z.copy()]
    for k in range(n):
        g = grad9(z)
        if np.linalg.norm(g) < 1e-6:
            break
        alpha = 1.
        while f9(z - alpha*g) > f9(z) - 1e-4*alpha*(g @ g):   # Armijo-testen med p = -g
            alpha /= 2
        z = z - alpha*g
        values.append(f9(z)); points.append(z.copy())
    return z, np.array(values), np.array(points)

runs = {'fast α=0.02': fixed_steps(0.02), 'fast α=0.1': fixed_steps(0.1),
        'Armijo': armijo_steps(np.array([0., 0.]))}
for name, (end, values, points) in runs.items():
    print(f'{name:<12} {len(values)-1:>3} steg, siste f = {values[-1]:9.3g}, '
          f'|∇f| = {np.linalg.norm(grad9(end)):.3g}')
plot_runs(runs, on_map=['fast α=0.02', 'Armijo'])
```

**Hva viser forsøket?**

- **Godt fast steg:** Med $\alpha=0.02$ er verdien omtrent $10^{-15}$ etter
  40 steg.
- **Dårlig fast steg:** Med $\alpha=0.1$ eksploderer den, og kjøringen stanser
  etter fire godtatte steg.
- **Armijo:** Søket når $\|\nabla f\|_2<10^{-6}$ etter 25 steg, omtrent like
  raskt som det gode faste steget. Det trenger ikke å kjenne
  $\alpha_{\text{krit}}$: det første steget fra origo var $1/8$, langt over
  $0.0243$, men det ble godkjent fordi det faktisk senket $f$.

Det viktigste er at **Armijo-søket alltid senker $f$**:
$f(z_{k+1})<f(z_k)$ i hvert steg.

::: {.reading-step title="Gå i dybden: det beste steget langs en linje, eller et godt nok steg?"}

**Et lite eksempel.** Ta $q(s)=(s-2)^2$, start i $s_0=0$ og gå i retning $p=1$.
Langs linjen er verdien $q(\alpha)=(\alpha-2)^2$:

- **Beste steg:** $\alpha=2$ gir $q=0$.
- **Godt nok for Armijo:** Søket godtar allerede $\alpha=1$, fordi $q(0)=4$,
  $q'(0)=-4$ og $q(1)=1\le4+10^{-4}\cdot1\cdot(-4)=3.9996$.

**Et numerisk søk langs én linje.** Med fast $z$ og $p$ kan vi minimere
funksjonen $h(\alpha)=f(z+\alpha p)$ av én variabel. Her søker
`minimize_scalar` i intervallet $0\le\alpha\le0.2$ fra origo langs negativ
gradient:

```{pyodide-python}
#| label: week9-scalar-line-search
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-f9-0f604562, ide-uke9-grad9-7f3a74d2, ide-uke9-np-6f11581d
from scipy.optimize import minimize_scalar   # SciPy lastes først her
start = np.array([0., 0.])
direction = -grad9(start)
line = minimize_scalar(lambda alpha: f9(start + alpha*direction),
                       bounds=(0., .2), method='bounded',
                       options={'xatol': 1e-10})
line_point = start + line.x*direction
line_gradient = grad9(line_point)
print(f'steglengde α:            {line.x:.6f}')
print(f'punkt (x, y):           ({line_point[0]:.4f}, {line_point[1]:.4f})')
print(f'funksjonsverdi:          {f9(line_point):.3f}')
print(f'derivert langs linjen:   {line_gradient @ direction:.1e}')
print(f'gradientnorm i planet:   {np.linalg.norm(line_gradient):.1f}')
```

- **Valgt steg:** Søket gir omtrent $\alpha=0.1273$ og $f\approx32.13$,
  nesten det samme som Armijo-steget $1/8$ med $f\approx32.26$.
- **Langs linjen:** Den deriverte er nær null.
- **I planet:** Gradientnormen er omtrent $36$, så neste steg må gå i en ny
  retning.

Det beste steget langs én linje er derfor sjelden verdt mange ekstra evalueringer.

:::

::: {#uke9-scipy}
:::

::: {.details title="SciPy-oppslag: ett avgrenset linjesøk (brukt i fordypningen over)"}

| Uttrykk | Betydning |
|:--|:--|
| `from scipy.optimize import minimize_scalar` | Henter rutinen. I nettleseren lastes SciPy første gang denne linjen kjøres. |
| `minimize_scalar(h, bounds=(0., .2), method="bounded")` | Søk numerisk på valgt intervall, der `h(alpha)` returnerer ett tall. |
| `options={"xatol": 1e-10}` | Absolutt stopptoleranse for steglengden $\alpha$, ikke en garantert feil i $f$. |
| `line.x`, `line.fun`, `line.nfev` | Valgt steglengde, verdi langs linjen og antall evalueringer. |
| `line.success` | Om rutinen nådde sitt stoppvilkår, ikke et globalt optimalitetsbevis. |

:::

**Dette tar vi med oss fra del B.**

- **Informasjon:** Armijo-søket trenger $f$ og $\nabla f$, men ingen krumning.
- **Virkemåte:** Det tilpasser steget i hvert punkt.
- **Løfte:** Det senker $f$ i hvert steg.

Men hva om vi ikke engang kan regne ut gradienten? Det er del C.

| Del | Metoden bruker | Steget velges slik | Hva kan vi love? |
|:--|:--|:--|:--|
| **B. Armijo** | $f$ og $\nabla f$ | start med $\alpha=1$, halver til $f$ synker nok | $f$ synker i hvert steg |

**Øv på del B:** [regneoppgavene B](#uke9-oppg-b) og [kodeoppgave B](#uke9-py-b).

## 9.4 C. Kompassøk

::: {#uke9-kompass}
:::

| Del | Metoden bruker | Steget velges slik | Hva kan vi love? |
|:--|:--|:--|:--|
| **C. Kompassøk** | bare $f$ | halver $\Delta$ når ingen nabo er bedre | ? |

### Bare funksjonsverdier

Ofte har vi ingen formel for gradienten. Funksjonsverdien kan komme fra en
simulering, en måling eller et program vi ikke kan se inni. Da kan vi bare
spørre: hva er $f$ her? Vi beholder halveringsideen fra Armijo, men erstatter
retningen $-\nabla f$ med fire faste retninger langs aksene.

::: {#week9-compass-rule .math-exercise-context}

Et **kompassøk** bruker gjeldende punkt $z$ og en stegstørrelse $\Delta$. Det
evaluerer de fire naboene $z\pm\Delta(1,0)$ og $z\pm\Delta(0,1)$, som øst,
vest, nord og sør på et kompass. En slik undersøkelse kalles en
**prøverunde**.

1. Beregn de fire naboverdiene (fire evalueringer).
2. Er den beste lavere enn verdien i $z$, flytter vi dit (**akseptert** flytting).
3. Hvis ingen er bedre, blir vi stående og halverer $\Delta$
   (en **mislykket** prøverunde).
4. Gjenta til $\Delta$ er mindre enn en valgt grense.

:::

Fra origo med $\Delta=1$ gir for eksempel både $(1,0)$ og $(0,1)$ verdien 136,
lavere enn $f(0,0)=170$. Søket velger den første og flytter til $(1,0)$.

### Hva vet vi når søket stopper?

Kompassøket regner aldri ut en derivert. Likevel vil vi vite om punktet der
det stopper, er nesten stasjonært. Det er det: en mislykket prøverunde gir en
grense for gradienten. Vi ser først på én variabel.

**Grensen.** Vi trenger to opplysninger:

- **Mislykket runde:** Runden med steg $\Delta$ mislykkes i $x$, så begge
  naboene $x\pm\Delta$ er minst like høye som $f(x)$.
- **Krumning:** $K$ er en øvre grense for $|f''|$ mellom $x-\Delta$ og
  $x+\Delta$.

Da er

$$\boxed{|f'(x)|\le\frac{K\Delta}{2}.}$$

**Hvorfor, med ord?**

1. Var helningen brattere enn $K\Delta/2$, ville kurven falle så fort til den
   ene siden at krumningen $K$ ikke rekker å bøye den opp igjen før
   $x\pm\Delta$.
2. Da ville den naboen vært lavere, og runden ville ikke ha mislyktes.

Regningen står i fordypningen litt lenger ned; appleten viser hva som skjer.
Her drar du punktet $x$ langs kurven og halverer $\Delta$ med en knapp, fra
$\Delta=0.5$. Les figuren slik:

| Tegn i figuren | Betydning |
|:--|:--|
| Grønne / røde naboer | minst like høyt som $f(x)$ / lavere enn $f(x)$ |
| Rød linje | tangenten i $x$ |
| Brune stiplede linjer | helningene $\pm K\Delta/2$ |
| Fiolett bue | det høyeste kurven kan nå mellom naboene når krumningen er høyst $K$ (Taylor) |

Målet er å se at en mislykket runde fanger helningen mellom to grenser, og at
grensene halveres sammen med $\Delta$.

### Applet – når mislykkes en runde?

- Dra $x$ til runden mislykkes (begge naboene grønne). Ligger den røde
  tangenten mellom de stiplede linjene?
- Trykk **halver Δ** noen ganger. Hva skjer med båndet mellom de stiplede
  linjene?
- Trykk **eksempelet under** (bildet zoomer inn) og sammenlign med regningen
  etter appleten. Bytt så til den andre funksjonen. Klarer du å finne en
  mislykket runde der tangenten ligger utenfor båndet?

::: {#uke9-kompass-applet}
:::

```{.jsxgraph width="620" height="480" style="width:100%;max-width:620px;height:480px;border:0;"}
var BIG = [-1.7,2.75,1.7,-1.45], SMALL = [-0.42,0.43,0.52,-0.2];
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: BIG, axis: true, keepaspectratio: false,
  showNavigation: false, showCopyright: false,
  pan: {enabled:false}, zoom: {enabled:false}
});
var bb = function(i){return board.getBoundingBox()[i];};
var X = function(s){return bb(0)+s*(bb(2)-bb(0));};
var Y = function(s){return bb(3)+s*(bb(1)-bb(3));};
var funcs = [
  {f: function(x){return 2*x*x;}, d1: function(x){return 4*x;},
   K: function(a,b){return 4;}},
  {f: function(x){return x*x*x*x-2*x*x+0.5*x+1;}, d1: function(x){return 4*x*x*x-4*x+0.5;},
   K: function(a,b){var m=Math.max(Math.abs(12*a*a-4),Math.abs(12*b*b-4));
                    return (a<=0 && b>=0) ? Math.max(m,4) : m;}}
];
var cur = 0, halv = 0;
var F = function(x){return funcs[cur].f(x);};
var graph = board.create('functiongraph',[function(x){return F(x);},-1.65,1.65],{
  strokeColor:'#345f78',strokeWidth:2.5,highlight:false
});
var D = function(){return 0.5/Math.pow(2,halv);};
var P = board.create('glider',[0.3,F(0.3),graph],{name:'x',color:'#1565c0',size:4});
var x = function(){return P.X();};
var fx = function(){return F(x());};
var fl = function(){return F(x()-D());};
var fr = function(){return F(x()+D());};
var failed = function(){return fl()>=fx() && fr()>=fx();};
var K = function(){return funcs[cur].K(x()-D(),x()+D());};
var slope = function(){return funcs[cur].d1(x());};
var band = function(){return K()*D()/2;};
var L = function(){return 0.16*(bb(2)-bb(0));};
var col = function(v){return v>=fx() ? '#2e7d32' : '#c62828';};
board.create('segment',[[function(){return x()-D();},fx],[function(){return x()+D();},fx]],{
  strokeColor:'#9aa5ad',dash:1,strokeWidth:1.2,fixed:true,highlight:false
});
board.create('point',[function(){return x()-D();},fl],{name:'',size:4,fixed:true,
  strokeColor:function(){return col(fl());},fillColor:function(){return col(fl());}});
board.create('point',[function(){return x()+D();},fr],{name:'',size:4,fixed:true,
  strokeColor:function(){return col(fr());},fillColor:function(){return col(fr());}});
board.create('segment',[[function(){return x()-L();},function(){return fx()-L()*slope();}],
                        [function(){return x()+L();},function(){return fx()+L()*slope();}]],{
  strokeColor:'#c62828',strokeWidth:2,fixed:true,highlight:false
});
[1,-1].forEach(function(sg){
  board.create('segment',[[function(){return x()-L();},function(){return fx()-sg*L()*band();}],
                          [function(){return x()+L();},function(){return fx()+sg*L()*band();}]],{
    strokeColor:'#b45309',dash:2,strokeWidth:1.5,fixed:true,highlight:false
  });
});
board.create('curve',[function(t){return t;},
  function(t){var h=t-x(); return fx()+slope()*h+0.5*K()*h*h;},
  function(){return x()-D();},function(){return x()+D();}],{
  strokeColor:'#7846ad',dash:3,strokeWidth:1.8,highlight:false
});
board.create('text',[function(){return X(0.02);},function(){return Y(0.13);},function(){
  return 'Δ = '+D()+' (halvert '+halv+' ganger),   f′(x) = '+slope().toFixed(3)+
         ',   K = '+K().toFixed(2)+',   KΔ/2 = '+band().toFixed(3);
}],{fontSize:14,fixed:true});
board.create('text',[function(){return X(0.02);},function(){return Y(0.06);},function(){
  if (!failed()) return 'Runden lykkes: en nabo er lavere, og søket flytter dit.';
  return 'Runden mislykkes: |f′(x)| = '+Math.abs(slope()).toFixed(3)+' ≤ KΔ/2 = '+
         band().toFixed(3)+(Math.abs(slope())<=band()+1e-12 ? '  ✓' : '  ✗');
}],{fontSize:14,fixed:true,color:function(){return failed() ? '#2e7d32' : '#555';}});
var show = function(c){cur=c; board.setBoundingBox(BIG,false); board.update();};
board.create('button',[function(){return X(0.02);},function(){return Y(0.97);},'f = 2x²',
  function(){show(0);}]);
board.create('button',[function(){return X(0.2);},function(){return Y(0.97);},
  'f = x⁴ − 2x² + x/2 + 1',function(){show(1);}]);
board.create('button',[function(){return X(0.02);},function(){return Y(0.9);},'halver Δ',
  function(){halv=Math.min(halv+1,5); board.update();}]);
board.create('button',[function(){return X(0.2);},function(){return Y(0.9);},'Δ = 0.5',
  function(){halv=0; board.update();}]);
board.create('button',[function(){return X(0.75);},function(){return Y(0.97);},'eksempelet under',
  function(){cur=0; halv=2; board.setBoundingBox(SMALL,false); P.moveTo([0.05,F(0.05)]); board.update();}]);
```

**Hva viser bildet?**

- **Helningsgrensen:** Hver gang begge naboene er grønne, ligger tangenten
  mellom de stiplede linjene: $|f'(x)|\le K\Delta/2$.
- **Forklaringen i buen:** Kurven ligger aldri over den fiolette buen. Når
  runden mislykkes, ligger begge naboene minst like høyt som $f(x)$. Da må
  også buen nå opp til høyden $f(x)$ i begge ender, og det klarer den bare
  når tangenten ikke er for bratt.
- **Parabelen:** For $2x^2$ er krumningen overalt lik $K=4$, så buen faller
  sammen med kurven.
- **Halveringen:** Hver halvering av $\Delta$ halverer båndet. En mislykket
  runde med lite $\Delta$ betyr altså en liten derivert.

**Med tall.** For $f(x)=2x^2$ er $f''=4$, så $K=4$:

1. I $x=0.05$ med $\Delta=1/8$ er $f(0.05)=0.005$, $f(0.175)=0.06125$ og
   $f(-0.075)=0.01125$.
2. Begge naboene er høyere, så runden mislykkes.
3. Grensen sier $|f'(0.05)|\le4\cdot\tfrac18/2=0.25$. Faktisk er $f'(0.05)=0.2$.

::: {#week9-compass-gradient-bound .math-exercise-context}

**I $n$ variabler.** Vi bruker den samme grensen langs hver akse:

- **Hva runden har prøvd:** Både $+\Delta$ og $-\Delta$ langs hver akse.
- **Én komponent:** Hver akse gir
  $|\partial f/\partial x_i|\le K\Delta/2$.
- **Hva $K$ betyr nå:** En grense for $|\partial^2f/\partial x_i^2|$ på
  linjestykkene fra $z-\Delta e_i$ til $z+\Delta e_i$.

Med $n$ slike komponenter blir

$$\boxed{\|\nabla f(z)\|_2\le\sqrt n\,\frac{K\Delta}{2}.}$$

:::

**En mislykket runde med lite $\Delta$ beviser at gradienten er liten.**

- **Tolkning av stoppen:** Stoppregelen «$\Delta$ er liten» betyr at punktet
  er nesten stasjonært.
- **Begrensning:** Det sier ikke at punktet er et globalt minimum, og heller
  ikke at det er et minimum.

::: {.reading-step title="Gå i dybden: hvorfor gir en mislykket runde en grense for gradienten?"}

**I én variabel.** Runden med steg $\Delta$ mislykkes i $x$:

$$f(x+\Delta)\ge f(x)\qquad\text{og}\qquad f(x-\Delta)\ge f(x).$$

La $K$ være en øvre grense for $|f''|$ på intervallet fra $x-\Delta$ til
$x+\Delta$. Taylor med restledd gir et punkt $\xi$ mellom $x$ og $x+\Delta$ med

$$f(x+\Delta)=f(x)+\Delta f'(x)+\tfrac12\Delta^2f''(\xi)\le f(x)+\Delta f'(x)+\tfrac12K\Delta^2.$$

Høyresiden er den fiolette buen i appleten. Vi trekker fra $f(x)$ og bruker den
første ulikheten:

$$0\le f(x+\Delta)-f(x)\le\Delta f'(x)+\tfrac12K\Delta^2.$$

Del på $\Delta>0$:

$$0\le f'(x)+\tfrac12K\Delta,\qquad\text{altså}\qquad f'(x)\ge-\frac{K\Delta}{2}.$$

Det samme med $-\Delta$ gir
$f(x-\Delta)\le f(x)-\Delta f'(x)+\tfrac12K\Delta^2$, og dermed

$$0\le-\Delta f'(x)+\tfrac12K\Delta^2,\qquad\text{altså}\qquad f'(x)\le\frac{K\Delta}{2}.$$

Til sammen er $|f'(x)|\le K\Delta/2$.

**I $n$ variabler.** Vi tar én akse om gangen:

1. Skriv $a_i=\partial f/\partial x_i(z)$ og la $e_i$ være enhetsvektoren langs
   akse $i$.
2. Taylor langs aksen gir
   $f(z+\Delta e_i)=f(z)+\Delta a_i+\tfrac12\Delta^2f_{x_ix_i}(\xi)$ for et
   punkt $\xi$ mellom $z$ og $z+\Delta e_i$, og tilsvarende med $-\Delta$.

Fordi runden mislyktes, er

$$0\le f(z+\Delta e_i)-f(z)\le\Delta a_i+\tfrac12K\Delta^2,\qquad
0\le f(z-\Delta e_i)-f(z)\le-\Delta a_i+\tfrac12K\Delta^2.$$

Den første gir $a_i\ge-K\Delta/2$, den andre $a_i\le K\Delta/2$. Altså er
$|a_i|\le K\Delta/2$ for hver $i$, og

$$\|\nabla f(z)\|_2^2=a_1^2+\dots+a_n^2\le n\Bigl(\frac{K\Delta}{2}\Bigr)^2.$$

Kvadratroten gir grensen. Legg merke til at vi bare trenger de andrederiverte
langs aksene, $f_{x_ix_i}$, ikke de blandede.

:::

### Er grensen nyttig i praksis?

Grensen gjelder alltid, men den er bare interessant hvis den ikke er altfor
grov. Nå undersøker vi hvor nyttig den er ved slutten av et søk.

- **Søket:** Funksjonen `compass` i oppsettet følger reglene 1–4 over. Vi
  starter i $(0.3,\,0.7)$ og kjører til $\Delta<1/1024$, slik at siste
  mislykkede runde hadde $\Delta=1/1024$.
- **Anslaget for krumning:** Nær sluttpunktet endrer Hessianen seg lite, så
  vi bruker $K=\|H(z)\|_2$, den største egenverdien i absoluttverdi. Den er
  minst like stor som begge diagonalelementene, fordi
  $|h_{ii}|=|e_i^THe_i|\le\|H\|_2$.
- **Kontrollen:** Vi sammenligner grensen $\sqrt2\,K\Delta/2$ med den faktiske
  gradientnormen, som vi regner ut bare for å kontrollere.

Målet er å se hvor tett grensen er, uten at søket selv har brukt én eneste
derivert.

### Eksperiment 4 – kompassøk og grensen for gradienten

- Kjør cellen og følg banen på nivåkurvene.
- Sammenlign grensen med den faktiske gradientnormen.
- Bytt `1/1024` med `1/64`, og undersøk hvordan grensen og gradienten endres.

```{pyodide-python}
#| label: week9-compass-certificate
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-compass-c3234512, ide-uke9-f9-0f604562, ide-uke9-grad9-7f3a74d2, ide-uke9-hess9-01410542, ide-uke9-np-6f11581d, ide-uke9-plot-path-ae7201a8
# compass(z, Δ, min_Δ) i oppsettet følger reglene 1–4 over og husker Δ i siste mislykkede runde.
start = np.array([0.3, 0.7])
z, delta, polls, path = compass(start, 1., 1/1024)
K = np.linalg.norm(hess9(z), 2)
print(f'start (0.3, 0.7), f = {f9(start):.2f}')
print(f'sluttpunkt ({z[0]:.6f}, {z[1]:.6f}), f = {f9(z):.2e}, {4*polls + 1} evalueringer')
print(f'siste mislykkede Δ = {delta:.6f}, K = {K:.1f}')
print(f'grense sqrt(2)·K·Δ/2 = {np.sqrt(2)*K*delta/2:.4f}')
print(f'faktisk |∇f|          = {np.linalg.norm(grad9(z)):.4f}')
plot_path(path, 'kompass fra (0.3, 0.7)')
```

**Hva viser forsøket?**

- **Sluttpunktet:** Søket ender nær $(3,2)$ etter 101 evalueringer.
- **Grensen mot fasiten:** Grensen er omtrent $0.057$, og den faktiske
  gradientnormen er omtrent $0.011$. Grensen holder, og den er ikke langt unna.
- **Det søket brukte:** Kompassøket brukte ingen deriverte. For å tolke
  stoppen trengte vi bare et anslag $K$ for krumningen; da vet vi at
  $\|\nabla f\|_2\le0.057$ uten å ha regnet ut gradienten.

::: {.reading-step title="Gå i dybden: valg som gir andre baner"}

Vi evaluerer alle fire naboer før vi flytter. Andre valg er mulige:

- **Første forbedring:** En variant flytter til første forbedring. Den kan
  bruke færre evalueringer, men følger en annen bane.
- **Flere retninger:** Vi kunne også prøve diagonale retninger.
- **Samme gradientgrense:** Grensen gjelder for alle disse variantene, så
  lenge en mislykket runde har prøvd både $+\Delta$ og $-\Delta$ langs hver akse.

Ingen av variantene utelukker en lavere verdi i en annen dal.

:::

::: {#uke9-endelig}
:::

::: {.reading-step title="Gå i dybden: hvorfor ikke bare prøve mange punkter?"}

Kompassøket bruker de punktene det har sett, til å bestemme hvor det prøver
neste gang. Det enkleste alternativet er å ikke ta steg i det hele tatt, men å
se på mange punkter på forhånd og velge det beste.

Vi sammenligner to måter å bruke 64 **funksjonsevalueringer** i kvadratet
$[-4,4]^2$:

| Metode | Valg av punkter |
|:--|:--|
| **Gittersøk** | Alle kombinasjoner av valgte koordinater: åtte verdier for $x$ og åtte for $y$ gir $8^2=64$ punkter. |
| **Tilfeldig sampling** | Vi trekker 64 punkter jevnt fordelt i samme kvadrat. |

`default_rng(42)` fester de tilfeldige tallene, slik at forsøket kan gjentas.

```{pyodide-python}
#| label: week9-finite-search
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-f9-0f604562, ide-uke9-np-6f11581d, ide-uke9-plot-samples-f6a080b4
axis = np.linspace(-4, 4, 8)                     # åtte faste koordinater per akse
gx, gy = np.meshgrid(axis, axis)
grid = np.column_stack((gx.ravel(), gy.ravel()))
random_points = np.random.default_rng(42).uniform(-4, 4, size=(64, 2))
for name, points in [('Gitter', grid), ('Tilfeldig', random_points)]:
    values = np.array([f9(z) for z in points])
    i = np.argmin(values)
    print(f'{name:<10} {len(values)} prøver: beste punkt '
          f'({points[i, 0]:.3f}, {points[i, 1]:.3f}), f = {values[i]:.3f}')
plot_samples(grid, random_points)
```

- **Gitteret:** Finner omtrent $2.710$ ved $(2.857,\,1.714)$.
- **Tilfeldig utvalg:** Finner omtrent $0.094$ ved $(-3.818,\,-3.280)$, i en
  annen dal. Et annet frø kan snu rekkefølgen.
- **Felles begrensning:** Begge utvalgene lar alle punktene **mellom** prøvene
  være uprøvd.

**Prøvebudsjett og dimensjon.**

- **Fullt gitter:** Med $m$ punkter langs hver av $n$ koordinater bruker vi
  $m^n$ evalueringer. For $m=8$ øker tallet fra $64$ i to dimensjoner til
  $8^6=262144$ i seks dimensjoner, og avstanden mellom gitterpunktene er den
  samme.
- **Tilfeldige prøver:** De kan holdes innenfor et budsjett, men treffer et
  lite område med lave verdier like sjelden.

Å dekke hele området er håpløst i høy dimensjon.

**Tilfeldig vandring.** En mellomting velger neste forslag relativt til
punktet vi har beholdt. Vi trekker en tilfeldig retning med lengde 1, prøver et
steg på 0.5 og beholder forslaget bare når verdien synker.

```{pyodide-python}
#| label: week9-random-walk-extension
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-f9-0f604562, ide-uke9-np-6f11581d
walk_rng = np.random.default_rng(7)
walk = np.array([0., 0.])
for trial_number in range(20):
    direction = walk_rng.normal(size=2)
    direction /= np.linalg.norm(direction)       # lengde 1: steget blir 0.5
    candidate = walk + 0.5*direction
    if f9(candidate) < f9(walk):
        walk = candidate
print(f'etter 20 forslag: ({walk[0]:.3f}, {walk[1]:.3f}), f = {f9(walk):.3f}')
```

Vandringen kommer et godt stykke ned, men med fast steglengde 0.5 kan den
aldri komme nærmere et minimum enn det steget tillater. Kompassøket løser det
ved å halvere steget når en runde mislykkes.

:::

**Dette tar vi med oss fra del C.**

- **Informasjon:** Kompassøket trenger bare funksjonsverdier.
- **Steget:** Det halverer $\Delta$ når ingen nabo er bedre.
- **Gradientgrensen:** En mislykket runde gir
  $\|\nabla f\|_2\le\sqrt n\,K\Delta/2$.

Både Armijo og kompassøket godtar bare punkter med lavere verdi. Er det nok
til at de kommer fram? Det er del D.

| Del | Metoden bruker | Steget velges slik | Hva kan vi love? |
|:--|:--|:--|:--|
| **C. Kompassøk** | bare $f$ | halver $\Delta$ når ingen nabo er bedre | en mislykket runde gir $\lVert\nabla f\rVert_2\le\sqrt n\,K\Delta/2$ |

**Øv på del C:** [regneoppgavene C](#uke9-oppg-c) og [kodeoppgave C](#uke9-py-c).

## 9.5 D. Garantien

::: {#uke9-garanti}
:::

| Del | Metoden bruker | Steget velges slik | Hva kan vi love? |
|:--|:--|:--|:--|
| **D. Garantien** | krav til $f$: ? | | ? |

### Er det nok å gå nedover?

Armijo-søket og kompassøket har én ting felles: de godtar bare punkter med
**lavere** funksjonsverdi. Det høres ut som det burde være nok. Før vi prøver
å bevise noe, tester vi det på et problem der vi vet at det ikke finnes noe
minimum.

I [uke 8](uke8.qmd#uke8-eksistens) prøvde vi å tilpasse $m(t)=a(1-e^{-bt})$
til ni målinger på linjen $y=0.5\,t$, med $b>0$. Nå lar vi Armijo-søket prøve
seg på det samme problemet:

- **Navnet:** Vi kaller kvadratsummen $S_8(a,b)$ her, så den ikke blandes med
  konvergensfaktoren $S$.
- **Det vi vet:** I uke 8 fant vi at $S_8$ kan gjøres så liten vi vil, men at
  minimum ikke finnes.
- **Det vi får ferdig:** Funksjonene `S8` og `grad_S8` står i oppsettet.
- **Kjøringen:** Cellen starter i $(a,b)=(1,1)$, tar 3000 steg og skriver ut
  punktet, $S_8$ og gradientnormen underveis.

Målet er å se hva en metode som alltid går nedover, gjør når det ikke finnes
noen bunn.

### Eksperiment 5 – et søk som aldri kommer fram

- **Forutsi:** Nærmer Armijo-søket seg et bestemt punkt?
- Kjør cellen og følg $a$, $b$ og $|\nabla S_8|$ i tabellen.
- Tenk deg stoppregelen $\|\nabla S_8\|_2<0.2$. Hvor ville søket ha meldt
  suksess?

```{pyodide-python}
#| label: week9-drift
#| feedback-context: ide-uke9-reference-assumptions, ide-uke9-s8-ab2d0174, ide-uke9-grad-s8-91705fbf, ide-uke9-np-6f11581d, ide-uke9-plot-drift-3e942b81
z = np.array([1., 1.])
path = [z.copy()]
print(f'{"steg":>6} {"a":>7} {"b":>7} {"S_8":>10} {"|∇S_8|":>9}')
for k in range(1, 3001):
    g = grad_S8(z)
    alpha = 1.
    while S8(z - alpha*g) > S8(z) - 1e-4*alpha*(g @ g):     # samme Armijo-test som i 9.3
        alpha /= 2
    z = z - alpha*g
    path.append(z.copy())
    if k in (10, 100, 1000, 3000):
        print(f'{k:>6} {z[0]:>7.3f} {z[1]:>7.3f} {S8(z):>10.2e} '
              f'{np.linalg.norm(grad_S8(z)):>9.1e}')
plot_drift(path)
```

**Hva viser forsøket?**

- **Nedgangen virker:** Armijo-søket gjør nøyaktig det det skal: $S_8$ synker
  i hvert steg.
- **Punktene driver utover:** Iteratene kryper langs kurven $a=0.5/b$. Etter
  $10^2$, $10^3$ og $3\cdot10^3$ steg er $a\approx2.5,\ 3.4,\ 3.8$ og
  $b\approx0.29,\ 0.20,\ 0.17$. Langs denne kurven går $S_8$ mot 0 mens
  $a\to\infty$, så det finnes ingen grense å konvergere mot.
- **En liten gradient kan villede:** Gradientnormen faller fra $0.77$ etter
  10 steg til omtrent $0.13$ etter 3000. En stoppregel som
  $\|\nabla S_8\|_2<0.2$ ville derfor meldt suksess i et tilfeldig punkt på
  veien.

Det er ikke metoden som svikter, men funksjonen som mangler en egenskap. Resten
av fanen sier hvilken.

### Iteratene blir i subnivåmengden

Fordi begge metodene bare godtar lavere verdier, kan de aldri besøke et punkt
der $f$ er høyere enn i startpunktet $z_0$. Alle iteratene ligger derfor i
**subnivåmengden**

$$L_0=\{z: f(z)\le f(z_0)\}.$$

Det avgjørende er om $L_0$ har plass til at iteratene kan rømme:

- **Ubegrenset $L_0$:** I eksperiment 5 inneholder $L_0$ hele den delen av
  kurven $a=0.5/b$ der $b$ er liten ($b\le0.36$). Iteratene kan vandre ut
  langs den.
- **Begrenset $L_0$:** **Iteratene kan ikke rømme.** De må hope seg opp ved
  minst ett punkt i $L_0$. Et slikt punkt kalles et **grensepunkt** for
  følgen. Hvorfor det alltid finnes et grensepunkt, står i fordypningen
  etter garantien.

Når er $L_0$ begrenset? En funksjon på hele $\mathbb R^n$ er **koersiv** hvis

$$f(z)\to\infty\quad\text{når}\quad\|z\|_2\to\infty.$$

- **Med ord:** For hver høyde $M$ finnes en radius $R$ slik at $f(z)>M$ for
  alle $z$ med $\|z\|_2>R$.
- **Følgen for $L_0$:** Med $M=f(z_0)$ ligger hele $L_0$ inne i skiven med
  radius $R$, så alle subnivåmengder er begrenset.
- **Moteksemplet:** Kvadratsummen $S_8$ er **ikke** koersiv. Langs kurven
  $a=0.5/b$ holder den seg liten mens $a\to\infty$.

### Kan iteratene rømme?

Himmelblaus funksjon er koersiv: langt ute er minst én av parentesene
$x^2+y-11$ og $x+y^2-7$ stor. Regningen står i fordypningen om koersive
funksjoner lenger ned. Vi venter derfor to ulike bilder:

- **Himmelblau:** $L_0$ bør være begrenset og iteratene stengt inne.
- **$S_8$ fra eksperiment 5:** Vi venter det motsatte.

Appleten lar oss undersøke forskjellen:

| I appleten | Hva du ser eller gjør |
|:--|:--|
| Blå kurve | randen av $L_0=\{f\le f(z_0)\}$ |
| Rød firkant | startpunktet $z_0$, som du kan dra |
| Knapper for 10 eller 1000 steg | Armijo-søket fra 9.3, med samme test og faktor $10^{-4}$ |
| Grønn linje | går gjennom iteratene |
| Teksten øverst | antall steg, verdien og gradientnormen |
| Ekstra for Himmelblau | største avstand fra origo til et punkt i $L_0$; den stiplede sirkelen har radius 7 |

Målet er å se forskjellen på en begrenset og en ubegrenset subnivåmengde: i den
ene er iteratene stengt inne og hoper seg opp ved et punkt, i den andre kan de
vandre ut.

### Applet – kan iteratene rømme?

- Start i $(0,0)$ med Himmelblaus funksjon, og trykk **+10 steg** noen ganger.
  Forlater iteratene den blå kurven? Hvor ender de?
- Dra startpunktet nær $(-4,4)$ og deretter nær $(5,5)$. Hvor stor er $L_0$
  nå, og hvor ender iteratene?
- Bytt til **S₈ fra uke 8**, og trykk **+1000 steg** et par ganger.
  Sammenlign med tabellen i eksperiment 5.

::: {#uke9-subniva-applet}
:::

```{.jsxgraph width="620" height="560" style="width:100%;max-width:620px;height:560px;border:0;"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-8,8.4,8,-7.2], axis: true, keepaspectratio: false,
  showNavigation: false, showCopyright: false,
  pan: {enabled:false}, zoom: {enabled:false}
});
var t8 = [0,0.5,1,1.5,2,2.5,3,3.5,4];
var models = {
  H: {f: function(x,y){var u=x*x+y-11, w=x+y*y-7; return u*u+w*w;},
      g: function(x,y){var u=x*x+y-11, w=x+y*y-7; return [4*x*u+2*w, 2*u+4*y*w];},
      box: [-8,8.4,8,-7.2], start: [0,0]},
  S: {f: function(a,b){var s=0;
        for (var i=0;i<9;i++){var r=0.5*t8[i]-a*(1-Math.exp(-b*t8[i])); s+=r*r;} return s;},
      g: function(a,b){var ga=0, gb=0;
        for (var i=0;i<9;i++){var e=Math.exp(-b*t8[i]), r=0.5*t8[i]-a*(1-e);
          ga+=-2*r*(1-e); gb+=-2*r*a*t8[i]*e;} return [ga,gb];},
      box: [-0.6,1.75,6.6,-0.25], start: [1,1]}
};
var mode = 'H';
var M = function(){return models[mode];};
var box = function(i){return M().box[i];};
var X = function(s){return box(0)+s*(box(2)-box(0));};
var Y = function(s){return box(3)+s*(box(1)-box(3));};
var Z0 = board.create('point',[0,0],{name:'z₀',color:'#bb4a37',size:5,face:'[]'});
var level = function(){return M().f(Z0.X(),Z0.Y());};
board.create('implicitcurve',[function(x,y){return M().f(x,y)-level();}],{
  strokeColor:'#1665ad',strokeWidth:2,highlight:false
});
var xs = [], ys = [];
var path = board.create('curve',[[0],[0]],{strokeColor:'#2b8a61',strokeWidth:1.5,
  highlight:false,visible:false});
var hOnly = [board.create('circle',[[0,0],7],{strokeColor:'#9aa5ad',dash:2,
  strokeWidth:1,fixed:true,highlight:false})];
[[3,2],[-2.805118,3.131312],[-3.779310,-3.283186],[3.584428,-1.848126]].forEach(function(m){
  hOnly.push(board.create('point',m,{name:'',face:'x',size:4,color:'#555',fixed:true}));
});
var sOnly = [board.create('curve',[function(t){return 0.5/t;},function(t){return t;},0.07,1.7],{
  strokeColor:'#9aa5ad',dash:2,strokeWidth:1.2,highlight:false,visible:false})];
var rmax = 0;
function radius(){
  if (mode!=='H') return;
  var lev = level(), r = 0, out = false, h = 0.02, n = 850;
  for (var i=0;i<=n;i++){ var x = -8.5+i*h;
    for (var j=0;j<=n;j++){ var y = -8.5+j*h;
      var u=x*x+y-11, w=x+y*y-7;
      if (u*u+w*w<=lev){ var d=x*x+y*y; if (d>r) r=d; if (i===0||j===0||i===n||j===n) out=true; }
    }
  }
  rmax = out ? Infinity : Math.sqrt(r);
}
function draw(){
  path.dataX = xs.slice(); path.dataY = ys.slice();
  path.setAttribute({visible: xs.length>0}); board.update();
}
function reset(){ xs.length = 0; ys.length = 0; draw(); }
function steps(n){
  if (!xs.length){ xs.push(Z0.X()); ys.push(Z0.Y()); }
  var z = [xs[xs.length-1], ys[ys.length-1]];
  for (var s=0;s<n;s++){
    var g = M().g(z[0],z[1]), gg = g[0]*g[0]+g[1]*g[1];
    if (Math.sqrt(gg)<1e-6) break;               // samme stopp som i eksperiment 3
    var a = 1, fz = M().f(z[0],z[1]), c = 0;
    while (M().f(z[0]-a*g[0],z[1]-a*g[1]) > fz-1e-4*a*gg && c<80){ a/=2; c++; }
    z = [z[0]-a*g[0], z[1]-a*g[1]];
    xs.push(z[0]); ys.push(z[1]);
  }
  draw();
}
function setMode(m){
  mode = m;
  board.setBoundingBox(M().box,false);
  hOnly.forEach(function(e){e.setAttribute({visible: m==='H'});});
  sOnly.forEach(function(e){e.setAttribute({visible: m==='S'});});
  Z0.moveTo(M().start); reset(); radius(); board.update();
}
Z0.on('drag',function(){ if (xs.length) reset(); });
Z0.on('up',function(){ radius(); board.update(); });
var cur = function(){return xs.length ? [xs[xs.length-1],ys[ys.length-1]] : [Z0.X(),Z0.Y()];};
board.create('text',[function(){return X(0.02);},function(){return Y(0.955);},function(){
  var z = cur(), g = M().g(z[0],z[1]);
  return 'k = '+Math.max(xs.length-1,0)+' Armijo-steg:  f = '+M().f(z[0],z[1]).toPrecision(4)+
         ',  |∇f| = '+Math.sqrt(g[0]*g[0]+g[1]*g[1]).toPrecision(3);
}],{fontSize:14,fixed:true});
board.create('text',[function(){return X(0.02);},function(){return Y(0.905);},function(){
  var z = cur();
  if (mode==='H') return 'L₀ = {f ≤ '+level().toFixed(1)+'}:  største avstand fra origo ≈ '+
                         (rmax===Infinity ? 'over 8.5' : rmax.toFixed(2));
  return 'z = (a, b) = ('+z[0].toFixed(3)+', '+z[1].toFixed(3)+');  L₀ = {S₈ ≤ '+level().toFixed(3)+'}';
}],{fontSize:14,fixed:true});
board.create('button',[function(){return X(0.02);},function(){return Y(0.86);},'Himmelblau',
  function(){setMode('H');}]);
board.create('button',[function(){return X(0.2);},function(){return Y(0.86);},'S₈ fra uke 8',
  function(){setMode('S');}]);
board.create('button',[function(){return X(0.42);},function(){return Y(0.86);},'+10 steg',
  function(){steps(10);}]);
board.create('button',[function(){return X(0.57);},function(){return Y(0.86);},'+1000 steg',
  function(){steps(1000);}]);
board.create('button',[function(){return X(0.75);},function(){return Y(0.86);},'nullstill',
  function(){reset();}]);
radius(); board.update();
```

**Hva viser bildet?**

- **Himmelblau fra origo:** Randen av $L_0$ er en lukket kurve. Det fjerneste
  punktet har avstand omtrent $6.78$ fra origo, innenfor sirkelen med radius
  7. Startpunktet ligger på randen, fordi $f(0,0)=170$.
- **Iteratene er stengt inne:** De blir inne i kurven og hoper seg opp i
  $(3,2)$, et grensepunkt der $\nabla f=0$.
- **Andre startpunkter:** $L_0$ blir større eller mindre, men den er alltid
  begrenset. Armijo-søket i eksperiment 3 og kompassøket i eksperiment 4
  (start i $(0.3,\,0.7)$, der $f\approx142.81<170$) holdt seg derfor også
  inne i denne kurven.
- **$S_8$:** Nivåkurven fortsetter utenfor tegnevinduet. Subnivåmengden er
  ubegrenset og strekker seg mot høyre langs den stiplede kurven $a=0.5/b$.
  Iteratene kryper utover der mens gradientnormen nesten står stille,
  akkurat som i eksperiment 5.

Garantien under sier at det første bildet er det vi får hver gang $f$ er koersiv.

::: {.callout-important}
#### Garantien

La $f$ være koersiv og ha kontinuerlig gradient (for kompassøket også
kontinuerlige andrederiverte).

- **Armijo-søket langs $-\nabla f$:** iteratene er begrenset, og hvert
  grensepunkt er **stasjonært** ($\nabla f=0$).
- **Kompassøket:** iteratene er begrenset, $\Delta$ går mot null, og hver
  mislykket runde med steg $\Delta$ gir $\|\nabla f\|_2\le\sqrt n\,K\Delta/2$,
  med $K$ som i 9.4. Grensen går altså mot null.

Garantien sier **stasjonært**, ikke globalt minimum. Om et stasjonært punkt er
globalt best, er konveksitetsspørsmålet fra [uke 8](uke8.qmd#uke8-lokalt).
:::

::: {.reading-step title="Gå i dybden: hvorfor finnes grensepunkter, og hvorfor er de stasjonære?"}

**Grensepunkter finnes.**

1. Iteratene ligger i $L_0$, som er begrenset.
2. En begrenset følge har en konvergent delfølge (Bolzano–Weierstrass; se
   fordypningen om ekstremalverdisetningen i [uke 8](uke8.qmd#uke8-kompakt)).
3. Hvis $f$ er kontinuerlig, er $L_0$ lukket, så grensen for delfølgen ligger
   i $L_0$. Den er et grensepunkt for følgen.

**Grensepunktene er stasjonære.** Skriv $\nabla f_k=\nabla f(z_k)$ og la
$\alpha_k$ være det godtatte steget.

1. $f(z_k)$ avtar og er nedtil begrenset (en kontinuerlig funksjon på den
   kompakte mengden $L_0$ har minimum). Derfor konvergerer $f(z_k)$, og
   $f(z_k)-f(z_{k+1})\to0$.
2. Armijo-testen gir $f(z_k)-f(z_{k+1})\ge10^{-4}\alpha_k\|\nabla f_k\|_2^2$.
   Altså går $\alpha_k\|\nabla f_k\|_2^2\to0$.
3. La $z_k\to\bar z$ langs en delfølge. Hvis $\alpha_k$ holder seg over en fast
   positiv grense langs en videre delfølge, må $\|\nabla f_k\|_2\to0$ der, og
   $\nabla f(\bar z)=0$ fordi gradienten er kontinuerlig.
4. Ellers går $\alpha_k\to0$ langs en videre delfølge. Vi følger argumentet
   gjennom tre mellomtrinn:

   **Avvist steg:** Da er $\alpha_k<1$ til slutt, så steget $2\alpha_k$ ble
   avvist: $f(z_k-2\alpha_k\nabla f_k)>f(z_k)-10^{-4}\cdot2\alpha_k\|\nabla f_k\|_2^2$.

   **Middelverdisetningen:** Den gir et punkt $\xi_k$ mellom $z_k$ og
   $z_k-2\alpha_k\nabla f_k$ med
   $-\nabla f(\xi_k)^T\nabla f_k>-10^{-4}\|\nabla f_k\|_2^2$.

   **Grenseovergangen:** Når $k\to\infty$ langs delfølgen, går både $\xi_k$ og
   $z_k$ mot $\bar z$, og vi får
   $\|\nabla f(\bar z)\|_2^2\le10^{-4}\|\nabla f(\bar z)\|_2^2$. Det er bare
   mulig når $\nabla f(\bar z)=0$.

**For kompassøket må vi også begrunne to ting.**

**En felles grense $K$.**

1. Prøvepunktene $z\pm\Delta e_i$ i en mislykket runde kan ligge litt utenfor
   $L_0$; de ble jo avvist. Men de ligger høyst $\Delta_0$ fra $L_0$, der
   $\Delta_0$ er startsteget.
2. Mengden av punkter med avstand høyst $\Delta_0$ fra $L_0$ er også lukket
   og begrenset. Der finnes en grense $K$ for de andrederiverte, så grensen
   fra 9.4 gjelder i hver mislykket runde.

**$\Delta$ går faktisk mot null.**

1. Med fast $\Delta$ ligger alle iteratene på et rutenett med avstand
   $\Delta$, og den begrensede $L_0$ inneholder bare endelig mange slike punkter.
2. Siden $f$ synker i hver flytting, besøkes ingen av dem to ganger. Før
   eller siden mislykkes derfor en runde, og $\Delta$ halveres.

:::

**Koersiv eller ikke?**

- **Slik avkrefter vi koersivitet:** Én linje der $f$ holder seg begrenset
  mens $\|z\|_2\to\infty$, er nok til å vise at $f$ ikke er koersiv. For
  eksempel er $(x-y)^2=0$ langs hele linjen $x=y$.
- **Hva garantien krever:** Koersivitet er en tilstrekkelig betingelse, ikke
  en nødvendig. Armijo-søket finner likevel et minimumspunkt for $(x-y)^2$,
  men det kunne ikke garantien love på forhånd.

::: {.reading-step title="Gå i dybden: hvilke funksjoner er koersive?"}

**To enkle eksempler.**

| Funksjon | Subnivåmengden ved høyde 1 | Koersiv? |
|:--|:--|:--|
| $f_1(x,y)=x^2+y^2$ | $\{f_1\le1\}$ er skiven med radius 1 | ja |
| $f_2(x,y)=(x-y)^2$ | $\{f_2\le1\}$ er stripen $|x-y|\le1$, som inneholder hele linjen $x=y$ | nei |

Armijo-søket på $f_2$ kommer likevel fram i ett steg:

1. Gradienten er $2(x-y)(1,-1)$. Etter et steg med lengde $\alpha$ er $x-y$
   blitt $(1-4\alpha)(x-y)$.
2. Steget $\alpha=1$ gir $-3(x-y)$ (høyere verdi), og
   $\alpha=\tfrac12$ gir $-(x-y)$ (samme verdi), så begge avvises.
3. Steget $\alpha=\tfrac14$ gir $x-y=0$, et minimumspunkt.

**Himmelblaus funksjon.** Siden $f=u^2+w^2$, er $f\ge u^2$ og $f\ge w^2$.
Vi deler i to tilfeller:

- Når $|y|\le|x|$, er $u=x^2+y-11\ge x^2-|x|-11$.
- Når $|x|\le|y|$, er $w=x+y^2-7\ge y^2-|y|-7$.

Langt ute er den største av $|x|$ og $|y|$ stor, og den tilhørende nedre
grensen går mot uendelig, så $f\to\infty$.

**Skålen fra uke 6**, $\phi(x)=\tfrac12x^TAx-b^Tx$ med $A$ SPD:

- Fra uke 5 har vi $x^TAx\ge\lambda_{\min}\|x\|_2^2$.
- Dessuten er $b^Tx\le\|b\|_2\|x\|_2$.

Derfor er

$$\phi(x)\ge\tfrac12\lambda_{\min}\|x\|_2^2-\|b\|_2\|x\|_2\to\infty.$$

Den er koersiv.

**Minste kvadrater fra uke 4**, $\|b-Ac\|_2^2$:

- **Bare nullvektoren i nullrommet til $A$:** Funksjonen er koersiv.
- **Har $A$ et nullrom:** Funksjonen er konstant langs det, og da er den
  ikke koersiv (den [flate dalen i uke 8](uke8.qmd#uke8-flat)).

:::

### Tilbake til ukens spørsmål

Vi spurte hvordan vi velger neste punkt og hvor langt vi går, når vi vet
stadig mindre. Nå kan vi fylle ut den siste kolonnen:

| Del | Metoden bruker | Steget velges slik | Hva kan vi love? |
|:--|:--|:--|:--|
| **A. Fast steg** | $f$, $\nabla f$ og krumningen i minimumet | samme $\alpha$ i hvert steg | nær minimumet: feilen ganges med $\max_i\lvert1-\alpha\lambda_i\rvert$ når $\alpha<2/\lambda_{\max}$; antall steg vokser med $\kappa$ |
| **B. Armijo** | $f$ og $\nabla f$ | start med $\alpha=1$, halver til $f$ synker nok | $f$ synker i hvert steg |
| **C. Kompassøk** | bare $f$ | halver $\Delta$ når ingen nabo er bedre | $f$ synker; en mislykket runde gir $\lVert\nabla f\rVert_2\le\sqrt n\,K\Delta/2$ |
| **D. Garantien** | krav til $f$: koersiv | | B og C: iteratene er begrenset, og grensepunktene er stasjonære |

- **Kravet til funksjonen:** Jo mindre metoden vet, desto mer må vi kreve av
  **funksjonen** for å kunne love noe.
- **Hvorfor nedgang ikke er nok:** Uten koersivitet (eller en annen grunn
  til at $L_0$ er begrenset) kan en metode som alltid går nedover, likevel
  aldri komme fram, som i eksperiment 5.

Garantien følger ikke av metoden alene.

**Øv på del D:** [regneoppgavene D](#uke9-oppg-d).

## 9.6 Regneoppgaver {quiz=uke9-6-oppgaver}

::: {#uke9-oppgaver}
:::

Oppgavene er ordnet etter ukens fire deler. Regn uten kode først.

- **Svarform:** Svar eksakt (hele tall, brøker eller uttrykk).
- **Uttrykk:** Bruk `*` for multiplikasjon og `^` for potens.
- **Ja/nei:** Skriv **1 for ja, 0 for nei**.
- **Begrunnelser:** Skriv dem i egne notater.

::: {#uke9-oppg-a}
:::

### A. Fast steg

For Himmelblaus funksjon er $u=x^2+y-11$ og $w=x+y^2-7$, og gradientens
komponenter er $4xu+2w$ og $2u+4yw$. Start i $z_0=(1,1)$:

1. Finn negativ gradient.
2. Finn punktet etter ett steg med $\alpha=1/100$.
3. Avgjør om verdien synker.

```{math-exercise}
#| label: week9-task-first-gradient-step
#| context: week9-himmelblau-definition
#| caption: Gradient og første steg fra (1, 1)
#| mode: equivalent
#| partial-credit: true
#| field-labels: negativ gradients første komponent, negativ gradients andre komponent, nytt punkts første koordinat, nytt punkts andre koordinat, verdien synker

$-\nabla f(1,1)=$ vec[46,38]

$z_1=$ vec[73/50,69/50]

Er $f(z_1)<f(z_0)$? _[1]
```

For $f(x)=2x^2$ er minimumet $r=0$ og krumningen $f''=4$.

1. Skriv steget $x_{k+1}=x_k-\alpha f'(x_k)$ som
   $x_{k+1}=(\text{faktor})\cdot x_k$, slik som for parabelen i 9.1.
2. Finn faktoren for to steglengder og avgjør om metoden konvergerer.
3. Finn det kritiske steget.

```{math-exercise}
#| label: week9-task-one-dimension
#| caption: Faktoren per steg for parabelen 2x²
#| mode: equivalent
#| partial-credit: true
#| field-labels: faktor ved alpha 3/10, konvergerer ved 3/10, faktor ved alpha 3/5, konvergerer ved 3/5, kritisk steg

$\alpha=3/10$: faktor _[-1/5], konvergerer _[1]

$\alpha=3/5$: faktor _[-7/5], konvergerer _[0]

Kritisk steg: _[1/2]
```

Hva ser du i iteratene når faktoren er negativ? Sammenlign med helningsregelen
fra uke 2.

I et minimumspunkt er Hessianen $H_*=\begin{bmatrix}5&2\\2&2\end{bmatrix}$.

1. Finn egenverdiene og det kritiske steget.
2. Avgjør om gradientmetoden konvergerer lokalt med $\alpha=3/10$ og med
   $\alpha=7/20$.
3. Finn konvergensfaktoren $S$ for $\alpha=3/10$.

```{math-exercise}
#| label: week9-task-critical-step
#| caption: Kritisk steg og konvergensfaktor fra egenverdiene
#| mode: equivalent
#| partial-credit: true
#| field-labels: minste egenverdi, største egenverdi, kritisk steg, konvergerer ved 3/10, konvergerer ved 7/20, konvergensfaktor ved 3/10

Egenverdier: minste _[1], største _[6]

$\alpha_{\text{krit}}=$ _[1/3]

Konvergerer med $\alpha=3/10$? _[1]
Konvergerer med $\alpha=7/20$? _[0]

$S$ ved $\alpha=3/10$: _[4/5]
```

Hvilken egenretning bestemmer $S$ her?

La $f(x,y)=2x^2+\tfrac12y^2$, med Hessian $\operatorname{diag}(4,1)$ overalt.
Dette er den diagonale skålen fra 9.2, med krumning $4$ langs $x$ og $1$ langs
$y$, altså $\lambda_1=1$ og $\lambda_2=4$.

1. Finn kondisjonstallet, det beste faste steget og konvergensfaktoren med
   dette steget.
2. Finn til slutt det minste antallet steg $k$ som gir $S^k\le10^{-8}$.

```{math-exercise}
#| label: week9-task-conditioning
#| caption: Beste faste steg og antall steg for en diagonal skål
#| mode: equivalent
#| partial-credit: true
#| field-labels: kondisjonstall, beste faste steg, beste konvergensfaktor, antall steg

$\kappa=$ _[4]

$\alpha_{\text{best}}=$ _[2/5]

$S_{\text{best}}=$ _[3/5]

Antall steg: _[37]
```

Hvor mange steg ville du vente for $\kappa=40$? Begrunn uten å regne nøyaktig.

::: {#uke9-oppg-b}
:::

### B. Armijo

Ved et punkt er $f(z)=10$ og $\nabla f(z)^Tp=-20$. Vi prøver $\alpha=1/2$ med
Armijo-faktor $10^{-4}$ og måler $f(z+\alpha p)=9$. Regn ut høyresiden
$f(z)+10^{-4}\alpha\nabla f(z)^Tp$ som en brøk, og avgjør om steget godtas.

```{math-exercise}
#| label: week9-task-armijo
#| caption: Godta eller avvise ett steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: høyreside i Armijo-testen, steget godtas

Høyreside: _[9999/1000]

Godtas: _[1]
```

Nå hele linjesøket, i én variabel. La $f(x)=x^4$ og start i $x=1$. Retningen er
$p=-f'(1)$.

- **Søkeregelen:** Armijo-søket prøver $\alpha=1,\ 1/2,\ 1/4,\dots$ og godtar
  det første steget som oppfyller $f(1+\alpha p)\le f(1)+10^{-4}\alpha f'(1)p$.
- **Regn ut:** Finn $f$ i de to første prøvepunktene, steget som godtas og det
  nye punktet.

```{math-exercise}
#| label: week9-task-armijo-halving
#| caption: Halver til Armijo-testen godtar steget
#| mode: equivalent
#| partial-credit: true
#| field-labels: f etter steget alpha 1, f etter steget alpha 1/2, godtatt steglengde, nytt punkt

$f(1+p)=$ _[81]

$f(1+\tfrac12p)=$ _[1]

Godtatt $\alpha=$ _[1/4]

Nytt punkt: $x=$ _[0]
```

Hva ville gradientmetoden med fast steg $\alpha=1/2$ gjort fra $x=1$? Sammenlign
med 2-syklusen i eksperiment 1.

::: {#uke9-oppg-c}
:::

### C. Kompassøk

For Himmelblaus funksjon står kompassøket i $(1,1)$ med $\Delta=1$. Prøv de
fire naboene $(2,1)$, $(0,1)$, $(1,2)$ og $(1,0)$, og bruk regelen fra 9.4.
Hvor står søket etter runden, og hva er verdien der?

```{math-exercise}
#| label: week9-task-compass-first
#| context: week9-himmelblau-definition, week9-compass-rule
#| caption: Én kompassrunde fra (1, 1)
#| mode: equivalent
#| partial-credit: true
#| field-labels: nytt punkts første koordinat, nytt punkts andre koordinat, ny funksjonsverdi

Nytt punkt: $x=$ _[2], $y=$ _[1]

Funksjonsverdi: _[52]
```

Et kompassøk står i $(3,2)$ med $\Delta=1/2$. Ingen av de fire naboene gir
lavere verdi. Oppgi punkt og steg etter regelen fra 9.4.

```{math-exercise}
#| label: week9-task-compass-shrink
#| context: week9-compass-rule
#| caption: Mislykket runde – bli stående og halver
#| mode: equivalent
#| partial-credit: true
#| field-labels: første koordinat, andre koordinat, ny stegstørrelse

Nytt punkt: $x=$ _[3], $y=$ _[2]

Ny $\Delta=$ _[1/4]
```

*Valgfri.* En prøverunde i to variabler mislykkes med $\Delta=1/100$. Nær
punktet er $|\partial^2f/\partial x^2|\le10$ og $|\partial^2f/\partial y^2|\le10$.
Gi den øvre grensen for $\|\nabla f\|_2$ fra 9.4.

```{math-exercise}
#| label: week9-task-compass-bound
#| context: week9-compass-gradient-bound
#| caption: Gradientgrensen fra en mislykket runde (valgfri)
#| mode: equivalent
#| field-labels: øvre grense for gradientnormen

$\|\nabla f\|_2\le$ _[sqrt(2)/20]
```

Hvorfor må runden prøve både $+\Delta$ og $-\Delta$ langs hver akse for at
grensen skal gjelde?

*Hører til fordypningen «Hvorfor ikke bare prøve mange punkter?» i 9.4.* Et
gitter har 9 verdier i hver koordinat. Hvor mange funksjonsverdier må beregnes
i to dimensjoner, og hvor mange i seks?

```{math-exercise}
#| label: week9-task-grid-count
#| caption: Antall gitterpunkter i to og seks dimensjoner (fordypning)
#| mode: equivalent
#| partial-credit: true
#| field-labels: evalueringer i to dimensjoner, evalueringer i seks dimensjoner

To dimensjoner: _[81]

Seks dimensjoner: _[531441]
```

::: {#uke9-oppg-d}
:::

### D. Garantien

Avgjør om funksjonene er koersive på hele planet. For en funksjon som ikke er
koersiv: finn en linje eller kurve der $\|z\|_2\to\infty$ mens funksjonen
**ikke** går mot $+\infty$ (den kan holde seg begrenset eller gå mot $-\infty$).

```{math-exercise}
#| label: week9-task-coercive
#| caption: Koersiv eller ikke?
#| mode: equivalent
#| partial-credit: true
#| field-labels: x^2 + 2y^2 koersiv, x^2 + y^2 - 4xy koersiv, e^x + y^2 koersiv, x^4 + y^2 koersiv

$x^2+2y^2$: _[1]

$x^2+y^2-4xy$: _[0]

$e^x+y^2$: _[0]

$x^4+y^2$: _[1]
```

Hva kan du si om iteratene til Armijo-søket for hver av de fire funksjonene?

## 9.7 Python: mål og tilpass {quiz=uke9-7-oppgaver}

::: {#uke9-python}
:::

Fullfør én eller to linjer i hver oppgave. Hver celle har egne importer og
egne funksjonsdefinisjoner og kan kjøres uavhengig. Kontrollene vurderer
resultatet uten å vise løsningskode.

::: {#uke9-py-a}
:::

### A. Fast steg

Listen `errors` inneholder feilene $e_0,e_1,\ldots,e_k$ fra en kjøring.

- **Returner:** $(e_k/e_{k-10})^{1/10}$, altså den gjennomsnittlige faktoren
  over de ti siste stegene.
- **Hvorfor ti?** I eksperiment 1 brukte vi et snitt over to steg. Et snitt
  over ti steg tåler enda bedre at feilen svinger.

```{py-exercise}
#| label: week9-python-rate
#| caption: Anslå konvergensfaktoren fra en liste med feil
#| show-test-hints: false
import numpy as np

def rate_estimate(errors):
    # TODO: Bruk siste feil og feilen ti steg før.
    return None

## TESTS ##
assert np.isclose(rate_estimate([0.5**k for k in range(30)]), 0.5)
assert np.isclose(rate_estimate([10., 1.] + [0.8**k for k in range(20)]), 0.8)
assert np.isclose(rate_estimate([0.5**k*(1 + 0.5*(-1)**k) for k in range(31)]), 0.5)
```

::: {#uke9-py-b}
:::

### B. Armijo

Armijo-testen trenger verdien i punktet, verdien i kandidaten og
starthelningen langs retningen. Returner den oppdaterte steglengden: den samme
hvis testen godtar den, ellers halvparten. Terskelen er regnet ut for deg.

```{py-exercise}
#| label: week9-python-armijo-step
#| caption: Test én steglengde mot Armijo-kravet
#| show-test-hints: false
import numpy as np

# Samme test som i 9.3, men med tall gitt direkte som argumenter.
def accept_or_halve(start_value, candidate_value, slope, alpha):
    threshold = start_value + 1e-4 * alpha * slope
    if candidate_value <= threshold:
        # TODO: Godkjenn steglengden.
        return None
    # TODO: Halver steglengden.
    return None

## TESTS ##
assert np.isclose(accept_or_halve(10., 9., -20., .5), .5)
assert np.isclose(accept_or_halve(10., 10., -20., .5), .25)
assert np.isclose(accept_or_halve(8., 7.999, -10., 1.), 1.)
assert np.isclose(accept_or_halve(8., 8.1, -10., 1.), .5)
```

::: {#uke9-py-c}
:::

### C. Kompassøk

Fullfør én prøverunde. Returner den beste naboen dersom verdien synker;
ellers returner det opprinnelige punktet og halvparten av stegstørrelsen. De
fire retningene og sammenligningen er gitt.

```{py-exercise}
#| label: week9-python-compass-round
#| caption: Fullfør én runde med kompassøk
#| show-test-hints: false
import numpy as np

# Denne enklere skålen gjør det lett å kontrollere både flytting og halvering.
def f(z):
    return (z[0] - 2)**2 + (z[1] - 1)**2

def compass_round(z, step):
    directions = np.array([[1., 0.], [-1., 0.], [0., 1.], [0., -1.]])
    # TODO: Lag de fire naboene ved hjelp av z, step og directions.
    trials = np.empty((0, 2))
    values = np.array([f(t) for t in trials])
    best = np.argmin(values)
    if values[best] < f(z):
        return trials[best], step
    # TODO: Behold z og halver step når ingen er bedre.
    return z, step

## TESTS ##
assert np.allclose(compass_round(np.array([0., 0.]), 1.)[0], [1., 0.])
assert np.isclose(compass_round(np.array([0., 0.]), 1.)[1], 1.)
assert np.allclose(compass_round(np.array([2., 1.]), .5)[0], [2., 1.])
assert np.isclose(compass_round(np.array([2., 1.]), .5)[1], .25)
```

*Hører til fordypningen «Hvorfor ikke bare prøve mange punkter?» i 9.4.*
Funksjonen er ferdig gitt; bruk de oppgitte punktene, og returner paret
`(punkt, verdi)` for punktet med lavest verdi.

```{py-exercise}
#| label: week9-python-best-sample
#| caption: Finn beste punkt i en endelig prøveliste (fordypning)
#| show-test-hints: false
import numpy as np

# Hvert innsendt punkt er en vektor med koordinatene x og y.
def f(z):
    x, y = z
    return (x*x + y - 11)**2 + (x + y*y - 7)**2

def best_sample(points):
    # TODO: Lag en array med f-verdien i hvert punkt.
    values = np.array([])
    # TODO: Finn indeksen til laveste verdi.
    index = 0
    return points[index], values[index]

## TESTS ##
assert np.allclose(best_sample(np.array([[0., 0.], [3., 2.]]))[0], [3., 2.])
assert np.isclose(best_sample(np.array([[0., 0.], [3., 2.]]))[1], 0.)
assert np.allclose(best_sample(np.array([[0., 0.], [1., 0.]]))[0], [1., 0.])
assert np.isclose(best_sample(np.array([[0., 0.], [1., 0.]]))[1], 136.)
```

I [uke 10](uke10.qmd) bruker vi Hessianen til å forme selve retningen. Da
forsvinner kondisjonstallet fra farten nær minimumet, men vi må fortsatt
kontrollere funksjonsverdien før et steg godtas.

:::
