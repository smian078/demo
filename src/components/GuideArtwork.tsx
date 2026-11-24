import { useState } from 'react';

interface GuideArtworkProps {
  artworkKey: 'kyc' | 'lottery' | 'arrest' | 'upi';
  imageSrc?: string;
  alt: string;
}

export function GuideArtwork({ artworkKey, imageSrc, alt }: GuideArtworkProps) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imageSrc && !imgFailed) {
    return (
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F8F5] border border-[#E2E7E1]">
        <img
          src={imageSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F3F5EF] border border-[#E2E7E1] flex items-center justify-center"
    >
      {artworkKey === 'kyc' && (
        <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
          <rect width="320" height="240" fill="#F3F5EF" />
          <circle cx="160" cy="124" r="82" fill="#E4ECE3" />
          <ellipse cx="86" cy="176" rx="28" ry="12" fill="#C7D7C5" />
          <ellipse cx="234" cy="172" rx="24" ry="10" fill="#C7D7C5" />
          {/* Smartphone */}
          <rect x="116" y="42" width="88" height="154" rx="16" fill="#FFFFFF" stroke="#1A3C2B" strokeWidth="4" />
          <rect x="145" y="52" width="30" height="4" rx="2" fill="#CBD5CC" />
          {/* Blocked OTP dots */}
          <rect x="129" y="74" width="62" height="26" rx="8" fill="#FEE2E2" />
          <circle cx="144" cy="87" r="4" fill="#B91C1C" />
          <circle cx="160" cy="87" r="4" fill="#B91C1C" />
          <circle cx="176" cy="87" r="4" fill="#B91C1C" />
          {/* Shield */}
          <path
            d="M160 112L196 126V154C196 178 180 196 160 204C140 196 124 178 124 154V126L160 112Z"
            fill="#1A3C2B"
          />
          <path
            d="M148 158L156 166L174 146"
            stroke="#DCFCE7"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {artworkKey === 'lottery' && (
        <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
          <rect width="320" height="240" fill="#F3F5EF" />
          <circle cx="160" cy="122" r="80" fill="#F6ECD6" />
          <rect x="108" y="96" width="96" height="84" rx="12" fill="#EAB308" />
          <rect x="148" y="96" width="16" height="84" fill="#B45309" />
          <rect x="102" y="78" width="108" height="24" rx="8" fill="#FACC15" />
          <circle cx="182" cy="118" r="44" fill="#FFFFFF" fillOpacity="0.88" stroke="#1A3C2B" strokeWidth="8" />
          <path d="M182 98V122" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
          <circle cx="182" cy="136" r="4.5" fill="#B45309" />
          <path d="M214 150L244 180" stroke="#1A3C2B" strokeWidth="12" strokeLinecap="round" />
        </svg>
      )}

      {artworkKey === 'arrest' && (
        <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
          <rect width="320" height="240" fill="#F3F5EF" />
          <circle cx="160" cy="120" r="82" fill="#E4ECE3" />
          {/* Fake video call card */}
          <rect x="78" y="50" width="108" height="142" rx="16" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="3.5" />
          <circle cx="132" cy="96" r="22" fill="#E5E7EB" />
          <path d="M104 146C104 131 116 122 132 122C148 122 160 131 160 146" fill="#D1D5DB" />
          {/* Hang up red button */}
          <circle cx="132" cy="168" r="14" fill="#B91C1C" />
          <path d="M124 168H140" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          {/* Protective Forest Green Shield in foreground */}
          <path
            d="M210 74L254 90V128C254 158 234 180 210 190C186 180 166 158 166 128V90L210 74Z"
            fill="#1A3C2B"
            stroke="#F3F5EF"
            strokeWidth="5"
          />
          <path
            d="M196 132L206 142L226 118"
            stroke="#DCFCE7"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {artworkKey === 'upi' && (
        <svg viewBox="0 0 320 240" className="w-full h-full" fill="none">
          <rect width="320" height="240" fill="#F3F5EF" />
          <circle cx="160" cy="122" r="82" fill="#E4ECE3" />
          {/* Bank columns */}
          <path d="M78 106L160 60L242 106H78Z" fill="#285940" />
          <rect x="88" y="106" width="144" height="72" rx="6" fill="#FFFFFF" stroke="#1A3C2B" strokeWidth="3" />
          <rect x="104" y="118" width="14" height="46" rx="4" fill="#D5E3D6" />
          <rect x="153" y="118" width="14" height="46" rx="4" fill="#D5E3D6" />
          <rect x="202" y="118" width="14" height="46" rx="4" fill="#D5E3D6" />
          {/* Foreground Green Check Shield */}
          <circle cx="218" cy="158" r="34" fill="#1A3C2B" stroke="#F3F5EF" strokeWidth="5" />
          <path
            d="M204 158L214 168L234 146"
            stroke="#DCFCE7"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
