Matriser og piler er ikke de eneste byggesteinene i lineær algebra. Et
polynom kan også være en vektor. Det høres uvant ut, men regningen er den
samme: Vi legger sammen byggesteiner og ganger dem med tall.

## Fra polynom til koordinater

I rommet

$$
\mathcal P_3=\{a_0+a_1x+a_2x^2+a_3x^3 : a_i\in\mathbb R\}
$$

er alle polynomer av grad høyst 3 tillatt. Koeffisientene er koordinatene til
polynomet i standardbasisen $(1,x,x^2,x^3)$:

$$
a_0+a_1x+a_2x^2+a_3x^3
\quad\longleftrightarrow\quad
\begin{bmatrix}a_0\\a_1\\a_2\\a_3\end{bmatrix}.
$$

Rekkefølgen er viktig: konstantleddet står øverst, deretter kommer
koeffisientene til $x$, $x^2$ og $x^3$. Mangler en potens, er koeffisienten
null. For eksempel svarer $2-3x+x^2$ til $(2,-3,1)^T$ i $\mathcal P_2$.

```{math-exercise}
#| label: week3-polynomial-coefficients
#| caption: Les av koeffisientene
#| partial-credit: true

Skriv koordinatvektoren til $p(x)=4-2x+3x^2$ i standardbasisen
$(1,x,x^2)$:

$[p]_{(1,x,x^2)}=$ vec[4,-2,3]
```

::: {#week3-polynomial-basis-context .math-exercise-context}

Hver kolonne i en koeffisientmatrise representerer ett polynom. Radene står i
rekkefølgen konstantledd, $x$, $x^2$ og $x^3$. En basis består av polynomer som
er lineært uavhengige og som spenner ut hele det etterspurte rommet.

I basisoppgavene kan polynomene komme i hvilken som helst rekkefølge. Røde
kolonner er null eller ligger utenfor rommet. Hvis de gyldige kolonnene er
lineært avhengige, farges hele familien gul. En grønn familie er gyldig og
uavhengig, men kan fortsatt være for liten til å spenne ut hele rommet.

:::

## Velg andre polynomklosser

Standardbasisen er praktisk, men den er ikke den eneste muligheten. Andre
polynomer kan være like gode byggesteiner for $\mathcal P_3$, så lenge
ingen av dem kan lages av de andre. I matrisen under er hver kolonne ett
polynom, og du velger selv hvor mange kolonner svaret skal ha.

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

## Et underrom av polynomer

Vi kan også begynne med noen polynomer og spørre hvilke uavhengige retninger
de bygger. La

$$
\begin{aligned}
p_1&=1+x, & p_2&=x+x^2,\\
p_3&=1+x^2+x^3, & p_4&=2-x-x^2+x^3.
\end{aligned}
$$

Alle lineærkombinasjoner av disse danner et underrom
$U=\operatorname{Span}(p_1,p_2,p_3,p_4)$ i $\mathcal P_3$. En basis for $U$
kan bestå av noen av polynomene over, eller av helt andre polynomer som bygger
nøyaktig det samme rommet.

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

## Koordinater i en ny basis

Når basisen skifter, skifter koordinatene, selv om polynomet er det samme. I
$\mathcal P_2$ bruker vi nå basisen $\mathcal B=(p_1,p_2,p_3)$, der

$$
p_1=x^2-2,\qquad
p_2=-x^2+x+2,\qquad
p_3=3x^2+x-5.
$$

Å finne $[q]_{\mathcal B}$ betyr å finne tall $c_1,c_2,c_3$ slik at

$$q=c_1p_1+c_2p_2+c_3p_3.$$

Sammenlign koeffisientene til $1$, $x$ og $x^2$ på begge sider. Da får du et
vanlig lineært ligningssystem for $c_1,c_2,c_3$.

```{math-exercise}
#| label: week3-polynomial-coordinates
#| caption: Koordinater i en polynombasis
#| partial-credit: true

Finn koordinatvektoren til $q(x)=4x^2+x-7$ i basisen $\mathcal B$:

$[q]_{\mathcal B}=$ mat[1;0;1]
```

Det er hele poenget med «andre typer byggesteiner»: Vi regner fortsatt med
koordinater, lineærkombinasjoner, spenn og basis. Det eneste nye er at hver
koordinatkolonne nå beskriver et polynom i stedet for en pil i planet.
