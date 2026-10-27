#!/usr/bin/env python3
"""Guard the linalg UI migration against unintended exercise/grading changes.

This is the migration's fixed source baseline, not a new grading engine. The
only allowed code-fence changes are explicit AI context metadata and the listed
new labels on formerly unlabelled visible IDE cells. Existing labels, tasks,
answers, modes, code, checks and tests remain byte-for-byte unchanged.
The approved week 9 Nelder–Mead addition has its own fixed source baseline.
"""
from pathlib import Path
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
BASE = "3012cb7b9ab16b738f9c012f8ab119efbde5cd59"
# The same approved addition is on main and linalg-branch. Protect its code
# and setup comment as well, without rebasing the other migration checks.
SOURCE_BASELINES = {
    "_includes/optimization/uke9.md": "b8baf4f33bfc294aee3a53d2a551f42595d7c4ed",
    "_includes/optimization/week9_setup.md": "b8baf4f33bfc294aee3a53d2a551f42595d7c4ed",
}
RUNTIME = {"{math-exercise}", "{py-exercise}", "{pyodide-python}"}
NEW_IDE_LABELS = {'_includes/ide/manual.md': ['ingmat-ide-ide-manual-1'],
 '_includes/module2/m2_3_exercises.md': ['ingmat-ide-module2-m2-3-exercises-1'],
 '_includes/module2/m2_4_exercises.md': ['ingmat-ide-module2-m2-4-exercises-1'],
 '_includes/module2/m2_5_exercises.md': ['ingmat-ide-module2-m2-5-exercises-1',
                                         'ingmat-ide-module2-m2-5-exercises-2'],
 '_includes/projects/week1_floating_point_attack.md': ['ingmat-ide-projects-week1-floating-point-attack-1',
                                                       'ingmat-ide-projects-week1-floating-point-attack-2',
                                                       'ingmat-ide-projects-week1-floating-point-attack-3',
                                                       'ingmat-ide-projects-week1-floating-point-attack-4',
                                                       'ingmat-ide-projects-week1-floating-point-attack-5',
                                                       'ingmat-ide-projects-week1-floating-point-attack-6',
                                                       'ingmat-ide-projects-week1-floating-point-attack-7',
                                                       'ingmat-ide-projects-week1-floating-point-attack-8',
                                                       'ingmat-ide-projects-week1-floating-point-attack-9',
                                                       'ingmat-ide-projects-week1-floating-point-attack-10',
                                                       'ingmat-ide-projects-week1-floating-point-attack-11',
                                                       'ingmat-ide-projects-week1-floating-point-attack-12'],
 '_includes/projects/week2_newton_fractals.md': ['ingmat-ide-projects-week2-newton-fractals-1',
                                                 'ingmat-ide-projects-week2-newton-fractals-2',
                                                 'ingmat-ide-projects-week2-newton-fractals-3',
                                                 'ingmat-ide-projects-week2-newton-fractals-4',
                                                 'ingmat-ide-projects-week2-newton-fractals-5',
                                                 'ingmat-ide-projects-week2-newton-fractals-6',
                                                 'ingmat-ide-projects-week2-newton-fractals-7',
                                                 'ingmat-ide-projects-week2-newton-fractals-8',
                                                 'ingmat-ide-projects-week2-newton-fractals-9',
                                                 'ingmat-ide-projects-week2-newton-fractals-10',
                                                 'ingmat-ide-projects-week2-newton-fractals-11',
                                                 'ingmat-ide-projects-week2-newton-fractals-12',
                                                 'ingmat-ide-projects-week2-newton-fractals-13',
                                                 'ingmat-ide-projects-week2-newton-fractals-14',
                                                 'ingmat-ide-projects-week2-newton-fractals-15',
                                                 'ingmat-ide-projects-week2-newton-fractals-16'],
 '_includes/projects/week3_chebyshev_sampling.md': ['ingmat-ide-projects-week3-chebyshev-sampling-2',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-3',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-4',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-5',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-6',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-7',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-8',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-9',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-10',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-11',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-12',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-13',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-14',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-15',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-16',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-17',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-18',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-19',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-20',
                                                    'ingmat-ide-projects-week3-chebyshev-sampling-21']}
QUIZZES = [('_includes/module1/m1_1_exercises.md', '## Oppgaver', 'uke1-horner'),
 ('_includes/module1/m1_2_exercises.md', '## Oppgaver', 'uke1-binaer'),
 ('_includes/module1/m1_3.md', '## Oppgaver', 'uke1-flyttall'),
 ('_includes/module2/m2_1.md', '### Oppgave', 'uke2-oppgaver-1'),
 ('_includes/module2/m2_2.md', '### Oppgave', 'uke2-oppgaver-2'),
 ('_includes/module2/m2_3.md', '### Oppgave', 'uke2-oppgaver-3'),
 ('_includes/module2/m2_4.md', '### Oppgave', 'uke2-oppgaver-4'),
 ('_includes/module2/m2_5.md', '### Oppgave', 'uke2-oppgaver-5'),
 ('_includes/linalg/uke3.md',
  '## 3.6 Egenarbeid: bildeforsøk og polynomoppgaver {#uke3-del4}',
  'uke3-6-oppgaver'),
 ('_includes/linalg/uke3.md',
  '## 3.8 Støtteløp: Papir- og kontrolloppgaver {#uke3-stotte-oppgaver}',
  'uke3-8-oppgaver'),
 ('_includes/linalg/uke4.md', '## 4.7 Oppsummering og oppgaver', 'uke4-7-oppgaver'),
 ('_includes/optimization/uke9.md', '## 9.6 Regneoppgaver', 'uke9-6-oppgaver'),
 ('_includes/optimization/uke9.md', '## 9.7 Python: mål og tilpass', 'uke9-7-oppgaver'),
 ('_includes/linalg/uke5.md', '## 5.7 Støtteløp: repetisjon ved behov', 'uke5-7-oppgaver'),
 ('_includes/linalg/uke5.md', '## 5.8 Hovedløp: iterasjon og PageRank', 'uke5-8-oppgaver'),
 ('_includes/optimization/uke11.md', '## 11.5 Regneoppgaver', 'uke11-5-oppgaver'),
 ('_includes/optimization/uke11.md', '## 11.6 Python: undersøk og kontroller', 'uke11-6-oppgaver'),
 ('_includes/optimization/uke10.md', '## 10.5 Regneoppgaver', 'uke10-5-oppgaver'),
 ('_includes/optimization/uke10.md', '## 10.6 Python: prøv stegene selv', 'uke10-6-oppgaver'),
 ('_includes/optimization/uke8.md', '## 8.5 Regneoppgaver', 'uke8-5-oppgaver'),
 ('_includes/optimization/uke8.md',
  '## 8.6 Python: SciPy-oppslag og kodeoppgaver',
  'uke8-6-oppgaver'),
 ('_includes/optimization/uke8.md',
  '## 8.7 Støtteløp: flervariabel derivasjon ved behov',
  'uke8-7-oppgaver'),
 ('_includes/linalg/uke7.md', '## 7.8 Oppgaver', 'uke7-8-oppgaver'),
 ('_includes/optimization/uke12.md', '## 12.6 Regneoppgaver', 'uke12-6-oppgaver'),
 ('_includes/optimization/uke12.md', '## 12.7 Python: prøv kontrollene selv', 'uke12-7-oppgaver'),
 ('_includes/linalg/uke6.md', '## 6.7 Prosjekt og egenarbeid', 'uke6-7-oppgaver')]


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


def blocks(text, name):
    lines = text.splitlines(keepends=True)
    found = []
    index = 0
    while index < len(lines):
        opening = re.match(r"^\s*(`{3,}|~{3,})([^\n]*)\n?$", lines[index])
        if not opening:
            index += 1
            continue
        fence, kind = opening.groups()
        start = index
        index += 1
        closing = re.compile(r"^\s*" + re.escape(fence[0]) + "{" + str(len(fence)) + r",}\s*$")
        while index < len(lines) and not closing.match(lines[index].rstrip("\n")):
            index += 1
        assert index < len(lines), f"{name}: unclosed code fence at {start + 1}"
        found.append((kind.strip(), "".join(lines[start:index + 1])))
        index += 1
    return found


def without_context(text):
    # Context names change what AI feedback sees; they cannot change grading.
    return re.sub(r"^#\| context:[^\n]*\n", "", text, flags=re.MULTILINE)


def audit():
    names = git("ls-tree", "-r", "--name-only", BASE).decode().splitlines()
    source_names = [name for name in names if name.endswith((".md", ".qmd"))
                    and name.startswith(("_includes/", "pages/"))]
    protected = graded = added = 0
    seen_added = set()
    for name in source_names:
        source_base = SOURCE_BASELINES.get(name, BASE)
        before = blocks(git("show", source_base + ":" + name).decode(), name)
        after = blocks((ROOT / name).read_text(), name)
        assert len(before) == len(after), f"{name}: code-fence count changed"
        expected_labels = set(NEW_IDE_LABELS.get(name, []))
        actual_labels = set()
        for (old_kind, old), (kind, current) in zip(before, after):
            assert kind == old_kind, f"{name}: code-fence kind changed"
            if kind == "{pyodide-python}" and not re.search(r"^#\| label:", old, re.MULTILINE):
                label = re.search(r"^#\| label: ([^\n]+)\n", current, re.MULTILINE)
                if label:
                    assert label[1] in expected_labels and label[1] not in seen_added, f"{name}: unexpected or duplicate IDE label"
                    assert not re.search(r"^#\| context:\s*(?:setup|output)\s*$", old, re.MULTILINE), f"{name}: hidden cell became a saved exercise"
                    actual_labels.add(label[1]); seen_added.add(label[1]); added += 1
                    current = current[:label.start()] + current[label.end():]
            if kind in {"{math-exercise}", "{py-exercise}"}:
                old, current = without_context(old), without_context(current)
                graded += 1
            if kind == "{pyodide-python}" and not re.search(r"^#\| feedback-context:", old, re.MULTILINE):
                # References add public helper assumptions to AI feedback;
                # executable code and existing options remain protected.
                current = re.sub(r"^#\| feedback-context:[^\n]*\n", "", current, flags=re.MULTILINE)
            assert old == current, f"{name}: authored code, answers, tasks, grading or test data changed"
            protected += 1
        assert actual_labels == expected_labels, f"{name}: required visible IDE labels differ"
    assert added == 53 and graded == 191 and protected == 561, (added, graded, protected)
    for name, heading, quiz in QUIZZES:
        expected = heading[:-1] + " quiz=" + quiz + "}" if heading.endswith("}") else heading + " {quiz=" + quiz + "}"
        assert (ROOT / name).read_text().splitlines().count(expected) == 1, f"{name}: missing or duplicate quiz {quiz}"
    project = "_includes/projects/week12_chain.md"
    original = git("show", BASE + ":" + project).decode().split("### Bakgrunn:", 1)[0]
    current = (ROOT / project).read_text().split("### Bakgrunn:", 1)[0]
    assert current == original, "Project12 workload estimate/plan changed"
    for legacy in ("_includes/site/learning-mode.html", "_includes/site/tab-links.html"):
        assert not (ROOT / legacy).exists(), f"Legacy UI script remains: {legacy}"
    result = {"passed": True, "baseline": BASE, "sourceBaselines": SOURCE_BASELINES,
              "protectedCodeBlocks": protected,
              "gradedExerciseBlocks": graded, "newVisibleIDELabels": added,
              "quizScopes": len(QUIZZES), "project12WorkloadPreserved": True}
    print(json.dumps(result, sort_keys=True))


if __name__ == "__main__":
    audit()
