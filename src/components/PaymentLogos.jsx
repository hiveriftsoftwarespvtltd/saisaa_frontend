import React from 'react';

// 1. Official UPI (Unified Payments Interface) Logo
export const UpiLogo = ({ className = 'h-5 w-auto' }) => (
  <svg className={className} viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 20L15 4H7.5L0.5 20H8Z" fill="#097939" />
    <path d="M16 4L9 20H16.5L23.5 4H16Z" fill="#ED7524" />
    <text x="27" y="18" fill="#2E3192" fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="16" letterSpacing="-0.5">
      UPI
    </text>
  </svg>
);

// 2. Google Pay (GPay) Official Badge
export const GPayLogo = ({ className = 'h-5 w-auto' }) => (
  <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 bg-white rounded border border-stone-200 shadow-2xs ${className}`}>
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
    </svg>
    <span className="text-[10px] font-bold tracking-tight text-stone-700">Pay</span>
  </div>
);

// 3. PhonePe Official Brand Badge
export const PhonePeLogo = ({ className = 'h-5 w-auto' }) => (
  <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#5f259f] text-white rounded border border-[#5f259f] shadow-2xs ${className}`}>
    <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shrink-0">
      <span className="text-[#5f259f] font-bold text-[9px] leading-none" style={{ fontFamily: 'sans-serif' }}>
        पे
      </span>
    </div>
    <span className="text-[10px] font-bold tracking-tight text-white">PhonePe</span>
  </div>
);

// 4. Paytm Official Brand Badge
export const PaytmLogo = ({ className = 'h-5 w-auto' }) => (
  <div className={`inline-flex items-center px-1.5 py-0.5 bg-white rounded border border-stone-200 shadow-2xs ${className}`}>
    <span className="text-[10px] font-extrabold tracking-tight text-[#002970]">Pay</span>
    <span className="text-[10px] font-extrabold tracking-tight text-[#00BAF2]">tm</span>
  </div>
);

// 5. Visa Official Card Logo
export const VisaLogo = ({ className = 'h-5 w-auto' }) => (
  <div className={`inline-flex items-center px-1.5 py-0.5 bg-white rounded border border-stone-200 shadow-2xs ${className}`}>
    <span className="text-[11px] font-black italic tracking-wider text-[#1A1F71]" style={{ fontFamily: "'Arial Black', sans-serif" }}>
      VISA
    </span>
  </div>
);

// 6. Mastercard Official Interlocking Circles Logo
export const MastercardLogo = ({ className = 'h-5 w-auto' }) => (
  <div className={`inline-flex items-center px-1.5 py-0.5 bg-white rounded border border-stone-200 shadow-2xs ${className}`}>
    <div className="relative flex items-center w-5 h-3">
      <div className="w-3 h-3 rounded-full bg-[#EB001B] opacity-90" />
      <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-90 -ml-1.5" />
    </div>
  </div>
);

// 7. RuPay Official Card Logo
export const RuPayLogo = ({ className = 'h-5 w-auto' }) => (
  <div className={`inline-flex items-center px-1.5 py-0.5 bg-white rounded border border-stone-200 shadow-2xs ${className}`}>
    <span className="text-[10px] font-black tracking-tight text-[#005B9C]">Ru</span>
    <span className="text-[10px] font-black tracking-tight text-[#ED7524]">Pay</span>
  </div>
);

// 8. Razorpay Official Co-Branding Badge
export const RazorpayBadge = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0A261C] text-[#F7E7BE] rounded-lg border border-[#D4AF37]/40 shadow-xs ${className}`}>
    {/* Razorpay Lightning Bolt Glyph */}
    <svg className="w-3.5 h-3.5 shrink-0 text-[#0284C7]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.8 1.5L4 13.5h6.4L7.5 22.5 20 10.5h-7.2l3.2-9z" />
    </svg>
    <div className="flex items-center gap-1 text-[11px]">
      <span className="font-light text-stone-300">Secured by</span>
      <span className="font-extrabold tracking-tight text-white">Razorpay</span>
    </div>
  </div>
);
