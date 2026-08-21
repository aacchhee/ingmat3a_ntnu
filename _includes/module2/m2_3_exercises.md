### Oppgave: estimer faktor og grense

::: {#linear-convergence-extrapolation-context .math-exercise-context}

Nær et fikspunkt kan en lineært konvergent iterasjon modelleres med

$$
x_{n+1}-r\approx S(x_n-r),
\qquad 0<S<1,
$$

der $r$ er den ukjente grensen og $S$ er konvergensfaktoren. For tre påfølgende iterater kan faktoren estimeres uten å kjenne $r$:

$$
S\approx\frac{x_{n+2}-x_{n+1}}{x_{n+1}-x_n}.
$$

Når $S$ er funnet, kan grensen estimeres fra

$$
x_{n+2}-r\approx S(x_{n+1}-r),
$$

og neste iterat kan forutsies med den samme lineære modellen.

:::

```{math-exercise}
#| label: estimate-linear-factor-and-limit
#| caption: Estimer konvergensfaktor og ukjent grense
#| mode: equivalent
#| field-labels: estimert konvergensfaktor S, estimert grense r, estimert neste iterat x_8
#| context: linear-convergence-extrapolation-context

Tre påfølgende verdier fra en iterasjon er

$$
x_5=0.64,\qquad x_6=0.67,\qquad x_7=0.685.
$$

Anta at iterasjonen er i det lineære konvergensområdet. Estimer $S$, bruk modellen til å estimere den ukjente grensen $r$, og forutsi deretter $x_8$.

$$S\approx$$ _[1/2]

$$r\approx$$ _[7/10]

$$x_8\approx$$ _[277/400]
```
