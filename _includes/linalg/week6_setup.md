```{pyodide-python}
#| label: week6-setup
#| autorun: true
#| context: setup
# Hjelpefunksjoner for ukens forsøk: hver bane lagrer alle løsningsforslag.
# Les særlig koblingen mellom residual, korreksjon og stoppkontroll.
# Oppsettet kjøres automatisk; det er ikke en ekstra implementasjonsoppgave.

import numpy as np
import matplotlib.pyplot as plt

# GS korrigerer én koordinat om gangen og lagrer også mellomstegene.
def gs_path(A, b, x0, sweeps=12):
    A, b = np.asarray(A, float), np.asarray(b, float)
    x = np.array(x0, dtype=float, copy=True)
    if np.any(np.diag(A) == 0):
        raise ValueError("GS krever ikke-null diagonalelementer")
    path = [x.copy()]
    for k in range(sweeps):
        for i in range(len(b)):
            # Bruk gjeldende x, inkludert koordinatene som allerede er oppdatert i sveipet.
            x[i] += (b[i] - A[i] @ x) / A[i, i]
            path.append(x.copy())
    return np.array(path)

# Bratteste nedstigning velger ny residualretning ved hvert steg, uten CGs hukommelse.
def descent_path(A, b, x0, steps=25, rtol=1e-10):
    x = np.array(x0, dtype=float, copy=True)
    path = [x.copy()]
    target = rtol * np.linalg.norm(b)
    for k in range(steps):
        # Residualen er ubalansen i de opprinnelige likningene, og kan beregnes uten fasit.
        r = b - A @ x
        if np.linalg.norm(r) <= target:
            break
        Ar = A @ r
        if r @ Ar <= 0:
            raise ValueError("Positiv krumning mangler; bruk SPD i dette forsøket")
        # Kvotienten gir minimum langs linjen x + alpha*r for en SPD-matrise.
        x += (r @ r)/(r @ Ar)*r
        path.append(x.copy())
    return np.array(path)

# Tegn nivåkurver for den kvadratiske funksjonen og baner fra valgte metoder.
def bowl_plot(ax, A, b, paths, bounds=(-1, 3, -1, 3)):
    lo, hi, bottom, top = bounds
    u, v = np.meshgrid(np.linspace(lo, hi, 180), np.linspace(bottom, top, 180))
    Z = .5*(A[0,0]*u*u + 2*A[0,1]*u*v + A[1,1]*v*v) - b[0]*u - b[1]*v
    # Direkte løsning brukes bare som referansepunkt i figuren, ikke av iterasjonen.
    star = np.linalg.solve(A, b)
    minimum = .5*star @ A @ star - b @ star
    span = max(float(Z.max()-minimum), 1.)
    ax.contour(u, v, Z, levels=minimum+np.geomspace(.01, span, 14), colors='#adb5bd')
    for name, values in paths.items():
        ax.plot(values[:,0], values[:,1], 'o-', markersize=3, label=name)
    ax.plot(*star, '*', color='black', markersize=12, label='løsning')
    ax.set(xlabel='x₁', ylabel='x₂', xlim=(lo, hi), ylim=(bottom, top))
    ax.set_aspect('equal')
    ax.legend()


def cg(A, b, x0=None, rtol=1e-8, atol=0., max_steps=1000):
    A, b = np.asarray(A, float), np.asarray(b, float)
    if A.shape != (b.size, b.size) or not np.allclose(A, A.T):
        raise ValueError('Bruk en symmetrisk kvadratisk matrise')
    x = np.zeros_like(b) if x0 is None else np.array(x0, float, copy=True)
    if x.shape != b.shape or rtol <= 0 or atol < 0 or max_steps < 1:
        raise ValueError('Kontroller start, toleranser og maksimalgrense')
    if not all(np.all(np.isfinite(t)) for t in [A, b, x]):
        raise ValueError('Bruk endelige tall')
    # Residualen er ubalansen i de opprinnelige likningene, og kan beregnes uten fasit.
    r = b - A @ x
    # Starten teller som første lagrede punkt, men ikke som et iterasjonssteg.
    path, residuals = [x.copy()], [np.linalg.norm(r)]
    # Absolutt margin pluss margin relativt til b; samme krav brukes ved sammenligning.
    target = atol + rtol*np.linalg.norm(b)
    matvecs = 1
    # Kontroller også startforslaget: riktig start skal stoppe før noen divisjon.
    if residuals[-1] <= target:
        return {'path':np.array(path), 'residuals':np.array(residuals),
                'converged':True, 'matvecs':matvecs, 'preconditioner_calls':0}
    p = r.copy()
    rr = r @ r
    for k in range(max_steps):
        Ap = A @ p
        matvecs += 1
        # p.T @ A @ p er positiv for en ikke-null retning når A er SPD.
        curvature = p @ Ap
        if curvature <= 0 or not np.isfinite(curvature):
            raise ValueError('CG trenger positiv krumning; kontroller SPD')
        # Velg minimum langs søkeretningen; rr er r.T @ r i vanlig CG.
        alpha = rr / curvature
        x = x + alpha*p
        # Kort oppdatering av residualen; avrunding kan gi avvik fra direkte beregnet b-Ax.
        r = r - alpha*Ap
        # Direkte kontroll i det opprinnelige systemet.
        actual = np.linalg.norm(b - A @ x)
        matvecs += 1
        path.append(x.copy()); residuals.append(actual)
        if actual <= target:
            break
        rr_new = r @ r
        if rr_new == 0:
            break  # Rapporter manglende konvergens hvis direkte kontroll ikke var liten.
        # Kombiner ny residual med forrige retning for å bevare A-konjugerthet i eksakt regning.
        p = r + (rr_new/rr)*p
        rr = rr_new
    return {'path':np.array(path), 'residuals':np.array(residuals),
            'converged':residuals[-1] <= target, 'matvecs':matvecs,
            'preconditioner_calls':0}
```
