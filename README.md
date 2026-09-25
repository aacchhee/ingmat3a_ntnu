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

Install Quarto and the extensions required by `_quarto.yml`, then run:

```bash
quarto preview
```

The Python cells use Pyodide and run in the browser. Cells on one page share a Python environment; different pages do not. Each teaching page therefore includes a hidden setup cell with the definitions that its examples require.

## Automatic exercise feedback

The `math-exercise` and `py-exercise` extensions provide optional model-generated feedback. Students configure the endpoint, model, and API key from the feedback settings in the rendered page. The student-facing setup and usage guide is on the IDE page.

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
