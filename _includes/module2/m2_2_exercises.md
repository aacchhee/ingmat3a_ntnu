#### Forutsi konvergens med helningen

::: {#golden-rewritings-context .math-exercise-context}

Likningen

$$
x^2-x-1=0
$$

har den positive løsningen $r=\frac{1+\sqrt5}{2}\approx1.618$. Den kan skrives om til fikspunktform på flere måter. Vi ser på to av dem:

$$
x=1+\frac1x
\qquad\text{og}\qquad
x=x^2-1.
$$

Begge har $r$ som fikspunkt (kontroller det gjerne: begge følger av $x^2=x+1$). Kall høyresidene $g_a$ og $g_b$. Bruk helningsregelen fra 2.2 til å avgjøre hvilken regel som trekker nærliggende iterater inn mot $r$. Sammenhengen $r^2=r+1$ gjør regningen kortere.

:::

```{math-exercise}
#| label: golden-rewritings-slopes
#| caption: Helningen avgjør hvilken omskriving som virker
#| mode: equivalent
#| partial-credit: true
#| field-labels: absolutt helning for g_a i r, absolutt helning for g_b i r, regelen som konvergerer nær r
#| context: golden-rewritings-context

La $g_a(x)=1+\dfrac1x$ og $g_b(x)=x^2-1$. Finn $|g_a'(r)|$ og $|g_b'(r)|$ eksakt, og avgjør hvilken regel som gir konvergens mot $r$ for startverdier nær $r$.

Svarformat: Skriv eksakte uttrykk med `sqrt(5)` for $\sqrt5$, for eksempel `(1+sqrt(3))/4`. Skriv **1** for $g_a$ og **2** for $g_b$ i siste felt.

$|g_a'(r)|=$ _[(3-sqrt(5))/2]
$|g_b'(r)|=$ _[1+sqrt(5)]
Regelen som konvergerer nær $r$: _[1]
```

#### Design en raskere iterasjon

::: {#relaxed-fixed-point-design-context .math-exercise-context}

Samme likning kan gi mange fikspunktiterasjoner, og parameteren i oppdateringsregelen kan gjøre forskjellen mellom langsom og rask konvergens. Her skal du velge parameteren med helningsregelen, uten å måtte prøve mange verdier numerisk.

En likning $f(x)=0$ kan gjøres om til familien av fikspunktiterasjoner

$$
g_\lambda(x)=x-\lambda f(x),
$$

der $\lambda>0$ bestemmer hvor stor korreksjon vi tar i hvert steg. Før vi undersøker farten, kontrollerer vi at omskrivingen beholder løsningene. Hvis $r$ er et nullpunkt for $f$, er $f(r)=0$, og innsetting gir

$$
g_\lambda(r)
=r-\lambda f(r)
=r-\lambda\cdot0
=r.
$$

Dermed er hvert nullpunkt for $f$ et fikspunkt for $g_\lambda$, uansett hvilken positiv $\lambda$ vi velger. Også motsatt vei gjelder: Hvis $g_\lambda(r)=r$, får vi $r-\lambda f(r)=r$, og siden $\lambda>0$, må $f(r)=0$. Nullpunktene og fikspunktene er altså de samme.

Parameteren flytter derfor ikke løsningen, men den endrer helningen og dermed den lokale konvergensfaktoren

$$
|g_\lambda'(r)|.
$$

For $f(x)=x^2-2$ er

$$
g_\lambda'(x)=1-2\lambda x.
$$

En parameter som gjør $g_\lambda'(r)=0$, fjerner den lineære delen av feilutviklingen og gir lokal faktor null. I denne oppgaven bruker vi det positive nullpunktet av $f$.

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

Svarformat: Skriv eksakte uttrykk. Bruk `sqrt(2)` for $\sqrt{2}$ og `/` for brøk, for eksempel `sqrt(3)/6`. Desimaltall er ikke nødvendig.

$r=$ _[sqrt(2)]
$\left|g_{1/4}'(r)\right|=$ _[1-sqrt(2)/2]
$\lambda=$ _[sqrt(2)/4]
```
