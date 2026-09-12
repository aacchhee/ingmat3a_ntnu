// Numerical and semantic-DOM regression checks; no dependencies or renderer.
// Run: node scripts/check_week5_figure.cjs
// This small DOM double does not validate CSS layout, pointer hit testing or SVG.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, '../_includes/linalg/uke5.md'), 'utf8');
const code = source.match(/```\{\.jsxgraph[^\n]*\}\n([\s\S]*?)\n```/)[1];
class Element {
  constructor(tag) { this.tagName = tag; this.children = []; this.attrs = {}; this.handlers = {}; }
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return this.attrs[k]; }
  set className(value) { this.attrs.class = value; }
  get className() { return this.attrs.class || ''; }
  appendChild(node) {
    if (node.parentNode) node.parentNode.children = node.parentNode.children.filter(n => n !== node);
    this.children.push(node); node.parentNode = this; return node;
  }
  insertBefore(node, sibling) {
    this.children.splice(this.children.indexOf(sibling), 0, node); node.parentNode = this;
  }
  querySelector(selector) {
    for (const child of this.children) {
      if (selector.startsWith('.') ? child.className.split(' ').includes(selector.slice(1)) : child.tagName === selector) return child;
      const nested = child.querySelector(selector); if (nested) return nested;
    }
    return null;
  }
  addEventListener(name, fn) { this.handlers[name] = fn; }
  click() { this.handlers.click(); }
  set innerHTML(html) {
    this.html = html; this.children = [];
    const stack = [this];
    for (const token of html.match(/<[^>]+>|[^<]+/g) || []) {
      if (token.startsWith('</')) { stack.pop(); continue; }
      if (!token.startsWith('<')) continue;
      const el = new Element(token.match(/^<([\w-]+)/)[1]);
      for (const [, key, value] of token.matchAll(/([\w-]+)="([^"]*)"/g)) el.setAttribute(key, value);
      stack[stack.length - 1].appendChild(el); stack.push(el);
    }
  }
  get innerHTML() { return this.html; }
}
const document = new Element('document');
document.documentElement = new Element('html');
document.head = new Element('head'); document.appendChild(document.head);
const body = document.appendChild(new Element('body'));
const graph = body.appendChild(new Element('div')); graph.className = 'jxgbox';
graph.clientWidth = 600; graph.clientHeight = 380;
document.createElement = tag => new Element(tag);
let boardOptions, resizeCallback;
const created = [], resizes = [];
const board = {
  update() {}, fullUpdate() {}, setBoundingBox(bounds, aspect) { assert.equal(aspect, true); },
  resizeContainer(...args) { resizes.push(args); },
  create(type, args, options) {
    created.push({type, args, options});
    assert(!['button', 'text'].includes(type), 'Controls/readouts must not use board coordinates');
    if (type === 'glider') return {
      xy: args.slice(0, 2), handlers: {},
      X() { return this.xy[0]; }, Y() { return this.xy[1]; },
      moveTo(xy) { this.xy = xy; }, on(name, fn) { this.handlers[name] = fn; }
    };
    return {};
  }
};
const context = vm.createContext({
  document, window: {addEventListener() {}}, BOARDID: 'test',
  ResizeObserver: class { constructor(callback) { resizeCallback = callback; } observe(el) { assert.equal(el, graph); } },
  JXG: {JSXGraph: {initBoard: (id, options) => { boardOptions = options; return board; }}}
});
vm.runInContext(code, context);
const presets = context.presetButtons;
const buttons = new Map(presets.map(button => [button.textContent, button]));
buttons.set('Ett steg', document.querySelector('.week5-main-step'));
buttons.set('Tilbake til start', document.querySelector('.week5-reset'));
const click = label => { assert(buttons.has(label)); buttons.get(label).click(); };
const close = (actual, expected) => assert(Math.abs(actual - expected) < 1e-12);
assert.equal(document.documentElement.lang, 'nb');
assert.equal(graph.parentNode.className, 'week5-graph-slot');
assert.equal(document.querySelector('.week5-formula').parentNode.getAttribute('aria-live'), 'polite');
assert.equal(boardOptions.pan.enabled, false); assert.equal(boardOptions.zoom.enabled, false);
const ring = created.find(item => item.type === 'glider').options;
const endpoint = created.find(item => item.type === 'point' && item.options.size === 3).options;
assert(ring.size > endpoint.size && ring.layer > endpoint.layer);
assert.equal(ring.fillOpacity, 0);
assert.equal(presets.filter(button => button.getAttribute('aria-pressed') === 'true').length, 1);
for (const [label, expected] of [
  ['(0, 1)', [0, 1]], ['(1, −0.9)', [1/Math.hypot(1,.9), -.9/Math.hypot(1,.9)]],
  ['(1, 0)', [1, 0]], ['(−1, 0)', [-1, 0]],
  ['(1, 1)', [Math.SQRT1_2, Math.SQRT1_2]],
  ['(1, −1)', [Math.SQRT1_2, -Math.SQRT1_2]]
]) {
  click(label);
  assert.equal(context.count, 0);
  expected.forEach((value, i) => close(context.current[i], value));
  assert.equal(buttons.get(label).getAttribute('aria-pressed'), 'true');
  assert.equal(presets.filter(button => button.getAttribute('aria-pressed') === 'true').length, 1);
  assert(context.formula.innerHTML.includes('A<sup>0</sup>'));
  click('Ett steg');
  assert.equal(context.count, 1); close(Math.hypot(...context.current), 1);
}
close(context.current[0], Math.SQRT1_2); close(context.current[1], -Math.SQRT1_2);
click('(1, 0)');
for (let k = 0; k < 15; k++) click('Ett steg');
assert(context.formula.innerHTML.includes('x<sub>15</sub> = A<sup>15</sup>'));
assert(context.formula.innerHTML.includes('/ ‖A<sup>15</sup>x<sub>0</sub>‖<sub>2</sub>'));
assert(context.coordinates.textContent.startsWith('Steg 15'));
const unscaled = [(3**15 + 1)/2, (3**15 - 1)/2];
unscaled.forEach((value, i) => close(context.current[i], value / Math.hypot(...unscaled)));
click('Tilbake til start');
assert.equal(context.count, 0); close(context.current[0], 1); close(context.current[1], 0);
assert.equal(buttons.get('(1, 0)').getAttribute('aria-pressed'), 'true');
context.start.moveTo([-1e-8, Math.sqrt(1-1e-16)]); context.start.handlers.drag();
assert.equal(context.count, 0); close(context.current[0], -1e-8);
assert(presets.every(button => button.getAttribute('aria-pressed') === 'false'));
assert(!context.coordinates.textContent.includes('-0.000'));
assert(context.startKey.textContent.includes('Egen start'));
assert(!context.startKey.textContent.includes('-0.000'));
click('Ett steg'); click('Tilbake til start'); close(context.current[0], -1e-8);
const beforeHidden = resizes.length;
graph.clientWidth = 0; graph.clientHeight = 0; resizeCallback();
assert.equal(resizes.length, beforeHidden);
graph.clientWidth = 280; graph.clientHeight = 350; resizeCallback();
assert.deepEqual(resizes.at(-1), [280, 350, true]);
console.log('Week 5 figure: six presets, normalization, formula, reset/drag, semantic controls, ring layering and hidden-tab resize passed.');
