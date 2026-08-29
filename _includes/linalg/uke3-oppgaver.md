Her trener du på hele kjeden fra radreduksjon til basis og rang. Start med
papiroppgavene; bruk kodeoppgaven nederst til å kontrollere regningen og
eksperimentere videre.


Arbeid med én matrise om gangen:

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

**På papir:**

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

#### Oppgaver for $B$

```{math-exercise}
#| label: week3-paper-b-echelon
#| caption: Trappeform og pivoter for B
#| mode: custom
#| partial-credit: true
#| field-labels: r₁₁, r₁₂, r₁₃, r₂₁, r₂₂, r₂₃, r₃₁, r₃₂, r₃₃
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       values = response["expressions"]
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
#|               result["feedback"] = "De grønne kolonnene er gyldige og uavhengige, men de spenner ennå ikke hele nullrommet."
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

#### Oppgaver for $C$

```{math-exercise}
#| label: week3-paper-c-echelon
#| caption: Trappeform og pivoter for C
#| mode: custom
#| partial-credit: true
#| field-labels: r₁₁, r₁₂, r₁₃, r₂₁, r₂₂, r₂₃
#| context: week3-paper-assessment-context
#| checker: |
#|   def check(response, symbols):
#|       values = response["expressions"]
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
#|               result["feedback"] = "De grønne kolonnene er gyldige og uavhengige, men de spenner ennå ikke hele nullrommet."
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

**Med kode:**

1. Kontroller trappeformen og pivotkolonnene med `row_echelon`.
2. Kontroller nullromsvektorene ved å beregne `M @ Z`.
3. Lag to forskjellige inputer med samme output.
4. Finn én output som kan produseres, og én som ikke kan produseres.

```{pyodide-python}
#| label: week3-pure-matrix-exercises

import numpy as np

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

M=B  # Bytt til C når du er ferdig med B.
R_M,pivots_M=row_echelon(M)
print("Trappeform:\n",R_M)
print("Pivotkolonner:",[j+1 for j in pivots_M])

# TODO: Sett inn nullromsvektorene du fant på papir som kolonner i Z_M.
Z_M=np.zeros((M.shape[1],0))
print("Kontroll M @ Z_M:\n",M@Z_M)

# TODO: Velg x0 og en nullromsvektor z, og sammenlign M@x0 med M@(x0+z).

# TODO: Lag rhs_yes og rhs_no. Sammenlign rang(M) med rang([M | rhs]).
```
