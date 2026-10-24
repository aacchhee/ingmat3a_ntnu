:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-page2-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-page2-plot-relative-errors-4575a9a7 .ai-feedback-context}

`plot_relative_errors(exact, relative)`

Søylediagram av relativ feil (i prosent) for hver eksakt verdi.

:::

::: {#ide-page2-show-bits-8fb86031 .ai-feedback-context}

`show_bits(x)`

Skriv ut de tre feltene i IEEE 754 double for tallet x.

:::

::: {#ide-page2-plot-neighbours-a77b9dae .ai-feedback-context}

`plot_neighbours(exact_position)`

Tegn lagret 0.1, de to naboene og posisjonen til eksakt 1/10 (i lokale steg).

:::

::: {#ide-page2-plot-spacing-97c7d945 .ai-feedback-context}

`plot_spacing(values, spacing)`

Log-log-plott av avstanden til neste flyttall mot størrelsen på tallet.

:::

::: {#ide-page2-naive-f32d3d01 .ai-feedback-context}

`naive(x)`

Returnerer `math.sqrt(1+x)-1` for et reelt skalar x med 1+x >= 0; den direkte subtraksjonen kan kansellere for små x.

:::

::: {#ide-page2-plot-cancellation-03decf84 .ai-feedback-context}

`plot_cancellation(xs, rel_errors)`

Log-log-plott av relativ feil i den direkte formen; små x til høyre.

:::

::: {#ide-page2-stable-9f1b3add .ai-feedback-context}

`stable(x)`

Returnerer `x/(math.sqrt(1+x)+1)` for samme kvadratrotuttrykk, rasjonalisert for å unngå den direkte subtraksjonen.

:::

::: {#ide-page2-plot-number-line-4779209a .ai-feedback-context}

`plot_number_line(values, title)`

Tegn tallene i values som prikker på en tallinje.

:::

::: {#ide-page2-positive-mini-values-e3b0c442 .ai-feedback-context}

`positive_mini_values()`

Studentens egen funksjon fra kodeoppgaven: returnerer en sortert liste med 96 positive normaliserte mini-flyttall `(1+M/16)*2**(E-3)`, E=1,...,6 og M=0,...,15. Implementasjonen må kopieres fra studentens eget arbeid; den er ikke levert i denne cellen.

:::

::: {#ide-page2-mini-float-e3b0c442 .ai-feedback-context}

`mini_float(x)`

Studentens egen funksjon fra forrige kodeoppgave: `mini_float(x)` velger nærmeste verdi fra den sorterte listen med negative mini-tall, null og positive mini-tall. Her er implementasjonen studentens eget arbeid, som må være kopiert inn; kontrakten gir ingen løsningskode.

:::

::::
