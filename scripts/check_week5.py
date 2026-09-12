"""Execute the week 5 lecture cells and check the project's numerical fixtures.

Run with Python, NumPy and Matplotlib installed. No browser is required.
The unfinished student project functions are syntax-checked, not executed.
"""
from pathlib import Path
import ast
import re

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
LECTURE = ROOT / "_includes/linalg/uke5.md"
PROJECT = ROOT / "_includes/projects/week5_pagerank.md"
PATTERN = r"```\{pyodide-python\}\n(.*?)```"


def main():
    namespace = {}
    for index, cell in enumerate(re.findall(PATTERN, LECTURE.read_text(), re.S)):
        exec(compile(cell, f"week5-cell-{index}", "exec"), namespace)
        plt.close("all")
    for cell in re.findall(PATTERN, PROJECT.read_text(), re.S):
        ast.parse(cell)

    power = namespace["power_iteration"]
    _, rho, history, status = power(np.diag([3., 1.]), [0., 1.])
    assert rho == 1 and history[-1, 1] == 0, "Residual must accept a non-dominant eigenpair"
    _, rho, _, status = power(np.diag([-3., 1.]), [1., 1.])
    assert np.isclose(rho, -3) and status == "liten egenresidual"
    _, _, _, status = power(np.diag([1., -1.]), [1., 1.], max_steps=30)
    assert status == "maksimalt antall steg"

    # Check the hand calculations preserved under Arbeid videre.
    A = np.array([[2., 1.], [1., 2.]])
    x = np.array([2., 1.]) / np.sqrt(5)
    rho = x @ A @ x
    residual = A @ x - rho*x
    assert np.isclose(rho, 14/5)
    assert np.allclose(residual, np.array([-3., 6.]) / (5*np.sqrt(5)))
    assert np.isclose(np.linalg.norm(residual), 3/5)
    assert (2.9/3)**135 >= 1e-2 and (2.9/3)**136 < 1e-2
    for k, expected in [(1, [2, 1]), (2, [5, 4]), (3, [14, 13])]:
        assert np.allclose(np.linalg.matrix_power(A, k) @ [1, 0], expected)

    # The explicit perturbation experiment separates exact and near-exact starts.
    for epsilon in [0., 1e-12]:
        x = np.array([epsilon, 1.])
        for _ in range(30):
            x = np.diag([3., 1.]) @ x
            x /= np.linalg.norm(x)
        expected = np.array([3.**30*epsilon, 1.])
        assert np.allclose(x, expected/np.linalg.norm(expected))

    # Independent fixture for the six-page project graph.
    S = np.array([[0, 0, 1, 0, 0, 0],
                  [.5, 0, 0, 0, 0, 0],
                  [.5, .5, 0, .5, 0, 0],
                  [0, .5, 0, 0, 0, 1],
                  [0, 0, 0, .5, 0, 0],
                  [0, 0, 0, 0, 1, 0]])
    u = np.ones(6) / 6
    assert np.allclose(S @ u, [1/6, 1/12, 1/4, 1/4, 1/12, 1/6])
    for alpha in [.5, .85, .95, .99]:
        G = alpha*S + (1-alpha)*np.outer(u, np.ones(6))
        ref = np.linalg.solve(np.eye(6)-alpha*S, (1-alpha)*u)
        p = u.copy()
        for _ in range(10000):
            residual = np.linalg.norm(G @ p-p, 1)
            if residual <= (1-alpha)*1e-8:
                break
            p = G @ p
        else:
            raise AssertionError("Suggested project iteration budget is insufficient")
        assert np.linalg.norm(p-ref, 1) <= 1e-8
        assert np.isclose(p.sum(), 1) and p.min() > 0

    # Distinguish uniqueness from convergence in the two-page example.
    swap = np.array([[0., 1.], [1., 0.]])
    assert np.allclose(swap @ np.array([1., 0.]), [0., 1.])
    for alpha in [.5, .85, .99]:
        G = alpha*swap + (1-alpha)*np.ones((2, 2))/2
        assert np.allclose(np.sort(np.linalg.eigvals(G)), [-alpha, 1])
    print("Week 5 lecture cells, project syntax, and numerical fixtures passed.")


if __name__ == "__main__":
    main()
