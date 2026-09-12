"""Check lecture experiments, CG claims and a completed PCG exercise."""
from pathlib import Path
import re
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT = Path(__file__).resolve().parents[1]
PATTERN = r'```\{pyodide-python\}\n(.*?)```'

def cells(path):
    return re.findall(PATTERN, (ROOT / path).read_text(), re.S)

def run(code, ns):
    exec(compile(code, 'week6-cell', 'exec'), ns)
    plt.close('all')

def main():
    ns = {}
    for file in ['_includes/linalg/week6_setup.md', '_includes/linalg/uke6.md']:
        for code in cells(file): run(code, ns)
    assert np.allclose(ns['gs_path'](np.array([[3.,1.],[1.,2.]]), np.array([5.,5.]),[0,0],2)[::2],
                       [[0,0],[5/3,5/3],[10/9,35/18]])
    lecture_cg = ns['cg']
    A = np.array([[3.,1.],[1.,2.]])
    b = np.array([5.,5.])
    out = lecture_cg(A, b, rtol=1e-12)
    assert out['converged'] and len(out['path']) == 3
    assert np.allclose(out['path'], [[0,0],[10/7,10/7],[1,2]])
    p0 = b.copy()
    r1 = b - A @ out['path'][1]
    p1 = r1 + (r1 @ r1)/(b @ b)*p0
    assert np.allclose(p1, [-30/49, 40/49])
    assert abs(p0 @ A @ p1) < 1e-12
    # CG minimizes the A-energy; this does not assert monotone residual norms.
    errors = out['path'] - np.array([1.,2.])
    energy = np.einsum('ij,jk,ik->i', errors, A, errors)
    assert np.all(np.diff(energy) <= 1e-12)
    stopped = lecture_cg(A, b, rtol=1e-12, max_steps=1)
    assert not stopped['converged'] and len(stopped['path']) == 2
    assert lecture_cg(A, b, x0=np.array([1.,2.]))['matvecs'] == 1
    Q = np.array([[1.,-1.],[1.,1.]])/np.sqrt(2)
    narrow = Q @ np.diag([1., .04]) @ Q.T
    rhs = narrow @ np.array([1.,-1.1])
    cg_narrow = lecture_cg(narrow, rhs, rtol=1e-10)
    sd_narrow = ns['descent_path'](narrow, rhs, [0.,0.], steps=16)
    assert cg_narrow['converged'] and len(cg_narrow['path']) <= 3
    assert np.linalg.norm(rhs-narrow@sd_narrow[-1]) > 1e-6
    # Project must run from its own setup, without a previous lecture session.
    ns = {}
    for code in cells('_includes/linalg/week6_setup.md'): run(code, ns)
    for code in cells('_includes/projects/week6_preconditioning.md'):
        # Finish only the student's three marked expressions for verification.
        code = code.replace("raise NotImplementedError('TODO 1')", 'return r/m')
        code = code.replace('beta = None', 'beta = gamma_new/gamma').replace('p = None', 'p = z + beta*p')
        run(code, ns)
    # Same diagonal, changed couplings: independently verify promised SPD family.
    family = [ns['coupled_problem'](12,20,c) for c in (0,.4,.99)]
    assert all(np.allclose(np.diag(A),np.diag(family[0])) for A in family)
    assert all(np.linalg.eigvalsh(A).min()>0 for A in family)
    cg, pcg = ns['cg'], ns['pcg']
    # The displayed project routine and lecture helper must produce the same CG run.
    assert np.allclose(cg(A,b,rtol=1e-12)['path'], out['path'])
    for name, A in ns['problems'].items():
        star=ns['x_star']; b=A@star; m=np.diag(A)
        c=cg(A,b); p=pcg(A,b,m)
        for result in [c,p]:
            assert result['converged'], name
            assert np.linalg.norm(b-A@result['path'][-1])/np.linalg.norm(b) <= 1e-8
            assert np.allclose(result['residuals'],
                               np.linalg.norm(b-result['path']@A.T, axis=1))
            assert result['matvecs'] == 1+2*(len(result['path'])-1)
        print(name,'CG',len(c['path'])-1,'PCG',len(p['path'])-1)
        if name == 'Ujevn skalering': assert len(p['path']) < len(c['path'])/3
        else: assert np.allclose(c['path'],p['path'])
        identity=pcg(A,b,np.ones(len(b)))
        assert np.allclose(c['path'],identity['path'])
        exact=pcg(A,b,m,x0=star)
        assert len(exact['path'])==1 and exact['converged']
    A=np.diag([1.,100.]); b=A@np.ones(2)
    assert len(pcg(A,b,np.diag(A))['path'])==2
    A=ns['A2']; b=ns['b2']; w=ns['w']
    transformed=cg(ns['At2'],ns['bt2'],rtol=1e-12)
    direct=pcg(A,b,np.diag(A),rtol=1e-12)
    assert np.allclose(transformed['path']*w,direct['path'])
    # Exercise controls must remain finite on zero RHS and stop immediately.
    assert cg(np.eye(2),np.zeros(2))['converged']
    assert pcg(np.eye(2),np.zeros(2),np.ones(2))['converged']
    for file in ['_includes/linalg/uke6.md','_includes/projects/week6_preconditioning.md']:
        text=(ROOT/file).read_text()
        assert text.count('<details ')==text.count('</details>')
    print('Week 6 cells, CG directions/stopping/energy and PCG comparisons passed.')

if __name__=='__main__': main()
