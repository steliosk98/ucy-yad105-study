import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { curriculum, freshLearning, localDay, learningStreak, beginLesson, advanceStudy, assess, completeLesson } from '../js/learn.js';
import { copy, createLearning } from '../js/learn-view.js';

const storage = new Map();
globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) };
const S = await import('../js/store.js');
const bank = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url)));
const lessons = curriculum(bank);
assert.deepEqual(lessons.flatMap(l => l.ids), bank.topics.flatMap(t => bank.questions.filter(q => q.t === t.id).map(q => q.id)));
assert.equal(new Set(lessons.flatMap(l => l.ids)).size, 463);
assert.ok(lessons.every(l => l.ids.length >= 1 && l.ids.length <= 5));
assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.el).sort());
assert.ok(Object.values(copy.el).every(v => /[Α-ω]/.test(v)));

const learn = freshLearning();
learn.active = beginLesson(lessons[0]);
const a = learn.active;
assert.equal(assess(a, true), null, 'cannot skip study');
assert.equal(completeLesson(learn), 0, 'cannot award unfinished lesson');
for (const id of a.ids) advanceStudy(a);
assert.equal(a.phase, 'recall');
assert.equal(assess(a, true), null, 'must compare answer before self grading');
a.revealed = true;
assert.equal(assess(a, false).first, true);
assert.equal(a.queue.at(-1), a.ids[0], 'miss returns after remaining questions');
while (!a.done) { a.revealed = true; assess(a, true); }
const date = new Date(2026, 8, 9, 23, 59);
assert.equal(completeLesson(learn, date), 50);
assert.equal(completeLesson(learn, date), 0, 'completion is idempotent');
assert.equal(learn.days['2026-09-09'], 1);
assert.equal(Object.values(a.answers).filter(Boolean).length, 4);

// Complete every lesson in one local day: never impose a daily cap.
for (const l of lessons) {
  learn.active = beginLesson(l);
  for (const id of l.ids) advanceStudy(learn.active);
  while (!learn.active.done) { learn.active.revealed = true; assess(learn.active, true); }
  completeLesson(learn, date);
}
assert.equal(Object.keys(learn.completed).length, lessons.length);
assert.equal(Object.values(learn.completed).reduce((n,l) => n+l.xp,0), 4630, 'replays do not duplicate XP');
assert.equal(learn.days['2026-09-09'], lessons.length + 1);
assert.equal(localDay(date), '2026-09-09');
assert.equal(learningStreak({ '2026-09-08': 1, '2026-09-09': 2 }, date), 2);
assert.equal(learningStreak({ '2026-09-08': 1 }, date), 1, 'yesterday streak remains until day ends');
assert.equal(learningStreak({ '2026-09-07': 1 }, date), 0);
assert.equal(learningStreak({ '2026-12-31': 1, '2027-01-01': 1 }, new Date(2027,0,1)), 2);

// Persistence and migration through the real Settings backup API.
S.state.learning = learn;
learn.active = beginLesson(lessons[2]);
learn.active.text = 'δοκιμή <SQL> & answer';
S.flush();
assert.deepEqual(JSON.parse(storage.get('yad105.v1')).learning, learn);
const backup = S.exportData();
S.reset();
assert.equal(S.state.learning.active, null);
S.importData(backup);
assert.equal(S.state.learning.active.text, 'δοκιμή <SQL> & answer');
S.importData('{"srs":{},"lang":"el"}');
assert.deepEqual(S.state.learning, freshLearning(), 'old backups gain learning defaults');

// Exercise actual view actions and HTML in all language modes without a browser dependency.
const handlers = {};
globalThis.document = { addEventListener: (event,fn) => handlers[event] = fn, querySelector: () => null };
globalThis.location = { hash: '' };
const esc = s => String(s).replace(/[&<>\"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const ui = createLearning({ S, bank, esc, ico: () => '', topicName: id => bank.topics.find(t => t.id === id)[S.state.lang === 'el' ? 'el' : 'en'], render() {} });
ui.action('start', lessons[1].id);
assert.equal(S.state.learning.active, null, 'locked lessons cannot be started by action');
ui.action('start', lessons[0].id);
assert.equal(location.hash, '/learn/run');
ui.action('advance');
ui.action('path');
ui.action('resume');
assert.equal(S.state.learning.active.index, 1, 'pause/resume preserves position');
for (const lang of ['en','el','both']) {
  S.state.lang = lang;
  const html = ui.run();
  assert.ok(html.includes(bank.questions[1][lang === 'el' ? 'qg' : 'qe']));
  if (lang === 'both') assert.ok(html.includes(bank.questions[1].qg));
  assert.ok(ui.path().includes(copy[lang === 'el' ? 'el' : 'en'].resume));
}
while (S.state.learning.active.phase === 'study') ui.action('advance');
handlers.input({ target: { id:'learnAnswer', value:'<script>bad</script>' } });
assert.ok(ui.run().includes('&lt;script&gt;'));
assert.ok(!ui.run().includes('<script>'));
ui.action('reveal'); ui.action('assess', 'no');
while (!S.state.learning.active.done) { ui.action('reveal'); ui.action('assess', 'yes'); }
assert.equal(S.state.srs[lessons[0].ids[0]].lapses, 1);
assert.equal(S.state.stats[lessons[0].ids[0]].seen, 1, 'retry does not inflate stats/scheduling');
assert.ok(ui.run().includes(copy.en.done));
ui.action('start', lessons[1].id);
assert.equal(S.state.learning.active.lesson, lessons[1].id, 'next lesson starts immediately');
handlers.change({ target: { id: 'lessonGoal', value: '3' } });
assert.equal(S.state.learning.goal, 3);
S.flush();
console.log(`ok — ${lessons.length} lessons cover all 463 questions; recall, retries, unlocks, XP, dates, migration, backup and bilingual views pass`);
