import { cramCurriculum } from './cram.js';
import { curriculum, freshLearning, localDay, learningStreak, beginLesson, advanceStudy, assess, completeLesson } from './learn.js';

export const copy = {
  en: {
    cram: '7-day SOS', full: 'Full question bank', day: 'Day', available: 'Ready to study',
    cramPath: 'Your 7-day exam sprint', cramIntro: '140 essentials · 20 questions a day · 7 focused lessons',
    cramHint: 'Aim for one lesson each day. You can study ahead. Allow roughly 60–90 minutes, including recall and review.',
    essentials: 'Essential questions covered', mustKnow: 'Must know', cramDone: 'You completed the 7-day essentials!',
    rationale: 'Selected for topic priority, core concepts and skills reused across practical scenarios.',
    routine: 'Daily routine: review yesterday’s due cards, study today’s essentials, then recall every answer without looking.',
    noDue: 'No essential cards due yet. Continue your lesson or return for review later.',
    learn: 'Learn', path: 'Your learning path', intro: 'Small lessons. The whole question bank. At your pace.',
    lesson: 'Lesson', lessons: 'Lessons', goal: 'Daily goal (lessons)', today: 'Lessons today', streak: 'Day streak',
    start: 'Start lesson', resume: 'Resume lesson', next: 'Next lesson', practice: 'Practise again',
    current: 'Up next', complete: 'Completed', locked: 'Complete the previous lesson to unlock',
    questions: 'questions', unit: 'Unit', xp: 'XP', pause: 'Save & return to path',
    study: 'Study', recall: 'Recall', studyHint: 'Read the model answer. You will recall it from memory next.',
    recallHint: 'Answer from memory, aloud or in writing. Then compare with the model answer.',
    answer: 'Model answer', write: 'Your answer (optional)', reveal: 'Compare answer',
    remembered: 'I recalled it', missed: 'Practise this again', continue: 'Continue', begin: 'Start recall',
    retry: 'Missed questions return until you recall them. There is no penalty for trying again.',
    done: 'Lesson complete!', doneHint: 'You recalled every question. Keep the momentum, or come back tomorrow.',
    covered: 'Questions covered', first: 'Recalled on first try', back: 'Back to path',
    allDone: 'You covered the whole bank!', review: 'Review due cards',
    goalDone: 'Daily goal reached. Another lesson is always welcome.',
    goalHint: 'A goal, not a limit. You can take as many lessons as you like.',
    resumeHint: 'Your lesson is saved. Resume it before starting another.',
    saved: 'Progress is saved on this device and included in Settings backups.',
    unavailable: 'This lesson is not available. Continue from your learning path.',
  },
  el: {
    cram: 'SOS 7 ημερών', full: 'Όλη η τράπεζα ερωτήσεων', day: 'Ημέρα', available: 'Διαθέσιμο για μελέτη',
    cramPath: 'Προετοιμασία εξέτασης σε 7 ημέρες', cramIntro: '140 βασικές ερωτήσεις · 20 ανά ημέρα · 7 στοχευμένα μαθήματα',
    cramHint: 'Στόχος ένα μάθημα την ημέρα. Μπορείτε να προχωρήσετε νωρίτερα. Υπολογίστε περίπου 60–90 λεπτά μαζί με ανάκληση και επανάληψη.',
    essentials: 'Βασικές ερωτήσεις που καλύφθηκαν', mustKnow: 'Απαραίτητες γνώσεις', cramDone: 'Ολοκληρώσατε τα βασικά των 7 ημερών!',
    rationale: 'Επιλογή βάσει προτεραιότητας ενότητας, θεμελιωδών εννοιών και δεξιοτήτων που επανέρχονται σε πρακτικά σενάρια.',
    routine: 'Καθημερινή ρουτίνα: επαναλάβετε τις προγραμματισμένες κάρτες, μελετήστε τα σημερινά βασικά και ανακαλέστε κάθε απάντηση χωρίς να κοιτάτε.',
    noDue: 'Δεν υπάρχουν ακόμη βασικές κάρτες προς επανάληψη. Συνεχίστε το μάθημα ή επιστρέψτε αργότερα.',
    learn: 'Μάθηση', path: 'Η μαθησιακή σας διαδρομή', intro: 'Μικρά μαθήματα. Όλη η ύλη. Με τον ρυθμό σας.',
    lesson: 'Μάθημα', lessons: 'Μαθήματα', goal: 'Ημερήσιος στόχος (μαθήματα)', today: 'Μαθήματα σήμερα', streak: 'Ημέρες σερί',
    start: 'Έναρξη μαθήματος', resume: 'Συνέχιση μαθήματος', next: 'Επόμενο μάθημα', practice: 'Νέα εξάσκηση',
    current: 'Επόμενο', complete: 'Ολοκληρώθηκε', locked: 'Ολοκληρώστε το προηγούμενο μάθημα για ξεκλείδωμα',
    questions: 'ερωτήσεις', unit: 'Ενότητα', xp: 'Πόντοι', pause: 'Αποθήκευση και επιστροφή',
    study: 'Μελέτη', recall: 'Ανάκληση', studyHint: 'Διαβάστε την ενδεικτική απάντηση. Στη συνέχεια θα την ανακαλέσετε από μνήμης.',
    recallHint: 'Απαντήστε από μνήμης, προφορικά ή γραπτά. Έπειτα συγκρίνετε με την ενδεικτική απάντηση.',
    answer: 'Ενδεικτική απάντηση', write: 'Η απάντησή σας (προαιρετικά)', reveal: 'Σύγκριση απάντησης',
    remembered: 'Τη θυμήθηκα', missed: 'Χρειάζομαι επανάληψη', continue: 'Συνέχεια', begin: 'Έναρξη ανάκλησης',
    retry: 'Οι ερωτήσεις που χάσατε επανέρχονται μέχρι να τις θυμηθείτε. Δεν υπάρχει ποινή για νέα προσπάθεια.',
    done: 'Το μάθημα ολοκληρώθηκε!', doneHint: 'Ανακαλέσατε όλες τις απαντήσεις. Συνεχίστε ή επιστρέψτε αύριο.',
    covered: 'Ερωτήσεις που καλύφθηκαν', first: 'Σωστές με την πρώτη', back: 'Επιστροφή στη διαδρομή',
    allDone: 'Καλύψατε όλη την ύλη!', review: 'Επανάληψη προγραμματισμένων καρτών',
    goalDone: 'Πετύχατε τον ημερήσιο στόχο. Μπορείτε να συνεχίσετε με άλλο μάθημα.',
    goalHint: 'Στόχος, χωρίς όριο. Κάντε όσα μαθήματα θέλετε.',
    resumeHint: 'Το μάθημά σας αποθηκεύτηκε. Συνεχίστε το πριν ξεκινήσετε άλλο.',
    saved: 'Η πρόοδος αποθηκεύεται σε αυτή τη συσκευή και περιλαμβάνεται στα αντίγραφα των Ρυθμίσεων.',
    unavailable: 'Το μάθημα δεν είναι διαθέσιμο. Συνεχίστε από τη μαθησιακή διαδρομή.',
  }
};

export function createLearning({ S, bank, esc, ico, topicName, render }) {
  const fullLessons = curriculum(bank), cramLessons = cramCurriculum(bank);
  const isCram = () => S.state.learningMode !== 'full';
  const getLessons = () => isCram() ? cramLessons : fullLessons;
  const byId = Object.fromEntries(bank.questions.map(q => [q.id, q]));
  const t = k => copy[S.state.lang === 'el' ? 'el' : 'en'][k];
  const learning = () => isCram() ? (S.state.cramLearning ||= freshLearning()) : (S.state.learning ||= freshLearning());
  const nextLesson = () => getLessons().find(l => !learning().completed[l.id]);
  const btn = (label, action, value = '', primary = false) => `<button class="btn ${primary ? 'primary' : ''}" data-learn="${action}" data-value="${esc(value)}">${esc(t(label))}</button>`;
  const text = (q, answer = false) => {
    const en = q[answer ? 'ae' : 'qe'], el = q[answer ? 'ag' : 'qg'];
    return `<div lang="${S.state.lang === 'el' ? 'el' : 'en'}">${esc(S.state.lang === 'el' ? el : en)}</div>${S.state.lang === 'both' ? `<div class="alt" lang="el">${esc(el)}</div>` : ''}`;
  };
  const meter = (n, total) => `<progress class="learn-meter" value="${n}" max="${total || 1}" aria-label="${esc(t('covered'))}">${n}/${total}</progress>`;
  const bilingual = (en, el) => `<span lang="${S.state.lang === 'el' ? 'el' : 'en'}">${esc(S.state.lang === 'el' ? el : en)}</span>${S.state.lang === 'both' ? `<span class="alt" lang="el">${esc(el)}</span>` : ''}`;
  const brief = l => `<div class="cram-brief"><h3>${esc(t('mustKnow'))}</h3><ul>${l.briefEn.map((item, i) => `<li>${bilingual(item, l.briefEl[i])}</li>`).join('')}</ul></div>`;
  const dueCount = () => cramLessons.flatMap(l => l.ids).filter(id => !S.isNew(id) && S.isDue(id)).length;
  const reviewButton = () => !isCram() || dueCount() ? btn('review', 'review') : `<p class="small muted">${esc(t('noDue'))}</p>`;
  function path() {
    const lessons = getLessons();
    const total = lessons.reduce((n,l) => n + l.ids.length, 0);
    const goal = isCram() ? 1 : learning().goal;
    const p = learning(), next = nextLesson(), active = p.active && !p.active.done;
    const count = lessons.filter(l => p.completed[l.id]).length;
    const covered = lessons.filter(l => p.completed[l.id]).reduce((n, l) => n + l.ids.length, 0);
    const doneToday = p.days[localDay()] || 0;
    return `<div class="cram-modes" role="group" aria-label="${esc(t('path'))}">
      <button class="btn ${isCram() ? 'primary' : ''}" data-learn="mode" data-value="cram" aria-pressed="${isCram()}">${esc(t('cram'))}</button>
      <button class="btn ${!isCram() ? 'primary' : ''}" data-learn="mode" data-value="full" aria-pressed="${!isCram()}">${esc(t('full'))}</button></div>
    <section class="card learn-hero">
      <div class="label">YAD105 · ${esc(t('learn'))}</div><h2>${esc(t(isCram() ? 'cramPath' : 'path'))}</h2><p class="muted">${esc(t(isCram() ? 'cramIntro' : 'intro'))}</p>
      <div class="learn-stats"><div><b>${doneToday}/${goal}</b><span>${esc(t('today'))}</span></div><div><b>${learningStreak(p.days)}</b><span>${esc(t('streak'))}</span></div><div><b>${Object.values(p.completed).reduce((n, v) => n + v.xp, 0)}</b><span>${esc(t('xp'))}</span></div></div>
      ${active ? btn('resume', 'resume', '', true) : next ? btn('start', 'start', next.id, true) : `<h3>${esc(t(isCram() ? 'cramDone' : 'allDone'))}</h3>`}
      ${active ? `<p class="small muted">${esc(t('resumeHint'))}</p>` : ''}
      <p class="small muted">${esc(t(isCram() ? 'cramHint' : doneToday >= goal ? 'goalDone' : 'goalHint'))}</p>
      ${isCram() ? `<p class="small muted">${esc(t('routine'))}</p>` : `<label class="field"><span>${esc(t('goal'))}</span><select id="lessonGoal">${[1,2,3,5].map(n => `<option value="${n}" ${p.goal === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`}
      <div class="row spread small"><span>${esc(t(isCram() ? 'essentials' : 'covered'))}</span><b>${covered}/${total}</b></div>${meter(covered, total)}
      <p class="small muted">${count}/${lessons.length} ${esc(t('lessons'))}</p>
      ${reviewButton()}
      ${isCram() ? `<p class="small muted">${esc(t('rationale'))}</p>` : ''}
    </section>
    ${(isCram() ? cramLessons.map(l => ({ id: l.topic, lesson: l })) : bank.topics).map((topic, i) => {
      const unit = lessons.filter(l => l.topic === topic.id);
      const open = unit.some(l => l.id === next?.id || l.id === p.active?.lesson) || !next;
      return `<details class="card learn-unit" ${open ? 'open' : ''}><summary><span class="learn-unit-number">${String(i + 1).padStart(2, '0')}</span><span><span class="label">${esc(t(isCram() ? 'day' : 'unit'))} ${i + 1} · ${unit.filter(l => p.completed[l.id]).length}/${unit.length}</span><strong>${topic.lesson ? bilingual(topic.lesson.en, topic.lesson.el) : esc(topicName(topic.id))}</strong></span></summary>
        ${topic.lesson ? brief(topic.lesson) : ''}
        <ol class="learn-path">${unit.map(l => {
          const complete = !!p.completed[l.id], current = l.id === next?.id, locked = !isCram() && !complete && !current;
          return `<li class="${complete ? 'is-complete' : current ? 'is-current' : 'is-locked'}"><button class="learn-node" data-learn="start" data-value="${l.id}" ${locked || active && p.active.lesson !== l.id ? 'disabled' : ''} ${current ? 'aria-current="step"' : ''}>
            <span class="learn-medallion">${ico(complete ? 'check' : locked ? 'layers' : 'bolt')}</span><span><strong>${esc(t(isCram() ? 'day' : 'lesson'))} ${l.number}</strong><span>${l.ids.length} ${esc(t('questions'))} · ${esc(t(complete ? 'complete' : current ? 'current' : locked ? 'locked' : 'available'))}</span></span>${ico('chevron')}</button></li>`;
        }).join('')}</ol></details>`;
    }).join('')}<p class="small muted">${esc(t('saved'))}</p>`;
  }
  function run() {
    const lessons = getLessons();
    const a = learning().active;
    if (!a || !lessons.some(l => l.id === a.lesson)) return `${btn('back', 'path')}<p>${esc(t('unavailable'))}</p>`;
    if (a.done) {
      const next = nextLesson();
      return `<section class="card learn-finish"><div class="learn-trophy">${ico('check')}</div><h2 tabindex="-1" data-learn-focus>${esc(t('done'))}</h2><p class="muted">${esc(t('doneHint'))}</p>
        <div class="learn-stats"><div><b>+${a.xp || 0}</b><span>${esc(t('xp'))}</span></div><div><b>${Object.values(a.answers).filter(Boolean).length}/${a.ids.length}</b><span>${esc(t('first'))}</span></div></div>
        <div class="stack">${next ? btn('next', 'start', next.id, true) : `<h3>${esc(t(isCram() ? 'cramDone' : 'allDone'))}</h3>${reviewButton()}`}${btn('practice', 'start', a.lesson)}${btn('back', 'path')}</div></section>`;
    }
    const study = a.phase === 'study', q = byId[study ? a.ids[a.index] : a.queue[0]];
    const n = study ? a.index : a.ids.length - a.queue.length;
    const lesson = lessons.find(l => l.id === a.lesson);
    return `${isCram() ? `<details class="card cram-summary"><summary>${esc(t('day'))} ${lesson.number} · ${bilingual(lesson.en, lesson.el)} · ${esc(t('mustKnow'))}</summary>${brief(lesson)}</details>` : ''}<div class="learn-toolbar">${btn('pause', 'path')}<span class="pill">${esc(t(study ? 'study' : 'recall'))} · ${n + 1}/${a.ids.length}</span></div>
      ${meter((study ? a.index : a.ids.length + n), a.ids.length * 2)}
      <section class="card learn-question"><div class="label">${esc(topicName(q.t))} · ${q.id}</div><p class="small muted">${esc(t(study ? 'studyHint' : 'recallHint'))}</p>
        <h2 tabindex="-1" data-learn-focus>${text(q)}</h2>
        ${!study ? `<label class="field"><span>${esc(t('write'))}</span><textarea id="learnAnswer" rows="4">${esc(a.text)}</textarea></label>` : ''}
        ${study || a.revealed ? `<div class="learn-answer"><h3>${esc(t('answer'))}</h3>${text(q, true)}</div>` : ''}
        <div class="stack">${study ? btn(a.index === a.ids.length - 1 ? 'begin' : 'continue', 'advance', '', true) : !a.revealed ? btn('reveal', 'reveal', '', true) : `${btn('remembered', 'assess', 'yes', true)}${btn('missed', 'assess', 'no')}`}</div>
      </section><p class="small muted">${esc(t('retry'))}</p>`;
  }
  function action(action, value) {
    if (action === 'mode' && ['cram', 'full'].includes(value)) {
      S.state.learningMode = value; S.flush(); location.hash = '/learn'; render(); return;
    }
    const lessons = getLessons();
    const p = learning();
    if (action === 'path') { S.flush(); location.hash = '/learn'; return; }
    if (action === 'review') { location.hash = `/cards/run?deck=${isCram() ? 'cram' : 'due'}&n=20`; return; }
    if (action === 'start') {
      const l = lessons.find(l => l.id === value);
      if (!l || (!isCram() && !p.completed[l.id] && nextLesson()?.id !== l.id)) return;
      if (!p.active || p.active.done) p.active = beginLesson(l);
      location.hash = '/learn/run';
    } else if (action === 'resume') { location.hash = '/learn/run'; }
    else if (action === 'advance' && p.active) advanceStudy(p.active);
    else if (action === 'reveal' && p.active?.phase === 'recall') p.active.revealed = true;
    else if (action === 'assess' && p.active) {
      const result = assess(p.active, value === 'yes');
      if (result?.first) { S.record(result.id, result.correct); if (!result.correct || S.isDue(result.id)) S.schedule(result.id, result.correct ? 4 : 0); }
      completeLesson(p);
    }
    S.flush(); render();
    document.querySelector('[data-learn-focus]')?.focus({ preventScroll: true });
  }
  document.addEventListener('input', e => {
    if (e.target.id === 'learnAnswer' && learning().active) { learning().active.text = e.target.value; S.save(); }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'lessonGoal') { learning().goal = Number(e.target.value); S.flush(); render(); }
  });
  return { path, run, action };
}
