import type { CityOption, Language, LearningGuide, LocalScamAlert } from '../types';

export const DAILY_SAFETY_TIPS: Record<Language, { title: string; body: string }[]> = {
  en: [
    {
      title: 'UPI PIN is ONLY for Sending Money',
      body: 'You NEVER need to enter your UPI PIN or scan a QR code to receive money, cashback, or a refund. If someone asks for your PIN to send you money, decline immediately.',
    },
    {
      title: 'No Such Thing as "Digital Arrest"',
      body: 'Indian Police, CBI, and Courts never arrest or question citizens over WhatsApp or Skype video calls. If a caller threatens arrest and asks for a bank transfer, hang up right away.',
    },
    {
      title: 'Pause for 2 Minutes on Urgent Messages',
      body: 'Scammers love words like "Tonight 9:30 PM" or "Account Blocked Today" to make you panic. Taking 2 calm minutes to call your family stops 99% of scams.',
    },
  ],
  hi: [
    {
      title: 'पैसे लेने के लिए कभी UPI PIN नहीं लगता',
      body: 'पैसे, कैशबैक या रिफंड पाने के लिए आपको कभी भी UPI PIN डालने या QR कोड स्कैन करने की जरूरत नहीं होती। अगर कोई पैसे भेजने के लिए PIN मांगे, तो तुरंत मना कर दें।',
    },
    {
      title: '"डिजिटल अरेस्ट" जैसी कोई चीज़ नहीं होती',
      body: 'भारतीय पुलिस, CBI या कोर्ट कभी भी व्हाट्सएप या वीडियो कॉल पर गिरफ्तारी नहीं करते। अगर कोई कॉल पर डराकर पैसे ट्रांसफर करने को कहे, तो तुरंत फोन काट दें।',
    },
    {
      title: 'जल्दबाजी वाले संदेश पर 2 मिनट रुकें',
      body: 'ठग जानबूझकर "आज रात 9:30 बजे बिजली कटेगी" या "खाता बंद होगा" लिखकर घबराहट पैदा करते हैं। 2 मिनट शांत रहकर परिवार से बात करने से हर ठगी रुक सकती है।',
    },
  ],
  mr: [
    {
      title: 'पैसे मिळवण्यासाठी कधीही UPI PIN लागत नाही',
      body: 'पैसे, कॅशबॅक किंवा रिफंड मिळवण्यासाठी तुम्हाला कधीही UPI PIN टाकण्याची किंवा QR कोड स्कॅन करण्याची गरज नसते. कोणी पैसे देण्यासाठी PIN मागितल्यास लगेच नकार द्या.',
    },
    {
      title: '"डिजिटल अरेस्ट" असे काहीही नसते',
      body: 'भारतीय पोलीस, CBI किंवा न्यायालय कधीही व्हॉट्सॲप किंवा व्हिडिओ कॉलवर अटक करत नाहीत. कोणी भीती दाखवून पैसे पाठवायला सांगितल्यास लगेच फोन बंद करा.',
    },
    {
      title: 'घाईच्या मेसेजवर 2 मिनिटे शांत थांबा',
      body: 'फसवणूक करणारे "आज रात्री 9:30 ला वीज जाईल" किंवा "खाते बंद होईल" असे लिहून घाबरवतात. 2 मिनिटे थांबून कुटुंबाशी बोलल्यास अशी प्रत्येक फसवणूक टळते.',
    },
  ],
};

export const MESSAGE_PRESETS: { id: string; label: Record<Language, string>; text: string }[] = [
  {
    id: 'mseb',
    label: {
      en: 'Fake MSEB Bill SMS',
      hi: 'नकली बिजली बिल SMS',
      mr: 'बनावट MSEB बिल SMS',
    },
    text: 'Dear Consumer, Your electricity power will be disconnected tonight at 9:30 PM from MSEDCL office because your previous month bill was not updated. Immediately call Electricity Officer 9372841902 or pay Rs 12 at http://bit.ly/mseb-pay-now.',
  },
  {
    id: 'sbi-kyc',
    label: {
      en: 'SBI KYC Blocked Text',
      hi: 'SBI KYC बंद संदेश',
      mr: 'SBI KYC बंद मेसेज',
    },
    text: 'URGENT: Dear SBI YONO User, Your SBI Account & PAN KYC has expired today. Your account will be permanently blocked in 2 hours. Update immediately here: http://sbi-kyc-update-fast.xyz',
  },
  {
    id: 'genuine-otp',
    label: {
      en: 'Genuine Bank OTP',
      hi: 'असली बैंक OTP',
      mr: 'खरा बँक OTP',
    },
    text: 'Your SBI OTP for transaction of Rs. 650.00 at Apollo Pharmacy is 482910. Valid for 10 mins. Do not share this OTP with anyone. If not initiated by you, call 1800-11-2211.',
  },
];

export const LINK_PRESETS: { id: string; label: string; url: string; badge: Record<Language, string> }[] = [
  {
    id: 'fake-sbi',
    label: 'http://sbi-kyc-update-fast.xyz',
    url: 'http://sbi-kyc-update-fast.xyz',
    badge: { en: 'Lookalike Example', hi: 'नकली उदाहरण', mr: 'बनावट उदाहरण' },
  },
  {
    id: 'real-sbi',
    label: 'https://onlinesbi.sbi',
    url: 'https://onlinesbi.sbi',
    badge: { en: 'Official Example', hi: 'असली उदाहरण', mr: 'अधिकृत उदाहरण' },
  },
];

export const CALL_PRESETS: { id: string; label: Record<Language, string>; transcript: string }[] = [
  {
    id: 'digital-arrest',
    label: {
      en: 'Fake CBI Digital Arrest Call',
      hi: 'नकली CBI डिजिटल अरेस्ट कॉल',
      mr: 'बनावट CBI डिजिटल अरेस्ट कॉल',
    },
    transcript:
      'Caller claims to be Inspector Deshmukh from Mumbai Cyber Police & CBI. Says a FedEx parcel sent with my Aadhaar had illegal items and I am under "Digital Arrest". Telling me not to tell my son, stay on video call, and transfer Rs 2,50,000 to an RBI verification account.',
  },
  {
    id: 'bank-manager-otp',
    label: {
      en: 'Fake Bank Manager OTP Call',
      hi: 'नकली बैंक मैनेजर OTP कॉल',
      mr: 'बनावट बँक मॅनेजर OTP कॉल',
    },
    transcript:
      'Caller says he is calling from SBI Head Office to stop my pension account from freezing today. He read out my name and is now asking me to tell him the 6-digit OTP that just arrived on my phone to complete KYC.',
  },
];

export const CITY_OPTIONS: CityOption[] = [
  'Nagpur, Maharashtra',
  'Pune, Maharashtra',
  'Mumbai, Maharashtra',
  'All India',
];

export const LOCAL_SCAM_ALERTS: LocalScamAlert[] = [
  {
    id: 'alert-nagpur-msedcl',
    city: 'Nagpur, Maharashtra',
    dateLabel: { en: '2 days ago', hi: '2 दिन पहले', mr: '2 दिवसांपूर्वी' },
    isRecent: true,
    isMostCommon: true,
    scamType: { en: 'Electricity Bill Fraud', hi: 'बिजली बिल ठगी', mr: 'वीज बिल फसवणूक' },
    severity: 'HIGH',
    title: {
      en: 'Fake MSEDCL / Mahavitaran Disconnection SMS',
      hi: 'नकली महावितरण (MSEDCL) बिजली काटने का SMS',
      mr: 'बनावट महावितरण (MSEDCL) वीज कनेक्शन तोडण्याचा SMS',
    },
    summary: {
      en: 'Residents in Dharampeth and Civil Lines received SMS claiming power will be cut at 9:30 PM unless they call a personal mobile number or pay ₹12 via a link.',
      hi: 'धरमपेठ और सिविल लाइंस के नागरिकों को रात 9:30 बजे बिजली कटने का फर्जी SMS मिल रहा है, जिसमें अनजान नंबर पर कॉल या ₹12 भेजने को कहा जा रहा है।',
      mr: 'धरमपेठ आणि सिव्हिल लाईन्समधील नागरिकांना रात्री 9:30 ला वीज बंद होईल असा खोटा SMS येत असून अनोळखी नंबरवर कॉल किंवा ₹12 भरण्यास सांगितले जात आहे.',
    },
    protectionTip: {
      en: 'MSEDCL never sends disconnection threats from 10-digit personal numbers. Always verify your consumer number only on the official Mahavitaran app or mahadiscom.in.',
      hi: 'महावितरण कभी भी 10-अंकों के निजी मोबाइल नंबर से बिजली काटने का संदेश नहीं भेजता। अपना बिल केवल आधिकारिक महावितरण ऐप या mahadiscom.in पर जांचें।',
      mr: 'महावितरण कधीही 10-अंकी वैयक्तिक मोबाईल नंबरवरून वीज तोडण्याचा मेसेज पाठवत नाही. तुमचे बिल फक्त अधिकृत महावितरण ॲप किंवा mahadiscom.in वरच तपासा.',
    },
  },
  {
    id: 'alert-nagpur-pension',
    city: 'Nagpur, Maharashtra',
    dateLabel: { en: '4 days ago', hi: '4 दिन पहले', mr: '4 दिवसांपूर्वी' },
    isRecent: true,
    isMostCommon: true,
    scamType: { en: 'Pension / KYC Call', hi: 'पेंशन / KYC कॉल', mr: 'पेन्शन / KYC कॉल' },
    severity: 'HIGH',
    title: {
      en: 'Fake Life Certificate (Jeevan Pramaan) Verification Calls',
      hi: 'नकली जीवन प्रमाण पत्र (पेंशन) वेरिफिकेशन कॉल',
      mr: 'बनावट जीवन प्रमाणपत्र (पेन्शन) पडताळणी कॉल',
    },
    summary: {
      en: 'Scammers posing as Treasury or Bank Pension Officers are calling senior citizens in Nagpur asking for OTPs to "keep monthly pension active".',
      hi: 'नकली कोषागार या बैंक पेंशन अधिकारी बनकर नागपुर के वरिष्ठ नागरिकों से पेंशन चालू रखने के बहाने फोन पर OTP मांगा जा रहा है।',
      mr: 'ट्रेझरी किंवा बँक पेन्शन अधिकारी असल्याचे सांगून नागपूरमधील ज्येष्ठ नागरिकांकडे पेन्शन सुरू ठेवण्यासाठी फोनवर OTP मागितला जात आहे.',
    },
    protectionTip: {
      en: 'Pension offices and banks NEVER ask for OTPs over phone calls. Submit Life Certificates only at your bank branch, post office, or official Jeevan Pramaan portal.',
      hi: 'पेंशन कार्यालय या बैंक कभी फोन पर OTP नहीं मांगते। जीवन प्रमाण पत्र हमेशा अपनी बैंक शाखा, डाकघर या आधिकारिक पोर्टल पर ही जमा करें।',
      mr: 'पेन्शन कार्यालय किंवा बँक कधीही फोनवर OTP मागत नाहीत. जीवन प्रमाणपत्र फक्त तुमच्या बँक शाखेत, पोस्टात किंवा अधिकृत पोर्टलवरच सादर करा.',
    },
  },
  {
    id: 'alert-pune-wedding-apk',
    city: 'Pune, Maharashtra',
    dateLabel: { en: '3 days ago', hi: '3 दिन पहले', mr: '3 दिवसांपूर्वी' },
    isRecent: true,
    isMostCommon: true,
    scamType: { en: 'WhatsApp Malware (.APK)', hi: 'व्हाट्सएप फर्जी APK फाइल', mr: 'व्हॉट्सॲप बनावट APK फाईल' },
    severity: 'HIGH',
    title: {
      en: 'Fake Wedding Invitation ".apk" File on WhatsApp',
      hi: 'व्हाट्सएप पर शादी के कार्ड के नाम पर फर्जी ".apk" फाइल',
      mr: 'व्हॉट्सॲपवर लग्नपत्रिकेच्या नावाखाली बनावट ".apk" फाईल',
    },
    summary: {
      en: 'Unknown numbers are sending "Welcome! Please attend our wedding" with a file named WeddingCard.apk. Installing it lets scammers read bank OTPs silently.',
      hi: 'अनजान नंबर से शादी के निमंत्रण के साथ WeddingCard.apk जैसी फाइल भेजी जा रही है। इसे इंस्टॉल करने से ठग आपके फोन के बैंक OTP पढ़ सकते हैं।',
      mr: 'अनोळखी नंबरवरून लग्नाच्या आमंत्रणासोबत WeddingCard.apk अशी फाईल पाठवली जात आहे. ही फाईल इंस्टॉल केल्यास फसवणूक करणारे तुमचे बँक OTP वाचू शकतात.',
    },
    protectionTip: {
      en: 'Real wedding cards are PDF or Photo files—NEVER ".apk". Never tap or install any .apk file received on WhatsApp, even if forwarded in a group.',
      hi: 'असली शादी का कार्ड फोटो या PDF होता है, कभी ".apk" नहीं। व्हाट्सएप पर आई किसी भी .apk फाइल को कभी इंस्टॉल न करें।',
      mr: 'खरी लग्नपत्रिका फोटो किंवा PDF असते—कधीही ".apk" नसते. व्हॉट्सॲपवर आलेली कोणतीही .apk फाईल कधीही इंस्टॉल करू नका.',
    },
  },
  {
    id: 'alert-mumbai-customs',
    city: 'Mumbai, Maharashtra',
    dateLabel: { en: '5 days ago', hi: '5 दिन पहले', mr: '5 दिवसांपूर्वी' },
    isRecent: true,
    isMostCommon: false,
    scamType: { en: 'Digital Arrest / Customs', hi: 'डिजिटल अरेस्ट / कस्टम्स', mr: 'डिजिटल अरेस्ट / कस्टम्स' },
    severity: 'HIGH',
    title: {
      en: 'Fake Mumbai Customs "Illegal Parcel Held" Video Calls',
      hi: 'नकली मुंबई कस्टम्स "पार्सल पकड़ा गया" वीडियो कॉल',
      mr: 'बनावट मुंबई कस्टम्स "पार्सल अडवले गेले" व्हिडिओ कॉल',
    },
    summary: {
      en: 'Automated calls claim a courier sent in your name has illegal items at Mumbai Airport, transferring you to fake police in uniform on WhatsApp video.',
      hi: 'रिकॉर्डेड कॉल में दावा किया जाता है कि आपके नाम के पार्सल में अवैध सामान मिला है और फिर नकली वर्दी में पुलिस वीडियो कॉल पर डराती है।',
      mr: 'रेकॉर्डेड कॉलवरून तुमच्या नावाच्या पार्सलमध्ये बेकायदेशीर वस्तू असल्याचे सांगून नंतर बनावट पोलीस गणवेशात व्हिडिओ कॉलवर घाबरवले जाते.',
    },
    protectionTip: {
      en: 'Simply disconnect the call. Real Customs or Police never conduct investigations over WhatsApp video or ask for money transfers to clear your name.',
      hi: 'बस कॉल तुरंत काट दें। असली पुलिस या कस्टम्स कभी व्हाट्सएप वीडियो पर जांच नहीं करते और न ही पैसे मांगते हैं।',
      mr: 'फक्त कॉल तात्काळ बंद करा. खरे पोलीस किंवा कस्टम्स कधीही व्हॉट्सॲप व्हिडिओवर चौकशी करत नाहीत किंवा पैसे मागत नाहीत.',
    },
  },
  {
    id: 'alert-allindia-upi-cashback',
    city: 'All India',
    dateLabel: { en: '1 week ago', hi: '1 सप्ताह पहले', mr: '1 आठवड्यापूर्वी' },
    isRecent: false,
    isMostCommon: true,
    scamType: { en: 'UPI Collect Trap', hi: 'UPI कलेक्ट ठगी', mr: 'UPI कलेक्ट सापळा' },
    severity: 'MEDIUM',
    title: {
      en: 'Fake ₹2,500–₹5,000 Festival Cashback UPI Request',
      hi: 'नकली ₹2,500–₹5,000 कैशबैक UPI रिक्वेस्ट',
      mr: 'बनावट ₹2,500–₹5,000 कॅशबॅक UPI विनंती',
    },
    summary: {
      en: 'Fraudsters send a UPI "Pay / Collect" request disguised as a reward or refund, tricking elders into entering their UPI PIN to "claim" it.',
      hi: 'ठग इनाम या रिफंड के नाम पर UPI पेमेंट रिक्वेस्ट भेजते हैं और उसे पाने के लिए UPI PIN डालने को कहते हैं, जिससे आपके खाते से पैसे कट जाते हैं।',
      mr: 'बक्षीस किंवा रिफंडच्या नावाखाली UPI पेमेंट रिक्वेस्ट पाठवून ती स्वीकारण्यासाठी UPI PIN टाकायला लावला जातो, ज्यामुळे खात्यातून पैसे कापले जातात.',
    },
    protectionTip: {
      en: 'Remember the golden rule: UPI PIN is ONLY required when money LEAVES your account—never when money comes IN.',
      hi: 'सुनहरा नियम याद रखें: UPI PIN सिर्फ तब डालना होता है जब पैसे आपके खाते से जाते हैं, आने पर कभी नहीं।',
      mr: 'सुवर्ण नियम लक्षात ठेवा: UPI PIN फक्त पैसे तुमच्या खात्यातून जाताना लागतो, पैसे येताना कधीही नाही.',
    },
  },
  {
    id: 'alert-nagpur-bank-kyc',
    city: 'Nagpur, Maharashtra',
    dateLabel: { en: '2 weeks ago', hi: '2 सप्ताह पहले', mr: '2 आठवड्यांपूर्वी' },
    isRecent: false,
    isMostCommon: true,
    scamType: { en: 'Fake Bank KYC Link', hi: 'नकली बैंक KYC लिंक', mr: 'बनावट बँक KYC लिंक' },
    severity: 'MEDIUM',
    title: {
      en: 'PAN Card Update SMS for SBI & Bank of Maharashtra Users',
      hi: 'SBI और बैंक ऑफ महाराष्ट्र ग्राहकों को नकली PAN अपडेट SMS',
      mr: 'SBI आणि बँक ऑफ महाराष्ट्र ग्राहकांना बनावट PAN अपडेट SMS',
    },
    summary: {
      en: 'Messages threaten net-banking suspension today unless you click a ".xyz" or ".top" web link and enter your debit card PIN.',
      hi: 'संदेश में कहा जाता है कि अगर आपने ".xyz" लिंक पर क्लिक कर डेबिट कार्ड की जानकारी नहीं भरी, तो आज नेट-बैंकिंग बंद हो जाएगी।',
      mr: '".xyz" लिंकवर क्लिक करून डेबिट कार्डची माहिती न भरल्यास आज नेट-बँकिंग बंद होईल अशी धमकी मेसेजमध्ये दिली जाते.',
    },
    protectionTip: {
      en: 'Check the web ending carefully. Official bank sites end in .sbi, .co.in, or .in—never .xyz or .top. Visit your home branch for any KYC help.',
      hi: 'वेब पते का अंत ध्यान से देखें। असली बैंक साइट .sbi, .co.in या .in होती है—कभी .xyz नहीं। किसी भी KYC के लिए अपनी बैंक शाखा जाएं।',
      mr: 'वेब पत्त्याचा शेवट नीट पहा. अधिकृत बँक साइट .sbi, .co.in किंवा .in असते—कधीही .xyz नसते. कोणत्याही KYC साठी थेट बँक शाखेत जा.',
    },
  },
];

export const BANK_FREEZE_CONTACTS = [
  { name: 'State Bank of India (SBI)', number: '1800-11-2211', alt: '1800-1234' },
  { name: 'HDFC Bank', number: '1800-202-6161', alt: '1800-2600' },
  { name: 'ICICI Bank', number: '1800-1080', alt: '24×7 Fraud Desk' },
  { name: 'Bank of Maharashtra', number: '1800-233-4526', alt: '1800-102-2636' },
];

export const LEARNING_GUIDES: LearningGuide[] = [
  {
    id: 'kyc-otp',
    artworkKey: 'kyc',
    durationLabel: { en: '2 min guide', hi: '2 मिनट गाइड', mr: '2 मिनिटांचा मार्गदर्शक' },
    title: {
      en: 'KYC & OTP Scams',
      hi: 'KYC और OTP ठगी से बचाव',
      mr: 'KYC आणि OTP फसवणुकीपासून बचाव',
    },
    subtitle: {
      en: 'Why banks never ask for your 6-digit OTP or KYC via SMS links.',
      hi: 'जानें कि बैंक कभी फोन पर 6-अंकों का OTP क्यों नहीं मांगते।',
      mr: 'बँका कधीही फोनवर OTP किंवा SMS लिंकद्वारे KYC का मागत नाहीत ते जाणून घ्या.',
    },
    slides: [
      {
        heading: {
          en: 'Your OTP is Like Your House Key',
          hi: 'आपका OTP आपके घर की चाबी जैसा है',
          mr: 'तुमचा OTP म्हणजे तुमच्या घराची किल्ली आहे',
        },
        body: {
          en: 'An OTP (One-Time Password) lets someone move money out of your account. Even a real Bank Manager is strictly forbidden from asking for your OTP.',
          hi: 'OTP का मतलब है खाते से पैसे निकालने की अनुमति। असली बैंक मैनेजर को भी आपसे OTP पूछने की अनुमति नहीं होती।',
          mr: 'OTP म्हणजे तुमच्या खात्यातून पैसे काढण्याची परवानगी. खऱ्या बँक मॅनेजरलाही तुमचा OTP विचारण्याची परवानगी नसते.',
        },
        doText: {
          en: 'Keep every OTP strictly private and type it only when YOU start a payment.',
          hi: 'हर OTP गुप्त रखें और तभी डालें जब आप खुद भुगतान कर रहे हों।',
          mr: 'प्रत्येक OTP गुप्त ठेवा आणि तुम्ही स्वतः पेमेंट करत असाल तरच वापरा.',
        },
        dontText: {
          en: 'Never read out an OTP on a call—even if the caller knows your name and account number.',
          hi: 'कॉल पर कभी OTP न बताएं—भले ही कॉलर आपका नाम और जन्मतिथि जानता हो।',
          mr: 'कॉलवर कधीही OTP सांगू नका—कॉलरला तुमचे नाव आणि पत्ता माहीत असला तरीही.',
        },
      },
      {
        heading: {
          en: 'How Genuine Bank KYC Works',
          hi: 'असली बैंक KYC कैसे होती है',
          mr: 'खरे बँक KYC कसे होते',
        },
        body: {
          en: 'If your KYC is due, your bank gives weeks of notice and invites you to visit your home branch or use the official banking app—never a rushed 2-hour SMS link.',
          hi: 'यदि KYC बाकी है, तो बैंक आपको कई हफ्तों पहले सूचित करता है और शाखा में बुलाता है—कभी 2 घंटे में खाता बंद करने की धमकी नहीं देता।',
          mr: 'KYC बाकी असल्यास बँक तुम्हाला काही आठवडे आधी कळवते आणि शाखेत बोलावते—कधीही 2 तासांत खाते बंद करण्याची धमकी देत नाही.',
        },
        doText: {
          en: 'Visit your local bank branch or call the number printed on your passbook.',
          hi: 'अपनी पासबुक पर लिखे नंबर पर कॉल करें या सीधे बैंक शाखा जाएं।',
          mr: 'तुमच्या पासबुकवर दिलेल्या नंबरवर कॉल करा किंवा थेट बँक शाखेत जा.',
        },
        dontText: {
          en: 'Never click ".xyz" or "bit.ly" links asking to update PAN or Aadhaar.',
          hi: 'PAN या आधार अपडेट के लिए ".xyz" या "bit.ly" लिंक पर कभी क्लिक न करें।',
          mr: 'PAN किंवा आधार अपडेटसाठी ".xyz" किंवा "bit.ly" लिंकवर कधीही क्लिक करू नका.',
        },
      },
    ],
    quizQuestion: {
      en: 'Someone calling from "SBI Head Office" asks for your 6-digit OTP to stop your account from closing. What should you do?',
      hi: '"SBI हेड ऑफिस" से बताकर कोई कॉल पर खाता बचाने के लिए 6-अंकों का OTP मांगे, तो आप क्या करेंगे?',
      mr: '"SBI हेड ऑफिस" मधून बोलतोय असे सांगून कोणी खाते वाचवण्यासाठी 6-अंकी OTP मागितल्यास तुम्ही काय कराल?',
    },
    quizOptions: [
      {
        id: 'a',
        label: {
          en: 'Politely hang up immediately and never share the OTP',
          hi: 'तुरंत फोन काट दें और OTP बिल्कुल न बताएं',
          mr: 'लगेच फोन बंद करा आणि OTP अजिबात सांगू नका',
        },
        isCorrect: true,
        feedback: {
          en: 'Spot on! Real bank officers never ask for your OTP. Hanging up keeps your savings 100% safe.',
          hi: 'बिल्कुल सही! असली बैंक अधिकारी कभी OTP नहीं मांगते। फोन काटने से आपकी बचत पूरी तरह सुरक्षित रहती है।',
          mr: 'अगदी बरोबर! खरे बँक अधिकारी कधीही OTP मागत नाहीत. फोन बंद केल्याने तुमची बचत पूर्णपणे सुरक्षित राहते.',
        },
      },
      {
        id: 'b',
        label: {
          en: 'Read out the OTP quickly so the account stays open',
          hi: 'खाता चालू रखने के लिए जल्दी से OTP बता दें',
          mr: 'खाते सुरू राहण्यासाठी पटकन OTP सांगून टाका',
        },
        isCorrect: false,
        feedback: {
          en: 'Careful! That OTP would let the scammer withdraw money from your account. Always hang up and verify at your branch.',
          hi: 'सावधान! वह OTP बताते ही ठग आपके खाते से पैसे निकाल सकता है। हमेशा फोन काटें और अपनी शाखा में पुष्टि करें।',
          mr: 'सावधान! तो OTP सांगितल्यास फसवणूक करणारा तुमच्या खात्यातून पैसे काढू शकतो. नेहमी फोन बंद करा आणि शाखेत खात्री करा.',
        },
      },
    ],
  },
  {
    id: 'lottery-job',
    artworkKey: 'lottery',
    imageSrc: '/src/assets/images/guide_lottery_job_1795522288961.jpg',
    durationLabel: { en: '2 min guide', hi: '2 मिनट गाइड', mr: '2 मिनिटांचा मार्गदर्शक' },
    title: {
      en: 'Fake Lottery & Gift Offers',
      hi: 'नकली लॉटरी और इनाम के ऑफर',
      mr: 'बनावट लॉटरी आणि बक्षिसांचे ऑफर',
    },
    subtitle: {
      en: 'How to spot "You Won ₹25 Lakh" WhatsApp prizes and fake part-time offers.',
      hi: 'व्हाट्सएप पर "₹25 लाख जीतें" जैसे फर्जी इनाम और ऑफर कैसे पहचानें।',
      mr: 'व्हॉट्सॲपवर येणारे "₹25 लाख जिंकले" सारखे खोटे इनाम कसे ओळखावेत.',
    },
    slides: [
      {
        heading: {
          en: 'You Cannot Win a Contest You Never Entered',
          hi: 'जिस प्रतियोगिता में भाग नहीं लिया, उसमें जीत नहीं हो सकती',
          mr: 'ज्या स्पर्धेत भाग घेतला नाही, ती जिंकता येत नाही',
        },
        body: {
          en: 'Scammers send colourful posters claiming you won KBC, WhatsApp Lottery, or a Senior Citizen Lucky Draw—then ask for a "processing fee" or "GST tax" first.',
          hi: 'ठग रंगीन पोस्टर भेजकर KBC या लकी ड्रा में लाखों जीतने का दावा करते हैं और फिर पहले "प्रोसेसिंग फीस" या "GST टैक्स" मांगते हैं।',
          mr: 'फसवणूक करणारे रंगीबेरंगी पोस्टर पाठवून KBC किंवा लकी ड्रॉ जिंकल्याचे सांगतात आणि आधी "प्रोसेसिंग फी" किंवा "GST" भरण्यास सांगतात.',
        },
        doText: {
          en: 'Delete unsolicited prize messages and ignore unknown WhatsApp forwards.',
          hi: 'बिन मांगे आए इनाम के संदेश डिलीट करें और अनजान फॉरवर्ड अनदेखा करें।',
          mr: 'न मागता आलेले बक्षिसाचे मेसेज डिलीट करा आणि अनोळखी फॉरवर्डकडे दुर्लक्ष करा.',
        },
        dontText: {
          en: 'Never pay a "registration fee", "courier charge", or "tax" to claim a prize.',
          hi: 'कोई भी इनाम पाने के लिए कभी "फीस" या "टैक्स" के नाम पर पैसे न भेजें।',
          mr: 'कोणतेही बक्षीस मिळवण्यासाठी कधीही "फी" किंवा "टॅक्स" म्हणून पैसे पाठवू नका.',
        },
      },
      {
        heading: {
          en: 'Beware of Fake "Work From Home" & Like-Video Tasks',
          hi: 'नकली "घर बैठे कमाई" और वीडियो लाइक करने के ऑफर से बचें',
          mr: 'बनावट "घरबसल्या कमाई" आणि व्हिडिओ लाईक ऑफरपासून सावध राहा',
        },
        body: {
          en: 'Scammers pay ₹150 once to win your trust, then ask you to deposit ₹10,000+ into "VIP prepaid tasks" where your money gets trapped forever.',
          hi: 'ठग पहले भरोसा जीतने के लिए ₹150 भेजते हैं, फिर "VIP टास्क" के नाम पर ₹10,000 या अधिक जमा करवाकर आपके पैसे फंसा लेते हैं।',
          mr: 'फसवणूक करणारे आधी विश्वास जिंकण्यासाठी ₹150 देतात, नंतर "VIP टास्क" साठी ₹10,000+ भरायला लावून पैसे अडकवतात.',
        },
        doText: {
          en: 'Discuss any unexpected money-making offer with your family first.',
          hi: 'कमाई के किसी भी अनजान ऑफर के बारे में पहले परिवार से बात करें।',
          mr: 'कमाईच्या कोणत्याही अनोळखी ऑफरबद्दल आधी कुटुंबाशी बोला.',
        },
        dontText: {
          en: 'Never join unknown Telegram investment or daily-task groups.',
          hi: 'अनजान टेलीग्राम निवेश या डेली-टास्क ग्रुप में कभी शामिल न हों।',
          mr: 'अनोळखी टेलिग्राम गुंतवणूक किंवा डेली-टास्क ग्रुपमध्ये कधीही सामील होऊ नका.',
        },
      },
    ],
    quizQuestion: {
      en: 'A WhatsApp message says you won a ₹5,00,000 Senior Lucky Draw and asks for ₹1,500 GST fee to release the prize. What is this?',
      hi: 'व्हाट्सएप पर संदेश आए कि आपने ₹5 लाख जीते हैं और इनाम पाने के लिए ₹1,500 GST भेजें। यह क्या है?',
      mr: 'व्हॉट्सॲपवर मेसेज आला की तुम्ही ₹5 लाख जिंकले आहेत आणि ते मिळण्यासाठी ₹1,500 GST भरा. हे काय आहे?',
    },
    quizOptions: [
      {
        id: 'a',
        label: {
          en: 'A definite scam—delete and block the sender',
          hi: 'पक्का फ्रॉड है—संदेश डिलीट करें और नंबर ब्लॉक करें',
          mr: 'नक्कीच फसवणूक आहे—मेसेज डिलीट करा आणि नंबर ब्लॉक करा',
        },
        isCorrect: true,
        feedback: {
          en: 'Correct! Real prizes never require you to send money first.',
          hi: 'बिल्कुल सही! असली इनाम के लिए कभी पहले पैसे नहीं भेजने पड़ते।',
          mr: 'अगदी बरोबर! खऱ्या बक्षिसासाठी कधीही आधी पैसे भरावे लागत नाहीत.',
        },
      },
      {
        id: 'b',
        label: {
          en: 'Pay ₹1,500 to check if the ₹5 Lakh arrives',
          hi: '₹5 लाख पाने के लिए ₹1,500 भेजकर देख लें',
          mr: '₹5 लाख येतात का पाहण्यासाठी ₹1,500 पाठवून बघा',
        },
        isCorrect: false,
        feedback: {
          en: 'Never pay! Once you pay ₹1,500, scammers invent more fees and never send any prize.',
          hi: 'कभी पैसे न भेजें! एक बार पैसे देने के बाद ठग और ज्यादा पैसे मांगते रहते हैं।',
          mr: 'कधीही पैसे पाठवू नका! एकदा पैसे दिले की फसवणूक करणारे आणखी फी मागतात.',
        },
      },
    ],
  },
  {
    id: 'digital-arrest',
    artworkKey: 'arrest',
    durationLabel: { en: '2 min guide', hi: '2 मिनट गाइड', mr: '2 मिनिटांचा मार्गदर्शक' },
    title: {
      en: 'Digital Arrest Calls',
      hi: 'डिजिटल अरेस्ट कॉल से सुरक्षा',
      mr: 'डिजिटल अरेस्ट कॉलपासून सुरक्षा',
    },
    subtitle: {
      en: 'Stay fearless against fake Police, CBI, or Customs video calls.',
      hi: 'नकली पुलिस, CBI या कस्टम्स के वीडियो कॉल से बिना डरे निपटें।',
      mr: 'बनावट पोलीस, CBI किंवा कस्टम्सच्या व्हिडिओ कॉलला न घाबरता कसे सामोरे जावे.',
    },
    slides: [
      {
        heading: {
          en: 'There is NO "Digital Arrest" in India',
          hi: 'भारत में "डिजिटल अरेस्ट" जैसा कोई कानून नहीं है',
          mr: 'भारतात "डिजिटल अरेस्ट" असा कोणताही कायदा नाही',
        },
        body: {
          en: 'Scammers dress in fake uniforms on WhatsApp or Skype video calls, show fake arrest warrants, and forbid you from speaking to your children. They rely purely on panic.',
          hi: 'ठग नकली वर्दी पहनकर व्हाट्सएप वीडियो पर झूठा वारंट दिखाते हैं और परिवार को बताने से मना करते हैं। वे सिर्फ आपके डर का फायदा उठाते हैं।',
          mr: 'फसवणूक करणारे बनावट गणवेशात व्हॉट्सॲप व्हिडिओवर खोटे वॉरंट दाखवतात आणि मुलांना सांगण्यास मनाई करतात. ते फक्त तुमच्या भीतीचा फायदा घेतात.',
        },
        doText: {
          en: 'Disconnect the call immediately and call your family or Helpline 1930.',
          hi: 'तुरंत कॉल काटें और अपने परिवार या हेल्पलाइन 1930 पर बात करें।',
          mr: 'लगेच कॉल बंद करा आणि आपल्या कुटुंबाला किंवा 1930 हेल्पलाइनला फोन करा.',
        },
        dontText: {
          en: 'Never transfer money to any "RBI verification" or "police custody" account.',
          hi: 'कभी भी किसी "वेरिफिकेशन अकाउंट" या "सेफ कस्टडी" में पैसे ट्रांसफर न करें।',
          mr: 'कधीही कोणत्याही "व्हेरिफिकेशन खात्यात" किंवा "सेफ कस्टडी" खात्यात पैसे पाठवू नका.',
        },
      },
      {
        heading: {
          en: 'How to Verify Safely If You Feel Worried',
          hi: 'अगर चिंता हो तो सुरक्षित तरीके से जांच कैसे करें',
          mr: 'काळजी वाटल्यास सुरक्षितपणे खात्री कशी करावी',
        },
        body: {
          en: 'Real police notices are delivered in person by your local police station. Hang up first, take a deep breath, and call your child or local police station directly.',
          hi: 'असली पुलिस नोटिस आपके स्थानीय थाने द्वारा व्यक्तिगत रूप से दिया जाता है। पहले कॉल काटें, गहरी सांस लें और अपने परिवार या स्थानीय थाने से बात करें।',
          mr: 'खरी पोलीस नोटीस तुमच्या स्थानिक पोलीस स्टेशनकडून प्रत्यक्ष दिली जाते. आधी कॉल बंद करा, शांत व्हा आणि कुटुंबाशी किंवा स्थानिक पोलिसांशी बोला.',
        },
        doText: {
          en: 'Keep your family informed immediately—scammers lose all power when you talk to family.',
          hi: 'तुरंत परिवार को बताएं—परिवार से बात करते ही ठगों का डर खत्म हो जाता है।',
          mr: 'लगेच कुटुंबाला सांगा—कुटुंबाशी बोलताच फसवणूक करणाऱ्यांची भीती नाहीशी होते.',
        },
        dontText: {
          en: 'Never obey a caller who orders you to lock your room or keep the call secret.',
          hi: 'कमरा बंद करने या कॉल गुप्त रखने के किसी भी आदेश को कभी न मानें।',
          mr: 'खोली बंद करण्याच्या किंवा कॉल गुप्त ठेवण्याच्या कोणत्याही सूचनेचे पालन करू नका.',
        },
      },
    ],
    quizQuestion: {
      en: 'A video caller in police uniform says your Aadhaar was used in a crime and tells you not to tell your family. What should you do?',
      hi: 'पुलिस वर्दी में कोई वीडियो कॉल पर कहे कि आपके आधार पर केस है और परिवार को मत बताना। आप क्या करेंगे?',
      mr: 'पोलीस गणवेशातील व्यक्ती व्हिडिओ कॉलवर तुमच्या आधारवर केस असल्याचे सांगून कुटुंबाला न सांगण्यास सांगते. तुम्ही काय कराल?',
    },
    quizOptions: [
      {
        id: 'a',
        label: {
          en: 'End the video call immediately and inform my family',
          hi: 'तुरंत वीडियो कॉल काटें और अपने परिवार को बताएं',
          mr: 'लगेच व्हिडिओ कॉल बंद करा आणि कुटुंबाला सांगा',
        },
        isCorrect: true,
        feedback: {
          en: 'Brilliant! Real police never isolate you on video calls or ask for money transfers.',
          hi: 'शानदार! असली पुलिस कभी वीडियो कॉल पर डराकर अकेला नहीं करती और न ही पैसे मांगती है।',
          mr: 'उत्कृष्ट! खरे पोलीस कधीही व्हिडिओ कॉलवर घाबरवून एकटे पाडत नाहीत किंवा पैसे मागत नाहीत.',
        },
      },
      {
        id: 'b',
        label: {
          en: 'Stay on the video call silently and transfer savings for checking',
          hi: 'चुपचाप कॉल पर बने रहें और जांच के लिए पैसे ट्रांसफर करें',
          mr: 'शांतपणे कॉलवर थांबा आणि तपासणीसाठी पैसे पाठवा',
        },
        isCorrect: false,
        feedback: {
          en: 'Never do this! That is the exact trap of Digital Arrest scammers. Always hang up right away.',
          hi: 'ऐसा बिल्कुल न करें! यही डिजिटल अरेस्ट ठगों का सबसे बड़ा जाल है। तुरंत फोन काटें।',
          mr: 'असे अजिबात करू नका! हाच डिजिटल अरेस्ट ठगांचा मुख्य सापळा आहे. लगेच फोन बंद करा.',
        },
      },
    ],
  },
  {
    id: 'safe-upi',
    artworkKey: 'upi',
    durationLabel: { en: '2 min guide', hi: '2 मिनट गाइड', mr: '2 मिनिटांचा मार्गदर्शक' },
    title: {
      en: 'Safe UPI Practices',
      hi: 'सुरक्षित UPI उपयोग के नियम',
      mr: 'सुरक्षित UPI वापराचे नियम',
    },
    subtitle: {
      en: 'Master the difference between Receiving Money and Paying Money on UPI.',
      hi: 'UPI पर पैसे भेजने और पैसे पाने का सही अंतर समझें।',
      mr: 'UPI वर पैसे पाठवणे आणि पैसे मिळवणे यातील खरा फरक समजून घ्या.',
    },
    slides: [
      {
        heading: {
          en: 'Receiving Money Needs ZERO Action From You',
          hi: 'पैसे पाने के लिए आपको कुछ भी करने की जरूरत नहीं',
          mr: 'पैसे मिळवण्यासाठी तुम्हाला काहीही करण्याची गरज नसते',
        },
        body: {
          en: 'When someone genuinely sends you money on UPI, it arrives directly in your bank account automatically. You NEVER enter a PIN, scan a QR code, or tap "Pay".',
          hi: 'जब कोई सचमुच आपको UPI से पैसे भेजता है, तो वे सीधे आपके खाते में आ जाते हैं। इसके लिए कभी PIN डालने या QR स्कैन करने की जरूरत नहीं होती।',
          mr: 'जेव्हा कोणी तुम्हाला खरोखर UPI ने पैसे पाठवते, तेव्हा ते थेट तुमच्या खात्यात जमा होतात. त्यासाठी कधीही PIN टाकावा किंवा QR स्कॅन करावा लागत नाही.',
        },
        doText: {
          en: 'Verify the person’s name and exact amount before entering your UPI PIN when paying.',
          hi: 'पैसे भेजते समय PIN डालने से पहले सामने वाले का नाम और सही राशि जांचें।',
          mr: 'पैसे पाठवताना PIN टाकण्यापूर्वी समोरच्या व्यक्तीचे नाव आणि अचूक रक्कम तपासा.',
        },
        dontText: {
          en: 'Never tap "Accept & Pay" or enter your UPI PIN for a cashback or refund.',
          hi: 'कैशबैक या रिफंड के लिए कभी "Pay" न दबाएं और न ही UPI PIN डालें।',
          mr: 'कॅशबॅक किंवा रिफंडसाठी कधीही "Pay" दाबू नका किंवा UPI PIN टाकू नका.',
        },
      },
      {
        heading: {
          en: 'Keep Screen-Sharing Apps Off Your Phone',
          hi: 'स्क्रीन-शेयरिंग ऐप से अपने फोन को दूर रखें',
          mr: 'स्क्रीन-शेअरिंग ॲप्सपासून तुमचा फोन सुरक्षित ठेवा',
        },
        body: {
          en: 'No bank, electricity board, or customer care ever needs AnyDesk, TeamViewer, or QuickSupport to help you with a UPI refund.',
          hi: 'किसी भी बैंक, बिजली विभाग या कस्टमर केयर को UPI मदद के लिए AnyDesk या QuickSupport ऐप की जरूरत नहीं होती।',
          mr: 'कोणत्याही बँकेला, वीज मंडळाला किंवा कस्टमर केअरला मदतीसाठी AnyDesk किंवा QuickSupport ॲपची गरज नसते.',
        },
        doText: {
          en: 'Use only your trusted bank or UPI app downloaded from the official store.',
          hi: 'केवल अपने भरोसेमंद बैंक या UPI ऐप का ही उपयोग करें।',
          mr: 'फक्त तुमच्या विश्वासार्ह बँक किंवा अधिकृत UPI ॲपचाच वापर करा.',
        },
        dontText: {
          en: 'Never install AnyDesk, QuickSupport, or remote apps asked by a caller.',
          hi: 'कॉलर के कहने पर कभी भी AnyDesk या QuickSupport जैसा ऐप इंस्टॉल न करें।',
          mr: 'कॉलरने सांगितल्यावरून कधीही AnyDesk किंवा QuickSupport ॲप इंस्टॉल करू नका.',
        },
      },
    ],
    quizQuestion: {
      en: 'A buyer on a classified site sends you a QR code and asks you to scan it and enter your UPI PIN to receive ₹3,000. Should you do it?',
      hi: 'कोई व्यक्ति ₹3,000 भेजने के लिए आपको QR कोड भेजकर स्कैन करने और UPI PIN डालने को कहे, तो क्या आप करेंगे?',
      mr: 'कोणीतरी ₹3,000 पाठवण्यासाठी तुम्हाला QR कोड पाठवून स्कॅन करायला आणि UPI PIN टाकायला सांगत आहे. तुम्ही तसे कराल का?',
    },
    quizOptions: [
      {
        id: 'a',
        label: {
          en: 'No! Entering UPI PIN will deduct ₹3,000 FROM my account',
          hi: 'नहीं! UPI PIN डालने से मेरे खाते से ₹3,000 कट जाएंगे',
          mr: 'नाही! UPI PIN टाकल्याने माझ्या खात्यातून ₹3,000 कापले जातील',
        },
        isCorrect: true,
        feedback: {
          en: 'Exactly right! Scanning a QR code and entering your PIN always SENDS money out.',
          hi: 'बिल्कुल सही! QR कोड स्कैन करके PIN डालने से हमेशा पैसे आपके खाते से कटते हैं।',
          mr: 'अगदी बरोबर! QR कोड स्कॅन करून PIN टाकल्यास नेहमी तुमच्या खात्यातून पैसे जातात.',
        },
      },
      {
        id: 'b',
        label: {
          en: 'Yes, scan it and enter PIN to collect the ₹3,000',
          hi: 'हां, ₹3,000 पाने के लिए स्कैन करके PIN डाल दें',
          mr: 'हो, ₹3,000 मिळवण्यासाठी स्कॅन करून PIN टाका',
        },
        isCorrect: false,
        feedback: {
          en: 'Watch out! You never enter your UPI PIN to receive money. Always decline such requests.',
          hi: 'सावधान! पैसे पाने के लिए कभी UPI PIN नहीं डाला जाता। ऐसी रिक्वेस्ट हमेशा अस्वीकार करें।',
          mr: 'सावधान! पैसे मिळवण्यासाठी कधीही UPI PIN टाकला जात नाही. अशी विनंती नेहमी नाकारा.',
        },
      },
    ],
  },
];
