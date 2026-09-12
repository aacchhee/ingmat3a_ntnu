// Exercise the embedded figure's callbacks without a browser renderer.
// Run: node scripts/check_week5_figure.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, '../_includes/linalg/uke5.md'), 'utf8');
const code = source.match(/```\{\.jsxgraph[^\n]*\}\n([\s\S]*?)\n```/)[1];
const buttons = new Map();
const texts = [];
const board = {
  update() {},
  create(type, args) {
    if (type === 'button') buttons.set(args[2], args[3]);
    if (type === 'text') texts.push(args[2]);
    if (type === 'glider') return {
      xy: args.slice(0, 2), handlers: {},
      X() { return this.xy[0]; }, Y() { return this.xy[1]; },
      moveTo(xy) { this.xy = xy; },
      on(name, fn) { this.handlers[name] = fn; }
    };
    return {};
  }
};
const context = vm.createContext({JXG: {JSXGraph: {initBoard: () => board}}, BOARDID: 'test'});
vm.runInContext(code, context);
const click = label => { assert(buttons.has(label)); buttons.get(label)(); };
const close = (actual, expected) => assert(Math.abs(actual - expected) < 1e-12);
for (const [label, expected] of [
  ['(0, 1)', [0, 1]], ['(1, −0.9)', [1/Math.hypot(1,.9), -.9/Math.hypot(1,.9)]],
  ['(1, 0)', [1, 0]], ['(−1, 0)', [-1, 0]],
  ['(1, 1)', [Math.SQRT1_2, Math.SQRT1_2]],
  ['(1, −1)', [Math.SQRT1_2, -Math.SQRT1_2]]
]) {
  click(label);
  assert.equal(context.count, 0);
  expected.forEach((value, i) => close(context.current[i], value));
  assert(texts[0]().includes('A<sup>0</sup>'));
  click('Ett steg');
  assert.equal(context.count, 1);
  close(Math.hypot(...context.current), 1);
}
// The exceptional eigenvector must stay on its own line.
close(context.current[0], Math.SQRT1_2);
close(context.current[1], -Math.SQRT1_2);
click('(1, 0)');
for (let k = 0; k < 15; k++) click('Ett steg');
assert.equal(texts[0](), 'A<sup>15</sup>x<sub>0</sub>');
assert(texts.some(t => typeof t === 'function' && t().includes('x<sub>15</sub> = A<sup>15</sup>')));
const unscaled = [(3**15 + 1)/2, (3**15 - 1)/2];
unscaled.forEach((value, i) => close(context.current[i], value / Math.hypot(...unscaled)));
click('Start på nytt');
assert.equal(context.count, 0);
context.start.moveTo([0, 1]);
context.start.handlers.drag();
close(context.current[0], 0); close(context.current[1], 1);
assert.equal(context.count, 0);
console.log('Week 5 figure: presets, normalization, 15-step formula, reset and drag passed.');
