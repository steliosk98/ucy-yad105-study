# YAD105 Exam Trainer

A self-study web app for the **University of Cyprus YAD105** technical exam
(*University Officer — Application / Database Design and Development*), built over a
knowledge bank of **463 bilingual (EN/EL) questions** across 15 topics.

**→ [Open the app](https://steliosk98.github.io/ucy-yad105-study/)**

Static site, no build step, no backend. All progress lives in your browser's
`localStorage`, so it is private to your device (export/import it from Settings).

## Features

- **Flashcards** with SM-2 spaced repetition — *Again / Hard / Good / Easy*, showing the
  next interval on each button. Missed cards come back later in the same session.
- **Mock exams** — multiple choice (auto-graded), written (self-graded against the model
  answer, with a keyword-overlap hint), or mixed. Configurable length, timer, topic and
  difficulty. Exams survive a reload or a locked phone and can be resumed.
- **Decks**: due, unseen, weak spots, starred, per topic, per difficulty.
- **Browse & search** across questions, answers and tags in both languages, with hit
  highlighting and starring.
- **Progress**: readiness score, daily streak, 14-day activity, per-topic mastery and
  accuracy, exam history, weak-spot drills.
- **Study pace** — set your exam date in Settings and the home screen shows the days left
  and how many unseen cards a day are needed to cover the whole bank in time.
- **Bilingual** EN / EL / side-by-side, dark mode, installable as a PWA and usable offline.
- Keyboard: `Space` flips a card, `1-4` grades it, `A-D` answers, arrows move between
  exam questions.

## Design

**Modern Dark Cinema** — a premium-productivity register rather than a playful one, since
this is a professional certification exam. Dark is the primary theme (never pure black, so
OLED panels don't smear), with a fully worked light counterpart.

- **Type**: Inter throughout, on a precision scale — 600 weight with tight tracking for
  headings, 400 for body, uppercase +.12em for labels. Tabular figures on every timer,
  score and counter so nothing jitters. Inter covers Greek, which this bank needs; the
  document `lang` follows the UI language so Greek capitals drop their accents correctly.
- **Colour**: semantic tokens only (`--accent`, `--good`, `--fg-muted`, …) defined once per
  theme; no raw hex in components. Violet accent, emerald for correct, rose for missed.
- **Depth**: ambient drifting colour fields behind a glass top bar and tab bar, hairline
  top-edge highlights on cards, layered shadows.
- **Motion**: one easing curve (`cubic-bezier(.16,1,.3,1)`), 140–320ms, staggered view
  entrances, and a genuine 3D flip on the flashcards. All of it collapses under
  `prefers-reduced-motion`.
- **Accessibility**: 44px minimum touch targets, AA contrast verified across the whole CTA
  gradient in both themes, difficulty shown as a dot plus a word rather than colour alone,
  `aria-current` on navigation, `aria-pressed` on toggles, visible focus rings, SVG icons
  rather than emoji.

## The Greek text

The supplied knowledge bank's Greek was heavily code-mixed — some answers were properly
translated, others left whole English phrases in place ("Reusable server-side processes στο
application level που μπορούν να καλούνται από pages"). Before the revision, **314 of the
463 answers were less than half Greek**; now 11 are, and all eleven are pure SQL.

All 463 questions and answers were re-translated for a technical exam sat in Greek. The
convention: proper Greek prose, the formal Greek term first with the English in parentheses
on first use (*ευρετήριο (index)*, *πληθικότητα (cardinality)*), and identifiers left exactly
as they are — SQL keywords, product names, code. `data/GLOSSARY.el.md` holds the term list
that keeps this consistent across the bank.

The supplied export is never edited. `data/el/*.json` holds the revised Greek keyed by
question id, and `tools/build_data.py` layers it over the export at build time, so the
original stays intact as provenance and the re-translation is reviewable as a diff.
`npm test` guards against regressing: it fails if a non-code answer drops below 50% Greek
characters, or if a Latin `?` appears where Greek uses `;`.

## Multiple-choice options

The knowledge bank holds open questions and model answers, with no distractors. Wrong
options are generated at runtime from other answers *in the same topic*, rejecting any
candidate that overlaps the correct answer too much (which could read as correct as well)
and keeping option lengths comparable. Generation is seeded per question, so options stay
stable across re-renders.

## Layout

```
index.html            app shell
css/style.css         mobile-first styles, light/dark
js/store.js           persistence, SM-2 scheduling, stats
js/quiz.js            distractor generation, exam sampling, written scoring
js/app.js             views, routing, events
data/questions.json   the question bank the app loads (generated)
data/el/*.json        revised Greek, layered over the supplied export
data/GLOSSARY.el.md   Greek terminology used across the bank
tests/check.mjs       sanity checks over the real bank
```

## Development

```bash
npx http-server . -p 5177 -c-1
```

```bash
npm test
```

The test asserts data integrity and that every question in both languages yields four
distinct options containing the correct answer.

Regenerate `data/questions.json` from a new knowledge-bank export with
`tools/build_data.py`.
