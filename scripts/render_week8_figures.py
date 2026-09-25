"""Rebuild week 8's lecture figures from the commented Python in section 8.6.

The static figures let students read sections 8.1–8.4 without running code.
Run from any directory with NumPy, SciPy and Matplotlib installed.
"""
from pathlib import Path
import re

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from check_optimization import CELL, ROOT, expanded

OUTPUT = ROOT / "assets" / "optimization"
FIGURE_LABELS = {"week8-production", "week8-local-minima", "week8-convex-midpoints"}


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    # Stable SVG identifiers and metadata avoid unrelated diffs on regeneration.
    matplotlib.rcParams["svg.hashsalt"] = "week8"
    namespace = {"__name__": "__main__"}
    for code in CELL.findall(expanded(ROOT / "pages" / "uke8.qmd")):
        label = re.search(r"^#\| label: (.+)$", code, re.M)[1]
        original_show = plt.show

        def save(*args, **kwargs):
            if label in FIGURE_LABELS:
                assert len(plt.get_fignums()) == 1, label
                target = OUTPUT / f"{label}.svg"
                plt.gcf().savefig(target, bbox_inches="tight", metadata={"Date": None})
                # Matplotlib path data contains unnecessary trailing spaces.
                target.write_text("\n".join(line.rstrip() for line in
                                           target.read_text().splitlines()) + "\n")

        plt.show = save
        try:
            exec(compile(code, label, "exec"), namespace)
        finally:
            plt.show = original_show
            plt.close("all")
    print("Rebuilt three lecture figures from section 8.6")


if __name__ == "__main__":
    main()
