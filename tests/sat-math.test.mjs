import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../www/sat/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../www/sat/styles.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../www/sat/app.js', import.meta.url), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('../www/sat/manifest.webmanifest', import.meta.url), 'utf8'));
const capacitor = JSON.parse(readFileSync(new URL('../sat-app/capacitor.config.json', import.meta.url), 'utf8'));

test('Orbit exposes the complete adaptive SAT Math study surface', () => {
  for (const expected of ['Orbit', 'SAT Math', 'Practice with purpose', 'Mistake journal', 'Learner + parent view', 'Bluebook', 'Start diagnostic']) {
    assert.match(`${html}\n${js}`, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
  for (const route of ['home', 'practice', 'review', 'progress']) {
    assert.match(html, new RegExp(`id="view-${route}"`));
    assert.match(html, new RegExp(`data-route="${route}"`));
  }
});

test('question bank covers every current SAT Math domain with original coaching', () => {
  for (const domain of ['algebra', 'advanced', 'data', 'geometry']) {
    assert.match(js, new RegExp(`domain: '${domain}'`));
  }
  const questionIds = [...js.matchAll(/id: '(?:alg|adv|data|geo)-\d+'/g)];
  assert.ok(questionIds.length >= 16, 'expected a useful initial bank of at least 16 original questions');
  assert.match(js, /hint:/);
  assert.match(js, /explanation:/);
  assert.match(js, /const DIAGNOSTIC_IDS/);
});

test('progress is private, persistent, and resilient to invalid local data', () => {
  assert.match(js, /localStorage\.setItem\(STORAGE_KEY/);
  assert.match(js, /localStorage\.removeItem\(STORAGE_KEY\)/);
  assert.match(js, /recovered from invalid saved progress/);
  assert.match(html, /stored only on this device/i);
  assert.match(html, /does not collect or sell learner data/i);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /Skip to study content/);
});

test('web app is installable, offline-capable, responsive, and Capacitor-ready', () => {
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.equal(capacitor.webDir, '../www/sat');
  assert.equal(capacitor.appId, 'com.sandboxdigitallabs.orbitsatmath');
  assert.ok(existsSync(new URL('../www/sat/sw.js', import.meta.url)));
  assert.ok(existsSync(new URL('../www/sat/icon.svg', import.meta.url)));
  assert.match(js, /serviceWorker\.register/);
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test('score estimate is presented as an estimate and official scoring stays with Bluebook', () => {
  assert.match(html, /Estimated level/i);
  assert.match(html, /Use Bluebook every two weeks/i);
  assert.match(html, /official, scored Bluebook practice test/i);
  assert.match(js, /function estimatedScore\(/);
  assert.doesNotMatch(`${html}\n${js}`, /guarantee(?:d|s)? (?:a )?680/i);
});
