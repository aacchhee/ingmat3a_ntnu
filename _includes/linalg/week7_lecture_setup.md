```{pyodide-python}
#| label: week7-lecture-setup
#| autorun: true
#| context: setup
# Visningshjelpere som bare forelesningen bruker. Selve regningen står i cellene på siden.

import numpy as np
import matplotlib.pyplot as plt

# Visningshjelper: én SVD-komponent, de to profilene og én markert piksel.
def show_component(U, s, Vt, i, row=25, col=50):
    component = s[i]*np.outer(U[:,i], Vt[i,:])
    fig = plt.figure(figsize=(6.4,7.0), layout='constrained')
    grid = fig.add_gridspec(2,2, height_ratios=[1,1.35])
    ax_u = fig.add_subplot(grid[0,0])
    ax_v = fig.add_subplot(grid[0,1])
    ax_result = fig.add_subplot(grid[1,:])
    ax_u.plot(U[:,i]); ax_u.axhline(0,color='gray',linewidth=.6)
    ax_u.set_title('1. Loddrett profil'); ax_u.set_xlabel('Radnummer')
    ax_v.plot(Vt[i,:]); ax_v.axhline(0,color='gray',linewidth=.6)
    ax_v.set_title('2. Vannrett profil'); ax_v.set_xlabel('Kolonnenummer')
    limit = np.max(np.abs(component))
    im = ax_result.imshow(component,cmap='RdBu_r',vmin=-limit,vmax=limit,origin='upper')
    ax_result.set_title('3. Bidraget fra de to profilene')
    ticks = [0,20,40,60,80,95]
    ax_u.set_xticks(ticks); ax_v.set_xticks(ticks)
    ax_result.set_xticks(ticks); ax_result.set_yticks(ticks)
    ax_result.set_xlabel('Kolonnenummer'); ax_result.set_ylabel('Radnummer')
    fig.colorbar(im,ax=ax_result,shrink=.85,label='Pikselbidrag (negativt / positivt)')
    # Følg én rad og én kolonne fra profilene til den tilsvarende pikselen.
    ax_u.plot(row,U[row,i],'ko'); ax_v.plot(col,Vt[i,col],'ko')
    ax_result.plot(col,row,'ko',markersize=5,markerfacecolor='none')
    plt.show()

# Visningshjelper: singulærverdiene på logaritmisk akse; de k første markeres som beholdt.
def show_singular_values(spectra, k=None):
    fig, ax = plt.subplots(figsize=(6.4,3.2))
    for name, s in spectra.items():
        ax.semilogy(np.arange(1,len(s)+1), np.maximum(s,1e-16), '.-', label=name)
    if k is not None:
        ax.axvspan(.5, k+.5, color='gray', alpha=.15, label=f'beholdt: k={k}')
    ax.set(xlabel='Nummer i', ylabel='Singulærverdi (logaritmisk)')
    ax.legend(); ax.grid(alpha=.25); fig.tight_layout(); plt.show()
```
