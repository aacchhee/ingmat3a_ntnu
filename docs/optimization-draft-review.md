# Optimisation weeks: first-draft review

## Current lecture revision

The five lecture pages were subsequently revised as a self-contained textbook
sequence. Timetables, calendar mappings and visible source sections were removed.
Definitions and essential theory now precede the calculations that need them;
explicit links connect the previous linear algebra weeks to the new methods.
The same week-6 quadratic develops from geometry and convexity to Newton's step.
Each solver has beginner call guidance and a compact SciPy reference.
New geometry figures connect gradient trajectories to objective histories,
Newton paths to the local quadratic model, and SLSQP iterates to the feasible
circle. Paired panels are arranged vertically and discussed in the text. A second
Astra XHIGH review considers all five weeks together, including the progression
of mathematical prerequisites and programming vocabulary. Project content is
unchanged apart from removing draft labels from titles.

The source mapping and initial review record below are retained for maintainers;
they do not describe the current student-facing headings or reading requirements.

## Initial drafting record

Drafted on `linalg-branch` from the 2025 IMAX3011 campus lecture material.
Each lecture page has a proposed 120-minute route, small executable experiments,
questions about their results, and longer derivations under **Gå i dybden**.
The drafts are intended for subsequent week-by-week editorial discussion.

## Topic boundaries and sources

| Site week | Calendar week | Main topic | Gjøvik PDFs | Trondheim PDFs |
|---|---|---|---|---|
| 8 | 41 | Models, extrema, compactness and convexity | Introduksjon til optimering; Konveksitet og kompakthet | Lectures 15–16 |
| 9 | 42 | Search without derivatives and gradient descent | Iterative metoder uten deriverte; Kompassøk; Numeriske metoder – gradient metode | Lectures 17–18 |
| 10 | 43 | Newton for optimisation, damping and local convergence | Newtons flervariabel handout; Numeriske metoder – Newtons metode | Lectures 19–20 |
| 11 | 44 | Linear programming, duality and resource sensitivity | Lineær optimering – standard former; Lineær optimering – dualitet | Lectures 21–22 |
| 12 | 45 | Equality constraints and Lagrange multipliers | No week-45 material requested | Lectures 23–24 |

Source indexes: [Gjøvik](https://wiki.math.ntnu.no/imax3011/2025h/gjovik)
and [Trondheim](https://wiki.math.ntnu.no/imax3011/2025h/trondheim).
Each lecture page links to the relevant PDFs directly. Nineteen PDFs were
reviewed, including scanned pages where text extraction was insufficient.

The existing division between weeks is retained. Week 10 ends with a short LP
bridge, as Trondheim lecture 20 does; week 11 develops the subject. Week 12
refers back to least squares in weeks 4 and 7 instead of teaching it again.
Gradient, quadratic minimisation, line search and CG from week 6 are used as
starting points, with explicit links and explanations of what changes for
nonquadratic functions or constraints. General inequality KKT theory is not
added to the main route.

## Projects and code

- **Project 10:** Newton versus gradient descent on a curved valley; starting
  points, coordinate scaling, exact Newton invariance, the effects of
  regularisation, and solver stopping criteria.
- **Project 11:** production planning, a primal/dual optimality certificate,
  an exact capacity sensitivity interval, and an additional-resource purchase
  decision. Continuous quantities and integer production are distinguished.

Both projects are complete browser workflows using `pyodide-interaktiv`.
Each has one optional standalone `.py` supplement with the same data and
experiments for an external editor. The files do not supply the students'
mathematical arguments. No notebook workflow is introduced.

## Independent review

All five weeks received an independent **Astra XHIGH** audit. The audits checked
mathematics, numerical results, source coverage, sequencing, pacing, assessment
contracts and project substance. Required findings were corrected:

- Week 8: the Hessian test with zero eigenvalues, the linearity argument for
  checking vertices, and the parameter range in the convexity argument.
- Week 9: vector input instructions and labels, the precise global lower-bound
  question, random-walk coverage, and visible explanations of Armijo and SciPy
  line search.
- Week 10: the project's objective-evaluation counter; explicit local quadratic
  convergence assumptions and the need for regularisation to become inactive.
- Week 11: inline mathematics in the project, complete exercise question data,
  and removal of a redundant editor supplement.
- Week 12: complete exercise question data, component labels and input
  instructions; clearer constraint-regularity wording.

The 20 assessment tasks have no authored hint or solution blocks. Their answers
are exact integers, fractions or expressions; vector entries use separate
component fields. Task-specific data is included in each exercise rather than
relying on prose that the feedback interface might omit.

## Verification

Run native execution checks from the repository root:

```sh
python scripts/check_optimization.py --projects
```

This uses fresh namespaces for each lecture/project page and runs both optional
editor files. It requires NumPy, SciPy and Matplotlib. It also checks cell labels,
balanced details blocks and unresolved placeholders. Project cells that ask for
student candidates are intentionally editable; the zero-filled LP candidate is
not an optimality certificate.

- All 28 lecture cells and 12 project cells execute sequentially in fresh native
  Python environments; both standalone project files execute.
- Derivatives, reported example values, LP primal/dual values and Lagrange
  signs were checked independently during review. Plot layouts were inspected.
- A full Quarto render succeeds. Local rendering uses `--no-execute` because
  these cells execute in the browser, and the local sandbox cannot start the
  build-time kernel IPC used elsewhere in the site.
- Browser checks use the installed `pyodide-interaktiv` runtime with Pyodide
  0.28.3 and SciPy 1.14.1, including HiGHS, bounded scalar minimisation and
  SLSQP. Native solver versions can give slightly different iteration counts;
  the material asks students to inspect the reported values and stopping tests.
- All seven rendered pages execute their setup and interactive cells in the
  embedded browser runtime without Python errors. All 20 rendered exercises
  accept their exact answer keys; an incorrect answer is rejected on each week.
  Internal page links, explicit anchors and both Python downloads were checked.
  The headless harness caches unchanged CDN assets and disables its service
  worker to accommodate the restricted network; this is not a test of offline
  availability or the optional browser `input()` feature.

Optional AI feedback requires a configured provider and was not exercised.
The exercise questions, input labels and mathematical answers were reviewed
independently of that optional service.
