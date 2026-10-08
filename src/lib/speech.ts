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

/** Speak an Arabic string. Returns false if synthesis is unavailable. */
export function speakArabic(text: string, handlers: SpeakHandlers = {}): boolean {
  const synth = getSynth();
  if (!synth || !hasArabicVoice(synth)) return false;
  synth.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.85;
  utterance.onstart = () => handlers.onStart?.();
  utterance.onend = () => handlers.onEnd?.();
  utterance.onerror = () => handlers.onError?.();
  synth.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  getSynth()?.cancel();
}
