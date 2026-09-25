## Når er Newton rask, og når blir et steg dyrt?

I [uke 10](uke10.qmd) så vi at Newton bruker Hessianen i et lokalt
kvadratisk bilde. Et helt steg kan likevel være for langt, og
regularisering av Hessianen kan forandre retningen. Her undersøker
vi tre spørsmål med **samme funksjon**: Hva betyr startpunktet?
Hva gjør en endring av koordinatenes skala? Og hvor mye kan vi
slutte fra en solverstatus?

Dette er et prosjekt for omtrent 3–4 timers arbeid. Tyngden ligger
i utregning, forutsigelser og vurdering av data; ferdige funksjoner
utfører de repetitive iterasjonene. Skriv svarene i egne notater og
ta med tabeller/figurer fra siden. Alle kodecellene under kjøres
direkte med pyodide-interaktiv. Start øverst og kjør i rekkefølge;
oppsettet er allerede lastet på denne prosjektsiden. Du kan også
valgfritt hente [én selvstendig .py-fil](../assets/project_week10.py){download="project_week10.py"}
for arbeid i en editor. Hele prosjektet kan gjøres her på siden.

| Del | Undersøkelse | Leveranse |
|:--|:--|:--|
| 1 | Deriver og undersøk modellen | Gradient, Hessian og ett håndregnet steg. |
| 2 | Bytt startpunkt, behold skala | Forutsigelse, tabell og forklaring av to baner. |
| 3 | Bytt koordinatskala, behold mål | Kjederegel, test av invarians og sammenligning. |
| 4 | Kontroller solverkriterier | Sammenligning med SciPy og en avgrenset konklusjon. |

### 1. Modellen og den første forutsigelsen

Vi søker minimum av

$$q(u,v)=(1-u)^2+10(v-u^2)^2.$$

Fordi begge kvadrater er ikke-negative og begge blir null når
$(u,v)=(1,1)$, kjenner vi et globalt minimum med verdi null.
Derivasjon og iterasjon er likevel interessante: fra et gitt
startpunkt kan veien dit være vanskelig. Ingen andre lokale minima
trenger antas for oppgavene nedenfor.

**Regn før du kjører:** Finn $\nabla q$ og $H_q$ symbolsk. Finn
gradienten og Hessianen i $(0,0)$. Løs $H_q(0,0)p=-\nabla q(0,0)$
uten å danne inversen. Beregn deretter både modellens prediksjon
$m(p)=q(0,0)+g^Tp+\tfrac12p^THp$ og den faktiske verdien $q(p)$.
Forklar hvor de to verdiene skiller lag.

```{pyodide-python}
#| label: project-week10-model-check
x0 = np.array([0.,0.])
g0, H0 = p10_g(x0), p10_h(x0)
p0 = np.linalg.solve(H0,-g0)
model = p10_q(x0)+g0@p0+.5*p0@H0@p0
print('Gradient:',g0,'Hessian:\n',H0)
print('Retning:',p0,'modell:',model,'faktisk:',p10_q(x0+p0))
```

I resten av prosjektet bruker den ferdige Newton-rutinen en
nedgangsretning fra $H+\lambda I$, med minste egenverdi minst $0.25$,
og et Armijo-linjesøk som halverer $\alpha$ fra 1. Gradientmetoden
bruker $p=-g$ med samme linjesøk. Dette er en konkret sammenligning,
ikke en optimal implementasjon av noen av metodene.

### 2. Startpunktet

Bruk startpunktene $(-1.2,1)$, $(0,0)$ og $(2,2)$ i de opprinnelige
$(u,v)$-koordinatene. **Forutsi** hvilken start som krever flest
godkjente Newton-steg og hvilken som krever mest linjesøkarbeid.
Tror du gradientmetoden når stoppkravet fra noen av startene innen
budsjettet, og i så fall fra hvilken først? Skriv
argumentet ditt ut fra gradient og Hessian i minst to startpunkter.

Stoppkravet i koden er $\|\nabla q(x)\|_2<10^{-6}$; en metode får
høyst 80 godkjente steg. `f-prøver` teller evalueringer av målet i
linjesøket, men **ikke** gradient-, Hessian- eller lineærsystemarbeid.
En utskrift `fullførte=False` betyr bare at metoden ikke nådde
akkurat dette kravet innen budsjettet.

```{pyodide-python}
#| label: project-week10-starts
for start in ([-1.2,1.], [0.,0.], [2.,2.]):
    print('\nStart x =',start,'; skala s = 1')
    p10_report(1.,start)
```

Velg nå **to** av startene som gir mest interessant forskjell og
tegn for begge metoder. De to grafene ligger under hverandre:
øverst $q(x)$, nederst gradientnorm målt i de opprinnelige
koordinatene. Den horisontale aksen er antall **godkjente steg**.

```{pyodide-python}
#| label: project-week10-start-plot
start = [0.,0.]  # Endre til ett annet startpunkt når du har tolket figuren.
runs = {name:p10_trace(1.,start,name)
        for name in ('gradient','newton')}
p10_plot(runs)
```

**Analyser:** Gir et raskt fall i $q$ automatisk en liten gradient?
Hvilken metode bruker Hessian-løsninger, og hvorfor kan ikke
antall godkjente steg alene kalles beregningstid? Påpek minst én
begrensning ved denne kostnadstabellen.

### 3. Skala: samme punkter, en annen beskrivelse

Bytt variabler til $z=(s u,v)^T$, med $s>0$. Sett
$D=\operatorname{diag}(s,1)$, slik at $z=Dx$ og $x=D^{-1}z$.
Målet i de nye koordinatene er $Q_s(z)=q(D^{-1}z)$.

**Utled på papir:** Bruk kjerneregelen til å finne $\nabla_zQ_s$
og $H_zQ_s$ uttrykt ved $\nabla_xq$, $H_xq$ og $D$.
Bruk så $s=10$ og $x=(0,0)$ til å beregne begge nye størrelsene
numerisk for hånd. Hva er løsningen $x_*=(1,1)$ i $z$-koordinater?
Samme fysiske punkt har samme verdi av målet i begge koordinater,
men normen til gradienten avhenger av koordinatenes enheter.

```{pyodide-python}
#| label: project-week10-chain-rule-check
s = 10.
x = np.array([.2,.2])  # Bruk et punkt der begge gradientledd kan være ulike null.
d = np.array([s,1.]); z = d*x
Q,G,H = p10_scaled(s)
print('q(x), Q(z):',p10_q(x),Q(z))
print('g i x og z:',p10_g(x),G(z))
print('H i x og z:\n',p10_h(x),'\n',H(z))
print('Egenverdier i z:',np.linalg.eigvalsh(H(z)))
```

Se først på et rent Newton-steg **når Hessianen er invertibel**.
Sett $p_x=-H_x^{-1}g_x$ i symbolsk betydning og løs tilsvarende
system i $z$ med `np.linalg.solve` i beregningen. Vis algebraisk
at $p_z=Dp_x$. Den uregulariserte retningen og et helt steg
beskriver altså samme punkt, hvis vi transformerer begge riktig.
Gjelder dette også retningen $-g$, eller regelen
$H+\lambda I$ med en fast terskel $0.25$? Begrunn matematisk.

```{pyodide-python}
#| label: project-week10-step-invariance
x = np.array([0.,0.]);s = 10.;d=np.array([s,1.]);z=d*x
Q,G,H = p10_scaled(s)
px = np.linalg.solve(p10_h(x),-p10_g(x))
pz = np.linalg.solve(H(z),-G(z))
print('p i x:',px,'omregnet p i z:',d*px,'direkte p i z:',pz)
print('Faktisk objektiv etter helt steg:',p10_q(x+px),Q(z+pz))
```

Kjør deretter de faktiske, sikrede metodene på *samme startpunkt*
$x_0=(0,0)$, med $s=1$ og $s=10$. **Forutsi før kjøring:** Hvis
terskelen $0.25$ måles i $z$, hvordan kan denne terskelen endre
Newton-metoden når vi endrer $s$? Sammenlign `regulariserte`,
steg og sluttgradient i $x$, ikke bare `fullførte`.

```{pyodide-python}
#| label: project-week10-scaling
for s in (1.,10.):
    print('\nSamme fysiske start x=(0,0), skala s =',s)
    p10_report(s,[0.,0.])
```

**Din kontrollerte variant:** Endre bare én faktor: velg en tredje
skala $s$ mellom 1 og 10 eller et annet startpunkt fra del 2.
Formuler på forhånd hva du forventer, kjør med nøyaktig samme
stoppkrav og budsjett, og forklar hvorfor observasjonen støtter
eller motsier forutsigelsen. En eventuell manglende konvergens
innen 80 steg er også et resultat som må beskrives ærlig.

### 4. Hva sier en solverstatus?

Vi sammenligner med `scipy.optimize.minimize`: `BFGS` trenger
mål og gradient; `Newton-CG` får dessuten Hessianen. Begge
kjøres fra det samme **fysiske** $x_0=(0,0)$, men deres interne
stoppregler er ikke prosjektets $\|\nabla_xq\|<10^{-6}$.
`Newton-CG` er dessuten ikke vår eksplisitt regulariserte metode.

**Forutsi:** Vil antall rapporterte solveriterasjoner alene gi samme
rangering som `f-prøver`? Hvilken kontroll må oversettes tilbake
til $x$ når $s=10$?

```{pyodide-python}
#| label: project-week10-scipy
for s in (1.,10.):
    d = np.array([s,1.]); x0 = np.array([0.,0.]); z0 = d*x0
    f,g,h = p10_scaled(s)
    print('\nSkala:',s)
    for method in ('BFGS','Newton-CG'):
        kw = {'hess':h} if method == 'Newton-CG' else {}
        result = minimize(f,z0,jac=g,method=method,
                          options={'maxiter':100},**kw)
        x = result.x/d
        print(method,'status=',result.success,'iter=',result.nit,
              'f/g/H-kall=',result.nfev,result.njev,getattr(result,'nhev',0))
        print(' x=',np.round(x,7),'q=',f'{p10_q(x):.3e}',
              '||grad_x||=',f'{np.linalg.norm(p10_g(x)):.3e}',
              'vårt stoppkrav=',np.linalg.norm(p10_g(x))<1e-6)
```

Skriv en kort rapport (omtrent én side pluss regning og figurer):
Hva ble bekreftet eller avkreftet i forutsigelsene? Hvilke
transformasjoner bevarer målet og et eksakt Newton-steg?
Hvorfor endrer den valgte sikringsregelen oppførsel med skala?
Oppgi faktiske $q$, gradientnormer, status og budsjett når du
sammenligner. Det kjente globale minimumet i **dette** eksemplet
gjør en kvalitetskontroll mulig; et solverflagg ville ikke gitt
den kunnskapen alene for en ukjent funksjon.
