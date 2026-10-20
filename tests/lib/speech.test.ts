import { afterEach, describe, expect, test, vi } from "vitest";

import {
  hasArabicVoice,
  speakArabic,
  stopSpeaking,
  subscribeArabicVoice,
} from "@/lib/speech";

class FakeUtterance {
  text: string;
  lang = "";
  rate = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function installWindow(voices: Array<{ lang: string }>) {
  const spoken: FakeUtterance[] = [];
  const listeners = new Set<() => void>();
  const synth = {
    getVoices: () => voices,
    speak: (u: FakeUtterance) => spoken.push(u),
    cancel: vi.fn(),
    addEventListener: (_: string, l: () => void) => listeners.add(l),
    removeEventListener: (_: string, l: () => void) => listeners.delete(l),
  };
  vi.stubGlobal("window", {
    speechSynthesis: synth,
    SpeechSynthesisUtterance: FakeUtterance,
  });
  return { spoken, listeners, synth };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("speech fallback", () => {
  test("is unavailable without a window", () => {
    expect(hasArabicVoice()).toBe(false);
    expect(speakArabic("كتاب")).toBeNull();
  });

  test("refuses to speak when no Arabic voice is installed", () => {
    const { spoken } = installWindow([{ lang: "en-GB" }, { lang: "fr-FR" }]);
    expect(hasArabicVoice()).toBe(false);
    expect(speakArabic("كتاب")).toBeNull();
    expect(spoken).toHaveLength(0);
  });

  test("speaks with an Arabic voice and wires handlers", () => {
    const { spoken, synth } = installWindow([{ lang: "ar_SA" }]);
    const onStart = vi.fn();
    const onEnd = vi.fn();
    expect(speakArabic("كتاب", { onStart, onEnd })).not.toBeNull();
    expect(synth.cancel).toHaveBeenCalled();
    expect(spoken).toHaveLength(1);
    expect(spoken[0].lang).toBe("ar-SA");
    expect(spoken[0].rate).toBeLessThan(1);
    spoken[0].onstart?.();
    spoken[0].onend?.();
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  test("subscribe reports immediately and on voiceschanged", () => {
    const voices: Array<{ lang: string }> = [];
    const { listeners } = installWindow(voices);
    const onChange = vi.fn();
    const unsubscribe = subscribeArabicVoice(onChange);
    expect(onChange).toHaveBeenLastCalledWith(false);
    voices.push({ lang: "ar-EG" });
    for (const l of listeners) l();
    expect(onChange).toHaveBeenLastCalledWith(true);
    unsubscribe();
    expect(listeners.size).toBe(0);
  });

  test("a newer utterance supersedes the older owner, which cannot stop it", () => {
    const { spoken, synth } = installWindow([{ lang: "ar-SA" }]);
    const firstEnd = vi.fn();
    const secondEnd = vi.fn();
    const first = speakArabic("كتاب", { onEnd: firstEnd });
    const second = speakArabic("قلم", { onEnd: secondEnd });
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(firstEnd).toHaveBeenCalledTimes(1);
    const cancels = synth.cancel.mock.calls.length;
    stopSpeaking(first!);
    expect(synth.cancel.mock.calls.length).toBe(cancels);
    spoken[0].onend?.();
    expect(secondEnd).not.toHaveBeenCalled();
    spoken[1].onend?.();
    expect(secondEnd).toHaveBeenCalledTimes(1);
    expect(firstEnd).toHaveBeenCalledTimes(1);
  });
});
