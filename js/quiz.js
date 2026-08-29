// Question selection + multiple-choice generation.
// The knowledge bank has no distractors, so wrong options are borrowed from
// other answers in the same topic, rejecting any that overlap the correct
// answer too much (those could read as correct too).

const STOP = new Set(('a an the of to in for and or is are be that with by on as it its from ' +
  'which this these those at into using used use can may not no such via each per').split(' '));

const words = (s) => new Set(
  s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/)
    .filter(w => w.length > 2 && !STOP.has(w))
);

function jaccard(a, b) {
  let hit = 0;
  for (const w of a) if (b.has(w)) hit++;
  const union = a.size + b.size - hit;
  return union ? hit / union : 0;
}

export function shuffle(arr, rnd = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Deterministic PRNG so a given exam renders the same options on re-render.
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

export const hashId = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};

/**
 * Build multiple-choice options for `q`.
 * Returns {options:[{text, id}], answerIndex}.
 */
export function makeChoices(q, pool, lang = 'en', n = 4, seed = null) {
  const key = lang === 'el' ? 'ag' : 'ae';
  const rnd = rng(seed ?? hashId(q.id + key));
  const correct = q[key];
  const cw = words(correct);
  const len = correct.length;

  const sameTopic = pool.filter(p => p.id !== q.id && p.t === q.t);
  const others = pool.filter(p => p.id !== q.id && p.t !== q.t);

  const pick = (cands) => shuffle(cands, rnd)
    .filter(p => {
      const t = p[key];
      if (!t || t === correct) return false;
      if (jaccard(words(t), cw) > 0.45) return false;          // too close to the real answer
      return Math.abs(t.length - len) < Math.max(140, len);     // keep lengths comparable
    });

  const chosen = [];
  const seen = new Set([correct]);
  for (const cand of [...pick(sameTopic), ...pick(others)]) {
    const t = cand[key];
    if (seen.has(t)) continue;
    if (chosen.some(c => jaccard(words(c[key]), words(t)) > 0.6)) continue; // near-dupe options
    seen.add(t); chosen.push(cand);
    if (chosen.length === n - 1) break;
  }

  const options = shuffle([{ text: correct, id: q.id }, ...chosen.map(c => ({ text: c[key], id: c.id }))], rnd);
  return { options, answerIndex: options.findIndex(o => o.id === q.id) };
}

const PRIORITY = { critical: 3, high: 2, medium: 1 };

/**
 * Sample `count` questions weighted by topic priority (a critical topic is
 * drawn ~3x as often per question as a medium one), without repeats.
 */
export function buildExam(questions, topics, count, { topicIds = null, difficulty = null } = {}) {
  let pool = questions;
  if (topicIds?.length) pool = pool.filter(q => topicIds.includes(q.t));
  if (difficulty?.length) pool = pool.filter(q => difficulty.includes(q.d));
  if (!pool.length) return [];

  const w = Object.fromEntries(topics.map(t => [t.id, PRIORITY[t.priority] || 1]));
  const bag = shuffle(pool);
  const picked = [];
  const rest = [];
  for (const q of bag) {
    // weighted acceptance: critical always, high 2/3, medium 1/3
    if (Math.random() < (w[q.t] || 1) / 3) picked.push(q); else rest.push(q);
    if (picked.length === count) break;
  }
  while (picked.length < count && rest.length) picked.push(rest.pop());
  return shuffle(picked).slice(0, count);
}

/** Loose keyword scoring for self-typed answers: how much of the model answer was hit. */
export function scoreWritten(typed, model) {
  const t = words(typed), m = words(model);
  if (!m.size) return 0;
  let hit = 0;
  for (const w of m) if (t.has(w)) hit++;
  return hit / m.size;
}
