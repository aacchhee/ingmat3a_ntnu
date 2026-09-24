```{pyodide-python}
#| label: project-week6-setup
#| autorun: true
#| context: setup
# Prosjektverktøy: CG, NumPy og Matplotlib kommer fra week6-setup.
# Matematiske data og kontroller beskrives i selve prosjektet.

def coupled_problem(n, span, coupling):
    if n < 2 or span < 1 or not 0 <= coupling < 1:
        raise ValueError('Bruk n >= 2, span >= 1 og 0 <= coupling < 1')
    d = np.geomspace(1., span, n)
    B = 2*np.eye(n) - coupling*(np.eye(n,k=1)+np.eye(n,k=-1))
    return d[:,None]*B*d[None,:]

def make_week6_problems(n=60):
    """To SPD-systemer med samme kjente løsning og ulik skalering/kobling."""
    rng = np.random.default_rng(6)
    star = rng.normal(size=n)
    problems = {
        'Ujevn skalering': coupled_problem(n, 100., .25),
        'Poisson': 2*np.eye(n) - np.eye(n,k=1) - np.eye(n,k=-1),
    }
    return star, problems


def show_coordinate_change(A, b, At, bt):
    """Samme kvadratiske problem i x- og y-koordinater, for oppvarmingen."""
    fig, axes = plt.subplots(2,1,figsize=(7,9))
    bowl_plot(axes[0], A, b, {}, bounds=(-2,4,-1,3))
    bowl_plot(axes[1], At, bt, {}, bounds=(-3,5,6,14))
    axes[0].set(title='Opprinnelige x-koordinater', xlabel='x₁', ylabel='x₂')
    axes[1].set(title='Nye y-koordinater', xlabel='y₁', ylabel='y₂')
    fig.tight_layout(); plt.show()


def show_spectra(problems, transformed):
    """Egenverdier og kondisjonstall før/etter symmetrisk skalering."""
    fig, axes = plt.subplots(len(problems), 1, figsize=(7,4*len(problems)), squeeze=False)
    for ax, (name, A) in zip(axes[:,0], problems.items()):
        At = transformed[name][0]
        lam, lamt = np.linalg.eigvalsh(A), np.linalg.eigvalsh(At)
        ax.semilogy(lam, '.', label='A')
        ax.semilogy(lamt, '.', label='Symmetrisk skalert A')
        ax.set(title=name, xlabel='Sortert indeks', ylabel='Egenverdi')
        ax.legend()
        print(name, 'κ₂ før:', lam[-1]/lam[0], 'etter:', lamt[-1]/lamt[0])
    fig.tight_layout(); plt.show()


def compare_runs(A, b, star, runs):
    fig, axes = plt.subplots(2,1,figsize=(7,8))
    print(f'{"Metode":<8} {"Steg":>5} {"A-prod.":>8} {"M-løsn.":>8} '
          f'{"Rel. residual":>14} {"Rel. feil":>12} {"Konvergert":>11}')
    for name, out in runs.items():
        path = out['path']
        # I disse implementasjonene: én startberegning og to produkter per steg.
        work = 1 + 2*np.arange(len(path))
        residuals = out['residuals']/np.linalg.norm(b)
        # axis=1 tar lengden av hver rad: én feilnorm per lagret løsningsforslag.
        errors = np.linalg.norm(path-star,axis=1)/np.linalg.norm(star)
        axes[0].semilogy(work, np.maximum(residuals,1e-16), label=name)
        axes[1].semilogy(work, np.maximum(errors,1e-16), label=name)
        print(f'{name:<8} {len(path)-1:5d} {out["matvecs"]:8d} '
              f'{out["preconditioner_calls"]:8d} {residuals[-1]:14.3e} '
              f'{errors[-1]:12.3e} {str(out["converged"]):>11}')
    for ax, label in zip(axes,['Original relativ residual','Relativ løsningsfeil']):
        ax.set(xlabel='Antall A-vektor-produkter inkl. stoppkontroll',ylabel=label)
        ax.legend()
    fig.tight_layout(); plt.show()


def check_pcg(pcg_method):
    """Fire kontroller av studentens fullførte PCG før hovedforsøket."""
    A = np.diag([1.,100.]); star = np.ones(2); b = A @ star
    one = pcg_method(A, b, np.diag(A), rtol=1e-12)
    assert one['converged'] and len(one['path']) == 2, 'Diagonaltesten skal bruke ett steg.'
    assert np.allclose(one['path'][-1], star), 'Kontroller diagonalløsningen.'
    A = np.array([[1.,2.],[2.,100.]]); b = A @ star
    ref = cg(A, b, rtol=1e-12)
    identity = pcg_method(A, b, np.ones(2), rtol=1e-12)
    assert identity['converged'] and np.allclose(identity['path'],ref['path']), 'M=I skal gi CG.'
    exact = pcg_method(A, b, np.diag(A), x0=star, rtol=1e-12)
    assert exact['converged'] and len(exact['path']) == 1, 'Eksakt start skal gi null steg.'
    w = 1/np.sqrt(np.diag(A))
    At = w[:,None]*A*w[None,:]; bt = w*b
    direct = pcg_method(A, b, np.diag(A), rtol=1e-12)
    changed = cg(At, bt, rtol=1e-12)
    assert direct['converged'] and changed['converged'], 'Begge koordinatbeskrivelser skal konvergere.'
    assert np.allclose(direct['path'], changed['path']*w), 'Banene må stemme etter omregning.'
    print('Fire PCG-kontroller bestått: ett steg, M=I, eksakt start og koordinatskifte.')
```
