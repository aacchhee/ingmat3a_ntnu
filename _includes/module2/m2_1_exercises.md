#### Utfør tre iterasjoner

::: {#fixed-point-numerical-iteration-context .math-exercise-context}

I en fikspunktiterasjon beregnes verdiene i rekkefølge med

$$
x_{n+1}=g(x_n).
$$

Startverdien er $x_0$ og teller ikke som en utført iterasjon. For

$$
g(x)=\sqrt[3]{1-x}
$$

brukes den reelle kubikkroten. Hvert nytt iterat må beregnes fra det forrige. Behold flere desimaler i mellomregningene, og avrund bare sluttresultatet til tre desimaler.

:::

```{math-exercise}
#| label: fixed-point-three-iterations
#| caption: Tre fikspunktiterasjoner
#| mode: numeric
#| tolerance: 5e-4
#| field-labels: x_3 avrundet til tre desimaler
#| context: fixed-point-numerical-iteration-context

Bruk iterasjonen

$$
x_{n+1}=\sqrt[3]{1-x_n},\qquad x_0=0.5.
$$

Utfør tre iterasjoner. Oppgi $x_3$ avrundet til tre desimaler.

Svarformat: Skriv ett desimaltall med punktum som desimalskilletegn, for eksempel `0.625`.

$$x_3\approx$$ _[0.742]
```
