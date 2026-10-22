"""Audit the course quiz contract; --site requires a real rendered store manifest."""
import argparse
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / "tests/exercise-quizzes.json"
GRADED = {"math-exercise", "py-exercise"}


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.stack = []
        self.manifests = []
        self.slots = []
        self.targets = []
        self.current = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {"area", "base", "br", "col", "embed", "hr", "img", "input",
                   "link", "meta", "param", "source", "track", "wbr"}:
            return
        classes = attrs.get("class", "").split()
        pane = attrs.get("id") if "tab-pane" in classes else None
        self.stack.append((tag, pane))
        owner = next((p for _, p in reversed(self.stack) if p), None)
        if "ctm-progress-slot" in classes:
            self.slots.append((attrs.get("data-ctm-quiz"), owner,
                               any(tag == "details" for tag, _ in self.stack)))
        if attrs.get("data-ctm-component") in GRADED:
            self.targets.append((attrs.get("data-ctm-component"),
                                 attrs.get("data-ctm-id"), tuple(p for _, p in self.stack if p)))
        if tag == "script" and attrs.get("id") == "ctm-store-manifest":
            self.current = []

    def handle_data(self, data):
        if self.current is not None:
            self.current.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self.current is not None:
            self.manifests.append(json.loads("".join(self.current)))
            self.current = None
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break


def annotated(heading, quiz):
    if heading.endswith("}"):
        return heading[:-1] + " quiz=" + quiz + "}"
    return heading + " {quiz=" + quiz + "}"


def audit_source(contract):
    # Removing only the declared metadata must recover every baseline byte.
    sources = {}
    pages = set()
    ids = []
    for q in contract["quizzes"]:
        ids.append(q["id"])
        assert q["exercises"], "empty quiz " + q["id"]
        assert all(e["component"] in GRADED and e["id"] for e in q["exercises"])
        path = q["source"]
        sources.setdefault(path, (ROOT / path).read_bytes().decode("utf-8"))
        value = annotated(q["heading"], q["id"])
        assert sources[path].splitlines().count(value) == 1, (path, value)
        sources[path] = sources[path].replace(value, q["heading"], 1)
        pages.add(q["page"].replace(".html", ".qmd"))
    assert len(ids) == len(set(ids)), "duplicate quiz id"
    for path in pages:
        text = (ROOT / path).read_bytes().decode("utf-8")
        block = "\nctm-assessment:\n  progress: true\n"
        assert text.count(block) == 1, path
        sources[path] = text.replace(block, "\n", 1)
    for path, recovered in sources.items():
        baseline = subprocess.check_output(
            ["git", "show", contract["base"] + ":" + path], cwd=ROOT)
        assert recovered.encode("utf-8") == baseline, "content changed: " + path
    expected = [e["id"] for q in contract["quizzes"] for e in q["exercises"]]
    assert len(expected) == len(set(expected)), "duplicate graded label"
    for q in contract["quizzes"]:
        # Labels can be in a nested include, so search approved course sources.
        for e in q["exercises"]:
            found = sum(len(re.findall(r"^#\|\s*label:\s*" + re.escape(e["id"]) +
                                      r"\s*$", p.read_text(encoding="utf-8"), re.M))
                        for p in (ROOT / "_includes").rglob("*.md"))
            assert found == 1, (e["id"], found)
    print("Source PASS: exact baseline content, %d quizzes / %d graded exercises" %
          (len(ids), len(expected)))


def audit_render(contract, site):
    by_page = {}
    for q in contract["quizzes"]:
        by_page.setdefault(q["page"], []).append(q)
    for path, quizzes in by_page.items():
        page = Page((site / path).read_text(encoding="utf-8"))
        assert len(page.manifests) == 1, (path, "missing/duplicate store manifest")
        manifest = page.manifests[0]
        assert manifest["progress"] is True, path
        assert Counter(q["id"] for q in manifest["quizzes"]) == Counter(
            q["id"] for q in quizzes), (path, "quiz ids")
        actual = [e for e in manifest["exercises"] if e["component"] in GRADED]
        expected = [dict(e, quiz=q["id"]) for q in quizzes for e in q["exercises"]]
        assert Counter((e["component"], e["id"], e.get("quiz")) for e in actual) == Counter(
            (e["component"], e["id"], e["quiz"]) for e in expected), (path, "membership")
        for q in quizzes:
            members = [(e["component"], e["id"]) for e in actual if e.get("quiz") == q["id"]]
            assert members == [(e["component"], e["id"]) for e in q["exercises"]], (
                path, q["id"], "member order")
            slots = [(owner, reveal) for quiz, owner, reveal in page.slots if quiz == q["id"]]
            assert len(slots) == 1 and slots[0][0] and not slots[0][1], (
                path, q["id"], "pane-owned slot outside reveals")
            for e in q["exercises"]:
                targets = [owner for component, label, owner in page.targets
                           if (component, label) == (e["component"], e["id"])]
                assert len(targets) == 1 and slots[0][0] in targets[0], (
                    path, q["id"], e["id"], "pane ancestry")
    print("Render PASS: exact ordered graded membership and pane ownership on %d pages" %
          len(by_page))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path)
    args = parser.parse_args()
    contract = json.loads(CONTRACT.read_text(encoding="utf-8"))
    audit_source(contract)
    if args.site:
        audit_render(contract, args.site)
