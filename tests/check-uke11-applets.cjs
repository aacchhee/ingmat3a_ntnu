// Course regression only; consumes actual generated iframe HTML. AGPL-3.0-or-later.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {createRequire} = require('node:module');

const root = path.resolve(process.env.CTM_APPLET_ROOT || '.');
const foundation = path.resolve(process.env.CTM_ASSESSMENT_ROOT || '_ci/ctm-assessment');
const requireFoundation = createRequire(path.join(foundation, 'package.json'));
const playwright = requireFoundation('playwright');
assert.equal(requireFoundation('playwright/package.json').version, '1.55.1');
const jsxgraph = path.resolve(process.env.CTM_JSXGRAPH_ROOT);
assert.equal(JSON.parse(fs.readFileSync(path.join(jsxgraph, 'package.json'))).version, '1.14.1');
const site = path.resolve(process.env.CTM_APPLET_SITE);
const reports = path.resolve(process.env.CTM_APPLET_REPORTS || 'applet-reports');
fs.mkdirSync(reports, {recursive: true});
const baseline = '80c3851dd20326c039c0060ae3ada4fc97d1f9b1';
const sourcePath = '_includes/optimization/uke11.md';
const oldSource = execFileSync('git', ['show', baseline + ':' + sourcePath], {cwd: root, encoding: 'utf8'});
const newSource = fs.readFileSync(path.join(root, sourcePath), 'utf8');
function programs(text) {
  return [...text.matchAll(/```\{\.jsxgraph[^\n]*\}\n([\s\S]*?)\n```/g)]
    .map(m => m[1]).filter(s => s.includes('function best()'));
}
const oldPrograms = programs(oldSource), newPrograms = programs(newSource);
assert.equal(oldPrograms.length, 2); assert.equal(newPrograms.length, 2);
let recovered = newSource;
for (let i = 0; i < 2; i++) {
  assert.ok(newPrograms[i].includes(oldPrograms[i]), 'original authored program retained');
  recovered = recovered.replace(newPrograms[i], oldPrograms[i]);
}
assert.equal(recovered, oldSource, 'all original source bytes retained outside the two wrappers');
const html = fs.readFileSync(path.join(site, 'pages/uke11.html'), 'utf8');
const frames = [...html.matchAll(/<iframe[^>]+src="(data:text\/html;base64,[^"]+)"/g)]
  .map(m => Buffer.from(m[1].split(',')[1], 'base64').toString('utf8'))
  .filter(s => s.includes('function best()'));
assert.equal(frames.length, 2, 'actual renderer produced both applets');
const observations = [];
let browser, page;
function writeReport(failure) {
  fs.writeFileSync(path.join(reports, 'uke11-applets.json'), JSON.stringify({
    baseline, course: process.env.CTM_COURSE_SHA || null,
    assessment: process.env.CTM_ASSESSMENT_REF || null,
    playwright: '1.55.1', jsxgraph: '1.14.1', failure, observations
  }, null, 2));
}
(async () => {
  for (const engine of ['firefox', 'chromium']) {
    browser = await playwright[engine].launch({headless: true});
    for (let index = 0; index < 2; index++) for (const candidate of [false, true]) for (const hidden of [false, true]) {
      const context = await browser.newContext({viewport: {width: 1280, height: 900}});
      page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      // Use the recorded official core and stylesheet, not a runtime implementation copy.
      await page.route('https://cdn.jsdelivr.net/npm/jsxgraph@1/distrib/jsxgraphcore.js', route =>
        route.fulfill({path: path.join(jsxgraph, 'distrib/jsxgraphcore.js'), contentType: 'application/javascript'}));
      await page.route('https://cdn.jsdelivr.net/npm/jsxgraph@1/distrib/jsxgraph.css', route =>
        route.fulfill({path: path.join(jsxgraph, 'distrib/jsxgraph.css'), contentType: 'text/css'}));
      let frameHtml = frames[index];
      const boardId = [...frameHtml.matchAll(/var board = JXG.JSXGraph.initBoard\(([^,]+),/g)].at(-1)[1];
      const compiled = newPrograms[index].replaceAll('BOARDID', boardId);
      const control = oldPrograms[index].replaceAll('BOARDID', boardId);
      assert.ok(frameHtml.includes(compiled), 'actual iframe contains exact compiled candidate source');
      const capture = '\nwindow.__widgetProbe={board:board,c:c,best:best,P:typeof P!=="undefined"?P:null,Z:typeof Z!=="undefined"?Z:null};\n';
      // Capture existing locals after the unchanged body; no calculation or event is replaced.
      const code = candidate ? compiled.replace(control, control + capture) : control + capture;
      frameHtml = frameHtml.replace(compiled, code);
      await page.setContent('<style>body{margin:0}iframe{width:100%;max-width:620px;height:' +
        (index ? 730 : 560) + 'px;border:0}</style><div id="pane" style="' +
        (hidden ? 'display:none' : '') + '"><iframe src="data:text/html;base64,' +
        Buffer.from(frameHtml).toString('base64') + '"></iframe></div>', {waitUntil: 'domcontentloaded'});
      const frame = page.frames()[1];
      await frame.waitForFunction(() => typeof JXG !== 'undefined' && JXG.version === '1.14.1');
      await page.waitForTimeout(800);
      const initial = await frame.evaluate(() => ({
        deferred: !window.__widgetProbe,
        boards: Object.keys(JXG.boards).length
      }));
      if (candidate && hidden && engine === 'firefox') {
        assert.equal(initial.deferred, true); assert.equal(initial.boards, 0);
      }
      await page.locator('#pane').evaluate(element => element.style.display = 'block');
      await page.waitForTimeout(500);
      async function state() {
        return frame.evaluate(() => {
          const t = window.__widgetProbe;
          if (!t) return null;
          return {id: t.board.id, boards: Object.keys(JXG.boards).length,
            width: t.board.canvasWidth, height: t.board.canvasHeight,
            box: t.board.getBoundingBox(), c: t.c.Value(), best: t.best(),
            P: t.P ? t.P.Value() : null, Z: t.Z ? [t.Z.X(), t.Z.Y()] : null};
        });
      }
      const shown = await state(), values = [];
      const record = {engine, version: browser.version(), index, candidate, hidden, initial, shown, errors, values};
      observations.push(record);
      if (candidate || !hidden || engine === 'chromium') {
        assert.ok(shown); assert.equal(shown.boards, 1); assert.equal(shown.c, 4);
        assert.deepEqual(shown.best, {m: 27, idx: [3]});
        if (index) {assert.equal(shown.P, 20); assert.deepEqual(shown.Z, [2, 1]);}
        // Check object identity inside the frame, not a serialized object outside it.
        await frame.evaluate(() => window.__firstBoard = window.__widgetProbe.board);
        for (const width of [390, 1280]) {
          await page.setViewportSize({width, height: 900}); await page.waitForTimeout(400);
          for (const value of [.5, 2.5, 4, 10, 14]) {
            await frame.evaluate(v => {const t = window.__widgetProbe; t.c.setValue(v); t.board.update();}, value);
            const current = await state();
            assert.equal(current.c, value); assert.ok(current.box.every(Number.isFinite));
            assert.equal(current.id, shown.id); assert.equal(current.boards, 1);
            const vertices = [[0,0], [4,0], [4,1], [3,3], [0,4.5]];
            const scores = vertices.map(v => 5*v[0] + value*v[1]);
            const m = Math.max(...scores), idx = scores.flatMap((v, i) => v > m - 1e-9 ? [i] : []);
            assert.deepEqual(current.best, {m, idx}); values.push({width, value, state: current});
          }
          if (index) for (const value of [0, 20, 63]) {
            await frame.evaluate(v => {const t = window.__widgetProbe; t.P.setValue(v); t.board.update();}, value);
            const current = await state();
            assert.equal(current.P, value); assert.equal(current.boards, 1);
            assert.ok(current.box.every(Number.isFinite));
            (record.levels ||= []).push({width, value, state: current});
          }
        }
        await page.locator('#pane').evaluate(element => element.style.display = 'none');
        await page.setViewportSize({width: 390, height: 900}); await page.waitForTimeout(500);
        await page.locator('#pane').evaluate(element => element.style.display = 'block'); await page.waitForTimeout(500);
        record.reopened = await state();
        assert.equal(record.reopened.c, 14); assert.equal(record.reopened.boards, 1);
        assert.ok(record.reopened.box.every(Number.isFinite));
        assert.equal(await frame.evaluate(() => window.__widgetProbe.board === window.__firstBoard), true);
        assert.deepEqual(errors, []);
      } else if (engine === 'firefox') {
        assert.ok(errors.some(error => error.includes('V[best().idx[0]]')), 'untouched hidden baseline must reproduce the original failure');
      }
      await page.close(); page = null;
    }
    await browser.close(); browser = null;
  }
  assert.equal(observations.length, 16);
  assert.equal(observations.filter(o => o.candidate).reduce((sum, o) => sum + o.values.length, 0), 80);
  writeReport(null); console.log('PASS: 16 applet cases; 80 candidate value/width checks; effective Firefox baseline controls');
})().catch(async error => {
  writeReport(error.stack);
  if (page) await page.screenshot({path: path.join(reports, 'failure.png')}).catch(() => {});
  if (browser) await browser.close().catch(() => {});
  console.error(error); process.exitCode = 1;
});
