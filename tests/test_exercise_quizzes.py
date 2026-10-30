"""Manifest/pane canaries for the exercise quiz audit (stdlib only)."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("quiz_audit", ROOT / "scripts/audit-exercise-quizzes.py")
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class RenderContract(unittest.TestCase):
    def setUp(self):
        self.contract = {"quizzes": [
            {"page": "page.html", "id": "outer-quiz", "exercises": [
                {"component": "math-exercise", "id": "math-a"},
                {"component": "py-exercise", "id": "py-b"}]},
            {"page": "page.html", "id": "sibling-quiz", "exercises": [
                {"component": "math-exercise", "id": "math-c"}]}]}
        self.manifest = {"progress": True,
            "quizzes": [{"id": q["id"]} for q in self.contract["quizzes"]],
            "exercises": [dict(e, quiz=q["id"]) for q in self.contract["quizzes"]
                          for e in q["exercises"]]}
        self.body = """
<div class="tab-pane" id="outer">
<div class="ctm-progress-slot" data-ctm-quiz="outer-quiz"></div>
<div class="tab-pane" id="nested">
<div data-ctm-component="math-exercise" data-ctm-id="math-a"></div>
</div>
<div data-ctm-component="py-exercise" data-ctm-id="py-b"></div>
</div>
<div class="tab-pane" id="sibling">
<div class="ctm-progress-slot" data-ctm-quiz="sibling-quiz"></div>
<div data-ctm-component="math-exercise" data-ctm-id="math-c"></div>
</div>
"""

    def run_audit(self, body=None, include_manifest=True):
        text = self.body if body is None else body
        if include_manifest:
            text += '<script id="ctm-store-manifest" type="application/json">' + json.dumps(self.manifest) + '</script>'
        with tempfile.TemporaryDirectory() as directory:
            site = Path(directory)
            (site / "page.html").write_text(text, encoding="utf-8")
            audit.audit_render(self.contract, site)

    def rejects(self, **kwargs):
        with self.assertRaises(AssertionError):
            self.run_audit(**kwargs)

    def test_nested_pane_and_ungraded_cell(self):
        self.manifest["exercises"].append(
            {"component": "pyodide-interaktiv", "id": "code", "quiz": "outer-quiz"})
        self.run_audit()

    def test_missing_manifest(self):
        self.rejects(include_manifest=False)

    def test_duplicate_manifest(self):
        self.rejects(body=self.body + '<script id="ctm-store-manifest">' +
                     json.dumps(self.manifest) + '</script>')

    def test_quiz_missing(self):
        self.manifest["quizzes"].pop()
        self.rejects()

    def test_duplicate_quiz(self):
        self.manifest["quizzes"].append(self.manifest["quizzes"][0])
        self.rejects()

    def test_member_missing(self):
        self.manifest["exercises"].pop()
        self.rejects()

    def test_member_duplicated(self):
        self.manifest["exercises"].append(self.manifest["exercises"][0])
        self.rejects()

    def test_qpy_cannot_replace_graded_member(self):
        self.manifest["exercises"][0]["component"] = "pyodide-interaktiv"
        self.rejects()

    def test_unscoped_member(self):
        del self.manifest["exercises"][0]["quiz"]
        self.rejects()

    def test_sibling_quiz_assignment(self):
        self.manifest["exercises"][0]["quiz"] = "sibling-quiz"
        self.rejects()

    def test_order(self):
        self.manifest["exercises"][:2] = reversed(self.manifest["exercises"][:2])
        self.rejects()

    def test_missing_progress(self):
        self.manifest["progress"] = False
        self.rejects()

    def test_duplicate_slot(self):
        self.rejects(body=self.body.replace(
            '<div class="ctm-progress-slot" data-ctm-quiz="outer-quiz"></div>',
            '<div class="ctm-progress-slot" data-ctm-quiz="outer-quiz"></div>' * 2))

    def test_slot_inside_reveal(self):
        slot = '<div class="ctm-progress-slot" data-ctm-quiz="outer-quiz"></div>'
        self.rejects(body=self.body.replace(slot, '<details><summary>Hint</summary>' +
                                           slot + '</details>'))

    def test_slot_outside_pane(self):
        slot = '<div class="ctm-progress-slot" data-ctm-quiz="outer-quiz"></div>'
        self.rejects(body=slot + self.body.replace(slot, ""))

    def test_member_in_sibling_pane(self):
        target = '<div data-ctm-component="math-exercise" data-ctm-id="math-a"></div>'
        self.rejects(body=self.body.replace(target, "").replace(
            '<div class="tab-pane" id="sibling">',
            '<div class="tab-pane" id="sibling">' + target))

    def test_duplicate_target(self):
        target = '<div data-ctm-component="math-exercise" data-ctm-id="math-a"></div>'
        self.rejects(body=self.body.replace(target, target * 2))


if __name__ == "__main__":
    unittest.main()
