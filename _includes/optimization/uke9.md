<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 9.0 Oversikt

<div id="uke9-start"></div>

### Hvor langt skal vi gå?

I [uke 6](uke6.qmd#uke6-retning) gikk vi nedover en kvadratisk skål langs
negativ gradient og regnet ut den beste steglengden eksakt. I
[uke 8](uke8.qmd#uke8-eksistens) så vi at et søk kan gi stadig bedre punkter
uten å ende i et minimum. Denne uka spør vi hva en søkemetode faktisk gjør
med en funksjon som **ikke** er kvadratisk, og hva vi kan garantere.

Vi bruker hele uka **Himmelblaus funksjon**

$$f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2.$$

Den er en klassisk testfunksjon for søkemetoder og har fire daler. I $(3,2)$ er begge parentesene null, så
$f(3,2)=0$, og siden $f$ er en sum av kvadrater, er dette et globalt
minimumspunkt. Metodene får ikke vite det; vi bruker punktet til å kontrollere
dem.

Uka har to deler:

- **Fast steg.** Gradientmetoden med fast steglengde er en
  fikspunktiterasjon, akkurat som i uke 2. Egenverdiene til Hessianen
  forteller hvor stort steget kan være, og hvor fort metoden går.
- **Tilpassede steg og hva de garanterer.** Kompassøk (uten deriverte) og
  Armijo-søk (med gradient) krymper steget når det ikke gir framgang. Én
  og samme garanti dekker begge, så lenge funksjonen er **koersiv**.

**Forelesning** viser hovedløpet. **Gå i dybden** åpner bevis,
mellomregninger og noen sidespor. Regneoppgavene står i 9.8 og
kodeoppgavene i 9.9.

### Kort løype

1. [Fast steg: en fikspunktiterasjon](#uke9-gradient): et forsøk med fem steglengder.
2. [Feilen i to dimensjoner](#uke9-stabilitet): kritisk steg og konvergensfaktor fra egenverdiene.
3. [Kondisjonstallet bestemmer farten](#uke9-kondisjon): beste faste steg og skålene fra uke 6.
4. [Hvorfor ikke bare prøve punkter?](#uke9-endelig): gitter, tilfeldige punkter og $m^n$.
5. [Kompassøk](#uke9-kompass): flytt, krymp og en grense for gradienten.
6. [Armijo](#uke9-linjesok): samme halveringsidé, nå langs negativ gradient.
7. [Én garanti for begge](#uke9-garanti): et søk som aldri kommer fram, subnivåmengder og koersivitet.

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 2: fikspunktiterasjon](page4.qmd) | Når er et fikspunkt attraktivt, og hva er konvergensfaktoren? |
| [Uke 5: egenverdier](uke5.qmd) | Hvordan virker en symmetrisk matrise på hver egenretning? |
| [Uke 6: bratteste nedstigning](uke6.qmd#uke6-retning) | Hvorfor går metoden sakte i en smal skål? |
| [Uke 8: kompakthet](uke8.qmd#uke8-kompakt) | Når må en følge av punkter ha en grense? |
| [Uke 8: tilpasning uten minimum](uke8.qmd#uke8-eksistens) | Hva gjør en søkemetode når minimum ikke finnes? |

### Læringsmål

Etter denne uka skal du kunne

- skrive gradientmetoden med fast steg som en fikspunktiterasjon og finne
  det kritiske steget $2/\lambda_{\max}$ fra Hessianen i minimumspunktet,
- forutsi konvergensfaktoren $\max_i|1-\alpha\lambda_i|$ og måle den fra en kjøring,
- forklare hvordan kondisjonstallet bestemmer antall steg,
- sammenligne gittersøk og tilfeldige prøver, og forklare hvorfor $m^n$ vokser for fort,
- utføre kompassøk og bruke en mislykket prøverunde som grense for gradienten,
- bruke Armijo-testen til å godta eller halvere et steg,
- forklare hva subnivåmengde og koersivitet garanterer for iteratene, og gi et moteksempel.

## 9.1 Fast steg: en fikspunktiterasjon

<div id="uke9-gradient"></div>

### Det vi vet fra før

Fra [uke 6](uke6.qmd#uke6-retning) og [støtteløpet i uke 8](uke8.qmd#uke8-gradient)
vet vi at $-\nabla f(z)$ peker brattest nedover, og at den
retningsderiverte langs $p=-\nabla f(z)$ er $-\|\nabla f(z)\|_2^2<0$ når
gradienten ikke er null. **Gradientmetoden** tar steget

$$z_{k+1}=z_k-\alpha\,\nabla f(z_k),$$

der $\alpha>0$ er **steglengden** (egentlig en faktor; selve steget har
lengde $\alpha\|\nabla f(z_k)\|_2$). For ukens funksjon setter vi
$u=x^2+y-11$ og $w=x+y^2-7$. Kjerneregelen gir

$$\nabla f(x,y)=\begin{pmatrix}4xu+2w\\2u+4yw\end{pmatrix}.$$

I origo er $u=-11$ og $w=-7$, så $\nabla f(0,0)=(-14,-22)^T$. Med
$\alpha=1/100$ går vi til $(0.14,\,0.22)$, og verdien synker fra 170 til
omtrent 162. Med $\alpha=1$ havner vi i $(14,22)$, der $f$ er 283930.
Retningen er den samme; bare steglengden er forskjellig.

```{pyodide-python}
#| label: week9-first-step
# Ukens funksjon og gradient (de samme står i oppsettet).
def f9(z):
    x, y = z
    return (x*x + y - 11)**2 + (x + y*y - 7)**2

def grad9(z):
    # u og w er de to parentesene som kvadreres i f.
    x, y = z
    u, w = x*x + y - 11, x + y*y - 7
    return np.array([4*x*u + 2*w, 2*u + 4*y*w])

z0 = np.array([0., 0.])
print('gradient i (0, 0):', grad9(z0))
for alpha in [0.01, 1.]:
    z1 = z0 - alpha*grad9(z0)
    print(f'α = {alpha:4}: z1 = ({z1[0]:g}, {z1[1]:g}), f(z1) = {f9(z1):.2f}')
```

Hvor stort kan et **fast** steg være, altså samme $\alpha$ i alle steg?

### Eksperiment 1 – fem faste steglengder

Vi starter i $(0,0)$ og tar 200 steg med fem verdier av $\alpha$.
**Forutsi først:** Mellom hvilke to av verdiene $0.005$, $0.02$, $0.024$,
$0.025$ og $0.1$ går grensen for hva som virker?

```{pyodide-python}
#| label: week9-fixed-step-sweep
# Samme start og samme antall steg; bare steglengden endres.
xs_per_alpha = {}
print(f'{"α":>6}   {"de fire siste x-verdiene":<32} {"f til slutt":>12}')
for alpha in [0.005, 0.02, 0.024, 0.025, 0.1]:
    z = np.array([0., 0.])
    xs = [z[0]]
    for k in range(200):
        z = z - alpha*grad9(z)
        xs.append(z[0])
        if np.linalg.norm(z) > 1e6:   # punktet har forsvunnet ut av planet vi ser på
            break
    xs_per_alpha[alpha] = xs
    if np.linalg.norm(z) > 1e6:
        print(f'{alpha:>6}   eksploderer: |z| > 10^6 etter {k+1} steg')
    else:
        last = '  '.join(f'{x:.3f}' for x in xs[-4:])
        print(f'{alpha:>6}   {last:<32} {f9(z):>12.2g}')

# x-koordinaten steg for steg for de tre interessante steglengdene.
fig, ax = plt.subplots(figsize=(6.5, 4))
for alpha in [0.02, 0.024, 0.025]:
    ax.plot(xs_per_alpha[alpha], '.-', markersize=3, linewidth=.7, label=f'α = {alpha}')
ax.axhline(3, color='gray', linestyle=':')
ax.set(xlabel='steg k', ylabel='x-koordinat', ylim=(2.4, 3.6))
ax.legend(); plt.show()
```

**Hva viser forsøket?**

- Med $\alpha=0.005$ og $0.02$ ender metoden i $(3,2)$.
- Med $\alpha=0.024$ ender den også der, men $x$ hopper fra side til side:
  $2.999,\ 3.001,\ 2.999,\ 3.001$.
- Med $\alpha=0.025$ **blir den aldri ferdig**: $x$ veksler mellom $2.683$
  og $3.235$ så lenge vi orker å regne.
- Med $\alpha=0.1$ eksploderer den: etter fem steg er $|z|>10^6$.

Grensen ligger altså mellom $0.024$ og $0.025$. Det er et smalt intervall,
og det ser tilfeldig ut. Det er det ikke.

### Sett ord på det: en fikspunktiterasjon fra uke 2

Gradientmetoden har formen $z_{k+1}=g(z_k)$ med $g(z)=z-\alpha\nabla f(z)$.
Et minimumspunkt $z_*$ har $\nabla f(z_*)=0$, så $g(z_*)=z_*$: **minimumet er et
fikspunkt**. Spørsmålet fra [uke 2](page4.qmd) er om det er attraktivt.

Se først på én variabel. Da er $g(x)=x-\alpha f'(x)$ og
$g'(x)=1-\alpha f''(x)$. Helningsregelen fra uke 2 sier at fikspunktet $r$ er

- **attraktivt** når $|g'(r)|=|1-\alpha f''(r)|<1$,
- **frastøtende** når $|1-\alpha f''(r)|>1$.

I et minimum med $f''(r)>0$ er $|1-\alpha f''(r)|<1$ det samme som
$0<\alpha<2/f''(r)$. Konvergensfaktoren er $S\approx|1-\alpha f''(r)|$.
Fortegnet betyr også noe: når $1-\alpha f''(r)<0$, skifter feilen fortegn i
hvert steg, og iteratene går **fram og tilbake over fikspunktet**. Det var
nettopp det vi så ved $\alpha=0.024$.

I uke 2 undersøkte du familien $g_\lambda(x)=x-\lambda f(x)$ for å løse
$f(x)=0$. Gradientmetoden er den samme ideen brukt på likningen $f'(x)=0$.

**Dette tar vi med oss.** Et fast steg virker bare når det er mindre enn
$2/(\text{krumningen i minimumet})$. I to dimensjoner er det mange krumninger,
én for hver retning. Neste fane finner den som bestemmer.

## 9.2 Feilen i to dimensjoner

<div id="uke9-stabilitet"></div>

### Feilen ganges med en matrise

La $e_k=z_k-z_*$ være feilen. Nær minimumet er gradienten omtrent lineær:

$$\nabla f(z_k)\approx\nabla f(z_*)+H_*\,(z_k-z_*)=H_*\,e_k,$$

der $H_*$ er Hessianen i $z_*$ (støtteløpet i
[uke 8](uke8.qmd#uke8-hessian)). Setter vi dette inn i
$e_{k+1}=e_k-\alpha\nabla f(z_k)$, får vi

$$\boxed{e_{k+1}\approx(I-\alpha H_*)\,e_k.}$$

Dette er en iterasjonsmatrise, som $e_{k+1}=Te_k$ for Gauss–Seidel i
[uke 6](uke6.qmd#uke6-fikspunkt). Nå bruker vi [uke 5](uke5.qmd):
$H_*$ er symmetrisk, så den har ortogonale egenvektorer $v_1,v_2$ med
egenverdier $\lambda_1\le\lambda_2$. Skriver vi feilen som
$e_k=c_1v_1+c_2v_2$, blir

$$(I-\alpha H_*)e_k=(1-\alpha\lambda_1)\,c_1v_1+(1-\alpha\lambda_2)\,c_2v_2.$$

**Hver egenkomponent ganges med sin egen faktor $1-\alpha\lambda_i$.** Det er
uke 2-regelen én gang per egenretning. Dermed:

- Metoden konvergerer lokalt når $|1-\alpha\lambda_i|<1$ for alle $i$. Når
  $H_*$ er positiv definit (alle $\lambda_i>0$, som i $(3,2)$), er kravet
  $$\alpha<\alpha_{\text{krit}}=\frac{2}{\lambda_{\max}}.$$
- Konvergensfaktoren er den største av faktorene:
  $$S=\max_i|1-\alpha\lambda_i|.$$

Den største krumningen bestemmer hvor stort steget kan være. Den minste
krumningen bestemmer ofte hvor fort det går (mer om det i 9.3).

<details class="reading-step">
<summary>Gå i dybden: hvor kommer den lineære tilnærmingen fra?</summary>

Bruk Taylor på hver komponent av gradienten. For $\partial f/\partial x$ gir
det, langs linjestykket fra $z_*$ til $z_k$,

$$\frac{\partial f}{\partial x}(z_k)=\frac{\partial f}{\partial x}(z_*)
+\Bigl(\frac{\partial^2f}{\partial x^2},\ \frac{\partial^2f}{\partial x\,\partial y}\Bigr)\Big|_{z_*}e_k
+\text{rest},$$

der resten er høyst en konstant ganger $\|e_k\|_2^2$. Det samme gjelder
$\partial f/\partial y$. De to radene av andrederiverte er radene i $H_*$, og
$\nabla f(z_*)=0$. Altså er $\nabla f(z_k)=H_*e_k+O(\|e_k\|_2^2)$, og

$$e_{k+1}=(I-\alpha H_*)e_k+O(\|e_k\|_2^2).$$

Når feilen er liten, er restleddet mye mindre enn hovedleddet. Derfor gjelder
konklusjonene **lokalt**, som helningsregelen i uke 2. Langt fra $z_*$ sier de
ingenting.

</details>

::: {.callout-note title="Håndeksempel: det kritiske steget i (3,2)"}

**Utgangspunkt.** Hessianen til ukens funksjon er

$$H(x,y)=\begin{bmatrix}12x^2+4y-42&4x+4y\\4x+4y&12y^2+4x-26\end{bmatrix}.$$

**Prøv selv.** Regn ut $H(3,2)$, egenverdiene og $\alpha_{\text{krit}}$.
Hvilken av $\alpha=0.024$ og $\alpha=0.025$ gir en faktor under $-1$?

**Regnegangen.** Innsetting gir
$H(3,2)=\begin{bmatrix}74&20\\20&34\end{bmatrix}$. Den karakteristiske
likningen er $(74-\lambda)(34-\lambda)-400=\lambda^2-108\lambda+2116=0$, så

$$\lambda=54\pm\sqrt{800},\qquad\lambda_1\approx25.72,\quad\lambda_2\approx82.28.$$

Dermed er $\alpha_{\text{krit}}=2/82.28\approx0.0243$. Faktorene blir

| $\alpha$ | $1-\alpha\lambda_1$ | $1-\alpha\lambda_2$ |
|:--|--:|--:|
| $0.024$ | $0.383$ | $-0.975$ |
| $0.025$ | $0.357$ | $-1.057$ |

Ved $\alpha=0.024$ krymper komponenten langs $v_2$ og skifter fortegn i hvert
steg: det er hoppingen fra side til side. Ved $\alpha=0.025$ vokser den og
skifter fortegn. Den vokser likevel ikke for alltid: lenger ut er ikke
$f$ kvadratisk, og iteratene låses i en **2-syklus**, som i uke 2.

**Dette tar vi med oss.** $\alpha_{\text{krit}}=2/\lambda_{\max}(H_*)$ skiller
nøyaktig mellom de to steglengdene i eksperiment 1.

:::

Kontroller tallene:

```{pyodide-python}
#| label: week9-hessian-check
def hess9(z):
    x, y = z
    return np.array([[12*x*x + 4*y - 42, 4*x + 4*y],
                     [4*x + 4*y, 12*y*y + 4*x - 26]])

H = hess9([3., 2.])
lam = np.linalg.eigvalsh(H)          # stigende rekkefølge
print('H(3, 2) =', H.tolist())
print('egenverdier:', lam.round(4))
print('kritisk steg 2/λmax =', round(2/lam[1], 5))
for alpha in [0.024, 0.025]:
    print(f'α = {alpha}: faktorene 1 - αλ er', (1 - alpha*lam).round(3))
```

### Eksperiment 2 – målt og forutsagt konvergensfaktor

Forutsigelsen sier mer enn «konvergerer eller ikke». Den gir også farten.
Vi starter nær minimumet, i $(3.1,\,2.1)$, tar 40 steg og måler forholdet
$e_{40}/e_{39}$ mellom de to siste feilene (feilene måles i 2-norm). Slik
anslo vi $S$ fra feilene i uke 2.

**Forutsi:** Regn ut $S=\max_i|1-\alpha\lambda_i|$ for $\alpha=0.01$ og
$\alpha=0.02$ før du kjører.

```{pyodide-python}
#| label: week9-rate
z_star = np.array([3., 2.])
lam = np.linalg.eigvalsh(hess9(z_star))
fig, ax = plt.subplots(figsize=(6.5, 4))
for alpha in [0.01, 0.02]:
    z = np.array([3.1, 2.1])
    errors = [np.linalg.norm(z - z_star)]
    for k in range(40):
        z = z - alpha*grad9(z)
        errors.append(np.linalg.norm(z - z_star))
    S = max(abs(1 - alpha*lam))
    print(f'α = {alpha}: målt e40/e39 = {errors[-1]/errors[-2]:.4f}, '
          f'forutsagt S = {S:.4f}')
    line, = ax.semilogy(errors, 'o', markersize=3, label=f'målt feil, α = {alpha}')
    # Stiplet linje med helning S, festet i siste punkt.
    ax.semilogy(errors[-1]*S**(np.arange(41) - 40), '--', color=line.get_color(),
                label=f'S^k med S = {S:.3f}')
ax.set(xlabel='steg k', ylabel='‖z_k − (3, 2)‖₂')
ax.legend(); plt.show()
```

De målte forholdene er $0.7428$ og $0.6457$, og de forutsagte er de samme
med fire desimaler. Feilkurvene er rette linjer i logaritmisk skala, parallelle
med de stiplede linjene: **lineær konvergens** med faktoren som Hessianens
egenverdier forutsier. Ved $\alpha=0.01$ er det den minste egenverdien som
bestemmer $S$ ($1-0.01\cdot25.72=0.743$), ved $\alpha=0.02$ den største
($|1-0.02\cdot82.28|=0.646$).

## 9.3 Kondisjonstallet bestemmer farten

<div id="uke9-kondisjon"></div>

### Det beste faste steget

Hvilken $\alpha$ gir minst $S$? Figuren viser de to faktorene
$|1-\alpha\lambda_1|$ og $|1-\alpha\lambda_2|$ for $H(3,2)$ som funksjoner av
$\alpha$, og $S(\alpha)$, som er den største av dem. Punktene er fire av
steglengdene fra eksperiment 1 ($0.1$ ligger langt utenfor figuren).

```{pyodide-python}
#| label: week9-best-step-figure
# Faktorene |1 - αλ| for H(3, 2) som funksjoner av steglengden α.
lam = np.linalg.eigvalsh(hess9([3., 2.]))
alphas = np.linspace(0, 0.03, 601)
fig, ax = plt.subplots(figsize=(6.5, 4))
ax.plot(alphas, abs(1 - alphas*lam[0]), ':', label=f'|1 − αλ₁|, λ₁ = {lam[0]:.1f}')
ax.plot(alphas, abs(1 - alphas*lam[1]), ':', label=f'|1 − αλ₂|, λ₂ = {lam[1]:.1f}')
ax.plot(alphas, np.maximum(abs(1 - alphas*lam[0]), abs(1 - alphas*lam[1])), 'k',
        label='S(α), den største faktoren')
for alpha in [0.005, 0.02, 0.024, 0.025]:      # steglengder fra eksperiment 1
    ax.plot(alpha, max(abs(1 - alpha*lam)), 'o', color='#bb4a37')
ax.axhline(1, color='gray', linewidth=.8)
for alpha, name in [(2/lam.sum(), 'beste α'), (2/lam[1], 'α_krit')]:
    ax.axvline(alpha, color='gray', linestyle='--', linewidth=.8)
    ax.text(alpha, 1.62, ' ' + name, fontsize=8)
ax.set(xlabel='fast steglengde α', ylabel='faktor per steg', ylim=(0, 1.8))
ax.legend(loc='upper left', fontsize=8); plt.show()
```

Kurven $S(\alpha)$ har form som en V. Til venstre for knekken er det den
minste egenverdien som bestemmer: et lite steg gjør $1-\alpha\lambda_{\min}$
nær 1. Til høyre er det den største: et stort steg gjør
$1-\alpha\lambda_{\max}$ nær $-1$, og ved $\alpha_{\text{krit}}$ krysser
kurven 1. Bunnen ligger der de to er like store:
$1-\alpha\lambda_{\min}=-(1-\alpha\lambda_{\max})$, som gir

$$\alpha_{\text{best}}=\frac{2}{\lambda_{\min}+\lambda_{\max}},\qquad
S_{\text{best}}=\frac{\lambda_{\max}-\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}
=\frac{\kappa-1}{\kappa+1},$$

der $\kappa=\lambda_{\max}/\lambda_{\min}$ er kondisjonstallet til $H_*$ fra
[uke 6](uke6.qmd#uke6-residual). For $H(3,2)$ er $\kappa\approx3.2$,
$\alpha_{\text{best}}\approx0.0185$ og $S_{\text{best}}\approx0.52$.

Når $\kappa$ er stor, er $S_{\text{best}}=1-2/(\kappa+1)$ nær 1. Hvert steg
fjerner da bare en liten andel av feilen. Antall steg for å redusere feilen
med en faktor $10^{-8}$ er det minste hele tallet $k$ med
$S^k\le10^{-8}$, altså omtrent $\ln(10^{-8})/\ln S$. For stor $\kappa$ er
$\ln S\approx-2/\kappa$, så **antall steg vokser proporsjonalt med $\kappa$**.

<details class="reading-step">
<summary>Gå i dybden: hvorfor er balansepunktet best?</summary>

Figuren over viser de to funksjonene $\alpha\mapsto|1-\alpha\lambda_{\min}|$ og
$\alpha\mapsto|1-\alpha\lambda_{\max}|$. Den første avtar på
$0<\alpha<2/(\lambda_{\min}+\lambda_{\max})$, den andre vokser etter sitt
nullpunkt $1/\lambda_{\max}$. $S$ er den største av dem. Mindre $\alpha$ enn
balansepunktet gjør den første større; større $\alpha$ gjør den andre større.
Minimum av maksimum ligger derfor der de er like. Innsetting gir

$$1-\frac{2\lambda_{\min}}{\lambda_{\min}+\lambda_{\max}}
=\frac{\lambda_{\max}-\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}.$$

Del teller og nevner på $\lambda_{\min}$, så står $(\kappa-1)/(\kappa+1)$ igjen.
Egenverdiene mellom $\lambda_{\min}$ og $\lambda_{\max}$ (i flere dimensjoner)
gir faktorer som ligger mellom disse to, og endrer ikke svaret.

</details>

### Eksperiment 3 – skålene fra uke 6

I [uke 6](uke6.qmd#uke6-retning) gikk bratteste nedstigning sakte i en smal
skål. Vi bruker samme dreining og samme løsning $x_*=(1,-1.1)^T$ som skålene
i uke 6, $\phi(x)=\tfrac12x^TAx-b^Tx$, men nå med egenverdier $1$ og
$1/\kappa$ for $\kappa=10$, $100$ og $1000$. Vi kjører gradientmetoden med det
beste faste steget. Gradienten er $Ax-b$, og
Hessianen er $A$ overalt, så teorien over gjelder eksakt.

**Forutsi:** Hvor mange steg trengs for $\kappa=10$, $100$ og $1000$?

```{pyodide-python}
#| label: week9-condition
lam = np.linalg.eigvalsh(hess9([3., 2.]))
kappa = lam[1]/lam[0]
print(f'H(3,2): κ = {kappa:.2f}, beste steg = {2/lam.sum():.4f}, '
      f'S = {(kappa - 1)/(kappa + 1):.3f}')

# Skålene fra uke 6: samme dreining Q og samme løsning, egenverdier 1 og 1/κ.
Q = np.array([[1., -1.], [1., 1.]])/np.sqrt(2)
x_star = np.array([1., -1.1])
fig, ax = plt.subplots(figsize=(6.5, 4))
for kappa in [10, 100, 1000]:
    A = Q @ np.diag([1., 1/kappa]) @ Q.T
    b = A @ x_star
    alpha = 2/(1 + 1/kappa)                # beste faste steg
    S = (kappa - 1)/(kappa + 1)
    x = np.zeros(2)
    errors = [1.]                          # relativ feil, start i origo
    while errors[-1] > 1e-8:
        x = x - alpha*(A @ x - b)
        errors.append(np.linalg.norm(x - x_star)/np.linalg.norm(x_star))
    predicted = np.ceil(np.log(1e-8)/np.log(S))
    print(f'κ = {kappa:5}: {len(errors) - 1:5} steg, forutsagt {predicted:.0f}')
    ax.semilogy(errors, label=f'κ = {kappa}')
ax.set(xlabel='steg k', ylabel='relativ feil', xscale='log')
ax.legend(); plt.show()
```

Gradientmetoden bruker 92, 922 og 9211 steg, nøyaktig som forutsagt.
**Ti ganger større kondisjonstall gir ti ganger så mange steg.** For
$H(3,2)$ er $\kappa\approx3.2$, og derfor gikk eksperiment 2 raskt.

Bratteste nedstigning med eksakt linjesøk fra uke 6 har i verste fall den
samme faktoren; det er derfor den gikk i sikksakk i den smale skålen. Der var
svaret CG. I [uke 10](uke10.qmd) endrer vi i stedet geometrien:
Newtons metode bruker Hessianen til å gjøre skålen rund.

**Dette tar vi med oss.** For et fast steg gjelder
$\alpha<2/\lambda_{\max}$ for stabilitet og $S\ge(\kappa-1)/(\kappa+1)$ for
farten. Begge tallene kommer fra egenverdiene til $H_*$.

## 9.4 Hvorfor ikke bare prøve punkter?

<div id="uke9-endelig"></div>

### Et fast steg krever at vi vet for mye

Teorien i 9.1–9.3 er presis, men den bruker $H_*$, altså Hessianen i et
minimum vi ikke har funnet ennå. Ukens funksjon har fire minimumspunkter, og
det kritiske steget er forskjellig i hvert av dem:

```{pyodide-python}
#| label: week9-critical-steps
# De fire minimumspunktene til f (koordinater med seks desimaler).
minima = [(3., 2.), (-2.805118, 3.131312), (-3.779310, -3.283186), (3.584428, -1.848126)]
for m in minima:
    lam = np.linalg.eigvalsh(hess9(m))
    print(f'minimum ({m[0]:9.6f}, {m[1]:9.6f}): λ = {lam.round(2)}, '
          f'kritisk steg = {2/lam[1]:.4f}')
```

De kritiske stegene er $0.0243$, $0.0248$, $0.0149$ og $0.0190$. Langt fra et
minimum er Hessianen en helt annen. Vi trenger metoder som **tilpasser** steget
underveis. Før vi ser på dem, prøver vi det enkleste av alt: å ikke ta steg i
det hele tatt, men bare se på mange punkter.

### Eksperiment 4 – 64 prøver på to måter

Et **gittersøk** prøver alle kombinasjoner av valgte koordinater. Åtte verdier
for $x$ og åtte for $y$ gir $8^2=64$ punkter i kvadratet $[-4,4]^2$. Ved
**tilfeldig sampling** trekker vi i stedet 64 punkter jevnt fordelt i samme
kvadrat. Begge metodene bruker 64 **funksjonsevalueringer**, altså 64
beregninger av $f$. Den laveste observerte verdien er bare best blant punktene
vi har prøvd. `default_rng(42)` fester de tilfeldige tallene, slik at forsøket
kan gjentas.

```{pyodide-python}
#| label: week9-finite-search
# Åtte faste koordinater per akse gir 64 gitterpunkter.
axis = np.linspace(-4, 4, 8)
gx, gy = np.meshgrid(axis, axis)
grid = np.column_stack((gx.ravel(), gy.ravel()))
# Samme frø gjør de 64 tilfeldige prøvene reproduserbare.
rng = np.random.default_rng(42)
random_points = rng.uniform(-4, 4, size=(64, 2))
grid_values = np.array([f9(z) for z in grid])
random_values = np.array([f9(z) for z in random_points])
print(f'{"Metode":<12} {"Prøver":>7} {"Beste punkt (x, y)":>25} {"Laveste f":>12}')
for name, points, values in [('Gitter', grid, grid_values),
                             ('Tilfeldig', random_points, random_values)]:
    i = np.argmin(values)
    best_point = f'({points[i, 0]:.3f}, {points[i, 1]:.3f})'
    print(f'{name:<12} {len(values):>7} {best_point:>25} {values[i]:>12.3f}')

fig, ax = plt.subplots(figsize=(6, 5))
ax.scatter(grid[:, 0], grid[:, 1], s=22, label='gitter')
ax.scatter(random_points[:, 0], random_points[:, 1], s=12,
           alpha=.7, label='tilfeldig, frø 42')
ax.plot(3, 2, 'k*', markersize=12, label='kjent minimum (3, 2)')
ax.set(xlim=(-4.2, 4.2), ylim=(-4.2, 4.2), xlabel='x', ylabel='y')
ax.set_aspect('equal'); ax.legend(); plt.show()
```

Gitteret finner omtrent $2.710$ ved $(2.857,\,1.714)$. Det tilfeldige utvalget
finner omtrent $0.094$ ved $(-3.818,\,-3.280)$, i en annen dal. Et annet frø
kan snu rekkefølgen. Begge utvalgene lar alle punktene **mellom** prøvene være
uprøvd.

### Prøvebudsjett og dimensjon

Med $m$ punkter langs hver av $n$ koordinater bruker et fullt gitter $m^n$
evalueringer. For $m=8$ øker tallet fra $64$ i to dimensjoner til
$8^6=262144$ i seks dimensjoner, og avstanden mellom gitterpunktene er den
samme. Tilfeldige prøver kan holdes innenfor et budsjett, men treffer et lite
område med lave verdier like sjelden. **Å dekke hele området er håpløst i høy
dimensjon.** Vi bruker i stedet de punktene vi har sett, til å bestemme hvor vi
skal prøve neste gang: lokale metoder som tilpasser seg.

<details class="reading-step">
<summary>Gå i dybden: tilfeldig vandring med aksepterte forslag</summary>

En **tilfeldig vandring** velger neste forslag relativt til punktet vi har
beholdt. Vi trekker en tilfeldig retning med lengde 1, prøver et steg på 0.5
og beholder forslaget bare når verdien synker. Ved avslag blir vi stående og
trekker en ny retning. Neste prøve avhenger altså av forrige aksepterte punkt.

```{pyodide-python}
#| label: week9-random-walk-extension
walk_rng = np.random.default_rng(7)
walk = np.array([0., 0.])
for trial_number in range(20):
    # Normaliser en tilfeldig vektor: 0.5 blir den faktiske steglengden.
    direction = walk_rng.normal(size=2)
    direction /= np.linalg.norm(direction)
    candidate = walk + 0.5*direction
    if f9(candidate) < f9(walk):
        walk = candidate
print('Tilfeldig vandring etter 20 forslag')
print(f'  Sluttpunkt (x, y): ({walk[0]:.3f}, {walk[1]:.3f})')
print(f'  Funksjonsverdi:    {f9(walk):.3f}')
```

Vandringen kommer et godt stykke ned, men med fast steglengde 0.5 kan den
aldri komme nærmere et minimum enn det steget tillater. Neste fane krymper
steget når det ikke gir framgang.

</details>

## 9.5 Kompassøk: flytt og krymp

<div id="uke9-kompass"></div>

Et **kompassøk** bruker gjeldende punkt $z$ og en stegstørrelse $\Delta$. Det
evaluerer de fire naboene $z\pm\Delta(1,0)$ og $z\pm\Delta(0,1)$. En slik
undersøkelse kalles en **prøverunde**.

1. Beregn de fire naboverdiene (fire evalueringer).
2. Er den beste lavere enn verdien i $z$, flytter vi dit (**akseptert** flytting).
3. Hvis ingen er bedre, blir vi stående og halverer $\Delta$
   (en **mislykket** prøverunde).
4. Gjenta til $\Delta$ er mindre enn en valgt grense.

Metoden bruker bare funksjonsverdier, ingen deriverte.

### Eksperiment 5 – undersøk fire naboer

Vi starter i $(0,0)$ med $\Delta=1$. Startverdien er $f(0,0)=170$. Første runde
gir $f(1,0)=136$, $f(-1,0)=164$, $f(0,1)=136$ og $f(0,-1)=180$. To naboer deler
laveste verdi; ved likhet velger `argmin` den første, altså $(1,0)$.

Senere, i $(3,2)$, er ingen nabo lavere enn $0$, så søket blir stående og
halverer $\Delta$. Kartet viser bare aksepterte punkter; en halvering setter
ingen ny markør.

```{pyodide-python}
#| label: week9-compass
directions = np.array([[1., 0.], [-1., 0.], [0., 1.], [0., -1.]])
z = np.array([0., 0.])
step = 1.
current = f9(z)
path = [z.copy()]
polls = 0
# Stopp ved valgt oppløsning eller et øvre tak på antall runder.
while step >= 1/128 and polls < 100:
    trials = z + step*directions
    values = np.array([f9(t) for t in trials])
    polls += 1
    best = np.argmin(values)
    if values[best] < current:
        z = trials[best].copy()
        current = values[best]
        path.append(z.copy())
    else:
        step /= 2          # ingen forbedring: bli stående og prøv kortere steg
path = np.array(path)
print('Resultat etter kompassøket fra (0, 0)')
print(f'  Sluttpunkt (x, y): ({z[0]:g}, {z[1]:g})')
print(f'  Funksjonsverdi:    {current:.6g}')
print(f'  Evalueringer:      {4*polls + 1} (inkludert startpunktet)')

xx, yy = np.meshgrid(np.linspace(-4, 4, 180), np.linspace(-4, 4, 180))
fig, ax = plt.subplots(figsize=(6, 5.5))
ax.contour(xx, yy, f9([xx, yy]), levels=[1, 5, 20, 50, 100, 200], colors='#aab2bd')
ax.plot(path[:, 0], path[:, 1], 'o-', color='#bb4a37', markersize=4, label='kompass')
ax.plot(3, 2, 'k*', markersize=11, label='kjent minimum')
ax.set(xlim=(-4, 4), ylim=(-4, 4), xlabel='x', ylabel='y',
       title='Aksepterte punkter på nivåkurvene')
ax.set_aspect('equal'); ax.legend(); plt.show()
```

Banen ender i $(3,2)$ med $f=0$ etter 53 evalueringer. Her landet søket
eksakt på minimumet fordi $(3,2)$ ligger på gitteret av heltallssteg fra
origo. Fra et annet startpunkt skjer ikke det. Hva vet vi da når søket stopper?

### Hva sier en mislykket prøverunde?

Anta at en prøverunde med steg $\Delta$ mislykkes i $z$. Da er
$f(z+\Delta(1,0))\ge f(z)$ og $f(z-\Delta(1,0))\ge f(z)$. La $K$
være en øvre grense for krumningen langs koordinataksene på linjestykkene fra
$z-\Delta(1,0)$ til $z+\Delta(1,0)$ og fra $z-\Delta(0,1)$ til $z+\Delta(0,1)$,
altså for $|\partial^2f/\partial x^2|$ og $|\partial^2f/\partial y^2|$ der.
Taylor langs $x$-aksen gir

$$f(z\pm\Delta(1,0))\le f(z)\pm\Delta\frac{\partial f}{\partial x}(z)+\tfrac12K\Delta^2.$$

Kombinert med de to ulikhetene over gir det
$\bigl|\partial f/\partial x(z)\bigr|\le K\Delta/2$, og det samme for $y$.
Med $n$ variabler blir

$$\boxed{\|\nabla f(z)\|_2\le\sqrt n\,\frac{K\Delta}{2}.}$$

**En mislykket runde med lite $\Delta$ beviser at gradienten er liten.** Stoppregelen
«$\Delta$ er liten» får dermed en matematisk betydning: punktet er nesten
stasjonært. Det sier ikke at punktet er et globalt minimum, og heller ikke at
det er et minimum.

<details class="reading-step">
<summary>Gå i dybden: fra de to ulikhetene til grensen</summary>

Skriv $a=\partial f/\partial x(z)$. Taylor med restledd gir
$f(z+\Delta(1,0))=f(z)+\Delta a+\tfrac12\Delta^2f_{xx}(\xi)$ for et punkt $\xi$
mellom $z$ og $z+\Delta(1,0)$, og tilsvarende med $-\Delta$. Fordi runden
mislyktes, er

$$0\le f(z+\Delta(1,0))-f(z)\le\Delta a+\tfrac12K\Delta^2,\qquad
0\le f(z-\Delta(1,0))-f(z)\le-\Delta a+\tfrac12K\Delta^2.$$

Den første gir $a\ge-K\Delta/2$, den andre $a\le K\Delta/2$. Altså er
$|a|\le K\Delta/2$. Med samme grense for alle $n$ partiellderiverte er
$\|\nabla f\|_2^2\le n(K\Delta/2)^2$.

</details>

### Eksperiment 6 – kontroller grensen

Vi starter i $(0.3,\,0.7)$ og fortsetter til $\Delta<1/1024$. Siste mislykkede
runde hadde da $\Delta=1/1024$. Nær sluttpunktet endrer Hessianen seg lite, så
vi bruker $K=\|H(z)\|_2$, den største egenverdien i absoluttverdi, som er minst
like stor som begge diagonalelementene.

```{pyodide-python}
#| label: week9-compass-certificate
def compass(z, step, min_step):
    directions = np.array([[1., 0.], [-1., 0.], [0., 1.], [0., -1.]])
    current, polls = f9(z), 0
    while step >= min_step:
        trials = z + step*directions
        values = np.array([f9(t) for t in trials]); polls += 1
        best = np.argmin(values)
        if values[best] < current:
            z, current = trials[best], values[best]
        else:
            last_failed = step     # Δ i siste mislykkede runde
            step /= 2
    return z, last_failed, polls

z, delta, polls = compass(np.array([0.3, 0.7]), 1., 1/1024)
K = np.linalg.norm(hess9(z), 2)
print(f'sluttpunkt ({z[0]:.6f}, {z[1]:.6f}), f = {f9(z):.2e}, {4*polls + 1} evalueringer')
print(f'siste mislykkede Δ = {delta:.6f}, K = {K:.1f}')
print(f'grense sqrt(2)·K·Δ/2 = {np.sqrt(2)*K*delta/2:.4f}')
print(f'faktisk |∇f|          = {np.linalg.norm(grad9(z)):.4f}')
```

Grensen er omtrent $0.057$, og den faktiske gradientnormen er omtrent $0.011$.
Grensen holder, og den er ikke langt unna. Kompassøket brukte ingen deriverte.
For å tolke stoppen trengte vi bare et anslag $K$ for krumningen; da vet vi at
$\|\nabla f\|_2\le0.057$ uten å ha regnet ut gradienten.

<details class="reading-step">
<summary>Gå i dybden: valg som gir andre baner</summary>

Vi evaluerer alle fire naboer før vi flytter. En variant flytter til første
forbedring og kan bruke færre evalueringer, men følger en annen bane. Vi kunne
også prøve diagonale retninger. Grensen for gradienten gjelder for alle disse
variantene, så lenge en mislykket runde har prøvd både $+\Delta$ og $-\Delta$
langs hver akse. Ingen av variantene utelukker en lavere verdi i en annen dal.

</details>

## 9.6 Armijo: tilpass steget

<div id="uke9-linjesok"></div>

Kompassøket halverer $\Delta$ når en runde mislykkes. Nå bruker vi samme idé
langs negativ gradient. Et **linjesøk** holder punktet $z$ og retningen
$p=-\nabla f(z)$ fast og prøver steglengder $\alpha>0$. **Armijo-testen**
godtar $\alpha$ når

$$f(z+\alpha p)\le f(z)+10^{-4}\,\alpha\,\nabla f(z)^Tp.$$

Høyresiden er startverdien minus en liten brøkdel ($10^{-4}$) av nedgangen som
starthelningen lover. Testen krever altså en reell nedgang, men ikke det beste
steget. **Armijo-søket** starter med $\alpha=1$ og halverer til testen er
oppfylt. Etter flyttingen beregner vi en ny gradient og starter et nytt
linjesøk.

::: {.callout-note title="Håndeksempel: det første linjesøket fra origo"}

**Utgangspunkt.** I $(0,0)$ er $f=170$, $p=-\nabla f(0,0)=(14,22)^T$ og
$\nabla f^Tp=-14^2-22^2=-680$.

**Prøv selv.** Regn ut høyresiden i Armijo-testen for $\alpha=1/8$, og
punktet $z+\alpha p$.

**Regnegangen.** Halveringen prøver steglengdene i denne rekkefølgen:

| $\alpha$ | faktisk verdi $f(z+\alpha p)$ | Armijo-grense | resultat |
|:--|--:|--:|:--|
| $1$ | $283930$ | $169.932$ | avvis |
| $1/2$ | $17042$ | $169.966$ | avvis |
| $1/4$ | $761.125$ | $169.983$ | avvis |
| $1/8$ | $32.2578125$ | $169.9915$ | godta |

For $\alpha=1/8$ er grensen $170+10^{-4}\cdot\tfrac18\cdot(-680)=169.9915$, og
punktet er $(1.75,\,2.75)$.

**Dette tar vi med oss.** Starthelningen gir retningen, men bare den faktiske
funksjonsverdien kan godkjenne steget.

:::

<details class="reading-step">
<summary>Gå i dybden: hvorfor halveringen til slutt finner et steg</summary>

Sett $h(\alpha)=f(z+\alpha p)$ med $p=-\nabla f(z)$. Da er
$h'(0)=\nabla f(z)^Tp=-\|\nabla f(z)\|_2^2<0$ når gradienten ikke er null.
For en deriverbar funksjon er $h(\alpha)=h(0)+\alpha h'(0)+o(\alpha)$, der
restleddet delt på $\alpha$ går mot null. Siden Armijo bare krever $10^{-4}$ av
den lineære nedgangen $\alpha h'(0)$, vil tilstrekkelig små positive steg
oppfylle testen. En stor fast steglengde har ingen tilsvarende garanti. Uten en
nedgangsretning ($\nabla f(z)^Tp<0$) gjelder ikke argumentet.

</details>

### Eksperiment 7 – fast steg eller halvering?

Vi sammenligner $\alpha=0.02$ og $\alpha=0.1$ fra eksperiment 1 med
Armijo-søket. Alle starter i $(0,0)$. Armijo stopper når
$\|\nabla f\|_2<10^{-6}$.

```{pyodide-python}
#| label: week9-gradient-steps
def fixed_steps(rate, n=40):
    z = np.array([0., 0.])
    history, path = [f9(z)], [z.copy()]
    for k in range(n):
        candidate = z - rate*grad9(z)
        if not np.all(np.isfinite(candidate)) or np.linalg.norm(candidate) > 1e6:
            break  # grense for tegningen
        z = candidate
        history.append(f9(z)); path.append(z.copy())
    return z, np.array(history), np.array(path)

def armijo_steps(n=60):
    z = np.array([0., 0.])
    history, path = [f9(z)], [z.copy()]
    for k in range(n):
        g = grad9(z)
        if np.linalg.norm(g) < 1e-6:
            break
        rate = 1.
        # For p = -g er starthelningen g·p = -(g·g).
        while f9(z - rate*g) > f9(z) - 1e-4*rate*(g @ g):
            rate /= 2
        z = z - rate*g
        history.append(f9(z)); path.append(z.copy())
    return z, np.array(history), np.array(path)

runs = {'fast α=0.02': fixed_steps(0.02), 'fast α=0.1': fixed_steps(0.1),
        'Armijo': armijo_steps()}
print(f'{"Stegregel":<14} {"Steg":>5} {"Siste f":>11} {"Gradientnorm":>13}')
for name, (end, values, points) in runs.items():
    print(f'{name:<14} {len(values)-1:>5} {values[-1]:>11.3g} '
          f'{np.linalg.norm(grad9(end)):>13.3g}')

colors = {'fast α=0.02': '#1665ad', 'fast α=0.1': '#b5483f', 'Armijo': '#2b8a61'}
fig, (ax_map, ax) = plt.subplots(2, 1, figsize=(6.5, 9))
gx, gy = np.meshgrid(np.linspace(-1, 4, 160), np.linspace(-1, 4, 160))
ax_map.contour(gx, gy, f9([gx, gy]), levels=[1, 5, 20, 50, 100, 200],
               colors='#adb5bd', linewidths=.8)
for name in ['fast α=0.02', 'Armijo']:
    points = runs[name][2]
    ax_map.plot(points[:, 0], points[:, 1], 'o-', color=colors[name],
                markersize=2.5, linewidth=1.2, label=name)
ax_map.plot(3, 2, 'k*', markersize=11, label='kjent minimum')
ax_map.set(xlim=(-1, 4), ylim=(-1, 4), xlabel='x', ylabel='y',
           title='Aksepterte punkter på nivåkurvene')
ax_map.set_aspect('equal'); ax_map.legend(fontsize=8, loc='upper left')
for name, (end, values, points) in runs.items():
    # Logaritmisk akse kan ikke tegne null; løft bare viste verdier under 1e-15.
    ax.semilogy(np.maximum(values, 1e-15), 'o-', markersize=3,
                color=colors[name], label=name)
ax.set(xlabel='steg k', ylabel='f (logaritmisk skala)')
ax.legend(); fig.tight_layout(); plt.show()
```

Med $\alpha=0.02$ er verdien omtrent $10^{-15}$ etter 40 steg; med $\alpha=0.1$
eksploderer den, og koden stanser tegningen. Armijo-søket når
$\|\nabla f\|_2<10^{-6}$ etter 25 steg. Det trenger ikke å kjenne
$\alpha_{\text{krit}}$: det første steget fra origo var $1/8$, langt over
$0.0243$, men det ble godkjent fordi det faktisk senket $f$. Det viktigste er
at **Armijo-søket alltid senker $f$**: $f(z_{k+1})<f(z_k)$ i hvert steg.

<details class="reading-step">
<summary>Gå i dybden: det beste steget langs en linje, eller et godt nok steg?</summary>

**Et lite eksempel.** Ta $q(s)=(s-2)^2$, start i $s_0=0$ og gå i retning
$p=1$. Langs linjen er verdien $q(\alpha)=(\alpha-2)^2$, og den beste
steglengden er $\alpha=2$ med $q=0$. Armijo godtar allerede $\alpha=1$: $q(0)=4$,
$q'(0)=-4$ og $q(1)=1\le4+10^{-4}\cdot1\cdot(-4)=3.9996$.

**Et numerisk søk langs én linje.** Med fast $z$ og $p$ kan vi minimere
funksjonen $h(\alpha)=f(z+\alpha p)$ av én variabel. Her søker
`minimize_scalar` i intervallet $0\le\alpha\le0.2$ fra origo langs negativ
gradient:

```{pyodide-python}
#| label: week9-scalar-line-search
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

Søket gir omtrent $\alpha=0.1273$ og $f\approx32.13$, nesten det samme som
Armijo-steget $1/8$ med $f\approx32.26$. Den deriverte langs linjen er nær null,
men gradientnormen i planet er omtrent $36$: neste steg må gå i en ny retning.
Det beste steget langs én linje er derfor sjelden verdt mange ekstra
evalueringer.

</details>

<div id="uke9-scipy"></div>

<details>
<summary>SciPy-oppslag: ett avgrenset linjesøk (brukt i fordypningen over)</summary>

| Uttrykk | Betydning |
|:--|:--|
| `from scipy.optimize import minimize_scalar` | Henter rutinen. I nettleseren lastes SciPy første gang denne linjen kjøres. |
| `minimize_scalar(h, bounds=(0., .2), method="bounded")` | Søk numerisk på valgt intervall, der `h(alpha)` returnerer ett tall. |
| `options={"xatol": 1e-10}` | Absolutt stopptoleranse for steglengden $\alpha$, ikke en garantert feil i $f$. |
| `line.x`, `line.fun`, `line.nfev` | Valgt steglengde, verdi langs linjen og antall evalueringer. |
| `line.success` | Om rutinen nådde sitt stoppvilkår, ikke et globalt optimalitetsbevis. |

</details>

## 9.7 Én garanti for begge metodene

<div id="uke9-garanti"></div>

### Eksperiment 8 – et søk som aldri kommer fram

Kompassøket og Armijo-søket godtar bare punkter med **lavere** funksjonsverdi.
Er det nok til at de kommer fram? I [uke 8](uke8.qmd#uke8-eksistens) prøvde vi
å tilpasse $m(t)=a(1-e^{-bt})$ til ni målinger på linjen $y=0.5\,t$, med $b>0$.
Vi kaller kvadratsummen $S_8(a,b)$ her, så den ikke blandes med
konvergensfaktoren $S$. I uke 8 fant vi at $S_8$ kan gjøres så liten vi vil,
men at minimum ikke finnes.

**Forutsi:** Hva gjør Armijo-søket fra $(a,b)=(1,1)$? Nærmer det seg et bestemt
punkt?

```{pyodide-python}
#| label: week9-drift
# Armijo-søk på kvadratsummen fra uke 8, start (a, b) = (1, 1).
z = np.array([1., 1.])
path = [z.copy()]
print(f'{"steg":>6} {"a":>7} {"b":>7} {"S_8":>10} {"|∇S_8|":>9}')
for k in range(1, 3001):
    g = grad_S8(z)
    alpha, S0 = 1., S8(z)
    while S8(z - alpha*g) > S0 - 1e-4*alpha*(g @ g):
        alpha /= 2
    z = z - alpha*g
    path.append(z.copy())
    if k in (10, 100, 1000, 3000):
        print(f'{k:>6} {z[0]:>7.3f} {z[1]:>7.3f} {S8(z):>10.2e} '
              f'{np.linalg.norm(grad_S8(z)):>9.1e}')
path = np.array(path)

bb = np.linspace(0.1, 1.2, 200)
fig, ax = plt.subplots(figsize=(6.5, 4))
ax.plot(0.5/bb, bb, ':', color='gray', label='kurven a = 0.5/b')
ax.plot(path[:, 0], path[:, 1], '-', color='#2b8a61', label='Armijo-iterater')
ax.plot(*path[0], 'ks', label='start (1, 1)')
ax.set(xlabel='a', ylabel='b', xlim=(0, 5), ylim=(0, 1.2))
ax.legend(); plt.show()
```

Armijo-søket gjør nøyaktig det det skal: $S_8$ synker i hvert steg. Men
iteratene kryper langs kurven $a=0.5/b$: etter $10^2$, $10^3$ og $3\cdot10^3$
steg er $a\approx2.5,\ 3.4,\ 3.8$ og $b\approx0.29,\ 0.20,\ 0.17$. Langs denne
kurven går $S_8$ mot 0 mens $a\to\infty$, så det finnes ingen grense å
konvergere mot. Gradientnormen faller likevel fra $0.77$ til omtrent $0.1$. En
stoppregel som $\|\nabla S_8\|_2<0.2$ ville derfor meldt suksess i et tilfeldig
punkt på veien.

Det er ikke metoden som svikter, men funksjonen som mangler en egenskap. Resten
av 9.7 sier hvilken.

### Begge metodene blir i samme mengde

Fordi begge metodene bare godtar lavere verdier, ligger alle iteratene i
**subnivåmengden**

$$L_0=\{z: f(z)\le f(z_0)\},$$

der $z_0$ er startpunktet. Hvis $L_0$ er begrenset, kan ikke iteratene rømme.
En begrenset følge har en konvergent delfølge (Bolzano–Weierstrass, fra
fordypningen om ekstremalverdisetningen i [uke 8](uke8.qmd#uke8-kompakt)). Hvis
$f$ er kontinuerlig, er $L_0$ lukket, så grensen ligger i $L_0$. Et punkt som
en delfølge konvergerer mot, kalles et **grensepunkt** for følgen.

Når er $L_0$ begrenset? En funksjon på hele $\mathbb R^n$ er **koersiv** hvis

$$f(z)\to\infty\quad\text{når}\quad\|z\|_2\to\infty.$$

Da er alle subnivåmengder begrenset: langt nok ute er $f$ større enn $f(z_0)$.
Sammen med lukketheten er $L_0$ da kompakt. Kvadratsummen $S_8$ i eksperiment 8
er **ikke** koersiv: langs kurven $a=0.5/b$ holder den seg begrenset mens
$a\to\infty$.

::: {.callout-important}
#### Garantien

La $f$ være koersiv og ha kontinuerlig gradient (for kompassøket også
kontinuerlige andrederiverte).

- **Armijo-søket langs $-\nabla f$:** iteratene er begrenset, og hvert
  grensepunkt er **stasjonært** ($\nabla f=0$).
- **Kompassøket:** iteratene er begrenset, $\Delta$ går mot null, og hver
  mislykket runde med steg $\Delta$ gir $\|\nabla f\|_2\le\sqrt n\,K\Delta/2$,
  med $K$ som i 9.5. Grensen går altså mot null.

Garantien sier **stasjonært**, ikke globalt minimum. Om et stasjonært punkt er
globalt best, er konveksitetsspørsmålet fra [uke 8](uke8.qmd#uke8-lokalt).
:::

<details class="reading-step">
<summary>Gå i dybden: hvorfor er grensepunktene stasjonære?</summary>

Skriv $\nabla f_k=\nabla f(z_k)$ og la $\alpha_k$ være det godtatte steget.

1. $f(z_k)$ avtar og er nedtil begrenset (en kontinuerlig funksjon på den
   kompakte mengden $L_0$ har minimum). Derfor konvergerer $f(z_k)$, og
   $f(z_k)-f(z_{k+1})\to0$.
2. Armijo-testen gir $f(z_k)-f(z_{k+1})\ge10^{-4}\alpha_k\|\nabla f_k\|_2^2$.
   Altså går $\alpha_k\|\nabla f_k\|_2^2\to0$.
3. La $z_k\to\bar z$ langs en delfølge. Hvis $\alpha_k$ holder seg over en fast
   positiv grense langs en videre delfølge, må $\|\nabla f_k\|_2\to0$ der, og
   $\nabla f(\bar z)=0$ fordi gradienten er kontinuerlig.
4. Ellers går $\alpha_k\to0$ langs delfølgen. Da er $\alpha_k<1$ til slutt, så
   steget $2\alpha_k$ ble avvist:
   $f(z_k-2\alpha_k\nabla f_k)>f(z_k)-10^{-4}\cdot2\alpha_k\|\nabla f_k\|_2^2$.
   Middelverdisetningen gir et punkt $\xi_k$ mellom $z_k$ og
   $z_k-2\alpha_k\nabla f_k$ med
   $-\nabla f(\xi_k)^T\nabla f_k>-10^{-4}\|\nabla f_k\|_2^2$. Når $k\to\infty$
   langs delfølgen, går både $\xi_k$ og $z_k$ mot $\bar z$, og vi får
   $\|\nabla f(\bar z)\|_2^2\le10^{-4}\|\nabla f(\bar z)\|_2^2$. Det er bare
   mulig når $\nabla f(\bar z)=0$.

For kompassøket: prøvepunktene $z\pm\Delta e_i$ i en mislykket runde kan ligge
litt utenfor $L_0$; de ble jo avvist. Men de ligger høyst $\Delta_0$ fra $L_0$,
der $\Delta_0$ er startsteget, og mengden av slike punkter er også lukket og
begrenset. Der finnes en grense $K$ for de andrederiverte, så grensen fra 9.5
gjelder i hver mislykket runde. $\Delta$ går dessuten faktisk mot null. Med
fast $\Delta$ ligger alle iteratene på et rutenett med avstand $\Delta$, og den
begrensede $L_0$ inneholder bare endelig mange slike punkter. Siden $f$ synker i
hver flytting, besøkes ingen av dem to ganger, så før eller siden mislykkes en
runde og $\Delta$ halveres.

</details>

### Eksperiment 9 – subnivåmengden til Himmelblaus funksjon

Himmelblaus funksjon er koersiv: når $\|z\|_2$ blir stor, blir minst én av
parentesene $x^2+y-11$ og $x+y^2-7$ stor. Figuren viser $L_0$ for startpunktet
$(0,0)$, der $f(0,0)=170$.

```{pyodide-python}
#| label: week9-sublevel
# Største avstand fra origo blant punktene i L0, på et fint rutenett.
gx, gy = np.meshgrid(np.linspace(-7.5, 7.5, 751), np.linspace(-7.5, 7.5, 751))
F = f9([gx, gy])
print(f'største avstand fra origo i L0: {np.hypot(gx, gy)[F <= 170].max():.2f}')

fig, ax = plt.subplots(figsize=(6, 6))
ax.contourf(gx, gy, F, levels=[0, 170], colors=['#cfe3f2'])
ax.contour(gx, gy, F, levels=[170], colors='#1665ad')
ax.add_patch(plt.Circle((0, 0), 7, fill=False, linestyle='--', color='gray'))
ax.plot(0, 0, 'ks', label='start (0, 0)')
for m in minima:
    ax.plot(*m, 'k*', markersize=9)
ax.set(xlim=(-7.5, 7.5), ylim=(-7.5, 7.5), xlabel='x', ylabel='y',
       title='L₀ = {f ≤ 170} (blått) og sirkelen med radius 7')
ax.set_aspect('equal'); ax.legend(loc='upper right'); plt.show()
```

Hele $L_0$ ligger inne i skiven med radius 7; det fjerneste punktet har avstand
omtrent $6.8$ fra origo. Det blå området inneholder alle fire minimumspunktene
(stjernene). Startpunktet ligger på randen, fordi $f(0,0)=170$. Innbuktningen
under origo går rundt et lokalt maksimum nær $(-0.27,\,-0.92)$, der $f$ er
større enn 170. Kompassøket i eksperiment 5 og Armijo-søket i eksperiment 7
startet begge i origo. Alle deres iterater ligger derfor i det blå området, og
garantien gjelder for dem.

::: {.callout-note title="Håndeksempel: koersiv eller ikke?"}

**Utgangspunkt.** $f_1(x,y)=x^2+y^2$ og $f_2(x,y)=(x-y)^2$.

**Prøv selv.** Er subnivåmengden $\{f\le1\}$ begrenset for begge?

**Regnegangen.** For $f_1$ er den skiven med radius 1. For $f_2$ er den stripen
$|x-y|\le1$, som inneholder hele linjen $x=y$, der $f_2=0$. Altså er $f_1$
koersiv, og $f_2$ er det ikke.

**Dette tar vi med oss.** Én linje der $f$ holder seg begrenset mens
$\|z\|_2\to\infty$, er nok til å vise at $f$ ikke er koersiv. Garantien er en
tilstrekkelig betingelse: Armijo-søket finner faktisk et minimumspunkt for
$f_2$, men det sier ikke garantien på forhånd.

:::

<details class="reading-step">
<summary>Gå i dybden: skålen fra uke 6 og minste kvadrater fra uke 4 er koersive</summary>

- **Skålen fra uke 6**, $\phi(x)=\tfrac12x^TAx-b^Tx$ med $A$ SPD: fordi
  $x^TAx\ge\lambda_{\min}\|x\|_2^2$ (uke 5) og $b^Tx\le\|b\|_2\|x\|_2$, er
  $$\phi(x)\ge\tfrac12\lambda_{\min}\|x\|_2^2-\|b\|_2\|x\|_2\to\infty.$$
  Den er koersiv.
- **Minste kvadrater fra uke 4**, $\|b-Ac\|_2^2$: koersiv når nullrommet til
  $A$ bare er nullvektoren. Har $A$ et nullrom, er funksjonen konstant langs
  det, og da er den ikke koersiv (den flate dalen i uke 8).

</details>

**Dette tar vi med oss.** Uten koersivitet (eller en annen grunn til at $L_0$
er begrenset) kan en metode som alltid går nedover, likevel aldri komme fram,
som i eksperiment 8. Garantien krever en egenskap ved **funksjonen**; den
følger ikke av metoden.

## 9.8 Regneoppgaver

<div id="uke9-oppgaver"></div>

Oppgave 1–4 følger 9.1–9.3, og oppgave 5–10 følger 9.4–9.7. Regn uten kode
først. Svar eksakt (hele tall, brøker eller uttrykk som `sqrt(3)/4`). I
uttrykksfeltene bruker du `*` for multiplikasjon og `^` for potens. Der det
spørres om ja/nei, skriver du **1 for ja, 0 for nei**. Begrunnelser skriver du i
egne notater.

**Oppgave 1 – gradient og første steg.**

```{math-exercise}
#| label: week9-task-first-gradient-step
#| caption: Oppgave 1 – gradient og første steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: negativ gradients første komponent, negativ gradients andre komponent, nytt punkts første koordinat, nytt punkts andre koordinat, verdien synker
For $f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2$ er $u=x^2+y-11$ og $w=x+y^2-7$, og
gradientens komponenter er $4xu+2w$ og $2u+4yw$. Start i $z_0=(1,1)$. Finn
negativ gradient og punktet etter ett steg med $\alpha=1/100$.

$-\nabla f(1,1)=$ vec[46,38]

$z_1=$ vec[73/50,69/50]

Er $f(z_1)<f(z_0)$? _[1]
```

**Oppgave 2 – fast steg i én variabel.**

```{math-exercise}
#| label: week9-task-one-dimension
#| caption: Oppgave 2 – fast steg i én variabel
#| mode: equivalent
#| partial-credit: true
#| field-labels: faktor ved alpha 3/10, konvergerer ved 3/10, faktor ved alpha 3/5, konvergerer ved 3/5, kritisk steg
For $f(x)=2x^2$ er minimumet $r=0$. Gradientmetoden med fast steg er
$x_{k+1}=x_k-\alpha f'(x_k)$, og hvert steg ganger $x_k$ med samme faktor.
Finn faktoren for to steglengder, avgjør om metoden konvergerer, og finn det
kritiske steget.

$\alpha=3/10$: faktor _[-1/5], konvergerer _[1]

$\alpha=3/5$: faktor _[-7/5], konvergerer _[0]

Kritisk steg: _[1/2]

Hva ser du i iteratene når faktoren er negativ? Sammenlign med helningsregelen fra uke 2.
```

**Oppgave 3 – kritisk steg fra egenverdiene.**

```{math-exercise}
#| label: week9-task-critical-step
#| caption: Oppgave 3 – kritisk steg fra egenverdiene
#| mode: equivalent
#| partial-credit: true
#| field-labels: minste egenverdi, største egenverdi, kritisk steg, konvergerer ved 3/10, konvergerer ved 7/20, konvergensfaktor ved 3/10
I et minimumspunkt er Hessianen $H_*=\begin{bmatrix}5&2\\2&2\end{bmatrix}$. Finn
egenverdiene og det kritiske steget. Avgjør om gradientmetoden konvergerer
lokalt med $\alpha=3/10$ og med $\alpha=7/20$, og finn konvergensfaktoren
$S$ for $\alpha=3/10$.

Egenverdier: minste _[1], største _[6]

$\alpha_{\text{krit}}=$ _[1/3]

Konvergerer med $\alpha=3/10$? _[1]
Konvergerer med $\alpha=7/20$? _[0]

$S$ ved $\alpha=3/10$: _[4/5]

Hvilken egenretning bestemmer $S$ her?
```

**Oppgave 4 – kondisjonstall og antall steg.**

```{math-exercise}
#| label: week9-task-conditioning
#| caption: Oppgave 4 – kondisjonstall og antall steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: kondisjonstall, beste faste steg, beste konvergensfaktor, antall steg
La $f(x,y)=2x^2+\tfrac12y^2$, med Hessian $\operatorname{diag}(4,1)$ overalt.
Finn kondisjonstallet, det beste faste steget og konvergensfaktoren med dette
steget. Finn til slutt det minste antallet steg $k$ som gir $S^k\le10^{-8}$.

$\kappa=$ _[4]

$\alpha_{\text{best}}=$ _[2/5]

$S_{\text{best}}=$ _[3/5]

Antall steg: _[37]

Hvor mange steg ville du vente for $\kappa=40$? Begrunn uten å regne nøyaktig.
```

**Oppgave 5 – tell evalueringene.**

```{math-exercise}
#| label: week9-task-grid-count
#| caption: Oppgave 5 – tell evalueringene
#| mode: equivalent
#| partial-credit: true
#| field-labels: evalueringer i to dimensjoner, evalueringer i seks dimensjoner
Et gitter har 9 verdier i hver koordinat. Hvor mange funksjonsverdier må
beregnes i to dimensjoner, og hvor mange i seks?

To dimensjoner: _[81]

Seks dimensjoner: _[531441]
```

**Oppgave 6 – én kompassrunde.**

```{math-exercise}
#| label: week9-task-compass-first
#| caption: Oppgave 6 – én kompassrunde
#| mode: equivalent
#| partial-credit: true
#| field-labels: nytt punkts første koordinat, nytt punkts andre koordinat, ny funksjonsverdi
For $f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2$ står kompassøket i $(1,1)$ med
$\Delta=1$. Prøv de fire naboene $(2,1)$, $(0,1)$, $(1,2)$ og $(1,0)$, og
bruk regelen fra 9.5. Hvor står søket etter runden, og hva er verdien der?

Nytt punkt: $x=$ _[2], $y=$ _[1]

Funksjonsverdi: _[52]
```

**Oppgave 7 – halver uten å flytte.**

```{math-exercise}
#| label: week9-task-compass-shrink
#| caption: Oppgave 7 – halver uten å flytte
#| mode: equivalent
#| partial-credit: true
#| field-labels: første koordinat, andre koordinat, ny stegstørrelse
Et kompassøk står i $(3,2)$ med $\Delta=1/2$. Ingen av de fire
naboene gir lavere verdi. Oppgi punkt og steg etter regelen fra 9.5.

Nytt punkt: $x=$ _[3], $y=$ _[2]

Ny $\Delta=$ _[1/4]
```

**Oppgave 8 (valgfri) – hva beviser en mislykket runde?**

```{math-exercise}
#| label: week9-task-compass-bound
#| caption: Oppgave 8 (valgfri) – hva beviser en mislykket runde?
#| mode: equivalent
#| field-labels: øvre grense for gradientnormen
En prøverunde i to variabler mislykkes med $\Delta=1/100$. Nær punktet er
$|\partial^2f/\partial x^2|\le10$ og $|\partial^2f/\partial y^2|\le10$. Gi den
øvre grensen for $\|\nabla f\|_2$ fra 9.5.

$\|\nabla f\|_2\le$ _[sqrt(2)/20]

Hvorfor må runden prøve både $+\Delta$ og $-\Delta$ langs hver akse for at grensen skal gjelde?
```

**Oppgave 9 – test et steg.**

```{math-exercise}
#| label: week9-task-armijo
#| caption: Oppgave 9 – test et steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: høyreside i Armijo-testen, steget godtas
Ved et punkt er $f(z)=10$ og $\nabla f(z)^Tp=-20$.
Vi prøver $\alpha=1/2$ med Armijo-faktor $10^{-4}$ og
måler $f(z+\alpha p)=9$. Regn ut høyresiden
$f(z)+10^{-4}\alpha\nabla f(z)^Tp$ som en brøk, og avgjør om steget godtas.

Høyreside: _[9999/1000]

Godtas: _[1]
```

**Oppgave 10 – koersiv eller ikke?**

```{math-exercise}
#| label: week9-task-coercive
#| caption: Oppgave 10 – koersiv eller ikke?
#| mode: equivalent
#| partial-credit: true
#| field-labels: x^2 + 2y^2 koersiv, x^2 + y^2 - 4xy koersiv, e^x + y^2 koersiv, x^4 + y^2 koersiv
Avgjør om funksjonene er koersive på hele planet. For en funksjon som ikke er
koersiv: finn en linje eller kurve der $\|z\|_2\to\infty$ mens funksjonen
**ikke** går mot $+\infty$ (den kan holde seg begrenset eller gå mot $-\infty$).

$x^2+2y^2$: _[1]

$x^2+y^2-4xy$: _[0]

$e^x+y^2$: _[0]

$x^4+y^2$: _[1]

Hva kan du si om iteratene til Armijo-søket for hver av de fire funksjonene?
```

## 9.9 Python: mål og tilpass

<div id="uke9-python"></div>

Fullfør én eller to linjer i hver oppgave. Hver celle har egne importer og
egne funksjonsdefinisjoner og kan kjøres uavhengig. Kontrollene vurderer
resultatet uten å vise løsningskode.

**Oppgave 1 – mål konvergensfaktoren.** Listen `errors` inneholder feilene
$e_0,e_1,\ldots,e_k$ fra en kjøring. Returner $(e_k/e_{k-10})^{1/10}$, altså
den gjennomsnittlige faktoren over de ti siste stegene. Det er måten vi anslo
$S$ på i uke 2, bare over flere steg.

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

**Oppgave 2 – finn beste prøvde punkt.** Funksjonen er ferdig gitt;
bruk de oppgitte punktene, og returner paret `(punkt, verdi)`.

```{py-exercise}
#| label: week9-python-best-sample
#| caption: Finn beste punkt i en endelig prøveliste
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

**Oppgave 3 – én kompassrunde.** Returner den beste naboen dersom
verdien synker; ellers returner det opprinnelige punktet og halvparten
av stegstørrelsen. De fire retningene og sammenligningen er gitt.

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

**Oppgave 4 – godta eller halver.** Armijo-testen trenger verdien i
punktet, verdien i kandidaten og starthelningen langs retningen.
Returner den oppdaterte steglengden; de andre beregningene er gitt.

```{py-exercise}
#| label: week9-python-armijo-step
#| caption: Test én steglengde mot Armijo-kravet
#| show-test-hints: false
import numpy as np

# Samme test som i 9.6, men med tall gitt direkte som argumenter.
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

I [uke 10](uke10.qmd) bruker vi Hessianen til å forme selve retningen. Da
forsvinner kondisjonstallet fra farten nær minimumet, men vi må fortsatt
kontrollere funksjonsverdien før et steg godtas.

:::
