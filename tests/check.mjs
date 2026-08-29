// node tests/check.mjs  — sanity checks over the real question bank.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeChoices, buildExam, scoreWritten, rng } from '../js/quiz.js';

// store.js persists to localStorage; node has none, so stub it before importing.
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
const S = await import('../js/store.js');

const bank = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url), 'utf8'));
const { questions, topics } = bank;

// --- data integrity ---
assert.equal(questions.length, 463, 'question count');
assert.equal(new Set(questions.map(q => q.id)).size, questions.length, 'unique ids');
const topicIds = new Set(topics.map(t => t.id));
for (const q of questions) {
  for (const k of ['qe', 'qg', 'ae', 'ag']) assert.ok(q[k]?.trim(), `${q.id} missing ${k}`);
  assert.ok(topicIds.has(q.t), `${q.id} unknown topic ${q.t}`);
  assert.ok(['easy', 'medium', 'hard'].includes(q.d), `${q.id} bad difficulty`);
}

// --- multiple choice generation ---
let thin = 0;
for (const lang of ['en', 'el']) {
  for (const q of questions) {
    const { options, answerIndex } = makeChoices(q, questions, lang, 4);
    const key = lang === 'el' ? 'ag' : 'ae';
    assert.ok(answerIndex >= 0, `${q.id} correct answer missing from options`);
    assert.equal(options[answerIndex].text, q[key], `${q.id} answer index wrong`);
    assert.equal(new Set(options.map(o => o.text)).size, options.length, `${q.id} duplicate options`);
    if (options.length < 4) thin++;
  }
}
assert.ok(thin === 0, `${thin} questions got fewer than 4 options`);

// stable across calls (same seed => same order)
const a = makeChoices(questions[7], questions, 'en').options.map(o => o.id);
const b = makeChoices(questions[7], questions, 'en').options.map(o => o.id);
assert.deepEqual(a, b, 'choices must be deterministic');

// --- exam builder ---
for (const n of [10, 25, 60, 120]) {
  const ex = buildExam(questions, topics, n);
  assert.equal(ex.length, n, `exam size ${n}`);
  assert.equal(new Set(ex.map(q => q.id)).size, n, 'no repeats in exam');
}
const filtered = buildExam(questions, topics, 20, { topicIds: ['sql'], difficulty: ['easy', 'medium'] });
assert.ok(filtered.every(q => q.t === 'sql' && q.d !== 'hard'), 'filters respected');
assert.equal(buildExam(questions, topics, 500).length, questions.length, 'caps at pool size');
assert.equal(buildExam(questions, topics, 10, { topicIds: ['nope'] }).length, 0, 'empty pool is empty');

// --- written scoring ---
assert.equal(scoreWritten('', 'primary key uniquely identifies a row'), 0);
assert.ok(scoreWritten('a primary key uniquely identifies each row', 'primary key uniquely identifies a row') > 0.7);
assert.ok(scoreWritten('completely unrelated banana text', 'primary key uniquely identifies a row') < 0.2);

// --- rng ---
const r = rng(42), r2 = rng(42);
assert.deepEqual([r(), r(), r()], [r2(), r2(), r2()], 'seeded rng repeats');

// --- spaced repetition ---
{
  const id = 'Q001';
  assert.equal(S.nextInterval(id, 0), 0, 'Again comes back the same session');
  assert.equal(S.nextInterval(id, 3), 1, 'first Hard is a day');
  assert.equal(S.nextInterval(id, 4), 1, 'first Good is a day');
  assert.equal(S.nextInterval(id, 5), 4, 'first Easy jumps further than Good');

  // the button preview must match what grading actually schedules
  for (const grade of [3, 4, 5]) {
    S.reset();
    const predicted = S.nextInterval(id, grade);
    const card = S.schedule(id, grade);
    assert.equal(card.iv, predicted, `preview != scheduled for grade ${grade}`);
  }

  S.reset();
  S.schedule(id, 4); S.schedule(id, 4);            // two good reviews
  assert.equal(S.state.srs[id].iv, 3, 'second Good is three days');
  const third = S.schedule(id, 4).iv;
  assert.ok(third > 3, 'intervals keep growing');
  assert.ok(!S.isDue(id), 'a scheduled card is not due yet');

  S.schedule(id, 0);
  assert.ok(S.isDue(id, Date.now() + 61e3), 'a lapse comes back within the session');
  assert.equal(S.state.srs[id].lapses, 1, 'lapse counted');

  S.reset();
  S.record(id, false);
  assert.ok(S.isWeak(id), 'one miss marks a weak spot');
  S.record(id, true); S.record(id, true);
  assert.ok(!S.isWeak(id), 'answering it right clears the weak flag');
  S.reset();
}

console.log(`ok — ${questions.length} questions, ${topics.length} topics; MCQ, exam builder and scheduler pass`);
