import { useEffect, useState } from 'react';
import { Square, Volume2 } from 'lucide-react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { speakText, stopSpeech } from '../utils/speech';

interface SpeakButtonProps {
  text: string;
  language: Language;
  label?: string;
  variant?: 'default' | 'primary' | 'subtle';
  className?: string;
}

export function SpeakButton({
  text,
  language,
  label,
  variant = 'default',
  className = '',
}: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    return () => {
      if (speaking) stopSpeech();
    };
  }, [speaking]);

  const handleToggle = () => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
      return;
    }

    const started = speakText(text, language, {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });

    if (started) {
      setSpeaking(true);
    }
  };

  const styles = {
    default: speaking
      ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
      : 'bg-[#F7F8F5] text-[#1A3C2B] border-[#D5DDD3] hover:bg-[#ECF1EC]',
    primary: speaking
      ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
      : 'bg-[#1A3C2B] text-white border-[#1A3C2B] hover:bg-[#285940]',
    subtle: speaking
      ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
      : 'bg-white text-[#1A3C2B] border-[#E2E7E1] hover:bg-[#F7F8F5]',
  }[variant];

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={speaking}
      className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${styles} ${className}`}
    >
      {speaking ? (
        <>
          <Square className="w-4 h-4 fill-current shrink-0" aria-hidden="true" />
          <span>{t.stopListening}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{label || t.listen}</span>
        </>
      )}
    </button>
  );
}
