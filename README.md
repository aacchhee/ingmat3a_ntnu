# Engineering Mathematics 3A at NTNU

Quarto course notes for IMAX3011. The website combines explanatory text, browser-based Python exercises, and interactive mathematics exercises.

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

### Writing useful exercise context

The model can only reason reliably from the exercise, the student's submitted fields and correctness state, and the context supplied to it. For non-standard notation, local conventions, special algorithms, or simplified mathematical models, define the relevant facts explicitly in named context blocks and reference them from the exercise.

````markdown
::: {#mini-machine-format .math-exercise-context}

The word has one sign bit, three exponent bits, and four mantissa bits.
The exponent bias is 3. State the interpretation formula and all exclusions.

:::

::: {#mini-machine-decode-method .math-exercise-context}

Describe the course's decoding method and one representative example.

:::

```{math-exercise}
#| label: mini-decode
#| context: mini-machine-format, mini-machine-decode-method

Exercise content here.
```
````

Use context blocks to state:

- definitions and exact notation;
- dimensions, domains, units, field widths, biases, and other fixed constraints;
- the method taught in the course;
- assumptions and excluded cases;
- one compact example when it clarifies the method.

Do not rely on automatic context assessment for facts that are essential to solving the problem. Explicit `context:` references prevent a nearby but irrelevant passage from replacing the required definition. Keep each block focused and reusable: separate the mathematical format from a decoding, encoding, rounding, or proof method when exercises need different subsets.

### Prompt and context principles

The feedback prompt should be general enough for the majority of mathematics exercises while enforcing a few hard rules:

- use only facts supported by the exercise and referenced context;
- inspect the student's actual answer before choosing a hint;
- mention what is mathematically correct or promising, not internal grading metadata;
- never expose raw phrases such as “field 1 is marked incorrect” to the student;
- do not infer a field's meaning from its position when a label is available;
- do not invent dimensions, bit widths, constants, formulas, or assumptions;
- preserve the attempt-level boundary, especially the distinction between procedure on attempt 3 and a worked solution on attempt 4;
- return student-facing Markdown only, without reasoning tags such as `<think>` and without `null` placeholders.

The renderer should also sanitize common model artefacts, but output cleanup is a safety net rather than a substitute for accurate context and a clear prompt.

### Labelling answer fields

For exercises with several inputs, provide semantic field labels in the same order as the blanks:

````markdown
```{math-exercise}
#| mode: string
#| field-labels: S, E, M

$S=$ _[0] &nbsp; $E=$ _[100] &nbsp; $M=$ _[1000]
```
````

Labels let feedback say, for example, that the sign choice is consistent while the exponent needs another look. Without labels, older exercises still work, but the model receives generic field identifiers and should avoid guessing what they represent. Add labels whenever multiple blanks have distinct mathematical roles.

### Author checklist

Before publishing an AI-assisted exercise:

1. Check the exercise without requesting feedback.
2. Test a partially correct answer as well as a completely incorrect one.
3. Request feedback on attempts 1–4 and confirm the solution appears only at level 4.
4. Verify that every fixed convention used by the solution is in explicitly referenced context.
5. Test the configured models; smaller models may require tighter context.
6. Confirm that formulas render and that no reasoning tags, raw grading metadata, or `null` text reaches the page.

## Contributing

Open an issue with the page, exercise label, reproduction steps, browser, and a screenshot when relevant. Pull requests should keep page assembly files small and place substantial course content under `_includes/`.
