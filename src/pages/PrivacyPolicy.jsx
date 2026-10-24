import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Mail,
  Phone,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen text-[#1E2922] pb-20">
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden bg-[#0A291E] text-stone-100 border-b border-[#D4AF37]/25 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F7E7BE] text-xs uppercase tracking-widest font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Royal Patronage & Trust</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F7E7BE] tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Privacy Policy
          </h1>
          <p className="mt-3 text-stone-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            At SAISAA, safeguarding your personal dignity, confidential consultations, and shopping security is our sacred commitment.
          </p>
          <p className="text-xs text-[#D4AF37] font-mono mt-3">
            Last Updated: October 2026 &bull; Saisaa Haute Couture
          </p>
        </div>
      </section>

      {/* 2. Quick Assurance Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/25 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#0A291E] text-[#D4AF37] rounded-xl shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm">256-Bit SSL Encryption</h3>
              <p className="text-xs text-stone-600 mt-1">All payment rail transactions and checkout credentials are encrypted end-to-end.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/25 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#0A291E] text-[#D4AF37] rounded-xl shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm">Zero Third-Party Data Selling</h3>
              <p className="text-xs text-stone-600 mt-1">Your identity, contact numbers, and bespoke measurements are never sold or rented.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/25 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#0A291E] text-[#D4AF37] rounded-xl shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm">7-Day Return & Exchange</h3>
              <p className="text-xs text-stone-600 mt-1">Full peace of mind with our 7-day hassle-free return and exchange guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Policy Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
        
        {/* Section 1: Introduction */}
        <section className="bg-white p-7 sm:p-9 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#0A291E]">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              1. Introduction & Scope
            </h2>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed font-light">
            Welcome to <strong>SAISAA</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We celebrate the heritage of bespoke Indian couture, handcrafted suits, royal sarees, and luxury unstitched fabrics. This Privacy Policy details how we collect, handle, protect, and process your personal information when you visit our storefront at <strong>saisaa.in</strong> or purchase our artisanal creations.
          </p>
          <p className="text-sm text-stone-700 leading-relaxed font-light">
            By engaging with our platform, submitting consultation inquiries, or completing an order, you agree to the collection and handling of your data in accordance with this Privacy Statement and applicable Indian Information Technology (IT) laws.
          </p>
        </section>

        {/* Section 2: Data We Collect */}
        <section className="bg-white p-7 sm:p-9 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#0A291E]">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              2. Information We Collect
            </h2>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed font-light">
            To deliver an authentic, high-touch luxury atelier experience, we may collect the following details:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A291E]">Patron Profile Data</h4>
              <p className="text-xs text-stone-600 mt-1">Full name, email address, contact phone number, and account credentials.</p>
            </div>
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A291E]">Delivery & Billing</h4>
              <p className="text-xs text-stone-600 mt-1">Shipping destination, residence address, postal pin code, and order consignment records.</p>
            </div>
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A291E]">Bespoke Measurements</h4>
              <p className="text-xs text-stone-600 mt-1">Bespoke sizing, tailor fitting preferences, neckline choices, and consultation notes.</p>
            </div>
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A291E]">Transaction Telemetry</h4>
              <p className="text-xs text-stone-600 mt-1">Order value, payment mode (UPI, Card, NetBanking, COD), and transaction reference IDs.</p>
            </div>
          </div>
        </section>

        {/* Section 3: How We Use Information */}
        <section className="bg-white p-7 sm:p-9 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#0A291E]">
            <Eye className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              3. Purpose & Use of Personal Data
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-stone-700 font-light">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
              <span><strong>Order Fulfillment:</strong> Processing transactions, preparing artisanal packaging, and dispatching via insured courier partners across India.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
              <span><strong>7-Day Returns & Exchanges:</strong> Authenticating exchange claims, verifying return pickup eligibility within 7 calendar days, and executing refunds.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
              <span><strong>Concierge Support:</strong> Responding to bespoke bridal consultations, sizing questions, and ceremonial order inquiries.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
              <span><strong>Account Security:</strong> Preventing fraudulent transactions and ensuring authorized access to patron order histories.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Return & Exchange Guarantee Link */}
        <section className="bg-gradient-to-r from-[#0A291E] to-[#124233] text-stone-100 p-7 sm:p-9 rounded-2xl border border-[#D4AF37]/40 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">Customer Assurance</span>
              <h3 className="font-serif text-xl font-bold text-[#F7E7BE] mt-1">
                7-Day Return & Exchange Promise
              </h3>
              <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
                We take utmost pride in our master craftsmanship. If your garment does not meet your expectations, return or exchange it seamlessly within 7 calendar days.
              </p>
            </div>
            <Link
              to="/return-exchange-policy"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#09231A] font-semibold text-xs tracking-wider uppercase hover:bg-[#F7E7BE] transition-all shadow-md shrink-0"
            >
              <span>View Return Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Section 5: Data Security & Storage */}
        <section className="bg-white p-7 sm:p-9 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#0A291E]">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              4. Payment Protection & Data Security
            </h2>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed font-light">
            We partner with RBI-authorized payment gateways (such as Razorpay, UPI Rails, and Visa/Mastercard/RuPay networks). We <strong>never</strong> store your raw debit card, credit card CVV, or banking passwords on our servers.
          </p>
          <p className="text-sm text-stone-700 leading-relaxed font-light">
            Our infrastructure incorporates modern firewalls, SSL/TLS encryption, and strict role-based access control to prevent unauthorized access or disclosure of patron identities.
          </p>
        </section>

        {/* Section 6: Contact Our Concierge */}
        <section className="bg-white p-7 sm:p-9 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#0A291E]">
            <Mail className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              5. Contact Our Privacy Concierge
            </h2>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed font-light">
            If you have questions regarding this Privacy Statement, wish to update your stored patron details, or request account data erasure, please connect with our team:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <a
              href="mailto:pooja.vishwakarma84@gmail.com"
              className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 bg-[#FAF6F0] hover:border-[#D4AF37] transition-all"
            >
              <Mail className="w-5 h-5 text-[#D4AF37]" />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">Email Us</span>
                <span className="text-stone-600 break-all">pooja.vishwakarma84@gmail.com</span>
              </div>
            </a>
            <a
              href="tel:+919116863306"
              className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 bg-[#FAF6F0] hover:border-[#D4AF37] transition-all"
            >
              <Phone className="w-5 h-5 text-[#D4AF37]" />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">Phone / WhatsApp</span>
                <span className="text-stone-600">+91 9116863306</span>
              </div>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
};
