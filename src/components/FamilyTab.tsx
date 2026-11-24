import { useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  HeartHandshake,
  Lock,
  Send,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Unlock,
} from 'lucide-react';
import type {
  CaregiverSettings,
  Language,
  ScanActivityItem,
} from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FamilyTabProps {
  language: Language;
  isCaregiverMode: boolean;
  onSetCaregiverMode: (unlocked: boolean) => void;
  readinessScore: number;
  completedSimCount: number;
  totalSims: number;
  completedGuideCount: number;
  totalGuides: number;
  activityLog: ScanActivityItem[];
  settings: CaregiverSettings;
  onToggleSetting: (key: keyof CaregiverSettings) => void;
  onSendNudge: (message: string, suggestedSimId?: 'call' | 'whatsapp' | 'upi') => void;
}

export function FamilyTab({
  language,
  isCaregiverMode,
  onSetCaregiverMode,
  readinessScore,
  completedSimCount,
  totalSims,
  completedGuideCount,
  totalGuides,
  activityLog,
  settings,
  onToggleSetting,
  onSendNudge,
}: FamilyTabProps) {
  const t = TRANSLATIONS[language];
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [nudgeText, setNudgeText] = useState('');
  const [suggestedSim, setSuggestedSim] = useState<'call' | 'whatsapp' | 'upi'>('upi');
  const [nudgeSent, setNudgeSent] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1234') {
      setPinError('');
      setPinInput('');
      onSetCaregiverMode(true);
    } else {
      setPinError(t.family.wrongPin);
    }
  };

  const handleSendNudgeClick = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultNote =
      language === 'hi'
        ? 'बहुत बढ़िया! आज 1 मिनट का UPI सुरक्षित अभ्यास जरूर करें।'
        : language === 'mr'
          ? 'छान! आज 1 मिनिटाचा सुरक्षित UPI सराव नक्की करून पहा.'
          : 'Great job staying alert today! Try this quick 1-minute practice when you have tea.';
    onSendNudge(nudgeText.trim() || defaultNote, suggestedSim);
    setNudgeText('');
    setNudgeSent(true);
    window.setTimeout(() => setNudgeSent(false), 3500);
  };

  // SVG ring math
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (readinessScore / 100) * circumference;

  return (
    <div className="space-y-5 pb-6">
      {/* Header + Mode Status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">{t.family.title}</h1>
          <p className="mt-1 text-base text-[#4B5563] leading-relaxed">{t.family.subtitle}</p>
        </div>
      </div>

      {/* Caregiver Unlock / Lock Control Card */}
      <section className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCaregiverMode
                  ? 'bg-[#DCFCE7] text-[#15803D]'
                  : 'bg-[#EEF5F0] text-[#1A3C2B]'
              }`}
            >
              {isCaregiverMode ? (
                <Unlock className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Lock className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <div className="text-sm font-bold text-[#111827]">
                {isCaregiverMode ? t.family.caregiverUnlocked : t.family.title}
              </div>
              <div className="text-xs text-[#4B5563]">
                {isCaregiverMode
                  ? t.alerts.familyContactName
                  : t.family.pinHint}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSetCaregiverMode(!isCaregiverMode)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
              isCaregiverMode
                ? 'bg-white border-2 border-[#1A3C2B] text-[#1A3C2B] hover:bg-[#EEF5F0]'
                : 'bg-[#1A3C2B] hover:bg-[#285940] text-white'
            }`}
          >
            {isCaregiverMode ? t.family.lockCaregiver : t.family.switchToCaregiver}
          </button>
        </div>

        {!isCaregiverMode && (
          <div className="pt-3 border-t border-[#EDF1EC] space-y-3">
            <p className="text-sm text-[#4B5563] leading-relaxed">{t.family.seniorViewNotice}</p>
            <form onSubmit={handlePinSubmit} className="flex items-center gap-2.5">
              <label htmlFor="caregiver-pin-input" className="sr-only">
                {t.family.pinPrompt}
              </label>
              <input
                id="caregiver-pin-input"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="PIN: 1234"
                className="flex-1 min-h-[50px] rounded-xl border border-[#CBD4C9] bg-[#F7F8F5] px-4 py-2.5 text-base font-mono tracking-widest text-[#111827]"
              />
              <button
                type="submit"
                className="min-h-[50px] px-5 py-2.5 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] text-white font-bold text-sm whitespace-nowrap cursor-pointer"
              >
                {t.family.unlockBtn}
              </button>
            </form>
            {pinError && (
              <p role="alert" className="text-xs font-semibold text-[#B91C1C]">
                {pinError}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Caregiver Dashboard Content (Visible when unlocked) */}
      {isCaregiverMode && (
        <>
          {/* 1. Digital Safety Readiness Score Ring */}
          <section className="bg-white border border-[#E2E7E1] rounded-2xl p-5">
            <div className="flex items-center gap-5">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 104 104" className="w-full h-full -rotate-90">
                  <circle
                    cx="52"
                    cy="52"
                    r={radius}
                    fill="none"
                    stroke="#E5EBE4"
                    strokeWidth="10"
                  />
                  <circle
                    cx="52"
                    cy="52"
                    r={radius}
                    fill="none"
                    stroke="#1A3C2B"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#1A3C2B] tabular-nums">
                    {readinessScore}%
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <h2 className="text-base font-bold text-[#111827] leading-snug">
                  {t.family.readinessTitle}
                </h2>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {t.family.readinessSubtitle}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="rounded-xl bg-[#F7F8F5] border border-[#E2E7E1] px-3 py-2">
                    <div className="text-xs text-[#4B5563]">{t.family.simsCompleted}</div>
                    <div className="text-base font-extrabold text-[#1A3C2B] tabular-nums">
                      {completedSimCount}/{totalSims}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F7F8F5] border border-[#E2E7E1] px-3 py-2">
                    <div className="text-xs text-[#4B5563]">{t.family.guidesCompleted}</div>
                    <div className="text-base font-extrabold text-[#1A3C2B] tabular-nums">
                      {completedGuideCount}/{totalGuides}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Recent Scanner Activity Log (Synced live with Scan Tab) */}
          <section className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#111827]">
                {t.family.recentActivityTitle}
              </h2>
              <span className="text-xs font-semibold text-[#4B5563] tabular-nums">
                {activityLog.length} total
              </span>
            </div>

            {activityLog.length === 0 ? (
              <p className="text-sm text-[#4B5563] py-3">{t.family.recentActivityEmpty}</p>
            ) : (
              <div className="divide-y divide-[#EDF1EC]">
                {activityLog.map((item) => {
                  const style =
                    item.verdict === 'SCAM'
                      ? { text: 'text-[#B91C1C]', bg: 'bg-[#FEE2E2]', Icon: ShieldAlert }
                      : item.verdict === 'CAUTION'
                        ? { text: 'text-[#B45309]', bg: 'bg-[#FEF3C7]', Icon: AlertTriangle }
                        : { text: 'text-[#15803D]', bg: 'bg-[#DCFCE7]', Icon: ShieldCheck };

                  return (
                    <div key={item.id} className="py-3.5 first:pt-1 last:pb-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold ${style.bg} ${style.text}`}
                          >
                            <style.Icon className="w-3.5 h-3.5" aria-hidden="true" />
                            {item.verdict} ({item.riskScore}%)
                          </span>
                          <span className="text-[#4B5563]">{item.timestamp}</span>
                        </div>
                        {item.notifiedCaregiver && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1A3C2B]">
                            <BellRing className="w-3.5 h-3.5" aria-hidden="true" />
                            {t.family.caregiverAlertedBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-[#111827]">{item.scamCategory}</div>
                      <p className="text-xs text-[#4B5563] leading-relaxed break-words">
                        “{item.preview}”
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. Safety Guardrails & Alert Preferences */}
          <section className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-3.5">
            <h2 className="text-base font-bold text-[#111827]">{t.family.guardrailsTitle}</h2>
            <div className="divide-y divide-[#EDF1EC]">
              {(
                [
                  {
                    key: 'instantHighRiskAlert',
                    title: t.family.guardrailInstant,
                    desc: t.family.guardrailInstantDesc,
                  },
                  {
                    key: 'weeklyLearningSummary',
                    title: t.family.guardrailWeekly,
                    desc: t.family.guardrailWeeklyDesc,
                  },
                  {
                    key: 'autoWarnUnknownLinks',
                    title: t.family.guardrailLinks,
                    desc: t.family.guardrailLinksDesc,
                  },
                  {
                    key: 'strictCallMode',
                    title: t.family.guardrailCalls,
                    desc: t.family.guardrailCallsDesc,
                  },
                ] as { key: keyof CaregiverSettings; title: string; desc: string }[]
              ).map((item) => {
                const enabled = settings[item.key];
                return (
                  <div
                    key={item.key}
                    className="py-3.5 first:pt-1 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#111827] leading-snug">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      aria-label={item.title}
                      onClick={() => onToggleSetting(item.key)}
                      className={`relative w-14 h-8 rounded-full transition-colors shrink-0 cursor-pointer ${
                        enabled ? 'bg-[#1A3C2B]' : 'bg-[#CBD4C9]'
                      }`}
                    >
                      <span
                        className={`block w-6 h-6 rounded-full bg-white shadow-xs transition-transform ${
                          enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Send Encouraging Nudge / Quick Practice Assignment */}
          <section className="bg-[#EEF5F0] border border-[#C6DBC9] rounded-2xl p-5 space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A3C2B] text-white flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111827]">{t.family.nudgeTitle}</h2>
                <p className="text-xs text-[#374151] mt-0.5 leading-relaxed">
                  {t.family.nudgeSubtitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleSendNudgeClick} className="space-y-3">
              <label htmlFor="caregiver-nudge-input" className="sr-only">
                {t.family.nudgeTitle}
              </label>
              <textarea
                id="caregiver-nudge-input"
                rows={2}
                value={nudgeText}
                onChange={(e) => setNudgeText(e.target.value)}
                placeholder={t.family.nudgePlaceholder}
                className="w-full rounded-xl border border-[#BFCBBC] bg-white px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#6B7280]"
              />

              <div className="space-y-1.5">
                <label
                  htmlFor="nudge-practice-select"
                  className="block text-xs font-bold text-[#1A3C2B]"
                >
                  {t.family.nudgeAssignLabel}
                </label>
                <select
                  id="nudge-practice-select"
                  value={suggestedSim}
                  onChange={(e) => setSuggestedSim(e.target.value as 'call' | 'whatsapp' | 'upi')}
                  className="w-full min-h-[48px] rounded-xl border border-[#BFCBBC] bg-white px-3.5 py-2 text-sm font-semibold text-[#111827] cursor-pointer"
                >
                  <option value="upi">{t.practice.sim3Title}</option>
                  <option value="call">{t.practice.sim1Title}</option>
                  <option value="whatsapp">{t.practice.sim2Title}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full min-h-[52px] px-4 py-3 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>{t.family.nudgeSendBtn}</span>
              </button>

              {nudgeSent && (
                <div
                  role="status"
                  className="rounded-xl bg-[#DCFCE7] border border-[#86EFAC] px-3.5 py-2.5 text-xs font-bold text-[#15803D] flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.family.nudgeSentToast}</span>
                </div>
              )}
            </form>
          </section>
        </>
      )}
    </div>
  );
}
