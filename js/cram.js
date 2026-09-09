// Editorial essentials selected from the supplied bank's priorities and questions.
// Stable, versioned lesson IDs keep the seven-day course separate from full-bank progress.
const day = (number, numbers, en, el, briefEn, briefEl) => ({
  id: `cram-v1-day-${number}`, number, topic: `day-${number}`,
  ids: numbers.map(n => `Q${String(n).padStart(3, '0')}`), en, el, briefEn, briefEl,
});
export const CRAM = [
  day(1, [1,5,9,13,18,19,22,23,24,25,27,29,33,35,38,39,40,45,52,54],
    'Database design & transactions', 'Σχεδιασμός βάσεων και συναλλαγές',
    ['Keys and constraints: distinguish primary and foreign keys; implement many-to-many with a junction table and prevent duplicate registrations with a composite UNIQUE constraint.',
     'Normalization: 1NF removes repeating groups; 2NF removes partial dependencies; 3NF removes transitive dependencies. Practise explaining a student/course/enrollment schema.',
     'Transactions: explain ACID, COMMIT and ROLLBACK. Connect isolation to concurrency anomalies and keep lock order consistent to reduce deadlocks.'],
    ['Κλειδιά και περιορισμοί: διακρίνετε πρωτεύοντα και ξένα κλειδιά· υλοποιήστε συσχέτιση πολλά-προς-πολλά με ενδιάμεσο πίνακα και αποτρέψτε διπλές εγγραφές με σύνθετο UNIQUE.',
     'Κανονικοποίηση: η 1NF αφαιρεί επαναλαμβανόμενες ομάδες, η 2NF μερικές εξαρτήσεις και η 3NF μεταβατικές εξαρτήσεις. Εξηγήστε σχήμα φοιτητών, μαθημάτων και εγγραφών.',
     'Συναλλαγές: εξηγήστε ACID, COMMIT και ROLLBACK. Συνδέστε την απομόνωση με ανωμαλίες ταυτοχρονισμού και τη σταθερή σειρά κλειδώματος με τη μείωση αδιεξόδων.']),
  day(2, [57,58,59,60,61,64,65,70,71,75,79,80,85,87,90,93,96,99,103,119],
    'SQL you can write & troubleshoot', 'SQL στην πράξη και διάγνωση απόδοσης',
    ['Write the queries, not just their definitions: joins, counts per course, HAVING, missing registrations, duplicates and top students. Check what one output row represents.',
     'WHERE filters rows before grouping; HAVING filters groups. Use IS NULL, understand NULL in comparisons, and distinguish UNION from UNION ALL.',
     'Use bind variables. For slow SQL: reproduce, inspect the actual plan and row counts, statistics, indexes and waits; measure the fix. Indexes also cost writes and space.'],
    ['Γράψτε τα ερωτήματα: συνενώσεις, πλήθος ανά μάθημα, HAVING, φοιτητές χωρίς εγγραφή, διπλότυπα και κορυφαίοι φοιτητές. Ελέγξτε τι αντιπροσωπεύει κάθε γραμμή αποτελέσματος.',
     'Το WHERE φιλτράρει γραμμές πριν την ομαδοποίηση· το HAVING ομάδες. Χρησιμοποιήστε IS NULL, κατανοήστε το NULL στις συγκρίσεις και διακρίνετε UNION από UNION ALL.',
     'Χρησιμοποιήστε μεταβλητές δέσμευσης. Για αργή SQL: αναπαραγωγή, πραγματικό σχέδιο και πλήθος γραμμών, στατιστικά, ευρετήρια και αναμονές· μετρήστε τη διόρθωση. Τα ευρετήρια κοστίζουν σε εγγραφές και χώρο.']),
  day(3, [123,127,128,137,140,141,143,146,152,157,167,175,177,178,181,184,193,194,199,202],
    'Oracle, PL/SQL & APEX', 'Oracle, PL/SQL και APEX',
    ['Oracle: instance versus database; redo for recovery versus undo for rollback/read consistency. Know a PL/SQL block, procedures/functions, packages and exception handling.',
     'APEX: browser → ORDS → database/APEX engine. Explain forms, reports/grids, server-side validations, dynamic actions and session state.',
     'Enforce role-based authorization on pages and processes; hiding a button is insufficient. Know Session State Protection, least-privilege grants and APEX debugging.'],
    ['Oracle: στιγμιότυπο έναντι βάσης· redo για ανάκαμψη και undo για αναίρεση και συνεπή ανάγνωση. Μάθετε δομή PL/SQL, διαδικασίες, συναρτήσεις, πακέτα και χειρισμό εξαιρέσεων.',
     'APEX: φυλλομετρητής → ORDS → βάση και μηχανή APEX. Εξηγήστε φόρμες, αναφορές και πλέγματα, επικυρώσεις στον διακομιστή, δυναμικές ενέργειες και κατάσταση συνόδου.',
     'Επιβάλετε εξουσιοδότηση βάσει ρόλου σε σελίδες και διεργασίες· η απόκρυψη κουμπιού δεν αρκεί. Μάθετε προστασία κατάστασης συνόδου, ελάχιστα δικαιώματα και αποσφαλμάτωση APEX.']),
  day(4, [206,207,212,214,217,218,220,221,223,225,228,229,230,231,233,235,237,245,246,254],
    'Requirements → a deliverable system', 'Από τις απαιτήσεις στην παράδοση',
    ['Start with stakeholders and workflows. Separate functional behavior from measurable non-functional requirements; replace vague words such as “fast” with acceptance criteria.',
     'Prioritize with MoSCoW, resolve conflicts, control changes and trace each requirement to design, implementation and a test. Practise the online registration example.',
     'Explain SDLC and Agile/Waterfall trade-offs. Separate presentation, business logic and data, and development/test/production environments; use controlled CI/CD.'],
    ['Ξεκινήστε από ενδιαφερόμενους και ροές εργασίας. Διακρίνετε λειτουργική συμπεριφορά από μετρήσιμες μη λειτουργικές απαιτήσεις· αντικαταστήστε το «γρήγορο» με κριτήρια αποδοχής.',
     'Ιεραρχήστε με MoSCoW, επιλύστε συγκρούσεις, ελέγξτε αλλαγές και συνδέστε κάθε απαίτηση με σχεδιασμό, υλοποίηση και έλεγχο. Εξασκηθείτε στην ηλεκτρονική εγγραφή μαθημάτων.',
     'Εξηγήστε τον κύκλο ζωής ανάπτυξης και τα υπέρ και κατά ευέλικτης μεθόδου και καταρράκτη. Διαχωρίστε παρουσίαση, επιχειρησιακή λογική, δεδομένα και περιβάλλοντα· χρησιμοποιήστε ελεγχόμενη συνεχή ολοκλήρωση και παράδοση.']),
  day(5, [259,261,268,276,280,282,285,287,292,293,294,295,298,304,305,308,310,312,318,324],
    'Secure applications & reliable APIs', 'Ασφαλείς εφαρμογές και αξιόπιστα API',
    ['APIs: know HTTP methods/status codes, authentication, synchronous versus asynchronous calls and queues. A lost acknowledgement must not cause duplicate business effects: use idempotency keys.',
     'Security: authentication verifies identity; authorization checks permission. Apply least privilege, TLS and secure password hashing with salts.',
     'Match attack to defense: SQL injection → bind variables; XSS → context-aware output encoding; CSRF → anti-CSRF controls. Protect sessions and keep secrets/personal data out of logs.'],
    ['API: μάθετε μεθόδους και κωδικούς HTTP, ταυτοποίηση, σύγχρονες και ασύγχρονες κλήσεις και ουρές. Χαμένη επιβεβαίωση δεν πρέπει να διπλασιάζει επιχειρησιακή ενέργεια: χρησιμοποιήστε κλειδιά ταυτοδυναμίας.',
     'Ασφάλεια: η ταυτοποίηση επαληθεύει ταυτότητα· η εξουσιοδότηση ελέγχει δικαίωμα. Εφαρμόστε ελάχιστα δικαιώματα, TLS και ασφαλή κατακερματισμό κωδικών με άλατα.',
     'Αντιστοιχίστε επίθεση και άμυνα: έγχυση SQL → μεταβλητές δέσμευσης· XSS → κωδικοποίηση εξόδου ανά πλαίσιο· CSRF → αντίστοιχα μέτρα προστασίας. Προστατεύστε συνόδους και αποκλείστε μυστικά και προσωπικά δεδομένα από αρχεία καταγραφής.']),
  day(6, [323,325,328,330,333,342,345,347,348,350,351,355,360,363,367,370,373,376,387,394],
    'Testing, recovery & accessible services', 'Έλεγχοι, αποκατάσταση και προσβασιμότητα',
    ['Distinguish unit, integration, regression and user acceptance testing. Write positive, negative and boundary tests with expected results; separate defect severity from priority.',
     'RPO is acceptable data loss measured in time; RTO is the target recovery time. Redundancy and failover support availability; only tested restores establish recoverability.',
     'Troubleshoot with evidence: impact, timeline, recent changes, metrics and logs. Check accessibility through POUR, keyboard use and assistive technology; protect personal data in test environments.'],
    ['Διακρίνετε ελέγχους μονάδας, ολοκλήρωσης, παλινδρόμησης και αποδοχής χρηστών. Γράψτε θετικούς, αρνητικούς και οριακούς ελέγχους με αναμενόμενα αποτελέσματα· διακρίνετε σοβαρότητα από προτεραιότητα.',
     'Το RPO είναι αποδεκτή απώλεια δεδομένων σε χρόνο· το RTO ο στόχος χρόνου αποκατάστασης. Πλεονασμός και εναλλαγή υποστηρίζουν διαθεσιμότητα· απαιτούνται δοκιμές επαναφοράς αντιγράφων.',
     'Διάγνωση με τεκμήρια: επίπτωση, χρονολόγιο, πρόσφατες αλλαγές, μετρικές και αρχεία καταγραφής. Ελέγξτε προσβασιμότητα με τις αρχές POUR, πληκτρολόγιο και υποστηρικτική τεχνολογία· προστατεύστε προσωπικά δεδομένα στα δοκιμαστικά περιβάλλοντα.']),
  day(7, [399,400,407,412,419,421,425,426,428,432,439,443,446,447,450,451,455,456,461,463],
    'SOS scenarios & final synthesis', 'Σενάρια SOS και τελική σύνθεση',
    ['For a new university system: stakeholders → requirements → schema → security → integration → tests → rollout. Give concrete controls and explain why you chose them.',
     'For incidents and slow APEX: assess impact, gather evidence, contain/diagnose, fix, verify and monitor. Suspected SQL injection also needs investigation, not just a code patch.',
     'For procurement/migration/upgrades: objective weighted criteria, total cost and SLA; validate migrated data, rehearse, back up, define rollback triggers and check critical workflows after release.'],
    ['Για νέο πανεπιστημιακό σύστημα: ενδιαφερόμενοι → απαιτήσεις → σχήμα → ασφάλεια → διασύνδεση → έλεγχοι → διάθεση. Δώστε συγκεκριμένα μέτρα και αιτιολογήστε επιλογές.',
     'Για περιστατικά και αργή APEX: επίπτωση, συλλογή τεκμηρίων, περιορισμός και διάγνωση, διόρθωση, επαλήθευση και παρακολούθηση. Ύποπτη έγχυση SQL απαιτεί διερεύνηση πέρα από διόρθωση κώδικα.',
     'Για προμήθεια, μετάπτωση και αναβάθμιση: αντικειμενικά σταθμισμένα κριτήρια, συνολικό κόστος και SLA· επικυρώστε δεδομένα, κάντε πρόβα, πάρτε αντίγραφα, ορίστε συνθήκες επαναφοράς και ελέγξτε κρίσιμες ροές μετά την έκδοση.']),
];

export function cramCurriculum(bank) {
  const ids = new Set(bank.questions.map(q => q.id));
  for (const lesson of CRAM) for (const id of lesson.ids) {
    if (!ids.has(id)) throw new Error(`Missing essential question: ${id}`);
  }
  return CRAM;
}
