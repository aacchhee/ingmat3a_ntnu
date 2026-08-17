# Matplotlib + Pyodide Style Guide

This project runs Matplotlib inside **Pyodide** (browser-based Python).
Because all cells share the same interpreter, strict rules apply.

## Global setup (handled automatically)
The Matplotlib backend is set once in JavaScript:
```
matplotlib.use("module://matplotlib_pyodide.html5_canvas_backend")
```

## Required pattern for every plot

```python
import matplotlib.pyplot as plt
plt.close("all")

fig, ax = plt.subplots(...)
ax.plot(...)

plt.show()
```

## Rules (DO NOT BREAK)

1. ❌ Never call `plt.figure()` if you also use `plt.subplots()`
2. ❌ Never rely on implicit pyplot state
3. ❌ Never omit `plt.close("all")`
4. ❌ Never use `plt.show()` more than once per cell
5. ✅ Exactly ONE figure per cell

## Symptoms of violation

| Symptom | Cause |
|------|------|
| Two canvases | `plt.figure()` + `plt.subplots()` |
| Old plot appears | Missing `plt.close("all")` |
| `Figure(600x400)` text | Wrong backend or missing `plt.show()` |

## Copy-paste template

```python
import matplotlib.pyplot as plt
plt.close("all")

fig, ax = plt.subplots(figsize=(6,4))
ax.plot(x, y)

plt.show()
```