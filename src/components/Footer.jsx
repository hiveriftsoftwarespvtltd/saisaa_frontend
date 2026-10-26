import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, User } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#061A13] text-stone-300 border-t border-[#D4AF37]/25">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

          {/* Column 1: Brand & Laurel Emblem (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.25)] shrink-0">
                <img
                  src="/saisaa-logo.jpg"
                  alt="Saisaa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-2xl font-bold tracking-normal text-[#F7E7BE] leading-none group-hover:text-white transition-colors"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Saisaa
                </span>
                <span
                  className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mt-1"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                
                </span>
              </div>
            </Link>

            <div className="space-y-1">
              <h4 className="font-serif text-sm sm:text-base text-[#F7E7BE]/85 italic tracking-wide">
                More Than Fashion &bull; Heritage Atelier
              </h4>
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-semibold text-[#F7E7BE] tracking-wider uppercase font-serif">
              Collections
            </h4>
            <ul className="space-y-3 text-sm tracking-wide text-stone-300">
              <li>
                <Link to="/stitched-suits" className="hover:text-[#F7E7BE] transition-colors">Stitched Suits</Link>
              </li>
              <li>
                <Link to="/unstitched-suits" className="hover:text-[#F7E7BE] transition-colors">Unstitched Suits</Link>
              </li>
              <li>
                <Link to="/sarees" className="hover:text-[#F7E7BE] transition-colors">Royal Sarees</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#F7E7BE] transition-colors">All Creations</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F7E7BE] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-semibold text-[#F7E7BE] tracking-wider uppercase font-serif">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm tracking-wide text-stone-300">
              <li>
                <Link to="/return-exchange-policy" className="hover:text-[#F7E7BE] transition-colors font-medium text-[#F7E7BE]">
                  Return within 7 days
                </Link>
              </li>
              <li>
                <Link to="/return-exchange-policy" className="hover:text-[#F7E7BE] transition-colors font-medium text-[#F7E7BE]">
                  Exchange within 7 days
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#F7E7BE] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F7E7BE] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#F7E7BE] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">
                  Contact Us & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get In Touch (3 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-base font-semibold text-[#F7E7BE] tracking-wider uppercase font-serif">
              Get In Touch
            </h4>
            <div className="space-y-3.5 text-sm text-stone-300">
              <div className="flex items-center gap-3">
                <User className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
                <span className="text-[#F7E7BE] font-medium">Pooja Vishwakarma</span>
              </div>

              <a
                href="tel:+919116863306"
                className="flex items-center gap-3 hover:text-[#F7E7BE] transition-colors"
              >
                <Phone className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
                <span>+91 9116863306</span>
              </a>

              <a
                href="mailto:pooja.vishwakarma84@gmail.com"
                className="flex items-center gap-3 hover:text-[#F7E7BE] transition-colors break-all"
              >
                <Mail className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
                <span>pooja.vishwakarma84@gmail.com</span>
              </a>

              <div className="flex items-center gap-3">
                <MapPin className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Icons & WhatsApp Group */}
            <div className="flex flex-col space-y-3 pt-2 text-[#E8D49E]">
              <div className="flex items-center space-x-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/people/Saisaa-Fashion/61595840763742/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#09231A] transition-all"
                  aria-label="Facebook"
                  title="Follow us on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/saisaafashion/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#09231A] transition-all"
                  aria-label="Instagram"
                  title="Follow us on Instagram"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* WhatsApp Group */}
                <a
                  href="https://chat.whatsapp.com/G56JCjc5K4BIIoCZc5cZ5C?s=sw&p=a&mlu=4&ilr=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all"
                  aria-label="Join WhatsApp Group"
                  title="Join our WhatsApp Group"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              </div>

              {/* Direct Group Invite Pill */}
              <a
                href="https://chat.whatsapp.com/G56JCjc5K4BIIoCZc5cZ5C?s=sw&p=a&mlu=4&ilr=4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold tracking-wide transition-all w-fit"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Join WhatsApp Group &rarr;</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-6 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-stone-400 gap-3">
          <p className="tracking-wide">
            &copy; 2026 Saisaa &bull; More Than Fashion
          </p>
          <div className="flex items-center flex-wrap gap-4 tracking-wide">
            <Link to="/privacy-policy" className="hover:text-[#F7E7BE] transition-colors">Privacy Policy</Link>
            <span className="text-stone-600">|</span>
            <Link to="/return-exchange-policy" className="hover:text-[#F7E7BE] transition-colors">Return within 7 days</Link>
            <span className="text-stone-600">|</span>
            <Link to="/return-exchange-policy" className="hover:text-[#F7E7BE] transition-colors">Exchange within 7 days</Link>
            <span className="text-stone-600">|</span>
            <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
