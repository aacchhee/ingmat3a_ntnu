"""Prosjekt 10: startpunkt og skala i Newtons metode.

Valgfri selvstendig starter for en editor. Den samme undersøkelsen er fullt
utførbar på prosjektsiden med pyodide-interaktiv. Krever NumPy, SciPy og
Matplotlib. Denne filen gir forsøksfunksjoner, ikke prosjektets tolkninger.

Oppgaver (skriv egne beregninger og begrunnelser):
1. Deriver q, gradient og Hessian; undersøk modellen ved (0,0).
2. Forutsi og sammenlign startene (-1.2,1), (0,0) og (2,2).
3. Utled gradient og Hessian for z=(s*u,v). Sammenlign s=1 og s=10;
   vis når det uregulariserte Newton-steget transformeres likt.
4. Sammenlign sikret Newton/gradient med SciPy BFGS/Newton-CG, og
   kontroller resultat mot q, gradientnorm og et felles stoppkrav.
"""

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

if __name__ == '__main__':
    # DEL 1: TODO i egne notater: deriver q, g og H, og forutsi modellen.
    x0 = np.array([0.,0.])
    g0, H0 = p10_g(x0), p10_h(x0)
    p0 = np.linalg.solve(H0,-g0)
    print('Retning:',p0,'modell:',p10_q(x0)+g0@p0+.5*p0@H0@p0,
          'faktisk:',p10_q(x0+p0))

    # DEL 2: TODO: forutsi startpunkt og linjesøksarbeid før kjøring.
    for start in ([-1.2,1.], [0.,0.], [2.,2.]):
        print('\nStart:',start,'s=1')
        p10_report(1.,start)
    runs={name:p10_trace(1.,[0.,0.],name)
          for name in ('gradient','newton')}
    p10_plot(runs)  # Kjør igjen med et annet startpunkt fra del 2.

    # DEL 3: TODO: utled kjerneregel og bevis invarians av rene Newton-steg.
    scale=10.;d=np.array([scale,1.]);x=np.array([.2,.2]);z=d*x
    f,g,h=p10_scaled(scale)
    print('Samme objektiv:',p10_q(x),f(z))
    print('g i x/z:',p10_g(x),g(z),'H i x/z:',p10_h(x),h(z))
    x=np.array([0.,0.]);z=d*x
    px=np.linalg.solve(p10_h(x),-p10_g(x))
    pz=np.linalg.solve(h(z),-g(z))
    print('Newton-retning etter omregning:',d*px,'direkte:',pz)
    for scale in (1.,10.):
        print('\nSkala:',scale,'fra samme x=(0,0)')
        p10_report(scale,[0.,0.])

    # DEL 4: TODO: sammenlign status med eget stoppkrav, begrunn forskjell.
    for scale in (1.,10.):
        d=np.array([scale,1.]);f,g,h=p10_scaled(scale)
        print('\nSciPy, skala',scale)
        for method in ('BFGS','Newton-CG'):
            kw={'hess':h} if method=='Newton-CG' else {}
            result=minimize(f,d*np.array([0.,0.]),jac=g,method=method,
                            options={'maxiter':100},**kw)
            x=result.x/d
            print(method,'status:',result.success,'steg:',result.nit,
                  'f/g/H:',result.nfev,result.njev,getattr(result,'nhev',0),
                  'q:',p10_q(x),'||grad_x||:',np.linalg.norm(p10_g(x)),
                  'vårt stoppkrav:',np.linalg.norm(p10_g(x))<1e-6)
