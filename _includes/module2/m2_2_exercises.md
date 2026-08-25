#### Design en raskere iterasjon

::: {#relaxed-fixed-point-design-context .math-exercise-context}

En ligning $f(x)=0$ kan gjøres om til familien av fikspunktiterasjoner

$$
g_\lambda(x)=x-\lambda f(x),
$$

der $\lambda>0$ er en parameter. Et nullpunkt $r$ for $f$ er også et fikspunkt for $g_\lambda$. Den lokale konvergensfaktoren ved et glatt fikspunkt er

$$
|g_\lambda'(r)|.
$$

For $f(x)=x^2-2$ er

$$
g_\lambda'(x)=1-2\lambda x.
$$

En parameter som gjør $g_\lambda'(r)=0$, gir lokal faktor null. I denne oppgaven brukes det positive nullpunktet av $f$.

:::

```{math-exercise}
#| label: design-relaxed-fixed-point
#| caption: Velg parameter for rask lokal konvergens
#| mode: equivalent
#| field-labels: positivt fikspunkt r, lokal faktor når lambda er 1/4, optimal lambda
#| context: relaxed-fixed-point-design-context

La

$$
f(x)=x^2-2,
\qquad
g_\lambda(x)=x-\lambda(x^2-2).
$$

Bruk det positive fikspunktet. Finn først $r$. Beregn deretter den lokale faktoren når $\lambda=1/4$, og finn til slutt den positive parameterverdien som gjør $g_\lambda'(r)=0$.

Svarformat: Skriv eksakte uttrykk. Bruk `sqrt(2)` for $\sqrt{2}$ og `/` for brøk, for eksempel `sqrt(2)/4`. Desimaltall er ikke nødvendig.

$$r=$$ _[sqrt(2)]

$$\left|g_{1/4}'(r)\right|=$$ _[1-sqrt(2)/2]

$$\lambda=$$ _[sqrt(2)/4]
```
