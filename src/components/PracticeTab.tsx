import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  IndianRupee,
  MessageSquareWarning,
  PhoneIncoming,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type { Language, LearningGuide } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { LEARNING_GUIDES } from '../data/content';
import { GuideArtwork } from './GuideArtwork';
import { SpeakButton } from './SpeakButton';
import {
  IncomingCallSimulator,
  UpiSandboxSimulator,
  WhatsAppInspectorSimulator,
} from './Simulations';

interface PracticeTabProps {
  language: Language;
  completedSimIds: string[];
  completedGuideIds: string[];
  safetyPoints: number;
  initialSimId?: 'call' | 'whatsapp' | 'upi' | null;
  onClearInitialSim?: () => void;
  onCompleteSim: (simId: 'call' | 'whatsapp' | 'upi', points: number) => void;
  onCompleteGuide: (guideId: string) => void;
}

export function PracticeTab({
  language,
  completedSimIds,
  completedGuideIds,
  safetyPoints,
  initialSimId,
  onClearInitialSim,
  onCompleteSim,
  onCompleteGuide,
}: PracticeTabProps) {
  const t = TRANSLATIONS[language];
  const [segment, setSegment] = useState<'simulations' | 'guides'>('simulations');
  const [activeSim, setActiveSim] = useState<'call' | 'whatsapp' | 'upi' | null>(null);
  const [activeGuide, setActiveGuide] = useState<LearningGuide | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  useEffect(() => {
    if (initialSimId) {
      setSegment('simulations');
      setActiveGuide(null);
      setActiveSim(initialSimId);
      onClearInitialSim?.();
    }
  }, [initialSimId, onClearInitialSim]);

  if (activeSim === 'call') {
    return (
      <IncomingCallSimulator
        language={language}
        onComplete={onCompleteSim}
        onBack={() => setActiveSim(null)}
      />
    );
  }
  if (activeSim === 'whatsapp') {
    return (
      <WhatsAppInspectorSimulator
        language={language}
        onComplete={onCompleteSim}
        onBack={() => setActiveSim(null)}
      />
    );
  }
  if (activeSim === 'upi') {
    return (
      <UpiSandboxSimulator
        language={language}
        onComplete={onCompleteSim}
        onBack={() => setActiveSim(null)}
      />
    );
  }

  /* ============================================================
     OPEN AUDIO-VISUAL GUIDE CAROUSEL + QUICK CHECK
     ============================================================ */
  if (activeGuide) {
    const currentSlide = activeGuide.slides[slideIdx];
    const isLastSlide = slideIdx === activeGuide.slides.length - 1;
    const chosenOption = activeGuide.quizOptions.find((o) => o.id === selectedQuizOption);

    const handleSelectQuiz = (optionId: string, isCorrect: boolean) => {
      setSelectedQuizOption(optionId);
      if (isCorrect) {
        onCompleteGuide(activeGuide.id);
      }
    };

    return (
      <div className="space-y-4 pb-6">
        <button
          type="button"
          onClick={() => {
            setActiveGuide(null);
            setSlideIdx(0);
            setShowQuiz(false);
            setSelectedQuizOption(null);
          }}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#1A3C2B] hover:text-[#285940] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t.practice.backToList}</span>
        </button>

        <div className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#4B5563]">
                {activeGuide.durationLabel[language]}
              </span>
              <h2 className="text-xl font-bold text-[#111827] leading-snug">
                {activeGuide.title[language]}
              </h2>
            </div>
            {completedGuideIds.includes(activeGuide.id) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D] text-xs font-bold shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                {t.practice.completed}
              </span>
            )}
          </div>

          <GuideArtwork
            artworkKey={activeGuide.artworkKey}
            imageSrc={activeGuide.imageSrc}
            alt={activeGuide.title[language]}
          />

          {!showQuiz ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1A3C2B] tabular-nums">
                  Step {slideIdx + 1} / {activeGuide.slides.length}
                </span>
                <SpeakButton
                  text={`${currentSlide.heading[language]}. ${currentSlide.body[language]}. ${t.practice.doLabel}: ${currentSlide.doText[language]}. ${t.practice.dontLabel}: ${currentSlide.dontText[language]}`}
                  language={language}
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#111827] leading-snug">
                  {currentSlide.heading[language]}
                </h3>
                <p className="mt-1.5 text-base text-[#374151] leading-relaxed">
                  {currentSlide.body[language]}
                </p>
              </div>

              {/* Do vs Don't Cards */}
              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-xl bg-[#DCFCE7]/70 border border-[#86EFAC] p-3.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#15803D]">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>{t.practice.doLabel}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#14532D] leading-relaxed">
                    {currentSlide.doText[language]}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FEE2E2]/70 border border-[#FCA5A5] p-3.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#B91C1C]">
                    <XCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{t.practice.dontLabel}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#7F1D1D] leading-relaxed">
                    {currentSlide.dontText[language]}
                  </p>
                </div>
              </div>

              {/* Carousel Navigation */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {slideIdx > 0 ? (
                  <button
                    type="button"
                    onClick={() => setSlideIdx((i) => i - 1)}
                    className="min-h-[52px] px-4 py-2.5 rounded-xl border border-[#D5DDD3] bg-[#F7F8F5] text-[#111827] font-semibold text-sm cursor-pointer"
                  >
                    {t.practice.prevSlide}
                  </button>
                ) : (
                  <span />
                )}

                {!isLastSlide ? (
                  <button
                    type="button"
                    onClick={() => setSlideIdx((i) => i + 1)}
                    className="min-h-[52px] px-5 py-2.5 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{t.practice.nextSlide}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowQuiz(true)}
                    className="min-h-[52px] px-5 py-2.5 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{t.practice.takeQuickCheck}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* 1-Question Quick Check */
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#1A3C2B]">
                  {t.practice.quickCheckTitle}
                </span>
                <SpeakButton text={activeGuide.quizQuestion[language]} language={language} />
              </div>

              <h3 className="text-base font-bold text-[#111827] leading-snug">
                {activeGuide.quizQuestion[language]}
              </h3>

              <div className="space-y-2.5">
                {activeGuide.quizOptions.map((opt) => {
                  const isSelected = selectedQuizOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectQuiz(opt.id, opt.isCorrect)}
                      className={`w-full min-h-[54px] px-4 py-3 rounded-xl border text-left text-sm font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-[#DCFCE7] border-[#15803D] text-[#14532D]'
                            : 'bg-[#FEE2E2] border-[#B91C1C] text-[#7F1D1D]'
                          : 'bg-[#F7F8F5] border-[#D5DDD3] text-[#111827] hover:bg-[#EEF5F0]'
                      }`}
                    >
                      {opt.label[language]}
                    </button>
                  );
                })}
              </div>

              {chosenOption && (
                <div
                  className={`rounded-xl p-4 border space-y-2 ${
                    chosenOption.isCorrect
                      ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#14532D]'
                      : 'bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]'
                  }`}
                >
                  <p className="text-sm font-semibold leading-relaxed">
                    {chosenOption.feedback[language]}
                  </p>
                  {chosenOption.isCorrect && (
                    <div className="pt-1 space-y-2">
                      <p className="text-xs font-bold text-[#15803D]">
                        {t.practice.moduleCompletedMsg}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveGuide(null);
                          setSlideIdx(0);
                          setShowQuiz(false);
                          setSelectedQuizOption(null);
                        }}
                        className="min-h-[48px] px-4 py-2 rounded-xl bg-[#1A3C2B] text-white font-bold text-sm cursor-pointer"
                      >
                        {t.practice.backToList}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ============================================================
     MAIN PRACTICE HUB
     ============================================================ */
  const simCards: {
    id: 'call' | 'whatsapp' | 'upi';
    title: string;
    desc: string;
    Icon: typeof PhoneIncoming;
  }[] = [
    { id: 'call', title: t.practice.sim1Title, desc: t.practice.sim1Desc, Icon: PhoneIncoming },
    { id: 'whatsapp', title: t.practice.sim2Title, desc: t.practice.sim2Desc, Icon: MessageSquareWarning },
    { id: 'upi', title: t.practice.sim3Title, desc: t.practice.sim3Desc, Icon: IndianRupee },
  ];

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">{t.practice.title}</h1>
          <p className="mt-1 text-base text-[#4B5563] leading-relaxed">{t.practice.subtitle}</p>
        </div>
        <div className="shrink-0 bg-white border border-[#E2E7E1] rounded-xl px-3.5 py-2 text-right">
          <div className="text-xs font-semibold text-[#4B5563]">{t.practice.pointsEarned}</div>
          <div className="text-lg font-extrabold text-[#1A3C2B] tabular-nums">{safetyPoints}</div>
        </div>
      </div>

      {/* Segmented Switch */}
      <div
        role="tablist"
        aria-label="Practice section"
        className="grid grid-cols-2 gap-1.5 bg-[#ECEFE9] p-1.5 rounded-2xl"
      >
        <button
          type="button"
          role="tab"
          aria-selected={segment === 'simulations'}
          onClick={() => setSegment('simulations')}
          className={`min-h-[48px] px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            segment === 'simulations'
              ? 'bg-[#1A3C2B] text-white shadow-xs'
              : 'text-[#374151] hover:bg-white/70'
          }`}
        >
          <Gamepad2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{t.practice.tabSimulations}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={segment === 'guides'}
          onClick={() => setSegment('guides')}
          className={`min-h-[48px] px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            segment === 'guides'
              ? 'bg-[#1A3C2B] text-white shadow-xs'
              : 'text-[#374151] hover:bg-white/70'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{t.practice.tabGuides}</span>
        </button>
      </div>

      {/* A) Interactive Simulations */}
      {segment === 'simulations' && (
        <div className="space-y-3.5">
          {simCards.map(({ id, title, desc, Icon }) => {
            const done = completedSimIds.includes(id);
            return (
              <article
                key={id}
                className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-3.5"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF5F0] text-[#1A3C2B] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base font-bold text-[#111827] leading-snug">{title}</h2>
                      {done && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#15803D] shrink-0">
                          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                          {t.practice.completed}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-[#4B5563] leading-relaxed">{desc}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSim(id)}
                  className={`w-full min-h-[52px] px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    done
                      ? 'bg-[#EEF5F0] hover:bg-[#DFECE2] text-[#1A3C2B] border border-[#C6DBC9]'
                      : 'bg-[#1A3C2B] hover:bg-[#285940] text-white'
                  }`}
                >
                  <span>{done ? t.practice.replayPractice : t.practice.startPractice}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* B) Audio-Visual Guides */}
      {segment === 'guides' && (
        <div className="space-y-4">
          {LEARNING_GUIDES.map((guide) => {
            const done = completedGuideIds.includes(guide.id);
            return (
              <article
                key={guide.id}
                className="bg-white border border-[#E2E7E1] rounded-2xl overflow-hidden"
              >
                <div className="p-4 pb-0">
                  <GuideArtwork
                    artworkKey={guide.artworkKey}
                    imageSrc={guide.imageSrc}
                    alt={guide.title[language]}
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#4B5563]">
                    <span className="font-semibold">{guide.durationLabel[language]}</span>
                    {done && (
                      <span className="inline-flex items-center gap-1 text-[#15803D] font-bold">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        {t.practice.completed}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[#111827] leading-snug">
                    {guide.title[language]}
                  </h2>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {guide.subtitle[language]}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGuide(guide);
                      setSlideIdx(0);
                      setShowQuiz(false);
                      setSelectedQuizOption(null);
                    }}
                    className="w-full min-h-[52px] px-4 py-3 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>{t.practice.openGuide}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
