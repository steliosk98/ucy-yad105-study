import * as S from './store.js';
import { makeChoices, buildExam, shuffle, scoreWritten } from './quiz.js';

const $ = (s, r = document) => r.querySelector(s);
const view = $('#view');
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let BANK = { questions: [], topics: [], meta: {} };
let QBY = {};        // id -> question
let TBY = {};        // topic id -> topic

// ---------------------------------------------------------------- i18n
const T = {
  en: {
    home: 'Home', cards: 'Cards', exam: 'Exam', browse: 'Browse', stats: 'Stats',
    due: 'Due now', newq: 'Unseen', learned: 'Learned', weak: 'Weak spots', starred: 'Starred',
    readiness: 'Exam readiness', streak: 'Day streak', todayCards: 'Reviewed today',
    reviewDue: 'Review due cards', quick10: 'Quick 10 questions', mockExam: 'Full mock exam',
    drillWeak: 'Drill weak spots', continueStudy: 'Continue studying', allTopics: 'All topics',
    topics: 'Topics', start: 'Start', deck: 'Deck', length: 'Session length', difficulty: 'Difficulty',
    all: 'All', easy: 'Easy', medium: 'Medium', hard: 'Hard', showAnswer: 'Tap to reveal answer',
    again: 'Again', hardB: 'Hard', good: 'Good', easyB: 'Easy',
    sessionDone: 'Session complete', cardsReviewed: 'cards reviewed', backHome: 'Back to home',
    questions: 'Questions', timer: 'Timer', mode: 'Format', mcq: 'Multiple choice',
    written: 'Written', mixed: 'Mixed', minutes: 'min', noTimer: 'No timer',
    startExam: 'Start exam', submit: 'Submit exam', next: 'Next', prev: 'Back', finish: 'Finish',
    flag: 'Flag', flagged: 'Flagged', question: 'Question', of: 'of',
    yourAnswer: 'Type your answer…', reveal: 'Reveal model answer', gotIt: 'I got it right',
    missedIt: 'I missed it', score: 'Score', correct: 'Correct', incorrect: 'Incorrect',
    review: 'Review answers', byTopic: 'By topic', retryWrong: 'Retry the ones I missed',
    search: 'Search questions…', results: 'results', noResults: 'Nothing found',
    modelAnswer: 'Model answer', history: 'Exam history', noExams: 'No exams yet',
    progress: 'Progress', coverage: 'Coverage', accuracy: 'Accuracy', mastery: 'Mastery',
    settings: 'Settings', dailyGoal: 'Daily goal (cards)', exportD: 'Export progress',
    importD: 'Import progress', resetD: 'Reset all progress', resetConfirm: 'Erase all progress? This cannot be undone.',
    resume: 'Resume exam in progress', discard: 'Discard', timeUp: "Time's up — exam submitted",
    unanswered: 'unanswered', keyHint: 'Space flips · 1-4 grades', emptyDeck: 'Nothing due here. Pick another deck.',
    saved: 'Saved', pass: 'Pass', fail: 'Below target', target: 'Target 70%',
    weightNote: 'Technical exam = 65% of total score',
    examDate: 'Exam date', daysLeft: 'days left', perDay: 'cards/day to cover everything',
    today2: 'today', paceDone: 'Bank covered - keep reviewing',
  },
  el: {
    home: 'Αρχική', cards: 'Κάρτες', exam: 'Εξέταση', browse: 'Αναζήτηση', stats: 'Πρόοδος',
    due: 'Για επανάληψη', newq: 'Νέες', learned: 'Κατακτημένες', weak: 'Αδυναμίες', starred: 'Αγαπημένα',
    readiness: 'Ετοιμότητα', streak: 'Συνεχόμενες μέρες', todayCards: 'Σήμερα',
    reviewDue: 'Επανάληψη καρτών', quick10: 'Γρήγορες 10 ερωτήσεις', mockExam: 'Πλήρης δοκιμαστική',
    drillWeak: 'Εξάσκηση αδυναμιών', continueStudy: 'Συνέχεια μελέτης', allTopics: 'Όλες οι ενότητες',
    topics: 'Ενότητες', start: 'Έναρξη', deck: 'Τράπουλα', length: 'Διάρκεια', difficulty: 'Δυσκολία',
    all: 'Όλα', easy: 'Εύκολο', medium: 'Μέτριο', hard: 'Δύσκολο', showAnswer: 'Πάτησε για απάντηση',
    again: 'Ξανά', hardB: 'Δύσκολο', good: 'Καλά', easyB: 'Εύκολο',
    sessionDone: 'Ολοκληρώθηκε', cardsReviewed: 'κάρτες', backHome: 'Αρχική',
    questions: 'Ερωτήσεις', timer: 'Χρόνος', mode: 'Μορφή', mcq: 'Πολλαπλής επιλογής',
    written: 'Γραπτή', mixed: 'Μικτή', minutes: 'λεπτά', noTimer: 'Χωρίς χρόνο',
    startExam: 'Έναρξη εξέτασης', submit: 'Υποβολή', next: 'Επόμενη', prev: 'Πίσω', finish: 'Τέλος',
    flag: 'Σημείωση', flagged: 'Σημειωμένες', question: 'Ερώτηση', of: 'από',
    yourAnswer: 'Γράψε την απάντησή σου…', reveal: 'Δες την απάντηση', gotIt: 'Το βρήκα',
    missedIt: 'Το έχασα', score: 'Βαθμός', correct: 'Σωστές', incorrect: 'Λάθος',
    review: 'Ανασκόπηση', byTopic: 'Ανά ενότητα', retryWrong: 'Ξανά όσες έχασα',
    search: 'Αναζήτηση…', results: 'αποτελέσματα', noResults: 'Κανένα αποτέλεσμα',
    modelAnswer: 'Ενδεικτική απάντηση', history: 'Ιστορικό', noExams: 'Καμία εξέταση ακόμη',
    progress: 'Πρόοδος', coverage: 'Κάλυψη', accuracy: 'Ακρίβεια', mastery: 'Κατοχή',
    settings: 'Ρυθμίσεις', dailyGoal: 'Ημερήσιος στόχος', exportD: 'Εξαγωγή προόδου',
    importD: 'Εισαγωγή προόδου', resetD: 'Διαγραφή προόδου', resetConfirm: 'Διαγραφή όλης της προόδου;',
    resume: 'Συνέχιση εξέτασης', discard: 'Απόρριψη', timeUp: 'Ο χρόνος τελείωσε — υποβλήθηκε',
    unanswered: 'αναπάντητες', keyHint: 'Space γύρισμα · 1-4 βαθμός', emptyDeck: 'Τίποτα εδώ. Διάλεξε άλλη τράπουλα.',
    saved: 'Αποθηκεύτηκε', pass: 'Επιτυχία', fail: 'Κάτω από στόχο', target: 'Στόχος 70%',
    weightNote: 'Η τεχνική εξέταση είναι 65% του συνόλου',
    examDate: 'Ημερομηνία εξέτασης', daysLeft: 'μέρες απομένουν', perDay: 'κάρτες/μέρα για πλήρη κάλυψη',
    today2: 'σήμερα', paceDone: 'Η τράπεζα καλύφθηκε - συνέχισε επανάληψη',
  }
};
const uiLang = () => (S.state.lang === 'el' ? 'el' : 'en');
const t = (k) => T[uiLang()][k] ?? T.en[k] ?? k;
const topicName = (id) => (TBY[id] ? (uiLang() === 'el' ? TBY[id].el : TBY[id].en) : id);
const qText = (q) => (S.state.lang === 'el' ? q.qg : q.qe);
const aText = (q) => (S.state.lang === 'el' ? q.ag : q.ae);
const qAlt = (q) => (S.state.lang === 'both' ? q.qg : null);
const aAlt = (q) => (S.state.lang === 'both' ? q.ag : null);

// ---------------------------------------------------------------- helpers
function toast(msg) {
  let el = $('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 1800);
}
const pct = (n) => Math.round(n * 100);
const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const diffPill = (d) => `<span class="pill ${d}">${t(d === 'easy' ? 'easy' : d === 'medium' ? 'medium' : 'hard')}</span>`;

function go(hash) { location.hash = hash; }

// ---------------------------------------------------------------- decks
const decks = {
  due: () => BANK.questions.filter(q => !S.isNew(q.id) && S.isDue(q.id)),
  new: () => BANK.questions.filter(q => S.isNew(q.id)),
  weak: () => BANK.questions.filter(q => S.isWeak(q.id)),
  starred: () => BANK.questions.filter(q => S.isStarred(q.id)),
  all: () => BANK.questions.slice(),
};

function mastery() {
  const qs = BANK.questions;
  const seen = qs.filter(q => !S.isNew(q.id)).length;
  const learned = qs.filter(q => S.isLearned(q.id)).length;
  let ok = 0, tot = 0;
  for (const q of qs) { const s = S.state.stats[q.id]; if (s) { ok += s.ok; tot += s.seen; } }
  return {
    coverage: seen / qs.length,
    learned: learned / qs.length,
    accuracy: tot ? ok / tot : 0,
    seen, learnedN: learned, total: qs.length,
    // readiness leans on mastery, then coverage, then how accurate answers have been
    readiness: 0.5 * (learned / qs.length) + 0.25 * (seen / qs.length) + 0.25 * (tot ? ok / tot : 0),
  };
}

// Days until the exam and how many unseen cards a day that leaves.
function pace() {
  if (!S.state.examDate) return null;
  const days = Math.ceil((new Date(S.state.examDate + 'T23:59:59') - Date.now()) / 864e5);
  const unseen = decks.new().length;
  return { days, unseen, perDay: days > 0 ? Math.ceil(unseen / days) : unseen };
}

function topicStats(id) {
  const qs = BANK.questions.filter(q => q.t === id);
  const learned = qs.filter(q => S.isLearned(q.id)).length;
  const seen = qs.filter(q => !S.isNew(q.id)).length;
  let ok = 0, tot = 0;
  for (const q of qs) { const s = S.state.stats[q.id]; if (s) { ok += s.ok; tot += s.seen; } }
  return { total: qs.length, learned, seen, acc: tot ? ok / tot : null };
}

// ---------------------------------------------------------------- HOME
function Home() {
  const m = mastery();
  const due = decks.due().length, fresh = decks.new().length, weak = decks.weak().length;
  const doneToday = S.state.days[S.today()] || 0;
  const goal = S.state.dailyGoal;
  const topicRows = BANK.topics.map(tp => {
    const st = topicStats(tp.id);
    return `<button class="list-item" data-go="#/topic/${tp.id}">
      <div class="row spread"><span class="t">${esc(topicName(tp.id))}</span>
        <span class="tiny muted nowrap">${st.learned}/${st.total}</span></div>
      <div class="bar" style="margin-top:8px"><i class="${st.learned === st.total ? 'good' : ''}" style="width:${pct(st.learned / st.total)}%"></i></div>
    </button>`;
  }).join('');

  return `
  <section class="card">
    <div class="row" style="gap:16px">
      <div class="ring" style="--p:${pct(m.readiness)}"><div>
        <div><b style="font-size:22px">${pct(m.readiness)}%</b><div class="tiny muted">${esc(t('readiness'))}</div></div>
      </div></div>
      <div style="flex:1">
        <div class="small muted">${esc(BANK.meta.reference)} · ${esc(t('weightNote'))}</div>
        <div class="grid3" style="margin-top:10px;gap:8px">
          <div><b style="font-size:19px">${S.streak()}</b><div class="tiny muted">${esc(t('streak'))}</div></div>
          <div><b style="font-size:19px">${doneToday}/${goal}</b><div class="tiny muted">${esc(t('todayCards'))}</div></div>
          <div><b style="font-size:19px">${m.learnedN}/${m.total}</b><div class="tiny muted">${esc(t('learned'))}</div></div>
        </div>
        <div class="bar" style="margin-top:10px"><i class="good" style="width:${pct(Math.min(1, doneToday / goal))}%"></i></div>
      </div>
    </div>
  </section>

  <div class="grid3" style="margin-bottom:14px">
    <div class="card tight" style="margin:0;text-align:center"><b style="font-size:20px">${due}</b><div class="tiny muted">${esc(t('due'))}</div></div>
    <div class="card tight" style="margin:0;text-align:center"><b style="font-size:20px">${fresh}</b><div class="tiny muted">${esc(t('newq'))}</div></div>
    <div class="card tight" style="margin:0;text-align:center"><b style="font-size:20px">${weak}</b><div class="tiny muted">${esc(t('weak'))}</div></div>
  </div>

  ${(() => {
    const p = pace();
    if (!p) return '';
    return `<div class="card tight row spread">
      <div><b style="font-size:19px">${p.days > 0 ? p.days : 0}</b>
        <span class="small muted"> ${esc(p.days === 1 ? t('today2') : t('daysLeft'))}</span></div>
      <div class="tiny muted" style="text-align:right">${p.unseen
        ? `<b style="font-size:15px;color:var(--brand)">${p.perDay}</b> ${esc(t('perDay'))}`
        : esc(t('paceDone'))}</div>
    </div>`;
  })()}
  <div class="stack">
    <button class="btn primary" data-go="#/cards/run?deck=${due ? 'due' : 'new'}&n=20">${esc(due ? t('reviewDue') : t('continueStudy'))}</button>
    <button class="btn" data-go="#/exam/run?n=10&mode=mcq&time=0">${esc(t('quick10'))}</button>
    <button class="btn" data-go="#/exam">${esc(t('mockExam'))}</button>
    ${weak ? `<button class="btn" data-go="#/cards/run?deck=weak&n=20">${esc(t('drillWeak'))} (${weak})</button>` : ''}
  </div>

  <div class="sec-title">${esc(t('topics'))}</div>
  ${topicRows}
  <div style="height:8px"></div>
  <button class="btn ghost" data-go="#/settings">${esc(t('settings'))}</button>`;
}

// ---------------------------------------------------------------- TOPIC
function Topic(id) {
  const tp = TBY[id];
  if (!tp) return `<div class="empty">?</div>`;
  const st = topicStats(id);
  const qs = BANK.questions.filter(q => q.t === id);
  return `
  <section class="card">
    <h2 style="font-size:19px">${esc(topicName(id))}</h2>
    <div class="row wrap small muted" style="margin-top:8px">
      <span class="pill brand">${esc(tp.priority)}</span>
      <span>${st.total} ${esc(t('questions'))}</span>
      <span>${esc(t('learned'))}: ${st.learned}</span>
      ${st.acc === null ? '' : `<span>${esc(t('accuracy'))}: ${pct(st.acc)}%</span>`}
    </div>
    <div class="bar" style="margin-top:10px"><i style="width:${pct(st.learned / st.total)}%"></i></div>
    <div class="grid2" style="margin-top:12px">
      <button class="btn primary" data-go="#/cards/run?deck=all&topic=${id}&n=20">${esc(t('cards'))}</button>
      <button class="btn" data-go="#/exam/run?n=${Math.min(20, st.total)}&mode=mcq&time=0&topic=${id}">${esc(t('exam'))}</button>
    </div>
  </section>
  <div class="sec-title">${esc(t('questions'))}</div>
  ${qs.map(qaBlock).join('')}`;
}

function qaBlock(q, highlight = '') {
  const mark = (s) => highlight ? esc(s).replace(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>') : esc(s);
  return `<details class="qa" data-id="${q.id}">
    <summary><div class="row spread"><span>${mark(qText(q))}</span>
      <span class="star ${S.isStarred(q.id) ? 'on' : ''}" data-star="${q.id}">${S.isStarred(q.id) ? '&#9733;' : '&#9734;'}</span></div>
      ${qAlt(q) ? `<div class="tiny muted" style="margin-top:4px;font-weight:400">${mark(qAlt(q))}</div>` : ''}
    </summary>
    <div class="body">${mark(aText(q))}
      ${aAlt(q) ? `<div class="small muted" style="margin-top:8px">${mark(aAlt(q))}</div>` : ''}
      <div class="row wrap tiny muted" style="margin-top:10px">${diffPill(q.d)}
        <span class="pill">${esc(topicName(q.t))}</span>${q.tags.map(x => `<span class="pill">${esc(x)}</span>`).join('')}</div>
    </div>
  </details>`;
}

// ---------------------------------------------------------------- CARDS
let session = null;

function CardsSetup() {
  const counts = { due: decks.due().length, new: decks.new().length, weak: decks.weak().length, starred: decks.starred().length, all: BANK.questions.length };
  const opt = (k, label) => `<option value="${k}">${esc(label)} (${counts[k]})</option>`;
  return `
  <section class="card">
    <label class="field"><span>${esc(t('deck'))}</span>
      <select id="deck">${opt('due', t('due'))}${opt('new', t('newq'))}${opt('weak', t('weak'))}${opt('starred', t('starred'))}${opt('all', t('all'))}</select>
    </label>
    <label class="field"><span>${esc(t('topics'))}</span>
      <select id="topic"><option value="">${esc(t('allTopics'))}</option>
        ${BANK.topics.map(x => `<option value="${x.id}">${esc(topicName(x.id))}</option>`).join('')}</select>
    </label>
    <label class="field"><span>${esc(t('difficulty'))}</span>
      <select id="diff"><option value="">${esc(t('all'))}</option>
        <option value="easy">${esc(t('easy'))}</option><option value="medium">${esc(t('medium'))}</option><option value="hard">${esc(t('hard'))}</option></select>
    </label>
    <label class="field"><span>${esc(t('length'))}</span>
      <select id="len"><option>10</option><option selected>20</option><option>30</option><option>50</option><option value="999">${esc(t('all'))}</option></select>
    </label>
    <button class="btn primary" id="startCards">${esc(t('start'))}</button>
  </section>`;
}

function startCards({ deck = 'due', topic = '', diff = '', n = 20 }) {
  let pool = (decks[deck] || decks.all)();
  if (topic) pool = pool.filter(q => q.t === topic);
  if (diff) pool = pool.filter(q => q.d === diff);
  if (deck === 'due') pool.sort((a, b) => (S.state.srs[a.id]?.due || 0) - (S.state.srs[b.id]?.due || 0));
  else if (deck === 'all') {
    // unseen and due first, then the rest
    pool = [...shuffle(pool.filter(q => S.isDue(q.id))), ...shuffle(pool.filter(q => !S.isDue(q.id)))];
  } else pool = shuffle(pool);

  session = { queue: pool.slice(0, Number(n) || 20), i: 0, flipped: false, done: 0, again: 0, route: parseRoute().qs };
  render();
}

function CardsRun() {
  if (!session) return CardsSetup();
  if (session.i >= session.queue.length) {
    return `<section class="card" style="text-align:center">
      <div class="result-big">${session.done}</div>
      <div class="muted" style="margin-top:6px">${esc(t('cardsReviewed'))}</div>
      <h2 style="margin-top:14px;font-size:18px">${esc(t('sessionDone'))}</h2>
      <div class="stack" style="margin-top:16px">
        <button class="btn primary" data-go="#/cards">${esc(t('start'))}</button>
        <button class="btn ghost" data-go="#/">${esc(t('backHome'))}</button>
      </div></section>`;
  }
  const q = session.queue[session.i];
  if (!q) return `<div class="empty">${esc(t('emptyDeck'))}</div>`;
  const srs = S.state.srs[q.id];
  const nextIv = (g) => {
    if (g < 3) return '<1m';
    const ef = srs?.ef ?? 2.5, rep = srs?.rep ?? 0, iv = srs?.iv ?? 0;
    let d = rep === 0 ? 1 : rep === 1 ? 3 : Math.round(iv * ef);
    if (g === 3) d = Math.max(1, Math.round(d * 0.6));
    return d === 1 ? '1d' : `${d}d`;
  };
  return `
  <div class="row spread small muted" style="margin-bottom:10px">
    <span>${session.i + 1} ${esc(t('of'))} ${session.queue.length}</span>
    <span class="row" style="gap:6px">${diffPill(q.d)}
      <button class="star ${S.isStarred(q.id) ? 'on' : ''}" data-star="${q.id}">${S.isStarred(q.id) ? '&#9733;' : '&#9734;'}</button></span>
  </div>
  <div class="bar" style="margin-bottom:12px"><i style="width:${pct(session.i / session.queue.length)}%"></i></div>
  <div class="fc" id="card">
    <div class="q">${esc(qText(q))}</div>
    ${qAlt(q) ? `<div class="alt">${esc(qAlt(q))}</div>` : ''}
    ${session.flipped ? `<div class="a">${esc(aText(q))}${aAlt(q) ? `<div class="alt">${esc(aAlt(q))}</div>` : ''}</div>` : ''}
    <div class="hint">${esc(topicName(q.t))}</div>
  </div>
  ${session.flipped ? `<div class="grade">
    <button class="btn g0" data-grade="0"><b>${esc(t('again'))}</b><i>${nextIv(0)}</i></button>
    <button class="btn" data-grade="3"><b>${esc(t('hardB'))}</b><i>${nextIv(3)}</i></button>
    <button class="btn" data-grade="4"><b>${esc(t('good'))}</b><i>${nextIv(4)}</i></button>
    <button class="btn g5" data-grade="5"><b>${esc(t('easyB'))}</b><i>${nextIv(5)}</i></button>
  </div>` : `<button class="btn primary" style="margin-top:12px" id="flip">${esc(t('showAnswer'))}</button>`}
  <div class="tiny muted" style="text-align:center;margin-top:10px">${esc(t('keyHint'))}</div>`;
}

function gradeCard(g) {
  const q = session.queue[session.i];
  if (!q) return;
  S.schedule(q.id, g);
  S.record(q.id, g >= 3);
  session.done++;
  if (g < 3) { session.again++; session.queue.push(q); }   // requeue at the end of the session
  session.i++;
  session.flipped = false;
  render();
}

// ---------------------------------------------------------------- EXAM
let exam = null;
const EXAM_KEY = 'yad105.exam';

function saveExam() {
  if (!exam) { localStorage.removeItem(EXAM_KEY); return; }
  const { ids, answers, mode, i, endsAt, secs, flags, started } = exam;
  localStorage.setItem(EXAM_KEY, JSON.stringify({ ids, answers, mode, i, endsAt, secs, flags, started }));
}
function loadExam() {
  try {
    const o = JSON.parse(localStorage.getItem(EXAM_KEY) || 'null');
    if (!o?.ids?.length) return null;
    o.questions = o.ids.map(id => QBY[id]).filter(Boolean);
    o.route = '';   // resume always lands on a bare #/exam/run
    if (o.questions.length !== o.ids.length) return null;
    return o;
  } catch { return null; }
}

function ExamSetup() {
  const saved = loadExam();
  return `
  ${saved ? `<section class="card">
    <div class="row spread"><b>${esc(t('resume'))}</b><span class="tiny muted">${saved.questions.length} ${esc(t('questions'))}</span></div>
    <div class="grid2" style="margin-top:10px">
      <button class="btn primary" id="resumeExam">${esc(t('resume'))}</button>
      <button class="btn ghost" id="dropExam">${esc(t('discard'))}</button>
    </div></section>` : ''}
  <section class="card">
    <label class="field"><span>${esc(t('questions'))}</span>
      <select id="n"><option>10</option><option selected>25</option><option>40</option><option>60</option></select></label>
    <label class="field"><span>${esc(t('mode'))}</span>
      <select id="mode"><option value="mcq">${esc(t('mcq'))}</option><option value="written">${esc(t('written'))}</option><option value="mixed">${esc(t('mixed'))}</option></select></label>
    <label class="field"><span>${esc(t('timer'))}</span>
      <select id="time"><option value="0">${esc(t('noTimer'))}</option><option value="15">15 ${esc(t('minutes'))}</option>
        <option value="30" selected>30 ${esc(t('minutes'))}</option><option value="45">45 ${esc(t('minutes'))}</option><option value="60">60 ${esc(t('minutes'))}</option></select></label>
    <label class="field"><span>${esc(t('topics'))}</span>
      <select id="topic"><option value="">${esc(t('allTopics'))}</option>
        ${BANK.topics.map(x => `<option value="${x.id}">${esc(topicName(x.id))}</option>`).join('')}</select></label>
    <label class="field"><span>${esc(t('difficulty'))}</span>
      <select id="diff"><option value="">${esc(t('all'))}</option><option value="easy">${esc(t('easy'))}</option>
        <option value="medium">${esc(t('medium'))}</option><option value="hard">${esc(t('hard'))}</option></select></label>
    <button class="btn primary" id="startExam">${esc(t('startExam'))}</button>
  </section>
  <div class="sec-title">${esc(t('history'))}</div>
  ${examHistory()}`;
}

function examHistory() {
  const h = S.state.exams.slice().reverse();
  if (!h.length) return `<div class="empty">${esc(t('noExams'))}</div>`;
  return h.slice(0, 15).map(e => {
    const p = pct(e.score / e.total);
    return `<div class="list-item" style="cursor:default">
      <div class="row spread"><span class="t">${p}% · ${e.score}/${e.total}</span>
        <span class="tiny muted">${new Date(e.ts).toLocaleDateString()}</span></div>
      <div class="tiny muted" style="margin-top:3px">${esc(t(e.mode === 'written' ? 'written' : e.mode === 'mixed' ? 'mixed' : 'mcq'))}${e.secs ? ` · ${fmtTime(e.secs)}` : ''}</div>
      <div class="bar" style="margin-top:7px"><i class="${p >= 70 ? 'good' : ''}" style="width:${p}%"></i></div>
    </div>`;
  }).join('');
}

function startExam({ n = 25, mode = 'mcq', time = 30, topic = '', diff = '', ids = null }) {
  const qs = ids
    ? ids.map(id => QBY[id]).filter(Boolean)
    : buildExam(BANK.questions, BANK.topics, Number(n),
      { topicIds: topic ? [topic] : null, difficulty: diff ? [diff] : null });
  if (!qs.length) { toast(t('noResults')); return; }
  exam = {
    questions: qs, ids: qs.map(q => q.id), answers: {}, flags: {},
    mode, i: 0, started: Date.now(),
    endsAt: Number(time) ? Date.now() + Number(time) * 6e4 : 0,
    secs: 0, result: null, route: parseRoute().qs,
  };
  saveExam();
  render();
}

const isWritten = (q) => exam.mode === 'written' || (exam.mode === 'mixed' && q.d === 'hard');

function ExamRun() {
  if (!exam) return ExamSetup();
  if (exam.result) return ExamResult();
  const q = exam.questions[exam.i];
  const ans = exam.answers[q.id];
  const left = exam.endsAt ? Math.max(0, Math.round((exam.endsAt - Date.now()) / 1000)) : null;
  const answered = Object.keys(exam.answers).length;

  let body;
  if (isWritten(q)) {
    body = `<textarea id="written" placeholder="${esc(t('yourAnswer'))}">${esc(ans?.text || '')}</textarea>
      ${ans?.revealed ? `<div class="card tight" style="margin-top:10px">
          <div class="tiny muted" style="margin-bottom:5px">${esc(t('modelAnswer'))}</div>${esc(aText(q))}
          ${aAlt(q) ? `<div class="small muted" style="margin-top:8px">${esc(aAlt(q))}</div>` : ''}
          <div class="tiny muted" style="margin-top:8px">${esc(t('accuracy'))}: ${pct(scoreWritten(ans.text || '', aText(q)))}%</div>
          <div class="grid2" style="margin-top:10px">
            <button class="btn ${ans.ok === true ? 'primary' : ''}" data-self="1">${esc(t('gotIt'))}</button>
            <button class="btn ${ans.ok === false ? 'primary' : ''}" data-self="0">${esc(t('missedIt'))}</button>
          </div></div>`
        : `<button class="btn" style="margin-top:10px" id="reveal">${esc(t('reveal'))}</button>`}`;
  } else {
    const { options, answerIndex } = makeChoices(q, BANK.questions, S.state.lang === 'el' ? 'el' : 'en');
    exam.answers[q.id] ||= {};
    exam.answers[q.id].correctIndex = answerIndex;
    body = options.map((o, k) => `<button class="opt ${ans?.pick === k ? 'sel' : ''}" data-pick="${k}">
        <em>${'ABCD'[k]}</em><span>${esc(o.text)}</span></button>`).join('');
  }

  return `
  <div class="qhead">
    <span class="small muted">${esc(t('question'))} ${exam.i + 1}/${exam.questions.length}</span>
    <span class="row" style="gap:8px">
      ${left !== null ? `<span class="timer ${left < 60 ? 'low' : ''}" id="clock">${fmtTime(left)}</span>` : ''}
      <button class="star ${exam.flags[q.id] ? 'on' : ''}" data-flagq="${q.id}">&#9873;</button>
    </span>
  </div>
  <div class="bar" style="margin-bottom:14px"><i style="width:${pct(answered / exam.questions.length)}%"></i></div>
  <section class="card">
    <div style="font-size:18px;font-weight:700">${esc(qText(q))}</div>
    ${qAlt(q) ? `<div class="small muted" style="margin-top:6px">${esc(qAlt(q))}</div>` : ''}
    <div style="margin-top:14px">${body}</div>
  </section>
  <div class="grid2">
    <button class="btn ghost" id="prev" ${exam.i === 0 ? 'disabled' : ''}>${esc(t('prev'))}</button>
    ${exam.i === exam.questions.length - 1
      ? `<button class="btn primary" id="submit">${esc(t('submit'))}</button>`
      : `<button class="btn primary" id="next">${esc(t('next'))}</button>`}
  </div>
  <button class="btn ghost sm" style="width:100%;margin-top:10px" id="submit2">${esc(t('submit'))} (${answered}/${exam.questions.length})</button>`;
}

function finishExam(auto = false) {
  const secs = Math.round((Date.now() - exam.started) / 1000);
  let score = 0;
  const detail = exam.questions.map(q => {
    const a = exam.answers[q.id] || {};
    const ok = isWritten(q) ? a.ok === true : (a.pick != null && a.pick === a.correctIndex);
    if (ok) score++;
    S.record(q.id, ok);
    // a missed exam question goes back into the card rotation right away
    if (!ok) S.schedule(q.id, 0); else if (S.isNew(q.id)) S.schedule(q.id, 4);
    return { id: q.id, ok };
  });
  exam.result = { score, total: exam.questions.length, secs, detail };
  S.state.exams.push({
    ts: Date.now(), mode: exam.mode, score, total: exam.questions.length, secs,
    wrong: detail.filter(d => !d.ok).map(d => d.id),
  });
  S.save();
  localStorage.removeItem(EXAM_KEY);
  if (auto) toast(t('timeUp'));
  render();
}

function ExamResult() {
  const r = exam.result;
  const p = pct(r.score / r.total);
  const byTopic = {};
  for (const d of r.detail) {
    const tid = QBY[d.id].t;
    byTopic[tid] ||= { ok: 0, n: 0 };
    byTopic[tid].n++; if (d.ok) byTopic[tid].ok++;
  }
  const wrong = r.detail.filter(d => !d.ok).map(d => QBY[d.id]);
  return `
  <section class="card" style="text-align:center">
    <div class="ring" style="--p:${p};margin:0 auto"><div><div>
      <b style="font-size:24px">${p}%</b><div class="tiny muted">${r.score}/${r.total}</div></div></div></div>
    <div style="margin-top:12px;font-weight:700;color:${p >= 70 ? 'var(--good)' : 'var(--warn)'}">${esc(p >= 70 ? t('pass') : t('fail'))}</div>
    <div class="tiny muted">${esc(t('target'))} · ${fmtTime(r.secs)}</div>
  </section>
  <div class="sec-title">${esc(t('byTopic'))}</div>
  ${Object.entries(byTopic).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n).map(([tid, v]) => `
    <div class="card tight">
      <div class="row spread"><span class="small">${esc(topicName(tid))}</span><span class="tiny muted">${v.ok}/${v.n}</span></div>
      <div class="bar" style="margin-top:7px"><i class="${v.ok === v.n ? 'good' : ''}" style="width:${pct(v.ok / v.n)}%"></i></div>
    </div>`).join('')}
  <div class="stack" style="margin-top:14px">
    ${wrong.length ? `<button class="btn primary" id="retryWrong">${esc(t('retryWrong'))} (${wrong.length})</button>` : ''}
    <button class="btn" data-go="#/exam">${esc(t('exam'))}</button>
    <button class="btn ghost" data-go="#/">${esc(t('backHome'))}</button>
  </div>
  ${wrong.length ? `<div class="sec-title">${esc(t('review'))}</div>${wrong.map(q => qaBlock(q)).join('')}` : ''}`;
}

// ---------------------------------------------------------------- BROWSE
let browseState = { q: '', topic: '', diff: '', starred: false };

function Browse() {
  const term = browseState.q.trim().toLowerCase();
  let list = BANK.questions;
  if (browseState.topic) list = list.filter(q => q.t === browseState.topic);
  if (browseState.diff) list = list.filter(q => q.d === browseState.diff);
  if (browseState.starred) list = list.filter(q => S.isStarred(q.id));
  if (term) list = list.filter(q =>
    (q.qe + ' ' + q.qg + ' ' + q.ae + ' ' + q.ag + ' ' + q.tags.join(' ')).toLowerCase().includes(term));

  return `
  <section class="card">
    <input id="search" type="search" placeholder="${esc(t('search'))}" value="${esc(browseState.q)}" autocomplete="off">
    <div class="grid2" style="margin-top:10px">
      <select id="btopic"><option value="">${esc(t('allTopics'))}</option>
        ${BANK.topics.map(x => `<option value="${x.id}" ${browseState.topic === x.id ? 'selected' : ''}>${esc(topicName(x.id))}</option>`).join('')}</select>
      <select id="bdiff"><option value="">${esc(t('all'))}</option>
        ${['easy', 'medium', 'hard'].map(d => `<option value="${d}" ${browseState.diff === d ? 'selected' : ''}>${esc(t(d))}</option>`).join('')}</select>
    </div>
    <button class="btn sm ${browseState.starred ? 'primary' : ''}" style="margin-top:10px;width:100%" id="bstar">
      &#9733; ${esc(t('starred'))} (${S.state.starred.length})</button>
  </section>
  <div class="row spread small muted" style="margin:0 4px 8px"><span>${list.length} ${esc(t('results'))}</span>
    ${list.length ? `<button class="btn sm" data-quiz-list="1">${esc(t('exam'))}</button>` : ''}</div>
  ${list.length ? list.slice(0, 120).map(q => qaBlock(q, term)).join('') : `<div class="empty">${esc(t('noResults'))}</div>`}
  ${list.length > 120 ? `<div class="empty tiny">+${list.length - 120}</div>` : ''}`;
}

// ---------------------------------------------------------------- STATS
function Stats() {
  const m = mastery();
  const days = Object.keys(S.state.days).sort().slice(-14);
  const max = Math.max(1, ...days.map(d => S.state.days[d]));
  const weak = decks.weak();
  return `
  <section class="card">
    <div class="grid3" style="text-align:center">
      <div><b style="font-size:20px">${pct(m.coverage)}%</b><div class="tiny muted">${esc(t('coverage'))}</div></div>
      <div><b style="font-size:20px">${pct(m.learned)}%</b><div class="tiny muted">${esc(t('mastery'))}</div></div>
      <div><b style="font-size:20px">${pct(m.accuracy)}%</b><div class="tiny muted">${esc(t('accuracy'))}</div></div>
    </div>
    <div class="row" style="gap:3px;align-items:flex-end;height:70px;margin-top:16px">
      ${days.length ? days.map(d => `<div style="flex:1;text-align:center" title="${d}: ${S.state.days[d]}">
        <div style="height:${Math.round(56 * S.state.days[d] / max)}px;background:var(--brand);border-radius:4px 4px 0 0"></div>
        <div class="tiny muted" style="font-size:9px">${d.slice(8)}</div></div>`).join('')
      : `<div class="empty tiny" style="flex:1">—</div>`}
    </div>
  </section>
  <div class="sec-title">${esc(t('byTopic'))}</div>
  ${BANK.topics.map(tp => {
    const st = topicStats(tp.id);
    return `<button class="list-item" data-go="#/topic/${tp.id}">
      <div class="row spread"><span class="t">${esc(topicName(tp.id))}</span>
        <span class="tiny muted nowrap">${st.acc === null ? '—' : pct(st.acc) + '%'} · ${st.learned}/${st.total}</span></div>
      <div class="bar" style="margin-top:8px"><i class="${st.learned === st.total ? 'good' : ''}" style="width:${pct(st.learned / st.total)}%"></i></div>
    </button>`;
  }).join('')}
  ${weak.length ? `<div class="sec-title">${esc(t('weak'))} (${weak.length})</div>
    <button class="btn primary" style="margin-bottom:10px" data-go="#/cards/run?deck=weak&n=20">${esc(t('drillWeak'))}</button>
    ${weak.slice(0, 25).map(q => qaBlock(q)).join('')}` : ''}
  <div class="sec-title">${esc(t('history'))}</div>
  ${examHistory()}`;
}

function Settings() {
  return `
  <section class="card">
    <label class="field"><span>${esc(t('examDate'))}</span>
      <input id="examDate" type="date" value="${esc(S.state.examDate)}"></label>
    <label class="field"><span>${esc(t('dailyGoal'))}</span>
      <input id="goal" type="number" min="5" max="200" step="5" value="${S.state.dailyGoal}"></label>
    <label class="field"><span>${esc(t('settings'))} · language</span>
      <select id="langSel">
        <option value="en" ${S.state.lang === 'en' ? 'selected' : ''}>English</option>
        <option value="el" ${S.state.lang === 'el' ? 'selected' : ''}>Ελληνικά</option>
        <option value="both" ${S.state.lang === 'both' ? 'selected' : ''}>EN + EL</option></select></label>
    <div class="stack">
      <button class="btn" id="export">${esc(t('exportD'))}</button>
      <button class="btn" id="import">${esc(t('importD'))}</button>
      <button class="btn" id="reset" style="color:var(--bad)">${esc(t('resetD'))}</button>
    </div>
  </section>
  <div class="card small muted">
    <div><b>${esc(BANK.meta.title || '')}</b></div>
    <div style="margin-top:6px">${esc(BANK.meta.position_en || '')}</div>
    <div style="margin-top:6px">${BANK.questions.length} questions · ${BANK.topics.length} topics</div>
  </div>`;
}

// ---------------------------------------------------------------- router
function parseRoute() {
  const raw = location.hash.slice(1) || '/';
  const [path, qs] = raw.split('?');
  return { path, qs: qs || '', params: Object.fromEntries(new URLSearchParams(qs || '')) };
}

let clockTimer = null;

function render() {
  const { path, params, qs } = parseRoute();
  clearInterval(clockTimer); clockTimer = null;
  let html, title = 'YAD105', tab = 'home', back = false;

  if (path === '/' || path === '') { html = Home(); }
  else if (path === '/cards') { html = CardsSetup(); title = t('cards'); tab = 'cards'; }
  else if (path === '/cards/run') {
    tab = 'cards'; title = t('cards'); back = true;
    if (!session || session.route !== qs) { startCards(params); return; }
    html = CardsRun();
  }
  else if (path === '/exam') { html = ExamSetup(); title = t('exam'); tab = 'exam'; }
  else if (path === '/exam/run') {
    tab = 'exam'; title = t('exam'); back = true;
    if (!exam || exam.route !== qs) { startExam(params); return; }
    html = ExamRun();
  }
  else if (path.startsWith('/topic/')) { html = Topic(path.split('/')[2]); title = t('topics'); back = true; }
  else if (path === '/browse') { html = Browse(); title = t('browse'); tab = 'browse'; }
  else if (path === '/stats') { html = Stats(); title = t('stats'); tab = 'stats'; }
  else if (path === '/settings') { html = Settings(); title = t('settings'); back = true; }
  else { html = Home(); }

  view.innerHTML = html;
  $('#topTitle').textContent = title;
  $('#backBtn').hidden = !back;
  $('#langBtn').textContent = S.state.lang === 'both' ? 'EN/EL' : S.state.lang.toUpperCase();
  for (const a of document.querySelectorAll('.tabbar a')) a.classList.toggle('active', a.dataset.tab === tab);
  document.querySelectorAll('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n.split('.')[1]); });
  window.scrollTo(0, 0);

  if (exam && !exam.result && exam.endsAt) startClock();
  if (path === '/browse') {
    const s = $('#search');
    if (s && browseState.q) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
  }
}

function startClock() {
  clockTimer = setInterval(() => {
    if (!exam || exam.result) return clearInterval(clockTimer);
    const left = Math.max(0, Math.round((exam.endsAt - Date.now()) / 1000));
    const c = $('#clock');
    if (c) { c.textContent = fmtTime(left); c.classList.toggle('low', left < 60); }
    if (left === 0) { clearInterval(clockTimer); finishExam(true); }
  }, 1000);
}

// ---------------------------------------------------------------- events
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-go],[data-star],[data-grade],[data-pick],[data-self],[data-flagq],button');
  if (!el) return;

  if (el.dataset.go) { go(el.dataset.go); return; }

  if (el.dataset.star) {
    e.preventDefault(); e.stopPropagation();
    const on = S.toggleStar(el.dataset.star);
    el.classList.toggle('on', on);
    el.innerHTML = on ? '&#9733;' : '&#9734;';
    return;
  }
  if (el.dataset.flagq) {
    exam.flags[el.dataset.flagq] = !exam.flags[el.dataset.flagq];
    el.classList.toggle('on', !!exam.flags[el.dataset.flagq]); saveExam(); return;
  }
  if (el.dataset.grade != null) { gradeCard(Number(el.dataset.grade)); return; }
  if (el.dataset.pick != null) {
    const q = exam.questions[exam.i];
    exam.answers[q.id].pick = Number(el.dataset.pick);
    saveExam(); render(); return;
  }
  if (el.dataset.self != null) {
    const q = exam.questions[exam.i];
    exam.answers[q.id].ok = el.dataset.self === '1';
    saveExam(); render(); return;
  }

  switch (el.id) {
    case 'flip': case 'card': session.flipped = true; render(); break;
    case 'startCards':
      startCards({ deck: $('#deck').value, topic: $('#topic').value, diff: $('#diff').value, n: $('#len').value });
      history.replaceState(null, '', '#/cards/run');
      break;
    case 'startExam':
      startExam({ n: $('#n').value, mode: $('#mode').value, time: $('#time').value, topic: $('#topic').value, diff: $('#diff').value });
      history.replaceState(null, '', '#/exam/run');
      break;
    case 'resumeExam': exam = loadExam(); go('#/exam/run'); render(); break;
    case 'dropExam': localStorage.removeItem(EXAM_KEY); render(); break;
    case 'reveal': {
      const q = exam.questions[exam.i];
      exam.answers[q.id] = { ...(exam.answers[q.id] || {}), text: $('#written')?.value || '', revealed: true };
      saveExam(); render(); break;
    }
    case 'next': storeWritten(); exam.i++; saveExam(); render(); break;
    case 'prev': storeWritten(); exam.i--; saveExam(); render(); break;
    case 'submit': case 'submit2': storeWritten(); finishExam(); break;
    case 'retryWrong': startExam({ ids: exam.result.detail.filter(d => !d.ok).map(d => d.id), mode: exam.mode, time: 0 }); break;
    case 'bstar': browseState.starred = !browseState.starred; render(); break;
    case 'export': {
      const b = new Blob([S.exportData()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = `yad105-progress-${S.today()}.json`; a.click();
      URL.revokeObjectURL(a.href); break;
    }
    case 'import': {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'application/json';
      inp.onchange = async () => {
        try { S.importData(await inp.files[0].text()); toast(t('saved')); render(); }
        catch (err) { toast(String(err.message || err)); }
      };
      inp.click(); break;
    }
    case 'reset':
      if (confirm(t('resetConfirm'))) { S.reset(); localStorage.removeItem(EXAM_KEY); exam = session = null; go('#/'); render(); }
      break;
  }

  if (el.dataset.quizList) {
    startExam({ n: 20, mode: 'mcq', time: 0, topic: browseState.topic, diff: browseState.diff });
    history.pushState(null, '', '#/exam/run');
  }
});

function storeWritten() {
  const ta = $('#written');
  if (!ta || !exam) return;
  const q = exam.questions[exam.i];
  exam.answers[q.id] = { ...(exam.answers[q.id] || {}), text: ta.value };
}

document.addEventListener('input', (e) => {
  if (e.target.id === 'search') {
    browseState.q = e.target.value;
    clearTimeout(window._sT);
    window._sT = setTimeout(render, 220);
  }
  if (e.target.id === 'goal') { S.state.dailyGoal = Math.max(5, Number(e.target.value) || 30); S.save(); }
  if (e.target.id === 'examDate') { S.state.examDate = e.target.value; S.save(); }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'btopic') { browseState.topic = e.target.value; render(); }
  if (e.target.id === 'bdiff') { browseState.diff = e.target.value; render(); }
  if (e.target.id === 'langSel') { S.state.lang = e.target.value; S.save(); render(); }
});

document.addEventListener('keydown', (e) => {
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  const p = parseRoute().path;
  if (p === '/cards/run' && session) {
    if (e.code === 'Space' || e.key === 'Enter') { e.preventDefault(); if (!session.flipped) { session.flipped = true; render(); } }
    else if (session.flipped && '1234'.includes(e.key)) gradeCard([0, 3, 4, 5][Number(e.key) - 1]);
  }
  if (p === '/exam/run' && exam && !exam.result) {
    const q = exam.questions[exam.i];
    if (!isWritten(q) && 'abcd'.includes(e.key.toLowerCase())) {
      exam.answers[q.id].pick = 'abcd'.indexOf(e.key.toLowerCase()); saveExam(); render();
    } else if (e.key === 'ArrowRight' && exam.i < exam.questions.length - 1) { exam.i++; render(); }
    else if (e.key === 'ArrowLeft' && exam.i > 0) { exam.i--; render(); }
  }
});

$('#backBtn').onclick = () => history.back();
$('#langBtn').onclick = () => {
  S.state.lang = { en: 'el', el: 'both', both: 'en' }[S.state.lang];
  S.save(); render();
};
$('#themeBtn').onclick = () => {
  S.state.theme = { auto: 'light', light: 'dark', dark: 'auto' }[S.state.theme];
  document.documentElement.dataset.theme = S.state.theme;
  S.save(); toast(S.state.theme);
};

window.addEventListener('hashchange', () => {
  const p = parseRoute().path;
  if (p !== '/cards/run') session = null;
  if (p !== '/exam/run') { if (exam && !exam.result) saveExam(); exam = null; }
  render();
});

// ---------------------------------------------------------------- boot
(async function boot() {
  document.documentElement.dataset.theme = S.state.theme;
  try {
    const res = await fetch('data/questions.json');
    BANK = await res.json();
  } catch (e) {
    view.innerHTML = `<div class="empty">Could not load question bank.<br><span class="tiny">${esc(e.message)}</span></div>`;
    return;
  }
  QBY = Object.fromEntries(BANK.questions.map(q => [q.id, q]));
  TBY = Object.fromEntries(BANK.topics.map(x => [x.id, x]));
  render();
  // no service worker on localhost: it only gets in the way while developing
  if ('serviceWorker' in navigator && location.hostname !== 'localhost') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
