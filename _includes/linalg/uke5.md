## 5.0 Hva overlever? {#uke5-start}

Hva skjer hvis vi bruker den samme matrisen på en pil mange ganger?
Og kan den samme regneoperasjonen brukes til å rangere nettsider?

Vi begynner med å prøve. Deretter forklarer vi mønsteret vi ser, og bygger
matematikken som trengs for å undersøke når det virker.

<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Selvstudium</button>
<span role="status" aria-live="polite"></span>
</div>

Begge visninger følger samme løype. **Prøv og lag en hypotese før du leser
forklaringen.** «Forklaring steg for steg» åpnes i selvstudium; hint,
løsningsforslag og fordypninger åpner du selv. Uten JavaScript kan alle
forklaringene fortsatt åpnes enkeltvis.

**I forelesningen:** [en retning vokser fram](#uke5-erfaring) →
[finn retningene](#uke5-egen) → [forklar gjentakelsen](#uke5-basis) →
[bygg og utfordre metoden](#uke5-potens) → [besøk på et nettverk](#uke5-nett) →
[en felle og en utvei](#uke5-google).

Etter uken skal du kunne finne egenverdier og egenvektorer i små eksempler,
forklare gjentatt multiplikasjon i en egenvektorbasis, implementere og
kontrollere potensmetoden og forklare PageRank som en stasjonær fordeling.

```{pyodide-python}
#| label: week5-setup
#| autorun: true
#| context: setup
import numpy as np
import matplotlib.pyplot as plt
```

## 5.1 En retning vokser fram {#uke5-erfaring}

### Prøv før vi forklarer

Matrisen er

$$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}.$$

Dra startpilen og trykk **Ett steg** flere ganger. Vi regner ut $Ax$ og
skalerer svaret til lengde én for å holde pilen i bildet.
**Gjett først:** Vil retningen fortsette å endre seg, gå i sirkel eller nærme
seg en bestemt linje? Prøv startpiler på begge sider av origo.

```{.jsxgraph width="620" height="440"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-1.6, 1.6, 1.6, -1.6], axis: true,
  showCopyright: false, showNavigation: false, keepaspectratio: true
});
var origin = board.create('point', [0, 0], {visible: false, fixed: true});
var circle = board.create('circle', [origin, 1], {strokeColor: '#aab6c1', dash: 2});
var start = board.create('glider', [1, 0, circle], {name: 'start', color: '#a04a00'});
var current = [1, 0], count = 0;
var end = board.create('point', [function(){return current[0];}, function(){return current[1];}],
  {name: 'x', fixed: true, color: '#1565c0'});
board.create('arrow', [origin, end], {strokeColor: '#1565c0', strokeWidth: 3});
function reset() { current = [start.X(), start.Y()]; count = 0; board.update(); }
start.on('drag', reset);
board.create('button', [-1.4, -1.25, 'Ett steg', function() {
  var y = [2*current[0]+current[1], current[0]+2*current[1]];
  var length = Math.hypot(y[0], y[1]);
  current = [y[0]/length, y[1]/length]; count++; board.update();
}]);
board.create('button', [-0.35, -1.25, 'Start på nytt', reset]);
board.create('text', [-1.4, 1.35, function(){ return 'Antall steg: ' + count; }]);
```

### Hva la du merke til?

Mange startpiler nærmer seg samme **linje**, men kan peke i motsatt retning.
Matrisen ser ut til å foretrekke enkelte retninger. Vi må finne ut hva den
gjør med dem før vi kan forklare resten.

**Sjekk:** Regn ut hva som skjer med $(1,1)^T$ og $(1,-1)^T$.
Blir pilene dreid, eller blir de bare ganget med et tall?

<details class="reading-step">
<summary>Forklaring steg for steg: skaler uten å dreie</summary>

For $x=(a,b)^T$ er $Ax=(2a+b,a+2b)^T$. Lengden til svaret er
$\sqrt{(2a+b)^2+(a+2b)^2}$. Når vi deler begge koordinatene på denne
positive lengden, endrer vi størrelsen, men ikke retningen.

Prøv også for hånd fra $(1,0)^T$, uten skalering:
$(1,0)^T\mapsto(2,1)^T\mapsto(5,4)^T\mapsto(14,13)^T$.
Koordinatene blir nesten like **relativt til størrelsen**. Det betyr ikke at
forskjellen mellom dem må gå mot null.

</details>

## 5.2 Finn de spesielle retningene {#uke5-egen}

### Regn, og beskriv forskjellen

Med samme matrise får vi

$$A\begin{bmatrix}1\\1\end{bmatrix}=3\begin{bmatrix}1\\1\end{bmatrix},
\qquad
A\begin{bmatrix}1\\-1\end{bmatrix}=1\begin{bmatrix}1\\-1\end{bmatrix}.$$

I den første retningen tredobles pilen. I den andre er den uendret.
**Prøv nå $B=\begin{bmatrix}0&1\\1&0\end{bmatrix}$ på de samme pilene.**
Hva betyr et negativt tall foran pilen?

### Nå gir vi mønsteret et navn

En ikke-null vektor $v$ som oppfyller

$$Av=\lambda v$$

kalles en **egenvektor**. Tallet $\lambda$ er dens **egenverdi**.
For $\lambda\ne0$ blir pilen på samme linje. Negativ $\lambda$ snur pilen;
$\lambda=0$ sender den til null. Alle ikke-null multipler av $v$ er også
egenvektorer med samme egenverdi. Nullvektoren er utelatt fordi $A0=\lambda0$
gjelder for alle $\lambda$ og derfor ikke identifiserer noen spesiell retning.

### Hvordan finner vi dem uten å gjette?

Vi flytter alt til én side:

$$(A-\lambda I)v=0.$$

Vi trenger en ikke-null løsning. Derfor må $A-\lambda I$ være singulær:

$$\det(A-\lambda I)=0.$$

For vår matrise blir dette $(2-\lambda)^2-1=0$, altså $\lambda=3$ eller $1$.
Deretter løser vi ett homogent system for hver egenverdi.
**Egenrommet** er nullrommet til $A-\lambda I$, inkludert nullvektoren.

<details class="reading-step">
<summary>Forklaring steg for steg: fra egenverdi til egenrom</summary>

For $\lambda=3$ er

$$A-3I=\begin{bmatrix}-1&1\\1&-1\end{bmatrix}.$$

Begge likningene sier $v_2=v_1$. Løsningene er $v=t(1,1)^T$.
Alle er i egenrommet; de med $t\ne0$ er egenvektorer.
For $\lambda=1$ får vi $v_2=-v_1$, altså $v=t(1,-1)^T$.

For en $2\times2$-matrise er $\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc$.
Determinantlikningen gir mulige egenverdier, mens nullromsberegningen gir
vektorene. På store matriser bruker vi numeriske algoritmer fremfor å
utvide et stort determinantpolynom.

</details>

**Din tur:** Finn egenverdier og egenrom til
$C=\begin{bmatrix}2&1\\0&1\end{bmatrix}$. Kontroller med $Cv=\lambda v$.
Er egenvektorene ortogonale?

<details class="learning-hint">
<summary>Løsningsforslag: en matrise uten ortogonale egenretninger</summary>

$(2-\lambda)(1-\lambda)=0$. For $2$ er egenrommet
$\operatorname{span}\{(1,0)^T\}$; for $1$ er det
$\operatorname{span}\{(1,-1)^T\}$. Indreproduktet er $1$, så disse
retningene er ikke ortogonale. Egenvektorer er ikke generelt ortogonale.

</details>

## 5.3 Forklar gjentakelsen med en basis {#uke5-basis}

### Følg to ingredienser

Bruk $A$ fra 5.1. Start med

$$x_0=\begin{bmatrix}1\\0\end{bmatrix}
=\tfrac12\begin{bmatrix}1\\1\end{bmatrix}
+\tfrac12\begin{bmatrix}1\\-1\end{bmatrix}.$$

**Før du regner:** Hvor mye av hver ingrediens er igjen etter ett, to og tre
steg? Hvilken ingrediens blir størst sammenlignet med den andre?

Etter $k$ steg er

$$A^kx_0=\tfrac12 3^k\begin{bmatrix}1\\1\end{bmatrix}
+\tfrac12\begin{bmatrix}1\\-1\end{bmatrix}.$$

Den andre ingrediensen forsvinner ikke. Men forholdet mellom bidragene er
$3^{-k}$, og derfor nærmer den skalerte pilen seg den første linjen.

### Fra dette eksemplet til teorien

Hvis egenvektorene $v_1,\ldots,v_n$ danner en basis, kan vi skrive

$$x_0=\sum_{i=1}^n c_iv_i,
\qquad A^kx_0=\sum_{i=1}^n c_i\lambda_i^kv_i.$$

Matrisen kalles da **diagonaliserbar**. En enkel egenverdi $\lambda_1$ er
**dominant** når $|\lambda_1|>|\lambda_i|$ for alle $i>1$.
Hvis $c_1\ne0$, vokser dens bidrag relativt til de andre. Forholdet
$|\lambda_2/\lambda_1|$, med egenverdiene sortert etter absoluttverdi,
forklarer den asymptotiske farten: nær én betyr langsom utskilling.

<details class="reading-step">
<summary>Forklaring steg for steg: hvorfor kan vi behandle bidragene hver for seg?</summary>

Linearitet gir $A(c_1v_1+c_2v_2)=c_1Av_1+c_2Av_2$.
Sett inn $Av_i=\lambda_iv_i$. Ved neste multiplikasjon får hver ingrediens
enda en faktor $\lambda_i$. Gjenta $k$ ganger.

Samle basisvektorene i $V=[v_1\ \cdots\ v_n]$ og egenverdiene i
$\Lambda=\operatorname{diag}(\lambda_1,\ldots,\lambda_n)$.
Da betyr $AV=V\Lambda$ at hver kolonne oppfyller egenvektorlikningen.
Siden kolonnene er en basis, er $V$ invertibel:

$$A=V\Lambda V^{-1},\qquad A^k=V\Lambda^kV^{-1}.$$

Les fra høyre: finn ingrediensene, skaler dem, og bygg vektoren igjen.
Ikke alle matriser har en egenvektorbasis. Vi bruker en slik basis som
forutsetning i denne forklaringen av potensmetoden.

</details>

### En forbindelse til uke 4

**Kontroller først:** Normaliser de to egenvektorene til $A$ og regn ut
$Q^TQ$. Hva måler $Q^Tx$?

De normaliserte vektorene danner en ortonormal basis. Dette er en generell
mulighet for **reelle symmetriske matriser**: de har reelle egenverdier og
kan skrives

$$A=Q\Lambda Q^T.$$

Som i uke 4: $Q^T$ måler komponentene, $\Lambda$ skalerer dem, og $Q$ bygger
vektoren igjen. Her er $Q$ kvadratisk og inneholder en full basis.
Dette er spektralteoremet; en generell overgangsmatrise i PageRank trenger
ikke være symmetrisk eller ha ortogonale egenvektorer.

<details class="reading-step">
<summary>Forklaring steg for steg: hvorfor ortogonale egenvektorer?</summary>

For $A=A^T$, $Av=\lambda v$ og $Aw=\mu w$ har vi
$\lambda v^Tw=(Av)^Tw=v^TAw=\mu v^Tw$.
Hvis $\lambda\ne\mu$, må $v^Tw=0$. Innenfor et egenrom kan vi bruke
Gram–Schmidt. Spektralteoremet sikrer at vi får nok vektorer til en full basis.

Med $z=Q^Tx$ følger også
$x^TAx=z^T\Lambda z=\sum_i\lambda_i z_i^2$.
Hvis alle egenverdiene er positive, er uttrykket positivt for alle $x\ne0$.
Dette blir nyttig når vi studerer energi og lineære systemer i uke 6.

</details>

## 5.4 Bygg metoden, og prøv å få den til å svikte {#uke5-potens}

### Et forsøk med farten

**Gjett først:** Hvilken matrise nedenfor trenger flest steg for å få fram
én retning? Begge har samme egenvektorer. Bare skaleringen endres.

```{pyodide-python}
#| label: week5-speed
Q = np.array([[1., 1.], [1., -1.]]) / np.sqrt(2)
fig, ax = plt.subplots()
for second in [1., 2.9]:
    A = Q @ np.diag([3., second]) @ Q.T
    x = np.array([1., 0.])
    ratios = []
    for k in range(81):
        # Her kjenner vi basisen og kan måle de to ingrediensene.
        c = Q.T @ x
        ratios.append(abs(c[1] / c[0]))
        x = A @ x
        x = x / np.linalg.norm(x)
    ax.semilogy(range(81), np.maximum(ratios, 1e-16), label=f"λ₂ = {second}")
ax.set(xlabel="Antall multiplikasjoner", ylabel="|andre bidrag / første bidrag|",
       title="Hvor raskt blir ett bidrag dominerende?")
ax.legend()
plt.show()
```

Farten styres av den **relative** skaleringen. Forholdene er $1/3$ og
$2.9/3$. Det siste er nær én, så bidragene skiller lag langsomt.
Etter hvert kan avrunding bestemme hva vi ser nederst i plottet.

### Skriv opp det vi nettopp gjorde

Dette er **potensmetoden**:

```text
Velg x ≠ 0 og del x på lengden sin.
Gjenta, med en øvre grense for antall steg:
    y = A x
    Hvis y = 0: stopp; normalisering er ikke mulig.
    x = y / ‖y‖₂
    Finn et tall ρ som beskriver skaleringen langs x.
    Kontroller hvor godt A x ≈ ρ x.
```

Vi trenger både et tall for skaleringen og en kontroll. Fra uke 4 vet vi
hvordan vi måler langs en retning:

$$\rho(x)=\frac{x^TAx}{x^Tx},\qquad r=Ax-\rho(x)x.$$

$\rho$ kalles **Rayleigh-kvotienten**, og $r$ er **egenresidualen**.
Hvis $x$ er en egenvektor, får vi dens egenverdi og null residual.

<details class="reading-step">
<summary>Forklaring steg for steg: hvorfor akkurat denne kvotienten?</summary>

Vi prøver å beskrive $Ax$ ved én pil $\rho x$ på linjen gjennom $x$.
Projeksjonsregelen fra uke 4 gir koeffisienten
$\rho=x^T(Ax)/(x^Tx)$. Resten er ortogonal på $x$.
For en enhetsvektor blir dette $\rho=x^TAx$.

En liten residual viser at likningen nesten er oppfylt. Den beviser ikke
at vi har funnet den dominante egenverdien. For en generell matrise gir den
heller ikke alene en garanti for at vektoren ligger nær en bestemt eksakt
egenvektor. Derfor undersøker vi også startvektor og forventet spekter.

</details>

<details class="reading-step">
<summary>Forklaring steg for steg: implementasjonen av potensmetoden</summary>

Definisjonen kjøres automatisk. Les koden etter pseudokoden: normalisering,
Rayleigh-kvotient, residual og en øvre grense for antall steg.

```{pyodide-python}
#| label: week5-power
#| autorun: true
# Definer funksjonen som brukes i de korte forsøkene nedenfor.
def power_iteration(A, x0, tol=1e-10, max_steps=500):
    A = np.asarray(A, dtype=float)
    x = np.array(x0, dtype=float, copy=True)
    if A.ndim != 2 or A.shape[0] != A.shape[1] or x.shape != (A.shape[0],):
        raise ValueError("A må være kvadratisk og x0 ha riktig lengde")
    if not np.all(np.isfinite(A)) or not np.all(np.isfinite(x)):
        raise ValueError("Bruk endelige tall")
    if np.linalg.norm(x) == 0 or tol <= 0 or max_steps < 1:
        raise ValueError("Bruk x0 ≠ 0, positiv toleranse og minst ett steg")
    x /= np.linalg.norm(x)
    scale = np.linalg.norm(A, 'fro')
    history = []
    for k in range(max_steps + 1):
        y = A @ x
        rho = x @ y
        residual = np.linalg.norm(y - rho * x)
        history.append((rho, residual))
        if np.linalg.norm(y) == 0:
            return x, rho, np.array(history), "Ax = 0; kan ikke normalisere"
        if residual <= tol * scale:
            return x, rho, np.array(history), "liten egenresidual"
        if k < max_steps:
            x = y / np.linalg.norm(y)
    return x, rho, np.array(history), "maksimalt antall steg"

```

</details>

```{pyodide-python}
#| label: week5-power-demo
A = np.array([[2., 1.], [1., 2.]])
x, rho, history, status = power_iteration(A, [1., 0.])
print(status, "ρ =", rho, "x =", x)
print("egenresidual:", history[-1, 1])
```

Vi sammenligner residualen med $\text{tol}\,\lVert A\rVert_F$ fordi $x$ har
lengde én. Frobeniusnormen er kvadratroten av summen av de kvadrerte
matriseelementene. Dette gjør testen uavhengig av en felles skalering av $A$.

### Forutsi fire problemtilfeller

For hvert tilfelle: **Hva vil skje, og hva vil residualen fortelle?**
Kjør så forsøket. I figuren vises seks steg uten tidlig stopp.

```{pyodide-python}
#| label: week5-failures
cases = [
    ("Feil startretning", np.diag([3., 1.]), [0., 1.]),
    ("Negativ dominant", np.diag([-3., 1.]), [1., 1.]),
    ("Lik absoluttverdi", np.diag([1., -1.]), [1., 1.]),
    ("Rotasjon", np.array([[0., -1.], [1., 0.]]), [1., 0.]),
]
fig, axes = plt.subplots(2, 2, figsize=(8, 6))
for ax, (name, A, start) in zip(axes.flat, cases):
    x = np.array(start) / np.linalg.norm(start)
    points = [x.copy()]
    for k in range(6):
        x = A @ x
        x /= np.linalg.norm(x)
        points.append(x.copy())
    points = np.array(points)
    ax.plot(points[:, 0], points[:, 1], 'o-')
    ax.set(title=name, xlabel="x₁", ylabel="x₂", xlim=(-1.2, 1.2), ylim=(-1.2, 1.2))
    ax.set_aspect('equal')
    _, rho, h, status = power_iteration(A, start, max_steps=100)
    print(name, ":", status, "; ρ =", rho, "; residual =", h[-1, 1])
fig.tight_layout()
plt.show()
```

En linje kan stabilisere seg selv om pilen skifter fortegn. Og en liten
residual kan tilhøre en annen egenverdi enn den dominante.
For å måle endring av **linje** kan vi bruke
$\min(\lVert x_{k+1}-x_k\rVert_2,\lVert x_{k+1}+x_k\rVert_2)$ for enhetsvektorer.

<details class="learning-hint">
<summary>Løsningsforslag: hva svikter?</summary>

- Starten $(0,1)^T$ mangler den dominante ingrediensen. Residualen er null
  allerede ved start, men egenverdien er $1$, ikke $3$.
- Med $-3$ som dominant egenverdi nærmer pilene seg samme linje og skifter
  fortegn. Rayleigh-kvotienten nærmer seg $-3$.
- For $1$ og $-1$ er forholdet mellom absoluttverdiene én. Begge bidragene
  består, og den valgte starten gir en syklus med to ulike vektorer.
- En kvart omdreining har ingen reell egenretning. Over komplekse tall er
  egenverdiene $i$ og $-i$, begge med absoluttverdi én. Her går pilen i sirkel.

I flyttallsregning kan avrunding tilføre en liten manglende ingrediens.
Den eksakte diagonale starttesten gjør det lettere å isolere prinsippet.

</details>

## 5.5 Fra piler til besøk på nettsider {#uke5-nett}

### Fordel besøkene før vi innfører nye ord

Fire sider har disse lenkene:

| Fra side | Lenker til |
|---|---|
| A | B og C |
| B | C |
| C | A og D |
| D | A |

**Gjett rangeringen.** Er antall innkommende lenker nok til å avgjøre den?
Legg først en firedel av besøkene på hver side. Hver runde fordeles alle
besøk fra en side likt mellom dens utgående lenker. Regn én runde for hånd.

```{pyodide-python}
#| label: week5-network
# Kolonne j viser hvor besøkene FRA side j går; rad i er mottaker.
S = np.array([[0., 0., 1/2, 1.],
              [1/2, 0., 0., 0.],
              [1/2, 1., 0., 0.],
              [0., 0., 1/2, 0.]])
starts = [np.ones(4)/4, np.array([1., 0., 0., 0.])]
fig, axes = plt.subplots(1, 2, figsize=(9, 3))
for ax, p0 in zip(axes, starts):
    p = p0.copy()
    values = [p.copy()]
    for k in range(40):
        p = S @ p
        values.append(p.copy())
    ax.plot(values)
    ax.set(xlabel="Runde", ylabel="Andel besøk", title=f"Start: {p0}")
    ax.legend(list("ABCD"))
print("Kolonnesummer:", S.sum(axis=0))
print("Etter 40 runder:", p, "sum:", p.sum())
fig.tight_layout()
plt.show()
```

### Forklar regnskapet

Hver kolonne fordeler alt som kom fra én side. Derfor summerer kolonnene
til én. En viktig side sender mer videre enn en lite besøkt side, og den
må dele dette bidraget mellom lenkene sine.

En matrise med ikke-negative elementer og kolonnesum én kalles
**kolonnestokastisk**. En **sannsynlighetsvektor** har ikke-negative elementer
som summerer til én. Oppdateringen er $p_{k+1}=Sp_k$.

Hvis fordelingen ikke lenger endres, har vi

$$Sp=p.$$

Dette er en egenvektorlikning med egenverdi **1**. Fordelingen kalles
**stasjonær**. Den har fast sum, ikke nødvendigvis euklidsk lengde én.
Individuelle besøkende fortsetter å flytte seg selv om fordelingen er stasjonær.

<details class="reading-step">
<summary>Forklaring steg for steg: ett matriseprodukt og en bevaringslov</summary>

Fra jevn start er første mottak til A $\tfrac12\cdot\tfrac14+1\cdot\tfrac14=3/8$.
Hele svaret blir $(3/8,1/8,3/8,1/8)^T$.
Generelt er $(Sp)_i=\sum_j S_{ij}p_j$: summer alle bidrag til mottaker $i$.

Skriv $\mathbf1=(1,\ldots,1)^T$. Kolonnesummene betyr
$\mathbf1^TS=\mathbf1^T$, og dermed $\mathbf1^TSp=\mathbf1^Tp$.
Summen bevares. Dette betyr **ikke** at $S\mathbf1=\mathbf1$; det ville
kreve at også radsummene var én.

Her gir $Sp=p$ likningene $p_B=p_A/2$, $p_D=p_C/2$ og $p_A=p_C$.
Normalisering gir $p=(1/3,1/6,1/3,1/6)^T$. A og C deler førsteplassen.

Kolonnesummene gir også $S^T\mathbf1=\mathbf1$, så $S^T$ har egenverdi én.
Siden en matrise og dens transponerte har samme karakteristiske polynom,
har $S$ også egenverdi én. Men dette alene garanterer ikke at iterasjonen
konvergerer til én bestemt fordeling.

</details>

## 5.6 En felle og en utvei {#uke5-google}

### Bryt nettverket

Vi endrer **bare D**: siden lenker nå kun til seg selv.
**Gjett først:** D har fortsatt bare én innkommende lenke fra en annen side.
Kan D likevel ende med nesten alle besøkene?

```{pyodide-python}
#| label: week5-trap
# Kjør nettverkscellen i 5.5 først.
trap = S.copy()
trap[:, 3] = [0., 0., 0., 1.]
p = np.ones(4) / 4
values = [p.copy()]
for k in range(100):
    p = trap @ p
    values.append(p.copy())
plt.figure()
plt.plot(values)
plt.xlabel("Runde")
plt.ylabel("Andel besøk")
plt.legend(list("ABCD"))
plt.title("Besøkene slipper ikke ut av D")
plt.show()
print(p)
```

D er en felle: besøk kan komme inn, men ikke ut. Regningen kan konvergere
helt fint selv om rangeringen ikke uttrykker det vi ønsket å måle.

### Prøv en ny besøksregel

La besøkende følge en lenke med sannsynlighet $\alpha$, og ellers hoppe til
en tilfeldig side. **Hva tror du skjer når $\alpha$ senkes fra $0.95$ til
$0.5$?** Prøv før du leser formelen nedenfor.

```{pyodide-python}
#| label: week5-teleport
# Kjør felleforsøket først. u fordeler de tilfeldige hoppene likt.
u = np.ones(4) / 4
fig, ax = plt.subplots()
for alpha in [0.5, 0.85, 0.95]:
    p = u.copy()
    for k in range(500):
        p = alpha * (trap @ p) + (1-alpha) * u
    ax.plot(list("ABCD"), p, 'o-', label=f"α = {alpha}")
ax.set(xlabel="Side", ylabel="Stasjonær andel besøk", title="En utvei fra fellen")
ax.legend()
plt.show()
```

### Bygg matematikken fra besøksregelen

Hoppene gir en vei ut. For en sannsynlighetsvektor $p_k$ er oppdateringen

$$p_{k+1}=\alpha Sp_k+(1-\alpha)u,$$

hvor $u$ er fordelingen for tilfeldige hopp. I forsøket er $u=\mathbf1/n$.
Siden $\mathbf1^Tp_k=1$, kan vi også skrive $p_{k+1}=Gp_k$, med

$$G=\alpha S+(1-\alpha)u\mathbf1^T.$$

Dette er **Google-matrisen**, og dens stasjonære sannsynlighetsvektor er
**PageRank-vektoren**. $\alpha$ er dempingsfaktoren; større $\alpha$ gir
lenkene mer vekt. Det innebærer et modellvalg, ikke bare et valg av regnefart.

**Hva hvis en side ikke har lenker?** En nullkolonne mister besøk og er
ikke stokastisk. Erstatt den med $u$ **før** du lager $G$. Dette er behandlingen
av en **hengende node**. Den skiller seg fra en side som lenker til seg selv:
selvlenken bevarer besøkene, men kan fange dem.

### Hva kan vi nå garantere?

Hvis $S$ er kolonnestokastisk, $u_i>0$, $\sum_i u_i=1$ og $0<\alpha<1$,
er alle elementene i $G$ positive og kolonnene summerer til én.
En slik matrise har en **entydig positiv stasjonær sannsynlighetsvektor**,
og iterasjon fra enhver sannsynlighetsvektor konvergerer til den.
Dette er en anvendelse av Perron–Frobenius-teoremet; vi beviser ikke hele
teoremet her. Det krever ikke at $G$ er symmetrisk eller diagonaliserbar.

**Sjekk forståelsen:** Lover teoremet at rangeringen er en god måling av
kvalitet? Hva skjer med lenkenes betydning når $\alpha=0$? Hvilken garanti
mister vi ved $\alpha=1$?

<details class="reading-step">
<summary>Forklaring steg for steg: andre egenverdier beskriver avvikene</summary>

La $p_*$ være den stasjonære fordelingen. Differansen $e_k=p_k-p_*$ har sum
null, så teleporteringstermen kanselleres:

$$e_{k+1}=Ge_k=\alpha Se_k.$$

Et avvik i en egenretning skaleres med den tilhørende egenverdien ved hvert
steg. Derfor er de andre egenverdiene relevante selv om selve rangeringen
alltid bruker egenverdien én. Med $0<\alpha<1$ har alle de andre
egenverdiene til $G$ absoluttverdi mindre enn én, faktisk høyst $\alpha$.

På små grafer kan vi finne alle egenverdiene og sammenligne størrelsen på
den nest største med et konvergensplott. Flere bidrag, startfordelingen og
avrunding kan påvirke plottet; det er ikke alltid én rett linje fra første steg.

</details>

<details class="learning-extension">
<summary>Fordypning: en feilgrense uten en egenvektorbasis</summary>

For $\lVert z\rVert_1=\sum_i|z_i|$ gir kolonnesummene og trekantulikheten

$$\lVert Sz\rVert_1\le\sum_{i,j}S_{ij}|z_j|=\lVert z\rVert_1.$$

Derfor er $\lVert e_{k+1}\rVert_1\le\alpha\lVert e_k\rVert_1$.
For en sannsynlighetsvektor $p$ får vi dessuten

$$\lVert p-p_*\rVert_1\le\frac{\lVert Gp-p\rVert_1}{1-\alpha}.$$

For å se dette, skriv $p-p_*=(p-Gp)+(Gp-Gp_*)$, bruk trekantulikheten
og flytt $\alpha\lVert p-p_*\rVert_1$ til venstre.
Nær $\alpha=1$ må residualen være mindre for å gi samme feilgaranti.

</details>

## 5.7 Oppgaver og vei til prosjektet {#uke5-oppgaver}

1. Finn egenverdier og egenrom til $\begin{bmatrix}4&0\\0&-2\end{bmatrix}$.
   Forutsi $A^kx_0$ fra $x_0=(1,1)^T$. Hva gjør normalisering med bildet?
2. Bruk $C$ fra 5.2. Skriv $(2,1)^T$ i en egenvektorbasis og finn $C^k(2,1)^T$.
3. Lag en startvektor som gir null egenresidual uten å finne den dominante
   egenverdien til $\operatorname{diag}(5,2)$. Forklar hvorfor testen godtar den.
4. To sider lenker bare til hverandre. Prøv start $(1,0)^T$ og $(1/2,1/2)^T$.
   Finn begge egenverdiene. Finnes en entydig stasjonær sannsynlighetsvektor?
   Konvergerer begge startene til den?
5. En tredje side har ingen utgående lenker. Forklar hvordan du bygger
   kolonnen dens, og hvorfor teleportering alene ikke reparerer en nullkolonne.

<details class="learning-hint">
<summary>Korte svar til egenkontroll</summary>

1. Egenverdier $4,-2$, koordinataksene er egenrommene. Vektoren er
   $(4^k,(-2)^k)^T$; den normaliserte retningen nærmer seg første akse.
2. $(2,1)^T=3(1,0)^T-(1,-1)^T$, så svaret er
   $3\cdot2^k(1,0)^T-(1,-1)^T$.
3. Start med $(0,1)^T$: egenverdien er $2$, og residualen er null.
4. Matrisen er $\begin{bmatrix}0&1\\1&0\end{bmatrix}$, med egenverdier $1,-1$.
   Den eneste stasjonære sannsynlighetsvektoren er $(1/2,1/2)^T$, men første
   start veksler mellom sidene. Entydighet alene sikrer ikke konvergens.
5. Erstatt nullkolonnen med $u$. Hvis du beholder nullkolonnen, får den
   tilsvarende kolonnen i $G$ sum $1-\alpha$, ikke én.

</details>

I [prosjekt 5](project_week5.qmd) skal du bygge og kontrollere en rangering,
diagnostisere et problem og gjennomføre en egen undersøkelse. Ta med disse
spørsmålene: **Oppfyller svaret likningen? Konvergerer metoden? Måler modellen
det vi ønsket?** De er tre forskjellige spørsmål.

### Referanser

- [Interactive Linear Algebra: Stochastic Matrices](https://textbooks.math.gatech.edu/ila/stochastic-matrices.html):
  stasjonære fordelinger, positive stokastiske matriser og PageRank.
- [PageRank-notebook i Mathematics for Machine Learning](https://github.com/jiadaizhao/Mathematics-for-Machine-Learning/blob/master/Linear%20Algebra/Week5/PageRank.ipynb):
  inspirasjon til et lite nettverk og et felleforsøk. Nettverkene og koden her
  er selvstendige eksempler.
