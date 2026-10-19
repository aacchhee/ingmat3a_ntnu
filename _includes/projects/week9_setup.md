```{pyodide-python}
#| label: project-week9-setup
#| autorun: true
#| context: setup
# Prosjektverktøy for prosjekt 9: data, tapsfunksjon, Hessian og figurer.
# Gradienten og gradientmetoden skriver du selv i prosjektet.
import numpy as np
import matplotlib.pyplot as plt

# 23 oppskytinger før Challenger (Dalal, Fowlkes & Hoadley 1989, tabell 1).
# temps: temperatur ved oppskyting i °F. damage: 1 hvis minst én O-ring viste varmeskade.
temps = np.array([66, 70, 69, 68, 67, 72, 73, 70, 57, 63, 70, 78,
                  67, 53, 67, 75, 70, 81, 76, 79, 75, 76, 58.])
damage = np.array([0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
                   0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1.])

# Publiserte koeffisienter for modellen med temperatur i °F (fasit).
beta_oracle = np.array([15.0429, -0.23216])


def design(t):
    """Matrisen X med en kolonne med ettall og en kolonne med temperaturene t."""
    t = np.asarray(t, float)
    return np.column_stack([np.ones_like(t), t])


def sigma(s):
    """Den logistiske funksjonen 1/(1 + e^(-s))."""
    return 1/(1 + np.exp(-s))


def loss(X, beta, yy=damage):
    """L(beta) = sum log(1 + e^s_i) - y_i s_i med s = X beta."""
    s = X @ beta
    return np.sum(np.logaddexp(0, s) - yy*s)


def hessian(X, beta):
    """H = X^T W X med W = diag(p_i (1 - p_i))."""
    p = sigma(X @ beta)
    return X.T @ (X * (p*(1 - p))[:, None])


def armijo_gd(X, grad, max_steps=2000, tol=1e-6, yy=damage):
    """Gradientmetoden med Armijo-søk fra uke 9: start med alpha = 1 og halver.
    grad er din egen funksjon grad(X, beta, yy). Returnerer beta, steg og
    antall ekstra funksjonsverdier brukt på halveringer."""
    beta, k, extra = np.zeros(2), 0, 0
    while k < max_steps:
        g = grad(X, beta, yy)
        if np.linalg.norm(g) < tol:
            break
        alpha, L0 = 1., loss(X, beta, yy)
        while loss(X, beta - alpha*g, yy) > L0 - 1e-4*alpha*(g @ g):
            alpha /= 2
            extra += 1
        beta = beta - alpha*g
        k += 1
    return beta, k, extra


def show_fit(beta_F, label='tilpasset modell'):
    """Data og sannsynlighetskurven p(T) = sigma(beta0 + beta1 T), T i °F."""
    T = np.linspace(25, 85, 300)
    fig, ax = plt.subplots(figsize=(6.5, 4))
    ax.plot(temps, damage + np.linspace(-.02, .02, temps.size), 'ko',
            markersize=4, label='oppskytinger (0 = ingen skade, 1 = skade)')
    ax.plot(T, sigma(beta_F[0] + beta_F[1]*T), label=label)
    ax.axvspan(temps.min(), temps.max(), color='#e8eef5', label='temperaturer i dataene')
    ax.axvline(31, color='#b5483f', linestyle='--', label='31 °F')
    ax.set(xlabel='temperatur T (°F)', ylabel='p(T)', ylim=(-.08, 1.08))
    ax.legend(fontsize=8, loc='center left'); plt.show()


# Ferdige datamatriser, slik at cellene virker i hvilken som helst rekkefølge.
# De samme lages i prosjektet der de brukes første gang (del 1 og del 3).
m, d = temps.mean(), temps.std()          # gjennomsnitt og standardavvik
designs = {'rå T': design(temps),
           'sentrert T - 70': design(temps - 70),
           'standardisert (T - m)/d': design((temps - m)/d)}
X_raw = designs['rå T']
X_c = designs['sentrert T - 70']
X_std = designs['standardisert (T - m)/d']
alpha_raw = 4/np.linalg.svd(X_raw, compute_uv=False)[0]**2   # trygt steg 4/σ1²
```
