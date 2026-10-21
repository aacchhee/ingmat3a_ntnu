```{pyodide-python}
#| label: project-week10-setup
#| autorun: true
#| context: setup
# Ferdige data, avstandsmodell og hjelpere til prosjekt 10.
# Deriverte og følsomhetsformel er gitt; Gauss-Newton-steget og Armijo-løkken skrives på siden.
import numpy as np
import matplotlib.pyplot as plt

# Hallen er 10 m x 8 m. Rad i er koordinatene (meter) til anker i.
hall = np.array([[0., 0.], [10., 0.], [10., 8.], [0., 8.]])
z_true = np.array([3., 5.])                       # fasit, bare for kontroll
d_exact = np.linalg.norm(z_true - hall, axis=1)   # avstander uten målefeil
d_noisy = d_exact + np.array([.3, -.4, .5, -.2])  # målefeil på noen desimeter
d_bad = d_exact + np.array([0., 0., 3., 0.])      # anker 3 måler 3 m for langt

# Fire ankre langs én vegg, nesten på en rett linje (del 4).
wall = np.array([[0., 0.], [4., .1], [7., -.1], [10., 0.]])
z_true_wall = np.array([6., 3.])
d_wall = np.linalg.norm(z_true_wall - wall, axis=1)


def residual(z, B, d):
    """Beregnet avstand minus målt avstand, én komponent per anker."""
    return np.linalg.norm(np.asarray(z, float) - B, axis=1) - d


def jacobian(z, B):
    """Gitt formel: rad i er enhetsvektoren fra anker i til z (z ulik alle ankre)."""
    D = np.asarray(z, float) - B
    return D / np.linalg.norm(D, axis=1)[:, None]


def move(J, delta_d):
    """Lineær følsomhet: minste kvadraters løsning av J dz = delta_d."""
    return np.linalg.lstsq(J, delta_d, rcond=None)[0]


def dropped_part(z, B, r, J):
    """Den delen av Hessianen som Gauss-Newton dropper (2 x 2-matrise)."""
    D = z - B
    n = np.linalg.norm(D, axis=1)
    return sum(r[i]*(np.eye(2) - np.outer(J[i], J[i]))/n[i] for i in range(len(r)))


def newton_position(z0, B, d, residual, jacobian, steps=8):
    """Rene Newton-steg for F(z) = 1/2 ||r(z)||^2. Returnerer alle punkter."""
    z = np.array(z0, float)
    points = [z.copy()]
    for _ in range(steps):
        J, r = jacobian(z, B), residual(z, B, d)
        H = J.T @ J + dropped_part(z, B, r, J)
        z = z + np.linalg.solve(H, -J.T @ r)
        points.append(z.copy())
    return np.array(points)


def show_hall(B, d=None, paths=(), labels=(), true=None, box=(-2, 12, -6, 10)):
    """Tegn ankrene, eventuelt nivåkurver for ||r(z)||, baner og fasit."""
    fig, ax = plt.subplots(figsize=(6, 5))
    if d is not None:
        X, Y = np.meshgrid(np.linspace(box[0], box[1], 200),
                           np.linspace(box[2], box[3], 200))
        P = np.stack([X.ravel(), Y.ravel()], axis=1)
        R = np.sqrt(sum((np.hypot(P[:, 0]-b[0], P[:, 1]-b[1]) - di)**2
                        for b, di in zip(B, d))).reshape(X.shape)
        cs = ax.contour(X, Y, R, levels=[.25, .5, 1, 2, 3, 4, 6],
                        colors='#adb5bd', linewidths=.8)
        ax.clabel(cs, fontsize=7)
    ax.plot(B[:, 0], B[:, 1], 'ks', markersize=7, label='ankre')
    for path, label in zip(paths, labels):
        path = np.asarray(path)
        ax.plot(path[:, 0], path[:, 1], 'o-', markersize=3, label=label)
    if true is not None:
        ax.plot(*true, 'k*', markersize=12, label='fasit')
    ax.set(xlim=box[:2], ylim=box[2:], xlabel='x (m)', ylabel='y (m)')
    ax.set_aspect('equal'); ax.legend(fontsize=8); plt.show()


def show_moves(center, J, eps, groups):
    """Flyttinger av anslaget (punkter) og ellipsen med halvakser eps/sigma_i langs v_i.
    groups er en ordbok {navn: liste med flyttinger dz}."""
    U, s, Vt = np.linalg.svd(J, full_matrices=False)
    for i in range(2):                  # fortegnet er fritt: gjør største komponent i v_i positiv
        if Vt[i, np.argmax(abs(Vt[i]))] < 0:
            Vt[i] = -Vt[i]
    t = np.linspace(0, 2*np.pi, 200)
    ellipse = center[:, None] + Vt.T @ np.vstack([eps/s[0]*np.cos(t), eps/s[1]*np.sin(t)])
    fig, ax = plt.subplots(figsize=(5, 5.8))
    ax.plot(ellipse[0], ellipse[1], 'r-', label='ellipse fra SVD')
    for label, moves in groups.items():
        P = center + np.asarray(moves)
        ax.plot(P[:, 0], P[:, 1], 'o', markersize=4, label=label)
    for i in range(2):
        tip = center + eps/s[i]*Vt[i]
        ax.annotate('', tip, center, arrowprops={'arrowstyle': '->', 'color': 'k'})
        ax.text(*(center + 1.15*eps/s[i]*Vt[i]), f'$v_{i+1}$', ha='center', va='center')
    ax.plot(*center, 'k*', markersize=10)
    w = 1.3*eps/s[1]
    ax.set(xlim=(center[0] - w, center[0] + w), ylim=(center[1] - w, center[1] + w),
           xlabel='x (m)', ylabel='y (m)')
    ax.set_aspect('equal')
    ax.legend(fontsize=8, loc='upper center', bbox_to_anchor=(.5, -.13))
    fig.tight_layout(); plt.show()
```
