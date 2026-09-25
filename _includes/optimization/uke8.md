<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 8.0 Oversikt

<div id="uke8-start"></div>

### Fra et likningssystem til et valg

I [uke 6](uke6.qmd#uke6-energi) fant vi løsningen av et lineært
system ved å minimere en kvadratisk funksjon. Nå skal vi undersøke
problemer der funksjonen kan ha flere bunner, og der noen valg er
utelukket av begrensninger. Før vi velger en regnemetode, må vi vite
hva vi mener med en løsning og hvordan vi kan kontrollere den.

Fire spørsmål følger oss gjennom hele optimeringsdelen:

- **Hva er problemet?** Vi må velge en målfunksjon og angi hvilke punkter som er tillatt.
- **Finnes det en beste verdi?** En følge av stadig bedre svar trenger ikke å nå et minimum.
- **Hvordan finner vi en kandidat?** En numerisk metode undersøker bare en del av området.
- **Hvorfor er kandidaten best?** Vi trenger en matematisk begrunnelse for å gå fra et lovende tall til en garanti.

Denne uken bygger vi begrepene som trengs for å svare. Først lager vi
en modell. Deretter bruker vi deriverte til å undersøke punkter nær en
kandidat. Til slutt ser vi hvilke egenskaper ved hele området og
funksjonen som sikrer at et minimum finnes, og at et lokalt minimum
også er globalt. Regneoppgavene i 8.5 følger eksemplene i teksten.
All Python, et sammenfoldet SciPy-oppslag og kodeoppgaver ligger i 8.6;
figurene og resultatene i hovedteksten kan leses uten å kjøre kode.
**Forelesning** viser hovedløpet; **Gå i dybden** åpner
lengre begrunnelser og mellomregninger.

I [uke 9](uke9.qmd) utvikler vi søkemetoder, og i [uke 10](uke10.qmd)
bruker vi andrederiverte til å velge bedre steg. [Uke 11](uke11.qmd)
og [uke 12](uke12.qmd) handler om hvordan begrensninger endrer både
søket og begrunnelsen for at et svar er optimalt.

### Læringsmål

Etter denne uka skal du kunne

- formulere en målfunksjon og et tillatt område, og skille minimumspunkt fra minimumsverdi,
- bruke gradient og Hessian til å undersøke et kritisk punkt,
- skille infimum fra minimum og bruke ekstremalverdisetningen til å vise at ekstremalverdier finnes,
- undersøke konveksitet og forklare når et lokalt minimum også er globalt,
- bruke `minimize` i SciPy og kontrollere punkt, funksjonsverdi og gradient i svaret.

## 8.1 Modell, valg og tillatt område

<div id="uke8-modell"></div>

Et **optimeringsproblem** ber oss finne det beste tillatte valget.
Valgene samles i en vektor $z=(z_1,\ldots,z_n)^T$, og
**målfunksjonen** $f(z)$ er tallet vi vil gjøre minst eller størst.
Det **tillatte området** $D$ er mengden av valg som oppfyller alle
kravene, også kalt **bibetingelser**. Et punkt i $D$ er et tillatt punkt.

Notasjonen

$$\min_{z\in D} f(z)$$

betyr at vi søker en **minimumsverdi** blant punktene i $D$.
Et punkt $z_*$ som oppnår verdien, er et **minimumspunkt**;
selve tallet er $f(z_*)$. Vi skriver ofte at vi «finner minimum»,
men må holde disse to størrelsene fra hverandre. Å maksimere $f$ er
det samme som å minimere $-f$: de samme punktene blir best.

### Eksperiment 1 – lønner det seg å bruke alle ressursene?

Fire studenter driver et lite dataverksted. De skal velge hvor mange
nye datamaskiner de bygger, og hvor mange gamle de reparerer **denne uken**.
De har kjøpt inn 100 komponenter som skal hentes hos grossisten,
og har til sammen 50 arbeidstimer til bygging og reparasjon.
Vi bruker følgende forenklede modell:

| Arbeid | Komponenter per maskin | Timer per maskin | Overskudd per maskin |
|:--|--:|--:|--:|
| Bygge en ny maskin | 10 | 1 | 500 kr |
| Reparere en gammel maskin | 1 | 3 | 250 kr |

Overskuddene i tabellen er inntekter minus kostnader per maskin.
I tillegg har studentene allerede avtalt en reise til grossisten
for å hente komponentene. **Denne innkjøpsreisen koster 650 kr totalt,
uansett hvor mange maskiner de velger å arbeide med.** Kostnaden er
ikke trukket fra i tabellen. Vi antar at de får solgt alt de bygger,
og har nok reparasjonsoppdrag.

La $b$ være antall nye maskiner og $r$ antall reparasjoner. Vi vil
**maksimere** ukens nettooverskudd

$$P(b,r)=500b+250r-650.$$

En produksjonsplan må oppfylle

$$10b+r\le100\quad\text{(komponenter)},\qquad
b+3r\le50\quad\text{(arbeidstimer)},$$

og $b,r$ må være ikke-negative heltall. Samlet kan vi skrive området som

$$D=\{(b,r)\in\mathbb Z_{\ge0}^2:10b+r\le100,\ b+3r\le50\}.$$

Her betyr $\in$ «er med i», og $\mathbb Z_{\ge0}$ er de ikke-negative
heltallene. Krøllparentesene samler alle par som oppfyller kravene.

Det er få nok muligheter til at vi kan regne ut overskuddet for **alle**
tillatte heltallspar. Figuren viser resultatet av denne opptellingen;
[koden står i 8.6](#uke8-python-production).

![Hvert punkt er en tillatt produksjonsplan. Fargen viser nettooverskuddet; stjernen markerer planen med størst overskudd.](../assets/optimization/week8-production.svg){width=620}

Det beste valget er $(b,r)=(8,14)$, med
$P(8,14)=6850$ kr. Planen bruker $10\cdot8+14=94$ komponenter og
$8+3\cdot14=50$ timer. Det lønner seg altså ikke nødvendigvis å bruke
opp begge ressursene. **Maksimumpunktet** er produksjonsplanen $(8,14)$;
**maksimalverdien** er overskuddet 6850 kr.

Et svar med for eksempel $b=8.62$ er ingen produksjonsplan: vi kan
ikke bygge en brøkdel av en maskin i denne modellen. Den faste
reisekostnaden endrer overskuddet, men ikke hvilken plan som er best,
siden alle planer får samme fratrekk.

### Lokalt og globalt svarer på forskjellige spørsmål

Et tillatt punkt $z_*$ er et **globalt minimumspunkt** når
$f(z_*)\le f(z)$ for alle $z\in D$. Det er et **lokalt minimumspunkt**
når ulikheten gjelder for alle tillatte punkter tilstrekkelig nær
$z_*$. «Nær» betyr liten avstand $\|z-z_*\|_2$, med den vanlige
vektorlengden fra [uke 4](uke4.qmd). Et minimum er **strengt** når
ulikheten er streng for andre punkter i området vi sammenligner med.
For maksimum snur vi ulikhetene. **Ekstremum** er en fellesbetegnelse
for minimum og maksimum; **optimalt** betyr best for det valgte målet.

I produksjonsforsøket fant vi et globalt maksimum fordi vi undersøkte
*alle* tillatte heltallspar. For reelle variabler er det som regel
uendelig mange punkter, så den framgangsmåten er ikke tilgjengelig.
Et lokalt søk kan da finne en dalbunn uten å oppdage en dypere dal.

Et tall $L$ er en **nedre grense** dersom $L\le f(z)$ for alle tillatte
$z$; en **øvre grense** defineres med motsatt ulikhet. Hvis et tillatt
punkt oppnår en slik grense, har vi et bevis på at verdien er globalt
best. Denne ideen kommer igjen i alle ukene, særlig som **dualitet**
i uke 11. Vi skal først se den i en enkel sum av ikke-negative ledd.

Heltallsvalg kan ikke endres med vilkårlig små steg. Faktisk blir hvert
isolert heltallspunkt et lokalt optimum etter definisjonen over, fordi
et lite nok område ikke inneholder andre tillatte punkter. Derfor
handler derivasjonstestene i neste avsnitt om **reelle variabler**.

<details class="reading-step">
<summary>Gå i dybden: hva skjer hvis vi tillater brøkdeler av maskiner?</summary>

Hvis $b,r$ tillates å være reelle, blir det tillatte området en mangekant med kantene inkludert. Denne utvidelsen kalles en **relaksasjon**: vi tillater flere valg, så beste overskudd kan bare øke. $P$ er **affin**, altså lineær pluss en konstant. På en slik mangekant oppnår en affin funksjon et maksimum i minst ett hjørne; langs en kant varierer den lineært og kan også være konstant. I [uke 11](uke11.qmd#uke11-modell) utvikler vi denne hjørnemetoden. Sammenligning av hjørnene gir skjæringen mellom ressursgrensene: $b=250/29$ og $r=400/29$, med $P=225000/29-650\approx7108.62$ kr. Dette er en **øvre grense** for heltallsproblemet, ikke en gjennomførbar produksjonsplan. Punktet $(8,14)$ bruker $10\cdot8+14=94$ komponenter og $8+3\cdot14=50$ timer.

</details>

## 8.2 Kritiske punkter er kandidater

<div id="uke8-lokalt"></div>

For å undersøke en dalbunn trenger vi å beskrive hvordan funksjonen
endrer seg når vi flytter et punkt litt. Vi repeterer derfor den
flerdimensjonale derivasjonen fra [uke 6](uke6.qmd#uke6-retning).

<div id="uke8-gradient"></div>

### Gradient: endring i en valgt retning

For $f(u,v)$ er den **partiellderiverte** $\partial f/\partial u$
deriverten når $u$ endres og $v$ holdes fast. De to partiellderiverte
samles i **gradienten**

$$\nabla f(z)=\begin{pmatrix}\partial f/\partial u\\
\partial f/\partial v\end{pmatrix},\qquad z=(u,v)^T.$$

For et lite steg $h$ er endringen omtrent
$f(z+h)-f(z)\approx\nabla f(z)^Th$. Produktet er det vanlige
indreproduktet: hver koordinatendring multipliseres med sin helning.
Langs en bestemt retning $p$ er den deriverte med hensyn på
stegparameteren $t$

$$\left.\frac{d}{dt}f(z+tp)\right|_{t=0}=\nabla f(z)^Tp.$$

Dette følger av kjerneregelen og kalles den **retningsderiverte langs
$p$**; dersom $p$ har lengde 1, måler den endring per lengdeenhet.
Når produktet er negativt, senker tilstrekkelig små positive steg
funksjonen. Retningen $-\nabla f(z)$ har denne egenskapen så lenge
gradienten ikke er null. Vi bruker den til å bygge en metode i uke 9.

Et **indre punkt** i $D$ har et lite område rundt seg der alle punkter
er tillatt. Et **randpunkt** ligger på grensen mellom tillatte og
utelukkede valg. Ved et indre lokalt minimum kan vi bevege oss litt i
begge fortegn langs hver koordinat. Da må alle partiellderiverte være
null. Et punkt med $\nabla f(z)=0$ kalles **stasjonært**, eller
**kritisk** i våre deriverbare problemer. Dette er en **nødvendig
betingelse**: alle slike minima må oppfylle den. Det er ennå ikke en
**tilstrekkelig betingelse**, altså noe som alene garanterer minimum.

### Eksperiment 2 – to starter, to svar

Vi minimerer nå en kostnadsfunksjon med to reelle innstillinger $x,y$. Den er **glatt**: de deriverte vi trenger finnes og varierer kontinuerlig, uten sprang:

$$f(x,y)=20+x^2+y^2-10\bigl(\cos(2\pi x)+\cos(2\pi y)\bigr).$$

Kvadratleddene gjør store innstillinger kostbare; cosinusleddene gir flere
små daler. Vi lar en lokal søkemetode prøve to startpunkter. Metoden
flytter punktet for å senke funksjonsverdien, men undersøker ikke
hele planet. [SciPy-koden står i 8.6](#uke8-python-local).

| Startpunkt | Punktet søket finner, avrundet | Funksjonsverdi, avrundet |
|:--|:--|--:|
| $(0,0)$ | $(0,0)$ | $0$ |
| $(2,2)$ | $(1.9899,1.9899)$ | $7.9597$ |

En **nivåkurve** forbinder punkter med samme funksjonsverdi.
Kurvene i figuren omringer flere dalbunner. De to søkene ender i
forskjellige daler, selv om de bruker samme metode.

![Nivåkurver for den bølgede funksjonen. Markeringene viser startpunktene og punktene de to søkene finner. Et lokalt søk trenger ikke finne den dypeste dalen.](../assets/optimization/week8-local-minima.svg){width=620}

Begge svarene har nesten null gradient. Lengden
$\|\nabla f\|_2$, **gradientnormen**, er rundt $10^{-6}$ ved det
andre svaret. Små deriverte skiller altså ikke den beste dalen fra
en dårligere dal. Andrederivertene nedenfor hjelper oss å skille en dalbunn fra et
sadelpunkt.

Her kan vi også begrunne hvilket svar som er **globalt** best.
Skriv funksjonen som

$$f(x,y)=x^2+y^2+10(1-\cos(2\pi x))+10(1-\cos(2\pi y)).$$

Alle fire ledd er ikke-negative. Dermed er $f(x,y)\ge0$ overalt,
og $(0,0)$ oppnår verdien 0. Dette er beviset på globalt minimum;
de to numeriske søkene alene ville ikke gitt en slik garanti.

<div id="uke8-hessian"></div>

### Hessian: hvilken vei krummer funksjonen?

Den andrederiverte forteller om en kurve bøyer opp eller ned. For to
variabler samler vi alle andre partiellderiverte i **Hessianmatrisen**:

$$H_f(z)=\nabla^2 f(z)=
\begin{pmatrix}
\dfrac{\partial^2 f}{\partial u^2} & \dfrac{\partial^2 f}{\partial u\partial v}\\[6pt]
\dfrac{\partial^2 f}{\partial v\partial u} & \dfrac{\partial^2 f}{\partial v^2}
\end{pmatrix}.$$

Diagonalene beskriver krumning når én koordinat endres. De blandede
partiellderiverte beskriver hvordan helningen i én koordinat endres
når den andre endres. Når de andrederiverte er kontinuerlige
(skrevet $f\in C^2$), er de blandede deriverte like, så Hessianen er
symmetrisk. I $n$ variabler er den en $n\times n$-matrise.

Hessianen inngår i en **lokal kvadratisk modell**, Taylor-tilnærmingen:

$$f(z+h)\approx f(z)+\nabla f(z)^Th+\tfrac12 h^TH_f(z)h.$$

Her er $h$ en liten endring i punktet, første ledd er verdien vi
starter fra, andre ledd anslår endringen ved hjelp av gradienten, og siste
ledd tar med krumningen. Ved et stasjonært punkt er det lineære leddet
null; da er fortegnet til $h^TH_f(z)h$ avgjørende for andrederiverttesten.

Fra [uke 5](uke5.qmd) og [uke 6](uke6.qmd#uke6-energi) kjenner vi
følgende egenskaper for symmetriske matriser:

| Egenskap | Hva betyr den for alle vektorer $h\ne0$? | Egenverdier |
|:--|:--|:--|
| Positiv definit | $h^THh>0$ | Alle er positive |
| Positiv semidefinit | $h^THh\ge0$ | Alle er ikke-negative |
| Negativ definit | $h^THh<0$ | Alle er negative |
| Negativ semidefinit | $h^THh\le0$ | Alle er ikke-positive |
| Indefinit | Uttrykket er positivt for noen $h$ og negativt for andre | Begge fortegn finnes |

**SPD** forkorter «symmetrisk positiv definit». I et stasjonært
indre punkt gir positiv definit Hessian et **strengt lokalt minimum**;
negativ definit gir et strengt lokalt maksimum. En indefinit Hessian
gir et **sadelpunkt**: det finnes både høyere og lavere funksjonsverdier
vilkårlig nær punktet. En semidefinit Hessian med en null egenverdi
avgjør ikke typen. For eksempel har både $u^4$ og $-u^4$
andrederivert null i origo, men den ene har minimum og den andre maksimum.

**Tre enkle eksempler ved origo.** Alle har gradient null der.
Notasjonen $\operatorname{diag}(a,b)$ betyr en diagonalmatrise med $a,b$
på diagonalen og null ellers:

| Funksjon | Hessian | Hva skjer når vi går bort fra origo? |
|:--|:--|:--|
| $u^2+v^2$ | $\operatorname{diag}(2,2)$ | Verdien øker i alle retninger: strengt minimum. |
| $-u^2-v^2$ | $\operatorname{diag}(-2,-2)$ | Verdien avtar i alle retninger: strengt maksimum. |
| $u^2-v^2$ | $\operatorname{diag}(2,-2)$ | Verdien øker langs $u$-aksen og avtar langs $v$-aksen: sadelpunkt. |

I disse eksemplene er minimum og maksimum
også globale; andrederiverttesten alene gir bare en lokal konklusjon.

Den kvadratiske funksjonen fra uke 6 var
$\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v$.
Direkte derivasjon gir

$$\nabla\phi(u,v)=\begin{pmatrix}3u+v-5\\u+2v-5\end{pmatrix},
\qquad H_\phi=\begin{pmatrix}3&1\\1&2\end{pmatrix}=A.$$

Hessianen er altså nettopp systemmatrisen. Taylor-modellen er eksakt
for denne funksjonen. For den bølgede funksjonen varierer Hessianen
med punktet, og modellen er bare en lokal tilnærming. Det er dette
skillet vi bygger Newtons metode på i uke 10.

Testen krever et **indre** punkt. Minimum av $f(x)=x$ på $[0,1]$
ligger ved randen $x=0$, selv om den deriverte er 1. Der er alle små
*tillatte* bevegelser mot høyre. I uke 11–12 må vi derfor kombinere
informasjon om funksjonen med informasjon om hvilke bevegelser
begrensningene tillater.

<details class="reading-step">
<summary>Gå i dybden: nødvendige og tilstrekkelige lokale tester</summary>

Ved et indre lokalt minimum kan vi gå både fram og tilbake langs hver koordinat uten å forlate området. Den endimensjonale derivasjonstesten gir derfor alle partiellderiverte lik null. For en to ganger kontinuerlig deriverbar funksjon gjelder dessuten $v^TH_f(x_*)v\ge0$ for enhver retning $v$: Hessian er **positiv semidefinit**, en nødvendig betingelse som tillater null egenverdier. I et kritisk punkt er positiv **definit** Hessian en tilstrekkelig betingelse for strengt lokalt minimum. Null egenverdi i en semidefinit Hessian avgjør ingenting: $x^4$ har lokalt minimum ved null, mens $-x^4$ har lokalt maksimum der; begge har andrederivert null. Dette er den generelle utvidelsen av den [positive definite kvadratiske funksjonen fra uke 6](uke6.qmd#uke6-energi).

For den bølgede funksjonen er $H_f(x,y)=\operatorname{diag}(2+40\pi^2\cos(2\pi x),2+40\pi^2\cos(2\pi y))$. Begge diagonalverdiene er positive nær $(1.9899,1.9899)$. Dette stemmer med at søket er nær et lokalt minimum, men den avrundede vektoren er ikke et eksakt stasjonært punkt. For den eksakte påstanden må vi først finne et punkt med gradient nøyaktig null, og deretter bruke den positive definite Hessianen. Den beregnede verdien nær 7.96 kan uansett ikke være globalt best, siden origo gir verdi 0. Ved $f(x,y)=x^2-y^2$ er gradienten null i origo, men Hessian har egenverdiene $2$ og $-2$: et sadelpunkt.

</details>

## 8.3 Kompakthet og eksistens

<div id="uke8-kompakt"></div>

Vi har sett hvordan vi kan undersøke et mulig minimum. Nå tar vi et
skritt tilbake: **finnes det et minimumspunkt i det hele tatt?**
Det avhenger både av funksjonen og av hvilke punkter som er tillatt.

### Eksperiment 3 – stadig mindre, men aldri minst

Vi vil minimere $g(x)=x$ på intervallet $(0,1)$. Runde parenteser
betyr at endepunktene ikke er med. Prøver vi jevnt fordelte punkter
inne i intervallet, får vi følgende resultater:

| Punkter vi prøver | Minste verdi blant de prøvde punktene |
|:--|--:|
| $0.1,0.2,\ldots,0.9$ | $0.1$ |
| $0.01,0.02,\ldots,0.99$ | $0.01$ |
| $0.001,0.002,\ldots,0.999$ | $0.001$ |

[Koden i 8.6](#uke8-python-domain) lager tabellen. Hver rad har en
minste verdi, men ingen av dem er et minimum på **hele** $(0,1)$.
For ethvert tillatt $x$ er også $x/2$ tillatt, og $g(x/2)<g(x)$.
Vi kan derfor alltid gjøre svaret bedre. Grensen 0 er ikke tillatt.

På $[0,1]$ er situasjonen annerledes. Hakeparentesene betyr at
endepunktene er med; nå er $x=0$ et minimumspunkt og 0 minimumsverdien.

### Infimum er en grense; minimum må oppnås

Tallet 0 er en nedre grense for $g(x)=x$ på $(0,1)$: alle
funksjonsverdiene er større enn 0. Tall som $-1$ er også nedre grenser,
men 0 er den **største** av dem. Denne største nedre grensen kalles
**infimum**, skrevet $\inf$. Tilsvarende er **supremum**, skrevet
$\sup$, den minste øvre grensen.

| Område for $g(x)=x$ | Infimum | Oppnås det som minimum? | Supremum | Oppnås det som maksimum? |
|:--|--:|:--|--:|:--|
| $(0,1)$ | $0$ | Nei | $1$ | Nei |
| $(0,1]$ | $0$ | Nei | $1$ | Ja, ved $x=1$ |
| $[0,1]$ | $0$ | Ja, ved $x=0$ | $1$ | Ja, ved $x=1$ |

Funksjonen er den samme i alle radene. Bare tillatte endepunkter er
endret. Et finere rutenett kan ikke gjøre et utelatt endepunkt tillatt.

### Lukket og begrenset: to forskjellige krav

En mengde er **lukket** når den inneholder alle grenseverdier av
punktfølger fra mengden. En punktfølge er en liste $x_1,x_2,\ldots$.
For eksempel ligger $x_n=1/(n+1)$ i $(0,1)$ og nærmer seg 0.
Siden 0 mangler, er $(0,1)$ ikke lukket. Intervallet $[0,1]$ er lukket:
slike grenser blir innenfor intervallet, inkludert endepunktene.

En mengde er **begrenset** når alle punktene får plass innenfor en
endelig avstand fra origo. Intervallet $[0,1]$ er begrenset.
Halvlinjen $[0,\infty)$ er lukket, men ikke begrenset: den inneholder
vilkårlig store tall.

I $\mathbb R^n$ betyr **kompakt** nettopp *lukket og begrenset*.

| Mengde | Lukket? | Begrenset? | Kompakt? |
|:--|:--|:--|:--|
| $[0,1]$ | Ja | Ja | Ja |
| $(0,1)$ | Nei | Ja | Nei |
| $[0,\infty)$ | Ja | Nei | Nei |
| Skiven $u^2+v^2\le1$, med kanten | Ja | Ja | Ja |
| Bare sirkelranden $u^2+v^2=1$ | Ja | Ja | Ja |

De to siste radene viser at en kompakt mengde ikke trenger å være
et intervall eller å inneholde noe areal. Skiven inneholder hele
innsiden; sirkelranden inneholder bare punktene i avstand 1 fra origo.

### Når kan vi garantere minimum og maksimum?

En funksjon er **kontinuerlig** når funksjonsverdiene nærmer seg
$f(x)$ hver gang punktene nærmer seg $x$ innenfor området. Det betyr
at verdien ikke gjør et sprang i grensen. Funksjonene $x$, $x^2$ og
polynomet $\phi$ fra uke 6 er kontinuerlige.

**Ekstremalverdisetningen.** En kontinuerlig funksjon på en ikke-tom,
kompakt mengde oppnår både minimum og maksimum.

Bruk setningen ved å kontrollere **området** og **funksjonen** hver
for seg. For $f(u,v)=u^2+v^2$ på skiven $u^2+v^2\le1$ er området
kompakt og funksjonen kontinuerlig. Begge ekstremalverdier finnes.
Her ser vi også hvilke de er: minimum 0 i origo, maksimum 1 på hele
sirkelranden. Setningen garanterer ikke at punktet er entydig.

For produksjonsmodellen i 8.1 er det bare endelig mange tillatte
punkter. Da kan vi finne størst og minst ved å sammenligne alle
verdiene, slik opptellingen gjorde. Ekstremalverdisetningen gir en
garanti også når vi ikke kan telle punktene.

**Garantien er tilstrekkelig, ikke nødvendig.** På hele $\mathbb R$
er området ikke kompakt. Likevel har $x^2$ minimum 0 ved $x=0$.
Derimot har $f(x)=x$ verken minimum eller maksimum på $\mathbb R$.
Når kravene i setningen ikke er oppfylt, må vi undersøke problemet
på annen måte. Setningen sier heller ikke hvordan et søk finner minimum.

<details class="reading-step">
<summary>Gå i dybden: hvorfor trenger vi også kontinuitet?</summary>

Selv på det kompakte intervallet $[0,1]$ kan minimum mangle hvis
funksjonen gjør et sprang. Betrakt

$$h(x)=\begin{cases}1,&x=0,\\x,&0<x\le1.\end{cases}$$

Vi har $h(1/n)=1/n\to0$, men $h(0)=1$. Funksjonen er derfor ikke
kontinuerlig i 0. Infimum er 0, men ingen tillatt $x$ gir $h(x)=0$.
Å inkludere endepunktet i området er altså ikke nok; funksjonsverdien
må også passe med grensen.

Intuisjonen bak setningen er nå: begrensning hindrer punktene i å
forsvinne uendelig langt bort, lukkethet beholder grensepunktene,
og kontinuitet sørger for at funksjonsverdien følger med i grensen.

</details>

## 8.4 Konveksitet gir en global garanti

<div id="uke8-konveks"></div>

Kompakthet og kontinuitet hjelper oss å vise at et minimum **finnes**.
De utelukker ikke flere daler. Nå undersøker vi en annen egenskap,
**konveksitet**, som kan gjøre en lokal konklusjon global. Vi må
skille mellom konveksitet av et **område** og av en **funksjon**.

### Et konvekst område inneholder forbindelsen mellom punktene

Velg to punkter $a,b$ i området. Kan vi gå rett fra det ene til det
andre uten å forlate området? Hvis svaret er ja for **alle** slike
punktpar, er området konvekst. Matematisk betyr dette

$$ta+(1-t)b\in D\qquad\text{når }a,b\in D,\quad 0\le t\le1.$$

Når $t$ går fra 0 til 1, går uttrykket langs linjestykket fra $b$
til $a$. Ved $t=1/2$ får vi midtpunktet $(a+b)/2$.

- Intervallet $[0,1]$ er konvekst: tall mellom to tillatte tall er også tillatt.
- Skiven $u^2+v^2\le1$ er konveks: rette linjestykker mellom punkter i skiven holder seg i skiven.
- Sirkelranden $u^2+v^2=1$ er **ikke** konveks. Punktene $(1,0)$ og $(-1,0)$ er med, men midtpunktet $(0,0)$ er ikke med.
- Heltallspunktene i produksjonsmodellen er ikke konvekse: $(0,0)$ og $(1,0)$ er tillatt, men midtpunktet $(1/2,0)$ er ikke et heltallsvalg.

Både skiven og sirkelranden er kompakte, men bare skiven er konveks.
Hele $\mathbb R$ er konveks, men ikke kompakt. **Kompakt** og
**konveks** er altså to ulike egenskaper.

### Eksperiment 4 – funksjonsverdien mellom to punkter

For $f(x)=x^2$ velger vi $a=-1$, $b=1$. I midtpunktet er verdien
$f(0)=0$, mens gjennomsnittet av endeverdiene er
$(f(-1)+f(1))/2=1$. Grafen ligger under den rette forbindelsen
mellom disse to punktene på grafen.

For den bølgede funksjonen fra 8.2 velger vi i stedet $a=(0,0)$ og
$b=(1,0)$. Nå får vi

$$f((a+b)/2)=20.25>\frac{f(a)+f(b)}2=0.5.$$

Mellom endepunktene kommer det en topp. Disse to beregningene viser
hva konveksitetstesten leter etter.

![Øverst ligger grafen til x² under linjen mellom endeverdiene. Nederst ligger den bølgede funksjonen, langs y=0, over denne linjen ved midtpunktet.](../assets/optimization/week8-convex-midpoints.svg){width=620}

En funksjon på et konvekst område er **konveks** når

$$f(ta+(1-t)b)\le t f(a)+(1-t)f(b)
\qquad\text{for alle }a,b\in D,\quad 0\le t\le1.$$

Venstresiden er funksjonsverdien i punktet mellom $a$ og $b$.
Høyresiden er høyden på den rette forbindelsen mellom endeverdiene.
Ved $t=1/2$ er denne høyden det vanlige gjennomsnittet.

For $x^2$ gjelder ulikheten for alle punktpar; se utregningen under
«Gå i dybden». Den bølgede funksjonen er ikke konveks, siden allerede
**ett** punktpar bryter kravet. Omvendt er én vellykket sammenligning
ikke et bevis på konveksitet. [Koden i 8.6](#uke8-python-convex)
gjengir sammenligningene og figuren.

### Konveks er ikke det samme som strengt konveks

Funksjonen $f(x)=x$ er konveks: grafen er selv en rett linje, så vi
får likhet i testen. Også den konstante funksjonen $f(x)=0$ er konveks.
På $[0,1]$ har sistnevnte minimum i **alle** punkter.

En funksjon er **strengt konveks** når ulikheten er streng for
$a\ne b$ og $0<t<1$. Funksjonen $x^2$ er strengt konveks på
$\mathbb R$. Streng konveksitet innebærer at det finnes **høyst ett**
minimumspunkt. Ellers ville punktet mellom to minimumspunkter gitt
en enda mindre verdi.

«Høyst ett» betyr ikke «ett»: $x^2$ er også strengt konveks på $(0,1)$,
men der finnes ikke noe minimum. Dette er samme problem med et
utelatt endepunkt som i 8.3.

### Hessianen kan kontrollere alle punktene på én gang

For en funksjon med kontinuerlige andrederiverte på et åpent,
konvekst område kan vi bruke følgende tester. **Åpent** betyr her
at hvert punkt er et indre punkt; $\mathbb R^n$ er et eksempel.

| Hessianen i hele området | Konklusjon |
|:--|:--|
| Positiv semidefinit overalt | Funksjonen er konveks. |
| Positiv definit overalt | Funksjonen er strengt konveks. |

Dette er tester i **alle** punkter, ikke bare ved én kandidat som
i den lokale andrederiverttesten i 8.2.

**Eksempel: en dal med flat bunn.** For $f(u,v)=u^2$ er
$H_f=\operatorname{diag}(2,0)$ overalt. Hessianen er positiv
semidefinit, og funksjonen er konveks. Den er ikke strengt konveks:
langs linjen $u=0$ er verdien konstant lik 0. Alle punktene
$(0,v)$ er globale minimumspunkter. En null egenverdi betyr at
denne Hessiantesten ikke kan garantere *streng* konveksitet.

**Eksempel: skålen fra uke 6.** For
$\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v$ er Hessianen

$$H_\phi=\begin{pmatrix}3&1\\1&2\end{pmatrix}$$

overalt. Den har positive egenverdier $(5-\sqrt5)/2$ og
$(5+\sqrt5)/2$, så funksjonen er strengt konveks. Vi fant allerede
$\nabla\phi(1,2)=0$. Punktet $(1,2)$ er et lokalt minimum etter
testen i 8.2. Neste regel viser at det også er det entydige globale
minimumet, akkurat som i uke 6.

### Fra lokalt til globalt

**På et konvekst område er ethvert lokalt minimum av en konveks
funksjon også globalt.** Hvis funksjonen dessuten er strengt konveks,
er dette minimumspunktet entydig. Et bevis står under «Gå i dybden».

For deriverbare konvekse funksjoner kan vi også bruke
**tangentulikheten**:

$$f(y)\ge f(z)+\nabla f(z)^T(y-z).$$

Her er $z$ punktet vi undersøker, og $y$ et hvilket som helst annet
punkt i området. Høyresiden er den lineære modellen fra 8.2.
For en konveks funksjon ligger denne modellen under funksjonen
i **hele** området.

**Eksempel med tall.** For $f(x)=x^2$, ved $z=1$, sier ulikheten
$y^2\ge1+2(y-1)=2y-1$. Differansen er $(y-1)^2\ge0$, så den gjelder
for alle $y$. Ved $z=0$ er den deriverte 0, og samme regel gir
$y^2\ge0$: vi har bevist at 0 er et globalt minimumspunkt.

Generelt forsvinner indreproduktet når $\nabla f(z)=0$.
Da gir tangentulikheten $f(y)\ge f(z)$ for alle $y$.
**En null gradient er derfor nok til globalt minimum når vi først
har vist konveksitet.** Uten konveksitet kan vi få den dårligere
dalen fra 8.2, eller et sadelpunkt.

Et minimum på randen kan fortsatt ha gradient ulik null, som
$f(x)=x$ på $[0,1]$. I uke 11–12 kombinerer vi derfor slike
ulikheter med begrensningene i problemet.

<details class="reading-step">
<summary>Gå i dybden: hvorfor gjelder de globale garantiene?</summary>

**Konveksitet av $x^2$.** Regner vi ut forskjellen mellom høyre og
venstre side i definisjonen, får vi

$$ta^2+(1-t)b^2-\bigl(ta+(1-t)b\bigr)^2
=t(1-t)(a-b)^2\ge0.$$

Hvis $a\ne b$ og $0<t<1$, er alle faktorene positive. Dermed er
funksjonen strengt konveks.

**Hvorfor kan ikke et lokalt minimum være dårligere enn et annet punkt?**
Anta at $x_*$ er lokalt minimum, men at et tillatt $y$ har
$f(y)<f(x_*)$. Konveksitet av området gjør alle punktene
$x_t=(1-t)x_*+ty$ tillatte. Konveksitet av funksjonen gir for $0<t\le1$

$$f(x_t)\le(1-t)f(x_*)+tf(y)<f(x_*).$$

Vi kan velge $t$ så liten at $x_t$ er vilkårlig nær $x_*$.
Da har vi funnet et bedre punkt rett ved et lokalt minimum,
en motsigelse.

**Hvor kommer tangentulikheten fra?** For $0<t\le1$ gir konveksitet

$$f(z+t(y-z))\le(1-t)f(z)+tf(y).$$

Trekk fra $f(z)$ og del på $t$. Da er

$$\frac{f(z+t(y-z))-f(z)}{t}\le f(y)-f(z).$$

Når $t\to0^+$, går venstresiden mot den retningsderiverte
$\nabla f(z)^T(y-z)$ fra 8.2. Flytt så $f(z)$ til venstre side.
Dette gir tangentulikheten.

</details>

## 8.5 Regneoppgaver

<div id="uke8-oppgaver"></div>

Oppgave 1–2 følger modell og lokale tester i 8.1–8.2. Oppgave 3–5
følger eksemplene om eksistens i 8.3, og oppgave 6–9 følger
konveksitet i 8.4. Kodeoppgavene kommer i 8.6.

Svar eksakt uten avrunding. I uttrykksfeltene bruker du `*` for
multiplikasjon og `^` for potens, og skriver bare uttrykket, uten
likhetstegn. Der det spørres om ja/nei, er tallkodene angitt i oppgaven.
Begrunnelsene skriver du i egne notater; feltene kontrollerer regningen.

**Oppgave 1 – modell og ressursbruk.**

```{math-exercise}
#| label: week8-task-model
#| caption: Oppgave 1 – modell og ressursbruk
#| mode: equivalent
#| partial-credit: true
#| field-labels: antall komponenter, antall timer, nettooverskudd i kroner

I verkstedet fra 8.1 bruker en ny maskin 10 komponenter og 1 time og gir 500 kr i overskudd. En reparasjon bruker 1 komponent og 3 timer og gir 250 kr. Kapasiteten er 100 komponenter og 50 timer. Den allerede avtalte innkjøpsreisen koster 650 kr uansett produksjon.

Du planlegger $b=6$ nye maskiner og $r=12$ reparasjoner. Beregn ressursbruk og nettooverskudd. Er planen tillatt? Begrunn i egne notater.

Komponenter: __[72] &nbsp; Timer: __[42] &nbsp; Nettooverskudd (kr): __[5350]
```

**Oppgave 2 – kritisk punkt og krumning.**

```{math-exercise}
#| label: week8-task-hessian
#| caption: Oppgave 2 – kritisk punkt og krumning
#| mode: equivalent
#| partial-credit: true
#| field-labels: positiv egenverdi, negativ egenverdi

For $h(u,v)=u^2-4v^2$ skal du først kontrollere at gradienten er null i origo. Finn så egenverdiene til Hessianen. Er origo et lokalt minimum, et lokalt maksimum eller et sadelpunkt? Begrunn med verdiene langs de to koordinataksene.

Positiv egenverdi: __[2] &nbsp; Negativ egenverdi: __[-8]
```

**Oppgave 3 – grenseverdi eller oppnådd verdi?**

```{math-exercise}
#| label: week8-task-infimum
#| caption: Oppgave 3 – grenseverdi eller oppnådd verdi?
#| mode: equivalent
#| partial-credit: true
#| field-labels: infimum, supremum, minimum finnes på åpent intervall, minimum finnes på lukket intervall

La $g(x)=x^2$. På det åpne intervallet $(0,2)$ er begge endepunktene utelatt. Finn infimum og supremum. Avgjør om et minimum finnes, både på $(0,2)$ og på $[0,2]$.

Infimum på $(0,2)$: __[0] &nbsp; Supremum på $(0,2)$: __[4]

Skriv **1 for ja, 0 for nei** i de neste feltene:

Minimum finnes på $(0,2)$: __[0] &nbsp; Minimum finnes på $[0,2]$: __[1]

Forklar i egne notater hvorfor et finere rutenett ikke endrer svaret på det åpne intervallet. Finnes det et maksimum på hvert av intervallene?
```

**Oppgave 4 – lukket er ikke nok.**

```{math-exercise}
#| label: week8-task-compact
#| caption: Oppgave 4 – lukket er ikke nok
#| mode: equivalent
#| partial-credit: true
#| field-labels: A lukket, A begrenset, A kompakt, B lukket, B begrenset, B kompakt, C lukket, C begrenset, C kompakt

Undersøk $A=[-2,3]$, $B=(-2,3]$ og $C=[0,\infty)$. Skriv **1 for ja, 0 for nei**. For hver mengde skal du begrunne i egne notater hvilke endepunkter som er med, og om punktene kan bli vilkårlig store i absoluttverdi.

$A$: lukket __[1], begrenset __[1], kompakt __[1]

$B$: lukket __[0], begrenset __[1], kompakt __[0]

$C$: lukket __[1], begrenset __[0], kompakt __[0]
```

**Oppgave 5 – bruk ekstremalverdisetningen.**

```{math-exercise}
#| label: week8-task-existence-disk
#| caption: Oppgave 5 – bruk ekstremalverdisetningen
#| mode: equivalent
#| partial-credit: true
#| field-labels: minimumsverdi, maksimumsverdi, u i minimumspunktet, v i minimumspunktet

Vi undersøker $f(u,v)=u^2+v^2$ på skiven $D=\{(u,v):u^2+v^2\le4\}$. Kontroller først kravene i ekstremalverdisetningen: er området ikke-tomt og kompakt, og er funksjonen kontinuerlig? Finn så ekstremalverdiene.

Minimumsverdi: __[0] &nbsp; Maksimumsverdi: __[4]

Minimumspunkt: $u=$ __[0], $v=$ __[0]

Beskriv alle maksimumspunktene i egne notater. Hvorfor gir ikke setningen et entydig maksimumspunkt her?
```

**Oppgave 6 – skive og sirkelrand.**

```{math-exercise}
#| label: week8-task-convex-set
#| caption: Oppgave 6 – skive og sirkelrand
#| mode: equivalent
#| partial-credit: true
#| field-labels: midtpunktets første koordinat, midtpunktets andre koordinat, midtpunktet på sirkelranden, midtpunktet i skiven

Punktene $a=(2,0)$ og $b=(-2,0)$ ligger både på sirkelranden $S=\{(u,v):u^2+v^2=4\}$ og i skiven $D=\{(u,v):u^2+v^2\le4\}$. Finn midtpunktet $m=(a+b)/2$.

$m_1=$ __[0], $m_2=$ __[0]

Skriv **1 for ja, 0 for nei**:

Er $m$ på sirkelranden $S$? __[0] &nbsp; Er $m$ i skiven $D$? __[1]

Hvilken av mengdene kan du dermed bevise at ikke er konveks? Forklar hvorfor én midtpunktsberegning ikke alene beviser at den andre mengden er konveks. Er begge mengdene kompakte?
```

**Oppgave 7 – ett brudd på konveksitet er nok.**

```{math-exercise}
#| label: week8-task-convex
#| caption: Oppgave 7 – ett brudd på konveksitet er nok
#| mode: equivalent
#| partial-credit: true
#| field-labels: q i midtpunktet, gjennomsnitt av endeverdiene

For $q(x)=x^4-2x^2$ bruker du $a=-1$ og $b=1$. Regn ut verdien i midtpunktet og gjennomsnittet av endeverdiene.

$q((a+b)/2)=$ __[0] &nbsp; $(q(a)+q(b))/2=$ __[-1]

Hva sier sammenligningen om konveksitet på $\mathbb R$? Begrunn med ulikheten fra 8.4.
```

**Oppgave 8 – én bunn eller en hel linje?**

```{math-exercise}
#| label: week8-task-strict-convex
#| caption: Oppgave 8 – én bunn eller en hel linje?
#| mode: equivalent
#| partial-credit: true
#| field-labels: minste egenverdi til Hf, største egenverdi til Hf, minimumsverdi for f, u ved minimum av g, v ved minimum av g

Sammenlign $f(u,v)=(u-2)^2$ og $g(u,v)=(u-2)^2+(v+1)^2$ på $\mathbb R^2$.

Hessianen til $f$: minste egenverdi __[0], største egenverdi __[2]

Minimumsverdien til $f$: __[0]

Minimumspunktet til $g$: $u=$ __[2], $v=$ __[-1]

Beskriv alle minimumspunktene til $f$. Forklar hvorfor begge funksjonene er konvekse, men bare $g$ er strengt konveks. Bruk Hessianene og hva som skjer langs linjen $u=2$.
```

**Oppgave 9 – en nedre grense fra tangenten.**

```{math-exercise}
#| label: week8-task-tangent
#| caption: Oppgave 9 – en nedre grense fra tangenten
#| mode: equivalent
#| partial-credit: true
#| field-labels: tangentuttrykk i y, stasjonært punkt, minimumsverdi

La $q(x)=(x-3)^2$. Beregn $q(1)$ og $q'(1)$, og skriv den lineære modellen ved $x=1$ som et uttrykk i $y$.

$q(1)+q'(1)(y-1)=$ __[-4*y+8]

Finn også det stasjonære punktet og funksjonsverdien der:

$x_*=$ __[3] &nbsp; $q(x_*)=$ __[0]

Bruk $q''(x)$ til å begrunne streng konveksitet. Forklar deretter hvorfor tangentulikheten ved $x_*$ gir et globalt, entydig minimum.
```

## 8.6 Python: utforsk modellene

<div id="uke8-python"></div>

Her samler vi kodeforsøkene fra 8.1–8.4. Cellene kan kjøres og endres direkte. Sideoppsettet importerer NumPy som `np`, Matplotlib som `plt` og `minimize` fra `scipy.optimize`. Hvert forsøk definerer selv det det ellers trenger.

### Produksjon: tell alle tillatte heltallsvalg

<div id="uke8-python-production"></div>

I modellen fra 8.1 er innkjøpsturen allerede bestilt: 650 kr betales uansett hvor mange maskiner gruppen lager denne uken. Vi teller alle heltallspar, beregner nettooverskuddet og lar bare tillatte par konkurrere. `meshgrid` lager tabeller med hvert par $(b,r)$; den boolske tabellen `allowed` markerer ressurskravene. Et slikt uttømmende søk kan brukes fordi antallet mulige valg her er endelig og lite.

```{pyodide-python}
#| label: week8-production
# Lag alle ikke-negative heltallspar innenfor sikre øvre grenser.
b, r = np.meshgrid(np.arange(51), np.arange(101), indexing="ij")

# Marker parene som holder seg innenfor 100 komponenter og 50 timer.
allowed = (10*b + r <= 100) & (b + 3*r <= 50)

# Turen er allerede bestilt og koster 650 kr også ved null produksjon.
profit = 500*b + 250*r - 650

# Ugyldige par får -uendelig og kan derfor ikke vinne maksimeringen.
score = np.where(allowed, profit, -np.inf)
# argmax gir en flat indeks; unravel_index finner rad og kolonne i tabellen.
best_index = np.unravel_index(np.argmax(score), score.shape)
best = (int(b[best_index]), int(r[best_index]))
best_profit = int(profit[best_index])

# Kontroller både resultatet og ressursbruken ved det valgte paret.
print(f"Best blant {allowed.sum()} tillatte heltallspar: (b,r)={best}, P={best_profit} kr")
print(f"Ressursbruk: {10*best[0]+best[1]} komponenter, {best[0]+3*best[1]} timer")

# Figuren viser bare tillatte punkter; fargen er nettooverskuddet.
fig, ax = plt.subplots(figsize=(6, 5))
points = ax.scatter(b[allowed], r[allowed], c=profit[allowed], s=19, cmap="viridis")
ax.plot(*best, "r*", markersize=16, label="Beste heltallsvalg")
ax.set(xlabel="Nye maskiner b", ylabel="Reparasjoner r", title="Tillatte heltallsvalg")
fig.colorbar(points, ax=ax, label="Nettooverskudd (kr)")
ax.legend()
plt.show()
```

Beste heltallsvalg er $(8,14)$, med 6850 kr i nettooverskudd. Det bruker 94 komponenter og alle 50 arbeidstimene. Figuren og opptellingen undersøker *hele* det tillatte heltallsområdet; derfor er dette et globalt svar for akkurat denne modellen.

### Lokalt søk: funksjon, gradient og startpunkt

<div id="uke8-python-local"></div>

I 8.2 har den bølgede kostnadsfunksjonen flere daler. NumPy utfører arrayregningen; **SciPy** tilbyr ferdige numeriske metoder. Kallet `minimize(wavy, start, jac=wavy_grad, method="BFGS")` søker etter et lokalt minimum av `wavy` fra `start`. Argumentet `jac` gir SciPy en funksjon for gradienten, med én partiell derivert per variabel. `BFGS` er navnet på en metode som bruker gradienter til å anslå krumningen underveis; vi utvikler søkemetoder i uke 9–10.

`minimize` returnerer et **OptimizeResult**, et resultatobjekt med navngitte felt. `result.x` er punktet søket fant, `result.fun` verdien der, og `result.success` forteller om metodens stoppkrav ble oppfylt. Det siste er ingen garanti for global optimalitet. Vi sjekker også lengden av gradienten i punktet. Figuren skiller mellom **startpunktene** (ringer) og **punktene som ble funnet** (fylte markører).

```{pyodide-python}
#| label: week8-local-minima
# Definer funksjonen som skal minimeres og dens analytiske gradient.
def wavy(z):
    x, y = z
    return 20 + x*x + y*y - 10*(np.cos(2*np.pi*x) + np.cos(2*np.pi*y))

def wavy_grad(z):
    x, y = z
    return np.array([2*x + 20*np.pi*np.sin(2*np.pi*x),
                     2*y + 20*np.pi*np.sin(2*np.pi*y)])

# Kjør samme lokale metode fra to forskjellige startvektorer.
starts = [np.array([0., 0.]), np.array([2., 2.])]
results = []
for start in starts:
    # Send inn selve funksjonene, slik at SciPy kan evaluere dem flere ganger.
    # jac gir gradienten; method velger den lokale søkemetoden.
    result = minimize(wavy, start, jac=wavy_grad, method="BFGS")
    results.append(result)
    # .x er punktet, .fun er verdien; liten gradient sjekker små deriverte.
    x, y = result.x
    grad_norm = np.linalg.norm(wavy_grad(result.x))
    print(f"Start {start}: funnet punkt ({x:.4f}, {y:.4f}), "
          f"f={result.fun:.4f}, ||grad f||={grad_norm:.2e}, "
          f"success={result.success}")

# Beregn nivåkurver for å vise dalene i samme koordinatsystem.
grid = np.linspace(-.3, 2.4, 180)
X, Y = np.meshgrid(grid, grid)
fig, ax = plt.subplots(figsize=(6, 5))
curves = ax.contour(X, Y, wavy((X, Y)), levels=np.arange(0, 24, 2))
ax.clabel(curves, inline=True, fontsize=8)

# Tomme ringer viser starter; fylte markører viser hvor søkene endte.
colors = ["tab:blue", "tab:orange"]
for index, (start, result, color) in enumerate(zip(starts, results, colors), start=1):
    ax.plot(*start, marker="o", markerfacecolor="none", markeredgecolor=color,
            markeredgewidth=2, markersize=12, linestyle="None", label=f"Start {index}")
    ax.plot(*result.x, marker="X", color=color, markersize=9,
            linestyle="None", label=f"Funnet punkt {index}")
ax.set(xlabel="x", ylabel="y", title="To lokale søk i samme landskap")
ax.legend()
plt.show()
```

Fra $(0,0)$ finner søket verdi 0; fra $(2,2)$ finner det en annen dal nær $(1.9899,1.9899)$, med verdi omtrent 7.9597. Liten gradient betyr små deriverte i punktet, men alene kan verken den eller `success=True` fortelle hvilken dal som er best globalt. Her gir ulikheten $f(x,y)\geq0$ fra 8.2 den globale garantien ved origo.

<div id="uke8-scipy"></div>

<details>
<summary>SciPy-oppslag: kall, returverdi og kontroll</summary>

| Uttrykk | Betydning i dette forsøket |
|:--|:--|
| `minimize(f, x0, jac=grad_f, method="BFGS")` | Søk lokalt fra `x0`. `f` returnerer ett tall; `grad_f` returnerer en array med gradienten. |
| `result.x`, `result.fun` | Punktet som ble funnet, og funksjonsverdien der. |
| `result.success`, `result.message` | Om SciPys stoppkrav ble oppfylt, og hvorfor kjøringen stoppet. |
| `result.nit`, `result.nfev` | Antall oppdateringssteg (iterasjoner) og antall ganger målfunksjonen er beregnet (funksjonsevalueringer). Ett steg kan kreve flere evalueringer. |
| `np.linalg.norm(wavy_grad(result.x))` | Gradientens lengde ved funnet punkt; kontrollerer om det ser stasjonært ut. |

`f` skal ta en vektor med form `(n,)` og returnere ett tall; gradientfunksjonen skal returnere en vektor med samme form `(n,)`. `result.x` er en array, `result.fun` et tall, `result.success` en boolsk verdi og `result.message` en tekst. Eksempel: et søk på den bølgede funksjonen kan ha `success=True` og `fun` nær 7.96, selv om en bedre verdi finnes ved origo.

Et resultat fra ett eller flere lokale søk er en kandidat. For en global konklusjon trenger vi i tillegg et argument som gjelder alle tillatte punkter, slik som nedre grense i 8.2 eller konveksiteten i 8.4.

</details>

### Åpent område: et rutenett kan nærme seg en grense

<div id="uke8-python-domain"></div>

For $g(x)=x$ på $(0,1)$ er endepunktene utelatt. I hvert rutenett bruker vi bare indre punkter og rapporterer de minste og største verdiene. Tettere sampling endrer ikke hvilket område som er tillatt.

```{pyodide-python}
#| label: week8-open-domain
for n in (10, 100, 1000):
    # Start ved 1/n og stopp før 1, slik at begge endepunktene er utelatt.
    sample = np.arange(1, n)/n
    # g(x)=x, så tallene i sample er også funksjonsverdiene.
    print(f"{n-1:4d} indre punkter: minste g={sample.min():.3f}, "
          f"største g={sample.max():.3f}")
```

De minste verdiene blir 0.1, 0.01 og 0.001. Infimum er 0, men ingen tillatt $x$ oppnår verdien. Den numeriske utviklingen illustrerer skillet mellom en verdi vi nærmer oss og et faktisk minimum.

### Midtpunkter: ett moteksempel er nok

<div id="uke8-python-convex"></div>

For konveksitet skal funksjonsverdien i midtpunktet ikke overstige gjennomsnittet av endeverdiene. Et testpar kan avkrefte egenskapen, men endelig mange vellykkede tester kan ikke bevise den. `eigvalsh` finner egenverdiene til en symmetrisk matrise; den positive definite Hessianen i kvadratikken gir den generelle begrunnelsen fra 8.4.

```{pyodide-python}
#| label: week8-convex-midpoints
# Definer begge funksjonene her, slik at forsøket kan kjøres alene.
def phi(z):
    u, v = z
    return 1.5*u*u + u*v + v*v - 5*u - 5*v

def wavy_midpoint(z):
    x, y = z
    return 20 + x*x + y*y - 10*(np.cos(2*np.pi*x) + np.cos(2*np.pi*y))

# Begynn med parablen fra 8.4: verdi i midten mot snitt av endene.
print("x²: midten", 0.**2, "snitt av ender", ((-1.)**2 + 1.**2)/2)

# Sammenlign også skålen fra uke 6 og den bølgede funksjonen.
a, b = np.array([0., 0.]), np.array([1., 2.])
print(f"Kvadratikk: midten {phi((a+b)/2):.3f}, "
      f"snitt av ender {(phi(a)+phi(b))/2:.3f}")
c, d = np.array([0., 0.]), np.array([1., 0.])
print(f"Bølget:    midten {wavy_midpoint((c+d)/2):.2f}, "
      f"snitt av ender {(wavy_midpoint(c)+wavy_midpoint(d))/2:.2f}")

# Undersøk den symmetriske Hessianen til den kvadratiske funksjonen.
H_phi = np.array([[3., 1.], [1., 2.]])
print("Egenverdier til kvadratikkens Hessian:", np.linalg.eigvalsh(H_phi))

# Tegn de to sammenligningene i 8.4, med bildene under hverandre.
fig, axes = plt.subplots(2, 1, figsize=(6, 8), constrained_layout=True)
x = np.linspace(-1, 1, 200)
axes[0].plot(x, x**2, label="Funksjonen x²")
axes[0].plot([-1, 1], [1, 1], "--", label="Linje mellom endeverdiene")
axes[0].plot(0, 0, "ko", label="Verdi i midtpunktet")
axes[0].set(xlabel="x", ylabel="Funksjonsverdi", title="Konveks: grafen ligger under linjen")

# På linjen y=0 blir den bølgede funksjonen en funksjon av x alene.
x = np.linspace(0, 1, 200)
axes[1].plot(x, wavy_midpoint((x, 0.)), label="Bølget funksjon langs y=0")
axes[1].plot([0, 1], [0, 1], "--", label="Linje mellom endeverdiene")
axes[1].plot(.5, 20.25, "ko", label="Verdi i midtpunktet")
axes[1].set(xlabel="x", ylabel="Funksjonsverdi", title="Ikke konveks: midtpunktet bryter kravet")
for ax in axes:
    ax.legend(fontsize=8)
    ax.grid(alpha=.2)
plt.show()
```

Parabelen gir $0<1$. Kvadratikken fra uke 6 gir $-5.625\leq-3.750$. Den bølgede funksjonen gir $20.25>0.50$, som avkrefter konveksitet. De beregnede egenverdiene støtter konklusjonen fra 8.4. Der brukte vi de eksakte egenverdiene til den konstante Hessianen til å bevise streng konveksitet.

### Prøv selv

Fullfør de tre korte funksjonene. Hver oppgave har egne importer og definisjoner og kan kjøres uavhengig av de andre cellene. Kontrollene vurderer resultatet uten å vise løsningskode.

**Oppgave 1 – gradienten.** For $q(x,y)=(x-1)^2+2(y+2)^2$ skal `grad_q(z)` returnere begge partiellderiverte som en NumPy-array. Fullfør returuttrykket.

```{py-exercise}
#| label: week8-python-gradient
#| caption: Beregn gradienten til en kvadratisk funksjon
#| show-test-hints: false
import numpy as np

# Gradientfunksjonen skal gi SciPy én partiell derivert per variabel.
def grad_q(z):
    x, y = z
    # TODO: Returner de to partiellderiverte i riktig rekkefølge.
    return np.array([0., 0.])

## TESTS ##
assert np.allclose(grad_q(np.array([1., -2.])), [0., 0.])
assert np.allclose(grad_q(np.array([3., 0.])), [4., 8.])
assert np.allclose(grad_q(np.array([-2., -3.])), [-6., -4.])
```

**Oppgave 2 – SciPy-resultatet.** Minimer $q(x,y)=(x+1)^2+3(y-2)^2$ fra den oppgitte `start`-vektoren med `jac=grad_q` og `method="BFGS"`. Returner paret `(result.x, result.fun)`.

```{py-exercise}
#| label: week8-python-minimize
#| caption: Kjør BFGS og les punkt og verdi
#| show-test-hints: false
import numpy as np
from scipy.optimize import minimize

# Denne målfunksjonen returnerer ett tall for hver vektor z.
def q(z):
    x, y = z
    return (x + 1)**2 + 3*(y - 2)**2

# Gradientfunksjonen skal gi SciPy én partiell derivert per variabel.
def grad_q(z):
    x, y = z
    return np.array([2*(x + 1), 6*(y - 2)])

def solve_q(start):
    # TODO: Kall minimize med funksjon, startpunkt, gradient og metode.
    result = None
    # TODO: Returner punktet og funksjonsverdien i resultatet.
    return None

## TESTS ##
assert np.allclose(solve_q(np.array([0., 0.]))[0], [-1., 2.], atol=1e-5)
assert np.isclose(solve_q(np.array([0., 0.]))[1], 0., atol=1e-9)
assert np.allclose(solve_q(np.array([7., 3.]))[0], [-1., 2.], atol=1e-5)
assert np.isclose(solve_q(np.array([7., 3.]))[1], 0., atol=1e-9)
```

**Oppgave 3 – to starter.** Bruk `minimize` med `jac=wavy_grad` og `method="BFGS"` én gang fra hver av de to startvektorene nedenfor. Returner `(first, second)`, altså de to `OptimizeResult`-objektene, slik at både punkter og verdier kan undersøkes.

```{py-exercise}
#| label: week8-python-two-starts
#| caption: Sammenlign to lokale søk
#| show-test-hints: false
import numpy as np
from scipy.optimize import minimize

# Målfunksjon og gradient er ferdig gitt; oppgaven gjelder SciPy-kallene.
def wavy(z):
    x, y = z
    return 20 + x*x + y*y - 10*(np.cos(2*np.pi*x) + np.cos(2*np.pi*y))

def wavy_grad(z):
    x, y = z
    return np.array([2*x + 20*np.pi*np.sin(2*np.pi*x),
                     2*y + 20*np.pi*np.sin(2*np.pi*y)])

def two_searches():
    near_zero = np.array([0., 0.])
    near_two = np.array([2., 2.])
    # TODO: Kjør BFGS fra near_zero og near_two med gradienten over.
    first = None
    second = None
    return first, second

## TESTS ##
assert np.allclose(two_searches()[0].x, [0., 0.], atol=1e-5)
assert np.isclose(two_searches()[0].fun, 0., atol=1e-7)
assert np.allclose(two_searches()[1].x, [1.9899, 1.9899], atol=5e-4)
assert 7.9 < two_searches()[1].fun < 8.1
```


:::
