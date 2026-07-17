---
name: testing-audio
description: Test word-pronunciation audio in Arabic AMAR (SpeakerButton, audio manifest, Wikimedia/Quran.com playback). Use when verifying speaker-button, audio-manifest, or CSP media changes.
---

# Testing pronunciation audio (Arabic AMAR)

Use when verifying `src/components/speaker-button.tsx`, `src/lib/audio.ts`, `scripts/build-audio-manifest.ts`, or `content/audio-manifest.json`.

## How the feature works
- A `<SpeakerButton>` renders next to Arabic words **only when the word is in `content/audio-manifest.json`** — otherwise it renders unavailable/null (graceful fallback, intentional).
- Clicking plays `new Audio(url)`. URL sources:
  - **Wikimedia Commons** (Lingua Libre `LL-Q13955 (ara)-…wav` or legacy `Ar-X.ogg`) for vocab words.
  - **Quran.com** (`https://verses.quran.com/Alafasy/mp3/SSSAAA.mp3`, surah/ayah zero-padded to 3 digits) for ayah recitation; ayat are pre-baked in the manifest under `quran`/`ayat` keys.
- Speaker clicks call `stopPropagation()`/`preventDefault()` — a speaker click must NEVER flip a flashcard or select an MC option. Always include this regression check.

## Verifying manifest coverage without running the site
```bash
jq '.entries.["<arabic-with-no-tashkeel>"]' content/audio-manifest.json
# null → no speaker button; {url, source} → button renders and plays that URL
```
Manifest keys are diacritic-stripped NFC Arabic (`جبين` not `جَبِينٌ`). The build script also folds hamza variants (أ/إ/ٱ→ا etc.) when matching Commons filenames.

## Testing playback
- DevTools → Network → filter **media** (not "audio"), or intercept `window.Audio`/`play()` and log to an on-screen overlay so evidence shows in recordings (see testing-practice-sessions skill for the probe snippet).
- Compare one word with audio and one without, so both enabled and unavailable states are shown.
- CSP: `media-src 'self' https://upload.wikimedia.org` in `next.config.ts` must allow playback; watch console for "Refused to load media" violations.

## Known coverage gaps (do not report as bugs)
- Many words/phrases have no free recording (missing list in the manifest; `missing-audio` count in content QA). Multi-word phrases, clock/time expressions, month names, and conjugated verb forms are mostly uncovered — Commons has individual words, not phrases. Generated/TTS voices were explicitly rejected by the user.
- Wikimedia rate-limits bulk URL checks (429 after a few rapid HEADs) — verify 2-3 URLs slowly or rely on in-app playback.

## Devin Secrets Needed
None — audio comes from public CDNs.
