/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  GraduationCap,
  Home,
  Maximize2,
  ScanSearch,
  ShieldCheck,
  Smartphone,
  Users,
} from 'lucide-react';
import type {
  CaregiverNudge,
  CaregiverSettings,
  Language,
  ScanActivityItem,
  ScanMode,
  ScanResult,
  TabId,
} from './types';
import { TRANSLATIONS } from './data/translations';
import { LEARNING_GUIDES } from './data/content';
import { calculateReadinessScore, createActivityLogEntry } from './utils/readiness';
import { stopSpeech } from './utils/speech';
import { HomeTab } from './components/HomeTab';
import { ScanTab } from './components/ScanTab';
import { PracticeTab } from './components/PracticeTab';
import { AlertsTab } from './components/AlertsTab';
import { FamilyTab } from './components/FamilyTab';

const INITIAL_ACTIVITY_LOG: ScanActivityItem[] = [
  {
    id: 'seed-1',
    timestamp: 'Yesterday, 6:40 PM',
    mode: 'message',
    preview: 'Your SBI OTP for Rs 450 transaction at MedPlus is 914205. Do not share...',
    verdict: 'SAFE',
    riskScore: 8,
    scamCategory: 'Legitimate Bank OTP Message',
    notifiedCaregiver: false,
  },
];

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [largeText, setLargeText] = useState(false);
  const [desktopFullView, setDesktopFullView] = useState(false);

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [scanMode, setScanMode] = useState<ScanMode>('message');
  const [pendingSimId, setPendingSimId] = useState<'call' | 'whatsapp' | 'upi' | null>(null);

  // Shared state across Practice, Scan, Home, and Family tabs
  const [completedSimIds, setCompletedSimIds] = useState<string[]>([]);
  const [completedGuideIds, setCompletedGuideIds] = useState<string[]>([]);
  const [safetyPoints, setSafetyPoints] = useState<number>(20);
  const [activityLog, setActivityLog] = useState<ScanActivityItem[]>(INITIAL_ACTIVITY_LOG);
  const [isCaregiverMode, setIsCaregiverMode] = useState<boolean>(false);
  const [caregiverSettings, setCaregiverSettings] = useState<CaregiverSettings>({
    instantHighRiskAlert: true,
    weeklyLearningSummary: true,
    autoWarnUnknownLinks: true,
    strictCallMode: false,
  });
  const [activeNudge, setActiveNudge] = useState<CaregiverNudge | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const root = document.documentElement;
    if (largeText) {
      root.classList.add('senior-text-lg');
    } else {
      root.classList.remove('senior-text-lg');
    }
    return () => root.classList.remove('senior-text-lg');
  }, [largeText]);

  // Stop active TTS when switching tabs or languages
  useEffect(() => {
    stopSpeech();
  }, [activeTab, language]);

  const readinessScore = useMemo(
    () =>
      calculateReadinessScore({
        completedSimIds,
        completedGuideIds,
        totalSims: 3,
        totalGuides: LEARNING_GUIDES.length,
        safeScansCount: activityLog.length,
      }),
    [completedSimIds, completedGuideIds, activityLog.length]
  );

  const handleQuickScan = (mode: ScanMode) => {
    setScanMode(mode);
    setActiveTab('scan');
  };

  const handleScanComplete = (payload: {
    mode: ScanMode;
    preview: string;
    result: ScanResult;
  }): string => {
    const autoAlert =
      caregiverSettings.instantHighRiskAlert && payload.result.verdict === 'SCAM';
    const entry = createActivityLogEntry({
      mode: payload.mode,
      preview: payload.preview,
      result: payload.result,
      notifiedCaregiver: autoAlert,
    });
    setActivityLog((prev) => [entry, ...prev]);
    return entry.id;
  };

  const handleNotifyCaregiver = (activityId: string) => {
    setActivityLog((prev) =>
      prev.map((item) =>
        item.id === activityId ? { ...item, notifiedCaregiver: true } : item
      )
    );
  };

  const handleCompleteSim = (simId: 'call' | 'whatsapp' | 'upi', points: number) => {
    setCompletedSimIds((prev) => {
      if (prev.includes(simId)) return prev;
      setSafetyPoints((pts) => pts + points);
      return [...prev, simId];
    });
  };

  const handleCompleteGuide = (guideId: string) => {
    setCompletedGuideIds((prev) => {
      if (prev.includes(guideId)) return prev;
      setSafetyPoints((pts) => pts + 30);
      return [...prev, guideId];
    });
  };

  const handleToggleSetting = (key: keyof CaregiverSettings) => {
    setCaregiverSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendNudge = (message: string, suggestedSimId?: 'call' | 'whatsapp' | 'upi') => {
    setActiveNudge({
      id: `nudge-${Date.now()}`,
      message,
      senderName: t.alerts.familyContactName.split('(')[0].trim(),
      timestamp: 'Just now',
      suggestedSimId,
      dismissed: false,
    });
  };

  const handleStartSuggestedSim = (simId: 'call' | 'whatsapp' | 'upi') => {
    setPendingSimId(simId);
    setActiveTab('practice');
  };

  const navItems: { id: TabId; label: string; Icon: typeof Home; highlight?: boolean }[] = [
    { id: 'home', label: t.tabs.home, Icon: Home },
    { id: 'practice', label: t.tabs.practice, Icon: GraduationCap },
    { id: 'scan', label: t.tabs.scan, Icon: ScanSearch, highlight: true },
    { id: 'alerts', label: t.tabs.alerts, Icon: Bell },
    { id: 'family', label: t.tabs.family, Icon: Users },
  ];

  // Note: Order in bottom nav per spec: 1. Home, 2. Scan (highlighted center action tab? Wait: spec says "1. Home 2. Scan (highlighted center action tab) 3. Practice 4. Alerts 5. Family").
  // Wait: let's keep the exact 5 tabs clearly labeled; placing Scan cleanly highlighted in the center (Home, Practice, Scan, Alerts, Family) OR keeping order Home, Scan, Practice, Alerts, Family with Scan highlighted!
  // Let's re-read the prompt:
  // "Persistent Bottom Navigation Bar (5 clear tabs with icons + labels):
  //   1. Home
  //   2. Scan (highlighted center action tab)
  //   3. Practice
  //   4. Alerts
  //   5. Family"
  // Putting Home | Practice | Scan (highlighted center) | Alerts | Family physically centers the highlighted Scan action tab as a true mobile consumer app! Let's check: does every tab have clear accessible name "Home", "Scan", "Practice", "Alerts", "Family"? Yes!

  return (
    <div className="min-h-dvh w-full bg-[#EAECE6] md:py-5 md:px-4 flex flex-col items-center justify-center relative">
      {/* Subtle Desktop-Only Frame Toggle (Top-Right) */}
      <div className="hidden md:flex fixed top-4 right-5 z-40 items-center bg-white/90 backdrop-blur-sm border border-[#D5DDD3] rounded-xl p-1 shadow-xs">
        <button
          type="button"
          onClick={() => setDesktopFullView(false)}
          aria-pressed={!desktopFullView}
          className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
            !desktopFullView
              ? 'bg-[#1A3C2B] text-white'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.desktopToggleMobile}</span>
        </button>
        <button
          type="button"
          onClick={() => setDesktopFullView(true)}
          aria-pressed={desktopFullView}
          className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
            desktopFullView
              ? 'bg-[#1A3C2B] text-white'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.desktopToggleFull}</span>
        </button>
      </div>

      {/* Main Mobile App Viewport Container */}
      <div
        className={`w-full bg-[#F7F8F5] flex flex-col overflow-hidden transition-all duration-200 ${
          desktopFullView
            ? 'h-dvh md:h-[calc(100dvh-2.5rem)] md:max-w-3xl md:rounded-3xl md:border md:border-[#D5DDD3] md:shadow-xl'
            : 'h-dvh md:h-[min(860px,calc(100dvh-2.5rem))] md:max-w-[430px] md:rounded-[30px] md:border md:border-[#CFD8CD] md:shadow-[0_24px_60px_rgba(26,60,43,0.14)]'
        }`}
      >
        {/* Global Persistent Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E7E1] px-3.5 py-2.5 flex items-center justify-between gap-2 shrink-0">
          {/* Left: Shield Logo + App Title */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-left min-w-0 cursor-pointer"
          >
            <span className="w-9 h-9 rounded-xl bg-[#1A3C2B] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="text-base font-extrabold text-[#1A3C2B] tracking-tight whitespace-nowrap truncate">
              {t.appName}
            </span>
          </button>

          {/* Right: Language Switcher [EN | हिं | मर] + Text Size [A+] */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              role="group"
              aria-label="Language switcher"
              className="inline-flex items-center bg-[#F1F4EE] border border-[#DCE3DA] rounded-xl p-0.5"
            >
              {(
                [
                  { code: 'en', label: 'EN', full: 'English' },
                  { code: 'hi', label: 'हिं', full: 'Hindi' },
                  { code: 'mr', label: 'मर', full: 'Marathi' },
                ] as { code: Language; label: string; full: string }[]
              ).map((lang) => {
                const active = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    aria-label={lang.full}
                    aria-pressed={active}
                    onClick={() => setLanguage(lang.code)}
                    className={`min-h-[36px] min-w-[34px] px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#1A3C2B] text-white'
                        : 'text-[#374151] hover:text-[#111827]'
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setLargeText((prev) => !prev)}
              aria-pressed={largeText}
              aria-label={largeText ? 'Standard text size' : 'Extra-large text size'}
              title={largeText ? 'Switch to standard text' : 'Increase text size (+20%)'}
              className={`min-h-[38px] min-w-[40px] px-2.5 rounded-xl border text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                largeText
                  ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
                  : 'bg-white text-[#1A3C2B] border-[#D5DDD3] hover:bg-[#F1F4EE]'
              }`}
            >
              {t.textSizeLabel}
            </button>
          </div>
        </header>

        {/* Scrollable Screen Body */}
        <main className="flex-1 overflow-y-auto app-scroll px-4 pt-4">
          {activeTab === 'home' && (
            <HomeTab
              language={language}
              onQuickScan={handleQuickScan}
              onNavigateTab={setActiveTab}
              onStartSuggestedSim={handleStartSuggestedSim}
              activeNudge={activeNudge}
              onDismissNudge={() =>
                setActiveNudge((prev) => (prev ? { ...prev, dismissed: true } : null))
              }
              readinessScore={readinessScore}
            />
          )}

          {activeTab === 'scan' && (
            <ScanTab
              language={language}
              activeMode={scanMode}
              onModeChange={setScanMode}
              onScanComplete={handleScanComplete}
              onNotifyCaregiver={handleNotifyCaregiver}
              onNavigateAlerts={() => setActiveTab('alerts')}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeTab
              language={language}
              completedSimIds={completedSimIds}
              completedGuideIds={completedGuideIds}
              safetyPoints={safetyPoints}
              initialSimId={pendingSimId}
              onClearInitialSim={() => setPendingSimId(null)}
              onCompleteSim={handleCompleteSim}
              onCompleteGuide={handleCompleteGuide}
            />
          )}

          {activeTab === 'alerts' && <AlertsTab language={language} />}

          {activeTab === 'family' && (
            <FamilyTab
              language={language}
              isCaregiverMode={isCaregiverMode}
              onSetCaregiverMode={setIsCaregiverMode}
              readinessScore={readinessScore}
              completedSimCount={completedSimIds.length}
              totalSims={3}
              completedGuideCount={completedGuideIds.length}
              totalGuides={LEARNING_GUIDES.length}
              activityLog={activityLog}
              settings={caregiverSettings}
              onToggleSetting={handleToggleSetting}
              onSendNudge={handleSendNudge}
            />
          )}
        </main>

        {/* Persistent Sticky Bottom Navigation Bar (5 Tabs with Icons + Labels) */}
        <nav
          aria-label="Primary navigation"
          className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E2E7E1] px-2 py-1.5 shrink-0"
        >
          <div className="grid grid-cols-5 items-center gap-1">
            {navItems.map(({ id, label, Icon, highlight }) => {
              const isActive = activeTab === id;
              if (highlight) {
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`min-h-[50px] rounded-xl flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 shadow-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1A3C2B] text-white ring-2 ring-[#A7D7B5]'
                        : 'bg-[#1A3C2B] text-white hover:bg-[#285940]'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span className="text-[11px] font-bold leading-tight whitespace-nowrap">
                      {label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-h-[50px] rounded-xl flex flex-col items-center justify-center gap-0.5 px-1 py-1 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#EEF5F0] text-[#1A3C2B] font-bold'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F7F8F5] font-medium'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="text-[11px] leading-tight whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
