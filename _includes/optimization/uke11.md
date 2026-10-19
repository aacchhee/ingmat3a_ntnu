<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

::: {.panel-tabset}

## 11.0 Oversikt

<div id="uke11-start"></div>

### En produksjonsplan og en garanti

Et verksted lager produktpartier som kan deles opp: $2.5$ partier er to hele partier og et halvt. Vi tegner de tillatte planene, finner den beste og ser hvorfor den ligger i et hjørne. Deretter lager vi en ressursregning som setter en øvre grense for *alle* planer og dermed beviser at planen er best. Til sist undersøker vi hva mer kapasitet kan være verdt, og hvor lenge svaret gjelder.

I [uke 8](uke8.qmd#uke8-start) stilte vi to spørsmål: *finnes det et beste svar*, og *er kandidaten vi fant, den beste?* For verkstedets lineære problem kan vi svare ja på begge, og vi ser hva som må til for at svaret er ja. I tillegg får vi et bevis som kan kontrolleres med noen få multiplikasjoner.

**Forelesning** viser hovedløpet. **Gå i dybden** åpner lengre begrunnelser. I 11.1–11.4 følger vi ett verksted. Regneoppgavene i 11.5 og kodeoppgavene i 11.6 bruker stort sett samme tall.

### Kort løype

1. [Fra tabell til tillatt område](#uke11-modell): mål, krav og slakk.
2. [Endre bidraget fra B](#uke11-pris): den beste planen hopper mellom hjørner.
3. [Hvorfor ligger optimum i et hjørne?](#uke11-hvorfor): konveks, kompakt, lokalt er globalt.
4. [Hjørner er likningssystemer](#uke11-hjorner): kvadratiske systemer og simpleksmetoden.
5. [Finn planen med `linprog`](#uke11-linprog): status, plan og slakk.
6. [Ressurspriser gir en øvre grense](#uke11-dual): dualitet og [komplementær slakk](#uke11-slakk).
7. [Hva er en ekstra maskintime verdt?](#uke11-sensitivitet): lokal verdi og gyldighetsområde.

### Dette bygger vi videre på

| Fra tidligere uker | Spørsmålet vi tar med oss |
|:--|:--|
| [Uke 3: likningssystemer og rang](uke3.qmd#uke3-stotte-matriser) | Når har to grenselikninger nøyaktig ett felles punkt? |
| [Uke 8: kompakthet](uke8.qmd#uke8-kompakt) | Hvorfor finnes det en beste plan? |
| [Uke 8: konveksitet](uke8.qmd#uke8-lokalt) | Hvorfor kan vi stoppe i et hjørne som ikke har en bedre nabo? |
| [Uke 8 (Gå i dybden): grense fra tangenten](uke8.qmd#uke8-konveks-test) | Kan en enkel ulikhet bevise at ingen plan er bedre? |

### Læringsmål

Etter denne uken skal du kunne

- oversette en produksjonstabell til et lineært mål og ressursulikheter og finne ubrukt kapasitet for en plan,
- forklare hvorfor en LP med begrenset, ikke-tomt tillatt område har et optimum i et hjørne, og finne hjørnene som løsninger av kvadratiske likningssystemer,
- prissette ressursene for å gi en øvre grense og bevise optimalitet når en plan oppnår grensen,
- bruke komplementær slakk til å finne ressursprisene fra en plan,
- tolke verdien av en liten kapasitetsendring og undersøke når den gamle prisen slutter å gi den nye optimalverdien,
- kode modellen med `linprog`, sjekke løserens status og kontrollere resultatet mot kravene.

## 11.1 Fra tabell til tillatt område

<div id="uke11-modell"></div>

### Modellen: to produkter og to typer timer

Verkstedet produserer partier av A og B. **Dekningsbidrag** betyr salgsinntekt minus kostnadene som følger produksjonen, for eksempel materialer; her måles det i tusen kroner per parti. Vi antar at hele produksjonen blir solgt, at timer kan fordeles på delbare partier, og at tabellens tall er konstante i denne perioden.

| Produkt | Maskintimer per parti | Arbeidstimer per parti | Dekningsbidrag per parti |
|:--|--:|--:|--:|
| A | 2 | 1 | 5 tusen kr |
| B | 1 | 2 | 4 tusen kr |
| Tilgjengelig kapasitet | 9 | 9 | |

I tillegg kan verkstedet lage høyst fire A-partier. La $x$ være antall A-partier og $y$ antall B-partier. Vi vil gjøre $P=5x+4y$ (tusen kroner) størst mulig. En plan er **tillatt** når alle kravene er oppfylt:

| Krav | Regning for en plan $(x,y)$ | Grense |
|:--|:--|:--|
| Maskintimer | $2x+y$ | $2x+y\le9$ |
| Arbeidstimer | $x+2y$ | $x+2y\le9$ |
| Antall A-partier | $x$ | $x\le4$ |
| Ikke-negativ produksjon | $x,y$ | $x\ge0,\ y\ge0$ |

Les hver rad i produkttabellen som «timer per parti × antall partier». Sjekk planen $(x,y)=(2,1)$:

1. Maskintimer: $2\cdot2+1\cdot1=5\le9$.
2. Arbeidstimer: $1\cdot2+2\cdot1=4\le9$.
3. A-grensen: $x=2\le4$. Dekningsbidraget er $5\cdot2+4\cdot1=14$ tusen kroner.

Begge partimengdene er ikke-negative, så planen er tillatt. Den har $9-5=4$ ubrukte maskintimer, $9-4=5$ ubrukte arbeidstimer og rom for $4-2=2$ flere A-partier.

Dette er **lineær programmering (LP)**: både målet $P=5x+4y$ og ressursbruken er lineære i $x,y$. Vi leter etter den tillatte planen med størst $P$.

### Sammenlign hjørnene

Langs en kant varierer det lineære målet $P$ mellom verdiene i endepunktene. Derfor undersøker vi hjørnene der grensene møtes. Hvordan vi finner hjørnene systematisk, ser vi i [Hjørner er likningssystemer](#uke11-hjorner). Her er de fem hjørnene og verdien av $P=5x+4y$ i hvert av dem:

| Hjørne $(x,y)$ | $P$ (tusen kr) |
|:--|--:|
| $(0,0)$ | 0 |
| $(4,0)$ | 20 |
| $(4,1)$ | 24 |
| $(3,3)$ | **27** |
| $(0,9/2)$ | 18 |

I $(3,3)$ er begge timekapasitetene brukt opp, men det er rom for ett A-parti før grensen $x\le4$ nås. **Slakk** er kapasitet minus bruk. De tre slakkene er altså $(0,0,1)$. En grense med null slakk er **aktiv**.

Vi tegner området for å se *hvorfor* sammenligningen av hjørner virker. En **mållinje** består av planer med samme $P$. Se først hvilke punkter som ligger innenfor alle grensene; følg så de stiplede mållinjene. Når bidraget øker fra 20 til 27, flyttes linjen opp og til høyre. Den siste linjen som treffer området, møter det ved $(3,3)$.

```{pyodide-python}
#| label: week11-polygon
# NumPy lagrer hjørnene, og Matplotlib tegner området og mållinjene.
import numpy as np
import matplotlib.pyplot as plt

# Hvert hjørne er en plan (antall A-partier, antall B-partier).
# Rekkefølgen følger kanten rundt området, slik at utfyllingen blir riktig.
corners = np.array([[0., 0.], [4., 0.], [4., 1.],
                    [3., 3.], [0., 4.5]])

# Fyll alle tillatte planer og trekk opp kanten ved å gjenta første hjørne.
fig, ax = plt.subplots(figsize=(6, 5))
ax.fill(corners[:, 0], corners[:, 1], alpha=.22, color="tab:blue",
        label="Tillatte planer")
ax.plot(*np.vstack((corners, corners[0])).T, color="tab:blue")
ax.plot(3, 3, "o", color="tab:red", label="Beste plan (3, 3)")

# Løs 5x + 4y = nivå for y; hvert nivå gir én parallell mållinje.
# Sammenlign hvor linjene for 20, 24 og 27 treffer det blå området.
xx = np.linspace(0, 4.8, 120)
for level in (20, 24, 27):
    ax.plot(xx, (level - 5*xx)/4, "--", label=f"P = {level}")
ax.set(xlim=(0, 4.8), ylim=(0, 5.1), xlabel="A-partier x",
       ylabel="B-partier y", title="Tillatt område og mållinjer")
ax.set_aspect("equal")
ax.legend(fontsize=8)
plt.show()
```

### Eksperiment – endre bidraget fra B

<div id="uke11-pris"></div>

Bidragene i tabellen er anslag. Hva om et B-parti gir et annet bidrag? Erstatt 4 med et tall $c$, slik at målet blir $P=5x+cy$. Det tillatte området er det samme; bare retningen til mållinjene endres.

**Forutsi:** Flytter den beste planen seg litt hvis $c$ øker litt fra 4? Hvor stort må $c$ bli før det lønner seg å lage bare B?

Skyv $c$ i figuren. Den stiplede linjen er mållinjen gjennom det beste punktet, og teksten viser hvilket hjørne som er best og verdien der.

<div id="uke11-pris-applet"></div>

```{.jsxgraph width="620" height="560" style="width:100%;max-width:620px;height:560px;border:0;"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [-0.6, 5.0, 5.6, -0.6], axis: true, keepaspectratio: true,
  showCopyright: false, showNavigation: false,
  pan: {enabled: false}, zoom: {enabled: false}
});
var c = board.create('slider', [[2.5,4.6],[5.0,4.6],[0.5,4,14]], {
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
board.create('text', [2.5, 4.2, function () {
  var b = best();
  var s = b.idx.map(function (i) { return '(' + V[i][0] + ', ' + V[i][1] + ')'; }).join(' og ');
  return (b.idx.length > 1 ? 'Hel kant er best: ' : 'Beste hjørne: ') + s;
}], {fontSize: 14, color: '#263238', fixed: true});
board.create('text', [2.5, 3.85, function () {
  return 'P = 5x + ' + c.Value().toFixed(1) + 'y = ' + Math.round(100*best().m)/100;
}], {fontSize: 14, color: '#263238', fixed: true});
```

**Hva viser forsøket?**

- For $c<5/2$ er $(4,1)$ best.
- For $5/2<c<10$ er $(3,3)$ best. Et helt intervall av bidrag gir samme plan.
- For $c>10$ er $(0,9/2)$ best.
- For $c=5/2$ og $c=10$ er en hel kant best.

Den beste planen flytter seg aldri litt: den står stille, og så hopper den. Knekkpunktene kommer når mållinjen er parallell med en kant. Mållinjene $5x+cy=\text{konstant}$ har stigningstall $-5/c$. Maskinkanten $2x+y=9$ har stigningstall $-2$, så $5/c=2$ gir $c=5/2$. Arbeidskanten $x+2y=9$ har stigningstall $-1/2$, så $5/c=1/2$ gir $c=10$.

### Hvorfor ligger optimum i et hjørne?

<div id="uke11-hvorfor"></div>

Hvert punkt inni mangekanten kan skrives som et veid gjennomsnitt av hjørnene, så verdien av $P$ blir samme gjennomsnitt av tabellverdiene. Ingen plan kan dermed gi mer enn 27. Hvis en mållinje følger en kant, kan flere planer være like gode, slik vi så ved knekkpunktene i forsøket.
For eksempel ville et annet mål, $R=2x+y$, fått maksimum 9
både ved $(4,1)$ og $(3,3)$, og i alle punktene på kanten mellom dem.
Det finnes da mange maksimumspunkter, selv om maksimalverdien er ett tall.

Nå kan vi også svare på de to spørsmålene fra uke 8:

1. **Området er konvekst.** Hvert krav gir et halvplan, og snittet av halvplan er konvekst: linjestykket mellom to tillatte planer ligger helt i området, slik vi definerte konveksitet i [uke 8](uke8.qmd#uke8-lokalt).
2. **Et beste svar finnes.** Området er ikke-tomt ($(0,0)$ er en plan), lukket (grensene er med) og begrenset ($0\le x\le4$ og $0\le y\le9/2$), altså kompakt. $P$ er kontinuerlig, så ekstremalverdisetningen fra [uke 8](uke8.qmd#uke8-kompakt) gir et maksimum.
3. **Lokalt er globalt.** Å maksimere $P$ er det samme som å minimere $-P$, og en lineær funksjon er konveks. På en konveks mengde er da hvert lokalt maksimum av $P$ også globalt. I et hjørne går alle tillatte retninger inn mellom de to kantene som møtes der. Hvis $P$ ikke øker langs noen av de to kantene, øker $P$ ikke i noen tillatt retning: hjørnet er et lokalt maksimum, og dermed et globalt.

Punkt 3 er grunnen til at en metode kan stoppe ved det første hjørnet som ikke har en bedre nabo. Vi bruker det om litt.

<details class="reading-step">
<summary>Gå i dybden: hvorfor er snittet av halvplan konvekst?</summary>

Hvis to planer $(x_1,y_1)$ og $(x_2,y_2)$ oppfyller for eksempel $2x+y\le9$, gjør også hvert punkt på linjestykket mellom dem det:
$$2\bigl(tx_1+(1-t)x_2\bigr)+\bigl(ty_1+(1-t)y_2\bigr)=t(2x_1+y_1)+(1-t)(2x_2+y_2)\le t\cdot9+(1-t)\cdot9=9$$
for $0\le t\le1$. Et punkt som oppfyller alle fem kravene, ligger i alle fem halvplanene. Linjestykket mellom to slike punkter ligger derfor også i alle fem, og mangekanten er en konveks mengde.

</details>

<details class="reading-step">
<summary>Gå i dybden: når hjørneargumentet ikke gjelder</summary>

En LP kan også ha et tomt tillatt område eller et mål som kan bli vilkårlig stort. Hjørneargumentet over gjelder vårt ikke-tomme, begrensede område. Gradienten $\nabla P=(5,4)$ er konstant og Hessianen er null. Det finnes derfor ikke noe indre stasjonært punkt slik de lokale testene fra [uke 8](uke8.qmd#uke8-hessian) og [uke 10](uke10.qmd) undersøkte; grensene stopper forbedringen.

Et ubegrenset område kan likevel ha et optimum. For eksempel har $\min(x+y)$ under $x,y\ge0$ minimum 0 i hjørnet $(0,0)$, selv om området ikke er kompakt. Ekstremalverdisetningen er tilstrekkelig, ikke nødvendig.

</details>

### Hjørner er kvadratiske likningssystemer

<div id="uke11-hjorner"></div>

I et hjørne er to grenser aktive. Skriver vi de to grensene som likheter, får vi et $2\times2$-system som i [uke 3](uke3.qmd#uke3-stotte-matriser). Ressurskravene er rader av koeffisienter, akkurat som i de lineære systemene tidligere i kurset. Forskjellen er at vi etterpå må sjekke *ulikhetene* for alle de andre kravene.

Verkstedet har fem grenser: maskintimer, arbeidstimer, A-grensen, $x=0$ og $y=0$. Det gir $\binom52=10$ måter å velge to av dem på.

::: {.callout-note title="Håndeksempel: tre par av aktive grenser"}

**Utgangspunkt.** Velg to grenser, sett dem lik kapasiteten og løs systemet. Kontroller deretter de tre andre kravene.

**Prøv selv.** Undersøk paret maskintimer og A-grense, paret arbeidstimer og A-grense, og paret A-grense og $x=0$.

**Regnegangen.**

1. $2x+y=9$ og $x=4$ gir $(4,1)$. Arbeidstimer: $4+2=6\le9$, og $y=1\ge0$. Punktet er et hjørne.
2. $x+2y=9$ og $x=4$ gir $(4,5/2)$. Maskintimer: $2\cdot4+5/2=21/2>9$. Linjene skjærer hverandre, men skjæringspunktet er ikke en tillatt plan.
3. $x=4$ og $x=0$ har koeffisientmatrisen $\begin{pmatrix}1&0\\1&0\end{pmatrix}$ med determinant 0 og rang 1. Linjene er parallelle, og systemet har ingen løsning.

**Dette tar vi med oss.** Et hjørne er to aktive grenser med lineært uavhengige rader, altså et ikke-singulært $2\times2$-system, *og* et punkt som oppfyller alle de andre kravene.

:::

Går vi gjennom alle ti par på samme måte, får vi **5 hjørner**, **4 skjæringspunkter utenfor området** og **1 singulært par**. Oppgave 8 i 11.5 og kodeoppgave 4 i 11.6 går gjennom flere av parene.

<details class="reading-step">
<summary>Gå i dybden: alle ti par i én figur</summary>

Figuren viser de fem grenselinjene og alle ni skjæringspunktene. Det tiende paret, $x=4$ og $x=0$, har ikke noe skjæringspunkt: de to loddrette linjene er parallelle.

```{pyodide-python}
#| label: week11-pairs
# De fem grenselinjene og alle skjæringspunkter mellom to av dem.
fig, ax = plt.subplots(figsize=(6, 6))
xx = np.linspace(-0.5, 9.5, 2)
ax.fill(corners[:, 0], corners[:, 1], alpha=.18, color="tab:blue",
        label="Tillatte planer")
ax.plot(xx, 9 - 2*xx, color="tab:blue", label="Maskintimer 2x + y = 9")
ax.plot(xx, (9 - xx)/2, color="tab:green", label="Arbeidstimer x + 2y = 9")
ax.axvline(4, color="tab:purple", linestyle=":", label="A-grense x = 4")
ax.axvline(0, color="gray", linewidth=1)
ax.axhline(0, color="gray", linewidth=1)
# Punktene fra tabellen: fem hjørner og fire punkter utenfor området.
vertices = np.array([[3, 3], [4, 1], [0, 4.5], [4, 0], [0, 0]])
outside = np.array([[0, 9], [4.5, 0], [4, 2.5], [9, 0]])
ax.plot(*vertices.T, "o", color="tab:red", label="Hjørne")
ax.plot(*outside.T, "x", color="black", markersize=9,
        label="Skjæring utenfor området")
ax.set(xlim=(-0.5, 9.5), ylim=(-0.5, 9.5), xlabel="A-partier x",
       ylabel="B-partier y", title="Ti par av grenser")
ax.set_aspect("equal")
ax.legend(fontsize=8, loc="upper right")
plt.show()
```

</details>

### Antall kandidater eksploderer

Med $n$ variabler er et hjørne $n$ aktive grenser, altså et $n\times n$-system, og med $m$ ressurskrav og $n$ fortegnskrav er det $\binom{m+n}{n}$ måter å velge dem på. Verkstedet har $\binom52=10$ kandidater, men med 10 variabler og 20 krav er det omtrent $3.0\cdot10^7$, og med 50 variabler og 100 krav omtrent $2.0\cdot10^{40}$; med en milliard løste systemer per sekund ville den siste listen ta omtrent $6\cdot10^{23}$ år. Å løse alle systemene er ingen algoritme.

### Simpleksmetoden går langs kantene

**Simpleksmetoden** starter i et hjørne og går til et nabohjørne med bedre verdi. To nabohjørner deler én aktiv grense, så et steg bytter ut **én** rad i $2\times2$-systemet. I verkstedet kan en slik bane se slik ut:

| Hjørne | Aktive grenser | $P$ |
|:--|:--|--:|
| $(0,0)$ | $x=0$, $y=0$ | 0 |
| $(4,0)$ | $y=0$, A-grense | 20 |
| $(4,1)$ | A-grense, maskintimer | 24 |
| $(3,3)$ | maskintimer, arbeidstimer | 27 |

I $(3,3)$ er begge nabohjørnene dårligere: $(4,1)$ gir 24 og $(0,9/2)$ gir 18. Metoden stopper, og punkt 3 i [Hvorfor ligger optimum i et hjørne?](#uke11-hvorfor) sier at et hjørne uten bedre nabo er globalt best. Banen besøkte fire av de ti kandidatene og løste aldri de singulære systemene eller dem med punkter utenfor området.

**Indrepunktmetoder** går i stedet gjennom det indre av området mot optimum. Begge typene finnes i HiGHS, som `linprog` bruker.

## 11.2 Finn planen med `linprog`

<div id="uke11-linprog"></div>

For mange produkter er en hjørnetabell tungvint. Vi samler tallene i vektorer og en matrise. **Kolonnene** står i produktrekkefølgen A, B; **radene** står i kravrekkefølgen maskintimer, arbeidstimer, A-grense. Matrisen $A$ har ikke noe med produkt A å gjøre.

| Symbol | Betydning | Verdi |
|:--|:--|:--|
| $z$ | Antall partier A, B | $(x,y)$ |
| $p$ | Bidrag per parti A, B | $(5,4)$ |
| $b$ | Kapasitet per rad i $A$ | $(9,9,4)$ |

$$A=\begin{pmatrix}2&1\\1&2\\1&0\end{pmatrix},\qquad Az\le b.$$

SciPys `linprog` **minimerer**. For å maksimere $p^Tz$ sender vi derfor inn `-p`. Argumentene `A_ub`, `b_ub` angir radene $Az\le b$, mens `bounds=(0,None)` gir både $x$ og $y$ nedre grense null.

Dette forsøket gir en uavhengig kontroll av hjørnetabellen og viser hvilke tall vi bør sjekke når en løser svarer: status, plan, bidrag og slakk. Status 0 betyr at løseren fant et optimum, status 2 at ingen plan oppfyller alle kravene (**umulig**), og status 3 at målet kan forbedres uten grense (**ubegrenset**). Les derfor ikke `x` og `fun` før du har sjekket status; to små eksempler står i [11.6](#uke11-python). Sammenlign særlig `Slakk` med `Kontroll` i utskriften. De skal vise samme tre verdier.

```{pyodide-python}
#| label: week11-highs
# Bidrag per parti: først A, så B, i tusen kroner.
p = np.array([5., 4.])
# Kolonner: A, B. Rader: maskintimer, arbeidstimer, A-grense.
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])

# SciPy minimerer. Minus foran p gjør minimum av -P til maksimum av P.
# bounds angir at både x og y er minst null.
result = linprog(-p, A_ub=A, b_ub=b, bounds=(0, None), method="highs")
print(f"Løserstatus: {result.status} — {result.message}")

# x og fun kan mangle dersom løseren ikke fant et endelig optimum.
if result.success:
    print(f"Plan: A = {result.x[0]:g}, B = {result.x[1]:g} partier")
    print(f"Dekningsbidrag: {-result.fun:g} tusen kr")
    print("Ressurs          Kapasitet  Brukt  Slakk  Kontroll")
    # Slakk fra SciPy skal stemme med b - A @ planen, rad for rad.
    for name, capacity, used, slack, check in zip(
        ("Maskintimer", "Arbeidstimer", "A-grense"),
        b, A @ result.x, result.ineqlin.residual, b - A @ result.x
    ):
        print(f"{name:<16}{capacity:>9g}{used:>7g}{slack:>7g}{check:>10g}")
```

Status 0 og `success=True` gir $(3,3)$, verdi 27 og slakk $(0,0,1)$. `result.fun=-27` er minsteverdien av $-P$, funksjonen SciPy faktisk minimerte. Vi kontrollerer fortegnet og at planen oppfyller kravene. Flyttallsregning kan gi små avvik fra null.

Statusen gjelder modellen vi skrev inn. En feil i produksjonskravene blir ikke rettet av løseren.

<details class="reading-step">
<summary>Gå i dybden: skriv andre krav på samme form</summary>

SciPy tar imot ulikheter på formen $Az\le b$. Et krav
$x+y\ge2$ skrives derfor $-x-y\le-2$: både koeffisientene og
høyresiden skifter fortegn. Likninger kan gis direkte med
`A_eq` og `b_eq`.

En **fri variabel** kan være både positiv og negativ. Hvis $y$ er
fri, kan vi skrive $y=y_+-y_-$ med $y_+,y_-\ge0$.
For eksempel representeres $y=-3$ av $y_+=0$, $y_-=3$.
Kravet over blir da $-x-y_++y_-\le-2$. Med denne omskrivingen
kan vi bruke bare ikke-negative variabler. Alternativt kan `linprog`
gi $y$ grensene `(None, None)` direkte.

En **slakkvariabel** gjør ubrukt kapasitet til en egen variabel:
$2x+y\le9$ er det samme som
$2x+y+s=9$ med $s\ge0$. Ved planen $(4,1)$ er $s=0$;
ved $(3,2)$ er $s=1$. Å samle alle krav i én slik avtalt form
kalles å skrive problemet på **standardform**. Ulike framstillinger
velger ulikhetsform eller likhetsform; oppgi derfor alltid formen.

</details>

## 11.3 Ressurspriser gir en øvre grense

<div id="uke11-dual"></div>

### Prøv to prisforslag

Hjørnene og løseren peker på 27. For å vite at ingen oversett plan er bedre, lager vi en øvre grense som gjelder *hver* tillatte plan. Sett en tenkt pris på hver ressurs, målt i tusen kroner per enhet: $u$ per maskintime, $v$ per arbeidstime og $w$ per tillatt A-parti. Hvis ressursene som går med til ett parti, til sammen koster minst like mye som partiets bidrag, kan ingen plan tjene mer enn det hele kapasiteten er verdt. Prøv to forslag:

| Forslag $(u,v,w)$ | Innsats per A-parti $2u+v+w$ | Innsats per B-parti $u+2v$ | Dekker bidragene 5 og 4? | Kapasitetens verdi $9u+9v+4w$ |
|:--|--:|--:|:--|--:|
| $(3,1,0)$ | 7 | 5 | ja | 36 |
| $(2,1,0)$ | 5 | 4 | ja | 27 |

Begge forslagene gir en gyldig øvre grense. Det første sier bare at ingen plan gir mer enn 36. Det andre gir 27, nøyaktig det $(3,3)$ oppnår. For det andre forslaget kan vi skrive regningen ut: multipliser maskintimekravet med 2 og arbeidstimekravet med 1, og legg sammen:

$$2(2x+y)+(x+2y)=5x+4y\le2\cdot9+9=27.$$

Ingen tillatt plan kan gi mer enn 27, mens $(3,3)$ gir 27. Vi har et **optimalitetssertifikat** uten å måtte undersøke flere punkter. Prisen på A-grensen er null, og grensen har ett ubrukt parti: å øke bare denne grensen litt hjelper ikke nå.

### Fra prisforslag til et nytt optimeringsproblem

Vi krever at alle tre prisene er ikke-negative. Innsatsen må koste **minst** bidraget per parti, ellers kan prisregningen ikke avgrense bidraget:

| Prisregel | Ressurser per parti × pris | Krav |
|:--|:--|:--|
| A-parti | $2u+v+w$ | $2u+v+w\ge5$ |
| B-parti | $u+2v$ | $u+2v\ge4$ |
| Prisene | $u,v,w$ | $u,v,w\ge0$ |

For hver tillatt plan og hvert gyldig prisvalg får vi den vektede ulikheten

$$5x+4y\le(2u+v+w)x+(u+2v)y\le9u+9v+4w.$$

1. Pris hvert produkt: $2u+v+w\ge5$ og $u+2v\ge4$. Siden $x,y\ge0$, gir dette $5x+4y\le(2u+v+w)x+(u+2v)y$.
2. Samle ressursene: $(2u+v+w)x+(u+2v)y=(2x+y)u+(x+2y)v+xw$. Bruk så kapasitetene: $(2x+y)u+(x+2y)v+xw\le9u+9v+4w$. Her kan vi multiplisere kravene med prisene fordi $u,v,w\ge0$.
3. Sammenlign en plan med prisgrensen: $(3,3)$ gir $5\cdot3+4\cdot3=27$, mens prisene $(2,1,0)$ gir $9\cdot2+9\cdot1+4\cdot0=27$. Planen når grensen, så ingen tillatt plan er bedre.

Produksjonsproblemet kalles **primalen**. Å velge gyldige priser med lavest mulig øvre grense er **dualen**, og prisene $u,v,w$ kalles også **dualvariabler**. At verdien til enhver tillatt plan er høyst grensen fra ethvert gyldig prisvalg, kalles **svak dualitet**. Når en plan når prisgrensen, gir de to et **optimalitetssertifikat**.

Mer kompakt kan et maksimeringsproblem skrives

$$\max_{z\ge0}p^Tz\quad\text{slik at }Az\le b.$$

Hver rad i $A$ får én ikke-negativ pris i $q$; her er $q=(u,v,w)$ i rekkefølgen maskintimer, arbeidstimer, A-grense. Priskravene er $A^Tq\ge p$. Den samme vektede ulikheten gir dualproblemet

$$\min_{q\ge0}b^Tq\quad\text{slik at }A^Tq\ge p.$$

For enhver tillatt plan $z$ og ethvert gyldig prisvalg $q$ gjelder den svake dualiteten $p^Tz\le b^Tq$.

Når begge LP-er har mulige løsninger og et endelig optimum, er de beste verdiene like (**sterk dualitet**). Vårt talleksempel trenger ikke denne generelle setningen: vi har allerede vist to mulige valg med samme verdi.

### Komplementær slakk: finn prisene fra planen

<div id="uke11-slakk"></div>

Prisene $(2,1,0)$ falt ikke ned fra himmelen. Vi kan *finne* dem fra planen. For en tillatt plan $z$ og gyldige priser $q$ kan forskjellen mellom prisgrensen og bidraget deles i to summer av ikke-negative produkter:

$$b^Tq-p^Tz=\underbrace{q^T(b-Az)}_{\text{pris}\,\times\,\text{slakk}}+\underbrace{z^T(A^Tq-p)}_{\text{mengde}\,\times\,\text{overskudd i innsatspris}}\ge0.$$

Når forskjellen er null, må hvert enkelt produkt være null. Dette kalles **komplementær slakk**:

- en ressurs med positiv pris har null slakk; en ressurs med slakk har pris null,
- et produkt som lages i positiv mengde, har innsatspris lik bidraget; et produkt med innsatspris større enn bidraget lages ikke.

Bruk regelen på planen $(3,3)$. Vi *antar* at $(3,3)$ er optimal og at det finnes priser med samme verdi. Regelen gir da én kandidat; steg 3 kontrollerer at kandidaten faktisk er et gyldig prisvalg.

1. A-grensen har slakk $4-3=1$. Da må $w\cdot1=0$, altså $w=0$.
2. Både $x=3$ og $y=3$ er positive. Derfor må $2u+v+w=5$ og $u+2v=4$. Med $w=0$ gir den første likningen $v=5-2u$. Sett inn i den andre: $u+2(5-2u)=4$, så $10-3u=4$ og $u=2$. Dermed er $v=1$.
3. Kontroller at prisene er gyldige: $u,v,w\ge0$, $2u+v+w=5\ge5$ og $u+2v=4\ge4$. Grensen blir $9u+9v+4w=27$, lik planens bidrag, så både plan og priser er optimale.

Likningene i steg 2 kan skrives som én vektorlikning:

$$u\begin{pmatrix}2\\1\end{pmatrix}+v\begin{pmatrix}1\\2\end{pmatrix}=\begin{pmatrix}5\\4\end{pmatrix}.$$

Venstresiden består av radene til de to aktive grensene, altså normalvektorene til linjene som møtes i $(3,3)$. Høyresiden er gradienten til $P$. **Prisene er vektene som bygger målretningen av normalene til de aktive grensene.** Figuren viser dette. Bildet svarer også på spørsmålet fra [uke 8](uke8.qmd#uke8-kompakt): på randen er gradienten ikke null, men en ikke-negativ kombinasjon av normalene til de aktive grensene.

```{pyodide-python}
#| label: week11-normals
# Målretningen (5, 4) er 2·(2, 1) + 1·(1, 2) i hjørnet (3, 3).
fig, ax = plt.subplots(figsize=(6, 5))
ax.fill(corners[:, 0], corners[:, 1], alpha=.18, color="tab:blue")
ax.plot(*np.vstack((corners, corners[0])).T, color="tab:blue")
k = 0.35   # skalering av pilene, bare for tegningen
arrow = dict(head_width=.1, length_includes_head=True)
ax.arrow(3, 3, k*4, k*2, color="tab:blue", **arrow)
ax.arrow(3 + k*4, 3 + k*2, k*1, k*2, color="tab:green", **arrow)
ax.arrow(3, 3, k*5, k*4, color="tab:red", **arrow)
ax.text(3.9, 3.0, "u·(2, 1), u = 2", color="tab:blue")
ax.text(4.75, 3.85, "v·(1, 2), v = 1", color="tab:green")
ax.text(2.9, 4.55, "gradient (5, 4)", color="tab:red")
ax.set(xlim=(0, 6.4), ylim=(0, 5.1), xlabel="A-partier x",
       ylabel="B-partier y", title="Prisene bygger målretningen")
ax.set_aspect("equal")
plt.show()
```

Den inaktive A-grensen er ikke med i summen; den har pris null. I [uke 12](uke12.qmd#uke12-lagrange) ser vi samme bilde for krumme grenser: gradienten til målet er en kombinasjon av gradientene til bibetingelsene, og vektene heter Lagrange-multiplikatorer.

En aktiv grense kan likevel ha pris null, som vi ser ved $\Delta=3/2$ i 11.4.

<details class="reading-step">
<summary>Gå i dybden: andre fortegn i primalen</summary>

Hvis rader eller variabler har andre fortegn, må også prisreglene endres. For et primalproblem som maksimeres, gir en $\ge$-rad en ikke-positiv dualvariabel og en likningsrad en fri dualvariabel. En fri primalvariabel gir et likhetskrav i dualen. Den vektede ulikheten forklarer fortegnsreglene: vi kan bare multiplisere en ulikhet med en pris uten å snu den når prisen har riktig fortegn. I hovedmodellen bruker vi bare $Az\le b$ og $z\ge0$.

</details>

## 11.4 Hva er en ekstra maskintime verdt?

<div id="uke11-sensitivitet"></div>

En **lokal ressursverdi** er økningen i det beste bidraget **per ekstra enhet** av ressursen, når kapasiteten endres litt. Vi undersøker om verdien av en maskintime fortsatt er 2 tusen kroner når kapasiteten endres.

### Når den gamle timeprisen fortsatt virker

Hvor mye bør verkstedet betale for mer maskinkapasitet? Gi det $\Delta$ flere maskintimer. De gamle prisene $(2,1,0)$ gir da øvre grense $2(9+\Delta)+9=27+2\Delta$. Når planen ved $\Delta=1/2$ denne grensen?

Sett begge timekrav lik kapasiteten: $2x+y=19/2$ og $x+2y=9$. Trekker vi den andre likningen fra den første, får vi $x-y=1/2$, og innsetting gir $(x,y)=(10/3,\,17/6)$. Planen oppfyller $x\le4$ og $x,y\ge0$ og gir $5(10/3)+4(17/6)=28$. Dette er prisgrensen $27+2(1/2)=28$, så den halve ekstra maskintimen øker det beste bidraget med 1 tusen kroner.

### Når en annen grense stopper produksjonen

Kan vi fortsatt bruke prisen 2 per maskintime etter en større økning? Ved $\Delta=2$ øker maskinkapasiteten til 11:

1. Løs først timegrensene: $2x+y=11$ og $x+2y=9$ gir $x-y=2$, så $x=y+2$. Dermed er $3y+2=9$, $y=7/3$ og $x=13/3>4$. Denne planen bryter A-grensen.
2. Sett i stedet $x=4$ og bruk all arbeidstid: $4+2y=9$ gir $y=5/2$. Planen $(4,5/2)$ bruker $2\cdot4+5/2=21/2\le11$ maskintimer og gir $5\cdot4+4(5/2)=30$ tusen kr.
3. Den gamle prisformelen gir øvre grense $27+2\cdot2=31$, som planen ikke når. Prøv prisene $(u,v,w)=(0,2,3)$: de priser A til $2\cdot0+2+3=5$ og B til $0+2\cdot2=4$.

Disse prisene gir en ny øvre grense:

$$2(x+2y)+3x=5x+4y\le2\cdot9+3\cdot4=30.$$

Planen $(4,5/2)$ oppnår 30. Nå er det arbeidstimene og A-grensen
som bestemmer beste verdi; ekstra maskintimer alene hjelper ikke.

**Det aktive paret har byttet.** Det nye hjørnet $(4,5/2)$ er skjæringspunktet mellom arbeidstimer og A-grense, det samme punktet som lå *utenfor* området i håndeksemplet i 11.1, fordi det trenger $21/2$ maskintimer. Med nok maskintimer er det paret arbeidstimer og A-grense som bestemmer hjørnet, og komplementær slakk med dette paret gir prisene $(0,2,3)$. **En ressurspris gjelder så lenge det samme paret av grenser er aktivt.** Når paret bytter, må prisene regnes ut på nytt.

Paret bytter ved $\Delta=3/2$, der maskinkapasiteten er $21/2$. Der er både $(2,1,0)$ og $(0,2,3)$ optimale priser: prisene er ikke entydige, og økningen i beste bidrag per ekstra maskintime er 2 til venstre og 0 til høyre. En løser rapporterer bare ett av prisvalgene.

Figuren lar oss se *hvilken grense* som stopper forbedringen. Sammenlign hvor mållinjen berører det blå området i øverste panel (opprinnelig kapasitet) og nederste panel (to ekstra maskintimer). Begge panelene har samme akser.

```{pyodide-python}
#| label: week11-capacity-geometry
# Bruk vertikale paneler med samme akser, så endret form kan sammenlignes.
fig, axes = plt.subplots(2, 1, figsize=(6, 10), constrained_layout=True)
# x-verdiene brukes til å tegne grense- og mållinjene i hvert panel.
xx = np.linspace(0, 4.8, 120)
# For hvert tilfelle: ekstra timer, hjørnene rundt området, beste plan, bidrag.
cases = [
    (0., np.array([[0., 0.], [4., 0.], [4., 1.],
                    [3., 3.], [0., 4.5]]), (3., 3.), 27.),
    (2., np.array([[0., 0.], [4., 0.], [4., 2.5],
                    [0., 4.5]]), (4., 2.5), 30.),
]
for ax, (delta, polygon, best, value) in zip(axes, cases):
    # Fyll planene som oppfyller alle krav; de rette linjene viser timegrenser.
    ax.fill(polygon[:, 0], polygon[:, 1], alpha=.22, color="tab:blue",
            label="Tillatte planer")
    # En økt høyreside skyver bare maskinlinjen utover.
    ax.plot(xx, 9 + delta - 2*xx, color="tab:blue", label="Maskintimer")
    ax.plot(xx, (9 - xx)/2, color="tab:green", label="Arbeidstimer")
    # A-grensen står fast; den blir avgjørende i det nederste panelet.
    ax.axvline(4, color="tab:purple", linestyle=":", label="A-grense x = 4")
    # Legg mållinjen gjennom beste plan og marker berøringspunktet.
    ax.plot(xx, (value - 5*xx)/4, "--", color="tab:orange",
            label=f"P = {value:g}")
    ax.plot(*best, "o", color="tab:red", label="Beste plan")
    ax.set(xlim=(0, 4.8), ylim=(0, 5.1), xlabel="A-partier x",
           ylabel="B-partier y", title=f"Ekstra maskintimer: Δ = {delta:g}")
    ax.set_aspect("equal")
    ax.legend(fontsize=8, loc="upper right")
plt.show()
```

### Beste bidrag som funksjon av kapasiteten

La $P_*(\Delta)$ være det største mulige dekningsbidraget med maskinkapasitet $9+\Delta$. Vi løser modellen for mange $\Delta$ og tegner $P_*$ sammen med den gamle prisgrensen $27+2\Delta$. **Forutsi:** Hvor følger kurven den rette linjen, og hvor knekker den?

```{pyodide-python}
#| label: week11-marginals
# Endre bare første kapasitet (maskintimene); hold A, p og andre grenser fast.
deltas = np.linspace(-4, 4, 81)
best_values = []
for delta in deltas:
    changed = b.copy()
    changed[0] += delta
    trial = linprog(-p, A_ub=A, b_ub=changed, bounds=(0, None), method="highs")
    # SciPy minimerer -P; snu fortegnet. Uten optimum lagres nan (ingen verdi).
    best_values.append(-trial.fun if trial.success else np.nan)

fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(deltas, best_values, label="Beste bidrag P*(Δ)")
ax.plot(deltas, 27 + 2*deltas, "--", label="Gammel prisgrense 27 + 2Δ")
ax.axvline(1.5, color="gray", linestyle=":", label="Δ = 3/2: paret bytter")
ax.set(xlabel="Ekstra maskintimer Δ", ylabel="Tusen kr",
       title="Stigningstallet er ressursprisen")
ax.legend(fontsize=8); ax.grid(alpha=.3)
plt.show()

for d in (0, .5, 2):
    k = np.argmin(abs(deltas - d))
    print(f"Δ = {d:g}: beste bidrag {best_values[k]:g}, gammel grense {27 + 2*d:g}")
# Marginalene fra startmodellen, i samme rekkefølge som radene i A.
print("SciPy-marginaler ved Δ = 0:   ", result.ineqlin.marginals + 0)
print("Ressursverdier for P (snudd):", -result.ineqlin.marginals + 0)
```

Kurven har stigningstall 2 fram til $\Delta=3/2$ og er flat etterpå. Bidragene ved $\Delta=0,1/2,2$ er $27,28,30$, mens den gamle prisformelen gir $27,28,31$. **Stigningstallet er ressursprisen, og knekken kommer der det aktive paret bytter.** `ineqlin.marginals` er den *lokale* endringen i minimeringsverdien når en høyreside økes. SciPy minimerer $-P$, så marginalene $(-2,-1,0)$ gir de lokale verdiene $(2,1,0)$ for ekstra maskintime, arbeidstime og høyere A-grense. For større endringer må vi sjekke om en plan fortsatt kan oppnå prisgrensen.

<details class="reading-step">
<summary>Gå i dybden: hvor lenge er prisformelen eksakt?</summary>

For å finne hele intervallet der gammel pris gir riktig *optimalverdi*, lar vi $\Delta$ være en endring i maskinkapasiteten: positiv $\Delta$ betyr flere timer, negativ $\Delta$ betyr færre. Den nye kapasiteten er $9+\Delta$.

1. Hold begge timegrensene aktive: $2x+y=9+\Delta$ og $x+2y=9$. Trekk den andre fra den første: $x-y=\Delta$, så $x=y+\Delta$. Sett inn: $3y+\Delta=9$. Dermed er $y=3-\Delta/3$ og $x=3+2\Delta/3$.
2. Kontroller de øvrige kravene: $x\ge0$ gir $\Delta\ge-9/2$; $y\ge0$ gir $\Delta\le9$; $x\le4$ gir $\Delta\le3/2$. Felles intervall er $-9/2\le\Delta\le3/2$. Her er også $9+\Delta\ge0$.
3. Sett planen inn i målet: $5(3+2\Delta/3)+4(3-\Delta/3)=27+2\Delta$. Planen oppnår prisgrensen. Hvis $P_*(\Delta)$ er *størst mulig dekningsbidrag* ved kapasitet $9+\Delta$, er derfor $P_*(\Delta)=27+2\Delta$ i intervallet. For økninger gjelder dette til og med $\Delta=3/2$; etterpå trengs en ny pris.

Intervallet er nettopp der det aktive paret maskintimer og arbeidstimer gir et tillatt hjørne.

Ved $\Delta=3/2$ blir punktet $(4,5/2)$ tillatt, og der er alle tre grensene aktive samtidig. Prisene $(0,2,3)$ gir da grensen $0\cdot\tfrac{21}{2}+2\cdot9+3\cdot4=30$, den samme verdien som $(2,1,0)$ gir: $2\cdot\tfrac{21}{2}+9=30$. Prisene $(0,2,3)$ er altså allerede optimale, selv om maskintimekravet fortsatt er aktivt. En aktiv grense kan ha pris null.

</details>

<details class="reading-step">
<summary>Gå i dybden: hva om partiene må være hele?</summary>

Hvis partier må være hele, er det tillatte området bare heltallspunktene i mangekanten. Den delbare modellen kalles da en **relaksasjon**: den tillater flere planer, så dens beste verdi blir minst like stor som heltallsmodellens. Relaksasjonen gir altså en øvre grense, men avrunding gir ingen garanti.

Et eksempel: fire studenter bygger nye maskiner ($N$ stykk, 10 komponenter og 1 time hver, overskudd 500 kr) og reparerer gamle ($r$ stykk, 1 komponent og 3 timer hver, overskudd 250 kr). De har 100 komponenter og 50 timer, og en fast reisekostnad på 650 kr. Relaksasjonen har optimum i skjæringspunktet $(N,r)=(250/29,\,400/29)\approx(8.62,\,13.79)$ med overskudd $225000/29-650\approx7108.62$ kr. Avrunding til nærmeste heltall gir $(9,14)$, som trenger 104 komponenter og ikke er tillatt. Avrunding nedover gir $(8,13)$ og 6600 kr. Den beste heltallsplanen er $(8,14)$ med 6850 kr, som lar seks komponenter stå ubrukt. Heltallsproblemer løses med egne metoder som bruker relaksasjoner som øvre grenser.

I verkstedet er $(10/3,17/6)$ ved $\Delta=1/2$ ikke en plan med hele partier.

</details>

### Fra ressurspriser til multiplikatorer

Ressursprisene er et første eksempel på **multiplikatorer**: tall som veier sammen grensene slik at de gir et bevis, og som samtidig måler hva en litt større kapasitet er verdt. I [uke 12](uke12.qmd#uke12-lagrange) er bibetingelsene krumme likninger, og vi møter Lagrange-multiplikatorer. De er priser på samme måte som dualvariablene her: de måler hva en litt endret bibetingelse er verdt ([uke 12](uke12.qmd#uke12-pris)). Ulikheter med komplementær slakk kommer der bare som valgfri fordypning.

## 11.5 Regneoppgaver

<div id="uke11-oppgaver"></div>

Oppgave 1–2 følger modell og prisbevis; oppgave 3–4 følger kapasitetsforsøket; oppgave 5–6 kontrollerer om en grense eller et problem faktisk gir et optimum. Oppgave 7–8 følger bidragsforsøket og hjørnene som likningssystemer i 11.1, og oppgave 9 kontrollerer et sertifikat med tre produkter. Svar eksakt uten avrunding. Begrunn tolkningene i egne notater. Kodeoppgavene er i 11.6.

::: {#week11-exercise-context .math-exercise-context}

Verkstedet maksimerer $P=5x+4y$ under $2x+y\le9$, $x+2y\le9$, $x\le4$ og $x,y\ge0$. Slakk er kapasitet minus bruk. Gyldige ikke-negative priser $(u,v,w)$ oppfyller $2u+v+w\ge5$ og $u+2v\ge4$; da er $9u+9v+4w$ en øvre grense for $P$.

:::

**Oppgave 1 – undersøk en plan.**

```{math-exercise}
#| label: week11-task-slack
#| context: week11-exercise-context
#| caption: Slakk og dekningsbidrag
#| mode: equivalent
#| partial-credit: true
#| field-labels: slakk maskintimer, slakk arbeidstimer, slakk A-grense, dekningsbidrag

Sett $(x,y)=(4,1)$. Finn slakken i de tre begrensningene i oppført rekkefølge og beregn dekningsbidraget. Forklar i egne notater om planen er tillatt og hvilke grenser som er aktive.

Slakk: vec[0,3,0]
Dekningsbidrag: _[24]

Finn også skjæringen mellom de to timegrensene. Sammenlign bidraget
der med bidragene i hjørnetabellen i 11.1, og forklar hvilken plan som er best.
```

**Oppgave 2 – finn prisene og bygg en øvre grense.**

```{math-exercise}
#| label: week11-task-bound
#| context: week11-exercise-context
#| caption: Ressurspriser som sertifikat
#| mode: equivalent
#| partial-credit: true
#| field-labels: pris w på A-grensen, pris u per maskintime, pris v per arbeidstime, øvre grense, innsatspris A, innsatspris B

Planen $(3,3)$ er tillatt. Bruk komplementær slakk: hvilken grense har slakk, og hvilken pris må derfor være null? Begge produktene lages, så hvilke to priskrav må være oppfylt med likhet? Løs likningene.

$w=$ _[0]
$(u,v)=$ vec[2,1]

Regn så ut øvre grense $9u+9v+4w$ og innsatsprisene $2u+v+w$ for A og $u+2v$ for B med disse prisene.

Øvre grense: _[27]
Innsatspriser (A, B): vec[5,4]

Forklar i egne notater hvorfor en tillatt plan med bidrag lik grensen er optimal.
```

**Oppgave 3 – endret kapasitet.**

```{math-exercise}
#| label: week11-task-perturb
#| context: week11-exercise-context
#| caption: Nytt skjæringspunkt
#| mode: equivalent
#| partial-credit: true
#| field-labels: nye partier A, nye partier B, nytt dekningsbidrag

Øk bare maskintimene fra 9 til 10. Anta at de to timegrensene fortsatt er aktive. Løs grenselikningene, kontroller $x\le4$ og finn det nye dekningsbidraget. Skriv produksjonstallene som brøker.

Plan: vec[11/3,8/3]
Dekningsbidrag: _[29]
```

**Oppgave 4 – prisen har et gyldighetsområde.**

```{math-exercise}
#| label: week11-task-range
#| context: week11-exercise-context
#| caption: Største økning med gammel pris
#| mode: equivalent
#| field-labels: største kapasitetsøkning

Med maskinkapasitet $9+\Delta$ gir de to aktive timegrensene $x=3+2\Delta/3$ og $y=3-\Delta/3$. Finn den største $\Delta\ge0$ som fortsatt oppfyller $x\le4$. Hvorfor må prisanslaget undersøkes på nytt etter denne økningen?

$\Delta=$ _[3/2]
```

**Oppgave 5 – en øvre grense trenger ikke være skarp.**

```{math-exercise}
#| label: week11-task-loose-bound
#| context: week11-exercise-context
#| caption: Gyldig, men løs øvre grense
#| mode: equivalent
#| partial-credit: true
#| field-labels: innsatspris A, innsatspris B, øvre grense

Prøv $(u,v,w)=(1,2,1)$. Finn innsatsprisene for A og B og den øvre grensen. Er prisene gyldige?

Innsatspriser (A, B): vec[5,5]
Øvre grense: _[31]

Sammenlign med planen $(3,3)$. Bruk komplementær slakk til å forklare hvorfor akkurat dette prisvalget ikke kan bevise at $(3,3)$ er optimal: hvilket produkt har innsatspris større enn bidraget, og hva krever regelen da av mengden?
```

**Oppgave 6 – skille mellom ulike utfall.**

```{math-exercise}
#| label: week11-task-status
#| context: week11-exercise-context
#| caption: Tillatt område og ubegrenset mål
#| mode: equivalent
#| partial-credit: true
#| field-labels: problem I (motstridende krav), problem II (uten øvre grense)

Problem I krever $\tau\ge0$, $\tau\le1$ og $\tau\ge2$. Problem II maksimerer $\tau$ under bare $\tau\ge0$. Skriv **2** for umulig problem og **3** for ubegrenset mål. Forklar i egne notater hvorfor utfallene er forskjellige.

Problem I: _[2]
Problem II: _[3]
```

**Oppgave 7 – når bytter den beste planen hjørne?**

```{math-exercise}
#| label: week11-task-price-range
#| context: week11-exercise-context
#| caption: Bidraget fra A endres
#| mode: equivalent
#| partial-credit: true
#| field-labels: x ved a=1, y ved a=1, x ved a=5, y ved a=5, x ved a=10, y ved a=10, nedre knekkpunkt, øvre knekkpunkt

Nå er det bidraget fra A som er usikkert: målet endres til $ax+4y$, mens kravene er de samme. Bruk de fem hjørnene $(0,0)$, $(4,0)$, $(4,1)$, $(3,3)$ og $(0,9/2)$ og finn den beste planen for tre verdier av $a$.

$a=1$: vec[0,9/2]
$a=5$: vec[3,3]
$a=10$: vec[4,1]

For hvilke to verdier av $a$ er en hel kant optimal? Bruk at mållinjen da er parallell med en kant.

Nedre knekkpunkt: $a=$ _[2]
Øvre knekkpunkt: $a=$ _[8]
```

**Oppgave 8 – hjørne, utenfor eller singulært?**

```{math-exercise}
#| label: week11-task-pairs
#| context: week11-exercise-context
#| caption: Hjørner fra par av aktive grenser
#| mode: equivalent
#| partial-credit: true
#| field-labels: x fra maskintimer og y=0, y fra maskintimer og y=0, første punkt tillatt, x fra arbeidstimer og x=0, y fra arbeidstimer og x=0, andre punkt tillatt, determinant for maskintimer og arbeidstimer, determinant for A-grense og x=0

Sett to grenser lik kapasiteten (eller null) og løs. Kontroller deretter de andre kravene. Skriv **1 for ja, 0 for nei** i feltene for «tillatt».

Paret maskintimer og $y=0$ gir

$(x,y)=$ vec[9/2,0]

Tillatt: _[0]

Paret arbeidstimer og $x=0$ gir

$(x,y)=$ vec[0,9/2]

Tillatt: _[1]

Finn determinanten til koeffisientmatrisen for paret maskintimer og arbeidstimer, og for paret A-grense og $x=0$.

Maskintimer og arbeidstimer: _[3]
A-grense og $x=0$: _[0]

Forklar i egne notater hva de to determinantene sier om linjene, og hvilket krav det første punktet bryter.
```

**Oppgave 9 – et sertifikat med tre produkter.**

Nå er det tre produkter, og vi kan ikke lenger tegne området i planet. Et sertifikat kan fortsatt kontrolleres for hånd.

```{math-exercise}
#| label: week11-task-three-products
#| caption: Kontroller plan og priser med tre produkter
#| mode: equivalent
#| partial-credit: true
#| field-labels: slakk materiale, dekningsbidrag, innsatspris C, øvre grense

En bedrift lager $x_A,x_B,x_C$ partier og maksimerer $6x_A+5x_B+7x_C$ (tusen kr) under
$2x_A+x_B+3x_C\le20$ (maskintid), $x_A+2x_B+x_C\le16$ (montering), $x_A+x_B+2x_C\le15$ (materiale) og $x_A,x_B,x_C\ge0$. Undersøk planen $(8,4,0)$ og prisene $(7/3,\,4/3,\,0)$ per enhet maskintid, montering og materiale.

Slakk i materiale: _[3]
Dekningsbidrag for planen: _[68]

Innsatsprisene for A og B er lik bidragene 6 og 5. Finn innsatsprisen for C.

Innsatspris C: _[25/3]
Øvre grense $20\cdot\tfrac73+16\cdot\tfrac43+15\cdot0$: _[68]

C gir høyest bidrag per parti. Bruk komplementær slakk til å forklare hvorfor C likevel ikke lages i en optimal plan.
```

## 11.6 Python: undersøk og kontroller

<div id="uke11-python"></div>

Forsøkene i 11.2–11.4 bruker `linprog` fra SciPy. Oppslagsboksen samler det du trenger å vite om kallet og resultatet.

<details>
<summary>SciPy-oppslag: `linprog` og resultatet</summary>

| Skriv/les | Betydning i modellen |
|:--|:--|
| `linprog(-p, A_ub=A, b_ub=b, bounds=(0,None), method="highs")` | Minimer $-p^Tz$ under $Az\le b$ og $z\ge0$. Likninger kan gis med `A_eq`, `b_eq`. |
| `result.status`, `result.success`, `result.message` | Undersøk utfallet først; status 0 er vellykket, 2 umulig, 3 ubegrenset. |
| `result.x`, `result.fun` | Plan og **minimeringsverdi**. Vårt bidrag er `-result.fun`. |
| `result.ineqlin.residual`, `result.ineqlin.marginals` | Slakk og lokal verdiendring for minimeringsmålet per rad. Snudd fortegn gir ressursverdien for $P$. |
| `np.linalg.solve(M, h)` | Løs et kvadratisk system. Ved en singulær matrise kastes `np.linalg.LinAlgError`. |

</details>

Hva skjer hvis løseren *ikke* finner en beste plan? To små modeller med én variabel $\tau$ skiller **umulig** (status 2) fra **ubegrenset** (status 3); regneoppgave 6 bruker de samme modellene. Se hvilken status hver modell får:

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

Disse korte oppgavene kan kjøres uavhengig av hverandre. Data, importer og funksjonsrammer er gitt; fyll inn bare `TODO`-stedene. Kontrollene vurderer returverdier uten å vise løsningskode.

**Oppgave 1 – beregn slakk og bidrag.** Returner paret `(slack, profit)` for en plan `z`. `slack` skal ha én verdi per rad i `A`, også når planen bryter en grense.

```{py-exercise}
#| label: week11-python-evaluate
#| caption: Beregn ressursbruk og dekningsbidrag
#| show-test-hints: false
# Bruk NumPy til matrise- og vektorregningen.
import numpy as np

# Radene er ressurskravene; kapasitetene står i b. Kolonner: A, B.
A = np.array([[2., 1.], [1., 2.], [1., 0.]])
b = np.array([9., 9., 4.])
p = np.array([5., 4.])

def evaluate(z):
    # TODO: Beregn slakk som kapasitet minus bruk og bidrag som p@z.
    return None

## TESTS ##
assert np.allclose(evaluate(np.array([3., 3.]))[0], [0., 0., 1.])
assert np.isclose(evaluate(np.array([3., 3.]))[1], 27.)
assert np.allclose(evaluate(np.array([4., 2.]))[0], [-1., 1., 0.])
assert np.isclose(evaluate(np.array([4., 2.]))[1], 28.)
```

**Oppgave 2 – send modellen til SciPy.** Bruk arrayene til å maksimere bidraget med `linprog`. Returner hele resultatobjektet, slik at det kan kontrolleres.

```{py-exercise}
#| label: week11-python-solve
#| caption: Løs den delbare produksjonsmodellen
#| show-test-hints: false
# NumPy holder dataene, mens SciPy løser LP-modellen.
import numpy as np
from scipy.optimize import linprog

# En rad per begrensning og en kolonne per produkt.
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

**Oppgave 3 – kontroller et prisbevis.** Returner `(plan_ok, prices_ok, gap)`: om planen oppfyller alle krav, om prisene oppfyller alle prisreglene, og forskjellen mellom øvre grense og planens bidrag. Bruk toleranse `1e-9` ved sammenligning.

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

**Oppgave 4 – finn alle hjørnene.** Alle fem grensene er skrevet som rader i $Gz\le h$; fortegnskravene står som $-x\le0$ og $-y\le0$. Gå gjennom alle par av rader. For hvert par løser du $2\times2$-systemet der de to radene holder med likhet. Et singulært par får `np.linalg.solve` til å kaste en `np.linalg.LinAlgError`: fang den med `try`/`except` og tell paret som singulært. Behold løsningen som et hjørne hvis den oppfyller **alle** fem ulikhetene (med toleranse `1e-9`); ellers teller du den som utenfor. Returner `(found, outside, singular)`: listen med hjørner og de to antallene.

```{py-exercise}
#| label: week11-python-vertices
#| caption: Finn hjørnene som løsninger av 2×2-systemer
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

Bruk funksjonen etterpå: regn ut $5x+4y$ i hvert hjørne og kontroller at det største er 27. For hvor mange par av rader måtte du løse et system?

I [prosjektet](project_week11.qmd) bruker du dualvariabler og komplementær slakk til å forklare hva strøm koster i et forenklet kraftmarked.

:::
