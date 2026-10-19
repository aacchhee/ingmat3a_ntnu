<!--
Shared Week 2 prerequisites (lecture page only; project 2 does not use this file).

Algorithm code (the update rules, iterate, fixed_point, the square-root rules)
is also shown in visible cells on purpose: students should read it. This hidden
setup cell makes every section usable directly after a page reload; running a
visible implementation simply replaces the identical definition.

Plotting helpers live only here, so the visible cells show the mathematics
(data, computation, printed numbers) plus one helper call.

The learning-mode switch (Forelesning / Gå i dybden) sits here, before the
page's tabset, so it is visible in every tab, as in weeks 5-7.
-->

<div class="learning-mode" data-learning-mode role="group" aria-label="Velg lesemodus">
<button type="button" data-mode="lecture" aria-pressed="true">Forelesning</button>
<button type="button" data-mode="reading" aria-pressed="false">Gå i dybden</button>
<span role="status" aria-live="polite"></span>
</div>

```{pyodide-python}
#| context: setup

import math

import numpy as np
import matplotlib.pyplot as plt


def f(x):
    return x**3 + x - 1


def g1(x):
    return 1 - x**3


def g2(x):
    # Reell kubikkrot, også for negative argumenter
    return np.cbrt(1 - x)


def g3(x):
    return (2*x**3 + 1)/(3*x**2 + 1)


def iterate(g, x0, number_of_steps):
    """Returner x_0, x_1, ..., x_n."""
    values = [float(x0)]
    for _ in range(number_of_steps):
        values.append(g(values[-1]))
    return np.array(values)


solution = 0.6823278038280193
r_reference = solution


def final_value(g, x0, number_of_steps=100):
    """Verdien etter number_of_steps iterasjoner."""
    x = float(x0)
    for _ in range(number_of_steps):
        x = g(x)
    return x


# ---------- Tegnehjelpere ----------

def plot_function(f, x_min, x_max, title):
    """Tegn y = f(x) på [x_min, x_max] sammen med x-aksen."""
    x_grid = np.linspace(x_min, x_max, 400)
    plt.close("all")
    fig, ax = plt.subplots()
    ax.plot(x_grid, f(x_grid), label="$y=f(x)$")
    ax.axhline(0, color="black", linewidth=1)
    ax.set(xlabel="$x$", ylabel="$f(x)$", title=title)
    ax.grid(True)
    ax.legend()
    plt.show()


def plot_sequences(rules, labels, x0, steps, reference=solution):
    """Tegn x_n mot n for flere regler med samme startverdi."""
    plt.close("all")
    fig, ax = plt.subplots()
    for g, label in zip(rules, labels):
        ax.plot(iterate(g, x0, steps), marker=".", label=label)
    ax.axhline(reference, color="black", linestyle="--", label="løsningen")
    ax.set(xlabel="Iterasjon $n$", ylabel="Tilnærming $x_n$",
           title="Én likning, tre algoritmer")
    ax.grid(True)
    ax.legend()
    plt.show()


def draw_cobweb(ax, g, x0, number_of_steps, x_min, x_max, title, mark=None):
    """Tegn kurven y=g(x), diagonalen y=x og den røde trappen i ett panel."""
    x_grid = np.linspace(x_min, x_max, 800)
    ax.plot(x_grid, [g(x) for x in x_grid], label="$y=g(x)$")
    ax.plot(x_grid, x_grid, "k--", label="$y=x$")
    values = iterate(g, x0, number_of_steps)
    current = values[0]
    for next_value in values[1:]:
        ax.plot([current, current], [current, next_value], color="tab:red")
        ax.plot([current, next_value], [next_value, next_value], color="tab:red")
        current = next_value
    if mark is not None:
        ax.plot(mark, mark, "ko", markersize=5, label=f"fikspunkt $r={mark}$")
    ax.set(xlim=(x_min, x_max), ylim=(x_min, x_max),
           xlabel="$x$", ylabel="$y$", title=title)
    ax.set_aspect("equal", adjustable="box")
    ax.grid(True)
    return values


def cobweb_plot(g, x0, number_of_steps=20,
                x_min=0, x_max=1, title="Spindelvevplott"):
    """Ett spindelvevplott. Returnerer x_0, ..., x_n."""
    plt.close("all")
    fig, ax = plt.subplots(figsize=(7, 7))
    values = draw_cobweb(ax, g, x0, number_of_steps, x_min, x_max, title)
    ax.legend()
    plt.show()
    return values


def cobweb_row(rules, x0, steps, titles, x_min=0, x_max=1, mark=None):
    """Spindelvev side om side. x0, steps, x_min og x_max kan være tall eller lister."""
    n = len(rules)
    as_list = lambda value: list(value) if np.ndim(value) else [value]*n
    x0, steps, x_min, x_max = map(as_list, (x0, steps, x_min, x_max))
    plt.close("all")
    fig, axes = plt.subplots(1, n, figsize=(4.6*n, 4.8))
    for k, ax in enumerate(np.atleast_1d(axes)):
        draw_cobweb(ax, rules[k], x0[k], steps[k], x_min[k], x_max[k],
                    titles[k], mark)
    np.atleast_1d(axes)[0].legend(loc="upper left", fontsize=8)
    fig.tight_layout()
    plt.show()


def plot_final_values(starting_values, final_values, steps=100,
                      reference=solution):
    """Tegn punktene (x_0, x_steps) og fikspunktet som stiplet linje."""
    plt.close("all")
    fig, ax = plt.subplots()
    ax.plot(starting_values, final_values, ".", markersize=3)
    ax.axhline(reference, color="black", linestyle="--", label="fikspunktet")
    ax.set(xlabel="Startverdi $x_0$",
           ylabel=f"Verdi etter {steps} iterasjoner",
           title="Eksperiment med startverdier")
    ax.grid(True)
    ax.legend()
    plt.show()


def plot_errors(rules, labels, x0, steps, reference=solution):
    """Tegn |x_n - r| med logaritmisk y-akse for flere regler."""
    plt.close("all")
    fig, ax = plt.subplots()
    for g, label in zip(rules, labels):
        errors = np.abs(iterate(g, x0, steps) - reference)
        positive = errors > 0          # log(0) kan ikke tegnes
        ax.semilogy(np.arange(len(errors))[positive], errors[positive],
                    marker=".", label=label)
    ax.set(xlabel="Iterasjon $n$", ylabel="Absolutt feil $|x_n-r|$",
           title="Sammenligning av konvergensfart")
    ax.grid(True)
    ax.legend()
    plt.show()


def plot_step_and_residual(result):
    """Tegn skrittlengde og residual fra fixed_point med logaritmisk y-akse."""
    plt.close("all")
    fig, ax = plt.subplots()
    ax.semilogy(result["steps"], marker=".", label="skrittlengde")
    ax.semilogy(result["residuals"][1:], marker=".", label="residual")
    ax.set(xlabel="Iterasjon", ylabel="Størrelse",
           title="Hva er det som blir lite?")
    ax.grid(True)
    ax.legend()
    plt.show()


def plot_error_curves(curves, labels, title, ylabel="Absolutt feil $|e_n|$",
                      ylim=None):
    """Tegn flere feilkurver mot n med logaritmisk y-akse (blå, oransje, grønn ...)."""
    plt.close("all")
    fig, ax = plt.subplots(figsize=(8, 6))
    for errors, label in zip(curves, labels):
        steps = np.arange(len(errors))
        ax.semilogy(steps, errors, "o-", label=label)
    ax.set_xticks(np.arange(max(len(e) for e in curves)))
    if ylim is not None:
        ax.set_ylim(*ylim)
    ax.set(xlabel="Iterasjon $n$", ylabel=ylabel, title=title)
    ax.grid(True, which="both", alpha=0.35)
    ax.legend()
    plt.show()


def plot_runs(runs, requirement):
    """Ett panel per kjøring av fixed_point: skrittlengde, residual og kravlinjen."""
    plt.close("all")
    fig, axes = plt.subplots(1, len(runs), figsize=(12, 4.2), sharey=True)
    for ax, (name, run) in zip(axes, runs.items()):
        iterations = np.arange(1, run["iterations"] + 1)
        ax.semilogy(iterations, run["steps"], "o-", label="skrittlengde")
        ax.semilogy(iterations, run["residuals"][1:], "s-", label="residual")
        ax.axhline(requirement, color="black", linestyle="--",
                   linewidth=1, label="krav til residual")
        ax.set_title(f"Kjøring {name}\nStopp: {run['reason']}")
        ax.set_xlabel("Iterasjon")
        ax.set_xticks(iterations)
        ax.grid(True, which="both", alpha=0.3)
    axes[0].set_ylabel("Størrelse (logaritmisk skala)")
    axes[0].set_ylim(1e-16, 3)
    axes[-1].legend(loc="lower left", fontsize=8)
    fig.suptitle("Tre kjøringer av samme likning")
    fig.tight_layout()
    plt.show()


# ---------- Algoritmer fra 2.5 ----------

def fixed_point(g, x0, f=None, atol=1e-10, rtol=1e-10, maxiter=100):
    """Fikspunktiterasjon x_(n+1)=g(x_n), med diagnostikk."""
    x = float(x0)
    history = [x]
    steps = []
    residual = lambda value: abs(f(value)) if f is not None else abs(g(value)-value)
    residuals = [residual(x)]

    def result(value, converged, reason, iterations):
        return {"x": value, "converged": converged, "reason": reason,
                "iterations": iterations, "history": np.array(history),
                "steps": np.array(steps), "residuals": np.array(residuals)}

    for iteration in range(1, maxiter + 1):
        x_new = g(x)

        if not math.isfinite(x_new):
            return result(x_new, False, "ikke-endelig verdi", iteration)

        step = abs(x_new - x)
        history.append(x_new)
        steps.append(step)
        residuals.append(residual(x_new))

        tolerance = atol + rtol*abs(x_new)
        if step <= tolerance:
            return result(x_new, True, "lite skritt", iteration)
        x = x_new

    return result(x, False, "maksimalt antall iterasjoner", maxiter)


def make_sqrt_iteration(a):
    def g(x):
        return 0.5*(x + a/x)
    return g


def make_sqrt_equation(a):
    def f(x):
        return x*x - a
    return f
```
