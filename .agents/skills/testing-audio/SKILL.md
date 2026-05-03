# Testing the pronunciation audio feature

Use this when verifying anything in `src/components/speaker-button.tsx`,
`scripts/build-audio-manifest.ts`, or `content/audio-manifest.json`.

## What the feature does

- A `<SpeakerButton>` next to every Arabic word renders **only when the word
  is in `content/audio-manifest.json`** — otherwise the component returns
  `null` (graceful fallback). This is intentional; an empty icon would
  imply audio that isn't there.
- Clicking plays a `new Audio(url)` instance. URLs come from two sources:
  - **Wikimedia Commons** (Lingua Libre `LL-Q13955 (ara)-…wav` or legacy
    `Ar-X.ogg`) for individual vocab words.
  - **Quran.com** (`https://verses.quran.com/Alafasy/mp3/SSSAAA.mp3` —
    surah and ayah zero-padded to 3 digits) for the
    `/grammar/pronouns` example reveal.
- All clicks pass `e.stopPropagation()` and `e.preventDefault()` so a click
  on the speaker NEVER toggles a parent flip / reveal / multiple-choice button.

## Authoritative test plan

Keep `test-plan-audio.md` in the repo root as the source of truth for the
four adversarial test cases. Pattern: a positive playback path, a graceful
fallback path, a Quran.com path, and a stopPropagation regression path.

## How to test (Chromium, dev server)

```bash
npm run dev   # serves on localhost:3210
```

Open DevTools → Network → filter `media` (NOT `audio`, the filter is
`media`). Reload the page. **Pre-condition: 0 media requests after page
load.** This catches autoplay regressions.

Then click a speaker. You should see exactly one new request — click it and
check the Headers tab:

- **Hostname**: `upload.wikimedia.org` for vocab; `verses.quran.com` for ayah.
- **Status**: 200 first time, 206 from cache thereafter (range request — normal).
- **Access-Control-Allow-Origin: \***. Without this the browser blocks playback.
- **Content-Type**: `application/ogg` for Wikimedia .ogg (NOT `audio/*` —
  Wikimedia historically uses the legacy `application/ogg` MIME), `audio/mpeg`
  for Quran.com .mp3. Both play fine in `<audio>`.

## Known gotchas

- **Audio MIME on Wikimedia**: `.ogg` files are served as `application/ogg`,
  not `audio/ogg`. Don't fail a test on the MIME prefix — the browser plays
  it regardless. If you ever need a strict check, allow both prefixes.
- **Status 206 from disk cache** is what you'll see most of the time during
  testing because Chromium aggressively caches media. To force a fresh 200,
  hard-reload (Ctrl+Shift+R) or click "Disable cache" in the Network panel.
- **Orphaned Audio listener bug** (fixed in 38f27a0): when a user rapidly
  re-clicks a speaker, the previous `Audio` object's async `pause` event
  fires AFTER `play()` has been called on the new one, and would reset state
  back to `idle`. The fix uses an `isCurrent()` closure that compares
  `audioRef.current === audio` before any `setState`. If you change the
  state machine in `speaker-button.tsx`, re-test rapid-replay manually.
- **Coverage holes are by design**: 108 / 347 single-word entries have no
  Commons recording. They go in the manifest's `missing[]` array and the
  component renders no icon. Don't "fix" this by adding TTS — the user
  explicitly opted against generated voices. Lingua Libre adds new
  recordings over time; the daily content-refresh GitHub Action will pick
  them up.
- **Multi-word phrases** (greetings, country+nationality, full o'clock
  expressions) are deliberately not covered — Commons has individual words,
  not phrases. Concatenating per-word audio at runtime is a much bigger
  lift and out of scope.

## How to verify a specific word has audio without running the site

```bash
jq '.entries.["<arabic-with-no-tashkeel>"]' content/audio-manifest.json
# null  →  speaker icon will NOT render (graceful fallback)
# {url, source}  →  speaker icon will render and play that URL
```

The manifest key is the Arabic with diacritics stripped (NFC), so use the
bare consonant skeleton: `جبين` not `جَبِينٌ`.

## How to verify Quran ayah coverage

```bash
jq '.ayat' content/audio-manifest.json   # 14 entries keyed "surah:verse"
```

These are pre-baked because the format is `Alafasy/mp3/SSSAAA.mp3` and we
know which ayat the pronoun page references.

## When to record

Always. Audio testing is GUI-driven (you click a button, see network +
icon state change) and the network panel evidence reads much better in a
recording than in a text report. Use `annotate_recording` to mark each
test's start and the assertion result.

Maximize the browser before recording: `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`

## Devin secrets needed

None for testing. Audio is fetched from public CDNs.
