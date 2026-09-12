<div class="learning-mode" data-learning-mode data-lecture-label="Oppgaver" data-reading-label="Arbeid videre" role="group" aria-label="Velg prosjektvisning">
<button type="button" data-mode="lecture" aria-pressed="true">Oppgaver</button>
<button type="button" data-mode="reading" aria-pressed="false">Arbeid videre</button>
<span role="status" aria-live="polite"></span>
</div>

## Oppdrag: behold informasjonen som betyr noe

Du skal anbefale en forenkling med singulærverdidekomposisjon (SVD) under et gitt budsjett, og vise
både hva den lykkes med og når den svikter. Start med en hypotese, gjør
forsøket, forklar resultatet og knytt det til teorien i [uke 7](uke7.qmd).

**Alle gjør del 1–3 og velger deretter enten A eller B.** A undersøker
støyfjerning i bilder. B undersøker inversjon av et uskarpt signal og gir
en direkte videreføring av residual, feil og kondisjonering fra uke 6.
Begge er fullverdige valg; du skal ikke gjøre begge.

Oppgavevisningen gir felles arbeidsløp. «Arbeid videre» åpner
støtte underveis. Hint åpnes manuelt etter eget forsøk. Ferdige hjelpere
tar seg av forsøksdata og visning; du implementerer selve **trunkeringen**,
altså å beholde bare de første leddene i en SVD-sum. I [uke 7.3](uke7.qmd#uke7-svd)
er $U$ og $V$ de ortonormale basisene på hver side, og singulærverdiene
er strekkfaktorene, ordnet fra størst til minst.

Alle forsøksbilder er klare i siden. Portrett: [NTNU, mm.gif](https://wiki.math.ntnu.no/_media/imax3011/2025h/mm.gif),
tilpasset til $96\times96$ gråtoner. De andre bildene lages lokalt.

## 1. Forutsi før du komprimerer

```{pyodide-python}
#| label: project7-inputs
images = challenge_images()
show_images(images)
```

1. Ranger bildene etter forventet komprimerbarhet. Skriv begrunnelsen før SVD.
2. Velg en konkret detalj i portrettet eller teksten som må bevares.
   Beskriv hvordan du vil avgjøre om den fortsatt er synlig.
3. Alle bildene er like store. Hvorfor gjør dette sammenligningen enklere?

<details class="reading-step">
<summary>Hva mener vi med komprimerbarhet her?</summary>

Vi spør hvor liten rang vi trenger for å få liten feil og bevare ønsket
informasjon. Vi undersøker ikke hvor liten en PNG-fil blir. En diagonal
strek er enkel å beskrive, men det er ikke gitt at den har lav matriserang.
Noter forventningen også når du er usikker: et avkreftet gjett er et resultat.

</details>

## 2. Lag rekonstruksjonen og kontroller den

NumPy gir `U, s, Vt`, der `s` inneholder singulærverdiene og `Vt` allerede
er transponert. En komponent er $\sigma_i u_i v_i^T$: ett rang-1-mønster
med sin vekt.

Implementer `truncate(U, s, Vt, k)` som bruker de første $k$ komponentene.
Bruk NumPy-slicing og matrisemultiplikasjon. Den skal også virke for $k=0$
og $k=\min(m,n)$. Ikke kall `rank_image` i din implementasjon.

```{pyodide-python}
#| label: project7-truncate
# Kjør denne cellen på nytt etter at du har fylt inn funksjonen.
def truncate(U, s, Vt, k):
    # TODO: returner en matrise med samme form som U @ diag(s) @ Vt.
    raise NotImplementedError('Fyll inn trunkert rekonstruksjon')
```

Kjør så kontrollen. Bruk en rektangulær matrise slik at en utilsiktet
transponering ikke skjules av kvadratiske dimensjoner.

**Frobeniusnormen** er kvadratroten av summen av alle kvadrerte
matriseelementer. Den gir en samlet pikselfeil når vi bruker den på
$A-A_k$. Den **relative** feilen deler dette på størrelsen til originalen.
Kontrollen sammenligner kvadrert pikselfeil med summen av kvadrerte
singulærverdier som er utelatt. Dette er feilformelen fra [uke 7.5](uke7.qmd#uke7-rang).

```{pyodide-python}
#| label: project7-check
test_A = np.array([[1.,2.,0.],[0.,1.,3.]])
U,s,Vt = np.linalg.svd(test_A,full_matrices=False)
assert np.allclose(truncate(U,s,Vt,0),np.zeros_like(test_A))
assert np.allclose(truncate(U,s,Vt,len(s)),test_A)
for k in range(len(s)+1):
    observed = np.linalg.norm(test_A-truncate(U,s,Vt,k),'fro')**2
    assert np.isclose(observed,np.sum(s[k:]**2))
print('Rekonstruksjon og halefeil stemmer på kontrollmatrisen.')
```

Forklar hvorfor kontrollen av feilformelen er mer informativ enn bare
å se på et bilde. Vis til slutt samme kontroll for ett av forsøksbildene.

<details class="learning-hint">
<summary>Hint: hvilken vei peker V?</summary>

NumPy gir $V^T$, ikke $V$. De første $k$ radene i `Vt` må derfor beholdes.
Uttrykket `U[:, :k] * s[:k]` skalerer hver beholdt kolonne med sin
singulærverdi. Multipliser dette med `Vt[:k, :]`. For $k=0$ gir produktet
av de tomme faktorene riktig nullmatrise.

</details>

<details class="reading-step">
<summary>Kontroll mot teori og avrunding</summary>

For $A_k=\sum_{i=1}^k\sigma_i u_i v_i^T$ er
$\|A-A_k\|_F^2=\sum_{i>k}\sigma_i^2$. Venstresiden bruker hele
rekonstruksjonen; høyresiden bruker bare singulærverdiene. Uenighet kan
avsløre feil indeksering eller feil behandling av `Vt`.
Ved full rang blir den beregnede feilen vanligvis svært liten, ikke
nøyaktig null. Bruk toleranse, slik vi gjorde med flyttall i uke 1.

</details>

## 3. Samme budsjett, fire ulike utfall

Bruk et parameterbudsjett på **25 % av antall piksler**. Hvis vi lagrer
$U_k$, $s_k$ og $V_k^T$, trenger vi $k(m+n+1)$ tall.
Finn største heltall $k$ som tilfredsstiller budsjettet og $k\leq\min(m,n)$.

Kjør cellen etter at `truncate` er implementert. Den beregner hver SVD én gang
og lager figurgrunnlaget. Legg selv til feilberegningen og en resultatoversikt.

```{pyodide-python}
#| label: project7-budget
images = challenge_images()
factors = {name:np.linalg.svd(A,full_matrices=False) for name,A in images.items()}
budget = .25
m,n = next(iter(images.values())).shape
k_budget = min(m,n,int(budget*m*n//(m+n+1)))
print('Rang under budsjettet:',k_budget)
reconstructed = {name:truncate(*factors[name],k_budget) for name in images}
show_images(reconstructed)
plt.figure(figsize=(7,4))
for name,(U,s,Vt) in factors.items():
    plt.semilogy(np.arange(1,len(s)+1),np.maximum(s/s[0],1e-16),label=name)
plt.xlabel('Komponent i'); plt.ylabel('σᵢ / σ₁ (visningsgulv 10⁻¹⁶)')
plt.legend(); plt.grid(); plt.show()
```

Lever en tabell med bilde, valgt rang, parameterandel og relativ
Frobeniusfeil $\|A-A_k\|_F/\|A\|_F$. Sammenlign med hypotesen i del 1.

- Undersøk også rangene $1,5,10,20,40,96$ for bildet med din valgte detalj.
  Hvilken er den minste **av disse prøvde rangene** som bevarer detaljen?
  Ligger den innenfor budsjettet?
- Finn ett tydelig eksempel der metoden virker dårlig. Bruk singulærverdiene
  til å forklare det, og kommenter hvorfor visuell enkelhet kan villede.
- Beregn både parameterandel og byteandel hvis originalen er 8-bit og
  faktorene lagres som float64. Er det fortsatt en lagringsgevinst?
  Ikke ta med filformatkomprimering i denne sammenligningen.

<details class="reading-step">
<summary>Fra tall til en anbefaling</summary>

Parameterandelen er $k(m+n+1)/(mn)$. Byteandelen i den beskrevne modellen er
$8k(m+n+1)/(mn)$, før eventuell metadata. Et budsjett på 25 % av antall tall
kan altså bruke mer plass enn det opprinnelige 8-bitsbildet.
Du kan diskutere float32 eller kvantisering, men trenger ikke implementere det.

Lav Frobeniusfeil er en samlet pikselfeil. Den sier ikke direkte at en liten
bokstavdetalj eller ansiktsdetalj er bevart. Bruk derfor både tall og den
konkrete detaljen fra del 1. Ikke klipp rekonstruksjonen før feilberegning:
da undersøker du en annen tilnærming enn den som feilformelen beskriver.

</details>

## Velg A: kan færre komponenter gi et bedre bilde?

### Opplev problemet

Vi kjenner et rent bilde og legger til kontrollert støy. Før kjøring:
Vil beste rang være den samme hvis vi måler mot det støyete bildet som
hvis vi måler mot det rene? Hvorfor?

```{pyodide-python}
#| label: project7-denoise
clean_image = challenge_images()['portrett']  # Bytt senere til 'diagonal'.
noise_level = .12
noisy_image = clean_image + noise_level*np.random.default_rng(23).standard_normal(clean_image.shape)
show_images({'rent':clean_image,'med støy':noisy_image})
U_noise,s_noise,Vt_noise = np.linalg.svd(noisy_image,full_matrices=False)
ranks = [1,3,5,10,15,20,30,50,70,96]
fits = [truncate(U_noise,s_noise,Vt_noise,k) for k in ranks]
# Sammenlign disse to feildefinisjonene før du tegner kurvene.
error_to_data = [np.linalg.norm(B-noisy_image,'fro')/np.linalg.norm(noisy_image,'fro') for B in fits]
error_to_clean = [np.linalg.norm(B-clean_image,'fro')/np.linalg.norm(clean_image,'fro') for B in fits]
```

```{pyodide-python}
#| label: project7-denoise-plot
plt.figure()
plt.plot(ranks,error_to_data,'o-',label='mot støyete data')
plt.plot(ranks,error_to_clean,'o-',label='mot kjent rent bilde')
plt.xlabel('Rang'); plt.ylabel('Relativ Frobeniusfeil'); plt.legend(); plt.grid(); plt.show()
best = int(np.argmin(error_to_clean))
show_images({'rent':clean_image,'med støy':noisy_image,f'rang {ranks[best]}':fits[best]})
```

1. Forklar forskjellen på feilkurvene. Hvorfor er full rang best mot dataene?
2. Sammenlign beste prøvde rang med full rang og med rang fra budsjettet i del 3.
3. Gjenta med diagonalbildet. Undersøk om trunkering også fjerner viktig signal.
4. Du fikk se fasiten. Hvordan ville du begrunnet rangvalget uten et rent bilde?
   Foreslå én praktisk framgangsmåte og beskriv hva den ikke garanterer.

<details class="reading-step">
<summary>Støyreduksjon er en hypotese om signalet</summary>

Mot det støyete bildet synker feilen når flere komponenter beholdes.
Mot det rene bildet kan den først synke og så stige: flere komponenter
kan også tilpasse støy. Dette hjelper når signalet kan beskrives med få
store komponenter og støyen fordeles annerledes. Det gjelder ikke automatisk
for alle bilder; diagonalbildet utfordrer nettopp denne antakelsen.

Med kjent fasit kan vi velge beste prøvde rang i ettertid. Uten fasit kan vi
for eksempel bruke en uavhengig gjentatt måling til validering, eller et anslag
for støynivå og en eksplisitt regel for tillatt datafeil. En knekk i
singulærverdikurven alene er ingen garanti for riktig skille mellom signal og støy.

</details>

## Velg B: kan vi gjøre et uskarpt signal skarpt igjen?

### Opplev problemet

Her er matrisen $H$ en **uskarphetsoperator**: $b=Hx_*+\eta$.
Her er $x_*$ det skarpe signalet, $b$ målingen og $\eta$ målestøy.
Produktet $Hx_*$ gir et uskarpt signal ved å blande verdier fra naboposisjoner.
Vi tar SVD av $H$. Små singulærverdier viser signalretninger som blir
svært svake etter denne transformasjonen.

Forsøket gir en kjent fasit, et normalisert Gauss-filter og fast tilfeldig
målestøy. **Residualen** $b-Hx$ måler avviket mot de observerte dataene;
**løsningsfeilen** $x-x_*$ måler avviket mot det kjente skarpe signalet.
**Kondisjonstallet** er forholdet mellom største og minste singulærverdi;
et stort forhold betyr at inversjon kan forsterke relative datafeil mye.
Gjett om en løsning med nesten null residual vil ligne fasiten.

```{pyodide-python}
#| label: project7-blur
position,H,truth,clean_data,observed = blur_problem()
U_h,s_h,Vt_h = np.linalg.svd(H,full_matrices=False)
print('Kondisjonstall:',s_h[0]/s_h[-1])
try:
    direct = np.linalg.solve(H,observed)
except np.linalg.LinAlgError:
    direct = None
    print('Direkte løsning stoppet: matrisen oppfattes som singulær.')
fig,ax = plt.subplots(1,2,figsize=(10,3))
ax[0].plot(position,truth,label='fasit')
ax[0].plot(position,observed,label='måling'); ax[0].legend()
if direct is not None:
    ax[1].plot(position,direct,label='direkte løsning'); ax[1].legend()
    print('Relativ residual:',np.linalg.norm(H@direct-observed)/np.linalg.norm(observed))
    print('Relativ feil:',np.linalg.norm(direct-truth)/np.linalg.norm(truth))
for axis in ax: axis.set_xlabel('Posisjon')
plt.tight_layout(); plt.show()
```

### Forklar og bygg en mer forsiktig inversjon

Finn først datakoordinaten $u_i^Tb$ langs $u_i$ ved hjelp av indreproduktet.
Dette er en ortogonal projeksjon fra uke 4. Rekonstruksjon av komponenten deler
på $\sigma_i$. Derfor kan små målefeil gi store signalutslag:

$$x_k=\sum_{i=1}^k\frac{u_i^Tb}{\sigma_i}v_i.$$

Implementer denne regelen. Her betyr `k` hvor mange **operatorretninger**
vi bruker i inversjonen; det er ikke bildets komprimeringsrang fra del 3.

```{pyodide-python}
#| label: project7-tsvd
# Kjør cellen på nytt etter at du har fylt inn funksjonen.
def tsvd(U,s,Vt,b,k):
    # TODO: projiser b, del på de beholdte singulærverdiene, rekonstruer.
    raise NotImplementedError('Fyll inn trunkert inversjon')
```

```{pyodide-python}
#| label: project7-blur-compare
position,H,truth,clean_data,observed = blur_problem()
U_h,s_h,Vt_h = np.linalg.svd(H,full_matrices=False)
trial_ranks = [2,5,10,15,20,25,30,40]
solutions = [tsvd(U_h,s_h,Vt_h,observed,k) for k in trial_ranks]
residuals = [np.linalg.norm(H@x-observed)/np.linalg.norm(observed) for x in solutions]
errors = [np.linalg.norm(x-truth)/np.linalg.norm(truth) for x in solutions]
fig,ax = plt.subplots(1,2,figsize=(10,3))
ax[0].semilogy(trial_ranks,residuals,'o-',label='relativ residual')
ax[0].semilogy(trial_ranks,errors,'o-',label='relativ feil')
ax[0].set_xlabel('Antall beholdte retninger'); ax[0].legend(); ax[0].grid()
best = int(np.argmin(errors))
ax[1].plot(position,truth,label='fasit')
ax[1].plot(position,solutions[best],label=f'rang {trial_ranks[best]}')
ax[1].set_xlabel('Posisjon'); ax[1].legend(); plt.tight_layout(); plt.show()
```

1. Sammenlign direkte løsning, en svært liten rang og beste prøvde rang.
   Vis både residual og feil. Hvorfor er minste residual feil beslutningsregel her?
2. Gjør støyen dobbelt så stor med samme støymønster:
   `observed = clean_data + 2*(observed-clean_data)` etter `blur_problem()`
   i sammenligningscellen. Undersøk om rangvalget endres.
3. Knytt feilen til $\delta b=\eta u_i\Rightarrow\delta x=(\eta/\sigma_i)v_i$.
   Forklar hvilken informasjon vi gir avkall på ved trunkering.
4. Er dette prekondisjonering fra uke 6? Forklar forskjellen mellom å løse
   samme problem raskere og å begrense hvilke løsningskomponenter vi tar med.

<details class="learning-hint">
<summary>Hint til implementasjonen</summary>

`U[:, :k].T @ b` gir de beholdte datakoordinatene. Del komponentvis på
`s[:k]`, og multipliser med `Vt[:k, :].T`. Ikke lag hele inversmatrisen.
Vi prøver her ranger med positive singulærverdier; nullverdier skal aldri inverteres.

</details>

<details class="reading-step">
<summary>Hvorfor dette forsøket kan feile spektakulært</summary>

Glattende målinger gjør enkelte signalretninger svært svake. Det konstruerte
$H$ er så dårlig kondisjonert at de aller minste beregnede singulærverdiene
ikke bør tolkes som nøyaktige fysiske størrelser. Direkte løsning brukes
som et bevisst feilforsøk. En beregning kan stoppe, eller gi enorme verdier.
Begge deler er relevante observasjoner, ikke noe du skal skjule.

Trunkert SVD, forkortet TSVD, begrenser støyforsterkning ved å forkaste retninger. Men også fasitens
komponenter i disse retningene forsvinner. For liten rang gir derfor en
for enkel løsning. Rangvalget balanserer tapt signal mot forsterket støy.
En kjent fasit lar oss måle dette i laboratoriet; reelle data krever et
begrunnet valg uten tilgang til sann løsning.

</details>

## Levering

Lever en kjørbar notebook eller tilsvarende kode med figurer, og en kort
rapport på omtrent **400–600 ord**, utenom bildetekster og tabeller:

- Hypotesen fra del 1 og budsjettabellen for alle fire bilder.
- Ett original/rekonstruksjon-par med den viktige detaljen tydelig beskrevet.
- Feilkurvene og én sammenligning fra valgt utvidelse A eller B.
- En anbefaling med valgt rang, begrunnelse, og ett dokumentert tilfelle der
  metoden ikke bevarer det du ønsker.

Knytt forklaringen eksplisitt til minst to tidligere temaer, for eksempel
ortogonale koordinater og rang, eller kondisjonering og residual.
Resultatene skal kunne gjenskapes med oppgitte frø og parametere. Vi vurderer
særlig om du skiller mellom **å passe data, bevare informasjon og spare lagring**.
