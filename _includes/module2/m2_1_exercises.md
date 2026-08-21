### Oppgave: beregn et senere iterat

::: {#fixed-point-numerical-iteration-context .math-exercise-context}

I en fikspunktiterasjon beregnes verdiene i rekkefølge med

$$
x_{n+1}=g(x_n).
$$

Startverdien er $x_0$ og teller ikke som en utført iterasjon. For

$$
g(x)=\sqrt[3]{1-x}
$$

brukes den reelle kubikkroten. Hvert nytt iterat må beregnes fra det forrige. Mellomresultatene bør beholdes med høy presisjon; avrund først det etterspurte sluttresultatet.

:::

```{math-exercise}
#| label: fixed-point-five-iterations
#| caption: Fem fikspunktiterasjoner
#| mode: numeric
#| tolerance: 1e-6
#| field-labels: numerisk verdi av x_5
#| context: fixed-point-numerical-iteration-context

Bruk iterasjonen

$$
x_{n+1}=\sqrt[3]{1-x_n},\qquad x_0=0.5.
$$

Utfør fem iterasjoner. Oppgi den numeriske verdien av $x_5$ med minst seks riktige desimaler.

$$x_5\approx$$ _[0.7138008141442069]
```
