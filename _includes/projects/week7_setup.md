```{pyodide-python}
#| label: project-week7-setup
#| autorun: true
#| context: setup
# Ferdige forsøksverktøy. Rangregelen bruker bare data og oppgitt støynorm.
# Feil mot fasiten beregnes etterpå og påvirker ikke rangvalget.

def _choose_svd_rank(residuals, delta, tau):
    if delta <= 0 or tau < 1:
        raise ValueError('Bruk positivt støynivå og tau >= 1.')
    admissible = np.flatnonzero(residuals <= tau*delta)
    return int(admissible[0]) if admissible.size else None


def image_svd_trial(noise_level=.12, seed=23, tau=1.05, image_name='portrett'):
    if noise_level <= 0:
        raise ValueError('Bruk positivt støynivå.')
    C = challenge_images()[image_name]
    E = noise_level*np.random.default_rng(seed).standard_normal(C.shape)
    Y = C+E
    U,s,Vt = np.linalg.svd(Y,full_matrices=False)
    delta = np.linalg.norm(E,'fro')
    # Ingen klipping av data eller rekonstruksjon før feilberegningen.
    residuals = np.sqrt(np.r_[np.cumsum(s[::-1]**2)[::-1],0.])
    k = _choose_svd_rank(residuals,delta,tau)
    # Ortonormale koordinater gir de to leddene i prosjektets feilidentitet.
    signal_coordinates, noise_coordinates = U.T@C, U.T@E
    signal_energy = np.sum(signal_coordinates**2,axis=1)
    noise_energy = np.sum(noise_coordinates**2,axis=1)
    lost = np.r_[np.cumsum(signal_energy[::-1])[::-1],0.]
    kept = np.r_[0.,np.cumsum(noise_energy)]
    errors = np.sqrt(lost+kept)
    Yk = (U[:,:k]*s[:k])@Vt[:k,:]
    actual_error = np.linalg.norm(Yk-C,'fro')
    print(f'Frø {seed}; delta = {delta:.6g}; tau = {tau}; valgt rang = {k}')
    print('Alle normer i tabellen er absolutte Frobeniusnormer.')
    print('                  Rang    Dataavvik    Feil mot rent bilde')
    print(f'Valgt             {k:4d}    {np.linalg.norm(Y-Yk):9.4g}    {actual_error:9.4g}')
    print(f'Ubehandlet Y      {len(s):4d}    {0.:9.4g}    {delta:9.4g}')
    print('Feil² direkte:',actual_error**2,
          '= tapt signal² + beholdt støy²:',lost[k],'+',kept[k])
    best = int(np.argmin(errors))
    print(f'Beste rang mot fasit (bare etterpå): {best}; feil = {errors[best]:.6g}')
    ranks = np.arange(len(s)+1)
    fig,ax = plt.subplots(figsize=(7,4))
    ax.plot(ranks,residuals,label='Avvik mot Y')
    ax.plot(ranks,errors,label='Feil mot C')
    ax.plot(ranks,np.sqrt(lost),'--',label='Tapt signal')
    ax.plot(ranks,np.sqrt(kept),'--',label='Beholdt støy')
    ax.axhline(tau*delta,color='gray',linestyle=':',label='Tillatt dataavvik')
    ax.axvline(k,color='black',linestyle=':')
    ax.set(xlabel='Antall komponenter k',ylabel='Absolutt Frobeniusnorm')
    ax.legend(); fig.tight_layout(); plt.show()
    # To bilder i bredden, samme gråtoneskala; figurene endrer ikke dataene.
    fig,axes = plt.subplots(1,2,figsize=(7,3.5))
    for ax,M,title in zip(axes,[Y,Yk],['Data med støy',f'Regelens valg: k={k}']):
        ax.imshow(M,cmap='gray',vmin=0,vmax=1); ax.set_title(title); ax.axis('off')
    fig.tight_layout(); plt.show()
    return dict(k=k,delta=delta,residuals=residuals,errors=errors,
                lost_squared=lost,noise_squared=kept,singular_values=s)


def signal_svd_trial(noise_level=.005, seed=17, tau=1.05):
    if noise_level <= 0:
        raise ValueError('Bruk positivt støynivå.')
    t,H,truth,clean,b = blur_problem(noise_level=noise_level,seed=seed)
    eta = b-clean
    U,s,Vt = np.linalg.svd(H,full_matrices=False)
    delta = np.linalg.norm(eta)
    beta,alpha,e = U.T@b,Vt@truth,U.T@eta
    cutoff = max(H.shape)*np.finfo(float).eps*s[0]
    cap = int(np.sum(s>cutoff))
    ranks = np.arange(cap+1)
    # Resterende datakoordinater teller med også når rangsøket stopper ved cap.
    residual_formula = np.sqrt(np.r_[np.cumsum(beta[::-1]**2)[::-1],0.])[:cap+1]
    k = _choose_svd_rank(residual_formula,delta,tau)
    print(f'Frø {seed}; delta = {delta:.6g}; tau = {tau}; største tillatte rang = {cap}')
    if k is None:
        print('Ingen numerisk tillatt rang oppfyller residualkravet.')
        return dict(k=None,delta=delta,cap=cap)
    # Hver kolonne i solutions er en rekonstruksjon; første kolonne er x_0=0.
    increments = Vt[:cap,:].T*(beta[:cap]/s[:cap])
    solutions = np.column_stack([np.zeros(H.shape[1]),np.cumsum(increments,axis=1)])
    residuals = np.linalg.norm(b[:,None]-H@solutions,axis=0)
    errors = np.linalg.norm(solutions-truth[:,None],axis=0)
    amplified = np.r_[0.,np.cumsum((e[:cap]/s[:cap])**2)]
    lost = np.r_[np.cumsum(alpha[::-1]**2)[::-1],0.][:cap+1]
    print('Alle normer i tabellen er absolutte euklidske normer.')
    print('                  Rang    Residual    Rekonstruksjonsfeil')
    for label,j in [('Regelens valg',k),('Fast referanse',5)]:
        if j <= cap:
            print(f'{label:17s} {j:4d}    {residuals[j]:9.4g}    {errors[j]:9.4g}')
    print('Feil² direkte:',errors[k]**2,
          '= forsterket støy² + tapt signal²:',amplified[k],'+',lost[k])
    print('Residual² direkte / koordinatformel:',residuals[k]**2,residual_formula[k]**2)
    best = int(np.argmin(errors))
    print(f'Beste tillatte rang mot fasit (bare etterpå): {best}; feil = {errors[best]:.6g}')
    fig,axes = plt.subplots(2,1,figsize=(7,7))
    axes[0].semilogy(ranks,np.maximum(residuals,1e-16),label='Residual mot b')
    axes[0].semilogy(ranks,np.maximum(errors,1e-16),label='Feil mot kjent signal')
    axes[0].axhline(tau*delta,color='gray',linestyle=':',label='Tillatt residual')
    axes[0].axvline(k,color='black',linestyle=':')
    axes[0].set(xlabel='Antall beholdte retninger k',ylabel='Absolutt norm (logaritmisk)')
    axes[1].plot(t,truth,label='Kjent signal')
    axes[1].plot(t,solutions[:,k],label=f'Regelens valg: k={k}')
    if cap >= 5:
        axes[1].plot(t,solutions[:,5],'--',label='Fast referanse: k=5')
    axes[1].set(xlabel='Posisjon',ylabel='Signalverdi')
    for ax in axes: ax.legend(); ax.grid(alpha=.25)
    fig.tight_layout(); plt.show()
    return dict(k=k,delta=delta,cap=cap,residuals=residuals,errors=errors,
                residual_formula=residual_formula,lost_squared=lost,
                noise_squared=amplified,singular_values=s)
```
