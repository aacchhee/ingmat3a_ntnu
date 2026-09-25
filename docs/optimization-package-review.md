# Optimisation package: final holistic review

Reviewed the complete revised weeks 8–12 on `linalg-branch`, against the working tree based on `e8d086a`. This is a package-level review of mathematical accuracy, prerequisite order, connected exposition, week-to-week progression and beginner SciPy use. It follows an initial reading of all five original notes and a second reading of all five revised notes, including the writers' final corrections.

## Verdict

No remaining substantive mathematical or instructional blocker was found. The revised package is suitable as the written course resource for these five topics, with the preceding course weeks as its stated foundation. It now explains the route through the material rather than presenting a sequence of largely independent experiments. Essential definitions and usable theorem statements are in the main route; longer arguments remain under **Gå i dybden**.

The preserved progression is coherent:

| Week | Question developed | Connection and outcome |
|---|---|---|
| 8 | What is an optimisation problem, and what makes an answer best? | Defines the objective and feasible set, local/global and strict extrema, derivatives, Hessian tests, existence and convexity. Separates finding a candidate from proving its quality. |
| 9 | How can we find a candidate with the information available? | Develops finite sampling, adaptive compass search and gradient descent on one nonlinear function. Extends week 6's distinction between direction and step, and distinguishes Armijo acceptance from minimising along a line. |
| 10 | What does local curvature add to the search? | Derives Newton's system from the quadratic model before using it. Distinguishes an unsuitable direction from an excessive step, then treats regularisation, damping and local convergence under explicit assumptions. |
| 11 | How do resource constraints change the problem and its certificate? | Connects divisible production to week 8's integer model. Explains vertices, solver translation, primal/dual bounds, complementary slackness and the finite validity interval of a resource price. |
| 12 | How do we optimise when feasible movement follows a curve or surface? | Derives tangent and normal geometry, introduces the Lagrangian and regularity, classifies candidates, checks SLSQP output, and connects multipliers to week 11's global bounds. |

## Continuity and prerequisite sequencing

The shared quadratic from week 6 is now genuinely reused in weeks 8 and 10:

$$
\phi(u,v)=\tfrac32u^2+uv+v^2-5u-5v,\qquad
A=\begin{pmatrix}3&1\\1&2\end{pmatrix},\qquad x_*=(1,2)^T.
$$

Week 8 explains why its Hessian is the same matrix, why its Taylor model is exact and why positive eigenvalues certify strict convexity. Week 10 then makes the same model the reason that one Newton step solves the quadratic problem. The changed midpoint values, eigenvalues and Newton direction agree with this common example.

Week 9 retains one nonlinear objective throughout its search comparisons. Week 10's two nonlinear examples have distinct purposes: the double well exposes ascent towards a saddle; the curved valley shows that a positive definite Hessian does not justify an unrestricted full step. Week 11 keeps one production model through geometry, duality and sensitivity. Week 12 keeps the circle through tangent geometry, multiple stationary points and the distance problem. These changes and repetitions are mathematically motivated.

Relevant earlier material was checked directly: week 4's projection and residual orthogonality, week 5's symmetric eigenvalue framework, week 6's quadratic energy/gradient/line-search treatment, and week 7's short Hessian bridge. Week 8 no longer relies on that folded week 7 mention to define the Hessian. The week 12 least-squares connection correctly reuses orthogonality without reopening QR or SVD as new material.

## Mathematical checks and corrections

The final notes distinguish necessary conditions from sufficient ones and local statements from global ones. In particular:

- The interior stationary-point and Hessian tests include the required smoothness and definiteness distinctions. Semidefinite singular tests are inconclusive; an indefinite Hessian still excludes extrema even if it also has zero eigenvalues or zero quadratic-form directions.
- Compactness gives attainment under continuity, not a search method or uniqueness. The depth argument now first establishes bounded function values before using a finite infimum.
- Convexity is a property on the whole convex domain. The visible tangent inequality now explains why a stationary point is globally minimal.
- Gradient descent uses the directional derivative to justify sufficiently small steps. Armijo is explained before its first code use. Newton regularisation shifts eigenvalues; damping controls movement along the chosen direction. Local quadratic convergence has a nearby start and the relevant Hessian assumptions, with full steps and inactive regularisation required to recover the pure Newton guarantee.
- The vertex comparison in week 11 is correctly recognised as a global proof for the bounded polygon. The independent dual bound also proves the value 27. Complementary slackness is stated in the optimality setting. The capacity interval and marginal-sign conversion are correct.
- Lagrange stationarity is conditioned on regularity. A tangent is a feasible-curve velocity, not a finite straight feasible displacement. The constrained second-order test states its smoothness assumptions and restricts the quadratic form to the tangent space.
- The week 12 curvature example specifies a unit tangent before giving the value −2. The depth explanation now derives the appearance of the Hessian of the Lagrangian by differentiating a feasible curve twice.
- The final constrained test correctly says that a **semidefinite** tangent form with a nonzero null direction is inconclusive; the broader, incorrect statement about every form with null directions was removed during this review.
- The distance problem's global lower bound, multiplier sign and equality case agree. The nonlinear dual bound is not presented as a general strong-duality theorem.

## Progressive SciPy literacy

The API explanations now form a progression suitable for readers who have not previously used SciPy:

| Week | What the student can now read in the code |
|---|---|
| 8 | NumPy versus SciPy, imports, a callable objective, vector input and scalar output, start vector, gradient callback, `minimize`, selected result fields and independent gradient checks. |
| 9 | The page's shared helper functions; a scalar line objective created with `lambda`; `minimize_scalar`, the bounded interval, `xatol` and the meaning of the returned scalar. |
| 10 | Gradient and Hessian callback shapes, the Armijo helper's contract, `np.linalg.solve`, `jac`/`hess`, BFGS versus Newton-CG, iteration limits and evaluation counters. |
| 11 | Translating a maximisation into `linprog`, one matrix row per inequality, bounds, status before reading results, slack and the sign of marginal values. |
| 12 | `SLSQP`, the equality-constraint dictionary, objective and constraint gradients, options, status and separately computed feasibility/stationarity residuals. |

Every routine has a compact reference in the notes. Tolerances and success flags are consistently treated as algorithmic stopping information, not mathematical guarantees. The notes explain hidden setup helpers at their meaningful use rather than assuming their names are familiar. Method-option semantics for the final week 9–10 references were checked by the responsible writer against official SciPy documentation.

## Scope and verification record

- Reviewed all five lecture includes, their setup includes and page wrappers. Projects were excluded from this substantive review; the coordinating author reports only removal of draft labels from project titles, with project content unchanged.
- All five lecture pages are free of source sections, external source links, calendar placement, draft labels and timed lecture plans. Internal source mapping may remain internal.
- The five files retain 20 assessment exercises, four per week, with no authored hint or solution blocks. The question data and exact answer contracts remain consistent with the notes.
- All 23 visible executable lecture cells remain `pyodide-python`; the five setup cells also use that runtime. No alternative student execution workflow was introduced.
- Details blocks are balanced in all five includes, and `git diff --check` passes after the final corrections.
- This review checked mathematics and code/prose consistency directly and did not rerun all previously validated code. The coordinating author reports that all 28 lecture/setup cells pass native execution, the full render passes, links resolve on all five pages, and exercise contracts are unchanged. Targeted browser checks of the changed quadratic examples and new reference layouts were underway when this report was completed; this review does not claim a new complete browser-runtime test.

The final required findings have been corrected and re-read. No further content change is requested by this review.

## Addendum: algorithm-path figures

The later request for week-6-style geometric illustrations was reviewed separately, limited to the additions in `week9-gradient-steps`, `week10-backtrack-positive-hess` and `week12-slsqp-path`, the callback change supporting the last figure, and their surrounding explanation. Source, algebra and fresh native PNG captures were inspected; unrelated material was not retested.

- **Week 9:** The contour map and vertically stacked objective-value graph use the same stored iterates. The start and known global minimiser are identified. The divergent large fixed-step path is deliberately omitted from the map and explicitly explained; its rapidly increasing objective values remain visible below. The discussion connects level-curve geometry, changing gradient direction and the separate choice of step length.
- **Week 10:** The true-objective contour map honestly shows full Newton taking `(0,0) → (1,0) → (1,1)`, with an initial objective increase, alongside five damped steps. The lower graph separates the first quadratic model `(1−α)²` from the actual objective `(1−α)²+10α⁴`. The text distinguishes the model's proposed minimiser from the accepted damped point and explains why curvature and damping address different decisions. The relocated annotations are readable and distinguish the first steps.
- **Week 12:** Callback iterates are copied and plotted with the start, returned solution, exact closest point, feasible circle and objective contours. The explanation correctly says that intermediate iterates may be infeasible and may have objective values below the feasible optimum. Straight connecting segments are explicitly presented as an indication of order, not a feasible curve. The plot gives a concrete reason to check feasibility separately from objective value.

The initial week 12 capture clipped the external legend. The coordinating author added layout adjustment, and the fresh capture shows all six legend entries completely. The fresh week 10 capture also confirms the improved annotation placement. No remaining mathematical or visual blocker was found in these additions.

These additions preserve the prior package verdict. There are now 24 visible lecture Python cells plus five setup cells; the additional cell is the week 12 path plot. The coordinating author reports that final native execution of the changed weeks 9, 10 and 12 passes. The exercise contracts and project content are unaffected.
