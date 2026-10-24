#!/usr/bin/env node
/**
 * Compare decoded grading/input payloads across a course package migration.
 * Requires jsdom 26.1.0; does not execute course scripts or contact the network.
 *
 * node scripts/check-linalg-grading-parity.cjs --before OLD_SITE --after NEW_SITE \
 *   --tooling ACCEPTED_CTM_ASSESSMENT_CHECKOUT --report parity-summary.json
 *
 * The accepted tooling's real store validator authenticates new save metadata.
 * Everything outside the explicit UI/context additions is compared strictly,
 * including unknown attributes/config fields, teacher answers, custom checkers,
 * partial credit, matrix shapes, Python starters/tests and legacy pool tasks.
 * This proves configuration preservation, not all-response runtime equivalence.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const assert = require('node:assert/strict');
const {JSDOM} = require('jsdom');

const STRUCTURED = new Set(['data-checker', 'data-packages', 'data-field-labels',
  'data-fields', 'data-structural-field-labels', 'data-pool', 'data-variants',
  'data-storage-variants']);
const MATH_UI = new Set(['data-context-mode',
  'data-context-refs', 'data-context', 'data-context-text', 'data-variant-boards',
  'data-variant-board-title', 'data-storage-variants', 'data-ctm-save',
  'data-ctm-id', 'data-ctm-runtime-id', 'data-ctm-component', 'data-ctm-source']);
const PYTHON_UI = new Set(['save', 'source', 'storeId']);
const INPUTS = 'input,select,textarea,[data-answer],[data-matrix-name],'
  + '[data-dynamic-matrix-name],[data-matrix-row],[data-dynamic-axis]';

function options(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 2) {
    assert(['--before', '--after', '--tooling', '--report'].includes(argv[i])
      && argv[i + 1], 'Unknown or incomplete argument: ' + argv[i]);
    result[argv[i].slice(2)] = path.resolve(argv[i + 1]);
  }
  assert(result.before && result.after && result.tooling,
    'Use --before OLD_SITE --after NEW_SITE --tooling ACCEPTED_ASSESSMENT');
  return result;
}
function sorted(value) {
  return Array.isArray(value) ? value.map(sorted) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])])) : value;
}
const json = value => JSON.stringify(sorted(value));
function attributes(element) {
  return Object.fromEntries([...element.attributes].map(attribute => [attribute.name,
    STRUCTURED.has(attribute.name) ? JSON.parse(attribute.value) : attribute.value]));
}
function pages(root) {
  return fs.readdirSync(root, {recursive: true}).map(String).filter(name =>
    name.endsWith('.html') && !name.split(path.sep).some(part =>
      part === 'site_libs' || part.endsWith('_files'))).sort();
}
function normalizedURL(url) {
  return url.split('?')[0].replace(/(?:^|.*\/)(?:site_libs\/|[^/]*_files\/libs\/)/, '')
    .replace(/quarto-contrib\/([\w-]+?)-\d+\.\d+\.\d+[^/]*\//, '$1/');
}
function extract(root, name) {
  const file = path.join(root, name);
  const doc = new JSDOM(fs.readFileSync(file, 'utf8')).window.document;
  const math = {}, py = {}, sources = {}, configs = {}, files = [];
  for (const link of doc.querySelectorAll('link[rel="stylesheet"]')) files.push('css ' + normalizedURL(link.getAttribute('href')));
  for (const script of doc.scripts) {
    const src = script.getAttribute('src');
    if (src) {
      sources[normalizedURL(src)] = path.resolve(path.dirname(file), src.split('?')[0]);
      files.push('script ' + normalizedURL(src));
      continue;
    }
    const text = script.textContent.trim();
    let match = /^\(window\.__pyExercises = window\.__pyExercises \|\| \[\]\)\.push\(([\s\S]*)\);?\s*$/.exec(text);
    if (match) {
      const value = JSON.parse(match[1]);
      assert(value.label && !py[value.label], name + ': duplicate/missing Python label');
      const index = (configs.__pyExercises ||= []).length;
      py[value.label] = {value, index};
      configs.__pyExercises.push(value);
      continue;
    }
    // Decode generated literal cell data without executing page scripts.
    match = /^globalThis\.qpyodideCellDetails = (\[.*\]);$/m.exec(text);
    if (match) (configs.qpyodideCellDetails ||= []).push(...JSON.parse(match[1]));
    const settings = /globalThis\.qpyodideLocalStorageOptions\s*=\s*\{[\s\S]*?^\};/m.exec(text);
    if (settings) {
      const epoch = /\bepoch:\s*("(?:[^"\\]|\\.)*")/.exec(settings[0]);
      assert(epoch, name + ': unsupported saved-code epoch literal');
      (configs.qpyodideSettings ||= []).push({qpyodideLocalStorageOptions: {epoch: JSON.parse(epoch[1])}});
    }
  }
  for (const cell of doc.querySelectorAll('.math-exercise-cell')) {
    const label = cell.dataset.label;
    assert(label && !math[label], name + ': duplicate/missing math label');
    const inputs = [...cell.querySelectorAll(INPUTS)].map(element => ({
      tag: element.tagName, attrs: attributes(element),
      ...(element.tagName === 'SELECT' ? {options: [...element.options].map(option =>
        ({attrs: attributes(option), text: option.textContent}))} : {}),
      ...(element.tagName === 'TEXTAREA' ? {text: element.textContent} : {})
    }));
    const wrappers = [...cell.querySelectorAll('[data-math-exercise-source],.math-exercise-question')]
      .map(element => ({tag: element.tagName, attrs: attributes(element)}));
    math[label] = {attrs: attributes(cell), inputs, wrappers, node: cell};
  }
  return {math, py, doc, sources, configs, files};
}

async function compare(opts) {
  const sharedFile = path.join(opts.tooling, 'tools/compare-rendered/store.mjs');
  const {markStoreAdditions} = await import(pathToFileURL(sharedFile).href);
  assert.deepEqual(pages(opts.after), pages(opts.before), 'Rendered page set changed');
  const errors = [], ui = {}, counts = {htmlFiles: pages(opts.before).length,
    mathExercises: 0, pythonExercises: 0, inputMatrixNodes: 0, legacyVariantPools: 0};
  const note = key => { ui[key] = (ui[key] || 0) + 1; };
  for (const name of pages(opts.before)) {
    const before = extract(opts.before, name), after = extract(opts.after, name);
    const storeItems = [];
    for (const label of Object.keys(before.math)) {
      const a = before.math[label], b = after.math[label];
      if (!b) continue;
      for (const key of Object.keys(b.attrs)) if (a.attrs[key] === undefined
        && (key.startsWith('data-ctm-') || key === 'data-storage-variants')) {
        storeItems.push({area: 'dom', change: 'attribute added', attribute: key,
          before: null, after: b.node.getAttribute(key), node: b.node, label, field: key});
      }
    }
    for (const label of Object.keys(before.py)) {
      const a = before.py[label], b = after.py[label];
      if (!b) continue;
      for (const key of PYTHON_UI) if (a.value[key] === undefined && b.value[key] !== undefined) {
        storeItems.push({area: 'config', object: '__pyExercises', change: 'changed',
          path: '/' + b.index + '/' + key, before: undefined, after: b.value[key],
          label, field: key});
      }
    }
    markStoreAdditions(after, storeItems);
    const stored = (label, key) => storeItems.some(item => item.label === label
      && item.field === key && ['attribute', 'py-metadata'].includes(item.store));
    for (const [kind, allow] of [['math', MATH_UI], ['py', PYTHON_UI]]) {
      const oldLabels = Object.keys(before[kind]).sort(), newLabels = Object.keys(after[kind]).sort();
      if (json(oldLabels) !== json(newLabels)) {
        errors.push({page: name, kind, field: 'exercise labels', before: oldLabels, after: newLabels});
        continue;
      }
      for (const label of oldLabels) {
        const a = before[kind][label], b = after[kind][label];
        counts[kind === 'math' ? 'mathExercises' : 'pythonExercises']++;
        const oldValue = kind === 'math' ? a.attrs : a.value;
        const newValue = kind === 'math' ? b.attrs : b.value;
        if (kind === 'math') {
          counts.inputMatrixNodes += a.inputs.length;
          if ('data-pool' in a.attrs) counts.legacyVariantPools++;
          if (json(a.inputs) !== json(b.inputs)) errors.push({page: name, label,
            kind, field: 'input/matrix DOM', before: a.inputs, after: b.inputs});
          if (a.wrappers.length !== b.wrappers.length) errors.push({page: name,
            label, kind, field: 'question/caption wrapper count'});
          else for (let i = 0; i < a.wrappers.length; i++) {
            const oldWrapper = a.wrappers[i], newWrapper = b.wrappers[i];
            if (json(oldWrapper) === json(newWrapper)) continue;
            const left = {...oldWrapper.attrs}, right = {...newWrapper.attrs};
            if (left.class === 'math-exercise-question' && !('id' in left)
              && right.id === label + '-question'
              && ['math-exercise-question math-exercise-context',
                'math-exercise-question ai-feedback-context'].includes(right.class)) {
              delete right.id;
              right.class = left.class;
              note('math:question-context-id-class');
            }
            if (oldWrapper.tag !== newWrapper.tag || json(left) !== json(right)) {
              errors.push({page: name, label, kind, field: 'question/caption source',
                before: oldWrapper, after: newWrapper});
            }
          }
        }
        for (const key of new Set([...Object.keys(oldValue), ...Object.keys(newValue)])) {
          if (json(oldValue[key]) === json(newValue[key])) continue;
          if (allow.has(key)) {
            const saveField = kind === 'py' || key.startsWith('data-ctm-') || key === 'data-storage-variants';
            if (!saveField || (oldValue[key] === undefined && stored(label, key))) {
              note(kind + ':' + key);
              continue;
            }
          }
          errors.push({page: name, label, kind, field: key,
            before: oldValue[key], after: newValue[key]});
        }
      }
    }
  }
  assert(counts.mathExercises > 0 && counts.pythonExercises > 0,
    'Both math and Python grading payloads must be present for this course comparison');
  return {passed: errors.length === 0, before: opts.before, after: opts.after,
    counts, sharedStoreValidator: sharedFile, uiOnlyDifferences: ui,
    gradingOrInputDifferences: errors};
}

(async () => {
  const opts = options(process.argv.slice(2));
  const report = await compare(opts);
  if (opts.report) fs.writeFileSync(opts.report, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({passed: report.passed, counts: report.counts,
    uiOnlyDifferences: report.uiOnlyDifferences,
    gradingOrInputDifferenceCount: report.gradingOrInputDifferences.length,
    firstDifferences: report.gradingOrInputDifferences.slice(0, 5).map(item =>
      ({page: item.page, label: item.label, kind: item.kind, field: item.field}))}));
  if (!report.passed) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 2; });
