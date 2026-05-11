---
name: testing-content-refresh
description: Test Arabic AMAR Google Doc content/parser refreshes end-to-end. Use when verifying updated curriculum content, parser table-shape changes, or grammar/reference rendering.
---

# Testing Arabic AMAR content refreshes

Use this skill when a PR updates `content/content.json`, parser table-shape handling, lesson/topic pages, or grammar reference content.

## Devin Secrets Needed

- None for public content and grammar rendering tests.
- If testing Supabase sync in the same session, use the existing Supabase/Vercel public env vars configured for the app; do not request or expose service-role keys.

## Setup

1. Check PR comments and CI status before runtime testing.
2. Run validation from repo root:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
3. Start a production-like local server after the build:
   ```bash
   npm start
   ```
4. If doing browser testing, maximize the browser before recording. For mobile spot checks, resize the active Chrome window to a narrow width with `wmctrl` if available.

## Content refresh assertions

For Google Doc/parser refreshes, verify both generated data and visible UI. Useful pages:

- `/topics/nouns-in-the-classroom` — vocabulary cards should show new classroom nouns and singular/plural pairs.
- `/topics/verbs-in-the-classroom` — click `Rules`; large verb/prose material should render as rule/explainer content rather than being skipped.
- `/grammar/pronouns` — attached suffix pronouns should appear under `Attached pronouns`, not just detached pronouns.
- `/grammar/conjugations` — command forms should be reachable via a `Command (Amr)` tab when present in generated content.
- `/admin/content-health` — check parser warnings and QA issues when a PR changes content generation.

## Evidence to capture

- Record a walkthrough if the test uses browser interactions.
- Annotate each major assertion in the recording.
- Capture screenshots of each pass/fail state and include them inline in `test-report.md`.
- For mobile concerns, capture at least one narrow-width screenshot showing the changed content does not overflow horizontally.

## Reporting

- Report runtime assertions as passed/failed/untested.
- Escalate parser warnings, unreadable layouts, missing content, or mobile overflow first.
- Distinguish content QA info issues like missing audio from parser/layout failures.
- Post one consolidated PR comment with a short summary, validation results, recording link, and test report link.
