import {
  AlertTriangle,
  ArrowRight,
  Image as ImageIcon,
  Link2,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import type { CaregiverNudge, Language, ScanMode, TabId } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { DAILY_SAFETY_TIPS, LOCAL_SCAM_ALERTS } from '../data/content';
import { SpeakButton } from './SpeakButton';

interface HomeTabProps {
  language: Language;
  onQuickScan: (mode: ScanMode) => void;
  onNavigateTab: (tab: TabId) => void;
  onStartSuggestedSim: (simId: 'call' | 'whatsapp' | 'upi') => void;
  activeNudge: CaregiverNudge | null;
  onDismissNudge: () => void;
  readinessScore: number;
}

export function HomeTab({
  language,
  onQuickScan,
  onNavigateTab,
  onStartSuggestedSim,
  activeNudge,
  onDismissNudge,
  readinessScore,
}: HomeTabProps) {
  const t = TRANSLATIONS[language];
  const dailyTip = DAILY_SAFETY_TIPS[language][0];
  const nagpurAlerts = LOCAL_SCAM_ALERTS.filter((a) => a.city === 'Nagpur, Maharashtra').slice(0, 2);

  return (
    <div className="space-y-5 pb-6">
      {/* 1. Warm Greeting & Live Protection Status Card */}
      <section className="bg-white border border-[#E2E7E1] rounded-2xl p-5 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">{t.home.greeting}</h1>
          <div className="shrink-0 flex flex-col items-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#DCFCE7] text-[#15803D] text-xs font-bold whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              {t.home.protectionActive}
            </span>
            <span className="mt-1 text-xs text-[#4B5563] tabular-nums">{t.home.lastChecked}</span>
          </div>
        </div>
        <p className="mt-2.5 text-base text-[#4B5563] leading-relaxed">{t.home.greetingSub}</p>

        {/* Subtle Readiness Summary row */}
        <div className="mt-4 pt-3.5 border-t border-[#EDF1EC] flex items-center justify-between gap-3">
          <div className="text-sm text-[#4B5563]">
            {t.family.readinessTitle}:{' '}
            <strong className="text-[#1A3C2B] font-bold tabular-nums">{readinessScore}%</strong>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('practice')}
            className="text-sm font-semibold text-[#1A3C2B] hover:text-[#285940] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <span>{t.tabs.practice}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Optional Caregiver Encouraging Nudge Banner (Synced live from Family Tab!) */}
      {activeNudge && !activeNudge.dismissed && (
        <section
          aria-label={t.home.caregiverNudgeLabel}
          className="bg-[#EEF5F0] border border-[#C6DBC9] rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A3C2B] text-white flex items-center justify-center shrink-0 mt-0.5">
              <HeartHandshake className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1A3C2B]">
                <span>{t.home.caregiverNudgeLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{activeNudge.senderName}</span>
              </div>
              <p className="mt-1 text-base font-medium text-[#111827] leading-snug">
                “{activeNudge.message}”
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {activeNudge.suggestedSimId && (
                  <button
                    type="button"
                    onClick={() => onStartSuggestedSim(activeNudge.suggestedSimId!)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {t.home.tryNow}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onDismissNudge}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#C6DBC9] text-[#1A3C2B] text-sm font-semibold hover:bg-[#F7F8F5] transition-colors cursor-pointer"
                >
                  {t.home.dismiss}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Hero Action Card ("Is This Safe? Check Now") */}
      <section className="bg-[#1A3C2B] text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-[#C8E6D0] text-sm font-semibold">
          <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.appName} Live Shield</span>
        </div>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight leading-snug text-balance">
          {t.home.heroTitle}
        </h2>
        <p className="mt-1.5 text-base text-[#DCECE0] leading-relaxed">{t.home.heroSubtitle}</p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onQuickScan('message')}
            className="min-h-[56px] px-3.5 py-3 rounded-xl bg-white text-[#1A3C2B] hover:bg-[#F1F5F0] font-semibold text-sm flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <MessageSquareText className="w-5 h-5 shrink-0 text-[#1A3C2B]" aria-hidden="true" />
            <span className="leading-tight">{t.home.quickMessage}</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickScan('link')}
            className="min-h-[56px] px-3.5 py-3 rounded-xl bg-white text-[#1A3C2B] hover:bg-[#F1F5F0] font-semibold text-sm flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <Link2 className="w-5 h-5 shrink-0 text-[#1A3C2B]" aria-hidden="true" />
            <span className="leading-tight">{t.home.quickLink}</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickScan('screenshot')}
            className="min-h-[56px] px-3.5 py-3 rounded-xl bg-white text-[#1A3C2B] hover:bg-[#F1F5F0] font-semibold text-sm flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <ImageIcon className="w-5 h-5 shrink-0 text-[#1A3C2B]" aria-hidden="true" />
            <span className="leading-tight">{t.home.quickScreenshot}</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickScan('call')}
            className="min-h-[56px] px-3.5 py-3 rounded-xl bg-white text-[#1A3C2B] hover:bg-[#F1F5F0] font-semibold text-sm flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 shrink-0 text-[#1A3C2B]" aria-hidden="true" />
            <span className="leading-tight">{t.home.quickCall}</span>
          </button>
        </div>
      </section>

      {/* 3. Local Scam Radar Preview (Nagpur, Maharashtra) */}
      <section className="bg-white border border-[#E2E7E1] rounded-2xl p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">{t.home.radarHeading}</h2>
            <p className="text-sm text-[#4B5563]">{t.home.radarLocation}</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('alerts')}
            className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-[#1A3C2B] hover:bg-[#F2F5F0] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <span>{t.home.viewAllAlerts}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-[#EDF1EC]">
          {nagpurAlerts.map((alert) => (
            <div key={alert.id} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2 text-xs font-medium text-[#4B5563]">
                <span className="font-bold text-[#B91C1C]">{t.alerts.severityHigh}</span>
                <span aria-hidden="true">·</span>
                <span>{alert.scamType[language]}</span>
                <span aria-hidden="true">·</span>
                <span>{alert.dateLabel[language]}</span>
              </div>
              <h3 className="mt-1 text-base font-bold text-[#111827] leading-snug">
                {alert.title[language]}
              </h3>
              <p className="mt-1 text-sm text-[#4B5563] leading-relaxed">
                {alert.summary[language]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Daily 1-Minute Safety Tip Card */}
      <section className="bg-white border border-[#E2E7E1] rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1A3C2B]">
            <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.home.dailyTipHeading}</span>
          </div>
          <SpeakButton
            text={`${dailyTip.title}. ${dailyTip.body}`}
            language={language}
          />
        </div>
        <h3 className="mt-2.5 text-lg font-bold text-[#111827] leading-snug">{dailyTip.title}</h3>
        <p className="mt-1.5 text-base text-[#4B5563] leading-relaxed">{dailyTip.body}</p>
      </section>

      {/* 5. Quick Emergency Strip */}
      <section className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[#991B1B]">{t.home.emergencyTitle}</h2>
            <p className="mt-1 text-sm text-[#7F1D1D] leading-relaxed">{t.home.emergencyDesc}</p>
            <div className="mt-3.5 flex flex-wrap gap-2.5">
              <a
                href="tel:1930"
                className="min-h-[52px] px-5 py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-base inline-flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{t.home.call1930}</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigateTab('alerts')}
                className="min-h-[52px] px-4 py-3 rounded-xl bg-white border border-[#FCA5A5] text-[#991B1B] font-semibold text-sm hover:bg-[#FEE2E2] transition-colors cursor-pointer"
              >
                {t.alerts.helplineTitle.split('&')[0].trim()}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
