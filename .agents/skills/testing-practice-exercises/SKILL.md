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

## Lesson identity system (icon + hue per lesson)
- `src/lib/lesson-identity.ts` maps each topic slug to a Lucide icon + OKLCH hue; the same icon/hue should appear on 4 surfaces: Home/Topics lesson cards, the lesson detail header, Grammar "Rules by lesson" pills, and Practice "By lesson" rows.
- Quick spot-checks when verifying identity changes: Body Parts = red hand, Numbers = blue hash, Time = teal clock, The Marketplace = amber basket, Colours = pink palette. A regression would show identical/grey chips or index-cycled colors (e.g. rows 1 and 7 sharing a hue).
- Tailwind gotcha for similar changes: color classes must be full literal strings (no template-literal hue interpolation) or the styles silently won't be generated in the build.

## Home dashboard hero (goal ring, streak flame, path nodes)
- The Home hero shows a daily-goal `ProgressRing` (seen/goal inside; green + check with aria-label "Goal reached" at 100%) and a streak flame (gold + flickering when streak > 0, grey when 0).
- To force the goal-reached state non-destructively, click the "N cards" daily-goal button in the hero footer and set the goal ≤ cards seen today; restore the original goal afterwards. Avoid "Reset progress" — it destroys the whole localStorage state.
- "Today's path" renders 4 connected nodes: current ready step = solid primary node with a pulsing halo (`path-node-pulse`), other ready steps = grey outlined, complete = green check node with green connector. Completing the due deck (via "Continue today's path") flips the corresponding node(s) — note the same word can satisfy both "due" and "weak", completing two steps at once.
- Animations (flame flicker, node pulse, ring pop) only show in a recording; the stripped DOM's `aria-label="Progress N%"` on the ring SVG is the reliable way to assert fill percentage.

## Gotchas
- After flipping a flashcard, button positions shift slightly; re-screenshot before clicking Got it right/wrong or the click may miss.
- Stat tiles animate — a screenshot taken immediately shows mid-count values; wait ~1.5s for final numbers.
- The Next.js dev overlay may show a persistent "1 issue" badge (an `eval()`/Content-Security-Policy console warning). This is dev-mode-only and pre-existing — verify against main before attributing it to a PR, and don't block testing on it.
- Repo uses a newer Next.js than training data; read `node_modules/next/dist/docs/` before code changes (see AGENTS.md).
- Lint/typecheck/tests: `npm run lint`, `npx tsc --noEmit`, `npx vitest run`.

## Devin Secrets Needed
- None (public app, no login).
