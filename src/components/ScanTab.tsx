import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Image as ImageIcon,
  Link2,
  Loader2,
  MessageSquareText,
  Mic,
  MicOff,
  PhoneCall,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import type { Language, ScanMode, ScanResult } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CALL_PRESETS, LINK_PRESETS, MESSAGE_PRESETS } from '../data/content';
import { analyzeLocallyFallback, inspectUrl } from '../utils/scamRules';
import { generateSampleScamScreenshotDataUrl } from '../utils/sampleScreenshot';
import { SpeakButton } from './SpeakButton';

interface ScanTabProps {
  language: Language;
  activeMode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
  onScanComplete: (payload: { mode: ScanMode; preview: string; result: ScanResult }) => string;
  onNotifyCaregiver: (activityId: string) => void;
  onNavigateAlerts: () => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function ScanTab({
  language,
  activeMode,
  onModeChange,
  onScanComplete,
  onNotifyCaregiver,
  onNavigateAlerts,
}: ScanTabProps) {
  const t = TRANSLATIONS[language];

  const [messageText, setMessageText] = useState('');
  const [linkText, setLinkText] = useState('');
  const [callText, setCallText] = useState('');
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>('');
  const [screenshotMime, setScreenshotMime] = useState<string>('image/png');
  const [screenshotLabel, setScreenshotLabel] = useState<string>('');

  const [isListeningMic, setIsListeningMic] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [latestActivityId, setLatestActivityId] = useState<string | null>(null);
  const [caregiverNotified, setCaregiverNotified] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const urlInspection = useMemo(
    () => (activeMode === 'link' && linkText.trim() ? inspectUrl(linkText) : null),
    [activeMode, linkText]
  );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleModeSwitch = (mode: ScanMode) => {
    onModeChange(mode);
    setErrorMsg('');
    setResult(null);
    setCaregiverNotified(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotMime(file.type || 'image/png');
    setScreenshotLabel(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setScreenshotDataUrl(reader.result);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSampleScreenshot = () => {
    const dataUrl = generateSampleScamScreenshotDataUrl();
    setScreenshotDataUrl(dataUrl);
    setScreenshotMime('image/png');
    setScreenshotLabel('WhatsApp_MSEDCL_Disconnection_Scam.png');
    setErrorMsg('');
  };

  const handleToggleMic = () => {
    if (isListeningMic) {
      setIsListeningMic(false);
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        rec.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
        rec.continuous = false;
        rec.interimResults = true;
        rec.onresult = (event: SpeechRecognitionEventLike) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i += 1) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setCallText(transcript.trim());
          }
        };
        rec.onerror = () => setIsListeningMic(false);
        rec.onend = () => setIsListeningMic(false);
        recognitionRef.current = rec;
        rec.start();
        setIsListeningMic(true);
        return;
      } catch {
        // Fallback to simulated listening demo below
      }
    }

    // Graceful simulated mic listening if browser lacks Web Speech Recognition
    setIsListeningMic(true);
    window.setTimeout(() => {
      setIsListeningMic(false);
      setCallText((prev) => prev || CALL_PRESETS[0].transcript);
    }, 2200);
  };

  const handleScan = async () => {
    setErrorMsg('');

    let contentToSend = '';
    let previewText = '';

    if (activeMode === 'message') {
      contentToSend = messageText.trim();
      previewText = contentToSend;
    } else if (activeMode === 'link') {
      contentToSend = linkText.trim();
      previewText = contentToSend;
    } else if (activeMode === 'call') {
      contentToSend = callText.trim();
      previewText = contentToSend;
    } else if (activeMode === 'screenshot') {
      contentToSend = screenshotLabel
        ? `Screenshot file: ${screenshotLabel}. Inspect this screenshot carefully for electricity bill, KYC, or UPI fraud.`
        : '';
      previewText = screenshotLabel || 'Uploaded Screenshot';
    }

    if (activeMode === 'screenshot' && !screenshotDataUrl) {
      setErrorMsg(t.scan.emptyInputError);
      return;
    }
    if (activeMode !== 'screenshot' && !contentToSend) {
      setErrorMsg(t.scan.emptyInputError);
      return;
    }

    setIsScanning(true);
    setResult(null);
    setCaregiverNotified(false);
    setPipelineStep(0);

    // Run 2-second 4-step AI Verification Pipeline in parallel with real API call
    const pipelineTimer = new Promise<void>((resolve) => {
      window.setTimeout(() => setPipelineStep(1), 500);
      window.setTimeout(() => setPipelineStep(2), 1050);
      window.setTimeout(() => setPipelineStep(3), 1600);
      window.setTimeout(() => resolve(), 2100);
    });

    const apiCall = (async (): Promise<ScanResult> => {
      try {
        const res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: activeMode,
            content: contentToSend,
            imageBase64: activeMode === 'screenshot' ? screenshotDataUrl : undefined,
            imageMimeType: activeMode === 'screenshot' ? screenshotMime : undefined,
            language,
          }),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data?.result) {
          return data.result as ScanResult;
        }
        throw new Error('Malformed API payload');
      } catch {
        return {
          ...analyzeLocallyFallback({
            mode: activeMode,
            content: contentToSend,
            hasImage: activeMode === 'screenshot' && Boolean(screenshotDataUrl),
            language,
          }),
          engine: 'local',
          engineNote: 'Verified locally with Suraksha Sathi safety rules.',
        };
      }
    })();

    const [scanResult] = await Promise.all([apiCall, pipelineTimer]);
    setIsScanning(false);
    setResult(scanResult);

    const newId = onScanComplete({
      mode: activeMode,
      preview: previewText,
      result: scanResult,
    });
    setLatestActivityId(newId);
  };

  const handleNotifyFamilyClick = () => {
    if (latestActivityId && !caregiverNotified) {
      onNotifyCaregiver(latestActivityId);
      setCaregiverNotified(true);
    }
  };

  const verdictStyle = result
    ? {
        SAFE: {
          bg: 'bg-[#DCFCE7]',
          border: 'border-[#86EFAC]',
          text: 'text-[#15803D]',
          bar: 'bg-[#15803D]',
          label: t.scan.verdictSafe,
          Icon: ShieldCheck,
        },
        CAUTION: {
          bg: 'bg-[#FEF3C7]',
          border: 'border-[#FCD34D]',
          text: 'text-[#B45309]',
          bar: 'bg-[#B45309]',
          label: t.scan.verdictCaution,
          Icon: AlertTriangle,
        },
        SCAM: {
          bg: 'bg-[#FEE2E2]',
          border: 'border-[#FCA5A5]',
          text: 'text-[#B91C1C]',
          bar: 'bg-[#B91C1C]',
          label: t.scan.verdictScam,
          Icon: ShieldAlert,
        },
      }[result.verdict]
    : null;

  const modes: { id: ScanMode; label: string; Icon: typeof MessageSquareText }[] = [
    { id: 'message', label: t.scan.modes.message, Icon: MessageSquareText },
    { id: 'link', label: t.scan.modes.link, Icon: Link2 },
    { id: 'screenshot', label: t.scan.modes.screenshot, Icon: ImageIcon },
    { id: 'call', label: t.scan.modes.call, Icon: PhoneCall },
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">{t.scan.title}</h1>
        <p className="mt-1 text-base text-[#4B5563] leading-relaxed">{t.scan.subtitle}</p>
      </div>

      {/* Mode Selector Tabs */}
      <div
        role="tablist"
        aria-label="Scan input mode"
        className="grid grid-cols-2 gap-2 bg-[#ECEFE9] p-1.5 rounded-2xl"
      >
        {modes.map(({ id, label, Icon }) => {
          const isActive = activeMode === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleModeSwitch(id)}
              className={`min-h-[48px] px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#1A3C2B] text-white shadow-xs'
                  : 'text-[#374151] hover:bg-white/70'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Smart Input Card */}
      <section className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-4">
        {/* MODE 1: MESSAGE / SMS */}
        {activeMode === 'message' && (
          <>
            <label htmlFor="scan-message-input" className="block text-sm font-bold text-[#111827]">
              {t.scan.modes.message}
            </label>
            <textarea
              id="scan-message-input"
              rows={4}
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                setErrorMsg('');
              }}
              placeholder={t.scan.messagePlaceholder}
              className="w-full rounded-xl border border-[#CBD4C9] bg-[#F7F8F5] px-4 py-3.5 text-base text-[#111827] placeholder:text-[#6B7280] focus:bg-white focus:border-[#1A3C2B] transition-colors"
            />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#4B5563]">{t.scan.trySample}</p>
              <div className="flex flex-wrap gap-2">
                {MESSAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setMessageText(preset.text);
                      setErrorMsg('');
                      setResult(null);
                    }}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D5DDD3] bg-[#F7F8F5] hover:bg-[#EAF0E8] text-sm font-semibold text-[#1A3C2B] transition-colors cursor-pointer text-left"
                  >
                    {preset.label[language]}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MODE 2: WEBSITE LINK */}
        {activeMode === 'link' && (
          <>
            <label htmlFor="scan-link-input" className="block text-sm font-bold text-[#111827]">
              {t.scan.modes.link}
            </label>
            <input
              id="scan-link-input"
              type="url"
              value={linkText}
              onChange={(e) => {
                setLinkText(e.target.value);
                setErrorMsg('');
              }}
              placeholder={t.scan.linkPlaceholder}
              className="w-full min-h-[52px] rounded-xl border border-[#CBD4C9] bg-[#F7F8F5] px-4 py-3 text-base text-[#111827] placeholder:text-[#6B7280] focus:bg-white focus:border-[#1A3C2B] transition-colors"
            />

            {/* Instant live domain breakdown */}
            {urlInspection && (
              <div className="rounded-xl bg-[#F7F8F5] border border-[#E2E7E1] p-3.5 space-y-2 text-sm">
                <div className="font-bold text-[#111827]">{t.scan.urlBreakdownTitle}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-[#4B5563] block">{t.scan.protocolLabel}</span>
                    <span
                      className={`font-bold ${
                        urlInspection.isHttps ? 'text-[#15803D]' : 'text-[#B91C1C]'
                      }`}
                    >
                      {urlInspection.protocol || 'HTTP'} ({urlInspection.isHttps ? 'Encrypted' : 'Insecure'})
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#4B5563] block">{t.scan.domainLabel}</span>
                    <span className="font-bold text-[#111827] break-all">
                      {urlInspection.hostname || '—'}
                    </span>
                  </div>
                </div>
                <div className="pt-1 border-t border-[#E2E7E1] flex items-center gap-2">
                  {urlInspection.isKnownOfficial && urlInspection.isHttps ? (
                    <span className="text-[#15803D] font-bold inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {t.scan.officialVerified}
                    </span>
                  ) : (
                    <span className="text-[#B91C1C] font-bold inline-flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {urlInspection.impersonatedBrand
                        ? `${t.scan.lookalikeWarning} (${urlInspection.impersonatedBrand})`
                        : t.scan.lookalikeWarning}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#4B5563]">{t.scan.trySample}</p>
              <div className="flex flex-col gap-2">
                {LINK_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setLinkText(preset.url);
                      setErrorMsg('');
                      setResult(null);
                    }}
                    className="min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[#D5DDD3] bg-[#F7F8F5] hover:bg-[#EAF0E8] text-sm text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <span className="font-mono text-xs font-semibold text-[#111827] truncate">
                      {preset.label}
                    </span>
                    <span className="text-xs font-semibold text-[#1A3C2B] shrink-0">
                      {preset.badge[language]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MODE 3: SCREENSHOT / PHOTO */}
        {activeMode === 'screenshot' && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              id="screenshot-file-upload"
            />
            {!screenshotDataUrl ? (
              <div className="space-y-3">
                <label
                  htmlFor="screenshot-file-upload"
                  className="flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 border-dashed border-[#BFCBBC] bg-[#F7F8F5] hover:bg-[#EFF4EE] cursor-pointer transition-colors min-h-[168px]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E4ECE3] text-[#1A3C2B] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-base font-bold text-[#111827]">
                    {t.scan.uploadScreenshot}
                  </span>
                  <span className="mt-1 text-sm text-[#4B5563]">{t.scan.uploadHint}</span>
                </label>

                <button
                  type="button"
                  onClick={handleLoadSampleScreenshot}
                  className="w-full min-h-[52px] px-4 py-3 rounded-xl border border-[#1A3C2B] bg-[#EEF5F0] hover:bg-[#DFECE2] text-[#1A3C2B] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>{t.scan.loadSampleScreenshot}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-[#E2E7E1] bg-[#F7F8F5] max-h-72 flex items-center justify-center">
                  <img
                    src={screenshotDataUrl}
                    alt={screenshotLabel || 'Uploaded screenshot preview'}
                    className="w-full max-h-72 object-contain"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#4B5563]">
                  <span className="truncate font-medium">{screenshotLabel}</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#F7F8F5] border border-[#D5DDD3] text-[#1A3C2B] font-semibold hover:bg-[#EAF0E8] shrink-0 cursor-pointer"
                  >
                    {t.scan.changeScreenshot}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* MODE 4: CALL / VOICE */}
        {activeMode === 'call' && (
          <>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="scan-call-input" className="text-sm font-bold text-[#111827]">
                {t.scan.modes.call}
              </label>
              <button
                type="button"
                onClick={handleToggleMic}
                aria-pressed={isListeningMic}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition-colors cursor-pointer ${
                  isListeningMic
                    ? 'bg-[#B91C1C] text-white'
                    : 'bg-[#EEF5F0] text-[#1A3C2B] border border-[#C6DBC9] hover:bg-[#DFECE2]'
                }`}
              >
                {isListeningMic ? (
                  <>
                    <MicOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t.scan.micStop}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t.scan.micStart}</span>
                  </>
                )}
              </button>
            </div>

            {isListeningMic && (
              <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-3.5 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#991B1B]">{t.scan.micListening}</span>
                <div className="flex items-center gap-1 h-7" aria-hidden="true">
                  {[0, 120, 240, 90, 180].map((delay, idx) => (
                    <span
                      key={idx}
                      style={{ animationDelay: `${delay}ms` }}
                      className="w-1.5 h-6 rounded-full bg-[#B91C1C] animate-voice-bar"
                    />
                  ))}
                </div>
              </div>
            )}

            <textarea
              id="scan-call-input"
              rows={4}
              value={callText}
              onChange={(e) => {
                setCallText(e.target.value);
                setErrorMsg('');
              }}
              placeholder={t.scan.callPlaceholder}
              className="w-full rounded-xl border border-[#CBD4C9] bg-[#F7F8F5] px-4 py-3.5 text-base text-[#111827] placeholder:text-[#6B7280] focus:bg-white focus:border-[#1A3C2B] transition-colors"
            />

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#4B5563]">{t.scan.trySample}</p>
              <div className="flex flex-wrap gap-2">
                {CALL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setCallText(preset.transcript);
                      setErrorMsg('');
                      setResult(null);
                    }}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D5DDD3] bg-[#F7F8F5] hover:bg-[#EAF0E8] text-sm font-semibold text-[#1A3C2B] transition-colors cursor-pointer text-left"
                  >
                    {preset.label[language]}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Validation Error */}
        {errorMsg && (
          <div
            role="alert"
            className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] px-4 py-3 text-sm font-semibold text-[#B91C1C]"
          >
            {errorMsg}
          </div>
        )}

        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleScan}
          disabled={isScanning}
          className="w-full min-h-[56px] px-5 py-3.5 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] disabled:opacity-65 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xs transition-colors cursor-pointer"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden="true" />
              <span>{t.scan.scanningTitle}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{t.scan.scanButton}</span>
            </>
          )}
        </button>
      </section>

      {/* 4-Step Animated AI Verification Pipeline */}
      {isScanning && (
        <section
          aria-live="polite"
          className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-3.5"
        >
          <div className="flex items-center gap-2.5 text-[#1A3C2B] font-bold text-base">
            <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden="true" />
            <span>{t.scan.scanningTitle}</span>
          </div>
          <ol className="space-y-2.5">
            {t.scan.pipelineSteps.map((step, idx) => {
              const done = idx < pipelineStep;
              const current = idx === pipelineStep;
              return (
                <li
                  key={idx}
                  className={`flex items-center gap-3 text-sm transition-opacity ${
                    done || current ? 'opacity-100 text-[#111827] font-medium' : 'opacity-45 text-[#4B5563]'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" aria-hidden="true" />
                  ) : current ? (
                    <Loader2 className="w-5 h-5 text-[#1A3C2B] animate-spin shrink-0" aria-hidden="true" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-[#CBD4C9] shrink-0" />
                  )}
                  <span>{step}</span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Verdict Output Card */}
      {result && verdictStyle && !isScanning && (
        <section
          aria-live="polite"
          className="bg-white border border-[#E2E7E1] rounded-2xl overflow-hidden shadow-xs"
        >
          {/* Traffic-Light Banner */}
          <div className={`${verdictStyle.bg} border-b ${verdictStyle.border} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl bg-white/80 ${verdictStyle.text} shrink-0`}>
                  <verdictStyle.Icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <div>
                  <div className={`text-lg font-extrabold tracking-tight ${verdictStyle.text}`}>
                    {verdictStyle.label}
                  </div>
                  <div className="text-sm font-semibold text-[#111827] mt-0.5">
                    {result.scamCategory}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-[#4B5563] block">
                  {t.scan.riskScoreLabel}
                </span>
                <span className={`text-2xl font-extrabold tabular-nums ${verdictStyle.text}`}>
                  {result.riskScore}%
                </span>
              </div>
            </div>

            {/* Risk Meter */}
            <div className="mt-4">
              <div className="w-full h-3 rounded-full bg-white/75 overflow-hidden">
                <div
                  className={`h-full rounded-full ${verdictStyle.bar} transition-all duration-500`}
                  style={{ width: `${Math.max(4, result.riskScore)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Simple Reassuring Explanation + Voice Button */}
            <div className="space-y-3">
              <p className="text-base font-medium text-[#111827] leading-relaxed">
                {result.simpleExplanation}
              </p>
              <SpeakButton
                text={`${verdictStyle.label}. ${result.scamCategory}. ${result.simpleExplanation} ${result.whatToDoNext.join('. ')}`}
                language={language}
                label={t.scan.listenExplanation}
                variant="primary"
                className="w-full min-h-[52px]"
              />
            </div>

            {/* Source & Authenticity Check */}
            <div className="rounded-xl bg-[#F7F8F5] border border-[#E2E7E1] p-4">
              <h3 className="text-sm font-bold text-[#1A3C2B]">{t.scan.sourceCheckTitle}</h3>
              <p className="mt-1.5 text-sm text-[#374151] leading-relaxed">
                {result.sourceAuthenticity}
              </p>
            </div>

            {/* Warning Signs Found */}
            {result.redFlags.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#111827]">{t.scan.redFlagsTitle}</h3>
                <ul className="mt-2.5 space-y-2">
                  {result.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#374151] leading-relaxed">
                      <span
                        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                          result.verdict === 'SAFE' ? 'bg-[#15803D]' : 'bg-[#B91C1C]'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What You Should Do Right Now */}
            {result.whatToDoNext.length > 0 && (
              <div className="rounded-xl bg-[#F2F7F3] border border-[#CFE0D2] p-4">
                <h3 className="text-sm font-bold text-[#1A3C2B]">{t.scan.whatToDoTitle}</h3>
                <ol className="mt-2.5 space-y-2">
                  {result.whatToDoNext.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#111827] leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-[#1A3C2B] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Action Buttons: Notify Caregiver & Report to 1930 */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleNotifyFamilyClick}
                disabled={caregiverNotified}
                className={`w-full min-h-[52px] px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  caregiverNotified
                    ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                    : 'bg-[#EEF5F0] hover:bg-[#DFECE2] text-[#1A3C2B] border border-[#C6DBC9]'
                }`}
              >
                {caregiverNotified ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{t.scan.familyNotified}</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{t.scan.notifyFamily}</span>
                  </>
                )}
              </button>

              {result.verdict !== 'SAFE' && (
                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="w-full min-h-[52px] px-4 py-3 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>{t.scan.report1930}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setCaregiverNotified(false);
                }}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-white hover:bg-[#F7F8F5] text-[#374151] border border-[#E2E7E1] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.scan.scanAnother}</span>
              </button>
            </div>

            {result.engineNote && (
              <p className="text-xs text-[#6B7280] text-center">{result.engineNote}</p>
            )}
          </div>
        </section>
      )}

      {/* Guided 1930 Report Sheet */}
      {showReportModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-1930-title"
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-5 space-y-4 shadow-xl border border-[#E2E7E1]">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="report-1930-title" className="text-lg font-bold text-[#111827]">
                  {t.alerts.helpline1930Title} (1930)
                </h2>
                <p className="mt-1 text-sm text-[#4B5563]">{t.alerts.helpline1930Desc}</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#F7F8F5] border border-[#E2E7E1] p-3.5 space-y-2">
              <div className="text-xs font-bold text-[#1A3C2B]">{t.alerts.portalChecklistTitle}</div>
              <ul className="space-y-1.5 text-sm text-[#374151]">
                {t.alerts.portalSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#1A3C2B]">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href="tel:1930"
                className="w-full min-h-[52px] rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-base flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5" aria-hidden="true" />
                <span>{t.alerts.callNow}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  onNavigateAlerts();
                }}
                className="w-full min-h-[48px] rounded-xl bg-[#EEF5F0] text-[#1A3C2B] font-semibold text-sm cursor-pointer"
              >
                {t.alerts.bankFreezeTitle}
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="w-full min-h-[44px] rounded-xl border border-[#E2E7E1] text-[#4B5563] font-semibold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
