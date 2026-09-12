"""Execute teaching cells and validate a completed version of the PCG exercise."""
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
    for code in cells('_includes/projects/week6_preconditioning.md'):
        # Finish only the student's three marked expressions for verification.
        code = code.replace("raise NotImplementedError('TODO 1')", 'return r/m')
        code = code.replace('beta = None', 'beta = gamma_new/gamma').replace('p = None', 'p = z + beta*p')
        run(code, ns)
    cg, pcg = ns['cg'], ns['pcg']
    for name, A in ns['problems'].items():
        star=ns['x_star']; b=A@star; m=np.diag(A)
        c=cg(A,b); p=pcg(A,b,m)
        for result in [c,p]:
            assert result['converged'], name
            assert np.linalg.norm(b-A@result['path'][-1])/np.linalg.norm(b) <= 1e-8
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
    print('Week 6 cells, hand calculations, PCG controls and comparison experiments passed.')

if __name__=='__main__': main()
