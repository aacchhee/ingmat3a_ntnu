<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 10.0 Oversikt

<div id="uke10-start"></div>

### Fra helning til krumning

I [uke 6](uke6.qmd#uke6-energi) fant vi minimum av en kvadratisk funksjon ved å løse et lineært system, blant annet med [konjugert gradient (CG)](uke6.qmd#uke6-cg). I [uke 8](uke8.qmd#uke8-hessian) brukte vi Hessianen til å kjenne igjen minimum og sadelpunkter. I [uke 9](uke9.qmd#uke9-gradient) valgte vi en retning fra gradienten og kontrollerte steglengden mot den faktiske funksjonen. **Newtons metode** bruker krumningen til å velge retning. Vi skal skille mellom å oppdatere punktet i *minimeringen* og å løse det *lineære systemet* som gir retningen. Målet er fortsatt å minimere en glatt funksjon uten bibetingelser.

Vi begynner med kvadratikken fra uke 6: her treffer Newton minimum på ett steg. To videre forsøk viser hva som kan gå galt: En negativ krumning kan gi en oppadgående retning, og en positiv krumning kan gi et helt steg som er for langt. Vi endrer da henholdsvis *retningen* ved regularisering og *lengden* ved demping. Til slutt sammenligner vi med SciPy. Regneoppgavene står i 10.5 og korte, selvstendige kodeoppgaver i 10.6. **Gå i dybden** åpner lengre begrunnelser.

### Læringsmål

Etter denne uken skal du kunne

- beregne gradient og Hessian, løse systemet som gir Newton-retningen og forklare hvor CG kan brukes inni dette steget,
- regne ut ett Newton-steg for en kvadratisk funksjon og forklare hvorfor det treffer minimum,
- bruke Hessianens egenverdier og $g^Tp$ til å skille sadelpunkt og oppadgående retning fra lokalt minimum og nedgangsretning,
- regularisere en indefinit Hessian og velge en dempet steglengde ved å kontrollere faktiske funksjonsverdier,
- tolke et numerisk stoppresultat og begrunne et globalt minimum når en egen nedre grense finnes.

## Python-oppsett

<div id="uke10-oppsett"></div>

Denne cellen importerer pakkene og definerer funksjonene som brukes i ukens
forsøk. Den kjøres automatisk når Python er klart. **Vent på meldingen
«Oppsett for uke 10 er klart» før du kjører et eksperiment.** Første oppstart
kan ta litt tid fordi nettleseren må hente pakkene.

`well`, `well_grad` og `well_hess` beskriver dobbeltbrønnen i 10.2.
`valley`, `valley_grad` og `valley_hess` beskriver dalen i 10.3.
`armijo` halverer stegfaktoren til nedgangstesten er oppfylt.
Du kan lese koden og kjøre oppsettet på nytt med **Kjør**.
Hvis en celle melder at et navn ikke er definert, kjør oppsettet på nytt
og deretter forsøket. Kodeoppgavene til slutt inneholder sine egne importer.

{{< include ../_includes/optimization/week10_setup.md >}}

## 10.1 Newton på en kvadratisk skål

<div id="uke10-likning"></div>

La $x=(u,v)^T$ og $f(x)$ være funksjonen vi vil minimere. **Gradienten** $g(x)=\nabla f(x)$ samler de første partiellderiverte; **Hessianen** $H(x)=\nabla^2 f(x)$ samler de andre. Vi vet fra 8.2 at gradient null er nødvendig ved et indre, deriverbart lokalt minimum, men ikke tilstrekkelig. Et **Newton-steg** velger en endring $p$ som får den lokalt tilnærmede gradienten til å bli null.

Bruk den kjente funksjonen fra uke 6:

$$\phi(x)=\tfrac12x^TAx-b^Tx,\qquad
A=\begin{bmatrix}3&1\\1&2\end{bmatrix},\quad b=\begin{bmatrix}5\\5\end{bmatrix}.$$

Her er $g(x)=Ax-b$ og $H(x)=A$ i *alle* punkter. Starter vi i $x_0=(-2,3)^T$, får vi

$$g(x_0)=\begin{bmatrix}-8\\-1\end{bmatrix},\qquad
Ap=-g(x_0)=\begin{bmatrix}8\\1\end{bmatrix}.$$

Regn gjennom ett ytre Newton-steg for hånd. Først finner vi retningen $p$ ved å løse et lineært system; deretter legger vi $p$ til startpunktet:

| Del | Utregning | Hva den gir |
|:--|:--|:--|
| Gradient i $x_0$ | $Ax_0-b=(-8,-1)^T$ | Høyresiden er $-g(x_0)=(8,1)^T$. |
| Skriv systemet | $3p_1+p_2=8$ og $p_1+2p_2=1$ | Vi søker de to komponentene i $p$. |
| Eliminer $p_2$ | $p_2=8-3p_1$; dermed $p_1+2(8-3p_1)=1$, altså $-5p_1=-15$ | $p_1=3$. |
| Sett tilbake | $p_2=8-3\cdot3=-1$ | $p=(3,-1)^T$. |
| Oppdater og kontroller | $x_1=(-2,3)^T+(3,-1)^T=(1,2)^T$; $Ax_1-b=(5,5)^T-(5,5)^T$ | $g(x_1)=0$. |

Cellen gjentar regningen. Vi vil kontrollere at det *nye punktet*, og ikke bare retningen, har gradient null. `np.linalg.solve` løser systemet uten en eksplisitt matriseinvers.

```{pyodide-python}
#| label: week10-quadratic-step
# Matrisen A og vektoren b er de samme som i uke 6.
A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 5.])
x = np.array([-2., 3.])
# Beregn høyresiden -g i systemet A p = -g.
g = A @ x - b
p = np.linalg.solve(A, -g)
# Skil løsningen av systemet p fra Newton-oppdateringen x1.
x1 = x + p
print('Lineært system: -g(x0) =', -g)
print('Løsning av systemet: p =', p)
print('Newton-oppdatering: x1 =', x1)
print('Kontroll: ||g(x1)|| =', np.linalg.norm(A @ x1-b))
```

Resultatet er $p=(3,-1)^T$ og $x_1=(1,2)^T$ med gradientnorm 0 innen flyttallspresisjon. Dette gjelder fra *ethvert* startpunkt: $g(x+p)=Ax-b+Ap=g(x)+Ap=0$. $A$ er **symmetrisk positiv definit (SPD)**: begge egenverdiene $(5\pm\sqrt5)/2$ er positive. Derfor er $(1,2)$ også det entydige globale minimumspunktet. Ett steg er her eksakt fordi krumningen er konstant.

### Regelen bak forsøket

For en glatt, to ganger deriverbar funksjon er den lokale kvadratiske modellen fra [uke 8](uke8.qmd#uke8-hessian)

$$m_x(p)=f(x)+g(x)^Tp+\tfrac12p^TH(x)p.$$

Uttrykket beskriver funksjonen nær $x$ når vi flytter oss med $p$. Modellens gradient med hensyn til $p$ er $g(x)+H(x)p$. Hvis $H(x)$ er SPD, finner vi modellens entydige minimum ved å løse

$$H(x_k)p_k=-g(x_k),\qquad x_{k+1}=x_k+p_k.$$

Newton-systemet har en entydig løsning når $H$ er **invertibel**, altså når ingen egenverdi er null. SPD sikrer i tillegg at retningen minimerer den kvadratiske modellen. En invertibel, indefinit Hessian kan derfor gi en entydig Newton-retning som ikke peker nedover.

Dette er også lineariseringen $g(x+p)\approx g(x)+H(x)p$ av likningen $g=0$. For en ikke-kvadratisk funksjon er modellen bare lokal og Hessianen kan endre seg. Da må vi beregne en ny retning i hvert punkt og undersøke det foreslåtte steget.

### To typer iterasjoner: Newton utenpå, CG inni

I [uke 6](uke6.qmd#uke6-cg) løste CG $Az=b$ ved å minimere $\tfrac12z^TAz-b^Tz$ når $A$ er SPD. Her får vi på hvert ytre Newton-steg et *nytt* system $H(x_k)p_k=-g(x_k)$. Hvis $H(x_k)$ er SPD, kan CG løse dette systemet iterativt: sett $z=p_k$, $A=H(x_k)$ og høyresiden $b=-g(x_k)$. CG minimerer da den lokale modellen $m_{x_k}(p)$, opp til konstantleddet $f(x_k)$. En indre CG-iterasjon forbedrer et anslag på **samme** $p_k$; først etter den lineære løsningen oppdaterer Newton punktet $x_{k+1}$.

| Nivå | Hva endres? | I skålen fra starten $x_0=(-2,3)^T$ |
|:--|:--|:--|
| Indre CG | Anslaget på $p$ i $Ap=(8,1)^T$. | Fra $p=0$ ville eksakt CG finne $p=(3,-1)^T$ på høyst to indre iterasjoner i eksakt aritmetikk. |
| Ytre Newton | Punktet $x$ etter at retningen er funnet. | Én oppdatering gir $x_1=x_0+p=(1,2)^T$. |

I to dimensjoner er `np.linalg.solve` enklere. For store systemer kan en iterativ indre løsning spare arbeid. **Vanlig CG fra uke 6 krever SPD**; at $H$ bare er invertibel er ikke nok. Ved negativ krumning i 10.2 må vi håndtere dette, for eksempel ved å regularisere Hessianen før vi eventuelt bruker CG. Et indre CG-stopp før eksakt løsning gir dessuten en tilnærmet Newton-retning.

<details class="reading-step">
<summary>Gå i dybden: Jacobimatrise og hvorfor SPD gir nedgang</summary>

I [uke 2](page4.qmd) brukte vi Newton på én likning. For en vektorfunksjon $g=(g_1,g_2)^T$ er **Jacobimatrisen** $J_g$ gitt ved $(J_g)_{ij}=\partial g_i/\partial x_j$. Når $g=\nabla f$, er $J_g=H_f$. For kontinuerlige andrederiverte er $f_{uv}=f_{vu}$, så Hessianen er symmetrisk. Likningen $H(x)p=-g(x)$ er dermed Newton-lineariseringen av $g(x)=0$.

Ved SPD-Hessian og $g\ne0$ er $p\ne0$, og $g^Tp=-p^THp<0$. Indreproduktet $g^Tp$ er den **retningsderiverte**: det beskriver den første endringen når vi går et lite positivt stykke langs $p$. Modellen synker med $m_x(p)-m_x(0)=-\tfrac12p^THp<0$. Den virkelige funksjonen synker for tilstrekkelig små positive steg, men trenger ikke å synke for hele $p$.

</details>

## 10.2 Negativ krumning: feil retning og feil punkt

<div id="uke10-stasjonaer"></div>

Studer **dobbeltbrønnen** $f(u,v)=(u^2-1)^2+v^2/2$. Siden begge ledd er ikke-negative, er $(1,0)$ og $(-1,0)$ globale minimumspunkter med verdi 0. Derivasjon gir

$$g(u,v)=\begin{bmatrix}4u(u^2-1)\\v\end{bmatrix},\qquad
H(u,v)=\begin{bmatrix}12u^2-4&0\\0&1\end{bmatrix}.$$

Vi undersøker hvordan en løst Newton-likning kan gi feil retning. Ved $x=(0.2,0)^T$ viser gradient, Hessian og retningsderivert årsaken:

| Trinn | Regning | Tolkning |
|:--|:--|:--|
| Deriverte | $g=(-0.768,0)^T$, $H=\operatorname{diag}(-3.52,1)$ | Krumningen langs $u$ er negativ. |
| Newton-system | $-3.52p_1=0.768$, $p_2=0$ | $p\approx(-0.218182,0)^T$. |
| Retningsderivert | $g^Tp\approx0.16756>0$ | Små positive steg i denne retningen går *oppover*. |

Cellen sammenligner deretter $f(x)$ med $f(x+p)$, slik at vi ser om den faktiske endringen følger fortegnet til retningsderiverten. Den undersøker også hvorfor $g=0$ i origo ikke alene er nok til å kalle punktet et minimum.

```{pyodide-python}
#| label: week10-ascent
# Ved u=0.2 er krumningen i u-retning negativ.
x = np.array([.2, 0.])
g, H = well_grad(x), well_hess(x)
# Løs H p = -g; fortegnet til g·p tester små positive steg.
p = np.linalg.solve(H, -g)
print('I x=(0.2, 0): g =', g)
print('H-egneverdier =', np.linalg.eigvalsh(H))
print('Retning p =', p, 'med g·p =', g @ p)
print('Funksjonsverdi før =', well(x), 'og etter helt steg =', well(x+p))
# I origo tester egenverdiene hva som skjer i ulike retninger.
print('I origo: ||g|| =', np.linalg.norm(well_grad([0., 0.])))
print('I origo: egenverdier H =', np.linalg.eigvalsh(well_hess([0., 0.])))
```

Funksjonen øker fra $0.9216$ til omtrent $0.99934$ etter helt steg. I origo er gradienten null, men Hessianens egenverdier er $-4$ og $1$: langs $u$ synker funksjonen fra 1, mens den langs $v$ stiger. Origo er et **sadelpunkt**. En liten gradientnorm alene ville ha stoppet også her. Fra [uke 8](uke8.qmd#uke8-hessian) vet vi at SPD-Hessian *ved et eksakt stasjonært punkt* gir et strengt lokalt minimum; en **indefinit** Hessian med egenverdier av begge fortegn gir sadelpunkt. For globalitet kreves et argument som gjelder hele området, slik som sum av ikke-negative ledd ovenfor.

## 10.3 Sikre retningen og lengden

<div id="uke10-demping"></div>

### Regularisering endrer retningen

For å rette oppadgående Newton-retning kan vi legge til $\lambda I$ i Hessianen og løse $(H+\lambda I)p=-g$. Her er $I$ identitetsmatrisen og $\lambda\ge0$. Dette kalles **regularisering**. Hver egenverdi øker med $\lambda$. La $\lambda_{\min}(H)$ betegne den minste egenverdien til $H$; velg i vårt lille forsøk

$$\lambda=\max(0,\,0.25-\lambda_{\min}(H)),$$

slik at den minste egenverdien til $H+\lambda I$ blir minst 0.25. I vårt punkt er $\lambda_{\min}(H)=-3.52$, så $\lambda=0.25-(-3.52)=3.77$. Dermed er $H+\lambda I=\operatorname{diag}(0.25,4.77)$: en SPD-matrise som også ville egne seg for vanlig CG. Løsningen av $(H+\lambda I)p=(0.768,0)^T$ er $p=(3.072,0)^T$, og $g^Tp=-2.359296<0$. Retningen er nedgående *nær* startpunktet, men et helt steg kan fortsatt gå for langt.

### Demping kontrollerer steglengden

Vi prøver derfor **demping** med faktorer $\alpha=1,1/2,1/4,\ldots$ og setter $x_+=x+\alpha p$. [Armijo-testen fra uke 9](uke9.qmd#uke9-linjesok) krever her

$$f(x+\alpha p)\le f(x)+10^{-4}\alpha g^Tp.$$

Når $g^Tp<0$, krever høyresiden en faktisk reduksjon. Cellen viser hvor langt vi kan gå langs den nye retningen: Den prøver først tre steg og skriver ut verdiene, før `armijo` velger den første godkjente faktoren og antall halveringer. Funksjonen avviser retninger som ikke er nedgående, og har et begrenset antall forsøk.

```{pyodide-python}
#| label: week10-regularized-step
# Sjekk hvilken egenverdi som må flyttes for å få positiv krumning.
x = np.array([.2, 0.])
g, H = well_grad(x), well_hess(x)
lam = max(0., .25 - np.linalg.eigvalsh(H)[0])
p = np.linalg.solve(H + lam*np.eye(2), -g)
# Se hvilke prøvesteg som faktisk senker f fra startverdien.
print(f'Startverdi f(x) = {well(x):.6f}')
print('alpha    f(x+alpha*p)')
for a in [1., .5, .25]:
    print(f'{a:<8g} {well(x+a*p):.6f}')
# Armijo tester i samme rekkefølge og krever tilstrekkelig nedgang.
a, halvings = armijo(well, g, x, p)
print('lambda =', lam, 'og g·p =', g @ p)
print('Godkjent alpha =', a, '| antall halveringer =', halvings)
print('Nytt punkt =', x+a*p)
```

Hele og halve steg øker $f$. Kvart steg gir $(0.968,0)$ og omtrent $0.00396$, fra $0.9216$. Regulariseringen endret retningen, og dempingen bestemte hvor langt vi skulle følge den. Tallet 0.25 i regulariseringen er et illustrerende valg, ikke en universell parameter.

Prøv nå den **bøyde dalen**. Dette forsøket viser at hele steget kan svikte selv om Hessianen er SPD og retningen peker nedover nær start:

$$q(u,v)=(1-u)^2+10(v-u^2)^2.$$

Begge ledd er ikke-negative og $q(1,1)=0$, så $(1,1)$ er et globalt minimumspunkt. Ved å derivere får vi

$$g(u,v)=\begin{bmatrix}2(u-1)-40u(v-u^2)\\20(v-u^2)\end{bmatrix},\qquad
H(u,v)=\begin{bmatrix}2-40v+120u^2&-40u\\-40u&20\end{bmatrix}.$$

I $(0,0)$ er $g=(-2,0)^T$ og $H=\operatorname{diag}(2,20)$, altså SPD. Løser vi $Hp=-g$, får vi $p=(1,0)^T$. Langs denne retningen skiller modell og funksjon lag:

| Faktor | Lokal kvadratisk modell $m_x(\alpha p)=(1-\alpha)^2$ | Faktisk $q(x+\alpha p)=(1-\alpha)^2+10\alpha^4$ |
|:--|--:|--:|
| $0$ | $1$ | $1$ |
| $1$ | $0$ | $10$ |
| $1/2$ | $1/4$ | $7/8=0.875$ |

Hele steget øker altså verdien fra 1 til 10; halvt steg senker den til $0.875$ og godtas av Armijo. Forskjellen $10\alpha^4$ er et ledd den lokale modellen ikke fanger opp.

Cellen sammenligner hele og dempede banen på nivåkurver: Se hvor det første punktet etter start havner på hver bane. Under nivåkurvene sammenlignes modell og virkelig verdi langs den første retningen; avstanden viser hvorfor et fullt steg er risikabelt. `valley`, `valley_grad` og `valley_hess` i oppsettet definerer funksjonen og dens deriverte.

```{pyodide-python}
#| label: week10-backtrack-positive-hess
# Finn retningen fra origo og test hvor langt vi kan følge den.
x = np.array([0., 0.])
g, H = valley_grad(x), valley_hess(x)
p = np.linalg.solve(H, -g)
a, halvings = armijo(valley, g, x, p)
print('Krumning: H-egneverdier =', np.linalg.eigvalsh(H))
print('Retning p =', p)
print('Fullt steg: q(x) =', valley(x), 'og q(x+p) =', valley(x+p))
print('Armijo: alpha =', a, '| antall halveringer =', halvings)
print('Dempet steg: q(x+alpha*p) =', valley(x+a*p))

# Gjenta ytre Newton-steg: løsning av H p = -g, så oppdatering av punktet.
def newton_path(damped, n):
    point = np.array([0., 0.])
    points = [point.copy()]
    for _ in range(n):
        grad, hess = valley_grad(point), valley_hess(point)
        direction = np.linalg.solve(hess, -grad)
        step = armijo(valley, grad, point, direction)[0] if damped else 1.
        point = point + step*direction
        points.append(point.copy())
    return np.array(points)

# Øverst: sammenlign oppdaterte punkter for fullt og dempet steg.
full_path = newton_path(damped=False, n=2)
damped_path = newton_path(damped=True, n=5)
fig, (ax_map, ax_line) = plt.subplots(2, 1, figsize=(6.5, 9))
u, v = np.meshgrid(np.linspace(-.1, 1.2, 180), np.linspace(-.2, 1.2, 180))
q_grid = (1-u)**2 + 10*(v-u*u)**2
ax_map.contour(u, v, q_grid,
               levels=[.001, .01, .05, .1, .25, .5, 1, 2, 5, 10],
               colors='#adb5bd', linewidths=.8)
for name, points, color in [('full Newton', full_path, '#b5483f'),
                            ('Armijo-dempet', damped_path, '#1665ad')]:
    ax_map.plot(points[:, 0], points[:, 1], 'o-', color=color,
                markersize=4, linewidth=1.5, label=name)
ax_map.plot(0, 0, 'ks', markersize=6, label='start k=0')
ax_map.plot(1, 1, 'k*', markersize=11, label='q=0')
ax_map.annotate('full: k=1, q=10', (1, 0), xytext=(-130, 45),
                textcoords='offset points', color='#92392f', fontsize=8,
                arrowprops={'arrowstyle': '-', 'color': '#92392f'})
ax_map.annotate('dempet: k=1, q=0.875', (.5, 0), xytext=(5, -29),
                textcoords='offset points', color='#14517f', fontsize=8,
                arrowprops={'arrowstyle': '-', 'color': '#14517f'})
ax_map.set(xlim=(-.1, 1.2), ylim=(-.2, 1.2), xlabel='u', ylabel='v',
           title='Baner over nivåkurvene til faktisk q')
ax_map.set_aspect('equal')
ax_map.legend(fontsize=8, loc='upper left')

# Nederst: sammenlign modellen med faktisk q langs første retning.
alpha_grid = np.linspace(0, 1.1, 180)
actual = np.array([valley(x+t*p) for t in alpha_grid])
model = valley(x) + alpha_grid*(g @ p) + .5*alpha_grid**2*(p @ H @ p)
ax_line.plot(alpha_grid, actual, color='#34495e', label='faktisk q(x+αp)')
ax_line.plot(alpha_grid, model, '--', color='#9262a4', label='lokal modell mₓ(αp)')
ax_line.plot([a, 1], [valley(x+a*p), valley(x+p)], 'ko', markersize=4)
ax_line.set(xlabel='Faktor α langs første Newton-retning',
            ylabel='Verdi', title='Modellen undervurderer hele steget')
ax_line.legend(fontsize=8)
fig.tight_layout()
plt.show()
```

Øverst går fullt Newton først til $(1,0)$, hvor $q=10$, og deretter til $(1,1)$. Den dempede banen senker verdien allerede på første steg og fortsetter gjennom fem godkjente steg. Nederst viser avstanden $10\alpha^4$ mellom kurvene hvorfor modellen undervurderer store steg. SPD sikrer nedgang for *tilstrekkelig små* steg, ikke for hvert helt steg.

<details class="reading-step">
<summary>Gå i dybden: lokal fart og grensen for sikringen</summary>

La $e_k=\|x_k-x_*\|_2$ være avstanden til et eksakt stasjonært punkt.
**Kvadratisk konvergens** betyr at $e_{k+1}\le C e_k^2$ nær løsningen,
for en konstant $C$. Hvis for eksempel $C=1$ og feilen er $10^{-2}$,
blir neste feil høyst $10^{-4}$ og den neste høyst $10^{-8}$.
Dette illustrerer feilgrensen; det er ikke målte tall fra forsøket.

En **lokalt Lipschitz-kontinuerlig Hessian** endrer seg høyst en
konstant ganger avstanden mellom punktene i et lite område.
Den konstante Hessianen i 10.1 oppfyller dette, siden endringen er null.
Hvis $g(x_*)=0$, $H(x_*)$ er invertibel, Hessianen oppfyller dette
kravet og starten er nær nok, har rene Newton-steg kvadratisk konvergens.
Påstanden er lokal og gjelder også nær stasjonære punkter som ikke er minima.

En vanlig måte å bevare samme lokale sluttfart i en sikret metode på
er at regulariseringen blir inaktiv og linjesøket etter hvert godtar
$\alpha=1$. En fast positiv $\lambda$ kan gi tregere sluttfase.
Å bygge Hessianen og løse et system koster dessuten mer per steg enn
en gradientoppdatering. Selv når $g^Tp<0$, garanterer teorien bare at
et tilstrekkelig lite steg gir nedgang; et linjesøk med et endelig
halveringsbudsjett kan melde feil.

</details>

## 10.4 Sammenlign og kontroller

<div id="uke10-scipy"></div>

SciPys `minimize` fra [uke 8](uke8.qmd#uke8-scipy) kan gjøre hele søket for den bøyde dalen. `BFGS` anslår krumningen fra gradientendringer. `Newton-CG` bruker Hessianinformasjon og en indre, CG-basert iterasjon for å finne retningen til hvert ytre steg. Her betyr «CG» altså arbeid *inni* Newton-steget, som i tabellen i 10.1. SciPys algoritme er ikke det samme som å kalle uke 6s vanlige SPD-CG blindt på enhver Hessian, og heller ikke identisk med vår eksplisitte regularisering. Vi sammenligner fra samme start for å se sluttpunkt, verdi, gradientnorm og rapportert arbeid.

```{pyodide-python}
#| label: week10-scipy-compare
# Samme dal og startpunkt gjør sluttpunkt og tellere sammenlignbare.
for name, kwargs in [('BFGS', {}), ('Newton-CG', {'hess': valley_hess})]:
    # Newton-CG får Hessianen; BFGS anslår krumning fra gradienter.
    res = minimize(valley, np.array([0., 0.]), jac=valley_grad,
                   method=name, options={'maxiter': 100}, **kwargs)
    # Skill stoppstatus, sluttresultat og antall funksjonskall.
    print(f'{name}: success={res.success}, ytre iterasjoner={res.nit}')
    print('  x =', np.round(res.x, 8), 'q(x) =', f'{valley(res.x):.3e}')
    print('  ||g(x)|| =', f'{np.linalg.norm(valley_grad(res.x)):.3e}')
    print(f'  evalueringer: q={res.nfev}, g={res.njev}, '
          f'H={getattr(res, "nhev", 0)}')
```

Begge ender nær $(1,1)$ med liten verdi og gradientnorm. Et `success`-flagg betyr at metodens egne stoppkrav ble møtt, ikke at et globalt minimum er bevist. Her beviser vi globalitet separat: $q$ er summen av to ikke-negative ledd og $q(1,1)=0$. Færre ytre iterasjoner er heller ikke nødvendigvis mindre arbeid, siden Hessian, gradient og indre lineære løsninger har forskjellige kostnader.

<details>
<summary>SciPy-oppslag: kall og resultat</summary>

| Uttrykk | Betydning her |
|:--|:--|
| `minimize(fun, x0, jac=grad, method='BFGS')` | Søk fra `x0`; `fun` returnerer et tall, `grad` en vektor. |
| `method='Newton-CG', hess=H` | Gi også funksjonen som returnerer Hessianmatrisen. |
| `options={'maxiter': 100}` | Begrens antall ytre iterasjoner. |
| `res.x`, `res.fun`, `res.success` | Funnet punkt, verdi og solverens stoppstatus. |
| `res.nit`, `res.nfev`, `res.njev`, `res.nhev` | Ytre iterasjoner og antall mål-, gradient- og Hessian-evalueringer når feltene finnes. |

`jac` er SciPys navn på gradientargumentet. `np.linalg.solve(H,-g)` fra de små forsøkene løser ett lineært system; `minimize` håndterer en serie oppdateringer og egne stoppvilkår.

</details>

I [uke 11](uke11.qmd) får vi lineære bibetingelser og ofte et beste punkt på randen. Da er gradient null ikke lenger den riktige nødvendige kontrollen.

## 10.5 Regneoppgaver

<div id="uke10-oppgaver"></div>

Oppgave 1 følger kvadratikken i 10.1, oppgave 2–4 dobbeltbrønnen i 10.2–10.3, og oppgave 5–6 den bøyde dalen. Svar eksakt der det står «eksakt». Når desimaler er tillatt, rund til angitt antall plasser. For vektorer fyller du inn én verdi i hvert komponentfelt. Begrunn klassifiseringene i egne notater; feltene kontrollerer regningen. Kodeoppgavene følger i 10.6.

**Oppgave 1 – ett Newton-steg i skålen fra uke 6.**

```{math-exercise}
#| label: week10-task-quadratic
#| caption: Oppgave 1 – ett Newton-steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: p første komponent, p andre komponent, x1 første komponent, x1 andre komponent

Bruk $A=\begin{bmatrix}3&1\\1&2\end{bmatrix}$, $b=(5,5)^T$ og $\phi(x)=\tfrac12x^TAx-b^Tx$. Fra $x_0=(0,0)^T$: løs $Ap=-\nabla\phi(x_0)$ og finn punktet etter ett steg. Svar eksakt.

$p=$ vec[1,2]

$x_1=$ vec[1,2]
```

**Oppgave 2 – sadelpunktet i dobbeltbrønnen.**

```{math-exercise}
#| label: week10-task-saddle
#| caption: Oppgave 2 – sadelpunkt
#| mode: equivalent
#| partial-credit: true
#| field-labels: Gradient første komponent, Gradient andre komponent, Minste egenverdi, Største egenverdi

For $f(u,v)=(u^2-1)^2+v^2/2$, beregn gradienten i $(0,0)$ og Hessianens egenverdier der i stigende rekkefølge. Svar eksakt. Hvorfor er punktet ikke et minimum?

$\nabla f(0,0)=$ vec[0,0]

$\lambda_{\min}=$ _[-4], $\lambda_{\max}=$ _[1]
```

**Oppgave 3 – Newton-retning med negativ krumning.**

```{math-exercise}
#| label: week10-task-direction
#| caption: Oppgave 3 – retningsderivert
#| mode: equivalent
#| partial-credit: true
#| field-labels: Første komponent av p, Andre komponent av p, g prikk p

For dobbeltbrønnen over: start i $(1/2,0)$ og løs $Hp=-g$ eksakt. Beregn $g^Tp$. Betyr fortegnet nedgang eller oppgang for små positive steg?

$p=$ vec[-3/2,0]

$g^Tp=$ _[9/4]
```

**Oppgave 4 – regularisering retter retningen.**

```{math-exercise}
#| label: week10-task-regularize
#| caption: Oppgave 4 – regularisert retning
#| mode: equivalent
#| partial-credit: true
#| field-labels: Første komponent av p, Andre komponent av p, g prikk p

I samme punkt $(1/2,0)$, løs $(H+2I)p=-g$. Beregn $g^Tp$ og forklar hvorfor et lite positivt steg nå gir nedgang. Svar eksakt.

$p=$ vec[3/2,0]

$g^Tp=$ _[-9/4]
```

**Oppgave 5 – modellen i den bøyde dalen.**

```{math-exercise}
#| label: week10-task-valley
#| caption: Oppgave 5 – modell og virkelig verdi
#| mode: equivalent
#| partial-credit: true
#| field-labels: Newton-retning første komponent, Newton-retning andre komponent, modell ved fullt steg, faktisk verdi ved fullt steg

For $q(u,v)=(1-u)^2+10(v-u^2)^2$ er $g(0,0)=(-2,0)^T$ og $H(0,0)=\operatorname{diag}(2,20)$. Finn $p$ fra $Hp=-g$, modellverdien $m_{(0,0)}(p)=q(0,0)+g^Tp+\tfrac12p^THp$, og den faktiske verdien $q((0,0)+p)$. Svar eksakt.

$p=$ vec[1,0]

$m_{(0,0)}(p)=$ _[0] &nbsp; $q(p)=$ _[10]
```

**Oppgave 6 – halvt steg og global grense.**

```{math-exercise}
#| label: week10-task-half-step
#| caption: Oppgave 6 – dempet steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: Halvt steg første koordinat, Halvt steg andre koordinat, Funksjonsverdien etter halvt steg, Global minimumsverdi

Bruk $q(u,v)=(1-u)^2+10(v-u^2)^2$, start $(0,0)$ og retning $p=(1,0)$. Beregn punktet og funksjonsverdien for $\alpha=1/2$. Hvilken global nedre grense følger av uttrykket som sum av kvadrater, og oppnås den? Svar eksakt.

$x_+=$ vec[1/2,0]

$q(x_+)=$ _[7/8] &nbsp; Global minimumsverdi: _[0]

En numerisk løser rapporterer <code>success=True</code> og liten gradientnorm.
Forklar i egne notater hva dette kontrollerer, og hvilket eget
argument som viser at verdi 0 er globalt best for akkurat $q$.
```

Arbeid videre med [prosjekt 10: startpunkt, skala og Newton](project_week10.qmd).

## 10.6 Python: prøv stegene selv

<div id="uke10-python"></div>

Fullfør tre korte funksjoner. Hver oppgave har egne importer og definisjoner og kan kjøres uavhengig av cellene over og av de andre oppgavene. `TODO` markerer det du skal fylle inn. Kontrollene prøver flere inndata uten å vise løsningskoden.

**Oppgave 1 – løs Newton-systemet.** Funksjonen skal returnere retningen $p$ for den kvadratiske skålen med Hessian $A$, for et vilkårlig startpunkt `x`.

```{py-exercise}
#| label: week10-python-quadratic
#| caption: Newton-retning i den kvadratiske skålen
#| show-test-hints: false
import numpy as np

# Den konstante Hessianen og høyresiden fra uke 6.
A = np.array([[3., 1.], [1., 2.]])
b = np.array([5., 5.])

def newton_direction(x):
    # Beregn gradienten ved x.
    g = A @ x - b
    # TODO: Løs A p = -g uten å beregne matriseinversen.
    p = np.zeros(2)
    return p

## TESTS ##
assert np.allclose(newton_direction(np.array([-2., 3.])), [3., -1.])
assert np.allclose(newton_direction(np.array([0., 0.])), [1., 2.])
assert np.allclose(newton_direction(np.array([1., 2.])), [0., 0.])
```

**Oppgave 2 – kontroller krumningen.** Funksjonen skal returnere `True` bare når begge egenverdiene til dobbeltbrønnens Hessian ved `x` er strengt positive. `np.linalg.eigvalsh` er laget for symmetriske matriser.

```{py-exercise}
#| label: week10-python-curvature
#| caption: Er Hessianen positiv definit?
#| show-test-hints: false
import numpy as np

# Dobbeltbrønnens Hessian; oppgaven gjelder testen, ikke derivasjonen.
def well_hess(x):
    u, v = x
    return np.diag([12*u*u - 4, 1.])

def positive_curvature(x):
    # Beregn egenverdiene til den symmetriske Hessianen.
    eigenvalues = np.linalg.eigvalsh(well_hess(x))
    # TODO: Returner en boolsk verdi som krever positivt fortegn for alle.
    return False

## TESTS ##
assert positive_curvature(np.array([1., 0.]))
assert positive_curvature(np.array([-1., 3.]))
assert not positive_curvature(np.array([0., 0.]))
assert not positive_curvature(np.array([.5, 0.]))
```

**Oppgave 3 – velg mellom tre steglengder.** Bruk funksjonen for den bøyde dalen med et oppgitt punkt `x`, en retning `p` og gradient `g`. Prøv `1`, `1/2` og `1/4` i den rekkefølgen, og returner første faktor som oppfyller Armijo-ulikheten med $c=10^{-4}$. All kode utenom selve testen er gitt. Denne oppgaven krever ikke svarene i oppgave 1 eller 2.

```{py-exercise}
#| label: week10-python-armijo
#| caption: Velg første godkjente steglengde
#| show-test-hints: false
import numpy as np

# Den bøyde dalen; x, p og g kommer fra funksjonens argumenter.
def valley(x):
    u, v = x
    return (1-u)**2 + 10*(v-u*u)**2

def first_accepted(x, p, g):
    c = 1e-4
    for alpha in (1., .5, .25):
        # TODO: Erstatt False med Armijo-testen for dette alpha.
        if False:
            return alpha
    return None

## TESTS ##
assert first_accepted(np.array([0., 0.]), np.array([1., 0.]),
                      np.array([-2., 0.])) == .5
assert first_accepted(np.array([1., 0.]), np.array([0., 1.]),
                      np.array([40., -20.])) == 1.
assert first_accepted(np.array([0., 0.]), np.array([.1, 0.]),
                      np.array([-2., 0.])) == 1.
```

:::
