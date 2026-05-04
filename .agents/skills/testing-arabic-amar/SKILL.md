---
name: testing-arabic-amar
description: Test Arabic AMAR UI/runtime flows end-to-end. Use when verifying learner-facing pages, content QA, vocabulary search, audio state, progress, or admin refresh UI.
---

# Testing Arabic AMAR

## Devin Secrets Needed

- None for standard local UI testing.
- A real `ADMIN_REFRESH_TOKEN` is only needed when verifying that the admin refresh API accepts a token and triggers a deploy hook. It is not needed to verify the admin token-entry dialog UI.

## Local setup

1. Start the app from the repo root:
   ```bash
   npm run dev
   ```
2. Verify reachability before browser testing:
   ```bash
   python3 - <<'PY'
   import urllib.request
   for url in ['http://127.0.0.1:3000/', 'http://127.0.0.1:3000/#admin']:
       with urllib.request.urlopen(url, timeout=5) as r:
           print(url, r.status)
   PY
   ```
3. If a Vercel preview is auth-protected or returns `401` from the VM, test the PR branch locally instead and mention that caveat in the report.

## Browser state reset

Use a clean browser state for progress-sensitive flows:

```js
localStorage.removeItem('arabic-amar:progress:v1');
localStorage.removeItem('arabic-amar:admin-refresh-token');
location.href = 'http://localhost:3000/';
```

The admin panel is revealed by visiting:

```text
http://localhost:3000/#admin
```

## UI testing guidance

- Prefer visible UI interactions over API calls for learner/admin flows.
- Record browser tests when validating UI behavior and annotate the recording with setup, test starts, and pass/fail assertions.
- Use screenshots for each important state: before/after values, dialogs, error states, and confirmation states.
- If Chrome types a localhost URL incorrectly, correct it and note the caveat; this is a testing artifact, not necessarily an app issue.

## Common assertions

### Progress/daily goal

- Clean state should show `Today 0/20` and daily goal `20 cards`.
- Setting a custom goal should update both the hero stat and the daily-goal link without a page reload.
- Reset cancel should preserve the current progress state.
- Reset confirm should restore default progress values.

### Admin refresh UI

- `/#admin` should reveal the admin refresh panel.
- Without `arabic-amar:admin-refresh-token` in localStorage, clicking the refresh button should show the token-entry UI instead of immediately attempting refresh.
- Canceling the token-entry UI should leave the refresh button visible and should not store a token.

### Content/vocabulary/audio flows

- Content QA metrics should be checked against the exact expected counts for the PR being tested.
- Vocabulary searches should verify both result counts and card text, especially Arabic forms with diacritics, spaces, or `/` pairs.
- Audio tests should compare at least one word with enabled audio and one word with unavailable audio when audio UI changes are in scope.
