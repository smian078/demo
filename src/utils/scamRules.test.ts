import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeLocallyFallback, inspectUrl, normalizeScanResult } from './scamRules';

test('inspectUrl identifies lookalike SBI link on suspicious .xyz domain', () => {
  const result = inspectUrl('http://sbi-kyc-update-fast.xyz');
  assert.equal(result.isValid, true);
  assert.equal(result.isHttps, false);
  assert.equal(result.isKnownOfficial, false);
  assert.equal(result.impersonatedBrand, 'State Bank of India (SBI)');
  assert.ok(result.warnings.length >= 2);
});

test('inspectUrl recognizes verified official onlinesbi.sbi HTTPS link', () => {
  const result = inspectUrl('https://onlinesbi.sbi');
  assert.equal(result.isValid, true);
  assert.equal(result.isHttps, true);
  assert.equal(result.isKnownOfficial, true);
  assert.equal(result.impersonatedBrand, null);
  assert.equal(result.warnings.length, 0);
});

test('analyzeLocallyFallback flags fake MSEB disconnection SMS as high-risk SCAM across EN/HI/MR', () => {
  const sample = 'URGENT: Your MSEB electricity power will be disconnected tonight at 9:30 PM. Pay Rs 12 at bit.ly/pay-bill-now';
  for (const language of ['en', 'hi', 'mr'] as const) {
    const res = analyzeLocallyFallback({ mode: 'message', content: sample, language });
    assert.equal(res.verdict, 'SCAM');
    assert.ok(res.riskScore >= 90);
    assert.ok(res.redFlags.length >= 3);
    assert.ok(res.whatToDoNext.length >= 2);
    assert.ok(res.simpleExplanation.length > 20);
  }
});

test('analyzeLocallyFallback flags Digital Arrest CBI call as SCAM', () => {
  const res = analyzeLocallyFallback({
    mode: 'call',
    content: 'This is Mumbai Cyber Police and CBI. A parcel in your Aadhaar name had illegal drugs. You are under Digital Arrest, transfer money to RBI verification account.',
    language: 'en',
  });
  assert.equal(res.verdict, 'SCAM');
  assert.ok(res.riskScore >= 95);
});

test('analyzeLocallyFallback recognizes genuine bank OTP alert as SAFE', () => {
  const res = analyzeLocallyFallback({
    mode: 'message',
    content: 'Your SBI OTP for Rs 450 transaction is 482910. Do not share this OTP with anyone. If not initiated by you, call 1800-11-2211.',
    language: 'en',
  });
  assert.equal(res.verdict, 'SAFE');
  assert.ok(res.riskScore <= 20);
});

test('normalizeScanResult clamps invalid riskScore and handles missing fields', () => {
  const normalized = normalizeScanResult({ verdict: 'SCAM', riskScore: 180 }, 'hi');
  assert.equal(normalized.verdict, 'SCAM');
  assert.equal(normalized.riskScore, 100);
  assert.ok(normalized.simpleExplanation.includes('कृपया'));
});
