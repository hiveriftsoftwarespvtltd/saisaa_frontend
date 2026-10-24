import React from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  RefreshCw,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Mail,
  Phone,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';

export const ReturnExchangePolicy = () => {
  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen text-[#1E2922] pb-20">
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden bg-[#0A291E] text-stone-100 border-b border-[#D4AF37]/25 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F7E7BE] text-xs uppercase tracking-widest font-semibold mb-4">
            <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
            <span>7-Day Royal Assurance</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F7E7BE] tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Return & Exchange Policy
          </h1>
          <p className="mt-3 text-stone-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Your ceremonial elegance and complete satisfaction are our highest priority. Enjoy seamless 7-day returns and exchanges across India.
          </p>
        </div>
      </section>

      {/* 2. Dual Guarantee Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Return within 7 Days */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#D4AF37]/40 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#0A291E] text-[#D4AF37] rounded-xl shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  Risk-Free Trial
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Return within 7 Days
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              If your chosen unstitched suit, kurti, or saree is not everything you envisioned, you can request a return within <strong>7 calendar days</strong> from the date of confirmed delivery.
            </p>
            <ul className="space-y-2 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Doorstep reverse pickup arranged across 24,000+ PIN codes in India.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% refund processed back to source account (UPI/Card) or Store Credit.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fast refund execution within 3 to 5 business days after quality check.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Exchange within 7 Days */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#D4AF37]/40 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#0A291E] text-[#D4AF37] rounded-xl shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  Perfect Fit Guarantee
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Exchange within 7 Days
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Need a different size or want to exchange for a different colorway? Request an exchange within <strong>7 calendar days</strong> of package arrival with zero additional reverse shipping fees.
            </p>
            <ul className="space-y-2 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complimentary reverse pickup from your home or office address.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Replacement item reserved immediately upon exchange initiation.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Personal assistance from our master tailoring consultants if needed.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Return & Exchange Step-by-Step Procedure */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-10">
        
        {/* Step-by-Step Guide */}
        <section className="bg-white p-7 sm:p-9 rounded-2xl border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 text-[#0A291E]">
            <PackageCheck className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              How to Initiate a Return or Exchange
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0A291E] text-[#D4AF37] font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Submit Request</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Log in to your <strong>Account &rarr; Orders</strong> portal, or simply WhatsApp our concierge with your Order ID (#SAI...) within 7 days.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0A291E] text-[#D4AF37] font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Reverse Pickup</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our logistics associate will inspect and pick up the securely packaged apparel with all tags intact within 24 to 48 hours.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0A291E] text-[#D4AF37] font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Refund or Exchange</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Upon quick atelier verification, the replacement piece is dispatched or your refund is credited within 3–5 working days.
              </p>
            </div>
          </div>
        </section>

        {/* Eligibility Criteria & Conditions */}
        <section className="bg-white p-7 sm:p-9 rounded-2xl border border-stone-200/80 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 text-[#0A291E]">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Condition & Eligibility Guidelines
            </h2>
          </div>

          <div className="space-y-3 text-sm text-stone-700 font-light leading-relaxed">
            <p>
              To maintain the highest hygiene and preservation standards for our handloom silks and intricate embroidery, return or exchange items must meet the following conditions:
            </p>
            <ul className="space-y-2.5 text-xs text-stone-700 pt-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>The garment must be unworn, unwashed, unaltered, and completely free of perfumes or makeup marks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>All original SAISAA brand tags, fabric care labels, and authenticity seals must be firmly attached.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>The product must be returned in its original ceremonial box or garment packaging.</span>
              </li>
            </ul>
          </div>

          {/* Exceptions Box */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Non-Returnable Items</span>
            </div>
            <p className="text-xs text-amber-950 font-light leading-relaxed">
              Garments tailored with <strong>Custom Sizing / Bespoke Stitching</strong> made specifically to your personal body measurements, altered pieces, and promotional final clearance pieces are crafted uniquely for you and cannot be returned for a cash refund. However, free fitting alterations are always provided.
            </p>
          </div>
        </section>

        {/* Section: Need Help Concierge */}
        <section className="bg-white p-7 sm:p-9 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#0A291E]">
            <Clock className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Need Immediate Return or Exchange Assistance?
            </h2>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed font-light">
            Our luxury care team is at your service 7 days a week from 10:00 AM to 8:00 PM IST:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <a
              href="https://wa.me/919116863306?text=Hi%20Saisaa,%20I%20would%20like%20to%20request%20a%20return/exchange."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 bg-[#FAF6F0] hover:border-[#D4AF37] transition-all"
            >
              <Phone className="w-5 h-5 text-[#D4AF37]" />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">WhatsApp Care Concierge</span>
                <span className="text-stone-600">+91 9116863306</span>
              </div>
            </a>
            <a
              href="mailto:pooja.vishwakarma84@gmail.com?subject=Return/Exchange%20Request"
              className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 bg-[#FAF6F0] hover:border-[#D4AF37] transition-all"
            >
              <Mail className="w-5 h-5 text-[#D4AF37]" />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">Email Support</span>
                <span className="text-stone-600 break-all">pooja.vishwakarma84@gmail.com</span>
              </div>
            </a>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-stone-100 text-xs">
            <Link
              to="/privacy-policy"
              className="text-[#0A291E] font-bold hover:underline flex items-center gap-1.5"
            >
              <span>Read our Privacy Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/contact"
              className="text-stone-500 hover:text-stone-900"
            >
              Contact Atelier
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
};
