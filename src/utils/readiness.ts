import type { ScanActivityItem, ScanMode, ScanResult } from '../types';

export function calculateReadinessScore(params: {
  completedSimIds: string[];
  completedGuideIds: string[];
  totalSims: number;
  totalGuides: number;
  safeScansCount?: number;
}): number {
  const { completedSimIds, completedGuideIds, totalSims, totalGuides, safeScansCount = 0 } = params;
  const simWeight = 55;
  const guideWeight = 35;
  const scanBonusWeight = 10;

  const uniqueSims = new Set(completedSimIds).size;
  const uniqueGuides = new Set(completedGuideIds).size;

  const simScore = totalSims > 0 ? Math.min(1, uniqueSims / totalSims) * simWeight : 0;
  const guideScore = totalGuides > 0 ? Math.min(1, uniqueGuides / totalGuides) * guideWeight : 0;
  const scanScore = Math.min(1, safeScansCount / 3) * scanBonusWeight;

  // Baseline 15% for having Suraksha Sathi protection active
  const base = 15;
  const earned = Math.round(((simScore + guideScore + scanScore) / 100) * (100 - base));
  return Math.max(0, Math.min(100, base + earned));
}

export function createActivityLogEntry(params: {
  mode: ScanMode;
  preview: string;
  result: ScanResult;
  notifiedCaregiver?: boolean;
  now?: Date;
}): ScanActivityItem {
  const { mode, preview, result, notifiedCaregiver = false, now = new Date() } = params;
  const trimmed = preview.trim();
  const shortPreview = trimmed.length > 84 ? `${trimmed.slice(0, 81)}...` : trimmed || 'Uploaded Screenshot';

  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  return {
    id: `scan-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: `Today, ${displayHour}:${minutes} ${ampm}`,
    mode,
    preview: shortPreview,
    verdict: result.verdict,
    riskScore: result.riskScore,
    scamCategory: result.scamCategory,
    notifiedCaregiver,
  };
}

export function getReadinessTier(score: number): 'getting-started' | 'growing-strong' | 'cyber-confident' {
  if (score >= 80) return 'cyber-confident';
  if (score >= 45) return 'growing-strong';
  return 'getting-started';
}
