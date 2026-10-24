#!/usr/bin/env python3
"""Check factual AI learning context in a rendered course; never call an AI API.

Run after Quarto's installed CTM filters: python scripts/check_feedback_contexts.py
--site _site. This stdlib check reads the emitted context attributes and selected
DOM blocks. The browser acceptance check separately exercises CTM's serializer.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass, field
from decimal import Decimal, localcontext
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import struct


@dataclass
class Element:
    tag: str
    attrs: dict[str, str]
    children: list["Element | str"] = field(default_factory=list)

    @property
    def classes(self) -> set[str]:
        return set(self.attrs.get("class", "").split())


class Document(HTMLParser):
    VOID = set("area base br col embed hr img input link meta param source track wbr".split())

    def __init__(self, source: str):
        super().__init__(convert_charrefs=True)
        self.root = Element("document", {})
        self.stack = [self.root]
        self.elements: list[Element] = []
        self.ids: dict[str, list[Element]] = {}
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        el = Element(tag, {k: v or "" for k, v in attrs})
        self.stack[-1].children.append(el)
        self.elements.append(el)
        if el.attrs.get("id"):
            self.ids.setdefault(el.attrs["id"], []).append(el)
        if tag not in self.VOID:
            self.stack.append(el)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack[-1].tag == tag:
            self.stack.pop()

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


CONTEXT_CLASSES = {"ai-feedback-context", "ai-context", "math-exercise-context"}
SKIP_CLASSES = {
    "hidden", "ai-feedback", "feedback-criteria", "feedback-starter",
    "example-author-notes", "ai-feedback-ignore", "ai-feedback-activity",
    "ai-feedback-output", "ai-feedback-settings", "math-exercise-cell",
    "math-exercise-controls", "math-feedback-area", "py-exercise-cell",
    "qpyodide-interactive-area", "qpyodide-non-interactive-area",
    "math-legend-panel", "math-dynamic-matrix-controls",
}
BLOCK_TAGS = set("address article aside blockquote div figcaption figure footer h1 h2 h3 h4 h5 h6 header li main nav p pre section table tr".split())


def context_text(node: Element | str) -> str:
    """Inspect source math and visible authored DOM, excluding exercise internals.

    This is a static inspection, not a replacement implementation of CTM's live
    browser serializer. CTM's preserved TeX attributes avoid rendered glyphs.
    """
    if isinstance(node, str):
        return node
    a = node.attrs
    if (node.tag in {"script", "style", "noscript", "template", "button", "select", "input", "textarea"}
            or node.classes & SKIP_CLASSES
            or any("cell-output" in c for c in node.classes)
            or "hidden" in a or a.get("aria-hidden") == "true"
            or re.search(r"(?:display\s*:\s*none|visibility\s*:\s*hidden)", a.get("style", ""))):
        return ""
    tex = a.get("data-ai-feedback-tex", a.get("data-math-exercise-tex"))
    if tex is not None:
        return " \\(" + tex + "\\) "
    text = "".join(context_text(child) for child in node.children)
    if node.tag in {"td", "th"}:
        text = " | " + text
    if node.tag in BLOCK_TAGS or node.tag == "br":
        text = "\n" + text + "\n"
    return text


def compact(value: str) -> str:
    # Auto-context uses JSON escaped TeX; explicit DOM blocks preserve TeX.
    # Compare mathematical/prose facts independent of whitespace and escaping.
    value = value.translate(str.maketrans({"…": "...", "‘": "'", "’": "'", "“": '"', "”": '"'}))
    return re.sub(r"[\s\\]", "", value).casefold()


SYSTEM = (r"A=\begin{bmatrix}2&1\\1&2\end{bmatrix}", r"b=\begin{bmatrix}3\\0\end{bmatrix}")
EIGENBASIS = (r"w_1=(1,2)^T", r"w_2=(2,-1)^T", r"x_0=(3,1)^T")
SVD = (r"A_k=\sum_{i=1}^k\sigma_i u_i v_i^T", r"\|A-A_k\|_F^2=\sigma_{k+1}^2+\cdots+\sigma_p^2")
HIMMELBLAU = (r"f(x,y)=(x^2+y-11)^2+(x+y^2-7)^2",)
WELL = (r"f(u,v)=(u^2-1)^2+\tfrac12v^2", r"z=(1/2,\,0)")
RUNS = (r"x_0=1", "atol=1e-10", "rtol=1e-10", "maxiter=10", r"10^{-8}",
        r"\text{A:}", r"\text{B:}", r"\text{C:}", r"10^{-12}(x_n^2-2)",
        r"|x_n-x_{n-1}|\leq\text{atol}+\text{rtol}|x_n|")

# Required facts, not merely the presence of the newly introduced wrappers.
REQUIRED: dict[str, tuple[str, ...]] = {
    "week4-task-proposed-fit": (r"b=\begin{bmatrix}0.2\\0.9\\2.1\\2.8\end{bmatrix}",
                                 r"R=\begin{bmatrix}2&1\\0&\sqrt5\end{bmatrix}", "-3/(2\\sqrt5)"),
    **{"week5-task-powers" + suffix: EIGENBASIS for suffix in ("-general", "", "-direction", "-exception", "-sign")},
    **{"week6-task-" + suffix: SYSTEM for suffix in ("sweeps", "error-factor", "condition-eigenvalues", "quadratic-function", "minimum", "first-line-search", "first-step", "conjugate-direction", "second-cg-step")},
    **{"week7-task-" + suffix: SVD for suffix in ("diagonal", "tail", "noise", "left-projection")},
    "week9-task-first-gradient-step": HIMMELBLAU,
    "week9-task-compass-first": HIMMELBLAU + ("de fire naboene", "den beste", "halverer"),
    "week9-task-compass-shrink": ("den beste", "halverer", r"\Delta"),
    "week9-task-compass-bound": (r"\sqrt n", r"\frac{K\Delta}{2}", r"|\partial^2f/\partial x_i^2|"),
    "week10-task-regularize": WELL,
    "week10-task-armijo-well": WELL + (r"H+\mu I", r"\mu=0,\,0.5,\,1,\,2", "null, godtas ikke"),
    "week10-task-cholesky-solves": (r"H=\begin{bmatrix}9&3\\3&5\end{bmatrix}", r"L=\begin{bmatrix}a&0\\b&c\end{bmatrix}", "a,c>0"),
    "week12-can": (r"L=f+\lambda h", r"\frac{df_*}{ds}=-\lambda", r"\pi x^2y-V=0"),
    "read-semilogy-correct-decimals": (r"x_{n+1}=0.8x_n", r"x_{n+1}=0.1x_n", r"x_{n+1}=x_n^2", r"x_0=0.3", r"|e_n|<\frac12 10^{-p}"),
    "compare-binary32-binary64": ("1.4142135381698608", "1.4142135623730949", "2.420323420896e-8", "1.253716717905e-16", r"x_0=1", "80 desimalsifres"),
    "diagnose-three-iterations": RUNS + ("A = 1", "B = 2", "C = 3"),
    "identify-stop-reasons": RUNS + ("lite skritt", "maksimalt antall iterasjoner", "ikke-endelig verdi"),
    "choose-diagnostic-action": RUNS + ("godkjenn resultatet", "bytt oppdateringsregel", "liten residual"),
}


def descendants(node: Element, tag: str):
    for child in node.children:
        if isinstance(child, Element):
            if child.tag == tag:
                yield child
            yield from descendants(child, tag)


def check_plotted_trace(doc: Document):
    """Independently verify all plotted float32/64 data without NumPy or answers."""
    context = doc.ids["binary-format-plateau-context"][0]
    tables = list(descendants(context, "table"))
    assert len(tables) == 1, "binary32/64: expected one accessible trace table"
    rows = list(descendants(tables[0], "tr"))[1:]
    assert len(rows) == 9, "binary32/64: trace must contain iterations 0 through 8"
    f32 = lambda value: struct.unpack("f", struct.pack("f", value))[0]
    x32, x64 = f32(1.0), 1.0
    with localcontext() as decimal_context:
        decimal_context.prec = 80
        reference = Decimal(2).sqrt()
        for n, row in enumerate(rows):
            cells = [context_text(c).strip() for c in row.children if isinstance(c, Element) and c.tag == "td"]
            cells = [c.removeprefix("|").strip() for c in cells]
            assert len(cells) == 5 and int(cells[0]) == n, f"binary32/64: malformed row {n}"
            assert float(cells[1]) == x32 and float(cells[2]) == x64, f"binary32/64: wrong stored iterate at n={n}"
            for written, stored in zip(cells[3:], (x32, x64)):
                actual = float(abs(Decimal(stored) - reference))
                assert abs(float(written) / actual - 1) < 2e-12, f"binary32/64: wrong plotted error at n={n}"
            # Round every binary32 operation, as NumPy's authored scalar code does.
            x32 = f32(f32(x32 + f32(f32(2.0) / x32)) / f32(2.0))
            x64 = (x64 + 2.0 / x64) / 2.0


def selected_context(doc: Document, mode: str, refs: str, section: str, place: str):
    sections, used, selected = [], 0, []
    if mode == "explicit":
        seen = set()
        for ref in refs.split(","):
            ref = ref.strip()
            if not ref or ref.startswith("jsxgraph:") or ref in seen:
                continue
            seen.add(ref)
            matches = doc.ids.get(ref, [])
            assert len(matches) == 1, f"{place}: context {ref!r} missing or duplicated"
            block = matches[0]
            assert block.classes & CONTEXT_CLASSES, f"{place}: context {ref!r} lacks a supported class"
            text = re.sub(r"[ \t]+", " ", context_text(block)).strip()
            assert text, f"{place}: context {ref!r} is empty"
            # UTF-16 matches the browser budget. Extra static whitespace makes
            # this gate conservative compared with the live serializer.
            used += len(text.encode("utf-16-le")) // 2
            assert used <= 6000, f"{place}: explicit context exceeds CTM's 6000-character budget"
            sections.append(text)
            selected.append(ref)
    if mode != "none" and section:
        sections.append(section)
    return "\n".join(sections), used, selected


def ide_cells(doc: Document):
    """Read emitted public cell data, without executing page JavaScript."""
    for script in doc.elements:
        if script.tag != "script":
            continue
        source = "".join(c for c in script.children if isinstance(c, str))
        prefix = "globalThis.qpyodideCellDetails = "
        if prefix in source:
            cells, _ = json.JSONDecoder().raw_decode(source.split(prefix, 1)[1])
            yield from cells


def check(site: Path) -> dict:
    manifest_path = Path(__file__).with_name("feedback-context-contracts.json")
    assert manifest_path.is_file(), "the authored IDE dependency contract manifest is missing"
    ide_contracts = json.loads(manifest_path.read_text())["cells"]
    assert ide_contracts, "the authored IDE dependency contract manifest is empty"
    found: dict[str, str] = {}
    ide_found: set[str] = set()
    ide_count = 0
    math_count = 0
    explicit_count = 0
    max_explicit_chars = 0
    trace_checked = False
    for path in sorted(site.rglob("*.html")):
        doc = Document(path.read_text())
        if "binary-format-plateau-context" in doc.ids:
            check_plotted_trace(doc)
            trace_checked = True
        for cell in ide_cells(doc):
            options = cell["options"]
            if options.get("context") in {"setup", "output"}:
                continue
            ide_count += 1
            label = options.get("label", "")
            if label not in ide_contracts:
                continue
            contract = ide_contracts[label]
            assert label not in ide_found, f"duplicate IDE label {label}"
            assert path.name == contract["page"], f"{path}:{label}: IDE contract attached to wrong page"
            fc = options.get("feedbackContext", {})
            assembled, used, selected = selected_context(doc, fc.get("mode", "auto"),
                fc.get("refs", ""), fc.get("text", ""), f"{path}:{label}")
            assert selected == contract["references"], f"{path}:{label}: selected IDE dependencies changed"
            for fact in contract["facts"]:
                assert compact(fact) in compact(assembled), f"{path}:{label}: IDE context lost required fact {fact!r}"
            assert "def check(" not in assembled and "assert np." not in assembled, f"{path}:{label}: grading implementation entered IDE context"
            max_explicit_chars = max(max_explicit_chars, used)
            ide_found.add(label)
        for cell in doc.elements:
            if "math-exercise-cell" not in cell.classes:
                continue
            math_count += 1
            label = cell.attrs.get("data-label", "")
            mode = cell.attrs.get("data-context-mode", "auto")
            if mode == "explicit":
                explicit_count += 1
            assembled, used, _ = selected_context(doc, mode, cell.attrs.get("data-context-refs", ""),
                json.loads(cell.attrs.get("data-context", '""')), f"{path}:{label}")
            max_explicit_chars = max(max_explicit_chars, used)
            # Public instructions can mention the "## TESTS ##" insertion
            # marker; reject executable grading bodies rather than that prose.
            assert "def check(" not in assembled and "assert np." not in assembled, f"{path}:{label}: grader code leaked into learning context"
            if label in REQUIRED:
                assert label not in found, f"duplicate exercise label {label}"
                for fact in REQUIRED[label]:
                    assert compact(fact) in compact(assembled), f"{path}:{label}: learning context lost required fact {fact!r}"
                found[label] = str(path.relative_to(site))
    missing = REQUIRED.keys() - found.keys()
    assert not missing, "rendered exercises missing: " + ", ".join(sorted(missing))
    assert ide_found == ide_contracts.keys(), "rendered IDE contracts missing: " + ", ".join(sorted(ide_contracts.keys() - ide_found))
    assert trace_checked, "rendered binary32/64 figure data missing"
    return {"math_exercises": math_count, "factual_context_checks": len(found), "explicit_exercises": explicit_count,
            "largest_explicit_context_chars": max_explicit_chars, "plotted_trace_rows_verified": 9,
            "interactive_ide_cells": ide_count, "ide_dependency_context_checks": len(ide_found)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, default=Path("_site"))
    args = parser.parse_args()
    try:
        result = check(args.site)
    except (AssertionError, KeyError, ValueError) as error:
        parser.exit(1, f"AI context check failed: {error}\n")
    print("AI context check passed: " + json.dumps(result, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
