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


def _data_axes(ax, yy=damage):
    """Tegner oppskytingene som punkter i høyde 0 og 1 (litt spredt så like punkter synes)."""
    ax.plot(temps, yy + np.linspace(-.02, .02, temps.size), 'ko', markersize=4,
            label='oppskytinger (0 = ingen skade, 1 = skade)')
    ax.set(xlabel='temperatur T (°F)')


def show_line_fit(line):
    """Data og minste kvadraters linje line[0] + line[1] T, med områdene der linjen
    gir verdier under 0 eller over 1."""
    T = np.linspace(25, 85, 300)
    v = line[0] + line[1]*T
    fig, ax = plt.subplots(figsize=(6.5, 4))
    _data_axes(ax)
    ax.plot(T, v, label='rett linje (minste kvadrater)')
    ax.fill_between(T, v, 1, where=v > 1, color='#b5483f', alpha=.25, label='over 1')
    ax.fill_between(T, v, 0, where=v < 0, color='#b5483f', alpha=.5, label='under 0')
    ax.axhline(0, color='gray', lw=.8); ax.axhline(1, color='gray', lw=.8)
    ax.set(ylabel='«sannsynlighet» for skade', ylim=(-.25, 1.9))
    ax.legend(fontsize=8, loc='upper right'); plt.show()


def show_curves(betas, labels):
    """Data og S-kurvene p(T) = sigma(beta0 + beta1 T), med terskelen der p = 1/2."""
    T = np.linspace(40, 90, 300)
    fig, ax = plt.subplots(figsize=(6.5, 4))
    _data_axes(ax)
    for beta, label in zip(betas, labels):
        ax.plot(T, sigma(beta[0] + beta[1]*T), label=label)
    ax.axhline(.5, color='gray', lw=.8, ls=':')
    ax.axvline(-betas[0][0]/betas[0][1], color='gray', lw=.8, ls='--', label='terskel, p = 1/2')
    ax.set(ylabel='p(T)', ylim=(-.08, 1.08)); ax.legend(fontsize=8, loc='center left'); plt.show()


def show_fit(beta_F, label='tilpasset modell'):
    """Data og sannsynlighetskurven p(T) = sigma(beta0 + beta1 T), T i °F."""
    T = np.linspace(25, 85, 300)
    fig, ax = plt.subplots(figsize=(6.5, 4))
    _data_axes(ax)
    ax.plot(T, sigma(beta_F[0] + beta_F[1]*T), label=label)
    ax.axvspan(temps.min(), temps.max(), color='#e8eef5', label='temperaturer i dataene')
    ax.axvline(31, color='#b5483f', linestyle='--', label='31 °F')
    ax.set(ylabel='p(T)', ylim=(-.08, 1.08))
    ax.legend(fontsize=8, loc='center left'); plt.show()


def show_cycles(paths, beta_min):
    """De siste 200 punktene for hver steglengde, i (beta0'', beta1'')-planet.
    paths: {alpha: array med alle punktene}."""
    fig, ax = plt.subplots(figsize=(6, 5))
    for alpha, path in paths.items():
        ax.plot(path[-200:, 0], path[-200:, 1], '.', markersize=5, label=f'α = {alpha}, siste 200')
    ax.plot(*beta_min, 'k*', markersize=12, label='minimum')
    ax.set(xlabel='β₀″', ylabel='β₁″'); ax.legend(); plt.show()


def show_separation(history):
    """|beta|, L og |grad L| mot steg k i log-log-skala. history: liste med (k, |beta|, L, |grad L|)."""
    h = np.array(history)
    fig, ax = plt.subplots(figsize=(6.5, 4))
    ax.loglog(h[:, 0], h[:, 1], label='|β|')
    ax.loglog(h[:, 0], h[:, 2], label='L(β)')
    ax.loglog(h[:, 0], h[:, 3], label='|∇L(β)|')
    ax.set(xlabel='steg k'); ax.legend(); plt.show()


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
alpha_c = 4/np.linalg.svd(X_c, compute_uv=False)[0]**2
```
