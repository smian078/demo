export type Language = 'en' | 'hi' | 'mr';

export type TabId = 'home' | 'scan' | 'practice' | 'alerts' | 'family';

export type ScanMode = 'message' | 'link' | 'screenshot' | 'call';

export type VerdictType = 'SAFE' | 'CAUTION' | 'SCAM';

export interface ScanResult {
  verdict: VerdictType;
  riskScore: number;
  scamCategory: string;
  sourceAuthenticity: string;
  redFlags: string[];
  whatToDoNext: string[];
  simpleExplanation: string;
  engine?: 'gemini' | 'local';
  engineNote?: string;
}

export interface ScanActivityItem {
  id: string;
  timestamp: string;
  mode: ScanMode;
  preview: string;
  verdict: VerdictType;
  riskScore: number;
  scamCategory: string;
  notifiedCaregiver: boolean;
}

export interface CaregiverSettings {
  instantHighRiskAlert: boolean;
  weeklyLearningSummary: boolean;
  autoWarnUnknownLinks: boolean;
  strictCallMode: boolean;
}

export interface CaregiverNudge {
  id: string;
  message: string;
  senderName: string;
  timestamp: string;
  suggestedSimId?: 'call' | 'whatsapp' | 'upi';
  dismissed?: boolean;
}

export interface UrlInspection {
  isValid: boolean;
  normalizedUrl: string;
  protocol: string;
  hostname: string;
  tld: string;
  isHttps: boolean;
  isShortener: boolean;
  isIpAddress: boolean;
  isKnownOfficial: boolean;
  impersonatedBrand: string | null;
  warnings: string[];
}

export type CityOption =
  | 'Nagpur, Maharashtra'
  | 'Pune, Maharashtra'
  | 'Mumbai, Maharashtra'
  | 'All India';

export type AlertFilter = 'recent' | 'common' | 'all';

export interface LocalScamAlert {
  id: string;
  city: CityOption;
  dateLabel: Record<Language, string>;
  isRecent: boolean;
  isMostCommon: boolean;
  scamType: Record<Language, string>;
  severity: 'HIGH' | 'MEDIUM';
  title: Record<Language, string>;
  summary: Record<Language, string>;
  protectionTip: Record<Language, string>;
}

export interface LearningSlide {
  heading: Record<Language, string>;
  body: Record<Language, string>;
  doText: Record<Language, string>;
  dontText: Record<Language, string>;
}

export interface LearningGuide {
  id: string;
  artworkKey: 'kyc' | 'lottery' | 'arrest' | 'upi';
  imageSrc?: string;
  durationLabel: Record<Language, string>;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  slides: LearningSlide[];
  quizQuestion: Record<Language, string>;
  quizOptions: {
    id: string;
    label: Record<Language, string>;
    isCorrect: boolean;
    feedback: Record<Language, string>;
  }[];
}
