#### Når tallformatet setter en grense

::: {#binary-format-iteration-givens .math-exercise-context}

Vi bruker iterasjonen for $\sqrt{2}$ som vi bygger i 2.5,

$$
x_{n+1}=\frac12\left(x_n+\frac{2}{x_n}\right),
\qquad x_0=1,
$$

og utfører nøyaktig de samme regneoperasjonene i to tallformater:

- **binary32**, representert med `numpy.float32`, har omtrent 7 signifikante desimalsifre,
- **binary64**, representert med vanlig Python `float`, har omtrent 15–16 signifikante desimalsifre.

Referanseverdien beregnes med 80 desimalsifres presisjon og brukes bare til å måle feil. Hvert iterat i de to kjøringene blir derimot lagret i det angitte tallformatet.

:::

```{pyodide-python}
#| label: ingmat-ide-module2-m2-4-exercises-1
#| feedback-context: ide-page4-reference-assumptions, ide-page4-np-6f11581d, ide-page4-plot-error-curves-34829957
#| canvas: false

from decimal import Decimal, getcontext

getcontext().prec = 80
sqrt2_reference = Decimal(2).sqrt()

def error_against_reference(value):
    stored_value = Decimal(float(value))
    return float(abs(stored_value - sqrt2_reference))

number_of_steps = 8
x32 = np.float32(1.0)
x64 = 1.0
errors32 = []
errors64 = []

for _ in range(number_of_steps + 1):
    errors32.append(error_against_reference(x32))
    errors64.append(error_against_reference(x64))

    x32 = np.float32(
        (x32 + np.float32(2.0)/x32) / np.float32(2.0)
    )
    x64 = (x64 + 2.0/x64) / 2.0

# Tegnekoden ligger i oppsettet.
plot_error_curves([errors32, errors64], ["binary32", "binary64"],
                  "Samme iterasjon i binary32 og binary64",
                  ylabel=r"Absolutt feil $|x_n-\sqrt{2}|$")
```

Begge kurvene faller raskt i starten fordi iterasjonen konvergerer kvadratisk nær løsningen (det forklarer vi i 2.5). Etter noen steg blir hver kurve vannrett. Dette **feilplatået** betyr at tallformatet ikke kan lagre en bedre tilnærming med denne iterasjonen. Flere steg gjentar bare samme lagrede verdi.

Legg merke til forskjellen mellom skrittlengde og feil mot referanseverdien: Når to påfølgende lagrede verdier er like, er skrittlengden $|x_{n+1}-x_n|=0$. Feilen mot den mer presise referansen er likevel ikke null. Et stopp på grunn av null skrittlengde betyr derfor «ingen videre endring i dette tallformatet», ikke «eksakt løsning».

::: {#binary-format-plateau-context .math-exercise-context}

De samme lagrede iteratene og feilene som i plottet står her. Tallene i
kolonnene for $x_n$ viser den lagrede verdien med 17 signifikante sifre;
feilene er målt mot referansen med 80 desimalsifres presisjon.

| $n$ | binary32: $x_n$ | binary64: $x_n$ | binary32: $\lvert x_n-\sqrt2\rvert$ | binary64: $\lvert x_n-\sqrt2\rvert$ |
|---:|---:|---:|---:|---:|
| 0 | 1 | 1 | 4.142135623731e-1 | 4.142135623731e-1 |
| 1 | 1.5 | 1.5 | 8.578643762690e-2 | 8.578643762690e-2 |
| 2 | 1.4166667461395264 | 1.4166666666666665 | 2.453183766431e-3 | 2.453104293571e-3 |
| 3 | 1.4142156839370728 | 1.4142156862745097 | 2.121563977705e-6 | 2.123901414616e-6 |
| 4 | 1.4142135381698608 | 1.4142135623746899 | 2.420323420896e-8 | 1.594821025505e-12 |
| 5 | 1.4142135381698608 | 1.4142135623730949 | 2.420323420896e-8 | 1.253716717905e-16 |
| 6 | 1.4142135381698608 | 1.4142135623730949 | 2.420323420896e-8 | 1.253716717905e-16 |
| 7 | 1.4142135381698608 | 1.4142135623730949 | 2.420323420896e-8 | 1.253716717905e-16 |
| 8 | 1.4142135381698608 | 1.4142135623730949 | 2.420323420896e-8 | 1.253716717905e-16 |

Les følgende fra semilogy-plottet:

1. **Starten på platået** er den første iterasjonen der feilen har nådd nivået den beholder i alle senere steg.
2. På platået finner du antall korrekte desimaler med kriteriet

   $$
   |x_n-r|<\frac12 10^{-p}.
   $$

3. **Første nullskritt** er iterasjonen $n$ der den nye lagrede verdien for første gang er lik den forrige, altså $x_n=x_{n-1}$.

:::

```{math-exercise}
#| label: compare-binary32-binary64
#| caption: Sammenlign nøyaktighetsgrensene
#| mode: equivalent
#| field-labels: binary32 platåstart, binary64 platåstart, binary32 korrekte desimaler, binary64 korrekte desimaler, binary32 første nullskritt, binary64 første nullskritt
#| context: binary-format-plateau-context, binary-format-iteration-givens

Oppgi ett ikke-negativt heltall i hvert felt.

**Første iterasjon på feilplatået:**

binary32: _[4]
binary64: _[5]

**Antall korrekte desimaler på platået:**

binary32: _[7]
binary64: _[15]

**Iterasjonen der det lagrede skrittet først blir null:**

binary32: _[5]
binary64: _[6]
```
