"""Rebuild week 8's lecture figures from the commented Python in section 8.6.

The static figures let students read sections 8.1–8.4 without running code.
Run from any directory with NumPy, SciPy and Matplotlib installed.
"""
from pathlib import Path
import re

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
CELL = re.compile(r"```\{pyodide-python\}\n(.*?)```", re.S)
INCLUDE = re.compile(r"\{\{<\s*include\s+([^\s>]+)\s*>\}\}")


def expanded(path, include_root=None):
    # Quarto resolves nested includes from the original page's directory.
    include_root = path.parent if include_root is None else include_root
    return INCLUDE.sub(
        lambda match: expanded((include_root / match[1]).resolve(), include_root),
        path.read_text(),
    )

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
