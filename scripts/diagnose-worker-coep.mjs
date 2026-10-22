// Read-only worker diagnostics on the exact rendered course. AGPL-3.0-or-later.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

const foundation = path.resolve(process.env.CTM_ASSESSMENT_ROOT || '_ci/ctm-assessment');
const require = createRequire(path.join(foundation, 'package.json'));
const playwright = require('playwright');
const {serve} = await import(pathToFileURL(path.join(foundation, 'tools/compare-browser.mjs')));
const engine = process.env.CTM_WORKER_BROWSER || 'webkit';
assert.ok(['chromium', 'firefox', 'webkit'].includes(engine));
const site = path.resolve(process.env.CTM_QUIZ_SITE);
const output = path.resolve(process.env.CTM_WORKER_REPORT_DIR || 'worker-coep-reports');
fs.mkdirSync(output, {recursive: true});
const hash = text => createHash('sha256').update(text).digest('hex');
function frameReference(url) {
  return url.startsWith('data:') ? {scheme:'data', length:url.length, sha256:hash(url)} : {url};
}
function bounded(text) {
  return String(text || '').replace(/data:text\/html;base64,[A-Za-z0-9+/=]+/g,
    value => '<data-frame sha256=' + hash(value) + '>').slice(0, 2400);
}

// Added before page scripts in every frame. Every native call and native error remains active.
function instrument() {
  const report = (kind, value = {}) => {
    try {
      Promise.resolve(globalThis.__ctmWorkerDiagnostic({
        kind, origin:location.origin, crossOriginIsolated, secure:isSecureContext, ...value,
      })).catch(() => {}); // Reporting after a frame closes must not introduce a new page error.
    } catch (_) {}
  };
  const create = URL.createObjectURL, revoke = URL.revokeObjectURL;
  URL.createObjectURL = function (...args) {
    const url = Reflect.apply(create, this, args), blob = args[0];
    report('blob-created', {url, size:blob?.size, type:blob?.type});
    if (blob instanceof Blob && blob.size <= 512000) {
      blob.text().then(text => report('blob-source', {url, text})).catch(() => {});
    }
    return url;
  };
  URL.revokeObjectURL = function (...args) {
    report('blob-revoked', {url:String(args[0]), stack:new Error().stack});
    return Reflect.apply(revoke, this, args);
  };
  if (typeof Worker === 'function') {
    globalThis.Worker = new Proxy(Worker, {
      construct(target, args, newTarget) {
        const url = String(args[0]);
        report('worker-created', {url, options:args[1] || null, stack:new Error().stack});
        let worker;
        try { worker = Reflect.construct(target, args, newTarget); }
        catch (error) {
          report('worker-threw', {url, name:error.name, message:error.message});
          throw error;
        }
        worker.addEventListener('error', event => report('worker-error', {
          url, message:event.message, filename:event.filename, line:event.lineno,
        })); // No preventDefault: the original error gate still sees failures.
        return worker;
      },
    });
  }
}

// A native, import-free worker separates document origin/policy from library code.
function nativeProbe(revoke) {
  return new Promise(resolve => {
    let worker, url, done = false;
    const finish = (status, detail = null) => {
      if (done) return;
      done = true; clearTimeout(timer);
      if (worker) worker.terminate();
      if (url) URL.revokeObjectURL(url);
      resolve({status, detail, origin:location.origin, coi:crossOriginIsolated, secure:isSecureContext});
    };
    const timer = setTimeout(() => finish('timeout'), 4000);
    try {
      url = URL.createObjectURL(new Blob([
        'self.postMessage({origin:self.location.origin,coi:self.crossOriginIsolated})',
      ], {type:'text/javascript'}));
      worker = new Worker(url);
      worker.addEventListener('message', event => finish('message', event.data));
      worker.addEventListener('error', event => finish('error', {message:event.message, filename:event.filename}));
      if (revoke === 'immediate') URL.revokeObjectURL(url);
    } catch (error) { finish('throw', {name:error.name, message:error.message}); }
  });
}
function rawErrors(page, target) {
  page.on('pageerror', error => target.push({kind:'pageerror', message:bounded(error.message), stack:bounded(error.stack)}));
  page.on('console', message => {
    if (message.type() === 'error') target.push({
      kind:'console.error', message:bounded(message.text()),
      location:{...message.location(), url:bounded(message.location().url)},
    });
  });
}

const report = {
  engine, course:'23e47057806766ecb95f3cc86cf92eefa8102316',
  sourceRun:39835256923, sourceArtifact:12450906416,
  assessment:'65be5facbf67f900533a71cd950aa82e5c4c1e95',
  boundary:'Diagnostic only. Native errors are retained. No course acceptance gate or product code changes.',
  coursePages:[], controls:[],
};
let browser, courseServer, controlServer;
try {
  browser = await playwright[engine].launch({headless:true});
  report.browserVersion = browser.version();
  courseServer = await serve({course:site}, true, 'require-corp');
  const base = 'http://127.0.0.1:' + courseServer.address().port + '/course/';
  for (const file of ['pages/page2.html', 'pages/page4.html', 'pages/uke3.html']) {
    assert.ok(fs.existsSync(path.join(site, file)));
    const context = await browser.newContext();
    const observationStart = Date.now();
    const row = {file, errors:[], events:[], frames:[], resources:[], activatedTabs:[],
      observation:{initialWaitMs:3000, finalWaitMs:7000, perTabWaitMs:200, tabPasses:2}};
    report.coursePages.push(row);
    await context.exposeBinding('__ctmWorkerDiagnostic', ({frame}, value) => {
      const event = {...value, frame:frameReference(frame.url())};
      if ('text' in event) {
        event.sourceBytes = Buffer.byteLength(event.text);
        event.sourceSha256 = hash(event.text);
        event.sourcePrefix = event.text.slice(0, 1200);
        delete event.text;
      }
      if (event.stack) event.stack = bounded(event.stack);
      if (event.message) event.message = bounded(event.message);
      row.events.push(event);
    });
    await context.addInitScript(instrument);
    const page = await context.newPage();
    rawErrors(page, row.errors);
    const bodies = [];
    page.on('response', response => {
      if (/mathjax@4\.1\.3\/tex-mml-svg\.js(?:$|[?])/.test(response.url())) {
        bodies.push(response.body().then(bytes => row.resources.push({
          url:response.url(), bytes:bytes.length, sha256:hash(bytes),
        })).catch(error => row.resources.push({url:response.url(), bodyError:bounded(error.message)})));
      }
    });
    const response = await page.goto(base + file, {waitUntil:'domcontentloaded'});
    assert.equal(response.status(), 200);
    const headers = response.headers();
    row.headers = {coop:headers['cross-origin-opener-policy'], coep:headers['cross-origin-embedder-policy']};
    assert.deepEqual(row.headers, {coop:'same-origin', coep:'require-corp'});
    row.top = await page.evaluate(() => ({origin:location.origin, coi:crossOriginIsolated}));
    assert.equal(row.top.coi, true);
    await page.waitForTimeout(3000);
    // Show actual authored panes: board labels may typeset only once visible.
    const activated = new Set();
    for (let pass = 0; pass < 2; pass++) {
      const tabs = page.locator('[role="tab"]');
      for (let index = 0; index < await tabs.count(); index++) {
        const tab = tabs.nth(index);
        if (activated.has(index) || !await tab.isVisible()) continue;
        await tab.click();
        activated.add(index);
        row.activatedTabs.push({index, id:await tab.getAttribute('id')});
        await page.waitForTimeout(200);
      }
    }
    await page.waitForTimeout(7000);
    row.frames = page.frames().map(frame => frameReference(frame.url()));
    row.observation.elapsedMs = Date.now() - observationStart;
    await Promise.allSettled(bodies);
    await context.close();
  }

  // Both servers return real HTTP responses. The plain server is a labelled
  // negative control; actual course pages above always keep strict COOP/COEP.
  controlServer = createServer((request, response) => {
    const headers = {'Content-Type':'text/html'};
    if (request.url === '/strict') Object.assign(headers, {
      'Cross-Origin-Opener-Policy':'same-origin', 'Cross-Origin-Embedder-Policy':'require-corp',
    });
    response.writeHead(200, headers);
    response.end('<!doctype html><title>Native worker policy control</title>');
  });
  await new Promise(resolve => controlServer.listen(0, '127.0.0.1', resolve));
  for (const policy of ['strict', 'plain']) for (const mode of ['top', 'data-sandbox']) {
    for (const revoke of ['immediate', 'message']) {
      const page = await browser.newPage(), errors = [];
      rawErrors(page, errors);
      const response = await page.goto('http://127.0.0.1:' + controlServer.address().port + '/' + policy);
      assert.equal(response.status(), 200);
      const top = await page.evaluate(() => ({origin:location.origin, coi:crossOriginIsolated}));
      assert.equal(top.coi, policy === 'strict');
      let result;
      if (mode === 'top') result = await page.evaluate(nativeProbe, revoke);
      else result = await page.evaluate(({source, revoke}) => new Promise(resolve => {
        const frame = document.createElement('iframe');
        frame.sandbox = 'allow-scripts';
        const listener = event => {
          if (event.source !== frame.contentWindow) return;
          removeEventListener('message', listener); clearTimeout(timer); resolve(event.data);
        };
        const timer = setTimeout(() => {
          removeEventListener('message', listener);
          resolve({status:'frame-timeout'});
        }, 8000);
        addEventListener('message', listener);
        frame.src = 'data:text/html;base64,' + btoa('<script>(' + source + ')(' +
          JSON.stringify(revoke) + ').then(result=>parent.postMessage(result,"*"))<' + '/script>');
        document.body.append(frame);
      }), {source:nativeProbe.toString(), revoke});
      report.controls.push({policy, mode, revoke, top, result, errors});
      await page.close();
    }
  }
  assert.equal(report.controls.length, 8);
  assert.equal(report.controls.find(row => row.policy === 'plain' && row.mode === 'top' && row.revoke === 'message').result.status, 'message',
    'the import-free native worker control must work');
  assert.ok(report.coursePages.some(row => row.events.some(event => event.kind === 'worker-created')),
    'native worker instrumentation must observe actual course worker creation');
} catch (error) {
  report.failure = {message:bounded(error.message), stack:bounded(error.stack)};
  throw error;
} finally {
  fs.writeFileSync(path.join(output, engine + '.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({
    engine, browserVersion:report.browserVersion,
    coursePages:report.coursePages.map(row => ({
      file:row.file, headers:row.headers, top:row.top, errors:row.errors, activatedTabs:row.activatedTabs,
      observation:row.observation,
      workers:row.events.filter(event => event.kind.startsWith('worker')),
      sources:row.events.filter(event => event.kind === 'blob-source'),
      resources:row.resources,
    })),
    controls:report.controls, failure:report.failure,
  }, null, 2));
  if (browser) await browser.close();
  if (courseServer) await new Promise(resolve => courseServer.close(resolve));
  if (controlServer) await new Promise(resolve => controlServer.close(resolve));
}

