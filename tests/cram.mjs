import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CRAM, cramCurriculum } from '../js/cram.js';
import { createLearning, copy } from '../js/learn-view.js';
import { beginLesson, curriculum } from '../js/learn.js';
const bank = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url)));
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.document = { addEventListener() {}, querySelector: () => null };
globalThis.location = { hash: '' };
const S = await import('../js/store.js');
assert.equal(S.state.learningMode, 'cram');
assert.equal(cramCurriculum(bank).length, 7);
assert.equal(new Set(CRAM.flatMap(l => l.ids)).size, 140);
assert.equal(new Set(CRAM.flatMap(l => l.ids).map(id => bank.questions.find(q => q.id === id).t)).size, 15, 'all topics represented, with emphasis on critical ones');
assert.throws(() => cramCurriculum({ questions: [] }), /Missing essential/);
for (const l of CRAM) {
  assert.equal(l.ids.length, 20);
  assert.equal(l.briefEn.length, 3);
  assert.equal(l.briefEl.length, 3);
  assert.ok(/[Α-ω]/.test(l.el));
  for (const line of l.briefEl) assert.ok(/[Α-ω]/.test(line));
}
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const ui = createLearning({ S, bank, esc, ico: () => '', topicName: id => id, render() {} });
assert.ok(ui.path().includes('0/140'));
assert.ok(ui.path().includes('0/7'));
assert.ok(!ui.path().includes('0/463'));
assert.ok(ui.path().includes(copy.en.noDue));
const fullLesson = curriculum(bank)[0];
S.state.learning.active = beginLesson(fullLesson);
S.state.learning.active.text = 'existing full-bank draft';
ui.action('start', CRAM[0].id);
ui.action('advance');
const active = S.state.cramLearning.active;
for (const lang of ['en','el','both']) {
  S.state.lang = lang;
  const l = CRAM[0];
  assert.ok(ui.run().includes(lang === 'el' ? esc(l.el) : esc(l.en)));
  assert.ok(ui.run().includes(esc(lang === 'el' ? l.briefEl[0] : l.briefEn[0])));
  if (lang === 'both') assert.ok(ui.run().includes(esc(l.briefEl[0])));
}
ui.action('mode', 'full');
assert.equal(S.state.learning.active.text, 'existing full-bank draft');
assert.ok(ui.path().includes('0/463'));
ui.action('mode', 'cram');
assert.equal(S.state.cramLearning.active, active);
assert.equal(active.index, 1);
S.importData(S.exportData());
assert.equal(S.state.cramLearning.active.index, 1, 'backup preserves cram position');
assert.equal(S.state.learning.active.text, 'existing full-bank draft');
S.state.lang = 'en';
for (const lesson of CRAM) {
  ui.action('start', lesson.id);
  while (S.state.cramLearning.active.phase === 'study') ui.action('advance');
  ui.action('reveal'); ui.action('assess', 'no');
  while (!S.state.cramLearning.active.done) { ui.action('reveal'); ui.action('assess', 'yes'); }
  assert.equal(S.state.cramLearning.active.xp, 200);
}
assert.equal(Object.keys(S.state.cramLearning.completed).length, 7);
assert.ok(ui.path().includes('140/140'));
assert.ok(ui.run().includes(copy.en.cramDone));
assert.ok(!ui.run().includes(copy.en.allDone));
assert.equal(Object.keys(S.state.learning.completed).length, 0, 'full-bank completion stays separate');
ui.action('review');
assert.equal(location.hash, '/cards/run?deck=cram&n=20');
ui.action('start', CRAM[0].id);
while (S.state.cramLearning.active.phase === 'study') ui.action('advance');
while (!S.state.cramLearning.active.done) { ui.action('reveal'); ui.action('assess', 'yes'); }
assert.equal(S.state.cramLearning.active.xp, 0, 'repeat days do not duplicate XP');
S.reset();
ui.action('start', CRAM[6].id);
assert.equal(S.state.cramLearning.active.lesson, CRAM[6].id, 'study ahead without calendar or sequence locks');
S.reset();
S.importData(JSON.stringify({ srs: {}, learning: { active: beginLesson(fullLesson), completed: {}, days: {}, goal: 1 } }));
assert.equal(S.state.learning.active.lesson, fullLesson.id);
assert.equal(S.state.cramLearning.active, null);
assert.equal(S.state.learningMode, 'cram');
console.log('ok — 7 curated bilingual days, 140 unique essentials, all topics, separate progress, old backups, replay and study-ahead');
