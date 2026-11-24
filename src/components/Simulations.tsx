import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  IndianRupee,
  Phone,
  PhoneOff,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { speakText, stopSpeech } from '../utils/speech';
import { SpeakButton } from './SpeakButton';

interface SimProps {
  language: Language;
  onComplete: (simId: 'call' | 'whatsapp' | 'upi', points: number) => void;
  onBack: () => void;
}

/* ============================================================
   SIMULATION 1: INCOMING SCAM CALL SIMULATOR
   ============================================================ */
export function IncomingCallSimulator({ language, onComplete, onBack }: SimProps) {
  const t = TRANSLATIONS[language];
  const [stage, setStage] = useState<'ringing' | 'active' | 'feedback'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [chosenOutcome, setChosenOutcome] = useState<'safe' | 'risky' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const callerDialogue: Record<Language, string> = {
    en: '"Hello Sir/Madam, I am calling from SBI Head Office & Mumbai Cyber Police. Your pension KYC has failed and your account will be frozen in 15 minutes. Please read out the 6-digit OTP that just came to your phone right now!"',
    hi: '"नमस्ते जी, मैं SBI हेड ऑफिस और मुंबई साइबर पुलिस से बोल रहा हूं। आपका पेंशन KYC फेल हो गया है और 15 मिनट में खाता बंद हो जाएगा। अभी आपके फोन पर आया 6-अंकों का OTP तुरंत बताइए!"',
    mr: '"नमस्कार, मी SBI हेड ऑफिस आणि मुंबई सायबर पोलिसांतून बोलत आहे. तुमचे पेन्शन KYC फेल झाले असून 15 मिनिटांत खाते बंद होईल. तुमच्या फोनवर आलेला 6-अंकी OTP लगेच सांगा!"',
  };

  useEffect(() => {
    if (stage !== 'active') return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  const handleAcceptCall = () => {
    setStage('active');
    setSeconds(0);
    speakText(callerDialogue[language], language);
  };

  const handleDeclineRinging = () => {
    stopSpeech();
    setChosenOutcome('safe');
    setFeedbackText(
      language === 'hi'
        ? 'बहुत बढ़िया! अनजान और संदिग्ध नंबर से आने वाली कॉल न उठाना भी एक सुरक्षित आदत है। अगर सच में बैंक से काम हो, तो आप अपनी पासबुक के नंबर पर खुद कॉल कर सकते हैं।'
        : language === 'mr'
          ? 'छान! अनोळखी आणि संशयास्पद नंबरवरून आलेला कॉल न उचलणे हीदेखील सुरक्षित सवय आहे. बँकेचे खरे काम असल्यास तुम्ही स्वतः पासबुकवरील नंबरवर कॉल करू शकता.'
          : 'Great instinct! Declining suspicious unknown calls is completely safe. If your bank truly needs you, you can always call the official number on your passbook.'
    );
    setStage('feedback');
    onComplete('call', 50);
  };

  const handleChoice = (choice: 'otp' | 'safe-hangup' | 'link') => {
    stopSpeech();
    if (choice === 'safe-hangup') {
      setChosenOutcome('safe');
      setFeedbackText(
        language === 'hi'
          ? 'शाबाश! आपने बिल्कुल सही फैसला लिया। असली SBI अधिकारी या पुलिस कभी फोन पर OTP नहीं मांगते और न ही 15 मिनट की धमकी देते हैं। फोन काटकर आप पूरी तरह सुरक्षित रहे।'
          : language === 'mr'
            ? 'शाब्बास! तुम्ही अगदी योग्य निर्णय घेतला. खरे SBI अधिकारी किंवा पोलीस कधीही फोनवर OTP मागत नाहीत किंवा 15 मिनिटांची धमकी देत नाहीत. कॉल बंद करून तुम्ही पूर्णपणे सुरक्षित राहिलात.'
            : 'Well done! You handled that like a pro. Real SBI officers and Indian Police NEVER ask for OTPs or threaten a 15-minute freeze over a phone call.'
      );
      onComplete('call', 50);
    } else if (choice === 'otp') {
      setChosenOutcome('risky');
      setFeedbackText(
        language === 'hi'
          ? 'सावधान! इस अभ्यास में आपने OTP साझा कर दिया। असली जिंदगी में 6-अंकों का OTP बताते ही ठग आपके खाते से पैसे निकाल लेते हैं। चिंता न करें—अभ्यास का यही फायदा है! अब फिर से सुरक्षित विकल्प चुनें।'
          : language === 'mr'
            ? 'सावधान! या सरावात तुम्ही OTP सांगितला. खऱ्या आयुष्यात 6-अंकी OTP सांगताच फसवणूक करणारे तुमच्या खात्यातून पैसे काढू शकतात. काळजी करू नका—सरावाचा हाच फायदा आहे! आता पुन्हा सुरक्षित पर्याय निवडा.'
            : 'Careful! Reading out an OTP lets scammers withdraw money immediately. Don’t worry—that is why we practice safely here! Try again and pick the safe response.'
      );
    } else {
      setChosenOutcome('risky');
      setFeedbackText(
        language === 'hi'
          ? 'सावधान! कॉल के दौरान भेजे गए किसी भी लिंक पर क्लिक करने से आपके फोन में नकली ऐप इंस्टॉल हो सकता है। हमेशा कॉल काटें और आधिकारिक शाखा से पुष्टि करें।'
          : language === 'mr'
            ? 'सावधान! कॉलदरम्यान पाठवलेल्या कोणत्याही लिंकवर क्लिक केल्यास फोनमध्ये फसवे ॲप येऊ शकते. नेहमी कॉल बंद करा आणि बँक शाखेत खात्री करा.'
            : 'Watch out! Clicking links sent by an unknown caller can steal your banking login or install remote-control apps. Always hang up instead.'
      );
    }
    setStage('feedback');
  };

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="space-y-4 pb-6">
      <button
        type="button"
        onClick={() => {
          stopSpeech();
          onBack();
        }}
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#1A3C2B] hover:text-[#285940] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>{t.practice.backToList}</span>
      </button>

      {stage === 'ringing' && (
        <div className="rounded-3xl bg-[#16261E] text-white p-6 text-center space-y-6 shadow-md">
          <div className="text-xs font-semibold text-[#A7F3D0] tracking-wide">
            {language === 'hi' ? 'इनकमिंग कॉल (अभ्यास सिमुलेशन)' : language === 'mr' ? 'इनकमिंग कॉल (सराव सिम्युलेशन)' : 'Incoming Call (Safe Simulation)'}
          </div>

          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#4ADE80]/30 animate-gentle-ring" />
            <div className="relative w-20 h-20 rounded-full bg-[#285940] border-2 border-[#86EFAC] flex items-center justify-center">
              <Phone className="w-9 h-9 text-white" aria-hidden="true" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">+91 98201 74XXX</h2>
            <p className="mt-1 text-base text-[#D1FAE5] font-medium">
              Claiming: SBI Head Office / Mumbai Cyber Police
            </p>
            <p className="mt-1 text-xs text-[#A7F3D0]">
              {language === 'hi' ? 'असत्यापित मोबाइल नंबर' : language === 'mr' ? 'असत्यापित मोबाईल नंबर' : 'Unverified Personal Mobile Number'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={handleDeclineRinging}
              className="min-h-[58px] rounded-2xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" aria-hidden="true" />
              <span>{language === 'hi' ? 'काट दें' : language === 'mr' ? 'नाकारा' : 'Decline'}</span>
            </button>

            <button
              type="button"
              onClick={handleAcceptCall}
              className="min-h-[58px] rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              <span>{language === 'hi' ? 'उठाएं' : language === 'mr' ? 'उचला' : 'Accept'}</span>
            </button>
          </div>
        </div>
      )}

      {stage === 'active' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#16261E] text-white p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-base font-bold">+91 98201 74XXX</div>
                <div className="text-xs text-[#A7F3D0]">Claiming: SBI / Cyber Police</div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-[#285940] text-sm font-mono font-bold tabular-nums">
                {formattedTime}
              </div>
            </div>

            {/* Voice Waveform */}
            <div className="flex items-center justify-center gap-1.5 h-10 py-2" aria-hidden="true">
              {[0, 140, 280, 100, 220, 320, 80, 180, 260].map((delay, idx) => (
                <span
                  key={idx}
                  style={{ animationDelay: `${delay}ms` }}
                  className="w-1.5 h-7 rounded-full bg-[#86EFAC] animate-voice-bar"
                />
              ))}
            </div>

            <div className="rounded-xl bg-white/10 border border-white/15 p-4 text-sm leading-relaxed text-[#F0FDF4]">
              {callerDialogue[language]}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => speakText(callerDialogue[language], language)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" aria-hidden="true" />
                <span>{language === 'hi' ? 'कॉलर की आवाज़ फिर सुनें' : language === 'mr' ? 'कॉलरचा आवाज पुन्हा ऐका' : 'Replay Caller Voice'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E2E7E1] rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-[#111827]">
              {language === 'hi' ? 'आप इस समय क्या करेंगे?' : language === 'mr' ? 'या वेळी तुम्ही काय कराल?' : 'What will you do right now?'}
            </h3>

            <button
              type="button"
              onClick={() => handleChoice('otp')}
              className="w-full min-h-[54px] px-4 py-3 rounded-xl border border-[#D5DDD3] bg-[#F7F8F5] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] text-left text-sm font-semibold text-[#111827] transition-colors cursor-pointer"
            >
              {language === 'hi'
                ? '1. खाता बचाने के लिए 6-अंकों का OTP बता दें'
                : language === 'mr'
                  ? '1. खाते वाचवण्यासाठी 6-अंकी OTP वाचून दाखवा'
                  : '1. Read out the 6-digit OTP to keep my account open'}
            </button>

            <button
              type="button"
              onClick={() => handleChoice('safe-hangup')}
              className="w-full min-h-[54px] px-4 py-3 rounded-xl border border-[#D5DDD3] bg-[#F7F8F5] hover:bg-[#DCFCE7] hover:border-[#86EFAC] text-left text-sm font-semibold text-[#111827] transition-colors cursor-pointer"
            >
              {language === 'hi'
                ? '2. OTP न बताएं, उनकी आधिकारिक ID पूछें और तुरंत फोन काट दें'
                : language === 'mr'
                  ? '2. OTP सांगू नका, त्यांचा अधिकृत आयडी विचारा आणि लगेच कॉल बंद करा'
                  : '2. Refuse to share OTP, ask for official branch verification & hang up'}
            </button>

            <button
              type="button"
              onClick={() => handleChoice('link')}
              className="w-full min-h-[54px] px-4 py-3 rounded-xl border border-[#D5DDD3] bg-[#F7F8F5] hover:bg-[#FEF3C7] hover:border-[#FCD34D] text-left text-sm font-semibold text-[#111827] transition-colors cursor-pointer"
            >
              {language === 'hi'
                ? '3. उन्होंने जो SMS वेरिफिकेशन लिंक भेजा है, उस पर क्लिक करें'
                : language === 'mr'
                  ? '3. त्यांनी पाठवलेल्या SMS पडताळणी लिंकवर क्लिक करा'
                  : '3. Click the verification link they just sent by SMS'}
            </button>
          </div>
        </div>
      )}

      {stage === 'feedback' && chosenOutcome && (
        <div
          className={`rounded-2xl border p-5 space-y-4 ${
            chosenOutcome === 'safe'
              ? 'bg-[#DCFCE7] border-[#86EFAC]'
              : 'bg-[#FEF3C7] border-[#FCD34D]'
          }`}
        >
          <div className="flex items-start gap-3">
            {chosenOutcome === 'safe' ? (
              <ShieldCheck className="w-8 h-8 text-[#15803D] shrink-0" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-[#B45309] shrink-0" aria-hidden="true" />
            )}
            <div>
              <h3
                className={`text-lg font-extrabold ${
                  chosenOutcome === 'safe' ? 'text-[#15803D]' : 'text-[#B45309]'
                }`}
              >
                {chosenOutcome === 'safe'
                  ? language === 'hi'
                    ? 'सुरक्षित निर्णय! +50 सुरक्षा अंक'
                    : language === 'mr'
                      ? 'सुरक्षित निर्णय! +50 सुरक्षा गुण'
                      : 'Safe Choice! +50 Safety Points'
                  : language === 'hi'
                    ? 'खतरनाक कदम — चलिए इसे सुधारें'
                    : language === 'mr'
                      ? 'धोकादायक पाऊल — चला पुन्हा प्रयत्न करूया'
                      : 'Risky Choice — Let’s Practice Again'}
              </h3>
              <p className="mt-1.5 text-base text-[#111827] leading-relaxed">{feedbackText}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <SpeakButton text={feedbackText} language={language} variant="subtle" />
            {chosenOutcome === 'risky' ? (
              <button
                type="button"
                onClick={() => setStage('active')}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#1A3C2B] text-white font-bold text-sm cursor-pointer"
              >
                {language === 'hi' ? 'फिर से सुरक्षित विकल्प चुनें' : language === 'mr' ? 'पुन्हा सुरक्षित पर्याय निवडा' : 'Try Safe Option'}
              </button>
            ) : (
              <button
                type="button"
                onClick={onBack}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#1A3C2B] text-white font-bold text-sm cursor-pointer"
              >
                {t.practice.backToList}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SIMULATION 2: SUSPICIOUS WHATSAPP / SMS INSPECTOR
   ============================================================ */
export function WhatsAppInspectorSimulator({ language, onComplete, onBack }: SimProps) {
  const t = TRANSLATIONS[language];
  const [spottedFlags, setSpottedFlags] = useState<string[]>([]);
  const [decision, setDecision] = useState<'pay' | 'call' | 'block' | null>(null);

  const toggleFlag = (flagId: string) => {
    setSpottedFlags((prev) => (prev.includes(flagId) ? prev : [...prev, flagId]));
  };

  const flagExplanations: Record<string, Record<Language, string>> = {
    sender: {
      en: 'Red Flag 1: Sent from an unknown personal 10-digit mobile number (+91 93728 41902), not an official electricity board ID.',
      hi: 'खतरा 1: यह संदेश किसी सरकारी ID से नहीं बल्कि एक निजी 10-अंकों के मोबाइल नंबर से आया है।',
      mr: 'धोका 1: हा मेसेज अधिकृत वीज मंडळाच्या ID ऐवजी वैयक्तिक 10-अंकी मोबाईल नंबरवरून आला आहे.',
    },
    urgency: {
      en: 'Red Flag 2: "Disconnected tonight at 9:30 PM" is fake urgency designed to make you panic and act without thinking.',
      hi: 'खतरा 2: "आज रात 9:30 बजे बिजली कटेगी" आपको घबराने के लिए लिखा गया झूठा डर है।',
      mr: 'धोका 2: "आज रात्री 9:30 ला वीज तोडली जाईल" ही तुम्हाला घाबरवण्यासाठी केलेली खोटी घाई आहे.',
    },
    link: {
      en: 'Red Flag 3: "bit.ly/pay-bill-now" is a shortened fake link hiding a malicious site—never mahadiscom.in.',
      hi: 'खतरा 3: "bit.ly/pay-bill-now" एक नकली शॉर्ट लिंक है जो खतरनाक वेबसाइट पर ले जाती है।',
      mr: 'धोका 3: "bit.ly/pay-bill-now" ही बनावट शॉर्ट लिंक असून ती खऱ्या mahadiscom.in ची नाही.',
    },
  };

  const handleDecision = (choice: 'pay' | 'call' | 'block') => {
    setDecision(choice);
    if (choice === 'block') {
      setSpottedFlags(['sender', 'urgency', 'link']);
      onComplete('whatsapp', 50);
    }
  };

  return (
    <div className="space-y-4 pb-6">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#1A3C2B] hover:text-[#285940] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>{t.practice.backToList}</span>
      </button>

      <div className="bg-white border border-[#E2E7E1] rounded-2xl p-4 space-y-2">
        <h2 className="text-lg font-bold text-[#111827]">{t.practice.sim2Title}</h2>
        <p className="text-sm text-[#4B5563]">
          {language === 'hi'
            ? 'नीचे संदेश में संदिग्ध हिस्सों पर टैप करके खतरे पहचानें, फिर अपना सही फैसला चुनें:'
            : language === 'mr'
              ? 'खालील मेसेजमधील संशयास्पद भागांवर टॅप करून धोक्याची चिन्हे ओळखा आणि योग्य निर्णय घ्या:'
              : 'Tap the suspicious parts inside this chat to inspect red flags, then choose your action:'}
        </p>
      </div>

      {/* Realistic WhatsApp Thread Frame */}
      <div className="rounded-2xl overflow-hidden border border-[#CBD4C9] shadow-xs">
        {/* WhatsApp Top Bar */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => toggleFlag('sender')}
            className={`text-left rounded-lg px-2 py-1 transition-colors cursor-pointer ${
              spottedFlags.includes('sender') ? 'bg-[#FEE2E2]/25 ring-2 ring-[#FCA5A5]' : 'hover:bg-white/10'
            }`}
          >
            <div className="text-sm font-bold">+91 93728 41902</div>
            <div className="text-xs text-[#D1FAE5]">Unknown Number · Tap to inspect</div>
          </button>
          <span className="text-xs font-semibold text-[#D1FAE5] tabular-nums">
            {spottedFlags.length}/3 Flags
          </span>
        </div>

        {/* Chat Area */}
        <div className="bg-[#ECE5DD] p-4 space-y-3">
          <div className="bg-white rounded-2xl rounded-tl-xs p-4 shadow-xs space-y-2.5 text-sm text-[#111827] leading-relaxed">
            <button
              type="button"
              onClick={() => toggleFlag('urgency')}
              className={`block w-full text-left p-2 rounded-lg transition-colors cursor-pointer ${
                spottedFlags.includes('urgency')
                  ? 'bg-[#FEE2E2] text-[#991B1B] font-bold ring-1 ring-[#FCA5A5]'
                  : 'bg-[#FEF3C7]/60 hover:bg-[#FEE2E2]/70 font-bold text-[#991B1B]'
              }`}
            >
              URGENT: Your electricity power will be disconnected tonight at 9:30 PM because your bill was not updated.
            </button>

            <p className="px-2">
              Call officer immediately at <strong>9372841902</strong> or pay ₹12 update charge right now:
            </p>

            <button
              type="button"
              onClick={() => toggleFlag('link')}
              className={`block w-full text-left p-2 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer ${
                spottedFlags.includes('link')
                  ? 'bg-[#FEE2E2] text-[#B91C1C] ring-1 ring-[#FCA5A5]'
                  : 'bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#FEE2E2]'
              }`}
            >
              http://bit.ly/pay-bill-now
            </button>
          </div>
        </div>
      </div>

      {/* Spotted Red Flags Reveal */}
      {spottedFlags.length > 0 && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-[#B91C1C]">
            {language === 'hi' ? 'आपने ये खतरे पहचाने:' : language === 'mr' ? 'तुम्ही ओळखलेली धोक्याची चिन्हे:' : 'Red Flags Uncovered:'}
          </div>
          {spottedFlags.map((id) => (
            <p key={id} className="text-sm text-[#7F1D1D] leading-relaxed">
              • {flagExplanations[id][language]}
            </p>
          ))}
        </div>
      )}

      {/* Decision Buttons */}
      <div className="bg-white border border-[#E2E7E1] rounded-2xl p-4 space-y-2.5">
        <h3 className="text-sm font-bold text-[#111827]">
          {language === 'hi' ? 'आप क्या करेंगे?' : language === 'mr' ? 'तुम्ही काय कराल?' : 'Choose your response:'}
        </h3>
        <div className="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            onClick={() => handleDecision('pay')}
            className="min-h-[52px] px-4 py-3 rounded-xl border border-[#D5DDD3] bg-[#F7F8F5] hover:bg-[#FEE2E2] text-left text-sm font-semibold text-[#111827] cursor-pointer"
          >
            {language === 'hi' ? 'अभी ₹12 भर दें ताकि बिजली न कटे' : language === 'mr' ? 'वीज जाऊ नये म्हणून आता ₹12 भरा' : 'Pay ₹12 Now via Link'}
          </button>
          <button
            type="button"
            onClick={() => handleDecision('call')}
            className="min-h-[52px] px-4 py-3 rounded-xl border border-[#D5DDD3] bg-[#F7F8F5] hover:bg-[#FEF3C7] text-left text-sm font-semibold text-[#111827] cursor-pointer"
          >
            {language === 'hi' ? 'संदेश में दिए नंबर पर कॉल करें' : language === 'mr' ? 'मेसेजमधील नंबरवर कॉल करा' : 'Call the Mobile Number Given'}
          </button>
          <button
            type="button"
            onClick={() => handleDecision('block')}
            className="min-h-[52px] px-4 py-3 rounded-xl border border-[#1A3C2B] bg-[#EEF5F0] hover:bg-[#DCFCE7] text-left text-sm font-bold text-[#1A3C2B] cursor-pointer"
          >
            {language === 'hi'
              ? 'सुरक्षा साथी से जांचें और नंबर ब्लॉक कर दें'
              : language === 'mr'
                ? 'सुरक्षा साथीमध्ये तपासा आणि नंबर ब्लॉक करा'
                : 'Check with Suraksha Sathi & Block Sender'}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {decision && (
        <div
          className={`rounded-2xl border p-5 space-y-3 ${
            decision === 'block'
              ? 'bg-[#DCFCE7] border-[#86EFAC]'
              : 'bg-[#FEF3C7] border-[#FCD34D]'
          }`}
        >
          <div className="flex items-start gap-3">
            {decision === 'block' ? (
              <ShieldCheck className="w-7 h-7 text-[#15803D] shrink-0" aria-hidden="true" />
            ) : (
              <ShieldAlert className="w-7 h-7 text-[#B45309] shrink-0" aria-hidden="true" />
            )}
            <div className="space-y-1">
              <div className={`text-base font-extrabold ${decision === 'block' ? 'text-[#15803D]' : 'text-[#B45309]'}`}>
                {decision === 'block'
                  ? language === 'hi'
                    ? 'बहुत बढ़िया! +50 सुरक्षा अंक मिले'
                    : language === 'mr'
                      ? 'उत्कृष्ट! +50 सुरक्षा गुण मिळाले'
                      : 'Spot On! +50 Safety Points Earned'
                  : language === 'hi'
                    ? 'रुकिए! यह एक खतरनाक जाल है'
                    : language === 'mr'
                      ? 'थांबा! हा एक धोकादायक सापळा आहे'
                      : 'Hold On! That’s the Scam Trap'}
              </div>
              <p className="text-sm text-[#111827] leading-relaxed">
                {decision === 'block'
                  ? language === 'hi'
                    ? 'आपने तीनों खतरे पहचान लिए। बिजली विभाग कभी भी निजी मोबाइल नंबर से रात को बिजली काटने की धमकी नहीं देता।'
                    : language === 'mr'
                      ? 'तुम्ही सर्व धोक्याची चिन्हे ओळखली. वीज मंडळ कधीही वैयक्तिक नंबरवरून रात्री वीज कापण्याची धमकी देत नाही.'
                      : 'You spotted the trap cleanly! Electricity boards never threaten same-night disconnection from personal numbers or ask for ₹12 via shortened links.'
                  : decision === 'pay'
                    ? language === 'hi'
                      ? '₹12 के लिंक पर कार्ड या UPI जानकारी भरते ही ठग आपके खाते से हजारों रुपये निकाल लेते हैं। सुरक्षित विकल्प चुनकर फिर से देखें।'
                      : language === 'mr'
                        ? '₹12 च्या लिंकवर कार्ड किंवा UPI माहिती भरताच ठग खात्यातून हजारो रुपये काढतात. आता सुरक्षित पर्याय निवडा.'
                        : 'Paying ₹12 on a fake link steals your card or UPI credentials so scammers can drain your entire account. Try tapping "Check with Suraksha Sathi & Block Sender"!'
                    : language === 'hi'
                      ? 'उस नंबर पर कॉल करने पर ठग आपसे "QuickSupport" जैसा ऐप डाउनलोड करवाते हैं जिससे उन्हें आपका फोन दिखने लगता है। कभी कॉल न करें!'
                      : language === 'mr'
                        ? 'त्या नंबरवर कॉल केल्यास ठग तुम्हाला "QuickSupport" सारखे ॲप डाउनलोड करायला लावतात. कधीही कॉल करू नका!'
                        : 'Calling that personal number connects you to a fraudster who will try to install a screen-sharing app on your phone. Always block instead!'}
              </p>
            </div>
          </div>

          {decision === 'block' && (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#1A3C2B] text-white font-bold text-sm cursor-pointer"
            >
              {t.practice.backToList}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SIMULATION 3: MOCK BANKING & UPI SAFE SANDBOX
   ============================================================ */
export function UpiSandboxSimulator({ language, onComplete, onBack }: SimProps) {
  const t = TRANSLATIONS[language];
  const [state, setState] = useState<'request' | 'pin-trap' | 'declined'>('request');

  const handleDecline = () => {
    setState('declined');
    onComplete('upi', 50);
  };

  return (
    <div className="space-y-4 pb-6">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#1A3C2B] hover:text-[#285940] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>{t.practice.backToList}</span>
      </button>

      <div className="bg-white border border-[#E2E7E1] rounded-2xl p-4">
        <h2 className="text-lg font-bold text-[#111827]">{t.practice.sim3Title}</h2>
        <p className="mt-1 text-sm text-[#4B5563]">
          {language === 'hi'
            ? 'यह सुरक्षित नकली UPI स्क्रीन है। कोई असली पैसा नहीं कटेगा—सीखें कि असली "पैसे पाना" और "पैसे देना" कैसा दिखता है।'
            : language === 'mr'
              ? 'ही सुरक्षित सराव UPI स्क्रीन आहे. कोणतेही खरे पैसे कापले जाणार नाहीत—पैसे येणे आणि जाणे यातील फरक शिका.'
              : 'Zero-risk practice UPI screen. Notice carefully whether this request gives you money or takes money away.'}
        </p>
      </div>

      {/* Mock UPI Request Screen */}
      <div className="bg-white border-2 border-[#CBD4C9] rounded-3xl overflow-hidden shadow-xs">
        <div className="bg-[#1E293B] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#CBD5E1]">Mock UPI Practice App</div>
            <div className="text-base font-bold">Payment Collect Request</div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E] text-xs font-bold">
            PRACTICE
          </span>
        </div>

        <div className="p-5 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
            <IndianRupee className="w-8 h-8" aria-hidden="true" />
          </div>

          <div>
            <div className="text-xs font-semibold text-[#4B5563]">
              From: <strong className="text-[#111827]">FESTIVAL.REWARD@OKUPI</strong>
            </div>
            <div className="mt-1 text-3xl font-extrabold text-[#111827] tabular-nums">₹5,000</div>
            <div className="mt-2 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] px-3.5 py-2 text-sm font-semibold text-[#92400E]">
              “You won ₹5,000 Senior Cashback! Tap Pay & enter your UPI PIN to receive money.”
            </div>
          </div>

          {/* Visual Clue Comparison */}
          <div className="text-left rounded-xl bg-[#F7F8F5] border border-[#E2E7E1] p-3.5 text-xs text-[#374151] space-y-1">
            <div className="font-bold text-[#1A3C2B]">
              {language === 'hi' ? 'ध्यान देने योग्य संकेत:' : language === 'mr' ? 'लक्ष देण्याचा मुद्दा:' : 'Look closely at the wording:'}
            </div>
            <p>
              • The screen says <strong>“Pay ₹5,000”</strong> and asks for your <strong>UPI PIN</strong>.
            </p>
            <p>
              • Real money coming IN to your account appears automatically—it NEVER asks for your PIN.
            </p>
          </div>

          {state === 'request' && (
            <div className="grid grid-cols-1 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setState('pin-trap')}
                className="w-full min-h-[54px] px-4 py-3 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] text-[#1E3A8A] font-bold text-sm cursor-pointer"
              >
                {language === 'hi'
                  ? '₹5,000 पाने के लिए UPI PIN डालें'
                  : language === 'mr'
                    ? '₹5,000 मिळवण्यासाठी UPI PIN टाका'
                    : 'Enter UPI PIN to Receive ₹5,000'}
              </button>

              <button
                type="button"
                onClick={handleDecline}
                className="w-full min-h-[54px] px-4 py-3 rounded-xl bg-[#1A3C2B] hover:bg-[#285940] text-white font-bold text-base cursor-pointer"
              >
                {language === 'hi'
                  ? 'रिक्वेस्ट अस्वीकार करें (Decline)'
                  : language === 'mr'
                    ? 'विनंती नाकारा (Decline Request)'
                    : 'Decline Request'}
              </button>
            </div>
          )}

          {state === 'pin-trap' && (
            <div className="rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] p-4 text-left space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-6 h-6 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-extrabold text-[#B91C1C]">
                    {language === 'hi'
                      ? 'रुकिए! यही असली UPI जाल है!'
                      : language === 'mr'
                        ? 'थांबा! हाच खरा UPI सापळा आहे!'
                        : 'STOP! You Caught the UPI PIN Trap!'}
                  </h3>
                  <p className="mt-1 text-sm text-[#7F1D1D] leading-relaxed">
                    {language === 'hi'
                      ? 'यदि आप यहां अपना UPI PIN डालते, तो ₹5,000 मिलने के बजाय आपके खाते से ₹5,000 कट जाते! याद रखें: पैसे पाने के लिए कभी PIN नहीं लगता।'
                      : language === 'mr'
                        ? 'तुम्ही येथे UPI PIN टाकला असता तर ₹5,000 मिळण्याऐवजी तुमच्या खात्यातून ₹5,000 कापले गेले असते! लक्षात ठेवा: पैसे घेण्यासाठी कधीही PIN लागत नाही.'
                        : 'If you entered your UPI PIN here, ₹5,000 would be DEDUCTED from your bank account—NOT added! You NEVER enter a UPI PIN to receive money.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDecline}
                className="w-full min-h-[52px] px-4 py-3 rounded-xl bg-[#1A3C2B] text-white font-bold text-sm cursor-pointer"
              >
                {language === 'hi'
                  ? 'अब सुरक्षित रूप से "Decline" दबाएं'
                  : language === 'mr'
                    ? 'आता सुरक्षितपणे "Decline" दाबा'
                    : 'Now Tap "Decline Request" Safely'}
              </button>
            </div>
          )}

          {state === 'declined' && (
            <div className="rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] p-4 text-left space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-7 h-7 text-[#15803D] shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-extrabold text-[#15803D] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {language === 'hi'
                        ? 'शाबाश! आपने ₹5,000 बचा लिए (+50 अंक)'
                        : language === 'mr'
                          ? 'शाब्बास! तुम्ही ₹5,000 वाचवले (+50 गुण)'
                          : 'Well Done! You Saved ₹5,000 (+50 Points)'}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-[#14532D] leading-relaxed">
                    {language === 'hi'
                      ? 'आपने सुनहरा नियम सीख लिया: UPI PIN केवल पैसे भेजने के लिए होता है, पैसे पाने के लिए कभी नहीं।'
                      : language === 'mr'
                        ? 'तुम्ही सुवर्ण नियम शिकलात: UPI PIN फक्त पैसे पाठवण्यासाठी असतो, पैसे मिळवण्यासाठी कधीही नाही.'
                        : 'You mastered the Golden UPI Rule: UPI PIN is ONLY for paying money out, NEVER for receiving cashback or refunds.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#1A3C2B] text-white font-bold text-sm cursor-pointer"
              >
                {t.practice.backToList}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
