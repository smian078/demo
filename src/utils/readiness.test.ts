import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadinessScore, createActivityLogEntry, getReadinessTier } from './readiness';

test('calculateReadinessScore starts at baseline 15% and reaches 100% when all items complete', () => {
  const initial = calculateReadinessScore({
    completedSimIds: [],
    completedGuideIds: [],
    totalSims: 3,
    totalGuides: 4,
    safeScansCount: 0,
  });
  assert.equal(initial, 15);

  const partial = calculateReadinessScore({
    completedSimIds: ['call'],
    completedGuideIds: ['kyc-otp'],
    totalSims: 3,
    totalGuides: 4,
    safeScansCount: 1,
  });
  assert.ok(partial > initial && partial < 100);

  const maxed = calculateReadinessScore({
    completedSimIds: ['call', 'whatsapp', 'upi'],
    completedGuideIds: ['kyc-otp', 'lottery-job', 'digital-arrest', 'safe-upi'],
    totalSims: 3,
    totalGuides: 4,
    safeScansCount: 3,
  });
  assert.equal(maxed, 100);
});

test('calculateReadinessScore deduplicates repeated simulation completions', () => {
  const once = calculateReadinessScore({
    completedSimIds: ['call'],
    completedGuideIds: [],
    totalSims: 3,
    totalGuides: 4,
  });
  const twice = calculateReadinessScore({
    completedSimIds: ['call', 'call'],
    completedGuideIds: [],
    totalSims: 3,
    totalGuides: 4,
  });
  assert.equal(once, twice);
});

test('createActivityLogEntry truncates long previews and formats time cleanly', () => {
  const longText = 'A'.repeat(120);
  const entry = createActivityLogEntry({
    mode: 'message',
    preview: longText,
    result: {
      verdict: 'SCAM',
      riskScore: 95,
      scamCategory: 'Fake KYC',
      sourceAuthenticity: 'Fake',
      redFlags: ['Urgency'],
      whatToDoNext: ['Block'],
      simpleExplanation: 'Do not click.',
    },
    notifiedCaregiver: true,
    now: new Date(2026, 10, 24, 14, 5),
  });

  assert.equal(entry.timestamp, 'Today, 2:05 PM');
  assert.equal(entry.preview.length, 84);
  assert.equal(entry.notifiedCaregiver, true);
  assert.equal(getReadinessTier(85), 'cyber-confident');
  assert.equal(getReadinessTier(50), 'growing-strong');
  assert.equal(getReadinessTier(20), 'getting-started');
});
