<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 9.0 Oversikt

<div id="uke9-start"></div>

### Fra prøver til en søkemetode

I [uke 6](uke6.qmd#uke6-retning) fant vi et minimum av en kvadratisk
energi ved å velge retning og steglengde. I [uke 8](uke8.qmd#uke8-lokalt)
så vi at et lokalt minimum kan være dårligere enn et globalt. Nå skal
vi faktisk **lete** i en funksjon som har flere daler. Vi sammenligner
et endelig utvalg av prøver, et kompassøk som tilpasser prøvene, og
gradientmetoden som bruker deriverte.

Vi bruker hele tiden

$$f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2.$$

En **funksjonsevaluering** betyr at vi beregner $f$ i ett punkt.
En **iterasjon** er én runde som kan oppdatere gjeldende punkt.
I kodeeksemplene tar `f9(z)` inn vektoren `z = [x, y]` og gir
funksjonsverdien; `grad9(z)` gir de to partiellderiverte. Alle forsøk
kan kjøres i teksten. De bruker samme funksjon, slik at forskjellene
kommer fra valg av søkemetode og steg.

Et kontrollpunkt er $(3,2)$: begge parentesene i $f$ blir null der,
og $f(3,2)=0$. Siden kvadrater aldri er negative, beviser dette at
$(3,2)$ er et globalt minimumspunkt. Metodene får ikke punktet oppgitt
som start. De endelige prøvene viser bare hvilke verdier de observerte;
det matematiske argumentet er den globale garantien.

### Læringsmål

Etter denne uken skal du kunne

- sammenligne et endelig gittersøk og tilfeldig sampling med samme antall funksjonsevalueringer,
- utføre en runde kompassøk og forklare når steget halveres,
- beregne en gradient og bruke den til å finne en lokal nedgangsretning,
- skille en nedgangsretning fra et stegs faktiske funksjonsverdi og bruke en enkel Armijo-test,
- tolke stoppregel, funksjonsverdi og gradientnorm uten å forveksle dem med et globalt bevis.

## Python-oppsett

<div id="uke9-oppsett"></div>

Denne cellen importerer pakkene og definerer funksjonene som brukes i ukens
forsøk. Den kjøres automatisk når Python er klart. **Vent på meldingen
«Oppsett for uke 9 er klart» før du kjører et eksperiment.** Første oppstart
kan ta litt tid fordi nettleseren må hente pakkene.

Her er `f9(z)` målfunksjonen fra 9.0, og `grad9(z)` er gradienten.
Du kan lese definisjonene og kjøre oppsettet på nytt med **Kjør**.
Hvis en celle melder at et navn ikke er definert, kjør oppsettet på nytt
og deretter forsøket. Kodeoppgavene til slutt inneholder sine egne importer.

{{< include ../_includes/optimization/week9_setup.md >}}

## 9.1 Endelig søk: beste prøve i et utvalg

<div id="uke9-endelig"></div>

### Eksperiment 1 – 64 prøver på to måter

Vi vil se hvor mye plasseringen av prøvene betyr når begge metoder får
samme budsjett. Se etter **laveste observerte verdi** i utskriften og
etter hvor de to prøvesettene ligger i figuren. Stjernen markerer bare
ett kjent minimumspunkt. En lav verdi i et endelig utvalg er ikke i
seg selv et bevis for globalt minimum.

Et **gittersøk** prøver alle kombinasjoner av utvalgte koordinater.
Åtte verdier for $x$ og åtte for $y$ gir $8^2=64$ punkter i kvadratet
$[-4,4]^2$. Ved **tilfeldig sampling** trekker vi i stedet 64
uavhengige punkter i det samme kvadratet. Hvert punkt trekkes uavhengig av de tidligere punktene, med jevn
fordeling over kvadratet.
`default_rng(42)` fester den tilfeldige startverdien, slik at forsøket
kan gjentas.

```{pyodide-python}
#| label: week9-finite-search
# Åtte faste koordinater per akse gir 64 gitterpunkter.
axis = np.linspace(-4, 4, 8)
u, v = np.meshgrid(axis, axis)
grid = np.column_stack((u.ravel(), v.ravel()))
# Samme frø gjør de 64 uavhengige, tilfeldige prøvene reproduserbare.
rng = np.random.default_rng(42)
random_points = rng.uniform(-4, 4, size=(64, 2))
# Evaluer samme målfunksjon én gang i hvert prøvd punkt.
grid_values = np.array([f9(z) for z in grid])
random_values = np.array([f9(z) for z in random_points])
# Sammenlign metodene rad for rad med samme antall evalueringer.
print(f'{"Metode":<12} {"Prøver":>7} {"Beste punkt (x, y)":>25} {"Laveste f":>12}')
for name, points, values in [('Gitter', grid, grid_values),
                             ('Tilfeldig', random_points, random_values)]:
    i = np.argmin(values)
    best_point = f'({points[i, 0]:.3f}, {points[i, 1]:.3f})'
    print(f'{name:<12} {len(values):>7} {best_point:>25} {values[i]:>12.3f}')

# Marker alle prøvene og det kjente nullpunktet i samme plan.
fig, ax = plt.subplots(figsize=(6, 5))
ax.scatter(grid[:, 0], grid[:, 1], s=22, label='gitter')
ax.scatter(random_points[:, 0], random_points[:, 1], s=12,
           alpha=.7, label='tilfeldig, frø 42')
ax.plot(3, 2, 'k*', markersize=12, label='kjent nullpunkt')
ax.set(xlim=(-4.2, 4.2), ylim=(-4.2, 4.2), xlabel='x', ylabel='y')
ax.set_aspect('equal'); ax.legend(); plt.show()
```

Gitteret finner omtrent $2{,}710$ ved $(2{,}857,1{,}714)$.
Det tilfeldige utvalget finner omtrent $0{,}094$ ved
$(-3{,}818,-3{,}280)$. Stjernen viser det kjente punktet $(3,2)$;
den er en referanse i figuren, ikke en av metodens prøver.
Det beste tilfeldige punktet ligger i en annen dal. Avstand til den
ene stjernen rangerer derfor ikke funksjonsverdiene.
Denne gangen får tilfeldige prøver lavere verdi, men et annet frø
kan endre rekkefølgen. Ingen av utvalgene undersøker alle punktene
**mellom** prøvene. Selv om vi ser en verdi nær null, er det bare
sum-av-kvadrater-argumentet i 9.0 som kan utelukke negative verdier.

### Prøvebudsjett og dimensjon

Med $m$ punkter langs hver av $d$ koordinater bruker et fullt gitter
$m^d$ evalueringer. For $m=8$ øker tallet fra $64$ i to dimensjoner
til $8^6=262144$ i seks dimensjoner. Tilfeldig sampling kan holdes
til et gitt budsjett, men gir heller ingen sikkerhet for å treffe et
lite område med lav verdi. Vi kan bruke tidligere målinger til å velge
hvor vi prøver neste gang.

<details class="reading-step">
<summary>Gå i dybden: tilfeldig vandring med aksepterte forslag</summary>

En **tilfeldig vandring** velger neste forslag relativt til punktet vi
har beholdt. Vi trekker en tilfeldig retning med vektorlengde 1,
prøver et steg på 0,5 og beholder forslaget bare når verdien synker.
Ved avslag blir vi stående og trekker en ny retning. Dermed er dette
en annen prosess enn de uavhengige prøvene over.
Forsøket viser hva som skjer når neste prøve avhenger av forrige
aksepterte punkt. Se på sluttverdien etter 20 forslag; utskriften
inneholder ikke en garanti for at vi har funnet den laveste verdien.

```{pyodide-python}
#| label: week9-random-walk-extension
# Start i origo; senere forslag tas fra det sist aksepterte punktet.
walk_rng = np.random.default_rng(7)
walk = np.array([0., 0.])
for trial_number in range(20):
    # Normaliser en tilfeldig vektor: 0,5 blir faktisk steglengden.
    direction = walk_rng.normal(size=2)
    direction /= np.linalg.norm(direction)
    candidate = walk + 0.5*direction
    # Ved avslag forblir walk uendret før neste forslag trekkes.
    if f9(candidate) < f9(walk):
        walk = candidate
print('Tilfeldig vandring etter 20 forslag')
print(f'  Sluttpunkt (x, y): ({walk[0]:.3f}, {walk[1]:.3f})')
print(f'  Funksjonsverdi:    {f9(walk):.3f}')
```

Et endelig antall forsøk gir fortsatt ikke et globalt bevis.

</details>

## 9.2 Kompassøk: flytt og krymp

<div id="uke9-kompass"></div>

### Eksperiment 2 – undersøk fire naboer

Vi bruker de tidligere prøvene til å velge et nytt punkt, og krymper
søket når ingen nabo hjelper. Se på første prøverunde i utskriften:
samme verdi kan gi flere beste naboer. Sammenlign deretter antall
evalueringer og sluttpunktet med banen i figuren. Den nederste grafen
viser bare verdier etter **aksepterte flyttinger**.

Vi starter i $z_0=(0,0)$ med stegstørrelse $\Delta=1$.
Et **kompassøk** evaluerer de fire naboene
$z+\Delta(1,0)$, $z-\Delta(1,0)$, $z+\Delta(0,1)$ og
$z-\Delta(0,1)$. Finner det en lavere verdi, flytter det til den
beste av de fire. Ellers beholder det punktet og halverer $\Delta$.
En slik undersøkelse av fire naboer er én **prøverunde**. Vi stopper
når $\Delta<1/128$ eller etter 100 runder.

I første runde er startverdien $f(0,0)=170$:

| Prøve i oppgitt rekkefølge | $(1,0)$ | $(-1,0)$ | $(0,1)$ | $(0,-1)$ |
|:--|--:|--:|--:|--:|
| Funksjonsverdi | 136 | 164 | 136 | 180 |

Første og tredje kandidat deler laveste verdi. Når det er likt,
velger `argmin` den første, altså $(1,0)$. Oppdateringsregelen er:

1. Beregn de fire naboverdiene; tell fire evalueringer.
2. Flytt til beste nabo hvis verdien er lavere enn nåværende verdi.
3. Hvis ingen er bedre, halver $\Delta$ uten å flytte.
4. Gjenta til en av stoppreglene slår inn.

**En runde uten forbedring.** Når vi senere står i $(3,2)$ med
$\Delta=1$, er den nåværende verdien 0. De fire naboverdiene er
$50$, $26$, $26$ og $10$ i samme rekkefølge som over. Ingen er
lavere enn 0, så vi beholder $(3,2)$ og halverer $\Delta$ til $1/2$.
Dette er en ny prøverunde, men ingen flytting.

I figuren er hver **nivåkurve** en linje av punkter med samme verdi
av $f$. Følg de aksepterte punktene på kartet øverst og verdiene deres
i grafen rett under.

```{pyodide-python}
#| label: week9-compass
# Rekkefølgen avgjør hvilken kandidat som vinner ved lik verdi.
directions = np.array([[1., 0.], [-1., 0.], [0., 1.], [0., -1.]])
z = np.array([0., 0.])
step = 1.
current = f9(z)
path = [z.copy()]
polls = 0
# Hver runde undersøker fire naboer, også når vi bare halverer steget.
# Stopp ved valgt oppløsning eller et øvre tak på antall runder.
while step >= 1/128 and polls < 100:
    # Beregn alle fire prøver før vi bestemmer oss.
    trials = z + step * directions
    values = np.array([f9(t) for t in trials])
    polls += 1
    best = np.argmin(values)
    if values[best] < current:
        # Bare aksepterte punkter føres opp i banen.
        z = trials[best].copy()
        current = values[best]
        path.append(z.copy())
    else:
        # Ingen forbedring på denne skalaen: bli stående og prøv mindre steg.
        step /= 2
path = np.array(path)
print('Første kompassrunde fra (0, 0), steglengde 1')
print(f'{"Nabo (x, y)":<16} {"Funksjonsverdi":>16}')
for trial in directions:
    neighbor = f'({trial[0]:g}, {trial[1]:g})'
    print(f'{neighbor:<16} {f9(trial):>16.0f}')
print('Resultat etter kompassøket')
print(f'  Sluttpunkt (x, y): ({z[0]:g}, {z[1]:g})')
print(f'  Funksjonsverdi:    {current:.6g}')
print(f'  Evalueringer i søket: {4*polls+1} (inkludert startpunktet)')
print(f'  Siste steglengde:  {step:g}')

xx, yy = np.meshgrid(np.linspace(-4, 4, 180), np.linspace(-4, 4, 180))
zz = (xx*xx + yy - 11)**2 + (xx + yy*yy - 7)**2
# Øverst: aksepterte punkt på nivåkurvene. Nederst: deres verdier.
fig, (ax_map, ax_value) = plt.subplots(2, 1, figsize=(6, 9),
                                       constrained_layout=True)
ax_map.contour(xx, yy, zz, levels=[1, 5, 20, 50, 100, 200],
               colors='#aab2bd')
ax_map.plot(path[:, 0], path[:, 1], 'o-', color='#bb4a37',
            markersize=4, label='kompass')
ax_map.plot(3, 2, 'k*', markersize=11, label='kjent nullpunkt')
ax_map.set(xlim=(-4, 4), ylim=(-4, 4), xlabel='x', ylabel='y',
           title='Aksepterte punkt på nivåkurvene')
ax_map.set_aspect('equal')
ax_map.legend()
# Verdiplottet teller bare flyttingene; halveringer gir ikke nye punkter.
ax_value.plot(np.arange(len(path)), [f9(t) for t in path], 'o-',
              color='#bb4a37', markersize=4)
ax_value.set(xlabel='Akseptert flytting', ylabel='f',
             title='Funksjonsverdi langs kompassbanen')
plt.show()
```

Banens siste punkt er $(3,2)$ med $f=0$. Selve søket bruker 53
evalueringer når startpunktet regnes med. Koden evaluerer dessuten
punkter på nytt for tabellen og grafen; de er ikke nye søkeprøver.
Figuren viser bare **aksepterte
punkter**: en halvering uten flytting lager ikke et nytt punkt på banen.
Det nederste panelet viser funksjonsverdien ved hver aksepterte flytting.
Her gir summen av kvadrater beviset på at sluttpunktet er globalt;
kompassøket alene gir ikke det beviset. Hvis fire prøver ikke gir
forbedring på én skala, kan andre punkter fremdeles være bedre.
Stoppgrensen for $\Delta$ er derfor en regel for oppløsning, ikke
for optimalitet.

<details class="reading-step">
<summary>Gå i dybden: valg som gir andre baner</summary>

Vi evaluerer alle fire naboer før vi flytter. En variant flytter til
første forbedring og kan bruke færre evalueringer, men følger en annen
bane. Vi kunne også prøve diagonale retninger. Ingen av variantene
utelukker at en lavere verdi finnes mellom prøvene eller i en annen
dal. Fra et annet startpunkt kan samme regel ende et annet sted.

</details>

## 9.3 Gradientmetoden: velg en retning

<div id="uke9-gradient"></div>

### Bruk helningen akkurat der vi står

Når vi kan derivere målfunksjonen, trenger vi ikke prøve alle
retningene for å finne en som peker lokalt nedover. Fra
[uke 8](uke8.qmd#uke8-gradient) kjenner vi **gradienten** $\nabla f$,
vektoren av partiellderiverte. Langs en valgt retning $p$ er den
**retningsderiverte** ved startpunktet $\nabla f(z)^Tp$.
Er dette tallet negativt, synker $f$ langs tilstrekkelig korte,
positive steg.

For vår funksjon setter vi $a=x^2+y-11$ og $b=x+y^2-7$.
Kjerneregelen gir

$$\nabla f(x,y)=\begin{pmatrix}4xa+2b\\2a+4yb\end{pmatrix}.$$

Velger vi $p=-\nabla f(z)$, blir starthelningen
$\nabla f(z)^Tp=-\|\nabla f(z)\|_2^2<0$ så lenge gradienten ikke er
null. **Negativ gradient er altså en lokal nedgangsretning.**
Metoden oppdaterer $z_{k+1}=z_k+\alpha_kp_k$ med en positiv faktor
$\alpha_k$. Produktet $\alpha_k\|p_k\|_2$ er lengden på steget.

### Et første steg med tall

Vi starter i $z_0=(0,0)$, der $f(z_0)=170$. Målet er å finne en
retning som peker nedover **lokalt**, velge en stegfaktor og så
kontrollere verdien i det nye punktet. Symbolene $a$ og $b$ er de to
parentesene som blir kvadrert i $f$; $p$ er søkeretningen, og
$\alpha$ bestemmer hvor langt vi går langs den.

| Trinn | Hva vi beregner | Resultat i origo | Hvorfor det trengs |
|:--|:--|:--|:--|
| 1. Finn parentesene | $a=x^2+y-11$, $b=x+y^2-7$ | $a=-11$, $b=-7$ | De inngår i gradientformelen. |
| 2. Finn gradienten | $\nabla f=(4xa+2b,\,2a+4yb)^T$ | $(-14,-22)^T$ | Den beskriver lokal endring. |
| 3. Velg retning | $p=-\nabla f(z_0)$ | $(14,22)^T$ | Negativ gradient peker lokalt nedover. |
| 4. Sjekk starthelningen | $\nabla f(z_0)^Tp$ | $-680$ | Negativt tall betyr nedgang ved korte positive steg. |
| 5. Prøv et kort steg | $z_1=z_0+\alpha p$, $\alpha=1/100$ | $(0{,}14,0{,}22)$ | Vi får et punkt der vi kan måle $f$. |
| 6. Kontroller verdien | $f(z_1)$ mot $f(z_0)$ | $162{,}18$ mot $170$ | Den faktiske verdien avgjør om steget hjalp. |

Et negativt tall i trinn 4 sier ikke hvor langt vi kan gå. Med
$\alpha=1$ blir punktet $(14,22)$ og $f(14,22)=283930$, som er
større enn startverdien. Derfor må vi kontrollere **selve** funksjonen
ved hvert foreslått steg.

<details class="reading-step">
<summary>Gå i dybden: regn ut det første gradientsteget</summary>

Ved $(0,0)$ får vi $a=0^2+0-11=-11$ og $b=0+0^2-7=-7$.
Gradientformelen gir første komponent $4\cdot0\cdot(-11)+2(-7)=-14$
og andre komponent $2(-11)+4\cdot0\cdot(-7)=-22$.
Med $p=(14,22)^T$ er starthelningen
$(-14,-22)\cdot(14,22)=-196-484=-680$.
Faktoren $1/100$ gir $z_1=(0,0)+(14,22)/100=(0{,}14,0{,}22)$.
Setter vi inn koordinatene i funksjonen, får vi

$$f(0{,}14,0{,}22)
=(0{,}14^2+0{,}22-11)^2+(0{,}14+0{,}22^2-7)^2
\approx162{,}1841.$$

</details>

I [uke 6](uke6.qmd#uke6-retning) kunne vi beregne en eksakt steglengde
for en SPD-kvadratisk energi ved hjelp av residualen $b-Ax$.
Denne funksjonen er ikke kvadratisk. Vi må prøve den faktiske
funksjonsverdien før vi godtar et steg.

## 9.4 Linjesøk: velg og kontroller steget

<div id="uke9-linjesok"></div>

Et **linjesøk** holder punktet $z$ og retningen $p$ fast, og prøver
stegfaktorer $\alpha>0$ i $f(z+\alpha p)$. Først bruker vi en test
som godtar tilstrekkelig nedgang. Deretter lar vi en numerisk rutine
søke etter en lav verdi på ett avgrenset intervall.

### Et lite linjesøk for hånd

Før vi vender tilbake til funksjonen av $x$ og $y$, kan vi se
forskjellen på **beste steg langs en linje** og **et godt nok steg**
med $q(t)=(t-2)^2$. Vi starter i $t_0=0$ og går i retning $p=1$.
Da er det nye punktet $t=0+\alpha\cdot1=\alpha$.
**Armijo-testen** sammenligner den faktiske funksjonsverdien etter et steg
med en grense for tilstrekkelig nedgang. Her krever vi minst $10^{-4}$
av nedgangen som starthelningen anslår; vi regner ut grensen i trinn 3.

1. Langs denne linjen er verdien $q(\alpha)=(\alpha-2)^2$.
2. Derivasjon gir $q'(\alpha)=2(\alpha-2)$. Setter vi denne lik null,
   får vi $\alpha=2$, punktet $t=2$ og $q(2)=0$. Siden $q$ er et
   kvadrat, er $q(t)\ge0$ for alle $t$. Derfor er dette **eksakt beste faktor**.
3. Armijo med faktor $10^{-4}$ ville allerede godta $\alpha=1$:
   startverdien er $q(0)=4$, starthelningen er $q'(0)=-4$, og
   $q(1)=1\le4+10^{-4}\cdot1\cdot(-4)=3{,}9996$.

Armijo krever altså tilstrekkelig nedgang, ikke det eksakt beste
steget. For ukens funksjon er verdien langs en retning mer komplisert;
vi prøver derfor faktorer og kontrollerer verdien numerisk.

### Eksperiment 3 – fast faktor eller halvering?

Vi sammenligner stegregler fra **samme startpunkt** for å se hvordan
steglengden påvirker banen. Les først de siste verdiene i utskriften.
Se så hvilke baner som blir liggende innenfor nivåkurvekartet og
hvordan verdiene utvikler seg i den nederste grafen. Ett godt
gradientsteg lover ikke at en fast faktor passer i alle iterasjoner.

Med **fast faktor** bruker vi samme $\alpha$ for alle gradientsteg.
Et **Armijo-søk** starter her med $\alpha=1$ og halverer til
funksjonsverdien synker tilstrekkelig mye:

$$f(z+\alpha p)\le f(z)+10^{-4}\alpha\nabla f(z)^Tp,
\qquad p=-\nabla f(z).$$

Siden skalarproduktet er negativt, krever høyresiden en reell,
men beskjeden nedgang. Testen søker ikke etter den beste steglengden.
Gradientmetoden med Armijo-steg stopper når $\|\nabla f\|_2<10^{-6}$ eller når
iterasjonsbudsjettet er brukt. **Gradientnormen** er lengden på
gradienten; liten norm er en stasjonaritetskontroll, ikke et bevis
for globalt minimum.

**Første linjesøk med tall.** Fra origo er $f(z)=170$, og
starthelningen $\nabla f(z)^Tp=-680$ er negativ. For hver faktor
$\alpha$ sammenligner vi den **faktiske** verdien i kandidatpunktet
med Armijo-testens høyreside. Et steg godtas når verdien ikke er
større enn høyresiden. Halveringen prøver faktorene i denne rekkefølgen:

| $\alpha$ | Faktisk $f(z+\alpha p)$ | Høyresiden i testen | Godtas? |
|:--|--:|--:|:--|
| $1$ | $283930$ | $169.932$ | Nei |
| $1/2$ | $17042$ | $169.966$ | Nei |
| $1/4$ | $761.125$ | $169.983$ | Nei |
| $1/8$ | $32.2578125$ | $169.9915$ | Ja |

Vi velger altså $\alpha=1/8$ for **dette** gradientsteget. Først
etter flyttingen beregner vi en ny gradient og starter et nytt linjesøk.

<details class="reading-step">
<summary>Gå i dybden: regn ut en Armijo-grense</summary>

For $\alpha=1/8$ blir høyresiden
$170+10^{-4}(1/8)(-680)=169{,}9915$.
Kandidatpunktet er $(0,0)+(1/8)(14,22)=(1{,}75,2{,}75)$;
der gir direkte innsetting $f=32{,}2578125$. Siden
$32{,}2578125\le169{,}9915$, godtar testen dette steget.

</details>

I figuren viser det øverste nivåkurvekartet
aksepterte punkter for $\alpha=0{,}02$ og halvering. Det nederste
panelet viser verdien per iterasjon på logaritmisk skala, også for
$\alpha=0{,}1$. Like store avstander på den loddrette aksen betyr
samme faktor: avstanden fra 1 til 0,1 er lik avstanden fra 0,1 til
0,01. Den siste banen skyter fort ut av kartets område. Verdier under
$10^{-15}$ vises ved en valgt nedre visningsgrense på $10^{-15}$.
Null kan ikke tegnes på en logaritmisk akse; små positive tall kan tegnes,
men får samme visningsgrense her. Utskriften viser de faktiske beregnede verdiene.

```{pyodide-python}
#| label: week9-gradient-steps
# Sammenlign to faste faktorer med samme start og iterasjonsbudsjett.
def fixed_steps(rate, n=40):
    z = np.array([0., 0.])
    # Ta med startverdien slik at første flytting får indeks 1 i grafen.
    history = [f9(z)]
    path = [z.copy()]
    for k in range(n):
        # Fast rate brukes uansett hvordan gradienten endres langs banen.
        candidate = z - rate*grad9(z)
        if not np.all(np.isfinite(candidate)) or np.linalg.norm(candidate) > 1e6:
            break  # Ikke-endelig kandidat eller valgt grense for tegningen.
        z = candidate
        history.append(f9(z))
        path.append(z.copy())
    return z, np.array(history), np.array(path)

# Velg faktoren på nytt i hver iterasjon ved Armijo-halvering.
def shrinking_steps(n=60):
    z = np.array([0., 0.])
    history = [f9(z)]
    path = [z.copy()]
    for k in range(n):
        g = grad9(z)
        # Liten gradientnorm er stoppregelen for dette forsøket.
        if np.linalg.norm(g) < 1e-6:
            break
        rate = 1.
        # Halver til den faktiske verdien oppfyller Armijo-kravet.
        # For p=-g er starthelningen g·p = -(g·g).
        while f9(z-rate*g) > f9(z) - 1e-4*rate*(g @ g):
            rate /= 2
        # Beregn ny gradient først i neste iterasjon, fra det nye punktet.
        z -= rate*g
        history.append(f9(z))
        path.append(z.copy())
    return z, np.array(history), np.array(path)

curves = {}
paths = {}
results = []
for rate in [0.02, 0.1]:
    end, values, points = fixed_steps(rate)
    curves[f'fast α={rate:g}'] = values
    if rate == 0.02:
        paths['fast α=0.02'] = points
    results.append((f'Fast α={rate:g}', len(values)-1,
                    values[-1], np.linalg.norm(grad9(end))))
end, values, points = shrinking_steps()
curves['halvering'] = values
paths['halvering'] = points
results.append(('Halvering', len(values)-1, values[-1],
                np.linalg.norm(grad9(end))))
# Skill mellom antall tegnede steg, funksjonsverdi og gradientnorm.
print(f'{"Stegregel":<16} {"Steg":>6} {"Siste f":>13} {"Gradientnorm":>15}')
for name, steps, final_value, gradient_norm in results:
    print(f'{name:<16} {steps:>6} {final_value:>13.3g} {gradient_norm:>15.3g}')
print(f'Halveringens sluttpunkt (x, y): ({end[0]:.6f}, {end[1]:.6f})')
# Panelene står under hverandre så bane og verdi kan sammenlignes.
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
    # Logaritmisk akse kan ikke tegne null; løft bare viste verdier under 1e-15.
    ax.semilogy(np.arange(len(values)), np.maximum(values, 1e-15),
                'o-', markersize=3, color=colors[name], label=name)
ax.set(xlabel='Iterasjonssteg', ylabel='f (logaritmisk skala)')
ax.legend()
fig.tight_layout(); plt.show()
```

Fra samme startpunkt gir $\alpha=0{,}02$ en verdi rundt
$1{,}46\cdot10^{-15}$ etter 40 steg. Med $\alpha=0{,}1$ vokser
verdiene raskt, og koden stopper tegningen ved en sikkerhetsgrense.
Halveringen finner et punkt nær $(3,2)$ med $f<10^{-14}$ og
gradientnorm under $10^{-6}$. Den nedre grafen teller også steg
som ikke får plass på kartet. Som i 9.2 er det sum-av-kvadrater-beviset,
ikke den lille gradientnormen, som bekrefter at verdi 0 er globalt best.

### Én linje er ikke hele planet

Her sammenligner vi et numerisk søk på **én fast linje** med
Armijo-steget over. Se på stegfaktoren, funksjonsverdien og antall
evalueringer i utskriften. Sammenlign deretter den deriverte langs
linjen med gradientnormen i hele planet: de måler ulike ting.

Med fast $z$ og $p$ undersøker vi funksjonen
$h(\alpha)=f(z+\alpha p)$ av ett tall.
Et avgrenset numerisk søk kan prøve flere $\alpha$-verdier langs denne
linjen. Det er et annet valg enn Armijo-halvering, som stopper så snart
tilstrekkelig nedgang er funnet. I koden søker `minimize_scalar`
i intervallet $0\le\alpha\le0{,}2$ fra origo langs negativ gradient.

```{pyodide-python}
#| label: week9-scalar-line-search
# Frys startpunkt og retning; dette er et søk i én variabel, α.
start = np.array([0., 0.])
direction = -grad9(start)
# Rutinen prøver faktorer bare innenfor det oppgitte intervallet.
line = minimize_scalar(lambda alpha: f9(start + alpha*direction),
                       bounds=(0., .2), method='bounded',
                       options={'xatol': 1e-10})
# Regn tilbake til et punkt i planet og mål om hele gradienten er liten.
line_point = start + line.x*direction
line_gradient = grad9(line_point)
print('Avgrenset søk langs negativ gradient fra origo')
print(f'  Stegfaktor α:          {line.x:.6f}')
print(f'  Punkt (x, y):         ({line_point[0]:.6f}, {line_point[1]:.6f})')
print(f'  Funksjonsverdi:       {f9(line_point):.6f}')
print(f'  Evalueringer:         {line.nfev}')
print(f'  Derivert langs linjen:{line_gradient @ direction:>11.3g}')
print(f'  Gradientnorm i planet:{np.linalg.norm(line_gradient):>10.3f}')
print(f'  Rutinen lyktes:       {line.success}')
```

Kallet gir omtrent $\alpha=0{,}127336$ og $f=32{,}126$, mot 170
ved start. Selv om den deriverte **langs linjen** er nær null, er
gradientnormen i planet rundt $36{,}2$. Ett linjesøk løser derfor
ikke hele todimensjonale problemet; neste iterasjon må beregne en ny
retning. `success=True` angir bare at rutinen oppfylte sine egne
stoppvilkår. Verdien er en numerisk minimumskandidat på det valgte
intervallet, ikke et bevis på den beste verdien langs hele linjen.

<div id="uke9-scipy"></div>

<details>
<summary>SciPy-oppslag: ett avgrenset linjesøk</summary>

| Uttrykk | Betydning |
|:--|:--|
| `minimize_scalar(h, bounds=(0., .2), method="bounded")` | Søk numerisk på valgt intervall, der `h(alpha)` returnerer ett tall. |
| `options={"xatol": 1e-10}` | Absolutt stopptoleranse for stegfaktoren $\alpha$, ikke en garantert feil i $f$. |
| `line.x`, `line.fun`, `line.nfev` | Valgt faktor, verdi langs linjen og antall evalueringer. |
| `line.success` | Om rutinen nådde sitt stoppvilkår, ikke et globalt optimalitetsbevis. |

Etter kallet kan vi regne ut $z+\alpha p$ og hele gradienten der.
En liten derivert langs én linje betyr ikke at hele gradienten er null.

</details>

<details class="reading-step">
<summary>Gå i dybden: hvorfor halveringen til slutt finner et steg</summary>

Sett $h(\alpha)=f(z+\alpha p)$ med $p=-\nabla f(z)$. Da er
$h'(0)=\nabla f(z)^Tp=-\|\nabla f(z)\|_2^2<0$ når gradienten
ikke er null. For en deriverbar funksjon er
$h(\alpha)=h(0)+\alpha h'(0)+o(\alpha)$ ved små positive $\alpha$.
Restleddet $o(\alpha)$ betyr at restleddet delt på $\alpha$ går mot null.
Siden Armijo bare krever $10^{-4}$ av den første lineære nedgangen,
vil tilstrekkelig små positive steg oppfylle testen. En stor fast
faktor har ingen tilsvarende garanti. Uten en nedgangsretning
($\nabla f(z)^Tp<0$) gjelder ikke dette argumentet.

</details>

## 9.5 Regneoppgaver

<div id="uke9-oppgaver"></div>

Oppgave 1 følger gittersøket, 2–3 kompassøket, og 4–6 gradient og
stegvalg. Regn uten kode først. Skriv eksakte hele tall eller brøker;
vektorer har én komponent i hver boks. Begrunnelser skriver du i
egne notater.

**Oppgave 1 – tell evalueringene.**

```{math-exercise}
#| label: week9-task-grid-count
#| caption: Oppgave 1 – tell evalueringene
#| mode: equivalent

Et gitter har 9 verdier i hver av de to koordinatene. Hvor mange
funksjonsverdier må beregnes?

Antall evalueringer: _[81]
```

**Oppgave 2 – første kompassrunde.**

```{math-exercise}
#| label: week9-task-compass-first
#| caption: Oppgave 2 – første kompassrunde
#| mode: equivalent

For $f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2$ starter du i $(0,0)$
med $\Delta=1$. Prøv de fire naboene $(1,0)$, $(-1,0)$,
$(0,1)$ og $(0,-1)$. Hva er verdien i punktet som velges hvis
første punkt vinner ved lik verdi?

Valgt funksjonsverdi: _[136]
```

**Oppgave 3 – halver uten å flytte.**

```{math-exercise}
#| label: week9-task-compass-shrink
#| caption: Oppgave 3 – halver uten å flytte
#| mode: equivalent
#| partial-credit: true
#| field-labels: første koordinat, andre koordinat, ny stegstørrelse

Et kompassøk står i $(3,2)$ med $\Delta=1/2$. Ingen av de fire
naboene gir lavere verdi. Oppgi punkt og steg etter regelen fra 9.2.

Nytt punkt: $x=$ _[3], $y=$ _[2] &nbsp; Ny $\Delta=$ _[1/4]
```

**Oppgave 4 – gradient og første steg.**

```{math-exercise}
#| label: week9-task-first-gradient-step
#| caption: Oppgave 4 – gradient og første steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: negativ gradients første komponent, negativ gradients andre komponent, nytt punkts første koordinat, nytt punkts andre koordinat

For $f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2$ er
$a=x^2+y-11$ og $b=x+y^2-7$. Gradientens komponenter er
$4xa+2b$ og $2a+4yb$. Fra $(0,0)$ finner du negativ gradient
og punktet etter et steg med $\alpha=1/100$.

$-\nabla f(0,0)=$ vec[14,22]

$z_1=$ vec[7/50,11/50]
```

**Oppgave 5 – test et steg.**

```{math-exercise}
#| label: week9-task-armijo
#| caption: Oppgave 5 – test et steg
#| mode: equivalent
#| partial-credit: true
#| field-labels: høyreside i Armijo-testen, steget godtas

Ved et punkt er $f(z)=10$ og $\nabla f(z)^Tp=-20$.
Vi prøver $\alpha=1/2$ med Armijo-faktor $10^{-4}$ og
måler $f(z+\alpha p)=9$. Regn ut høyresiden
$f(z)+10^{-4}\alpha\nabla f(z)^Tp$ som en brøk.
Skriv <strong>1 for ja, 0 for nei</strong> om steget godtas.

Høyreside: _[9999/1000] &nbsp; Godtas: _[1]
```

**Oppgave 6 – verdi og nedre grense.**

```{math-exercise}
#| label: week9-task-certificate
#| caption: Oppgave 6 – verdi og nedre grense
#| mode: equivalent
#| partial-credit: true
#| field-labels: funksjonsverdi ved punktet, global nedre grense

For $f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2$ på hele planet,
finn $f(3,2)$ og en global nedre grense som oppnås i dette punktet. Begrunn i egne notater
hvorfor disse to tallene viser at $(3,2)$ er et globalt minimumspunkt.

$f(3,2)=$ _[0] &nbsp; Nedre grense: _[0]
```

## 9.6 Python: prøv søkereglene

<div id="uke9-python"></div>

Fullfør én eller to linjer i hver oppgave. Hver celle har egne importer
og egne funksjonsdefinisjoner og kan kjøres uavhengig. Kontrollene
vurderer resultatet uten å vise løsningskode.

**Oppgave 1 – finn beste prøvde punkt.** Funksjonen er ferdig gitt;
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

**Oppgave 2 – én kompassrunde.** Returner den beste naboen dersom
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

**Oppgave 3 – godta eller halver.** Armijo-testen trenger verdien i
punktet, verdien i kandidaten og starthelningen langs retningen.
Returner den oppdaterte stegfaktoren; de andre beregningene er gitt.

```{py-exercise}
#| label: week9-python-armijo-step
#| caption: Test én stegfaktor mot Armijo-kravet
#| show-test-hints: false
import numpy as np

# Samme test som i 9.4, men med tall gitt direkte som argumenter.
def accept_or_halve(start_value, candidate_value, slope, alpha):
    threshold = start_value + 1e-4 * alpha * slope
    if candidate_value <= threshold:
        # TODO: Godkjenn stegfaktoren.
        return None
    # TODO: Halver stegfaktoren.
    return None

## TESTS ##
assert np.isclose(accept_or_halve(10., 9., -20., .5), .5)
assert np.isclose(accept_or_halve(10., 10., -20., .5), .25)
assert np.isclose(accept_or_halve(8., 7.999, -10., 1.), 1.)
assert np.isclose(accept_or_halve(8., 8.1, -10., 1.), .5)
```

Neste uke bruker vi [Hessianen](uke10.qmd#uke10-likning) til å
forme retningen etter lokal krumning. Vi må fortsatt undersøke
funksjonsverdien før et helt steg godtas.

:::
