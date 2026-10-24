# Engineering Mathematics 3A at NTNU

[Open the course website](https://aacchhee.github.io/ingmat3a_ntnu/). Python examples and interactive exercises run directly in your browser; no local installation is needed.

Course notes for IMAX3011 at NTNU, written in Norwegian for engineering students. The material covers numerical methods, linear algebra and optimisation, combining explanations, Python experiments and interactive mathematics exercises.

## Author and license

**Author:** Andrey Chesnokov, NTNU — [andrey.chesnokov@ntnu.no](mailto:andrey.chesnokov@ntnu.no).

Thanks to Jonas Harang, Elias Sandal and Ute Schaarschmidt for ideas and suggestions that have helped improve these pages.

Thanks also to the [Erasmus-CTM team](https://github.com/Erasmus-CTM) and especially to Michael Kallweit for their collaboration on digital tools and teaching resources. The author is happy to be part of this team.

This work has been partially supported by the Erasmus+ project “Computational Thinking makes sense of Mathematics” (project no. 2023-1-NO01-KA220-HED-000166744).

Unless otherwise indicated, the original material in this repository and on
the course website, including text, figures, exercises and code, is licensed
under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/deed.en).
The full license text is in [LICENSE](LICENSE).

Third-party material and dependencies retain their own attribution and licenses.

## Page structure

Files in `pages/` are deliberately small assembly files. They contain the page title, the page-level setup include, and the ordered content includes. The teaching material lives in `_includes/`:

```text
pages/page1.qmd          -> _includes/ide/setup.md + manual.md
pages/page2.qmd          -> _includes/module1/setup.md + m1_*.md
pages/page4.qmd          -> _includes/module2/setup.md + m2_*.md
pages/project_week1.qmd  -> _includes/projects/*.md
```

Keep this separation when adding material. Put shared imports and definitions in the relevant `setup.md`, put visible content in a topical include, and use the QMD page as the header/assembly file. Navigation is defined in `_quarto.yml`.

## Local preview

Install Quarto 1.8.27, Git and Python 3.12. Install the
[CTM Assessment](https://github.com/Erasmus-CTM/ctm-assessment) package, which
bundles all interactive components, then preview:

```bash
python -m pip install -r requirements.txt
python scripts/setup.py
quarto preview --profile linalg
```

`quarto-extensions.yml` sets which ctm-assessment branch or commit is
installed. The component commits used are recorded in
`.private-extensions/resolved-repos.json`.

The Python cells use Pyodide and run in the browser. Cells on one page share a Python environment; different pages do not. Each teaching page therefore includes a hidden setup cell with the definitions that its examples require.

## Consolidated course preview

`linalg-branch` uses the coherent CTM Assessment package at immutable commit
`503c8688eaf556ff23af0fc629ca60f71833ea73`, accepted in ctm-demo. The installer
uses that package's component tuple without review overrides. The ordinary
course has no generated variants and requires no teaching-approval workflow.

The existing linear algebra action builds with the `linalg` profile and
publishes only its preview under
[/ingmat3a_ntnu/linalg/](https://aacchhee.github.io/ingmat3a_ntnu/linalg/).
The build has read-only repository access; only the publication job can write
to Pages. It preserves files outside the preview subtree. Student `main` and
its publication action are unchanged; a later publication from that existing
action may replace the preview.

The shared package provides reading/lecture modes, reveals, links into nested
tabs, local saving, page progress, quiz panels and copy/export controls.
The preview uses a separate storage key from the student site. AI feedback
references the visible definitions and givens needed by each question; it does
not send requests during the build or the context checks.

The preview action checks source preservation, rendered AI-context facts and
mocked adapter requests before testing real Python/Check, saving, quizzes,
export, first-visit startup and optional-feature isolation in Chromium. The
published preview then gets a separate first-visit check on its actual URL.
Run the source/context gates locally with:

```bash
python scripts/check-linalg-migration.py
quarto render --profile linalg
python scripts/check_feedback_contexts.py --site _site
npm ci --ignore-scripts
npx playwright install chromium
npm run test:contexts
npm run test:linalg
```

`scripts/check-linalg-grading-parity.cjs` additionally compares a rendered
old-package baseline with the new site. It rejects changes to grading, teacher
answers, tests and input/matrix configuration while validating the new save
metadata with the accepted package's own comparison tool.

## Automatic exercise feedback

The shared `ai-feedback` component of CTM Assessment provides optional model-generated feedback for mathematics exercises and Python cells. Python exercises (`py-exercise`) are graded by their tests and have no AI feedback. Students configure the endpoint, model, and API key from the feedback settings in the rendered page. The student-facing setup and usage guide is on the IDE page.

### Levelled mathematics feedback

Mathematics feedback is progressive. It should respond to the submitted answer and preserve productive struggle instead of immediately displaying the solution.

| Attempt | Intended response | Must avoid |
|---:|---|---|
| 1 | Acknowledge correct work and ask one diagnostic question or give a small hint | Formula, substituted values, multi-step method, or answer |
| 2 | Acknowledge progress and give a larger conceptual hint | Task-specific calculation or answer |
| 3 | Give a structured procedure and identify the next useful step | Completing the arithmetic or stating the final answer |
| 4+ | Give a complete, checked worked solution | Unsupported assumptions or invented notation |

This sequence is part of the feedback prompt, not a guarantee that every model will behave perfectly. Exercise context should therefore be precise enough to constrain the model, and model output should still be treated as fallible.

## Errors and suggestions

To report an error or suggest an improvement, [open a GitHub issue](https://github.com/aacchhee/ingmat3a_ntnu/issues) with a link to the relevant page and a short description.
