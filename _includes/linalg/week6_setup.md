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
```
