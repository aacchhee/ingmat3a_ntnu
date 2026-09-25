"""Execute the optimisation lecture cells in fresh page environments.

Run with NumPy, SciPy and Matplotlib installed. This checks native Python;
browser/Pyodide and rendered-page checks are separate.
"""
from pathlib import Path
import argparse
import re

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
INCLUDE = re.compile(r"\{\{<\s*include\s+([^\s>]+)\s*>\}\}")
CELL = re.compile(r"```\{pyodide-python\}\n(.*?)```", re.S)


def expanded(path, include_root=None):
    # Quarto resolves nested include paths relative to the original .qmd file.
    include_root = path.parent if include_root is None else include_root
    text = path.read_text()
    return INCLUDE.sub(
        lambda m: expanded((include_root / m[1]).resolve(), include_root), text
    )


def run_page(page, figures=None, replacements=None):
    """Run in page order; replacements are only for explicitly completed tasks."""
    text = expanded(ROOT / page)
    labels = re.findall(r"^#\| label: (.+)$", text, re.M)
    if len(labels) != len(set(labels)):
        raise AssertionError(f"Duplicate cell labels: {page}")
    if text.count("<details") != text.count("</details>"):
        raise AssertionError(f"Unbalanced details: {page}")
    if "Under construction." in text:
        raise AssertionError(f"Placeholder left in {page}")
    ns = {"__name__": "__main__"}
    cells = CELL.findall(text)
    if not cells:
        raise AssertionError(f"No experiments: {page}")
    for number, code in enumerate(cells, 1):
        label_match = re.search(r"^#\| label: (.+)$", code, re.M)
        label = label_match[1] if label_match else f"cell-{number}"
        for old, new in (replacements or {}).items():
            code = code.replace(old, new)
        original_show = plt.show

        def capture(*args, **kwargs):
            if figures:
                figures.mkdir(parents=True, exist_ok=True)
                for i, figure_number in enumerate(plt.get_fignums(), 1):
                    plt.figure(figure_number).savefig(figures / f"{label}-{i}.png", dpi=120)

        plt.show = capture
        try:
            exec(compile(code, f"{page}:{label}", "exec"), ns)
        finally:
            plt.show = original_show
            plt.close("all")
    print(f"PASS {page}: {len(cells)} Python cells in a fresh environment")
    return ns


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--week", type=int, nargs="+", choices=range(8, 13), default=list(range(8, 13)))
    parser.add_argument("--figures", type=Path)
    parser.add_argument("--projects", action="store_true", help="Also run both project pages and their editor supplements")
    args = parser.parse_args()
    for week in args.week:
        run_page(f"pages/uke{week}.qmd", args.figures)
    if args.projects:
        for week in (10, 11):
            run_page(f"pages/project_week{week}.qmd", args.figures)
            supplement = ROOT / f"assets/project_week{week}.py"
            exec(compile(supplement.read_text(), str(supplement), "exec"), {"__name__": "__main__"})
            plt.close("all")
            print(f"PASS {supplement.relative_to(ROOT)}: standalone editor supplement")
