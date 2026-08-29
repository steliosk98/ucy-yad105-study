// node tests/check.mjs  — sanity checks over the real question bank.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeChoices, buildExam, scoreWritten, rng } from '../js/quiz.js';

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

console.log(`ok — ${questions.length} questions, ${topics.length} topics, MCQ + exam builder pass`);
