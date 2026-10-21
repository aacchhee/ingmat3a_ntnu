## Oppgaver

::: {#uke1-oppg-horner}
:::

Nå skal du gjøre oppskriften fra Horners metode om til en løkke. Funksjonen skal regne ut et generelt polynom

$$
p(x)=a_0+a_1x+\cdots+a_nx^n.
$$

Listen `a` inneholder koeffisientene i rekkefølgen
`[a0, a1, ..., an]`.

```{py-exercise}
#| label: horner-general
#| caption: Implementer Horners metode
def horner(a, x):
    """Beregn p(x) med Horners metode."""
    result = 0

    # Skriv koden din her

    return result

## TESTS ##
assert horner([-2, 5, 3, -2, 3], 1.5) == 331/16, "Sjekk polynomet fra eksemplet i teksten."
assert horner([1, 3, 0, 2], 2) == 23, "Sjekk q(x) = 1 + 3x + 2x^3 i x = 2."
assert horner([7], 100) == 7, "Et konstant polynom skal gi konstanten."
```
