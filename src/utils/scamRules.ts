import type { Language, ScanMode, ScanResult, UrlInspection, VerdictType } from '../types';

const OFFICIAL_INDIAN_DOMAINS: Record<string, string> = {
  'onlinesbi.sbi': 'State Bank of India (SBI)',
  'sbi.co.in': 'State Bank of India (SBI)',
  'hdfcbank.com': 'HDFC Bank',
  'icicibank.com': 'ICICI Bank',
  'bankofmaharashtra.in': 'Bank of Maharashtra',
  'mahadiscom.in': 'MSEDCL / Mahavitaran',
  'cybercrime.gov.in': 'National Cyber Crime Portal',
  'uidai.gov.in': 'UIDAI (Aadhaar)',
  'incometax.gov.in': 'Income Tax India',
  'epfindia.gov.in': 'EPFO India',
  'npci.org.in': 'NPCI / UPI',
  'rbi.org.in': 'Reserve Bank of India',
};

const BRAND_KEYWORDS: { keyword: string; brand: string; officialDomains: string[] }[] = [
  { keyword: 'sbi', brand: 'State Bank of India (SBI)', officialDomains: ['onlinesbi.sbi', 'sbi.co.in'] },
  { keyword: 'hdfc', brand: 'HDFC Bank', officialDomains: ['hdfcbank.com'] },
  { keyword: 'icici', brand: 'ICICI Bank', officialDomains: ['icicibank.com'] },
  { keyword: 'mseb', brand: 'MSEDCL / Mahavitaran', officialDomains: ['mahadiscom.in'] },
  { keyword: 'msedcl', brand: 'MSEDCL / Mahavitaran', officialDomains: ['mahadiscom.in'] },
  { keyword: 'mahavitaran', brand: 'MSEDCL / Mahavitaran', officialDomains: ['mahadiscom.in'] },
  { keyword: 'uidai', brand: 'UIDAI (Aadhaar)', officialDomains: ['uidai.gov.in'] },
  { keyword: 'aadhaar', brand: 'UIDAI (Aadhaar)', officialDomains: ['uidai.gov.in'] },
  { keyword: 'epfo', brand: 'EPFO India', officialDomains: ['epfindia.gov.in'] },
  { keyword: 'paytm', brand: 'Paytm', officialDomains: ['paytm.com'] },
  { keyword: 'phonepe', brand: 'PhonePe', officialDomains: ['phonepe.com'] },
  { keyword: 'npci', brand: 'NPCI / UPI', officialDomains: ['npci.org.in'] },
];

const SHORTENER_HOSTS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'rb.gy',
  'cutt.ly',
  'is.gd',
  'shorturl.at',
  'rebrand.ly',
  'ow.ly',
]);

const SUSPICIOUS_TLDS = new Set(['xyz', 'top', 'click', 'buzz', 'tk', 'ml', 'ga', 'cf', 'gq', 'vip', 'shop', 'icu', 'live']);

export function inspectUrl(rawUrl: string): UrlInspection {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      isValid: false,
      normalizedUrl: '',
      protocol: '',
      hostname: '',
      tld: '',
      isHttps: false,
      isShortener: false,
      isIpAddress: false,
      isKnownOfficial: false,
      impersonatedBrand: null,
      warnings: [],
    };
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const parts = hostname.split('.');
    const tld = parts.length > 1 ? parts[parts.length - 1] : '';
    const isHttps = parsed.protocol === 'https:';
    const isShortener = SHORTENER_HOSTS.has(hostname);
    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    const matchedOfficialKey = Object.keys(OFFICIAL_INDIAN_DOMAINS).find(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
    const isKnownOfficial = Boolean(matchedOfficialKey);

    let impersonatedBrand: string | null = null;
    if (!isKnownOfficial) {
      for (const entry of BRAND_KEYWORDS) {
        if (hostname.includes(entry.keyword)) {
          impersonatedBrand = entry.brand;
          break;
        }
      }
    }

    const warnings: string[] = [];
    if (!isHttps) {
      warnings.push('Uses insecure HTTP instead of encrypted HTTPS.');
    }
    if (isShortener) {
      warnings.push('Shortened web link hides the true destination address.');
    }
    if (isIpAddress) {
      warnings.push('Uses a raw IP address instead of a real bank or government name.');
    }
    if (impersonatedBrand) {
      warnings.push(`Lookalike domain pretending to be ${impersonatedBrand}.`);
    }
    if (SUSPICIOUS_TLDS.has(tld)) {
      warnings.push(`Unusual domain ending (.${tld}) commonly used in scam websites.`);
    }

    return {
      isValid: parts.length >= 2 || isIpAddress,
      normalizedUrl: withProtocol,
      protocol: parsed.protocol.replace(':', '').toUpperCase(),
      hostname,
      tld,
      isHttps,
      isShortener,
      isIpAddress,
      isKnownOfficial,
      impersonatedBrand,
      warnings,
    };
  } catch {
    return {
      isValid: false,
      normalizedUrl: trimmed,
      protocol: '',
      hostname: trimmed,
      tld: '',
      isHttps: false,
      isShortener: false,
      isIpAddress: false,
      isKnownOfficial: false,
      impersonatedBrand: null,
      warnings: ['Could not verify this web address format.'],
    };
  }
}

export function normalizeScanResult(raw: Partial<ScanResult>, language: Language): ScanResult {
  const validVerdicts: VerdictType[] = ['SAFE', 'CAUTION', 'SCAM'];
  const verdict: VerdictType = validVerdicts.includes(raw.verdict as VerdictType)
    ? (raw.verdict as VerdictType)
    : 'CAUTION';

  const numericScore = typeof raw.riskScore === 'number' && !Number.isNaN(raw.riskScore)
    ? Math.round(Math.max(0, Math.min(100, raw.riskScore)))
    : verdict === 'SCAM'
      ? 90
      : verdict === 'CAUTION'
        ? 55
        : 8;

  const fallbackExplanation: Record<Language, string> = {
    en: 'Please take a moment before replying or clicking anything. When in doubt, speak with your family or call your bank directly.',
    hi: 'कृपया जवाब देने या किसी लिंक पर क्लिक करने से पहले थोड़ा रुकें। संदेह होने पर अपने परिवार से बात करें या सीधे बैंक को कॉल करें।',
    mr: 'कृपया उत्तर देण्यापूर्वी किंवा कोणत्याही लिंकवर क्लिक करण्यापूर्वी थोडे थांबा. शंका असल्यास आपल्या कुटुंबाशी बोला किंवा थेट बँकेशी संपर्क साधा.',
  };

  return {
    verdict,
    riskScore: numericScore,
    scamCategory: (raw.scamCategory || 'Safety Assessment').trim(),
    sourceAuthenticity: (raw.sourceAuthenticity || 'Could not confirm an official verified sender.').trim(),
    redFlags: Array.isArray(raw.redFlags) && raw.redFlags.length > 0
      ? raw.redFlags.map((item) => String(item).trim()).filter(Boolean).slice(0, 5)
      : [],
    whatToDoNext: Array.isArray(raw.whatToDoNext) && raw.whatToDoNext.length > 0
      ? raw.whatToDoNext.map((item) => String(item).trim()).filter(Boolean).slice(0, 4)
      : [],
    simpleExplanation: (raw.simpleExplanation || fallbackExplanation[language]).trim(),
    engine: raw.engine,
    engineNote: raw.engineNote,
  };
}

export function analyzeLocallyFallback(params: {
  mode: ScanMode;
  content: string;
  hasImage?: boolean;
  language: Language;
}): ScanResult {
  const { mode, content, hasImage, language } = params;
  const text = (content || '').toLowerCase();

  // 1. Website Link inspection
  if (mode === 'link') {
    const inspection = inspectUrl(content);
    if (inspection.isKnownOfficial && inspection.isHttps) {
      const officialByLang: Record<Language, ScanResult> = {
        en: {
          verdict: 'SAFE',
          riskScore: 6,
          scamCategory: 'Verified Official Website',
          sourceAuthenticity: `${inspection.hostname} matches a verified official Indian banking or government domain using secure HTTPS.`,
          redFlags: [
            'No lookalike spelling tricks detected in this address.',
            'Uses encrypted HTTPS connection.',
          ],
          whatToDoNext: [
            'You may open this official site safely in your browser.',
            'Still never share your OTP or ATM PIN with anyone on a phone call.',
          ],
          simpleExplanation:
            'This web address belongs to an official and trusted Indian organization. You can use it calmly, while always keeping your password and OTP private.',
          engine: 'local',
        },
        hi: {
          verdict: 'SAFE',
          riskScore: 6,
          scamCategory: 'सत्यापित आधिकारिक वेबसाइट',
          sourceAuthenticity: `${inspection.hostname} एक सुरक्षित HTTPS के साथ भारत के आधिकारिक बैंक या सरकारी पोर्टल का सही पता है।`,
          redFlags: [
            'इस वेब पते में कोई नकली स्पेलिंग नहीं मिली।',
            'यह सुरक्षित एन्क्रिप्टेड HTTPS कनेक्शन का उपयोग करता है।',
          ],
          whatToDoNext: [
            'आप इस आधिकारिक वेबसाइट को सुरक्षित रूप से खोल सकते हैं।',
            'फिर भी अपना OTP या PIN कभी किसी को फोन पर न बताएं।',
          ],
          simpleExplanation:
            'यह वेबसाइट का पता एक असली और भरोसेमंद भारतीय संस्था का है। आप इसका उपयोग निश्चिंत होकर कर सकते हैं, बस अपना पासवर्ड और OTP हमेशा गोपनीय रखें।',
          engine: 'local',
        },
        mr: {
          verdict: 'SAFE',
          riskScore: 6,
          scamCategory: 'अधिकृत आणि सुरक्षित वेबसाइट',
          sourceAuthenticity: `${inspection.hostname} हा सुरक्षित HTTPS असलेला अधिकृत भारतीय बँक किंवा सरकारी वेबसाइटचा खरा पत्ता आहे.`,
          redFlags: [
            'या वेब पत्त्यामध्ये कोणतीही बनावट स्पेलिंग आढळली नाही.',
            'ही वेबसाइट सुरक्षित HTTPS कनेक्शन वापरते.',
          ],
          whatToDoNext: [
            'तुम्ही ही अधिकृत वेबसाइट सुरक्षितपणे उघडू शकता.',
            'तरीही तुमचा OTP किंवा PIN फोनवर कोणालाही सांगू नका.',
          ],
          simpleExplanation:
            'हा वेब पत्ता एका खऱ्या आणि विश्वासार्ह भारतीय संस्थेचा आहे. तुम्ही याचा वापर निश्चिंतपणे करू शकता, फक्त तुमचा पासवर्ड आणि OTP नेहमी गुप्त ठेवा.',
          engine: 'local',
        },
      };
      return officialByLang[language];
    }

    if (inspection.impersonatedBrand || inspection.isShortener || !inspection.isHttps || inspection.warnings.length > 0) {
      const scamLinkByLang: Record<Language, ScanResult> = {
        en: {
          verdict: 'SCAM',
          riskScore: inspection.impersonatedBrand ? 96 : 88,
          scamCategory: inspection.impersonatedBrand
            ? `Fake ${inspection.impersonatedBrand} Lookalike Link`
            : 'Suspicious / Unverified Website Link',
          sourceAuthenticity: inspection.impersonatedBrand
            ? `The website "${inspection.hostname}" is NOT owned by ${inspection.impersonatedBrand}. Scammers create similar-sounding web names to steal banking passwords.`
            : `The link "${inspection.hostname || content}" does not belong to any verified bank or government service.`,
          redFlags: [
            ...(inspection.warnings.length > 0 ? inspection.warnings : ['Unverified third-party domain name.']),
            'Official Indian banks never ask you to update KYC via random links.',
          ].slice(0, 4),
          whatToDoNext: [
            'Do NOT click this link or type your phone number, PIN, or OTP there.',
            'Delete the message and block the sender.',
            'If you need banking help, open your official bank app directly or visit your branch.',
          ],
          simpleExplanation:
            'This link looks like a trap trying to copy a trusted name. Please do not tap on it—you are completely safe as long as you close and delete it.',
          engine: 'local',
        },
        hi: {
          verdict: 'SCAM',
          riskScore: inspection.impersonatedBrand ? 96 : 88,
          scamCategory: 'नकली बैंक / फिशिंग वेबसाइट लिंक',
          sourceAuthenticity: `"${inspection.hostname || content}" कोई असली बैंक या सरकारी वेबसाइट नहीं है। ठग मिलते-जुलते नाम बनाकर लोगों की बैंकिंग जानकारी चुराते हैं।`,
          redFlags: [
            'यह पता असली बैंक या सरकारी डोमेन से मेल नहीं खाता।',
            !inspection.isHttps ? 'इसमें सुरक्षित HTTPS लॉक नहीं है (असुरक्षित HTTP)।' : 'यह अज्ञात या संदिग्ध डोमेन पर ले जाता है।',
            'असली बैंक कभी भी SMS लिंक से KYC अपडेट नहीं मांगते।',
          ],
          whatToDoNext: [
            'इस लिंक पर बिल्कुल क्लिक न करें और न ही कोई जानकारी भरें।',
            'यह संदेश तुरंत डिलीट करें और भेजने वाले को ब्लॉक करें।',
            'किसी भी बैंक काम के लिए सीधे अपनी शाखा में जाएं या आधिकारिक ऐप खोलें।',
          ],
          simpleExplanation:
            'यह लिंक एक नकली जाल जैसा दिखता है जो किसी बड़े नाम की नकल कर रहा है। कृपया इस पर क्लिक न करें—जब तक आप इसे नहीं खोलते, आप पूरी तरह सुरक्षित हैं।',
          engine: 'local',
        },
        mr: {
          verdict: 'SCAM',
          riskScore: inspection.impersonatedBrand ? 96 : 88,
          scamCategory: 'बनावट बँक / फसवी वेबसाइट लिंक',
          sourceAuthenticity: `"${inspection.hostname || content}" ही कोणतीही अधिकृत बँक किंवा सरकारी वेबसाइट नाही. फसवणूक करणारे लोक मिळत्याजुळत्या नावाने बनावट साइट बनवतात.`,
          redFlags: [
            'हा वेब पत्ता कोणत्याही खऱ्या बँकेचा किंवा सरकारी संस्थेचा नाही.',
            !inspection.isHttps ? 'यात सुरक्षित HTTPS कनेक्शन नाही (असुरक्षित HTTP).' : 'ही लिंक संशयास्पद डोमेनवर जाते.',
            'अधिकृत बँका कधीही SMS मधील लिंकद्वारे KYC मागवत नाहीत.',
          ],
          whatToDoNext: [
            'या लिंकवर अजिबात क्लिक करू नका आणि कोणतीही माहिती भरू नका.',
            'हा मेसेज लगेच डिलीट करा आणि पाठवणाऱ्याला ब्लॉक करा.',
            'बँकेच्या कामासाठी नेहमी अधिकृत ॲप वापरा किंवा थेट शाखेत जा.',
          ],
          simpleExplanation:
            'ही लिंक एखाद्या विश्वासार्ह नावाची नक्कल करणारा सापळा दिसत आहे. कृपया त्यावर क्लिक करू नका—तुम्ही ही लिंक न उघडता बंद केल्यास तुम्ही पूर्णपणे सुरक्षित आहात.',
          engine: 'local',
        },
      };
      return scamLinkByLang[language];
    }
  }

  // 2. Digital Arrest / Fake Police / CBI / Customs Call
  if (
    text.includes('digital arrest') ||
    text.includes('cbi') ||
    text.includes('cyber police') ||
    text.includes('mumbai police') ||
    text.includes('narcotics') ||
    text.includes('customs') ||
    text.includes('parcel') ||
    text.includes('arrest warrant') ||
    text.includes('rbi verification account') ||
    text.includes('stay on video call')
  ) {
    const arrestByLang: Record<Language, ScanResult> = {
      en: {
        verdict: 'SCAM',
        riskScore: 98,
        scamCategory: 'Digital Arrest / Fake Police Impersonation Scam',
        sourceAuthenticity:
          'Real CBI, Police, Customs, or Courts NEVER arrest people over WhatsApp, Skype, or phone calls, and NEVER ask you to transfer money for "verification".',
        redFlags: [
          'Uses fear of immediate arrest or fake parcel/drug accusations.',
          'Pressures you to stay on the phone and not tell your family.',
          'Demands money transfer to an "RBI verification" or "safe custody" account.',
          'Indian law has NO concept of "Digital Arrest".',
        ],
        whatToDoNext: [
          'Hang up the call immediately—do not argue or stay on video.',
          'Tell a family member right away so you are not alone.',
          'Report the caller number on 1930 or cybercrime.gov.in.',
        ],
        simpleExplanation:
          'Please do not be frightened—this is a well-known scam called "Digital Arrest". Real Indian police never interrogate or demand money over phone or video calls, so you can safely hang up right now.',
        engine: 'local',
      },
      hi: {
        verdict: 'SCAM',
        riskScore: 98,
        scamCategory: 'डिजिटल अरेस्ट / नकली पुलिस ठगी',
        sourceAuthenticity:
          'असली पुलिस, CBI, कस्टम्स या कोर्ट कभी भी फोन या वीडियो कॉल पर गिरफ्तारी नहीं करते और न ही "जांच" के लिए पैसे ट्रांसफर करने को कहते हैं।',
        redFlags: [
          'तुरंत गिरफ्तारी या नकली पार्सल केस का डर दिखाया जा रहा है।',
          'परिवार से बात न करने और कॉल पर बने रहने का दबाव बनाया जा रहा है।',
          'पैसे "वेरिफिकेशन अकाउंट" में भेजने को कहा जा रहा है।',
          'भारतीय कानून में "डिजिटल अरेस्ट" जैसा कुछ भी नहीं होता।',
        ],
        whatToDoNext: [
          'यह फोन या वीडियो कॉल तुरंत काट दें—डरें बिल्कुल नहीं।',
          'तुरंत अपने परिवार के किसी सदस्य को इसके बारे में बताएं।',
          '1930 पर कॉल करके या cybercrime.gov.in पर इस नंबर की शिकायत करें।',
        ],
        simpleExplanation:
          'कृपया बिल्कुल न घबराएं—यह "डिजिटल अरेस्ट" नाम का एक बहुत बड़ा फ्रॉड है। असली भारतीय पुलिस कभी फोन पर पैसे नहीं मांगती, इसलिए आप बेझिझक फोन काट सकते हैं।',
        engine: 'local',
      },
      mr: {
        verdict: 'SCAM',
        riskScore: 98,
        scamCategory: 'डिजिटल अरेस्ट / बनावट पोलीस फसवणूक',
        sourceAuthenticity:
          'खरे पोलीस, CBI, कस्टम्स किंवा न्यायालय कधीही फोन किंवा व्हिडिओ कॉलवर अटक करत नाहीत आणि "पडताळणीसाठी" पैसे ट्रान्सफर करायला सांगत नाहीत.',
        redFlags: [
          'तातडीने अटक करण्याची किंवा बनावट पार्सल केसची भीती घातली जात आहे.',
          'कुटुंबाला न सांगता कॉल सुरू ठेवण्याचा दबाव टाकला जात आहे.',
          'पैसे "व्हेरिफिकेशन खात्यात" पाठवण्याची मागणी केली जात आहे.',
          'भारतीय कायद्यात "डिजिटल अरेस्ट" अशी कोणतीही तरतूद नाही.',
        ],
        whatToDoNext: [
          'हा कॉल लगेच बंद करा—अजिबात घाबरू नका.',
          'याबद्दल लगेच आपल्या कुटुंबातील सदस्यांना सांगा.',
          '1930 वर कॉल करून किंवा cybercrime.gov.in वर या नंबरची तक्रार करा.',
        ],
        simpleExplanation:
          'कृपया अजिबात घाबरू नका—हा "डिजिटल अरेस्ट" नावाचा एक प्रसिद्ध सायबर सापळा आहे. खरे पोलीस कधीही फोनवरून पैसे मागत नाहीत, त्यामुळे तुम्ही हा कॉल निर्धास्तपणे बंद करा.',
        engine: 'local',
      },
    };
    return arrestByLang[language];
  }

  // 3. Electricity Bill / MSEB / MSEDCL Scam (or sample screenshot)
  if (
    hasImage ||
    text.includes('electricity') ||
    text.includes('mseb') ||
    text.includes('msedcl') ||
    text.includes('mahavitaran') ||
    text.includes('disconnected tonight') ||
    text.includes('power will be disconnected') ||
    text.includes('9:30 pm')
  ) {
    const elecByLang: Record<Language, ScanResult> = {
      en: {
        verdict: 'SCAM',
        riskScore: 95,
        scamCategory: 'Fake Electricity Bill Disconnection Scam',
        sourceAuthenticity:
          'MSEDCL / Mahavitaran and electricity boards NEVER threaten same-night disconnection from a personal mobile number or ask for a ₹10–₹12 "update payment".',
        redFlags: [
          'Creates sudden panic that electricity will be cut tonight at 9:30 PM.',
          'Asks you to call a personal 10-digit mobile number or pay a small ₹12 fee.',
          'Uses a shortened or unofficial link instead of mahadiscom.in.',
          'Scammers use small payment links to install screen-sharing apps or steal bank details.',
        ],
        whatToDoNext: [
          'Do NOT call the mobile number or pay even ₹1 through that link.',
          'Check your real bill calmly on the official Mahavitaran app or your paper bill.',
          'Block the sender and inform your family caregiver.',
        ],
        simpleExplanation:
          'Your electricity will NOT be cut off tonight—this is a very common fake message sent to thousands of phones. Simply ignore and delete it without calling the number.',
        engine: 'local',
      },
      hi: {
        verdict: 'SCAM',
        riskScore: 95,
        scamCategory: 'नकली बिजली बिल काटने की ठगी',
        sourceAuthenticity:
          'बिजली विभाग (MSEB / महावितरण) कभी भी किसी निजी मोबाइल नंबर से रात को बिजली काटने की धमकी नहीं देता और न ही ₹12 का लिंक भेजता है।',
        redFlags: [
          'आज रात 9:30 बजे बिजली कटने का अचानक डर दिखाया गया है।',
          'अज्ञात मोबाइल नंबर पर कॉल करने या छोटा भुगतान करने को कहा गया है।',
          'आधिकारिक mahadiscom.in के बजाय संदिग्ध लिंक दिया गया है।',
          'ठग छोटे भुगतान के बहाने आपके फोन या बैंक खाते तक पहुंच बना लेते हैं।',
        ],
        whatToDoNext: [
          'दिए गए नंबर पर कॉल न करें और लिंक पर ₹1 भी न भेजें।',
          'अपना असली बिल केवल आधिकारिक बिजली ऐप या पुराने बिल से जांचें।',
          'इस संदेश को डिलीट करें और नंबर ब्लॉक कर दें।',
        ],
        simpleExplanation:
          'आज रात आपकी बिजली नहीं कटेगी—यह एक बहुत आम नकली संदेश है जो हजारों लोगों को भेजा जाता है। कृपया चिंता न करें और इस नंबर पर कॉल किए बिना संदेश डिलीट कर दें।',
        engine: 'local',
      },
      mr: {
        verdict: 'SCAM',
        riskScore: 95,
        scamCategory: 'बनावट वीज बिल कापण्याची फसवणूक',
        sourceAuthenticity:
          'महावितरण (MSEDCL) कधीही वैयक्तिक मोबाईल नंबरवरून रात्री वीज तोडण्याची धमकी देत नाही किंवा ₹12 भरण्यासाठी लिंक पाठवत नाही.',
        redFlags: [
          'आज रात्री 9:30 वाजता वीज कनेक्शन तोडण्याची भीती दाखवली आहे.',
          'अनोळखी मोबाईल नंबरवर कॉल करण्यास किंवा छोटी रक्कम भरण्यास सांगितले आहे.',
          'अधिकृत mahadiscom.in ऐवजी बनावट किंवा शॉर्ट लिंक दिली आहे.',
          'छोट्या पेमेंटच्या निमित्ताने फसवणूक करणारे बँक खात्याची माहिती चोरतात.',
        ],
        whatToDoNext: [
          'त्या नंबरवर कॉल करू नका आणि लिंकवर ₹1 देखील भरू नका.',
          'तुमचे खरे बिल फक्त अधिकृत महावितरण ॲपवर किंवा कागदी बिलावर तपासा.',
          'हा मेसेज डिलीट करा आणि तो नंबर ब्लॉक करा.',
        ],
        simpleExplanation:
          'आज रात्री तुमची वीज बंद होणार नाही—हा हजारो लोकांना पाठवला जाणारा एक बनावट मेसेज आहे. कृपया काळजी करू नका, त्या नंबरवर फोन न करता हा मेसेज डिलीट करा.',
        engine: 'local',
      },
    };
    return elecByLang[language];
  }

  // 4. Genuine Bank OTP / Informational Alert (No links, explicitly says "do not share")
  if (
    (text.includes('do not share') || text.includes('never share') || text.includes('not initiated by you')) &&
    !text.includes('http') &&
    !text.includes('bit.ly') &&
    !text.includes('click') &&
    !text.includes('blocked today') &&
    !text.includes('kyc expired') &&
    !text.includes('call manager') &&
    !text.includes('share the otp')
  ) {
    const safeOtpByLang: Record<Language, ScanResult> = {
      en: {
        verdict: 'SAFE',
        riskScore: 10,
        scamCategory: 'Legitimate Bank OTP / Alert Message',
        sourceAuthenticity:
          'This follows the standard format of a genuine Indian bank alert: it contains no external clickable links, asks for no callback to personal numbers, and explicitly warns you not to share the OTP.',
        redFlags: [
          'No suspicious web links or urgent threats detected.',
          'Correctly reminds you never to share the OTP with anyone.',
        ],
        whatToDoNext: [
          'Use this OTP ONLY if you yourself are logging in or making a payment right now.',
          'If you did NOT request this OTP, simply ignore it and never read it aloud to any caller.',
        ],
        simpleExplanation:
          'This message looks like a normal, genuine notification from your bank. Just remember to keep the OTP number strictly to yourself and never share it over a phone call.',
        engine: 'local',
      },
      hi: {
        verdict: 'SAFE',
        riskScore: 10,
        scamCategory: 'असली बैंक OTP / सूचना संदेश',
        sourceAuthenticity:
          'यह असली भारतीय बैंक के मानक संदेश जैसा दिखता है: इसमें कोई संदिग्ध लिंक नहीं है और यह आपको OTP किसी से साझा न करने की चेतावनी देता है।',
        redFlags: [
          'कोई संदिग्ध वेबसाइट लिंक या धमकी नहीं मिली।',
          'संदेश खुद आपको OTP गुप्त रखने की सलाह देता है।',
        ],
        whatToDoNext: [
          'यदि आप खुद अभी कोई भुगतान या लॉगिन कर रहे हैं, तभी इस OTP का उपयोग करें।',
          'यदि आपने यह OTP नहीं मंगाया है, तो इसे अनदेखा करें और किसी को फोन पर न बताएं।',
        ],
        simpleExplanation:
          'यह संदेश बैंक की सामान्य और असली सूचना जैसा लग रहा है। बस इतना ध्यान रखें कि यह OTP संख्या कभी किसी को फोन पर न बताएं।',
        engine: 'local',
      },
      mr: {
        verdict: 'SAFE',
        riskScore: 10,
        scamCategory: 'अधिकृत बँक OTP / सूचना मेसेज',
        sourceAuthenticity:
          'हा खऱ्या भारतीय बँकेच्या नेहमीच्या मेसेजसारखा आहे: यात कोणतीही संशयास्पद लिंक नाही आणि हा मेसेज स्वतः OTP कोणालाही न सांगण्याची सूचना देतो.',
        redFlags: [
          'कोणतीही संशयास्पद वेबसाइट लिंक किंवा धमकी आढळली नाही.',
          'मेसेज स्वतः तुम्हाला OTP गुप्त ठेवण्यास सांगतो.',
        ],
        whatToDoNext: [
          'तुम्ही स्वतः आता पेमेंट किंवा लॉगिन करत असाल तरच हा OTP वापरा.',
          'तुम्ही हा OTP मागवला नसेल, तर त्याकडे दुर्लक्ष करा आणि कोणालाही फोनवर सांगू नका.',
        ],
        simpleExplanation:
          'हा मेसेज तुमच्या बँकेकडून आलेली सामान्य आणि खरी सूचना दिसत आहे. फक्त हा OTP क्रमांक कधीही कोणालाही फोनवरून सांगू नका.',
        engine: 'local',
      },
    };
    return safeOtpByLang[language];
  }

  // 5. Bank KYC / OTP Theft / Cashback / UPI Collect / Lottery / Wedding APK
  if (
    text.includes('kyc') ||
    text.includes('blocked') ||
    text.includes('suspended') ||
    text.includes('otp') ||
    text.includes('pin') ||
    text.includes('cashback') ||
    text.includes('lottery') ||
    text.includes('prize') ||
    text.includes('won') ||
    text.includes('.apk') ||
    text.includes('wedding') ||
    text.includes('bit.ly') ||
    text.includes('http') ||
    text.includes('pan card') ||
    text.includes('bank manager') ||
    text.includes('pension')
  ) {
    const kycByLang: Record<Language, ScanResult> = {
      en: {
        verdict: 'SCAM',
        riskScore: 94,
        scamCategory: 'Fake KYC / Bank Impersonation Scam',
        sourceAuthenticity:
          'Banks and government agencies NEVER ask for your OTP, ATM PIN, UPI PIN, or KYC updates through SMS links, WhatsApp messages, or unsolicited phone calls.',
        redFlags: [
          'Tries to scare you with account blocking or tempt you with fake rewards.',
          'Asks you to click an unverified link, open an APK file, or read out an OTP.',
          'Genuine KYC updates happen inside your bank branch or official verified banking app.',
        ],
        whatToDoNext: [
          'Do NOT share any OTP, PIN, Aadhaar, or PAN details.',
          'Do NOT click any link or install any file sent by this person.',
          'Call your bank using the official number printed on the back of your debit card or passbook.',
        ],
        simpleExplanation:
          'This has strong signs of a banking scam trying to rush you into sharing private details. Your bank account is safe—please ignore this request and talk to your family or bank branch if you want to double-check.',
        engine: 'local',
      },
      hi: {
        verdict: 'SCAM',
        riskScore: 94,
        scamCategory: 'नकली KYC / बैंक ठगी का प्रयास',
        sourceAuthenticity:
          'बैंक या सरकारी विभाग कभी भी SMS लिंक, व्हाट्सएप या फोन कॉल पर आपका OTP, PIN या KYC अपडेट नहीं मांगते।',
        redFlags: [
          'खाता बंद होने का डर या नकली कैशबैक/इनाम का लालच दिया जा रहा है।',
          'अज्ञात लिंक पर क्लिक करने या OTP बताने को कहा जा रहा है।',
          'असली KYC हमेशा आपकी बैंक शाखा या आधिकारिक ऐप के अंदर ही होती है।',
        ],
        whatToDoNext: [
          'अपना OTP, UPI PIN, आधार या पैन की जानकारी बिल्कुल साझा न करें।',
          'किसी भी अनजान लिंक या APK फाइल पर क्लिक न करें।',
          'संदेह होने पर अपनी पासबुक या एटीएम कार्ड के पीछे लिखे आधिकारिक नंबर पर कॉल करें।',
        ],
        simpleExplanation:
          'इस संदेश में बैंक ठगी के साफ संकेत हैं जो आपको जल्दबाजी में गलती करवाना चाहते हैं। आपका खाता सुरक्षित है—कृपया इसे अनदेखा करें और जरूरत हो तो अपने परिवार या बैंक शाखा से पूछें।',
        engine: 'local',
      },
      mr: {
        verdict: 'SCAM',
        riskScore: 94,
        scamCategory: 'बनावट KYC / बँक फसवणूक',
        sourceAuthenticity:
          'बँका किंवा सरकारी कार्यालये कधीही SMS लिंक, व्हॉट्सॲप किंवा फोन कॉलवर तुमचा OTP, PIN किंवा KYC अपडेट मागत नाहीत.',
        redFlags: [
          'खाते बंद होण्याची भीती किंवा खोट्या बक्षिसाचे आमिष दाखवले जात आहे.',
          'अनोळखी लिंकवर क्लिक करण्यास किंवा OTP सांगण्यास सांगितले आहे.',
          'खरे KYC नेहमी तुमच्या बँक शाखेत किंवा अधिकृत बँक ॲपमध्येच होते.',
        ],
        whatToDoNext: [
          'तुमचा OTP, UPI PIN, आधार किंवा पॅन माहिती कोणालाही देऊ नका.',
          'कोणत्याही अनोळखी लिंकवर किंवा APK फाईलवर क्लिक करू नका.',
          'खात्री करण्यासाठी तुमच्या पासबुकवर किंवा एटीएम कार्डमागे असलेल्या अधिकृत नंबरवर कॉल करा.',
        ],
        simpleExplanation:
          'यामध्ये तुम्हाला घाईत चूक करायला लावणाऱ्या बँक फसवणुकीची स्पष्ट लक्षणे आहेत. तुमचे खाते सुरक्षित आहे—कृपया याकडे दुर्लक्ष करा आणि हवे असल्यास कुटुंबाशी किंवा बँक शाखेत बोला.',
        engine: 'local',
      },
    };
    return kycByLang[language];
  }

  // 6. Default Caution for ambiguous/unverified input
  const cautionByLang: Record<Language, ScanResult> = {
    en: {
      verdict: 'CAUTION',
      riskScore: 52,
      scamCategory: 'Unverified Contact — Proceed Carefully',
      sourceAuthenticity:
        'We could not verify an official bank or government sender in this message. Treat unexpected requests from unknown numbers carefully.',
      redFlags: [
        'Sender identity cannot be independently verified from this text alone.',
        'Never send money, share OTPs, or enter your UPI PIN for an unexpected message.',
      ],
      whatToDoNext: [
        'Verify with the sender using a phone number you already saved earlier.',
        'Ask a trusted family member to look at it before taking any action.',
      ],
      simpleExplanation:
        'This does not show a classic fraud script yet, but the sender is unverified. Please pause and confirm with a family member before replying or sending any money.',
      engine: 'local',
    },
    hi: {
      verdict: 'CAUTION',
      riskScore: 52,
      scamCategory: 'असत्यापित संदेश — सावधानी रखें',
      sourceAuthenticity:
        'इस संदेश में किसी आधिकारिक बैंक या सरकारी संस्था की पुष्टि नहीं हो सकी। अनजान नंबर से आए अनुरोधों पर सावधानी बरतें।',
      redFlags: [
        'भेजने वाले की असली पहचान की पुष्टि नहीं हो पाई है।',
        'अनजान संदेश पर कभी पैसे न भेजें और न ही OTP/PIN साझा करें।',
      ],
      whatToDoNext: [
        'पहले से सेव किए गए नंबर पर कॉल करके खुद पुष्टि करें।',
        'कोई भी कदम उठाने से पहले परिवार के किसी सदस्य को यह संदेश दिखाएं।',
      ],
      simpleExplanation:
        'इसमें अभी स्पष्ट ठगी का पैटर्न नहीं दिखा, लेकिन भेजने वाले की पहचान पक्की नहीं है। कृपया जवाब देने या पैसे भेजने से पहले परिवार से सलाह लें।',
      engine: 'local',
    },
    mr: {
      verdict: 'CAUTION',
      riskScore: 52,
      scamCategory: 'अनोळखी संदेश — सावधगिरी बाळगा',
      sourceAuthenticity:
        'या मेसेजमध्ये कोणत्याही अधिकृत बँकेची किंवा सरकारी संस्थेची खात्री होत नाही. अनोळखी नंबरवरून आलेल्या विनंतीबाबत सावध राहा.',
      redFlags: [
        'पाठवणाऱ्याची खरी ओळख या मजकुरातून स्पष्ट होत नाही.',
        'अनोळखी मेसेजवर कधीही पैसे पाठवू नका किंवा OTP/PIN सांगू नका.',
      ],
      whatToDoNext: [
        'तुमच्याकडे आधीपासून सेव्ह असलेल्या नंबरवर फोन करून खात्री करा.',
        'कोणतीही कृती करण्यापूर्वी कुटुंबातील सदस्याला हा मेसेज दाखवा.',
      ],
      simpleExplanation:
        'यामध्ये थेट फसवणुकीचे स्पष्ट चिन्ह नसले तरी पाठवणाऱ्याची ओळख खात्रीशीर नाही. कृपया उत्तर देण्यापूर्वी किंवा पैसे पाठवण्यापूर्वी कुटुंबाचा सल्ला घ्या.',
      engine: 'local',
    },
  };
  return cautionByLang[language];
}
