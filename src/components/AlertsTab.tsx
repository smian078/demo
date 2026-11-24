import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Globe,
  MapPin,
  PhoneCall,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import type { AlertFilter, CityOption, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { BANK_FREEZE_CONTACTS, CITY_OPTIONS, LOCAL_SCAM_ALERTS } from '../data/content';
import { SpeakButton } from './SpeakButton';

interface AlertsTabProps {
  language: Language;
}

export function AlertsTab({ language }: AlertsTabProps) {
  const t = TRANSLATIONS[language];
  const [selectedCity, setSelectedCity] = useState<CityOption>('Nagpur, Maharashtra');
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAlerts = useMemo(() => {
    return LOCAL_SCAM_ALERTS.filter((alert) => {
      const cityMatch =
        selectedCity === 'All India' ||
        alert.city === selectedCity ||
        alert.city === 'All India';
      if (!cityMatch) return false;
      if (filter === 'recent') return alert.isRecent;
      if (filter === 'common') return alert.isMostCommon;
      return true;
    });
  }, [selectedCity, filter]);

  const toggleTip = (id: string) => {
    setExpandedTips((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback visual confirmation even in restricted iframe clipboard
    }
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">{t.alerts.title}</h1>
        <p className="mt-1 text-base text-[#4B5563] leading-relaxed">{t.alerts.subtitle}</p>
      </div>

      {/* Location Selector + Filter Controls */}
      <section className="bg-white border border-[#E2E7E1] rounded-2xl p-4 space-y-3.5">
        <div>
          <label
            htmlFor="city-radar-select"
            className="flex items-center gap-1.5 text-xs font-bold text-[#1A3C2B] mb-1.5"
          >
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span>{t.alerts.locationLabel}</span>
          </label>
          <select
            id="city-radar-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value as CityOption)}
            className="w-full min-h-[50px] rounded-xl border border-[#CBD4C9] bg-[#F7F8F5] px-3.5 py-2.5 text-base font-semibold text-[#111827] cursor-pointer"
          >
            {CITY_OPTIONS.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter alerts">
          {(
            [
              { id: 'recent', label: t.alerts.filterRecent },
              { id: 'common', label: t.alerts.filterCommon },
              { id: 'all', label: t.alerts.filterAll },
            ] as { id: AlertFilter; label: string }[]
          ).map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(chip.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#1A3C2B] text-white'
                    : 'bg-[#F7F8F5] text-[#374151] border border-[#D5DDD3] hover:bg-[#EAF0E8]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Hyper-Local Incident Feed */}
      <section className="space-y-3.5" aria-label="Active scam alerts">
        {filteredAlerts.map((alert) => {
          const isExpanded = Boolean(expandedTips[alert.id]);
          const isHigh = alert.severity === 'HIGH';
          return (
            <article
              key={alert.id}
              className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-3"
            >
              {/* Clean unboxed metadata row */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4B5563]">
                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    isHigh ? 'text-[#B91C1C]' : 'text-[#B45309]'
                  }`}
                >
                  {isHigh ? (
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                  {isHigh ? t.alerts.severityHigh : t.alerts.severityMedium}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#111827]">{alert.city}</span>
                <span aria-hidden="true">·</span>
                <span>{alert.dateLabel[language]}</span>
                <span aria-hidden="true">·</span>
                <span>{alert.scamType[language]}</span>
              </div>

              <h2 className="text-lg font-bold text-[#111827] leading-snug">
                {alert.title[language]}
              </h2>

              <p className="text-sm text-[#374151] leading-relaxed">{alert.summary[language]}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <SpeakButton
                  text={`${alert.title[language]}. ${alert.summary[language]}. ${alert.protectionTip[language]}`}
                  language={language}
                />

                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => toggleTip(alert.id)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EEF5F0] hover:bg-[#DFECE2] text-[#1A3C2B] font-semibold text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{isExpanded ? t.alerts.hideTip : t.alerts.howToProtect}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="rounded-xl bg-[#F2F7F3] border border-[#CFE0D2] p-3.5 text-sm text-[#14532D] leading-relaxed">
                  <strong className="block text-[#1A3C2B] mb-1">{t.alerts.howToProtect}:</strong>
                  {alert.protectionTip[language]}
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Quick-Access Helpline & Freeze Directory */}
      <section className="space-y-3.5 pt-2">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">{t.alerts.helplineTitle}</h2>
          <p className="mt-0.5 text-sm text-[#4B5563]">{t.alerts.helplineSubtitle}</p>
        </div>

        {/* 1930 Emergency Card */}
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-5 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#991B1B]">{t.alerts.helpline1930Title}</h3>
              <p className="mt-1 text-sm text-[#7F1D1D] leading-relaxed">
                {t.alerts.helpline1930Desc}
              </p>
            </div>
            <span className="text-2xl font-extrabold text-[#B91C1C] tabular-nums shrink-0">
              1930
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:1930"
              className="min-h-[52px] px-4 py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.alerts.callNow}</span>
            </a>

            <button
              type="button"
              onClick={() => handleCopy('1930', '1930')}
              className="min-h-[52px] px-4 py-3 rounded-xl bg-white border border-[#FCA5A5] text-[#991B1B] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FEE2E2] transition-colors cursor-pointer"
            >
              {copiedId === '1930' ? (
                <>
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.alerts.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.alerts.copyNumber}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* National Cyber Crime Portal Checklist */}
        <div className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-[#1A3C2B]">
            <Globe className="w-5 h-5 shrink-0" aria-hidden="true" />
            <h3 className="text-base font-bold text-[#111827]">{t.alerts.portalTitle}</h3>
          </div>
          <p className="text-xs font-bold text-[#4B5563]">{t.alerts.portalChecklistTitle}</p>
          <ol className="space-y-2 text-sm text-[#374151]">
            {t.alerts.portalSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[#EEF5F0] text-[#1A3C2B] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Bank Card & UPI Freeze Numbers */}
        <div className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#1A3C2B]">
            <Building2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <h3 className="text-base font-bold text-[#111827]">{t.alerts.bankFreezeTitle}</h3>
          </div>
          <div className="divide-y divide-[#EDF1EC]">
            {BANK_FREEZE_CONTACTS.map((bank) => (
              <div
                key={bank.name}
                className="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-bold text-[#111827]">{bank.name}</div>
                  <div className="text-sm font-mono font-semibold text-[#1A3C2B] tabular-nums">
                    {bank.number}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(bank.name, bank.number)}
                    aria-label={`${t.alerts.copyNumber} ${bank.name}`}
                    className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-[#F7F8F5] border border-[#D5DDD3] text-[#1A3C2B] hover:bg-[#EAF0E8] flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    {copiedId === bank.name ? (
                      <Check className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
                    ) : (
                      <Copy className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                  <a
                    href={`tel:${bank.number.replace(/[^0-9]/g, '')}`}
                    aria-label={`Call ${bank.name}`}
                    className="min-h-[44px] px-3.5 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] text-white text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Emergency Family Contact */}
        <div className="bg-[#EEF5F0] border border-[#C6DBC9] rounded-2xl p-5 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1A3C2B] text-white flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A3C2B]">{t.alerts.familyContactTitle}</div>
              <div className="text-base font-bold text-[#111827]">{t.alerts.familyContactName}</div>
              <div className="text-sm font-mono font-semibold text-[#374151] tabular-nums">
                {t.alerts.familyContactPhone}
              </div>
            </div>
          </div>
          <a
            href={`tel:${t.alerts.familyContactPhone.replace(/[^0-9+]/g, '')}`}
            className="min-h-[52px] px-4 py-3 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] text-white font-bold text-sm inline-flex items-center gap-1.5 shrink-0"
          >
            <PhoneCall className="w-4 h-4" aria-hidden="true" />
            <span>Call</span>
          </a>
        </div>
      </section>
    </div>
  );
}
