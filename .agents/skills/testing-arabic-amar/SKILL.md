---
name: testing-arabic-amar
description: Test Arabic AMAR runtime UI flows end-to-end. Use when validating practice decks, flashcards, navigation, sync entry points, or other visible app behavior.
---

# Arabic AMAR Runtime Testing

## Devin Secrets Needed

- None for public/local practice-deck UI testing.
- Supabase sync testing may require production/preview environment variables already configured in the deployment: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Do not request service-role keys for frontend sync testing.

## Standard setup

1. Work from the PR branch under `/home/ubuntu/repos/arabic-amar`.
2. Prefer a production-like local server when testing interactions:
   - `npm run build`
   - `npm run start`
   - open `http://localhost:3000`
3. If a Vercel preview URL is available, try it first. It might be protected by Vercel SSO for Devin; if it returns `HTTP/2 401`, use the local production server instead and report that caveat.
4. Before recording browser tests on Linux, maximize Chrome with:
   - `sudo apt-get install -y wmctrl 2>/dev/null; wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`

## Useful app routes

- Mixed practice selection: `/practice`
- Topic flashcards: `/practice?topic=body-parts&kind=flashcard`
- Other topic decks generally use `/practice?topic=<topic-slug>&kind=<kind>` where `kind=flashcard` routes to `makeFlashcardDeck`.
- Sync page: `/sync`

## Flashcard UX testing checklist

When validating flashcards, test one concrete deck such as body parts:

1. Open `/practice?topic=body-parts&kind=flashcard`.
2. Confirm the session title is `Body Parts · Flashcards` and card counter starts at `Card 1 of ...`.
3. Confirm the Arabic side shows label `Arabic` and helper `Tap card to show English`.
4. Click `Show pronunciation`; it should reveal pronunciation while staying on the Arabic side.
5. Click a broad blank/lower area of the card surface; it should flip to label `English` and helper `Tap card to show Arabic`.
6. Click the broad card surface again; it should flip back to `Arabic`.
7. Click `Got it right`; it should advance to `Card 2 of ...`.

## Evidence expectations

- For UI testing, record one focused walkthrough with annotations.
- Add annotations for precondition, primary state changes, and final assertion.
- Capture full screenshots for important pass/fail states.
- Post one concise PR comment with bullets for passed/failed/untested assertions and include the Devin session link.
- Write a separate `test-report.md` (or PR-specific variant) with inline screenshot URLs and attach it in the final user message.

## Known caveats

- Local `npm run build` regenerates content JSON and audio manifests. Revert unrelated generated timestamp/audio changes before committing or reporting if the PR is unrelated to content.
- The build may show a Next.js workspace-root warning if `/home/ubuntu/package-lock.json` exists. This has been observed while builds still complete successfully.
- At narrow mobile viewport heights, rating buttons can be below the first screen and require scrolling; focus mobile spot checks on the changed component unless the PR specifically changes layout below the card.
