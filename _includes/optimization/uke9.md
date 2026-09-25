<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 9.0 Oversikt

<div id="uke9-start"></div>

### Fra spredte prøver til en nedgående retning

Vi vil minimere en funksjon $f(x,y)$ når vi kan beregne verdien i et punkt.
Noen ganger kjenner vi også de deriverte, andre ganger er hver beregning
bare en måling. [I uke 6](uke6.qmd#uke6-retning) var målet et lineært
system, og den kvadratiske energien hadde gradient $Ax-b$. Nå beholder vi
ideen om **retning og steglengde**, men funksjonen er ikke kvadratisk og
kan ha flere minimumspunkter. Fra [uke 8](uke8.qmd#uke8-lokalt) tar vi med
skillet mellom lokale og globale påstander: en liten gradient eller en lav
verdi i noen prøver beviser ikke at et punkt er best i hele området.

Vi bruker gjennom hele uken funksjonen

$$f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2.$$

Den kan evalueres uten deriverte. Fordi den er en sum av kvadrater, er
$f\geq0$; punktet $(3,2)$ gir $f(3,2)=0$ og er derfor et **globalt**
minimumspunkt. Algoritmene får ikke dette punktet oppgitt. De må lete.
Resultatet av en endelig datakjøring er i seg selv bare evidens, mens
kvadratargumentet gir et bevis i akkurat dette eksemplet. Vi starter med
uavhengige prøver på et endelig utvalg, lar deretter neste prøver avhenge
av det beste punktet, og bruker til slutt den deriverte til å velge retning.
Slik ser vi hva ekstra informasjon om $f$ faktisk kjøper oss. Alle tre
metodene må bestemme når de skal slutte; den avgjørelsen er forskjellig
fra et matematisk sertifikat for et minimum.

En **iterasjon** er én oppdatering fra gjeldende punkt $z_k$ til et nytt
punkt. Mange iterative metoder kan skrives $z_{k+1}=z_k+\alpha_k p_k$:
$p_k$ er en **søkeretning**, og den positive faktoren $\alpha_k$ styrer
**steglengden** $\alpha_k\|p_k\|$. For kompassøk er $\alpha_k=\Delta$ og
$p_k$ en av fire koordinatretninger; i gradientmetoden avledes retningen
fra $f$. En **stoppregel** kan gjelde prøvebudsjett, minste steglengde
eller liten gradient. Ingen slik numerisk terskel er alene et globalt bevis.
Målet er å kunne velge og kontrollere en metode ut fra tilgjengelig
informasjon, regne ut en gradientretning og skille observert nedgang fra
en garanti.

## 9.1 Endelig søk: hvor godt er beste prøve?

<div id="uke9-endelig"></div>

Et **gittersøk** evaluerer funksjonen i et fast nett. Et **tilfeldig søk**
trekker punkter fra en gitt mengde. Begge undersøker bare et endelig
antall kandidater. Vi bruker kvadratet $[-4,4]^2$ og et budsjett på
64 evalueringer for hver metode. En fast tilfeldig startverdi gjør
forsøket mulig å gjenta. **Forutsi:** Vil punktene på gitteret eller de
tilfeldige punktene gi lavest observert verdi denne gangen?

Oppsettet definerer `f9(z)`, som tar en vektor `z = [x, y]` og returnerer
funksjonsverdien. Senere bruker vi `grad9(z)`, som returnerer de to
partiellderiverte i samme rekkefølge. Disse er to ulike slags
informasjon om det samme målet.

```{pyodide-python}
#| label: week9-finite-search
axis = np.linspace(-4, 4, 8)
u, v = np.meshgrid(axis, axis)
grid = np.column_stack((u.ravel(), v.ravel()))
rng = np.random.default_rng(42)
random_points = rng.uniform(-4, 4, size=(64, 2))
grid_values = np.array([f9(z) for z in grid])
random_values = np.array([f9(z) for z in random_points])
for name, points, values in [('Gitter', grid, grid_values),
                             ('Tilfeldig', random_points, random_values)]:
    i = np.argmin(values)
    print(f'{name}: {len(values)} prøver; beste punkt {points[i].round(3)}, '
          f'f = {values[i]:.3f}')

fig, ax = plt.subplots(figsize=(6, 5))
ax.scatter(grid[:, 0], grid[:, 1], s=22, label='gitter')
ax.scatter(random_points[:, 0], random_points[:, 1], s=12,
           alpha=.7, label='tilfeldig, frø 42')
ax.plot(3, 2, 'k*', markersize=12, label='kjent nullpunkt')
ax.set(xlim=(-4.2, 4.2), ylim=(-4.2, 4.2), xlabel='x', ylabel='y')
ax.set_aspect('equal'); ax.legend(); plt.show()
```

Her gir gitteret omtrent $2{,}710$ ved $(2{,}857,1{,}714)$, mens det
tilfeldige utvalget gir omtrent $0{,}094$ ved $(-3{,}818,-3{,}280)$.
Dette er én realisering; et annet frø kan endre rekkefølgen. Ingen av
disse 64-punktslistene forteller hva funksjonen gjør **mellom** punktene.
Selv om et utvalg skulle treffe $f=0$, er det sum-av-kvadrater-argumentet,
og ikke søkerutinen, som viser at ingen lavere verdi finnes.

**Overføring:** Hvis én funksjonsevaluering tok et minutt, hvordan ville
du bruke de neste fire evalueringene rundt det beste punktet?

<details class="reading-step">
<summary>Gå i dybden: dimensjon og prøvetall</summary>

Med åtte verdier i hver av $d$ koordinater trenger et fullt gitter
$8^d$ funksjonsverdier. Allerede for $d=6$ er det $262144$ prøver.
Tilfeldige punkter slipper det faste produktet, men gir heller ingen
generell garanti for å treffe et lite område med gode verdier.
Ved en **tilfeldig vandring for minimering** trekkes derimot neste
forslag *relativt til det gjeldende, aksepterte punktet*. Velg start,
steglengde og antall prøver; trekk en tilfeldig retning, evaluer et
forslag, og behold det bare ved forbedring. Hvis forslaget forkastes,
blir vi stående og trekker en ny retning. Dette skiller metoden fra
tilfeldig søk med uavhengige punkter i hele kvadratet.

```{pyodide-python}
#| label: week9-random-walk-extension
walk_rng = np.random.default_rng(7)
walk = np.array([0., 0.])
for trial_number in range(20):
    direction = walk_rng.normal(size=2)
    direction /= np.linalg.norm(direction)
    candidate = walk + 0.5*direction
    if f9(candidate) < f9(walk):
        walk = candidate
print(f'Vandring etter 20 prøver: {walk.round(3)}, f={f9(walk):.3f}')
```

Også her gir en begrenset prøvekvote ingen global garanti.

</details>

## 9.2 Kompassøk: flytt og krymp

<div id="uke9-kompass"></div>

Vi begynner nå i $z_0=(0,0)$, med steglengde $\Delta=1$. Et
**kompassøk** undersøker fire koordinatretninger rundt det gjeldende
punktet: $z\pm\Delta(1,0)$ og $z\pm\Delta(0,1)$. Er en prøve bedre,
flytter vi til den beste av de fire; ellers halverer vi $\Delta$.
**Forutsi første flytting:** Hvilket av $(1,0)$, $(-1,0)$, $(0,1)$ og
$(0,-1)$ tror du har minst verdi? Vi teller funksjonsevalueringene;
en ny runde bruker fire nye prøver.

```{pyodide-python}
#| label: week9-compass
directions = np.array([[1., 0.], [-1., 0.], [0., 1.], [0., -1.]])
z = np.array([0., 0.])
step = 1.
current = f9(z)
path = [z.copy()]
polls = 0
while step >= 1/128 and polls < 100:
    trials = z + step * directions
    values = np.array([f9(t) for t in trials])
    polls += 1
    best = np.argmin(values)
    if values[best] < current - 1e-12:
        z = trials[best].copy()
        current = values[best]
        path.append(z.copy())
    else:
        step /= 2
path = np.array(path)
print('Første prøveverdier:', np.array([f9(t) for t in directions]))
print(f'Sluttpunkt {z}, f = {f9(z):.6g}; '
      f'{4*polls+1} funksjonsevalueringer; siste steglengde {step:g}')

xx, yy = np.meshgrid(np.linspace(-4, 4, 180), np.linspace(-4, 4, 180))
zz = (xx*xx + yy - 11)**2 + (xx + yy*yy - 7)**2
fig, ax = plt.subplots(figsize=(6, 5))
ax.contour(xx, yy, zz, levels=[1, 5, 20, 50, 100, 200], colors='#aab2bd')
ax.plot(path[:, 0], path[:, 1], 'o-', color='#bb4a37', label='kompass')
ax.plot(3, 2, 'k*', markersize=11, label='kjent nullpunkt')
ax.set(xlim=(-4, 4), ylim=(-4, 4), xlabel='x', ylabel='y')
ax.set_aspect('equal'); ax.legend(); plt.show()
```

Fra null er prøveverdiene $136$, $164$, $136$ og $180$ i rekkefølgen
over, mens startverdien er $170$. Første og tredje prøve er like gode;
`argmin` velger den første, så metoden flytter til $(1,0)$.
Med denne rekkefølgen og stoppregelen ender den i $(3,2)$, med $f=0$,
etter 53 funksjonsevalueringer. Når ingen av fire prøver forbedrer
verdien, betyr det **ikke** at ingen andre punkter gjør det. Metoden
undersøker da en mindre skala. Å stoppe når $\Delta<1/128$ er en
praktisk oppløsningsregel, ikke en global garanti. Fra et annet
startpunkt kan banen ende nær et annet minimum.

**Overføring:** Hva vil skje med antall prøver og posisjonens presisjon
hvis vi halverer den minste tillatte $\Delta$?

<details class="reading-step">
<summary>Gå i dybden: variasjoner av et kompassøk</summary>

Her sammenligner vi alle fire kandidater før vi flytter. En variant
flytter straks den første forbedringen finnes og bruker dermed noen
ganger færre evalueringer, men får en annen bane. Et annet valg er å
prøve diagonale retninger i tillegg. Å mislykkes i et endelig sett
retninger ved én steglengde er fremdeles ikke et bevis for globalt
minimum. I figuren over ser du hvilke punkter som ble akseptert; en
halvering uten flytting gir ikke et nytt punkt på banen.

</details>

## 9.3 Gradientmetoden: retning er ikke steg

<div id="uke9-gradient"></div>

Nå utnytter vi at vi også kan derivere $f$. I [uke 6](uke6.qmd#uke6-retning)
var $-\nabla\phi=b-Ax$ residualen, og for SPD-kvadratikken fant vi
steglengden med en lukket formel. For vår ikke-kvadratiske funksjon
setter vi $a=x^2+y-11$ og $b=x+y^2-7$. Kjerneregelen gir

$$g(z)=\nabla f(x,y)=\begin{bmatrix}4xa+2b\\2a+4yb\end{bmatrix},\qquad
p_k=-g(z_k),\qquad z_{k+1}=z_k+\alpha_k p_k.$$

Gradienten gir den lokale endringen: langs en retning $p$ er den
deriverte i starten $\nabla f(z)^Tp$. Når dette skalarproduktet er
negativt, synker $f$ for tilstrekkelig små positive steg. For $p=-g$
er det $-\|g\|_2^2<0$ så lenge $g\ne0$. Ved $z_0=(0,0)$ er
$g=(-14,-22)$ og $p=(14,22)$, med starthelning $-680$.
Retningen sier likevel ikke hvor langt vi kan gå: funksjonen kan
stige igjen langs samme linje. I den kvadratiske modellen fra uke 6
kunne vi beregne det beste steget eksakt; her må vi prøve verdier.

Et **Armijo-søk** starter her med $\alpha=1$ og halverer til den
faktiske reduksjonen er stor nok sammenlignet med starthelningen:

$$f(z+\alpha p)\le f(z)+10^{-4}\alpha\,g(z)^Tp.
\qquad (p=-g(z))$$

Høyresiden er da $f(z)-10^{-4}\alpha\|g(z)\|_2^2$. Vi krever altså
en liten, men ekte reduksjon; det er ingen jakt på det aller beste
steget. Koden under stopper dessuten ved gradientnorm under $10^{-6}$
eller et gitt iterasjonsbudsjett. En liten gradient er bare en
stasjonaritetskontroll, slik vi så i uke 8. **Forutsi:** Vil en fast
faktor $0{,}1$ alltid være bedre enn $0{,}02$ fordi den tar lengre steg?
På et nivåkurvekart er gradienten vinkelrett på kurven: den deriverte
langs en tangent til samme nivå er null. Negativ gradient peker lokalt
mot lavere nivåer, mens neste retning beregnes på nytt etter hvert steg.
I figuren viser vi banene for det lille faste steget og Armijo-søket
over verdikurvene, med verdi per iterasjon under. Det store faste
steget tegnes bare i verdiplottet fordi banen raskt forlater kartet.

```{pyodide-python}
#| label: week9-gradient-steps
def fixed_steps(rate, n=40):
    z = np.array([0., 0.])
    history = [f9(z)]
    path = [z.copy()]
    for k in range(n):
        z = z - rate*grad9(z)
        if not np.all(np.isfinite(z)) or np.linalg.norm(z) > 1e6:
            break  # Ingen flere endelige, lesbare verdier i forsøket.
        history.append(f9(z))
        path.append(z.copy())
    return z, np.array(history), np.array(path)

def shrinking_steps(n=60):
    z = np.array([0., 0.])
    history = [f9(z)]
    path = [z.copy()]
    for k in range(n):
        g = grad9(z)
        if np.linalg.norm(g) < 1e-6:
            break
        rate = 1.
        while f9(z-rate*g) > f9(z) - 1e-4*rate*(g @ g):
            rate /= 2
        z -= rate*g
        history.append(f9(z))
        path.append(z.copy())
    return z, np.array(history), np.array(path)

curves = {}
paths = {}
for rate in [0.02, 0.1]:
    end, values, points = fixed_steps(rate)
    curves[f'fast α={rate:g}'] = values
    if rate == 0.02:
        paths['fast α=0.02'] = points
    print(f'Fast α={rate:g}: {len(values)-1} tegnede steg, '
          f'siste f={values[-1]:.3g}')
end, values, points = shrinking_steps()
curves['halvering'] = values
paths['halvering'] = points
print(f'Halvering: punkt {end.round(6)}, f={f9(end):.3g}, '
      f'||gradient||={np.linalg.norm(grad9(end)):.3g}')
fig, (ax_map, ax) = plt.subplots(2, 1, figsize=(6.5, 9))
gx, gy = np.meshgrid(np.linspace(-1, 4, 160), np.linspace(-1, 4, 160))
gz = (gx*gx + gy - 11)**2 + (gx + gy*gy - 7)**2
ax_map.contour(gx, gy, gz, levels=[1, 5, 20, 50, 100, 200],
               colors='#adb5bd', linewidths=.8)
colors = {'fast α=0.02': '#1665ad', 'fast α=0.1': '#b5483f',
          'halvering': '#2b8a61'}
for name, points in paths.items():
    ax_map.plot(points[:, 0], points[:, 1], 'o-', color=colors[name],
                markersize=2.5, linewidth=1.4, label=name)
    ax_map.plot(*points[-1], 'o', color=colors[name], markersize=7)
ax_map.plot(0, 0, 'ks', markersize=6, label='start k=0')
ax_map.plot(3, 2, 'k*', markersize=11, label='kjent globalt punkt')
ax_map.set(xlim=(-1, 4), ylim=(-1, 4), xlabel='x', ylabel='y',
           title='Aksepterte punkter på nivåkurvene til f')
ax_map.set_aspect('equal')
ax_map.legend(fontsize=8, loc='upper left')
for name, values in curves.items():
    ax.semilogy(np.arange(len(values)), np.maximum(values, 1e-15),
                'o-', markersize=3, color=colors[name], label=name)
ax.set(xlabel='Iterasjonssteg', ylabel='f (logaritmisk skala)')
ax.legend()
fig.tight_layout(); plt.show()
```

Med $\alpha=0{,}02$ er $f$ etter 40 steg omtrent $1{,}46\cdot10^{-15}$.
Med $\alpha=0{,}1$ vokser funksjonen raskt; vi stopper tegningen når
stegene vokser så mye at sikkerhetsgrensen i koden bryter kjøringen.
Halvering finner omtrent $(3,2)$, med
$f<10^{-14}$ og gradientnorm under $10^{-6}$, fra samme startpunkt.
Øverst følger de to tegnede banene de samme aksepterte punktene som
verdiplottet under teller. Starten er en svart firkant; de fargede
endepunktene ligger praktisk talt på den svarte stjernen. Banen med
$\alpha=0{,}1$ er utelatt fra kartet, ikke konvergent: verdiplottet
viser hvorfor et stort steg kan skyte langt forbi lave nivåer.
Retningen er lokalt nedgående når gradienten er ulik null, men en
vilkårlig lang bevegelse kan gå opp igjen. Er nedgangen i Armijo-testen
for liten, halveres $\alpha$ og vi prøver igjen. Her arbeider vi med en
glatt funksjon uten sidebetingelser. Gradient lik null kan likevel bety et
sadelpunkt. Vi sammenholder derfor gradientnorm, funksjonsverdi og
eventuelle matematiske garantier, ikke bare at koden stoppet.

**Numerisk linjesøk med SciPy.** I uke 6 kunne vi beregne den beste
steglengden for en SPD-kvadratisk funksjon fra indreprodukter. Her er
funksjonen langs $-\nabla f(z_0)$ ikke en parabel. Etter at startpunkt
og retning er låst, lager `lambda alpha: f9(start + alpha*direction)`
en funksjon av **ett tall**. `minimize_scalar` (importert i oppsettet)
søker langs denne linjen; `bounds=(0., .2)` og `method='bounded'`
avgrenser forsøket til steglengder mellom 0 og 0,2. Det er et annet
valg enn Armijo: her brukes evalueringer for å finne en liten verdi
langs én fast linje, ikke bare den første tilstrekkelige nedgangen.
`options={'xatol': 1e-10}` setter en absolutt stopptoleranse for den
valgte $\alpha$, ikke en garantert feil i funksjonsverdien eller et
globalt optimalitetsbevis.

```{pyodide-python}
#| label: week9-scalar-line-search
start = np.array([0., 0.])
direction = -grad9(start)
line = minimize_scalar(lambda alpha: f9(start + alpha*direction),
                       bounds=(0., .2), method='bounded',
                       options={'xatol': 1e-10})
line_point = start + line.x*direction
line_gradient = grad9(line_point)
print(f'α={line.x:.6f}, punkt={line_point.round(6)}, '
      f'f={f9(line_point):.6f}, evalueringer={line.nfev}, '
      f'success={line.success}')
print(f'||gradient||={np.linalg.norm(line_gradient):.3f}, '
      f'derivert langs linjen={line_gradient @ direction:.3g}')
```

`line.x` er den valgte steglengden, `line.nfev` antall evalueringer,
og `line.success` angir om søkets egne stoppvilkår ble oppfylt.
Vi får omtrent $\alpha=0{,}127336$ og $f=32{,}126$, lavere enn
startverdien 170. Den fulle gradientnormen er likevel omtrent $36{,}2$:
punktet er ikke stasjonært i planet. `bounded` gir en **lokal numerisk
minimumskandidat** på det valgte intervallet; `success=True` sertifiserer
ikke et globalt minimum, verken der eller i hele planet.

**SciPy-huskelapp for ett linjesøk.**

| Del | Bruk her |
|:--|:--|
| Import | `from scipy.optimize import minimize_scalar` (gjort i oppsettet). |
| Mål og intervall | `minimize_scalar(h, bounds=(a,b), method='bounded')`, der `h(alpha)` returnerer ett tall. |
| Stoppvalg | `options={'xatol': 1e-10}` er en absolutt toleranse for $\alpha$; ingen garanti for feil i funksjonsverdien eller global optimalitet. |
| Resultat | `line.x` er $\alpha$, `line.fun` er `h(alpha)`, `line.nfev` teller funksjonskall, `line.success` er rutines stoppstatus. |

Beregn deretter $z+\alpha p$ og kontroller den **fulle** gradienten:
en liten derivert *langs linjen* er ikke det samme som $\nabla f=0$.

**Overføring:** Hvis $f$ bare var tilgjengelig som laboratoriemålinger,
hvilken del av denne metoden ville mangle? Hva fra 9.1–9.2 kan fortsatt
utføres?

<details class="reading-step">
<summary>Gå i dybden: hvorfor halvering og linjesøk er forskjellige</summary>

Skriv $p=-\nabla f(z)$ og $g(\alpha)=f(z+\alpha p)$.
Derivasjon langs linjen gir $g'(0)=\nabla f(z)^Tp=-\|\nabla f(z)\|^2$.
Til forskjell fra SPD-tilfellet er $g$ her ikke generelt en parabel,
så uttrykket $(r^Tr)/(r^TAr)$ fra uke 6 kan ikke brukes. Betingelsen
i `shrinking_steps` er en enkel Armijo-test:
$f(z+\alpha p)\leq f(z)+10^{-4}\alpha\nabla f(z)^Tp$.
Vi starter med $\alpha=1$ og halverer til testen er oppfylt.
Ved en glatt funksjon og en nedgående retning finnes tilstrekkelig små
positive steg som oppfyller testen.

Avgrenset numerisk linjesøk bruker ekstra funksjonsevalueringer for å
velge én steglengde, mens Armijo-halvering bare prøver å finne et
tilstrekkelig nedgående steg. Valget av intervall kan utelate bedre steg.
At den deriverte langs linjen er nær null i forsøket, mens den fulle
gradientnormen ikke er det, viser forskjellen mellom de to oppgavene.

</details>

## 9.4 Regneoppgaver

<div id="uke9-oppgaver"></div>

Regn uten å kjøre kode først. Skriv brøker eller hele tall i feltene;
for vektorer skriver du én komponent i hver svarboks.

::: {#week9-model-context .math-exercise-context}

Gjennom uken er $f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2$ på $\mathbb R^2$.
Et gitter med $m$ koordinatverdier i hver akse har $m^2$ punkter.
Kompassøket tester i denne rekkefølgen
$(x+\Delta,y),(x-\Delta,y),(x,y+\Delta),(x,y-\Delta)$ og velger
minste funksjonsverdi ved forbedring. Gradientmetoden bruker
$z_{k+1}=z_k-\alpha\nabla f(z_k)$ med analytisk gradient
$(4x(x^2+y-11)+2(x+y^2-7),\ 2(x^2+y-11)+4y(x+y^2-7))$.
En funksjon som er en sum av kvadrater er ikke-negativ.

:::

### Oppgave 1 – prøvetall

```{math-exercise}
#| label: week9-task-grid-count
#| caption: Antall punkter på gitteret
#| mode: equivalent
#| context: week9-model-context

Et gitter har 9 verdier i hver koordinat. Hvor mange funksjonsverdier
må beregnes? Skriv et heltall.

Antall evalueringer: __[81]
```

### Oppgave 2 – første kompassrunde

```{math-exercise}
#| label: week9-task-compass-first
#| caption: Funksjonsverdi etter første flytting
#| mode: equivalent
#| context: week9-model-context

Start i $(0,0)$ med $\Delta=1$. Finn funksjonsverdien i punktet som
kompassøket velger etter én runde, når alle fire kandidater undersøkes.
Skriv et heltall.

Valgt funksjonsverdi: __[136]
```

### Oppgave 3 – retning og et kort steg

```{math-exercise}
#| label: week9-task-first-gradient-step
#| caption: Gradientretning og nytt punkt
#| mode: equivalent
#| partial-credit: true
#| field-labels: første komponent i negativ gradient, andre komponent i negativ gradient, første koordinat i nytt punkt, andre koordinat i nytt punkt
#| context: week9-model-context

Fra $z_0=(0,0)$, finn $-\nabla f(z_0)$ og neste punkt når
$\alpha=1/100$. Skriv én komponent i hver svarboks.

$-\nabla f(z_0)=$ vec[14,22]

$z_1=$ vec[7/50,11/50]
```

### Oppgave 4 – matematisk sertifikat

```{math-exercise}
#| label: week9-task-certificate
#| caption: Verdi og global nedre grense
#| mode: equivalent
#| partial-credit: true
#| field-labels: funksjonsverdi ved nullpunktet, global nedre grense
#| context: week9-model-context

Finn $f(3,2)$ og den største mulige nedre grensen for $f$ på hele planet.
Skriv to hele tall. Begrunn muntlig hvorfor disse tallene sammen
viser at $(3,2)$ er globalt minimumspunkt.

$f(3,2)=$ __[0]

Nedre grense: __[0]
```

I denne uken valgte gradienten en retning, mens funksjonsverdiene
avgjorde om steget var forsvarlig. I [uke 10](uke10.qmd#uke10-likning)
bruker vi også Hessianen til å forme retningen etter lokal krumning.
Vi må fortsatt kontrollere at hele steget faktisk forbedrer målet.

:::
