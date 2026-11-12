::: {.panel-tabset}

## 11.0 Oversikt

::: {#uke11-start}
:::

### Hva bør verkstedet produsere, og hva er en ekstra maskintime verdt?

#### Situasjonen

Et lite møbelverksted lager to produkter, som vi kaller A og B. Tenk for eksempel på stoler og bord. Verkstedet produserer i **partier**: en serie like produkter, for eksempel ti stoler om gangen.

Hver uke må eieren bestemme hvor mange partier av A og hvor mange partier av B verkstedet skal lage. Et slikt valg kaller vi en **produksjonsplan**, eller bare en **plan**. «Tre partier A og to partier B» er en plan.

Eieren kan ikke velge fritt:

- **Timene er begrenset.** Maskinene og de ansatte har bare et visst antall timer i uka, og hvert parti bruker noen av dem.
- **Salget av A er begrenset.** Kundene kjøper høyst fire partier A i uka.

Hvert parti gir verkstedet en **fortjeneste**: det verkstedet sitter igjen med når kostnadene til materialer og annet forbruk er trukket fra salgsinntekten. I regnskapslitteraturen heter dette **dekningsbidrag**.

Eieren har to spørsmål:

1. **Hvilken plan gir størst fortjeneste?** Svaret er ikke opplagt: A gir mest per parti, men bruker dobbelt så mye maskintid som B.
2. **Lønner det seg å leie mer maskintid?** En nabo tilbyr å leie ut maskinen sin noen timer ekstra. Hva er det mest verkstedet bør betale for én ekstra maskintime?

Tallene kommer i [11.1](#uke11-modell).

#### Fra verkstedet til matematikk

For å svare oversetter vi verkstedet til matematikk. Hver ting i verkstedet får sin motpart:

| I verkstedet | I matematikken |
|:--|:--|
| En plan: $x$ partier A og $y$ partier B | Et punkt $(x,y)$ i planet |
| Planen bruker ikke flere timer enn verkstedet har | Én lineær ulikhet per ressurs: «timer brukt $\le$ timer som finnes» |
| Alle planene eieren faktisk kan velge | Det **tillatte området**: punktene som oppfyller alle ulikhetene |
| Fortjenesten til en plan | En lineær funksjon $P(x,y)$ |
| Den beste planen | Punktet i det tillatte området der $P$ er størst |

Både fortjenesten og timebruken er lineære i $x$ og $y$. Et slikt problem kalles **lineær programmering (LP)**. Ordet «programmering» betyr her planlegging, ikke koding.

#### Veien gjennom uken

Det finnes uendelig mange planer, for $x$ og $y$ trenger ikke være hele tall. Ukens kjernespørsmål er derfor:
**Hvordan kan vi vite at en plan er den beste, uten å prøve alle planene?**
Svaret kommer i tre steg:

1. **Finn den beste planen (11.1–11.2).** Vi tegner det tillatte området. Den beste planen ligger i et hjørne av området, og hvert hjørne finner vi ved å løse et lite lineært likningssett. Til slutt lar vi løseren `linprog` gjøre den samme jobben.
2. **Bevis at den er best (11.3).** Vi tenker oss at et annet firma vil leie hele verkstedet, og spør hvilken leie eieren ville godta. En slik leie er en øvre grense for fortjenesten i *alle* planer. Når planen vår når grensen, finnes det ingen bedre plan.
3. **Svar på leiespørsmålet (11.4).** Prisen på en maskintime fra steg 2 er nettopp det en ekstra maskintime er verdt, men bare så lenge verkstedet ikke leier for mange timer.

**Hva vi tar med fra uke 8.** I [uke 8](uke8.qmd#uke8-start) stilte vi tre spørsmål til et optimeringsproblem. For verkstedet blir svarene enkle:

| Spørsmål fra uke 8 | Svaret for verkstedet |
|:--|:--|
| *Finnes det en beste plan?* | Ja. Det tillatte området er lukket og begrenset, og $P$ er kontinuerlig, så $P$ har en største verdi der. |
| *Hva sier krumningen?* (Hessianen) | Ingenting nytt. $P$ er lineær, så grafen er et flatt plan, og Hessianen er null. |
| *Er planen vi fant, den beste?* (konveksitet) | Ja, hvis ingen nabohjørne er bedre. Området er konvekst, så et hjørne uten bedre nabo er best av alle. |

Vi trenger altså svarene på det første og det tredje spørsmålet fra uke 8. Steg 2 gir i tillegg et bevis som kan kontrolleres med noen få multiplikasjoner.

- **Lesemodus:** **Forelesning** viser hovedløpet. **Gå i dybden** åpner lengre begrunnelser og mellomregninger.
- **Arbeidsløp:** I 11.1–11.4 følger vi ett verksted. Regneoppgavene i 11.5 er sortert etter de tre ideene, og kodeoppgavene står i 11.6. Alle oppgavene bruker stort sett de samme tallene.

### Kort løype

**Idé 1 – det beste svaret ligger i et hjørne**

1. [Fra tabell til tillatt område](#uke11-modell): mål, krav og slakk.
2. [Eksperiment 1: endre fortjenesten fra B](#uke11-pris): den beste planen hopper mellom hjørner.
3. [Hvorfor ligger optimum i et hjørne?](#uke11-hvorfor) og [hjørner er løsninger av lineære likningssett](#uke11-hjorner).
4. [Eksperiment 2: kontroller hjørnetabellen med `linprog`](#uke11-linprog).

**Idé 2 – priser beviser at planen er best**

5. [Ressurspriser gir en øvre grense](#uke11-dual) og [komplementær slakk](#uke11-slakk).

**Idé 3 – hva er litt mer kapasitet verdt?**

6. [Eksperiment 3: en ekstra maskintime](#uke11-sensitivitet).

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 3: lineære likningssett og rang](uke3.qmd#uke3-stotte-matriser) | Når har to grenselikninger nøyaktig ett felles punkt? |
| [Uke 8: kompakthet](uke8.qmd#uke8-kompakt) | Hvorfor finnes det en beste plan? |
| [Uke 8: konveksitet](uke8.qmd#uke8-lokalt) | Hvorfor kan vi stoppe i et hjørne som ikke har en bedre nabo? |
| [Uke 8 (Gå i dybden): grense fra tangenten](uke8.qmd#uke8-tangent) | Kan en enkel ulikhet bevise at ingen plan er bedre? |

### Læringsmål

Etter denne uken skal du kunne

- oversette et produksjonsproblem som verkstedet til et lineært mål og ulikheter for ressursene, og regne ut hvor mye av hver ressurs en plan lar være ubrukt (slakken),
- forklare hvorfor den beste planen ligger i et hjørne når det finnes tillatte planer og området er begrenset, og finne hjørnene som løsninger av lineære likningssett,
- sette priser på ressursene slik at de gir en øvre grense for hva en plan kan gi, og bevise at en plan er best når den når grensen,
- bruke komplementær slakk (en ubrukt ressurs har pris null; et produkt som lages, gir akkurat like mye som leieverdien av ressursene det bruker) til å finne ressursprisene fra en plan,
- forklare hva litt mer kapasitet er verdt, og finne ut når den gamle prisen slutter å gjelde,
- kode modellen med `linprog`, sjekke løserens status og kontrollere resultatet mot kravene.

## 11.1 Fra tabell til tillatt område

::: {#uke11-modell}
:::

### Verkstedet i tall

Vi går tilbake til møbelverkstedet fra [oversikten](#uke11-start). Eieren skal velge hvor mange partier av A og B verkstedet skal lage denne uka. Tabellen viser hva ett parti av hvert produkt bruker av timer, og hva det gir i fortjeneste. Den siste raden viser hvor mange timer verkstedet har i uka.

| Produkt | Maskintimer per parti | Arbeidstimer per parti | Fortjeneste per parti |
|:--|--:|--:|--:|
| A | 2 | 1 | 5 tusen kr |
| B | 1 | 2 | 4 tusen kr |
| Timer verkstedet har i uka | 9 | 9 | |

I tillegg kjøper kundene høyst fire partier A i uka.

**Les tabellen.** Ett parti A bruker 2 timer i maskinene og 1 time av de ansattes arbeid, og verkstedet sitter igjen med 5 tusen kroner når materialene er betalt. For B er det omvendt: 1 maskintime og 2 arbeidstimer gir 4 tusen kroner. A gir altså mest per parti, men bruker mest av maskintiden.

**Forenklinger.** For at regningen skal bli enkel, antar vi at

- alt verkstedet lager, blir solgt, bortsett fra at det bare er kunder til fire partier A,
- tallene i tabellen er de samme hele uka,
- verkstedet kan lage deler av et parti: $2.5$ partier er to hele partier og et halvt. Det er rimelig når et parti består av mange like enheter, for eksempel ti stoler.

### Fra verkstedet til en modell

Nå oversetter vi verkstedet til matematikk, én bit om gangen.

**Planen blir et punkt.** La $x$ være antall partier A og $y$ antall partier B. En plan er da et punkt $(x,y)$. Planen $(2,1)$ betyr to partier A og ett parti B.

**Fortjenesten blir en funksjon.** Hvert parti A gir 5 og hvert parti B gir 4 tusen kroner. Planen $(x,y)$ gir derfor
$$P=5x+4y \quad\text{(tusen kroner)}.$$
Dette er **målet**: vi vil gjøre $P$ størst mulig.

**Kravene blir ulikheter.** Timene en plan bruker, er «timer per parti × antall partier», lagt sammen for A og B. Planen kan ikke bruke flere timer enn verkstedet har:

| Krav | I verkstedet | Ulikhet |
|:--|:--|:--|
| Maskintimer | A bruker 2 og B bruker 1 time per parti; verkstedet har 9 | $2x+y\le9$ |
| Arbeidstimer | A bruker 1 og B bruker 2 timer per parti; verkstedet har 9 | $x+2y\le9$ |
| Salg av A | Kundene kjøper høyst fire partier A | $x\le4$ |
| Ingen negativ produksjon | Verkstedet kan ikke lage $-1$ parti | $x\ge0,\ y\ge0$ |

En plan er **tillatt** når den oppfyller alle kravene. Sjekk planen $(x,y)=(2,1)$:

1. Maskintimer: $2\cdot2+1\cdot1=5\le9$.
2. Arbeidstimer: $1\cdot2+2\cdot1=4\le9$.
3. A-grensen: $x=2\le4$. Fortjenesten er $5\cdot2+4\cdot1=14$ tusen kroner.

Begge partimengdene er ikke-negative, så planen er tillatt. Den ubrukte kapasiteten er:

| Ressurs | Kapasitet minus bruk |
|:--|:--|
| Maskintimer | $9-5=4$ ubrukte timer |
| Arbeidstimer | $9-4=5$ ubrukte timer |
| A-partier | Rom for $4-2=2$ flere partier |

Som i [oversikten](#uke11-start) er dette et LP-problem: både målet $P=5x+4y$ og timebruken er lineære i $x$ og $y$. Eierens første spørsmål er nå et matematisk spørsmål: hvilket punkt i det tillatte området gir størst $P$?

### Tegn området og sammenlign hjørnene

**Hvor ligger de tillatte planene, og hvor treffer den beste mållinjen?** Slik leser du figuren:

- **Kravene:** Hvert krav deler koordinatplanet i to. For eksempel er det nok maskintimer på den ene siden av linjen $2x+y=9$, men ikke på den andre. Figuren tegner de tre grenselinjene og fargelegger planene som ligger på riktig side av alle linjene samtidig.
- **Mållinjene:** De stiplede linjene er **mållinjer**: planer med samme $P$. Når fortjenesten øker fra 20 til 27, flyttes linjen opp og til høyre.

Se etter den siste linjen som fortsatt treffer det blå området.

```{pyodide-python}
#| label: week11-polygon
# Hjørnene rundt området (rekkefølge langs kanten) og tre nivåer av P = 5x + 4y.
corners = np.array([[0, 0], [4, 0], [4, 1], [3, 3], [0, 4.5]])
show_region(corners, objective=(5, 4), levels=(20, 24, 27), best=(3, 3))
```

**Hva viser figuren?**

- **Sammenlign linjene:** Mållinjen for $P=24$ skjærer gjennom området, så det finnes planer som gir mer. Linjen for $P=27$ berører området bare i hjørnet $(3,3)$.
- **Sammenlign hjørnene:** Langs en kant varierer det lineære målet $P$ mellom verdiene i endepunktene, så det holder å se på hjørnene der grensene møtes. Hjørnetabellen under viser det samme med tall.

Hvordan vi finner hjørnene systematisk, ser vi i [Hjørner er løsninger av lineære likningssett](#uke11-hjorner).

| Hjørne $(x,y)$ | $P$ (tusen kr) |
|:--|--:|
| $(0,0)$ | 0 |
| $(4,0)$ | 20 |
| $(4,1)$ | 24 |
| $(3,3)$ | **27** |
| $(0,9/2)$ | 18 |

I $(3,3)$ er begge timekapasitetene brukt opp, men det er rom for ett A-parti til før grensen $x\le4$ nås.

- **Slakk** er det som er igjen av en ressurs: kapasitet minus bruk. I $(3,3)$ er det $0$ maskintimer, $0$ arbeidstimer og $1$ A-parti igjen, så slakkene er $(0,0,1)$.
- **Aktiv grense:** En grense er **aktiv** når slakken er null, altså når planen bruker opp akkurat alt som finnes. I $(3,3)$ er maskintimene og arbeidstimene aktive grenser, men ikke A-grensen.

::: {#uke11-pris}
:::

### Hvor robust er den beste planen?

Figuren og hjørnetabellen viser at den beste planen er $(3,3)$: tre partier A og tre partier B i uka. Den gir $P=5\cdot3+4\cdot3=27$ tusen kroner. Tenker vi på A som stoler og B som bord, er det tre partier stoler og tre partier bord.

**Hvor sikkert er tallet 4?** Fortjenesten fra et parti bord er salgsprisen minus det materialene koster. Begge deler kan endre seg: treverket kan bli dyrere, eller en kunde kan være villig til å betale mer for bordene. Da gir et parti bord kanskje 3 eller 6 tusen kroner i stedet for 4.

**Eierens spørsmål:** Må verkstedet lage en annen plan hvis bordene gir mer eller mindre enn vi trodde? Og hvor mye kan fortjenesten fra bordene endre seg før planen må endres?

For å undersøke mange mulige verdier av fortjenesten på én gang gir vi fortjenesten et navn:

> La $c$ være fortjenesten fra ett parti B (bord), målt i tusen kroner. Hittil har vi brukt $c=4$.

Planen $(x,y)$ gir da

$$P=5x+cy.$$

- **Det som ikke endres:** Timene og salgsgrensen for A er de samme, så det blå området med tillatte planer er det samme.
- **Det som endres:** Mållinjene $5x+cy=\text{konstant}$ får en annen helning når $c$ endres.
- **Det du får ferdig:** Figuren under regner ut $P$ i de fem hjørnene for deg og markerer det beste. Hvorfor det holder å se på hjørnene, begrunner vi rett etterpå.

Målet er å finne ut hvilken plan som er best for ulike verdier av fortjenesten $c$ fra bordene, og ved hvilke verdier av $c$ eieren må bytte plan.

### Eksperiment 1 – endre fortjenesten fra B

- **Forutsi først:** Hvis bordene gir litt mer, for eksempel $c=4.5$ i stedet for $4$, bør verkstedet da lage litt flere bord og litt færre stoler?
- **Skyv $c$ sakte fra 0.5 til 14**, altså fra nesten ingenting til 14 tusen kroner per parti bord. Noter hvert hjørne (hver plan) som blir best underveis.
- **Finn knekkpunktene:** For to verdier av $c$ viser teksten «Hel kant er best». Da gir to hjørner like mye, og det gjør alle planene mellom dem også. Hvilken kant er det i hvert tilfelle, og hvilken type timer er brukt opp langs den?

Den stiplede linjen er mållinjen gjennom det beste punktet, og teksten viser hvilket hjørne som er best og verdien der.

::: {#uke11-pris-applet}
:::

```{.jsxgraph width="620" height="560" style="width:100%;max-width:620px;height:560px;border:0;"}
(function () {
  var host = document.getElementById(BOARDID);
  function initialize() {
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-0.6, 5.0, 5.6, -0.6], axis: true, keepaspectratio: true,
  showCopyright: false, showNavigation: false,
  pan: {enabled: false}, zoom: {enabled: false}
});
// Smal skjerm (mobil): glidebryteren og tekstene får egne rader øverst, med mindre skrift.
// Posisjonene er funksjoner, så oppsettet følger med når vinduet endrer bredde.
function narrow() { return board.canvasWidth < 500; }
function ytop() { return board.getBoundingBox()[1]; }
function fs() { return board.canvasWidth < 300 ? 10 : narrow() ? 11 : 14; }
function xl() { return board.canvasWidth < 300 ? 0.12 : narrow() ? 0.3 : 2.5; }
var c = board.create('slider', [
  [function () { return narrow() ? 0.3 : 2.5; }, function () { return narrow() ? ytop() - 0.6 : 4.6; }],
  [function () { return narrow() ? 3.0 : 5.0; }, function () { return narrow() ? ytop() - 0.6 : 4.6; }],
  [0.5, 4, 14]], {
  name: 'c', snapWidth: 0.5, precision: 1
});
// De fem hjørnene i samme rekkefølge som i figuren over.
var V = [[0,0],[4,0],[4,1],[3,3],[0,4.5]];
var pts = V.map(function (v) {
  return board.create('point', v, {
    name: '(' + v[0] + ', ' + v[1] + ')', fixed: true, size: 2,
    color: '#1565c0', label: {offset: [6, 8], fontSize: 12}
  });
});
board.create('polygon', pts, {
  fillColor: '#82b6e6', fillOpacity: 0.3,
  borders: {strokeColor: '#1565c0', strokeWidth: 2}
});
// Finn største verdi av 5x + c*y og alle hjørner som oppnår den.
function best() {
  var vals = V.map(function (v) { return 5*v[0] + c.Value()*v[1]; });
  var m = Math.max.apply(null, vals), idx = [];
  for (var i = 0; i < V.length; i++) { if (vals[i] > m - 1e-9) { idx.push(i); } }
  return {m: m, idx: idx};
}
// Mållinjen -P + 5x + c*y = 0 gjennom det beste hjørnet.
board.create('line', [function () { return -best().m; }, 5,
                      function () { return c.Value(); }], {
  strokeColor: '#ef6c00', dash: 2, strokeWidth: 2, fixed: true
});
// Ved like verdier i to hjørner er hele kanten mellom dem best.
board.create('segment', [
  [function () { return V[best().idx[0]][0]; }, function () { return V[best().idx[0]][1]; }],
  [function () { var b = best(); return V[b.idx[b.idx.length-1]][0]; },
   function () { var b = best(); return V[b.idx[b.idx.length-1]][1]; }]
], {strokeColor: '#c62828', strokeWidth: 5, fixed: true});
board.create('point', [function () { return V[best().idx[0]][0]; },
                       function () { return V[best().idx[0]][1]; }], {
  name: '', size: 5, color: '#c62828', fixed: true
});
board.create('text', [xl, function () { return narrow() ? ytop() - 1.3 : 4.2; }, function () {
  var b = best();
  var s = b.idx.map(function (i) { return '(' + V[i][0] + ', ' + V[i][1] + ')'; }).join(' og ');
  return (b.idx.length > 1 ? 'Hel kant er best: ' : 'Beste hjørne: ') + s;
}], {fontSize: fs, color: '#263238', fixed: true});
board.create('text', [xl, function () { return narrow() ? ytop() - 1.8 : 3.85; }, function () {
  return 'P = 5x + ' + c.Value().toFixed(1) + 'y = ' + Math.round(100*best().m)/100;
}], {fontSize: fs, color: '#263238', fixed: true});
  }
  if (host.clientWidth > 0 && host.clientHeight > 0) {
    initialize();
  } else {
    var pending = new ResizeObserver(function () {
      if (host.clientWidth > 0 && host.clientHeight > 0) {
        pending.disconnect();
        initialize();
      }
    });
    pending.observe(host);
  }
})();
```

**Hva viser forsøket?**

- **Bordene gir lite ($c<5/2$):** $(4,1)$ er best. Verkstedet lager så mange stoler som kundene vil kjøpe, og bruker resten av maskintiden på ett parti bord.
- **Bordene gir middels ($5/2<c<10$):** $(3,3)$ er best. Et helt intervall av verdier for $c$ gir samme plan.
- **Bordene gir mye ($c>10$):** $(0,9/2)$ er best. Verkstedet lager bare bord, og arbeidstimene setter grensen.
- **Knekkpunktene ($c=5/2$ og $c=10$):** En hel kant er best, så to planer og alt mellom dem gir like mye.

**Svaret til eieren:** Planen $(3,3)$ er fortsatt best så lenge et parti bord gir mellom $2.5$ og $10$ tusen kroner. Et anslag som er litt feil, endrer altså ikke planen.

Den beste planen flytter seg aldri litt: den står stille, og så hopper den. Knekkpunktene kommer når mållinjen er parallell med en kant. Mållinjene $5x+cy=\text{konstant}$ har stigningstall $-5/c$.

| Kant | Stigningstall | Parallell mållinje når |
|:--|:--|:--|
| Maskinkanten $2x+y=9$ | $-2$ | $5/c=2$ gir $c=5/2$ |
| Arbeidskanten $x+2y=9$ | $-1/2$ | $5/c=1/2$ gir $c=10$ |

**Øv på dette:** [slakk i planen (4, 1)](#uke11-oppg-plan) og [når fortjenesten fra A endres](#uke11-oppg-bidrag) i 11.5; [beregn slakk og fortjeneste](#uke11-kode-plan) i 11.6.

### Hvorfor ligger optimum i et hjørne?

::: {#uke11-hvorfor}
:::

I eksperiment 1 var den beste planen alltid et hjørne av området, eller en hel kant mellom to like gode hjørner. Det er ikke tilfeldig, og det er en god nyhet for eieren: Verkstedet trenger aldri å lete blant de uendelig mange planene inni området. Det holder å sammenligne de fem hjørnene. Vi ser hvorfor på to måter.

**Første forklaring: skyv mållinjen.** Alle planer som gir den samme fortjenesten $P$, ligger på en rett linje, mållinjen $5x+cy=P$. Krever vi en større fortjeneste $P$, flytter linjen seg parallelt utover. Så lenge linjen fortsatt treffer det blå området, finnes det en tillatt plan som gir så mye. Øk $P$ til linjen akkurat er i ferd med å forlate området. Det siste den berører, er et hjørne, eller en hel kant hvis linjen er parallell med kanten.

**Andre forklaring: en plan inni er en blanding av hjørner.** Ta planen $(2,1)$ fra 11.1. Del uka i ni like deler, og tenk deg at verkstedet

- står stille i fire av dem (planen $(0,0)$),
- kjører planen $(4,1)$ i tre av dem,
- kjører planen $(3,3)$ i to av dem.

Til sammen blir produksjonen $\tfrac49(0,0)+\tfrac39(4,1)+\tfrac29(3,3)=(2,1)$, altså nøyaktig planen $(2,1)$. Fortjenesten blander seg på samme måte:
$$P(2,1)=\tfrac49\cdot0+\tfrac39\cdot24+\tfrac29\cdot27=0+8+6=14.$$
Et slikt **veid gjennomsnitt** kan aldri bli større enn det største tallet det er laget av. En blanding av planer gir derfor aldri mer enn den beste planen i blandingen, og det beste hjørnet kan ikke slås av en plan inni.

**Resultatet.** Det samme gjelder i alle LP-problemer der det finnes minst én tillatt plan og området er begrenset: **Da finnes det en beste plan, og den ligger i et hjørne.**

Appleten under er figuren fra eksperiment 1 med to nye ting du kan styre:

- **Glidebryteren $P$ – fortjenesten du krever.** Den stiplede mållinjen viser alle planer som gir nøyaktig $P$ tusen kroner. Den oransje delen av området er planene som gir minst $P$.
- **Det grønne punktet $Z$ – en plan du velger selv.** Dra det rundt i området. Appleten viser hvilke tre hjørner $Z$ er en blanding av, hvor mye av hvert hjørne blandingen bruker (vektene), og hvordan $P(Z)$ blir det samme gjennomsnittet av hjørneverdiene.

Målet er å se med egne øyne at det siste mållinjen berører, er et hjørne, og at en plan inni området aldri gir mer enn det beste hjørnet.

- Skyv $P$ sakte oppover fra 20. Hva skjer med den oransje delen, og hvor forsvinner den til slutt?
- Dra $Z$ rundt, også helt ut mot kantene. Sammenlign $P(Z)$ med verdien i det beste hjørnet.
- Sett $c=10$ (bordene gir mye) og skyv $P$ til 45. Hva berører mållinjen nå?

Appleten starter med $c=4$, $P=20$ og planen $Z=(2,1)$ fra 11.1.

::: {#uke11-hvorfor-applet}
:::

```{.jsxgraph width="620" height="730" style="width:100%;max-width:620px;height:730px;border:0;"}
(function () {
  var host = document.getElementById(BOARDID);
  function initialize() {
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-0.6, 7.2, 6.0, -0.6], axis: true, keepaspectratio: true,
  showCopyright: false, showNavigation: false,
  pan: {enabled: false}, zoom: {enabled: false}
});
// Smal skjerm (mobil): glidebrytere og tekster får hver sin rad øverst, med mindre skrift.
// Posisjonene er funksjoner, så oppsettet følger med når vinduet endrer bredde.
function narrow() { return board.canvasWidth < 500; }
function ytop() { return board.getBoundingBox()[1]; }
function fs() { return board.canvasWidth < 300 ? 10 : narrow() ? 11 : 13; }
function xl() { return board.canvasWidth < 300 ? 0.12 : 0.3; }
function row(i) { return function () { return narrow() ? ytop() - 1.9 - 0.5*i : 6.4 - 0.35*i; }; }
function sliderAt(k, wide) {
  var y = function () { return narrow() ? ytop() - 0.6*(k + 1) : wide[0][1]; };
  return [[function () { return narrow() ? 0.3 : wide[0][0]; }, y],
          [function () { return narrow() ? 3.0 : wide[1][0]; }, y]];
}
var c = board.create('slider', sliderAt(0, [[0.3, 6.85], [2.3, 6.85]]).concat([[0.5, 4, 14]]), {
  name: 'c', snapWidth: 0.5, precision: 1
});
var P = board.create('slider', sliderAt(1, [[3.3, 6.85], [5.1, 6.85]]).concat([[0, 20, 63]]), {
  name: 'P', snapWidth: 0.5, precision: 1
});
// De fem hjørnene i samme rekkefølge som i eksperiment 1.
var V = [[0,0],[4,0],[4,1],[3,3],[0,4.5]];
var pts = V.map(function (v) {
  return board.create('point', v, {
    name: '(' + v[0] + ', ' + v[1] + ')', fixed: true, size: 2,
    color: '#1565c0', label: {offset: [6, 8], fontSize: 12}
  });
});
board.create('polygon', pts, {
  fillColor: '#82b6e6', fillOpacity: 0.3,
  borders: {strokeColor: '#1565c0', strokeWidth: 2}
});
function val(x, y) { return 5*x + c.Value()*y; }
function fmt(t) { return String(Math.round(100*t)/100); }
function name(v) { return '(' + v[0] + ', ' + v[1] + ')'; }
// Største verdi i hjørnene og alle hjørner som oppnår den.
function best() {
  var vals = V.map(function (v) { return val(v[0], v[1]); });
  var m = Math.max.apply(null, vals), idx = [];
  for (var i = 0; i < V.length; i++) { if (vals[i] > m - 1e-9) { idx.push(i); } }
  return {m: m, idx: idx};
}
// Delen av området der 5x + cy >= P: klipp mangekanten langs mållinjen.
function above() {
  var out = [], n = V.length, p = P.Value();
  for (var i = 0; i < n; i++) {
    var A = V[i], B = V[(i + 1) % n];
    var fa = val(A[0], A[1]) - p, fb = val(B[0], B[1]) - p;
    if (fa >= 0) { out.push(A); }
    if ((fa >= 0) !== (fb >= 0)) {
      var t = fa/(fa - fb);
      out.push([A[0] + t*(B[0] - A[0]), A[1] + t*(B[1] - A[1])]);
    }
  }
  return out;
}
var high = board.create('curve', [[0], [0]], {
  fillColor: '#ef6c00', fillOpacity: 0.35, strokeWidth: 0
});
high.updateDataArray = function () {
  var q = above();
  if (q.length) { q = q.concat([q[0]]); }
  this.dataX = q.map(function (r) { return r[0]; });
  this.dataY = q.map(function (r) { return r[1]; });
};
// Mållinjen 5x + cy = P, som du skyver med P.
board.create('line', [function () { return -P.Value(); }, 5,
                      function () { return c.Value(); }], {
  strokeColor: '#ef6c00', dash: 2, strokeWidth: 2, fixed: true
});
// Beste hjørne (rødt), og hele kanten når to hjørner er like gode.
board.create('segment', [
  [function () { return V[best().idx[0]][0]; }, function () { return V[best().idx[0]][1]; }],
  [function () { var b = best(); return V[b.idx[b.idx.length-1]][0]; },
   function () { var b = best(); return V[b.idx[b.idx.length-1]][1]; }]
], {strokeColor: '#c62828', strokeWidth: 5, fixed: true});
board.create('point', [function () { return V[best().idx[0]][0]; },
                       function () { return V[best().idx[0]][1]; }], {
  name: '', size: 5, color: '#c62828', fixed: true
});
// Planen Z kan dras rundt i området (rutenett 0.25).
var Z = board.create('point', [2, 1], {
  name: 'Z', size: 4, color: '#2e7d32', label: {offset: [8, -12], fontSize: 13}
});
var lastZ = [2, 1];
function feasible(x, y) {
  return 2*x + y <= 9 + 1e-9 && x + 2*y <= 9 + 1e-9 && x <= 4 + 1e-9 && x >= -1e-9 && y >= -1e-9;
}
Z.on('drag', function () {
  var x = Math.round(4*Z.X())/4, y = Math.round(4*Z.Y())/4;
  if (!feasible(x, y)) { x = lastZ[0]; y = lastZ[1]; }
  lastZ = [x, y];
  Z.moveTo([x, y]);
});
// Del området i trekanter fra (0, 0) og finn vektene til Z i sin trekant.
function weights() {
  var x = Z.X(), y = Z.Y();
  for (var i = 1; i < V.length - 1; i++) {
    var B = V[i], C = V[i + 1], det = B[0]*C[1] - B[1]*C[0];
    var wb = (x*C[1] - y*C[0])/det, wc = (B[0]*y - B[1]*x)/det, wa = 1 - wb - wc;
    if (wa > -1e-9 && wb > -1e-9 && wc > -1e-9) { return {i: i, w: [wa, wb, wc]}; }
  }
  return {i: 1, w: [1, 0, 0]};
}
var tri = board.create('curve', [[0], [0]], {
  fillColor: '#2e7d32', fillOpacity: 0.15, strokeColor: '#2e7d32', strokeWidth: 1, dash: 1
});
tri.updateDataArray = function () {
  var k = weights().i, q = [V[0], V[k], V[k + 1], V[0]];
  this.dataX = q.map(function (r) { return r[0]; });
  this.dataY = q.map(function (r) { return r[1]; });
};
board.create('text', [xl, row(0), function () {
  var b = best(), p = P.Value();
  if (p < b.m - 1e-9) { return 'Oransje: planer med 5x + ' + fmt(c.Value()) + 'y ≥ ' + fmt(p); }
  if (p < b.m + 1e-9) {
    return b.idx.length > 1 ? 'Linjen berører hele kanten ' + name(V[b.idx[0]]) + '–' + name(V[b.idx[b.idx.length - 1]])
                            : 'Linjen berører bare hjørnet ' + name(V[b.idx[0]]);
  }
  return 'Ingen tillatt plan gir så mye som ' + fmt(p);
}], {fontSize: fs, color: '#263238', fixed: true});
board.create('text', [xl, row(1), function () {
  return 'Z = ' + name([Z.X(), Z.Y()]) + ' ligger i trekanten';
}], {fontSize: fs, color: '#2e7d32', fixed: true});
board.create('text', [xl, row(2), function () {
  var k = weights().i;
  return name(V[0]) + ', ' + name(V[k]) + ', ' + name(V[k + 1]) + ' med vekter';
}], {fontSize: fs, color: '#2e7d32', fixed: true});
board.create('text', [xl, row(3), function () {
  var r = weights(), k = r.i, q = [V[0], V[k], V[k + 1]];
  return r.w.map(fmt).join(', ') + ' og P = ' + q.map(function (v) { return fmt(val(v[0], v[1])); }).join(', ');
}], {fontSize: fs, color: '#2e7d32', fixed: true});
board.create('text', [xl, row(4), function () {
  var r = weights(), k = r.i, q = [V[0], V[k], V[k + 1]];
  var parts = q.map(function (v, j) { return r.w[j]*val(v[0], v[1]); });
  return 'P(Z) = ' + parts.map(fmt).join(' + ') + ' = ' + fmt(val(Z.X(), Z.Y())) + ' ≤ ' + fmt(best().m);
}], {fontSize: fs, color: '#263238', fixed: true});
  }
  if (host.clientWidth > 0 && host.clientHeight > 0) {
    initialize();
  } else {
    var pending = new ResizeObserver(function () {
      if (host.clientWidth > 0 && host.clientHeight > 0) {
        pending.disconnect();
        initialize();
      }
    });
    pending.observe(host);
  }
})();
```

**Hva viser bildet?**

- **Siste berøring:** Den oransje delen krymper mot det røde hjørnet og forsvinner når $P$ går forbi 27: ingen tillatt plan gir mer, og det siste linjen berørte, var hjørnet $(3,3)$.
- **En hel kant:** Med $c=10$ berører linjen til slutt hele kanten mellom $(3,3)$ og $(0,9/2)$, slik vi så ved knekkpunktene i forsøket.
- **Verdien inni området:** For punktet $Z$ er $P(Z)$ det samme veide gjennomsnittet av hjørneverdiene som $Z$ er av hjørnene. I $Z=(2,1)$ er vektene $4/9$, $1/3$ og $2/9$, som i blandingen over, og $P(Z)=0+8+6=14$.

Et gjennomsnitt kan aldri bli større enn det største tallet det er laget av, så ingen plan slår det beste hjørnet.

Bildet gir også en **stoppregel**: hvis ingen av de to kantene ut fra et hjørne gir høyere $P$, er hjørnet det beste.

- **Eksistens:** At et beste svar finnes, følger av ekstremalverdisetningen fra [uke 8](uke8.qmd#uke8-kompakt).
- **Stoppregelen:** Den bygger på konveksitet fra [uke 8](uke8.qmd#uke8-lokalt).

Begrunnelsene står i *Gå i dybden* under.

::: {.reading-step title="Gå i dybden: hvorfor ligger det beste svaret i et hjørne?"}

Vi viser først med tall at verdien i en plan inni området er et gjennomsnitt av hjørneverdiene. Deretter ser vi hvorfor slike vekter finnes for hver plan, og til slutt bruker vi to av ideene fra uke 8.

::: {.callout-note title="Håndeksempel: verdien inni er et gjennomsnitt av hjørneverdiene"}

**Utgangspunkt.** Planen $(2,1)$ ligger inni området og gir $P=5\cdot2+4\cdot1=14$. Vi skriver den som et veid gjennomsnitt av hjørnene $(0,0)$, $(4,0)$ og $(3,3)$.

**Prøv selv.** Finn vekter $\alpha,\beta,\gamma\ge0$ med $\alpha+\beta+\gamma=1$ og $\alpha(0,0)+\beta(4,0)+\gamma(3,3)=(2,1)$.

**Regnegangen.**

1. Andre koordinat: $\alpha\cdot0+\beta\cdot0+\gamma\cdot3=1$, så $\gamma=1/3$.
2. Første koordinat: $\alpha\cdot0+\beta\cdot4+\gamma\cdot3=2$, altså $4\beta+1=2$, $4\beta=1$ og $\beta=1/4$.
3. Vektene skal summere til 1: $\alpha=1-\tfrac14-\tfrac13=\tfrac{12-3-4}{12}=\tfrac{5}{12}\ge0$.
4. Målet er lineært, så vi kan bruke de samme vektene på målverdiene:
   $P(2,1)=\tfrac{5}{12}\cdot P(0,0)+\tfrac14\cdot P(4,0)+\tfrac13\cdot P(3,3)=\tfrac{5}{12}\cdot0+\tfrac14\cdot20+\tfrac13\cdot27=0+5+9=14.$
5. Et veid gjennomsnitt kan ikke være større enn det største tallet det er laget av: $14\le27$.

**Dette tar vi med oss.** Hver plan i området er et veid gjennomsnitt av hjørnene, og $P$ i planen er samme gjennomsnitt av hjørneverdiene. Derfor kan ingen plan gi mer enn det beste hjørnet, her 27.

:::

Appleten brukte trekanten $(0,0)$, $(4,1)$, $(3,3)$ og fikk andre vekter for den samme planen, men samme verdi 14: vektene er ikke entydige.

**Hvorfor finnes slike vekter for hver plan?** Ta et punkt $z$ i området, for eksempel $z=(2,1)$. Trekk en stråle fra hjørnet $(0,0)$ gjennom $z$. Punktene på strålen er $t(2,1)$ med $t\ge0$.

1. **Finn kanten strålen treffer.** Strålen forlater området der den treffer en kant. Kravene gir:

   | Krav på strålen | Grense for $t$ |
   |:--|:--|
   | Maskinkravet: $2(2t)+t=5t\le9$ | $t\le9/5$ |
   | Arbeidskravet: $2t+2t=4t\le9$ | $t\le9/4$ |
   | A-grensen: $2t\le4$ | $t\le2$ |

   Den minste grensen er $t=9/5$, altså treffer strålen maskinkanten i $e=(18/5,\,9/5)$.
2. Punktet $e$ ligger på kanten mellom $(4,1)$ og $(3,3)$: $e=\sigma(4,1)+(1-\sigma)(3,3)$ gir i første koordinat $3+\sigma=18/5$, så $\sigma=3/5$. Kontroll i andre koordinat: $\tfrac35\cdot1+\tfrac25\cdot3=\tfrac35+\tfrac65=\tfrac95$.
3. Punktet $z$ ligger på linjestykket mellom $(0,0)$ og $e$: $z=\tfrac59e+\tfrac49(0,0)$, fordi $\tfrac59\cdot\tfrac{18}{5}=2$ og $\tfrac59\cdot\tfrac95=1$.
4. Sett inn steg 2 i steg 3: $z=\tfrac49(0,0)+\tfrac59\cdot\tfrac35(4,1)+\tfrac59\cdot\tfrac25(3,3)=\tfrac49(0,0)+\tfrac13(4,1)+\tfrac29(3,3)$. Vektene er ikke-negative og summerer til $\tfrac49+\tfrac39+\tfrac29=1$.
5. Kontroll med målet: $\tfrac13\cdot24+\tfrac29\cdot27=8+6=14=P(2,1)$.

Samme konstruksjon virker for hvert punkt: strålen fra et hjørne treffer en kant, punktet på kanten er et gjennomsnitt av kantens to endepunkter, og $z$ er et gjennomsnitt av startpunktet og treffpunktet.

**Fra gjennomsnitt til hjørne, med eksistens og konveksitet fra uke 8.**

1. **Området er konvekst.** Hvert krav gir et halvplan, og snittet av halvplan er konvekst: linjestykket mellom to tillatte planer ligger helt i området, slik vi definerte konveksitet i [uke 8](uke8.qmd#uke8-lokalt).
2. **Et beste svar finnes.** Området er ikke-tomt ($(0,0)$ er en tillatt plan), lukket (grensene er med) og begrenset ($0\le x\le4$ og $0\le y\le9/2$), altså kompakt. $P$ er kontinuerlig, så ekstremalverdisetningen fra [uke 8](uke8.qmd#uke8-kompakt) gir et maksimum.
3. **Lokalt er globalt.** Å maksimere $P$ er det samme som å minimere $-P$, og en lineær funksjon er konveks. På en konveks mengde er da hvert lokalt maksimum av $P$ også globalt.

   I et hjørne går alle tillatte retninger inn mellom de to kantene som møtes der. Hvis $P$ ikke øker langs noen av de to kantene, øker $P$ ikke i noen tillatt retning: hjørnet er et lokalt maksimum, og dermed et globalt.

Punkt 3 er stoppregelen: en metode kan stoppe ved det første hjørnet som ikke har et bedre nabohjørne.

:::

::: {.reading-step title="Gå i dybden: hvorfor er $(3,3)$ et lokalt maksimum?"}

De to kantene fra $(3,3)$ gir disse retningene:

- **Mot $(4,1)$:** $(4,1)-(3,3)=(1,-2)=d_1$.
- **Mot $(0,9/2)$:** $(0,9/2)-(3,3)=(-3,3/2)$, eller kortere $d_2=(-2,1)$.

Endringen i $P$ per steg i retningen $d$ er den retningsderiverte $\nabla P\cdot d$, med $\nabla P=(5,4)$:

$$\nabla P\cdot d_1=5\cdot1+4\cdot(-2)=5-8=-3,\qquad \nabla P\cdot d_2=5\cdot(-2)+4\cdot1=-10+4=-6.$$

- **Alle tillatte retninger:** En tillatt retning fra hjørnet peker inn i vinkelen mellom de to kantene, så den kan skrives $d=k_1d_1+k_2d_2$ med $k_1,k_2\ge0$.
- **Et eksempel:** $d=(-1,-1)$ peker inn i området, og $(-1,-1)=1\cdot(1,-2)+1\cdot(-2,1)$.

Siden $\nabla P\cdot d$ er lineær i $d$, er

$$\nabla P\cdot d=k_1(\nabla P\cdot d_1)+k_2(\nabla P\cdot d_2)=-3k_1-6k_2\le0.$$

Ingen tillatt retning øker $P$. Hjørnet er et lokalt maksimum, og etter punkt 3 i boksen over også et globalt.

:::

::: {.reading-step title="Gå i dybden: hvorfor er snittet av halvplan konvekst?"}

Hvis to planer $(x_1,y_1)$ og $(x_2,y_2)$ oppfyller for eksempel $2x+y\le9$, gjør også hvert punkt på linjestykket mellom dem det:
$$2\bigl(tx_1+(1-t)x_2\bigr)+\bigl(ty_1+(1-t)y_2\bigr)=t(2x_1+y_1)+(1-t)(2x_2+y_2)\le t\cdot9+(1-t)\cdot9=9$$
for $0\le t\le1$. Et punkt som oppfyller alle fem kravene, ligger i alle fem halvplanene. Linjestykket mellom to slike punkter ligger derfor også i alle fem, og mangekanten er en konveks mengde.

:::

::: {.reading-step title="Gå i dybden: når hjørneargumentet ikke gjelder"}

- **Vilkåret for argumentet:** En LP kan også ha et tomt tillatt område eller et mål som kan bli vilkårlig stort. Hjørneargumentet over gjelder vårt ikke-tomme, begrensede område.
- **Hvorfor grensene trengs:** Gradienten $\nabla P=(5,4)$ er konstant og Hessianen er null. Det finnes derfor ikke noe indre stasjonært punkt av den typen de lokale testene fra [uke 8](uke8.qmd#uke8-hessian) og [uke 10](uke10.qmd) undersøkte; det er grensene som stopper forbedringen.

Et ubegrenset område kan likevel ha et optimum. For eksempel har $\min(x+y)$ under $x,y\ge0$ minimum 0 i hjørnet $(0,0)$, selv om området ikke er kompakt. Ekstremalverdisetningen er tilstrekkelig, ikke nødvendig.

:::

### Hjørner er løsninger av lineære likningssett

::: {#uke11-hjorner}
:::

Hvordan finner vi hjørnene uten å tegne? Med mange produkter kan eieren ikke tegne området, så vi trenger en regnemåte. Den bygger på at et hjørne er et sted der to grenser møtes.

- **Aktiv grense:** En grense er **aktiv** i en plan når planen bruker opp akkurat så mye som finnes. I $(3,3)$ er maskintimene og arbeidstimene begge brukt opp, så de to grensene er aktive der. A-grensen er ikke aktiv, for kundene vil kjøpe ett A-parti til.
- **Et hjørne har to aktive grenser.** Hjørnet ligger der to grenselinjer krysser hverandre.

Slik finner vi et hjørne:

1. **Velg to grenser og anta at begge er brukt opp.** Da blir grensene til likninger, og vi får et lineært likningssett med to likninger og to ukjente, som i [uke 3](uke3.qmd#uke3-stotte-matriser). For maskintimer og arbeidstimer er det $2x+y=9$ og $x+2y=9$. Løsningen er stedet der de to linjene krysser hverandre.
2. **Sjekk de andre kravene.** Skjæringspunktet er bare en tillatt plan hvis alle de andre kravene også er oppfylt. Det er forskjellen fra et vanlig likningssett: etterpå må vi sjekke *ulikhetene*.

Verkstedet har fem grenser: maskintimer, arbeidstimer, A-grensen, $x=0$ og $y=0$. Det gir $\binom52=\frac{5\cdot4}{2}=10$ måter å velge to av dem på. Hvert av de ti parene er en **kandidat**: et mulig hjørne som vi må regne ut og sjekke.

::: {.callout-note title="Håndeksempel: tre par av aktive grenser"}

**Utgangspunkt.** Velg to grenser, skriv dem som likninger og løs likningssettet. Kontroller deretter de tre andre kravene.

**Prøv selv.** Undersøk paret maskintimer og arbeidstimer, paret arbeidstimer og A-grense, og paret A-grense og $x=0$.

**Regnegangen.**

1. **Maskintimer og arbeidstimer:** $2x+y=9$ og $x+2y=9$.
   - Trekk den andre likningen fra den første: $x-y=0$, så $x=y$.
   - Sett inn i den første: $3x=9$, altså $(x,y)=(3,3)$.
   - Kontroller A-grensen: $3\le4$, og $x,y\ge0$. Punktet er et hjørne.
2. **Arbeidstimer og A-grense:** $x+2y=9$ og $x=4$.
   - Sett inn: $4+2y=9$, så $y=5/2$.
   - Kontroller maskintimer: $2\cdot4+5/2=21/2>9$. Linjene skjærer hverandre, men skjæringspunktet er ikke en tillatt plan.
3. **A-grense og $x=0$:** $x=4$ og $x=0$ er to loddrette linjer som aldri krysser hverandre. Likningssettet har ingen løsning.
   - Tallene foran $x$ og $y$ i de to likningene danner koeffisientmatrisen $\begin{pmatrix}1&0\\1&0\end{pmatrix}$, som du kjenner fra [uke 3](uke3.qmd#uke3-stotte-matriser). Determinanten er $1\cdot0-0\cdot1=0$, og rangen er 1: begge radene er $(1,0)$, så den andre raden gir ingen ny retning. Determinanten er null nøyaktig når linjene er parallelle (eller er samme linje). Da kaller vi likningssettet **singulært**.

**Dette tar vi med oss.** Et hjørne krever to aktive grenser som krysser hverandre i nøyaktig ett punkt (determinanten er ikke null, så likningssettet er *ikke-singulært*), *og* at punktet oppfyller alle de andre kravene.

:::

Går vi gjennom alle ti par på samme måte, får vi **5 hjørner**, **4 skjæringspunkter utenfor området** (linjene krysser hverandre, men punktet bryter et annet krav) og **1 singulært par** (parallelle linjer). Det er de fem hjørnene som kan være den beste planen, og for dem har vi allerede regnet ut $P$ i hjørnetabellen.

**Øv på dette:** [hjørne, utenfor eller singulært?](#uke11-oppg-par) i 11.5 og [finn alle hjørnene](#uke11-kode-hjorner) i 11.6.

::: {.reading-step title="Gå i dybden: alle ti par i én figur"}

Figuren viser de fem grenselinjene og alle ni skjæringspunktene. Det tiende paret, $x=4$ og $x=0$, har ikke noe skjæringspunkt: de to loddrette linjene er parallelle.

```{pyodide-python}
#| label: week11-pairs
# Fem hjørner og fire skjæringspunkter utenfor området; x = 4 og x = 0 skjærer aldri.
vertices = [(3, 3), (4, 1), (0, 4.5), (4, 0), (0, 0)]
outside = [(0, 9), (4.5, 0), (4, 2.5), (9, 0)]
show_pairs(vertices, outside)
```

:::

### Antall kandidater eksploderer

Verkstedet har 10 kandidater, og det er lett å gå gjennom dem. Men antallet vokser enormt med antall produkter og krav. Et problem med 50 produkter og 100 krav har mer enn $10^{40}$ kandidater. Å løse alle likningssettene er derfor ingen brukbar metode. Eieren trenger en metode som slipper å se på dem alle.

::: {.reading-step title="Gå i dybden: hvor mange kandidater finnes det?"}

Slik teller vi mulige valg av aktive grenser:

1. **Velg antall grenser:** Med $n$ variabler bestemmes et hjørne av $n$ aktive grenser, altså et lineært likningssett med $n$ likninger og $n$ ukjente. Med $m$ ressurskrav og $n$ fortegnskrav velger vi $n$ av $m+n$ grenser.
2. **Tell ordnede valg:** Den første grensen kan velges på $m+n$ måter, den neste på $m+n-1$ måter, og så videre ned til $m+1$ måter for den $n$-te.
3. **Fjern gjentakelsene:** Rekkefølgen spiller ingen rolle, og de $n$ valgte grensene kan ordnes på $n!$ måter. Antall valg er derfor binomialkoeffisienten

$$\binom{m+n}{n}=\frac{(m+n)(m+n-1)\cdots(m+1)}{n!}=\frac{(m+n)!}{n!\,m!}.$$

| Problem | Antall valg |
|:--|:--|
| Verkstedet: $m=3$ og $n=2$ | $\binom52=\frac{5\cdot4}{2\cdot1}=10$, nøyaktig de ti parene over |
| $n=10$ og $m=20$ | $\binom{30}{10}\approx3.0\cdot10^7$ |
| $n=50$ og $m=100$ | $\binom{150}{50}\approx2.0\cdot10^{40}$ |

Selv med en milliard løste likningssett per sekund tar det siste tilfellet uoverkommelig lang tid:

1. **Sekunder:** Omtrent $2.0\cdot10^{40}/10^9=2.0\cdot10^{31}$ sekunder.
2. **År:** Et år er omtrent $3.2\cdot10^7$ sekunder, så det blir omtrent $6\cdot10^{23}$ år.

:::

### Simpleksmetoden går langs kantene

Heldigvis trenger vi ikke å regne på alle kandidatene. Tenk deg at du står i et hjørne og spør: finnes det et nabohjørne som gir mer? Hvis ja, gå dit. Hvis nei, stopp. Dette er ideen i **simpleksmetoden**, den klassiske metoden for lineær programmering.

To nabohjørner ligger i hver sin ende av én kant, og de deler én aktiv grense. Et steg bytter derfor ut én av de to likningene i likningssettet. I verkstedet kan en slik bane se slik ut:

| Hjørne | Aktive grenser | $P$ |
|:--|:--|--:|
| $(0,0)$ | $x=0$, $y=0$ | 0 |
| $(4,0)$ | $y=0$, A-grense | 20 |
| $(4,1)$ | A-grense, maskintimer | 24 |
| $(3,3)$ | maskintimer, arbeidstimer | 27 |

**Hvordan ser banen ut i området?** Cellen tegner de fire hjørnene fra tabellen som en bane. Legg merke til at hvert steg følger en kant, altså én grenselinje som er aktiv både før og etter steget. Målet er å se at metoden går langs kantene og aldri hopper rundt.

```{pyodide-python}
#| label: week11-simplex-path
# Simpleksbanen fra tabellen: hvert steg bytter én aktiv grense.
show_region(corners, path=[(0, 0), (4, 0), (4, 1), (3, 3)], best=(3, 3), title="Simpleksbanen")
```

**Hva viser banen?**

- **Stoppunktet:** I $(3,3)$ er begge nabohjørnene dårligere: $(4,1)$ gir 24 og $(0,9/2)$ gir 18. Metoden stopper, og stoppregelen fra [Hvorfor ligger optimum i et hjørne?](#uke11-hvorfor) sier at et hjørne uten bedre nabo er best av alle.
- **Arbeidet underveis:** Banen besøkte fire av de ti kandidatene. Den løste aldri de singulære likningssettene (parallelle linjer) eller likningssettene med løsninger utenfor området.
- **Andre metoder:** Bare til orientering: **indrepunktmetoder** går i stedet gjennom innsiden av området mot optimum. Begge typene metoder finnes i HiGHS, løseren som `linprog` bruker.

**Svaret til eieren:** Eieren slipper å sjekke alle kandidatene. Det holder å gå fra hjørne til hjørne til ingen nabo er bedre.

## 11.2 Finn planen med `linprog`

::: {#uke11-linprog}
:::

### Fra tegning til løser

Til nå har vi funnet den beste planen ved å tegne området og regne ut $P$ i fem hjørner. Det går med to produkter. Med tjue produkter kan vi ikke tegne, og antallet hjørner blir enormt. Vi trenger en løser som går langs kantene for oss, slik simpleksmetoden gjør.

Python-biblioteket SciPy har en slik løser: funksjonen `linprog` (navnet kommer av «lineær programmering»). Selve metoden inne i `linprog` (HiGHS) får vi ferdig laget, men svaret kontrollerer vi selv.

Løseren trenger de samme tallene som står i tabellene i 11.1. Vi samler dem i vektorer og en matrise, som i [uke 3](uke3.qmd#uke3-stotte-matriser).

- **Kolonnene** står i produktrekkefølgen A, B.
- **Radene** står i kravrekkefølgen maskintimer, arbeidstimer, A-grense.
- **Navnet $A$:** Matrisen $A$ har ikke noe med produkt A å gjøre.

| Symbol | Betydning | Verdi |
|:--|:--|:--|
| $z$ | Antall partier A, B | $(x,y)$ |
| $p$ | Fortjeneste per parti A, B | $(5,4)$ |
| $b$ | Kapasitet per rad i $A$ | $(9,9,4)$ |

$$A=\begin{pmatrix}2&1\\1&2\\1&0\end{pmatrix},\qquad Az\le b.$$

Rad $i$ i $A$ sier hvor mye ett parti av hvert produkt bruker av krav $i$, så $Az\le b$ er de tre kravene fra 11.1 skrevet kort.

- **Målet:** SciPys `linprog` **minimerer**. For å maksimere $p^Tz$ sender vi derfor inn `-p`.
- **Kravene:** Argumentene `A_ub`, `b_ub` angir radene $Az\le b$, mens `bounds=(0,None)` gir både $x$ og $y$ nedre grense null.

Løseren svarer med en **status**, en plan og slakken i hver rad (hvor mye av hver kapasitet som blir til overs). Statusen er en kode som sier om løseren fant en brukbar plan, så sjekk den før du leser planen:

| Status | Tolkning |
|:--|:--|
| 0 | Den fant en beste plan (et optimum). |
| 2 | Ingen plan oppfyller alle kravene (**umulig**), for eksempel hvis ett krav sier «minst 2» og et annet «høyst 1». |
| 3 | Målet kan gjøres så stort vi vil, fordi ingenting stopper det (**ubegrenset**). |

To små eksempler på de to siste statusene står i [11.6](#uke11-python).

Målet er å få samme plan, fortjeneste og slakk som i hjørnetabellen, og å se at løseren finner det nye hjørnet når en fortjeneste endres, slik som i eksperiment 1.

### Eksperiment 2 – kontroller hjørnetabellen med `linprog`

- Kjør cellen og sammenlign plan, fortjeneste og slakk med hjørnetabellen i 11.1.
- Sammenlign `Slakk fra SciPy` med `Kontroll b - A @ z`. Hvilken grense er ikke aktiv?
- Bytt `p` til `[5., 12.]`. Forutsi med eksperiment 1 hvilket hjørne som blir best, og kjør.

Cellen sender tallene fra tabellene til `linprog` og skriver ut status, plan, fortjeneste og slakk. Den siste linjen regner slakken på nytt som $b-Az$, som kontroll.

```{pyodide-python}
#| label: week11-highs
# Fortjeneste per parti (A, B) i tusen kroner. Rader: maskintimer, arbeidstimer, A-grense.
p = np.array([5., 4.])
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])

# SciPy minimerer: -p gjør minimum av -P til maksimum av P. bounds: x, y >= 0.
result = linprog(-p, A_ub=A, b_ub=b, bounds=(0, None), method="highs")
print("Status:", result.status, "-", result.message)
if result.success:                       # x og fun finnes bare ved et optimum
    print("Plan (A, B):        ", result.x)
    print("Fortjeneste:        ", -result.fun)
    print("Slakk fra SciPy:    ", result.ineqlin.residual)
    print("Kontroll b - A @ z: ", b - A @ result.x)
```

**Hva viser forsøket?**

- **Opprinnelig fortjeneste:** Status 0 gir planen $(3,3)$, verdien 27 og slakken $(0,0,1)$, det samme som hjørnetabellen. Slakken sier at maskin- og arbeidstimene er brukt opp, og at kundene vil kjøpe ett A-parti til.
- **Fortegn og avrunding:** `result.fun=-27` er minsteverdien av $-P$, funksjonen SciPy faktisk minimerte; derfor snur vi fortegnet. Flyttallsregning (se uke 1) kan gi små avvik fra null.
- **Endret fortjeneste:** Med $p=(5,12)$ hopper planen til $(0,9/2)$ med verdi 54, fordi $c=12>10$, slik eksperiment 1 forutsa.

Løseren bekrefter tabellen: lag tre partier av hver og tjen 27 tusen kroner. Statusen sier bare noe om modellen vi skrev inn. Har vi skrevet et produksjonskrav feil, retter ikke løseren det.

::: {.reading-step title="Gå i dybden: skriv andre krav på samme form"}

SciPy tar imot krav på formen «bruk $\le$ kapasitet», altså $Az\le b$. Et krav som sier «minst», for eksempel $x+y\ge2$ (minst to partier til sammen), skrives derfor $-x-y\le-2$: både tallene foran variablene og høyresiden skifter fortegn. Likninger kan gis direkte med `A_eq` og `b_eq`.

En **fri variabel** er et tall som kan være både positivt og negativt (antall partier kan ikke være negativt, men for eksempel en endring kan). Hvis $y$ er fri, kan vi skrive $y=y_+-y_-$ med $y_+,y_-\ge0$.

- **Eksempel:** $y=-3$ representeres av $y_+=0$, $y_-=3$. Kravet over blir da $-x-y_++y_-\le-2$.
- **To valg i modellen:** Med denne omskrivingen kan vi bruke bare ikke-negative variabler. Alternativt kan vi gi $y$ grensene `(None, None)` direkte i `linprog`.

En **slakkvariabel** gjør ubrukt kapasitet til et eget tall: $2x+y\le9$ er det samme som $2x+y+s=9$ med $s\ge0$. Her er $s$ antall maskintimer som blir til overs.

- **Eksempler:** Ved planen $(4,1)$ er $s=0$; ved $(3,2)$ er $s=1$.
- **Standardform:** Å samle alle krav i én slik avtalt form kalles å skrive problemet på **standardform**. Lærebøker og programmer bruker ulike former, noen med ulikheter og noen med likninger; si derfor alltid hvilken form du bruker.

:::

**Øv på dette:** [umulig eller ubegrenset?](#uke11-oppg-status) i 11.5 og [send modellen til SciPy](#uke11-kode-linprog) i 11.6.

## 11.3 Ressurspriser gir en øvre grense

::: {#uke11-dual}
:::

### Prøv to prisforslag

Både hjørnetabellen og løseren sier at $(3,3)$ gir 27 tusen kroner. Men hvordan kan eieren være sikker på at ingen plan vi har oversett, er bedre? Her lager vi et bevis som eieren kan kontrollere selv med noen få multiplikasjoner. Beviset er en **øvre grense**: et tall som ingen tillatt plan kan komme over. Hvis en plan når akkurat dette tallet, finnes det ingen bedre.

Ideen er å se på verkstedets ressurser fra en annen side. **Tenk deg at et annet firma vil leie hele verkstedet i en uke:** alle 9 maskintimene, alle 9 arbeidstimene og de 4 salgsplassene for A (retten til å selge til A-kundene). Firmaet tilbyr en pris per enhet, målt i tusen kroner:

- $u$ per maskintime, $v$ per arbeidstime og $w$ per salgsplass for A.

Slike priser kaller vi **ressurspriser**. De er ikke kostnader for verkstedet: timene finnes uansett, og materialene er allerede trukket fra i fortjenesten. Ressursprisene er et tilbud, altså hva ressursene kunne vært leid ut for. I 11.4 ser vi at de beste prisene også sier hva én enhet mer er verdt for eieren.

**Når bør eieren si ja?** Eieren kan bruke ressursene på to måter: produsere selv eller leie dem ut.

- **Ett parti A** bruker 2 maskintimer, 1 arbeidstime og én salgsplass. Leid ut gir de samme ressursene $2u+v+w$. Det kaller vi partiets **leieverdi**. Produsert gir partiet fortjenesten 5.
- **Ett parti B** bruker 1 maskintime og 2 arbeidstimer. Leieverdien er $u+2v$, og fortjenesten er 4.

Eieren sier bare ja hvis utleie aldri lønner seg dårligere enn å produsere:
$$2u+v+w\ge5\qquad\text{og}\qquad u+2v\ge4.$$
Priser som oppfyller dette (og ikke er negative), kaller vi **gyldige**. Leien for hele verkstedet er $9u+9v+4w$.

**Hvorfor gir gyldige priser en øvre grense?** Med gyldige priser kan ingen plan gi mer fortjeneste enn leien for hele verkstedet. Ta prisene $(u,v,w)=(3,1,0)$ og planen $(2,1)$:

1. **Hvert parti for seg:** Et parti A har leieverdi $2\cdot3+1+0=7$ og gir 5 i fortjeneste. Et parti B har leieverdi $3+2\cdot1=5$ og gir 4. Hvert parti gir minst like mye leid ut som produsert.
2. **Hele planen:** Planen gir $2\cdot5+4=14$ i fortjeneste. Leid ut ville ressursene planen bruker, gitt $2\cdot7+5=19$. Altså er $14\le19$.
3. **Hele verkstedet:** Planen bruker ikke mer enn verkstedet har, og prisene er ikke negative. Leien for ressursene planen bruker, er derfor høyst leien for alt: $19\le9\cdot3+9\cdot1+4\cdot0=36$.

Til sammen er $14\le19\le36$. De samme tre stegene virker for *hver* tillatt plan, ikke bare $(2,1)$. Ingen plan kan derfor gi mer enn 36 tusen kroner. Det er den øvre grensen prisene gir.

**Leietakerens ønske.** Firmaet vil betale så lite som mulig, men eieren må fortsatt si ja. Jo lavere en gyldig leie er, desto skarpere er grensen. Prøv to forslag $(u,v,w)$:

| Beregning | Forslag $(3,1,0)$ | Forslag $(2,1,0)$ |
|:--|--:|--:|
| Leieverdi per A-parti $2u+v+w$ | 7 | 5 |
| Leieverdi per B-parti $u+2v$ | 5 | 4 |
| Gyldig: minst fortjenestene 5 og 4? | ja | ja |
| Leie for hele verkstedet $9u+9v+4w$ | 36 | 27 |

Begge forslagene gir en gyldig øvre grense. Vi skriver regningen ut for begge. For det første forslaget ganger vi maskintimekravet med 3 og arbeidstimekravet med 1, og legger sammen:

$$3(2x+y)+(x+2y)=7x+5y\le3\cdot9+9=36.$$

Siden $x,y\ge0$, er $5x+4y\le7x+5y$, så også $5x+4y\le36$.

- **Gyldig grense:** Ingen tillatt plan kommer over 36.
- **Løs grense:** Leieverdiene 7 og 5 er større enn fortjenestene 5 og 4. Firmaet betaler mer enn det trenger for å få et ja, og det overskuddet går tapt i ulikheten. Grensen 36 ligger langt over det beste verkstedet kan tjene.

For det andre forslaget ganger vi maskintimekravet med 2 og arbeidstimekravet med 1:

$$2(2x+y)+(x+2y)=5x+4y\le2\cdot9+9=27.$$

- **Leieverdi lik fortjeneste:** Her er leieverdiene nøyaktig lik fortjenestene. Firmaet betaler akkurat nok, og ingenting går tapt.
- **Beviset:** Ingen tillatt plan kan gi mer enn 27, mens $(3,3)$ gir 27. Vi har et **optimalitetssertifikat**: et bevis for at planen er best, som vi kan kontrollere uten å undersøke flere planer.
- **Ubrukt A-kapasitet:** Prisen på salgsplassene for A er null. Det er rimelig: kundene vil kjøpe ett A-parti mer enn verkstedet lager, så eieren taper ingenting på å gi fra seg en salgsplass. Å øke bare denne grensen litt hjelper ikke nå.

**Svaret til eieren:** Prisene $(2,1,0)$ beviser at 27 tusen kroner er det mest verkstedet kan tjene. Planen $(3,3)$ er best. Med disse prisene er det likegyldig for eieren om han produserer $(3,3)$ eller leier ut hele verkstedet: begge gir 27 tusen kroner.

### Fra prisforslag til et nytt optimeringsproblem

Nå spør vi: hvilke priser gir det beste beviset? Det beste beviset er den laveste øvre grensen. Det er nettopp leietakerens problem: lavest mulig leie for hele verkstedet, men slik at eieren sier ja. Det er et eget optimeringsproblem. Alle tre prisene må være ikke-negative, og leieverdien må være **minst** fortjenesten per parti, ellers ville eieren heller produsere:

| Eierens krav | Leieverdi (ressurser per parti × pris) | Krav |
|:--|:--|:--|
| A-parti | $2u+v+w$ | $2u+v+w\ge5$ |
| B-parti | $u+2v$ | $u+2v\ge4$ |
| Prisene | $u,v,w$ | $u,v,w\ge0$ |

For hver tillatt plan og hvert gyldig prisvalg får vi den vektede ulikheten

$$5x+4y\le(2u+v+w)x+(u+2v)y\le9u+9v+4w.$$

Les ulikheten fra venstre: fortjenesten er høyst leieverdien av ressursene planen bruker, og den er høyst leien for hele verkstedet. Regningen er den samme som for de to forslagene over:

1. Gang hvert krav med sin ikke-negative pris, legg sammen, og bruk at leieverdiene er minst like store som fortjenestene.
2. Planen $(3,3)$ gir $5\cdot3+4\cdot3=27$, og prisene $(2,1,0)$ gir $9\cdot2+9\cdot1+4\cdot0=27$.
3. Planen når grensen, så ingen tillatt plan er bedre.

::: {.reading-step title="Gå i dybden: hvorfor gir gyldige priser alltid en øvre grense?"}

Vi går gjennom de to ulikhetene i den vektede ulikheten, én om gangen.

1. Pris hvert produkt: $2u+v+w\ge5$ og $u+2v\ge4$. Siden $x,y\ge0$, gir dette $5x+4y\le(2u+v+w)x+(u+2v)y$.
2. **Samle ressursene:** $(2u+v+w)x+(u+2v)y=(2x+y)u+(x+2y)v+xw$.

   Bruk så kapasitetene: $(2x+y)u+(x+2y)v+xw\le9u+9v+4w$. Her kan vi gange kravene med prisene uten å snu ulikhetene, fordi $u,v,w\ge0$.

Steg 1 bruker at $x,y\ge0$, og steg 2 bruker at $u,v,w\ge0$. Med negative tall ville en av ulikhetene snudd. Boksen *andre fortegn i primalen* lenger ned viser hva som skjer med prisene når kravene har andre fortegn.

:::

**Primal og dual.** Vi har nå to oppgaver som hører sammen, og de har egne navn som brukes overalt i optimering:

| Navn | Hva det er for verkstedet |
|:--|:--|
| **Primalen** (det primale problemet) | Eierens oppgave: finn planen med størst fortjeneste. |
| **Dualen** (det duale problemet) | Leietakerens oppgave: finn gyldige priser som gir lavest mulig leie for hele verkstedet, altså lavest mulig øvre grense. |
| **Dualvariabler** (dualverdier) | Prisene $u,v,w$ på maskintimer, arbeidstimer og salgsplasser for A, altså ressursprisene. I økonomi kalles de **skyggepriser**. |
| **Svak dualitet** | Ingen plan kan gi mer enn grensen fra et gyldig prisvalg. Det er beviset over. |
| **Sterk dualitet** | Den beste planen og den laveste gyldige leien gir samme tall. For verkstedet er $27=27$: eieren tjener like mye på å produsere som på å leie ut. |

Når en plan og et prisvalg gir samme tall, er begge de beste: planen er beste løsning av primalen, og prisene er beste løsning av dualen. Matriseformen som lærebøker bruker, står i *Gå i dybden* under.

Det er samme idé som tangentgrensen i [uke 8](uke8.qmd#uke8-tangent): én ulikhet som gjelder alle tillatte punkter, og et punkt som oppfyller den med likhet, er bevist best.

::: {.reading-step title="Gå i dybden: primal og dual skrevet med matriser"}

Lærebøker skriver primalen og dualen kort med vektorer og en matrise. Det er bare en annen skrivemåte for det vi allerede har gjort. Primalen (produksjonsproblemet) skrives

$$\max_{z\ge0}p^Tz\quad\text{slik at }Az\le b.$$

Hver rad i $A$ får én ikke-negativ pris i $q$; her er $q=(u,v,w)$ i rekkefølgen maskintimer, arbeidstimer, A-grense. Priskravene er $A^Tq\ge p$, fordi

$$A^Tq=\begin{pmatrix}2&1&1\\1&2&0\end{pmatrix}\begin{pmatrix}u\\v\\w\end{pmatrix}=\begin{pmatrix}2u+v+w\\u+2v\end{pmatrix},$$

nøyaktig de to leieverdiene i tabellen. Den samme vektede ulikheten gir prisproblemet (dualproblemet):

$$\min_{q\ge0}b^Tq\quad\text{slik at }A^Tq\ge p.$$

For enhver tillatt plan $z$ og ethvert gyldig prisvalg $q$ gjelder den svake dualiteten $p^Tz\le b^Tq$.

Når både produksjonsproblemet og prisproblemet har tillatte løsninger og et endelig optimum, er de beste verdiene like (**sterk dualitet**). Vårt talleksempel trenger ikke denne generelle setningen: vi har allerede funnet en tillatt plan og et gyldig prisvalg med samme verdi.

:::

### Komplementær slakk: finn prisene fra planen

::: {#uke11-slakk}
:::

Prisene $(2,1,0)$ falt ikke ned fra himmelen. Eieren kan *finne* dem ut fra planen. Først ser vi hvor gapet mellom prisgrensen og planens fortjeneste kommer fra. Er gapet null, er planen bevist best.

::: {.callout-note title="Håndeksempel: hvor kommer gapet fra?"}

**Utgangspunkt.** Planen $(3,3)$ gir 27, og prisforslaget $(3,1,0)$ gir grensen 36. Gapet er $36-27=9$.

**Prøv selv.** Regn ut slakken (ubrukt kapasitet) i hver rad, og hvor mye leieverdien ligger over fortjenesten for hvert produkt.

**Regnegangen.**

1. Slakk ved $(3,3)$: $(9-9,\ 9-9,\ 4-3)=(0,0,1)$. Pris ganger slakk: $3\cdot0+1\cdot0+0\cdot1=0$.
2. **Leieverdier med $(3,1,0)$:**
   - Leieverdien av A er $2\cdot3+1+0=7$, av B $3+2\cdot1=5$.
   - Overskuddet over fortjenesten er $7-5=2$ og $5-4=1$.
   - Mengde ganger overskudd: $3\cdot2+3\cdot1=9$.
3. Summen er $0+9=9$, nøyaktig gapet.

**Dette tar vi med oss.** Gapet er en sum av ledd av typen «pris × slakk» og «mengde × overskudd» (overskudd er hvor mye leieverdien ligger over fortjenesten). For en tillatt plan og gyldige priser er hvert ledd $\ge0$. Gapet er null bare når hvert ledd er null.

:::

Regnemåten fra håndeksemplet gjelder for alle planer og alle priser. Gapet mellom prisgrensen og planens fortjeneste er summen av fem ledd, ett for hver ressurs og ett for hvert produkt:

$$9u+9v+4w-(5x+4y)=u(9-2x-y)+v(9-x-2y)+w(4-x)+x(2u+v+w-5)+y(u+2v-4).$$

Med vektorene fra 11.2 er dette det samme som

$$b^Tq-p^Tz=\underbrace{q^T(b-Az)}_{\text{pris}\,\times\,\text{slakk}}+\underbrace{z^T(A^Tq-p)}_{\text{mengde}\,\times\,\text{overskudd i leieverdi}}\ge0.$$

**Slik leser du likningen:** Gapet består av tre ledd «pris × ubrukt kapasitet» (ett per ressurs) og to ledd «mengde × overskudd» (ett per produkt). For en tillatt plan og gyldige priser er ingen av dem negative. Likningen stemmer fordi alle de blandede leddene, som $2xu$ og $yu$, forsvinner når du ganger ut høyresiden. Regningen står i *Gå i dybden* rett under.

::: {.reading-step title="Gå i dybden: hvorfor gjelder gap-likningen for alle planer og priser?"}

Gang ut høyresiden av den første likningen:

1. **Tre første ledd:** $9u-2xu-yu+9v-xv-2yv+4w-xw$.
2. **To siste ledd:** $2xu+xv+xw-5x+yu+2yv-4y$.
3. **Ledd som forsvinner:** Leddene $2xu$, $yu$, $xv$, $2yv$ og $xw$ kommer én gang med minus og én gang med pluss.
4. **Det som står igjen:** $9u+9v+4w-5x-4y$, altså venstresiden.

Med vektorer tar det to linjer:
$$q^T(b-Az)+z^T(A^Tq-p)=q^Tb-q^TAz+z^TA^Tq-z^Tp.$$
Tallet $q^TAz$ er lik sin egen transponerte $z^TA^Tq$, så de to midterste leddene forsvinner, og det som står igjen, er $b^Tq-p^Tz$.

:::

::: {#uke11-prisbevis}
:::

Håndeksemplet så på én plan og ett prisforslag. Appleten under lar deg prøve andre planer og priser. Slik leser du den:

- **Velg priser og plan:** Med glidebryterne velger du prisene $u$, $v$ og $w$, og det grønne punktet $Z$ er en plan du kan dra rundt i området.
- **Sammenlign linjene:** Den røde linjen er prisgrensen $5x+4y=9u+9v+4w$, og den oransje, stiplede linjen går gjennom $Z$, der fortjenesten er $P(Z)$.
- **Les gapet:** Søylen til høyre viser gapet mellom dem, delt i de fem leddene: blått er pris × slakk, grønt er mengde × overskudd, og rødt er et negativt ledd. Én rute er 10 tusen kroner.

Målet er å se at gyldige priser alltid gir en grense over hele området, og å finne ut nøyaktig når gapet blir null.

- Start med prisene $(3,1,0)$ og $Z=(3,3)$, som i håndeksemplet. Finn de to grønne feltene 6 og 3 i søylen.
- Dra $Z$ rundt. Ligger den røde linjen alltid over hele området? Hvilke felt vokser når $Z$ går mot $(0,0)$?
- Prøv å få gapet til null. Hvilke priser og hvilken plan trenger du?
- Velg $(u,v,w)=(1,1,0)$. Hva går galt?

Appleten starter med prisforslaget $(3,1,0)$ og planen $Z=(3,3)$ fra håndeksemplet.

```{.jsxgraph width="620" height="730" style="width:100%;max-width:620px;height:730px;border:0;"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-0.6, 7.8, 7.2, -1.4], axis: true, keepaspectratio: true,
  showCopyright: false, showNavigation: false,
  pan: {enabled: false}, zoom: {enabled: false}
});
// Smal skjerm (mobil): glidebrytere og tekster får hver sin rad øverst, med mindre skrift.
// Posisjonene er funksjoner, så oppsettet følger med når vinduet endrer bredde.
function narrow() { return board.canvasWidth < 500; }
function ytop() { return board.getBoundingBox()[1]; }
function fs() { return board.canvasWidth < 300 ? 10 : narrow() ? 11 : 13; }
function xl() { return board.canvasWidth < 300 ? 0.12 : 0.3; }
function row(i) { return function () { return narrow() ? ytop() - 2.5 - 0.55*i : 6.55 - 0.35*i; }; }
function sliderAt(k, wide) {
  var y = function () { return narrow() ? ytop() - 0.6*(k + 1) : wide[0][1]; };
  return [[function () { return narrow() ? 0.3 : wide[0][0]; }, y],
          [function () { return narrow() ? 3.3 : wide[1][0]; }, y]];
}
// Ressursprisene u, v, w (tusen kr per maskintime, arbeidstime og tillatt A-parti).
var u = board.create('slider', sliderAt(0, [[0.3, 7.4], [2.1, 7.4]]).concat([[0, 3, 4]]), {name: 'u', snapWidth: 0.5, precision: 1});
var v = board.create('slider', sliderAt(1, [[3.3, 7.4], [5.1, 7.4]]).concat([[0, 1, 4]]), {name: 'v', snapWidth: 0.5, precision: 1});
var w = board.create('slider', sliderAt(2, [[0.3, 7.0], [2.1, 7.0]]).concat([[0, 0, 4]]), {name: 'w', snapWidth: 0.5, precision: 1});
var V = [[0,0],[4,0],[4,1],[3,3],[0,4.5]];
var pts = V.map(function (q) {
  return board.create('point', q, {name: '', fixed: true, size: 2, color: '#1565c0'});
});
board.create('polygon', pts, {
  fillColor: '#82b6e6', fillOpacity: 0.3,
  borders: {strokeColor: '#1565c0', strokeWidth: 2}
});
function fmt(t) { return String(Math.round(100*t)/100); }
function P(x, y) { return 5*x + 4*y; }
function bound() { return 9*u.Value() + 9*v.Value() + 4*w.Value(); }
function inA() { return 2*u.Value() + v.Value() + w.Value(); }
function inB() { return u.Value() + 2*v.Value(); }
function valid() { return inA() >= 5 - 1e-9 && inB() >= 4 - 1e-9; }
// Planen Z kan dras rundt i området (rutenett 0.5).
var Z = board.create('point', [3, 3], {
  name: 'Z', size: 4, color: '#2e7d32', label: {offset: [8, 10], fontSize: 13}
});
var lastZ = [3, 3];
function feasible(x, y) {
  return 2*x + y <= 9 + 1e-9 && x + 2*y <= 9 + 1e-9 && x <= 4 + 1e-9 && x >= -1e-9 && y >= -1e-9;
}
Z.on('drag', function () {
  var x = Math.round(2*Z.X())/2, y = Math.round(2*Z.Y())/2;
  if (!feasible(x, y)) { x = lastZ[0]; y = lastZ[1]; }
  lastZ = [x, y];
  Z.moveTo([x, y]);
});
// De fem leddene i gapet: pris × slakk (tre rader) og mengde × overskudd (to produkter).
function terms() {
  var x = Z.X(), y = Z.Y(), U = u.Value(), Vv = v.Value(), W = w.Value();
  return [U*(9 - 2*x - y), Vv*(9 - x - 2*y), W*(4 - x), x*(inA() - 5), y*(inB() - 4)];
}
// Grenselinjen 5x + 4y = 9u + 9v + 4w (rød) og mållinjen gjennom Z (oransje),
// tegnet bare i ruten 0 <= x <= 5.8, 0 <= y <= 4.8 (under tekstene, til venstre for søylen).
function cut(level) {
  var s = [], X = 5.8, Y = 4.8;
  [[0, level/4], [X, (level - 5*X)/4], [level/5, 0], [(level - 4*Y)/5, Y]].forEach(function (q) {
    if (q[0] > -1e-9 && q[0] < X + 1e-9 && q[1] > -1e-9 && q[1] < Y + 1e-9) { s.push(q); }
  });
  return s.length >= 2 ? [s[0], s[s.length - 1]] : [[NaN, NaN], [NaN, NaN]];
}
function levelLine(level, attr) {
  board.create('segment', [
    [function () { return cut(level())[0][0]; }, function () { return cut(level())[0][1]; }],
    [function () { return cut(level())[1][0]; }, function () { return cut(level())[1][1]; }]
  ], attr);
}
levelLine(bound, {strokeColor: '#c62828', strokeWidth: 3, fixed: true,
                  visible: function () { return !isNaN(cut(bound())[0][0]); }});
levelLine(function () { return P(Z.X(), Z.Y()); },
          {strokeColor: '#ef6c00', strokeWidth: 2, dash: 2, fixed: true});
// Hjørner som gir mer enn grensen (bare mulig med ugyldige priser).
V.forEach(function (q) {
  board.create('point', q, {
    name: '', fixed: true, size: 7, fillOpacity: 0, strokeColor: '#c62828', strokeWidth: 3,
    visible: function () { return P(q[0], q[1]) > bound() + 1e-9; }
  });
});
// Søylen viser gapet: ett felt per ledd, 1 enhet = 10 tusen kr. Negative ledd går nedover.
var cols = ['#1565c0', '#42a5f5', '#90caf9', '#2e7d32', '#81c784'];
cols.forEach(function (col, j) {
  var bar = board.create('curve', [[0], [0]], {
    fillColor: function () { return terms()[j] >= 0 ? col : '#c62828'; },
    fillOpacity: 0.85, strokeColor: '#263238', strokeWidth: 1
  });
  bar.updateDataArray = function () {
    var t = terms(), up = 0, down = 0;
    for (var i = 0; i < j; i++) { if (t[i] >= 0) { up += t[i]; } else { down += t[i]; } }
    var lo = t[j] >= 0 ? up : down, hi = lo + t[j];
    this.dataX = [6.2, 6.8, 6.8, 6.2, 6.2];
    this.dataY = [lo, lo, hi, hi, lo].map(function (s) { return s/10; });
  };
});
board.create('text', [6.15, -0.4, 'gapet'], {fontSize: fs, color: '#263238', fixed: true});
board.create('text', [xl, row(0), function () {
  return 'Leie A: ' + fmt(inA()) + (inA() >= 5 - 1e-9 ? ' ≥ 5' : ' < 5') +
         ',  B: ' + fmt(inB()) + (inB() >= 4 - 1e-9 ? ' ≥ 4' : ' < 4');
}], {fontSize: fs, color: '#263238', fixed: true});
board.create('text', [xl, row(1), function () {
  return 'Grense ' + fmt(bound()) + ',  P(Z) = ' + fmt(P(Z.X(), Z.Y())) + ',  gap ' + fmt(bound() - P(Z.X(), Z.Y()));
}], {fontSize: fs, color: '#263238', fixed: true});
board.create('text', [xl, row(2), function () {
  return 'pris × slakk: ' + terms().slice(0, 3).map(fmt).join(' + ');
}], {fontSize: fs, color: '#1565c0', fixed: true});
board.create('text', [xl, row(3), function () {
  return 'mengde × overskudd: ' + terms().slice(3).map(fmt).join(' + ');
}], {fontSize: fs, color: '#2e7d32', fixed: true});
board.create('text', [xl, row(4), function () {
  if (!valid()) {
    var bad = V.filter(function (q) { return P(q[0], q[1]) > bound() + 1e-9; }), q = bad[bad.length - 1];
    return bad.length ? 'Ugyldige priser: (' + q.join(', ') + ') gir ' + fmt(P(q[0], q[1])) + ' > ' + fmt(bound())
                      : 'Ugyldige priser: et ledd er negativt';
  }
  if (Math.abs(bound() - P(Z.X(), Z.Y())) < 1e-9) { return 'Gap 0: planen er bevist best'; }
  return 'Gyldige priser: ingen plan gir mer enn ' + fmt(bound());
}], {fontSize: fs, color: function () { return valid() ? '#263238' : '#c62828'; }, fixed: true});
```

**Hva viser bildet?**

- **Gyldige priser:** Den røde linjen ligger over hele det blå området, uansett hvor du drar $Z$: ingen tillatt plan gir mer enn grensen. Søylen er alltid nøyaktig like høy som gapet, og alle feltene er blå eller grønne.
- **Null gap:** Gapet blir null bare med prisene $(2,1,0)$ og planen $(3,3)$. Da forsvinner alle fem feltene, og den røde og den oransje linjen faller sammen i $(3,3)$.
- **Ugyldige priser:** Med $(1,1,0)$ er leieverdiene 3 og 3, mindre enn fortjenestene 5 og 4. Grensen blir 18, og hjørnene $(4,0)$, $(4,1)$ og $(3,3)$ gir mer enn 18. Et felt i søylen blir rødt: «grensen» er ingen grense.

Når gapet er null, må hvert enkelt ledd være null, for ingen av dem kan være negative. Det gir en regel som kalles **komplementær slakk**. I verkstedets ord:

- **Ressurser:** Er en ressurs ikke brukt opp (den har slakk), har eieren mer av den enn han trenger. Den er ikke verdt noe, så prisen er null. Har den positiv pris, er den brukt helt opp (null slakk).
- **Produkter:** Lages et produkt, er leieverdien lik fortjenesten: å produsere gir akkurat like mye som å leie ut ressursene partiet bruker. Er leieverdien større enn fortjenesten, lønner det seg ikke å lage produktet, og mengden er null.

Regelen lar oss finne prisene når vi kjenner planen. Bruk den på planen $(3,3)$. Vi *antar* at $(3,3)$ er optimal og at det finnes priser med samme verdi. Regelen gir da ett prisforslag; steg 3 kontrollerer at forslaget faktisk er et gyldig prisvalg.

1. **A-grensen:** Den har slakk $4-3=1$ (kundene vil kjøpe ett A-parti til). Da må $w\cdot1=0$, altså $w=0$.
2. **De to andre prisene:** Både $x=3$ og $y=3$ er positive, så begge produktene lages. Da må leieverdien være lik fortjenesten for begge: $2u+v+w=5$ og $u+2v=4$.
   - Med $w=0$ gir den første likningen $v=5-2u$.
   - Sett inn i den andre: $u+2(5-2u)=4$, så $10-3u=4$ og $u=2$.
   - Dermed er $v=1$.
3. Kontroller at prisene er gyldige: $u,v,w\ge0$, $2u+v+w=5\ge5$ og $u+2v=4\ge4$. Grensen blir $9u+9v+4w=27$, lik planens fortjeneste, så både plan og priser er optimale.

**Svaret til eieren:** En maskintime er verdt 2 tusen kroner, en arbeidstime 1 tusen kroner, og ett A-parti mer i salget er ikke verdt noe.

Likningene i steg 2 kan også leses som en tegning. Skrevet som én vektorlikning blir de

$$u\begin{pmatrix}2\\1\end{pmatrix}+v\begin{pmatrix}1\\2\end{pmatrix}=\begin{pmatrix}5\\4\end{pmatrix}.$$

- **Venstresiden:** Radene til de to aktive grensene, altså pilene som står vinkelrett ut fra grenselinjene som møtes i $(3,3)$ (kalt **normalvektorer**), hver ganget med sin pris.
- **Høyresiden:** Gradienten til $P$, altså pilen $(5,4)$ som peker i retningen der fortjenesten vokser raskest.
- **Kobling til uke 8:** Bildet svarer også på spørsmålet fra [uke 8](uke8.qmd#uke8-kompakt): i et optimum på randen trenger ikke gradienten være null. I et maksimum er den en ikke-negativ kombinasjon av normalene til de aktive grensene; i et minimum, som i uke 8, gjelder det samme for $-\nabla f$.

**Setter prisene sammen gradienten $(5,4)$ av normalene til de aktive grensene?** Det vil si: gir pilene, hver ganget med sin pris og lagt etter hverandre, pilen $(5,4)$? Cellen regner ut $2\cdot(2,1)+1\cdot(1,2)$ og tegner de to vektede normalene etter hverandre fra hjørnet, sammen med gradienten.

```{pyodide-python}
#| label: week11-normals
# Komplementær slakk ga u = 2, v = 1. Gir de vektede normalene til sammen målretningen?
print(2*np.array([2, 1]) + 1*np.array([1, 2]))
show_price_arrows(at=(3, 3), normals=[(2, 1), (1, 2)], prices=[2, 1], gradient=(5, 4))
```

**Hva viser pilene?** Summen er $(5,4)$, og pilene ender i samme punkt som gradienten.

- **Tolkning av prisene:** **Prisene er vektene som setter sammen gradienten av normalene til de aktive grensene.** Den inaktive A-grensen er ikke med i summen; den har pris null.
- **Videre til krumme grenser:** I [uke 12](uke12.qmd#uke12-lagrange) ser vi samme bilde for krumme grenser: gradienten til målet er en kombinasjon av gradientene til kravene (bibetingelsene), og vektene er Lagrangemultiplikatorene, med motsatt fortegn fordi uke 12 skriver $\nabla f+\lambda\nabla h=0$.

En aktiv grense kan likevel ha pris null (maskintimene er brukt opp, men en ekstra time er ikke verdt noe), som vi ser ved $\Delta=3/2$ i 11.4.

::: {.reading-step title="Gå i dybden: andre fortegn i primalen"}

::: {#uke11-fortegn}
:::

Vår modell har kravene «bruk $\le$ kapasitet» og «mengde $\ge0$». Hvis radene har andre ulikhetstegn, eller variablene har andre fortegnskrav, må også prisreglene endres. For en primal som maksimeres:

| I primalen (produksjonsproblemet) | I dualen (prisproblemet) |
|:--|:--|
| $\ge$-rad | Ikke-positiv pris (dualvariabel) |
| Likningsrad | Fri pris (positiv eller negativ) |
| Fri variabel | Likhetskrav |

Den vektede ulikheten forklarer alle tre reglene: vi kan bare multiplisere en ulikhet med en pris uten å snu den når prisen har riktig fortegn. Vi går gjennom dem én for én.

1. **En $\ge$-rad gir en ikke-positiv pris.** Ta kravet $x+y\ge2$.
   - Ganger vi det med et tall $\mu\ge0$, får vi $\mu(x+y)\ge2\mu$. Ulikheten peker da feil vei for en *øvre* grense.
   - Ganger vi med $\mu\le0$, snur den: $\mu(x+y)\le2\mu$.
   - Med $\mu=-1$ får vi $-x-y\le-2$, akkurat omskrivingen fra 11.2. Derfor får en $\ge$-rad en pris $\mu\le0$.
2. **En likningsrad gir en fri pris.** En likning $x+y=2$ gir $\mu(x+y)=2\mu$ for hvert tall $\mu$, positivt eller negativt. En likhet er også en $\le$-ulikhet, så vi kan bruke den i den vektede ulikheten uansett fortegn. Prisen er fri.
3. **En fri variabel gir et likhetskrav.** I steg 1 i boksen *hvorfor gir gyldige priser alltid en øvre grense?* brukte vi $x\ge0$: fra $2u+v+w\ge5$ fikk vi $(2u+v+w)x\ge5x$.
   - Hvis $x$ kan være negativ, snur denne ulikheten for $x<0$.
   - Med prisene $(3,1,0)$ er leieverdien 7, og for $x=-1$ er $5x=-5$, men $7x=-7<-5$.
   - For at $5x\le(2u+v+w)x$ skal gjelde både for positive og negative $x$, må $2u+v+w=5$. Priskravet blir en likning.

I hovedmodellen bruker vi bare $Az\le b$ og $z\ge0$, så alle prisene er ikke-negative og priskravene er ulikheter.

:::

**Øv på dette:** [prisene for planen (4, 1)](#uke11-oppg-priser), [en løs grense](#uke11-oppg-los) og [tre produkter](#uke11-oppg-tre) i 11.5; [kontroller et prisbevis](#uke11-kode-sertifikat) i 11.6.

## 11.4 Hva er en ekstra maskintime verdt?

::: {#uke11-sensitivitet}
:::

Nå kan vi svare på eierens andre spørsmål. Naboen tilbyr å leie ut maskinen sin noen timer i uka, og han vil ha 1500 kroner per time. Lønner det seg for eieren å leie, og i så fall hvor mange timer?

Tanken er enkel: **en ekstra maskintime er verdt det den øker den beste fortjenesten med.** Gir én ekstra time 2 tusen kroner mer, bør eieren ikke betale mer enn 2 tusen kroner for den. I 11.3 fikk maskintimen nettopp prisen 2 tusen kroner. Vi skal se at det er det en ekstra time er verdt, men bare for de første timene.

Vi kaller antall ekstra maskintimer $\Delta$ (den greske bokstaven delta). Verkstedet har da $9+\Delta$ maskintimer. En negativ $\Delta$ betyr at verkstedet mister timer.

### Når den gamle timeprisen fortsatt virker

**En halv ekstra time.** Vi prøver først $\Delta=\tfrac12$. Verkstedet har da $9.5$ maskintimer og fortsatt $9$ arbeidstimer. Hva blir den beste planen nå?

Med bare litt mer maskintid er det rimelig at verkstedet fortsatt bruker opp begge typer timer, slik som i $(3,3)$. Da finner vi planen fra to likninger:

1. **Begge timetypene brukt opp:** $2x+y=9+\tfrac12=\tfrac{19}{2}$ og $x+2y=9$.
2. Trekk den andre likningen fra den første: $x-y=\tfrac12$, så $x=y+\tfrac12$.
3. **Finn produksjonsmengdene:** Sett inn i arbeidstimekravet: $(y+\tfrac12)+2y=9$.
   - Da er $3y=9-\tfrac12=\tfrac{17}{2}$ og $y=\tfrac{17}{6}$.
   - Da er $x=\tfrac{17}{6}+\tfrac36=\tfrac{20}{6}=\tfrac{10}{3}$.
4. **Kontroller salgsgrensen:** $x=\tfrac{10}{3}\le4$, og begge mengdene er positive. Planen er tillatt.
5. **Fortjenesten:** $5\cdot\tfrac{10}{3}+4\cdot\tfrac{17}{6}=\tfrac{50}{3}+\tfrac{34}{3}=\tfrac{84}{3}=28$ tusen kroner.

**Hva betyr det for eieren?** Den halve timen ga $28-27=1$ tusen kroner mer, altså 2 tusen kroner per time. Det er akkurat prisen på en maskintime fra 11.3.

**Svaret til eieren: Ja, lei den halve timen.** Hos naboen koster en halv time $750$ kroner, og den gir $1000$ kroner mer i fortjeneste. Verkstedet sitter igjen med $250$ kroner ekstra. Leie lønner seg så lenge naboen tar mindre enn 2 tusen kroner per time. Om det også gjelder for mange timer, ser vi nedenfor.

**Hvorfor stemmer det med prisen?** Prisene fra 11.3 var 2 tusen per maskintime og 1 tusen per arbeidstime. De gir en øvre grense, et tak, for hva *noen* plan kan gi: «2 per maskintime + 1 per arbeidstime». Med $9+\Delta$ maskintimer blir taket $2(9+\Delta)+1\cdot9=27+2\Delta$, altså $28$ for $\Delta=\tfrac12$. Planen vi fant, når taket, så den er den beste. Hver ekstra maskintime løfter taket med 2, og så lenge en plan når taket, øker den beste fortjenesten like mye.

### Når en annen grense stopper produksjonen

Gir hver leide maskintime fortsatt 2 tusen kroner mer i fortjeneste hvis verkstedet leier mange timer? I så fall ville hver time, som koster 1500 kroner hos naboen, gi verkstedet 500 kroner i gevinst, og eieren burde leie så mye han kan. Vi prøver to ekstra timer, $\Delta=2$, så verkstedet har 11 maskintimer. Regningen bruker de samme stegene som over og komplementær slakk fra 11.3; den står i *Gå i dybden* under. Her er resultatet:

- **Ny beste plan:** $(4,5/2)$, altså fire partier A (alt kundene vil kjøpe) og to og et halvt parti B. Planen bruker all arbeidstid, men bare $21/2$ av de 11 maskintimene.
- **Ny fortjeneste:** 30 tusen kroner, ikke $27+2\cdot2=31$. De to ekstra timene ga bare 3 tusen kroner: 2 tusen for hver av de første halvannen timene, og ingenting for resten.
- **Hvorfor:** Nå er det arbeidstimene og A-grensen som stopper produksjonen. Maskintimer som blir til overs, er ikke verdt noe, så prisen på en maskintime blir 0. De nye prisene er $(u,v,w)=(0,2,3)$.

**Regelen:** En ressurspris gjelder så lenge de samme grensene er brukt opp (aktive). Byttet skjer når planen $(4,5/2)$ akkurat får nok maskintimer, ved $\Delta=\tfrac{21}{2}-9=\tfrac32$. Med mer enn halvannen ekstra maskintime er det ikke lenger maskintimene som er flaskehalsen: verdien av en ekstra maskintime er 2 tusen kroner før byttet og 0 etter.

::: {.reading-step title="Gå i dybden: regningen for to ekstra maskintimer"}

1. **Prøv timegrensene først:** $2x+y=11$ og $x+2y=9$ gir $x-y=2$, så $x=y+2$.

   Dermed er $3y+2=9$, $y=7/3$ og $x=13/3>4$. Denne planen bryter A-grensen.
2. **Bruk A-grensen i stedet:** Sett $x=4$ og bruk all arbeidstid: $4+2y=9$ gir $y=5/2$.

   Planen $(4,5/2)$ bruker $2\cdot4+5/2=21/2\le11$ maskintimer og gir $5\cdot4+4(5/2)=30$ tusen kr.
3. **Finn nye priser:** Den gamle prisgrensen $27+2\Delta$ gir for $\Delta=2$ øvre grense $27+2\cdot2=31$, som planen ikke når, så beviset fra før virker ikke lenger. Vi finner nye priser med komplementær slakk i planen $(4,5/2)$, som i 11.3:
   - Maskintimene har slakk (ubrukte timer) $11-\tfrac{21}{2}=\tfrac12$, så $u=0$.
   - Begge produktene lages, så $2u+v+w=5$ og $u+2v=4$.
   - Med $u=0$ gir den andre likningen $2v=4$, altså $v=2$, og den første gir $w=5-2=3$.
4. Kontroller at prisene $(u,v,w)=(0,2,3)$ er gyldige: alle er $\ge0$, A prises til $2\cdot0+2+3=5\ge5$ og B til $0+2\cdot2=4\ge4$.

Disse prisene gir en ny øvre grense:

$$2(x+2y)+3x=2x+4y+3x=5x+4y\le2\cdot9+3\cdot4=30.$$

Planen $(4,5/2)$ oppnår 30, så den er best. Nå er det arbeidstimene og A-grensen som bestemmer beste verdi; ekstra maskintimer alene hjelper ikke.

- **Det nye hjørnet:** $(4,5/2)$ er skjæringspunktet mellom arbeidstimer og A-grense, det samme punktet som lå *utenfor* området i hjørneregningen i 11.1, fordi det trenger $21/2$ maskintimer.
- **Prisene er ikke entydige:** Ved $\Delta=\tfrac32$ er både $(2,1,0)$ og $(0,2,3)$ optimale priser. En løser rapporterer bare ett av prisvalgene.

:::

Figuren lar oss se *hvilken grense* som stopper forbedringen. Sammenlign hvor mållinjen berører det blå området i øverste panel (opprinnelig kapasitet) og nederste panel (to ekstra maskintimer). Begge panelene har samme akser.

```{pyodide-python}
#| label: week11-capacity-geometry
# Hjørner og beste plan fra regningene over, uten og med to ekstra maskintimer.
before = dict(corners=[[0, 0], [4, 0], [4, 1], [3, 3], [0, 4.5]], best=(3, 3), levels=[27],
              machine=9, title="Ekstra maskintimer: Δ = 0")
after = dict(corners=[[0, 0], [4, 0], [4, 2.5], [0, 4.5]], best=(4, 2.5), levels=[30],
             machine=11, title="Ekstra maskintimer: Δ = 2")
compare_regions(before, after)
```

**Hva viser figuren?**

| Panel | Hvor mållinjen berører området |
|:--|:--|
| Øverst | $P=27$ berører $(3,3)$, der maskin- og arbeidslinjen møtes. |
| Nederst | Maskinlinjen $2x+y=11$ ligger utenfor området. $P=30$ berører hjørnet $(4,5/2)$, der arbeidslinjen og A-grensen møtes. |

### Fra to regninger til hele kurven

Vi har regnet ut to tilfeller for hånd:

- Ved $\Delta=1/2$ ga den gamle timeprisen 2 riktig svar.
- Ved $\Delta=2$ gjorde den ikke det, fordi A-grensen tok over.

Hva som skjer mellom og utenfor disse verdiene, vet vi foreløpig ikke. Vi kunne regnet flere tilfeller for hånd, men hver ny $\Delta$ krever det samme likningssettet og den samme kontrollen av de andre kravene.

Nå lar vi `linprog` gjøre jobben for 81 verdier av $\Delta$ mellom $-4$ og $4$ (negative verdier betyr at verkstedet mister maskintimer).

- **Størrelsen vi følger:** La $P_*(\Delta)$ være den beste fortjenesten verkstedet kan få når det har $9+\Delta$ maskintimer.
- **Det du får ferdig:** Løkken endrer bare første kapasitet, løser og lagrer $P_*(\Delta)$. En ferdig hjelpefunksjon tegner kurven sammen med den gamle prisgrensen $27+2\Delta$.

Målet er å se hvor prisen 2 gjelder, og å finne punktet der den slutter å gjelde, uten å vite det på forhånd.

### Eksperiment 3 – hva er $\Delta$ ekstra maskintimer verdt?

- Forutsi: hvor følger kurven den stiplede linjen, og hvor knekker den?
- Kjør cellen. Les av stigningstallet (hvor bratt kurven går, altså tusen kroner per ekstra time) før og etter knekken, og sammenlign med regningene ved $\Delta=1/2$ og $\Delta=2$.
- Hjemme, hvis du har tid: bytt til arbeidstimene ved å endre den andre kodelinjen til `row, price, kink = 1, 1, None`. Hvilket stigningstall får du, og hvor knekker kurven nå?

Cellen definerer verkstedet på nytt, i tilfelle du endret `p` i eksperiment 2. Slik er forsøket lagt opp:

1. Den andre kodelinjen velger hvilken kapasitet som endres, og hvilken pris den gamle grensen bruker.
2. Modellen løses én gang for hver $\Delta$.
3. Til slutt skriver cellen ut tre av verdiene og SciPys marginaler for startmodellen.

```{pyodide-python}
#| label: week11-marginals
# Verkstedet fra 11.2 (på nytt her, i tilfelle p ble endret i eksperiment 2).
p, A, b = np.array([5., 4.]), np.array([[2., 1.], [1., 2.], [1., 0.]]), np.array([9., 9., 4.])
row, price, kink = 0, 2, 1.5      # rad 0 = maskintimer, med prisen 2 fra 11.3
deltas = np.linspace(-4, 4, 81)
best_values = []
for delta in deltas:
    changed = b.copy()
    changed[row] += delta         # endre bare denne kapasiteten
    trial = linprog(-p, A_ub=A, b_ub=changed, bounds=(0, None), method="highs")
    best_values.append(-trial.fun if trial.success else np.nan)   # snu fortegnet
show_value_curve(deltas, best_values, bound=27 + price*deltas, kink=kink,
                 xlabel=["Ekstra maskintimer Δ", "Ekstra arbeidstimer Δ", "Høyere A-grense Δ"][row])

for d in (0, .5, 2):
    k = np.argmin(abs(deltas - d))
    print(f"Δ = {d:g}: beste fortjeneste {best_values[k]:g}, gammel grense {27 + price*d:g}")
base = linprog(-p, A_ub=A, b_ub=b, bounds=(0, None), method="highs")
print("SciPy-marginaler ved Δ = 0:", base.ineqlin.marginals + 0)
```

**Hva viser forsøket?**

- **Maskintimene:** Kurven har stigningstall 2 fram til $\Delta=3/2$ og er flat etterpå. Fortjenestene ved $\Delta=0,1/2,2$ er $27,28,30$, mens den gamle prisgrensen $27+2\Delta$ gir $27,28,31$.
- **Hovedpoenget:** **Så lenge maskintimene og arbeidstimene begge blir brukt opp, gir hver ekstra maskintime 2 tusen kroner, akkurat prisen fra 11.3.** Kurven knekker når salgsgrensen for A tar over som flaskehals. For større endringer må vi derfor sjekke om en plan fortsatt når taket $27+2\Delta$.
- **SciPys tall:** Cellen skriver også ut SciPys *marginaler*, $(-2,-1,0)$: hva en ekstra enhet av hver ressurs er verdt, regnet ut av løseren. SciPy regner med $-P$ i stedet for $P$, derfor er fortegnet snudd. Tallene betyr at en ekstra maskintime er verdt 2, en ekstra arbeidstime 1 og ett A-parti mer i salgsgrensen 0 tusen kroner, de samme prisene som i 11.3.
- **Arbeidstimene:** Hvis vi endrer arbeidstimene i stedet (som i hjemmeoppgaven), er stigningstallet 1 for $\Delta\ge-3$ og 2 for lavere verdier. Knekken kommer der A-grensen blir aktiv.

**Svaret til eieren:** Eieren bør betale høyst 2 tusen kroner per ekstra maskintime, men bare for den første halvannen timen. Etter det er flere maskintimer ikke verdt noe. Med naboens pris på 1500 kroner per time bør verkstedet altså leie halvannen time, ikke mer: de koster $2250$ kroner og gir $3000$ kroner mer i fortjeneste.

::: {.reading-step title="Gå i dybden: hvor lenge gjelder prisen på 2 tusen kroner?"}

For å finne hele intervallet der den gamle prisen gir riktig *beste verdi*, lar vi $\Delta$ være en endring i maskinkapasiteten: positiv $\Delta$ betyr flere timer, negativ $\Delta$ betyr færre. Den nye kapasiteten er $9+\Delta$.

1. **Hold begge timegrensene aktive:** $2x+y=9+\Delta$ og $x+2y=9$.
   - Trekk den andre fra den første: $x-y=\Delta$, så $x=y+\Delta$.
   - Sett inn: $3y+\Delta=9$.
   - Dermed er $y=3-\Delta/3$ og $x=3+2\Delta/3$.
2. **Kontroller de øvrige kravene:**

   | Krav | Vilkår på $\Delta$ |
   |:--|:--|
   | $x\ge0$ | $\Delta\ge-9/2$ |
   | $y\ge0$ | $\Delta\le9$ |
   | $x\le4$ | $\Delta\le3/2$ |

   Felles intervall er $-9/2\le\Delta\le3/2$. Her er også $9+\Delta\ge0$.
3. **Sett planen inn i målet:** $5(3+2\Delta/3)+4(3-\Delta/3)=27+2\Delta$. Planen oppnår prisgrensen.

   Her er $P_*(\Delta)$ *størst mulig fortjeneste* ved kapasitet $9+\Delta$. Derfor er $P_*(\Delta)=27+2\Delta$ i intervallet. For økninger gjelder dette til og med $\Delta=3/2$; etterpå trengs en ny pris.

Intervallet er nettopp der det aktive paret maskintimer og arbeidstimer gir et tillatt hjørne.

Ved $\Delta=3/2$ blir punktet $(4,5/2)$ tillatt, og der er alle tre grensene aktive samtidig.

- **To optimale prisvalg:** Prisene $(0,2,3)$ gir da grensen $0\cdot\tfrac{21}{2}+2\cdot9+3\cdot4=30$, den samme verdien som $(2,1,0)$ gir: $2\cdot\tfrac{21}{2}+9=30$.
- **Aktiv betyr ikke positiv pris:** Prisene $(0,2,3)$ er altså allerede optimale, selv om maskintimekravet fortsatt er aktivt. En aktiv grense kan ha pris null.

:::

::: {.reading-step title="Gå i dybden: hva om partiene må være hele?"}

I 11.1 lot vi verkstedet lage deler av et parti. Hvis partier må være hele, består det tillatte området bare av heltallspunktene i mangekanten.

- **Relaksasjon:** Modellen med delbare partier kalles en **relaksasjon** av heltallsmodellen: den tillater flere planer, så dens beste verdi blir minst like stor som heltallsmodellens.
- **Grense og forbehold:** Relaksasjonen gir altså en øvre grense, men å runde av løsningen gir ingen garanti for en tillatt eller god heltallsplan.

Et eksempel: fire studenter bygger nye maskiner og reparerer gamle. De har 100 komponenter og 50 timer, og en fast reisekostnad på 650 kr.

| Arbeid | Ressursbruk per stykk | Overskudd per stykk |
|:--|:--|--:|
| Nye maskiner ($N$ stykk) | 10 komponenter og 1 time | 500 kr |
| Reparasjoner ($r$ stykk) | 1 komponent og 3 timer | 250 kr |

**Finn optimum for relaksasjonen:**

1. Optimum ligger i skjæringspunktet mellom de to grensene $10N+r=100$ og $N+3r=50$; de to andre hjørnene, $(10,0)$ og $(0,50/3)$, gir bare 4350 og omtrent 3517 kr.
2. Fra den andre likningen er $N=50-3r$. Sett inn i den første: $500-30r+r=100$, altså $29r=400$ og $r=400/29$.
3. Da er $N=50-1200/29=250/29$, så $(N,r)\approx(8.62,\,13.79)$.
4. Overskuddet er $500\cdot\tfrac{250}{29}+250\cdot\tfrac{400}{29}-650=\tfrac{225000}{29}-650\approx7108.62$ kr.

**Prøv avrunding:**

| Avrunding | Plan og resultat |
|:--|:--|
| Til nærmeste heltall | $(9,14)$ trenger 104 komponenter og er ikke tillatt. |
| Nedover | $(8,13)$ gir 6600 kr. |

Den beste heltallsplanen finner vi ved å gå gjennom $N$. For hver $N$ er den beste $r$ det største heltallet med $r\le100-10N$ og $r\le(50-N)/3$:

| $N$ | største $r$ | overskudd (kr) |
|--:|--:|--:|
| 10 | 0 | $5000-650=4350$ |
| 9 | 10 | $4500+2500-650=6350$ |
| 8 | 14 | $4000+3500-650=6850$ |
| 7 | 14 | $3500+3500-650=6350$ |

For $N\le6$ gir timegrensen $r\le(50-N)/3$, så overskuddet i kroner er høyst

$$500N+250\cdot\tfrac{50-N}{3}-650=\tfrac{1250N+12500}{3}-650\le\tfrac{20000}{3}-650\approx6017$$

Den beste heltallsplanen er derfor $(8,14)$ med 6850 kr, som lar seks komponenter stå ubrukt. Heltallsproblemer løses med egne metoder som bruker relaksasjoner som øvre grenser.

I verkstedet er $(10/3,17/6)$ ved $\Delta=1/2$ ikke en plan med hele partier.

:::

**Øv på dette:** [ti maskintimer](#uke11-oppg-kapasitet) og [hvor langt prisen gjelder](#uke11-oppg-gyldighet) i 11.5.

### Svar på ukens spørsmål

Vi spurte hva verkstedet bør produsere, hvordan vi kan vite at planen er best uten å prøve alle planene, og hva en ekstra maskintime er verdt. Svarene til eieren er nå komplette:

1. **Beste plan:** Området er lukket og begrenset (kompakt) og konvekst, så det finnes en beste plan, og den ligger i et hjørne. Hjørnet $(3,3)$ er løsningen av et lineært likningssett med to likninger og to ukjente (maskintimer og arbeidstimer brukt opp): tre A-partier og tre B-partier gir 27 tusen kroner.
2. **Bevis:** Prisene $(2,1,0)$ gir den øvre grensen 27 for *alle* planer. Planen $(3,3)$ når grensen, så den er best. Beviset kan kontrolleres med noen få multiplikasjoner.
3. **Verdien av en ekstra maskintime:** De samme prisene sier at en ekstra maskintime er verdt 2 tusen kroner, men bare for de første halvannen timene ($\Delta\le3/2$). Eieren bør altså betale høyst 2 tusen per time for opptil halvannen ekstra time; flere timer gir ikke mer, fordi A-grensen og arbeidstimene tar over. Til naboens pris på 1500 kroner per time bør verkstedet leie halvannen time.

En løser som `linprog` gjør den samme jobben for tusenvis av produkter. Statusen, planen og prisene den returnerer, kan vi kontrollere på samme måte.

Ressursprisene er et første eksempel på **multiplikatorer**: tall som veier sammen grensene slik at de gir et bevis, og som samtidig måler hva en litt større kapasitet er verdt.

- **Krumme likninger:** I [uke 12](uke12.qmd#uke12-lagrange) er kravene (bibetingelsene) krumme likninger i stedet for rette linjer, og vi møter Lagrangemultiplikatorer.
- **Samme pristolkning:** De er priser på samme måte som ressursprisene (dualvariablene) her (med fortegnsavtalen i uke 12 er prisen $-\lambda$): de måler hva et litt endret krav er verdt ([uke 12](uke12.qmd#uke12-pris)).
- **Valgfri fordypning:** Ulikheter med komplementær slakk kommer der bare som valgfri fordypning.

## 11.5 Regneoppgaver

::: {#uke11-oppgaver}
:::

Oppgavene er sortert etter ukens tre ideer. Kodeoppgavene er i 11.6. Alle bruker verkstedet fra 11.1, hvis ikke noe annet står.

- **Arbeidsmåte:** Arbeid på papir først, og svar eksakt uten avrunding, for eksempel `3/2`.
- **Ja/nei:** Der det spørres om ja/nei, skriver du **1 for ja, 0 for nei**.
- **Begrunnelse:** Begrunnelsene skriver du i egne notater; feltene kontrollerer bare regningen.

::: {#week11-exercise-context .math-exercise-context}

- **Modell:** Verkstedet maksimerer $P=5x+4y$ under $2x+y\le9$, $x+2y\le9$, $x\le4$ og $x,y\ge0$, med mindre oppgaven sier noe annet.
- **Slakk:** Ubrukt kapasitet, altså kapasitet minus bruk.
- **Prisbevis:** For målet $5x+4y$ oppfyller gyldige ikke-negative priser $(u,v,w)$ kravene $2u+v+w\ge5$ og $u+2v\ge4$ (leieverdien per parti er minst like stor som fortjenesten); da er $9u+9v+4w$ en øvre grense for $P$.

:::

### Idé 1: Hjørner og tillatte planer

::: {#uke11-oppg-plan}
:::

Planen $(x,y)=(4,1)$ lager fire A-partier og ett B-parti. Regn ut bruken av maskintimer, arbeidstimer og A-partier, og trekk bruken fra kapasiteten; det er slakken, altså ubrukt kapasitet. Regn også ut fortjenesten.

```{math-exercise}
#| label: week11-task-slack
#| context: week11-exercise-context
#| caption: Slakk og fortjeneste i planen (4, 1)
#| mode: equivalent
#| partial-credit: true
#| field-labels: slakk maskintimer, slakk arbeidstimer, slakk A-grense, fortjeneste

Slakk (maskintimer, arbeidstimer, A-grense): vec[0,3,0]

Fortjeneste: _[24]
```

**Forklar:** Er planen tillatt? Hvilke grenser er aktive, og hvilket hjørne i hjørnetabellen er dette?

::: {#uke11-oppg-par}
:::

Et hjørne er et sted der to grenser er aktive, altså brukt opp. Vi finner det ved å løse et lineært likningssett med to likninger og to ukjente, og så sjekke at de andre kravene også er oppfylt. Likningssettet må ha nøyaktig én løsning, det vil si at de to grenselinjene krysser hverandre (determinanten til tallene foran $x$ og $y$ er ikke null; likningssettet er ikke-singulært).

1. **Løs og kontroller:** Løs paret maskintimer og $y=0$ og paret arbeidstimer og $x=0$, og kontroller de andre kravene.
2. **Finn determinanter:** Finn determinanten til koeffisientmatrisen (tallene foran $x$ og $y$) for paret maskintimer og arbeidstimer og for paret A-grense og $y=0$. Skriv $y=0$ som raden $(0,1)$, slik at matrisen har radene $(1,0)$ og $(0,1)$.

```{math-exercise}
#| label: week11-task-pairs
#| context: week11-exercise-context
#| caption: Løs, kontroller og klassifiser par av grenser
#| mode: equivalent
#| partial-credit: true
#| field-labels: x fra maskintimer og y=0, y fra maskintimer og y=0, første punkt tillatt, x fra arbeidstimer og x=0, y fra arbeidstimer og x=0, andre punkt tillatt, determinant for maskintimer og arbeidstimer, determinant for A-grense og y=0

Maskintimer og $y=0$: $(x,y)=$ vec[9/2,0], tillatt: _[0]

Arbeidstimer og $x=0$: $(x,y)=$ vec[0,9/2], tillatt: _[1]

Determinant, maskintimer og arbeidstimer: _[3]

Determinant, A-grense og $y=0$: _[1]
```

**Forklar:** Hva sier de to determinantene om linjene, og hvilket hjørne gir paret A-grense og $y=0$? Hvilket krav bryter det første punktet?

::: {#uke11-oppg-bidrag}
:::

I eksperiment 1 endret vi fortjenesten fra B. Nå er fortjenesten fra A usikker. La $a$ være fortjenesten fra ett parti A (stoler), målt i tusen kroner. Hittil har vi brukt $a=5$. Målet er $ax+4y$, mens kravene er de samme.

1. **Sammenlign hjørnene:** Regn ut $ax+4y$ i de fem hjørnene $(0,0)$, $(4,0)$, $(4,1)$, $(3,3)$ og $(0,9/2)$ for $a=1$, $a=5$ og $a=10$, og finn det beste hjørnet i hvert tilfelle.
2. **Finn knekkpunktene:** Finn de to verdiene av $a$ der mållinjen er parallell med en kant, slik at en hel kant er optimal. Det er verdiene der den beste planen bytter hjørne.

```{math-exercise}
#| label: week11-task-price-range
#| context: week11-exercise-context
#| caption: Beste hjørne og knekkpunkter når fortjenesten fra A endres
#| mode: equivalent
#| partial-credit: true
#| field-labels: x ved a=1, y ved a=1, x ved a=5, y ved a=5, x ved a=10, y ved a=10, nedre knekkpunkt, øvre knekkpunkt

$a=1$: vec[0,9/2]

$a=5$: vec[3,3]

$a=10$: vec[4,1]

Nedre knekkpunkt: $a=$ _[2]

Øvre knekkpunkt: $a=$ _[8]
```

::: {#uke11-oppg-status}
:::

Hva gjør løseren hvis det ikke finnes noen beste plan? Det kan skje på to måter: kravene kan motsi hverandre, så ingen plan er tillatt (umulig), eller målet kan bli så stort vi vil (ubegrenset). Her er to små modeller med ett tall $\tau$:

| Problem | Mål og krav |
|:--|:--|
| I | Krever $\tau\ge0$, $\tau\le1$ og $\tau\ge2$. |
| II | Maksimerer $\tau$ under bare kravet $\tau\ge0$. |

Hvilken status gir `linprog` for hvert av dem? Skriv **2** for umulig og **3** for ubegrenset.

```{math-exercise}
#| label: week11-task-status
#| context: week11-exercise-context
#| caption: Umulig eller ubegrenset?
#| mode: equivalent
#| partial-credit: true
#| field-labels: problem I (motstridende krav), problem II (uten øvre grense)

Problem I: _[2]

Problem II: _[3]
```

**Forklar:** Hvorfor er utfallene forskjellige? Kontroller med statuscellen i [11.6](#uke11-python).

### Idé 2: Prisbevis og komplementær slakk

::: {#uke11-oppg-priser}
:::

Nå gir et B-parti bare 2 tusen kroner, så målet er $5x+2y$. Eieren vil finne prisene som beviser at planen $(4,1)$ er best. Eksperiment 1 viser at $(4,1)$ da er best. Finn prisene $(u,v,w)$ med komplementær slakk:

1. **Bruk slakken:** Hvilken grense har ubrukt kapasitet i $(4,1)$, og hvilken pris må derfor være null?
2. **Bruk produksjonen:** Begge produktene lages; hvilke to priskrav gjelder da med likhet? (For dette målet er priskravet for B $u+2v\ge2$.)
3. **Sammenlign verdiene:** Regn ut grensen $9u+9v+4w$ og fortjenesten i $(4,1)$.

```{math-exercise}
#| label: week11-task-prices
#| context: week11-exercise-context
#| caption: Ressurspriser for planen (4, 1) når B gir 2
#| mode: equivalent
#| partial-credit: true
#| field-labels: pris v per arbeidstime, pris u per maskintime, pris w på A-grensen, øvre grense, fortjeneste i planen

$v=$ _[0]

$(u,w)=$ vec[2,1]

Øvre grense $9u+9v+4w$: _[22]

Fortjeneste $5x+2y$ i $(4,1)$: _[22]
```

**Forklar:** Hvorfor beviser prisene at $(4,1)$ er best? Hvilken grense har nå positiv pris, og hvorfor er det en annen enn ved $(3,3)$?

::: {#uke11-oppg-los}
:::

Prøv prisforslaget $(u,v,w)=(1,2,1)$ for det opprinnelige målet $5x+4y$. Forslaget er gyldig hvis leieverdiene er minst like store som fortjenestene. Finn leieverdiene $2u+v+w$ for A og $u+2v$ for B, avgjør om prisene er gyldige, og regn ut den øvre grensen.

```{math-exercise}
#| label: week11-task-loose-bound
#| context: week11-exercise-context
#| caption: Gyldig, men løs øvre grense
#| mode: equivalent
#| partial-credit: true
#| field-labels: leieverdi A, leieverdi B, øvre grense

Leieverdier (A, B): vec[5,5]

Øvre grense: _[31]
```

**Forklar:** Sammenlign med planen $(3,3)$. Bruk komplementær slakk til å forklare hvorfor akkurat dette prisvalget ikke kan bevise at $(3,3)$ er optimal: hvilket produkt har leieverdi større enn fortjenesten, og hva krever regelen da av mengden?

::: {#uke11-oppg-tre}
:::

Nå er det tre produkter (et nytt eksempel, ikke verkstedet), og vi kan ikke lenger tegne området i planet. Et sertifikat kan fortsatt kontrolleres for hånd. En bedrift lager $x_A,x_B,x_C$ partier og maksimerer $6x_A+5x_B+7x_C$ (tusen kr).

| Ressurs eller krav | Krav |
|:--|:--|
| Maskintid | $2x_A+x_B+3x_C\le20$ |
| Montering | $x_A+2x_B+x_C\le16$ |
| Materiale | $x_A+x_B+2x_C\le15$ |
| Ikke-negativ produksjon | $x_A,x_B,x_C\ge0$ |

- **Kontroller:** Undersøk planen $(8,4,0)$ og prisene $(7/3,\,4/3,\,0)$ per enhet maskintid, montering og materiale.
- **Finn leieverdien:** Leieverdiene for A og B er lik fortjenestene 6 og 5; finn leieverdien for C.

```{math-exercise}
#| label: week11-task-three-products
#| caption: Kontroller plan og priser med tre produkter
#| mode: equivalent
#| partial-credit: true
#| field-labels: slakk materiale, fortjeneste, leieverdi C, øvre grense

Slakk i materiale: _[3]

Fortjeneste for planen: _[68]

Leieverdi C: _[25/3]

Øvre grense $20\cdot\tfrac73+16\cdot\tfrac43+15\cdot0$: _[68]
```

**Forklar:** C gir høyest fortjeneste per parti. Bruk komplementær slakk til å forklare hvorfor C likevel ikke lages i en optimal plan.

### Idé 3: Hva er kapasitet verdt?

::: {#uke11-oppg-kapasitet}
:::

Naboen leier ut én ekstra maskintime, så maskintimene øker fra 9 til 10. Anta at de to timegrensene fortsatt er aktive. Løs grenselikningene som ved $\Delta=1/2$ i 11.4, kontroller $x\le4$ og finn den nye fortjenesten. Skriv produksjonstallene som brøker.

```{math-exercise}
#| label: week11-task-perturb
#| context: week11-exercise-context
#| caption: Nytt skjæringspunkt med 10 maskintimer
#| mode: equivalent
#| partial-credit: true
#| field-labels: nye partier A, nye partier B, ny fortjeneste

Plan: vec[11/3,8/3]

Fortjeneste: _[29]
```

**Forklar:** Stemmer økningen i fortjenesten med prisen 2 per maskintime?

::: {#uke11-oppg-gyldighet}
:::

Eieren lurer på hvor mange ekstra maskintimer prisen 2 tusen per time gjelder for. Løs $2x+y=9+\Delta$ og $x+2y=9$ som i 11.4, men behold $\Delta$ som bokstav. Du skal få $x=3+2\Delta/3$ og $y=3-\Delta/3$. Finn den største $\Delta\ge0$ som fortsatt oppfyller $x\le4$.

```{math-exercise}
#| label: week11-task-range
#| context: week11-exercise-context
#| caption: Største økning med gammel pris
#| mode: equivalent
#| field-labels: største kapasitetsøkning

$\Delta=$ _[3/2]
```

**Forklar:** Hvorfor må prisanslaget undersøkes på nytt etter denne økningen?

## 11.6 Python: undersøk og kontroller

::: {#uke11-python}
:::

Forsøkene i 11.2–11.4 bruker `linprog` fra SciPy. Oppslagsboksen samler det du trenger å vite om kallet og resultatet.

::: {.details title="SciPy-oppslag: `linprog` og resultatet"}

| Skriv/les | Betydning i modellen |
|:--|:--|
| `linprog(-p, A_ub=A, b_ub=b, bounds=(0,None), method="highs")` | Minimer $-p^Tz$ under $Az\le b$ og $z\ge0$. Likninger kan gis med `A_eq`, `b_eq`. |
| `result.status`, `result.success`, `result.message` | Undersøk utfallet først; status 0 er vellykket, 2 umulig, 3 ubegrenset. |
| `result.x`, `result.fun` | Plan og **minimeringsverdi**. Vår fortjeneste er `-result.fun`. |
| `result.ineqlin.residual`, `result.ineqlin.marginals` | Slakk (ubrukt kapasitet) og hvor mye minimeringsverdien endres per ekstra enhet i raden (SciPys «marginaler»). Med motsatt fortegn gir marginalene ressursverdien for $P$. |
| `np.linalg.solve(M, h)` | Løs likningssettet $Mz=h$ med like mange likninger som ukjente. Ved et singulært likningssett (determinant 0, parallelle linjer) kastes `np.linalg.LinAlgError`. |

:::

Hva skjer hvis løseren *ikke* finner en beste plan? Det kan skje på to måter, og to små modeller med én variabel $\tau$ viser dem:

- **Umulig:** Kravene motsier hverandre, så ingen plan er tillatt. Løseren gir status 2.
- **Ubegrenset:** Ingenting stopper målet fra å vokse. Løseren gir status 3.

I [regneoppgaven om umulig og ubegrenset](#uke11-oppg-status) bruker du de samme modellene. Målet er å se hvilken status hver modell får:

```{pyodide-python}
#| label: week11-status
# Første modell: τ <= 1 og τ >= 2 motsier hverandre.
# Skriv τ >= 2 som -τ <= -2 for A_ub og b_ub.
impossible = linprog([1.], A_ub=[[1.], [-1.]], b_ub=[1., -2.],
                     bounds=(0, None), method="highs")

# Andre modell: minimer -τ, altså maksimer τ, med bare τ >= 0.
# Uten en øvre grense kan τ og målet vokse så mye vi vil.
unbounded = linprog([-1.], bounds=(0, None), method="highs")
print("Modell                Status  Tolkning")
print(f"Motstridende krav     {impossible.status:>6}  Umulig")
print(f"Mål uten øvre grense  {unbounded.status:>6}  Ubegrenset")
```

**Hva viser cellen?** Den første modellen krever både $\tau\le1$ og $\tau\ge2$ og får status 2 (umulig). Den andre lar $\tau$ vokse uten grense og får status 3 (ubegrenset). For verkstedet betyr det at statusen må sjekkes før planen leses. Men statusen fanger bare motstridende krav (2) og et mål uten grense (3). Har vi skrevet et krav med feil tall, kan løseren likevel gi status 0 og en plan som er feil for verkstedet. Derfor kontrollerer vi også planen mot kravene, slik som i eksperiment 2.

Disse korte oppgavene kan kjøres uavhengig av hverandre. Data, importer og funksjonsrammer er gitt; fyll inn bare `TODO`-stedene. Kontrollene vurderer returverdier uten å vise løsningskode.

### Idé 1: Hjørner og tillatte planer

::: {#uke11-kode-plan}
:::

Eieren vil raskt sjekke en plan: hvor mange timer blir til overs, og hva tjener verkstedet? Funksjonen `evaluate(z)` gjør det samme som da vi sjekket planen $(2,1)$ i 11.1, og skal returnere paret `(slack, profit)` for en plan `z`:

- **`slack`:** Slakken (ubrukt kapasitet), regnet som kapasitet minus bruk. Den skal ha én verdi per rad i `A`, også når planen bryter en grense (da blir slakken negativ).
- **`profit`:** Fortjenesten $p^Tz$.

```{py-exercise}
#| label: week11-python-evaluate
#| caption: Beregn ressursbruk og fortjeneste
#| show-test-hints: false
# Bruk NumPy til matrise- og vektorregningen.
import numpy as np

# Radene er ressurskravene; kapasitetene står i b. Kolonner: A, B.
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])
p = np.array([5., 4.])

def evaluate(z):
    # TODO: Beregn slakk som kapasitet minus bruk og fortjeneste som p@z.
    return None

## TESTS ##
assert np.allclose(evaluate(np.array([3., 3.]))[0], [0., 0., 1.])
assert np.isclose(evaluate(np.array([3., 3.]))[1], 27.)
assert np.allclose(evaluate(np.array([4., 2.]))[0], [-1., 1., 0.])
assert np.isclose(evaluate(np.array([4., 2.]))[1], 28.)
```

::: {#uke11-kode-hjorner}
:::

Nå gjør vi håndeksemplet fra 11.1 for alle ti par, slik at datamaskinen finner hjørnene for eieren. Alle fem grensene er skrevet som rader i $Gz\le h$ (tallene foran $x$ og $y$ står i $G$, kapasitetene i $h$); fortegnskravene står som $-x\le0$ og $-y\le0$.

1. **Gå gjennom parene:** For hvert par av rader løser du $2\times2$-likningssettet der de to radene holder med likhet.
2. **Fang singulære par:** Et singulært par (parallelle linjer) får `np.linalg.solve` til å kaste en `np.linalg.LinAlgError`: fang den med `try`/`except` og tell paret som singulært.
3. **Kontroller løsningen:** Behold løsningen som et hjørne hvis den oppfyller **alle** fem ulikhetene (med toleranse `1e-9`); ellers teller du den som utenfor.
4. **Returner resultatet:** `(found, outside, singular)`: listen med hjørner og de to antallene.

```{py-exercise}
#| label: week11-python-vertices
#| caption: Finn hjørnene som løsninger av 2×2-likningssett
#| show-test-hints: false
import numpy as np
from itertools import combinations

# Rader: maskintimer, arbeidstimer, A-grense, x >= 0, y >= 0.
G = np.array([[2., 1.], [1., 2.], [1., 0.], [-1., 0.], [0., -1.]])
h = np.array([9., 9., 4., 0., 0.])

def vertices():
    found, outside, singular = [], 0, 0
    for i, j in combinations(range(len(h)), 2):
        rows = [i, j]
        # TODO: Løs G[rows] z = h[rows]; tell singulære par i except-delen.
        # TODO: Legg z i found hvis G @ z <= h + 1e-9, ellers tell den som utenfor.
        pass
    return found, outside, singular

## TESTS ##
found, outside, singular = vertices()
assert len(found) == 5 and outside == 4 and singular == 1
assert any(np.allclose(z, [3., 3.]) for z in found)
assert any(np.allclose(z, [0., 4.5]) for z in found)
assert all(np.all(G @ z <= h + 1e-9) for z in found)
```

Bruk funksjonen etterpå: regn ut $5x+4y$ i hvert hjørne og kontroller at det største er 27. For hvor mange par av rader måtte du løse et likningssett?

::: {#uke11-kode-linprog}
:::

Eieren vil at datamaskinen skal finne den beste planen. Funksjonen `solve_production()` skal maksimere fortjenesten med `linprog`, som i eksperiment 2. Husk at `linprog` minimerer. Returner hele resultatobjektet, slik at status, plan og verdi kan kontrolleres.

```{py-exercise}
#| label: week11-python-solve
#| caption: Løs den delbare produksjonsmodellen
#| show-test-hints: false
# NumPy holder dataene, mens SciPy løser LP-modellen.
import numpy as np
from scipy.optimize import linprog

# En rad per krav og en kolonne per produkt.
p = np.array([5., 4.])
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])

def solve_production():
    # TODO: Bruk linprog til å maksimere p@z med Az<=b og z>=0.
    result = None
    return result

## TESTS ##
assert solve_production().success
assert np.allclose(solve_production().x, [3., 3.], atol=1e-7)
assert np.isclose(-solve_production().fun, 27., atol=1e-7)
assert np.allclose(b - A @ solve_production().x, [0., 0., 1.], atol=1e-7)
```

### Idé 2: Prisbevis og komplementær slakk

::: {#uke11-kode-sertifikat}
:::

Eieren har en plan `z` og et forslag `q` til ressurspriser, og vil kontrollere beviset: Er planen tillatt, er prisene gyldige, og hvor stort er gapet mellom prisgrensen og planens fortjeneste? Er gapet null, er planen bevist best. Funksjonen `certificate(z, q)` skal returnere `(plan_ok, prices_ok, gap)`:

| Returverdi | Hva du beregner |
|:--|:--|
| `plan_ok` | Om planen oppfyller alle krav. |
| `prices_ok` | Om prisene oppfyller alle prisreglene. |
| `gap` | Forskjellen mellom øvre grense og planens fortjeneste. |

Bruk toleranse `1e-9` ved sammenligning.

```{py-exercise}
#| label: week11-python-certificate
#| caption: Kontroller en plan og ressurspriser
#| show-test-hints: false
# Bruk NumPy til å kontrollere ulikhetene koordinatvis.
import numpy as np

# Hver rad svarer til én kapasitet, hver kolonne til ett produkt.
p = np.array([5., 4.])
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])

def certificate(z, q):
    # TODO: Sjekk Az<=b og z>=0, deretter A.T@q>=p og q>=0.
    # TODO: Beregn gapet b@q-p@z og returner alle tre verdiene.
    return None

## TESTS ##
plan_ok, prices_ok, gap = certificate(np.array([3., 3.]), np.array([2., 1., 0.]))
assert plan_ok and prices_ok and np.isclose(gap, 0.)
assert not certificate(np.array([5., 0.]), np.array([2., 1., 0.]))[0]
assert not certificate(np.array([3., 3.]), np.array([0., 0., 0.]))[1]
assert np.isclose(certificate(np.array([4., 1.]), np.array([3., 1., 0.]))[2], 12.)
assert not certificate(np.array([3., 3.]), np.array([3., 1., -1.]))[1]
assert not certificate(np.array([-1., 0.]), np.array([2., 1., 0.]))[0]
```


I [prosjektet](project_week11.qmd) bruker du dualvariabler (ressurspriser) og komplementær slakk til å forklare hva strøm koster i et forenklet kraftmarked.

:::
