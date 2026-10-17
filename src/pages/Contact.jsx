import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Check, User, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { apiClient, API_ENDPOINTS } from '../config';

export const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please complete all required fields.', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiClient.post(API_ENDPOINTS.INQUIRIES.BASE, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      });

      setSubmitted(true);
      addToast(
        res?.message || 'Your royal consultation request has been received. Our concierge will contact you shortly.',
        'success'
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err) {
      addToast(err.message || 'Failed to submit consultation inquiry. Please try again or WhatsApp us directly.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Page Hero Banner */}
      <PageHeroBanner
        breadcrumb="Contact"
        titleLine1="Royal Concierge"
        titleLine2="& Flagship Studio"
        description="We are at your gracious service. Book a private styling consultation, inquire about customized bridal trousseau sets, or consult our master couturiers."
        modelImage="/images/06_product_5.jpg"
        modelAlt="Royal Concierge Atelier"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Info & Studio */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#09231A] text-stone-200 rounded-3xl p-8 border border-[#D4AF37]/35 shadow-xl space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#F7E7BE]">
              Flagship Couture Studio
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Step into our flagship sanctuary in New Delhi to touch our handwoven fabrics, preview exclusive unreleased drapes, and experience bespoke fitting sessions.
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Contact Person</strong>
                  <span className="text-[#F7E7BE] font-medium">Pooja Vishwakarma</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Concierge Line</strong>
                  <a
                    href="tel:+919116863306"
                    className="hover:text-[#F7E7BE] transition-colors"
                  >
                    +91 9116863306
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Direct Email</strong>
                  <a
                    href="mailto:pooja.vishwakarma84@gmail.com"
                    className="hover:text-[#F7E7BE] transition-colors break-all"
                  >
                    pooja.vishwakarma84@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Address</strong>
                  <span>Saisaa Mansion, 42 Heritage Boulevard, New Delhi, 110003</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Visiting Hours</strong>
                  <span>Tuesday &ndash; Sunday: 11:00 AM &ndash; 8:00 PM (By Appointment)</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct */}
            <div className="pt-4 border-t border-white/10">
              <a
                href="https://wa.me/919116863306"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Consultation</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Appointment & Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/25 shadow-md">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#18523D] flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Appointment Requested
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Thank you for reaching out to Saisaa. Our head stylist will connect with you within 4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold uppercase tracking-wider text-[#18523D] underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Book A Private Consultation
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Fill out the form below and our styling team will curate a bespoke viewing for you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Your Message or Trousseau Preferences
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the occasion, color palette, or specific silhouettes you envision..."
                      className="w-full text-xs p-3.5 rounded-lg border border-stone-300 focus:outline-none focus:border-[#09231A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#09231A] hover:bg-[#103B2C] text-[#F7E7BE] hover:text-white py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#D4AF37]/50 shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#D4AF37]" />
                      <span>Submit Consultation Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
