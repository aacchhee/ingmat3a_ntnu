#### Les antall korrekte desimaler fra feilplottet

Plottet viser absolutt feil for de to oppdateringsreglene $g_2$ og $g_3$ fra modellproblemet. De stiplede linjene markerer grensene $\frac12 10^{-p}$ for $p=0,1,\ldots,12$. Et punkt under linjen for $p$ har minst $p$ korrekte desimaler.

```{pyodide-python}
#| canvas: false

r_reference = 0.6823278038280193
steps = np.arange(5)
values_g2 = iterate(g2, 0.5, 4)
values_g3 = iterate(g3, 0.5, 4)
errors_g2 = np.abs(values_g2 - r_reference)
errors_g3 = np.abs(values_g3 - r_reference)

plt.close("all")
fig, ax = plt.subplots()
ax.semilogy(steps, errors_g2, "o-", label="g₂")
ax.semilogy(steps, errors_g3, "o-", label="g₃")
for p in range(13):
    ax.axhline(0.5*10**(-p), color="0.8", linewidth=0.6)
ax.set_xticks(steps)
ax.set_xlabel("Iterasjon n")
ax.set_ylabel("Absolutt feil |xₙ − r|")
ax.set_title("Feil etter hver iterasjon")
ax.grid(True, which="major")
ax.legend()
plt.show()
```

::: {#correct-decimals-context .math-exercise-context}

En tilnærming $x_n$ har minst $p$ korrekte desimaler når

$$
|x_n-r|<\frac12 10^{-p}.
$$

Finn det største heltallet $p$ som oppfyller ulikheten. Dersom feilen ikke er mindre enn $0.5$, er svaret $0$. Bruk den absolutte feilen som vises i plottet; ikke tell like sifre direkte i desimalutviklingen.

:::

```{math-exercise}
#| label: count-correct-decimals-from-plot
#| caption: Korrekte desimaler for to iterasjoner
#| mode: equivalent
#| field-labels: g2 ved n=1, g2 ved n=2, g2 ved n=3, g2 ved n=4, g3 ved n=1, g3 ved n=2, g3 ved n=3, g3 ved n=4
#| context: correct-decimals-context

Oppgi ett ikke-negativt heltall i hvert felt. Feltene gjelder iterasjonene $n=1,2,3,4$ fra venstre mot høyre.

For $g_2$ er antall korrekte desimaler

$$
_[0],\quad _[0],\quad _[0],\quad _[1].
$$

For $g_3$ er antall korrekte desimaler

$$
_[1],\quad _[2],\quad _[5],\quad _[12].
$$
```
