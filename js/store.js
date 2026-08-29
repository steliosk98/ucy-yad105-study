// Persistent state: SRS scheduling, per-question stats, exam history, settings.
const KEY = 'yad105.v1';
const DAY = 864e5;

const defaults = () => ({
  v: 1,
  lang: 'en',          // en | el | both
  theme: 'auto',       // auto | light | dark
  dailyGoal: 30,
  examDate: '',        // YYYY-MM-DD, drives the suggested daily pace
  srs: {},             // id -> {ef, iv, rep, due, lapses, last}
  stats: {},           // id -> {seen, ok, bad}
  starred: [],
  exams: [],           // {ts, mode, score, total, secs, topics, wrong:[ids]}
  days: {},            // 'YYYY-MM-DD' -> cards reviewed
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    return Object.assign(defaults(), JSON.parse(raw));
  } catch {
    return defaults();
  }
}

export const state = load();

let pending = null;
export function save() {
  clearTimeout(pending);
  pending = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('save failed', e); }
  }, 120);
}

export const today = (d = new Date()) => d.toISOString().slice(0, 10);

// ---------- SRS (SM-2, trimmed) ----------
// grade: 0 again | 3 hard | 4 good | 5 easy
export function schedule(id, grade) {
  const now = Date.now();
  const c = state.srs[id] || { ef: 2.5, iv: 0, rep: 0, due: now, lapses: 0, last: 0 };
  if (grade < 3) {
    c.rep = 0; c.iv = 0; c.lapses++;
    c.due = now + 6e4;                       // back in ~1 min, same session
  } else {
    c.ef = Math.max(1.3, c.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
    c.rep++;
    c.iv = c.rep === 1 ? 1 : c.rep === 2 ? 3 : Math.round(c.iv * c.ef);
    if (grade === 3) c.iv = Math.max(1, Math.round(c.iv * 0.6));
    c.due = now + c.iv * DAY;
  }
  c.last = now;
  state.srs[id] = c;

  const d = today();
  state.days[d] = (state.days[d] || 0) + 1;
  save();
  return c;
}

export const isDue = (id, at = Date.now()) => !state.srs[id] || state.srs[id].due <= at;
export const isNew = (id) => !state.srs[id];

// A card counts as "learned" once it has survived to a multi-day interval.
export const isLearned = (id) => (state.srs[id]?.iv || 0) >= 7;

export function record(id, correct) {
  const s = state.stats[id] || { seen: 0, ok: 0, bad: 0 };
  s.seen++; correct ? s.ok++ : s.bad++;
  state.stats[id] = s;
  save();
}

export function accuracy(id) {
  const s = state.stats[id];
  return s && s.seen ? s.ok / s.seen : null;
}

export function toggleStar(id) {
  const i = state.starred.indexOf(id);
  i < 0 ? state.starred.push(id) : state.starred.splice(i, 1);
  save();
  return i < 0;
}
export const isStarred = (id) => state.starred.includes(id);

// Weak = missed at least once and still under 60% right, or lapsed twice.
// One miss is enough to earn a drill: that is the point of practising.
export function isWeak(id) {
  const s = state.stats[id], c = state.srs[id];
  if (s && s.bad > 0 && s.ok / s.seen < 0.6) return true;
  return (c?.lapses || 0) >= 2;
}

export function streak() {
  let n = 0;
  const d = new Date();
  if (!state.days[today(d)]) d.setTime(d.getTime() - DAY);   // today not studied yet: still count yesterday
  for (;;) {
    if (!state.days[today(d)]) break;
    n++; d.setTime(d.getTime() - DAY);
  }
  return n;
}

export function reset() {
  localStorage.removeItem(KEY);
  Object.assign(state, defaults());
}

export function exportData() {
  return JSON.stringify(state, null, 2);
}

export function importData(json) {
  const o = JSON.parse(json);
  if (!o || typeof o !== 'object' || !('srs' in o)) throw new Error('Not a YAD105 backup file');
  Object.assign(state, defaults(), o);
  save();
}
