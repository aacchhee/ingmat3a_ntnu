<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 12.0 Oversikt

<div id="uke12-start"></div>

### Hvor kan vi bevege oss?

I [uke 11](uke11.qmd#uke11-dual) stoppet lineære ressursgrenser en ellers forbedrende produksjonsretning. Nå kan begrensningen være en **krum likning**, for eksempel at et punkt må ligge på en sirkel. Fra [uke 6](uke6.qmd#uke6-retning) vet vi at gradienten beskriver lokal endring, men $-\nabla f$ kan peke ut av den tillatte mengden. Vi undersøker derfor endring **langs** begrensningen, finner kandidater med Lagranges metode og skiller lokal stasjonaritet fra et globalt bevis, slik vi gjorde i [uke 8](uke8.qmd#uke8-lokalt).

Vi optimerer $f(x)$ under én eller flere likninger $h_i(x)=0$. Punktene som oppfyller alle likningene, utgjør den **tillatte mengden**. Du bruker derivasjon, skalarprodukt og lineære likninger fra tidligere uker. Etterpå skal du kunne forklare en tangent og en normal, løse multiplikatorlikningene under en regulær betingelse og kontrollere mulighet og stasjonaritet i et numerisk svar.

## 12.1 Sirkelen og de tillatte retningene

<div id="uke12-tangent"></div>

Vi vil først gjøre $f(x,y)=x+2y$ størst mulig når punktet $(x,y)$ ligger på enhetssirkelen $h(x,y)=x^2+y^2-1=0$. **Hvor på sirkelen tror dere maksimum ligger? Vil gradienten til $f$ være null der?** Start med å sammenligne retningen $(1,2)$ med radiusvektoren til de punktene dere foreslår.

```{pyodide-python}
#| label: week12-circle-experiment
theta = np.linspace(0, 2*np.pi, 721)
circle = np.column_stack((np.cos(theta), np.sin(theta)))
values = circle @ np.array([1., 2.])
imax, imin = np.argmax(values), np.argmin(values)
print('Største prøveverdi:', round(values[imax], 6), 'ved', np.round(circle[imax], 4))
print('Minste prøveverdi:', round(values[imin], 6), 'ved', np.round(circle[imin], 4))
fig, ax = plt.subplots(figsize=(6, 6))
xx, yy = np.meshgrid(np.linspace(-1.2, 1.2, 130), np.linspace(-1.2, 1.2, 130))
ax.contour(xx, yy, xx + 2*yy, levels=np.arange(-2, 2.1, .5), colors='#a6a6a6')
ax.plot(circle[:, 0], circle[:, 1], color='#1b607c', label='h = 0')
ax.plot(xx[0], (np.sqrt(5)-xx[0])/2, '--', color='#ad3d22',
        label='nivålinje f = √5')
ax.plot(*(np.array([1., 2.])/np.sqrt(5)), 'o', color='#ad3d22', label='eksakt maksimum')
ax.set(xlabel='x', ylabel='y', xlim=(-1.25, 1.25), ylim=(-1.25, 1.25))
ax.set_aspect('equal'); ax.legend(); plt.show()
```

Den tette prøvetakingen gir omtrent $2.236$ ved $(0.446,0.895)$, men prøvene alene beviser ikke at dette er størst. Nivålinjene $x+2y=c$ skyves i gradientretningen $(1,2)$ til de akkurat berører sirkelen. Ved berøringen kan vi fortsatt bevege oss *langs* sirkelen, men ingen slik liten bevegelse øker $f$ i første orden.

Skriv en glatt kurve av tillatte punkter som $p(t)$, med $p(0)=x_*$. Siden $h(p(t))=0$, gir kjerneregelen

$$\nabla h(x_*)\mathbin{\cdot}p'(0)=0.$$

Vektoren $p'(0)$ er en **tangentretning**, og $\nabla h(x_*)$ er en **normal**: den står vinkelrett på slike retninger. Tangenten er en øyeblikksfart langs en mulig kurve, ikke et løfte om at den rette linjen $x_*+tv$ består av tillatte punkter for endelige $t$. På sirkelen ved $(1,0)$ er $v=(0,1)$ tangent, mens $(1,t)$ ikke ligger på sirkelen når $t\ne0$.

I et lokalt ekstremalpunkt har også $\nabla f(x_*)\cdot p'(0)=0$: gradientens komponent langs tangenten er null. Vi kaller likningen **regulær** i punktet når $\nabla h(x_*)\ne0$; da beskriver den lokalt en glatt kurve, og gradientene må være parallelle. Vi skriver dette med et ukjent tall $\lambda$, en **Lagrangemultiplikator**, og velger fortegn ved å definere **Lagrangefunksjonen** $L(x,\lambda)=f(x)+\lambda h(x)$:

$$\boxed{h(x_*)=0,\qquad \nabla f(x_*)+\lambda\nabla h(x_*)=0.}$$

Den samme utledningen gjelder en **flate**: På enhetssfæren i $\mathbb R^3$ er $h(x,y,z)=x^2+y^2+z^2-1$, og ved $(0,0,1)$ er normalvektoren $\nabla h=(0,0,2)$. Alle tangentretninger ligger i planet med tredje komponent null. Vi trenger altså ikke parametrisere hele flaten for å kjenne dens tillatte retninger.

Her krever $h=0$ mulighet, mens $\nabla_xL=0$ sier at ingen tillatt tangentbevegelse endrer målet i første orden. $\lambda$ er ikke en ny fri koordinat på sirkelen. For vårt eksempel er $\nabla f=(1,2)$ og $\nabla h=(2x,2y)$; de to punktene er $\pm(1,2)/\sqrt5$. Funksjonsverdiene er $\pm\sqrt5$. Kompaktheten til sirkelen sikrer at globale maksimum og minimum finnes, og kandidatene dekker dem; alternativt gir Cauchy–Schwarz-ulikheten $|a^Tz|\le\|a\|\|z\|$ med $a=(1,2)$ direkte $x+2y\le\sqrt5\sqrt{x^2+y^2}=\sqrt5$. Dette er sterkere enn å bare finne en kandidat.

**Overføring:** Hvis vi erstatter sirkelen med $h(x,y)=x^2+4y^2-1=0$, hvilken vektor må gradienten til $f$ være parallell med ved et regulært ekstremalpunkt?

<details class="reading-step"><summary>Gå i dybden: parametrisering og fortegnet til multiplikatoren</summary>

Parametriser sirkelen med $p(t)=(\cos t,\sin t)$. Da er $p'(t)=(-\sin t,\cos t)$ og $f(p(t))=\cos t+2\sin t$. Den deriverte er $-\sin t+2\cos t=\nabla f(p(t))\cdot p'(t)$. Når den er null, er gradienten vinkelrett på tangenten, altså parallell med radiusen $p(t)$.

Lagrangelikningene er $1+2\lambda x=0$, $2+2\lambda y=0$ og $x^2+y^2=1$. De gir $5/(4\lambda^2)=1$, så $\lambda=\mp\sqrt5/2$. Den negative multiplikatoren hører til maksimumspunktet $(1,2)/\sqrt5$. Å velge $L=f-\lambda h$ er også mulig, men skifter fortegnet på alle rapporterte multiplikatorer; vær konsekvent gjennom utledning og kode.

</details>

## 12.2 Ligninger gir kandidater, ikke klassifisering

<div id="uke12-kandidater"></div>

Behold sirkelen, men sett $f(x,y)=xy$. **Hvor mange stasjonære punkter langs sirkelen venter dere nå, og er alle minima?** Test tegn og verdier på fire diagonalpunkter før dere leser likningene.

```{pyodide-python}
#| label: week12-xy-experiment
points = np.array([[1,1], [1,-1], [-1,1], [-1,-1]], float)/np.sqrt(2)
for p in points:
    tangent = np.array([-p[1], p[0]])
    grad = p[::-1]            # grad(x*y) = (y,x)
    print('punkt', np.round(p, 4), 'f =', round(np.prod(p), 4),
          'derivert langs tangenten =', round(grad @ tangent, 8))
```

Alle fire har derivert null i tangentretningen, men to gir $f=1/2$ og to gir $f=-1/2$. Lagranges nødvendige likninger er

$$y+2\lambda x=0,\qquad x+2\lambda y=0,\qquad x^2+y^2=1.$$

Ingen kandidat har $x=0$ eller $y=0$; eliminasjon gir $4\lambda^2=1$. For $\lambda=-1/2$ får vi $x=y=\pm1/\sqrt2$, og for $\lambda=1/2$ får vi $x=-y=\pm1/\sqrt2$. Likningene finner mulige ekstremalpunkter, men avgjør ikke typen. Fra $(x-y)^2\ge0$ får vi $2xy\le x^2+y^2=1$; fra $(x+y)^2\ge0$ får vi $2xy\ge-1$. Dermed er $-1/2\le xy\le1/2$, så punktene med like fortegn er globale maksimum og de andre globale minimum.

For flere likhetsbetingelser $h_i(x)=0$ legger vi til én multiplikator per likning. Samle likningene i $h=(h_1,\ldots,h_m)$ og gradientene som rader i **Jacobianen** $J_h$; da betyr $J_h(x_*)v=0$ at $v$ er tangent i første orden. Med $L=f+\sum_i\lambda_i h_i$ blir likningene

$$\nabla f(x_*)+\sum_{i=1}^m\lambda_i\nabla h_i(x_*)=0,
\qquad h_i(x_*)=0\quad (i=1,\ldots,m).$$

Når de $m$ normalvektorene $\nabla h_i(x_*)$ er lineært uavhengige, altså når $J_h$ har $m$ uavhengige rader, kaller vi betingelsene **regulære**. Da gjelder multiplikatorlikningene ved et lokalt ekstremum. For eksempel gir $h_1=x^2+y^2+z^2-1=0$ og $h_2=z=0$ ved $(1,0,0)$ normalene $(2,0,0)$ og $(0,0,1)$; $J_hv=0$ gir $v=(0,t,0)$. Målets gradient må ligge i spennet av de to normalene. Uavhengigheten er avgjørende: hvis normalene forsvinner eller peker likt, kan likningene overse et ekstremum, som vi ser i 12.4.

Selv når betingelsene er regulære, er stasjonaritet bare nødvendig, ikke tilstrekkelig. [Uke 8](uke8.qmd#uke8-lokalt) undersøkte Hessianen ved frie kritiske punkter. Anta her at $f$ og alle $h_i$ er to ganger kontinuerlig deriverbare i et nabolag av punktet. Krumning må undersøkes langs tillatte tangenter, og det er Hessianen til $L$ med hensyn til $x$ som teller: ved et regulært stasjonært punkt må $v^T\nabla^2_{xx}L\,v\ge0$ for alle tangenter $v$ ved et lokalt minimum. Streng positivitet for alle ikke-null tangenter gir et strengt lokalt minimum; negativt fortegn gir tilsvarende maksimum. Med vår sirkel og $f=xy$ velger vi enhetstangenten $v=(-1,1)/\sqrt2$ ved $(1,1)/\sqrt2$; da blir $v^T\nabla^2_{xx}L\,v=-2$, et lokalt maksimum. **Overføring:** Hvilket fortegn har den andrederiverte av $f(\cos t,\sin t)$ ved punktene $x=y$?

På sirkelen sikrer kompaktheten at begge globale ekstrema finnes. På en ubegrenset kurve som $x^2-2y^2=4$ kan en målfunksjon mangle globalt maksimum, selv om vi finner stasjonære punkter.

<details class="reading-step"><summary>Gå i dybden: krumning i tangentretningen</summary>

For $x=y=1/\sqrt2$ er $\lambda=-1/2$ og tangenten $v=(-1,1)/\sqrt2$. Hessianen til $L$ med hensyn på $(x,y)$ er $\nabla^2_{xx}L=\left(\begin{smallmatrix}2\lambda&1\\1&2\lambda\end{smallmatrix}\right)$. Her blir $v^T\nabla^2_{xx}Lv=-2<0$: et strengt lokalt maksimum langs kurven. Ved $x=-y$ er $\lambda=1/2$, og tangentkrumningen er $+2$: et lokalt minimum. Vi bruker Hessianen til *L*, begrenset til tillatte tangentretninger, fordi selve tangenten endrer retning mens vi følger kurven. Den direkte globale ulikheten over er sterkere og enklere i dette eksemplet.

Hvorfor kommer $H_L$ inn? La $\gamma(t)$ være en tillatt kurve gjennom
et regulært stasjonært punkt, med $\gamma'(0)=v$. To derivasjoner av
$h(\gamma(t))=0$ gir
$0=v^T\nabla^2h\,v+\nabla h^T\gamma''(0)$.
Samtidig er
$(f\circ\gamma)''(0)=v^T\nabla^2f\,v+\nabla f^T\gamma''(0)$.
Sett inn $\nabla f=-\lambda\nabla h$ fra Lagranges likning:
$\gamma''$-leddet blir $\lambda v^T\nabla^2h\,v$, slik at
$(f\circ\gamma)''(0)=v^T\nabla^2_{xx}L\,v$.
Med flere likninger summeres disse bidragene med sine $\lambda_i$.

Hvis en tangentkvadratisk form har både positive og negative verdier, kan punktet ikke være et lokalt ekstremum. Hvis formen er semidefinit og er null i en ikke-null tangentretning, avgjør ikke andrederiverttesten typen. Begge utsagn krever at vi undersøker de tillatte tangentene, ikke hele rommet.

</details>

## 12.3 En numerisk løsning må kontrolleres

<div id="uke12-slsqp"></div>

Et målepunkt $a=(2,1)$ ligger utenfor enhetssirkelen. Finn punktet $z=(x,y)$ på sirkelen som er nærmest $a$, ved å minimere $F(z)=\tfrac12\|z-a\|_2^2$ med $h(z)=\|z\|_2^2-1=0$. Normen $\|z-a\|_2$ er den vanlige avstanden; kvadrering og faktoren $1/2$ endrer ikke nærmeste punkt, men gir den enkle gradienten $z-a$.

Vi importerer `minimize` fra `scipy.optimize`. Kallet `minimize(F, x0, jac=grad_F, method='SLSQP', constraints=[...])` minimerer funksjonen `F` fra startpunktet `x0=(.4,.9)`; `jac=grad_F` gir dens gradient. SLSQP er en numerisk metode for begrensede problemer. Ordboken `{'type':'eq', 'fun':h, 'jac':grad_h}` krever `h(z)=0` og leverer gradienten til likningen. `options` setter stoppetoleranse og maksimalt antall iterasjoner. Med `callback=save_iterate` får vår funksjon hvert rapporterte løseriterat og lagrer en kopi i `path`. Svaret `result.x` er beregnet punkt, `result.fun` er beregnet verdi, og `result.success` sier om algoritmen rapporterte vellykket avslutning. Det gir ingen garanti for globalt optimum. **Forutsi punktet og avstanden før vi ber SciPy løse problemet. Må alle mellomliggende iterater ligge på sirkelen? Hva bør vi kontrollere i sluttsvaret utover `success`?**

```{pyodide-python}
#| label: week12-slsqp-experiment
from scipy.optimize import minimize
a = np.array([2., 1.])
def F(z): return .5*np.sum((z-a)**2)
def grad_F(z): return z-a
def h(z): return np.dot(z,z)-1.
def grad_h(z): return 2*z
x0 = np.array([.4, .9])
path = [x0.copy()]
def save_iterate(z):
    path.append(z.copy())
result = minimize(F, x0, jac=grad_F, method='SLSQP',
                  constraints=[{'type':'eq', 'fun':h, 'jac':grad_h}],
                  callback=save_iterate,
                  options={'ftol':1e-12, 'maxiter':100})
print('status:', result.status, result.message)
z = result.x
# Med L = F + lambda*h må den uoppfylte gradienten peke langs grad(h).
lam = -np.dot(grad_F(z),grad_h(z))/np.dot(grad_h(z),grad_h(z))
print('punkt:', np.round(z, 8), 'success:', result.success)
print('F:', round(result.fun, 10), 'h:', f'{h(z):.2e}')
print('lambda:', round(lam, 8),
      'stasjonaritetsresidual:', f'{np.linalg.norm(grad_F(z)+lam*grad_h(z)):.2e}')
print('analytisk punkt:', np.round(a/np.linalg.norm(a), 8),
      'global nedre grense:', round(.5*(np.linalg.norm(a)-1)**2, 10))
```

Her skal den numeriske løsningen være nær $a/\sqrt5=(0.89442719,0.44721360)$, ha avstand $\sqrt5-1$, ha $h(z)$ og stasjonaritetsresidual nær null, og gi $F\approx0.76393202$. Stasjonaritetsresidualen er lengden av $\nabla F(z)+\lambda\nabla h(z)$; vi regner ut $\lambda$ ved å projisere $-\nabla F$ på $\nabla h$. Vi kontrollerer både $|h(z)|$ og denne lengden mot en liten toleranse; en liten av dem kan ikke erstatte den andre. Multiplikatoren med vårt plussfortegn skal være $(\sqrt5-1)/2\approx0.618034$. Hvorfor er dette et **globalt** minimum? For ethvert punkt på sirkelen er

$$F(z)=\tfrac12(\|a\|^2+1-2a^Tz)\ge\tfrac12(\sqrt5-1)^2,$$

fordi $a^Tz\le\|a\|\|z\|=\sqrt5$; likhet oppnås akkurat når $z=a/\sqrt5$. Ingen solverstatus alene ville bevist dette. Hvis vi endrer mål eller tillatt mengde, må vi undersøke globalitet på nytt.

Tegn nå iteratene sammen med sirkelen og nivåkurvene til $F$. Koden
nummererer de første iteratene som løseren rapporterer; den rette
forbindelsen mellom dem er bare en visualisering av rekkefølgen, ikke
en tillatt bane langs sirkelen.

```{pyodide-python}
#| label: week12-slsqp-path
track = np.array(path)
if not np.allclose(track[-1], result.x):
    track = np.vstack([track, result.x])
u, v = np.meshgrid(np.linspace(-1.2, 2.55, 220),
                   np.linspace(-1.25, 2.25, 220))
levels = .5*((u-a[0])**2 + (v-a[1])**2)
fig, ax = plt.subplots(figsize=(7, 6))
contours = ax.contour(u, v, levels, levels=[.25, .5, .764, 1., 2., 3.],
                      colors='0.72', linestyles='dotted')
ax.clabel(contours, inline=True, fontsize=8, fmt='F = %g')
angles = np.linspace(0, 2*np.pi, 400)
ax.plot(np.cos(angles), np.sin(angles), color='tab:blue', lw=2,
        label='tillatt sirkel h = 0')
ax.plot(track[:, 0], track[:, 1], '-o', color='tab:orange',
        lw=1.5, markersize=4, label='rapporterte iterater (callback)')
ax.scatter(*x0, marker='s', s=75, color='tab:purple', zorder=5,
           label='start')
exact = a/np.linalg.norm(a)
ax.scatter(*exact, marker='o', facecolors='none', edgecolors='tab:green',
           linewidths=2.2, s=260, zorder=5, label='eksakt nærmeste punkt')
ax.scatter(*result.x, marker='*', s=170, color='tab:red', zorder=6,
           label='numerisk sluttpunkt')
for i in range(1, min(4, len(track))):
    ax.annotate(str(i), track[i], xytext=(5, 6),
                textcoords='offset points', fontsize=9)
ax.scatter(*a, marker='x', color='black', s=65, label='målepunkt a')
ax.set(xlabel='x', ylabel='y', xlim=(-1.2, 2.55), ylim=(-1.25, 2.25))
ax.set_aspect('equal')
ax.legend(loc='upper center', bbox_to_anchor=(.5, -.10), ncol=2,
          frameon=False, fontsize=9)
fig.tight_layout()
plt.show()
```

Nivåkurvene er sirkler rundt målepunktet $a$. Den minste som berører
den tillatte sirkelen, gjør det ved $a/\sqrt5$. Første løseriterat kan
ligge utenfor den tillatte sirkelen og til og med ha lavere $F$ enn det
globale *tillatte* minimumet; det er ingen motsigelse. Iteratene
nærmer seg et punkt på sirkelen. Derfor kontrollerte vi $h(z)$ i
sluttpunktet, i tillegg til stasjonaritet og verdi.

Dette er også den samme **ortogonalitetsideen** som i [uke 4](uke4.qmd#uke4-mk): Vi minimerer summen av kvadrerte komponenter i residualen $z-a$. Forskjellen er at $z$ nå må ligge på en krum sirkel; ved løsningen er residualen normal på tangenten. **Overføring:** Hva ville du kontrollert hvis SciPy hadde returnert et punkt med svært liten gradientresidual, men $|h(z)|=0.1$?

<details class="reading-step"><summary>Gå i dybden: hvorfor en lokal SLSQP-løsning stemmer med håndregning</summary>

SciPy tolker `{'type':'eq', 'fun':h}` som kravet $h(z)=0$. Jacobianen `jac` får gradienten av betingelsen, og `jac=grad_F` i `minimize` leverer gradienten til målet. Metoden søker numerisk etter en lokal løsning. Koden beregner selv en multiplikator ved ortogonal projeksjon av $-\nabla F$ på $\nabla h$; formelen er gyldig her fordi $\nabla h=2z\ne0$. En liten projeksjonsresidual viser tilnærmet stasjonaritet, men ikke klassifisering.

Fra $z-a+2\lambda z=0$ følger $z=a/(1+2\lambda)$ når nevneren er ulik null. Kravet $\|z\|=1$ gir $|1+2\lambda|=\sqrt5$, altså både nærmeste punkt $a/\sqrt5$ og fjerneste punkt $-a/\sqrt5$. De er begge stasjonære. Den eksplisitte verdigrensen avgjør hvilket som er minimum.

</details>

## 12.4 Når metoden svikter, og forbindelsen til dualitet

<div id="uke12-degenerert"></div>

**Hva hvis den eneste tillatte løsningen faktisk er et minimum, men betingelsens gradient er null der?** Prøv $f(x,y)=x$ med $h(x,y)=x^2+y^2=0$. Dette er én likning, men den tillatte mengden består bare av $(0,0)$.

```{pyodide-python}
#| label: week12-degenerate-experiment
p = np.array([0., 0.])
print('mål i eneste tillatte punkt:', p[0])
print('grad f:', np.array([1.,0.]), 'grad h:', 2*p)
for lam_test in [-10, 0, 10]:
    print('lambda =', lam_test, ', stasjonaritetsresidual =',
          np.linalg.norm(np.array([1.,0.]) + lam_test*2*p))
```

Punktet er trivielt både globalt minimum og maksimum på denne tillatte mengden, men $\nabla f(0,0)+\lambda\nabla h(0,0)=(1,0)$ for *alle* $\lambda$. Det er ingen regulær tangentkurve gjennom punktet. Derfor må vi sjekke at betingelsesgradienten er ulik null (eller at flere normaler er uavhengige) før vi bruker Lagranges likninger som et fullstendig søk etter ekstremalpunkter. I degenererte tilfeller må punktet undersøkes direkte.

En ulikhet, for eksempel $x^2+y^2\le1$, beskriver hele skiven, ikke bare randen. Den trenger egne betingelser for innside og rand; denne uken løser vi likhetsbetingelser.

I [uke 11](uke11.qmd#uke11-dual) ga en mulig prisvektor en global **øvre** grense for fortjenesten i en maksimering. Her minimerer vi $F$: for alle tillatte $z$ er $L(z,\lambda)=F(z)+\lambda h(z)=F(z)$, uansett $\lambda$. Derfor gir $d(\lambda)=\inf_z L(z,\lambda)$ en global **nedre** grense for minimumsverdien, også hvis infimumet er $-\infty$ (da er grensen ubrukelig). Hvis vi finner et tillatt $z_*$ som også minimerer $L(\cdot,\lambda_*)$ over alle $z$, møtes grensen og verdien: da har vi et globalt bevis. Likningen $\nabla_xL=0$ alene sier mindre; den kan også beskrive maksimum som i 12.2. I motsetning til de ikke-negative prisene for $\le$-grenser i uke 11 er multiplikatoren til en **likning** fri i fortegn. Fortegnet avhenger dessuten av om vi skriver $L=f+\lambda h$ eller $L=f-\lambda h$. Hvis $f$ måles i kroner og $h$ i ressursenheter, har $\lambda$ enhet kroner per ressursenhet; enhetene må passe i summen $f+\lambda h$. For en likning skrevet $h(z)=g(z)-r=0$ er $-\lambda$ den lokale endringen i optimal minimeringsverdi per ekstra enhet av $r$, når optimum varierer glatt og samme løsningstype vedvarer.

<details class="reading-step"><summary>Gå i dybden: en eksakt nedre grense fra multiplikatoren</summary>

I avstandsproblemet er $L(z,\lambda)=\tfrac12\|z-a\|^2+\lambda(\|z\|^2-1)$. Når $1+2\lambda>0$, er dette en strengt konveks kvadratisk funksjon av $z$, med ubetinget minimum ved $z=a/(1+2\lambda)$. Dermed er

$$d(\lambda)=\tfrac12\|a\|^2-\lambda-\frac{\|a\|^2}{2(1+2\lambda)}.$$

Sett $\lambda_*=(\sqrt5-1)/2$. Da minimeres $L(\cdot,\lambda_*)$ ved $z_*=a/\sqrt5$, som også oppfyller $h(z_*)=0$. Altså er $d(\lambda_*)=L(z_*,\lambda_*)=F(z_*)=\tfrac12(\sqrt5-1)^2$. Dette er et eksempel der dualgrensen er skarp; det er ikke en generell garanti for alle ikke-konvekse likhetsproblemer.

</details>

## 12.5 Regn selv og oppslag

<div id="uke12-oppgaver"></div>

Skriv én komponent i hvert felt. Bruk eksakte uttrykk, for eksempel `1/sqrt(5)`. Ingen løsningsforslag er lagt ved kontrollfeltene.

::: {#week12-exercise-convention .math-exercise-context}

Vi bruker likhetsbetingelsen $h=0$ og fortegnskonvensjonen $L=f+\lambda h$. Ved en regulær kandidat gjelder $h=0$ og $\nabla f+\lambda\nabla h=0$. En kandidat trenger egen kontroll av ekstremumstype. Når $\nabla h=0$, kan multiplikatorbetingelsen svikte selv ved et ekstremum.

:::

```{math-exercise}
#| label: week12-normal-tangent
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: normalens x-komponent, normalens y-komponent, tangentens x-komponent, tangentens y-komponent

**1. Tangent og normal.** La $h(x,y)=x^2+4y^2-1$ og $p=(0,1/2)$. Finn gradienten til $h$ og én tangentvektor med lengde én og **positiv $x$-komponent** i $p$.

$\nabla h(p)=$ vec[0,4]

Enhetstangent med positiv $x$-komponent $=$ vec[1,0]
```

```{math-exercise}
#| label: week12-circle-lagrange
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: maksimumspunktets x-koordinat, maksimumspunktets y-koordinat, multiplikator ved maksimum

**2. Lagrangelikninger.** Maksimer/minimer $f(x,y)=x+2y$ med $h(x,y)=x^2+y^2-1=0$. Oppgi *maksimumspunktet* og multiplikatoren for konvensjonen over. Velg det positive funksjonsmaksimumet.

$(x,y)=$ vec[1/sqrt(5),2/sqrt(5)]

$\lambda=$ __[-sqrt(5)/2]
```

```{math-exercise}
#| label: week12-xy-classification
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: funksjonsverdi, andrederivert langs sirkelen

**3. Stasjonær er ikke nok.** For $f(x,y)=xy$ på enhetssirkelen $x^2+y^2=1$, bruk punktet $p=(1,1)/\sqrt2$. Finn funksjonsverdien og andrederiverte av $f(\cos t,\sin t)$ ved $t=\pi/4$.

$f(p)=$ __[1/2]

$\frac{d^2}{dt^2}f(\cos t,\sin t)\big|_{t=\pi/4}=$ __[-2]
```

```{math-exercise}
#| label: week12-degenerate-check
#| context: week12-exercise-convention
#| mode: equivalent
#| partial-credit: true
#| field-labels: punktets x-koordinat, punktets y-koordinat, betingelsesgradientens x-komponent, betingelsesgradientens y-komponent

**4. En degenerert likning.** For $f(x,y)=x+3y$ og $h(x,y)=x^2+y^2=0$, finn det eneste tillatte punktet og $\nabla h$ der. Kontroller i egne notater hvorfor ingen multiplikator kan oppfylle stasjonaritetslikningen.

Tillatt punkt $=$ vec[0,0]

$\nabla h(0,0)=$ vec[0,0]
```

### Kort oppslag: `minimize` med SLSQP

| Skriv/les | Betydning i dette eksemplet |
|:--|:--|
| `from scipy.optimize import minimize` | Importerer løseren. |
| `minimize(F, x0, jac=grad_F, method='SLSQP', constraints=[...])` | Minimer $F$ fra startpunktet `x0`; `jac` gir målgradienten. |
| `{'type':'eq', 'fun':h, 'jac':grad_h}` | Én likning $h(z)=0$ og dens gradient. Flere likninger kan gis som flere ordbøker. |
| `callback=save_iterate` | Kaller funksjonen med løserens iterat slik at vi kan tegne forløpet; iteratene trenger ikke oppfylle $h=0$. |
| `result.success`, `result.status`, `result.message` | Algoritmens stoppstatus, ikke et globalt bevis. |
| `result.x`, `result.fun` | Beregnet punkt og beregnet verdi; undersøk selv $|h(z)|$ og $\|\nabla F+\lambda\nabla h\|$. |
| `options={'ftol':1e-12, 'maxiter':100}` | `ftol` setter en intern toleranse for flere stoppkontroller, ikke en garanti for nøyaktig punkt eller mulighet; `maxiter` begrenser antall iterasjoner. Kontroller residualene uavhengig. |

:::
