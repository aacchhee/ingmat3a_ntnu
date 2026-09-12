"""Run week 7 teaching cells and verify the two completed student exercises."""
from pathlib import Path
import re
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]

def cells(path):
    return re.findall(r'```\{pyodide-python\}\n(.*?)```', (ROOT/path).read_text(), re.S)

def run(code, ns):
    exec(compile(code, 'week7-cell', 'exec'), ns)
    plt.close('all')

def main():
    ns = {}
    for file in ['_includes/linalg/week7_setup.md', '_includes/linalg/uke7.md']:
        for code in cells(file):
            run(code, ns)
    # Each choice runs from a fresh project setup and the common core only.
    project = (ROOT/'_includes/projects/week7_svd.md').read_text()
    core, branches = project.split('## Velg A:',1)
    branch_a, branch_b = branches.split('## Velg B:',1)
    states = []
    for branch in (branch_a, branch_b):
        ns = {}
        # Exercise the exact downloadable setup, including embedded image data.
        run((ROOT/'assets/project_week7_setup.py').read_text(),ns)
        for code in re.findall(r'```\{pyodide-python\}\n(.*?)```', core+branch, re.S):
            code = code.replace("raise NotImplementedError('Fyll inn trunkert rekonstruksjon')",
                                'return (U[:, :k]*s[:k]) @ Vt[:k, :]')
            code = code.replace("raise NotImplementedError('Fyll inn trunkert inversjon')",
                                'return Vt[:k, :].T @ ((U[:, :k].T @ b)/s[:k])')
            run(code, ns)
        states.append(ns)
    assert states[0]['k_budget'] in states[0]['ranks']
    # Merge only after both independent executions, for the shared assertions below.
    ns = {**states[0], **states[1]}
    first = ns['blur_problem'](noise_level=.005,seed=17)
    doubled = ns['blur_problem'](noise_level=.01,seed=17)
    fresh = ns['blur_problem'](noise_level=.005,seed=18)
    assert np.allclose(doubled[4]-doubled[3],2*(first[4]-first[3]))
    assert np.array_equal(first[1],fresh[1]) and np.array_equal(first[2],fresh[2])
    assert not np.allclose(first[4],fresh[4])
    truncate, tsvd = ns['truncate'], ns['tsvd']
    rng = np.random.default_rng(91)
    for shape in [(3,7),(7,3)]:
        A = rng.normal(size=shape)
        U,s,Vt = np.linalg.svd(A,full_matrices=False)
        for k in range(len(s)+1):
            Ak = truncate(U,s,Vt,k)
            assert Ak.shape == A.shape
            assert np.isclose(np.linalg.norm(A-Ak)**2,np.sum(s[k:]**2))
        b = rng.normal(size=shape[0])
        assert np.allclose(tsvd(U,s,Vt,b,len(s)),np.linalg.lstsq(A,b,rcond=None)[0])
    images = ns['challenge_images']()
    assert {A.shape for A in images.values()} == {(96,96)}
    assert ns['k_budget'] == 11
    assert 11*193 <= .25*96**2 < 12*193
    D = images['diagonal']
    assert np.allclose(np.linalg.svd(D,compute_uv=False),1)
    assert np.isclose(np.linalg.norm(D-ns['rank_image'](D,11))/np.linalg.norm(D),np.sqrt(85/96))
    # The known clean reference should expose overfitting in both extensions.
    assert min(ns['error_to_clean']) < ns['error_to_clean'][-1]
    assert np.all(np.diff(ns['error_to_data']) <= 1e-12)
    assert min(ns['errors']) < ns['errors'][0] and min(ns['errors']) < ns['errors'][-1]
    assert np.all(np.diff(ns['residuals']) <= 1e-10)
    print('Denoising best relative error:',min(ns['error_to_clean']))
    print('Inverse blur best relative error:',min(ns['errors']))
    if ns['direct'] is not None:
        assert np.linalg.norm(ns['direct']-ns['truth']) > 100*np.linalg.norm(ns['truth'])
    for file in ['_includes/linalg/uke7.md','_includes/projects/week7_svd.md']:
        text = (ROOT/file).read_text()
        assert text.count('<details ')==text.count('</details>')
    print('Week 7 cells, rectangular reconstruction, budget, tail error and both extensions passed.')

if __name__ == '__main__':
    main()
