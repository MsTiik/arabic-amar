/**
 * Browser speech-synthesis fallback for words that have no recorded
 * pronunciation. Only offered when the browser exposes an Arabic voice, so
 * the user never hears an English voice mangling Arabic letters. Voices load
 * asynchronously in most browsers, hence the subscribe helper.
 */

export interface SpeechLike {
  getVoices(): Array<{ lang: string }>;
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
}

function getSynth(): SpeechLike | null {
  if (typeof window === "undefined") return null;
  const synth = (window as unknown as { speechSynthesis?: SpeechLike }).speechSynthesis;
  if (!synth || typeof window.SpeechSynthesisUtterance === "undefined") return null;
  return synth;
}

export function hasArabicVoice(synth: SpeechLike | null = getSynth()): boolean {
  if (!synth) return false;
  try {
    return synth.getVoices().some((voice) => /^ar\b/i.test(voice.lang.replace("_", "-")));
  } catch {
    return false;
  }
}

/** Calls `onChange(available)` now and whenever the voice list changes.
 *  Returns an unsubscribe function. */
export function subscribeArabicVoice(onChange: (available: boolean) => void): () => void {
  const synth = getSynth();
  if (!synth) {
    onChange(false);
    return () => {};
  }
  const update = () => onChange(hasArabicVoice(synth));
  update();
  synth.addEventListener?.("voiceschanged", update);
  return () => synth.removeEventListener?.("voiceschanged", update);
}

export interface SpeakHandlers {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

/** Identifies one utterance so a caller can stop only what it started. */
export type SpeechHandle = number;

let nextHandle: SpeechHandle = 1;
let active: { handle: SpeechHandle; handlers: SpeakHandlers } | null = null;

/**
 * Speak an Arabic string. Returns a handle, or null if synthesis is
 * unavailable. Synthesis is shared browser-wide, so starting a new
 * utterance supersedes the previous one: its owner receives `onEnd` and
 * any later callbacks from it are ignored.
 */
export function speakArabic(
  text: string,
  handlers: SpeakHandlers = {},
): SpeechHandle | null {
  const synth = getSynth();
  if (!synth || !hasArabicVoice(synth)) return null;
  const previous = active;
  const handle = nextHandle++;
  active = { handle, handlers };
  previous?.handlers.onEnd?.();
  synth.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.85;
  const owns = () => active?.handle === handle;
  utterance.onstart = () => {
    if (owns()) handlers.onStart?.();
  };
  utterance.onend = () => {
    if (!owns()) return;
    active = null;
    handlers.onEnd?.();
  };
  utterance.onerror = () => {
    if (!owns()) return;
    active = null;
    handlers.onError?.();
  };
  synth.speak(utterance);
  return handle;
}

/**
 * Stop speech. With a handle, only stops if that utterance is still the
 * active one, so an unmounting button never cuts off a newer utterance.
 */
export function stopSpeaking(handle?: SpeechHandle): void {
  if (handle !== undefined && active?.handle !== handle) return;
  active = null;
  getSynth()?.cancel();
}
