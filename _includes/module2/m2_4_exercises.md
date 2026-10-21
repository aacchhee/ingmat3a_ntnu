#### Når tallformatet setter en grense

Vi bruker iterasjonen for $\sqrt{2}$ som vi bygger i 2.5,

$$
x_{n+1}=\frac12\left(x_n+\frac{2}{x_n}\right),
\qquad x_0=1,
$$

og utfører nøyaktig de samme regneoperasjonene i to tallformater:

- **binary32**, representert med `numpy.float32`, har omtrent 7 signifikante desimalsifre,
- **binary64**, representert med vanlig Python `float`, har omtrent 15–16 signifikante desimalsifre.

Referanseverdien beregnes med 80 desimalsifres presisjon og brukes bare til å måle feil. Hver iterasjon i de to metodene blir derimot lagret i sitt angitte tallformat.

```{pyodide-python}
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
#| context: binary-format-plateau-context

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
