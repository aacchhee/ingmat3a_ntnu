#!/usr/bin/env python3
"""Guard the linalg UI migration against unintended exercise/grading changes.

This is the migration's fixed source baseline, not a new grading engine. The
only allowed code-fence changes are explicit AI context metadata and the listed
new labels on formerly unlabelled visible IDE cells. Existing labels, tasks,
answers, modes, code, checks and tests remain byte-for-byte unchanged.
The approved week 9 Nelder–Mead addition has its own fixed source baseline,
and APPROVED_WORDING lists the approved wording fixes in protected blocks.
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
    # 12 Nov 2026: section 12.5 was shortened and rewritten on Arild's own oval path (the
    # cafe example, the penalty/SLSQP-path/disc boxes, the lower-bound box in 12.2 and
    # their cells and exercises are gone; experiment 5, exercise week12-numeric-check, the
    # 12.7 code exercises and the hidden setup helpers were rewritten). From now on the
    # fences of these two files are protected against THIS version, not against BASE.
    # Baselines (12 Nov 2026): uke12.md at a2d1c98, where the 12.6 exercise
    # texts moved into the blocks; week12_setup.md at d7bb6f4 (shortened 12.5).
    "_includes/optimization/uke12.md": "a2d1c9821e9b3a2a90b5180081334dd135d7a655",
    "_includes/optimization/week12_setup.md": "d7bb6f4966f91b26747ab7b05686ee4855714400",
}
# Wording fixes (and the project 4 point count) the course author approved
# on 27 Oct 2026 inside protected fences and the project 12 header. Each
# pair is applied once to the baseline text; nothing else in those blocks
# may change.
APPROVED_WORDING = {
    '_includes/optimization/uke11.md': [
        ('# Komplementær slakk ga u = 2, v = 1. Bygger de normalene til målretningen?',
         '# Komplementær slakk ga u = 2, v = 1. Gir de vektede normalene til sammen målretningen?'),
        ('# En rad per begrensning og en kolonne per produkt.',
         '# En rad per krav og en kolonne per produkt.'),
        # 5 Nov 2026: the author asked for "lineære likningssett" throughout week 11.
        ('#| caption: Finn hjørnene som løsninger av 2×2-systemer\n',
         '#| caption: Finn hjørnene som løsninger av 2×2-likningssett\n'),
        # 5 Nov 2026: the author asked to drop the term "innsatspris"; it is now "leieverdi" (rental story).
        ("  return 'Innsats A: ' + fmt(inA())",
         "  return 'Leie A: ' + fmt(inA())"),
        ('#| field-labels: innsatspris A, innsatspris B, øvre grense\n',
         '#| field-labels: leieverdi A, leieverdi B, øvre grense\n'),
        ('Innsatspriser (A, B): vec[5,5]',
         'Leieverdier (A, B): vec[5,5]'),
        ('#| field-labels: slakk materiale, dekningsbidrag, innsatspris C, øvre grense\n',
         '#| field-labels: slakk materiale, dekningsbidrag, ressurskostnad C, øvre grense\n'),
        ('Innsatspris C: _[25/3]',
         'Leieverdi C: _[25/3]'),
        # 5 Nov 2026: the author asked for "fortjeneste" instead of "dekningsbidrag".
        ('# Bidrag per parti (A, B) i tusen kroner.',
         '# Fortjeneste per parti (A, B) i tusen kroner.'),
        ('print("Dekningsbidrag:     ", -result.fun)',
         'print("Fortjeneste:        ", -result.fun)'),
        ('beste bidrag {best_values[k]:g}',
         'beste fortjeneste {best_values[k]:g}'),
        ('#| caption: Slakk og dekningsbidrag i planen (4, 1)',
         '#| caption: Slakk og fortjeneste i planen (4, 1)'),
        ('#| field-labels: slakk maskintimer, slakk arbeidstimer, slakk A-grense, dekningsbidrag',
         '#| field-labels: slakk maskintimer, slakk arbeidstimer, slakk A-grense, fortjeneste'),
        ('Dekningsbidrag: _[24]',
         'Fortjeneste: _[24]'),
        ('#| caption: Beste hjørne og knekkpunkter når bidraget fra A endres',
         '#| caption: Beste hjørne og knekkpunkter når fortjenesten fra A endres'),
        ('øvre grense, bidrag i planen',
         'øvre grense, fortjeneste i planen'),
        ('Bidrag $5x+2y$ i $(4,1)$: _[22]',
         'Fortjeneste $5x+2y$ i $(4,1)$: _[22]'),
        ('#| field-labels: slakk materiale, dekningsbidrag, ressurskostnad C, øvre grense',
         '#| field-labels: slakk materiale, fortjeneste, leieverdi C, øvre grense'),
        ('Dekningsbidrag for planen: _[68]',
         'Fortjeneste for planen: _[68]'),
        ('#| field-labels: nye partier A, nye partier B, nytt dekningsbidrag',
         '#| field-labels: nye partier A, nye partier B, ny fortjeneste'),
        ('Dekningsbidrag: _[29]',
         'Fortjeneste: _[29]'),
        ('#| caption: Beregn ressursbruk og dekningsbidrag',
         '#| caption: Beregn ressursbruk og fortjeneste'),
        ('# TODO: Beregn slakk som kapasitet minus bruk og bidrag som p@z.',
         '# TODO: Beregn slakk som kapasitet minus bruk og fortjeneste som p@z.'),
    ],
    # uke12.md has no entry any more: the three 27 Oct wording fixes are already in the 12 Nov
    # baseline of SOURCE_BASELINES, so applying them to it would find nothing to replace.
    '_includes/projects/week9_scaling.md': [
        ('# du kan prøve 4000; ikke bruk millionkjøringer',
         '# du kan prøve 4000; ikke kjør med millioner av steg'),
    ],
    '_includes/projects/week10_positioning.md': [
        ("{name:'tag', size:5,",
         "{name:'tagg', size:5,"),
    ],
    '_includes/projects/week12_chain.md': [
        ('Skriv en forventning før et forsøk; sammenlign den med det du faktisk ser.',
         'Skriv ned hva du forventer før hvert forsøk, og sammenlign med det du faktisk ser.'),
        ('| Straffefeil, kondisjon og solvermeldinger |',
         '| Straffefeil, kondisjon og løsermeldinger |'),
    ],
    '_includes/module2/m2_3_exercises.md': [
        ('trengs før feilen gir minst fire korrekte desimaler?',
         'trengs før iteratet har minst fire korrekte desimaler?'),
    ],
    '_includes/projects/week1_floating_point_attack.md': [
        ('# TODO: design din egen summeringsalgoritme.',
         '# TODO: lag din egen summeringsalgoritme.'),
    ],
    '_includes/projects/week2_newton_fractals.md': [
        ('# Basin-fargen skal bare kode nullpunkt, ikke iterasjonstall.',
         '# Fargen for tiltrekningsområdet skal bare kode nullpunkt, ikke iterasjonstall.'),
        ('får ikke lage en kunstig\n    basin-grense.',
         'får ikke lage en kunstig\n    grense mellom tiltrekningsområder.'),
        ('"""Sammenlign Newton-arbeidet på grensen og inne i basinene."""',
         '"""Sammenlign Newton-arbeidet på grensen og inne i tiltrekningsområdene."""'),
        ('print("Synlige basin:           ", summary["visible_basins"])',
         'print("Tiltrekningsområder:     ", summary["visible_basins"])'),
    ],
    '_includes/projects/week3_chebyshev_sampling.md': [
        ('# samme matematiske objekt med to forskjellige representasjoner.',
         '# samme matematiske objektet med to forskjellige representasjoner.'),
    ],
    '_includes/projects/week4_orthogonal_rescue.md': [
        ('n = 12\nm = 25\npoints = np.linspace(-1.0, 1.0, m)',
         'n = 12\nm = 27\npoints = np.linspace(-1.0, 1.0, m)'),
    ],
    '_includes/projects/week5_pagerank.md': [
        ('# Felles verktøy for prosjektet. Ingen celler fra notatene må kjøres først.',
         '# Felles verktøy for prosjektet. Du trenger ikke kjøre noen celler fra notatene først.'),
        ('# Grensen fra 5.6 gjør residualkravet til en garanti for faktisk feil.',
         '# Grensen fra 5.6 gjør residualkravet til en garanti for at den faktiske feilen er høyst error_goal.'),
    ],
    '_includes/linalg/uke3.md': [
        ('# Eksperimentet spør om blokk-gjennomsnittene likevel kan bli de samme.',
         '# Eksperimentet spør om blokkgjennomsnittene likevel kan bli de samme.'),
        ('oppfyller ikke Bz=0."\n#|           elif "dependent" in statuses:\n#|               result["feedback"] = "De gule kolonnene ligger i nullrommet, men familien er lineært avhengig."\n#|           elif statuses:\n#|               result["feedback"] = "De grønne kolonnene er gyldige og uavhengige, men de spenner ennå ikke hele nullrommet."',
         'oppfyller ikke Bz=0."\n#|           elif "dependent" in statuses:\n#|               result["feedback"] = "De gule kolonnene ligger i nullrommet, men familien er lineært avhengig."\n#|           elif statuses:\n#|               result["feedback"] = "De grønne kolonnene er gyldige og uavhengige, men de spenner ennå ikke ut hele nullrommet."'),
        ('oppfyller ikke Cz=0."\n#|           elif "dependent" in statuses:\n#|               result["feedback"] = "De gule kolonnene ligger i nullrommet, men familien er lineært avhengig."\n#|           elif statuses:\n#|               result["feedback"] = "De grønne kolonnene er gyldige og uavhengige, men de spenner ennå ikke hele nullrommet."',
         'oppfyller ikke Cz=0."\n#|           elif "dependent" in statuses:\n#|               result["feedback"] = "De gule kolonnene ligger i nullrommet, men familien er lineært avhengig."\n#|           elif statuses:\n#|               result["feedback"] = "De grønne kolonnene er gyldige og uavhengige, men de spenner ennå ikke ut hele nullrommet."'),
    ],
    '_includes/linalg/uke4.md': [
        ('# tolerance=0 brukes bare her for å eksponere feilutviklingen i hele sveipet.',
         '# tolerance=0 brukes bare her for å vise feilutviklingen i hele sveipet.'),
        ('For den nye minste-kvadraters linjen er',
         'For den nye linjen fra minste kvadrater er'),
    ],
    '_includes/linalg/uke5.md': [
        ('"Startvektoren gir en følge som blir på den andre egenlinjen."',
         '"Startvektoren gir en følge som blir liggende på den andre egenlinjen."'),
    ],
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


def approved(name, text):
    for old, new in APPROVED_WORDING.get(name, []):
        assert text.count(old) == 1, f"{name}: approved wording baseline not found: {old!r}"
        text = text.replace(old, new)
    return text


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
        before = blocks(approved(name, git("show", source_base + ":" + name).decode()), name)
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
    # 12 Nov 2026: uke12 lost 4 fences with the removed deep dives (cells week12-slsqp-path and
    # week12-disc; math exercises week12-dual-bound and week12-disc-kkt): graded 191 -> 189
    # (the two math exercises) and protected 561 -> 557 (all four). Added IDE labels unchanged.
    assert added == 53 and graded == 189 and protected == 557, (added, graded, protected)
    for name, heading, quiz in QUIZZES:
        expected = heading[:-1] + " quiz=" + quiz + "}" if heading.endswith("}") else heading + " {quiz=" + quiz + "}"
        assert (ROOT / name).read_text().splitlines().count(expected) == 1, f"{name}: missing or duplicate quiz {quiz}"
    project = "_includes/projects/week12_chain.md"
    original = approved(project, git("show", BASE + ":" + project).decode()).split("### Bakgrunn:", 1)[0]
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
