::: {.panel-tabset}

## 3.0 To bilder, samme output

En **transformasjon** er her en regel som tar en input og lager en output. Inputen kan være et bilde, en lydfil eller en tabell med målinger; outputen kan være et nytt bilde eller noen få tall som oppsummerer inputen. Vi skriver ofte

$$T(\text{input})=\text{output}.$$

Navnet sier foreløpig ikke noe mystisk. En Python-funksjon er også en regel fra input til output. Det viktige er å spørre konkret: Hvilken informasjon bruker regelen, hvilken informasjon kommer ut, og kan noe gå tapt underveis?

Denne uka bruker vi én enkel bildetransformasjon som gjennomgående eksempel. Den gjør et bilde med 16 piksler om til et mindre bilde med fire piksler. Figuren viser hele oppskriften uten matriser eller formler.

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

Fargene og pilene viser hva som hører sammen. De fire pikslene i det blå området samles til den blå outputpikselen, og tilsvarende for de tre andre områdene. I vårt eksempel betyr «samle» at vi tar gjennomsnittet av de fire pikselverdiene. Dermed går vi fra 16 tall til fire tall. Vi begynner med to bilder som ser helt forskjellige ut: et ensfarget bilde og et tydelig sjakkmønster.

```{pyodide-python}
#| label: week3-setup
#| autorun: true
#| context: setup

import numpy as np
import matplotlib.pyplot as plt

def show_images(images, titles=None, cols=4, cmap="gray",
                vmin=None, vmax=None, figsize=None):
    """Vis flere 2D-arrays med samme fargeskala."""
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

def average_pool(X):
    """Fire gjennomsnitt, ett fra hver 2 x 2-blokk."""
    X = np.asarray(X, dtype=float)
    if X.shape != (4, 4):
        raise ValueError("Bildet må ha størrelse 4 x 4.")
    return X.reshape(2, 2, 2, 2).mean(axis=(1, 3))

def pooling_matrix():
    """A slik at A @ X.reshape(-1) gir de fire gjennomsnittene."""
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
```

```{pyodide-python}
#| label: week3-same-output
#| autorun: true

X1 = np.full((4, 4), 0.5)
X2 = np.array([
    [0.1, 0.9, 0.1, 0.9],
    [0.9, 0.1, 0.9, 0.1],
    [0.1, 0.9, 0.1, 0.9],
    [0.9, 0.1, 0.9, 0.1]
])
Y1, Y2 = average_pool(X1), average_pool(X2)

show_images([X1, X2, Y1, Y2],
    ["Input $X_1$", "Input $X_2$", "Output fra $X_1$", "Output fra $X_2$"],
    cols=4, vmin=0, vmax=1)
print("Forskjell mellom inputene: ", np.linalg.norm(X1-X2))
print("Forskjell mellom outputene:", np.linalg.norm(Y1-Y2))
```

::: {.callout-important}
## Første observasjon

Bildene er forskjellige, men transformasjonen gir samme output. Den bevarer gjennomsnittet i hver blokk, men ikke hvordan pikselverdiene er fordelt inne i blokken.
:::

Transformasjonen arbeider blokk for blokk. I øvre venstre blokk i `X2` er pikselverdiene $0.1,0.9,0.9,0.1$. Summen er 2, og gjennomsnittet er derfor $2/4=0.5$. Det samme skjer i de tre andre blokkene. I `X1` er hver piksel allerede $0.5$, så også der blir alle fire blokkgjennomsnittene $0.5$.

```{pyodide-python}
#| label: week3-four-blocks
#| autorun: true

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

Dette er ikke en avrundingsfeil. Gjennomsnittene er matematisk like. Det er selve transformasjonen som ikke registrerer forskjellen mellom et jevnt felt og variasjoner med samme sum. Transformasjonen er altså mange-til-én: flere forskjellige inputbilder kan havne på samme output.

Senere skal vi undersøke to viktige egenskaper ved transformasjoner:

1. **Hva skjer når inputbilder skaleres og legges sammen?** Dette leder til lineære transformasjoner.
2. **Hvilke endringer i inputen blir usynlige i outputen?** Dette leder til nullrom, rang og dimensjon.

Fra outputen alene kan vi derfor ikke avgjøre hvilket bilde som var input. Før vi gir dette et matematisk navn, kan du prøve å endre `X2` uten å endre gjennomsnittet i noen blokk. Hvilke endringer ser ut til å være tillatt?

## 3.1 Bildet som vektor

Et bilde vises som en todimensjonal rute, men pikselverdiene kan også legges etter hverandre i en liste. NumPy-funksjonen `reshape(-1)` leser først øverste rad fra venstre mot høyre, deretter neste rad, og fortsetter til alle 16 pikslene er plassert i én vektor.

```{pyodide-python}
#| label: week3-flatten-picture
#| autorun: true

x2=X2.reshape(-1)
fig,axes=plt.subplots(1,2,figsize=(7.0,1.8),
                      gridspec_kw={"width_ratios":[1,3.2]})

axes[0].imshow(X2,cmap="gray",vmin=0,vmax=1,interpolation="nearest")
for r in range(4):
    for c in range(4):
        axes[0].text(c,r,f"$x_{{{4*r+c+1}}}$\n{X2[r,c]:.1f}",
                     ha="center",va="center",fontsize=7,
                     color="white" if X2[r,c]<0.5 else "black")
axes[0].set_title("$4\\times4$-bilde",fontsize=9)
axes[0].set_xticks([]); axes[0].set_yticks([])

axes[1].imshow(x2.reshape(1,-1),cmap="gray",vmin=0,vmax=1,
               interpolation="nearest",aspect="equal")
for j,value in enumerate(x2):
    axes[1].text(j,0,f"$x_{{{j+1}}}$\n{value:.1f}",
                 ha="center",va="center",fontsize=6,
                 color="white" if value<0.5 else "black")
for boundary in [3.5,7.5,11.5]:
    axes[1].axvline(boundary,color="tab:red",linewidth=2)
axes[1].set_title("Radene lagt etter hverandre: en 16-vektor",fontsize=9)
axes[1].set_xticks([]); axes[1].set_yticks([])
fig.text(0.315,0.49,"→",ha="center",va="center",fontsize=16)
plt.tight_layout(); plt.show()
```

Venstre del av figuren viser pikselnumrene på de opprinnelige plassene. Høyre del viser nøyaktig de samme tallene i én rad. De røde strekene markerer hvor en rad fra bildet slutter og den neste begynner. Vektoren er derfor ikke et nytt bilde og ingen informasjon er borte; vi har bare valgt en nummerering som gjør at vanlig matrise-vektor-multiplikasjon kan brukes.

Et $4\times4$-bilde beskrives dermed med 16 koordinater og kan behandles som en vektor $x\in\mathbb R^{16}$. Bildetransformasjonen fra 3.0 kan nå skrives

$$y=Ax,$$

der $A$ har fire rader og seksten kolonner. Hver rad i $A$ lager én av de fire outputverdiene. Hver kolonne svarer til én av de 16 inputpikslene.

```{pyodide-python}
#| label: week3-pooling-as-matrix
#| autorun: true

x1, x2 = X1.reshape(-1), X2.reshape(-1)
y1, y2 = A_pool @ x1, A_pool @ x2
print("Bildeform:", X1.shape, "  vektorform:", x1.shape)
print("A har form", A_pool.shape)
print("A @ x1 =", y1)
print("A @ x2 =", y2)

plt.figure(figsize=(7, 2.2))
plt.imshow(A_pool, cmap="Blues", vmin=0, vmax=0.25,
           interpolation="nearest", aspect="auto")
for row in range(4):
    for col in range(16):
        if A_pool[row,col] != 0:
            plt.text(col,row,"¼",ha="center",va="center",fontsize=7)
plt.xlabel("Pikselnummer i inputen")
plt.ylabel("Output: ØV, ØH, NV, NH")
plt.yticks(range(4),["ØV","ØH","NV","NH"])
plt.title("Hver rad velger fire inputpiksler og tar gjennomsnittet")
plt.colorbar(label="Vekt"); plt.tight_layout(); plt.show()
```

De blå feltene viser hvilke inputpiksler som bidrar til hver outputverdi. Første rad har fire vekter lik $1/4$ ved pikslene i øvre venstre blokk; produktet av denne raden og $x$ blir derfor gjennomsnittet i den blokken. De tre neste radene gjør det samme for øvre høyre, nedre venstre og nedre høyre blokk. Nullene er hvite og betyr at den aktuelle inputpikselen ikke brukes i den målingen.

### Et eksperiment med skalering og addisjon

Vi vil vite om transformasjonen reagerer forutsigbart når bilder kombineres. «Blande» betyr her en helt bestemt regneoperasjon: Vi multipliserer hver piksel i `X1` med $0.6$, hver piksel i `X3` med $0.4$, og legger sammen piksel for piksel. Det nye bildet er

$$0.6X_1+0.4X_3.$$

Vi sammenligner to regnerekkefølger:

- **Øvre rute:** lag det vektede gjennomsnittet av de store bildene først, og reduser dette bildet etterpå.
- **Nedre rute:** reduser hvert stort bilde først, og lag så samme vektede gjennomsnitt av de små outputbildene.

```{pyodide-python}
#| label: week3-check-linearity

rng=np.random.default_rng(3)
X3=rng.random((4,4))
alpha,beta=0.6,0.4
mixed_input=alpha*X1+beta*X3
left=(A_pool@mixed_input.reshape(-1)).reshape(2,2)
right=alpha*average_pool(X1)+beta*average_pool(X3)

fig,axes=plt.subplots(2,4,figsize=(7.0,3.6))
top=[X1,X3,mixed_input,left]
bottom=[average_pool(X1),average_pool(X3),right,left-right]
top_titles=["Input $X_1$","Input $X_3$",
            "$0.6X_1+0.4X_3$","Redusert blanding"]
bottom_titles=["Redusert $X_1$","Redusert $X_3$",
               "$0.6A(X_1)+0.4A(X_3)$","Forskjell mellom svarene"]
for ax,image,title in zip(axes[0],top,top_titles):
    ax.imshow(image,cmap="gray",vmin=0,vmax=1,interpolation="nearest")
    ax.set_title(title,fontsize=8); ax.set_xticks([]); ax.set_yticks([])
for ax,image,title in zip(axes[1],bottom,bottom_titles):
    ax.imshow(image,cmap="gray",vmin=0,vmax=1,interpolation="nearest")
    ax.set_title(title,fontsize=8); ax.set_xticks([]); ax.set_yticks([])
for row in range(2):
    for col,symbol in enumerate(["+","→","→"]):
        axes[row,col].text(1.08,0.5,symbol,transform=axes[row,col].transAxes,
                           ha="center",va="center",fontsize=14)
plt.tight_layout(); plt.show()
print("Numerisk forskjell:",np.linalg.norm(left-right))
```

I øverste rad er de to første bildene inputene, det tredje er den pikselvise kombinasjonen, og det fjerde er outputen etter reduksjon. I nederste rad er de to første bildene allerede redusert; det tredje er kombinasjonen av disse outputene. Det siste bildet viser øvre svar minus nedre svar. Det er svart fordi alle fire forskjellene er null.

De to regnerekkefølgene gir altså samme småbilde. Dette er den sentrale regneregelen for en **lineær transformasjon**:

$$A(\alpha x+\beta z)=\alpha Ax+\beta Az.$$

Her står $x$ og $z$ for to vilkårlige inputvektorer, mens $\alpha$ og $\beta$ er vilkårlige tall. Regelen rommer to egenskaper samtidig: skalering kan flyttes gjennom transformasjonen, og addisjon kan flyttes gjennom transformasjonen.

Dette er sentralt fordi vi senere kan forstå en komplisert input ved å dele den i enkle byggesteiner. Hvis $x=c_1b_1+\cdots+c_kb_k$, trenger vi ikke analysere hele $x$ på nytt:

$$Ax=c_1Ab_1+\cdots+c_kAb_k.$$

Vi kan altså finne hva transformasjonen gjør med hver byggestein én gang og deretter kombinere resultatene. Basis, nullrom og kolonnerom bygger alle på denne ideen. Ikke alle transformasjoner er lineære: å klippe alle negative pikselverdier til null eller å sortere pikslene vil for eksempel vanligvis bryte regneregelen.

## 3.2 Basisbilder og dimensjon

Vi skal nå finne et systematisk språk for «byggesteiner». Vi begynner fortsatt med bilder, ikke med en abstrakt definisjon.

Tenk på et tomt $2\times2$-bilde. Vi ønsker fire skyveknapper som kan lage et hvilket som helst slikt bilde. En naturlig idé er å la hver skyveknapp styre én piksel. De fire første bildene nedenfor har verdi 1 i hver sin piksel og 0 i de andre. I neste figur blir hvert basisbilde ganget med ønsket pikselverdi. Til slutt legges de fire delbildene sammen piksel for piksel.

```{pyodide-python}
#| label: week3-pixel-basis
#| autorun: true

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

$$X=0.2E_1+0.7E_2+0.4E_3+0.9E_4.$$

For eksempel bidrar $0.7E_2$ bare med verdien $0.7$ i øvre høyre piksel. Siden ingen av de andre tre delbildene påvirker denne pikselen, blir øvre høyre piksel i summen også $0.7$. Slik kan hver av de fire pikslene stilles inn uavhengig.

De fire tallene foran byggesteinene kalles **koordinater i denne beskrivelsen**. Her er de nøyaktig de fire pikselverdiene i $X$. Før vi gir hele byggesteinsystemet et matematisk navn, undersøker vi to mulige problemer: for få byggesteiner og overflødige byggesteiner.

### Eksperiment: Ta bort én byggestein

Vi forsøker å lage det samme målbildet uten $E_4$. De tre første pikslene kan fortsatt stilles inn, men ingen kombinasjon av $E_1,E_2,E_3$ kan påvirke pikselen nederst til høyre.

```{pyodide-python}
#| label: week3-missing-and-redundant
#| autorun: true

X_without_E4=coefficients[0]*E1+coefficients[1]*E2+coefficients[2]*E3
difference=X-X_without_E4
show_images([X,X_without_E4,difference,E4],
    ["Målbildet","Uten $E_4$","Det som mangler","$E_4$"],
    cols=4,vmin=0,vmax=1,figsize=(6.8,1.8))
```

Resultatet viser mer enn at akkurat vårt forsøk mislyktes: Nedre høyre piksel er null i hver av de tre tilgjengelige byggesteinene, og blir derfor null i enhver lineærkombinasjon av dem. $E_4$ tilfører en mulighet de andre ikke har.

### Eksperiment: Legg til en overflødig byggestein

Nå legger vi til $E_5=E_1+E_2$. Figuren viser at $E_5$ ikke gir en ny type bilde; den samme effekten kunne allerede lages med de gamle byggesteinene.

```{pyodide-python}
#| label: week3-redundant-building-block
#| autorun: true

E5=E1+E2
recipe_1=1*E1+1*E2+0*E5
recipe_2=0*E1+0*E2+1*E5
show_images([E1,E2,E5,recipe_1,recipe_2,recipe_1-recipe_2],
    ["$E_1$","$E_2$","$E_5$",
     "Oppskrift 1","Oppskrift 2","Forskjell"],
    cols=3,vmin=0,vmax=1,figsize=(5.4,3.6))
```

Øverste rad viser at $E_5$ allerede er summen av de to første byggesteinene. Nederste rad viser konsekvensen: Oppskrift 1 bruker ett eksemplar av $E_1$ og $E_2$, mens oppskrift 2 bruker ett eksemplar av $E_5$. Forskjellsbildet er null overalt. De to oppskriftene bruker altså forskjellige koeffisienter, men gir samme bilde, så beskrivelsen er ikke lenger entydig.

::: {.callout-tip}
## Fra eksperiment til begreper

- Byggesteinene **spenner ut** en samling bilder når alle bilder i samlingen kan bygges som lineærkombinasjoner av dem.
- Byggesteinene er **lineært uavhengige** når ingen av dem kan bygges av de andre. Da har hvert bilde høyst én oppskrift.
- En **basis** er et sett byggesteiner som både spenner ut hele samlingen og er lineært uavhengig: nok byggesteiner, men ingen overflødige.
:::

Samlingen av alle $2\times2$-bilder med reelle pikselverdier skrives $\mathbb R^{2\times2}$. Det betyr bare «fire reelle tall ordnet som to rader og to kolonner». $E_1,E_2,E_3,E_4$ danner en basis for denne samlingen. **Dimensjonen** er antallet byggesteiner i en basis, altså

$$\dim(\mathbb R^{2\times2})=4.$$

Dimensjon teller antallet uavhengige tall som trengs for å beskrive et vilkårlig bilde i samlingen. Den handler ikke om at bildet ser todimensjonalt ut på skjermen. Et $4\times4$-bilde har tilsvarende 16 fritt valgbare pikselverdier og ligger i et rom med dimensjon 16.

## 3.3 En basis som beskriver mønstre

Pikselbyggesteinene er enkle, men koordinatene sier bare hvor lyse de fire pikslene er. Vi prøver nå fire andre byggesteiner. I figurene betyr rødt positive verdier og blått negative verdier; hvitt ligger nær null. Negative tall er ikke «negativt lys», men beskriver at et mønster trekkes fra når bilder kombineres.

```{pyodide-python}
#| label: week3-pattern-basis
#| autorun: true

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

Disse mønstrene virker meningsfulle, men det er ikke nok til å kalle dem en basis. Vi må undersøke de samme to spørsmålene som i 3.2: Kan de bygge alle målbilder, og er oppskriften entydig?

Vi gjør hvert mønster om til en 4-vektor og bruker vektorene som kolonner i `P`. For hvert målbilde løser vi ligningen `P @ c = target`: Finnes det koeffisienter som rekonstruerer bildet?

```{pyodide-python}
#| label: week3-test-pattern-building-blocks
#| autorun: true

P=np.column_stack([pattern.reshape(-1) for pattern in pattern_basis])
rng=np.random.default_rng(8)
targets=[rng.uniform(-1,1,size=(2,2)) for _ in range(4)]
reconstructions=[]; errors=[]
for target in targets:
    c_test=np.linalg.solve(P,target.reshape(-1))
    reconstruction=(P@c_test).reshape(2,2)
    reconstructions.append(reconstruction)
    errors.append(np.linalg.norm(reconstruction-target))

interleaved=[]; titles=[]
for i,(target,reconstruction) in enumerate(zip(targets,reconstructions),start=1):
    interleaved.extend([target,reconstruction])
    titles.extend([f"Mål {i}",f"Bygd mål {i}"])
show_images(interleaved,titles,cols=4,cmap="coolwarm",
            vmin=-1,vmax=1,figsize=(6.8,3.5))
print("Rekonstruksjonsfeil:",errors)
```

I hvert par er bildet merket «Mål» laget tilfeldig. «Bygd mål» er rekonstruksjonen fra de fire mønstrene. Parene ser like ut, og normen av forskjellen er omkring $10^{-16}$ eller null. Det er numerisk evidens, ikke et bevis alene.

Matrisen `P` har ett mønster i hver kolonne. Ligningen `P @ c = target` spør hvilke fire mønsterstyrker `c` som gir det ønskede bildet. `P` er inverterbar, så hvert målbilde har nøyaktig én løsning. Mønstrene både spenner ut hele $\mathbb R^{2\times2}$ og er uavhengige; de danner dermed en ny basis.

Vi ser nærmere på koordinatene til bildet $X$ fra forrige fane.

```{pyodide-python}
#| label: week3-change-basis
#| autorun: true

c=np.linalg.solve(P,X.reshape(-1))
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

De fire første delbildene i figuren er koeffisienten ganget med det navngitte mønsteret. Det siste bildet er summen deres. Noen delbilder inneholder negative verdier, men summen rekonstruerer det opprinnelige bildet med vanlige pikselverdier.

Pikselbasisen beskriver bildet med fire lokale lysverdier. Mønsterbasisen beskriver det samme bildet som samlet lysnivå pluss tre typer kontrast. Bildet er uendret, men koordinatene har fått en annen betydning. Dette er et **basisskifte**: samme objekt, ny oppskrift.

::: {.callout-note}
## Hvorfor bytte basis?

En basis er ikke bare et sett som tilfredsstiller en definisjon. Et godt valg av basis kan skille egenskaper vi vil bevare fra egenskaper en transformasjon fjerner. Det er nettopp det som skjer i neste eksperiment.
:::

## 3.4 Hva beholder gjennomsnittet?

Nå lar vi den enkleste transformasjonen vi har — gjennomsnittet av fire tall — virke på de fire mønsterbyggesteinene. Inputen i hver kolonne er et $2\times2$-mønster. Den lille outputen under viser det ene tallet transformasjonen produserer. Fordi gjennomsnittet er lineært, vil resultatet for disse fire byggesteinene senere fortelle oss resultatet for enhver kombinasjon av dem.

```{pyodide-python}
#| label: week3-average-patterns
#| autorun: true

outputs=[np.array([[np.mean(pattern)]]) for pattern in pattern_basis]
show_images(pattern_basis+outputs,
    pattern_names+[f"Output: {value.item():.1f}" for value in outputs],
    cols=4,cmap="coolwarm",vmin=-1,vmax=1,figsize=(6.8,3.4))
for name,pattern in zip(pattern_names,pattern_basis):
    print(f"{name:16s} -> gjennomsnitt {np.mean(pattern): .1f}")
```

Les figuren loddrett: De fire store bildene er inputene, og de fire små rutene er de tilhørende outputene. Lysnivåbildet har fire enere, så gjennomsnittet er 1. Hvert kontrastbilde har to enere og to minusenere; summen er 0 og gjennomsnittet er derfor 0.

Resultatene deler byggesteinene i to grupper. Transformasjonen registrerer lysnivåretningen, men sender hver kontrastretning til null. En vilkårlig kombinasjon av kontrastbildene får også gjennomsnitt null, fordi lineariteten fra 3.1 lar oss kombinere de tre nullresultatene.

::: {.callout-important}
## Uformell observasjon

Kontrastmønstrene er endringer vi kan legge til et bilde uten å endre gjennomsnittet. Transformasjonen kan ikke skille mellom bilder som bare er forskjellige med en kombinasjon av slike kontraster.
:::

Vi kontrollerer også den motsatte retningen: Kan tilfeldige bilder med gjennomsnitt null bygges av de tre kontrastmønstrene?

```{pyodide-python}
#| label: week3-build-zero-mean-images
#| autorun: true

C=np.column_stack([H.reshape(-1),V.reshape(-1),D.reshape(-1)])
rng=np.random.default_rng(12)
zero_mean_images=[]; rebuilt_images=[]; errors=[]
for _ in range(4):
    first_three=rng.uniform(-1,1,size=3)
    values=np.r_[first_three,-np.sum(first_three)]
    target=values.reshape(2,2)
    weights=np.linalg.solve(C[:3,:],values[:3])
    rebuilt=(C@weights).reshape(2,2)
    zero_mean_images.append(target); rebuilt_images.append(rebuilt)
    errors.append(np.linalg.norm(target-rebuilt))

interleaved=[]; titles=[]
for i,(target,rebuilt) in enumerate(zip(zero_mean_images,rebuilt_images),start=1):
    interleaved.extend([target,rebuilt])
    titles.extend([f"Nullmiddel {i}",f"Bygd {i}"])
show_images(interleaved,titles,cols=4,cmap="coolwarm",
            vmin=-2,vmax=2,figsize=(6.8,3.5))
print("Rekonstruksjonsfeil:",errors)
```

I hvert par er første bilde konstruert med fire tilfeldige tall som summerer til null. Det andre er bygd med bare `H`, `V` og `D`. De to bildene i hvert par er like, og rekonstruksjonsfeilen er null eller nær maskinpresisjon.

De fire forsøkene støtter påstanden: Bilder med sum null kan beskrives med tre uavhengige kontrastkoeffisienter. Hvorfor tre? Når de første tre pikselverdiene er valgt, må den siste være minus summen av dem. Vi har derfor tre frie valg og én verdi som er bestemt av de andre. Nå har vi et konkret behov for et navn på hele denne samlingen.

For en matrise $A$ kalles alle inputvektorer som gir output null for **nullrommet**:

$$N(A)=\{z:Az=0\}.$$

For gjennomsnittet av én $2\times2$-blokk er

$$N(A)=\operatorname{span}\{H,V,D\}.$$

Her er nullrommet nettopp alle $2\times2$-bilder med sum, og dermed gjennomsnitt, lik null. De tre uavhengige byggesteinene $H,V,D$ spenner ut denne samlingen, så de danner en basis og nullrommet har dimensjon 3. Nullrommet er altså ikke bare selve nullbildet; det kan inneholde mange ikke-null inputbilder som transformasjonen ikke registrerer.

Dette forklarer åpningsproblemet steg for steg. Hvis $Ax_1=Ax_2$, kan vi trekke den ene outputen fra den andre. Linearitet gir $A(x_1-x_2)=0$. Forskjellsbildet $x_1-x_2$ ligger derfor i nullrommet. Omvendt kan vi legge enhver nullromsendring til et bilde uten å endre outputen:

$$Ax_1=Ax_2\quad\Longleftrightarrow\quad A(x_1-x_2)=0.$$

```{pyodide-python}
#| label: week3-family-same-average
#| autorun: true

base=np.full((2,2),0.5)
direction=0.35*D
t_values=[-1.,-0.5,0.,0.5,1.]
family=[base+t*direction for t in t_values]
show_images(family,
    [f"$t={t:g}$\ngjennomsnitt={np.mean(image):.2f}" for t,image in zip(t_values,family)],
    cols=5,vmin=0,vmax=1,figsize=(7.0,1.7))
```

Det midterste bildet har $t=0$ og er ensfarget. Negative og positive verdier av $t$ legger til sjakkmønsteret med motsatt fortegn. Titlene viser at gjennomsnittet forblir $0.50$ i alle fem bilder, selv om kontrasten blir sterkere mot begge ender.

Når $t$ endres, flytter vi oss gjennom forskjellige bilder langs kontrastretningen $D$. Pikslene endres, men gjennomsnittet står stille. Nullrommet beskriver derfor alle forskjeller mellom inputer som denne målingen ikke kan oppdage.

## 3.5 Tolv endringer som ikke synes i outputen

Vi går tilbake fra én $2\times2$-blokk til hele $4\times4$-bildet. Transformasjonen beregner fire gjennomsnitt, ett i hvert hjørneområde. Derfor kan hver blokk inneholde sine egne usynlige kontraster.

Funksjonen `place_in_block` plasserer ett av mønstrene `H`, `V` eller `D` i en valgt blokk og fyller resten av bildet med null. Figuren organiseres blokk for blokk: fire plasseringer, med tre kontrasttyper i hver plassering. Det gir $4\cdot3=12$ bilder.

```{pyodide-python}
#| label: week3-full-null-basis
#| autorun: true

def place_in_block(pattern,block_row,block_col):
    Z=np.zeros((4,4))
    r,c=2*block_row,2*block_col
    Z[r:r+2,c:c+2]=pattern
    return Z

null_basis=[]; null_titles=[]
for br in range(2):
    for bc in range(2):
        for pattern,name in zip([H,V,D],["H","V","D"]):
            null_basis.append(place_in_block(pattern,br,bc))
            null_titles.append(f"Blokk ({br+1},{bc+1}), {name}")

show_images(null_basis,null_titles,cols=4,cmap="coolwarm",
            vmin=-1,vmax=1,figsize=(6.8,5.2))
```

Hvert bilde endrer bare to eller fire piksler innenfor én blokk. Positive og negative bidrag opphever hverandre, så gjennomsnittet i den blokken forblir null. De tre andre blokkene er allerede null. Dermed må hele $2\times2$-outputbildet bli null for hvert av de tolv inputbildene.

Neste celle kontrollerer dette numerisk. Deretter velger den tolv tilfeldige koeffisienter, skalerer hvert kontrastbilde og legger alle sammen. Det sammensatte inputbildet ser uregelmessig ut, men hver blokk har fortsatt sum null.

```{pyodide-python}
#| label: week3-random-null-image
#| autorun: true

for i,Zi in enumerate(null_basis,start=1):
    print(f"Mønster {i:2d}: ||A z|| = {np.linalg.norm(A_pool@Zi.reshape(-1)):.1e}")

rng=np.random.default_rng(7)
random_coefficients=rng.normal(size=12)
Z=sum(c*Zi for c,Zi in zip(random_coefficients,null_basis))
pooled_Z=average_pool(Z)
limit=np.max(np.abs(Z))
show_images([Z,pooled_Z],["Tilfeldig kombinasjon av 12 mønstre","Output"],
            cols=2,cmap="coolwarm",vmin=-limit,vmax=limit,figsize=(3.6,1.8))
```

Hvis $Az_1=0$ og $Az_2=0$, gir linearitet

$$A(\alpha z_1+\beta z_2)=0.$$

Det første bildet i den siste figuren er kombinasjonen av de tolv mønstrene. Det andre er outputen etter blokkgjennomsnitt. Den er null i alle fire posisjoner. Koden gjør dermed to observasjoner: Hver lokal kontrast gir output null, og en tilfeldig lineærkombinasjon av dem gir fremdeles output null. Grunnen er linearitet, ikke at vi var heldige med koeffisientene.

Nullrommet er altså en samling der vi kan addere bilder og multiplisere dem med tall uten å forlate samlingen. En slik lineær samling inni et større rom kalles et **underrom**. Vi trenger ingen nye regneregler; ordet beskriver bare at lineærkombinasjoner blir værende i samlingen.

De tolv viste byggesteinene påvirker enten forskjellige blokker eller forskjellige kontraster i samme blokk. Ingen av dem kan fjernes uten at vi mister en mulig lokal endring. Samtidig kan ethvert bilde med null gjennomsnitt i hver blokk bygges av dem, blokk for blokk. De danner derfor en basis for nullrommet, som har dimensjon 12.

## 3.6 Mulige outputer og rang

Vi har undersøkt hvilke endringer i inputbildet som ikke synes i outputen. Nå snur vi spørsmålet: **Hvilke $2\times2$-bilder kan transformasjonen faktisk produsere?**

Vi begynner med det enkleste mulige inputbildet: én piksel er 1, og alle andre er 0. Kall dette «slå på én piksel». Kolonne $j$ i matrisen er akkurat outputen vi får når inputpiksel $j$ er slått på. Vi gjør forsøket for alle 16 piksler og tegner hver outputvektor som et lite $2\times2$-bilde.

```{pyodide-python}
#| label: week3-columns-as-images
#| autorun: true

column_images=[A_pool[:,j].reshape(2,2) for j in range(16)]
show_images(column_images,[f"Kolonne {j+1}" for j in range(16)],
            cols=4,vmin=0,vmax=0.25,figsize=(6.8,5.8))
```

Nummereringen følger 16-vektoren fra 3.1: piksel 1–4 er første bilderad, 5–8 er andre bilderad, og så videre. Pikslene 1, 2, 5 og 6 ligger derfor i øvre venstre blokk. Når én av dem har verdi 1, blir blokkens gjennomsnitt $1/4$, mens de tre andre outputverdiene er null. De fire tilhørende kolonnebildene er identiske.

Pikslene 3, 4, 7 og 8 påvirker bare øvre høyre outputpiksel. Pikslene 9, 10, 13 og 14 påvirker nedre venstre, og de fire siste i nedre høyre blokk påvirker nedre høyre. De 16 kolonnene faller dermed i fire grupper. Figuren viser konkret at mange inputpiksler har samme virkning på outputen.

Dette forteller at vi har fire ulike måter å påvirke outputen på. Men kan disse fire måtene lage *ethvert* $2\times2$-bilde? Vi velger fire tilfeldige målbilder. For hvert målbilde lager koden et $4\times4$-bilde der alle pikslene i en blokk har ønsket outputverdi. Deretter kontrollerer vi hva gjennomsnittstransformasjonen gir.

```{pyodide-python}
#| label: week3-build-arbitrary-output
#| autorun: true

def expand_block_values(Y):
    """Gjør hver verdi i et 2x2-bilde til en konstant 2x2-blokk."""
    return np.repeat(np.repeat(Y,2,axis=0),2,axis=1)

rng=np.random.default_rng(24)
targets=[rng.random((2,2)) for _ in range(4)]
inputs=[expand_block_values(Y) for Y in targets]
outputs=[average_pool(Xi) for Xi in inputs]

panels=[]; titles=[]
for Xi,Yi,out in zip(inputs,targets,outputs):
    panels.extend([Xi,Yi,out])
    titles.extend(["Konstruert input","Ønsket output","Faktisk output"])
show_images(panels,titles,cols=3,vmin=0,vmax=1,figsize=(6.8,5.0))
print("Største feil:",max(np.linalg.norm(out-Yi)
                          for out,Yi in zip(outputs,targets)))
```

Les hver rad i figuren fra venstre mot høyre. Først vises et konstruert $4\times4$-inputbilde. I midten står outputen vi ba om. Til høyre står outputen transformasjonen faktisk beregnet. De to små bildene er identiske i alle fire forsøk.

Målbildene ble valgt tilfeldig, men den samme oppskriften virker for alle $2\times2$-bilder: kopier hver ønsket outputverdi inn i alle fire pikslene i den tilsvarende inputblokken. Gjennomsnittet av fire like tall er tallet selv. Feilen er derfor nøyaktig null, bortsett fra eventuell avrunding. Transformasjonen kan altså produsere alle vektorer i $\mathbb R^4$.

Samlingen av alle outputvektorer en matrise kan produsere, kalles **kolonnerommet**:

$$C(A)=\{Ax:x\in\mathbb R^{16}\}.$$

Navnet kan nå leses direkte fra eksperimentet. Hvis $a_j$ er kolonne $j$ i $A$, er

$$Ax=x_1a_1+\cdots+x_{16}a_{16}.$$

Formelen sier at inputverdien $x_j$ skalerer kolonnebildet $a_j$, og at de 16 skalerte bidragene legges sammen. Alle outputer bygges dermed som lineærkombinasjoner av kolonnebildene. Dette er den samme byggesteinsideen som for basisbilder, men nå er byggesteinene bestemt av transformasjonsmatrisen.

I vårt eksempel holder det å beholde én kolonne fra hver av de fire gruppene, for eksempel kolonne 1, 3, 9 og 11. Disse fire kan varieres uavhengig og bygger alle mulige outputbilder. De andre tolv kolonnene gjentar virkninger vi allerede har.

Vi gjør ett eksperiment til før vi gir denne tellingen et navn. Vi legger til en femte måling: gjennomsnittet av alle de 16 inputpikslene. Den nye outputverdien ser ut som mer informasjon, men den kan beregnes fra de fire blokkgjennomsnittene.

```{pyodide-python}
#| label: week3-redundant-output
#| autorun: true

A_five=np.vstack([A_pool,np.ones(16)/16])
X_test=rng.random((4,4))
y=A_five@X_test.reshape(-1)
print("Fem outputverdier:",y)
print("Femte verdi:",y[4])
print("Gjennomsnitt av de fire første:",np.mean(y[:4]))
print("Rang med fire outputer:",np.linalg.matrix_rank(A_pool))
print("Rang med fem outputer:",np.linalg.matrix_rank(A_five))
```

Utskriften viser at den femte outputverdien er nøyaktig gjennomsnittet av de fire første. Matrisen har nå fem rader, men den femte målingen gir ingen ny justeringsmulighet og ingen ny informasjon om inputen. Den er bestemt av de fire andre. Antallet uavhengige outputretninger kalles matrisens **rang**:

**Rangen** er dimensjonen til kolonnerommet:

$$\operatorname{rank}(A)=\dim C(A).$$

Uformelt teller rangen hvor mange outputverdier som kan varieres uavhengig. De fire blokkgjennomsnittene kan velges fritt, så rangen er 4. Å legge til en femte verdi som allerede er bestemt av de andre, endrer ikke rangen.

```{pyodide-python}
#| label: week3-rank-check

print("Inputverdier:",A_pool.shape[1])
print("Outputverdier:",A_pool.shape[0])
print("Numerisk rang:",np.linalg.matrix_rank(A_pool))
```

Vi startet med 16 uavhengige pikselverdier. Eksperimentene har delt disse variasjonsmulighetene i to typer. Fire kombinasjoner — blokkgjennomsnittene — bestemmer det som kan sees i outputen. Tolv kontrastmønstre kan endres uten at outputen merker det. Dette er ikke et tilfeldig sammentreff: De synlige og usynlige variasjonene gjør sammen rede for alle 16 inputmulighetene:

$$16=4+12.$$

For en matrise med $n$ kolonner sier **rang-nullitet** at

$$n=\operatorname{rank}(A)+\dim N(A).$$

::: {.callout-note}
## Tolkning

- Rangen teller uavhengige outputretninger.
- Nulliteten teller uavhengige inputretninger som transformeres til null.
- Til sammen gjør de rede for alle inputdimensjonene.
:::

## 3.7 Egne eksperimenter

Hjelpefunksjonene, transformasjonen og mønsterbildene fra de foregående delene er tilgjengelige under. Her skal du endre kode og lete etter mønstre selv. Arbeid i samme rekkefølge som i forelesningen:

1. Gjett først hva figuren eller outputen vil vise.
2. Kjør eksperimentet og beskriv det du faktisk ser.
3. Kontroller observasjonen med et tall, for eksempel en residual eller en rang.
4. Forklar til slutt observasjonen med begrepene fra uka.

Startcellene gjør plotting og bokføring, men gir ikke ferdige svar. Et forsøk som ikke virker ved første kjøring kan være nyttig: undersøk forskjellen mellom det du forventet og det koden faktisk produserte.

### A. Lag et nytt mønster med output null

Endre `Z`. Hver $2\times2$-blokk skal ha gjennomsnitt null, men bruk ikke sjakkmønsteret uendret. Før du kjører cellen, regn ut minst ett blokkgjennomsnitt for hånd. Figuren viser om mønsteret forsvinner, mens normen under figuren måler hvor nær outputen er null.

```{pyodide-python}
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

### B. Hva kan tre byggesteiner lage?

Velg tre mønsterbilder og generer åtte tilfeldige lineærkombinasjoner. Se etter en egenskap som går igjen i alle bildene: finnes det for eksempel en symmetri, en fast sum eller en type kontrast som aldri opptrer? Bytt deretter ut én byggestein og se hvilken ny variasjon som blir mulig.

```{pyodide-python}
rng=np.random.default_rng(10)
my_building_blocks=[M,H,V]  # Bytt gjerne ut disse.
my_images=[]
for _ in range(8):
    c=rng.uniform(-1,1,size=3)
    my_images.append(sum(value*block for value,block
                         in zip(c,my_building_blocks)))
show_images(my_images,[""]*8,cols=4,cmap="coolwarm",vmin=-2,vmax=2)
```

Forsøk å lage et konkret $2\times2$-målbilde som de tre byggesteinene ikke kan treffe. Dette er den eksperimentelle siden av dimensjon: tre uavhengige justeringsmuligheter kan ikke styre fire uavhengige pikselverdier.

### C. Lag en annen basis

Bytt ut minst to av bildene. Prøv gjerne først et valg der ett bilde kan bygges av de andre. Observer hva rangen blir og om ligningssystemet kan løses. Endre deretter byggesteinene til rangen blir 4; da skal fire koeffisienter kunne styre de fire pikselverdiene uavhengig.

```{pyodide-python}
B1,B2,B3,B4=E1.copy(),E2.copy(),E3.copy(),E4.copy()
my_basis=[B1,B2,B3,B4]
Q=np.column_stack([B.reshape(-1) for B in my_basis])
show_images(my_basis,["$B_1$","$B_2$","$B_3$","$B_4$"],
            cols=4,cmap="coolwarm",vmin=-1,vmax=1)
print("Rang:",np.linalg.matrix_rank(Q))

target=rng.uniform(-1,1,size=(2,2))
if np.linalg.matrix_rank(Q)==4:
    coordinates=np.linalg.solve(Q,target.reshape(-1))
    reconstruction=(Q@coordinates).reshape(2,2)
    show_images([target,reconstruction],["Målbilde","Rekonstruksjon"],
                cols=2,cmap="coolwarm",vmin=-1,vmax=1)
else:
    print("Byggesteinene er avhengige. Endre dem og prøv igjen.")
```

### D. Design en ny bildereduksjon

Lag en lineær transformasjon fra 16 inputpiksler til høyst 6 outputverdier. Hver rad i `A_new` er én måling av bildet. Tegn først hvilke piksler målingen skal bruke, og sett så inn de tilsvarende vektene i raden. Mulige ideer er radgjennomsnitt, kolonnegjennomsnitt, diagonalsummer eller utvalgte piksler.

```{pyodide-python}
A_new=np.zeros((4,16))

# TODO: Sett inn vekter som beskriver transformasjonen.

test_image=rng.random((4,4))
test_output=A_new@test_image.reshape(-1)
show_images([test_image],["Testbilde"],cols=1,vmin=0,vmax=1)
print("Output:",test_output)
print("Rang:",np.linalg.matrix_rank(A_new))
print("Nullitet:",16-np.linalg.matrix_rank(A_new))
```

Test flere bilder med tydelig struktur, ikke bare det tilfeldige bildet. Finn deretter et ikke-null bilde som transformasjonen sender til null. Vis dette bildet og outputen ved siden av hverandre. Forklar hva hver rad i matrisen måler, og hvilke bildeendringer som derfor ikke registreres.

### E. Nesten samme måling

To målinger kan være matematisk forskjellige, men så like at maskinen får problemer med å skille dem. Vi begynner med å tegne vektene i de to målingene. Den første summerer alle piksler likt. Den andre gir bare den siste pikselen en ørliten ekstra vekt.

```{pyodide-python}
#| label: week3-nearly-same-measurements-picture
#| autorun: true

def nearly_redundant_measurements(eps,dtype=float):
    first=np.ones(16)
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

for exponent in [2,6,10,14,18]:
    eps=10.0**(-exponent)
    A64=nearly_redundant_measurements(eps,np.float64)
    A32=nearly_redundant_measurements(eps,np.float32)
    print(f"eps={eps:.0e}",
          "rang float64 =",np.linalg.matrix_rank(A64),
          "rang float32 =",np.linalg.matrix_rank(A32))
```

På papiret er målingene uavhengige for enhver $\varepsilon\neq0$: den lille ekstravekten kan ikke lages ved bare å skalere den første raden. I maskinen kan ekstravekten bli avrundet bort, eller bli vurdert som for liten til å være pålitelig. `matrix_rank` bruker derfor en toleranse og rapporterer en **numerisk rang**. Beskriv når de to tallformatene slutter å skille målingene, og knytt resultatet til feil- og toleransebegrepene fra uke 2.

### F. Kort leveranse

Velg aktivitet C, D eller E. Lever:

1. koden som konstruerer transformasjonen eller basisen;
2. minst én figur med input, byggesteiner eller output;
3. en numerisk kontroll med residual eller rang;
4. en kort forklaring av hvilke variasjoner som bevares, og hvilke som ikke kan bestemmes fra outputen.

:::
