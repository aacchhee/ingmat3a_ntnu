:::: {.details title="Python: delte definisjoner og hjelpefunksjoner"}

::: {#ide-project_week11-reference-assumptions .ai-feedback-context}

Referansen beskriver kursets opprinnelige oppsett og delte definisjoner. Den aktuelle cellens kode og tilgjengelige kjøringsresultater vurderes sammen med dette. Hvis du endrer en delt definisjon i en annen celle, ta med den endrede definisjonen i koden eller kommentarene du ber om tilbakemelding på.

:::

::: {#ide-project_week11-capacity-f8fda3d6 .ai-feedback-context}

`capacity`

np.array([30.,50.,30.,40.]), øvre produksjonsgrenser i MW for vind, vannkraft, import og gass i denne rekkefølgen.

:::

::: {#ide-project_week11-cost-066909c5 .ai-feedback-context}

`cost`

np.array([0.,10.,40.,70.]), marginal produksjonskostnad i kr/MWh for vind, vannkraft, import og gass i denne rekkefølgen.

:::

::: {#ide-project_week11-show-merit-order-58c27887 .ai-feedback-context}

`show_merit_order(cost, capacity, D, names=plant_names)`

Tar like lange cost/capacity/navnelister og skalaren D. Sorterer stabilt etter kostnad og tegner tilbudsblokker med kapasitetsbredde, kostnadsmerking og rød etterspørselslinje ved D. Nullkostnad gis liten synlig søylehøyde; ingen markedsoptimering utføres. Returnerer None.

:::

::: {#ide-project_week11-linprog-5e96555f .ai-feedback-context}

`linprog`

Importert med `from scipy.optimize import linprog`; løser lineære programmer. Sidens modeller bruker method="highs" og returnerer OptimizeResult.

:::

::: {#ide-project_week11-np-6f11581d .ai-feedback-context}

`np`

Importert med `import numpy as np`; NumPy-arrays, lineær algebra og tilfeldighet er tilgjengelig gjennom np.

:::

::: {#ide-project_week11-plant-names-1ea0e5dd .ai-feedback-context}

`plant_names`

Listen ["vind","vannkraft","import","gass"], i samme rekkefølge som cost, capacity og variablene i ettområdemodellen.

:::

::: {#ide-project_week11-one-zone-0ad21954 .ai-feedback-context}

`one_zone(D)`

Returnerer linprog/HiGHS-resultatet for minimum cost@x, sum(x)=D og 0<=x<=capacity. Fire produksjonsvariabler følger plant_names. Resultatet har blant annet success,x,fun,eqlin.marginals; tolk pris/produksjon bare når problemet er løst.

:::

::: {#ide-project_week11-read-market-41224ef0 .ai-feedback-context}

`read_market(res, D)`

Studentens uttrekk fra ettområdets linprog-resultat res og etterspørsel D: skal returnere pris og gjennomsnittskostnad. Startskissen returnerer None og må fullføres; kallene bruker paret (price,average).

:::

::: {#ide-project_week11-show-steps-d35b54cd .ai-feedback-context}

`show_steps(x, steps, smooth=None, xlabel='', ylabel='kr/MWh', labels=('Pris (dual)', 'Gjennomsnittskostnad'))`

Tar x og steps som parallelle tallfølger og valgfri smooth i samme punkter. Tegner trappekurven med where="mid" og eventuell glatt kurve; labels gir kurvenavn. Returnerer None.

:::

::: {#ide-project_week11-two-zones-61836c29 .ai-feedback-context}

`two_zones(L, wind_north=20.0)`

Returnerer linprog/HiGHS-resultat med x=(vind N,vannkraft N,import S,gass S,flyt f), kostnader (0,10,40,70,0), forbruk (30,80). Positiv f går nord→sør; -L<=f<=L. Produksjonsgrenser er (wind_north,80,30,80). eqlin.marginals gir to områdeverdier.

:::

::: {#ide-project_week11-show-two-zones-250070b6 .ai-feedback-context}

`show_two_zones(res, L)`

Tar løst resultat fra two_zones og linjegrensen L. Leser res.x og de to res.eqlin.marginals, viser produksjon/pris i nord og sør samt flyt f=res.x[4]. Marker linjen som full når abs(f)>=L-1e-9; returnerer None.

:::

::: {#ide-project_week11-a-eq3-783ef676 .ai-feedback-context}

`A_eq3`

Balansematrisen fra _three_hours(), form (3,12): rad h har fire ettall i timeblokk h og null ellers. A_eq3@x=demand3 pålegger én produksjonsbalanse per time; vannbegrensningen ligger ikke i denne matrisen.

:::

::: {#ide-project_week11-bounds3-783ef676 .ai-feedback-context}

`bounds3`

Liste med 12 produksjonsintervaller i tre timeblokker (vind,vannkraft,import,gass). Nedre grenser er 0; øvre er henholdsvis (30,50,30,40), (10,50,30,40), (20,50,30,40). Vannbudsjettet er et separat globalt krav.

:::

::: {#ide-project_week11-c3-783ef676 .ai-feedback-context}

`c3`

Kostnadsvektor np.tile(cost,3), form (12,). Variablene er tre timeblokker med rekkefølgen vind,vannkraft,import,gass innen hver time.

:::

::: {#ide-project_week11-demand3-1ff1608f .ai-feedback-context}

`demand3`

np.array([60.,95.,120.]), fast etterspørsel i MW for hver av tre én-timesperioder, i samme timerekkefølge som A_eq3.

:::

::: {#ide-project_week11-make-water-row-47594272 .ai-feedback-context}

`make_water_row()`

Studentens koeffisientrad med form (1,12) for samlet vannkraft i de tre timeblokkene. Skal velge vannkraftvariabelen i hver blokk og ignorere andre produksjonstyper. Startskissen returnerer bare nuller og må fullføres.

:::

::: {#ide-project_week11-water-dfa5ec02 .ai-feedback-context}

`water`

Skalaren 120.0 MWh, samlet vannkraftbudsjett over tre én-timesperioder. Brukes som øvre grense sammen med raden fra make_water_row.

:::

::::
