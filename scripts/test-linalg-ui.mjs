// Focused real-course Chromium acceptance, served beneath the deployed /linalg/ mount.
// No grader/runtime substitutions. Negative controls abort only the named enhancement.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf('--' + name);
  if (i < 0) return fallback;
  assert.ok(args[i + 1] && !args[i + 1].startsWith('--'), 'Missing value for --' + name);
  return args[i + 1];
};
const site = fs.realpathSync(path.resolve(option('site', '_site')));
const selected = option('case', 'baseline');
assert.ok(['baseline', 'jsxgraph', 'speech', 'all'].includes(selected));
const coi = option('coi', 'off');
assert.ok(['off', 'on'].includes(coi), '--coi must be off or on');
const remoteBase = option('base-url');
if (remoteBase) {
  const url = new URL(remoteBase);
  assert.ok(url.protocol === 'https:' && !url.username && !url.password,
    '--base-url requires HTTPS without credentials');
  assert.ok(remoteBase === remoteBase.trim() && remoteBase.endsWith('/') && url.pathname.endsWith('/') && !url.search && !url.hash,
    '--base-url requires a trailing slash and no query or fragment');
  assert.equal(coi, 'off', 'Remote acceptance uses the deployed host headers; --coi on is local-only');
}
const timeout = Number(option('timeout', '180000'));
const output = option('output');
const report = {passed: false,
  scope: remoteBase ? 'focused Chromium against the deployed HTTPS course; no three-engine claim' : 'focused Chromium; real /linalg/ course; no deployed Pages or three-engine claim',
  deployedAcceptanceAttempted: !!remoteBase, serverCoiHeaders: remoteBase ? null : coi === 'on',
  firstVisitPolicy: 'fresh browser context; actual package bootstrap, service worker and supported fallback', cases: []};
const checkpoint = () => {
  if (!output) return;
  fs.mkdirSync(path.dirname(path.resolve(output)), {recursive: true});
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
};
const types = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf'};
let browser;
const server = http.createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://local.invalid').pathname);
    assert.ok(pathname.startsWith('/linalg/'));
    let target = path.resolve(site, '.' + pathname.slice('/linalg'.length));
    assert.ok(target === site || target.startsWith(site + path.sep));
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    target = fs.realpathSync(target);
    assert.ok(target.startsWith(site + path.sep));
    const bytes = fs.readFileSync(target);
    const headers = {'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Content-Length': bytes.length};
    if (coi === 'on') Object.assign(headers, {'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin', 'Access-Control-Allow-Origin': '*'});
    response.writeHead(200, headers);
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch {
    response.writeHead(404, {'Content-Type': 'text/plain'}).end('Not found');
  }
});
const bounded = async (promise, label, ms = timeout) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => timer = setTimeout(() => reject(new Error(label + ' timed out')), ms))]); }
  finally { clearTimeout(timer); }
};
async function openAncestors(page, locator) {
  const tabs = await locator.evaluate(element => {
    const ids = [];
    for (let n = element; n; n = n.parentElement) if (n.classList.contains('tab-pane')) ids.unshift(n.getAttribute('aria-labelledby'));
    return ids;
  });
  for (const id of tabs) {
    const tab = page.locator('[id="' + id + '"]');
    if (await tab.getAttribute('aria-selected') !== 'true') await tab.click();
  }
  for (const detail of (await locator.locator('xpath=ancestor::details[not(@open)]').all()).reverse()) await detail.locator(':scope > summary').click();
  const toggle = locator.locator(':scope > .math-exercise-toggle[aria-expanded="false"], :scope > .py-exercise-toggle[aria-expanded="false"]');
  if (await toggle.count()) await toggle.click();
}
const cellSelector = id => '[data-ctm-id="' + id + '"], .qpyodide-interactive-area[data-id="' + id + '"]';
const cell = (page, id) => page.locator(cellSelector(id));
async function editCode(page, id, text) {
  const root = cell(page, id);
  await openAncestors(page, root);
  await root.locator('.monaco-editor').waitFor({state: 'visible', timeout});
  // Public API selects the actual editor; edits still use real keyboard input.
  await root.evaluate(node => {
    const editor = monaco.editor.getEditors().find(e => node.contains(e.getDomNode()));
    if (!editor) throw new Error('Scoped Monaco editor missing');
    editor.focus(); editor.setSelection(editor.getModel().getFullModelRange());
  });
  await page.keyboard.press('Backspace');
  await page.keyboard.insertText(text);
  await page.waitForFunction(({selector, text}) => {
    const node = document.querySelector(selector);
    return monaco.editor.getEditors().some(e => node.contains(e.getDomNode()) && e.getValue() === text);
  }, {selector: cellSelector(id), text});
}
async function runtimeReady(page) {
  // The package itself decides whether to reload for COI. Do not start Python,
  // click a control or force isolation before that first-visit decision settles.
  await page.waitForFunction(() => window.qpyodideCoiCanStart === true && !!window.mainPyodide?.whenSetup, null, {timeout});
  const ready = await bounded(page.evaluate(async () => {
    await window.mainPyodide.whenSetup;
    return {worker: !!window.mainPyodide.isWorkerProxy, crossOriginIsolated,
      inputState: window.qpyodideInputState, coiOutcome: window.qpyodideCoiOutcome || null,
      serviceWorkerControlled: !!navigator.serviceWorker?.controller,
      runtimePath: window.mainPyodide.isWorkerProxy ? 'worker-proxy' : 'main-thread',
      fallback: crossOriginIsolated ? null : window.qpyodideInputState};
  }), 'real runtime setup');
  assert.ok(ready.crossOriginIsolated || ['unavailable', 'needs-reload'].includes(ready.inputState),
    'A non-isolated runtime must expose the package\'s explicit supported input fallback');
  return ready;
}
async function runCode(page, id) {
  const beforeEdit = await page.evaluate(() => ({runtimeCreated: !!window.mainPyodide,
    setupPromiseExposed: !!window.mainPyodide?.whenSetup, cellsReady: window.qpyodideCellsReady === true,
    startupPhaseDone: window.qpyodideStartupPhaseDone === true, inputState: window.qpyodideInputState || null,
    coiOutcome: window.qpyodideCoiOutcome || null, crossOriginIsolated}));
  await editCode(page, id, 'print(6 * 7)');
  const button = cell(page, id).locator('.qpyodide-button-run');
  const beforeRun = await button.evaluate(node => ({buttonDisabled: node.disabled, buttonText: node.textContent.trim(),
    runtimeCreated: !!window.mainPyodide, setupPromiseExposed: !!window.mainPyodide?.whenSetup,
    cellsReady: window.qpyodideCellsReady === true, startupPhaseDone: window.qpyodideStartupPhaseDone === true,
    inputState: window.qpyodideInputState || null, coiOutcome: window.qpyodideCoiOutcome || null, crossOriginIsolated}));
  const clickedAt = Date.now();
  // Playwright may wait for the product's actual disabled/loading control.
  // This helper never calls runtimeReady/ensure/start. The baseline invokes it
  // before any harness Python readiness wait; fault diagnostics may be warm.
  await button.click({timeout});
  const clickWaitMs = Date.now() - clickedAt;
  await page.waitForFunction(selector => document.querySelector(selector)?.querySelector('.qpyodide-output-code-area')?.textContent.trim() === '42', cellSelector(id), {timeout});
  return {beforeEdit, beforeRun, clickActionabilityWaitMs: clickWaitMs, output: '42'};
}
async function checkMath(page) {
  const id = 'week4-task-pattern-readings', root = cell(page, id);
  await openAncestors(page, root);
  const fields = root.locator('.math-input');
  assert.equal(await fields.count(), 4);
  for (let i = 0; i < 4; i++) await fields.nth(i).fill(['2*sqrt(8)', 'sqrt(8)', '2*sqrt(8)', 'sqrt(8)'][i]);
  await root.locator('.math-check-btn').click();
  await page.waitForFunction(id => window.__linalgResults.some(r => r.id === id && r.status === 'correct'), id, {timeout});
}
async function runCase(kind, base) {
  const row = {case: kind, passed: false, checks: [], blockedEnhancements: 0};
  report.cases.push(row);
  const failures = [], pageErrors = [];
  const context = await browser.newContext({viewport: {width: 1280, height: 900}, acceptDownloads: true, serviceWorkers: 'allow'});
  let page;
  try {
    context.on('requestfailed', r => { if (!r.url().startsWith(base)) failures.push({url: new URL(r.url()).origin + new URL(r.url()).pathname, error: r.failure()?.errorText}); });
    context.on('response', r => { if (r.status() >= 400 && !r.url().startsWith(base)) failures.push({url: new URL(r.url()).origin + new URL(r.url()).pathname, status: r.status()}); });
    if (kind !== 'baseline') await context.route('**/*', async route => {
      const url = route.request().url();
      const blocked = kind === 'jsxgraph' ? /(?:jsxgraphcore|jsxgraph)\.js(?:[?#]|$)/i.test(url) : /(?:sre_browser|speech-rule-engine|mathmaps\/|\/sre\/[^?#]*\.js)/i.test(url);
      if (blocked) { row.blockedEnhancements++; await route.abort('failed'); } else await route.continue();
    });
    await context.addInitScript(() => {
      window.__linalgResults = [];
      document.addEventListener('ctm:result', event => window.__linalgResults.push(event.detail));
      // Passive observation only: retain original Worker construction, packet
      // objects, transfer lists, return values and errors. Store booleans, not
      // learner source or a diagnostic stream.
      const audit = window.__linalgWorkerAudit = {posts: 0, markerPackets: 0, controlPackets: 0, errors: []};
      try {
        const descriptor = Object.getOwnPropertyDescriptor(Worker.prototype, 'postMessage');
        const original = descriptor.value;
        Object.defineProperty(Worker.prototype, 'postMessage', {...descriptor, value: function () {
          try {
            audit.posts++;
            const message = arguments[0];
            if (message && typeof message === 'object') {
              const type = Object.getOwnPropertyDescriptor(message, 'type')?.value;
              const code = Object.getOwnPropertyDescriptor(message, 'code')?.value;
              if (['runCell', 'runPython'].includes(type) && typeof code === 'string') {
                if (code.includes('INGMAT_LINALG_SAVED')) audit.markerPackets++;
                if (code.includes('print(6 * 7)')) audit.controlPackets++;
              }
            }
          } catch (error) { audit.errors.push(String(error)); }
          return Reflect.apply(original, this, arguments);
        }});
      } catch (error) { audit.errors.push(String(error)); }
    });
    page = await context.newPage();
    row.mainNavigations = 0;
    page.on('framenavigated', frame => { if (frame === page.mainFrame()) row.mainNavigations++; });
    page.setDefaultTimeout(30000);
    page.on('pageerror', e => pageErrors.push(e.message));
    page.on('dialog', dialog => dialog.accept());
    const navigate = async file => {
      row.phase = file;
      checkpoint();
      try { await page.goto(base + 'pages/' + file + '.html', {waitUntil: 'domcontentloaded', timeout}); }
      catch (error) {
        // A package-driven first-visit reload may replace the initial document.
        // All other navigation failures retain their original failure status.
        if (!/ERR_ABORTED|interrupted by another navigation/.test(String(error.message))) throw error;
      }
      await page.waitForFunction(() => !!window.CTMStore && !!window.monaco, null, {timeout});
    };
    if (kind === 'baseline') {
      await navigate('page1');
      row.phase = 'page1-first-run'; checkpoint();
      const id = 'ingmat-ide-ide-manual-1';
      row.firstVisitRun = await runCode(page, id);
      row.checks.push('first learner edit/Run returns42 without a harness Python warmup');
      // Observe the canonical runtime only after the first actual learner Run.
      row.runtime = {page1: await runtimeReady(page)};
      row.firstVisitNavigations = row.mainNavigations;
      const controlAudit = await page.evaluate(() => __linalgWorkerAudit);
      assert.deepEqual(controlAudit.errors, []);
      if (row.runtime.page1.worker) assert.ok(controlAudit.controlPackets > 0, 'Passive observer must see the actual positive-control Python Run');
      row.phase = 'page1-store'; checkpoint();
      const saved = 'print("INGMAT_LINALG_SAVED")';
      await editCode(page, id, saved);
      await page.waitForFunction(({id, saved}) => JSON.parse(localStorage.getItem(CTMStore.key(id)) || 'null')?.inputs?.code === saved, {id, saved});
      await page.reload({waitUntil: 'domcontentloaded'});
      await page.waitForFunction(saved => window.monaco?.editor?.getModels().some(m => m.getValue() === saved), saved, {timeout});
      row.runtime.page1Restored = await runtimeReady(page);
      // IDE Run does not emit ctm:result. Wait through the real setup/output/
      // autorun startup phase, then inspect this restored cell's actual output
      // and idle control as well as the independent grading event observer.
      await page.waitForFunction(selector => {
        const run = document.querySelector(selector)?.querySelector('.qpyodide-button-run');
        return window.qpyodideStartupPhaseDone === true && run && !run.disabled && run.dataset.queued !== '1';
      }, cellSelector(id), {timeout});
      const restoredOutput = await cell(page, id).locator('.qpyodide-output-code-area').innerText();
      assert.ok(!restoredOutput.includes('INGMAT_LINALG_SAVED'), 'Restoring an IDE answer must not execute its print statement');
      const restoredAudit = await page.evaluate(() => __linalgWorkerAudit);
      assert.deepEqual(restoredAudit.errors, []);
      if (row.runtime.page1Restored.worker) assert.ok(restoredAudit.posts > 0, 'Restored real worker traffic must be observed');
      assert.equal(restoredAudit.markerPackets, 0, 'Restoration must not dispatch saved learner source for execution');
      assert.deepEqual(await page.evaluate(() => __linalgResults), []);
      row.restoration = {startupComplete: true, runControlIdle: true, restoredOutputContainsMarker: false, learnerCodePackets: 0, freshGradingResults: 0};
      row.checks.push('IDE code restored without execution or fresh grading after real startup completes');
      await page.locator('[data-ctm-export]').click();
      assert.ok((await page.locator('#ctm-export-view textarea').inputValue()).includes('INGMAT_LINALG_SAVED'));
      const manifest = await page.locator('#ctm-store-manifest').textContent().then(JSON.parse);
      const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#ctm-export-view').getByRole('button', {name: manifest.messages.downloadMarkdown, exact: true}).click()]);
      assert.equal(download.suggestedFilename(), 'my-answers.md');
      await page.locator('#ctm-export-view').getByRole('button', {name: manifest.messages.exportClose, exact: true}).click();
      row.checks.push('answer export contains actual saved code and downloads Markdown');
      await openAncestors(page, cell(page, id));
      await cell(page, id).locator('.qpyodide-button-reset').click();
      await page.waitForFunction(saved => !monaco.editor.getModels().some(m => m.getValue() === saved), saved);
      await page.waitForFunction(id => localStorage.getItem(CTMStore.key(id)) === null, id);
      row.checks.push('IDE Reset restores starter and removes saved answer');
    }
    await navigate('uke4');
    row.phase = 'uke4-runtime'; checkpoint();
    row.runtime ||= {};
    row.runtime.uke4 = await runtimeReady(page);
    if (kind !== 'baseline') {
      const board = page.locator('iframe[id^="JXG"]').first();
      await openAncestors(page, board);
      await board.scrollIntoViewIfNeeded();
    }
    row.phase = 'uke4-check'; checkpoint();
    await checkMath(page); row.checks.push('real ordinary math Check returns correct');
    if (kind === 'jsxgraph') { await runCode(page, 'week4-direction-contributions'); row.checks.push('Python Run works with JSXGraph requests missing'); }
    if (kind !== 'baseline') assert.ok(row.blockedEnhancements > 0, 'Negative control must abort a real named enhancement request');
    if (kind === 'speech') row.checks.push('ordinary Check works with speech requests missing');
    if (kind === 'baseline') {
      const quiz = page.locator('.ctm-progress-slot[data-ctm-quiz="uke4-7-oppgaver"]');
      await quiz.locator('button[data-status="correct"]').first().waitFor();
      await quiz.locator('button[data-status="correct"]').first().click();
      await page.waitForFunction(() => { const n = document.querySelector('[data-ctm-id="week4-task-pattern-readings"]'); return n === document.activeElement || n.contains(document.activeElement); });
      row.checks.push('quiz progress records grade and tile focuses actual question');
      const reading = page.locator('.ctm-modes button[data-mode="reading"]').first();
      const reveal = page.locator('details.ctm-reveal.reading-step').first();
      await reading.click();
      assert.equal(await reading.getAttribute('aria-pressed'), 'true');
      assert.equal(await reveal.evaluate(n => n.open), true);
      const lecture = page.locator('.ctm-modes button[data-mode="lecture"]').first();
      await lecture.click(); assert.equal(await lecture.getAttribute('aria-pressed'), 'true');
      assert.equal(await reveal.evaluate(n => n.open), false);
      await openAncestors(page, reveal); await reveal.locator(':scope > summary').click();
      assert.equal(await reveal.evaluate(n => n.open), true);
      row.checks.push('reading/lecture switch and real reveal summary operate');
      await page.setViewportSize({width: 390, height: 844});
      await openAncestors(page, cell(page, 'week4-task-pattern-readings'));
      const bounds = await cell(page, 'week4-task-pattern-readings').evaluate(n => {const r=n.getBoundingClientRect();return {left:r.left,right:r.right,width:innerWidth};});
      assert.ok(bounds.left >= -1 && bounds.right <= bounds.width + 1, 'Question must fit narrow viewport');
      row.checks.push('390px exercise layout fits viewport');
      assert.deepEqual(pageErrors, [], 'Baseline must not silently accept uncaught application errors');
    }
    row.nonBlockingExternalFailures = failures.slice(0, 5);
    row.passed = true; delete row.phase;
  } catch (error) {
    row.error = String(error.message || error);
    row.externalFailures = failures.slice(0, 8);
    row.pageErrors = pageErrors.slice(0, 5);
    if (page && !page.isClosed()) try {
      row.observedHost = await bounded(page.evaluate(() => ({crossOriginIsolated, inputState: window.qpyodideInputState || null,
        coiOutcome: window.qpyodideCoiOutcome || null, serviceWorkerControlled: !!navigator.serviceWorker?.controller,
        runtimeCreated: !!window.mainPyodide})), 'host observation', 5000);
    } catch { row.observedHost = {unavailable: true}; }
    row.status = failures.length ? 'blocked-or-failed-with-external-request-errors' : 'failed';
    throw error;
  } finally { await context.close(); }
}
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const module = option('playwright', process.env.CTM_PLAYWRIGHT_MODULE || 'playwright');
  let playwright;
  try { playwright = await import(path.isAbsolute(module) ? pathToFileURL(module).href : module); }
  catch (error) {
    if (module !== 'playwright') throw error;
    playwright = await import('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  }
  const launch = {headless: true};
  if (option('executable')) launch.executablePath = option('executable');
  const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (proxy) {
    const url = new URL(proxy);
    launch.proxy = {server: url.protocol + '//' + url.host, bypass: '127.0.0.1,localhost'};
    if (url.username) launch.proxy.username = decodeURIComponent(url.username);
    if (url.password) launch.proxy.password = decodeURIComponent(url.password);
  }
  browser = await playwright.chromium.launch(launch);
  report.browser = browser.version();
  const base = remoteBase || 'http://127.0.0.1:' + server.address().port + '/linalg/';
  report.testedBaseUrl = base;
  checkpoint();
  for (const kind of selected === 'all' ? ['baseline', 'jsxgraph', 'speech'] : [selected]) await runCase(kind, base);
  report.passed = true;
} catch (error) { report.error = String(error.message || error); process.exitCode = 1; }
finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
  checkpoint();
  console.log(JSON.stringify(report));
}
