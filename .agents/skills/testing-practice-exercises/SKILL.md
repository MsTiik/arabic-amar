---
name: testing-practice-exercises
description: Test the Practice page exercise runner (quiz decks, flashcards, feedback animations, completion screen) end-to-end in the browser. Use when verifying changes to exercise-runner.tsx, practice decks, or gamification/animation features.
---

# Testing the Practice exercise runner

## Setup
- Run locally: `npm install && npm run dev` → http://localhost:3000/practice
- No auth; all progress (streak, daily goal, mastery) lives in localStorage. Clear localStorage to reset state between test runs if needed.
- Vercel preview deployments might redirect to Vercel SSO login and be untestable; if so, test on a local dev server checked out to the PR branch instead.

## Deck selection tips
- "Mixed multiple choice" (12 questions) is the fastest deck for testing answer feedback, progress bar, combo streaks, and the completion screen in one run.
- "Flashcards (mixed)" tests the 3D flip; the card has front/back faces — mid-flip screenshots capture the perspective rotation.
- Correct answers are readable from the stripped DOM (option button text) plus the Arabic prompt; you can deliberately answer wrong once to test the red/miss path, then answer correctly 3+ times in a row to trigger the combo chip.

## What to verify (current juiced behavior)
- Header: fat progress bar + "N / total" counter; bar grows per answer.
- Correct: option pops green; full-width green feedback bar with check + "Correct!" + Continue (auto-focused, Enter advances).
- Wrong: option shakes red; red bar shows "Answer: <correct>".
- Combo chip "N in a row!" (gold, flame icon) appears at 3+ consecutive correct, increments, disappears after a miss. It appears on the NEXT question, since combo updates on Continue.
- Completion: trophy pop; confetti only if accuracy ≥80%; "Perfect session!" (100%) / "Great work!" (≥80%) / "Session complete"; stat tiles count up (~0.8s — wait before screenshotting final values); "Best streak: N in a row" chip if best combo ≥3.

## Practice picker (deck chooser) behavior
- The picker may have a hero "Today's session" teal banner with a gold CTA; it builds a 12-card MC deck prioritising due → mistakes → new → random fill, and the subtitle lists the mix (e.g. "1 due · 1 to fix · new words").
- State decks (Review due / Review mistakes / Add new words) only render when localStorage progress has matching words; seed state by answering a card wrong (creates a mistake) or waiting for due reviews. Badge pills ("N due", "N to fix", "10 new") should match the progress state.
- By-lesson rows link to `/practice?topic=<slug>&kind=mc` and show per-lesson mastery progress bars.

## Gotchas
- After flipping a flashcard, button positions shift slightly; re-screenshot before clicking Got it right/wrong or the click may miss.
- Stat tiles animate — a screenshot taken immediately shows mid-count values; wait ~1.5s for final numbers.
- Repo uses a newer Next.js than training data; read `node_modules/next/dist/docs/` before code changes (see AGENTS.md).
- Lint/typecheck/tests: `npm run lint`, `npx tsc --noEmit`, `npx vitest run`.

## Devin Secrets Needed
- None (public app, no login).
