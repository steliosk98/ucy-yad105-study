import { CRAM } from './cram.js';

export const guideCopy = {
  en: { title: 'SOS printable guide', print: 'Print / Save as PDF', intro: '140 essential questions and answers · 7 days',
    hint: 'One continuous guide. Printing splits it into readable pages. Choose your language above, then print or save as PDF.',
    day: 'Day', contents: 'Jump to a day', essentials: 'Must know', answer: 'Answer', back: 'Back to lessons',
    source: 'Selected from the YAD105 study bank. Question IDs match the original bank.', diagram: 'Concept map' },
  el: { title: 'Εκτυπώσιμος οδηγός SOS', print: 'Εκτύπωση / Αποθήκευση PDF', intro: '140 βασικές ερωτήσεις και απαντήσεις · 7 ημέρες',
    hint: 'Ενιαίος οδηγός που χωρίζεται σε ευανάγνωστες σελίδες κατά την εκτύπωση. Επιλέξτε γλώσσα επάνω και έπειτα εκτυπώστε ή αποθηκεύστε ως PDF.',
    day: 'Ημέρα', contents: 'Μετάβαση σε ημέρα', essentials: 'Απαραίτητες γνώσεις', answer: 'Απάντηση', back: 'Επιστροφή στα μαθήματα',
    source: 'Επιλογή από την τράπεζα μελέτης YAD105. Τα αναγνωριστικά αντιστοιχούν στην αρχική τράπεζα.', diagram: 'Διάγραμμα εννοιών' },
};

// Semantic, text-based diagrams stay sharp, accessible and legible in monochrome.
export const diagrams = [
  { en: 'Many-to-many becomes two one-to-many relationships', el: 'Η σχέση πολλά-προς-πολλά γίνεται δύο σχέσεις ένα-προς-πολλά',
    nodes: [['Student', 'Φοιτητής', 'PK student_id'], ['Enrollment', 'Εγγραφή', 'FK student_id · FK offering_id'], ['Course offering', 'Προσφορά μαθήματος', 'PK offering_id']],
    links: ['1 → N', 'N ← 1'],
    noteEn: 'UNIQUE(student_id, offering_id) prevents duplicate registrations. Each offering belongs to a course and semester.',
    noteEl: 'Το UNIQUE(student_id, offering_id) αποτρέπει διπλές εγγραφές. Κάθε προσφορά ανήκει σε μάθημα και εξάμηνο.' },
  { en: 'SQL grouping: filter rows, then groups', el: 'Ομαδοποίηση SQL: πρώτα γραμμές, έπειτα ομάδες',
    nodes: [['FROM / JOIN', 'FROM / JOIN', ''], ['WHERE', 'WHERE', ''], ['GROUP BY', 'GROUP BY', ''], ['HAVING', 'HAVING', '']], links: ['→','→','→'],
    noteEn: 'INNER JOIN keeps matches. LEFT JOIN also keeps unmatched left rows, with NULL on the right. WHERE filters rows; HAVING filters aggregate groups. This is a conceptual sequence, not a physical execution plan.',
    noteEl: 'Το INNER JOIN κρατά αντιστοιχίες. Το LEFT JOIN κρατά και αταίριαστες αριστερές γραμμές, με NULL δεξιά. Το WHERE φιλτράρει γραμμές· το HAVING ομάδες. Πρόκειται για εννοιολογική σειρά, όχι φυσικό σχέδιο εκτέλεσης.' },
  { en: 'APEX request path', el: 'Διαδρομή αιτήματος APEX',
    nodes: [['Browser', 'Φυλλομετρητής', 'HTTPS'], ['ORDS', 'ORDS', ''], ['Oracle Database', 'Βάση Oracle', 'APEX · SQL · PL/SQL']], links: ['↔','↔'],
    noteEn: 'The browser handles presentation. ORDS is the web tier. APEX processing, application metadata and business data reside in Oracle Database.',
    noteEl: 'Ο φυλλομετρητής χειρίζεται την παρουσίαση. Το ORDS είναι το επίπεδο ιστού. Η επεξεργασία APEX, τα μεταδεδομένα εφαρμογής και τα επιχειρησιακά δεδομένα βρίσκονται στη βάση Oracle.' },
  { en: 'Trace a requirement to acceptance', el: 'Ιχνηλασιμότητα απαίτησης έως την αποδοχή',
    nodes: [['Requirement', 'Απαίτηση', ''], ['Design', 'Σχεδιασμός', ''], ['Implementation', 'Υλοποίηση', ''], ['Test evidence', 'Τεκμήρια ελέγχου', '']], links: ['→','→','→'],
    noteEn: 'Example: prevent duplicate enrollment → composite UNIQUE constraint → database/application change → test a duplicate attempt. Acceptance criteria define the expected result.',
    noteEl: 'Παράδειγμα: αποτροπή διπλής εγγραφής → σύνθετος περιορισμός UNIQUE → αλλαγή βάσης και εφαρμογής → έλεγχος διπλής προσπάθειας. Τα κριτήρια αποδοχής ορίζουν το αναμενόμενο αποτέλεσμα.' },
  { en: 'Safe retries need idempotency', el: 'Οι ασφαλείς επαναλήψεις χρειάζονται ταυτοδυναμία',
    nodes: [['Sender', 'Αποστολέας', 'request_id = 42'], ['Receiver', 'Παραλήπτης', 'UNIQUE(request_id)'], ['One business effect', 'Μία επιχειρησιακή ενέργεια', '']], links: ['→','→'],
    noteEn: 'If the acknowledgement is lost, reuse the same request ID. The receiver returns the stored outcome instead of performing the action twice. Deduplication and the business change must be transactional.',
    noteEl: 'Αν χαθεί η επιβεβαίωση, επαναχρησιμοποιήστε το ίδιο αναγνωριστικό. Ο παραλήπτης επιστρέφει το αποθηκευμένο αποτέλεσμα αντί να εκτελέσει διπλή ενέργεια. Η απαλοιφή διπλοτύπων και η αλλαγή πρέπει να είναι συναλλακτικές.' },
  { en: 'Recovery objectives on a timeline', el: 'Στόχοι αποκατάστασης σε χρονογραμμή',
    nodes: [['Last recoverable point', 'Τελευταίο ανακτήσιμο σημείο', ''], ['Incident', 'Περιστατικό', ''], ['Service restored', 'Αποκατάσταση υπηρεσίας', '']], links: ['RPO →','RTO →'],
    noteEn: 'RPO limits acceptable data loss measured in time before the incident. RTO is the target recovery duration after it. Restore tests verify that the recovery strategy can meet both objectives.',
    noteEl: 'Το RPO οριοθετεί αποδεκτή απώλεια δεδομένων σε χρόνο πριν το περιστατικό. Το RTO είναι ο στόχος διάρκειας αποκατάστασης μετά από αυτό. Οι δοκιμές επαναφοράς επαληθεύουν ότι η στρατηγική μπορεί να πετύχει και τους δύο στόχους.' },
  { en: 'A controlled production upgrade', el: 'Ελεγχόμενη αναβάθμιση παραγωγής',
    nodes: [['Rehearse & back up', 'Πρόβα και αντίγραφα', ''], ['Deploy', 'Εγκατάσταση', ''], ['Validate', 'Επαλήθευση', ''], ['Monitor / roll back', 'Παρακολούθηση / επαναφορά', '']], links: ['→','→','→'],
    noteEn: 'Agree rollback triggers and decision authority before deployment. Validate login, critical workflows, integrations, data and monitoring; roll back if the agreed criteria require it.',
    noteEl: 'Συμφωνήστε συνθήκες επαναφοράς και αρμοδιότητα απόφασης πριν την εγκατάσταση. Επαληθεύστε σύνδεση, κρίσιμες ροές, διασυνδέσεις, δεδομένα και παρακολούθηση· επαναφέρετε όταν το απαιτούν τα συμφωνημένα κριτήρια.' },
];

export function sosGuide(bank, lang, esc) {
  const t = guideCopy[lang === 'el' ? 'el' : 'en'];
  const byId = Object.fromEntries(bank.questions.map(q => [q.id, q]));
  const pair = (en, el) => lang === 'both'
    ? `<div lang="en">${esc(en)}</div><div class="guide-greek" lang="el">${esc(el)}</div>`
    : `<div lang="${lang}">${esc(lang === 'el' ? el : en)}</div>`;
  const illustration = (d, i) => `<figure class="guide-diagram" aria-labelledby="diagram-${i}">
    <figcaption id="diagram-${i}">${pair(d.en, d.el)}</figcaption>
    <div class="guide-flow">${d.nodes.map((n, j) => `${j ? `<span class="guide-arrow" aria-hidden="true">${esc(d.links[j - 1])}</span>` : ''}<div class="guide-box">${pair(n[0], n[1])}${n[2] ? `<code>${esc(n[2])}</code>` : ''}</div>`).join('')}</div>
    <div class="guide-caption">${pair(d.noteEn, d.noteEl)}</div></figure>`;
  return `<article class="sos-guide">
    <div class="guide-controls"><button class="btn primary" id="printGuide">${esc(t.print)}</button><button class="btn" data-go="#/learn">${esc(t.back)}</button></div>
    <header class="guide-heading"><p>YAD105 · SOS</p><h2>${esc(t.title)}</h2><p>${esc(t.intro)}</p><p class="guide-screen-note">${esc(t.hint)}</p><p class="guide-source">${esc(t.source)}</p></header>
    <nav class="guide-contents" aria-label="${esc(t.contents)}">${CRAM.map(l => `<button class="btn" data-guide-day="${l.number}">${esc(t.day)} ${l.number}</button>`).join('')}</nav>
    ${CRAM.map((l, i) => `<section class="guide-day" id="guide-day-${l.number}" aria-labelledby="guide-title-${l.number}">
      <header><p class="guide-day-number">${esc(t.day)} ${l.number} / 7</p><h2 id="guide-title-${l.number}">${pair(l.en, l.el)}</h2></header>
      <aside class="guide-essentials"><h3>${esc(t.essentials)}</h3><ul>${l.briefEn.map((b,j) => `<li>${pair(b,l.briefEl[j])}</li>`).join('')}</ul></aside>
      ${illustration(diagrams[i], i)}
      ${l.ids.map((id, j) => { const q = byId[id]; return `<section class="guide-qa" data-question-id="${id}" aria-labelledby="guide-q-${id}"><h3 id="guide-q-${id}"><span class="guide-qid">${j + 1}. ${id}</span>${pair(q.qe,q.qg)}</h3><div class="guide-answer"><span class="guide-answer-label">${esc(t.answer)}</span>${pair(q.ae,q.ag)}</div></section>`; }).join('')}
    </section>`).join('')}</article>`;
}
