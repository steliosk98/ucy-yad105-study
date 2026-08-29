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
- **Bilingual** EN / EL / side-by-side, dark mode, installable as a PWA and usable offline.
- Keyboard: `Space` flips a card, `1-4` grades it, `A-D` answers, arrows move between
  exam questions.

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
data/questions.json   the question bank the app loads
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
