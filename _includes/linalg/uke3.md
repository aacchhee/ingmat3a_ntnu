## Femukersplan for numerisk lineær algebra

| Uke | Spørsmålet vi starter med | Matematisk innhold og kobling til anvendelser |
|---|---|---|
| **3** | **Kan forskjellige inputvektorer gi samme output?** Vi undersøker en transformasjon der $Ax_1=Ax_2$, selv om $x_1\neq x_2$. Outputen er da ikke tilstrekkelig til å avgjøre hvilken input som ble brukt. Forskjellen $x_1-x_2$ transformeres til null. | Kolonnerommet beskriver alle outputvektorer transformasjonen kan produsere. Nullrommet består av inputretningene som transformeres til null. Ved bildereduksjon kan ulike bilder derfor gi samme reduserte bilde. |
| **4** | **Hva gjør vi når en ønsket output ikke kan produseres nøyaktig?** For støyfylte data ligger $b$ vanligvis ikke blant outputvektorene $Ax$ som modellen kan produsere. Vi søker derfor den oppnåelige outputen som ligger nærmest $b$. | Ortogonal projeksjon leder til minste kvadraters metode, Gram–Schmidt og QR-faktorisering. Minste kvadrater er en grunnleggende metode for å tilpasse lineære modeller til data. |
| **5** | **Hva skjer når vi gjentar den samme transformasjonen?** Vi beregner $x_{k+1}=Ax_k$ flere ganger og normaliserer underveis. Under bestemte betingelser vil én retning etter hvert dominere. | Egenvektorer er retninger som transformasjonen bevarer, bortsett fra skalering og eventuelt fortegn. Dette leder til potensmetoden og PageRank. Beslektede spektrale metoder brukes til å analysere grafer og finne mønstre i data. |
| **6** | **Hvordan finner vi inputen som gir en bestemt output når systemet er stort?** Vi ønsker å løse $Ax=b$, men en generell tett løsningsmetode kan bruke unødvendig mye tid og minne. | Cholesky, Gauss–Seidel, konjugerte gradienter og prekondisjonering viser hvordan matrisestruktur kan utnyttes. Store lineære systemer oppstår blant annet i optimering og maskinlæring. |
| **7** | **Hvilke inputretninger påvirker outputen mest?** Vi deler transformasjonen opp i ortogonale inputretninger og måler hvor sterkt hver retning forsterkes eller dempes. | SVD samler ideene om kolonnerom, nullrom, rang og følsomhet. Lavrangsapproksimasjoner brukes til dimensjonsreduksjon, kompresjon, støyfiltrering og tilnærming av store vektmatriser i KI-modeller. |

::: {.panel-tabset}

## 3.0 To bilder, samme output

Vi begynner med to bilder som ser helt forskjellige ut. Det første er ensfarget. Det andre har et tydelig sjakkmønster. Vi reduserer hvert bilde fra $4\times4$ til $2\times2$ piksler ved å erstatte hver $2\times2$-blokk med gjennomsnittet i blokken.

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
    figsize = (2.6*cols, 2.6*rows) if figsize is None else figsize
    fig, axes = plt.subplots(rows, cols, figsize=figsize, squeeze=False)
    axes = axes.ravel()
    for ax, image, title in zip(axes, images, titles):
        ax.imshow(image, cmap=cmap, vmin=vmin, vmax=vmax,
                  interpolation="nearest")
        ax.set_title(title)
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

Dette er ikke en avrundingsfeil. Fra outputen alene kan vi ikke avgjøre hvilket bilde som var input. Prøv å endre `X2` uten å endre gjennomsnittet i hver blokk.

## 3.1 Bildet som vektor

Et bilde lagres som en tabell, men vi kan samle pikselverdiene i en vektor. Et $4\times4$-bilde blir en vektor i $\mathbb R^{16}$. Blokkgjennomsnittet kan da skrives

$$y=Ax,$$

der $A$ har fire rader og seksten kolonner.

```{pyodide-python}
#| label: week3-pooling-as-matrix
#| autorun: true

x1, x2 = X1.reshape(-1), X2.reshape(-1)
y1, y2 = A_pool @ x1, A_pool @ x2
print("Bildeform:", X1.shape, "  vektorform:", x1.shape)
print("A har form", A_pool.shape)
print("A @ x1 =", y1)
print("A @ x2 =", y2)

plt.figure(figsize=(9, 2.8))
plt.imshow(A_pool, cmap="Blues", vmin=0, vmax=0.25,
           interpolation="nearest", aspect="auto")
plt.xlabel("Pikselnummer i inputen")
plt.ylabel("Pikselnummer i outputen")
plt.title("Matrisen som beregner fire blokkgjennomsnitt")
plt.colorbar(label="Vekt"); plt.tight_layout(); plt.show()
```

Transformasjonen er **lineær**:

$$A(\alpha x+\beta z)=\alpha Ax+\beta Az.$$

```{pyodide-python}
#| label: week3-check-linearity

rng = np.random.default_rng(3)
x, z = rng.random(16), rng.random(16)
alpha, beta = 1.7, -0.4
left = A_pool @ (alpha*x + beta*z)
right = alpha*(A_pool@x) + beta*(A_pool@z)
print("Numerisk forskjell:", np.linalg.norm(left-right))
```

Matematisk er forskjellen null. Et eventuelt lite avvik kommer fra flyttallsregning.

## 3.2 Basisbilder og dimensjon

Vi går ned til $2\times2$-bilder. Mengden av alle slike bilder kalles $\mathbb R^{2\times2}$. De fire bildene under har én lys piksel hver.

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

show_images(pixel_basis+components+[X],
    ["$E_1$","$E_2$","$E_3$","$E_4$",
     "$0.2E_1$","$0.7E_2$","$0.4E_3$","$0.9E_4$","Summen"],
    cols=5,vmin=0,vmax=1)
```

$$X=0.2E_1+0.7E_2+0.4E_3+0.9E_4.$$

::: {.callout-tip}
## Byggesteiner og koordinater

De fire basisbildene er byggesteiner. Koeffisientene forteller hvor mye vi bruker av hver byggestein. Her er koeffisientene selve pikselverdiene.
:::

Bildene **spenner ut** $\mathbb R^{2\times2}$ fordi alle $2\times2$-bilder kan bygges av dem. Ingen kan bygges av de tre andre; de er **lineært uavhengige**. Dermed danner de en **basis**.

**Dimensjonen** er antallet uavhengige byggesteiner i en basis:

$$\dim(\mathbb R^{2\times2})=4.$$

Dimensjon teller her uavhengige tall, ikke retninger på skjermen. Tilsvarende har $\mathbb R^{4\times4}$ dimensjon 16.

```{pyodide-python}
#| label: week3-missing-and-redundant
#| autorun: true

rng=np.random.default_rng(4)
three_images=[]
for _ in range(8):
    c=rng.random(3)
    three_images.append(c[0]*E1+c[1]*E2+c[2]*E3)

E5=E1+E2
show_images(three_images+[E1,E2,E5,E1+E2],
    [""]*8+["$E_1$","$E_2$","$E_5$","$E_1+E_2$"],
    cols=4,vmin=0,vmax=1)
```

Med bare tre byggesteiner blir nedre høyre piksel alltid null; vi får et rom med dimensjon 3. Bildet $E_5=E_1+E_2$ er derimot overflødig. Fem byggesteiner gir fortsatt dimensjon 4, og samme bilde får flere beskrivelser.

## 3.3 En basis som beskriver mønstre

En basis er ikke unik. Vi kan velge byggesteiner som beskriver egenskaper ved bildet i stedet for enkeltpiksler.

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

Også disse fire bildene danner en basis for $\mathbb R^{2\times2}$. Det første beskriver samlet lysnivå. De andre beskriver tre forskjellige kontraster.

Vi finner koordinatene ved å løse et lineært system. Hver kolonne i `P` er ett basisbilde skrevet som vektor.

```{pyodide-python}
#| label: week3-change-basis
#| autorun: true

P=np.column_stack([pattern.reshape(-1) for pattern in pattern_basis])
c=np.linalg.solve(P,X.reshape(-1))
pattern_components=[value*pattern for value,pattern in zip(c,pattern_basis)]
reconstructed=(P@c).reshape(2,2)
scale=max(np.max(np.abs(part)) for part in pattern_components)

show_images(pattern_components+[reconstructed],
    [f"{c[i]:.2f} · {pattern_names[i]}" for i in range(4)]+["Summen"],
    cols=5,cmap="coolwarm",vmin=-scale,vmax=scale)
print("Pikselkoordinater: ",coefficients)
print("Mønsterkoordinater:",c)
print("Rekonstruksjonsfeil:",np.linalg.norm(reconstructed-X))
```

Bildet er uendret, men koordinatene har fått en annen betydning. En basis er dermed også et valg av hvordan dataene beskrives.

## 3.4 Hva beholder gjennomsnittet?

Vi bruker nå gjennomsnittet på de fire mønsterbildene.

```{pyodide-python}
#| label: week3-average-patterns
#| autorun: true

outputs=[np.array([[np.mean(pattern)]]) for pattern in pattern_basis]
show_images(pattern_basis+outputs,
    pattern_names+[f"Output: {value.item():.1f}" for value in outputs],
    cols=4,cmap="coolwarm",vmin=-1,vmax=1)
for name,pattern in zip(pattern_names,pattern_basis):
    print(f"{name:16s} -> gjennomsnitt {np.mean(pattern): .1f}")
```

Gjennomsnittet beholder lysnivået, mens alle tre kontrastmønstrene gir output null.

::: {.callout-important}
## Uformell observasjon

Kontrastmønstrene er endringer vi kan legge til et bilde uten å endre gjennomsnittet. Transformasjonen kan ikke skille mellom bilder som bare er forskjellige med en kombinasjon av slike kontraster.
:::

For en matrise $A$ kalles alle inputvektorer som gir output null for **nullrommet**:

$$N(A)=\{z:Az=0\}.$$

For gjennomsnittet av én $2\times2$-blokk er

$$N(A)=\operatorname{span}\{H,V,D\}.$$

Alle bilder med gjennomsnitt null kan bygges av de tre kontrastbildene. Nullrommet har derfor dimensjon 3. To inputer gir samme output akkurat når forskjellen ligger i nullrommet:

$$Ax_1=Ax_2\quad\Longleftrightarrow\quad A(x_1-x_2)=0.$$

```{pyodide-python}
#| label: week3-family-same-average
#| autorun: true

base=np.full((2,2),0.5)
direction=0.35*D
t_values=[-1.,-0.5,0.,0.5,1.]
family=[base+t*direction for t in t_values]
show_images(family,
    [f"$t={t:g}$\nmiddel={np.mean(image):.2f}" for t,image in zip(t_values,family)],
    cols=5,vmin=0,vmax=1)
```

## 3.5 Tolv endringer som ikke synes i outputen

Det opprinnelige bildet består av fire blokker. I hver blokk kan vi plassere tre uavhengige kontrastmønstre med gjennomsnitt null.

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
            vmin=-1,vmax=1,figsize=(10.5,8))
```

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
            cols=2,cmap="coolwarm",vmin=-limit,vmax=limit)
```

Hvis $Az_1=0$ og $Az_2=0$, gir linearitet

$$A(\alpha z_1+\beta z_2)=0.$$

Nullrommet er altså en samling der vi kan addere og skalere uten å forlate samlingen. En slik samling kalles et **underrom**. De tolv viste byggesteinene danner en basis for nullrommet til blokkgjennomsnittet, så nullrommet har dimensjon 12.

## 3.6 Mulige outputer og rang

**Kolonnerommet** er samlingen av alle outputvektorer transformasjonen kan produsere:

$$C(A)=\{Ax:x\in\mathbb R^{16}\}.$$

Navnet kommer fra at $Ax=x_1a_1+\cdots+x_{16}a_{16}$, der $a_j$ er kolonnene i $A$. Hver kolonne viser outputen når bare én inputpiksel endres. Vi tegner de 16 kolonnene som $2\times2$-bilder.

```{pyodide-python}
#| label: week3-columns-as-images
#| autorun: true

column_images=[A_pool[:,j].reshape(2,2) for j in range(16)]
show_images(column_images,[f"Kolonne {j+1}" for j in range(16)],
            cols=4,vmin=0,vmax=0.25,figsize=(9,9))
```

Fire grupper av kolonner er identiske. Vi trenger bare én kolonne fra hver gruppe for å bygge alle mulige outputbilder. Kolonne 1, 3, 9 og 11 er ett mulig valg av basis for kolonnerommet.

**Rangen** er dimensjonen til kolonnerommet:

$$\operatorname{rank}(A)=\dim C(A).$$

Uformelt teller rangen hvor mange uavhengige outputverdier transformasjonen kan produsere. De fire blokkgjennomsnittene kan velges uavhengig, så rangen er 4. Først nå lar vi NumPy kontrollere tellingen.

```{pyodide-python}
#| label: week3-rank-check

print("Inputverdier:",A_pool.shape[1])
print("Outputverdier:",A_pool.shape[0])
print("Numerisk rang:",np.linalg.matrix_rank(A_pool))
```

Inputrommet har dimensjon 16. Fire uavhengige kombinasjoner synes i outputen, mens tolv uavhengige kombinasjoner ligger i nullrommet:

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

Hjelpefunksjonene og basisbildene fra de foregående delene er tilgjengelige under. Lag figurer og bruk residualer eller rang til å kontrollere påstandene dine. Startcellene gir infrastruktur, men ikke alle svarene.

### A. Lag et nytt mønster med output null

Endre `Z`. Hver $2\times2$-blokk skal ha gjennomsnitt null, men bruk ikke sjakkmønsteret uendret.

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

Legg deretter mønsteret til et vanlig bilde. Velg størrelsen slik at pikselverdiene fortsatt ligger mellom 0 og 1, og vis at outputen er uendret.

### B. Hva kan tre byggesteiner lage?

Velg tre mønsterbilder, generer åtte kombinasjoner og beskriv en egenskap alle bildene har.

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

Hvorfor kan tre uavhengige byggesteiner ikke lage alle $2\times2$-bilder?

### C. Lag en annen basis

Bytt ut minst to av bildene. Hvis byggesteinmatrisen har rang 4, kan de fire bildene bygge alle $2\times2$-bilder.

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

Lag en lineær transformasjon fra 16 inputpiksler til høyst 6 outputverdier. Mulige ideer er radgjennomsnitt, kolonnegjennomsnitt, diagonalsummer eller utvalgte piksler.

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

Finn et ikke-null bilde som transformasjonen sender til null. Forklar hva transformasjonen måler, og hvilke endringer den ikke registrerer.

### E. Nesten samme måling

To målinger kan være matematisk forskjellige, men så like at maskinen får problemer med å skille dem. Endre `eps` og sammenlign `float64` og `float32`.

```{pyodide-python}
def nearly_redundant_measurements(eps,dtype=float):
    first=np.ones(16)
    second=first.copy(); second[-1]+=eps
    return np.vstack([first,second]).astype(dtype)

for exponent in [2,6,10,14,18]:
    eps=10.0**(-exponent)
    A64=nearly_redundant_measurements(eps,np.float64)
    A32=nearly_redundant_measurements(eps,np.float32)
    print(f"eps={eps:.0e}",
          "rang float64 =",np.linalg.matrix_rank(A64),
          "rang float32 =",np.linalg.matrix_rank(A32))
```

Den tilsvarende eksakte matrisen har rang 2 når $\varepsilon\neq0$. I en flyttallsberegning kan selve perturbasjonen forsvinne, og `matrix_rank` bruker dessuten en toleranse når den rapporterer **numerisk rang**. Beskriv når de to tallformatene slutter å skille målingene.

### F. Kort leveranse

Velg aktivitet C, D eller E. Lever:

1. koden som konstruerer transformasjonen eller basisen;
2. minst én figur med input, byggesteiner eller output;
3. en numerisk kontroll med residual eller rang;
4. en kort forklaring av hvilke variasjoner som bevares, og hvilke som ikke kan bestemmes fra outputen.

:::
