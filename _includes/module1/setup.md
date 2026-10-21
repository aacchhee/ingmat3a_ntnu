<!--
Shared Week 1 prerequisites and plotting helpers.

This duplication is intentional: naive() and stable() remain visible in the
teaching material, while this hidden setup cell makes every section usable
directly after a page reload. Running the visible implementation simply
replaces the identical definition in the shared Python session.

The plot_* helpers only draw figures; the visible cells keep the data and the
computation.
-->

```{pyodide-python}
#| context: setup

import math
import struct
import sys
from fractions import Fraction

import matplotlib.pyplot as plt


def naive(x):
    return math.sqrt(1 + x) - 1


def stable(x):
    return x / (math.sqrt(1 + x) + 1)


def ieee754_double(x):
    """Del de 64 bitene i x i fortegn, eksponentfelt og mantissefelt."""
    raw_integer = struct.unpack(">Q", struct.pack(">d", float(x)))[0]
    bits = f"{raw_integer:064b}"
    sign, exponent_bits, fraction_bits = bits[0], bits[1:12], bits[12:]
    E = int(exponent_bits, 2)
    e = E - 1023 if 0 < E < 2047 else None
    return bits, sign, exponent_bits, fraction_bits, E, e


def show_bits(x):
    """Skriv ut de tre feltene i IEEE 754 double for tallet x."""
    bits, s, eb, mb, E, e = ieee754_double(x)
    print(f"\nx = {x!r}")
    print("S | eksponent   | mantisse")
    print(f"{s} | {eb} | {mb}")
    print("lagret E =", E, "  virkelig e =", e)


def plot_relative_errors(exact, relative):
    """Søylediagram av relativ feil (i prosent) for hver eksakt verdi."""
    plt.bar([str(x) for x in exact], [100 * r for r in relative])
    plt.yscale("log")
    plt.xlabel("Eksakt verdi x")
    plt.ylabel("Relativ feil (%)")
    plt.title("Samme absolutte feil, svært ulik relativ betydning")
    plt.show()


def plot_neighbours(exact_position):
    """Tegn lagret 0.1, de to naboene og posisjonen til eksakt 1/10 (i lokale steg)."""
    positions = [-1, 0, 1]
    labels = ["venstre nabo", "lagret 0.1", "høyre nabo"]
    plt.scatter(positions, [0, 0, 0], s=90)
    for pos, label in zip(positions, labels):
        plt.annotate(label, (pos, 0), xytext=(0, 15),
                     textcoords="offset points", ha="center")
    plt.scatter([exact_position], [0], marker="x", s=120)
    plt.annotate("eksakt 1/10", (exact_position, 0), xytext=(0, -26),
                 textcoords="offset points", ha="center")
    plt.xlim(-1.35, 1.35)
    plt.ylim(-0.18, 0.18)
    plt.yticks([])
    plt.xticks([-1, 0, 1], ["−1", "0", "+1"])
    plt.xlabel("lokale steg mellom representerbare double-verdier")
    plt.title("Eksakt 0.1 ligger mellom to representerbare tall")
    plt.show()


def plot_spacing(values, spacing):
    """Log-log-plott av avstanden til neste flyttall mot størrelsen på tallet."""
    plt.loglog(values, spacing, marker="o")
    plt.xlabel("størrelse på tallet")
    plt.ylabel("avstand til neste double")
    plt.title("Presisjonen er relativ: avstanden vokser med størrelsen")
    plt.show()


def plot_cancellation(xs, rel_errors):
    """Log-log-plott av relativ feil i den direkte formen; små x til høyre."""
    plt.loglog(xs, rel_errors, "o-")
    plt.axhline(1.0, color="gray", linestyle="--", linewidth=1)
    plt.text(xs[0], 1.4, "100 % feil", color="gray")
    plt.gca().invert_xaxis()
    plt.xlabel("x")
    plt.ylabel(r"relativ feil i $\sqrt{1+x}-1$")
    plt.title("Kansellering: jo mindre x, jo færre riktige sifre")
    plt.show()


def plot_number_line(values, title):
    """Tegn tallene i values som prikker på en tallinje."""
    plt.figure(figsize=(8, 1.8))
    plt.scatter(values, [0] * len(values), s=16)
    plt.yticks([])
    plt.xlabel("verdi")
    plt.title(title)
    plt.tight_layout()
    plt.show()
```
