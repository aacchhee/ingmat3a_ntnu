```{pyodide-python}
#| label: week6-setup
#| autorun: true
#| context: setup
import numpy as np
import matplotlib.pyplot as plt

def gs_path(A, b, x0, sweeps=12):
    A, b = np.asarray(A, float), np.asarray(b, float)
    x = np.array(x0, dtype=float, copy=True)
    if np.any(np.diag(A) == 0):
        raise ValueError("GS krever ikke-null diagonalelementer")
    path = [x.copy()]
    for k in range(sweeps):
        for i in range(len(b)):
            x[i] += (b[i] - A[i] @ x) / A[i, i]
            path.append(x.copy())
    return np.array(path)

def descent_path(A, b, x0, steps=25, rtol=1e-10):
    x = np.array(x0, dtype=float, copy=True)
    path = [x.copy()]
    target = rtol * np.linalg.norm(b)
    for k in range(steps):
        r = b - A @ x
        if np.linalg.norm(r) <= target:
            break
        Ar = A @ r
        if r @ Ar <= 0:
            raise ValueError("Positiv krumning mangler; bruk SPD i dette forsøket")
        x += (r @ r)/(r @ Ar)*r
        path.append(x.copy())
    return np.array(path)

def bowl_plot(ax, A, b, paths, bounds=(-1, 3, -1, 3)):
    lo, hi, bottom, top = bounds
    u, v = np.meshgrid(np.linspace(lo, hi, 180), np.linspace(bottom, top, 180))
    Z = .5*(A[0,0]*u*u + 2*A[0,1]*u*v + A[1,1]*v*v) - b[0]*u - b[1]*v
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
    r = b - A @ x
    path, residuals = [x.copy()], [np.linalg.norm(r)]
    target = atol + rtol*np.linalg.norm(b)
    matvecs = 1
    if residuals[-1] <= target:
        return {'path':np.array(path), 'residuals':np.array(residuals),
                'converged':True, 'matvecs':matvecs, 'preconditioner_calls':0}
    p = r.copy()
    rr = r @ r
    for k in range(max_steps):
        Ap = A @ p
        matvecs += 1
        curvature = p @ Ap
        if curvature <= 0 or not np.isfinite(curvature):
            raise ValueError('CG trenger positiv krumning; kontroller SPD')
        alpha = rr / curvature
        x = x + alpha*p
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
        p = r + (rr_new/rr)*p
        rr = rr_new
    return {'path':np.array(path), 'residuals':np.array(residuals),
            'converged':residuals[-1] <= target, 'matvecs':matvecs,
            'preconditioner_calls':0}
```
