# Week 8 revision audit

Reviewed the complete revised `_includes/optimization/uke8.md`, its setup/page files, the relevant week 6 material and forward anchors, and all three rendered lecture figures. Review is read-only with respect to course content. This is a source/pedagogical audit, not a browser-runtime certification.

**Final verdict: approved; no remaining required corrections or open review findings.** The parent applied both required corrections and all four small improvements during review; I reread the changed source and checked the current `_site/pages/uke8.html` render. The mathematical structure, examples and exercise progression are now coherent enough for these notes to serve as the students' textbook. No wholesale rewrite or additional topic is needed. The parent also reports successful browser-runtime QA, detailed below.

## Prioritized corrections

1. **P1 — Resolved: numerical approximation was promoted to a proved local minimum.** The 8.2 depth paragraph now correctly says the positive Hessian is consistent with a nearby local minimum, distinguishes the rounded vector from an exactly stationary point, and states what an exact proof would additionally require. The main text no longer promises a proof about the approximate numerical point. This preserves the chapter's central distinction between numerical evidence and guarantees.

2. **P2 — Resolved: setup Python lacked explanatory comments.** `week8_setup.md` now comments the shared array/plotting imports and SciPy minimization import. The four demonstrations and three exercise scaffolds also have useful block comments. The setup is hidden by the extension, so its location before the tabs does not undermine the visible-code-in-8.6 requirement.

## Small improvements, without increasing scope

- **Resolved — definition before notation:** `diag(a,b)` is now defined above its first example table.
- **Resolved — new array-index operation:** the production cell now explains the flattened index from `argmax` and the row/column pair from `unravel_index`. No basic-Python tutorial is needed.
- **Resolved — exercise answer exposure:** Python exercise 2 now uses the distinct quadratic `(x+1)²+3(y−2)²`, with matching gradient and test expectations `(-1,2)`, so its scaffold no longer provides exercise 1's answer.
- **Resolved — punctuation:** removed the extra period after question marks in math-exercise headings 3 and 8.

## Requirement assessment

| User requirement | Assessment |
|---|---|
| Production experiment is self-contained; explain the procurement trip | **Met.** Who acts, decision horizon, component/time budgets, per-unit profits, fixed collection trip, integer choices, sales assumptions and objective are explicit. The trip costs 650 even at zero production; the constant does not affect the best plan. |
| All Python commented | **Met, including the corrected setup.** Comments explain numerical purposes rather than basic syntax. |
| SciPy manual collapsed | **Met.** Plain `<details>` has no `open` and no `reading-step`; switching to depth mode will not expand the reference table. The essential call/result explanation remains immediately before the first SciPy cell. |
| Remove demands to predict results before running | **Met.** Demonstrations state their task and explain actual outcomes. The remaining calculation questions are exercises, not prediction prerequisites. |
| Substantially more examples in terminology-heavy 8.3/8.4 | **Met.** Both now build from familiar concrete cases and explicitly compare neighboring concepts. |
| Corresponding practice in 8.5 | **Met.** Three existence tasks and four convexity tasks directly extend the examples; answers and mathematical checks are correct. |
| All visible Python in its own 8.6 | **Met.** Four runnable demonstrations and three short code exercises are there; main text has static figures/results and links. |
| Simple half-written Python exercises; teach SciPy/new structures, not basic Python | **Met.** Gradient return, `minimize`/result fields, and two result objects are focused completions. No loops/classes/basic-syntax lesson has been introduced. |
| Definition before use; concrete examples for important concepts | **Met, including the corrected `diag` ordering.** Foundational calculus/linear algebra is either briefly restated or correctly linked to week 6. “Dualitet” is a future signpost, not a prerequisite. |
| Streamlined lecture path plus detailed reading path | **Met.** Four depth blocks contain relaxation and longer arguments; the core no longer requires executing code. 8.4 remains the densest section, but its six short subsections have a clear progression. Additional material would now risk overload. |

## Concept → definition → example → exercise coverage

| Concept | Definition/rule | Concrete example | Exercise |
|---|---|---|---|
| Objective, feasible set, constraints; point versus value | 8.1 opening | Workshop plan `(8,14)`, resource usage and 6850 profit | Math 1 |
| Local/global optimum; lower/upper bounds | 8.1 after workshop | Exhaustive integer search; two different wavy valleys; nonnegative-sum proof | Math 2, 9; Python 3 |
| Gradient and directional change | 8.2 opening, with week 6 link | Explicit gradient of the week 6 quadratic; wavy gradient in 8.6 | Math 2; Python 1 |
| Stationary/interior/boundary; necessary versus sufficient | 8.2 | Bowl, upside-down bowl, saddle, and `f(x)=x` on `[0,1]` | Math 2, 9 |
| Hessian, definiteness, semidefinite ambiguity | 8.2 matrix/table/test | Three quadratic cases; `±u^4`; reused system matrix | Math 2, 8 |
| Infimum/supremum versus attained extrema | 8.3 | Same `g(x)=x` on three endpoint variants; refining grids | Math 3 |
| Closed, bounded, compact | 8.3 | Intervals, half-line, disk and circle; missing sequence limit | Math 4, 5, 6 |
| Continuity and extreme-value theorem | 8.3 | Disk extrema; discontinuous endpoint example in depth | Math 5 |
| Sufficient is not necessary for existence | 8.3 | `x²` has a minimum on noncompact `R`; `x` has neither extremum | Math 4/5 provide the theorem practice; no separate exercise needed |
| Convex feasible set | 8.4 | Interval/disk versus circle/integer plans | Math 6 |
| Convex function and counterexample logic | 8.4 | `x²` chord and wavy midpoint violation | Math 7 |
| Strict convexity, uniqueness versus existence | 8.4 | Linear/constant functions, `x²`, open interval; flat valley versus week 6 bowl | Math 8, 9 |
| Hessian test throughout the domain | 8.4 | `diag(2,0)` flat valley and SPD constant matrix | Math 8, 9 |
| Local-to-global guarantee; tangent inequality | 8.4 | Week 6 minimizer; explicit `y² ≥ 2y−1` and zero-gradient bound | Math 9 |
| SciPy call, gradient interface, result fields, limits of success | 8.6 | Same wavy model, two starts and `OptimizeResult` fields | Python 2, 3 |

## Verification and remaining boundary

Checked all stated hand calculations and mathematical exercise answers: production optimum/relaxation value, quadratic gradient/Hessian/eigenvalues, midpoint comparisons, infimum/supremum and tangent expressions are consistent. The theorem assumptions are appropriately restricted: nonempty compact domain plus continuity for existence, open convex domain plus continuous second derivatives for Hessian tests, and convex domain for the local/global result. Convexity is not confused with compactness or existence.

The three inspected figures are readable, use correct quantities and match their stated purpose. Start and result markers nearly overlap because the chosen starts are at/near the two minima, which is truthful; no uncomputed trajectory is implied.

The current render is `_site/pages/uke8.html`; `pages/uke8.html` is an older leftover and is not the reviewed output. Confirmed the current render contains all seven tabs, current exercise scaffolds, figure references and SciPy reference. Browser behavior was checked separately by the parent.

**Final runtime check reported by the parent:** all nine math exercises accepted correct answers, a wrong answer was rejected, all three Python exercise starters failed and completed versions passed, all four demonstrations executed in Pyodide, all three static SVGs loaded, the SciPy reference stayed closed, and there were no JavaScript errors or horizontal overflows. These are parent-run checks, not duplicate executions by this reviewer. The final exercise-2 source and punctuation changes were independently rechecked in this audit.
