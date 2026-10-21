## Oppgaver

::: {#uke1-oppg-binaer}
:::

### Fra totallssystemet til titallssystemet

Gang hvert siffer med sin potens av $2$ og legg sammen, som i eksemplet med $(101100)_2=44$. Først et heltall:

```{math-exercise}
#| label: binary-to-decimal
#| caption: Fra binært tall til titallssystemet
#| pool: true
#| mode: equivalent
#| field-labels: Verdi

$$(101101)_2$$

Svar: _[45]

---

$$(110010)_2$$

Svar: _[50]

---

$$(100111)_2$$

Svar: _[39]

---

$$(111001)_2$$

Svar: _[57]

---

$$(1010110)_2$$

Svar: _[86]
```

Sifrene etter binærpunktet står for $2^{-1}=\frac12$, $2^{-2}=\frac14$, $2^{-3}=\frac18$ og så videre. Du kan svare med brøk eller desimaltall.

```{math-exercise}
#| label: binary-fraction-to-decimal
#| caption: Binær brøk til titallssystemet
#| pool: true
#| mode: equivalent
#| field-labels: Verdi

$$(101.101)_2$$

Svar: _[45/8]

---

$$(10.011)_2$$

Svar: _[19/8]

---

$$(111.01)_2$$

Svar: _[29/4]

---

$$(1.001)_2$$

Svar: _[9/8]

---

$$(100.111)_2$$

Svar: _[39/8]
```

Til slutt programmerer du omregningen for heltall. Skriv funksjonen uten å bruke `int()`. Gå gjennom sifrene fra venstre mot høyre og bygg opp verdien. Tips: For et siffer `b` gir `b == "1"` enten `True`, som regnes som 1, eller `False`, som regnes som 0.

```{py-exercise}
#| label: binary-string-to-decimal
#| caption: Konverter binært heltall til titallssystemet
#| forbidden-keywords: int
def bin_to_dec(bits):
    """Konverter en streng med 0 og 1 til et heltall."""
    value = 0

    # Skriv koden din her

    return value

## TESTS ##
assert bin_to_dec("101") == 5, "101₂ skal bli 5."
assert bin_to_dec("110101") == 53, "110101₂ skal bli 53."
```

### Fra titallssystemet til totallssystemet

Gang brøkdelen gjentatte ganger med $2$ og ta vare på heltallsdelene, som for $0.7$ i teksten. Skriv **bare sifrene etter binærpunktet**.

```{math-exercise}
#| label: decimal-fraction-to-binary
#| caption: Fra titallsbrøk til binær brøk
#| pool: true
#| mode: string
#| field-labels: Binære sifre

$$(0.5)_{10}=(0.\ldots)_2$$

Binære sifre: _[1]

---

$$(0.375)_{10}=(0.\ldots)_2$$

Binære sifre: _[011]

---

$$(0.625)_{10}=(0.\ldots)_2$$

Binære sifre: _[101]

---

$$(0.1875)_{10}=(0.\ldots)_2$$

Binære sifre: _[0011]

---

$$(0.8125)_{10}=(0.\ldots)_2$$

Binære sifre: _[1101]
```

For heltall bruker vi gjentatt divisjon med $2$, som for $53$ i teksten. Skriv en funksjon som gjør dette. Funksjonen skal returnere svaret som en streng. Ikke bruk `bin()`.

```{py-exercise}
#| label: decimal-to-binary-string
#| caption: Konverter heltall til binært
#| forbidden-keywords: bin
def dec_to_bin(n):
    """Konverter et ikke-negativt heltall til en binær streng."""
    if n == 0:
        return "0"

    digits = ""

    # Skriv koden din her

    return digits

## TESTS ##
assert dec_to_bin(5) == "101", "5 skal bli '101'."
assert dec_to_bin(53) == "110101", "53 skal bli '110101'."
```
