import type { Language } from '../types';

const LANG_BCP47: Record<Language, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US'],
  hi: ['hi-IN', 'hi'],
  mr: ['mr-IN', 'hi-IN', 'mr'],
};

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeech(): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore browser speech cancellation edge cases
  }
}

export function speakText(
  text: string,
  language: Language,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): boolean {
  if (!isSpeechSupported() || !text.trim()) {
    callbacks?.onEnd?.();
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const preferredLangs = LANG_BCP47[language];
    utterance.lang = preferredLangs[0];
    utterance.rate = 0.9; // Slightly slower for senior citizen clarity
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      for (const code of preferredLangs) {
        const match = voices.find((v) => v.lang.toLowerCase().startsWith(code.toLowerCase()));
        if (match) {
          utterance.voice = match;
          utterance.lang = match.lang;
          break;
        }
      }
    }

    utterance.onstart = () => callbacks?.onStart?.();
    utterance.onend = () => callbacks?.onEnd?.();
    utterance.onerror = () => callbacks?.onError?.();

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    callbacks?.onError?.();
    return false;
  }
}
