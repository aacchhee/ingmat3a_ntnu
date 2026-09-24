## Samme løsning, mindre arbeid?

I uke 6 så vi at en smal skål kan gjøre veien mot minimumet vanskelig.
CG velger søkeretningene med omtanke, men må fortsatt arbeide med
matrisen vi gir metoden. Nå skal vi undersøke en annen mulighet:
**Kan vi velge en bedre skala på koordinatene før vi begynner?**

Tenk på et kart der de to aksene bruker svært ulike målestokker.
Et koordinatskifte endrer hvordan kartet ser ut, men ikke hvilket
sted vi vil fram til. På samme måte skal vi endre beskrivelsen av
et likningssystem og kunne oversette svaret tilbake til den samme
løsningen. Spørsmålet er om CG da får mindre arbeid å gjøre.

Prosjektet starter med to ukjente og en regning på papir. Deretter
prøver vi ideen på større systemer, forklarer hva som endres og
bygger **diagonalt prekondisjonert CG (PCG)**. Til slutt velger du
ett eget forsøk som undersøker når denne ideen hjelper.

Du får ferdig CG, forsøksdata og plotteverktøy. Kodeoppgaven består
av tre uttrykk i PCG. Den viktigste jobben er å **begrunne at
problemet er bevart, forutsi virkningen og tolke resultatene**.

### En vei gjennom prosjektet

| Del | Spørsmålet vi arbeider med | Det du tar med videre |
|:--|:--|:--|
| 1. En skål i nye koordinater | Kan samme minimum få en enklere beskrivelse? | Et gjennomregnet $2\times2$-eksempel. |
| 2. Fra eksempel til metode | Hvorfor bevares løsningen og SPD? | Omregningsformlene og en begrunnelse. |
| 3. To større systemer | Når fjerner skalering den vanskelige delen? | En forutsigelse og to referansekjøringer. |
| 4. Fra koordinatskifte til PCG | Hvordan får vi effekten uten å bygge en ny matrise? | En utledning, tre kodeuttrykk og fire kontroller. |
| 5. Din undersøkelse | Hvor langt rekker forklaringen vår? | Ett kontrollert par og en avgrenset konklusjon. |

Skriv en kort forventning før hvert forsøk. Kjør så, beskriv hva du
ser, og bruk matematikken til å forklare forskjellen. Utregningene
kan stå i egne tekstceller; de trenger ikke flettes inn i programkoden.

### Det vi trenger fra uke 6

Her er begrepene vi bruker, samlet på ett sted:

- **SPD:** $A^T=A$ og $z^TAz>0$ for alle $z\ne0$. Da har
  $\phi(x)=\tfrac12x^TAx-b^Tx$ ett minimum, som er løsningen av $Ax=b$.
- **Residual:** $r=b-Ax$ måler avviket i likningene. Den er negativ
  gradient til $\phi$. Relativ residual er $\lVert r\rVert_2/\lVert b\rVert_2$.
- **Feil:** Når vi kjenner løsningen $x_*$, kan vi også måle
  $\lVert x-x_*\rVert_2/\lVert x_*\rVert_2$. Liten residual og liten
  feil er forskjellige krav.
- **Kondisjonstall:** $\lVert A\rVert_2=\max_{\lVert z\rVert_2=1}\lVert Az\rVert_2$
  er største strekkfaktor. For SPD er
  $\kappa_2(A)=\lVert A\rVert_2\lVert A^{-1}\rVert_2=\lambda_{\max}/\lambda_{\min}$.
  Forholdet sier noe om følsomhet og skålform, men bestemmer ikke
  alene antall CG-steg.

CG minimerer langs **A-konjugerte retninger**, som oppfyller
$p_i^TAp_j=0$ når $i\ne j$. Dette gjør at en ny minimering bevarer
de tidligere. I eksakt regning er høyst $n$ steg nok for $n$ ukjente;
avrunding kan gjøre at flere steg trengs. Residualnormen trenger
ikke avta i hvert enkelt steg.

Vil du se flere bilder, finnes de i [6.3 om residual og kondisjon](uke6.qmd#uke6-residual),
[6.4 om skålen](uke6.qmd#uke6-energi) og [6.6 om CG](uke6.qmd#uke6-cg).
Alle opplysninger du trenger for prosjektet, står også her.

### Kjøring på siden eller i egen notebook

Oppsettet på denne siden lastes automatisk og inneholder alle
hjelpefunksjonene. Start med del 1 og kjør cellene i rekkefølge.
Den ferdige CG-koden ligger i oppsettet; PCG-malen åpner du i del 4.

<details>
<summary>Egen notebook: last ned oppsettet og kom i gang</summary>

Last ned [project_week6_setup.py](../assets/project_week6_setup.py){download="project_week6_setup.py"}
og legg filen ved siden av notebooken. Kjør først

```python
from project_week6_setup import *
```

Miljøet trenger NumPy og Matplotlib. Filen inneholder de samme
hjelpefunksjonene og datakonstruksjonene som siden, og kan brukes
uten nett etter nedlasting. Den inneholder ingen ferdig PCG-løsning.
Kopier deretter forsøkscellene og PCG-malen fra prosjektet. Etter at
du har fullført malen, skal hele notebooken kunne kjøres med
**Restart / Run all**. Ta med oppsettsfilen ved levering.
Importlinjen brukes bare i egen notebook.

</details>

## 1. Begynn med en skål vi kan regne på

Vi starter med

$$A_2=\begin{bmatrix}1&2\\2&100\end{bmatrix},\qquad
b_2=\begin{bmatrix}3\\102\end{bmatrix}.$$

Løsningen er $x_*=(1,1)^T$. Matrisen er symmetrisk, og
$z^TA_2z=(z_1+2z_2)^2+96z_2^2>0$ for $z\ne0$, så den er SPD.
Den tilhørende funksjonen er

$$\phi(x_1,x_2)=\tfrac12x_1^2+2x_1x_2+50x_2^2-3x_1-102x_2.$$

Kvadratleddene har svært ulik størrelse. La oss prøve
$y_1=x_1$ og $y_2=10x_2$. Tilbake får vi $x_1=y_1$ og $x_2=y_2/10$.

**Før du kjører:**

1. Kontroller løsningen $x_*$. Hvilke koordinater får den i $y$?
2. Sett koordinatskiftet inn i $\phi$. Hva skjer med kvadratleddene?
3. Sett det inn i likningssystemet, og del den andre likningen på
   $10$. Skriv det nye systemet som $\widetilde A_2y=\widetilde b_2$.
4. Forutsi om nivåkurvene blir rundere. Hvorfor er det ikke nok å
   endre matrisen og beholde den gamle høyresiden?

Når du har et forslag, kan du kontrollere det og se på figuren:

```{pyodide-python}
#| label: project-week6-contours
A2 = np.array([[1.,2.],[2.,100.]])
s2 = np.array([1.,1.]); b2 = A2 @ s2
w = 1/np.sqrt(np.diag(A2))
At2 = w[:,None]*A2*w[None,:]
bt2 = w*b2
print('Ny matrise:', At2, 'Ny høyreside:', bt2, sep='\n')
show_coordinate_change(A2, b2, At2, bt2)
```

Hjelperen `show_coordinate_change` tegner nivåkurvene før og etter
omregningen. Stjernene er minimumspunktene. Venstre bilde bruker
$x$-koordinater, høyre bruker $y$-koordinater; aksene har derfor
forskjellige betydninger. **Oversett stjernen i høyre bilde tilbake
til $x$. Får du samme løsning?**

<details>
<summary>Regnehjelp: samme minimum i to koordinatsystemer</summary>

Etter innsetting er funksjonen

$$\widetilde\phi(y_1,y_2)
=\tfrac12y_1^2+0.2y_1y_2+\tfrac12y_2^2-3y_1-10.2y_2.$$

Begge kvadratkoeffisientene er nå $1/2$. Likningssystemet blir

$$\widetilde A_2=\begin{bmatrix}1&0.2\\0.2&1\end{bmatrix},\qquad
\widetilde b_2=\begin{bmatrix}3\\10.2\end{bmatrix}.$$

Minimumet er $y_*=(1,10)^T$, som gir $x_*=(1,1)^T$ etter omregning.
Vi har $\widetilde\phi(y)=\phi(x)$ for punkter som svarer til hverandre.
Det er derfor samme minimeringsproblem i nye koordinater.

Egenverdiene til $\widetilde A_2$ er $1.2$ og $0.8$, så kondisjonstallet
er $1.5$. Kryssleddet er fortsatt med: kurvene er blitt rundere,
men er ikke helt sirkulære. Koordinatskiftet har heller ikke endret
hvilket fysisk eller matematisk svar vi søker i de opprinnelige variablene.

</details>

**Ta med videre:** Skriv de to systemene og pilene mellom $x$ og $y$
ved siden av hverandre. Dette er modellen for resten av prosjektet.

## 2. Gjør omregningen generell

I eksemplet delte vi andre koordinat på kvadratroten av det andre
diagonalelementet. For en generell SPD-matrise velger vi

$$M=\operatorname{diag}(A),\qquad m_i=a_{ii}>0.$$

$M^{1/2}$ er diagonalmatrisen med $\sqrt{m_i}$ på diagonalen,
og $M^{-1/2}$ har $1/\sqrt{m_i}$. Å bruke disse matrisene betyr
bare å gange eller dele koordinatvis. Vi trenger ingen tett invers.

Vi setter $x=M^{-1/2}y$. **Gjør først omregningen selv:** Sett dette
inn i $Ax=b$, og multipliser begge sider fra venstre med $M^{-1/2}$.
Du skal ende med

$$\underbrace{M^{-1/2}AM^{-1/2}}_{\widetilde A}y
=\underbrace{M^{-1/2}b}_{\widetilde b},\qquad x=M^{-1/2}y.$$

Å bruke et enkelt hjelpesystem til å gjøre CG-problemet lettere
kalles **prekondisjonering**. Her bruker vi diagonalen, så metoden
kalles diagonal prekondisjonering, også kjent som Jacobi-prekondisjonering.
Navnet betyr ikke at vi utfører Jacobi-iterasjoner.

**Tre korte matematiske kontroller:**

1. Vis at diagonalen til $\widetilde A$ består av ettall.
2. Vis at $\widetilde A$ er symmetrisk og positivt definit.
3. La $r=b-Ax$ og $\widetilde r=\widetilde b-\widetilde Ay$.
   Finn sammenhengen mellom residualene. Betyr like små residualnormer
   i de to koordinatsystemene det samme?

<details>
<summary>Gå i dybden: symmetri, positiv definitet og residual</summary>

Det nye diagonalelementet er $a_{ii}/(\sqrt{m_i}\sqrt{m_i})=1$.
Symmetrien følger av at $M^{-1/2}$ er diagonal og $A^T=A$:

$$\widetilde A^T=M^{-1/2}A^TM^{-1/2}=\widetilde A.$$

For $z\ne0$ er også $M^{-1/2}z\ne0$, og

$$z^T\widetilde Az=(M^{-1/2}z)^TA(M^{-1/2}z)>0.$$

Vi har dermed bevart forutsetningene for vanlig CG.
Matrisen $M^{-1}A$ er derimot generelt ikke symmetrisk i det vanlige
indreproduktet. Vi skal derfor ikke bare sende den til CG-rutinen.

Residualene henger sammen ved

$$\widetilde r=M^{-1/2}b-M^{-1/2}AM^{-1/2}y=M^{-1/2}r.$$

De to normene måler ulik skalering av samme avvik. Et stoppkrav på
$\lVert\widetilde r\rVert_2$ er derfor ikke automatisk det samme som
et stoppkrav på $\lVert r\rVert_2$.

</details>

**Ta med videre:** Vi kan bruke CG på det nye systemet og regne svaret
tilbake. Når vi sammenligner metoder senere, skal begge kontrolleres
med residualen i **det opprinnelige systemet**.

## 3. To større systemer – vil samme tiltak hjelpe begge?

Nå går vi fra to til 60 ukjente. Vi bruker to ferdige SPD-systemer
med forskjellig årsak til ulik skalering av retninger:

| System | Slik er matrisen bygd | Hva kan diagonalen hjelpe med? |
|:--|:--|:--|
| Ujevn skalering | $A=DBD$. $B$ har $2$ på diagonalen og $-0.25$ på nabodiagonalene. $D$ har positive verdier fra $1$ til $100$. | Koordinatene har fått svært ulike skalaer. |
| Poisson | $A$ har $2$ på diagonalen og $-1$ på nabodiagonalene. Ellers er elementene null. | Diagonalen er allerede lik overalt; nabokoblingen er sterkere. |

Her er $D$ bare navnet på skaleringen som brukes til å lage det første
forsøksproblemet. Prekondisjoneringen heter fortsatt $M=\operatorname{diag}(A)$.
Vi velger samme kjente løsning $x_*$ og lager $b=Ax_*$ i begge systemene.
Høyresidene blir forskjellige. Dette lar oss måle faktisk feil i forsøket;
i et praktisk problem kjenner vi vanligvis ikke løsningen.

### Først et sammenligningsgrunnlag

**Forutsi:** Trenger to systemer med samme størrelse like mange CG-steg?
Kjør vanlig CG fra nullstart, og noter oppnådd residual og om metoden
faktisk nådde stoppkravet.

```{pyodide-python}
#| label: project-week6-baseline
x_star, problems = make_week6_problems(n=60)
baseline = {}
for name, A in problems.items():
    b = A @ x_star
    result = cg(A, b)
    baseline[name] = result
    print(name, 'steg:', len(result['path'])-1,
          'relativ residual:', result['residuals'][-1]/np.linalg.norm(b),
          'konvergert:', result['converged'])
```

`make_week6_problems` lager nettopp matrisene beskrevet i tabellen,
med fast tilfeldig frø for den kjente løsningen. `cg` er den ferdige
referansemetoden. Den stopper på en direkte beregning av $b-Ax$ og
returnerer løsningsforslagene i `path`, residualnormene i `residuals`
og et sannhetsverdi-felt `converged`.

### Forutsi før du skalerer

Bruk matrisebeskrivelsene over til å vise

$$M=2D^2\quad\text{og}\quad\widetilde A=B/2
\quad\text{for ujevn skalering},$$

$$M=2I\quad\text{og}\quad\widetilde A=A/2
\quad\text{for Poisson-systemet}.$$

**Hva fjernes i det første tilfellet? Hva endres ikke i det andre?**
Skriv en forventning om kondisjonstall og arbeidsmengde før neste kjøring.

```{pyodide-python}
#| label: project-week6-transform
transformed = {}
for name, A in problems.items():
    b = A @ x_star
    invroot = 1/np.sqrt(np.diag(A))
    At = invroot[:,None] * A * invroot[None,:]
    bt = invroot*b
    out = cg(At, bt, rtol=1e-12)
    x_path = out['path'] * invroot[None,:]
    transformed[name] = (At, x_path)
    print(name, 'original relativ residual etter omregning:',
          np.linalg.norm(b-A@x_path[-1])/np.linalg.norm(b))
```

`invroot[:,None]` skalerer radene og `invroot[None,:]` kolonnene.
De to linjene for `At` og `bt` er omregningen fra del 2 skrevet i NumPy.
Her stopper CG på den **transformerte** residualen. Dette er en kontroll
av koordinatskiftet, ikke en rettferdig sammenligning av antall steg.
Den kommer i del 5.

Se deretter på **spekteret**, altså samlingen av egenverdier:

```{pyodide-python}
#| label: project-week6-spectrum
show_spectra(problems, transformed)
```

Hvert punkt i figuren er en egenverdi, sortert fra minst til størst.
Den loddrette aksen er logaritmisk. Hjelperen viser begge spektrene
og skriver ut kondisjonstallene. **Se etter forholdet mellom
største og minste verdi, ikke bare om punktene flytter seg nedover.**
Sammenlign med forventningen din.

<details>
<summary>Gå i dybden: hvorfor er matrisene SPD, og hva forklarer forskjellen?</summary>

For det første systemet er $M=2D^2$ og
$M^{-1/2}=D^{-1}/\sqrt2$, fordi diagonalen i $D$ er positiv. Dermed

$$\widetilde A=\frac1{\sqrt2}D^{-1}(DBD)D^{-1}\frac1{\sqrt2}=B/2.$$

Forskjellen mellom koordinatskaleringene er fjernet.
$B$ er symmetrisk og strengt diagonaldominant med positiv diagonal.
Egenverdiene ligger mellom $1.5$ og $2.5$, så $B$ er SPD.
Dessuten er $z^TDBDz=(Dz)^TB(Dz)>0$ for $z\ne0$.
Det beviser at også forsøksmatrisen er SPD.

For Poisson-systemet er $M=2I$, så $\widetilde A=A/2$.
Alle egenverdier halveres, men forholdet mellom største og minste
forblir det samme. I eksakt regning får CG den samme banen i de
opprinnelige koordinatene med denne skalare prekondisjoneringen.
Små flyttallsforskjeller er ikke en systematisk forbedring.

For å se at Poisson-matrisen er SPD, sett $z_0=z_{n+1}=0$. Da er

$$z^TAz=\sum_{i=0}^n(z_{i+1}-z_i)^2>0\qquad(z\ne0).$$

Summen kan bare være null når alle naboforskjellene er null; med
randverdiene null betyr det at hele vektoren er null.

</details>

**Ta med videre:** En god forklaring må skille mellom å fjerne ujevn
koordinatskala og å endre koblingen mellom koordinater. At diagonalen
blir lik én, er ikke alene et bevis på at CG får mindre arbeid.

## 4. Fra koordinatskifte til PCG

Vi har hittil bygd $\widetilde A$ og regnet i $y$-koordinater.
PCG får den samme virkningen ved å arbeide direkte med $A$ og løse
et enkelt hjelpesystem for hver residual:

$$Mz=r\quad\Longrightarrow\quad z_i=\frac{r_i}{m_i}.$$

Her er $z$ en **skalert residual**, ikke en ny løsning av $Ax=b$.
I koden lagrer vi bare diagonalen som vektoren `m`; løsningen av
$Mz=r$ er derfor koordinatvis divisjon.

### Finn de nye størrelsene før du åpner malen

I vanlig CG inngår $r^Tr$. Men residualen i de nye koordinatene er
$\widetilde r=M^{-1/2}r$.

1. Vis at $\widetilde r^T\widetilde r=r^TM^{-1}r=r^Tz$.
2. Første CG-retning i $y$-koordinater er $\widetilde p_0=\widetilde r_0$.
   Omregn denne til en retning i $x$-koordinater. Vis at $p_0=z_0$.
3. Sett $p=M^{-1/2}\widetilde p$ inn i
   $\widetilde p^T\widetilde A\widetilde p$. Hvorfor blir nevneren
   i linjesøket fortsatt $p^TAp$?

Disse tre regningene forklarer de viktigste endringene fra CG til PCG.
Vi kaller den nye telleren $\gamma=r^Tz$.

<details>
<summary>Regnehjelp: omregn residual og søkeretning</summary>

Siden $M^{-1/2}$ er symmetrisk, får vi

$$\widetilde r^T\widetilde r
=r^TM^{-1/2}M^{-1/2}r=r^TM^{-1}r=r^Tz.$$

Den første retningen i opprinnelige koordinater blir

$$p_0=M^{-1/2}\widetilde p_0
=M^{-1/2}\widetilde r_0=M^{-1}r_0=z_0.$$

Og for en vilkårlig søkeretning er

$$\widetilde p^T\widetilde A\widetilde p
=\widetilde p^TM^{-1/2}AM^{-1/2}\widetilde p=p^TAp.$$

Derfor får linjesøket telleren $r^Tz$ og nevneren $p^TAp$.
Omregning av retningsoppdateringen gir $p_{k+1}=z_{k+1}+\beta_kp_k$,
med $\beta_k=\gamma_{k+1}/\gamma_k$.
Vi bruker en fast SPD-prekondisjonering gjennom hele kjøringen;
det er forutsetningen for denne PCG-oppskriften.

</details>

### Oppskriften du skal kode

Les pseudokoden med papirregningen ved siden av. Det er tre steder
der den skal kobles til Python i malen: hjelpesystemet, `beta` og
neste retning.

```text
r = b − A x
Hvis original residual er liten nok: stopp.
z = løs M z = r
p = z; gamma = rᵀ z
Gjenta:
    Ap = A p
    alpha = gamma / (pᵀ Ap)
    x = x + alpha p
    r = r − alpha Ap
    Kontroller original residual b − A x; stopp hvis liten nok.
    z = løs M z = r
    gamma_ny = rᵀ z
    beta = gamma_ny / gamma
    p = z + beta p
    gamma = gamma_ny
```

<details>
<summary>Kodeverksted: åpne PCG-malen og fyll tre uttrykk</summary>

Fyll bare de tre markerte TODO-delene. Resten av malen tar hånd om
startvektor, inputkontroll, stoppkrav og telling av arbeid.
Kjør cellen på nytt etter redigering. Den definerer `pcg`, men utfører
ennå ingen av forsøkene.

```{pyodide-python}
#| label: project-week6-pcg-template
# Fullfør bare de tre TODO-delene ved hjelp av pseudokoden.
# m lagrer diagonalen til M; z er løsningen av hjelpesystemet Mz=r.
# Vi arbeider fortsatt med A og stopper på den opprinnelige residualen b-Ax.


def pcg(A, b, m, x0=None, rtol=1e-8, atol=0., max_steps=1000):
    A, b, m = np.asarray(A,float), np.asarray(b,float), np.asarray(m,float)
    if A.shape != (b.size,b.size) or not np.allclose(A,A.T):
        raise ValueError('Bruk en symmetrisk kvadratisk matrise')
    if m.shape != b.shape or np.any(m <= 0):
        raise ValueError('Prekondisjoneringen må ha positiv diagonal')
    x = np.zeros_like(b) if x0 is None else np.array(x0,float,copy=True)
    if x.shape != b.shape or rtol <= 0 or atol < 0 or max_steps < 1:
        raise ValueError('Kontroller startvektor, toleranser og maksimalgrense')
    if not all(np.all(np.isfinite(t)) for t in [A,b,m,x]):
        raise ValueError('Bruk endelige tall')
    # Residualen er ubalansen i de opprinnelige likningene, og kan beregnes uten fasit.
    r = b - A @ x
    # Startvektoren teller som første lagrede punkt, men ikke som et iterasjonssteg.
    path, residuals = [x.copy()], [np.linalg.norm(r)]
    # Absolutt margin pluss margin relativt til b; samme krav brukes ved sammenligning.
    target = atol + rtol*np.linalg.norm(b)
    matvecs, applies = 1, 0
    # Kontroller også startforslaget: en startvektor som oppfyller residualkravet skal gi stopp før noen divisjon.
    if residuals[-1] <= target:
        return {'path':np.array(path), 'residuals':np.array(residuals),
                'converged':True, 'matvecs':matvecs, 'preconditioner_calls':applies}
    def apply_M_inverse(r):
        # TODO 1: returner løsningen av M z = r ved koordinatvis divisjon.
        raise NotImplementedError('TODO 1')
    z = apply_M_inverse(r); applies += 1
    p = z.copy(); gamma = r @ z
    for k in range(max_steps):
        Ap = A @ p; matvecs += 1
        # p.T @ A @ p er positiv for en ikke-null retning når A er SPD.
        curvature = p @ Ap
        if curvature <= 0 or not np.isfinite(curvature):
            raise ValueError('PCG krever SPD')
        # PCG bruker gamma = r.T @ z i stedet for r.T @ r.
        alpha = gamma / curvature
        x = x + alpha*p
        # Kort oppdatering av residualen; avrunding kan gi avvik fra direkte beregnet b-Ax.
        r = r - alpha*Ap
        actual = np.linalg.norm(b - A @ x); matvecs += 1
        path.append(x.copy()); residuals.append(actual)
        if actual <= target:
            break
        z = apply_M_inverse(r); applies += 1
        # Indreproduktet måler residualen i de transformerte koordinatene.
        gamma_new = r @ z
        if gamma_new <= 0:
            break
        # TODO 2: beregn beta fra gamma_new og gamma.
        beta = None
        # TODO 3: oppdater søkeretningen med z og forrige p.
        p = None
        gamma = gamma_new
    return {'path':np.array(path), 'residuals':np.array(residuals),
            'converged':residuals[-1] <= target, 'matvecs':matvecs,
            'preconditioner_calls':applies}
```

Symmetrikontrollen i koden er ikke et SPD-bevis. Våre matriser er
SPD av konstruksjon, og testen på $p^TAp$ oppdager bare enkelte
brudd på forutsetningen. Direkte kontroll av $b-Ax$ brukes fordi den
kort oppdaterte residualen kan samle avrundingsfeil.

</details>

### Fire små kontroller før hovedforsøket

| Kontroll | Hva skal skje? |
|:--|:--|
| $A=\operatorname{diag}(1,100)$, $b=(1,100)^T$, $x_0=0$, $M=A$ | Ett steg gir $(1,1)^T$, opp til avrunding. |
| $M=I$ | PCG gir samme bane som CG, opp til avrunding. |
| Start i den kjente løsningen $x_0=x_*$ | Metoden stopper med null søkesteg. |
| Bruk $A_2$ fra del 1 | PCG-banen stemmer med CG-banen i nye koordinater når den regnes tilbake til $x$. |

**Begrunn forventningene før du kjører.** Deretter kan du bruke den
ferdige kontrollfunksjonen. Den tar din `pcg` som argument og sjekker
alle fire tilfellene. Hvis en kontroll feiler, gå tilbake til det
matematiske uttrykket den skal representere.

```{pyodide-python}
#| label: project-week6-checks
check_pcg(pcg)
```

**Ta med videre:** En fungerende PCG og en kort forklaring av hvorfor
hver av de fire kontrollene er relevant. Det er mer informativt enn
at programmet bare kjører uten feilmelding.

## 5. Sammenlign rettferdig – og lag din egen undersøkelse

Nå kan vi sammenligne vanlig CG og PCG med samme regler. Begge får
samme $A,b,x_0=0$, `rtol=1e-8`, `atol=0` og maksimalgrense 1000.
Begge stopper på **original residual** $\lVert b-Ax\rVert_2$.

**Skriv forventningen først:** På hvilket av de to systemene venter
du størst gevinst, og hvilken utregning fra del 3 støtter svaret?

```{pyodide-python}
#| label: project-week6-comparison
for name, A in problems.items():
    b = A @ x_star
    results = {'CG':cg(A,b), 'PCG':pcg(A,b,np.diag(A))}
    print(name)
    compare_runs(A, b, x_star, results)
```

`compare_runs` viser original relativ residual til venstre og relativ
løsningsfeil til høyre. Den vannrette aksen teller produkter av $A$
med en vektor, inkludert direkte residualkontroll. Her brukes ett
produkt i starten og to per steg, altså $1+2k$ etter $k$ steg.
Verdier under $10^{-16}$ vises ved $10^{-16}$ i logaritmeplottene.

Tabellen som skrives ut, viser også oppnådd relativ residual og
løsningsfeil, antall anvendelser av prekondisjoneringen og om
stoppkravet ble nådd. Hver anvendelse av
diagonal $M$ krever $n$ divisjoner; $n$ diagonalverdier lagres én gang.
Færre steg er derfor ikke hele kostnadsbildet. Våre tellere tar ikke
med konstruksjon av data, spektralberegning eller analyseplott.

### Din påstand og ett kontrollert par

De to ferdige systemene viser en gevinst og en begrensning. Nå skal
du undersøke om forklaringen din holder utenfor akkurat disse eksemplene.
Formuler én påstand, og velg **én** av disse veiene:

- Hold størrelse og diagonal fast, men endre koblingene utenfor
  diagonalen. Er samme diagonale skala nok til å forutsi samme gevinst?
- Hold matrisen fast, men endre den kjente løsningen og dermed
  $b=Ax_*$. Er gevinsten uavhengig av hvilke egenretninger problemet aktiverer?

For første vei kan du bruke den ferdige datakonstruksjonen
`coupled_problem(n, span, coupling)`. Den lager $A=DBD$, med positive
verdier i $D$ fra $1$ til `span`, $2$ på diagonalen i $B$ og
`-coupling` på nabodiagonalene. Når `n` og `span` holdes fast,
er diagonalen i $A$ alltid $2d_i^2$, uansett `coupling`.
Kravene er `n >= 2`, `span >= 1` og `0 <= coupling < 1`.

<details>
<summary>Gå i dybden: hvorfor er denne forsøksfamilien SPD?</summary>

$B$ er symmetrisk og strengt diagonaldominant: $2$ er større enn
summen av nabobidragene, som er høyst $2\,\text{coupling}<2$.
Med positiv diagonal gir dette positive egenverdier og dermed SPD.
Skaleringen med invertibel $D$ bevarer egenskapen:
$z^TDBDz=(Dz)^TB(Dz)>0$ når $z\ne0$.
Ved andre egne konstruksjoner må du selv begrunne at CGs
forutsetninger fortsatt er oppfylt.

</details>

Velg $x_*\ne0$; da er også $b=Ax_*\ne0$ for SPD. Dermed er
relativ residual og relativ løsningsfeil definert i forsøket ditt.

**Før kjøring skriver du ned:** påstanden, hvilke størrelser du holder
faste, hva du endrer, og hvilket resultat som ville utfordre påstanden.
Velg selv parameterverdier. Bruk samme opprinnelige residualkrav,
rapporter konvergensstatus og tell også PCGs ekstra arbeid.
En avbrutt kjøring er ikke en raskere løsning.

Lag ett kontrollert par og forklar resultatet. **Valgfritt:** Prøv
forklaringen på et nytt par med sterkere kobling eller en annen
høyreside. Vis også eventuelle motfunn, og avgrens konklusjonen til
det du faktisk har undersøkt.

### Det du leverer

Lever én kjørbar notebook eller Quarto-side med:

- papirregningene fra del 1–2 og utledningen av PCG-størrelsene fra del 4;
- fullført PCG, begrunnelser og resultater for de fire kontrollene;
- de to referanseforsøkene og din egen undersøkelse med ett kontrollert par;
- figurer med aksetitler og en tabell med steg, $A$-produkter,
  $M$-anvendelser, oppnådd residual, faktisk feil og konvergensstatus.

Skriv i tillegg en analyse på **400–600 ord** med påstand,
forsøksdesign, et mulig motfunn og en avgrenset konklusjon.
Utregningene og koden kommer utenom denne tekstmengden. Analysen skal
forklare hvorfor løsningen bevares, hva som endres i spekteret,
hva residual og feil forteller, og hvilken ekstra kostnad $M$ har.

Matrisene her er små og lagres som tette matriser for at alle
kontrollene skal være lette å gjennomføre i nettleseren. Et **glissent
system** har få ikke-null matriseelementer. Avslutt med å si hva som
må undersøkes før du overfører konklusjonen til store, glisne systemer;
kjøretiden i disse små forsøkene alene er ikke nok.
