// Actual course quiz tiles navigate real rendered components. AGPL-3.0-or-later.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

const foundation = path.resolve(process.env.CTM_ASSESSMENT_ROOT || '_ci/ctm-assessment');
const require = createRequire(path.join(foundation, 'package.json'));
const playwright = require('playwright');
const {serve} = await import(pathToFileURL(path.join(foundation, 'tools/compare-browser.mjs')));
const site = path.resolve(process.env.CTM_QUIZ_SITE || '_site');
const reports = path.resolve(process.env.CTM_QUIZ_REPORT_DIR || 'quiz-browser-reports');
const engine = process.env.CTM_QUIZ_BROWSER || 'chromium';
assert.ok(['chromium', 'firefox', 'webkit'].includes(engine));
const contract = JSON.parse(fs.readFileSync('tests/exercise-quizzes.json', 'utf8'));
assert.equal(contract.schema, 1);
assert.equal(contract.quizzes.length, 26);
assert.equal(contract.quizzes.reduce((n, q) => n + q.exercises.length, 0), 176);
fs.mkdirSync(reports, {recursive: true});
const server = await serve({course: site}, true);
const origin = 'http://127.0.0.1:' + server.address().port + '/course/';
const results = [], errors = [], screenshots = [];
let browser;
let currentPage;
let failure = null;

async function clickTab(page, tabId) {
  // IDs are compared as data; course labels never become selector code.
  const handle = await page.evaluateHandle(id => document.getElementById(id), tabId);
  const element = handle.asElement();
  assert.ok(element, 'tab control exists: ' + tabId);
  try { await element.click(); } finally { await handle.dispose(); }
}
async function showSlot(page, quizId) {
  const layers = await page.evaluate(id => {
    const slot = [...document.querySelectorAll('.ctm-progress-slot[data-ctm-quiz]')]
      .find(e => e.getAttribute('data-ctm-quiz') === id);
    if (!slot) throw Error('Missing quiz marker ' + id);
    const ids = [];
    for (let p = slot.parentElement; p; p = p.parentElement) {
      if (p.classList.contains('tab-pane')) ids.unshift(p.getAttribute('aria-labelledby'));
    }
    if (ids.some(id => !id)) throw Error('Quiz pane has no tab control');
    return ids;
  }, quizId);
  for (const id of layers) await clickTab(page, id);
}
async function prepareHiddenTarget(page, quiz, member) {
  // Close actual native details and choose a real sibling tab below the
  // panel's own scope. No navigation implementation or editor is replaced.
  const preparation = await page.evaluate(({quiz, member}) => {
    const slot = [...document.querySelectorAll('.ctm-progress-slot[data-ctm-quiz]')]
      .find(e => e.getAttribute('data-ctm-quiz') === quiz);
    const roots = [...document.querySelectorAll('[data-ctm-id][data-ctm-component]')]
      .filter(e => e.getAttribute('data-ctm-id') === member.id &&
        e.getAttribute('data-ctm-component') === member.component);
    if (roots.length !== 1) throw Error('Expected one graded target: ' + member.id);
    const target = roots[0], details = [], tabs = [];
    for (let p = target.parentElement; p; p = p.parentElement) {
      if (p.tagName === 'DETAILS' && !p.contains(slot) && p.open) {
        const summary = p.querySelector(':scope > summary');
        if (summary) details.push(summary);
      }
      if (p.classList.contains('tab-pane') && !p.contains(slot)) {
        const other = [...p.parentElement.children].find(e =>
          e !== p && e.classList.contains('tab-pane') && e.getAttribute('aria-labelledby'));
        if (other) tabs.push(other.getAttribute('aria-labelledby'));
      }
    }
    return {details: details.length, tabs, hasDetails: Boolean(target.closest('details'))};
  }, {quiz: quiz.id, member});
  // Close inner details first while their summaries are still reachable.
  for (let index = 0; index < preparation.details; index++) {
    const handle = await page.evaluateHandle(({quiz, member}) => {
      const slot = [...document.querySelectorAll('.ctm-progress-slot[data-ctm-quiz]')]
        .find(e => e.getAttribute('data-ctm-quiz') === quiz);
      const target = [...document.querySelectorAll('[data-ctm-id][data-ctm-component]')]
        .find(e => e.getAttribute('data-ctm-id') === member.id &&
          e.getAttribute('data-ctm-component') === member.component);
      for (let p = target.parentElement; p; p = p.parentElement) {
        if (p.tagName === 'DETAILS' && p.open && !p.contains(slot))
          return p.querySelector(':scope > summary');
      }
      return null;
    }, {quiz: quiz.id, member});
    const summary = handle.asElement();
    if (summary && await summary.isVisible()) await summary.click();
    await handle.dispose();
  }
  // Inner pane controls may be inside a closed details; switch only a
  // reachable control, recording exactly what was exercised.
  let switched = 0;
  for (const id of preparation.tabs) {
    const handle = await page.evaluateHandle(id => document.getElementById(id), id);
    const tab = handle.asElement();
    if (tab && await tab.isVisible()) { await tab.click(); switched++; }
    await handle.dispose();
  }
  return {...preparation, switched};
}
async function targetState(page, member) {
  return page.evaluate(member => {
    const roots = [...document.querySelectorAll('[data-ctm-id][data-ctm-component]')]
      .filter(e => e.getAttribute('data-ctm-id') === member.id &&
        e.getAttribute('data-ctm-component') === member.component);
    if (roots.length !== 1) return {count: roots.length};
    const target = roots[0], panes = [], details = [], callouts = [];
    for (let p = target; p; p = p.parentElement) {
      if (p.classList.contains('tab-pane')) panes.push({id: p.id, active: p.classList.contains('active')});
      if (p.tagName === 'DETAILS') details.push(p.open);
      if (p.classList.contains('callout-collapse')) callouts.push(p.classList.contains('show'));
    }
    const header = document.getElementById('quarto-header');
    const fixed = header && ['fixed', 'sticky'].includes(getComputedStyle(header).position);
    const headerBottom = fixed ? header.getBoundingClientRect().bottom : 0;
    const rect = target.getBoundingClientRect();
    return {count: 1, focused: document.activeElement === target,
      visible: target.getClientRects().length > 0, top: rect.top,
      headerBottom, height: innerHeight, panes, details, callouts,
      mark: target.getAttribute('data-ctm-nav')};
  }, member);
}
function navigated(state) {
  return state.count === 1 && state.visible && state.focused && state.mark === 'api' &&
    state.panes.every(p => p.active) && state.details.every(Boolean) && state.callouts.every(Boolean) &&
    state.top >= state.headerBottom - 2 && state.top < state.height;
}

try {
  browser = await playwright[engine].launch({headless: true});
  for (const width of [1280, 390]) {
    const context = await browser.newContext({viewport: {width, height: 900}});
    const page = await context.newPage();
    currentPage = page;
    page.setDefaultTimeout(30000);
    page.on('pageerror', error => errors.push({kind: 'pageerror', width, url: page.url(), message: error.message, stack: error.stack}));
    page.on('console', message => {
      if (message.type() === 'error') errors.push({kind: 'console.error', width, url: page.url(),
        message: message.text(), location: message.location(),
        frameURLs: page.frames().map(frame => frame.url())});
    });
    const pages = [...new Set(contract.quizzes.map(q => q.page))];
    const shots = new Set();
    for (const file of pages) {
      assert.ok(!file.startsWith('/') && !file.split('/').includes('..') && file.endsWith('.html'), 'safe course page');
      await page.goto(origin + file, {waitUntil: 'domcontentloaded'});
      await page.waitForFunction(() => window.CTMNav && window.CTMStore && document.querySelector('.ctm-progress'));
      const quizzes = contract.quizzes.filter(q => q.page === file);
      const rendered = await page.evaluate(() => JSON.parse(document.getElementById('ctm-store-manifest').textContent));
      for (const quiz of quizzes) {
        assert.deepEqual(rendered.exercises.filter(e => e.quiz === quiz.id &&
          ['math-exercise', 'py-exercise'].includes(e.component))
          .sort((a, b) => a.order - b.order).map(e => ({component: e.component, id: e.id})), quiz.exercises);
        await showSlot(page, quiz.id);
        const slots = page.locator('.ctm-progress-slot[data-ctm-quiz]');
        const index = await slots.evaluateAll((nodes, id) => nodes.findIndex(e =>
          e.getAttribute('data-ctm-quiz') === id), quiz.id);
        assert.ok(index >= 0, 'quiz slot exists');
        const panel = slots.nth(index).locator('.ctm-progress');
        assert.equal(await panel.count(), 1, 'one live quiz panel');
        const total = await panel.locator('.ctm-progress-total').innerText();
        assert.deepEqual((total.match(/\d+/g) || []).map(Number), [0, quiz.exercises.length], 'fresh total is zero of the exact membership count');
        const tiles = panel.locator('ol > li > button');
        assert.equal(await tiles.count(), quiz.exercises.length, 'one tile per authored member');
        assert.deepEqual(await tiles.evaluateAll(nodes => nodes.map(e => e.dataset.status)),
          quiz.exercises.map(() => 'unattempted'), 'fresh context has no seeded grades');
        assert.deepEqual(await tiles.evaluateAll(nodes => nodes.map(e => Number(e.textContent.match(/^(\d+)\./)?.[1]))),
          quiz.exercises.map((_, i) => i + 1), 'numbered source order');
        if (quiz.exercises.length > 1 && !shots.has('quiz-panel')) {
          await panel.scrollIntoViewIfNeeded();
          const name = engine + '-' + width + '-quiz-panel.png';
          await page.screenshot({path: path.join(reports, name), fullPage: false});
          screenshots.push({name, width, kind: 'quiz-panel', file, quiz: quiz.id});
          shots.add('quiz-panel');
        }
        for (const [memberIndex, member] of quiz.exercises.entries()) {
          await showSlot(page, quiz.id);
          const prepared = await prepareHiddenTarget(page, quiz, member);
          const before = await targetState(page, member);
          await tiles.nth(memberIndex).click();
          let state;
          for (let attempt = 0; attempt < 100; attempt++) {
            state = await targetState(page, member);
            if (navigated(state)) break;
            await new Promise(resolve => setTimeout(resolve, 20));
          }
          assert.ok(navigated(state), JSON.stringify({file, quiz: quiz.id, member, state}));
          results.push({engine, width, file, quiz: quiz.id, member, prepared, before, state});
          const kinds = [];
          if (before.panes.some(p => !p.active)) kinds.push('nested-tabs');
          if (before.details.some(open => !open)) kinds.push('reveal');
          for (const kind of kinds) {
            if (shots.has(kind)) continue;
            const name = engine + '-' + width + '-' + kind + '.png';
            await page.screenshot({path: path.join(reports, name), fullPage: false});
            screenshots.push({name, width, kind, file, quiz: quiz.id, member});
            shots.add(kind);
          }
        }
      }
    }
    const covered = results.filter(r => r.width === width);
    assert.equal(covered.length, 176, 'all actual members at width ' + width);
    assert.ok(covered.some(r => r.before.panes.some(p => !p.active)), 'activate an inactive nested pane at width ' + width);
    // All 176 authored graded roots in this contract are outside native
    // reveals. Record that actual course boundary; foundation fixtures own
    // reveal navigation proof rather than adding synthetic course content.
    assert.equal(covered.filter(r => r.before.details.length > 0).length, 0,
      'this actual course contract has zero graded targets inside reveals at width ' + width);
    assert.deepEqual([...shots].sort(), ['nested-tabs', 'quiz-panel'], 'representative panel and nested-tab screenshots at width ' + width);
    await context.close();
  }
  assert.equal(results.length, 352, 'all 176 members at desktop and 390px');
  assert.deepEqual(errors, [], 'no uncaught errors on actual course pages');
} catch (error) {
  failure = {message: error.message, stack: error.stack};
  if (currentPage && !currentPage.isClosed()) {
    await currentPage.screenshot({path: path.join(reports, engine + '-failure.png'), fullPage: false}).catch(() => {});
  }
  throw error;
} finally {
  const coverage = [1280, 390].map(width => {
    const rows = results.filter(r => r.width === width);
    return {width, checks: rows.length,
      targetsInsideReveals: rows.filter(r => r.before.details.length > 0).length,
      closedRevealsOpened: rows.filter(r => r.before.details.some(open => !open)).length,
      inactivePanesActivated: rows.filter(r => r.before.panes.some(p => !p.active)).length};
  });
  const report = {engine, coverage, screenshots, checks: results.length, expectedChecks: 352, results, errors, failure,
    url: currentPage?.url(), boundary: 'Navigation/focus and nested-tab evidence. The 176 actual graded roots are outside reveals; no reveal-transition proof is claimed. Horizontal access to wide math is not asserted.'};
  fs.writeFileSync(path.join(reports, engine + '.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({engine, checks: report.checks, errors}, null, 2));
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
