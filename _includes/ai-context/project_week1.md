:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week1-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week1-ordinary-sum-e1bef6da .ai-feedback-context}

`ordinary_sum(values)`

Returnerer én flyttallssum ved addisjon fra venstre mot høyre, med startverdi 0.0; ingen kompensasjon eller omordning. Tom input gir 0.0.

:::

::: {#ide-project_week1-make-attack-70fdf505 .ai-feedback-context}

`make_attack(n, scale)`

Studentens generator av en talliste: n styrer forsøksstørrelsen og scale størrelsesforskjellen mellom tallene. Startskissen returnerer en tom liste; angrepet er ikke ferdig.

:::

::: {#ide-project_week1-defense-order-edf5c8dc .ai-feedback-context}

`defense_order(values)`

Skal returnere de samme tallene i en valgt rekkefølge, uten å endre originaldataene. Startskissen lager list(values) og returnerer kopien uendret; valg av rekkefølge er studentarbeid.

:::

::: {#ide-project_week1-target-attack-83f2e562 .ai-feedback-context}

`target_attack()`

Studentens talliste for et kontrollert summeringsangrep: math.fsum skal ligge innen 1e-10 fra 1, med maksimalt 10 000 tall. Startskissen returnerer [1.0]; et sterkere angrep skal utformes av studenten.

:::

::: {#ide-project_week1-bounded-attack-523c49dd .ai-feedback-context}

`bounded_attack()`

Studentens talliste med begrensningen abs(x_i) <= 1e6 for alle tall. Startskissen returnerer en tom liste; konstruksjonen skal fullføres.

:::

::: {#ide-project_week1-positive-attack-082e4d1b .ai-feedback-context}

`positive_attack()`

Studentens talliste der alle x_i skal være strengt positive. Startskissen returnerer en tom liste; prosjektet undersøker informasjonstap uten kansellering mellom ulike fortegn.

:::

::: {#ide-project_week1-attacks-91cb572f .ai-feedback-context}

`attacks`

Ordbok med nøklene "target", "bounded" og "positive". Verdiene er listene fra target_attack(), bounded_attack() og positive_attack() da cellen kjøres; listenes innhold avhenger av studentens funksjoner.

:::

::: {#ide-project_week1-better-sum-875c6a78 .ai-feedback-context}

`better_sum(values)`

Studentens alternative summeringsalgoritme: tallfølge inn, én sum ut. sum(), numpy.sum() og math.fsum() er ikke tillatt her. Startskissen er fortsatt vanlig sekvensiell addisjon fra 0.0.

:::

::::
