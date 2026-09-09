// Short, stable lessons over the entire bank; no calendar locks or lives.
export const freshLearning = () => ({ completed: {}, days: {}, active: null, goal: 1 });
export function curriculum(bank) {
  return bank.topics.flatMap(topic => {
    const questions = bank.questions.filter(q => q.t === topic.id);
    const lessons = [];
    for (let i = 0; i < questions.length; i += 5) {
      const ids = questions.slice(i, i + 5).map(q => q.id);
      lessons.push({ id: ids.join('-'), topic: topic.id, number: lessons.length + 1, ids });
    }
    return lessons;
  });
}
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function learningStreak(days, now = new Date()) {
  const d = new Date(now); let count = 0;
  if (!days[localDay(d)]) d.setDate(d.getDate() - 1);
  while (days[localDay(d)]) { count++; d.setDate(d.getDate() - 1); }
  return count;
}
export function beginLesson(lesson) {
  return { lesson: lesson.id, ids: [...lesson.ids], phase: 'study', index: 0,
    queue: [...lesson.ids], revealed: false, text: '', answers: {}, misses: 0, done: false };
}
export function advanceStudy(active) {
  if (active.phase !== 'study' || active.done) return;
  active.index++;
  if (active.index === active.ids.length) { active.phase = 'recall'; active.index = 0; }
}
export function assess(active, correct) {
  if (active.phase !== 'recall' || !active.revealed || active.done) return null;
  const id = active.queue[0];
  const first = !(id in active.answers);
  if (first) active.answers[id] = correct;
  if (!correct) { active.misses++; active.queue.push(id); }
  active.queue.shift(); active.revealed = false; active.text = '';
  active.done = active.queue.length === 0;
  return { id, first, correct };
}
export function completeLesson(learning, date = new Date()) {
  const a = learning.active;
  if (!a?.done || a.credited) return 0;
  const xp = learning.completed[a.lesson] ? 0 : a.ids.length * 10;
  learning.completed[a.lesson] = learning.completed[a.lesson] || { date: localDay(date), xp };
  const day = localDay(date);
  learning.days[day] = (learning.days[day] || 0) + 1;
  a.credited = true; a.xp = xp;
  return xp;
}
