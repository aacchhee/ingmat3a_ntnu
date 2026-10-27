:::: {.callout-note}
## Slik bruker du siden

**Ukens spørsmål: Hva slags informasjon mister en matrise – og hva kan vi finne igjen?**

Vi følger ett lite eksempel hele uka: Et bilde med 16 piksler gjøres om til et bilde med fire piksler.
Underveis får ideene navn: lineær transformasjon, basis og koordinater, nullrom og rang. Til slutt bruker vi
de samme ideene på polynomer. Denne overgangen er grunnlaget for prosjektet.

**Kort løype**

1. [3.1 To bilder, samme output](#uke3-start): noe går tapt.
2. [3.2 Fra bilde til vektor og matrise](#uke3-del1): én rad er én måling.
3. [3.3 Beskriv bilder med forskjellige basiser](#uke3-del2): samme bilde, to oppskrifter.
4. [3.4 Hva transformasjonen ser og ikke ser](#uke3-del3): nullrom, kolonnerom og rang.
5. [3.5 Overfør ideene til polynomer](#uke3-del5): grunnlaget for prosjektet.

**Forelesning** viser hovedløpet. **Gå i dybden** åpner mellomregninger, ekstra forsøk og sidespor.
[3.6](#uke3-del4) er egenarbeid med bildeforsøk og oppgaver. **Støtteløpet** ([3.7](#uke3-stotte-matriser)–3.8)
er et oppslagsverk dersom Gauss-eliminasjon, pivoter, kolonnerom eller nullrom ikke sitter friskt.
::::

:::: {.callout-tip collapse="true"}
## NumPy-cheatsheet for denne uka

Koden er et verktøy for å undersøke lineær algebra, ikke et eget
programmeringspensum. Åpne denne boksen når du møter en ukjent kodelinje.
Du trenger ikke lære alt utenat.

### Lag og les arrays

```python
x = np.array([2.0, -1.0, 3.0])
X = np.array([[1.0, 2.0],
              [3.0, 4.0]])
```

`x` er en vektor med tre tall. `X` er en $2\times2$-tabell. Python teller fra
0, så `x[0]` er første tall, `X[0, 1]` er tallet i første rad og andre
kolonne, og `X.shape` er `(2, 2)`.

### Bytt mellom bilde og vektor

```python
x = X.reshape(-1)       # [1., 2., 3., 4.]
X_again = x.reshape(2, 2)
```

`reshape` flytter ikke eller endrer noen verdier. Den viser bare de samme
tallene med en annen form. `-1` betyr «la NumPy finne riktig lengde».

### Bygg matriser av vektorer

```python
A = np.column_stack([u, v])   # u og v blir kolonner
B = np.vstack([r1, r2])       # r1 og r2 blir rader
```

Bruk `column_stack` når vektorene er byggesteiner eller basisvektorer. Bruk
`vstack` når hver vektor beskriver én måling eller én likning.

### Kombiner hvert tall i én liste med hvert tall i en annen

```python
a = np.array([1.0, 2.0, 3.0])
b = np.array([10.0, 20.0])
table = a[:, None] * b[None, :]   # rad i, kolonne j: a[i]*b[j]
```

`a[:, None]` gjør `a` til en kolonne med form `(3, 1)`, og `b[None, :]` gjør
`b` til en rad med form `(1, 2)`. NumPy kombinerer da hvert tall i kolonnen
med hvert tall i raden og lager $3\times2$-tabellen
`[[10, 20], [20, 40], [30, 60]]`. Det samme virker med `+`, `-` og `**`.

```python
err = np.array([0.1, -0.5, 0.3])
i = np.argmax(np.abs(err))   # plassnummeret til det største avviket: 1
```

`argmax` gir plassen, ikke verdien; selve verdien er `err[i]`, her $-0.5$.

### Regn med matriser

```python
y = A @ x
c = np.linalg.solve(P, target)
```

`A @ x` er matrise-vektorproduktet $Ax$. `solve(P, target)` gjør reverse
engineering: Den finner koeffisientene `c` som oppfyller
`P @ c = target`. Vi bruker den her bare når matrisen er kvadratisk og likningssystemet har
nøyaktig én løsning.

### Kontroller et matematisk svar

```python
error = np.linalg.norm(A @ x - b)
rank = np.linalg.matrix_rank(A)
```

`norm` måler størrelsen på forskjellen. Et resultat som `1e-15` leses
vanligvis som numerisk null. `matrix_rank` teller hvor mange uavhengige
retninger NumPy kan skille med maskinpresisjonen; den erstatter ikke
begrunnelsen med pivoter eller lineær uavhengighet.

### Lag nyttige tallfølger og testdata

```python
indices = np.arange(4)                 # 0, 1, 2, 3
points = np.linspace(-1.0, 1.0, 5)    # fem jevnt fordelte punkter
rng = np.random.default_rng(8)
test = rng.random((2, 2))              # et tilfeldig 2x2-bilde
```

Et fast tall i `default_rng(8)` gjør at alle får de samme testdataene. Da kan
vi gjenta forsøket og sammenligne svar. `np.repeat` brukes senere til å
kopiere en verdi flere ganger; `np.zeros((m, n))` lager en $m\times n$-matrise
som du kan fylle ut.

Kode merket som **ferdig maskineri** kan brukes uten at du forstår alle
indeksene og løkkene. Les først kommentarene og spør: Hva er inputen? Hva er
outputen? Hvilken matematisk påstand skal utskriften eller figuren kontrollere?
::::

::: {.panel-tabset}

## 3.1 To bilder, samme output {#uke3-start}

Kan et sjakkbrett og en ensfarget grå flate bli helt like når vi gjør bildene mindre? Svaret er ja, og denne uka finner vi ut nøyaktig hvorfor. En **transformasjon** er en regel som tar en input og lager en output,

$$T(\text{input})=\text{output}.$$

Det er det samme som en funksjon; ordet **avbildning** brukes også. Her er inputen et bilde $X$ med 16 piksler og outputen et mindre bilde $Y=T(X)$ med fire piksler. Spørsmålet er hvilken informasjon regelen bruker, og om noe går tapt underveis.

::: {.reading-step title="Gå i dybden: transformasjon, funksjon og Python-funksjon"}

Inputen til en transformasjon kan være et bilde, en lydfil eller en tabell med målinger; outputen kan være et nytt bilde eller noen få tall som oppsummerer inputen. Hver tillatt input får nøyaktig én output, akkurat som for en **funksjon**. I matematikk er for eksempel $f(t)=t^2$ en funksjon som sender $3$ til $9$. I Python gjør `abs(-3)` inputen `-3` om til outputen `3`. På samme måte tar Python-funksjonen `average_pool(X)` inn et bilde og returnerer et mindre bilde.

Navnet transformasjon sier ikke noe mer mystisk enn dette. Det framhever bare at input og output gjerne er vektorer eller bilder, ikke nødvendigvis enkelttall.

:::

Figuren viser hele oppskriften uten matriser eller formler.

```{.jsxgraph width="760" height="430"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [0, 7.1, 12.2, 0.1],
  axis: false,
  showCopyright: false,
  showNavigation: false,
  pan: { enabled: false },
  zoom: { enabled: false }
});

var colors = ['#8ecae6', '#ffcf70', '#a8d5a2', '#d7b5e8'];
var dark = ['#277da1', '#d98900', '#4f8f49', '#8b5aa7'];

function rectangle(x0, y0, x1, y1, color, opacity, border) {
  return board.create('polygon', [[x0,y0],[x1,y0],[x1,y1],[x0,y1]], {
    fillColor: color,
    fillOpacity: opacity,
    vertices: { visible: false },
    borders: { strokeColor: border || '#555555', strokeWidth: 1.5,
               fixed: true, highlight: false },
    fixed: true,
    highlight: false
  });
}

// Stort bilde: fire fargekodede områder, hvert med fire synlige piksler.
for (var row = 0; row < 4; row++) {
  for (var col = 0; col < 4; col++) {
    var group = (row < 2 ? 0 : 2) + (col < 2 ? 0 : 1);
    var x0 = 0.8 + col;
    var y1 = 6.0 - row;
    rectangle(x0, y1-1, x0+1, y1, colors[group], 0.72, '#ffffff');
  }
}
rectangle(0.8,2.0,4.8,6.0,'none',0,'#333333');
board.create('segment', [[2.8,2.0],[2.8,6.0]], {
  strokeColor:'#333333', strokeWidth:3, fixed:true, highlight:false
});
board.create('segment', [[0.8,4.0],[4.8,4.0]], {
  strokeColor:'#333333', strokeWidth:3, fixed:true, highlight:false
});

board.create('text', [2.8,6.55,'STORT BILDE'], {
  anchorX:'middle', fontSize:16, cssStyle:'font-weight:600', fixed:true
});
board.create('text', [2.8,1.55,'Fire fargede områder · fire piksler i hvert'], {
  anchorX:'middle', fontSize:13, fixed:true
});

// Lite outputbilde: ett felt for hvert område.
var output = [
  [8.0,4.7,9.3,6.0], [9.3,4.7,10.6,6.0],
  [8.0,3.4,9.3,4.7], [9.3,3.4,10.6,4.7]
];
for (var i = 0; i < 4; i++) {
  rectangle(output[i][0],output[i][1],output[i][2],output[i][3],
            colors[i],0.85,'#ffffff');
  board.create('text', [(output[i][0]+output[i][2])/2,
                        (output[i][1]+output[i][3])/2,'ett tall'], {
    anchorX:'middle', anchorY:'middle', fontSize:12, fixed:true
  });
}
rectangle(8.0,3.4,10.6,6.0,'none',0,'#333333');
board.create('segment', [[9.3,3.4],[9.3,6.0]], {
  strokeColor:'#333333', strokeWidth:3, fixed:true, highlight:false
});
board.create('segment', [[8.0,4.7],[10.6,4.7]], {
  strokeColor:'#333333', strokeWidth:3, fixed:true, highlight:false
});
board.create('text', [9.3,6.55,'MINDRE BILDE'], {
  anchorX:'middle', fontSize:16, cssStyle:'font-weight:600', fixed:true
});

// Fire piler viser hvilket område som blir hvilken outputpiksel.
var starts = [[2.25,5.35],[4.25,5.35],[2.25,2.65],[4.25,2.65]];
var ends = [[8.0,5.35],[9.95,5.35],[8.0,4.05],[9.95,4.05]];
var bends = [6.25,6.05,1.05,1.25];
for (var j = 0; j < 4; j++) {
  var sx=starts[j][0], sy=starts[j][1], ex=ends[j][0], ey=ends[j][1];
  board.create('curve', [
    [sx, sx+1.15, ex-1.15, ex],
    [sy, bends[j], bends[j], ey]
  ], {
    strokeColor: dark[j], strokeWidth: 3, lastArrow: true,
    fixed: true, highlight: false
  });
}

board.create('text', [6.35,3.58,'samle'], {
  anchorX:'middle', fontSize:14, cssStyle:'font-weight:600', fixed:true
});
board.create('text', [6.35,3.22,'fire piksler'], {
  anchorX:'middle', fontSize:13, fixed:true
});
```

Fargene og pilene viser hva som hører sammen: De fire pikslene i det blå området samles til den blå outputpikselen, og så videre. «Samle» betyr her å ta gjennomsnittet av de fire pikselverdiene, et **blokkgjennomsnitt**. Dermed går vi fra 16 tall til fire tall.

Vi begynner med to $4\times4$-bilder som ser helt forskjellige ut: et ensfarget bilde $X_1$ og et tydelig sjakkmønster $X_2$. Bokstaven $X$ viser alltid til et inputbilde med 16 piksler og $Y$ til et outputbilde med fire piksler:

$$
Y_1=T(X_1), \qquad Y_2=T(X_2).
$$

Cellen under lager de to inputbildene og bruker den ferdige funksjonen `average_pool` på hvert av dem. Hvordan den regner ut blokkgjennomsnittene med en matrise, ser vi i 3.2.

```{pyodide-python}
#| label: week3-setup
#| autorun: true
#| context: setup

# Felles verktøy for hele siden. Denne cellen kjøres automatisk.
# Studentoppgavene bruker funksjonene, men krever ikke at du kan skrive dem.
import numpy as np
import matplotlib.pyplot as plt

def show_images(images, titles=None, cols=4, cmap="gray",
                vmin=None, vmax=None, figsize=None):
    """Vis flere 2D-arrays med samme fargeskala."""
    # Lukk eldre figurer før vi lager en ny. Det hindrer at en lang
    # arbeidsøkt samler mange usynlige figurer i minnet.
    plt.close("all")
    images = list(images)
    titles = [""]*len(images) if titles is None else list(titles)
    rows = int(np.ceil(len(images)/cols))
    # Små figurer er lettere å sammenligne mens siden brukes som tavle.
    figsize = (1.75*cols, 1.75*rows) if figsize is None else figsize
    fig, axes = plt.subplots(rows, cols, figsize=figsize, squeeze=False)
    axes = axes.ravel()
    for ax, image, title in zip(axes, images, titles):
        ax.imshow(image, cmap=cmap, vmin=vmin, vmax=vmax,
                  interpolation="nearest")
        ax.set_title(title, fontsize=9)
        ax.set_xticks([]); ax.set_yticks([])
    for ax in axes[len(images):]:
        ax.axis("off")
    plt.tight_layout(); plt.show()

def show_image_table(rows, row_labels, column_labels, cmap="gray",
                     vmin=None, vmax=None, cell_labels=None,
                     cell_styles=None, operators=None, figsize=(5.4, 5.0)):
    """Vis en bildetabell med samme fysiske størrelse per piksel."""
    plt.close("all")
    rows = [[np.asarray(image) for image in images] for images in rows]
    column_widths = [max(images[col].shape[1] for images in rows)
                     for col in range(len(column_labels))]
    row_heights = [max(image.shape[0] for image in images)
                   for images in rows]
    fig, axes = plt.subplots(len(rows), len(column_labels),
                             figsize=figsize, squeeze=False,
                             gridspec_kw={"width_ratios":column_widths,
                                          "height_ratios":row_heights})
    for row_index, (images, row_label) in enumerate(zip(rows, row_labels)):
        for col_index, (image, column_label) in enumerate(
                zip(images, column_labels)):
            ax = axes[row_index, col_index]
            canvas_rows = row_heights[row_index]
            canvas_cols = column_widths[col_index]
            image_rows, image_cols = image.shape
            # Kolonnebredder og radhøyder følger den største matrisen i
            # hver kolonne og rad. Mindre bilder sentreres i feltet. Dermed
            # har alle piksler samme fysiske størrelse, samtidig som tomrom
            # og avstand mellom bildene holdes nede.
            left = (canvas_cols-image_cols)/2
            top = (canvas_rows-image_rows)/2
            image_style = {"cmap":cmap, "vmin":vmin, "vmax":vmax}
            if cell_styles is not None:
                image_style.update(cell_styles[row_index][col_index])
            ax.imshow(image, interpolation="nearest",
                      extent=(left, left+image_cols, top+image_rows, top),
                      **image_style)
            ax.set_xlim(0, canvas_cols); ax.set_ylim(canvas_rows, 0)
            ax.set_aspect("equal"); ax.set_xticks([]); ax.set_yticks([])
            ax.set_frame_on(False)
            if row_index == 0:
                ax.set_title(column_label, fontsize=9)
            if col_index == 0:
                ax.set_ylabel(row_label, rotation=0, ha="right", va="center",
                              labelpad=18, fontsize=9)
            if cell_labels is not None:
                ax.set_xlabel(cell_labels[row_index][col_index], fontsize=8,
                              labelpad=4)
    plt.tight_layout(w_pad=2.2, h_pad=2.0)
    if operators is not None:
        fig.canvas.draw()
        for row_index, row_operators in enumerate(operators):
            for col_index, symbol in enumerate(row_operators):
                left_box = axes[row_index, col_index].get_position()
                right_box = axes[row_index, col_index+1].get_position()
                fig.text((left_box.x1+right_box.x0)/2,
                         (left_box.y0+left_box.y1)/2,
                         symbol, ha="center", va="center", fontsize=13)
    plt.show()

def average_pool(X):
    """Fire gjennomsnitt, ett fra hver 2 x 2-blokk."""
    # Del 4 x 4-bildet i 2 x 2 blokker og ta gjennomsnittet i hver blokk.
    X = np.asarray(X, dtype=float)
    return X.reshape(2, 2, 2, 2).mean(axis=(1, 3))

def pooling_matrix():
    """A slik at A @ X.reshape(-1) gir de fire gjennomsnittene."""
    # Designidé: én rad per outputverdi og én kolonne per inputpiksel.
    # Vekten 0.25 betyr at fire piksler skal summeres og deles på fire.
    A = np.zeros((4, 16))
    k = 0
    for br in range(2):
        for bc in range(2):
            for r in range(2):
                for c in range(2):
                    A[k, 4*(2*br+r) + 2*bc+c] = 0.25
            k += 1
    return A

A_pool = pooling_matrix()

def show_flattened(X):
    """Vis et 4 x 4-bilde og de samme 16 tallene lagt radvis i én vektor."""
    X = np.asarray(X, dtype=float)
    x = X.reshape(-1)
    plt.close("all")
    fig, axes = plt.subplots(1, 2, figsize=(7.0, 1.8),
                             gridspec_kw={"width_ratios": [1, 3.2]})
    axes[0].imshow(X, cmap="gray", vmin=0, vmax=1, interpolation="nearest")
    for r in range(4):
        for c in range(4):
            axes[0].text(c, r, f"$x_{{{4*r+c+1}}}$\n{X[r,c]:.1f}",
                         ha="center", va="center", fontsize=7,
                         color="white" if X[r, c] < 0.5 else "black")
    axes[0].set_title("$4\\times4$-bilde", fontsize=9)
    axes[0].set_xticks([]); axes[0].set_yticks([])
    axes[1].imshow(x.reshape(1, -1), cmap="gray", vmin=0, vmax=1,
                   interpolation="nearest", aspect="equal")
    for j, value in enumerate(x):
        axes[1].text(j, 0, f"$x_{{{j+1}}}$\n{value:.1f}",
                     ha="center", va="center", fontsize=6,
                     color="white" if value < 0.5 else "black")
    # Røde streker markerer hvor en bilderad slutter og den neste begynner.
    for boundary in [3.5, 7.5, 11.5]:
        axes[1].axvline(boundary, color="tab:red", linewidth=2)
    axes[1].set_title("Radene lagt etter hverandre: en 16-vektor", fontsize=9)
    axes[1].set_xticks([]); axes[1].set_yticks([])
    fig.text(0.315, 0.49, "→", ha="center", va="center", fontsize=16)
    plt.tight_layout(); plt.show()

def show_two_routes(alpha, beta, route_1, route_2):
    """Vis de to regnerekkefølgene i linearitetsforsøket som en bildetabell.
    route_1 = [alpha*X1, beta*X3, S, R1] og
    route_2 = [alpha*T(X1), beta*T(X3), R2, R1-R2]."""
    show_image_table(
        [route_1, route_2],
        ["Rute 1\nbland først", "Rute 2\ntransformer først"],
        ["Bidrag fra $X_1$", "Bidrag fra $X_3$", "Sum", "Resultat / kontroll"],
        cell_labels=[
            [f"${alpha:g}X_1$", f"${beta:g}X_3$", "$S$", "$R_1=T(S)$"],
            [f"${alpha:g}T(X_1)$", f"${beta:g}T(X_3)$", "$R_2$", "$R_1-R_2$"]
        ],
        # Forskjellen vises med rød–blå skala; hvitt betyr 0.
        cell_styles=[
            [{}, {}, {}, {}],
            [{}, {}, {}, {"cmap": "coolwarm", "vmin": -1e-12, "vmax": 1e-12}]
        ],
        operators=[["+", "=", "$T$ →"], ["+", "=", ""]],
        vmin=0, vmax=1, figsize=(10.0, 4.6)
    )
```

```{pyodide-python}
#| label: week3-same-output
#| autorun: true

# To bevisst svært forskjellige inputbilder: ett konstant og ett rutete.
# Eksperimentet spør om blokkgjennomsnittene likevel kan bli de samme.
X1 = np.full((4, 4), 0.5)
X2 = np.array([
    [0.1, 0.9, 0.1, 0.9],
    [0.9, 0.1, 0.9, 0.1],
    [0.1, 0.9, 0.1, 0.9],
    [0.9, 0.1, 0.9, 0.1]
])
Y1, Y2 = average_pool(X1), average_pool(X2)

# Hver rad følger ett bilde gjennom transformasjonen. Samme pikselstørrelse
# gjør at 2 x 2-outputen vises med halvparten av sidelengden til inputen.
show_image_table(
    [[X1, Y1], [X2, Y2]],
    ["$i=1$", "$i=2$"],
    ["Input $X_i$\n($4\\times4$)",
     "Output $Y_i=T(X_i)$\n($2\\times2$)"],
    vmin=0, vmax=1
)
```

Inputbildene i venstre kolonne er tydelig forskjellige, mens outputbildene i
høyre kolonne er like. For å undersøke dette uten å stole bare på øynene
beregner vi to forskjellsmatriser, piksel for piksel:

$$
D_{\text{input}}=X_1-X_2,
\qquad
D_{\text{output}}=Y_1-Y_2.
$$

Hvis to bilder er like, er forskjellen 0 på hver pikselplass. Da får vi
**nullbildet**, altså en matrise der alle pikselverdiene er 0.

::: {.reading-step title="Gå i dybden: forskjellsbildet piksel for piksel"}

Forskjellsmatrisene forteller både **hvor** bildene er forskjellige, og i
hvilken retning pikselverdiene har endret seg. Tabellen nedenfor skal leses
rad for rad og kolonne for kolonne:

- Øverste rad viser de beregnede forskjellene. Venstre kolonne sammenligner
  de to $4\times4$-inputene, mens høyre kolonne sammenligner de to
  $2\times2$-outputene.
- Nederste rad viser nullbilder med tilsvarende størrelse. De fungerer som
  visuelle referanser: En forskjell som ser ut som nullbildet under, har
  ingen utslag.
- Rødt betyr positiv forskjell, blått betyr negativ forskjell og hvitt betyr
  0. Størrelsen på hver rute følger antallet piksler, så et $2\times2$-bilde
  har halvparten av sidelengden til et $4\times4$-bilde.

Cellen regner ut de to forskjellene og tegner dem over hvert sitt nullbilde.

```{pyodide-python}
#| label: week3-difference-and-zero-images
#| autorun: true

# Beregn forskjellen mellom samsvarende pikselverdier før og etter
# transformasjonen. Hvis D_output er nullbildet, har transformasjonen
# mistet hele forskjellen mellom inputbildene.
D_input=X1-X2
D_output=Y1-Y2
zero_input=np.zeros_like(D_input)
zero_output=np.zeros_like(D_output)

show_image_table(
    [[D_input,D_output],[zero_input,zero_output]],
    ["Forskjell","Nullbilde"],
    ["Inputrom ($4\\times4$)","Outputrom ($2\\times2$)"],
    cmap="coolwarm",vmin=-0.4,vmax=0.4
)
```

I feltet øverst til venstre veksler verdiene mellom $+0.4$ og $-0.4$. De røde
rutene oppstår der $X_1$ har verdien $0.5$ og $X_2$ har $0.1$; de blå oppstår
der $X_1$ har $0.5$ og $X_2$ har $0.9$. Inputbildene er derfor forskjellige
på alle 16 pikselplasser. Feltet øverst til høyre er helt hvitt og ser ut som
nullbildet under: $Y_1-Y_2$ er 0 på alle fire plasser, så outputbildene er
like.

:::

### Ett tall for størrelsen på en forskjell

Vi vil ha ett tall som svarer på spørsmålet «hvor stor er forskjellen
totalt?». Vi kan ikke bare summere verdiene i forskjellsmatrisen. I
$D_{\text{input}}$ er åtte verdier $0.5-0.1=+0.4$ og åtte verdier
$0.5-0.9=-0.4$. De opphever hverandre og gir summen 0, selv om bildene er
forskjellige overalt.

Vi kvadrerer derfor alle verdiene i forskjellsbildet, summerer dem og tar kvadratroten. For et bilde $D$ blir dette

$$
\lVert D\rVert=\sqrt{\sum_{i,j}D_{ij}^2}.
$$

Kvadreringen gjør alle bidragene ikke-negative, slik at positive og negative
forskjeller ikke kan kansellere hverandre. Tallet $\lVert D\rVert$ kalles
**normen** til $D$: den numeriske avstanden fra $D$ til nullbildet. Normen er
0 nøyaktig når alle pikselforskjellene er 0. Det er en avstand mellom
pikselverdier, ikke nødvendigvis et mål på hvor forskjellige bildene oppleves
av et menneske.

For en vektor summerer vi kvadratene av komponentene på samme måte. Cellen regner ut normen av inputforskjellen, først rett fra formelen og så med `np.linalg.norm`, og deretter normen av outputforskjellen.

```{pyodide-python}
#| label: week3-first-norm
#| autorun: true

# Forskjellene fra formelen over, piksel for piksel.
D_input=X1-X2
D_output=Y1-Y2
# Neste linje er definisjonen på normen skrevet direkte i NumPy.
# Deretter bruker vi den ferdige norm-funksjonen som kontroll.
input_norm_by_formula=np.sqrt(np.sum(D_input**2))

print("Inputforskjell, regnet fra formelen:",input_norm_by_formula)
print("Inputforskjell med np.linalg.norm:   ",np.linalg.norm(D_input))
print("Outputforskjell med np.linalg.norm:  ",np.linalg.norm(D_output))
```

De 16 inputforskjellene har alle absoluttverdi $0.4$, så normen er
$\sqrt{16\cdot0.4^2}=1.6$. De to første utskriftene viser $1.6$; den ene kan
få en avrundingsrest langt ute i desimalene, for eksempel
`1.6000000000000005`. Outputforskjellen har norm 0. Senere gir avrundingsfeil
ofte svært små normer i stedet for nøyaktig 0; da leser vi resultatet som
«numerisk nær null».

::: {.callout-important}
### Første observasjon

Bildene er forskjellige, men transformasjonen gir samme output. Den bevarer gjennomsnittet i hver blokk, men ikke hvordan pikselverdiene er fordelt inne i blokken.
:::

Transformasjonen arbeider blokk for blokk. I øvre venstre blokk i `X2` er pikselverdiene $0.1,0.9,0.9,0.1$. Summen er 2, og gjennomsnittet er derfor $2/4=0.5$. Det samme skjer i de tre andre blokkene. I `X1` er hver piksel allerede $0.5$, så også der blir alle fire blokkgjennomsnittene $0.5$.

::: {.reading-step title="Gå i dybden: de fire blokkene i sjakkbildet"}

Cellen klipper de fire $2\times2$-blokkene ut av `X2` og skriver blokkgjennomsnittet over hver av dem.

```{pyodide-python}
#| label: week3-four-blocks
#| autorun: true

# Løkkene skjærer ut de fire 2 x 2-blokkene. Uttrykket a:b betyr
# «ta med indeks a, men stopp før b».
blocks=[]
for block_row in range(2):
    for block_col in range(2):
        block=X2[2*block_row:2*block_row+2,
                 2*block_col:2*block_col+2]
        blocks.append(block)

block_names=["Øvre venstre","Øvre høyre","Nedre venstre","Nedre høyre"]
show_images(blocks,
    [f"{name}\nGjennomsnitt = {np.mean(block):.1f}"
     for name,block in zip(block_names,blocks)],
    cols=4,vmin=0,vmax=1,figsize=(6.8,1.8))
```

Figuren viser de fire delene som ble klippet ut av `X2`, i samme leseretning som outputbildet: først øvre rad fra venstre mot høyre, deretter nedre rad. Ordet «gjennomsnitt» over hvert delbilde er tallet som plasseres i den tilsvarende outputpikselen. Alle fire tallene er $0.5$, og outputen blir derfor et ensfarget $2\times2$-bilde.

:::

Dette er ikke en avrundingsfeil: Gjennomsnittene er matematisk like. Transformasjonen er **mange-til-én**: flere forskjellige inputbilder kan havne på samme output, så fra outputen alene kan vi ikke avgjøre hvilket bilde som var input.

Resten av uka undersøker vi to egenskaper ved transformasjoner:

1. **Hva skjer når inputbilder skaleres og legges sammen?** Dette leder til lineære transformasjoner.
2. **Hvilke endringer i inputen blir usynlige i outputen?** Dette leder til nullrom, rang og dimensjon.

Før vi gir dette et matematisk navn, kan du prøve å endre `X2` uten å endre gjennomsnittet i noen blokk. Hvilke endringer ser ut til å være tillatt?

## 3.2 Fra bilde til vektor og matrise {#uke3-del1}

Pikselverdiene i et bilde kan også legges etter hverandre i en liste. NumPy-funksjonen `reshape(-1)` leser øverste rad fra venstre mot høyre, deretter neste rad, og så videre. Cellen gjør dette med sjakkbildet `X2` og tegner bildet og vektoren ved siden av hverandre.

```{pyodide-python}
#| label: week3-flatten-picture
#| autorun: true

# reshape(-1) leser radene etter hverandre: 16 tall, ingen endret eller borte.
x2=X2.reshape(-1)
print(x2)
show_flattened(X2)
```

Figuren viser de samme 16 tallene to ganger; de røde strekene markerer hvor en bilderad slutter. Ingen informasjon er borte. Vi har bare valgt en nummerering som gjør at vanlig matrise-vektor-multiplikasjon kan brukes.

Et $4\times4$-bilde beskrives dermed med 16 koordinater og kan behandles som en vektor $x\in\mathbb R^{16}$. Bildetransformasjonen fra 3.1 kan nå skrives

$$y=Ax,$$

der $A$ har fire rader og seksten kolonner. Hver rad i $A$ lager én av de fire outputverdiene. Hver kolonne svarer til én av de 16 inputpikslene og samler virkningen den pikselen har på alle fire målingene.

### Slik konstruerer vi matrisen fra en regel

Matrisen skal ikke gjettes. Vi bygger den direkte fra transformasjonen:

1. Nummerer inputverdiene i samme rekkefølge som i vektoren $x$.
2. Skriv én formel for hver outputverdi.
3. Koeffisientene i outputformel nummer $i$ blir rad nummer $i$ i $A$.

For øvre venstre blokk er

$$y_1=\frac14x_1+\frac14x_2+\frac14x_5+\frac14x_6.$$

Derfor er første rad i $A$

$$\begin{bmatrix}
\frac14&\frac14&0&0&\frac14&\frac14&0&0&0&0&0&0&0&0&0&0
\end{bmatrix}.$$

Andre rad bygges fra øvre høyre blokk, tredje rad fra nedre venstre og
fjerde rad fra nedre høyre. En rad i $A$ er altså alltid **én måling**, og
slik bygger vi matrisen for enhver lineær transformasjon som er gitt ved
formler eller målinger.

Det er nyttig å holde de to sidene fra hverandre:

$$
\underbrace{\mathbb R^{16}}_{\text{inputrom: store bilder}}
\xrightarrow{\quad A\quad}
\underbrace{\mathbb R^4}_{\text{outputrom: små bilder}}.
$$

På venstre side av pilen står inputen $x$ med 16 pikselverdier, på høyre side
outputen $y$ med fire blokkgjennomsnitt. Inputrommet kalles også
**definisjonsrommet**, og outputrommet, der alle outputene ligger, kalles også
**verdirommet**.

Den ferdige matrisen `A_pool` er bygd nøyaktig slik, rad for rad. Cellen
gjør de to bildene fra 3.1 om til vektorer og regner ut $Ax$ for hvert av dem.

```{pyodide-python}
#| label: week3-pooling-as-matrix
#| autorun: true

# Samme bilder skrives som vektorer, slik at vi kan bruke vanlig Ax.
x1, x2 = X1.reshape(-1), X2.reshape(-1)
# @ er matrise-vektorproduktet. Resultatet har fire komponenter fordi
# A_pool har fire rader.
y1, y2 = A_pool @ x1, A_pool @ x2
print("Bildeform:", X1.shape, "  vektorform:", x1.shape)
print("A har form", A_pool.shape)
print("A @ x1 =", y1)
print("A @ x2 =", y2)
```

Neste figur viser produktet: en $4\times16$-matrise ganger en 16-vektor gir en 4-vektor. Samme farge brukes på et bildeområde, inputverdiene, matrisraden og outputverdien.

```{.jsxgraph width="760" height="390"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [0, 8.4, 20.5, 0],
  axis: false,
  showCopyright: false,
  showNavigation: false,
  pan: { enabled: false },
  zoom: { enabled: false }
});

var rowColors = ['#8ecae6','#ffcf70','#a8d5a2','#d7b5e8'];
var rowDark = ['#277da1','#d98900','#4f8f49','#8b5aa7'];
var rowNames = ['øvre venstre','øvre høyre','nedre venstre','nedre høyre'];
var active = [
  [0,1,4,5], [2,3,6,7], [8,9,12,13], [10,11,14,15]
];
var values = [0.1,0.9,0.1,0.9, 0.9,0.1,0.9,0.1,
              0.1,0.9,0.1,0.9, 0.9,0.1,0.9,0.1];
var xStart=1.9, cellW=0.56, rowH=0.76, matrixTop=6.25;

function cell(x0,y0,w,h,fill,border,width) {
  return board.create('polygon', [[x0,y0],[x0+w,y0],[x0+w,y0+h],[x0,y0+h]], {
    fillColor:fill, fillOpacity:1,
    vertices:{visible:false},
    borders:{strokeColor:border,strokeWidth:width || 1,
             fixed:true,highlight:false},
    fixed:true,highlight:false
  });
}

board.create('text', [xStart+8*cellW,matrixTop+0.65,'MATRISE  A'], {
  anchorX:'middle',fontSize:16,cssStyle:'font-weight:600',fixed:true
});

// Alle 64 oppføringer tegnes som egne ruter.
for (var r=0; r<4; r++) {
  var y0=matrixTop-(r+1)*rowH;
  board.create('text',[1.75,y0+rowH/2,rowNames[r]],{
    anchorX:'right',anchorY:'middle',fontSize:11,
    color:rowDark[r],cssStyle:'font-weight:600',fixed:true
  });
  for (var c=0; c<16; c++) {
    var isActive=active[r].indexOf(c)>=0;
    cell(xStart+c*cellW,y0,cellW,rowH,
         isActive ? rowColors[r] : '#ffffff','#555555',1);
    board.create('text',[xStart+(c+0.5)*cellW,y0+rowH/2,
                         isActive ? '¼' : '0'],{
      anchorX:'middle',anchorY:'middle',fontSize:isActive ? 12 : 9,
      color:isActive ? '#1f2933' : '#a7a7a7',fixed:true
    });
  }
}

// Inputen vises som en vanlig kolonnevektor.
var vectorX=12.15, vectorTop=7.35, vectorH=0.37, vectorW=0.72;
board.create('text',[vectorX+vectorW/2,vectorTop+0.55,'x'],{
  anchorX:'middle',fontSize:17,cssStyle:'font-weight:600',fixed:true
});
for (var k=0; k<16; k++) {
  var group = k<8 ? (k%4<2 ? 0 : 1) : (k%4<2 ? 2 : 3);
  var vy=vectorTop-(k+1)*vectorH;
  cell(vectorX,vy,vectorW,vectorH,rowColors[group],'#555555',1);
  board.create('text',[vectorX+vectorW/2,vy+vectorH/2,
                       values[k].toFixed(1)],{
    anchorX:'middle',anchorY:'middle',fontSize:8.5,fixed:true
  });
  board.create('text',[vectorX+vectorW+0.12,vy+vectorH/2,'x'+(k+1)],{
    anchorX:'left',anchorY:'middle',fontSize:7,color:'#666666',fixed:true
  });
}
board.create('text',[11.45,4.65,'×'],{
  anchorX:'middle',anchorY:'middle',fontSize:24,fixed:true
});

// Produktet er først en vanlig kolonnevektor.
var yX=14.65, yTop=5.95, yW=0.78, yH=0.76;
board.create('text',[yX+yW/2,yTop+0.55,'y = Ax'],{
  anchorX:'middle',fontSize:16,cssStyle:'font-weight:600',fixed:true
});
for (var q=0; q<4; q++) {
  var yy=yTop-(q+1)*yH;
  cell(yX,yy,yW,yH,rowColors[q],'#333333',1.5);
  board.create('text',[yX+yW/2,yy+yH/2,'0.5'],{
    anchorX:'middle',anchorY:'middle',fontSize:13,fixed:true
  });
}
board.create('text',[13.75,4.45,'='],{
  anchorX:'middle',anchorY:'middle',fontSize:24,fixed:true
});

// De fire outputverdiene kan ordnes som et lite bilde.
var imageX=17.15, imageTop=5.75, imageW=0.92;
board.create('arrow',[[15.75,4.45],[16.75,4.45]],{
  strokeColor:'#555555',strokeWidth:2,fixed:true,highlight:false
});
board.create('text',[18.07,imageTop+0.55,'vist som bilde'],{
  anchorX:'middle',fontSize:14,cssStyle:'font-weight:600',fixed:true
});
for (var p=0; p<4; p++) {
  var pc=p%2, pr=Math.floor(p/2);
  var px=imageX+pc*imageW, py=imageTop-(pr+1)*imageW;
  cell(px,py,imageW,imageW,rowColors[p],'#333333',1.5);
  board.create('text',[px+imageW/2,py+imageW/2,'0.5'],{
    anchorX:'middle',anchorY:'middle',fontSize:12,fixed:true
  });
}
```

Les én farge om gangen. Den blå matrisraden har fire ruter med $1/4$ der de fire blå inputverdiene står, og nuller ellers. Rad ganger vektor gir derfor $1/4$ av summen av de fire blå verdiene: den blå outputverdien.

De andre fargene gjør det samme for sine områder: **én matrisrad gir én verdi i outputvektoren**. Med sjakkbildet blir alle fire gjennomsnittene $0.5$.

### Skalering og addisjon

Tenk deg at et grafikkprogram bygger et stort bilde av flere lag, for
eksempel en jevn bakgrunn og en tekstur. Koeffisienten foran hvert lag
bestemmer hvor sterkt laget skal bidra, og lagene legges sammen piksel for
piksel. Nå skal programmet også lage et lite forhåndsvisningsbilde. Da finnes
det to naturlige arbeidsmåter:

1. Sett sammen lagene i full størrelse, og bruk deretter transformasjonen $T$
   til å lage det lille bildet.
2. Bruk $T$ på hvert lag først, og sett deretter sammen de små resultatene.

Her er $T$ blokkgjennomsnittet, altså $y=Ax$. Det er ikke opplagt at de to
arbeidsmåtene gir samme svar. Hvis de gjør det, kan hvert lag behandles for
seg uten at sluttresultatet endres.

Vi bruker det jevne bildet $X_1$ som bakgrunnslag og et tilfeldig bilde $X_3$
som teksturlag. Med bidragene $0.6X_1$ og $0.4X_3$ gir de to rutene

$$
R_1=T(0.6X_1+0.4X_3)
\qquad\text{og}\qquad
R_2=0.6\,T(X_1)+0.4\,T(X_3).
$$

Cellen lager $X_3$, regner ut begge rutene og tegner dem i hver sin rad.
Målet er å se om forskjellen $R_1-R_2$ blir nullbildet.

### Eksperiment – bland først eller transformer først?

- Kjør cellen og sammenlign $R_1$ og $R_2$.
- Bytt `alpha`, `beta` eller frøet i `default_rng(3)`, og kjør igjen.

```{pyodide-python}
#| label: week3-check-linearity

# Fast frø gir samme testbilde ved hver kjøring.
rng=np.random.default_rng(3)
X3=rng.random((4,4))
alpha,beta=0.6,0.4
scaled_X1=alpha*X1
scaled_X3=beta*X3
S=scaled_X1+scaled_X3           # det sammensatte 4 x 4-bildet

# Rute 1: bland de store bildene først, transformer etterpå.
R1=average_pool(S)
# Rute 2: transformer først, bland de små outputbildene etterpå.
scaled_Y1=alpha*average_pool(X1)
scaled_Y3=beta*average_pool(X3)
R2=scaled_Y1+scaled_Y3
difference=R1-R2

show_two_routes(alpha,beta,[scaled_X1,scaled_X3,S,R1],
                [scaled_Y1,scaled_Y3,R2,difference])
print("Normen til R1-R2:",np.linalg.norm(difference))
```

**Hva viser forsøket?** De to rutene gir samme småbilde: Forskjellen $R_1-R_2$
er hvit (hvitt betyr 0) og har norm 0. Ett forsøk er likevel ikke et bevis, så vi ser på selve
regelen.

::: {.reading-step title="Gå i dybden: slik leser du tabellen"}

Les tabellen fra venstre mot høyre. I øverste rad har de tre første bildene
størrelse $4\times4$: De to skalerte lagene legges sammen til
$S=0.6X_1+0.4X_3$, som så transformeres til det mindre resultatet $R_1$. I
nederste rad er transformasjonen allerede brukt på hvert lag. Derfor er alle
bildene $2\times2$, og de to første legges sammen til $R_2$. Feltet nederst
til høyre viser $R_1-R_2$ med samme rød–blå skala som i 3.1. Det er hvitt
fordi alle fire forskjellene er 0.

:::

Hver outputpiksel er summen av fire inputverdier, alle ganget med $1/4$. For
øvre venstre outputpiksel og to inputvektorer $x$ og $z$ er

$$
\begin{aligned}
&\tfrac14\big((\alpha x_1+\beta z_1)+(\alpha x_2+\beta z_2)+(\alpha x_5+\beta z_5)+(\alpha x_6+\beta z_6)\big)\\
&\qquad=\alpha\cdot\tfrac14(x_1+x_2+x_5+x_6)+\beta\cdot\tfrac14(z_1+z_2+z_5+z_6).
\end{aligned}
$$

Vi har bare sortert leddene: Både skaleringen og addisjonen kan flyttes inn
eller ut av summen. Det samme gjelder de tre andre outputpikslene. Det gir den
sentrale regneregelen for en **lineær transformasjon**:

$$A(\alpha x+\beta z)=\alpha Ax+\beta Az.$$

Her er $x$ og $z$ vilkårlige inputvektorer og $\alpha,\beta$ vilkårlige tall: Både skalering og addisjon kan flyttes gjennom transformasjonen.

Et uttrykk som $c_1b_1+\cdots+c_kb_k$ kalles en **lineærkombinasjon** av
$b_1,\ldots,b_k$: Vi skalerer hver byggestein og legger sammen. Linearitet er
sentralt fordi vi kan forstå en komplisert input ved å dele den i enkle
byggesteiner. Hvis $x=c_1b_1+\cdots+c_kb_k$, trenger vi ikke analysere hele
$x$ på nytt:

$$Ax=c_1Ab_1+\cdots+c_kAb_k.$$

Vi kan altså finne hva transformasjonen gjør med hver byggestein én gang og deretter kombinere resultatene. Basis, nullrom og kolonnerom bygger alle på denne ideen. Ikke alle transformasjoner er lineære: å klippe alle negative pikselverdier til null eller å sortere pikslene vil for eksempel vanligvis bryte regneregelen.

## 3.3 Beskriv bilder med forskjellige basiser {#uke3-del2}

Vi skal nå finne et systematisk språk for «byggesteiner». Tenk på et tomt $2\times2$-bilde og fire skyveknapper, én for hver piksel.

Dra i skyveknappene. Hver knapp skalerer ett lite byggesteinsbilde, og de fire delbildene legges sammen til bildet til høyre. Prøv å lage et helt svart bilde, et ensfarget grått bilde og et bilde med fire forskjellige gråtoner.

```{.jsxgraph width="760" height="430"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [0, 8.6, 15.2, 0],
  axis: false,
  showCopyright: false,
  showNavigation: false,
  pan: { enabled: false },
  zoom: { enabled: false }
});

var basisColors=['#277da1','#d98900','#4f8f49','#8b5aa7'];
var initial=[0.2,0.7,0.4,0.9];
var sliders=[];

board.create('text',[0.75,8.25,'Fire uavhengige kontroller'],{
  fontSize:16,cssStyle:'font-weight:600',fixed:true
});

for (var i=0; i<4; i++) {
  var sy=7.55-0.72*i;
  board.create('text',[0.75,sy,'Piksel '+(i+1)],{
    anchorY:'middle',fontSize:12,color:basisColors[i],
    cssStyle:'font-weight:600',fixed:true
  });
  sliders.push(board.create('slider',[[2.05,sy],[5.25,sy],[0,initial[i],1]],{
    name:'',snapWidth:0.05,precision:2,
    strokeColor:basisColors[i],fillColor:basisColors[i],
    highline:{strokeColor:basisColors[i]},
    baseline:{strokeColor:'#b8b8b8'},
    point1:{visible:false},point2:{visible:false}
  }));
}

function gray(value) {
  // Samme gråskalakonvensjon som matplotlib: 0 er svart, 1 er hvitt.
  var clipped=Math.max(0,Math.min(1,value));
  var level=Math.round(255*clipped);
  return 'rgb('+level+','+level+','+level+')';
}

function basisSquare(x0,y0,size,valueFunction,borderColor) {
  return board.create('polygon',
    [[x0,y0],[x0+size,y0],[x0+size,y0+size],[x0,y0+size]],{
      fillColor:function(){return gray(valueFunction());},fillOpacity:1,
      vertices:{visible:false},
      borders:{strokeColor:borderColor,strokeWidth:1.4,
               fixed:true,highlight:false},
      fixed:true,highlight:false
    });
}

function drawComponent(originX,originY,component) {
  var size=0.68;
  for (var p=0; p<4; p++) {
    var col=p%2, row=Math.floor(p/2);
    (function(pixel,index,x,y){
      basisSquare(x,y,size,function(){
        return pixel===index ? sliders[index].Value() : 0;
      },basisColors[index]);
    })(p,component,originX+col*size,originY+(1-row)*size);
  }
}

var componentX=[0.75,3.25,5.75,8.25];
var imageY=1.55;
for (var j=0; j<4; j++) {
  drawComponent(componentX[j],imageY,j);
  (function(index){
    board.create('text',[componentX[index]+0.68,imageY+1.75,function(){
      return sliders[index].Value().toFixed(2)+' · E'+(index+1);
    }],{
      anchorX:'middle',fontSize:12,color:basisColors[index],
      cssStyle:'font-weight:600',fixed:true
    });
  })(j);
  if (j<3) {
    board.create('text',[componentX[j]+1.82,imageY+0.68,'+'],{
      anchorX:'middle',anchorY:'middle',fontSize:22,fixed:true
    });
  }
}

board.create('arrow',[[10.05,imageY+0.68],[11.15,imageY+0.68]],{
  strokeColor:'#444444',strokeWidth:2.2,fixed:true,highlight:false
});

// I summen styres hver piksel av sin egen skyveknapp.
var sumX=11.55, size=0.92;
for (var q=0; q<4; q++) {
  var qc=q%2, qr=Math.floor(q/2);
  (function(pixel,x,y){
    basisSquare(x,y,size,function(){return sliders[pixel].Value();},'#333333');
  })(q,sumX+qc*size,imageY+(1-qr)*size);
}
board.create('text',[sumX+size,imageY+2.25,'SUMMEN'],{
  anchorX:'middle',fontSize:15,cssStyle:'font-weight:600',fixed:true
});
board.create('text',[sumX+size,imageY-0.38,
  'Fire tall kan velges uavhengig'],{
  anchorX:'middle',fontSize:12,fixed:true
});

// Gjennomsnittet av de fire pikselverdiene vises som en 1 x 1-output.
function averageValue() {
  return (sliders[0].Value()+sliders[1].Value()+
          sliders[2].Value()+sliders[3].Value())/4;
}
board.create('arrow',[[13.55,imageY+0.92],[14.05,imageY+0.92]],{
  strokeColor:'#444444',strokeWidth:2,fixed:true,highlight:false
});
basisSquare(14.15,imageY+0.52,0.80,averageValue,'#333333');
board.create('text',[14.55,imageY+1.75,'GJENNOMSNITT'],{
  anchorX:'middle',fontSize:11,cssStyle:'font-weight:600',fixed:true
});
board.create('text',[14.55,imageY+0.92,function(){
  return averageValue().toFixed(2);
}],{
  anchorX:'middle',anchorY:'middle',fontSize:10,fixed:true
});
board.create('text',[14.55,imageY-0.38,'1×1-output'],{
  anchorX:'middle',fontSize:10,fixed:true
});
```

Appleten antyder to viktige egenskaper før vi bruker matematisk terminologi. Alle $2\times2$-bilder med pikselverdier mellom 0 og 1 kan lages ved å stille inn de fire kontrollene. Samtidig har hvert ferdig bilde bare én innstilling av kontrollene: Pikselverdiene bestemmer skyveknappene.

Ruten lengst til høyre viser blokkgjennomsnittet (0 er svart, 1 er hvitt). Når én piksel endres med $\Delta$, endres gjennomsnittet med $\Delta/4$. Denne regelen blir den lille transformasjonen i 3.4.

Byggesteinsbildet $E_k$ har verdien 1 i piksel $k$ og 0 i de tre andre
pikslene. Startinnstillingen i appleten lager derfor bildet

$$X=\begin{bmatrix}0.2&0.7\\0.4&0.9\end{bmatrix}=0.2E_1+0.7E_2+0.4E_3+0.9E_4.$$

For eksempel bidrar $0.7E_2$ bare med $0.7$ i øvre høyre piksel, så hver piksel kan stilles inn uavhengig.

::: {.reading-step title="Gå i dybden: pikselbasisen i NumPy"}

Her gjentar vi appleten i NumPy. De fire første bildene har verdi 1 i hver sin piksel og 0 i de andre. Deretter blir hvert bilde ganget med ønsket pikselverdi, og de fire delbildene legges sammen.

```{pyodide-python}
#| label: week3-pixel-basis
#| autorun: true

# Hvert E-bilde har én eneste ener. Derfor styrer hver koeffisient nøyaktig
# én piksel når de skalerte byggesteinene summeres.
E1=np.array([[1.,0.],[0.,0.]])
E2=np.array([[0.,1.],[0.,0.]])
E3=np.array([[0.,0.],[1.,0.]])
E4=np.array([[0.,0.],[0.,1.]])
pixel_basis=[E1,E2,E3,E4]
coefficients=np.array([0.2,0.7,0.4,0.9])
components=[c*E for c,E in zip(coefficients,pixel_basis)]
X=sum(components)

show_images(pixel_basis,["$E_1$","$E_2$","$E_3$","$E_4$"],
            cols=4,vmin=0,vmax=1,figsize=(6.8,1.8))
show_images(components+[X],
    ["$0.2E_1$","$0.7E_2$","$0.4E_3$","$0.9E_4$","Summen"],
    cols=5,vmin=0,vmax=1,figsize=(7.0,1.7))
```

:::

De fire tallene foran byggesteinene kalles **koordinater i denne beskrivelsen**. Her er de nøyaktig de fire pikselverdiene i $X$.

Er fire knapper akkurat riktig antall? Vi prøver to endringer: Først fjerner
vi $E_4$, så legger vi til $E_5=E_1+E_2$, som er bygd av to andre. Cellen gjør
begge forsøkene, ett i hver rad. Målet er å se hva som skjer med egenskapene
«alle bilder kan lages» og «oppskriften er entydig».

### Eksperiment – for få eller for mange byggesteiner?

- Kjør cellen og se hva som mangler når $E_4$ er borte (øverste rad).
- Sammenlign de to oppskriftene med $E_5=E_1+E_2$ (nederste rad).
- Bytt $E_5$ med for eksempel $E_3+E_4$, og endre `recipe_1` slik at den lager
  det samme bildet med bare $E_1,\ldots,E_4$.

```{pyodide-python}
#| label: week3-missing-and-redundant
#| autorun: true

# E1, ..., E4, målbildet X og coefficients kommer fra «Gå i dybden: pikselbasisen i NumPy».
# Forsøk 1: Vi fjerner E4 med vilje og ser hva som mangler i målbildet X.
X_without_E4=coefficients[0]*E1+coefficients[1]*E2+coefficients[2]*E3
# Forsøk 2: E5 er bygd av to gamle byggesteiner. To ulike oppskrifter.
E5=E1+E2
recipe_1=1*E1+1*E2+0*E5
recipe_2=0*E1+0*E2+1*E5
show_images([X,X_without_E4,X-X_without_E4,E4,
             E5,recipe_1,recipe_2,recipe_1-recipe_2],
    ["Målbildet","Uten $E_4$","Det som mangler","$E_4$",
     "$E_5=E_1+E_2$","Oppskrift 1","Oppskrift 2","Forskjell"],
    cols=4,vmin=0,vmax=1,figsize=(6.8,3.6))
```

**Hva viser forsøket?** Uten $E_4$ er nedre høyre piksel null i enhver
lineærkombinasjon, så ikke alle bilder kan lages. Med $E_5$ i tillegg gir to
forskjellige oppskrifter samme bilde, så oppskriften er ikke entydig. Det
hjelper ikke å bytte ut $E_5$: De fire pikselbildene lager allerede alle
$2\times2$-bilder, så enhver femte byggestein kan bygges av dem, og da finnes
det alltid to oppskrifter. En basis har akkurat nok byggesteiner: ingen hull og ingen
overflødige byggesteiner.

::: {.callout-tip}
### Fra eksperiment til begreper

- Byggesteinene **spenner ut** en samling bilder når alle bilder i samlingen kan bygges som lineærkombinasjoner av dem.
- Byggesteinene er **lineært uavhengige** når ingen av dem kan bygges av de andre. Da har hvert bilde høyst én oppskrift.
- En **basis** er et sett byggesteiner som både spenner ut hele samlingen og er lineært uavhengig: nok byggesteiner, men ingen overflødige.
:::

Når vi trekker fra bilder eller skalerer mønstre, kan pikselverdiene bli
negative eller større enn 1. Derfor regner vi i samlingen

$$\mathbb R^{2\times2},$$

som betyr «fire reelle tall ordnet som to rader og to kolonner». Den er et
**vektorrom**: Objektene kan legges sammen og ganges med tall, og disse
operasjonene følger de vanlige regnereglene. Et vektorrom trenger altså ikke
å bestå av piler eller tallkolonner.

::: {.reading-step title="Gå i dybden: gyldige gråtonebilder og hele vektorrommet"}

Et vanlig gråtonebilde har pikselverdier mellom 0 og 1: 0 er svart og 1 er hvitt. Slike $2\times2$-bilder ligger i $[0,1]^{2\times2}$. Elementene i $\mathbb R^{2\times2}$ kan regnes med som bilder, forskjellsbilder eller mønstre, selv om ikke alle kan vises direkte som vanlige gråtonebilder. Det er $\mathbb R^{2\times2}$ som er et vektorrom; $[0,1]^{2\times2}$ er bare delen som består av gyldige gråtonebilder. For eksempel ligger $E_1$ i $[0,1]^{2\times2}$, men $-E_1$ gjør det ikke.

:::

$E_1,E_2,E_3,E_4$ danner en basis for $\mathbb R^{2\times2}$. **Dimensjonen** er antallet byggesteiner i en basis, altså

$$\dim(\mathbb R^{2\times2})=4.$$

Dimensjon teller hvor mange uavhengige tall som trengs for å beskrive et bilde; det har ingenting med at bildet ser todimensjonalt ut å gjøre. Et $4\times4$-bilde ligger i et rom med dimensjon 16.

### Bytt fra pikselbasis til mønsterbasis

Pikselkoordinatene sier bare hvor lyse de fire pikslene er. Vi prøver nå fire andre byggesteiner. I figurene betyr rødt positive verdier, blått negative verdier og hvitt null. Negative tall betyr at et mønster trekkes fra.

Appleten er bygd som pikselappleten, men skyveknappene styrer nå fire mønstre og går fra $-1$ til $1$. En negativ koeffisient legger til mønsteret med motsatt fortegn. Tallet i hver piksel viser det faktiske bidraget.

```{.jsxgraph width="760" height="430"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [0, 8.6, 15.2, 0],
  axis: false,
  showCopyright: false,
  showNavigation: false,
  pan: { enabled: false },
  zoom: { enabled: false }
});

var patternNames=['Lysnivå','Venstre–høyre','Topp–bunn','Sjakkmønster'];
var patternColors=['#555555','#277da1','#4f8f49','#8b5aa7'];
var patternValues=[
  [ 1, 1, 1, 1],
  [ 1,-1, 1,-1],
  [ 1, 1,-1,-1],
  [ 1,-1,-1, 1]
];
var patternInitial=[0.55,-0.25,-0.10,0.00];
var patternSliders=[];

board.create('text',[0.75,8.25,'Fire mønsterkontroller'],{
  fontSize:16,cssStyle:'font-weight:600',fixed:true
});

for (var i=0; i<4; i++) {
  var sy=7.55-0.72*i;
  board.create('text',[0.75,sy,patternNames[i]],{
    anchorY:'middle',fontSize:11,color:patternColors[i],
    cssStyle:'font-weight:600',fixed:true
  });
  patternSliders.push(board.create('slider',
    [[2.25,sy],[5.35,sy],[-1,patternInitial[i],1]],{
      name:'',snapWidth:0.05,precision:2,
      strokeColor:patternColors[i],fillColor:patternColors[i],
      highline:{strokeColor:patternColors[i]},
      baseline:{strokeColor:'#b8b8b8'},
      point1:{visible:false},point2:{visible:false}
    }));
}

function patternColor(value) {
  return value>=0 ? '#d6604d' : '#2166ac';
}
function patternOpacity(value) {
  return Math.min(0.88,0.88*Math.abs(value));
}
function patternSquare(x0,y0,size,valueFunction,borderColor) {
  var polygon=board.create('polygon',
    [[x0,y0],[x0+size,y0],[x0+size,y0+size],[x0,y0+size]],{
      fillColor:function(){return patternColor(valueFunction());},
      fillOpacity:function(){return patternOpacity(valueFunction());},
      vertices:{visible:false},
      borders:{strokeColor:borderColor,strokeWidth:1.4,
               fixed:true,highlight:false},
      fixed:true,highlight:false
    });
  board.create('text',[x0+size/2,y0+size/2,function(){
    return valueFunction().toFixed(2);
  }],{
    anchorX:'middle',anchorY:'middle',fontSize:9,fixed:true
  });
  return polygon;
}

function componentValue(component,pixel) {
  return function(){
    return patternSliders[component].Value()*patternValues[component][pixel];
  };
}
function sumValue(pixel) {
  return function(){
    var total=0;
    for (var m=0; m<4; m++) {
      total+=patternSliders[m].Value()*patternValues[m][pixel];
    }
    return total;
  };
}

var componentX=[0.75,3.25,5.75,8.25];
var imageY=1.55, smallSize=0.68;
for (var j=0; j<4; j++) {
  for (var p=0; p<4; p++) {
    var pc=p%2, pr=Math.floor(p/2);
    patternSquare(componentX[j]+pc*smallSize,
                  imageY+(1-pr)*smallSize,smallSize,
                  componentValue(j,p),patternColors[j]);
  }
  (function(index){
    board.create('text',[componentX[index]+smallSize,imageY+1.78,function(){
      return patternSliders[index].Value().toFixed(2)+' · '+patternNames[index];
    }],{
      anchorX:'middle',fontSize:10,color:patternColors[index],
      cssStyle:'font-weight:600',fixed:true
    });
  })(j);
  if (j<3) {
    board.create('text',[componentX[j]+1.82,imageY+0.68,'+'],{
      anchorX:'middle',anchorY:'middle',fontSize:22,fixed:true
    });
  }
}

board.create('arrow',[[10.05,imageY+0.68],[11.15,imageY+0.68]],{
  strokeColor:'#444444',strokeWidth:2.2,fixed:true,highlight:false
});

var sumX=11.55, sumSize=0.92;
for (var q=0; q<4; q++) {
  var qc=q%2, qr=Math.floor(q/2);
  patternSquare(sumX+qc*sumSize,imageY+(1-qr)*sumSize,
                sumSize,sumValue(q),'#333333');
}
board.create('text',[sumX+sumSize,imageY+2.25,'SAMME TYPE BILDE'],{
  anchorX:'middle',fontSize:14,cssStyle:'font-weight:600',fixed:true
});
board.create('text',[sumX+sumSize,imageY-0.38,
  'Nye kontroller · ny beskrivelse'],{
  anchorX:'middle',fontSize:12,fixed:true
});

// Gjennomsnittet tas av de fire pikselverdiene i det ferdige sum-bildet.
function patternAverage() {
  return (sumValue(0)()+sumValue(1)()+sumValue(2)()+sumValue(3)())/4;
}
board.create('arrow',[[13.55,imageY+0.92],[14.05,imageY+0.92]],{
  strokeColor:'#444444',strokeWidth:2,fixed:true,highlight:false
});
patternSquare(14.15,imageY+0.52,0.80,patternAverage,'#333333');
board.create('text',[14.55,imageY+1.75,'GJENNOMSNITT'],{
  anchorX:'middle',fontSize:11,cssStyle:'font-weight:600',fixed:true
});
board.create('text',[14.55,imageY-0.38,'1×1-output'],{
  anchorX:'middle',fontSize:10,fixed:true
});
```

Startinnstillingen lager samme bilde som før, men med andre tall: lysnivå $0.55$, venstre–høyre $-0.25$, topp–bunn $-0.10$ og sjakkmønster $0$. Legg merke til at kontrastkontrollene endrer bildet, men ikke blokkgjennomsnittet; det forklarer vi i 3.4. Lysnivåkontrollen endrer derimot alle fire pikselverdiene og gjennomsnittet like mye.

Cellen lager de samme fire mønstrene i NumPy. Vi bruker dem resten av uka, og
pikslene står i samme rekkefølge som før: øvre rad fra venstre mot høyre,
deretter nedre rad.

```{pyodide-python}
#| label: week3-pattern-basis
#| autorun: true

# De fire arrayene er ikke tilfeldige: M styrer felles lysnivå, mens H, V
# og D har sum null og beskriver tre forskjellige kontraster.
M=np.array([[ 1., 1.],[ 1., 1.]])
H=np.array([[ 1.,-1.],[ 1.,-1.]])
V=np.array([[ 1., 1.],[-1.,-1.]])
D=np.array([[ 1.,-1.],[-1., 1.]])
pattern_basis=[M,H,V,D]
pattern_names=["Lysnivå","Venstre–høyre","Topp–bunn","Sjakkmønster"]

show_images(pattern_basis,pattern_names,cols=4,
            cmap="coolwarm",vmin=-1,vmax=1)
```

`Lysnivå` har samme fortegn overalt og gjør hele bildet lysere eller mørkere. `Venstre–høyre` øker venstre kolonne samtidig som høyre kolonne minker. `Topp–bunn` sammenligner øvre og nedre rad. `Sjakkmønster` skiller de to diagonalene. De tre siste har to $+1$ og to $-1$, så summen deres er null.

Er de fire mønstrene en basis? Vi må svare på de samme to spørsmålene som for pikselbasisen: Kan de bygge alle målbilder, og er oppskriften entydig?

### Fra en oppskrift til likningen $Pc=t$

Først tar vi en mindre versjon med bare to byggesteiner. La

$$b_1=\begin{bmatrix}1\\1\end{bmatrix},\qquad
b_2=\begin{bmatrix}1\\-1\end{bmatrix}.$$

Hvis styrkene er $c_1$ og $c_2$, blir den ferdige vektoren

$$c_1b_1+c_2b_2
=\begin{bmatrix}1&1\\1&-1\end{bmatrix}
\begin{bmatrix}c_1\\c_2\end{bmatrix}.$$

Matrisen oppstår altså ved å sette **én byggestein i hver kolonne**. Vil vi
lage målet $t=[2,0]^T$, får vi

$$
\underbrace{\begin{bmatrix}1&1\\1&-1\end{bmatrix}}_{P_2}
\underbrace{\begin{bmatrix}c_1\\c_2\end{bmatrix}}_{c}
=
\underbrace{\begin{bmatrix}2\\0\end{bmatrix}}_{t}.
$$

Radene sier $c_1+c_2=2$ og $c_1-c_2=0$. Legger vi sammen de to likningene,
får vi $2c_1=2$, altså $c_1=1$; den andre likningen gir da $c_2=c_1=1$.
Vi kontrollerer ved å regne forover:
$1b_1+1b_2=[2,0]^T$. Dette lille eksemplet viser hele mekanismen:
$P$ inneholder kjente byggesteiner, $t$ er det kjente målet, og $c$ er den
ukjente oppskriften.

For de fire $2\times2$-mønstrene gjør vi nøyaktig det samme. Først legger vi
radene i hvert mønster etter hverandre:

$$
\begin{aligned}
\operatorname{vec}(M)&=[1,1,1,1]^T,\\
\operatorname{vec}(H)&=[1,-1,1,-1]^T,\\
\operatorname{vec}(V)&=[1,1,-1,-1]^T,\\
\operatorname{vec}(D)&=[1,-1,-1,1]^T.
\end{aligned}
$$

Disse fire kjente vektorene blir kolonnene i

$$
P=
\begin{bmatrix}
1& 1& 1& 1\\
1&-1& 1&-1\\
1& 1&-1&-1\\
1&-1&-1& 1
\end{bmatrix}.
$$

Koeffisientvektoren
$c=[c_M,c_H,c_V,c_D]^T$ inneholder styrken til de fire mønstrene. Produktet
$Pc$ er ikke et nytt abstrakt objekt: Det er de fire pikselverdiene i
$c_MM+c_HH+c_VV+c_DD$, skrevet radvis som en vektor.

Nå bruker vi det konkrete målbildet fra pikselbasis-eksemplet:

$$X=\begin{bmatrix}0.2&0.7\\0.4&0.9\end{bmatrix},\qquad
t=\operatorname{vec}(X)=\begin{bmatrix}0.2\\0.7\\0.4\\0.9\end{bmatrix}.$$

Reverse engineering betyr at $t$ er kjent, mens mønsterstyrkene i $c$ er
ukjente. Vi løser

$$
\underbrace{P}_{\substack{\text{kjente mønstre}\\4\times4}}
\underbrace{c}_{\substack{\text{ukjente styrker}\\4\times1}}
=
\underbrace{t}_{\substack{\text{kjente målpiksler}\\4\times1}}.
$$

Systemet $Pc=t$ er fire likninger:

$$\begin{aligned}c_M+c_H+c_V+c_D&=0.2,\\ c_M-c_H+c_V-c_D&=0.7,\\ c_M+c_H-c_V-c_D&=0.4,\\
c_M-c_H-c_V+c_D&=0.9.\end{aligned}$$

Mønstrene er laget slik at vi kan legge sammen og trekke fra hele likninger.
Legger vi sammen alle fire, faller $c_H$, $c_V$ og $c_D$ bort:
$4c_M=0.2+0.7+0.4+0.9=2.2$, så $c_M=0.55$. Med fortegnene $+,-,+,-$ blir bare
$c_H$ igjen: $4c_H=0.2-0.7+0.4-0.9=-1.0$, så $c_H=-0.25$. På samme måte gir
$+,+,-,-$ og $+,-,-,+$

$$4c_V=0.2+0.7-0.4-0.9=-0.4,\quad c_V=-0.10,\qquad 4c_D=0.2-0.7-0.4+0.9=0,\quad c_D=0.$$

Tallene er de samme som startverdiene i appleten. Kontroll av første likning:
$0.55-0.25-0.10+0=0.20$.

Det er viktig å skille de to retningene:

| Retning | Kjent | Ukjent | Regneoperasjon |
|---|---|---|---|
| Bygg bildet | $P$ og $c$ | $t$ | beregn `P @ c` |
| Reverse engineering | $P$ og $t$ | $c$ | løs `P @ c = t` |

En løsning finnes for hvert målbilde akkurat når kolonnene i $P$ spenner ut
hele bilderommet. Løsningen er entydig akkurat når kolonnene er lineært
uavhengige. Derfor gir en basis nøyaktig én koeffisientvektor $c$ for hvert
mål $t$, og hver $c$ gir nøyaktig ett bilde $Pc$: Basisen fungerer som et
koordinatsystem.

::: {.callout-tip}
### Samme reverse engineering i ukeprosjektet

I prosjektet [Polynomer i blindsonen](project_week3.qmd) er de kjente dataene
polynomverdier $p(x_0),\ldots,p(x_n)$, og de ukjente er polynomkoeffisientene.
Reverse engineering er det samme: løs et lineært system for koeffisientene, og
kontroller at de gjenskaper dataene.
:::

Cellen gjentar regnestykket: `column_stack` bygger $P$, `matrix_rank` teller pivotene, `solve` finner $c$, og `P @ c` kontrollerer at oppskriften faktisk bygger målet.

```{pyodide-python}
#| label: week3-change-basis
#| autorun: true

# reshape(-1) gjør hvert 2 x 2-mønster til en 4-vektor.
# column_stack setter de fire byggesteinene som kolonner i P.
P=np.column_stack([pattern.reshape(-1) for pattern in pattern_basis])
print("Rang av P:",np.linalg.matrix_rank(P))

# X er kjent; c er den ukjente oppskriften i mønsterbasisen.
c=np.linalg.solve(P,X.reshape(-1))
# Hver koordinat skalerer sin byggestein. Summen skal bli X igjen.
pattern_components=[value*pattern for value,pattern in zip(c,pattern_basis)]
reconstructed=(P@c).reshape(2,2)
scale=max(np.max(np.abs(part)) for part in pattern_components)

show_images(pattern_components+[reconstructed],
    [f"{c[i]:.2f} · {pattern_names[i]}" for i in range(4)]+["Summen"],
    cols=5,cmap="coolwarm",vmin=-scale,vmax=scale,figsize=(7.0,1.8))
print("Pikselkoordinater: ",coefficients)
print("Mønsterkoordinater:",c)
print("Rekonstruksjonsfeil:",np.linalg.norm(reconstructed-X))
```

Rangutskriften er 4: Alle fire kolonnene er pivotkolonner (pivoter repeteres i [3.7](#uke3-stotte-matriser)), så ingen mønsterkolonne kan bygges av de andre. Fire uavhengige mønstre i rommet $\mathbb R^{2\times2}$, som har dimensjon 4, danner en basis. Mønsterkoordinatene er $[0.55,-0.25,-0.10,0]^T$ som i håndregningen, og summen av delbildene rekonstruerer $X$ (feilen er null eller på størrelse med avrundingsfeil).

Pikselbasisen beskriver bildet med fire lokale lysverdier; mønsterbasisen
beskriver det samme bildet som lysnivå pluss tre kontraster. Dette er et
**basisskifte**: samme objekt, ny oppskrift.

::: {.callout-note}
### Hvorfor bytte basis?

En basis er ikke bare et sett som tilfredsstiller en definisjon. Et godt valg av basis kan skille egenskaper vi vil bevare fra egenskaper en transformasjon fjerner. Det er nettopp det som skjer i neste eksperiment.
:::

::: {.reading-step title="Gå i dybden: fra byggesteiner til bildekompresjon"}

Valget av byggesteiner kan få praktisk betydning. Vanlige bilder inneholder ofte store jevne områder, langsomme overganger, kanter og gjentatte mønstre. Hvis byggesteinene passer til denne strukturen, kan bildet kanskje beskrives godt med noen få store koeffisienter og mange små.

Da kan de minste bidragene lagres mindre nøyaktig eller utelates. En mulig kompresjonsalgoritme får dermed denne formen:

1. Del bildet opp i egnede mønsterbyggesteiner.
2. Finn styrken til hver byggestein.
3. Behold de viktigste bidragene.
4. Rekonstruer et bilde som ligner originalen.

I [uke 7](uke7.qmd#uke7-bilde) skal vi bruke singulærverdifaktorisering (SVD) til å konstruere en faktisk algoritme for bildekompresjon. Da arbeider vi med større bilder og beholder de delene som beskriver mest av strukturen i bildet.

I uke 3 er målet mindre, men grunnleggende: Vi analyserer små $2\times2$- og $4\times4$-bilder der alle byggesteiner, koeffisienter og transformasjoner kan sees direkte. De små bildeblokkene fungerer som en oversiktlig modell for ideene som senere skaleres opp i SVD-algoritmen.

:::

## 3.4 Hva transformasjonen ser og ikke ser {#uke3-del3}

Nå bruker vi matrisen og byggesteinene til å besvare to spørsmål:

1. Hvilke inputendringer gir output null? Svaret er nullrommet.
2. Hvor mange outputverdier kan styres uavhengig? Svaret er rangen.

Vi løser først problemet for **én** $2\times2$-blokk og bruker deretter samme argument fire ganger for hele $4\times4$-bildet.

### Én blokk: transformasjonen $4\to1$

Legg de fire pikselverdiene i én $2\times2$-blokk i vektoren
$u=[u_1,u_2,u_3,u_4]^T$. Gjennomsnittet er

$$G(u)=\frac14(u_1+u_2+u_3+u_4)
=\underbrace{\begin{bmatrix}\frac14&\frac14&\frac14&\frac14\end{bmatrix}}_{B}u.$$

Én outputverdi gir én rad i matrisen, som i 3.2. Cellen sender de fire mønstrene fra 3.3
gjennom $G$, én om gangen. Fordi $G$ er lineær, forteller resultatene også hva
som skjer med enhver kombinasjon av dem.

```{pyodide-python}
#| label: week3-average-patterns
#| autorun: true

# Vi sender én basisretning om gangen gjennom gjennomsnittstransformasjonen.
# Da ser vi hvilke koordinater transformasjonen beholder.
outputs=[np.array([[np.mean(pattern)]]) for pattern in pattern_basis]
show_image_table(
    [pattern_basis,outputs],
    ["Input\n($2\\times2$)","Output\n($1\\times1$)"],
    pattern_names,
    cell_labels=[
        ["$M$","$H$","$V$","$D$"],
        [f"$G={value.item():.1f}$" for value in outputs]
    ],
    cmap="coolwarm",vmin=-1,vmax=1,figsize=(7.0,3.6)
)
for name,pattern in zip(pattern_names,pattern_basis):
    print(f"{name:16s} -> gjennomsnitt {np.mean(pattern): .1f}")
```

Hver kolonne i tabellen er ett forsøk: øverst en blokk med fire
pikselverdier, rett under den tilhørende $1\times1$-outputen. Lysnivåbildet
har fire enere, så gjennomsnittet er 1. Hvert kontrastbilde har to enere og
to minusenere; summen er 0, og gjennomsnittet er derfor 0.

Resultatene deler byggesteinene i to grupper. Transformasjonen registrerer
lysnivåretningen, men sender hver kontrastretning til null. Fordi transformasjonen er
lineær (se 3.2), har også enhver kombinasjon av kontrastbildene gjennomsnitt 0.

::: {.callout-important}
### Den lille transformasjonens nullrom og rang

Kontrastmønstrene $H,V,D$ kan legges til en blokk uten å endre
gjennomsnittet. De er lineært uavhengige og har sum null: tre uavhengige
retninger i nullrommet. Når tre av fire pikselverdier er valgt i en blokk med
sum null, er den siste bestemt, så nullrommet har dimensjon 3. Den ene
gjennomsnittsverdien kan velges fritt, så $B$ har rang 1. Regnskapet er

$$4=\operatorname{rank}(B)+\dim N(B)=1+3.$$

:::

Fra tidligere kurs i lineær algebra kjenner vi nullrommet som mengden av løsninger av et homogent likningssystem. For en transformasjon $A:\mathbb R^n\to\mathbb R^m$ er

$$N(A)=\{z\in\mathbb R^n:Az=0\}\subseteq\mathbb R^n.$$

Nullrommet kalles også **kjernen** til $A$, og mange bøker skriver $\ker A$ i
stedet for $N(A)$.

Nullrommet ligger i **inputrommet**: Vektorene der har like mange komponenter som en input. For én blokk ligger det i $\mathbb R^4$, og med mønstrene skrevet som 4-vektorer er

$$N(B)=\operatorname{span}\{H,V,D\}.$$

Nullrommet er altså ikke bare selve nullbildet; det inneholder mange ikke-null
blokker som denne ene blokkmålingen ikke registrerer.

Dette forklarer åpningsproblemet for én blokk. Hvis $G(u_1)=G(u_2)$, har to
blokker samme blokkgjennomsnitt. Vi kan trekke den ene outputen fra den andre,
og linearitet gir $G(u_1-u_2)=0$. Forskjellsblokken $u_1-u_2$ ligger derfor i
nullrommet. Omvendt kan vi legge enhver nullromsendring til en blokk uten å
endre den ene outputverdien:

$$G(u_1)=G(u_2)\quad\Longleftrightarrow\quad G(u_1-u_2)=0.$$

Vi går nå langs én usynlig retning. Cellen starter med et jevnt grått bilde og
legger til $t$ ganger sjakkmønsteret for fem verdier av $t$. Hvis
sjakkmønsteret virkelig ligger i nullrommet, skal gjennomsnittet stå stille.

```{pyodide-python}
#| label: week3-family-same-average
#| autorun: true

# base er startbildet, direction er en nullromsretning, og t bestemmer
# hvor langt vi går i denne retningen. Gjennomsnittet skal være uendret.
base=np.full((2,2),0.5)
direction=0.35*D
t_values=[-1.,-0.5,0.,0.5,1.]
family=[base+t*direction for t in t_values]
show_images(family,
    [f"$t={t:g}$\ngjennomsnitt={np.mean(image):.2f}" for t,image in zip(t_values,family)],
    cols=5,vmin=0,vmax=1,figsize=(7.0,1.7))
```

Pikslene endres med $t$, men titlene viser at gjennomsnittet står på $0.50$ i
alle fem blokker. Nullrommet beskriver alle forskjeller mellom inputblokker som
målingen ikke kan oppdage.

### Fire blokker: transformasjonen $16\to4$

For hele $4\times4$-bildet bruker $A_{\mathrm{pool}}\in\mathbb R^{4\times16}$ den samme raden $B$ på fire blokker og lager ett blokkgjennomsnitt fra hver. Den tar altså ikke gjennomsnittet av alle 16 piksler samlet.

Når vi gjentar argumentet i hver blokk, får vi $4\cdot3=12$
usynlige og $4\cdot1=4$ synlige retninger.

::: {.reading-step title="Gå i dybden: alle tolv usynlige mønstre"}

Tabellen viser presist hvordan resultatene for én blokk overføres til hele bildet:

| Én blokk | Hele bildet |
|---|---|
| 4 inputpiksler | 4 blokker med 4 piksler, altså 16 inputpiksler |
| 1 gjennomsnitt | 1 gjennomsnitt per blokk, altså 4 outputverdier |
| matrisen $B$ har størrelse $1\times4$ | matrisen $A_{\mathrm{pool}}$ har størrelse $4\times16$ |
| nullitet 3 | tre lokale nullromsretninger i hver blokk: $4\cdot3=12$ |
| rang 1 | én fritt valgbar output per blokk: $4\cdot1=4$ |

Dermed kan hver blokk inneholde sine egne usynlige kontraster. Funksjonen
`place_in_block` nedenfor plasserer $H$, $V$ eller $D$ i én blokk og fyller
resten av bildet med null. Fire plasseringer med tre kontrasttyper gir
$4\cdot3=12$ bilder.

```{pyodide-python}
#| label: week3-full-null-basis
#| autorun: true

def place_in_block(pattern,block_row,block_col):
    """Legg ett 2 x 2-kontrastmønster i valgt blokk av et nullbilde."""
    Z=np.zeros((4,4))
    r,c=2*block_row,2*block_col
    Z[r:r+2,c:c+2]=pattern
    return Z

null_basis=[]; null_titles=[]
# Tre kontraster i hver av fire blokker gir 3 * 4 = 12 kandidater.
for br in range(2):
    for bc in range(2):
        for pattern,name in zip([H,V,D],["H","V","D"]):
            null_basis.append(place_in_block(pattern,br,bc))
            null_titles.append(f"Blokk ({br+1},{bc+1}), {name}")

show_images(null_basis,null_titles,cols=4,cmap="coolwarm",
            vmin=-1,vmax=1,figsize=(6.8,5.2))
```

Hvert bilde endrer bare de fire pikslene i én blokk. Positive og
negative bidrag opphever hverandre, så blokkgjennomsnittet av endringene er
null. De tre andre blokkene er allerede null. Dermed må alle fire
blokkgjennomsnittene, og altså hele outputbildet, bli null for hvert av de
tolv inputbildene.

Neste celle kontrollerer dette numerisk. Deretter velger den tolv tilfeldige koeffisienter, skalerer hvert kontrastbilde og legger alle sammen. Det sammensatte inputbildet ser uregelmessig ut, men hver blokk har fortsatt sum null.

```{pyodide-python}
#| label: week3-random-null-image
#| autorun: true

# Først kontrolleres hver kandidat separat med ||A z||.
for i,Zi in enumerate(null_basis,start=1):
    print(f"Mønster {i:2d}: ||A z|| = {np.linalg.norm(A_pool@Zi.reshape(-1)):.1e}")

rng=np.random.default_rng(7)
random_coefficients=rng.normal(size=12)
# En lineærkombinasjon av nullromsvektorer skal fortsatt ligge i nullrommet.
Z=sum(c*Zi for c,Zi in zip(random_coefficients,null_basis))
pooled_Z=average_pool(Z)
limit=np.max(np.abs(Z))
show_image_table(
    [[Z,pooled_Z]],
    ["Kontroll"],
    ["Input $Z$ ($4\\times4$)",
     "Output $A_{\\mathrm{pool}}z$ ($2\\times2$)"],
    cmap="coolwarm",vmin=-limit,vmax=limit,figsize=(4.8,2.7)
)
```

For hvert mønster er $Az$ et $2\times2$-outputbilde. Utskriften $\lVert Az\rVert$ måler avstanden fra denne outputen til nullbildet. Verdiene er 0 (eller på størrelse med avrundingsfeil), så mønsteret forsvinner i transformasjonen.

Venstre felt i tabellen viser kombinasjonen av de tolv mønstrene. Høyre felt
viser den mindre outputen etter blokkgjennomsnitt. Den er null i alle fire
posisjoner. Koden viser dermed to ting: Hver lokal kontrast gir output
null, og en tilfeldig lineærkombinasjon av dem gir fremdeles output null.
Grunnen er linearitet, ikke at vi var heldige med koeffisientene.

De tolv byggesteinene påvirker enten forskjellige blokker eller forskjellige
kontraster i samme blokk. Ingen av dem kan fjernes uten at vi mister en mulig
lokal endring. Samtidig kan ethvert bilde der hver blokk har sum null bygges
av dem, blokk for blokk.

:::

Hvis $Az_1=0$ og $Az_2=0$, er også $A(\alpha z_1+\beta z_2)=\alpha Az_1+\beta Az_2=0$.
Nullrommet er altså en samling der vi kan addere bilder og multiplisere dem med tall uten å forlate samlingen. En slik lineær samling inni et større rom kalles et **underrom**. Vi trenger ingen nye regneregler; ordet beskriver bare at lineærkombinasjoner blir værende i samlingen.

De tolv lokale kontrastene (tre i hver blokk) danner en basis for nullrommet
til $A_{\mathrm{pool}}$, som derfor har dimensjon 12.

### Matrisekolonnene og rangen

Nå finner vi rangen ved å spørre hva som kan produseres. Da bruker vi en annen måte å bygge en matrise på:

> Kolonne $j$ er outputen når inputen er $e_j$, altså når inputverdi $j$ er 1
> og alle andre inputverdier er 0.

::: {.reading-step title="Gå i dybden: to måter å bygge matrisen på"}

For en regel som er oppgitt med outputformler, er radmetoden fra 3.2 raskest.
For en ukjent regel vi kan teste — et typisk reverse-engineering-problem —
kan vi sende inn $e_1,e_2,\ldots,e_n$ og samle de observerte outputene som
kolonner. De to metodene bygger den samme matrisen.

:::

Klikk på en inputpiksel i figuren. Da får den pikselen verdien 1 og alle andre verdien 0;
vi sier at vi **slår på én piksel**. Outputbildet til høyre viser hva transformasjonen gjør.
**Hvilke $2\times2$-bilder kan transformasjonen produsere?**

```{.jsxgraph width="760" height="430"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [0, 8.2, 14.8, 0],
  axis: false,
  showCopyright: false,
  showNavigation: false,
  pan: { enabled: false },
  zoom: { enabled: false }
});

var groupColors = ['#8ecae6','#ffcf70','#a8d5a2','#d7b5e8'];
var groupDark = ['#277da1','#d98900','#4f8f49','#8b5aa7'];
var groupNames = ['øvre venstre','øvre høyre','nedre venstre','nedre høyre'];
var selectedPixel = 0;

function pixelGroup(index) {
  var row=Math.floor(index/4), col=index%4;
  return (row<2 ? 0 : 2)+(col<2 ? 0 : 1);
}

function box(x0,y0,size,fill,opacity,border,width) {
  return board.create('polygon',
    [[x0,y0],[x0+size,y0],[x0+size,y0+size],[x0,y0+size]],{
      fillColor:fill,fillOpacity:opacity,
      vertices:{visible:false},
      borders:{strokeColor:border,strokeWidth:width,
               fixed:true,highlight:false},
      fixed:true,highlight:false
    });
}

board.create('text',[3.0,7.75,'INPUT: klikk på én piksel'],{
  anchorX:'middle',fontSize:16,cssStyle:'font-weight:600',fixed:true
});
board.create('text',[11.15,7.75,'OUTPUT'],{
  anchorX:'middle',fontSize:16,cssStyle:'font-weight:600',fixed:true
});

var inputCells=[];
for (let i=0; i<16; i++) {
  let row=Math.floor(i/4), col=i%4, group=pixelGroup(i);
  let x0=1.0+col, y0=2.65+(3-row);
  let cell=box(x0,y0,1.0,groupColors[group],function(){
    return selectedPixel===i ? 0.95 : 0.48;
  },function(){return selectedPixel===i ? groupDark[group] : '#ffffff';},
  function(){return selectedPixel===i ? 4 : 1.5;});
  cell.on('down',function(){selectedPixel=i; board.update();});
  inputCells.push(cell);
  board.create('text',[x0+0.5,y0+0.5,String(i+1)],{
    anchorX:'middle',anchorY:'middle',fontSize:13,
    cssStyle:'font-weight:600; pointer-events:none',fixed:true
  });
}
box(1.0,2.65,4.0,'none',0,'#333333',2);
board.create('segment',[[3.0,2.65],[3.0,6.65]],{
  strokeColor:'#333333',strokeWidth:3,fixed:true,highlight:false
});
board.create('segment',[[1.0,4.65],[5.0,4.65]],{
  strokeColor:'#333333',strokeWidth:3,fixed:true,highlight:false
});

var outputXY=[[10.0,5.15],[11.15,5.15],[10.0,4.0],[11.15,4.0]];
for (let g=0; g<4; g++) {
  let x0=outputXY[g][0], y0=outputXY[g][1];
  box(x0,y0,1.15,groupColors[g],function(){
    return pixelGroup(selectedPixel)===g ? 0.95 : 0.20;
  },'#ffffff',1.5);
  board.create('text',[x0+0.575,y0+0.575,function(){
    return pixelGroup(selectedPixel)===g ? '1/4' : '0';
  }],{
    anchorX:'middle',anchorY:'middle',fontSize:15,
    cssStyle:'font-weight:600',fixed:true
  });
}
box(10.0,4.0,2.3,'none',0,'#333333',2);
board.create('segment',[[11.15,4.0],[11.15,6.3]],{
  strokeColor:'#333333',strokeWidth:3,fixed:true,highlight:false
});
board.create('segment',[[10.0,5.15],[12.3,5.15]],{
  strokeColor:'#333333',strokeWidth:3,fixed:true,highlight:false
});

var groupStarts=[[2.0,5.65],[4.0,5.65],[2.0,3.65],[4.0,3.65]];
var groupEnds=[[10.0,5.72],[11.15,5.72],[10.0,4.57],[11.15,4.57]];
for (let g=0; g<4; g++) {
  board.create('arrow',[groupStarts[g],groupEnds[g]],{
    strokeColor:groupDark[g],strokeWidth:function(){
      return pixelGroup(selectedPixel)===g ? 4 : 1.5;
    },strokeOpacity:function(){
      return pixelGroup(selectedPixel)===g ? 1 : 0.18;
    },fixed:true,highlight:false
  });
}

board.create('text',[7.55,1.75,function(){
  var g=pixelGroup(selectedPixel);
  return 'Piksel '+(selectedPixel+1)+' hører til '+groupNames[g]+' gruppe.';
}],{
  anchorX:'middle',fontSize:14,cssStyle:'font-weight:600',fixed:true
});
board.create('text',[7.55,1.15,'Én piksel med verdi 1 gir gjennomsnitt 1/4 i sitt outputfelt.'],{
  anchorX:'middle',fontSize:12,fixed:true
});
```

Alle piksler med samme farge peker mot samme felt: Én påslått piksel gir blokkgjennomsnitt $1/4$ i sin blokk og 0 i de andre. Klikk på flere piksler med samme farge etter tur; outputen blir den samme.

Her kommer forbindelsen til matrisen: **Kolonne $j$ i $A$ er outputen vi får når bare inputpiksel $j$ er slått på.** Fire piksler som gir samme output, gir derfor fire identiske kolonner. Figuren viser på denne måten fire grupper av like kolonner, én gruppe for hver farge.

::: {.reading-step title="Gå i dybden: kolonnene som bilder"}

La $f_1,f_2,f_3,f_4$ være pikselbasisen i outputrommet
$\mathbb R^4$. Forsøkene gir konkret

$$
\begin{aligned}
a_1=a_2=a_5=a_6&=\tfrac14 f_1,\\
a_3=a_4=a_7=a_8&=\tfrac14 f_2,\\
a_9=a_{10}=a_{13}=a_{14}&=\tfrac14 f_3,\\
a_{11}=a_{12}=a_{15}=a_{16}&=\tfrac14 f_4.
\end{aligned}
$$

Her er $a_j$ kolonne $j$ i $A_{\mathrm{pool}}$. Den første linjen sier for
eksempel at hver av pikslene 1, 2, 5 og 6 påvirker bare øvre venstre
outputpiksel, og påvirker den med vekten $1/4$. Dette er den samme matrisen
som vi bygde radvis i 3.2, men nå er den funnet ved å teste transformasjonen
på én inputretning om gangen. Slik kan matrisen reverse-engineeres selv om vi
ikke kjenner den interne oppskriften til transformasjonen.

Koden nedenfor utfører alle de 16 forsøkene på én gang og tegner hver matriskolonne som et lite $2\times2$-bilde.

```{pyodide-python}
#| label: week3-columns-as-images
#| autorun: true

# Kolonne j er outputen A_pool lager når bare inputpiksel j er lik 1.
# reshape gjør hver 4-komponentkolonne synlig som et 2 x 2-outputbilde.
column_images=[A_pool[:,j].reshape(2,2) for j in range(16)]
show_images(column_images,[f"Kolonne {j+1}" for j in range(16)],
            cols=4,vmin=0,vmax=0.25,figsize=(6.8,5.8))
```

De 16 små bildene bekrefter det vi så i appleten: Kolonnene kommer i fire
grupper. Innenfor hver gruppe er outputbildene identiske. Derfor gir flere
kolonner i samme gruppe ingen ny måte å endre outputen på. Fra én gruppe til
den neste flytter den eneste outputpikselen som ikke er null, seg til en ny plass.

:::

Velg én representant fra hver gruppe, for eksempel kolonne 1, 3, 9 og 11.
Hver av dem har verdien $1/4$ på én outputplass og 0 på de tre andre, og
plassene er forskjellige. Ingen av dem kan derfor bygges av de tre andre: De
fire representantene er lineært uavhengige.

De spenner også ut hele outputrommet. For å lage en ønsket output
$y=[y_1,y_2,y_3,y_4]^T$ kan vi for eksempel sette inputpikslene 1, 3, 9 og
11 lik $4y_1,4y_2,4y_3,4y_4$ og la alle andre inputpiksler være null.

::: {.reading-step title="Gå i dybden: en oppskrift for enhver output"}

En annen, mer bildelik oppskrift er å fylle hver blokk med den ønskede
outputverdien. Koden nedenfor bruker denne oppskriften og kontrollerer den
på fire tilfeldige målbilder.

```{pyodide-python}
#| label: week3-build-arbitrary-output
#| autorun: true

def expand_block_values(Y):
    """Gjør hver verdi i et 2x2-bilde til en konstant 2x2-blokk."""
    # Gjenta først hver rad og deretter hver kolonne. Dette konstruerer en
    # input som garantert får blokkgjennomsnittene i Y.
    return np.repeat(np.repeat(Y,2,axis=0),2,axis=1)

rng=np.random.default_rng(24)
targets=[rng.random((2,2)) for _ in range(4)]
# Reverse engineering er her enkelt: kopier hver ønsket outputverdi tilbake
# til de fire inputpikslene som måles sammen.
inputs=[expand_block_values(Y) for Y in targets]
outputs=[average_pool(Xi) for Xi in inputs]

experiment_rows=[[Xi,Yi,out] for Xi,Yi,out in zip(inputs,targets,outputs)]
show_image_table(
    experiment_rows,
    [f"Forsøk {i}" for i in range(1,len(experiment_rows)+1)],
    ["Konstruert input\n($4\\times4$)",
     "Ønsket output\n($2\\times2$)",
     "Faktisk output\n($2\\times2$)"],
    vmin=0,vmax=1,figsize=(6.8,8.0)
)
print("Største feil:",max(np.linalg.norm(out-Yi)
                          for out,Yi in zip(outputs,targets)))
```

Les hver forsøksrad fra venstre mot høyre. Først vises et konstruert
$4\times4$-inputbilde. I midten står $2\times2$-outputen vi ba om, og til
høyre står $2\times2$-outputen transformasjonen faktisk beregnet. De to små
bildene er identiske i alle fire forsøk.

Målbildene ble valgt tilfeldig, men den samme oppskriften virker for alle
$2\times2$-bilder: kopier hver ønsket outputverdi inn i alle fire pikslene i
den tilsvarende inputblokken. Gjennomsnittet av fire like verdier er denne
verdien selv. Feilen er derfor nøyaktig null, bortsett fra eventuell
avrunding. Transformasjonen kan altså produsere alle vektorer i
$\mathbb R^4$.

:::

Fra tidligere kjenner vi samlingen av alle outputvektorer en matrise kan produsere som **kolonnerommet**. For hele bildereduksjonen skriver vi

$$\operatorname{Col}(A_{\mathrm{pool}})
=\{A_{\mathrm{pool}}x:x\in\mathbb R^{16}\}\subseteq\mathbb R^4.$$

Kolonnerommet ligger i **outputrommet** og består av 4-vektorer, mens nullrommet består av 16-vektorer.

Navnet kan nå leses direkte fra eksperimentet. Hvis $a_j$ er kolonne $j$ i $A_{\mathrm{pool}}$, er

$$A_{\mathrm{pool}}x=x_1a_1+\cdots+x_{16}a_{16}.$$

Inputverdien $x_j$ skalerer kolonnen $a_j$, og bidragene legges sammen: Alle outputer er lineærkombinasjoner av kolonnene.

For å beskrive kolonnerommet holder det å beholde kolonnene 1, 3, 9 og 11, én fra hver gruppe; de andre tolv er kopier.

**Rangen** er dimensjonen til kolonnerommet:

$$\operatorname{rank}(A_{\mathrm{pool}})
=\dim\operatorname{Col}(A_{\mathrm{pool}}).$$

Rangen er derfor 4. Det kan vi begrunne på tre likeverdige måter:

1. Vi har funnet fire lineært uavhengige matriskolonner.
2. Disse fire kolonnene spenner ut hele det firedimensjonale outputrommet.
3. Gauss-eliminasjon gir fire pivoter, én for hver kolonnegruppe.

Rangen teller verken kolonnene (16) eller outputplassene (4), men de
uavhengige outputretningene kolonnene kan bygge. Den kan aldri bli større enn
antallet kolonner eller antallet rader: Hver pivot trenger sin egen kolonne og
sin egen rad. For en annen $4\times16$-matrise kunne rangen vært mindre dersom
noen målinger var avhengige av de andre.

::: {.reading-step title="Gå i dybden: NumPy teller det samme"}

Til slutt lar vi NumPy telle det samme. `matrix_rank` er bare en kontroll;
begrunnelsen er de fire uavhengige kolonnene over.

```{pyodide-python}
#| label: week3-rank-check

# shape[1] teller inputkoordinater, shape[0] teller outputkoordinater.
# Rangen kan være mindre enn begge dersom noen retninger er overflødige.
print("Inputverdier:",A_pool.shape[1])
print("Outputverdier:",A_pool.shape[0])
print("Numerisk rang:",np.linalg.matrix_rank(A_pool))
```

:::

::: {.reading-step title="Gå i dybden: en overflødig femte måling"}

Her kan du kontrollere at flere outputtall ikke nødvendigvis betyr mer
informasjon. Vi legger til gjennomsnittet av alle de 16 inputpikslene som en
femte måling. Den nye outputverdien ser først ut som ny informasjon, men den
kan beregnes fra de fire blokkgjennomsnittene. Cellen regner ut de fem
målingene for et tilfeldig bilde og sammenligner rangen med og uten den nye
raden.

```{pyodide-python}
#| label: week3-redundant-output
#| autorun: true

# vstack legger til én ny måling som femte rad. Den nye raden er
# gjennomsnittet av de fire gamle radene og kan derfor ikke øke rangen.
A_five=np.vstack([A_pool,np.ones(16)/16])
rng=np.random.default_rng(5)
X_test=rng.random((4,4))
y=A_five@X_test.reshape(-1)
print("Fem outputverdier:",y)
print("Femte verdi:",y[4])
print("Gjennomsnitt av de fire første:",np.mean(y[:4]))
print("Rang med fire outputer:",np.linalg.matrix_rank(A_pool))
print("Rang med fem outputer:",np.linalg.matrix_rank(A_five))
```

Utskriften viser at den femte outputverdien er gjennomsnittet av de fire
første; noen ganger skiller tallene seg bare med en avrundingsrest i siste
desimal. Matrisen har nå fem rader, men den femte målingen gir ingen ny
justeringsmulighet og ingen ny informasjon om inputen. Den er bestemt av de
fire andre, så rangen er fortsatt 4. Det samme skjer i prosjektet når et
avlesningspunkt gjentas: Den nye raden er en kopi av en gammel og kan ikke øke
rangen.

:::

### Seksten knapper, men bare fire når fram

Nå beskriver vi det samme inputbildet med 16 nye skyveknapper: fire fargede
for blokkgjennomsnittene og tolv grå for kontrastene inne i blokkene (c1–c3
hører til øvre venstre blokk, c4–c6 til øvre høyre, c7–c9 til nedre venstre og
c10–c12 til nedre høyre). Prøv begge typer: De fargede endrer både inputbildet
og outputen, mens de grå bare endrer inputbildet.

Her regner vi i hele bilderommet: pikselverdier kan være mindre enn 0 eller
større enn 1. Bare fargeskalaen klippes til svart–hvitt; tallene og
blokkgjennomsnittet klippes ikke. En melding under inputbildet viser når
fargeskalaen ikke kan vise hele variasjonen.

```{.jsxgraph width="760" height="440"}
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: [0, 9.1, 15.2, 0],
  axis: false,
  showCopyright: false,
  showNavigation: false,
  pan: { enabled: false },
  zoom: { enabled: false }
});

var controlColors=['#277da1','#d98900','#4f8f49','#8b5aa7'];
var controlFills=['#8ecae6','#ffcf70','#a8d5a2','#d7b5e8'];
var controlNames=['øvre venstre','øvre høyre','nedre venstre','nedre høyre'];
var initialMeans=[0.25,0.60,0.40,0.75];
var meanControls=[];
var contrastControls=[];

board.create('text',[3.0,8.72,'INPUT: 16 uavhengige knapper'],{
  anchorX:'middle',fontSize:16,cssStyle:'font-weight:600',fixed:true
});
board.create('text',[2.85,8.15,'4 blokkgjennomsnitt — disse påvirker outputen'],{
  anchorX:'middle',fontSize:12,cssStyle:'font-weight:600',fixed:true
});

for (let i=0;i<4;i++) {
  let y=7.50-0.66*i;
  board.create('text',[0.45,y,controlNames[i]],{
    anchorY:'middle',fontSize:10,color:controlColors[i],
    cssStyle:'font-weight:600',fixed:true
  });
  meanControls.push(board.create('slider',
    [[2.25,y],[5.15,y],[0,initialMeans[i],1]],{
      name:'',snapWidth:0.05,precision:2,
      strokeColor:controlColors[i],fillColor:controlColors[i],
      highline:{strokeColor:controlColors[i]},
      baseline:{strokeColor:'#b8b8b8'},
      point1:{visible:false},point2:{visible:false}
    }));
}

board.create('text',[2.85,4.60,'12 kontraster — prøv dem, outputen endres ikke'],{
  anchorX:'middle',fontSize:12,color:'#666666',
  cssStyle:'font-weight:600',fixed:true
});

for (let k=0;k<12;k++) {
  let col=Math.floor(k/4), row=k%4;
  let x0=0.65+1.72*col, y=3.92-0.63*row;
  board.create('text',[x0,y,'c'+(k+1)],{
    anchorY:'middle',fontSize:9,color:'#777777',fixed:true
  });
  contrastControls.push(board.create('slider',
    [[x0+0.34,y],[x0+1.16,y],[-1,0,1]],{
      name:'',snapWidth:0.1,precision:1,
      strokeColor:'#777777',fillColor:'#777777',
      highline:{strokeColor:'#777777'},
      baseline:{strokeColor:'#c8c8c8'},
      point1:{visible:false},point2:{visible:false},
      glider:{size:2,strokeColor:'#666666',fillColor:'#aaaaaa'}
    }));
}

// Inputbildet: pikselverdi = blokkgjennomsnitt + 1/4 · (kontraster · mønstre).
// Kontrast k hører til blokk floor(k/3) og mønster k%3 (H, V, D fra 3.3).
var patternRows=[[1,-1,1,-1],[1,1,-1,-1],[1,-1,-1,1]];
function inputValue(block,pos){
  var v=meanControls[block].Value();
  for (var j=0;j<3;j++) v+=0.25*contrastControls[3*block+j].Value()*patternRows[j][pos];
  return v;
}
function grayFill(v){var l=Math.round(255*Math.max(0,Math.min(1,v))); return 'rgb('+l+','+l+','+l+')';}
var px=0.5, ix=6.35, iy=3.55;
for (let r=0;r<4;r++) for (let c=0;c<4;c++) {
  let block=(r<2?0:2)+(c<2?0:1), pos=2*(r%2)+(c%2);
  let x0=ix+c*px, y0=iy+(3-r)*px;
  board.create('polygon',[[x0,y0],[x0+px,y0],[x0+px,y0+px],[x0,y0+px]],{
    fillColor:function(){return grayFill(inputValue(block,pos));},fillOpacity:1,
    vertices:{visible:false},
    borders:{strokeColor:controlColors[block],strokeWidth:1,fixed:true,highlight:false},
    fixed:true,highlight:false});
}
board.create('text',[ix+2*px,iy+4*px+0.25,'inputbildet'],{
  anchorX:'middle',fontSize:11,fixed:true
});
board.create('text',[ix+2*px,1.65,function(){
  for (var block=0;block<4;block++) for (var pos=0;pos<4;pos++) {
    var v=inputValue(block,pos);
    if (v<0 || v>1) return 'Fargeskala klippet: verdier utenfor [0,1]';
  }
  return 'Alle pikselverdier er i [0,1]';
}],{anchorX:'middle',fontSize:10,fixed:true});

board.create('arrow',[[5.75,6.55],[8.65,6.55]],{
  strokeColor:'#333333',strokeWidth:3,fixed:true,highlight:false
});
board.create('text',[7.20,6.92,'transformasjonen bruker dem'],{
  anchorX:'middle',fontSize:11,fixed:true
});

board.create('segment',[[5.75,3.05],[7.20,3.05]],{
  strokeColor:'#888888',strokeWidth:2,dash:2,fixed:true,highlight:false
});
board.create('text',[7.45,3.05,'×'],{
  anchorX:'middle',anchorY:'middle',fontSize:25,color:'#777777',fixed:true
});
board.create('text',[7.20,2.55,'sendes til null'],{
  anchorX:'middle',fontSize:11,color:'#666666',fixed:true
});

function outputBox(x0,y0,index) {
  board.create('polygon',
    [[x0,y0],[x0+1.35,y0],[x0+1.35,y0+1.35],[x0,y0+1.35]],{
      fillColor:controlFills[index],fillOpacity:0.88,
      vertices:{visible:false},
      borders:{strokeColor:'#ffffff',strokeWidth:2,
               fixed:true,highlight:false},
      fixed:true,highlight:false
    });
  board.create('text',[x0+0.675,y0+0.675,function(){
    return meanControls[index].Value().toFixed(2);
  }],{
    anchorX:'middle',anchorY:'middle',fontSize:14,
    cssStyle:'font-weight:600',fixed:true
  });
}

board.create('text',[11.35,7.75,'OUTPUT: 4 knapper'],{
  anchorX:'middle',fontSize:16,cssStyle:'font-weight:600',fixed:true
});
outputBox(10.0,5.75,0);
outputBox(11.35,5.75,1);
outputBox(10.0,4.40,2);
outputBox(11.35,4.40,3);
board.create('polygon',[[10.0,4.40],[12.70,4.40],[12.70,7.10],[10.0,7.10]],{
  fillOpacity:0,vertices:{visible:false},
  borders:{strokeColor:'#333333',strokeWidth:2,fixed:true,highlight:false},
  fixed:true,highlight:false
});

board.create('text',[11.35,3.35,'De fire outputverdiene kan stilles uavhengig.'],{
  anchorX:'middle',fontSize:12,fixed:true
});
board.create('text',[7.60,0.75,'Én uavhengig knapp = én retning'],{
  anchorX:'middle',fontSize:13,cssStyle:'font-weight:600',fixed:true
});
```

Å bevege én knapp mens de andre står stille, kaller vi å bevege oss i én
**retning**. De tolv grå knappene styrer kontrastmønstre som danner en basis
for nullrommet. De fire fargede knappene styrer fire inputmønstre som er
konstante i hver sin blokk. Disse fire mønstrene og de tolv kontrastene danner
til sammen en basis for inputrommet. Outputene til de fire konstante
mønstrene danner en basis for kolonnerommet. Til sammen har inputrommet
16 uavhengige retninger:

$$16=4+12.$$

For en matrise med $n$ kolonner sier **rang-nullitet** at

$$n=\operatorname{rank}(A)+\dim N(A).$$

Prosjektet skriver det samme med kjernen og det norske ordet rang:
$\dim(\ker A)+\operatorname{rang}(A)=n$.

**Svar på ukens spørsmål.** Blokkgjennomsnittet mister nøyaktig det som ligger i nullrommet: de tolv
kontrastene inne i blokkene. Det den beholder, telles av rangen: fire uavhengige blokkgjennomsnitt. Regnskapet
$16=4+12$ er fullstendig. Nulliteten 12 teller inputretninger som sendes til null, og rangen 4 teller
outputretninger som kan lages: to forskjellige typer retninger i to forskjellige rom, som til sammen gjør rede for
alle 16 inputdimensjonene. To inputer gir samme output akkurat når forskjellen deres ligger i nullrommet. Hvis
nullrommet bare inneholder nullvektoren, går ingenting tapt, og inputen kan finnes igjen fra outputen. Det er
dette du bruker i prosjektet når du skal finne et polynom igjen fra noen få avlesninger.

Vil du øve på rang og nullrom med papir og blyant? Se
[selvtesten i 3.8](#uke3-stotte-oppgaver).

## 3.5 Overfør ideene til polynomer {#uke3-del5}

Så langt har vektorene vært bilder eller tallkolonner. Nå bruker vi de kjente
begrepene på polynomer. Dette er overgangen til ukeprosjektet.

| I bildeeksemplet | For polynomer |
|---|---|
| Pikselverdier | Polynomkoeffisienter |
| Basisbilder | Basispolynomer |
| Samme bilde i to basiser | Samme polynom i to basiser |
| Matrisemåling $Ax$ | Avlesning av polynomverdier $E(p)$ |
| En usynlig bildeendring | Et polynom som er null i avlesningspunktene |
| Rekonstruksjon fra output | Reverse engineering fra polynomverdier |

I 3.3 så vi at et vektorrom ikke trenger å bestå av piler eller tallkolonner:
Objektene må kunne legges sammen og ganges med tall, med de vanlige
regnereglene. Polynomer er et viktig eksempel.

### Polynomer som vektorer

Vi begynner med polynomer av grad høyst 2. For et polynom som ikke er null,
er **graden** den høyeste potensen av $x$ som har en koeffisient forskjellig
fra null. Polynomet $3-x+x^2$ har for eksempel grad 2.

$$
\mathcal P_2=\{a+bx+cx^2:a,b,c\in\mathbb R\}.
$$

Dette er et vektorrom. Vektorene er nå polynomer, og vi regner ved å samle
ledd med samme potens av $x$. For eksempel, hvis

$$p(x)=1+2x,\qquad q(x)=3-x+x^2,$$

så er

$$
p+q=4+x+x^2,
\qquad
2p-q=(2+4x)-(3-x+x^2)=-1+5x-x^2.
$$

Et uttrykk som $2p-q$ er en **lineærkombinasjon** av $p$ og $q$, akkurat som
for bilder i 3.2: Vi ganger hvert polynom med et tall og legger resultatene
sammen.

### Fra polynom til tallkolonne

Hvert polynom i $\mathcal P_2$ kan bygges på nøyaktig én måte av de tre
polynomene

$$1,\qquad x,\qquad x^2.$$

For eksempel er

$$4-2x+3x^2=4\cdot1+(-2)\cdot x+3\cdot x^2.$$

Tallene foran byggesteinene samles i en koordinatvektor:

$$
4-2x+3x^2
\quad\longleftrightarrow\quad
\begin{bmatrix}4\\-2\\3\end{bmatrix}.
$$

Den ordnede samlingen $(1,x,x^2)$ kalles en **basis** for $\mathcal P_2$.
Fordi dette er det enkleste og vanligste valget, kalles den ofte
**standardbasisen**, **monomialbasisen** eller **potensbasisen**. De tre
navnene viser her til den samme ordnede listen. Ordet «standard» betyr ikke
at dette er den eneste mulige basisen.

Rekkefølgen bestemmer hvor tallene skal stå: konstantleddet øverst, deretter
koeffisienten til $x$, så koeffisienten til $x^2$. Hvis en potens mangler, er
koeffisienten null. Vi kan også gå motsatt vei: Koordinatvektoren forteller
hvilke tall som skal stå foran $1$, $x$ og $x^2$.

Øv på dette: [polynomregning og koordinater](#uke3-ov-polynomer).

### Hva gjør en samling til en basis?

Kravene er de samme som for bilder i 3.3: En basis **spenner ut** rommet
(ingen hull: hvert polynom er en lineærkombinasjon av basispolynomene) og er
**lineært uavhengig** (ingen overflødige byggesteiner). Samlingen $(1,x,x^2)$ er en basis for $\mathcal P_2$. Samlingen
$(1,x,1+x)$ er ikke en basis for $\mathcal P_2$: Den mangler en byggestein
for $x^2$, og dessuten er $1+x$ summen av de to første polynomene.

Slike påstander kan vi kontrollere med en matrise. Skriv hvert polynom som en
koeffisientkolonne i basisen $(1,x,x^2)$, og sett kolonnene ved siden av
hverandre:

$$\underbrace{\begin{bmatrix}1&0&1\\0&1&1\\0&0&0\end{bmatrix}}_{(1,\;x,\;1+x)}
\qquad
\underbrace{\begin{bmatrix}1&0&0\\1&1&0\\0&0&1\end{bmatrix}}_{(1+x,\;x,\;x^2)}.$$

Trappeform og pivoter repeteres i [3.7](#uke3-stotte-matriser).
Den første matrisen står allerede på trappeform. Den har to pivoter, så rangen
er 2: Tredje kolonne er overflødig ($1+x=1\cdot1+1\cdot x$), og nederste rad
er null, så ingen kombinasjon gir $x^2$. I den andre matrisen trekker vi rad 1
fra rad 2 og får

$$\begin{bmatrix}1&0&0\\0&1&0\\0&0&1\end{bmatrix}.$$

Det er tre pivoter, så rangen er 3. Kaller vi den andre matrisen $Q$, er
koeffisientkolonnen til kombinasjonen $b_1(1+x)+b_2x+b_3x^2$ nettopp $Qb$.
Kombinasjonen er **nullpolynomet** akkurat når $Qb=0$. Alle tre kolonnene har
en pivot, så systemet har ingen frie variabler, og $b=0$ er eneste løsning: De
tre polynomene er lineært uavhengige. Denne kontrollen kaller vi en
**rangtest**.

Rommet $\mathcal P_n$ har basisen $(1,x,\ldots,x^n)$ med $n+1$ polynomer, så
$\dim\mathcal P_n=n+1$. Tre uavhengige polynomer i $\mathcal P_2$, som har
dimensjon 3, danner derfor en basis.

Altså er også

$$\mathcal B=(1+x,\ x,\ x^2)$$

en basis for $\mathcal P_2$. Hvilke koordinater har $2-x+3x^2$ i denne
basisen? Vi søker $c_1,c_2,c_3$ med $c_1(1+x)+c_2x+c_3x^2=2-x+3x^2$. Venstre
side er $c_1+(c_1+c_2)x+c_3x^2$. Vi sammenligner koeffisientene til $1$, $x$
og $x^2$: $c_1=2$, $c_1+c_2=-1$ og $c_3=3$. Dermed er $c_2=-3$, og

$$2-x+3x^2=2(1+x)-3x+3x^2,\qquad [\,2-x+3x^2\,]_{\mathcal B}=\begin{bmatrix}2\\-3\\3\end{bmatrix}.$$

Samme polynom har altså koordinatene $(2,-1,3)$ i potensbasisen og
$(2,-3,3)$ i basisen $\mathcal B$.

Øv på dette: [rangtest, basis og koordinater](#uke3-ov-basis).

En samling polynomer der vi kan addere og multiplisere med tall uten å forlate samlingen, er et
**underrom** av $\mathcal P_n$, akkurat som nullrommet i 3.4. Mengden av alle
lineærkombinasjoner av noen polynomer, $\operatorname{Span}(p_1,\ldots,p_k)$,
er et slikt underrom. Øv på dette: [polynomunderrom](#uke3-ov-underrom).

### Polynomverdier som målinger

I bildeeksemplet var hver output en måling, og hver rad i $A$ sa hvilke
piksler målingen bruker. For et polynom er en naturlig måling å lese av
verdien i et punkt. Ta $p(x)=a_0+a_1x+a_2x^2$ og les av i $x=-1$, $0$ og $1$:

$$\begin{aligned}
p(-1)&=a_0-a_1+a_2,\\
p(0)&=a_0,\\
p(1)&=a_0+a_1+a_2.
\end{aligned}$$

Koeffisientene foran $a_0,a_1,a_2$ blir radene, akkurat som i 3.2:

$$\begin{bmatrix}p(-1)\\p(0)\\p(1)\end{bmatrix}
=\begin{bmatrix}1&-1&1\\1&0&0\\1&1&1\end{bmatrix}
\begin{bmatrix}a_0\\a_1\\a_2\end{bmatrix}.$$

Hver rad inneholder verdiene av $1,x,x^2$ i ett punkt. For $p(x)=4-2x+3x^2$ gir
produktet $[9,4,5]^T$. Kontroll: $p(-1)=4+2+3=9$, $p(0)=4$ og
$p(1)=4-2+3=5$. Avlesningen er en lineær **avbildning** $E$ fra
$\mathcal P_2$ til $\mathbb R^3$ (her står $E$ for avlesning, ikke for
pikselbildene $E_k$ fra 3.3): Definisjonsrommet er $\mathcal P_2$ og
verdirommet er $\mathbb R^3$. Å gå baklengs, fra de tre
verdiene til koeffisientene, er å løse dette systemet: reverse engineering
som i 3.3. Hva må rangen være for at det skal finnes nøyaktig én løsning? Det
spørsmålet møter du i prosjektet.

Øv på dette: [avlesningsmatriser og dimensjon](#uke3-ov-avlesning).

Polynomrom krever altså ingen ny type lineær algebra. Vi bruker de samme
begrepene som for tallkolonner: lineærkombinasjon, spenn, lineær uavhengighet,
basis, koordinater og rang.

I prosjektet [Polynomer i blindsonen](project_week3.qmd) går vi videre fra koeffisienter til
målinger. Vi får verdiene $p(x_0),\ldots,p(x_n)$ og gjør reverse engineering:
Hvilke koeffisienter kan ha produsert disse verdiene? Bildeeksemplene har
allerede gitt oss de sentrale spørsmålene: Hvilken basis bruker vi, hvilken
informasjon mister målingen, og kan små endringer være nesten usynlige?
Del 2 og finalen i prosjektet handler også om avrundingsfeil og kansellering;
disse temaene kan du repetere i [uke 1](page2.qmd#uke1-kansellering).

## 3.6 Egenarbeid: bildeforsøk og polynomoppgaver {#uke3-del4}

Denne delen er egenarbeid. Nå går vi tilbake til
bildetransformasjonen fra 3.1–3.4, og du skal selv konstruere, teste og
forklare transformasjoner. Oppgavene om polynomer fra 3.5 står
[til slutt i denne delen](#uke3-ovinger).

Hjelpefunksjonene, transformasjonen og mønsterbildene fra de foregående
delene er tilgjengelige under. Her skal du endre kode og lete etter mønstre
selv.

Aktivitet **A** og oppgavene i [Øv på polynomer](#uke3-ovinger) anbefales: A
øver på nullromssteget i prosjektets del 1, og oppgavene øver på rangtesten og
avlesningsmatrisene. Aktivitet **B–E** er valgfrie; E er en numerisk
fordypning. For hvert
valgt eksperiment arbeider du i denne rekkefølgen:

1. Gjett først hva figuren eller outputen vil vise.
2. Kjør eksperimentet og beskriv det du faktisk ser.
3. Kontroller observasjonen med et tall, for eksempel en residual
   ([uke 2](page4.qmd#feil-residual-og-toleranse)) eller en rang.
4. Forklar til slutt observasjonen med begrepene fra uka.

Startcellene tar seg av figurer og utskrifter, men gir ikke ferdige svar. Et forsøk som ikke virker ved første kjøring, kan også være nyttig: Undersøk forskjellen mellom det du forventet og det koden faktisk produserte.

### Anbefalt A: Lag et nytt mønster med output null

Endre `Z`. Hver $2\times2$-blokk skal ha gjennomsnitt null, men bruk ikke sjakkmønsteret uendret. Før du kjører cellen, regn ut minst ett blokkgjennomsnitt for hånd. Figuren viser om mønsteret forsvinner, mens normen under figuren måler outputens avstand fra nullbildet.

```{pyodide-python}
#| label: week3-activity-a

# Dette er startforslaget, ikke et fasitsvar. Endre minst to av tallene,
# men pass på at hver 2 x 2-blokk fortsatt har sum null.
Z=np.array([
    [ 1.,-1., 0., 0.],
    [ 0., 0., 0., 0.],
    [ 0., 0., 1.,-1.],
    [ 0., 0., 0., 0.]
])
show_images([Z,average_pool(Z)],["Mitt mønster","Output"],
            cols=2,cmap="coolwarm",vmin=-1,vmax=1)
print("||A z|| =",np.linalg.norm(A_pool@Z.reshape(-1)))
```

Legg deretter en liten versjon av mønsteret til et vanlig bilde. Velg størrelsen slik at pikselverdiene fortsatt ligger mellom 0 og 1. Vis originalbildet, det endrede bildet og begge outputene. Forklar både hvorfor inputbildene er forskjellige og hvorfor transformasjonen ikke kan skille dem.

### Valgfri B: Hva kan tre byggesteiner lage?

Velg tre mønsterbilder og generer åtte tilfeldige lineærkombinasjoner. Se etter en egenskap som går igjen i alle bildene: finnes det for eksempel en symmetri, en fast sum eller en type kontrast som aldri opptrer? Bytt deretter ut én byggestein og se hvilken ny variasjon som blir mulig.

```{pyodide-python}
#| label: week3-activity-b

M,H,V,D=pattern_basis   # henter mønstrene fra 3.3 på nytt
rng=np.random.default_rng(10)
# Studentvalg: Bytt byggesteiner her. Tre byggesteiner kan høyst gi tre
# uavhengige retninger i rommet av alle 2 x 2-bilder.
my_building_blocks=[M,H,V]
my_images=[]
for _ in range(8):
    # Nye koeffisienter, men de samme tre byggesteinene, i hvert forsøk.
    c=rng.uniform(-1,1,size=3)
    my_images.append(sum(value*block for value,block
                         in zip(c,my_building_blocks)))
show_images(my_images,[""]*8,cols=4,cmap="coolwarm",vmin=-2,vmax=2)
```

Forsøk å lage et konkret $2\times2$-målbilde som de tre byggesteinene ikke kan treffe. Dette er den eksperimentelle siden av dimensjon: tre uavhengige justeringsmuligheter kan ikke styre fire uavhengige pikselverdier.

### Valgfri C: Lag en annen basis

Cellen starter med pikselbasisen som byggesteiner. Bytt ut minst to av bildene. Prøv gjerne først et valg der ett bilde kan bygges av de andre. Observer hva rangen blir og om likningssystemet kan løses. Endre deretter byggesteinene til rangen blir 4; da skal fire koeffisienter kunne styre de fire pikselverdiene uavhengig.

```{pyodide-python}
#| label: week3-activity-c

# Studentvalg: Endre B1, ..., B4 før resten av cellen kjøres.
B1,B2,B3,B4=E1.copy(),E2.copy(),E3.copy(),E4.copy()
my_basis=[B1,B2,B3,B4]
# Q har én foreslått basisvektor i hver kolonne.
Q=np.column_stack([B.reshape(-1) for B in my_basis])
show_images(my_basis,["$B_1$","$B_2$","$B_3$","$B_4$"],
            cols=4,cmap="coolwarm",vmin=-1,vmax=1)
print("Rang:",np.linalg.matrix_rank(Q))

target=rng.uniform(-1,1,size=(2,2))
if np.linalg.matrix_rank(Q)==4:
    # Reverse engineering: finn koordinatene til et tilfeldig målbilde.
    coordinates=np.linalg.solve(Q,target.reshape(-1))
    reconstruction=(Q@coordinates).reshape(2,2)
    show_images([target,reconstruction],["Målbilde","Rekonstruksjon"],
                cols=2,cmap="coolwarm",vmin=-1,vmax=1)
else:
    print("Byggesteinene er avhengige. Endre dem og prøv igjen.")
```

### Valgfri D: Design en ny bildereduksjon

Lag en lineær transformasjon fra 16 inputpiksler til høyst 6 outputverdier. Hver rad i `A_new` er én måling av bildet. Tegn først hvilke piksler målingen skal bruke, og sett så inn de tilsvarende vektene i raden. Mulige ideer er radgjennomsnitt, kolonnegjennomsnitt, diagonalsummer eller utvalgte piksler.

```{pyodide-python}
#| label: week3-activity-d

# Fire rader betyr fire målinger. Endre også antallet rader dersom
# transformasjonen din skal ha et annet antall outputverdier.
A_new=np.zeros((4,16))

# TODO: Sett inn vekter. Rad i beskriver nøyaktig hvordan output i beregnes.

test_image=rng.random((4,4))
# reshape(-1) gjør testbildet til inputvektoren som A_new forventer.
test_output=A_new@test_image.reshape(-1)
show_images([test_image],["Testbilde"],cols=1,vmin=0,vmax=1)
print("Output:",test_output)
print("Rang:",np.linalg.matrix_rank(A_new))
print("Nullitet:",16-np.linalg.matrix_rank(A_new))
```

Test flere bilder med tydelig struktur, ikke bare det tilfeldige bildet. Finn deretter et ikke-null bilde som transformasjonen sender til null. Vis dette bildet og outputen ved siden av hverandre. Forklar hva hver rad i matrisen måler, og hvilke bildeendringer som derfor ikke registreres.

### Valgfri fordypning E: Nesten samme måling

To målinger kan være matematisk forskjellige, men så like at maskinen får problemer med å skille dem. Vi begynner med å tegne vektene i de to målingene. Den første summerer alle piksler likt. Den andre gir bare den siste pikselen en ørliten ekstra vekt.

```{pyodide-python}
#| label: week3-nearly-same-measurements-picture
#| autorun: true

def nearly_redundant_measurements(eps,dtype=float):
    """To nesten like målinger lagret med valgt tallpresisjon."""
    first=np.ones(16)
    # Bare vekten til siste piksel skiller rad 2 fra rad 1.
    second=first.copy(); second[-1]+=eps
    return np.vstack([first,second]).astype(dtype)

eps_picture=0.05
A_picture=nearly_redundant_measurements(eps_picture)
show_images([A_picture[0].reshape(4,4),
             A_picture[1].reshape(4,4),
             (A_picture[1]-A_picture[0]).reshape(4,4)],
            ["Måling 1","Måling 2","Forskjellen"],
            cols=3,cmap="coolwarm",vmin=-0.05,vmax=1.05,
            figsize=(5.4,1.8))
```

Forskjellsbildet har bare én ikke-null piksel. Gjør nå denne forskjellen mindre ved å endre `eps`, og sammenlign hva som skjer når tallene lagres som `float64` og `float32`.

```{pyodide-python}
#| label: week3-nearly-same-measurements-rank

# Gjør forskjellen 10 000 ganger mindre for hver runde og sammenlign hvor
# lenge de to tallformatene klarer å skille radene.
for exponent in [2,6,10,14,18]:
    eps=10.0**(-exponent)
    A64=nearly_redundant_measurements(eps,np.float64)
    A32=nearly_redundant_measurements(eps,np.float32)
    print(f"eps={eps:.0e}",
          "rang float64 =",np.linalg.matrix_rank(A64),
          "rang float32 =",np.linalg.matrix_rank(A32))
```

På papiret er målingene uavhengige for enhver $\varepsilon\neq0$: den lille ekstravekten kan ikke lages ved bare å skalere den første raden. I maskinen kan ekstravekten bli avrundet bort, eller bli vurdert som for liten til å være pålitelig. `matrix_rank` bruker derfor en toleranse og rapporterer en **numerisk rang**. Beskriv når de to tallformatene slutter å skille målingene, og knytt resultatet til flyttallene fra [uke 1](page2.qmd) og toleransebegrepet fra [uke 2](page4.qmd#feil-residual-og-toleranse).

Trenger du en repetisjon av eksakt og numerisk rang, kan du åpne boksen
«Eksakt og numerisk rang» i [3.7](#uke3-stotte-matriser). I prosjektets del 3
møter du samme idé: en endring som avlesningene nesten ikke ser.

### Øv på polynomer

::: {#uke3-ovinger}
:::

Oppgavene øver på 3.5. Arbeid på papir først og skriv svarene eksakt, for
eksempel `1/3` og ikke `0.333`.

#### Polynomer som vektorer

::: {#uke3-ov-polynomer}
:::

Bruk de samme polynomene som i 3.5, $p(x)=1+2x$ og $q(x)=3-x+x^2$, men en
annen lineærkombinasjon.

```{math-exercise}
#| label: week3-polynomial-arithmetic
#| caption: Regn med polynomer
#| vars: x
#| mode: equivalent
#| partial-credit: true
#| field-labels: 3p + q, p − 2q

Regn ut og samle ledd med samme potens:

$(3p+q)(x)=$ __[6+5*x+x^2]

$(p-2q)(x)=$ __[-5+4*x-2*x^2]
```

Leddene i polynomet under står ikke i samme rekkefølge som basisen
$(1,x,x^2)$. Pass på hvor hvert tall skal stå.

```{math-exercise}
#| label: week3-polynomial-coefficients
#| caption: Les av koeffisientene
#| mode: equivalent
#| partial-credit: true
#| field-labels: konstantledd, koeffisient til x, koeffisient til x²

Skriv koordinatvektoren til $u(x)=2x^2-5$ i basisen $(1,x,x^2)$:

$[u]_{(1,x,x^2)}=$ vec[-5,0,2]
```

Et polynom $r$ har koordinatvektoren
$[r]_{(1,x,x^2)}=\begin{bmatrix}-1\\2\\3\end{bmatrix}$.

```{math-exercise}
#| label: week3-polynomial-from-coordinates
#| caption: Bygg polynomet fra koordinatene
#| vars: x
#| mode: equivalent
#| field-labels: r(x)

Skriv polynomet:

$r(x)=$ __[-1+2*x+3*x^2]
```

#### Rangtest, basis og koordinater

::: {#uke3-ov-basis}
:::

Polynomene $1+x$, $x+x^2$ og $1-x^2$ ligger i $\mathcal P_2$. Skriv dem som
kolonner i en koeffisientmatrise og radreduser.

```{math-exercise}
#| label: week3-polynomial-rank-test
#| caption: Rangtest for tre polynomer
#| mode: equivalent
#| partial-credit: true
#| field-labels: rangen til koeffisientmatrisen, c₁, c₂

Rangen til koeffisientmatrisen er _[2].

Skriv det tredje polynomet som en kombinasjon av de to første,
$1-x^2=c_1(1+x)+c_2(x+x^2)$:

$c_1=$ _[1] $\qquad c_2=$ _[-1]
```

Bruk basisen $\mathcal B=(1+x,x,x^2)$ og samme framgangsmåte som for
$2-x+3x^2$ i 3.5: Sammenlign koeffisientene til $1$, $x$ og $x^2$.

```{math-exercise}
#| label: week3-polynomial-simple-change-basis
#| caption: Koordinater i en annen basis
#| mode: equivalent
#| partial-credit: true
#| field-labels: koordinat til 1+x, koordinat til x, koordinat til x²

Finn koordinatvektoren til $s(x)=5+2x-x^2$ i basisen $\mathcal B$:

$[s]_{\mathcal B}=$ vec[5,-3,-1]
```

Når basisen skifter, skifter koordinatene, selv om polynomet er det samme. I
$\mathcal P_2$ bruker vi nå basisen $\mathcal C=(p_1,p_2,p_3)$, der

$$
p_1=x^2-2,\qquad
p_2=-x^2+x+2,\qquad
p_3=3x^2+x-5.
$$

Å finne $[q]_{\mathcal C}$ betyr å finne tall $c_1,c_2,c_3$ slik at
$q=c_1p_1+c_2p_2+c_3p_3$. Sammenligner vi koeffisientene til $1$, $x$ og
$x^2$ på begge sider, får vi et vanlig lineært likningssystem for
$c_1,c_2,c_3$.

```{math-exercise}
#| label: week3-polynomial-coordinates
#| caption: Koordinater i en polynombasis
#| mode: equivalent
#| partial-credit: true
#| field-labels: c₁, c₂, c₃

Finn koordinatvektoren til $q(x)=4x^2+x-7$ i basisen $\mathcal C$:

$[q]_{\mathcal C}=$ mat[1;0;1]
```

:::: {#week3-polynomial-basis-context .math-exercise-context}

Et polynom i $\mathcal P_3$ skrives som
$a_0+a_1x+a_2x^2+a_3x^3$. I en koeffisientmatrise representerer hver kolonne
ett polynom. Radene inneholder koeffisientene til henholdsvis
$1,x,x^2,x^3$.

En basis består av polynomer som er lineært uavhengige og som spenner ut hele
det etterspurte rommet. Basisvektorene kan stå i hvilken som helst rekkefølge.
Røde kolonner er null eller ligger utenfor rommet. Hvis de gyldige kolonnene
er lineært avhengige, farges hele familien gul. En grønn familie er gyldig og
uavhengig, men kan fortsatt være for liten til å spenne ut hele rommet.

::::

I rommet

$$
\mathcal P_3=\{a_0+a_1x+a_2x^2+a_3x^3:a_i\in\mathbb R\}
$$

kan vi bruke andre basispolynomer enn $1,x,x^2,x^3$. I svarmatrisen under er
hver kolonne ett polynom. Du bestemmer selv hvor mange kolonner som trengs.

```{math-exercise}
#| label: week3-polynomial-p3-basis
#| caption: En valgfri basis for P₃
#| mode: custom
#| context: week3-polynomial-basis-context
#| checker: |
#|   def check(response, symbols):
#|       A = response["inputs"]["P3basis"]["matrix"]
#|       result = assess_basis(
#|           A,
#|           axis="columns",
#|           target_dimension=4,
#|           belongs=lambda vector: vector.rows == 4,
#|           name="P3basis",
#|           space_name="P3",
#|       )
#|       statuses = result["assessment"]["P3basis"]["columns"]
#|       if result["score"] < 1:
#|           if "incorrect" in statuses:
#|               result["feedback"] = "En rød kolonne er null og kan ikke være en basisvektor."
#|           elif "dependent" in statuses:
#|               result["feedback"] = "De gule polynomene er lineært avhengige. Behold en uavhengig del og juster familien videre."
#|           elif statuses:
#|               result["feedback"] = "De grønne polynomene er uavhengige, men de spenner ennå ikke ut hele P3."
#|           else:
#|               result["feedback"] = "Legg inn polynomer som kolonner i koeffisientmatrisen."
#|       return result

Finn en basis for $\mathcal P_3$. Oppgi ett polynom per kolonne. Radene er
koeffisientene til henholdsvis $1,x,x^2,x^3$:

$A=$ mat{name=P3basis, rows=4, cols=auto, initial-cols=2, min-cols=0, max-cols=5}
```

#### Polynomunderrom

::: {#uke3-ov-underrom}
:::

Vi begynner med noen polynomer og undersøker alle lineærkombinasjonene de kan
lage. La

$$
\begin{aligned}
p_1&=1+x, & p_2&=x+x^2,\\
p_3&=1+x^2+x^3, & p_4&=2-x-x^2+x^3.
\end{aligned}
$$

Notasjonen $\operatorname{Span}$ betyr «alle lineærkombinasjoner». Mengden
$U=\operatorname{Span}(p_1,p_2,p_3,p_4)$ består derfor av alle polynomer som kan
bygges av $p_1,p_2,p_3,p_4$. Dette er et underrom av $\mathcal P_3$, og det
inneholder nullpolynomet. En basis for $U$ kan bestå av noen av polynomene
over, eller av andre polynomer som spenner ut nøyaktig det samme rommet.

```{math-exercise}
#| label: week3-polynomial-subspace-basis
#| caption: Basis for et polynomunderrom
#| mode: custom
#| context: week3-polynomial-basis-context
#| checker: |
#|   def check(response, symbols):
#|       A = response["inputs"]["Ubasis"]["matrix"]
#|       T = Matrix([
#|           [1, 0, 1],
#|           [1, 1, 0],
#|           [0, 1, 1],
#|           [0, 0, 1],
#|       ])
#|       target_rank = T.rank()
#|       result = assess_basis(
#|           A,
#|           axis="columns",
#|           target_dimension=target_rank,
#|           belongs=lambda vector: vector.rows == 4 and T.row_join(vector).rank() == target_rank,
#|           name="Ubasis",
#|           space_name="U",
#|       )
#|       statuses = result["assessment"]["Ubasis"]["columns"]
#|       if result["score"] < 1:
#|           if "incorrect" in statuses:
#|               result["feedback"] = "En rød kolonne er null eller representerer et polynom utenfor U."
#|           elif "dependent" in statuses:
#|               result["feedback"] = "De gule polynomene ligger i U, men familien er lineært avhengig. Behold en uavhengig del og juster familien videre."
#|           elif statuses:
#|               result["feedback"] = "De grønne polynomene ligger i U og er uavhengige, men de spenner ennå ikke ut hele U."
#|           else:
#|               result["feedback"] = "Legg inn basispolynomer som kolonner i koeffisientmatrisen."
#|       return result

Finn en basis for $U$. Oppgi ett polynom per kolonne, med koeffisientene til
$1,x,x^2,x^3$ ovenfra og ned:

$B_U=$ mat{name=Ubasis, rows=4, cols=auto, initial-cols=2, min-cols=0, max-cols=5}
```

#### Avlesningsmatriser og dimensjon

::: {#uke3-ov-avlesning}
:::

Et polynom $p(x)=a_0+a_1x+a_2x^2$ i $\mathcal P_2$ leses av i bare to punkter,
$x=1$ og $x=2$. Avlesningen gir $E(p)=\begin{bmatrix}p(1)\\p(2)\end{bmatrix}$.
Skriv avlesningsmatrisen $A$ slik at $E(p)=A\begin{bmatrix}a_0\\a_1\\a_2\end{bmatrix}$,
og bruk rang–nullitet.

```{math-exercise}
#| label: week3-evaluation-two-points
#| caption: Avlesning i to punkter
#| mode: equivalent
#| partial-credit: true
#| field-labels: a₁₁, a₁₂, a₁₃, a₂₁, a₂₂, a₂₃, rangen til A, dimensjonen til nullrommet

$A=$ mat[1,1,1;1,2,4]

Rangen til $A$ er _[2], og nullrommet har dimensjon _[1].
```

Dimensjonen til et polynomrom er antallet polynomer i en basis. La
$U=\{a_0+a_2x^2+a_4x^4\}$ være polynomene i $\mathcal P_4$ som bare har
partallspotenser.

```{math-exercise}
#| label: week3-polynomial-dimension
#| caption: Dimensjonen til et polynomrom
#| mode: equivalent
#| partial-credit: true
#| field-labels: dimensjonen til P₄, dimensjonen til U

$\dim\mathcal P_4=$ _[5]

$\dim U=$ _[3]
```

## 3.7 Støtteløp: Matriseregning ved behov {#uke3-stotte-matriser}

Denne delen repeterer radreduksjon fra Matematikk 1: radoperasjoner,
likningssystemer og Gauss-eliminasjon. Den er med slik at du ikke trenger å
finne fram gamle notater. Det er en stund siden, så vi forventer ikke at
framgangsmåten sitter friskt. Regningen vises steg for steg og kobles til
ordene vi bruker nå: pivot, rang, kolonnerom og nullrom. Kan du allerede
radredusere en matrise, finne pivotkolonner og beregne en basis for
nullrommet, kan du nøye deg med å åpne underdelen du vil slå opp.

Bruk spørsmålene som en rask selvtest:

1. Kan du radredusere en matrise og finne pivotkolonnene?
2. Vet du hvorfor en kolonneromsbasis hentes fra den opprinnelige matrisen?
3. Kan du skrive løsningene av $Ax=0$ ved hjelp av frie variabler?
4. Kan du finne en basis for nullrommet og kontrollere rang–nullitet?
5. Kan du avgjøre om $Ax=b$ har en løsning?

Hvis svaret er ja på alle fem, kan du gå til papir- og kontrolloppgavene i
3.8 dersom du ønsker ekstra trening, eller avslutte siden her.

Bildene i hovedløpet gjorde begrepene synlige. I støtteløpet legger vi bort
bildebakgrunnen og regner direkte med én matrise. Målet er å repetere hvordan
vi finner rang, basis for kolonnerommet og basis for nullrommet — først med
papir og blyant, deretter med kode som kontroll.

Vi bruker samme matrise gjennom hele eksemplet:

$$
A=
\begin{bmatrix}
1&2&0&1\\
0&1&1&1\\
1&3&1&2
\end{bmatrix}.
$$

Matrisen har fire kolonner og tre rader, og beskriver derfor transformasjonen

$$
A:\underbrace{\mathbb R^4}_{\text{inputrom}}
\longrightarrow
\underbrace{\mathbb R^3}_{\text{outputrom}}.
$$

Nullrommet består av 4-vektorer og ligger i inputrommet: $N(A)\subseteq\mathbb R^4$. Kolonnerommet består av 3-vektorer og ligger i outputrommet: $\operatorname{Col}(A)\subseteq\mathbb R^3$. Vi vil svare på tre spørsmål:

1. Hvor mange uavhengige outputretninger har transformasjonen?
2. Hvilke inputretninger gir output null?
3. Kan en gitt vektor $b$ produseres som $Ax$?

Vi bruker de samme fargene gjennom hele regningen:

| Farge | I eliminasjonen | Senere i regningen |
|---|---|---|
| 🟦 Blå | første pivot, kolonne 1 | basisvektor $a_1$ og pivotvariabel $x_1$ |
| 🟧 Oransje | andre pivot, kolonne 2 | basisvektor $a_2$ og pivotvariabel $x_2$ |
| 🟩 Grønn | kolonne uten pivot | fri variabel $x_3=s$ og første nullromsretning |
| 🟪 Lilla | kolonne uten pivot | fri variabel $x_4=t$ og andre nullromsretning |

```{pyodide-python}
#| label: week3-pure-matrix-setup
#| autorun: true

# Denne matrisen er felles eksempel i hele 3.7. Rad 3 er summen av de to
# første radene, noe eliminasjonen snart skal avdekke.
A=np.array([
    [1.,2.,0.,1.],
    [0.,1.,1.,1.],
    [1.,3.,1.,2.]
])
print(A)
```

:::: {.callout-note collapse="true"}
### Eliminasjon og rang

::: {.callout-tip}
#### Først på papir

Trekk første rad fra tredje rad. Sammenlign deretter den nye tredje raden med andre rad, og eliminer én gang til. Marker den første ikke-null-oppføringen i hver ikke-null-rad.
:::

Regningen blir

$$
\begin{bmatrix}
1&2&0&1\\
0&1&1&1\\
1&3&1&2
\end{bmatrix}
\longrightarrow
\begin{bmatrix}
1&2&0&1\\
0&1&1&1\\
0&1&1&1
\end{bmatrix}
\longrightarrow
\begin{bmatrix}
\color{#277da1}{\boxed{1}}&2&0&1\\
0&\color{#d98900}{\boxed{1}}&1&1\\
0&0&0&0
\end{bmatrix}.
$$

Den siste raden er null og inneholder derfor ingen ny likning. To ikke-null-rader er igjen, og de ledende oppføringene — **pivotene** — ligger i kolonne 1 og 2. Dermed er rangen 2.

Koden under utfører vanlig framovereliminasjon. Den går fra venstre mot høyre og bruker den første tilgjengelige ikke-null-oppføringen som pivot. Dette er tilstrekkelig for eksemplene våre og følger papirregningen tett.

```{pyodide-python}
#| label: week3-row-echelon-function
#| autorun: true

def row_echelon(A,tol=1e-12,show_steps=False):
    """Returner trappeform og indeksene til pivotkolonnene."""
    # copy=True er viktig: Vi vil radredusere R uten å endre originalen A.
    R=np.array(A,dtype=float,copy=True)
    rows,cols=R.shape
    pivot_row=0
    pivot_columns=[]

    for col in range(cols):
        # Gå fra venstre mot høyre og finn én pivot om gangen.
        if pivot_row==rows:
            break

        # Finn den første brukbare pivoten, ikke den største.
        candidate=None
        for row in range(pivot_row,rows):
            if abs(R[row,col])>tol:
                candidate=row
                break

        if candidate is None:
            continue

        if candidate!=pivot_row:
            R[[pivot_row,candidate]]=R[[candidate,pivot_row]]
            if show_steps:
                print(f"Bytt rad {pivot_row+1} og {candidate+1}:\n",R)

        for row in range(pivot_row+1,rows):
            # Trekk et multiplum av pivotraden fra raden under, akkurat som
            # ved Gauss-eliminasjon på papir.
            factor=R[row,col]/R[pivot_row,col]
            if abs(factor)>tol:
                R[row]-=factor*R[pivot_row]

        # Små avrundingsrester behandles som null, styrt av tol.
        R[np.abs(R)<=tol]=0.0
        pivot_columns.append(col)
        pivot_row+=1
        if show_steps:
            print(f"Etter pivot i kolonne {col+1}:\n",R)

    return R,pivot_columns

R,pivot_columns=row_echelon(A,show_steps=True)
print("Trappeform:\n",R)
print("Pivotkolonner, nummerert fra 1:",[j+1 for j in pivot_columns])
print("Rang fra eliminasjon:",len(pivot_columns))
print("Kontroll med NumPy:",np.linalg.matrix_rank(A))
```

`matrix_rank` er nyttig som kontroll, men eliminasjonen viser *hvorfor* rangen er 2. Mer robuste eliminasjonsalgoritmer kan bytte om rader og eventuelt kolonner for å unngå dårlige pivoter. Det ser vi ikke på her. Senere skal vi se at numerisk rang alltid avhenger av hva som regnes som «tilstrekkelig nær null».

::::

:::: {.callout-note collapse="true"}
### Basis for kolonnerommet

Pivotene forteller hvilke opprinnelige kolonner som tilfører en ny outputretning. Vi henter derfor kolonne 1 og 2 fra den opprinnelige matrisen:

$$
\color{#277da1}{a_1=\begin{bmatrix}1\\0\\1\end{bmatrix}},
\qquad
\color{#d98900}{a_2=\begin{bmatrix}2\\1\\3\end{bmatrix}}.
$$

::: {.callout-warning}
#### En vanlig feil

Pivotposisjonene finnes ved å radredusere, men basisvektorene hentes fra den **opprinnelige** matrisen. Radoperasjoner endrer kolonnene.
:::

De to andre kolonnene kan bygges av disse:

$$
a_3=a_2-2a_1,
\qquad
a_4=a_2-a_1.
$$

Kontroller begge relasjonene før du kjører cellen.

```{pyodide-python}
#| label: week3-column-space-basis
#| autorun: true

# Pivotindeksene ble funnet fra trappeformen, men selve basisvektorene må
# hentes som kolonner fra den opprinnelige matrisen A.
column_basis=A[:,pivot_columns]
a1,a2,a3,a4=[A[:,j] for j in range(4)]

print("Basisvektorer som kolonner:\n",column_basis)
print("Feil i a3 = a2 - 2*a1:",np.linalg.norm(a3-(a2-2*a1)))
print("Feil i a4 = a2 - a1:  ",np.linalg.norm(a4-(a2-a1)))
print("Rang av basisvektorene:",np.linalg.matrix_rank(column_basis))
```

Kolonne 1 og 2 er uavhengige og bygger alle kolonnene i $A$. De danner derfor en basis for kolonnerommet, som har dimensjon 2.

::::

:::: {.callout-note collapse="true"}
### Basis for nullrommet

Nullrommet finnes ved å løse det homogene systemet $Ax=0$. Trappeformen gir

$$
\begin{aligned}
x_1+2x_2+x_4&=0,\\
x_2+x_3+x_4&=0.
\end{aligned}
$$

Pivotvariablene er $\color{#277da1}{x_1}$ og $\color{#d98900}{x_2}$. Variablene $\color{#4f8f49}{x_3}$ og $\color{#8b5aa7}{x_4}$ er frie. Sett

$$\color{#4f8f49}{x_3=s},\qquad \color{#8b5aa7}{x_4=t}.$$

::: {.callout-tip}
#### Fortsett på papir

Løs den andre likningen for $x_2$, og bruk resultatet i den første likningen. Samle deretter alle ledd som inneholder $s$, og alle ledd som inneholder $t$.
:::

Resultatet er

$$
x=
\color{#4f8f49}{s\begin{bmatrix}2\\-1\\1\\0\end{bmatrix}}
+\color{#8b5aa7}{t\begin{bmatrix}1\\-1\\0\\1\end{bmatrix}}.
$$

Dermed er de to viste vektorene en basis for nullrommet. Koden kontrollerer både at de gir output null, og at en tilfeldig lineærkombinasjon fortsatt gjør det.

```{pyodide-python}
#| label: week3-null-space-basis-matrix
#| autorun: true

# z1 og z2 kommer fra håndregningen. Z_A samler dem som kolonner slik at
# A @ Z_A kontrollerer begge nullromslikningene samtidig.
z1=np.array([2.,-1.,1.,0.])
z2=np.array([1.,-1.,0.,1.])
Z_A=np.column_stack([z1,z2])

print("A ganger nullromsbasisen:\n",A@Z_A)
print("Rang av basisvektorene:",np.linalg.matrix_rank(Z_A))

rng=np.random.default_rng(31)
s,t=rng.normal(size=2)
# Hvis z1 og z2 ligger i nullrommet, gjør enhver kombinasjon det samme.
z=s*z1+t*z2
print("Tilfeldige koeffisienter:",s,t)
print("||A z|| =",np.linalg.norm(A@z))
```

I dette eksemplet har både kolonnerommet og nullrommet dimensjon 2. Det betyr ikke at de er samme rom: Kolonneromsbasisen består av 3-vektorer i outputrommet, mens nullromsbasisen består av 4-vektorer i inputrommet. At dimensjonene tilfeldigvis er like her, skyldes at $4=2+2$.

::::

:::: {.callout-note collapse="true"}
### Rang–nullitet som regnskap

Matrisen har fire kolonner, altså fire inputvariabler. Eliminasjonen ga to pivotvariabler og to frie variabler:

$$
\underbrace{4}_{\text{inputdimensjon}}
=
\underbrace{
\color{#277da1}{1}+\color{#d98900}{1}
}_{\text{rang}=2}
+
\underbrace{
\color{#4f8f49}{1}+\color{#8b5aa7}{1}
}_{\text{nullitet}=2}.
$$

Rangen kommer fra de to pivotene. Nulliteten kommer **uavhengig** fra nullromsberegningen: Vi fant en basis med to vektorer. Først nå bruker vi disse to resultatene til å kontrollere rang–nullitet.

```{pyodide-python}
#| label: week3-rank-nullity-check

# Antall pivotkolonner gir rang; antall kolonner i nullromsbasisen gir
# nullitet. A.shape[1] er inputdimensjonen n.
rank_A=len(pivot_columns)
nullity_A=Z_A.shape[1]
print(f"{A.shape[1]} = {rank_A} + {nullity_A}")
print("Stemmer rang–nullitet?",A.shape[1]==rank_A+nullity_A)
```

::::

:::: {.callout-note collapse="true"}
### Kan en bestemt output produseres?

Siden $a_1$ og $a_2$ er en basis for kolonnerommet, kan alle mulige outputvektorer bygges av disse to. La $\alpha$ og $\beta$ være to fritt valgte tall. De bestemmer hvor mye av henholdsvis $a_1$ og $a_2$ vi bruker:

$$
\color{#277da1}{\alpha a_1}+\color{#d98900}{\beta a_2}
=
\begin{bmatrix}
\alpha+2\beta\\\beta\\\alpha+3\beta
\end{bmatrix}.
$$

Uansett hvilke tall vi velger for $\alpha$ og $\beta$, er tredje komponent summen av de to første. Vi tester derfor to ønskede outputvektorer:

$$
b=\begin{bmatrix}2\\-1\\1\end{bmatrix},
\qquad
d=\begin{bmatrix}2\\-1\\4\end{bmatrix}.
$$

Vektoren $b$ oppfyller $b_3=b_1+b_2$, mens $d$ ikke gjør det. Den utvidede matrisen $[A\mid b]$ får derfor samme rang som $A$, men $[A\mid d]$ får én ekstra pivot.

```{pyodide-python}
#| label: week3-reachable-outputs
#| autorun: true

b=np.array([2.,-1.,1.])
d=np.array([2.,-1.,4.])

def augmented_rank(A,rhs):
    """Rang av den utvidede matrisen [A | rhs]."""
    # rhs legges til som siste kolonne, ikke som ny rad.
    return np.linalg.matrix_rank(np.column_stack([A,rhs]))

print("rang(A)       =",np.linalg.matrix_rank(A))
print("rang([A | b]) =",augmented_rank(A,b))
print("rang([A | d]) =",augmented_rank(A,d))
```

Dermed gjelder kriteriet

$$
Ax=b\text{ har løsning}
\quad\Longleftrightarrow\quad
\operatorname{rank}(A)=\operatorname{rank}([A\mid b]).
$$

Hva gjør vi når en ønsket output som $d$ ikke kan produseres nøyaktig? Det spørsmålet leder direkte til projeksjon og minste kvadraters metode i [uke 4](uke4.qmd#uke4-mk).

::::

:::: {.callout-note collapse="true"}
### Forskjellige inputer, samme output

Velg en input $x_0$ og beregn $y=Ax_0$. Hvis $z$ ligger i nullrommet, gir $x_0+z$ samme output:

$$A(x_0+z)=Ax_0+Az=Ax_0.$$

Cellen under lager en hel familie av forskjellige inputvektorer med samme output.

```{pyodide-python}
#| label: week3-same-output-pure-matrix
#| autorun: true

# Start med én input x0 og dens output y.
x0=np.array([1.,2.,0.,-1.])
y=A@x0

# z1 ligger i nullrommet. Derfor skal x0 + alpha*z1 gi samme output for
# enhver verdi av alpha.
for alpha in [-2.,-1.,0.,1.,2.]:
    x=x0+alpha*z1
    print(f"alpha={alpha:4.1f}  x={x}  A@x={A@x}")

print("Felles output:",y)
```

Dette er den rene matriseversjonen av åpningsproblemet: Nullrommet beskriver alle endringer i inputen som ikke endrer outputen.

::::

:::: {.callout-note collapse="true"}
### Eksakt og numerisk rang

Til slutt endrer vi den avhengige tredje raden med et svært lite tall. For enhver $\varepsilon\ne0$ er den forstyrrede matrisen eksakt sett av rang 3. Numerisk må vi likevel avgjøre om den nye pivoten er stor nok til å skilles fra avrundingsfeil.

```{pyodide-python}
#| label: week3-nearly-dependent-row
#| autorun: true

# direction bestemmer hvordan vi forstyrrer den avhengige tredje raden.
direction=np.array([1.,-1.,1.,-1.])
for eps in [1e-4,1e-8,1e-12,1e-16]:
    # copy hindrer at forstyrrelsen samler seg opp fra én runde til neste.
    A_eps=A.copy()
    A_eps[2]+=eps*direction
    R_eps,pivots_eps=row_echelon(A_eps,tol=1e-10)
    print(f"eps={eps:.0e}",
          "rang med tol=1e-10:",len(pivots_eps),
          "NumPy-rang:",np.linalg.matrix_rank(A_eps))
```

Dette er ikke en motsigelse. **Eksakt rang** gjelder en idealisert matrise med eksakte tall. **Numerisk rang** beskriver hvor mange uavhengige retninger vi kan skille pålitelig med den valgte presisjonen og toleransen.

::::

## 3.8 Støtteløp: Papir- og kontrolloppgaver {#uke3-stotte-oppgaver}

Dette er repetisjonsoppgaver, ikke en obligatorisk fortsettelse av
hovedløpet. Bruk matrisen $B$ som selvtest. Hvis regningen går greit, kan du
gå direkte til kodekontrollen eller avslutte. Bruk matrisen $C$ som ekstra
trening dersom du trenger mer øvelse med avhengige rader, nullrom og
rang–nullitet.

Start alltid på papir. Bruk kodeoppgaven nederst etterpå til å kontrollere
regningen og eksperimentere videre. Arbeid med én matrise om gangen:

$$
B=\begin{bmatrix}
1&0&1\\
0&1&1\\
1&1&2
\end{bmatrix},
\qquad
C=\begin{bmatrix}
1&2&3\\
2&4&6
\end{bmatrix}.
$$

### På papir

Oppgavene under vurderes eksakt med SymPy. Du velger selv hvor mange
pivotindekser og basisvektorer du vil levere. Bruk knappene under matrisen for å
legge til eller fjerne kolonner. Antallet er en del av svaret.

::: {#week3-paper-assessment-context .math-exercise-context}

For en matrise med $n$ kolonner gjelder
$n=\operatorname{rank}(M)+\operatorname{nullity}(M)$. Pivotkolonnene bestemmes
fra en trappeform, men en basis for kolonnerommet hentes fra de tilsvarende
kolonnene i den opprinnelige matrisen. En basis for nullrommet må bestå av
lineært uavhengige vektorer $z$ som oppfyller $Mz=0$.

I basisoppgavene farges en gyldig og uavhengig familie grønn. Hvis gyldige
vektorer er lineært avhengige, blir hele familien gul; rekkefølgen skal ikke
avgjøre hvilken vektor som får skylden. En nullvektor eller en vektor utenfor
det etterspurte rommet blir rød. En grønn familie kan fortsatt mangle vektorer
før den spenner ut hele rommet.

:::

#### Selvtest med $B$

```{math-exercise}
#| label: week3-paper-b-echelon
#| caption: Trappeform og pivoter for B
#| mode: custom
#| partial-credit: true
#| field-labels: r₁₁, r₁₂, r₁₃, r₂₁, r₂₂, r₂₃, r₃₁, r₃₂, r₃₃
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       # R (the pivot cells follow)
#|       values = [nsimplify(v, rational=True) for v in response["expressions"][:9]]
#|       R = Matrix(3, 3, values)
#|       P = response["inputs"]["PBstep"]["matrix"]
#|       submitted_pivots = list(P)
#|       expected_rref = Matrix([[1, 0, 1], [0, 1, 1], [0, 0, 0]])
#|       def leading_columns(matrix):
#|           leads = []
#|           zero_row_seen = False
#|           for row in range(matrix.rows):
#|               lead = None
#|               for col in range(matrix.cols):
#|                   if simplify(matrix[row, col]) != 0:
#|                       lead = col
#|                       break
#|               if lead is None:
#|                   zero_row_seen = True
#|               elif zero_row_seen or (leads and lead <= leads[-1]):
#|                   return None
#|               else:
#|                   leads.append(lead)
#|           return leads
#|       leads = leading_columns(R)
#|       echelon_ok = leads is not None
#|       rowspace_ok = R.rref()[0] == expected_rref
#|       expected_pivots = [Integer(j + 1) for j in leads] if echelon_ok else []
#|       pivot_status = [
#|           i < len(expected_pivots) and value == expected_pivots[i]
#|           for i, value in enumerate(submitted_pivots)
#|       ]
#|       pivot_score = sum(pivot_status) / max(len(expected_pivots), len(submitted_pivots), 1)
#|       score = (int(echelon_ok) + int(rowspace_ok) + pivot_score) / 3
#|       return {
#|           "score": score,
#|           "show_score": False,
#|           "feedback": "" if score == 1 else "Kontroller trappeformen, og juster antallet pivotindekser slik at listen svarer til de ledende elementene fra venstre mot høyre.",
#|           "assessment": {"PBstep": {"columns": pivot_status}},
#|       }

Radreduser $B$. Oppgi en gyldig trappeform $R$ og numrene til pivotkolonnene i
stigende rekkefølge:

$R=$ mat[1,0,1;0,1,1;0,0,0]

Skriv pivotkolonnenes numre i stigende rekkefølge, én indeks per kolonne:

$P_B=$ mat{name=PBstep, rows=1, cols=auto, initial-cols=1, min-cols=0, max-cols=3}
```

```{math-exercise}
#| label: week3-paper-b-rank
#| caption: Rang og pivotkolonner for B
#| mode: custom
#| partial-credit: true
#| field-labels: Rang
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       rank_value = response["expressions"][0]
#|       P = response["inputs"]["PBrank"]["matrix"]
#|       B = Matrix([[1, 0, 1], [0, 1, 1], [1, 1, 2]])
#|       expected_pivots = [Integer(j + 1) for j in B.rref()[1]]
#|       submitted_pivots = list(P)
#|       pivot_status = [
#|           i < len(expected_pivots) and value == expected_pivots[i]
#|           for i, value in enumerate(submitted_pivots)
#|       ]
#|       pivot_score = sum(pivot_status) / max(len(expected_pivots), len(submitted_pivots), 1)
#|       score = (int(rank_value == B.rank()) + pivot_score) / 2
#|       return {
#|           "score": score,
#|           "show_score": False,
#|           "feedback": "" if score == 1 else "Rangen er antall pivoter. Kontroller både rangverdien, antallet pivotindekser og rekkefølgen deres.",
#|           "assessment": {"PBrank": {"columns": pivot_status}},
#|       }

Finn rangen og pivotkolonnene til $B$:

$\operatorname{rank}(B)=$ _[2]

Pivotkolonner, én indeks per kolonne:

$P_B=$ mat{name=PBrank, rows=1, cols=auto, initial-cols=1, min-cols=0, max-cols=3}
```

```{math-exercise}
#| label: week3-paper-b-column-basis
#| caption: Basis for kolonnerommet til B
#| mode: custom
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       Q = response["inputs"]["QB"]["matrix"]
#|       B = Matrix([[1, 0, 1], [0, 1, 1], [1, 1, 2]])
#|       original_columns = [B[:, j] for j in range(B.cols)]
#|       result = assess_basis(
#|           Q,
#|           axis="columns",
#|           target_dimension=B.rank(),
#|           belongs=lambda vector: Q.rows == B.rows and any(vector == column for column in original_columns),
#|           name="QB",
#|           space_name="kolonnerommet til B",
#|       )
#|       statuses = result["assessment"]["QB"]["columns"]
#|       if result["score"] < 1:
#|           if "incorrect" in statuses:
#|               result["feedback"] = "En rød kolonne er null eller er ikke en kolonne fra den opprinnelige matrisen B."
#|           elif "dependent" in statuses:
#|               result["feedback"] = "De gule kolonnene kommer fra B, men familien er lineært avhengig. Fjern eller bytt kolonner."
#|           elif statuses:
#|               result["feedback"] = "De grønne kolonnene er tillatte og uavhengige, men de danner ennå ikke en basis for hele kolonnerommet."
#|           else:
#|               result["feedback"] = "Legg til kolonner fra den opprinnelige matrisen B."
#|       return result

Sett pivotkolonnene fra den opprinnelige matrisen $B$ inn som kolonner i en
basismatrise. Du må selv velge hvor mange kolonner som trengs:

$Q_B=$ mat{name=QB, rows=3, cols=auto, initial-cols=1, min-cols=0, max-cols=3}
```

```{math-exercise}
#| label: week3-paper-b-null-basis
#| caption: Basis for nullrommet til B
#| mode: custom
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       Z = response["inputs"]["ZB"]["matrix"]
#|       B = Matrix([[1, 0, 1], [0, 1, 1], [1, 1, 2]])
#|       result = assess_basis(
#|           Z,
#|           axis="columns",
#|           target_dimension=B.cols - B.rank(),
#|           belongs=lambda vector: Z.rows == B.cols and B * vector == zeros(B.rows, 1),
#|           name="ZB",
#|           space_name="nullrommet til B",
#|       )
#|       statuses = result["assessment"]["ZB"]["columns"]
#|       if result["score"] < 1:
#|           if "incorrect" in statuses:
#|               result["feedback"] = "En rød kolonne er null eller oppfyller ikke Bz=0."
#|           elif "dependent" in statuses:
#|               result["feedback"] = "De gule kolonnene ligger i nullrommet, men familien er lineært avhengig."
#|           elif statuses:
#|               result["feedback"] = "De grønne kolonnene er gyldige og uavhengige, men de spenner ennå ikke ut hele nullrommet."
#|           else:
#|               result["feedback"] = "Legg til basisvektorer for nullrommet."
#|       return result

Oppgi en basis for nullrommet til $B$, med én basisvektor per kolonne. Enhver
basis godtas, og du må selv velge antallet kolonner:

$Z_B=$ mat{name=ZB, rows=3, cols=auto, initial-cols=1, min-cols=0, max-cols=3}
```

```{math-exercise}
#| label: week3-paper-b-rank-nullity
#| caption: Rang–nullitet for B
#| mode: custom
#| partial-credit: true
#| field-labels: Inputdimensjon, Rang, Nullitet
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       n, rank_value, nullity = response["expressions"]
#|       checks = [n == 3, rank_value == 2, nullity == 1, n == rank_value + nullity]
#|       return {"score": sum(int(value) for value in checks) / 4, "feedback": "Tell kolonnene, pivotene og de frie variablene, og kontroller deretter n = rang + nullitet."}

Fyll inn rang–nullitetsregnskapet for $B$:

inputdimensjon _[3] $=$ rang _[2] $+$ nullitet _[1]
```

#### Ekstra trening med $C$

```{math-exercise}
#| label: week3-paper-c-echelon
#| caption: Trappeform og pivoter for C
#| mode: custom
#| partial-credit: true
#| field-labels: r₁₁, r₁₂, r₁₃, r₂₁, r₂₂, r₂₃
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       # R (the pivot cells follow)
#|       values = [nsimplify(v, rational=True) for v in response["expressions"][:6]]
#|       R = Matrix(2, 3, values)
#|       P = response["inputs"]["PCstep"]["matrix"]
#|       submitted_pivots = list(P)
#|       expected_rref = Matrix([[1, 2, 3], [0, 0, 0]])
#|       def leading_columns(matrix):
#|           leads = []
#|           zero_row_seen = False
#|           for row in range(matrix.rows):
#|               lead = None
#|               for col in range(matrix.cols):
#|                   if simplify(matrix[row, col]) != 0:
#|                       lead = col
#|                       break
#|               if lead is None:
#|                   zero_row_seen = True
#|               elif zero_row_seen or (leads and lead <= leads[-1]):
#|                   return None
#|               else:
#|                   leads.append(lead)
#|           return leads
#|       leads = leading_columns(R)
#|       echelon_ok = leads is not None
#|       rowspace_ok = R.rref()[0] == expected_rref
#|       expected_pivots = [Integer(j + 1) for j in leads] if echelon_ok else []
#|       pivot_status = [
#|           i < len(expected_pivots) and value == expected_pivots[i]
#|           for i, value in enumerate(submitted_pivots)
#|       ]
#|       pivot_score = sum(pivot_status) / max(len(expected_pivots), len(submitted_pivots), 1)
#|       score = (int(echelon_ok) + int(rowspace_ok) + pivot_score) / 3
#|       return {
#|           "score": score,
#|           "show_score": False,
#|           "feedback": "" if score == 1 else "Kontroller trappeformen, og juster antallet pivotindekser slik at listen svarer til de ledende elementene fra venstre mot høyre.",
#|           "assessment": {"PCstep": {"columns": pivot_status}},
#|       }

Radreduser $C$. Oppgi en gyldig trappeform $R$:

$R=$ mat[1,2,3;0,0,0]

Skriv pivotkolonnenes numre i stigende rekkefølge, én indeks per kolonne:

$P_C=$ mat{name=PCstep, rows=1, cols=auto, initial-cols=1, min-cols=0, max-cols=3}
```

```{math-exercise}
#| label: week3-paper-c-rank
#| caption: Rang og pivotkolonner for C
#| mode: custom
#| partial-credit: true
#| field-labels: Rang
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       rank_value = response["expressions"][0]
#|       P = response["inputs"]["PCrank"]["matrix"]
#|       C = Matrix([[1, 2, 3], [2, 4, 6]])
#|       expected_pivots = [Integer(j + 1) for j in C.rref()[1]]
#|       submitted_pivots = list(P)
#|       pivot_status = [
#|           i < len(expected_pivots) and value == expected_pivots[i]
#|           for i, value in enumerate(submitted_pivots)
#|       ]
#|       pivot_score = sum(pivot_status) / max(len(expected_pivots), len(submitted_pivots), 1)
#|       score = (int(rank_value == C.rank()) + pivot_score) / 2
#|       return {
#|           "score": score,
#|           "show_score": False,
#|           "feedback": "" if score == 1 else "Rangen er antall pivoter. Kontroller både rangverdien, antallet pivotindekser og rekkefølgen deres.",
#|           "assessment": {"PCrank": {"columns": pivot_status}},
#|       }

Finn rangen og pivotkolonnene til $C$:

$\operatorname{rank}(C)=$ _[1]

Pivotkolonner, én indeks per kolonne:

$P_C=$ mat{name=PCrank, rows=1, cols=auto, initial-cols=1, min-cols=0, max-cols=3}
```

```{math-exercise}
#| label: week3-paper-c-column-basis
#| caption: Basis for kolonnerommet til C
#| mode: custom
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       Q = response["inputs"]["QC"]["matrix"]
#|       C = Matrix([[1, 2, 3], [2, 4, 6]])
#|       original_columns = [C[:, j] for j in range(C.cols)]
#|       result = assess_basis(
#|           Q,
#|           axis="columns",
#|           target_dimension=C.rank(),
#|           belongs=lambda vector: Q.rows == C.rows and any(vector == column for column in original_columns),
#|           name="QC",
#|           space_name="kolonnerommet til C",
#|       )
#|       statuses = result["assessment"]["QC"]["columns"]
#|       if result["score"] < 1:
#|           if "incorrect" in statuses:
#|               result["feedback"] = "En rød kolonne er null eller er ikke en kolonne fra den opprinnelige matrisen C."
#|           elif "dependent" in statuses:
#|               result["feedback"] = "De gule kolonnene kommer fra C, men familien er lineært avhengig. Fjern eller bytt kolonner."
#|           elif statuses:
#|               result["feedback"] = "De grønne kolonnene er tillatte og uavhengige, men de danner ennå ikke en basis for hele kolonnerommet."
#|           else:
#|               result["feedback"] = "Legg til kolonner fra den opprinnelige matrisen C."
#|       return result

Sett pivotkolonnene fra den opprinnelige matrisen $C$ inn som kolonner i en
basismatrise. Du må selv velge hvor mange kolonner som trengs:

$Q_C=$ mat{name=QC, rows=2, cols=auto, initial-cols=1, min-cols=0, max-cols=3}
```

```{math-exercise}
#| label: week3-paper-c-null-basis
#| caption: Basis for nullrommet til C
#| mode: custom
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       Z = response["inputs"]["ZC"]["matrix"]
#|       C = Matrix([[1, 2, 3], [2, 4, 6]])
#|       result = assess_basis(
#|           Z,
#|           axis="columns",
#|           target_dimension=C.cols - C.rank(),
#|           belongs=lambda vector: Z.rows == C.cols and C * vector == zeros(C.rows, 1),
#|           name="ZC",
#|           space_name="nullrommet til C",
#|       )
#|       statuses = result["assessment"]["ZC"]["columns"]
#|       if result["score"] < 1:
#|           if "incorrect" in statuses:
#|               result["feedback"] = "En rød kolonne er null eller oppfyller ikke Cz=0."
#|           elif "dependent" in statuses:
#|               result["feedback"] = "De gule kolonnene ligger i nullrommet, men familien er lineært avhengig."
#|           elif statuses:
#|               result["feedback"] = "De grønne kolonnene er gyldige og uavhengige, men de spenner ennå ikke ut hele nullrommet."
#|           else:
#|               result["feedback"] = "Legg til basisvektorer for nullrommet."
#|       return result

Oppgi en basis for nullrommet til $C$, med én basisvektor per kolonne. Enhver
basis godtas, og du må selv velge antallet kolonner:

$Z_C=$ mat{name=ZC, rows=3, cols=auto, initial-cols=1, min-cols=0, max-cols=3}
```

```{math-exercise}
#| label: week3-paper-c-rank-nullity
#| caption: Rang–nullitet for C
#| mode: custom
#| partial-credit: true
#| field-labels: Inputdimensjon, Rang, Nullitet
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       n, rank_value, nullity = response["expressions"]
#|       checks = [n == 3, rank_value == 1, nullity == 2, n == rank_value + nullity]
#|       return {"score": sum(int(value) for value in checks) / 4, "feedback": "Tell kolonnene, pivotene og de frie variablene, og kontroller deretter n = rang + nullitet."}

Fyll inn rang–nullitetsregnskapet for $C$:

inputdimensjon _[3] $=$ rang _[1] $+$ nullitet _[2]
```

### Med kode

Bruk denne delen etter at du har arbeidet med den valgte matrisen på
papir. Cellen under inneholder en kort, selvstendig kopi av
`row_echelon`, slik at kontrolloppgaven virker selv om du ikke har åpnet og
kjørt kodecellen i matriserepetisjonen i 3.7.

1. Kontroller trappeformen og pivotkolonnene med `row_echelon`.
2. Kontroller nullromsvektorene ved å beregne `M @ Z`.
3. Lag to forskjellige inputer med samme output.
4. Finn én output som kan produseres, og én som ikke kan produseres.

```{pyodide-python}
#| label: week3-pure-matrix-exercises

import numpy as np

# Selvstendig hjelpekode: Cellen skal kunne kjøres uten kodecellene i 3.7.
def row_echelon(A,tol=1e-12):
    """Returner trappeform og indeksene til pivotkolonnene."""
    R=np.array(A,dtype=float,copy=True)
    rows,cols=R.shape
    pivot_row=0
    pivot_columns=[]

    for col in range(cols):
        if pivot_row==rows:
            break
        candidate=next(
            (row for row in range(pivot_row,rows) if abs(R[row,col])>tol),
            None,
        )
        if candidate is None:
            continue
        if candidate!=pivot_row:
            R[[pivot_row,candidate]]=R[[candidate,pivot_row]]
        for row in range(pivot_row+1,rows):
            R[row]-=(R[row,col]/R[pivot_row,col])*R[pivot_row]
        R[np.abs(R)<=tol]=0.0
        pivot_columns.append(col)
        pivot_row+=1

    return R,pivot_columns

B=np.array([[1.,0.,1.],
            [0.,1.,1.],
            [1.,1.,2.]])
C=np.array([[1.,2.,3.],
            [2.,4.,6.]])

# Studentvalg: Arbeid ferdig med B på papir og i kode før du bytter til C.
M=B
R_M,pivots_M=row_echelon(M)
print("Trappeform:\n",R_M)
print("Pivotkolonner:",[j+1 for j in pivots_M])

# TODO: Sett inn nullromsvektorene fra papirregningen som kolonner i Z_M.
# Kontrollen under skal da bli en nullmatrise.
Z_M=np.zeros((M.shape[1],0))
print("Kontroll M @ Z_M:\n",M@Z_M)

# TODO: Velg x0 og én kolonne z fra Z_M. Sammenlign M@x0 med M@(x0+z).

# TODO: Lag rhs_yes som M@x for en selvvalgt x. Lag deretter rhs_no som du
# mener ligger utenfor kolonnerommet. Sammenlign rang(M) med rang([M | rhs]).
```

:::
