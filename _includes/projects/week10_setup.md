```{pyodide-python}
#| label: project-week10-setup
#| autorun: true
#| context: setup
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

# Prosjektets mål er q(u,v)=(1-u)^2+10(v-u^2)^2. z=(s*u,v).
def p10_q(x):
    u,v = x
    return (1-u)**2 + 10*(v-u*u)**2

def p10_g(x):
    u,v = x
    return np.array([2*(u-1)-40*u*(v-u*u),20*(v-u*u)])

def p10_h(x):
    u,v = x
    return np.array([[2-40*v+120*u*u,-40*u],[-40*u,20.]])

def p10_scaled(s):
    if s <= 0:
        raise ValueError('Skala s må være positiv')
    d = np.array([s,1.]);
    return (lambda z: p10_q(z/d),
            lambda z: p10_g(z/d)/d,
            lambda z: p10_h(z/d)/d[:,None]/d[None,:])

def p10_armijo(f, z, g, p, max_halvings=35):
    slope = float(g @ p)
    if not np.isfinite(slope) or slope >= 0:
        raise ValueError('Ikke en nedgangsretning')
    baseline = f(z)
    alpha = 1.
    for j in range(max_halvings+1):
        if f(z+alpha*p) <= baseline+1e-4*alpha*slope:
            return alpha,j+2  # Én evaluering av baseline og j+1 prøvepunkter.
        alpha *= .5
    raise RuntimeError('Linjesøket nådde grensen')

def p10_trace(s, x0, method, max_steps=80, tol=1e-6):
    """Sammenlign med kontroll av gradient i de opprinnelige variablene."""
    f,g,h = p10_scaled(s)
    d = np.array([s,1.]); z = d*np.asarray(x0,float)
    path = [z/d]; alphas=[]; shifts=[]; f_calls=0
    for k in range(max_steps):
        gx = p10_g(z/d)
        if np.linalg.norm(gx) < tol:
            break
        gz = g(z)
        if method == 'gradient':
            p = -gz; shift=0.
        elif method == 'newton':
            Hz = h(z)
            shift = max(0., .25-np.linalg.eigvalsh(Hz)[0])
            p = np.linalg.solve(Hz+shift*np.eye(2),-gz)
        else:
            raise ValueError('Velg gradient eller newton')
        alpha, calls = p10_armijo(f,z,gz,p)
        f_calls += calls
        z = z+alpha*p
        path.append(z/d); alphas.append(alpha); shifts.append(shift)
    x = z/d
    return {'x':x,'path':np.array(path),'steps':len(path)-1,
            'f_calls':f_calls,'gradnorm':np.linalg.norm(p10_g(x)),
            'value':p10_q(x),'alphas':np.array(alphas),
            'shifts':np.array(shifts),'converged':np.linalg.norm(p10_g(x))<tol}

def p10_report(s, x0):
    for name in ('gradient','newton'):
        out = p10_trace(s,x0,name)
        print(f'{name:8} steg={out["steps"]:2d} f-prøver={out["f_calls"]:3d} '
              f'q={out["value"]:.3e} ||g_x||={out["gradnorm"]:.3e} '
              f'fullførte={out["converged"]}')
        print('         x =',np.round(out['x'],6),
              'hele steg =',int(np.sum(out['alphas']==1.)),
              'regulariserte =',int(np.sum(out['shifts']>0)))

def p10_plot(runs):
    fig,axs=plt.subplots(2,1,figsize=(7,8))
    for name,out in runs.items():
        xs=out['path']
        axs[0].semilogy(np.arange(len(xs)),
                       np.maximum([p10_q(x) for x in xs],1e-16),label=name)
        axs[1].semilogy(np.arange(len(xs)),
                       np.maximum([np.linalg.norm(p10_g(x)) for x in xs],1e-16),label=name)
    axs[0].set(ylabel='Målfunksjon q(x)')
    axs[1].set(xlabel='Godkjente steg',ylabel='Gradientnorm i x')
    for ax in axs: ax.legend()
    fig.tight_layout();plt.show()
```
