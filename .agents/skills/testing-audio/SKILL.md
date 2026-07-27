---
name: testing-audio
description: Test word-pronunciation audio in Arabic AMAR (SpeakerButton, audio manifest, local audio mirror, blob prefetch, Wikimedia/Quran.com playback). Use when verifying speaker-button, audio-manifest, audio-prefetch, or CSP media changes.
---

# Testing pronunciation audio (Arabic AMAR)

Use when verifying `src/components/speaker-button.tsx`, `src/lib/audio.ts`, `src/lib/audio-prefetch.ts`, `scripts/build-audio-manifest.ts`, `content/audio-manifest.json`, or `content/audio-local.json`.

## How the feature works
- A `<SpeakerButton>` renders next to Arabic words **only when the word is in `content/audio-manifest.json`** — otherwise it renders unavailable/null (graceful fallback, intentional).
- Clicking plays `new Audio(url)`. URL resolution order (since PR #78):
  1. **Local mirror**: `content/audio-local.json` maps manifest keys → same-origin `/audio/words/<md5>.mp3` (vocab) and `/audio/quran/SSSAAA.mp3` (ayat, surah/ayah zero-padded to 3 digits). Files live in `public/audio/`. `getAudioForWord`/`getAudioForCitation` prefer these.
  2. **Blob prefetch**: `src/lib/audio-prefetch.ts` — ExerciseRunner prefetches a deck's audio at deck start (network tab shows a burst of `/audio/words/*.mp3` GETs); `resolveAudioUrl()` swaps in a `blob:` object URL when playing. Object URLs are revoked when the deck unmounts (`releasePrefetchedAudio()`), then re-fetched on next deck start.
  3. Fallback: original Wikimedia Commons (Lingua Libre WAV / `Ar-X.ogg`) or Quran.com Alafasy URLs from the manifest.
- So during a practice session, expected played `src` is `blob:http://localhost:3000/...`; on reference pages without prefetch (e.g. `/grammar/pronouns`), it's the local `/audio/...` path. `upload.wikimedia.org` at play time is a regression.
- Speaker clicks call `stopPropagation()`/`preventDefault()` — a speaker click must NEVER flip a flashcard or select an MC option. Always include this regression check.
- Qur'ān ayah audio is surfaced in the UI at `/grammar/pronouns` → "Show example" on a pronoun card → recitation play button.

## Verifying manifest coverage without running the site
```bash
jq '.entries.["<arabic-with-no-tashkeel>"]' content/audio-manifest.json   # null → no speaker button
jq '.entries.["<key>"]' content/audio-local.json                          # local mirror path
```
Manifest keys are diacritic-stripped NFC Arabic (`جبين` not `جَبِينٌ`); hamza variants are folded.

## Testing playback
- **Log play() OUTCOMES, not just calls**: wrap `HTMLMediaElement.prototype.play` and record whether the returned promise fulfills or rejects (and the error name). A logged "play(blob:...)" call proves nothing — blob plays can be silently CSP-rejected (`NotSupportedError`) while the UI looks normal. Also wrap `URL.createObjectURL`/`revokeObjectURL` to correlate failures with revocations.
- Known trap: if `media-src` in next.config.ts lacks `blob:`, ALL prefetched-blob playback is CSP-refused and (since PR #79) rescued by `playWithFallback`'s network retry — audio works but the prefetch cache is dead. Verify with a `securitypolicyviolation` listener; Chrome may NOT print these refusals to the console.
- Recordings capture no sound: intercept `window.Audio`/`play()` and log to an on-screen overlay so evidence shows in recordings (see testing-practice-sessions skill for the probe snippet). Also read `performance.getEntriesByType('resource')` filtered for `/audio/` to prove prefetch without DevTools.
- Compare one word with audio and one without, so both enabled and unavailable states are shown.
- CSP: `media-src` in `next.config.ts` must allow playback (`'self'` for the local mirror, plus `blob:` for prefetched playback); watch console for "Refused to load media" violations. The dev-only React "eval() is not supported" CSP console error is preexisting noise — ignore it.
- If the branch under test receives a push while `npm run dev` is running, Fast Refresh may do a **full page reload** mid-deck: the deck resets and any injected probes are lost — re-inject and re-verify before asserting.

## Known coverage gaps (do not report as bugs)
- Many words/phrases have no free recording (multi-word phrases, clock/time expressions, month names, conjugated verbs). Generated/TTS voices were explicitly rejected by the user.
- Wikimedia rate-limits bulk URL checks (429 after a few rapid HEADs) — but with the local mirror you rarely need to hit Wikimedia at all.

## Devin Secrets Needed
None — audio is same-origin (public/audio) or public CDNs.
