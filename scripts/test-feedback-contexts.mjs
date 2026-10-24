#!/usr/bin/env node
// Exercise rendered CTM serializers/adapters; only the provider transport is mocked.
// No request payloads, logs or browser reports are written to disk.
import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';

const scripts = path.dirname(fileURLToPath(import.meta.url));
const mount = '/linalg/';
const recordAdapters = `
(() => {
  const F = globalThis.AIFeedback;
  const original = F.attach;
  globalThis.__ctmContextTestAdapters = new Map();
  F.attach = options => {
    globalThis.__ctmContextTestAdapters.set(options.id, options);
    return original(options);
  };
})();
`;
const types = {
  '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};
function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const { values } = parseArgs({ options: {
    site: { type: 'string', default: '_site' },
    executable: { type: 'string' },
    python: { type: 'string', default: 'python3' },
    help: { type: 'boolean', default: false },
  } });
  if (values.help) {
    process.stdout.write('node scripts/test-feedback-contexts.mjs --site _site [--executable /path/to/chromium] [--python python3]\n');
    return;
  }
  const site = path.resolve(values.site);
  requireThat((await stat(site)).isDirectory(), 'The rendered --site directory is missing.');
  const contracts = JSON.parse(await readFile(path.join(scripts, 'feedback-context-contracts.json'), 'utf8')).cells;
  let checked;
  try {
    // Reuse the static check and its mathematical factual fixtures. It also
    // recomputes the plotted binary32/64 data using only Python's stdlib.
    checked = JSON.parse(execFileSync(values.python, ['-c',
      'import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); import check_feedback_contexts as c; print(json.dumps({"summary":c.check(Path(sys.argv[2])),"mathFacts":c.REQUIRED}))',
      scripts, site], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
  } catch (error) {
    const reason = String(error.stderr || error.message).trim().split('\n').at(-1);
    throw new Error('Static context check failed: ' + reason);
  }
  requireThat(checked.summary.ide_dependency_context_checks === 263, 'Expected all 263 authored IDE dependency contexts.');
  requireThat(Object.keys(checked.mathFacts).length === 32, 'Expected all 32 repaired mathematics contexts.');

  let servedAdapterScripts = 0;
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(mount)) throw new Error('Outside course mount');
      const relative = pathname.slice(mount.length) || 'index.html';
      const filename = path.resolve(site, relative);
      if (!filename.startsWith(site + path.sep)) throw new Error('Outside rendered site');
      let body = await readFile(filename);
      if (pathname.endsWith('/ai-feedback.js')) {
        // Observe options passed to the real attach function, without replacing
        // its request builder, serializer, policy, checks or feedback handle.
        body = Buffer.concat([body, Buffer.from(recordAdapters)]);
        servedAdapterScripts += 1;
      }
      response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream',
        'Cache-Control': 'no-store', 'Content-Length': body.length });
      response.end(body);
    } catch {
      response.writeHead(404); response.end('Not found');
    }
  });
  let browser;
  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const origin = 'http://127.0.0.1:' + server.address().port;
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'],
      ...(values.executable ? { executablePath: values.executable } : {}) });
    const context = await browser.newContext({ serviceWorkers: 'block' });
    let blockedExternalAssets = 0;
    let providerNetworkAttempts = 0;
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      const provider = url.hostname === 'mock.invalid' || /\/(?:chat\/completions|responses|models)(?:\/|$)/.test(url.pathname);
      if (provider) providerNetworkAttempts += 1;
      // The course scripts are real. External assets are blocked so the test
      // remains deterministic and can never contact an AI provider.
      if (provider || url.origin !== origin || !url.pathname.startsWith(mount)) {
        blockedExternalAssets += 1;
        await route.abort();
      } else await route.continue();
    });
    const totals = { ide: 0, math: 0, readonly: 0, mockFetches: 0, negativeChecks: 0 };
    const observedIDE = new Set();
    const observedMath = new Set();
    const readonly = [];
    const pages = [...new Set(Object.values(contracts).map(contract => contract.page))].sort();
    for (const file of pages) {
      const page = await context.newPage();
      try {
        await page.goto(origin + mount + 'pages/' + file, { waitUntil: 'domcontentloaded' });
        const selected = Object.fromEntries(Object.entries(contracts).filter(([, contract]) => contract.page === file));
        await page.waitForFunction(selected => {
          if (!globalThis.__ctmContextTestAdapters || !globalThis.qpyodideCellDetails) return false;
          return Object.keys(selected).every(label => {
            const cell = qpyodideCellDetails.find(cell => cell.options.label === label);
            if (!cell) return false;
            if (cell.options['read-only'] === true || cell.options['read-only'] === 'true') return true;
            return [...__ctmContextTestAdapters.values()].some(adapter => adapter.integration === 'pyodide-interaktiv' && adapter.policySelection?.exercise === label);
          });
        }, selected, { timeout: 30000 });
        const result = await page.evaluate(async ({ selected, mathFacts }) => {
          const F = globalThis.AIFeedback;
          const adapters = globalThis.__ctmContextTestAdapters;
          const initialTabs = [...document.querySelectorAll('.tab-pane.active')];
          const compact = value => String(value).replace(/…/g, '...').replace(/[‘’]/g, "'")
            .replace(/[“”]/g, '"').replace(/[\s\\]/gu, '').toLowerCase();
          const must = (condition, message) => { if (!condition) throw new Error(message); };
          const factsPresent = (payload, facts, label) => {
            const text = payload.materials.map(material => material.text).join('\n');
            for (const fact of facts) must(compact(text).includes(compact(fact)), label + ': required context fact missing: ' + fact);
            must(!text.includes('def check(') && !text.includes('assert np.'), label + ': grading implementation entered context');
          };
          function showTab(pane) {
            const trigger = [...document.querySelectorAll('[data-bs-target],a[href]')].find(node =>
              node.getAttribute('data-bs-target') === '#' + pane.id || node.getAttribute('href') === '#' + pane.id);
            if (trigger && globalThis.bootstrap?.Tab) bootstrap.Tab.getOrCreateInstance(trigger).show();
          }
          function view(opened, button) {
            for (const pane of initialTabs) showTab(pane);
            if (opened && button) {
              const panes = [];
              for (let node = button.parentElement; node; node = node.parentElement) {
                if (node.matches('.tab-pane')) panes.unshift(node);
              }
              for (const pane of panes) showTab(pane);
            }
            globalThis.CTMReveal?.select(opened ? 'reading' : 'lecture');
            document.querySelectorAll('details').forEach(details => { details.open = opened; });
          }
          function checkSelection(materials, refs, label) {
            const ids = refs.split(',').map(id => id.trim()).filter(id => id && !id.startsWith('jsxgraph:'));
            const expected = [...new Set(ids)];
            const chosen = materials.filter(material => expected.includes(material.id));
            must(JSON.stringify(chosen.map(material => material.id)) === JSON.stringify(expected), label + ': an explicit context was skipped or reordered');
            must(chosen.reduce((length, material) => length + material.text.length, 0) <= 6000, label + ': explicit context exceeded 6000 characters');
          }
          const result = { ide: [], math: [], readonly: [], mockFetches: 0, negativeChecks: 0 };
          async function collect(adapter) {
            const request = await adapter.getRequest({ hintLevel: 1 });
            return F.applyPolicy(adapter.integration, request, 1, adapter.policyDefaults, adapter.policySelection);
          }
          async function throughSDK(adapter, label, facts, refs) {
            const request = await collect(adapter);
            let body;
            const client = F.createClient({ baseUrl: 'https://mock.invalid/v1', model: 'context-audit', apiKey: '' }, {
              fetch: async (url, options) => {
                must(url === 'https://mock.invalid/v1/chat/completions', label + ': unexpected provider transport URL');
                result.mockFetches += 1;
                body = JSON.parse(options.body);
                return new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content: 'Vurder opplysningene i oppgaven.' } }] }), {
                  status: 200, headers: { 'Content-Type': 'application/json' },
                });
              },
            });
            // This is the real SDK normalization and message construction. Its
            // dependency-injected fetch never makes a browser network request.
            await client.request(request);
            const message = body.messages.find(message => message.role === 'user');
            const payload = JSON.parse(message.content);
            factsPresent(payload, facts, label);
            checkSelection(payload.materials, refs, label);
            return payload.materials;
          }
          for (const [label, contract] of Object.entries(selected)) {
            const cell = qpyodideCellDetails.find(cell => cell.options.label === label);
            const adapter = [...adapters.values()].find(adapter => adapter.integration === 'pyodide-interaktiv' && adapter.policySelection?.exercise === label);
            if (cell.options['read-only'] === true || cell.options['read-only'] === 'true') {
              must(!adapter, label + ': a read-only cell unexpectedly has a feedback adapter');
              const states = [];
              for (const opened of [false, true]) {
                view(opened);
                const materials = F.contextMaterials(cell.options.feedbackContext);
                factsPresent({ materials }, contract.facts, label);
                checkSelection(materials, contract.references.join(','), label);
                states.push(materials);
              }
              must(JSON.stringify(states[0]) === JSON.stringify(states[1]), label + ': read-only reference changed when opened');
              result.readonly.push(label);
              continue;
            }
            const states = [];
            for (const opened of [false, true]) {
              view(opened, adapter.button);
              states.push(await throughSDK(adapter, label, contract.facts, contract.references.join(',')));
            }
            must(JSON.stringify(states[0]) === JSON.stringify(states[1]), label + ': IDE context changed with tabs/details state');
            result.ide.push(label);
          }
          for (const cell of document.querySelectorAll('.math-exercise-cell')) {
            const label = cell.dataset.label;
            if (!mathFacts[label]) continue;
            const input = cell.querySelector('input');
            must(input, label + ': expected a learner response field');
            input.value = '0';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            const adapter = adapters.get('math-' + label);
            must(adapter, label + ': mathematics feedback adapter missing');
            const states = [];
            for (const opened of [false, true]) {
              view(opened, adapter.button);
              states.push(await throughSDK(adapter, label, mathFacts[label], cell.dataset.contextRefs));
            }
            must(JSON.stringify(states[0]) === JSON.stringify(states[1]), label + ': mathematics context changed with tabs/details state');
            result.math.push(label);
          }

          // Negative controls change only this disposable browser's authored
          // DOM, then use the same real request builders and factual assertions.
          // No serializer, request builder, checker or grading result is stubbed.
          if (selected['week6-gs-experiment']) {
            const expectFactFailure = async (adapter, facts, label, expectedFact) => {
              let rejected = false;
              try { factsPresent(await collect(adapter), facts, label); }
              catch (error) { rejected = error.message.includes('required context fact missing') && error.message.includes(expectedFact); }
              must(rejected, label + ': factual corruption control was accepted');
              result.negativeChecks += 1;
            };
            const math = adapters.get('math-week6-task-sweeps');
            const matrix = [...document.querySelectorAll('#week6-common-system [data-ai-feedback-tex]')]
              .find(node => node.dataset.aiFeedbackTex.startsWith('A='));
            must(matrix, 'Missing shared matrix for mathematics corruption control');
            const originalTex = matrix.dataset.aiFeedbackTex;
            matrix.dataset.aiFeedbackTex = originalTex.replace('2&1', '9&1');
            must(matrix.dataset.aiFeedbackTex !== originalTex, 'Matrix corruption control did not change the given');
            await expectFactFailure(math, mathFacts['week6-task-sweeps'], 'week6-task-sweeps', mathFacts['week6-task-sweeps'][0]);
            matrix.dataset.aiFeedbackTex = originalTex;
            factsPresent(await collect(math), mathFacts['week6-task-sweeps'], 'week6-task-sweeps');

            const label = 'week6-gs-experiment';
            const contract = selected[label];
            const adapter = [...adapters.values()].find(adapter => adapter.policySelection?.exercise === label);
            const shape = '(1+sweeps*n,n)';
            let textNode;
            for (const ref of contract.references) {
              const walker = document.createTreeWalker(document.getElementById(ref), NodeFilter.SHOW_TEXT);
              while (walker.nextNode()) if (walker.currentNode.data.includes(shape)) { textNode = walker.currentNode; break; }
              if (textNode) break;
            }
            must(textNode, 'Missing GS return shape for IDE corruption control');
            const originalText = textNode.data;
            textNode.data = originalText.replace(shape, '(1+sweeps,n)');
            await expectFactFailure(adapter, contract.facts, label, shape);
            textNode.data = originalText;
            factsPresent(await collect(adapter), contract.facts, label);
          }
          return result;
        }, { selected, mathFacts: checked.mathFacts });
        for (const label of result.ide) { requireThat(!observedIDE.has(label), 'Duplicate enabled IDE label: ' + label); observedIDE.add(label); }
        for (const label of result.math) { requireThat(!observedMath.has(label), 'Duplicate math label: ' + label); observedMath.add(label); }
        readonly.push(...result.readonly);
        totals.ide += result.ide.length * 2;
        totals.math += result.math.length * 2;
        totals.readonly += result.readonly.length * 2;
        totals.mockFetches += result.mockFetches;
        totals.negativeChecks += result.negativeChecks;
      } finally { await page.close(); }
    }
    requireThat(servedAdapterScripts === pages.length, 'The real rendered feedback scripts were not observed on every page.');
    requireThat(observedIDE.size === 262 && totals.ide === 524, 'Not all 262 enabled IDE adapters were checked in both states.');
    requireThat(readonly.length === 1 && readonly[0] === 'error-scale', 'Unexpected read-only feedback coverage.');
    requireThat(observedMath.size === 32 && totals.math === 64, 'Not all 32 mathematics adapters were checked in both states.');
    requireThat(totals.mockFetches === 588, 'The expected 588 requests did not pass through the actual SDK.');
    requireThat(totals.negativeChecks === 2, 'Both factual corruption controls must be rejected.');
    requireThat(providerNetworkAttempts === 0, 'A provider network request was attempted.');
    process.stdout.write(JSON.stringify({ passed: true, pages: pages.length,
      staticIDEContexts: checked.summary.ide_dependency_context_checks, enabledIDEAdapters: observedIDE.size,
      mathAdapters: observedMath.size, mockedSDKRequests: totals.mockFetches,
      readonlyContextStates: totals.readonly, negativeChecks: totals.negativeChecks,
      largestExplicitContextChars: checked.summary.largest_explicit_context_chars,
      providerNetworkAttempts, blockedExternalAssets }) + '\n');
  } finally {
    if (browser) await browser.close();
    server.closeAllConnections();
    if (server.listening) await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  process.stdout.write(JSON.stringify({ passed: false, error: String(error.message).slice(0, 1000) }) + '\n');
  process.exitCode = 1;
});
