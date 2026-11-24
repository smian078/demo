import type { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  desktopToggleMobile: string;
  desktopToggleFull: string;
  textSizeLabel: string;
  textSizeActive: string;
  listen: string;
  stopListening: string;
  tabs: {
    home: string;
    scan: string;
    practice: string;
    alerts: string;
    family: string;
  };
  home: {
    greeting: string;
    greetingSub: string;
    protectionActive: string;
    lastChecked: string;
    heroTitle: string;
    heroSubtitle: string;
    quickMessage: string;
    quickLink: string;
    quickScreenshot: string;
    quickCall: string;
    radarHeading: string;
    radarLocation: string;
    viewAllAlerts: string;
    dailyTipHeading: string;
    emergencyTitle: string;
    emergencyDesc: string;
    call1930: string;
    caregiverNudgeLabel: string;
    tryNow: string;
    dismiss: string;
  };
  scan: {
    title: string;
    subtitle: string;
    modes: {
      message: string;
      link: string;
      screenshot: string;
      call: string;
    };
    messagePlaceholder: string;
    linkPlaceholder: string;
    callPlaceholder: string;
    trySample: string;
    uploadScreenshot: string;
    uploadHint: string;
    loadSampleScreenshot: string;
    changeScreenshot: string;
    micStart: string;
    micStop: string;
    micListening: string;
    scanButton: string;
    scanningTitle: string;
    pipelineSteps: string[];
    verdictSafe: string;
    verdictCaution: string;
    verdictScam: string;
    riskScoreLabel: string;
    listenExplanation: string;
    sourceCheckTitle: string;
    redFlagsTitle: string;
    whatToDoTitle: string;
    report1930: string;
    notifyFamily: string;
    familyNotified: string;
    scanAnother: string;
    urlBreakdownTitle: string;
    protocolLabel: string;
    domainLabel: string;
    statusLabel: string;
    officialVerified: string;
    lookalikeWarning: string;
    emptyInputError: string;
  };
  practice: {
    title: string;
    subtitle: string;
    tabSimulations: string;
    tabGuides: string;
    completed: string;
    startPractice: string;
    replayPractice: string;
    openGuide: string;
    backToList: string;
    pointsEarned: string;
    sim1Title: string;
    sim1Desc: string;
    sim2Title: string;
    sim2Desc: string;
    sim3Title: string;
    sim3Desc: string;
    quickCheckTitle: string;
    doLabel: string;
    dontLabel: string;
    nextSlide: string;
    prevSlide: string;
    takeQuickCheck: string;
    moduleCompletedMsg: string;
  };
  alerts: {
    title: string;
    subtitle: string;
    locationLabel: string;
    filterRecent: string;
    filterCommon: string;
    filterAll: string;
    howToProtect: string;
    hideTip: string;
    severityHigh: string;
    severityMedium: string;
    helplineTitle: string;
    helplineSubtitle: string;
    helpline1930Title: string;
    helpline1930Desc: string;
    copyNumber: string;
    copied: string;
    callNow: string;
    portalTitle: string;
    portalChecklistTitle: string;
    portalSteps: string[];
    bankFreezeTitle: string;
    familyContactTitle: string;
    familyContactName: string;
    familyContactPhone: string;
  };
  family: {
    title: string;
    subtitle: string;
    seniorViewNotice: string;
    caregiverUnlocked: string;
    switchToCaregiver: string;
    lockCaregiver: string;
    pinPrompt: string;
    pinHint: string;
    unlockBtn: string;
    wrongPin: string;
    readinessTitle: string;
    readinessSubtitle: string;
    simsCompleted: string;
    guidesCompleted: string;
    recentActivityTitle: string;
    recentActivityEmpty: string;
    caregiverAlertedBadge: string;
    guardrailsTitle: string;
    guardrailInstant: string;
    guardrailInstantDesc: string;
    guardrailWeekly: string;
    guardrailWeeklyDesc: string;
    guardrailLinks: string;
    guardrailLinksDesc: string;
    guardrailCalls: string;
    guardrailCallsDesc: string;
    nudgeTitle: string;
    nudgeSubtitle: string;
    nudgePlaceholder: string;
    nudgeAssignLabel: string;
    nudgeSendBtn: string;
    nudgeSentToast: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'Suraksha Sathi',
    tagline: 'Your Trusted Digital Safety Companion',
    desktopToggleMobile: 'Mobile Frame',
    desktopToggleFull: 'Full View',
    textSizeLabel: 'A+',
    textSizeActive: 'Large Text',
    listen: 'Listen',
    stopListening: 'Stop',
    tabs: {
      home: 'Home',
      scan: 'Scan',
      practice: 'Practice',
      alerts: 'Alerts',
      family: 'Family',
    },
    home: {
      greeting: 'Namaste!',
      greetingSub: 'You are protected today. Take your time and check anything that feels rushed or unusual.',
      protectionActive: 'Protection Active',
      lastChecked: 'Shield checked 2 mins ago',
      heroTitle: 'Is This Safe? Check Now',
      heroSubtitle: 'Paste any message, link, screenshot, or call claim for calm, clear guidance.',
      quickMessage: 'Check Message',
      quickLink: 'Check Link',
      quickScreenshot: 'Scan Screenshot',
      quickCall: 'Check Call',
      radarHeading: 'Happening Near You',
      radarLocation: 'Nagpur, Maharashtra',
      viewAllAlerts: 'View All Alerts',
      dailyTipHeading: 'Daily 1-Minute Safety Tip',
      emergencyTitle: 'Got Scammed or Lost Money?',
      emergencyDesc: 'Call National Cyber Crime Helpline 1930 immediately within the golden hour to freeze fraud transfers.',
      call1930: 'Call 1930 Now',
      caregiverNudgeLabel: 'Message from Family Caregiver',
      tryNow: 'Start Suggested Practice',
      dismiss: 'Got it',
    },
    scan: {
      title: 'Is This Safe?',
      subtitle: 'Check suspicious messages, links, screenshots, or phone calls before taking any action.',
      modes: {
        message: 'Message / SMS',
        link: 'Website Link',
        screenshot: 'Screenshot',
        call: 'Call / Voice',
      },
      messagePlaceholder: 'Paste the SMS or WhatsApp message here...',
      linkPlaceholder: 'Paste website link (e.g. http://sbi-kyc-update-fast.xyz)',
      callPlaceholder: 'Type or speak what the caller is claiming (e.g. "Caller says I am under digital arrest...")',
      trySample: 'Try a realistic example:',
      uploadScreenshot: 'Upload WhatsApp / SMS / Payment Screenshot',
      uploadHint: 'Tap here to choose a photo from your phone',
      loadSampleScreenshot: 'Load Sample Scam Screenshot',
      changeScreenshot: 'Choose Different Image',
      micStart: 'Speak Caller Claims',
      micStop: 'Stop Listening',
      micListening: 'Listening carefully... speak what the caller said',
      scanButton: 'Scan & Verify Now',
      scanningTitle: 'Checking carefully for your safety...',
      pipelineSteps: [
        'Reading text, image & voice cues...',
        'Inspecting sender identity & domain authenticity...',
        'Cross-checking against Indian cybercrime patterns...',
        'Generating calm, clear safety guidance...',
      ],
      verdictSafe: 'LOOKS SAFE',
      verdictCaution: 'PROCEED WITH CAUTION',
      verdictScam: 'HIGH RISK SCAM',
      riskScoreLabel: 'Risk Score',
      listenExplanation: 'Listen to Explanation',
      sourceCheckTitle: 'Source & Authenticity Check',
      redFlagsTitle: 'Warning Signs Found',
      whatToDoTitle: 'What You Should Do Right Now',
      report1930: 'Report to 1930',
      notifyFamily: 'Notify Family Caregiver',
      familyNotified: 'Caregiver Notified in Family Tab',
      scanAnother: 'Check Another Item',
      urlBreakdownTitle: 'Link Structure Check',
      protocolLabel: 'Connection',
      domainLabel: 'Website Name',
      statusLabel: 'Verification',
      officialVerified: 'Recognized Official Indian Site',
      lookalikeWarning: 'Warning: Lookalike / Unverified Link',
      emptyInputError: 'Please paste text, enter a link, or load a screenshot before scanning.',
    },
    practice: {
      title: 'Safe Practice Lab',
      subtitle: 'Practice spotting real Indian scams with zero risk and earn safety confidence.',
      tabSimulations: 'Interactive Simulations',
      tabGuides: 'Audio-Visual Guides',
      completed: 'Completed',
      startPractice: 'Start Practice',
      replayPractice: 'Practice Again',
      openGuide: 'Open Guide',
      backToList: 'Back to Practice Lab',
      pointsEarned: 'Safety Points',
      sim1Title: 'Incoming Scam Call Simulator',
      sim1Desc: 'Answer a fake Bank KYC / Digital Arrest call and practice staying calm and safe.',
      sim2Title: 'Suspicious WhatsApp / SMS Inspector',
      sim2Desc: 'Spot the hidden red flags inside an urgent electricity disconnection chat.',
      sim3Title: 'Mock Banking & UPI Safe Sandbox',
      sim3Desc: 'Learn why you NEVER enter your UPI PIN to receive cashback or money.',
      quickCheckTitle: '1-Question Quick Check',
      doLabel: 'DO THIS',
      dontLabel: 'NEVER DO THIS',
      nextSlide: 'Next Step',
      prevSlide: 'Previous',
      takeQuickCheck: 'Take Quick Check',
      moduleCompletedMsg: 'Well done! You completed this safety guide and boosted your Readiness Score.',
    },
    alerts: {
      title: 'Local Scam Radar & Help',
      subtitle: 'Stay informed about active frauds near you and reach emergency helplines in one tap.',
      locationLabel: 'Your City / Region',
      filterRecent: 'Recent (This Week)',
      filterCommon: 'Most Common',
      filterAll: 'All Time',
      howToProtect: 'How to Protect Yourself',
      hideTip: 'Hide Tip',
      severityHigh: 'High Risk Alert',
      severityMedium: 'Caution Alert',
      helplineTitle: 'Emergency Helplines & Bank Freeze',
      helplineSubtitle: 'Keep these official Indian numbers handy for immediate help.',
      helpline1930Title: 'National Cyber Crime Helpline',
      helpline1930Desc: '24×7 Toll-Free Government Emergency Number. Call immediately if money is debited.',
      copyNumber: 'Copy Number',
      copied: 'Copied',
      callNow: 'Call 1930',
      portalTitle: 'National Cyber Crime Portal (cybercrime.gov.in)',
      portalChecklistTitle: 'Keep these 3 details ready when reporting:',
      portalSteps: [
        'Screenshot of the scam SMS, WhatsApp chat, or caller mobile number.',
        'Bank transaction UTR / Reference ID and exact time & amount lost.',
        'Your Bank Account / UPI ID and registered mobile number.',
      ],
      bankFreezeTitle: 'Instant Bank Card & UPI Freeze Numbers',
      familyContactTitle: 'Saved Emergency Family Contact',
      familyContactName: 'Rohit (Son / Primary Caregiver)',
      familyContactPhone: '+91 98230 44120',
    },
    family: {
      title: 'Family Caregiver Mode',
      subtitle: 'Reassuring oversight so family members can support their elders calmly.',
      seniorViewNotice: 'Currently in Protected Senior View. Unlock Caregiver Dashboard to review logs & settings.',
      caregiverUnlocked: 'Caregiver View Active',
      switchToCaregiver: 'Switch to Caregiver View',
      lockCaregiver: 'Return to Senior View',
      pinPrompt: 'Enter 4-Digit Caregiver PIN',
      pinHint: 'Demo PIN: 1234 (or tap Quick Switch below)',
      unlockBtn: 'Unlock Dashboard',
      wrongPin: 'Incorrect PIN. Please use demo PIN 1234.',
      readinessTitle: 'Digital Safety Readiness Score',
      readinessSubtitle: 'Updates live as practice simulations and learning guides are completed.',
      simsCompleted: 'Simulations',
      guidesCompleted: 'Guides',
      recentActivityTitle: 'Recent Scanner Activity Log',
      recentActivityEmpty: 'No scans logged yet. Run a check in the Scan tab to see live updates here.',
      caregiverAlertedBadge: 'Family Alerted',
      guardrailsTitle: 'Safety Guardrails & Preferences',
      guardrailInstant: 'Instant WhatsApp/SMS Alert on High-Risk Scan',
      guardrailInstantDesc: 'Notify family immediately when a high-risk scam is detected.',
      guardrailWeekly: 'Weekly Learning Summary',
      guardrailWeeklyDesc: 'Send a gentle Sunday report of completed guides and simulations.',
      guardrailLinks: 'Auto-Warn on Unknown Links',
      guardrailLinksDesc: 'Show an extra verification prompt before opening unfamiliar web links.',
      guardrailCalls: 'Strict Mode for Unknown Calls',
      guardrailCallsDesc: 'Remind senior never to share OTPs during calls from unsaved numbers.',
      nudgeTitle: 'Send Encouraging Nudge',
      nudgeSubtitle: 'Appears warmly on the Home screen to encourage a quick 1-minute practice.',
      nudgePlaceholder: 'Write a warm note (e.g., "Great job staying safe, Baba! Try the UPI practice today.")',
      nudgeAssignLabel: 'Attach a quick practice:',
      nudgeSendBtn: 'Send Nudge to Home Screen',
      nudgeSentToast: 'Sent! Your encouraging note is now live on the Home screen.',
    },
  },
  hi: {
    appName: 'सुरक्षा साथी',
    tagline: 'आपका विश्वसनीय डिजिटल सुरक्षा सहयोगी',
    desktopToggleMobile: 'मोबाइल फ्रेम',
    desktopToggleFull: 'फुल व्यू',
    textSizeLabel: 'A+',
    textSizeActive: 'बड़े अक्षर',
    listen: 'सुनें',
    stopListening: 'रोकें',
    tabs: {
      home: 'होम',
      scan: 'जांचें',
      practice: 'अभ्यास',
      alerts: 'अलर्ट',
      family: 'परिवार',
    },
    home: {
      greeting: 'नमस्ते!',
      greetingSub: 'आप आज पूरी तरह सुरक्षित हैं। किसी भी जल्दबाजी वाले संदेश या कॉल की पहले जांच करें।',
      protectionActive: 'सुरक्षा चालू है',
      lastChecked: '2 मिनट पहले जांचा गया',
      heroTitle: 'क्या यह सुरक्षित है? अभी जांचें',
      heroSubtitle: 'कोई भी संदेश, लिंक, स्क्रीनशॉट या कॉल की बात यहां जांचें और शांत सलाह पाएं।',
      quickMessage: 'संदेश जांचें',
      quickLink: 'लिंक जांचें',
      quickScreenshot: 'स्क्रीनशॉट जांचें',
      quickCall: 'कॉल जांचें',
      radarHeading: 'आपके शहर के ताज़ा अलर्ट',
      radarLocation: 'नागपुर, महाराष्ट्र',
      viewAllAlerts: 'सभी अलर्ट देखें',
      dailyTipHeading: 'आज की 1-मिनट सुरक्षा सलाह',
      emergencyTitle: 'क्या धोखाधड़ी हुई या पैसे कट गए?',
      emergencyDesc: 'पैसे वापस पाने के लिए तुरंत राष्ट्रीय साइबर क्राइम हेल्पलाइन 1930 पर कॉल करें।',
      call1930: 'अभी 1930 पर कॉल करें',
      caregiverNudgeLabel: 'परिवार की ओर से संदेश',
      tryNow: 'अभ्यास शुरू करें',
      dismiss: 'ठीक है',
    },
    scan: {
      title: 'क्या यह सुरक्षित है?',
      subtitle: 'कोई भी कदम उठाने से पहले संदिग्ध संदेश, लिंक, फोटो या कॉल की जांच करें।',
      modes: {
        message: 'संदेश / SMS',
        link: 'वेबसाइट लिंक',
        screenshot: 'स्क्रीनशॉट',
        call: 'कॉल / आवाज़',
      },
      messagePlaceholder: 'अपना SMS या व्हाट्सएप संदेश यहां पेस्ट करें...',
      linkPlaceholder: 'वेबसाइट लिंक लिखें (जैसे http://sbi-kyc-update-fast.xyz)',
      callPlaceholder: 'कॉल करने वाला क्या कह रहा है, यहां लिखें या बोलें...',
      trySample: 'असली जैसा उदाहरण आज़माएं:',
      uploadScreenshot: 'व्हाट्सएप / SMS / पेमेंट का स्क्रीनशॉट चुनें',
      uploadHint: 'अपने फोन से फोटो चुनने के लिए यहां टैप करें',
      loadSampleScreenshot: 'नमूना ठगी स्क्रीनशॉट लोड करें',
      changeScreenshot: 'दूसरी फोटो चुनें',
      micStart: 'कॉल की बात बोलकर बताएं',
      micStop: 'सुनना बंद करें',
      micListening: 'ध्यान से सुन रहे हैं... कॉलर ने जो कहा वह बोलें',
      scanButton: 'अभी जांचें और सत्यापित करें',
      scanningTitle: 'आपकी सुरक्षा के लिए जांच की जा रही है...',
      pipelineSteps: [
        'संदेश, फोटो और आवाज़ के संकेत पढ़े जा रहे हैं...',
        'भेजने वाले की पहचान और वेबसाइट की असलियत जांची जा रही है...',
        'भारतीय साइबर ठगी के पैटर्न से मिलान किया जा रहा है...',
        'आपके लिए सरल और सुरक्षित मार्गदर्शन तैयार हो रहा है...',
      ],
      verdictSafe: 'सुरक्षित लगता है',
      verdictCaution: 'सावधानी बरतें',
      verdictScam: 'खतरनाक ठगी (SCAM)',
      riskScoreLabel: 'जोखिम स्तर',
      listenExplanation: 'सलाह सुनें',
      sourceCheckTitle: 'भेजने वाले की असलियत की जांच',
      redFlagsTitle: 'खतरे के संकेत मिले',
      whatToDoTitle: 'आपको अभी क्या करना चाहिए',
      report1930: '1930 पर रिपोर्ट करें',
      notifyFamily: 'परिवार को सूचित करें',
      familyNotified: 'परिवार टैब में सूचना भेज दी गई',
      scanAnother: 'दूसरी चीज़ जांचें',
      urlBreakdownTitle: 'लिंक की जांच',
      protocolLabel: 'कनेक्शन',
      domainLabel: 'वेबसाइट का नाम',
      statusLabel: 'सत्यापन',
      officialVerified: 'असली भारतीय आधिकारिक वेबसाइट',
      lookalikeWarning: 'चेतावनी: नकली या असत्यापित लिंक',
      emptyInputError: 'कृपया जांच से पहले कोई संदेश, लिंक या स्क्रीनशॉट चुनें।',
    },
    practice: {
      title: 'सुरक्षित अभ्यास केंद्र',
      subtitle: 'बिना किसी जोखिम के असली जैसी ठगी को पहचानने का अभ्यास करें।',
      tabSimulations: 'इंटरैक्टिव अभ्यास',
      tabGuides: 'ऑडियो-विजुअल गाइड',
      completed: 'पूरा हुआ',
      startPractice: 'अभ्यास शुरू करें',
      replayPractice: 'फिर से अभ्यास करें',
      openGuide: 'गाइड खोलें',
      backToList: 'अभ्यास केंद्र पर वापस जाएं',
      pointsEarned: 'सुरक्षा अंक',
      sim1Title: 'नकली कॉल अभ्यास (Bank KYC / डिजिटल अरेस्ट)',
      sim1Desc: 'नकली अधिकारी के फोन पर शांत रहकर सही फैसला लेने का अभ्यास करें।',
      sim2Title: 'संदिग्ध व्हाट्सएप / SMS जांच',
      sim2Desc: 'बिजली काटने की धमकी वाले फर्जी संदेश में खतरे के निशान पहचानें।',
      sim3Title: 'नकली बैंकिंग और UPI सुरक्षित अभ्यास',
      sim3Desc: 'सीखें कि पैसे या कैशबैक पाने के लिए कभी UPI PIN क्यों नहीं डालना चाहिए।',
      quickCheckTitle: '1-सवाल त्वरित जांच',
      doLabel: 'यह करें',
      dontLabel: 'यह कभी न करें',
      nextSlide: 'अगला कदम',
      prevSlide: 'पिछला',
      takeQuickCheck: 'त्वरित जांच दें',
      moduleCompletedMsg: 'शाबाश! आपने यह सुरक्षा गाइड पूरा कर लिया और आपका सुरक्षा स्कोर बढ़ गया है।',
    },
    alerts: {
      title: 'स्थानीय ठगी अलर्ट और मदद',
      subtitle: 'अपने शहर में चल रही नई ठगी के बारे में जानें और तुरंत हेल्पलाइन पाएं।',
      locationLabel: 'अपना शहर / क्षेत्र चुनें',
      filterRecent: 'ताज़ा (इस सप्ताह)',
      filterCommon: 'सबसे आम',
      filterAll: 'सभी अलर्ट',
      howToProtect: 'खुद को कैसे बचाएं',
      hideTip: 'सलाह छुपाएं',
      severityHigh: 'उच्च खतरा अलर्ट',
      severityMedium: 'सावधानी अलर्ट',
      helplineTitle: 'आपातकालीन हेल्पलाइन और बैंक फ्रीज़ नंबर',
      helplineSubtitle: 'तुरंत सहायता के लिए ये आधिकारिक नंबर हमेशा पास रखें।',
      helpline1930Title: 'राष्ट्रीय साइबर क्राइम हेल्पलाइन',
      helpline1930Desc: '24×7 निशुल्क सरकारी नंबर। पैसे कटने पर तुरंत कॉल करें।',
      copyNumber: 'नंबर कॉपी करें',
      copied: 'कॉपी हो गया',
      callNow: '1930 पर कॉल करें',
      portalTitle: 'राष्ट्रीय साइबर क्राइम पोर्टल (cybercrime.gov.in)',
      portalChecklistTitle: 'शिकायत करते समय ये 3 जानकारी तैयार रखें:',
      portalSteps: [
        'संदिग्ध SMS, व्हाट्सएप चैट या कॉलर के नंबर का स्क्रीनशॉट।',
        'बैंक ट्रांजैक्शन UTR / रेफरेंस नंबर, समय और कटी हुई राशि।',
        'आपका बैंक खाता / UPI ID और रजिस्टर्ड मोबाइल नंबर।',
      ],
      bankFreezeTitle: 'बैंक कार्ड और UPI तुरंत ब्लॉक करने के नंबर',
      familyContactTitle: 'सेव किया गया परिवार आपातकालीन नंबर',
      familyContactName: 'रोहित (बेटा / मुख्य केयरगिवर)',
      familyContactPhone: '+91 98230 44120',
    },
    family: {
      title: 'परिवार केयरगिवर मोड',
      subtitle: 'परिवार के सदस्यों के लिए शांत और सुरक्षित निगरानी डैशबोर्ड।',
      seniorViewNotice: 'अभी वरिष्ठ नागरिक व्यू चालू है। लॉग और सेटिंग्स देखने के लिए केयरगिवर डैशबोर्ड खोलें।',
      caregiverUnlocked: 'केयरगिवर व्यू सक्रिय है',
      switchToCaregiver: 'केयरगिवर व्यू में जाएं',
      lockCaregiver: 'सीनियर व्यू पर लौटें',
      pinPrompt: '4-अंकों का केयरगिवर PIN डालें',
      pinHint: 'डेमो PIN: 1234 (या नीचे सीधे स्विच दबाएं)',
      unlockBtn: 'डैशबोर्ड खोलें',
      wrongPin: 'गलत PIN। कृपया डेमो PIN 1234 का उपयोग करें।',
      readinessTitle: 'डिजिटल सुरक्षा तैयारी स्कोर',
      readinessSubtitle: 'अभ्यास और गाइड पूरा होते ही यह स्कोर तुरंत अपडेट होता है।',
      simsCompleted: 'अभ्यास पूरे',
      guidesCompleted: 'गाइड पूरे',
      recentActivityTitle: 'हाल की स्कैनर गतिविधि',
      recentActivityEmpty: 'अभी कोई जांच दर्ज नहीं है। लाइव अपडेट देखने के लिए "जांचें" टैब में स्कैन करें।',
      caregiverAlertedBadge: 'परिवार को सूचना दी गई',
      guardrailsTitle: 'सुरक्षा नियम और अलर्ट सेटिंग्स',
      guardrailInstant: 'उच्च जोखिम स्कैन पर तुरंत व्हाट्सएप/SMS अलर्ट',
      guardrailInstantDesc: 'जब कोई खतरनाक ठगी मिले तो परिवार को तुरंत सूचना दें।',
      guardrailWeekly: 'साप्ताहिक सीखने की रिपोर्ट',
      guardrailWeeklyDesc: 'हर रविवार को पूरे किए गए अभ्यास और गाइड का सारांश भेजें।',
      guardrailLinks: 'अनजान लिंक पर अतिरिक्त चेतावनी',
      guardrailLinksDesc: 'अपरिचित लिंक खोलने से पहले स्पष्ट चेतावनी दिखाएं।',
      guardrailCalls: 'अनजान कॉल के लिए सख्त सुरक्षा मोड',
      guardrailCallsDesc: 'अनजान नंबर पर OTP न बताने की याद दिलाएं।',
      nudgeTitle: 'प्रोत्साहन संदेश भेजें',
      nudgeSubtitle: 'यह संदेश होम स्क्रीन पर प्यार से दिखाई देगा और अभ्यास के लिए प्रेरित करेगा।',
      nudgePlaceholder: 'प्यार भरा संदेश लिखें (जैसे "बहुत बढ़िया पापा! आज UPI अभ्यास जरूर करें।")',
      nudgeAssignLabel: 'अभ्यास जोड़ें:',
      nudgeSendBtn: 'होम स्क्रीन पर संदेश भेजें',
      nudgeSentToast: 'भेजा गया! आपका संदेश अब होम स्क्रीन पर दिख रहा है।',
    },
  },
  mr: {
    appName: 'सुरक्षा साथी',
    tagline: 'तुमचा विश्वासार्ह डिजिटल सुरक्षा सोबती',
    desktopToggleMobile: 'मोबाईल फ्रेम',
    desktopToggleFull: 'फुल व्ह्यू',
    textSizeLabel: 'A+',
    textSizeActive: 'मोठी अक्षरे',
    listen: 'ऐका',
    stopListening: 'थांबवा',
    tabs: {
      home: 'होम',
      scan: 'तपासा',
      practice: 'सराव',
      alerts: 'अलर्ट',
      family: 'कुटुंब',
    },
    home: {
      greeting: 'नमस्कार!',
      greetingSub: 'तुम्ही आज सुरक्षित आहात. कोणताही घाईचा मेसेज किंवा कॉल आल्यास आधी तपासून घ्या.',
      protectionActive: 'संरक्षण सुरू आहे',
      lastChecked: '2 मिनिटांपूर्वी तपासले',
      heroTitle: 'हे सुरक्षित आहे का? आता तपासा',
      heroSubtitle: 'कोणताही मेसेज, लिंक, स्क्रीनशॉट किंवा कॉलची माहिती तपासा आणि सोप्या शब्दात सल्ला मिळवा.',
      quickMessage: 'मेसेज तपासा',
      quickLink: 'लिंक तपासा',
      quickScreenshot: 'स्क्रीनशॉट तपासा',
      quickCall: 'कॉल तपासा',
      radarHeading: 'तुमच्या शहरातले ताजे अलर्ट',
      radarLocation: 'नागपूर, महाराष्ट्र',
      viewAllAlerts: 'सर्व अलर्ट पहा',
      dailyTipHeading: 'आजची 1-मिनिट सुरक्षा टीप',
      emergencyTitle: 'फसवणूक झाली किंवा पैसे कापले गेले का?',
      emergencyDesc: 'पैसे थांबवण्यासाठी लगेच राष्ट्रीय सायबर क्राइम हेल्पलाइन 1930 वर कॉल करा.',
      call1930: 'आता 1930 वर कॉल करा',
      caregiverNudgeLabel: 'कुटुंबाकडून संदेश',
      tryNow: 'सुचवलेला सराव सुरू करा',
      dismiss: 'समजले',
    },
    scan: {
      title: 'हे सुरक्षित आहे का?',
      subtitle: 'कोणतीही कृती करण्यापूर्वी संशयास्पद मेसेज, लिंक, फोटो किंवा कॉल तपासा.',
      modes: {
        message: 'मेसेज / SMS',
        link: 'वेबसाइट लिंक',
        screenshot: 'स्क्रीनशॉट',
        call: 'कॉल / आवाज',
      },
      messagePlaceholder: 'तुमचा SMS किंवा व्हॉट्सॲप मेसेज येथे पेस्ट करा...',
      linkPlaceholder: 'वेबसाइट लिंक लिहा (उदा. http://sbi-kyc-update-fast.xyz)',
      callPlaceholder: 'कॉल करणारी व्यक्ती काय सांगत आहे ते येथे लिहा किंवा बोला...',
      trySample: 'खऱ्यासारखे उदाहरण तपासा:',
      uploadScreenshot: 'व्हॉट्सॲप / SMS / पेमेंटचा स्क्रीनशॉट अपलोड करा',
      uploadHint: 'तुमच्या फोनमधून फोटो निवडण्यासाठी येथे टॅप करा',
      loadSampleScreenshot: 'नमुना फसवा स्क्रीनशॉट लोड करा',
      changeScreenshot: 'दुसरा फोटो निवडा',
      micStart: 'कॉलची माहिती बोलून सांगा',
      micStop: 'ऐकणे थांबवा',
      micListening: 'लक्षपूर्वक ऐकत आहोत... कॉलर काय म्हणाला ते बोला',
      scanButton: 'आता तपासा आणि खात्री करा',
      scanningTitle: 'तुमच्या सुरक्षिततेसाठी तपासणी सुरू आहे...',
      pipelineSteps: [
        'मजकूर, फोटो आणि आवाजातील संकेत वाचत आहोत...',
        'पाठवणाऱ्याची ओळख आणि वेबसाइटची सत्यता तपासत आहोत...',
        'भारतीय सायबर फसवणुकीच्या पद्धतींशी पडताळणी सुरू आहे...',
        'तुमच्यासाठी सोपे आणि शांत मार्गदर्शन तयार होत आहे...',
      ],
      verdictSafe: 'सुरक्षित वाटते',
      verdictCaution: 'सावधगिरी बाळगा',
      verdictScam: 'धोकादायक फसवणूक (SCAM)',
      riskScoreLabel: 'धोका पातळी',
      listenExplanation: 'स्पष्टीकरण ऐका',
      sourceCheckTitle: 'स्रोत आणि सत्यता तपासणी',
      redFlagsTitle: 'आढळलेली धोक्याची चिन्हे',
      whatToDoTitle: 'तुम्ही आता काय करावे',
      report1930: '1930 वर तक्रार करा',
      notifyFamily: 'कुटुंबाला कळवा',
      familyNotified: 'कुटुंब टॅबमध्ये माहिती नोंदवली गेली',
      scanAnother: 'दुसरी गोष्ट तपासा',
      urlBreakdownTitle: 'लिंक रचना तपासणी',
      protocolLabel: 'कनेक्शन',
      domainLabel: 'वेबसाइटचे नाव',
      statusLabel: 'पडताळणी',
      officialVerified: 'अधिकृत भारतीय वेबसाइट',
      lookalikeWarning: 'इशारा: बनावट किंवा अनोळखी लिंक',
      emptyInputError: 'कृपया तपासणीपूर्वी मेसेज, लिंक किंवा स्क्रीनशॉट निवडा.',
    },
    practice: {
      title: 'सुरक्षित सराव केंद्र',
      subtitle: 'कोणत्याही धोक्याशिवाय फसवणूक ओळखण्याचा सराव करा आणि आत्मविश्वास वाढवा.',
      tabSimulations: 'प्रत्यक्ष सराव',
      tabGuides: 'ऑडिओ-व्हिज्युअल मार्गदर्शक',
      completed: 'पूर्ण झाले',
      startPractice: 'सराव सुरू करा',
      replayPractice: 'पुन्हा सराव करा',
      openGuide: 'मार्गदर्शक उघडा',
      backToList: 'सराव केंद्राकडे परत जा',
      pointsEarned: 'सुरक्षा गुण',
      sim1Title: 'बनावट कॉल सराव (बँक KYC / डिजिटल अरेस्ट)',
      sim1Desc: 'बनावट अधिकाऱ्याच्या कॉलवर शांत राहून सुरक्षित निर्णय घेण्याचा सराव करा.',
      sim2Title: 'संशयास्पद व्हॉट्सॲप / SMS तपासणी',
      sim2Desc: 'वीज तोडण्याच्या धमकीच्या खोट्या मेसेजमधील धोक्याची चिन्हे ओळखा.',
      sim3Title: 'बँकिंग आणि UPI सुरक्षित सराव',
      sim3Desc: 'पैसे किंवा कॅशबॅक मिळवण्यासाठी कधीही UPI PIN का टाकू नये ते शिका.',
      quickCheckTitle: '1-प्रश्न झटपट तपासणी',
      doLabel: 'हे करा',
      dontLabel: 'हे कधीही करू नका',
      nextSlide: 'पुढील पायरी',
      prevSlide: 'मागील',
      takeQuickCheck: 'झटपट तपासणी घ्या',
      moduleCompletedMsg: 'छान! तुम्ही हा सुरक्षा मार्गदर्शक पूर्ण केला आणि तुमचा तयारी स्कोर वाढला आहे.',
    },
    alerts: {
      title: 'स्थानिक फसवणूक रडार आणि मदत',
      subtitle: 'तुमच्या भागातील ताज्या सायबर धोक्यांची माहिती घ्या आणि हेल्पलाइनवर लगेच संपर्क साधा.',
      locationLabel: 'तुमचे शहर / विभाग',
      filterRecent: 'ताजे (या आठवड्यातील)',
      filterCommon: 'सर्वाधिक सामान्य',
      filterAll: 'सर्व अलर्ट',
      howToProtect: 'स्वतःचे रक्षण कसे करावे',
      hideTip: 'टीप लपवा',
      severityHigh: 'अति धोका इशारा',
      severityMedium: 'सावधगिरी इशारा',
      helplineTitle: 'आणीबाणी हेल्पलाइन आणि बँक फ्रीझ नंबर',
      helplineSubtitle: 'तात्काळ मदतीसाठी हे अधिकृत नंबर नेहमी जवळ ठेवा.',
      helpline1930Title: 'राष्ट्रीय सायबर क्राइम हेल्पलाइन',
      helpline1930Desc: '24×7 मोफत सरकारी मदत क्रमांक. पैसे कापले गेल्यास लगेच कॉल करा.',
      copyNumber: 'नंबर कॉपी करा',
      copied: 'कॉपी झाले',
      callNow: '1930 वर कॉल करा',
      portalTitle: 'राष्ट्रीय सायबर क्राइम पोर्टल (cybercrime.gov.in)',
      portalChecklistTitle: 'तक्रार करताना या 3 गोष्टी तयार ठेवा:',
      portalSteps: [
        'फसव्या SMS, व्हॉट्सॲप चॅट किंवा कॉलरच्या नंबरचा स्क्रीनशॉट.',
        'बँक व्यवहाराचा UTR / रेफरन्स नंबर, वेळ आणि गेलेली रक्कम.',
        'तुमचे बँक खाते / UPI ID आणि नोंदणीकृत मोबाईल नंबर.',
      ],
      bankFreezeTitle: 'बँक कार्ड आणि UPI तात्काळ बंद करण्याचे नंबर',
      familyContactTitle: 'जतन केलेला कुटुंब आणीबाणी संपर्क',
      familyContactName: 'रोहित (मुलगा / मुख्य केअरगिव्हर)',
      familyContactPhone: '+91 98230 44120',
    },
    family: {
      title: 'कुटुंब केअरगिव्हर मोड',
      subtitle: 'ज्येष्ठ नागरिकांच्या सुरक्षिततेसाठी कुटुंबासाठी शांत आणि सोपे डॅशबोर्ड.',
      seniorViewNotice: 'सध्या ज्येष्ठ नागरिक व्ह्यू सुरू आहे. लॉग आणि सेटिंग्ज पाहण्यासाठी केअरगिव्हर डैशबोर्ड उघडा.',
      caregiverUnlocked: 'केअरगिव्हर व्ह्यू सुरू आहे',
      switchToCaregiver: 'केअरगिव्हर व्ह्यूवर जा',
      lockCaregiver: 'ज्येष्ठ व्ह्यूवर परत जा',
      pinPrompt: '4-अंकी केअरगिव्हर PIN टाका',
      pinHint: 'डेमो PIN: 1234 (किंवा खाली थेट स्विच दाबा)',
      unlockBtn: 'डैशबोर्ड उघडा',
      wrongPin: 'चुकीचा PIN. कृपया डेमो PIN 1234 वापरा.',
      readinessTitle: 'डिजिटल सुरक्षा तयारी स्कोर',
      readinessSubtitle: 'सराव आणि मार्गदर्शक पूर्ण होताच हा स्कोर लगेच अपडेट होतो.',
      simsCompleted: 'पूर्ण सराव',
      guidesCompleted: 'पूर्ण मार्गदर्शक',
      recentActivityTitle: 'अलीकडील स्कॅनर नोंदी',
      recentActivityEmpty: 'अद्याप कोणतीही तपासणी नोंदवलेली नाही. "तपासा" टॅबमध्ये स्कॅन करून येथे थेट पहा.',
      caregiverAlertedBadge: 'कुटुंबाला कळवले',
      guardrailsTitle: 'सुरक्षा नियम आणि प्राधान्ये',
      guardrailInstant: 'उच्च धोक्याच्या स्कॅनवर त्वरित व्हॉट्सॲप/SMS अलर्ट',
      guardrailInstantDesc: 'धोकादायक फसवणूक आढळल्यास कुटुंबाला लगेच कळवा.',
      guardrailWeekly: 'साप्ताहिक प्रगती अहवाल',
      guardrailWeeklyDesc: 'दर रविवारी पूर्ण झालेल्या सरावाचा गोषवारा पाठवा.',
      guardrailLinks: 'अनोळखी लिंकवर अतिरिक्त इशारा',
      guardrailLinksDesc: 'अपरिचित वेब लिंक उघडण्यापूर्वी स्पष्ट चेतावणी दाखवा.',
      guardrailCalls: 'अनोळखी कॉलसाठी कडक सुरक्षा',
      guardrailCallsDesc: 'अनोळखी नंबरवर OTP न सांगण्याची आठवण करून द्या.',
      nudgeTitle: 'प्रोत्साहनपर संदेश पाठवा',
      nudgeSubtitle: 'हा संदेश होम स्क्रीनवर दिसेल आणि 1-मिनिटाच्या सरावासाठी प्रेरित करेल.',
      nudgePlaceholder: 'आपुलकीचा संदेश लिहा (उदा. "छान बाबा! आज UPI चा सराव नक्की करा.")',
      nudgeAssignLabel: 'सराव जोडा:',
      nudgeSendBtn: 'होम स्क्रीनवर संदेश पाठवा',
      nudgeSentToast: 'पाठवले! तुमचा संदेश आता होम स्क्रीनवर दिसत आहे.',
    },
  },
};
